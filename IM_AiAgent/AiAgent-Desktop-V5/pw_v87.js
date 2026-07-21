// v87: 弹窗 3 漏斗详情升级
const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({
    executablePath: '/Users/michael/Library/Caches/ms-playwright/chromium_headless_shell-1228/chrome-headless-shell-mac-arm64/chrome-headless-shell',
    headless: true, args: ['--no-sandbox'],
  });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  const errs = [];
  page.on('pageerror', e => errs.push('pageerror: ' + e.message));
  page.on('console', m => { if (m.type() === 'error') errs.push('console.error: ' + m.text()); });

  await page.goto('http://localhost:8348/dashboard.html', { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);

  const results = [];
  const pass = (n) => results.push('✅ ' + n);
  const fail = (n, why) => results.push('❌ ' + n + (why ? '  · ' + why : ''));

  // 1. 主页漏斗 5 行可点（cursor: pointer + 5 个 stage）
  const stages = await page.$$eval('.dashboard-funnel__stage', els => els.map(e => e.getAttribute('data-stage')));
  if (stages.length === 5 && stages.includes('cold') && stages.includes('warm') && stages.includes('hot') && stages.includes('deal') && stages.includes('won')) {
    pass('1. 主页漏斗 5 行有 data-stage 锚点');
  } else {
    fail('1. 漏斗行缺', stages.join(','));
  }

  // 2. 点议价行 → 弹窗 3 打开 + 议价 block 高亮
  await page.evaluate(() => {
    var s = document.querySelector('.dashboard-funnel__stage[data-stage="hot"]');
    if (s) s.click();
  });
  await page.waitForTimeout(500);
  const m3Open = await page.evaluate(() => {
    var m = document.getElementById('dashboardFunnelModal');
    return { hidden: m.hasAttribute('hidden') };
  });
  if (!m3Open.hidden) {
    pass('2. 点主页议价行 → 弹窗 3 打开');
  } else {
    fail('2. 弹窗 3 没开');
  }

  // 3. 弹窗 3 有 12 张好友卡片
  const cardCount = await page.$$eval('#dashboardFunnelModal .funnel-friend-card', els => els.length);
  if (cardCount === 12) {
    pass('3. 弹窗 3 渲染 12 张好友卡片（5+3+2+1+1）');
  } else {
    fail('3. 卡片数错', cardCount);
  }

  // 4. 5 段 funnel-modal-block 都存在
  const blocks = await page.$$eval('#dashboardFunnelModal .funnel-modal-block', els => els.map(e => e.getAttribute('data-stage')));
  if (blocks.length === 5) {
    pass('4. 5 段 funnel-modal-block 都存在（' + blocks.join('/') + '）');
  } else {
    fail('4. block 数错', blocks.join(','));
  }

  // 5. 议价 block 高亮（点议价行后）
  const hotHighlighted = await page.evaluate(() => {
    return document.querySelector('#dashboardFunnelModal .funnel-modal-block[data-stage="hot"]').classList.contains('funnel-modal-block--highlight');
  });
  if (hotHighlighted) {
    pass('5. 议价 block 高亮（点主页行后）');
  } else {
    fail('5. 议价 block 没高亮');
  }

  // 6. 弹窗 3 头部 5 阶段 chip
  const chips = await page.$$eval('#funnelModalStages .funnel-modal-stage', els => els.length);
  if (chips === 5) {
    pass('6. 弹窗 3 头部 5 阶段 chip 都存在');
  } else {
    fail('6. chip 数错', chips);
  }

  // 7. 点 chip 切阶段（点"成交"chip → 滚到成交 + 高亮）
  await page.click('.funnel-modal-stage[data-stage-target="won"]');
  await page.waitForTimeout(500);
  const wonHighlighted = await page.evaluate(() => {
    return document.querySelector('#dashboardFunnelModal .funnel-modal-block[data-stage="won"]').classList.contains('funnel-modal-block--highlight');
  });
  if (wonHighlighted) {
    pass('7. 点"成交"chip → 成交 block 高亮');
  } else {
    fail('7. 成交 block 没高亮');
  }

  // 8. 12 条术语（默认温和）
  const scriptsSoft = await page.$$eval('#funnelScriptsList .funnel-scripts__item', els => els.length);
  if (scriptsSoft === 4) {
    pass('8. 默认温和 4 条术语');
  } else {
    fail('8. 温和术语数错', scriptsSoft);
  }

  // 9. 切到"数据"风格 → 4 条数据
  await page.click('.funnel-scripts__style[data-script-style="data"]');
  await page.waitForTimeout(300);
  const scriptsData = await page.$$eval('#funnelScriptsList .funnel-scripts__item', els => els.length);
  const dataActive = await page.evaluate(() => {
    return document.querySelector('.funnel-scripts__style[data-script-style="data"]').classList.contains('is-active');
  });
  if (scriptsData === 4 && dataActive) {
    pass('9. 切"数据"风格 → 4 条 + tab 高亮');
  } else {
    fail('9. 数据风格错', JSON.stringify({ scriptsData, dataActive }));
  }

  // 10. 切到"主动"风格 → 4 条
  await page.click('.funnel-scripts__style[data-script-style="pro"]');
  await page.waitForTimeout(300);
  const scriptsPro = await page.$$eval('#funnelScriptsList .funnel-scripts__item', els => els.length);
  if (scriptsPro === 4) {
    pass('10. 切"主动"风格 → 4 条');
  } else {
    fail('10. 主动术语数错', scriptsPro);
  }

  // 11. 术语"填入对话"按钮（dashboard 单独页无 chatInput → 应走复制 + toast）
  await page.click('.funnel-scripts__item-fill[data-script-idx="0"]');
  await page.waitForTimeout(800);
  const toastShown = await page.evaluate(() => {
    return document.querySelectorAll('.toast--show').length;
  });
  if (toastShown >= 1) {
    pass('11. 术语"填入对话" → 弹 toast（dashboard 独立页走复制路径）');
  } else {
    fail('11. 没弹 toast');
  }

  // 12. 好友卡片 12 位人名都在
  const allNames = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('#dashboardFunnelModal .funnel-friend-card__name')).map(e => e.textContent);
  });
  const expected = ['小赵', '钱先生', '孙总', '周女士', '小李', '张总', '陈经理', '林女士', '小明', '小吴', '小郑', '小冯'];
  const missing = expected.filter(n => !allNames.includes(n));
  if (missing.length === 0) {
    pass('12. 12 位人名都在（' + allNames.length + '）');
  } else {
    fail('12. 缺人名', missing.join(','));
  }

  // 13. 主页"查看 12 位好友 →"按钮（line 318）也通
  await page.click('#dashboardFunnelModal [data-modal-close]');
  await page.waitForTimeout(500);
  await page.evaluate(() => {
    var b = document.querySelector('.dashboard-card__more[data-modal="funnel"]');
    if (b) b.click();
  });
  await page.waitForTimeout(500);
  // 先检查关闭后的状态，再点按钮
  const closed = await page.evaluate(() => {
    return document.getElementById('dashboardFunnelModal').hasAttribute('hidden');
  });
  if (!closed) {
    // 没关掉 → 强制关
    await page.evaluate(() => document.getElementById('dashboardFunnelModal').setAttribute('hidden', ''));
    await page.waitForTimeout(300);
  }
  // 用 evaluate 触发 click（绕过 viewport 限制）
  const m3Open2 = await page.evaluate(() => {
    var b = document.querySelector('.dashboard-card__more[data-modal="funnel"]');
    if (!b) return false;
    b.click();
    return !document.getElementById('dashboardFunnelModal').hasAttribute('hidden');
  });
  if (m3Open2) {
    pass('13. 主页"查看 12 位好友 →"按钮通弹窗 3');
  } else {
    fail('13. 按钮没通');
  }

  console.log('\n── v87 验证结果 ──');
  results.forEach(r => console.log(r));
  console.log('── JS 错误 ──');
  if (errs.length === 0) console.log('✅ 无 JS 错误');
  else errs.forEach(e => console.log('❌ ' + e));

  // 截图 1：主页 dashboard 整体
  await page.evaluate(() => {
    var m = document.getElementById('dashboardFunnelModal');
    if (m) m.setAttribute('hidden', '');
  });
  await page.waitForTimeout(500);
  await page.screenshot({
    path: '/Users/michael/.mavis/tmp/mcp-images/mcp-image-8348-v87-dashboard.png',
    fullPage: false,
  });
  // 截图 2：弹窗 3（点议价行后）
  await page.evaluate(() => {
    var s = document.querySelector('.dashboard-funnel__stage[data-stage="hot"]');
    if (s) s.click();
  });
  await page.waitForTimeout(700);
  var dlg = await page.$('#dashboardFunnelModal .dashboard-modal__dialog');
  if (dlg) {
    await dlg.screenshot({
      path: '/Users/michael/.mavis/tmp/mcp-images/mcp-image-8348-v87-modal.png',
    });
  }
  console.log('✅ 截图保存');

  await browser.close();
  process.exit(errs.length > 0 || results.some(r => r.startsWith('❌')) ? 1 : 0);
})();
