# AGENTS.md — 慈商联营慈善公益平台原型

> 项目目录：`/Users/michael/Downloads/minimax-原型/charity-V2/`
> 类型：静态 HTML 原型（无后端），5 角色独立工作台
> 技术栈：HTML / CSS / JS，公共 header/footer 由 `public/js/common.js` 动态注入

## 1. 项目结构关键约定

- **公共资源**（不要改文件名/路径）：
  - `public/css/style.css` — 全局样式（前台 + 通用）
  - `public/css/dashboard.css` — 工作台样式（含 `.dash-wrap` grid、`.dash-side` 240px 侧栏）
  - `public/css/messages.css` — 消息中心 + 头部铃铛
  - `public/js/common.js` — header/footer/sidebar 模板 + 数字动画 + 消息中心数据
- **类名强约束**（dashboard.css 用了，别写错）：
  - `.dash-wrap`（不是 `.dash-layout`！grid 容器，240px + 1fr）
  - `.dash-side`（左侧 240px 侧栏）
  - `.dash-body`（右侧主体）
  - `.dash-main`（侧栏 + 主体的外层 section）
- **页面间跳路径前缀**：JS 用 `getPathPrefix()` 反推，HTML 里写相对路径即可

## 2. 公共渲染函数位置（改之前先看）

- `getHeader(active)` — 前台 header
- `getDashHeader(role, userName)` — 工作台 header（带铃铛 + 红点 badge）
- `getFooter()` — 页脚
- `DASH_SIDEBAR[role](active)` — 5 角色侧栏
- `getMessagesBody(roleKey, roleName, userName)` — 消息中心主体（不含弹窗）
- `getMessagesModal()` — 详情弹窗
- `CS.renderMessagesPage(roleKey, roleName, userName)` — 一键渲染整个消息中心页
- **修改后必须自检**（见第 4 节）

## 3. Bug 案例库

> 每次修完一个 bug，把根因 + 修法 + 自检教训记一条到这里，避免重犯。

### Bug 3：消息中心 sidebar 撑满整页、跟 body 重叠（2026-06-02）

**症状**：打开 `pages/messages.html` 视觉上"整个页面都是消息通知"，左侧 sidebar 不在 240px 位置。

**根因**（两个 bug 叠加）：
1. `CS.renderMessagesPage` 用了 `<div class="dash-layout">`，但 CSS 实际定义的是 `.dash-wrap`（grid `240px 1fr`）。类名错 → grid 失效 → sidebar 失去宽度约束。
2. 模板字符串里开 3 个 `<div>` 只关 2 个，HTML 解析器自动平衡把 `.dash-wrap` 这个外层 div 吞掉，sidebar 跑到了外层。

**修法**（`public/js/common.js` line 605-608）：
- `dash-layout` → `dash-wrap`
- 补 1 个 `</div>`：开 `section + 2 div` + sidebar 嵌入 + `.dash-body` div（getMessagesBody 已自带）= 共 4 个 div；结尾改成 `</div></div></div></section>`

**自检教训**（同 Bug 1/Bug 2 教训一致，见 MEMORY.md）：
- 改布局函数后必须用 dev tools 量 sidebar 宽度（应=240px）、body 宽度（应=952px @ 1192 容器）
- 模板字符串拼接前先数清开/闭标签数，HTML 解析器会"借" close tag 把 bug 藏得很深
- 类名约束要写进文件顶部注释，别靠记忆

---

### Bug 2：register.html 进度条被 hero 区裁掉上半（2026-06-02）

**症状**：进度条顶部圆形数字 1 显示不全。

**根因**：hero 卡片用 `overflow: hidden` 配合大号 emoji 装饰，导致 progress bar 顶部被裁。

**修法**（`pages/register.html`）：hero 去掉 `overflow: hidden`，progress 改成独立卡片 `margin-top: 32px` 跟在 hero 后。

**自检教训**：自检时**只看 hero 内部**没看 hero 和 progress 的接缝；以后看多区块布局要把所有相邻区块的接缝都过一遍。

---

### Bug 1：footer logo 文字「慈商联营 / CISHANG UNION」挤在一行（2026-06-02）

**症状**：footer 里的 logo 文字不换行。

