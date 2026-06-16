/* ========================================
   agents.js — 6 个 AI Agent 数据定义
   ======================================== */

const AGENTS = [
  {
    id: 'sales',
    name: 'AI 销售助手',
    en: 'AI SALES',
    icon: '销',
    color: '#ff6b35',
    colorSoft: '#ffe8db',
    role: '售前转化',
    kicker: 'P0 · 销售',
    status: 'running',
    desc: '读取新人资料、商品库、佣金规则和客户标签，主动识别意向、推荐商品、报价促单并推动成交。',
    caps: ['读新人', '配商品', '算佣金', '定打法', '打标签', '排跟进'],
    quickPrompts: [
      '李小姐问春季新品价格',
      '给我推荐3款高客单商品',
      '今日新客名单',
    ]
  },
  {
    id: 'customer',
    name: 'AI 客服助手',
    en: 'AI SERVICE',
    icon: '客',
    color: '#4a90e2',
    colorSoft: '#e8f2fc',
    role: '售后接待',
    kicker: 'P0 · 客服',
    status: 'busy',
    desc: '负责 FAQ 题库、智能回答、售后接待、情绪安抚、复购引导，把客服数据沉淀给销售。',
    caps: ['FAQ', '情绪安抚', '物流查询', '退款处理', '复购引导', '转人工'],
    quickPrompts: [
      '查询订单 #2024060901',
      '客户要退款，情绪激动',
      '复购提醒名单',
    ]
  },
  {
    id: 'meeting',
    name: 'AI 会议助手',
    en: 'AI MEETING',
    icon: '议',
    color: '#10b981',
    colorSoft: '#d4f1e1',
    role: '会议纪要',
    kicker: 'P1 · 会议',
    status: 'idle',
    desc: '录音转写、说话人分离、关键决策提取、行动项跟踪、意图分析，把会议变成可复用的知识。',
    caps: ['实时转写', '说话人分离', '纪要生成', '行动项', '意图分析', '多语言'],
    quickPrompts: [
      '总结 Q3 复盘会议',
      '提取上次销售会议行动项',
      '生成会议纪要模板',
    ]
  },
  {
    id: 'design',
    name: 'AI 设计专家',
    en: 'AI DESIGN',
    icon: '设',
    color: '#8b5cf6',
    colorSoft: '#efe6ff',
    role: '视觉设计',
    kicker: 'P1 · 设计',
    status: 'running',
    desc: '海报、UI、Logo、品牌视觉一站式生成。读懂品牌调性，输出可商用设计稿，秒级响应。',
    caps: ['海报设计', 'UI 界面', 'Logo 生成', '品牌延展', '配色方案', '素材合成'],
    quickPrompts: [
      '618 活动主视觉海报',
      '给我一个科技感 Logo',
      'App 首页 UI 重设计',
    ]
  },
  {
    id: 'video',
    name: 'AI 视频专家',
    en: 'AI VIDEO',
    icon: '频',
    color: '#ec4899',
    colorSoft: '#ffe0f0',
    role: '视频创作',
    kicker: 'P1 · 视频',
    status: 'idle',
    desc: '脚本撰写、分镜设计、字幕生成、智能剪辑、口播数字人，把创意变成可发布的成片。',
    caps: ['脚本撰写', '分镜设计', '智能剪辑', '字幕生成', '数字人口播', '特效合成'],
    quickPrompts: [
      '产品介绍 30s 短视频',
      '生成一个种草脚本',
      '给视频自动加字幕',
    ]
  },
  {
    id: 'writing',
    name: 'AI 写作专家',
    en: 'AI WRITING',
    icon: '写',
    color: '#f59e0b',
    colorSoft: '#fef0d4',
    role: '内容创作',
    kicker: 'P1 · 写作',
    status: 'idle',
    desc: '公众号、小红书、知乎、抖音脚本、广告文案、企业文档，深度理解品牌口吻与平台调性。',
    caps: ['公众号', '小红书', '知乎', '广告文案', '企业文档', 'SEO 文章'],
    quickPrompts: [
      '写一篇小红书种草文',
      '公众号推文开头 3 段',
      '抖音 60s 口播脚本',
    ]
  }
];

// 工位位置映射（按 ws-0 ~ ws-5 顺序，对应 12点 / 2点 / 4点 / 6点 / 8点 / 10点）
const WORKSTATION_LAYOUT = [
  'sales',    // 12 点 - 销售（最显眼位置）
  'design',   // 2 点 - 设计
  'video',    // 4 点 - 视频
  'customer', // 6 点 - 客服
  'meeting',  // 8 点 - 会议
  'writing'   // 10 点 - 写作
];

function getAgent(id) {
  return AGENTS.find(a => a.id === id);
}

function getAgentIndex(id) {
  return AGENTS.findIndex(a => a.id === id);
}

function getWorkstationIndex(id) {
  return WORKSTATION_LAYOUT.indexOf(id);
}
