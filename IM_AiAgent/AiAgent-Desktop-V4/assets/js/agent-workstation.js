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

  /* ---------- 1. 8 专家数据 ---------- */
  const EXPERTS = [
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

    const samples = expert.samples.map(s => (
      '<div class="ws-detail__sample">' +
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
            '<div class="ws-detail__status"><span class="ws-detail__status-dot"></span>在线 · 可接单</div>' +
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
        '</div>' +
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
        '<button class="ws-dispatch__submit" id="wsDispatchSubmit" type="button">派单给 ' + expert.name + '</button>' +
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
      submitTask(expert, req);
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
            '<div class="ws-data-block__hint">8 位专家</div>' +
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
          markExpertBusy(expert.id, false);
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
            requirement: task.requirement
          });
          while (resultHistory.length > HISTORY_MAX) resultHistory.pop();
        }
      });
    } else {
      // fallback
      setTimeout(() => {
        task.status = 'done';
        task.progress = 100;
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
          '<div class="ws-progress__title">⚡ 任务进行中</div>' +
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
    center.innerHTML = (
      '<div class="ws-result">' +
        '<div class="ws-result__head">' +
          '<div class="ws-result__title">✓ 任务完成</div>' +
          '<div class="ws-result__cost">消耗 ' + task.cost + ' 算力</div>' +
        '</div>' +
        '<div class="ws-result__content">' + results + '</div>' +
        '<div class="ws-result__actions">' +
          '<button class="ws-result__action" data-action="rerun">↻ 重新生成</button>' +
          '<button class="ws-result__action ws-result__action--primary" data-action="view">查看大图</button>' +
          '<button class="ws-result__action" data-action="apply">采纳</button>' +
          '<button class="ws-result__action" data-action="save">收藏</button>' +
        '</div>' +
      '</div>' +
      '<button class="ws-dispatch__submit" id="wsDispatchReset" type="button" style="background: linear-gradient(135deg, #8B8B9E, #6E6E84); box-shadow: none;">← 返回继续派单</button>'
    );
    if (HAS_GSAP) {
      gsap.fromTo('.ws-result', { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.4)' });
    }
    document.getElementById('wsDispatchReset').addEventListener('click', renderCenter);
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
            '<span class="ws-mr-tag">CEO 调度</span>' +
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

  // 历史对比缩略
  function renderHistory() {
    const center = document.getElementById('wsCenter');
    if (!center) return;
    // 删旧 history 块
    const old = document.getElementById('wsHistory');
    if (old) old.remove();
    if (resultHistory.length === 0) return;

    const items = resultHistory.slice(0, HISTORY_MAX).map(t => (
      '<div class="ws-history__item" data-task-id="' + t.taskId + '">' +
        '<div class="ws-history__item-thumb" style="background:' + t.avatar.gradient + ';">' + t.avatar.emoji + '</div>' +
        '<div class="ws-history__item-name">' + t.expertName + '</div>' +
        '<div class="ws-history__item-meta">' + t.taskId + ' · ' + t.cost + ' 算力</div>' +
      '</div>'
    )).join('');

    const block = document.createElement('div');
    block.id = 'wsHistory';
    block.className = 'ws-history';
    block.innerHTML = (
      '<div class="ws-history__head">' +
        '<div class="ws-history__title">↺ 历史派单 · 快速回看</div>' +
        '<div class="ws-history__count">' + resultHistory.length + ' 条</div>' +
      '</div>' +
      '<div class="ws-history__list">' + items + '</div>'
    );
    center.appendChild(block);

    // 绑定点击 → 打开 modal
    block.querySelectorAll('.ws-history__item').forEach(item => {
      item.addEventListener('click', () => {
        const taskId = item.dataset.taskId;
        const fullTask = tasks.find(t => t.id === taskId);
        const expert = EXPERTS.find(e => e.id === fullTask.expertId);
        if (fullTask && expert) {
          openResultModal(fullTask, expert, fullTask.requirement);
        }
      });
    });
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
});