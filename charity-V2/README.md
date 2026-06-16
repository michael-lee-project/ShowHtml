# 慈商联营官方网站 HTML 原型

> 海南亚洲公益研究院 · 全流程透明化公益平台
> 静态 HTML 原型 · 无需后端 · 直接打开 index.html 即可预览

## 🚀 快速开始

直接用浏览器打开 `index.html` 即可预览全部页面。

推荐浏览器：Chrome / Safari / Edge
推荐打开方式：双击 index.html，或在文件管理器中右键 → 在浏览器中打开

> 提示：所有路径都是相对路径，可直接 `file://` 打开，无需启动本地服务器。

---

## 📁 项目结构

```
charity-V2/
├── index.html                # 🏠 平台首页（核心门面）
│
├── public/                   # 公共资源
│   ├── css/
│   │   ├── style.css         # 主样式（设计语言/组件库）
│   │   └── dashboard.css     # 工作台专用样式
│   ├── js/
│   │   └── common.js         # 公共脚本（动态加载 header/footer/侧边栏/数字动画/弹窗）
│   └── partial/              # 预留 partial 目录（header/footer 已通过 JS 动态注入）
│
├── pages/                    # 公共页面（无需登录）
│   ├── about.html            # 关于慈商联营
│   ├── transparency.html     # 透明公示大厅（项目实时公示）
│   ├── track.html            # 物资全流程轨迹查询（公共查询入口）
│   ├── annual-report.html    # 2024 年度报告（含完整目录、章节、第三方审计）
│   ├── login.html            # 登录页
│   └── register.html         # 注册页（4 步向导式：选择角色→资料→提交→审核）
│
├── mall/                     # 慈善商城
│   ├── index.html            # 商城首页（含 5% 捐赠标识）
│   ├── category.html         # 商品分类
│   ├── detail.html           # 商品详情
│   ├── cart.html             # 购物车
│   ├── checkout.html         # 订单结算（突出每单 5% 捐赠）
│   └── orders.html           # 我的订单
│
├── company/                  # 🏢 爱心企业工作台（8 个页面）
│   ├── dashboard.html        # 数据看板
│   ├── donate-publish.html   # 发起捐赠（流程一）
│   ├── donate-respond.html   # 响应捐赠项目（流程二/三）
│   ├── donation-list.html    # 捐赠记录
│   ├── donation-detail.html  # 捐赠详情+物资全流程轨迹
│   ├── products.html         # 商品管理
│   ├── bills.html            # 财务账单（入驻费/年费/押金）
│   └── profile.html          # 企业品宣主页
│
├── charity/                  # 🏛️ 慈善会/总会工作台（7 个页面）
│   ├── dashboard.html        # 数据看板（含地区分布地图）
│   ├── project-publish.html  # 发布受灾项目（4 步向导）
│   ├── project-list.html     # 项目管理
│   ├── donation-claim.html   # 领取企业捐赠
│   ├── distribute.html       # 物资派发管理
│   ├── volunteer-manage.html # 志愿者管理
│   └── reports.html          # 数据报告
│
├── org/                      # 🤝 社会组织工作台（5 个页面）
│   ├── dashboard.html        # 数据看板
│   ├── profile.html          # 组织信息 + 资质管理
│   ├── volunteer-manage.html # 志愿者管理
│   ├── distribute.html       # 物资派发
│   └── statistics.html       # 统计报告
│
├── volunteer/                # 🙋 志愿者/社工工作台（5 个页面）
│   ├── dashboard.html        # 数据看板
│   ├── task-list.html        # 派发任务
│   ├── task-detail.html      # 扫码派发详情（含扫码动画）
│   ├── statistics.html       # 服务统计
│   └── profile.html          # 个人中心
│
└── recipient/                # ❤️ 受捐者中心（4 个页面）
    ├── dashboard.html        # 我的中心（含扫码入口）
    ├── receive.html          # 扫码领取物资
    ├── feedback.html         # 反馈页面（多维评分）
    └── history.html          # 领取记录
```

**总计 42 个 HTML 页面 + 3 个公共资源文件**

---

## 🎯 核心设计理念

### 1. 突出"全流程可视化"（最重要）
- **首页**：实时公益数据大屏、物资流转地图（5 个区域带 pulse 动画）
- **物资轨迹**（pages/track.html + company/donation-detail.html）：完整 6 节点时间轴，从企业仓库→慈善会→区域仓→志愿者→入户派发→受捐者签收
- **受捐者反馈**：每条捐赠详情都包含真实反馈，公开可查

### 2. 三种捐赠流程清晰展示
- **流程一**（企业主动）：企业→属地慈善会→志愿者/社工→受捐者
- **流程二**（响应·派发后发货）：项目发布→匹配→派发→企业发货
- **流程三**（响应·寄送+登记）：项目发布→匹配→寄送→派发+扫码登记

