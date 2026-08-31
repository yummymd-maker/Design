---
name: vedesign-agent-ui
description: >-
  火山引擎 / 方舟 Agent UI 生产级页面构建 skill。用于设计、实现、改造或评审符合 VeDesign 的 agent / 智能体 / chatbot / 助手 / 欢迎页 / 对话页 / 三栏产物页 / 设置页 / 文件库 / Skill 广场 / MCP 广场 / 管理页 / 详情弹窗等界面。优先指导大模型遵循项目已有技术栈；没有现有前端工程时，默认使用 Vite React / React TS 初始化工程，并使用 @ve-design/react、@ve-design/react/icons、@ve-design/react/css/default.css、semantic token、真实图标、真实资产、mock 数据和可交互状态，生成可运行、可验证、可渐进接入业务项目并适合上线演进的 Agent 交互页面。触发关键词: agent / 智能体 / chatbot / assistant / 火山方舟 / vedesign / ve-design / @ve-design/react / @ve-design/web / 欢迎页 / 对话页 / 三栏页 / artifact / 文件库 / Skill / MCP / 设置页 / 背景粒子 / volcark / arkclaw / security / volcengine。
---

# VeDesign Agent UI

使用本 skill 构建面向生产落地的 Agent UI。实现类任务的默认目标是：页面可运行、有真实 mock 数据、有可见交互反馈，并且能渐进接入已有业务项目。

## 工作模式

读取详细 reference 前，先判断当前任务属于哪种模式：

| 用户意图 | 模式 | 起始阅读 |
|---|---|---|
| “快速生成 / demo / 原型 / 搭一个 Agent 页面” | `prototype` | 先读 `reference/00-workflows.md` 的 prototype 流程，再读 `reference/06-recipes/` 下匹配的页面配方 |
| “在已有项目里接入 / 改造 / 融合业务页面” | `integration` | 先读 `reference/00-workflows.md` 的 integration 流程，再检查项目结构后改代码 |
| “评审 / 看哪里不符合规范 / 怎么优化” | `review` | 先读匹配的 page-shot README 和 `reference/00-workflows.md` 的 review 流程 |
| “只问组件怎么用” | `component` | 先读 `reference/03-component/component-routing.md`，再读精确组件文档 |

不要默认做营销落地页。Agent 产品的首屏应是用户请求的可用工作区、页面、弹窗、列表或对话界面。

## 工程默认策略

- 先检查目标目录是否已有工程：`package.json`、lockfile、framework、路由、样式入口、主题入口、组件 alias、图标体系、lint/build 脚本。已有工程优先遵循宿主项目，不擅自替换技术栈、包管理器或路由方案。
- 目标目录为空或没有可用前端技术栈时，默认创建 **Vite React + TypeScript** 工程，而不是单文件 HTML。优先使用项目指定包管理器；没有指定时可按环境选择 pnpm / npm。
- React / Next.js / Vite React 项目必须优先使用 `@ve-design/react` 与 `@ve-design/react/icons`。先检查宿主是否已安装和引入,缺失且允许改依赖时才安装;只在非 React 宿主或用户明确要求 Web Components 时使用 `@ve-design/web`。
- 在应用级样式入口只引入一次 `@ve-design/react/css/default.css`。项目主题覆盖放在默认主题之后；`reference/01-token/tokens.css` 只作为静态 fallback 或 token 查询依据，不作为 React 项目的首选主题入口。
- 单文件 HTML、手写组件库替代、纯 CSS 仿 VeDesign 只允许在用户明确要求静态原型，或用户拒绝/无法切换到可访问内网 npm 的执行环境时作为 fallback。采用 fallback 时必须说明原因，并保持组件边界方便后续替换为 `@ve-design/react`。
- 代码组织遵循 React 最佳实践：组件拆分围绕页面模块和状态边界，mock 数据独立成 fixture / 常量，副作用和 timer 可清理，受控输入只有一个事实来源，避免把大段 JSX、样式和状态机堆在同一个文件里。

### 依赖检查策略

实现前先查 `package.json`、lockfile、样式入口和宿主 design-system wrapper。若已有 `@ve-design/react` / `@ve-design/react/icons` / 默认主题 CSS,直接复用,不要重复安装或重复引入。只有依赖缺失、当前任务允许改依赖时,才沿用宿主包管理器安装;先按 `reference/04-asset/asset-packages.md` 做内网可执行环境门禁、写入项目级 `.npmrc` 或配置对应包管理器 registry,再安装依赖。registry URL 必须是纯文本 `https://bnpm.byted.org/`,不要使用 Markdown 链接格式。