**根因**：footer 的 `.logo-text` 缺 `flex-direction: column` 声明。

**修法**（`public/css/style.css`）：补 `flex-direction: column; align-items: flex-start;`。

**自检教训**：自检时只看了 logo 的 SVG 图标替换结果，**没看 logo 旁边的文字排版**。同类错误：替换一个元素时没检查它**周围**的关联元素。

---

### Bug 4：消息中心 3 个跳转/路径 bug + 1 个数据脱钩（2026-06-02）

**症状**（用户报告）：
1. sidebar 点消息中心 → `ERR_FILE_NOT_FOUND`（跳到不存在的 `company/messages.html`）
2. 铃铛点进去样式跟工作台不一样（其实是上面那个 bug 的副作用，浏览器拿到不存在的页面渲染出错）
3. 进消息中心后**没法返回工作台**（header 只有"返回前台"）

**根因**：
1. **路径错误**：`DASH_SIDEBAR` 5 个 sidebar 用相对路径 `href="messages.html"`，但 dashboard 在 `company/` 等子目录，消息中心在 `pages/`，应 `../pages/messages.html`。`getDashMsgBanner` 也犯同样错。
2. **header 行为没参数化**：`getDashHeader` 写死了"返回前台"，消息中心页直接复用，导致没"返回工作台"。
3. **数据脱钩**：`MESSAGES_UNREAD` 跟 `MESSAGES_DATA` 是同一信息的两个副本，公司 badge 显示 4 但 DOM 实际 3。

**修法**（`public/js/common.js`）：
1. **5 个 sidebar 链接**：`href="messages.html?role=xxx"` → `href="../pages/messages.html?role=xxx"`
2. **getDashMsgBanner**：用 `getPathPrefix()` 拼路径，避免硬编码
3. **getDashHeader 加 `backTo` 参数**：默认 `{label: '返回前台', href: '${p}index.html'}`，消息中心传 `{label: '← 返回工作台', href: '${p}${roleKey}/dashboard.html'}`
4. **删 `MESSAGES_UNREAD` 常量**、新增 `getUnreadCount(role)` 实时从 `MESSAGES_DATA` 算
5. **5 个 dashboard 删硬编码 banner**、改用 `CS.renderDashMsgBanner('xxx')` 动态生成

**自检教训**（3 条，已沉淀到第 5 节"已知陷阱"）：
- **路径陷阱**：跨目录跳转必须用 `getPathPrefix()`，不能写死相对路径
- **数据副本陷阱**：同一信息多个副本手维护必脱钩 → 改单一数据源 + 实时计算
- **UX 必备**：每个独立页面都需要"返回"链接，header 行为应该参数化

---

## 4. 项目级自检 Checklist（每次改完 `common.js` 关键布局函数后必走）

> 通用版见 `~/.mavis/agents/main/memory/MEMORY.md`；本节只列项目特化项。

### A. 修改 `common.js` 后（任一函数）：
- [ ] 数模板字符串的开/闭标签数（section / div / aside / script）必须匹配
- [ ] 用过的 CSS 类名在 `dashboard.css` / `style.css` / `messages.css` 里有定义（grep `grep -n "class-name" public/css/*.css`）
- [ ] 跑一次 cache-bust 验证（URL 加 `?t=Date.now()`，或重启 server）

### B. 修改了 `renderMessagesPage` 或 sidebar / dash-wrap 相关逻辑：
- [ ] 5 个角色都跑一遍 `pages/messages.html?role={company|charity|org|volunteer|recipient}`
- [ ] 每次 evaluate 拿三个数：`.dash-side.offsetWidth`（应=240）、`.dash-body.offsetWidth`（应=952）、`.dash-wrap` 的 `gridTemplateColumns`（应="240px 952px"）
- [ ] 验证消息中心主体、sidebar、header、footer 互不重叠

### C. 修改了 dashboard 卡片 / hero / banner：
- [ ] 至少看 2 个相邻区块的**接缝**（不只是区块内部）
- [ ] 5 个角色 dashboard 都过一遍
- [ ] 看新加的卡片在所有角色下的样式是否一致（不被某个角色的 `welcome-card` / hero 装饰盖住）

