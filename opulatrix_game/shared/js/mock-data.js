/* ============================================
   Mock Data - 平台全局 mock 数据
   ============================================ */

window.MOCK = {
  // 平台全局数据（首页展示）
  platform: {
    totalMerchants: 1284,
    activeMerchants: 326,
    totalGames: 47,
    totalUsers: 1284500,
    userFormat: '128.4 万',
    monthlyConsumption: 8420000,
    monthlyConsumptionFormat: '842 万',
    monthlyCommission: 1260000,
    monthlyCommissionFormat: '126 万',
    globalIntegral: 5620000,
    globalIntegralFormat: '562 万',
    integralThreshold: {
      min: 2000000,
      max: 8000000,
      minFormat: '200 万',
      maxFormat: '800 万',
    },
  },

  // 当前模式（实时切换用）
  currentMode: 1, // 1 = 段一积分消纳, 2 = 段二流水抽佣

  // 当前商户账户（dashboard 第 3 张 KPI"待结算金额"用）
  currentMerchant: {
    name: '音浪对决',
    pendingSettlement: 268400,        // 当前周期可提现金额（元）
    pendingSettlementFormat: '26.84 万',
    estimatedArrival: '2026-07-10',   // 预计到账日
    daysUntilArrival: 3,              // 距到账还有 N 天
    withdrawalAvailable: 268400,      // 当前可提现（元）
    withdrawalAvailableFormat: '26.84 万',
    lastSettlement: {
      id: 'SET-202606-001',
      amount: 166500,
      amountFormat: '16.65 万',
      date: '2026-07-05',
    },
  },

  // 本月利润预估（dashboard 第 4 张 KPI 用）
  currentMonthProfit: {
    mode1Savings: 1240000,            // 段一积分消纳节流（元）
    mode1SavingsFormat: '124 万',     // 避免外部调用方算错
    mode1SavingsDesc: '段一积分消纳节流',
    mode2Commission: 480000,          // 段二流水分润（元）
    mode2CommissionFormat: '48 万',
    mode2CommissionDesc: '段二流水分润',
    total: 1720000,                   // 合计（元）
    totalFormat: '172 万',
    totalDelta: 18.4,                 // 较上月增长 %
    previousMonth: 1452000,           // 上月利润
    previousMonthFormat: '145.2 万',
    forecast: 1900000,                // 月末预估
    forecastFormat: '190 万',
    confidence: 87,                   // 预估置信度
  },

  // 商户列表（mock）
  merchants: [
    {
      id: 'M001',
      name: '音浪对决',
      logo: '音',
      gameType: '竞技对局',
      status: 'online',
      mode: 1,
      monthlyQuota: 2000000,
      quotaFormat: '200 万',
      consumed: 1240000,
      consumedFormat: '124 万',
      consumedPercent: 62,
      commission: 0,
      commissionFormat: '0',
    },
    {
      id: 'M002',
      name: '极速赛车',
      logo: '速',
      gameType: '竞速',
      status: 'online',
      mode: 2,
      monthlyQuota: 1500000,
      quotaFormat: '150 万',
      consumed: 1500000,
      consumedFormat: '150 万',
      consumedPercent: 100,
      commission: 480000,
      commissionFormat: '48 万',
    },
    {
      id: 'M003',
      name: '云上棋院',
      logo: '云',
      gameType: '棋牌',
      status: 'online',
      mode: 1,
      monthlyQuota: 1000000,
      quotaFormat: '100 万',
      consumed: 380000,
      consumedFormat: '38 万',
      consumedPercent: 38,
      commission: 0,
      commissionFormat: '0',
    },
    {
      id: 'M004',
      name: '幻境 RPG',
      logo: '幻',
      gameType: '角色扮演',
      status: 'online',
      mode: 2,
      monthlyQuota: 3000000,
      quotaFormat: '300 万',
      consumed: 3000000,
      consumedFormat: '300 万',
      consumedPercent: 100,
      commission: 950000,
      commissionFormat: '95 万',
    },
  ],

  // 入驻审核节点进度（mock）
  onboarding: {
    currentNode: 3,
    submittedAt: '2026-06-12 14:23',
    nodes: [
      { id: 1, name: '主体资质初审', status: 'done', date: '2026-06-13 10:15', note: '营业执照、对公账户、法人证件审核通过' },
      { id: 2, name: '游戏合规审核', status: 'done', date: '2026-06-15 16:42', note: '版号、ICP、软著齐全' },
      { id: 3, name: '技术对接试运营', status: 'in-progress', date: '2026-06-18 09:00', note: '数据上报接口联调中，预计 6/25 完成' },
      { id: 4, name: '正式终审', status: 'pending', date: '-', note: '待试运营数据达标后启动' },
      { id: 5, name: '上线开通', status: 'pending', date: '-', note: '终审通过后配置月度额度' },
    ],
  },

  // 每日消纳趋势（最近 30 天）
  consumptionTrend: Array.from({ length: 30 }, (_, i) => {
    const base = 35000 + Math.random() * 15000;
    return {
      day: i + 1,
      value: Math.round(base),
      mode: i < 18 ? 1 : 2,
    };
  }),

  // 段二每日利润（最近 7 天）
  commissionTrend: Array.from({ length: 7 }, (_, i) => {
    const base = 65000 + Math.random() * 25000;
    return {
      day: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'][i],
      value: Math.round(base),
    };
  }),

  // 结算单历史
  settlements: [
    {
      id: 'S202606',
      month: '2026-06',
      mode: 'mode-2',
      duration: '06-12 至 06-30',
      flowTotal: 18500000,
      flowFormat: '1850 万',
      commissionRate: 0.25,
      grossCommission: 4625000,
      grossFormat: '462.5 万',
      platformShare: 0.40,
      merchantShare: 0.60,
      merchantAmount: 2775000,
      merchantFormat: '277.5 万',
      status: 'paid',
    },
    {
      id: 'S202605',
      month: '2026-05',
      mode: 'mode-2',
      duration: '05-18 至 05-31',
      flowTotal: 12800000,
      flowFormat: '1280 万',
      commissionRate: 0.25,
      grossCommission: 3200000,
      grossFormat: '320 万',
      platformShare: 0.40,
      merchantShare: 0.60,
      merchantAmount: 1920000,
      merchantFormat: '192 万',
      status: 'paid',
    },
    {
      id: 'S202604',
      month: '2026-04',
      mode: 'mode-2',
      duration: '04-08 至 04-30',
      flowTotal: 21600000,
      flowFormat: '2160 万',
      commissionRate: 0.25,
      grossCommission: 5400000,
      grossFormat: '540 万',
      platformShare: 0.40,
      merchantShare: 0.60,
      merchantAmount: 3240000,
      merchantFormat: '324 万',
      status: 'paid',
    },
  ],

  // 星火养成面板（段一）专属数据
  consumption: {
    monthlyTarget: 2000000,
    monthlyTargetFormat: '200 万',
    consumed: 1240000,
    consumedFormat: '124 万',
    consumedPercent: 62,
    dailyRate: 62000,
    dailyRateFormat: '6.2 万',
    expectedCompleteDate: '2026-06-23',
    daysRunning: 18,
    daysInMonth: 30,
    consumptionChange: '+12.4%',

    // 30 天每日消纳量
    dailyConsumption: Array.from({ length: 30 }, (_, i) => {
      const base = 35000 + Math.random() * 15000;
      const weekendBoost = [0, 6].includes(i % 7) ? 1.3 : 1.0;
      return {
        day: i + 1,
        value: Math.round(base * weekendBoost),
        isWeekend: [0, 6].includes(i % 7),
      };
    }),

    // 消纳占比排行（我 vs 平台）
    ranking: {
      myRank: 47,
      myShare: 4.6,
      myConsumed: 1240000,
      platformAvg: 850000,
      platformAvgFormat: '85 万',
      top10Avg: 1850000,
      top10AvgFormat: '185 万',
    },

    // 实时养成记录（最近 8 条）
    liveFeed: [
      { time: '18:42', user: '玩家 f***8', amount: 2840, type: '消纳' },
      { time: '18:38', user: '玩家 k***2', amount: 5200, type: '消纳' },
      { time: '18:31', user: '玩家 m***5', amount: 1200, type: '消纳' },
      { time: '18:25', user: '玩家 t***9', amount: 8400, type: '消纳' },
      { time: '18:18', user: '玩家 w***1', amount: 3200, type: '消纳' },
      { time: '18:09', user: '玩家 h***3', amount: 6100, type: '消纳' },
      { time: '17:56', user: '玩家 n***7', amount: 4500, type: '消纳' },
      { time: '17:48', user: '玩家 q***4', amount: 2900, type: '消纳' },
    ],
  },

  // 星火燎原面板（段二）专属数据
  commission: {
    monthlyFlow: 18500000,
    monthlyFlowFormat: '1850 万',
    commissionRate: 0.25,
    platformShare: 0.40,
    merchantShare: 0.60,
    monthlyCommission: 2775000,
    monthlyCommissionFormat: '277.5 万',
    netIncome: 1665000,
    netIncomeFormat: '166.5 万',
    startDate: '2026-06-12',
    endDate: '2026-06-30',
    daysRunning: 14,
    daysInMonth: 30,
    daysToSettlement: 18,

    // 每日段二流水（最近 14 天）
    dailyFlow: [
      { day: '06-12', flow: 850000, format: '85 万' },
      { day: '06-13', flow: 920000, format: '92 万' },
      { day: '06-14', flow: 1180000, format: '118 万' },
      { day: '06-15', flow: 1350000, format: '135 万' },
      { day: '06-16', flow: 1280000, format: '128 万' },
      { day: '06-17', flow: 1420000, format: '142 万' },
      { day: '06-18', flow: 1560000, format: '156 万' },
      { day: '06-19', flow: 1380000, format: '138 万' },
      { day: '06-20', flow: 1620000, format: '162 万' },
      { day: '06-21', flow: 1450000, format: '145 万' },
      { day: '06-22', flow: 1580000, format: '158 万' },
      { day: '06-23', flow: 1320000, format: '132 万' },
      { day: '06-24', flow: 1680000, format: '168 万' },
      { day: '06-25', flow: 890000, format: '89 万' },
    ],

    // 历史段二利润对比（最近 6 月）
    historyCommissions: [
      { month: '01 月', amount: 2850000, format: '285 万' },
      { month: '02 月', amount: 1680000, format: '168 万' },
      { month: '03 月', amount: 3120000, format: '312 万' },
      { month: '04 月', amount: 3240000, format: '324 万' },
      { month: '05 月', amount: 1920000, format: '192 万' },
      { month: '06 月', amount: 1665000, format: '166.5 万', current: true },
    ],

    // 平台/商家分成（圆环图）
    shareSplit: {
      platform: 1110000,
      platformFormat: '111 万',
      merchant: 1665000,
      merchantFormat: '166.5 万',
    },
  },

  // 消息中心（5 类）
  messages: [
    // ===== 平台公告 =====
    {
      id: 'msg-001', type: 'announce', pinned: true, read: false,
      title: '【平台公告】关于 7 月 15 日系统升级维护通知',
      preview: '维护时间 7/15 02:00 - 06:00，期间商户后台及对账接口将短暂不可用。',
      body: '尊敬的游戏商户：\n\n为提升平台服务质量，Opulatrix 计划于 2026 年 7 月 15 日 02:00 - 06:00 进行系统升级维护。\n\n维护期间影响范围：\n· 商户后台登录、对账、结算查询功能将不可用\n· 玩家支付通道正常不受影响\n· 数据对账 API 短暂不可用（<30 分钟）\n\n请提前安排相关工作，如有疑问可联系专属客服李娜。',
      date: '2026-07-07 10:30',
    },
    {
      id: 'msg-002', type: 'announce', pinned: false, read: false,
      title: '【平台公告】星火养成期月度评优名单公布（6 月）',
      preview: '本月积分消纳 Top 10 商户公布，音浪对决连续 3 月登顶。',
      body: '2026 年 6 月星火养成期评优结果已公布。\n\nTop 10 商户名单：\n1. 音浪对决（消纳 198 万）\n2. 极速赛车（消纳 176 万）\n3. ...',
      date: '2026-07-05 09:00',
    },
    {
      id: 'msg-003', type: 'announce', pinned: false, read: true,
      title: '【平台公告】结算规则 v2.3 生效通知',
      preview: '新增段一商户自动切段阈值 250 万，7 月 1 日起执行。',
      body: '结算规则 v2.3 已于 7 月 1 日生效。新增段一商户自动切段阈值 250 万。详细规则见规则中心。',
      date: '2026-07-01 14:00',
    },
    // ===== 系统通知 =====
    {
      id: 'msg-101', type: 'system', pinned: false, read: false,
      title: '【系统通知】您的对公账户验证已通过',
      preview: '尾号 6688 的中国工商银行账户已通过验证，可正常收款。',
      body: '尾号 6688 的中国工商银行账户验证已通过。从 2026-07-07 起，该账户可用于平台结算收款。',
      date: '2026-07-07 16:18',
    },
    {
      id: 'msg-102', type: 'system', pinned: false, read: false,
      title: '【系统通知】API 密钥即将到期',
      preview: '您的生产环境 API Key 将于 2026-08-15 到期，请及时更新。',
      body: '您的生产环境 API Key（pk_live_xxxx）将于 2026-08-15 到期。\n\n请在到期前前往"账户设置 - API 密钥"页面更新密钥，避免影响业务。',
      date: '2026-07-06 11:22',
    },
    {
      id: 'msg-103', type: 'system', pinned: false, read: true,
      title: '【系统通知】账户安全提醒',
      preview: '您的账户在异地登录（如有疑问请修改密码）。',
      body: '您的账户于 2026-07-03 09:42 在 北京 登录。如非本人操作，请立即修改密码。',
      date: '2026-07-03 09:42',
    },
    // ===== 审核进度 =====
    {
      id: 'msg-201', type: 'review', pinned: false, read: false,
      title: '【审核进度】您的资料补充已通过',
      preview: '营业执照（副本）已通过审核，主体资质完整度达 100%。',
      body: '您于 2026-07-06 补充的"营业执照（副本）"已通过审核。\n\n当前主体资质完整度：100%（10/10）\n当前游戏资料完整度：85%（11/13）\n\n请尽快补全剩余 2 项游戏资料。',
      date: '2026-07-07 14:32',
      link: 'onboarding.html',
    },
    {
      id: 'msg-202', type: 'review', pinned: false, read: false,
      title: '【审核进度】游戏版号备案待补充',
      preview: '《极速赛车》缺少游戏版号批文，请尽快补充。',
      body: '您提交的《极速赛车》游戏资料中，缺少"游戏版号批文"（P0 阻塞项）。\n\n请尽快补充，否则将影响上线审核进度。',
      date: '2026-07-05 16:00',
      link: 'onboarding.html',
    },
    {
      id: 'msg-203', type: 'review', pinned: false, read: true,
      title: '【审核进度】入驻申请初审通过',
      preview: '主体资质初审已通过，进入复审阶段（预计 1-3 工作日）。',
      body: '您于 2026-06-30 提交的入驻申请初审已通过。复审由审核顾问张明负责，预计 1-3 工作日完成。',
      date: '2026-07-01 10:15',
      link: 'onboarding.html',
    },
    // ===== 资金变动 =====
    {
      id: 'msg-301', type: 'finance', pinned: false, read: false,
      title: '【资金变动】结算入账 +166,500.00 元',
      preview: '6 月结算单（6/1-6/30）已入账对公账户。',
      body: '结算单 #SET-202606-001 已入账。\n\n入账金额：¥ 166,500.00\n对公账户：尾号 6688 中国工商银行\n入账时间：2026-07-05 14:30',
      date: '2026-07-05 14:30',
      link: 'settlement.html',
    },
    {
      id: 'msg-302', type: 'finance', pinned: false, read: false,
      title: '【资金变动】提现申请处理中',
      preview: '提现单 #TX-20260707-001 金额 ¥50,000，预计 2 小时内到账。',
      body: '您的提现申请已受理：\n\n提现单号：#TX-20260707-001\n提现金额：¥ 50,000.00\n预计到账：2026-07-07 18:30 前',
      date: '2026-07-07 14:20',
      link: 'settlement.html',
    },
    {
      id: 'msg-303', type: 'finance', pinned: false, read: true,
      title: '【资金变动】充值到账 +100,000.00 元',
      preview: '对公账户充值到账，余额 ¥ 268,400.00。',
      body: '对公账户充值到账 ¥ 100,000.00。当前余额 ¥ 268,400.00。',
      date: '2026-07-02 11:00',
      link: 'settlement.html',
    },
    // ===== 申诉处理 =====
    {
      id: 'msg-401', type: 'appeal', pinned: false, read: false,
      title: '【申诉处理】您的申诉 #AP-202607-008 已受理',
      preview: '对账争议"6/15 交易流水缺失"已分配处理，预计 1-2 工作日反馈。',
      body: '您的申诉申请已受理：\n\n申诉单号：#AP-202607-008\n申诉类型：对账争议（流水缺失）\n处理人：争议处理组 王浩\n预计反馈：1-2 工作日',
      date: '2026-07-07 11:20',
      link: 'reconciliation.html',
    },
    {
      id: 'msg-402', type: 'appeal', pinned: false, read: true,
      title: '【申诉处理】申诉 #AP-202606-022 已结案',
      preview: '6 月对账争议"重复扣款"已处理完成，补偿 ¥3,200 已入账。',
      body: '申诉 #AP-202606-022 已结案。\n\n处理结果：经核实为系统重复扣款，已退款 ¥ 3,200.00。\n补偿金额已入账对公账户。',
      date: '2026-06-28 16:00',
      link: 'reconciliation.html',
    },
  ],
};
