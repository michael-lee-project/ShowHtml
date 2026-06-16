/* ========================================
   office.js — 渲染办公室场景
   - 6 个 Agent 工位（环形）
   - 中央任务监控大屏
   ======================================== */

const AGENT_AVATAR_DIR = 'assets/agents/transparent';

/* === Q版角色立绘：透明底 PNG，避免人物像贴在色块上 === */
function getCharacterMarkup(agent) {
  return `<img class="char-png" src="${AGENT_AVATAR_DIR}/agent-${agent.id}-transparent.png" alt="${agent.name}" draggable="false" />`;
}

const AGENT_PROPS = {
  sales: `
    <span class="ws-prop ws-prop-card">¥</span>
    <span class="ws-prop ws-prop-coin"></span>
  `,
  customer: `
    <span class="ws-prop ws-prop-headset"></span>
    <span class="ws-prop ws-prop-ticket">FAQ</span>
  `,
  meeting: `
    <span class="ws-prop ws-prop-mic"></span>
    <span class="ws-prop ws-prop-note"></span>
  `,
  design: `
    <span class="ws-prop ws-prop-palette"></span>
    <span class="ws-prop ws-prop-brush"></span>
  `,
  video: `
    <span class="ws-prop ws-prop-camera"></span>
    <span class="ws-prop ws-prop-timeline"></span>
  `,
  writing: `
    <span class="ws-prop ws-prop-doc"></span>
    <span class="ws-prop ws-prop-pen"></span>
  `,
};

const OFFICE_ROOMS = {
  sales:    { no: 'ROOM 01', title: '销售作战间', sub: 'LEADS · OFFER · CLOSE' },
  design:   { no: 'ROOM 02', title: '设计创意室', sub: 'POSTER · UI · BRAND' },
  video:    { no: 'ROOM 03', title: '视频制作室', sub: 'SCRIPT · CUT · CAPTION' },
  customer: { no: 'ROOM 04', title: '客服接待间', sub: 'FAQ · REFUND · REBUY' },
  meeting:  { no: 'ROOM 05', title: '会议纪要室', sub: 'TRANSCRIBE · TODO' },
  writing:  { no: 'ROOM 06', title: '内容写作室', sub: 'ARTICLE · SEO · COPY' },
};

function getAgentPropsMarkup(agentId) {
  return `<div class="ws-props" aria-hidden="true">${AGENT_PROPS[agentId] || ''}</div>`;
}

/* === 渲染侧边栏 Agent 列表 === */
function renderAgentList() {
  const list = document.getElementById('agentList');
  if (!list) return;
  list.innerHTML = AGENTS.map(agent => {
    const statusClass = `is-${agent.status}`;
    const statusText = { idle: '空闲', running: '运行中', busy: '忙碌' }[agent.status] || '在线';
    return `
      <li class="agent-item ${statusClass}" data-agent-id="${agent.id}" style="--agent-color:${agent.color}">
        <div class="agent-avatar" style="background:${agent.color}">${agent.icon}</div>
        <div class="agent-info">
          <div class="agent-name">${agent.name}</div>
          <div class="agent-role">${agent.role} · ${agent.en}</div>
        </div>
        <span class="agent-status ${statusClass}">${statusText}</span>
      </li>
    `;
  }).join('');

  // 绑定点击
  list.querySelectorAll('.agent-item').forEach(li => {
    li.addEventListener('click', () => {
      const id = li.dataset.agentId;
      openAgentPanel(id);
      highlightWorkstation(id);
      // 阶段 4.3：侧栏点击也联动大屏
      focusScreenOnAgent(id);
    });
  });
}

