/* ========================================
 * 平台管理后台 · 共享交互
 * Toast / Modal / Confirm / Filter / Sort /
 * rowClick / countUp / countdown / relativeTime
 * vanilla JS · 无外部依赖
 * ======================================== */
(function () {
  'use strict';

  // === 内部样式注入（仅一次） ===
  const STYLE_ID = 'admin-interactions-styles';
  if (!document.getElementById(STYLE_ID)) {
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      /* Toast */
      .aui-toast-container {
        position: fixed;
        top: 16px;
        right: 16px;
        z-index: 99999;
        display: flex;
        flex-direction: column;
        gap: 8px;
        pointer-events: none;
      }
      .aui-toast {
        min-width: 280px;
        max-width: 420px;
        background: #FFFFFF;
        border: 1px solid var(--border-default, #E4E4E7);
        border-left: 3px solid var(--text-tertiary, #71717A);
        border-radius: var(--radius-sm, 4px);
        padding: 10px 14px;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
        display: flex;
        align-items: flex-start;
        gap: 10px;
        font-size: 13px;
        color: var(--text-primary, #18181B);
        pointer-events: auto;
        animation: aui-toast-in 0.2s ease;
      }
      .aui-toast.removing { animation: aui-toast-out 0.2s ease forwards; }
      .aui-toast.success { border-left-color: #10B981; }
      .aui-toast.success .aui-toast-icon { color: #10B981; }
      .aui-toast.info { border-left-color: #3B82F6; }
      .aui-toast.info .aui-toast-icon { color: #3B82F6; }
      .aui-toast.warning { border-left-color: #F59E0B; }
      .aui-toast.warning .aui-toast-icon { color: #F59E0B; }
      .aui-toast.error { border-left-color: #DC2626; }
      .aui-toast.error .aui-toast-icon { color: #DC2626; }
      .aui-toast-icon {
        font-size: 16px;
        line-height: 1.2;
        flex-shrink: 0;
        font-weight: 600;
      }
      .aui-toast-body { flex: 1; line-height: 1.5; }
      .aui-toast-title {
        font-weight: 600;
        margin-bottom: 2px;
        color: var(--text-primary, #18181B);
      }
      .aui-toast-msg {
        font-size: 12px;
        color: var(--text-secondary, #52525B);
      }
      .aui-toast-close {
        background: transparent;
        border: 0;
        color: var(--text-tertiary, #71717A);
        cursor: pointer;
        font-size: 16px;
        line-height: 1;
        padding: 0;
        margin-left: 4px;
        flex-shrink: 0;
      }
      .aui-toast-close:hover { color: var(--text-primary, #18181B); }
      @keyframes aui-toast-in {
        from { transform: translateX(20px); opacity: 0; }
        to   { transform: translateX(0); opacity: 1; }
      }
      @keyframes aui-toast-out {
        from { transform: translateX(0); opacity: 1; }
        to   { transform: translateX(20px); opacity: 0; }
      }

      /* Modal */
      .aui-modal-mask {
        position: fixed;
        inset: 0;
        background: rgba(24, 24, 27, 0.4);
        z-index: 9999;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 24px;
        animation: aui-fade-in 0.15s ease;
      }
      .aui-modal {
        background: #FFFFFF;
        border-radius: var(--radius-md, 8px);
        box-shadow: 0 16px 48px rgba(0, 0, 0, 0.16);
        width: 100%;
        max-height: calc(100vh - 48px);
        display: flex;
        flex-direction: column;
        animation: aui-modal-in 0.2s ease;
        overflow: hidden;
      }
      .aui-modal.sm { max-width: 380px; }
      .aui-modal.md { max-width: 540px; }
      .aui-modal.lg { max-width: 760px; }
      .aui-modal-head {
        padding: 16px 20px;
        border-bottom: 1px solid var(--border-hairline, #F4F4F5);
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .aui-modal-title {
        font-size: 15px;
        font-weight: 600;
        color: var(--text-primary, #18181B);
        letter-spacing: -0.01em;
      }
      .aui-modal-close {
        background: transparent;
        border: 0;
        color: var(--text-tertiary, #71717A);
        cursor: pointer;
        font-size: 20px;
        line-height: 1;
        width: 28px;
        height: 28px;
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.15s;
      }
      .aui-modal-close:hover {
        background: var(--bg-hover, #F4F4F5);
        color: var(--text-primary, #18181B);
      }
      .aui-modal-body {
        padding: 20px;
        overflow-y: auto;
        font-size: 14px;
        color: var(--text-primary, #18181B);
        line-height: 1.6;
      }
      .aui-modal-foot {
        padding: 12px 20px;
        border-top: 1px solid var(--border-hairline, #F4F4F5);
        display: flex;
        justify-content: flex-end;
        gap: 8px;
        background: var(--bg-base, #FAFAFA);
      }
      .aui-modal-foot .btn { font-size: 13px; }
      @keyframes aui-fade-in {
        from { opacity: 0; }
        to   { opacity: 1; }
      }
      @keyframes aui-modal-in {
        from { transform: translateY(8px) scale(0.98); opacity: 0; }
        to   { transform: translateY(0) scale(1); opacity: 1; }
      }

      /* 表格行可点击 + 排序箭头 */
      .tbl tbody tr.aui-row-clickable { cursor: pointer; transition: background 0.15s; }
      .tbl tbody tr.aui-row-clickable:hover { background: var(--bg-overlay, #F4F4F5); }
      .tbl thead th.aui-sortable {
        cursor: pointer;
        user-select: none;
        position: relative;
        padding-right: 18px;
        transition: color 0.15s;
      }
      .tbl thead th.aui-sortable:hover { color: var(--text-primary, #18181B); }
      .aui-sort-arrow {
        position: absolute;
        right: 6px;
        top: 50%;
        transform: translateY(-50%);
        font-size: 9px;
        color: var(--text-tertiary, #71717A);
        line-height: 1;
      }
      .aui-sort-arrow.asc::before  { content: '▲'; color: var(--accent-red, #DC2626); }
      .aui-sort-arrow.desc::before { content: '▼'; color: var(--accent-red, #DC2626); }
      .aui-sort-arrow.neutral::before { content: '⇅'; opacity: 0.4; }

      /* 空状态 */
      .aui-empty-row td {
        text-align: center;
        padding: 40px 16px !important;
        color: var(--text-tertiary, #71717A);
        font-size: 13px;
      }

      /* Loading spinner */
      .aui-spin {
        display: inline-block;
        width: 12px;
        height: 12px;
        border: 2px solid rgba(255, 255, 255, 0.4);
        border-top-color: white;
        border-radius: 50%;
        animation: aui-spin 0.6s linear infinite;
        margin-right: 6px;
        vertical-align: middle;
      }
      .aui-spin.dark {
        border-color: rgba(220, 38, 38, 0.3);
        border-top-color: var(--accent-red, #DC2626);
      }
      @keyframes aui-spin {
        to { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
  }

  // ============================================
  // Toast
  // ============================================
  function ensureToastContainer() {
    let c = document.getElementById('aui-toast-container');
    if (!c) {
      c = document.createElement('div');
      c.id = 'aui-toast-container';
      c.className = 'aui-toast-container';
      document.body.appendChild(c);
    }
    return c;
  }

  const TOAST_ICONS = {
    success: '✓',
    info: 'i',
    warning: '!',
    error: '✕',
  };

  function toast(message, type = 'info', duration = 3000) {
    const container = ensureToastContainer();
    const t = document.createElement('div');
    t.className = 'aui-toast ' + type;
    t.innerHTML = `
      <span class="aui-toast-icon">${TOAST_ICONS[type] || 'i'}</span>
      <div class="aui-toast-body">
        <div class="aui-toast-msg">${escapeHtml(String(message))}</div>
      </div>
      <button class="aui-toast-close" type="button" aria-label="关闭">×</button>
    `;
    const remove = () => {
      t.classList.add('removing');
      setTimeout(() => t.remove(), 220);
    };
    t.querySelector('.aui-toast-close').addEventListener('click', remove);
    container.appendChild(t);
    if (duration > 0) setTimeout(remove, duration);
    return remove;
  }

  // ============================================
  // Modal
  // ============================================
  let currentModal = null;

  function Modal_open({ title = '', body = '', footer = null, size = 'md' } = {}) {
    Modal_close(); // 一次只允许一个
    const mask = document.createElement('div');
    mask.className = 'aui-modal-mask';
    const footerHtml = footer
      ? `<div class="aui-modal-foot">${footer}</div>`
      : '<div class="aui-modal-foot"><button type="button" class="btn btn-secondary" data-aui-modal-close>关闭</button></div>';

    mask.innerHTML = `
      <div class="aui-modal ${size}" role="dialog" aria-modal="true">
        <div class="aui-modal-head">
          <div class="aui-modal-title">${escapeHtml(title)}</div>
          <button type="button" class="aui-modal-close" aria-label="关闭">×</button>
        </div>
        <div class="aui-modal-body">${typeof body === 'string' ? body : ''}</div>
        ${footerHtml}
      </div>
    `;

    // 如果 body 是 DOM 元素，插入
    if (body && typeof body !== 'string') {
      const bodyEl = mask.querySelector('.aui-modal-body');
      bodyEl.innerHTML = '';
      bodyEl.appendChild(body);
    }

    document.body.appendChild(mask);
    currentModal = mask;

    // 关闭事件
    const close = () => Modal_close();
    mask.querySelector('.aui-modal-close').addEventListener('click', close);
    mask.querySelectorAll('[data-aui-modal-close]').forEach(b => b.addEventListener('click', close));
    mask.addEventListener('click', (e) => {
      if (e.target === mask) close();
    });
    // ESC 关闭
    const escHandler = (e) => {
      if (e.key === 'Escape') {
        close();
        document.removeEventListener('keydown', escHandler);
      }
    };
    document.addEventListener('keydown', escHandler);

    return { mask, close };
  }

  function Modal_close() {
    if (currentModal) {
      currentModal.remove();
      currentModal = null;
    }
  }

  // ============================================
  // Confirm
  // ============================================
  function confirmDialog({
    title = '确认',
    message = '',
    confirmText = '确认',
    cancelText = '取消',
    type = 'default', // default | danger | success
    dangerText = '', // 用于下线时二次输入商家名
  } = {}) {
    return new Promise((resolve) => {
      const wrap = document.createElement('div');

      const confirmBtnClass =
        type === 'danger' ? 'btn btn-danger' :
        type === 'success' ? 'btn btn-success' :
        'btn btn-primary';

      let extraHtml = '';
      if (dangerText) {
        extraHtml = `
          <div style="margin-top: 16px;">
            <label style="display: block; font-size: 12px; color: var(--text-tertiary, #71717A); margin-bottom: 6px;">
              请输入 <strong style="color: var(--accent-red, #DC2626);">${escapeHtml(dangerText)}</strong> 以确认操作
            </label>
            <input type="text" class="form-input" data-aui-confirm-input style="width: 100%; padding: 8px 10px; border: 1px solid var(--border-default, #E4E4E7); border-radius: 4px; font-size: 13px;" placeholder="${escapeHtml(dangerText)}">
          </div>
        `;
      }

      wrap.innerHTML = `
        <div style="font-size: 14px; color: var(--text-primary, #18181B); line-height: 1.6;">${escapeHtml(message)}</div>
        ${extraHtml}
      `;

      const { mask, close } = Modal_open({
        title,
        body: wrap,
        size: 'sm',
        footer: `
          <button type="button" class="btn btn-secondary" data-aui-confirm-cancel>${escapeHtml(cancelText)}</button>
          <button type="button" class="${confirmBtnClass}" data-aui-confirm-ok>${escapeHtml(confirmText)}</button>
        `,
      });

      const okBtn = mask.querySelector('[data-aui-confirm-ok]');
      const cancelBtn = mask.querySelector('[data-aui-confirm-cancel]');
      const input = mask.querySelector('[data-aui-confirm-input]');

      if (input) {
        // 二次确认：输入正确才能点确认
        okBtn.disabled = true;
        okBtn.style.opacity = '0.5';
        okBtn.style.cursor = 'not-allowed';
        input.focus();
        input.addEventListener('input', () => {
          const match = input.value.trim() === dangerText.trim();
          okBtn.disabled = !match;
          okBtn.style.opacity = match ? '1' : '0.5';
          okBtn.style.cursor = match ? 'pointer' : 'not-allowed';
        });
      }

      okBtn.addEventListener('click', () => {
        if (input && input.value.trim() !== dangerText.trim()) {
          toast('输入不匹配，请重新输入', 'warning');
          return;
        }
        close();
        resolve(true);
      });
      cancelBtn.addEventListener('click', () => {
        close();
        resolve(false);
      });
    });
  }

  // ============================================
  // Filter (基于 data-attribute)
  // ============================================
  const Filter = {
    /**
     * 自动绑定筛选条
     * 约定 DOM 结构：
     *   <div class="filter-bar" data-aui-filter>
     *     <span class="filter-chip" data-filter-value="active">合作中</span>
     *     ...
     *     <div class="filter-bar-search"><input data-aui-filter-search></div>
     *   </div>
     *   <table><tbody><tr data-status="active" data-search="M001 音浪对决">...</tr></table>
     */
    init(tableEl, options = {}) {
      if (!tableEl) return;
      const opts = Object.assign({
        statusAttr: 'data-status',
        searchAttr: 'data-search',
        chipSelector: '[data-filter-value]',
        searchSelector: '[data-aui-filter-search]',
        filterBarSelector: '[data-aui-filter]',
        onChange: null,
        emptyMessage: '无匹配结果，请调整筛选条件',
      }, options);

      // 找到筛选条（table 同级前一个或最近）
      let bar = tableEl.previousElementSibling;
      while (bar && !bar.matches(opts.filterBarSelector)) {
        bar = bar.previousElementSibling;
      }
      if (!bar) {
        // 退回到查找页面中所有 filter-bar
        bar = document.querySelector(opts.filterBarSelector);
      }
      if (!bar) {
        console.warn('[AdminUI.Filter] No filter bar found');
        return;
      }

      const tbody = tableEl.tBodies[0] || tableEl.querySelector('tbody');
      if (!tbody) return;

      const chips = bar.querySelectorAll(opts.chipSelector);
      const searchInput = bar.querySelector(opts.searchSelector);

      let activeValue = 'all';
      let searchValue = '';

      const apply = () => {
        const rows = tbody.querySelectorAll('tr');
        let visible = 0;
        rows.forEach(row => {
          // 跳过表头 / 分组
          if (!row.hasAttribute(opts.statusAttr) && !row.hasAttribute(opts.searchAttr)) {
            return;
          }
          const status = (row.getAttribute(opts.statusAttr) || '').toLowerCase();
          const search = (row.getAttribute(opts.searchAttr) || '').toLowerCase();
          const matchStatus = activeValue === 'all' || status === activeValue || activeValue === '';
          const matchSearch = !searchValue || search.indexOf(searchValue) !== -1;
          if (matchStatus && matchSearch) {
            row.style.display = '';
            visible++;
          } else {
            row.style.display = 'none';
          }
        });

        // 空状态
        let empty = tbody.querySelector('.aui-empty-row');
        if (visible === 0) {
          if (!empty) {
            empty = document.createElement('tr');
            empty.className = 'aui-empty-row';
            const colCount = tableEl.tHead ? tableEl.tHead.rows[0].cells.length : 1;
            empty.innerHTML = `<td colspan="${colCount}">${opts.emptyMessage}</td>`;
            tbody.appendChild(empty);
          }
        } else if (empty) {
          empty.remove();
        }

        if (opts.onChange) opts.onChange({ activeValue, searchValue, visible });
      };

      // Chip 点击
      chips.forEach(chip => {
        chip.addEventListener('click', () => {
          chips.forEach(c => c.classList.remove('active'));
          chip.classList.add('active');
          activeValue = chip.getAttribute('data-filter-value') || 'all';
          apply();
        });
      });

      // 搜索
      if (searchInput) {
        let t;
        searchInput.addEventListener('input', (e) => {
          clearTimeout(t);
          const v = e.target.value.trim().toLowerCase();
          t = setTimeout(() => {
            searchValue = v;
            apply();
          }, 150);
        });
      }

      // 初始
      apply();
      return { apply, getState: () => ({ activeValue, searchValue }) };
    },
  };

  // ============================================
  // Sort (表头点击排序)
  // ============================================
  const Sort = {
    /**
     * 自动给 thead th 加排序（通过 data-sort-type）
     * data-sort-type="number" | "string" | "date"（默认 string）
     * data-sort-col="2"（第几列，0-based）
     */
    init(tableEl) {
      if (!tableEl) return;
      const thead = tableEl.tHead;
      if (!thead) return;
      const tbody = tableEl.tBodies[0];
      if (!tbody) return;
      const headers = thead.querySelectorAll('th');

      // 自动检测列类型（如果用户没指定）
      const detectType = (td) => {
        if (!td) return 'string';
        const txt = (td.textContent || '').trim();
        // 纯数字（含千分位 / ¥ / % / 单位）
        if (/^[¥$]?[\d,]+\.?\d*\s*(万|千|亿|%)?$/.test(txt) || /^[\-\+\d\.,]+$/.test(txt.replace(/[¥,万%]/g, ''))) {
          return 'number';
        }
        if (/^\d{4}-\d{2}(-\d{2})?(\s\d{2}:\d{2})?$/.test(txt)) return 'date';
        return 'string';
      };

      headers.forEach((th, idx) => {
        // 跳过没有单元格列的表头（如 row 操作列）
        if (th.textContent.trim() === '' || th.classList.contains('no-sort')) return;

        th.classList.add('aui-sortable');
        const arrow = document.createElement('span');
        arrow.className = 'aui-sort-arrow neutral';
        th.appendChild(arrow);

        const sortType = th.getAttribute('data-sort-type') || null;
        const sortCol = parseInt(th.getAttribute('data-sort-col') || idx, 10);

        th.addEventListener('click', () => {
          const cur = th.getAttribute('data-sort-dir') || 'none';
          const next = cur === 'asc' ? 'desc' : 'asc';
          // 重置其他
          headers.forEach(h => {
            h.setAttribute('data-sort-dir', 'none');
            const a = h.querySelector('.aui-sort-arrow');
            if (a) a.className = 'aui-sort-arrow neutral';
          });
          th.setAttribute('data-sort-dir', next);
          arrow.className = 'aui-sort-arrow ' + next;

          const rows = Array.from(tbody.querySelectorAll('tr')).filter(r => !r.classList.contains('aui-empty-row'));
          const type = sortType || detectType(rows[0] ? rows[0].cells[sortCol] : null);
          const dir = next === 'asc' ? 1 : -1;
          const getVal = (row) => {
            const cell = row.cells[sortCol];
            if (!cell) return '';
            const raw = (cell.textContent || '').trim();
            if (type === 'number') {
              // 提取第一个数字（含小数）
              const m = raw.match(/-?[\d,]+\.?\d*/);
              if (!m) return 0;
              return parseFloat(m[0].replace(/,/g, ''));
            }
            if (type === 'date') {
              return new Date(raw.replace(/-/g, '/')).getTime() || 0;
            }
            return raw;
          };
          rows.sort((a, b) => {
            const va = getVal(a);
            const vb = getVal(b);
            if (va < vb) return -1 * dir;
            if (va > vb) return 1 * dir;
            return 0;
          });
          // 重新插入
          rows.forEach(r => tbody.appendChild(r));
        });
      });
    },
  };

  // ============================================
  // rowClick (表格行点击跳转)
  // ============================================
  function rowClick(tableEl, baseUrl) {
    if (!tableEl) return;
    const tbody = tableEl.tBodies[0];
    if (!tbody) return;
    tbody.querySelectorAll('tr').forEach(row => {
      if (row.classList.contains('aui-empty-row')) return;
      if (!row.hasAttribute('data-href')) {
        // 默认使用行内第一个 id 列（M001 / A001）
        const idCell = row.cells[0];
        let id = '';
        if (idCell) {
          id = (idCell.textContent || '').trim();
        }
        if (id) row.setAttribute('data-href', `${baseUrl}?id=${encodeURIComponent(id)}`);
      }
      row.classList.add('aui-row-clickable');
      row.addEventListener('click', (e) => {
        // 阻止在内部 a / button 上触发
        if (e.target.closest('a, button')) return;
        const href = row.getAttribute('data-href');
        if (href) {
          if (row.getAttribute('data-target') === '_blank') {
            window.open(href, '_blank');
          } else {
            window.location.href = href;
          }
        }
      });
    });
  }

  // ============================================
  // countUp (从 0 增长到 target)
  // ============================================
  function countUp(el, target, duration = 1000) {
    if (!el) return;
    const start = performance.now();
    const startVal = 0;
    const isInteger = Number.isInteger(target);
    const suffix = el.getAttribute('data-count-suffix') || '';
    const prefix = el.getAttribute('data-count-prefix') || '';
    const easeOut = (t) => 1 - Math.pow(1 - t, 3);

    function frame(now) {
      const t = Math.min(1, (now - start) / duration);
      const v = startVal + (target - startVal) * easeOut(t);
      el.textContent = prefix + (isInteger ? Math.round(v) : v.toFixed(1)) + suffix;
      if (t < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  // ============================================
  // countdown (倒计时)
  // ============================================
  function countdown(el, seconds) {
    if (!el) return;
    let remaining = seconds;
    const tick = () => {
      const m = Math.floor(remaining / 60);
      const s = remaining % 60;
      el.textContent = `${m}:${String(s).padStart(2, '0')}`;
      remaining--;
      if (remaining < 0) {
        clearInterval(timer);
        if (el.dataset.onFinish) {
          try { window[el.dataset.onFinish](); } catch (e) {}
        }
      }
    };
    tick();
    const timer = setInterval(tick, 1000);
    return timer;
  }

  // ============================================
  // relativeTime (相对时间)
  // ============================================
  function relativeTime(timestamp) {
    const t = (timestamp instanceof Date) ? timestamp.getTime() : new Date(timestamp).getTime();
    if (isNaN(t)) return '';
    const diff = Date.now() - t;
    const sec = Math.floor(diff / 1000);
    if (sec < 60) return `${sec} 秒前`;
    const min = Math.floor(sec / 60);
    if (min < 60) return `${min} 分钟前`;
    const hr = Math.floor(min / 60);
    if (hr < 24) return `${hr} 小时前`;
    const day = Math.floor(hr / 24);
    if (day < 30) return `${day} 天前`;
    const mon = Math.floor(day / 30);
    if (mon < 12) return `${mon} 个月前`;
    const yr = Math.floor(mon / 12);
    return `${yr} 年前`;
  }

  // ============================================
  // 工具：转义 HTML
  // ============================================
  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
    }[c]));
  }

  // ============================================
  // loading 助手：包装按钮异步操作
  // ============================================
  function withLoading(btn, text) {
    if (!btn) return () => {};
    const original = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = `<span class="aui-spin"></span>${text || '处理中...'}`;
    return () => {
      btn.disabled = false;
      btn.innerHTML = original;
    };
  }

  // ============================================
  // 暴露全局
  // ============================================
  window.AdminUI = {
    toast,
    Modal: { open: Modal_open, close: Modal_close },
    confirm: confirmDialog,
    Filter,
    Sort,
    rowClick,
    countUp,
    countdown,
    relativeTime,
    withLoading,
    escapeHtml,
  };
})();
