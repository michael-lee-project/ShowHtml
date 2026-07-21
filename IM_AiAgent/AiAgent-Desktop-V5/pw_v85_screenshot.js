// v85: 截图 - 演示场景改价后状态
const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({
    executablePath: '/Users/michael/Library/Caches/ms-playwright/chromium_headless_shell-1228/chrome-headless-shell-mac-arm64/chrome-headless-shell',
    headless: true, args: ['--no-sandbox'],
  });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto('http://localhost:8345/dashboard.html', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  // 预置改价
  await page.evaluate(() => {
    localStorage.setItem('umakex_product_prices_v1', JSON.stringify({ '8000': 7500, '10000': 9500 }));
  });
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  await page.screenshot({
    path: '/Users/michael/.mavis/tmp/mcp-images/mcp-image-8345-v85-dashboard.png',
    fullPage: false,
  });
  console.log('截图保存');
  await browser.close();
})();