### D. 修改了 header 公共模板：
- [ ] 前台 3 页面 + 5 工作台 + 消息中心 = 9 个页面都过一遍（铃铛、role-switch、返回前台 都在位）
- [ ] logo SVG 在所有 4 处替换位置都生效（前台 header / 工作台 header / footer / login.html 侧栏）

### E. 交付前最终检查：
- [ ] 至少 1 张截图 + 1 次 DOM evaluate（不只是看 AI 描述）
- [ ] 5 个角色至少各跑过 1 次完整流程（dashboard → 消息中心 → 点开消息）
- [ ] 移动端简单看下（resize 浏览器到 768px）

## 6. Checklist 优化记录（演练发现，2026-06-02）

> 第一次真跑 checklist（messages.html 演练）时发现的 3 个**实操性问题**，写在这里下次直接用。

### 优化 1：grep 类名步骤的 shell 拼接坑

**问题**：直接在 bash 里 `for c in $classes` 拆词会因为引号嵌套失败，把整个 JSON 当单字符串按字符循环（每个字符都"missing"）。

**标准做法**（已验证可用）：

```bash
# 1) browser_evaluate 拿 JSON 字符串，存文件
mavis mcp call playwright browser_evaluate '{"function":"() => JSON.stringify(...)"}' 2>&1 | \
  sed -n '/^### Result/,/^### /p' | sed '1d;$d' > /tmp/dom-classes.json

# 2) python 读 + 二次解析（外层是 JSON 字符串，内层才是数组）
python3 <<'PY'
import json, subprocess, os
os.chdir('/Users/michael/Downloads/minimax-原型/charity-V2/public/css')
with open('/tmp/dom-classes.json') as f:
    raw = f.read().strip()
classes = json.loads(json.loads(raw))  # 二次 json.loads
for c in classes:
    pattern = r'(^|[. ])' + c + r'( |\{|,|:)'
    hit = subprocess.run(['grep', '-lE', pattern, 'style.css', 'dashboard.css', 'messages.css'],
                         capture_output=True, text=True)
    if not hit.stdout.strip():
        print(f'  ❌ .{c}')
PY
```

**收益**：第一次演练就用这套抓到了 `.dash-body` 缺 CSS 定义的隐藏 bug。

### 优化 2：交叉验证加一组（消息数 vs MESSAGES_UNREAD）

**问题**：原 Step 5 只验证 dashboard 铃铛数字 == 消息中心未读数。但 sidebar 里的 `<span class="badge-mini">${MESSAGES_UNREAD[role]}</span>` 和实际渲染的"未读消息条数"可能脱钩（比如有人手改了 MESSAGES_UNREAD 但忘了改 MESSAGES_DATA，或者反过来）。

**新增检查**（每次改 `MESSAGES_DATA` / `MESSAGES_UNREAD` 后）：

```bash
# 校验 sidebar badge（取 MESSAGES_UNREAD）= 消息中心"未读 X"显示值
# 校验 sidebar badge = 实际 .msg-item.is-unread 个数（DOM 真实状态）
for r in company charity org volunteer recipient; do
  mavis mcp call playwright browser_navigate "{\"url\":\"http://localhost:8766/pages/messages.html?role=$r&t=cb$RANDOM\"}" > /dev/null
  res=$(mavis mcp call playwright browser_evaluate '{"function":"() => { const badge = document.querySelector(\".side-menu a[href*=messages] .badge-mini\")?.textContent; const stat = document.querySelector(\".msg-stat strong:first-child\")?.textContent; const unreadDOM = document.querySelectorAll(\".msg-item.is-unread\").length; return { badge, stat, unreadDOM }; }"}' 2>&1 | sed -n '/^### Result/,/^### /p' | sed '1d;$d')
  echo "$r: $res"
done
```

**期望**：5 角色三数（sidebar badge / 消息中心显示 / DOM 实际未读）全部相等。

### 优化 3：接缝检查加视觉截图

**问题**：接缝检查靠"列区块"是文字描述，缺一张图作为最终对照。

**新增**（Step 1 走完、Step 2-4 之前必做）：

```bash
# 截一张 messages.html 实际渲染图，给 describe_images 5 个区块问题
mavis mcp call playwright browser_take_screenshot '{"filename":"check-msg.png","fullPage":true}'
# 然后用 describe_images 问：5 个区块比例、是否重叠、是否有元素跑出去
```

