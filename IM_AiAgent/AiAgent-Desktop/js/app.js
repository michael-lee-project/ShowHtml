/* ========================================
   app.js — 桌面端原型主入口
   ======================================== */

let messageState = null;
let activeMessageId = null;
let activeBoardFilter = 'all';

function getMessageState() {
  if (!messageState) messageState = getMockCustomerMessages();
  return messageState;
}

function getCurrentTimeLabel() {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

function refreshMessageShell() {
  const messages = getMessageState();
  const unreadTotal = messages.reduce((sum, m) => sum + (Number(m.unread) || 0), 0);
  const pendingTotal = messages.filter(m => m.unread || m.handleStatus === 'pending' || m.handleStatus === 'human_handoff').length;

  document.querySelector('.side-tab[data-side-tab="messages"] .side-tab-badge')?.replaceChildren(document.createTextNode(String(unreadTotal)));

  const toolbarStats = document.querySelectorAll('.stage-messages .stage-toolbar .msg-stat strong');
  if (toolbarStats[0]) toolbarStats[0].textContent = pendingTotal;
  if (toolbarStats[1]) toolbarStats[1].textContent = messages.length;
}

function refreshMessageSurfaces() {
  renderMessageList();
  bindSideMsgItemClick();
  renderMessageBoard(activeBoardFilter);
  refreshMessageShell();
  if (activeMessageId) {
    document.querySelectorAll('.msg-item').forEach(li => li.classList.toggle('is-active', li.dataset.msgId === activeMessageId));
    document.querySelectorAll('.msg-board-card').forEach(card => card.classList.toggle('is-active', card.dataset.msgId === activeMessageId));
  }
}

function initApp() {
  // 渲染左侧栏 Agent 列表
  renderAgentList();

  // 渲染办公室场景
  renderOffice();

  // 渲染消息列表
  refreshMessageSurfaces();

  // 初始化 Agent 中心
  if (typeof initAgentCenter === 'function') initAgentCenter();

  // 绑定侧栏 tab 切换
  bindSideTabs();

  // 绑定对话面板
  bindChatPanel();

  // 启动顶部时钟
  startTopClock();
}

function renderMessageList() {
  // 侧边栏消息列表（含 unread 红点 + 点击高亮）
  const messages = getMessageState();
  const list = document.getElementById('msgList');
  if (!list) return;
  list.innerHTML = messages.map(m => `
    <li class="msg-item ${m.unread ? 'is-unread' : ''} ${m.priority === 'p0' ? 'is-p0' : ''}" data-msg-id="${m.id}">
      <div class="msg-avatar" style="${m.priority === 'p0' ? '--c:var(--accent-red)' : ''}">
        ${m.avatar}
        ${m.byAgent ? '<span class="msg-ai-tag">AI</span>' : ''}
        ${m.unread ? `<span class="msg-unread-dot">${m.unread}</span>` : ''}
      </div>
      <div class="msg-content">
        <div class="msg-name-row">
          <span class="msg-name">${m.name}</span>
          <span class="msg-time mono">${m.time}</span>
        </div>
        <div class="msg-preview">${m.preview}</div>
        <div class="msg-meta">
          <span class="msg-tag ${m.priority === 'p0' ? 'is-p0' : ''}">${m.tag}</span>
          <span class="msg-by">${m.byAgent}</span>
        </div>
      </div>
    </li>
  `).join('');
}

function renderMessageBoard(filter = activeBoardFilter) {
  // 主区域消息看板（杂志编辑风 + 可点击进详情）
  activeBoardFilter = filter || 'all';
  const messages = getMessageState();
  const board = document.getElementById('msgBoard');
  if (!board) return;
  board.innerHTML = `
    ${renderAgentWorkbar(messages)}
    <div class="msg-board-filters" id="msgBoardFilters">
      <button class="msg-filter ${activeBoardFilter === 'all' ? 'is-active' : ''}" data-filter="all">
        <span class="msg-filter-num">${messages.length}</span>
        <span class="msg-filter-lbl">全部</span>
      </button>
      <button class="msg-filter is-p0 ${activeBoardFilter === 'p0' ? 'is-active' : ''}" data-filter="p0">
        <span class="msg-filter-num">${messages.filter(m => m.priority === 'p0').length}</span>
        <span class="msg-filter-lbl">P0 优先</span>
      </button>
      <button class="msg-filter is-unread ${activeBoardFilter === 'unread' ? 'is-active' : ''}" data-filter="unread">
        <span class="msg-filter-num">${messages.filter(m => m.unread).length}</span>
        <span class="msg-filter-lbl">未读</span>
      </button>
      <button class="msg-filter ${activeBoardFilter === 'today' ? 'is-active' : ''}" data-filter="today">
        <span class="msg-filter-num">${messages.length}</span>
        <span class="msg-filter-lbl">今日</span>
      </button>
    </div>
    <div class="msg-board-grid" id="msgBoardGrid">
      ${getFilteredMessages(activeBoardFilter).map(m => renderBoardCard(m)).join('') || '<div class="agent-flowcard-empty mono">暂无匹配消息</div>'}
    </div>
  `;
  bindBoardCardClick();
  bindFilterClick();
  bindAgentWorkbarClick();
}

function getFilteredMessages(filter = activeBoardFilter) {
  const messages = getMessageState();
  if (filter === 'p0') return messages.filter(m => m.priority === 'p0');
  if (filter === 'unread') return messages.filter(m => m.unread);
  if (filter === 'today') return messages;
  return messages;
}

/* === A 方案：6 Agent 工作流条 === */
function renderAgentWorkbar(messages) {
  // 仅取前 4 个真实参与客服的 Agent（sales / customer / meeting / design）
  // 但展示全 6 个，让"未参与"也能看到状态
  const items = AGENTS.map(a => {
    const handling = messages.filter(m => m.byAgentId === a.id && m.handleStatus === 'ai_handling').length;
    const pending  = messages.filter(m => m.byAgentId === a.id && m.handleStatus === 'pending').length;
    const total    = messages.filter(m => m.byAgentId === a.id).length;
    const todayDone = (a.id === 'sales') ? 18 : (a.id === 'customer') ? 24 : (a.id === 'meeting') ? 6 : (a.id === 'design') ? 9 : (a.id === 'video') ? 3 : 7;
    const isLive = handling > 0;
    return { a, handling, pending, total, todayDone, isLive };
  });
  return `
    <div class="agent-workbar" id="agentWorkbar">
      <div class="agent-workbar-head">
        <span class="kicker-tag">AGENT FLOW · LIVE</span>
        <span class="agent-workbar-hint mono">点击 Agent 筛选其负责的客户</span>
      </div>
      <div class="agent-workbar-grid">
        ${items.map(({ a, handling, pending, total, todayDone, isLive }) => `
          <button class="agent-flowcard ${isLive ? 'is-live' : ''}" data-agent-id="${a.id}" style="--c:${a.color};--c-soft:${a.colorSoft}">
            <div class="agent-flowcard-stripe"></div>
            <div class="agent-flowcard-head">
              <div class="agent-flowcard-avatar">
                ${a.icon}
                ${isLive ? '<span class="agent-flowcard-pulse"></span>' : ''}
              </div>
              <div class="agent-flowcard-meta">
                <div class="agent-flowcard-name">${a.name.replace('AI ','')}</div>
                <div class="agent-flowcard-en mono">${a.en}</div>
              </div>
              ${isLive ? `<span class="agent-flowcard-live mono">● LIVE</span>` : `<span class="agent-flowcard-idle mono">IDLE</span>`}
            </div>
            <div class="agent-flowcard-flow">
              <span class="agent-flowcard-flow-dot"></span>
              <span class="agent-flowcard-flow-dot"></span>
              <span class="agent-flowcard-flow-dot"></span>
            </div>
            <div class="agent-flowcard-stats mono">
              <span class="agent-flowcard-stat">
                <strong>${handling}</strong><em>处理中</em>
              </span>
              <span class="agent-flowcard-stat">
                <strong>${pending}</strong><em>排队</em>
              </span>
              <span class="agent-flowcard-stat">
                <strong>${todayDone}</strong><em>今日完成</em>
              </span>
            </div>
          </button>
        `).join('')}
      </div>
    </div>
  `;
}

function bindAgentWorkbarClick() {
  document.querySelectorAll('.agent-flowcard').forEach(card => {
    card.addEventListener('click', () => {
      const id = card.dataset.agentId;
      const isAlready = card.classList.contains('is-selected');
      // 切换选中
      document.querySelectorAll('.agent-flowcard').forEach(c => c.classList.remove('is-selected'));
      // 重置 filter 高亮到"全部"
      document.querySelectorAll('.msg-filter').forEach(b => b.classList.remove('is-active'));
      const grid = document.getElementById('msgBoardGrid');
      if (!grid) return;
      const messages = getMessageState();
      if (isAlready) {
        // 再次点击 = 取消筛选
        document.querySelector('.msg-filter[data-filter="all"]')?.classList.add('is-active');
        grid.innerHTML = messages.map(m => renderBoardCard(m)).join('');
      } else {
        card.classList.add('is-selected');
        const filtered = messages.filter(m => m.byAgentId === id);
        grid.innerHTML = filtered.length
          ? filtered.map(m => renderBoardCard(m)).join('')
          : `<div class="agent-flowcard-empty mono">该 Agent 当前无客户消息</div>`;
      }
      bindBoardCardClick();
    });
  });
}

function renderBoardCard(m) {
  const statusLabel = { ai_handling: 'AI 接管中', pending: '待分配', human_handoff: '已转人工', resolved: '已解决' }[m.handleStatus] || m.byAgent + ' 接管中';
  const statusClass = `is-${m.handleStatus || 'ai_handling'}`;
  const agent = (typeof getAgent === 'function' && m.byAgentId) ? getAgent(m.byAgentId) : null;
  const agentColor = (agent && agent.color) || 'var(--ink-2)';
  const isHandling = m.handleStatus === 'ai_handling';
  return `
    <div class="msg-board-card ${m.priority === 'p0' ? 'is-p0' : ''} ${m.unread ? 'is-unread' : ''} ${statusClass}" data-msg-id="${m.id}" style="--agent-c:${agentColor}">
      <div class="msg-card-kicker">
        <span class="msg-card-priority">${m.priority === 'p0' ? 'P0' : m.role}</span>
        <span class="msg-card-time mono">${m.time}</span>
        ${m.unread ? `<span class="msg-card-unread">${m.unread} 未读</span>` : ''}
      </div>
      <div class="msg-card-head">
        <div class="msg-card-avatar">${m.avatar}</div>
        <div>
          <div class="msg-card-name">${m.name}</div>
          <div class="msg-card-role mono">${m.role} · ${m.region} · ${m.gender}</div>
        </div>
      </div>
      <div class="msg-card-msg">「${m.lastMsg}」</div>
      <div class="msg-card-foot">
        <span class="msg-card-agent ${statusClass}">
          <span class="msg-card-agent-dot"></span>${statusLabel}${isHandling ? '<span class="msg-card-typing"><i></i><i></i><i></i></span>' : ''}
        </span>
        <span class="msg-card-tag">${m.tag}</span>
      </div>
      <div class="msg-card-arrow">→</div>
    </div>
  `;
}

/* === 详情视图（点击客户后切换） === */
function renderMessageDetail(id) {
  const m = getMockCustomerMessage(id);
  if (!m) return;
  const detail = document.getElementById('msgDetail');
  if (!detail) return;
  detail.innerHTML = `
    <div class="msg-detail-head">
      <button class="msg-detail-back" id="msgDetailBack">← 返回列表</button>
      <div class="msg-detail-actions">
        <button class="msg-detail-btn is-primary" data-action="takeover">
          <span class="msg-detail-btn-icon">⚡</span>立即接管
        </button>
        <button class="msg-detail-btn" data-action="human">
          <span class="msg-detail-btn-icon">👤</span>转人工
        </button>
        <button class="msg-detail-btn" data-action="read">
          <span class="msg-detail-btn-icon">✓</span>标记已读
        </button>
      </div>
    </div>
    <div class="msg-detail-body">
      <!-- 客户档案 -->
      <aside class="msg-detail-profile">
        <div class="msg-profile-avatar" style="${m.priority === 'p0' ? '--c:var(--accent-red)' : ''}">${m.avatar}</div>
        <div class="msg-profile-name">${m.name}</div>
        <div class="msg-profile-tags">
          <span class="msg-profile-tag ${m.priority === 'p0' ? 'is-p0' : ''}">${m.priority === 'p0' ? 'P0 优先' : m.role}</span>
          <span class="msg-profile-tag">${m.tag}</span>
        </div>
        <div class="msg-profile-stats">
          <div class="msg-profile-stat">
            <span class="msg-profile-stat-num">¥${m.spent.toLocaleString()}</span>
            <span class="msg-profile-stat-lbl">累计消费</span>
          </div>
          <div class="msg-profile-stat">
            <span class="msg-profile-stat-num">${m.orders}</span>
            <span class="msg-profile-stat-lbl">历史订单</span>
          </div>
        </div>
        <dl class="msg-profile-meta">
          <div><dt>地区</dt><dd>${m.region}</dd></div>
          <div><dt>性别</dt><dd>${m.gender}</dd></div>
          <div><dt>来源</dt><dd>${m.source}</dd></div>
          <div><dt>注册</dt><dd>${m.joined}</dd></div>
        </dl>
        <div class="msg-profile-current">
          <div class="msg-profile-current-label">当前 AI 接管</div>
          <div class="msg-profile-current-agent" data-agent="${m.byAgentId}">
            <span class="msg-profile-current-dot"></span>${m.byAgent}
          </div>
        </div>
      </aside>

      <!-- 消息流 -->
      <main class="msg-detail-thread">
        <div class="msg-detail-thread-head">
          <span class="kicker-tag">CONVERSATION</span>
          <span class="msg-detail-thread-stat mono">${m.messages.length} 条消息 · 最后 ${m.messages[m.messages.length-1].time}</span>
        </div>
        <div class="msg-detail-stream">
          ${m.messages.map(msg => renderDetailMessage(msg, m)).join('')}
        </div>
        <div class="msg-detail-reply">
          <div class="msg-detail-reply-bar">
            <input type="text" class="msg-detail-reply-input" placeholder="回复 ${m.name}…" />
            <button class="msg-detail-reply-send">发送</button>
          </div>
          <div class="msg-detail-quick mono">
            建议接管：${AGENTS.slice(0,3).map(a => `<span class="msg-quick-agent" style="--c:${a.color}">${a.icon} ${a.name.replace('AI ','')}</span>`).join(' / ')}
          </div>
        </div>
      </main>
    </div>
  `;

  // 切换视图
  const board = document.getElementById('msgBoard');
  if (board) board.style.display = 'none';
  detail.style.display = 'flex';

  // 绑定详情交互
  document.getElementById('msgDetailBack')?.addEventListener('click', closeMessageDetail);
  detail.querySelectorAll('.msg-detail-btn').forEach(btn => {
    btn.addEventListener('click', () => handleDetailAction(m, btn.dataset.action));
  });
  detail.querySelectorAll('.msg-quick-agent').forEach(qa => {
    qa.addEventListener('click', () => {
      showToast('已切到 ' + qa.textContent.trim() + ' 接管', 'info');
    });
  });
  detail.querySelector('.msg-detail-reply-send')?.addEventListener('click', () => handleDetailReply(m.id));
  detail.querySelector('.msg-detail-reply-input')?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleDetailReply(m.id);
    }
  });

  requestAnimationFrame(() => {
    const stream = detail.querySelector('.msg-detail-stream');
    if (stream) stream.scrollTop = stream.scrollHeight;
  });
}

