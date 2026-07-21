// v62 playwright 验证：议价阶段行动按钮（加日历 / 准备话术）
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

  await page.goto('http://localhost:8319/messages.html', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);

  // 1. 议价阶段 2 个按钮存在
  const calendarBtn = await page.locator('.funnel-action-btn[data-funnel-action="calendar"]').count();
  const prepareBtn = await page.locator('.funnel-action-btn[data-funnel-action="prepare-script"]').count();
  console.log('[1] calendar button count =', calendarBtn);
  console.log('[1] prepare-script button count =', prepareBtn);

  // 2. 按钮在议价阶段内（is-active 阶段）
  const isInHotStage = await page.locator('.funnel-step--hot.is-active .funnel-step__actions').count();
  console.log('[2] actions inside hot active stage =', isInHotStage);

  // 3. 桌面端 fit
  const box = await page.locator('.ai-tab-panel[data-panel="funnel"].is-active').boundingBox();
  console.log('[3] funnel panel box =', JSON.stringify(box));
  const inViewport = box.x >= 0 && box.y >= 0 && (box.x + box.width) <= 1230 && (box.y + box.height) <= 820;
  console.log('[3] in viewport (≤820) =', box.y + box.height <= 820);
  await page.screenshot({ path: '/Users/michael/.mavis/tmp/mcp-images/mcp-image-8319-v62-1-funnel.png' });

  // 4. 点击"加日历" → toast 弹出
  await page.locator('.funnel-action-btn[data-funnel-action="calendar"]').click();
  await page.waitForTimeout(300);
  const toast = await page.locator('.daily-toast').count();
  const toastText = await page.locator('.daily-toast').textContent().catch(() => '');
  console.log('[4] toast count =', toast, ', text =', toastText);
  await page.screenshot({ path: '/Users/michael/.mavis/tmp/mcp-images/mcp-image-8319-v62-2-toast.png' });
  await page.waitForTimeout(2500);  // 等 toast 消失

  // 5. 点击"准备话术" → 弹 v53 productModal
  await page.locator('.funnel-action-btn[data-funnel-action="prepare-script"]').click();
  await page.waitForTimeout(500);
  const productModalVisible = await page.locator('#productModal').isVisible();
  console.log('[5] productModal visible after click prepare-script =', productModalVisible);
  await page.screenshot({ path: '/Users/michael/.mavis/tmp/mcp-images/mcp-image-8319-v62-3-prepare.png' });

  // 6. 关闭 productModal 验证还能点按钮
  await page.keyboard.press('Escape');
  await page.waitForTimeout(300);
  const modalClosed = !(await page.locator('#productModal').isVisible());
  console.log('[6] productModal closed after Esc =', modalClosed);

  await browser.close();
  console.log('=== PASS ===');
})();
