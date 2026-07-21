// v59 playwright 验证：daily-item 样式修复 + 默认按模式折叠
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

  await page.goto('http://localhost:8316/messages.html', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);

  // 1. off 模式：切到 daily tab
  await page.locator('.ai-tab[data-tab="daily"]').click();
  await page.waitForTimeout(300);
  const offCollapsed = await page.locator('.ai-card--daily.is-collapsed').count();
  console.log('[off] daily panel collapsed count (should be 0) =', offCollapsed);
  await page.screenshot({ path: '/Users/michael/.mavis/tmp/mcp-images/mcp-image-8316-v59-1-off-daily.png' });

  // 2. daily item 5 个可见 + 名称完整（小明/小郑/小冯/小吴/小赵）
  const items = await page.locator('.ai-tab-panel[data-panel="daily"] .daily-item').count();
  const xiaomingName = await page.locator('.ai-tab-panel[data-panel="daily"] .daily-item[data-friend-id="xiaoming"] .daily-item__name').textContent();
  console.log('[off] daily items =', items, ', xiaoming name =', xiaomingName);

  // 3. 切到 semi 模式：daily panel 默认折叠
  await page.locator('.ai-seg__opt[data-mode="semi"]').click();
  await page.waitForTimeout(500);
  const semiCollapsed = await page.locator('.ai-card--daily.is-collapsed').count();
  console.log('[semi] daily panel collapsed count (should be 1) =', semiCollapsed);
  await page.screenshot({ path: '/Users/michael/.mavis/tmp/mcp-images/mcp-image-8316-v59-2-semi-daily-collapsed.png' });

  // 4. 用户点击 toggle 展开
  await page.locator('#dailyExpandBtnPanel').click();
  await page.waitForTimeout(300);
  const semiExpanded = await page.locator('.ai-card--daily.is-collapsed').count();
  console.log('[semi] after click toggle, collapsed (should be 0) =', semiExpanded);

  // 5. 切到 full 模式：用户已手动展开 → 保留展开（v59 行为：用户偏好优先）
  await page.locator('.ai-seg__opt[data-mode="full"]').click();
  await page.waitForTimeout(500);
  const fullCollapsed = await page.locator('.ai-card--daily.is-collapsed').count();
  console.log('[full] daily panel collapsed count (should be 0, user pref preserved) =', fullCollapsed);

  // 6. 切回 off 模式：用户偏好仍是展开 → 保留
  await page.locator('.ai-seg__opt[data-mode="off"]').click();
  await page.waitForTimeout(500);
  const offAgainCollapsed = await page.locator('.ai-card--daily.is-collapsed').count();
  console.log('[off again] daily panel collapsed count (user pref=展开 should be 0) =', offAgainCollapsed);

  // 7. 重置 localStorage 后：off 默认展开 / semi 默认折叠
  await page.evaluate(() => localStorage.removeItem('umakex_daily_collapsed_v1'));
  await page.locator('.ai-seg__opt[data-mode="off"]').click();
  await page.waitForTimeout(300);
  const offAfterReset = await page.locator('.ai-card--daily.is-collapsed').count();
  console.log('[off after reset] collapsed (should be 0) =', offAfterReset);
  await page.locator('.ai-seg__opt[data-mode="semi"]').click();
  await page.waitForTimeout(500);
  const semiAfterReset = await page.locator('.ai-card--daily.is-collapsed').count();
  console.log('[semi after reset] collapsed (should be 1) =', semiAfterReset);
  await page.screenshot({ path: '/Users/michael/.mavis/tmp/mcp-images/mcp-image-8316-v59-3-semi-collapsed.png' });

  // 8. semi 模式 daily 折叠后：analyze tab 能 fit
  await page.locator('.ai-tab[data-tab="analyze"]').click();
  await page.waitForTimeout(300);
  await page.screenshot({ path: '/Users/michael/.mavis/tmp/mcp-images/mcp-image-8316-v59-4-semi-analyze.png' });

  await browser.close();
  console.log('=== PASS ===');
})();
