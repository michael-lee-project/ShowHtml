/* ============================================================
 * oa.js · 公众号 5 个页面的 GSAP 动效 + 交互
 * 1. 主页：项目卡 stagger 滑入 + 数字 count-up
 * 2. 文章列表：featured + cards stagger 滑入
 * 3. 数据洞察：4 KPI count-up + 折线图绘制 + 圆环 + 进度条
 * 4. 文章详情：fade in
 * 5. 菜单管理：tree stagger + phone preview + subtab 切换
 * ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  const page = document.body.dataset.page || 'home';
  const HAS_GSAP = typeof gsap !== 'undefined';
  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!HAS_GSAP || reduceMotion) {
    // 仍绑定 click 交互（不依赖 GSAP）
    bindInteractions(page);
    return;
  }

  /* ---------- 通用：nav tabs stagger ---------- */
  if (document.querySelector('.oa__nav')) {
    gsap.fromTo('.oa__nav-item',
      { opacity: 0, y: -8 },
      { opacity: 1, y: 0, duration: 0.4, ease: 'power3.out', stagger: 0.06, delay: 0.05 }
    );
  }

  /* ---------- 通用：subtab stagger ---------- */
  if (document.querySelector('.oa__subtab')) {
    gsap.fromTo('.oa__subtab-item',
      { opacity: 0, x: -8 },
      { opacity: 1, x: 0, duration: 0.35, ease: 'power3.out', stagger: 0.04, delay: 0.1 }
    );
  }

  /* ---------- 主页：hero + stats + project cards stagger ---------- */
  if (page === 'home') {
    if (document.querySelector('.oa__hero')) {
      gsap.fromTo('.oa__hero',
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', delay: 0.15 }
      );
    }
    if (document.querySelectorAll('.oa__stat').length) {
      gsap.fromTo('.oa__stat',
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out', stagger: 0.08, delay: 0.3, clearProps: 'transform,opacity' }
      );
      document.querySelectorAll('.oa__stat').forEach((stat, idx) => {
        const numEl = stat.querySelector('.oa__stat-num');
        if (!numEl) return;
        const text = numEl.textContent.trim();
        const m = text.match(/^([^\d]*)([\d.]+)(.*)$/);
        if (!m) return;
        const prefix = m[1] || '';
        const target = parseFloat(m[2]);
        const suffix = m[3] || '';
        const isInt = !m[2].includes('.');
        const obj = { v: 0 };
        gsap.to(obj, {
          v: target,
          duration: 1.4,
          delay: 0.5 + idx * 0.1,
          ease: 'power3.out',
          onUpdate: function() {
            numEl.textContent = prefix + (isInt ? Math.floor(obj.v) : obj.v.toFixed(1)) + suffix;
          }
        });
      });
    }
    if (document.querySelectorAll('.oa__project-card').length) {
      gsap.fromTo('.oa__project-card',
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.55, ease: 'power3.out', stagger: 0.06, delay: 0.6, clearProps: 'transform,opacity' }
      );
    }
    if (document.querySelectorAll('.oa__section').length) {
      gsap.fromTo('.oa__section',
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out', stagger: 0.1, delay: 0.9, clearProps: 'transform,opacity' }
      );
    }
  }

  /* ---------- 文章列表：featured + cards stagger ---------- */
  if (page === 'articles') {
    if (document.querySelector('.oa__featured-card')) {
      gsap.fromTo('.oa__featured-card',
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', delay: 0.2, clearProps: 'transform,opacity' }
      );
    }
    if (document.querySelectorAll('.oa__article-card').length) {
      gsap.fromTo('.oa__article-card',
        { opacity: 0, x: -12 },
        { opacity: 1, x: 0, duration: 0.5, ease: 'power3.out', stagger: 0.06, delay: 0.4, clearProps: 'transform,opacity' }
      );
    }
    if (document.querySelectorAll('.oa__chip').length) {
      gsap.fromTo('.oa__chip',
        { opacity: 0, y: 6 },
        { opacity: 1, y: 0, duration: 0.3, ease: 'power3.out', stagger: 0.04, delay: 0.15, clearProps: 'transform,opacity' }
      );
    }
    if (document.querySelector('.oa__pagination')) {
      gsap.fromTo('.oa__pagination',
        { opacity: 0, y: 8 },
        { opacity: 1, y: 0, duration: 0.4, ease: 'power3.out', delay: 1.2, clearProps: 'transform,opacity' }
      );
    }
  }

  /* ---------- 数据洞察：4 KPI count-up + 折线图 + 圆环 + 进度条 ---------- */
  if (page === 'analytics') {
    document.querySelectorAll('.oa__kpi-card').forEach((card, idx) => {
      const numEl = card.querySelector('.oa__kpi-num');
      if (!numEl) return;
      const text = numEl.textContent.trim();
      const m = text.match(/^([\d,.]+)([%k]?)$/);
      if (!m) return;
      const numStr = m[1].replace(/,/g, '');
      const target = parseFloat(numStr);
      const suffix = m[2] || '';
      const obj = { v: 0 };
      gsap.to(obj, {
        v: target,
        duration: 1.6,
        delay: 0.3 + idx * 0.1,
        ease: 'power2.out',
        onUpdate: function() {
          const cur = obj.v;
          if (cur >= 1000) {
            numEl.textContent = Math.floor(cur).toLocaleString('en-US') + suffix;
          } else if (target < 10) {
            numEl.textContent = cur.toFixed(1) + suffix;
          } else {
            numEl.textContent = Math.floor(cur) + suffix;
          }
        }
      });
      gsap.fromTo(card,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out', delay: idx * 0.08, clearProps: 'transform,opacity' }
      );
    });

    const polyline = document.querySelector('.oa__chart-svg polyline');
    if (polyline) {
      const length = polyline.getTotalLength();
      gsap.set(polyline, { strokeDasharray: length, strokeDashoffset: length });
      gsap.to(polyline, {
        strokeDashoffset: 0,
        duration: 1.6,
        delay: 0.8,
        ease: 'power2.inOut'
      });
    }
    const polygon = document.querySelector('.oa__chart-svg polygon');
    if (polygon) {
      gsap.fromTo(polygon, { opacity: 0 }, { opacity: 1, duration: 1, delay: 0.5 });
    }
    const circles = document.querySelectorAll('.oa__chart-svg circle');
    if (circles.length) {
      gsap.fromTo(circles,
        { scale: 0, transformOrigin: '50% 50%' },
        { scale: 1, duration: 0.4, ease: 'power2.out', stagger: 0.08, delay: 1.2 }
      );
    }
    gsap.fromTo('.oa__chart-block',
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out', stagger: 0.1, delay: 0.2, clearProps: 'transform,opacity' }
    );

    const donutCircles = document.querySelectorAll('.oa__donut circle');
    if (donutCircles.length) {
      donutCircles.forEach((c) => {
        const len = 251.3;
        const dash = c.getAttribute('stroke-dasharray') || '0 251.3';
        const visible = parseFloat(dash.split(' ')[0]);
        c.setAttribute('stroke-dasharray', '0 251.3');
        gsap.to(c, {
          attr: { 'stroke-dasharray': visible + ' 251.3' },
          duration: 1.2,
          delay: 0.8,
          ease: 'power2.out'
        });
      });
    }

    document.querySelectorAll('.oa__bar-fill').forEach((bar, idx) => {
      const w = bar.style.width;
      gsap.set(bar, { width: '0%' });
      gsap.to(bar, {
        width: w,
        duration: 1.2,
        delay: 0.8 + idx * 0.1,
        ease: 'power3.out'
      });
    });

    document.querySelectorAll('.oa__profile-fill').forEach((bar, idx) => {
      const w = bar.style.width;
      gsap.set(bar, { width: '0%' });
      gsap.to(bar, {
        width: w,
        duration: 1.0,
        delay: 0.8 + idx * 0.05,
        ease: 'power3.out'
      });
    });

    if (document.querySelectorAll('.oa__top-item').length) {
      gsap.fromTo('.oa__top-item',
        { opacity: 0, x: -12 },
        { opacity: 1, x: 0, duration: 0.4, ease: 'power3.out', stagger: 0.04, delay: 0.9, clearProps: 'transform,opacity' }
      );
    }
  }

  /* ---------- 文章详情：fade in ---------- */
  if (page === 'article') {
    if (document.querySelector('.oa__article-detail')) {
      gsap.fromTo('.oa__article-detail',
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', delay: 0.2, clearProps: 'transform,opacity' }
      );
      gsap.fromTo('.oa__article-detail > *',
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.4, ease: 'power3.out', stagger: 0.08, delay: 0.4, clearProps: 'transform,opacity' }
      );
    }
    if (document.querySelectorAll('.oa__related-item').length) {
      gsap.fromTo('.oa__related-item',
        { opacity: 0, x: -8 },
        { opacity: 1, x: 0, duration: 0.4, ease: 'power3.out', stagger: 0.08, delay: 1.2, clearProps: 'transform,opacity' }
      );
    }
  }

  /* ---------- 项目文章列表页：hero + 文章卡 stagger ---------- */
  if (page === 'project') {
    if (document.querySelector('.oa__proj-hero')) {
      gsap.fromTo('.oa__proj-hero',
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out', delay: 0.1, clearProps: 'transform,opacity' }
      );
    }
    if (document.querySelectorAll('.oa__proj-article-card').length) {
      gsap.fromTo('.oa__proj-article-card',
        { opacity: 0, x: -12 },
        { opacity: 1, x: 0, duration: 0.5, ease: 'power3.out', stagger: 0.07, delay: 0.3, clearProps: 'transform,opacity' }
      );
    }
    if (document.querySelector('.oa__proj-foot')) {
      gsap.fromTo('.oa__proj-foot',
        { opacity: 0, y: 8 },
        { opacity: 1, y: 0, duration: 0.4, ease: 'power3.out', delay: 0.7, clearProps: 'transform,opacity' }
      );
    }
  }

  /* ---------- 通用：按钮 / chip click 微动效 ---------- */
  document.querySelectorAll('.oa__chip, .oa__subtab-item, .oa__action-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      gsap.fromTo(btn,
        { scale: 0.95 },
        { scale: 1, duration: 0.3, ease: 'power2.out', clearProps: 'transform' }
      );
    });
  });

  // 绑定所有交互（GSAP 不依赖）
  bindInteractions(page);
});

/* ============================================================
 * 项目数据 + 文章数据
 * ============================================================ */
const PROJECTS = {
  desktop:    { name: 'UMakex_Desktop',   tag: 'AI 协同',     icon: 'UM', color: '#7C5CFF', desc: 'AI Agent 协同工作平台 · 8 专家 + CEO 全场景协同',          articles: 3, reads: '12.6w', followers: '8,652' },
  chain:      { name: '企业星链',          tag: 'Web3',       icon: '链', color: '#5D3FE5', desc: '企业数字资产 + 盈科合约 + 智能合约量化策略全栈',              articles: 3, reads: '8.4w',  followers: '5,213' },
  'opul-umc':   { name: 'Opul+UMC',         tag: '跨境支付',    icon: 'O+', color: '#07C160', desc: '稳定币结算 + 跨币种支持 + 商家接入一站式服务',                articles: 3, reads: '6.8w',  followers: '3,841' },
  'opu-univ':   { name: 'OPU 大学',         tag: '知识付费',    icon: 'OPU',color: '#FF6B35', desc: 'AI 创作 + 写作训练 + 企业内训 + 学员成长体系',                articles: 3, reads: '15.2w', followers: '12,604' },
  opulnx:     { name: 'OpulnX 量化',       tag: 'AI 量化',     icon: '◇', color: '#D4A574', desc: 'AI 多因子模型 + 实时风控 + 量化 vs 主观交易',                 articles: 3, reads: '4.6w',  followers: '2,189' },
  cishang:    { name: '慈商联营',          tag: '公益透明化',  icon: '慈', color: '#E85D5D', desc: '物资全流程追溯 + 5 角色协同 + Token 化公益',                 articles: 3, reads: '3.2w',  followers: '1,587' },
  member:     { name: 'UMC 会员服务',      tag: '会员体系',    icon: 'M',  color: '#1A2238', desc: 'NU / VIP / MN / MB 四级会员 + 月赠 Token + 成长路径',        articles: 3, reads: '5.7w',  followers: '4,329' },
  'ai-news':    { name: 'AI 资讯站',         tag: '行业资讯',    icon: 'AI', color: '#3E7BFA', desc: '每日 AI 资讯 + 行业趋势 + 模型发布 + 投融资',                 articles: 3, reads: '18.4w', followers: '23,108' }
};

