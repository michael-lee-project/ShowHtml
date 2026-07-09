/* ============================================
   Shared JS - 公共交互逻辑
   ============================================ */

// 数字格式化（千分位 + 万/亿）
window.fmtNumber = function(num) {
  return num.toLocaleString('zh-CN');
};

window.fmtCompact = function(num) {
  if (num >= 100000000) {
    return (num / 100000000).toFixed(2) + ' 亿';
  }
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + ' 万';
  }
  return num.toLocaleString('zh-CN');
};

window.fmtPercent = function(num, decimals = 0) {
  return (num * 100).toFixed(decimals) + '%';
};

// 数字滚动动画
window.animateNumber = function(el, target, duration = 800) {
  if (!el) return;
  const start = parseFloat(el.textContent.replace(/[^\d.-]/g, '')) || 0;
  const startTime = performance.now();
  const isInt = !String(target).includes('.');

  function step(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = start + (target - start) * eased;
    el.textContent = isInt ? Math.floor(current).toLocaleString('zh-CN') : current.toFixed(1);
    if (progress < 1) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
};

// 模式徽章注入
window.renderModeBadge = function(mode) {
  if (mode === 1) {
    return '<span class="badge badge-mode-1"><span class="badge-dot"></span>段一 积分消纳</span>';
  }
  if (mode === 2) {
    return '<span class="badge badge-mode-2"><span class="badge-dot"></span>段二 流水抽佣</span>';
  }
  return '<span class="badge badge-neutral">未激活</span>';
};

// 进度条注入
window.renderProgress = function(percent, mode = 1) {
  const cls = mode === 1 ? 'progress-bar-mode-1' : 'progress-bar-mode-2';
  return `<div class="progress"><div class="progress-bar ${cls}" style="width: ${percent}%"></div></div>`;
};

// 滚动进入视口动画（IntersectionObserver）
window.observeFadeUp = function(selector = '.fade-on-scroll') {
  const elements = document.querySelectorAll(selector);
  if (!('IntersectionObserver' in window)) {
    elements.forEach(el => el.classList.add('fade-in'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  elements.forEach(el => observer.observe(el));
};

// 初始化
document.addEventListener('DOMContentLoaded', () => {
  observeFadeUp();
});

// ============================================
// DraftManager - 草稿管理（apply.html 用）
// ============================================
window.DraftManager = {
  STORAGE_KEY: 'opulatrix_apply_draft',
  EXPIRE_DAYS: 7,

  // 保存草稿
  save(data) {
    const payload = {
      data,
      savedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + this.EXPIRE_DAYS * 24 * 60 * 60 * 1000).toISOString(),
    };
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(payload));
      return true;
    } catch (e) {
      console.error('[DraftManager] save failed:', e);
      return false;
    }
  },

  // 读取草稿
  load() {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      if (!raw) return null;
      const payload = JSON.parse(raw);
      if (new Date(payload.expiresAt) < new Date()) {
        localStorage.removeItem(this.STORAGE_KEY);
        return null;
      }
      return payload;
    } catch (e) {
      console.error('[DraftManager] load failed:', e);
      return null;
    }
  },

  // 清除草稿
  clear() {
    localStorage.removeItem(this.STORAGE_KEY);
  },

  // 格式化保存时间
  formatSavedAt(iso) {
    const d = new Date(iso);
    const pad = n => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  },
};

