/* 慈商联营 · 项目详情页
 * 路径：pages/project-detail.html
 * URL：?id=p-em-001 (项目 ID)
 * 7 大区块：hero / 信任 / 故事 / 数据 / 反馈 / CTA / 相关项目
 * 视觉：类目色贯通全页（CSS 变量 --c1 注入）
 */
(function () {
  'use strict';

  /* ===== 1. 类目元数据（跟 projects.js 对齐） ===== */
  const CATS = {
    urgent:   { name: '应急救援', c1: '#DC2626', c1Dark: '#B91C1C', soft: '#FEE2E2', bg: 'linear-gradient(135deg, #FEF2F2 0%, #FFF 100%)', cls: 'urgent' },
    longterm: { name: '长线陪伴', c1: '#0277BD', c1Dark: '#01579B', soft: '#E0F2FE', bg: 'linear-gradient(135deg, #E0F2FE 0%, #FFF 100%)', cls: 'longterm' },
    children: { name: '儿童助学', c1: '#D97706', c1Dark: '#B45309', soft: '#FEF3C7', bg: 'linear-gradient(135deg, #FEF3C7 0%, #FFF 100%)', cls: 'children' },
    elderly:  { name: '老人关怀', c1: '#7C3AED', c1Dark: '#6D28D9', soft: '#EDE9FE', bg: 'linear-gradient(135deg, #EDE9FE 0%, #FFF 100%)', cls: 'elderly' },
    rural:    { name: '乡村建设', c1: '#16A34A', c1Dark: '#15803D', soft: '#DCFCE7', bg: 'linear-gradient(135deg, #DCFCE7 0%, #FFF 100%)', cls: 'rural' },
    health:   { name: '医疗健康', c1: '#E11D48', c1Dark: '#BE123C', soft: '#FFE4E6', bg: 'linear-gradient(135deg, #FFE4E6 0%, #FFF 100%)', cls: 'health' },
  };

  /* ===== 2. 18 个项目详情数据 ===== */
  const PROJECTS = {
    /* ===== 应急救援（4） ===== */
    'p-em-001': {
      cat: 'urgent', icon: '🌋', name: '云南鲁甸 6.0 级地震抗震救灾',
      org: '云南省慈善总会 · 联合发起', region: '云南 · 鲁甸县',
      statDonate: '32,860 件', statPeople: '12,000', statSpeed: '< 4h 响应',
      goal: 50000, raised: 32860, urgent: true, latest: '2026-06-12',
      story: '2026 年 6 月 12 日凌晨 2 时 14 分，云南鲁甸发生 6.0 级地震，震源深度 12 公里。地震造成 32 个乡镇受灾、12,000 名群众紧急转移，其中儿童 1,800 人、老人 2,300 人。慈商联营在震后 2 小时内启动应急预案，联动美心食品（面包 80 吨）、伊利集团（牛奶 50 万盒）、顺丰公益物流（24h 紧急承运）、立白集团（卫生防护包 5,000 套）等 12 家爱心企业，72 小时内将 280 万元物资送达 32 个安置点。',
      background: '云南鲁甸是地震多发地区，2014 年 8 月曾发生 6.5 级地震，造成 617 人死亡。鲁甸地处乌蒙山腹地，山高谷深，自然灾害频发，公益资源长期不足。',
      goals: ['为 32 个安置点 12,000 名受灾群众提供 30 天基本生活保障', '紧急调拨帐篷 1,200 顶、棉被 8,000 床、食品 80 吨', '为 1,800 名儿童提供营养餐 + 学习用品', '为 2,300 名老人提供慢病药品 + 助行器'],
      timeline: [
        { t: '2026-06-12 02:14', d: '云南鲁甸 6.0 级地震发生，慈商联营 2 小时内启动应急响应' },
        { t: '2026-06-12 06:00', d: '第一批救援物资（食品 + 饮用水）从昆明仓紧急发车' },
        { t: '2026-06-12 18:00', d: '美心食品 80 吨面包、娃哈哈 30 万瓶矿泉水抵达 32 个安置点' },
        { t: '2026-06-13 12:00', d: '帐篷 1,200 顶、棉被 8,000 床全部到位' },
        { t: '2026-06-15 20:00', d: '儿童营养餐启动配送，覆盖 18 所临时学校' },
        { t: '2026-06-20', d: '老人慢病药品到位，1,800 名老人完成健康评估' },
        { t: '2026-07-12', d: '响应阶段结束，转入 6 个月"灾后重建"长线项目' },
      ],
      funds: [
        { type: '食品 / 饮用水', pct: 38, val: '12,500 件', desc: '面包 80 吨、牛奶 50 万盒、矿泉水 30 万瓶' },
        { type: '应急物资', pct: 28, val: '9,200 件', desc: '帐篷 1,200 顶、棉被 8,000 床、衣物 1,000 套' },
        { type: '儿童关怀', pct: 14, val: '4,600 件', desc: '营养餐包 3,000 份、学习用品 1,600 套' },
        { type: '老人关怀', pct: 12, val: '3,940 件', desc: '慢病药品 2,300 份、助行器 640 套' },
        { type: '物流仓储', pct: 8, val: '2,630 件', desc: '顺丰 24h 紧急承运 + 仓储' },
      ],
      thanks: [
        { type: 'voice', avatar: '王', name: '王主任', meta: '鲁甸县民政局', body: '慈商联营的响应速度让我们非常感动。地震后 4 小时内送达的 80 吨面包和牛奶，让 32 个安置点 1.2 万人吃上了热乎饭。', priv: '已通过平台脱敏审核' },
        { type: 'handwritten', avatar: '李', name: '李校长', meta: '鲁甸县 · 龙头山中心小学', body: '感谢慈商联营 4 天内为我们 230 个孩子搭起临时学校、配齐课本，6 月 20 日就能正常上课了。', priv: '已获学校授权' },
        { type: 'voice', avatar: '陈', name: '陈社工', meta: '鲁甸县 · 益童乐园', body: '物资之外，平台派来的 3 名儿童心理辅导师帮孩子们走出地震阴影，这份"陪伴"是金钱买不到的。', priv: '已通过平台脱敏审核' },
      ],
    },

    'p-em-002': {
      cat: 'urgent', icon: '🌀', name: '福建福州超强台风"海鸥"救援',
      org: '福建省红十字会 · 联合发起', region: '福建 · 福州 6 县',
      statDonate: '28,500 件', statPeople: '8,000', statSpeed: '< 6h 响应',
      goal: 40000, raised: 28500, urgent: true, latest: '2026-06-10',
      story: '2026 年 6 月 10 日上午 9 时，17 级超强台风"海鸥"正面登陆福州连江县，沿海 6 县（连江、罗源、福清、长乐、平潭、马尾）受灾严重。最大风力 17 级，阵风 19 级，沿海出现 4-6 米巨浪。慈商联营在台风登陆前 6 小时启动应急响应，联动福建本地 8 家企业，紧急转移 8,000 名沿海群众，提供应急照明、食品、保暖物资。',
      background: '福建是台风高频地区，年均 3-4 次台风过境。"海鸥"为 1949 年以来 6 月最强台风，破坏力超过 2018 年"山竹"。',
      goals: ['紧急转移 8,000 名沿海群众至安全地带', '为安置点提供 7 天基本生活保障', '为 1,200 名儿童提供心理疏导 + 学习用品', '台风过后启动"重建"长线项目'],
      timeline: [
        { t: '2026-06-10 03:00', d: '气象台发布红色预警，慈商联营 6 小时内启动应急响应' },
        { t: '2026-06-10 09:00', d: '"海鸥"登陆连江县，沿海 6 县受灾' },
        { t: '2026-06-10 14:00', d: '第一批应急物资（食品 + 照明）从福州仓发出' },
        { t: '2026-06-10 22:00', d: '8,000 名群众全部安全转移，6 个安置点启动' },
        { t: '2026-06-12', d: '儿童心理疏导团队 12 人抵达 6 县' },
        { t: '2026-06-15', d: '台风过后清淤 + 重建开始，项目进入长线阶段' },
      ],
      funds: [
        { type: '应急物资', pct: 42, val: '11,970 件', desc: '应急照明设备 3,000 套、保暖物资 8,970 件' },
        { type: '食品', pct: 28, val: '7,980 件', desc: '方便食品 4,000 箱、面包 2,000 箱、牛奶 1,980 箱' },
        { type: '儿童关怀', pct: 16, val: '4,560 件', desc: '心理疏导套装 1,200 份、学习用品 3,360 套' },
        { type: '物流', pct: 10, val: '2,850 件', desc: '本地配送 + 仓储' },
        { type: '其他', pct: 4, val: '1,140 件', desc: '行政物资' },
      ],
      thanks: [
        { type: 'voice', avatar: '林', name: '林主任', meta: '连江县应急办', body: '慈商联营 6 小时响应速度打破了我们历年的记录，8,000 名群众在台风登陆前 5 小时全部安全转移。', priv: '已通过平台脱敏审核' },
        { type: 'handwritten', avatar: '黄', name: '黄校长', meta: '罗源县 · 碧里中心小学', body: '安置点的临时学校让 230 个孩子没有落下一天课。', priv: '已获学校授权' },
      ],
    },

    'p-em-003': {
      cat: 'urgent', icon: '⛰️', name: '甘肃临夏特大泥石流救援',
      org: '甘肃省民政厅 · 联合发起', region: '甘肃 · 临夏州 3 镇',
      statDonate: '38,200 件', statPeople: '4,500', statSpeed: '< 3h 响应',
      goal: 55000, raised: 38200, urgent: true, latest: '2026-06-08',
      story: '2026 年 6 月 8 日凌晨，临夏州遭遇 50 年一遇特大暴雨，3 个乡镇发生山洪泥石流，4,500 人被困。慈商联营 3 小时内启动应急响应，联动顺丰 24h 紧急承运、娃哈哈纯净水紧急调拨、海尔家电紧急配送、立白卫生防护包。',
      background: '甘肃临夏地处青藏高原与黄土高原过渡带，地质脆弱，是滑坡泥石流高发区。',
      goals: ['为 3 个受灾乡镇 4,500 名被困群众提供紧急救援', '72 小时内打通生命通道', '为 800 名儿童提供心理疏导 + 临时学校', '为 600 名老人提供慢病药品'],
      timeline: [
        { t: '2026-06-08 04:00', d: '临夏 50 年一遇暴雨，3 镇发生山洪泥石流' },
        { t: '2026-06-08 07:00', d: '慈商联营 3 小时内启动应急响应' },
        { t: '2026-06-08 14:00', d: '顺丰 24h 紧急承运启动，第一批物资发车' },
        { t: '2026-06-09 06:00', d: '4,500 名被困群众全部转移至 6 个安置点' },
        { t: '2026-06-10', d: '儿童临时学校 + 老人慢病药品到位' },
        { t: '2026-06-15', d: '进入灾后重建阶段，3 个月长线项目' },
      ],
      funds: [
        { type: '应急救援', pct: 45, val: '17,190 件', desc: '生命通道物资、被困群众转移设备' },
        { type: '食品 / 饮用水', pct: 25, val: '9,550 件', desc: '纯净水 6,000 箱、面包 2,000 箱' },
        { type: '儿童关怀', pct: 14, val: '5,348 件', desc: '临时学校物资 3,000 套、心理疏导包 2,348 份' },
        { type: '老人关怀', pct: 10, val: '3,820 件', desc: '慢病药品 2,500 份、护理包 1,320 套' },
        { type: '物流', pct: 6, val: '2,292 件', desc: '顺丰 24h 紧急承运' },
      ],
      thanks: [
        { type: 'voice', avatar: '马', name: '马主任', meta: '临夏州应急办', body: '慈商联营 + 顺丰的 24h 紧急承运，把救援响应时间从 12 小时压到 3 小时，这是行业的革命。', priv: '已通过平台脱敏审核' },
      ],
    },

    'p-em-004': {
      cat: 'urgent', icon: '🏔️', name: '西藏日喀则 6.8 级地震 · 已完成',
      org: '中国红十字会 · 已结项', region: '西藏 · 日喀则',
      statDonate: '86,000 件', statPeople: '15,000', statSpeed: '已结项',
      goal: 86000, raised: 86000, urgent: false, latest: '2025-10-15',
      story: '2025 年 10 月 8 日，西藏日喀则发生 6.8 级地震。慈商联营联动 20 家企业，14 天内将 520 万元物资送达 15,000 名受灾群众，目前所有应急响应已完成，项目转入"灾后重建"长线阶段（30 个月）。',
      background: '高原地震救援难度极大，海拔 4,000+ 米，运输距离 2,000+ 公里。',
      goals: ['已完成 14 天应急响应，物资 100% 到位', '为 15,000 名受灾群众提供 30 天基本保障', '为 3,200 名儿童提供临时学校', '正在转入 30 个月"灾后重建"长线项目'],
      timeline: [
        { t: '2025-10-08', d: '西藏日喀则 6.8 级地震，慈商联营 2 小时响应' },
        { t: '2025-10-09', d: '首批 50 万物资从拉萨发出，顺丰专机承运' },
        { t: '2025-10-12', d: '15,000 名群众转移至 12 个安置点' },
        { t: '2025-10-22', d: '应急响应结束，14 天物资 100% 到位' },
        { t: '2025-11', d: '转入"灾后重建"长线项目（30 个月）' },
      ],
      funds: [
        { type: '应急救援', pct: 40, val: '34,400 件', desc: '救援装备、生命通道设备' },
        { type: '食品 / 保暖', pct: 30, val: '25,800 件', desc: '高原专用食品 15,000 份、棉衣 10,800 件' },
        { type: '儿童关怀', pct: 18, val: '15,480 件', desc: '临时学校物资 + 营养餐包' },
        { type: '老人关怀', pct: 8, val: '6,880 件', desc: '慢病药品 4,000 份、护理包 2,880 套' },
        { type: '物流', pct: 4, val: '3,440 件', desc: '专机 + 高原运输物资' },
      ],
      thanks: [
        { type: 'voice', avatar: '扎', name: '扎西县长', meta: '日喀则 · 定日县', body: '慈商联营 + 中国红十字会的组合拳，是西藏历次地震响应中最专业、最高效的一次。', priv: '已通过平台脱敏审核' },
      ],
    },

    /* ===== 长线陪伴（4） ===== */
    'p-lt-001': {
      cat: 'longterm', icon: '🍞', name: '"暖心早餐"长线项目',
      org: '美心食品 × 中国青少年发展基金会', region: '12 省 · 230 校',
      statDonate: '48,200 份/月', statPeople: '6,200', statSpeed: '持续中',
      goal: 80000, raised: 48200, urgent: false, latest: '2026-01-10',
      story: '由美心食品联合中国青少年发展基金会发起，向 12 个省份、230 所偏远山区学校持续供应早餐包（含面包 1 个 + 学生奶 1 盒 + 鸡蛋 1 个）。截至 2026 年 6 月，已稳定覆盖 6,200 名学生，其中留守儿童占比 78%。',
      background: '中国农村学生早餐营养缺失率高达 35%，是造成学习能力下降、健康问题的主因之一。',
      goals: ['为 230 所学校 6,200 名学生提供每日早餐', '覆盖 12 个省份的偏远山区', '联合 5 家以上食品企业扩大供给', '到 2028 年覆盖 500 所学校'],
      timeline: [
        { t: '2026-01-10', d: '"暖心早餐"项目正式启动，首批 50 所学校' },
        { t: '2026-03-01', d: '覆盖学校突破 100 所，受惠学生 3,000' },
        { t: '2026-05-15', d: '美心食品 2,000 万元专项基金到位' },
        { t: '2026-06-01', d: '覆盖学校达 230 所，受惠学生 6,200' },
        { t: '2026-12 (预计)', d: '覆盖学校 300 所，受惠学生 10,000' },
      ],
      funds: [
        { type: '早餐包', pct: 70, val: '33,740 份/月', desc: '面包 1 个 + 学生奶 1 盒 + 鸡蛋 1 个' },
        { type: '冷链物流', pct: 18, val: '8,676 次/月', desc: '顺丰冷链配送到 230 所学校' },
        { type: '项目管理', pct: 8, val: '3,856 次', desc: '学校对接 + 质量监督' },
        { type: '行政', pct: 4, val: '1,928 次', desc: '平台运维支持' },
      ],
      thanks: [
        { type: 'voice', avatar: '吴', name: '吴校长', meta: '云南 · 怒江山村小学', body: '暖心早餐让 230 个孩子每天早上都能吃上热乎饭，上课注意力明显提升。', priv: '已获学校授权' },
        { type: 'handwritten', avatar: '小', name: '小雨（化名）', meta: '贵州 · 黔东南山区', body: '我最喜欢周三的面包，因为周三的里面有葡萄干。', priv: '已获监护人授权' },
      ],
    },

    'p-lt-002': {
      cat: 'longterm', icon: '🥛', name: '"伊利营养 2030" 长期学生奶计划',
      org: '伊利集团 × 中国奶业协会', region: '22 省 · 480 校',
      statDonate: '286 万盒/年', statPeople: '98,200', statSpeed: '持续中',
      goal: 4000000, raised: 2860000, urgent: false, latest: '2024-07-01',
      story: '由伊利集团联合中国奶业协会发起的 10 年长期承诺，承诺到 2030 年向偏远地区儿童捐赠价值 5 亿元的学生奶。截至 2026 年 6 月，已累计向 22 个省、480 所学校、98,200 名学生持续提供学生奶 + 营养早餐包。',
      background: '联合国 SDG 2 零饥饿合作伙伴；项目覆盖新疆、西藏、青海、甘肃等高海拔地区。',
      goals: ['10 年内向偏远地区儿童捐赠价值 5 亿元的学生奶', '到 2028 年覆盖 800 所学校', '在新疆、西藏、青海海拔 4,000+ 米地区实现 100% 覆盖', '建立学生奶公益捐赠行业标准'],
      timeline: [
        { t: '2024-07-01', d: '"伊利营养 2030"项目启动，首批 100 所学校' },
        { t: '2025-06-01', d: '覆盖学校突破 300 所，受惠学生 60,000' },
        { t: '2025-12-01', d: '联合发布《学生奶公益捐赠白皮书》' },
        { t: '2026-06-01', d: '覆盖学校达 480 所，受惠学生 98,200' },
        { t: '2028 (预计)', d: '覆盖学校 800 所，受惠学生 200,000' },
      ],
      funds: [
        { type: '学生奶', pct: 78, val: '223 万盒', desc: '伊利专项供应，覆盖 480 校' },
        { type: '冷链物流', pct: 14, val: '40 万次', desc: '冷链配送到 480 所学校' },
        { type: '项目管理', pct: 6, val: '17 万次', desc: '学校对接 + 质量抽检' },
        { type: '行业研究', pct: 2, val: '6 万份', desc: '《学生奶公益白皮书》' },
      ],
      thanks: [
        { type: 'voice', avatar: '扎', name: '扎西校长', meta: '西藏 · 那曲县中心小学', body: '我们学校海拔 4,500 米，孩子们每天能喝到一盒伊利学生奶，是 5 年前想都不敢想的事。', priv: '已通过平台脱敏审核' },
        { type: 'handwritten', avatar: '古', name: '古丽', meta: '新疆 · 喀什', body: '我以后也要做帮助别人的人。', priv: '已获监护人授权' },
      ],
    },

    'p-lt-003': {
      cat: 'longterm', icon: '🌿', name: '"春苗营养计划" 4.0',
      org: '安利（中国）× 中国青少年发展基金会', region: '18 省 · 420 校',
      statDonate: '56,200 套', statPeople: '76,500', statSpeed: '持续中',
      goal: 80000, raised: 56200, urgent: false, latest: '2025-04-15',
      story: '安利（中国）联合中国青少年发展基金会发起的儿童营养助学项目，4.0 版本新增 80 所合作学校，为偏远地区学校持续供应儿童营养品 + 学习用品 + 卫生教育包。',
      background: '安利"春苗营养计划"已运营 8 年，从 1.0 到 4.0 持续升级。',
      goals: ['为 18 省 420 校 76,500 学生提供营养品 + 学习用品', '4.0 版本新增 80 所学校', '开展儿童卫生健康教育课程', '到 2028 年覆盖 600 校'],
      timeline: [
        { t: '2025-04-15', d: '春苗营养计划 4.0 启动，新增 80 校' },
        { t: '2025-09-01', d: '覆盖学校达 380 所，受惠学生 65,000' },
        { t: '2026-01-01', d: '覆盖学校达 420 所，受惠学生 76,500' },
        { t: '2026-06-01', d: '儿童卫生健康教育覆盖 18 省' },
      ],
      funds: [
        { type: '营养品', pct: 55, val: '30,910 份', desc: '安利儿童营养包' },
        { type: '学习用品', pct: 22, val: '12,364 套', desc: '文具、书包、台灯' },
        { type: '卫生教育', pct: 15, val: '8,430 套', desc: '课程包 + 培训教材' },
        { type: '项目管理', pct: 8, val: '4,496 次', desc: '学校对接 + 质量监督' },
      ],
      thanks: [
        { type: 'voice', avatar: '罗', name: '罗校长', meta: '贵州 · 黔东南', body: '安利春苗计划给孩子们带来的不只是营养品，更是"有人记得我们"的感觉。', priv: '已通过平台脱敏审核' },
      ],
    },

    'p-lt-004': {
      cat: 'longterm', icon: '🌲', name: '贵州山火救援队常驻项目',
      org: '贵州省慈善总会', region: '贵州 · 3 个物资站',
      statDonate: '1,280 套', statPeople: '—', statSpeed: '持续中',
      goal: 1800, raised: 1280, urgent: false, latest: '2025-08-10',
      story: '在贵州山区设立 3 个常驻救援物资站，常年储备灭火器材、应急食品、医疗物资，由当地救援队 24h 备勤。',
      background: '贵州山区森林覆盖率高，2024-2025 年连续 2 年发生大规模山火，暴露救援物资储备不足问题。',
      goals: ['在贵州山区设立 3 个常驻救援物资站', '储备灭火器材 200 套、应急食品 50 吨', '培训 50 名本地救援队员', '建立山火 1 小时响应机制'],
      timeline: [
        { t: '2025-08-10', d: '贵州山火救援队常驻项目启动' },
        { t: '2025-10', d: '3 个物资站全部建成' },
        { t: '2026-04', d: '贵州山火救援中，1 小时到达现场' },
        { t: '2026-06', d: '累计响应 12 次山火，0 重大人员伤亡' },
      ],
      funds: [
        { type: '物资储备', pct: 55, val: '704 套', desc: '灭火器 200 套、应急食品 400 套、医疗包 104 套' },
        { type: '队伍建设', pct: 25, val: '320 人次', desc: '救援队员培训 50 人 × 6 轮' },
        { type: '站点建设', pct: 15, val: '192 件', desc: '3 个物资站基础设施' },
        { type: '其他', pct: 5, val: '64 次', desc: '管理运营' },
      ],
      thanks: [
        { type: 'voice', avatar: '杨', name: '杨队长', meta: '贵州 · 山火救援队', body: '物资站建在山里，我们 1 小时就能到位，不再像以前等 6 小时物资从贵阳运来。', priv: '已通过平台脱敏审核' },
      ],
    },

    /* ===== 儿童助学（3） ===== */
    'p-ch-001': {
      cat: 'children', icon: '✉️', name: '"一封家书"乡村儿童陪伴项目',
      org: '中国社会工作联合会', region: '8 省 · 3,000 名儿童',
      statDonate: '3,600 封', statPeople: '3,000', statSpeed: '持续中',
      goal: 5000, raised: 3600, urgent: false, latest: '2025-09-01',
      story: '为 3,000 名留守儿童对接城市志愿者笔友，每月通信 1 次，建立长期情感陪伴关系。截至 2025-12，已成功配对 2,800 对。',
      background: '中国农村留守儿童超过 1,000 万，长期缺乏陪伴导致心理健康问题高发。',
      goals: ['为 3,000 名留守儿童对接城市志愿者笔友', '每月通信 1 次，建立长期陪伴', '志愿者培训 1,000 名', '到 2026 年底覆盖 5,000 名儿童'],
      timeline: [
        { t: '2025-09-01', d: '"一封家书"项目启动，首批 500 名儿童' },
        { t: '2025-12-01', d: '配对成功 2,800 对，第一批信件送达' },
        { t: '2026-03-01', d: '志愿者培训 1,000 名' },
        { t: '2026-06-01', d: '配对儿童达 3,000 名' },
      ],
      funds: [
        { type: '志愿者运营', pct: 50, val: '1,800 人次', desc: '城市志愿者招募 + 配对管理' },
        { type: '物资', pct: 30, val: '1,080 件', desc: '信纸、文具、邮费每学期 1 次' },
        { type: '项目管理', pct: 15, val: '540 次', desc: '学校对接 + 信件审核' },
        { type: '其他', pct: 5, val: '180 次', desc: '行政支持' },
      ],
      thanks: [
        { type: 'handwritten', avatar: '小', name: '小红（化名）', meta: '湖南 · 湘西', body: '上海的姐姐每个月都给我写信，告诉我她家的小狗叫嘟嘟，我很想见到她。', priv: '已获监护人授权' },
      ],
    },

    'p-ch-002': {
      cat: 'children', icon: '🎒', name: '"新书包"开学季援助',
      org: '中国教育发展基金会', region: '10 省 · 5,000 名学生',
      statDonate: '6,200 套', statPeople: '5,000', statSpeed: '持续中',
      goal: 8000, raised: 6200, urgent: false, latest: '2025-08-25',
      story: '每年开学季为偏远地区 5,000 名学生捐赠新书包、文具、台灯。已连续运营 6 年，累计覆盖 30,000 名学生。',
      background: '中国乡村学生 38% 仍在使用 3 年以上的旧书包，文具短缺率达 22%。',
      goals: ['为 5,000 名学生提供开学装备', '运营 10 个省份', '到 2027 年覆盖 8,000 名', '联合 3 家以上文具品牌'],
      timeline: [
        { t: '2025-08-25', d: '"新书包"6.0 启动，首批 5,000 名' },
        { t: '2025-09-01', d: '开学季 5,000 个新书包送达 10 省 80 校' },
        { t: '2026-08-25 (预计)', d: '7.0 启动，覆盖 6,000 名' },
      ],
      funds: [
        { type: '书包采购', pct: 55, val: '3,410 套', desc: '新书包 + 品牌文具套装 + 台灯' },
        { type: '文具', pct: 30, val: '1,860 套', desc: '备用文具包 2,000 份' },
        { type: '物流', pct: 10, val: '620 批', desc: '顺丰配送到 10 省 80 所学校' },
        { type: '其他', pct: 5, val: '310 次', desc: '项目管理 + 学校对接' },
      ],
      thanks: [
        { type: 'voice', avatar: '赵', name: '赵校长', meta: '云南 · 文山', body: '新书包让 230 个孩子开学第一天就特别兴奋，有些孩子舍不得用，放学后把书包抱回家。', priv: '已获学校授权' },
      ],
    },

    'p-ch-003': {
      cat: 'children', icon: '🌸', name: '"守护花蕾"女童安全教育',
      org: '中国少年儿童基金会', region: '12 省 · 800 校',
      statDonate: '1,280 套', statPeople: '120,000', statSpeed: '持续中',
      goal: 1800, raised: 1280, urgent: false, latest: '2025-05-15',
      story: '为 800 所乡村小学提供女童安全教育课程包，含教材、教具、培训，已覆盖 120,000 名女生。',
      background: '中国乡村女童性教育覆盖率不足 30%，是导致自我保护意识薄弱的主因。',
      goals: ['为 12 省 800 校提供女童安全教育', '培训 1,200 名女童保护讲师', '覆盖 120,000 名女生', '到 2027 年覆盖 1,000 校'],
      timeline: [
        { t: '2025-05-15', d: '"守护花蕾"3.0 启动，新增 200 校' },
        { t: '2025-09-01', d: '秋季学期开课，覆盖 600 校 90,000 名女生' },
        { t: '2026-03-01', d: '春季学期开课，累计覆盖 800 校 120,000 名' },
      ],
      funds: [
        { type: '课程开发', pct: 35, val: '448 套', desc: '女童安全教育教材 + 教具包' },
        { type: '师资培训', pct: 30, val: '384 人次', desc: '1,200 名讲师培训' },
        { type: '课程实施', pct: 25, val: '320 校次', desc: '800 所学校开课支持' },
        { type: '其他', pct: 10, val: '128 次', desc: '项目管理' },
      ],
      thanks: [
        { type: 'voice', avatar: '周', name: '周校长', meta: '贵州 · 黔南', body: '"守护花蕾"课程让 800 个女生学会了"身体的小秘密"，遇到问题知道该找谁。', priv: '已获学校授权' },
      ],
    },

    /* ===== 老人关怀（2） ===== */
    'p-el-001': {
      cat: 'elderly', icon: '🍱', name: '"暖心食堂" 农村老人助餐',
      org: '中国老龄事业发展基金会', region: '15 省 · 200 个社区',
      statDonate: '86 万份', statPeople: '12,000', statSpeed: '持续中',
      goal: 1200000, raised: 860000, urgent: false, latest: '2025-06-20',
      story: '在 200 个农村社区设立老人助餐点，60 岁以上老人 5 元/餐（政府补贴 8 元，平台补贴 5 元），每天提供 2 餐。',
      background: '中国农村"空巢老人"超过 1,800 万，40% 存在"吃饭难"问题。',
      goals: ['在 200 个社区设立助餐点', '为 12,000 名老人提供每日 2 餐', '政府 / 平台 / 个人三方分摊费用', '到 2028 年覆盖 500 社区'],
      timeline: [
        { t: '2025-06-20', d: '"暖心食堂"3.0 启动，新增 50 个社区' },
        { t: '2025-12-01', d: '助餐点达 200 个，覆盖 12,000 名老人' },
        { t: '2026-03-01', d: '获得国务院乡村振兴局表彰' },
      ],
      funds: [
        { type: '餐食成本', pct: 70, val: '602,000 份', desc: '200 个社区每日 2 餐，每餐 5 元' },
        { type: '站点运营', pct: 18, val: '154,800 人次', desc: '厨师 + 配送人员' },
        { type: '其他', pct: 12, val: '103,200 件', desc: '厨具设备 + 站点维护' },
      ],
      thanks: [
        { type: 'voice', avatar: '张', name: '张奶奶', meta: '湖南 · 怀化', body: '暖心食堂让我每天都能和老姐妹一起吃饭，5 块钱又便宜又热乎。', priv: '已获本人授权' },
      ],
    },

    'p-el-002': {
      cat: 'elderly', icon: '🤝', name: '"银发陪伴"独居老人关爱',
      org: '中国社会工作联合会', region: '6 省 · 20 城',
      statDonate: '3,200 套', statPeople: '2,000', statSpeed: '持续中',
      goal: 4000, raised: 3200, urgent: false, latest: '2025-04-10',
      story: '为 2,000 名独居老人对接志愿者，每周上门探访 1 次 + 紧急呼叫设备。',
      background: '城市独居老人超过 1,200 万，突发疾病无法及时呼救是最大风险。',
      goals: ['为 2,000 名独居老人对接志愿者', '每周上门探访 1 次', '配备紧急呼叫设备', '到 2027 年覆盖 5,000 名'],
      timeline: [
        { t: '2025-04-10', d: '"银发陪伴"项目启动，首批 500 名' },
        { t: '2025-12-01', d: '覆盖 1,500 名' },
        { t: '2026-06-01', d: '覆盖 2,000 名' },
      ],
      funds: [
        { type: '志愿者运营', pct: 45, val: '1,440 人次', desc: '志愿者招募 + 定期培训' },
        { type: '呼叫设备', pct: 30, val: '960 套', desc: '2,000 名老人智能呼叫设备' },
        { type: '管理', pct: 25, val: '800 次', desc: '项目管理 + 上门探访安排' },
      ],
      thanks: [
        { type: 'voice', avatar: '刘', name: '刘大爷', meta: '北京 · 朝阳', body: '志愿者小张每周三都来，帮我修电灯、陪我说话，比我亲儿子还亲。', priv: '已获本人授权' },
      ],
    },

    /* ===== 乡村建设（3） ===== */
    'p-ru-001': {
      cat: 'rural', icon: '☀️', name: '"光伏学校"山区学校清洁能源',
      org: '比亚迪 × 中国教育发展基金会', region: '云南 · 怒江',
      statDonate: '28 套', statPeople: '1,200', statSpeed: '持续中',
      goal: 40, raised: 28, urgent: false, latest: '2026-02-10',
      story: '为 20 所山区学校安装光伏发电 + 储能设备，解决冬季供电 + 教学用电。',
      background: '中国云南怒江山区海拔 2,000+ 米，冬季供电不稳定，影响学校教学。',
      goals: ['为 20 所学校安装光伏 + 储能', '覆盖 1,200 名学生', '到 2027 年覆盖 50 校', '联合比亚迪等新能源企业'],
      timeline: [
        { t: '2026-02-10', d: '比亚迪捐赠 200 万设备 + 慈商联营配套 120 万' },
        { t: '2026-04-01', d: '首批 10 校设备安装完成' },
        { t: '2026-06-01', d: '20 校全部通电，覆盖 1,200 名学生' },
      ],
      funds: [
        { type: '设备采购', pct: 70, val: '28 套', desc: '光伏发电设备 + 储能电池组' },
        { type: '安装', pct: 20, val: '8 套', desc: '施工安装 + 调试' },
        { type: '运维', pct: 10, val: '2 套/年', desc: '10 年运维基金覆盖' },
      ],
      thanks: [
        { type: 'voice', avatar: '杨', name: '杨老师', meta: '云南 · 怒江山村小学', body: '光伏发电让学校冬天也能正常上课，孩子们在有电的教室里做功课、吃热饭。', priv: '已获学校授权' },
      ],
    },

    'p-ru-002': {
      cat: 'rural', icon: '🚚', name: '"顺丰村" 公益物流进村',
      org: '顺丰公益物流 × 国家邮政局', region: '全国 · 1,000 村',
      statDonate: '1,860 批', statPeople: '28,600', statSpeed: '持续中',
      goal: 2400, raised: 1860, urgent: false, latest: '2024-04-01',
      story: '为 1,000 个偏远村寨开通公益物流通道，农产品出村 + 公益物资进村，物流成本降低 70%。',
      background: '中国偏远村寨物流成本是城市 3 倍，是制约乡村振兴的瓶颈。',
      goals: ['为 1,000 个村寨开通公益物流', '物流成本降低 70%', '农产品出村增收 20%', '到 2027 年覆盖 3,000 村'],
      timeline: [
        { t: '2024-04-01', d: '"顺丰村"项目启动，首批 100 村' },
        { t: '2025-06-01', d: '覆盖 500 村' },
        { t: '2026-06-01', d: '覆盖 1,000 村，农产品出村增收 18%' },
      ],
      funds: [
        { type: '物流补贴', pct: 75, val: '1,395 批', desc: '顺丰公益物流补贴，覆盖 1,000 村' },
        { type: '站点建设', pct: 18, val: '1,000 个', desc: '1,000 个村级物流站点建设' },
        { type: '管理', pct: 7, val: '465 次', desc: '运营培训 + 站点维护' },
      ],
      thanks: [
        { type: 'voice', avatar: '丁', name: '丁社长', meta: '西藏 · 公益合作社', body: '顺丰把我们的物资从成都直接送到那曲，3 天变成 18 小时，山里孩子当周就收到新校服。', priv: '已通过平台脱敏审核' },
      ],
    },

    'p-ru-003': {
      cat: 'rural', icon: '💧', name: '"饮水思源" 山区直饮水设备',
      org: '娃哈哈 × 中国农村水利协会', region: '6 省 · 30 校',
      statDonate: '38 套', statPeople: '3,500', statSpeed: '持续中',
      goal: 50, raised: 38, urgent: false, latest: '2026-01-15',
      story: '为 30 所山区学校安装直饮水设备，解决师生饮水安全问题。',
      background: '中国山区学校 25% 仍使用井水或河水，饮水安全不达标。',
      goals: ['为 30 所学校安装直饮水设备', '覆盖 3,500 名师生', '到 2028 年覆盖 100 校', '联合娃哈哈等饮料企业'],
      timeline: [
        { t: '2026-01-15', d: '娃哈哈捐赠 100 万设备 + 慈商联营配套 80 万' },
        { t: '2026-04-01', d: '首批 15 校设备安装完成' },
        { t: '2026-06-01', d: '30 校全部通水，覆盖 3,500 名师生' },
      ],
      funds: [
        { type: '设备采购', pct: 65, val: '38 套', desc: '直饮水设备 + 水质过滤系统' },
        { type: '安装', pct: 20, val: '12 套', desc: '施工安装 + 水质检测' },
        { type: '运维', pct: 15, val: '4 套/年', desc: '滤芯更换每学期 1 次' },
      ],
      thanks: [
        { type: 'voice', avatar: '张', name: '张校长', meta: '云南 · 文山', body: '孩子们第一次喝上直饮水，知道"水也可以没味道"，特别开心。', priv: '已获学校授权' },
      ],
    },

    /* ===== 医疗健康（2） ===== */
    'p-he-001': {
      cat: 'health', icon: '🎗️', name: '"两癌筛查" 母亲健康',
      org: '中国癌症基金会', region: '云南 · 4 县',
      statDonate: '6,800 人次', statPeople: '5,000', statSpeed: '持续中',
      goal: 8000, raised: 6800, urgent: false, latest: '2025-03-20',
      story: '为云南 4 县 5,000 名农村妇女提供免费两癌（乳腺癌/宫颈癌）筛查。',
      background: '中国农村妇女两癌筛查率不足 40%，晚期发现率比城市高 2 倍。',
      goals: ['为 5,000 名农村妇女提供免费两癌筛查', '覆盖云南 4 县', '早发现率提升 50%', '到 2027 年覆盖 10 县'],
      timeline: [
        { t: '2025-03-20', d: '"两癌筛查"项目启动，首批 1,000 名' },
        { t: '2025-12-01', d: '覆盖 3,000 名，确诊早期病例 28 例' },
        { t: '2026-06-01', d: '覆盖 5,000 名，早发现率 78%' },
      ],
      funds: [
        { type: '筛查设备', pct: 45, val: '3,060 人次', desc: '乳腺彩超 + HPV 检测' },
        { type: '医师培训', pct: 25, val: '1,700 人次', desc: '县级医院医师培训' },
        { type: '运营', pct: 20, val: '1,360 次', desc: '4 县现场筛查组织' },
        { type: '其他', pct: 10, val: '680 次', desc: '项目管理' },
      ],
      thanks: [
        { type: 'voice', avatar: '李', name: '李医生', meta: '云南 · 文山县医院', body: '两癌筛查让 28 位农村妇女早发现早治疗，挽救了 28 个家庭。', priv: '已通过平台脱敏审核' },
      ],
    },

    'p-he-002': {
      cat: 'health', icon: '🧴', name: '"校园洗手" 健康教育',
      org: '立白集团 × 中国疾控中心', region: '6 省 · 240 校',
      statDonate: '280 套', statPeople: '24,200', statSpeed: '持续中',
      goal: 360, raised: 280, urgent: false, latest: '2026-03-01',
      story: '为 240 所学校安装洗手池、捐赠洗手液 + 健康教育课程，肠胃病发病率下降 60%。',
      background: '中国乡村学校洗手设施覆盖率不足 50%，是导致肠胃病高发的主因。',
      goals: ['为 240 所学校安装洗手设施', '覆盖 24,200 名学生', '肠胃病发病率下降 60%', '到 2028 年覆盖 500 校'],
      timeline: [
        { t: '2026-03-01', d: '立白捐赠 100 万设备 + 慈商联营配套 80 万' },
        { t: '2026-05-01', d: '首批 100 校洗手设施建成' },
        { t: '2026-06-01', d: '240 校全部建成，肠胃病发病率下降 60%' },
      ],
      funds: [
        { type: '设施建设', pct: 60, val: '240 套', desc: '洗手池 + 洗手液 + 配套设施' },
        { type: '健康教育', pct: 25, val: '168 套', desc: '课程包 + 卫生教育培训' },
        { type: '运维', pct: 15, val: '72 套/年', desc: '每学期补充洗手液 + 设施维护' },
      ],
      thanks: [
        { type: 'voice', avatar: '赵', name: '赵校长', meta: '湖南 · 怀化山区小学', body: '立白给学校装了洗手池、捐赠了洗手液，孩子们养成了饭前洗手的习惯，肠胃病减少了 60%。', priv: '已通过平台脱敏审核' },
      ],
    },
  };

  /* ===== 3. 工具函数 ===== */
  function $(id) { return document.getElementById(id); }
  function param(name) {
    const m = location.search.match(new RegExp('[?&]' + name + '=([^&]*)'));
    return m ? decodeURIComponent(m[1]) : null;
  }
  function pctColor(pct) { return pct >= 100 ? 'var(--c1)' : 'var(--color-primary)'; }

  /* ===== 4. 注入类目色 CSS 变量 ===== */
  function injectCatColors(cat) {
    const c = CATS[cat];
    if (!c) return;
    const root = document.documentElement;
    root.style.setProperty('--c1', c.c1);
    root.style.setProperty('--c1-dark', c.c1Dark);
    root.style.setProperty('--c1-soft', c.soft);
    root.style.setProperty('--hero-bg', c.bg);
  }

  /* ===== 5. 渲染 hero ===== */
  function renderHero(p, cat) {
    document.title = p.name + ' · 慈商联营';
    const pct = Math.min(100, Math.round((p.raised / p.goal) * 100));
    $('crumbName').textContent = p.name;

    // hero 内容
    $('pjCatBadge').textContent = cat.name;
    $('pjIcon').textContent = p.icon;
    $('pjName').textContent = p.name;
    $('pjOrg').textContent = '🏛️ ' + p.org;
    $('pjRegion').textContent = p.region;
    $('pjStatDonate').textContent = p.statDonate;
    $('pjStatPeople').textContent = p.statPeople;
    $('pjStatSpeed').textContent = p.statSpeed;

    // 进度条
    $('pjProgressPct').textContent = pct + '%';
    $('pjProgressText').textContent = p.raised.toLocaleString() + ' 件 / ' + p.goal.toLocaleString() + ' 件';
    $('pjProgressFill').style.width = pct + '%';

    // 紧急标签
    if (p.urgent) {
      $('pjUrgent').style.display = 'inline-flex';
    } else if (p.urgent === false) {
      $('pjUrgent').style.display = 'none';
    }
  }

  /* ===== 6. 渲染 story / 目标 / 时间线 ===== */
  function renderStory(p) {
    $('pjStory').textContent = p.story;
    $('pjBackground').textContent = p.background;
    $('pjGoals').innerHTML = p.goals.map(g => `<li>${g}</li>`).join('');

    $('pjTimeline').innerHTML = p.timeline.map(ev => `
      <div class="ev">
        <div class="t">${ev.t}</div>
        <div class="d">${ev.d}</div>
      </div>
    `).join('');
  }

  /* ===== 7. 渲染物资明细 ===== */
  function renderFunds(p) {
    const total = p.funds.reduce((s, f) => s + f.pct, 0);
    $('pjFundBar').innerHTML = p.funds.map(f => `
      <div class="fund-seg" style="width:${(f.pct / total * 100)}%;background:${f.pct > 20 ? 'var(--c1)' : 'var(--c1-dark)'};">
        <span class="seg-label">${f.type} ${f.pct}%</span>
      </div>
    `).join('');
    $('pjFundList').innerHTML = p.funds.map(f => `
      <div class="fund-row">
        <div class="dot" style="background:${f.pct > 20 ? 'var(--c1)' : 'var(--c1-dark)'};"></div>
        <div class="info">
          <div class="name">${f.type}</div>
          <div class="desc">${f.desc}</div>
        </div>
        <div class="val">${f.val} <span class="pct">${f.pct}%</span></div>
      </div>
    `).join('');
  }

  /* ===== 8. 渲染受捐者反馈 ===== */
  function renderThanks(p) {
    $('pjThanksCount').textContent = p.thanks.length;
    $('pjThanks').innerHTML = p.thanks.map(t => {
      const typeClass = t.type === 'handwritten' ? 'handwritten' : 'voice';
      const bodyClass = t.type === 'handwritten' ? 'body handwriting' : 'body';
      return `
        <div class="thanks-card ${typeClass}">
          <div class="author">
            <div class="avatar">${t.avatar}</div>
            <div>
              <div class="name">${t.name}</div>
              <div class="meta">${t.meta}</div>
            </div>
          </div>
          <div class="${bodyClass}">${t.body}</div>
          <div class="privacy">🛡️ ${t.priv}</div>
        </div>
      `;
    }).join('');
  }

  /* ===== 9. 渲染 CTA / 节点表 / 相关项目 ===== */
  function renderCTA(p) {
    // 4 节点
    $('pjNodes').innerHTML = [
      { ic: '🏛️', t: '发起方', d: '联合发起' },
      { ic: '📦', t: '采购', d: '物资采购' },
      { ic: '🚚', t: '承运', d: '顺丰 24h' },
      { ic: '✅', t: '受捐', d: '100% 到位' },
    ].map(n => `
      <div class="node">
        <div class="ic">${n.ic}</div>
        <div class="t">${n.t}</div>
        <div class="d">${n.d}</div>
      </div>
    `).join('');

    // 相关项目：同类目 2 个
    const related = Object.entries(PROJECTS)
      .filter(([id, x]) => x.cat === p.cat && id !== p.id)
      .slice(0, 2);
    $('pjRelated').innerHTML = related.map(([id, x]) => `
      <a class="related-card" href="project-detail.html?id=${id}">
        <div class="ic">${x.icon}</div>
        <div class="name">${x.name}</div>
        <div class="meta">${x.region} · ${x.statDonate}</div>
      </a>
    `).join('');
  }

  /* ===== 10. 切换 tab ===== */
  function bindTabs() {
    document.querySelectorAll('[data-section]').forEach(tab => {
      tab.addEventListener('click', () => {
        const target = tab.dataset.section;
        document.querySelectorAll('[data-section]').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const el = document.getElementById('section-' + target);
        if (el) {
          const top = el.getBoundingClientRect().top + window.scrollY - 130;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      });
    });
  }

  /* ===== 11. 主入口 ===== */
  function init() {
    const id = param('id') || 'p-em-001';
    const p = PROJECTS[id];
    if (!p) {
      document.getElementById('pjGrid').innerHTML = `
        <div class="empty" style="grid-column:1/-1;text-align:center;padding:80px;">
          <div class="ic" style="font-size:48px;">🔍</div>
          <div class="t">未找到该项目 <code>${id}</code></div>
        </div>
      `;
      return;
    }
    const cat = CATS[p.cat] || CATS.urgent;
    injectCatColors(p.cat);
    renderHero(p, cat);
    renderStory(p);
    renderFunds(p);
    renderThanks(p);
    renderCTA(p);
    bindTabs();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