const PROJECT_ARTICLES = {
  desktop: [
    { id: 'd1', title: 'AI Agent 协同办公的 5 个真相：为什么你的 AI 还没真正帮你干活？', lead: '不是 AI 不够强，是大多数团队把 Agent 当成了更聪明的搜索框。', tag: 'AI', read: '12.6w', like: '1.2k', time: '2026-06-30 15:24' },
    { id: 'd2', title: '销冠专家实战：30 天转化率从 12% 涨到 23% 的 4 个关键动作',     lead: '不是话术模板，是结构化的接管流程。', tag: '销售', read: '8.3w',  like: '892',  time: '2026-06-22 10:08' },
    { id: 'd3', title: 'UMakex V3 升级：算力中心 + 个人数据看板正式上线',              lead: '8 档位认购 + 5 会员等级 + 实时 token 余额。', tag: '产品', read: '5.4w',  like: '517',  time: '2026-06-15 09:12' },
    { id: 'd4', title: '5 个被低估的 AI 工具：让 ChatGPT 提升 10 倍效率的小众神器',  lead: '不是大模型，是工作流里的小积木。', tag: '工具', read: '4.7w',  like: '438',  time: '2026-06-08 09:00', new: true },
    { id: 'd5', title: 'CEO Agent 是怎么"思考"的？1.2 万次任务复盘',                  lead: '拆解 4 步决策链：从需求到执行的完整路径。', tag: 'AI', read: '3.9w',  like: '362',  time: '2026-06-01 14:30', new: true },
    { id: 'd6', title: '团队用 AI 半年后，我们砍掉了 3 个岗位，业绩涨了 47%',         lead: '不是 AI 替代人，是 AI 改变岗位职责。', tag: '管理', read: '6.1w',  like: '589',  time: '2026-05-26 11:15', new: true }
  ],
  chain: [
    { id: 'c1', title: 'Web3 + AI 融合的下一个爆点：合约级 Agent',                  lead: '智能合约不再是死的 if/else，而是由 AI 实时决策的活体协议。', tag: 'Web3', read: '5.2w', like: '624',  time: '2026-06-28 14:30' },
    { id: 'c2', title: '盈科合约量化策略全公开：4 因子 + 动态再平衡',                lead: '过去 12 个月年化 38.7%，最大回撤 8.2%。',                   tag: '策略', read: '3.7w', like: '412',  time: '2026-06-19 11:15' },
    { id: 'c3', title: '企业数字资产托管：合规、安全、税务一次说清',                  lead: 'Q2 已服务 23 家上市公司，总托管规模 ¥47.8 亿。',              tag: 'B 端', read: '2.8w', like: '298',  time: '2026-06-08 16:42' },
    { id: 'c4', title: '智能合约审计：AI 替代人工后 30 天节省 200 万',              lead: '审计准确率从 82% 提升到 96%，效率提升 8 倍。',                tag: 'Web3', read: '2.3w', like: '241',  time: '2026-05-30 10:20', new: true },
    { id: 'c5', title: '链上数据分析：如何从 10 亿交易中发现套利机会',              lead: '3 个核心维度 + 5 个实战策略，附完整 SQL。',                   tag: '策略', read: '1.9w', like: '187',  time: '2026-05-22 15:45', new: true },
    { id: 'c6', title: 'NFT 2.0：从头像到企业数字资产的进化路径',                    lead: '过去 6 个月 NFT 2.0 项目融资总额达 ¥18.4 亿。',                tag: 'B 端', read: '1.5w', like: '154',  time: '2026-05-15 09:30', new: true }
  ],
  'opul-umc': [
    { id: 'o1', title: '跨境支付新选择：稳定币结算全解析',                            lead: 'T+0 到账，手续费 0.3%，单笔上限 100 万 UMDT。',              tag: '支付', read: '4.1w', like: '487',  time: '2026-06-26 09:50' },
    { id: 'o2', title: '稳定币科普：USDT 与 UMDT 的差异、应用场景与选择建议',       lead: 'UMDT 由 UMC 生态背书的稳定币，1:1 兑付 + 链上可查。',           tag: '科普', read: '3.3w', like: '356',  time: '2026-06-17 13:20' },
    { id: 'o3', title: 'Opul+ 商家接入指南：3 步开通，30 分钟上线',                   lead: 'SDK / API / H5 三种接入方式任选，工程师 30 分钟搞定。',     tag: '教程', read: '2.5w', like: '274',  time: '2026-06-10 15:08' },
    { id: 'o4', title: '真实案例：一家外贸公司用稳定币 90 天回款 2.3 亿',              lead: '从 SWIFT 7 天到 UMDT 30 秒，资金周转率提升 4.2 倍。',        tag: 'B 端', read: '2.1w', like: '228',  time: '2026-05-28 11:00', new: true },
    { id: 'o5', title: 'Web3 钱包安全 10 条铁律：保住你的 100 万 UMDT',                lead: '90% 的丢币事件都是这 3 个低级错误。',                        tag: '科普', read: '3.4w', like: '372',  time: '2026-05-20 14:15', new: true },
    { id: 'o6', title: '稳定币合规手册：新加坡 / 香港 / 迪拜三地对比',                lead: '一张图看懂三地牌照申请流程、税务处理、运营限制。',           tag: '教程', read: '1.6w', like: '163',  time: '2026-05-12 10:30', new: true }
  ],
  'opu-univ': [
    { id: 'u1', title: '3 步做出爆款公众号文章：选题 / 结构 / 标题',                  lead: '180 天 + 9200 名学员验证过的方法论。',                       tag: '写作', read: '15.2w',like: '1.8k', time: '2026-06-29 08:30' },
    { id: 'u2', title: '学员成长体系：从入门到首席的 4 级路径',                       lead: 'NU / VIP / MN / MB 对应不同训练深度 + 实战资源。',          tag: '课程', read: '6.4w', like: '723',  time: '2026-06-20 10:45' },
    { id: 'u3', title: '企业内训 AI 助教实战：3 家公司落地案例复盘',                  lead: '某 500 强金融集团 3 个月内训 2,400 人，完课率 92%。',       tag: 'B 端', read: '3.8w', like: '401',  time: '2026-06-12 14:18' },
    { id: 'u4', title: '0 基础学 AI 写作：30 天从新手到签约作者',                     lead: '每天 1 小时，30 天后你也能写 10w+。',                        tag: '写作', read: '4.2w', like: '467',  time: '2026-05-25 09:45', new: true },
    { id: 'u5', title: '学员故事：从全职妈妈到 AI 内容创业，年入 200 万',             lead: '她是怎么做到的？3 个关键决策点复盘。',                       tag: '案例', read: '5.8w', like: '632',  time: '2026-05-18 16:00', new: true },
    { id: 'u6', title: '课程研发揭秘：1 节课的"开题 - 内测 - 上线"全过程',             lead: '从选题到交付，6 个月、3 轮内测、500+ 学员反馈。',            tag: '课程', read: '2.1w', like: '218',  time: '2026-05-08 11:30', new: true }
  ],
  opulnx: [
    { id: 'q1', title: 'AI 量化策略：多因子模型构建实战',                            lead: '从原始数据到实盘信号，完整 pipeline 全公开。',              tag: '量化', read: '3.2w', like: '368',  time: '2026-06-25 11:20' },
    { id: 'q2', title: '实时风控系统：异常自动止损的 6 个触发器',                    lead: '过去 18 个月避免重大回撤 14 次，累计挽回 ¥2.3 亿。',         tag: '风控', read: '2.4w', like: '286',  time: '2026-06-16 09:35' },
    { id: 'q3', title: '量化 vs 主观交易：5 年数据对比的 3 个反直觉结论',              lead: '夏普比率 / 最大回撤 / 胜率不是越大越好。',                   tag: '研究', read: '1.9w', like: '217',  time: '2026-06-07 16:00' },
    { id: 'q4', title: '量化新人 90 天成长计划：模型、策略、心态',                    lead: '从 0 到能稳定跑实盘，3 个月完整的进阶路径。',                tag: '量化', read: '1.4w', like: '152',  time: '2026-05-29 10:00', new: true },
    { id: 'q5', title: '高频策略 vs 中低频策略：不同资金量怎么选',                   lead: '100 万 / 1000 万 / 1 亿，三种资金规模的最优解。',            tag: '研究', read: '1.1w', like: '124',  time: '2026-05-21 14:30', new: true },
    { id: 'q6', title: 'AI 量化 vs 主观交易：4 个量化人亲述',                         lead: '他们从主观转量化的真实心路、坑、和最后的妥协。',           tag: '案例', read: '1.7w', like: '189',  time: '2026-05-13 09:15', new: true }
  ],
  cishang: [
    { id: 's1', title: '慈商联营公益平台上线：物资全流程透明化追溯',                  lead: '每一份爱心都可被追踪，从捐赠到送达 6 步全留痕。',            tag: '产品', read: '3.2w', like: '412',  time: '2026-06-27 10:00' },
    { id: 's2', title: '5 角色协同：企业 / 慈善会 / 社会组织 / 志愿者 / 受捐者',       lead: '不是围观，是分工明确的协同工作流。',                         tag: '运营', read: '2.1w', like: '278',  time: '2026-06-18 14:30' },
    { id: 's3', title: 'Token 化公益：每一份爱心都可被追溯、可被激励',                 lead: '捐赠 1 元 = 1 UMT，可追踪、可流转、可兑换。',                tag: '机制', read: '1.6w', like: '198',  time: '2026-06-09 09:15' },
    { id: 's4', title: '公益组织用 UMC 后：1 份捐赠 6 步全留痕',                       lead: '从 7 天审核到 30 分钟到账，效率提升 14 倍。',                  tag: '产品', read: '1.3w', like: '156',  time: '2026-05-26 11:45', new: true },
    { id: 's5', title: '5 个真实公益故事：Token 化改变了什么',                          lead: '山区小学 / 城市孤儿院 / 灾后重建 / 罕见病 / 环保。',           tag: '案例', read: '2.4w', like: '298',  time: '2026-05-17 16:00', new: true },
    { id: 's6', title: '公益行业 30 年最大变革：从"信任捐"到"可验证捐"',                 lead: '信任成本从 30% 降到 3%，行业即将重新洗牌。',                  tag: '运营', read: '1.8w', like: '211',  time: '2026-05-09 10:00', new: true }
  ],
  member: [
    { id: 'm1', title: 'NU / VIP / MN / MB 四级会员权益全解',                        lead: '不同等级的 token 折扣 + 专属专家 + 月赠福利。',               tag: '会员', read: '5.7w', like: '643',  time: '2026-06-24 13:45' },
    { id: 'm2', title: '月赠 Token：会员专属福利的 3 种使用姿势',                     lead: '购买算力 / 派单抵扣 / 兑换实物，哪个更划算？',               tag: '福利', read: '3.9w', like: '427',  time: '2026-06-14 10:20' },
    { id: 'm3', title: '会员升级：4 级成长路径与时间预期',                            lead: '从 NU 到 MB 平均需要 8 个月，最快 3 个月可达 MN。',            tag: '成长', read: '2.3w', like: '251',  time: '2026-06-05 11:00' },
    { id: 'm4', title: '8 折会员的一天：典型工作流 + Token 消耗明细',                  lead: '8:00 起床到 22:00 睡觉，AI 帮你干了什么？',                   tag: '会员', read: '1.7w', like: '189',  time: '2026-05-27 09:30', new: true },
    { id: 'm5', title: '5 折 MB 会员的特权：3 个真实案例',                              lead: '为什么 MB 会员的 ROI 是 NU 的 4.7 倍？',                      tag: '福利', read: '1.4w', like: '162',  time: '2026-05-19 14:45', new: true },
    { id: 'm6', title: '会员续费决策：算清 ROI 再决定',                                lead: '5 个维度 + 1 张表，3 分钟算出你的会员值不值。',              tag: '成长', read: '1.1w', like: '127',  time: '2026-05-11 16:00', new: true }
  ],
  'ai-news': [
    { id: 'a1', title: '2026 AI 行业趋势预测：Agent 商业化进入下半场',                lead: 'OpenAI / Anthropic / Google 三家路线分化，垂直 Agent 爆发。', tag: '趋势', read: '18.4w',like: '2.3k', time: '2026-06-30 08:00' },
    { id: 'a2', title: '五行风水 + AI = ？一个没人想到的千亿赛道',                     lead: '传统文化 + AI 的合规化产品已突破 200 万付费用户。',          tag: '跨界', read: '9.2w', like: '1.1k', time: '2026-06-21 12:00' },
    { id: 'a3', title: '每日 AI 资讯：模型发布 + 投融资 + 行业动态',                   lead: '今日 Anthropic 发布 Claude 3.7，国内 3 家完成 B 轮。',         tag: '日报', read: '6.8w', like: '742',  time: '2026-06-23 07:30' },
    { id: 'a4', title: '2026 Q2 AI 投融资复盘：47 笔融资总额 ¥312 亿',                 lead: 'Q2 比 Q1 增长 23%，Agent 赛道吸金 60%。',                     tag: '趋势', read: '7.3w', like: '812',  time: '2026-06-12 18:00', new: true },
    { id: 'a5', title: 'AI Agent 落地 30 强：从 demo 到千万 ARR 的路径',               lead: '拆解 30 个成功案例的 6 个共同点。',                           tag: '案例', read: '5.4w', like: '598',  time: '2026-05-28 10:00', new: true },
    { id: 'a6', title: '国内 AI 大模型 6 月排行：日活、月活、付费率 3 个维度',          lead: '文心一言 / 通义千问 / Kimi / 智谱 / 月之暗面 / DeepSeek。',   tag: '研究', read: '8.7w', like: '947',  time: '2026-05-20 09:00', new: true }
  ]
};

/* 新文章（标记 new: true）的初始未读数 = 关注后实时推送提示 */
const NEW_ARTICLES_COUNT = {
  desktop: 3, chain: 3, 'opul-umc': 3, 'opu-univ': 3,
  opulnx: 3, cishang: 3, member: 3, 'ai-news': 3
};

/* ============================================================
 * 8 项目分析数据（近 7 天）
 * ============================================================ */
const PROJECT_ANALYTICS = {
  desktop:    { reads7d: 12.6, newFollowers7d: 247, conversionRate: 8.2, sparkline: [180, 195, 210, 225, 205, 238, 260] },
  chain:      { reads7d: 8.4,  newFollowers7d: 152, conversionRate: 7.5, sparkline: [120, 118, 135, 142, 128, 148, 160] },
  'opul-umc':   { reads7d: 6.8,  newFollowers7d: 89,  conversionRate: 6.4, sparkline: [98, 92, 108, 115, 102, 118, 130] },
  'opu-univ':   { reads7d: 15.2, newFollowers7d: 386, conversionRate: 9.1, sparkline: [210, 235, 250, 265, 248, 278, 295] },
  opulnx:     { reads7d: 4.6,  newFollowers7d: 64,  conversionRate: 5.8, sparkline: [62, 68, 72, 78, 70, 82, 90] },
  cishang:    { reads7d: 3.2,  newFollowers7d: 47,  conversionRate: 4.2, sparkline: [45, 48, 52, 55, 49, 58, 65] },
  member:     { reads7d: 5.7,  newFollowers7d: 124, conversionRate: 6.9, sparkline: [82, 86, 93, 98, 88, 102, 114] },
  'ai-news':    { reads7d: 18.4, newFollowers7d: 547, conversionRate: 10.3, sparkline: [260, 280, 300, 318, 295, 330, 358] }
};

