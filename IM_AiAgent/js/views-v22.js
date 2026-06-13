// views.js — 一体式原型的所有视图（手机内）
// 每个 view 返回 HTML 字符串，spa.js 注入到 .phone-content

const WORKFLOW_ITEMS = [
  {
    id: 'wf-reply-xiari',
    icon: '💬',
    title: '夏日提问：产品怎么卖？',
    time: '14:32',
    meta: 'Agent 自动匹配 Q&A #3',
    status: '已回复',
    type: '自动回复',
    customer: '夏日',
    intent: '咨询 VIC 月卡适合人群与购买方式',
    trigger: '命中关键词「怎么卖 / 月卡 / 适合我吗」',
    action: '发送 VIC 月卡说明，并追问使用频率',
    reply: 'VIC 月卡是 ¥199/月，适合高频私聊和群沟通用户。如果你主要是一个人使用，先用月卡试 30 天更稳。',
    next: '若客户追问价格，对比月卡 / 年卡权益',
    confidence: '92%',
    steps: ['识别销售咨询', '检索知识库 Q&A #3', '匹配 VIC 月卡', '发送回复', '等待客户下一句']
  },
  {
    id: 'wf-product-wang',
    icon: '🛒',
    title: '王总询问 VIC 套餐价格',
    time: '14:18',
    meta: '自动发送商品卡片',
    status: '跟进中',
    type: '商品推荐',
    customer: '王总',
    intent: '对比 VIC 年卡和企业版 10 席',
    trigger: '连续 2 次询价 + 查看商品卡 4 次',
    action: '发送企业版商品卡，标记高意向客户',
    reply: '如果团队超过 6 人，企业版 10 席更划算，含团队管理、数据看板和专属客服，年费 ¥3999。',
    next: '15 分钟内人工跟进，可追加限时优惠',
    confidence: '88%',
    steps: ['识别高意向', '读取商品库价格', '应用推荐策略 #2', '发送商品卡', '更新客户标签']
  },
  {
    id: 'wf-pay-linv',
    icon: '🏦',
    title: '李女士要求对公账户',
    time: '13:55',
    meta: '命中付款方式话术',
    status: '已回复',
    type: '付款说明',
    customer: '李女士',
    intent: '索取企业版对公转账信息',
    trigger: '命中「对公 / 开票 / 账户」付款类关键词',
    action: '发送转账信息，并提醒备注订单号',
    reply: '可以对公转账。我先发你账户信息，转账备注请写公司名 + 手机号，到账后财务会在 1 个工作日内确认。',
    next: '客户回传付款截图后转人工确认',
    confidence: '95%',
    steps: ['识别付款咨询', '检索付款题库', '检查禁用承诺', '发送对公说明', '等待付款截图']
  },
  {
    id: 'wf-human-refund',
    icon: '🙋',
    title: '退款争议转人工',
    time: '12:42',
    meta: '超出售后边界',
    status: '已转人工',
    type: '转人工',
    customer: '赵先生',
    intent: '要求立即退款并质疑服务有效期',
    trigger: '包含「投诉 / 立即退款 / 不满意」高风险词',
    action: '停止自动承诺，生成工单交给人工客服',
    reply: '这个问题涉及订单核验和售后判定，我已帮你转人工客服处理，会优先查看订单情况。',
    next: '人工客服确认订单号和退款规则',
    confidence: '97%',
    steps: ['识别售后争议', '触发边界规则', '停止销售话术', '生成工单', '转人工']
  },
  {
    id: 'wf-tag-chen',
    icon: '🏷',
    title: '陈先生升级为复购机会',
    time: '11:10',
    meta: '客户标签自动更新',
    status: '已打标',
    type: '标签更新',
    customer: '陈先生',
    intent: '历史成交客户再次询问年卡优惠',
    trigger: '已成交 + 30 天内再次咨询 + 点击年卡商品卡',
    action: '从普通客户升级为复购机会',
    reply: '系统已记录为复购机会，后续 AI 会优先推荐年卡续费权益和老客户优惠。',
    next: '下一轮咨询优先发送年卡优惠对比',
    confidence: '84%',
    steps: ['读取成交历史', '识别复购信号', '更新客户标签', '调整推荐优先级', '写入日志']
  }
];