**为什么截图不能省**：数字 240/952 都对，但视觉上**modal 浮层、emoji 装饰、bell 红点**还可能盖住其他元素——这些不靠眼睛是看不出的。

**给 describe_images 的标准 prompt**（已验证可用）：

```
看这张消息中心截图：1) 顶部是否正常显示 header（logo+铃铛+角色切换）？
2) 左侧是否有深色 sidebar 240px 宽、菜单"消息中心"是否橙色高亮？
3) 右侧主体是否清晰显示"消息中心"标题+Tab+消息列表？
4) 5 个区块（header/sidebar/消息主体/footer/modal）互不重叠？
5) 整体页面比例是否合理？直接说"是"或"否"，描述实际看到的区域占比。
```

## 5. 已知陷阱

- **Playwright 强缓存**（同 MEMORY.md 记录）：`browser_navigate` 同一 URL 可能命中 304。改完静态资源后用 `?t=<random>` cache-bust。
- **logo SVG 4 处替换位置**：`common.js` 顶部 `LOGO_ICON` 常量 + 3 处使用 + `pages/login.html` 侧栏 logo。
- **数字动画**：HTML 里不能预先标 `data-animated="1"`，否则 JS 会跳过。
- **chart-bar CSS 双层兜底**：公共 `style.css`（治本）+ 页面 inline style（保险），不能只改一处。

### 5.1 路径处理陷阱（Bug 4 沉淀，2026-06-02）

**陷阱**：dashboard 在 `company/` 等子目录，消息中心在 `pages/`，所有跨目录跳转必须用 `getPathPrefix()` 拼路径，**不能写死相对路径**。

**错误示范**（Bug 4 现场）：

```js
// ❌ DASH_SIDEBAR 模板里
<a href="messages.html?role=company">  // 跳到 company/messages.html（不存在）

// ❌ getDashMsgBanner 函数
return `<a href="messages.html?role=${role}">...`;  // 同样错
```

**正确做法**：

```js
// ✅ DASH_SIDEBAR 用相对路径前缀 "../"
<a href="../pages/messages.html?role=company">

// ✅ 函数模板用 getPathPrefix() 拼
function getDashMsgBanner(role) {
  const p = getPathPrefix();
  return `<a href="${p}pages/messages.html?role=${role}">...`;
}
```

**自检**：每次加新链接，跑 `curl -I "http://localhost:8766/company/dashboard.html" | grep "404"` 模拟一下跳转目标是否 200。

### 5.2 多源数据必脱钩陷阱（Bug 4 沉淀，2026-06-02）

**陷阱**：同一信息（消息未读数、用户 ID、统计总数…）如果维护在 2+ 个数据源里，手动同步迟早出错。

**错误示范**（Bug 4 现场）：

```js
// ❌ 维护了两份
const MESSAGES_UNREAD = { company: 4, ... };  // 手维护
const MESSAGES_DATA = { company: [...3 条 unread:true...], ... };  // 真实数据
// 改 MESSAGES_DATA 加了 1 条 unread:true，但忘改 MESSAGES_UNREAD → badge 跟实际脱钩
```

**正确做法**：单一数据源 + 实时计算函数

```js
// ✅ 删掉 MESSAGES_UNREAD
function getUnreadCount(role) {
  const data = MESSAGES_DATA[role] || [];
  return data.filter(m => m.unread).length;
}
// 所有引用都改成 getUnreadCount(role)
```

**原则**：**只在最底层维护原始数据，其他都是派生**。需要新加派生值时，先看能不能从原始数据算出来；算不出来再考虑加新字段。

### 5.3 header 行为参数化（Bug 4 沉淀，2026-06-02）

**陷阱**：每个独立页面（不只是 dashboard）都需要"返回"链接，header 行为应该参数化，不能写死。

**错误示范**（Bug 4 现场）：

```js
// ❌ "返回前台" 写死
function getDashHeader(role, userName) {
  return `...<a href="${p}index.html">返回前台</a>...`;
}
// 消息中心页也用这个 header → 用户找不到"返回工作台"
```

**正确做法**：加 `backTo` 参数

