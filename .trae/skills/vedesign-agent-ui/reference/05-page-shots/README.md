# Page Shots · 核心页面截图索引

本系统当前定义 3 类核心页面。任何「搭整页」需求**先在这里归类**，命中即按对应章节走，不要追问用户。

---

## 组件优先原则（务必先读）

下面每张 page-shot 描述的所有 UI 元素 —— 用户气泡 / 思维链折叠区 / 工具调用代码块 / 产物预览卡 / 产物区 / Composer / 功能 chips / 历史会话项 等等 —— **几乎全部都是原子或 Agent 组件**。

- 本文件只描述「这个页面用了哪些组件、怎么组合」
- 组件本身的视觉细节、状态、API 先读 `reference/03-component/component-routing.md`,再读 `reference/03-component/vedesign-use-skill/react/index.md` 和精确组件文档
- React 项目优先使用 `@ve-design/react` 与 `@ve-design/react/icons`,包和主题入口见 `reference/04-asset/asset-packages.md`,**无需从零写视觉**
- 你的工作是「组合 + 排版」，**不是「重新设计组件」**

如果某个元素在 `reference/03-component/component-routing.md` 里找不到对应组件,先在通用规范下用 Token 自己实现,并在交付时**列出"建议沉淀为组件"的清单**给团队。

---

## 触发归类表

| 页面 | 触发关键词 | 截图 |
|------|----------|------|
| **欢迎页** | 首页 / 起始页 / 欢迎页 / agent 首页 / 方舟首页 / chat 首页 / 新对话起始页 / welcome / landing | `01-welcome.png` |
| **对话页** | 对话页 / chat 页 / 过程页 / 长文档回复 / agent 回复 / done 长文档态 / 普通对话 / markdown 回复 | `02-chat.png` |
| **三栏结果页** | 三栏 / 三栏结果页 / 生成内容页 / 产物页 / 产出页 / 含产物的对话页 / artifact 页 / 代码+预览 | `03-three-pane.png` |
| **思维链 / 生成中** | 思考过程 / 思维链 / 思考的问题 / chain-of-thought / streaming 页 / 生成中 / 推理过程展开 | `04-thinking.png` |
| **搜索 Modal** | 搜索弹窗 / 命令面板 / cmd-K / 全局搜索 / 搜索 Modal | `05-search-modal.png` |
| **Skill 详情 Modal** | skill 详情 / MCP 详情 / 智能体详情 / 详情弹窗 / 安装弹窗 / 试用弹窗 | `06-skill-detail-modal.png` |
| **设置页** | 设置 / 偏好设置 / settings / 个性化 / 主题切换页 / 账户设置 | `07-settings.png` |
| **文件库** | 文件库 / 文件管理 / file library / 我的文件 / 文件墙 / 文件缩略图 | `08-file-library.png` |
| **Skill 发现** | 技能商店 / skill store / MCP 商店 / 发现 / 安装 skill / 技能发现 | `09-skill-discovery.png` |
| **Skill 管理** | skill 管理 / 已装 skill / 启停 skill / 技能开关 / 管理已安装 | `10-skill-manage.png` |

**命中规则**:
- 从上往下匹配,命中即停
- 命中上表 → 按对应章节的「MUST-HAVE 模块清单」+ Do / Don't 走;具体尺寸 / class / 骨架走「详细规格」里指路的 `layouts.md` § 章节
- 不命中 → 按 SKILL.md 通用规范自由发挥,**不要主动询问用户归类**

**歧义裁决**：
- "对话页"无产物 → 走对话页（§02）
- "对话页带产物" / "产物展开" → 走三栏（§03）
- "对话页 + 思考过程" → 走思维链（§04）

**截图获取**：
全部 PNG 已放在本目录下(`01-welcome.png` … `10-skill-manage.png`)。**模型读本 README 时不会自动加载 PNG 文件**(避免无谓占用 context),需要做某一页时,在对应章节内**按提示显式 view 那张 PNG**,跟文字描述配合理解。

---

## 共通反 pattern(适用所有页面)

以下是 page-shots 视觉真相钉死的反 pattern,**所有页面共用**:

- **Logo / 图标**:优先使用 `@ve-design/react/icons` 和产品宿主已有品牌资产;图标用法见 `reference/03-component/vedesign-use-skill/react/icon.md` 和 `reference/04-asset/asset-packages.md`
- **Sidebar 宽度漂移**:展开态在所有 page 都固定 220px,收起态固定 54px;不要在欢迎页、对话页、文件库、设置页、发现页、管理页或三栏页分别覆盖不同宽度 / flex-basis。
- **头像 fallback**:首字母 + `--color-bg-muted` 灰底,**不是彩色渐变**
- **emoji ❌ 大图占位**:禁用,用真实图(走 `reference/04-asset/images/README.md`)/ VeDesign icon / token placeholder 灰块代替
- **历史会话项不要混入功能 chip 名**(业务速通 / 资产查找等是 chip,不是历史会话)

> ⚠️ 页面骨架的 ASCII 图 + 尺寸 / 容器关系 / class 命名 → **去 `reference/02-layout/layouts.md` §1(对话页)/ §2(功能页)/ §3(三栏页)** 查,本文件**不重复**。

---

## 01-welcome.png · 欢迎页

