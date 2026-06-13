// spa.js — 一体式原型核心
// 管理手机内 5 tab 切换 + 视图路由 + Agent 对话状态 + mock AI 集成

// 视图栈（支持返回）
let viewStack = ['chat-list'];

// 顶部状态
let currentTitle = '消息';

// Agent 对话历史
const agentChats = {
  'agent-sales': [],
  'agent-customer': [],
  'agent-meeting': []
};

/* ============================================
   初始化
   ============================================ */
function initSPA() {
  renderCurrentView();
  bindTabbar();
  bindBackButton();
  bindGlobalClicks();
  updateTime();
  setInterval(updateTime, 60000);
}

/* ============================================
   渲染当前视图
   ============================================ */
function renderCurrentView() {
  const content = document.getElementById('phoneContent');
  const current = viewStack[viewStack.length - 1];

  // 解析 view + 参数
  const [viewName, arg] = current.split(':');

  // 注入当前 view，并强制激活（避免非首页视图忘记带 active 导致 display:none）
  const html = VIEWS[viewName] ? VIEWS[viewName](arg) : '';
  content.innerHTML = html;
  const activeView = content.querySelector('.phone-view');
  if (activeView) activeView.classList.add('active');

  // 更新手机顶栏
  updateHeader(viewName, arg);

  // 更新 tab 选中
  updateTabbar(viewName);

  // AI 场景长演示：随消息出现自动轻滚动，增强“正在播放”的感觉
  if (viewName === 'chat-demo') {
    setTimeout(() => startAiScenarioAutoplay(arg), 120);
  }

  // 滚动到底部（聊天场景）
  setTimeout(() => {
    const body = content.querySelector('[id^="chatBody-"], [id^="agentChatBody-"]');
    if (body) body.scrollTop = body.scrollHeight;
  }, 50);
}

function updateHeader(viewName, arg) {
  const header = document.getElementById('phoneHeader');
  const back = document.getElementById('phoneBack');
  const action = document.getElementById('phoneAction');

  const titles = {
    'chat-list': '消息',
    'contact': '通讯录',
    'meeting-list': '会议',
    'profile': '我的',
    'agent-center': 'AI Agent中心',
    'agent-kb': '知识库',
    'agent-products': '商品库',
    'agent-persona': '人设风格',
    'agent-analytics': '数据看板',
    'agent-logs': '工作日志',
    'agent-workflows': '实时工作流',
    'agent-workflow-detail': '工作流详情',
    'agent-tags': '客户标签',
    'ai-inbox': 'AI 已处理',
    'meeting-detail': '会议详情',
    'chat-single': getContact(arg)?.name || '对话',
    'chat-demo': '场景演示',
    'agent-chat': getContact(arg)?.name || 'AI Agent',
    'agent-meeting': '会议纪要',
    'agent-config': getContact(AG_ID_MAP[arg] || arg)?.name || 'Agent 配置',
  };

  document.getElementById('phoneTitle').textContent = titles[viewName] || '';
  // 有上级视图才显示返回
  if (viewStack.length > 1) {
    back.style.display = 'flex';
  } else {
    back.style.display = 'none';
  }
  // 操作栏
  if (viewName === 'chat-single' || viewName === 'chat-demo' || viewName === 'agent-chat') {
    action.innerHTML = '<span>📞</span><span>📹</span><span>⋮</span>';
    action.style.display = 'flex';
  } else if (viewName === 'meeting-detail') {
    action.innerHTML = '<span>📤</span>';
    action.style.display = 'flex';
  } else if (viewName === 'agent-meeting') {
    action.innerHTML = '';
    action.style.display = 'none';
  } else {
    action.innerHTML = '';
    action.style.display = 'none';
  }
}

function updateTabbar(viewName) {
  // tab 选中：5 个主 tab
  const mainTabs = ['chat-list', 'contact', 'agent-center', 'meeting-list', 'profile'];
  document.querySelectorAll('.phone-tabbar-item').forEach(el => {
    const tab = el.dataset.tab;
    el.classList.toggle('active', tab === viewName);
  });
  // 子视图时不高亮任何 tab
  if (!mainTabs.includes(viewName)) {
    document.querySelectorAll('.phone-tabbar-item').forEach(el => el.classList.remove('active'));
  }
}

