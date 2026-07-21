// v56b playwright 验证：删 sticky daily + off 加 products + tab sticky
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

  await page.goto('http://localhost:8313/messages.html', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);

  // ===== 1. off 模式：4 tab（funnel / products / daily / metrics）=====
  const offTabs = await page.locator('.ai-tab:visible').evaluateAll(els =>
    els.map(e => e.getAttribute('data-tab'))
  );
  console.log('[off] visible tabs =', JSON.stringify(offTabs));
  await page.screenshot({ path: '/Users/michael/.mavis/tmp/mcp-images/mcp-image-8313-v56b-1-off.png' });

  // ===== 2. sticky 里 daily 已删（只剩 persona + followup）=====
  const stickyCards = await page.locator('.ai-display__sticky .ai-card').evaluateAll(els =>
    els.map(e => e.className)
  );
  console.log('[sticky] cards =', JSON.stringify(stickyCards));

  // ===== 3. sticky daily 不应存在 =====
  const stickyDailyCount = await page.locator('.ai-display__sticky .ai-card--daily').count();
  console.log('[sticky] ai-card--daily count (should be 0) =', stickyDailyCount);

  // ===== 4. tab 列表 sticky 检查 =====
  const tabSticky = await page.locator('.ai-display__tabs').evaluate(el => {
    const style = getComputedStyle(el);
    return { position: style.position, top: style.top, zIndex: style.zIndex };
  });
  console.log('[tab] sticky style =', JSON.stringify(tabSticky));

  // ===== 5. 切 off products tab 看产品图 =====
  await page.locator('.ai-tab[data-tab="products"]').click();
  await page.waitForTimeout(300);
  const offProductsActive = await page.locator('.ai-tab.is-active').getAttribute('data-tab');
  const offProductsCard = await page.locator('.ai-tab-panel[data-panel="products"] .product-card').count();
  console.log('[off] products tab active =', offProductsActive, ', product cards =', offProductsCard);
  await page.screenshot({ path: '/Users/michael/.mavis/tmp/mcp-images/mcp-image-8313-v56b-2-off-products.png' });

  // ===== 6. 切 off daily tab 看 daily 完整列表（5 位）=====
  await page.locator('.ai-tab[data-tab="daily"]').click();
  await page.waitForTimeout(300);
  const offDailyActive = await page.locator('.ai-tab.is-active').getAttribute('data-tab');
  const offDailyItems = await page.locator('.ai-tab-panel[data-panel="daily"] .daily-item').count();
  console.log('[off] daily tab active =', offDailyActive, ', daily items =', offDailyItems);

  // ===== 7. 切 semi 模式：5 tab（analyze / ai-suggest / products / daily / metrics）=====
  await page.locator('.ai-seg__opt[data-mode="semi"]').click();
  await page.waitForTimeout(500);
  const semiTabs = await page.locator('.ai-tab:visible').evaluateAll(els =>
    els.map(e => e.getAttribute('data-tab'))
  );
  console.log('[semi] visible tabs =', JSON.stringify(semiTabs));
  await page.screenshot({ path: '/Users/michael/.mavis/tmp/mcp-images/mcp-image-8313-v56b-3-semi.png' });

  // ===== 8. 切 full 模式：3 tab（activity / daily / metrics）=====
  await page.locator('.ai-seg__opt[data-mode="full"]').click();
  await page.waitForTimeout(500);
  const fullTabs = await page.locator('.ai-tab:visible').evaluateAll(els =>
    els.map(e => e.getAttribute('data-tab'))
  );
  console.log('[full] visible tabs =', JSON.stringify(fullTabs));
  await page.screenshot({ path: '/Users/michael/.mavis/tmp/mcp-images/mcp-image-8313-v56b-4-full.png' });

  // ===== 9. 滚动 panel 验证 tab sticky =====
  await page.locator('.ai-tab[data-tab="activity"]').click();
  await page.waitForTimeout(300);
  // 模拟滚动
  await page.evaluate(() => {
    const panels = document.querySelector('.ai-display__panels');
    if (panels) panels.scrollTop = 200;
  });
  await page.waitForTimeout(200);
  const tabStillVisible = await page.locator('.ai-display__tabs').isVisible();
  const tabBox = await page.locator('.ai-display__tabs').boundingBox();
  console.log('[full] after scroll, tab visible =', tabStillVisible, ', tab box top =', tabBox.y);

  await browser.close();
  console.log('=== PASS ===');
})();
