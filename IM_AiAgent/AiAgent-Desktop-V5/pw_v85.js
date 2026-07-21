// v85: 产品价 inline 编辑 + 3 处同步 + 持久化
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

  await page.goto('http://localhost:8345/dashboard.html', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);

  const results = [];
  const pass = (n) => results.push('✅ ' + n);
  const fail = (n, why) => results.push('❌ ' + n + (why ? '  · ' + why : ''));

  // 0. 清掉残留 localStorage
  await page.evaluate(() => localStorage.removeItem('umakex_product_prices_v1'));
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(500);

  // 1. 4 款产品都有 data-product-price 锚点（dashboard 卡片）
  const cardKeys = await page.$$eval(
    '#productShelf .product-card__price[data-product-price]',
    els => els.map(e => e.getAttribute('data-product-price'))
  );
  if (cardKeys.length === 4 && cardKeys.includes('8000') && cardKeys.includes('10000') && cardKeys.includes('5000') && cardKeys.includes('3000')) {
    pass('1. 4 款 dashboard 卡片都有 data-product-price');
  } else {
    fail('1. 卡片 data-product-price 缺', cardKeys.join(','));
  }

  // 2. 默认价 = 标准价
  const defaultPrices = await page.evaluate(() => {
    return {
      '8000': document.querySelector('.product-card[data-product-key="8000"] .product-card__price').firstChild.textContent.trim(),
      '10000': document.querySelector('.product-card[data-product-key="10000"] .product-card__price').firstChild.textContent.trim(),
      '5000': document.querySelector('.product-card[data-product-key="5000"] .product-card__price').firstChild.textContent.trim(),
      '3000': document.querySelector('.product-card[data-product-key="3000"] .product-card__price').firstChild.textContent.trim(),
    };
  });
  if (defaultPrices['8000'] === '¥8,000' && defaultPrices['10000'] === '¥10,000' && defaultPrices['5000'] === '¥5,000' && defaultPrices['3000'] === '¥3,000') {
    pass('2. 默认价 8000/10000/5000/3000 正确');
  } else {
    fail('2. 默认价错', JSON.stringify(defaultPrices));
  }

  // 3. 初始无蓝徽章
  const initialTagVisible = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('#productShelf .product-card__custom-tag')).map(t => !t.hidden);
  });
  if (initialTagVisible.every(v => v === false)) {
    pass('3. 初始 4 款都无"自定义价"徽章');
  } else {
    fail('3. 初始徽章异常', JSON.stringify(initialTagVisible));
  }

  // 4. 点 8000 卡片价 → inline input 出现
  await page.click('.product-card[data-product-key="8000"] .product-card__price[data-product-price="8000"]');
  await page.waitForTimeout(200);
  const editInput = await page.$('.product-price-edit input[value="8000"]');
  if (editInput) {
    pass('4. 点 8000 卡片价 → inline input 出现（value=8000）');
  } else {
    fail('4. inline input 未出现');
    return; // 后续都依赖这个
  }

  // 5. 改 8000 → 7500 + Enter → 3 处同步
  await page.fill('.product-price-edit input', '7500');
  await page.press('.product-price-edit input', 'Enter');
  await page.waitForTimeout(500);
  const afterCard8000 = await page.evaluate(() => {
    return document.querySelector('.product-card[data-product-key="8000"] .product-card__price').firstChild.textContent.trim();
  });
  if (afterCard8000 === '¥7,500') {
    pass('5. 卡片 8000 改 ¥7,500 完成');
  } else {
    fail('5. 卡片 8000 改价失败', afterCard8000);
  }

  // 6. 卡片 8000 显示"自定义价"徽章
  const tag8000Visible = await page.evaluate(() => {
    return !document.querySelector('.product-card[data-product-key="8000"] .product-card__custom-tag').hidden;
  });
  if (tag8000Visible) {
    pass('6. 卡片 8000 出现"自定义价"蓝徽章');
  } else {
    fail('6. 徽章未出现');
  }

  // 7. 打开详情弹窗 → 详情大字也是 ¥7,500 + restore 按钮可见
  await page.click('.product-card[data-product-key="8000"] .product-card__name');
  await page.waitForTimeout(400);
  const detailPrice = await page.evaluate(() => {
    return document.getElementById('productDetailPrice').textContent.trim();
  });
  const restoreVisible = await page.evaluate(() => {
    var b = document.getElementById('productDetailRestore');
    return { hidden: b.hidden, key: b.getAttribute('data-product-key') };
  });
  if (detailPrice === '¥7,500' && !restoreVisible.hidden && restoreVisible.key === '8000') {
    pass('7. 详情弹窗大字 ¥7,500 + restore 按钮可见 (key=8000)');
  } else {
    fail('7. 详情弹窗同步失败', JSON.stringify({ detailPrice, restoreVisible }));
  }

  // 8. 弹窗 6 meta 行也是 ¥7,500
  await page.click('#dashboardProductDetailModal [data-modal-close]');
  await page.waitForTimeout(300);
  await page.click('.dashboard-card__more[data-modal="product"]');  // 打开弹窗 6（管理）
  await page.waitForTimeout(400);
  const managePrice = await page.evaluate(() => {
    return document.querySelector('.product-manage__price[data-product-price="8000"]').textContent.trim();
  });
  if (managePrice === '¥7,500') {
    pass('8. 弹窗 6 meta 行 8000 也是 ¥7,500');
  } else {
    fail('8. 弹窗 6 同步失败', managePrice);
  }

  // 9. localStorage 写入
  const ls = await page.evaluate(() => localStorage.getItem('umakex_product_prices_v1'));
  if (ls && JSON.parse(ls)['8000'] === 7500) {
    pass('9. localStorage umakex_product_prices_v1.8000 = 7500');
  } else {
    fail('9. localStorage 写入失败', ls);
  }

  // 关弹窗
  await page.click('#dashboardProductModal [data-modal-close]');
  await page.waitForTimeout(300);

  // 10. 刷新页面后 8000 仍是 ¥7,500（持久化）
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  const afterReload = await page.evaluate(() => {
    return document.querySelector('.product-card[data-product-key="8000"] .product-card__price').firstChild.textContent.trim();
  });
  const tagAfterReload = await page.evaluate(() => {
    return !document.querySelector('.product-card[data-product-key="8000"] .product-card__custom-tag').hidden;
  });
  if (afterReload === '¥7,500' && tagAfterReload) {
    pass('10. 刷新后 8000 仍是 ¥7,500 + 徽章保持');
  } else {
    fail('10. 持久化失败', JSON.stringify({ afterReload, tagAfterReload }));
  }

  // 11. 改 10000 → 9500（改另一款）
  await page.click('.product-card[data-product-key="10000"] .product-card__price[data-product-price="10000"]');
  await page.waitForTimeout(200);
  await page.fill('.product-price-edit input', '9500');
  await page.press('.product-price-edit input', 'Enter');
  await page.waitForTimeout(300);
  const c10000 = await page.evaluate(() => {
    return document.querySelector('.product-card[data-product-key="10000"] .product-card__price').firstChild.textContent.trim();
  });
  // 8000 应仍是 7500
  const c8000 = await page.evaluate(() => {
    return document.querySelector('.product-card[data-product-key="8000"] .product-card__price').firstChild.textContent.trim();
  });
  if (c10000 === '¥9,500' && c8000 === '¥7,500') {
    pass('11. 改 10000 → ¥9,500，8000 保持 ¥7,500（互不干扰）');
  } else {
    fail('11. 多价同步异常', JSON.stringify({ c8000, c10000 }));
  }

  // 12. Esc 取消 → 原价保留
  await page.click('.product-card[data-product-key="5000"] .product-card__price[data-product-price="5000"]');
  await page.waitForTimeout(200);
  await page.fill('.product-price-edit input', '8888');
  await page.press('.product-price-edit input', 'Escape');
  await page.waitForTimeout(300);
  const c5000 = await page.evaluate(() => {
    return document.querySelector('.product-card[data-product-key="5000"] .product-card__price').firstChild.textContent.trim();
  });
  const tag5000 = await page.evaluate(() => {
    return !document.querySelector('.product-card[data-product-key="5000"] .product-card__custom-tag').hidden;
  });
  if (c5000 === '¥5,000' && !tag5000) {
    pass('12. Esc 取消 → 5000 保持 ¥5,000 + 无徽章');
  } else {
    fail('12. Esc 取消失败', JSON.stringify({ c5000, tag5000 }));
  }

  // 13. 无效值（0）→ toast warn + 原价保留
  await page.click('.product-card[data-product-key="3000"] .product-card__price[data-product-price="3000"]');
  await page.waitForTimeout(200);
  await page.fill('.product-price-edit input', '0');
  await page.press('.product-price-edit input', 'Enter');
  await page.waitForTimeout(500);
  const c3000 = await page.evaluate(() => {
    return document.querySelector('.product-card[data-product-key="3000"] .product-card__price').firstChild.textContent.trim();
  });
  if (c3000 === '¥3,000') {
    pass('13. 无效值 0 → 取消 + 3000 保持 ¥3,000');
  } else {
    fail('13. 无效值处理失败', c3000);
  }

  // 14. 打开 8000 详情 → 点 restore → 恢复 ¥8,000
  await page.click('.product-card[data-product-key="8000"] .product-card__name');
  await page.waitForTimeout(400);
  await page.click('#productDetailRestore');
  await page.waitForTimeout(500);
  const restoredPrice = await page.evaluate(() => {
    return document.getElementById('productDetailPrice').textContent.trim();
  });
  const restoreHidden = await page.evaluate(() => {
    return document.getElementById('productDetailRestore').hidden;
  });
  if (restoredPrice === '¥8,000' && restoreHidden) {
    pass('14. restore 按钮 → 8000 恢复 ¥8,000 + 按钮隐藏');
  } else {
    fail('14. restore 失败', JSON.stringify({ restoredPrice, restoreHidden }));
  }

  // 15. 10000 没被恢复（仍 ¥9,500）
  await page.click('#dashboardProductDetailModal [data-modal-close]');
  await page.waitForTimeout(300);
  const c10000After = await page.evaluate(() => {
    return document.querySelector('.product-card[data-product-key="10000"] .product-card__price').firstChild.textContent.trim();
  });
  if (c10000After === '¥9,500') {
    pass('15. restore 只恢复 8000，10000 仍 ¥9,500');
  } else {
    fail('15. restore 影响其他款', c10000After);
  }

  console.log('\n── v85 验证结果 ──');
  results.forEach(r => console.log(r));
  console.log('── JS 错误 ──');
  if (errs.length === 0) console.log('✅ 无 JS 错误');
  else errs.forEach(e => console.log('❌ ' + e));

  await browser.close();
  process.exit(errs.length > 0 || results.some(r => r.startsWith('❌')) ? 1 : 0);
})();
