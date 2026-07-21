// v81: 详情弹窗 tab + 销售话术（4 款 × 3 风格 × 4 条 = 48 条）
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

  await page.goto('http://localhost:8341/dashboard.html', { waitUntil: 'networkidle' });
  await page.waitForSelector('.product-card', { timeout: 4000 });
  await page.waitForTimeout(500);

  const results = [];
  const pass = (n) => results.push('✅ ' + n);
  const fail = (n, why) => results.push('❌ ' + n + (why ? '  · ' + why : ''));

  // 1. 打开 8000 详情 → 切到话术 tab
  await page.click('.product-card[data-product-key="8000"]');
  await page.waitForTimeout(500);
  await page.click('[data-detail-tab="script"]');
  await page.waitForTimeout(400);
  const scriptVisible = await page.evaluate(() => !document.querySelector('[data-detail-panel="script"]').hidden);
  if (scriptVisible) pass('1. 切到话术 tab 显示');
  else fail('1. 切话术 tab');

  // 2. 默认 soft 风格 + 4 条话术
  const scriptsCount = await page.locator('#productScriptList .product-script__item').count();
  if (scriptsCount === 4) pass('2. 默认 soft 风格 4 条话术');
  else fail('2. 话术条数', 'count=' + scriptsCount);

  // 3. 切到 data 风格
  await page.click('.product-script__style[data-script-style="data"]');
  await page.waitForTimeout(300);
  const dataCount = await page.locator('#productScriptList .product-script__item').count();
  const dataFirst = await page.locator('#productScriptList .product-script__item-text').first().textContent();
  if (dataCount === 4 && dataFirst.includes('60%')) pass('3. 切到 data 风格 4 条 + 60% 数据');
  else fail('3. data 风格', 'count=' + dataCount + ' first=' + dataFirst);

  // 4. 切到 pro 风格
  await page.click('.product-script__style[data-script-style="pro"]');
  await page.waitForTimeout(300);
  const proFirst = await page.locator('#productScriptList .product-script__item-text').first().textContent();
  if (proFirst.includes('618')) pass('4. 切到 pro 风格 · 包含"618"主动话术');
  else fail('4. pro 风格', 'first=' + proFirst);

  // 5. 4 款产品各 3 风格都有话术
  for (const key of ['8000', '10000', '5000', '3000']) {
    await page.keyboard.press('Escape');
    await page.waitForTimeout(200);
    await page.click(`.product-card[data-product-key="${key}"]`);
    await page.waitForTimeout(500);
    await page.click('[data-detail-tab="script"]');
    await page.waitForTimeout(300);
    for (const style of ['soft', 'data', 'pro']) {
      await page.click(`.product-script__style[data-script-style="${style}"]`);
      await page.waitForTimeout(250);
      const cnt = await page.locator('#productScriptList .product-script__item').count();
      const first = await page.locator('#productScriptList .product-script__item-text').first().textContent();
      if (cnt !== 4) {
        fail(`5.${key}.${style}`, 'count=' + cnt);
      }
    }
    pass(`5.${key} 3 风格各 4 条话术`);
  }

  // 6. 复制按钮（用 ctx permission 允许 clipboard）
  await ctx.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.keyboard.press('Escape');
  await page.waitForTimeout(200);
  await page.click('.product-card[data-product-key="5000"]');
  await page.waitForTimeout(500);
  await page.click('[data-detail-tab="script"]');
  await page.waitForTimeout(300);
  await page.click('#productScriptList .product-script__item:first-child [data-script-action="copy"]');
  await page.waitForTimeout(400);
  const copyBtnText = await page.locator('#productScriptList .product-script__item:first-child [data-script-action="copy"]').textContent();
  const copyFlag = await page.evaluate(() => navigator.clipboard.readText().catch(() => ''));
  if (copyBtnText.includes('已复制') && (copyFlag.includes('5000') || copyFlag.includes('标准'))) {
    pass('6. 复制按钮 · 剪贴板含话术 + 按钮变"已复制"');
  } else {
    fail('6. 复制', 'btn=' + copyBtnText + ' clipboard=' + copyFlag.substring(0, 30));
  }

  // 7. 填入对话按钮（独立页没 chatInput，应弹 alert；用 dialog handler 捕获）
  let fillDialogText = '';
  const fillDialogHandler = d => { fillDialogText = d.message(); d.dismiss(); };
  page.on('dialog', fillDialogHandler);
  await page.waitForTimeout(1500); // 等复制状态恢复
  await page.click('#productScriptList .product-script__item:first-child [data-script-action="fill"]');
  await page.waitForTimeout(500);
  if (fillDialogText.includes('5000') || fillDialogText.includes('标准')) {
    pass('7. 填入对话按钮 · 独立页弹 alert 含话术内容');
  } else {
    fail('7. 填入', 'alert=' + fillDialogText.substring(0, 50));
  }
  page.off('dialog', fillDialogHandler);
  await page.waitForTimeout(1500);

  // 8. 切回详情 tab
  await page.click('[data-detail-tab="info"]');
  await page.waitForTimeout(300);
  const infoVisible = await page.evaluate(() => !document.querySelector('[data-detail-panel="info"]').hidden);
  if (infoVisible) pass('8. 切回详情 tab');
  else fail('8. 切回详情');

  // 9. 切产品时（重复打开 10000）默认在详情 tab
  await page.keyboard.press('Escape');
  await page.waitForTimeout(200);
  await page.click('.product-card[data-product-key="10000"]');
  await page.waitForTimeout(500);
  // 默认应该回 info tab
  const defaultTab = await page.evaluate(() => {
    return {
      infoHidden: document.querySelector('[data-detail-panel="info"]').hasAttribute('hidden'),
      scriptHidden: document.querySelector('[data-detail-panel="script"]').hasAttribute('hidden'),
      activeTab: document.querySelector('.detail-tab.is-active')?.getAttribute('data-detail-tab')
    };
  });
  if (!defaultTab.infoHidden && defaultTab.scriptHidden && defaultTab.activeTab === 'info') {
    pass('9. 切产品时默认回详情 tab');
  } else {
    fail('9. 默认 tab', JSON.stringify(defaultTab));
  }

  // 10. 不破 v78-v80 功能
  // v80 详情：切回 script tab 看到 10000 话术
  await page.click('[data-detail-tab="script"]');
  await page.waitForTimeout(300);
  const cnt10000 = await page.locator('#productScriptList .product-script__item').count();
  if (cnt10000 === 4) pass('10. 10000 切到话术 tab 4 条（v80 兼容）');
  else fail('10. 10000 话术', 'count=' + cnt10000);

  // v79 续费记录
  await page.keyboard.press('Escape');
  await page.waitForTimeout(200);
  await page.click('.member-banner__icon-btn');
  await page.waitForTimeout(400);
  const histOk = await page.evaluate(() => !document.getElementById('dashboardHistoryModal').hidden);
  if (histOk) pass('11. v79 续费记录仍工作');
  else fail('11. v79 broken');

  console.log('\n── v81 验证结果 ──');
  results.forEach(r => console.log(r));
  console.log('── JS 错误 ──');
  if (errs.length === 0) console.log('✅ 无 JS 错误');
  else errs.forEach(e => console.log('❌ ' + e));

  await browser.close();
  process.exit(errs.length > 0 || results.some(r => r.startsWith('❌')) ? 1 : 0);
})();