// ============================================
// ApplyForm - apply.html 5 步表单控制器
// ============================================
window.ApplyForm = {
  currentStep: 1,
  totalSteps: 5,
  data: {
    // Step 1 基本信息
    companyName: '',
    contactName: '',
    contactPhone: '',
    contactEmail: '',
    businessScope: '',
    // Step 2 主体资料
    businessLicense: null,
    legalRepName: '',
    legalRepIdType: '身份证',
    legalRepIdNumber: '',
    teamInfo: null,
    contactPersonName: '',
    contactPersonPhone: '',
    contactPersonEmail: '',
    techLeadName: '',
    techLeadPhone: '',
    techLeadExperience: '',
    financeLeadName: '',
    financeLeadPhone: '',
    bankName: '',
    bankAccount: '',
    bankAccountName: '',
    pastCases: [],
    riskCommitment: null,
    // Step 3 游戏资料（多游戏）
    games: [
      {
        gameName: '',
        gameType: '',
        gameplayDesc: '',
        gameplayVideo: null,
        ruleDoc: null,
        winRule: '',
        payoutRule: '',
        settlementLogic: '',
        abnormalRule: '',
        userRestriction: '',
        operationFlowchart: null,
        customerFaq: null,
        complaintRule: '',
        hasBot: 'no',
        botDetail: '',
      }
    ],
    currentGameIdx: 0,
    // Step 4 协议
    agreementAccepted: false,
  },

  // 跳到指定步骤
  goToStep(step) {
    if (step < 1 || step > this.totalSteps) return;
    this.currentStep = step;
    document.querySelectorAll('.apply-step').forEach(el => el.style.display = 'none');
    const target = document.getElementById('apply-step-' + step);
    if (target) target.style.display = 'block';
    document.querySelectorAll('.stepper-item').forEach((el, idx) => {
      const i = idx + 1;
      el.classList.remove('active', 'completed');
      if (i < step) el.classList.add('completed');
      else if (i === step) el.classList.add('active');
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // 自动保存
    this.autoSave();
  },

  next() {
    if (this.currentStep < this.totalSteps) {
      this.goToStep(this.currentStep + 1);
    }
  },

  prev() {
    if (this.currentStep > 1) {
      this.goToStep(this.currentStep - 1);
    }
  },

  // 自动保存（节流 30 秒）
  autoSaveTimer: null,
  autoSave() {
    clearTimeout(this.autoSaveTimer);
    this.autoSaveTimer = setTimeout(() => {
      // 序列化前过滤掉 File 对象（localStorage 不能存 File）
      const clean = JSON.parse(JSON.stringify(this.data, (k, v) => {
        if (v instanceof File) return { name: v.name, size: v.size, type: v.type };
        return v;
      }));
      if (DraftManager.save(clean)) {
        this.updateSaveStatus();
      }
    }, 30000);
  },

  updateSaveStatus() {
    const el = document.getElementById('save-status');
    if (el) {
      const draft = DraftManager.load();
      if (draft) {
        el.textContent = '草稿已自动保存于 ' + DraftManager.formatSavedAt(draft.savedAt);
      }
    }
  },

  // 加载草稿（页面初始化时）
  loadDraft() {
    const draft = DraftManager.load();
    if (draft && draft.data) {
      this.data = Object.assign(this.data, draft.data);
      this.updateSaveStatus();
      return true;
    }
    return false;
  },

  // 添加游戏
  addGame() {
    this.data.games.push({
      gameName: '',
      gameType: '',
      gameplayDesc: '',
      gameplayVideo: null,
      ruleDoc: null,
      winRule: '',
      payoutRule: '',
      settlementLogic: '',
      abnormalRule: '',
      userRestriction: '',
      operationFlowchart: null,
      customerFaq: null,
      complaintRule: '',
      hasBot: 'no',
      botDetail: '',
    });
    this.data.currentGameIdx = this.data.games.length - 1;
    this.autoSave();
  },

  // 删除游戏（至少保留 1 个）
  removeGame(idx) {
    if (this.data.games.length <= 1) return;
    this.data.games.splice(idx, 1);
    if (this.data.currentGameIdx >= this.data.games.length) {
      this.data.currentGameIdx = this.data.games.length - 1;
    }
    this.autoSave();
  },

  // 切换游戏 tab
  switchGame(idx) {
    this.data.currentGameIdx = idx;
    this.autoSave();
  },

  // 提交
  submit() {
    if (!this.data.agreementAccepted) {
      alert('请先勾选入驻协议');
      return;
    }
    // 模拟提交：跳到 Step 5
    DraftManager.clear();
    this.goToStep(5);
  },
};

// ============================================
// RoleContactModal - 通用"联系角色"弹窗
// 用于：审核顾问 / 专属客服 / 专属财务 / 专属产品经理 等
// 用法：onclick="RoleContactModal.open(ADVISOR_CONFIG)"
// ============================================
window.RoleContactModal = {
  // 弹窗 DOM 引用（懒创建）
  _el: null,

  // 渲染弹窗 HTML（一次性 DOM 模板）
  _ensureDOM() {
    if (this._el) return this._el;
    const div = document.createElement('div');
    div.className = 'modal-overlay role-contact-modal';
    div.id = 'rc-modal';
    div.innerHTML = `
      <div class="modal" style="max-width: 520px;" role="dialog" aria-modal="true">
        <div class="modal-head">
          <div>
            <div class="modal-title" data-rc="title">联系角色</div>
            <div class="modal-sub" data-rc="sub">—</div>
          </div>
          <button class="modal-close" data-rc="close" aria-label="关闭">×</button>
        </div>
        <div class="modal-body">
          <div class="advisor-card">
            <div class="advisor-avatar" data-rc="avatar">·</div>
            <div class="advisor-info">
              <div class="advisor-name">
                <span data-rc="name">—</span>
                <span class="advisor-badge" data-rc="status">● 在线</span>
              </div>
              <div class="advisor-role" data-rc="role">—</div>
              <div class="advisor-meta" data-rc="meta"></div>
            </div>
          </div>
          <div class="qr-row">
            <div class="qr-card">
              <div class="qr-img" aria-label="微信二维码占位"></div>
              <div class="qr-card-label">微信二维码</div>
              <div class="qr-card-desc" data-rc="wechatDesc">扫码添加</div>
            </div>
            <div class="qr-card">
              <div class="qr-img" aria-label="UmakeX 二维码占位"></div>
              <div class="qr-card-label">UmakeX</div>
              <div class="qr-card-desc" data-rc="umakexQrDesc">即时沟通 · 文件传输</div>
            </div>
          </div>
          <div class="umakex-promo">
            <div class="umakex-logo">U</div>
            <div class="umakex-info">
              <div class="umakex-title">
                UmakeX
                <span class="umakex-badge">Internal</span>
              </div>
              <div class="umakex-desc" data-rc="umakexDesc">Opulatrix 内部 IM 工具 · 端到端加密</div>
              <div class="umakex-features" data-rc="umakexFeatures"></div>
            </div>
          </div>
          <div class="download-row">
            <button class="download-btn"><span class="download-btn-icon">🍎</span>App Store</button>
            <button class="download-btn"><span class="download-btn-icon">▶</span>Google Play</button>
            <button class="download-btn"><span class="download-btn-icon">⬇</span>安卓 APK</button>
          </div>
        </div>
        <div class="modal-footer">
          <span style="font-size: var(--text-xs); color: var(--text-tertiary);" data-rc="footerNote">—</span>
          <button class="btn btn-ghost btn-sm" data-rc="footerClose">关闭</button>
        </div>
      </div>
    `;
    document.body.appendChild(div);
    // 关闭事件
    div.querySelector('[data-rc="close"]').addEventListener('click', () => this.close());
    div.querySelector('[data-rc="footerClose"]').addEventListener('click', () => this.close());
    div.addEventListener('click', (e) => { if (e.target === div) this.close(); });
    this._el = div;
    return div;
  },

  // 用 config 填充弹窗内容
  _fill(config) {
    const el = this._ensureDOM();
    const set = (key, val) => el.querySelector(`[data-rc="${key}"]`);
    set('title').textContent = config.title || '联系角色';
    set('sub').textContent = config.sub || '';
    set('avatar').textContent = (config.roleName || '?').charAt(0);
    set('name').textContent = config.roleName || '—';
    set('role').textContent = config.roleTitle || '';
    set('wechatDesc').textContent = config.wechatDesc || `扫码添加${config.roleName || ''}`;
    set('umakexQrDesc').textContent = config.umakexQrDesc || '即时沟通 · 文件传输';
    set('umakexDesc').textContent = config.umakexDesc || 'Opulatrix 内部 IM 工具 · 端到端加密';
    set('footerNote').textContent = config.footerNote || '';
    // meta 列表
    const metaEl = set('meta');
    metaEl.innerHTML = '';
    (config.metas || []).forEach((m, i) => {
      const span = document.createElement('span');
      span.className = 'advisor-meta-item';
      span.textContent = m;
      metaEl.appendChild(span);
    });
    // umakex features
    const featEl = set('umakexFeatures');
    featEl.innerHTML = '';
    (config.umakexFeatures || []).forEach((f) => {
      const span = document.createElement('span');
      span.className = 'umakex-feature';
      span.textContent = f;
      featEl.appendChild(span);
    });
  },

  // 打开弹窗
  open(config) {
    if (!config) return;
    this._fill(config);
    this._el.classList.add('open');
    document.body.style.overflow = 'hidden';
  },

  // 关闭弹窗
  close() {
    if (this._el) this._el.classList.remove('open');
    document.body.style.overflow = '';
  },
};

// ============================================
// 预置角色配置（直接引用即可）
// ============================================
window.ADVISOR_CONFIG = {
  title: '联系审核顾问',
  sub: '主体资质审核 · 预计 1-3 工作日反馈',
  roleName: '张明',
  roleTitle: '高级审核经理 · 5 年游戏商户审核经验',
  metas: ['⏱ 平均响应 < 30 分钟', '📞 已接入 1,284 家商户'],
  wechatDesc: '扫码添加顾问微信',
  umakexQrDesc: '即时沟通 · 文件传输',
  umakexDesc: 'Opulatrix 内部 IM 工具 · 端到端加密 · 已对接审核系统',
  umakexFeatures: ['即时消息', '文件传输', '语音通话', '审核进度同步'],
  footerNote: '工作日 9:00 - 21:00 · 节假日值班响应',
};

window.CS_CONFIG = {
  title: '联系专属客服',
  sub: '模式参数调整 · 段位切换咨询 · 7×24 在线',
  roleName: '李娜',
  roleTitle: '专属客户经理 · 服务游戏商户 3 年',
  metas: ['⏱ 平均响应 < 15 分钟', '🎯 服务商户 856 家'],
  wechatDesc: '扫码添加专属客服',
  umakexQrDesc: '即时沟通 · 模式参数同步',
  umakexDesc: 'Opulatrix 内部 IM 工具 · 端到端加密 · 已对接商户后台',
  umakexFeatures: ['即时消息', '文件传输', '语音通话', '模式参数同步'],
  footerNote: '全年 7×24 在线响应 · 平均响应 < 15 分钟',
};

// ============================================
// Test hook：URL ?rc=advisor / ?rc=cs 自动开弹窗（截图用）
// ============================================
(function () {
  if (typeof window === 'undefined') return;
  document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(location.search);
    const rc = params.get('rc');
    if (rc === 'advisor' && window.ADVISOR_CONFIG) {
      RoleContactModal.open(ADVISOR_CONFIG);
    } else if (rc === 'cs' && window.CS_CONFIG) {
      RoleContactModal.open(CS_CONFIG);
    }
  });
})();