function renderDetailMessage(msg, customer) {
  if (msg.from === 'user') {
    return `
      <div class="msg-stream-row is-user">
        <div class="msg-stream-bubble">${escapeHtml(msg.text)}</div>
        <div class="msg-stream-time mono">${msg.time}</div>
      </div>
    `;
  }
  if (msg.from === 'ai') {
    const agent = getAgent(msg.agentId) || {};
    return `
      <div class="msg-stream-row is-ai">
        <div class="msg-stream-agent">
          <span class="msg-stream-agent-dot" style="background:${agent.color || '#999'}">${agent.icon || '·'}</span>
          <span class="msg-stream-agent-name mono">${msg.agentName || customer.byAgent}</span>
        </div>
        <div class="msg-stream-bubble is-ai">${escapeHtml(msg.text)}</div>
        <div class="msg-stream-time mono">${msg.time}</div>
      </div>
    `;
  }
  if (msg.from === 'human') {
    return `
      <div class="msg-stream-row is-human">
        <div class="msg-stream-agent">
          <span class="msg-stream-agent-dot" style="background:var(--ink)">人</span>
          <span class="msg-stream-agent-name mono">${msg.agentName || '人工客服'}</span>
        </div>
        <div class="msg-stream-bubble is-human">${escapeHtml(msg.text)}</div>
        <div class="msg-stream-time mono">${msg.time}</div>
      </div>
    `;
  }
  return '';
}

