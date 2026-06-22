/* ========================================
   hire-center.js — AI Agent 雇佣中心（M4）
   PRD §11: 16 专家 + 等级锁定 + 雇佣确认 + 我的雇佣
   ======================================== */

(function () {
  'use strict';

  /* === 分类 + 等级映射 === */
  const CATEGORIES = ['全部', '销售', '客服', '写作', '设计', '视频', '会议', '数据', '合规'];
  const TIERS = [
    { key: 'all',   label: '全部' },
    { key: 'junior',label: '入门级' },
    { key: 'mid',   label: '中级' },
    { key: 'top',   label: '顶级' }
  ];

  /* === 状态：全局缓存 === */
  let _expertsCache = null;
  let _filterCategory = '全部';
  let _filterTier = 'all';
  let _tickHandle = null;

  /* === 工具 === */
  function fmt(n) { return Number(n || 0).toLocaleString('en-US'); }
  function fmtMoney(n) { return Number(n || 0).toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 }); }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c])); }
  function levelColor(level) {
    return ({ NU: '#8a8a8a', VIP: '#10b981', MN: '#8b5cf6', MB: '#d4a017' })[level] || '#8a8a8a';
  }
  function tierLabel(tier) {
    return ({ junior: '入门级', mid: '中级', top: '顶级' })[tier] || tier;
  }

  /* === 内联兜底数据（file:// 下 fetch 被拦截时用） === */
  const INLINE_EXPERTS = [
    { id:'sales-junior',  name:'销售转化专家',   tier:'junior',category:'销售',requireLevel:'VIP',priceUMDT:9.9,durationHours:24,tokenEstimate:2000,rating:4.7,caseCount:1280,avatarColor:'#ff6b35',tags:['转化','话术','私域'],capability:['识别客户意向','匹配商品推荐','生成转化话术','跟进节奏建议'],outputDesc:'可接管消息与客人对话' },
    { id:'writing-junior',name:'公众号爆款专家',  tier:'junior',category:'写作',requireLevel:'VIP',priceUMDT:9.9,durationHours:48,tokenEstimate:2500,rating:4.6,caseCount:956, avatarColor:'#f59e0b',tags:['爆款','选题','标题'],capability:['爆款标题公式','选题方向','内容结构','引导关注技巧'],outputDesc:'生成高打开率选题和初稿' },
    { id:'design-junior', name:'Logo 设计专家',   tier:'junior',category:'设计',requireLevel:'VIP',priceUMDT:9.9,durationHours:12,tokenEstimate:1500,rating:4.8,caseCount:2300,avatarColor:'#3b82f6',tags:['Logo','VI','品牌'],capability:['Logo 初稿','配色方案','字体建议','VI 手册框架'],outputDesc:'3 套方向提案，48h 内交付' },
    { id:'data-junior',   name:'数据复盘专家',     tier:'junior',category:'数据',requireLevel:'VIP',priceUMDT:9.9,durationHours:24,tokenEstimate:1800,rating:4.5,caseCount:650, avatarColor:'#10b981',tags:['复盘','Excel','PPT'],capability:['数据整理','图表生成','PPT 初稿','关键洞察提炼'],outputDesc:'输出可直接汇报的 PPT' },
    { id:'customer-junior',name:'AI 客服托管',    tier:'junior',category:'客服',requireLevel:'VIP',priceUMDT:9.9,durationHours:72,tokenEstimate:3000,rating:4.9,caseCount:3400,avatarColor:'#8b5cf6',tags:['客服','托管','接待'],capability:['自动回复','FAQ 生成','情绪检测','满意度管理'],outputDesc:'7×24h 自动接待，响应 < 3s' },
    { id:'video-junior',  name:'短视频脚本专家',   tier:'junior',category:'视频',requireLevel:'VIP',priceUMDT:9.9,durationHours:24,tokenEstimate:2200,rating:4.7,caseCount:1890,avatarColor:'#ef4444',tags:['短视频','脚本','口播'],capability:['钩子公式','内容结构','字幕样式','BGM 建议'],outputDesc:'3 条可选脚本，适配抖音/视频号' },
    { id:'meeting-junior',name:'会议纪要专家',     tier:'junior',category:'会议',requireLevel:'VIP',priceUMDT:9.9,durationHours:4, tokenEstimate:800, rating:4.8,caseCount:4100,avatarColor:'#06b6d4',tags:['纪要','周报','总结'],capability:['实时转录','重点提炼','待办事项','负责人追踪'],outputDesc:'1h 会议 → 完整纪要 < 5min' },
    { id:'writing-mid',   name:'品牌文案专家',     tier:'mid',   category:'写作',requireLevel:'MN',priceUMDT:49,durationHours:48,tokenEstimate:8000,rating:4.8,caseCount:380, avatarColor:'#d97706',tags:['品牌','文案','Slogan'],capability:['品牌定位梳理','Slogan 10 条','品牌故事','核心价值主张'],outputDesc:'完整品牌文案体系' },
    { id:'design-mid',    name:'品牌设计专家',     tier:'mid',   category:'设计',requireLevel:'MN',priceUMDT:49,durationHours:72,tokenEstimate:12000,rating:4.9,caseCount:210, avatarColor:'#7c3aed',tags:['品牌','VI','画册'],capability:['视觉定位','Logo 终稿','色彩系统','应用规范'],outputDesc:'完整 VI 手册交付' },
    { id:'sales-mid',     name:'大客户销售专家',   tier:'mid',   category:'销售',requireLevel:'MN',priceUMDT:49,durationHours:168,tokenEstimate:25000,rating:4.9,caseCount:89,  avatarColor:'#b91c1c',tags:['大客','方案','谈判'],capability:['客户画像分析','定制化报价方案','谈判策略','合同风险点'],outputDesc:'提供可直接使用的大客攻关方案' },
    { id:'video-top',     name:'TVC 广告专家',     tier:'top',   category:'视频',requireLevel:'MB',priceUMDT:299,durationHours:720,tokenEstimate:80000,rating:5.0,caseCount:12,  avatarColor:'#1a1a1a',tags:['TVC','广告','品牌片'],capability:['创意脚本','分镜设计','拍摄团队对接','后期审片'],outputDesc:'品牌级 TVC 全流程制作' },
    { id:'data-top',      name:'数据战略专家',     tier:'top',   category:'数据',requireLevel:'MB',priceUMDT:299,durationHours:720,tokenEstimate:100000,rating:5.0,caseCount:8,   avatarColor:'#065f46',tags:['数据中台','BI','战略'],capability:['数据架构设计','指标体系','BI 看板','数据团队组建'],outputDesc:'完整数据战略规划方案' },
    { id:'writing-top',   name:'内容战略专家',     tier:'top',   category:'写作',requireLevel:'MB',priceUMDT:299,durationHours:720,tokenEstimate:80000,rating:5.0,caseCount:15,  avatarColor:'#92400e',tags:['内容营销','IP','矩阵'],capability:['内容矩阵规划','IP 定位','爆款公式','分发策略'],outputDesc:'3 个月内容营销完整方案' },
    { id:'fengshui-top',  name:'风水顾问专家',     tier:'top',   category:'合规',requireLevel:'MB',priceUMDT:299,durationHours:24,tokenEstimate:5000,rating:4.9,caseCount:45,  avatarColor:'#a16207',tags:['风水','玄学','布局'],capability:['办公室风水','座位朝向','招财布局','禁忌提醒'],outputDesc:'结合八字提供风水布局报告' },
    { id:'customer-mid',  name:'客户成功专家',     tier:'mid',   category:'客服',requireLevel:'MN',priceUMDT:49,durationHours:168,tokenEstimate:20000,rating:4.8,caseCount:176, avatarColor:'#0891b2',tags:['客户成功','续费','增值'],capability:['客户分层','续费策略','增值方案','健康度追踪'],outputDesc:'客户续费率提升方案' },
    { id:'meeting-top',  name:'战略会议专家',     tier:'top',   category:'会议',requireLevel:'MB',priceUMDT:299,durationHours:48,tokenEstimate:40000,rating:5.0,caseCount:6,   avatarColor:'#1e3a5f',tags:['战略','高管','规划'],capability:['高管教练','战略对齐','OKR 制定','会议引导'],outputDesc:'引导董事会级战略对齐会议' }
  ];

  /* === 6 张透明 PNG 按分类映射（PRD 资源复用） === */
  const CHAR_PNG = {
    '销售': 'agent-sales-transparent.png',
    '写作': 'agent-writing-transparent.png',
    '设计': 'agent-design-transparent.png',
    '视频': 'agent-video-transparent.png',
    '客服': 'agent-customer-transparent.png',
    '会议': 'agent-meeting-transparent.png',
    '数据': 'agent-design-transparent.png',  // 复用设计 PNG
    '合规': 'agent-meeting-transparent.png'  // 复用会议 PNG
  };
  const CHAR_PNG_DIR = 'assets/agents/transparent/';

  /* === 加载专家（fetch + 缓存，失败则 fallback 内联） === */
  async function loadExperts() {
    if (_expertsCache) return _expertsCache;
    try {
      const res = await fetch('./data/experts.mock.json');
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const data = await res.json();
      _expertsCache = data.experts || [];
    } catch (e) {
      console.warn('[hire-center] fetch experts.mock.json 失败，用内联数据:', e.message);
      _expertsCache = INLINE_EXPERTS;
    }
    return _expertsCache;
  }

  /* === 入口 === */
  window.openHireCenter = async function () {
    const root = document.getElementById('hireHubRoot');
    if (!root) return;
    const experts = await loadExperts();
    renderHireCenter(root, experts);
    // 启动倒计时刷新
    if (_tickHandle) clearInterval(_tickHandle);
    _tickHandle = setInterval(() => updateActiveHiresCountdown(experts), 1000);
  };

  /* === 渲染主页面 === */
  function renderHireCenter(root, experts) {
    const level = window.userStore?.level || 'NU';
    const visible = experts.filter(passFilter);

    root.innerHTML = `
      <div class="hc-grid">
        <!-- 左侧筛选 -->
        <aside class="hc-filter">
          <div class="hc-section-head"><span class="kicker-tag">FILTER</span><strong>筛选</strong></div>

          <div class="hc-filter-group">
            <span class="hc-filter-label">分类</span>
            <div class="hc-filter-pills">
              ${CATEGORIES.map(c => `
                <button class="hc-filter-pill ${_filterCategory === c ? 'is-active' : ''}" data-hc-filter="category" data-value="${esc(c)}">${esc(c)}</button>
              `).join('')}
            </div>
          </div>

          <div class="hc-filter-group">
            <span class="hc-filter-label">等级</span>
            <div class="hc-filter-pills">
              ${TIERS.map(t => `
                <button class="hc-filter-pill ${_filterTier === t.key ? 'is-active' : ''}" data-hc-filter="tier" data-value="${t.key}">${esc(t.label)}</button>
              `).join('')}
            </div>
          </div>

          <div class="hc-filter-group">
            <span class="hc-filter-label">会员状态</span>
            <div class="hc-filter-status">
              <span class="member-badge ${level.toLowerCase()}"><i class="badge-dot"></i><span class="lvl-text">${level}</span></span>
              <span class="hc-filter-status-text">当前等级</span>
            </div>
            ${level === 'NU' ? '<button class="hc-filter-upgrade" data-nav="membership">升级 VIP 解锁 3 个专家</button>' : ''}
            ${level === 'VIP' ? '<button class="hc-filter-upgrade" data-nav="membership">升级 MN 解锁更多</button>' : ''}
          </div>
        </aside>

        <!-- 中：工位展台（按 office 人物风格） -->
        <section class="hc-cards">
          <div class="hc-page-head">
            <div class="hc-page-head-left">
              <h2>雇佣 <em>专家市场</em></h2>
              <span class="hc-page-head-meta"><strong>${visible.filter(e => canUseTier(level, e.tier)).length}</strong> / ${experts.length} 可用 · ${experts.length - visible.filter(e => canUseTier(level, e.tier)).length} 锁定</span>
            </div>
          </div>
          ${renderStationGrid(visible, level)}
        </section>

        <!-- 右：我的雇佣 -->
        <aside class="hc-mine">
          <div class="hc-mine-head">
            <span class="kicker-tag">MY HIRES</span>
            <strong>我的雇佣</strong>
          </div>
          <div class="hc-mine-tabs">
            <button class="hc-mine-tab is-active" data-hc-mine-tab="active">进行中</button>
            <button class="hc-mine-tab" data-hc-mine-tab="history">历史</button>
          </div>
          <div class="hc-mine-list" id="hcMineList">${renderMineList('active', experts)}</div>
        </aside>
      </div>
    `;

    bindHireCenterEvents(root);
  }

  /* === 筛选逻辑 === */
  function passFilter(expert) {
    if (_filterCategory !== '全部' && expert.category !== _filterCategory) return false;
    if (_filterTier !== 'all' && expert.tier !== _filterTier) return false;
    return true;
  }

  /* === 等级可用判断 === */
  function canUseTier(level, requireLevel) {
    const tierMap = { NU: [], VIP: ['junior'], MN: ['junior', 'mid'], MB: ['junior', 'mid', 'top'] };
    return (tierMap[level] || []).includes({ junior: 'junior', mid: 'mid', top: 'top' }[requireLevel]);
  }

  /* === 工位渲染（stage 人物展台 + info 操作条 分层） === */
  function renderExpertCard(expert, level) {
    const usable = canUseTier(level, expert.tier);
    const tier = tierLabel(expert.tier);
    const png = CHAR_PNG[expert.category] || 'agent-design-transparent.png';
    const statusClass = usable ? 'is-available' : 'is-locked';

    return `
      <article class="hc-station ${statusClass}" data-expert-id="${esc(expert.id)}" style="--c:${expert.avatarColor}">
        <div class="hc-station-stage">
          <div class="hc-station-shadow"></div>
          ${usable ? '' : '<div class="hc-station-lock-overlay"></div>'}
          <div class="hc-station-floor"></div>
          <div class="hc-station-desk"></div>
          <div class="hc-station-monitor"></div>
          <div class="hc-station-chair"></div>
          <div class="hc-station-agent">
            <img class="hc-station-avatar" src="${CHAR_PNG_DIR}${png}" alt="${esc(expert.name)}" loading="lazy">
          </div>
          <div class="hc-station-badge">
            <span class="hc-station-tier">${tier}</span>
            <span class="hc-station-price">¥${fmtMoney(expert.priceUMDT)}</span>
          </div>
        </div>
        <div class="hc-station-info">
          <div class="hc-station-name">${esc(expert.name)}</div>
          <div class="hc-station-meta">${expert.durationHours}h<span class="sep">·</span>~${fmt(expert.tokenEstimate)} Token</div>
          <div class="hc-station-actions">
            ${usable
              ? `<button class="hc-station-buy" data-hc-action="hire" data-expert-id="${esc(expert.id)}">雇佣</button>
                 <button class="hc-station-detail" data-hc-action="detail" data-expert-id="${esc(expert.id)}">详情</button>`
              : `<button class="hc-station-locked" data-hc-action="level">🔒 ${expert.requireLevel}+</button>`
            }
          </div>
        </div>
      </article>
    `;
  }

  /* === 按 tier 分组（Bento：不同 size）+ tier 段标题 === */
  function renderStationGrid(visible, level) {
    if (visible.length === 0) return '<div class="hc-empty">没有匹配的专家</div>';
    const groups = [
      { tier: 'junior', label: '入门级', price: '¥9.9 / 次', items: visible.filter(e => e.tier === 'junior') },
      { tier: 'mid',    label: '中级',   price: '¥49 / 次',  items: visible.filter(e => e.tier === 'mid') },
      { tier: 'top',    label: '顶级',   price: '¥299 / 次', items: visible.filter(e => e.tier === 'top') }
    ].filter(g => g.items.length > 0);

    return groups.map(g => `
      <section class="hc-tier-section">
        <header class="hc-tier-head">
          <div class="hc-tier-head-left">
            <h3><em>${esc(g.label)}</em>专家</h3>
            <span class="hc-tier-head-num mono">${g.items.length} 位</span>
          </div>
          <span class="hc-tier-head-price mono">${g.price}</span>
        </header>
        <div class="hc-station-grid hc-station-grid--${g.tier}">
          ${g.items.map(e => renderExpertCard(e, level)).join('')}
        </div>
      </section>
    `).join('');
  }

  /* === 我的雇佣列表 === */
  function renderMineList(tab, experts) {
    const hires = window.hireStore;
    const items = tab === 'active' ? hires.active : hires.history;
    if (!items || items.length === 0) {
      return `<div class="hc-mine-empty">${tab === 'active' ? '暂无进行中的专家' : '暂无历史雇佣'}</div>`;
    }
    return items.map(h => {
      const expert = experts.find(e => e.id === h.expertId);
      const exp = expert || { name: '未知', avatarColor: '#999', tier: 'junior', durationHours: 24 };
      return `
        <article class="hc-mine-item" data-hire-id="${h.id}">
          <div class="hc-mine-item-head">
            <div class="hc-mine-item-icon" style="background:${exp.avatarColor}">${esc((exp.name || '?')[0])}</div>
            <div class="hc-mine-item-info">
              <strong>${esc(exp.name)}</strong>
              <em class="mono">${esc(tierLabel(exp.tier))} · ¥${fmtMoney(h.costUMDT)}</em>
            </div>
            ${tab === 'active' ? '<span class="hc-mine-countdown mono" data-countdown="' + h.id + '">--:--:--</span>' : '<span class="hc-mine-status mono">已过期</span>'}
          </div>
          <div class="hc-mine-item-foot">
            ${tab === 'active'
              ? '<button class="hc-mine-mini-btn" data-hc-mine-action="continue" data-hire-id="' + h.id + '">继续对话</button>'
              : ''}
            <button class="hc-mine-mini-btn" data-hc-mine-action="detail" data-hire-id="${h.id}">查看</button>
          </div>
        </article>
      `;
    }).join('');
  }

  /* === 倒计时刷新 === */
  function updateActiveHiresCountdown(experts) {
    const hires = window.hireStore;
    if (!hires || !hires.active) return;
    hires.active.forEach(h => {
      const el = document.querySelector('[data-countdown="' + h.id + '"]');
      if (!el) return;
      const remaining = Math.max(0, new Date(h.expireAt).getTime() - Date.now());
      const hh = Math.floor(remaining / 3600000);
      const mm = Math.floor((remaining % 3600000) / 60000);
      const ss = Math.floor((remaining % 60000) / 1000);
      el.textContent = String(hh).padStart(2, '0') + ':' + String(mm).padStart(2, '0') + ':' + String(ss).padStart(2, '0');
      // 到期自动移到历史
      if (remaining <= 0) {
        h.status = 'expired';
        hires.history.unshift(h);
        const idx = hires.active.indexOf(h);
        if (idx >= 0) hires.active.splice(idx, 1);
        const root = document.getElementById('hireHubRoot');
        if (root) renderHireCenter(root, experts);
        showToast('专家雇佣已到期，自动移入历史', { type: 'info' });
      }
    });
  }

  /* === 事件绑定 === */
  function bindHireCenterEvents(root) {
    // 分类筛选
    root.querySelectorAll('[data-hc-filter="category"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        _filterCategory = e.currentTarget.dataset.value;
        const experts = _expertsCache || [];
        renderHireCenter(root, experts);
      });
    });
    // 等级筛选
    root.querySelectorAll('[data-hc-filter="tier"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        _filterTier = e.currentTarget.dataset.value;
        const experts = _expertsCache || [];
        renderHireCenter(root, experts);
      });
    });
    // 我的雇佣 tab 切换
    root.querySelectorAll('[data-hc-mine-tab]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        root.querySelectorAll('[data-hc-mine-tab]').forEach(b => b.classList.toggle('is-active', b === e.currentTarget));
        const tab = e.currentTarget.dataset.hcMineTab;
        const experts = _expertsCache || [];
        const list = document.getElementById('hcMineList');
        if (list) list.innerHTML = renderMineList(tab, experts);
      });
    });
    // 卡片按钮
    root.querySelectorAll('[data-hc-action="hire"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.dataset.expertId;
        const expert = (_expertsCache || []).find(x => x.id === id);
        if (expert) openHireDialog(expert);
      });
    });
    root.querySelectorAll('[data-hc-action="level"]').forEach(btn => {
      btn.addEventListener('click', () => {
        showLevelShortage((window.userStore?.level || 'NU') === 'NU' ? 'VIP' : 'MN');
      });
    });
    root.querySelectorAll('[data-hc-action="detail"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.dataset.expertId;
        const expert = (_expertsCache || []).find(x => x.id === id);
        if (expert) openDetailDialog(expert);
      });
    });
    // 我的雇佣按钮
    root.querySelectorAll('[data-hc-mine-action="continue"]').forEach(btn => {
      btn.addEventListener('click', () => {
        showToast('继续对话 · M5 阶段接入', { type: 'info' });
      });
    });
    root.querySelectorAll('[data-hc-mine-action="detail"]').forEach(btn => {
      btn.addEventListener('click', () => {
        showToast('查看产出 · M5 阶段接入', { type: 'info' });
      });
    });
  }

  /* === 详情弹窗 === */
  function openDetailDialog(expert) {
    const html = `
      <div class="hc-detail">
        <header class="hc-detail-hero">
          <div class="hc-detail-avatar" style="background:${expert.avatarColor}">${esc(expert.category[0])}</div>
          <div class="hc-detail-meta">
            <div class="hc-detail-kicker">${esc(tierLabel(expert.tier))} · ${esc(expert.category)}</div>
            <h3 class="hc-detail-name">${esc(expert.name)}</h3>
            <div class="hc-detail-rating">★ ${expert.rating}<span class="hc-detail-dot">·</span>${fmt(expert.caseCount)} 案例<span class="hc-detail-dot">·</span>${expert.durationHours}h</div>
            <div class="hc-detail-tags">${expert.tags.map(t => '<span class="hc-detail-tag">' + esc(t) + '</span>').join('')}</div>
          </div>
        </header>

        <section class="hc-detail-block">
          <div class="hc-detail-block-kicker">他能为你做什么</div>
          <p class="hc-detail-desc">${esc(expert.outputDesc)}</p>
        </section>

        <section class="hc-detail-block">
          <div class="hc-detail-block-kicker">能力清单</div>
          <ul class="hc-detail-caps">${expert.capability.map(c => '<li class="hc-detail-cap"><i class="hc-detail-cap-tick"></i>' + esc(c) + '</li>').join('')}</ul>
        </section>

        <section class="hc-detail-block hc-detail-pricing">
          <div class="hc-detail-price">
            <div class="hc-detail-price-kicker">价格</div>
            <div class="hc-detail-price-val">¥${fmtMoney(expert.priceUMDT)}<i>UMDT</i></div>
          </div>
          <div class="hc-detail-price">
            <div class="hc-detail-price-kicker">Token 消耗</div>
            <div class="hc-detail-price-val hc-detail-price-val-mono">${fmt(expert.tokenEstimate)}</div>
          </div>
          <div class="hc-detail-price">
            <div class="hc-detail-price-kicker">交付时长</div>
            <div class="hc-detail-price-val hc-detail-price-val-mono">${expert.durationHours}<i>h</i></div>
          </div>
        </section>
      </div>
    `;
    showDialog({
      title: '专家详情',
      content: html,
      actions: [
        { label: '关闭', onClick: () => {} },
        { label: '立即雇佣', primary: true, onClick: () => openHireDialog(expert) }
      ]
    });
  }

  /* === 雇佣确认弹窗 === */
  function openHireDialog(expert) {
    const level = window.userStore?.level || 'NU';
    if (!membershipActions.canHireTier(expert.tier)) {
      showLevelShortage(expert.requireLevel);
      return;
    }
    if (umdtStore.balance < expert.priceUMDT) {
      showUMDTShortage();
      return;
    }
    const expireAt = new Date(Date.now() + expert.durationHours * 3600000).toISOString();
    showDialog({
      title: '确认雇佣',
      content:
        '专家：' + expert.name + ' (' + tierLabel(expert.tier) + ')\n' +
        '价格：¥' + fmtMoney(expert.priceUMDT) + ' UMDT\n' +
        '时长：' + expert.durationHours + ' 小时\n' +
        'Token 预估：' + fmt(expert.tokenEstimate) + '\n' +
        'UMDT 余额：' + fmtMoney(umdtStore.balance) + '\n\n' +
        '（BR-HIR-003：调用专家时仍会按工作量扣 Token）',
      actions: [
        { label: '取消', onClick: () => {} },
        { label: '确认雇佣', primary: true, onClick: () => {
          // 扣 UMDT
          umdtStore.balance -= expert.priceUMDT;
          umdtStore.history.push({
            id: 'u' + Date.now(),
            time: new Date().toISOString(),
            type: 'pay',
            umdtAmount: -expert.priceUMDT,
            note: '雇佣 ' + expert.name
          });
          // 创建 hire record
          const hireId = 'h-' + Date.now();
          const hire = {
            id: hireId,
            expertId: expert.id,
            costUMDT: expert.priceUMDT,
            tokenCost: expert.tokenEstimate,
            startAt: new Date().toISOString(),
            expireAt: expireAt,
            status: 'active'
          };
          hireStore.active.unshift(hire);
          hireStore.history.unshift(Object.assign({}, hire, { status: 'active' }));
          showToast('雇佣成功！' + expert.name + ' · ' + expert.durationHours + 'h', { type: 'success' });
          // 重渲染
          const root = document.getElementById('hireHubRoot');
          if (root) renderHireCenter(root, _expertsCache || []);
        } }
      ]
    });
  }

  console.info('[hire-center] 雇佣中心已就绪（lazy fetch experts.mock.json）');

})();