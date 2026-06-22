/* ============================================
   M2: 算力中心 · redesign v3 (Soft Structuralism + Editorial Split)
   - Vibe: 暖白纸感 + 银灰衬底, 白卡 hairline 边框
   - Layout: Editorial Split — 顶 wallet hero (全宽) + 中段 2 列市场
   - Visual anchor: 100万 pkg 黑底反色 + 红边 + 红光晕 (沿用 M5 currentPlan 模式)
   - 0.2s ease 标准过渡 (no spring, no Double-Bezel, no ambient shadow, no hero kicker pulse)
   ============================================ */

(function () {
  'use strict';

  /* === 数据 === */
  const PLATFORM_PACKAGES = [
    { id: 'p1',   label: '1 万 Token',    amount: 10000,    unitUMDT: 9.9 },
    { id: 'p10',  label: '10 万 Token',   amount: 100000,   unitUMDT: 89 },
    { id: 'p100', label: '100 万 Token',  amount: 1000000,  unitUMDT: 799 },
    { id: 'p500', label: '500 万 Token',  amount: 5000000,  unitUMDT: 3499 },
    { id: 'p1m',  label: '1000 万 Token', amount: 10000000, unitUMDT: 6499 }
  ];
  const MOCK_ORDERS = [
    { id: 'o-001', seller: 'design-mid',   sellerLevel: 'MB', amount: 100000,  unitUMDT: 0.0009, listedAt: '2026.06.18 09:12' },
    { id: 'o-002', seller: 'writing-junior', sellerLevel: 'MN', amount: 200000, unitUMDT: 0.0006, listedAt: '2026.06.19 11:34' },
    { id: 'o-003', seller: 'data-junior',  sellerLevel: 'VIP', amount: 500000,  unitUMDT: 0.0008, listedAt: '2026.06.20 14:08' },
    { id: 'o-004', seller: 'sales-mid',    sellerLevel: 'MB', amount: 300000,  unitUMDT: 0.0005, listedAt: '2026.06.20 16:22' },
    { id: 'o-005', seller: 'video-top',    sellerLevel: 'MB', amount: 1000000, unitUMDT: 0.0004, listedAt: '2026.06.21 08:55' }
  ];
  const COMMISSION = { NU: 0.05, VIP: 0.04, MN: 0.03, MB: 0.02 };
  const PLATFORM_DISCOUNT = { NU: 1, VIP: 0.9, MN: 0.85, MB: 0.8 };
  const LEVEL_NAME = { NU: '基础会员', VIP: '进阶会员', MN: '专业会员', MB: '至尊会员' };

  /* === 工具 === */
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }
  function fmt(n) { return Number(n || 0).toLocaleString('en-US'); }
  function fmtMoney(n) {
    const v = Number(n || 0);
    return v.toLocaleString('en-US', { minimumFractionDigits: v < 10 ? 1 : 0, maximumFractionDigits: 2 });
  }
  function pkgPrice(pkg, level) {
    return +(pkg.unitUMDT * PLATFORM_DISCOUNT[level]).toFixed(2);
  }
  function discountLabel(level) {
    if (level === 'NU') return '无折扣';
    return Math.round(PLATFORM_DISCOUNT[level] * 10) + ' 折';
  }

  /* === 1. Page Head (克制 18×32 紧凑) === */
  function renderPageHead(level) {
    return `
      <header class="ch-pagehead">
        <div class="ch-pagehead-left">
          <span class="ch-pagehead-kicker mono">COMPUTE HUB</span>
          <h2 class="ch-pagehead-title">算力中心</h2>
          <span class="ch-pagehead-sub mono">${LEVEL_NAME[level]} · 平台折扣 ${discountLabel(level)} · 市场抽佣 ${(COMMISSION[level] * 100).toFixed(0)}%</span>
        </div>
        <div class="ch-pagehead-right">
          <button class="ch-btn-ghost" data-ch-action="recharge">+ 充值 UMDT</button>
          <button class="ch-btn-line" data-ch-action="open-history">交易记录</button>
        </div>
      </header>
    `;
  }

  /* === 2. Wallet Hero (全宽白卡, 左侧大数字 + 右侧 4 inline stats) === */
  function renderWalletHero(level, available, monthly, totalQuota, locked, consumed, umdt) {
    return `
      <article class="ch-wallet-hero">
        <div class="ch-wallet-hero-left">
          <span class="ch-wallet-hero-label mono">UMDT 余额</span>
          <strong class="ch-wallet-hero-value">¥${fmtMoney(umdt)}</strong>
          <span class="ch-wallet-hero-hint mono">≈ ${fmt(Math.floor(umdt / 0.0009))} Token 可购</span>
        </div>
        <div class="ch-wallet-hero-divider"></div>
        <div class="ch-wallet-hero-stats">
          <div class="ch-wallet-stat">
            <span class="ch-wallet-stat-label mono">Token 可用</span>
            <strong class="ch-wallet-stat-value">${fmt(available)}</strong>
          </div>
          <div class="ch-wallet-stat">
            <span class="ch-wallet-stat-label mono">月赠剩余</span>
            <strong class="ch-wallet-stat-value">${fmt(monthly)}<small>/${fmt(totalQuota)}</small></strong>
          </div>
          <div class="ch-wallet-stat">
            <span class="ch-wallet-stat-label mono">锁定 Token</span>
            <strong class="ch-wallet-stat-value">${fmt(locked)}</strong>
          </div>
          <div class="ch-wallet-stat">
            <span class="ch-wallet-stat-label mono">累计消耗</span>
            <strong class="ch-wallet-stat-value">${fmt(consumed)}</strong>
          </div>
        </div>
      </article>
    `;
  }

  /* === 3. Platform Market (左列, 1 featured + 4 sub, 无 Double-Bezel) === */
  function renderPlatformMarket(level) {
    const [hero, ...rest] = PLATFORM_PACKAGES;
    const heroPrice = pkgPrice(hero, level);
    const heroOrig = hero.unitUMDT;
    const heroSaved = heroOrig - heroPrice;

    const heroCard = `
      <article class="ch-pkg-card ch-pkg-card--featured" data-pkg="${esc(hero.id)}">
        <div class="ch-pkg-card-head">
          <span class="ch-pkg-card-flag mono">FEATURED</span>
          <span class="ch-pkg-card-amount">${esc(hero.label)}</span>
        </div>
        <div class="ch-pkg-card-price">
          <span class="ch-pkg-card-price-num">¥${fmtMoney(heroPrice)}</span>
          <span class="ch-pkg-card-price-suffix mono">UMDT</span>
        </div>
        <div class="ch-pkg-card-orig mono">原价 ¥${fmtMoney(heroOrig)} · ${heroSaved > 0.01 ? `会员再省 ¥${fmtMoney(heroSaved)}` : '已含会员折扣'}</div>
        <button class="ch-btn-primary" data-ch-action="buy-pkg" data-pkg-id="${esc(hero.id)}" data-amount="${hero.amount}" data-umdt="${heroPrice}" data-name="${esc(hero.label)}">
          立即购买
          <span class="ch-btn-arrow">→</span>
        </button>
      </article>
    `;

    const subCards = rest.map(pkg => {
      const price = pkgPrice(pkg, level);
      const saved = pkg.unitUMDT - price;
      return `
        <article class="ch-pkg-card" data-pkg="${esc(pkg.id)}">
          <div class="ch-pkg-card-head">
            <span class="ch-pkg-card-amount">${esc(pkg.label)}</span>
            ${saved > 0.01 ? `<span class="ch-pkg-card-saved mono">省 ¥${fmtMoney(saved)}</span>` : ''}
          </div>
          <div class="ch-pkg-card-price">
            <strong class="ch-pkg-card-price-num">¥${fmtMoney(price)}</strong>
            <span class="ch-pkg-card-price-suffix mono">UMDT</span>
          </div>
          <button class="ch-btn-line" data-ch-action="buy-pkg" data-pkg-id="${esc(pkg.id)}" data-amount="${pkg.amount}" data-umdt="${price}" data-name="${esc(pkg.label)}">购买</button>
        </article>
      `;
    }).join('');

    return `
      <section class="ch-section">
        <header class="ch-section-head">
          <div class="ch-section-head-left">
            <span class="ch-section-kicker mono">PLATFORM MARKET</span>
            <h3 class="ch-section-title">平台市场</h3>
          </div>
          <span class="ch-section-tag mono">${level === 'NU' ? '升级 VIP 即享 9 折' : '已享会员折扣'}</span>
        </header>
        <div class="ch-pkg-grid">
          ${heroCard}
          ${subCards}
        </div>
      </section>
    `;
  }

  /* === 4. User Market (右列, 紧凑行式订单) === */
  function renderUserMarket(level) {
    const canSell = level === 'MB';
    return `
      <section class="ch-section">
        <header class="ch-section-head">
          <div class="ch-section-head-left">
            <span class="ch-section-kicker mono">USER MARKET</span>
            <h3 class="ch-section-title">用户市场 <em>· ${MOCK_ORDERS.length}</em></h3>
          </div>
          <button class="ch-btn-line" data-ch-action="open-sell">${canSell ? '+ 我要挂单' : '挂单需 MB'}</button>
        </header>
        <ul class="ch-order-list">
          ${MOCK_ORDERS.map((o, i) => {
            const rate = COMMISSION[o.sellerLevel] || 0.05;
            const total = o.amount * o.unitUMDT * (1 + rate);
            return `
              <li class="ch-order-row" data-ch-action="buy-order" data-order-id="${esc(o.id)}" style="--i:${i}">
                <div class="ch-order-row-head">
                  <span class="ch-order-seller">${esc(o.seller)}</span>
                  <span class="ch-order-tier mono">${esc(o.sellerLevel)}</span>
                </div>
                <div class="ch-order-row-meta">
                  <span class="ch-order-amount mono">${fmt(o.amount)} Token</span>
                  <span class="ch-order-price mono">¥${fmtMoney(total)}</span>
                </div>
                <div class="ch-order-row-foot mono">${esc(o.listedAt)}</div>
              </li>
            `;
          }).join('')}
        </ul>
        <div class="ch-my-orders" id="chMyOrders">
          ${renderMyOrders()}
        </div>
      </section>
    `;
  }

  /* === 5. My Listings (内嵌) === */
  function renderMyOrders() {
    const orders = window.orderStore?.mine || [];
    if (orders.length === 0) return '';
    return `
      <div class="ch-my-orders-block">
        <div class="ch-my-orders-head">
          <span class="ch-section-kicker mono">MY LISTINGS · ${orders.length}</span>
        </div>
        <ul class="ch-my-orders-list">
          ${orders.map((o, i) => `
            <li class="ch-my-order-row" data-ch-action="cancel-order" data-order-id="${esc(o.id)}" style="--i:${i}">
              <div class="ch-my-order-info">
                <strong>${esc(o.amount.toLocaleString('en-US'))} Token</strong>
                <span class="ch-my-order-price mono">¥${fmtMoney(o.amount * o.unitUMDT)} · 锁定 ${fmt(o.amount)}</span>
              </div>
              <button class="ch-btn-ghost ch-btn-ghost--small">取消</button>
            </li>
          `).join('')}
        </ul>
      </div>
    `;
  }

  /* === 渲染入口 === */
  function renderComputeHub(root) {
    const level = window.userStore?.level || 'NU';
    const w = window.walletStore;
    const u = window.umdtStore;
    const available = window.walletActions.available();
    const monthlyRemain = Math.max(0, w.monthlyGift.quota - w.monthlyGift.used);

    root.innerHTML = `
      <div class="ch-shell">
        ${renderPageHead(level)}
        <div class="ch-wallet-row">
          ${renderWalletHero(level, available, monthlyRemain, w.monthlyGift.quota, w.lockedBalance, w.consumed, u.balance)}
        </div>
        <div class="ch-markets">
          ${renderPlatformMarket(level)}
          ${renderUserMarket(level)}
        </div>
      </div>
    `;

    bindEvents(root);
  }

  function bindEvents(root) {
    root.querySelectorAll('[data-ch-action="recharge"]').forEach(btn => {
      btn.addEventListener('click', () => {
        showDialog({
          title: '充值 UMDT',
          content: '选择充值金额，立即到账（Mock）：',
          actions: [
            { label: '+ 100',  onClick: () => doRecharge(100) },
            { label: '+ 500',  onClick: () => doRecharge(500) },
            { label: '+ 1000', primary: true, onClick: () => doRecharge(1000) },
            { label: '取消', onClick: () => {} }
          ]
        });
      });
    });
    root.querySelectorAll('[data-ch-action="open-history"]').forEach(btn => {
      btn.addEventListener('click', openTradeHistory);
    });
    root.querySelectorAll('[data-ch-action="buy-pkg"]').forEach(btn => {
      btn.addEventListener('click', () => {
        const pkgId = btn.dataset.pkgId;
        const amount = +btn.dataset.amount;
        const umdt = +btn.dataset.umdt;
        const name = btn.dataset.name;
        const ok = confirm(`确认购买 ${name}？\n\n价格：¥${umdt} UMDT\n到账：${amount.toLocaleString('en-US')} Token`);
        if (!ok) return;
        const r = window.walletActions.buyPlatformToken(amount, umdt, name);
        if (!r.ok) {
          showToast('购买失败：' + r.reason, { type: 'error' });
          return;
        }
        showToast('✓ 已购买 ' + name + ' · 扣 UMDT ¥' + umdt, { type: 'success' });
        const rootEl = document.getElementById('computeHubRoot');
        if (rootEl) renderComputeHub(rootEl);
        if (typeof window.refreshAppSurfaces === 'function') window.refreshAppSurfaces();
      });
    });
    root.querySelectorAll('[data-ch-action="buy-order"]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.orderId;
        const o = MOCK_ORDERS.find(x => x.id === id);
        if (!o) return;
        const rate = COMMISSION[o.sellerLevel] || 0.05;
        const total = +(o.amount * o.unitUMDT * (1 + rate)).toFixed(2);
        const ok = confirm(`确认买入挂单？\n\n卖家：${o.seller} (${o.sellerLevel})\n数量：${o.amount.toLocaleString('en-US')} Token\n价格：¥${total} UMDT（含抽佣）`);
        if (!ok) return;
        const r = window.walletActions.buyUserMarket(o.amount, total, o.seller);
        if (!r.ok) {
          showToast('买入失败：' + r.reason, { type: 'error' });
          return;
        }
        showToast('✓ 已买入 ' + fmt(o.amount) + ' Token · 扣 UMDT ¥' + total, { type: 'success' });
        const rootEl = document.getElementById('computeHubRoot');
        if (rootEl) renderComputeHub(rootEl);
        if (typeof window.refreshAppSurfaces === 'function') window.refreshAppSurfaces();
      });
    });
    root.querySelectorAll('[data-ch-action="cancel-order"]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.orderId;
        if (!window.orderStore?.mine) return;
        const idx = window.orderStore.mine.findIndex(o => o.id === id);
        if (idx < 0) return;
        const o = window.orderStore.mine[idx];
        const ok = confirm(`确认取消挂单？\n\n数量：${o.amount.toLocaleString('en-US')} Token\n将释放锁定 Token ${o.amount.toLocaleString('en-US')}`);
        if (!ok) return;
        if (typeof window.orderActions?.cancelMyOrder === 'function') {
          window.orderActions.cancelMyOrder(id);
          showToast('✓ 已取消挂单，释放 ' + fmt(o.amount) + ' Token', { type: 'success' });
          const rootEl = document.getElementById('computeHubRoot');
          if (rootEl) renderComputeHub(rootEl);
          if (typeof window.refreshAppSurfaces === 'function') window.refreshAppSurfaces();
        }
      });
    });
    root.querySelectorAll('[data-ch-action="open-sell"]').forEach(btn => {
      btn.addEventListener('click', () => {
        if (!window.membershipActions.canSellToken()) {
          showToast('⚠ 仅 MB 会员可挂单出售 Token', { type: 'warning' });
          setTimeout(() => window.appNavigate && window.appNavigate('membership'), 800);
          return;
        }
        openSellDialog();
      });
    });
  }

  function doRecharge(amt) {
    window.walletActions.rechargeUMDT(amt);
    showToast('已到账 +' + amt + ' UMDT', { type: 'success' });
    const root = document.getElementById('computeHubRoot');
    if (root) renderComputeHub(root);
    if (typeof window.refreshAppSurfaces === 'function') window.refreshAppSurfaces();
  }

  /* === 挂单弹窗 === */
  function openSellDialog() {
    const maxAvailable = window.walletActions.available();
    const rate = COMMISSION[window.userStore.level] || 0.05;
    const html = `
      <div class="ch-sell-form">
        <div class="ch-sell-row">
          <label class="mono">数量（Token）</label>
          <input type="number" id="sellAmount" class="ch-sell-input" placeholder="如 500000" min="1000" max="${maxAvailable}" step="1000">
          <span class="ch-sell-hint mono">可用 ${fmt(maxAvailable)}</span>
        </div>
        <div class="ch-sell-row">
          <label class="mono">单价（UMDT / Token）</label>
          <input type="number" id="sellUnitPrice" class="ch-sell-input" placeholder="如 0.0008" min="0.0001" step="0.0001">
        </div>
        <div class="ch-sell-row">
          <label class="mono">有效期（小时）</label>
          <select id="sellHours" class="ch-sell-input">
            <option value="24">24</option>
            <option value="72">72</option>
            <option value="168" selected>168（7 天）</option>
          </select>
        </div>
        <div class="ch-sell-preview">
          <span class="mono">抽佣预览（${(rate*100).toFixed(0)}%）：</span>
          <span id="sellPreview" class="ch-sell-preview-val">输入数量与单价后预览</span>
        </div>
      </div>
    `;
    showDialog({
      title: '挂单出售 Token',
      content: html,
      actions: [
        { label: '取消', onClick: () => {} },
        { label: '上架', primary: true, onClick: () => {
          const amount = +document.getElementById('sellAmount').value;
          const unit = +document.getElementById('sellUnitPrice').value;
          const hours = +document.getElementById('sellHours').value;
          if (!amount || amount <= 0) { showToast('请输入有效数量', { type: 'warning' }); return; }
          if (!unit || unit <= 0) { showToast('请输入有效单价', { type: 'warning' }); return; }
          if (amount > maxAvailable) { showToast('数量超过可用 Token', { type: 'warning' }); return; }
          if (window.orderActions && window.orderActions.listOrder) {
            const r = window.orderActions.listOrder(amount, unit, hours);
            if (!r.ok) { showToast('挂单失败：' + r.reason, { type: 'error' }); return; }
            showToast('✓ 挂单成功，锁定 ' + fmt(amount) + ' Token', { type: 'success' });
            const root = document.getElementById('computeHubRoot');
            if (root) renderComputeHub(root);
            if (typeof window.refreshAppSurfaces === 'function') window.refreshAppSurfaces();
          }
        }}
      ]
    });
    setTimeout(() => {
      const a = document.getElementById('sellAmount');
      const u = document.getElementById('sellUnitPrice');
      const p = document.getElementById('sellPreview');
      function recalc() {
        const amt = +a.value;
        const up = +u.value;
        if (amt > 0 && up > 0) {
          const total = amt * up;
          const fee = total * rate;
          const net = total - fee;
          p.textContent = `总价 ¥${fmtMoney(total)} · 抽佣 ¥${fmtMoney(fee)} · 实收 ¥${fmtMoney(net)}`;
        } else {
          p.textContent = '输入数量与单价后预览';
        }
      }
      a && a.addEventListener('input', recalc);
      u && u.addEventListener('input', recalc);
    }, 100);
  }

  /* === 交易记录 dialog === */
  function openTradeHistory() {
    const w = window.walletStore;
    const history = (w.history || []).slice().reverse();
    if (history.length === 0) {
      showDialog({
        title: '交易记录',
        content: '<div class="ch-empty">暂无交易记录</div>',
        actions: [{ label: '关闭', onClick: () => {} }]
      });
      return;
    }
    const html = `
      <div class="ch-history-list">
        ${history.map(h => {
          const dt = new Date(h.time);
          const dateStr = isNaN(dt.getTime()) ? '—' : `${dt.getFullYear()}.${String(dt.getMonth()+1).padStart(2,'0')}.${String(dt.getDate()).padStart(2,'0')}`;
          const timeStr = isNaN(dt.getTime()) ? '' : `${String(dt.getHours()).padStart(2,'0')}:${String(dt.getMinutes()).padStart(2,'0')}`;
          return `
            <article class="ch-history-item">
              <div class="ch-history-time">
                <strong>${dateStr}</strong>
                <span class="mono">${timeStr}</span>
              </div>
              <div class="ch-history-arrow mono">→</div>
              <div class="ch-history-body">
                <strong>${esc(h.note || '—')}</strong>
                <div class="ch-history-meta mono">
                  ${h.tokenAmount ? `<span class="ch-history-token">Token ${fmt(h.tokenAmount)}</span>` : ''}
                  ${h.umdtAmount ? `<span class="ch-history-umdt">UMDT ${fmtMoney(h.umdtAmount)}</span>` : ''}
                  <span class="ch-history-status">${esc(h.status || '—')}</span>
                </div>
              </div>
            </article>
          `;
        }).join('')}
      </div>
    `;
    showDialog({
      title: '交易记录 · ' + history.length + ' 条',
      content: html,
      actions: [{ label: '关闭', onClick: () => {} }]
    });
  }

  /* === 入口 === */
  function openComputeHub() {
    const root = document.getElementById('computeHubRoot');
    if (!root) return;
    renderComputeHub(root);
  }

  // 订阅 store 变化
  window.addEventListener('store:changed', () => {
    const root = document.getElementById('computeHubRoot');
    const stage = document.querySelector('.stage-view[data-stage="compute-hub"]');
    if (root && stage && stage.classList.contains('is-active')) {
      renderComputeHub(root);
    }
  });

  window.openComputeHub = openComputeHub;
  window.renderComputeHub = renderComputeHub;

  console.info('[compute-hub] M2 算力中心已加载 · redesign-v3');
})();