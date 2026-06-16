/* ========================================
   chat-panel.js — 右侧滑出对话面板
   阶段3 完整实现：分步thinking + 多轮上下文 + 输入防抖
   ======================================== */

let currentChatAgent = null;
const chatHistory = {}; // { agentId: [messages] }
let isTyping = false;   // 防止 typing 期间用户再次发送

const CONFIG_AGENT_IDS = ['sales', 'customer'];
const AGENT_CONFIG_DATA = {
  sales: {
    kicker: 'P0 · AI SALES CONFIG',
    title: 'AI 销售助手配置中心',
    desc: '配置新人资料、商品库、营销打法、标签策略和跟进节奏，让销售 Agent 自动完成识别意向、推荐商品、报价促单。',
    caps: ['读新人', '配商品', '算佣金', '定打法', '打标签', '排跟进'],
    metrics: [
      ['6', '配置模块'],
      ['23', '今日跟进'],
      ['81%', '话术命中']
    ],
    modules: [
      ['01', '🧾', '新人资料模板', '身份 / 性格 / 收入 / 家庭 / 需求', '主配置'],
      ['02', '🛒', '我的商品库', '已选商品 / 卖点 / 价格 / 佣金', '已同步'],
      ['03', '🏪', '平台商品库', '平台统一商品 / 等级佣金 / 一键加入', '可选 128'],
      ['04', '💡', '营销思路', '信任 / 共鸣 / 专家 / 成交打法', '策略中'],
      ['05', '🏷', '标签策略', '意向 / 消费 / 关系 / 性格 / 场景', '自动更新'],
      ['06', '🎯', '跟进节奏', '首聊 / 培育 / 促单 / 复访', '运行中']
    ],
    logs: ['12:04 已更新李雅楠标签：高意向 / 价格敏感', '11:48 商品库同步 3 个新品佣金规则', '10:32 促单话术命中率提升到 81%']
  },
  customer: {
    kicker: 'P0 · AI SERVICE CONFIG',
    title: 'AI 客服助手配置中心',
    desc: '配置 FAQ、售后规则、回答策略、情绪安抚、复购引导和转人工边界，让客服 Agent 稳定接待客户。',
    caps: ['FAQ 题库', '售后规则', '智能回答', '情绪安抚', '复购引导', '转人工'],
    metrics: [
      ['6', '管理模块'],
      ['37', '今日接待'],
      ['94%', 'FAQ 命中']
    ],
    modules: [
      ['01', '📚', 'FAQ 题库', '常见问题 / 标准答案 / 命中率', '主配置'],
      ['02', '📦', '售后规则', '退款 / 物流 / 发票 / 赔付', '已启用'],
      ['03', '💬', '智能回答', '回答策略 / 引用规则 / 禁用词', '运行中'],
      ['04', '🫶', '情绪安抚', '负面情绪 / 升级处理', '监控中'],
      ['05', '🔁', '复购引导', '售后满意 / 二次推荐', '自动触发'],
      ['06', '👤', '转人工规则', '高风险 / 投诉 / 复杂问题', 'P0 优先']
    ],
    logs: ['12:11 命中物流 FAQ：订单 #2024060901', '11:36 识别投诉风险，已建议转人工', '10:58 复购引导触发 7 位售后满意客户']
  }
};

function isConfigAgent(agentId) {
  return CONFIG_AGENT_IDS.includes(agentId);
}

/* === 打开右侧 Agent 面板：办公室人物 / 左侧列表统一走聊天 === */
function openAgentPanel(agentId) {
  openChatPanel(agentId);
}

function setPanelMode(mode) {
  const panel = document.getElementById('chatPanel');
  const footer = document.querySelector('.chat-panel-input');
  if (panel) {
    panel.classList.toggle('is-config-mode', mode === 'config');
    panel.classList.toggle('is-chat-mode', mode !== 'config');
  }
  if (footer) footer.style.display = mode === 'config' ? 'none' : '';
}

