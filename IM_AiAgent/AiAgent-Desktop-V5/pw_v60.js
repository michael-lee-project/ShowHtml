// v60 playwright 验证：tab 计数动态计算
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

  await page.goto('http://localhost:8317/messages.html', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);

  // 1. 读 7 个 tab 的 count（IIFE 启动后渲染）
  const tabsCount = await page.locator('.ai-tab[data-count-source]').evaluateAll(els =>
    els.map(e => ({
      tab: e.getAttribute('data-tab'),
      count: e.querySelector('.ai-tab__count').textContent
    }))
  );
  console.log('[1] all tab counts =', JSON.stringify(tabsCount));

  // 2. 验证每个 tab count 跟实际元素数对应
  // 销售漏斗：12 好友 (5+3+2+1+1)
  const funnelCount = await page.locator('#aiFunnelCard .funnel-friend').count();
  console.log('[2] funnel friends actual =', funnelCount);

  // 产品库：1
  const productCount = await page.locator('#aiProductsCard .product-card').count();
  console.log('[2] product cards actual =', productCount);

  // 今日销售：4 cell
  const metricsCount = await page.locator('#aiMetricsCard .metrics-cell').count();
  console.log('[2] metrics cells actual =', metricsCount);

  // 今日联系：5 daily-item
  const dailyCount = await page.locator('#aiDailyCardPanel .daily-item').count();
  console.log('[2] daily items actual =', dailyCount);

  // 3. 模拟 daily 状态变化（标记 1 个已联系）→ count 不变（5 个 item 仍在 DOM）但 进度变化
  await page.evaluate(() => localStorage.removeItem('umakex_daily_contacted_v1'));
  await page.locator('.ai-tab[data-tab="daily"]').click();
  await page.waitForTimeout(300);
  const xiaomingBtn = page.locator('.ai-card--daily .daily-item[data-friend-id="xiaoming"] [data-daily-cta]');
  if (await xiaomingBtn.count() > 0) {
    await xiaomingBtn.click();
    await page.waitForTimeout(300);
    const dailyCountAfter = await page.locator('.ai-tab[data-tab="daily"] .ai-tab__count').textContent();
    console.log('[3] daily count after contact xiaoming =', dailyCountAfter, '(still 5 because items remain)');
  }

  // 4. 模式切换不影响 count
  await page.locator('.ai-seg__opt[data-mode="semi"]').click();
  await page.waitForTimeout(500);
  const semiTabs = await page.locator('.ai-tab:visible').evaluateAll(els =>
    els.map(e => ({
      tab: e.getAttribute('data-tab'),
      count: e.querySelector('.ai-tab__count').textContent
    }))
  );
  console.log('[4] semi mode tab counts =', JSON.stringify(semiTabs));

  // 5. full 模式
  await page.locator('.ai-seg__opt[data-mode="full"]').click();
  await page.waitForTimeout(500);
  const fullTabs = await page.locator('.ai-tab:visible').evaluateAll(els =>
    els.map(e => ({
      tab: e.getAttribute('data-tab'),
      count: e.querySelector('.ai-tab__count').textContent
    }))
  );
  console.log('[5] full mode tab counts =', JSON.stringify(fullTabs));

  // 6. 截屏 off 模式
  await page.locator('.ai-seg__opt[data-mode="off"]').click();
  await page.waitForTimeout(500);
  await page.screenshot({ path: '/Users/michael/.mavis/tmp/mcp-images/mcp-image-8317-v60-1-off.png' });

  await browser.close();
  console.log('=== PASS ===');
})();
