// v58 playwright 验证：v44 IIFE 删干净 + v53 仍 work
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
  page.on('console', msg => {
    if (msg.type() === 'error') console.log('[console.error]', msg.text());
  });

  await page.goto('http://localhost:8315/messages.html', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);

  // 1. v44 salesModal 完全不存在
  const salesModalCount = await page.locator('#salesModal').count();
  console.log('[1] #salesModal count (should be 0) =', salesModalCount);

  // 2. v53 productModal 存在
  const productModalCount = await page.locator('#productModal').count();
  console.log('[2] #productModal count (should be 1) =', productModalCount);

  // 3. v44 sales-term 元素（v44 IIFE 渲染）不存在
  const salesTermCount = await page.locator('#salesModalTerms .sales-term').count();
  console.log('[3] v44 sales-term count (should be 0) =', salesTermCount);

  // 4. v44 salesModalShuffle 按钮不存在
  const shuffleCount = await page.locator('#salesModalShuffle').count();
  console.log('[4] #salesModalShuffle count (should be 0) =', shuffleCount);

  // 5. v53 productModal 弹窗工作正常
  await page.locator('.ai-tab[data-tab="products"]').click();
  await page.waitForTimeout(300);
  await page.locator('.product-card[data-product="8000"]').click();
  await page.waitForTimeout(400);
  const productModalVisible = await page.locator('#productModal').isVisible();
  console.log('[5] v53 productModal visible after click 8000 =', productModalVisible);
  await page.screenshot({ path: '/Users/michael/.mavis/tmp/mcp-images/mcp-image-8315-v58-1-product-modal.png' });

  // 6. 切到 5000 产品
  await page.locator('.product-modal__product[data-product-key="5000"]').click();
  await page.waitForTimeout(300);
  const firstTerm = await page.locator('#productModalTerms .sales-term__text').first().textContent();
  console.log('[6] first term after switch 5000 =', firstTerm.substring(0, 60));

  // 7. 切营销 tab
  await page.locator('#productModalTabs .suggest-tab[data-style="data"]').click();
  await page.waitForTimeout(300);
  const firstDataTerm = await page.locator('#productModalTerms .sales-term__text').first().textContent();
  console.log('[7] first data term =', firstDataTerm.substring(0, 60));

  // 8. 点术语 → 填入 + 关闭
  await page.locator('#productModalTerms .sales-term').first().click();
  await page.waitForTimeout(300);
  const productModalClosed = !(await page.locator('#productModal').isVisible());
  const inputVal = await page.locator('#msgInput').textContent();
  console.log('[8] productModal closed after click term =', productModalClosed);
  console.log('[8] msgInput filled =', inputVal.substring(0, 80));

  // 9. v48 semi 模式派单（触发 product card click → 弹 v53 productModal）
  await page.evaluate(() => localStorage.removeItem('umakex_daily_contacted_v1'));
  await page.locator('.ai-seg__opt[data-mode="semi"]').click();
  await page.waitForTimeout(500);
  // 切到 daily tab 找联系人按钮
  await page.locator('.ai-tab[data-tab="daily"]').click();
  await page.waitForTimeout(300);
  const xiaomingBtn = page.locator('.ai-card--daily .daily-item[data-friend-id="xiaoming"] [data-daily-cta]');
  if (await xiaomingBtn.count() > 0) {
    await xiaomingBtn.click();
    await page.waitForTimeout(800);
    // 应该弹 v53 productModal（因为 v48 触发 product card click）
    const productModalVisibleAfterDaily = await page.locator('#productModal').isVisible();
    const salesModalVisibleAfterDaily = await page.locator('#salesModal').isVisible();
    console.log('[9] after xiaoming contact in semi, productModal visible =', productModalVisibleAfterDaily);
    console.log('[9] after xiaoming contact in semi, salesModal visible (should be false) =', salesModalVisibleAfterDaily);
    await page.screenshot({ path: '/Users/michael/.mavis/tmp/mcp-images/mcp-image-8315-v58-2-semi-daily.png' });
  } else {
    console.log('[9] no xiaoming button found');
  }

  await browser.close();
  console.log('=== PASS ===');
})();
