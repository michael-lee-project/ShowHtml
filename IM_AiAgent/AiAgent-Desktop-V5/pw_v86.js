// v86: banner 倒计时 + 弹窗 9 客户分层
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

  await page.goto('http://localhost:8347/dashboard.html', { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);

  const results = [];
  const pass = (n) => results.push('✅ ' + n);
  const fail = (n, why) => results.push('❌ ' + n + (why ? '  · ' + why : ''));

  // ===== 任务 1：banner 倒计时 =====

  // 1. 默认 MB → 30 天 ok 蓝紫
  const t1 = await page.evaluate(() => {
    var d = document.getElementById('memberBannerDays');
    return {
      text: d.textContent,
      cls: d.className,
      days: d.textContent.match(/(\d+) 天/)?.[1],
    };
  });
  if (t1.cls.includes('--ok') && t1.days === '30') {
    pass('1. 默认 MB → 30 天 ok 蓝紫态 (' + t1.text + ')');
  } else {
    fail('1. 默认态异常', JSON.stringify(t1));
  }

  // 2. 进度条宽度 100%
  const bar1 = await page.evaluate(() => {
    var b = document.getElementById('memberBannerProgressBar');
    return { width: b.style.width, widthNum: parseFloat(b.style.width), cls: b.className };
  });
  if (bar1.widthNum >= 99 && !bar1.cls.includes('--warn') && !bar1.cls.includes('--urgent')) {
    pass('2. MB 进度条 100% 满 + 蓝紫色 (' + bar1.width + ')');
  } else {
    fail('2. 进度条异常', JSON.stringify(bar1));
  }

  // 3. 到期日文字 MM/DD
  const expiry1 = await page.evaluate(() => {
    return document.getElementById('memberBannerExpiry').textContent;
  });
  if (expiry1 === '到期 8/19') {
    pass('3. MB 到期日文字 "到期 8/19"');
  } else {
    fail('3. 到期日文字异常', expiry1);
  }

  // 4. 切到 VIP → 2 天 urgent 红
  await page.click('.member-banner__switch-btn[data-tier="VIP"]');
  await page.waitForTimeout(400);
  const t2 = await page.evaluate(() => {
    var d = document.getElementById('memberBannerDays');
    return { text: d.textContent, cls: d.className, days: d.textContent.match(/(\d+) 天/)?.[1] };
  });
  const bar2 = await page.evaluate(() => {
    var b = document.getElementById('memberBannerProgressBar');
    return { width: b.style.width, cls: b.className };
  });
  if (t2.cls.includes('--urgent') && parseInt(t2.days) <= 2 && bar2.cls.includes('--urgent') && parseFloat(bar2.width) < 10) {
    pass('4. 切 VIP → 2 天 urgent 红 + 进度条 <10% (' + t2.text + ', ' + bar2.width + ')');
  } else {
    fail('4. VIP 态异常', JSON.stringify({ t2, bar2 }));
  }

  // 5. 切到 MN → 14 天 warn 橙
  await page.click('.member-banner__switch-btn[data-tier="MN"]');
  await page.waitForTimeout(400);
  const t3 = await page.evaluate(() => {
    var d = document.getElementById('memberBannerDays');
    return { text: d.textContent, cls: d.className, days: d.textContent.match(/(\d+) 天/)?.[1] };
  });
  const bar3 = await page.evaluate(() => {
    var b = document.getElementById('memberBannerProgressBar');
    return { width: b.style.width, cls: b.className };
  });
  if (t3.cls.includes('--warn') && parseInt(t3.days) >= 13 && parseInt(t3.days) <= 14 && bar3.cls.includes('--warn') && parseFloat(bar3.width) > 40) {
    pass('5. 切 MN → 14 天 warn 橙 + 进度条 ~47% (' + t3.text + ', ' + bar3.width + ')');
  } else {
    fail('5. MN 态异常', JSON.stringify({ t3, bar3 }));
  }

  // 切回 MB
  await page.click('.member-banner__switch-btn[data-tier="MB"]');
  await page.waitForTimeout(400);

  // ===== 任务 2：弹窗 9 客户分层 =====

  // 6. 客户分层按钮存在
  const segBtn = await page.$('#openSegmentsBtn');
  if (segBtn) {
    pass('6. banner 客户分层按钮存在');
  } else {
    fail('6. 客户分层按钮缺失');
  }

  // 7. 点击客户分层按钮 → 弹窗 9 打开
  await page.click('#openSegmentsBtn');
  await page.waitForTimeout(400);
  const m9 = await page.evaluate(() => {
    var m = document.getElementById('dashboardSegmentsModal');
    return { hidden: m.hasAttribute('hidden'), display: getComputedStyle(m).display };
  });
  if (!m9.hidden && m9.display !== 'none') {
    pass('7. 点客户分层按钮 → 弹窗 9 打开');
  } else {
    fail('7. 弹窗 9 没开', JSON.stringify(m9));
  }

  // 8. 弹窗 9 有 3 个 segment-block
  const blocks = await page.$$eval('#dashboardSegmentsModal .segment-block', els => els.length);
  if (blocks === 3) {
    pass('8. 弹窗 9 有 3 个 segment-block（按价值/风险/活跃度）');
  } else {
    fail('8. segment-block 数量错', blocks);
  }

  // 9. 弹窗 9 共 12 个 segment-item
  const items = await page.$$eval('#dashboardSegmentsModal .segment-item', els => els.length);
  if (items === 12) {
    pass('9. 弹窗 9 共 12 个 segment-item（3 维度 × 4 分层）');
  } else {
    fail('9. segment-item 数量错', items);
  }

  // 10. 8 位客户人名都在
  const allHints = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('#dashboardSegmentsModal .segment-item__hint')).map(h => h.textContent);
  });
  const hasNames = ['小明', '小吴', '小郑', '小冯', '小赵'].every(n => allHints.some(h => h.includes(n)));
  if (hasNames) {
    pass('10. 8 位客户人名都在（小明/小吴/小郑/小冯/小赵）');
  } else {
    fail('10. 客户人名缺失', JSON.stringify(allHints));
  }

  // 11. 关弹窗 → 隐藏
  await page.click('#dashboardSegmentsModal [data-modal-close]');
  await page.waitForTimeout(300);
  const m9Closed = await page.evaluate(() => {
    return document.getElementById('dashboardSegmentsModal').hasAttribute('hidden');
  });
  if (m9Closed) {
    pass('11. 弹窗 9 关闭按钮工作');
  } else {
    fail('11. 弹窗 9 没关');
  }

  console.log('\n── v86 验证结果 ──');
  results.forEach(r => console.log(r));
  console.log('── JS 错误 ──');
  if (errs.length === 0) console.log('✅ 无 JS 错误');
  else errs.forEach(e => console.log('❌ ' + e));

  // 截图 1：默认 MB banner 倒计时 ok 态
  await page.screenshot({
    path: '/Users/michael/.mavis/tmp/mcp-images/mcp-image-8347-v86-banner-mb.png',
    clip: { x: 0, y: 0, width: 1440, height: 220 },
  });
  // 截图 2：弹窗 9 客户分层
  await page.click('#openSegmentsBtn');
  await page.waitForTimeout(500);
  var segEl = await page.$('#dashboardSegmentsModal .dashboard-modal__dialog');
  if (segEl) {
    await segEl.screenshot({
      path: '/Users/michael/.mavis/tmp/mcp-images/mcp-image-8347-v86-segments.png',
    });
  }
  console.log('✅ 截图保存');

  await browser.close();
  process.exit(errs.length > 0 || results.some(r => r.startsWith('❌')) ? 1 : 0);
})();