> 📷 **视觉真相图**: `reference/05-page-shots/01-welcome.png` — 做这一页时必须 `view` 此 PNG 文件,跟下面文字描述配合理解。不要凭文字想象做。
>
> *(alt: 欢迎页设计稿（视觉真相，必须对照此图理解下面所有文字描述）)*

**用途**：用户首次进入产品 / 新建对话时的起始视图，传达"可以直接开始聊"。

### ⛔ MUST-HAVE 模块清单(一条不漏,少一条 = 没读 page-shots)

复述本清单证明你读了。**尺寸 / class / 容器关系全部走 `layouts.md` §1.1,本清单只列必须出现的模块 + 数量 / 视觉特征:**

- [ ] **Sidebar 展开态**:含 5 块 —— 品牌区 / 主菜单 / 项目分组 / 历史会话分组 / 底部用户区(尺寸走 layouts.md §1.1);品牌区必须是同一行 `logo + Agent Design + 右侧收起按钮`,logo 不得掉到产品名下方。React 实现时 `Sidebar logo` 必须传 element 常量,不要传不透传 props 的函数组件
- [ ] **Hero 标题**:「今天想设计点什么?」,居中
- [ ] **Composer**:占位文字 + 操作排(左:附件 / 深度思考开关 / 联网开关;右:语音 / 发送)
- [ ] **Composer 必须开启 shimmer-border 流光边缘光效**:引入 `motion/shimmer-border.css` 和 `motion/shimmer-border.js`,并给真正拥有输入框圆角和可见边框的 Composer shell 加 `.ved-shimmer-host` / `data-shimmer` / `data-shimmer-radius="20"`;不要只用 `ChatInput borderGlow` / `ve-chat-input border-glow` 代替
- [ ] **功能 chips**:**9 个 + 「更多」**(业务速通 / 资产查找 / 生成 PPT / 生成网页 / 生成视频 / 行业研究 / 灵感图片 / 归因分析 / 更多),**不能只给 4 个**
- [ ] **底部示例画廊**:标题「试试以下图像理解任务」+ **4 张卡片**(进行图像分类 / 生成图片标题 / 批改英文作文 / 识别视频内容),配图走 `reference/04-asset/images/README.md`;必须使用 `gallery-01.jpg` 到 `gallery-11.jpg` 的真实图片,不得用图标、emoji、文字或灰块替代
- [ ] **页脚免责声明**:「试用体验内容均由人工智能模型生成,不代表平台立场」,**贴白卡底部**不跟内容滚动(DOM 位置 + 样式走 layouts.md §0.6)

### Do / Don't

- ✅ 功能 chips 用固定圆角(参数走 layouts.md §1.1)
- ❌ 功能 chips 用 `--radius-full`(不同字数 chip 间产生不一致椭圆)
- ❌ 功能 chips 用 `--radius-md`(变成普通按钮,失去欢迎页轻松感)
- ✅ Hero 标题下方 Composer 留足上下空间
- ❌ Composer 紧贴 Hero 标题(拥挤、不像欢迎页)
- ❌ 在欢迎页放消息流(无消息时直接放 Hero + Composer + chips,不要占位空消息)

### 详细规格

- 骨架 / 尺寸 / class / token → `reference/02-layout/layouts.md` §1.1
- Composer 边缘光效 → `reference/04-asset/motion/SHIMMER-BORDER.md` + `motion/shimmer-border.css/js`;组件文档 `borderGlow` 不能替代
- 配图方案 → `reference/04-asset/images/README.md`

---

## 02-chat.png · 对话页 / chat 页 / 过程页

> 📷 **视觉真相图**: `reference/05-page-shots/02-chat.png` — 做这一页时必须 `view` 此 PNG 文件,跟下面文字描述配合理解。不要凭文字想象做。
>
> *(alt: 对话页设计稿（视觉真相，必须对照此图理解下面所有文字描述）)*

**用途**:用户发起对话后看到的核心视图。Agent 已生成回答(**长文档形态**),用户在阅读 + 互动(复制 / 重新生成 / 翻页 / 点赞)。**Agent 产品最高频的页面状态**。

### ⛔ MUST-HAVE 模块清单(一条不漏,少一条 = 没读 page-shots)

**尺寸 / 字号 / class 走 `layouts.md` §1.2 / §1.3,本清单只列必须出现的模块 + 数量 / 视觉特征:**

- [ ] **Sidebar 收起态**:**纯 icon 条**(不是欢迎页的展开态);顶部只有一个 logo 热区,默认显示 logo,hover / focus 时在同一位置原位替换为展开 icon;展开 icon 不得另起一行、不得占用第一个 nav item 位置
- [ ] **顶部 Header**:左侧对话标题 + 右侧 **4 个 icon**(`</>` 代码 / 分享 / 更多 / 关闭)
- [ ] **对话流**:用户气泡(右对齐 / `--color-bg-surface` 灰底 / `--radius-xl`)+ Agent 回复(**无气泡 / 直接 markdown 铺底**)
- [ ] **Markdown 长文档渲染**:含 H1 / H2 / H3 / p / hr 多级层级(字号 / 行高 / padding 详见 layouts.md §1.3 Markdown 排版表)
- [ ] **ActionBar**(Agent 回复底部):**11 个元素**(Pagination / Copy / Refresh / Forward / Speaker / Like / Dislike / More / 参考资料 等),详见 layouts.md §1.3
- [ ] **底部 Composer**:chat 形态(操作排贴底),使用 `ChatInput` / `ve-chat-input` 内置唯一发送按钮;`rightAction` / `right-action` 只能放语音等辅助控件,不能额外加发送按钮
- [ ] **底部 Composer 流光边框**:使用 `motion/shimmer-border.css/js` + `.ved-shimmer-host` / `data-shimmer` / `data-shimmer-radius="20"`,且挂在真正拥有输入框圆角和可见边框的 Composer shell 上;不要只用 `ChatInput borderGlow`
- [ ] **滚动跟随逻辑**:流式输出时**用户上滑 > 80px 后必须暂停 auto-scroll**(细则见 layouts.md §1.4 三状态机)。一帧无脑 `scrollTop = scrollHeight` = bug
- [ ] **流式 mock 回复**(无真 API 时):必须**逐字符吐字 + thinking 块 + markdown + 代码块 / artifact**,不许整段 innerHTML 交差(细则见 layouts.md §1.5)

