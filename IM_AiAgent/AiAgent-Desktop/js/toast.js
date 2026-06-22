/* ========================================
   toast.js — 统一 Toast + Dialog 组件
   替换 alert / chat-panel 内嵌 showToast
   资源不足快捷引导：Token / UMDT / 等级
   ======================================== */

(function () {
  'use strict';

  /* ========================================
     Toast — 右上角浮层
     ======================================== */
  let toastLayer = null;
  function ensureToastLayer() {
    if (toastLayer && document.body.contains(toastLayer)) return toastLayer;
    toastLayer = document.createElement('div');
    toastLayer.id = 'toastLayer';
    toastLayer.className = 'toast-layer';
    document.body.appendChild(toastLayer);
    return toastLayer;
  }

  /**
   * showToast(msg, opts?)
   * opts: { type: 'success'|'error'|'info'|'warning', action: { label, onClick }, duration: ms }
   */
  window.showToast = function (msg, opts) {
    opts = opts || {};
    const type = opts.type || 'info';
    const action = opts.action || null;
    const duration = typeof opts.duration === 'number' ? opts.duration : 4000;

    const layer = ensureToastLayer();
    const el = document.createElement('div');
    el.className = 'toast-item toast-' + type;
    el.setAttribute('role', 'status');

    const iconChar = ({ success: '✓', error: '✕', info: 'ℹ', warning: '⚠' })[type] || 'ℹ';

    el.innerHTML =
      '<span class="toast-icon">' + iconChar + '</span>' +
      '<span class="toast-msg"></span>' +
      (action ? '<button class="toast-action" type="button"></button>' : '');

    // 安全填文本
    el.querySelector('.toast-msg').textContent = String(msg);
    if (action) el.querySelector('.toast-action').textContent = action.label;

    layer.appendChild(el);
    // 进场动画（下一帧）
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        el.classList.add('is-in');
      });
    });

    let dismissed = false;
    function dismiss() {
      if (dismissed) return;
      dismissed = true;
      el.classList.remove('is-in');
      el.classList.add('is-out');
      setTimeout(function () { el.remove(); }, 320);
    }

    const timer = setTimeout(dismiss, duration);

    if (action) {
      const btn = el.querySelector('.toast-action');
      btn.addEventListener('click', function () {
        clearTimeout(timer);
        try { action.onClick && action.onClick(); } catch (e) { console.error('[toast] action error:', e); }
        dismiss();
      });
    }
    return el;
  };

  /* ========================================
     Dialog — 居中弹窗
     ======================================== */
  let activeDialog = null;
  window.showDialog = function (opts) {
    opts = opts || {};
    const title = opts.title || '';
    const content = opts.content || '';
    const actions = Array.isArray(opts.actions) ? opts.actions : [];
    const onClose = opts.onClose || null;
    const dismissible = opts.dismissible !== false;   // 默认可点遮罩关闭

    // 关闭已有 dialog
    if (activeDialog) {
      activeDialog._forceClose = true;
      activeDialog.root.remove();
    }

    const overlay = document.createElement('div');
    overlay.className = 'dialog-overlay';

    const card = document.createElement('div');
    card.className = 'dialog-card';
    card.setAttribute('role', 'dialog');
    card.setAttribute('aria-modal', 'true');

    card.innerHTML =
      (title ? '<h3 class="dialog-title"></h3>' : '') +
      '<div class="dialog-content"></div>' +
      '<div class="dialog-actions">' +
        actions.map(function (_, i) {
          return '<button class="dialog-btn" type="button" data-i="' + i + '"></button>';
        }).join('') +
      '</div>';

    if (title) card.querySelector('.dialog-title').textContent = title;
    // content 支持 HTML（调用方可控）；用 innerHTML 渲染
    const contentEl = card.querySelector('.dialog-content');
    if (typeof content === 'string') {
      contentEl.innerHTML = content;
    } else if (content instanceof HTMLElement) {
      contentEl.appendChild(content);
    }
    actions.forEach(function (a, i) {
      const btn = card.querySelector('[data-i="' + i + '"]');
      btn.textContent = a.label || ('按钮' + (i + 1));
      if (a.primary) btn.classList.add('is-primary');
      btn.addEventListener('click', function () {
        try { a.onClick && a.onClick(); } catch (e) { console.error('[dialog] action error:', e); }
        close();
      });
    });

    overlay.appendChild(card);
    document.body.appendChild(overlay);
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { overlay.classList.add('is-in'); });
    });

    function close() {
      overlay.classList.remove('is-in');
      setTimeout(function () {
        if (!overlay._forceClose && overlay.parentNode) overlay.remove();
        if (activeDialog && activeDialog.root === overlay) activeDialog = null;
        onClose && onClose();
      }, 240);
    }

    if (dismissible) {
      overlay.addEventListener('click', function (e) {
        if (e.target === overlay) close();
      });
      // Esc 关闭
      function escHandler(e) {
        if (e.key === 'Escape') { close(); document.removeEventListener('keydown', escHandler); }
      }
      document.addEventListener('keydown', escHandler);
    }

    activeDialog = { root: overlay, close: close };
    return { close: close, root: overlay };
  };

  /* ========================================
     资源不足快捷引导（PRD §14.2）
     ======================================== */
  function goTab(tabName) {
    if (typeof window.appNavigate === 'function') window.appNavigate(tabName);
  }

  window.showTokenShortage = function () {
    return window.showToast('Token 不足，请前往算力中心', {
      type: 'error',
      action: { label: '前往算力中心', onClick: function () { goTab('compute-hub'); } }
    });
  };

  window.showUMDTShortage = function () {
    return window.showToast('UMDT 不足，请前往充值', {
      type: 'error',
      action: { label: '前往充值', onClick: function () { goTab('compute-hub'); } }
    });
  };

  window.showLevelShortage = function (needLevel) {
    return window.showToast('需要 ' + needLevel + ' 会员才能使用该功能', {
      type: 'warning',
      action: { label: '前往会员中心', onClick: function () { goTab('membership'); } }
    });
  };

  console.info('[toast] 全局 Toast / Dialog 已就绪');
  console.info('  - window.showToast(msg, { type, action })');
  console.info('  - window.showDialog({ title, content, actions })');
  console.info('  - window.showTokenShortage() / showUMDTShortage() / showLevelShortage(level)');

})();