```js
// ✅ 默认"返回前台"，消息中心传"← 返回工作台"
function getDashHeader(role, userName, activePage, backTo) {
  const back = backTo || { label: '返回前台', href: `${p}index.html` };
  return `...<a href="${back.href}">${back.label}</a>...`;
}

// 调用方：
// dashboard:  getDashHeader('企业', '李经理')             // 默认返回前台
// 消息中心:   getDashHeader('企业', '李经理', null,
//               { label: '← 返回工作台', href: '../company/dashboard.html' })
```

**通用原则**：任何"通用 header/footer/sidebar"在跨多个页面复用前，**先想清楚哪些文案/链接因页面而异**——这些必须参数化，不能写死。

### 5.4 公用 vs 独立文件的取舍（5 角色 messages.html 重构沉淀，2026-06-02）

**陷阱**：我之前设计"1 个公用 `pages/messages.html?role=xxx` 切换 5 角色"——节省代码。但代价是：
- sidebar 链接用相对路径会跳错（公用页在 `pages/`，sidebar 指向 `dashboard.html` 实际跳到 `pages/dashboard.html` 不存在）
- 必须用 `getPathPrefix()` 拼绝对相对路径——多一层间接
- 文件结构跟 UI 结构强耦合时，代码复用收益<结构清晰度损失

**结论**：**当文件结构跟 UI 结构强耦合时，独立文件 > 公用文件**。5 角色工作台本身就是 5 个独立目录，messages.html 跟着放独立目录是自然延伸。

**实战对比**：

| 方案 | 文件数 | sidebar 链接 | 宽度一致性 | 维护成本 |
|---|---|---|---|---|
| 公用 pages/messages.html?role=xxx | 1 | 需 `../pages/...` 拼路径 | 容易跟 dashboard 走两层 | 低（1 文件）但 bug 集中 |
| 5 个独立 messages.html | 5 | 直接相对路径（`donate-publish.html`） | 跟 dashboard 完全同结构 | 稍高（5 文件）但 bug 分散 |

**当前选择**：5 个独立文件，每个 ~30 行重复，但结构跟 dashboard 100% 对齐。

**原则**：**公用 vs 独立，先看目录结构**——如果业务对象本来就是 N 个独立目录，**别强行合并**。

### 5.5 Playwright 浏览器 + 老 server 双缓存陷阱（2026-06-02）

**陷阱**：改 `public/js/common.js` 后，server 实际返回的代码是对的（curl 能看到新 API），但 playwright 浏览器加载的 CS 还是旧版（`renderMessagesPage` 而不是新加的 `getMessagesBody` / `getMessagesModal`）。**server 重启 + `browser_close` 都救不回来**——playwright 内部 disk cache 还在扛。

**症状**：
- `Object.keys(CS)` 里看到的是旧 API
- 新的 CS API 是 `undefined`
- 即使 `browser_navigate` 到新 URL，缓存的 JS 还在

**唯一救法**（在 playwright 中）：

```js
// 用 fetch + Blob 强制注入新版本（绕过磁盘缓存）
const r = await fetch("../public/js/common.js?bust=" + Date.now(), {cache: "no-store"});
const t = await r.text();
const b = new Blob([t], {type: "application/javascript"});
const u = URL.createObjectURL(b);
await new Promise(res => {
  const s = document.createElement("script");
  s.src = u; s.onload = res;
  document.head.appendChild(s);
});
// 现在 CS 包含新 API
```

**自检纪律**：改公共 JS / CSS 后，**改完立即 evaluate 验证 `Object.keys(CS)` 包含新 API**——不能只信 curl server 返回的内容。

**避免方法（治本）**：
- 给静态资源加版本号（`common.js?v=1`），每次改 `?v=` 自增
- 或用 webpack/vite 这种带 hash 的构建工具（不在本原型项目范围内）

### 5.6 函数签名改了 → 暴露层必须同步改（2026-06-02）

**陷阱**：`getDashHeader` 加了 `backTo` 参数，**`CS.renderDashHeader` 没同步加**——调用方传了 backTo，被 CS 层吃掉，落到默认值 "返回前台"。