function syncAgentActive(agentId) {
  document.querySelectorAll('.agent-item').forEach(li => {
    li.classList.toggle('is-active', li.dataset.agentId === agentId);
  });
}

/* === 打开配置中心面板 === */
function openConfigPanel(agentId) {
  const agent = getAgent(agentId);
  const cfg = AGENT_CONFIG_DATA[agentId];
  if (!agent || !cfg) return;

  if (isTyping) return;
  currentChatAgent = null;
  setPanelMode('config');
  syncAgentActive(agentId);

  const head = document.getElementById('chatPanelAgent');
  if (head) {
    head.innerHTML = `
      <div class="cpa-avatar" style="background:${agent.color}">${agent.icon}</div>
      <div class="cpa-info">
        <span class="cpa-name">${agent.name}</span>
        <span class="cpa-role">配置中心 · ${agent.en}</span>
      </div>
    `;
  }

  const welcome = document.getElementById('chatWelcome');
  const thread = document.getElementById('chatThread');
  if (welcome) welcome.style.display = 'none';
  if (thread) {
    thread.innerHTML = renderConfigPanel(agent, cfg);
  }

  const panel = document.getElementById('chatPanel');
  if (panel) panel.classList.add('is-open');
  scrollChatToBottom(false);
}

function renderConfigPanel(agent, cfg) {
  return `
    <section class="agent-config-panel" style="--agent-color:${agent.color};--agent-soft:${agent.colorSoft || '#fee2e2'}">
      <div class="agent-config-hero">
        <span class="agent-config-kicker">${escapeHtml(cfg.kicker)}</span>
        <h3>${escapeHtml(cfg.title)}</h3>
        <p>${escapeHtml(cfg.desc)}</p>
        <div class="agent-config-caps">
          ${cfg.caps.map(c => `<span>${escapeHtml(c)}</span>`).join('')}
        </div>
      </div>

      <div class="agent-config-metrics">
        ${cfg.metrics.map(m => `
          <div>
            <strong>${escapeHtml(m[0])}</strong>
            <span>${escapeHtml(m[1])}</span>
          </div>
        `).join('')}
      </div>

      <div class="agent-config-section-head">
        <span>功能配置</span>
        <em>CONFIG · ${cfg.modules.length} 项</em>
      </div>
      <div class="agent-config-grid">
        ${cfg.modules.map((m, idx) => `
          <button class="agent-config-card ${idx === 0 ? 'is-primary' : ''}" type="button" data-config-module="${escapeHtml(m[2])}">
            <i>${escapeHtml(m[0])}</i>
            <b>${m[1]}</b>
            <strong>${escapeHtml(m[2])}</strong>
            <span>${escapeHtml(m[3])}</span>
            <em>${escapeHtml(m[4])}</em>
          </button>
        `).join('')}
      </div>

      <div class="agent-config-section-head compact">
        <span>最近配置动态</span>
        <em>LIVE LOG</em>
      </div>
      <div class="agent-config-logs">
        ${cfg.logs.map(log => `<div><i></i><span>${escapeHtml(log)}</span></div>`).join('')}
      </div>
    </section>
  `;
}

/* === 6 Agent 各自的思考步骤 === */
const THINKING_STEPS = {
  sales:    ['识别客户画像',     '匹配商品库',     '生成报价方案'],
  customer: ['查询订单状态',     '判断情绪等级',   '生成安抚话术'],
  meeting:  ['转写会议录音',     '提取关键决策',   '生成行动项'],
  design:   ['解析设计需求',     '调用设计模型',   '生成视觉方案'],
  video:    ['拆解脚本结构',     '设计分镜',       '生成成片'],
  writing:  ['分析平台调性',     '匹配爆款规律',   '生成文案'],
};

