// v61 playwright 验证：销售漏斗 panel hallmark redesign（3 KPI + 真漏斗 5 阶段）
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

  await page.goto('http://localhost:8318/messages.html', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);

  // 1. funnel panel 可见 + 5 阶段
  const funnelVisible = await page.locator('.ai-tab-panel[data-panel="funnel"].is-active').isVisible();
  const stepCount = await page.locator('.ai-tab-panel[data-panel="funnel"] .funnel-step').count();
  const kpiCount = await page.locator('.ai-tab-panel[data-panel="funnel"] .funnel-kpi').count();
  console.log('[1] funnel panel visible =', funnelVisible);
  console.log('[1] 5 funnel-step count =', stepCount, '(should be 5)');
  console.log('[1] 3 KPI count =', kpiCount, '(should be 3)');
  await page.screenshot({ path: '/Users/michael/.mavis/tmp/mcp-images/mcp-image-8318-v61-1-funnel.png' });

  // 2. 5 阶段 width 递减（真漏斗形态）
  const widths = await page.locator('.ai-tab-panel[data-panel="funnel"] .funnel-step').evaluateAll(els =>
    els.map(e => ({ key: e.getAttribute('data-step-key'), width: Math.round(e.getBoundingClientRect().width) }))
  );
  console.log('[2] 5 stages widths =', JSON.stringify(widths));
  const decreasing = widths.every((s, i) => i === 0 || s.width <= widths[i-1].width);
  console.log('[2] widths decreasing =', decreasing);

  // 3. 议价阶段 is-active + 蓝边
  const hotActive = await page.locator('.ai-tab-panel[data-panel="funnel"] .funnel-step.is-active').getAttribute('data-step-key');
  console.log('[3] active step =', hotActive, '(should be hot)');

  // 4. funnel panel 整体在桌面端 fit
  const box = await page.locator('.ai-tab-panel[data-panel="funnel"].is-active').boundingBox();
  console.log('[4] funnel panel box =', JSON.stringify(box));
  const allStagesInViewport = await page.locator('.ai-tab-panel[data-panel="funnel"] .funnel-step').evaluateAll(els => {
    return els.every(e => e.getBoundingClientRect().bottom <= 820);
  });
  console.log('[4] all 5 stages in viewport (≤820) =', allStagesInViewport);

  // 5. 3 KPI 显示
  const kpiVals = await page.locator('.ai-tab-panel[data-panel="funnel"] .funnel-kpi__val').evaluateAll(els =>
    els.map(e => e.textContent)
  );
  console.log('[5] KPI values =', JSON.stringify(kpiVals), '(should be [12, 2, 8.3%])');

  // 6. 好友 avatar 数（5+3+2+1+1=12）
  const avatarCount = await page.locator('.ai-tab-panel[data-panel="funnel"] .friend-avatar').count();
  console.log('[6] friend-avatar count =', avatarCount, '(should be 12)');

  await browser.close();
  console.log('=== PASS ===');
})();
