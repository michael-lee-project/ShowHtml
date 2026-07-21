// v77: dashboard 独立页面 + sidebar 互跳 + 工具区跳 messages tab
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

  const results = [];
  const pass = (n) => results.push('✅ ' + n);
  const fail = (n, why) => results.push('❌ ' + n + (why ? '  · ' + why : ''));

  // ============ 1. dashboard.html 单独跑 ============
  await page.goto('http://localhost:8337/dashboard.html', { waitUntil: 'networkidle' });
  await page.waitForSelector('.dashboard__eyebrow', { timeout: 4000 });
  await page.waitForTimeout(500);

  const dashEyebrow = await page.locator('.dashboard__eyebrow').first().textContent();
  if (dashEyebrow && dashEyebrow.includes('AI · 销冠专家')) pass('1. dashboard.html 独立页 eyebrow 渲染');
  else fail('1. dashboard.html eyebrow', dashEyebrow);

  const dashSidebarActive = await page.evaluate(() => document.querySelector('.sidebar__item.is-active')?.getAttribute('href'));
  if (dashSidebarActive === 'dashboard.html') pass('2. dashboard.html sidebar 第 1 项 active');
  else fail('2. sidebar active', dashSidebarActive);

  await page.screenshot({ path: '/Users/michael/.mavis/tmp/mcp-images/mcp-image-8337-v77-1-dash.png' });

  // ============ 2. dashboard 4 弹窗 ============
  await page.click('[data-modal="todo"]');
  await page.waitForTimeout(500);
  const todoOk = await page.evaluate(() => !document.getElementById('dashboardTodoModal').hidden);
  await page.click('#dashboardTodoModal .dashboard-modal__close');
  await page.waitForTimeout(250);

  await page.click('[data-modal="report"]');
  await page.waitForTimeout(500);
  const reportOk = await page.evaluate(() => !document.getElementById('dashboardReportModal').hidden);
  await page.keyboard.press('Escape');
  await page.waitForTimeout(250);

  await page.click('[data-modal="funnel"]');
  await page.waitForTimeout(500);
  const funnelOk = await page.evaluate(() => !document.getElementById('dashboardFunnelModal').hidden);
  await page.keyboard.press('Escape');
  await page.waitForTimeout(250);

  await page.click('.dashboard-pickup__btn');
  await page.waitForTimeout(500);
  const startOk = await page.evaluate(() => !document.getElementById('dashboardStartModal').hidden);
  await page.click('#startConfirmBtn');
  await page.waitForTimeout(300);
  const picked = await page.evaluate(() => {
    const b = document.querySelector('.dashboard-pickup__btn');
    return b.classList.contains('is-picked') && b.textContent.includes('已接管');
  });

  if (todoOk && reportOk && funnelOk && startOk && picked) pass('3. dashboard 4 弹窗 + 立即开始→已接管 全通');
  else fail('3. 4 弹窗', `todo=${todoOk} report=${reportOk} funnel=${funnelOk} start=${startOk} picked=${picked}`);

  // ============ 3. dashboard 工具区跳 messages.html?panel=xxx ============
  // 4 个工具：knowledge / products / templates / segments
  const toolTests = [
    { tool: 'knowledge', panel: 'knowledge' },
    { tool: 'products', panel: 'products' },
    { tool: 'templates', panel: 'templates' },
    { tool: 'segments', panel: 'segments' },
  ];
  // 直接 navigate 到 messages.html?panel=xxx 模拟点击工具链接
  for (const t of toolTests) {
    await page.goto('http://localhost:8337/messages.html?panel=' + t.panel, { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);
    const activePanel = await page.evaluate(() => {
      const el = document.querySelector('.ai-tab-panel.is-active');
      return el ? el.getAttribute('data-panel') : null;
    });
    if (activePanel === t.panel) pass('4. messages.html?panel=' + t.panel + ' → ' + t.panel + ' tab 激活');
    else fail('4. ?panel=' + t.panel, 'got=' + activePanel);
  }

  // ============ 4. sidebar dashboard.html → messages.html 互跳 ============
  await page.goto('http://localhost:8337/dashboard.html', { waitUntil: 'networkidle' });
  await page.waitForTimeout(300);
  // 点 sidebar "消息"
  await page.evaluate(() => {
    const items = document.querySelectorAll('.sidebar__item');
    if (items[1]) items[1].click();
  });
  await page.waitForTimeout(500);
  const msgUrl = page.url();
  if (msgUrl.endsWith('messages.html') || msgUrl.includes('messages.html')) pass('5. dashboard 侧栏点消息 → 跳 messages.html');
  else fail('5. 侧栏跳消息', msgUrl);
  await page.screenshot({ path: '/Users/michael/.mavis/tmp/mcp-images/mcp-image-8337-v77-2-msg.png' });

  // 点 sidebar 第 1 个（dashboard）
  await page.evaluate(() => {
    const items = document.querySelectorAll('.sidebar__item');
    if (items[0]) items[0].click();
  });
  await page.waitForTimeout(500);
  const dashUrl = page.url();
  if (dashUrl.endsWith('dashboard.html') || dashUrl.includes('dashboard.html')) pass('6. messages 侧栏点 AI 销冠 → 跳 dashboard.html');
  else fail('6. 侧栏跳 dashboard', dashUrl);

  // ============ 5. messages.html 单独跑无错 ============
  await page.goto('http://localhost:8337/messages.html', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  const msgSidebarActive = await page.evaluate(() => document.querySelector('.sidebar__item.is-active')?.getAttribute('href'));
  if (msgSidebarActive === 'messages.html') pass('7. messages.html sidebar 第 2 项 active');
  else fail('7. messages sidebar', msgSidebarActive);

  // ============ 输出 ============
  console.log('\n── v77 验证结果 ──');
  results.forEach(r => console.log(r));
  console.log('── JS 错误 ──');
  if (errs.length === 0) console.log('✅ 无 JS 错误');
  else errs.forEach(e => console.log('❌ ' + e));

  await browser.close();
  process.exit(errs.length > 0 || results.some(r => r.startsWith('❌')) ? 1 : 0);
})();
