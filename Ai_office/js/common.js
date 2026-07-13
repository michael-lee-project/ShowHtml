/* Common JS — V2: load shared header/footer */

(function () {
  "use strict";

  function loadHeader() {
    const slot = document.getElementById("header-slot");
    if (!slot) return;
    fetch("../includes/header.html")
      .then((r) => (r.ok ? r.text() : Promise.reject(r.status)))
      .then((html) => {
        slot.outerHTML = html;
        highlightActiveNav();
      })
      .catch(() => {
        slot.outerHTML = minimalHeader();
        highlightActiveNav();
      });
  }

  function loadFooter() {
    const slot = document.getElementById("footer-slot");
    if (!slot) return;
    fetch("../includes/footer.html")
      .then((r) => (r.ok ? r.text() : Promise.reject(r.status)))
      .then((html) => {
        slot.outerHTML = html;
      })
      .catch(() => {
        slot.outerHTML = minimalFooter();
      });
  }

  function highlightActiveNav() {
    const path = window.location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".site-nav a").forEach((a) => {
      const href = a.getAttribute("href");
      if (href === path) a.classList.add("active");
    });
  }

  function minimalHeader() {
    return `
<header class="site-header">
  <div class="container">
    <a href="index.html" class="site-logo">
      <span class="logo-mark">灵</span>
      <span>灵光工作台</span>
    </a>
    <nav class="site-nav">
      <a href="dashboard.html">工作台</a>
      <a href="ppt-generate.html">PPT 生成</a>
      <a href="image-generate.html">图片生成</a>
      <a href="templates.html">模板中心</a>
      <a href="brand.html">品牌中心</a>
      <a href="membership.html">会员</a>
      <a href="team.html">团队空间</a>
    </nav>
    <div class="site-header-actions">
      <button class="btn btn-ghost btn-sm">登录</button>
      <a href="ppt-generate.html" class="btn btn-primary btn-sm">开始创作</a>
    </div>
  </div>
</header>`;
  }

  function minimalFooter() {
    const year = new Date().getFullYear();
    return `
<footer class="site-footer">
  <div class="container">
    <div class="footer-grid">
      <div class="footer-brand">
        <a href="index.html" class="site-logo">
          <span class="logo-mark">灵</span>
          <span>灵光工作台</span>
        </a>
        <p>面向职场人员的 AI 视觉办公交付平台。选场景、输主题、出精品。</p>
      </div>
      <div class="footer-col">
        <h5>产品</h5>
        <ul>
          <li><a href="ppt-generate.html">PPT 生成</a></li>
          <li><a href="image-generate.html">图片生成</a></li>
          <li><a href="templates.html">模板中心</a></li>
          <li><a href="brand.html">品牌中心</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h5>资源</h5>
        <ul>
          <li><a href="templates.html">模板市场</a></li>
          <li><a href="#">帮助中心</a></li>
          <li><a href="#">更新日志</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h5>公司</h5>
        <ul>
          <li><a href="#">关于我们</a></li>
          <li><a href="#">招贤纳士</a></li>
          <li><a href="#">联系</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <span>© ${year} 灵光工作台 · 让 AI 成为每个人的职场搭档</span>
      <div class="footer-bottom-links">
        <a href="#">隐私政策</a>
        <a href="#">服务条款</a>
      </div>
    </div>
  </div>
</footer>`;
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      loadHeader();
      loadFooter();
    });
  } else {
    loadHeader();
    loadFooter();
  }
})();