// ============================================
// AgreementModal - "查看协议全文" 弹窗
// 用法：onclick="AgreementModal.open()"
// 默认从 #agreement-info 数据自动取编号/版本/签署日
// ============================================
window.AgreementModal = {
  _el: null,

  _ensureDOM() {
    if (this._el) return this._el;
    const div = document.createElement('div');
    div.className = 'modal-overlay agreement-modal';
    div.id = 'agreement-modal';
    div.innerHTML = `
      <div class="modal" role="dialog" aria-modal="true">
        <div class="modal-head">
          <div>
            <div class="modal-title">Game Hub 合作协议（全文）</div>
            <div class="modal-sub" data-ag="meta">—</div>
          </div>
          <button class="modal-close" data-ag="close" aria-label="关闭">×</button>
        </div>
        <div class="modal-body agreement-body">

          <section class="agreement-section">
            <div class="agreement-section-no">第 1 条 · 合作模式</div>
            <p>本商户按<strong>「生态分润模式」</strong>运行，不参与游戏开发，不主导游戏运营。Game Hub 提供用户接入、社区、市场推广、数据反馈等连接性服务；开发团队保有游戏的运营主权与创作主权。</p>
          </section>

          <section class="agreement-section">
            <div class="agreement-section-no">第 2 条 · 数据接入与反馈</div>
            <p>双方按《数据接入规范 v3.2》执行 API / SDK 接入。平台数据每日脱敏后同步商户，差异 ≥ 0.5% 时自动预警并触发对账工单。</p>
          </section>

          <section class="agreement-section">
            <div class="agreement-section-no">第 3 条 · 平台角色</div>
            <p>Game Hub 不下场与玩家对局，不为任何一方承担输赢。平台角色是<strong>规则维护者</strong>，不是对局者；具体细化条款见《平台行为准则》。</p>
          </section>

          <section class="agreement-section">
            <div class="agreement-section-no">第 4 条 · 双方责任</div>
            <p>开发团队保有游戏运营主权与创作主权，平台只提供用户、社区、市场、数据反馈等连接性服务，绝不主导商户的产品决策。运营与版本节奏由开发团队决定。</p>
          </section>

          <section class="agreement-section">
            <div class="agreement-section-no">第 5 条 · 分润比例</div>
            <p>按协议附件约定比例（当前档次 A · 8.5%）执行。本月分润由<strong>流水分润</strong>与<strong>UMDT 充值分润</strong>两部分组成，依据实际业务数据计算，全部台账可查。</p>
          </section>

          <section class="agreement-section">
            <div class="agreement-section-no">第 6 条 · 重新评估机制</div>
            <p>水位显著变化时按协议约定开展协商。协商流程、档位升降条款见附件 A《档位规则》。必要时签订补充协议，补充协议与本协议具有同等效力。</p>
          </section>

          <section class="agreement-section">
            <div class="agreement-section-no">第 7 条 · 数据脱敏与隐私</div>
            <p>玩家个人信息严格遵守《个人信息保护法》及相关法律法规。平台数据每日脱敏后同步商户，原始数据不公开、不导出、不向第三方披露。</p>
          </section>

          <section class="agreement-section">
            <div class="agreement-section-no">第 8 条 · 双方权利与争议处理</div>
            <p>模式切换、补充协议、争议处理按本协议附件执行。协商不成时，提交<strong>北京仲裁委员会</strong>按其届时有效的仲裁规则进行仲裁，仲裁裁决为终局裁决。</p>
          </section>

          <section class="agreement-section agreement-appendix">
            <div class="agreement-section-no">附录 A · 档位规则</div>
            <p>A 档 50-200 万 / B 档 200-500 万 / C 档 500-1000 万 / D 档 1000 万以上。档位越高，协议分润比例与 UMDT 充值分润比例越优。</p>
          </section>
          <section class="agreement-section agreement-appendix">
            <div class="agreement-section-no">附录 B · 数据接入规范</div>
            <p>API 接口、Webhook、SDK、数据上报顺序、脱敏字段表、错误码表详见《数据接入规范 v3.2》。本协议附件与正文具有同等效力。</p>
          </section>

          <div class="agreement-signoff">
            本协议自签署日起生效，双方各执一份，具有同等法律效力。
          </div>
        </div>
        <div class="modal-footer">
          <span class="agreement-foot-meta" data-ag="footMeta">—</span>
          <div style="display: inline-flex; gap: var(--space-2);">
            <button class="btn btn-ghost btn-sm" data-ag="downloadPdf">下载 PDF 副本</button>
            <button class="btn btn-outline btn-sm" data-ag="supplement">申请补充协议</button>
            <button class="btn btn-primary btn-sm" data-ag="closeFooter">已阅读 · 关闭</button>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(div);
    div.querySelector('[data-ag="close"]').addEventListener('click', () => this.close());
    div.querySelector('[data-ag="closeFooter"]').addEventListener('click', () => this.close());
    div.querySelector('[data-ag="downloadPdf"]').addEventListener('click', () => {
      this._toast('PDF 副本生成中 · 完成后将发送至本商户的对公联系人邮箱');
    });
    div.querySelector('[data-ag="supplement"]').addEventListener('click', () => {
      this.close();
      if (window.RoleContactModal && window.ADVISOR_CONFIG) {
        window.RoleContactModal.open({
          ...window.ADVISOR_CONFIG,
          title: '申请补充协议',
          sub: '由对接审核顾问跟进 · 1-2 个工作日内回复',
          footerNote: '提交后请保持 UmakeX / 微信畅通',
        });
      } else {
        this._toast('已记录 · 审核顾问会在 1-2 个工作日内联系您');
      }
    });
    div.addEventListener('click', (e) => { if (e.target === div) this.close(); });
    this._el = div;
    return div;
  },

  open() {
    const el = this._ensureDOM();
    // 直接用 mock 数据（避免与 #agreement-info 内嵌套 div 误抓重复 label）
    el.querySelector('[data-ag="meta"]').textContent =
      '编号 AGREEMENT-2026-M001-V3 · 版本 v3.2 · 签署日 2026-06-30 · 有效期至 2027-06-30';
    el.querySelector('[data-ag="footMeta"]').textContent =
      '完整生效文本 · 编号 AGREEMENT-2026-M001-V3 · 版本 v3.2';
    el.classList.add('open');
  },

  close() {
    if (this._el) this._el.classList.remove('open');
  },

  _toast(msg) {
    let t = document.getElementById('ag-toast');
    if (!t) {
      t = document.createElement('div');
      t.id = 'ag-toast';
      document.body.appendChild(t);
    }
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(this._toastTimer);
    this._toastTimer = setTimeout(() => t.classList.remove('show'), 2400);
  },
};

// ============================================
// BellDropdown - 顶栏消息铃铛下拉
// 渲染位置：.app-topbar-actions 之前
// 用法：见 _renderBellIntoTopbar() 末尾 init 块
// ============================================
window.BellDropdown = {
  _el: null,

  // 注入顶栏（追加到 topbar 末尾 → 顶栏最右）
  inject() {
    document.querySelectorAll('.app-topbar').forEach(topbar => {
      if (topbar.querySelector('.bell-wrap')) return;
      const wrap = document.createElement('div');
      wrap.className = 'bell-wrap';
      wrap.innerHTML = `
        <button class="bell-pill" data-bell-btn onclick="BellDropdown.toggle(event)" aria-label="消息中心" aria-haspopup="true">
          <span class="bell-pill-icon">🔔</span>
          <span class="bell-pill-text">消息中心</span>
          <span class="bell-pill-arrow">▾</span>
          <span class="bell-badge" data-bell-badge></span>
        </button>
        <div class="bell-dropdown" data-bell-dropdown role="menu">
          <div class="bell-head">
            <div class="bell-head-title">消息中心 <span class="bell-head-count" data-bell-count></span></div>
            <button class="bell-head-action" onclick="BellDropdown.markAllRead(event)">全部已读</button>
          </div>
          <div class="bell-list" data-bell-list></div>
          <div class="bell-foot">
            <a class="bell-foot-link" href="messages.html">查看全部消息 →</a>
          </div>
        </div>
      `;
      topbar.appendChild(wrap);

      // hover 保持打开（click outside 才关闭）
      let leaveTimer = null;
      wrap.addEventListener('mouseenter', () => {
        clearTimeout(leaveTimer);
        const dd = wrap.querySelector('[data-bell-dropdown]');
        if (dd) {
          document.querySelectorAll('.bell-dropdown.open').forEach(d => { if (d !== dd) d.classList.remove('open'); });
          dd.classList.add('open');
          wrap.querySelector('.bell-pill').classList.add('open');
        }
      });
      wrap.addEventListener('mouseleave', () => {
        leaveTimer = setTimeout(() => {
          const dd = wrap.querySelector('[data-bell-dropdown]');
          if (dd) dd.classList.remove('open');
          wrap.querySelector('.bell-pill').classList.remove('open');
        }, 200);
      });
    });
    this.refresh();
  },

  // 刷新 badge + 列表
  refresh() {
    const messages = (window.MOCK && window.MOCK.messages) || [];
    const unread = messages.filter(m => !m.read).length;
    const badgeText = unread > 0 ? (unread > 99 ? '99+' : String(unread)) : '';
    document.querySelectorAll('[data-bell-badge]').forEach(b => {
      b.textContent = badgeText;
    });
    document.querySelectorAll('[data-sidebar-badge]').forEach(b => {
      b.textContent = badgeText;
    });
    document.querySelectorAll('[data-bell-count]').forEach(c => {
      c.textContent = unread > 0 ? `${unread} 条未读` : '';
    });
    const list = document.querySelector('[data-bell-list]');
    if (list) {
      const top5 = [...messages].sort((a, b) => {
        if (a.pinned && !b.pinned) return -1;
        if (!a.pinned && b.pinned) return 1;
        return b.date.localeCompare(a.date);
      }).slice(0, 5);
      if (top5.length === 0) {
        list.innerHTML = '<div class="bell-empty"><div class="bell-empty-icon">📭</div>暂无消息</div>';
      } else {
        list.innerHTML = top5.map(m => this._renderItem(m)).join('');
      }
    }
  },

  _renderItem(m) {
    const iconMap = {
      announce: { label: '公', cls: 'announce' },
      system: { label: '系', cls: 'system' },
      review: { label: '审', cls: 'review' },
      finance: { label: '¥', cls: 'finance' },
      appeal: { label: '诉', cls: 'appeal' },
    };
    const ic = iconMap[m.type] || { label: '?', cls: 'system' };
    const actionsHtml = `
      <div class="bell-item-actions">
        <button class="bell-item-action" onclick="BellDropdown.markOne(event, '${m.id}')" ${m.read ? 'disabled title="已是已读"' : 'title="标记为已读"'}>
          <span class="bell-item-action-icon">✓</span>
          <span>标记已读</span>
        </button>
        <button class="bell-item-delete" onclick="BellDropdown.deleteOne(event, '${m.id}')" title="删除" aria-label="删除消息">
          <span class="bell-item-delete-icon">🗑</span>
        </button>
      </div>
    `;
    return `
      <div class="bell-item ${m.read ? '' : 'unread'}" data-msg-id="${m.id}">
        <div class="bell-item-icon ${ic.cls}">${ic.label}</div>
        <div class="bell-item-body">
          <div class="bell-item-title">${m.pinned ? '📌 ' : ''}${this._esc(m.title)}</div>
          <div class="bell-item-preview">${this._esc(m.preview)}</div>
        </div>
        <div class="bell-item-time">${this._fmtDate(m.date)}</div>
        ${actionsHtml}
      </div>
    `;
  },

  // 打开/关闭下拉
  toggle(e) {
    e.stopPropagation();
    const dd = document.querySelector('[data-bell-dropdown]');
    if (!dd) return;
    const willOpen = !dd.classList.contains('open');
    // 关闭其他可能打开的下拉
    document.querySelectorAll('.bell-dropdown.open').forEach(d => d.classList.remove('open'));
    document.querySelectorAll('.bell-pill.open').forEach(b => b.classList.remove('open'));
    if (willOpen) {
      dd.classList.add('open');
      const pill = document.querySelector('[data-bell-btn]');
      if (pill) pill.classList.add('open');
    }
  },

  close() {
    document.querySelectorAll('.bell-dropdown.open').forEach(d => d.classList.remove('open'));
    document.querySelectorAll('.bell-pill.open').forEach(b => b.classList.remove('open'));
  },

  // 全部已读
  markAllRead(e) {
    e.stopPropagation();
    if (!window.MOCK || !window.MOCK.messages) return;
    window.MOCK.messages.forEach(m => m.read = true);
    this.refresh();
  },

  // 标记单条已读（hover 出现的"标记已读"按钮）
  markOne(e, id) {
    e.stopPropagation();
    e.preventDefault();
    if (!window.MOCK || !window.MOCK.messages) return;
    const m = window.MOCK.messages.find(x => x.id === id);
    if (!m || m.read) return;
    m.read = true;
    this.refresh();
  },

  // 删除单条（hover 出现的"🗑"按钮）
  deleteOne(e, id) {
    e.stopPropagation();
    e.preventDefault();
    if (!window.MOCK || !window.MOCK.messages) return;
    window.MOCK.messages = window.MOCK.messages.filter(m => m.id !== id);
    this.refresh();
  },

  _esc(s) {
    return String(s || '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  },

  _fmtDate(d) {
    if (!d) return '';
    const dt = new Date(d.replace(' ', 'T'));
    if (isNaN(dt)) return d;
    const now = new Date();
    const sameDay = dt.toDateString() === now.toDateString();
    if (sameDay) return dt.getHours().toString().padStart(2,'0') + ':' + dt.getMinutes().toString().padStart(2,'0');
    const diff = (now - dt) / 86400000;
    if (diff < 7) return Math.floor(diff) + ' 天前';
    return (dt.getMonth()+1) + '/' + dt.getDate();
  },
};

// 自动注入（DOMContentLoaded）
document.addEventListener('DOMContentLoaded', () => {
  if (typeof BellDropdown !== 'undefined' && document.querySelector('.app-topbar')) {
    BellDropdown.inject();
    // test hook：URL ?bell=open 自动展开；?hover=msg-001 模拟单条 hover；?force-read=msg-101 强制标记为已读
    const params = new URLSearchParams(location.search);
    if (params.get('bell') === 'open') {
      // 强制标记为已读（在 refresh 之前）
      const forceRead = params.get('force-read');
      if (forceRead && window.MOCK && window.MOCK.messages) {
        const m = window.MOCK.messages.find(x => x.id === forceRead);
        if (m) m.read = true;
      }
      // 重新刷新一次（让 force-read 生效）
      if (typeof BellDropdown !== 'undefined') BellDropdown.refresh();
      setTimeout(() => {
        const dd = document.querySelector('[data-bell-dropdown]');
        const pill = document.querySelector('[data-bell-btn]');
        if (dd) dd.classList.add('open');
        if (pill) pill.classList.add('open');
        // 模拟 hover 单条
        const hoverId = params.get('hover');
        if (hoverId) {
          const item = document.querySelector(`.bell-item[data-msg-id="${hoverId}"]`);
          if (item) {
            const actions = item.querySelector('.bell-item-actions');
            const time = item.querySelector('.bell-item-time');
            if (actions) actions.style.display = 'inline-flex';
            if (time) time.style.opacity = '0';
          }
        }
      }, 50);
    }
  }
});

// 点击外部关闭
document.addEventListener('click', (e) => {
  if (!e.target.closest('.bell-wrap')) {
    document.querySelectorAll('.bell-dropdown.open').forEach(d => d.classList.remove('open'));
    document.querySelectorAll('.bell-pill.open').forEach(b => b.classList.remove('open'));
  }
});