/* ============================================
   5 tab 切换（主入口）
   ============================================ */
function bindTabbar() {
  document.querySelectorAll('.phone-tabbar-item').forEach(el => {
    el.addEventListener('click', () => {
      const tab = el.dataset.tab;
      if (tab) {
        viewStack = [tab];
        renderCurrentView();
      }
    });
  });
}

/* ============================================
   返回按钮
   ============================================ */
function bindBackButton() {
  document.getElementById('phoneBack').addEventListener('click', () => {
    if (viewStack.length > 1) {
      viewStack.pop();
      renderCurrentView();
    }
  });
}

/* ============================================
   全局点击（视图内 action 路由）
   ============================================ */
function bindGlobalClicks() {
  document.getElementById('phoneContent').addEventListener('click', (e) => {
    const target = e.target.closest('[data-action]');
    if (!target) return;

    const action = target.dataset.action;
    const agent = target.dataset.agent;
    const mid = target.dataset.mid;
    const cid = target.dataset.cid;
    const agentId = target.dataset.agent;
    const target2 = target.dataset.target;
    const text = target.dataset.text;

    switch (action) {
      case 'open':
        if (target2) {
          viewStack.push(target2);
          renderCurrentView();
        }
        break;
      case 'open-agent':
        if (agent) {
          viewStack.push(`agent-chat:${agent}`);
          renderCurrentView();
        }
        break;
      case 'open-meeting':
        if (mid) {
          viewStack.push(`meeting-detail:${mid}`);
          renderCurrentView();
        }
        break;
      case 'open-meeting-summary':
        if (mid) {
          viewStack.push(`agent-meeting:${mid}`);
          renderCurrentView();
        }
        break;
      case 'open-agent-center':
        viewStack.push('agent-center');
        renderCurrentView();
        break;
      case 'open-agent-config':
        viewStack.push('agent-config:' + agent);
        renderCurrentView();
        break;
      case 'send-chat':
        sendChat(cid);
        break;
      case 'send-agent':
        sendAgent(agentId);
        break;
      case 'quick-prompt':
        sendAgentText(agentId || target.closest('[data-view="agent-chat"]').dataset.agent, text);
        break;
      case 'add-kb-item':
        addKbItem();
        break;
      case 'edit-kb-item':
        editKbItem(target);
        break;
      case 'save-kb-edit':
        saveKbEdit(target);
        break;
      case 'cancel-kb-edit':
        cancelKbEdit(target);
        break;
      case 'delete-kb-item':
        deleteKbItem(target);
        break;
      case 'add-product-item':
        addProductItem();
        break;
      case 'delete-product-item':
        deleteProductItem(target);
        break;
      case 'add-strategy-item':
        addStrategyItem();
        break;
      case 'delete-strategy-item':
        deleteStrategyItem(target);
        break;
      case 'add-tag-item':
        addTagItem();
        break;
    }
  });

  // Enter 键发送
  document.getElementById('phoneContent').addEventListener('keypress', (e) => {
    if (e.key !== 'Enter') return;
    if (e.target.id.startsWith('msgInput-')) {
      const cid = e.target.dataset.cid;
      if (cid) sendChat(cid);
    } else if (e.target.id.startsWith('agentInput-') || e.target.id.startsWith('accChatInput-')) {
      const agentId = e.target.dataset.agent;
      if (agentId) {
        const text = e.target.value.trim();
        if (text) accSend(agentId, text);
      }
    }
  });
}

/* ============================================
   真人单聊：发送
   ============================================ */
function sendChat(cid) {
  const input = document.getElementById(`msgInput-${cid}`);
  const text = input.value.trim();
  if (!text) return;
  const body = document.getElementById(`chatBody-${cid}`);
  appendBubble(body, text, 'me');
  input.value = '';
}

/* ============================================
   Agent 对话：发送 + 调 mock AI
   ============================================ */
