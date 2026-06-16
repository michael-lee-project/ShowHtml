// mock-data.js — 写死数据（联系人 / 会话 / 产品 / 会议）
// v4 范围：不接真后端，所有数据写死
// 内部统一用 getContact(cid) 拿联系人

// === 联系人 ===
const CONTACTS = [
  { id: 'official-service', name: '公司官方客服', avatar: '官', type: '官方客服', dept: '官方在线 · 产品咨询 / 售后 / 资料领取', unread: 0,
    lastMsg: '您好，我是公司官方客服，有问题可以直接问我。', time: '在线', isOfficial: true,
    intent: '官方服务', stage: '置顶', score: 100, source: '官方入口', agent: 'AI 客服助手' },
  { id: 'u01', name: '林晓楠', avatar: '林', type: '私聊', dept: '新人 · 宝妈副业', unread: 2,
    lastMsg: '如果先拿体验装，后面能补差价升级吗？', time: '09:42', isVip: true,
    intent: '高意向', stage: '促单', score: 92, source: '视频号直播', agent: 'AI 销售助手' },
  { id: 'u02', name: '周明远', avatar: '周', type: '私聊', dept: '项目方 · 社群主理人', unread: 1,
    lastMsg: '佣金规则我看懂了，想知道团队怎么结算。', time: '10:18',
    intent: '招商咨询', stage: '报价', score: 86, source: '朋友转介绍', agent: 'AI 销售助手' },
  { id: 'u03', name: '陈婉婷', avatar: '陈', type: '私聊', dept: '老会员 · 售后', unread: 0,
    lastMsg: '昨天拍的套装少了一个赠品。', time: '11:06',
    intent: '售后安抚', stage: '客服介入', score: 68, source: '会员复购', agent: 'AI 客服助手' },
  { id: 'u04', name: '私域新人 07 群', avatar: '群', type: '群聊', dept: '23 人 · 新人培育', unread: 7,
    lastMsg: '[AI 销售助手] 已识别 3 个价格敏感用户', time: '11:32', isGroup: true,
    intent: '群转化', stage: '培育', score: 79, source: '新人群', agent: 'AI 销售助手' },
  { id: 'u05', name: '赵一鸣', avatar: '赵', type: '私聊', dept: '高净值 · 企业采购', unread: 1,
    lastMsg: '我下午三点有空，你让 AI 先整理一下方案。', time: '13:15', isVip: true,
    intent: '大单机会', stage: '约会', score: 95, source: '线下活动', agent: 'AI 销售助手' },
  { id: 'u06', name: '运营-阿明', avatar: '阿', type: '私聊', dept: '运营部',
    lastMsg: '昨日 AI 营销战报已同步', time: '昨天' },
  { id: 'agent-sales', name: 'AI 销售助手', avatar: '销', type: 'Agent',
    tag: '销售', tagColor: 'red', isAgent: true,
    desc: '主动沟通新人、推荐商品、推动下单成交',
    welcome: '您好，我是 AI 销售助手。\n我可以根据客户资料、商品库、佣金规则和标签策略，主动跟进新人并推动成交。' },
  { id: 'agent-customer', name: 'AI 客服助手', avatar: '客', type: 'Agent',
    tag: '客服', tagColor: 'blue', isAgent: true,
    desc: 'FAQ 问答、售后接待、情绪安抚、复购引导',
    welcome: '您好，我是 AI 客服助手。\n我可以处理 FAQ、售后规则、智能回答、情绪安抚、复购引导和转人工。' },
  { id: 'agent-meeting', name: 'AI 会议助手', avatar: '议', type: 'Agent',
    tag: '会议', tagColor: 'green', isAgent: true,
    desc: '会议录音、转文字、纪要、待办和意图分析',
    welcome: '您好，我是 AI 会议助手。\n我可以帮您做会议录音、转文字、会议总结、会议纪要、待办事项和意图分析。' }
];

// === helper：按 id 查联系人 ===
function getContact(id) {
  return CONTACTS.find(c => c.id === id);
}