> ⚠️ 本页面是「对话页」通用形态,覆盖 streaming 中 / 生成完成 / 长文档展示等多种状态。思维链 / 联网搜索 / 工具调用等子模块见 `04-asset/motion/README.md` 中的 streaming-response / chain-of-thought / tool-call pattern。
>
> ⚠️ 对话页不要复用欢迎页的 spotlight-dot-grid、能力 chips、gallery 或主内容区侧栏折叠按钮;这些属于起始页,进入 chat 后会干扰阅读和输入。

### Do / Don't

- ✅ **正文字号读阅读级**(Agent 回复阅读体验),不要塌成界面 UI 字号(具体 px → layouts.md §1.3)
- ❌ 正文用界面 UI 14:太密,长文档阅读累
- ✅ **段落之间留呼吸**(具体值 → layouts.md §1.3)
- ❌ 段落之间用 24/32 留白:过度,长文档拉得太长
- ✅ **H1/H2/H3 的 padding-top 大于 padding-bottom**(标题与上一节分隔,与下方紧贴)
- ❌ H1/H2/H3 padding 上下对称:标题归属感不清
- ✅ **hr 极细**(具体值 → layouts.md §1.3):clean & subtle
- ❌ hr 用 1px / 2px:太重,破坏阅读节奏
- ✅ **Agent 回复直接铺在页面背景上**(无气泡 / 无卡片包裹),左对齐
- ❌ Agent 回复也加气泡或灰底卡片:和用户消息区分不开
- ✅ Agent 回复正文用 `.msg-ai + Markdown` 直接承载,底部再接 `Actions` / `Citation`
- ❌ 用 `Bubble variant="text"` 包住 Agent 回复:会触发内置“查看更多”,长文档阅读形态会变得很怪
- ✅ Header / ActionBar 用线性单色图标
- ❌ 普通操作按钮使用 `IconType*State*` 多色文件类型图标

### 详细规格

- 骨架 / 尺寸 / class / Markdown 完整字号表 / ActionBar 完整规格 → `reference/02-layout/layouts.md` §1.2 / §1.3
- 流式 / 思维链 / 工具调用组件 → `reference/03-component/component-routing.md`、`reference/03-component/vedesign-use-skill/react/thinking.md`、`reference/03-component/vedesign-use-skill/react/thought-chain.md`、`reference/03-component/vedesign-use-skill/react/authorization.md`

---

## 03-three-pane.png · 三栏结果页（含产物区）

> 📷 **视觉真相图**: `reference/05-page-shots/03-three-pane.png` — 做这一页时必须 `view` 此 PNG 文件,跟下面文字描述配合理解。不要凭文字想象做。
>
> *(alt: 三栏结果页设计稿（视觉真相，必须对照此图理解下面所有文字描述）)*

**用途**:当 Agent 生成的产物可独立展示(HTML 网页 / 代码文件 / 长文档 / 图片 / 数据表),自动展开右侧产物区进入三栏布局,让用户**边对话边查看 / 编辑产物**。

### ⛔ MUST-HAVE 模块清单(一条不漏,少一条 = 没读 page-shots)

**尺寸 / class / 容器关系走 `layouts.md` §3,本清单只列必须出现的模块 + 视觉特征:**

- [ ] **Sidebar 收起态**:纯 icon 条
- [ ] **左侧对话区**:用户消息 + Agent 回复 + 产物卡片 ArtifactCard(点击可展开/重新生成)+ 底部 Composer
- [ ] **产物卡片 ArtifactCard**:左侧产物类型 icon(`</>` 代码 / `📄` 文档 / `🖼️` 图片)+ 中间文件名 + 元信息 + 右侧操作 icon(下载 / 聚焦)
- [ ] **Artifact 使用组件能力**:产物卡片优先用 `ArtifactCard`,光效 / 操作 / 预览能力以 `reference/03-component/vedesign-use-skill/react/artifact-card.md` 为准,不要把输入框专用的 `shimmer-border` 初始化函数用于 ArtifactCard
- [ ] **右侧产物区**:顶部工具栏 + 内容区
- [ ] **顶部工具栏**:左 `</>` icon + 标题「产物区」/ 中 **tab 切换「代码 / 预览」**(仅 HTML / 可执行类型才显示)/ 右 **4 个操作**(格式化 / 分享 / 更多 / 关闭 ✕)
- [ ] **顶部工具栏高度与对齐**:产物区 header 必须和左侧 / 外部 `card-header` 同为 **56px**;左标题、中间 tab、右 actions 在同一条水平中线对齐,不能被 tab 或按钮撑高。VeDesign `Tabs` 必须用 `size="small"`
- [ ] **文件名行**:`snake_game.html` 形态 + 右侧复制按钮
- [ ] **代码 tab**:行号列(`--color-text-tertiary`,**不滚动**)+ 主代码(mono + 语法高亮:关键字蓝 / 字符串绿 / 类型紫 / 注释灰)+ 容器背景 `--color-bg-overlay`(与对话区背景区分)
- [ ] **预览 tab**:`<iframe srcdoc sandbox="allow-scripts">` 渲染 HTML/SVG,无边框
- [ ] **产物区可关闭** ✕:关闭后回退双栏(= chat 页布局)
- [ ] **产物区顶部工具栏 sticky**:内容滚动时保持可见