function sendAgent(agentId) {
  const input = document.getElementById(`agentInput-${agentId}`);
  const text = input.value.trim();
  if (!text) return;
  sendAgentText(agentId, text);
  input.value = '';
}

function sendAgentText(agentId, text) {
  const body = document.getElementById(`agentChatBody-${agentId}`);
  appendBubble(body, text, 'me');

  // 显示 typing
  const agent = getContact(agentId);
  const typing = document.createElement('div');
  typing.className = 'msg-row them agent-msg-row typing-row';
  typing.innerHTML = `
    <div class="msg-avatar agent">${agent?.avatar || 'AI'}</div>
    <div class="bubble them typing-bubble"><span></span><span></span><span></span></div>
  `;
  body.appendChild(typing);
  body.scrollTop = body.scrollHeight;

  // 调 mock AI
  setTimeout(() => {
    typing.remove();
    const reply = mockAIReply(agentId, text);
    appendBubble(body, reply.text, 'them', agentId);

    // 如果有产品卡片，渲染
    if (reply.product) {
      const card = document.createElement('div');
      card.className = 'msg-row them agent-msg-row product-row';
      card.style.padding = '0';
      card.style.background = 'transparent';
      card.style.boxShadow = 'none';
      card.style.alignSelf = 'flex-start';
      card.style.maxWidth = '90%';
      card.innerHTML = `
        <div class="msg-avatar agent">${agent?.avatar || 'AI'}</div>
        <div class="product-card-im">
          <div class="pc-head">
            <span class="pc-tag">${reply.product.tag}</span>
            <span class="pc-name">${reply.product.icon} ${reply.product.name}</span>
          </div>
          <div class="pc-desc">${reply.product.desc}</div>
          <div class="pc-price-row">
            <span class="pc-price">¥${reply.product.price.toLocaleString()}</span>
            <span class="pc-origin">¥${reply.product.original.toLocaleString()}</span>
          </div>
          <div class="pc-actions">
            <div class="pc-buy">立即购买</div>
            <div class="pc-detail">了解详情</div>
          </div>
        </div>
      `;
      body.appendChild(card);
    }

    body.scrollTop = body.scrollHeight;
  }, 800);
}

function appendBubble(body, text, side, agentId) {
  if (!body) return;
  const row = document.createElement('div');
  row.className = `msg-row ${side}${agentId && side === 'them' ? ' agent-msg-row' : ''}`;
  if (agentId && side === 'them') {
    const agent = getContact(agentId);
    const avatar = document.createElement('div');
    avatar.className = 'msg-avatar agent';
    avatar.textContent = agent?.avatar || 'AI';
    row.appendChild(avatar);
  }
  const bubble = document.createElement('div');
  bubble.className = `bubble ${side}`;
  bubble.textContent = text;
  row.appendChild(bubble);
  body.appendChild(row);
  body.scrollTop = body.scrollHeight;
}


/* ============================================
   配置中心：本地原型添加功能
   ============================================ */
function getFieldValue(selector) {
  const el = document.querySelector(selector);
  return (el?.value || '').trim();
}

function clearFields(selectors) {
  selectors.forEach(sel => {
    const el = document.querySelector(sel);
    if (el) el.value = '';
  });
}

function showPrototypeToast(message, type = 'success') {
  const old = document.querySelector('.prototype-toast');
  if (old) old.remove();
  const toast = document.createElement('div');
  toast.className = `prototype-toast ${type}`;
  toast.textContent = `${type === 'success' ? '✅' : '❌'} ${message}`;
  document.querySelector('.phone-screen')?.appendChild(toast);
  setTimeout(() => toast.classList.add('show'), 20);
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 260);
  }, 2600);
}