/* localStorage 关注状态管理 */
const FOLLOWED_KEY = 'umakex_followed_projects';
function getFollowed() {
  try {
    const raw = localStorage.getItem(FOLLOWED_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) { return {}; }
}
function setFollowed(pid, isFollowed) {
  const data = getFollowed();
  if (isFollowed) data[pid] = Date.now();
  else delete data[pid];
  try { localStorage.setItem(FOLLOWED_KEY, JSON.stringify(data)); } catch (e) {}
}
function isFollowed(pid) { return !!getFollowed()[pid]; }

/* 文章 body 模板（按 tag 分类）
 * 每篇 body = [p, h2, p, callout, h2, ul, h2, p]
 * 文本根据 article 字段动态生成
 */
const BODY_TEMPLATES = {
  'AI': [
    { type: 'p',     text: (a) => `${a.lead}本文从产品架构、用户行为、技术实现 3 个角度，拆解 ${a.title.replace(/[：:].*/, '')} 背后的设计逻辑。` },
    { type: 'h2',    text: () => '为什么大多数 AI 工具止步于 chatbox？' },
    { type: 'p',     text: () => '市面上 90% 的"AI 助手"本质上是一个 chatbox：你问它答，答完就忘。这种工具的瓶颈不在模型能力，而在"上下文断裂"——AI 不知道你是谁、你今天要做什么、你之前和它说过什么。' },
    { type: 'callout', num: 1, text: () => 'AI 不应该是"对话机器人"，而应该是"数字员工"。持续记忆 + 主动规划 + 任务执行，三者缺一不可。' },
    { type: 'h2',    text: () => 'UMakex 的 3 个解法' },
    { type: 'ul',    items: () => [
      '<strong>CEO Agent 调度</strong>：负责任务拆解、调度决策、结果验收',
      '<strong>8 专家 Agent 分工</strong>：销冠/品牌/文案/录音/视频/数据/五行/星座各司其职',
      '<strong>显式算力成本</strong>：每个任务都告诉你消耗多少 Token、为什么消耗、ROI 如何'
    ] },
    { type: 'h2',    text: () => '下一步行动' },
    { type: 'p',     text: () => '把 AI 真正当成"团队的一员"——给它分派任务、让它汇报结果、用 KPI 衡量它的产出，而不是把它当成更聪明的搜索框。' }
  ],
  '销售': [
    { type: 'p',     text: (a) => `${a.lead}这是销冠专家在某 B2B 团队 30 天的真实接管记录，4 个关键动作可复用。` },
    { type: 'h2',    text: () => '动作 1：客户分群 + 接管策略分级' },
    { type: 'p',     text: () => '把客户分为"强意向 / 转化期 / 议价期 / 沉睡"4 类，每类匹配不同的 AI 接管深度。强意向 95% 自动 + 5% 人工审核；议价期 70% 自动 + 30% 人工介入。' },
    { type: 'callout', num: 2, text: () => '接管不是"全自动"，而是"分级自动化"。人工介入点要明确、可监控。' },
    { type: 'h2',    text: () => '动作 2-4：话术库 / 时机 / 数据闭环' },
    { type: 'ul',    items: () => [
      '<strong>话术库结构化</strong>：6 套对话模板（强意向/转化/议价/B 端/裂变/咨询），每套对应客户提问 + AI 回复 + 高亮关键字',
      '<strong>时机算法</strong>：根据客户上一次对话 + 停留时长 + 历史行为，动态调整回复时机（30s ~ 4h）',
      '<strong>数据闭环</strong>：每次对话自动打标签、归类意图、统计转化率，每周生成优化建议'
    ] },
    { type: 'h2',    text: () => '30 天数据' },
    { type: 'p',     text: () => '客户回复率 +47%，平均转化时间从 6.2 天缩短到 2.8 天，人工客服工作量下降 62%，转化率从 12% 涨到 23%。' }
  ],
  '产品': [
    { type: 'p',     text: (a) => `${a.lead}本次升级带来 3 大模块的全面更新，覆盖从算力购买到数据洞察的完整链路。` },
    { type: 'h2',    text: () => '模块 1：算力中心' },
    { type: 'p',     text: () => '4 档位认购 + 动态返利，认购越多返利越高（最高 +25%）。认购周期从 7 天到 60 天灵活可选，满足不同现金流需求。' },
    { type: 'callout', num: 3, text: () => '算力即工资 · Token 是 AI 的 KPI。把算力消耗做成显式成本，让用户对 AI 的"工作努力"有量化感知。' },
    { type: 'h2',    text: () => '模块 2-3：会员体系 / 数据中心' },
    { type: 'ul',    items: () => [
      '<strong>5 级会员体系</strong>：NU / VIP / MN / MB / 钻石，对应不同 token 折扣（9 折 / 8 折 / 7 折 / 6 折）',
      '<strong>个人数据看板</strong>：每日 token 消耗、专家调用排行、任务完成率、转化漏斗',
      '<strong>实时算力余额</strong>：4 种显示位置（顶部 / 派单页 / 算力中心 / 我的），永不错过'
    ] },
    { type: 'h2',    text: () => '立即体验' },
    { type: 'p',     text: () => 'V3 已全量上线，新老用户首次登录即送 5,000 token 试用额度 + 1 次免费的销冠专家接管演示。' }
  ],
  'Web3': [
    { type: 'p',     text: (a) => `${a.lead}本文从技术架构、商业模式、合规风险 3 个层面，拆解 Web3 + AI 融合的下一个爆点。` },
    { type: 'h2',    text: () => '为什么是"合约级 Agent"？' },
    { type: 'p',     text: () => '传统智能合约是死的 if/else，写完即固化。AI 合约是活的——由 LLM 实时决策，根据链上数据、链下事件动态调整执行逻辑。' },
    { type: 'callout', num: 1, text: () => '"AI 合约 = 可执行的法律"。合约条款不再是静态文本，而是可被 AI 解释、协商、执行、争议解决的活体协议。' },
    { type: 'h2',    text: () => '3 个落地场景' },
    { type: 'ul',    items: () => [
      '<strong>动态费率</strong>：根据市场波动率，AI 实时调整借贷协议利率',
      '<strong>链上仲裁</strong>：交易纠纷由 AI 仲裁 Agent 读取链上证据 + 链下合同，自动判决',
      '<strong>自适应流动性</strong>：DEX 池子的费率 / 激励由 AI Agent 动态调整，最大化 LP 收益'
    ] },
    { type: 'h2',    text: () => '风险与挑战' },
    { type: 'p',     text: () => 'AI 合约的不可预测性 + 法律责任 + Gas 成本是 3 大核心挑战。我们正在做的"AI 合约沙盒"可在测试网完整模拟 30 天行为再上主网。' }
  ],
  '策略': [
    { type: 'p',     text: (a) => `${a.lead}本文首次公开盈科合约量化的完整策略体系，所有因子、权重、再平衡规则均可复现。` },
    { type: 'h2',    text: () => '4 因子体系' },
    { type: 'p',     text: () => '动量因子（20%）/ 价值因子（30%）/ 质量因子（30%）/ 情绪因子（20%）。每个因子包含 8-12 个细分指标，因子权重根据近 12 个月表现动态调整。' },
    { type: 'callout', num: 4, text: () => '"4 因子"不是拍脑袋的权重，是 5 年回测 + 12 个月实盘验证的最优解。最大回撤 8.2%，夏普比率 2.31。' },
    { type: 'h2',    text: () => '动态再平衡规则' },
    { type: 'ul',    items: () => [
      '<strong>触发条件</strong>：单因子偏离 > 15% / 总体波动率 > 阈值 / 月底强制再平衡',
      '<strong>执行规则</strong>：分 3 批下单，每批间隔 30 分钟，最小化市场冲击',
      '<strong>风控兜底</strong>：单日亏损 > 3% 自动减仓 50%，单周亏损 > 8% 触发熔断'
    ] },
    { type: 'h2',    text: () => '实盘数据' },
    { type: 'p',     text: () => '过去 12 个月年化 38.7%，最大回撤 8.2%，夏普比率 2.31，跑赢 BTC 同期的 +12.4% 和 ETH 的 +18.6%。' }
  ],
  'B 端': [
    { type: 'p',     text: (a) => `${a.lead}B 端业务的核心不是"做出来"，而是"做对、合规、可规模化"。` },
    { type: 'h2',    text: () => 'B 端落地的 3 个关键' },
    { type: 'p',     text: () => '客户决策链长（平均 7 人参与）、合规要求高、定制化程度深。这 3 个特点决定了 B 端产品必须有"行业 know-how + 合规框架 + 灵活定制"三位一体的能力。' },
    { type: 'callout', num: 1, text: () => '"标准化产品 + 灵活配置"是 B 端最佳实践。底层能力标准化，前层配置灵活化。' },
    { type: 'h2',    text: () => 'UMC 的 B 端优势' },
    { type: 'ul',    items: () => [
      '<strong>完整合规框架</strong>：金融级 KYC/AML、数据本地化、审计日志',
      '<strong>行业 know-how</strong>：金融、跨境、电商、公益 4 大行业最佳实践',
      '<strong>灵活定制</strong>：3 周 MVP 交付，6 周上线生产，12 周完成行业方案'
    ] },
    { type: 'h2',    text: () => '立即咨询' },
    { type: 'p',     text: () => 'B 端合作请发送邮件至 b@umakex.com，附上公司名 + 行业 + 核心需求，48h 内由 B 端负责人对接。' }
  ],
  '写作': [
    { type: 'p',     text: (a) => `${a.lead}180 天 + 9200 名学员验证过的爆款方法论：选题、结构、标题，三步决定一篇公众号文章的生死。` },
    { type: 'h2',    text: () => 'Step 1：选题 = 流量入口' },
    { type: 'p',     text: () => '选题的 3 个原则：① 痛点（用户主动搜索）② 共识（朋友圈可转）③ 争议（评论区会吵）。3 个原则同时满足，文章破圈概率 4 倍。' },
    { type: 'callout', num: 1, text: () => '"选题决定上限，结构决定下限，标题决定生死。" 3 步缺一不可。' },
    { type: 'h2',    text: () => 'Step 2-3：结构 / 标题' },
    { type: 'ul',    items: () => [
      '<strong>SCQA 结构</strong>：情境 → 冲突 → 问题 → 答案，让读者 8 秒内 get 重点',
      '<strong>7 种标题模板</strong>：数字型（"5 个真相"）、对比型（"A vs B"）、悬念型（"为什么 X"）、反转型（"X 不是你想的那样"）等',
      '<strong>3 段式开头</strong>：钩子（10 字内）→ 价值预告（30 字）→ 身份背书（50 字）'
    ] },
    { type: 'h2',    text: () => '学完这套你能做到' },
    { type: 'p',     text: () => '稳定的"3 天 1 篇 1w+"节奏，从灵感枯竭到持续输出，从自己写到团队协写，从流量焦虑到稳定涨粉。' }
  ],
  '课程': [
    { type: 'p',     text: (a) => `${a.lead}OPU 大学设计了 4 级成长路径，让不同基础的学员都能找到适合自己的训练深度。` },
    { type: 'h2',    text: () => '4 级成长路径' },
    { type: 'p',     text: () => 'NU（入门）→ VIP（进阶）→ MN（高级）→ MB（首席）。每级有明确的训练目标、考核标准、毕业权益。升级不是"按时间"，而是"按产出 + 考核"。' },
    { type: 'callout', num: 2, text: () => '"考核 + 产出"双轨制，避免"刷时长"的无效学习。每级 3 个月学习 + 1 次毕业考核 + 3 个实战产出。' },
    { type: 'h2',    text: () => '各级权益' },
    { type: 'ul',    items: () => [
      '<strong>NU 入门</strong>：12 门基础课 + 1v1 答疑群 + 毕业证书',
      '<strong>VIP 进阶</strong>：36 门进阶课 + 4 位导师 + 实战项目库',
      '<strong>MN 高级</strong>：72 门高级课 + 8 位行业导师 + 学员作品集',
      '<strong>MB 首席</strong>：VIP/MN 全权益 + 线下私董会 + 校友资源 + 商业机会'
    ] },
    { type: 'h2',    text: () => '毕业数据' },
    { type: 'p',     text: () => '过去 12 个月：NU 毕业 6,200 人，VIP 毕业 2,180 人，MN 毕业 580 人，MB 毕业 96 人。MB 学员平均年收入 87 万，最高 320 万。' }
  ],
  '量化': [
    { type: 'p',     text: (a) => `${a.lead}本文完整复盘 AI 量化策略从数据清洗、因子构建、回测验证、实盘信号的全 pipeline。` },
    { type: 'h2',    text: () => 'Pipeline 5 个阶段' },
    { type: 'p',     text: () => '数据采集 → 因子计算 → 特征选择 → 模型训练 → 信号生成。每个阶段都有明确的输入、输出、监控指标，任何一个异常都会触发回滚。' },
    { type: 'callout', num: 3, text: () => '"量化策略 = 工程问题，不是科学问题。" 80% 的时间在数据清洗和 pipeline 维护，不在模型创新。' },
    { type: 'h2',    text: () => '关键技术点' },
    { type: 'ul',    items: () => [
      '<strong>多因子模型</strong>：4 大类 38 个细分因子，因子相关性 < 0.3',
      '<strong>回测框架</strong>：T+1 撮合、滑点模拟、停牌处理、分红再投',
      '<strong>实盘适配</strong>：信号强度分级、仓位管理、紧急熔断'
    ] },
    { type: 'h2',    text: () => '实盘表现' },
    { type: 'p',     text: () => '过去 18 个月：年化 32.4%，最大回撤 6.8%，夏普 2.12，单日最大亏损 0.8%（远低于 3% 熔断线）。' }
  ],
  '风控': [
    { type: 'p',     text: (a) => `${a.lead}实时风控不是"事后补救"，而是"事前预警 + 事中干预 + 事后复盘"三位一体。` },
    { type: 'h2',    text: () => '6 个核心触发器' },
    { type: 'p',     text: () => '单日亏损 / 持仓集中度 / 流动性枯竭 / 异常波动 / 黑天鹅事件 / 监管政策。每个触发器都有明确的阈值、响应动作、回滚机制。' },
    { type: 'callout', num: 6, text: () => '过去 18 个月：6 个触发器累计触发 47 次，避免重大回撤 14 次，累计挽回损失 ¥2.3 亿。' },
    { type: 'h2',    text: () => '分级响应' },
    { type: 'ul',    items: () => [
      '<strong>L1 黄色预警</strong>：自动减仓 20%，短信通知负责人',
      '<strong>L2 橙色预警</strong>：自动减仓 50%，电话通知 + 暂停新开仓',
      '<strong>L3 红色熔断</strong>：全仓平仓 + 锁定账户 + 24h 复盘'
    ] },
    { type: 'h2',    text: () => '复盘机制' },
    { type: 'p',     text: () => '每次触发后 24h 内生成完整复盘报告（触发原因 / 响应时效 / 损失评估 / 改进措施），每月汇总成风控月报。' }
  ],
  '研究': [
    { type: 'p',     text: (a) => `${a.lead}5 年 + 8 个市场 + 200+ 策略的回测数据告诉我们：量化 vs 主观交易，不是简单的"AI 胜"。` },
    { type: 'h2',    text: () => '3 个反直觉结论' },
    { type: 'p',     text: () => '① 夏普比率不是越大越好，2.0-2.5 是甜区，>3.0 往往伴随过拟合。② 最大回撤可控比年化收益重要。③ 胜率 60% 已经算顶级，70%+ 几乎必然过拟合。' },
    { type: 'callout', num: 3, text: () => '"稳定盈利 > 暴利神话。" 8 年 + 32 个策略 + 4 种市场环境回测，稳定的 15-25% 年化比"高波动 +50%"更可持续。' },
    { type: 'h2',    text: () => '量化 vs 主观' },
    { type: 'ul',    items: () => [
      '<strong>量化的优势</strong>：纪律性、规模化、可回测、24h 不疲劳',
      '<strong>主观的优势</strong>：处理黑天鹅、捕捉长尾机会、灵活调整',
      '<strong>最佳实践</strong>：量化做基础仓位（70%）+ 主观做机会仓位（30%）'
    ] },
    { type: 'h2',    text: () => '给从业者的建议' },
    { type: 'p',     text: () => '别迷信"高夏普"，别追"暴利神话"，做好回撤管理、流动性管理、压力测试。稳定地活过 5 年，比一年暴赚更重要。' }
  ],
  '运营': [
    { type: 'p',     text: (a) => `${a.lead}5 角色协同不是"多人围观"，而是"分工明确、流程闭环、权责清晰"的工作流。` },
    { type: 'h2',    text: () => '5 角色分工' },
    { type: 'p',     text: () => '企业（出资方）/ 慈善会（监管方）/ 社会组织（执行方）/ 志愿者（参与方）/ 受捐者（受益方）。每个角色有独立的"权限 + 操作 + 收益"模型。' },
    { type: 'callout', num: 5, text: () => '"5 角色协同"的核心是"权责对等"：每个角色能做什么、能看什么、能分什么，必须明确。' },
    { type: 'h2',    text: () => '工作流闭环' },
    { type: 'ul',    items: () => [
      '<strong>需求发起</strong>：受捐者 / 社会组织提出需求',
      '<strong>资源对接</strong>：慈善会审核 + 企业匹配',
      '<strong>物资采购</strong>：社会组织执行 + 志愿者监督',
      '<strong>送达签收</strong>：受捐者确认 + 链上留痕',
      '<strong>反馈公示</strong>：5 角色共同见证 + Token 化激励'
    ] },
    { type: 'h2',    text: () => '效果数据' },
    { type: 'p',     text: () => '过去 90 天，5 角色协同 1,247 次物资捐赠，平均送达时间 4.6 天，满意度 96.2%，零重大投诉。' }
  ],
  '机制': [
    { type: 'p',     text: (a) => `${a.lead}Token 化公益 = "每一份爱心都可被追踪、可被激励、可被流转"。这是公益行业 30 年来最大的范式革命。` },
    { type: 'h2',    text: () => 'Token 化的 3 个核心价值' },
    { type: 'p',     text: () => '① 透明：每一笔捐赠上链，可追溯、可审计、不可篡改。② 激励：捐赠人 / 受捐者 / 志愿者都能获得 Token 激励，调动全链路积极性。③ 流通：Token 可在生态内流转，形成"捐赠-消费-再捐赠"的正向循环。' },
    { type: 'callout', num: 1, text: () => '捐赠 1 元 = 1 UMT，UMT 可追踪、可流转、可兑换。这不是"积分"，这是"链上资产"。' },
    { type: 'h2',    text: () => 'UMT 的 4 种使用方式' },
    { type: 'ul',    items: () => [
      '<strong>追踪用途</strong>：扫码看你的爱心被谁收到、用于何处、效果如何',
      '<strong>兑换权益</strong>：兑换平台商品、专属课程、公益活动名额',
      '<strong>流转</strong>：转赠给指定受捐者（受捐者收到双倍激励）',
      '<strong>持有增值</strong>：长期持有享受生态分红 + 优先参与权'
    ] },
    { type: 'h2',    text: () => '未来规划' },
    { type: 'p',     text: () => 'Q3 上线 UMT 跨链桥，Q4 接入更多公益组织 + 商业品牌，2027 年目标：覆盖 100 万捐赠人 + 1 亿 UMT 流通量。' }
  ],
  '会员': [
    { type: 'p',     text: (a) => `${a.lead}4 级会员体系不只是"花钱多优惠多"，而是"投入越多、能力越强、价值越大"的正向循环。` },
    { type: 'h2',    text: () => '4 级会员核心权益' },
    { type: 'p',     text: () => 'NU / VIP / MN / MB。token 折扣：9 折 / 8 折 / 7 折 / 6 折。专属专家：从 1 个到全部 8 个。月赠 token：从 0 到 50,000。' },
    { type: 'callout', num: 4, text: () => '"会员 = 资源 + 能力 + 圈层。" 4 级会员的差异不仅是钱，更是可调用的资源、能承担的角色、能进入的圈子。' },
    { type: 'h2',    text: () => '权益详细对比' },
    { type: 'ul',    items: () => [
      '<strong>NU 入门（¥198/月）</strong>：9 折 + 1 个基础专家 + 0 月赠',
      '<strong>VIP 进阶（¥698/月）</strong>：8 折 + 3 个专业专家 + 5,000 月赠',
      '<strong>MN 高级（¥1,980/月）</strong>：7 折 + 5 个高级专家 + 20,000 月赠',
      '<strong>MB 首席（¥5,800/月）</strong>：6 折 + 全部 8 专家 + 50,000 月赠 + 私董会'
    ] },
    { type: 'h2',    text: () => '如何选？' },
    { type: 'p',     text: () => '月使用 < 5,000 token 选 NU；5k-30k 选 VIP；30k-100k 选 MN；>100k 或需要私董会选 MB。前 3 个月可随时降级，无任何风险。' }
  ],
  '福利': [
    { type: 'p',     text: (a) => `${a.lead}月赠 token 是会员的"隐藏福利"，用对地方能放大 3 倍价值。` },
    { type: 'h2',    text: () => '3 种使用姿势' },
    { type: 'p',     text: () => '① 购买算力（4 档位认购 +8%/+12%/+18%/+25% 返利）② 派单抵扣（直接抵扣 token 消耗，省 20-40%）③ 兑换实物（限量定制周边 + 线下活动名额）' },
    { type: 'callout', num: 3, text: () => '最划算的姿势：派单抵扣。5,000 token 月赠，抵扣后相当于多用了 7,500 token，价值放大 50%。' },
    { type: 'h2',    text: () => '姿势对比' },
    { type: 'ul',    items: () => [
      '<strong>购买算力</strong>：5,000 token = 50,000 算力 × 9 折 = 45,000 实际算力（+8% 返利后 = 48,600）',
      '<strong>派单抵扣</strong>：5,000 token 直接抵扣，等于 7,500 token 的工作量（按平均 1:1.5 抵扣比）',
      '<strong>兑换实物</strong>：5,000 token = 1 套 UMC 定制周边（价值 ¥380）或 1 次线下沙龙名额'
    ] },
    { type: 'h2',    text: () => '推荐组合' },
    { type: 'p',     text: () => '3,000 token 派单抵扣 + 1,500 token 购买算力（认购 7d 档）+ 500 token 兑换 1 个线下沙龙名额。这是 92% MN 会员的最优解。' }
  ],
  '成长': [
    { type: 'p',     text: (a) => `${a.lead}从 NU 到 MB 平均 8 个月，但用对方法 3 个月就能到 MN。` },
    { type: 'h2',    text: () => '4 级时间预期' },
    { type: 'p',     text: () => 'NU → VIP：1-2 个月（消费 + 任务完成率达标）。VIP → MN：2-3 个月（月均消耗 30k+ token + 实战案例 3 个）。MN → MB：4-6 个月（行业认可 + 导师推荐 + 私董会通过）。' },
    { type: 'callout', num: 3, text: () => '"快路径" 不是刷时长，是"3 件事并行"：高密度使用 + 实战产出 + 导师辅导。三者缺一不可。' },
    { type: 'h2',    text: () => '加速的 3 个关键' },
    { type: 'ul',    items: () => [
      '<strong>高密度使用</strong>：每周 3 次派单 + 2 次数据分析 + 1 次写作输出',
      '<strong>实战产出</strong>：3 个真实项目案例（不限于平台内）+ 5 篇公开复盘',
      '<strong>导师辅导</strong>：VIP 起配 1v1 导师，MN 起配 行业导师 1v1'
    ] },
    { type: 'h2',    text: () => '学员案例' },
    { type: 'p',     text: () => '陈同学（VIP → MN）：2 个月零 8 天；李同学（MN → MB）：4 个月零 12 天。最快纪录：VIP → MN 仅 38 天（前提：金融行业背景 + 高密度使用）。' }
  ],
  '趋势': [
    { type: 'p',     text: (a) => `${a.lead}2026 年是 AI Agent 商业化分水岭：通用 Agent 红利结束，垂直 Agent 爆发。` },
    { type: 'h2',    text: () => '3 家头部分化' },
    { type: 'p',     text: () => 'OpenAI 走"通用 + App 生态"，Anthropic 走"企业级 + 安全"，Google 走"全栈 + Workspace 整合"。3 家路线分化给了垂直 Agent 巨大空间。' },
    { type: 'callout', num: 1, text: () => '"垂直 Agent = 行业 know-how + AI 能力 + 数据闭环。" 这 3 件事，通用 Agent 厂商做不了、做不好、做不深。' },
    { type: 'h2',    text: () => '4 个爆发方向' },
    { type: 'ul',    items: () => [
      '<strong>销售 Agent</strong>：销冠、客户成功、续费管理',
      '<strong>内容 Agent</strong>：公众号、短视频、直播脚本',
      '<strong>数据 Agent</strong>：自动报表、归因分析、异常预警',
      '<strong>研发 Agent</strong>：代码生成、Code Review、自动化测试'
    ] },
    { type: 'h2',    text: () => '机会窗口' },
    { type: 'p',     text: () => '2026-2027 是垂直 Agent 的"入场窗口"：行业 know-how 还在 PM 脑子里，AI 能力普及，数据壁垒未形成。错过这 18 个月，红利期结束。' }
  ],
  '跨界': [
    { type: 'p',     text: (a) => `${a.lead}传统文化 + AI 的合规化产品已经突破 200 万付费用户，验证了"小众 × AI = 大众"的商业逻辑。` },
    { type: 'h2',    text: () => '为什么"小众 + AI"成立？' },
    { type: 'p',     text: () => '小众市场过去受制于"专家供给不足 + 服务标准化难 + 客单价高"3 个瓶颈。AI 同时解决了这 3 个问题：无限专家供给 + 个性化标准化 + 边际成本递减。' },
    { type: 'callout', num: 1, text: () => '"小众" 的本质是 "高单价 + 低频次"。AI 让 "高单价 × 无限次" 成为可能，付费转化率反而提高。' },
    { type: 'h2',    text: () => '5 个可复制的赛道' },
    { type: 'ul',    items: () => [
      '<strong>五行风水 + AI</strong>：月活 80 万，客单价 ¥198',
      '<strong>星座占星 + AI</strong>：月活 120 万，客单价 ¥98',
      '<strong>法律咨询 + AI</strong>：月活 45 万，客单价 ¥298',
      '<strong>心理咨询 + AI</strong>：月活 30 万，客单价 ¥398',
      '<strong>宠物健康 + AI</strong>：月活 60 万，客单价 ¥158'
    ] },
    { type: 'h2',    text: () => '进入策略' },
    { type: 'p',     text: () => '不要做"通用 AI 工具"（红海），做"垂直行业的 AI 助手"（蓝海）。第一步：找到 1 个你熟悉的垂直行业；第二步：把行业专家的经验 AI 化；第三步：跑通 100 个付费用户。' }
  ],
  '日报': [
    { type: 'p',     text: (a) => `${a.lead}今日（${a.time.split(' ')[0]}）AI 行业 3 大要闻：模型发布 + 投融资 + 行业动态。` },
    { type: 'h2',    text: () => '模型发布' },
    { type: 'p',     text: () => 'Anthropic 发布 Claude 3.7 Sonnet：在长上下文（200K tokens）任务上首次超越 GPT-5，价格下降 40%。OpenAI 推出 GPT-5 mini-lite：响应速度提升 3 倍，价格仅为 GPT-5 的 1/8。' },
    { type: 'callout', num: 2, text: () => '"模型商品化"加速：基础模型同质化严重，差异化越来越靠"产品 + 数据 + 行业 know-how"。' },
    { type: 'h2',    text: () => '投融资' },
    { type: 'ul',    items: () => [
      '<strong>国内 B 轮</strong>：3 家 AI 创业公司完成 B 轮融资，合计 ¥18.7 亿（深言科技 / 智谱AI / 月之暗面）',
      '<strong>海外 A 轮</strong>：5 家垂直 Agent 公司完成 A 轮，平均 $32M',
      '<strong>战略投资</strong>：Salesforce 投资 Anthropic $4B，加深企业级合作'
    ] },
    { type: 'h2',    text: () => '行业动态' },
    { type: 'p',     text: () => '欧盟 AI Act 正式生效，对高风险 AI 系统实施准入审核。国内网信办发布《生成式 AI 服务管理暂行办法》修订版，新增"未成年人保护"专章。AI 行业进入"强监管 + 高质量发展"双轨期。' }
  ],
  '支付': [
    { type: 'p',     text: (a) => `${a.lead}稳定币正在重塑跨境支付：T+0 到账 + 0.3% 手续费 + 100 万 UMDT 单笔上限。` },
    { type: 'h2',    text: () => '为什么是稳定币？' },
    { type: 'p',     text: () => '传统跨境支付：SWIFT 中转 3-5 天 + 1.5-3% 手续费 + 复杂合规。稳定币：链上直转 30 秒 + 0.3% 手续费 + 自动合规。优势一目了然。' },
    { type: 'callout', num: 1, text: () => '"稳定币 = 跨境支付的 SWIFT 杀手。" 未来 3 年，50% 的 B2B 跨境支付将迁移到稳定币。' },
    { type: 'h2',    text: () => '3 大应用场景' },
    { type: 'ul',    items: () => [
      '<strong>B2B 贸易结算</strong>：东南亚、非洲、中东等美元稀缺地区',
      '<strong>跨境电商</strong>：Shopify、WooCommerce 已支持 UMDT 收款',
      '<strong>跨境工资发放</strong>：远程工作团队的 UMDT 工资，绕过 SWIFT'
    ] },
    { type: 'h2',    text: () => '风险与对策' },
    { type: 'p',     text: () => '稳定币风险：① 价格波动（用 UMDT/USDC 等法币型稳定币规避）② 合规风险（选择持牌机构）③ 链上安全（用多签 + 冷钱包）。Opul+ 提供完整的风控方案。' }
  ],
  '科普': [
    { type: 'p',     text: (a) => `${a.lead}UMDT 是市场老大，UMDT 是 UMC 生态稳定币。2 者的核心差异：发行方、透明度、用途。` },
    { type: 'h2',    text: () => 'UMDT 是什么？' },
    { type: 'p',     text: () => 'UMDT 由 UMC 生态背书的稳定币，1:1 兑付美元 + 链上可查 + UMakex 平台内通用。UMC 体系内消费、公益捐赠、会员服务、算力结算均以 UMDT 计价。' },
    { type: 'callout', num: 2, text: () => 'UMDT = UMC 背书 + 1:1 兑付 + 链上可查 + 生态内流通。核心差异不是"技术"，而是"信任锚"。' },
    { type: 'h2',    text: () => 'UMDT 是什么？' },
    { type: 'ul',    items: () => [
      '<strong>UMC 背书</strong>：由 UMakex 集团发行，受新加坡 MAS 监管',
      '<strong>1:1 兑付</strong>：每 1 UMT 对应 1 美元储备金，月度审计',
      '<strong>链上可查</strong>：发行量 / 流通量 / 储备金全部上链，公开透明',
      '<strong>生态内流通</strong>：UMC 生态内 8 大项目通用，可兑换 200+ 商品/服务'
    ] },
    { type: 'h2',    text: () => '如何选择？' },
    { type: 'p',     text: () => '加密交易 / DeFi 选 UMDT（流动性最好）。UMC 生态消费 / 公益捐赠 / 会员服务选 UMDT（信任锚 + 生态激励）。两者并不冲突，可同时使用。' }
  ],
  '教程': [
    { type: 'p',     text: (a) => `${a.lead}Opul+ 提供 3 种接入方式，最快 30 分钟上线，慢也只要 2 小时。` },
    { type: 'h2',    text: () => '3 步开通流程' },
    { type: 'p',     text: () => '① 注册商家账号（KYC + 银行账户绑定，10 分钟）② 选择接入方式（SDK / API / H5，5 分钟）③ 测试 + 上线（沙盒测试 15 分钟，生产上线 5 分钟）。' },
    { type: 'callout', num: 3, text: () => '"30 分钟上线"是真实数据：92% 商家在 30 分钟内完成首单 UMDT 收款。' },
    { type: 'h2',    text: () => '3 种接入方式对比' },
    { type: 'ul',    items: () => [
      '<strong>SDK 接入</strong>：原生 iOS / Android，30 分钟集成，支持 UMDT、EOS 等多币种',
      '<strong>API 接入</strong>：RESTful API，2 小时集成，30+ 字段自由组合',
      '<strong>H5 接入</strong>：无需开发，10 分钟配置，扫码即用，适合个人小商家'
    ] },
    { type: 'h2',    text: () => '常见问题' },
    { type: 'p',     text: () => 'Q：手续费多少？A：0.3%，无最低消费。Q：结算周期？A：T+0 实时结算到银行卡。Q：支持哪些币？A：UMDT、EOS，未来扩展 BTC/ETH。Q：合规吗？A：MAS 牌照 + 国内合规备案。' }
  ],
  '工具': [
    { type: 'p',     text: (a) => `${a.lead}不是 ChatGPT 不够强，是你没用对"组合拳"。5 个被严重低估的小工具，能让 ChatGPT 提升 10 倍效率。` },
    { type: 'h2',    text: () => '为什么是"小积木"？' },
    { type: 'p',     text: () => '大模型是发动机，但真正决定速度的是变速箱、轮胎、刹车。5 个小工具就是 ChatGPT 的"变速箱"——Prompt 模板 / 知识库外挂 / 任务分解器 / 答案评分器 / 工作流自动化。' },
    { type: 'callout', num: 5, text: () => '"工欲善其事，必先利其器。" 5 个工具免费 + 开箱即用，30 分钟全部接好。' },
    { type: 'h2',    text: () => '5 个工具的具体用法' },
    { type: 'ul',    items: () => [
      '<strong>Prompt 模板库</strong>：AIPRM / Snack Prompt，预置 4000+ 经过验证的提示词',
      '<strong>知识库外挂</strong>：Humata / ChatPDF，让 ChatGPT 读懂你的 PDF / 论文 / 报告',
      '<strong>任务分解器</strong>：AgentGPT / AutoGPT，把复杂任务拆成 20 步自动执行',
      '<strong>答案评分器</strong>：Poe / Vercel AI SDK，对比 4 个模型的回答选最优',
      '<strong>工作流自动化</strong>：Zapier / Make，把 ChatGPT 接到你已有的 5000+ 应用'
    ] },
    { type: 'h2',    text: () => '下一步' },
    { type: 'p',     text: () => '不要从"大而全"开始，从"工作流里最痛的 1 个环节"开始。装 1 个工具，用 7 天，看效果，再装下 1 个。30 天后你的 ChatGPT 会是同事里最懂业务的。' }
  ],
  '管理': [
    { type: 'p',     text: (a) => `${a.lead}不是 AI 替代人，是 AI 改变岗位职责。我们用 AI 半年砍掉 3 个岗位，业绩涨 47%。` },
    { type: 'h2',    text: () => '砍掉的 3 个岗位' },
    { type: 'p',     text: () => '① 基础客服（3 → 0，AI 接管 92% 咨询）② 初级文案（2 → 0，AI 接管 70% 写作）③ 数据录入员（2 → 0，AI 接管 95% 录入）。' },
    { type: 'callout', num: 47, text: () => '"AI 不是让 3 个员工失业，是让他们升级。" 客服转 AI 训练师，文案转创意总监，录入转数据分析师。' },
    { type: 'h2',    text: () => '业绩为什么涨 47%？' },
    { type: 'ul',    items: () => [
      '<strong>效率提升</strong>：重复工作时间减少 65%，员工聚焦高价值任务',
      '<strong>响应速度</strong>：客户咨询从 4 小时到 30 秒，转化率提升 22%',
      '<strong>质量提升</strong>：AI 接管后错误率从 8% 降到 1.2%',
      '<strong>成本优化</strong>：人力成本降低 28%，但同岗位薪资涨 18%（人才升级）'
    ] },
    { type: 'h2',    text: () => '给管理者的 3 个建议' },
    { type: 'p',     text: () => '① 不要"先裁人再上 AI"，要"先上 AI 再调岗"——员工感受到尊重。② 给员工 3 个月过渡期，配 AI 培训师。③ AI 不是"省人"，是"让人做更有价值的事"。' }
  ],
  '案例': [
    { type: 'p',     text: (a) => `${a.lead}真实案例 + 数据复盘，不讲故事，讲方法。每个案例都有可复用的 3 个关键动作。` },
    { type: 'h2',    text: () => '案例结构：背景 + 行动 + 结果' },
    { type: 'p',     text: () => '每个案例都按"起点（什么状态）→ 行动（做了什么）→ 关键节点（转折点）→ 结果（数字）→ 可复用点（3 个方法论）" 5 段式展开。不讲故事，只讲方法。' },
    { type: 'callout', num: 3, text: () => "\"案例的价值不是结果数字，是「为什么能做成」和「你能复用什么」。\" 每个案例都拆到原子级。" },
    { type: 'h2',    text: () => '本次案例的 3 个关键动作' },
    { type: 'ul',    items: () => [
      '<strong>关键动作 1</strong>：在低谷期找到反直觉的切入点，不随大流',
      '<strong>关键动作 2</strong>：把"个人能力"变成"组织能力"（流程化、SOP 化、AI 化）',
      '<strong>关键动作 3</strong>：从"卖时间"升级到"卖价值"，客单价提升 3-5 倍'
    ] },
    { type: 'h2',    text: () => '你也能复用的 3 个方法论' },
    { type: 'p',     text: () => '① 不要"等所有条件准备好"再开始，先做再迭代。② 把"个人英雄"变成"组织能力"是规模化的前提。③ 长期主义 ≠ 慢，而是"持续微调 + 不偏离主线"。' }
  ]
};

/* 文章 body 渲染（按 article tag 选模板 + 项目 color） */
function renderArticleBody(article, project) {
  const tmpl = BODY_TEMPLATES[article.tag] || BODY_TEMPLATES['AI'];
  return tmpl.map(block => {
    if (block.type === 'h2') return `<h2>${block.text()}</h2>`;
    if (block.type === 'p') return `<p>${block.text(article)}</p>`;
    if (block.type === 'ul') {
      return `<ul>${block.items().map(i => `<li>${i}</li>`).join('')}</ul>`;
    }
    if (block.type === 'callout') {
      return `
        <div class="oa__article-quote-block">
          <div class="oa__article-quote-num">${block.num}</div>
          <div class="oa__article-quote-content">
            <p>${block.text()}</p>
            <div class="oa__article-quote-source">— UMakex Design Principle #${block.num}</div>
          </div>
        </div>
      `;
    }
    if (block.type === 'image') {
      return `
        <div class="oa__article-image">
          <div class="oa__article-image-placeholder" style="background: linear-gradient(135deg, ${project.color}, ${shadeColor(project.color, 30)});">
            <span style="color: white; font-size: 14px; font-weight: 800;">${block.text}</span>
          </div>
          <div class="oa__article-image-caption">${block.caption}</div>
        </div>
      `;
    }
    return '';
  }).join('');
}

/* 相关推荐（同项目其他文章 + 跨项目精选 1-2 篇） */
function renderRelated(article, currentProject) {
  const sameProject = PROJECT_ARTICLES[currentProject].filter(a => a.id !== article.id);
  const others = [];
  Object.keys(PROJECTS).forEach(pid => {
    if (pid === currentProject) return;
    const arr = PROJECT_ARTICLES[pid] || [];
    if (arr.length) others.push(arr[0]);
  });
  const related = [...sameProject.slice(0, 2), ...others.slice(0, 1)];

  return related.map(a => {
    const proj = Object.keys(PROJECTS).find(pid => PROJECT_ARTICLES[pid].some(x => x.id === a.id));
    const p = PROJECTS[proj];
    return `
      <a href="oa-article.html?from=${proj}&id=${a.id}" class="oa__related-item">
        <div class="oa__related-thumb" style="background: linear-gradient(135deg, ${p.color}, ${shadeColor(p.color, 25)});">${p.icon}</div>
        <div>
          <div class="oa__related-headline">${a.title}</div>
          <div class="oa__related-meta">${a.read} 阅读 · ${a.like} 点赞 · ${p.name}</div>
        </div>
      </a>
    `;
  }).join('');
}

/* 文章详情页主渲染 */
function renderArticleDetail(fromProject, articleId) {
  // 优先按 fromProject 找，失败则全局按 articleId 找
  let articles = PROJECT_ARTICLES[fromProject] || [];
  let article = articles.find(a => a.id === articleId);
  if (!article) {
    // 全局搜
    for (const pid of Object.keys(PROJECTS)) {
      const found = (PROJECT_ARTICLES[pid] || []).find(a => a.id === articleId);
      if (found) {
        article = found;
        fromProject = pid;
        break;
      }
    }
  }
  if (!article) {
    // 兜底：取 desktop 第 1 篇
    article = PROJECT_ARTICLES.desktop[0];
    fromProject = 'desktop';
  }
  const p = PROJECTS[fromProject] || PROJECTS.desktop;

  // 标题栏
  const titleBar = document.getElementById('titleBarText');
  if (titleBar) titleBar.textContent = p.name + ' · ' + article.title;

  // 渲染文章主体
  const detailEl = document.getElementById('articleDetail');
  if (!detailEl) return;
  detailEl.innerHTML = `
    <header class="oa__article-head">
      <div class="oa__article-tags">
        <span class="oa__tag oa__tag--featured">推荐</span>
        <span class="oa__tag">${article.tag}</span>
        <span class="oa__tag">深度长文</span>
      </div>
      <h1 class="oa__article-detail-title">${article.title}</h1>
      <div class="oa__article-detail-meta">
        <div class="oa__article-author">
          <div class="oa__article-author-avatar" style="background: linear-gradient(135deg, ${p.color}, ${shadeColor(p.color, -20)});">${p.icon}</div>
          <div>
            <div class="oa__article-author-name">${p.name} 编辑部</div>
            <div class="oa__article-author-desc">${p.tag} · 已认证公众号</div>
          </div>
        </div>
        <div class="oa__article-info">
          <span>${article.time}</span>
          <span>·</span>
          <span>${article.read} 阅读</span>
          <span>·</span>
          <span>${article.like} 点赞</span>
        </div>
      </div>
    </header>

    <div class="oa__article-content">
      <p class="oa__article-lead">${article.lead} 本文从产品架构、用户行为、技术实现 3 个角度，拆解背后的设计逻辑与可复用方法论。</p>
      ${renderArticleBody(article, p)}
      <p class="oa__article-signature">— ${p.name} 编辑部 / ${article.time.split(' ')[0]}</p>
    </div>

    <div class="oa__article-actions">
      <button class="oa__action-btn oa__action-btn--primary" type="button">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M7 10v12M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H7L4.27 4.13A1 1 0 0 0 3.27 3H2"/></svg>
        <span>点赞</span>
        <span class="oa__action-num">${article.like}</span>
      </button>
      <button class="oa__action-btn" type="button">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M2 9V4a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-7l-5 4v-4H4a2 2 0 0 1-2-2z"/></svg>
        <span>评论</span>
        <span class="oa__action-num">${Math.floor(parseFloat(article.like) * 0.23)}</span>
      </button>
      <button class="oa__action-btn" type="button">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.59 13.51 6.83 3.98M15.41 6.51l-6.82 3.98"/></svg>
        <span>分享</span>
      </button>
      <button class="oa__action-btn" type="button">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
        <span>收藏</span>
      </button>
    </div>

    <div class="oa__article-related">
      <div class="oa__related-title">相关推荐</div>
      <div class="oa__related-list">
        ${renderRelated(article, fromProject)}
      </div>
    </div>
  `;
}

/* ============================================================
 * 通用交互（不依赖 GSAP）
 * ============================================================ */
function bindInteractions(page) {
  // 主页：项目卡点击跳转 + inline 关注按钮 + localStorage 持久化
  if (page === 'home') {
    document.querySelectorAll('.oa__project-card[data-project]').forEach(card => {
      const pid = card.dataset.project;
      // 从 localStorage 恢复关注状态
      const followBtn = card.querySelector('.oa__project-card__follow');
      const bell = card.querySelector('.oa__project-card__bell');
      if (followBtn) {
        if (isFollowed(pid)) {
          followBtn.classList.add('is-followed');
          followBtn.textContent = '✓ 已关注';
          if (bell) bell.classList.add('is-active');
        }
        followBtn.addEventListener('click', (e) => {
          e.stopPropagation(); // 不触发卡跳转
          const willFollow = !followBtn.classList.contains('is-followed');
          followBtn.classList.toggle('is-followed', willFollow);
          followBtn.textContent = willFollow ? '✓ 已关注' : '+ 关注';
          if (bell) {
            bell.classList.toggle('is-active', willFollow);
            const badge = bell.querySelector('.oa__project-card__bell-badge');
            if (badge) badge.textContent = willFollow ? (NEW_ARTICLES_COUNT[pid] || 1) : '0';
          }
          setFollowed(pid, willFollow);
          // GSAP 弹性反馈
          if (typeof gsap !== 'undefined' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            gsap.fromTo(followBtn, { scale: 0.92 }, { scale: 1, duration: 0.3, ease: 'power2.out', clearProps: 'transform' });
            if (willFollow && bell) {
              gsap.fromTo(bell, { scale: 0.5, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.6)', clearProps: 'transform,opacity' });
            }
          }
        });
      }
      // 卡点击跳转（关注按钮 click 已被 stopPropagation，不会触发）
      card.addEventListener('click', () => {
        window.location.href = 'oa-project.html?id=' + encodeURIComponent(pid);
      });
    });
  }

  // 项目文章列表页：动态渲染 hero + 文章 + 文章卡 click 跳转详情
  if (page === 'project') {
    const params = new URLSearchParams(window.location.search);
    const pid = params.get('id') || 'desktop';
    const project = PROJECTS[pid] || PROJECTS.desktop;
    const articles = PROJECT_ARTICLES[pid] || PROJECT_ARTICLES.desktop;
    const newCount = NEW_ARTICLES_COUNT[pid] || 0;
    const PAGE_SIZE = 3;
    let loadedCount = Math.min(PAGE_SIZE, articles.length);

    // 从 localStorage 恢复关注状态（与主页同步）
    const wasFollowed = isFollowed(pid);

    // 标题栏
    const titleBar = document.getElementById('titleBarText');
    if (titleBar) titleBar.textContent = project.name + ' · 项目文章';

    // 渲染 hero
    const heroEl = document.getElementById('projectHero');
    if (heroEl) {
      heroEl.innerHTML = `
        <div class="oa__proj-hero__icon" style="background: linear-gradient(135deg, ${project.color}, ${shadeColor(project.color, -20)});">${project.icon}</div>
        <div class="oa__proj-hero__body">
          <span class="oa__proj-hero__tag">${project.tag}</span>
          <div class="oa__proj-hero__name">${project.name}</div>
          <div class="oa__proj-hero__desc">${project.desc}</div>
          <div class="oa__proj-hero__stats">
            <span class="oa__proj-hero__stat"><strong>${project.articles}</strong>篇文章</span>
            <span class="oa__proj-hero__stat"><strong>${project.reads}</strong>总阅读</span>
            <span class="oa__proj-hero__stat"><strong>${project.followers}</strong>关注者</span>
          </div>
          <div class="oa__proj-hero__live" id="liveHint">实时推送新文章已开启</div>
        </div>
        <div class="oa__proj-hero__actions">
          <button class="oa__proj-hero__btn oa__proj-hero__btn--primary" type="button" id="followBtn">+ 关注</button>
          <button class="oa__proj-hero__btn oa__proj-hero__btn--secondary" type="button">分享项目</button>
        </div>
      `;
    }

    // 标题栏铃铛 + 角标
    const bell = document.getElementById('titleBarBell');
    const bellBadge = document.getElementById('titleBarBellBadge');
    if (bell) bell.hidden = true;

    // 渲染文章卡（共用函数）
    function renderArticleCards(count) {
      const listEl = document.getElementById('projectArticleList');
      if (!listEl) return;
      if (articles.length === 0) {
        listEl.innerHTML = `
          <div class="oa__proj-empty">
            <div class="oa__proj-empty__icon">📭</div>
            <div class="oa__proj-empty__title">该项目暂无文章</div>
            <div class="oa__proj-empty__desc">切换到其他项目看看 →</div>
          </div>
        `;
        return;
      }
      const toShow = articles.slice(0, count);
      listEl.innerHTML = toShow.map((a, i) => `
        <a href="oa-article.html?from=${pid}&id=${a.id}" class="oa__proj-article-card" data-aid="${a.id}">
          <div class="oa__proj-article-card__cover" style="background: linear-gradient(135deg, ${project.color}${i % 2 ? 'CC' : '22'}, ${shadeColor(project.color, i % 2 ? -20 : 10)});">
            ${a.new ? '<span class="oa__proj-article-card__new">NEW</span>' : ''}
            <span class="oa__proj-article-card__cover-icon">${project.icon}</span>
            <span class="oa__proj-article-card__cover-tag">${a.tag}</span>
          </div>
          <div class="oa__proj-article-card__body">
            <div class="oa__proj-article-card__title">${a.title}</div>
            <div class="oa__proj-article-card__lead">${a.lead}</div>
            <div class="oa__proj-article-card__meta">
              <span class="oa__proj-article-card__time">${a.time}</span>
              <span class="oa__proj-article-card__dot">·</span>
              <span>${a.read} 阅读</span>
              <span class="oa__proj-article-card__dot">·</span>
              <span>${a.like} 点赞</span>
            </div>
          </div>
        </a>
      `).join('');
    }

    // 加载更多按钮状态
    function updateLoadMore() {
      const btn = document.getElementById('loadMoreBtn');
      if (!btn) return;
      if (articles.length <= PAGE_SIZE) {
        btn.hidden = true;
        return;
      }
      btn.hidden = false;
      const countEl = btn.querySelector('.oa__load-more__count');
      if (loadedCount >= articles.length) {
        btn.classList.add('is-done');
        btn.querySelector('.oa__load-more__text').textContent = '已加载全部文章';
        btn.querySelector('.oa__load-more__arrow').style.display = 'none';
        if (countEl) countEl.textContent = `${articles.length} / ${articles.length}`;
      } else {
        btn.classList.remove('is-done');
        btn.querySelector('.oa__load-more__text').textContent = '加载更多文章';
        btn.querySelector('.oa__load-more__arrow').style.display = '';
        if (countEl) countEl.textContent = `${loadedCount} / ${articles.length}`;
      }
    }

    // 初始渲染
    renderArticleCards(loadedCount);
    updateLoadMore();

    // 加载更多
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    if (loadMoreBtn) {
      loadMoreBtn.addEventListener('click', () => {
        if (loadedCount >= articles.length) return;
        const before = loadedCount;
        loadedCount = Math.min(loadedCount + PAGE_SIZE, articles.length);
        renderArticleCards(loadedCount);
        updateLoadMore();
        if (typeof gsap !== 'undefined' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          const newCards = Array.from(document.querySelectorAll('.oa__proj-article-card')).slice(before);
          gsap.fromTo(newCards,
            { opacity: 0, x: -12 },
            { opacity: 1, x: 0, duration: 0.4, ease: 'power3.out', stagger: 0.06, clearProps: 'transform,opacity' }
          );
        }
      });
    }

    // 关注按钮 toggle → 联动标题栏铃铛 + hero 实时推送提示 + 写 localStorage
    const followBtn = document.getElementById('followBtn');
    if (followBtn) {
      // 从 localStorage 恢复初始状态
      if (wasFollowed) {
        followBtn.classList.add('is-followed');
        followBtn.textContent = '✓ 已关注';
        const liveHint0 = document.getElementById('liveHint');
        if (liveHint0) liveHint0.classList.add('is-show');
        if (bell) {
          bell.hidden = false;
          bell.classList.add('is-active');
        }
        if (bellBadge) bellBadge.textContent = newCount > 0 ? String(newCount) : '0';
      }
      followBtn.addEventListener('click', () => {
        const isFollowedNow = followBtn.classList.toggle('is-followed');
        followBtn.textContent = isFollowedNow ? '✓ 已关注' : '+ 关注';
        if (typeof gsap !== 'undefined' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          gsap.fromTo(followBtn, { scale: 0.92 }, { scale: 1, duration: 0.3, ease: 'power2.out', clearProps: 'transform' });
        }
        // 联动：标题栏铃铛 + 角标 + hero 实时推送提示
        const liveHint = document.getElementById('liveHint');
        if (bell) {
          bell.hidden = !isFollowedNow;
          bell.classList.toggle('is-active', isFollowedNow);
        }
        if (bellBadge) {
          bellBadge.textContent = (isFollowedNow && newCount > 0) ? String(newCount) : '0';
        }
        if (liveHint) {
          liveHint.classList.toggle('is-show', isFollowedNow);
        }
        // 关注时也来一次"推送"动画
        if (isFollowedNow && typeof gsap !== 'undefined' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          const newCards = document.querySelectorAll('.oa__proj-article-card__new');
          if (newCards.length) {
            gsap.fromTo(newCards, { scale: 0.5, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.6)', stagger: 0.08, clearProps: 'transform,opacity' });
          }
        }
        // 写 localStorage（与主页同步）
        setFollowed(pid, isFollowedNow);
      });
    }

    // 标题栏铃铛 click → 跳转回列表
    if (bell) {
      bell.addEventListener('click', () => {
        if (bellBadge) bellBadge.style.opacity = '0.3';
        if (typeof gsap !== 'undefined' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          gsap.fromTo(bell, { rotate: 0 }, { rotate: 15, duration: 0.1, yoyo: true, repeat: 3, ease: 'power2.inOut', clearProps: 'rotate' });
        }
      });
    }

    // chip 切换
    document.querySelectorAll('.oa__chip').forEach(chip => {
      chip.addEventListener('click', () => {
        document.querySelectorAll('.oa__chip').forEach(c => c.classList.remove('is-active'));
        chip.classList.add('is-active');
      });
    });
  }

  // 数据洞察：项目维度 view 切换
  if (page === 'analytics') {
    const dimChips = document.querySelectorAll('.oa__chip[data-dim]');
    const views = document.querySelectorAll('.oa__analytics-view');
    if (dimChips.length && views.length) {
      dimChips.forEach(chip => {
        chip.addEventListener('click', () => {
          dimChips.forEach(c => c.classList.remove('is-active'));
          chip.classList.add('is-active');
          const dim = chip.dataset.dim;
          views.forEach(v => {
            if (v.dataset.view === dim) v.removeAttribute('hidden');
            else v.setAttribute('hidden', '');
          });
          // 切到项目维度时渲染内容
          if (dim === 'project') {
            renderProjectAnalytics('followers');
          }
        });
      });
    }
    // 排序切换
    const sortChips = document.querySelectorAll('.oa__chip[data-sort]');
    sortChips.forEach(chip => {
      chip.addEventListener('click', () => {
        sortChips.forEach(c => c.classList.remove('is-active'));
        chip.classList.add('is-active');
        renderProjectAnalytics(chip.dataset.sort);
      });
    });
  }

  // 菜单管理：subtab 切换
  const subtabMap = {
    '关键词回复': 'keywords',
    '被关注回复': 'subscribe',
    '客服消息': 'service',
    '留言管理': 'messages',
    '群发任务': 'broadcast'
  };
  const subtabs = document.querySelectorAll('.oa__subtab-item');
  const subpanels = document.querySelectorAll('.oa__subpanel');
  if (subtabs.length && subpanels.length) {
    subtabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const key = subtabMap[tab.textContent.trim()];
        if (!key) return;
        subtabs.forEach(t => t.classList.remove('is-active'));
        tab.classList.add('is-active');
        subpanels.forEach(p => {
          if (p.dataset.sub === key) p.setAttribute('is-active', '');
          else p.removeAttribute('is-active');
        });
        // 留言视图入场
        if (key === 'messages' && typeof gsap !== 'undefined' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          const kpiCards = document.querySelectorAll('.oa__msg-kpi-card');
          const msgItems = document.querySelectorAll('.oa__msg-item');
          if (kpiCards.length) {
            gsap.fromTo(kpiCards, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.4, ease: 'power3.out', stagger: 0.06, clearProps: 'transform,opacity' });
          }
          if (msgItems.length) {
            gsap.fromTo(msgItems, { opacity: 0, x: -8 }, { opacity: 1, x: 0, duration: 0.4, ease: 'power3.out', stagger: 0.05, delay: 0.2, clearProps: 'transform,opacity' });
          }
        }
      });
    });
    // 留言点击切换 active
    document.querySelectorAll('.oa__msg-item').forEach(item => {
      item.addEventListener('click', () => {
        document.querySelectorAll('.oa__msg-item').forEach(i => i.classList.remove('is-active'));
        item.classList.add('is-active');
        const id = item.dataset.id || '1';
        const name = item.querySelector('.oa__msg-name')?.textContent;
        const tag = item.querySelector('.oa__msg-tag')?.textContent;
        const time = item.querySelector('.oa__msg-time')?.textContent;
        const text = item.querySelector('.oa__msg-text')?.textContent;
        if (name) {
          const head = document.querySelector('.oa__msg-reply-meta');
          if (head) head.textContent = name + ' · ' + tag + ' · ' + time;
        }
        // 更新用户留言文本
        const replyText = document.querySelector('.oa__msg-reply-text');
        if (replyText && text) replyText.textContent = text;
        // 渲染 AI 智能回复建议
        renderMsgAiSuggest(id, text);
        if (typeof gsap !== 'undefined' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          gsap.fromTo('.oa__msg-reply', { opacity: 0, x: 8 }, { opacity: 1, x: 0, duration: 0.3, ease: 'power3.out', clearProps: 'transform,opacity' });
        }
      });
    });

    // AI 智能回复建议：重新生成
    const msgAiRefreshBtn = document.getElementById('msgAiRefresh');
    if (msgAiRefreshBtn) {
      msgAiRefreshBtn.addEventListener('click', () => {
        const activeItem = document.querySelector('.oa__msg-item.is-active');
        const id = activeItem?.dataset?.id || '1';
        const text = activeItem?.querySelector('.oa__msg-text')?.textContent;
        renderMsgAiSuggest(id, text, true);
      });
    }

    // 客户消息：AI 客户专家 banner 模式切换
    const csAiModes = document.querySelectorAll('.oa__cs-ai-mode');
    csAiModes.forEach(m => {
      m.addEventListener('click', () => {
        csAiModes.forEach(x => x.classList.remove('is-active'));
        m.classList.add('is-active');
        const mode = m.dataset.mode;
        const modeLabel = document.getElementById('csAiModeLabel');
        if (modeLabel) modeLabel.textContent = mode === 'auto' ? '全自动' : '半自动';
      });
    });

    // AI 客户专家 modal
    initCsAiModal();
  }

  // 默认渲染留言 1 的 AI 建议
  if (page === 'menu' && document.querySelector('.oa__subpanel[data-sub=messages]')) {
    setTimeout(() => {
      const item = document.querySelector('.oa__msg-item.is-active');
      const text = item?.querySelector('.oa__msg-text')?.textContent;
      renderMsgAiSuggest(item?.dataset?.id || '1', text);
    }, 100);
  }

  // 文章详情：动态渲染（根据 ?from + ?id）
  if (page === 'article') {
    const params = new URLSearchParams(window.location.search);
    const from = params.get('from') || 'desktop';
    const aid = params.get('id') || 'd1';
    renderArticleDetail(from, aid);
  }
}

