// v78: 会员卡 banner + 产品库 + 升级对比弹窗 + 档位切换
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

  await page.goto('http://localhost:8338/dashboard.html', { waitUntil: 'networkidle' });
  await page.waitForSelector('.member-banner', { timeout: 4000 });
  await page.waitForTimeout(500);

  const results = [];
  const pass = (n) => results.push('✅ ' + n);
  const fail = (n, why) => results.push('❌ ' + n + (why ? '  · ' + why : ''));

  // ============ 1. 会员卡 banner ============
  const bannerTier = await page.evaluate(() => document.getElementById('memberBannerTier')?.textContent);
  const bannerName = await page.evaluate(() => document.getElementById('memberBannerTierName')?.textContent);
  if (bannerTier === 'MB' && bannerName === '高级版') pass('1. banner 默认 MB（最高级）· 高级版');
  else fail('1. banner tier', 'tier=' + bannerTier + ' name=' + bannerName);

  const bannerSub = await page.evaluate(() => document.getElementById('memberBannerSub')?.textContent);
  if (bannerSub.includes('无限') && bannerSub.includes('3 套') && bannerSub.includes('实时')) pass('2. banner 副标题含 MB 专属词（无限/3 套/实时）');
  else fail('2. banner sub', bannerSub);

  await page.screenshot({ path: '/Users/michael/.mavis/tmp/mcp-images/mcp-image-8338-v78-1-mb.png' });

  // ============ 2. 产品库卡片（4 款）============
  const productCount = await page.locator('.product-card').count();
  if (productCount === 4) pass('3. 产品库 4 款产品');
  else fail('3. 产品数', 'count=' + productCount);

  const shelfOn = await page.locator('.product-card[data-in-shelf="true"]').count();
  const shelfOff = await page.locator('.product-card[data-in-shelf="false"]').count();
  if (shelfOn === 2 && shelfOff === 2) pass('4. 2 款已上架 + 2 款未上架');
  else fail('4. 上架/未上架', 'on=' + shelfOn + ' off=' + shelfOff);

  // ============ 3. 档位切换 VIP/MN/MB ============
  // 切到 VIP
  await page.click('.member-banner__switch-btn[data-tier="VIP"]');
  await page.waitForTimeout(300);
  const vipTier = await page.evaluate(() => document.getElementById('memberBannerTier')?.textContent);
  const vipName = await page.evaluate(() => document.getElementById('memberBannerTierName')?.textContent);
  const vipSub = await page.evaluate(() => document.getElementById('memberBannerSub')?.textContent);
  if (vipTier === 'VIP' && vipName === '基础版' && vipSub.includes('5 位') && !vipSub.includes('3 套') && !vipSub.includes('实时')) {
    pass('5. 切到 VIP · 基础版 · 5 位/1 套/24h');
  } else {
    fail('5. VIP 切换', 'tier=' + vipTier + ' name=' + vipName + ' sub=' + vipSub);
  }
  await page.screenshot({ path: '/Users/michael/.mavis/tmp/mcp-images/mcp-image-8338-v78-2-vip.png' });

  // 切到 MN
  await page.click('.member-banner__switch-btn[data-tier="MN"]');
  await page.waitForTimeout(300);
  const mnTier = await page.evaluate(() => document.getElementById('memberBannerTier')?.textContent);
  const mnSub = await page.evaluate(() => document.getElementById('memberBannerSub')?.textContent);
  if (mnTier === 'MN' && mnSub.includes('20 位') && !mnSub.includes('3 套')) pass('6. 切到 MN · 标准版 · 20 位/1 套');
  else fail('6. MN 切换', 'tier=' + mnTier + ' sub=' + mnSub);

  // 切回 MB
  await page.click('.member-banner__switch-btn[data-tier="MB"]');
  await page.waitForTimeout(300);
  const mbBack = await page.evaluate(() => document.getElementById('memberBannerTier')?.textContent);
  if (mbBack === 'MB') pass('7. 切回 MB');
  else fail('7. 回 MB', mbBack);

  // ============ 4. 升级对比弹窗 ============
  await page.click('[data-modal="compare"]');
  await page.waitForTimeout(500);
  const compareVisible = await page.evaluate(() => !document.getElementById('dashboardCompareModal').hidden);
  if (compareVisible) pass('8. 升级对比弹窗打开');
  else fail('8. compare modal');

  // 3 列对比表
  const compareCols = await page.locator('.compare-col').count();
  if (compareCols === 3) pass('9. 对比弹窗 3 列');
  else fail('9. compare cols', 'count=' + compareCols);

  // MB 列高亮 is-current
  const mbCurrent = await page.evaluate(() => {
    const col = document.querySelector('.compare-col[data-tier-col="MB"]');
    return col && col.classList.contains('is-current');
  });
  if (mbCurrent) pass('10. MB 列 is-current 标识');
  else fail('10. MB is-current');

  await page.screenshot({ path: '/Users/michael/.mavis/tmp/mcp-images/mcp-image-8338-v78-3-compare.png' });

  // 在对比弹窗里点 "切到 VIP 演示"
  await page.click('.compare-col__btn[data-tier-switch="VIP"]');
  await page.waitForTimeout(300);
  const vipAfterSwitch = await page.evaluate(() => document.getElementById('memberBannerTier')?.textContent);
  if (vipAfterSwitch === 'VIP') pass('11. 对比弹窗 "切到 VIP" → banner 同步');
  else fail('11. 对比弹窗切换', vipAfterSwitch);

  // 切回 MB（先切到 MN 再切回 MB 避免 disabled 拦截）
  await page.click('.compare-col__btn[data-tier-switch="MN"]');
  await page.waitForTimeout(200);
  await page.click('.compare-col__btn[data-tier-switch="MB"]', { force: true });
  await page.waitForTimeout(300);
  // 关闭弹窗
  await page.keyboard.press('Escape');
  await page.waitForTimeout(250);
  const compareClosed = await page.evaluate(() => document.getElementById('dashboardCompareModal').hidden);
  if (compareClosed) pass('12. ESC 关闭对比弹窗');
  else fail('12. compare close');

  // ============ 5. 产品库管理弹窗 ============
  await page.click('[data-modal="product"]');
  await page.waitForTimeout(500);
  const productVisible = await page.evaluate(() => !document.getElementById('dashboardProductModal').hidden);
  if (productVisible) pass('13. 产品库管理弹窗打开');
  else fail('13. product modal');

  const productRows = await page.locator('#dashboardProductModal .product-manage__row').count();
  if (productRows === 4) pass('14. 产品库管理 4 行');
  else fail('14. product rows', 'count=' + productRows);

  await page.screenshot({ path: '/Users/michael/.mavis/tmp/mcp-images/mcp-image-8338-v78-4-product.png' });

  // 切换上架状态：点 10000 "上架"
  await page.click('.product-manage__row[data-product-key="10000"] .product-manage__toggle');
  await page.waitForTimeout(300);
  const shelf10000 = await page.evaluate(() => document.querySelector('.product-manage__row[data-product-key="10000"]')?.getAttribute('data-in-shelf'));
  const card10000 = await page.evaluate(() => document.querySelector('.product-card[data-product-key="10000"]')?.getAttribute('data-in-shelf'));
  if (shelf10000 === 'true' && card10000 === 'true') pass('15. 10000 上架 → dashboard 卡片同步上架');
  else fail('15. 10000 上架', 'modal=' + shelf10000 + ' card=' + card10000);

  // 计数同步
  const countText = await page.evaluate(() => document.getElementById('productManageCount')?.textContent);
  if (countText.includes('3 款')) pass('16. 计数 2→3 同步');
  else fail('16. count', countText);

  // ESC 关闭
  await page.keyboard.press('Escape');
  await page.waitForTimeout(250);

  // ============ 6. localStorage 持久化 ============
  const storedTier = await page.evaluate(() => {
    try { return JSON.parse(localStorage.getItem('umakex_member_tier_v1'))?.tier; } catch (e) { return null; }
  });
  if (storedTier === 'MB') pass('17. 档位 localStorage 持久化 = MB');
  else fail('17. localStorage', storedTier);

  // ============ 输出 ============
  console.log('\n── v78 验证结果 ──');
  results.forEach(r => console.log(r));
  console.log('── JS 错误 ──');
  if (errs.length === 0) console.log('✅ 无 JS 错误');
  else errs.forEach(e => console.log('❌ ' + e));

  await browser.close();
  process.exit(errs.length > 0 || results.some(r => r.startsWith('❌')) ? 1 : 0);
})();
