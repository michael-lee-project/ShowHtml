/* ========================================
   agent-center.js — Agent 功能配置中心
   ======================================== */

const AC_MODE_LABELS = {
  auto: '自动执行',
  confirm: '人工确认',
  suggest: '仅建议',
  off: '关闭'
};

const AGENT_FUNCTION_CONFIGS = {
  sales: {
    title: 'AI 销售助手功能配置',
    subtitle: '从 app 原型搬迁：新人资料、我的商品库、平台商品库、营销思路、标签策略、跟进节奏。',
    enabled: 6,
    total: 6,
    health: '92%',
    status: '运行中',
    defaultTest: '第一次买，预算 300 左右，想送朋友。',
    modules: [
      { id: 'profile', icon: '🧾', title: '新人资料模板', desc: '身份 / 性格 / 收入 / 家庭 / 需求 / 禁忌，AI 销售开口前先读人。', mode: 'auto', state: '主配置', metric: '6 字段' },
      { id: 'products', icon: '🛒', title: '我的商品库', desc: '已选商品 / 卖点 / 价格 / 佣金，AI 按客户画像推荐主推商品。', mode: 'auto', state: '已同步', metric: '4 商品' },
      { id: 'platformProducts', icon: '🏪', title: '平台商品库', desc: '平台统一商品 / 等级佣金 / 一键加入我的商品库。', mode: 'suggest', state: '可选 128', metric: '黄金会员' },
      { id: 'playbook', icon: '💡', title: '营销思路', desc: '信任 / 共鸣 / 专家 / 成交打法，先选打法再生成话术。', mode: 'auto', state: '策略中', metric: '8 打法' },
      { id: 'tags', icon: '🏷', title: '标签策略', desc: '意向 / 消费 / 关系 / 性格 / 场景标签，决定打法、商品和节奏。', mode: 'auto', state: '今日更新', metric: '5 类标签' },
      { id: 'followup', icon: '🎯', title: '跟进节奏', desc: '首聊 / 培育 / 推荐 / 促单 / 复访 / 异常暂停。', mode: 'auto', state: '运行中', metric: '6 阶段' }
    ],
    sources: [
      ['新人资料模板', '已配置', '身份/性格/家庭/收入/需求/禁忌'],
      ['我的商品库', '已同步', '4 个主推商品'],
      ['平台商品库', '可加入', '等级佣金'],
      ['营销思路', '已启用', '8 类打法'],
      ['标签策略', '今日更新', '5 类标签']
    ],
    rules: [
      '资料不完整时，AI 先问 1 个轻问题补资料，不直接推商品。',
      '新人资料 → 客户标签 → 商品匹配 → 营销思路 → 跟进节奏，按这条链路执行。',
      '情绪异常、投诉、黑名单或明确拒绝联系时，立即暂停营销并进入人工确认。'
    ],
    templates: ['新人首次沟通模板', '商品推荐理由', '营销打法结构', '跟进节奏阶梯'],
    risks: ['收益承诺/虚假稀缺禁用', '价格/佣金/优惠需以商品库为准'],
    test: {
      hit: ['新人资料模板', '标签策略', '我的商品库', '营销思路'],
      data: ['客户背景', '预算区间', '商品价格', '打法规则'],
      action: ['识别新人送礼场景', '标记预算 200-499', '匹配入门/礼盒商品', '生成低压力推荐'],
      output: '识别：新人 / 送礼 / 预算 200-499；建议先推荐平台标准课或私域增长入门包，并用信任建立型话术。',
      risk: '不承诺收益，不虚构限时，不对情绪异常客户促单。'
    }
  },
  customer: {
    title: 'AI 客服助手功能配置',
    subtitle: '从 app 原型搬迁：FAQ 题库、售后规则、智能回答、情绪安抚、复购引导、转人工规则。',
    enabled: 6,
    total: 6,
    health: '89%',
    status: '接待中',
    defaultTest: '赠品没收到，你们怎么这么慢？',
    modules: [
      { id: 'faq', icon: '📚', title: 'FAQ 题库', desc: '常见问题 / 标准答案 / 命中率，未命中进入待补充池。', mode: 'auto', state: '已启用', metric: '86% 命中' },
      { id: 'afterSaleRules', icon: '📦', title: '售后规则', desc: '退款 / 物流 / 发票 / 赔付边界，避免 AI 乱承诺。', mode: 'confirm', state: '人工确认', metric: '4 类规则' },
      { id: 'smartReply', icon: '💬', title: '智能回答', desc: '回答策略 / 引用规则 / 禁用词，先解决问题再维护关系。', mode: 'auto', state: '运行中', metric: '4 模式' },
      { id: 'emotionCare', icon: '🫶', title: '情绪安抚', desc: '负面情绪 / 升级处理，决定继续 AI 接待、工单或转人工。', mode: 'auto', state: '监控中', metric: '4 等级' },
      { id: 'repurchase', icon: '🔁', title: '复购引导', desc: '售后满意 / 二次推荐，服务会话沉淀为下一次购买机会。', mode: 'suggest', state: '可建议', metric: '23 机会' },
      { id: 'humanHandoff', icon: '👤', title: '转人工规则', desc: '高风险 / 投诉 / 复杂问题，停止 AI 并带上下文转接。', mode: 'confirm', state: 'P0 优先', metric: '4 触发' }
    ],
    sources: [
      ['FAQ 题库', '已启用', '12 条样例'],
      ['售后规则', '已配置', '退款/物流/发票/补偿'],
      ['智能回答', '运行中', '4 种模式'],
      ['情绪安抚', '监控中', 'L1-L4'],
      ['复购引导', '同步销售', '服务→销售']
    ],
    rules: [
      '客服助手先检索 FAQ 和售后规则，再生成可发送回答。',
      '投诉、威胁曝光、退款金额争议等场景必须停止 AI 自动承诺并转人工。',
      '复购推荐只能在售后已解决且客户满意后触发，不在情绪异常时销售。'
    ],
    templates: ['FAQ 标准答案', '售后规则矩阵', '安抚话术原则', '转人工摘要'],
    risks: ['赔付/退款金额需人工确认', '投诉/威胁曝光立即转人工'],
    test: {
      hit: ['FAQ 题库', '售后规则', '情绪安抚', '转人工规则'],
      data: ['赠品补发 FAQ', '物流规则', '情绪等级', '转人工摘要'],
      action: ['先道歉', '核验订单', '承诺补发需确认', '若连续不满则转人工'],
      output: '建议回复：抱歉让您久等了，我先帮您核验订单赠品；确认少发后会安排补发，并记录工单跟进。',
      risk: '不承诺“马上到账/一定赔付”，金额争议转人工。'
    }
  },
  meeting: {
    title: 'AI 会议助手功能配置',
    subtitle: '从 app 原型搬迁：录音设置、发言分离、纪要模板、行动项、日程同步、双语翻译。',
    enabled: 6,
    total: 6,
    health: '88%',
    status: '待总结',
    defaultTest: '帮我整理这次客户需求评审会。',
    modules: [
      { id: 'recording', icon: '🎙️', title: '录音设置', desc: 'ASR / 语言 / 降噪，配置何时录音、何时转写、何时保留原音。', mode: 'confirm', state: '高精度', metric: '48k 实时' },
      { id: 'speakers', icon: '👥', title: '发言分离', desc: '角色标注 / 自动编号，把录音拆成不同说话人与角色。', mode: 'auto', state: '已启用', metric: '92% 识别' },
      { id: 'template', icon: '📝', title: '纪要模板', desc: '章节 / 要点 / 行动项格式，输出可执行、可复盘的结构化纪要。', mode: 'auto', state: '已配置', metric: '6 字段' },
      { id: 'todo', icon: '✅', title: '行动项', desc: '指派 / 截止 / 提醒，把“回头再说”变成可追踪待办。', mode: 'auto', state: '运行中', metric: '3 级优先' },
      { id: 'calendar', icon: '📅', title: '日程同步', desc: '日历 / 会议邀请，知道会议来源、提醒时间和会后跟进。', mode: 'confirm', state: '待授权', metric: '3 通道' },
      { id: 'translate', icon: '🌐', title: '双语翻译', desc: '中/英双语输出，跨境会议保留角色、结论、行动项和术语。', mode: 'suggest', state: '可选', metric: '4 模式' }
    ],
    sources: [
      ['会议录音', '可读取', '高精度转写'],
      ['发言人角色', '已启用', '4 默认角色'],
      ['纪要模板', '已配置', '6 个字段'],
      ['行动项', '自动提取', '责任人/截止'],
      ['日程同步', '待授权', '系统日历']
    ],
    rules: [
      '客户会议默认高精度转写；检测到敏感词时保留原始音频，便于复核。',
      '先写结论，再写过程；无法确认的内容标记“待确认”，禁止把推测写成事实。',
      '涉及客户转化的行动项同步给 AI 销售助手，但外发和日历授权需人工确认。'
    ],
    templates: ['录音识别配置', '说话人分离', '纪要模板', '行动项设置', '日程同步', '翻译设置'],
    risks: ['私人日历正文不读取', '低置信发言人/译文需确认'],
    test: {
      hit: ['录音设置', '发言分离', '纪要模板', '行动项'],
      data: ['会议录音', '角色规则', '纪要模板字段', '待办样例'],
      action: ['高精度转写', '标注客户/销售/技术方', '生成结论优先纪要', '提取责任人与截止时间'],
      output: '输出：会议背景、关键结论、争议与风险、客户意图、行动项、销售跟进建议。',
      risk: '责任人/译文低置信时标记待确认，不自动外发。'
    }
  },
  design: {
    title: 'AI 设计专家功能配置',
    subtitle: '配置品牌规范、素材库、风格模板、尺寸规格、禁用元素和审核清单。',
    enabled: 4,
    total: 6,
    health: '74%',
    status: '生成中',
    defaultTest: '生成一张 618 活动主视觉海报',
    modules: [
      { id: 'brand', icon: '◇', title: '品牌规范', desc: '绑定 Logo、品牌色、字体、版式禁区和品牌调性。', mode: 'auto', state: '已绑定', metric: '1 套品牌' },
      { id: 'assets', icon: '🖼', title: '素材库', desc: '配置商品图、人物图、场景图、图标和历史设计稿。', mode: 'auto', state: '已同步', metric: '86 素材' },
      { id: 'style', icon: '🎨', title: '风格模板', desc: '选择电商促销、科技感、品牌海报、活动页、UI 界面。', mode: 'suggest', state: '6 模板', metric: '可切换' },
      { id: 'size', icon: '▣', title: '尺寸规格', desc: '维护小红书、抖音、公众号、海报、Banner、App UI 尺寸。', mode: 'auto', state: '已启用', metric: '12 尺寸' },
      { id: 'ban', icon: '⛔', title: '禁用元素', desc: '限制禁用颜色、侵权素材、低俗元素和违规词。', mode: 'confirm', state: '待补充', metric: '3 项缺失' },
      { id: 'review', icon: '✓', title: '审核清单', desc: '检查清晰度、留白、对齐、品牌一致性和尺寸正确。', mode: 'confirm', state: '人工确认', metric: '5 检查' }
    ],
    sources: [
      ['品牌手册', '已绑定', 'v2'],
      ['商品素材', '已同步', '86 张'],
      ['历史设计稿', '可读取', '32 份'],
      ['禁用元素', '待补充', '3 项'],
      ['输出规格', '已启用', '12 类']
    ],
    rules: [
      '输出前必须检查品牌色、尺寸和禁用元素。',
      '未授权素材不得进入最终方案，只能做占位建议。',
      '多版方案默认只生成建议，最终交付需人工确认。'
    ],
    templates: ['主视觉海报', '商品 Banner', 'App UI', '品牌延展'],
    risks: ['禁用元素待补充', '最终交付需人工确认'],
    test: {
      hit: ['品牌规范', '素材库', '风格模板', '尺寸规格'],
      data: ['品牌色', '商品图', '活动模板', '输出尺寸'],
      action: ['生成 3 版构图', '应用品牌规范', '检查尺寸', '输出审核清单'],
      output: '输出：3 版 618 主视觉方向，包含 1080×1920 与 1080×1080 两套尺寸。',
      risk: '涉及未授权素材时仅生成占位，不进入最终稿。'
    }
  },
  video: {
    title: 'AI 视频专家功能配置',
    subtitle: '配置脚本模板、分镜规则、平台规格、字幕规则、素材来源和发布检查。',
    enabled: 4,
    total: 6,
    health: '76%',
    status: '队列中',
    defaultTest: '做一个 30 秒产品介绍短视频',
    modules: [
      { id: 'script', icon: '✍', title: '脚本模板', desc: '配置种草、带货、产品介绍、知识科普和客户案例结构。', mode: 'auto', state: '已启用', metric: '5 模板' },
      { id: 'shot', icon: '🎬', title: '分镜规则', desc: '设置镜头数量、镜头时长、画面节奏和开头钩子。', mode: 'auto', state: '运行中', metric: '6 镜头' },
      { id: 'platform', icon: '📱', title: '平台规格', desc: '适配抖音、小红书、视频号、B站和公众号视频。', mode: 'auto', state: '已配置', metric: '5 平台' },
      { id: 'subtitle', icon: '💬', title: '字幕规则', desc: '配置字幕样式、关键词高亮、位置和字号。', mode: 'suggest', state: '需确认', metric: '3 风格' },
      { id: 'material', icon: '🎞', title: '素材来源', desc: '绑定商品图、历史视频、素材库、BGM 和数字人。', mode: 'confirm', state: '部分授权', metric: 'BGM 待审' },
      { id: 'publish', icon: '🚦', title: '发布检查', desc: '检查夸张承诺、敏感行业、版权音乐和虚假功效。', mode: 'confirm', state: '强制审核', metric: 'P0 风险' }
    ],
    sources: [
      ['产品素材', '已同步', '42 个'],
      ['历史视频', '可读取', '18 条'],
      ['BGM 库', '待授权', '版权确认'],
      ['平台规则', '已启用', '5 平台'],
      ['数字人', '可选', '2 形象']
    ],
    rules: [
      '版权音乐、敏感行业和夸张承诺必须人工确认。',
      '平台规格自动适配，但发布动作默认关闭。',
      '前三秒钩子必须包含痛点或利益点。'
    ],
    templates: ['30 秒产品介绍', '种草脚本', '带货视频', '封面标题'],
    risks: ['BGM 版权待确认', '发布前强制人工审核'],
    test: {
      hit: ['脚本模板', '分镜规则', '平台规格', '字幕规则'],
      data: ['产品卖点', '历史视频', '平台规则'],
      action: ['生成 30 秒脚本', '拆成 6 个分镜', '生成字幕文案', '给出封面建议'],
      output: '输出：30 秒脚本、6 个分镜、字幕文案、封面标题和发布时间建议。',
      risk: 'BGM 与发布动作需要人工确认。'
    }
  },
  writing: {
    title: 'AI 写作专家功能配置',
    subtitle: '配置平台类型、内容模板、标题策略、关键词规则、敏感词检查和发布格式。',
    enabled: 5,
    total: 6,
    health: '84%',
    status: '可用',
    defaultTest: '写一篇小红书种草文',
    modules: [
      { id: 'platform', icon: '📌', title: '平台类型', desc: '配置小红书、公众号、知乎、抖音、朋友圈和广告。', mode: 'auto', state: '已启用', metric: '6 平台' },
      { id: 'template', icon: '📄', title: '内容模板', desc: '维护种草文、品牌稿、销售文案、知识文章和活动通知。', mode: 'auto', state: '已配置', metric: '12 模板' },
      { id: 'title', icon: 'T', title: '标题策略', desc: '配置数字标题、痛点标题、利益标题和悬念标题。', mode: 'auto', state: '运行中', metric: '4 策略' },
      { id: 'keyword', icon: '#', title: '关键词规则', desc: '绑定 SEO 关键词、品牌词、产品卖点和禁用词。', mode: 'suggest', state: '需复核', metric: '38 词' },
      { id: 'sensitive', icon: '⚠', title: '敏感词检查', desc: '检查违规词、极限词、医疗金融词和平台禁词。', mode: 'auto', state: '强制启用', metric: 'P0' },
      { id: 'format', icon: '↵', title: '发布格式', desc: '输出标题、摘要、正文、标签、CTA 和封面文案。', mode: 'suggest', state: '可选', metric: '6 段式' }
    ],
    sources: [
      ['品牌话术', '已同步', 'v3'],
      ['产品资料', '已绑定', '28 份'],
      ['平台规则', '已启用', '6 平台'],
      ['敏感词库', '强制启用', 'P0'],
      ['客户案例', '需确认', '不可编造']
    ],
    rules: [
      '禁止编造数据、案例和客户评价。',
      '敏感词检查强制开启，不允许关闭。',
      '客户评价、真实体验类内容必须人工确认来源。'
    ],
    templates: ['小红书种草', '公众号推文', '知乎回答', '广告文案'],
    risks: ['客户案例需确认来源', '敏感词检查强制启用'],
    test: {
      hit: ['平台类型', '内容模板', '标题策略', '敏感词检查'],
      data: ['产品卖点', '品牌话术', '平台规则', '禁用词库'],
      action: ['生成 5 个标题', '生成正文结构', '检查敏感词', '输出标签和 CTA'],
      output: '输出：5 个标题、1 篇正文、8 个标签、1 条 CTA，并附敏感词检查结果。',
      risk: '不编造体验和客户评价，案例来源需人工确认。'
    }
  }
};