### Do / Don't

- ✅ 产物预览卡是**入口**,点击聚焦产物区,不是终点
- ❌ 产物预览卡里直接嵌入完整代码 / 完整文档预览(中间对话区会失去焦点)
- ✅ 产物区有独立的工具栏(分享 / 关闭等),与对话区操作分离
- ❌ 把产物区的操作按钮放在中间对话区顶部(用户不知道操作的是产物还是对话)
- ✅ 三栏顶部左右 header 等高,标题 / tab / actions 单行中线对齐
- ❌ 产物区 header 做成高工具栏或上下错位:会和外部 header 断层
- ✅ 关闭产物区时保留对话上下文,仅 panel 隐藏,再次点击对话区产物卡可恢复
- ❌ 关闭就丢上下文,要求重新生成

### 详细规格

- 骨架 / 尺寸 / class / 代码高亮 token → `reference/02-layout/layouts.md` §3
- ArtifactCard 组件 → `reference/03-component/vedesign-use-skill/react/artifact-card.md`
- 资源预览组件 → `reference/03-component/vedesign-use-skill/react/resource-preview.md`

---


## 04-thinking.png · 对话页（思维链 / 生成中状态）

> 📷 **视觉真相图**: `reference/05-page-shots/04-thinking.png` — 做这一页时必须 `view` 此 PNG 文件,跟下面文字描述配合理解。不要凭文字想象做。
>
> *(alt: 对话页思维链展开状态（视觉真相，必须对照此图理解下面所有文字描述）)*

> 🎯 **指纹关键词**(自检用):`思考的问题` / `给我一个贪吃蛇小游戏`
> 🧩 **类型**:对话页变体(02-chat 的 streaming/thinking 子状态)

**用途**:用户提问后、Agent 正式回复前的"思考过程展开"形态。展示 Agent 的推理链路(chain-of-thought),让用户看到「为什么这么回」。**Agent 产品差异化的关键体验**。

### ⛔ MUST-HAVE 模块清单(一条不漏,少一条 = 没读 page-shots)

**外壳跟 02-chat 完全一致(走 layouts.md §1.2),只多了思维链折叠区:**

- [ ] **基本外壳同 02-chat**:Sidebar 收起 + 顶部 Header + 用户消息气泡 + 底部 Composer + 页脚免责声明
- [ ] **思维链折叠区头**:Agent logo icon + "思考的问题" 文字 + ↑ 箭头(已展开态时显示)
- [ ] **思维链正文**(展开态):多段灰色小字(text-tertiary),左侧 vertical bar 强调(可选);段落示例:"嗯,用户让我..." / "用户没提供具体背景..." / "我的方案是..."
- [ ] **容器**:**无背景 / 无 border**,直接平铺在白卡内(不能变成"卡片")
- [ ] **默认状态**:可折叠,用户点击 chevron 展开 / 收起

### Do / Don't

- ✅ 思维链段落用 text-tertiary(弱化,让用户感知"这是过程")
- ✅ 默认折叠,用户点击展开
- ❌ 思维链段落用 text-primary(跟正式回复抢视觉焦点)
- ❌ 思维链文字加任何背景色 / border(会变成「卡片」失去"过程"感)

### 详细规格

- 骨架 / 尺寸 / class → `reference/02-layout/layouts.md` §1.2 + §1.3
- chain-of-thought / thinking 组件 → `reference/03-component/vedesign-use-skill/react/thinking.md` + `reference/03-component/vedesign-use-skill/react/thought-chain.md`

---

## 05-search-modal.png · 搜索 Modal(命令面板)

> 📷 **视觉真相图**: `reference/05-page-shots/05-search-modal.png` — 做这一页时必须 `view` 此 PNG 文件,跟下面文字描述配合理解。不要凭文字想象做。
>
> *(alt: 搜索 Modal(视觉真相,必须对照此图))*

**用途**:cmd-K 风格命令面板,全局搜索对话 / 项目 + 快速「新对话」入口。**触发**:Sidebar 搜索按钮 / `cmd-K` 快捷键 / Header 搜索 icon。

### ⛔ MUST-HAVE 模块清单

**Modal 壳子(尺寸 / 遮罩 / 三段式)走 layouts.md §4.1 + §4.3 sm 命令面板档,本清单只列必须出现的模块 + 视觉特征:**