function handleDetailReply(id) {
  const customer = getMockCustomerMessage(id);
  const detail = document.getElementById('msgDetail');
  const input = detail?.querySelector('.msg-detail-reply-input');
  const text = input?.value.trim();
  if (!customer || !text) return;

  const time = getCurrentTimeLabel();
  customer.messages.push({ from: 'human', text, time, agentName: '人工客服' });
  customer.lastMsg = text;
  customer.preview = text.length > 18 ? text.slice(0, 18) + '…' : text;
  customer.time = time;
  customer.unread = 0;
  customer.handleStatus = 'human_handoff';
  customer.byAgent = '人工客服';
  customer.byAgentId = 'human';

  input.value = '';
  refreshMessageSurfaces();
  renderMessageDetail(id);
  showToast('已发送给 ' + customer.name, 'success');
}
function closeMessageDetail() {
  const detail = document.getElementById('msgDetail');
  const board = document.getElementById('msgBoard');
  if (detail) detail.style.display = 'none';
  if (board) board.style.display = '';
  activeMessageId = null;
  // 清除左栏选中
  document.querySelectorAll('.msg-item').forEach(li => li.classList.remove('is-active'));
  document.querySelectorAll('.msg-board-card').forEach(card => card.classList.remove('is-active'));
}

function handleDetailAction(customer, action) {
  if (!customer) return;
  const current = getMockCustomerMessage(customer.id);
  if (!current) return;

  if (action === 'takeover') {
    current.handleStatus = 'ai_handling';
    if (!current.byAgent || current.byAgent === '人工客服') {
      current.byAgent = 'AI 销售助手';
      current.byAgentId = 'sales';
    }
    current.unread = 0;
    refreshMessageSurfaces();
    renderMessageDetail(current.id);
    showToast('已接管 ' + current.name + ' 的对话', 'success');
    return;
  }

  if (action === 'human') {
    current.handleStatus = 'human_handoff';
    current.byAgent = '人工客服';
    current.byAgentId = 'human';
    current.unread = 0;
    refreshMessageSurfaces();
    renderMessageDetail(current.id);
    showToast('已转人工 · ' + current.name, 'info');
    return;
  }

  if (action === 'read') {
    current.unread = 0;
    refreshMessageSurfaces();
    renderMessageDetail(current.id);
    showToast(current.name + ' 的消息已标记已读', 'success');
  }
}