const AC_DETAIL_PRESETS = {
  '新人资料模板': {
    purpose: 'AI 销售开口前先读人：身份、性格、家庭、收入、需求、禁忌。',
    fields: ['模板名称', 'AI 读取目标', '基础身份', '性格倾向', '家庭背景', '收入背景', '当前需求', '禁忌边界'],
    rules: ['资料不完整时，AI 先问 1 个轻问题补资料。', '命中“情绪异常/投诉/黑名单”立即暂停营销。', '不直接推商品，先判断新人类型。'],
    sources: ['新人资料模板', '通讯录客户资料', '历史聊天', '标签策略'],
    boundary: '不追问敏感隐私；收益承诺、家庭禁忌和人工确认项必须遵守。',
    sample: '杭州电商品牌负责人，预算 1-2 万，关注上线速度。'
  },
  '我的商品库': {
    purpose: '用户从平台商品中选择自己的主推商品，AI 按价格、卖点、人群和佣金推荐。',
    fields: ['商品名称', '价格', '适配人群', '卖点说明', '佣金等级', '推荐逻辑'],
    rules: ['商品价格未同步时不得自动报价。', '主推商品与预算不匹配时切换替代商品。', '佣金只影响内部推荐排序，不展示给客户。'],
    sources: ['我的商品库', '平台商品库', '价格表', '佣金规则'],
    boundary: '库存、价格、优惠、佣金未确认时禁止自动承诺。',
    sample: '有没有便宜点但效果接近的？'
  },
  '平台商品库': {
    purpose: '平台统一维护商品，用户按等级看到不同佣金，一键加入我的商品库。',
    fields: ['平台商品', '适配人群', '加入次数', '普通佣金', '银牌佣金', '黄金佣金', '钻石佣金'],
    rules: ['等级变化后，AI 报价和推荐优先级自动更新。', '未加入我的商品库的商品只做候选，不直接主推。', '平台商品下架后同步禁推。'],
    sources: ['平台商品库', '会员等级', '佣金配置', '我的商品库'],
    boundary: '平台佣金为内部配置，不对客户展示；最终价格以商品库为准。',
    sample: '黄金会员佣金按第三档显示。'
  },
  '营销思路': {
    purpose: '为不同新人类型配置 AI 的沟通打法：先选打法，再生成话术。',
    fields: ['信任建立型', '情绪共鸣型', '专家顾问型', '直接成交型', '优惠刺激型', '长期养熟型', '熟人推荐型', '复购激活型'],
    rules: ['陌生新人先建立信任，少推销。', '老板/创业者用诊断和 ROI 逻辑沟通。', '不得承诺收益、不得虚假限量、不得诋毁竞品。'],
    sources: ['新人资料模板', '标签策略', '商品库', '历史成交样例'],
    boundary: '情绪异常客户停止促单；营销打法只能辅助生成话术，不能越过禁区。',
    sample: '客户是老板、理性型、关注 ROI。'
  },
  '标签策略': {
    purpose: '标签不是备注，是 AI 销售选择打法、商品和跟进节奏的判断依据。',
    fields: ['意向标签', '消费标签', '关系标签', '性格标签', '场景标签', '暂停营销标签'],
    rules: ['低置信标签进入待确认，不覆盖人工标签。', '价格敏感标签会影响报价策略。', '情绪异常标签优先级最高，触发暂停营销。'],
    sources: ['聊天记录', '客户资料', '订单记录', '客服会话沉淀'],
    boundary: '不得生成歧视性、敏感身份类标签；人工标签优先于 AI 标签。',
    sample: '先看看，贵的话就算了。'
  },
  '跟进节奏': {
    purpose: '让 AI 知道什么时候说、说多少、何时促单、何时停止。',
    fields: ['T+0 首聊', 'T+1 培育', 'T+2 推荐', 'T+3 促单', 'T+7 复访', '异常暂停'],
    rules: ['同一客户 24 小时内最多 3 次主动触达。', '连续 2 次未回复自动降频。', '投诉 / 拒绝 / 情绪异常停止营销。'],
    sources: ['聊天状态', '客户标签', '商品推荐结果', '成交状态'],
    boundary: '不得高频骚扰客户；明确拒绝联系后停止自动跟进。',
    sample: '新人进来 5 分钟内首聊，资料完整后推荐。'
  },
  'FAQ 题库': {
    purpose: '客服助手先检索题库，再生成可发送回答；未命中进入待补充池。',
    fields: ['常见问题', '标准答案', '问题分类', '命中率', '待补充问题', '训练题库'],
    rules: ['未命中进入待补充池。', '低于 80% 的问题进入待优化。', '客户反复追问的顾虑沉淀给销售助手。'],
    sources: ['FAQ 题库', '历史人工会话', '产品说明', '售后规则'],
    boundary: '涉及金额、退款、投诉时不得只依赖 FAQ 自动回答。',
    sample: '订单多久发货？'
  },
  '售后规则': {
    purpose: '把退款、物流、发票、赔付边界写清楚，避免 AI 乱承诺。',
    fields: ['退款规则', '物流异常', '发票规则', '补偿规则', '示例工单', '人工确认边界'],
    rules: ['未发货直接退款；已发货需核验签收状态。', '48 小时无物流更新先安抚，再查询异常。', '超过 ¥50 赔付需人工确认。'],
    sources: ['售后政策', '订单状态', '物流状态', '财务规则'],
    boundary: '涉及争议金额、对公发票、赔付上限时必须人工确认。',
    sample: '赠品少发怎么办？'
  },
  '智能回答': {
    purpose: '控制 AI 客服的语气、引用依据、禁用承诺和复购插入时机。',
    fields: ['准确优先', '安抚优先', '复购友好', '合规保守', '回复预览', '禁用承诺'],
    rules: ['必须引用 FAQ 或售后规则后再回答。', '客户情绪异常时先共情，再处理问题。', '售后完成且满意后才允许轻推荐。'],
    sources: ['FAQ 题库', '售后规则', '情绪安抚', '复购引导'],
    boundary: '不得使用马上到账、一定赔付、绝对没问题、保证满意等承诺。',
    sample: '赠品没收到。'
  },
  '情绪安抚': {
    purpose: '识别负面情绪等级，决定继续 AI 接待、生成工单或立即转人工。',
    fields: ['L1 轻微不满', 'L2 明显焦虑', 'L3 愤怒投诉', 'L4 威胁曝光', '安抚话术原则'],
    rules: ['先承认客户感受，再给可验证动作。', 'L3 生成工单并转人工。', 'L4 不再自动承诺，立即人工介入。'],
    sources: ['当前会话', '情绪词库', '历史投诉', '转人工规则'],
    boundary: '不解释过多，不甩锅，不在情绪未恢复前推荐商品。',
    sample: '你们怎么这么慢，我要投诉。'
  },
  '复购引导': {
    purpose: '售后不是终点，满意后把服务会话转成下一次购买机会。',
    fields: ['售后已解决', '高频咨询', '老客回访', '负面恢复', '数据流向'],
    rules: ['客户满意 / 问题关闭 24 小时后才可引导。', '负面恢复后只做关系维护，延迟推荐。', '服务数据同步为销售助手客户标签。'],
    sources: ['客服会话', '满意度', '问题类型', '客户标签', '销售助手'],
    boundary: '售后未解决、情绪异常或投诉中禁止复购推荐。',
    sample: '问题解决了，谢谢。'
  },
  '转人工规则': {
    purpose: '定义哪些场景必须停下 AI，交给人工处理，并把上下文带过去。',
    fields: ['投诉/威胁曝光', '退款争议金额 > ¥50', '合同/发票/对公异常', 'AI 连续 2 次未解决', '转人工附带信息'],
    rules: ['高风险场景先保护客户关系。', '转人工前生成聊天摘要。', '人工接管后 AI 只做旁路建议。'],
    sources: ['聊天摘要', '命中 FAQ', '情绪等级', 'AI 已承诺事项'],
    boundary: '转人工后 AI 不再直接回复客户，只保留建议和复盘。',
    sample: '我要找真人客服。'
  },
  '录音设置': {
    purpose: '配置 AI 会议助手如何录音、何时转写、哪些场景必须保留原始音频。',
    fields: ['标准转写', '高精度转写', '只录音不转写', '采样率', '原音保留', '敏感词保留原音'],
    rules: ['会议开始后自动提醒是否开启录音。', '客户会议默认高精度。', '检测到敏感词时保留原始音频，便于复核。'],
    sources: ['会议录音', '麦克风轨道', '会议类型', '敏感词规则'],
    boundary: '敏感录音未经确认不得上传外部服务；录音开启需提醒。',
    sample: '客户需求评审会开始录音。'
  },
  '发言分离': {
    purpose: '把一段录音拆成不同说话人，并标注角色，纪要才不会混乱。',
    fields: ['主持人', '客户方', '销售方', '技术方', '低置信度处理'],
    rules: ['自动识别高频发起问题者。', '客户方优先沉淀需求与风险。', '同一声纹低于 70% 置信度时标为待确认发言人。'],
    sources: ['声纹特征', '参会人名单', '组织角色', '历史会议'],
    boundary: '说话人低置信不得强行归属；外部客户不自动分配内部任务。',
    sample: '这段是谁说的？'
  },
  '纪要模板': {
    purpose: '会议结束后不是生成流水账，而是输出可执行、可追踪、可复盘的结构化纪要。',
    fields: ['会议背景', '关键结论', '争议与风险', '客户意图', '行动项', '销售跟进'],
    rules: ['先写结论，再写过程。', '无法确认的内容标记“待确认”。', '禁止把推测写成事实。'],
    sources: ['转写文本', '发言分离', '会议类型', '历史纪要'],
    boundary: '未确认事项不得写成已决策；争议点必须单列。',
    sample: '帮我整理这次客户需求评审会。'
  },
  '行动项': {
    purpose: '把会议中的“回头再说”变成有负责人、有截止时间、有提醒的待办。',
    fields: ['任务内容', '负责人', '截止时间', '优先级', '自动提醒', '销售同步'],
    rules: ['行动项确认后同步到会议详情和消息提醒。', '涉及客户转化的待办同步给 AI 销售助手。', '责任人缺失标记待确认。'],
    sources: ['转写文本', '发言人角色', '团队成员', '日程同步'],
    boundary: '不得把建议性讨论直接变成正式任务；创建任务需确认。',
    sample: '确认报价边界，今天 18:00 前完成。'
  },
  '日程同步': {
    purpose: '让会议助手知道会议从哪里来、什么时候提醒、会后跟进到哪里去。',
    fields: ['IM 内会议', '系统日历', '客户跟进', '下一场会议', '权限边界'],
    rules: ['会前 10 分钟提醒开启录音。', '会后回访时间写入销售提醒。', '只读取会议标题、时间、参会人和链接。'],
    sources: ['IM 会议', '系统日历', '客户跟进表', '会议邀请'],
    boundary: '不读取私人日历正文，不保存外部账号密钥。',
    sample: '15:30 VIC 客户需求评审，会前提醒录音。'
  },
  '双语翻译': {
    purpose: '跨境会议不只翻译文字，还要保留角色、结论、行动项和专业术语。',
    fields: ['中英双语纪要', '实时字幕', '术语词库', '人工复核', '低置信译文'],
    rules: ['产品名、人名、品牌名优先使用词库。', '低置信度译文标记需确认。', '重要纪要导出前人工确认。'],
    sources: ['转写文本', '术语词库', '发言人角色', '会议模板'],
    boundary: '低置信译文不直接进入正式纪要；合同/报价场景需人工复核。',
    sample: '客户希望下周确认报价边界。'
  },
  '品牌规范': {
    purpose: '让设计 Agent 按品牌 Logo、色彩、字体和版式规范输出。',
    fields: ['Logo', '品牌色', '字体', '版式规范', '品牌禁区', '替代字体'],
    rules: ['品牌色强制校验。', 'Logo 不得拉伸变形。', '非品牌字体需要替代说明。'],
    sources: ['品牌手册', 'Logo 文件', '字体规范', '历史设计稿'],
    boundary: '品牌规范冲突时不生成最终稿，只输出问题清单。',
    sample: '做一张符合品牌规范的活动图。'
  },
  '素材库': {
    purpose: '配置设计 Agent 可以使用哪些商品图、人物图和历史素材。',
    fields: ['商品图', '人物图', '场景图', '图标', '历史设计稿', '授权素材'],
    rules: ['未授权素材不得用于最终稿。', '过期素材自动提醒。', '素材缺失时生成占位建议。'],
    sources: ['素材库', '授权记录', '商品图库', '历史稿件'],
    boundary: '版权不明素材必须人工确认。',
    sample: '用现有素材做一张新品海报。'
  },
  '风格模板': {
    purpose: '配置不同设计场景下可用的风格模板。',
    fields: ['电商促销', '品牌海报', '活动页', '科技风', '小红书封面', 'App UI'],
    rules: ['默认生成多版方案。', '跨风格混合需确认。', '模板优先级影响生成顺序。'],
    sources: ['模板库', '品牌规范', '历史方案', '平台规格'],
    boundary: '最终选版和交付需人工确认。',
    sample: '给我三个不同风格的主视觉方向。'
  },
  '尺寸规格': {
    purpose: '配置设计输出的尺寸、安全区和多平台适配。',
    fields: ['小红书', '抖音', '公众号', 'Banner', '海报', 'App 页面'],
    rules: ['尺寸错误禁止导出。', '自动生成多平台版本。', '安全区冲突生成警告。'],
    sources: ['平台规格', '设计模板', '导出配置', '安全区规则'],
    boundary: '未配置尺寸的场景只生成建议，不导出成品。',
    sample: '同一张图适配小红书和公众号。'
  },
  '禁用元素': {
    purpose: '控制设计中的违规颜色、图片、素材和敏感表达。',
    fields: ['禁用颜色', '禁用图片', '侵权素材', '低俗元素', '敏感词', '错误 Logo'],
    rules: ['命中禁用元素阻止导出。', '疑似侵权素材进入人工确认。', '禁用词在画面文案中高亮提示。'],
    sources: ['禁用词库', '违规素材库', '品牌规范', '合规规则'],
    boundary: '禁用元素命中后不得自动绕过。',
    sample: '检查这张海报有没有违规元素。'
  },
  '审核清单': {
    purpose: '设计输出前自动检查品牌、尺寸、可读性和素材授权。',
    fields: ['品牌一致性', '尺寸正确', '文字可读', '留白', '对齐', '素材授权'],
    rules: ['检查不通过生成修改建议。', '严重风险阻止导出。', '允许人工跳过但记录原因。'],
    sources: ['设计稿', '品牌规范', '素材授权', '尺寸规格'],
    boundary: '最终交付前需要人工确认审核结果。',
    sample: '帮我检查这版图能不能交付。'
  },
  '脚本模板': {
    purpose: '配置视频 Agent 生成不同视频类型脚本的结构。',
    fields: ['种草视频', '带货视频', '产品介绍', '知识科普', '客户案例', '活动预告'],
    rules: ['前三秒必须有钩子。', '强营销表达需人工确认。', '脚本长度按平台限制生成。'],
    sources: ['脚本模板', '产品卖点', '历史视频', '平台规则'],
    boundary: '不得编造案例、体验和效果承诺。',
    sample: '写一个 30 秒产品介绍脚本。'
  },
  '分镜规则': {
    purpose: '配置镜头数量、时长、转场和 CTA 节奏。',
    fields: ['镜头数量', '镜头时长', '开场镜头', '产品展示', '转场节奏', '结尾 CTA'],
    rules: ['短视频默认 6 个镜头以内。', '前三秒强制展示痛点或利益点。', '分镜进入成片前需确认。'],
    sources: ['脚本', '素材库', '平台规格', '视频模板'],
    boundary: '涉及真人/数字人出镜时需人工确认素材授权。',
    sample: '把这个脚本拆成分镜。'
  },
  '平台规格': {
    purpose: '配置抖音、小红书、视频号等平台尺寸、时长和禁词。',
    fields: ['默认平台', '尺寸比例', '视频时长', '封面比例', '平台禁词', '发布限制'],
    rules: ['按平台自动适配尺寸。', '平台禁词命中后给替换建议。', '超过时长自动拆分建议。'],
    sources: ['平台规则', '发布规范', '标题标签', '封面模板'],
    boundary: '发布动作默认关闭，需人工确认。',
    sample: '适配成抖音和小红书两个版本。'
  },
  '字幕规则': {
    purpose: '配置字幕样式、断句、关键词高亮和双语字幕。',
    fields: ['字幕位置', '字号', '关键词高亮', '双语字幕', '字幕断句', '错别字检查'],
    rules: ['字幕不遮挡主体。', '关键词高亮不超过每屏 2 个。', '自动翻译需人工确认。'],
    sources: ['脚本', '转写文本', '字幕模板', '品牌字体'],
    boundary: '专业术语和外语翻译需人工确认。',
    sample: '给这段视频生成字幕。'
  },
  '素材来源': {
    purpose: '配置视频能使用的商品图、历史视频、BGM、数字人和品牌素材。',
    fields: ['商品图', '历史视频', 'BGM', '数字人', '品牌素材', '外部素材'],
    rules: ['BGM 必须确认授权。', '外部素材默认禁用。', '素材缺失时输出补拍建议。'],
    sources: ['素材库', 'BGM 库', '数字人库', '授权记录'],
    boundary: '版权不明确素材不得进入成片。',
    sample: '用已有素材剪一个产品介绍。'
  },
  '发布检查': {
    purpose: '视频发布前检查合规、版权、封面、标题和标签。',
    fields: ['敏感词', '夸张承诺', '版权音乐', '虚假功效', '封面规范', '标题标签'],
    rules: ['风险命中拦截发布。', '生成发布建议但不自动发布。', '标题标签需过敏感词检查。'],
    sources: ['成片信息', '平台规则', '版权记录', '敏感词库'],
    boundary: '发布前强制人工审核。',
    sample: '检查这个视频能不能发布。'
  },
  '平台类型': {
    purpose: '配置写作内容面向哪个平台以及平台表达限制。',
    fields: ['小红书', '公众号', '知乎', '抖音文案', '朋友圈', '广告投放'],
    rules: ['不同平台套用不同字数和结构。', '平台禁词强制检查。', '多平台输出生成差异版。'],
    sources: ['平台规则', '品牌话术', '历史内容', '禁词库'],
    boundary: '平台规则未配置时只生成通用建议。',
    sample: '把这段内容改成小红书风格。'
  },
  '内容模板': {
    purpose: '配置种草文、品牌稿、销售文案和知识文章的结构。',
    fields: ['种草文', '品牌稿', '销售文案', '知识文章', '活动通知', '产品介绍'],
    rules: ['保留人工大纲优先级。', '允许扩写但不得编造事实。', '模板字段缺失时提醒补齐。'],
    sources: ['内容模板', '产品资料', '品牌话术', '历史文章'],
    boundary: '真实案例、数据、客户评价必须有来源。',
    sample: '写一篇产品介绍文章。'
  },
  '标题策略': {
    purpose: '配置标题生成数量、长度和策略类型。',
    fields: ['数字标题', '痛点标题', '利益标题', '悬念标题', '对比标题', 'SEO 标题'],
    rules: ['禁止标题党。', '标题长度按平台限制。', '一次生成多个标题供选择。'],
    sources: ['标题模板', '关键词', '平台规则', '历史爆文'],
    boundary: '不能使用虚假承诺、极限词和不可验证数据。',
    sample: '给这篇文章生成 5 个标题。'
  },
  '关键词规则': {
    purpose: '配置必须出现、建议出现和禁止出现的关键词。',
    fields: ['品牌词', '产品卖点', 'SEO 关键词', '行业词', '禁用词', '竞品词'],
    rules: ['关键词密度不要机械堆叠。', '竞品词默认禁止。', '缺失核心卖点时提醒补充。'],
    sources: ['关键词库', '产品资料', 'SEO 规则', '竞品词库'],
    boundary: '竞品攻击、虚假对比和违规词必须拦截。',
    sample: '这篇文章要带上品牌词和三个卖点。'
  },
  '敏感词检查': {
    purpose: '发布前检查极限词、医疗金融词、虚假承诺和平台禁词。',
    fields: ['极限词', '医疗词', '金融词', '虚假承诺', '平台禁词', '替换建议'],
    rules: ['严重风险直接拦截。', '普通风险给替换建议。', '敏感词检查强制开启。'],
    sources: ['敏感词库', '平台规则', '行业合规', '历史违规'],
    boundary: '该功能不可关闭；高风险内容必须人工审核。',
    sample: '检查这段文案有没有违规词。'
  },
  '发布格式': {
    purpose: '配置最终输出为标题、摘要、正文、标签、CTA 和封面文案。',
    fields: ['标题', '摘要', '正文', '标签', 'CTA', '封面文案'],
    rules: ['按平台生成对应格式。', '输出前生成审核清单。', '一键复制不等于自动发布。'],
    sources: ['内容草稿', '平台模板', '标签库', '审核规则'],
    boundary: '发布动作需人工确认。',
    sample: '输出一版可以直接复制的小红书格式。'
  }
};