function addKbItem() {
  const q = getFieldValue('#kbQuestion');
  const a = getFieldValue('#kbAnswer');
  const group = getFieldValue('#kbGroup') || '销售题库';
  if (!q || !a) return showPrototypeToast('请填写问题和标准回答', 'error');
  const list = document.querySelector('.kb-list');
  const no = (document.querySelectorAll('.kb-row').length + 1);
  const row = document.createElement('div');
  row.className = 'kb-row new-item';
  row.innerHTML = `
    <div class="kb-no">Q${no}</div>
    <div class="kb-main"><strong>${escapeHtml(q)}</strong><p>${escapeHtml(a)}</p><small>${escapeHtml(group)}</small></div>
    <div class="kb-side">
      <i>新添加</i>
      <div class="kb-actions">
        <button data-action="edit-kb-item">编辑</button>
        <button class="danger" data-action="delete-kb-item">删除</button>
      </div>
    </div>
  `;
  row.dataset.kbRow = '';
  list?.prepend(row);
  clearFields(['#kbQuestion', '#kbAnswer', '#kbGroup']);
  showPrototypeToast('题库已添加，AI 销冠将用于后续回复');
}

function getKbRow(button) {
  return button?.closest('[data-kb-row], .kb-row');
}

function editKbItem(button) {
  const row = getKbRow(button);
  if (!row || row.classList.contains('editing')) return;
  const title = row.querySelector('.kb-main strong')?.textContent.trim() || '';
  const answer = row.querySelector('.kb-main p')?.textContent.trim() || '';
  const status = row.querySelector('.kb-side i, :scope > i')?.textContent.trim() || '已启用';
  row.dataset.originalHtml = row.innerHTML;
  row.classList.add('editing');
  row.innerHTML = `
    <div class="kb-no">${row.querySelector('.kb-no')?.textContent || 'Q'}</div>
    <div class="kb-edit-form">
      <input class="kb-edit-question" value="${escapeAttr(title)}" placeholder="问题">
      <textarea class="kb-edit-answer" placeholder="标准回答">${escapeHtml(answer)}</textarea>
    </div>
    <div class="kb-side editing-side">
      <i>${escapeHtml(status)}</i>
      <div class="kb-actions">
        <button data-action="save-kb-edit">保存</button>
        <button class="ghost" data-action="cancel-kb-edit">取消</button>
      </div>
    </div>
  `;
}

function saveKbEdit(button) {
  const row = getKbRow(button);
  if (!row) return;
  const q = row.querySelector('.kb-edit-question')?.value.trim();
  const a = row.querySelector('.kb-edit-answer')?.value.trim();
  const status = row.querySelector('.kb-side i')?.textContent.trim() || '已启用';
  if (!q || !a) return showPrototypeToast('请填写问题和标准回答', 'error');
  const no = row.querySelector('.kb-no')?.textContent || 'Q';
  row.classList.remove('editing');
  delete row.dataset.originalHtml;
  row.innerHTML = `
    <div class="kb-no">${escapeHtml(no)}</div>
    <div class="kb-main"><strong>${escapeHtml(q)}</strong><p>${escapeHtml(a)}</p></div>
    <div class="kb-side">
      <i>${escapeHtml(status)}</i>
      <div class="kb-actions">
        <button data-action="edit-kb-item">编辑</button>
        <button class="danger" data-action="delete-kb-item">删除</button>
      </div>
    </div>
  `;
  showPrototypeToast('题库已更新');
}

function cancelKbEdit(button) {
  const row = getKbRow(button);
  if (!row) return;
  row.classList.remove('editing');
  if (row.dataset.originalHtml) {
    row.innerHTML = row.dataset.originalHtml;
    delete row.dataset.originalHtml;
  }
}

function deleteKbItem(button) {
  const row = getKbRow(button);
  if (!row) return;
  row.classList.add('kb-removing');
  setTimeout(() => {
    row.remove();
    refreshKbNumbers();
    showPrototypeToast('题库已删除');
  }, 180);
}

function refreshKbNumbers() {
  document.querySelectorAll('.kb-row .kb-no').forEach((el, index) => {
    el.textContent = `Q${index + 1}`;
  });
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"]/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;'
  }[char]));
}

