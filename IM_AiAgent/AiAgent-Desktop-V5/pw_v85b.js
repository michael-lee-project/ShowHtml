// v85b: 成交样式优化验证 + 截图
const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({
    executablePath: '/Users/michael/Library/Caches/ms-playwright/chromium_headless_shell-1228/chrome-headless-shell-mac-arm64/chrome-headless-shell',
    headless: true, args: ['--no-sandbox'],
  });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  const errs = [];
  page.on('pageerror', e => errs.push('pageerror: ' + e.message));
  page.on('console', m => { if (m.type() === 'error') errs.push('console.error: ' + m.text()); });

  await page.goto('http://localhost:8346/messages.html', { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);

  const results = [];
  const pass = (n) => results.push('✅ ' + n);
  const fail = (n, why) => results.push('❌ ' + n + (why ? '  · ' + why : ''));

  // 1. 成交 bar width 100%
  const wonWidth = await page.evaluate(() => {
    var step = document.querySelector('.funnel-step--won');
    return getComputedStyle(step).width;
  });
  // 容器宽度先拿
  const containerW = await page.evaluate(() => {
    var visual = document.querySelector('.funnel-visual');
    return visual ? visual.getBoundingClientRect().width : 0;
  });
  if (parseFloat(wonWidth) >= containerW - 5) {
    pass('1. 成交 bar width = 100% (' + wonWidth + ' 容器 ' + containerW + ')');
  } else {
    fail('1. 成交 bar 宽度不对', wonWidth);
  }

  // 2. 成交名字 ✅ 成交
  const wonName = await page.evaluate(() => {
    var n = document.querySelector('.funnel-step--won .funnel-step__name');
    return n ? n.textContent : null;
  });
  if (wonName === '✅ 成交') {
    pass('2. 成交 name = "✅ 成交"');
  } else {
    fail('2. name 不对', wonName);
  }

  // 3. "成交" 文字不换行（不再 "成 / 交" 两行）
  const wonNameHeight = await page.evaluate(() => {
    var n = document.querySelector('.funnel-step--won .funnel-step__name');
    return n ? n.getBoundingClientRect().height : 0;
  });
  if (wonNameHeight < 20) {
    pass('3. 成交 name 单行（高度 ' + wonNameHeight + 'px < 20）');
  } else {
    fail('3. 成交 name 换行（高度 ' + wonNameHeight + 'px）');
  }

  // 4. 颜色升级深绿
  const wonBg = await page.evaluate(() => {
    var bar = document.querySelector('.funnel-step--won .funnel-step__bar');
    return getComputedStyle(bar).backgroundImage;
  });
  if (wonBg.includes('rgb(5, 150, 105)') || wonBg.includes('rgb(16, 185, 129)')) {
    pass('4. 成交 bar 升级深绿（#059669 → #10B981）');
  } else {
    fail('4. 颜色未升级', wonBg);
  }

  // 5. 头像"冯"在 bar 下方
  const friendCount = await page.evaluate(() => {
    var friends = document.querySelectorAll('.funnel-step--won .friend-avatar');
    return friends.length;
  });
  if (friendCount === 1) {
    pass('5. 成交阶段 1 个头像"冯"（跟其他阶段一致）');
  } else {
    fail('5. 头像数异常', friendCount);
  }

  // 6. 其他 4 阶段宽度不变（不影响）
  const otherWidths = await page.evaluate(() => ({
    cold: getComputedStyle(document.querySelector('.funnel-step--cold')).width,
    warm: getComputedStyle(document.querySelector('.funnel-step--warm')).width,
    hot: getComputedStyle(document.querySelector('.funnel-step--hot')).width,
    deal: getComputedStyle(document.querySelector('.funnel-step--deal')).width,
  }));
  if (parseFloat(otherWidths.cold) >= containerW - 5 && parseFloat(otherWidths.warm) < containerW && parseFloat(otherWidths.deal) < parseFloat(otherWidths.warm)) {
    pass('6. 其他 4 阶段宽度递减不变 (cold=' + Math.round(parseFloat(otherWidths.cold)) + ' / warm=' + Math.round(parseFloat(otherWidths.warm)) + ' / hot=' + Math.round(parseFloat(otherWidths.hot)) + ' / deal=' + Math.round(parseFloat(otherWidths.deal)) + ')');
  } else {
    fail('6. 其他阶段宽度被影响', JSON.stringify(otherWidths));
  }

  console.log('\n── v85b 验证结果 ──');
  results.forEach(r => console.log(r));
  console.log('── JS 错误 ──');
  if (errs.length === 0) console.log('✅ 无 JS 错误');
  else errs.forEach(e => console.log('❌ ' + e));

  // 截图：整个 funnel panel
  var funnelEl = await page.$('.ai-card.ai-card--funnel');
  if (funnelEl) {
    await funnelEl.screenshot({
      path: '/Users/michael/.mavis/tmp/mcp-images/mcp-image-8346-v85b-funnel.png',
    });
    console.log('✅ 截图保存: mcp-image-8346-v85b-funnel.png');
  }

  await browser.close();
  process.exit(errs.length > 0 || results.some(r => r.startsWith('❌')) ? 1 : 0);
})();