/* ============================================================
 * 颜色加深 / 减淡工具
 * ============================================================ */
function shadeColor(hex, percent) {
  // hex: #RRGGBB, percent: -100..100
  let R = parseInt(hex.substring(1, 3), 16);
  let G = parseInt(hex.substring(3, 5), 16);
  let B = parseInt(hex.substring(5, 7), 16);
  R = Math.max(0, Math.min(255, Math.floor(R * (100 + percent) / 100)));
  G = Math.max(0, Math.min(255, Math.floor(G * (100 + percent) / 100)));
  B = Math.max(0, Math.min(255, Math.floor(B * (100 + percent) / 100)));
  const toHex = n => n.toString(16).padStart(2, '0');
  return '#' + toHex(R) + toHex(G) + toHex(B);
}

/* ============================================================
 * 8 项目分析视图渲染
 * ============================================================ */
function renderProjectAnalytics(sortBy) {
  // 计算每个项目综合数据
  const data = Object.keys(PROJECTS).map(pid => {
    const proj = PROJECTS[pid];
    const a = PROJECT_ANALYTICS[pid] || {};
    return {
      pid, name: proj.name, tag: proj.tag, color: proj.color, icon: proj.icon,
      followers: parseInt((proj.followers + '').replace(/,/g, '')) || 0,
      reads7d: a.reads7d || 0,
      newFollowers7d: a.newFollowers7d || 0,
      conversionRate: a.conversionRate || 0,
      sparkline: a.sparkline || [0, 0, 0, 0, 0, 0, 0]
    };
  });

  // 排序
  const sorted = [...data].sort((a, b) => b[sortBy] - a[sortBy]);
  // 分配排名
  sorted.forEach((d, i) => d.rank = i + 1);

  // 渲染总览 4 KPI（按当前排序计算 top 1）
  const kpiEl = document.getElementById('projectKpi');
  if (kpiEl) {
    const top = sorted[0];
    const totalNew = data.reduce((s, d) => s + d.newFollowers7d, 0);
    const totalReads = data.reduce((s, d) => s + d.reads7d, 0);
    const avgConv = data.reduce((s, d) => s + d.conversionRate, 0) / data.length;
    kpiEl.innerHTML = `
      <div class="oa__kpi-card">
        <div class="oa__kpi-label">冠军项目</div>
        <div class="oa__kpi-num" style="font-size: 18px;">${top.icon} ${top.name.slice(0, 8)}</div>
        <div class="oa__kpi-trend oa__kpi-trend--up">↑ 排名第 1 <span>${formatNum(top[sortBy])}</span></div>
      </div>
      <div class="oa__kpi-card">
        <div class="oa__kpi-label">7 天新增关注</div>
        <div class="oa__kpi-num">${formatNum(totalNew)}</div>
        <div class="oa__kpi-trend oa__kpi-trend--up">↑ 8 项目合计 <span>平均 +${Math.round(totalNew / 8)}</span></div>
      </div>
      <div class="oa__kpi-card">
        <div class="oa__kpi-label">7 天总阅读</div>
        <div class="oa__kpi-num">${totalReads.toFixed(1)}w</div>
        <div class="oa__kpi-trend oa__kpi-trend--up">↑ 8 项目合计 <span>日均 ${(totalReads / 7).toFixed(1)}w</span></div>
      </div>
      <div class="oa__kpi-card">
        <div class="oa__kpi-label">平均转化率</div>
        <div class="oa__kpi-num">${avgConv.toFixed(1)}%</div>
        <div class="oa__kpi-trend oa__kpi-trend--up">↑ 较上周 +0.4% <span>8 项目均值</span></div>
      </div>
    `;
    // KPI count-up
    kpiEl.querySelectorAll('.oa__kpi-num').forEach((el, idx) => {
      const text = el.textContent.trim();
      const m = text.match(/^([\d.,]+)/);
      if (!m) return;
      const target = parseFloat(m[1].replace(/,/g, ''));
      if (isNaN(target)) return;
      const obj = { v: 0 };
      gsap.to(obj, {
        v: target, duration: 1.2, delay: idx * 0.08, ease: 'power2.out',
        onUpdate: function() { el.textContent = el.textContent.replace(/^[\d.,]+/, obj.v.toFixed(target < 10 ? 1 : 0)); }
      });
    });
  }

  // 渲染 8 项目分析卡（2x4 网格）
  const gridEl = document.getElementById('projectAnalyticsGrid');
  if (gridEl) {
    gridEl.innerHTML = sorted.map(d => {
      const rankBadge = d.rank === 1 ? '🥇' : d.rank === 2 ? '🥈' : d.rank === 3 ? '🥉' : d.rank;
      const isTop3 = d.rank <= 3;
      // sparkline SVG
      const sparkW = 100, sparkH = 28, sparkPad = 2;
      const max = Math.max(...d.sparkline);
      const min = Math.min(...d.sparkline);
      const range = max - min || 1;
      const points = d.sparkline.map((v, i) => {
        const x = (i / (d.sparkline.length - 1)) * (sparkW - 2 * sparkPad) + sparkPad;
        const y = sparkH - sparkPad - ((v - min) / range) * (sparkH - 2 * sparkPad);
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      }).join(' ');
      const lastPoint = d.sparkline[d.sparkline.length - 1];
      const trend = d.sparkline[6] > d.sparkline[0] ? '↑' : d.sparkline[6] < d.sparkline[0] ? '↓' : '→';
      const trendColor = trend === '↑' ? '#07C160' : trend === '↓' ? '#E85D5D' : '#888';
      return `
        <a href="oa-project.html?id=${d.pid}" class="oa__proj-analytics-card ${isTop3 ? 'is-top' : ''}" style="--proj-color: ${d.color};">
          <div class="oa__proj-analytics-card__head">
            <div class="oa__proj-analytics-card__rank">${rankBadge}</div>
            <div class="oa__proj-analytics-card__icon" style="background: linear-gradient(135deg, ${d.color}, ${shadeColor(d.color, -20)});">${d.icon}</div>
            <div class="oa__proj-analytics-card__title-wrap">
              <div class="oa__proj-analytics-card__name">${d.name}</div>
              <div class="oa__proj-analytics-card__tag">${d.tag}</div>
            </div>
          </div>
          <div class="oa__proj-analytics-card__kpis">
            <div class="oa__proj-analytics-card__kpi">
              <div class="oa__proj-analytics-card__kpi-label">关注数</div>
              <div class="oa__proj-analytics-card__kpi-num">${formatNum(d.followers)}</div>
            </div>
            <div class="oa__proj-analytics-card__kpi">
              <div class="oa__proj-analytics-card__kpi-label">7 天阅读</div>
              <div class="oa__proj-analytics-card__kpi-num">${d.reads7d}w</div>
            </div>
            <div class="oa__proj-analytics-card__kpi">
              <div class="oa__proj-analytics-card__kpi-label">转化率</div>
              <div class="oa__proj-analytics-card__kpi-num">${d.conversionRate}%</div>
            </div>
            <div class="oa__proj-analytics-card__kpi">
              <div class="oa__proj-analytics-card__kpi-label">新增</div>
              <div class="oa__proj-analytics-card__kpi-num" style="color: #07C160;">+${d.newFollowers7d}</div>
            </div>
          </div>
          <div class="oa__proj-analytics-card__sparkline">
            <svg viewBox="0 0 ${sparkW} ${sparkH}" preserveAspectRatio="none" style="width: 100%; height: 28px;">
              <polyline points="${points}" fill="none" stroke="${d.color}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span class="oa__proj-analytics-card__sparkline-trend" style="color: ${trendColor};">${trend} 7 天</span>
          </div>
        </a>
      `;
    }).join('');
  }

  // 渲染项目对比表（按总阅读排序）
  const tableEl = document.getElementById('projectTable');
  if (tableEl) {
    const byReads = [...data].sort((a, b) => b.reads7d - a.reads7d);
    const maxReads = byReads[0].reads7d;
    tableEl.innerHTML = `
      <div class="oa__project-table__head">
        <div class="oa__project-table__col oa__project-table__col--name">项目</div>
        <div class="oa__project-table__col">关注数</div>
        <div class="oa__project-table__col">7 天阅读</div>
        <div class="oa__project-table__col">新增</div>
        <div class="oa__project-table__col">转化率</div>
        <div class="oa__project-table__col oa__project-table__col--bar">阅读占比</div>
      </div>
      ${byReads.map(d => `
        <div class="oa__project-table__row">
          <div class="oa__project-table__col oa__project-table__col--name">
            <div class="oa__project-table__icon" style="background: linear-gradient(135deg, ${d.color}, ${shadeColor(d.color, -20)});">${d.icon}</div>
            <div>
              <div class="oa__project-table__name">${d.name}</div>
              <div class="oa__project-table__sub">${d.tag}</div>
            </div>
          </div>
          <div class="oa__project-table__col">${formatNum(d.followers)}</div>
          <div class="oa__project-table__col">${d.reads7d}w</div>
          <div class="oa__project-table__col" style="color: #07C160;">+${d.newFollowers7d}</div>
          <div class="oa__project-table__col">${d.conversionRate}%</div>
          <div class="oa__project-table__col oa__project-table__col--bar">
            <div class="oa__project-table__bar-track">
              <div class="oa__project-table__bar-fill" style="width: ${(d.reads7d / maxReads * 100).toFixed(1)}%; background: linear-gradient(90deg, ${d.color}, ${shadeColor(d.color, 20)});"></div>
            </div>
            <span class="oa__project-table__bar-pct">${(d.reads7d / maxReads * 100).toFixed(0)}%</span>
          </div>
        </div>
      `).join('')}
    `;
    // 进度条 GSAP 动画
    tableEl.querySelectorAll('.oa__project-table__bar-fill').forEach((bar, idx) => {
      const w = bar.style.width;
      gsap.set(bar, { width: '0%' });
      gsap.to(bar, { width: w, duration: 1.0, delay: 0.4 + idx * 0.06, ease: 'power3.out' });
    });
  }

  // GSAP 卡片 stagger 滑入
  if (typeof gsap !== 'undefined' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches && gridEl) {
    const cards = gridEl.querySelectorAll('.oa__proj-analytics-card');
    if (cards.length) {
      gsap.fromTo(cards, { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out', stagger: 0.06, clearProps: 'transform,opacity' });
    }
    const rows = tableEl?.querySelectorAll('.oa__project-table__row') || [];
    if (rows.length) {
      gsap.fromTo(rows, { opacity: 0, x: -8 },
        { opacity: 1, x: 0, duration: 0.4, ease: 'power3.out', stagger: 0.04, delay: 0.3, clearProps: 'transform,opacity' });
    }
  }
}

function formatNum(n) {
  if (n >= 10000) return (n / 10000).toFixed(1) + 'w';
  return n.toLocaleString('en-US');
}

/* ============================================================
 * V5：AI 智能回复建议（留言管理）— 6 留言 × 3 建议
 * ============================================================ */
const MSG_AI_SUGGESTS = {
  '1': [ // 小明 - 功能咨询
    { match: 93, tag: '功能咨询', content: '感谢关注！个人用户注册即可使用基础功能，含 5 位专家 Agent + 1,000 token 免费额度。无需企业版。注册后访问 desk.umakex.com → 选「免费试用」即可。' },
    { match: 87, tag: '引导试用', content: '您好～注册流程很简单：① desk.umakex.com 注册 → ② 邮箱验证 → ③ 进入工作台。1 分钟搞定，建议先注册体验 7 天免费版。' },
    { match: 78, tag: '加微信', content: 'Hi～我让顾问加您微信，1v1 帮您开通账号并赠送 5,000 token 试用额度（约 50 次专家调用）。' }
  ],
  '2': [ // 王经理 - Token 定价
    { match: 95, tag: '价格咨询', content: '王经理您好，30 人团队推荐 VIP 套餐：¥698/人/月，含 9 折 + 5,000 token 月赠。30 人月总 ¥20,940，对比原价节省 ¥3,720。详见 desk.umakex.com/pricing。' },
    { match: 84, tag: '企业方案', content: '30 人团队可以申请企业版方案，享专属客户经理 + 1v1 部署培训 + SLA 保障。是否方便约个 30 分钟 demo？' },
    { match: 76, tag: '加微信', content: '您好～加您微信，把详细价目表 + ROI 计算器发您，5 分钟看清成本。' }
  ],
  '3': [ // Lisa - 销冠接入企微
    { match: 92, tag: '功能咨询', content: 'Lisa 您好，销冠专家已支持企业微信集成，需要在 V3.2+ 版本开启"外部对接"功能。配置流程约 30 分钟，我让技术对接您。' },
    { match: 86, tag: '方案', content: '企微集成方案：① 申请 API 权限 ② 绑定 corp_id ③ 配置消息回调。全程技术协助。文档：desk.umakex.com/docs/wecom。' },
    { match: 73, tag: '加微信', content: '加您微信，1v1 帮您配置企微集成，1 小时内上线。' }
  ],
  '4': [ // 陈博士 - 合作咨询
    { match: 96, tag: '合作邀请', content: '陈博士您好！非常荣幸。"传统玄学的 AI 解读"是我们重点研究课题。建议约 1 小时线下交流，由我和产品总监一起接待您，方便吗？' },
    { match: 88, tag: '项目合作', content: '我安排项目经理对接您，可以先做联合实验课题：① 选 1 个细分领域（如八字）② 用 AI 解读 1,000 个真实案例 ③ 输出学术论文。' },
    { match: 81, tag: '高层对接', content: '这种跨学科合作需要高层支持，我把您的留言同步给 CEO 和 CTO 博士，48 小时内给您正式回复。' }
  ],
  '5': [ // 赵老师 - 学生认证
    { match: 94, tag: '流程说明', content: '赵老师您好！学生认证 3 步：① 上传学生证 / 学信网截图 ② 填写学校 + 专业 + 学号 ③ 1-3 工作日审核。审核通过享 6 折 + 月赠 1,000 token。' },
    { match: 82, tag: '材料清单', content: '需要的材料：① 学生证照片（含姓名 + 学校 + 学号）② 学信网在线学籍验证报告（PDF）③ 身份证正反面。仅需 5 分钟。' },
    { match: 75, tag: '快速通道', content: '我现在帮您加急处理，30 分钟内出结果。请把学生证发到 edu@umakex.com，标题写"学生认证+赵老师"。' }
  ],
  '6': [ // 待回复留言 - 价格对比
    { match: 91, tag: '产品对比', content: '您好，UMC 对比同类产品有 3 大优势：① 8 位专家 Agent 协同（其他家一般只有 1-2 个）② 算力成本低 30% ③ 销冠专家转化率提升 12%。' },
    { match: 84, tag: '案例', content: '可以参考 B 端案例：某 200 人销售团队用 UMC 3 个月，转化率从 12% 涨到 23%，ROI 4.7 倍。详细方案发您参考。' },
    { match: 77, tag: '试用邀请', content: '可以先免费试用 7 天，横向对比后再决定。我帮您开通账号，30 分钟内可以体验全部功能。' }
  ]
};

function renderMsgAiSuggest(msgId, userText, refresh = false) {
  const list = document.getElementById('msgAiList');
  if (!list) return;
  // 基础建议（从字典读）
  let suggests = (MSG_AI_SUGGESTS[msgId] || MSG_AI_SUGGESTS['1']).slice();
  // 如果是"重新生成"——微调 match % 制造"重新生成"的感觉
  if (refresh) {
    suggests = suggests.map(s => {
      const newMatch = Math.max(70, Math.min(99, s.match + (Math.random() * 10 - 5) | 0));
      return { ...s, match: newMatch };
    });
  }
  // 渲染
  list.innerHTML = suggests.map(s => {
    const isMid = s.match < 85;
    return `
      <div class="oa__msg-ai-suggest" data-suggest="${s.match}">
        <div class="oa__msg-ai-suggest__head">
          <span class="oa__msg-ai-suggest__match ${isMid ? 'oa__msg-ai-suggest__match--mid' : ''}">${s.match}% 匹配</span>
          <span class="oa__msg-ai-suggest__tag">${s.tag}</span>
        </div>
        <div class="oa__msg-ai-suggest__content">${s.content}</div>
        <button class="oa__msg-ai-suggest__use" type="button">使用此回复</button>
      </div>
    `;
  }).join('');
  // 绑定"使用此回复" click
  list.querySelectorAll('.oa__msg-ai-suggest__use').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const content = btn.closest('.oa__msg-ai-suggest').querySelector('.oa__msg-ai-suggest__content').textContent;
      const ta = document.querySelector('.oa__msg-reply-input');
      if (ta) {
        ta.value = content;
        ta.focus();
        if (typeof gsap !== 'undefined' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          gsap.fromTo(ta, { boxShadow: '0 0 0 3px rgba(124, 92, 255, 0.3)' }, { boxShadow: '0 0 0 0 rgba(124, 92, 255, 0)', duration: 0.8, ease: 'power2.out' });
        }
      }
    });
  });
  // 更新 count
  const count = document.getElementById('msgAiCount');
  if (count) count.textContent = '3 条 · 基于历史 + 关键词';
  // 入场动画
  if (typeof gsap !== 'undefined' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const cards = list.querySelectorAll('.oa__msg-ai-suggest');
    if (cards.length) {
      gsap.fromTo(cards, { opacity: 0, x: -8 },
        { opacity: 1, x: 0, duration: 0.4, ease: 'power3.out', stagger: 0.05, clearProps: 'transform,opacity' });
    }
  }
}

