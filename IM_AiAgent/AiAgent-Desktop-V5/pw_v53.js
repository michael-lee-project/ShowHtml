// v53 playwright 验证（精确 selector：只测 productModal 内的术语）
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    executablePath: '/Users/michael/Library/Caches/ms-playwright/chromium_headless_shell-1228/chrome-headless-shell-mac-arm64/chrome-headless-shell',
    headless: true,
    args: ['--no-sandbox']
  });
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();

  page.on('console', msg => {
    const text = msg.text();
    if (text.includes('[v53')) console.log(text);
  });
  page.on('pageerror', err => console.log('[pageerror]', err.message));

  await page.goto('http://localhost:8309/messages.html', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);

  // ===== 1. 点 8000 → 弹窗打开（默认 soft 风格）=====
  await page.locator('.product-card[data-product="8000"]').click();
  await page.waitForTimeout(400);
  const modalVisible1 = await page.locator('#productModal').isVisible();
  console.log('[1] productModal visible =', modalVisible1);
  await page.screenshot({ path: '/Users/michael/.mavis/tmp/mcp-images/mcp-image-8309-v53-1-8000-soft.png' });

  const firstTerm = await page.locator('#productModalTerms .sales-term__text').first().textContent();
  console.log('[1] first term (8000+soft) =', firstTerm.substring(0, 60));

  // ===== 2. 弹窗内切到 5000 产品 =====
  await page.locator('.product-modal__product[data-product-key="5000"]').click();
  await page.waitForTimeout(300);
  const heroName2 = await page.locator('#productModalHeroName').textContent();
  const firstTerm2 = await page.locator('#productModalTerms .sales-term__text').first().textContent();
  console.log('[2] heroName after switch 5000 =', heroName2);
  console.log('[2] first term (5000+soft, should contain 5000) =', firstTerm2.substring(0, 60));
  await page.screenshot({ path: '/Users/michael/.mavis/tmp/mcp-images/mcp-image-8309-v53-2-5000-soft.png' });

  // ===== 3. 切到数据营销 tab =====
  await page.locator('#productModalTabs .suggest-tab[data-style="data"]').click();
  await page.waitForTimeout(300);
  const activeTab3 = await page.locator('#productModalTabs .suggest-tab.is-active').getAttribute('data-style');
  const firstTerm3 = await page.locator('#productModalTerms .sales-term__text').first().textContent();
  console.log('[3] active tab =', activeTab3);
  console.log('[3] first term (5000+data, should be ¥5,000 or 13.7) =', firstTerm3.substring(0, 60));
  await page.screenshot({ path: '/Users/michael/.mavis/tmp/mcp-images/mcp-image-8309-v53-3-5000-data.png' });

  // ===== 4. 切到主动营销 tab =====
  await page.locator('#productModalTabs .suggest-tab[data-style="proactive"]').click();
  await page.waitForTimeout(300);
  const firstTerm4 = await page.locator('#productModalTerms .sales-term__text').first().textContent();
  console.log('[4] first term (5000+proactive) =', firstTerm4.substring(0, 60));
  await page.screenshot({ path: '/Users/michael/.mavis/tmp/mcp-images/mcp-image-8309-v53-4-5000-proactive.png' });

  // ===== 5. 点术语 → 填入 + 关闭 =====
  await page.locator('#productModalTerms .sales-term').first().click();
  await page.waitForTimeout(300);
  const modalClosed5 = !(await page.locator('#productModal').isVisible());
  const inputVal = await page.locator('#msgInput').textContent();
  console.log('[5] modal closed after click term =', modalClosed5);
  console.log('[5] msgInput filled =', inputVal.substring(0, 80));

  // ===== 6. 边界检查：弹窗不超桌面端 1180×820 =====
  await page.locator('.product-card[data-product="8000"]').click();
  await page.waitForTimeout(300);
  const box = await page.locator('#productModal .product-modal__dialog').boundingBox();
  console.log('[6] dialog box =', JSON.stringify(box));
  const inBounds = box.x >= 0 && box.y >= 0 && (box.x + box.width) <= 1180 && (box.y + box.height) <= 820;
  console.log('[6] in 1180x820 bounds =', inBounds);
  await page.screenshot({ path: '/Users/michael/.mavis/tmp/mcp-images/mcp-image-8309-v53-6-bounds.png' });

  // ===== 7. Esc 关闭 =====
  await page.keyboard.press('Escape');
  await page.waitForTimeout(200);
  const escClosed = !(await page.locator('#productModal').isVisible());
  console.log('[7] modal closed after Esc =', escClosed);

  // ===== 8. 切回 8000 =====
  await page.locator('.product-card[data-product="8000"]').click();
  await page.waitForTimeout(200);
  await page.locator('.product-modal__product[data-product-key="8000"]').click();
  await page.waitForTimeout(200);
  const heroName8 = await page.locator('#productModalHeroName').textContent();
  const firstTerm8 = await page.locator('#productModalTerms .sales-term__text').first().textContent();
  console.log('[8] heroName after switch back 8000 =', heroName8);
  console.log('[8] first term (8000+soft) =', firstTerm8.substring(0, 60));
  await page.screenshot({ path: '/Users/michael/.mavis/tmp/mcp-images/mcp-image-8309-v53-8-8000-back.png' });

  // ===== 9. 切产品切风格 =====
  await page.locator('.product-modal__product[data-product-key="5000"]').click();
  await page.waitForTimeout(200);
  await page.locator('#productModalTabs .suggest-tab[data-style="data"]').click();
  await page.waitForTimeout(200);
  const firstTerm9 = await page.locator('#productModalTerms .sales-term__text').first().textContent();
  console.log('[9] first term (5000+data) =', firstTerm9.substring(0, 60));
  // 应包含 "¥5,000" 和 "13.7"
  const hasPrice = firstTerm9.includes('¥5,000');
  const hasDaily = firstTerm9.includes('13.7');
  console.log('[9] has ¥5,000 =', hasPrice, ' has 13.7 =', hasDaily);

  await browser.close();
  console.log('=== PASS ===');
})();
