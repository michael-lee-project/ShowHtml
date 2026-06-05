/* ==========================================================================
   H5 移动端公共 JS — 慈商联营
   包含：splash 动效 / 卡片入 / 数字滚动 / 进度条 / tab 切换 / modal
   依赖：GSAP 3.12 + ScrollTrigger (CDN)
   ========================================================================== */

(function () {
  'use strict';

  const H5 = {};

  /* ===== 角色配置 ===== */
  H5.ROLES = {
    company:   { name: '企业',     primary: '#E85D04', icon: '🏢' },
    charity:   { name: '慈善会',   primary: '#0E5A6F', icon: '慈' },
    org:       { name: '社会组织', primary: '#C4842A', icon: '社' },
    volunteer: { name: '志愿者',   primary: '#14B8A6', icon: '志' },
    recipient: { name: '受捐者',   primary: '#7C3AED', icon: '受' }
  };

  /* ===== 简化数据（5 角色） ===== */
  H5.ROLE_DATA = {
    company: {
      user: { name: '李经理', role: '美心食品集团', avatar: '李' },
      kpis: [
        { ic: '📦', label: '累计捐赠', value: '128', unit: '次', trend: '同比 12%', up: true },
        { ic: '💰', label: '累计价值', value: '1860', unit: '万', trend: '同比 38%', up: true },
        { ic: '❤️', label: '受惠人次', value: '12.6', unit: '万', trend: '同比 42%', up: true },
        { ic: '⏱️', label: '派发时效', value: '3.2', unit: '天', trend: '提速 0.5 天', up: true }
      ]
    },
    charity: {
      user: { name: '王主任', role: '广东省慈善总会', avatar: '王' },
      kpis: [
        { ic: '📋', label: '在执行项目', value: '26', unit: '', trend: '含紧急 2' },
        { ic: '🎁', label: '待领物资', value: '8', unit: '', trend: '价值 28.6 万' },
        { ic: '👥', label: '受惠人次', value: '12.6', unit: '万', trend: '同比 +42%', up: true },
        { ic: '🤝', label: '活跃志愿者', value: '1260', unit: '', trend: '本月新增 86' }
      ]
    },
    org: {
      user: { name: '李秘书长', role: '深圳市壹基金', avatar: '李' },
      kpis: [
        { ic: '📚', label: '参与项目', value: '28', unit: '', trend: '本年新增 12' },
        { ic: '🚚', label: '派发物资', value: '8.26', unit: '万件', trend: '累计' },
        { ic: '👨‍👩‍👧', label: '受惠人次', value: '4.28', unit: '万', trend: '同比 +38%', up: true },
        { ic: '🙋', label: '志愿者', value: '86', unit: '人', trend: '活跃 62 人' }
      ]
    },
    volunteer: {
      user: { name: '张伟', role: '注册志愿者', avatar: '张' },
      kpis: [
        { ic: '⏰', label: '待执行', value: '3', unit: '', trend: '含 1 紧急' },
        { ic: '✅', label: '已完成', value: '28', unit: '', trend: '本年' },
        { ic: '🕐', label: '服务时长', value: '156', unit: 'h', trend: '本年' },
        { ic: '👥', label: '受惠人次', value: '286', unit: '', trend: '经您 2 手' }
      ]
    },
    recipient: {
      user: { name: '李华', role: '受捐者', avatar: '李' },
      kpis: [
        { ic: '🎁', label: '累计领取', value: '12', unit: '次', trend: '物资 86 件' },
        { ic: '💝', label: '受惠价值', value: '1860', unit: '元', trend: '累计' },
        { ic: '⭐', label: '反馈次数', value: '8', unit: '', trend: '好评率 100%' },
        { ic: '📅', label: '下次领取', value: '6/15', unit: '', trend: '端午礼盒' }
      ]
    }
  };

  /* ===== URL 参数解析 ===== */
  H5.getParam = function (name) {
    const m = location.search.match(new RegExp('[?&]' + name + '=([^&]*)'));
    return m ? decodeURIComponent(m[1]) : null;
  };

  /* ===== 当前角色 ===== */
  H5.currentRole = H5.getParam('role') || localStorage.getItem('h5_role') || 'volunteer';
  H5.setRole = function (role) {
    localStorage.setItem('h5_role', role);
    document.body.setAttribute('data-role', role);
    H5.currentRole = role;
  };

  /* ===== Logo 复用 web 端 SVG ===== */
  H5.LOGO_SVG = '<svg viewBox="0 0 32 32" width="100%" height="100%"><defs><linearGradient id="lg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#FF8B3D"/><stop offset="100%" stop-color="#C44503"/></linearGradient></defs><rect x="2" y="2" width="28" height="28" rx="8" fill="url(#lg)"/><path d="M9 16c0-3.3 2.7-6 6-6 1.5 0 2.9.6 4 1.5" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round"/><circle cx="20" cy="11" r="2" fill="#fff"/><path d="M8 22h16" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity="0.6"/></svg>';

  /* ===== Splash 入场（参考 web 端 1240px 方案 3 简化） ===== */
  H5.playSplash = function (onComplete) {
    const splash = document.querySelector('.h5-splash');
    if (!splash) { onComplete && onComplete(); return; }

    // 已播放过（缓存）
    if (sessionStorage.getItem('h5_splash_played')) {
      splash.style.display = 'none';
      onComplete && onComplete();
      return;
    }

    const logo = splash.querySelector('.h5-splash-logo');
    const glow = splash.querySelector('.h5-splash-glow');
    const text = splash.querySelector('.h5-splash-text');
    const particles = splash.querySelectorAll('.h5-splash-particle');
    const progress = splash.querySelector('.h5-splash-progress-bar');

    // 注入 GSAP 初始状态
    if (window.gsap) {
      const tl = gsap.timeline({
        onComplete: () => {
          sessionStorage.setItem('h5_splash_played', '1');
          gsap.to(splash, {
            opacity: 0,
            duration: 0.5,
            ease: 'power2.in',
            onComplete: () => {
              splash.style.display = 'none';
              onComplete && onComplete();
            }
          });
        }
      });

      // 起点
      gsap.set(logo, { scale: 0.4, opacity: 0 });
      gsap.set(text, { opacity: 0, y: 20 });
      gsap.set(glow, { scale: 0, opacity: 0 });

      // 进度条先动
      tl.to(progress, { width: '100%', duration: 1.6, ease: 'power1.inOut' }, 0);

      // Logo 弹性入
      tl.to(logo, {
        scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(1.7)'
      }, 0.2);

      // 光晕扩散
      tl.to(glow, {
        scale: 1, opacity: 1, duration: 0.8, ease: 'power2.out'
      }, 0.3);

      // 文字淡入
      tl.to(text, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, 0.6);

      // 粒子散开
      particles.forEach((p, i) => {
        const angle = (i / particles.length) * Math.PI * 2;
        const dist = 200 + Math.random() * 100;
        const x = Math.cos(angle) * dist;
        const y = Math.sin(angle) * dist;
        gsap.set(p, { x: 0, y: 0, opacity: 0 });
        tl.to(p, {
          x, y, opacity: 1, duration: 0.4, ease: 'power2.out'
        }, 0.4 + i * 0.02);
        tl.to(p, {
          opacity: 0, scale: 0, duration: 0.4, ease: 'power2.in'
        }, '>-0.2');
      });
    } else {
      // 降级 CSS
      setTimeout(() => {
        splash.style.opacity = '0';
        splash.style.transition = 'opacity 0.5s';
        setTimeout(() => {
          splash.style.display = 'none';
          onComplete && onComplete();
        }, 500);
      }, 1800);
    }
  };

  /* ===== 卡片弹性入（页面内元素） ===== */
  H5.fadeInUp = function (selector, opts) {
    const elements = typeof selector === 'string'
      ? document.querySelectorAll(selector)
      : [selector];
    if (!elements.length) return;
    if (!window.gsap) {
      elements.forEach(el => el.style.opacity = '1');
      return;
    }
    const defaults = {
      y: 30, opacity: 0, duration: 0.6,
      ease: 'power2.out', stagger: 0.1
    };
    const config = Object.assign({}, defaults, opts || {});
    gsap.from(elements, config);
  };

  /* ===== 数字滚动（countUp） ===== */
  H5.countUp = function (el, target, duration) {
    if (!el) return;
    duration = duration || 1.5;
    const isFloat = String(target).indexOf('.') >= 0;
    const targetNum = parseFloat(target);
    if (isNaN(targetNum)) { el.textContent = target; return; }

    if (!window.gsap) {
      el.textContent = target;
      return;
    }
    const obj = { val: 0 };
    gsap.to(obj, {
      val: targetNum,
      duration,
      ease: 'power2.out',
      onUpdate: () => {
        el.textContent = isFloat
          ? obj.val.toFixed(String(target).split('.')[1].length)
          : Math.round(obj.val);
      }
    });
  };

  /* ===== 进度条动画 ===== */
  H5.animateProgress = function (selector) {
    const bars = typeof selector === 'string'
      ? document.querySelectorAll(selector)
      : [selector];
    if (!window.gsap) {
      bars.forEach(b => { b.style.width = b.dataset.width || '0%'; });
      return;
    }
    bars.forEach(b => {
      const w = b.dataset.width || b.getAttribute('style')?.match(/width:(\d+%)/)?.[1] || '0%';
      gsap.fromTo(b,
        { width: '0%' },
        { width: w, duration: 1.2, ease: 'power2.out', delay: 0.3 }
      );
    });
  };

  /* ===== 圆环进度 ===== */
  H5.animateRing = function (selector, percent) {
    const ring = typeof selector === 'string' ? document.querySelector(selector) : selector;
    if (!ring) return;
    const fg = ring.querySelector('.h5-ring-fg');
    const text = ring.querySelector('.h5-ring-pct');
    if (!fg) return;
    const r = parseFloat(fg.getAttribute('r'));
    const C = 2 * Math.PI * r;
    fg.setAttribute('stroke-dasharray', C);
    fg.setAttribute('stroke-dashoffset', C);
    if (window.gsap) {
      gsap.to(fg, {
        attr: { 'stroke-dashoffset': C * (1 - percent / 100) },
        duration: 1.2, ease: 'power2.out', delay: 0.3
      });
    } else {
      fg.setAttribute('stroke-dashoffset', C * (1 - percent / 100));
    }
    if (text) {
      H5.countUp(text, percent, 1.2);
    }
  };

  /* ===== Modal 打开/关闭 ===== */
  H5.openModal = function (modalId) {
    const m = document.getElementById(modalId);
    if (!m) return;
    m.classList.add('open');
    document.body.style.overflow = 'hidden';
  };
  H5.closeModal = function (modalId) {
    const m = document.getElementById(modalId);
    if (!m) return;
    m.classList.remove('open');
    document.body.style.overflow = '';
  };
  // 点击 backdrop 关闭
  document.addEventListener('click', e => {
    if (e.target.classList.contains('h5-modal-mask')) {
      e.target.classList.remove('open');
      document.body.style.overflow = '';
    }
  });

  /* ===== Tab 切换 ===== */
  H5.initTabs = function (selector) {
    const tabGroups = document.querySelectorAll(selector || '.h5-tabs');
    tabGroups.forEach(group => {
      const tabs = group.querySelectorAll('.h5-tab-btn');
      const panels = document.querySelectorAll(group.dataset.target || '');
      tabs.forEach(tab => {
        tab.addEventListener('click', () => {
          tabs.forEach(t => t.classList.remove('active'));
          tab.classList.add('active');
          const target = tab.dataset.tab;
          panels.forEach(p => {
            p.style.display = (p.dataset.tab === target || p.id === target) ? '' : 'none';
          });
        });
      });
    });
  };

  /* ===== 角色选择页：点击角色卡片 → 跳 dashboard ===== */
  H5.bindRoleCards = function () {
    document.querySelectorAll('[data-role-card]').forEach(card => {
      card.addEventListener('click', () => {
        const role = card.dataset.roleCard;
        H5.setRole(role);
        location.href = `./${role}/dashboard.html?role=${role}`;
      });
    });
  };

  /* ===== 评分维度 modal 内容（5 角色通用） ===== */
  H5.DIM_RULES = {
    volunteer: {
      '服务时长': { desc: '每次任务完成后自动计入', rules: [
        '单次任务 ≥2h：+5 分',
        '单次任务 ≥4h：+12 分',
        '月度累计 ≥20h：额外 +8 分'
      ], current: '92/100', base: '已累计 156h' },
      '服务次数': { desc: '本年完成的有效任务数', rules: [
        '完成 1 次任务：+3 分',
        '连续 4 周有任务：额外 +5 分',
        '完成紧急任务：单次 +8 分'
      ], current: '88/100', base: '本年 28 次任务' },
      '服务评价': { desc: '受惠者反馈 + 现场督导评分', rules: [
        '5★ 评价：+4 分/次',
        '4★ 评价：+2 分/次',
        '收到感谢信：+6 分'
      ], current: '95/100', base: '26 条 5★ · 2 条 4★' },
      '培训完成率': { desc: '年度必修课 + 选修课', rules: [
        '完成 1 门必修：+12 分',
        '完成 1 门选修：+6 分',
        '通过考核：+10 分'
      ], current: '100/100', base: '8/8 课程已结业' },
      '守信行为': { desc: '签到 / 无迟到 / 无取消', rules: [
        '准时签到：+2 分/次',
        '无取消记录：+15 分',
        '无迟到：+10 分'
      ], current: '90/100', base: '无失约 0 次' }
    }
  };

  /* ===== Splash 粒子初始化 ===== */
  H5.initSplashParticles = function () {
    const container = document.querySelector('.h5-splash-particles');
    if (!container) return;
    container.innerHTML = '';
    for (let i = 0; i < 16; i++) {
      const p = document.createElement('div');
      p.className = 'h5-splash-particle';
      p.style.left = '50%';
      p.style.top = '50%';
      p.style.transform = 'translate(-50%, -50%)';
      container.appendChild(p);
    }
  };

  /* ===== 透明 nav 滚动监听（滚出 hero 区域自动切回白底） ===== */
  H5.initNavScroll = function () {
    const nav = document.querySelector('.h5-nav.transparent');
    if (!nav) return;
    // 找最近的 hero
    const hero = nav.nextElementSibling?.classList.contains('h5-page')
      ? nav.nextElementSibling.querySelector('.h5-platform-hero, .h5-hero')
      : document.querySelector('.h5-platform-hero, .h5-hero');
    if (!hero) return;
    const update = () => {
      const heroBottom = hero.getBoundingClientRect().bottom;
      // 当 hero 滚到 nav 底部以下时，切回白底
      if (heroBottom < 56) {
        nav.classList.add('h5-nav-solid');
      } else {
        nav.classList.remove('h5-nav-solid');
      }
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    // 暴露刷新入口：splash 结束/主内容由 display:none 切回时主动调用，避免初始化时 hero 高度=0 导致错误加 h5-nav-solid
    H5.refreshNav = update;
  };

  /* ===== 全局初始化 ===== */
  H5.init = function () {
    // 角色色
    if (!document.body.getAttribute('data-role')) {
      H5.setRole(H5.currentRole);
    }
    // splash 粒子
    H5.initSplashParticles();
    // tab
    H5.initTabs();
    // nav 滚动
    H5.initNavScroll();
  };

  document.addEventListener('DOMContentLoaded', H5.init);

  // 暴露
  window.H5 = H5;
})();
