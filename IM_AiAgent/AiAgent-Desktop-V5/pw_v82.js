// v82: 半自动 2 按钮接通（基于该建议发送 / 修改后发送）
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

  await page.goto('http://localhost:8342/messages.html', { waitUntil: 'networkidle' });
  await page.waitForSelector('#msgInput', { timeout: 4000 });
  await page.waitForTimeout(500);

  const results = [];
  const pass = (n) => results.push('✅ ' + n);
  const fail = (n, why) => results.push('❌ ' + n + (why ? '  · ' + why : ''));

  // 0. 切到半自动 + ai-suggest panel
  // 默认 off 模式 → 切 semi
  await page.click('.ai-seg__opt[data-mode="semi"]');
  await page.waitForTimeout(500);
  // 切到 ai-suggest tab
  await page.click('.ai-tab[data-tab="ai-suggest"]');
  await page.waitForTimeout(400);
  // 等建议渲染
  await page.waitForFunction(() => {
    return Array.from(document.querySelectorAll('.suggest-version')).some(v => getComputedStyle(v).display !== 'none');
  }, { timeout: 3000 });
  await page.waitForTimeout(300);

  // 截图：默认状态
  await page.screenshot({ path: '/Users/michael/.mavis/tmp/mcp-images/mcp-image-8342-v82-1-default.png' });

  // 1. "基于该建议发送" 按钮存在
  const approveExists = await page.locator('#suggestApprove').count();
  if (approveExists === 1) pass('1. "基于该建议发送" 按钮存在');
  else fail('1. approve btn', 'count=' + approveExists);

  // 2. "修改后发送" 按钮存在
  const editExists = await page.locator('#suggestEdit').count();
  if (editExists === 1) pass('2. "修改后发送" 按钮存在');
  else fail('2. edit btn', 'count=' + editExists);

  // 3. "跳过" 按钮存在
  const skipExists = await page.locator('#suggestSkip').count();
  if (skipExists === 1) pass('3. "跳过" 按钮存在');
  else fail('3. skip btn', 'count=' + skipExists);

  // 4. 取当前建议文本（应有内容）
  const suggestText = await page.evaluate(() => {
    const v = Array.from(document.querySelectorAll('.suggest-version')).find(x => getComputedStyle(x).display !== 'none');
    return v?.querySelector('.suggest-bubble__text')?.innerText.trim() || '';
  });
  if (suggestText.length > 0) pass('4. 当前建议文本非空 (' + suggestText.length + ' 字)');
  else fail('4. suggest text', 'empty');

  // 5. 点 "基于该建议发送" → msgInput 写满 + toast
  await page.click('#suggestApprove');
  await page.waitForTimeout(400);
  const inputAfterApprove = await page.evaluate(() => {
    return document.getElementById('msgInput')?.innerText.trim() || '';
  });
  const toastAfterApprove = await page.evaluate(() => {
    const t = document.querySelector('.toast--success, .toast--info');
    return t ? t.textContent : '';
  });
  if (inputAfterApprove.length > 0) pass('5. 基于该建议发送 → msgInput 写入 (' + inputAfterApprove.length + ' 字)');
  else fail('5. input not filled', 'length=' + inputAfterApprove.length);
  if (toastAfterApprove.includes('已发送') || toastAfterApprove.includes('填入')) pass('6. 发送后 toast 显示');
  else fail('6. toast', 'text=' + toastAfterApprove);

  // 等 toast 消失
  await page.waitForTimeout(1800);

  // 7. 清空 input + 切回 soft tab 测试
  await page.evaluate(() => {
    const input = document.getElementById('msgInput');
    if (input) input.innerHTML = '';
  });

  // 7. "修改后发送" → msgInput 写满 + 聚焦
  await page.click('#suggestEdit');
  await page.waitForTimeout(400);
  const inputAfterEdit = await page.evaluate(() => {
    return document.getElementById('msgInput')?.innerText.trim() || '';
  });
  const focused = await page.evaluate(() => {
    return document.activeElement?.id === 'msgInput';
  });
  if (inputAfterEdit.length > 0) pass('7. 修改后发送 → msgInput 写入 (' + inputAfterEdit.length + ' 字)');
  else fail('7. edit not filled', 'length=' + inputAfterEdit.length);
  if (focused) pass('8. 修改后发送 → msgInput 获得焦点');
  else fail('8. focus', 'activeElement=' + await page.evaluate(() => document.activeElement?.tagName));

  // 等 toast 消失
  await page.waitForTimeout(1800);

  // 9. 切到 deal tab → 建议文本变 + 再次发送
  await page.evaluate(() => { document.getElementById('msgInput').innerHTML = ''; });
  await page.click('.suggest-tab[data-version="deal"]');
  await page.waitForTimeout(300);
  const dealText = await page.evaluate(() => {
    const v = Array.from(document.querySelectorAll('.suggest-version')).find(x => getComputedStyle(x).display !== 'none');
    return v?.querySelector('.suggest-bubble__text')?.innerText.trim() || '';
  });
  const softText = suggestText;
  if (dealText.length > 0 && dealText !== softText) pass('9. 切 deal tab 建议文本变化');
  else fail('9. deal tab', 'soft=' + softText.length + ' deal=' + dealText.length);

  // 10. 切到 deal 后点"基于该建议发送" → 内容是 deal 文本
  await page.click('#suggestApprove');
  await page.waitForTimeout(400);
  const inputDeal = await page.evaluate(() => {
    return document.getElementById('msgInput')?.innerText.trim() || '';
  });
  if (inputDeal.includes(dealText.substring(0, 8))) pass('10. 发送内容是 deal tab 的建议');
  else fail('10. deal send', 'input=' + inputDeal.substring(0, 30));

  await page.waitForTimeout(1800);

  // 11. 跳过按钮 → toast
  await page.evaluate(() => { document.getElementById('msgInput').innerHTML = ''; });
  await page.click('#suggestSkip');
  await page.waitForTimeout(400);
  const skipToast = await page.evaluate(() => document.querySelector('.toast--info')?.textContent || '');
  if (skipToast.includes('跳过')) pass('11. 跳过按钮 → toast');
  else fail('11. skip toast', skipToast);

  await page.waitForTimeout(1800);

  // 12. 不破 v40 tab 切换
  await page.click('.suggest-tab[data-version="data"]');
  await page.waitForTimeout(300);
  const dataActive = await page.evaluate(() => {
    const t = document.querySelector('.suggest-tab.is-active');
    return t?.dataset.version;
  });
  if (dataActive === 'data') pass('12. v40 风格 tab 切换仍工作');
  else fail('12. v40 broken', 'active=' + dataActive);

  console.log('\n── v82 验证结果 ──');
  results.forEach(r => console.log(r));
  console.log('── JS 错误 ──');
  if (errs.length === 0) console.log('✅ 无 JS 错误');
  else errs.forEach(e => console.log('❌ ' + e));

  await browser.close();
  process.exit(errs.length > 0 || results.some(r => r.startsWith('❌')) ? 1 : 0);
})();
