// v77 探针：dashboard.html 单独跑通
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

  await page.goto('http://localhost:8337/dashboard.html', { waitUntil: 'networkidle' });
  await page.waitForSelector('.dashboard__eyebrow', { timeout: 4000 });
  await page.waitForTimeout(500);

  // 截图看效果
  await page.screenshot({ path: '/Users/michael/.mavis/tmp/mcp-images/mcp-image-8337-v77-dash.png' });

  // 4 弹窗
  await page.click('[data-modal="todo"]');
  await page.waitForTimeout(400);
  const todoOk = await page.evaluate(() => !document.getElementById('dashboardTodoModal').hidden);
  await page.click('#dashboardTodoModal .dashboard-modal__close');
  await page.waitForTimeout(200);

  await page.click('[data-modal="report"]');
  await page.waitForTimeout(400);
  const reportOk = await page.evaluate(() => !document.getElementById('dashboardReportModal').hidden);
  await page.keyboard.press('Escape');

  await page.click('[data-modal="funnel"]');
  await page.waitForTimeout(400);
  const funnelOk = await page.evaluate(() => !document.getElementById('dashboardFunnelModal').hidden);
  await page.keyboard.press('Escape');

  // 立即开始
  await page.click('.dashboard-pickup__btn');
  await page.waitForTimeout(400);
  const startOk = await page.evaluate(() => !document.getElementById('dashboardStartModal').hidden);
  await page.click('#startConfirmBtn');
  await page.waitForTimeout(300);
  const picked = await page.evaluate(() => {
    const b = document.querySelector('.dashboard-pickup__btn');
    return b.classList.contains('is-picked') && b.textContent.includes('已接管');
  });

  console.log('弹窗 1 todo:', todoOk ? '✅' : '❌');
  console.log('弹窗 2 report:', reportOk ? '✅' : '❌');
  console.log('弹窗 3 funnel:', funnelOk ? '✅' : '❌');
  console.log('弹窗 4 start:', startOk ? '✅' : '❌');
  console.log('确认接管:', picked ? '✅' : '❌');
  console.log('sidebar 6 icon 选中:', await page.evaluate(() => document.querySelector('.sidebar__item.is-active')?.getAttribute('href')));

  console.log('JS 错误:', errs.length === 0 ? '✅ 无' : '❌ ' + errs.length);
  errs.forEach(e => console.log('  ' + e));

  await browser.close();
})();
