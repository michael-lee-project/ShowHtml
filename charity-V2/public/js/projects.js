/* 慈商联营 · 慈善项目大厅
 * 路径：pages/projects.html
 * 6 大类目：应急救援 / 长线陪伴 / 儿童助学 / 老人关怀 / 乡村建设 / 医疗健康
 * 视觉：沿用 companies.html 的 brand-token + 浅橙 hero + 白底卡片 + 6 种低饱和类目色
 */
(function () {
  'use strict';

  /* ===== 1. 类目元数据（低饱和度，跟品牌橙和谐） ===== */
  const CATS = {
    urgent:   { name: '应急救援', c1: '#DC2626', soft: '#FEE2E2', cls: 'urgent' },
    longterm: { name: '长线陪伴', c1: '#0277BD', soft: '#E0F2FE', cls: 'longterm' },
    children: { name: '儿童助学', c1: '#D97706', soft: '#FEF3C7', cls: 'children' },
    elderly:  { name: '老人关怀', c1: '#7C3AED', soft: '#EDE9FE', cls: 'elderly' },
    rural:    { name: '乡村建设', c1: '#16A34A', soft: '#DCFCE7', cls: 'rural' },
    health:   { name: '医疗健康', c1: '#E11D48', soft: '#FFE4E6', cls: 'health' },
  };

  /* ===== 2. 项目 mock 数据 ===== */
  const PROJECTS = [
    /* ===== 应急救援（3 个紧急 + 1 个历史） ===== */
    {
      id: 'p-em-001', cat: 'urgent', name: '云南鲁甸 6.0 级地震抗震救灾',
      icon: '🌋', org: '云南省慈善总会 · 联合发起',
      desc: '云南鲁甸发生 6.0 级地震，32 个安置点 1.2 万人需紧急救助。慈商联营联动 12 家爱心企业 72 小时内紧急调拨帐篷、棉被、饮用水、面包等物资。',
      region: '云南 · 鲁甸', statDonate: '32,860 件', statPeople: '12,000', statOrg: '12',
      goal: 50000, raised: 32860, urgent: true, latest: '2026-06-12', amount: 32860,
    },
    {
      id: 'p-em-002', cat: 'urgent', name: '福建福州超强台风"海鸥"救援',
      icon: '🌀', org: '福建省红十字会 · 联合发起',
      desc: '17 级超强台风"海鸥"正面登陆福州，沿海 6 县受灾。需紧急转移 8,000 名群众，提供应急照明、食品、保暖物资。',
      region: '福建 · 福州', statDonate: '28,500 件', statPeople: '8,000', statOrg: '8',
      goal: 40000, raised: 28500, urgent: true, latest: '2026-06-10', amount: 28500,
    },
    {
      id: 'p-em-003', cat: 'urgent', name: '甘肃临夏特大泥石流救援',
      icon: '⛰️', org: '甘肃省民政厅 · 联合发起',
      desc: '临夏州遭遇 50 年一遇特大泥石流，3 个乡镇 4,500 人被困。慈商联营已联动顺丰 24h 紧急承运、娃哈哈纯净水紧急调拨。',
      region: '甘肃 · 临夏', statDonate: '38,200 件', statPeople: '4,500', statOrg: '15',
      goal: 55000, raised: 38200, urgent: true, latest: '2026-06-08', amount: 38200,
    },
    {
      id: 'p-em-004', cat: 'urgent', name: '西藏日喀则 6.8 级地震 · 已完成',
      icon: '🏔️', org: '中国红十字会 · 已结项',
      desc: '西藏日喀则 6.8 级地震已妥善安置，物资 100% 到位。本项目已转入"灾后重建"长线阶段。',
      region: '西藏 · 日喀则', statDonate: '86,000 件', statPeople: '15,000', statOrg: '20',
      goal: 86000, raised: 86000, urgent: false, latest: '2025-10-15', amount: 86000,
    },

    /* ===== 长线陪伴（4 个） ===== */
    {
      id: 'p-lt-001', cat: 'longterm', name: '"暖心早餐"长线项目',
      icon: '🍞', org: '美心食品 × 中国青少年发展基金会',
      desc: '向 12 省 230 所偏远学校持续供应早餐包，2026-01 启动至今已覆盖 6,200 名学生。',
      region: '12 省 · 230 校', statDonate: '48,200 份/月', statPeople: '6,200', statOrg: '1',
      goal: 80000, raised: 48200, urgent: false, latest: '2026-01-10', amount: 48200,
    },
    {
      id: 'p-lt-002', cat: 'longterm', name: '"伊利营养 2030" 长期学生奶计划',
      icon: '🥛', org: '伊利集团 × 中国奶业协会',
      desc: '10 年内向偏远地区儿童捐赠价值 5 亿元的学生奶。截至 2026-06，已覆盖 22 省 480 校。',
      region: '22 省 · 480 校', statDonate: '286 万盒/年', statPeople: '98,200', statOrg: '1',
      goal: 4000000, raised: 2860000, urgent: false, latest: '2024-07-01', amount: 2860000,
    },
    {
      id: 'p-lt-003', cat: 'longterm', name: '"春苗营养计划" 4.0',
      icon: '🌿', org: '安利（中国）× 中国青少年发展基金会',
      desc: '为偏远地区学校持续供应儿童营养品 + 学习用品，4.0 版本新增 80 所合作学校。',
      region: '18 省 · 420 校', statDonate: '56,200 套', statPeople: '76,500', statOrg: '1',
      goal: 80000, raised: 56200, urgent: false, latest: '2025-04-15', amount: 56200,
    },
    {
      id: 'p-lt-004', cat: 'longterm', name: '贵州山火救援队常驻项目',
      icon: '🌲', org: '贵州省慈善总会',
      desc: '在贵州山区设立 3 个常驻救援物资站，常年储备灭火器材 + 应急食品。',
      region: '贵州 · 3 个物资站', statDonate: '1,280 套', statPeople: '—', statOrg: '3',
      goal: 1800, raised: 1280, urgent: false, latest: '2025-08-10', amount: 1280,
    },

    /* ===== 儿童助学（3 个） ===== */
    {
      id: 'p-ch-001', cat: 'children', name: '"一封家书"乡村儿童陪伴项目',
      icon: '✉️', org: '中国社会工作联合会',
      desc: '为 3,000 名留守儿童对接城市志愿者笔友，每月通信 1 次。',
      region: '8 省 · 3,000 名儿童', statDonate: '3,600 封', statPeople: '3,000', statOrg: '5',
      goal: 5000, raised: 3600, urgent: false, latest: '2025-09-01', amount: 3600,
    },
    {
      id: 'p-ch-002', cat: 'children', name: '"新书包"开学季援助',
      icon: '🎒', org: '中国教育发展基金会',
      desc: '每年开学季为偏远地区 5,000 名学生捐赠新书包、文具、台灯。',
      region: '10 省 · 5,000 名学生', statDonate: '6,200 套', statPeople: '5,000', statOrg: '6',
      goal: 8000, raised: 6200, urgent: false, latest: '2025-08-25', amount: 6200,
    },
    {
      id: 'p-ch-003', cat: 'children', name: '"守护花蕾"女童安全教育',
      icon: '🌸', org: '中国少年儿童基金会',
      desc: '为 800 所乡村小学提供女童安全教育课程包，含教材 + 教具 + 培训。',
      region: '12 省 · 800 校', statDonate: '1,280 套', statPeople: '120,000', statOrg: '4',
      goal: 1800, raised: 1280, urgent: false, latest: '2025-05-15', amount: 1280,
    },

    /* ===== 老人关怀（2 个） ===== */
    {
      id: 'p-el-001', cat: 'elderly', name: '"暖心食堂" 农村老人助餐',
      icon: '🍱', org: '中国老龄事业发展基金会',
      desc: '在 200 个农村社区设立老人助餐点，60 岁以上老人 5 元 / 餐（政府补贴 8 元）。',
      region: '15 省 · 200 个社区', statDonate: '86 万份', statPeople: '12,000', statOrg: '10',
      goal: 1200000, raised: 860000, urgent: false, latest: '2025-06-20', amount: 860000,
    },
    {
      id: 'p-el-002', cat: 'elderly', name: '"银发陪伴"独居老人关爱',
      icon: '🤝', org: '中国社会工作联合会',
      desc: '为 2,000 名独居老人对接志愿者，每周上门探访 1 次 + 紧急呼叫设备。',
      region: '6 省 · 20 城', statDonate: '3,200 套', statPeople: '2,000', statOrg: '8',
      goal: 4000, raised: 3200, urgent: false, latest: '2025-04-10', amount: 3200,
    },

    /* ===== 乡村建设（3 个） ===== */
    {
      id: 'p-ru-001', cat: 'rural', name: '"光伏学校"山区学校清洁能源',
      icon: '☀️', org: '比亚迪 × 中国教育发展基金会',
      desc: '为 20 所山区学校安装光伏发电 + 储能设备，解决冬季供电 + 教学用电。',
      region: '云南 · 怒江', statDonate: '28 套', statPeople: '1,200', statOrg: '1',
      goal: 40, raised: 28, urgent: false, latest: '2026-02-10', amount: 28,
    },
    {
      id: 'p-ru-002', cat: 'rural', name: '"顺丰村" 公益物流进村',
      icon: '🚚', org: '顺丰公益物流 × 国家邮政局',
      desc: '为 1,000 个偏远村寨开通公益物流通道，农产品出村 + 公益物资进村。',
      region: '全国 · 1,000 村', statDonate: '1,860 批', statPeople: '28,600', statOrg: '1',
      goal: 2400, raised: 1860, urgent: false, latest: '2024-04-01', amount: 1860,
    },
    {
      id: 'p-ru-003', cat: 'rural', name: '"饮水思源" 山区直饮水设备',
      icon: '💧', org: '娃哈哈 × 中国农村水利协会',
      desc: '为 30 所山区学校安装直饮水设备，解决师生饮水安全问题。',
      region: '6 省 · 30 校', statDonate: '38 套', statPeople: '3,500', statOrg: '1',
      goal: 50, raised: 38, urgent: false, latest: '2026-01-15', amount: 38,
    },

    /* ===== 医疗健康（2 个） ===== */
    {
      id: 'p-he-001', cat: 'health', name: '"两癌筛查" 母亲健康',
      icon: '🎗️', org: '中国癌症基金会',
      desc: '为云南 4 县 5,000 名农村妇女提供免费两癌（乳腺癌/宫颈癌）筛查。',
      region: '云南 · 4 县', statDonate: '6,800 人次', statPeople: '5,000', statOrg: '3',
      goal: 8000, raised: 6800, urgent: false, latest: '2025-03-20', amount: 6800,
    },
    {
      id: 'p-he-002', cat: 'health', name: '"校园洗手" 健康教育',
      icon: '🧴', org: '立白集团 × 中国疾控中心',
      desc: '为 240 所学校安装洗手池、捐赠洗手液 + 健康教育课程，肠胃病发病率下降 60%。',
      region: '6 省 · 240 校', statDonate: '280 套', statPeople: '24,200', statOrg: '1',
      goal: 360, raised: 280, urgent: false, latest: '2026-03-01', amount: 280,
    },
  ];

  /* ===== 3. 状态 ===== */
  let currentCat = 'all';
  let currentSort = 'urgent';

  /* ===== 4. 渲染：类目计数 ===== */
  function renderCounts() {
    document.getElementById('cntAll').textContent = PROJECTS.length;
    Object.keys(CATS).forEach(c => {
      const c1 = PROJECTS.filter(p => p.cat === c).length;
      const el = document.getElementById('cnt' + c.charAt(0).toUpperCase() + c.slice(1));
      if (el) el.textContent = c1;
    });
  }

  /* ===== 5. 过滤 + 排序 ===== */
  function filterAndSort() {
    let list = currentCat === 'all' ? PROJECTS.slice() : PROJECTS.filter(p => p.cat === currentCat);
    switch (currentSort) {
      case 'urgent':   list.sort((a, b) => (b.urgent ? 1 : 0) - (a.urgent ? 1 : 0) || b.latest.localeCompare(a.latest)); break;
      case 'latest':   list.sort((a, b) => b.latest.localeCompare(a.latest)); break;
      case 'progress': list.sort((a, b) => (b.raised / b.goal) - (a.raised / a.goal)); break;
      case 'amount':   list.sort((a, b) => b.amount - a.amount); break;
    }
    return list;
  }

  /* ===== 6. 渲染卡片 ===== */
  function renderGrid() {
    const list = filterAndSort();
    document.getElementById('resultCount').textContent = list.length + ' 个项目';

    if (list.length === 0) {
      document.getElementById('pjGrid').innerHTML = `
        <div class="empty">
          <div class="ic">📭</div>
          <div class="t">该类目下暂无项目</div>
        </div>
      `;
      return;
    }

    document.getElementById('pjGrid').innerHTML = list.map(p => {
      const pct = Math.min(100, Math.round((p.raised / p.goal) * 100));
      const catInfo = CATS[p.cat] || CATS.longterm;
      return `
        <div class="pj-card ${catInfo.cls}" style="--c1:${catInfo.c1};--c1-soft:${catInfo.soft};">
          <div class="head">
            <div class="ic">${p.icon}</div>
            <div class="meta">
              <div>
                <span class="cat-badge">${catInfo.name}</span>
                ${p.urgent ? '<span class="live"><span class="dot"></span>紧急中</span>' : ''}
              </div>
              <div class="name">${p.name}</div>
              <div class="org">🏛️ ${p.org}</div>
            </div>
          </div>
          <div class="desc">${p.desc}</div>
          <div class="stats">
            <div class="s"><div class="v">${p.statDonate}</div><div class="l">物资捐赠量</div></div>
            <div class="s"><div class="v">${p.statPeople}</div><div class="l">受惠人数</div></div>
            <div class="s"><div class="v">${p.statOrg}</div><div class="l">合作方</div></div>
          </div>
          <div class="progress-wrap">
            <div class="pbar"><div class="pfill" style="width:${pct}%;"></div></div>
            <div class="pct">
              <span>📍 ${p.region}</span>
              <span><span class="pct-v">${pct}%</span> · ${p.raised.toLocaleString()}/${p.goal.toLocaleString()} 件</span>
            </div>
          </div>
          <div class="actions">
            <a href="project-detail.html?id=${p.id}" class="btn btn-primary">💖 我要捐赠</a>
            <a href="project-detail.html?id=${p.id}&tab=detail" class="btn btn-ghost">查看详情</a>
          </div>
        </div>
      `;
    }).join('');
  }

  /* ===== 7. 绑定 Tab + 排序 ===== */
  function bindTabs() {
    document.querySelectorAll('#catTabs button').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('#catTabs button').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentCat = btn.dataset.cat;
        document.getElementById('emSubbar').style.display = currentCat === 'urgent' ? 'flex' : 'none';
        renderGrid();
      });
    });
    document.querySelectorAll('.sort-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.sort-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentSort = btn.dataset.sort;
        renderGrid();
      });
    });
  }

  /* ===== 8. hero 数字 GSAP count-up（沿用 companies.html 风格） ===== */
  function animateHeroStats() {
    if (typeof gsap === 'undefined') return;
    document.querySelectorAll('.projects-hero .num').forEach((el, i) => {
      const target = parseFloat(el.dataset.target);
      const prefix = el.dataset.prefix || '';
      const suffix = el.dataset.suffix || '';
      if (isNaN(target)) return;
      const counter = { val: 0 };
      gsap.to(counter, {
        val: target, duration: 1.5, ease: 'power3.out', delay: 0.4 + i * 0.15,
        onUpdate: () => {
          if (target < 100) {
            el.textContent = prefix + counter.val.toFixed(1) + suffix;
          } else {
            el.textContent = prefix + Math.round(counter.val).toLocaleString() + suffix;
          }
        }
      });
    });
  }

  /* ===== 9. 主入口 ===== */
  function init() {
    renderCounts();
    renderGrid();
    bindTabs();
    animateHeroStats();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
