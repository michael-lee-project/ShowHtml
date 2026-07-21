// v80: 产品详情弹窗（4 款产品 · 卖点 + 客群 + 选品/下架同步）
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

  await page.goto('http://localhost:8340/dashboard.html', { waitUntil: 'networkidle' });
  await page.waitForSelector('.product-card', { timeout: 4000 });
  await page.waitForTimeout(500);

  const results = [];
  const pass = (n) => results.push('✅ ' + n);
  const fail = (n, why) => results.push('❌ ' + n + (why ? '  · ' + why : ''));

  // 1. dashboard 产品卡可点击 → 详情弹窗
  for (const key of ['8000', '10000', '5000', '3000']) {
    await page.click(`.product-card[data-product-key="${key}"]`);
    await page.waitForTimeout(500);
    const visible = await page.evaluate(() => !document.getElementById('dashboardProductDetailModal').hidden);
    const title = await page.evaluate(() => document.getElementById('productDetailTitle')?.textContent);
    const price = await page.evaluate(() => document.getElementById('productDetailPrice')?.textContent);
    const bulletsCount = await page.locator('#productDetailBullets li').count();
    const tagsCount = await page.locator('#productDetailTags .product-detail__tag').count();
    if (visible && bulletsCount >= 4 && tagsCount >= 2 && price && price.startsWith('¥')) {
      pass(`1.${key} 详情打开 · ${title} · ${price} · ${bulletsCount} 卖点 · ${tagsCount} 客群`);
    } else {
      fail(`1.${key} 详情`, `visible=${visible} title=${title} price=${price} bullets=${bulletsCount} tags=${tagsCount}`);
    }
    // ESC 关闭准备下一个
    await page.keyboard.press('Escape');
    await page.waitForTimeout(200);
  }

  // 2. 截图 8000 旗舰详情
  await page.click('.product-card[data-product-key="8000"]');
  await page.waitForTimeout(500);
  await page.screenshot({ path: '/Users/michael/.mavis/tmp/mcp-images/mcp-image-8340-v80-1-8000.png' });
  await page.keyboard.press('Escape');
  await page.waitForTimeout(200);

  // 3. 10000 至尊详情（紫色 hero）
  await page.click('.product-card[data-product-key="10000"]');
  await page.waitForTimeout(500);
  await page.screenshot({ path: '/Users/michael/.mavis/tmp/mcp-images/mcp-image-8340-v80-2-10000.png' });
  await page.keyboard.press('Escape');
  await page.waitForTimeout(200);

  // 4. 选品/下架同步：打开 10000 详情（当前未上架），点"加入我的产品库"
  // 状态变化：未上架 → 已上架
  await page.click('.product-card[data-product-key="10000"]');
  await page.waitForTimeout(500);
  const beforeTag = await page.evaluate(() => document.getElementById('productDetailStatusTag')?.textContent);
  await page.click('#productDetailToggle');
  await page.waitForTimeout(300);
  const afterTag = await page.evaluate(() => document.getElementById('productDetailStatusTag')?.textContent);
  // dashboard 卡片同步
  const cardInShelf = await page.evaluate(() => document.querySelector('.product-card[data-product-key="10000"]')?.getAttribute('data-in-shelf'));
  // 计数同步
  const countText = await page.evaluate(() => document.querySelector('.product-shelf__count strong')?.textContent);
  if (beforeTag === '未上架' && afterTag === '已上架' && cardInShelf === 'true' && countText === '3') {
    pass('2. 10000 详情"加入产品库" → dashboard 同步上架 + 计数 2→3');
  } else {
    fail('2. 10000 选品', `beforeTag=${beforeTag} afterTag=${afterTag} card=${cardInShelf} count=${countText}`);
  }
  await page.keyboard.press('Escape');
  await page.waitForTimeout(200);

  // 5. 打开弹窗 6（产品库管理），看 10000 行也同步
  await page.click('[data-modal="product"]');
  await page.waitForTimeout(500);
  const manageRowStatus = await page.evaluate(() => {
    var row = document.querySelector('#dashboardProductModal .product-manage__row[data-product-key="10000"]');
    return row ? row.querySelector('.product-manage__status')?.textContent : null;
  });
  if (manageRowStatus === '已上架') pass('3. 弹窗 6 产品管理 10000 也同步上架');
  else fail('3. 弹窗 6 同步', manageRowStatus);
  await page.keyboard.press('Escape');
  await page.waitForTimeout(200);

  // 6. 详情弹窗点 10000 再下架，3 处都同步
  await page.click('.product-card[data-product-key="10000"]');
  await page.waitForTimeout(500);
  await page.click('#productDetailToggle');
  await page.waitForTimeout(300);
  const backToOff = await page.evaluate(() => document.getElementById('productDetailStatusTag')?.textContent);
  const cardBackOff = await page.evaluate(() => document.querySelector('.product-card[data-product-key="10000"]')?.getAttribute('data-in-shelf'));
  const countBack = await page.evaluate(() => document.querySelector('.product-shelf__count strong')?.textContent);
  if (backToOff === '未上架' && cardBackOff === 'false' && countBack === '2') {
    pass('4. 10000 详情"下架" → 3 处全部回到未上架');
  } else {
    fail('4. 10000 下架', `tag=${backToOff} card=${cardBackOff} count=${countBack}`);
  }
  await page.keyboard.press('Escape');
  await page.waitForTimeout(200);

  // 7. + 按钮不触发详情（应触发上架）
  await page.click('.product-card[data-product-key="10000"] .product-card__add');
  await page.waitForTimeout(300);
  const detailNotOpen = await page.evaluate(() => document.getElementById('dashboardProductDetailModal').hidden);
  if (detailNotOpen) pass('5. + 按钮 不触发详情（仅上架）');
  else fail('5. + 误触详情');

  // 8. 弹窗 6 4 行也可点 → 详情
  await page.click('[data-modal="product"]');
  await page.waitForTimeout(500);
  await page.click('#dashboardProductModal .product-manage__row[data-product-key="5000"]');
  await page.waitForTimeout(500);
  const detailFromManage = await page.evaluate(() => {
    var m = document.getElementById('dashboardProductDetailModal');
    return { visible: !m.hidden, title: document.getElementById('productDetailTitle')?.textContent };
  });
  if (detailFromManage.visible && detailFromManage.title && detailFromManage.title.includes('5000')) {
    pass('6. 弹窗 6 5000 行 → 详情打开');
  } else {
    fail('6. 弹窗 6 触发详情', JSON.stringify(detailFromManage));
  }
  await page.keyboard.press('Escape');
  await page.waitForTimeout(200);
  await page.keyboard.press('Escape');
  await page.waitForTimeout(200);

  // 9. 不破 v78/v79 功能
  await page.click('.member-banner__icon-btn');
  await page.waitForTimeout(400);
  const histStillWorks = await page.evaluate(() => !document.getElementById('dashboardHistoryModal').hidden);
  if (histStillWorks) pass('7. v79 续费记录仍工作');
  else fail('7. v79 broken');
  await page.keyboard.press('Escape');
  await page.waitForTimeout(200);

  console.log('\n── v80 验证结果 ──');
  results.forEach(r => console.log(r));
  console.log('── JS 错误 ──');
  if (errs.length === 0) console.log('✅ 无 JS 错误');
  else errs.forEach(e => console.log('❌ ' + e));

  await browser.close();
  process.exit(errs.length > 0 || results.some(r => r.startsWith('❌')) ? 1 : 0);
})();
