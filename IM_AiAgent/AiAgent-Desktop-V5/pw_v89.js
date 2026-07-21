// v89: 11 位虚拟对话历史 + session-list 切会话
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

  await page.goto('http://localhost:8350/messages.html', { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);

  const results = [];
  const pass = (n) => results.push('✅ ' + n);
  const fail = (n, why) => results.push('❌ ' + n + (why ? '  · ' + why : ''));

  // ===== 任务 1：11 位虚拟对话历史 =====

  // 1. 默认小明 → chatContentDefault 显示 + history 隐藏
  const s1 = await page.evaluate(() => {
    return {
      def: !document.getElementById('chatContentDefault').hasAttribute('hidden'),
      hist: !document.getElementById('chatContentHistory').hasAttribute('hidden'),
      emp: !document.getElementById('chatContentEmpty').hasAttribute('hidden'),
    };
  });
  if (s1.def && !s1.hist && !s1.emp) {
    pass('1. 默认小明 → chatContentDefault 显示，history/empty 隐藏');
  } else {
    fail('1. 默认态异常', JSON.stringify(s1));
  }

  // 2-7. 切 6 位代表性好友（议价/体验/成交/咨询/咨询/意向）→ 渲染 3 条 msg
  const testFriends = ['小冯', '小吴', '小赵', '钱先生', '小郑', '张总'];
  let i = 1;
  for (const f of testFriends) {
    i++;
    await page.goto('http://localhost:8350/messages.html?chat=' + encodeURIComponent(f), { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);
    const r = await page.evaluate(() => {
      var hist = document.getElementById('chatContentHistory');
      var msgEl = document.getElementById('chatHistoryMessages');
      var msgs = msgEl ? msgEl.querySelectorAll('.msg').length : 0;
      return {
        histVisible: hist && !hist.hasAttribute('hidden'),
        defHidden: document.getElementById('chatContentDefault').hasAttribute('hidden'),
        msgCount: msgs,
      };
    });
    if (r.histVisible && r.defHidden && r.msgCount === 3) {
      pass(i + '. ?chat=' + f + ' → history 显示 + 3 条 msg');
    } else {
      fail(i + '. ' + f + ' 异常', JSON.stringify(r));
    }
  }

  // 8. 11 位对话历史总条数 = 11 × 3 = 33
  // 累加 11 位 各自 msg 数
  let totalMsgs = 0;
  for (const f of ['小吴', '小郑', '小冯', '小赵', '钱先生', '孙总', '周女士', '小李', '张总', '陈经理', '林女士']) {
    await page.goto('http://localhost:8350/messages.html?chat=' + encodeURIComponent(f), { waitUntil: 'networkidle' });
    await page.waitForTimeout(300);
    const n = await page.$$eval('#chatHistoryMessages .msg', els => els.length);
    totalMsgs += n;
  }
  if (totalMsgs === 33) {
    pass('9. 11 位对话历史总条数 = 33（每 3 条 × 11 位）');
  } else {
    fail('9. 总条数错', totalMsgs);
  }

  // ===== 任务 2：session-list 同步切会话 =====

  await page.goto('http://localhost:8350/messages.html', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);

  // 10. 9 个 session-item 有 data-session-friend（UMC 会员服务置顶不映射）
  const mapped = await page.$$eval(
    '.session-item[data-session-friend]',
    els => els.map(e => ({
      name: e.querySelector('.session-item__name-text').textContent,
      friend: e.getAttribute('data-session-friend')
    }))
  );
  if (mapped.length === 9) {
    pass('10. 9 个 session-item 有 data-session-friend 映射');
  } else {
    fail('10. 映射数错', JSON.stringify(mapped));
  }

  // 11. UMC 会员服务（置顶）无 data-session-friend
  const unmapped = await page.$$eval(
    '.session-item:not([data-session-friend])',
    els => els.map(e => e.querySelector('.session-item__name-text') ? e.querySelector('.session-item__name-text').textContent : '')
  );
  if (unmapped.length === 1 && unmapped[0] === 'UMC会员服务…') {
    pass('11. UMC会员服务（置顶）不映射（' + unmapped.join(',') + '）');
  } else {
    fail('11. 未映射项错', JSON.stringify(unmapped));
  }

  // 12. 默认 active 是 UMC 专员（小明）
  const active0 = await page.evaluate(() => {
    var a = document.querySelector('.session-item.is-active');
    return a ? a.querySelector('.session-item__name-text').textContent : null;
  });
  if (active0 === 'UMC专员') {
    pass('12. 默认 active = UMC专员（小明）');
  } else {
    fail('12. 默认 active 错', active0);
  }

  // 13. 点"企业星链"（小吴）→ 切到小吴 + history 显示 + URL 同步
  await page.evaluate(() => {
    var item = document.querySelector('.session-item[data-session-friend="小吴"]');
    if (item) item.click();
  });
  await page.waitForTimeout(500);
  const r13 = await page.evaluate(() => ({
    active: document.querySelector('.session-item.is-active') ?
      document.querySelector('.session-item.is-active').querySelector('.session-item__name-text').textContent : null,
    histVisible: !document.getElementById('chatContentHistory').hasAttribute('hidden'),
    urlChat: new URLSearchParams(window.location.search).get('chat'),
    bannerName: document.getElementById('chatFriendBannerName').textContent,
  }));
  if (r13.active === '企业星链' && r13.histVisible && r13.urlChat === '小吴' && r13.bannerName === '小吴') {
    pass('13. 点"企业星链" → 切到小吴 + history + URL + banner 同步');
  } else {
    fail('13. 切小吴异常', JSON.stringify(r13));
  }

  // 14. 点"小玲"（小李）→ 切到小李
  await page.evaluate(() => {
    var item = document.querySelector('.session-item[data-session-friend="小李"]');
    if (item) item.click();
  });
  await page.waitForTimeout(500);
  const r14 = await page.evaluate(() => ({
    active: document.querySelector('.session-item.is-active') ?
      document.querySelector('.session-item.is-active').querySelector('.session-item__name-text').textContent : null,
    bannerName: document.getElementById('chatFriendBannerName').textContent,
  }));
  if (r14.active === '小玲' && r14.bannerName === '小李') {
    pass('14. 点"小玲" → 切到小李');
  } else {
    fail('14. 切小李异常', JSON.stringify(r14));
  }

  // 15. 点"夏目"（周女士）→ 切到周女士
  await page.evaluate(() => {
    var item = document.querySelector('.session-item[data-session-friend="周女士"]');
    if (item) item.click();
  });
  await page.waitForTimeout(500);
  const r15 = await page.evaluate(() => ({
    active: document.querySelector('.session-item.is-active') ?
      document.querySelector('.session-item.is-active').querySelector('.session-item__name-text').textContent : null,
    bannerName: document.getElementById('chatFriendBannerName').textContent,
  }));
  if (r15.active === '夏目' && r15.bannerName === '周女士') {
    pass('15. 点"夏目" → 切到周女士');
  } else {
    fail('15. 切周女士异常', JSON.stringify(r15));
  }

  // 16. 点"UMC专员"（小明）→ 切回小明 + default 显示 + history 隐藏
  await page.evaluate(() => {
    var item = document.querySelector('.session-item[data-session-friend="小明"]');
    if (item) item.click();
  });
  await page.waitForTimeout(500);
  const r16 = await page.evaluate(() => ({
    def: !document.getElementById('chatContentDefault').hasAttribute('hidden'),
    hist: !document.getElementById('chatContentHistory').hasAttribute('hidden'),
  }));
  if (r16.def && !r16.hist) {
    pass('16. 点"UMC专员" → 切回小明 + default 显示 + history 隐藏');
  } else {
    fail('16. 切回小明异常', JSON.stringify(r16));
  }

  console.log('\n── v89 验证结果 ──');
  results.forEach(r => console.log(r));
  console.log('── JS 错误 ──');
  if (errs.length === 0) console.log('✅ 无 JS 错误');
  else errs.forEach(e => console.log('❌ ' + e));

  // 截图：点"小玲"切到小李
  await page.evaluate(() => {
    var item = document.querySelector('.session-item[data-session-friend="小李"]');
    if (item) item.click();
  });
  await page.waitForTimeout(700);
  await page.screenshot({
    path: '/Users/michael/.mavis/tmp/mcp-images/mcp-image-8350-v89-chat.png',
    fullPage: false,
  });
  console.log('✅ 截图保存');

  await browser.close();
  process.exit(errs.length > 0 || results.some(r => r.startsWith('❌')) ? 1 : 0);
})();