/* === 交互绑定 === */
function openMessageDetailById(id) {
  if (!id) return;
  activeMessageId = id;
  const current = getMockCustomerMessage(id);
  if (current) current.unread = 0;

  // 确保切到消息主区域
  document.querySelectorAll('.side-tab').forEach(tab => {
    tab.classList.toggle('is-active', tab.dataset.sideTab === 'messages');
  });
  document.querySelectorAll('.side-panel').forEach(panel => {
    panel.classList.toggle('is-hidden', panel.dataset.sidePanel !== 'messages');
  });
  document.querySelectorAll('.stage-view').forEach(view => {
    view.classList.toggle('is-active', view.dataset.stage === 'messages');
  });
  if (typeof unfocusScreen === 'function') unfocusScreen();

  // 同步左栏 / 主看板高亮，并清掉当前未读红点
  document.querySelectorAll('.msg-item').forEach(li => {
    const active = li.dataset.msgId === id;
    li.classList.toggle('is-active', active);
    if (active) {
      li.classList.remove('is-unread');
      li.querySelector('.msg-unread-dot')?.remove();
    }
  });
  document.querySelectorAll('.msg-board-card').forEach(card => {
    card.classList.toggle('is-active', card.dataset.msgId === id);
  });

  renderMessageDetail(id);
  refreshMessageSurfaces();
}

