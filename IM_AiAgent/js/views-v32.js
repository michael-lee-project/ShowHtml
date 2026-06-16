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



const AI_AUTO_SCENES = [
  { id:'silent', no:'01', title:'沉默唤醒', agent:'AI 销售助手', desc:'高意向客户 3 天未回复，AI 低压力重新触达。', tag:'主动跟进' },
  { id:'price', no:'02', title:'价格异议', agent:'AI 销售助手', desc:'客户觉得贵，AI 拆解顾虑并切换低门槛方案。', tag:'异议处理' },
  { id:'close', no:'03', title:'成交推进', agent:'AI 销售助手', desc:'客户问付款方式，AI 抓住强成交窗口。', tag:'临门一脚' },
  { id:'complaint', no:'04', title:'投诉安抚', agent:'AI 客服助手', desc:'客户不满发货慢，AI 先安抚再判断是否转人工。', tag:'风险客服' },
  { id:'repurchase', no:'05', title:'复购提醒', agent:'AI 客服助手', desc:'根据购买周期主动提醒补货并发送老客户券。', tag:'复购增长' },
  { id:'meeting-follow', no:'06', title:'会后跟进', agent:'AI 销售助手', desc:'会议助手提炼重点，销售助手自动发会后方案。', tag:'三 Agent 协同' }
];



/* === Company Channel · 企业公众号 mock data === */
const COMPANY_CHANNEL = {
  companyName: 'UmakeX 官方内容号',
  avatar: 'U',
  slogan: '项目资料、招商文章、产品素材、客户案例统一沉淀',
  owner: 'UmakeX Growth Team',
  unread: 3,
  latest: '视频号直播转化方案更新：从沉默唤醒到私聊成交',
  updatedAt: '13:40',
  projects: [
    { id: 'all', name: '全部', icon: '全', desc: '全部文章' },
    { id: 'join', name: '招商项目', icon: '招', desc: '政策 / 收益 / 结算' },
    { id: 'training', name: '新人训练营', icon: '训', desc: '新手路径 / 话术' },
    { id: 'product', name: '产品素材', icon: '品', desc: '卖点 / 图文 / 视频' },
    { id: 'case', name: '客户案例', icon: '案', desc: '成交 / 复购 / 企业单' },
    { id: 'service', name: '售后说明', icon: '服', desc: '发货 / 退款 / 补偿' }
  ],
  articles: [
    { id: 'a01', cover: { mark: '招商', tone: 'red', title: '合作政策', src: 'assets/company-channel/join.jpg' }, detailImage: 'assets/company-channel/join-detail.jpg', projectId: 'join', title: '项目方合作政策：佣金、结算和素材支持一次看懂', tag: '招商项目', time: '今天 13:40', reads: '1,286', summary: '适合发给社群主理人和团队长，解释合作门槛、团队收益、结算周期和素材支持。', points: ['佣金层级按团队 GMV 自动升级', '每周二统一结算，可导出团队明细', '平台提供朋友圈、社群、直播间三类素材'], aiQuote: '可直接发给招商咨询客户：你这类有社群资源的项目方，重点不是单品利润，而是团队结算透明度和素材供给。' },
    { id: 'a02', cover: { mark: '训练', tone: 'green', title: '7天首单', src: 'assets/company-channel/training.jpg' }, detailImage: 'assets/company-channel/training-detail.jpg', projectId: 'training', title: '新人 7 天训练营：从第一条朋友圈到首单转化', tag: '新人训练营', time: '今天 11:20', reads: '936', summary: '把新人冷启动拆成 7 天任务，适合 AI 销售助手自动提醒、自动复盘。', points: ['第 1 天完成身份介绍和朋友圈破冰', '第 3 天开始发客户案例', '第 7 天做首单复盘和下一轮目标'], aiQuote: '可提醒新人：今天不用硬卖，先完成朋友圈破冰和 3 个潜在客户标记，AI 会帮你生成私聊开场。' },
    { id: 'a03', cover: { mark: '直播', tone: 'red', title: '转化方案', src: 'assets/company-channel/live.jpg' }, detailImage: 'assets/company-channel/live-detail.jpg', projectId: 'product', title: '视频号直播转化方案：沉默唤醒、价格异议、成交推进', tag: '产品素材', time: '昨天 18:10', reads: '2,018', summary: '面向直播间线索的三段式转化内容，已同步给 AI 销售助手作为自动回复素材。', points: ['沉默客户用低压力问题重新触达', '价格异议先拆解风险再给低门槛方案', '付款咨询要立即进入成交推进'], aiQuote: '可在直播线索跟进中引用：如果你先拿体验装，后面升级可以抵扣，不会浪费第一次尝试成本。' },
    { id: 'a04', cover: { mark: '案例', tone: 'green', title: '36套订单', src: 'assets/company-channel/case.jpg' }, detailImage: 'assets/company-channel/case-detail.jpg', projectId: 'case', title: '企业采购案例：从一次试用到 36 套团队订单', tag: '客户案例', time: '昨天 15:30', reads: '742', summary: '展示企业客户如何从试用装切入，再通过会议方案和售后保障完成大单。', points: ['先给 3 人试用降低采购阻力', '会议助手整理采购关注点', '客服助手承诺售后 SLA'], aiQuote: '可发给企业采购客户：我们可以先按 3 人小样试用推进，确认反馈后再给团队价和交付排期。' },
    { id: 'a05', cover: { mark: '售后', tone: 'green', title: '服务安抚', src: 'assets/company-channel/service.jpg' }, detailImage: 'assets/company-channel/service-detail.jpg', projectId: 'service', title: '售后安抚标准：少发、慢发、退款三类问题怎么处理', tag: '售后说明', time: '周一 09:16', reads: '654', summary: '统一售后口径，帮助 AI 客服先安抚情绪，再判断补发、优惠券或转人工。', points: ['少发先道歉再补发', '慢发提供物流节点和补偿券', '退款场景先识别是否可替代解决'], aiQuote: '可用于售后场景：这次体验不好先跟你说声抱歉，我先帮你补齐赠品，同时给你一张老会员复购券。' },
    { id: 'a06', cover: { mark: '模型', tone: 'red', title: '收益测算', src: 'assets/company-channel/model.jpg' }, detailImage: 'assets/company-channel/model-detail.jpg', projectId: 'join', title: '团队长收益模型：100 人社群的月度转化测算', tag: '招商项目', time: '周日 20:45', reads: '1,104', summary: '用保守、中性、积极三档模型，讲清楚团队长最关心的投入产出。', points: ['保守模型按 3% 转化计算', '中性模型加入复购和转介绍', '积极模型增加直播场次和团队分销'], aiQuote: '可发给项目方：我先按你 600 人社群做一版保守测算，不夸大收益，但能看出团队结算空间。' }
  ]
};

function getCompanyProject(projectId) {
  return COMPANY_CHANNEL.projects.find(p => p.id === projectId) || COMPANY_CHANNEL.projects[0];
}

function getCompanyArticles(projectId) {
  if (!projectId || projectId === 'all') return COMPANY_CHANNEL.articles;
  return COMPANY_CHANNEL.articles.filter(a => a.projectId === projectId);
}