### 内网可执行环境门禁

`@ve-design/react` / `@ve-design/web` 尚未对公网发布,但可在能访问字节内网 npm 的环境中安装,包括用户本地内网 / VPN 环境,以及字节内网云端环境。安装前必须先判断当前任务是否在可访问内网 npm 的执行环境中运行。

若当前环境明确是用户本地项目或字节内网云端,并且 registry 连通性检查通过,继续安装组件包。只要出现以下任一情况,视为外部或不可确认环境:工作区不是用户指定的项目、运行环境像外部云端 / 远程沙箱、无法访问项目文件、内网 registry 连通性检查超时 / DNS 失败 / 无响应。

外部或不可确认环境中不要继续执行安装,不要把包安装失败误判为组件包不存在,也不要直接降级成静态 HTML / 纯 CSS fallback。先停止实现并提示用户:

> 当前运行环境可能访问不到字节内网 npm 包。请切换到本地内网/VPN项目或字节内网云端项目后再执行;我也可以帮你在可访问内网 npm 的环境中创建一个 Vite React + TypeScript 项目,写入 `.npmrc`,安装 `@ve-design/react`,再继续实现页面。

用户选择可访问内网 npm 的执行环境后,再继续安装组件库和实现。只有用户明确要求继续静态原型,或拒绝/无法使用可访问内网 npm 的环境时,才允许使用 fallback。

## 组件使用硬门槛

使用本 skill 生成页面时，组件库使用是交付合格条件，不是建议项。React 项目必须优先使用 `@ve-design/react`；未使用组件库的纯 HTML/CSS 仿写不得视为符合本 skill，除非明确记录依赖不可用、用户拒绝安装或宿主技术栈不支持，并提供可替换为组件的模块边界。

- 写 JSX 前必须列出当前页面的组件映射表：页面模块、优先使用的 VeDesign 组件、对应文档路径；没有映射表不得开始实现。
- 欢迎页至少映射 `Sidebar` / `SidebarGroup` / `SidebarItem`、`ChatInput` / `ChatInputAction`、`Button`、`Dropdown`、`Tooltip` 或 `PromptItem` 等组件；只用 div/button 手写这些模块不合格。
- 对话页至少映射 `Sidebar`、`ChatInput`、`Bubble` / `BubbleList`、`Markdown`、`Thinking` / `ThoughtChain`、`Citation`、`Actions`、`ArtifactCard`。
- 二级页至少映射 `Sidebar`、`Input`、`Tabs`、`Button`、`Tag` / `Badge`、`Switch`、`Table`、`Upload`、`Modal` 中与场景匹配的组件。
- fallback 只允许在用户明确要求静态原型，或用户拒绝/无法使用可访问内网 npm 的执行环境继续安装组件包时使用；交付说明必须写明原因，并列出后续替换到 VeDesign 组件的映射。

## 核心规则

- React 项目优先使用 `@ve-design/react`。组件库已有 Button、Input、Switch、Modal、Tabs、Tag、Tooltip、Dropdown、Sidebar、Bubble、BubbleList、ChatInput、Markdown、Thinking、ThoughtChain、Citation、Actions、ArtifactCard、Upload、Table 等组件时，不要手写同类组件。
- 写 JSX 前先列出当前页面的 **组件映射表**：页面模块、优先使用的 VeDesign 组件、对应文档路径。例如对话页应映射到 `sidebar.md`、`chat-input.md`、`bubble.md`、`markdown.md`、`thinking.md` / `thought-chain.md`、`citation.md`、`actions.md`、`artifact-card.md`、`tabs.md`。若某模块不得不自定义，说明组件库缺口或业务原因。
- 业务 CSS 使用 semantic token。不要在业务样式中随手写 raw hex、任意边框宽度、随机阴影或自造间距体系。
- 使用不熟悉的组件属性或事件前，先读组件文档。React 从 `reference/03-component/vedesign-use-skill/react/index.md` 开始；Web Components 从 `reference/03-component/vedesign-use-skill/web-components/index.md` 开始。
- 页面级布局、密度和模块组合以 page-shot README 为准；组件 API 和局部行为以组件文档为准。
- 没有后端时必须提供真实感 mock 数据。mock 数据应覆盖 empty、loading、generating、completed、error、filtered、uploaded、selected、modal-open 等相关状态。
- 所有交互必须真实改变可见状态。点击后要过滤数据、提交消息、打开菜单、切换模式、上传文件或关闭浮层；不要用占位 toast 或空 handler 代替交互。
- 既有项目中要渐进接入：保留现有路由、状态管理、主题入口、包管理器、lint/build 流程和业务数据契约，除非用户明确要求替换。
- 图标优先来自 `@ve-design/react/icons`、`@ve-design/web` 图标注册或宿主项目图标体系。不要临时手画 SVG path，不要用 emoji、黑方块或字母块冒充生产图标。

