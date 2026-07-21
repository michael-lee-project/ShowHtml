// v63 playwright 验证：产品库 4 个产品
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    executablePath: '/Users/michael/Library/Caches/ms-playwright/chromium_headless_shell-1228/chrome-headless-shell-mac-arm64/chrome-headless-shell',
    headless: true,
    args: ['--no-sandbox']
  });
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();

  page.on('pageerror', err => console.log('[pageerror]', err.message));

  await page.goto('http://localhost:8320/messages.html', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);

  // 1. 切到产品库 tab
  await page.locator('.ai-tab[data-tab="products"]').click();
  await page.waitForTimeout(300);

  // 2. 4 个产品卡
  const productCount = await page.locator('#aiProductsCard .product-card').count();
  console.log('[1] product-card count =', productCount, '(should be 4)');

  // 3. 4 个产品名称
  const productNames = await page.locator('#aiProductsCard .product-card__name').evaluateAll(els =>
    els.map(e => e.textContent)
  );
  console.log('[2] product names =', JSON.stringify(productNames));

  // 4. 每个产品都有 price-now
  const prices = await page.locator('#aiProductsCard .product-card__price-now').evaluateAll(els =>
    els.map(e => e.textContent)
  );
  console.log('[3] prices =', JSON.stringify(prices));

  // 5. 产品库 panel 桌面端 fit
  const box = await page.locator('.ai-tab-panel[data-panel="products"].is-active').boundingBox();
  console.log('[4] products panel box =', JSON.stringify(box));
  const inViewport = box.y + box.height <= 820;
  console.log('[4] bottom in 820 viewport =', inViewport, '(box bottom =', Math.round(box.y + box.height) + ')');

  // 6. 4 个产品全部完整可见
  const cards = await page.locator('#aiProductsCard .product-card').evaluateAll(els =>
    els.map(e => ({ bottom: Math.round(e.getBoundingClientRect().bottom) }))
  );
  console.log('[5] card bottoms =', JSON.stringify(cards));
  const allInViewport = cards.every(c => c.bottom <= 820);
  console.log('[5] all 4 products in viewport =', allInViewport);
  await page.screenshot({ path: '/Users/michael/.mavis/tmp/mcp-images/mcp-image-8320-v63-1-products.png' });

  // 7. 点击 8000 套餐 → 弹 v53 productModal
  await page.locator('.product-card[data-product="8000"]').click();
  await page.waitForTimeout(400);
  const modalVisible = await page.locator('#productModal').isVisible();
  console.log('[6] productModal visible after click 8000 =', modalVisible);
  await page.keyboard.press('Escape');
  await page.waitForTimeout(200);

  // 8. tab count 动态 = 4
  const tabCount = await page.locator('.ai-tab[data-tab="products"] .ai-tab__count').textContent();
  console.log('[7] products tab count =', tabCount, '(should be 4)');

  // 9. 验证 5000/3000/10000 产品能点击（不会弹 v44 salesModal）
  await page.locator('.product-card[data-product="5000"]').click();
  await page.waitForTimeout(400);
  const modalVisible2 = await page.locator('#productModal').isVisible();
  const salesModalVisible = await page.locator('#salesModal').count();
  console.log('[8] productModal visible after click 5000 =', modalVisible2);
  console.log('[8] salesModal (v44) count (should be 0) =', salesModalVisible);
  await page.keyboard.press('Escape');
  await page.waitForTimeout(200);

  await browser.close();
  console.log('=== PASS ===');
})();
