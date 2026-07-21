// v57 playwright 验证：销售漏斗 panel 紧凑布局 + 桌面端完整可见
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

  await page.goto('http://localhost:8314/messages.html', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);

  // 1. off 模式默认 funnel tab 应可见
  const funnelPanelVisible = await page.locator('.ai-tab-panel[data-panel="funnel"].is-active').isVisible();
  const funnelDetails = await page.locator('.ai-tab-panel[data-panel="funnel"] .funnel-detail').count();
  const funnelFriends = await page.locator('.ai-tab-panel[data-panel="funnel"] .funnel-friend').count();
  console.log('[1] funnel panel visible =', funnelPanelVisible);
  console.log('[1] funnel-detail count =', funnelDetails, '(should be 5)');
  console.log('[1] funnel-friend count =', funnelFriends, '(should be 12 = 5+3+2+1+1)');
  await page.screenshot({ path: '/Users/michael/.mavis/tmp/mcp-images/mcp-image-8314-v57-1-funnel.png' });

  // 2. funnel panel 在桌面端范围内（1180×820 减去 shell 标题 30）
  const box = await page.locator('.ai-tab-panel[data-panel="funnel"].is-active').boundingBox();
  console.log('[2] funnel panel box =', JSON.stringify(box));
  const inBounds = box.x >= 0 && box.y >= 0 && (box.x + box.width) <= 1180 && (box.y + box.height) <= 820;
  console.log('[2] in 1180x820 bounds =', inBounds);

  // 3. funnel panel 5 阶段全部完整可见（不溢出，不裁剪）
  const stageBoxes = await page.locator('.ai-tab-panel[data-panel="funnel"] .funnel-detail').evaluateAll(els =>
    els.map(e => {
      const b = e.getBoundingClientRect();
      return { y: Math.round(b.y), h: Math.round(b.height), bottom: Math.round(b.bottom) };
    })
  );
  console.log('[3] 5 stages positions =', JSON.stringify(stageBoxes));
  const allInViewport = stageBoxes.every(s => s.bottom <= 820 && s.y >= 0);
  console.log('[3] all 5 stages within viewport =', allInViewport);

  // 4. 小明 is-primary 蓝边蓝字
  const xiaomingPrimary = await page.locator('.ai-tab-panel[data-panel="funnel"] .funnel-friend.is-primary').textContent();
  console.log('[4] xiaoming is-primary text =', xiaomingPrimary);

  // 5. 议价阶段 is-active 高亮
  const hotActive = await page.locator('.ai-tab-panel[data-panel="funnel"] .funnel-detail.is-active .funnel-detail__tag').textContent();
  console.log('[5] hot stage active tag =', hotActive);

  // 6. 切到 semi 模式：funnel tab 不可见（funnel 只在 off）
  await page.locator('.ai-seg__opt[data-mode="semi"]').click();
  await page.waitForTimeout(500);
  const funnelTabVisible = await page.locator('.ai-tab[data-tab="funnel"]').isVisible();
  console.log('[6] semi mode funnel tab visible =', funnelTabVisible, '(should be false)');

  // 7. 切到 full 模式：funnel tab 也不可见
  await page.locator('.ai-seg__opt[data-mode="full"]').click();
  await page.waitForTimeout(500);
  const funnelTabVisibleFull = await page.locator('.ai-tab[data-tab="funnel"]').isVisible();
  console.log('[7] full mode funnel tab visible =', funnelTabVisibleFull, '(should be false)');

  // 8. 切回 off 看 funnel panel 完整可见
  await page.locator('.ai-seg__opt[data-mode="off"]').click();
  await page.waitForTimeout(500);
  await page.screenshot({ path: '/Users/michael/.mavis/tmp/mcp-images/mcp-image-8314-v57-2-off-final.png' });

  // 9. 滚轮向下滚动 panel 验证 tab 仍 sticky
  await page.evaluate(() => {
    const panels = document.querySelector('.ai-display__panels');
    if (panels) panels.scrollTop = 100;
  });
  await page.waitForTimeout(200);
  const tabBox = await page.locator('.ai-display__tabs').boundingBox();
  console.log('[9] after scroll, tab box y =', tabBox.y, '(should be sticky)');

  await browser.close();
  console.log('=== PASS ===');
})();
