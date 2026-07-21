/* ============================================================
 * shared.js · V1 共享交互
 * - 列表项 stagger 入场（fadeUp）
 * - 消息气泡按 index stagger 入场
 * - 标题栏三按钮 hover 符号（CSS 已实现，JS 增强点击反馈）
 * ============================================================ */

(function () {
  'use strict';

  // --- 1. 列表 stagger 入场 ---
  const STAGGER_TARGETS = [
    '.session-item',
    '.contact-item',
    '.contact-special',
    '.oa__project-card',
    '.oa__stat',
    '.profile__stat-card',
    '.profile__row',
  ];

  STAGGER_TARGETS.forEach((selector) => {
    document.querySelectorAll(selector).forEach((el, i) => {
      // 不覆盖已有 inline animation
      if (el.style.animation) return;
      const delay = Math.min(i * 28, 600); // 单组最多 stagger 600ms
      el.style.animation = `fadeUp 380ms cubic-bezier(0.32, 0.72, 0, 1) ${delay}ms both`;
    });
  });

  // --- 2. 消息气泡 stagger 入场（限制 stagger 总时长） ---
  document.querySelectorAll('.chat .msg').forEach((el, i) => {
    const delay = Math.min(i * 40, 400);
    el.style.animation = `fadeUp 320ms cubic-bezier(0.32, 0.72, 0, 1) ${delay}ms both`;
  });

  // --- 3. 标题栏三按钮点击反馈 ---
  document.querySelectorAll('.titlebar__light').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      // 视觉反馈：缩小 + 弹回
      btn.style.transform = 'scale(0.85)';
      setTimeout(() => {
        btn.style.transform = '';
      }, 120);
    });
  });

  // --- 4. 侧栏导航点击波纹效果 ---
  document.querySelectorAll('.sidebar__item').forEach((item) => {
    item.addEventListener('click', function (e) {
      // 简单动画反馈：临时缩放
      this.style.transform = 'scale(0.92)';
      setTimeout(() => {
        this.style.transform = '';
      }, 100);
    });
  });

  // --- 5. 公众号关注按钮切换文字 ---
  document.querySelectorAll('.oa__hero-btn').forEach((btn) => {
    if (!btn.classList.contains('oa__hero-btn--secondary')) {
      btn.addEventListener('click', function () {
        if (this.textContent.trim() === '+ 关注') {
          this.textContent = '✓ 已关注';
          this.style.background = 'rgba(255, 255, 255, 0.22)';
          this.style.color = 'white';
          this.style.border = '1px solid rgba(255, 255, 255, 0.4)';
        } else {
          this.textContent = '+ 关注';
          this.style.background = '';
          this.style.color = '';
          this.style.border = '';
        }
      });
    }
  });

  // --- 6. 会话项点击切换选中态（视觉演示） ---
  document.querySelectorAll('.session-item').forEach((item) => {
    item.addEventListener('click', function () {
      document.querySelectorAll('.session-item.is-active').forEach((a) => a.classList.remove('is-active'));
      this.classList.add('is-active');
    });
  });

})();