**自检纪律**：
1. 改 `getXxx` 内部函数签名 → **必须 grep 找所有 wrapper**（`CS.xxx` / 暴露层）
2. 逐个对照 wrapper 是否把新参数透传
3. 改完 evaluate 验证：调 wrapper 传新参数，看实际行为是否符合预期

**错误示范**：

```js
// ❌ getDashHeader 加了第 4 个参数 backTo，但 CS.renderDashHeader 没透传
function getDashHeader(role, userName, activePage, backTo) { ... }

// 改完上层不知道 → 还在用 3 参数版
renderDashHeader: function(role, userName, activePage) {
  loadPartial('site-header', getDashHeader(role, userName, activePage));
  //                                              ^^^ backTo 永远 undefined
}
```

**正确做法**：

```js
// ✅ CS.renderDashHeader 也加 backTo 参数
renderDashHeader: function(role, userName, activePage, backTo) {
  loadPartial('site-header', getDashHeader(role, userName, activePage, backTo));
}
```

**通用原则**：**改函数签名是"API 变更"**——必须把"所有调用方"（包括 wrapper / 暴露层 / 测试 / 文档）都同步更新，不能只改底层。

### 5.7 不主动关闭浏览器（用户偏好，2026-06-02）

**用户偏好**：不要主动用 `mavis mcp call playwright browser_close` 关浏览器——保持 tab 状态，方便用户自己切换看。

**正确做法**：
- 改完代码后用 `browser_navigate` 跳转新页面（不关 tab）
- 必要时用 `browser_evaluate` 拿数据
- **不要**用 `browser_close` 重置状态——那是用户自己的工作流控制

**例外**：如果用户**明确**要求重启浏览器、或者服务必须重启才能生效（且无法用 force-reload 解决），需要先**问用户**才能 close。

### 5.8 图像生成：minimax 完全可用，CSS 渐变模拟是错误默认（2026-06-02）

**陷阱**：当用户要"参考图风格的真实感图片"时，**不要默认用 CSS 渐变 + emoji 模拟**——`mavis mcp call matrix matrix_generate_image` 可直接生成任何描述的图，效果比 CSS 模拟真实得多。

**错误示范**（本次 track.html 全国承运网络现场）：

```js
// ❌ 凭"AI 工具不能拍真实照片"就放弃，用 CSS 渐变凑数
<div style="background:linear-gradient(135deg,#FF6B6B 0%,#C44569 50%,#574B90 100%);">
  <span class="emoji">🌆</span>
</div>
```

**正确做法**（minimax MCP 一行命令）：

```bash
mavis mcp call matrix matrix_generate_image '{"requests":[
  {"prompt":"深圳福田 CBD 天际线 + 平安金融中心 + 日落金橙色调，电影感构图，photorealistic","aspect_ratio":"16:9"}
]}' 2>&1 | grep output_url
# 返回 CDN URL，下载到 public/images/ 下
```

**自检纪律**：
- 当用户给参考图风格要求时，**先看 minimax MCP 工具列表**——不要凭"AI 工具做不到"就下结论
- 真实图片生成的视觉效果 > CSS 渐变模拟（特别是"地标/景观/产品图"类需求）
- 图片存放建议 `public/images/<context>/xxx.png`，HTML 用 `background-image: url(...)` 引用

**适用场景**：
- 参考图要求"真实感"的图标、背景、插画
- 城市/景观/产品等需要视觉冲击力的元素
- hero 区 banner / 卡片背景 / 空状态插图

**不适用场景**：
- emoji 已经够用的小图标
- 需要保持 SVG 矢量缩放的场景
- 实时数据可视化（图表）

### 5.9 图形流水线 + 动效模式（track.html 沉淀，2026-06-02）

**场景**：用户给"流程/物流/项目流转"等场景要求"图形化的流水线效果"时，不要只画节点时间轴——加**右侧图形流水线**+ **7 项动效**会显著提升视觉。

**布局结构**（双栏）：
```
┌─ trace-layout (1.5fr + 1fr) ──────────────────────────┐
│  timeline-trace（左：垂直时间轴，节点详情）         │
│  trace-pipeline（右：横向流水线 + 状态统计）       │
└─────────────────────────────────────────────────────┘
```