function bindSideMsgItemClick() {
  document.querySelectorAll('.msg-item').forEach(item => {
    item.addEventListener('click', () => openMessageDetailById(item.dataset.msgId));
  });
}

function bindBoardCardClick() {
  document.querySelectorAll('.msg-board-card').forEach(card => {
    card.addEventListener('click', () => openMessageDetailById(card.dataset.msgId));
  });
}

function bindFilterClick() {
  document.querySelectorAll('.msg-filter').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.agent-flowcard').forEach(c => c.classList.remove('is-selected'));
      renderMessageBoard(btn.dataset.filter || 'all');
    });
  });
}

/* === Mock 数据（含档案 + 消息流） === */
function getMockCustomerMessage(id) {
  return getMessageState().find(m => m.id === id);
}

function getMockCustomerMessages() {
  return [
    {
      id: 'm1', avatar: '李', name: '李雅楠', role: '新客', gender: '女', region: '上海', source: '抖音 · 5/12',
      time: '12:04', preview: '我先考虑一下，晚点再说…', lastMsg: '我先考虑一下，晚点再说吧，谢谢',
      byAgent: 'AI 销售助手', byAgentId: 'sales', priority: 'p0', tag: '价格敏感',
      spent: 298, orders: 0, joined: '2026-05-10', handleStatus: 'ai_handling', unread: 2,
      messages: [
        { from: 'user', text: '你好，你们那个樱花限定礼盒打完折多少？', time: '11:58' },
        { from: 'ai',   text: '亲，李小姐您好～礼盒原价 ¥398，今天 618 优惠立减 ¥100，到手 ¥298 还送一片面膜，您看合适吗？', time: '11:58', agentId: 'sales', agentName: 'AI 销售助手' },
        { from: 'user', text: '298 啊…我先考虑一下，晚点再说吧，谢谢', time: '12:04' },
        { from: 'ai',   text: '好的李小姐，给您留一份 24 小时，24 点前回复我就能锁定库存。您是敏感肌吗？我可以备注送一片试用装。', time: '12:04', agentId: 'sales', agentName: 'AI 销售助手' },
      ],
    },
    {
      id: 'm2', avatar: '王', name: '王晓宇', role: '老客', gender: '男', region: '北京', source: '微信',
      time: '11:58', preview: '我的订单什么时候能到？', lastMsg: '我的订单 #2024060801 怎么还没到？已经3天了',
      byAgent: 'AI 客服助手', byAgentId: 'customer', priority: null, tag: '物流查询',
      spent: 5890, orders: 7, joined: '2025-08-20', handleStatus: 'ai_handling', unread: 1,
      messages: [
        { from: 'user', text: '我那个 #2024060801 订单怎么还没到？都 3 天了', time: '11:55' },
        { from: 'ai',   text: '王先生您好，给您查到订单了，目前在杭州中转仓，预计明日 14:00 前送达，麻烦稍等。', time: '11:55', agentId: 'customer', agentName: 'AI 客服助手' },
        { from: 'user', text: '我着急用啊，能不能催一下？', time: '11:58' },
        { from: 'ai',   text: '我已联系站点加急，同时给您申请一张 ¥20 优惠券补偿，您看可以吗？', time: '11:58', agentId: 'customer', agentName: 'AI 客服助手' },
      ],
    },
    {
      id: 'm3', avatar: '陈', name: '陈志远', role: 'VIP', gender: '男', region: '深圳', source: '客户介绍',
      time: '11:45', preview: '618 活动什么时候开始', lastMsg: '618 你们有什么大额优惠？老客户有专属价吗？',
      byAgent: 'AI 销售助手', byAgentId: 'sales', priority: 'p0', tag: '高意向',
      spent: 38420, orders: 18, joined: '2024-03-15', handleStatus: 'pending', unread: 3,
      messages: [
        { from: 'user', text: '陈总，618 你们有什么大额优惠？老客户有专属价吗？', time: '11:42' },
        { from: 'ai',   text: '陈总好！给您预留了 VIP 专属券：满 5000 减 600 + 满 10000 减 1500，仅今日生效。要不要现在锁定 12 件套装？', time: '11:42', agentId: 'sales', agentName: 'AI 销售助手' },
        { from: 'user', text: '我让助理看一下，你等下', time: '11:45' },
      ],
    },
    {
      id: 'm4', avatar: '张', name: '张小溪', role: '新客', gender: '女', region: '成都', source: '小红书',
      time: '11:30', preview: '这个产品适合敏感肌吗？', lastMsg: '我是敏感肌，想问下这个精华会不会刺激？',
      byAgent: 'AI 客服助手', byAgentId: 'customer', priority: null, tag: '售前咨询',
      spent: 0, orders: 0, joined: '2026-06-10', handleStatus: 'ai_handling', unread: 0,
      messages: [
        { from: 'user', text: '我是敏感肌，想问下这个精华会不会刺激？', time: '11:30' },
        { from: 'ai',   text: '小溪您好～这款精华是敏感肌专研配方，无酒精/香精/酸类，已经通过 SGS 斑贴测试，可以放心用哦～', time: '11:30', agentId: 'customer', agentName: 'AI 客服助手' },
      ],
    },
    {
      id: 'm5', avatar: '林', name: '林梦琪', role: '老客', gender: '女', region: '杭州', source: '复购',
      time: '11:18', preview: '我之前买的那款还有吗', lastMsg: '上次买的樱花面膜还有货吗？想回购',
      byAgent: 'AI 销售助手', byAgentId: 'sales', priority: null, tag: '复购',
      spent: 12800, orders: 12, joined: '2024-11-08', handleStatus: 'ai_handling', unread: 0,
      messages: [
        { from: 'user', text: '上次买的樱花面膜还有货吗？想回购 5 盒', time: '11:15' },
        { from: 'ai',   text: '梦琪您好～还有货的，给您 9 折老客价，5 盒共 ¥445，顺丰包邮，今天发明天到～', time: '11:16', agentId: 'sales', agentName: 'AI 销售助手' },
        { from: 'user', text: '好的下单', time: '11:18' },
        { from: 'ai',   text: '已为您下单，订单号 #2024060902，支付链接已发您～', time: '11:18', agentId: 'sales', agentName: 'AI 销售助手' },
      ],
    },
    {
      id: 'm6', avatar: '赵', name: '赵雨晴', role: '潜客', gender: '女', region: '广州', source: '朋友圈',
      time: '10:52', preview: '看看朋友圈发的那个', lastMsg: '你们朋友圈发的那款新品叫什么名字？',
      byAgent: 'AI 客服助手', byAgentId: 'customer', priority: null, tag: '售前咨询',
      spent: 0, orders: 0, joined: '2026-06-13', handleStatus: 'human_handoff', unread: 1,
      messages: [
        { from: 'user', text: '你们朋友圈发的那款新品叫什么名字？', time: '10:50' },
        { from: 'ai',   text: '雨晴您好，是「夜樱焕颜精华」～点击这里看详情：[商品链接]', time: '10:50', agentId: 'customer', agentName: 'AI 客服助手' },
        { from: 'user', text: '好贵的，能便宜点吗？', time: '10:52' },
        { from: 'human', text: '雨晴您好，我是客户经理小李，新人首次下单可以申请 8 折优惠码，您看？', time: '10:55' },
      ],
    },
  ];
}

