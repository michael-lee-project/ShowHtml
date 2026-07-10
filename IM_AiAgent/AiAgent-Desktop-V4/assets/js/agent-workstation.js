/* ============================================================
 * agent-workstation.js · AI Agent 协同工作台（V4.1）
 * 1. 8 专家数据
 * 2. 左列渲染 + 选中切换
 * 3. 中列渲染（detail + dispatch + progress + result）
 * 4. 派单流程：进度 + 结果 + 算力扣减
 * 5. 右列：任务队列 + 算力消耗
 * 6. 实时时钟
 * 7. 销冠入口 toggle
 * ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  const HAS_GSAP = typeof gsap !== 'undefined';
  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 1. 9 专家数据（CEO + 8 领域）---------- */
  const EXPERTS = [
    {
      id: 'ceo',
      name: 'CEO',
      role: 'Chief Coordinator · 8 专家协同调度',
      avatar: { emoji: '🌞', gradient: 'linear-gradient(135deg, #FFD700 0%, #FF8C42 100%)' },
      cost: 200,  // 调度费
      ceoFee: 200,  // 显式标记
      timeMs: 5000,
      successRate: 99,
      completed: 842,
      desc: '8 专家协同调度 · 自动判断拆解 · 一次发需求，多专家执行 · 节省 80% 沟通成本',
      samples: [
        { icon: '📋', name: 'Q4 营销全案', meta: '拆 3 任务 · 3,900 token' },
        { icon: '🤝', name: '新员工入职', meta: '拆 2 任务 · 1,300 token' },
        { icon: '📊', name: 'Q3 数据复盘', meta: '拆 1 任务 · 1,200 token' }
      ],
      isCeo: true
    },
    {
      id: 'sales',
      name: '销冠专家',
      role: 'Sales Champion · 全自动客户接管',
      avatar: { emoji: '★', gradient: 'linear-gradient(135deg, #7BC498, #4DD890)' },
      cost: 800,
      timeMs: 3000,
      successRate: 96,
      completed: 1247,
      desc: '24h 自动接管客户对话 · 半自动 / 全自动模式 · 转化率行业领先 5x',
      samples: [
        { icon: '💬', name: '客户答疑', meta: '对话 1.2k · 满意度 96%' },
        { icon: '🎯', name: '意向筛选', meta: '筛选 800 · 转化 23%' },
        { icon: '📞', name: '回访跟进', meta: '跟进 600 · 成单 18%' }
      ]
    },
    {
      id: 'brand',
      name: '品牌设计专家',
      role: 'Brand Designer · Logo / VI / 海报',
      avatar: { emoji: '◆', gradient: 'linear-gradient(135deg, #F8718B, #FF7B7B)' },
      cost: 1200,
      timeMs: 5000,
      successRate: 94,
      completed: 856,
      desc: '30 秒出 4 个 Logo 方案 · VI 系统自动生成 · 海报 / 包装 / 字体设计',
      samples: [
        { icon: '🎨', name: 'Logo 设计', meta: '生成 320 · 采纳 78%' },
        { icon: '📐', name: 'VI 系统', meta: '完整 156 套' },
        { icon: '🖼️', name: '海报设计', meta: '生成 480 · 采纳 71%' }
      ]
    },
    {
      id: 'writing',
      name: '写作文案专家',
      role: 'Copywriter · 公众号 / 短视频 / 邮件',
      avatar: { emoji: '✎', gradient: 'linear-gradient(135deg, #B695FF, #7C5CFF)' },
      cost: 500,
      timeMs: 2500,
      successRate: 98,
      completed: 2341,
      desc: '10w+ 爆款文章生成 · 多平台风格适配 · SEO 关键词自动优化',
      samples: [
        { icon: '📰', name: '公众号文章', meta: '生成 1.2k · 10w+ 89 篇' },
        { icon: '🎬', name: '短视频脚本', meta: '生成 800 · 爆款 124 条' },
        { icon: '📧', name: 'EDM 邮件', meta: '打开率 38% · CTR 12%' }
      ]
    },
    {
      id: 'audio',
      name: '录音会议专家',
      role: 'Audio Expert · 会议转录 / 语音合成',
      avatar: { emoji: '♪', gradient: 'linear-gradient(135deg, #7BD4FF, #1FB6FF)' },
      cost: 600,
      timeMs: 3500,
      successRate: 92,
      completed: 678,
      desc: '会议实时转录 · 多语种翻译 · 智能纪要 · 重点提炼',
      samples: [
        { icon: '🎙️', name: '会议转录', meta: '转录 1.8k 小时' },
        { icon: '🌐', name: '多语翻译', meta: '12 语种 · 准确率 98%' },
        { icon: '📋', name: '智能纪要', meta: '生成 600 · 采纳 91%' }
      ]
    },
    {
      id: 'video',
      name: '视频制作专家',
      role: 'Video Producer · 短视频 / 宣传片',
      avatar: { emoji: '▶', gradient: 'linear-gradient(135deg, #FF9F75, #FF8C42)' },
      cost: 2000,
      timeMs: 8000,
      successRate: 89,
      completed: 423,
      desc: '60 秒短视频自动剪辑 · 数字人主播 · 一键多平台分发',
      samples: [
        { icon: '🎬', name: '短视频', meta: '生成 1.2k · 爆款 156 条' },
        { icon: '👤', name: '数字人主播', meta: '12 形象 · 6 种语言' },
        { icon: '📺', name: '宣传片', meta: '企业宣传 80 部' }
      ]
    },
    {
      id: 'data',
      name: '数据分析专家',
      role: 'Data Analyst · 报表 / 趋势 / 预测',
      avatar: { emoji: '◐', gradient: 'linear-gradient(135deg, #7BAFFF, #5D8FE5)' },
      cost: 700,
      timeMs: 4000,
      successRate: 95,
      completed: 932,
      desc: '自动生成数据报表 · 趋势预测 · 异常预警 · 商业洞察',
      samples: [
        { icon: '📊', name: '业务报表', meta: '生成 2.4k · 日均 80' },
        { icon: '📈', name: '趋势预测', meta: '准确率 92%' },
        { icon: '⚠️', name: '异常预警', meta: '预警 320 · 命中 94%' }
      ]
    },
    {
      id: 'fengshui',
      name: '五行风水专家',
      role: 'Feng Shui Master · 玄学咨询',
      avatar: { emoji: '☯', gradient: 'linear-gradient(135deg, #5BD897, #07C160)' },
      cost: 400,
      timeMs: 2000,
      successRate: 97,
      completed: 1567,
      desc: '八字排盘 · 五行分析 · 流年大运 · 居家风水',
      samples: [
        { icon: '☯', name: '八字排盘', meta: '排盘 1.5k · 满意度 95%' },
        { icon: '🏠', name: '居家风水', meta: '咨询 800 · 复购 78%' },
        { icon: '💎', name: '流年大运', meta: '分析 600 · 准确率 89%' }
      ]
    },
    {
      id: 'zodiac',
      name: '十二星座专家',
      role: 'Zodiac Expert · 运势 / 配对 / 解读',
      avatar: { emoji: '☽', gradient: 'linear-gradient(135deg, #9F87E8, #7C5CFF)' },
      cost: 400,
      timeMs: 2000,
      successRate: 96,
      completed: 1823,
      desc: '每日运势 · 12 星座配对 · 星盘解读 · 心理疏导',
      samples: [
        { icon: '☽', name: '每日运势', meta: '生成 12k · 阅读 8w' },
        { icon: '💕', name: '星座配对', meta: '配对 2.4k · 满意度 92%' },
        { icon: '🔮', name: '星盘解读', meta: '解读 1.8k · 复购 73%' }
      ]
    }
  ];

  const TASK_MAX_ITEMS = 12;

  /* ---------- 1.5 CEO 路由表 + 拆解函数 ---------- */
  // CEO 调度费（固定）
  const CEO_DISPATCH_FEE = 200;
  // CEO 子任务最多 3 个
  const CEO_MAX_SUBTASKS = 3;
  // 关键词路由
  const CEO_ROUTING = [
    { kw: ['营销', '活动', '推广', '产品发布', '品牌推广', 'campaign'], experts: ['writing', 'brand', 'video'] },
    { kw: ['客户', '销售', '咨询', '回复', '接单', '谈客户', '跟进'],     experts: ['sales'] },
    { kw: ['数据', '分析', '复盘', '报告', '统计', '指标', 'q1', 'q2', 'q3', 'q4'], experts: ['data'] },
    { kw: ['文章', '文案', '脚本', '视频脚本', '公众号', '内容'],          experts: ['writing', 'video'] },
    { kw: ['logo', 'vi', '设计', '海报', '包装', '视觉'],                 experts: ['brand'] },
    { kw: ['录音', '会议', '转录', '纪要', '培训'],                       experts: ['audio'] },
    { kw: ['运势', '星盘', '星座', '桃花', '财运', '八字'],                 experts: ['zodiac', 'fengshui'] },
    { kw: ['入职', '培训', '员工', 'onboarding'],                          experts: ['writing', 'audio'] },
    { kw: ['短视频', '抖音', '视频号', 'tiktok'],                          experts: ['video', 'writing'] }
  ];
  // 默认拆 2 个
  const CEO_DEFAULT_EXPERTS = ['writing', 'brand'];

  // CEO 拆解：返回子任务数组 [{ expertId, taskName, cost, timeMs }]
  function ceoRoute(requirement) {
    let expertIds = null;
    for (const route of CEO_ROUTING) {
      if (route.kw.some(k => requirement.includes(k))) {
        expertIds = route.experts;
        break;
      }
    }
    if (!expertIds) expertIds = CEO_DEFAULT_EXPERTS;
    // 截断到最多 3 个
    expertIds = expertIds.slice(0, CEO_MAX_SUBTASKS);
    // 生成子任务
    return expertIds.map((eid, idx) => {
      const expert = EXPERTS.find(e => e.id === eid);
      if (!expert) return null;
      return {
        index: idx + 1,
        expertId: eid,
        expertName: expert.name,
        avatar: expert.avatar,
        taskName: synthesizeSubtaskName(eid, requirement),
        cost: expert.cost,
        timeMs: expert.timeMs
      };
    }).filter(Boolean);
  }

  // 根据专家类型 + 需求生成子任务名
  function synthesizeSubtaskName(expertId, requirement) {
    const templates = {
      sales:    '客户接管与跟进',
      brand:    '视觉设计与物料',
      writing:  '内容文案撰写',
      audio:    '会议转录与纪要',
      video:    '视频素材制作',
      data:     '数据分析报告',
      fengshui: '命理运势解析',
      zodiac:   '星座运势解读'
    };
    return templates[expertId] || ('智能处理 · ' + requirement.substring(0, 16));
  }

  let currentExpertId = 'sales';       // 当前选中专家
  let quotaBalance = 128500;           // Token 余额
  let consumedToday = 0;               // 今日消耗
  let tasks = [];                      // 任务队列
  let taskCounter = 0;
  let salesMode = false;               // 销冠模式开关

  /* ---------- 2. 实时时钟 ---------- */
  function updateClock() {
    const now = new Date();
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    const s = String(now.getSeconds()).padStart(2, '0');
    const el = document.getElementById('wsClock');
    if (el) el.textContent = h + ':' + m + ':' + s;
  }
  updateClock();
  setInterval(updateClock, 1000);

  /* ---------- 3. 渲染左列 8 专家 ---------- */
  function renderExpertList() {
    const list = document.getElementById('wsExpertList');
    if (!list) return;
    list.innerHTML = EXPERTS.map(e => (
      '<div class="ws-expert-row' + (e.id === currentExpertId ? ' is-active' : '') + '" data-id="' + e.id + '">' +
        '<div class="ws-expert-row__avatar" style="background:' + e.avatar.gradient + ';">' + e.avatar.emoji + '</div>' +
        '<div class="ws-expert-row__body">' +
          '<span class="ws-expert-row__name">' + e.name + '</span>' +
          '<span class="ws-expert-row__role">' + e.role.split(' · ')[0] + '</span>' +
        '</div>' +
        '<span class="ws-expert-row__time">' + (e.timeMs / 1000).toFixed(1) + 's</span>' +
        '<span class="ws-expert-row__status"></span>' +
      '</div>'
    )).join('');

    list.querySelectorAll('.ws-expert-row').forEach(row => {
      row.addEventListener('click', () => {
        if (row.classList.contains('is-busy')) return;
        currentExpertId = row.dataset.id;
        renderExpertList();
        renderCenter();
      });
    });
  }

  /* ---------- 4. 渲染中列（选中专家详情 + 派单表单） ---------- */
  let currentTab = 'dispatch';  // 'dispatch' | 'data'

  function renderCenter() {
    const center = document.getElementById('wsCenter');
    if (!center) return;
    const expert = EXPERTS.find(e => e.id === currentExpertId);
    if (!expert) return;

    // 销冠模式入口：销冠专家显示"销冠模式" · 其他隐藏
    const salesEntry = document.getElementById('wsSalesEntry');
    if (salesEntry) {
      const salesIcon = salesEntry.querySelector('.ws__sales-entry-icon');
      const salesTitle = salesEntry.querySelector('.ws__sales-entry-title');
      const salesDesc = salesEntry.querySelector('.ws__sales-entry-desc');
      if (expert.id === 'sales') {
        salesEntry.style.display = 'flex';
        if (salesIcon) salesIcon.textContent = '★';
        if (salesTitle) salesTitle.textContent = '销冠模式';
        if (salesDesc) salesDesc.textContent = 'AI 全自动接管对话 · 24h 不打烊';
      } else {
        salesEntry.style.display = 'none';
      }
    }

    const samples = expert.samples.map((s, sIdx) => (
      '<div class="ws-detail__sample" data-expert-id="' + expert.id + '" data-sample-idx="' + sIdx + '" role="button" tabindex="0">' +
        '<div class="ws-detail__sample-thumb" style="background:' + expert.avatar.gradient + ';">' + s.icon + '</div>' +
        '<span class="ws-detail__sample-name">' + s.name + '</span>' +
        '<span class="ws-detail__sample-meta">' + s.meta + '</span>' +
      '</div>'
    )).join('');

    center.innerHTML = (
      '<div class="ws-tabbar">' +
        '<button class="ws-tab' + (currentTab === 'dispatch' ? ' is-active' : '') + '" data-tab="dispatch" type="button">派单详情</button>' +
        '<button class="ws-tab' + (currentTab === 'data' ? ' is-active' : '') + '" data-tab="data" type="button">数据中心</button>' +
      '</div>' +

      '<div class="ws-tabpanel' + (currentTab === 'dispatch' ? ' is-active' : '') + '" data-tabpanel="dispatch">' +
      '<div class="ws-detail">' +
        '<div class="ws-detail__head">' +
          '<div class="ws-detail__avatar" style="background:' + expert.avatar.gradient + ';">' + expert.avatar.emoji + '</div>' +
          '<div class="ws-detail__heading">' +
            '<div class="ws-detail__name">' + expert.name + '</div>' +
            '<div class="ws-detail__role">' + expert.role + '</div>' +
            '<div class="ws-detail__status"><span class="ws-detail__status-dot"></span>在线</div>' +
          '</div>' +
        '</div>' +
        '<div class="ws-detail__stats">' +
          '<div class="ws-detail__stat"><span class="ws-detail__stat-num ws-detail__stat-num--purple">' + expert.cost + '</span><span class="ws-detail__stat-label">Token 消耗</span></div>' +
          '<div class="ws-detail__stat"><span class="ws-detail__stat-num ws-detail__stat-num--green">' + (expert.timeMs / 1000).toFixed(1) + 's</span><span class="ws-detail__stat-label">平均耗时</span></div>' +
          '<div class="ws-detail__stat"><span class="ws-detail__stat-num ws-detail__stat-num--gold">' + expert.successRate + '%</span><span class="ws-detail__stat-label">成功率</span></div>' +
          '<div class="ws-detail__stat"><span class="ws-detail__stat-num">' + expert.completed.toLocaleString('en-US') + '</span><span class="ws-detail__stat-label">累计完成</span></div>' +
        '</div>' +
        '<div class="ws-detail__desc">' + expert.desc + '</div>' +
        '<div>' +
          '<div class="ws-detail__samples-title">最近案例</div>' +
          '<div class="ws-detail__samples">' + samples + '</div>' +
        '</div>' +
      '</div>' +

      '<div class="ws-dispatch" id="wsDispatch">' +
        '<div class="ws-dispatch__head">' +
          '<div class="ws-dispatch__head-title">' +
            '<span class="ws-dispatch__head-icon">→</span>' +
            '<span>立即派单</span>' +
          '</div>' +
          '<button class="ws-dispatch__quick-clear" id="wsQuickClear" type="button" data-state="hidden">清除条件</button>' +
        '</div>' +
        '<div class="ws-dispatch__quick" id="wsDispatchQuick"></div>' +
        // 录音专家：默认 mic 录音模式
        (expert.id === 'audio'
          ? '<div class="ws-dispatch__mic" id="wsDispatchMic">' +
              '<div class="ws-dispatch__mic-wave">' +
                '<span></span><span></span><span></span><span></span><span></span>' +
                '<span></span><span></span><span></span><span></span><span></span>' +
                '<span></span><span></span>' +
              '</div>' +
              '<button class="ws-dispatch__mic-btn" id="wsMicBtn" type="button" data-state="idle">' +
                '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v3M8 22h8"/></svg>' +
              '</button>' +
              '<div class="ws-dispatch__mic-status" id="wsMicStatus">点击开始录音</div>' +
              '<div class="ws-dispatch__mic-time" id="wsMicTime">00:00</div>' +
              '<button class="ws-dispatch__mic-toggle" id="wsMicToggle" type="button">切换文本输入</button>' +
            '</div>' +
            '<textarea class="ws-dispatch__input" id="wsDispatchInput" placeholder="或输入会议主题、参会人、转录要求..." maxlength="200" style="display:none;"></textarea>'
          : '<textarea class="ws-dispatch__input" id="wsDispatchInput" placeholder="例：帮我写一篇关于 AI Agent 协同办公的公众号文章，要求轻松幽默，800 字以内..." maxlength="200"></textarea>'
        ) +
        '<button class="ws-dispatch__submit" id="wsDispatchSubmit" type="button">发需求给 ' + expert.name + '</button>' +
      '</div>' +
      '</div>' +  // 关闭 ws-tabpanel[dispatch]
      buildDataPanel()
    );

    // 录音专家：mic 交互
    if (expert.id === 'audio') {
      const micBtn = document.getElementById('wsMicBtn');
      const micStatus = document.getElementById('wsMicStatus');
      const micTime = document.getElementById('wsMicTime');
      const micToggle = document.getElementById('wsMicToggle');
      const textarea = document.getElementById('wsDispatchInput');
      let recording = false;
      let seconds = 0;
      let timer = null;

      function fmt(s) {
        const m = String(Math.floor(s / 60)).padStart(2, '0');
        const sec = String(s % 60).padStart(2, '0');
        return m + ':' + sec;
      }

      micBtn.addEventListener('click', () => {
        if (!recording) {
          recording = true;
          seconds = 0;
          micBtn.dataset.state = 'recording';
          micStatus.textContent = '正在录音...';
          micTime.textContent = fmt(seconds);
          timer = setInterval(() => {
            seconds++;
            micTime.textContent = fmt(seconds);
            // 演示限制 30s
            if (seconds >= 30) {
              clearInterval(timer);
              recording = false;
              micBtn.dataset.state = 'done';
              micStatus.textContent = '录音完成（自动派单）';
              micBtn.click();
            }
          }, 1000);
        } else {
          recording = false;
          clearInterval(timer);
          micBtn.dataset.state = 'done';
          micStatus.textContent = '录音完成 · ' + fmt(seconds);
        }
      });

      micToggle.addEventListener('click', () => {
        const micBox = document.getElementById('wsDispatchMic');
        if (micBox.style.display !== 'none') {
          micBox.style.display = 'none';
          textarea.style.display = '';
          micToggle.textContent = '切换 mic 录音';
        } else {
          micBox.style.display = '';
          textarea.style.display = 'none';
          micToggle.textContent = '切换文本输入';
        }
      });
    }

    // 绑定派单提交
    document.getElementById('wsDispatchSubmit').addEventListener('click', () => {
      let req = '';
      if (expert.id === 'audio') {
        const micStatus = document.getElementById('wsMicStatus');
        const micTime = document.getElementById('wsMicTime');
        const textarea = document.getElementById('wsDispatchInput');
        if (micStatus && micTime && (micTime.textContent !== '00:00')) {
          req = '🎙️ 录音会议 ' + micTime.textContent + ' · ' + (micStatus.textContent || '');
        } else if (textarea && textarea.value.trim()) {
          req = textarea.value.trim();
        } else {
          // 没录音也没文本 → 报错
          if (micStatus) {
            const orig = micStatus.textContent;
            micStatus.textContent = '⚠ 请先录音或输入';
            micStatus.style.color = '#E54B4B';
            setTimeout(() => {
              micStatus.textContent = orig;
              micStatus.style.color = '';
            }, 2000);
          }
          return;
        }
      } else {
        const input = document.getElementById('wsDispatchInput');
        req = input ? input.value.trim() : '';
        if (!req) {
          if (input) {
            input.style.borderColor = '#E54B4B';
            input.placeholder = '⚠ 请输入任务需求';
            setTimeout(() => {
              input.style.borderColor = '';
              input.placeholder = '例：帮我写一篇关于 AI Agent 协同办公的公众号文章...';
            }, 2000);
          }
          return;
        }
      }
      // CEO 模式：自动拆解为子任务
      if (expert.id === 'ceo') {
        submitCeoTask(expert, req);
      } else {
        submitTask(expert, req);
      }
    });

    // 绑定 tab 切换
    center.querySelectorAll('.ws-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        const target = tab.dataset.tab;
        if (target === currentTab) return;
        currentTab = target;
        renderCenter();
      });
    });
  }

  /* ---------- 4.5. V4.4 数据中心（tab = data）---------- */
  function buildDataPanel() {
    // 1. 专家效率排行（按"今日完成"模拟数据 + 真实 ROI 排行）
    const rankedExperts = EXPERTS.slice().sort((a, b) => b.successRate - a.successRate);
    const rankItems = rankedExperts.map((e, idx) => {
      const medal = idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : (idx + 1);
      return (
        '<div class="ws-rank__item">' +
          '<div class="ws-rank__medal">' + medal + '</div>' +
          '<div class="ws-rank__avatar" style="background:' + e.avatar.gradient + ';">' + e.avatar.emoji + '</div>' +
          '<div class="ws-rank__body">' +
            '<div class="ws-rank__name">' + e.name + '</div>' +
            '<div class="ws-rank__meta">今日 ' + (3 + idx * 2) + ' 单 · ' + e.completed.toLocaleString('en-US') + ' 累计</div>' +
          '</div>' +
          '<div class="ws-rank__rate">' + e.successRate + '%</div>' +
        '</div>'
      );
    }).join('');

    // 2. 算力消耗趋势（7 天 SVG 折线图，演示数据）
    const trendData = [4200, 5800, 4900, 7200, 9100, 6800, Math.max(consumedToday, 100)];
    const maxV = Math.max.apply(null, trendData) * 1.1;
    const trendW = 480, trendH = 80;
    const points = trendData.map((v, i) => {
      const x = (i / (trendData.length - 1)) * trendW;
      const y = trendH - (v / maxV) * trendH;
      return x.toFixed(1) + ',' + y.toFixed(1);
    }).join(' ');
    const days = ['周一', '周二', '周三', '周四', '周五', '周六', '今日'];

    // 3. ROI 卡片（每个专家）
    const roiCards = EXPERTS.slice(0, 4).map(e => {
      const roi = (e.successRate / 100 * 8).toFixed(1);
      return (
        '<div class="ws-roi__card">' +
          '<div class="ws-roi__head">' +
            '<div class="ws-roi__avatar" style="background:' + e.avatar.gradient + ';">' + e.avatar.emoji + '</div>' +
            '<div class="ws-roi__body">' +
              '<div class="ws-roi__name">' + e.name + '</div>' +
              '<div class="ws-roi__cost">' + e.cost + ' Token</div>' +
            '</div>' +
          '</div>' +
          '<div class="ws-roi__value">' +
            '<span class="ws-roi__value-num">' + roi + 'x</span>' +
            '<span class="ws-roi__value-label">ROI</span>' +
          '</div>' +
        '</div>'
      );
    }).join('');

    return (
      '<div class="ws-tabpanel' + (currentTab === 'data' ? ' is-active' : '') + '" data-tabpanel="data">' +

        // 关键指标总览
        '<div class="ws-data-overview">' +
          '<div class="ws-data-overview__card">' +
            '<div class="ws-data-overview__num">' + quotaBalance.toLocaleString('en-US') + '</div>' +
            '<div class="ws-data-overview__label">当前 Token 余额</div>' +
          '</div>' +
          '<div class="ws-data-overview__card">' +
            '<div class="ws-data-overview__num ws-data-overview__num--purple">' + consumedToday.toLocaleString('en-US') + '</div>' +
            '<div class="ws-data-overview__label">今日消耗</div>' +
          '</div>' +
          '<div class="ws-data-overview__card">' +
            '<div class="ws-data-overview__num ws-data-overview__num--green">' + tasks.filter(t => t.status === 'done').length + '</div>' +
            '<div class="ws-data-overview__label">今日完成</div>' +
          '</div>' +
          '<div class="ws-data-overview__card">' +
            '<div class="ws-data-overview__num ws-data-overview__num--gold">4.2x</div>' +
            '<div class="ws-data-overview__label">平均 ROI</div>' +
          '</div>' +
        '</div>' +

        // 趋势图
        '<div class="ws-data-block">' +
          '<div class="ws-data-block__head">' +
            '<div class="ws-data-block__title">Token 消耗趋势 · 近 7 天</div>' +
            '<div class="ws-data-block__hint">峰值 ' + maxV.toLocaleString('en-US') + ' · 今日 ' + consumedToday.toLocaleString('en-US') + '</div>' +
          '</div>' +
          '<div class="ws-trend">' +
            '<svg viewBox="0 0 ' + trendW + ' ' + (trendH + 28) + '" preserveAspectRatio="none" class="ws-trend__svg">' +
              '<defs>' +
                '<linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">' +
                  '<stop offset="0%" stop-color="#7C5CFF" stop-opacity="0.35"/>' +
                  '<stop offset="100%" stop-color="#7C5CFF" stop-opacity="0"/>' +
                '</linearGradient>' +
              '</defs>' +
              '<polygon points="0,' + trendH + ' ' + points + ' ' + trendW + ',' + trendH + '" fill="url(#trendFill)"/>' +
              '<polyline points="' + points + '" fill="none" stroke="#7C5CFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>' +
              trendData.map((v, i) => {
                const x = (i / (trendData.length - 1)) * trendW;
                const y = trendH - (v / maxV) * trendH;
                return '<circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="3" fill="#7C5CFF" stroke="white" stroke-width="1.5"/>';
              }).join('') +
              days.map((d, i) => {
                const x = (i / (days.length - 1)) * trendW;
                return '<text x="' + x.toFixed(1) + '" y="' + (trendH + 14) + '" text-anchor="middle" font-size="9" fill="rgba(26,34,56,0.5)" font-weight="600">' + d + '</text>';
              }).join('') +
            '</svg>' +
          '</div>' +
        '</div>' +

        // 专家效率排行
        '<div class="ws-data-block">' +
          '<div class="ws-data-block__head">' +
            '<div class="ws-data-block__title">专家效率排行 · 按成功率</div>' +
            '<div class="ws-data-block__hint">9 位专家</div>' +
          '</div>' +
          '<div class="ws-rank">' + rankItems + '</div>' +
        '</div>' +

        // ROI 卡片
        '<div class="ws-data-block">' +
          '<div class="ws-data-block__head">' +
            '<div class="ws-data-block__title">ROI Top 4 · 投入产出比</div>' +
            '<div class="ws-data-block__hint">展示前 4 名</div>' +
          '</div>' +
          '<div class="ws-roi">' + roiCards + '</div>' +
        '</div>' +

      '</div>'
    );
  }

  /* ---------- 5. 派单提交 → 进度 → 结果 ---------- */
  function submitTask(expert, requirement) {
    const cost = expert.cost;  // 按专家实际消耗
    if (quotaBalance < cost) {
      alert('Token 余额不足！请到算力中心充值。');
      return;
    }

    taskCounter++;
    const taskId = 'T' + String(taskCounter).padStart(3, '0');
    const task = {
      id: taskId,
      expertId: expert.id,
      expertName: expert.name,
      avatar: expert.avatar,
      requirement: requirement,
      cost: cost,
      timeMs: expert.timeMs,
      status: 'running',
      progress: 0,
      startAt: Date.now()
    };
    tasks.unshift(task);
    renderTaskList();
    updateTaskCount();

    // 中列切换到进度视图
    renderCenterProgress(expert, task);
    markExpertBusy(expert.id, true);

    // 算力立即扣减
    quotaBalance -= cost;
    consumedToday += cost;
    updateQuotaUI();

    // GSAP 进度条
    if (HAS_GSAP) {
      const fill = document.querySelector('#wsProgressFill');
      const pctEl = document.querySelector('#wsProgressPct');
      const stepEl = document.querySelector('#wsProgressStep');
      const steps = ['正在分析需求...', '调用 AI 模型...', '生成结果中...', '质量校验...', '完成'];
      const obj = { v: 0 };
      gsap.to(obj, {
        v: 100,
        duration: task.timeMs / 1000,
        ease: 'power2.inOut',
        onUpdate: () => {
          const v = Math.floor(obj.v);
          if (fill) fill.style.width = v + '%';
          if (pctEl) pctEl.textContent = v + '%';
          if (stepEl && steps[Math.floor(v / 25)]) {
            stepEl.innerHTML = '<span class="ws-progress__step-dot"></span>' + steps[Math.floor(v / 25)];
          }
          task.progress = v;
        },
        onComplete: () => {
          task.status = 'done';
          task.progress = 100;
          task.resultSummary = generateResultSummary(expert, task);
          renderCenterResult(expert, task);
          renderTaskList();
          updateTaskCount();
          // V4.2: 写入历史派单（最多 3 条）
          resultHistory.unshift({
            taskId: task.id,
            expertId: expert.id,
            expertName: expert.name,
            avatar: expert.avatar,
            cost: task.cost,
            requirement: task.requirement,
            resultSummary: task.resultSummary
          });
          while (resultHistory.length > HISTORY_MAX) resultHistory.pop();
        }
      });
    } else {
      // fallback
      setTimeout(() => {
        task.status = 'done';
        task.progress = 100;
        task.resultSummary = generateResultSummary(expert, task);
        markExpertBusy(expert.id, false);
        renderCenterResult(expert, task);
        renderTaskList();
        updateTaskCount();
      }, task.timeMs);
    }
  }

  function markExpertBusy(id, busy) {
    const row = document.querySelector('.ws-expert-row[data-id="' + id + '"]');
    if (row) row.classList.toggle('is-busy', busy);
  }

  /* ---------- 6. 中列：进度视图 ---------- */
  function renderCenterProgress(expert, task) {
    const center = document.getElementById('wsCenter');
    if (!center) return;
    center.innerHTML = (
      '<div class="ws-progress">' +
        '<div class="ws-progress__head">' +
          '<div class="ws-progress__title">' +
            '<span>⚡ 任务进行中</span>' +
            // AL: 打字中动画 · 3 dot 跳动
            '<span class="ws-typing">' +
              '<span class="ws-typing__dot"></span>' +
              '<span class="ws-typing__dot"></span>' +
              '<span class="ws-typing__dot"></span>' +
            '</span>' +
          '</div>' +
          '<div class="ws-progress__pct" id="wsProgressPct">0%</div>' +
        '</div>' +
        '<div class="ws-progress__bar">' +
          '<div class="ws-progress__fill" id="wsProgressFill"></div>' +
        '</div>' +
        '<div class="ws-progress__step" id="wsProgressStep">' +
          '<span class="ws-progress__step-dot"></span>正在分析需求...' +
        '</div>' +
        '<div class="ws-detail__desc" style="font-size: 11px; color: rgba(26,34,56,0.5);">' +
          '<strong>' + expert.name + '</strong> 正在处理：' + task.requirement.substring(0, 50) + (task.requirement.length > 50 ? '...' : '') +
        '</div>' +
      '</div>'
    );
    if (HAS_GSAP) {
      gsap.fromTo('.ws-progress', { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.4, ease: 'power3.out' });
    }
  }

  /* ---------- 7. 中列：结果视图 ---------- */
  function renderCenterResult(expert, task) {
    const center = document.getElementById('wsCenter');
    if (!center) return;
    const results = generateResult(expert, task);
    // 按专家类型定制 result 标题 + actions
    const resultMeta = {
      sales:    { title: '✓ 客户对话已接管',  primary: '查看对话',  secondary: ['调整话术', '导出话术'] },
      brand:    { title: '✓ Logo 方案已生成', primary: '查看大图',  secondary: ['下载源文件', '导出 VI'] },
      writing:  { title: '✓ 公众号文章已生成', primary: '查看全文',  secondary: ['复制正文', '一键发布'] },
      audio:    { title: '✓ 会议纪要已生成',  primary: '查看纪要',  secondary: ['下载录音', '导出 Markdown'] },
      video:    { title: '✓ 60s 短视频已生成', primary: '播放视频',  secondary: ['下载成片', '多平台发布'] },
      data:     { title: '✓ 数据分析已完成',  primary: '查看报告',  secondary: ['导出 PDF', '复制摘要'] },
      fengshui: { title: '✓ 八字排盘已生成',  primary: '查看排盘',  secondary: ['复制八字', '分享解析'] },
      zodiac:   { title: '✓ 星座运势已生成',  primary: '查看运势',  secondary: ['分享给朋友', '收藏'] }
    };
    const meta = resultMeta[expert.id] || { title: '✓ 任务完成', primary: '查看结果', secondary: ['采纳', '收藏'] };
    const sec1 = meta.secondary[0] || '采纳';
    const sec2 = meta.secondary[1] || '收藏';
    center.innerHTML = (
      '<div class="ws-result">' +
        '<div class="ws-result__head">' +
          '<div class="ws-result__title">' + meta.title + '</div>' +
          '<div class="ws-result__cost">消耗 ' + task.cost + ' 算力</div>' +
        '</div>' +
        // Chat 模式：用户消息 + AI 消息气泡
        '<div class="ws-chat-stream" id="wsChatStream">' +
          // 用户消息（右侧气泡）
          '<div class="ws-chat-msg ws-chat-msg--user">' +
            '<div class="ws-chat-msg__bubble">' +
              '<div class="ws-chat-msg__meta">' +
                '<span class="ws-chat-msg__tag">→ 派给 ' + expert.name + '</span>' +
                '<span class="ws-chat-msg__time">' + new Date().toLocaleTimeString('zh-CN', {hour: '2-digit', minute: '2-digit'}) + '</span>' +
              '</div>' +
              '<div class="ws-chat-msg__text">' + (task.requirement || '（无具体需求）') + '</div>' +
            '</div>' +
            '<div class="ws-chat-msg__avatar ws-chat-msg__avatar--user">你</div>' +
          '</div>' +
          // AI 消息（左侧气泡）
          '<div class="ws-chat-msg ws-chat-msg--ai">' +
            '<div class="ws-chat-msg__avatar" style="background:' + expert.avatar.gradient + ';">' + expert.avatar.emoji + '</div>' +
            '<div class="ws-chat-msg__bubble">' +
              '<div class="ws-chat-msg__meta">' +
                '<span class="ws-chat-msg__tag ws-chat-msg__tag--ai">' + expert.name + '</span>' +
                '<span class="ws-chat-msg__time">' + new Date().toLocaleTimeString('zh-CN', {hour: '2-digit', minute: '2-digit'}) + ' · ⚡ ' + (task.timeMs / 1000).toFixed(1) + 's · ' + task.cost + ' 算力</span>' +
              '</div>' +
              '<div class="ws-chat-msg__content">' + results + '</div>' +
              '<div class="ws-chat-msg__actions">' +
                '<button class="ws-result__action" data-action="rerun">↻ 重新生成</button>' +
                '<button class="ws-result__action ws-result__action--primary" data-action="view">' + meta.primary + '</button>' +
                '<button class="ws-result__action" data-action="secondary">' + sec1 + '</button>' +
                '<button class="ws-result__action" data-action="save">' + sec2 + '</button>' +
              '</div>' +
            '</div>' +
          '</div>' +
        '</div>' +
        // AK: Chat input 框（追问 / 继续对话）
        '<div class="ws-chat-input">' +
          '<div class="ws-chat-input__avatar" style="background:' + expert.avatar.gradient + ';">' + expert.avatar.emoji + '</div>' +
          '<textarea class="ws-chat-input__field" id="wsChatInput" placeholder="继续对话 · 追问、补充需求、让 ' + expert.name + ' 调整..." maxlength="500"></textarea>' +
          '<button class="ws-chat-input__send" id="wsChatSend" type="button">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>' +
          '</button>' +
        '</div>' +
      '</div>' +
      '<button class="ws-dispatch__submit" id="wsDispatchReset" type="button" style="background: linear-gradient(135deg, #8B8B9E, #6E6E84); box-shadow: none;">← 返回继续发需求</button>'
    );
    if (HAS_GSAP) {
      gsap.fromTo('.ws-result', { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.4)' });
    }
    document.getElementById('wsDispatchReset').addEventListener('click', renderCenter);
    // AK: Chat input 框交互
    const wsChatInput = document.getElementById('wsChatInput');
    const wsChatSend = document.getElementById('wsChatSend');
    if (wsChatInput && wsChatSend) {
      const sendFollowup = () => {
        const text = wsChatInput.value.trim();
        if (!text) return;
        // AN: 检查 Token 余额（追问也要扣）
        const currentCost = expert.cost;
        if (quotaBalance < currentCost) {
          alert('Token 余额不足！请到算力中心充值。');
          return;
        }
        // AN: 扣 Token + 更新 UI（数字滚动动画）
        quotaBalance -= currentCost;
        consumedToday += currentCost;
        updateQuotaUI();
        // 1. 追加 user 气泡（含消耗算力标记）
        const stream = document.getElementById('wsChatStream');
        const userMsg = document.createElement('div');
        userMsg.className = 'ws-chat-msg ws-chat-msg--user';
        userMsg.innerHTML = '<div class="ws-chat-msg__bubble"><div class="ws-chat-msg__meta"><span class="ws-chat-msg__tag">追问</span><span class="ws-chat-msg__time">' + new Date().toLocaleTimeString('zh-CN', {hour: '2-digit', minute: '2-digit'}) + ' · ⚡' + currentCost + '</span></div><div class="ws-chat-msg__text">' + text + '</div></div><div class="ws-chat-msg__avatar ws-chat-msg__avatar--user">你</div>';
        stream.appendChild(userMsg);
        wsChatInput.value = '';
        stream.scrollTop = stream.scrollHeight;
        // 2. 显示 typing 指示器
        const typingMsg = document.createElement('div');
        typingMsg.className = 'ws-chat-msg ws-chat-msg--ai ws-chat-msg--typing';
        typingMsg.innerHTML = '<div class="ws-chat-msg__avatar" style="background:' + expert.avatar.gradient + ';">' + expert.avatar.emoji + '</div><div class="ws-chat-msg__bubble"><div class="ws-chat-msg__meta"><span class="ws-chat-msg__tag ws-chat-msg__tag--ai">' + expert.name + '</span><span class="ws-chat-msg__time">思考中...</span></div><div class="ws-typing ws-typing--lg"><span class="ws-typing__dot"></span><span class="ws-typing__dot"></span><span class="ws-typing__dot"></span></div></div>';
        stream.appendChild(typingMsg);
        if (HAS_GSAP) gsap.fromTo(typingMsg, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.3 });
        stream.scrollTop = stream.scrollHeight;
        // 3. 1.5s 后追加 AI 气泡
        setTimeout(() => {
          typingMsg.remove();
          // 创建一个虚拟 task 给 generateResult 用
          const followupTask = { id: 'F' + Date.now(), requirement: text, cost: currentCost, timeMs: expert.timeMs };
          const aiContent = generateResult(expert, followupTask);
          const aiMsg = document.createElement('div');
          aiMsg.className = 'ws-chat-msg ws-chat-msg--ai';
          aiMsg.innerHTML = '<div class="ws-chat-msg__avatar" style="background:' + expert.avatar.gradient + ';">' + expert.avatar.emoji + '</div><div class="ws-chat-msg__bubble"><div class="ws-chat-msg__meta"><span class="ws-chat-msg__tag ws-chat-msg__tag--ai">' + expert.name + '</span><span class="ws-chat-msg__time">' + new Date().toLocaleTimeString('zh-CN', {hour: '2-digit', minute: '2-digit'}) + ' · 追问回复 · ⚡' + currentCost + ' 算力</span></div><div class="ws-chat-msg__content">' + aiContent + '</div></div>';
          stream.appendChild(aiMsg);
          if (HAS_GSAP) gsap.fromTo(aiMsg, { opacity: 0, y: 8, scale: 0.96 }, { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: 'back.out(1.4)' });
          stream.scrollTop = stream.scrollHeight;
          // AN: 写入历史需求（不消耗 HISTORY_MAX 槽位，但写一条 summary 记录）
          taskCounter++;
          const fTaskId = 'F' + String(taskCounter).padStart(3, '0');
          resultHistory.unshift({
            taskId: fTaskId,
            expertId: expert.id,
            expertName: expert.name,
            avatar: expert.avatar,
            cost: currentCost,
            requirement: text,
            resultSummary: '追问 · ' + text.substring(0, 18) + (text.length > 18 ? '...' : ''),
            isFollowup: true
          });
          while (resultHistory.length > HISTORY_MAX) resultHistory.pop();
          renderHistory();
        }, 1500);
      };
      wsChatSend.addEventListener('click', sendFollowup);
      wsChatInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          sendFollowup();
        }
      });
    }
    renderHistory();
    center.querySelectorAll('.ws-result__action').forEach(btn => {
      btn.addEventListener('click', () => {
        const action = btn.dataset.action;
        // 存当前 result 到全局，供 modal 使用
        currentResult = { expert: expert, task: task, html: results, fullHtml: center.innerHTML };
        if (action === 'view') {
          openResultModal(task, expert, results);
        } else if (action === 'apply') {
          btn.textContent = '✓ 已采纳';
          btn.disabled = true;
        } else if (action === 'save') {
          btn.textContent = '✓ 已收藏';
          btn.disabled = true;
        } else if (action === 'rerun') {
          btn.textContent = '↻ 生成中...';
        }
      });
    });
  }

  function generateResult(expert, task) {
    const samples = {
      sales: '已为客户「' + (task.requirement.substring(0, 20) || '意向客户') + '...」生成接管话术，半自动模式已开启。AI 已识别 12 条高意向对话，自动推送报价单 3 份，预计转化率提升 23%。',
      brand: '基于「' + (task.requirement.substring(0, 20) || '品牌') + '...」已生成 4 个 Logo 方案 + VI 系统预览。风格涵盖简约 / 复古 / 科技 / 卡通，最佳方案采纳率 78%。',
      writing: '已生成 856 字公众号文章《' + (task.requirement.substring(0, 16) || 'AI Agent') + '...》，含 3 个金句 + SEO 关键词 5 个。预测阅读量 12k+，爆款概率 67%。',
      audio: '已转录会议音频 ' + (task.timeMs / 1000).toFixed(0) + ' 秒，识别准确率 98.5%。智能纪要 6 条重点 + 待办 4 项，已发送至参会人。',
      video: '已生成 60 秒短视频片段，数字人主播 + AI 配音 + 自动字幕。3 套封面备选，平台适配（抖音 / 视频号 / 小红书）。',
      data: '已分析 ' + task.cost + ' 条数据，生成趋势预测 3 个 + 异常预警 2 条。关键洞察：本周消费增长 +12.4%，建议加强 B 端运营。',
      fengshui: '已为您完成八字排盘 + 流年大运分析。2026 年事业运势 ★★★★☆，建议春季（3-5 月）主动出击，避免冬季重大决策。',
      zodiac: '基于您的需求「' + (task.requirement.substring(0, 16) || '运势') + '...」已生成 12 星座本周运势 + 1 对 1 星盘解读。狮子座本周桃花最旺。'
    };
    return samples[expert.id] || '已为 ' + expert.name + ' 生成结果，采纳即可应用到工作流。';
  }

  // AM: 生成 1 句话 result 摘要（给 history 小卡片用）
  function generateResultSummary(expert, task) {
    const summary = {
      sales:    '已生成 12 句话术 · 半自动接管 · 23% 转化提升',
      brand:    '已生成 4 套 Logo + VI 系统 · 最佳方案采纳 78%',
      writing:  '已生成 856 字文章 · 3 个金句 · 预测阅读 12k+',
      audio:    '已转录 ' + (task.timeMs / 1000).toFixed(0) + 's 会议 · 准确率 98.5%',
      video:    '已生成 60s 短视频 · 数字人主播 · 3 平台适配',
      data:     '已分析 ' + task.cost + ' 条数据 · 3 个趋势预测',
      fengshui: '八字排盘完成 · 2026 事业 ★★★★☆ · 春季宜攻',
      zodiac:   '12 星座运势已生成 · 狮子/水瓶桃花最旺'
    };
    return summary[expert.id] || expert.name + '已生成结果';
  }

  /* ---------- 7.5. V4.2 大图 modal + 复制分享 + 历史对比 ---------- */
  let currentResult = null;          // 当前结果详情（供 modal 用）
  const resultHistory = [];          // 历史派单结果（最多 3 条）
  const HISTORY_MAX = 3;

  function openResultModal(task, expert, contentText) {
    const modal = document.getElementById('wsResultModal');
    const avatar = document.getElementById('wsResultAvatar');
    const name = document.getElementById('wsResultExpertName');
    const meta = document.getElementById('wsResultExpertMeta');
    const body = document.getElementById('wsResultModalBody');
    if (!modal) return;

    avatar.textContent = expert.avatar.emoji;
    avatar.style.background = expert.avatar.gradient;
    name.textContent = expert.name;
    meta.textContent = task.id + ' · ' + task.cost + ' 算力 · 完成于 ' + new Date().toLocaleTimeString('zh-CN', {hour: '2-digit', minute: '2-digit'});
    body.innerHTML = buildResultBody(expert, task, contentText);

    // 按专家类型定制 footer 按钮文字
    const footerLabels = {
      sales:    { copy: '复制话术', share: '应用到对话' },
      brand:    { copy: '下载源文件', share: '下载 VI 套件' },
      writing:  { copy: '复制全文', share: '一键发布' },
      audio:    { copy: '复制纪要', share: '发送纪要' },
      video:    { copy: '复制链接', share: '多平台发布' },
      data:     { copy: '复制摘要', share: '导出 PDF' },
      fengshui: { copy: '复制八字', share: '分享解析' },
      zodiac:   { copy: '复制运势', share: '分享给朋友' }
    };
    const labels = footerLabels[expert.id] || { copy: '复制内容', share: '分享' };
    const copyBtn = document.getElementById('wsResultCopy');
    const shareBtn = document.getElementById('wsResultShare');
    if (copyBtn) copyBtn.textContent = labels.copy;
    if (shareBtn) shareBtn.textContent = labels.share;

    modal.dataset.state = 'open';
    if (HAS_GSAP) {
      gsap.fromTo(body, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.4, ease: 'power3.out', delay: 0.1 });
    }
  }

  function closeResultModal() {
    const modal = document.getElementById('wsResultModal');
    if (modal) modal.dataset.state = 'closed';
  }

  function openShareModal(task) {
    const modal = document.getElementById('wsShareModal');
    if (!modal) return;
    const link = document.getElementById('wsShareLink');
    if (link && task) link.value = 'https://umakex.com/share/' + task.id;
    modal.dataset.state = 'open';
  }

  function closeShareModal() {
    const modal = document.getElementById('wsShareModal');
    if (modal) modal.dataset.state = 'closed';
  }

  // 复制到剪贴板（带 fallback）
  function copyToClipboard(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }
    // fallback
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); } catch (e) {}
    document.body.removeChild(ta);
    return Promise.resolve();
  }

  // 不同专家的丰富内容（HTML）
  function buildResultBody(expert, task, plainText) {
    const req = task.requirement.substring(0, 30);
    const id = task.id;
    const time = new Date().toLocaleTimeString('zh-CN', {hour: '2-digit', minute: '2-digit'});

    if (expert.id === 'sales') {
      return (
        '<div class="ws-mr-section">' +
          '<div class="ws-mr-section__title">客户对话接管 · 半自动模式</div>' +
          '<div class="ws-mr-chat">' +
            '<div class="ws-mr-msg ws-mr-msg--other">' +
              '<div>客户「' + req + '...」你好，请问 8000 套餐送什么礼品？</div>' +
              '<div class="ws-mr-msg__time">' + time + '</div>' +
            '</div>' +
            '<div class="ws-mr-msg ws-mr-msg--self">' +
              '<div>小明兄！赶上 618 活动，打 9 折 7200，再送 800 礼盒 👀</div>' +
              '<div class="ws-mr-msg__time">' + time + ' · 🤖 AI</div>' +
            '</div>' +
          '</div>' +
        '</div>' +
        '<div class="ws-mr-section">' +
          '<div class="ws-mr-section__title">AI 策略说明</div>' +
          '<div class="ws-mr-section__content">用 9 折 + 礼品升级回应客户对性价比的顾虑，「锁定名额」制造紧迫感。预计提升成交概率 <strong>25%</strong>。</div>' +
          '<div class="ws-mr-tags">' +
            '<span class="ws-mr-tag ws-mr-tag--green">强购买意向</span>' +
            '<span class="ws-mr-tag">成交 78%</span>' +
            '<span class="ws-mr-tag ws-mr-tag--gold">紧迫感</span>' +
          '</div>' +
        '</div>'
      );
    }

    if (expert.id === 'brand') {
      return (
        '<div class="ws-mr-section">' +
          '<div class="ws-mr-section__title">Logo 设计方案 · 4 套</div>' +
          '<div class="ws-mr-logos">' +
            '<div class="ws-mr-logo is-best"><span class="ws-mr-logo__rate">★ 78%</span><div class="ws-mr-logo__icon" style="background: linear-gradient(135deg, #7C5CFF, #B695FF); width:56px;height:56px;border-radius:14px;display:flex;align-items:center;justify-content:center;color:white;font-size:24px;font-weight:800;">U</div><div class="ws-mr-logo__name">简约现代</div></div>' +
            '<div class="ws-mr-logo"><span class="ws-mr-logo__rate">68%</span><div class="ws-mr-logo__icon" style="background: linear-gradient(135deg, #FFD700, #FF8C42); width:56px;height:56px;border-radius:14px;display:flex;align-items:center;justify-content:center;color:white;font-size:24px;font-weight:800;">U</div><div class="ws-mr-logo__name">复古风格</div></div>' +
            '<div class="ws-mr-logo"><span class="ws-mr-logo__rate">62%</span><div class="ws-mr-logo__icon" style="background: linear-gradient(135deg, #07C160, #4DD890); width:56px;height:56px;border-radius:14px;display:flex;align-items:center;justify-content:center;color:white;font-size:24px;font-weight:800;">U</div><div class="ws-mr-logo__name">科技感</div></div>' +
            '<div class="ws-mr-logo"><span class="ws-mr-logo__rate">55%</span><div class="ws-mr-logo__icon" style="background: linear-gradient(135deg, #E54B4B, #FF7B7B); width:56px;height:56px;border-radius:14px;display:flex;align-items:center;justify-content:center;color:white;font-size:24px;font-weight:800;">U</div><div class="ws-mr-logo__name">卡通</div></div>' +
          '</div>' +
        '</div>' +
        '<div class="ws-mr-section">' +
          '<div class="ws-mr-section__title">推荐方案</div>' +
          '<div class="ws-mr-section__content">首推「简约现代」（紫色主调），契合 UMakex 科技 + 高端定位，已自动生成 VI 系统色卡 / 字体规范 / 应用场景预览。</div>' +
        '</div>'
      );
    }

    if (expert.id === 'writing') {
      return (
        '<div class="ws-mr-section">' +
          '<div class="ws-mr-section__title">公众号文章 · 已生成</div>' +
          '<div class="ws-mr-article">' +
            '<h3>' + (req || 'AI Agent') + '：让你的工作流自己跑起来</h3>' +
            '<p>早上 9 点，你还在为「今天该派哪个专家、回复哪条消息、对接哪个客户」焦头烂额的时候，你的 AI 同事已经完成了 12 项任务。</p>' +
            '<blockquote>AI Agent 不是工具，是会自己思考 + 主动干活的队友。</blockquote>' +
            '<p>本文将分享如何用协同工作台把 5 个角色的工作时间从 4 小时压缩到 30 分钟，以及 CEO + 8 专家的真实调度逻辑。</p>' +
            '<p>重点不是「装多少 AI」，而是「怎么让 AI 协同」—— 这就是 UMakex_Desktop 想做的事。</p>' +
          '</div>' +
        '</div>' +
        '<div class="ws-mr-section">' +
          '<div class="ws-mr-section__title">SEO + 预测</div>' +
          '<div class="ws-mr-tags">' +
            '<span class="ws-mr-tag">AI Agent</span>' +
            '<span class="ws-mr-tag">协同办公</span>' +
            '<span class="ws-mr-tag">☀ CEO</span>' +
            '<span class="ws-mr-tag ws-mr-tag--green">预测阅读 12k+</span>' +
            '<span class="ws-mr-tag ws-mr-tag--gold">爆款概率 67%</span>' +
          '</div>' +
        '</div>'
      );
    }

    if (expert.id === 'audio') {
      return (
        '<div class="ws-mr-section">' +
          '<div class="ws-mr-section__title">会议转录 + 智能纪要</div>' +
          '<div class="ws-mr-transcript">' +
            '<div class="ws-mr-transcript__row"><span class="ws-mr-transcript__time">00:12</span><div class="ws-mr-transcript__body"><span class="ws-mr-transcript__speaker">CEO:</span>今天主要是 Q3 OKR 复盘，我们用 AI Agent 协同平台后的效率数据。</div></div>' +
            '<div class="ws-mr-transcript__row"><span class="ws-mr-transcript__time">01:35</span><div class="ws-mr-transcript__body"><span class="ws-mr-transcript__speaker">销冠专家:</span>客户对话接管率从 32% 提升到 89%，人均转化 +18%。</div></div>' +
            '<div class="ws-mr-transcript__row"><span class="ws-mr-transcript__time">03:48</span><div class="ws-mr-transcript__body"><span class="ws-mr-transcript__speaker">CEO:</span>重点：Q4 计划接入 5 个新场景。</div></div>' +
          '</div>' +
        '</div>' +
        '<div class="ws-mr-section">' +
          '<div class="ws-mr-section__title">智能纪要</div>' +
          '<div class="ws-mr-section__content">识别准确率 98.5% · 已发送纪要给 5 位参会人 · 待办 4 项已同步到 Asana。</div>' +
        '</div>'
      );
    }

    if (expert.id === 'video') {
      return (
        '<div class="ws-mr-section">' +
          '<div class="ws-mr-video">' +
            '<div class="ws-mr-video__play">▶</div>' +
            '<div class="ws-mr-video__title">' + (req || '短视频') + ' · 60 秒成片</div>' +
            '<div class="ws-mr-video__meta">数字人主播 · 自动字幕 · 3 平台适配</div>' +
          '</div>' +
        '</div>' +
        '<div class="ws-mr-section">' +
          '<div class="ws-mr-section__title">交付物</div>' +
          '<div class="ws-mr-tags">' +
            '<span class="ws-mr-tag">抖音版 60s</span>' +
            '<span class="ws-mr-tag">视频号 60s</span>' +
            '<span class="ws-mr-tag">小红书 45s</span>' +
            '<span class="ws-mr-tag ws-mr-tag--gold">3 套封面</span>' +
          '</div>' +
        '</div>'
      );
    }

    if (expert.id === 'data') {
      return (
        '<div class="ws-mr-section">' +
          '<div class="ws-mr-section__title">数据分析报告</div>' +
          '<div class="ws-mr-stats">' +
            '<div class="ws-mr-stat"><div class="ws-mr-stat__num ws-mr-stat__num--up">+12.4%</div><div class="ws-mr-stat__label">本周消费</div></div>' +
            '<div class="ws-mr-stat"><div class="ws-mr-stat__num">4.9</div><div class="ws-mr-stat__label">平均评分</div></div>' +
            '<div class="ws-mr-stat"><div class="ws-mr-stat__num ws-mr-stat__num--up">23</div><div class="ws-mr-stat__label">今日派单</div></div>' +
            '<div class="ws-mr-stat"><div class="ws-mr-stat__num">38,500</div><div class="ws-mr-stat__label">算力余额</div></div>' +
            '<div class="ws-mr-stat"><div class="ws-mr-stat__num ws-mr-stat__num--down">2</div><div class="ws-mr-stat__label">异常预警</div></div>' +
            '<div class="ws-mr-stat"><div class="ws-mr-stat__num">4.2x</div><div class="ws-mr-stat__label">ROI</div></div>' +
          '</div>' +
        '</div>' +
        '<div class="ws-mr-section">' +
          '<div class="ws-mr-section__title">关键洞察</div>' +
          '<div class="ws-mr-section__content">本周 B 端运营贡献最大，+18% 转化率。建议：Q4 加强企微生态接入，预估 ROI 提升至 5.5x。</div>' +
        '</div>'
      );
    }

    if (expert.id === 'fengshui') {
      return (
        '<div class="ws-mr-section">' +
          '<div class="ws-mr-section__title">八字 + 大运分析</div>' +
          '<div class="ws-mr-zodiac">' +
            '<div class="ws-mr-zodiac__circle">☯</div>' +
            '<div class="ws-mr-section__content" style="text-align:center;">' +
              '<strong>乾造：甲子 戊辰 壬午 庚戌</strong><br/>' +
              '2026 丙午年 · 大运天河水 · 事业 ★★★★☆' +
            '</div>' +
          '</div>' +
        '</div>' +
        '<div class="ws-mr-section">' +
          '<div class="ws-mr-section__title">流年建议</div>' +
          '<div class="ws-mr-section__content">春季（3-5 月）主动出击最佳，秋季宜守不宜攻。冬季避免重大决策，否则破财伤身。</div>' +
        '</div>'
      );
    }

    if (expert.id === 'zodiac') {
      return (
        '<div class="ws-mr-section">' +
          '<div class="ws-mr-section__title">12 星座本周运势</div>' +
          '<div class="ws-mr-zodiac__stars">' +
            '<div class="ws-mr-zodiac__star"><div class="ws-mr-zodiac__star-name">♈ 白羊</div><div class="ws-mr-zodiac__star-rate">★★★☆☆</div></div>' +
            '<div class="ws-mr-zodiac__star"><div class="ws-mr-zodiac__star-name">♉ 金牛</div><div class="ws-mr-zodiac__star-rate">★★★★☆</div></div>' +
            '<div class="ws-mr-zodiac__star"><div class="ws-mr-zodiac__star-name">♊ 双子</div><div class="ws-mr-zodiac__star-rate">★★★☆☆</div></div>' +
            '<div class="ws-mr-zodiac__star"><div class="ws-mr-zodiac__star-name">♋ 巨蟹</div><div class="ws-mr-zodiac__star-rate">★★★★☆</div></div>' +
            '<div class="ws-mr-zodiac__star"><div class="ws-mr-zodiac__star-name">♌ 狮子</div><div class="ws-mr-zodiac__star-rate ws-mr-zodiac__star-rate--hot">★★★★★</div></div>' +
            '<div class="ws-mr-zodiac__star"><div class="ws-mr-zodiac__star-name">♍ 处女</div><div class="ws-mr-zodiac__star-rate">★★★☆☆</div></div>' +
            '<div class="ws-mr-zodiac__star"><div class="ws-mr-zodiac__star-name">♎ 天秤</div><div class="ws-mr-zodiac__star-rate">★★★★☆</div></div>' +
            '<div class="ws-mr-zodiac__star"><div class="ws-mr-zodiac__star-name">♏ 天蝎</div><div class="ws-mr-zodiac__star-rate">★★★★☆</div></div>' +
            '<div class="ws-mr-zodiac__star"><div class="ws-mr-zodiac__star-name">♐ 射手</div><div class="ws-mr-zodiac__star-rate">★★★☆☆</div></div>' +
            '<div class="ws-mr-zodiac__star"><div class="ws-mr-zodiac__star-name">♑ 摩羯</div><div class="ws-mr-zodiac__star-rate">★★★★☆</div></div>' +
            '<div class="ws-mr-zodiac__star"><div class="ws-mr-zodiac__star-name">♒ 水瓶</div><div class="ws-mr-zodiac__star-rate">★★★★★</div></div>' +
            '<div class="ws-mr-zodiac__star"><div class="ws-mr-zodiac__star-name">♓ 双鱼</div><div class="ws-mr-zodiac__star-rate">★★★☆☆</div></div>' +
          '</div>' +
        '</div>' +
        '<div class="ws-mr-section">' +
          '<div class="ws-mr-section__title">本周桃花 + 财运</div>' +
          '<div class="ws-mr-section__content">狮子 + 水瓶本周桃花最旺，单身有望脱单。财运方面：金牛、摩羯本周有偏财机会。</div>' +
        '</div>'
      );
    }

    // fallback
    return '<div class="ws-mr-section"><div class="ws-mr-section__content">' + plainText + '</div></div>';
  }

  /* ============================================================
   * 4.8 CEO 派单：自动拆解 + 顺序执行子任务
   * ============================================================ */
  function submitCeoTask(ceo, requirement) {
    // 1. 拆解
    const subtasks = ceoRoute(requirement);
    if (subtasks.length === 0) {
      alert('CEO 拆解失败，请重新描述需求。');
      return;
    }
    // 2. 算初始总成本 = CEO 调度费 + 子任务累加
    const calcTotal = () => CEO_DISPATCH_FEE + subtasks.reduce((s, t) => s + t.cost, 0);
    let totalCost = calcTotal();
    if (quotaBalance < totalCost) {
      alert('Token 余额不足！' + ceo.name + ' 需要 ' + totalCost + ' Token（当前 ' + quotaBalance + '）。请到算力中心充值。');
      return;
    }
    // 3. 创建主任务（先不扣费，等用户确认派单再扣）
    taskCounter++;
    const taskId = 'C' + String(taskCounter).padStart(3, '0');
    const task = {
      id: taskId,
      expertId: 'ceo',
      expertName: ceo.name,
      avatar: ceo.avatar,
      requirement: requirement,
      cost: totalCost,
      timeMs: subtasks.reduce((s, t) => s + t.timeMs, 0) + 1500,
      subtasks: subtasks,
      isCeo: true,
      status: 'planning',
      progress: 0
    };
    tasks.unshift(task);
    // 4. 渲染 progress（CEO 思考阶段 + 可拖拽调整）
    renderCenterCeoProgress(ceo, task, subtasks, totalCost);
    renderTaskList();
    updateTaskCount();
  }

  // 用户点"确认派单"才真正扣费 + 开始执行子任务
  function confirmCeoDispatch(ceo, task, subtasks, totalCost) {
    // 1. 扣费
    quotaBalance -= totalCost;
    consumedToday += totalCost;
    updateQuotaUI();
    // 2. 写历史
    task.status = 'done';
    task.progress = 100;
    task.resultSummary = 'CEO · 拆 ' + subtasks.length + ' 子任务 · ' + subtasks.map(t => t.expertName.replace('专家', '')).join('+') + ' · ' + totalCost + ' token';
    resultHistory.unshift({
      taskId: task.id,
      expertId: 'ceo',
      expertName: '☀ CEO',
      avatar: ceo.avatar,
      cost: totalCost,
      requirement: task.requirement,
      resultSummary: task.resultSummary,
      isCeo: true,
      subtaskCount: subtasks.length
    });
    while (resultHistory.length > HISTORY_MAX) resultHistory.pop();
    // 3. 渲染 result
    renderCenterCeoResult(ceo, task, subtasks, totalCost);
  }

  // 拖拽重分配子任务
  function assignSubtaskToExpert(ceo, task, subtasks, idx, newExpertId) {
    const newExpert = EXPERTS.find(e => e.id === newExpertId);
    if (!newExpert) return;
    const sub = subtasks[idx];
    if (sub.expertId === newExpertId) return;
    const oldExpertId = sub.expertId;
    const oldCost = sub.cost;
    sub.expertId = newExpert.id;
    sub.expertName = newExpert.name;
    sub.avatar = newExpert.avatar;
    sub.cost = newExpert.cost;
    sub.timeMs = newExpert.timeMs;
    sub.taskName = synthesizeSubtaskName(newExpert.id, task.requirement);
    // 重算 totalCost
    const newTotalCost = CEO_DISPATCH_FEE + subtasks.reduce((s, t) => s + t.cost, 0);
    const oldTotalCost = task.cost;
    task.cost = newTotalCost;
    task.timeMs = subtasks.reduce((s, t) => s + t.timeMs, 0) + 1500;
    // 重渲染 plan（保留其他状态）
    rerenderCeoPlan(ceo, task, subtasks, newTotalCost);
    // A1: 高亮 flash + cost 数字 pulse
    const newItem = document.querySelector('.ws-ceo-plan__item[data-sub-idx="' + idx + '"]');
    if (newItem) {
      newItem.classList.add('is-just-dropped');
      setTimeout(() => newItem.classList.remove('is-just-dropped'), 850);
      const costEl = newItem.querySelector('.ws-ceo-plan__cost');
      if (costEl) {
        costEl.classList.add('is-just-dropped');
        setTimeout(() => costEl.classList.remove('is-just-dropped'), 720);
      }
    }
    // A2: drop toast
    const oldExpert = EXPERTS.find(e => e.id === oldExpertId);
    const delta = newExpert.cost - oldCost;
    const deltaText = delta > 0 ? '+' + delta : (delta < 0 ? String(delta) : '±0');
    showDropToast({
      fromName: oldExpert ? oldExpert.name : '原专家',
      toName: newExpert.name,
      toEmoji: newExpert.avatar.emoji,
      deltaText: deltaText,
      fromTotalCost: oldTotalCost,
      toTotalCost: newTotalCost
    });
  }

  // A2: 顶部 toast 提示（drop 重分配后）
  function showDropToast(opts) {
    // 同时只显示 1 个，先清掉旧的
    document.querySelectorAll('.ws-drop-toast').forEach(el => el.remove());
    const el = document.createElement('div');
    el.className = 'ws-drop-toast';
    el.innerHTML =
      '<span class="ws-drop-toast__icon">' + (opts.toEmoji || '★') + '</span>' +
      '<span>已分配 · ' + (opts.fromName || '原专家') + ' → ' + opts.toName + '</span>' +
      '<span class="ws-drop-toast__delta">成本 ' + opts.deltaText + '</span>' +
      '<span style="opacity:0.55;">· 总额 ' + opts.fromTotalCost + ' → ' + opts.toTotalCost + '</span>';
    document.body.appendChild(el);
    // 1500ms 后开始淡出，300ms 后移除
    setTimeout(() => {
      el.classList.add('is-leaving');
      setTimeout(() => el.remove(), 260);
    }, 1500);
  }

  // 重新渲染 plan 区域（不重建整个 center）
  function rerenderCeoPlan(ceo, task, subtasks, totalCost) {
    const plan = document.querySelector('.ws-ceo-plan');
    if (!plan) return;
    const planHtml = subtasks.map((t, i) =>
      '<div class="ws-ceo-plan__item" data-sub-idx="' + i + '" draggable="true">' +
        '<span class="ws-ceo-plan__grip">⋮⋮</span>' +
        '<span class="ws-ceo-plan__index">' + (i + 1) + '</span>' +
        '<span class="ws-ceo-plan__avatar" style="background:' + t.avatar.gradient + ';">' + t.avatar.emoji + '</span>' +
        '<span class="ws-ceo-plan__name">' + t.expertName + '</span>' +
        '<span class="ws-ceo-plan__task">' + t.taskName + '</span>' +
        '<span class="ws-ceo-plan__cost">⚡' + t.cost + '</span>' +
      '</div>'
    ).join('');
    plan.innerHTML =
      '<div class="ws-ceo-plan__head">📋 调度计划 · 拖拽子任务可调整分配</div>' +
      planHtml +
      '<div class="ws-ceo-plan__total">调度费 ' + CEO_DISPATCH_FEE + ' + 子任务 ' + (totalCost - CEO_DISPATCH_FEE) + ' = <strong>' + totalCost + ' Token</strong></div>';
    // 重绑拖拽 + 确认按钮
    setupCeoPlanDrag(ceo, task, subtasks, totalCost);
  }

  // 拖拽监听
  function setupCeoPlanDrag(ceo, task, subtasks, totalCost) {
    const planItems = document.querySelectorAll('.ws-ceo-plan__item[data-sub-idx]');
    planItems.forEach(item => {
      item.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', item.dataset.subIdx);
        e.dataTransfer.effectAllowed = 'move';
        item.classList.add('is-dragging');
      });
      item.addEventListener('dragend', () => {
        item.classList.remove('is-dragging');
        document.querySelectorAll('.ws-expert-row').forEach(r => r.classList.remove('is-drop-target'));
      });
    });
    document.querySelectorAll('.ws-expert-row').forEach(row => {
      // CEO 是调度员，不作为 drop target
      if (row.dataset.id === 'ceo') {
        row.addEventListener('dragover', (e) => {
          e.dataTransfer.dropEffect = 'none';
        });
        return;
      }
      row.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        row.classList.add('is-drop-target');
      });
      row.addEventListener('dragleave', () => {
        row.classList.remove('is-drop-target');
      });
      row.addEventListener('drop', (e) => {
        e.preventDefault();
        row.classList.remove('is-drop-target');
        const idx = parseInt(e.dataTransfer.getData('text/plain'), 10);
        const newExpertId = row.dataset.id;
        if (isNaN(idx) || !newExpertId) return;
        assignSubtaskToExpert(ceo, task, subtasks, idx, newExpertId);
      });
    });
    // 确认派单按钮
    const confirmBtn = document.getElementById('wsCeoConfirm');
    if (confirmBtn) {
      confirmBtn.onclick = () => {
        // 余额再次检查
        if (quotaBalance < task.cost) {
          alert('Token 余额不足！需要 ' + task.cost + ' Token（当前 ' + quotaBalance + '）。请到算力中心充值。');
          return;
        }
        confirmCeoDispatch(ceo, task, subtasks, task.cost);
      };
    }
  }

  // CEO 思考阶段（含可拖拽调整 + 确认派单）
  function renderCenterCeoProgress(ceo, task, subtasks, totalCost) {
    const center = document.getElementById('wsCenter');
    if (!center) return;
    const planHtml = subtasks.map((t, i) =>
      '<div class="ws-ceo-plan__item" data-sub-idx="' + i + '" draggable="true">' +
        '<span class="ws-ceo-plan__grip">⋮⋮</span>' +
        '<span class="ws-ceo-plan__index">' + (i + 1) + '</span>' +
        '<span class="ws-ceo-plan__avatar" style="background:' + t.avatar.gradient + ';">' + t.avatar.emoji + '</span>' +
        '<span class="ws-ceo-plan__name">' + t.expertName + '</span>' +
        '<span class="ws-ceo-plan__task">' + t.taskName + '</span>' +
        '<span class="ws-ceo-plan__cost">⚡' + t.cost + '</span>' +
      '</div>'
    ).join('');
    center.innerHTML = (
      '<div class="ws-ceo-progress">' +
        '<div class="ws-ceo-progress__head">' +
          '<div class="ws-ceo-progress__avatar" style="background:' + ceo.avatar.gradient + ';">' + ceo.avatar.emoji + '</div>' +
          '<div class="ws-ceo-progress__head-body">' +
            '<div class="ws-ceo-progress__title">★ CEO 已完成拆解 · 待你确认' +
              '<span class="ws-typing"><span class="ws-typing__dot"></span><span class="ws-typing__dot"></span><span class="ws-typing__dot"></span></span>' +
            '</div>' +
            '<div class="ws-ceo-progress__sub">已识别 ' + subtasks.length + ' 个子任务 · 总消耗 ' + totalCost + ' Token</div>' +
          '</div>' +
        '</div>' +
        '<div class="ws-ceo-plan">' +
          '<div class="ws-ceo-plan__head">📋 调度计划 · 拖拽子任务可调整分配</div>' +
          planHtml +
          '<div class="ws-ceo-plan__total">调度费 ' + CEO_DISPATCH_FEE + ' + 子任务 ' + (totalCost - CEO_DISPATCH_FEE) + ' = <strong>' + totalCost + ' Token</strong></div>' +
        '</div>' +
        '<div class="ws-ceo-confirm">' +
          '<span class="ws-ceo-confirm__hint">拖拽子任务到左侧专家行调整 · 点确认后扣费</span>' +
          '<button class="ws-ceo-confirm__btn" id="wsCeoConfirm" type="button">✓ 确认派单</button>' +
        '</div>' +
      '</div>'
    );
    if (HAS_GSAP) {
      gsap.fromTo('.ws-ceo-progress', { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.4, ease: 'power3.out' });
    }
    // 测试模式：立即设到目标态，绕过 headless 截图捕获动画中间帧
    if (location.search.indexOf('test=au') !== -1) {
      if (HAS_GSAP) gsap.set('.ws-ceo-progress', { opacity: 1, y: 0, clearProps: 'opacity,y' });
    }
    // 绑定拖拽 + 确认派单
    setupCeoPlanDrag(ceo, task, subtasks, totalCost);
  }

  // CEO 计划 + 子任务执行流（chat 视觉）
  function renderCenterCeoResult(ceo, task, subtasks, totalCost) {
    const center = document.getElementById('wsCenter');
    if (!center) return;
    // 1. 计算每个子任务的累计时间（用于排序 setTimeout）
    let cumTime = 800; // 起始 0.8s
    const subTimings = subtasks.map(t => {
      const start = cumTime;
      cumTime += t.timeMs;
      return { start, end: cumTime };
    });
    // 2. 渲染初始骨架
    const planHtml = subtasks.map((t, i) =>
      '<div class="ws-ceo-plan__item" data-sub-idx="' + i + '">' +
        '<span class="ws-ceo-plan__index">' + (i + 1) + '</span>' +
        '<span class="ws-ceo-plan__avatar" style="background:' + t.avatar.gradient + ';">' + t.avatar.emoji + '</span>' +
        '<span class="ws-ceo-plan__name">' + t.expertName + '</span>' +
        '<span class="ws-ceo-plan__task">' + t.taskName + '</span>' +
        '<span class="ws-ceo-plan__cost">⚡' + t.cost + '</span>' +
      '</div>'
    ).join('');
    center.innerHTML = (
      '<div class="ws-result">' +
        '<div class="ws-result__head">' +
          '<div class="ws-result__title">★ CEO 已调度完成 · 拆 ' + subtasks.length + ' 子任务</div>' +
          '<div class="ws-result__cost">消耗 ' + totalCost + ' 算力</div>' +
        '</div>' +
        // Chat 模式：用户气泡 + CEO 计划气泡 + 子任务流
        '<div class="ws-chat-stream" id="wsChatStream">' +
          // 用户气泡
          '<div class="ws-chat-msg ws-chat-msg--user">' +
            '<div class="ws-chat-msg__bubble">' +
              '<div class="ws-chat-msg__meta">' +
                '<span class="ws-chat-msg__tag">→ 发给 CEO</span>' +
                '<span class="ws-chat-msg__time">' + new Date().toLocaleTimeString('zh-CN', {hour: '2-digit', minute: '2-digit'}) + '</span>' +
              '</div>' +
              '<div class="ws-chat-msg__text">' + task.requirement + '</div>' +
            '</div>' +
            '<div class="ws-chat-msg__avatar ws-chat-msg__avatar--user">你</div>' +
          '</div>' +
          // CEO 计划气泡
          '<div class="ws-chat-msg ws-chat-msg--ai ws-chat-msg--ceo">' +
            '<div class="ws-chat-msg__avatar" style="background:' + ceo.avatar.gradient + ';">' + ceo.avatar.emoji + '</div>' +
            '<div class="ws-chat-msg__bubble ws-chat-msg__bubble--ceo">' +
              '<div class="ws-chat-msg__meta">' +
                '<span class="ws-chat-msg__tag ws-chat-msg__tag--ceo">☀ CEO</span>' +
                '<span class="ws-chat-msg__time">' + new Date().toLocaleTimeString('zh-CN', {hour: '2-digit', minute: '2-digit'}) + ' · ⚡' + totalCost + ' token</span>' +
              '</div>' +
              '<div class="ws-chat-msg__content">' +
                '<div class="ws-ceo-plan__head">📋 调度计划 · ' + subtasks.length + ' 子任务</div>' +
                planHtml +
                '<div class="ws-ceo-plan__total">调度费 ' + CEO_DISPATCH_FEE + ' + 子任务 ' + (totalCost - CEO_DISPATCH_FEE) + ' = <strong>' + totalCost + ' Token</strong></div>' +
              '</div>' +
            '</div>' +
          '</div>' +
          // 子任务流容器（动态注入）
          '<div class="ws-ceo-subtask-list" id="wsCeoSubtaskList"></div>' +
          // 完成横幅（初始隐藏）
          '<div class="ws-ceo-complete" id="wsCeoComplete" style="display:none;">' +
            '<div class="ws-ceo-complete__icon">✓</div>' +
            '<div class="ws-ceo-complete__text">全部完成 · ' + subtasks.length + ' 子任务 · 消耗 ' + totalCost + ' token</div>' +
          '</div>' +
        '</div>' +
        // AK: input 框
        '<div class="ws-chat-input">' +
          '<div class="ws-chat-input__avatar" style="background:' + ceo.avatar.gradient + ';">' + ceo.avatar.emoji + '</div>' +
          '<textarea class="ws-chat-input__field" id="wsChatInput" placeholder="继续发需求 · CEO 会重新拆解并调度..." maxlength="500"></textarea>' +
          '<button class="ws-chat-input__send" id="wsChatSend" type="button">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>' +
          '</button>' +
        '</div>' +
      '</div>' +
      '<button class="ws-dispatch__submit" id="wsDispatchReset" type="button" style="background: linear-gradient(135deg, #8B8B9E, #6E6E84); box-shadow: none;">← 返回继续发需求</button>'
    );
    if (HAS_GSAP) {
      gsap.fromTo('.ws-result', { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.4)' });
    }
    document.getElementById('wsDispatchReset').addEventListener('click', renderCenter);
    // AK: 追问（CEO 模式追问 = 重新拆解）
    setupCeoChatInput(ceo, totalCost);
    renderHistory();

    // 3. 顺序执行子任务（按时序 setTimeout）
    const stream = document.getElementById('wsCeoSubtaskList');
    subtasks.forEach((sub, idx) => {
      const timing = subTimings[idx];
      setTimeout(() => {
        // 推送"派给 X 专家" + typing
        const dispatchHtml =
          '<div class="ws-chat-msg ws-chat-msg--user" data-sub-task="' + sub.expertId + '">' +
            '<div class="ws-chat-msg__bubble">' +
              '<div class="ws-chat-msg__meta">' +
                '<span class="ws-chat-msg__tag">→ 子任务 ' + (idx + 1) + ' · ' + sub.expertName + '</span>' +
                '<span class="ws-chat-msg__time">执行中</span>' +
              '</div>' +
              '<div class="ws-chat-msg__text">' + sub.taskName + '</div>' +
            '</div>' +
            '<div class="ws-chat-msg__avatar ws-chat-msg__avatar--user">你</div>' +
          '</div>' +
          '<div class="ws-chat-msg ws-chat-msg--ai ws-chat-msg--typing">' +
            '<div class="ws-chat-msg__avatar" style="background:' + sub.avatar.gradient + ';">' + sub.avatar.emoji + '</div>' +
            '<div class="ws-chat-msg__bubble">' +
              '<div class="ws-chat-msg__meta">' +
                '<span class="ws-chat-msg__tag ws-chat-msg__tag--ai">' + sub.expertName + '</span>' +
                '<span class="ws-chat-msg__time">子任务 ' + (idx + 1) + '/' + subtasks.length + ' · 处理中...</span>' +
              '</div>' +
              '<div class="ws-typing ws-typing--lg"><span class="ws-typing__dot"></span><span class="ws-typing__dot"></span><span class="ws-typing__dot"></span></div>' +
            '</div>' +
          '</div>';
        stream.insertAdjacentHTML('beforeend', dispatchHtml);
        if (typeof wsChatStream !== 'undefined' && wsChatStream) wsChatStream.scrollTop = wsChatStream.scrollHeight;
        // 子任务完成（timeMs 后）
        setTimeout(() => {
          // 移除 typing（找最后一个 typing msg）
          const typingMsgs = stream.querySelectorAll('.ws-chat-msg--typing');
          const lastTyping = typingMsgs[typingMsgs.length - 1];
          if (lastTyping) lastTyping.remove();
          // 推送 AI 完成
          const subTask = { id: 'S' + sub.index, requirement: sub.taskName, cost: sub.cost, timeMs: sub.timeMs };
          const subExpert = EXPERTS.find(e => e.id === sub.expertId);
          const subContent = generateResult(subExpert, subTask);
          const completeHtml =
            '<div class="ws-chat-msg ws-chat-msg--ai">' +
              '<div class="ws-chat-msg__avatar" style="background:' + sub.avatar.gradient + ';">' + sub.avatar.emoji + '</div>' +
              '<div class="ws-chat-msg__bubble">' +
                '<div class="ws-chat-msg__meta">' +
                  '<span class="ws-chat-msg__tag ws-chat-msg__tag--ai">' + sub.expertName + '</span>' +
                  '<span class="ws-chat-msg__time">子任务 ' + (idx + 1) + '/' + subtasks.length + ' · ✓ 完成 · ⚡' + sub.cost + ' token</span>' +
                '</div>' +
                '<div class="ws-chat-msg__content">' + subContent + '</div>' +
              '</div>' +
            '</div>';
          stream.insertAdjacentHTML('beforeend', completeHtml);
          if (HAS_GSAP) {
            const last = stream.lastElementChild;
            if (last) gsap.fromTo(last, { opacity: 0, y: 8, scale: 0.96 }, { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: 'back.out(1.4)' });
          }
          // 所有子任务完成
          if (idx === subtasks.length - 1) {
            setTimeout(() => {
              const completeEl = document.getElementById('wsCeoComplete');
              if (completeEl) {
                completeEl.style.display = 'flex';
                if (HAS_GSAP) gsap.fromTo(completeEl, { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.4)' });
              }
            }, 300);
          }
        }, Math.max(800, sub.timeMs));
      }, timing.start);
    });
  }

  // CEO 模式 input 框
  function setupCeoChatInput(ceo, originalTotalCost) {
    const wsChatInput = document.getElementById('wsChatInput');
    const wsChatSend = document.getElementById('wsChatSend');
    if (!wsChatInput || !wsChatSend) return;
    const sendFollowup = () => {
      const text = wsChatInput.value.trim();
      if (!text) return;
      const followupSubtasks = ceoRoute(text);
      if (followupSubtasks.length === 0) {
        alert('拆解失败，请重新描述。');
        return;
      }
      const followupCost = CEO_DISPATCH_FEE + followupSubtasks.reduce((s, t) => s + t.cost, 0);
      if (quotaBalance < followupCost) {
        alert('Token 余额不足！CEO 追问需要 ' + followupCost + ' Token。');
        return;
      }
      quotaBalance -= followupCost;
      consumedToday += followupCost;
      updateQuotaUI();
      // 追加 user 气泡
      const stream = document.getElementById('wsChatStream');
      const userMsg = document.createElement('div');
      userMsg.className = 'ws-chat-msg ws-chat-msg--user';
      userMsg.innerHTML = '<div class="ws-chat-msg__bubble"><div class="ws-chat-msg__meta"><span class="ws-chat-msg__tag">追问</span><span class="ws-chat-msg__time">' + new Date().toLocaleTimeString('zh-CN', {hour: '2-digit', minute: '2-digit'}) + ' · ⚡' + followupCost + '</span></div><div class="ws-chat-msg__text">' + text + '</div></div><div class="ws-chat-msg__avatar ws-chat-msg__avatar--user">你</div>';
      stream.appendChild(userMsg);
      wsChatInput.value = '';
      stream.scrollTop = stream.scrollHeight;
      // 隐藏完成横幅
      const completeEl = document.getElementById('wsCeoComplete');
      if (completeEl) completeEl.style.display = 'none';
      // CEO 拆解提示
      const typingMsg = document.createElement('div');
      typingMsg.className = 'ws-chat-msg ws-chat-msg--ai ws-chat-msg--typing';
      typingMsg.innerHTML = '<div class="ws-chat-msg__avatar" style="background:' + ceo.avatar.gradient + ';">' + ceo.avatar.emoji + '</div><div class="ws-chat-msg__bubble"><div class="ws-chat-msg__meta"><span class="ws-chat-msg__tag ws-chat-msg__tag--ceo">☀ CEO</span><span class="ws-chat-msg__time">重新拆解...</span></div><div class="ws-typing ws-typing--lg"><span class="ws-typing__dot"></span><span class="ws-typing__dot"></span><span class="ws-typing__dot"></span></div></div>';
      stream.appendChild(typingMsg);
      stream.scrollTop = stream.scrollHeight;
      setTimeout(() => {
        typingMsg.remove();
        // 推 CEO 计划气泡
        const planHtml = followupSubtasks.map((t, i) =>
          '<div class="ws-ceo-plan__item"><span class="ws-ceo-plan__index">' + (i + 1) + '</span><span class="ws-ceo-plan__avatar" style="background:' + t.avatar.gradient + ';">' + t.avatar.emoji + '</span><span class="ws-ceo-plan__name">' + t.expertName + '</span><span class="ws-ceo-plan__task">' + t.taskName + '</span><span class="ws-ceo-plan__cost">⚡' + t.cost + '</span></div>'
        ).join('');
        const planBubble = document.createElement('div');
        planBubble.className = 'ws-chat-msg ws-chat-msg--ai ws-chat-msg--ceo';
        planBubble.innerHTML = '<div class="ws-chat-msg__avatar" style="background:' + ceo.avatar.gradient + ';">' + ceo.avatar.emoji + '</div><div class="ws-chat-msg__bubble ws-chat-msg__bubble--ceo"><div class="ws-chat-msg__meta"><span class="ws-chat-msg__tag ws-chat-msg__tag--ceo">☀ CEO</span><span class="ws-chat-msg__time">追问拆解 · 拆 ' + followupSubtasks.length + ' 子任务 · ⚡' + followupCost + ' token</span></div><div class="ws-chat-msg__content"><div class="ws-ceo-plan__head">📋 追问计划</div>' + planHtml + '<div class="ws-ceo-plan__total">调度费 ' + CEO_DISPATCH_FEE + ' + 子任务 ' + (followupCost - CEO_DISPATCH_FEE) + ' = <strong>' + followupCost + ' Token</strong></div></div></div>';
        stream.appendChild(planBubble);
        if (HAS_GSAP) gsap.fromTo(planBubble, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.4, ease: 'back.out(1.4)' });
        stream.scrollTop = stream.scrollHeight;
        // 顺序执行子任务
        let cumT = 600;
        followupSubtasks.forEach((sub, idx) => {
          const start = cumT;
          cumT += Math.max(1200, sub.timeMs);
          setTimeout(() => {
            const dispatchHtml = '<div class="ws-chat-msg ws-chat-msg--user"><div class="ws-chat-msg__bubble"><div class="ws-chat-msg__meta"><span class="ws-chat-msg__tag">→ 子任务 ' + (idx + 1) + ' · ' + sub.expertName + '</span><span class="ws-chat-msg__time">追问执行</span></div><div class="ws-chat-msg__text">' + sub.taskName + '</div></div><div class="ws-chat-msg__avatar ws-chat-msg__avatar--user">你</div></div><div class="ws-chat-msg ws-chat-msg--ai ws-chat-msg--typing"><div class="ws-chat-msg__avatar" style="background:' + sub.avatar.gradient + ';">' + sub.avatar.emoji + '</div><div class="ws-chat-msg__bubble"><div class="ws-chat-msg__meta"><span class="ws-chat-msg__tag ws-chat-msg__tag--ai">' + sub.expertName + '</span><span class="ws-chat-msg__time">追问子任务 ' + (idx + 1) + '/' + followupSubtasks.length + ' · 处理中...</span></div><div class="ws-typing ws-typing--lg"><span class="ws-typing__dot"></span><span class="ws-typing__dot"></span><span class="ws-typing__dot"></span></div></div></div>';
            stream.insertAdjacentHTML('beforeend', dispatchHtml);
            stream.scrollTop = stream.scrollHeight;
            setTimeout(() => {
              const typingMsgs = stream.querySelectorAll('.ws-chat-msg--typing');
              const lastT = typingMsgs[typingMsgs.length - 1];
              if (lastT) lastT.remove();
              const subTask = { id: 'Q' + sub.index, requirement: sub.taskName, cost: sub.cost, timeMs: sub.timeMs };
              const subExpert = EXPERTS.find(e => e.id === sub.expertId);
              const subContent = generateResult(subExpert, subTask);
              const completeHtml = '<div class="ws-chat-msg ws-chat-msg--ai"><div class="ws-chat-msg__avatar" style="background:' + sub.avatar.gradient + ';">' + sub.avatar.emoji + '</div><div class="ws-chat-msg__bubble"><div class="ws-chat-msg__meta"><span class="ws-chat-msg__tag ws-chat-msg__tag--ai">' + sub.expertName + '</span><span class="ws-chat-msg__time">追问子任务 ' + (idx + 1) + '/' + followupSubtasks.length + ' · ✓ 完成 · ⚡' + sub.cost + ' token</span></div><div class="ws-chat-msg__content">' + subContent + '</div></div></div>';
              stream.insertAdjacentHTML('beforeend', completeHtml);
              if (HAS_GSAP) {
                const last = stream.lastElementChild;
                if (last) gsap.fromTo(last, { opacity: 0, y: 8, scale: 0.96 }, { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: 'back.out(1.4)' });
              }
              stream.scrollTop = stream.scrollHeight;
              if (idx === followupSubtasks.length - 1) {
                setTimeout(() => {
                  if (completeEl) {
                    completeEl.style.display = 'flex';
                    completeEl.querySelector('.ws-ceo-complete__text').textContent = '追问完成 · ' + followupSubtasks.length + ' 子任务 · 消耗 ' + followupCost + ' token';
                    if (HAS_GSAP) gsap.fromTo(completeEl, { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.4)' });
                  }
                }, 300);
              }
            }, Math.max(800, sub.timeMs));
          }, start);
        });
        // 写 history
        taskCounter++;
        const fTaskId = 'C' + String(taskCounter).padStart(3, '0');
        resultHistory.unshift({
          taskId: fTaskId,
          expertId: 'ceo',
          expertName: '☀ CEO',
          avatar: ceo.avatar,
          cost: followupCost,
          requirement: text,
          resultSummary: 'CEO · 追问拆 ' + followupSubtasks.length + ' 子任务 · ' + followupSubtasks.map(t => t.expertName.replace('专家', '')).join('+') + ' · ' + followupCost + ' token',
          isCeo: true,
          subtaskCount: followupSubtasks.length
        });
        while (resultHistory.length > HISTORY_MAX) resultHistory.pop();
        renderHistory();
      }, 1000);
    };
    wsChatSend.addEventListener('click', sendFollowup);
    wsChatInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendFollowup();
      }
    });
  }

  // 历史对比缩略
  function renderHistory() {
    const center = document.getElementById('wsCenter');
    if (!center) return;
    // 删旧 history 块
    const old = document.getElementById('wsHistory');
    if (old) old.remove();
    if (resultHistory.length === 0) return;

    const items = resultHistory.slice(0, HISTORY_MAX).map(t => {
      const fullTask = tasks.find(x => x.id === t.taskId);
      const summary = t.resultSummary || (fullTask && fullTask.resultSummary) || t.expertName + ' · 已生成结果';
      return (
        '<div class="ws-history__item" data-task-id="' + t.taskId + '">' +
          '<div class="ws-history__item-head">' +
            '<div class="ws-history__item-thumb" style="background:' + t.avatar.gradient + ';">' + t.avatar.emoji + '</div>' +
            '<div class="ws-history__item-head-info">' +
              '<div class="ws-history__item-name">' + t.expertName + '</div>' +
              '<div class="ws-history__item-meta">' + t.taskId + ' · ' + t.cost + ' 算力</div>' +
            '</div>' +
          '</div>' +
          '<div class="ws-history__item-summary">' + summary + '</div>' +
        '</div>'
      );
    }).join('');

    const block = document.createElement('div');
    block.id = 'wsHistory';
    block.className = 'ws-history ws__right-block';
    block.innerHTML = (
      '<div class="ws-history__head">' +
        '<div class="ws-history__title">↺ 历史需求 · 快速回看</div>' +
        '<div class="ws-history__count">' + resultHistory.length + ' 条</div>' +
      '</div>' +
      '<div class="ws-history__list">' + items + '</div>'
    );
    // 移到右列：插在算力消耗块之后
    const rightCol = document.querySelector('.ws__right');
    const consumptionBlock = document.getElementById('wsConsumptionBlock');
    if (rightCol && consumptionBlock) {
      // 先删除旧的位置（如果在中间区）
      const oldInCenter = document.getElementById('wsHistory');
      if (oldInCenter && oldInCenter.closest('.ws__center')) oldInCenter.remove();
      rightCol.insertBefore(block, consumptionBlock.nextSibling);
    } else {
      center.appendChild(block);
    }

    // B: 绑定点击 → 重渲染 result 区（历史回放）
    block.querySelectorAll('.ws-history__item').forEach(item => {
      item.addEventListener('click', () => {
        const taskId = item.dataset.taskId;
        const fullTask = tasks.find(t => t.id === taskId);
        if (!fullTask) return;
        const expert = EXPERTS.find(e => e.id === fullTask.expertId);
        if (!expert) return;
        replayHistoryResult(fullTask, expert);
      });
    });
  }

  // B: 历史回放 — 把历史任务的结果重渲染到中列（替代之前的 modal 行为）
  function replayHistoryResult(task, expert) {
    const center = document.getElementById('wsCenter');
    if (!center) return;
    // 用现有的 chat-stream 结构 + 历史回放头标 + 关闭按钮 + 返回按钮
    const results = generateResult(expert, task);
    const isCeo = task.isCeo || expert.id === 'ceo';
    const headerTitle = isCeo
      ? '↺ 历史回放 · ' + expert.name + ' 调度任务'
      : '↺ 历史回放 · ' + expert.name + ' 生成结果';
    const headerTag = isCeo
      ? '<span class="ws-replay-tag ws-replay-tag--ceo">CEO 调度</span>'
      : '<span class="ws-replay-tag">普通派单</span>';
    const tsText = '完成于 ' + new Date(task.completedAt || Date.now()).toLocaleTimeString('zh-CN', {hour: '2-digit', minute: '2-digit'});
    center.innerHTML = (
      '<div class="ws-result ws-result--replay">' +
        '<div class="ws-replay-head">' +
          '<div class="ws-replay-head__left">' +
            headerTag +
            '<span class="ws-replay-head__title">' + headerTitle + '</span>' +
          '</div>' +
          '<div class="ws-replay-head__right">' +
            '<span class="ws-replay-head__meta">' + task.id + ' · 消耗 ' + task.cost + ' 算力 · ' + tsText + '</span>' +
            '<button class="ws-replay-head__close" id="wsReplayClose" type="button" title="返回发新需求">×</button>' +
          '</div>' +
        '</div>' +
        '<div class="ws-chat-stream" id="wsChatStream">' +
          '<div class="ws-chat-msg ws-chat-msg--user">' +
            '<div class="ws-chat-msg__bubble">' +
              '<div class="ws-chat-msg__meta">' +
                '<span class="ws-chat-msg__tag">→ 派给 ' + expert.name + '</span>' +
                '<span class="ws-chat-msg__time">历史需求</span>' +
              '</div>' +
              '<div class="ws-chat-msg__text">' + (task.requirement || '（无具体需求）') + '</div>' +
            '</div>' +
            '<div class="ws-chat-msg__avatar ws-chat-msg__avatar--user">你</div>' +
          '</div>' +
          '<div class="ws-chat-msg ws-chat-msg--ai">' +
            '<div class="ws-chat-msg__avatar" style="background:' + expert.avatar.gradient + ';">' + expert.avatar.emoji + '</div>' +
            '<div class="ws-chat-msg__bubble">' +
              '<div class="ws-chat-msg__meta">' +
                '<span class="ws-chat-msg__tag ws-chat-msg__tag--ai">' + expert.name + '</span>' +
                '<span class="ws-chat-msg__time">' + tsText + ' · ⚡ ' + (task.timeMs / 1000).toFixed(1) + 's · ' + task.cost + ' 算力</span>' +
              '</div>' +
              '<div class="ws-chat-msg__content">' + results + '</div>' +
              '<div class="ws-chat-msg__actions">' +
                '<button class="ws-result__action" data-action="rerun">↻ 重新生成</button>' +
                '<button class="ws-result__action" data-action="copy" id="wsReplayCopy">复制结果</button>' +
              '</div>' +
            '</div>' +
          '</div>' +
        '</div>' +
        '<button class="ws-dispatch__submit" id="wsReplayBack" type="button" style="background: linear-gradient(135deg, #8B8B9E, #6E6E84); box-shadow: none;">← 返回发新需求</button>' +
      '</div>'
    );
    // 行动画入场
    if (HAS_GSAP) {
      gsap.fromTo('.ws-result--replay', { opacity: 0, y: 8, scale: 0.98 },
        { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: 'power3.out' });
    }
    // 返回按钮 → 默认 dispatch 视图
    document.getElementById('wsReplayBack').addEventListener('click', renderCenter);
    document.getElementById('wsReplayClose').addEventListener('click', renderCenter);
    // 重新生成（仍走正常流程）
    center.querySelector('[data-action="rerun"]').addEventListener('click', () => {
      renderCenter();
      setTimeout(() => submitTask(expert, task.requirement), 200);
    });
    // 复制
    const copyBtn = document.getElementById('wsReplayCopy');
    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        const txt = expert.name + ' 生成结果：\n\n' + (task.requirement || '') + '\n\n' + results.replace(/<[^>]+>/g, '');
        copyToClipboard(txt).then(() => {
          const orig = copyBtn.textContent;
          copyBtn.textContent = '✓ 已复制';
          setTimeout(() => { copyBtn.textContent = orig; }, 1500);
        });
      });
    }
  }

  // Modal 关闭（背景 + 按钮）
  document.querySelectorAll('[data-modal-close]').forEach(el => {
    el.addEventListener('click', () => {
      closeResultModal();
      closeShareModal();
    });
  });

  // ESC 关闭
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeResultModal();
      closeShareModal();
    }
  });

  // 复制内容按钮
  document.getElementById('wsResultCopy')?.addEventListener('click', () => {
    if (!currentResult) return;
    const text = currentResult.expert.name + ' 生成结果：\n\n' + (currentResult.task.requirement || '') + '\n\n' + currentResult.html.replace(/<[^>]+>/g, '');
    copyToClipboard(text).then(() => {
      const btn = document.getElementById('wsResultCopy');
      if (btn) {
        const orig = btn.textContent;
        btn.textContent = '✓ 已复制';
        setTimeout(() => { btn.textContent = orig; }, 1500);
      }
    });
  });

  // 分享按钮 → 打开分享 modal
  document.getElementById('wsResultShare')?.addEventListener('click', () => {
    if (currentResult) openShareModal(currentResult.task);
  });

  // 重新生成按钮
  document.getElementById('wsResultRerun')?.addEventListener('click', () => {
    closeResultModal();
    if (currentResult) {
      const expert = currentResult.expert;
      const task = currentResult.task;
      setTimeout(() => {
        submitTask(expert, task.requirement);
      }, 200);
    }
  });

  // 分享 modal - 复制链接
  document.getElementById('wsShareCopy')?.addEventListener('click', () => {
    const link = document.getElementById('wsShareLink');
    if (!link) return;
    copyToClipboard(link.value).then(() => {
      const btn = document.getElementById('wsShareCopy');
      if (btn) {
        btn.textContent = '✓ 已复制';
        btn.classList.add('is-copied');
        setTimeout(() => {
          btn.textContent = '复制';
          btn.classList.remove('is-copied');
        }, 1500);
      }
    });
  });

  // 分享 modal - 社交按钮（演示用 → alert）
  document.querySelectorAll('.ws-share-modal__social').forEach(btn => {
    btn.addEventListener('click', () => {
      const orig = btn.innerHTML;
      btn.innerHTML = '<span>✓</span>已发送';
      setTimeout(() => { btn.innerHTML = orig; }, 1500);
    });
  });

    /* ---------- 8. 任务队列（右列） ---------- */
  function renderTaskList() {
    const list = document.getElementById('wsTaskList');
    if (!list) return;
    if (tasks.length === 0) {
      list.innerHTML = '<div class="ws-task-empty">尚未派单 · 选专家 + 派单</div>';
      return;
    }
    const slice = tasks.slice(0, TASK_MAX_ITEMS);
    list.innerHTML = slice.map(t => (
      '<div class="ws-task">' +
        '<div class="ws-task__avatar" style="background:' + t.avatar.gradient + ';">' + t.avatar.emoji + '</div>' +
        '<div class="ws-task__body">' +
          '<div class="ws-task__row">' +
            '<span class="ws-task__name">' + t.id + ' · ' + t.expertName + '</span>' +
            '<span class="ws-task__status ws-task__status--' + t.status + '">' + (t.status === 'running' ? t.progress + '%' : '✓ ' + t.cost) + '</span>' +
          '</div>' +
          '<div class="ws-task__progress">' +
            '<div class="ws-task__progress-fill' + (t.status === 'done' ? ' ws-task__progress-fill--done' : '') + '" style="width:' + t.progress + '%;"></div>' +
          '</div>' +
        '</div>' +
      '</div>'
    )).join('');
  }

  function updateTaskCount() {
    const running = tasks.filter(t => t.status === 'running').length;
    const el = document.getElementById('wsTaskCount');
    if (el) el.textContent = running + ' 进行中';
  }

  /* ---------- 9. 算力余额 + 今日消耗 ---------- */
  function updateQuotaUI() {
    const quotaEl = document.getElementById('wsQuota');
    if (quotaEl) {
      if (HAS_GSAP) {
        const obj = { v: parseInt(quotaEl.textContent.replace(/,/g, ''), 10) || quotaBalance };
        gsap.to(obj, {
          v: quotaBalance,
          duration: 0.6,
          ease: 'power2.out',
          onUpdate: () => {
            quotaEl.textContent = Math.floor(obj.v).toLocaleString('en-US');
          }
        });
      } else {
        quotaEl.textContent = quotaBalance.toLocaleString('en-US');
      }
    }
    const conEl = document.getElementById('wsConsumption');
    if (conEl) conEl.textContent = consumedToday.toLocaleString('en-US') + ' / ' + quotaBalance.toLocaleString('en-US');
    const fillEl = document.getElementById('wsConsumptionFill');
    if (fillEl) fillEl.style.setProperty('--p', Math.min(100, (consumedToday / quotaBalance) * 100) + '%');
    const consumedEl = document.getElementById('wsConsumed');
    if (consumedEl) consumedEl.textContent = consumedToday.toLocaleString('en-US');
  }

  /* ---------- 10. V4.5 销冠深度接管：toggle + 实时 chat 流 ---------- */
  const SALES_CHAT_TEMPLATES = [
    {
      customer: { name: '小明', initial: 'M', text: '老板，8000 套餐还有吗？想明天来谈谈' },
      ai:       { name: '★ 销冠 AI', tag: '强意向', text: '小明兄有眼光！<strong>8000 套餐只剩最后 3 份</strong>，明天来我提前给你锁名额 + 9 折。' }
    },
    {
      customer: { name: '王经理', initial: 'W', text: '上次说的礼品还送吗？' },
      ai:       { name: '★ 销冠 AI', tag: '转化', text: '王经理放心，<strong>800 元礼盒已为您备好</strong>，下单即送。已生成付款链接 👇' }
    },
    {
      customer: { name: 'Lisa', initial: 'L', text: '能便宜点吗？我朋友也想买' },
      ai:       { name: '★ 销冠 AI', tag: '议价', text: 'Lisa 姐！两人一起买走团购价，<strong>每人立减 800</strong>，我把您的专属链接发给朋友？' }
    },
    {
      customer: { name: '陈总', initial: 'C', text: '安装方便吗？我们公司 20 人用' },
      ai:       { name: '★ 销冠 AI', tag: 'B 端', text: '陈总放心！<strong>20 人企业版享专属部署</strong>，7×24 客服，已派专家上门对接，今晚 8 点约吗？' }
    },
    {
      customer: { name: 'Sarah', initial: 'S', text: '我有家人也想要，怎么操作？' },
      ai:       { name: '★ 销冠 AI', tag: '裂变', text: 'Sarah 姐，分享您的专属码给您家人，<strong>TA 下单您得 30% 返佣</strong>，已发您链接～' }
    },
    {
      customer: { name: '赵老师', initial: 'Z', text: '学生能用吗？有什么教育优惠？' },
      ai:       { name: '★ 销冠 AI', tag: '咨询', text: '赵老师好！<strong>学生 / 教师认证 7 折</strong>，已发认证入口到您微信，5 分钟可开通～' }
    }
  ];

  let salesInterval = null;
  let salesPaused = false;
  let salesTemplateIdx = 0;
  let salesCount = 12;
  let salesTotalReplies = 86;

  function openSalesModal() {
    const modal = document.getElementById('wsSalesModal');
    if (!modal) return;
    modal.dataset.state = 'open';
    // 启动推流
    if (!salesInterval) {
      salesInterval = setInterval(pushSalesChat, 4000);
    }
  }

  function closeSalesModal() {
    const modal = document.getElementById('wsSalesModal');
    if (modal) modal.dataset.state = 'closed';
  }

  function pushSalesChat() {
    if (salesPaused) return;
    const stream = document.getElementById('wsSalesStream');
    if (!stream) return;

    const tpl = SALES_CHAT_TEMPLATES[salesTemplateIdx % SALES_CHAT_TEMPLATES.length];
    salesTemplateIdx++;

    const now = new Date();
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    const ss = String(now.getSeconds()).padStart(2, '0');

    // 客户消息
    const customerHtml = (
      '<div class="ws-chat-item ws-chat-item--customer">' +
        '<div class="ws-chat-item__head">' +
          '<div class="ws-chat-item__avatar">' + tpl.customer.initial + '</div>' +
          '<span class="ws-chat-item__name">' + tpl.customer.name + '</span>' +
          '<span class="ws-chat-item__time">' + hh + ':' + mm + '</span>' +
        '</div>' +
        '<div class="ws-chat-item__text">' + tpl.customer.text + '</div>' +
      '</div>'
    );

    // AI 回复（1.2s 后）
    const aiHtml = (
      '<div class="ws-chat-item ws-chat-item--ai">' +
        '<div class="ws-chat-item__head">' +
          '<div class="ws-chat-item__avatar">★</div>' +
          '<span class="ws-chat-item__name">' + tpl.ai.name + '</span>' +
          '<span class="ws-chat-item__tag">' + tpl.ai.tag + '</span>' +
          '<span class="ws-chat-item__time">' + hh + ':' + mm + ':' + ss + '</span>' +
        '</div>' +
        '<div class="ws-chat-item__text">' + tpl.ai.text + '</div>' +
      '</div>'
    );

    // 拼接 + prepend 客户消息
    stream.insertAdjacentHTML('beforeend', customerHtml);
    const lastCustomer = stream.lastElementChild;
    if (HAS_GSAP) {
      gsap.fromTo(lastCustomer,
        { opacity: 0, y: 10, height: 0 },
        { opacity: 1, y: 0, height: 'auto', duration: 0.45, ease: 'power3.out',
          onComplete: () => {
            lastCustomer.style.height = '';
            // 1.2s 后插入 AI 回复
            setTimeout(() => {
              stream.insertAdjacentHTML('beforeend', aiHtml);
              const lastAi = stream.lastElementChild;
              if (HAS_GSAP) {
                gsap.fromTo(lastAi,
                  { opacity: 0, y: 10, height: 0 },
                  { opacity: 1, y: 0, height: 'auto', duration: 0.45, ease: 'power3.out',
                    onComplete: () => { lastAi.style.height = ''; }
                  }
                );
              }
              // 滚动到底
              stream.scrollTop = stream.scrollHeight;
              // 更新指标
              salesTotalReplies += 1;
              const m3 = document.getElementById('wsSalesMetric3');
              if (m3) m3.textContent = salesTotalReplies;
            }, 1200);
          }
        }
      );
    }

    // 滚动到底
    stream.scrollTop = stream.scrollHeight;

    // 更新指标
    salesCount = Math.min(50, salesCount + (Math.random() < 0.4 ? 1 : 0));
    const cEl = document.getElementById('wsSalesCount');
    const m1 = document.getElementById('wsSalesMetric1');
    if (cEl) cEl.textContent = salesCount;
    if (m1) m1.textContent = salesCount;

    // 限制最多 8 条（4 客户 + 4 AI）
    while (stream.children.length > 8) {
      const first = stream.firstElementChild;
      if (!first) break;
      if (HAS_GSAP) {
        gsap.killTweensOf(first);
        gsap.to(first, {
          opacity: 0, x: -16, height: 0, marginTop: 0, marginBottom: 0,
          duration: 0.3, ease: 'power2.in',
          onComplete: () => first.remove()
        });
      } else {
        first.remove();
      }
      break;
    }
  }

  // 销冠 toggle（升级版：开启 → 打开 modal + 启动推流）
  document.getElementById('wsSalesToggle').addEventListener('click', (e) => {
    e.stopPropagation();
    salesMode = !salesMode;
    const btn = document.getElementById('wsSalesToggle');
    btn.classList.toggle('is-on', salesMode);
    btn.textContent = salesMode ? '已开启' : '开启';
    if (salesMode) {
      openSalesModal();
    } else {
      closeSalesModal();
    }
  });

  // 销冠 modal 关闭按钮
  document.querySelectorAll('.ws-sales-modal [data-modal-close]').forEach(el => {
    el.addEventListener('click', () => closeSalesModal());
  });

  // 暂停/继续按钮
  document.getElementById('wsSalesPause')?.addEventListener('click', (e) => {
    salesPaused = !salesPaused;
    const btn = document.getElementById('wsSalesPause');
    btn.classList.toggle('is-paused', salesPaused);
    btn.textContent = salesPaused ? '▶ 继续接管' : '⏸ 暂停接管';
    const status = document.getElementById('wsSalesStatus');
    if (status) {
      status.innerHTML = salesPaused
        ? '已暂停 · 共接管 <strong id="wsSalesCount">' + salesCount + '</strong> 位好友'
        : '全速运转 · 已接管 <strong id="wsSalesCount">' + salesCount + '</strong> 位好友';
    }
  });

  // 打开消息页
  document.getElementById('wsSalesOpenMessages')?.addEventListener('click', () => {
    window.open('messages.html', '_blank');
  });

  /* ---------- 11. Page load 入场 + 入场后呼吸 ---------- */
  if (HAS_GSAP && !reduceMotion) {
    // 左列 + 中列 + 右列 stagger
    gsap.fromTo(['.ws__left', '.ws__center', '.ws__right'],
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', stagger: 0.1, delay: 0.1 }
    );
    // 8 专家 stagger
    gsap.fromTo('.ws-expert-row',
      { opacity: 0, x: -12 },
      { opacity: 1, x: 0, duration: 0.5, ease: 'power3.out', stagger: 0.05, delay: 0.3 }
    );
    // CEO 卡 avatar 弹入
    gsap.fromTo('.ceo-card__avatar',
      { scale: 0, rotation: -180 },
      { scale: 1, rotation: 0, duration: 0.7, ease: 'back.out(1.7)', delay: 0.2 }
    );
    // CEO 头像持续呼吸
    gsap.to('.ceo-card__avatar', {
      scale: 1.06,
      duration: 2.4,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
      delay: 1.0
    });
    // topbar 算力数字 count-up
    const obj = { v: 0 };
    gsap.to(obj, {
      v: quotaBalance,
      duration: 1.4,
      ease: 'power3.out',
      delay: 0.2,
      onUpdate: () => {
        const el = document.getElementById('wsQuota');
        if (el) el.textContent = Math.floor(obj.v).toLocaleString('en-US');
      }
    });
  }

  /* ---------- 12. 初始化 ---------- */
  renderExpertList();
  renderCenter();
  renderTaskList();
  updateTaskCount();
  updateQuotaUI();

  // 测试触发：?test=replay-direct 直接预填充一条 history + 打开 replay 视图（截图用）
  if (location.search.indexOf('test=replay-direct') !== -1) {
    setTimeout(() => {
      try {
        // 注入一条假历史任务
        const ceo = EXPERTS[0];
        const writing = EXPERTS.find(e => e.id === 'writing');
        const fakeTask = {
          id: 'C007',
          expertId: 'ceo',
          isCeo: true,
          requirement: 'Q4 营销全案：写品牌文案 + 拍短视频 + 数据分析',
          cost: 4100,
          timeMs: 8500,
          completedAt: Date.now() - 3600 * 1000
        };
        tasks.unshift(fakeTask);
        resultHistory.unshift({
          taskId: fakeTask.id,
          expertId: 'ceo',
          expertName: '☀ CEO',
          avatar: ceo.avatar,
          cost: fakeTask.cost,
          requirement: fakeTask.requirement,
          resultSummary: 'CEO · 拆 3 子任务 · 写作+品牌+视频 · 4,100 token',
          isCeo: true,
          subtaskCount: 3
        });
        renderHistory();
        setTimeout(() => {
          document.title = 'READY';
          const historyCard = document.querySelector('.ws-history__item');
          if (historyCard) historyCard.click();
          if (HAS_GSAP) {
            gsap.killTweensOf('.ws-result--replay');
            gsap.set('.ws-result--replay', { opacity: 1, y: 0, scale: 1, clearProps: 'opacity,y,scale' });
          }
        }, 100);
      } catch (e) { document.title = 'ERR-replay:' + e.message; }
    }, 50);
  }

  // 测试触发：?test=au 模拟点击 CEO + 派单（仅用于截图验证）
  if (location.search.indexOf('test=au') !== -1) {
    // 1. 立即杀掉所有入场 GSAP 动画 + 强制可见（headless 截图模式）
    if (HAS_GSAP) {
      gsap.killTweensOf(['.ws__left', '.ws__center', '.ws__right', '.ws-expert-row', '.ws-ceo-progress']);
      gsap.set(['.ws__left', '.ws__center', '.ws__right'], { opacity: 1, y: 0, clearProps: 'opacity,y' });
      gsap.set('.ws-expert-row', { opacity: 1, x: 0, clearProps: 'opacity,x' });
    }
    setTimeout(() => {
      try {
        const ceoRow = document.querySelector('.ws-expert-row[data-id="ceo"]');
        if (ceoRow) ceoRow.click();
        setTimeout(() => {
          try {
            const ta = document.querySelector('.ws-dispatch__input');
            if (ta) {
              ta.value = 'Q4 营销全案：写品牌文案 + 拍短视频 + 数据分析';
              ta.dispatchEvent(new Event('input', { bubbles: true }));
              const submit = document.getElementById('wsDispatchSubmit');
              if (submit) submit.click();
              // 派单后再清一次
              if (HAS_GSAP) {
                gsap.killTweensOf('.ws-ceo-progress');
                gsap.set('.ws-ceo-progress', { opacity: 1, y: 0, clearProps: 'opacity,y' });
              }
              // test=au-drag 额外模拟：把第 1 个子任务（写作）拖到"数据"专家
              if (location.search.indexOf('test=au-drag') !== -1) {
                setTimeout(() => {
                  try {
                    const planItem = document.querySelector('.ws-ceo-plan__item[data-sub-idx="0"]');
                    const targetRow = document.querySelector('.ws-expert-row[data-id="data"]');
                    if (planItem && targetRow) {
                      const dt = new DataTransfer();
                      dt.setData('text/plain', '0');
                      planItem.dispatchEvent(new DragEvent('dragstart', { dataTransfer: dt, bubbles: true }));
                      targetRow.dispatchEvent(new DragEvent('dragover', { dataTransfer: dt, bubbles: true }));
                      targetRow.dispatchEvent(new DragEvent('drop', { dataTransfer: dt, bubbles: true }));
                      planItem.dispatchEvent(new DragEvent('dragend', { dataTransfer: dt, bubbles: true }));
                    }
                    if (HAS_GSAP) {
                      gsap.killTweensOf('.ws-ceo-progress');
                      gsap.set('.ws-ceo-progress', { opacity: 1, y: 0, clearProps: 'opacity,y' });
                    }
                  } catch (e3) { document.title = 'ERR3:' + e3.message; }
                }, 300);
              }
              // test=au-confirm 额外模拟：点"确认派单"
              if (location.search.indexOf('test=au-confirm') !== -1) {
                setTimeout(() => {
                  try {
                    const confirmBtn = document.getElementById('wsCeoConfirm');
                    if (confirmBtn) confirmBtn.click();
                    // 等待子任务流渲染（几个子任务总时间 ~3s）
                    setTimeout(() => {
                      if (HAS_GSAP) {
                        gsap.killTweensOf(['.ws-result', '.ws-ceo-complete', '.ws-chat-msg--user', '.ws-chat-msg--ai', '.ws-chat-msg--ceo']);
                        gsap.set(['.ws-result', '.ws-ceo-complete', '.ws-chat-msg--user', '.ws-chat-msg--ai', '.ws-chat-msg--ceo'],
                          { opacity: 1, y: 0, scale: 1, clearProps: 'opacity,y,scale' });
                      }
                      // test=history 再额外模拟：点第一个历史卡 → 重渲染 result 区
                      if (location.search.indexOf('test=history') !== -1) {
                        setTimeout(() => {
                          try {
                            const historyCard = document.querySelector('.ws-history__item');
                            document.title = historyCard ? 'HC-FOUND' : 'HC-MISSING';
                            if (historyCard) historyCard.click();
                            setTimeout(() => {
                              document.title = (document.getElementById('wsReplayBack') ? 'REPLAY-OK' : 'REPLAY-MISS');
                              if (HAS_GSAP) {
                                gsap.killTweensOf('.ws-result--replay');
                                gsap.set('.ws-result--replay', { opacity: 1, y: 0, scale: 1, clearProps: 'opacity,y,scale' });
                              }
                            }, 200);
                          } catch (e5) { document.title = 'ERR5:' + e5.message; }
                        }, 600);
                      }
                    }, 3500);
                  } catch (e4) { document.title = 'ERR4:' + e4.message; }
                }, 300);
              }
            } else {
              document.title = 'NO-TA';
            }
          } catch (e2) { document.title = 'ERR2:' + e2.message; }
        }, 200);
      } catch (e) { document.title = 'ERR:' + e.message; }
    }, 100);
  }

  /* ============================================================
   * 9. 快捷条件 chip · 7 专家（除 ceo / sales 外）
   * ============================================================ */
  function escHtml(s) {
    return (s || '').replace(/[&<>"']/g, (c) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));
  }

  // 9.1 7 专家的 chip 数据 · 每行：{ label, options: [...], multi: true }
  // 选项值用于追加到 prompt 「· label：option」
  const QUICK_PRESETS = {
    brand: [
      { label: '风格',   options: ['极简', '复古', '商务', '潮流', '国潮', '未来感'] },
      { label: '主色',   options: ['蓝', '红', '绿', '金', '黑', '白'] },
      { label: '比例',   options: ['横屏', '竖屏', '方形'] },
      { label: '清晰度', options: ['高清', '标清'] },
      { label: '行业',   options: ['餐饮', '科技', '教育', '美妆', '金融'] }
    ],
    writing: [
      { label: '语气', options: ['专业', '幽默', '共情', '吐槽', '学术'] },
      { label: '文体', options: ['公众号', '小红书', '邮件', '抖音', '知乎'] },
      { label: '字数', options: ['500', '800', '1500', '3000'] },
      { label: '受众', options: ['老板', '职场人', '宝妈', '学生', '技术人'] }
    ],
    audio: [
      { label: '输出',   options: ['纪要', '待办', '转录', '原文'] },
      { label: '详略',   options: ['精简', '详尽'] },
      { label: '关键句', options: ['是', '否'] },
      { label: '发言人', options: ['区分', '不区分'] }
    ],
    video: [
      { label: '时长', options: ['15s', '30s', '60s', '3min'] },
      { label: '风格', options: ['真人', '二次元', '3D', '实拍'] },
      { label: '比例', options: ['横屏', '竖屏', '方屏'] },
      { label: '字幕', options: ['中文', '中英', '无'] },
      { label: 'BGM', options: ['有', '无'] }
    ],
    data: [
      { label: '图表',   options: ['折线', '柱状', '饼图', '漏斗', '热力图'] },
      { label: '时间',   options: ['7天', '30天', '季度', '年', '自定义'] },
      { label: '数据源', options: ['订单', '用户', '财务', '流量'] },
      { label: '维度',   options: ['趋势', '对比', '占比', '异常'] }
    ],
    fengshui: [
      { label: '流派', options: ['玄空', '八宅', '飞星', '命理'] },
      { label: '场景', options: ['住宅', '商铺', '办公室', '墓地'] },
      { label: '深度', options: ['简', '详'] },
      { label: '化解', options: ['是', '否'] }
    ],
    zodiac: [
      { label: '流派', options: ['古典', '现代', '心理'] },
      { label: '聚焦', options: ['爱情', '事业', '财运', '学业', '健康'] },
      { label: '深度', options: ['简', '详'] },
      { label: '合盘', options: ['是', '否'] }
    ]
  };

  // 9.2 7 专家主色 · 沿用 avatar gradient 第一色 + CSS 变量同步
  const EXPERT_QUICK_COLOR = {
    brand:    '#F8718B',  // brand 珊瑚红
    writing:  '#B695FF',  // writing 紫
    audio:    '#FF6B6B',  // audio 录音红
    video:    '#FFA94D',  // video 橙
    data:     '#5B8DEF',  // data 蓝
    fengshui: '#C9A063',  // fengshui 暖金
    zodiac:   '#C77DFF'   // zodiac 紫罗兰
  };

  // 9.3 chip 当前选择状态（按 expert.id 隔离）
  const quickState = {};   // { brand: { '风格': ['极简'] }, ... }

  // 9.x 本地历史：{ expertId: { chipKey: count } }  每次选 chip 写一次
  const WS_HISTORY_KEY = 'ws_qc_history_v1';
  function readHistory() {
    try { return JSON.parse(localStorage.getItem(WS_HISTORY_KEY) || '{}'); } catch (e) { return {}; }
  }
  function writeHistory(h) {
    try { localStorage.setItem(WS_HISTORY_KEY, JSON.stringify(h)); } catch (e) {}
  }
  function bumpHistory(expertId, chipKey) {
    const h = readHistory();
    if (!h[expertId]) h[expertId] = {};
    h[expertId][chipKey] = (h[expertId][chipKey] || 0) + 1;
    writeHistory(h);
  }
  // 取最近用过 top N (按频次降序)
  function getRecentChips(expertId, n) {
    const h = readHistory();
    const arr = Object.entries(h[expertId] || {}).map(([k, c]) => ({ k, c }));
    arr.sort((a, b) => b.c - a.c);
    return arr.slice(0, n).map((x) => x.k);
  }
  // AI 猜你想加：每个 row 的首个 option（场景预设）
  function getAiGuess(expertId, presets) {
    const out = [];
    presets.forEach((r) => { if (r.options && r.options[0]) out.push(r.label + ':' + r.options[0]); });
    return out.slice(0, 4);
  }
  // 把 "label:val" 形式 chip 解析
  function parseChipKey(k) {
    const idx = k.indexOf(':');
    if (idx < 0) return null;
    return { label: k.slice(0, idx), val: k.slice(idx + 1) };
  }
  // 渲染 spark 按钮（AI 闪光图标）
  function sparkSvg() {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3z"/><path d="M19 16l.7 1.8L21.5 18.5l-1.8.7L19 21l-.7-1.8L16.5 18.5l1.8-.7L19 16z"/></svg>';
  }

  function renderQuickPresets(expert) {
    const quickEl = document.getElementById('wsDispatchQuick');
    const clearBtn = document.getElementById('wsQuickClear');
    if (!quickEl) return;

    const presets = QUICK_PRESETS[expert.id];
    if (!presets) {
      // ceo / sales 不出 modal
      quickEl.setAttribute('data-state', 'hidden');
      quickEl.innerHTML = '';
      if (clearBtn) clearBtn.setAttribute('data-state', 'hidden');
      return;
    }
    quickEl.setAttribute('data-state', 'active');
    const color = EXPERT_QUICK_COLOR[expert.id] || 'var(--text-primary)';
    quickEl.style.setProperty('--qc-color', color);

    // 算 AI 猜你想加 + 最近用过（按 chip key 形式：label:val）
    const aiGuess = getAiGuess(expert.id, presets);
    const recent = getRecentChips(expert.id, 6);
    const hotSet = new Set(aiGuess);

    // 1. trigger（简化版 · spark 24×24 · 36px 高）
    // 2. modal（body 注入到 body 末）
    quickEl.innerHTML = (
      '<div class="ws-qc-trigger-wrap">' +
        '<button class="ws-qc-trigger-single" id="wsQcTrigger" type="button" aria-expanded="false">' +
          '<span class="ws-qc-trigger-single__spark">' + sparkSvg() + '</span>' +
          '<span class="ws-qc-trigger-single__text">' +
            '<span class="ws-qc-trigger-single__label">快捷条件</span>' +
            '<span class="ws-qc-trigger-single__count" id="wsQcCount" data-state="hidden">0</span>' +
          '</span>' +
          '<span class="ws-qc-trigger-single__caret">▾</span>' +
        '</button>' +
      '</div>'
    );

    // modal HTML（注入到 .window 容器内 — 桌面端弹窗必须限制在 app 窗口内）
    // 移除旧的
    const oldModal = document.getElementById('wsQcModal');
    if (oldModal) oldModal.remove();
    const expertName = expert.name || expert.id;
    const modal = document.createElement('div');
    modal.className = 'ws-qc-modal';
    modal.id = 'wsQcModal';
    modal.setAttribute('data-state', 'closed');
    modal.setAttribute('data-expert-id', expert.id);
    modal.innerHTML = (
      '<div class="ws-qc-modal__backdrop" data-modal-close></div>' +
      '<div class="ws-qc-modal__card">' +
        // 头部
        '<div class="ws-qc-modal__head">' +
          '<div class="ws-qc-modal__head-spark">' + sparkSvg() + '</div>' +
          '<div class="ws-qc-modal__head-text">' +
            '<div class="ws-qc-modal__head-title">快捷条件 <span class="ws-qc-modal__head-title__expert">' + escHtml(expertName) + ' 专家</span></div>' +
            '<div class="ws-qc-modal__head-sub">点选 AI 推荐的 3-5 个条件，或自己挑</div>' +
          '</div>' +
          '<button class="ws-qc-modal__head-close" data-modal-close type="button" title="关闭">×</button>' +
        '</div>' +
        // 工具栏
        '<div class="ws-qc-modal__toolbar">' +
          '<div class="ws-qc-modal__search">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
              '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>' +
            '</svg>' +
            '<input type="text" id="wsQcSearch" placeholder="搜索 风格 / 主色 / 行业 ..." />' +
          '</div>' +
          '<button class="ws-qc-modal__ai-sort" id="wsQcAiSort" type="button" title="按 AI 智能匹配度重排已选">' + sparkSvg() + ' 智能排序</button>' +
        '</div>' +
        // 主体
        '<div class="ws-qc-modal__body">' +
          // 左 200 分类导航
          '<div class="ws-qc-modal__nav" id="wsQcNav">' +
            '<div class="ws-qc-modal__nav-title">分类</div>' +
            '<div class="ws-qc-modal__nav-item is-active" data-nav-target="all" data-nav-type="all">' +
              '<span class="ws-qc-modal__nav-item__icon">📂</span>' +
              '<span class="ws-qc-modal__nav-item__label">全部条件</span>' +
              '<span class="ws-qc-modal__nav-item__count">' + presets.reduce((s, r) => s + r.options.length, 0) + '</span>' +
            '</div>' +
            (aiGuess.length ? (
              '<div class="ws-qc-modal__nav-item is-hot" data-nav-target="ai" data-nav-type="ai">' +
                '<span class="ws-qc-modal__nav-item__icon">✨</span>' +
                '<span class="ws-qc-modal__nav-item__label">AI 猜你想加</span>' +
                '<span class="ws-qc-modal__nav-item__count">' + aiGuess.length + '</span>' +
              '</div>'
            ) : '') +
            (recent.length ? (
              '<div class="ws-qc-modal__nav-item" data-nav-target="recent" data-nav-type="recent">' +
                '<span class="ws-qc-modal__nav-item__icon">🕐</span>' +
                '<span class="ws-qc-modal__nav-item__label">最近用过</span>' +
                '<span class="ws-qc-modal__nav-item__count">' + recent.length + '</span>' +
              '</div>'
            ) : '') +
            '<div class="ws-qc-modal__nav-title" style="margin-top:10px;">字段</div>' +
            presets.map((row, ri) => (
              '<div class="ws-qc-modal__nav-item" data-nav-target="row-' + ri + '" data-nav-type="row" data-row-idx="' + ri + '">' +
                '<span class="ws-qc-modal__nav-item__icon">·</span>' +
                '<span class="ws-qc-modal__nav-item__label">' + escHtml(row.label) + '</span>' +
                '<span class="ws-qc-modal__nav-item__count">' + row.options.length + '</span>' +
              '</div>'
            )).join('') +
          '</div>' +
          // 中间 chip 区域
          '<div class="ws-qc-modal__main" id="wsQcMain">' +
            // AI 猜你想加组
            (aiGuess.length ? (
              '<div class="ws-qc-modal__group is-hot" data-group="ai" data-group-name="AI 猜你想加">' +
                '<div class="ws-qc-modal__group-title">' +
                  '<span class="ws-qc-modal__group-title__icon">✨</span>' +
                  'AI 猜你想加' +
                  '<span class="ws-qc-modal__group-title__count">' + aiGuess.length + '</span>' +
                '</div>' +
                '<div class="ws-qc-modal__chips">' +
                  aiGuess.map((k) => {
                    const p = parseChipKey(k);
                    if (!p) return '';
                    const isOn = quickState[expert.id] && quickState[expert.id][p.label] && quickState[expert.id][p.label].indexOf(p.val) >= 0;
                    return '<button class="ws-quick-chip is-hot' + (isOn ? ' is-active' : '') + '"' +
                      ' type="button" data-ai-key="' + escHtml(k) + '"' +
                      ' data-row-label="' + escHtml(p.label) + '" data-opt-val="' + escHtml(p.val) + '">' +
                      escHtml(p.val) +
                    '</button>';
                  }).join('') +
                '</div>' +
              '</div>'
            ) : '') +
            // 最近用过组
            (recent.length ? (
              '<div class="ws-qc-modal__group" data-group="recent" data-group-name="最近用过">' +
                '<div class="ws-qc-modal__group-title">' +
                  '<span class="ws-qc-modal__group-title__icon">🕐</span>' +
                  '最近用过' +
                  '<span class="ws-qc-modal__group-title__count">' + recent.length + '</span>' +
                '</div>' +
                '<div class="ws-qc-modal__chips">' +
                  recent.map((k) => {
                    const p = parseChipKey(k);
                    if (!p) return '';
                    const isOn = quickState[expert.id] && quickState[expert.id][p.label] && quickState[expert.id][p.label].indexOf(p.val) >= 0;
                    return '<button class="ws-quick-chip' + (isOn ? ' is-active' : '') + '"' +
                      ' type="button" data-recent-key="' + escHtml(k) + '"' +
                      ' data-row-label="' + escHtml(p.label) + '" data-opt-val="' + escHtml(p.val) + '">' +
                      escHtml(p.val) +
                    '</button>';
                  }).join('') +
                '</div>' +
              '</div>'
            ) : '') +
            // 全部字段
            presets.map((row, ri) => {
              const initActive = (quickState[expert.id] && quickState[expert.id][row.label]) || [];
              return (
                '<div class="ws-qc-modal__group" data-group="row" data-row-idx="' + ri + '" data-row-label="' + escHtml(row.label) + '">' +
                  '<div class="ws-qc-modal__group-title">' +
                    '<span class="ws-qc-modal__group-title__icon">·</span>' +
                    escHtml(row.label) +
                    '<span class="ws-qc-modal__group-title__count">' + row.options.length + '</span>' +
                  '</div>' +
                  '<div class="ws-qc-modal__chips">' +
                    row.options.map((opt, oi) => {
                      const isOn = initActive.indexOf(opt) >= 0;
                      const isHot = hotSet.has(row.label + ':' + opt);
                      return '<button class="ws-quick-chip' + (isOn ? ' is-active' : '') + (isHot ? ' is-hot' : '') + '" type="button"' +
                        ' data-row-idx="' + ri + '" data-opt-idx="' + oi + '"' +
                        ' data-row-label="' + escHtml(row.label) + '" data-opt-val="' + escHtml(opt) + '"' +
                        ' style="--qc-color:' + color + '">' +
                        escHtml(opt) +
                      '</button>';
                    }).join('') +
                  '</div>' +
                '</div>'
              );
            }).join('') +
          '</div>' +
        '</div>' +
        // 已选预览
        '<div class="ws-qc-modal__selected" id="wsQcSelected"></div>' +
        // footer
        '<div class="ws-qc-modal__footer">' +
          '<div class="ws-qc-modal__footer-stats" id="wsQcStats">已选 <strong>0</strong> 个条件</div>' +
          '<button class="ws-qc-modal__btn ws-qc-modal__btn--ai-fill" id="wsQcAiFill" type="button">' + sparkSvg() + ' AI 一键填充</button>' +
          '<button class="ws-qc-modal__btn ws-qc-modal__btn--clear" id="wsQcClear" type="button">清空</button>' +
          '<button class="ws-qc-modal__btn ws-qc-modal__btn--confirm" id="wsQcConfirm" type="button">✓ 完成</button>' +
        '</div>' +
      '</div>'
    );
    // 注入到 .window 容器内（不是 body — 桌面端弹窗必须限制在 app 窗口内）
    const winEl = document.querySelector('.window') || document.body;
    winEl.appendChild(modal);

    const hasActive = Object.values(quickState[expert.id] || {}).some((arr) => arr.length > 0);
    if (clearBtn) clearBtn.setAttribute('data-state', hasActive ? 'visible' : 'hidden');

    bindQuickPresets(expert, color);
  }

  function bindQuickPresets(expert, color) {
    const quickEl = document.getElementById('wsDispatchQuick');
    const input = document.getElementById('wsDispatchInput');
    const presets = QUICK_PRESETS[expert.id];
    if (!quickEl || !presets) return;

    const trigger = document.getElementById('wsQcTrigger');
    const modal = document.getElementById('wsQcModal');
    const selectedEl = document.getElementById('wsQcSelected');
    const countEl = document.getElementById('wsQcCount');
    const statsEl = document.getElementById('wsQcStats');
    const searchInput = document.getElementById('wsQcSearch');
    const clearBtn = document.getElementById('wsQuickClear');

    // 在 dispatch 区 textarea 上方渲染已选条件条（v15）
    function renderDispatchConditions() {
      const dispatch = document.getElementById('wsDispatch');
      if (!dispatch) return;
      let bar = dispatch.querySelector('.ws-dispatch__conditions-bar');
      const state = quickState[expert.id] || {};
      const total = Object.values(state).reduce((s, arr) => s + arr.length, 0);
      if (total === 0) { if (bar) bar.remove(); return; }
      const rows = Object.entries(state).filter(([, vals]) => vals.length > 0);
      const chipsHtml = rows.map(([label, vals]) => (
        '<span class="ws-dc-chip">' + escHtml(label) + '：' + vals.map(escHtml).join('、') + '</span>'
      )).join('');
      const html = '<div class="ws-dispatch__conditions-bar">' +
        '<div class="ws-dc-bar__chips">' + chipsHtml + '</div>' +
        '</div>';
      if (!bar) {
        // 找可见的 textarea（隐藏的音频 mic textarea 也带 id，要排除）
        const input = Array.from(dispatch.querySelectorAll('#wsDispatchInput'))
          .find(el => el.style.display !== 'none' && el.offsetParent !== null);
        if (input) input.insertAdjacentHTML('beforebegin', html);
      } else { bar.outerHTML = html; }
    }

    // 打开 / 关闭 modal
    function openModal() {
      if (!modal) return;
      modal.setAttribute('data-state', 'open');
      trigger.classList.add('is-open');
      trigger.setAttribute('aria-expanded', 'true');
      // 自动 focus 搜索框
      setTimeout(() => { if (searchInput) searchInput.focus(); }, 60);
    }
    function closeModal() {
      if (!modal) return;
      modal.setAttribute('data-state', 'closing');
      trigger.classList.remove('is-open');
      trigger.setAttribute('aria-expanded', 'false');
      setTimeout(() => { modal.setAttribute('data-state', 'closed'); }, 220);
    }

    function renderSelected() {
      const lines = [];
      Object.keys(quickState[expert.id] || {}).forEach((label) => {
        const vals = quickState[expert.id][label];
        if (vals.length) lines.push({ label, vals });
      });
      const total = lines.reduce((s, l) => s + l.vals.length, 0);

      // trigger count
      if (countEl) {
        countEl.textContent = total;
        countEl.dataset.state = total ? 'visible' : 'hidden';
      }
      // footer stats
      if (statsEl) {
        statsEl.innerHTML = '已选 <strong>' + total + '</strong> 个条件';
      }

      // modal 底部已选预览
      if (!selectedEl) return;
      if (total === 0) {
        selectedEl.innerHTML = '<div class="ws-qc-modal__selected-empty">💡 还没选条件 · 点上方 AI 猜你想加 / 字段 chip 试试</div>';
        return;
      }
      // 按 popover 顺序排
      const rowOrder = {};
      presets.forEach((r, i) => { rowOrder[r.label] = i; });
      lines.sort((a, b) => (rowOrder[a.label] ?? 99) - (rowOrder[b.label] ?? 99));
      selectedEl.innerHTML = lines.map((l, li) => (
        '<span class="ws-qc-modal-chip" data-label-idx="' + li + '" data-label="' + escHtml(l.label) + '">' +
          escHtml(l.label) + '：' + l.vals.map(escHtml).join('、') +
          '<span class="ws-qc-modal-chip__x" title="移除该字段全部">×</span>' +
        '</span>'
      )).join('');
      // 同步 nav-item「全选」状态
      syncNavAllSelected();
      // v15: 同时渲染 dispatch 区 textarea 上方的条件条
      renderDispatchConditions();
    }
    // 同步 AI 猜 / 最近用过 nav-item 全选状态
    function syncNavAllSelected() {
      if (!modal) return;
      const state = quickState[expert.id] || {};
      modal.querySelectorAll('[data-nav-type]').forEach((n) => {
        const t = n.getAttribute('data-nav-type');
        if (t !== 'ai' && t !== 'recent') {
          n.classList.remove('is-all-selected');
          return;
        }
        const group = modal.querySelector('[data-group="' + t + '"]');
        if (!group) return;
        const chips = Array.from(group.querySelectorAll('.ws-quick-chip'));
        const allOn = chips.length > 0 && chips.every((c) => {
          const r = c.getAttribute('data-row-label');
          const v = c.getAttribute('data-opt-val');
          const arr = state[r];
          return !!(arr && arr.indexOf(v) >= 0);
        });
        n.classList.toggle('is-all-selected', allOn);
      });
    }
    renderSelected();

    // 通用：把一个 chip 切到 state 上 + 写历史 + 刷 UI
    function applyChipFromKey(rowLabel, optVal, source) {
      if (!quickState[expert.id]) quickState[expert.id] = {};
      if (!quickState[expert.id][rowLabel]) quickState[expert.id][rowLabel] = [];
      const stateArr = quickState[expert.id][rowLabel];
      const k = stateArr.indexOf(optVal);
      if (source === 'ai' || source === 'recent') {
        if (k < 0) stateArr.push(optVal);
      } else {
        if (k >= 0) stateArr.splice(k, 1);
        else stateArr.push(optVal);
      }
      bumpHistory(expert.id, rowLabel + ':' + optVal);
      // 同步所有同 key 的 chip DOM（AI/最近/字段 3 处都可能有）
      if (modal) {
        modal.querySelectorAll('.ws-quick-chip[data-row-label="' + cssEscape(rowLabel) + '"][data-opt-val="' + cssEscape(optVal) + '"]')
          .forEach((c) => {
            const isOn = stateArr.indexOf(optVal) >= 0;
            c.classList.toggle('is-active', isOn);
          });
      }
      renderSelected();
      const hasActive = Object.values(quickState[expert.id] || {}).some((arr) => arr.length > 0);
      if (clearBtn) clearBtn.setAttribute('data-state', hasActive ? 'visible' : 'hidden');
    }
    function cssEscape(s) { return (s || '').replace(/(["\\])/g, '\\$1'); }

    // trigger click → 打开 modal
    if (trigger) {
      trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        if (modal && modal.getAttribute('data-state') === 'open') closeModal();
        else openModal();
      });
      // Esc 关闭
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal && modal.getAttribute('data-state') === 'open') closeModal();
      });
    }

    // modal 内部 click 委托
    if (modal) {
      // 关闭按钮 / 背景
      modal.addEventListener('click', (e) => {
        if (e.target.closest('[data-modal-close]')) { closeModal(); return; }
        if (e.target.closest('#wsQcAiFill')) { onAiFill(); return; }
        if (e.target.closest('#wsQcAiSort')) { onAiSort(); return; }
        if (e.target.closest('#wsQcClear')) { onClearAll(); return; }
        if (e.target.closest('#wsQcConfirm')) { closeModal(); return; }
        // 分类导航点击
        const navItem = e.target.closest('[data-nav-target]');
        if (navItem) {
          const t = navItem.getAttribute('data-nav-target');
          const navType = navItem.getAttribute('data-nav-type');
          const main = modal.querySelector('.ws-qc-modal__main');
          // AI 猜 / 最近用过：toggle 全选该组所有 chip（再点全取消）
          if (navType === 'ai' || navType === 'recent') {
            const group = modal.querySelector('[data-group="' + navType + '"]');
            if (group) {
              const chips = Array.from(group.querySelectorAll('.ws-quick-chip'));
              if (!quickState[expert.id]) quickState[expert.id] = {};
              const isOn = (r, v) => {
                const arr = quickState[expert.id][r];
                return !!(arr && arr.indexOf(v) >= 0);
              };
              const allOn = chips.length > 0 && chips.every((c) => isOn(c.getAttribute('data-row-label'), c.getAttribute('data-opt-val')));
              chips.forEach((c) => {
                const r = c.getAttribute('data-row-label');
                const v = c.getAttribute('data-opt-val');
                if (!r || !v) return;
                if (allOn && isOn(r, v)) {
                  // 全选 → 全取消：手动从 state 移除（applyChipFromKey 在 ai/recent 源只 add 不 remove）
                  const arr = quickState[expert.id][r];
                  if (arr) {
                    const k = arr.indexOf(v);
                    if (k >= 0) arr.splice(k, 1);
                  }
                  c.classList.remove('is-active');
                } else if (!allOn && !isOn(r, v)) {
                  // 未全选 → 选未选的
                  applyChipFromKey(r, v, navType);
                }
              });
              // 同步所有同 key 的 chip 状态（避免 body 字段组的同名 chip 不同步）
              if (modal) {
                modal.querySelectorAll('.ws-quick-chip').forEach((c2) => {
                  const r2 = c2.getAttribute('data-row-label');
                  const v2 = c2.getAttribute('data-opt-val');
                  const isOn2 = isOn(r2, v2);
                  c2.classList.toggle('is-active', isOn2);
                });
              }
              renderSelected();
              syncNavAllSelected();
              const hasActive = Object.values(quickState[expert.id] || {}).some((arr) => arr.length > 0);
              const cb = document.getElementById('wsQuickClear');
              if (cb) cb.setAttribute('data-state', hasActive ? 'visible' : 'hidden');
              // active 切换
              modal.querySelectorAll('[data-nav-target]').forEach((n) => n.classList.toggle('is-active', n === navItem));
              // 滚到该组
              if (main) main.scrollTo({ top: group.offsetTop - 8, behavior: 'smooth' });
            }
            return;
          }
          // 全部 / 字段：仅 active 切换 + scroll
          modal.querySelectorAll('[data-nav-target]').forEach((n) => n.classList.toggle('is-active', n === navItem));
          let target;
          if (t === 'all') {
            target = main;
          } else if (t.startsWith('row-')) {
            target = modal.querySelector('[data-row-idx="' + t.slice(4) + '"]');
          }
          if (target && main) main.scrollTo({ top: target.offsetTop - 8, behavior: 'smooth' });
          return;
        }
        // chip 点击
        const chip = e.target.closest('.ws-quick-chip');
        if (!chip) return;
        const rowLabel = chip.getAttribute('data-row-label');
        const optVal = chip.getAttribute('data-opt-val');
        const source = chip.hasAttribute('data-ai-key') ? 'ai'
          : chip.hasAttribute('data-recent-key') ? 'recent'
          : 'body';
        applyChipFromKey(rowLabel, optVal, source);
      });
    }

    // 已选 chip × 移除（带动画）
    if (selectedEl) {
      selectedEl.addEventListener('click', (e) => {
        const xBtn = e.target.closest('.ws-qc-modal-chip__x');
        if (!xBtn) return;
        const chipEl = xBtn.closest('.ws-qc-modal-chip');
        if (!chipEl) return;
        const label = chipEl.getAttribute('data-label');
        if (!label) return;
        chipEl.classList.add('is-removing');
        setTimeout(() => {
          if (quickState[expert.id] && quickState[expert.id][label]) {
            quickState[expert.id][label] = [];
          }
          if (modal) {
            modal.querySelectorAll('.ws-quick-chip[data-row-label="' + cssEscape(label) + '"]')
              .forEach((c) => c.classList.remove('is-active'));
          }
          renderSelected();
          const hasActive = Object.values(quickState[expert.id] || {}).some((arr) => arr.length > 0);
          if (clearBtn) clearBtn.setAttribute('data-state', hasActive ? 'visible' : 'hidden');
        }, 280);
      });
    }

    // 清除按钮（标题右侧的 quick-clear · 全局）
    if (clearBtn) {
      clearBtn.onclick = () => { onClearAll(); };
    }

    // 搜索：实时过滤 chip 显示
    if (searchInput) {
      searchInput.addEventListener('input', () => {
        const q = searchInput.value.trim().toLowerCase();
        if (!modal) return;
        modal.querySelectorAll('.ws-qc-modal__group').forEach((g) => {
          // AI / 最近不过滤（始终显示），但 row 组按 label 过滤
          if (g.getAttribute('data-group') === 'ai' || g.getAttribute('data-group') === 'recent') {
            g.style.display = '';
            return;
          }
          // 字段组：隐藏 val 不匹配的 chip；如果整个组都没匹配，整个组隐藏
          let visible = 0;
          g.querySelectorAll('.ws-quick-chip').forEach((c) => {
            const val = (c.getAttribute('data-opt-val') || '').toLowerCase();
            const label = (g.getAttribute('data-row-label') || '').toLowerCase();
            const match = !q || val.indexOf(q) >= 0 || label.indexOf(q) >= 0;
            c.style.display = match ? '' : 'none';
            if (match) visible++;
          });
          g.style.display = visible > 0 ? '' : 'none';
        });
      });
    }

    // AI 一键填充：选 4 个未选 + 高频 chip
    function onAiFill() {
      if (!quickState[expert.id]) quickState[expert.id] = {};
      const history = (readHistory()[expert.id]) || {};
      const cands = [];
      presets.forEach((row, ri) => {
        row.options.forEach((opt, oi) => {
          const isOn = (quickState[expert.id][row.label] || []).indexOf(opt) >= 0;
          if (isOn) return;
          const key = row.label + ':' + opt;
          const score = (history[key] || 0) * 10 - (ri * 0.3 + oi * 0.05);
          cands.push({ row: row.label, val: opt, ri, oi, score });
        });
      });
      cands.sort((a, b) => b.score - a.score);
      // 选 4 个：先按 row 分散，每 row 最多 1 个（避免 4 个全选同一字段）
      const TARGET = 4;
      const perRow = {};
      const pick = [];
      const byRow = {};
      cands.forEach((c) => { (byRow[c.row] = byRow[c.row] || []).push(c); });
      const rows = Object.keys(byRow);
      // 第一轮：每个 row 取 score 最高的 1 个
      while (pick.length < TARGET) {
        let best = null;
        for (const r of rows) {
          if ((perRow[r] || 0) >= 1) continue;
          for (const c of byRow[r]) {
            if (pick.indexOf(c) >= 0) continue;
            if (!best || c.score > best.score) best = c;
          }
        }
        if (!best) break;
        pick.push(best);
        perRow[best.row] = 1;
      }
      // 不足 4 个则继续补（不限 row）
      if (pick.length < TARGET) {
        for (const c of cands) {
          if (pick.length >= TARGET) break;
          if (pick.indexOf(c) >= 0) continue;
          pick.push(c);
        }
      }
      pick.forEach((p) => {
        if (!quickState[expert.id][p.row]) quickState[expert.id][p.row] = [];
        if (quickState[expert.id][p.row].indexOf(p.val) < 0) quickState[expert.id][p.row].push(p.val);
        bumpHistory(expert.id, p.row + ':' + p.val);
      });
      if (modal) {
        modal.querySelectorAll('.ws-quick-chip').forEach((c) => {
          const r = c.getAttribute('data-row-label');
          const v = c.getAttribute('data-opt-val');
          c.style.display = '';
          c.classList.toggle('is-active', !!(quickState[expert.id][r] && quickState[expert.id][r].indexOf(v) >= 0));
        });
      }
      if (searchInput) searchInput.value = '';
      renderSelected();
      const hasActive = Object.values(quickState[expert.id] || {}).some((arr) => arr.length > 0);
      if (clearBtn) clearBtn.setAttribute('data-state', hasActive ? 'visible' : 'hidden');
    }

    // 智能排序
    function onAiSort() {
      const history = (readHistory()[expert.id]) || {};
      const rowOrder = {};
      presets.forEach((r, i) => { rowOrder[r.label] = i; });
      const lines = [];
      Object.keys(quickState[expert.id] || {}).forEach((label) => {
        const vals = quickState[expert.id][label];
        if (vals.length) lines.push({ label, vals });
      });
      lines.sort((a, b) => {
        const ra = rowOrder[a.label] ?? 99;
        const rb = rowOrder[b.label] ?? 99;
        if (ra !== rb) return ra - rb;
        const sa = a.vals.reduce((s, v) => s + (history[a.label + ':' + v] || 0), 0);
        const sb = b.vals.reduce((s, v) => s + (history[b.label + ':' + v] || 0), 0);
        return sb - sa;
      });
      lines.forEach((l) => {
        l.vals.sort((x, y) => (history[l.label + ':' + y] || 0) - (history[l.label + ':' + x] || 0));
      });
      const next = {};
      lines.forEach((l) => { next[l.label] = l.vals; });
      quickState[expert.id] = next;
      renderSelected();
    }

    // 清空全部
    function onClearAll() {
      quickState[expert.id] = {};
      if (modal) {
        modal.querySelectorAll('.ws-quick-chip.is-active').forEach((c) => c.classList.remove('is-active'));
      }
      renderSelected();
      if (clearBtn) clearBtn.setAttribute('data-state', 'hidden');
    }
  }

  // 9.4 在 renderCenter 末尾调用（覆盖 IIFE 内的同名调用 — 采用 setTimeout 0 保证 DOM 就绪）
  // 由于 renderCenter 内部 self-call 太复杂，我们在外面劫持：监听 wsDispatch 出现后追加。
  // 实际更简单：renderCenter 调用后用 MutationObserver 监听 wsCenter 子节点变化触发
  function hookRenderCenterForQuick() {
    const center = document.getElementById('wsCenter');
    if (!center) return;
    // 立即渲染一次（IIFE 末尾调用时 wsCenter 里可能已有 wsDispatch）
    queueMicrotask(() => {
      const initialDispatch = document.getElementById('wsDispatch');
      if (initialDispatch) {
        const expert = EXPERTS.find((e) => e.id === currentExpertId) || EXPERTS[0];
        renderQuickPresets(expert);
      }
    });
    // MutationObserver 兜底后续切换
    // 注意：innerHTML 创建的 div 在 MO callback 时 node.id 尚未同步，
    // 必须用 querySelector 兜底查 #wsDispatch
    const mo = new MutationObserver((muts) => {
      for (const m of muts) {
        for (const node of m.addedNodes) {
          if (node.nodeType !== 1) continue;
          // 兜底：用 querySelector 找 wsDispatch（兼容 MO 时序问题）
          const dispatch = node.id === 'wsDispatch' ? node
                          : (node.querySelector ? node.querySelector('#wsDispatch') : null);
          if (dispatch) {
            const expert = EXPERTS.find((e) => e.id === currentExpertId) || EXPERTS[0];
            renderQuickPresets(expert);
            return;
          }
        }
      }
    });
    mo.observe(center, { childList: true, subtree: true });
  }
  hookRenderCenterForQuick();

  /* ============================================================
   * 10. 案例详情 modal · 9 专家通用 · 点最近案例卡片弹出
   * ============================================================ */

  // 10.1 mock 案例详情生成（基于 expert.id + sample 关键词推导）
  function buildSampleDetail(expert, sample) {
    const gradient = expert.avatar.gradient;
    const icon = sample.icon;
    const title = sample.name;
    const meta = sample.meta;

    // 关键词 → 描述 / stats / tags
    const kw = title;
    let desc = '';
    let tags = [];
    let stats = [];
    if (kw.includes('Logo') || kw.includes('logo')) {
      desc = `AI 生成的 "${title}" 方案。基于品牌基因、客户行业、色彩心理学三维度匹配，30 秒出 4-8 个候选。客户采纳前会经过内部字体识别、行业禁忌词过滤、版权风险检测三道关。`;
      tags = ['餐饮', '简约', '年轻化', '高识别度'];
      stats = [
        { num: '320', label: '生成方案' },
        { num: '78%', label: '一次采纳率', gold: true },
        { num: '4.2', label: '客户评分' }
      ];
    } else if (kw.includes('VI')) {
      desc = `完整品牌视觉识别系统，包含 Logo 应用规范、配色体系、字体规范、辅助图形、办公/物料/广告三类应用模板。导出后可直接落地到 VI 手册。`;
      tags = ['品牌系统', '应用模板', '全套'];
      stats = [
        { num: '156', label: '整套交付' },
        { num: '98%', label: '规范达标', gold: true },
        { num: '32', label: '应用模块' }
      ];
    } else if (kw.includes('海报')) {
      desc = `营销海报智能设计，自动选品类模板、调节构图节奏、配色匹配品牌色系、文案 A/B 版同时输出。适配公众号、朋友圈、电梯、地铁等多场景。`;
      tags = ['营销', '多场景', 'A/B 文案'];
      stats = [
        { num: '480', label: '生成海报' },
        { num: '71%', label: '采纳率', gold: true },
        { num: '6', label: '场景适配' }
      ];
    } else if (kw.includes('公众号') || kw.includes('文章') || kw.includes('小红书')) {
      desc = `AI 撰写的 "${title}" 模板。已结合品牌语气、目标受众画像、SEO 关键词库自动优化。可一键发布到公众号 / 小红书 / 知乎，全平台分发。`;
      tags = ['爆款', 'SEO 优化', '全平台分发'];
      stats = [
        { num: '1.2k', label: '生成文章' },
        { num: '89 篇', label: '10w+ 爆款', gold: true },
        { num: '3.2 万', label: '平均阅读' }
      ];
    } else if (kw.includes('会议') || kw.includes('纪要') || kw.includes('录音')) {
      desc = `会议结束自动生成结构化纪要：议题 / 决策 / 待办 / 风险四象限拆分；发言人区分；关键句高亮；可导出 Markdown / Word / PDF。`;
      tags = ['结构化', '发言人', '可导出'];
      stats = [
        { num: '890 场', label: '处理会议' },
        { num: '4.9 分', label: '满意度', gold: true },
        { num: '12', label: '支持语种' }
      ];
    } else if (kw.includes('视频') || kw.includes('短视频') || kw.includes('成片')) {
      desc = `短视频一键生成。脚本 AI 撰写 → 配音（真人 / 数字人）→ 素材匹配 → 字幕 → BGM → 渲染导出，3 分钟出 60s 成片，适配抖音 / 快手 / 视频号。`;
      tags = ['真人配音', '多平台', '一键发布'];
      stats = [
        { num: '720 条', label: '生成视频' },
        { num: '68%', label: '完播率', gold: true },
        { num: '4 平台', label: '一键分发' }
      ];
    } else if (kw.includes('趋势') || kw.includes('对比') || kw.includes('报告') || kw.includes('饼') || kw.includes('漏斗')) {
      desc = `AI 数据分析报告。从 12 个维度对最近数据做趋势 / 对比 / 异常 / 占比四象限解读，自动输出结论 + 行动建议 + 后续监控项。`;
      tags = ['多维度', '自动解读', '可下钻'];
      stats = [
        { num: '180 份', label: '生成报告' },
        { num: '94%', label: '结论准确', gold: true },
        { num: '12', label: '分析维度' }
      ];
    } else if (kw.includes('八字') || kw.includes('排盘') || kw.includes('命理')) {
      desc = `玄空飞星派八字排盘，基于公历生辰 + 真太阳时 + 节气交接精确计算。四柱 + 大运 + 流年 + 神煞，紫白九星定位吉凶方位。`;
      tags = ['玄空飞星', '真太阳时', '紫白九星'];
      stats = [
        { num: '2.3k', label: '排盘案例' },
        { num: '4.8 分', label: '客户评分', gold: true },
        { num: '12', label: '流派切换' }
      ];
    } else if (kw.includes('星座') || kw.includes('配对') || kw.includes('每日') || kw.includes('解读')) {
      desc = `AI 星座解读。结合古典占星 + 心理占星双体系，分析行星过境 + 相位 + 宫位，给出爱情 / 事业 / 财运三维解读。`;
      tags = ['双体系', '多维度', '合盘'];
      stats = [
        { num: '12.8k', label: '解读量' },
        { num: '92%', label: '满意度', gold: true },
        { num: '24 节气', label: '自动更新' }
      ];
    } else {
      desc = `${expert.name} 「${title}」参考案例。基于 UMmakex 历史最佳实践 + 行业头部方法论生成，${meta}。可一键复用为新需求模板。`;
      tags = ['高采纳', '可复用', '行业头部'];
      stats = [
        { num: '1k+', label: '累计采用' },
        { num: '85%', label: '采纳率', gold: true },
        { num: '4.6', label: '客户评分' }
      ];
    }

    return { icon, title, meta, gradient, desc, tags, stats };
  }

  let currentSampleDetail = null;

  function openSampleModal(expert, sample, sIdx) {
    const modalEl = document.getElementById('wsSampleModal');
    if (!modalEl) return;
    const detail = buildSampleDetail(expert, sample);
    currentSampleDetail = { expert, sample, sIdx, ...detail };

    // 填充 head
    const iconEl = document.getElementById('wsSampleIcon');
    iconEl.textContent = detail.icon;
    iconEl.style.background = detail.gradient;
    document.getElementById('wsSampleTitle').textContent = detail.title;
    document.getElementById('wsSampleSub').textContent = expert.name + ' · ' + detail.meta;

    // 填充 body：预览 + 描述 + stats + tags
    const bodyEl = document.getElementById('wsSampleBody');
    bodyEl.innerHTML = (
      // 预览大图
      '<div class="ws-sample-modal__preview" style="background:' + detail.gradient + ';">' +
        '<span class="ws-sample-modal__preview-badge">' + escHtml(expert.name) + '</span>' +
        '<span class="ws-sample-modal__preview-label">' + escHtml(detail.title) + '</span>' +
        '<div class="ws-sample-modal__preview-overlay"></div>' +
      '</div>' +
      // 描述
      '<div class="ws-sample-modal__desc">' + escHtml(detail.desc) + '</div>' +
      // stats 3 列
      '<div class="ws-sample-modal__stats">' +
        detail.stats.map((s) => (
          '<div class="ws-sample-modal__stat">' +
            '<div class="ws-sample-modal__stat-num' + (s.gold ? ' ws-sample-modal__stat-num--gold' : '') + '">' + escHtml(s.num) + '</div>' +
            '<div class="ws-sample-modal__stat-label">' + escHtml(s.label) + '</div>' +
          '</div>'
        )).join('') +
      '</div>' +
      // tags
      '<div class="ws-sample-modal__tags">' +
        detail.tags.map((t) => '<span class="ws-sample-modal__tag">' + escHtml(t) + '</span>').join('') +
      '</div>'
    );

    modalEl.dataset.state = 'open';
  }

  function closeSampleModal() {
    const modalEl = document.getElementById('wsSampleModal');
    if (modalEl) modalEl.dataset.state = 'closed';
    currentSampleDetail = null;
  }

  // 10.2 全局委托：点击最近案例卡片
  document.addEventListener('click', (e) => {
    const sampleEl = e.target.closest('.ws-detail__sample[data-expert-id]');
    if (!sampleEl) return;
    const expertId = sampleEl.getAttribute('data-expert-id');
    const sIdx = parseInt(sampleEl.getAttribute('data-sample-idx'), 10);
    const expert = EXPERTS.find((x) => x.id === expertId);
    if (!expert || isNaN(sIdx) || !expert.samples[sIdx]) return;
    openSampleModal(expert, expert.samples[sIdx], sIdx);
  });

  // 10.3 关闭按钮 / 点 backdrop
  document.addEventListener('click', (e) => {
    if (e.target.closest('[data-sample-close]')) {
      closeSampleModal();
    }
  });

  // 10.4 Esc 关闭
  document.addEventListener('keydown', (e) => {
    const modalEl = document.getElementById('wsSampleModal');
    if (e.key === 'Escape' && modalEl && modalEl.dataset.state === 'open') {
      closeSampleModal();
    }
  });

  // 10.5「用这个案例发需求」按钮：把描述填进 textarea + 关 modal + 切到 dispatch tab
  function useSampleAsRequirement() {
    if (!currentSampleDetail) return;
    const { expert, desc, title } = currentSampleDetail;
    const input = document.getElementById('wsDispatchInput');
    if (input) {
      // 简化 prompt：直接用 desc 关键信息
      const promptText = `参考「${title}」案例风格：${desc.slice(0, 80)}`;
      input.value = promptText;
      input.placeholder = '已根据案例自动填充，可手动调整';
      // 重置 chip 状态（用户复用案例时清掉旧 chip）
      if (quickState[expert.id]) {
        quickState[expert.id] = {};
      }
    }
    closeSampleModal();
    // 滚动 dispatch 区到 textarea
    const dispatchEl = document.getElementById('wsDispatch');
    if (dispatchEl) dispatchEl.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }
  // 绑定按钮（用事件委托，单一监听避免重复绑定）
  document.addEventListener('click', (e) => {
    if (e.target.closest('#wsSampleUseIt')) {
      e.preventDefault();
      useSampleAsRequirement();
    }
  });
});