**流水线核心元素**：
- **传送带**：repeating-linear-gradient 暗灰条纹，**水平流动动效**（beltFlow 1.2s）
- **节点圆**：44px 圆形 + emoji 标签 + 月日
  - `.done` = 绿色渐变（#14B8A6 → #0D9488）+ ✓ 角标
  - `.active` = 橙色渐变（#FF6B35 → #E85D04）+ 橙色光圈脉动
  - 默认 = 灰色边框（待开始）
- **进度填充**：belt-fill 宽度 = 完成百分比，**内部高光带从左→右扫**（beltShine 2s）
- **小光点**：8px 白点带绿边，**沿传送带循环移动**（beltDotMove 2.5s）——"货物感"
- **当前位置光晕**：当前节点位置叠加径向光晕（pipelinePulse 1.6s）
- **底部信息条**：
  - 进行中：橙色 "📍 当前位置：xxx · 进度百分比"
  - 已完结：绿色 "🎉 已完结 · 受惠人数"
- **状态统计**：✓ 已完成 N · ● 进行中 N · ○ 待开始 N

**7 项动效清单**（按视觉冲击排）：
1. `beltFlow` 1.2s — 传送带条纹左移
2. `beltShine` 2s — 进度条高光带左→右扫
3. `beltDotMove` 2.5s — 沿传送带循环的小光点
4. `nodeEmoji` 0.9s — 当前节点 emoji 脉冲缩放
5. `nodeActive` 1.4s — 当前节点橙色光圈扩散
6. `pipelinePulse` 1.6s — 当前位置径向光晕
7. 节点 hover 放大 + 标签变橙（CSS transition）

**视觉差异化**（不同状态用不同颜色）：
- 进行中：橙色 + 进度条填充到当前位置 + 当前节点脉动
- 已完结：传送带 100% 绿 + 状态条绿色 + 小光点继续循环但加透明

**适用场景**：
- 物流轨迹（已在 track.html 用）
- 项目/任务进度展示
- 流程审批可视化
- 数据处理管道

**实现位置**：track.html line 84-160 附近（CSS）+ 每个 flow-panel 末尾插入 trace-pipeline HTML 块。**3 个 panel 各自写一份**（节点数据不同），不公用。

**自检纪律**：
- 节点数据跟左侧 trace-node 状态类（`.done` / `.active` / 默认）必须一致
- 进度条宽度 = done 节点数 / 总节点数 × 100%
- 当前节点 emoji 跟时间轴第一个 active 节点 emoji 对得上
- 测 3 个 panel 都要点 Tab 切换验证（默认只显示一个）

### 5.10 加新元素破坏现有布局陷阱（同根 bug 2 次，2026-06-02）

**陷阱**：往已有页面**添加新元素**时，不看父容器的布局上下文（flex / grid / overflow），新元素会被**挤压**或**侵入**现有流，导致布局错位。

**本项目同根 bug 已踩 2 次**：

| 现场 | 父容器 | 新元素 | 踩坑表现 |
|---|---|---|---|
| `register.html` 第 3 步 | `welcome-card` 用 `overflow:hidden` + 200px emoji 装饰 | 加 progress bar | progress bar 上半部分被裁掉 |
| `mall/detail.html` 加 gift 按钮 | `.detail-actions` 是 `display: flex`（原 2 按钮横排） | 加 `.btn-gift` + `.gift-hint` | gift 按钮被挤成 1/3 宽，hint 被挤成竖排 |

**根因**：

1. **overflow 容器**：父容器用 `overflow: hidden` 隐藏超出部分（比如防止大 emoji 装饰外溢）—— 任何"应该突出来"的新元素都会被裁
2. **flex 容器**：父容器用 `display: flex` 让子项按 flex-basis 分配宽度——新增子项**会按比例挤压**现有元素；`width: 100%` / `display: block` **不能**让 flex 子项占满整行（flex 算法优先）

**自检纪律**（**加新元素到已有页面必走**）：

```bash
# 1. 看新元素要插入的父容器的布局上下文
grep -A 3 "新元素父选择器" public/css/*.css | grep "display\|overflow"
# 例：.detail-actions { display: flex; gap: 12px; } ← flex 容器！

# 2. 如果是 flex/grid 容器，新元素加 .flex-wrap: wrap + flex: 0 0 100% 强制换行占满
# 例：.btn-gift { flex: 0 0 100%; }

# 3. 如果父容器有 overflow: hidden，给新元素一个独立 wrapper（或调整父容器 overflow）
# 例：.hero { overflow: visible; }  ← 但要保留子元素的 emoji 装饰

# 4. 截屏验证（即使 visual diff AI 说"OK"也要人眼复查新元素是否破坏布局）
mavis mcp call playwright browser_take_screenshot ...
```