### 3. 5 种用户角色各自专属工作台
- 🏢 **企业**：发起捐赠、响应项目、商品管理、品宣主页、账单
- 🏛️ **慈善会/总会**：发布项目、领取物资、派发管理、志愿者管理
- 🤝 **社会组织**：协同慈善会执行派发
- 🙋 **志愿者/社工**：扫码派发、上传反馈
- ❤️ **受捐者**：扫码领取、反馈

### 4. 商城突出"消费即公益"
- 每件商品卡片显示"每单捐赠 ¥ X.XX"
- 结算页明确展示"本订单慈商联营将捐赠 ¥ X"
- 平台按 5% 自动捐赠

### 5. 入驻费/年费/押金 一目了然
- 企业工作台 - 账单页面完整呈现三类费用
- 押金由招商银行公益专户独立托管

---

## 🎨 设计语言

- **主色**：活力橙 `#E85D04`（CTA/重点）
- **辅色**：信任深绿 `#0E5A6F`（专业/慈善）
- **金色**：温暖金 `#C4842A`（慈善/荣誉）
- **透明化色**：薄荷绿 `#14B8A6`（可追溯/可信任）
- **背景**：暖白 `#FAF8F4` + 冷白 `#F5F7FA`（数据屏）

- **圆角**：6 / 10 / 14 / 20 / 28px
- **阴影**：4 级阴影系统
- **字体**：苹方 / 思源黑体
- **微动效**：fade-up 渐入、live-dot 脉冲、scan-line 扫码线、pulse-pin 地图标记

---

## 🔗 页面间导航关系

```
首页 (index.html)
├── [公共顶部] 关于 · 透明公示 · 物资轨迹 · 年度报告 · 慈善商城 · 登录/注册
│
├── /pages/                   公共页面（无需登录）
│   ├── about.html            关于我们
│   ├── transparency.html     透明公示大厅
│   ├── track.html            物资轨迹查询（输入编号）
│   ├── annual-report.html    年度报告
│   ├── login.html
│   └── register.html         4 步向导：选择角色→填资料→提交→审核
│
├── /mall/                    慈善商城（消费即公益）
│   └── 6 个页面
│
├── /company/                 企业工作台（需登录）
│   └── 8 个页面
│
├── /charity/                 慈善会工作台
│   └── 7 个页面
│
├── /org/                     社会组织工作台
│   └── 5 个页面
│
├── /volunteer/               志愿者/社工工作台
│   └── 5 个页面
│
└── /recipient/               受捐者中心
    └── 4 个页面
```

---

## 💡 关键技术细节

1. **公共 header/footer 通过 JS 动态注入**（`public/js/common.js`）
   - 自动根据当前页面路径计算根目录前缀
   - 通过查找 `<script src="...common.js">` 的 src 反推，相对路径稳定可靠

2. **工作台侧边栏通过 `CS.renderSidebar(role, active)` 渲染**
   - 支持 5 种角色：company / charity / org / volunteer / recipient
   - 当前页高亮自动处理

3. **数字滚动动画**：`.animate-on-scroll` + `[data-num]`
   - 进入可视区域时自动触发数字滚动
   - 适用于所有数据大屏

4. **扫码动画**：纯 CSS keyframes 实现扫描线动效
   - 志愿者工作台 task-detail.html
   - 受捐者 receive.html

5. **流程 Tab 切换**：纯 JS 实现，无需路由
   - 首页三种捐赠流程 Tab
   - 各工作台的状态/类型 Tab

6. **所有弹窗 / Toast 提示**：通过 `CS.modal()` / `CS.toast()` 调用
   - 无需任何第三方库

---

## 🧪 测试账号

由于是静态原型，所有"登录"操作直接跳转到对应工作台首页。无需真实账号。

- 点击任何 "登录" 按钮 → 自动跳到 `company/dashboard.html`
- 注册流程可完整演示 4 步

---

## 📋 后续可扩展

- [ ] 接入真实后端 API
- [ ] 接入微信扫码登录
- [ ] 接入企业微信 / 钉钉通知
- [ ] 物资二维码生成（每件物资独立 ID）
- [ ] 受捐者大数据画像
- [ ] 区块链存证（物资流转不可篡改）

---

## 📞 项目信息

- **项目名称**：慈商联营官方平台
- **运营主体**：海南亚洲公益研究院
- **设计语言**：温暖橙 + 信任深绿 + 慈善金
- **核心价值**：完成慈善最后一公里，让每一份善意都可追溯、可看见、可信任

---

© 2025 海南亚洲公益研究院 · 慈商联营 · 静态原型 v2.0