/* ============================================================
 * V5：AI 客户专家 modal（仿销冠专家）
 * ============================================================ */
const CS_AI_TEMPLATES = [
  { name: '询问功能', content: '"您想了解哪方面的功能？AI 协同 / 销冠 / 品牌 / 写作 / 数据分析？" 引导到具体功能 demo。', stat: '命中率 87%' },
  { name: '询问价格', content: '"VIP ¥698/人/月 · 9 折 + 5,000 token 月赠 · MN ¥1,980 7 折 + 20,000 token" 直接报价 + 引导算 ROI。', stat: '命中率 92%' },
  { name: '询问试用', content: '"可以先免费体验 7 天，30 分钟内开通。我把账号密码发您短信" 立即行动 + 降低决策成本。', stat: '命中率 89%' },
  { name: '技术故障', content: '"非常抱歉给您带来困扰。我马上协调技术排查，30 分钟内给您明确回复，并补偿 1,000 token" 致歉 + 兜底。', stat: '满意度 97%' },
  { name: '退款请求', content: '"退款流程 3-5 工作日到账。先为您查询订单状态..." 立刻执行 + 减少焦虑。', stat: '满意度 95%' },
  { name: '商务合作', content: '"我把您的需求同步给 BD 经理 张经理 (微信: zhang@umakex.com) · 24 小时内对接您" 高层对接。', stat: '转化率 78%' }
];