/* === 渲染办公室场景：6 个工位 + 中央大屏 === */
function renderOffice() {
  const stage = document.getElementById('isoStage');
  if (!stage) return;

  // 中央大屏：主控大屏 + 内嵌 LIVE FEED
  const screenHTML = `
    <div class="center-screen">
      <div class="center-screen-glow"></div>
      <div class="center-screen-body">
        <div class="cs-head">
          <span class="cs-title">● LIVE · <strong>AGENT OPS</strong></span>
          <span class="cs-time" id="csTime">--:--:--</span>
        </div>
        <div class="cs-dashboard">
          <div class="cs-left-panel">
            <div class="cs-stats">
              <div class="cs-stat">
                <span class="cs-stat-num" id="csToday">24</span>
                <span class="cs-stat-lbl">TODAY</span>
              </div>
              <div class="cs-stat">
                <span class="cs-stat-num text-amber" id="csRunning">3</span>
                <span class="cs-stat-lbl">RUNNING</span>
              </div>
              <div class="cs-stat">
                <span class="cs-stat-num text-red" id="csQueued">9</span>
                <span class="cs-stat-lbl">QUEUED</span>
              </div>
              <div class="cs-stat">
                <span class="cs-stat-num text-green" id="csDone">12</span>
                <span class="cs-stat-lbl">DONE</span>
              </div>
            </div>
            <div class="cs-agents" id="csAgentsList">
              ${AGENTS.map(a => {
                const statusColor = { running: '#ff3b30', busy: '#10b981', idle: '#8a8a8a' }[a.status];
                return `
                  <div class="cs-agent-row" data-cs-agent="${a.id}" style="--c:${statusColor}">
                    <span class="cs-agent-dot"></span>
                    <span class="cs-agent-name">${a.name.replace('AI ','')}</span>
                    <span class="cs-agent-stat" data-cs-stat="${a.id}">0</span>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
          <div class="task-stream" id="taskStream">
            <div class="task-stream-head">
              <span class="kicker-tag">LIVE FEED</span>
              <span class="task-stream-time mono" id="streamTime">--:--:--</span>
            </div>
            <div class="task-stream-list" id="taskStreamList">
              ${recentTasks.slice(0, 5).map(t => renderTaskItem(t)).join('')}
            </div>
          </div>
        </div>
      </div>
      <div class="center-screen-stand"></div>
      <div class="center-screen-base"></div>
    </div>
  `;

  // 热点 chip（浮动在大屏右上角外）
  const hotspotHTML = `
    <div class="hotspot-chip" id="hotspotChip">
      <span class="hotspot-pulse"></span>
      <span class="hotspot-label">HOT NOW</span>
      <span class="hotspot-agent" id="hotspotAgent">销售助手</span>
      <span class="hotspot-rate mono"><strong id="hotspotRate">12</strong> 任务/h</span>
    </div>
  `;

  // 6 个工位
  const stationsHTML = WORKSTATION_LAYOUT.map((agentId, idx) => {
    const agent = getAgent(agentId);
    const room = OFFICE_ROOMS[agentId] || { no: `ROOM 0${idx + 1}`, title: agent.role, sub: agent.en };
    return `
      <div class="workstation office-room ws-${idx} room-${agentId} ${agent.status === 'busy' ? 'is-busy' : ''} ${agent.status === 'running' ? 'is-busy' : ''}"
           data-agent-id="${agentId}"
           style="--agent-color:${agent.color}">
        <div class="room-bg-grid" aria-hidden="true"></div>
        <div class="room-glass-wall room-glass-wall-top" aria-hidden="true"></div>
        <div class="room-glass-wall room-glass-wall-left" aria-hidden="true"></div>
        <div class="room-plate">
          <span class="room-no mono">${room.no}</span>
          <strong>${room.title}</strong>
          <em>${room.sub}</em>
        </div>
        <div class="room-live-dot" aria-hidden="true"></div>
        <div class="room-work-area">
          <div class="ws-status-badge">${agent.status === 'busy' ? 'WORKING' : 'NEW'}</div>
          <div class="ws-floor"></div>
          <div class="ws-desk"></div>
          <div class="ws-monitor"></div>
          ${getAgentPropsMarkup(agentId)}
          <div class="ws-agent" data-agent-target="${agentId}">
            <div class="ws-agent-avatar">${getCharacterMarkup(agent)}</div>
          </div>
          <div class="ws-chair"></div>
          <div class="ws-agent-name">${agent.name.replace('AI ','')}</div>
        </div>
      </div>
    `;
  }).join('');

  const companyBannerHTML = `
    <div class="company-banner" aria-label="UmakeX 智能科技有限公司">
      <span class="company-banner-dot"></span>
      <div class="company-banner-copy">
        <strong>UmakeX 智能科技有限公司</strong>
        <em>AI MARKETING COMMAND CENTER</em>
      </div>
      <span class="company-banner-status mono">6 AGENTS ONLINE</span>
    </div>
  `;

  stage.innerHTML = companyBannerHTML + stationsHTML + screenHTML + hotspotHTML;

  // 绑定工位点击
  stage.querySelectorAll('.ws-agent').forEach(el => {
    el.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = el.dataset.agentTarget;
      openAgentPanel(id);
      highlightWorkstation(id);
      // 阶段 4.3：联动大屏聚焦到该 Agent
      focusScreenOnAgent(id);
    });
  });

  // 启动屏幕时间 + 实时数据 + 任务流
  startScreenClock();
  initLiveAgentStats();
  startLiveUpdates();
  rotateTaskStream();
}

function initLiveAgentStats() {
  // 把 liveAgents 里的初始 tasks 填进大屏
  AGENTS.forEach(a => {
    const el = document.querySelector(`[data-cs-stat="${a.id}"]`);
    if (el) el.textContent = liveAgents[a.id].tasks;
  });
}

function startScreenClock() {
  const el = document.getElementById('csTime');
  if (!el) return;
  function tick() {
    const d = new Date();
    el.textContent = d.toTimeString().slice(0, 8);
  }
  tick();
  setInterval(tick, 1000);
}

/* === 高亮工位 === */
function highlightWorkstation(agentId) {
  document.querySelectorAll('.workstation').forEach(ws => {
    ws.style.outline = '';
  });
  const ws = document.querySelector(`.workstation[data-agent-id="${agentId}"]`);
  if (ws) {
    ws.style.outline = `3px solid var(--agent-color)`;
    ws.style.outlineOffset = '4px';
    ws.style.borderRadius = '12px';
  }
}

/* ========================================
   阶段 4.1：中心大屏实时数据 + 任务流 + 热点
   ======================================== */

const liveStats = { today: 24, running: 3, queued: 9, done: 12 };
const liveAgents = {
  sales:    { tasks: 3, status: 'running' },
  customer: { tasks: 2, status: 'busy' },
  meeting:  { tasks: 1, status: 'idle' },
  design:   { tasks: 4, status: 'running' },
  video:    { tasks: 0, status: 'idle' },
  writing:  { tasks: 1, status: 'idle' },
};

const recentTasks = [
  { id: 't1', agent: 'sales',    text: '李雅楠 · 春季新品推荐',  status: 'done',    time: '12:04' },
  { id: 't2', agent: 'design',   text: '618 海报 v2 主视觉',     status: 'done',    time: '11:38' },
  { id: 't3', agent: 'meeting',  text: 'Q3 复盘纪要 · 行动项',  status: 'done',    time: '11:25' },
  { id: 't4', agent: 'customer', text: '退款补偿方案 · ¥20券',  status: 'running', time: '11:18' },
  { id: 't5', agent: 'video',    text: '产品介绍分镜 · 6 镜',   status: 'queued',  time: '11:12' },
  { id: 't6', agent: 'writing',  text: '公众号推文 · 开头3段',  status: 'done',    time: '11:05' },
  { id: 't7', agent: 'design',   text: 'Logo 延展 · 3 套',      status: 'queued',  time: '10:58' },
  { id: 't8', agent: 'sales',    text: '陈总 · 618 优惠推送',   status: 'done',    time: '10:42' },
];

function renderTaskItem(t) {
  const agent = getAgent(t.agent);
  const statusClass = `is-${t.status}`;
  const statusLabel = { done: '完成', running: '运行', queued: '队列' }[t.status] || t.status;
  return `
    <div class="task-item ${statusClass}" data-task-id="${t.id}">
      <span class="task-item-dot" style="background:${agent.color}"></span>
      <span class="task-item-agent mono">${agent.icon}</span>
      <span class="task-item-text">${t.text}</span>
      <span class="task-item-status">${statusLabel}</span>
      <span class="task-item-time mono">${t.time}</span>
    </div>
  `;
}

function startLiveUpdates() {
  // 数字更新：每 4s 微调，触发翻牌动效
  setInterval(() => {
    const r = Math.random();
    if (r < 0.45 && liveStats.queued > 0) {
      // 新任务进 running
      liveStats.queued--;
      liveStats.running++;
      liveAgents[Object.keys(liveAgents)[Math.floor(Math.random() * 6)]].tasks++;
    } else if (r < 0.9 && liveStats.running > 0) {
      // running 完成
      liveStats.running--;
      liveStats.done++;
      liveStats.today++;
    } else if (liveStats.queued < 12) {
      // 新任务进队列
      liveStats.queued++;
    }
    bumpStat('csToday', liveStats.today);
    bumpStat('csRunning', liveStats.running);
    bumpStat('csQueued', liveStats.queued);
    bumpStat('csDone', liveStats.done);

    // Agent 任务数随机微调
    AGENTS.forEach(a => {
      const el = document.querySelector(`[data-cs-stat="${a.id}"]`);
      if (el && Math.random() < 0.3) {
        liveAgents[a.id].tasks = Math.max(0, liveAgents[a.id].tasks + (Math.random() < 0.6 ? 1 : -1));
        el.textContent = liveAgents[a.id].tasks;
        el.classList.add('is-bump');
        setTimeout(() => el.classList.remove('is-bump'), 400);
      }
    });
  }, 4000);
}

function bumpStat(id, val) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = val;
  el.classList.add('is-bump');
  setTimeout(() => el.classList.remove('is-bump'), 500);
}

function rotateTaskStream() {
  // 任务流旋转：每 5s 把顶部任务移到底部（视觉上往下流），新任务从顶部插入
  setInterval(() => {
    const list = document.getElementById('taskStreamList');
    if (!list || list.children.length === 0) return;

    // 顶部第一项下滑动效后移到末尾
    const first = list.firstElementChild;
    first.classList.add('is-leaving');
    setTimeout(() => {
      first.classList.remove('is-leaving');
      // 移到末尾
      list.appendChild(first);
    }, 400);
  }, 2800);
}

function setStreamTime() {
  const el = document.getElementById('streamTime');
  if (el) {
    const d = new Date();
    el.textContent = d.toTimeString().slice(0, 8);
  }
}
setInterval(setStreamTime, 1000);
setStreamTime();

/* ========================================
   阶段 4.3：工位 ↔ 大屏联动
   - focusScreenOnAgent(id)：大屏聚焦该 Agent，其他变灰
   - unfocusScreen()：恢复全部
   ======================================== */
function focusScreenOnAgent(agentId) {
  const list = document.getElementById('csAgentsList');
  if (!list) return;
  list.classList.add('is-focus');
  list.querySelectorAll('.cs-agent-row').forEach(row => {
    const isFocus = row.dataset.csAgent === agentId;
    row.classList.toggle('is-focus', isFocus);
    row.classList.toggle('is-dimmed', !isFocus);
  });
  // 状态栏也加 hint
  const stat = document.querySelector('.stage-status');
  if (stat && !stat.dataset.focusAgent) {
    stat.dataset.defaultStat = stat.innerHTML;
  }
  if (stat) {
    const agent = getAgent(agentId);
    stat.dataset.focusAgent = agentId;
    stat.innerHTML = `<i class="dot dot-red"></i><strong style="color:var(--accent-red)">FOCUS · ${agent.name}</strong> &nbsp;|&nbsp; <span style="color:var(--ink-3)">点击空白处或切换 Tab 恢复</span>`;
  }
  // 工位高亮联动到 iso-stage
  const iso = document.getElementById('isoStage');
  if (iso) iso.classList.add('is-focus-mode');
  document.querySelectorAll('.workstation').forEach(ws => {
    ws.classList.toggle('is-focus-target', ws.dataset.agentId === agentId);
    ws.classList.toggle('is-focus-dim', ws.dataset.agentId !== agentId);
  });
}

function unfocusScreen() {
  const list = document.getElementById('csAgentsList');
  if (list) {
    list.classList.remove('is-focus');
    list.querySelectorAll('.cs-agent-row').forEach(row => {
      row.classList.remove('is-focus', 'is-dimmed');
    });
  }
  const stat = document.querySelector('.stage-status');
  if (stat && stat.dataset.defaultStat) {
    stat.innerHTML = stat.dataset.defaultStat;
    delete stat.dataset.defaultStat;
    delete stat.dataset.focusAgent;
  }
  const iso = document.getElementById('isoStage');
  if (iso) iso.classList.remove('is-focus-mode');
  document.querySelectorAll('.workstation').forEach(ws => {
    ws.classList.remove('is-focus-target', 'is-focus-dim');
  });
}
