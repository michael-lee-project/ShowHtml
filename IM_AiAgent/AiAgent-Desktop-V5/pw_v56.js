// v56 playwright 验证：3 模式 tab 分流
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

  await page.goto('http://localhost:8312/messages.html', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);

  // ===== 1. off 模式：3 tab 可见 =====
  const offTabs = await page.locator('.ai-tab:visible').evaluateAll(els =>
    els.map(e => ({ key: e.getAttribute('data-tab'), name: e.querySelector('.ai-tab__name')?.textContent }))
  );
  console.log('[off] visible tabs =', JSON.stringify(offTabs));
  const offActive = await page.locator('.ai-tab.is-active').getAttribute('data-tab');
  const offActiveName = await page.locator('.ai-tab.is-active .ai-tab__name').textContent();
  console.log('[off] active tab =', offActive, '(' + offActiveName + ')');
  await page.screenshot({ path: '/Users/michael/.mavis/tmp/mcp-images/mcp-image-8312-v56-1-off.png' });

  // ===== 2. off 切到 metrics tab =====
  await page.locator('.ai-tab[data-tab="metrics"]').click();
  await page.waitForTimeout(300);
  const offMetricsActive = await page.locator('.ai-tab.is-active').getAttribute('data-tab');
  const offMetricsPanelVisible = await page.locator('.ai-tab-panel[data-panel="metrics"].is-active').isVisible();
  console.log('[off] click metrics → active =', offMetricsActive, ', panel visible =', offMetricsPanelVisible);

  // ===== 3. 切到 daily tab =====
  await page.locator('.ai-tab[data-tab="daily"]').click();
  await page.waitForTimeout(300);
  const offDailyActive = await page.locator('.ai-tab.is-active').getAttribute('data-tab');
  const offDailyPanel = await page.locator('.ai-tab-panel[data-panel="daily"] .daily-item').count();
  console.log('[off] click daily → active =', offDailyActive, ', daily items in panel =', offDailyPanel);

  // ===== 4. 切到 semi 模式 =====
  await page.locator('.ai-seg__opt[data-mode="semi"]').click();
  await page.waitForTimeout(500);
  const semiTabs = await page.locator('.ai-tab:visible').evaluateAll(els =>
    els.map(e => ({ key: e.getAttribute('data-tab'), name: e.querySelector('.ai-tab__name')?.textContent }))
  );
  console.log('[semi] visible tabs =', JSON.stringify(semiTabs));
  const semiActive = await page.locator('.ai-tab.is-active').getAttribute('data-tab');
  const semiActiveName = await page.locator('.ai-tab.is-active .ai-tab__name').textContent();
  console.log('[semi] active tab =', semiActive, '(' + semiActiveName + ')');
  await page.screenshot({ path: '/Users/michael/.mavis/tmp/mcp-images/mcp-image-8312-v56-2-semi.png' });

  // ===== 5. semi 切到 ai-suggest =====
  await page.locator('.ai-tab[data-tab="ai-suggest"]').click();
  await page.waitForTimeout(300);
  const semiSuggestActive = await page.locator('.ai-tab.is-active').getAttribute('data-tab');
  console.log('[semi] click ai-suggest → active =', semiSuggestActive);

  // ===== 6. 切到 products tab =====
  await page.locator('.ai-tab[data-tab="products"]').click();
  await page.waitForTimeout(300);
  const semiProductsActive = await page.locator('.ai-tab.is-active').getAttribute('data-tab');
  const semiProductsCard = await page.locator('.ai-tab-panel[data-panel="products"] .product-card').count();
  console.log('[semi] click products → active =', semiProductsActive, ', product cards in panel =', semiProductsCard);

  // ===== 7. 切到 full 模式 =====
  await page.locator('.ai-seg__opt[data-mode="full"]').click();
  await page.waitForTimeout(500);
  const fullTabs = await page.locator('.ai-tab:visible').evaluateAll(els =>
    els.map(e => ({ key: e.getAttribute('data-tab'), name: e.querySelector('.ai-tab__name')?.textContent }))
  );
  console.log('[full] visible tabs =', JSON.stringify(fullTabs));
  const fullActive = await page.locator('.ai-tab.is-active').getAttribute('data-tab');
  const fullActiveName = await page.locator('.ai-tab.is-active .ai-tab__name').textContent();
  console.log('[full] active tab =', fullActive, '(' + fullActiveName + ')');
  await page.screenshot({ path: '/Users/michael/.mavis/tmp/mcp-images/mcp-image-8312-v56-3-full.png' });

  // ===== 8. full 切回 off 模式（验证 tab 列表重置） =====
  await page.locator('.ai-seg__opt[data-mode="off"]').click();
  await page.waitForTimeout(500);
  const offAgain = await page.locator('.ai-tab:visible').evaluateAll(els =>
    els.map(e => e.getAttribute('data-tab'))
  );
  const offAgainActive = await page.locator('.ai-tab.is-active').getAttribute('data-tab');
  console.log('[off again] visible tabs =', JSON.stringify(offAgain));
  console.log('[off again] active =', offAgainActive, '(should be funnel default or stored)');

  await browser.close();
  console.log('=== PASS ===');
})();
