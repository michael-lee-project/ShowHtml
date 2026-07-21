// v55 playwright 验证：全局重置按钮
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

  await page.goto('http://localhost:8311/messages.html', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);

  // ===== 1. 重置按钮存在 =====
  const resetExists = await page.locator('#chatReset').count();
  console.log('[1] chatReset button count =', resetExists);
  await page.screenshot({ path: '/Users/michael/.mavis/tmp/mcp-images/mcp-image-8311-v55-1-default.png' });

  // ===== 2. 制造状态：v47 标记 1 个已联系 + v50 切 tab =====
  // v47: 点小明的"联系"按钮
  const xiaomingBtn = page.locator('.ai-card--daily .daily-item[data-friend-id="xiaoming"] [data-daily-cta]');
  if (await xiaomingBtn.count() > 0) {
    await xiaomingBtn.click();
    await page.waitForTimeout(300);
    const xmState = await page.locator('.ai-card--daily .daily-item[data-friend-id="xiaoming"]').getAttribute('class');
    console.log('[2] xiaoming class after contact =', xmState);
  }

  // v50: 切到 stats tab
  await page.locator('.ai-seg__opt[data-mode="semi"]').click();
  await page.waitForTimeout(300);
  await page.locator('.ai-tab[data-tab="stats"]').click();
  await page.waitForTimeout(300);
  const storedTab = await page.evaluate(() => localStorage.getItem('umakex_display_tab_v1'));
  console.log('[2] stored display tab =', storedTab);

  // v51: 折叠 persona
  const personaToggle = page.locator('.persona__head');
  if (await personaToggle.count() > 0) {
    await personaToggle.click();
    await page.waitForTimeout(300);
    const storedPersona = await page.evaluate(() => localStorage.getItem('umakex_persona_expanded_v1'));
    console.log('[2] stored persona expanded =', storedPersona);
  }

  // 验证 localStorage 现在有几个 umakex_ key
  const beforeReset = await page.evaluate(() => {
    var keys = [];
    for (var i = 0; i < localStorage.length; i++) {
      var k = localStorage.key(i);
      if (k && k.indexOf('umakex_') === 0) keys.push(k);
    }
    return keys;
  });
  console.log('[2] umakex_ keys BEFORE reset =', JSON.stringify(beforeReset));
  await page.screenshot({ path: '/Users/michael/.mavis/tmp/mcp-images/mcp-image-8311-v55-2-modified.png' });

  // ===== 3. 点重置按钮 =====
  await page.locator('#chatReset').click();
  await page.waitForTimeout(800); // 等 reload

  // ===== 4. 验证 localStorage 已清空 =====
  const afterReset = await page.evaluate(() => {
    var keys = [];
    for (var i = 0; i < localStorage.length; i++) {
      var k = localStorage.key(i);
      if (k && k.indexOf('umakex_') === 0) keys.push(k);
    }
    return keys;
  });
  console.log('[4] umakex_ keys AFTER reset =', JSON.stringify(afterReset));

  // ===== 5. 验证页面状态：tab 回到默认 =====
  // 切回 semi 模式看默认 tab
  await page.locator('.ai-seg__opt[data-mode="semi"]').click();
  await page.waitForTimeout(300);
  const activeTabAfter = await page.locator('.ai-tab.is-active').getAttribute('data-tab');
  console.log('[5] active tab after reset (should be ai-suggest) =', activeTabAfter);
  await page.screenshot({ path: '/Users/michael/.mavis/tmp/mcp-images/mcp-image-8311-v55-5-after-reset.png' });

  // ===== 6. 验证 xiaoming 已联系状态被清 =====
  const xmClass = await page.locator('.ai-card--daily .daily-item[data-friend-id="xiaoming"]').getAttribute('class');
  console.log('[6] xiaoming class after reset =', xmClass, '(should NOT contain is-contacted)');

  await browser.close();
  console.log('=== PASS ===');
})();
