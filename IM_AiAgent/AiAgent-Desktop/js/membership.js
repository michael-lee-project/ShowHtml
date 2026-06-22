/* ============================================
   M5: 会员中心 · design-taste-frontend redesign
   - 4 项核心权益（精简）
   - Hero 编辑感叙述（不用 stat 卡）
   - History editorial timeline（细线 + 日期 + 简短描述）
   ============================================ */

(function () {
  'use strict';

  /* === 4 级会员配置（与 store.js 月赠一致） === */
  const MEMBERSHIP = {
    levels: ['NU', 'VIP', 'MN', 'MB'],
    levelNames: { NU: '基础会员', VIP: '进阶会员', MN: '专业会员', MB: '至尊会员' },
    platformDiscount: { NU: 1.00, VIP: 0.90, MN: 0.80, MB: 0.70 },
    monthlyGift:      { NU:  200000, VIP:  500000, MN: 1500000, MB:  2000000 },
    hireableTiers:    { NU: [], VIP: ['junior'], MN: ['junior', 'mid'], MB: ['junior', 'mid', 'top'] },
    commission:       { NU: 0.05, VIP: 0.04, MN: 0.03, MB: 0.02 },
    upgradePrice:     { VIP: 199, MN: 999, MB: 4999 }
  };

  /* === 4 项核心权益（精简到极致） === */
  const BENEFITS = [
    { key: 'monthlyGift',      label: '月度赠送',     NU: '20 万',   VIP: '50 万', MN: '150 万', MB: '200 万' },
    { key: 'platformDiscount', label: '平台折扣',     NU: '无折扣',  VIP: '9 折',  MN: '8 折',  MB: '7 折' },
    { key: 'hireableExperts',  label: '可雇佣专家',   NU: '不可',    VIP: '初级 7 个', MN: '初+中级 11 个', MB: '全部 16 个' },
    { key: 'commission',       label: '市场抽佣',     NU: '5%',      VIP: '4%',    MN: '3%',    MB: '2%' }
  ];

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }
  function fmtNum(n) { return Number(n || 0).toLocaleString('en-US'); }
  function fmtDate(iso) {
    if (!iso) return '—';
    const d = new Date(iso);
    if (isNaN(d.getTime())) return '—';
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${y}.${m}.${dd}`;
  }
  function fmtDateFull(iso) {
    if (!iso) return { date: '—', time: '—' };
    const d = new Date(iso);
    if (isNaN(d.getTime())) return { date: '—', time: '—' };
    const date = `${d.getFullYear()}.${String(d.getMonth()+1).padStart(2,'0')}.${String(d.getDate()).padStart(2,'0')}`;
    const time = `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
    return { date, time };
  }

  function tierIndex(level) { return MEMBERSHIP.levels.indexOf(level); }

  function upgradeBtnState(currentLevel, targetLevel) {
    const cur = tierIndex(currentLevel);
    const tgt = tierIndex(targetLevel);
    if (tgt <= cur) return { kind: 'downgrade', label: '降级套餐', enabled: false };
    return { kind: 'upgrade', label: '升级到此套餐', enabled: true, price: MEMBERSHIP.upgradePrice[targetLevel] };
  }

  function renderMembershipCenter(root) {
    // 直接从 window 读取（非闭包缓存），确保拿到最新的 Proxy
    const cur = window.userStore.level;
    const user = window.userStore;
    const wallet = window.walletStore;
    const umdt = window.umdtStore;
    if (!user || !wallet || !umdt) {
      root.innerHTML = '<div class="mem-error">store 未就绪，请刷新页面</div>';
      return;
    }
    const curIdx = tierIndex(cur);
    const umdtBalance = umdt.balance || 0;
    const monthlyQuota = MEMBERSHIP.monthlyGift[cur];
    const monthlyUsed = wallet.monthlyGift ? (wallet.monthlyGift.used || 0) : 0;
    const monthlyRemaining = (wallet.monthlyGift ? (wallet.monthlyGift.quota || 0) : 0) - monthlyUsed;
    const upgradeHistory = (wallet.history || []).filter((h) => h.type === 'upgrade').slice().reverse();

    /* === Hero 区（极致克制：单行 3 段） === */
    const heroHTML = `
      <div class="mem-hero">
        <div class="mem-hero-row">
          <div class="mem-hero-current">
            <span class="mem-hero-label">Current</span>
            <div class="mem-hero-level">
              <span class="mem-hero-level-name">${esc(MEMBERSHIP.levelNames[cur])}</span>
              <span class="mem-hero-level-code">${esc(cur)}</span>
            </div>
          </div>
          <div class="mem-hero-meta">
            到期 <strong>${esc(fmtDate(user.levelExpireAt))}</strong><span class="mem-hero-meta-sep">·</span>注册 <strong>${esc(fmtDate(user.registerAt))}</strong>
          </div>
          <div class="mem-hero-status">
            <div class="mem-hero-status-item">
              <span class="mem-hero-status-num"><strong>${fmtNum(monthlyRemaining)}</strong><small>/ ${fmtNum(monthlyQuota)}</small></span>
              <span class="mem-hero-status-label">月赠 Token</span>
            </div>
            <div class="mem-hero-status-item">
              <span class="mem-hero-status-num">¥${fmtNum(umdtBalance)}</span>
              <span class="mem-hero-status-label">UMDT</span>
            </div>
          </div>
        </div>
      </div>
    `;

    /* === 4 档套餐对比（等宽 4 列） === */
    const planHTML = MEMBERSHIP.levels.map((lvl) => {
      const isCurrent = lvl === cur;
      const price = MEMBERSHIP.upgradePrice[lvl];
      const state = upgradeBtnState(cur, lvl);

      const benefitCells = BENEFITS.map((b) => `
        <li class="mem-benefit-row">
          <span class="mem-benefit-label">${esc(b.label)}</span>
          <span class="mem-benefit-val">${esc(b[lvl])}</span>
        </li>
      `).join('');

      const actionBtn = isCurrent
        ? `<button class="mem-plan-current" disabled>当前套餐</button>`
        : (price
            ? `<button class="mem-plan-buy" data-buy="${esc(lvl)}" ${state.enabled ? '' : 'disabled'}>
                 升级 · ¥${fmtNum(price)}
               </button>`
            : `<button class="mem-plan-current" disabled>无需购买</button>`);

      return `
        <article class="mem-plan ${isCurrent ? 'is-current' : ''}" data-level="${esc(lvl)}">
          <header class="mem-plan-head">
            <span class="mem-plan-name">${esc(MEMBERSHIP.levelNames[lvl])}</span>
            <span class="mem-plan-code">${esc(lvl)}</span>
          </header>
          <div class="mem-plan-price-row">
            <span class="mem-plan-price">¥${fmtNum(price || 0)}</span>
            <span class="mem-plan-price-suffix">/ 单次升级</span>
          </div>
          <ul class="mem-benefit-list">${benefitCells}</ul>
          <div class="mem-plan-foot">
            ${actionBtn}
          </div>
        </article>
      `;
    }).join('');

    /* === 订阅记录（editorial timeline：细线 + 日期 + 简短描述） === */
    const historyHTML = upgradeHistory.length === 0
      ? `<div class="mem-history-empty">
          当前套餐已配置好适合你的资源 · <strong>当你需要更多档位时，回到这里。</strong>
        </div>`
      : `<ol class="mem-history-list">
          ${upgradeHistory.map((h) => {
            const dt = fmtDateFull(h.time);
            return `<li class="mem-history-item">
              <div class="mem-history-time">
                <span class="mem-history-time-date">${esc(dt.date)}</span>
                ${esc(dt.time)}
              </div>
              <div class="mem-history-body">
                <div class="mem-history-note">${esc(h.note || '套餐变更')}</div>
                <div class="mem-history-meta">
                  UMDT <strong>¥${fmtNum(Math.abs(h.umdtAmount || 0))}</strong><span class="mem-history-meta-sep">·</span>状态 <strong>${esc(h.status || '—')}</strong>
                </div>
              </div>
            </li>`;
          }).join('')}
        </ol>`;

    /* === 装配完整页面 === */
    root.innerHTML = `
      <div class="mem-shell">
        ${heroHTML}
        <section class="mem-section">
          <header class="mem-section-head">
            <div>
              <span class="kicker-tag">PLAN COMPARISON · 4 LEVELS</span>
              <h2 class="mem-section-title">选择适合你的档位</h2>
            </div>
            <p class="mem-section-sub">4 档独立套餐，资源不可跨档解锁，全部按 Token 实扣。UMDT 余额可直接用于升级。</p>
          </header>
          <div class="mem-plans">${planHTML}</div>
        </section>
        <section class="mem-section mem-section--history">
          <header class="mem-section-head">
            <div>
              <span class="kicker-tag">SUBSCRIPTION HISTORY</span>
              <h2 class="mem-section-title">订阅记录</h2>
            </div>
            <p class="mem-section-sub">${upgradeHistory.length} 条历史升级</p>
          </header>
          ${historyHTML}
        </section>
      </div>
    `;

    /* === 绑定升级按钮事件 === */
    root.querySelectorAll('.mem-plan-buy[data-buy]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const target = btn.dataset.buy;
        if (!window.membershipActions || typeof window.membershipActions.upgrade !== 'function') return;
        const price = MEMBERSHIP.upgradePrice[target];
        const u = window.umdtStore;
        if (!u || u.balance < price) {
          if (typeof window.showToast === 'function') {
            window.showToast('⚠ UMDT 不足，无法升级', { type: 'warning' });
          }
          return;
        }
        const ok = window.confirm(`确认升级到 ${MEMBERSHIP.levelNames[target]}？\n\n价格：¥${fmtNum(price)} UMDT\n升级后立即生效，月赠 Token 按新档位发放。`);
        if (!ok) return;
        const result = window.membershipActions.upgrade(target, price);
        if (!result || !result.ok) {
          if (typeof window.showToast === 'function') {
            window.showToast('升级失败：' + (result && result.reason || '未知错误'), { type: 'error' });
          }
          return;
        }
        if (typeof window.showToast === 'function') {
          window.showToast('✓ 已升级到 ' + MEMBERSHIP.levelNames[target] + ' · 扣 UMDT ¥' + fmtNum(price), { type: 'success' });
        }
        renderMembershipCenter(root);
        if (typeof window.refreshAppSurfaces === 'function') {
          try { window.refreshAppSurfaces(); } catch (e) {}
        }
      });
    });
  }

  function openMembership() {
    const root = document.getElementById('membershipRoot');
    if (!root) return;
    renderMembershipCenter(root);
  }

  /* === 订阅 store 变化，自动刷新（直接用 subscribeStore，不依赖 DOM 事件） === */
  if (typeof window.subscribeStore === 'function') {
    window.subscribeStore(() => {
      const root = document.getElementById('membershipRoot');
      const stage = document.querySelector('.stage-view[data-stage="membership"]');
      if (root && stage && stage.classList.contains('is-active')) {
        renderMembershipCenter(root);
      }
    });
  } else {
    // fallback: DOM 事件（兜底）
    window.addEventListener('store:changed', () => {
      const root = document.getElementById('membershipRoot');
      const stage = document.querySelector('.stage-view[data-stage="membership"]');
      if (root && stage && stage.classList.contains('is-active')) {
        renderMembershipCenter(root);
      }
    });
  }

  window.openMembership = openMembership;
  window.renderMembershipCenter = renderMembershipCenter;

  console.info('[membership] M5 会员中心已加载 · design-taste-frontend v3');
})();