// === 会话列表 ===
const CHATS = [
  { id: 'c01', contactId: 'u01', lastMsg: '如果先拿体验装，后面能补差价升级吗？', time: '09:42', unread: 2, pinned: true,
    aiNext: '发送“体验装可抵扣升级”话术，并推荐新人组合', aiTag: '高意向', aiAgent: '销售', score: 92 },
  { id: 'c02', contactId: 'u05', lastMsg: '我下午三点有空，你让 AI 先整理一下方案。', time: '13:15', unread: 1, pinned: true,
    aiNext: '整理企业采购方案，预约 15:00 跟进', aiTag: '大单机会', aiAgent: '销售', score: 95 },
  { id: 'c03', contactId: 'u02', lastMsg: '佣金规则我看懂了，想知道团队怎么结算。', time: '10:18', unread: 1,
    aiNext: '推送佣金结算图，并提示可申请项目方权益', aiTag: '招商咨询', aiAgent: '销售', score: 86 },
  { id: 'c04', contactId: 'u04', lastMsg: '[AI 销售助手] 已识别 3 个价格敏感用户', time: '11:32', unread: 7,
    aiNext: '群内发送低门槛体验装，对 3 人单独私聊', aiTag: '群转化', aiAgent: '销售', score: 79 },
  { id: 'c05', contactId: 'u03', lastMsg: '昨天拍的套装少了一个赠品。', time: '11:06',
    aiNext: '先道歉安抚，再补发赠品并送复购券', aiTag: '售后安抚', aiAgent: '客服', score: 68 }
];

// === 通讯录分类 ===
const CONTACT_CATEGORIES = [
  { id: 'new', name: '新朋友', count: 3, icon: '新' },
  { id: 'private', name: '私聊', count: 12, icon: '私' },
  { id: 'group', name: '群聊', count: 5, icon: '群' },
  { id: 'blacklist', name: '黑名单', count: 0, icon: '黑' }
];

