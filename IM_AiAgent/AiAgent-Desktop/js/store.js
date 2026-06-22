/* ========================================
   store.js — 全局响应式数据层
   M1-B 数据层 · 纯前端内存 Mock
   ======================================== */

(function () {
  'use strict';

  /* === Proxy 响应式：浅包装（够 M1 用） === */
  function createReactive(obj, onChange) {
    const handler = {
      get(target, key) {
        const v = target[key];
        // 数组也包装，让 push/pop/splice 能触发 set trap → notify
        return (typeof v === 'object' && v !== null)
          ? new Proxy(v, handler)
          : v;
      },
      set(target, key, value) {
        const old = target[key];
        target[key] = value;
        if (old !== value) {
          try { onChange && onChange(key, value, old); } catch (e) { console.error('[store] onChange error:', e); }
        }
        return true;
    } };
    return new Proxy(obj, handler);
  }

  /* === 订阅中心 === */
  const _listeners = new Set();
  function notify(scope) {
    _listeners.forEach((fn) => { try { fn(scope); } catch (e) { console.error('[store] listener error:', e); } });
  }

  /* ============================================
     初始 Mock 数据 — 硬编码，不 fetch 不 DB
     ============================================ */

  // 用户（MVP 默认 VIP，方便演示折扣）
  const initialUser = {
    id: 'michael',
    nickname: 'Michael',
    avatar: 'M',
    level: 'VIP',                     // NU / VIP / MN / MB
    levelExpireAt: '2026-12-31',
    registerAt: '2026-06-01'
  };

  // Token 钱包（PRD §8.5）
  const initialWallet = {
    freeBalance: 1000000,             // 新用户免费包
    paidBalance: 0,                   // 平台购买
    lockedBalance: 0,                 // 挂单/服务中锁定
    monthlyGift: {
      quota: 500000,                  // VIP 50 万
      used: 0,
      resetAt: '2026-07-01'
    },
    consumed: 0,                      // 累计消耗
    history: []                       // 交易记录
  };

  // UMDT 钱包
  const initialUmdt = {
    balance: 1000,                    // MVP 起始 UMDT
    history: []
  };

  // 雇佣记录（M1 阶段空，M4 写入）
  const initialHires = {
    active: [],                       // 进行中
    history: []                       // 历史
  };

  // 用户市场挂单（M2 阶段用到，M1 先建空结构）
  const initialOrders = {
    list: [],                         // 所有挂单
    mine: []                          // 我的挂单
  };

  /* === 导出全局 store（Proxy 单例） === */
  window.userStore   = createReactive(initialUser,   (k) => notify('user'));
  window.walletStore = createReactive(initialWallet, (k) => notify('wallet'));
  window.umdtStore   = createReactive(initialUmdt,   (k) => notify('umdt'));
  window.hireStore   = createReactive(initialHires,  (k) => notify('hire'));
  window.orderStore  = createReactive(initialOrders, (k) => notify('order'));

  /* === 订阅 API === */
  window.subscribeStore = function (fn) {
    _listeners.add(fn);
    return () => _listeners.delete(fn);
  };

  /* ============================================
     钱包业务方法（PRD §8.2/8.4/8.5 + BR-WAL-002/003）
     ============================================ */
  window.walletActions = {

    /** 可用余额 = 月赠剩余 + paid + free（locked 不算可用） */
    available() {
      const w = window.walletStore;
      const monthlyRemaining = Math.max(0, w.monthlyGift.quota - w.monthlyGift.used);
      return monthlyRemaining + w.paidBalance + w.freeBalance;
    },

    /** 月赠剩余 */
    monthlyRemaining() {
      const w = window.walletStore;
      return Math.max(0, w.monthlyGift.quota - w.monthlyGift.used);
    },

    /** 扣 Token：月赠 → paid → free 优先级（PRD §8.2） */
    consumeToken(amount, source) {
      if (!Number.isFinite(amount) || amount <= 0) return false;
      source = source || 'assistant';

      const w = window.walletStore;
      if (this.available() < amount) return false;     // BR-WAL-001 余额校验

      let remaining = amount;

      // 1) 月赠
      const monthlyRemain = this.monthlyRemaining();
      const fromMonthly = Math.min(remaining, monthlyRemain);
      w.monthlyGift.used += fromMonthly;
      remaining -= fromMonthly;

      // 2) paid
      const fromPaid = Math.min(remaining, w.paidBalance);
      w.paidBalance -= fromPaid;
      remaining -= fromPaid;

      // 3) free
      w.freeBalance -= remaining;

      // 累计消耗 + 记录
      w.consumed += amount;
      this._pushHistory({
        type: 'consume',
        tokenAmount: -amount,
        umdtAmount: 0,
        counterparty: source,
        status: 'success',
        note: '调用 ' + source + ' 消耗 ' + amount.toLocaleString('en-US') + ' Token'
      });
      return true;
    },

    /** 平台市场购买 Token：扣 UMDT，加 paid */
    buyPlatformToken(tokenAmount, umdtCost, packageName) {
      const u = window.umdtStore;
      if (u.balance < umdtCost) return { ok: false, reason: 'UMDT 不足' };

      u.balance -= umdtCost;
      u.history.push({
        id: 'u' + Date.now(),
        time: new Date().toISOString(),
        type: 'pay',
        umdtAmount: -umdtCost,
        note: '购买 ' + packageName
      });

      window.walletStore.paidBalance += tokenAmount;
      this._pushHistory({
        type: 'buy',
        tokenAmount: tokenAmount,
        umdtAmount: -umdtCost,
        counterparty: '平台市场',
        status: 'success',
        note: '购买 ' + packageName
      });
      return { ok: true };
    },

    /** 锁定 Token（挂单/专家服务占用） */
    lockToken(amount, note) {
      if (this.available() < amount) return false;
      const w = window.walletStore;
      // 按月赠→paid→free 顺序锁定（与 consumeToken 一致）
      let remaining = amount;
      const monthlyRemain = this.monthlyRemaining();
      const fromMonthly = Math.min(remaining, monthlyRemain);
      w.monthlyGift.used += fromMonthly;
      remaining -= fromMonthly;
      const fromPaid = Math.min(remaining, w.paidBalance);
      w.paidBalance -= fromPaid;
      remaining -= fromPaid;
      w.freeBalance -= remaining;
      w.lockedBalance += amount;
      this._pushHistory({
        type: 'lock',
        tokenAmount: -amount,
        counterparty: note || '锁定',
        status: 'success',
        note: note || 'Token 锁定'
      });
      return true;
    },

    /** 释放锁定 Token */
    releaseLocked(amount, note) {
      const w = window.walletStore;
      if (w.lockedBalance < amount) return false;
      w.lockedBalance -= amount;
      // 默认释放到 freeBalance（M2 阶段区分场景）
      w.freeBalance += amount;
      this._pushHistory({
        type: 'release',
        tokenAmount: amount,
        counterparty: note || '释放',
        status: 'success',
        note: note || '锁定 Token 释放'
      });
      return true;
    },

    /** 充值 UMDT（Mock） */
    rechargeUMDT(amount) {
      if (!Number.isFinite(amount) || amount <= 0) return false;
      window.umdtStore.balance += amount;
      window.umdtStore.history.push({
        id: 'u' + Date.now(),
        time: new Date().toISOString(),
        type: 'recharge',
        umdtAmount: amount,
        note: 'Mock 充值 +' + amount.toLocaleString('en-US') + ' UMDT'
      });
      return true;
    },

    /** 内部：写入 history 一条 */
    _pushHistory(entry) {
      window.walletStore.history.push({
        id: 'h' + Date.now() + Math.floor(Math.random() * 1000),
        time: new Date().toISOString(),
        ...entry
      });
    }
  };

  /* ============================================
     会员业务方法（M5 阶段用到，M1 先建空接口）
     ============================================ */
  window.membershipActions = {
    /** 是否能雇佣某档位专家 */
    canHireTier(tier) {
      const level = window.userStore.level;
      const tierMap = { NU: [], VIP: ['junior'], MN: ['junior', 'mid'], MB: ['junior', 'mid', 'top'] };
      return (tierMap[level] || []).includes(tier);
    },

    /** 是否有挂单出售权限 */
    canSellToken() {
      return window.userStore.level === 'MB';
    },

    /** 升级（Mock 扣 UMDT 升级） */
    upgrade(targetLevel, umdtCost) {
      const u = window.umdtStore;
      if (u.balance < umdtCost) return { ok: false, reason: 'UMDT 不足' };
      u.balance -= umdtCost;
      const old = window.userStore.level;
      window.userStore.level = targetLevel;
      // 月赠按新等级重新发放（M1 简化：直接覆盖 quota，used 清零）
      // 月赠 Token 终值（老板 2026-06-20 确认）：NU20万/VIP50万/MN150万/MB200万
      const monthlyMap = { NU: 200000, VIP: 500000, MN: 1500000, MB: 2000000 };
      window.walletStore.monthlyGift.quota = monthlyMap[targetLevel] || 0;
      window.walletStore.monthlyGift.used = 0;
      // 写记录
      window.walletStore.history.push({
        id: 'h' + Date.now(),
        time: new Date().toISOString(),
        type: 'upgrade',
        tokenAmount: 0,
        umdtAmount: -umdtCost,
        counterparty: '会员中心',
        status: 'success',
        note: '会员升级：' + old + ' → ' + targetLevel
      });
      return { ok: true };
    }
  };

  /* ============================================
     控制台调试快捷入口（M1 演示用，方便你测试）
     ============================================ */
  // window.resetStore = function() { location.reload(); };

  console.info('[store] 全局 store 已就绪（纯 Mock，无网络请求）');
  console.info('  - window.walletStore / umdtStore / userStore / hireStore / orderStore');
  console.info('  - window.walletActions.available() / consumeToken(500) / rechargeUMDT(500)');
  console.info('  - window.subscribeStore(fn) 订阅变更');

})();