let activeAgentCenterId = 'meeting';  // M3: 默认改为免费助手（销售/客服已升级为专家）
let activeAgentCenterModuleId = null;
let activeAgentCenterFieldIndex = null;

function initAgentCenter() {
  renderAgentCenter(activeAgentCenterId);
}

function openAgentCenter(agentId = activeAgentCenterId) {
  const nextAgentId = agentId || 'sales';
  if (nextAgentId !== activeAgentCenterId) {
    activeAgentCenterModuleId = null;
    activeAgentCenterFieldIndex = null;
  }
  activeAgentCenterId = nextAgentId;
  if (typeof closeMessageDetail === 'function') closeMessageDetail();
  if (typeof closeChatPanel === 'function') closeChatPanel();
  if (typeof unfocusScreen === 'function') unfocusScreen();

  document.querySelectorAll('.side-tab').forEach(tab => tab.classList.remove('is-active'));
  document.querySelectorAll('.side-panel').forEach(panel => panel.classList.add('is-hidden'));
  document.querySelectorAll('.stage-view').forEach(view => {
    view.classList.toggle('is-active', view.dataset.stage === 'agent-center');
  });
  document.querySelectorAll('.side-foot-btn').forEach(btn => {
    btn.classList.toggle('is-active', btn.dataset.sideFoot === 'agent-center');
  });
  renderAgentCenter(activeAgentCenterId);
}

