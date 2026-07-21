// v88: 弹窗 10 完整档案 + ⋮ 跳聊天框
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

  await page.goto('http://localhost:8349/dashboard.html', { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);

  const results = [];
  const pass = (n) => results.push('✅ ' + n);
  const fail = (n, why) => results.push('❌ ' + n + (why ? '  · ' + why : ''));

  // ===== dashboard 弹窗 3 + 12 张卡片 =====

  // 1. 打开弹窗 3
  await page.evaluate(() => {
    var s = document.querySelector('.dashboard-funnel__stage[data-stage="hot"]');
    if (s) s.click();
  });
  await page.waitForTimeout(500);

  // 2. 12 张卡片都有 ⋮ 按钮
  const menuBtns = await page.$$eval(
    '#dashboardFunnelModal .funnel-friend-card [data-friend-action="menu"]',
    els => els.length
  );
  if (menuBtns === 12) {
    pass('1. 12 张好友卡片都有 ⋮ 跳聊天框按钮');
  } else {
    fail('1. ⋮ 按钮数错', menuBtns);
  }

  // 3. 12 张卡片都有 👤 完整档案按钮
  const profileBtns = await page.$$eval(
    '#dashboardFunnelModal .funnel-friend-card [data-friend-action="profile"]',
    els => els.length
  );
  if (profileBtns === 12) {
    pass('2. 12 张好友卡片都有 👤 完整档案按钮');
  } else {
    fail('2. 👤 按钮数错', profileBtns);
  }

  // 4. 点议价"小明"👤 → 弹窗 10 打开 + 渲染 hero
  await page.evaluate(() => {
    var btn = document.querySelector('.funnel-friend-card[data-friend-name="小明"] [data-friend-action="profile"]');
    if (btn) btn.click();
  });
  await page.waitForTimeout(500);
  const m10Open = await page.evaluate(() => {
    return !document.getElementById('dashboardProfileModal').hasAttribute('hidden');
  });
  if (m10Open) {
    pass('3. 点小明 👤 → 弹窗 10 打开');
  } else {
    fail('3. 弹窗 10 没开');
  }

  // 5. 弹窗 10 hero 有头像 + 姓名 + 角色
  const hero = await page.evaluate(() => {
    var h = document.querySelector('.profile-modal__hero');
    if (!h) return null;
    return {
      name: h.querySelector('.profile-modal__name') ? h.querySelector('.profile-modal__name').textContent : '',
      role: h.querySelector('.profile-modal__role') ? h.querySelector('.profile-modal__role').textContent : '',
      tagCount: h.querySelectorAll('.profile-modal__tag').length,
    };
  });
  if (hero && hero.name === '小明' && hero.role.length > 0 && hero.tagCount >= 3) {
    pass('4. 弹窗 10 hero: 姓名 ' + hero.name + ' + 角色 + ' + hero.tagCount + ' 标签');
  } else {
    fail('4. hero 异常', JSON.stringify(hero));
  }

  // 6. 弹窗 10 实时指标区有 4 个字段（概率/情绪/顾虑/最近互动）
  const fields = await page.$$eval('.profile-modal__section .profile-modal__field', els => els.length);
  if (fields >= 8) {  // 2 段（实时 + 累计）每段 4 个
    pass('5. 弹窗 10 字段数 ' + fields + '（实时 + 累计）');
  } else {
    fail('5. 字段数少', fields);
  }

  // 7. 弹窗 10 跟进时间线 ≥ 5 条
  const timeline = await page.$$eval('.profile-modal__timeline-item', els => els.length);
  if (timeline >= 5) {
    pass('6. 小明档案时间线 ' + timeline + ' 条');
  } else {
    fail('6. 时间线条数少', timeline);
  }

  // 8. 弹窗 10 底部"跳到聊天框"按钮
  const jumpBtn = await page.$('[data-profile-jump="小明"]');
  if (jumpBtn) {
    pass('7. 弹窗 10 底部"跳到聊天框"按钮存在（data-profile-jump="小明"）');
  } else {
    fail('7. 跳聊天按钮缺失');
  }

  // 9. 关弹窗 10 + 试 ⋮ 按钮：拦截跳页（用 evaluate 模拟 + 监听 location 变化）
  await page.evaluate(() => {
    var m = document.getElementById('dashboardProfileModal');
    if (m) m.setAttribute('hidden', '');
  });
  await page.waitForTimeout(300);
  // 重新打开弹窗 3
  await page.evaluate(() => {
    var s = document.querySelector('.dashboard-funnel__stage[data-stage="hot"]');
    if (s) s.click();
  });
  await page.waitForTimeout(500);

  // 10. 点议价"小明"⋮ → 写 localStorage + 跳 messages.html
  const beforeNav = page.url();
  // 先点（触发 setTimeout 600ms 跳页 + 写 LS）
  await page.evaluate(() => {
    var btn = document.querySelector('.funnel-friend-card[data-friend-name="小明"] [data-friend-action="menu"]');
    if (btn) btn.click();
  });
  // 等 setTimeout 触发 + LS 写入（600ms 跳页前）
  await page.waitForTimeout(700);
  const lsWrite = await page.evaluate(() => {
    try {
      var raw = localStorage.getItem('umakex_chat_friend_v1');
      return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
  });
  if (lsWrite && lsWrite.name === '小明') {
    pass('8. 点小明 ⋮ → localStorage 写入 umakex_chat_friend_v1 = 小明');
  } else {
    fail('8. localStorage 写入失败', JSON.stringify(lsWrite));
  }

  // 等跳页完成
  await page.waitForTimeout(1500);
  const afterNav = page.url();
  if (afterNav.includes('messages.html') && afterNav.includes('chat=')) {
    pass('9. 跳到 messages.html?chat=小明 (URL: ' + afterNav.replace('http://localhost:8349', '') + ')');
  } else {
    fail('9. 没跳页', afterNav);
  }

  // ===== messages.html 跨页切会话 =====

  await page.waitForTimeout(800);

  // 10. 默认"小明"会话 → chatContentDefault 显示 + empty 隐藏
  const m1 = await page.evaluate(() => {
    return {
      def: !document.getElementById('chatContentDefault').hasAttribute('hidden'),
      emp: !document.getElementById('chatContentEmpty').hasAttribute('hidden'),
    };
  });
  if (m1.def && !m1.emp) {
    pass('10. messages.html?chat=小明 → 默认内容显示 + empty 隐藏');
  } else {
    fail('10. 切会话异常', JSON.stringify(m1));
  }

  // 11. banner 显示"小明 · 议价中"
  const banner1 = await page.evaluate(() => {
    return {
      name: document.getElementById('chatFriendBannerName').textContent,
      stage: document.getElementById('chatFriendBannerStage').textContent,
    };
  });
  if (banner1.name === '小明' && banner1.stage.includes('议价')) {
    pass('11. banner 同步: ' + banner1.name + ' ' + banner1.stage);
  } else {
    fail('11. banner 异常', JSON.stringify(banner1));
  }

  // 12. 切到小冯 → empty state 显示
  await page.goto('http://localhost:8349/messages.html?chat=' + encodeURIComponent('小冯'), { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  const m2 = await page.evaluate(() => {
    return {
      def: !document.getElementById('chatContentDefault').hasAttribute('hidden'),
      emp: !document.getElementById('chatContentEmpty').hasAttribute('hidden'),
      emptyName: document.getElementById('chatEmptyFriendName').textContent,
    };
  });
  if (!m2.def && m2.emp && m2.emptyName === '小冯') {
    pass('12. ?chat=小冯 → empty state 显示（与' + m2.emptyName + ' 暂无聊天记录）');
  } else {
    fail('12. empty state 异常', JSON.stringify(m2));
  }

  // 13. banner 同步为"小冯 · 已成交"
  const banner2 = await page.evaluate(() => ({
    name: document.getElementById('chatFriendBannerName').textContent,
    stage: document.getElementById('chatFriendBannerStage').textContent,
  }));
  if (banner2.name === '小冯' && banner2.stage.includes('成交')) {
    pass('13. banner 同步: ' + banner2.name + ' ' + banner2.stage);
  } else {
    fail('13. banner 异常', JSON.stringify(banner2));
  }

  // 14. 切回小明（LS fallback）
  await page.evaluate(() => {
    localStorage.setItem('umakex_chat_friend_v1', JSON.stringify({ name: '小明', at: Date.now() }));
  });
  await page.goto('http://localhost:8349/messages.html', { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  const m3 = await page.evaluate(() => ({
    def: !document.getElementById('chatContentDefault').hasAttribute('hidden'),
    name: document.getElementById('chatFriendBannerName').textContent,
  }));
  if (m3.def && m3.name === '小明') {
    pass('14. 无 URL 参数 + localStorage 兜底 → 默认小明');
  } else {
    fail('14. LS fallback 异常', JSON.stringify(m3));
  }

  console.log('\n── v88 验证结果 ──');
  results.forEach(r => console.log(r));
  console.log('── JS 错误 ──');
  if (errs.length === 0) console.log('✅ 无 JS 错误');
  else errs.forEach(e => console.log('❌ ' + e));

  // 截图 1：dashboard 弹窗 10（小明完整档案）
  await page.goto('http://localhost:8349/dashboard.html', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  await page.evaluate(() => {
    var s = document.querySelector('.dashboard-funnel__stage[data-stage="hot"]');
    if (s) s.click();
  });
  await page.waitForTimeout(500);
  await page.evaluate(() => {
    var btn = document.querySelector('.funnel-friend-card[data-friend-name="小明"] [data-friend-action="profile"]');
    if (btn) btn.click();
  });
  await page.waitForTimeout(500);
  var dlg = await page.$('#dashboardProfileModal .dashboard-modal__dialog');
  if (dlg) {
    await dlg.screenshot({ path: '/Users/michael/.mavis/tmp/mcp-images/mcp-image-8349-v88-profile.png' });
    console.log('✅ 弹窗 10 截图保存');
  }

  // 截图 2：messages.html 切到小冯（empty state）
  await page.goto('http://localhost:8349/messages.html?chat=' + encodeURIComponent('小冯'), { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  await page.screenshot({
    path: '/Users/michael/.mavis/tmp/mcp-images/mcp-image-8349-v88-chat.png',
    fullPage: false,
  });
  console.log('✅ messages.html 截图保存');

  await browser.close();
  process.exit(errs.length > 0 || results.some(r => r.startsWith('❌')) ? 1 : 0);
})();
