/* ============================================================
 * contacts.js · 通讯录页 · 好友背景画像 + 微信聊天导入
 * ============================================================ */
(function () {
  'use strict';

  /* ---------- 1. 画像字段配置（chip / radio 选项） ---------- */
  const PERSONA_TRAITS = [
    '务实', '重效率', '完美主义', '创意思维', '数据控', '感性',
    '爱社交', '内向', '果断', '犹豫', '乐观', '谨慎', '话多', '惜字如金'
  ];
  const PERSONA_MOOD = ['温和', '急躁', '冷淡', '热情', '理性', '挑剔', '纠结'];
  const PERSONA_COMMUNICATION = [
    '数据导向', '关系导向', '视觉导向', '逻辑导向', '故事导向'
  ];
  const PERSONA_FAMILY = {
    ageRange: ['18-25', '26-30', '31-40', '41-50', '50+'],
    marital: ['未婚', '已婚', '离异', '保密'],
    children: ['无', '1个', '2个', '3个+', '保密'],
    role: ['爸爸', '妈妈', '儿女', '配偶', '单身', '长辈']
  };
  const PERSONA_FINANCE = {
    level: [
      { v: '高净值',   t: '年收入 100w+ / 资产 1000w+' },
      { v: '中产',     t: '年收入 30-100w' },
      { v: '大众',     t: '年收入 30w 以下' }
    ],
    jobs: [
      '企业高管', '医生', '律师', '教师', '公务员', '工程师',
      '设计师', '媒体人', '创业者', '自由职业', '投资人', '退休'
    ],
    interests: [
      '理财', '房产', '股票', '收藏', '旅游', '健身', '育儿',
      '美食', '奢侈品', '科技', '教育', '医疗', '美容'
    ]
  };

  function el(tag, cls, html) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html !== undefined) e.innerHTML = html;
    return e;
  }
  function escapeHtml(s) {
    return (s || '').replace(/[&<>"']/g, (c) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));
  }
  function storageKey(friendId) { return 'umakex_persona_' + friendId; }
  function loadPersona(friendId) {
    try {
      const raw = localStorage.getItem(storageKey(friendId));
      return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
  }
  function savePersona(friendId, persona) {
    try {
      localStorage.setItem(storageKey(friendId), JSON.stringify(persona));
      return true;
    } catch (e) { return false; }
  }
  function emptyPersona(friend) {
    return {
      friendId: friend.id,
      friendName: friend.name,
      base: { source: 'manual', importDate: '', fileName: '' },
      personality: { traits: [], mood: '', communication: '' },
      family: { ageRange: '', marital: '', children: '', role: '', note: '' },
      finance: { level: '', jobs: [], interests: [], note: '' },
      salesNotes: '',
      chats: []
    };
  }

  /* ---------- 2. 好友项点击 → 选中态 + 渲染详情 ---------- */
  const detailEl = document.getElementById('contactsDetail');
  const emptyEl  = document.getElementById('contactsEmpty');

  function extractAvatarStyle(item) {
    const avatar = item.querySelector('.avatar');
    return avatar ? avatar.getAttribute('style') || '' : '';
  }
  function extractAvatarInitial(item) {
    const avatar = item.querySelector('.avatar');
    if (!avatar) return '';
    const svg = avatar.querySelector('svg');
    return svg ? '' : (avatar.textContent.trim()[0] || '');
  }
  function getFriendFromItem(item) {
    const name = (item.querySelector('.contact-item__name') || {}).textContent || '未命名';
    const id   = (item.querySelector('.contact-item__id')   || {}).textContent || ('id_' + Date.now());
    return {
      name: name.trim(),
      id:   id.trim(),
      avatarStyle: extractAvatarStyle(item),
      avatarInitial: extractAvatarInitial(item)
    };
  }

  let currentFriend = null;

  function selectFriend(item) {
    document.querySelectorAll('.contact-item.is-selected').forEach((n) => n.classList.remove('is-selected'));
    item.classList.add('is-selected');
    const friend = getFriendFromItem(item);
    currentFriend = friend;
    detailEl.setAttribute('data-friend-id', friend.id);
    renderDetail(friend);
    emptyEl.style.display = 'none';
    detailEl.setAttribute('data-state', 'active');
  }

  /* ---------- 3. 渲染详情面板 ---------- */
  function renderDetail(friend) {
    const persona = loadPersona(friend.id) || emptyPersona(friend);
    detailEl.innerHTML = buildDetailHTML(friend, persona);
    bindDetailHandlers(friend, persona);
  }
  function buildDetailHTML(friend, p) {
    return (
      // 顶部
      '<header class="detail-head">' +
        '<button class="detail-head__back" id="detailBack" type="button" title="返回好友列表">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">' +
            '<path d="m15 18-6-6 6-6"/></svg>' +
        '</button>' +
        '<div class="detail-head__avatar" style="' + friend.avatarStyle + '">' +
          (friend.avatarInitial || '') +
        '</div>' +
        '<div class="detail-head__info">' +
          '<div class="detail-head__name">' + escapeHtml(friend.name) +
            (p && p.chats && p.chats.length ? '<span class="persona-summary-badge">已画像</span>' : '') +
          '</div>' +
          '<div class="detail-head__id">ID ' + escapeHtml(friend.id) + ' · 来自 UMakex 通讯录</div>' +
        '</div>' +
      '</header>' +
      // Tabs
      '<nav class="detail-tabs">' +
        '<button class="detail-tab is-active" data-tab="profile" type="button">资料</button>' +
        '<button class="detail-tab" data-tab="persona" type="button">' +
          '背景画像 ' +
          '<span class="detail-tab__count" id="personaFillCount">' + countPersonaFields(p) + '</span>' +
        '</button>' +
        '<button class="detail-tab" data-tab="history" type="button">' +
          '聊天历史 ' +
          '<span class="detail-tab__count" id="chatCount">' + (p.chats ? p.chats.length : 0) + '</span>' +
        '</button>' +
      '</nav>' +
      // 3 Pane
      '<div class="detail-pane is-active" data-pane="profile">' +
        buildProfilePane(friend, p) +
      '</div>' +
      '<div class="detail-pane" data-pane="persona">' +
        buildPersonaPane(friend, p) +
      '</div>' +
      '<div class="detail-pane" data-pane="history">' +
        buildHistoryPane(friend, p) +
      '</div>'
    );
  }
  function countPersonaFields(p) {
    let n = 0;
    if (p.personality.traits.length) n += p.personality.traits.length;
    if (p.personality.mood) n++;
    if (p.personality.communication) n++;
    if (p.family.ageRange) n++;
    if (p.family.marital) n++;
    if (p.family.children) n++;
    if (p.family.role) n++;
    if (p.family.note) n++;
    if (p.finance.level) n++;
    if (p.finance.jobs.length) n += p.finance.jobs.length;
    if (p.finance.interests.length) n += p.finance.interests.length;
    if (p.finance.note) n++;
    if (p.salesNotes) n++;
    return n;
  }

  function buildProfilePane(friend, p) {
    return (
      '<div class="profile-grid">' +
        '<div class="profile-row"><div class="profile-row__label">姓名</div><div class="profile-row__value">' + escapeHtml(friend.name) + '</div></div>' +
        '<div class="profile-row"><div class="profile-row__label">ID</div><div class="profile-row__value">' + escapeHtml(friend.id) + '</div></div>' +
        '<div class="profile-row"><div class="profile-row__label">来源</div><div class="profile-row__value">' +
          (p.base.source === 'wechat-import'
            ? '微信聊天导入 · ' + (p.base.importDate || '今日') +
              (p.base.fileName ? ' · ' + escapeHtml(p.base.fileName) : '')
            : 'UMakex 通讯录') +
        '</div></div>' +
        '<div class="profile-row"><div class="profile-row__label">导入对话</div><div class="profile-row__value">' +
          (p.chats.length
            ? p.chats.length + ' 条'
            : '<span class="profile-empty">尚未导入 · 可在「聊天历史」上传 .txt 或粘贴文本</span>') +
        '</div></div>' +
        '<div class="profile-row"><div class="profile-row__label">画像字段</div><div class="profile-row__value">' +
          countPersonaFields(p) + ' 项已填写 · AI 销冠在聊天时会引用</div></div>' +
        '<div class="profile-row"><div class="profile-row__label">上次更新</div><div class="profile-row__value">' +
          (p.__updatedAt || '<span class="profile-empty">未更新</span>') + '</div></div>' +
      '</div>'
    );
  }

  function buildPersonaPane(friend, p) {
    return (
      '<div class="persona-section">' +
        '<div class="persona-section__head">' +
          '<div class="persona-section__title">🧠 性格脾气</div>' +
          '<div class="persona-section__hint">多选 / 单选 · 帮 AI 知道怎么说话</div>' +
        '</div>' +
        '<div class="chip-row" data-persona-key="personality.traits">' +
          chipBtns(PERSONA_TRAITS, p.personality.traits) +
        '</div>' +
        '<div class="persona-section__head" style="margin-top:14px;"><div class="persona-section__title">整体情绪</div></div>' +
        '<div class="persona-radio-row" data-persona-key="personality.mood">' +
          radioBtns(PERSONA_MOOD, p.personality.mood) +
        '</div>' +
        '<div class="persona-section__head" style="margin-top:14px;"><div class="persona-section__title">沟通偏好</div></div>' +
        '<div class="persona-radio-row" data-persona-key="personality.communication">' +
          radioBtns(PERSONA_COMMUNICATION, p.personality.communication) +
        '</div>' +
      '</div>' +

      '<div class="persona-section">' +
        '<div class="persona-section__head">' +
          '<div class="persona-section__title">🏠 家庭背景</div>' +
          '<div class="persona-section__hint">年龄段 · 婚姻 · 子女 · 角色</div>' +
        '</div>' +
        '<div class="persona-section__head" style="margin:8px 0 6px;"><div class="persona-section__title">年龄段</div></div>' +
        '<div class="persona-radio-row" data-persona-key="family.ageRange">' +
          radioBtns(PERSONA_FAMILY.ageRange, p.family.ageRange) +
        '</div>' +
        '<div class="persona-section__head" style="margin:12px 0 6px;"><div class="persona-section__title">婚姻</div></div>' +
        '<div class="persona-radio-row" data-persona-key="family.marital">' +
          radioBtns(PERSONA_FAMILY.marital, p.family.marital) +
        '</div>' +
        '<div class="persona-section__head" style="margin:12px 0 6px;"><div class="persona-section__title">子女</div></div>' +
        '<div class="persona-radio-row" data-persona-key="family.children">' +
          radioBtns(PERSONA_FAMILY.children, p.family.children) +
        '</div>' +
        '<div class="persona-section__head" style="margin:12px 0 6px;"><div class="persona-section__title">家庭角色</div></div>' +
        '<div class="persona-radio-row" data-persona-key="family.role">' +
          radioBtns(PERSONA_FAMILY.role, p.family.role) +
        '</div>' +
        '<div class="persona-section__head" style="margin:12px 0 6px;"><div class="persona-section__title">备注</div></div>' +
        '<textarea class="persona-textarea" data-persona-key="family.note" placeholder="自由填写，例如：配偶是同行业 / 父母同住 / 喜欢接送孩子上下学">' +
          escapeHtml(p.family.note) + '</textarea>' +
      '</div>' +

      '<div class="persona-section">' +
        '<div class="persona-section__head">' +
          '<div class="persona-section__title">💰 资产背景</div>' +
          '<div class="persona-section__hint">帮助 AI 推销匹配价位</div>' +
        '</div>' +
        '<div class="persona-section__head" style="margin:8px 0 6px;"><div class="persona-section__title">资产级别</div></div>' +
        '<div class="persona-radio-row" data-persona-key="finance.level">' +
          PERSONA_FINANCE.level.map((o) => (
            '<button class="chip' + (p.finance.level === o.v ? ' is-active' : '') + '"' +
              ' data-value="' + escapeHtml(o.v) + '" type="button">' + escapeHtml(o.v) + '</button>'
          )).join('') +
        '</div>' +
        '<div class="persona-section__head" style="margin:12px 0 6px;"><div class="persona-section__title">职业（多选）</div></div>' +
        '<div class="chip-row" data-persona-key="finance.jobs">' +
          chipBtns(PERSONA_FINANCE.jobs, p.finance.jobs) +
        '</div>' +
        '<div class="persona-section__head" style="margin:12px 0 6px;"><div class="persona-section__title">兴趣 / 关注（多选）</div></div>' +
        '<div class="chip-row" data-persona-key="finance.interests">' +
          chipBtns(PERSONA_FINANCE.interests, p.finance.interests) +
        '</div>' +
        '<div class="persona-section__head" style="margin:12px 0 6px;"><div class="persona-section__title">备注</div></div>' +
        '<textarea class="persona-textarea" data-persona-key="finance.note" placeholder="自由备注，例如：近期关注美元保险 / 名下有 2 套房 / 计划明年移民">' +
          escapeHtml(p.finance.note) + '</textarea>' +
      '</div>' +

      '<div class="persona-section">' +
        '<div class="persona-section__head">' +
          '<div class="persona-section__title">📝 销售备注</div>' +
          '<div class="persona-section__hint">给 AI 销冠看的内部备注</div>' +
        '</div>' +
        '<textarea class="persona-textarea" data-persona-key="salesNotes" placeholder="例：上周问过 8000 套餐 · 偏好下午联系 · 老婆比他更决策">' +
          escapeHtml(p.salesNotes) + '</textarea>' +
      '</div>' +

      // 保存条
      '<div class="detail-actions">' +
        '<span class="detail-actions__hint">保存后会同步给 AI 销冠，下次聊天立即引用</span>' +
        '<button class="detail-actions__btn" id="detailSave" type="button">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
            '<path d="M5 13l4 4L19 7"/></svg>' +
          '保存画像' +
        '</button>' +
      '</div>'
    );
  }

  function buildHistoryPane(friend, p) {
    return (
      '<div class="importer">' +
        '<div class="importer__drop" id="importDrop">' +
          '<svg class="importer__drop-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">' +
            '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/>' +
            '<line x1="12" y1="3" x2="12" y2="15"/></svg>' +
          '<div class="importer__drop-title">拖入微信聊天记录 (.txt)</div>' +
          '<div class="importer__drop-sub">支持 文本/CSV · 单文件最大 5MB</div>' +
          '<input type="file" id="importFile" accept=".txt,.csv,text/plain" style="display:none" />' +
        '</div>' +
        '<div class="importer__or">或粘贴聊天文本</div>' +
        '<textarea class="importer__paste" id="importPaste" placeholder="例如：&#10;2024-03-15 10:23 张总 我们考虑这个产品&#10;2024-03-15 10:25 我 好的张总，给您发资料..."></textarea>' +
        '<div class="importer__btn-row">' +
          '<button class="importer__btn" id="importFileBtn" type="button">📁 选择文件</button>' +
          '<button class="importer__btn importer__btn--primary" id="importParseBtn" type="button">解析并导入</button>' +
          (p.chats.length ? '<button class="importer__btn" id="importClearBtn" type="button">清空</button>' : '') +
        '</div>' +
      '</div>' +

      '<div class="imported-chats">' +
        '<div class="imported-chats__head">' +
          '<div class="imported-chats__title">💬 已导入对话</div>' +
          '<span class="imported-chats__count" id="importedCount">' + p.chats.length + ' 条</span>' +
        '</div>' +
        (p.chats.length
          ? '<div class="chat-mini-list">' + p.chats.map((c) => renderChatMini(c, friend)).join('') + '</div>'
          : '<div class="imported-chats__empty">还没导入对话 · 解析后会显示在这里</div>') +
      '</div>'
    );
  }
  function renderChatMini(c, friend) {
    const isSelf = c.role === 'self';
    const initial = isSelf ? 'M' : (friend.avatarInitial || friend.name[0] || '?');
    const colorStyle = isSelf ? 'background:#87CEEB' : friend.avatarStyle;
    return (
      '<div class="chat-mini' + (isSelf ? ' chat-mini--self' : '') + '">' +
        '<div class="chat-mini__role" style="' + colorStyle + '">' + escapeHtml(initial) + '</div>' +
        '<div class="chat-mini__body">' +
          '<div class="chat-mini__time">' + escapeHtml(c.time || '—') + ' · ' + (isSelf ? '我' : escapeHtml(friend.name)) + '</div>' +
          '<div class="chat-mini__text">' + escapeHtml(c.text) + '</div>' +
        '</div>' +
      '</div>'
    );
  }

  /* ---------- 4. Chip / radio 按钮工厂 ---------- */
  function chipBtns(options, activeArr) {
    const set = new Set(activeArr || []);
    return options.map((o) =>
      '<button class="chip' + (set.has(o) ? ' is-active' : '') + '" data-value="' + escapeHtml(o) + '" type="button">' +
        escapeHtml(o) +
      '</button>'
    ).join('');
  }
  function radioBtns(options, activeVal) {
    return options.map((o) =>
      '<button class="chip' + (activeVal === o ? ' is-active' : '') + '" data-value="' + escapeHtml(o) + '" type="button">' +
        escapeHtml(o) +
      '</button>'
    ).join('');
  }

  /* ---------- 5. Bind handlers ---------- */
  function setNested(obj, path, value) {
    const parts = path.split('.');
    let o = obj;
    for (let i = 0; i < parts.length - 1; i++) {
      if (!o[parts[i]]) o[parts[i]] = {};
      o = o[parts[i]];
    }
    o[parts[parts.length - 1]] = value;
  }
  function getNested(obj, path) {
    return path.split('.').reduce((o, k) => (o ? o[k] : undefined), obj);
  }

  function gatherCurrentPersona() {
    const persona = loadPersona(currentFriend.id) || emptyPersona(currentFriend);
    // 重置数组字段以便重收集
    persona.personality.traits = [];
    persona.finance.jobs = [];
    persona.finance.interests = [];

    detailEl.querySelectorAll('[data-persona-key]').forEach((node) => {
      const key = node.getAttribute('data-persona-key');
      if (node.classList.contains('chip-row') || node.classList.contains('persona-radio-row')) {
        const active = node.querySelectorAll('.chip.is-active');
        const values = Array.from(active).map((c) => c.getAttribute('data-value'));
        if (node.classList.contains('persona-radio-row')) {
          setNested(persona, key, values[0] || '');
        } else {
          setNested(persona, key, values);
        }
      } else if (node.tagName === 'TEXTAREA' || node.tagName === 'INPUT') {
        setNested(persona, key, node.value || '');
      }
    });
    return persona;
  }

  function bindDetailHandlers(friend, persona) {
    // 返回
    const back = document.getElementById('detailBack');
    if (back) back.addEventListener('click', () => {
      detailEl.setAttribute('data-state', 'hidden');
      emptyEl.style.display = '';
      document.querySelectorAll('.contact-item.is-selected').forEach((n) => n.classList.remove('is-selected'));
      currentFriend = null;
    });

    // Tab 切换
    detailEl.querySelectorAll('.detail-tab').forEach((tab) => {
      tab.addEventListener('click', () => {
        const id = tab.dataset.tab;
        detailEl.querySelectorAll('.detail-tab').forEach((t) => t.classList.toggle('is-active', t === tab));
        detailEl.querySelectorAll('.detail-pane').forEach((p) => {
          p.classList.toggle('is-active', p.dataset.pane === id);
        });
      });
    });

    // Chip 单 / 多选
    detailEl.querySelectorAll('.chip-row, .persona-radio-row').forEach((row) => {
      const isMulti = row.classList.contains('chip-row');
      row.addEventListener('click', (e) => {
        const btn = e.target.closest('.chip');
        if (!btn) return;
        if (isMulti) {
          btn.classList.toggle('is-active');
        } else {
          row.querySelectorAll('.chip').forEach((c) => c.classList.remove('is-active'));
          btn.classList.add('is-active');
        }
      });
    });

    // 保存
    const save = document.getElementById('detailSave');
    if (save) save.addEventListener('click', () => {
      const p = gatherCurrentPersona();
      p.__updatedAt = new Date().toLocaleString('zh-CN', { hour12: false });
      save.setAttribute('data-loaded', '1');
      if (savePersona(friend.id, p)) {
        const orig = save.innerHTML;
        save.classList.add('detail-actions__btn-saved');
        save.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 13l4 4L19 7"/></svg> 已保存 · AI 销冠已读到';
        setTimeout(() => {
          save.classList.remove('detail-actions__btn-saved');
          save.innerHTML = orig;
          // 同步 tab count
          const cnt = document.getElementById('personaFillCount');
          if (cnt) cnt.textContent = countPersonaFields(p);
          // 同步顶部「已画像」badge
          const badge = detailEl.querySelector('.persona-summary-badge');
          const headName = detailEl.querySelector('.detail-head__name');
          if (!badge && headName && (p.chats.length || countPersonaFields(p))) {
            const b = el('span', 'persona-summary-badge', '已画像');
            headName.appendChild(b);
          }
        }, 1800);
      } else {
        save.textContent = '⚠ 保存失败';
      }
    });

    // 微信导入
    const drop = document.getElementById('importDrop');
    const fileInput = document.getElementById('importFile');
    const fileBtn  = document.getElementById('importFileBtn');
    const pasteEl  = document.getElementById('importPaste');
    const parseBtn = document.getElementById('importParseBtn');
    const clearBtn = document.getElementById('importClearBtn');

    if (fileBtn && fileInput) {
      fileBtn.addEventListener('click', () => fileInput.click());
    }
    if (drop && fileInput) {
      ['dragenter', 'dragover'].forEach((ev) => {
        drop.addEventListener(ev, (e) => { e.preventDefault(); e.stopPropagation(); drop.classList.add('is-drag'); });
      });
      ['dragleave', 'drop'].forEach((ev) => {
        drop.addEventListener(ev, (e) => { e.preventDefault(); e.stopPropagation(); drop.classList.remove('is-drag'); });
      });
      drop.addEventListener('drop', (e) => {
        const file = e.dataTransfer.files && e.dataTransfer.files[0];
        if (file) handleImportedFile(file, friend);
      });
      fileInput.addEventListener('change', (e) => {
        const file = e.target.files && e.target.files[0];
        if (file) handleImportedFile(file, friend);
      });
      drop.addEventListener('click', () => fileInput && fileInput.click());
    }
    if (parseBtn && pasteEl) {
      parseBtn.addEventListener('click', () => {
        const text = pasteEl.value.trim();
        if (!text) { pasteEl.style.borderColor = '#E54B4B'; pasteEl.placeholder = '⚠ 请粘贴聊天文本'; setTimeout(() => { pasteEl.style.borderColor = ''; }, 2000); return; }
        importParsedChats(text, '(粘贴文本)', friend);
      });
    }
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        if (!confirm('清空已导入的所有对话？')) return;
        const p = emptyPersona(friend);
        savePersona(friend.id, p);
        renderDetail(friend);
      });
    }
  }

  /* ---------- 6. 微信聊天解析 ---------- */
  function handleImportedFile(file, friend) {
    if (file.size > 5 * 1024 * 1024) { alert('文件超过 5MB'); return; }
    const reader = new FileReader();
    reader.onload = (e) => importParsedChats(e.target.result, file.name, friend);
    reader.readAsText(file, 'utf-8');
  }
  function importParsedChats(text, fileName, friend) {
    const chats = parseWechatChat(text);
    if (!chats.length) { alert('未能识别到有效对话，请检查文本格式（建议包含时间戳，如 2024-03-15 10:23）'); return; }
    const p = loadPersona(friend.id) || emptyPersona(friend);
    p.chats = chats;
    p.base.source = 'wechat-import';
    p.base.importDate = new Date().toISOString().slice(0, 10);
    p.base.fileName = fileName;
    p.__updatedAt = new Date().toLocaleString('zh-CN', { hour12: false });
    savePersona(friend.id, p);
    renderDetail(friend);
  }
  function parseWechatChat(text) {
    // 尝试多种微信导出格式：
    // 格式 A：2024-03-15 10:23 张三 内容
    // 格式 B：2024/03/15 10:23
    //         张三
    //         内容
    // 格式 C：[03/15/2024 10:23:33] 张三 >>>
    //          内容
    const lines = text.split(/\r?\n/);
    const chats = [];
    const reA = /^(\d{4}[-\/]\d{1,2}[-\/]\d{1,2})\s+(\d{1,2}:\d{2}(?::\d{2})?)\s+(.+)$/;
    const reSep = /^(\d{4}[-\/]\d{1,2}[-\/]\d{1,2})\s+(\d{1,2}:\d{2}(?::\d{2})?)\s*$/;
    const reC = /^\[(\d{1,2}\/\d{1,2}\/\d{4})\s+(\d{1,2}:\d{2}(?::\d{2})?)\]\s+(.+?)\s*>>>?\s*$/;

    let cur = null;
    let nextLineIsBody = false;

    for (let i = 0; i < lines.length; i++) {
      const ln = lines[i].trim();
      if (!ln) continue;

      const mA = ln.match(reA);
      if (mA) {
        if (cur) chats.push(cur);
        cur = { time: mA[1] + ' ' + mA[2], role: 'them', text: '' };
        nextLineIsBody = true;
        // A 格式：单行就有内容
        const rest = ln.replace(reA, '').trim();
        if (rest) cur.text = rest;
        continue;
      }
      const mC = ln.match(reC);
      if (mC) {
        if (cur) chats.push(cur);
        cur = { time: mC[1] + ' ' + mC[2], role: 'them', text: '' };
        nextLineIsBody = true;
        continue;
      }
      const mSep = ln.match(reSep);
      if (mSep) {
        if (cur) chats.push(cur);
        cur = { time: mSep[1] + ' ' + mSep[2], role: 'them', text: '' };
        nextLineIsBody = true;
        continue;
      }
      // 普通内容行
      if (cur) {
        cur.text = cur.text ? (cur.text + ' ' + ln) : ln;
      }
    }
    if (cur) chats.push(cur);

    // 简化判断角色：默认全部是好友（them）。第一条如果是我说的就自动 mark self
    // 这里 demo 简化：保持 them，UI 上 M (我) 只在「发送」按钮触发时显示
    // 但为了演示「交替对话」感，每条交替设为 self/them
    chats.forEach((c, i) => { c.role = (i % 2 === 0) ? 'them' : 'self'; });

    return chats;
  }

  /* ---------- 7. 初始化：好友项点击 ---------- */
  function init() {
    document.querySelectorAll('.contact-item').forEach((item) => {
      item.addEventListener('click', () => selectFriend(item));
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  /* ---------- 8. 暴露给其他页（messages.html AI 接管读画像） ---------- */
  window.UMakexPersona = {
    load: loadPersona,
    storageKey: storageKey,
    summary: function (friendId) {
      const p = loadPersona(friendId);
      if (!p) return '';
      const bits = [];
      if (p.personality.traits.length) bits.push(p.personality.traits.join('、'));
      if (p.personality.mood)          bits.push(p.personality.mood);
      if (p.personality.communication) bits.push(p.personality.communication + '型');
      if (p.family.ageRange)           bits.push(p.family.ageRange);
      if (p.family.marital)            bits.push(p.family.marital);
      if (p.family.children && p.family.children !== '无') bits.push(p.family.children + '子女');
      if (p.family.role)               bits.push(p.family.role);
      if (p.finance.level)             bits.push(p.finance.level);
      if (p.finance.jobs.length)       bits.push(p.finance.jobs.join('/'));
      if (p.finance.interests.length)  bits.push('关注' + p.finance.interests.join('/'));
      return bits.join(' · ');
    }
  };
})();