## Reference 路由

只读取与当前任务匹配的内容。

| 需求 | 读取 |
|---|---|
| 工作流、生产可用性、已有项目接入 | `reference/00-workflows.md` |
| 包安装、主题 CSS、fallback 策略 | `reference/04-asset/asset-packages.md` |
| 按页面场景选择组件 | `reference/03-component/component-routing.md` |
| React 组件 API | `reference/03-component/vedesign-use-skill/react/index.md` + 精确组件文件 |
| Web Components API | `reference/03-component/vedesign-use-skill/web-components/index.md` + 精确组件文件 |
| token、主题、所属产线主题 | `reference/01-token/tokens.md` 和 `reference/01-token/tokens.css` |
| 全局布局、Sidebar、Composer、二级页、Modal、三栏页 | `reference/02-layout/layouts.md` |
| 页面视觉和布局 SoT | `reference/05-page-shots/README.md` 中匹配章节 + 对应 PNG |
| Agent 欢迎页配方 | `reference/06-recipes/agent-welcome-page.md` |
| Agent 对话 / thinking / 三栏产物页配方 | `reference/06-recipes/agent-chat-page.md` |
| Skill 广场、MCP 广场、文件库、设置页、管理页 | `reference/06-recipes/secondary-agent-pages.md` |
| mock 数据和必备交互状态 | `reference/06-recipes/mock-interactions.md` |
| 图片和 gallery 资产 | `reference/04-asset/images/README.md` |
| spotlight dot grid 背景 | `reference/04-asset/motion/README.md` 和 `reference/04-asset/motion/SPOTLIGHT-DOT-GRID.md` |
| 默认业务页面、仪表盘、管理台、工具页等未命中 page-shot 的业务界面 | `reference/00-workflows.md`、`reference/02-layout/layouts.md`、`reference/03-component/component-routing.md`、`reference/01-token/tokens.md`、`reference/04-asset/asset-packages.md` |

## 默认业务页面路由

当用户请求生成、改造或评审一个业务页面,但没有命中现有 page-shot 专用页面时,进入默认业务页面路由。典型请求包括:仪表盘、dashboard、管理台、控制台、数据看板、运营后台、工具页、列表页、配置页、表单页、审批页、监控页、报表页、数据分析页等。

这类请求不要当成营销落地页,也不要自由发挥成静态视觉稿。默认目标是生成一个符合 VeDesign 的产品级业务界面:信息架构清晰、UI/UX 排版专业、组件真实、状态完整、交互可用、代码结构可扩展。

路由判断顺序:

1. 先判断工作模式:`prototype` / `integration` / `review` / `component`。
2. 若是生成类请求,优先按 `prototype` 执行。
3. 再检查是否命中 `reference/05-page-shots/README.md` 中的专用页面。
4. 若未命中专用 page-shot,进入默认业务页面路由。
5. 默认业务页面必须读取:
   - `reference/00-workflows.md`
   - `reference/02-layout/layouts.md`
   - `reference/03-component/component-routing.md`
   - `reference/01-token/tokens.md`
   - `reference/04-asset/asset-packages.md`

默认业务页面产出要求:

- 先识别页面目标、核心用户任务和信息架构。
- 建立清晰的 UI/UX 排版层级:标题区、操作区、筛选区、数据区、状态反馈区、详情入口。
- 后台 / 管理 / 仪表盘类页面优先信息密度、可扫描性和操作效率,不使用营销式 hero。
- 优先使用 VeDesign 组件;已有组件不得手写替代。
- 颜色、字体、圆角、阴影、边框、间距使用 semantic token。
- 没有后端时提供真实感 mock 数据,并覆盖 loading、empty、error、selected、filtered、modal-open 等状态。
- 所有按钮、筛选、Tabs、搜索、上传、开关、Modal 等控件必须有真实可见状态变化。
- 图表、地图、业务可视化等若组件库未覆盖,可以自定义实现,但必须使用 token、保持组件边界,并在交付说明中标注组件缺口。
- 桌面优先,但合理窄屏下不能溢出、重叠或破坏主流程。