function escapeAttr(value) {
  return escapeHtml(value).replace(/'/g, '&#39;');
}

function addProductItem() {
  const name = getFieldValue('#productName');
  const price = getFieldValue('#productPrice');
  const desc = getFieldValue('#productDesc');
  const tag = getFieldValue('#productTag') || '新商品';
  if (!name || !price || !desc) return showPrototypeToast('请填写商品名、价格和卖点', 'error');
  const list = document.querySelector('.product-config-list');
  const card = document.createElement('div');
  card.className = 'product-config-card new-item';
  card.dataset.productRow = '';
  card.innerHTML = `
    <div><strong>${escapeHtml(name)}</strong><span>${escapeHtml(desc)}</span></div>
    <em>${escapeHtml(price)}</em>
    <i>${escapeHtml(tag)}</i>
    <button class="mini-delete" data-action="delete-product-item">删除</button>
  `;
  list?.prepend(card);
  clearFields(['#productName', '#productPrice', '#productTag', '#productDesc']);
  showPrototypeToast('商品已加入商品库');
}

function deleteProductItem(button) {
  const card = button.closest('[data-product-row], .product-config-card');
  if (!card) return;
  card.classList.add('item-removing');
  setTimeout(() => card.remove(), 180);
  showPrototypeToast('商品卡片已删除');
}

function addStrategyItem() {
  const name = getFieldValue('#strategyName');
  const condition = getFieldValue('#strategyCondition');
  if (!name || !condition) return showPrototypeToast('请填写策略名称和触发条件', 'error');
  const list = document.querySelector('.strategy-ladder');
  const no = document.querySelectorAll('.strategy-ladder > [data-strategy-row], .strategy-ladder > div').length + 1;
  const item = document.createElement('div');
  item.className = 'new-item';
  item.dataset.strategyRow = '';
  item.innerHTML = `
    <b>${no}</b><strong>${escapeHtml(name)}</strong><span>${escapeHtml(condition)}</span>
    <button class="mini-delete" data-action="delete-strategy-item">删除</button>
  `;
  list?.appendChild(item);
  clearFields(['#strategyName', '#strategyCondition']);
  showPrototypeToast('AI 推荐策略已添加');
}

function deleteStrategyItem(button) {
  const row = button.closest('[data-strategy-row], .strategy-ladder > div');
  if (!row) return;
  row.classList.add('item-removing');
  setTimeout(() => {
    row.remove();
    refreshStrategyNumbers();
  }, 180);
  showPrototypeToast('AI 推荐策略已删除');
}

function refreshStrategyNumbers() {
  document.querySelectorAll('.strategy-ladder > [data-strategy-row], .strategy-ladder > div').forEach((row, index) => {
    const no = row.querySelector('b');
    if (no) no.textContent = index + 1;
  });
}

function addTagItem() {
  const name = getFieldValue('#tagName');
  const rule = getFieldValue('#tagRule');
  if (!name || !rule) return showPrototypeToast('请填写标签名称和打标规则', 'error');
  const board = document.querySelector('.tag-board');
  const card = document.createElement('div');
  card.className = 'tag-card orange new-item';
  card.innerHTML = `<div><strong>${name}</strong><em>0 人</em></div><p><span>待匹配客户</span></p>`;
  board?.prepend(card);
  const rules = document.querySelector('.rule-sheet');
  const row = document.createElement('div');
  row.className = 'new-item';
  row.innerHTML = `<strong>${name}</strong><span>${rule}</span>`;
  rules?.prepend(row);
  clearFields(['#tagName', '#tagRule']);
  showPrototypeToast('客户标签和自动规则已添加');
}

/* ============================================
   时间显示
   ============================================ */
function updateTime() {
  const el = document.getElementById('phoneTime');
  if (!el) return;
  const now = new Date();
  const h = String(now.getHours()).padStart(2, '0');
  const m = String(now.getMinutes()).padStart(2, '0');
  el.textContent = `${h}:${m}`;
}

/* ============================================
   AI Agent 中心：开通/关闭 + 配置中心 chat（v9）
   ============================================ */

// 短 id → 全 id（兼容 mockAIReply）
const AG_ID_MAP = {
  sales: 'agent-sales',
  cust:  'agent-customer',
  meet:  'agent-meeting',
  grow:  'agent-sales',      // legacy：旧客户增长入口先落到销售助手
  img:   'agent-img',
  write: 'agent-write',
  audio: 'agent-audio',
};
const AG_FULL_TO_SHORT = Object.fromEntries(Object.entries(AG_ID_MAP).map(([k,v]) => [v, k]));

// 全局：开通/关闭 Agent
window.__toggleAgent = function(id) {
  try {
    const state = JSON.parse(localStorage.getItem('umakex_agent_state') || '{}');
    state[id] = !state[id];
    localStorage.setItem('umakex_agent_state', JSON.stringify(state));
    renderCurrentView();
    const NAMES = { sales:'AI 销售', cust:'AI 客服', meet:'AI 会议', grow:'AI 销售', img:'AI 生图', write:'AI 写作', audio:'AI 录音' };
    const name = NAMES[id] || id;
    showPrototypeToast(state[id] ? `✅ ${name} Agent 已开通` : `${name} Agent 已关闭`, state[id] ? 'success' : 'info');
  } catch(e) {
    showPrototypeToast('操作失败：' + e.message, 'error');
  }
};

// 3 个新 Agent 的 mock 回复（img/write/audio）
const AG_NEW_REPLIES = {
  'agent-img': (text) => {
    if (/海报|宣传|促销/.test(text)) return `已生成 4 张「${text}」候选图（写实/插画/水彩/漫画各 1）\n\n需要换风格或加 LOGO 吗？`;
    if (/头像|照片|自拍/.test(text)) return `已生成 3 张「${text}」头像候选\n\n需要换背景或加滤镜吗？`;
    return `收到～「${text}」\n\n正在调用 SDXL 生成 4 张候选图，预计 8-12 秒。需要指定风格吗？`;
  },
  'agent-write': (text) => {
    if (/朋友圈|种草/.test(text)) return `种草朋友圈 v1：\n\n"姐妹们！挖到宝了 💎\n\n[VIC 套餐] 一个月只要 ¥199\n每天 1 杯奶茶钱 = 1 整年的私聊自由\n关键是不用凑单！不用会员日！\n打开手机就能跟"真人"聊\n\n⭐ 我已经续了 3 个月了\n\n#VIC套餐 #私域神器"\n\n— 240 字 · 适配朋友圈，需要再短或更长吗？`;
    if (/详情页/.test(text)) return `详情页文案结构（3 段式）：\n\n【痛点】还在为消息回复不及时丢单？\n【方案】VIC 套餐 = 24h 在线 + 真人级 AI\n【行动】¥199/月，首月 9 折\n\n需要我展开成完整详情页（800-1200 字）吗？`;
    if (/周报/.test(text)) return `本周周报框架：\n\n一、本周核心数据\n- 营收 ¥X（+X%）\n- 新增客户 X\n\n二、关键动作\n- 1. XX 上线\n- 2. XX 活动\n\n三、下周计划\n- XX\n\n需要我按这个框架生成完整周报吗？`;
    return `好的，告诉我「${text}」的写什么、给谁看、什么场景～`;
  },
  'agent-audio': (text) => {
    if (/会议|纪要/.test(text)) return `📋 30 分钟会议摘要：\n\n📌 核心决策\n- 7 月活动方案 v3 通过\n- 预算 5 万 → 7 万\n\n✅ 待办\n- 张三：海报初稿 (周五)\n- 李四：渠道对接 (周三)\n\n🎯 关键数字\n- 预期 GMV ¥120 万\n- ROI 目标 3.2`;
    if (/决策|要点/.test(text)) return `已提取 3 个关键决策：\n\n1. 上线 7 月限时活动 (5-7 月)\n2. 暂停私域投放，预算转入直播\n3. 招 1 名内容运营 (Q3 前到岗)`;
    if (/待办|任务|行动/.test(text)) return `已生成 5 条待办清单：\n\n☐ 1. 张三 / 海报初稿 / 7.5\n☐ 2. 李四 / 渠道对接 / 7.3\n☐ 3. 王五 / 直播脚本 / 7.7\n☐ 4. 赵六 / 选品清单 / 7.4\n☐ 5. 钱七 / 数据复盘 / 7.10`;
    return `好的，请上传录音或粘贴文字，我帮您提取「${text}」～`;
  },
};

// 通用回复兜底
function accMockReply(agentKey, text) {
  if (AG_NEW_REPLIES[agentKey]) return AG_NEW_REPLIES[agentKey](text);
  // cust/sales/meet 走 mock-ai.js
  const reply = mockAIReply(agentKey, text);
  return reply.text || '收到～';
}

// 配置中心 chat 发送
function accSend(agentId, text) {
  if (!text || !text.trim()) return;
  const cfgView = document.querySelector(`.phone-view[data-view="agent-config"][data-agent="${agentId}"]`);
  if (!cfgView) return;
  const body = cfgView.querySelector(`#accChatBody-${agentId}`);
  const input = cfgView.querySelector(`#accChatInput-${agentId}`);
  if (!body) return;

  // append user bubble
  const userRow = document.createElement('div');
  userRow.className = 'acc-msg me';
  userRow.textContent = text;
  body.appendChild(userRow);
  if (input) input.value = '';
  body.scrollTop = body.scrollHeight;

  // typing indicator
  const typing = document.createElement('div');
  typing.className = 'acc-msg them thinking';
  typing.innerHTML = '<span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span>';
  body.appendChild(typing);
  body.scrollTop = body.scrollHeight;

  // 调 mock
  setTimeout(() => {
    typing.remove();
    const fullId = AG_ID_MAP[agentId] || agentId;
    const replyText = accMockReply(fullId, text);
    const themRow = document.createElement('div');
    themRow.className = 'acc-msg them';
    themRow.textContent = replyText;
    body.appendChild(themRow);
    body.scrollTop = body.scrollHeight;
  }, 700 + Math.random() * 500);
}

// 配置中心：事件代理（点击）
document.addEventListener('click', (e) => {
  // 快速测试按钮 / 快速回复 chip
  const qb = e.target.closest('.acc-qbtn, .acc-qrep');
  if (qb) {
    const cfgView = qb.closest('.phone-view[data-view="agent-config"]');
    if (!cfgView) return;
    const agentId = cfgView.dataset.agent;
    const text = qb.dataset.quick || qb.textContent.trim();
    accSend(agentId, text);
    return;
  }
  // 发送按钮
  const sendBtn = e.target.closest('.acc-chat-send');
  if (sendBtn) {
    const cfgView = sendBtn.closest('.phone-view[data-view="agent-config"]');
    if (!cfgView) return;
    const agentId = cfgView.dataset.agent;
    const input = cfgView.querySelector(`#accChatInput-${agentId}`);
    accSend(agentId, input ? input.value : '');
    return;
  }
  // 返回按钮
  const back = e.target.closest('.acc-chat-back');
  if (back) {
    if (viewStack.length > 1) {
      viewStack.pop();
      renderCurrentView();
    }
    return;
  }
});

// 配置中心：Enter 发送
document.addEventListener('keydown', (e) => {
  if (e.key !== 'Enter') return;
  if (e.target.classList && e.target.classList.contains('acc-chat-input')) {
    e.preventDefault();
    const cfgView = e.target.closest('.phone-view[data-view="agent-config"]');
    if (!cfgView) return;
    const agentId = cfgView.dataset.agent;
    accSend(agentId, e.target.value);
  }
});

let aiScenarioAutoplayTimers = [];
function startAiScenarioAutoplay(sid) {
  aiScenarioAutoplayTimers.forEach(t => clearTimeout(t));
  aiScenarioAutoplayTimers = [];
  const stage = document.querySelector(`.ai-scene-demo[data-sid="${sid}"] .ai-demo-stage`);
  if (!stage) return;
  stage.scrollTop = 0;
  const steps = [...stage.querySelectorAll('.demo-step')];
  steps.forEach((step, idx) => {
    const timer = setTimeout(() => {
      if (!document.querySelector(`.ai-scene-demo[data-sid="${sid}"]`)) return;
      const targetTop = Math.max(0, step.offsetTop - 130);
      stage.scrollTo({ top: targetTop, behavior: 'smooth' });
    }, 1200 + idx * 1350);
    aiScenarioAutoplayTimers.push(timer);
  });
}

/* ============================================
   启动
   ============================================ */
document.addEventListener('DOMContentLoaded', initSPA);