const VIEWS = {
  /* ============ 消息列表 ============ */
  'chat-list': () => {
    const pinned = CHATS.filter(c => c.pinned);
    const all = CHATS.filter(c => !c.pinned);
    const totalUnread = CHATS.reduce((sum, c) => sum + (c.unread || 0), 0);
    const hot = CHATS.filter(c => (c.score || 0) >= 85).length;
    return `
      <div class="phone-view active chat-list-view ai-marketing-msg" data-view="chat-list">
        <div class="top-search marketing-search">
          <input class="search-input" placeholder="🔍  搜客户 / 标签 / 商品 / 意图">
          <div class="add-btn">+</div>
        </div>
        <div class="msg-report-hero" data-action="open" data-target="ai-inbox">
          <div class="mr-kicker">AI MARKETING REPORT</div>
          <div class="mr-main">
            <strong>昨日 AI 营销战报</strong>
            <span>${totalUnread} 条待处理 · ${hot} 个高意向 · 1 个售后风险</span>
          </div>
          <div class="mr-stats">
            <div><b>27</b><em>自动触达</em></div>
            <div><b>5</b><em>重点客户</em></div>
            <div><b>3</b><em>建议成交</em></div>
          </div>
        </div>
        <div class="msg-section-head">
          <span>PINNED CASES</span>
          <em>优先跟进</em>
        </div>
        <div class="marketing-chat-stack pinned-cases">
          ${pinned.map(c => renderChatItem(c)).join('')}
        </div>
        <div class="msg-section-head compact">
          <span>CUSTOMER QUEUE</span>
          <em>AI 已识别下一步</em>
        </div>
        <div class="marketing-chat-stack">
          ${all.map(c => renderChatItem(c)).join('')}
        </div>
      </div>
    `;
  },


  /* ============ AI 已处理消息 ============ */
  'ai-inbox': () => {
    const items = [
      ['销冠', '高意向客户：王总追问 VIC 套餐价格', '已生成报价话术 · 建议 10 分钟内跟进', 'HOT', 'agent-grow'],
      ['客服', '3 条退款咨询集中出现', '已归并为售后工单 · 等待订单号', '售后', 'agent-grow'],
      ['会议', '产品周会录音已完成转写', '纪要草稿 86% · 3 个待确认行动项', '纪要', 'agent-meeting'],
      ['销冠', '李女士查看企业版 4 次', 'AI 判断为复购机会 · 推荐优惠券', '机会', 'agent-grow'],
      ['客服', '会员权益问题重复提问', '已匹配 FAQ · 自动回复草稿可发送', 'FAQ', 'agent-grow'],
      ['销冠', '群聊里有人询问付款方式', '建议发送分期/对公转账说明', '成交', 'agent-grow'],
      ['会议', '客户需求评审有新 @我', '已摘出 2 条风险点 · 建议确认排期', '风险', 'agent-meeting'],
      ['客服', '黑名单用户重复私信', '已降低优先级 · 不触发提醒', '低优先', 'agent-grow']
    ];
    return `
      <div class="phone-view" data-view="ai-inbox">
        <div class="ai-inbox-head">
          <span>TODAY</span>
          <strong>8 条 AI 已处理消息</strong>
          <em>按意图、风险、成交机会自动归类</em>
        </div>
        <div class="ai-inbox-list">
          ${items.map((it, i) => `
            <div class="ai-inbox-item ${it[4]}" data-action="open-agent" data-agent="${it[4]}">
              <div class="ai-inbox-rank">${String(i + 1).padStart(2, '0')}</div>
              <div class="ai-inbox-body">
                <div class="ai-inbox-title"><span>${it[0]}</span>${it[1]}</div>
                <div class="ai-inbox-desc">${it[2]}</div>
              </div>
              <div class="ai-inbox-tag">${it[3]}</div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  },

  /* ============ 通讯录 ============ */
  'contact': () => {
    const users = CONTACTS.filter(c => !c.isAgent);
    return `
      <div class="phone-view" data-view="contact">
        <div class="contact-hero">
          <div>
            <span>CONTACTS</span>
            <strong>通讯录</strong>
          </div>
          <button class="contact-add">＋</button>
        </div>
        <div class="top-search contact-search">
          <input class="search-input" placeholder="🔍  搜索联系人 / 群聊 / AI Agent">
        </div>
        <div class="contact-section-title">
          <span>AI AGENTS</span>
          <em>3 个在线</em>
        </div>
        <div class="agent-stack">
        <a class="agent-card-list cust" data-action="open-agent" data-agent="agent-customer">
          <div class="ac-avatar">客</div>
          <div class="ac-body">
            <div class="ac-name">智能客服 <span class="kicker-tag blue" style="font-size:9px;padding:1px 5px;">客服</span></div>
            <div class="ac-desc">7×24 在线 · 秒回咨询</div>
          </div>
          <div class="ac-arrow">›</div>
        </a>
        <a class="agent-card-list sales" data-action="open-agent" data-agent="agent-sales">
          <div class="ac-avatar">销</div>
          <div class="ac-body">
            <div class="ac-name">AI 销冠·小销 <span class="kicker-tag orange" style="font-size:9px;padding:1px 5px;">销冠</span></div>
            <div class="ac-desc">主动引导成交 · 5 阶段流水线</div>
          </div>
          <div class="ac-arrow">›</div>
        </a>
        <a class="agent-card-list meet" data-action="open-agent" data-agent="agent-meeting">
          <div class="ac-avatar">议</div>
          <div class="ac-body">
            <div class="ac-name">会议助手 <span class="kicker-tag green" style="font-size:9px;padding:1px 5px;">会议</span></div>
            <div class="ac-desc">会议纪要 · 文档总结</div>
          </div>
          <div class="ac-arrow">›</div>
        </a>
        </div>
        <div class="contact-section-title compact">
          <span>GROUPS</span>
          <em>联系人分类</em>
        </div>
        <div class="cat-bar">
          <div class="cat-btn"><div class="cat-icon">新</div><span class="cat-name">新朋友</span><span class="cat-count">3</span></div>
          <div class="cat-btn"><div class="cat-icon" style="background:var(--umakex-purple);">私</div><span class="cat-name">私聊</span><span class="cat-count">12</span></div>
          <div class="cat-btn"><div class="cat-icon" style="background:var(--umakex-green);">群</div><span class="cat-name">群聊</span><span class="cat-count">5</span></div>
          <div class="cat-btn"><div class="cat-icon" style="background:#6b7280;">黑</div><span class="cat-name">黑名单</span><span class="cat-count">0</span></div>
        </div>
        <div class="contact-section-title compact people-title">
          <span>PEOPLE</span>
          <em>${users.length} 位联系人</em>
        </div>
        ${users.map(c => renderContactItem(c)).join('')}
      </div>
    `;
  },

  /* ============ 会议列表 ============ */
  'meeting-list': () => {
    return `
      <div class="phone-view" data-view="meeting-list">
        <div class="meeting-action-panel">
          <div class="meeting-primary-action">
            <span>＋</span>
            <div><strong>预定会议</strong><em>创建会议 · 邀请成员 · 自动提醒</em></div>
          </div>
          <div class="meeting-join-action">
            <span>#</span>
            <div><strong>加入会议</strong><em>输入会议号 / 链接</em></div>
          </div>
        </div>
        <div class="meeting-ai-strip">
          <span>AI MEETING</span>
          <strong>会议助手已开启</strong>
          <em>录音转写 · 自动纪要 · 行动项追踪</em>
        </div>
        ${MEETINGS.map(m => {
          const statusTag = m.status === 'soon'
            ? '<span class="meeting-tag soon">即将开始</span>'
            : m.status === 'ended'
              ? '<span class="meeting-tag ended">已结束</span>'
              : '<span class="meeting-tag scheduled">待开始</span>';
          const summaryTag = m.hasSummary
            ? '<span class="meeting-tag summary">纪要已生成</span>'
            : '';
          return `
            <a class="meeting-card ${m.status}" data-action="open-meeting" data-mid="${m.id}">
              <div class="meeting-title">${m.title} ${statusTag} ${summaryTag}</div>
              <div class="meeting-time">${m.startTime} → ${m.endTime}</div>
              <div class="meeting-meta">
                <span>👥 ${m.attendees} 人</span>
                <span>·</span>
                <span>${m.organizer}</span>
              </div>
            </a>
          `;
        }).join('')}
      </div>
    `;
  },

  /* ============ 会议详情 ============ */
  'meeting-detail': (mid) => {
    const m = MEETINGS.find(x => x.id === mid) || MEETINGS[0];
    return `
      <div class="phone-view" data-view="meeting-detail">
        <div class="meeting-detail-banner">
          <h1>${m.title}</h1>
          <div class="meta">${m.startTime} → ${m.endTime} · ${m.duration} 分钟</div>
        </div>
        <div class="detail-section">
          <h3>会议信息</h3>
          <div style="font-size:13px;line-height:1.8;color:var(--ink);">
            <div>📅 日期：${m.startTime.split(' ')[0]}</div>
            <div>⏰ 时间：${m.startTime.split(' ')[1]} - ${m.endTime.split(' ')[1]}</div>
            <div>📍 地点：腾讯会议（线上）</div>
            <div>🆔 会议号：725-388-2941</div>
            <div>📌 主办：${m.organizer}</div>
          </div>
        </div>
        <div class="detail-section">
          <h3>参与人员 · ${m.attendees}</h3>
          <div class="attendee-list">
            ${m.attendeeList.map(a => `<span class="attendee-chip">${a}</span>`).join('')}
          </div>
        </div>
        <div class="detail-section">
          <h3>会议议程</h3>
          <ul class="agenda-list">
            ${m.agenda.map(a => `<li>${a}</li>`).join('')}
          </ul>
        </div>
        <div class="detail-section">
          <h3>会议纪要</h3>
          <div style="text-align:center;padding:24px 0;color:var(--ink-2);font-size:13px;">
            <div style="font-size:32px;margin-bottom:8px;">🤖</div>
            <div>会议结束后，AI 会议助手将自动生成纪要</div>
            <div style="margin-top:4px;font-family:var(--font-mono);font-size:10px;letter-spacing:0.05em;">AUTO-SUMMARY · ${m.endTime}</div>
          </div>
        </div>
        <div class="meeting-detail-action">
          ${m.status === 'soon' ? `<div class="btn btn-record">🔴 开始录制</div><div class="btn btn-join">进入会议</div>` :
            m.status === 'scheduled' ? `<div class="btn btn-disabled">未到时间</div><div class="btn btn-join">进入会议</div>` :
            `<div class="btn btn-disabled">会议已结束</div><div class="btn btn-join" data-action="open-meeting-summary" data-mid="${m.id}">查看纪要</div>`}
        </div>
        <div style="height: 80px;"></div>
      </div>
    `;
  },

  /* ============ 我的 ============ */
  'profile': () => {
    const d = PROFILE_DATA;
    return `
      <div class="phone-view" data-view="profile">
        <div class="profile-header">
          <div class="profile-avatar">${d.avatar}</div>
          <div class="profile-info">
            <div class="profile-name">${d.name}</div>
            <div class="profile-account">${d.account} · ${d.dept}</div>
            <div class="profile-meta">
              <span class="profile-tag">${d.memberLevel}</span>
              <span class="profile-points">${d.points.toLocaleString()} 积分</span>
            </div>
          </div>
        </div>
        <div class="profile-actions">
          <div class="action-btn">📱 二维码名片</div>
          <div class="action-btn">✏️ 编辑资料</div>
        </div>
        <div class="profile-section">
          <div class="profile-section-title">基础服务</div>
          <div class="menu-grid">
            <div class="menu-item"><div class="menu-icon">📦</div><div class="menu-name">订单</div><div class="menu-count">3</div></div>
            <div class="menu-item"><div class="menu-icon">🎫</div><div class="menu-name">卡券</div><div class="menu-count">5</div></div>
            <div class="menu-item"><div class="menu-icon">📁</div><div class="menu-name">收藏</div></div>
            <div class="menu-item"><div class="menu-icon">📜</div><div class="menu-name">历史</div></div>
          </div>
        </div>
        <div class="profile-section">
          <div class="profile-section-title">应用中心</div>
          <div class="app-grid">
            <div class="app-item" data-action="open-agent-center"><div class="app-icon red">🤖</div><div class="app-name">AI Agent 中心</div><div class="app-new">NEW</div></div>
            <div class="app-item"><div class="app-icon purple">🏢</div><div class="app-name">我的企业</div></div>
            <div class="app-item"><div class="app-icon amber">👑</div><div class="app-name">会员中心</div></div>
            <div class="app-item"><div class="app-icon green">📊</div><div class="app-name">数据中心</div></div>
            <div class="app-item"><div class="app-icon">🎨</div><div class="app-name">模板</div></div>
            <div class="app-item"><div class="app-icon gray">⚙️</div><div class="app-name">设置</div></div>
          </div>
        </div>
        <div style="height: 60px;"></div>
      </div>
    `;
  },


  /* ============ AI Agent 中心：6 Agent 库 + 已开通区（方案 C）============ */
  'agent-center': () => {
    // 新版：AI 智能对话营销 IM，只保留 3 个核心 Agent
    const AGENTS = [
      { id:'sales', name:'AI 销售助手', icon:'销', color:'#c8102e', colorSoft:'#fee2e2', en:'AI SALES · PRE-SALE CONVERSION', desc:'根据新人资料、商品库、佣金规则、客户标签和营销策略，主动沟通、识别意向、推荐商品并推动下单成交。', kicker:'P0 · 售前转化', stat:'6 配置', lead:'新人沟通 / 商品推荐 / 报价促单', module:'新人资料模板 / 商品库 / 营销思路' },
      { id:'cust',  name:'AI 客服助手', icon:'客', color:'#17110d', colorSoft:'#f4efe8', en:'AI SERVICE · AFTER-SALE CARE', desc:'负责 FAQ 题库、智能回答、售后接待、情绪安抚、复购引导，并把客服聊天数据沉淀给销售助手分析。', kicker:'P0 · 售后服务', stat:'6 配置', lead:'FAQ 应答 / 情绪安抚 / 复购引导', module:'FAQ 题库 / 售后规则 / 转人工' },
      { id:'meet',  name:'AI 会议助手', icon:'议', color:'#10b981', colorSoft:'#d1fae5', en:'AI MEETING · RECORD & SUMMARY', desc:'会议录音、录音转文字、会议总结、会议纪要、会议待办和意图分析，参考会议总结专家能力。', kicker:'P1 · 会议总结', stat:'6 配置', lead:'录音转写 / 会议纪要 / 待办分析', module:'会议录音 / 总结 / 意图分析' },
    ];

    const state = (() => { try { return JSON.parse(localStorage.getItem('umakex_agent_state') || '{}'); } catch(e){ return {}; } })();
    const onCount = AGENTS.filter(a => state[a.id]).length;
    const core = AGENTS[0];
    const opened = AGENTS.filter(a => state[a.id]);

    const openRail = opened.length
      ? opened.map((a, i) => `
        <div class="ac-open-row" data-action="open" data-target="agent-config:${a.id}">
          <span>${String(i + 1).padStart(2, '0')}</span>
          <strong>${a.name}</strong>
          <em>${a.en}</em>
        </div>`).join('')
      : `<div class="ac-open-empty"><strong>还没有开通 Agent</strong><span>建议先开通「AI 销售助手」，再补充客服和会议能力。</span></div>`;

    const libraryRows = AGENTS.map((a, i) => {
      const on = !!state[a.id];
      const isCore = a.id === 'sales';
      return `
        <div class="ac-library-row ${isCore ? 'is-core' : ''} ${on ? 'is-on' : ''}" data-action="${on ? 'open' : ''}" data-target="${on ? `agent-config:${a.id}` : ''}" style="--agent-color:${a.color};--agent-soft:${a.colorSoft};">
          <div class="ac-library-no">${String(i + 1).padStart(2, '0')}</div>
          <div class="ac-library-mark">${a.icon}</div>
          <div class="ac-library-copy">
            <span>${a.kicker}</span>
            <strong>${a.name}</strong>
            <p>${a.desc}</p>
          </div>
          <div class="ac-library-meta">
            <em>${a.stat}</em>
            <button class="ac-library-btn ${on ? 'on' : 'off'}" onclick="event.stopPropagation(); window.__toggleAgent('${a.id}')">${on ? '已开通' : '开通'}</button>
          </div>
        </div>`;
    }).join('');

    const sceneRows = AGENTS.map(a => `
      <div class="ac-scene-row" style="--agent-color:${a.color};">
        <span>${a.icon}</span>
        <div><strong>${a.lead}</strong><em>${a.module}</em></div>
      </div>`).join('');

    return `
      <div class="phone-view ac-editorial ac-v3" data-view="agent-center" id="phoneAgentCenter">
        <section class="ac-mag-hero">
          <div class="ac-mag-kicker">AGENT CENTER · 3 AGENTS</div>
          <div class="ac-mag-titleline">
            <h2>AI 智能<br>对话营销</h2>
            <div class="ac-mag-number">03</div>
          </div>
          <p>Agent Center 作为底部一级入口，只保留销售、客服、会议三个 AI Agent。它不是泛工具库，而是私域 IM 里的对话营销工作台。</p>
          <div class="ac-mag-stats">
            <span><strong>${onCount}</strong><em>已开通</em></span>
            <span><strong>3</strong><em>核心 Agent</em></span>
            <span><strong>5</strong><em>底部入口</em></span>
          </div>
        </section>

        <section class="ac-core-card ${state.sales ? 'is-on' : ''}" style="--agent-color:${core.color};--agent-soft:${core.colorSoft};" ${state.sales ? 'data-action="open" data-target="agent-config:sales"' : ''}>
          <div class="ac-core-index">P0</div>
          <div class="ac-core-main">
            <span>${core.en}</span>
            <strong>${core.name}</strong>
            <p>${core.desc}</p>
          </div>
          <button class="ac-core-btn" ${state.sales ? 'data-action="open" data-target="agent-config:sales"' : ''} onclick="event.stopPropagation(); ${state.sales ? "viewStack.push('agent-config:sales'); renderCurrentView();" : "window.__toggleAgent('sales')"}">${state.sales ? '已开通 · 进入配置' : '开通销售助手'}</button>
        </section>

        <section class="ac-section ac-scene-section">
          <div class="ac-section-label"><span>三大能力</span><em>SALES · SERVICE · MEETING</em></div>
          <div class="ac-scene-grid">${sceneRows}</div>
        </section>

        <section class="ac-section ac-open-section">
          <div class="ac-section-label"><span>已开通</span><em>${onCount} 个</em></div>
          <div class="ac-open-rail">${openRail}</div>
        </section>

        <section class="ac-section ac-library-section">
          <div class="ac-section-label"><span>Agent 库</span><em>只保留 3 个核心角色</em></div>
          <div class="ac-library-list">${libraryRows}</div>
        </section>

        <div class="sub-safe-space"></div>
      </div>
    `;
  },

  /* ============ AI Agent 配置中心：Hero + 各 Agent 专属子配置 + chat 测试区 ============ */
  'agent-config': (agentId) => {
    // 6 Agent 完整数据（kicker/title/en/desc/caps/quick/greet）
    const AG = {
      grow: {
        kicker:'P0 · AI SALES', title:'AI 销售助手', en:'AI SALES · PRE-SALE CONVERSION',
        desc:'旧客户增长入口兼容到 AI 销售助手。新版销售助手负责新人自动沟通、商品推荐、佣金规则、客户标签、报价促单和跟进节奏。',
        caps:['新人资料','商品推荐','佣金规则','客户标签','报价促单','跟进节奏'],
      },
      sales: {
        kicker:'P0 · AI SALES', title:'AI 销售助手', en:'AI SALES · PRE-SALE CONVERSION',
        desc:'售前营销转化 Agent。读取新人背景、匹配商品与佣金、选择营销打法、结合客户标签，自动安排跟进节奏并推动下单成交。',
        caps:['读新人','配商品','算佣金','定打法','打标签','排跟进'],
      },
      cust: {
        kicker:'P0 · AI SERVICE', title:'AI 客服助手', en:'AI SERVICE · AFTER-SALE CARE',
        desc:'售后服务与客户关系维护 Agent。负责 FAQ 题库、售后规则、智能回答、情绪安抚、复购引导和转人工规则。',
        caps:['FAQ 题库','售后规则','智能回答','情绪安抚','复购引导','转人工'],
      },
      meet: {
        kicker:'P1 · MEETING TRANSCRIBER', title:'会议助手·小议', en:'AI MEETING · VOICE TO SUMMARY',
        desc:'会议录音 → 文字转写 → 自动纪要 → 行动项跟踪。说话人识别、关键信息抽取、待办沉淀。30 分钟会议 30 秒看完。',
        caps:['ASR 转写','说话人分离','关键决策','待办提取','中/英双语'],
      },
      img: {
        kicker:'P1 · IMAGE GENERATOR', title:'AI 生图·小艺', en:'AI IMAGE · TEXT TO PICTURE',
        desc:'文字转图片 AI，写实/插画/漫画/水彩风格一键切换。一句话生成朋友圈素材、产品图、营销海报，让没设计团队的老板也能日更。',
        caps:['4 种风格','9 种尺寸','批量生成','参考图','文字叠加'],
      },
      write: {
        kicker:'P1 · COPY WRITER', title:'AI 写作·小笔', en:'AI WRITER · COPY & CONTENT',
        desc:'智能文案创作 AI，覆盖种草/详情页/活动海报/周报/公众号/小红书等场景。基于品牌调性库，一键产出可发布的文案。',
        caps:['种草文案','详情页','活动海报','周报摘要','多平台适配'],
      },
      audio: {
        kicker:'P1 · VOICE TO TEXT', title:'AI 录音·小记', en:'AI AUDIO · VOICE TO SUMMARY',
        desc:'录音一键转摘要。会议/访谈/课程/销售跟进全场景。自动提取人名、关键数字、待办事项，30 分钟录音 30 秒看完。',
        caps:['会议纪要','访谈精华','课程总结','销售跟进','关键词提取'],
      },
    };

    // 各 Agent 专属子配置（cust=6个通用管理卡，其他各自专属）
    const SUB_CONFIGS = {
      grow: [ // 客户增长 → 客服 + 销冠合并后的 13 个模块
        ['📚', '客服知识库', '客服知识库配置', 'FAQ / 售后规则 / 自动回复', 'agent-kb'],
        ['🧾', '客户背景', '客户背景资料库', '身份 / 需求 / 偏好 / 禁忌', 'agent-customer-bg'],
        ['🏷', '客户标签', '客户标签', '高意向 / 售后 / 黑名单', 'agent-tags'],
        ['🛒', '商品库', '商品库配置', '商品 / 价格 / 卖点说明', 'agent-products'],
        ['👤', '人设风格', '人设配置', '语气 / 边界 / 禁用词', 'agent-persona'],
        ['📦', '产品知识', '产品知识库', 'SKU / 功能 / 卖点', 'sales-products'],
        ['⚔️', '竞品对比', '竞品对比库', 'vs 同行 / 差异化话术', 'sales-competitors'],
        ['💬', '销售话术', '销售话术库', '开场 / 挖需 / 促单', 'sales-scripts'],
        ['🎯', '跟进策略', '客户跟进策略', '首次联系 / 复购提醒', 'sales-followup'],
        ['📊', '增长看板', '数据看板', '咨询 / 订单 / 转化率', 'agent-analytics'],
        ['📈', '转化漏斗', '转化漏斗配置', '线索→成交各阶段', 'sales-funnel'],
        ['🔄', '报价模板', '报价模板库', '标准报价 / 折扣规则', 'sales-quote'],
        ['📋', '工作日志', '工作日志', 'Agent 操作记录', 'agent-logs'],
      ],
      sales: [
        ['🧾', '新人资料模板', '新人资料模板', '身份 / 性格 / 收入 / 家庭 / 需求', 'sales-profile-template'],
        ['🛒', '我的商品库', '我的商品库', '已选商品 / 卖点 / 价格 / 佣金', 'sales-products'],
        ['🏪', '平台商品库', '平台商品库', '平台统一商品 / 等级佣金 / 一键加入', 'sales-platform-products'],
        ['💡', '营销思路', '营销思路配置', '信任 / 共鸣 / 专家 / 成交打法', 'sales-scripts'],
        ['🏷', '标签策略', '客户标签策略', '意向 / 消费 / 关系 / 性格 / 场景', 'agent-tags'],
        ['🎯', '跟进节奏', '跟进节奏配置', '首聊 / 培育 / 促单 / 复访', 'sales-followup'],
      ],
      cust: [
        ['📚', 'FAQ 题库', 'FAQ 题库', '常见问题 / 标准答案 / 命中率', 'cust-faq'],
        ['📦', '售后规则', '售后规则', '退款 / 物流 / 发票 / 赔付', 'cust-after-sale-rules'],
        ['💬', '智能回答', '智能回答配置', '回答策略 / 引用规则 / 禁用词', 'cust-smart-reply'],
        ['🫶', '情绪安抚', '情绪安抚策略', '负面情绪 / 升级处理', 'cust-emotion-care'],
        ['🔁', '复购引导', '复购引导策略', '售后满意 / 二次推荐', 'cust-repurchase'],
        ['👤', '转人工规则', '转人工规则', '高风险 / 投诉 / 复杂问题', 'cust-human-handoff'],
      ],
      meet: [ // 会议 → 专项配置
        ['🎙️', '录音设置', '录音识别配置', 'ASR / 语言 / 降噪', 'meet-recording'],
        ['👥', '发言分离', '说话人分离', '角色标注 / 自动编号', 'meet-speakers'],
        ['📝', '纪要模板', '纪要模板', '章节 / 要点 / 行动项格式', 'meet-template'],
        ['✅', '行动项', '行动项设置', '指派 / 截止 / 提醒', 'meet-todo'],
        ['📅', '日程同步', '日程同步', '日历 / 会议邀请', 'meet-calendar'],
        ['🌐', '双语翻译', '翻译设置', '中/英双语输出', 'meet-translate'],
      ],
      img: [ // 生图 → 专项配置
        ['🎨', '风格预设', '风格预设库', '写实/插画/漫画/水彩', 'img-styles'],
        ['📐', '尺寸设置', '尺寸模板', '9 种常用尺寸', 'img-sizes'],
        ['🖼️', '参考图库', '参考图库', '上传风格参考', 'img-refs'],
        ['🔤', '文字叠加', '文字叠加设置', '字体 / 位置 / 颜色', 'img-text'],
        ['📦', '批量生成', '批量任务', '一次生成多张', 'img-batch'],
        ['🔍', '高清重绘', '高清重绘设置', '2K/4K 输出', 'img-hd'],
      ],
      write: [ // 写作 → 专项配置
        ['✍️', '文案模板', '文案模板库', '种草/详情/周报/海报', 'write-templates'],
        ['🎨', '品牌调性', '品牌调性库', '语气 / 用词 / 调色', 'write-tone'],
        ['📱', '多平台适配', '平台模板', '朋友圈/小红书/公众号', 'write-platforms'],
        ['🚫', '敏感词过滤', '敏感词库', '违禁词过滤', 'write-filter'],
        ['📦', '批量创作', '批量任务', '一次生成多篇', 'write-batch'],
        ['🔄', '改写润色', '改写模式', '语气升级 / 长度调整', 'write-rewrite'],
      ],
      audio: [ // 录音 → 专项配置
        ['🎙️', '转写设置', '转写引擎配置', '语言 / 标点 / 分段', 'audio-transcribe'],
        ['👥', '发言人识别', '说话人管理', '姓名标注 / 角色分离', 'audio-speakers'],
        ['📝', '摘要模板', '摘要格式', '关键决策 / 待办提取', 'audio-summary'],
        ['🔑', '关键词提取', '关键词词库', '行业关键词', 'audio-keywords'],
        ['📋', '日志管理', '操作日志', '转写记录', 'audio-logs'],
        ['🔄', '导出设置', '导出格式', 'TXT / MD / PDF', 'audio-export'],
      ],
    };

    // 拿 agent + 配置
    const agentFullId = (typeof AG_ID_MAP !== 'undefined' && AG_ID_MAP[agentId]) || agentId;
    const agent = getContact(agentFullId);
    if (!agent) return VIEWS['agent-center']();
    const cfg = AG[agentId] || AG.grow;
    const subConfigs = (SUB_CONFIGS[agentId] && SUB_CONFIGS[agentId].length ? SUB_CONFIGS[agentId] : SUB_CONFIGS.grow);
    const AGENT_VISUAL = {
      grow:  { color:'#c8102e', soft:'#fee2e2', avatar:'销' },
      sales: { color:'#c8102e', soft:'#fee2e2', avatar:'销' },
      cust:  { color:'#17110d', soft:'#f4efe8', avatar:'客' },
      meet:  { color:'#10b981', soft:'#d1fae5', avatar:'议' },
      img:   { color:'#8b5cf6', soft:'#f3e8ff', avatar:'艺' },
      write: { color:'#ef4444', soft:'#fee2e2', avatar:'笔' },
      audio: { color:'#06b6d4', soft:'#cffafe', avatar:'记' },
    };
    const visual = AGENT_VISUAL[agentId] || AGENT_VISUAL.cust;

    const capHTML = cfg.caps.map(t => `<span class="acc-cap">${t}</span>`).join('');

    return `
      <div class="phone-view agent-subpage" data-view="agent-config" data-agent="${agentId}">
        <!-- Hero：Agent 介绍卡 -->
        <div class="acc-hero" style="border-left:3px solid ${visual.color}">
          <div class="acc-hero-top">
            <div class="acc-hero-icon" style="background:${visual.color}">${visual.avatar}</div>
            <div class="acc-hero-id">
              <span class="kicker-tag" style="background:${visual.soft};color:${visual.color}">${cfg.kicker}</span>
              <h2 class="acc-hero-title">${cfg.title}</h2>
              <div class="acc-hero-en">${cfg.en}</div>
            </div>
          </div>
          <p class="acc-hero-desc">${cfg.desc}</p>
          <div class="acc-caps">
            <h4>核心能力</h4>
            <div>${capHTML}</div>
          </div>
        </div>

        <!-- 子配置卡片（各 Agent 专属） -->
        <div class="acc-section">
          <div class="acc-section-label">
            <span>${agentId === 'cust' ? '管理模块' : '功能配置'}</span>
            <em>CONFIG · ${subConfigs.length} 项</em>
          </div>
          <div class="acc-config-grid acc-config-editorial">
            ${subConfigs.map((c, idx) => `
              <div class="acc-config-card ${idx === 0 ? 'is-primary' : ''}" data-action="open" data-target="${c[4]}">
                <div class="acc-config-index">${String(idx + 1).padStart(2, '0')}</div>
                <div class="acc-config-icon">${c[0]}</div>
                <div class="acc-config-copy">
                  <strong>${c[1]}</strong>
                  <span>${c[2]}</span>
                  <em>${c[3]}</em>
                </div>
                <b>${idx === 0 ? '进入主配置 ›' : '打开 ›'}</b>
              </div>
            `).join('')}
          </div>
        </div>

        <div style="height: 60px;"></div>
      </div>
    `;
  },

  /* ============ AI Agent 中心：实时工作流二级页 ============ */
  'agent-workflows': () => {
    const stats = [
      ['23', '今日动作'],
      ['1.8s', '平均响应'],
      ['97%', '规则命中']
    ];
    return `
      <div class="phone-view agent-subpage workflow-page" data-view="agent-workflows">
        <div class="workflow-hero">
          <span>LIVE WORKFLOW</span>
          <strong>实时工作流</strong>
          <em>AI 销冠每一次判断、回复、推荐、转人工都可追踪</em>
        </div>
        <div class="workflow-stat-strip">
          ${stats.map(s => `<div><strong>${s[0]}</strong><span>${s[1]}</span></div>`).join('')}
        </div>
        <div class="workflow-filter"><button class="active">全部</button><button>自动回复</button><button>推荐</button><button>转人工</button></div>
        <div class="sub-section-title"><span>正在运行</span><em>${WORKFLOW_ITEMS.length} 条记录</em></div>
        <div class="workflow-full-list">
          ${WORKFLOW_ITEMS.map(x => `
            <div class="workflow-full-row" data-action="open" data-target="agent-workflow-detail:${x.id}">
              <div class="workflow-row-head">
                <b>${x.icon}</b>
                <div><strong>${x.title}</strong><span>${x.time} · ${x.type} · ${x.customer}</span></div>
                <em>${x.status}</em>
              </div>
              <p>${x.action}</p>
              <i>查看详情 ›</i>
            </div>
          `).join('')}
        </div>
        <div class="sub-safe-space"></div>
      </div>
    `;
  },

  /* ============ AI Agent 中心：实时工作流详情子页 ============ */
  'agent-workflow-detail': (workflowId) => {
    const item = WORKFLOW_ITEMS.find(x => x.id === workflowId) || WORKFLOW_ITEMS[0];
    return `
      <div class="phone-view agent-subpage workflow-detail-page" data-view="agent-workflow-detail">
        <div class="workflow-detail-hero">
          <div class="workflow-detail-icon">${item.icon}</div>
          <div><span>${item.time} · ${item.type}</span><strong>${item.title}</strong><em>${item.status} · 置信度 ${item.confidence}</em></div>
        </div>
        <div class="workflow-detail-grid">
          <div><span>客户</span><strong>${item.customer}</strong></div>
          <div><span>下一步</span><strong>${item.next}</strong></div>
        </div>
        <div class="workflow-card">
          <div class="workflow-card-title"><span>触发原因</span><em>TRIGGER</em></div>
          <p>${item.trigger}</p>
        </div>
        <div class="workflow-card">
          <div class="workflow-card-title"><span>AI 判断</span><em>INTENT</em></div>
          <p>${item.intent}</p>
        </div>
        <div class="workflow-card action-card">
          <div class="workflow-card-title"><span>执行动作</span><em>ACTION</em></div>
          <p>${item.action}</p>
        </div>
        <div class="workflow-reply-box">
          <span>AI 已发送话术</span>
          <p>${item.reply}</p>
        </div>
        <div class="sub-section-title"><span>执行链路</span><em>5 步</em></div>
        <div class="workflow-stepper">
          ${item.steps.map((s, i) => `<div><b>${i + 1}</b><span>${s}</span></div>`).join('')}
        </div>
        <div class="workflow-detail-actions">
          <button data-action="open" data-target="agent-logs">看日志</button>
          <button data-action="open" data-target="agent-analytics">看数据</button>
        </div>
        <div class="sub-safe-space"></div>
      </div>
    `;
  },


  /* ============ 配置子页：知识库 ============ */
  'agent-kb': () => {
    const qa = [
      ['VIC 套餐怎么卖？', '按月 / 年费两档报价，优先引导客户确认使用人数和预算。', '已启用'],
      ['怎么退款？', '先索取订单号，判断支付渠道，再告知 3-5 个工作日到账。', '已启用'],
      ['对公转账信息', '发送公司账户、开户行、备注规则，并提示财务确认时间。', '已启用'],
      ['会员权益差异', '对比普通 / VIC / 企业版权益，推荐高频用户升级。', '待优化']
    ];
    return `
      <div class="phone-view agent-subpage" data-view="agent-kb">
        <div class="sub-hero kb">
          <span>KNOWLEDGE BASE</span>
          <strong>AI 销冠知识库</strong>
          <em>12 个问答 · 4 条销售话术 · 3 条售后规则</em>
        </div>
        <div class="sub-toolbar">
          <button>＋ 添加问答</button><button>导入文档</button><button>训练一次</button>
        </div>
        <div class="add-panel kb-add-panel">
          <div class="add-panel-head"><strong>添加题库</strong><span>新增后立即进入本页题库列表</span></div>
          <input id="kbQuestion" placeholder="问题：客户会怎么问？例如：企业版多少钱">
          <textarea id="kbAnswer" placeholder="标准回答：AI 销冠应该怎么回复"></textarea>
          <input id="kbGroup" placeholder="分类：销售题库 / 售后题库 / 付款题库">
          <button data-action="add-kb-item">保存到题库</button>
        </div>
        <div class="sub-section-title"><span>高频问答</span><em>命中率 86%</em></div>
        <div class="kb-list">
          ${qa.map((x, i) => `
            <div class="kb-row" data-kb-row>
              <div class="kb-no">Q${i + 1}</div>
              <div class="kb-main"><strong>${x[0]}</strong><p>${x[1]}</p></div>
              <div class="kb-side">
                <i>${x[2]}</i>
                <div class="kb-actions">
                  <button data-action="edit-kb-item">编辑</button>
                  <button class="danger" data-action="delete-kb-item">删除</button>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
        <div class="sub-section-title"><span>话术边界</span><em>不可越权承诺</em></div>
        <div class="rule-sheet">
          <div><strong>禁止承诺</strong><span>不得承诺 100% 成交 / 立即到账 / 保本收益</span></div>
          <div><strong>转人工条件</strong><span>投诉、退款争议、合同条款、价格特批</span></div>
        </div>
        <div class="sub-safe-space"></div>
      </div>
    `;
  },

  /* ============ 配置子页：商品库 ============ */
  'agent-products': () => {
    const products = [
      ['VIC 月卡', '¥199/月', '适合单人高频沟通', '热卖'],
      ['VIC 年卡', '¥1688/年', '比月卡节省 29%，适合长期客户', '推荐'],
      ['企业版 10 席', '¥3999/年', '团队管理、数据看板、专属客服', '高客单'],
      ['销售自动化包', '¥699/月', 'AI 销冠 + 商品卡 + 线索标签', '加购']
    ];
    return `
      <div class="phone-view agent-subpage" data-view="agent-products">
        <div class="sub-hero product">
          <span>PRODUCT LIBRARY</span>
          <strong>商品库</strong>
          <em>6 件商品 · 价格 / 卖点 / 库存说明同步给 AI</em>
        </div>
        <div class="sub-toolbar"><button>＋ 新增商品</button><button>批量调价</button><button>同步库存</button></div>
        <div class="add-panel product-add-panel">
          <div class="add-panel-head"><strong>新增出售商品</strong><span>商品卡会进入 AI 销冠推荐范围</span></div>
          <input id="productName" placeholder="商品名：例如 企业版 20 席">
          <div class="form-two"><input id="productPrice" placeholder="价格：¥5999/年"><input id="productTag" placeholder="标签：推荐"></div>
          <textarea id="productDesc" placeholder="卖点：适合什么客户、解决什么问题"></textarea>
          <button data-action="add-product-item">保存商品</button>
        </div>
        <div class="sub-section-title strategy-title"><span>AI 推荐策略</span><em>按客户意向自动排序</em></div>
        <div class="add-panel strategy-add-panel compact-add">
          <div class="add-panel-head"><strong>添加 AI 策略</strong><span>定义触发条件和推荐动作</span></div>
          <input id="strategyName" placeholder="策略名：例如 复购客户优先推年卡">
          <textarea id="strategyCondition" placeholder="触发条件：客户已成交过 / 30 天内再次询价 / 点击商品卡"></textarea>
          <button data-action="add-strategy-item">保存策略</button>
        </div>
        <div class="strategy-ladder">
          <div data-strategy-row><b>1</b><strong>问预算</strong><span>未明确需求先确认人数 / 使用频率</span><button class="mini-delete" data-action="delete-strategy-item">删除</button></div>
          <div data-strategy-row><b>2</b><strong>推套餐</strong><span>高频用户优先推荐年卡或企业版</span><button class="mini-delete" data-action="delete-strategy-item">删除</button></div>
          <div data-strategy-row><b>3</b><strong>给优惠</strong><span>犹豫客户发送限时券和对比表</span><button class="mini-delete" data-action="delete-strategy-item">删除</button></div>
        </div>
        <div class="sub-section-title product-list-title"><span>商品卡片</span><em>6 件商品同步给 AI</em></div>
        <div class="product-config-list">
          ${products.map(x => `
            <div class="product-config-card" data-product-row>
              <div><strong>${x[0]}</strong><span>${x[2]}</span></div>
              <em>${x[1]}</em>
              <i>${x[3]}</i>
              <button class="mini-delete" data-action="delete-product-item">删除</button>
            </div>
          `).join('')}
        </div>
        <div class="sub-safe-space"></div>
      </div>
    `;
  },

  /* ============ 配置子页：人设风格 ============ */
  'agent-persona': () => {
    const tones = [['专业型', 'active'], ['亲和型', ''], ['强转化', ''], ['谨慎合规', '']];
    return `
      <div class="phone-view agent-subpage" data-view="agent-persona">
        <div class="sub-hero persona">
          <span>PERSONA</span>
          <strong>人设风格</strong>
          <em>配置 AI 销冠说话方式、销售边界和禁用词</em>
        </div>
        <div class="persona-card">
          <div class="persona-avatar">销</div>
          <div><strong>小销 · 专业顾问型</strong><span>短句、明确、先问需求再推荐商品</span></div>
        </div>
        <div class="sub-section-title"><span>语气模板</span><em>当前：专业型</em></div>
        <div class="tone-grid">
          ${tones.map(t => `<button class="${t[1]}">${t[0]}</button>`).join('')}
        </div>
        <div class="sub-section-title"><span>回复规则</span><em>6 条启用</em></div>
        <div class="persona-rules">
          <label><span>先确认客户需求，再推荐套餐</span><input type="checkbox" checked></label>
          <label><span>价格问题必须给清晰金额</span><input type="checkbox" checked></label>
          <label><span>售后争议自动转人工</span><input type="checkbox" checked></label>
          <label><span>避免夸张承诺和虚假稀缺</span><input type="checkbox" checked></label>
        </div>
        <div class="forbidden-words"><strong>禁用词</strong><span>稳赚 · 绝对 · 马上到账 · 官方保证 · 内部价</span></div>
        <div class="sub-safe-space"></div>
      </div>
    `;
  },

  /* ============ 配置子页：数据看板 ============ */
  'agent-analytics': () => {
    const pillars = [['对话', 128, 112, '+18%'], ['留资', 34, 76, '+9%'], ['报价', 18, 54, '+6%'], ['订单', 6, 32, '+2%']];
    const hot = [
      ['王总', '高意向', '已查看企业版 4 次', '建议 15 分钟内跟进'],
      ['李女士', '复购机会', '询问对公转账', '建议发送年卡优惠'],
      ['夏日', '售后咨询', '退款问题未确认订单号', '建议转人工']
    ];
    return `
      <div class="phone-view agent-subpage analytics-page" data-view="agent-analytics">
        <div class="analytics-hero-v2">
          <div><span>DASHBOARD</span><strong>AI 销冠数据看板</strong><em>今日实时统计 · 自动回复效果追踪</em></div>
          <b>18%</b>
        </div>
        <div class="analytics-summary-card">
          <div><span>今日成交预估</span><strong>¥9,842</strong><em>来自 6 笔订单 / 18 次报价</em></div>
          <div class="summary-orbit"><i></i><i></i><i></i></div>
        </div>
        <div class="analytics-kpis upgraded">
          <div><strong>128</strong><span>今日对话</span><em>+24</em></div>
          <div><strong>1.8s</strong><span>平均回复</span><em>稳定</em></div>
          <div><strong>31%</strong><span>商品卡点击</span><em>+7%</em></div>
        </div>
        <div class="sub-section-title"><span>销售漏斗</span><em>竖立柱 · 非水平条</em></div>
        <div class="pillar-chart upgraded">
          ${pillars.map((x, i) => `<div class="pillar-${i}"><i style="height:${x[2]}px"></i><strong>${x[1]}</strong><span>${x[0]}</span><em>${x[3]}</em></div>`).join('')}
        </div>
        <div class="sub-section-title"><span>关键客户动态</span><em>AI 建议动作</em></div>
        <div class="hot-customer-list">
          ${hot.map(x => `
            <div class="hot-customer-row">
              <div><strong>${x[0]}</strong><span>${x[2]}</span></div>
              <em>${x[1]}</em>
              <p>${x[3]}</p>
            </div>
          `).join('')}
        </div>
        <div class="sub-section-title"><span>AI 表现</span><em>过去 24 小时</em></div>
        <div class="insight-list upgraded">
          <div><b>↗</b><strong>商品卡点击率提升</strong><span>VIC 年卡点击率 31%，建议继续置顶</span></div>
          <div><b>!</b><strong>退款咨询增加</strong><span>售后类问题 3 条，建议更新退款 FAQ</span></div>
          <div><b>✓</b><strong>回复速度稳定</strong><span>平均 1.8 秒完成草稿和回复</span></div>
        </div>
        <div class="sub-safe-space"></div>
      </div>
    `;
  },

  /* ============ 配置子页：工作日志 ============ */
  'agent-logs': () => {
    const logs = [
      ['14:32', '自动回复', '夏日提问产品怎么卖，命中 Q&A #3，已发送 VIC 月卡说明'],
      ['14:18', '商品推荐', '王总询问价格，AI 发送企业版商品卡并标记高意向'],
      ['13:55', '付款说明', '李女士要求对公账户，已发送转账信息并提醒备注订单号'],
      ['12:42', '转人工', '退款争议超出规则，已转交人工客服处理'],
      ['11:10', '标签更新', '将陈先生从普通客户升级为复购机会']
    ];
    return `
      <div class="phone-view agent-subpage" data-view="agent-logs">
        <div class="sub-hero logs">
          <span>WORK LOG</span>
          <strong>工作日志</strong>
          <em>记录 AI 销冠每一次自动回复、推荐和转人工</em>
        </div>
        <div class="log-filter"><button class="active">全部</button><button>自动回复</button><button>转人工</button><button>成交</button></div>
        <div class="timeline-list">
          ${logs.map(x => `
            <div class="timeline-row">
              <time>${x[0]}</time>
              <div><strong>${x[1]}</strong><span>${x[2]}</span></div>
            </div>
          `).join('')}
        </div>
        <div class="sub-safe-space"></div>
      </div>
    `;
  },


  /* ============ 配置子页：客户背景资料库 ============ */
  'agent-customer-bg': () => {
    const customers = [
      ['林小夏', '高意向', '企业版 / 多账号协作', '预算 1-2 万，关注交付速度', '正式但不要太硬，适合直接给方案'],
      ['陈先生', '价格敏感', 'VIC 套餐 / 折扣规则', '反复询价，担心后续费用', '先讲性价比，再给阶梯报价'],
      ['王总', '老客户', '复购 / 团队扩容', '已成交 2 次，正在考虑给团队采购', '少寒暄，直接给升级收益'],
    ];
    const blocks = [
      ['01', '基础背景', '身份、公司、行业、地区、语言', 'AI 用来决定称呼、语气和信息密度'],
      ['02', '业务需求', '关注产品、预算、痛点、购买阶段', 'AI 用来判断推荐什么、什么时候报价'],
      ['03', '沟通偏好', '正式/轻松、是否能催单、是否能电话', 'AI 用来控制回复力度和跟进节奏'],
      ['04', '禁忌边界', '不能提的价格、竞品、承诺和敏感话题', 'AI 用来避免踩雷和违规承诺'],
    ];
    return `
      <div class="phone-view agent-subpage customer-bg-page" data-view="agent-customer-bg">
        <div class="sub-hero customer-bg-hero">
          <span>CUSTOMER CONTEXT</span>
          <strong>客户背景资料库</strong>
          <em>每个好友一份背景档案，客户增长助手会据此回复、推荐和跟进</em>
        </div>

        <div class="customer-bg-intent">
          <div>
            <span>AI 读取方式</span>
            <strong>先读背景，再生成回复</strong>
            <p>当好友发消息时，Agent 会同时读取客户身份、历史需求、沟通偏好和禁忌边界，避免千人一面的回复。</p>
          </div>
          <b>CONTEXT<br>FIRST</b>
        </div>

        <div class="sub-toolbar bg-toolbar">
          <button>＋ 新增客户背景</button><button>从通讯录导入</button><button>批量更新</button>
        </div>

        <div class="sub-section-title"><span>客户档案</span><em>3 位样例好友</em></div>
        <div class="customer-bg-list">
          ${customers.map((c, i) => `
            <div class="customer-bg-row ${i === 0 ? 'active' : ''}">
              <div class="customer-bg-no">${String(i + 1).padStart(2, '0')}</div>
              <div class="customer-bg-main">
                <div><strong>${c[0]}</strong><em>${c[1]}</em></div>
                <p>${c[2]}</p>
                <span>${c[3]}</span>
              </div>
              <b>${c[4]}</b>
            </div>
          `).join('')}
        </div>

        <div class="sub-section-title"><span>背景字段</span><em>AI 可调用</em></div>
        <div class="customer-bg-field-grid">
          ${blocks.map(b => `
            <div class="customer-bg-field">
              <i>${b[0]}</i>
              <strong>${b[1]}</strong>
              <span>${b[2]}</span>
              <p>${b[3]}</p>
            </div>
          `).join('')}
        </div>

        <div class="customer-bg-editor">
          <div class="customer-bg-editor-head">
            <span>当前编辑</span>
            <strong>林小夏 · 企业版意向客户</strong>
          </div>
          <label>基础背景</label>
          <textarea readonly>杭州电商品牌负责人，团队 18 人，主要通过私域做复购和新品通知。</textarea>
          <label>业务需求</label>
          <textarea readonly>想把客服接待、商品推荐和朋友圈素材生成串起来；预算 1-2 万，关注上线速度。</textarea>
          <label>沟通策略</label>
          <textarea readonly>先给清晰方案，再给报价；可以直接推荐企业版，不要过度寒暄，不承诺绝对转化率。</textarea>
        </div>

        <div class="customer-bg-ai-note">
          <strong>AI 使用提示</strong>
          <p>下次林小夏咨询时，客户增长助手会优先引用「电商品牌 / 团队 18 人 / 企业版意向 / 不承诺转化率」这些背景资料，再生成回复。</p>
        </div>
        <div class="sub-safe-space"></div>
      </div>
    `;
  },


  /* ============ 客服助手：FAQ 题库 ============ */
  'cust-faq': () => {
    const faqs = [
      ['订单多久发货？', '付款后 24 小时内发货，预售品按商品页时间执行。', '物流咨询', '92%'],
      ['可以退款吗？', '未发货可申请退款；已发货按售后规则核验。', '退款售后', '88%'],
      ['赠品少发怎么办？', '先道歉并核验订单，确认后补发赠品或等值券。', '补发赔付', '81%'],
      ['发票怎么开？', '收集抬头、税号、邮箱，1 个工作日内开具。', '发票财务', '79%'],
    ];
    const blocks = [
      ['12', '已启用 FAQ', '覆盖订单、物流、退款、发票'],
      ['86%', '今日命中率', '低于 80% 的问题进入待优化'],
      ['7', '待补充问题', '来自最近 24 小时人工会话'],
    ];
    return `
      <div class="phone-view agent-subpage cust-config-page" data-view="cust-faq">
        <div class="cust-hero"><span>CUSTOMER SERVICE FAQ</span><strong>FAQ 题库</strong><em>客服助手先检索题库，再生成可发送回答；未命中进入待补充池。</em></div>
        <div class="cust-kpis">${blocks.map(b=>`<div><strong>${b[0]}</strong><span>${b[1]}</span><em>${b[2]}</em></div>`).join('')}</div>
        <div class="sub-toolbar cust-toolbar"><button>＋ 新增 FAQ</button><button>导入文档</button><button>训练题库</button></div>
        <div class="cust-section-title"><span>高频问题</span><em>FAQ · LIVE</em></div>
        <div class="cust-faq-list">
          ${faqs.map((f,i)=>`<div class="cust-faq-row"><b>Q${i+1}</b><div><strong>${f[0]}</strong><p>${f[1]}</p><span>${f[2]}</span></div><em>${f[3]}</em></div>`).join('')}
        </div>
        <div class="cust-ai-note"><strong>沉淀给销售助手</strong><span>客户反复追问的商品、价格、售后顾虑，会同步为销售助手的「客户顾虑标签」。</span></div>
        <div class="sub-safe-space"></div>
      </div>`;
  },

  /* ============ 客服助手：售后规则 ============ */
  'cust-after-sale-rules': () => {
    const rules = [
      ['退款', '未发货直接退款；已发货需核验签收状态', '涉及争议金额时转人工'],
      ['物流', '48 小时无物流更新先安抚，再查询快递异常', '连续 2 次异常升级工单'],
      ['发票', '收集抬头/税号/邮箱，不承诺立即开票', '对公特殊发票转财务'],
      ['补偿', '少发/错发优先补发，无法补发给等值券', '超过 ¥50 需人工确认'],
    ];
    return `
      <div class="phone-view agent-subpage cust-config-page" data-view="cust-after-sale-rules">
        <div class="cust-hero"><span>AFTER-SALE RULES</span><strong>售后规则</strong><em>把退款、物流、发票、赔付边界写清楚，避免 AI 乱承诺。</em></div>
        <div class="cust-case-strip"><div><strong>4</strong><span>规则类型</span></div><div><strong>18%</strong><span>人工介入率</span></div><div><strong>4.6</strong><span>满意度</span></div></div>
        <div class="cust-section-title"><span>规则矩阵</span><em>BOUNDARY · NO HBAR</em></div>
        <div class="cust-rule-matrix">
          ${rules.map((r,i)=>`<div><b>${String(i+1).padStart(2,'0')}</b><strong>${r[0]}</strong><span>${r[1]}</span><em>${r[2]}</em></div>`).join('')}
        </div>
        <div class="cust-ticket-card"><span>示例工单</span><strong>陈婉婷 · 赠品少发</strong><p>AI 先道歉 → 核验订单 → 承诺补发 → 记录复购券机会，不直接推销。</p></div>
        <div class="sub-safe-space"></div>
      </div>`;
  },

  /* ============ 客服助手：智能回答 ============ */
  'cust-smart-reply': () => {
    const modes = [
      ['准确优先', '必须引用 FAQ 或售后规则后再回答', 'active'],
      ['安抚优先', '客户情绪异常时先共情，再处理问题', ''],
      ['复购友好', '售后完成且满意后才允许轻推荐', ''],
      ['合规保守', '遇到退款、投诉、金额争议自动降级', ''],
    ];
    const samples = [
      ['客户说：赠品没收到', '先道歉，我帮您核验订单。确认少发后今天给您安排补发。'],
      ['客户说：你们怎么这么慢', '理解您着急，我先帮您查物流节点，如果异常会立即生成工单。'],
    ];
    return `
      <div class="phone-view agent-subpage cust-config-page" data-view="cust-smart-reply">
        <div class="cust-hero"><span>SMART REPLY</span><strong>智能回答</strong><em>控制 AI 客服的语气、引用依据、禁用承诺和复购插入时机。</em></div>
        <div class="cust-reply-persona"><div class="cust-avatar">客</div><div><strong>小客 · 克制服务型</strong><span>先解决问题，再维护关系；不在情绪异常时销售。</span></div></div>
        <div class="cust-section-title"><span>回答模式</span><em>4 MODES</em></div>
        <div class="cust-mode-grid">${modes.map(m=>`<button class="${m[2]}"><strong>${m[0]}</strong><span>${m[1]}</span></button>`).join('')}</div>
        <div class="cust-section-title"><span>回复预览</span><em>BEFORE SEND</em></div>
        <div class="cust-reply-preview">${samples.map(s=>`<div><span>${s[0]}</span><p>${s[1]}</p></div>`).join('')}</div>
        <div class="cust-forbidden"><strong>禁用承诺</strong><span>马上到账 · 一定赔付 · 绝对没问题 · 保证满意 · 内部处理</span></div>
        <div class="sub-safe-space"></div>
      </div>`;
  },

  /* ============ 客服助手：情绪安抚 ============ */
  'cust-emotion-care': () => {
    const levels = [
      ['L1', '轻微不满', '先道歉 + 解释流程', '继续 AI 处理'],
      ['L2', '明显焦虑', '承认情绪 + 给明确时间点', '生成待跟进'],
      ['L3', '愤怒投诉', '停止争辩 + 生成工单', '转人工'],
      ['L4', '威胁曝光', '不再自动承诺', '立即人工介入'],
    ];
    return `
      <div class="phone-view agent-subpage cust-config-page" data-view="cust-emotion-care">
        <div class="cust-hero"><span>EMOTION CARE</span><strong>情绪安抚</strong><em>识别负面情绪等级，决定继续 AI 接待、生成工单或立即转人工。</em></div>
        <div class="cust-emotion-ledger"><strong>今日情绪风险</strong><b>05</b><span>3 条已安抚 · 2 条转人工</span></div>
        <div class="cust-section-title"><span>情绪阶梯</span><em>非水平进度条</em></div>
        <div class="cust-emotion-steps">${levels.map((l,i)=>`<div class="risk-${i}"><b>${l[0]}</b><strong>${l[1]}</strong><span>${l[2]}</span><em>${l[3]}</em></div>`).join('')}</div>
        <div class="cust-script-box"><span>安抚话术原则</span><p>先承认客户感受，再给可验证动作；不解释过多，不甩锅，不在情绪未恢复前推荐商品。</p></div>
        <div class="sub-safe-space"></div>
      </div>`;
  },

  /* ============ 客服助手：复购引导 ============ */
  'cust-repurchase': () => {
    const triggers = [
      ['售后已解决', '客户回复满意 / 问题关闭 24 小时后', '发送复购券或使用建议'],
      ['高频咨询', '连续询问同类商品或服务权益', '推荐适配商品，不强促单'],
      ['老客回访', '30 天内购买 2 次以上', '提供会员权益和组合包'],
      ['负面恢复', '投诉处理后评分 ≥4', '只做关系维护，延迟推荐'],
    ];
    return `
      <div class="phone-view agent-subpage cust-config-page" data-view="cust-repurchase">
        <div class="cust-hero"><span>REPURCHASE GUIDE</span><strong>复购引导</strong><em>售后不是终点，满意后把服务会话转成下一次购买机会。</em></div>
        <div class="cust-repurchase-hero"><div><span>本周复购机会</span><strong>23</strong><em>来自客服会话沉淀</em></div><b>→ 销售助手</b></div>
        <div class="cust-section-title"><span>触发条件</span><em>SERVICE → SALES</em></div>
        <div class="cust-trigger-list">${triggers.map((t,i)=>`<div><b>${String(i+1).padStart(2,'0')}</b><div><strong>${t[0]}</strong><span>${t[1]}</span><p>${t[2]}</p></div></div>`).join('')}</div>
        <div class="cust-data-flow"><strong>数据流向</strong><span>客服会话 → 满意度/问题类型/商品顾虑 → 客户标签 → AI 销售助手二次营销判断</span></div>
        <div class="sub-safe-space"></div>
      </div>`;
  },

  /* ============ 客服助手：转人工规则 ============ */
  'cust-human-handoff': () => {
    const handoffs = [
      ['投诉/威胁曝光', '立即停止 AI 自动回复', 'P0'],
      ['退款争议金额 > ¥50', '生成工单并附聊天摘要', 'P1'],
      ['合同/发票/对公异常', '转财务或管理员确认', 'P1'],
      ['AI 连续 2 次未解决', '自动邀请人工接管', 'P2'],
    ];
    return `
      <div class="phone-view agent-subpage cust-config-page" data-view="cust-human-handoff">
        <div class="cust-hero"><span>HUMAN HANDOFF</span><strong>转人工规则</strong><em>定义哪些场景必须停下 AI，交给人工处理，并把上下文带过去。</em></div>
        <div class="cust-handoff-banner"><strong>人工接管不是失败</strong><span>高风险场景先保护客户关系，再让 AI 做摘要、标签和后续复盘。</span></div>
        <div class="cust-section-title"><span>触发规则</span><em>RISK · PRIORITY</em></div>
        <div class="cust-handoff-list">${handoffs.map(h=>`<div><em>${h[2]}</em><strong>${h[0]}</strong><span>${h[1]}</span></div>`).join('')}</div>
        <div class="cust-handoff-summary"><span>转人工附带信息</span><p>客户身份、最近 10 条消息、命中 FAQ、情绪等级、AI 已承诺事项、建议人工处理动作。</p></div>
        <div class="sub-safe-space"></div>
      </div>`;
  },

  /* ============ 配置子页：客户标签 ============ */
  /* ============ 销售助手：新人资料模板 ============ */
  'sales-profile-template': () => {
    const fields = [
      ['基础身份', '姓名 / 性别 / 年龄 / 城市 / 来源渠道', 'AI 先判断称呼和破冰方式'],
      ['性格倾向', '理性 / 感性 / 谨慎 / 冲动 / 话多 / 沉默', '决定沟通节奏和话术密度'],
      ['家庭背景', '宝妈 / 单身 / 已婚 / 家庭决策者 / 子女教育', '用于情绪共鸣和场景切入'],
      ['收入背景', '预算有限 / 稳定收入 / 高净值 / 愿意投资', '决定推荐商品和报价策略'],
      ['当前需求', '副业 / 创业 / 私域增长 / 提升效率 / 复购', '决定第一轮推荐方向'],
      ['禁忌边界', '不谈收益承诺 / 不催单 / 不提家庭 / 需人工确认', '避免冒犯和违规承诺'],
    ];
    return `
      <div class="phone-view agent-subpage sales-config-page" data-view="sales-profile-template">
        <div class="sales-sub-hero"><span>NEWCOMER PROFILE TEMPLATE</span><strong>新人资料模板</strong><em>AI 销售开口前先读人：身份、性格、家庭、收入、需求、禁忌。</em></div>
        <div class="sales-mini-kpis"><div><strong>6</strong><span>资料字段</span></div><div><strong>12</strong><span>自动标签</span></div><div><strong>3s</strong><span>生成沟通策略</span></div></div>
        <div class="sales-profile-form">
          <div><label>模板名称</label><input value="新人首次沟通模板" /></div>
          <div><label>AI 读取目标</label><textarea>先判断新人类型，再选择营销思路；如果资料不足，先提问补齐，不直接推商品。</textarea></div>
        </div>
        <div class="sales-section-title"><span>字段结构</span><em>PROFILE · REQUIRED</em></div>
        <div class="sales-field-list">
          ${fields.map((f,i)=>`<div class="sales-field-row"><b>${String(i+1).padStart(2,'0')}</b><div><strong>${f[0]}</strong><span>${f[1]}</span><em>${f[2]}</em></div></div>`).join('')}
        </div>
        <div class="sales-rule-note"><strong>默认规则</strong><span>资料不完整时，AI 先问 1 个轻问题补资料；命中“情绪异常/投诉/黑名单”立即暂停营销。</span></div>
        <div class="sub-safe-space"></div>
      </div>`;
  },

  /* ============ 销售助手：标签策略 ============ */
  'agent-tags': () => {
    const groups = [
      ['意向标签', ['高意向','中意向','低意向','已咨询未下单','已下单','适合复购']],
      ['消费标签', ['高收入','价格敏感','预算有限','愿意投资','重视回报']],
      ['关系标签', ['熟人推荐','陌生新人','老客户','朋友关系','社群成员']],
      ['性格标签', ['理性型','感性型','谨慎型','冲动型','话多型','沉默型']],
      ['场景标签', ['宝妈','副业','创业者','老板','销售人员','私域从业者']],
    ];
    const rules = [
      ['高意向', '直接成交型', '连续询价 / 点击商品卡 / 主动问付款方式'],
      ['价格敏感', '优惠刺激型', '反复问折扣 / 预算有限 / 对比价格'],
      ['陌生新人', '信任建立型', '来源陌生 / 没有共同关系 / 回复慢'],
      ['宝妈', '情绪共鸣型', '提到家庭、孩子、时间不够'],
      ['老板', '专家顾问型', '关注 ROI、团队效率、长期回报'],
      ['情绪异常', '暂停营销', '投诉、愤怒、讽刺、强烈拒绝'],
    ];
    return `
      <div class="phone-view agent-subpage sales-config-page" data-view="agent-tags">
        <div class="sales-sub-hero"><span>TAG STRATEGY</span><strong>标签策略</strong><em>标签不是备注，是 AI 销售选择打法、商品和跟进节奏的判断依据。</em></div>
        <div class="sales-tag-groups">
          ${groups.map(g=>`<div><strong>${g[0]}</strong><p>${g[1].map(t=>`<span>${t}</span>`).join('')}</p></div>`).join('')}
        </div>
        <div class="sales-section-title"><span>标签到策略</span><em>TAG → PLAYBOOK</em></div>
        <div class="sales-rule-map">
          ${rules.map(r=>`<div><b>${r[0]}</b><strong>${r[1]}</strong><span>${r[2]}</span></div>`).join('')}
        </div>
        <div class="sub-toolbar sales-toolbar"><button>＋ 新建标签</button><button>自动打标规则</button><button>同步消息页</button></div>
        <div class="sub-safe-space"></div>
      </div>`;
  },

  /* ============ 配置子页：竞品对比 ============ */
  'sales-competitors': () => {
    const items = [
      ['智简CRM', '主打低价', '强调我们：全程客服 + 数据看板 + 企业版权限', 'active'],
      ['云客SCRM', '主打AI外呼', '强调我们：主动营销少、干扰少、合规友好', ''],
      ['尘锋SCRM', '主打私域', '强调我们：轻量化、顾问式转化、客单价灵活', '']
    ];
    return `
      <div class="phone-view agent-subpage" data-view="sales-competitors">
        <div class="sub-hero" style="border-left:3px solid #ff6b35">
          <span>COMPETITOR ANALYSIS</span>
          <strong>竞品对比</strong>
          <em>知己知彼 · 差异化话术一键调取</em>
        </div>
        <div class="sub-toolbar"><button>＋ 添加竞品</button><button>对比模板</button></div>
        <div class="sub-section-title"><span>竞品情报</span><em>3 家已录入</em></div>
        <div class="competitor-list">
          ${items.map(x => `
            <div class="competitor-card ${x[3]}">
              <div class="competitor-name"><strong>${x[0]}</strong><em>${x[1]}</em></div>
              <p>${x[2]}</p>
            </div>
          `).join('')}
        </div>
        <div class="sub-section-title"><span>应对话术</span><em>按场景调用</em></div>
        <div class="rule-sheet">
          <div><strong>对手低价</strong><span>强调服务质量、合规保障和长期ROI，不打价格战</span></div>
          <div><strong>对手功能多</strong><span>强调我们轻量化上手快、顾问式跟进而非工具堆砌</span></div>
        </div>
        <div class="sub-safe-space"></div>
      </div>
    `;
  },

  /* ============ 销售助手：营销思路 ============ */
  'sales-scripts': () => {
    const plays = [
      ['信任建立型', '陌生新人 / 谨慎型', '先建立共同点，少推销，多解释身份和价值边界。'],
      ['情绪共鸣型', '宝妈 / 感性型 / 时间压力', '先共情处境，再给轻量可执行的方案。'],
      ['专家顾问型', '老板 / 创业者 / 理性型', '用诊断和 ROI 逻辑沟通，强调决策依据。'],
      ['直接成交型', '高意向 / 已多次咨询', '聚焦价格、权益、下单路径，减少闲聊。'],
      ['优惠刺激型', '价格敏感 / 预算有限', '强调限时权益、组合优惠和回本逻辑。'],
      ['长期养熟型', '低意向 / 沉默型', '降低频率，持续提供案例和轻知识。'],
      ['熟人推荐型', '熟人推荐 / 朋友关系', '借推荐关系破冰，但避免过度施压。'],
      ['复购激活型', '老客户 / 已成交', '基于使用记录推荐升级、加购或复购。'],
    ];
    return `
      <div class="phone-view agent-subpage sales-config-page" data-view="sales-scripts">
        <div class="sales-sub-hero"><span>MARKETING PLAYBOOK</span><strong>营销思路</strong><em>为不同新人类型配置 AI 的沟通打法：先选打法，再生成话术。</em></div>
        <div class="sales-playbook-lead"><strong>默认决策链</strong><span>新人资料 → 客户标签 → 商品匹配 → 营销思路 → 跟进节奏</span></div>
        <div class="sales-playbook-grid">
          ${plays.map((p,i)=>`<div class="sales-play-card ${i===3?'hot':''}"><b>${String(i+1).padStart(2,'0')}</b><strong>${p[0]}</strong><em>${p[1]}</em><p>${p[2]}</p></div>`).join('')}
        </div>
        <div class="sales-rule-note"><strong>禁区</strong><span>不得承诺收益、不得虚假限量、不得诋毁竞品、不得对情绪异常客户继续促单。</span></div>
        <div class="sub-safe-space"></div>
      </div>`;
  },

  /* ============ 销售助手：跟进节奏 ============ */
  'sales-followup': () => {
    const stages = [
      ['T+0 首聊', '新人进来 5 分钟内', '轻破冰 + 补资料，不直接硬推。'],
      ['T+1 培育', '资料基本完整后', '发送匹配案例 / 价值说明 / 低压力提问。'],
      ['T+2 推荐', '识别需求和预算后', '推荐 1 个主商品 + 1 个备选，不堆 SKU。'],
      ['T+3 促单', '高意向或反复询价', '报价、权益、佣金/收益逻辑、下单路径。'],
      ['T+7 复访', '未成交或沉默', '低频回访，换角度重新建立兴趣。'],
      ['异常暂停', '投诉 / 拒绝 / 情绪异常', '停止营销，标记人工介入。'],
    ];
    return `
      <div class="phone-view agent-subpage sales-config-page" data-view="sales-followup">
        <div class="sales-sub-hero"><span>FOLLOW-UP CADENCE</span><strong>跟进节奏</strong><em>让 AI 知道什么时候说、说多少、何时促单、何时停止。</em></div>
        <div class="sales-cadence-strip"><div><strong>5 min</strong><span>首触达</span></div><div><strong>3 次</strong><span>促单上限</span></div><div><strong>7 天</strong><span>复访周期</span></div></div>
        <div class="sales-section-title"><span>节奏阶梯</span><em>非水平进度条</em></div>
        <div class="sales-step-ladder">
          ${stages.map((s,i)=>`<div class="sales-step-row"><b>${String(i+1).padStart(2,'0')}</b><div><strong>${s[0]}</strong><span>${s[1]}</span><p>${s[2]}</p></div></div>`).join('')}
        </div>
        <div class="sales-rule-note"><strong>频率控制</strong><span>同一客户 24 小时内最多 3 次主动触达；连续 2 次未回复自动降频。</span></div>
        <div class="sub-safe-space"></div>
      </div>`;
  },

  /* ============ 配置子页：转化漏斗 ============ */
  'sales-funnel': () => {
    const stages = [
      ['触达', 245, 100],
      ['留资', 89, 36],
      ['报价', 43, 48],
      ['成交', 12, 28]
    ];
    return `
      <div class="phone-view agent-subpage" data-view="sales-funnel">
        <div class="sub-hero" style="border-left:3px solid #ff6b35">
          <span>CONVERSION FUNNEL</span>
          <strong>转化漏斗</strong>
          <em>每步转化率追踪 · AI 诊断流失节点</em>
        </div>
        <div class="analytics-kpis">
          <div><strong>12</strong><span>本月成交</span><em>+3</em></div>
          <div><strong>4.9%</strong><span>整体转化</span><em>+0.8%</em></div>
          <div><strong>¥8,240</strong><span>平均客单价</span><em>+¥420</em></div>
        </div>
        <div class="sub-section-title"><span>漏斗明细</span><em>竖立柱图</em></div>
        <div class="pillar-chart">
          ${stages.map((x, i) => `
            <div class="pillar-${i}"><i style="height:${x[2] * 3}px"></i><strong>${x[1]}</strong><span>${x[0]}</span></div>
          `).join('')}
        </div>
        <div class="sub-section-title"><span>AI 建议</span><em>流失最大的环节</em></div>
        <div class="insight-list">
          <div><b>!</b><strong>报价→成交流失率 72%</strong><span>建议增加售后保障说明和成单优惠</span></div>
          <div><b>↗</b><strong>留资率 36%</strong><span>高于行业均值，可加大投放</span></div>
        </div>
        <div class="sub-safe-space"></div>
      </div>
    `;
  },

  /* ============ 配置子页：报价模板 ============ */
  'sales-quote': () => {
    const quotes = [
      ['VIC 月卡', '¥199/月', '适合个人或小团队试用', '试用转化率 38%'],
      ['VIC 年卡', '¥1,688/年', '月均 ¥140，比月卡省 29%', '主力产品'],
      ['企业版 10席', '¥3,999/年', '含管理后台 + 数据看板 + 优先客服', '高客单'],
      ['企业版 30席', '¥9,999/年', '无限成员 + API 接口 + 定制培训', '大客户']
    ];
    return `
      <div class="phone-view agent-subpage" data-view="sales-quote">
        <div class="sub-hero" style="border-left:3px solid #ff6b35">
          <span>QUOTE TEMPLATES</span>
          <strong>报价模板</strong>
          <em>4 套标准报价 · AI 根据客户情况自动推荐</em>
        </div>
        <div class="sub-toolbar"><button>＋ 新建模板</button><button>调整系数</button></div>
        <div class="sub-section-title"><span>标准报价</span><em>按客户类型自动匹配</em></div>
        <div class="quote-list">
          ${quotes.map(x => `
            <div class="quote-card">
              <div class="quote-name"><strong>${x[0]}</strong><em>${x[1]}</em></div>
              <p>${x[2]}</p>
              <span>${x[3]}</span>
            </div>
          `).join('')}
        </div>
        <div class="sub-section-title"><span>AI 推荐逻辑</span></div>
        <div class="rule-sheet">
          <div><strong>个人 / 小团队</strong><span>优先推荐月卡，强调低门槛</span></div>
          <div><strong>有预算信号</strong><span>直接推荐年卡或企业版</span></div>
          <div><strong>高意向 / 多次触达</strong><span>触发限时优惠 + 年卡转化</span></div>
        </div>
        <div class="sub-safe-space"></div>
      </div>
    `;
  },

  /* ============ 配置子页：会议议程 ============ */
  'meeting-agenda': () => {
    const items = [
      ['Q1 产品对齐', '周三 14:00', '产品部 / 工程部', '确认需求文档'],
      ['客户方案评审', '周四 10:00', '销售 + 客户', '报价前最后一轮对齐'],
      ['全员周会', '周五 09:30', '全体', '本周进度 + 下周计划']
    ];
    return `
      <div class="phone-view agent-subpage" data-view="meeting-agenda">
        <div class="sub-hero" style="border-left:3px solid #10b981">
          <span>MEETING AGENDA</span>
          <strong>会议议程</strong>
          <em>提前设定议程模板 · AI 自动生成待讨论事项</em>
        </div>
        <div class="sub-toolbar"><button>＋ 新建议程</button><button>导入模板</button></div>
        <div class="sub-section-title"><span>预设议程</span><em>3 套模板</em></div>
        <div class="agenda-list">
          ${items.map(x => `
            <div class="agenda-card">
              <div class="agenda-name"><strong>${x[0]}</strong><em>${x[1]}</em></div>
              <p>${x[2]}</p>
              <span>${x[3]}</span>
            </div>
          `).join('')}
        </div>
        <div class="sub-section-title"><span>AI 辅助</span></div>
        <div class="rule-sheet">
          <div><strong>自动提取</strong><span>根据历史会议记录生成议程草稿</span></div>
          <div><strong>决策提醒</strong><span>自动标记需要拍板的事项</span></div>
        </div>
        <div class="sub-safe-space"></div>
      </div>
    `;
  },

  /* ============ 配置子页：参会人管理 ============ */
  'meeting-attendees': () => {
    const people = [
      ['陈志远', '组织者', '决策者', '全程参与'],
      ['王经理', '工程负责人', '技术决策', '重点议题出席'],
      ['李明', '产品经理', '产品负责人', '全程参与'],
      ['张总', '客户方', '最终拍板', '结论环节出席']
    ];
    return `
      <div class="phone-view agent-subpage" data-view="meeting-attendees">
        <div class="sub-hero" style="border-left:3px solid #10b981">
          <span>ATTENDEE MGMT</span>
          <strong>参会人管理</strong>
          <em>角色标注 · 权限分级 · 纪要自动分发</em>
        </div>
        <div class="sub-toolbar"><button>＋ 添加人员</button><button>批量导入</button></div>
        <div class="sub-section-title"><span>参会人</span><em>4 人</em></div>
        <div class="attendee-list">
          ${people.map(x => `
            <div class="attendee-card">
              <div class="attendee-avatar">${x[0][0]}</div>
              <div><strong>${x[0]}</strong><span>${x[1]}</span><em>${x[2]}</em></div>
              <b>${x[3]}</b>
            </div>
          `).join('')}
        </div>
        <div class="sub-section-title"><span>AI 角色识别</span></div>
        <div class="rule-sheet">
          <div><strong>决策者</strong><span>自动标记，全程通知，结论必须确认</span></div>
          <div><strong>执行者</strong><span>自动分配行动项，抄送跟进</span></div>
        </div>
        <div class="sub-safe-space"></div>
      </div>
    `;
  },

  /* ============ 配置子页：纪要模板 ============ */
  'meeting-summary-template': () => {
    const sections = [
      ['会议概要', '时间/地点/参会人/目的'],
      ['关键讨论', '有争议的决策点'],
      ['决策事项', '已拍板的内容（需确认）'],
      ['行动项', '任务 + 负责人 + 截止'],
      ['下次待定', '遗留问题']
    ];
    return `
      <div class="phone-view agent-subpage" data-view="meeting-summary-template">
        <div class="sub-hero" style="border-left:3px solid #10b981">
          <span>SUMMARY TEMPLATE</span>
          <strong>纪要模板</strong>
          <em>自定义输出格式 · AI 按模板生成结构化纪要</em>
        </div>
        <div class="sub-toolbar"><button>＋ 添加章节</button><button>预览</button></div>
        <div class="sub-section-title"><span>模板结构</span><em>5 个章节</em></div>
        <div class="template-list">
          ${sections.map((x, i) => `
            <div class="template-section">
              <b>${i + 1}</b>
              <div><strong>${x[0]}</strong><span>${x[1]}</span></div>
              <em>必填</em>
            </div>
          `).join('')}
        </div>
        <div class="sub-section-title"><span>输出示例</span></div>
        <div class="rule-sheet">
          <div><strong>会议概要</strong><span>6月12日 14:00 · 产品对齐会 · 3人</span></div>
          <div><strong>决策</strong><span>Q3 上线 AI 辅助功能，7月15日 Beta</span></div>
          <div><strong>行动</strong><span>@王工 · 7月1日前出技术方案</span></div>
        </div>
        <div class="sub-safe-space"></div>
      </div>
    `;
  },

  /* ============ 配置子页：行动项跟踪 ============ */
  'meeting-actions': () => {
    const actions = [
      ['王工程师', '技术方案文档', '7月1日', '高'],
      ['李产品', '竞品分析报告', '6月18日', '高'],
      ['陈志远', '客户确认报价', '6月15日', '中'],
      ['张总', '内部评审会', '6月20日', '低']
    ];
    return `
      <div class="phone-view agent-subpage" data-view="meeting-actions">
        <div class="sub-hero" style="border-left:3px solid #10b981">
          <span>ACTION TRACKER</span>
          <strong>行动项跟踪</strong>
          <em>AI 自动提取 · 责任人认领 · 截止提醒</em>
        </div>
        <div class="analytics-kpis">
          <div><strong>12</strong><span>进行中</span></div>
          <div><strong>3</strong><span>本周到期</span></div>
          <div><strong>8</strong><span>已完成</span></div>
        </div>
        <div class="sub-section-title"><span>待认领</span><em>按优先级</em></div>
        <div class="action-tracker">
          ${actions.map(x => `
            <div class="action-row">
              <div class="action-avatar">${x[0][0]}</div>
              <div><strong>${x[0]}</strong><p>${x[1]}</p><span>截止 ${x[2]}</span></div>
              <em class="${x[3] === '高' ? 'high' : ''}">${x[3]}</em>
            </div>
          `).join('')}
        </div>
        <div class="sub-safe-space"></div>
      </div>
    `;
  },

  /* ============ 配置子页：风格预设（生图） ============ */
  'img-styles': () => {
    const styles = [
      ['📷 写实摄影', '适合产品图、人物肖像、场景图', 'active'],
      ['🎨 插画风格', '扁平插画、矢量风格，适合 banner 和海报', ''],
      ['✏️ 漫画线稿', '手绘质感，适合教程和社交内容', ''],
      ['💧 水彩渲染', '轻盈通透，适合文创和礼品类视觉', ''],
      ['🏢 建筑透视', '室内外建筑、产品结合场景', ''],
      ['🌿 自然光', '柔光、暖调，适合生活方式类内容', '']
    ];
    return `
      <div class="phone-view agent-subpage" data-view="img-styles">
        <div class="sub-hero" style="border-left:3px solid #8b5cf6">
          <span>STYLE PRESETS</span>
          <strong>风格预设</strong>
          <em>6 种基础风格 · 可叠加参数微调</em>
        </div>
        <div class="sub-toolbar"><button>＋ 自定义风格</button><button>风格融合</button></div>
        <div class="style-grid">
          ${styles.map(x => `
            <div class="style-card ${x[2]}">
              <b>${x[0]}</b>
              <p>${x[1]}</p>
            </div>
          `).join('')}
        </div>
        <div class="sub-section-title"><span>使用统计</span></div>
        <div class="rule-sheet">
          <div><strong>写实摄影</strong><span>使用率 42%，最受电商客户欢迎</span></div>
          <div><strong>插画风格</strong><span>使用率 31%，适合社交媒体内容</span></div>
        </div>
        <div class="sub-safe-space"></div>
      </div>
    `;
  },

  /* ============ 配置子页：参考图库 ============ */
  'img-refs': () => {
    const refs = [
      ['品牌形象参考', '12 张', '品牌联名、官网视觉'],
      ['竞品视觉分析', '8 张', '了解行业调性，找到差异化'],
      ['场景灵感库', '24 张', '生活方式、产品使用场景']
    ];
    return `
      <div class="phone-view agent-subpage" data-view="img-refs">
        <div class="sub-hero" style="border-left:3px solid #8b5cf6">
          <span>REFERENCE LIBRARY</span>
          <strong>参考图库</strong>
          <em>上传风格参考 · AI 解析并复刻构图/色调/氛围</em>
        </div>
        <div class="sub-toolbar"><button>＋ 上传图片</button><button>批量管理</button></div>
        <div class="sub-section-title"><span>图库分类</span><em>3 组</em></div>
        <div class="ref-gallery">
          ${refs.map(x => `
            <div class="ref-card">
              <div class="ref-preview">🖼️</div>
              <div><strong>${x[0]}</strong><span>${x[1]}</span><p>${x[2]}</p></div>
            </div>
          `).join('')}
        </div>
        <div class="sub-section-title"><span>使用说明</span></div>
        <div class="rule-sheet">
          <div><strong>上传规范</strong><span>JPG/PNG，建议 1024px 以上</span></div>
          <div><strong>AI 解析</strong><span>自动提取构图、色彩、光影三个维度</span></div>
        </div>
        <div class="sub-safe-space"></div>
      </div>
    `;
  },

  /* ============ 配置子页：审核规则（生图） ============ */
  'img-moderation': () => {
    const rules = [
      ['品牌一致性', '禁止出现竞品 logo、违禁语', 'active'],
      ['版权合规', '禁止使用未授权素材', 'active'],
      ['人物肖像', '涉及真人需有授权证明', 'active'],
      ['虚假宣传', '不得生成虚假数据图、证书', 'active']
    ];
    return `
      <div class="phone-view agent-subpage" data-view="img-moderation">
        <div class="sub-hero" style="border-left:3px solid #8b5cf6">
          <span>MODERATION RULES</span>
          <strong>审核规则</strong>
          <em>生成前过滤 + 生成后检查 · 双保险合规</em>
        </div>
        <div class="sub-toolbar"><button>＋ 添加规则</button><button>预览效果</button></div>
        <div class="sub-section-title"><span>规则列表</span><em>4 条启用</em></div>
        <div class="moderation-list">
          ${rules.map(x => `
            <div class="moderation-row ${x[2]}">
              <div class="mod-icon">${x[2] ? '✓' : '○'}</div>
              <div><strong>${x[0]}</strong><p>${x[1]}</p></div>
            </div>
          `).join('')}
        </div>
        <div class="sub-section-title"><span>拦截记录</span></div>
        <div class="log-filter"><button class="active">全部</button><button>今日</button><button>本周</button></div>
        <div class="rule-sheet">
          <div><strong>已拦截</strong><span>3 次 · 均因版权问题被人工驳回</span></div>
        </div>
        <div class="sub-safe-space"></div>
      </div>
    `;
  },

  /* ============ 配置子页：文案模板（写作） ============ */
  'write-templates': () => {
    const templates = [
      ['📣 产品种草', '小红书/朋友圈风格，软性植入', 28],
      ['📋 详细页', '产品卖点罗列，适合电商详情页', 15],
      ['📊 周报/月报', '工作汇报格式，上级爱看的那种', 12],
      ['🎉 活动海报', '促销、节日、会员活动文案', 9],
      ['📧 商务邮件', '对外商务沟通，正式但不死板', 7]
    ];
    return `
      <div class="phone-view agent-subpage" data-view="write-templates">
        <div class="sub-hero" style="border-left:3px solid #ec4899">
          <span>COPY TEMPLATES</span>
          <strong>文案模板</strong>
          <em>5 大类 · 71 套模板 · 按场景调用</em>
        </div>
        <div class="sub-toolbar"><button>＋ 新建模板</button><button>训练调优</button></div>
        <div class="sub-section-title"><span>模板库</span><em>按类型</em></div>
        <div class="template-write-list">
          ${templates.map(x => `
            <div class="write-template-card">
              <b>${x[0]}</b>
              <div><strong>${x[0].replace(/^[^\s]+\s/, '')}</strong><p>${x[1]}</p></div>
              <span>${x[2]} 套</span>
            </div>
          `).join('')}
        </div>
        <div class="sub-section-title"><span>使用排行</span></div>
        <div class="insight-list">
          <div><b>1</b><strong>产品种草</strong><span>本周使用 42 次</span></div>
          <div><b>2</b><strong>周报/月报</strong><span>本周使用 31 次</span></div>
        </div>
        <div class="sub-safe-space"></div>
      </div>
    `;
  },

  /* ============ 配置子页：品牌调性 ============ */
  'write-tone': () => {
    const tones = [
      ['专业权威', '适合 B2B、企业客户沟通', 'linear-gradient(135deg,#1a3a5c,#2d5a8c)'],
      ['亲和友善', '适合消费者、会员、粉丝运营', 'linear-gradient(135deg,#2d8c5c,#34a870)'],
      ['年轻活力', '适合年轻用户、潮流品牌', 'linear-gradient(135deg,#c0392b,#e74c3c)'],
      ['稳重信赖', '适合金融、医疗、大客户', 'linear-gradient(135deg,#2c3e50,#34495e)']
    ];
    return `
      <div class="phone-view agent-subpage" data-view="write-tone">
        <div class="sub-hero" style="border-left:3px solid #ec4899">
          <span>BRAND VOICE</span>
          <strong>品牌调性</strong>
          <em>语气 · 用词 · 视觉偏好 · AI 统一风格输出</em>
        </div>
        <div class="sub-toolbar"><button>＋ 自定义调性</button><button>预览</button></div>
        <div class="sub-section-title"><span>调性库</span><em>4 种预设</em></div>
        <div class="tone-brand-list">
          ${tones.map(x => `
            <div class="tone-brand-card" style="background:${x[2]}">
              <strong>${x[0]}</strong>
              <p>${x[1]}</p>
            </div>
          `).join('')}
        </div>
        <div class="sub-section-title"><span>当前启用</span><em>亲和友善</em></div>
        <div class="rule-sheet">
          <div><strong>语气</strong><span>轻松、有温度、不说教</span></div>
          <div><strong>用词</strong><span>通俗易懂，少用专业缩写</span></div>
          <div><strong>表情</strong><span>适量 emoji，但不过度</span></div>
        </div>
        <div class="sub-safe-space"></div>
      </div>
    `;
  },

  /* ============ 配置子页：审核规则（写作） ============ */
  'write-moderation': () => {
    const rules = [
      ['虚假宣传', '禁用绝对化用语：100%、保证、绝对', 'active'],
      ['违禁内容', '政治、色情、暴力相关内容', 'active'],
      ['版权文字', '引用他人文章需注明来源', 'active'],
      ['价格表述', '涉及价格必须准确，不得夸大优惠', 'active']
    ];
    return `
      <div class="phone-view agent-subpage" data-view="write-moderation">
        <div class="sub-hero" style="border-left:3px solid #ec4899">
          <span>CONTENT MODERATION</span>
          <strong>审核规则</strong>
          <em>生成前过滤 · 敏感词检测 · 违规内容拦截</em>
        </div>
        <div class="sub-toolbar"><button>＋ 添加规则</button><button>测试</button></div>
        <div class="sub-section-title"><span>规则列表</span><em>4 条</em></div>
        <div class="moderation-list">
          ${rules.map(x => `
            <div class="moderation-row ${x[2]}">
              <div class="mod-icon">${x[2] ? '✓' : '○'}</div>
              <div><strong>${x[0]}</strong><p>${x[1]}</p></div>
            </div>
          `).join('')}
        </div>
        <div class="sub-section-title"><span>敏感词库</span><em>2,847 个词</em></div>
        <div class="forbidden-words"><strong>近期新增</strong><span>最低价 · 全网第一 · 官方保证 · 无效退款（夸大）</span></div>
        <div class="sub-safe-space"></div>
      </div>
    `;
  },

  /* ============ 配置子页：转写设置 ============ */
  'audio-transcribe': () => {
    const opts = [
      ['语言', '中文（普通话）', '可切换粤/英/日'],
      ['标点', '自动添加', '句号/逗号/问号'],
      ['分段逻辑', '按语义分段', '沉默超 2 秒自动切段'],
      ['说话人分离', '开启', '自动识别不同发言人的段落']
    ];
    return `
      <div class="phone-view agent-subpage" data-view="audio-transcribe">
        <div class="sub-hero" style="border-left:3px solid #06b6d4">
          <span>TRANSCRIBE ENGINE</span>
          <strong>转写设置</strong>
          <em>语言 · 标点 · 分段 · 引擎选择</em>
        </div>
        <div class="sub-toolbar"><button>＋ 自定义词库</button><button>测试音频</button></div>
        <div class="sub-section-title"><span>转写参数</span><em>4 项配置</em></div>
        <div class="setting-list">
          ${opts.map(x => `
            <div class="setting-row">
              <div><strong>${x[0]}</strong><p>${x[2]}</p></div>
              <span>${x[1]}</span>
            </div>
          `).join('')}
        </div>
        <div class="sub-section-title"><span>准确率</span></div>
        <div class="analytics-kpis">
          <div><strong>97.2%</strong><span>普通话准确率</span></div>
          <div><strong>94.8%</strong><span>含专有名词</span></div>
          <div><strong>1.2s</strong><span>平均延迟</span></div>
        </div>
        <div class="sub-safe-space"></div>
      </div>
    `;
  },

  /* ============ 配置子页：发言人识别 ============ */
  'audio-speakers': () => {
    const speakers = [
      ['陈志远', '主持人', '主讲内容最多'],
      ['王经理', '参会人A', '技术方案讲解'],
      ['李总', '参会人B', '提问和决策'],
      ['未知', '参会人C', '部分发言']
    ];
    return `
      <div class="phone-view agent-subpage" data-view="audio-speakers">
        <div class="sub-hero" style="border-left:3px solid #06b6d4">
          <span>SPEAKER DIARIZATION</span>
          <strong>发言人识别</strong>
          <em>自动分离不同说话人 · 姓名标注 · 角色管理</em>
        </div>
        <div class="sub-toolbar"><button>＋ 添加发言人</button><button>合并段落</button></div>
        <div class="sub-section-title"><span>发言人</span><em>4 个</em></div>
        <div class="speaker-list">
          ${speakers.map(x => `
            <div class="speaker-card">
              <div class="speaker-avatar">${x[0][0]}</div>
              <div><strong>${x[0]}</strong><span>${x[1]}</span><p>${x[2]}</p></div>
            </div>
          `).join('')}
        </div>
        <div class="sub-section-title"><span>AI 识别规则</span></div>
        <div class="rule-sheet">
          <div><strong>声纹分离</strong><span>根据音色、音调区分不同说话人</span></div>
          <div><strong>姓名匹配</strong><span>如识别到已知联系人，自动标注姓名</span></div>
        </div>
        <div class="sub-safe-space"></div>
      </div>
    `;
  },

  /* ============ 配置子页：摘要模板 ============ */
  'audio-summary': () => {
    const sections = [
      ['会议概要', '时间/参会人/主题'],
      ['关键讨论', '有争议或需跟进的话题'],
      ['决策事项', '已明确的结论'],
      ['行动项', '任务 + 负责人 + 截止日期']
    ];
    return `
      <div class="phone-view agent-subpage" data-view="audio-summary">
        <div class="sub-hero" style="border-left:3px solid #06b6d4">
          <span>SUMMARY TEMPLATE</span>
          <strong>摘要模板</strong>
          <em>自定义摘要输出结构 · AI 按模板提取关键信息</em>
        </div>
        <div class="sub-toolbar"><button>＋ 添加章节</button><button>应用全部</button></div>
        <div class="sub-section-title"><span>摘要结构</span><em>4 个章节</em></div>
        <div class="template-list">
          ${sections.map((x, i) => `
            <div class="template-section">
              <b>${i + 1}</b>
              <div><strong>${x[0]}</strong><span>${x[1]}</span></div>
              <em>必填</em>
            </div>
          `).join('')}
        </div>
        <div class="sub-section-title"><span>示例输出</span></div>
        <div class="rule-sheet">
          <div><strong>会议概要</strong><span>6月12日 14:00 · 3人 · 产品对齐</span></div>
          <div><strong>决策</strong><span>Q3 上线 AI 辅助功能</span></div>
          <div><strong>行动</strong><span>@王工 · 技术方案 · 7月1日</span></div>
        </div>
        <div class="sub-safe-space"></div>
      </div>
    `;
  },

  /* ============ 配置子页：关键词提取 ============ */
  'audio-keywords': () => {
    const keywords = [
      ['产品', 'VIC、企业版、功能需求'],
      ['时间', 'Q3、7月、上线节点'],
      ['决策', '拍板、确认、同意'],
      ['人员', '@王工、@李产品、@陈总'],
      ['跟进', '待办、下周、后续']
    ];
    return `
      <div class="phone-view agent-subpage" data-view="audio-keywords">
        <div class="sub-hero" style="border-left:3px solid #06b6d4">
          <span>KEYWORD EXTRACTION</span>
          <strong>关键词提取</strong>
          <em>自动识别 · 行业词库 · 自定义词表</em>
        </div>
        <div class="sub-toolbar"><button>＋ 添加词库</button><button>导入</button></div>
        <div class="sub-section-title"><span>关键词分类</span><em>5 类</em></div>
        <div class="keyword-cloud">
          ${keywords.map(x => `
            <div class="keyword-card">
              <strong>${x[0]}</strong>
              <p>${x[1]}</p>
            </div>
          `).join('')}
        </div>
        <div class="sub-section-title"><span>行业词库</span><em>采购中 · 预计下周上线</em></div>
        <div class="sub-safe-space"></div>
      </div>
    `;
  },

  /* ============ 配置子页：日志管理（音频） ============ */
  'audio-logs': () => {
    const logs = [
      ['6月12日 14:00', '产品对齐会', '45分钟', '完整'],
      ['6月11日 10:00', '客户方案评审', '62分钟', '完整'],
      ['6月10日 16:30', '周例会', '38分钟', '缺失 12分钟']
    ];
    return `
      <div class="phone-view agent-subpage" data-view="audio-logs">
        <div class="sub-hero" style="border-left:3px solid #06b6d4">
          <span>TRANSCRIBE LOGS</span>
          <strong>日志管理</strong>
          <em>转写记录 · 音频文件 · 导出历史</em>
        </div>
        <div class="log-filter"><button class="active">全部</button><button>完整</button><button>有缺失</button></div>
        <div class="sub-section-title"><span>转写记录</span><em>3 条</em></div>
        <div class="audio-log-list">
          ${logs.map(x => `
            <div class="audio-log-row">
              <div class="log-date">${x[0]}</div>
              <div><strong>${x[1]}</strong><span>${x[2]}</span></div>
              <em class="${x[3] === '完整' ? '' : 'warn'}">${x[3]}</em>
            </div>
          `).join('')}
        </div>
        <div class="sub-safe-space"></div>
      </div>
    `;
  },

  /* ============ 配置子页：导出设置 ============ */
  'audio-export': () => {
    const formats = [
      ['📝 Markdown', '.md', '适合内部存档、wiki', 'active'],
      ['📄 PDF', '.pdf', '含格式、页眉页脚', ''],
      ['📃 TXT', '.txt', '纯文本、最通用', ''],
      ['📊 JSON', '.json', '含元数据，适合程序处理', '']
    ];
    return `
      <div class="phone-view agent-subpage" data-view="audio-export">
        <div class="sub-hero" style="border-left:3px solid #06b6d4">
          <span>EXPORT SETTINGS</span>
          <strong>导出设置</strong>
          <em>格式选择 · 自动分发规则 · 命名模板</em>
        </div>
        <div class="sub-toolbar"><button>＋ 新增格式</button><button>命名规则</button></div>
        <div class="sub-section-title"><span>导出格式</span><em>4 种</em></div>
        <div class="format-list">
          ${formats.map(x => `
            <div class="format-card ${x[3]}">
              <b>${x[0]}</b>
              <div><strong>${x[1]}</strong><p>${x[2]}</p></div>
              <em>${x[3] ? '默认' : ''}</em>
            </div>
          `).join('')}
        </div>
        <div class="sub-section-title"><span>自动分发</span></div>
        <div class="rule-sheet">
          <div><strong>纪要摘要</strong><span>自动发送给所有参会人</span></div>
          <div><strong>完整转写</strong><span>自动存档至指定文件夹</span></div>
        </div>
        <div class="sub-safe-space"></div>
      </div>
    `;
  },

  'sales-products': () => {
    const products = [
      ['私域增长入门包', '¥199', '适合陌生新人/预算有限', '普通10% · 银牌15% · 黄金20% · 钻石25%'],
      ['AI 销售进阶包', '¥699', '适合高意向/愿意投资', '普通12% · 银牌18% · 黄金24% · 钻石30%'],
      ['团队版工具包', '¥1999', '适合老板/创业团队', '普通15% · 银牌20% · 黄金28% · 钻石35%'],
      ['年度陪跑服务', '¥5999', '适合高净值/长期养熟', '普通18% · 银牌25% · 黄金32% · 钻石40%'],
    ];
    return `
    <div class="phone-view agent-subpage sales-config-page" data-view="sales-products">
      <div class="sales-sub-hero"><span>MY PRODUCT LIBRARY</span><strong>我的商品库</strong><em>用户从平台商品中选择自己的主推商品，AI 按价格、卖点、人群和佣金推荐。</em></div>
      <div class="sub-toolbar sales-toolbar"><button>＋ 手动添加</button><button>从平台商品加入</button><button>训练卖点</button></div>
      <div class="sales-product-list">
        ${products.map((p,i)=>`
          <div class="sales-product-card ${i===1?'featured':''}">
            <div><b>${String(i+1).padStart(2,'0')}</b><strong>${p[0]}</strong><em>${p[1]}</em></div>
            <p>${p[2]}</p>
            <span>${p[3]}</span>
          </div>`).join('')}
      </div>
      <div class="sales-section-title"><span>推荐逻辑</span><em>AI MATCHING</em></div>
      <div class="sales-rule-map compact">
        <div><b>价格敏感</b><strong>入门包</strong><span>先低门槛体验，再引导升级</span></div>
        <div><b>老板/团队</b><strong>团队版</strong><span>强调效率、管理、ROI</span></div>
        <div><b>高净值</b><strong>年度陪跑</strong><span>强调长期回报和专属服务</span></div>
      </div>
      <div class="sub-safe-space"></div>
    </div>`;
  },

  /* ============ 销售助手：平台商品库 ============ */
  'sales-platform-products': () => {
    const products = [
      ['平台标准课', '¥299', '适合新人入门', '已加入 128 次', '10% / 15% / 20% / 25%'],
      ['私域工具年卡', '¥1688', '适合私域从业者', '已加入 76 次', '12% / 18% / 24% / 30%'],
      ['老板增长营', '¥3999', '适合老板/创业者', '已加入 34 次', '15% / 22% / 30% / 38%'],
      ['高客单陪跑', '¥9999', '适合高净值客户', '已加入 12 次', '18% / 25% / 35% / 45%'],
    ];
    return `
      <div class="phone-view agent-subpage sales-config-page" data-view="sales-platform-products">
        <div class="sales-sub-hero"><span>PLATFORM PRODUCT LIBRARY</span><strong>平台商品库</strong><em>平台统一维护商品，用户按等级看到不同佣金，一键加入我的商品库。</em></div>
        <div class="sales-rank-bar"><span>当前等级</span><strong>黄金会员</strong><em>佣金按第三档显示</em></div>
        <div class="sales-platform-list">
          ${products.map((p,i)=>`<div class="sales-platform-row"><b>${String(i+1).padStart(2,'0')}</b><div><strong>${p[0]}</strong><span>${p[2]} · ${p[3]}</span><em>普通/银牌/黄金/钻石：${p[4]}</em></div><button>加入</button></div>`).join('')}
        </div>
        <div class="sales-rule-note"><strong>佣金显示</strong><span>商品佣金由平台统一配置；用户等级变化后，AI 报价和推荐优先级自动更新。</span></div>
        <div class="sub-safe-space"></div>
      </div>`;
  },

  /* ============ 会议助手：录音设置 ============ */
  'meet-recording': () => {
    const engines = [
      ['标准转写', '普通会议 / 访谈 / 线上沟通', '实时标点 + 关键词'],
      ['高精度转写', '客户会议 / 需求评审 / 重要谈判', '降噪 + 术语增强'],
      ['只录音不转写', '内部留档 / 临时记录', '会后手动处理'],
    ];
    return `
      <div class="phone-view agent-subpage meet-config-page" data-view="meet-recording">
        <div class="meet-hero"><span>RECORDING SETUP</span><strong>录音设置</strong><em>配置 AI 会议助手如何录音、何时转写、哪些场景必须保留原始音频。</em></div>
        <div class="meet-meter"><div><strong>48k</strong><span>采样率</span></div><div><strong>实时</strong><span>边录边转</span></div><div><strong>7天</strong><span>原音保留</span></div></div>
        <div class="meet-section-title"><span>识别模式</span><em>ASR · MODE</em></div>
        <div class="meet-mode-list">${engines.map((e,i)=>`<div class="${i===1?'active':''}"><b>${String(i+1).padStart(2,'0')}</b><strong>${e[0]}</strong><span>${e[1]}</span><em>${e[2]}</em></div>`).join('')}</div>
        <div class="meet-rule-box"><strong>默认规则</strong><p>会议开始后自动提醒是否开启录音；客户会议默认高精度；检测到敏感词时保留原始音频，便于复核。</p></div>
        <div class="sub-safe-space"></div>
      </div>`;
  },

  /* ============ 会议助手：发言分离 ============ */
  'meet-speakers': () => {
    const roles = [
      ['主持人', '控制议程 / 推进结论', '自动识别高频发起问题者'],
      ['客户方', '需求 / 异议 / 决策意见', '优先沉淀需求与风险'],
      ['销售方', '承诺 / 报价 / 后续动作', '检查是否有过度承诺'],
      ['技术方', '方案 / 排期 / 资源限制', '转为行动项和风险点'],
    ];
    return `
      <div class="phone-view agent-subpage meet-config-page" data-view="meet-speakers">
        <div class="meet-hero"><span>SPEAKER DIARIZATION</span><strong>发言分离</strong><em>把一段录音拆成不同说话人，并标注角色，纪要才不会混乱。</em></div>
        <div class="meet-speaker-board"><div><strong>4</strong><span>默认角色</span></div><div><strong>92%</strong><span>角色识别</span></div></div>
        <div class="meet-section-title"><span>角色规则</span><em>ROLE · LABEL</em></div>
        <div class="meet-role-list">${roles.map((r,i)=>`<div><b>${String(i+1).padStart(2,'0')}</b><div><strong>${r[0]}</strong><span>${r[1]}</span><p>${r[2]}</p></div></div>`).join('')}</div>
        <div class="meet-rule-box"><strong>低置信度处理</strong><p>同一声纹低于 70% 置信度时，纪要中先标为“待确认发言人”，不强行归属。</p></div>
        <div class="sub-safe-space"></div>
      </div>`;
  },

  /* ============ 会议助手：纪要模板 ============ */
  'meet-template': () => {
    const blocks = [
      ['会议背景', '会议目的 / 参会角色 / 上下文'],
      ['关键结论', '已确认事项 / 决策结果 / 共识'],
      ['争议与风险', '未达成一致 / 资源不足 / 时间风险'],
      ['客户意图', '采购意向 / 预算信号 / 顾虑点'],
      ['行动项', '负责人 / 截止时间 / 依赖条件'],
      ['销售跟进', '可同步给 AI 销售助手的下一步建议'],
    ];
    return `
      <div class="phone-view agent-subpage meet-config-page" data-view="meet-template">
        <div class="meet-hero"><span>MINUTES TEMPLATE</span><strong>纪要模板</strong><em>会议结束后不是生成流水账，而是输出可执行、可追踪、可复盘的结构化纪要。</em></div>
        <div class="meet-template-paper"><strong>默认输出结构</strong><span>结论优先 · 风险单列 · 行动项独立编号</span></div>
        <div class="meet-section-title"><span>模板字段</span><em>SUMMARY · BLOCKS</em></div>
        <div class="meet-template-grid">${blocks.map((b,i)=>`<div><b>${String(i+1).padStart(2,'0')}</b><strong>${b[0]}</strong><span>${b[1]}</span></div>`).join('')}</div>
        <div class="meet-rule-box"><strong>输出原则</strong><p>先写结论，再写过程；无法确认的内容标记“待确认”，禁止把推测写成事实。</p></div>
        <div class="sub-safe-space"></div>
      </div>`;
  },

  /* ============ 会议助手：行动项 ============ */
  'meet-todo': () => {
    const todos = [
      ['确认报价边界', '销售负责人', '今天 18:00', '高'],
      ['补充技术方案图', '技术同事', '明天 12:00', '中'],
      ['客户发票抬头确认', '客服/财务', '2 天内', '中'],
      ['下次会议议程', '主持人', '会前 1 天', '低'],
    ];
    return `
      <div class="phone-view agent-subpage meet-config-page" data-view="meet-todo">
        <div class="meet-hero"><span>ACTION ITEMS</span><strong>行动项</strong><em>把会议中的“回头再说”变成有负责人、有截止时间、有提醒的待办。</em></div>
        <div class="meet-todo-stats"><div><strong>12</strong><span>待办模板</span></div><div><strong>3级</strong><span>优先级</span></div><div><strong>自动</strong><span>提醒</span></div></div>
        <div class="meet-section-title"><span>提取样例</span><em>TODO · OWNER</em></div>
        <div class="meet-todo-list">${todos.map(t=>`<div><em>${t[3]}</em><strong>${t[0]}</strong><span>${t[1]} · ${t[2]}</span></div>`).join('')}</div>
        <div class="meet-rule-box"><strong>同步规则</strong><p>行动项确认后同步到会议详情和消息提醒；涉及客户转化的待办会同步给 AI 销售助手。</p></div>
        <div class="sub-safe-space"></div>
      </div>`;
  },

  /* ============ 会议助手：日程同步 ============ */
  'meet-calendar': () => {
    const channels = [
      ['IM 内会议', '自动读取参会人、群聊、会议链接', '已启用'],
      ['系统日历', '同步日期、提醒、会议邀请', '待授权'],
      ['客户跟进', '会后回访时间写入销售提醒', '已启用'],
    ];
    return `
      <div class="phone-view agent-subpage meet-config-page" data-view="meet-calendar">
        <div class="meet-hero"><span>CALENDAR SYNC</span><strong>日程同步</strong><em>让会议助手知道会议从哪里来、什么时候提醒、会后跟进到哪里去。</em></div>
        <div class="meet-calendar-card"><strong>下一场会议</strong><span>15:30 · VIC 客户需求评审</span><em>会前 10 分钟提醒开启录音</em></div>
        <div class="meet-section-title"><span>同步通道</span><em>CHANNEL · STATUS</em></div>
        <div class="meet-channel-list">${channels.map(c=>`<div><strong>${c[0]}</strong><span>${c[1]}</span><em>${c[2]}</em></div>`).join('')}</div>
        <div class="meet-rule-box"><strong>权限边界</strong><p>只读取会议标题、时间、参会人和链接；不读取私人日历正文，不保存外部账号密钥。</p></div>
        <div class="sub-safe-space"></div>
      </div>`;
  },

  /* ============ 会议助手：双语翻译 ============ */
  'meet-translate': () => {
    const rows = [
      ['中英双语纪要', '中文正文 + 英文摘要', '适合跨境客户会议'],
      ['实时字幕', '会议中显示双语字幕', '适合多人远程会议'],
      ['术语词库', '品牌名 / 产品名 / 行业词固定译法', '减少翻译误差'],
      ['人工复核', '重要纪要导出前人工确认', '适合合同/报价场景'],
    ];
    return `
      <div class="phone-view agent-subpage meet-config-page" data-view="meet-translate">
        <div class="meet-hero"><span>BILINGUAL OUTPUT</span><strong>双语翻译</strong><em>跨境会议不只翻译文字，还要保留角色、结论、行动项和专业术语。</em></div>
        <div class="meet-translate-split"><div><b>ZH</b><strong>客户希望下周确认报价边界。</strong></div><div><b>EN</b><strong>The client expects the pricing boundary to be confirmed next week.</strong></div></div>
        <div class="meet-section-title"><span>输出模式</span><em>LANG · MODE</em></div>
        <div class="meet-translate-list">${rows.map((r,i)=>`<div><b>${String(i+1).padStart(2,'0')}</b><strong>${r[0]}</strong><span>${r[1]}</span><em>${r[2]}</em></div>`).join('')}</div>
        <div class="meet-rule-box"><strong>术语规则</strong><p>产品名、人名、品牌名优先使用词库；低置信度译文会标记“需确认”，不直接进入正式纪要。</p></div>
        <div class="sub-safe-space"></div>
      </div>`;
  },

  'img-sizes': () => {
    return `
      <div class="phone-view agent-subpage" data-view="img-sizes">
        <div class="sub-hero" style="border-left:3px solid #8b5cf6"><span>SIZE PRESETS</span><strong>尺寸设置</strong><em>9 种常用输出尺寸，覆盖社媒与电商</em></div>
        <div class="sub-toolbar"><button>自定义尺寸</button><button>储存为默认</button></div>
        <div class="style-grid"><div class="style-card active"><b>1:1 正方形</b><p>商品主图 · 头像</p></div><div class="style-card"><b>3:4 小红书</b><p>种草封面</p></div><div class="style-card"><b>16:9 横幅</b><p>Banner · 头图</p></div><div class="style-card"><b>9:16 竖屏</b><p>短视频封面</p></div><div class="style-card"><b>4:3 展示</b><p>产品详情</p></div><div class="style-card"><b>2:3 卡片</b><p>电商列表</p></div></div>
        <div class="rule-sheet"><div><strong>高清输出</strong><span>所有预设支持 2K/4K 输出，比例锁定，智能主体居中裁切。</span></div></div>
        <div class="sub-safe-space"></div>
      </div>`;
  },
  'img-text': () => {
    return `
      <div class="phone-view agent-subpage" data-view="img-text">
        <div class="sub-hero" style="border-left:3px solid #8b5cf6"><span>TEXT OVERLAY</span><strong>文字叠加</strong><em>标题 / 卖点 / 价格标签 / 水印 — 自动排版引擎</em></div>
        <div class="sub-toolbar"><button>新建规则</button><button>保存模板</button></div>
        <div class="tech-matrix"><div><strong>字体风格</strong><span>黑体标题 + 宋体副标题 + DM Mono 标签</span></div><div><strong>位置优先级</strong><span>左上 ＞ 底部安全区 ＞ 非主体区域</span></div><div><strong>颜色规则</strong><span>暖白底用黑字，深色底用白字，强调用红色</span></div></div>
        <div class="sub-section-title"><span>模板预设</span><em>3 套</em></div>
        <div class="rule-sheet"><div><strong>电商标题</strong><span>左上角 · 品名 + 价格 · 黑底白字 18px</span></div><div><strong>种草标注</strong><span>底部 · 半透明白底 + 红强调标签</span></div><div><strong>水印保护</strong><span>右下角 · 品牌 DM · 半透明 10px</span></div></div>
        <div class="sub-safe-space"></div>
      </div>`;
  },
  'img-batch': () => {
    return `
      <div class="phone-view agent-subpage" data-view="img-batch">
        <div class="sub-hero" style="border-left:3px solid #8b5cf6"><span>BATCH GENERATION</span><strong>批量生成</strong><em>产品 × 风格 × 尺寸组合，一次输出 N 张</em></div>
        <div class="analytics-kpis"><div><strong>12</strong><span>待生成</span></div><div><strong>48</strong><span>今日完成</span></div><div><strong>92%</strong><span>通过率</span></div><div><strong>2</strong><span>等待中</span></div></div>
        <div class="sub-section-title"><span>批量策略</span><em>防重复 · 防溢出</em></div>
        <div class="rule-sheet"><div><strong>去重规则</strong><span>同一产品最多 6 张风格变体，SSIM > 95% 自动去重。</span></div><div><strong>尺寸组合</strong><span>仅勾选的尺寸输出，避免渲染浪费。</span></div></div>
        <div class="sub-toolbar" style="margin-top:10px"><button>导入商品列表</button><button>启动任务</button></div>
        <div class="sub-safe-space"></div>
      </div>`;
  },
  'img-hd': () => {
    return `
      <div class="phone-view agent-subpage" data-view="img-hd">
        <div class="sub-hero" style="border-left:3px solid #8b5cf6"><span>HD REDRAW</span><strong>高清重绘</strong><em>2K / 4K 输出 · 细节修复 · 背景增强 · 人像保护</em></div>
        <div class="sub-toolbar"><button>立即重绘</button><button>批量处理</button></div>
        <div class="tech-matrix"><div><strong>输出清晰度</strong><span>2K（2560×1440）默认，4K 需二次确认</span></div><div><strong>细节增强</strong><span>产品边缘平滑、文字清晰度提升、材质强化</span></div><div><strong>人像保护</strong><span>面部修复 + 手部检测 + 肤色优化</span></div><div><strong>背景增强</strong><span>低光照补光、背景虚化或替换</span></div></div>
        <div class="sub-safe-space"></div>
      </div>`;
  },
  'write-platforms': () => {
    return `
      <div class="phone-view agent-subpage" data-view="write-platforms">
        <div class="sub-hero" style="border-left:3px solid #ef4444"><span>PLATFORM ADAPTATION</span><strong>多平台适配</strong><em>一稿生成朋友圈 / 小红书 / 公众号 / 私聊版本</em></div>
        <div class="sub-toolbar"><button>新增平台</button><button>保存配置</button></div>
        <div class="template-list">
          <div class="template-section"><b>1</b><div><strong>朋友圈</strong><span>短句 · 强利益点 · 少标签</span></div><em>启用</em></div>
          <div class="template-section"><b>2</b><div><strong>小红书</strong><span>标题钩子 + 场景痛点 + 收藏引导</span></div><em>启用</em></div>
          <div class="template-section"><b>3</b><div><strong>公众号</strong><span>长文结构 · 案例前置 · CTA</span></div><em>启用</em></div>
          <div class="template-section"><b>4</b><div><strong>私聊/社群</strong><span>自然口语 · 非模板感 · 个性化破冰</span></div><em>启用</em></div>
        </div>
        <div class="sub-safe-space"></div>
      </div>`;
  },
  'write-filter': () => {
    return `
      <div class="phone-view agent-subpage" data-view="write-filter">
        <div class="sub-hero" style="border-left:3px solid #ef4444"><span>SENSITIVE FILTER</span><strong>敏感词过滤</strong><em>合规保障 · 自动改写 · 风险标记 · 人工复核</em></div>
        <div class="sub-toolbar"><button>添加禁用词</button><button>批量导入</button></div>
        <div class="sub-section-title"><span>禁用词库</span><em>15 条生效中</em></div>
        <div class="forbidden-words"><strong>演示词</strong><span>稳赚 · 第一 · 国家级 · 100% · 保证成交 · 立即到账 · 绝不 · 首选 · 全网最低</span></div>
        <div class="rule-sheet"><div><strong>自动改写</strong><span>命中禁用词自动替换为合规表达，标记来源。</span></div><div><strong>人工复核</strong><span>金融 / 医疗 / 投资 / 未成年人内容强制转人工。</span></div></div>
        <div class="sub-safe-space"></div>
      </div>`;
  },
  'write-batch': () => {
    return `
      <div class="phone-view agent-subpage" data-view="write-batch">
        <div class="sub-hero" style="border-left:3px solid #ef4444"><span>BATCH WRITING</span><strong>批量创作</strong><em>主题 × 平台 × 语气 × 角度，一次批量 20+ 篇</em></div>
        <div class="analytics-kpis"><div><strong>20</strong><span>今日生成</span></div><div><strong>6</strong><span>待审核</span></div><div><strong>88%</strong><span>通过率</span></div><div><strong>3</strong><span>进行中</span></div></div>
        <div class="sub-section-title"><span>批量策略</span></div>
        <div class="rule-sheet"><div><strong>角度覆盖</strong><span>同一主题生成 3 个角度：痛点 / 案例 / 促销。</span></div><div><strong>平台 × 语气矩阵</strong><span>每个角度自动适配全部已启用平台，按语气切换版本。</span></div></div>
        <div class="sub-toolbar" style="margin-top:10px"><button>新建批量任务</button><button>查看历史</button></div>
        <div class="sub-safe-space"></div>
      </div>`;
  },
  'write-rewrite': () => {
    return `
      <div class="phone-view agent-subpage" data-view="write-rewrite">
        <div class="sub-hero" style="border-left:3px solid #ef4444"><span>REWRITE MODE</span><strong>改写润色</strong><em>语气升级 · 长度调整 · 风格统一 — 覆盖所有改写场景</em></div>
        <div class="sub-toolbar"><button>粘贴原文</button><button>选择模式</button><button>预览效果</button></div>
        <div class="tech-matrix"><div><strong>更专业</strong><span>压缩口语，增强商务表达，去掉弱词。</span></div><div><strong>更有力</strong><span>强化利益点和行动引导，加入紧迫感。</span></div><div><strong>更自然</strong><span>减少模板感，保留自然语气，加入口语衔接。</span></div><div><strong>调长度</strong><span>朋友圈短句 vs 公众号长文 vs 私信适中。</span></div></div>
        <div class="sub-safe-space"></div>
      </div>`;
  },

  /* ============ 真人单聊 ============ */
  'chat-single': (cid) => {
    const c = getContact(cid) || CONTACTS[0];
    const thread = (typeof CUSTOMER_THREADS !== 'undefined' && CUSTOMER_THREADS[c.id])
      ? CUSTOMER_THREADS[c.id]
      : { profile: c.dept || '客户资料待补充', insight: '暂无 AI 洞察', product: '待匹配商品', next: '继续跟进客户需求。', messages: CHAT_WITH_NATSUME };
    const relatedChat = CHATS.find(x => x.contactId === c.id) || {};
    return `
      <div class="phone-view marketing-chat-detail" data-view="chat-single" data-cid="${c.id}">
        <div class="customer-ai-panel">
          <div class="cap-head">
            <div>
              <span>${c.intent || '客户意图'}</span>
              <strong>${c.name}</strong>
            </div>
            <b>${c.score || relatedChat.score || '--'}</b>
          </div>
          <div class="cap-profile">${thread.profile}</div>
          <div class="cap-grid">
            <div><em>阶段</em><strong>${c.stage || '跟进'}</strong></div>
            <div><em>来源</em><strong>${c.source || '私域'}</strong></div>
            <div><em>推荐</em><strong>${thread.product}</strong></div>
          </div>
          <div class="cap-next"><span>AI 下一步</span>${thread.next}</div>
        </div>
        <div class="chat-page-body marketing-thread" id="chatBody-${c.id}" style="flex:1;overflow-y:auto;display:flex;flex-direction:column;gap:10px;">
          <div class="bubble-time">${relatedChat.time || '刚刚'} · ${c.agent || 'AI 助手'} 已分析</div>
          <div class="ai-insight-card"><span>洞察</span>${thread.insight}</div>
          ${thread.messages.map((m) => `
            <div class="msg-row ${m.from === 'them' ? 'them' : 'me'}">
              ${m.from === 'them' ? `<div class="msg-avatar">${c.avatar}</div>` : ''}
              <div class="bubble ${m.from === 'them' ? 'them' : 'me'}">${m.text}</div>
            </div>
          `).join('')}
        </div>
        <div class="chat-input-bar marketing-input-bar" style="position:relative;bottom:0;">
          <div class="icon-btn">🤖</div>
          <input type="text" class="msg-input" id="msgInput-${c.id}" placeholder="输入消息，或让 AI 生成回复..." data-cid="${c.id}">
          <div class="send-btn ai-send" data-action="send-chat" data-cid="${c.id}">发送</div>
        </div>
      </div>
    `;
  },

  /* ============ Agent 对话（通用） ============ */
  'agent-chat': (agentId) => {
    const agent = getContact(agentId);
    if (!agent) return VIEWS['contact']();
    return `
      <div class="phone-view" data-view="agent-chat" data-agent="${agent.id}">
        <div class="agent-banner" style="background:${getAgentColor(agent.id)};color:#fff;padding:14px 16px;display:flex;align-items:center;gap:12px;">
          <div class="ac-avatar" style="background:rgba(255,255,255,0.2);width:40px;height:40px;">${agent.avatar}</div>
          <div style="flex:1;">
            <div style="font-size:15px;font-weight:700;">${agent.name}</div>
            <div style="font-size:11px;opacity:0.9;font-family:var(--font-mono);">AI Agent · ${agent.desc}</div>
          </div>
          <span class="phase-pill" style="background:rgba(255,255,255,0.25);color:#fff;">
            <span class="dot" style="background:#fff;"></span> 在线
          </span>
        </div>
        <div class="chat-page-body" id="agentChatBody-${agent.id}" style="flex:1;overflow-y:auto;padding:16px;background:#f5f8fc;display:flex;flex-direction:column;gap:10px;">
          <div class="bubble-time">AI Agent 已接入当前会话</div>
          <div class="msg-row them agent-msg-row">
            <div class="msg-avatar agent">${agent.avatar}</div>
            <div class="bubble them">${(agent.welcome || '您好！').replace(/\n/g, '<br>')}</div>
          </div>
        </div>
        ${agent.id === 'agent-grow' ? '' : `
        <div style="padding:6px 12px;background:#fff;border-top:1px solid #f0f2f5;display:flex;gap:6px;overflow-x:auto;">
          ${getQuickPrompts(agent.id).map(p => `<div class="quick-prompt" data-action="quick-prompt" data-text="${p}" style="padding:4px 10px;background:#f5f8fc;border-radius:12px;font-size:11px;color:var(--ink);white-space:nowrap;cursor:pointer;">${p}</div>`).join('')}
        </div>
        `}
        <div class="chat-input-bar" style="position:relative;bottom:0;">
          <div class="icon-btn">🎤</div>
          <input type="text" class="msg-input" id="agentInput-${agent.id}" placeholder="和${agent.name}聊聊..." data-agent="${agent.id}">
          <div class="icon-btn">😊</div>
          <div class="icon-btn">+</div>
          <div class="send-btn" data-action="send-agent" data-agent="${agent.id}">发送</div>
        </div>
      </div>
    `;
  },

  /* ============ 会议纪要 AI 输出 ============ */
  'agent-meeting': (mid) => {
    const s = MEETING_SUMMARY[mid] || MEETING_SUMMARY.m03;
    return `
      <div class="phone-view" data-view="agent-meeting" data-mid="${mid}">
        <div class="summary-banner">
          <div class="ai-tag">🤖 AI 生成</div>
          <h1>${s.title}</h1>
          <div class="meta">${s.meta}</div>
        </div>
        <div class="summary-toolbar">
          <div class="tb-btn">📋 复制</div>
          <div class="tb-btn">📤 分享</div>
          <div class="tb-btn">📥 导出</div>
          <div class="tb-btn">🔁 重新生成</div>
        </div>
        <div class="summary-section">
          <h3>📋 会议概要</h3>
          <div style="font-size:13px;line-height:1.7;color:var(--ink);">${s.overview}</div>
        </div>
        <div class="summary-section">
          <h3>💬 关键讨论点</h3>
          <ul>${s.keyPoints.map(k => `<li>${k}</li>`).join('')}</ul>
        </div>
        <div class="summary-section">
          <h3>✅ 决策事项</h3>
          <ul>${s.decisions.map(d => `<li>${d}</li>`).join('')}</ul>
        </div>
        <div class="summary-section">
          <h3>📌 行动项</h3>
          ${s.actions.map(a => `
            <div class="action-item">
              <div class="ai-task">${a.task}</div>
              <div class="ai-meta">
                <span class="ai-owner">@${a.owner}</span>
                <span>·</span>
                <span>截止 ${a.deadline}</span>
                <span>·</span>
                <span style="color:var(--accent-red);font-weight:700;">${a.priority}</span>
              </div>
            </div>
          `).join('')}
        </div>
        <div style="height: 80px;"></div>
      </div>
    `;
  }
};

/* === 视图辅助函数 === */
function renderChatItem(chat) {
  const c = getContact(chat.contactId);
  if (!c) return '';
  const isAgent = c.isAgent;
  const isGroup = c.isGroup;
  const tagHtml = isAgent
    ? `<span class="tag ${c.tagColor}">${c.tag}</span>`
    : isGroup
      ? `<span class="tag purple">群聊</span>`
      : `<span class="tag red">${chat.aiTag || c.intent || 'AI识别'}</span>`;
  const target = isAgent
    ? `agent-chat:${c.id}`
    : `chat-single:${c.id}`;
  const score = chat.score || c.score || 0;
  return `
    <a class="list-item marketing-case-item ${score >= 90 ? 'hot' : ''}" data-action="open" data-target="${target}">
      <div class="avatar ${c.isVip ? 'vip' : ''}">${c.avatar}</div>
      <div class="item-body">
        <div class="item-top">
          <div class="item-name">${c.name} ${tagHtml}</div>
          <div class="item-time">${chat.time}</div>
        </div>
        <div class="item-msg">${chat.lastMsg}</div>
        <div class="ai-next-line"><span>${chat.aiAgent || c.agent || 'AI'}</span>${chat.aiNext || 'AI 已生成下一步建议'}</div>
      </div>
      <div class="case-score"><b>${score || '--'}</b><em>意向</em></div>
      ${chat.unread ? `<div class="unread">${chat.unread}</div>` : ''}
    </a>
  `;
}

function renderContactItem(c) {
  return `
    <a class="list-item" data-action="open" data-target="chat-single:${c.id}">
      <div class="avatar ${c.isVip ? 'vip' : ''}">${c.avatar}</div>
      <div class="item-body">
        <div class="item-top">
          <div class="item-name">${c.name}</div>
        </div>
        <div class="item-msg">${c.dept || ''}</div>
      </div>
      ${c.type === '群聊' ? '' : '<div class="private-btn">私聊</div>'}
    </a>
  `;
}

function getAgentColor(id) {
  if (id === 'agent-grow')     return 'linear-gradient(135deg, #c8102e, #e53935)';
  if (id === 'agent-customer') return 'linear-gradient(135deg, #c8102e, #e53935)'; // legacy
  if (id === 'agent-sales')    return 'linear-gradient(135deg, #c8102e, #e53935)'; // legacy
  if (id === 'agent-meeting')  return 'linear-gradient(135deg, #10b981, #34d399)';
  return 'linear-gradient(135deg, #4a90e2, #6ba8e8)';
}

function getQuickPrompts(agentId) {
  if (agentId === 'agent-grow')      return ['我要退款', '查物流', '开发票', '推荐套餐', '了解 VIC'];
  if (agentId === 'agent-customer')  return ['我要退款', '查物流', '开发票', '投诉', '价格咨询'];  // legacy
  if (agentId === 'agent-sales')     return ['了解 VIC 套餐', '推荐一款', '价格多少', '有优惠吗'];  // legacy
  return [];
}