## 冲突裁决顺序

多个 reference 对同一细节给出不同说法时，按以下优先级取舍（高优先级覆盖低优先级）：

1. **page-shot README（页面级 SoT）**：页面结构、模块组合、密度和明确页面规格以 `reference/05-page-shots/README.md` 对应章节和 PNG 为准。
2. **组件文档**：组件 props、事件、slot 和局部行为以 `reference/03-component/vedesign-use-skill/` 对应组件文件为准。
3. **页面配方 recipe**：`reference/06-recipes/` 提供场景组合与必备交互清单。
4. **layout 基线**：`reference/02-layout/layouts.md` 只提供可复用骨架，用"建议 / 通常 / 可"表达软约束；与 page-shot 冲突时以 page-shot 为准。
5. **token 字典**：颜色、间距、字体、圆角、阴影取值以 `reference/01-token/tokens.css` 为唯一可信源，`tokens.md` 为说明。

裁决原则：**页面硬规格看 page-shot，组件行为看组件文档，骨架和取值分别回退到 layout 与 token**。不要用 layout 的软约束推翻 page-shot 的明确像素规格。

## 页面路由

| 页面 / 功能 | 关键词 | 必读 reference |
|---|---|---|
| Agent 欢迎页 | 首页 / 起始页 / welcome / 新对话 / 新建任务 / 数据空间首页 | `reference/06-recipes/agent-welcome-page.md`、`reference/05-page-shots/README.md` §01-welcome、`reference/02-layout/layouts.md` §1.1、`reference/03-component/component-routing.md`、`reference/04-asset/asset-packages.md` |
| Agent 对话页 | chat / 对话 / 生成中 / thinking / 思维链 / 引用 / 工具调用 | `reference/06-recipes/agent-chat-page.md`、`reference/05-page-shots/README.md` §02-chat / §04-thinking、`reference/02-layout/layouts.md` §1.2-§1.5、`reference/03-component/component-routing.md` |
| 三栏产物页 | artifact / 产物 / 代码预览 / 文档预览 / 三栏 | `reference/06-recipes/agent-chat-page.md`、`reference/05-page-shots/README.md` §03-three-pane、`reference/02-layout/layouts.md` §3、`reference/03-component/component-routing.md` |
| Skill / MCP 发现 | Skill 广场 / MCP 广场 / 插件发现 / 能力市场 | `reference/06-recipes/secondary-agent-pages.md`、`reference/05-page-shots/README.md` §09-skill-discovery、`reference/02-layout/layouts.md` §2 / §2.5、`reference/03-component/component-routing.md` |
| Skill / MCP 管理 | 已安装 / 启停 / 管理 / 定时任务 | `reference/06-recipes/secondary-agent-pages.md`、`reference/05-page-shots/README.md` §10-skill-manage、`reference/02-layout/layouts.md` §2 / §2.4、`reference/03-component/component-routing.md` |
| 文件库 / 产物列表 | 文件库 / 上传文件 / 产物页 / 文件管理 | `reference/06-recipes/secondary-agent-pages.md`、`reference/05-page-shots/README.md` §08-file-library、`reference/02-layout/layouts.md` §2 / §2.4、`reference/03-component/component-routing.md` |
| 设置页 | 设置 / 偏好 / 模型配置 / 权限配置 | `reference/06-recipes/secondary-agent-pages.md`、`reference/05-page-shots/README.md` §07-settings、`reference/02-layout/layouts.md` §2 / §2.3、`reference/03-component/component-routing.md` |
| 详情弹窗 | Skill 详情 / MCP 详情 / 详情弹窗 / install modal | `reference/05-page-shots/README.md` §06-skill-detail-modal、`reference/02-layout/layouts.md` §4、`reference/03-component/vedesign-use-skill/react/modal.md`、`reference/03-component/component-routing.md` |
| 搜索 / command modal | 搜索 / cmd-K / 快捷入口 | `reference/06-recipes/secondary-agent-pages.md`、`reference/05-page-shots/README.md` §05-search-modal、`reference/02-layout/layouts.md` §4、`reference/03-component/vedesign-use-skill/react/modal.md`、`reference/03-component/vedesign-use-skill/react/input.md` |
| 通用业务页面 / 默认产出 | 仪表盘 / dashboard / 管理台 / 控制台 / 数据看板 / 运营后台 / 工具页 / 列表页 / 配置页 / 表单页 / 审批页 / 监控页 / 报表页 / 数据分析页 | `reference/00-workflows.md`、`reference/02-layout/layouts.md`、`reference/03-component/component-routing.md`、`reference/01-token/tokens.md`、`reference/04-asset/asset-packages.md` |

