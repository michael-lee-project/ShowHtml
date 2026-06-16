/* ========================================
   pulse.js — C 数据流方案
   工位 → 大屏 贝塞尔曲线 + 3 个数据包 + 抵达爆裂
   多 Agent 同时完成自动叠加
   ======================================== */

/* === 触发：工位 → 大屏 数据流 === */
function fireWorkstationPulse(agentId) {
  const ws = document.querySelector(`.workstation[data-agent-id="${agentId}"]`);
  if (!ws) return;
  const screen = document.querySelector('.center-screen-body');
  if (!screen) return;

  const wsRect = ws.getBoundingClientRect();
  const scRect = screen.getBoundingClientRect();
  const sx = wsRect.left + wsRect.width / 2;
  const sy = wsRect.top + wsRect.height * 0.35;
  const ex = scRect.left + scRect.width / 2;
  const ey = scRect.top + scRect.height / 2;

  const agent = (typeof getAgent === 'function') ? getAgent(agentId) : null;
  const color = (agent && agent.color) || '#4a90e2';

  spawnDataFlow(sx, sy, ex, ey, color);

  // 工位立绘庆祝
  const avatar = ws.querySelector('.ws-agent');
  if (avatar) {
    avatar.classList.add('celebrate');
    setTimeout(() => avatar.classList.remove('celebrate'), 800);
  }

  // 大屏闪烁（数据包抵达时延迟触发）
  setTimeout(() => {
    screen.classList.add('screen-flicker');
    setTimeout(() => screen.classList.remove('screen-flicker'), 400);
  }, 1100);

  // 工位 DONE 徽章
  ws.classList.add('is-done');
  const badge = ws.querySelector('.ws-status-badge');
  if (badge) {
    const original = badge.textContent;
    badge.textContent = '✓ DONE';
    setTimeout(() => {
      ws.classList.remove('is-done');
      if (badge) badge.textContent = original || 'NEW';
    }, 3000);
  }
}

/* === 数据流核心：SVG 曲线 + 3 数据包 + 抵达爆裂 === */
function spawnDataFlow(sx, sy, ex, ey, color) {
  const layer = document.getElementById('pulseLayer');
  if (!layer) return;

  // 控制点：中点向上拱起（让曲线柔和向上弯）
  const mx = (sx + ex) / 2;
  const my = (sy + ey) / 2 - Math.abs(ex - sx) * 0.25 - 60;

  // 全屏 SVG（每次新建，支持多 Agent 叠加）
  const NS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('class', 'data-flow-svg');
  svg.setAttribute('width', window.innerWidth);
  svg.setAttribute('height', window.innerHeight);
  svg.setAttribute('viewBox', `0 0 ${window.innerWidth} ${window.innerHeight}`);

  // 渐变 def：起点(亮) → 终点(透明)
  const defs = document.createElementNS(NS, 'defs');
  const gradId = 'flow-grad-' + Math.random().toString(36).slice(2, 8);
  const grad = document.createElementNS(NS, 'linearGradient');
  grad.setAttribute('id', gradId);
  grad.setAttribute('x1', sx); grad.setAttribute('y1', sy);
  grad.setAttribute('x2', ex); grad.setAttribute('y2', ey);
  grad.setAttribute('gradientUnits', 'userSpaceOnUse');
  grad.innerHTML = `
    <stop offset="0%"  stop-color="${color}" stop-opacity="0.95"/>
    <stop offset="60%" stop-color="${color}" stop-opacity="0.7"/>
    <stop offset="100%" stop-color="${color}" stop-opacity="0.2"/>
  `;
  defs.appendChild(grad);
  svg.appendChild(defs);

  // 路径
  const d = `M ${sx} ${sy} Q ${mx} ${my} ${ex} ${ey}`;
  const path = document.createElementNS(NS, 'path');
  path.setAttribute('d', d);
  path.setAttribute('stroke', `url(#${gradId})`);
  path.setAttribute('stroke-width', '4');
  path.setAttribute('fill', 'none');
  path.setAttribute('stroke-linecap', 'round');
  path.style.filter = `drop-shadow(0 0 10px ${color}) drop-shadow(0 0 4px ${color})`;
  svg.appendChild(path);

  layer.appendChild(svg);

  // 测路径长度，做画出动画
  const len = path.getTotalLength();
  path.style.strokeDasharray = len;
  path.style.strokeDashoffset = len;
  // 强制 reflow 后启动动画
  void path.getBoundingClientRect();
  path.style.transition = 'stroke-dashoffset 1s cubic-bezier(0.4, 0, 0.2, 1)';
  path.style.strokeDashoffset = '0';

  // 3 个数据包沿路径滑
  for (let i = 0; i < 3; i++) {
    const pkt = document.createElementNS(NS, 'circle');
    pkt.setAttribute('r', '7');
    pkt.setAttribute('fill', color);
    pkt.setAttribute('cx', sx);
    pkt.setAttribute('cy', sy);
    pkt.style.filter = `drop-shadow(0 0 12px ${color}) drop-shadow(0 0 4px #fff)`;

    const motion = document.createElementNS(NS, 'animateMotion');
    motion.setAttribute('dur', '1.1s');
    motion.setAttribute('begin', (0.2 + i * 0.18) + 's');
    motion.setAttribute('fill', 'freeze');
    motion.setAttribute('path', d);
    motion.setAttribute('rotate', 'auto');
    pkt.appendChild(motion);
    svg.appendChild(pkt);

    // 数据包到达终点时缩成 0
    const fade = document.createElementNS(NS, 'animate');
    fade.setAttribute('attributeName', 'r');
    fade.setAttribute('values', '7;9;0');
    fade.setAttribute('keyTimes', '0;0.85;1');
    fade.setAttribute('dur', '1.1s');
    fade.setAttribute('begin', (0.2 + i * 0.18) + 's');
    fade.setAttribute('fill', 'freeze');
    pkt.appendChild(fade);
  }

  // 1.3s 后：抵达爆裂 + 路径变金色
  setTimeout(() => {
    spawnArrival(ex, ey, color);
    path.style.transition = 'stroke 0.4s ease-out, opacity 0.6s ease-out 0.4s';
    path.setAttribute('stroke', '#FFD700');
    path.style.filter = 'drop-shadow(0 0 8px #FFD700)';
    setTimeout(() => { path.style.opacity = '0'; }, 200);
  }, 1300);

  // 2.3s 整体清理
  setTimeout(() => svg.remove(), 2300);
}

/* === 抵达点爆裂（小光圈 + 金色火花） === */
function spawnArrival(x, y, color) {
  const layer = document.getElementById('pulseLayer');
  if (!layer) return;

  const burst = document.createElement('div');
  burst.className = 'flow-arrival';
  burst.style.left = x + 'px';
  burst.style.top = y + 'px';
  burst.style.setProperty('--c', color);
  layer.appendChild(burst);
  requestAnimationFrame(() => burst.classList.add('fire'));
  setTimeout(() => burst.remove(), 900);
}