**错误示范**（detail.html 现场）：

```css
/* ❌ 以为 display: block + width: 100% 能让按钮占满 */
.btn-gift {
  display: block;
  width: 100%;
}
/* 实际：flex 容器里 .detail-actions { display: flex; }，子元素 width 100% 不生效，被挤成 1/3 */
```

**正确做法**：

```css
/* ✅ 父容器先开 wrap，子元素用 flex: 0 0 100% 强制换行 */
.detail-actions { flex-wrap: wrap; }
.btn-gift { flex: 0 0 100%; }  /* 不放大 + 不缩小 + 基础宽度 100% */
.gift-hint { flex: 0 0 100%; }
```

**统一原则**：**加新元素前先看父容器布局上下文**——flex 容器要 wrap + flex-basis、grid 容器要 grid-column、overflow 容器要单独 wrapper。不看就加必踩。

## 首页 splash 入场动画 — 方案 3（最终采纳）

**位置**：`index.html` `.splash` + `.splash-img` 区域

**决策**：从中心点向外爆开（30 张真实慈善图 12° 等分极坐标散开）

**参数**（累计 3 轮微调后的最终版）：
- **CSS** `.splash-img`：150×150px, border-radius 20, margin -75 -75, transform-style preserve-3d, backface-visibility hidden
- **GSAP Phase 0 起点**：`gsap.set(img, { x: 0, y: 0, scale: 0.5, opacity: 1, rotation: 0 })` —— 30 张小图聚在中心点可见
- **GSAP Phase 1 爆开**：
  ```js
  splashTl.to(splashImgs, {
    x: (i, el) => (parseFloat(el.dataset.ix) || 0) * 1.5,   // 散开距离 ×1.5（贴边爆开）
    y: (i, el) => (parseFloat(el.dataset.iy) || 0) * 1.5,
    rotation: (i) => (i % 2 === 0 ? 1 : -1) * (30 + i * 4),  // 旋转 30°→142°（慢）
    scale: 2.0, opacity: 0,                                   // 边散开边淡出
    duration: 1.2, ease: 'power3.out', stagger: 0.04
  }, 0.0);
  ```
- **Phase 2-4**：光晕扩散 + 品牌名"慈商联营"弹性出现 + splash 缩出 + 导航栏淡入
- **整段时长**：2.9s（比方案 2 的 4.3s 更紧凑更戏剧）

**3 轮微调历程**：
1. 初版：rotation 180+12i = 180°→528°，scale 终点 1.5
2. 第 1 轮：rotation 90+8i = 90°→314°，scale 终点 2.0，CSS 130×130
3. 第 2 轮（最终）：rotation 30+4i = 30°→142°，散开 × 1.5，CSS 150×150

**方案对比**（用户决策依据）：
| 方案 | 节奏 | 视觉 | 状态 |
|---|---|---|---|
| 方案 1 3D 翻牌 | 4.0s | 翻牌飞入 | 未采纳 |
| 方案 2 沿螺旋 path 飞入 | 4.3s | 远方飞来的卡片 | 备选 |
| **方案 3 中心点爆开（最终）** | **2.9s** | **中心能量爆炸** | **✅ 采纳** |

**复用模板**（跨页面可参考的 GSAP 中心爆开模式）：
```js
// 1. 30 张图聚合在中心（小图可见）
gsap.set(splashImgs, { x: 0, y: 0, scale: 0.5, opacity: 1 });
// 2. 散开到极坐标位置 + 边散开边淡出
gsap.to(splashImgs, {
  x: (i, el) => (parseFloat(el.dataset.ix) || 0) * 1.5,
  y: (i, el) => (parseFloat(el.dataset.iy) || 0) * 1.5,
  scale: 2.0, opacity: 0,
  duration: 1.2, ease: 'power3.out', stagger: 0.04
}, 0.0);
```