## 主题与所属产线

所属产线和亮暗主题是两个独立维度：

| 维度 | 控制内容 | 落地方式 |
|---|---|---|
| 所属产线 | 品牌主色 palette | `<html data-theme="agent/security/volcengine/volcark/arkclaw">` 或宿主主题容器 |
| 亮暗主题 | semantic 色彩模式 | `<html class="dark">` 或宿主项目主题机制 |

未明确产品上下文时默认使用 `agent`。安全、合规、风控、态势感知产品使用 `security`；公有云控制台 / 火山引擎页面使用 `volcengine`；Ark / 大模型平台 / AI Studio 使用 `volcark`；Arkclaw 使用 `arkclaw`。

### 主题 HITL 前置决策

生成或改造页面前,若用户未明确主题,必须先做两步 HITL,再进入 layout / page-shot / component 路由:

1. 询问用户选择亮色或暗色。亮色落地为默认 semantic 色彩模式;暗色落地为宿主主题机制或 `<html class="dark">`。
2. 询问用户使用默认主题还是自定义主题。默认主题继续按所属产线选择 `data-theme`;自定义主题必须让用户补充一个主题色。

自定义主题色只用于生成主题覆盖,不要把主题色直接写进业务 CSS。落地时读取 `reference/01-token/tokens.md`,在默认主题 CSS 之后创建或复用自定义主题入口,把用户主题色映射为 primary palette / semantic token 覆盖。若用户只给一个主色,优先把它作为 `--color-primary-600` 的基准并派生可访问的 hover / active / dark 色阶;无法可靠派生时先保留默认主题,并说明需要补充完整色阶或由设计侧确认。

## 交付清单

实现或评审完成前，至少确认：

- 已检查目标目录技术栈；空目录或无前端工程时已创建 Vite React / React TS 工程，而不是默认交付单文件 HTML。
- `package.json` 和样式入口已接入 `@ve-design/react`、`@ve-design/react/icons` 和 `@ve-design/react/css/default.css`；若未接入，已说明阻塞原因和 fallback 边界。
- 已在实现说明或代码附近保留组件映射：使用了哪些 VeDesign 组件，以及对应的精确组件文档路径，例如 `reference/03-component/vedesign-use-skill/react/chat-input.md`、`reference/03-component/vedesign-use-skill/react/sidebar.md`。
- 所有非简单 VeDesign 组件都已读过对应组件文档。
- 页面配方和 page-shot README 与当前场景匹配。
- React 代码只在项目样式入口引入一次 VeDesign 默认主题，并保留已有主题机制。
- 生成前已完成主题 HITL：亮色 / 暗色，以及默认主题 / 自定义主题；自定义主题已记录用户主题色并通过 token 覆盖落地。
- 业务 CSS 使用 semantic token，除资产和 motion 内部常量外不写 raw hex。
- 组件库已有组件没有被本地手写组件替代；自定义组件只承担业务组合、布局包装或组件库缺口。
- mock 数据覆盖核心内容密度和边界状态。
- Search、Tabs、Filters、Upload、Modal、Sidebar、Switch、Submit、Cancel、Artifact toggle 等控件存在时，都要有真实状态变化。
- Composer / ChatInput 已开启 `shimmer-border` 流光边缘光效:必须使用 `reference/04-asset/motion/shimmer-border.css` 和 `reference/04-asset/motion/shimmer-border.js`,宿主写法为 `.ved-shimmer-host` + `data-shimmer` + 正确 `data-shimmer-radius`,不要只用组件内置 `ChatInput borderGlow` / `ve-chat-input border-glow` 代替。
- 欢迎页 gallery 已读取 `reference/04-asset/images/README.md`,并从 `reference/04-asset/images/gallery-01.jpg` 到 `gallery-11.jpg` 选用真实图片;React / Vite 项目复制到 `src/assets/images` 后 import,单文件 HTML 才转 base64 内联。不得用图标、emoji、文字或灰块冒充画廊封面。
- 工作流需要的 loading、generating、completed、error、empty 状态已经展示。
- 桌面和合理窄屏下布局不溢出，文字不重叠。
- 既有项目约定、包管理器、路由、状态管理和 build 脚本未被无关破坏。
- 组件或 token 无法使用时，明确说明限制和采用的 fallback。
