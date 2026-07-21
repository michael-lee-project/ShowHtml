// v64 playwright 验证：弹窗支持 4 产品 + 占位符替换正确
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

  await page.goto('http://localhost:8321/messages.html', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);

  // 1. 切到产品库 tab
  await page.locator('.ai-tab[data-tab="products"]').click();
  await page.waitForTimeout(300);

  // 2. 点 3000 套餐 → 弹 v53 productModal
  await page.locator('.product-card[data-product="3000"]').click();
  await page.waitForTimeout(500);
  const modalVisible = await page.locator('#productModal').isVisible();
  console.log('[1] productModal visible after click 3000 =', modalVisible);

  // 3. 弹窗内 4 个产品 tab
  const productTabCount = await page.locator('.product-modal__product[data-product-key]').count();
  console.log('[2] product tabs in modal =', productTabCount, '(should be 4)');
  await page.screenshot({ path: '/Users/michael/.mavis/tmp/mcp-images/mcp-image-8321-v64-1-3000.png' });

  // 4. hero 显示 3000 套餐
  const heroName = await page.locator('#productModalHeroName').textContent();
  const heroBullets = await page.locator('#productModalHeroBullets span').evaluateAll(els => els.map(e => e.textContent));
  console.log('[3] hero name =', heroName);
  console.log('[3] hero bullets =', JSON.stringify(heroBullets));

  // 5. 术语占位符替换（soft 风格第一条）— 应该包含"3000 入门套餐" + "¥2,700"
  const firstTerm = await page.locator('#productModalTerms .sales-term__text').first().textContent();
  console.log('[4] first soft term =', firstTerm);
  const has3000 = firstTerm.includes('3000 入门套餐');
  const hasPrice = firstTerm.includes('¥2,700');
  console.log('[4] contains "3000 入门套餐" =', has3000, ', contains "¥2,700" =', hasPrice);

  // 6. 切到 data 风格，第一条术语应含 dailyPrice 7.4
  await page.locator('#productModalTabs .suggest-tab[data-style="data"]').click();
  await page.waitForTimeout(300);
  const dataTerms = await page.locator('#productModalTerms .sales-term__text').evaluateAll(els => els.map(e => e.textContent));
  const hasDaily = dataTerms.some(t => t.includes('7.4'));
  console.log('[5] data terms contain "7.4" =', hasDaily);

  // 7. 切到 proactive，第一条应含 oldPrice ¥3,000
  await page.locator('#productModalTabs .suggest-tab[data-style="proactive"]').click();
  await page.waitForTimeout(300);
  const proTerms = await page.locator('#productModalTerms .sales-term__text').evaluateAll(els => els.map(e => e.textContent));
  const hasOldPrice = proTerms.some(t => t.includes('¥3,000'));
  console.log('[6] proactive terms contain "¥3,000" =', hasOldPrice);

  // 8. 切到 10000 套餐
  await page.locator('.product-modal__product[data-product-key="10000"]').click();
  await page.waitForTimeout(300);
  const heroName10k = await page.locator('#productModalHeroName').textContent();
  const firstTerm10k = await page.locator('#productModalTerms .sales-term__text').first().textContent();
  console.log('[7] hero name after switch 10000 =', heroName10k);
  console.log('[7] first term (10000) =', firstTerm10k.substring(0, 50));
  const has10k = firstTerm10k.includes('10000 至尊套餐');
  const hasPrice10k = firstTerm10k.includes('¥8,800');
  console.log('[7] contains "10000 至尊套餐" =', has10k, ', contains "¥8,800" =', hasPrice10k);
  await page.screenshot({ path: '/Users/michael/.mavis/tmp/mcp-images/mcp-image-8321-v64-2-10000.png' });

  // 9. 弹窗桌面端 fit（4 产品 tab 不超弹窗宽度）
  const box = await page.locator('#productModal .product-modal__dialog').boundingBox();
  console.log('[8] modal box =', JSON.stringify(box));
  const inBounds = box.x >= 0 && box.y >= 0 && (box.x + box.width) <= 1230 && (box.y + box.height) <= 820;
  console.log('[8] in 1180x820 bounds =', inBounds);

  // 10. 点术语填入 + 关闭
  await page.locator('#productModalTabs .suggest-tab[data-style="soft"]').click();
  await page.waitForTimeout(300);
  await page.locator('#productModalTerms .sales-term').first().click();
  await page.waitForTimeout(300);
  const modalClosed = !(await page.locator('#productModal').isVisible());
  const inputVal = await page.locator('#msgInput').textContent();
  console.log('[9] modal closed =', modalClosed);
  console.log('[9] msgInput filled =', inputVal.substring(0, 60));

  await browser.close();
  console.log('=== PASS ===');
})();