// === AI 营销客户案例线程 ===
const CUSTOMER_THREADS = {
  u01: {
    profile: '宝妈副业 · 预算 500 内 · 关注可退可升级',
    insight: '先降低试错成本，再给“可升级抵扣”的确定性。',
    product: '新人体验装 + VIC 入门套餐',
    next: '发送体验装抵扣升级说明，补一句“今天下单赠 1 次顾问答疑”。',
    messages: [
      { from: 'them', time: '09:35', text: '我刚进群，想先试试，不太敢直接买大的。' },
      { from: 'me', time: '09:37', text: '可以先从体验装开始，适合先确认效果。' },
      { from: 'them', time: '09:42', text: '如果先拿体验装，后面能补差价升级吗？' }
    ]
  },
  u02: {
    profile: '社群主理人 · 有 600 人私域 · 关注佣金和结算',
    insight: '不是普通消费者，应切项目方视角：团队收益、结算周期、素材支持。',
    product: '项目方合作包 + 平台商品库',
    next: '发送佣金结算规则和团队样例收益，邀请填写项目方资料。',
    messages: [
      { from: 'them', time: '10:11', text: '我这边有几个社群，想看看能不能一起卖。' },
      { from: 'me', time: '10:13', text: '可以，项目方会有独立佣金规则和素材支持。' },
      { from: 'them', time: '10:18', text: '佣金规则我看懂了，想知道团队怎么结算。' }
    ]
  },
  u03: {
    profile: '老会员 · 已购 3 次 · 当前负面情绪轻微',
    insight: '先处理情绪，不急着销售；补偿完成后再引导复购。',
    product: '赠品补发 + 复购券',
    next: '客服助手先发补发承诺，24 小时后销售助手再跟进复购券。',
    messages: [
      { from: 'them', time: '11:02', text: '我这单昨天到了，但是赠品没看到。' },
      { from: 'me', time: '11:04', text: '我先帮你核对订单，少发的话今天给你补。' },
      { from: 'them', time: '11:06', text: '昨天拍的套装少了一个赠品。' }
    ]
  },
  u04: {
    profile: '新人群 · 23 人 · 价格敏感 3 人 · 观望 9 人',
    insight: '群里不适合强销售，先用低门槛体验装破冰，再把高意向拉私聊。',
    product: '新人体验装 / 团购券',
    next: '群发体验装权益说明，并自动私聊 3 个价格敏感用户。',
    messages: [
      { from: 'them', time: '11:20', text: '这个是不是必须买套餐才有服务？' },
      { from: 'them', time: '11:25', text: '有新人价吗？想先试试看。' },
      { from: 'me', time: '11:32', text: '[AI 销售助手] 已识别 3 个价格敏感用户，建议先推体验装。' }
    ]
  },
  u05: {
    profile: '企业采购 · 预算高 · 需要方案和会议确认',
    insight: '高客单不要碎片化聊天，转为方案 + 会议推进。',
    product: '企业采购组合包',
    next: 'AI 销售助手生成 1 页采购方案；会议助手准备下午 15:00 会议纪要模板。',
    messages: [
      { from: 'them', time: '13:02', text: '我们可能不是个人买，是给团队采购。' },
      { from: 'me', time: '13:08', text: '那我按企业采购给你整理方案，重点放预算、交付和售后。' },
      { from: 'them', time: '13:15', text: '我下午三点有空，你让 AI 先整理一下方案。' }
    ]
  },
  'official-service': {
    profile: '公司官方客服 · 在线答疑 · 产品咨询 / 售后处理 / 资料领取',
    insight: '官方客服入口置顶展示，用户可直接提问；AI 客服助手先答复，复杂问题再转人工。',
    product: '官方服务中心 + AI 客服助手',
    next: '引导用户直接输入问题，AI 根据产品资料、售后规则和官方内容号自动回答。',
    messages: [
      { from: 'me', time: '在线', text: '您好，我是公司官方客服。产品咨询、订单售后、资料领取都可以直接问我。' },
      { from: 'them', time: '刚刚', text: '我想了解一下你们的服务适合哪些客户？' },
      { from: 'me', time: '刚刚', text: '适合需要私域沟通、AI 自动回复、客户跟进和会后纪要沉淀的团队。我可以先按你的业务场景帮你推荐入口。' }
    ]
  }
};

// legacy fallback
const CHAT_WITH_NATSUME = CUSTOMER_THREADS.u01.messages;

// === 产品库（销冠 Agent 用）===
const PRODUCTS = [
  { id: 'p01', name: 'VIC 入门套餐', price: 1980, original: 2980, tag: '热销',
    desc: '含 100 次 AI 咨询 + 5 次专家 1v1', icon: '🌱' },
  { id: 'p02', name: 'VIC 专业套餐', price: 4980, original: 6980, tag: '推荐',
    desc: '含 500 次 AI 咨询 + 20 次专家 1v1', icon: '⭐' },
  { id: 'p03', name: 'VIC 旗舰套餐', price: 9980, original: 12980, tag: '限时',
    desc: '无限 AI 咨询 + 50 次专家 + 专属顾问', icon: '👑' },
  { id: 'p04', name: 'VIC 体验装', price: 99, original: 199, tag: '新人',
    desc: '3 天体验，不满意全额退', icon: '🎁' }
];

