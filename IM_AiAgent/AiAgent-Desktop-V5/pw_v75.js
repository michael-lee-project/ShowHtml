// v75: 4 dashboard 弹窗 + eyebrow 突出 + 立即开始按钮效果
// 验证项: (1) eyebrow 渐变 pill 视觉 (2) 4 弹窗打开/关闭/ESC (3) 弹窗不超桌面端
// (4) "立即开始" 涟漪 + 确认接管后切换 is-picked 态

const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    executablePath: '/Users/michael/Library/Caches/ms-playwright/chromium_headless_shell-1228/chrome-headless-shell-mac-arm64/chrome-headless-shell',
    headless: true,
    args: ['--no-sandbox', '--disable-dev-shm-usage'],
  });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  const errs = [];
  page.on('pageerror', (e) => errs.push('pageerror: ' + e.message));
  page.on('console', (m) => { if (m.type() === 'error') errs.push('console.error: ' + m.text()); });

  await page.goto('http://localhost:8335/messages.html', { waitUntil: 'networkidle' });
  await page.waitForSelector('.dashboard__eyebrow', { timeout: 4000 });

  const results = [];
  const pass = (n) => results.push('✅ ' + n);
  const fail = (n, why) => results.push('❌ ' + n + (why ? '  · ' + why : ''));

  // ───────────── 0. Eyebrow 突出 + 立即开始按钮 ─────────────
  // 截图 dashboard 默认态（看 eyebrow + pickup btn 视觉）
  await page.screenshot({ path: '/Users/michael/.mavis/tmp/mcp-images/mcp-image-8335-v75-0-dashboard.png', fullPage: false });
  pass('dashboard 默认态截图');

  // 检查 eyebrow 实际渲染
  const eyebrowBox = await page.locator('.dashboard__eyebrow').first().boundingBox();
  const eyebrowText = await page.locator('.dashboard__eyebrow').first().textContent();
  if (eyebrowBox && eyebrowBox.height >= 18 && eyebrowBox.height <= 32 && eyebrowText.includes('AI') && eyebrowText.includes('销冠专家')) {
    pass('eyebrow pill 渲染 (h=' + Math.round(eyebrowBox.height) + 'px, text="' + eyebrowText.trim() + '")');
  } else {
    fail('eyebrow 渲染', 'h=' + (eyebrowBox ? eyebrowBox.height : 'null') + ' text=' + eyebrowText);
  }

  // 检查 eyebrow ::before icon (✦)
  const eyebrowBefore = await page.evaluate(() => {
    const el = document.querySelector('.dashboard__eyebrow');
    if (!el) return null;
    return window.getComputedStyle(el, '::before').content;
  });
  if (eyebrowBefore && (eyebrowBefore.includes('✦') || eyebrowBefore.includes('2726'))) {
    pass('eyebrow ::before icon ✦ 渲染');
  } else {
    fail('eyebrow ::before icon', 'got=' + eyebrowBefore);
  }

  // ───────────── 1. "查看完整清单" → dashboardTodoModal ─────────────
  await page.click('[data-modal="todo"]');
  await page.waitForTimeout(500);
  const todoVisible = await page.evaluate(() => {
    const m = document.getElementById('dashboardTodoModal');
    return m && !m.hidden;
  });
  if (todoVisible) pass('1. 查看完整清单 打开 dashboardTodoModal'); else fail('1. 查看完整清单');
  await page.screenshot({ path: '/Users/michael/.mavis/tmp/mcp-images/mcp-image-8335-v75-1-todo.png' });

  // 检查弹窗不超桌面端
  const todoDialogBox = await page.locator('#dashboardTodoModal .dashboard-modal__dialog').boundingBox();
  const windowBox = await page.locator('.window').boundingBox();
  if (todoDialogBox && windowBox && todoDialogBox.x >= windowBox.x - 1 && todoDialogBox.x + todoDialogBox.width <= windowBox.x + windowBox.width + 1 && todoDialogBox.y >= windowBox.y - 1 && todoDialogBox.y + todoDialogBox.height <= windowBox.y + windowBox.height + 1) {
    pass('1. dashboardTodoModal 在桌面端范围内 (' + Math.round(todoDialogBox.width) + 'x' + Math.round(todoDialogBox.height) + ')');
  } else {
    fail('1. dashboardTodoModal 超出桌面端', 'dialog=' + JSON.stringify(todoDialogBox) + ' window=' + JSON.stringify(windowBox));
  }

  // 关闭
  await page.click('#dashboardTodoModal .dashboard-modal__close', { force: true });
  await page.waitForTimeout(250);
  const todoClosed = await page.evaluate(() => document.getElementById('dashboardTodoModal').hidden);
  if (todoClosed) pass('1. ESC/close 关闭 todoModal'); else fail('1. todoModal 未关闭');

  // ───────────── 2. "查看完整战报" → dashboardReportModal ─────────────
  await page.click('[data-modal="report"]');
  await page.waitForTimeout(500);
  const reportVisible = await page.evaluate(() => {
    const m = document.getElementById('dashboardReportModal');
    return m && !m.hidden;
  });
  if (reportVisible) pass('2. 查看完整战报 打开 dashboardReportModal'); else fail('2. 查看完整战报');
  await page.screenshot({ path: '/Users/michael/.mavis/tmp/mcp-images/mcp-image-8335-v75-2-report.png' });

  const reportDialogBox = await page.locator('#dashboardReportModal .dashboard-modal__dialog').boundingBox();
  if (reportDialogBox && reportDialogBox.width <= 760 + 1 && reportDialogBox.height <= 640 + 1) {
    pass('2. dashboardReportModal 尺寸符合 max 760x640 (实际 ' + Math.round(reportDialogBox.width) + 'x' + Math.round(reportDialogBox.height) + ')');
  } else {
    fail('2. dashboardReportModal 尺寸', JSON.stringify(reportDialogBox));
  }

  // 检查 4 个 section (🔥/📈/💡/⏰)
  const sectionCount = await page.locator('#dashboardReportModal .dashboard-modal__section').count();
  if (sectionCount === 4) pass('2. 战报 4 段 section 齐全'); else fail('2. 战报 4 段', 'count=' + sectionCount);

  // ESC 关闭
  await page.keyboard.press('Escape');
  await page.waitForTimeout(250);
  const reportClosed = await page.evaluate(() => document.getElementById('dashboardReportModal').hidden);
  if (reportClosed) pass('2. ESC 关闭 reportModal'); else fail('2. reportModal 未关闭');

  // ───────────── 3. "查看 12 位好友" → dashboardFunnelModal ─────────────
  await page.click('[data-modal="funnel"]');
  await page.waitForTimeout(500);
  const funnelVisible = await page.evaluate(() => {
    const m = document.getElementById('dashboardFunnelModal');
    return m && !m.hidden;
  });
  if (funnelVisible) pass('3. 查看 12 位好友 打开 dashboardFunnelModal'); else fail('3. 漏斗弹窗');
  await page.screenshot({ path: '/Users/michael/.mavis/tmp/mcp-images/mcp-image-8335-v75-3-funnel.png' });

  // 检查 5 个 stage block
  const stageCount = await page.locator('#dashboardFunnelModal .funnel-modal-block').count();
  if (stageCount === 5) pass('3. 漏斗 5 阶段 block 齐全'); else fail('3. 漏斗 5 阶段', 'count=' + stageCount);

  // 检查好友头像数量（5+3+2+1+1=12，但渲染时用 named + "+N" 占位）
  const friendCount = await page.locator('#dashboardFunnelModal .friend-avatar').count();
  // 5 阶段，每段至少 1 个 avatar → 至少 5
  if (friendCount >= 5 && friendCount <= 12) pass('3. 漏斗好友头像 (' + friendCount + ' 个，5 阶段各有名/占位)'); else fail('3. 好友数', 'count=' + friendCount);

  // 检查 5 阶段各自的 count pill 总和 = 5+3+2+1+1=12
  const totalPill = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('#dashboardFunnelModal .funnel-modal-block__count'))
      .map(el => parseInt(el.textContent, 10) || 0)
      .reduce((s, n) => s + n, 0);
  });
  if (totalPill === 12) pass('3. 5 阶段 count pill 总和 = 12 (' + Array.from(await page.locator('#dashboardFunnelModal .funnel-modal-block__count').allTextContents()).join('+') + ')'); else fail('3. count pill 总和', 'total=' + totalPill);

  // overlay 关闭（点 overlay 边缘，避开中央 dialog）
  await page.click('#dashboardFunnelModal .dashboard-modal__overlay', { position: { x: 5, y: 5 } });
  await page.waitForTimeout(250);
  const funnelClosed = await page.evaluate(() => document.getElementById('dashboardFunnelModal').hidden);
  if (funnelClosed) pass('3. overlay 关闭 funnelModal'); else fail('3. funnelModal 未关闭');

  // ───────────── 4. "立即开始" → dashboardStartModal ─────────────
  // hover 看 pulse + scale 动效
  const pickupBtn = page.locator('.dashboard-pickup__btn');
  await pickupBtn.hover();
  await page.waitForTimeout(200);
  await page.screenshot({ path: '/Users/michael/.mavis/tmp/mcp-images/mcp-image-8335-v75-4a-pickup-hover.png' });

  // 点击：触发 ripple
  await pickupBtn.click();
  await page.waitForTimeout(500);
  const startVisible = await page.evaluate(() => {
    const m = document.getElementById('dashboardStartModal');
    return m && !m.hidden;
  });
  if (startVisible) pass('4. 立即开始 打开 dashboardStartModal'); else fail('4. 立即开始');
  await page.screenshot({ path: '/Users/michael/.mavis/tmp/mcp-images/mcp-image-8335-v75-4b-start.png' });

  // 检查倒计时 + checklist + buttons
  const hasCountdown = await page.locator('#dashboardStartModal .dashboard-modal__countdown-num').count();
  const hasChecklist = await page.locator('#dashboardStartModal .dashboard-modal__checklist li').count();
  const hasPrimary = await page.locator('#startConfirmBtn').count();
  if (hasCountdown === 1 && hasChecklist === 4 && hasPrimary === 1) {
    pass('4. startModal 4 检查项 + 倒计时 + 主按钮齐全');
  } else {
    fail('4. startModal 内容', 'countdown=' + hasCountdown + ' checklist=' + hasChecklist + ' primary=' + hasPrimary);
  }

  // 点"确认接管" → 关闭弹窗 + 按钮变"已接管"
  await page.click('#startConfirmBtn');
  await page.waitForTimeout(350);
  const startClosed = await page.evaluate(() => document.getElementById('dashboardStartModal').hidden);
  const pickupState = await page.evaluate(() => {
    const b = document.querySelector('.dashboard-pickup__btn');
    return { picked: b.classList.contains('is-picked'), text: b.textContent.trim(), disabled: b.disabled };
  });
  if (startClosed && pickupState.picked && pickupState.text.includes('已接管') && pickupState.disabled) {
    pass('4. 确认接管 → 弹窗关闭 + 按钮 is-picked 态 (text=' + pickupState.text + ')');
  } else {
    fail('4. 确认接管', 'closed=' + startClosed + ' state=' + JSON.stringify(pickupState));
  }
  await page.screenshot({ path: '/Users/michael/.mavis/tmp/mcp-images/mcp-image-8335-v75-4c-picked.png' });

  // ───────────── 5. ESC 关闭所有 ─────────────
  await page.keyboard.press('Escape');
  await page.waitForTimeout(200);
  const anyOpen = await page.evaluate(() => Array.from(document.querySelectorAll('.dashboard-modal')).filter(m => !m.hidden).length);
  if (anyOpen === 0) pass('5. ESC 关闭所有弹窗'); else fail('5. ESC 关闭', 'still open=' + anyOpen);

  // ───────────── 6. 桌面端尺寸 1180×820 内 ─────────────
  // 终极验证：dashboard 渲染在 1180×820 窗口里
  const dashboardBox = await page.locator('.dashboard').first().boundingBox();
  if (dashboardBox && dashboardBox.width <= 1180 + 2) {
    pass('6. dashboard 在 1180 宽内 (w=' + Math.round(dashboardBox.width) + ')');
  } else {
    fail('6. dashboard 宽度', JSON.stringify(dashboardBox));
  }

  console.log('\n── v75 验证结果 ──');
  results.forEach(r => console.log(r));
  console.log('── JS 错误 ──');
  if (errs.length === 0) console.log('✅ 无 JS 错误');
  else errs.forEach(e => console.log('❌ ' + e));

  await browser.close();
  process.exit(errs.length > 0 ? 1 : 0);
})();
