/* CoolForge 原型共享层：图标内联 / RFQ 演示 / reveal / 移动导航 / 走查条 */
(function () {
  'use strict';

  /* ---- Phosphor 图标内联（fetch 本地 svg，替换 <i data-icon>；含动态注入） ---- */
  const iconCache = {};
  function hydrateIcon(el) {
    const name = el.getAttribute('data-icon');
    if (!name || el.dataset.hydrated) return;
    el.dataset.hydrated = '1';
    const apply = svg => {
      if (!el.isConnected) return;
      const wrap = document.createElement('span');
      wrap.className = 'ico' + (el.className ? ' ' + el.className : '');
      wrap.setAttribute('aria-hidden', 'true');
      wrap.innerHTML = svg;
      const s = wrap.querySelector('svg');
      if (s) { s.removeAttribute('width'); s.removeAttribute('height'); s.setAttribute('fill', 'currentColor'); }
      el.replaceWith(wrap);
    };
    if (iconCache[name]) { apply(iconCache[name]); return; }
    fetch('icons/' + name + '.svg')
      .then(r => r.ok ? r.text() : Promise.reject(name))
      .then(svg => { iconCache[name] = svg; apply(svg); })
      .catch(() => { el.remove(); });
  }
  document.querySelectorAll('[data-icon]').forEach(hydrateIcon);
  new MutationObserver(muts => muts.forEach(m => m.addedNodes.forEach(n => {
    if (n.nodeType !== 1) return;
    if (n.hasAttribute && n.hasAttribute('data-icon')) hydrateIcon(n);
    n.querySelectorAll && n.querySelectorAll('[data-icon]').forEach(hydrateIcon);
  }))).observe(document.body, { childList: true, subtree: true });

  /* ---- RFQ 演示提交（成功态 + WhatsApp 预填 + 再发一单） ---- */
  document.querySelectorAll('form[data-rfq]').forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      if (!form.reportValidity()) return;
      const ok = form.querySelector('.rfq-ok');
      const wa = form.querySelector('[data-wa]');
      const data = new FormData(form);
      const lines = [];
      data.forEach((v, k) => { if (v && typeof v === 'string' && v.trim()) lines.push(k + ': ' + v); });
      if (wa) wa.href = 'https://wa.me/8613800000000?text=' + encodeURIComponent('Hi CoolForge, I need a quote:\n' + lines.join('\n'));
      form.querySelectorAll('input,select,textarea,button[type=submit]').forEach(el => { el.disabled = true; });
      if (ok) {
        ok.hidden = false;
        if (!ok.querySelector('.rfq-again')) {
          const again = document.createElement('button');
          again.type = 'button';
          again.className = 'rfq-again';
          again.textContent = window.CF ? window.CF.t('rfq.again') : '↺ Send another request';
          again.addEventListener('click', () => {
            form.reset();
            form.querySelectorAll('input,select,textarea,button[type=submit]').forEach(el => { el.disabled = false; });
            ok.hidden = true;
            form.scrollIntoView({ behavior: 'smooth', block: 'center' });
          });
          ok.appendChild(again);
        }
        ok.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  });

  /* ---- 移动导航 ---- */
  document.querySelectorAll('[data-navtoggle]').forEach(btn => {
    const nav = document.querySelector(btn.getAttribute('data-navtoggle'));
    if (!nav) return;
    btn.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.classList.toggle('nav-locked', open);
    });
    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      nav.classList.remove('open');
      document.body.classList.remove('nav-locked');
      btn.setAttribute('aria-expanded', 'false');
    }));
  });

  /* ---- reveal：IntersectionObserver + 2.2s 兜底（内容绝不隐藏） ---- */
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const targets = [...document.querySelectorAll('[data-reveal]')];
  if (!reduce && targets.length) {
    const io = new IntersectionObserver(es => es.forEach(en => {
      if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
    }), { threshold: 0.1, rootMargin: '0px 0px -6% 0px' });
    targets.forEach(t => io.observe(t));
    setTimeout(() => targets.forEach(t => t.classList.add('in')), 2200);
  } else {
    targets.forEach(t => t.classList.add('in'));
  }

  /* 走查条已按用户要求移除 */

  /* ---- 年份数字滚动（data-count） ---- */
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length && !reduce) {
    const cio = new IntersectionObserver(es => es.forEach(en => {
      if (!en.isIntersecting) return;
      const el = en.target; cio.unobserve(el);
      const end = parseFloat(el.getAttribute('data-count'));
      const suffix = el.getAttribute('data-suffix') || '';
      const t0 = performance.now(), dur = 1100;
      const tick = now => {
        const p = Math.min(1, (now - t0) / dur);
        const ease = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(end * ease).toLocaleString('en-US') + suffix;
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }), { threshold: 0.4 });
    counters.forEach(c => cio.observe(c));
    setTimeout(() => counters.forEach(el => {
      if (!/\d/.test(el.textContent)) el.textContent = parseFloat(el.getAttribute('data-count')).toLocaleString('en-US') + (el.getAttribute('data-suffix') || '');
    }), 2500);
  }
  /* ---- scrollspy：固定导航当前区块高亮 ---- */
  const spyNav = document.querySelector('.navlinks, .mast-links');
  if (spyNav) {
    const links = [...spyNav.querySelectorAll('a[href^="#"]')];
    const map = new Map();
    links.forEach(a => {
      const sec = document.querySelector(a.getAttribute('href'));
      if (sec) map.set(sec, a);
    });
    if (map.size) {
      const setActive = a => {
        links.forEach(l => l.classList.toggle('active', l === a));
      };
      const sio = new IntersectionObserver(es => {
        es.forEach(en => { if (en.isIntersecting) setActive(map.get(en.target)); });
      }, { rootMargin: '-30% 0px -55% 0px', threshold: 0 });
      map.forEach((a, sec) => sio.observe(sec));
      // 回到顶部时清除高亮
      const topClear = new IntersectionObserver(es => es.forEach(en => {
        if (en.isIntersecting && en.intersectionRatio > 0.5) setActive(null);
      }), { threshold: 0.5 });
      const hero = document.querySelector('.hero, .hero-band');
      if (hero) topClear.observe(hero);
    }
  }

  /* ---- scroll progress line (C-style pages only) ---- */
  if (/\/c-(uipro|product|factory|custom)\.html$/.test(location.pathname) || /\/c-(uipro|product|factory|custom)\.html\?/.test(location.pathname+location.search)) {
    const bar = document.createElement('div');
    bar.className = 'cf-progress';
    bar.setAttribute('aria-hidden', 'true');
    document.body.appendChild(bar);
    let tick = false;
    const upd = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      bar.style.width = (max > 0 ? (h.scrollTop / max) * 100 : 0) + '%';
      tick = false;
    };
    addEventListener('scroll', () => { if (!tick) { tick = true; requestAnimationFrame(upd); } }, { passive: true });
    addEventListener('resize', upd);
    upd();
  }

})();
