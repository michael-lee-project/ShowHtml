// v79: banner 等级行做大 + 续费记录小图标
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

  await page.goto('http://localhost:8339/dashboard.html', { waitUntil: 'networkidle' });
  await page.waitForSelector('.member-banner', { timeout: 4000 });
  await page.waitForTimeout(500);

  const results = [];
  const pass = (n) => results.push('✅ ' + n);
  const fail = (n, why) => results.push('❌ ' + n + (why ? '  · ' + why : ''));

  // 1. 等级行字体大小
  const tierFontSize = await page.evaluate(() => {
    const el = document.getElementById('memberBannerTier');
    return parseFloat(getComputedStyle(el).fontSize);
  });
  const tierNameSize = await page.evaluate(() => {
    const el = document.getElementById('memberBannerTierName');
    return parseFloat(getComputedStyle(el).fontSize);
  });
  if (tierFontSize >= 20 && tierNameSize >= 18) pass('1. 等级行字体做大 (tier=' + tierFontSize + 'px, name=' + tierNameSize + 'px)');
  else fail('1. 等级行字号', 'tier=' + tierFontSize + ' name=' + tierNameSize);

  // 2. 续费记录 icon button 存在
  const iconBtn = await page.locator('.member-banner__icon-btn').count();
  if (iconBtn === 1) pass('2. 续费记录小图标按钮存在');
  else fail('2. icon-btn', 'count=' + iconBtn);

  // 截图 banner
  await page.screenshot({ path: '/Users/michael/.mavis/tmp/mcp-images/mcp-image-8339-v79-1-banner.png' });

  // 3. 点 icon-btn → 续费记录弹窗打开
  await page.click('.member-banner__icon-btn');
  await page.waitForTimeout(500);
  const histVisible = await page.evaluate(() => !document.getElementById('dashboardHistoryModal').hidden);
  if (histVisible) pass('3. 续费记录弹窗打开');
  else fail('3. history modal');

  // 4. 5 条历史
  const histRows = await page.locator('#dashboardHistoryModal .history-row').count();
  if (histRows === 5) pass('4. 续费记录 5 条');
  else fail('4. history rows', 'count=' + histRows);

  // 5. 第一条是"使用中"（active）
  const firstRowActive = await page.evaluate(() => {
    const r = document.querySelector('#dashboardHistoryModal .history-row');
    return r && r.classList.contains('history-row--active');
  });
  if (firstRowActive) pass('5. 最新一条高亮"使用中"');
  else fail('5. active row');

  // 6. 累计金额显示
  const footSum = await page.evaluate(() => {
    const el = document.querySelector('.history-foot__sum');
    return el ? el.textContent : null;
  });
  if (footSum && footSum.includes('¥2,795')) pass('6. 累计支付 ¥2,795');
  else fail('6. 累计', footSum);

  await page.screenshot({ path: '/Users/michael/.mavis/tmp/mcp-images/mcp-image-8339-v79-2-history.png' });

  // 7. ESC 关闭
  await page.keyboard.press('Escape');
  await page.waitForTimeout(250);
  const histClosed = await page.evaluate(() => document.getElementById('dashboardHistoryModal').hidden);
  if (histClosed) pass('7. ESC 关闭续费记录');
  else fail('7. close history');

  // 8. 其他功能不破：切档位 + 升级对比
  await page.click('.member-banner__switch-btn[data-tier="VIP"]');
  await page.waitForTimeout(200);
  const vipOk = await page.evaluate(() => document.getElementById('memberBannerTier').textContent === 'VIP');
  if (vipOk) pass('8. 切档位 VIP 仍工作');
  else fail('8. tier switch broken');

  await page.click('.member-banner__switch-btn[data-tier="MB"]');
  await page.waitForTimeout(200);

  // 9. 升级对比弹窗仍工作
  await page.click('[data-modal="compare"]');
  await page.waitForTimeout(400);
  const compareOk = await page.evaluate(() => !document.getElementById('dashboardCompareModal').hidden);
  if (compareOk) pass('9. 升级对比弹窗仍工作');
  else fail('9. compare broken');
  await page.keyboard.press('Escape');

  // 10. 产品库管理弹窗仍工作
  await page.click('[data-modal="product"]');
  await page.waitForTimeout(400);
  const productOk = await page.evaluate(() => !document.getElementById('dashboardProductModal').hidden);
  if (productOk) pass('10. 产品库管理弹窗仍工作');
  else fail('10. product broken');
  await page.keyboard.press('Escape');

  console.log('\n── v79 验证结果 ──');
  results.forEach(r => console.log(r));
  console.log('── JS 错误 ──');
  if (errs.length === 0) console.log('✅ 无 JS 错误');
  else errs.forEach(e => console.log('❌ ' + e));

  await browser.close();
  process.exit(errs.length > 0 || results.some(r => r.startsWith('❌')) ? 1 : 0);
})();