// === 会议数据（会议 tab + 详情 + Agent 用） ===
const MEETINGS = [
  {
    id: 'm01',
    title: 'Q3 营销策略评审会',
    startTime: '2026-06-10 14:00',
    endTime:   '2026-06-10 15:30',
    duration: 90,
    status: 'soon',          // soon / scheduled / ended
    organizer: '陈志远',
    attendees: 8,
    attendeeList: ['陈志远 (主持)', '夏目', '李四', '王五', '赵六', '运营-阿明', '产品经理-张', '王会计'],
    agenda: [
      'Q2 整体数据复盘',
      'Q3 营销目标对齐',
      'VIC 套餐主推方案',
      '私域转化策略讨论',
      'AI Agent 落地节奏'
    ]
  },
  {
    id: 'm02',
    title: 'VIC 产品周会',
    startTime: '2026-06-09 17:30',
    endTime:   '2026-06-09 18:00',
    duration: 30,
    status: 'scheduled',
    organizer: '产品经理-张',
    attendees: 4,
    attendeeList: ['产品经理-张 (主持)', '夏目', '技术部-小李', '设计-小林'],
    agenda: ['本周迭代回顾', '下版本规划', 'Bug 优先级']
  },
  {
    id: 'm03',
    title: '6 月运营复盘',
    startTime: '2026-06-08 10:00',
    endTime:   '2026-06-08 11:30',
    duration: 90,
    status: 'ended',
    organizer: '运营-阿明',
    attendees: 6,
    attendeeList: ['运营-阿明 (主持)', '陈志远', '夏目', '李四', '王五', '赵六'],
    agenda: ['6 月关键指标', '活动效果分析', '下半年规划'],
    hasSummary: true
  }
];

// === 会议纪要样例（按 meetingId 索引） ===
const MEETING_SUMMARY = {
  m03: {
    title: '6 月运营复盘',
    meta: '2026-06-08 10:00-11:30 · 90 分钟 · 6 人',
    overview: '本次复盘会围绕 6 月运营关键指标、活动效果、下半年规划三个核心议题展开。会议最后形成 3 项关键决策与 4 项待办行动项。',
    keyPoints: [
      '6 月新增私域用户 1.2 万（环比 +18%），转化率 4.7%（环比 -0.3pp）',
      '"618 大促" 活动 ROI 1:3.2，超出预期 20%，其中 VIC 专业套餐贡献 47% GMV',
      '客服日均承接 240 单咨询，AI 接管后人工介入率降至 18%'
    ],
    decisions: [
      '7 月主推 "夏季焕新" 活动（7/15-7/30），目标 GMV 1200 万',
      '私域转化实验由销冠 Agent 全量接管，人工销冠转 VIP 客户深度服务',
      '客服 Agent 上线 30 天评估期：CSAT 目标 ≥4.5/5'
    ],
    actions: [
      { task: '夏季焕新活动方案 + 推广素材', owner: '夏目',   deadline: '2026-07-05', priority: 'P0' },
      { task: '销冠 Agent 知识库 V2 上线',    owner: '李四',   deadline: '2026-07-01', priority: 'P0' },
      { task: '客服 Agent 满意度周报机制',    owner: '王五',   deadline: '2026-06-20', priority: 'P1' },
      { task: '私域转化漏斗数据看板',        owner: '运营-阿明', deadline: '2026-06-25', priority: 'P1' }
    ]
  },
  m01: {
    title: 'Q3 营销策略评审会',
    meta: '2026-06-10 14:00-15:30 · 90 分钟 · 8 人',
    overview: '预安排会议，AI 助手将在会议结束后自动生成完整纪要。',
    keyPoints: ['[议程] Q2 整体数据复盘', '[议程] Q3 营销目标对齐', '[议程] AI Agent 落地节奏'],
    decisions: [],
    actions: []
  }
};

// === 我的 tab 数据 ===
const PROFILE_DATA = {
  name: '陈志远',
  account: '@zhiyuan',
  avatar: '陈',
  dept: '市场部',
  memberLevel: 'VIP',
  points: 2380,
  qrCode: 'QR',
  menus: [
    { icon: '📦', name: '订单', count: 3 },
    { icon: '🎫', name: '卡券', count: 5 },
    { icon: '📁', name: '收藏' },
    { icon: '📜', name: '历史' }
  ],
  apps: [
    { icon: '🤖', name: 'AI Agent 中心', isNew: true, color: 'red' },
    { icon: '🏢', name: '我的企业' },
    { icon: '👑', name: '会员中心' },
    { icon: '📊', name: '数据中心' },
    { icon: '🎨', name: '模板' },
    { icon: '⚙️', name: '设置' }
  ]
};