/* === 打开对话面板 === */
function openChatPanel(agentId) {
  const agent = getAgent(agentId);
  if (!agent) return;
  currentChatAgent = agentId;
  setPanelMode('chat');

  // 同步侧边栏高亮
  syncAgentActive(agentId);

  // 渲染面板头部
  const head = document.getElementById('chatPanelAgent');
  head.innerHTML = `
    <div class="cpa-avatar" style="background:${agent.color}">${agent.icon}</div>
    <div class="cpa-info">
      <span class="cpa-name">${agent.name}</span>
      <span class="cpa-role">${agent.role} · ${agent.en}</span>
    </div>
  `;

  // 渲染欢迎语 + 快捷指令
  const welcome = document.getElementById('chatWelcome');
  const thread = document.getElementById('chatThread');
  const quickRow = document.getElementById('chatQuickRow');

  if (!chatHistory[agentId] || chatHistory[agentId].length === 0) {
    welcome.style.display = 'block';
    welcome.innerHTML = `
      <div class="chat-welcome-avatar" style="background:${agent.color}">${agent.icon}</div>
      <div class="chat-welcome-greeting">${agent.name}</div>
      <div class="chat-welcome-desc">${agent.desc}</div>
      <div class="chat-welcome-caps">
        ${agent.caps.map(c => `<span class="chat-welcome-cap">${c}</span>`).join('')}
      </div>
    `;
    thread.innerHTML = '';
  } else {
    welcome.style.display = 'none';
    renderThread(agentId);
  }

  quickRow.innerHTML = agent.quickPrompts.map((q, i) =>
    `<button class="chat-quick-chip" data-quick="${i}">${q}</button>`
  ).join('');
  quickRow.querySelectorAll('.chat-quick-chip').forEach(btn => {
    btn.addEventListener('click', () => {
      const text = agent.quickPrompts[parseInt(btn.dataset.quick)];
      document.getElementById('chatInput').value = text;
      document.getElementById('chatInput').focus();
    });
  });

  // 打开面板
  document.getElementById('chatPanel').classList.add('is-open');
  setTimeout(() => document.getElementById('chatInput').focus(), 300);
  scrollChatToBottom();
}

/* === 关闭对话面板 === */
function closeChatPanel() {
  if (isTyping) return; // 思考中禁止关闭（避免视觉突兀）
  document.getElementById('chatPanel').classList.remove('is-open');
  setPanelMode('chat');
  document.querySelectorAll('.workstation').forEach(ws => ws.style.outline = '');
  document.querySelectorAll('.agent-item').forEach(li => li.classList.remove('is-active'));
  currentChatAgent = null;
  // 阶段 4.3：关闭对话时也恢复大屏聚焦
  if (typeof unfocusScreen === 'function') unfocusScreen();
}

/* === 滚动到底 === */
function scrollChatToBottom(toBottom = true) {
  const body = document.getElementById('chatPanelBody');
  if (body) {
    requestAnimationFrame(() => {
      body.scrollTop = toBottom ? body.scrollHeight : 0;
    });
  }
}

/* === 渲染对话流 === */
function renderThread(agentId) {
  const thread = document.getElementById('chatThread');
  const msgs = chatHistory[agentId] || [];
  thread.innerHTML = msgs.map(m => renderMessage(m)).join('');
  scrollChatToBottom();
}

