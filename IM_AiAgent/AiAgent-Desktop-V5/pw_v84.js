// v84: tab 切换时滚到激活位置 + tab title hover 提示
const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({
    executablePath: '/Users/michael/Library/Caches/ms-playwright/chromium_headless_shell-1228/chrome-headless-shell-mac-arm64/chrome-headless-shell',
    headless: true,
    args: ['--no-sandbox', '--disable-dev-shm-usage'],
  });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  const errs = [];
  page.on('pageerror', (e) => errs.push('pageerror: ' + e.message));
  page.on('console', (m) => { if (m.type() === 'error') errs.push('console.error: ' + m.text()); });

  await page.goto('http://localhost:8344/messages.html', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);

  const results = [];
  const pass = (n) => results.push('✅ ' + n);
  const fail = (n, why) => results.push('❌ ' + n + (why ? '  · ' + why : ''));

  // 1. 10 个 tab 都有 title 属性（off 模式显示 7 个，但所有都设了）
  const allTitles = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('.ai-tab')).map(t => ({
      tab: t.dataset.tab,
      hasTitle: !!t.getAttribute('title'),
      title: t.getAttribute('title')
    }));
  });
  const allHaveTitle = allTitles.every(t => t.hasTitle);
  if (allHaveTitle) pass('1. 10 个 tab 都有 title 属性');
  else fail('1. title 缺失', allTitles.filter(t => !t.hasTitle).map(t => t.tab).join(','));

  // 2. title 包含 tab 名 + 计数 + 模式
  const funnelTitle = allTitles.find(t => t.tab === 'funnel');
  if (funnelTitle && funnelTitle.title.includes('销售漏斗') && funnelTitle.title.includes('12') && funnelTitle.title.includes('off')) {
    pass('2. funnel title 格式正确: ' + funnelTitle.title);
  } else {
    fail('2. funnel title 格式', funnelTitle?.title);
  }

  // 3. off 模式 7 tab 总宽 > 容器（需要横向滚动）
  const offLayout = await page.evaluate(() => {
    var tabs = document.querySelector('.ai-display__tabs');
    var visible = Array.from(document.querySelectorAll('.ai-tab')).filter(t => t.style.display !== 'none');
    return {
      containerW: tabs.getBoundingClientRect().width,
      scrollW: tabs.scrollWidth,
      scrollLeft: tabs.scrollLeft,
      needsScroll: tabs.scrollWidth > tabs.clientWidth
    };
  });
  if (offLayout.needsScroll) pass('3. off 模式 7 tab 触发横向滚动 (scrollW=' + offLayout.scrollW + ' > clientW=' + offLayout.containerW + ')');
  else fail('3. 不需滚动', JSON.stringify(offLayout));

  // 4. 初始 active funnel 在视口内
  const initActive = await page.evaluate(() => {
    var active = document.querySelector('.ai-tab.is-active');
    var container = active.parentElement;
    var aRect = active.getBoundingClientRect();
    var cRect = container.getBoundingClientRect();
    return {
      activeTab: active.dataset.tab,
      aLeft: aRect.left, aRight: aRect.right,
      cLeft: cRect.left, cRight: cRect.right,
      inView: aRect.left >= cRect.left && aRect.right <= cRect.right
    };
  });
  if (initActive.activeTab === 'funnel' && initActive.inView) pass('4. 初始 active funnel 在视口内');
  else fail('4. 初始 active', JSON.stringify(initActive));

  // 5. 切到 semi → 默认 tab analyze，应被滚到中间
  await page.click('.ai-seg__opt[data-mode="semi"]');
  await page.waitForTimeout(800); // 等 smooth scroll
  const semiActive = await page.evaluate(() => {
    var active = document.querySelector('.ai-tab.is-active');
    var container = active.parentElement;
    var aRect = active.getBoundingClientRect();
    var cRect = container.getBoundingClientRect();
    return {
      activeTab: active.dataset.tab,
      aLeft: Math.round(aRect.left), aRight: Math.round(aRect.right),
      cLeft: Math.round(cRect.left), cRight: Math.round(cRect.right),
      scrollLeft: container.scrollLeft,
      inView: aRect.left >= cRect.left && aRect.right <= cRect.right
    };
  });
  if (semiActive.activeTab === 'analyze' && semiActive.inView) {
    pass('5. 切 semi → analyze 在视口内 (scrollLeft=' + semiActive.scrollLeft + ')');
  } else {
    fail('5. semi active', JSON.stringify(semiActive));
  }

  // 6. 切回 off → funnel 应被滚回视口
  await page.click('.ai-seg__opt[data-mode="off"]');
  await page.waitForTimeout(800);
  const backOff = await page.evaluate(() => {
    var active = document.querySelector('.ai-tab.is-active');
    var container = active.parentElement;
    var aRect = active.getBoundingClientRect();
    var cRect = container.getBoundingClientRect();
    return {
      activeTab: active.dataset.tab,
      inView: aRect.left >= cRect.left && aRect.right <= cRect.right,
      scrollLeft: container.scrollLeft
    };
  });
  if (backOff.activeTab === 'funnel' && backOff.inView) pass('6. 切回 off → funnel 在视口内');
  else fail('6. 切回 off', JSON.stringify(backOff));

  // 7. 手动点最后一个 segments tab → 滚到右
  await page.click('.ai-tab[data-tab="segments"]');
  await page.waitForTimeout(800);
  const segActive = await page.evaluate(() => {
    var active = document.querySelector('.ai-tab.is-active');
    var container = active.parentElement;
    var aRect = active.getBoundingClientRect();
    var cRect = container.getBoundingClientRect();
    return {
      activeTab: active.dataset.tab,
      inView: aRect.left >= cRect.left && aRect.right <= cRect.right,
      scrollLeft: container.scrollLeft
    };
  });
  if (segActive.activeTab === 'segments' && segActive.inView && segActive.scrollLeft > 0) {
    pass('7. 点 segments → 滚到右 (scrollLeft=' + segActive.scrollLeft + ')');
  } else {
    fail('7. segments', JSON.stringify(segActive));
  }

  // 8. 切到 full → segments 仍在允许列表保留（v56 行为）· 但在视口内
  await page.click('.ai-seg__opt[data-mode="full"]');
  await page.waitForTimeout(1500); // smooth scroll 完全停下
  const fullActive = await page.evaluate(() => {
    var active = document.querySelector('.ai-tab.is-active');
    return {
      tab: active.dataset.tab,
      aLeft: Math.round(active.getBoundingClientRect().left),
      aRight: Math.round(active.getBoundingClientRect().right),
      cLeft: Math.round(active.parentElement.getBoundingClientRect().left),
      cRight: Math.round(active.parentElement.getBoundingClientRect().right),
      scrollLeft: active.parentElement.scrollLeft
    };
  });
  // inView 严格版：active right <= cRight
  const inView8 = fullActive.aRight <= fullActive.cRight + 2 && fullActive.aLeft >= fullActive.cLeft - 2;
  if (fullActive.tab === 'segments' && inView8) pass('8. 切 full → segments 保留 + 在视口内 (aRight=' + fullActive.aRight + ' cRight=' + fullActive.cRight + ')');
  else fail('8. full active', JSON.stringify(fullActive));

  // 9. 不破 v56 tab 切换
  await page.click('.ai-seg__opt[data-mode="semi"]');
  await page.waitForTimeout(500);
  await page.click('.ai-tab[data-tab="products"]');
  await page.waitForTimeout(500);
  const productsPanel = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('.ai-tab-panel[data-panel="products"]')).map(p => p.classList.contains('is-active'));
  });
  if (productsPanel[0]) pass('9. 点 products tab → panel 仍激活（v56 兼容）');
  else fail('9. panel', JSON.stringify(productsPanel));

  console.log('\n── v84 验证结果 ──');
  results.forEach(r => console.log(r));
  console.log('── JS 错误 ──');
  if (errs.length === 0) console.log('✅ 无 JS 错误');
  else errs.forEach(e => console.log('❌ ' + e));

  await browser.close();
  process.exit(errs.length > 0 || results.some(r => r.startsWith('❌')) ? 1 : 0);
})();
