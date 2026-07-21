// v76: 漏斗"浏览"→"意向" 同步两套漏斗
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

  await page.goto('http://localhost:8336/messages.html', { waitUntil: 'networkidle' });
  await page.waitForSelector('.dashboard__eyebrow', { timeout: 4000 });

  const results = [];
  const pass = (n) => results.push('✅ ' + n);
  const fail = (n, why) => results.push('❌ ' + n + (why ? '  · ' + why : ''));

  // 1. 全站不应该再有"浏览"字样
  const browseCount = await page.evaluate(() => {
    const text = document.body.innerText;
    return (text.match(/浏览/g) || []).length;
  });
  if (browseCount === 0) pass('1. 全站无"浏览"字样'); else fail('1. 仍有"浏览"', 'count=' + browseCount);

  // 2. dashboard 默认 + 切到 messages 看消息页漏斗
  await page.screenshot({ path: '/Users/michael/.mavis/tmp/mcp-images/mcp-image-8336-v76-1-dashboard.png' });

  // 切到消息页（点 sidebar 第二个 icon "消息"）
  await page.evaluate(() => {
    const items = document.querySelectorAll('.sidebar__item');
    if (items[1]) items[1].click();
  });
  await page.waitForTimeout(400);

  // 3. 消息页漏斗 panel 的"浏览"应改为"意向"
  // 找 .ai-card--funnel 内的 5 个 funnel-step__name
  const stageNames = await page.evaluate(() => {
    const steps = document.querySelectorAll('.ai-card--funnel .funnel-step__name');
    return Array.from(steps).map(s => s.textContent.trim());
  });
  if (stageNames.length === 5 && stageNames[0] === '意向' && stageNames[1] === '咨询' && stageNames[2] === '议价' && stageNames[3] === '体验' && stageNames[4] === '成交') {
    pass('3. 消息页漏斗 5 阶段名 = ' + stageNames.join(' / '));
  } else {
    fail('3. 消息页漏斗 5 阶段', JSON.stringify(stageNames));
  }
  await page.screenshot({ path: '/Users/michael/.mavis/tmp/mcp-images/mcp-image-8336-v76-2-funnel-panel.png' });

  // 4. funnelModal 弹窗的 STAGES 数据也应该是"意向"
  await page.evaluate(() => {
    // 找 sidebar 第 1 个 icon（dashboard），点回 dashboard
    const items = document.querySelectorAll('.sidebar__item');
    if (items[0]) items[0].click();
  });
  await page.waitForTimeout(300);
  // 从 dashboard 点"查看 12 位好友"
  await page.click('[data-modal="funnel"]');
  await page.waitForTimeout(500);
  const modalNames = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('#dashboardFunnelModal .funnel-modal-block__name')).map(s => s.textContent.trim());
  });
  if (modalNames.length === 5 && modalNames.some(n => n.includes('意向')) && !modalNames.some(n => n.includes('浏览'))) {
    pass('4. dashboard 漏斗弹窗 5 阶段 = ' + modalNames.join(' / '));
  } else {
    fail('4. dashboard 漏斗弹窗 5 阶段', JSON.stringify(modalNames));
  }

  console.log('\n── v76 验证结果 ──');
  results.forEach(r => console.log(r));
  console.log('── JS 错误 ──');
  if (errs.length === 0) console.log('✅ 无 JS 错误');
  else errs.forEach(e => console.log('❌ ' + e));

  await browser.close();
  process.exit(errs.length > 0 || results.some(r => r.startsWith('❌')) ? 1 : 0);
})();