function getCompanyArticle(articleId) {
  return COMPANY_CHANNEL.articles.find(a => a.id === articleId) || COMPANY_CHANNEL.articles[0];
}

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
        ${renderCompanyChannelPinned()}
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
        <div class="msg-section-head scene-head ai-scene-bottom-head">
          <span>AI AUTO TALK SCENES</span>
          <em>核心场景演示</em>
        </div>
        <div class="ai-scene-strip ai-scene-strip-bottom">
          ${AI_AUTO_SCENES.map(s => renderAiSceneChip(s)).join('')}
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


  /* ============ 企业公众号：项目文章频道 ============ */
  'company-channel': (projectId = 'all') => {
    const activeProject = getCompanyProject(projectId);
    const articles = getCompanyArticles(projectId);
    return `
      <div class="phone-view company-channel-view" data-view="company-channel" data-project="${activeProject.id}">
        <div class="company-channel-hero">
          <div class="company-channel-avatar">${COMPANY_CHANNEL.avatar}</div>
          <div class="company-channel-main">
            <span>COMPANY OFFICIAL ACCOUNT</span>
            <strong>${COMPANY_CHANNEL.companyName}</strong>
            <em>${COMPANY_CHANNEL.slogan}</em>
          </div>
          <div class="company-channel-status"><b>${COMPANY_CHANNEL.unread}</b><i>更新</i></div>
        </div>
        <div class="company-channel-meta">
          <div><b>${COMPANY_CHANNEL.projects.length - 1}</b><span>公司项目</span></div>
          <div><b>${COMPANY_CHANNEL.articles.length}</b><span>文章消息</span></div>
          <div><b>AI</b><span>可引用</span></div>
        </div>
        <div class="company-project-strip">
          ${COMPANY_CHANNEL.projects.map(p => `
            <button class="company-project-dot ${p.id === activeProject.id ? 'active' : ''}" data-action="open" data-target="company-channel:${p.id}">
              <b>${p.icon}</b>
              <span>${p.name}</span>
              <em>${p.desc}</em>
            </button>
          `).join('')}
        </div>
        <div class="company-channel-section">
          <span>${activeProject.name === '全部' ? '全部文章消息' : activeProject.name}</span>
          <em>${articles.length} 篇 · 点击查看详情</em>
        </div>
        <div class="company-article-feed company-rich-feed">
          ${articles.map((a, i) => renderCompanyArticleCard(a, i)).join('')}
        </div>
        <div class="company-channel-safe"></div>
      </div>
    `;
  },

  /* ============ 企业公众号：文章详情 ============ */
  'company-article': (articleId) => {
    const article = getCompanyArticle(articleId);
    const project = getCompanyProject(article.projectId);
    return `
      <div class="phone-view company-article-view wx-article-page" data-view="company-article" data-article="${article.id}">
        <article class="wx-article">
          <header class="wx-article-head">
            <div class="wx-article-breadcrumb">${project.name}</div>
            <h1>${article.title}</h1>
            <div class="wx-article-meta">
              <span>${COMPANY_CHANNEL.companyName}</span>
              <em>${article.time}</em>
              <i>${article.reads} 阅读</i>
            </div>
          </header>
          <figure class="wx-article-cover">
            ${renderCompanyCover(article, project)}
          </figure>
          <section class="wx-article-lead">
            <b>导读</b>
            <p>${article.summary}</p>
          </section>
          ${renderCompanyArticleBody(article, project)}
          <section class="wx-article-points">
            <div class="wx-block-title"><span>关键卖点</span><em>AI SALES MATERIAL</em></div>
            ${article.points.map((p, i) => `
              <div class="wx-point-row"><b>${String(i + 1).padStart(2, '0')}</b><span>${p}</span></div>
            `).join('')}
          </section>
          <section class="company-ai-quote wx-ai-quote">
            <span>AI 可引用话术</span>
            <strong>${article.aiQuote}</strong>
          </section>
          <div class="company-article-actions wx-article-actions">
            <button type="button">发给客户</button>
            <button type="button">让 AI 销售引用</button>
          </div>
        </article>
        <div class="company-channel-safe"></div>
      </div>
    `;
  },

  /* ============ 通讯录：AI 营销客户资产 ============ */
  'contact': () => {
    const officialService = getContact('official-service');
    const users = CONTACTS.filter(c => !c.isAgent && !c.isOfficial);
    const salesUsers = users.filter(c => c.agent === 'AI 销售助手').length;
    const serviceUsers = users.filter(c => c.agent === 'AI 客服助手').length;
    const highScore = users.filter(c => (c.score || 0) >= 85).length;
    const avgScore = Math.round(users.reduce((sum,c)=>sum+(c.score||60),0) / Math.max(users.length,1));
    return `
      <div class="phone-view contact-marketing-view" data-view="contact">
        <div class="contact-mkt-hero">
          <div>
            <span>CUSTOMER ASSET</span>
            <strong>通讯录</strong>
            <em>不是普通好友列表，是 AI 销售/客服共用的客户画像资料库。</em>
          </div>
          <b>${users.length}</b>
        </div>
        <div class="contact-mkt-search">
          <input class="search-input" placeholder="🔍 搜客户 / 标签 / 意图 / 商品 / Agent">
        </div>
        ${officialService ? renderOfficialServicePinned(officialService) : ''}
        <div class="contact-mkt-stats">
          <div><strong>${highScore}</strong><span>高价值客户</span></div>
          <div><strong>${salesUsers}</strong><span>销售跟进</span></div>
          <div><strong>${serviceUsers}</strong><span>客服沉淀</span></div>
          <div><strong>${avgScore}</strong><span>平均评分</span></div>
        </div>
        <div class="contact-mkt-agents">
          <div data-action="open-agent-config" data-agent="sales"><b>AI 销售助手</b><span>读取画像、标签、商品兴趣，自动判断下一步转化动作。</span></div>
          <div data-action="open-agent-config" data-agent="cust"><b>AI 客服助手</b><span>读取售后状态、情绪等级、历史问题，维护关系并回流复购机会。</span></div>
        </div>
        <div class="contact-section-title compact people-title contact-mkt-title">
          <span>CUSTOMER PROFILES</span>
          <em>${users.length} 份画像</em>
        </div>
        <div class="contact-profile-list">
          ${users.map(c => renderMarketingContactItem(c)).join('')}
        </div>
        <div class="sub-safe-space"></div>
      </div>
    `;
  },

  /* ============ 通讯录：客户画像详情 ============ */
  'contact-profile': (id) => {
    const c = getContact(id) || CONTACTS.find(x => !x.isAgent);
    const thread = CUSTOMER_THREADS[c.id] || { profile:c.dept || '资料待补充', insight:'暂无 AI 洞察，建议先补齐客户背景。', product:'待匹配', next:'补齐身份、预算、需求和禁忌后再让 AI 跟进。', messages:[] };
    const tags = [c.intent || '待识别', c.stage || '未分层', c.source || '未知来源', c.agent || 'AI 待分配'];
    const score = c.score || 60;
    const owner = c.agent === 'AI 客服助手' ? 'AI 客服助手' : 'AI 销售助手';
    return `
      <div class="phone-view agent-subpage contact-profile-page" data-view="contact-profile" data-cid="${c.id}">
        <div class="contact-profile-hero">
          <div class="contact-profile-avatar ${c.isVip ? 'vip' : ''}">${c.avatar}</div>
          <div>
            <span>CUSTOMER PROFILE</span>
            <strong>${c.name}</strong>
            <em>${thread.profile}</em>
          </div>
          <b>${score}</b>
        </div>
        <div class="contact-profile-tags">${tags.map(t=>`<span>${t}</span>`).join('')}</div>
        <div class="contact-profile-score">
          <div><strong>${score}</strong><span>客户价值评分</span></div>
          <div><strong>${owner.replace('AI ','')}</strong><span>当前主跟进 Agent</span></div>
        </div>
        <div class="contact-detail-section"><span>AI 洞察</span><em>INSIGHT</em></div>
        <div class="contact-insight-card"><strong>${thread.insight}</strong><p>${thread.next}</p></div>
        <div class="contact-detail-section"><span>商品 / 服务匹配</span><em>MATCH</em></div>
        <div class="contact-product-match"><b>${thread.product}</b><span>${c.lastMsg || '暂无最近消息'}</span></div>
        <div class="contact-detail-section"><span>最近对话</span><em>CONTEXT</em></div>
        <div class="contact-mini-chat">
          ${(thread.messages || []).map(m=>`<div class="${m.from==='me'?'me':'them'}"><b>${m.time}</b><span>${m.text}</span></div>`).join('') || '<div><b>--</b><span>暂无对话记录，等待消息页同步。</span></div>'}
        </div>
        <div class="contact-agent-actions">
          <button data-action="open" data-target="chat-single:${c.id}">进入对话</button>
          <button data-action="open-agent-config" data-agent="${owner==='AI 客服助手'?'cust':'sales'}">配置${owner.replace('AI ','')}</button>
        </div>
        <div class="sub-safe-space"></div>
      </div>`;
  },

  /* ============ 会议：AI 沟通沉淀工作流 ============ */
  'meeting-list': () => {
    const enriched = MEETINGS.map((m, index) => {
      const summary = MEETING_SUMMARY[m.id] || {};
      const meta = [
        ['m01', '销售策略会', 'Q3 转化目标 / Agent 配置 / 预算确认', '销售会议', '高', 'AI 将自动生成 Q3 跟进计划', '陈志远', '15:30', 'meet-sales'],
        ['m02', '产品协同会', '客户反馈 / Bug 优先级 / 下版节奏', '内部协同', '中', '等待产品经理确认 2 条需求', '产品经理-张', '18:00', 'meet-product'],
        ['m03', '运营复盘会', '618 复盘 / 私域转化 / 待办追踪', '复盘沉淀', '已归档', '4 条待办已进入 Agent 跟进池', '运营-阿明', '11:30', 'meet-review']
      ].find(x => x[0] === m.id) || [];
      return { m, summary, meta, index };
    });
    const stats = [
      ['本周沟通', '12', 'MEETINGS'],
      ['AI 纪要', '9', 'SUMMARIES'],
      ['待办沉淀', '27', 'ACTIONS'],
      ['客户意图', '6', 'INTENTS']
    ];
    const pipeline = [
      ['会前', '客户资料 / 议程 / 风险点', '准备'],
      ['会中', '录音转写 / 发言分离 / 意图识别', '记录'],
      ['会后', '纪要 / 待办 / 销售跟进同步', '沉淀']
    ];
    return `
      <div class="phone-view meeting-ops-view" data-view="meeting-list">
        <div class="meeting-ops-hero">
          <span>MEETING INTELLIGENCE</span>
          <strong>会议不是日程，是客户沟通资产</strong>
          <em>销售会议、客户沟通、运营复盘由 AI 会议助手自动录音、总结、拆待办，并回流给销售/客服助手。</em>
        </div>

        <div class="meeting-ops-stats">
          ${stats.map(([n,v,k]) => `<div><em>${k}</em><strong>${v}</strong><span>${n}</span></div>`).join('')}
        </div>

        <div class="meeting-ops-pipeline">
          ${pipeline.map(([stage,desc,label], i) => `
            <div class="meeting-pipe-step s${i+1}">
              <b>${i+1}</b><strong>${stage}</strong><span>${desc}</span><em>${label}</em>
            </div>
          `).join('')}
        </div>

        <div class="meeting-ops-section-title"><span>SALES MEETING QUEUE</span><strong>会议沉淀队列</strong></div>
        <div class="meeting-ops-list">
          ${enriched.map(({m, summary, meta}) => `
            <div class="meeting-ops-card ${meta[8]}" data-action="open" data-target="meeting-ops-detail:${m.id}">
              <div class="meeting-ops-card-top">
                <div><em>${meta[3]}</em><strong>${m.title}</strong></div>
                <b>${meta[4]}</b>
              </div>
              <p>${meta[2]}</p>
              <div class="meeting-ops-meta">
                <span>${m.startTime.slice(5,16)}</span><span>${m.duration} 分钟</span><span>${m.attendees} 人</span>
              </div>
              <div class="meeting-ops-ai">
                <i>AI</i><span>${meta[5]}</span>
              </div>
            </div>
          `).join('')}
        </div>

        <div class="meeting-ops-actions">
          <button data-action="open-agent-config" data-agent="meet">配置会议助手</button>
          <button data-action="open" data-target="agent-center">Agent Center</button>
        </div>
        <div class="meeting-ops-safe"></div>
      </div>
    `;
  },

  /* ============ 会议沉淀详情 ============ */
  'meeting-ops-detail': (mid) => {
    const m = MEETINGS.find(x => x.id === mid) || MEETINGS[0];
    const s = MEETING_SUMMARY[mid] || MEETING_SUMMARY.m03 || {};
    const profile = {
      m01: ['销售策略会', '客户转化策略', 'AI 销售助手', '会后 2 小时内生成 Q3 私域转化跟进表', '3 个销售决策待确认'],
      m02: ['产品协同会', '需求与交付', 'AI 客服助手', '把客户反馈整理成 FAQ 与售后规则', '2 条产品风险需同步'],
      m03: ['运营复盘会', '复盘与待办', 'AI 会议助手', '待办已进入 Agent 跟进池，按负责人追踪', '4 条行动项已沉淀']
    }[m.id] || ['会议沉淀', '沟通记录', 'AI 会议助手', '会议资料待补齐', '待分析'];
    const actions = (s.actions && s.actions.length ? s.actions : [
      {task:'补齐客户背景与预算信息', owner:m.organizer, deadline:'会后 24 小时', priority:'P1'},
      {task:'生成下一轮沟通话术', owner:'AI 销售助手', deadline:'自动', priority:'AI'}
    ]).slice(0,4);
    const points = (s.keyPoints && s.keyPoints.length ? s.keyPoints : m.agenda || []).slice(0,4);
    return `
      <div class="phone-view meeting-ops-detail" data-view="meeting-ops-detail" data-mid="${m.id}">
        <div class="meeting-detail-hero">
          <span>${profile[0]}</span>
          <strong>${m.title}</strong>
          <em>${m.startTime} · ${m.duration} 分钟 · ${m.attendees} 人</em>
        </div>
        <div class="meeting-detail-intent">
          <div><span>COMMUNICATION TYPE</span><strong>${profile[1]}</strong></div>
          <div><span>OWNER AGENT</span><strong>${profile[2]}</strong></div>
        </div>
        <div class="meeting-detail-card dark">
          <span>AI FOLLOW-UP</span>
          <strong>${profile[4]}</strong>
          <p>${profile[3]}</p>
        </div>
        <div class="meeting-detail-section"><span>SUMMARY</span><strong>AI 会议摘要</strong></div>
        <div class="meeting-detail-note">${s.overview || '会议摘要待生成，会议助手会在录音结束后自动整理关键议题、客户意图和待办。'}</div>
        <div class="meeting-detail-section"><span>KEY POINTS</span><strong>关键讨论点</strong></div>
        <div class="meeting-point-list">
          ${points.map((p,i) => `<div><b>${String(i+1).padStart(2,'0')}</b><span>${p}</span></div>`).join('')}
        </div>
        <div class="meeting-detail-section"><span>ACTION ITEMS</span><strong>待办沉淀</strong></div>
        <div class="meeting-action-list">
          ${actions.map(a => `<div><b>${a.priority}</b><span>${a.task}</span><em>${a.owner} · ${a.deadline}</em></div>`).join('')}
        </div>
        <div class="meeting-detail-actions">
          <button data-action="open-meeting-summary" data-mid="${m.id}">查看完整纪要</button>
          <button data-action="open-agent-config" data-agent="meet">配置会议助手</button>
        </div>
        <div class="meeting-ops-safe"></div>
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

  /* ============ 我的：私域运营工作台 ============ */
  'profile': () => {
    const d = PROFILE_DATA;
    const agentState = (() => {
      try { return JSON.parse(localStorage.getItem('umakex_agent_state') || '{}'); }
      catch(e) { return {}; }
    })();
    const activeAgents = ['sales','cust','meet'].filter(k => agentState[k]).length || 3;
    const totalUnread = CHATS.reduce((sum, c) => sum + (c.unread || 0), 0);
    const hot = CHATS.filter(c => (c.score || 0) >= 85).length;
    const ops = [
      ['今日触达', '128', '+18', 'AI 已跟进 37 个新人'],
      ['待处理客户', '9', 'P0', '3 个高意向需人工确认'],
      ['复购机会', '24', '+6', '客服沉淀对话已回流销售'],
      ['会议待办', '11', 'AUTO', '会议助手生成 6 条行动项']
    ];
    const agentRows = [
      ['sales', 'AI 销售助手', '售前转化', '37 人跟进中', '新人资料 / 商品推荐 / 成交复盘'],
      ['cust', 'AI 客服助手', '售后维护', '16 条待确认', 'FAQ / 情绪安抚 / 复购引导'],
      ['meet', 'AI 会议助手', '会议沉淀', '3 场待总结', '录音 / 纪要 / 待办同步']
    ];
    return `
      <div class="phone-view profile-ops-view" data-view="profile">
        <div class="profile-ops-hero">
          <div class="profile-ops-kicker">PRIVATE DOMAIN OPS</div>
          <div class="profile-ops-main">
            <div class="profile-ops-avatar">${d.avatar}</div>
            <div>
              <h2>${d.name}</h2>
              <p>${d.account} · ${d.dept} · 私域运营员</p>
            </div>
          </div>
          <div class="profile-ops-summary">
            <strong>${activeAgents}/3</strong>
            <span>Agent 正在运行，销售、客服、会议数据统一沉淀到客户画像。</span>
          </div>
        </div>

        <div class="profile-ai-report-card msg-report-hero" data-action="open" data-target="ai-inbox">
          <div class="profile-ai-report-top">
            <div>
              <div class="mr-kicker">AI MARKETING REPORT</div>
              <div class="mr-main">
                <strong>昨日 AI 营销战报</strong>
                <span>${totalUnread} 条待处理 · ${hot} 个高意向 · 1 个售后风险</span>
              </div>
            </div>
            <div class="profile-ai-report-badge">查看</div>
          </div>
          <div class="mr-stats">
            <div><b>27</b><em>自动触达</em></div>
            <div><b>5</b><em>重点客户</em></div>
            <div><b>3</b><em>建议成交</em></div>
          </div>
        </div>

        <div class="profile-ops-stats">
          ${ops.map(([label,num,tag,desc]) => `
            <div class="profile-ops-stat">
              <em>${label}</em>
              <strong>${num}</strong>
              <span>${tag}</span>
              <p>${desc}</p>
            </div>
          `).join('')}
        </div>

        <div class="profile-ops-section profile-ops-agents">
          <div class="profile-ops-title"><span>AGENT RUNNING STATUS</span><strong>Agent 运行状态</strong></div>
          ${agentRows.map(([id,name,role,count,desc]) => `
            <div class="profile-agent-row ${id}" data-action="open-agent-config" data-agent="${id}">
              <div class="profile-agent-mark">${name.replace('AI ', '').slice(0,1)}</div>
              <div class="profile-agent-copy">
                <strong>${name}</strong>
                <span>${role} · ${desc}</span>
              </div>
              <div class="profile-agent-count"><em>${count}</em><b>配置</b></div>
            </div>
          `).join('')}
        </div>

        <div class="profile-ops-section profile-ops-assets">
          <div class="profile-ops-title"><span>DATA ASSETS</span><strong>数据沉淀入口</strong></div>
          <div class="profile-asset-grid">
            <div class="profile-asset-card" data-action="open" data-target="contact">
              <span>客户画像库</span><strong>6</strong><em>客户标签 / 购买意向 / 售后情绪</em>
            </div>
            <div class="profile-asset-card" data-action="open" data-target="chat-list">
              <span>对话营销战报</span><strong>5</strong><em>新人沟通 / AI 建议 / 成交机会</em>
            </div>
            <div class="profile-asset-card" data-action="open" data-target="meeting-list">
              <span>会议知识沉淀</span><strong>3</strong><em>纪要 / 待办 / 决策记录</em>
            </div>
            <div class="profile-asset-card hot" data-action="open" data-target="agent-center">
              <span>Agent Center</span><strong>3</strong><em>销售 / 客服 / 会议助手</em>
            </div>
          </div>
        </div>

        <div class="profile-ops-section profile-ops-actions">
          <button data-action="open" data-target="agent-center">进入 Agent Center</button>
          <button data-action="open" data-target="contact">查看客户资产</button>
        </div>
        <div class="profile-safe-space"></div>
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

    const configCards = AGENTS.map((a, i) => {
      const on = !!state[a.id];
      const actionText = on ? '进入配置中心' : '先配置再开通';
      return `
        <button class="ac-config-entry ${on ? 'is-on' : 'is-ready'}" type="button" data-action="open" data-target="agent-config:${a.id}" style="--agent-color:${a.color};--agent-soft:${a.colorSoft};">
          <div class="ac-config-entry-icon">${a.icon}</div>
          <div class="ac-config-entry-copy">
            <span>${String(i + 1).padStart(2, '0')} · ${a.kicker.replace('P0 · ', '').replace('P1 · ', '')}</span>
            <strong>${a.name}</strong>
            <em>${a.module}</em>
          </div>
          <b>${actionText}</b>
        </button>`;
    }).join('');

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

        <section class="ac-section ac-config-section">
          <div class="ac-section-label"><span>配置中心</span><em>SALES · SERVICE · MEETING</em></div>
          <div class="ac-config-entry-grid">${configCards}</div>
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
        kicker:'P1 · AI MEETING', title:'AI 会议助手', en:'AI MEETING · RECORD & SUMMARY',
        desc:'会议录音、转写、纪要、行动项和意图分析 Agent。把销售会议、客户沟通和运营复盘沉淀成可追踪的客户沟通资产。',
        caps:['会议录音','发言分离','关键决策','待办提取','日程同步','双语输出'],
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

    const currentId = agentId === 'grow' ? 'sales' : agentId;
    const themeName = currentId === 'meet' ? 'meeting' : currentId === 'cust' ? 'customer' : 'sales';
    const moduleNoun = currentId === 'cust' ? '管理模块' : currentId === 'meet' ? '会议配置' : '销售配置';
    const heroMetric = currentId === 'meet' ? '会议资料沉淀' : currentId === 'cust' ? '售后关系维护' : '售前营销转化';
    const capHTML = cfg.caps.map(t => `<span class="acc-cap">${t}</span>`).join('');

    return `
      <div class="phone-view agent-subpage agent-config-app acc-theme-${themeName}" data-view="agent-config" data-agent="${currentId}" style="--acc-color:${visual.color};--acc-soft:${visual.soft}">
        <div class="acc-app-hero">
          <div class="acc-app-kicker">
            <span>${cfg.kicker}</span>
            <em>${subConfigs.length} MODULES</em>
          </div>
          <div class="acc-app-main">
            <div class="acc-app-avatar">${visual.avatar}</div>
            <div class="acc-app-titleblock">
              <h2 class="acc-hero-title">${cfg.title}</h2>
              <strong>${heroMetric}</strong>
              <small>${cfg.en}</small>
            </div>
          </div>
          <p class="acc-hero-desc">${cfg.desc}</p>
          <div class="acc-caps">
            <h4>核心能力</h4>
            <div>${capHTML}</div>
          </div>
        </div>

        <div class="acc-section acc-app-section">
          <div class="acc-section-label acc-app-section-label">
            <span>${moduleNoun}</span>
            <em>点击进入对应配置</em>
          </div>
          <div class="acc-config-list">
            ${subConfigs.map((c, idx) => `
              <div class="acc-config-row ${idx === 0 ? 'is-primary' : ''}" data-action="open" data-target="${c[4]}">
                <div class="acc-config-index">${String(idx + 1).padStart(2, '0')}</div>
                <div class="acc-config-icon">${c[0]}</div>
                <div class="acc-config-copy">
                  <strong>${c[1]}</strong>
                  <span>${c[2]}</span>
                  <em>${c[3]}</em>
                </div>
                <b>›</b>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="sub-safe-space"></div>
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


  /* ============ AI 自动沟通场景库 ============ */
  'chat-demo': (sid) => {
    const demo = getAiScenarioDemo(sid || 'silent');
    const c = { id:`scene-${demo.id}`, name:demo.name, avatar:demo.avatar || '客', agent:demo.agent, score:demo.score };
    return `
      <div class="phone-view marketing-chat-detail ai-demo-chat ai-scene-demo" data-view="chat-demo" data-sid="${demo.id}">
        <div class="ai-demo-brief scene-demo-brief">
          <div class="demo-brief-head">
            <div>
              <span>${demo.agent}</span>
              <strong>${demo.title}</strong>
              <em>${demo.scene}</em>
            </div>
            <b>${demo.score}</b>
          </div>
          <div class="demo-brief-tags">
            ${demo.tags.map(t => `<i>${t}</i>`).join('')}
          </div>
          <div class="demo-brief-next"><span>SCENE</span>${demo.goal}</div>
        </div>

        <div class="ai-demo-stage" id="aiScenarioStage-${demo.id}">
          <div class="bubble-time demo-time">场景演示 · ${demo.agent} 自动处理 ${demo.title}</div>
          ${demo.steps.map((step, idx) => renderAiDemoStep(step, idx, c, demo)).join('')}
          <div class="ai-demo-result demo-step" style="--d:${demo.doneDelay}s;">
            <span>本轮结果</span>
            <strong>${demo.result.main}</strong>
            <div>${demo.result.items.map(it => `<em>${it}</em>`).join('')}</div>
          </div>
          <div class="sub-safe-space"></div>
        </div>

        <div class="ai-copilot-bar">
          <div>
            <span class="live-dot"></span>
            <strong>${demo.agent} 托管中</strong>
            <em>${demo.strategy}</em>
          </div>
          <button>人工接管</button>
        </div>
      </div>
    `;
  },

  /* ============ 真人单聊：AI 自动沟通演示 ============ */
  'chat-single': (cid) => {
    const c = getContact(cid) || CONTACTS[0];
    const thread = (typeof CUSTOMER_THREADS !== 'undefined' && CUSTOMER_THREADS[c.id])
      ? CUSTOMER_THREADS[c.id]
      : { profile: c.dept || '客户资料待补充', insight: '暂无 AI 洞察', product: '待匹配商品', next: '继续跟进客户需求。', messages: CHAT_WITH_NATSUME };
    if (c.id === 'official-service') {
      return `
        <div class="phone-view official-service-chat" data-view="chat-single" data-cid="${c.id}">
          <div class="official-chat-hero">
            <div class="official-chat-avatar">官</div>
            <div>
              <span>OFFICIAL SERVICE</span>
              <strong>公司官方客服</strong>
              <em>产品咨询 / 售后处理 / 资料领取，AI 客服在线先答。</em>
            </div>
          </div>
          <div class="chat-page-body official-chat-body" id="agentChatBody-agent-customer">
            <div class="bubble-time">官方客服已接入 · 可直接提问</div>
            ${(thread.messages || []).map(m => `
              <div class="msg-row ${m.from === 'them' ? 'me' : 'them'} ${m.from === 'me' ? 'agent-msg-row' : ''}">
                ${m.from === 'me' ? '<div class="msg-avatar agent">官</div>' : ''}
                <div class="bubble ${m.from === 'them' ? 'me' : 'them'}">${m.text}</div>
              </div>
            `).join('')}
          </div>
          <div class="official-quick-prompts">
            ${['你们适合哪些客户？','我要查订单售后','给我产品资料','怎么转人工？'].map(p => `<button data-action="quick-prompt" data-agent="agent-customer" data-text="${p}">${p}</button>`).join('')}
          </div>
          <div class="chat-input-bar official-chat-input">
            <div class="icon-btn">🎤</div>
            <input type="text" class="msg-input" id="agentInput-agent-customer" placeholder="向公司官方客服提问..." data-agent="agent-customer">
            <div class="icon-btn">😊</div>
            <button class="send-btn" data-action="send-agent" data-agent="agent-customer">发送</button>
          </div>
        </div>
      `;
    }
    const relatedChat = CHATS.find(x => x.contactId === c.id) || {};
    const demo = getAiDemoThread(c, thread, relatedChat);
    return `
      <div class="phone-view marketing-chat-detail ai-demo-chat" data-view="chat-single" data-cid="${c.id}">
        <div class="ai-demo-brief">
          <div class="demo-brief-head">
            <div>
              <span>${demo.agent}</span>
              <strong>${c.name}</strong>
              <em>${demo.scene}</em>
            </div>
            <b>${demo.score}</b>
          </div>
          <div class="demo-brief-tags">
            ${demo.tags.map(t => `<i>${t}</i>`).join('')}
          </div>
          <div class="demo-brief-next"><span>AI 托管中</span>${demo.goal}</div>
        </div>

        <div class="ai-demo-stage" id="aiDemoStage-${c.id}">
          <div class="bubble-time demo-time">自动演示 · ${demo.agent} 正在替你沟通</div>
          ${demo.steps.map((step, idx) => renderAiDemoStep(step, idx, c, demo)).join('')}
          <div class="ai-thinking-card ai-core-scene demo-step" style="--d:3.9s;">
            <span>CORE SCENE</span>
            <strong>${demo.insight}</strong>
            <em>AI 会读取资料、思考策略，再自动回复客户。</em>
          </div>
          <div class="ai-demo-done demo-step" style="--d:${demo.doneDelay}s;">
            <span>AI 已完成本轮回复</span>
            <strong>${demo.done}</strong>
          </div>
          <div class="sub-safe-space"></div>
        </div>

        <div class="ai-copilot-bar">
          <div>
            <span class="live-dot"></span>
            <strong>${demo.agent} 托管中</strong>
            <em>${demo.strategy}</em>
          </div>
          <button>人工接管</button>
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



function renderAiSceneChip(scene) {
  return `
    <button class="ai-scene-chip" data-action="open" data-target="chat-demo:${scene.id}">
      <b>${scene.no}</b>
      <strong>${scene.title}</strong>
      <span>${scene.tag}</span>
      <em>${scene.desc}</em>
    </button>
  `;
}

function getAiScenarioDemo(id) {
  const demos = {
    silent: {
      id:'silent', title:'沉默唤醒', name:'小雅', avatar:'雅', agent:'AI 销售助手', scene:'高意向客户 3 天未回复', score:84,
      tags:['沉默客户','曾问价格','轻压力触达'], strategy:'轻提醒 + 选择题唤醒',
      goal:'客户不回不是拒绝，AI 自动换低压力话术重新触达。',
      result:{main:'Agent 输出：客户重新进入可跟进队列', items:['客户阶段：沉默 → 已回应','意向分：76 → 84','下一步：等待 A/B 选择','写入画像：价格谨慎 / 可低门槛转化','人工建议：无需接管']},
      steps:[
        {type:'customer', text:'我先考虑一下，晚点再说。'},
        {type:'thinking', lines:['✓ 识别意图：客户进入沉默期','✓ 读取历史：曾咨询体验装价格','● 生成策略：轻提醒，不制造压力']},
        {type:'ai', text:'小雅，前几天你问的体验装我帮你保留了。你不用现在决定，我先把两种方式发你。'},
        {type:'customer', text:'哪两种方式？我主要怕自己坚持不下来。'},
        {type:'thinking', lines:['✓ 捕捉真实顾虑：执行风险','✓ 匹配话术：降低心理门槛','● 输出回复：给选择题，不逼单']},
        {type:'ai', text:'A 是先体验流程，B 是直接看升级方案。你可以先选 A，我按每天 30 分钟的节奏带你走。'},
        {type:'customer', text:'如果我每天只有晚上有时间，也可以吗？'},
        {type:'thinking', lines:['✓ 识别约束：时间有限','✓ 调用新人 SOP：碎片时间任务','● 生成回复：给可执行计划']},
        {type:'ai', text:'可以。晚上 30 分钟就够，第一周只做三件事：发素材、回咨询、记录意向客户。'},
        {type:'customer', text:'那你先把体验流程发我，我看一下。'},
        {type:'thinking', lines:['✓ 识别信号：重新激活成功','✓ 更新阶段：沉默 → 可跟进','● 下一步：发送体验流程并标记提醒']},
        {type:'ai', text:'好，我把体验流程和第一天任务发你。你先看，我明晚再提醒你完成第一步。'}
      ]
    },
    price: {
      id:'price', title:'价格异议', name:'阿敏', avatar:'敏', agent:'AI 销售助手', scene:'客户觉得价格偏高', score:78,
      tags:['价格敏感','价值解释','低门槛方案'], strategy:'拆分成本 + 不压迫成交',
      goal:'识别“太贵了”背后的风险担心，切换到低门槛方案。',
      result:{main:'Agent 输出：客户从拒绝转为愿意先看体验装', items:['客户阶段：观望 → 可试单','意向分：68 → 81','下一步：发送体验装链接','写入画像：价格敏感 / 风险谨慎','人工建议：无需接管']},
      steps:[
        {type:'customer', text:'感觉还是有点贵，我怕做不起来。'},
        {type:'thinking', lines:['✓ 识别异议：价格敏感','✓ 判断真实顾虑：怕卖不出去','● 生成策略：先认同，不急着降价']},
        {type:'ai', text:'我理解，你不是觉得没价值，而是担心投入后做不起来。所以我不建议你一开始上高配版。'},
        {type:'customer', text:'对，我就是怕买了以后放在那里。'},
        {type:'thinking', lines:['✓ 顾虑确认：执行风险','✓ 匹配商品：体验装','● 回复目标：降低试错成本']},
        {type:'ai', text:'那你更适合先用体验装跑一遍流程。先验证能不能聊到客户，再决定要不要升级。'},
        {type:'customer', text:'体验装后面能抵扣吗？不然还是有点浪费。'},
        {type:'thinking', lines:['✓ 调用规则：体验装抵扣升级','✓ 处理浪费顾虑','● 生成承诺型回复']},
        {type:'ai', text:'可以抵扣升级。也就是说你不是额外花一笔钱，而是先用低门槛确认自己适不适合。'},
        {type:'customer', text:'那你发我体验装和升级规则，我看清楚点。'},
        {type:'thinking', lines:['✓ 识别成交推进信号','✓ 更新阶段：价格异议已缓解','● 下一步：发送链接 + 规则说明']},
        {type:'ai', text:'好，我把体验装链接、抵扣规则和第一周执行流程一起发你，你按这个看最清楚。'}
      ]
    },
    close: {
      id:'close', title:'成交推进', name:'何总', avatar:'何', agent:'AI 销售助手', scene:'客户询问付款方式', score:96,
      tags:['强成交信号','付款方式','下单指引'], strategy:'立即推进 + 下单说明',
      goal:'客户问“怎么付款”时，AI 自动抓住成交窗口。',
      result:{main:'Agent 输出：客户进入下单流程', items:['客户阶段：强意向 → 待支付','意向分：88 → 96','下一步：发送支付方式','写入画像：企业采购 / 快速决策','人工建议：成交后跟进开通']},
      steps:[
        {type:'customer', text:'那我要怎么付款？'},
        {type:'thinking', lines:['✓ 识别意图：强成交信号','✓ 判断阶段：准备下单','● 生成动作：支付方式 + 注意事项']},
        {type:'ai', text:'可以的，我现在发你下单方式。你先选体验装版本，下单后我会帮你开通新人流程。'},
        {type:'customer', text:'如果我们团队一起用，是不是要另外开权限？'},
        {type:'thinking', lines:['✓ 识别需求：团队使用','✓ 匹配权益：项目方 / 成员权限','● 回复目标：避免客户下错版本']},
        {type:'ai', text:'如果团队一起用，我建议先按项目方方案开通。这样成员、订单和分润都能在后台统一看。'},
        {type:'customer', text:'那我先付体验版，后面能升级团队版吗？'},
        {type:'thinking', lines:['✓ 调用升级规则','✓ 判断客户偏谨慎','● 生成升级路径说明']},
        {type:'ai', text:'可以。你先体验版跑通流程，确认团队要用后再升级团队版，前面的费用可以按规则抵扣。'},
        {type:'customer', text:'行，你把付款和升级说明发我。'},
        {type:'thinking', lines:['✓ 标记：待支付','✓ 生成：付款说明 + 升级路径','● 安排：支付后开通提醒']},
        {type:'ai', text:'我现在发你。付款后我会同步第一天开通步骤，团队版升级说明也一起给你留好。'}
      ]
    },
    complaint: {
      id:'complaint', title:'投诉安抚', name:'刘女士', avatar:'刘', agent:'AI 客服助手', scene:'发货慢引发不满', score:62,
      tags:['负面情绪','物流问题','转人工判断'], strategy:'先道歉 + 明确时限 + 必要转人工',
      goal:'客户情绪变差时，AI 先稳住，再同步人工避免升级。',
      result:{main:'Agent 输出：投诉风险被压低并同步人工', items:['风险等级：高 → 中','客户情绪：不满 → 接受处理','下一步：同步物流和补偿','写入画像：时效敏感 / 不愿重复说明','人工建议：需要关注']},
      steps:[
        {type:'customer', text:'你们这个发货太慢了，我有点不想要了。'},
        {type:'thinking', lines:['✓ 识别情绪：不满 / 可能退款','✓ 提升优先级：高','● 回复策略：先道歉 + 给明确处理时间']},
        {type:'ai', text:'真的不好意思，这次让你等久了。我先查物流；如果今天没有更新，我直接帮你申请补偿。'},
        {type:'customer', text:'我不想再等，也不想重复说一遍。'},
        {type:'thinking', lines:['✓ 识别诉求：减少沟通成本','✓ 动作：沉淀工单摘要','● 回复目标：承诺不重复说明']},
        {type:'ai', text:'不会让你重复说明。我已经把订单、问题和诉求整理好，后面客服会接着这个记录处理。'},
        {type:'customer', text:'那如果今天物流还是没动呢？'},
        {type:'thinking', lines:['✓ 识别升级条件：当天无物流','✓ 调用售后 SOP：补偿 / 补发 / 退款路径','● 给出明确兜底方案']},
        {type:'ai', text:'如果今天还没有更新，我会直接给你走补偿方案；需要补发或退款，也会按这个工单继续处理。'},
        {type:'customer', text:'好，那你今天帮我盯一下。'},
        {type:'thinking', lines:['✓ 情绪缓和','✓ 设置提醒：今日物流跟进','● 同步人工：高优先级工单']},
        {type:'ai', text:'好，我已经设了今天的物流提醒。只要状态变化，我会第一时间同步你，不用你再来催。'}
      ]
    },
    repurchase: {
      id:'repurchase', title:'复购提醒', name:'老陈', avatar:'陈', agent:'AI 客服助手', scene:'购买周期接近复购窗口', score:82,
      tags:['老客户','订单周期','专属券'], strategy:'补货提醒 + 专属券',
      goal:'AI 根据历史订单主动发现复购机会，而不是等客户来问。',
      result:{main:'Agent 输出：复购机会已生成', items:['客户阶段：老客户 → 复购机会','意向分：74 → 85','下一步：发送同款补货组合','写入画像：偏好基础款 / 对优惠敏感','人工建议：无需接管']},
      steps:[
        {type:'customer', text:'最近有老客户活动吗？'},
        {type:'thinking', lines:['✓ 读取订单：上次购买已 28 天','✓ 识别周期：接近复购窗口','● 匹配策略：补货提醒 + 老客户券']},
        {type:'ai', text:'你上次买的那套应该快用完了。我看你更喜欢基础款，这次可以直接补同款。'},
        {type:'customer', text:'我确实快用完了，但不知道要不要换升级款。'},
        {type:'thinking', lines:['✓ 识别选择犹豫','✓ 读取偏好：基础款复购率高','● 回复目标：先补同款，再轻推升级']},
        {type:'ai', text:'如果你用基础款很顺，我建议先补同款。升级款我可以给你放在对比里，不急着换。'},
        {type:'customer', text:'那有优惠券的话发我看看。'},
        {type:'thinking', lines:['✓ 客户接受优惠触达','✓ 匹配券包：老客户复购券','● 生成补货组合']},
        {type:'ai', text:'有一张老客户券今天可用。我把同款补货组合和券一起发你，直接下单最划算。'},
        {type:'customer', text:'可以，再把升级款区别也放一起。'},
        {type:'thinking', lines:['✓ 识别交叉销售机会','✓ 生成对比：基础款 vs 升级款','● 下一步：发送组合 + 对比表']},
        {type:'ai', text:'好，我给你发两个选项：同款补货省心版，以及升级款对比版。你看完再决定。'}
      ]
    },
    'meeting-follow': {
      id:'meeting-follow', title:'会后跟进', name:'王总', avatar:'王', agent:'AI 销售助手', scene:'会议助手 → 销售助手协同', score:90,
      tags:['会议纪要','方案跟进','Agent 协同'], strategy:'读取纪要 + 自动生成会后话术',
      goal:'会议助手提炼客户关注点，销售助手自动发会后跟进。',
      result:{main:'Agent 输出：会后跟进已完成', items:['客户阶段：会议沟通 → 方案确认','意向分：82 → 91','下一步：确认排期和版本','写入画像：关注交付 / 售后 / 团队权限','人工建议：15 分钟内跟进']},
      steps:[
        {type:'customer', text:'刚才会议里提到的交付周期和售后支持，你整理一下。'},
        {type:'thinking', lines:['✓ 读取 AI 会议纪要','✓ 识别关注点：价格 / 交付周期 / 售后支持','● 销售助手生成会后跟进话术']},
        {type:'ai', text:'刚才会议里你重点提到交付周期和售后支持。我把方案整理成 3 点发你。'},
        {type:'customer', text:'可以，先发我看看。团队权限也一起写清楚。'},
        {type:'thinking', lines:['✓ 增补关注点：团队权限','✓ 生成结构：交付 / 售后 / 权限','● 输出会后摘要']},
        {type:'ai', text:'第一是交付时间，第二是售后保障，第三是团队权限。我会按这三块整理成一版确认稿。'},
        {type:'customer', text:'交付时间如果压到两周内可以吗？'},
        {type:'thinking', lines:['✓ 识别关键约束：两周交付','✓ 查询交付风险：需要确认排期','● 回复策略：不盲目承诺，先给排期确认']},
        {type:'ai', text:'两周内可以作为目标，但我需要帮你确认排期。今天我先把可交付范围和风险点列出来。'},
        {type:'customer', text:'好，那你发我一版，我下午给团队看。'},
        {type:'thinking', lines:['✓ 标记：方案确认前','✓ 生成下一步：下午前发送版本','● 同步会议待办给销售']},
        {type:'ai', text:'收到。我会在下午前发你确认版，里面包含交付周期、售后支持、团队权限和风险说明。'}
      ]
    }
  };
  const picked = demos[id] || demos.silent;
  const steps = picked.steps || [];
  return {...picked, longMode:true, doneDelay:(steps.length * 1.05 + 1.4).toFixed(1)};
}

function getAiDemoThread(c, thread, relatedChat) {
  const base = {
    agent: c.agent || relatedChat.aiAgent || 'AI 销售助手',
    scene: c.dept || '私域客户沟通',
    score: c.score || relatedChat.score || 72,
    tags: [c.intent || relatedChat.aiTag || 'AI识别', c.stage || '跟进中', c.source || '私域'].slice(0,3),
    strategy: relatedChat.aiNext || thread.next || '根据客户意图生成下一步话术',
    insight: thread.insight || 'AI 正在读取客户画像并匹配沟通策略。',
    goal: thread.next || '继续跟进客户需求。',
    done: '已沉淀本轮客户意图，等待下一次客户回复。'
  };
  const demos = {
    'official-service': {
      agent:'AI 客服助手', scene:'官方客服 · 用户主动提问', score:100,
      tags:['官方在线','产品咨询','售后入口'], strategy:'先识别问题类型，再引用官方资料回答',
      goal:'用户在通讯录置顶入口直接提问，AI 客服先响应，复杂问题再转人工。',
      insight:'官方客服不是普通客户画像，而是公司对外服务入口。AI 会根据问题自动分流到产品咨询、售后、资料领取或人工。',
      done:'官方客服已完成首轮答疑，并给出下一步提问入口。', doneDelay:'7.2s',
      steps:[
        {type:'ai', text:'您好，我是公司官方客服。产品咨询、订单售后、资料领取都可以直接问我。'},
        {type:'customer', text:'我想了解一下你们的服务适合哪些客户？'},
        {type:'thinking', lines:['✓ 识别问题：产品适用人群','✓ 调用官方资料：AI 智能对话营销 IM','● 生成回答：按业务场景说明']},
        {type:'ai', text:'适合需要私域沟通、客户跟进、AI 自动回复和会后纪要沉淀的团队。比如销售团队、客服团队、招商团队都能用。'},
        {type:'customer', text:'如果我要售后或者订单问题，也是在这里问吗？'},
        {type:'thinking', lines:['✓ 识别二级问题：售后入口','✓ 调用客服规则：订单 / 物流 / 发票 / 投诉','● 回复目标：给明确服务范围']},
        {type:'ai', text:'可以。订单、物流、发票、退款、投诉都可以在这里问。AI 会先帮你查询和整理，复杂问题再转人工客服。'}
      ]
    },
    u01: {
      agent:'AI 销售助手', scene:'体验装升级 · 宝妈副业', score:92,
      tags:['高意向','宝妈','预算谨慎'], strategy:'信任建立型 + 低门槛促单',
      insight:'AI 识别到客户想了解副业，但对投入和风险敏感。',
      goal:'解释体验装可抵扣升级，降低首次尝试门槛。',
      done:'客户已进入「高意向 · 可继续成交推进」队列。',
      steps:[
        {type:'customer', text:'我看你朋友圈发的那个副业项目，是怎么做的呀？'},
        {type:'thinking', lines:['读取客户资料：宝妈 / 副业兴趣 / 预算谨慎','匹配策略：信任建立型 + 低门槛促单','回复目标：先建立安全感，不直接逼单']},
        {type:'ai', text:'小夏，这个项目适合碎片时间做副业。你可以先从体验装开始，不用一开始投入很多。'},
        {type:'customer', text:'如果先拿体验装，后面能补差价升级吗？'},
        {type:'thinking', lines:['识别成交卡点：怕浪费 / 怕升级成本','调用规则：体验装金额可抵扣升级','下一步：给出明确承诺和升级路径']},
        {type:'ai', text:'可以的，体验装金额后面能抵扣升级。你先体验流程，确定适合再升级，这样风险更低。'}
      ]
    },
    u02: {
      agent:'AI 销售助手', scene:'招商咨询 · 团队结算', score:86,
      tags:['项目方','社群主理人','佣金规则'], strategy:'专家顾问型 + 规则解释',
      insight:'AI 判断客户不是普通买家，而是在评估团队合作和项目方权益。',
      goal:'解释团队结算方式，并引导申请项目方权益。',
      done:'已生成招商跟进记录，建议推送项目方权益说明。',
      steps:[
        {type:'customer', text:'佣金规则我看懂了，想知道团队怎么结算。'},
        {type:'thinking', lines:['读取身份：社群主理人 / 团队资源','匹配策略：先讲结算，再讲权益','回复目标：降低规则理解成本']},
        {type:'ai', text:'周总，团队结算可以按个人业绩和团队分润两层看。我先把佣金比例、结算周期和项目方权益分开讲清楚。'},
        {type:'customer', text:'如果我拉 20 个人进来，后台能看到每个人的数据吗？'},
        {type:'thinking', lines:['识别需求：团队管理后台','匹配卖点：成员数据 / 订单 / 分润','下一步：引导预约项目方方案']},
        {type:'ai', text:'可以看。后台会沉淀成员、订单、分润和跟进状态。您如果要带 20 人，我建议直接按项目方方案配置。'}
      ]
    },
    u03: {
      agent:'AI 客服助手', scene:'售后安抚 · 补发赠品', score:68,
      tags:['售后问题','情绪安抚','复购券'], strategy:'先安抚 + 补偿 + 复购引导',
      insight:'AI 客服识别到客户不满来自漏发赠品，适合先补发再轻推复购券。',
      goal:'稳定客户情绪，完成补发，并把复购机会回流给销售助手。',
      done:'售后已完成安抚，客户被标记为「可复购」。',
      steps:[
        {type:'customer', text:'昨天拍的套装少了一个赠品。'},
        {type:'thinking', lines:['识别问题：漏发赠品 / 售后不满','匹配客服策略：先道歉，再给解决方案','调用规则：补发赠品 + 复购券']},
        {type:'ai', text:'婉婷，不好意思，这个我马上帮你处理。赠品今天给你补发，同时给你补一张复购券。'},
        {type:'customer', text:'那大概什么时候能发？'},
        {type:'thinking', lines:['客户关注时效','查询售后 SOP：当日登记 / 次日发出','下一步：给明确时间，避免情绪升级']},
        {type:'ai', text:'我现在就登记，正常明天发出。发出后我会把单号同步给你，这次不用你再重复提交信息。'}
      ]
    },
    u04: {
      agent:'AI 销售助手', scene:'群转化 · 价格敏感识别', score:79,
      tags:['新人群','价格敏感','批量私聊'], strategy:'群内低门槛解释 + 重点客户私聊',
      insight:'AI 在新人群里识别到 3 个价格敏感用户，适合群内统一解释，再私聊重点人群。',
      goal:'群内发送低门槛体验装话术，并对 3 人单独私聊。',
      done:'已识别 3 个私聊对象，并生成群内低门槛解释话术。',
      steps:[
        {type:'customer', text:'群里有人问：这个是不是一开始就要囤很多货？'},
        {type:'thinking', lines:['扫描群聊：23 人新人培育群','识别关键词：囤货 / 投入 / 怕亏','策略：公开解释低门槛，再私聊高意向用户']},
        {type:'ai', text:'大家不用一开始囤很多货。新人可以先从体验装开始，先熟悉流程和话术，再决定要不要升级。'},
        {type:'customer', text:'有 3 个人又追问体验装价格。'},
        {type:'thinking', lines:['标记 3 个价格敏感用户','生成私聊开场白','同步销售助手：逐个跟进']},
        {type:'ai', text:'我已经标记这 3 位用户，会逐个私聊解释体验装、升级抵扣和适合人群，避免群里反复刷屏。'}
      ]
    },
    u05: {
      agent:'AI 销售助手', scene:'大单机会 · 企业采购方案', score:95,
      tags:['高净值','企业采购','15:00 预约'], strategy:'方案整理 + 会议前预热',
      insight:'AI 判断客户已进入大单决策阶段，重点是提前整理采购方案和 ROI 逻辑。',
      goal:'在 15:00 前输出企业采购方案，并引导客户确认决策人。',
      done:'企业采购方案已准备，建议 15:00 人工接管成交沟通。',
      steps:[
        {type:'customer', text:'我下午三点有空，你让 AI 先整理一下方案。'},
        {type:'thinking', lines:['读取客户画像：高净值 / 企业采购','匹配策略：方案型成交','准备材料：采购清单 / ROI / 交付周期']},
        {type:'ai', text:'赵总，可以。我先按企业采购场景整理一版方案，包含产品组合、预算区间和交付节奏。'},
        {type:'customer', text:'重点帮我看一下团队使用和售后保障。'},
        {type:'thinking', lines:['识别决策重点：团队使用 / 售后保障','调用资料：企业版服务承诺','下一步：确认决策人和会议时间']},
        {type:'ai', text:'明白。我会把团队账号、培训支持和售后保障单独列出来。15:00 沟通时，也建议您把最终决策人一起拉上。'}
      ]
    }
  };
  const picked = demos[c.id] || {
    ...base,
    steps:[
      {type:'customer', text:(thread.messages && thread.messages[0] && thread.messages[0].text) || c.lastMsg || '这个具体怎么操作？'},
      {type:'thinking', lines:['读取客户画像与历史对话','匹配标签策略与商品卖点','生成本轮建议回复']},
      {type:'ai', text:thread.next || '我先根据你的情况给你一个低门槛方案，你可以看完再决定是否继续。'},
      {type:'customer', text:'可以，你先发我看看。'},
      {type:'thinking', lines:['客户允许继续沟通','记录意向变化','准备下一轮跟进']},
      {type:'ai', text:'好的，我把重点整理成 3 点发你：适合人群、前期投入和后续升级路径。你看完有疑问我再逐条解释。'}
    ]
  };
  const steps = picked.steps || base.steps || [];
  return {...base, ...picked, steps, doneDelay: (steps.length * .72 + .9).toFixed(1)};
}

function renderAiDemoStep(step, idx, c, demo) {
  const delay = ((demo.longMode ? idx * 1.05 : idx * .72) + .18).toFixed(1);
  if (step.type === 'thinking') {
    return `
      <div class="ai-thinking-card ai-demo-loading demo-step" style="--d:${delay}s;">
        <span>${demo.agent} 正在思考</span>
        <div class="ai-thinking-dots"><i></i><i></i><i></i></div>
        ${step.lines.map(line => `<em>${line}</em>`).join('')}
      </div>
    `;
  }
  const isCustomer = step.type === 'customer';
  return `
    <div class="msg-row ${isCustomer ? 'them' : 'me'} ai-demo-msg demo-step" style="--d:${delay}s;">
      ${isCustomer ? `<div class="msg-avatar">${c.avatar}</div>` : `<div class="msg-agent-badge">AI</div>`}
      <div class="bubble ${isCustomer ? 'them' : 'me'}">
        ${!isCustomer ? `<b>${demo.agent}</b>` : ''}
        <span>${step.text}</span>
      </div>
    </div>
  `;
}

/* === 视图辅助函数 === */

function renderCompanyChannelPinned() {
  return `
    <a class="company-pinned-msg" data-action="open" data-target="company-channel:all">
      <div class="company-pinned-avatar">${COMPANY_CHANNEL.avatar}</div>
      <div class="company-pinned-body">
        <div class="company-pinned-top"><strong>${COMPANY_CHANNEL.companyName}</strong><span>置顶</span></div>
        <p>${COMPANY_CHANNEL.latest}</p>
        <em>项目文章 / 招商资料 / 产品素材 · ${COMPANY_CHANNEL.unread} 条更新</em>
      </div>
      <div class="company-pinned-side"><b>${COMPANY_CHANNEL.updatedAt}</b><i>${COMPANY_CHANNEL.unread}</i></div>
    </a>
  `;
}

function renderCompanyCover(article, project) {
  const cover = article.cover || { mark: project.icon, tone: 'red', title: article.tag, src: '' };
  const src = cover.src || 'assets/company-channel/live.jpg';
  return `
    <div class="company-cover-art tone-${cover.tone || 'red'} has-real-image">
      <img src="${src}" alt="${article.title}" loading="eager" />
      <span>${cover.mark}</span>
      <strong>${cover.title}</strong>
      <em>${project.name}</em>
      <i></i>
    </div>
  `;
}

function renderCompanyArticleBody(article, project) {
  const image = article.detailImage || article.cover?.src || 'assets/company-channel/live-detail.jpg';
  const paragraphs = [
    `这篇内容属于「${project.name}」项目资料，主要用于销售、客服和团队长在私聊里快速解释客户最关心的问题。`,
    article.summary,
    `AI 销售助手会把这篇图文拆成可引用素材：先识别客户问题，再按场景选择卖点、案例或售后说明。`
  ];
  return `
    <section class="wx-article-body">
      ${paragraphs.map(p => `<p>${p}</p>`).join('')}
      <figure class="wx-inline-photo">
        <img src="${image}" alt="${article.title} 正文配图" loading="eager" />
        <figcaption>${project.name} · 真实业务图文素材</figcaption>
      </figure>
      <p>如果客户已经表达兴趣，建议不要一次性发送长段介绍，先用一句话确认身份和需求，再让 AI 根据客户标签自动补充下一段资料。</p>
    </section>
  `;
}


function renderCompanyArticleCard(article, index = 0) {
  const project = getCompanyProject(article.projectId);
  const isLead = index === 0;
  const coverSrc = article.cover?.src || 'assets/company-channel/live.jpg';
  return `
    <a class="company-article-card wx-graphic-card ${isLead ? 'is-lead' : 'is-sub'}" data-action="open" data-target="company-article:${article.id}">
      ${isLead ? `
        <div class="wx-lead-cover">
          <img src="${coverSrc}" alt="${article.title}" loading="eager" />
          <span>${article.tag}</span>
          <strong>${article.title}</strong>
        </div>
      ` : `
        <div class="wx-sub-copy">
          <strong>${article.title}</strong>
          <em>${article.time} · ${article.reads} 阅读</em>
        </div>
        <img class="wx-sub-thumb" src="${coverSrc}" alt="${article.title}" loading="eager" />
      `}
    </a>
  `;
}

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
        <div class="ai-live-line"><i></i>AI 自动沟通演示 · 点击查看</div>
      </div>
      <div class="case-score"><b>${score || '--'}</b><em>意向</em></div>
    </a>
  `;
}


function renderOfficialServicePinned(c) {
  return `
    <button class="contact-official-service" data-action="open" data-target="chat-single:${c.id}" aria-label="进入公司官方客服">
      <div class="official-service-mark">官</div>
      <div class="official-service-main">
        <div class="official-service-top"><strong>${c.name}</strong><span><i></i>在线</span></div>
        <p>产品咨询 / 售后处理 / 资料领取，直接提问由 AI 客服先答。</p>
        <em>固定置顶 · 官方服务入口</em>
      </div>
      <b>提问</b>
    </button>
  `;
}

function renderMarketingContactItem(c) {
  const score = c.score || 60;
  const scoreClass = score >= 90 ? 'hot' : score >= 80 ? 'warm' : score >= 70 ? 'care' : 'cold';
  const agentClass = c.agent === 'AI 客服助手' ? 'service' : c.agent === 'AI 会议助手' ? 'meet' : 'sales';
  return `
    <a class="contact-profile-row ${scoreClass}" data-action="open" data-target="contact-profile:${c.id}">
      <div class="contact-row-avatar ${c.isVip ? 'vip' : ''}">${c.avatar}</div>
      <div class="contact-row-main">
        <div class="contact-row-top"><strong>${c.name}</strong><span>${c.intent || c.type}</span></div>
        <p>${c.dept || c.lastMsg || '客户资料待补充'}</p>
        <div class="contact-row-tags"><em>${c.stage || '未分层'}</em><em>${c.source || '未知来源'}</em><em class="${agentClass}">${c.agent || 'AI 待分配'}</em></div>
      </div>
      <div class="contact-row-score"><b>${score}</b><span>SCORE</span></div>
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
