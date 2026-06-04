/* ============================================
   慈商联营 — 公共脚本
   ============================================ */

(function() {

  // 品牌 logo 图标：手心 + 圆心（上方被托起的圆 + 下方 U 形手 + 3 手指分隔）
  const LOGO_ICON = `<svg class="logo-icon" width="36" height="36" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg" fill="none" aria-hidden="true">
    <circle cx="18" cy="12" r="4.5" fill="currentColor"/>
    <path d="M8 20 V23.5 a10 10 0 0 0 20 0 V20" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" fill="none"/>
    <line x1="14" y1="21" x2="14" y2="25.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
    <line x1="18" y1="21" x2="18" y2="26.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
    <line x1="22" y1="21" x2="22" y2="25.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
  </svg>`;
  'use strict';

  // ============================================
  // 1. 动态加载 header / footer
  // ============================================
  function loadPartial(targetId, html) {
    const el = document.getElementById(targetId);
    if (el) el.innerHTML = html;
  }

  function getPathPrefix() {
    // 通过查找调用页面中 common.js script 标签的 src 反推根目录前缀
    // 例如：pages/about.html 里 <script src="../public/js/common.js">
    //      则根目录前缀 = ".."
    //      index.html 里 <script src="public/js/common.js">
    //      则根目录前缀 = "."
    const scripts = document.getElementsByTagName('script');
    for (let i = 0; i < scripts.length; i++) {
      const s = scripts[i];
      const src = s.getAttribute('src') || '';
      if (src.indexOf('common.js') >= 0) {
        const idx = src.lastIndexOf('public/');
        if (idx >= 0) {
          let prefix = src.substring(0, idx);
          if (prefix.length === 0) prefix = './';
          else if (!prefix.endsWith('/')) prefix = prefix + '/';
          return prefix;
        }
      }
    }
    return './';
  }

  // header 模板（含移动端汉堡按钮 + drawer）
  function getHeader(active) {
    const p = getPathPrefix();
    return `
<header class="site-header" id="siteHeader">
  <div class="container">
    <a href="${p}index.html" class="logo">
      <div class="logo-mark">${LOGO_ICON}</div>
      <div class="logo-text">
        <span>慈商联营</span>
        <span class="en">CISHANG UNION</span>
      </div>
    </a>
    <button class="nav-toggle" id="navToggle" aria-label="菜单" aria-expanded="false">
      <span class="nav-toggle-bar"></span>
      <span class="nav-toggle-bar"></span>
      <span class="nav-toggle-bar"></span>
    </button>
    <nav class="nav" id="siteNav">
      <a href="${p}index.html" ${active==='home'?'class="active"':''}>首页</a>
      <a href="${p}pages/track.html" ${active==='track'?'class="active"':''}>物资轨迹</a>
      <a href="${p}pages/companies.html" ${active==='companies'?'class="active"':''}>标杆企业</a>
      <a href="${p}pages/transparency.html" ${active==='transparency'?'class="active"':''}>透明公示</a>
      <a href="${p}pages/annual-report.html" ${active==='report'?'class="active"':''}>年度报告</a>
      <a href="${p}pages/about.html" ${active==='about'?'class="active"':''}>关于我们</a>
      <a href="${p}mall/index.html" ${active==='mall'?'class="active"':''}>慈善商城</a>
    </nav>
    <div class="header-actions">
      <a href="${p}pages/login.html" class="btn btn-ghost btn-sm">登录</a>
      <a href="${p}pages/register.html" class="btn btn-primary btn-sm">免费入驻</a>
    </div>
  </div>
  <!-- 移动端遮罩（点空白关闭 drawer） -->
  <div class="nav-backdrop" id="navBackdrop"></div>
</header>`;
  }

  // 移动端汉堡菜单切换（在 DOMContentLoaded 绑定一次）
  function initMobileNav() {
    if (window.__mobileNavInited) return;
    window.__mobileNavInited = true;
    document.addEventListener('click', (e) => {
      const toggle = e.target.closest('#navToggle');
      if (toggle) {
        const header = document.getElementById('siteHeader');
        if (header) {
          const open = header.classList.toggle('nav-open');
          toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
          // 锁定 body 滚动
          document.body.style.overflow = open ? 'hidden' : '';
        }
        return;
      }
      const backdrop = e.target.closest('#navBackdrop');
      if (backdrop) {
        const header = document.getElementById('siteHeader');
        if (header) {
          header.classList.remove('nav-open');
          document.getElementById('navToggle').setAttribute('aria-expanded', 'false');
          document.body.style.overflow = '';
        }
        return;
      }
      // 点击 nav 内的链接自动关闭 drawer
      if (e.target.closest('#siteNav a')) {
        const header = document.getElementById('siteHeader');
        if (header && header.classList.contains('nav-open')) {
          header.classList.remove('nav-open');
          document.getElementById('navToggle').setAttribute('aria-expanded', 'false');
          document.body.style.overflow = '';
        }
      }
    });
  }

  // 角色中文 → URL key
  function getRoleKey(role) {
    const map = {
      '企业': 'company', '爱心企业': 'company',
      '慈善会': 'charity', '总会': 'charity',
      '社会组织': 'org',
      '志愿者': 'volunteer', '社工': 'volunteer',
      '受捐者': 'recipient'
    };
    return map[role] || 'company';
  }

  // 角色 → 中文显示名
  const ROLE_CN = {
    company: '企业', charity: '慈善会', org: '社会组织',
    volunteer: '志愿者', recipient: '受捐者'
  };

  // 工作台 header (含角色切换 + 消息中心)
  // backTo: { label, href } — dashboard 默认"返回前台"，消息中心传"← 返回工作台"
  function getDashHeader(role, userName, activePage, backTo) {
    const p = getPathPrefix();
    const roleKey = getRoleKey(role);
    const unread = getUnreadCount(roleKey);
    const back = backTo || { label: '返回前台', href: `${p}index.html` };
    return `
<header class="site-header">
  <div class="container">
    <a href="${p}index.html" class="logo">
      <div class="logo-mark">${LOGO_ICON}</div>
      <div class="logo-text">
        <span>慈商联营</span>
        <span class="en">CISHANG UNION · 工作台</span>
      </div>
    </a>
    <div class="flex-1"></div>
    <button class="nav-toggle" id="dashSideToggle" aria-label="侧边栏" aria-expanded="false">
      <span class="nav-toggle-bar"></span>
      <span class="nav-toggle-bar"></span>
      <span class="nav-toggle-bar"></span>
    </button>
    <div class="header-actions">
      <a href="${back.href}" class="text-sm text-muted">${back.label}</a>
      <a href="messages.html" class="msg-bell" aria-label="消息中心" title="消息中心">
        <span class="bell">🔔</span>
        ${unread > 0 ? `<span class="msg-badge">${unread > 99 ? '99+' : unread}</span>` : ''}
      </a>
      <div class="role-switch">
        <div class="avatar">${userName ? userName.charAt(0) : 'U'}</div>
        <span>${userName || '当前用户'} · ${role || '企业'}</span>
      </div>
    </div>
  </div>
  <div class="nav-backdrop" id="dashSideBackdrop"></div>
</header>`;
  }

  // 工作台侧边栏移动端 drawer 切换
  function initDashSide() {
    if (window.__dashSideInited) return;
    window.__dashSideInited = true;
    document.addEventListener('click', (e) => {
      const toggle = e.target.closest('#dashSideToggle');
      const backdrop = e.target.closest('#dashSideBackdrop');
      if (toggle || backdrop) {
        const wrap = document.querySelector('.dash-wrap');
        const side = document.getElementById('dash-side');
        if (wrap && side) {
          const open = wrap.classList.toggle('side-open');
          toggle && toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
          document.body.style.overflow = open ? 'hidden' : '';
        }
      }
    });
  }

  // 消息未读数：从 MESSAGES_DATA 实时计算，避免维护两份数据
  function getUnreadCount(role) {
    const data = MESSAGES_DATA[role] || [];
    return data.filter(m => m.unread).length;
  }

  // ============================================
  // 受灾项目数据（慈善会发布、消费者可"购买赠送"）
  // ============================================
  const DISASTER_PROJECTS = [
    { id: 'd01', name: '云南昭通 6.2 级地震救援',         org: '云南省慈善总会',     level: 'urgent', tag: '🚨 紧急', beneficiaries: 1820, region: '云南昭通 · 鲁甸县', need: '洗护用品、应急食品、保暖衣物', received: '12%', cover: '🏔️', coverBg: '#FEE2E2' },
    { id: 'd02', name: '粤北山区助学计划',                org: '广东省慈善总会',     level: 'high',   tag: '📚 助学', beneficiaries: 3200, region: '广东清远 · 阳山县', need: '书包、文具、运动鞋',           received: '45%', cover: '📚', coverBg: '#DBEAFE' },
    { id: 'd03', name: '西部留守儿童关怀',                org: '中国扶贫基金会',     level: 'normal', tag: '❤️ 关怀', beneficiaries: 5800, region: '甘肃陇南 · 礼县',   need: '食品礼盒、保暖内衣',           received: '68%', cover: '🧒', coverBg: '#FEF3C7' },
    { id: 'd04', name: '广东 7 月洪灾应急救援',           org: '广东省慈善总会',     level: 'urgent', tag: '🚨 紧急', beneficiaries: 2400, region: '广东韶关 · 翁源县', need: '饮用水、毛巾被、消毒用品',     received: '32%', cover: '🌊', coverBg: '#CCFBF1' },
    { id: 'd05', name: '云南偏远山区送温暖',              org: '深圳市壹基金',       level: 'normal', tag: '🧥 寒冬', beneficiaries: 1200, region: '云南怒江 · 福贡县', need: '羽绒服、围巾、手套',           received: '78%', cover: '🧥', coverBg: '#E0E7FF' }
  ];

  function findDisasterProject(key) {
    return DISASTER_PROJECTS.find(p => p.id === key || p.name === key) || null;
  }

  // ============================================
  // 商品数据（公司维度，products.html + donate-publish.html 共用）
  // ============================================
  const PRODUCTS_DATA = [
    { id: 'p001', name: '美心临期面包礼盒 1.2kg · 8 种口味', category: '临期食品', group: 'exp',   originalPrice: 89,   salePrice: 39.9, stock: 1260, monthlySales: 12000, expiryDays: 23, cover: '🍞', tags: ['爆款'] },
    { id: 'p002', name: '美心丹麦酥 礼盒装 480g',            category: '临期食品', group: 'exp',   originalPrice: 48,   salePrice: 24.9, stock: 860,  monthlySales: 6820,  expiryDays: 28, cover: '🥐', tags: [] },
    { id: 'p003', name: '美心鲜奶蛋糕 6 寸 · 生日款',        category: '新鲜烘焙', group: 'new',   originalPrice: 168,  salePrice: 128,  stock: 320,  monthlySales: 1860,  expiryDays: 3,  cover: '🍰', tags: ['新品'] },
    { id: 'p004', name: '美心曲奇饼干礼盒 680g',             category: '临期食品', group: 'exp',   originalPrice: 78,   salePrice: 39.9, stock: 1560, monthlySales: 3260,  expiryDays: 45, cover: '🍪', tags: [] },
    { id: 'p005', name: '美心蛋挞 12 个装 · 家庭分享装',     category: '临期食品', group: 'exp',   originalPrice: 56,   salePrice: 28.8, stock: 2260, monthlySales: 2860,  expiryDays: 5,  cover: '🥧', tags: [] },
    { id: 'p006', name: '美心甜甜圈 6 个装 · 卡通造型',     category: '临期食品', group: 'exp',   originalPrice: 38,   salePrice: 19.9, stock: 3860, monthlySales: 4200,  expiryDays: 4,  cover: '🍩', tags: ['临期'] }
  ];

  // 计算保质期至日期（基于今天 + expiryDays）
  function calcExpiryDate(days) {
    const d = new Date();
    d.setDate(d.getDate() + (days || 0));
    return d.toISOString().slice(0, 10);
  }

  // 按 ID / name 找商品
  function findProduct(key) {
    return PRODUCTS_DATA.find(p => p.id === key || p.name === key) || null;
  }

  // 渲染"商品选择器"（带搜索的下拉）
  // targetId: 容器 id；onChange: 选中后回调（参数是 product 对象）
  function renderProductPicker(targetId, defaultName, onChange) {
    const container = document.getElementById(targetId);
    if (!container) return;

    const groups = [
      { key: 'exp', label: '🍞 临期食品（推荐）' },
      { key: 'new', label: '🍰 新品食品' }
    ];

    function buildOptions(filter) {
      const f = (filter || '').trim().toLowerCase();
      return groups.map(g => {
        const items = PRODUCTS_DATA.filter(p => p.group === g.key &&
          (!f || p.name.toLowerCase().includes(f) || p.category.toLowerCase().includes(f)));
        if (!items.length) return '';
        return `<div class="picker-group">
          <div class="picker-group-label">${g.label}</div>
          ${items.map(p => `
            <div class="picker-option" data-id="${p.id}" data-name="${p.name}">
              <div class="picker-emoji">${p.cover}</div>
              <div class="picker-info">
                <div class="picker-name">${p.name}</div>
                <div class="picker-meta">¥ ${p.salePrice} · 库存 ${p.stock.toLocaleString()}</div>
              </div>
              ${p.tags.length ? `<span class="picker-tag ${p.tags[0]==='爆款'?'tag-primary':p.tags[0]==='新品'?'tag-gold':'tag-warning'}">${p.tags[0]}</span>` : ''}
            </div>
          `).join('')}
        </div>`;
      }).join('') || '<div class="picker-empty">无匹配商品</div>';
    }

    function formatDate(d) {
      return d;
    }

    container.innerHTML = `
      <div class="picker-wrap">
        <input type="text" class="picker-input form-control" id="${targetId}-input" placeholder="搜索或选择商品..." value="${defaultName || ''}" autocomplete="off">
        <span class="picker-chevron">▾</span>
        <div class="picker-dropdown" id="${targetId}-dropdown">
          <div class="picker-options">${buildOptions('')}</div>
        </div>
      </div>
    `;

    const input = document.getElementById(`${targetId}-input`);
    const dropdown = document.getElementById(`${targetId}-dropdown`);

    function open() { dropdown.classList.add('is-open'); }
    function close() { dropdown.classList.remove('is-open'); }
    function isOpen() { return dropdown.classList.contains('is-open'); }

    // 聚焦时打开 + 选中已有文本
    input.addEventListener('focus', () => { open(); input.select(); });
    // 边输入边过滤
    input.addEventListener('input', () => {
      dropdown.querySelector('.picker-options').innerHTML = buildOptions(input.value);
      open();
      bindOptions();
    });
    // 点击外部关闭
    document.addEventListener('click', e => {
      if (!container.contains(e.target)) close();
    });
    // Esc 关闭
    input.addEventListener('keydown', e => {
      if (e.key === 'Escape') { close(); input.blur(); }
      if (e.key === 'Enter') {
        const first = dropdown.querySelector('.picker-option');
        if (first) first.click();
      }
    });

    function bindOptions() {
      dropdown.querySelectorAll('.picker-option').forEach(opt => {
        opt.addEventListener('click', () => {
          const p = findProduct(opt.dataset.id);
          if (!p) return;
          input.value = p.name;
          close();
          if (typeof onChange === 'function') onChange(p);
        });
      });
    }
    bindOptions();

    // 触发默认值的 onChange（让联动字段填好）
    if (defaultName) {
      const p = findProduct(defaultName);
      if (p && typeof onChange === 'function') onChange(p);
    }

    return { input, open, close };
  }

  // Dashboard 上"消息中心快捷入口"banner 的描述文案（按角色）
  const DASH_MSG_DESC = {
    company:   '您发起的"临期面包糕点 1,200 件"已全部签收 / 受捐者反馈已上传 / 注册审核已通过',
    charity:   '新一批物资待领取 / 志愿者团队已分配 / 派发现场反馈已上传',
    org:       '新协同任务派发 / 5 月运营月报已生成',
    volunteer: '新派发任务待领取 / 物资已到达区域仓 / 志愿者培训通知',
    recipient: '受捐资格已认证通过 / 物资派发通知：面包糕点 6 月 1 日送达'
  };

  function getDashMsgBanner(role) {
    return `<a href="messages.html" class="msg-banner">
      <div class="msg-banner-ico">🔔</div>
      <div class="msg-banner-body">
        <div class="msg-banner-title">消息中心 <span class="msg-banner-unread">${getUnreadCount(role)} 条未读</span></div>
        <div class="msg-banner-desc">${DASH_MSG_DESC[role] || ''}</div>
      </div>
      <span class="msg-banner-go">查看全部 →</span>
    </a>`;
  }

  // 消息数据（按角色）— type: system|audit|biz|feedback
  const MESSAGES_DATA = {
    company: [
      { id: 'm1', type: 'audit', icon: '✅', title: '注册申请已通过审核', summary: '您的企业入驻申请（申请单号 CCREG20250528-0088）已通过平台复审，可正常使用工作台。', time: '2 小时前', unread: true, tag: '审核消息' },
      { id: 'm2', type: 'biz', icon: '📦', title: '您发起的捐赠已全部签收', summary: '"临期面包糕点 1,200 件"已由志愿者团队完成入户派发，86 户全部签收，反馈照片 186 张。', time: '昨天 18:42', unread: true, tag: '业务通知' },
      { id: 'm3', type: 'feedback', icon: '❤️', title: '受捐者反馈已上传', summary: '张阿姨 / 李大爷 / 王大姐等 12 位受捐者上传了签收反馈照片和文字。点击查看完整反馈。', time: '昨天 19:10', unread: true, tag: '反馈消息' },
      { id: 'm4', type: 'system', icon: '📢', title: '系统 V2.6.0 上线公告', summary: '新增"批量发起捐赠"、"票据一键导出"功能；优化派发路线算法。点击查看更新详情。', time: '3 天前', unread: false, tag: '平台通知' },
      { id: 'm5', type: 'biz', icon: '🚚', title: '物资已到达区域仓', summary: '您发起的"儿童节文具礼包 600 套"已到达梅州五华县区域仓，承运方：顺丰公益物流。', time: '5 天前', unread: false, tag: '业务通知' },
      { id: 'm6', type: 'system', icon: '🎁', title: '商城月度捐赠结算单已生成', summary: '2025-05 月度商城 0.5% 自动捐赠金额 ¥12,860 已结算，票据可下载。', time: '6 天前', unread: false, tag: '平台通知' },
    ],
    charity: [
      { id: 'm1', type: 'audit', icon: '✅', title: '注册申请已通过审核', summary: '广东省慈善总会入驻申请已通过平台复审，工作台权限已开通。', time: '1 天前', unread: true, tag: '审核消息' },
      { id: 'm2', type: 'biz', icon: '📦', title: '新一批物资待领取', summary: '美心食品集团发起"临期面包糕点 1,200 件"捐赠，匹配到贵会，请及时确认领取。', time: '今天 09:15', unread: true, tag: '业务通知' },
      { id: 'm3', type: 'biz', icon: '🤝', title: '志愿者团队已分配', summary: '深圳鹏星社工服务社 3 名志愿者已分配至本次派发任务，预计 6 月 1 日开展入户派发。', time: '今天 10:00', unread: true, tag: '业务通知' },
      { id: 'm4', type: 'feedback', icon: '📸', title: '派发现场反馈已上传', summary: '志愿者团队上传本次派发照片 86 张、视频 12 段，受捐者反馈 186 条。', time: '昨天 19:30', unread: false, tag: '反馈消息' },
      { id: 'm5', type: 'system', icon: '📋', title: '2025 年年度报告提交通知', summary: '请于 6 月 30 日前提交 2025 上半年度工作报告，模板已下发至资料库。', time: '3 天前', unread: false, tag: '平台通知' },
      { id: 'm6', type: 'audit', icon: '🔍', title: '新增项目发布需审核', summary: '您发布的"粤北山区助学计划"项目已提交平台审核，预计 1-2 个工作日反馈。', time: '5 天前', unread: false, tag: '审核消息' },
    ],
    org: [
      { id: 'm1', type: 'audit', icon: '✅', title: '注册申请已通过审核', summary: '深圳市壹基金公益基金会入驻申请已通过，工作台权限已开通。', time: '1 天前', unread: true, tag: '审核消息' },
      { id: 'm2', type: 'biz', icon: '🤝', title: '新协同任务派发', summary: '广东省慈善总会委托协同任务：派发"临期面包糕点 1,200 件"，5 月 30 日 16:00 区域仓交接。', time: '今天 09:30', unread: true, tag: '业务通知' },
      { id: 'm3', type: 'feedback', icon: '📊', title: '5 月运营月报已生成', summary: '本月协同派发 8 批次，覆盖 3 个县区，受惠 286 人。月报 PDF 可下载。', time: '2 天前', unread: false, tag: '反馈消息' },
      { id: 'm4', type: 'system', icon: '📢', title: '系统 V2.6.0 上线公告', summary: '新增"协同任务看板"、"志愿者一键调度"功能。', time: '3 天前', unread: false, tag: '平台通知' },
      { id: 'm5', type: 'audit', icon: '📑', title: '5 月年度报告已通过审核', summary: '贵机构 2025-05 月度运营报告已通过平台审核，结论：优秀。', time: '7 天前', unread: false, tag: '审核消息' },
    ],
    volunteer: [
      { id: 'm1', type: 'audit', icon: '✅', title: '注册申请已通过审核', summary: '志愿者注册申请已通过，社工证 + 身份证已通过验证，可领取派发任务。', time: '2 小时前', unread: true, tag: '审核消息' },
      { id: 'm2', type: 'biz', icon: '📦', title: '新派发任务待领取', summary: '美心食品集团 / 临期面包糕点 1,200 件 / 入户派发 86 户，6 月 1 日 10:00 区域仓交接。', time: '今天 10:30', unread: true, tag: '业务通知' },
      { id: 'm3', type: 'biz', icon: '🚚', title: '物资已到达区域仓', summary: '物资已到达梅州五华县区域仓，可前往接收。请提前 30 分钟到达。', time: '昨天 16:20', unread: true, tag: '业务通知' },
      { id: 'm4', type: 'system', icon: '📚', title: '志愿者培训通知', summary: '6 月 15 日将开展"入户派发标准流程"线上培训，时长 1.5 小时。', time: '昨天 09:00', unread: true, tag: '平台通知' },
      { id: 'm5', type: 'feedback', icon: '❤️', title: '受捐者反馈已上传', summary: '本次派发收到受捐者反馈 186 条，含文字 / 照片 / 视频 12 段。', time: '3 天前', unread: true, tag: '反馈消息' },
      { id: 'm6', type: 'biz', icon: '🏅', title: '服务时长已累计', summary: '本月已服务 28 小时，累计服务 156 小时。恭喜获得"银牌志愿者"称号。', time: '4 天前', unread: false, tag: '业务通知' },
    ],
    recipient: [
      { id: 'm1', type: 'audit', icon: '✅', title: '受捐资格已认证通过', summary: '您的受捐申请已通过属地慈善会 / 社工认证，可在本平台接收物资。', time: '2 小时前', unread: true, tag: '审核消息' },
      { id: 'm2', type: 'biz', icon: '📦', title: '物资派发通知', summary: '美心食品集团捐赠的"临期面包糕点"将于 6 月 1 日 14:00 - 17:00 派发到您所在社区。', time: '今天 11:00', unread: true, tag: '业务通知' },
      { id: 'm3', type: 'system', icon: '📋', title: '签收指引', summary: '签收时请扫描物资上的二维码确认；如有质量问题可点击"反馈"上报。', time: '昨天 18:00', unread: false, tag: '平台通知' },
      { id: 'm4', type: 'feedback', icon: '❤️', title: '感谢您的反馈', summary: '您上次签收后上传的反馈已收到，志愿者和捐赠方都看到您的留言。', time: '5 天前', unread: false, tag: '反馈消息' },
    ],
  };

  // footer 模板
  function getFooter() {
    return `
<footer class="site-footer">
  <div class="container">
    <div class="footer-grid">
      <div class="footer-brand">
        <a href="#" class="logo">
          <div class="logo-mark">${LOGO_ICON}</div>
          <div class="logo-text">
            <span style="color:#fff">慈商联营</span>
            <span class="en" style="color:#999">CISHANG UNION</span>
          </div>
        </a>
        <p>由海南亚洲公益研究院发起，连接企业、慈善会、社会组织、志愿者与受捐者的全流程透明化公益平台。完成慈善最后一公里，让每一份善意都可追溯、可看见、可信任。</p>
        <div class="cert">
          <span class="cert-tag">慈善组织认证</span>
          <span class="cert-tag">公开募捐资格</span>
          <span class="cert-tag">ICP 备案</span>
          <span class="cert-tag">公安联网备案</span>
        </div>
      </div>
      <div>
        <h4>透明公示</h4>
        <ul>
          <li><a href="#">物资全流程追溯</a></li>
          <li><a href="#">捐赠实时看板</a></li>
          <li><a href="#">年度报告</a></li>
          <li><a href="#">企业捐赠榜</a></li>
          <li><a href="#">受捐者反馈</a></li>
        </ul>
      </div>
      <div>
        <h4>角色入口</h4>
        <ul>
          <li><a href="${getPathPrefix()}company/dashboard.html">企业工作台</a></li>
          <li><a href="${getPathPrefix()}charity/dashboard.html">慈善会工作台</a></li>
          <li><a href="${getPathPrefix()}org/dashboard.html">社会组织工作台</a></li>
          <li><a href="${getPathPrefix()}volunteer/dashboard.html">志愿者/社工</a></li>
          <li><a href="${getPathPrefix()}recipient/dashboard.html">受捐者中心</a></li>
        </ul>
      </div>
      <div>
        <h4>关于平台</h4>
        <ul>
          <li><a href="#">平台介绍</a></li>
          <li><a href="#">入驻流程</a></li>
          <li><a href="#">服务协议</a></li>
          <li><a href="#">数据安全承诺</a></li>
          <li><a href="#">慈善组织自律公约</a></li>
        </ul>
      </div>
      <div>
        <h4>联系我们</h4>
        <div class="contact-line">
          <span class="ic">📍</span>
          <span>海南省海口市美兰区亚洲公益大厦</span>
        </div>
        <div class="contact-line">
          <span class="ic">📞</span>
          <span>400-888-6666 (工作日 9:00-18:00)</span>
        </div>
        <div class="contact-line">
          <span class="ic">✉️</span>
          <span>service@chinacharity.cn</span>
        </div>
        <div class="qr-row">
          <div class="qr">
            <div class="qr-img">公众号<br>二维码</div>
            <span>官方公众号</span>
          </div>
          <div class="qr">
            <div class="qr-img">客服<br>二维码</div>
            <span>专属客服</span>
          </div>
        </div>
      </div>
    </div>
    <div class="footer-bottom">
      <div>© 2025 海南亚洲公益研究院 · 慈商联营平台 · 琼ICP备 2024xxxxxx号</div>
      <div>
        <a href="#">隐私政策</a>·
        <a href="#">用户协议</a>·
        <a href="#">举报反馈</a>·
        <a href="#">网站地图</a>
      </div>
    </div>
  </div>
</footer>`;
  }

  // 消息中心主体内容（不含 main 包装 — 由 renderMessagesPage 包）
  function getMessagesBody(roleKey, roleName, userName) {
    const data = MESSAGES_DATA[roleKey] || MESSAGES_DATA.company;
    const unread = getUnreadCount(roleKey);
    const total = data.length;
    const nSys = data.filter(m => m.type === 'system').length;
    const nAudit = data.filter(m => m.type === 'audit').length;
    const nBiz = data.filter(m => m.type === 'biz').length;
    const nFb = data.filter(m => m.type === 'feedback').length;
    const pinned = data.filter(m => m.unread).slice(0, 3);

    const list = data.map(m => `
      <li class="msg-item ${m.unread ? 'is-unread' : ''}" data-type="${m.type}" data-id="${m.id}">
        <div class="msg-ico msg-ico-${m.type}">${m.icon}</div>
        <div class="msg-body">
          <div class="msg-head-line">
            <span class="msg-tag">${m.tag}</span>
            <span class="msg-title">${m.title}</span>
            ${m.unread ? '<span class="msg-dot"></span>' : ''}
          </div>
          <div class="msg-summary">${m.summary}</div>
          <div class="msg-meta">
            <span class="msg-time">${m.time}</span>
            <span class="msg-ops">
              <button class="msg-op" data-act="read">${m.unread ? '标为已读' : '已读'}</button>
              <button class="msg-op" data-act="del">删除</button>
            </span>
          </div>
        </div>
      </li>
    `).join('');

    const pinnedHtml = pinned.length ? pinned.map(m => `
      <li class="msg-pinned-item">
        <span class="msg-pinned-ico msg-ico-${m.type}">${m.icon}</span>
        <div>
          <div class="msg-pinned-title">${m.title}</div>
          <div class="msg-pinned-time">${m.time}</div>
        </div>
      </li>
    `).join('') : '<li class="msg-pinned-empty">暂无未读消息</li>';

    const pct = arr => total ? Math.round((arr / total) * 100) : 0;
    const pSys = pct(nSys), pAudit = pct(nAudit), pBiz = pct(nBiz), pFb = pct(nFb);
    const c1 = pSys, c2 = c1 + pAudit, c3 = c2 + pBiz, c4 = c3 + pFb;
    const donut = `conic-gradient(
      #94A3B8 0 ${c1}%,
      #14B8A6 ${c1}% ${c2}%,
      #3B82F6 ${c2}% ${c3}%,
      #F59E0B ${c3}% ${c4}%
    )`;

    return `
<!-- 1. Hero 渐变区 -->
<div class="msg-hero">
  <div>
    <h1>📬 消息中心</h1>
    <p class="msg-hero-sub">${roleName} <strong>${userName}</strong> · 共 <strong>${total}</strong> 条消息，其中 <strong>${unread}</strong> 条未读</p>
    <div class="msg-hero-tags">
      <span class="tag tag-primary">🔔 ${unread} 条未读</span>
      <span class="tag tag-trust">📨 ${total} 条全部</span>
      <span class="tag tag-gold">⚡ 实时推送</span>
    </div>
  </div>
  <div class="msg-hero-cta">
    <button class="btn btn-primary btn-lg" id="msg-readAll">✓ 全部标为已读</button>
  </div>
</div>

<!-- 2. 5 个 stat 卡片 -->
<div class="msg-stat-grid">
  <div class="msg-stat-card theme-primary">
    <div class="ic-deco">🔔</div>
    <div class="label">未读消息</div>
    <div class="value">${unread}<span class="unit">条</span></div>
    <div class="trend">📌 需要处理</div>
  </div>
  <div class="msg-stat-card">
    <div class="ic-deco">📨</div>
    <div class="label">全部消息</div>
    <div class="value">${total}<span class="unit">条</span></div>
    <div class="trend">📅 90 天保留</div>
  </div>
  <div class="msg-stat-card theme-trust">
    <div class="ic-deco">🛡️</div>
    <div class="label">审核消息</div>
    <div class="value">${nAudit}<span class="unit">条</span></div>
    <div class="trend">✅ 平台审核</div>
  </div>
  <div class="msg-stat-card theme-info">
    <div class="ic-deco">📦</div>
    <div class="label">业务通知</div>
    <div class="value">${nBiz}<span class="unit">条</span></div>
    <div class="trend">🚚 派发进展</div>
  </div>
  <div class="msg-stat-card theme-gold">
    <div class="ic-deco">❤️</div>
    <div class="label">反馈消息</div>
    <div class="value">${nFb}<span class="unit">条</span></div>
    <div class="trend">💌 受捐者反馈</div>
  </div>
</div>

<!-- 3. 双栏主体 -->
<div class="msg-double-col">
  <main class="msg-list-col">
    <div class="msg-section-head">
      <h3>📋 消息列表</h3>
      <span class="msg-section-stat">未读 <strong>${unread}</strong> · 全部 <strong>${total}</strong></span>
    </div>
    <nav class="msg-tabs" role="tablist">
      <button class="msg-tab is-active" data-tab="all">全部 <em>${total}</em></button>
      <button class="msg-tab" data-tab="system">平台通知 <em>${nSys}</em></button>
      <button class="msg-tab" data-tab="audit">审核消息 <em>${nAudit}</em></button>
      <button class="msg-tab" data-tab="biz">业务通知 <em>${nBiz}</em></button>
      <button class="msg-tab" data-tab="feedback">反馈消息 <em>${nFb}</em></button>
    </nav>
    <ul class="msg-list" id="msg-list">${list}</ul>
  </main>
  <aside class="msg-side-col">
    <div class="msg-side-card">
      <div class="msg-side-head">
        <h3>📌 置顶未读</h3>
        <a href="#" class="msg-side-more">查看全部 →</a>
      </div>
      <ul class="msg-pinned">${pinnedHtml}</ul>
    </div>
    <div class="msg-side-card">
      <div class="msg-side-head">
        <h3>⚡ 快捷操作</h3>
      </div>
      <div class="msg-quick-actions">
        <button class="msg-quick" data-qa="read">✓ 全部已读</button>
        <button class="msg-quick" data-qa="archive">📂 消息归档</button>
        <button class="msg-quick" data-qa="settings">⚙️ 通知设置</button>
        <button class="msg-quick" data-qa="export">📤 导出记录</button>
      </div>
    </div>
    <div class="msg-side-card">
      <div class="msg-side-head">
        <h3>📊 消息分布</h3>
        <span class="msg-section-stat">总 ${total} 条</span>
      </div>
      <div class="msg-donut-row">
        <div class="msg-donut" style="background: ${donut};">
          <div class="msg-donut-info">
            <div class="num">${total}</div>
            <div class="lbl">总消息</div>
          </div>
        </div>
        <ul class="msg-legend">
          <li><span class="legend-dot" style="background:#94A3B8"></span>平台通知 <strong>${nSys}</strong></li>
          <li><span class="legend-dot" style="background:#14B8A6"></span>审核消息 <strong>${nAudit}</strong></li>
          <li><span class="legend-dot" style="background:#3B82F6"></span>业务通知 <strong>${nBiz}</strong></li>
          <li><span class="legend-dot" style="background:#F59E0B"></span>反馈消息 <strong>${nFb}</strong></li>
        </ul>
      </div>
    </div>
  </aside>
</div>

<!-- 4. 演示说明 -->
<div class="alert alert-info">
  <span class="ic">💡</span>
  <div>
    <strong>演示说明：</strong> 原型阶段所有消息均为预设示例数据；正式上线后，平台通知与审核消息由后端实时推送，业务通知与反馈由事件总线驱动。
  </div>
</div>`;
  }

  function getMessagesModal() {
    return `
<div class="msg-modal" id="msg-modal" hidden>
  <div class="msg-modal-card">
    <button class="msg-modal-close" aria-label="关闭">×</button>
    <div class="msg-modal-head" id="msg-modal-head"></div>
    <div class="msg-modal-body" id="msg-modal-body"></div>
    <div class="msg-modal-foot">
      <button class="btn btn-ghost btn-sm" id="msg-modal-cancel">关闭</button>
      <button class="btn btn-primary btn-sm" id="msg-modal-go">前往处理</button>
    </div>
  </div>
</div>`;
  }

  const MESSAGES_SCRIPT = `
(function(){
  // Tab 切换
  const tabs = document.querySelectorAll('.msg-tab');
  const list = document.getElementById('msg-list');
  tabs.forEach(t => t.addEventListener('click', () => {
    tabs.forEach(x => x.classList.remove('is-active'));
    t.classList.add('is-active');
    const f = t.dataset.tab;
    list.querySelectorAll('.msg-item').forEach(li => {
      li.style.display = (f === 'all' || li.dataset.type === f) ? '' : 'none';
    });
  }));

  // 标为已读 / 删除 / 打开详情
  list.addEventListener('click', e => {
    const item = e.target.closest('.msg-item');
    if (!item) return;
    const op = e.target.closest('.msg-op');
    if (op) {
      e.stopPropagation();
      if (op.dataset.act === 'read') {
        item.classList.remove('is-unread');
        item.querySelector('.msg-dot')?.remove();
        op.textContent = '已读';
      } else if (op.dataset.act === 'del') {
        item.style.transition = 'opacity .2s, transform .2s';
        item.style.opacity = '0';
        item.style.transform = 'translateX(20px)';
        setTimeout(() => item.remove(), 200);
      }
      return;
    }
    openModal(item);
    item.classList.remove('is-unread');
    item.querySelector('.msg-dot')?.remove();
    const readBtn = item.querySelector('[data-act="read"]');
    if (readBtn) readBtn.textContent = '已读';
  });

  // 全部已读（GSAP：数字滚动 + 卡片依次消失）
  document.getElementById('msg-readAll').addEventListener('click', () => {
    const unreadItems = Array.from(list.querySelectorAll('.msg-item.is-unread'));
    const statEl = document.querySelector('.msg-section-stat strong');
    const statBig = document.querySelectorAll('.msg-stat-card .value')[0];
    const startVal = statEl ? parseInt(statEl.textContent) || unreadItems.length : unreadItems.length;

    // 1) 数字滚动到 0（GSAP tween 数字对象）
    if (statEl) {
      const counter = { val: startVal };
      gsap.to(counter, {
        val: 0, duration: 0.8, ease: 'power2.out',
        onUpdate: () => { statEl.textContent = Math.round(counter.val); },
        onComplete: () => { statEl.textContent = '0'; }
      });
    }
    if (statBig) {
      const counter = { val: parseInt(statBig.textContent) || startVal };
      gsap.to(counter, {
        val: 0, duration: 0.9, ease: 'power2.out',
        onUpdate: () => { statBig.firstChild.nodeValue = Math.round(counter.val); }
      });
    }

    // 2) 卡片依次消失（stagger 上移 + 渐隐 + 内部元素逐个变化）
    unreadItems.forEach((li, i) => {
      const dot = li.querySelector('.msg-dot');
      const readBtn = li.querySelector('[data-act="read"]');
      const tl = gsap.timeline({ delay: i * 0.08 });
      // 2a) 红色 dot 缩小消失
      if (dot) tl.to(dot, { scale: 0, opacity: 0, duration: 0.25, ease: 'back.in(1.7)' }, 0);
      // 2b) 卡片左边的暖色背景渐淡（去掉 is-unread 类）
      tl.add(() => li.classList.remove('is-unread'), 0.15);
      // 2c) 按钮文字变 "已读"
      tl.add(() => { if (readBtn) readBtn.textContent = '已读'; }, 0.2);
    });

    // 3) 全部卡片轻微"打卡"反馈（整个列表往右轻推一下再回弹）
    gsap.fromTo(list, { x: -4 }, { x: 0, duration: 0.4, ease: 'elastic.out(1, 0.5)' });
  });

  // 详情弹窗
  const modal = document.getElementById('msg-modal');
  const mHead = document.getElementById('msg-modal-head');
  const mBody = document.getElementById('msg-modal-body');
  function openModal(item) {
    const tag = item.querySelector('.msg-tag').textContent;
    const title = item.querySelector('.msg-title').textContent;
    const summary = item.querySelector('.msg-summary').textContent;
    const time = item.querySelector('.msg-time').textContent;
    mHead.innerHTML = '<span class="msg-tag">' + tag + '</span> <h2>' + title + '</h2><div class="msg-time">' + time + '</div>';
    mBody.innerHTML = '<p>' + summary + '</p>'
      + '<div class="msg-modal-extras">'
      + '<h4>处理建议</h4><ul>'
      + '<li>点击"前往处理"进入对应业务页面查看完整上下文</li>'
      + '<li>如有疑问可联系平台客服：400-080-1314</li>'
      + '<li>消息保留 90 天，过期后可在"消息归档"中查询</li>'
      + '</ul></div>';
    modal.hidden = false;
  }
  function closeModal() { modal.hidden = true; }
  document.querySelector('.msg-modal-close').addEventListener('click', closeModal);
  document.getElementById('msg-modal-cancel').addEventListener('click', closeModal);
  document.getElementById('msg-modal-go').addEventListener('click', () => {
    alert('演示：跳转到对应业务页（注册审核/物流轨迹/反馈详情）');
  });
  modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
})();
`;

  // 工作台侧边栏
  window.DASH_SIDEBAR = {
    company: (active) => `
<aside class="dash-side">
  <div class="user-card">
    <div class="avatar">企</div>
    <div class="info">
      <div class="name">美心食品集团</div>
      <div class="role">企业 · 已认证</div>
    </div>
  </div>
  <div class="side-section">
    <div class="side-title">概览</div>
    <div class="side-menu">
      <a href="dashboard.html" class="${active==='dashboard'?'active':''}"><span class="ic">📊</span>数据看板</a>
      <a href="messages.html" class="${active==='messages'?'active':''}"><span class="ic">🔔</span>消息中心 <span class="badge-mini">${getUnreadCount("company")}</span></a>
      <a href="profile.html" class="${active==='profile'?'active':''}"><span class="ic">🏢</span>企业品宣主页</a>
    </div>
  </div>
  <div class="side-section">
    <div class="side-title">捐赠管理</div>
    <div class="side-menu">
      <a href="donate-publish.html" class="${active==='donate-publish'?'active':''}"><span class="ic">📦</span>发起捐赠</a>
      <a href="donate-respond.html" class="${active==='donate-respond'?'active':''}"><span class="ic">🤝</span>响应捐赠项目 <span class="badge-mini">5</span></a>
      <a href="donation-list.html" class="${active==='donation-list'?'active':''}"><span class="ic">📋</span>捐赠记录</a>
      <a href="donation-detail.html" class="${active==='donation-detail'?'active':''}"><span class="ic">🔍</span>物资轨迹详情</a>
    </div>
  </div>
  <div class="side-section">
    <div class="side-title">商城与商品</div>
    <div class="side-menu">
      <a href="products.html" class="${active==='products'?'active':''}"><span class="ic">🛒</span>商品管理</a>
    </div>
  </div>
  <div class="side-section">
    <div class="side-title">财务</div>
    <div class="side-menu">
      <a href="bills.html" class="${active==='bills'?'active':''}"><span class="ic">💰</span>入驻费 / 年费 / 押金</a>
    </div>
  </div>
</aside>`,

    charity: (active) => `
<aside class="dash-side">
  <div class="user-card">
    <div class="avatar">慈</div>
    <div class="info">
      <div class="name">广东省慈善总会</div>
      <div class="role">慈善会/总会 · 已认证</div>
    </div>
  </div>
  <div class="side-section">
    <div class="side-title">概览</div>
    <div class="side-menu">
      <a href="dashboard.html" class="${active==='dashboard'?'active':''}"><span class="ic">📊</span>数据看板</a>
      <a href="messages.html" class="${active==='messages'?'active':''}"><span class="ic">🔔</span>消息中心 <span class="badge-mini">${getUnreadCount("charity")}</span></a>
    </div>
  </div>
  <div class="side-section">
    <div class="side-title">项目管理</div>
    <div class="side-menu">
      <a href="project-publish.html" class="${active==='project-publish'?'active':''}"><span class="ic">📢</span>发布受灾项目</a>
      <a href="project-list.html" class="${active==='project-list'?'active':''}"><span class="ic">📋</span>项目管理</a>
    </div>
  </div>
  <div class="side-section">
    <div class="side-title">物资流转</div>
    <div class="side-menu">
      <a href="donation-claim.html" class="${active==='donation-claim'?'active':''}"><span class="ic">📥</span>领取企业捐赠 <span class="badge-mini">8</span></a>
      <a href="distribute.html" class="${active==='distribute'?'active':''}"><span class="ic">🚚</span>物资派发</a>
    </div>
  </div>
  <div class="side-section">
    <div class="side-title">人员与报告</div>
    <div class="side-menu">
      <a href="volunteer-manage.html" class="${active==='volunteer-manage'?'active':''}"><span class="ic">👥</span>志愿者管理</a>
      <a href="reports.html" class="${active==='reports'?'active':''}"><span class="ic">📈</span>数据报告</a>
    </div>
  </div>
</aside>`,

    org: (active) => `
<aside class="dash-side">
  <div class="user-card">
    <div class="avatar">社</div>
    <div class="info">
      <div class="name">深圳市壹基金公益基金会</div>
      <div class="role">社会组织 · 已认证</div>
    </div>
  </div>
  <div class="side-section">
    <div class="side-title">概览</div>
    <div class="side-menu">
      <a href="dashboard.html" class="${active==='dashboard'?'active':''}"><span class="ic">📊</span>数据看板</a>
      <a href="messages.html" class="${active==='messages'?'active':''}"><span class="ic">🔔</span>消息中心 <span class="badge-mini">${getUnreadCount("org")}</span></a>
      <a href="profile.html" class="${active==='profile'?'active':''}"><span class="ic">🏛️</span>组织信息</a>
    </div>
  </div>
  <div class="side-section">
    <div class="side-title">人员与派发</div>
    <div class="side-menu">
      <a href="volunteer-manage.html" class="${active==='volunteer-manage'?'active':''}"><span class="ic">👥</span>志愿者管理</a>
      <a href="distribute.html" class="${active==='distribute'?'active':''}"><span class="ic">🚚</span>物资派发</a>
    </div>
  </div>
  <div class="side-section">
    <div class="side-title">数据</div>
    <div class="side-menu">
      <a href="statistics.html" class="${active==='statistics'?'active':''}"><span class="ic">📈</span>统计报告</a>
    </div>
  </div>
</aside>`,

    volunteer: (active) => `
<aside class="dash-side">
  <div class="user-card">
    <div class="avatar">志</div>
    <div class="info">
      <div class="name">张伟</div>
      <div class="role">志愿者/社工 · 已认证</div>
    </div>
  </div>
  <div class="side-section">
    <div class="side-title">我的工作</div>
    <div class="side-menu">
      <a href="dashboard.html" class="${active==='dashboard'?'active':''}"><span class="ic">📊</span>数据看板</a>
      <a href="messages.html" class="${active==='messages'?'active':''}"><span class="ic">🔔</span>消息中心 <span class="badge-mini">${getUnreadCount("volunteer")}</span></a>
      <a href="task-list.html" class="${active==='task-list'?'active':''}"><span class="ic">📋</span>派发任务 <span class="badge-mini">3</span></a>
    </div>
  </div>
  <div class="side-section">
    <div class="side-title">任务详情</div>
    <div class="side-menu">
      <a href="task-detail.html" class="${active==='task-detail'?'active':''}"><span class="ic">🔍</span>扫码派发详情</a>
      <a href="statistics.html" class="${active==='statistics'?'active':''}"><span class="ic">📈</span>服务统计</a>
    </div>
  </div>
  <div class="side-section">
    <div class="side-title">个人</div>
    <div class="side-menu">
      <a href="profile.html" class="${active==='profile'?'active':''}"><span class="ic">👤</span>个人中心</a>
    </div>
  </div>
</aside>`,

    recipient: (active) => `
<aside class="dash-side">
  <div class="user-card">
    <div class="avatar">受</div>
    <div class="info">
      <div class="name">李华</div>
      <div class="role">受捐者 · 已认证</div>
    </div>
  </div>
  <div class="side-section">
    <div class="side-title">我的受捐</div>
    <div class="side-menu">
      <a href="dashboard.html" class="${active==='dashboard'?'active':''}"><span class="ic">📊</span>我的中心</a>
      <a href="messages.html" class="${active==='messages'?'active':''}"><span class="ic">🔔</span>消息中心 <span class="badge-mini">${getUnreadCount("recipient")}</span></a>
      <a href="receive.html" class="${active==='receive'?'active':''}"><span class="ic">📱</span>扫码领取物资</a>
      <a href="history.html" class="${active==='history'?'active':''}"><span class="ic">📋</span>领取记录</a>
    </div>
  </div>
  <div class="side-section">
    <div class="side-title">反馈</div>
    <div class="side-menu">
      <a href="feedback.html" class="${active==='feedback'?'active':''}"><span class="ic">💌</span>意见反馈</a>
    </div>
  </div>
</aside>`
  };

  // 暴露到全局
  window.CS = {
    renderHeader: function(active) {
      loadPartial('site-header', getHeader(active));
      // 移动端汉堡菜单（header 注入后绑定一次）
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initMobileNav);
      } else {
        setTimeout(initMobileNav, 0);
      }
    },
    renderDashHeader: function(role, userName, activePage, backTo) {
      loadPartial('site-header', getDashHeader(role, userName, activePage, backTo));
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initMobileNav);
        document.addEventListener('DOMContentLoaded', initDashSide);
      } else {
        setTimeout(initMobileNav, 0);
        setTimeout(initDashSide, 0);
      }
    },
    renderFooter: function() {
      loadPartial('site-footer', getFooter());
    },
    // 暴露 initMobileNav 供 index.html 自己的 front-header 复用
    initMobileNav: initMobileNav,
    // 暴露 initDashSide 供各 dashboard.html 调用（绑定 drawer 切换）
    initDashSide: initDashSide,
    renderSidebar: function(role, active) {
      loadPartial('dash-side', window.DASH_SIDEBAR[role](active));
    },
    renderDashMsgBanner: function(role) {
      const slot = document.getElementById('msg-banner-slot');
      if (slot) slot.outerHTML = getDashMsgBanner(role);
    },
    // 暴露给独立 messages.html 使用（5 个角色各自一个文件）
    getMessagesBody: function(roleKey, roleName, userName) {
      return getMessagesBody(roleKey, roleName, userName);
    },
    getMessagesModal: function() {
      return getMessagesModal();
    },
    MESSAGES_SCRIPT: MESSAGES_SCRIPT,
    // 商品选择器（共用数据源）
    PRODUCTS_DATA: PRODUCTS_DATA,
    findProduct: findProduct,
    calcExpiryDate: calcExpiryDate,
    renderProductPicker: renderProductPicker,
    // 受灾项目（消费者可购买赠送）
    DISASTER_PROJECTS: DISASTER_PROJECTS,
    findDisasterProject: findDisasterProject,
    path: getPathPrefix
  };

  // ============================================
  // 2. 数字滚动动画
  // ============================================
  function animateNumber(el, target, duration) {
    const start = 0;
    const startTime = performance.now();
    const isFloat = String(target).indexOf('.') >= 0;
    function step(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = start + (target - start) * eased;
      el.textContent = isFloat ? value.toFixed(1) : Math.floor(value).toLocaleString();
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  window.CS.animateNumber = animateNumber;

  // ============================================
  // 3. 滚动到可视区域时触发动画
  // ============================================
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in-view');
        const numEl = e.target.querySelector('[data-num]');
        if (numEl && !numEl.dataset.animated) {
          numEl.dataset.animated = '1';
          animateNumber(numEl, parseFloat(numEl.dataset.num), 1500);
        }
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.2 });

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.animate-on-scroll').forEach(el => io.observe(el));
  });

  // ============================================
  // 4. 通用工具
  // ============================================
  window.CS.toast = function(msg, type) {
    const t = document.createElement('div');
    t.textContent = msg;
    t.style.cssText = 'position:fixed;top:24px;left:50%;transform:translateX(-50%);z-index:9999;padding:12px 24px;background:' +
      (type==='error' ? '#DC2626' : type==='success' ? '#16A34A' : '#0E5A6F') +
      ';color:#fff;border-radius:8px;font-size:14px;box-shadow:0 8px 24px rgba(0,0,0,0.2);';
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 2500);
  };

  window.CS.modal = function(opts) {
    const m = document.createElement('div');
    m.className = 'modal-mask';
    m.innerHTML = `<div class="modal-card">
      <div class="modal-header">
        <h3>${opts.title || '提示'}</h3>
        <button class="modal-close">✕</button>
      </div>
      <div class="modal-body">${opts.body || ''}</div>
      ${opts.footer === false ? '' : `<div class="modal-footer">
        <button class="btn btn-ghost modal-cancel">${opts.cancelText || '取消'}</button>
        <button class="btn btn-primary modal-ok">${opts.okText || '确定'}</button>
      </div>`}
    </div>`;
    document.body.appendChild(m);
    m.querySelector('.modal-close').onclick = m.querySelector('.modal-cancel').onclick = () => m.remove();
    if (m.querySelector('.modal-ok')) m.querySelector('.modal-ok').onclick = () => { opts.onOk && opts.onOk(); m.remove(); };
    if (opts.onShow) opts.onShow(m);
  };

})();