- [ ] **顶部输入区**(独立段,底部有分隔线):search icon + placeholder「搜索对话/项目」+ 右侧 close icon
- [ ] **第一项"新对话"固定置顶**:add icon + 默认选中态高亮(`--color-bg-surface` 灰底),Enter 直接新建对话
- [ ] **section 分组标签**:「今天」「更早」`--color-text-tertiary` 分组
- [ ] **列表项**:项目项 folder icon / 会话项 message icon(或无 icon)
- [ ] **无 footer**:sm 档不需要底部操作区
- [ ] **键盘交互**:↑/↓ 切换高亮,Enter 进入,Esc 关闭(走 SKILL.md §0.4 交互兜底)

### Do / Don't

- ✅ 「新对话」永远第一行且默认选中
- ✅ 输入区和列表区有清晰分割
- ❌ 输入区和列表区共享一个 padding(看不出层级)
- ❌ 用深遮罩(命令面板要轻盈感,走 layouts.md §4.2 命令面板型遮罩色)

### 详细规格

- Modal 壳子 / 遮罩 / 三段式 / sm 档尺寸 → `reference/02-layout/layouts.md` §4
- icon → `@ve-design/react/icons` + `reference/03-component/vedesign-use-skill/react/icon.md`

---

## 06-skill-detail-modal.png · Skill / MCP / 智能体 详情 Modal

> 📷 **视觉真相图**: `reference/05-page-shots/06-skill-detail-modal.png` — 做这一页时必须 `view` 此 PNG 文件,跟下面文字描述配合理解。不要凭文字想象做。
>
> *(alt: Skill 详情 Modal(视觉真相,必须对照此图))*

**用途**:点击 skill / MCP / 智能体 卡片后弹出的详情页。展示能力描述、前置条件、用法代码、操作按钮(启停 / 卸载 / 试用)。

### ⛔ MUST-HAVE 模块清单

**Modal 壳子(尺寸 / 遮罩 / 三段式)走 layouts.md §4.1 + §4.3 lg 详情档,本清单只列必须出现的模块 + 视觉特征:**

- [ ] **Header 区**(三段式之顶):
  - 左:skill icon(带 subtle border)+ 标题 + 副标题
  - 右:**Switch 启停态** + more 按钮 + close 按钮
- [ ] **内容卡**(三段式之中,必有):二级容器(独立 border + radius,套在 Modal 内)
  - 顶部行:**Tab 切换**(文档 / 代码 两个 icon,**pill 形态**,bg-surface 容器内白底选中)+ 右上 copy icon
  - 正文段:`text-secondary` 阅读级字号
  - h3 小标题:Semibold
  - 代码块:`--color-bg-surface` 底 + 顶部 label(如「Base」)+ 命令行,关键词高亮
  - bullet list
- [ ] **Footer 区**(三段式之底):
  - 左下:**「卸载」按钮**(非破坏性危险态):`--color-rose-100` 浅红底 + `--color-rose-600` 深红字
  - 右下:**「在对话中试用」主按钮**:黑底 + message icon + 白字

### Do / Don't

- ✅ Tab 切换器用 pill 形态(bg-surface 容器内白底选中)
- ✅ 代码块加 label 提示语言/环境
- ✅ "卸载"用 rose-100/600(非破坏性危险态)
- ❌ "卸载"按钮用主红色(destructive 暗示不可逆,但卸载是可恢复的)
- ❌ Modal 容器内边距过小(走 layouts.md §4.3 lg 档钉死的 padding 值,**不要凭印象写**)

### 详细规格

- Modal 壳子 / 遮罩 / 三段式 / lg 档尺寸 / padding → `reference/02-layout/layouts.md` §4
- 详情弹窗组件组合 → `reference/03-component/component-routing.md` + `reference/03-component/vedesign-use-skill/react/modal.md` + `reference/03-component/vedesign-use-skill/react/tabs.md` + `reference/03-component/vedesign-use-skill/react/switch.md`

---

## 07-settings.png · 设置页

> 📷 **视觉真相图**: `reference/05-page-shots/07-settings.png` — 做这一页时必须 `view` 此 PNG 文件,跟下面文字描述配合理解。不要凭文字想象做。
>
> *(alt: 设置页(视觉真相))*

> 🎯 **指纹关键词**(自检用):`基础设置` / `运行时防止系统休眠`
> 🧩 **类型**:独立整页(非 Modal)

**用途**:用户偏好设置中心。包含主题、语言、通知、个性化、应用、安排、账单、家长控制、账户等。

### ⛔ MUST-HAVE 模块清单

**外壳走 layouts.md §2 + 子结构 §2.3,本清单只列必须出现的模块 + 视觉特征:**