/* === 侧栏 tab 切换 === */
function bindSideTabs() {
  document.querySelectorAll('.side-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.sideTab;
      document.querySelectorAll('.side-tab').forEach(t => t.classList.toggle('is-active', t === tab));
      document.querySelectorAll('.side-panel').forEach(p => {
        p.classList.toggle('is-hidden', p.dataset.sidePanel !== target);
      });
      // 同步主区域显示
      document.querySelectorAll('.stage-view').forEach(v => {
        v.classList.toggle('is-active', v.dataset.stage === target);
      });
      document.querySelectorAll('.side-foot-btn').forEach(btn => btn.classList.remove('is-active'));
      // 阶段 4.3：切换 tab 离开办公室时恢复大屏
      if (target !== 'office' && typeof unfocusScreen === 'function') unfocusScreen();
    });
  });
}

/* === 绑定对话面板事件 === */
function bindChatPanel() {
  document.getElementById('chatPanelClose').addEventListener('click', closeChatPanel);
  document.getElementById('chatSend').addEventListener('click', sendMessage);
  document.getElementById('chatInput').addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
    if (e.key === 'Escape') {
      closeChatPanel();
    }
  });
  // 附件按钮（阶段3 占位 toast）
  document.querySelector('.chat-input-attach')?.addEventListener('click', handleAttach);

  // 点击右侧主区域非对话区，关闭面板
  document.getElementById('appStage')?.addEventListener('click', (e) => {
    if (isTyping) return;
    if (document.getElementById('chatPanel').classList.contains('is-open')) {
      // 点击的是 office 场景或工具栏才关
      if (e.target.closest('.workstation') || e.target.closest('.agent-item')) return;
      closeChatPanel();
    }
  });

  // 切换 tab 时关闭对话面板
  document.querySelectorAll('.side-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      if (isTyping) return;
      closeChatPanel();
    });
  });

  // 底部 我的 / Agent中心 按钮
  document.querySelectorAll('.side-foot-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (isTyping) return;
      const foot = btn.dataset.sideFoot;
      if (foot === 'agent-center') {
        if (typeof openAgentCenter === 'function') openAgentCenter();
        return;
      }
      if (foot === 'me') {
        showToast('✅ 我的模块待接入（演示）', 'success');
      }
    });
  });

  // 顶部工具条
  document.getElementById('btnRoomView')?.addEventListener('click', () => {
    document.querySelectorAll('.stage-tool').forEach(b => b.classList.remove('is-active'));
    document.getElementById('btnRoomView').classList.add('is-active');
    document.getElementById('officeScene').classList.add('view-top');
  });
  document.getElementById('btnIsoView')?.addEventListener('click', () => {
    document.querySelectorAll('.stage-tool').forEach(b => b.classList.remove('is-active'));
    document.getElementById('btnIsoView').classList.add('is-active');
    document.getElementById('officeScene').classList.remove('view-top');
  });
  document.getElementById('btnFocusAll')?.addEventListener('click', () => {
    document.querySelectorAll('.workstation').forEach(ws => ws.style.outline = '');
  });
}

/* === 顶部时钟 === */
function startTopClock() {
  function tick() {
    const d = new Date();
    const hh = String(d.getHours()).padStart(2, '0');
    const mm = String(d.getMinutes()).padStart(2, '0');
    const el = document.getElementById('liveClock');
    if (el) el.textContent = `${hh}:${mm}`;
  }
  tick();
  setInterval(tick, 30000);
}

/* === 启动 === */
document.addEventListener('DOMContentLoaded', initApp);
