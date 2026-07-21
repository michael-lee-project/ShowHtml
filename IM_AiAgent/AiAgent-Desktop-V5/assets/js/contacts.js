/* ============================================================
 * contacts.js · 通讯录页 · 好友背景画像 + 微信聊天导入
 * ============================================================ */
(function () {
  'use strict';

  /* ---------- 1. 画像字段配置（chip / radio 选项） ---------- */
  const PERSONA_TRAITS = [
    '务实', '重效率', '完美主义', '创意思维', '数据控', '感性',
    '爱社交', '内向', '果断', '犹豫', '乐观', '谨慎', '话多', '惜字如金'
  ];
  const PERSONA_MOOD = ['温和', '急躁', '冷淡', '热情', '理性', '挑剔', '纠结'];
  const PERSONA_COMMUNICATION = [
    '数据导向', '关系导向', '视觉导向', '逻辑导向', '故事导向'
  ];
  const PERSONA_FAMILY = {
    ageRange: ['18-25', '26-30', '31-40', '41-50', '50+'],
    marital: ['未婚', '已婚', '离异', '保密'],
    children: ['无', '1个', '2个', '3个+', '保密'],
    gender: ['男', '女']
  };

  // 根据年龄段 + 婚姻 + 子女 + 性别推断家庭角色
  // 家庭角色不暴露给用户选择，AI 销冠引用 persona 时自动写出
  function inferFamilyRole(family) {
    if (!family) return '';
    const { marital, children, gender } = family;
    if (!marital && !children) return '';  // 用户没填，无角色

    // 子女≥1 → 爸爸/妈妈（按性别）
    if (children && children !== '无' && children !== '保密') {
      if (gender === '男') return '爸爸';
      if (gender === '女') return '妈妈';
      return '爸爸/妈妈';
    }
    // 离异 + 有子女（children='保密' 也算）→ 爸爸/妈妈
    if (marital === '离异' && (children === '保密' || (children && children !== '无'))) {
      if (gender === '男') return '爸爸';
      if (gender === '女') return '妈妈';
      return '爸爸/妈妈';
    }
    // 已婚 + 无子女 → 配偶
    if (marital === '已婚' && (children === '无' || !children)) return '配偶';
    // 未婚 → 单身
    if (marital === '未婚') return '单身';
    // 离异 + 无子女 → 单身
    if (marital === '离异') return '单身';
    // 保密 → 保密
    if (marital === '保密') return '保密';
    return '';
  }
  const PERSONA_FINANCE = {
    level: [
      { v: '高净值',   t: '年收入 100w+ / 资产 1000w+' },
      { v: '中产',     t: '年收入 30-100w' },
      { v: '大众',     t: '年收入 30w 以下' }
    ],
    jobs: [
      '企业高管', '医生', '律师', '教师', '公务员', '工程师',
      '设计师', '媒体人', '创业者', '自由职业', '投资人', '退休'
    ],
    interests: [
      '理财', '房产', '股票', '收藏', '旅游', '健身', '育儿',
      '美食', '奢侈品', '科技', '教育', '医疗', '美容'
    ]
  };

  // 行业 · 12 主流分类（销售话术按行业匹配产品）
  const PERSONA_INDUSTRY = [
    '金融', '科技', '医疗', '教育', '制造', '零售',
    '餐饮', '房地产', '汽车', '媒体', '能源', '其他'
  ];

  // 决策身份 · 4 角色（影响销售触达策略）
  const PERSONA_DECISION_ROLE = [
    '决策者',      // 拍板人
    '影响者',      // 影响拍板的人
    '使用者',      // 最终使用但无决策权
    '家人替代'     // 配偶/父母/孩子代为决策
  ];

  // 痛点 · 8 销售突破口（多选）
  const PERSONA_PAIN_POINTS = [
    '价格敏感', '时间紧迫', '信任缺失', '售后担忧',
    '风险厌恶', '追求品牌', '实用性优先', '追求性价比'
  ];

  // ============================================================
  // persona 模板 · 4 销售场景 · 一键套用
  // ============================================================
  const PERSONA_TEMPLATES = [
    {
      id: 'enterprise-sales',
      name: '企业销售场景',
      desc: '老板型客户 · 31-40 · 中产 · 决策者 · 价格敏感',
      payload: {
        personality: { traits: ['务实', '重效率', '果断'], mood: '理性', communication: '数据导向' },
        family: { ageRange: '31-40', marital: '已婚', children: '1个', gender: '男', note: '' },
        finance: { level: '中产', jobs: ['企业高管'], interests: ['理财', '科技'], note: '' },
        industry: '科技',
        decisionRole: '决策者',
        painPoints: ['价格敏感', '时间紧迫']
      }
    },
    {
      id: 'middle-class-mom',
      name: '中产宝妈',
      desc: '31-40 女 · 1个子女 · 关注理财/育儿 · 追求性价比',
      payload: {
        personality: { traits: ['务实', '感性'], mood: '温和', communication: '关系导向' },
        family: { ageRange: '31-40', marital: '已婚', children: '1个', gender: '女', note: '' },
        finance: { level: '中产', jobs: [], interests: ['理财', '育儿', '教育'], note: '' },
        industry: '其他',
        decisionRole: '家人替代',
        painPoints: ['追求性价比', '风险厌恶']
      }
    },
    {
      id: 'high-net-worth',
      name: '高净值理财',
      desc: '50+ 男 · 已婚 · 2个子女 · 高净值 · 关注理财/房产',
      payload: {
        personality: { traits: ['务实', '风险厌恶', '谨慎'], mood: '温和', communication: '逻辑导向' },
        family: { ageRange: '50+', marital: '已婚', children: '2个', gender: '男', note: '' },
        finance: { level: '高净值', jobs: ['企业高管', '投资人'], interests: ['理财', '房产', '收藏'], note: '' },
        industry: '金融',
        decisionRole: '决策者',
        painPoints: ['追求品牌', '风险厌恶']
      }
    },
    {
      id: 'student-early',
      name: '学生 / 早期',
      desc: '18-25 女 · 未婚 · 大众 · 关注科技/教育',
      payload: {
        personality: { traits: ['乐观', '感性', '爱社交'], mood: '热情', communication: '视觉导向' },
        family: { ageRange: '18-25', marital: '未婚', children: '无', gender: '女', note: '' },
        finance: { level: '大众', jobs: [], interests: ['科技', '教育', '美食'], note: '' },
        industry: '教育',
        decisionRole: '使用者',
        painPoints: ['价格敏感', '追求性价比']
      }
    }
  ];

  // 套用模板：把模板 payload 合并到 persona（只覆盖模板里有的字段）
  function applyPersonaTemplate(persona, template) {
    const p = template.payload;
    if (p.personality) {
      persona.personality = {
        traits: [...(p.personality.traits || [])],
        mood: p.personality.mood || persona.personality.mood || '',
        communication: p.personality.communication || persona.personality.communication || ''
      };
    }
    if (p.family) {
      persona.family = {
        ageRange: p.family.ageRange || '',
        marital: p.family.marital || '',
        children: p.family.children || '',
        gender: p.family.gender || '',
        note: persona.family.note || p.family.note || ''
      };
    }
    if (p.finance) {
      persona.finance = {
        level: p.finance.level || '',
        jobs: [...(p.finance.jobs || [])],
        interests: [...(p.finance.interests || [])],
        note: persona.finance.note || p.finance.note || ''
      };
    }
    persona.industry = p.industry || '';
    persona.decisionRole = p.decisionRole || '';
    persona.painPoints = [...(p.painPoints || [])];
    // 家庭角色由系统推断（family 已设置，自动重算）
    // 不重写 chats / salesNotes / base
  }

  // ============================================================
  // AI 智能画像 · 关键词库 + 提取算法
  // 200+ 关键词按 8 类别组织，扫描聊天文本自动填 persona
  // ============================================================
  const KEYWORD_LIBRARY = {
    industry: {
      '金融': ['金融', '银行', '证券', '基金', '股票', '资本', 'VC', 'PE', '贷款', '保险', '信托', '期货', '融资', '上市', 'IPO', '资产配置', '投资'],
      '科技': ['科技', '互联网', 'AI', '人工智能', '程序', '代码', '开发', 'IT', '云', 'SaaS', '算法', '数据', '软件', '芯片', '半导体', '研发'],
      '医疗': ['医疗', '医院', '医生', '护士', '药', '诊所', '健康', '生物', '基因', '制药', '医疗设备'],
      '教育': ['教育', '学校', '老师', '学生', '培训', '课程', '留学', '考研', '考公', '大学', '中学', '小学', '在线教育', 'K12'],
      '制造': ['制造', '工厂', '生产', '供应链', '工业', '零部件', '装配', '代工', 'OEM', 'ODM', '产线'],
      '零售': ['零售', '商店', '超市', '便利', '电商', '店铺', '连锁', '商超', '天猫', '京东', '淘宝'],
      '餐饮': ['餐饮', '餐厅', '饭店', '奶茶', '咖啡', '外卖', '开店', '厨师', '川菜', '火锅', '日料', '西餐', '饮品'],
      '房地产': ['房地产', '楼盘', '置业', '中介', '买房', '卖房', '二手房', '地产', '物业', '物业费'],
      '汽车': ['汽车', '新能源车', '电动车', '4S', '经销商', '智驾', '自动驾驶', '电池', '充电桩'],
      '媒体': ['媒体', '广告', '公关', '传播', '内容', '抖音', '小红书', '公众号', '短视频', '直播', '网红', 'MCN', '主播'],
      '能源': ['能源', '电力', '光伏', '新能源', '电池', '储能', '风电', '石化', '油气', '煤炭', '充电'],
      '其他': []
    },
    jobs: {
      '律师': ['律师', '法务', '法律', '辩护', '诉讼'],
      '医生': ['医师', '大夫', '问诊', '处方', '手术'],
      '教师': ['教师', '教书', '人民教师', '讲师', '教授', '助教'],
      '公务员': ['公务员', '公务', '体制内', '事业单位', '机关', '公务猿', '公职'],
      '工程师': ['工程师', '程序员', '码农', '架构师', 'CTO', '前端', '后端', '测试', '运维', '全栈'],
      '设计师': ['设计师', '设计', '创意', '视觉', 'UI', 'UX', '平面', '插画', '动效'],
      '媒体人': ['记者', '编辑', '撰稿人', '自媒体', '内容运营'],
      '创业者': ['创业', '创始人', '合伙人', '联合创始人', '初创', '独立创业'],
      '自由职业': ['自由职业', 'SOHO', 'freelance', '独立接单'],
      '投资人': ['VC', 'PE', 'LP', 'FA', '天使投资人', '投资经理'],
      '退休': ['退休', '离休', '退休在家'],
      '企业高管': ['总经理', 'CEO', '总裁', '副总', '总监', 'VP', 'CFO', 'COO', 'CXO', '高管', 'CEO', 'C*O', '总']
    },
    painPoints: {
      '价格敏感': ['价格', '太贵', '便宜', '折扣', '优惠', '便宜点', '减价', '价格不划算', '性价比', '划算', '不划算', '搞价', '最低', '砍价'],
      '时间紧迫': ['忙', '没时间', '时间紧', '立刻', '马上', '尽快', '急', '赶时间', '近期', '本月', '本周', '这周', '越快'],
      '信任缺失': ['不放心', '怕被骗', '靠谱', '正规', '真的假的', '保证', '是真的', '可靠', '信得过', '真假', '骗子', '忽悠'],
      '售后担忧': ['售后', '保修', '退换', '维修', '退货', '坏了', '出问题', '投诉', '客服', '保质'],
      '风险厌恶': ['风险', '亏损', '损失', '亏', '赌', '保本', '兜底', '担保', '安全', '保底'],
      '追求品牌': ['品牌', '大牌子', '名牌', '高端', '奢侈品', 'logo', '档次', '上档次', '一线'],
      '实用性优先': ['实用', '耐用', '够用', '能不能用', '管用', '实在', '真实'],
      '追求性价比': ['性价比', '划算', '值不值', '值得', '不亏', '实惠', '经济']
    },
    finance_level: {
      '高净值': ['融资', '上市', 'IPO', '海外', '千万', '亿', '豪宅', '别墅', '私人飞机', '游艇', '财富自由', '资产过亿', '高净值'],
      '中产': ['中产', '房贷', '车贷', '稳定', '工薪', '年薪', '30万', '50万', '100万', '百万', '年收入'],
      '大众': ['学生', '工薪', '收入', '普通', '打工', '月薪', '1万', '2万', '3万', '5万', '工薪阶层']
    },
    personality_traits: {
      '务实': ['务实', '实际', '落地', '靠谱', '不浮夸', '看疗效', '效果说话'],
      '重效率': ['效率', '快', '赶紧', '抓紧', '省时间', '别磨叽', '快快快', '高效', '不拖'],
      '数据控': ['数据', '分析', '报表', '指标', 'KPI', 'ROI', '复盘', '用户数据', '增长', '漏斗'],
      '完美主义': ['完美', '极致', '细节', '不能差', '更好', '优化', '反复改', '改到位'],
      '感性': ['感觉', '直觉', '我看着', '就是喜欢', '情感', '感性', '有感觉'],
      '爱社交': ['社交', '圈子', '饭局', '聚会', '认识人', '人脉', '混圈子'],
      '果断': ['果断', '直接', '马上定', '快定', '不纠结', '拍板'],
      '犹豫': ['纠结', '考虑考虑', '再想想', '比较', '比一比', '担心', '还没想好', '再考虑一下'],
      '乐观': ['积极', '乐观', '好的', '没问题', 'OK', '没问题', '好搞'],
      '谨慎': ['谨慎', '仔细', '小心', '再看看', '考察', '稳一点', '稳着点']
    },
    family_marital: {
      '已婚': ['老公', '老婆', '丈夫', '妻子', '太太', '先生', '结婚', '婚姻', '已婚', '我老公', '我老婆', '我家那位', '队友', '我先生', '孩儿他爸', '孩儿他妈', '媳妇', '老公我'],
      '未婚': ['单身', '没对象', '没结婚', '未婚', '一个人', '一个人过', '独居', '母胎 solo', '母胎'],
      '离异': ['离婚', '离异', '前夫', '前妻', '分手', '离过婚', '单亲'],
      '保密': []
    },
    family_children: {
      '1个': ['一胎', '1个娃', '一个小孩', '一个孩子', '我家宝宝', '老大', '我家娃', '一个宝贝', '孩子1岁', '一宝'],
      '2个': ['二胎', '二宝', '两个孩子', '两个娃', '大宝二宝', '老大老二', '二宝'],
      '3个+': ['三胎', '三宝', '三个娃', '三个孩子', '三宝'],
      '无': ['没孩子', '丁克', '不想要孩子', '无子女', '不生', '没生']
    },
    family_gender: {
      '男': ['我老公', '我先生', '我丈夫', '我男友', '我男朋友', '我爸爸', '我爸', '我儿子', '我是男的', '男', '兄弟', '男生', '宝爸', '老公我', '丈夫'],
      '女': ['我老婆', '我太太', '我妻子', '我女友', '我女朋友', '我妈妈', '我妈', '我女儿', '我是女的', '女', '姐妹', '女生', '宝妈', '辣妈', '妻子']
    }
  };

  // 关键词 → persona 字段路径
  const KEYWORD_TO_FIELD = {
    industry: 'industry',
    jobs: 'finance.jobs',
    painPoints: 'painPoints',
    finance_level: 'finance.level',
    personality_traits: 'personality.traits',
    family_marital: 'family.marital',
    family_children: 'family.children',
    family_gender: 'family.gender'
  };

  // 提取：把所有 chats text 合并 → 跑关键词命中 → 累计最高分
  function extractPersonaFromChats(chats) {
    const allText = (chats || []).map(c => (c.text || '')).join(' \u0001 ');
    if (!allText.trim() || allText.trim().length < 3) return {};
    const updates = {};

    function escapeReg(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }

    function pickBestSingle(valueMap) {
      const scores = {};
      Object.keys(valueMap).forEach(v => { scores[v] = 0; });
      Object.keys(valueMap).forEach(value => {
        const kws = valueMap[value] || [];
        kws.forEach(kw => {
          if (!kw) return;
          const re = new RegExp(escapeReg(kw), 'g');
          const m = allText.match(re);
          if (m) scores[value] += m.length;
        });
      });
      let best = null, bestScore = 0;
      Object.keys(scores).forEach(v => {
        if (scores[v] > bestScore) { best = v; bestScore = scores[v]; }
      });
      return bestScore > 0 ? best : null;
    }

    function pickAllHits(valueMap) {
      const hits = new Set();
      Object.keys(valueMap).forEach(value => {
        const kws = valueMap[value] || [];
        kws.forEach(kw => {
          if (!kw) return;
          const re = new RegExp(escapeReg(kw), 'g');
          if (re.test(allText)) hits.add(value);
        });
      });
      return Array.from(hits);
    }

    // 单值字段
    ['industry', 'finance_level', 'family_marital', 'family_gender'].forEach(key => {
      if (!KEYWORD_LIBRARY[key]) return;
      const v = pickBestSingle(KEYWORD_LIBRARY[key]);
      if (v) updates[KEYWORD_TO_FIELD[key]] = v;
    });
    // children（先看是否有「1个/2个/无」命中，没命中就保持不变）
    if (KEYWORD_LIBRARY.family_children) {
      const v = pickBestSingle(KEYWORD_LIBRARY.family_children);
      if (v) updates[KEYWORD_TO_FIELD.family_children] = v;
    }

    // 多值字段
    ['jobs', 'painPoints', 'personality_traits'].forEach(key => {
      if (!KEYWORD_LIBRARY[key]) return;
      const arr = pickAllHits(KEYWORD_LIBRARY[key]);
      if (arr.length) updates[KEYWORD_TO_FIELD[key]] = arr;
    });

    return updates;
  }

  // 把 updates 合并到 persona（数组字段去重）
  function applyPersonaUpdates(persona, updates) {
    let n = 0;
    Object.keys(updates).forEach(key => {
      const val = updates[key];
      const cur = getNested(persona, key);
      if (Array.isArray(val)) {
        const arr = Array.isArray(cur) ? cur : [];
        const merged = [...new Set([...arr, ...val])];
        setNested(persona, key, merged);
      } else {
        setNested(persona, key, val);
      }
      n++;
    });
    return n;
  }

  function el(tag, cls, html) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html !== undefined) e.innerHTML = html;
    return e;
  }
  function escapeHtml(s) {
    return (s || '').replace(/[&<>"']/g, (c) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));
  }
  function storageKey(friendId) { return 'umakex_persona_' + friendId; }
  function loadPersona(friendId) {
    try {
      const raw = localStorage.getItem(storageKey(friendId));
      return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
  }
  function savePersona(friendId, persona) {
    try {
      localStorage.setItem(storageKey(friendId), JSON.stringify(persona));
      return true;
    } catch (e) { return false; }
  }
  function emptyPersona(friend) {
    return {
      friendId: friend.id,
      friendName: friend.name,
      base: { source: 'manual', importDate: '', fileName: '' },
      personality: { traits: [], mood: '', communication: '' },
      family: { ageRange: '', marital: '', children: '', gender: '', note: '' },  // 家庭角色完全由 婚姻+子女+性别 推断，不再存储
      finance: { level: '', jobs: [], interests: [], note: '' },
      industry: '',         // 行业（单选）— 销售话术按行业匹配
      decisionRole: '',     // 决策身份（单选）— 影响触达策略
      painPoints: [],       // 痛点（多选）— 销售突破口
      salesNotes: '',
      chats: []
    };
  }

  /* ---------- 2. 好友项点击 → 选中态 + 渲染详情 ---------- */
  const detailEl = document.getElementById('contactsDetail');
  const emptyEl  = document.getElementById('contactsEmpty');

  function extractAvatarStyle(item) {
    const avatar = item.querySelector('.avatar');
    return avatar ? avatar.getAttribute('style') || '' : '';
  }
  function extractAvatarInitial(item) {
    const avatar = item.querySelector('.avatar');
    if (!avatar) return '';
    const svg = avatar.querySelector('svg');
    return svg ? '' : (avatar.textContent.trim()[0] || '');
  }
  function getFriendFromItem(item) {
    const name = (item.querySelector('.contact-item__name') || {}).textContent || '未命名';
    const id   = (item.querySelector('.contact-item__id')   || {}).textContent || ('id_' + Date.now());
    return {
      name: name.trim(),
      id:   id.trim(),
      avatarStyle: extractAvatarStyle(item),
      avatarInitial: extractAvatarInitial(item)
    };
  }

  let currentFriend = null;

  function selectFriend(item) {
    document.querySelectorAll('.contact-item.is-selected').forEach((n) => n.classList.remove('is-selected'));
    item.classList.add('is-selected');
    const friend = getFriendFromItem(item);
    currentFriend = friend;
    detailEl.setAttribute('data-friend-id', friend.id);
    renderDetail(friend);
    emptyEl.style.display = 'none';
    detailEl.setAttribute('data-state', 'active');
  }

  /* ---------- 3. 渲染详情面板 ---------- */
  function renderDetail(friend) {
    const persona = loadPersona(friend.id) || emptyPersona(friend);
    detailEl.innerHTML = buildDetailHTML(friend, persona);
    bindDetailHandlers(friend, persona);
  }
  function buildDetailHTML(friend, p) {
    return (
      // 顶部
      '<header class="detail-head">' +
        '<button class="detail-head__back" id="detailBack" type="button" title="返回好友列表">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">' +
            '<path d="m15 18-6-6 6-6"/></svg>' +
        '</button>' +
        '<div class="detail-head__avatar" style="' + friend.avatarStyle + '">' +
          (friend.avatarInitial || '') +
        '</div>' +
        '<div class="detail-head__info">' +
          '<div class="detail-head__name">' + escapeHtml(friend.name) +
            (p && p.chats && p.chats.length ? '<span class="persona-summary-badge">已画像</span>' : '') +
          '</div>' +
          '<div class="detail-head__id">ID ' + escapeHtml(friend.id) + ' · 来自 UMakex 通讯录</div>' +
        '</div>' +
      '</header>' +
      // Tabs
      '<nav class="detail-tabs">' +
        '<button class="detail-tab is-active" data-tab="profile" type="button">资料</button>' +
        '<button class="detail-tab" data-tab="persona" type="button">' +
          '背景画像 ' +
          '<span class="detail-tab__count" id="personaFillCount">' + countPersonaFields(p) + '</span>' +
        '</button>' +
        '<button class="detail-tab" data-tab="history" type="button">' +
          '聊天历史 ' +
          '<span class="detail-tab__count" id="chatCount">' + (p.chats ? p.chats.length : 0) + '</span>' +
        '</button>' +
      '</nav>' +
      // 3 Pane
      '<div class="detail-pane is-active" data-pane="profile">' +
        buildProfilePane(friend, p) +
      '</div>' +
      '<div class="detail-pane" data-pane="persona">' +
        buildPersonaPane(friend, p) +
      '</div>' +
      '<div class="detail-pane" data-pane="history">' +
        buildHistoryPane(friend, p) +
      '</div>'
    );
  }
  function countPersonaFields(p) {
    let n = 0;
    if (p.personality.traits.length) n += p.personality.traits.length;
    if (p.personality.mood) n++;
    if (p.personality.communication) n++;
    if (p.family.ageRange) n++;
    if (p.family.marital) n++;
    if (p.family.children) n++;
    if (p.family.gender) n++;
    if (inferFamilyRole(p.family)) n++;   // 推断出的角色也算 1 项（系统自动算）
    if (p.family.note) n++;
    if (p.finance.level) n++;
    if (p.finance.jobs.length) n += p.finance.jobs.length;
    if (p.finance.interests.length) n += p.finance.interests.length;
    if (p.finance.note) n++;
    if (p.industry) n++;
    if (p.decisionRole) n++;
    if (p.painPoints.length) n += p.painPoints.length;
    if (p.salesNotes) n++;
    return n;
  }

  // 每个 section 自身的进度（已填 / 总项）— 直接从 DOM 读，避免依赖闭包中过期 persona
  function sectionProgressMapFromDOM(detailEl) {
    const activeIn = (key) => {
      const row = detailEl.querySelector('[data-persona-key="' + key + '"]');
      return row ? row.querySelectorAll('.chip.is-active').length : 0;
    };
    const noteIn = (key) => {
      const ta = detailEl.querySelector('textarea[data-persona-key="' + key + '"]');
      return ta ? (ta.value || '').trim().length > 0 : false;
    };
    // 家庭角色（推断）— 用当前 active 字段计算
    const fam = {
      ageRange: !!detailEl.querySelector('[data-persona-key="family.ageRange"] .chip.is-active'),
      marital: (detailEl.querySelector('[data-persona-key="family.marital"] .chip.is-active')?.textContent || '').trim(),
      children: (detailEl.querySelector('[data-persona-key="family.children"] .chip.is-active')?.textContent || '').trim(),
      gender: (detailEl.querySelector('[data-persona-key="family.gender"] .chip.is-active')?.textContent || '').trim(),
    };
    const hasRole = !!(fam.ageRange && fam.marital && fam.children && fam.gender);
    return {
      personality: { filled:
          (activeIn('personality.traits') > 0 ? 1 : 0) +
          (activeIn('personality.mood') > 0 ? 1 : 0) +
          (activeIn('personality.communication') > 0 ? 1 : 0), total: 3 },
      family: { filled:
          (activeIn('family.ageRange') > 0 ? 1 : 0) +
          (activeIn('family.marital') > 0 ? 1 : 0) +
          (activeIn('family.children') > 0 ? 1 : 0) +
          (activeIn('family.gender') > 0 ? 1 : 0) +
          (hasRole ? 1 : 0) +
          (noteIn('family.note') ? 1 : 0), total: 6 },
      finance: { filled:
          (activeIn('finance.level') > 0 ? 1 : 0) +
          (activeIn('finance.jobs') > 0 ? 1 : 0) +
          (activeIn('finance.interests') > 0 ? 1 : 0) +
          (noteIn('finance.note') ? 1 : 0), total: 4 },
      industry: { filled: activeIn('industry') > 0 ? 1 : 0, total: 1 },
      decision: { filled: activeIn('decisionRole') > 0 ? 1 : 0, total: 1 },
      pain: { filled: activeIn('painPoints') > 0 ? 1 : 0, total: 1 },
      salesnote: { filled: noteIn('salesNotes') ? 1 : 0, total: 1 },
    };
  }

  // 重新刷新每个 section 标题右侧的 "3/4" 进度
  function refreshSectionProgress(detailEl, p) {
    const map = sectionProgressMapFromDOM(detailEl);
    detailEl.querySelectorAll('[data-section-id]').forEach((sec) => {
      const sid = sec.getAttribute('data-section-id');
      const m = map[sid]; if (!m) return;
      let prog = sec.querySelector('.persona-section__progress');
      if (!prog) {
        prog = document.createElement('span');
        prog.className = 'persona-section__progress';
        const caret = sec.querySelector('.persona-section__caret');
        sec.querySelector('.persona-section__head--toggle').insertBefore(prog, caret);
      }
      prog.textContent = m.filled + '/' + m.total;
      prog.classList.toggle('persona-section__progress--full', m.filled === m.total);
    });
  }

  // 画像完整度评分（粗粒度 16 项核心字段）
  function calcPersonaCompleteness(p) {
    const checks = [
      { v: p.personality.traits.length > 0, label: '性格特质' },
      { v: !!p.personality.mood, label: '整体情绪' },
      { v: !!p.personality.communication, label: '沟通偏好' },
      { v: !!p.family.ageRange, label: '年龄段' },
      { v: !!p.family.marital, label: '婚姻' },
      { v: !!p.family.children, label: '子女' },
      { v: !!p.family.gender, label: '性别' },
      { v: !!inferFamilyRole(p.family), label: '家庭角色(自动)' },
      { v: !!p.finance.level, label: '资产级别' },
      { v: p.finance.jobs.length > 0, label: '职业' },
      { v: p.finance.interests.length > 0, label: '兴趣' },
      { v: !!p.industry, label: '行业' },
      { v: !!p.decisionRole, label: '决策身份' },
      { v: p.painPoints.length > 0, label: '痛点' },
      { v: !!p.salesNotes, label: '销售备注' },
      { v: p.chats && p.chats.length > 0, label: '聊天历史' }
    ];
    const filled = checks.filter(c => c.v).length;
    const total = checks.length;
    const percent = Math.round(filled / total * 100);
    let level = 'low';
    if (percent >= 80) level = 'high';
    else if (percent >= 50) level = 'mid';
    return { filled, total, percent, level, checks };
  }

  function buildProfilePane(friend, p) {
    const comp = calcPersonaCompleteness(p);
    return (
      '<div class="profile-grid">' +
        // 画像完整度（置顶，醒目）
        '<div class="profile-completeness profile-completeness--' + comp.level + '">' +
          '<div class="profile-completeness__head">' +
            '<span class="profile-completeness__label">画像完整度</span>' +
            '<span class="profile-completeness__pct">' + comp.percent + '%</span>' +
            '<span class="profile-completeness__level">' + (comp.level === 'high' ? '完整' : comp.level === 'mid' ? '良好' : '需补充') + '</span>' +
          '</div>' +
          '<div class="profile-completeness__bar">' +
            '<div class="profile-completeness__fill" style="width: ' + comp.percent + '%"></div>' +
          '</div>' +
          '<div class="profile-completeness__hint">已填 ' + comp.filled + ' / ' + comp.total + ' 项关键字段（性格/家庭/资产/行业/痛点/历史）· <strong>80% 完整</strong>解锁 AI 销冠高级话术</div>' +
        '</div>' +
        '<div class="profile-row"><div class="profile-row__label">姓名</div><div class="profile-row__value">' + escapeHtml(friend.name) + '</div></div>' +
        '<div class="profile-row"><div class="profile-row__label">ID</div><div class="profile-row__value">' + escapeHtml(friend.id) + '</div></div>' +
        '<div class="profile-row"><div class="profile-row__label">来源</div><div class="profile-row__value">' +
          (p.base.source === 'wechat-import'
            ? '微信聊天导入 · ' + (p.base.importDate || '今日') +
              (p.base.fileName ? ' · ' + escapeHtml(p.base.fileName) : '')
            : 'UMakex 通讯录') +
        '</div></div>' +
        '<div class="profile-row"><div class="profile-row__label">导入对话</div><div class="profile-row__value">' +
          (p.chats.length
            ? p.chats.length + ' 条'
            : '<span class="profile-empty">尚未导入 · 可在「聊天历史」上传 .txt 或粘贴文本</span>') +
        '</div></div>' +
        '<div class="profile-row"><div class="profile-row__label">画像字段</div><div class="profile-row__value">' +
          countPersonaFields(p) + ' 项已填写 · AI 销冠在聊天时会引用</div></div>' +
        '<div class="profile-row"><div class="profile-row__label">上次更新</div><div class="profile-row__value">' +
          (p.__updatedAt || '<span class="profile-empty">未更新</span>') + '</div></div>' +
      '</div>'
    );
  }

  // 构建一个可折叠的 section 块
  function buildSection(id, title, hint, content) {
    return (
      '<div class="persona-section" data-section-id="' + id + '" data-state="expanded">' +
        '<div class="persona-section__head persona-section__head--toggle" data-toggle-section="' + id + '">' +
          '<div class="persona-section__title-wrap">' +
            '<div class="persona-section__title">' + title + '</div>' +
            '<div class="persona-section__hint">' + hint + '</div>' +
          '</div>' +
          '<span class="persona-section__caret">▾</span>' +
        '</div>' +
        '<div class="persona-section__body">' + content + '</div>' +
      '</div>'
    );
  }

  function buildPersonaPane(friend, p) {
    return (
      buildSection('personality', '🧠 性格脾气', '多选 / 单选 · 帮 AI 知道怎么说话',
        '<div class="chip-row" data-persona-key="personality.traits">' +
          chipBtns(PERSONA_TRAITS, p.personality.traits) +
        '</div>' +
        '<div class="persona-section__head" style="margin-top:14px;"><div class="persona-section__title">整体情绪</div></div>' +
        '<div class="persona-radio-row" data-persona-key="personality.mood">' +
          radioBtns(PERSONA_MOOD, p.personality.mood) +
        '</div>' +
        '<div class="persona-section__head" style="margin-top:14px;"><div class="persona-section__title">沟通偏好</div></div>' +
        '<div class="persona-radio-row" data-persona-key="personality.communication">' +
          radioBtns(PERSONA_COMMUNICATION, p.personality.communication) +
        '</div>'
      ) +

      buildSection('family', '🏠 家庭背景', '年龄段 · 婚姻 · 子女 · 性别 · 角色(自动)',
        '<div class="persona-section__head" style="margin:8px 0 6px;"><div class="persona-section__title">年龄段</div></div>' +
        '<div class="persona-radio-row" data-persona-key="family.ageRange">' +
          radioBtns(PERSONA_FAMILY.ageRange, p.family.ageRange) +
        '</div>' +
        '<div class="persona-section__head" style="margin:12px 0 6px;"><div class="persona-section__title">婚姻</div></div>' +
        '<div class="persona-radio-row" data-persona-key="family.marital">' +
          radioBtns(PERSONA_FAMILY.marital, p.family.marital) +
        '</div>' +
        '<div class="persona-section__head" style="margin:12px 0 6px;"><div class="persona-section__title">子女</div></div>' +
        '<div class="persona-radio-row" data-persona-key="family.children">' +
          radioBtns(PERSONA_FAMILY.children, p.family.children) +
        '</div>' +
        '<div class="persona-section__head" style="margin:12px 0 6px;"><div class="persona-section__title">性别</div></div>' +
        '<div class="persona-radio-row" data-persona-key="family.gender">' +
          radioBtns(PERSONA_FAMILY.gender, p.family.gender) +
        '</div>' +
        '<div class="persona-section__inferred" id="familyInferred">' +
          (inferFamilyRole(p.family) ? '<span class="persona-section__inferred-label">系统推断家庭角色：</span><strong>' + escapeHtml(inferFamilyRole(p.family)) + '</strong>' : '') +
        '</div>' +
        '<div class="persona-section__head" style="margin:12px 0 6px;"><div class="persona-section__title">备注</div></div>' +
        '<textarea class="persona-textarea" data-persona-key="family.note" placeholder="自由填写，例如：配偶是同行业 / 父母同住 / 喜欢接送孩子上下学">' +
          escapeHtml(p.family.note) + '</textarea>'
      ) +

      buildSection('finance', '💰 资产背景', '帮助 AI 推销匹配价位',
        '<div class="persona-section__head" style="margin:8px 0 6px;"><div class="persona-section__title">资产级别</div></div>' +
        '<div class="persona-radio-row" data-persona-key="finance.level">' +
          PERSONA_FINANCE.level.map((o) => (
            '<button class="chip' + (p.finance.level === o.v ? ' is-active' : '') + '"' +
              ' data-value="' + escapeHtml(o.v) + '" type="button">' + escapeHtml(o.v) + '</button>'
          )).join('') +
        '</div>' +
        '<div class="persona-section__head" style="margin:12px 0 6px;"><div class="persona-section__title">职业（多选）</div></div>' +
        '<div class="chip-row" data-persona-key="finance.jobs">' +
          chipBtns(PERSONA_FINANCE.jobs, p.finance.jobs) +
        '</div>' +
        '<div class="persona-section__head" style="margin:12px 0 6px;"><div class="persona-section__title">兴趣 / 关注（多选）</div></div>' +
        '<div class="chip-row" data-persona-key="finance.interests">' +
          chipBtns(PERSONA_FINANCE.interests, p.finance.interests) +
        '</div>' +
        '<div class="persona-section__head" style="margin:12px 0 6px;"><div class="persona-section__title">备注</div></div>' +
        '<textarea class="persona-textarea" data-persona-key="finance.note" placeholder="自由备注，例如：近期关注美元保险 / 名下有 2 套房 / 计划明年移民">' +
          escapeHtml(p.finance.note) + '</textarea>'
      ) +

      buildSection('industry', '🏢 行业', '销售话术按行业匹配产品',
        '<div class="persona-radio-row" data-persona-key="industry">' +
          PERSONA_INDUSTRY.map((v) => (
            '<button class="chip' + (p.industry === v ? ' is-active' : '') + '"' +
              ' data-value="' + escapeHtml(v) + '" type="button">' + escapeHtml(v) + '</button>'
          )).join('') +
        '</div>'
      ) +

      buildSection('decision', '👤 决策身份', '影响销售触达策略（决策者 / 影响者 / 使用者 / 家人替代）',
        '<div class="persona-radio-row" data-persona-key="decisionRole">' +
          PERSONA_DECISION_ROLE.map((v) => (
            '<button class="chip' + (p.decisionRole === v ? ' is-active' : '') + '"' +
              ' data-value="' + escapeHtml(v) + '" type="button">' + escapeHtml(v) + '</button>'
          )).join('') +
        '</div>'
      ) +

      buildSection('pain', '🎯 痛点', '销售突破口（多选）',
        '<div class="chip-row" data-persona-key="painPoints">' +
          chipBtns(PERSONA_PAIN_POINTS, p.painPoints) +
        '</div>'
      ) +

      buildSection('salesnote', '📝 销售备注', '给 AI 销冠看的内部备注',
        '<textarea class="persona-textarea" data-persona-key="salesNotes" placeholder="例：上周问过 8000 套餐 · 偏好下午联系 · 老婆比他更决策">' +
          escapeHtml(p.salesNotes) + '</textarea>'
      ) +

      // 保存条
      '<div class="detail-actions">' +
        '<span class="detail-actions__hint">保存后会同步给 AI 销冠，下次聊天立即引用</span>' +
        '<div class="detail-actions__btns">' +
          '<div class="persona-tpl-wrap">' +
            '<button class="persona-tpl-trigger" id="personaTplTrigger" type="button">' +
              '<span>▾ 套用模板</span>' +
            '</button>' +
            '<div class="persona-tpl-menu" id="personaTplMenu" data-state="closed">' +
              PERSONA_TEMPLATES.map((t) => (
                '<button class="persona-tpl-item" type="button" data-tpl-id="' + t.id + '">' +
                  '<span class="persona-tpl-item__name">' + escapeHtml(t.name) + '</span>' +
                  '<span class="persona-tpl-item__desc">' + escapeHtml(t.desc) + '</span>' +
                '</button>'
              )).join('') +
            '</div>' +
          '</div>' +
          '<button class="detail-actions__btn" id="detailSave" type="button">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
              '<path d="M5 13l4 4L19 7"/></svg>' +
            '保存画像' +
          '</button>' +
        '</div>' +
      '</div>'
    );
  }

  function buildHistoryPane(friend, p) {
    return (
      '<div class="importer">' +
        '<div class="importer__drop" id="importDrop">' +
          '<svg class="importer__drop-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">' +
            '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/>' +
            '<line x1="12" y1="3" x2="12" y2="15"/></svg>' +
          '<div class="importer__drop-title">拖入微信聊天记录 (.txt)</div>' +
          '<div class="importer__drop-sub">支持 文本/CSV · 单文件最大 5MB</div>' +
          '<input type="file" id="importFile" accept=".txt,.csv,text/plain" style="display:none" />' +
        '</div>' +
        '<div class="importer__or">或粘贴聊天文本</div>' +
        '<textarea class="importer__paste" id="importPaste" placeholder="例如：&#10;2024-03-15 10:23 张总 我们考虑这个产品&#10;2024-03-15 10:25 我 好的张总，给您发资料..."></textarea>' +
        '<div class="importer__btn-row">' +
          '<button class="importer__btn" id="importFileBtn" type="button">📁 选择文件</button>' +
          '<button class="importer__btn importer__btn--primary" id="importParseBtn" type="button">解析并导入</button>' +
          (p.chats.length ? '<button class="importer__btn" id="importClearBtn" type="button">清空</button>' : '') +
        '</div>' +
      '</div>' +

      '<div class="imported-chats">' +
        '<div class="imported-chats__head">' +
          '<div class="imported-chats__title">💬 已导入对话</div>' +
          '<span class="imported-chats__count" id="importedCount">' + p.chats.length + ' 条</span>' +
        '</div>' +
        (p.chats.length
          ? '<div class="chat-mini-list">' + p.chats.map((c) => renderChatMini(c, friend)).join('') + '</div>'
          : '<div class="imported-chats__empty">还没导入对话 · 解析后会显示在这里</div>') +
      '</div>'
    );
  }
  function renderChatMini(c, friend) {
    const isSelf = c.role === 'self';
    const initial = isSelf ? 'M' : (friend.avatarInitial || friend.name[0] || '?');
    const colorStyle = isSelf ? 'background:#87CEEB' : friend.avatarStyle;
    return (
      '<div class="chat-mini' + (isSelf ? ' chat-mini--self' : '') + '">' +
        '<div class="chat-mini__role" style="' + colorStyle + '">' + escapeHtml(initial) + '</div>' +
        '<div class="chat-mini__body">' +
          '<div class="chat-mini__time">' + escapeHtml(c.time || '—') + ' · ' + (isSelf ? '我' : escapeHtml(friend.name)) + '</div>' +
          '<div class="chat-mini__text">' + escapeHtml(c.text) + '</div>' +
        '</div>' +
      '</div>'
    );
  }

  /* ---------- 4. Chip / radio 按钮工厂 ---------- */
  function chipBtns(options, activeArr) {
    const set = new Set(activeArr || []);
    return options.map((o) =>
      '<button class="chip' + (set.has(o) ? ' is-active' : '') + '" data-value="' + escapeHtml(o) + '" type="button">' +
        escapeHtml(o) +
      '</button>'
    ).join('');
  }
  function radioBtns(options, activeVal) {
    return options.map((o) =>
      '<button class="chip' + (activeVal === o ? ' is-active' : '') + '" data-value="' + escapeHtml(o) + '" type="button">' +
        escapeHtml(o) +
      '</button>'
    ).join('');
  }

  /* ---------- 5. Bind handlers ---------- */
  function setNested(obj, path, value) {
    const parts = path.split('.');
    let o = obj;
    for (let i = 0; i < parts.length - 1; i++) {
      if (!o[parts[i]]) o[parts[i]] = {};
      o = o[parts[i]];
    }
    o[parts[parts.length - 1]] = value;
  }
  function getNested(obj, path) {
    return path.split('.').reduce((o, k) => (o ? o[k] : undefined), obj);
  }

  // 实时更新系统推断的家庭角色显示（不写入 persona，只刷新 DOM）
  function updateInferredRole() {
    const el = document.getElementById('familyInferred');
    if (!el) return;
    // 从 DOM 收集当前 family 字段
    const family = { ageRange: '', marital: '', children: '', gender: '', note: '' };
    detailEl.querySelectorAll('[data-persona-key]').forEach((node) => {
      const key = node.getAttribute('data-persona-key');
      if (!key.startsWith('family.')) return;
      const field = key.split('.')[1];
      if (node.classList.contains('persona-radio-row')) {
        const active = node.querySelector('.chip.is-active');
        family[field] = active ? active.getAttribute('data-value') : '';
      } else if (node.tagName === 'TEXTAREA') {
        family[field] = node.value || '';
      }
    });
    const inferred = inferFamilyRole(family);
    el.innerHTML = inferred
      ? '<span class="persona-section__inferred-label">系统推断家庭角色：</span><strong>' + escapeHtml(inferred) + '</strong>'
      : '';
  }

  function gatherCurrentPersona() {
    const persona = loadPersona(currentFriend.id) || emptyPersona(currentFriend);
    // 重置数组字段以便重收集
    persona.personality.traits = [];
    persona.finance.jobs = [];
    persona.finance.interests = [];

    detailEl.querySelectorAll('[data-persona-key]').forEach((node) => {
      const key = node.getAttribute('data-persona-key');
      if (node.classList.contains('chip-row') || node.classList.contains('persona-radio-row')) {
        const active = node.querySelectorAll('.chip.is-active');
        const values = Array.from(active).map((c) => c.getAttribute('data-value'));
        if (node.classList.contains('persona-radio-row')) {
          setNested(persona, key, values[0] || '');
        } else {
          setNested(persona, key, values);
        }
      } else if (node.tagName === 'TEXTAREA' || node.tagName === 'INPUT') {
        setNested(persona, key, node.value || '');
      }
    });
    // 家庭角色不写入 persona — 完全由 inferFamilyRole(p.family) 实时推断
    return persona;
  }

  function bindDetailHandlers(friend, persona) {
    // 返回
    const back = document.getElementById('detailBack');
    if (back) back.addEventListener('click', () => {
      detailEl.setAttribute('data-state', 'hidden');
      emptyEl.style.display = '';
      document.querySelectorAll('.contact-item.is-selected').forEach((n) => n.classList.remove('is-selected'));
      currentFriend = null;
    });

    // Tab 切换
    detailEl.querySelectorAll('.detail-tab').forEach((tab) => {
      tab.addEventListener('click', () => {
        const id = tab.dataset.tab;
        detailEl.querySelectorAll('.detail-tab').forEach((t) => t.classList.toggle('is-active', t === tab));
        detailEl.querySelectorAll('.detail-pane').forEach((p) => {
          p.classList.toggle('is-active', p.dataset.pane === id);
        });
      });
    });

    // Section 折叠 toggle
    detailEl.querySelectorAll('[data-toggle-section]').forEach((head) => {
      head.addEventListener('click', () => {
        const sid = head.getAttribute('data-toggle-section');
        const sec = detailEl.querySelector('[data-section-id="' + sid + '"]');
        if (!sec) return;
        const collapsed = sec.getAttribute('data-state') === 'collapsed';
        sec.setAttribute('data-state', collapsed ? 'expanded' : 'collapsed');
      });
    });

    // Section 进度初始化 + chip 改变时实时更新
    refreshSectionProgress(detailEl, persona);

    // Chip 单 / 多选
    detailEl.querySelectorAll('.chip-row, .persona-radio-row').forEach((row) => {
      const isMulti = row.classList.contains('chip-row');
      row.addEventListener('click', (e) => {
        const btn = e.target.closest('.chip');
        if (!btn) return;
        if (isMulti) {
          btn.classList.toggle('is-active');
        } else {
          row.querySelectorAll('.chip').forEach((c) => c.classList.remove('is-active'));
          btn.classList.add('is-active');
        }
        // 实时更新系统推断的家庭角色
        updateInferredRole();
        // 同步每个 section 标题右侧的 "3/4" 进度
        refreshSectionProgress(detailEl, persona);
      });
    });

    // textarea 实时更新 section 进度
    detailEl.querySelectorAll('textarea[data-persona-key]').forEach((ta) => {
      ta.addEventListener('input', () => refreshSectionProgress(detailEl, persona));
    });

    // 保存
    const save = document.getElementById('detailSave');
    if (save) save.addEventListener('click', () => {
      const p = gatherCurrentPersona();
      p.__updatedAt = new Date().toLocaleString('zh-CN', { hour12: false });
      // 保存前备份原值（供撤销用）
      const prevSnapshot = loadPersona(friend.id);
      save.setAttribute('data-loaded', '1');
      if (savePersona(friend.id, p)) {
        // 按钮短暂变「已保存」
        const orig = save.innerHTML;
        save.classList.add('detail-actions__btn-saved');
        save.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 13l4 4L19 7"/></svg> 已保存 · AI 销冠已读到';
        setTimeout(() => {
          save.classList.remove('detail-actions__btn-saved');
          save.innerHTML = orig;
          // 同步 tab count
          const cnt = document.getElementById('personaFillCount');
          if (cnt) cnt.textContent = countPersonaFields(p);
          // 同步顶部「已画像」badge
          const badge = detailEl.querySelector('.persona-summary-badge');
          const headName = detailEl.querySelector('.detail-head__name');
          if (!badge && headName && (p.chats.length || countPersonaFields(p))) {
            const b = el('span', 'persona-summary-badge', '已画像');
            headName.appendChild(b);
          }
        }, 1800);
        // 持久化右上角 toast + 撤销
        showSaveToast(friend, p, prevSnapshot, () => {
          // 撤销后重新渲染
          renderDetail(friend);
        });
      } else {
        save.textContent = '⚠ 保存失败';
      }
    });

    // 微信导入
    const drop = document.getElementById('importDrop');
    const fileInput = document.getElementById('importFile');
    const fileBtn  = document.getElementById('importFileBtn');
    const pasteEl  = document.getElementById('importPaste');
    const parseBtn = document.getElementById('importParseBtn');
    const clearBtn = document.getElementById('importClearBtn');

    if (fileBtn && fileInput) {
      fileBtn.addEventListener('click', () => fileInput.click());
    }
    if (drop && fileInput) {
      ['dragenter', 'dragover'].forEach((ev) => {
        drop.addEventListener(ev, (e) => { e.preventDefault(); e.stopPropagation(); drop.classList.add('is-drag'); });
      });
      ['dragleave', 'drop'].forEach((ev) => {
        drop.addEventListener(ev, (e) => { e.preventDefault(); e.stopPropagation(); drop.classList.remove('is-drag'); });
      });
      drop.addEventListener('drop', (e) => {
        const file = e.dataTransfer.files && e.dataTransfer.files[0];
        if (file) handleImportedFile(file, friend);
      });
      fileInput.addEventListener('change', (e) => {
        const file = e.target.files && e.target.files[0];
        if (file) handleImportedFile(file, friend);
      });
      drop.addEventListener('click', () => fileInput && fileInput.click());
    }
    if (parseBtn && pasteEl) {
      parseBtn.addEventListener('click', () => {
        const text = pasteEl.value.trim();
        if (!text) { pasteEl.style.borderColor = '#E54B4B'; pasteEl.placeholder = '⚠ 请粘贴聊天文本'; setTimeout(() => { pasteEl.style.borderColor = ''; }, 2000); return; }
        importParsedChats(text, '(粘贴文本)', friend);
      });
    }
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        if (!confirm('清空已导入的所有对话？')) return;
        const p = emptyPersona(friend);
        savePersona(friend.id, p);
        renderDetail(friend);
      });
    }

    // 模板菜单
    const tplTrigger = document.getElementById('personaTplTrigger');
    const tplMenu = document.getElementById('personaTplMenu');
    if (tplTrigger && tplMenu) {
      tplTrigger.addEventListener('click', (e) => {
        e.stopPropagation();
        const open = tplMenu.dataset.state === 'open';
        tplMenu.dataset.state = open ? 'closed' : 'open';
        tplTrigger.classList.toggle('is-open', !open);
      });
      document.addEventListener('click', (e) => {
        if (tplMenu.dataset.state !== 'open') return;
        if (e.target.closest('#personaTplTrigger') || e.target.closest('#personaTplMenu')) return;
        tplMenu.dataset.state = 'closed';
        tplTrigger.classList.remove('is-open');
      });
      tplMenu.querySelectorAll('.persona-tpl-item').forEach((btn) => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const id = btn.getAttribute('data-tpl-id');
          const tpl = PERSONA_TEMPLATES.find((t) => t.id === id);
          if (!tpl) return;
          if (!confirm('套用「' + tpl.name + '」将覆盖当前画像里 婚姻/性别/职业/兴趣/性格/痛点 等字段（保留：年龄+备注+聊天历史）。\n\n继续？')) return;
          const p = loadPersona(friend.id) || emptyPersona(friend);
          applyPersonaTemplate(p, tpl);
          savePersona(friend.id, p);
          renderDetail(friend);
          tplMenu.dataset.state = 'closed';
          tplTrigger.classList.remove('is-open');
        });
      });
    }
  }

  /* ---------- 6. 微信聊天解析 ---------- */
  function handleImportedFile(file, friend) {
    if (file.size > 5 * 1024 * 1024) { alert('文件超过 5MB'); return; }
    const reader = new FileReader();
    reader.onload = (e) => importParsedChats(e.target.result, file.name, friend);
    reader.readAsText(file, 'utf-8');
  }
  function importParsedChats(text, fileName, friend) {
    const chats = parseWechatChat(text);
    if (!chats.length) { alert('未能识别到有效对话，请检查文本格式（建议包含时间戳，如 2024-03-15 10:23）'); return; }
    const p = loadPersona(friend.id) || emptyPersona(friend);
    p.chats = chats;
    p.base.source = 'wechat-import';
    p.base.importDate = new Date().toISOString().slice(0, 10);
    p.base.fileName = fileName;
    // AI 自动从聊天内容提取画像
    const updates = extractPersonaFromChats(chats);
    const extractedCount = applyPersonaUpdates(p, updates);
    p.__updatedAt = new Date().toLocaleString('zh-CN', { hour12: false });
    savePersona(friend.id, p);
    renderDetail(friend);
    if (extractedCount > 0) showExtractToast(extractedCount, updates);
  }

  // AI 提取后绿色 toast 提示
  function showExtractToast(count, updates) {
    const toast = document.createElement('div');
    toast.className = 'ai-extract-toast';
    const labelMap = {
      'industry': '行业',
      'finance.jobs': '职业',
      'painPoints': '痛点',
      'finance.level': '资产级别',
      'personality.traits': '性格',
      'family.marital': '婚姻',
      'family.children': '子女',
      'family.gender': '性别'
    };
    const fields = Object.keys(updates).map(k => labelMap[k] || k).join('、');
    toast.innerHTML = (
      '<span class="ai-extract-toast__icon">⚡</span>' +
      '<div class="ai-extract-toast__body">' +
        '<div class="ai-extract-toast__title">AI 智能识别了 ' + count + ' 项画像</div>' +
        '<div class="ai-extract-toast__fields">已预填：' + escHtml(fields) + '</div>' +
        '<div class="ai-extract-toast__hint">已自动勾选对应 chip · 可手动调整</div>' +
      '</div>'
    );
    document.body.appendChild(toast);
    setTimeout(() => toast.classList.add('is-out'), 4500);
    setTimeout(() => toast.remove(), 5000);
  }

  // 保存后右上角持久 toast（5 秒 + 撤销）
  function showSaveToast(friend, savedPersona, prevSnapshot, onRevert) {
    // 移除已有 toast
    document.querySelectorAll('.save-toast').forEach((t) => t.remove());
    const toast = document.createElement('div');
    toast.className = 'save-toast';
    const changedFields = prevSnapshot
      ? Object.keys(savedPersona).filter((k) => JSON.stringify(savedPersona[k]) !== JSON.stringify(prevSnapshot[k])).length
      : 0;
    toast.innerHTML = (
      '<span class="save-toast__icon">✓</span>' +
      '<div class="save-toast__body">' +
        '<div class="save-toast__title">画像已保存' + (changedFields ? ' · 变更 ' + changedFields + ' 个字段' : '') + '</div>' +
        '<div class="save-toast__hint">AI 销冠下次聊天会立即引用</div>' +
      '</div>' +
      '<button class="save-toast__undo" type="button">撤销</button>'
    );
    document.body.appendChild(toast);
    let undone = false;
    const close = () => {
      toast.classList.add('is-out');
      setTimeout(() => toast.remove(), 280);
    };
    const undo = toast.querySelector('.save-toast__undo');
    let timer = setTimeout(close, 5000);
    undo.addEventListener('click', () => {
      undone = true;
      clearTimeout(timer);
      // 恢复 prevSnapshot（如果之前没数据就清空）
      if (prevSnapshot) {
        savePersona(friend.id, prevSnapshot);
      } else {
        try { localStorage.removeItem(storageKey(friend.id)); } catch (e) {}
      }
      close();
      if (onRevert) onRevert();
      // 提示已撤销
      const confirm = document.createElement('div');
      confirm.className = 'save-toast save-toast--undone';
      confirm.innerHTML = (
        '<span class="save-toast__icon">↶</span>' +
        '<div class="save-toast__body">' +
          '<div class="save-toast__title">已撤销，恢复到上次保存</div>' +
        '</div>'
      );
      document.body.appendChild(confirm);
      setTimeout(() => confirm.classList.add('is-out'), 2000);
      setTimeout(() => confirm.remove(), 2300);
    });
    // hover 暂停关闭
    toast.addEventListener('mouseenter', () => { clearTimeout(timer); });
    toast.addEventListener('mouseleave', () => { if (!undone) timer = setTimeout(close, 2500); });
  }
  function parseWechatChat(text) {
    // 尝试多种微信导出格式：
    // 格式 A：2024-03-15 10:23 张三 内容
    // 格式 B：2024/03/15 10:23
    //         张三
    //         内容
    // 格式 C：[03/15/2024 10:23:33] 张三 >>>
    //          内容
    const lines = text.split(/\r?\n/);
    const chats = [];
    const reA = /^(\d{4}[-\/]\d{1,2}[-\/]\d{1,2})\s+(\d{1,2}:\d{2}(?::\d{2})?)\s+(.+)$/;
    const reSep = /^(\d{4}[-\/]\d{1,2}[-\/]\d{1,2})\s+(\d{1,2}:\d{2}(?::\d{2})?)\s*$/;
    const reC = /^\[(\d{1,2}\/\d{1,2}\/\d{4})\s+(\d{1,2}:\d{2}(?::\d{2})?)\]\s+(.+?)\s*>>>?\s*$/;

    let cur = null;
    let nextLineIsBody = false;

    for (let i = 0; i < lines.length; i++) {
      const ln = lines[i].trim();
      if (!ln) continue;

      const mA = ln.match(reA);
      if (mA) {
        if (cur) chats.push(cur);
        cur = { time: mA[1] + ' ' + mA[2], role: 'them', text: '' };
        nextLineIsBody = true;
        // A 格式：单行就有内容
        const rest = ln.replace(reA, '').trim();
        if (rest) cur.text = rest;
        continue;
      }
      const mC = ln.match(reC);
      if (mC) {
        if (cur) chats.push(cur);
        cur = { time: mC[1] + ' ' + mC[2], role: 'them', text: '' };
        nextLineIsBody = true;
        continue;
      }
      const mSep = ln.match(reSep);
      if (mSep) {
        if (cur) chats.push(cur);
        cur = { time: mSep[1] + ' ' + mSep[2], role: 'them', text: '' };
        nextLineIsBody = true;
        continue;
      }
      // 普通内容行
      if (cur) {
        cur.text = cur.text ? (cur.text + ' ' + ln) : ln;
      }
    }
    if (cur) chats.push(cur);

    // 简化判断角色：默认全部是好友（them）。第一条如果是我说的就自动 mark self
    // 这里 demo 简化：保持 them，UI 上 M (我) 只在「发送」按钮触发时显示
    // 但为了演示「交替对话」感，每条交替设为 self/them
    chats.forEach((c, i) => { c.role = (i % 2 === 0) ? 'them' : 'self'; });

    return chats;
  }

  /* ---------- 7. 初始化：好友项点击 ---------- */
  function init() {
    document.querySelectorAll('.contact-item').forEach((item) => {
      item.addEventListener('click', () => selectFriend(item));
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  /* ---------- 8. 暴露给其他页（messages.html AI 接管读画像） ---------- */
  window.UMakexPersona = {
    load: loadPersona,
    storageKey: storageKey,
    inferFamilyRole: inferFamilyRole,   // 暴露给 messages.html 推断家庭角色
    summary: function (friendId) {
      const p = loadPersona(friendId);
      if (!p) return '';
      const bits = [];
      if (p.personality.traits.length) bits.push(p.personality.traits.join('、'));
      if (p.personality.mood)          bits.push(p.personality.mood);
      if (p.personality.communication) bits.push(p.personality.communication + '型');
      if (p.family.ageRange)           bits.push(p.family.ageRange);
      if (p.family.marital)            bits.push(p.family.marital);
      if (p.family.children && p.family.children !== '无') bits.push(p.family.children + '子女');
      // 家庭角色实时从 婚姻+子女+性别 推断（旧 localStorage 若残留 family.role 也兜底读取）
      const inferredRole = inferFamilyRole(p.family) || p.family.role || '';
      if (inferredRole)                bits.push(inferredRole);
      if (p.finance.level)             bits.push(p.finance.level);
      if (p.finance.jobs.length)       bits.push(p.finance.jobs.join('/'));
      if (p.finance.interests.length)  bits.push('关注' + p.finance.interests.join('/'));
      if (p.industry)                  bits.push(p.industry + '业');
      if (p.decisionRole)              bits.push(p.decisionRole);
      if (p.painPoints.length)         bits.push('痛点:' + p.painPoints.join('、'));
      return bits.join(' · ');
    }
  };
})();