function acEscape(s) {
  return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function renderAgentCenter(agentId = 'meeting') {
  const root = document.getElementById('agentCenterRoot');
  const agent = getAgent(agentId) || HELPERS[0];
  const cfg = AGENT_FUNCTION_CONFIGS[agent.id] || AGENT_FUNCTION_CONFIGS.sales;
  if (!root || !agent || !cfg) return;
  const activeModule = activeAgentCenterModuleId
    ? cfg.modules.find(module => module.id === activeAgentCenterModuleId)
    : null;

  root.style.setProperty('--agent-color', agent.color);
  root.style.setProperty('--agent-soft', agent.colorSoft);
  root.innerHTML = `
    <aside class="agent-center-rail">
      <div class="agent-center-rail-head">
        <span class="kicker-tag">AGENTS · FUNCTION</span>
        <strong>功能配置台</strong>
        <p>选择 Agent，配置能力、资料、规则和确认边界。</p>
      </div>
      <div class="agent-center-agent-list">
        ${HELPERS.map(a => {
          const itemCfg = AGENT_FUNCTION_CONFIGS[a.id] || AGENT_FUNCTION_CONFIGS.sales;
          return `
            <button class="agent-center-agent ${a.id === agent.id ? 'is-active' : ''}" data-agent-center-id="${a.id}" style="--c:${a.color};--soft:${a.colorSoft}">
              <span class="agent-center-avatar">${a.icon}</span>
              <span class="agent-center-agent-copy">
                <strong>${acEscape(a.name)}</strong>
                <em class="mono">已启用 ${itemCfg.enabled}/${itemCfg.total} · ${acEscape(itemCfg.status)}</em>
              </span>
              <span class="agent-center-health mono">${acEscape(itemCfg.health)}</span>
            </button>
          `;
        }).join('')}
      </div>

      <!-- M3: 助手 vs 专家差异说明 -->
      <div class="agent-center-helper-expert-split">
        <div class="agent-center-split-head">
          <span class="kicker-tag">EXPERT</span>
          <strong>需要更高质量？</strong>
        </div>
        <p class="agent-center-split-desc">助手是公司里的实习生，专家是从外部请来的顾问。销售 / 客服已升级为付费专家。</p>
        <div class="agent-center-expert-cards">
          ${EXPERT_AGENTS.map(e => `
            <button class="agent-center-expert-card" data-nav="hire-center" data-expert="${e.id}" style="--c:${e.color};--soft:${e.colorSoft}">
              <span class="agent-center-expert-icon">${e.icon}</span>
              <span class="agent-center-expert-body">
                <strong>${acEscape(e.name)}</strong>
                <em class="mono">¥${e.priceUMDT} UMDT · ${e.requireLevel}+</em>
                <span>${acEscape(e.role)}</span>
              </span>
              <em class="agent-center-expert-arrow">›</em>
            </button>
          `).join('')}
        </div>
        <button class="agent-center-mini-btn" data-nav="hire-center" style="margin-top:10px;width:100%">前往雇佣中心</button>
      </div>
    </aside>

    <section class="agent-center-main">
      <div class="agent-center-hero" style="--c:${agent.color};--soft:${agent.colorSoft}">
        <div>
          <span class="agent-center-kicker mono">FUNCTION CONFIG · ${acEscape(agent.en)}</span>
          <h2>${acEscape(cfg.title)}</h2>
          <p>${acEscape(cfg.subtitle)}</p>
        </div>
        <div class="agent-center-status-card">
          <span class="agent-center-avatar big">${agent.icon}</span>
          <strong>${acEscape(cfg.enabled)}/${acEscape(cfg.total)} 功能启用</strong>
          <em class="mono">完整度 ${acEscape(cfg.health)}</em>
        </div>
      </div>

      ${activeModule ? (activeAgentCenterFieldIndex !== null ? renderConfigItemDetail(agent, cfg, activeModule, activeAgentCenterFieldIndex) : renderModuleDetail(agent, cfg, activeModule)) : renderModuleList(cfg)}
    </section>

    <aside class="agent-center-preview">
      <div class="agent-center-preview-card">
        <span class="kicker-tag ${agent.id}">STATUS</span>
        <h3>当前功能状态</h3>
        <div class="agent-center-status-list">
          <div><span>启用功能</span><strong>${acEscape(cfg.enabled)}/${acEscape(cfg.total)}</strong></div>
          <div><span>配置完整度</span><strong>${acEscape(cfg.health)}</strong></div>
          <div><span>运行状态</span><strong>${acEscape(cfg.status)}</strong></div>
        </div>
      </div>

      <div class="agent-center-test-card">
        <div class="agent-center-test-head">
          <span class="kicker-tag">TEST RUN</span>
          <button class="agent-center-mini-btn" data-agent-center-action="test">测试运行</button>
        </div>
        <textarea class="agent-center-test-input" id="agentCenterTestInput">${acEscape(cfg.defaultTest)}</textarea>
        <div class="agent-center-test-result" id="agentCenterTestResult">
          ${renderTestResult(cfg.test, false)}
        </div>
      </div>

      <div class="agent-center-risk-card">
        <span class="kicker-tag">RISK</span>
        <h3>权限边界</h3>
        <ul>
          ${cfg.risks.map(risk => `<li>${acEscape(risk)}</li>`).join('')}
        </ul>
      </div>

      <div class="agent-center-actions">
        <button class="agent-center-btn is-secondary" data-agent-center-action="reset">重置配置</button>
        <button class="agent-center-btn is-primary" data-agent-center-action="save">保存配置</button>
      </div>
      <div class="agent-center-note mono">演示版：当前配置只做前端预览，不写入数据库。</div>
    </aside>
  `;
  bindAgentCenterEvents();
}

function renderModuleList(cfg) {
  return `
    <div class="agent-center-section-head">
      <div>
        <span class="kicker-tag">MODULES</span>
        <h3>功能模块矩阵</h3>
      </div>
      <p>四档状态：自动执行 / 人工确认 / 仅建议 / 关闭</p>
    </div>
    <div class="agent-center-module-grid">
      ${cfg.modules.map(module => renderFunctionModule(module)).join('')}
    </div>

    <div class="agent-center-lower-grid">
      ${renderSourceBlock(cfg.sources)}
      ${renderRuleBlock(cfg.rules)}
      ${renderTemplateBlock(cfg.templates)}
    </div>
  `;
}

function renderFunctionModule(module) {
  return `
    <article class="agent-center-module" data-ac-module-id="${acEscape(module.id)}" data-ac-module="${acEscape(module.title)}">
      <div class="agent-center-module-top">
        <span class="agent-center-module-icon">${module.icon}</span>
        <span class="agent-center-mode is-${module.mode}">${AC_MODE_LABELS[module.mode]}</span>
      </div>
      <h3>${acEscape(module.title)}</h3>
      <p>${acEscape(module.desc)}</p>
      <div class="agent-center-module-meta">
        <span>${acEscape(module.state)}</span>
        <strong class="mono">${acEscape(module.metric)}</strong>
      </div>
      <button type="button" class="agent-center-module-btn" data-agent-center-module-id="${acEscape(module.id)}">进入配置</button>
    </article>
  `;
}

function getModuleDetail(module) {
  return AC_DETAIL_PRESETS[module.title] || {
    purpose: module.desc,
    fields: ['启用状态', '配置字段', '数据来源', '执行规则', '输出模板', '人工确认'],
    rules: ['低置信度只生成建议。', '涉及外部动作时必须人工确认。', '保存后仅作为演示状态，不写入数据库。'],
    sources: ['当前 Agent 数据', '业务资料', '规则模板', '历史记录'],
    boundary: '高风险动作、外发动作、不可逆动作必须人工确认。',
    sample: module.desc
  };
}

function renderModuleDetail(agent, cfg, module) {
  const detail = getModuleDetail(module);
  return `
    <div class="agent-center-detail">
      <div class="agent-center-detail-head">
        <button class="agent-center-back" type="button" data-agent-center-action="back">← 返回功能列表</button>
        <span class="agent-center-mode is-${module.mode}">${AC_MODE_LABELS[module.mode]}</span>
      </div>

      <section class="agent-center-detail-hero" style="--c:${agent.color};--soft:${agent.colorSoft}">
        <div class="agent-center-detail-icon">${module.icon}</div>
        <div>
          <span class="agent-center-kicker mono">${acEscape(agent.name)} / ${acEscape(module.title)}</span>
          <h3>${acEscape(module.title)}</h3>
          <p>${acEscape(detail.purpose)}</p>
        </div>
        <div class="agent-center-detail-status mono">
          <strong>${acEscape(module.state)}</strong>
          <span>${acEscape(module.metric)}</span>
        </div>
      </section>

      <div class="agent-center-detail-grid">
        <article class="agent-center-detail-card is-wide">
          <div class="agent-center-block-head">
            <h3>配置项</h3>
            <span class="mono">CONFIG ITEMS</span>
          </div>
          <div class="agent-center-config-list">
            ${detail.fields.map((field, index) => renderDetailConfigRow(field, index, module)).join('')}
          </div>
        </article>

        <article class="agent-center-detail-card">
          <div class="agent-center-block-head">
            <h3>数据来源</h3>
            <span class="mono">DATA</span>
          </div>
          <div class="agent-center-detail-source-list">
            ${detail.sources.map((source, index) => `
              <div><span>${acEscape(source)}</span><em>${index % 2 === 0 ? '已启用' : '待确认'}</em></div>
            `).join('')}
          </div>
        </article>

        <article class="agent-center-detail-card is-wide">
          <div class="agent-center-block-head">
            <h3>执行规则</h3>
            <span class="mono">RULES</span>
          </div>
          <ol class="agent-center-rule-list">
            ${detail.rules.map((rule, index) => `<li><em class="mono">0${index + 1}</em><span>${acEscape(rule)}</span></li>`).join('')}
          </ol>
        </article>

        <article class="agent-center-detail-card">
          <div class="agent-center-block-head">
            <h3>人工确认边界</h3>
            <span class="mono">BOUNDARY</span>
          </div>
          <p class="agent-center-boundary-copy">${acEscape(detail.boundary)}</p>
        </article>

        <article class="agent-center-detail-card is-wide">
          <div class="agent-center-block-head">
            <h3>测试样例</h3>
            <span class="mono">TEST CASE</span>
          </div>
          <div class="agent-center-detail-test-line">
            <span>输入</span>
            <strong>${acEscape(detail.sample)}</strong>
          </div>
        </article>
      </div>
    </div>
  `;
}

function renderDetailConfigRow(field, index, module) {
  const controlTypes = ['四档状态', '规则配置', '数据绑定', '阈值设置', '模板选择', '人工确认'];
  const mode = index === 0 ? AC_MODE_LABELS[module.mode] : controlTypes[index % controlTypes.length];
  return `
    <div class="agent-center-config-row">
      <div>
        <strong>${acEscape(field)}</strong>
        <span>${acEscape(mode)}</span>
      </div>
      <button type="button" data-agent-center-field-index="${index}">配置</button>
    </div>
  `;
}

const AC_BUSINESS_LEVEL3 = {
  "sales": {
    "profile": {
      "title": "新人资料模板",
      "code": "NEWCOMER PROFILE TEMPLATE",
      "summary": "AI 销售开口前先读人：身份、性格、家庭、收入、需求、禁忌。资料不完整时先补一个轻问题，不直接推商品。",
      "metrics": [{"label":"资料字段","value":"6","note":"身份/性格/家庭/收入/需求/禁忌"},{"label":"自动标签","value":"12","note":"由资料生成"},{"label":"策略生成","value":"3s","note":"先判断新人类型"}],
      "board": "字段结构",
      "rows": [{"name":"基础身份","tag":"必填","meta":"姓名/性别/年龄/城市/来源渠道","action":"配置字段"},{"name":"性格倾向","tag":"判断","meta":"理性/感性/谨慎/冲动/话多/沉默","action":"维护选项"},{"name":"家庭背景","tag":"场景","meta":"宝妈/单身/已婚/家庭决策者/子女教育","action":"设置场景"},{"name":"禁忌边界","tag":"风控","meta":"不谈收益承诺/不催单/不提家庭/需人工确认","action":"编辑边界"}],
      "rules": ["资料不完整时，AI 先问 1 个轻问题补资料。","命中情绪异常、投诉、黑名单立即暂停营销。","先判断新人类型，再选择营销思路。"],
      "workflow": ["读取基础身份","判断需求和预算","生成沟通策略","进入商品推荐"],
      "preview": {"label":"当前编辑","input":"林小夏 · 企业版意向客户","output":"杭州电商品牌负责人，团队 18 人，预算 1-2 万；先给清晰方案，再给报价。"},
      "boundary": "不追问敏感隐私；收益承诺、家庭禁忌和人工确认项必须遵守。",
      "actions": ["保存模板", "新增字段", "运行读取预览"]
    },
    "products": {
      "title": "我的商品库",
      "code": "MY PRODUCT LIBRARY",
      "summary": "用户从平台商品中选择自己的主推商品，AI 按价格、卖点、人群和佣金推荐。",
      "metrics": [{"label":"主推商品","value":"4","note":"入门/进阶/团队/陪跑"},{"label":"佣金档","value":"4","note":"普通/银牌/黄金/钻石"},{"label":"推荐逻辑","value":"已启用","note":"按客户标签匹配"}],
      "board": "商品列表",
      "rows": [{"name":"私域增长入门包","tag":"¥199","meta":"适合陌生新人/预算有限 · 普通10%/银牌15%/黄金20%/钻石25%","action":"编辑商品"},{"name":"AI 销售进阶包","tag":"¥699","meta":"适合高意向/愿意投资 · 普通12%/银牌18%/黄金24%/钻石30%","action":"训练卖点"},{"name":"团队版工具包","tag":"¥1999","meta":"适合老板/创业团队 · 普通15%/银牌20%/黄金28%/钻石35%","action":"配置权益"},{"name":"年度陪跑服务","tag":"¥5999","meta":"适合高净值/长期养熟 · 普通18%/银牌25%/黄金32%/钻石40%","action":"设置边界"}],
      "rules": ["价格敏感客户先低门槛体验，再引导升级。","老板/团队客户强调效率、管理、ROI。","高净值客户强调长期回报和专属服务。"],
      "workflow": ["读取客户标签","筛选我的商品","匹配价格和人群","生成推荐理由"],
      "preview": {"label":"客户输入","input":"有没有便宜点但效果接近的？","output":"推荐私域增长入门包，保留核心价值，降低首次购买门槛。"},
      "boundary": "库存、价格、优惠、佣金未确认时禁止自动承诺。",
      "actions": ["手动添加", "从平台加入", "训练卖点"]
    },
    "platformProducts": {
      "title": "平台商品库",
      "code": "PLATFORM PRODUCT LIBRARY",
      "summary": "平台统一维护商品，用户按等级看到不同佣金，一键加入我的商品库。",
      "metrics": [{"label":"当前等级","value":"黄金","note":"佣金按第三档显示"},{"label":"平台商品","value":"4 类","note":"课程/年卡/增长营/陪跑"},{"label":"加入次数","value":"250","note":"样例商品合计"}],
      "board": "平台商品",
      "rows": [{"name":"平台标准课","tag":"¥299","meta":"适合新人入门 · 已加入 128 次 · 10%/15%/20%/25%","action":"加入"},{"name":"私域工具年卡","tag":"¥1688","meta":"适合私域从业者 · 已加入 76 次 · 12%/18%/24%/30%","action":"加入"},{"name":"老板增长营","tag":"¥3999","meta":"适合老板/创业者 · 已加入 34 次 · 15%/22%/30%/38%","action":"加入"},{"name":"高客单陪跑","tag":"¥9999","meta":"适合高净值客户 · 已加入 12 次 · 18%/25%/35%/45%","action":"加入"}],
      "rules": ["商品佣金由平台统一配置。","用户等级变化后，AI 报价和推荐优先级自动更新。","未加入我的商品库的商品不直接主推。"],
      "workflow": ["读取会员等级","展示对应佣金","一键加入我的商品库","同步推荐优先级"],
      "preview": {"label":"等级显示","input":"黄金会员","output":"佣金按第三档显示，并影响 AI 推荐排序。"},
      "boundary": "平台佣金为内部配置，不对客户展示；最终价格以商品库为准。",
      "actions": ["同步平台库", "加入商品", "预览佣金"]
    },
    "playbook": {
      "title": "营销思路",
      "code": "MARKETING PLAYBOOK",
      "summary": "为不同新人类型配置 AI 的沟通打法：先选打法，再生成话术。",
      "metrics": [{"label":"打法","value":"8","note":"信任/共鸣/专家/成交等"},{"label":"决策链","value":"5步","note":"资料→标签→商品→打法→节奏"},{"label":"禁区","value":"4","note":"收益/稀缺/竞品/情绪"}],
      "board": "打法库",
      "rows": [{"name":"信任建立型","tag":"陌生新人/谨慎型","meta":"先建立共同点，少推销，多解释身份和价值边界。","action":"编辑打法"},{"name":"情绪共鸣型","tag":"宝妈/感性型","meta":"先共情处境，再给轻量可执行的方案。","action":"配置话术"},{"name":"专家顾问型","tag":"老板/创业者/理性型","meta":"用诊断和 ROI 逻辑沟通，强调决策依据。","action":"设置证据"},{"name":"直接成交型","tag":"高意向/已多次咨询","meta":"聚焦价格、权益、下单路径，减少闲聊。","action":"配置促单"}],
      "rules": ["先选打法，再生成话术。","不得承诺收益、不得虚假限量、不得诋毁竞品。","情绪异常客户不得继续促单。"],
      "workflow": ["新人资料", "客户标签", "商品匹配", "营销思路", "跟进节奏"],
      "preview": {"label":"客户画像","input":"老板 / 创业者 / 理性型 / 关注 ROI","output":"启用专家顾问型：用诊断和 ROI 逻辑沟通。"},
      "boundary": "营销打法只能辅助生成话术，不能越过禁区。",
      "actions": ["保存打法", "新增打法", "生成话术预览"]
    },
    "tags": {
      "title": "标签策略",
      "code": "TAG STRATEGY",
      "summary": "标签不是备注，是 AI 销售选择打法、商品和跟进节奏的判断依据。",
      "metrics": [{"label":"标签组","value":"5","note":"意向/消费/关系/性格/场景"},{"label":"打法映射","value":"6","note":"标签→Playbook"},{"label":"同步消息","value":"开启","note":"消息页可用"}],
      "board": "标签到策略",
      "rows": [{"name":"高意向","tag":"直接成交型","meta":"连续询价 / 点击商品卡 / 主动问付款方式","action":"配置阈值"},{"name":"价格敏感","tag":"优惠刺激型","meta":"反复问折扣 / 预算有限 / 对比价格","action":"维护关键词"},{"name":"陌生新人","tag":"信任建立型","meta":"来源陌生 / 没有共同关系 / 回复慢","action":"设置规则"},{"name":"情绪异常","tag":"暂停营销","meta":"投诉、愤怒、讽刺、强烈拒绝","action":"编辑风控"}],
      "rules": ["标签决定打法、商品和跟进节奏。","低置信标签进入待确认，不覆盖人工标签。","情绪异常标签优先级最高。"],
      "workflow": ["识别语义", "生成标签", "映射营销思路", "影响跟进节奏"],
      "preview": {"label":"命中片段","input":"先看看，贵的话就算了。","output":"标签：价格敏感；打法：优惠刺激型；商品：低门槛入门包。"},
      "boundary": "不得生成歧视性、敏感身份类标签；人工标签优先于 AI 标签。",
      "actions": ["新建标签", "自动打标规则", "同步消息页"]
    },
    "followup": {
      "title": "跟进节奏",
      "code": "FOLLOW-UP CADENCE",
      "summary": "让 AI 知道什么时候说、说多少、何时促单、何时停止。",
      "metrics": [{"label":"首触达","value":"5 min","note":"新人进来 5 分钟内"},{"label":"促单上限","value":"3次","note":"24小时内"},{"label":"复访周期","value":"7天","note":"未成交低频回访"}],
      "board": "节奏阶梯",
      "rows": [{"name":"T+0 首聊","tag":"5 分钟内","meta":"轻破冰 + 补资料，不直接硬推。","action":"编辑首聊"},{"name":"T+1 培育","tag":"资料完整后","meta":"发送匹配案例 / 价值说明 / 低压力提问。","action":"设置培育"},{"name":"T+3 促单","tag":"高意向/反复询价","meta":"报价、权益、佣金/收益逻辑、下单路径。","action":"配置促单"},{"name":"异常暂停","tag":"投诉/拒绝/情绪异常","meta":"停止营销，标记人工介入。","action":"编辑暂停"}],
      "rules": ["同一客户 24 小时内最多 3 次主动触达。","连续 2 次未回复自动降频。","投诉、拒绝、情绪异常立即停止营销。"],
      "workflow": ["首聊补资料", "培育价值", "推荐商品", "促单报价", "复访/暂停"],
      "preview": {"label":"节奏预览","input":"客户 24 小时未回复","output":"触发轻提醒；连续 2 次无回应后降频。"},
      "boundary": "不得高频骚扰客户；明确拒绝联系后停止自动跟进。",
      "actions": ["保存节奏", "新增阶段", "预览触达"]
    }
  },
  "customer": {
    "faq": {"title":"FAQ 题库","code":"CUSTOMER SERVICE FAQ","summary":"客服助手先检索题库，再生成可发送回答；未命中进入待补充池。","metrics":[{"label":"已启用 FAQ","value":"12","note":"订单/物流/退款/发票"},{"label":"今日命中率","value":"86%","note":"低于 80% 进入待优化"},{"label":"待补充问题","value":"7","note":"来自人工会话"}],"board":"高频问题","rows":[{"name":"订单多久发货？","tag":"物流咨询","meta":"付款后 24 小时内发货，预售品按商品页时间执行。","action":"编辑答案"},{"name":"可以退款吗？","tag":"退款售后","meta":"未发货可申请退款；已发货按售后规则核验。","action":"设置规则"},{"name":"赠品少发怎么办？","tag":"补发赔付","meta":"先道歉并核验订单，确认后补发赠品或等值券。","action":"训练题库"},{"name":"发票怎么开？","tag":"发票财务","meta":"收集抬头、税号、邮箱，1 个工作日内开具。","action":"配置字段"}],"rules":["先检索题库，再生成可发送回答。","未命中进入待补充池。","客户反复追问的商品、价格、售后顾虑同步给销售助手。"],"workflow":["客户提问","FAQ 检索","生成回答","低命中进入待补充"],"preview":{"label":"客户提问","input":"赠品没收到怎么办？","output":"先道歉并核验订单，确认少发后安排补发。"},"boundary":"金额、退款、投诉场景不得只依赖 FAQ 自动处理。","actions":["新增 FAQ","导入文档","训练题库"]},
    "afterSaleRules": {"title":"售后规则","code":"AFTER-SALE RULES","summary":"把退款、物流、发票、赔付边界写清楚，避免 AI 乱承诺。","metrics":[{"label":"规则类型","value":"4","note":"退款/物流/发票/补偿"},{"label":"人工介入率","value":"18%","note":"争议场景"},{"label":"满意度","value":"4.6","note":"售后评价"}],"board":"规则矩阵","rows":[{"name":"退款","tag":"争议金额转人工","meta":"未发货直接退款；已发货需核验签收状态","action":"编辑退款"},{"name":"物流","tag":"异常升级","meta":"48 小时无物流更新先安抚，再查询快递异常","action":"配置物流"},{"name":"发票","tag":"财务确认","meta":"收集抬头/税号/邮箱，不承诺立即开票","action":"设置发票"},{"name":"补偿","tag":"超过 ¥50 人工确认","meta":"少发/错发优先补发，无法补发给等值券","action":"配置赔付"}],"rules":["涉及争议金额时转人工。","连续 2 次物流异常升级工单。","超过 ¥50 赔付需人工确认。"],"workflow":["识别售后类型","核验订单状态","套用售后规则","生成工单/转人工"],"preview":{"label":"示例工单","input":"陈婉婷 · 赠品少发","output":"AI 先道歉 → 核验订单 → 承诺补发需确认 → 记录复购券机会。"},"boundary":"退款、赔付、对公发票和复杂争议必须人工确认。","actions":["保存规则","新增售后类型","生成示例工单"]},
    "smartReply": {"title":"智能回答","code":"SMART REPLY","summary":"控制 AI 客服的语气、引用依据、禁用承诺和复购插入时机。","metrics":[{"label":"回答模式","value":"4","note":"准确/安抚/复购/合规"},{"label":"回复预览","value":"2","note":"样例场景"},{"label":"禁用承诺","value":"5","note":"马上到账等"}],"board":"回答模式","rows":[{"name":"准确优先","tag":"active","meta":"必须引用 FAQ 或售后规则后再回答","action":"启用"},{"name":"安抚优先","tag":"情绪","meta":"客户情绪异常时先共情，再处理问题","action":"配置"},{"name":"复购友好","tag":"售后完成后","meta":"售后完成且满意后才允许轻推荐","action":"设置"},{"name":"合规保守","tag":"风险","meta":"遇到退款、投诉、金额争议自动降级","action":"配置"}],"rules":["先解决问题，再维护关系。","不在情绪异常时销售。","禁用马上到账、一定赔付、绝对没问题等承诺。"],"workflow":["读取问题","引用依据","判断情绪","生成可发送回答"],"preview":{"label":"回复预览","input":"客户说：你们怎么这么慢","output":"理解您着急，我先帮您查物流节点，如果异常会立即生成工单。"},"boundary":"不得编造政策、物流、赔付和库存信息。","actions":["保存回答模式","维护禁用承诺","生成回复预览"]},
    "emotionCare": {"title":"情绪安抚","code":"EMOTION CARE","summary":"识别负面情绪等级，决定继续 AI 接待、生成工单或立即转人工。","metrics":[{"label":"今日情绪风险","value":"05","note":"3 条已安抚 · 2 条转人工"},{"label":"等级","value":"L1-L4","note":"非水平阶梯"},{"label":"转人工","value":"L3+","note":"投诉/曝光"}],"board":"情绪阶梯","rows":[{"name":"L1 轻微不满","tag":"AI 处理","meta":"先道歉 + 解释流程","action":"配置话术"},{"name":"L2 明显焦虑","tag":"待跟进","meta":"承认情绪 + 给明确时间点","action":"设置提醒"},{"name":"L3 愤怒投诉","tag":"转人工","meta":"停止争辩 + 生成工单","action":"配置工单"},{"name":"L4 威胁曝光","tag":"立即人工","meta":"不再自动承诺","action":"设置P0"}],"rules":["先承认客户感受，再给可验证动作。","不解释过多，不甩锅。","情绪未恢复前不推荐商品。"],"workflow":["识别情绪词","判定等级","选择安抚策略","必要时转人工"],"preview":{"label":"客户情绪","input":"你们怎么回事，我要投诉！","output":"L3 愤怒投诉：停止争辩，生成工单并转人工。"},"boundary":"高风险情绪场景 AI 只能辅助，不独立做最终处理。","actions":["保存等级规则","新增情绪词","生成安抚预览"]},
    "repurchase": {"title":"复购引导","code":"REPURCHASE GUIDE","summary":"售后不是终点，满意后把服务会话转成下一次购买机会。","metrics":[{"label":"本周复购机会","value":"23","note":"来自客服会话"},{"label":"触发条件","value":"4","note":"售后/咨询/老客/恢复"},{"label":"同步对象","value":"销售助手","note":"服务→销售"}],"board":"触发条件","rows":[{"name":"售后已解决","tag":"24h 后","meta":"客户回复满意 / 问题关闭 24 小时后","action":"配置券"},{"name":"高频咨询","tag":"轻推荐","meta":"连续询问同类商品或服务权益","action":"设置推荐"},{"name":"老客回访","tag":"会员权益","meta":"30 天内购买 2 次以上","action":"配置回访"},{"name":"负面恢复","tag":"延迟推荐","meta":"投诉处理后评分 ≥4","action":"设置延迟"}],"rules":["满意后才允许轻推荐。","负面恢复只做关系维护，延迟推荐。","客服会话沉淀为销售标签。"],"workflow":["服务关闭","满意度判断","生成复购机会","同步销售助手"],"preview":{"label":"数据流向","input":"客服会话 → 满意度/问题类型/商品顾虑","output":"客户标签 → AI 销售助手二次营销判断。"},"boundary":"售后未解决、情绪异常或投诉中禁止复购推荐。","actions":["保存触发条件","同步销售标签","预览复购建议"]},
    "humanHandoff": {"title":"转人工规则","code":"HUMAN HANDOFF","summary":"定义哪些场景必须停下 AI，交给人工处理，并把上下文带过去。","metrics":[{"label":"触发规则","value":"4","note":"投诉/金额/发票/未解决"},{"label":"优先级","value":"P0-P2","note":"按风险分级"},{"label":"附带信息","value":"6项","note":"上下文摘要"}],"board":"触发规则","rows":[{"name":"投诉/威胁曝光","tag":"P0","meta":"立即停止 AI 自动回复","action":"配置P0"},{"name":"退款争议金额 > ¥50","tag":"P1","meta":"生成工单并附聊天摘要","action":"设置阈值"},{"name":"合同/发票/对公异常","tag":"P1","meta":"转财务或管理员确认","action":"配置对象"},{"name":"AI 连续 2 次未解决","tag":"P2","meta":"自动邀请人工接管","action":"设置次数"}],"rules":["人工接管不是失败。","高风险场景先保护客户关系。","转人工附带客户身份、最近 10 条消息、命中 FAQ、情绪等级、AI 已承诺事项、建议动作。"],"workflow":["风险命中","停止 AI 自动回复","生成上下文摘要","通知人工接管"],"preview":{"label":"转人工摘要","input":"客户要求真人客服","output":"附带最近 10 条消息、情绪等级、已承诺事项和建议处理动作。"},"boundary":"转人工后 AI 不再直接回复客户，只保留旁路建议。","actions":["保存规则","新增触发条件","生成转人工摘要"]}
  },
  "meeting": {
    "recording": {"title":"录音设置","code":"RECORDING SETUP","summary":"配置 AI 会议助手如何录音、何时转写、哪些场景必须保留原始音频。","metrics":[{"label":"采样率","value":"48k","note":"会议录音"},{"label":"转写","value":"实时","note":"边录边转"},{"label":"原音保留","value":"7天","note":"敏感词复核"}],"board":"识别模式","rows":[{"name":"标准转写","tag":"普通会议","meta":"普通会议 / 访谈 / 线上沟通 · 实时标点 + 关键词","action":"启用"},{"name":"高精度转写","tag":"客户会议","meta":"客户会议 / 需求评审 / 重要谈判 · 降噪 + 术语增强","action":"设为默认"},{"name":"只录音不转写","tag":"内部留档","meta":"内部留档 / 临时记录 · 会后手动处理","action":"配置"},{"name":"敏感词保留原音","tag":"复核","meta":"检测到敏感词时保留原始音频","action":"维护词库"}],"rules":["会议开始后自动提醒是否开启录音。","客户会议默认高精度。","检测到敏感词时保留原始音频，便于复核。"],"workflow":["会议开始","提醒录音","选择识别模式","生成转写文本"],"preview":{"label":"会议场景","input":"客户需求评审会","output":"默认高精度转写，开启降噪和术语增强。"},"boundary":"敏感录音未经确认不得上传外部服务；录音开启需提醒。","actions":["保存录音模式","测试音频","维护敏感词"]},
    "speakers": {"title":"发言分离","code":"SPEAKER DIARIZATION","summary":"把一段录音拆成不同说话人，并标注角色，纪要才不会混乱。","metrics":[{"label":"默认角色","value":"4","note":"主持/客户/销售/技术"},{"label":"角色识别","value":"92%","note":"低置信待确认"},{"label":"置信阈值","value":"70%","note":"低于不强归属"}],"board":"角色规则","rows":[{"name":"主持人","tag":"推进结论","meta":"控制议程 / 推进结论 · 自动识别高频发起问题者","action":"编辑规则"},{"name":"客户方","tag":"需求风险","meta":"需求 / 异议 / 决策意见 · 优先沉淀需求与风险","action":"配置字段"},{"name":"销售方","tag":"承诺检查","meta":"承诺 / 报价 / 后续动作 · 检查是否有过度承诺","action":"设置风控"},{"name":"技术方","tag":"行动项","meta":"方案 / 排期 / 资源限制 · 转为行动项和风险点","action":"配置提取"}],"rules":["同一声纹低于 70% 置信度时标为待确认发言人。","客户方需求和风险优先沉淀。","销售方承诺需检查是否过度承诺。"],"workflow":["声纹切分","角色识别","低置信标记","进入纪要模板"],"preview":{"label":"识别片段","input":"客户方提出预算和排期顾虑","output":"标注为客户方需求/风险，进入纪要“客户意图”。"},"boundary":"说话人低置信不得强行归属；外部客户不自动分配内部任务。","actions":["保存角色规则","添加发言人","合并段落"]},
    "template": {"title":"纪要模板","code":"MINUTES TEMPLATE","summary":"会议结束后不是生成流水账，而是输出可执行、可追踪、可复盘的结构化纪要。","metrics":[{"label":"字段","value":"6","note":"背景/结论/风险/意图/行动/跟进"},{"label":"输出结构","value":"结论优先","note":"风险单列"},{"label":"待确认","value":"强制标记","note":"不写成事实"}],"board":"模板字段","rows":[{"name":"会议背景","tag":"上下文","meta":"会议目的 / 参会角色 / 上下文","action":"编辑字段"},{"name":"关键结论","tag":"优先","meta":"已确认事项 / 决策结果 / 共识","action":"配置格式"},{"name":"争议与风险","tag":"单列","meta":"未达成一致 / 资源不足 / 时间风险","action":"设置规则"},{"name":"销售跟进","tag":"同步销售","meta":"可同步给 AI 销售助手的下一步建议","action":"配置同步"}],"rules":["先写结论，再写过程。","无法确认的内容标记“待确认”。","禁止把推测写成事实。"],"workflow":["读取转写文本","套用模板字段","提取结论/风险/行动","生成结构化纪要"],"preview":{"label":"默认输出结构","input":"客户需求评审会","output":"会议背景、关键结论、争议与风险、客户意图、行动项、销售跟进。"},"boundary":"未确认事项不得写成已决策；争议点必须单列。","actions":["保存模板","新增章节","预览纪要"]},
    "todo": {"title":"行动项","code":"ACTION ITEMS","summary":"把会议中的“回头再说”变成有负责人、有截止时间、有提醒的待办。","metrics":[{"label":"待办模板","value":"12","note":"样例任务"},{"label":"优先级","value":"3级","note":"高/中/低"},{"label":"提醒","value":"自动","note":"同步消息"}],"board":"提取样例","rows":[{"name":"确认报价边界","tag":"高","meta":"销售负责人 · 今天 18:00","action":"确认负责人"},{"name":"补充技术方案图","tag":"中","meta":"技术同事 · 明天 12:00","action":"创建待办"},{"name":"客户发票抬头确认","tag":"中","meta":"客服/财务 · 2 天内","action":"同步客服"},{"name":"下次会议议程","tag":"低","meta":"主持人 · 会前 1 天","action":"生成提醒"}],"rules":["行动项确认后同步到会议详情和消息提醒。","涉及客户转化的待办同步给 AI 销售助手。","责任人缺失标记待确认。"],"workflow":["识别任务句","提取负责人","提取截止时间","生成提醒"],"preview":{"label":"待办片段","input":"今天 18:00 前确认报价边界","output":"任务：确认报价边界；负责人：销售负责人；优先级：高。"},"boundary":"不得把建议性讨论直接变成正式任务；创建任务需确认。","actions":["保存行动项规则","创建提醒","同步销售助手"]},
    "calendar": {"title":"日程同步","code":"CALENDAR SYNC","summary":"让会议助手知道会议从哪里来、什么时候提醒、会后跟进到哪里去。","metrics":[{"label":"同步通道","value":"3","note":"IM/系统/客户跟进"},{"label":"下一场会议","value":"15:30","note":"VIC 客户需求评审"},{"label":"提醒","value":"10 min","note":"会前录音提醒"}],"board":"同步通道","rows":[{"name":"IM 内会议","tag":"已启用","meta":"自动读取参会人、群聊、会议链接","action":"配置"},{"name":"系统日历","tag":"待授权","meta":"同步日期、提醒、会议邀请","action":"授权"},{"name":"客户跟进","tag":"已启用","meta":"会后回访时间写入销售提醒","action":"配置同步"},{"name":"下一场会议","tag":"15:30","meta":"VIC 客户需求评审 · 会前 10 分钟提醒开启录音","action":"查看"}],"rules":["只读取会议标题、时间、参会人和链接。","不读取私人日历正文。","不保存外部账号密钥。"],"workflow":["读取会议来源","生成会前提醒","同步会后跟进","写入销售提醒"],"preview":{"label":"提醒预览","input":"15:30 VIC 客户需求评审","output":"15:20 提醒开启录音，会议后写入销售回访。"},"boundary":"不读取私人日历正文，不保存外部账号密钥。","actions":["保存同步通道","授权日历","预览提醒"]},
    "translate": {"title":"双语翻译","code":"BILINGUAL OUTPUT","summary":"跨境会议不只翻译文字，还要保留角色、结论、行动项和专业术语。","metrics":[{"label":"输出模式","value":"4","note":"纪要/字幕/术语/复核"},{"label":"语言","value":"ZH/EN","note":"中英双语"},{"label":"低置信","value":"标记","note":"需确认"}],"board":"输出模式","rows":[{"name":"中英双语纪要","tag":"跨境会议","meta":"中文正文 + 英文摘要","action":"配置模板"},{"name":"实时字幕","tag":"远程会议","meta":"会议中显示双语字幕","action":"设置字幕"},{"name":"术语词库","tag":"准确","meta":"品牌名 / 产品名 / 行业词固定译法","action":"维护词库"},{"name":"人工复核","tag":"重要纪要","meta":"重要纪要导出前人工确认","action":"配置复核"}],"rules":["产品名、人名、品牌名优先使用词库。","低置信度译文会标记“需确认”。","合同/报价场景重要纪要导出前人工确认。"],"workflow":["读取转写文本","匹配术语词库","生成双语输出","低置信标记复核"],"preview":{"label":"翻译预览","input":"客户希望下周确认报价边界。","output":"The client expects the pricing boundary to be confirmed next week."},"boundary":"低置信译文不直接进入正式纪要；合同/报价场景需人工复核。","actions":["保存翻译模式","维护术语词库","生成双语预览"]}
  },
  "design": {
    "brand": {
      "title": "品牌视觉规范",
      "code": "DESIGN · BRAND SYSTEM",
      "summary": "配置 Logo、品牌色、字体、留白、安全区和品牌禁用方式，让设计输出保持一致。",
      "metrics": [
        {
          "label": "品牌包",
          "value": "1 套",
          "note": "Logo/色彩/字体"
        },
        {
          "label": "强校验",
          "value": "开启",
          "note": "色彩/Logo"
        },
        {
          "label": "冲突项",
          "value": "3 个",
          "note": "字体/安全区"
        }
      ],
      "board": "品牌规范库",
      "rows": [
        {
          "name": "品牌色",
          "tag": "核心",
          "meta": "主色/辅色/警示色",
          "action": "编辑色板"
        },
        {
          "name": "Logo 安全区",
          "tag": "强制",
          "meta": "最小尺寸/留白",
          "action": "设置规则"
        },
        {
          "name": "字体规范",
          "tag": "基础",
          "meta": "标题/正文/数字",
          "action": "维护字体"
        },
        {
          "name": "禁止用法",
          "tag": "边界",
          "meta": "拉伸/换色/遮挡",
          "action": "配置禁用"
        }
      ],
      "rules": [
        "Logo 不得拉伸变形。",
        "品牌色强制校验。",
        "非品牌字体需给替代说明。"
      ],
      "workflow": [
        "读取品牌包",
        "检查输出稿",
        "标记冲突项",
        "生成修改建议"
      ],
      "preview": {
        "label": "设计任务",
        "input": "做一张符合品牌规范的活动图。",
        "output": "应用品牌色与 Logo 安全区，提示 1 个字体替代。"
      },
      "boundary": "品牌规范冲突时不生成最终稿，只输出问题清单。",
      "actions": [
        "保存品牌包",
        "上传规范占位",
        "运行规范检查"
      ]
    },
    "assets": {
      "title": "素材授权管理",
      "code": "DESIGN · ASSET LICENSE",
      "summary": "配置哪些商品图、人物图、场景图和历史稿可用于最终设计，重点是版权和到期提醒。",
      "metrics": [
        {
          "label": "素材",
          "value": "86 个",
          "note": "授权 74 / 待审 12"
        },
        {
          "label": "到期提醒",
          "value": "7 天",
          "note": "提前预警"
        },
        {
          "label": "禁用素材",
          "value": "9 个",
          "note": "版权不明"
        }
      ],
      "board": "授权素材清单",
      "rows": [
        {
          "name": "商品图",
          "tag": "可用",
          "meta": "已授权商品图片",
          "action": "管理素材"
        },
        {
          "name": "人物图",
          "tag": "谨慎",
          "meta": "肖像授权/期限",
          "action": "查看授权"
        },
        {
          "name": "历史设计稿",
          "tag": "复用",
          "meta": "可二创/只参考",
          "action": "设置范围"
        },
        {
          "name": "禁用素材",
          "tag": "拦截",
          "meta": "版权不明/过期",
          "action": "维护禁用"
        }
      ],
      "rules": [
        "未授权素材不得用于最终稿。",
        "授权即将到期提前提醒。",
        "素材缺失时生成占位建议而非乱用图。"
      ],
      "workflow": [
        "检索素材",
        "检查授权",
        "匹配任务用途",
        "输出可用素材包"
      ],
      "preview": {
        "label": "设计任务",
        "input": "用现有素材做一张新品海报。",
        "output": "筛选 12 张可商用素材，排除 2 张授权过期图。"
      },
      "boundary": "版权不明素材必须人工确认，不得进入最终交付。",
      "actions": [
        "保存授权",
        "新增素材占位",
        "检查到期"
      ]
    },
    "style": {
      "title": "风格模板配置",
      "code": "DESIGN · STYLE SET",
      "summary": "配置电商促销、品牌海报、科技风、小红书封面等风格模板和可混用边界。",
      "metrics": [
        {
          "label": "模板",
          "value": "6 套",
          "note": "促销/品牌/UI"
        },
        {
          "label": "默认生成",
          "value": "3 版",
          "note": "不同构图"
        },
        {
          "label": "混用限制",
          "value": "开启",
          "note": "跨风格需确认"
        }
      ],
      "board": "风格模板组",
      "rows": [
        {
          "name": "电商促销",
          "tag": "转化",
          "meta": "大标题/价格/利益点",
          "action": "编辑模板"
        },
        {
          "name": "品牌海报",
          "tag": "形象",
          "meta": "留白/质感/主视觉",
          "action": "配置风格"
        },
        {
          "name": "科技风",
          "tag": "场景",
          "meta": "线框/渐变/数据",
          "action": "维护元素"
        },
        {
          "name": "App UI",
          "tag": "界面",
          "meta": "组件/间距/状态",
          "action": "设置规范"
        }
      ],
      "rules": [
        "默认生成多版方案。",
        "跨风格混合需确认。",
        "模板优先级影响生成顺序。"
      ],
      "workflow": [
        "选择设计场景",
        "匹配风格模板",
        "生成 3 版方向",
        "输出差异说明"
      ],
      "preview": {
        "label": "设计任务",
        "input": "给我三个不同风格的主视觉方向。",
        "output": "生成促销版、品牌版、科技版三套方向说明。"
      },
      "boundary": "最终选版和交付需要人工确认。",
      "actions": [
        "保存模板",
        "新增风格",
        "生成方向"
      ]
    },
    "size": {
      "title": "尺寸规格配置",
      "code": "DESIGN · SIZE SPECS",
      "summary": "配置小红书、抖音、公众号、Banner、海报和 App 页面尺寸、安全区和导出策略。",
      "metrics": [
        {
          "label": "尺寸",
          "value": "12 类",
          "note": "平台/物料"
        },
        {
          "label": "安全区",
          "value": "开启",
          "note": "字幕/Logo/按钮"
        },
        {
          "label": "批量导出",
          "value": "可选",
          "note": "需检查"
        }
      ],
      "board": "平台尺寸表",
      "rows": [
        {
          "name": "小红书封面",
          "tag": "平台",
          "meta": "3:4 / 1242×1660",
          "action": "编辑尺寸"
        },
        {
          "name": "抖音竖图",
          "tag": "平台",
          "meta": "9:16 / 安全区",
          "action": "设置安全区"
        },
        {
          "name": "公众号首图",
          "tag": "平台",
          "meta": "900×383",
          "action": "配置尺寸"
        },
        {
          "name": "App 页面",
          "tag": "产品",
          "meta": "状态栏/底栏安全区",
          "action": "维护规则"
        }
      ],
      "rules": [
        "尺寸错误禁止导出。",
        "自动生成多平台版本。",
        "安全区冲突生成警告。"
      ],
      "workflow": [
        "读取输出目标",
        "匹配尺寸规格",
        "检查安全区",
        "生成导出清单"
      ],
      "preview": {
        "label": "设计任务",
        "input": "同一张图适配小红书和公众号。",
        "output": "生成两套尺寸并提示标题安全区差异。"
      },
      "boundary": "未配置尺寸的场景只生成建议，不导出成品。",
      "actions": [
        "保存尺寸",
        "新增平台",
        "检查适配"
      ]
    },
    "ban": {
      "title": "禁用元素配置",
      "code": "DESIGN · BANNED ELEMENTS",
      "summary": "配置设计中禁止出现的颜色、图片、侵权素材、低俗元素、敏感词和错误 Logo 用法。",
      "metrics": [
        {
          "label": "禁用项",
          "value": "38 条",
          "note": "素材/文案/Logo"
        },
        {
          "label": "命中处理",
          "value": "拦截",
          "note": "严重风险"
        },
        {
          "label": "待补充",
          "value": "3 项",
          "note": "行业合规"
        }
      ],
      "board": "禁用元素库",
      "rows": [
        {
          "name": "禁用素材",
          "tag": "版权",
          "meta": "侵权/过期/外部图",
          "action": "维护名单"
        },
        {
          "name": "禁用文案",
          "tag": "合规",
          "meta": "极限词/敏感词",
          "action": "编辑词库"
        },
        {
          "name": "Logo 错误",
          "tag": "品牌",
          "meta": "变形/换色/裁切",
          "action": "配置规则"
        },
        {
          "name": "低俗元素",
          "tag": "平台",
          "meta": "违规视觉/暗示",
          "action": "设置拦截"
        }
      ],
      "rules": [
        "命中禁用元素阻止导出。",
        "疑似侵权素材进入人工确认。",
        "画面文案命中禁词需高亮提示。"
      ],
      "workflow": [
        "扫描设计稿",
        "匹配禁用库",
        "标记风险区域",
        "输出修改建议"
      ],
      "preview": {
        "label": "检查任务",
        "input": "检查这张海报有没有违规元素。",
        "output": "命中 1 个极限词，建议替换；未发现侵权素材。"
      },
      "boundary": "禁用元素命中后不得自动绕过。",
      "actions": [
        "保存禁用库",
        "新增禁用项",
        "运行检查"
      ]
    },
    "review": {
      "title": "设计审核清单",
      "code": "DESIGN · REVIEW CHECKLIST",
      "summary": "配置设计交付前的品牌、尺寸、可读性、对齐、留白和素材授权检查项。",
      "metrics": [
        {
          "label": "检查项",
          "value": "18 项",
          "note": "品牌/尺寸/授权"
        },
        {
          "label": "严重风险",
          "value": "拦截",
          "note": "不可导出"
        },
        {
          "label": "人工跳过",
          "value": "记录原因",
          "note": "留审计"
        }
      ],
      "board": "交付审核表",
      "rows": [
        {
          "name": "品牌一致性",
          "tag": "必检",
          "meta": "色彩/字体/Logo",
          "action": "配置检查"
        },
        {
          "name": "尺寸正确",
          "tag": "必检",
          "meta": "导出规格/安全区",
          "action": "检查尺寸"
        },
        {
          "name": "文字可读",
          "tag": "质量",
          "meta": "字号/对比度/遮挡",
          "action": "设置阈值"
        },
        {
          "name": "素材授权",
          "tag": "合规",
          "meta": "授权/来源/期限",
          "action": "检查授权"
        }
      ],
      "rules": [
        "检查不通过生成修改建议。",
        "严重风险阻止导出。",
        "人工跳过必须记录原因。"
      ],
      "workflow": [
        "扫描设计稿",
        "逐项检查",
        "输出风险等级",
        "生成交付建议"
      ],
      "preview": {
        "label": "审核任务",
        "input": "帮我检查这版图能不能交付。",
        "output": "通过 15 项，2 项需调整，1 项需人工确认授权。"
      },
      "boundary": "最终交付前需要人工确认审核结果。",
      "actions": [
        "保存清单",
        "新增检查项",
        "执行审核"
      ]
    }
  },
  "video": {
    "script": {
      "title": "短视频脚本结构",
      "code": "VIDEO · SCRIPT",
      "summary": "配置产品介绍、种草、带货、知识科普、客户案例等脚本的段落结构和禁用承诺。",
      "metrics": [
        {
          "label": "模板",
          "value": "5 套",
          "note": "产品/种草/带货"
        },
        {
          "label": "前三秒",
          "value": "强制",
          "note": "钩子/痛点"
        },
        {
          "label": "风险检查",
          "value": "开启",
          "note": "案例/功效"
        }
      ],
      "board": "脚本结构",
      "rows": [
        {
          "name": "前三秒钩子",
          "tag": "核心",
          "meta": "痛点/利益/反差",
          "action": "编辑钩子"
        },
        {
          "name": "产品卖点",
          "tag": "主体",
          "meta": "3 个以内",
          "action": "配置卖点"
        },
        {
          "name": "使用场景",
          "tag": "转化",
          "meta": "人群/场景/问题",
          "action": "维护场景"
        },
        {
          "name": "结尾 CTA",
          "tag": "促动",
          "meta": "咨询/领取/下单",
          "action": "设置 CTA"
        }
      ],
      "rules": [
        "前三秒必须有钩子。",
        "强营销表达需人工确认。",
        "不得编造案例、体验和效果承诺。"
      ],
      "workflow": [
        "选择视频类型",
        "填充卖点",
        "生成脚本段落",
        "执行风险检查"
      ],
      "preview": {
        "label": "视频任务",
        "input": "做一个 30 秒产品介绍短视频。",
        "output": "生成 5 段脚本：钩子、痛点、卖点、场景、CTA。"
      },
      "boundary": "客户案例和效果承诺必须有真实来源。",
      "actions": [
        "保存脚本模板",
        "新增钩子",
        "生成脚本"
      ]
    },
    "shot": {
      "title": "分镜规则配置",
      "code": "VIDEO · SHOT RULES",
      "summary": "配置镜头数量、时长、画面节奏、转场、产品展示和结尾 CTA。",
      "metrics": [
        {
          "label": "镜头",
          "value": "6 个",
          "note": "默认 30 秒"
        },
        {
          "label": "节奏",
          "value": "快切",
          "note": "3-5 秒/镜头"
        },
        {
          "label": "确认点",
          "value": "成片前",
          "note": "分镜需确认"
        }
      ],
      "board": "分镜节奏表",
      "rows": [
        {
          "name": "镜头数量",
          "tag": "节奏",
          "meta": "3/6/9 镜头",
          "action": "设置数量"
        },
        {
          "name": "镜头时长",
          "tag": "平台",
          "meta": "按时长拆分",
          "action": "配置时长"
        },
        {
          "name": "产品展示",
          "tag": "核心",
          "meta": "特写/场景/对比",
          "action": "维护镜头"
        },
        {
          "name": "结尾 CTA",
          "tag": "转化",
          "meta": "关注/咨询/下单",
          "action": "设置动作"
        }
      ],
      "rules": [
        "短视频默认 6 个镜头以内。",
        "前三秒强制展示痛点或利益点。",
        "分镜进入成片前需确认。"
      ],
      "workflow": [
        "读取脚本",
        "拆分镜头",
        "匹配素材",
        "输出分镜表"
      ],
      "preview": {
        "label": "分镜任务",
        "input": "把这个脚本拆成分镜。",
        "output": "输出 6 个镜头，含画面、口播、字幕和素材建议。"
      },
      "boundary": "真人/数字人出镜需确认素材授权。",
      "actions": [
        "保存分镜规则",
        "新增镜头类型",
        "生成分镜"
      ]
    },
    "platform": {
      "title": "平台发布规格",
      "code": "VIDEO · PLATFORM SPECS",
      "summary": "配置抖音、小红书、视频号、B站等平台的视频比例、时长、封面、话题和禁词。",
      "metrics": [
        {
          "label": "平台",
          "value": "5 个",
          "note": "抖音/小红书/视频号"
        },
        {
          "label": "比例",
          "value": "9:16",
          "note": "可切 1:1/16:9"
        },
        {
          "label": "发布动作",
          "value": "关闭",
          "note": "只给建议"
        }
      ],
      "board": "平台规格表",
      "rows": [
        {
          "name": "抖音规格",
          "tag": "平台",
          "meta": "9:16 / 15-60 秒",
          "action": "编辑规则"
        },
        {
          "name": "小红书规格",
          "tag": "平台",
          "meta": "3:4/9:16 / 标题",
          "action": "配置规则"
        },
        {
          "name": "视频号规格",
          "tag": "平台",
          "meta": "封面/简介/话题",
          "action": "设置字段"
        },
        {
          "name": "平台禁词",
          "tag": "合规",
          "meta": "标题/字幕/口播",
          "action": "维护词库"
        }
      ],
      "rules": [
        "按平台自动适配尺寸。",
        "平台禁词命中后给替换建议。",
        "发布动作默认关闭，需人工确认。"
      ],
      "workflow": [
        "选择平台",
        "适配比例时长",
        "检查标题字幕",
        "输出发布建议"
      ],
      "preview": {
        "label": "适配任务",
        "input": "适配成抖音和小红书两个版本。",
        "output": "生成两套比例、封面尺寸、标题和话题建议。"
      },
      "boundary": "不自动发布；发布前需人工确认。",
      "actions": [
        "保存平台规格",
        "新增平台",
        "运行适配"
      ]
    },
    "subtitle": {
      "title": "字幕安全区配置",
      "code": "VIDEO · SUBTITLE SAFE AREA",
      "summary": "配置字幕位置、字号、断句、关键词高亮、双语字幕和主体遮挡检查。",
      "metrics": [
        {
          "label": "字幕风格",
          "value": "3 套",
          "note": "标准/强调/双语"
        },
        {
          "label": "安全区",
          "value": "开启",
          "note": "不遮挡主体"
        },
        {
          "label": "高亮限制",
          "value": "2 个/屏",
          "note": "避免花屏"
        }
      ],
      "board": "字幕规则",
      "rows": [
        {
          "name": "字幕位置",
          "tag": "视觉",
          "meta": "底部/中下/避让",
          "action": "设置位置"
        },
        {
          "name": "字号样式",
          "tag": "可读",
          "meta": "字号/描边/背景",
          "action": "编辑样式"
        },
        {
          "name": "关键词高亮",
          "tag": "重点",
          "meta": "每屏最多 2 个",
          "action": "配置高亮"
        },
        {
          "name": "断句规则",
          "tag": "节奏",
          "meta": "按语义/口播停顿",
          "action": "设置断句"
        }
      ],
      "rules": [
        "字幕不遮挡主体。",
        "关键词高亮不超过每屏 2 个。",
        "自动翻译需人工确认。"
      ],
      "workflow": [
        "读取脚本/转写",
        "生成断句",
        "套用字幕样式",
        "检查安全区"
      ],
      "preview": {
        "label": "字幕任务",
        "input": "给这段视频生成字幕。",
        "output": "生成 18 条字幕，2 处建议人工确认专业术语。"
      },
      "boundary": "专业术语和外语翻译需人工确认。",
      "actions": [
        "保存字幕样式",
        "新增高亮词",
        "预览字幕"
      ]
    },
    "material": {
      "title": "素材来源授权",
      "code": "VIDEO · MATERIAL LICENSE",
      "summary": "配置视频可用的商品图、历史视频、BGM、数字人、品牌素材和外部素材边界。",
      "metrics": [
        {
          "label": "素材",
          "value": "42 个",
          "note": "视频/图片/BGM"
        },
        {
          "label": "BGM",
          "value": "待审",
          "note": "版权确认"
        },
        {
          "label": "外部素材",
          "value": "默认禁用",
          "note": "需授权"
        }
      ],
      "board": "素材授权池",
      "rows": [
        {
          "name": "商品素材",
          "tag": "可用",
          "meta": "图片/短片/包装",
          "action": "管理素材"
        },
        {
          "name": "历史视频",
          "tag": "可复用",
          "meta": "片段/封面/字幕",
          "action": "设置范围"
        },
        {
          "name": "BGM",
          "tag": "风险",
          "meta": "商用授权/期限",
          "action": "检查版权"
        },
        {
          "name": "数字人",
          "tag": "可选",
          "meta": "形象/声音授权",
          "action": "配置授权"
        }
      ],
      "rules": [
        "BGM 必须确认授权。",
        "外部素材默认禁用。",
        "素材缺失时输出补拍建议。"
      ],
      "workflow": [
        "匹配视频任务",
        "筛选可用素材",
        "检查版权状态",
        "生成素材清单"
      ],
      "preview": {
        "label": "视频任务",
        "input": "用已有素材剪一个产品介绍。",
        "output": "筛选 8 个可用素材，BGM 标记待人工确认。"
      },
      "boundary": "版权不明确素材不得进入成片。",
      "actions": [
        "保存授权",
        "新增素材",
        "检查版权"
      ]
    },
    "publish": {
      "title": "发布前检查",
      "code": "VIDEO · PUBLISH CHECK",
      "summary": "配置视频发布前对敏感词、夸张承诺、版权音乐、虚假功效、封面标题和标签的检查。",
      "metrics": [
        {
          "label": "检查项",
          "value": "16 项",
          "note": "合规/版权/平台"
        },
        {
          "label": "风险等级",
          "value": "P0-P2",
          "note": "P0 拦截"
        },
        {
          "label": "发布确认",
          "value": "强制",
          "note": "人工审核"
        }
      ],
      "board": "发布检查清单",
      "rows": [
        {
          "name": "敏感词",
          "tag": "合规",
          "meta": "标题/字幕/口播",
          "action": "检查词库"
        },
        {
          "name": "夸张承诺",
          "tag": "风险",
          "meta": "最/第一/保证",
          "action": "设置拦截"
        },
        {
          "name": "版权音乐",
          "tag": "版权",
          "meta": "BGM 授权状态",
          "action": "核验版权"
        },
        {
          "name": "封面标题",
          "tag": "平台",
          "meta": "尺寸/禁词/标签",
          "action": "检查发布"
        }
      ],
      "rules": [
        "风险命中拦截发布。",
        "生成发布建议但不自动发布。",
        "标题标签需过敏感词检查。"
      ],
      "workflow": [
        "读取成片信息",
        "检查合规版权",
        "输出风险报告",
        "等待人工发布"
      ],
      "preview": {
        "label": "检查任务",
        "input": "检查这个视频能不能发布。",
        "output": "发现 1 个夸张词和 BGM 待审，发布被拦截。"
      },
      "boundary": "发布前强制人工审核。",
      "actions": [
        "保存检查项",
        "运行发布检查",
        "生成风险报告"
      ]
    }
  },
  "writing": {
    "platform": {
      "title": "平台内容类型",
      "code": "WRITING · PLATFORM TYPE",
      "summary": "配置小红书、公众号、知乎、抖音文案、朋友圈和广告投放的内容结构与限制。",
      "metrics": [
        {
          "label": "平台",
          "value": "6 个",
          "note": "内容结构不同"
        },
        {
          "label": "字数规则",
          "value": "已启用",
          "note": "按平台限制"
        },
        {
          "label": "差异输出",
          "value": "开启",
          "note": "多平台改写"
        }
      ],
      "board": "平台类型配置",
      "rows": [
        {
          "name": "小红书",
          "tag": "种草",
          "meta": "标题/正文/标签",
          "action": "编辑结构"
        },
        {
          "name": "公众号",
          "tag": "长文",
          "meta": "导读/正文/总结",
          "action": "配置结构"
        },
        {
          "name": "知乎",
          "tag": "回答",
          "meta": "问题/论证/结论",
          "action": "设置结构"
        },
        {
          "name": "朋友圈",
          "tag": "短文",
          "meta": "口语/CTA/配图",
          "action": "维护模板"
        }
      ],
      "rules": [
        "不同平台套用不同字数和结构。",
        "平台禁词强制检查。",
        "多平台输出生成差异版。"
      ],
      "workflow": [
        "选择平台",
        "套用结构",
        "调整语气长度",
        "输出平台版本"
      ],
      "preview": {
        "label": "改写任务",
        "input": "把这段内容改成小红书风格。",
        "output": "生成小红书标题、正文、标签和 CTA。"
      },
      "boundary": "平台规则未配置时只生成通用建议。",
      "actions": [
        "保存平台结构",
        "新增平台",
        "生成差异版"
      ]
    },
    "template": {
      "title": "内容模板结构",
      "code": "WRITING · CONTENT STRUCTURE",
      "summary": "配置种草文、品牌稿、销售文案、知识文章、活动通知和产品介绍的内容骨架。",
      "metrics": [
        {
          "label": "模板",
          "value": "12 套",
          "note": "种草/品牌/销售"
        },
        {
          "label": "必填槽位",
          "value": "8 个",
          "note": "卖点/证据/CTA"
        },
        {
          "label": "事实校验",
          "value": "开启",
          "note": "数据/案例"
        }
      ],
      "board": "内容模板",
      "rows": [
        {
          "name": "种草文",
          "tag": "转化",
          "meta": "痛点/体验/推荐",
          "action": "编辑模板"
        },
        {
          "name": "品牌稿",
          "tag": "形象",
          "meta": "品牌故事/价值/案例",
          "action": "配置段落"
        },
        {
          "name": "销售文案",
          "tag": "成交",
          "meta": "利益点/优惠/CTA",
          "action": "设置模板"
        },
        {
          "name": "知识文章",
          "tag": "信任",
          "meta": "问题/分析/方法",
          "action": "维护结构"
        }
      ],
      "rules": [
        "保留人工大纲优先级。",
        "允许扩写但不得编造事实。",
        "模板字段缺失时提醒补齐。"
      ],
      "workflow": [
        "读取主题",
        "匹配模板",
        "填充内容槽位",
        "输出草稿"
      ],
      "preview": {
        "label": "写作任务",
        "input": "写一篇产品介绍文章。",
        "output": "生成产品背景、卖点、使用场景和 CTA。"
      },
      "boundary": "真实案例、数据、客户评价必须有来源。",
      "actions": [
        "保存模板",
        "新增槽位",
        "生成草稿"
      ]
    },
    "title": {
      "title": "标题策略配置",
      "code": "WRITING · TITLE STRATEGY",
      "summary": "配置数字标题、痛点标题、利益标题、悬念标题、对比标题和 SEO 标题生成规则。",
      "metrics": [
        {
          "label": "策略",
          "value": "6 类",
          "note": "数字/痛点/利益"
        },
        {
          "label": "生成数量",
          "value": "5 个",
          "note": "默认 A/B 预览"
        },
        {
          "label": "禁用词",
          "value": "开启",
          "note": "极限词拦截"
        }
      ],
      "board": "标题策略",
      "rows": [
        {
          "name": "痛点标题",
          "tag": "吸引",
          "meta": "人群+问题+结果",
          "action": "配置公式"
        },
        {
          "name": "数字标题",
          "tag": "清晰",
          "meta": "数字+场景+收益",
          "action": "设置公式"
        },
        {
          "name": "利益标题",
          "tag": "转化",
          "meta": "收益/省时/省钱",
          "action": "维护词库"
        },
        {
          "name": "SEO 标题",
          "tag": "搜索",
          "meta": "关键词前置",
          "action": "配置规则"
        }
      ],
      "rules": [
        "禁止标题党。",
        "标题长度按平台限制。",
        "一次生成多个标题供选择。"
      ],
      "workflow": [
        "读取正文主题",
        "选择标题策略",
        "生成多标题",
        "检查禁用词"
      ],
      "preview": {
        "label": "标题任务",
        "input": "给这篇文章生成 5 个标题。",
        "output": "输出 5 个标题，标记 1 个风险词替换建议。"
      },
      "boundary": "不能使用虚假承诺、极限词和不可验证数据。",
      "actions": [
        "保存标题公式",
        "新增痛点词",
        "生成 A/B 标题"
      ]
    },
    "keyword": {
      "title": "关键词规则配置",
      "code": "WRITING · KEYWORDS",
      "summary": "配置必须出现、建议出现和禁止出现的品牌词、产品卖点、SEO 词、行业词和竞品词。",
      "metrics": [
        {
          "label": "关键词",
          "value": "38 个",
          "note": "品牌/产品/SEO"
        },
        {
          "label": "禁用词",
          "value": "9 个",
          "note": "竞品/违规"
        },
        {
          "label": "密度检查",
          "value": "开启",
          "note": "避免堆砌"
        }
      ],
      "board": "关键词规则",
      "rows": [
        {
          "name": "品牌词",
          "tag": "必带",
          "meta": "品牌名/系列名",
          "action": "维护词库"
        },
        {
          "name": "产品卖点",
          "tag": "建议",
          "meta": "核心功效/材质/场景",
          "action": "配置卖点"
        },
        {
          "name": "SEO 关键词",
          "tag": "搜索",
          "meta": "主词/长尾词",
          "action": "设置权重"
        },
        {
          "name": "竞品词",
          "tag": "禁用",
          "meta": "攻击/对比风险",
          "action": "维护禁用"
        }
      ],
      "rules": [
        "关键词密度不要机械堆叠。",
        "竞品词默认禁止。",
        "缺失核心卖点时提醒补充。"
      ],
      "workflow": [
        "读取写作需求",
        "匹配关键词",
        "检查密度",
        "输出优化建议"
      ],
      "preview": {
        "label": "写作要求",
        "input": "这篇文章要带上品牌词和三个卖点。",
        "output": "植入品牌词和 3 个卖点，不堆砌关键词。"
      },
      "boundary": "竞品攻击、虚假对比和违规词必须拦截。",
      "actions": [
        "保存关键词",
        "新增禁用词",
        "检查密度"
      ]
    },
    "sensitive": {
      "title": "敏感词风控配置",
      "code": "WRITING · SENSITIVE CHECK",
      "summary": "配置极限词、医疗词、金融词、虚假承诺、平台禁词和替换建议，发布前强制检查。",
      "metrics": [
        {
          "label": "词库",
          "value": "P0 强制",
          "note": "不可关闭"
        },
        {
          "label": "风险等级",
          "value": "3 档",
          "note": "拦截/替换/提示"
        },
        {
          "label": "替换建议",
          "value": "开启",
          "note": "自动给同义词"
        }
      ],
      "board": "敏感词库",
      "rows": [
        {
          "name": "极限词",
          "tag": "P0",
          "meta": "最/第一/保证",
          "action": "维护词库"
        },
        {
          "name": "医疗金融词",
          "tag": "P0",
          "meta": "治疗/收益/承诺",
          "action": "配置行业"
        },
        {
          "name": "平台禁词",
          "tag": "P1",
          "meta": "平台规则同步",
          "action": "同步规则"
        },
        {
          "name": "替换建议",
          "tag": "辅助",
          "meta": "安全表达替换",
          "action": "维护建议"
        }
      ],
      "rules": [
        "严重风险直接拦截。",
        "普通风险给替换建议。",
        "敏感词检查强制开启。"
      ],
      "workflow": [
        "扫描标题正文",
        "匹配风险词",
        "标记风险等级",
        "输出替换建议"
      ],
      "preview": {
        "label": "检查任务",
        "input": "检查这段文案有没有违规词。",
        "output": "命中 2 个极限词，给出替换建议并拦截发布。"
      },
      "boundary": "该功能不可关闭；高风险内容必须人工审核。",
      "actions": [
        "保存词库",
        "新增替换建议",
        "运行检查"
      ]
    },
    "format": {
      "title": "发布格式配置",
      "code": "WRITING · PUBLISH FORMAT",
      "summary": "配置最终输出为标题、摘要、正文、标签、CTA、封面文案和一键复制格式。",
      "metrics": [
        {
          "label": "格式段",
          "value": "6 段",
          "note": "标题/正文/标签"
        },
        {
          "label": "平台适配",
          "value": "开启",
          "note": "按平台输出"
        },
        {
          "label": "发布动作",
          "value": "关闭",
          "note": "只复制不发布"
        }
      ],
      "board": "发布格式",
      "rows": [
        {
          "name": "标题",
          "tag": "输出",
          "meta": "单标题/多标题",
          "action": "配置数量"
        },
        {
          "name": "摘要",
          "tag": "导读",
          "meta": "50-120 字",
          "action": "设置长度"
        },
        {
          "name": "正文",
          "tag": "主体",
          "meta": "段落/小标题/列表",
          "action": "编辑结构"
        },
        {
          "name": "标签 CTA",
          "tag": "收尾",
          "meta": "标签/行动号召",
          "action": "配置格式"
        }
      ],
      "rules": [
        "按平台生成对应格式。",
        "输出前生成审核清单。",
        "一键复制不等于自动发布。"
      ],
      "workflow": [
        "整理草稿",
        "套用发布格式",
        "执行敏感词检查",
        "输出可复制版本"
      ],
      "preview": {
        "label": "格式任务",
        "input": "输出一版可以直接复制的小红书格式。",
        "output": "生成标题、正文、8 个标签和 CTA，并附检查结果。"
      },
      "boundary": "发布动作需人工确认。",
      "actions": [
        "保存格式",
        "预览复制版",
        "生成审核清单"
      ]
    }
  }
};


function getBusinessLevel3(agent, module, detail, field, index) {
  const byAgent = AC_BUSINESS_LEVEL3[agent.id] || {};
  const page = byAgent[module.id];
  if (page) return page;
  return {
    title: `${module.title}业务配置`,
    code: 'BUSINESS CONFIG',
    summary: detail.purpose,
    metrics: [
      { label: '配置项', value: `${detail.fields.length} 项`, note: '当前功能' },
      { label: '状态', value: module.state, note: module.metric },
      { label: '选中项', value: field, note: `第 ${index + 1} 项` }
    ],
    board: `${module.title}业务看板`,
    rows: detail.fields.slice(0, 4).map((name, idx) => ({ name, tag: idx === index ? '当前' : '配置', meta: detail.sources[idx % detail.sources.length] || module.metric, action: '编辑' })),
    rules: detail.rules,
    workflow: ['识别业务场景', '读取配置资料', '生成执行建议', '人工确认高风险项'],
    preview: { label: '测试输入', input: detail.sample, output: `根据「${module.title}」生成业务建议。` },
    boundary: detail.boundary,
    actions: ['保存配置', '新增规则', '运行预览']
  };
}

function renderConfigItemDetail(agent, cfg, module, fieldIndex) {
  const detail = getModuleDetail(module);
  const safeIndex = Math.max(0, Math.min(Number(fieldIndex) || 0, detail.fields.length - 1));
  const field = detail.fields[safeIndex];
  const page = getBusinessLevel3(agent, module, detail, field, safeIndex);
  return `
    <div class="agent-center-item-detail agent-center-business-page">
      <div class="agent-center-detail-head">
        <button class="agent-center-back" type="button" data-agent-center-action="back-module">← 返回${acEscape(module.title)}</button>
        <span class="agent-center-mode is-${module.mode}">${AC_MODE_LABELS[module.mode]}</span>
      </div>

      <section class="agent-center-business-hero" style="--c:${agent.color};--soft:${agent.colorSoft}">
        <div class="agent-center-detail-icon">${module.icon}</div>
        <div>
          <span class="agent-center-kicker mono">${acEscape(agent.name)} / ${acEscape(module.title)} / BUSINESS PAGE</span>
          <h3>${acEscape(page.title)}</h3>
          <p>${acEscape(page.summary)}</p>
        </div>
        <div class="agent-center-business-code mono">
          <strong>${acEscape(page.code)}</strong>
          <span>当前入口：${acEscape(field)}</span>
        </div>
      </section>

      <div class="agent-center-business-metrics">
        ${page.metrics.map(metric => `
          <div>
            <span>${acEscape(metric.label)}</span>
            <strong>${acEscape(metric.value)}</strong>
            <em>${acEscape(metric.note)}</em>
          </div>
        `).join('')}
      </div>

      <div class="agent-center-business-layout">
        <article class="agent-center-detail-card agent-center-business-board">
          <div class="agent-center-block-head">
            <h3>${acEscape(page.board)}</h3>
            <span class="mono">BUSINESS OBJECTS</span>
          </div>
          <div class="agent-center-business-table">
            ${page.rows.map((row, idx) => `
              <div class="${row.name === field ? 'is-current' : ''}">
                <span class="agent-center-business-index mono">${String(idx + 1).padStart(2, '0')}</span>
                <strong>${acEscape(row.name)}</strong>
                <em>${acEscape(row.tag)}</em>
                <small>${acEscape(row.meta)}</small>
                <button type="button" data-agent-center-action="mock-save">${acEscape(row.action)}</button>
              </div>
            `).join('')}
          </div>
        </article>

        <article class="agent-center-detail-card agent-center-business-flow-card">
          <div class="agent-center-block-head">
            <h3>执行流程</h3>
            <span class="mono">FLOW</span>
          </div>
          <div class="agent-center-business-flow">
            ${page.workflow.map((step, idx) => `<div><em>${idx + 1}</em><span>${acEscape(step)}</span></div>`).join('')}
          </div>
        </article>

        <article class="agent-center-detail-card agent-center-business-rules-card">
          <div class="agent-center-block-head">
            <h3>业务规则</h3>
            <span class="mono">RULES</span>
          </div>
          <ol class="agent-center-rule-list">
            ${page.rules.map((rule, idx) => `<li><em class="mono">0${idx + 1}</em><span>${acEscape(rule)}</span></li>`).join('')}
          </ol>
        </article>

        <article class="agent-center-detail-card agent-center-business-preview-card">
          <div class="agent-center-block-head">
            <h3>测试预览</h3>
            <span class="mono">PREVIEW</span>
          </div>
          <div class="agent-center-business-preview">
            <span>${acEscape(page.preview.label)}</span>
            <strong>${acEscape(page.preview.input)}</strong>
            <p>${acEscape(page.preview.output)}</p>
          </div>
          <p class="agent-center-boundary-copy">${acEscape(page.boundary)}</p>
        </article>
      </div>

      <div class="agent-center-business-actions">
        ${page.actions.map(action => `<button type="button" data-agent-center-action="mock-save">${acEscape(action)}</button>`).join('')}
        <button class="is-primary" type="button" data-agent-center-action="save-field">保存当前业务页</button>
      </div>
    </div>
  `;
}

function renderSourceBlock(sources) {
  return `
    <article class="agent-center-block agent-center-source-block">
      <div class="agent-center-block-head">
        <h3>数据来源</h3>
        <span class="mono">DATA SOURCES</span>
      </div>
      <div class="agent-center-source-list">
        ${sources.map(([name, state, meta]) => `
          <div class="agent-center-source-row">
            <span>${acEscape(name)}</span>
            <em>${acEscape(state)}</em>
            <strong class="mono">${acEscape(meta)}</strong>
          </div>
        `).join('')}
      </div>
    </article>
  `;
}

function renderRuleBlock(rules) {
  return `
    <article class="agent-center-block agent-center-rule-block">
      <div class="agent-center-block-head">
        <h3>执行规则</h3>
        <span class="mono">RULES</span>
      </div>
      <ol class="agent-center-rule-list">
        ${rules.map((rule, index) => `<li><em class="mono">0${index + 1}</em><span>${acEscape(rule)}</span></li>`).join('')}
      </ol>
    </article>
  `;
}

function renderTemplateBlock(templates) {
  return `
    <article class="agent-center-block agent-center-template-block">
      <div class="agent-center-block-head">
        <h3>输出模板</h3>
        <span class="mono">OUTPUT</span>
      </div>
      <div class="agent-center-template-list">
        ${templates.map(t => `<button class="agent-center-template-chip" type="button">${acEscape(t)}</button>`).join('')}
      </div>
    </article>
  `;
}

function renderTestResult(test, active = false) {
  return `
    <div class="agent-center-test-state ${active ? 'is-active' : ''}">
      <div><span>命中功能</span><strong>${test.hit.map(acEscape).join(' / ')}</strong></div>
      <div><span>调用数据</span><strong>${test.data.map(acEscape).join(' / ')}</strong></div>
      <div><span>执行动作</span><strong>${test.action.map(acEscape).join(' / ')}</strong></div>
      <p>${acEscape(test.output)}</p>
      <em>风险提醒：${acEscape(test.risk)}</em>
    </div>
  `;
}

function bindAgentCenterEvents() {
  document.querySelectorAll('[data-agent-center-id]').forEach(btn => {
    btn.addEventListener('click', () => openAgentCenter(btn.dataset.agentCenterId));
  });

  document.querySelectorAll('[data-agent-center-module-id]').forEach(btn => {
    btn.addEventListener('click', () => {
      activeAgentCenterModuleId = btn.dataset.agentCenterModuleId;
      activeAgentCenterFieldIndex = null;
      renderAgentCenter(activeAgentCenterId);
    });
  });

  document.querySelectorAll('[data-agent-center-field-index]').forEach(btn => {
    btn.addEventListener('click', () => {
      activeAgentCenterFieldIndex = Number(btn.dataset.agentCenterFieldIndex);
      renderAgentCenter(activeAgentCenterId);
    });
  });

  document.querySelectorAll('.agent-center-template-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      chip.classList.toggle('is-selected');
      showToast(`✅ 输出模板已${chip.classList.contains('is-selected') ? '选中' : '取消'}（演示）`, 'success');
    });
  });

  document.querySelectorAll('[data-agent-center-action]').forEach(btn => {
    btn.addEventListener('click', () => {
      const action = btn.dataset.agentCenterAction;
      const agent = getAgent(activeAgentCenterId) || AGENTS[0];
      const cfg = AGENT_FUNCTION_CONFIGS[activeAgentCenterId] || AGENT_FUNCTION_CONFIGS.sales;
      if (action === 'back') {
        activeAgentCenterModuleId = null;
        activeAgentCenterFieldIndex = null;
        renderAgentCenter(activeAgentCenterId);
        return;
      }
      if (action === 'back-module') {
        activeAgentCenterFieldIndex = null;
        renderAgentCenter(activeAgentCenterId);
        return;
      }
      if (action === 'mock-save') {
        showToast('✅ 配置项已更新（演示）', 'success');
      }
      if (action === 'save-field') {
        showToast('✅ 第三级配置项已保存（演示）', 'success');
      }
      if (action === 'save') {
        showToast(`✅ ${agent.name} 功能配置已保存（演示）`, 'success');
      }
      if (action === 'reset') {
        renderAgentCenter(activeAgentCenterId);
        showToast(`✅ ${agent.name} 已恢复默认功能配置`, 'success');
      }
      if (action === 'test') {
        const result = document.getElementById('agentCenterTestResult');
        if (result) result.innerHTML = renderTestResult(cfg.test, true);
        showToast(`✅ ${agent.name} 测试运行完成`, 'success');
      }
    });
  });
}