function renderMessage(m) {
  if (m.type === 'user') {
    return `
      <div class="chat-msg user">
        <div class="chat-msg-avatar">M</div>
        <div class="chat-msg-bubble">${escapeHtml(m.text)}</div>
      </div>
    `;
  }
  if (m.type === 'thinking') {
    return `
      <div class="chat-msg thinking">
        <div class="chat-msg-avatar" style="background:${m.color}">${m.icon}</div>
        <div class="chat-thinking">
          <div class="chat-thinking-title">${escapeHtml(m.title)}</div>
          ${m.lines.map(l => `<span class="chat-thinking-line ${l.startsWith('✓') ? 'done' : 'pending'}">${escapeHtml(l.replace(/^[✓●]\s?/, ''))}</span>`).join('')}
        </div>
      </div>
    `;
  }
  if (m.type === 'ai') {
    let resultHtml = '';
    if (m.result) {
      resultHtml = `
        <div class="chat-result-card" style="border-left-color:${m.color}">
          <div class="chat-result-title">${escapeHtml(m.result.title)}</div>
          <div class="chat-result-list">
            ${m.result.items.map(it => `<div class="chat-result-item">${escapeHtml(it)}</div>`).join('')}
          </div>
        </div>
      `;
    }
    return `
      <div class="chat-msg">
        <div class="chat-msg-avatar" style="background:${m.color}">${m.icon}</div>
        <div>
          <div class="chat-msg-bubble">${escapeHtml(m.text)}</div>
          ${resultHtml}
        </div>
      </div>
    `;
  }
  return '';
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

/* === 发送消息 === */
function sendMessage() {
  if (!currentChatAgent || isTyping) return;
  const input = document.getElementById('chatInput');
  const text = input.value.trim();
  if (!text) return;
  input.value = '';

  const agent = getAgent(currentChatAgent);
  if (!chatHistory[currentChatAgent]) chatHistory[currentChatAgent] = [];
  chatHistory[currentChatAgent].push({ type: 'user', text });

  // 第一次发送：隐藏欢迎
  const welcome = document.getElementById('chatWelcome');
  if (welcome) welcome.style.display = 'none';

  renderThread(currentChatAgent);

  // 模拟 thinking + 响应
  simulateAgentResponse(currentChatAgent, text, agent);
}

/* === 阶段3：分步 thinking + 多轮上下文 === */
function simulateAgentResponse(agentId, userText, agent) {
  // 锁定输入
  setTyping(true, agent);

  const steps = THINKING_STEPS[agentId] || THINKING_STEPS.sales;

  // 初始 thinking 状态：3 行都 pending
  const thinkingMsg = {
    type: 'thinking',
    color: agent.color,
    icon: agent.icon,
    title: `${agent.name} 正在分析`,
    lines: steps.map(s => `● ${s}`)
  };
  chatHistory[agentId].push(thinkingMsg);
  renderThread(agentId);

  // 分步推进：每 380ms 标记一行完成
  let stepIndex = 0;
  const tickInterval = setInterval(() => {
    if (stepIndex < steps.length) {
      thinkingMsg.lines[stepIndex] = `✓ ${steps[stepIndex]}`;
      renderThread(agentId);
      stepIndex++;
    } else {
      clearInterval(tickInterval);
    }
  }, 380);

  // 1.5s 后输出 AI 响应
  setTimeout(() => {
    clearInterval(tickInterval);
    // 移除 thinking
    chatHistory[agentId] = chatHistory[agentId].filter(m => m.type !== 'thinking');
    // 注入 AI 响应（带 history 上下文）
    const history = chatHistory[agentId].filter(m => m.type !== 'thinking');
    const response = mockAgentReply(agentId, userText, agent, history);
    chatHistory[agentId].push(response);
    renderThread(agentId);

    // 解锁输入
    setTyping(false, agent);

    // 触发工位脉冲
    fireWorkstationPulse(agentId);
  }, 1500);
}

/* === 输入锁定 === */
function setTyping(flag, agent) {
  isTyping = flag;
  const input = document.getElementById('chatInput');
  const sendBtn = document.getElementById('chatSend');
  if (input) {
    input.disabled = flag;
    input.placeholder = flag ? `${agent.name} 正在思考…` : '输入任务或问题…';
  }
  if (sendBtn) {
    sendBtn.disabled = flag;
    sendBtn.textContent = flag ? '…' : '发送';
  }
  // 侧边栏状态联动
  if (currentChatAgent) {
    const item = document.querySelector(`.agent-item[data-agent-id="${currentChatAgent}"]`);
    if (item) {
      item.classList.toggle('is-typing', flag);
    }
  }
}

/* === mock 回复生成（带多轮上下文） === */
function mockAgentReply(agentId, userText, agent, history) {
  // history 是过滤掉 thinking 后的消息数组，最后一条就是当前 userText 之前的上一轮
  // 第一次回复：history 里只有 1 条 user
  // 追问：history >= 3 条（user + ai + user + ai + user...）
  const isFollowUp = history && history.length >= 3;

  if (isFollowUp) {
    return mockFollowUpReply(agentId, userText, agent, history);
  }
  return mockFirstReply(agentId, agent);
}

/* === 首轮回复：完整方案 + result card === */
function mockFirstReply(agentId, agent) {
  const responses = {
    sales: {
      text: '已分析客户画像和商品库，匹配到 3 款高意向商品。',
      result: {
        title: '推荐商品 + 报价方案',
        items: [
          '主推：春季新品 · 樱花限定礼盒 ¥298',
          '备选：经典护肤套装 ¥598',
          '辅助：高性价比体验装 ¥98',
          '建议话术：突出限定 + 节日氛围',
          '客户标签更新：高意向 / 价格敏感',
          '下一步：发送商品卡片 + 限时优惠'
        ]
      }
    },
    customer: {
      text: '已读取订单状态，自动查询到物流信息。',
      result: {
        title: '客户问题处理方案',
        items: [
          '订单号：#2024060901',
          '物流状态：已发往杭州中转',
          '预计到达：明日 14:00 前',
          '情绪安抚：先道歉 + 解释时效',
          '补偿建议：发放 ¥20 优惠券',
          '升级处理：提交 VIP 绿色通道'
        ]
      }
    },
    meeting: {
      text: '正在转写并提取关键信息。',
      result: {
        title: 'Q3 复盘会议纪要',
        items: [
          '参会人：陈志远 / 张敏 / 阿明 / 王总',
          '核心议题：Q3 转化目标 / Agent 配置',
          '关键决策：增配 AI 设计专家',
          '行动项 1：销售助手配置升级（@陈志远）',
          '行动项 2：6月15日前完成（@张敏）',
          '下次会议：6/20 10:00'
        ]
      }
    },
    design: {
      text: '正在调用设计模型生成方案。',
      result: {
        title: '618 活动主视觉设计',
        items: [
          '主视觉：红色激情 + 数字 618 大字',
          '配色：#FF3B30 + #1A1A1A + 暖白',
          '字体：思源宋体粗体 + DM Mono',
          '生成数量：3 版主视觉',
          '交付格式：1080×1920 竖版 + 1080×1080 方版',
          '下载链接：已生成 6 张 PNG'
        ]
      }
    },
    video: {
      text: '正在拆解脚本结构并生成视频。',
      result: {
        title: '30s 产品介绍短视频',
        items: [
          '脚本结构：痛点 → 卖点 → 价格 → CTA',
          '分镜：6 个镜头 / 5s 切镜',
          '配音：女声温柔 / 语速中',
          'BGM：轻快电子 / 80BPM',
          '字幕：自动生成 + 关键词高亮',
          '成片时长：32s / 720P'
        ]
      }
    },
    writing: {
      text: '正在分析平台调性和爆款规律。',
      result: {
        title: '小红书种草文案',
        items: [
          '标题：3 个备选（emoji + 数字 + 钩子）',
          '开头：痛点共鸣 + 个人故事',
          '正文：3 段体验描述 + 真实数据',
          '结尾：优惠信息 + 互动话题',
          '标签：#种草 #好物 #618',
          '预估曝光：5000-8000'
        ]
      }
    }
  };

  const r = responses[agentId] || responses.sales;
  return {
    type: 'ai',
    color: agent.color,
    icon: agent.icon,
    text: r.text,
    result: r.result
  };
}

/* === 追问回复：短回复 + 引用上文，无 result card === */
function mockFollowUpReply(agentId, userText, agent, history) {
  // 根据 userText 关键词给不同回复
  const t = userText.toLowerCase();

  let text = '已基于您上文的需求做了调整。';
  let extra = null;

  if (t.includes('再') || t.includes('再来') || t.includes('多') || t.includes('更多')) {
    text = '已扩展到 6 款，新增 2 款高客单 + 2 款引流款。';
    extra = '另附 618 活动价 + 客户分层建议。';
  } else if (t.includes('便宜') || t.includes('降价') || t.includes('优惠') || t.includes('性价比')) {
    text = '已将主推款从 ¥598 调整为 ¥298（限今日 24:00）。';
    extra = '同步申请一张 ¥50 满减券，可叠加使用。';
  } else if (t.includes('贵') || t.includes('高端') || t.includes('升级')) {
    text = '推荐升级到 ¥1280 的年度套装（含 12 件正装 + 限定礼盒）。';
    extra = '高客单客户转化率历史均值 23%，建议配 1v1 顾问。';
  } else if (t.includes('短') || t.includes('简化') || t.includes('简')) {
    text = '已精简为 30s 速记版，关键决策 + 行动项保留。';
  } else if (t.includes('详细') || t.includes('展开') || t.includes('更多细节')) {
    text = '已补充完整版：参会人发言要点 + 决策依据 + 风险评估。';
  } else if (t.includes('红色') || t.includes('蓝色') || t.includes('黑色') || t.includes('白色') || t.includes('换个')) {
    text = '主色已替换为新色系，重新生成 3 版。';
    extra = '保持原有字体 + 构图不变。';
  } else if (t.includes('短一点') || t.includes('30') || t.includes('15s') || t.includes('60s')) {
    text = '脚本已压缩到指定时长，关键信息全部保留。';
  } else if (t.includes('平台') || t.includes('抖音') || t.includes('知乎') || t.includes('公众号')) {
    text = '已按目标平台调性重写，开头 + 标签策略同步调整。';
  } else {
    text = '已根据您的追问做了对应调整，核心方案不变。';
  }

  return {
    type: 'ai',
    color: agent.color,
    icon: agent.icon,
    text,
    result: extra ? {
      title: '调整说明',
      items: [extra, '注：完整方案请查看历史消息', '需要再次调整请直接告诉我']
    } : null
  };
}

/* === 配置卡片点击（演示态 toast） === */
document.addEventListener('click', (e) => {
  const card = e.target.closest('.agent-config-card');
  if (!card) return;
  showToast(`✅ ${card.dataset.configModule} 配置已打开（演示）`, 'success');
});

/* === 附件按钮（占位 toast） === */
function handleAttach() {
  if (isTyping) return;
  showToast('附件上传 · 阶段4 接入', 'info');
}

/* === 顶部 toast 提示 === */
function showToast(msg, type = 'info') {
  const layer = document.getElementById('pulseLayer') || document.body;
  const t = document.createElement('div');
  t.className = `toast toast-${type}`;
  t.textContent = msg;
  t.style.cssText = `
    position: fixed;
    top: 80px; left: 50%;
    transform: translateX(-50%);
    background: var(--ink);
    color: #fff;
    font-family: var(--font-mono);
    font-size: 12px;
    letter-spacing: 0.05em;
    padding: 8px 16px;
    border-radius: var(--r-2);
    z-index: 9999;
    box-shadow: 0 8px 24px rgba(0,0,0,0.2);
    animation: toastIn 0.3s var(--ease-out) forwards;
  `;
  document.body.appendChild(t);
  setTimeout(() => {
    t.style.animation = 'toastOut 0.3s var(--ease-out) forwards';
    setTimeout(() => t.remove(), 300);
  }, 4000);
}