- [ ] **遵循 §2 功能页骨架统一规则**:跟文件库 / Skill 系**完全一致**的外壳,**不允许**起 `.settings-layout` / `.settings-content` 这种页面专属 class
- [ ] **§2.3 子结构 B 二级布局**:左 `.feature-sub-nav` + 右 `.feature-detail`(尺寸 → layouts.md §2.3)
- [ ] **sub-nav 项**:项数和具体内容**按业务需求定**。page-shots 列了 8 项(常规 / 通知 / 个性化 / 应用 / 安排 / 账单 / 家长控制 / 帐户)作示例,实际项目可按需调整(4 项也行,12 项也行)。默认选中第一项
- [ ] **内容区分组** `.feature-group`:每组小标题 Semibold + 多个 setting-row
- [ ] **setting-row 标准布局**:左 label(`.setting-name` 主文 + `.setting-desc` 次文)/ 右控件(toggle / select / button / theme-selector)
- [ ] **toggle 控件**:启用 `--color-bg-primary` / 禁用 `--color-bg-muted`,**禁止内联 hex**
- [ ] **外观分组(`feature-group` 名为「外观」)必须包含两行,二者顺序固定**:
  - **第 1 行「主题」**:亮 / 暗切换器(圆形 icon 按钮一组,见下条规格)
  - **第 2 行「所属产线」**:5 个产线 chip 切换器(Agent / Arkclaw / 安全 / 火山引擎 / 火山方舟),让最终用户能在 demo 内热切换 `<html data-theme>`,跟 build 时锁定的初值正交。**这一行不可省**,即使 build 时已锁定某产线也要给用户切换入口(`demo 不是静态稿` 铁律)。详见下方「外观区产线切换器规格」段
- [ ] **theme 切换器**(若产品提供):圆形 icon 按钮一组,**档数按业务定**(两档 / 三档)。颜色**必须用 token**(`--color-bg-base` / `--color-bg-strong` 等),**禁止内联 hex `#fff` `#e5e5e5` `#111118`** —— 违反 SKILL.md §1.1 token 铁律
- [ ] **Sidebar 底部用户浮层**:点击「用户名称」展开浮层菜单「设置 / 剩余额度 / 帮助与反馈 / 退出登录」+ 当前账号信息

### 外观区产线切换器规格(MUST-HAVE)

**视觉结构**:5 个产线 chip 横排,每个 chip = 圆形 swatch(14×14)+ 中文标签,选中态加 1.5px primary 边框。

**HTML 骨架**:

```html
<div class="setting-row">
  <div class="setting-label">
    <div class="setting-name">所属产线</div>
    <div class="setting-desc">切换不同产品品牌色</div>
  </div>
  <div class="brand-theme-selector">
    <button class="brand-theme-option active" data-brand-theme="agent">
      <span class="brand-theme-swatch brand-theme-agent"></span>
      <span class="brand-theme-label">Agent</span>
    </button>
    <button class="brand-theme-option" data-brand-theme="arkclaw">
      <span class="brand-theme-swatch brand-theme-arkclaw"></span>
      <span class="brand-theme-label">Arkclaw</span>
    </button>
    <button class="brand-theme-option" data-brand-theme="security">
      <span class="brand-theme-swatch brand-theme-security"></span>
      <span class="brand-theme-label">安全</span>
    </button>
    <button class="brand-theme-option" data-brand-theme="volcengine">
      <span class="brand-theme-swatch brand-theme-volcengine"></span>
      <span class="brand-theme-label">火山引擎</span>
    </button>
    <button class="brand-theme-option" data-brand-theme="volcark">
      <span class="brand-theme-swatch brand-theme-volcark"></span>
      <span class="brand-theme-label">火山方舟</span>
    </button>
  </div>
</div>
```

**CSS 关键点**(详见 layouts.md §2.3 的 `.setting-row`):

```css
.setting-row {
  display: flex;
  align-items: flex-start;          /* 不要 center,多行时左侧标题与 chip 顶对齐 */
  gap: var(--space-l);
  flex-wrap: wrap;                  /* 窄屏时 chip 整体下排 */
}
.setting-row > .setting-label {
  flex: 1 1 240px;
  min-width: 200px;                 /* 防止"所属产线"被压缩成单字纵向 */
}
.brand-theme-selector { display: flex; gap: var(--space-xs); flex-wrap: wrap; }
.brand-theme-option {
  display: flex; align-items: center; gap: 6px;
  padding: 6px 10px;
  border: var(--stroke-weight-base) solid var(--color-border-default);
  border-radius: var(--radius-md);
  cursor: pointer;
  font-size: var(--text-body-sm);
  color: var(--color-text-secondary);
  background: var(--color-bg-base);
}
.brand-theme-option.active {
  border-color: var(--color-primary-600);
  color: var(--color-text-primary);
  font-weight: var(--font-weight-medium);
}
.brand-theme-swatch { width: 14px; height: 14px; border-radius: 50%; flex-shrink: 0; }
.brand-theme-swatch.brand-theme-agent      { background: #383740; }
.brand-theme-swatch.brand-theme-arkclaw    { background: #383740; }
.brand-theme-swatch.brand-theme-security   { background: #383740; }
.brand-theme-swatch.brand-theme-volcengine { background: #1664ff; }
.brand-theme-swatch.brand-theme-volcark    { background: #5252FF; }
```

⚠️ **swatch 颜色 5 个 hex 是例外允许的**(代表色样板,不是业务色),业务文本/边框等仍必须用 token。

**JS 行为**:点击 chip → 调 `setBrandTheme(name)` 函数,内部做 3 件事:① `document.documentElement.setAttribute('data-theme', name)` + localStorage 持久化;② 重渲染设置页(让选中态高亮跟随);③ 若宿主项目有自定义 motion / shimmer 系统,按项目侧协议刷新对应实例颜色。当前 skill 不提供 `data-breathing-blob`、`data-shimmer` 或 motion registry 协议,不要凭空引用。亮/暗切换跟产线切换**正交**,可独立操作 / 任意组合(`<html data-theme="volcark" class="dark">` 合法)。