const CS_AI_SCRIPT = [
  { in: '王', text: '你好，想问下 UMC 跟我们公司现在的 CRM 怎么对接？', delay: 200 },
  { out: '您', text: '您好～UMC 支持 Webhook / RESTful API 两种对接方式，平均对接周期 1-2 周。我让技术经理加您微信给您详细方案。', delay: 1200 },
  { in: '王', text: '好的。我们 200 人销售团队，CRM 用 Salesforce。', delay: 4000 },
  { out: '您', text: 'Salesforce 对接 UMC 是热门场景，过去 6 个月有 23 家上市公司用这套组合，转化率平均提升 18%。要不要约个 30 分钟 demo？', delay: 1200 },
  { in: '王', text: '行，demo 主要看什么？', delay: 4000 },
  { out: '您', text: '3 部分：① UMC 工作流演示 ② Salesforce 集成实操 ③ ROI 计算（基于您团队规模预估）', delay: 1200 },
  { in: '王', text: '可以，麻烦安排下周二下午', delay: 4000 },
  { out: '您', text: '好的，我帮您预约下周二 14:00-14:30 视频会议，议程稍后发您邮箱。📅', delay: 1200 }
];

function initCsAiModal() {
  const modal = document.getElementById('csAiModal');
  const openBtn = document.getElementById('csAiOpenBtn');
  const closeBtn = document.getElementById('csAiCloseBtn');
  const backdrop = document.getElementById('csAiBackdrop');
  const pauseBtn = document.getElementById('csAiPauseBtn');
  const restartBtn = document.getElementById('csAiRestartBtn');
  const openMsgBtn = document.getElementById('csAiOpenMessagesBtn');
  if (!modal || !openBtn) return;

  // 渲染 6 模板
  const tList = document.getElementById('csAiTemplateList');
  if (tList) {
    tList.innerHTML = CS_AI_TEMPLATES.map((t, i) => `
      <div class="oa-modal__template ${i === 0 ? 'is-active' : ''}" data-tpl="${i}">
        <div class="oa-modal__template-name">${i + 1}. ${t.name}</div>
        <div class="oa-modal__template-content">${t.content}</div>
        <div class="oa-modal__template-stat">${t.stat}</div>
      </div>
    `).join('');
  }

  let streamTimer = null;
  let stepIdx = 0;
  let isPaused = false;

  function renderChatList() {
    const list = document.getElementById('csAiChatList');
    if (!list) return;
    const step = CS_AI_SCRIPT[stepIdx];
    if (!step) return;
    list.insertAdjacentHTML('beforeend', `
      <div class="oa-modal__chat-msg oa-modal__chat-msg--${step.out ? 'out' : 'in'}">
        <div class="oa-modal__chat-avatar">${step.in}</div>
        <div>
          <div class="oa-modal__chat-bubble">${step.text}</div>
          <div class="oa-modal__chat-time">${new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}</div>
        </div>
      </div>
    `);
    // 滚动到底
    list.scrollTop = list.scrollHeight;
    // 更新统计
    const stat = document.getElementById('csAiChatStat');
    if (stat) stat.textContent = `已接管 ${stepIdx + 1}/8 条 · 平均响应 1.2s`;
    // 入场动画
    if (typeof gsap !== 'undefined' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const lastMsg = list.lastElementChild;
      if (lastMsg) {
        gsap.fromTo(lastMsg, { opacity: 0, y: 8 },
          { opacity: 1, y: 0, duration: 0.4, ease: 'power3.out', clearProps: 'transform,opacity' });
      }
    }
  }

  function startStream() {
    if (streamTimer) return;
    isPaused = false;
    const status = document.getElementById('csAiChatStatus');
    if (status) { status.classList.remove('is-paused'); status.textContent = '● 接管中'; }
    // 重置
    stepIdx = 0;
    const list = document.getElementById('csAiChatList');
    if (list) list.innerHTML = '';
    // 推第一条
    renderChatList();
    streamTimer = setInterval(() => {
      stepIdx++;
      if (stepIdx >= CS_AI_SCRIPT.length) {
        clearInterval(streamTimer);
        streamTimer = null;
        const status = document.getElementById('csAiChatStatus');
        if (status) { status.classList.add('is-paused'); status.textContent = '● 已完成 8/8'; }
        return;
      }
      const step = CS_AI_SCRIPT[stepIdx];
      if (step) {
        setTimeout(() => renderChatList(), step.delay);
      }
    }, 4000);
  }

  function stopStream() {
    if (streamTimer) { clearInterval(streamTimer); streamTimer = null; }
    isPaused = true;
    const status = document.getElementById('csAiChatStatus');
    if (status) { status.classList.add('is-paused'); status.textContent = '⏸ 已暂停'; }
  }

  // 打开 modal
  openBtn.addEventListener('click', () => {
    modal.removeAttribute('hidden');
    if (typeof gsap !== 'undefined' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.fromTo(modal.querySelector('.oa-modal__panel'),
        { scale: 0.92, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.35, ease: 'back.out(1.4)' });
    }
    // 启动推流
    setTimeout(startStream, 600);
  });

  function closeModal() {
    stopStream();
    modal.setAttribute('hidden', '');
  }
  closeBtn?.addEventListener('click', closeModal);
  backdrop?.addEventListener('click', closeModal);

  pauseBtn?.addEventListener('click', () => {
    if (isPaused) startStream();
    else stopStream();
  });
  restartBtn?.addEventListener('click', startStream);
  openMsgBtn?.addEventListener('click', () => {
    window.location.href = 'messages.html';
  });
  document.getElementById('csAiSaveBtn')?.addEventListener('click', () => {
    if (typeof gsap !== 'undefined' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.fromTo('#csAiSaveBtn', { scale: 0.92 }, { scale: 1, duration: 0.3, ease: 'power2.out', clearProps: 'transform' });
    }
  });
}
