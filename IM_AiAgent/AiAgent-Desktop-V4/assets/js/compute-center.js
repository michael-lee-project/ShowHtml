/* ============================================================
 * compute-center.js · 算力中心交互
 * 1. 实时时钟
 * 2. 4 统计 count-up
 * 3. 盲盒转盘（8 扇区 + 旋转 + 中奖）
 * 4. 认购 / 升级 / 中奖 三个 modal
 * 5. 实时动态（新条目 push）
 * ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  // Empty state for live feed (initial load)
  const feedEl = document.getElementById('liveFeed');
  if (feedEl && feedEl.children.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'feed-empty';
    empty.innerHTML = `
      <div class="feed-empty__icon">📡</div>
      <div class="feed-empty__title">暂无最新动态</div>
      <div class="feed-empty__desc">新成交将自动在此出现</div>
    `;
    feedEl.appendChild(empty);
  }


  /* ---------- 1. 实时时钟 ---------- */
  function updateClock() {
    const now = new Date();
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    const s = String(now.getSeconds()).padStart(2, '0');
    const t = `${h}:${m}:${s}`;
    const c = document.getElementById('computeClock');
    if (c) c.textContent = t;
  }
  updateClock();
  setInterval(updateClock, 1000);

  /* ---------- 2. 4 统计数字 count-up (GSAP) + 4 stat-card / 4 档位 / 4 会员卡 stagger ---------- */
  const HAS_GSAP = typeof gsap !== 'undefined';
  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 2a. 4 统计数字 count-up (GSAP object tween)
  document.querySelectorAll('.stat-card__num').forEach((el, idx) => {
    const target = parseInt(el.dataset.target || '0', 10);
    const prefix = el.dataset.prefix || '';
    if (HAS_GSAP && !reduceMotion) {
      const obj = { v: 0 };
      gsap.to(obj, {
        v: target,
        duration: 1.6,
        delay: 0.15 + idx * 0.08,  // 错开
        ease: 'power3.out',
        onUpdate: () => {
          el.textContent = prefix + Math.floor(obj.v).toLocaleString('en-US');
        },
        onComplete: () => {
          el.textContent = prefix + target.toLocaleString('en-US');
        }
      });
    } else {
      // fallback rAF
      const dur = 1200;
      const start = performance.now();
      function tick(now) {
        const t = Math.min(1, (now - start) / dur);
        const ease = 1 - Math.pow(1 - t, 3);
        const val = Math.floor(target * ease);
        el.textContent = prefix + val.toLocaleString('en-US');
        if (t < 1) requestAnimationFrame(tick);
        else el.textContent = prefix + target.toLocaleString('en-US');
      }
      requestAnimationFrame(tick);
    }
  });

  // 2b. Page load stagger 入场: stat-card → 认购池明细 → 销售池4档 → 转盘
  if (HAS_GSAP && !reduceMotion) {
    const statCards = document.querySelectorAll('.stat-card');
    const poolBuyers = document.querySelectorAll('.pool-buyer');
    const salesTiers = document.querySelectorAll('.sales-tier');
    const wheelWrap = document.querySelector('.lucky-wheel');

    // 4 stat-card 顶部滑入
    gsap.fromTo(statCards,
      { opacity: 0, y: 16, scale: 0.96 },
      { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'power3.out', stagger: 0.08, delay: 0.05 }
    );

    // 4 stat-card icon 微动效：弹入 + 持续呼吸（错开周期，避免整齐划一）
    const statIcons = document.querySelectorAll('.stat-card__icon');
    if (statIcons.length) {
      gsap.fromTo(statIcons,
        { scale: 0, rotation: -90, opacity: 0 },
        { scale: 1, rotation: 0, opacity: 1, duration: 0.55, ease: 'back.out(1.8)', stagger: 0.08, delay: 0.35 }
      );
      statIcons.forEach((icon, i) => {
        gsap.to(icon, {
          scale: 1.06,
          duration: 1.8 + i * 0.25,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
          delay: 1.2 + i * 0.2
        });
      });
    }

    // 5 认购明细 stagger（认购池）
    if (poolBuyers.length) {
      gsap.fromTo(poolBuyers,
        { opacity: 0, x: -16 },
        { opacity: 1, x: 0, duration: 0.5, ease: 'power3.out', stagger: 0.06, delay: 0.45 }
      );
    }

    // 4 等级定价 stagger（销售池）
    if (salesTiers.length) {
      gsap.fromTo(salesTiers,
        { opacity: 0, y: 20, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.55, ease: 'back.out(1.4)', stagger: 0.07, delay: 0.65 }
      );
    }

    // 转盘弹性入场（旋转 + 缩放）
    if (wheelWrap) {
      gsap.fromTo(wheelWrap,
        { opacity: 0, scale: 0.7, rotation: -30 },
        { opacity: 1, scale: 1, rotation: 0, duration: 0.9, ease: 'elastic.out(1, 0.7)', delay: 0.85 }
      );
    }

    // 实时动态实时块从底部滑入
    const feedPanel = document.querySelector('.live-feed');
    if (feedPanel) {
      gsap.fromTo(feedPanel,
        { opacity: 0, x: 30 },
        { opacity: 1, x: 0, duration: 0.7, ease: 'power3.out', delay: 1.0 }
      );
    }
  }

  /* ---------- 3. 转盘：8 扇区 + 旋转 ---------- */
  const PRIZES = [
    { name: 'Token ×10',   icon: '🪙', color: '#F0EBE2', textColor: '#1A2238', rarity: 'N'   },
    { name: '算力 ×2',     icon: '⚡', color: '#E8F5EE', textColor: '#07C160', rarity: 'R'   },
    { name: 'Token ×50',   icon: '💰', color: '#FFF6E0', textColor: '#B8941F', rarity: 'R'   },
    { name: '算力 ×5',     icon: '💎', color: '#F2EDFF', textColor: '#7C5CFF', rarity: 'SR'  },
    { name: 'Token ×200',  icon: '🎁', color: '#FFE4D6', textColor: '#E54B4B', rarity: 'SR'  },
    { name: '算力 ×10',    icon: '🌟', color: '#FFF0E0', textColor: '#FF8C42', rarity: 'SSR' },
    { name: 'Token ×500',  icon: '👑', color: '#E8F0FF', textColor: '#1FB6FF', rarity: 'SR'  },
    { name: '算力 ×50',    icon: '💠', color: '#FFE4E8', textColor: '#E54B4B', rarity: 'SSR' }
  ];

  // 生成 8 扇区
  const wheelSegments = document.getElementById('wheelSegments');
  if (wheelSegments) {
    const cx = 0, cy = 0, r = 150;
    const segAngle = 360 / PRIZES.length;
    PRIZES.forEach((p, i) => {
      const startAngle = i * segAngle - 90;
      const endAngle = startAngle + segAngle;
      const startRad = (startAngle * Math.PI) / 180;
      const endRad = (endAngle * Math.PI) / 180;
      const x1 = cx + r * Math.cos(startRad);
      const y1 = cy + r * Math.sin(startRad);
      const x2 = cx + r * Math.cos(endRad);
      const y2 = cy + r * Math.sin(endRad);
      const largeArc = segAngle > 180 ? 1 : 0;
      const path = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`;
      const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      g.innerHTML = `
        <path d="${path}" fill="${p.color}" stroke="white" stroke-width="1.5"/>
        <text x="${cx + (r * 0.62) * Math.cos((startAngle + segAngle / 2) * Math.PI / 180)}"
              y="${cy + (r * 0.62) * Math.sin((startAngle + segAngle / 2) * Math.PI / 180)}"
              text-anchor="middle" dominant-baseline="middle" font-size="20">${p.icon}</text>
        <text x="${cx + (r * 0.42) * Math.cos((startAngle + segAngle / 2) * Math.PI / 180)}"
              y="${cy + (r * 0.42) * Math.sin((startAngle + segAngle / 2) * Math.PI / 180)}"
              text-anchor="middle" dominant-baseline="middle" font-size="9" font-weight="700"
              fill="${p.textColor}" letter-spacing="0.5">${p.rarity}</text>
      `;
      wheelSegments.appendChild(g);
    });
  }

  // 转盘旋转 (GSAP 驱动) - 绕 SVG 中心 (160, 160)
  let wheelBusy = false;
  const wheelRotor = document.querySelector('.wheel-rotor');
  const wheelPointer = document.querySelector('.wheel__pointer');

  function spinWheel(times = 1) {
    if (wheelBusy || !wheelRotor) return;
    wheelBusy = true;
    // 随机选一个扇区
    const targetIndex = Math.floor(Math.random() * PRIZES.length);
    const segAngle = 360 / PRIZES.length;
    // 旋转角度 = 多圈 + 转到目标扇区中央
    const turn = times === 10 ? 9 : 6; // 10 连抽转 9 圈
    const finalAngle = turn * 360 + (360 - targetIndex * segAngle - segAngle / 2);

    // Kill 旧 tween（防止快速连点叠加）
    gsap.killTweensOf(wheelRotor);

    // 指针 wobble（点击时）
    if (wheelPointer) {
      gsap.fromTo(wheelPointer, { rotation: -8 }, {
        rotation: 0, duration: 0.6, ease: 'elastic.out(1, 0.4)'
      });
    }

    // 主旋转 GSAP tween
    gsap.to(wheelRotor, {
      rotation: `+=${finalAngle}`,
      svgOrigin: '160 160',  // 绕 SVG 中心旋转
      duration: 4.5,
      ease: 'power4.out',  // 强减速（像真转盘停下）
      onComplete: () => {
        const prize = PRIZES[targetIndex];
        // 错开：先 addWheelHistory（DOM 写入），再 setTimeout 0 推一帧调 showLuckyModal
        addWheelHistory(prize);
        setTimeout(() => {
          try {
            showLuckyModal(prize);
          } catch (e) {
            console.error('showLuckyModal error:', e);
          }
        }, 0);
        wheelBusy = false;
      }
    });
  }

  document.querySelectorAll('[data-wheel]').forEach(btn => {
    btn.addEventListener('click', () => {
      const times = parseInt(btn.dataset.wheel, 10);
      spinWheel(times);
    });
  });

  function addWheelHistory(prize) {
    const list = document.getElementById('wheelHistory');
    if (!list) return;
    const rarityColor = {
      'N':   'rgba(26, 34, 56, 0.5)',
      'R':   '#07C160',
      'SR':  '#1FB6FF',
      'SSR': '#E54B4B'
    }[prize.rarity] || 'rgba(26, 34, 56, 0.5)';
    const item = document.createElement('div');
    item.className = 'wheel-history__item';
    item.innerHTML = `
      <span class="wheel-history__prize" style="color: ${rarityColor}">${prize.rarity} · ${prize.name}</span>
      <span class="wheel-history__time">刚刚</span>
    `;
    list.insertBefore(item, list.firstChild);
    // 更新计数
    const cnt = list.parentElement.querySelector('.wheel-history__count');
    if (cnt) {
      const m = cnt.textContent.match(/\d+/);
      if (m) cnt.textContent = `本场 ${parseInt(m[0], 10) + 1} 次`;
    }
  }

  /* ---------- 4. Modal 通用 ---------- */
  function openModal(id) {
    const m = document.getElementById(id);
    if (m) {
      m.classList.add('is-open');
      m.style.pointerEvents = 'auto';
    }
  }
  function closeModal(m) {
    m.classList.remove('is-open');
    m.style.pointerEvents = 'none';
  }
  document.querySelectorAll('[data-modal-close]').forEach(btn => {
    btn.addEventListener('click', () => {
      const m = btn.closest('.modal');
      if (m) closeModal(m);
    });
  });
  // 点击遮罩关闭
  document.querySelectorAll('.modal').forEach(m => {
    m.addEventListener('click', e => {
      if (e.target === m) closeModal(m);
    });
  });

  /* ---------- 5. 认购 modal ---------- */
  /* ---------- 5. 认购 / 购买 modal（超级 AI 老板认购 + 用户按等级购买） ---------- */
  const SALES_TIERS = [
    { id: 'NU',  cn: 'NU',  en: 'NEW USER',     discount: '原价', price: 6.0, color: '' },
    { id: 'VIP', cn: 'VIP', en: 'VIP',          discount: '9 折', price: 5.4, color: '--green' },
    { id: 'MN',  cn: 'MN',  en: 'MANAGER',      discount: '8 折', price: 4.8, color: '--purple' },
    { id: 'MB',  cn: 'MB',  en: 'MEMBER BLACK', discount: '7 折', price: 4.2, color: '--gold' }
  ];
  const CURRENT_TIER = 'MB';  // 当前用户等级

  document.querySelectorAll('[data-buy]').forEach(btn => {
    btn.addEventListener('click', () => {
      const kind = btn.dataset.buy;
      if (kind === 'pool') {
        // 超级 AI 老板认购
        const amount = 100;  // 万 Token 默认 100
        const total = (amount / 100) * 3.6;
        const amountEl = document.getElementById('buyPoolAmount');
        const totalEl = document.getElementById('buyPoolTotal');
        if (amountEl) amountEl.textContent = amount;
        if (totalEl) totalEl.textContent = total.toFixed(1) + ' USDT';
        openModal('buyPoolModal');
      } else if (kind === 'sales') {
        // 用户按等级购买
        const tier = SALES_TIERS.find(t => t.id === CURRENT_TIER);
        const amount = 50;  // 万 Token 默认 50（最低 50）
        const total = (amount / 100) * tier.price;
        const amountEl = document.getElementById('buySalesAmount');
        const totalEl = document.getElementById('buySalesTotal');
        const tierEl = document.getElementById('buySalesTier');
        const priceEl = document.getElementById('buySalesUnitPrice');
        if (amountEl) amountEl.textContent = amount;
        if (tierEl) tierEl.textContent = tier.cn + ' · ' + tier.discount;
        if (priceEl) priceEl.textContent = tier.price.toFixed(1) + ' USDT / 100 万 Token';
        if (totalEl) totalEl.textContent = total.toFixed(1) + ' USDT';
        openModal('buySalesModal');
      }
    });
  });

  // 确认认购（超级 AI 老板）
  document.getElementById('buyPoolConfirm')?.addEventListener('click', () => {
    closeModal(document.getElementById('buyPoolModal'));
    const balanceEl = document.getElementById('userBalance');
    if (balanceEl) {
      balanceEl.style.transition = 'color 600ms';
      balanceEl.style.color = '#E54B4B';
      setTimeout(() => { balanceEl.style.color = ''; }, 1200);
    }
    // 模拟：认购明细 prepend 一条（用统一 pushBuyerItem）
    const amountInput = document.getElementById('buyPoolAmountInput');
    const amount = amountInput ? parseInt(amountInput.value, 10) : 100;
    pushBuyerItem({
      avatarBg: 'linear-gradient(135deg, #1A2238, #4A5688)',
      initial: '您',
      name: '您（超级 AI 老板）',
      amount: amount,
      sub: '刚刚 · 认购成功'
    });
  });

  // 确认购买（用户按等级）
  document.getElementById('buySalesConfirm')?.addEventListener('click', () => {
    closeModal(document.getElementById('buySalesModal'));
    const balanceEl = document.getElementById('userBalance');
    if (balanceEl) {
      balanceEl.style.transition = 'color 600ms';
      balanceEl.style.color = '#07C160';
      setTimeout(() => { balanceEl.style.color = ''; }, 1200);
    }
  });

  // 点击 sales-tier 卡片：可选择等级（demo: 仅提示 + selected 状态）
  document.querySelectorAll('.sales-tier').forEach(tier => {
    tier.addEventListener('click', () => {
      document.querySelectorAll('.sales-tier').forEach(t => t.classList.remove('is-current'));
      tier.classList.add('is-current');
      const tierId = tier.dataset.tier;
      const tierData = SALES_TIERS.find(t => t.id === tierId);
      if (tierData) {
        // 更新当前价格（picker 动态读这个值）
        currentSalesPrice = tierData.price;
        const tierEl = document.getElementById('buySalesTier');
        const priceEl = document.getElementById('buySalesUnitPrice');
        if (tierEl) tierEl.textContent = tierData.cn + ' · ' + tierData.discount;
        if (priceEl) priceEl.textContent = tierData.price.toFixed(1) + ' USDT / 100 万 Token';
        // 触发 picker updateTotal 刷新"应付 USDT"
        const salesModal = document.getElementById('buySalesModal');
        if (salesModal && salesModal._pickerUpdate) salesModal._pickerUpdate();
      }
    });
  });

  /* ---------- 6.5 认购池 - 8s 轮播 + GSAP 滑入 ---------- */
  const AI_BUYERS = [
    { initial: 'A', avatar: 'linear-gradient(135deg, #7C5CFF, #B695FF)', name: 'Atlas AI · 王总',   amounts: [80, 150, 200, 120] },
    { initial: 'L', avatar: 'linear-gradient(135deg, #FFD700, #FF8C42)', name: 'Lexicon · 李博士',   amounts: [100, 180, 90, 150] },
    { initial: 'G', avatar: 'linear-gradient(135deg, #07C160, #4DD890)', name: 'Genesis · 周总',     amounts: [60, 150, 100, 80] },
    { initial: 'N', avatar: 'linear-gradient(135deg, #E54B4B, #FF7B7B)', name: 'Nexus · 陈总',       amounts: [120, 90, 110, 200] },
    { initial: 'C', avatar: 'linear-gradient(135deg, #1FB6FF, #6DD5FA)', name: 'Cognitive · 赵博士', amounts: [100, 50, 80, 150] },
    { initial: 'Q', avatar: 'linear-gradient(135deg, #9B59B6, #C39BD3)', name: 'Quantum · 孙博士',   amounts: [70, 130, 200, 100] },
    { initial: 'H', avatar: 'linear-gradient(135deg, #16A085, #48C9B0)', name: 'Helix · 周经理',     amounts: [150, 90, 60, 120] },
    { initial: 'V', avatar: 'linear-gradient(135deg, #34495E, #5D6D7E)', name: 'Vertex · 林总',      amounts: [80, 100, 120, 180] },
    { initial: 'O', avatar: 'linear-gradient(135deg, #D35400, #E67E22)', name: 'Orion · 吴经理',     amounts: [200, 100, 150, 90] },
    { initial: 'P', avatar: 'linear-gradient(135deg, #2C3E50, #5D6D7E)', name: 'Prism · 郑总',       amounts: [100, 80, 110, 130] }
  ];
  const POOL_MAX_ITEMS = 8;

  function pushBuyerItem(data) {
    const list = document.getElementById('poolBuyers');
    if (!list) return;
    const item = document.createElement('div');
    item.className = 'pool-buyer';
    item.innerHTML = '<div class="pool-buyer__avatar" style="background: ' + data.avatarBg + ';">' + data.initial + '</div>' +
      '<div class="pool-buyer__body">' +
        '<div class="pool-buyer__row">' +
          '<span class="pool-buyer__name">' + data.name + '</span>' +
          '<span class="pool-buyer__amount">' + data.amount + ' 万 Token</span>' +
        '</div>' +
        '<div class="pool-buyer__sub">' + data.sub + '</div>' +
      '</div>';
    list.insertBefore(item, list.firstChild);

    if (typeof gsap !== 'undefined') {
      gsap.fromTo(item,
        { opacity: 0, x: -20, height: 0, paddingTop: 0, paddingBottom: 0, marginTop: 0, marginBottom: 0 },
        { opacity: 1, x: 0, height: 'auto', duration: 0.55, ease: 'power3.out',
          onComplete: function() {
            item.style.height = '';
            item.style.paddingTop = '';
            item.style.paddingBottom = '';
            item.style.marginTop = '';
            item.style.marginBottom = '';
          }
        }
      );
    }

    while (list.children.length > POOL_MAX_ITEMS) {
      const last = list.lastElementChild;
      if (!last) break;
      if (typeof gsap !== 'undefined') {
        gsap.killTweensOf(last);
        gsap.to(last, {
          opacity: 0, x: 20, height: 0, paddingTop: 0, paddingBottom: 0, marginTop: 0, marginBottom: 0,
          duration: 0.3, ease: 'power2.in',
          onComplete: function() { last.remove(); }
        });
      } else {
        last.remove();
      }
      break;
    }

    const count = document.querySelector('.pool-buyers__count');
    if (count) {
      const cur = list.querySelectorAll('.pool-buyer').length;
      count.textContent = '本场 ' + cur + ' 笔';
    }
  }

  let buyerIdx = 0;
  setInterval(function() {
    const buyer = AI_BUYERS[buyerIdx % AI_BUYERS.length];
    buyerIdx++;
    const amount = buyer.amounts[Math.floor(Math.random() * buyer.amounts.length)];
    pushBuyerItem({
      avatarBg: buyer.avatar,
      initial: buyer.initial,
      name: buyer.name,
      amount: amount,
      sub: '刚刚 · 自动认购'
    });
  }, 8000);

  /* ---------- 6.6 数量选择器 (amount-picker) ---------- */
  function setupAmountPicker(modalId, priceOrFn, prefix) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    const input = modal.querySelector('.amount-picker__input');
    const stepBtns = modal.querySelectorAll('.amount-picker__btn');
    const quickBtns = modal.querySelectorAll('.amount-picker__quick button');
    const totalEl = document.getElementById(prefix + 'Total');
    const amountLabel = document.getElementById(prefix + 'Amount');

    function getPrice() {
      return typeof priceOrFn === 'function' ? priceOrFn() : priceOrFn;
    }

    function updateTotal() {
      let amount = parseInt(input.value, 10);
      if (isNaN(amount)) amount = 50;
      if (amount < 50) amount = 50;
      if (amount % 10 !== 0) amount = Math.round(amount / 10) * 10;
      input.value = amount;
      const total = (amount / 100) * getPrice();
      if (totalEl) totalEl.textContent = total.toFixed(2) + ' USDT';
      if (amountLabel) amountLabel.textContent = amount + ' 万 Token';
      quickBtns.forEach(function(b) {
        if (parseInt(b.dataset.amount, 10) === amount) b.classList.add('is-active');
        else b.classList.remove('is-active');
      });
    }

    if (input) {
      input.addEventListener('input', updateTotal);
      input.addEventListener('change', updateTotal);
    }
    stepBtns.forEach(function(btn) {
      btn.addEventListener('click', function() {
        const step = parseInt(btn.dataset.step, 10);
        let amount = parseInt(input.value, 10) || 100;
        amount = Math.max(50, amount + step);
        amount = Math.round(amount / 10) * 10;
        input.value = amount;
        updateTotal();
      });
    });
    quickBtns.forEach(function(btn) {
      btn.addEventListener('click', function() {
        input.value = btn.dataset.amount;
        updateTotal();
      });
    });
    // 暴露 updateTotal 给外部（点 tier 卡片时刷新）
    if (modal._pickerUpdate !== undefined) return;
    modal._pickerUpdate = updateTotal;
    updateTotal();
  }

  // 认购池 picker（固定价格 3.6 USDT）
  setupAmountPicker('buyPoolModal', 3.6, 'buyPool');

  // 销售池 picker（动态价格：根据当前选择等级）
  let currentSalesPrice = 4.2;  // 默认 MB 等级价格
  setupAmountPicker('buySalesModal', function() { return currentSalesPrice; }, 'buySales');

  /* ---------- 6. 中奖 modal ---------- */
  function showLuckyModal(prize) {
    const rarityEl = document.getElementById('luckyRarity');
    const iconEl = document.getElementById('luckyIcon');
    const nameEl = document.getElementById('luckyName');
    const descEl = document.getElementById('luckyDesc');
    if (rarityEl) {
      rarityEl.textContent = prize.rarity;
      rarityEl.style.background = prize.rarity === 'SSR' ? 'linear-gradient(135deg, #FFD700, #FF8C42)'
        : prize.rarity === 'SR' ? 'linear-gradient(135deg, #7C5CFF, #B695FF)'
        : prize.rarity === 'R' ? 'linear-gradient(135deg, #07C160, #4DD890)'
        : 'linear-gradient(135deg, #8B8B9E, #B4B4C8)';
    }
    if (iconEl) iconEl.textContent = prize.icon;
    if (nameEl) nameEl.textContent = prize.name;
    if (descEl) {
      const valueMap = {
        'Token ×10': '+10 Token（已到账）',
        '算力 ×2': '+2,000 算力（已到账）',
        'Token ×50': '+50 Token（已到账）',
        '算力 ×5': '+5,000 算力（已到账）',
        'Token ×200': '+200 Token（已到账）',
        '算力 ×10': '+10,000 算力（已到账）',
        'Token ×500': '+500 Token（已到账）',
        '算力 ×50': '+50,000 算力（已到账）'
      };
      descEl.textContent = valueMap[prize.name] || '已到账';
    }
    openModal('luckyModal');

    // GSAP 入场动效 - 错落弹性
    const card = document.querySelector('#luckyModal .modal__card');
    if (card && typeof gsap !== 'undefined') {
      gsap.killTweensOf(card);
      // 整体 card 弹性入场
      gsap.fromTo(card,
        { scale: 0.7, opacity: 0, y: 20 },
        { scale: 1, opacity: 1, y: 0, duration: 0.55, ease: 'back.out(1.6)' }
      );
      // 徽章从 0 弹入
      if (rarityEl) {
        gsap.fromTo(rarityEl, { scale: 0 }, {
          scale: 1, duration: 0.5, delay: 0.2, ease: 'back.out(2)'
        });
      }
      // 图标旋转 + 缩放入场
      if (iconEl) {
        gsap.fromTo(iconEl, { scale: 0, rotation: -180 }, {
          scale: 1, rotation: 0, duration: 0.8, delay: 0.3, ease: 'back.out(1.7)'
        });
      }
      // 名称（数字）从下方滑入
      if (nameEl) {
        gsap.fromTo(nameEl, { y: 30, opacity: 0 }, {
          y: 0, opacity: 1, duration: 0.5, delay: 0.4, ease: 'power3.out'
        });
      }
      // 描述延迟淡入
      if (descEl) {
        gsap.fromTo(descEl, { y: 10, opacity: 0 }, {
          y: 0, opacity: 1, duration: 0.4, delay: 0.55, ease: 'power2.out'
        });
      }
    }
  }

  document.getElementById('luckyAgain')?.addEventListener('click', () => {
    closeModal(document.getElementById('luckyModal'));
    setTimeout(() => spinWheel(1), 300);
  });

  /* ---------- 8. 实时动态（每 8 秒加一条）---------- */
  const feedTemplates = [
    { type: 'buy',     name: '孙先生', initial: 'S', avatar: 'green',  action: '认购了',   amount: '100 Token',   sub: '入门档 · +1,000 算力' },
    { type: 'upgrade', name: '周总',   initial: 'Z', avatar: 'blue',   action: '升级到',   amount: '黑金',         sub: '¥2,499/月 · 无限算力' },
    { type: 'lucky',   name: '吴女士', initial: 'W', avatar: 'purple', action: '盲盒开出', amount: 'SSR · 算力 ×5', sub: '10 连抽 · 价值 25,000 算力' },
    { type: 'buy',     name: '郑老板', initial: 'Z', avatar: 'orange', action: '认购了',   amount: '500 Token',   sub: '进阶档 · +5,500 算力' }
  ];

  const avatarColorMap = {
    'blue': 'feed-item__avatar--blue',
    'purple': 'feed-item__avatar--purple',
    'gold': 'feed-item__avatar--gold',
    'green': 'feed-item__avatar--green',
    'orange': 'feed-item__avatar--orange',
    'black': 'feed-item__avatar--black'
  };

  let feedIdx = 0;
  setInterval(() => {
    const tpl = feedTemplates[feedIdx % feedTemplates.length];
    feedIdx++;
    const feed = document.getElementById('liveFeed');
    if (!feed) return;
    // 移除 empty state（如有）
    const empty = feed.querySelector('.feed-empty');
    if (empty) empty.remove();
    const item = document.createElement('div');
    item.className = 'feed-item';
    item.setAttribute('data-type', tpl.type);
    item.innerHTML = `
      <div class="feed-item__avatar ${avatarColorMap[tpl.avatar]}">${tpl.initial}</div>
      <div class="feed-item__body">
        <div class="feed-item__row">
          <span class="feed-item__name">${tpl.name}</span>
          <span class="feed-item__action">${tpl.action}</span>
          <span class="feed-item__amount">${tpl.amount}</span>
        </div>
        <div class="feed-item__sub">${tpl.sub}</div>
      </div>
      <div class="feed-item__time">刚刚</div>
    `;
    feed.insertBefore(item, feed.firstChild);
    // 删除末尾超过 8 条的
    while (feed.children.length > 8) {
      feed.removeChild(feed.lastChild);
    }
  }, 8000);

  // 持续装饰：转盘中心装饰光晕脉冲 (GSAP yoyo breathing)
  if (typeof gsap !== 'undefined') {
    const centerGlow = document.querySelector('.wheel__svg circle[fill*="wheelGlow"]');
    if (centerGlow) {
      gsap.to(centerGlow, {
        attr: { r: 42 },
        duration: 1.8,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });
    }

    // 实时动态新条 slide-in (用 GSAP 替代 CSS animation)
    const feedObserver = new MutationObserver(mutations => {
      mutations.forEach(m => {
        m.addedNodes.forEach(node => {
          if (node.classList && node.classList.contains('feed-item')) {
            gsap.fromTo(node,
              { opacity: 0, y: -8, scale: 0.96 },
              { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'power3.out' }
            );
          }
        });
      });
    });
    const feedList = document.getElementById('liveFeed');
    if (feedList) {
      feedObserver.observe(feedList, { childList: true });
    }
  }
});