### Do / Don't

- ✅ setting-row 之间用浅 divider 而不是深 border(具体值 → layouts.md §2.3)
- ✅ sub-nav 选中态走 layouts.md §2.3 规格,**不要加左侧 vertical bar**
- ✅ theme 切换器用 token 上色
- ✅ 外观分组**同时包含**「主题(亮/暗)」+「所属产线(5 选 1)」两行,顺序固定:主题在上 / 产线在下
- ✅ 产线切换 = 改 `<html data-theme>`;亮/暗切换 = 改 `<html class="dark">`,两者正交独立
- ❌ 给设置页起独立 layout class(`.settings-layout` / `.settings-content` 等)→ 必重做
- ❌ theme 切换器内联 hex 色值 → 违反 token 铁律(除产线 swatch 5 个色样例外)
- ❌ 外观分组只放亮/暗不放产线 → 用户在 demo 内没办法切产线,违反 `demo 不是静态稿` 铁律
- ❌ 把产线切换和亮/暗切换合并成一个控件 → 它们是 2 个独立维度,产线 5 档 / 亮暗 2 档,合并语义错乱
- ❌ **凭空引用本 skill 不存在的 `setGradient()` / `SHIMMER_GRADIENTS_REGISTRY` / `data-breathing-blob` 协议** → 当前 skill 只要求主题状态与 `data-theme` 同步;私有 motion 系统只在宿主项目已有协议时接入
- ❌ 把设置当 Modal 做(设置项太多,必须用整页)

### 详细规格

- 骨架 / 尺寸 / sub-nav 子结构规格 / setting-row 规格 → `reference/02-layout/layouts.md` §2 + §2.3
- 设置控件组件 → `reference/03-component/component-routing.md` + `reference/03-component/vedesign-use-skill/react/switch.md` + `reference/03-component/vedesign-use-skill/react/select.md` + `reference/03-component/vedesign-use-skill/react/radio.md`

---

## 08-file-library.png · 文件库

> 📷 **视觉真相图**: `reference/05-page-shots/08-file-library.png` — 做这一页时必须 `view` 此 PNG 文件,跟下面文字描述配合理解。不要凭文字想象做。
>
> *(alt: 文件库列表态(视觉真相))*

> 🎯 **指纹关键词**(自检用):`文件库` + `修改时间` + `大小`
> 🧩 **类型**:独立整页,列表视图(产品主形态)

**用途**:用户上传 / Agent 生成的文件统一管理。列表态适合精确扫读(文件名 / 修改时间 / 大小),是文件库的默认与唯一形态。

### ⛔ MUST-HAVE 模块清单

**外壳走 layouts.md §2 + 子结构 §2.4,本清单只列必须出现的模块 + 视觉特征:**

- [ ] **遵循 §2 功能页骨架统一规则**:跟设置页 / Skill 系**完全一致**的外壳,**不允许**起 `.files-layout` / `.file-list-page`
- [ ] **§2.4 子结构 A 单层 Tab + 列表**:`.filter-bar` + `.data-region`
- [ ] **页面操作区**:右侧搜索框 + 「+ 上传」黑底主按钮
- [ ] **Tab 切换**:`全部` / `图片 N` / `文件 N` **三个 pill tab**(数字跟在中文标签后)+ 右侧 filter icon + 视图切换器(网格 / 列表 icon,**网格本期不实现,仅视觉占位**)
- [ ] **表头**:`名称` / `修改时间` / `大小`,带 chevron-down icon 表示当前排序字段
- [ ] **表行**:左侧文件类型 icon(`type=pdf, state=Default.svg` 玫红 / `type=docx` 蓝 / `type=image` 橙 / `type=svg` 绿 / `type=video` 紫 等)+ 文件名 + 右侧三列(修改时间 / 大小 / `…` more)。**24×24px 固定**,**整段复制原 SVG 保留 `fill="#xxx"` 原色** —— 不准改 `fill="currentColor"`,不准在父元素加 `color: var(--color-icon-primary)` 试图统一灰化,详见 `icons/README.md` §文件类型彩色资产例外
- [ ] **行 hover 态**:`bg-surface` 高亮整行 + 显示 `…` 按钮(默认隐藏,hover 出现)

### Do / Don't

- ✅ Tab 数字跟在中文标签后(`图片 13`)
- ✅ 视图切换器 / filter icon 跟标题在同一行,不另起一行
- ✅ hover 才显示 more 按钮(保持视觉干净)
- ✅ 文件类型 icon **保留原始彩色**(PDF 玫红 / Word 蓝 / 图片橙 / SVG 绿 / 视频紫 / Excel 绿 等),同类同色,跨产线 / 双主题保持不变
- ❌ **文件类型 icon 被染成灰色**(改 `fill="currentColor"` / host `color: var(--color-icon-...)`)→ 失去文件类型识别功能 = bug,必须改回原 hex
- ❌ "上传"按钮放在左上(破坏「读 → 操作」的视觉流)
- ❌ 用网格态作为默认形态(本期产品决策:列表是唯一形态)

### 详细规格

- 骨架 / 尺寸 / Tab 切换器 / 表行高 / divider → `reference/02-layout/layouts.md` §2 + §2.4
- icon → `@ve-design/react/icons` + `reference/03-component/vedesign-use-skill/react/icon.md`

---

## 09-skill-discovery.png · Skill / MCP 发现页(网格)

> 📷 **视觉真相图**: `reference/05-page-shots/09-skill-discovery.png` — 做这一页时必须 `view` 此 PNG 文件,跟下面文字描述配合理解。不要凭文字想象做。
>
> *(alt: Skill 发现页(视觉真相))*

> 🎯 **指纹关键词**(自检用):`发现` / `搜索技能` / `MCP 3`
> 🧩 **类型**:独立整页,发现页主入口

**用途**:用户安装、试用、管理 skill / MCP 的入口。**触发**:sidebar「更多」展开 → skill 发现。

### ⛔ MUST-HAVE 模块清单

**外壳走 layouts.md §2 + 子结构 §2.5,本清单只列必须出现的模块 + 视觉特征:**

- [ ] **遵循 §2 功能页骨架统一规则**:跟文件库 / 设置页**完全一致**的外壳,**不允许**起 `.skill-discovery-layout`
- [ ] **§2.5 子结构 C 卡片网格**:`.card-grid` 网格
- [ ] **页面操作区**:右侧搜索框 + 「管理」次按钮 + 「+ 安装」主按钮；「管理」用于进入 10-skill-manage,不是 Sidebar 一级菜单
- [ ] **二级 Tab**:`技能` 选中态 / `MCP N` 未选中态(pill 形态)+ 右侧 filter icon
- [ ] **网格 2 列等宽**(不是 3 / 4 列 —— 防止描述被截断)
- [ ] **skill 卡 3 段式**:
  - 左:skill icon(subtle border + radius,内嵌真图居中,**不要把 icon 撑到容器尺寸**)
  - 中:skill 名 medium + 描述 text-tertiary
  - 右:**操作按钮分两态** —— 未安装 `+` / 已安装 settings icon
- [ ] **已安装态视觉**:卡片 `bg-secondary` 灰底 + 右侧按钮变 settings icon

### Do / Don't

- ✅ 安装按钮用 + icon 而不是「安装」文字(卡片宽度有限)
- ✅ 卡片网格 2 列(足够展示,不挤)
- ✅ skill 卡分两态(用户一眼看出哪些已安装)
- ❌ 4 列网格(描述被截断)
- ❌ 卡片不分态

### 详细规格

- 骨架 / 尺寸 / 网格规则 → `reference/02-layout/layouts.md` §2 + §2.5
- Skill / MCP 卡片组件组合 → `reference/03-component/component-routing.md` + `reference/03-component/vedesign-use-skill/react/button.md` + `reference/03-component/vedesign-use-skill/react/tag.md` + `reference/03-component/vedesign-use-skill/react/badge.md`

---

## 10-skill-manage.png · Skill 管理列表

> 📷 **视觉真相图**: `reference/05-page-shots/10-skill-manage.png` — 做这一页时必须 `view` 此 PNG 文件,跟下面文字描述配合理解。不要凭文字想象做。
>
> *(alt: Skill 管理列表(视觉真相))*

> 🎯 **指纹关键词**(自检用):`管理` + skill 开关 toggle
> 🧩 **类型**:由「发现」页右上角「管理」按钮进入的整页,不是 Sidebar 一级菜单

**用途**:批量管理已安装的 skill 启停 / 卸载 / 编辑。从 09-skill-discovery 的右上角「管理」按钮进入；不要在侧边栏主导航里单独放「管理」。

### ⛔ MUST-HAVE 模块清单

**外壳走 layouts.md §2 + 子结构 §2.4,本清单只列必须出现的模块 + 视觉特征:**

- [ ] **遵循 §2 功能页骨架统一规则**:跟文件库 / Skill 广场**完全一致**的外壳,**不允许**起 `.skill-manage-layout`
- [ ] **§2.4 子结构 A 单层 Tab + 列表**:`.filter-bar` + `.data-region`
- [ ] **页面标题**:左侧 `< 管理`(带返回箭头)+ 右侧搜索框
- [ ] **Tab 切换**:跟文件库 Tab 同款 pill + 右侧 filter icon
- [ ] **列表行**(每行一项 3 段式):
  - 左:skill icon(同 09 规格)
  - 中:skill 名 medium + 描述 text-tertiary
  - 右:**toggle 开关**(启用 `--color-bg-primary` / 禁用 `--color-bg-muted`)
- [ ] **hover 态**:行 `bg-surface` 高亮 + 显示 `· · ·` more 按钮(默认隐藏)

### 与 09-discovery 的关键区别

- 09 是**网格**(发现新 skill,强调视觉);10 是**列表**(管理已装 skill,强调批量操作 / 信息密度)
- 09 卡片右侧是「+ 安装」/ settings;10 行右侧是 **toggle 开关** + hover more

### Do / Don't

- ✅ toggle 在最右侧(一眼看到启用状态)
- ✅ hover 才显示 more 按钮(避免视觉噪音)
- ❌ 用「编辑 / 删除」文字按钮(太显眼,掩盖了 toggle 主操作)

### 详细规格

- 骨架 / 尺寸 / Tab 切换器 / 行高 → `reference/02-layout/layouts.md` §2 + §2.4
- icon → `@ve-design/react/icons` + `reference/03-component/vedesign-use-skill/react/icon.md`
