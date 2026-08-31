# 02 · Layout 布局基线

本文件提供页面级 layout 建议基线。文中出现的具体数值均作为推荐参考,用于帮助模型对齐 page-shot 的比例、留白和密度;实际生成时若与 page-shot、组件约束或业务上下文冲突,优先参考 page-shot 和组件真实表现。**5 章**:
- **§0** 全局外壳(三类页面共用)
- **§1** 对话页骨架 A(欢迎 / 对话 / 思维链)
- **§2** 功能页骨架 B(设置 / 文件库 / Skill 系)
- **§3** 三栏页骨架 C(artifact 产物)
- **§4** Modal 通用 layout(壳子 + 三档预设 + 配置 Modal)

末附 §5 三页建议尺寸速查表。

---

## 0. 全局外壳(所有页面共用)

### 0.0 Layout 引用边界

Layout 只负责页面骨架、区域关系和建议尺寸。遇到组件、图标、动效、图片或包安装时,按下表继续读取对应 reference,不要在 layout 里凭空推导或引用不存在的资产。

| 类型 | 读取 |
|------|------|
| 页面组件选择 | `reference/03-component/component-routing.md` |
| React 组件 API | `reference/03-component/vedesign-use-skill/react/index.md` + 精确组件文件 |
| Web Components API | `reference/03-component/vedesign-use-skill/web-components/index.md` + 精确组件文件 |
| 图标 | React 优先 `@ve-design/react/icons`,并读 `reference/03-component/vedesign-use-skill/react/icon.md`;Web Components 读 `reference/03-component/vedesign-use-skill/web-components/ve-icon.md` |
| 包、主题入口、fallback class | `reference/04-asset/asset-packages.md` |
| motion 动效 | `reference/04-asset/motion/README.md`;当前内置 spotlight dot grid 和 shimmer border |
| 图片 / gallery 资产 | `reference/04-asset/images/README.md` |

组件自带动效优先看组件文档,但设计助手 Agent 的输入框流光是例外:必须读取 `reference/04-asset/motion/SHIMMER-BORDER.md` 并使用 `shimmer-border.css/js`;`ChatInput borderGlow` / `ve-chat-input border-glow` 只能作为组件内置能力说明或辅助效果,不能替代 shimmer-border。思考态看 `reference/03-component/vedesign-use-skill/react/thinking.md` / `reference/03-component/vedesign-use-skill/react/thought-chain.md`;产物卡看 `reference/03-component/vedesign-use-skill/react/artifact-card.md`。不要引用本 skill 未提供的本地图标目录或 breathing-blob 自定义资产。

### 0.1 主壳骨架

| 部位 | 建议规则 |
|------|------|
| **页面根** `body` | 背景 `--color-bg-surface` |
| **`.app`** | `display:flex; height:100vh` |
| **Sidebar** `.sidebar` | bg `--color-bg-surface`(跟 body 同色)+ 建议无 border-right / 无任何描边 |
| **主区外层** `.main` | `flex:1` + padding `8px 8px 8px 0`(右、下、上各 8,左 0) |
| **主白卡** `.main-card` | `flex:1` + bg `--color-bg-base` + `0.5px` 描边 + 圆角 `--radius-xl` + `overflow:hidden` + **无投影**；若组件库或旧样式带默认阴影，必须显式覆盖 `box-shadow:none; filter:none;` |
| **Header** `.card-header` | 建议 56 高(可参考 min/max 56)+ padding `12px 16px` + 背景 `--color-bg-base`(仅对话页 / 三栏页有,欢迎页 / 功能页无 Header) |

**sidebar 跟主白卡之间建议不要加"竖向分割线"**:它们的视觉分隔建议通过 `.main` 的左侧 padding=0(贴 sidebar)+ 主白卡自身的 0.5px 描边 + 圆角形成——主白卡是个"浮在 sidebar 旁边的卡片"。通常不需要 sidebar 加 `border-right` 或额外 `<div class="divider">`。主白卡本身**不要加 box-shadow / drop-shadow / filter 阴影**,右侧大白板只保留现有描边；实现时需要在 `.main-card` 明确写 `box-shadow:none; filter:none;`,避免组件库默认 shadow 或历史 CSS 透出。常见错误:模型给 `.sidebar` 加了 `border-right: 1px solid` 导致跟主白卡之间出现一条粗黑竖线,或给 `.main-card` 加投影导致外壳过重,应修正。

### 0.2 主白卡纵向 flex 建议

`.main-card` 建议 `display:flex; flex-direction:column; height:100%`,内部三层:

1. `.card-header` 或 `.page-title-row` —— `flex:none`
2. 中间内容区 —— `flex:1; overflow:auto`(对话流 / 功能页内容 / 三栏横向 flex)
3. Composer + footnote —— `flex:none` 贴底(仅对话页 / 欢迎页有)

**塌陷症状**:Composer 顶到 Header 下、对话流消失。漏 `flex:column` 或漏中间 `flex:1` 时容易塌陷。

### 0.3 Sidebar 折叠交互(所有骨架共享)

Sidebar 必须有**展开 220px / 收起 54px** 两态,**跨页面持久**(localStorage `vedesign-sidebar-collapsed`)。展开态在任何 page 都必须是 220px,收起态在任何 page 都必须是 54px;不要让欢迎页、对话页、功能页、三栏页各自写不同的 Sidebar `width` / `flex-basis`。Sidebar 自身已经承载展开 / 收起能力,折叠触发器只放在 Sidebar 顶部主区或收起态 logo hover 区;右侧 `.main` / `.main-card` / 欢迎页主内容里不要再放展开收起按钮,避免同一功能出现两个入口。

**品牌行硬规格**:展开态顶部必须是一行 `.sidebar-brand-row`,从左到右为 **logo(24×24) + 产品名 Agent Design + 右侧收起按钮(18/20×18/20)**。logo 必须紧贴在 `Agent Design` 左侧,与文字同 baseline / 同行垂直居中;不得把 logo 单独放到产品名下方、导航上方或第二行。收起按钮必须靠品牌行右侧,点击后收起到 54px。收起态顶部只允许有一个居中的 `.sidebar-brand-hotspot`,默认显示 logo;hover / focus 这个 logo 热区时,**同一个位置、同一个 32×32 容器内**把 logo 替换成展开 icon,点击展开回 220px,鼠标移出且未点击时恢复 logo。

**收起态禁止项**:不得在 logo 下方、logo 右侧或下一行额外渲染展开按钮;不得让展开 icon 独占一行;不得出现 `logo` 与 `展开 icon` 同时可见;不得把展开按钮放到第一个 nav item 的位置。收起态品牌区高度保持单行(建议 40-56px),下面紧接主 nav icon 列。

React 实现 Sidebar 时,`logo` 必须按 `reference/03-component/vedesign-use-skill/react/sidebar.md` 的 ReactSlot 规约传入 element 常量,例如 `const logo = <svg ... />; <Sidebar logo={logo} />`。不要传 `<BrandLogo />` 这类不透传 props 的函数组件,否则 `slot="logo"` 不会落到真实 SVG 上,logo 会进入默认 slot 并单独占一行。

| 项 | 展开 | 收起 |
|----|------|------|
| `.sidebar` 宽 | 固定 **220px** | 固定 **54px** |
| 内容 | 完整 nav(icon + label + 分组 + 历史) | 纯 icon 条(居中) |
| 顶部主区 | 同行 `logo + 产品名 + 右侧折叠按钮` | 一个 `.sidebar-brand-hotspot`,默认只显示 logo |
| 折叠按钮 icon | 使用 `@ve-design/react/icons` 中的侧栏 / 收起语义图标 | hover / focus 同一热区时**原位取代 logo 显示**,不新增节点占位 |
| 切换动作 | 点击折叠按钮 → 建议收起 54 | hover logo 热区 → 原位替换成展开 icon → 点击 → 建议展开 220 |
| 动画 | `width` transition `--motion-base` + `--ease-standard` | 同上 |

**状态优先级**:

| 场景 | sidebar 状态 |
|------|------------|
| `localStorage` 无字段(从未交互) | **走各页建议默认**:欢迎页 / 功能页 = 展开 220px;对话页 / 思维链 / 三栏页 = 收起 54px |
| `localStorage = '1'` | 所有页面收起,固定宽度 54px,覆盖默认 |
| `localStorage = '0'` | 所有页面展开,固定宽度 220px,覆盖默认 |

> 用户主动收/展过一次后,**他的选择就是真相**,跨页一致;首次访问才看默认。

**实现建议**:① 所有页面共享一份 sidebar 组件,读 / 写同一 localStorage,避免不同步;② 用同一层 `.app-sidebar` wrapper 或能稳定透传到 `ve-sidebar` host 的 class 硬控宽度,例如 `.app-sidebar.is-expanded { flex: 0 0 220px; width: 220px; min-width: 220px; max-width: 220px; }`、`.app-sidebar.is-collapsed { flex: 0 0 54px; width: 54px; min-width: 54px; max-width: 54px; }`,并让内部 `ve-sidebar { width: 100%; }`;如果运行时是 `.app-shell > ve-sidebar` 直出,也要给 `.app-shell > ve-sidebar:not([collapsed])` 和 `.app-shell > ve-sidebar[collapsed]` 写同样的 220px / 54px 兜底;③ 不要在不同 page 容器上覆盖 Sidebar 宽度;④ 切换瞬间 nav-label 用 opacity / display 控制(展开→收起:先隐 label 再收宽;收起→展开:先展宽再显 label);⑤ 收起态 hover 检测范围只覆盖 sidebar 顶部单个 logo 热区,不是整个 sidebar;⑥ 折叠/展开按钮 icon 优先用 `@ve-design/react/icons`,具体图标用法读 `reference/03-component/vedesign-use-skill/react/icon.md` 和 `reference/04-asset/asset-packages.md`;⑦ 品牌行建议 `display:flex; align-items:center; gap:8px; height:40px`,产品名 `flex:1; min-width:0`,折叠按钮 `margin-left:auto`;⑧ 收起态 `.sidebar-brand-hotspot` 建议 `width:32px; height:32px; display:grid; place-items:center; margin:0 auto`,logo 和展开 icon 必须共用这个容器,通过 hover/focus 切换 `opacity/display`,不要在 DOM 布局流里额外插入第二个按钮。

### 0.4 Sidebar 内 nav 项交互态建议

不论展开还是收起,每个 nav 项(`.nav-item` / `.nav-icon`)建议有完整交互态——否则用户感觉按不动。

| 元素 | 建议 |
|------|------|
| **cursor** | `cursor: pointer`(`.nav-item` 是 `<div>` 不自动给指针光标;`.nav-icon` 是 `<button>` 也需显式声明) |
| **按钮 reset**(`.nav-icon`) | `background: transparent; border: 0; padding: 0` |
| **hover** | `background: var(--color-bg-muted)`(gray-100)——建议不要用 `--color-bg-surface`(gray-50):因为 body 默认 bg = surface,sidebar 透出 body 底色,用同色完全看不出 hover。hover 建议比 sidebar 自身底色深一档 |
| **active / 当前页** | `bg-muted` + `font-weight: var(--font-weight-medium)` |
| **transition** | `background var(--motion-fast) var(--ease-standard)` |
| **路由切换 active 自动迁移** | render() 重渲时根据 `route.name` 给当前 nav 加 `.active` |

**不建议**:cursor 默认箭头 / hover 无反馈 / 当前页无 active 高亮 / 点击无 state 切换。

### 0.5 Composer 通用规格

Composer 是对话页 / 欢迎页 / 三栏页都用的输入容器。

| 部位 | 建议规则 |
|------|------|
| 容器 `.composer` | `max-width:792` / `min-width:320` / `min-height:110` + padding `var(--space-xs)` + gap 10 + `0.5px` 描边 + 圆角 `--radius-2xl` |
| **阴影** | 建议 `filter: drop-shadow(0 4px 13px rgba(16,16,19,0.05)) drop-shadow(0 2px 2px rgba(16,16,19,0.05))` —— 跟随圆角形状,建议不用 `box-shadow`(会描出方形外框) |
| **边缘光效** | 欢迎页 / 对话页 Composer 必须开启 `shimmer-border` 流光边框。React / Web Components / 静态 fallback 都使用 `reference/04-asset/motion/SHIMMER-BORDER.md` 的 `shimmer-border.css/js`,并把 `.ved-shimmer-host`、`data-shimmer`、`data-shimmer-radius="20"` 加在真正拥有输入框圆角和可见边框的 Composer shell 上。`ChatInput borderGlow` / `ve-chat-input border-glow` 不能替代该要求。artifact 卡片生成插入时也可用 `.ved-shimmer-host` + `data-shimmer-radius="12"` 触发一次。 |

**三种宽度变体**(跟着页面走):

| 页面 | class | 建议宽度 |
|------|-------|------|
| 欢迎页 | `.welcome .composer` | 建议 `width: 800` / `min-height: 138` |
| 对话页 | `.composer--wide` | 建议 `width: min(776px, calc(100% - 64px))` |
| 三栏页 | `.chat-col .composer` | 建议 `width: 100%` / `max-width: 486` |

**内部结构**(三页一致):

```
.composer (column, gap 10, padding --space-xs)
├── .composer-input        textarea, 字号 --text-ui-strong, line-height 26
└── .composer-toolbar      h32, 两端对齐, margin-top: auto(贴底)
    ├── .toolbar-group (左)  附加按钮 32×32 + 模型 chip + 深度思考 + 联网
    └── .toolbar-group (右)  mic 32×32 + send 32×32(实心 `--color-bg-primary`)
```

### 0.6 页脚免责声明(对话页 / 欢迎页建议采用)

「试用体验内容均由人工智能模型生成,不代表平台立场」建议**贴白卡底部**、**不跟内容滚动**。

| 项 | 建议规则 |
|---|------|
| **DOM 位置** | `.main-card` flex column 的**最后一个 flex 子项** |
| **flex 行为** | 建议 `flex: none`;中间 scroll 容器 `flex: 1; overflow-y: auto` |
| **样式** | `color: var(--color-text-disable)` / font 12px / line-height 20 / letter-spacing 0.036px / `padding: var(--space-xxs) 0`(=上下 8px,左右居中)|
| **opacity** | 仅 chat / artifact 用 **0.6**;welcome 不降透明度 |

❌ 错的:把免责声明放在 scroll 容器**内部** → 会跟着内容滚走。

---

## 1. 骨架 A · 对话页(welcome / chat / thinking)

**适用页面**:欢迎页(01)/ 对话页(02)/ 思维链 streaming(04)。

**特征**:核心交互是 Composer + 对话流。Sidebar 首次默认 welcome 展开 220px / chat 收起 54px;用户手动切换后跨页面保持同一宽度契约。主区 = Header 56(welcome 无) + 对话流或起始页内容 (flex:1) + Composer 浮底 + 页脚。

### 1.1 欢迎页骨架

```
.app (flex)
├── .sidebar              首次建议展开,固定 220px
│   ├── .sidebar-content  flex:1, gap --space-s, padding --space-s --space-xs, overflow auto
│   │   ├── .sidebar-header   品牌区 + 收起按钮
│   │   ├── nav-section       主导航
│   │   ├── nav-section       项目分组(label「项目」)
│   │   └── nav-section       历史会话(label「历史会话」)
│   └── .sidebar-footer   用户行(avatar 24 + 用户名)
└── .main > .main-card    主白卡, 居中滚动
    ├── .main-inner       建议 max-width 1212, padding 140 --space-xl 0, gap 72
    │   ├── .welcome      建议 max-width 800, gap --space-l
    │   │   ├── h1.welcome-title    32px / 行高 44 / 字重 medium
    │   │   └── .composer-wrap      gap --space-m
    │   │       ├── .composer       建议 800×138
    │   │       └── .pills-wrap     建议 width 593, gap --space-xs
    │   └── section.image-tasks     建议 max-width 1000, gap --space-xxs
    │       ├── .image-tasks-header 「试试以下图像理解任务」+ 折叠箭头
    │       └── .task-grid          建议 4 列 grid, gap --space-xs, height 186
    └── .welcome-footnote
```

**建议尺寸**:

| 部位 | 建议尺寸 |
|------|------|
| 侧栏 `.sidebar` | 固定 220px(`flex: 0 0 220px`) |
| 侧栏内容 padding | `--space-s` 上下 / `--space-xs` 左右 |
| 品牌行 `.sidebar-brand-row` | h 40 / flex / align-center / logo 在 `Agent Design` 左侧 / 收起按钮靠右 |
| 收起态品牌热区 `.sidebar-brand-hotspot` | 单个 32×32 容器居中;默认 logo,hover/focus 原位替换为展开 icon;不得新增第二行 |
| 品牌 logo / 收起 icon | 24×24 / 18×18 |
| 品牌名 | `--text-ui-strong` / 字重 **590** / 色 `--color-bg-primary` |
| 导航项 `.nav-item` | min-height 38 / padding `--space-xxs` / 圆角 `--radius-lg` / 字号 `--text-body` 行高 22 |
| nav-item icon | 18×18, 色 `--color-icon-primary` |
| nav-item 选中态 | bg `--color-bg-muted` |
| nav 分组标题 `.nav-label` | padding `--space-xxs --space-xxs --space-xxxs` / `--text-caption` / `--color-text-tertiary` |
| 用户行 `.user-row` | 38 高 / padding `--space-xxs` / 圆角 `--radius-lg` |
| 用户头像 `.avatar` | 24×24 圆 / 占位渐变 `135deg #d2d1e0→#b8b7c3` |
| **主区内层** `.main-inner` | 建议 max-width **1212** / padding `140px var(--space-xl) 0` / gap **72** |
| **Hero 标题** | font-size 32px / line-height 44 / letter-spacing 0.096 / 字重 medium / `--font-cn` |
| **Composer** | 建议 **800 宽 / min-height 138**;边缘光效必须用 `motion/shimmer-border.css/js`,不要只用 `ChatInput borderGlow` |
| Pills 容器 `.pills-wrap` | width **593** / column / gap `--space-xs` |
| Pill | h **36** / padding `6px 10px` / **圆角建议 24**(非 token) / `0.5px` 描边 / gap 6 |
| pill icon | 16×16 |
| 图像任务区 | 建议 max-width 1000 / gap `--space-xxs` |
| 任务网格 `.task-grid` | 建议 4 列等宽 / gap `--space-xs` / **height 186** |
| 任务卡 `.task-card` | padding `6px 6px 8px` / bg `--color-bg-surface` / 圆角 `--radius-xl` / hover 上浮 2px |
| 任务卡封面 `.task-cover` | flex:1 / 圆角 `--radius-lg` / bg `--color-bg-muted` |
| 任务卡标题 | h 22 / `--text-body-sm` / `--color-text-secondary` |

**任务卡 4 种封面**:

| kind | 布局 |
|------|------|
| `grid4` | 2×2 grid, gap 2, 4 张图 object-fit cover |
| `single` | 单图铺满 |
| `pair` | 1×2 grid, gap 2 |
| `video` | 单图 + 居中播放按钮(36 圆 / 半透明黑底 / 白三角) |

### 1.2 对话页输入框区(chat / thinking 形态)

对话页底部**不是** Composer + 单独 footnote 两件事,**是一个组合容器**:

```
.composer-zone              ← 白卡 flex column 最后一个子项, flex:none, items-center
├── .chat-composer          ← Composer (建议 max-w 792, w 776 实际, padding 12)
└── .footnote               ← 法务文案 (建议 padding-y 8, 居中, text-disable, 12/20)
```

**位置规则**:
- `.composer-zone` 整体建议 `flex:none` 贴白卡底
- 上方 `.chat-scroll` `flex:1` + `overflow:auto`,对话流在它内部
- Composer 与法务文案**紧贴**(中间无 gap),法务文案靠自己的 `padding-y: 8` 撑出呼吸
- 整个 `.composer-zone` 外**不要加 padding-bottom**(避免重复留白把法务推离白卡底)
- `.chat-composer` 使用 `ChatInput` / `ve-chat-input` 内置唯一发送 / 停止按钮;`rightAction` / `right-action` 只放语音、快捷设置等辅助控件,不得再塞自定义发送按钮
- `.composer-zone` 不进入 `.chat-scroll`,否则消息滚动会把输入框和法务文案一起滚走

**vs 欢迎页**:welcome 是「scroll 区 + footnote」两段;chat 是「scroll(对话流) + Composer + footnote」三段,后两段绑定贴底是因为 Composer 永远在输入位置,不能跟对话流滚走。

**对话页外壳硬规则**:
- Sidebar 默认收起 54px,只显示纯 icon 条;如果用户展开,宽度固定为 220px;主内容区不要再放展开 / 收起 Sidebar 的按钮。
- `.main-card` 内不放欢迎页 spotlight-dot-grid 背景,也不放欢迎页功能 chips / gallery。
- `.card-header` 右侧操作使用线性单色 icon button;素材、资源、文件类型或附件才使用 `IconType*State*` 多色 type 图标。
- 法务免责声明只保留 `.composer-zone .footnote` 一处,不要在滚动区尾部再放一份。

### 1.3 对话区滚动 + 消息布局

| 部位 | 建议尺寸 |
|------|------|
| 滚动区 `.chat-scroll` | `flex:1` / padding-top `var(--space-m)` / 内容居中 |
| 消息流 `.chat-thread` | 建议 max-width **840** / padding `0 var(--space-xl)` / **gap 40** / 右对齐 |
| 用户气泡 `.msg-user` | 右对齐 / bg `--color-bg-surface` / padding `--space-xs --space-s` / 圆角 `--radius-xl` / 字号 `--text-ui-strong` 行高 26 |
| AI 回复 `.msg-ai` | `align-self: stretch` / 左对齐 / **无气泡无卡片** |
| Markdown 容器 `.md` | max-width **776** |

**组件边界**:
- 用户消息优先使用 `Bubble placement="end"` 或项目等价 wrapper;不要手写散落的气泡 `div`。
- AI 回复不要用 `Bubble` 包裹;`.msg-ai` 直接承载 `Markdown`、`Thinking`、`Citation`、`ArtifactCard`、`Actions`。可以用 `BubbleList` 作为纵向消息容器,但助手正文 child 必须是普通 `.msg-ai` 内容块。
- AI 回复底部操作用 `Actions`,引用来源用 `Citation`,产物入口用 `ArtifactCard`。
- 工具调用 / 权限确认用 `Authorization` / `Modal` / `Alert`,不要把危险命令直接塞进 Markdown。
- 禁止用 `Bubble variant="text"` 包住 AI 长 Markdown;它会触发组件内置 max-height / “查看更多”,和 page-shot 的无气泡回复形态冲突。

**Markdown 长文档排版**(`.md > *`):

| 元素 | 建议规格 |
|------|------|
| `p` | `--text-ui-strong` / line-height 28 / padding-bottom `--space-xxs` |
| `p.md-lead`(引言段) | line-height 26 / letter-spacing 0.048 |
| `h1` | 22 / 字重 semibold / line-height 33 / padding `16.5px 0 --space-xxs` |
| `h2` | `--text-section-title` / 字重 semibold / line-height 30 / padding `13.5px 0 --space-xxs` |
| `h3` | `--text-subsection-title` / 字重 semibold / line-height 24 / padding `--space-xs 0 --space-xxs` |
| `hr` | h **0.5px** / bg `--color-border-default` / margin `--space-s 0` |

**AI ActionBar**(`.ai-actions`,AI 回复完成后出现):

| 部位 | 建议尺寸 |
|------|------|
| 容器 | padding-top `--space-s` / gap `--space-xxs` |
| 分页箭头 `.page-arrow` | 28×20 / 内 svg 14×14 / 圆角 `--radius-md` |
| 页码 `.page-counter` | `--font-en` / `--text-body-sm` / `--color-text-tertiary` |
| 参考数 `.ref-count` | h 24 / padding `0 5px` / `--font-en` / `--text-body-sm` |

### 1.4 对话区滚动跟随逻辑建议

**默认错误实现**(建议避免):每来一个流式 token 就 `scrollTop = scrollHeight` 强行弹底 → 用户上滑查看历史时被反复弹回来,体验崩溃。

**正确实现**(三状态机):

| 用户行为 | 系统行为 |
|---------|---------|
| 流式输出中,**用户没动** | 自动 follow 弹底 ✅ |
| 流式输出中,**用户上滑超 80px** | **停止 auto-scroll**,保持用户当前位置 |
| 用户上滑后,**再滚回底部 ≤ 80px** | **恢复 auto-follow**,继续跟随流式 |
| 用户**主动发新消息** | **强制弹底**(重置 follow 标志),无视当前位置 |
| **切到新会话** | **强制弹底 + 重置 follow** |

**实现要点**:
- `state.ui.userScrolledUp`(布尔标志,默认 `false`)
- 监听 `.chat-scroll` 的 `scroll` 事件,计算 `distFromBottom = scrollHeight - scrollTop - clientHeight`
  - `> 80px` → `userScrolledUp = true`
  - `≤ 80px` → `userScrolledUp = false`(恢复 follow)
- `scrollChatToBottom(force)` 函数:`if (!force && state.ui.userScrolledUp) return`
  - 流式 token 来时调 `scrollChatToBottom()`(不传 force,尊重用户)
  - 用户 send / 切会话时调 `scrollChatToBottom(true)`(强制弹底)
- watcher 用 `{ passive: true }` 避免阻塞 scroll perf,且加 `__scrollWatcherAttached` 防重复绑

**80px 阈值建议**的来由:用户刚滑过一两条消息(每条 ~60-80px gap)就视为"我在看东西,别打扰",再小阈值容易误触,再大用户感觉滚动权丢失。

### 1.5 流式 mock 回复文案(没真 API 时演示)

如果 Mode A 第 1 问选了「mock 假数据」或 API 配置不可用,**AI 回复要做完整的 mock 流式输出**(逐字符吐字 + thinking 块 + artifact 卡片),不要只渲染一段静态文字交差。

**流式 mock 建议元素**:

| 元素 | 怎么做 |
|------|-------|
| **逐字符吐字** | `for (let i = 0; i < mockReply.length; i++) { aiMsg.content += mockReply[i]; ...; await sleep(delay); }`,中文 / 标点延迟 20ms,换行 30ms,普通字符 10ms |
| **thinking 块**(开启深度思考时)| 先吐 `aiMsg.thinking` 字段(模拟 1.5s 思考),完成后再吐 `aiMsg.content` |
| **markdown 排版** | mock 文案要带 h1 / h2 / 段落 / `**bold**` / `> blockquote` / 代码块,**触发**渲染器走完整路径,不是纯文本 |
| **代码块 / artifact** | mock 里塞一个 ``` 代码块 ``` 或 `<artifact>` 标记,**触发** artifact-card 右侧产物预览,展示完整 demo 能力 |
| **"假数据"自陈** | mock 文案首屏明确告知用户「当前是 mock 流式模式,真接入需 backend proxy」,避免用户误以为是真 LLM |
| **末尾滚动** | 每 ~20 字符调一次 `scrollChatToBottom()`,跟随 §1.4 规则(用户上滑则停)|

**反 pattern**:
- ❌ 一次性 `innerHTML = entireReply`(没有流式感)
- ❌ mock 文案是单段无格式纯文本(没演示 markdown / artifact pattern)
- ❌ mock 文案跟用户输入完全无关(应至少回引用户原 prompt:`好的,我来帮你处理「${userText}」...`)
- ❌ 流式输出中每帧都 `scrollTop = scrollHeight` 不管用户位置(违反 §1.4)
- ❌ 思考态显示静态 icon 替代组件状态(应使用 `Thinking` / `ThoughtChain`,见 `reference/03-component/vedesign-use-skill/react/thinking.md` 和 `reference/03-component/vedesign-use-skill/react/thought-chain.md`)
- ❌ 生成中只禁用输入框但不设置 `ChatInput loading`;正确做法是 `loading=true` 让内置发送按钮切换为停止按钮,并实现取消逻辑
- ❌ 生成完成后同时显示内置发送和自定义发送;对话页只能有一个发送入口

---

## 2. 骨架 B · 功能页(settings / files / skill 系)

**适用页面**:设置(07)/ 文件库(08)/ Skill 广场(09)/ Skill 管理(10)/ 其他「应用功能页」。

**统一建议**:所有功能页用同一套 layout 原语,不建议给每个页面单独发明 class(❌ `.settings-layout` `.files-layout` 各自为政 = bug)。设置页 / 文件库 / Skill 系都是这套骨架的实例,只在**内容区**里填不同子结构。

**特征**:无 Composer,无对话流。Sidebar 首次建议默认 220px 展开(用户可收 54px),展开 / 收起宽度必须与其他 page 完全一致。主区 = **标题行**(不是 Header 56,是页面级 24px 标题 + 右侧操作)+ 内容区 `flex:1, overflow:auto`。

**vs §1 视觉差异**:**外壳完全一致**(同样 `.main-card` 白底 + 0.5px 描边 + radius-xl)。**唯一区别 = Header 行下分割线**:§1 对话页 Header 下有 0.5px 分割线;§2 功能页无,标题区和内容区共享同一片白底,靠 padding 区分层级(ToB 后台的"软分段")。

### 2.1 统一骨架

```
.app (flex)
├── .sidebar                  默认展开固定 220px / 收起固定 54px(用户切)
└── .main > .main-card.feature-card
    ├── .page-title-row       页面标题行(替代对话页的 .card-header 56)
    │   ├── .page-title       大标题 24px Bold
    │   └── .page-actions     右侧操作区(可选:搜索框 + 主按钮)
    └── .feature-body         flex:1, overflow:auto, padding 建议 0 146 32(左右各留 146 大屏阅读舒适区)
        │
        │  ↓ 三种子结构选一 ↓
        │
        ├── [子结构 A · 单层 Tab + 列表/网格]   ← 文件库 08 / Skill 管理 10
        │     ├── .filter-bar        Tab + 视图切换 + filter
        │     └── .data-region       表格 / 网格 / 卡片列表
        │
        ├── [子结构 B · sub-nav 二级]            ← 设置页 07
        │     ├── .feature-sub-nav   左侧 sub-nav(建议宽 200, 每项 38 高)
        │     └── .feature-detail    右侧内容区(flex:1, overflow:auto)
        │         └── 多个 .feature-group(group-title + setting-row 列表)
        │
        └── [子结构 C · 卡片网格]                 ← Skill 广场 09
              └── .card-grid         网格(可带顶部 Tab 或筛选)
```

**命名铁律**:`.feature-*` 是统一前缀,具体内容才用业务前缀(`.setting-row` / `.file-row` / `.skill-card`)。设置页就用 `.feature-sub-nav` + `.feature-detail`,**不要**起 `.settings-layout` / `.settings-content`;文件库就用 `.filter-bar` + `.data-region`,不要起 `.file-list-page`。

### 2.2 建议尺寸

| 部位 | 建议尺寸 |
|------|------|
| 侧栏 | 默认展开固定 220px,可收起固定 54px(走 §0.3 折叠交互) |
| 主白卡 `.main-card.feature-card` | 同 §1 外壳:白底 + 0.5px 描边 + `--radius-xl`;不加投影 |
| **页面标题行** `.page-title-row` | padding 建议 **`var(--space-xl) 146px 0`**(32 / 146 / 0)/ flex / align-items center / justify-content space-between。**左右 146px = 大屏阅读舒适区建议值**,详见 §2.6 |
| **大标题** `.page-title` | font-size **24** / `var(--font-weight-bold)` **(700,不是 semibold 600)** / `--color-text-primary`(⚠️ token 名带 `font-` 前缀,写 `--weight-bold` 会静默 fallback 到 normal 400 → 看着完全没加粗)|
| 页面操作区 `.page-actions` | flex / gap `--space-xs` / 常含搜索框 240 宽 + 主按钮(黑底) |
| **内容区** `.feature-body` | `flex:1` / `overflow:auto` / padding 建议 **`0 146px var(--space-xl)`**(0 / 146 / 32)。**左右 146px 跟 .page-title-row 对齐**,详见 §2.6 |
| **⚠️ Header 下分割线** | **不要加**(跟 §1 区别的唯一外壳差异) |
| **Tab 切换器**(若有) | pill 建议 36 高 / `--radius-lg` / 选中态 `--color-bg-surface` |

### 2.3 子结构 B · sub-nav 二级(设置页 07 建议)

```
.feature-body
├── .feature-sub-nav      建议 flex:0 0 200px, gap 2, column
│   └── .sub-nav-item × 8 建议 38 高 / padding `0 12px` / --radius-md
│                          选中态 --color-bg-surface + --font-weight-medium
│                          (不要加左侧 vertical bar)
└── .feature-detail       flex:1, overflow-y:auto, column, 建议 gap 40
    └── .feature-group × N
        ├── .feature-group-title   建议 20 / --font-weight-semibold / margin-bottom 16
        └── .setting-row × N
            ├── .setting-label  左:`.setting-name`(14 medium 主文) + `.setting-desc`(14 regular tertiary 次文)
            └── 右控件 (toggle 32×18 / select / button / theme-selector)
                                 min-height 建议 56, padding `16px 0`, 行间 0.5px divider
```

**sub-nav 项**:项数 / 具体内容**按业务需求定**(产品形态、用户场景、设置范围决定)。可以是 4 项也可以是 10+ 项,**没有固定项数**。page-shots `07-settings.png` 提供了一个示例(常规 / 通知 / 个性化 / 应用 / 安排 / 账单 / 家长控制 / 帐户 等),但仅作参考 —— 实际项目可按需调整。

**theme 切换器**(若产品提供主题切换):圆形 icon 按钮一组,常见 `跟系统` / `亮色` / `暗色`(三档)或 `亮色` / `暗色`(两档)。圆形颜色建议用 token(`--color-bg-base` / `--color-bg-strong` 等),不要内联 hex `#fff` `#111118`。具体档数由业务决定。

### 2.3.1 产线主题与动效路由建议

切产线时,layout 只建议刷新主题入口和页面状态,不要在 layout 中维护自定义 motion registry。当前 skill 的 motion 目录保留背景粒子 pattern 和输入框流光边框 pattern;thinking、loading、artifact 等动效仍归组件或业务项目代码管理。

| 场景 | 读取 / 使用 |
|------|-------------|
| 产线主题与 token | `reference/01-token/tokens.md` + `reference/01-token/tokens.css` |
| 输入框边缘光效 | 必须读取 `reference/04-asset/motion/SHIMMER-BORDER.md` 并使用 `shimmer-border.css/js`;`borderGlow` / `border-glow` 不能替代 |
| 思考态 / 过程态 | `reference/03-component/vedesign-use-skill/react/thinking.md`、`reference/03-component/vedesign-use-skill/react/thought-chain.md` |
| 产物卡 | `reference/03-component/vedesign-use-skill/react/artifact-card.md` |
| 背景粒子 | `reference/04-asset/motion/README.md` + `reference/04-asset/motion/SPOTLIGHT-DOT-GRID.md` |

**实现建议**:
- `setBrandTheme(name)` 只负责更新主题状态、`data-theme` / 宿主主题容器、持久化和必要的页面重渲染。
- 组件自带的动效参数优先通过组件 props 或组件文档配置,但输入框流光必须使用 `data-shimmer` / `.ved-shimmer-host` 和 `autoInitShimmerBorders()`;`data-shimmer-radius` 必须等于宿主 `border-radius` 像素值。不要只用 `borderGlow` / `border-glow`,也不要定义 `data-breathing-blob`、`SHIMMER_GRADIENTS_REGISTRY` 这类本 skill 不存在的协议。
- 若业务项目确实有自定义 motion 系统,在项目侧文档补充协议;不要把项目私有 motion 写回本 layout 基线。

### 2.4 子结构 A · 单层 Tab + 列表/网格(文件库 08 / Skill 管理 10)

```
.feature-body
├── .filter-bar         Tab + 视图切换 + filter, padding-top var(--space-m)
│   ├── .tab-group      pill tabs (`全部` `图片 13` `文件 17`)
│   └── .filter-tools   右:filter icon / 视图切换 icon
└── .data-region        flex:1
    └── 表格 / 网格 / 卡片列表 (建议行高 ≥48, 行间 0.5px divider)
```

**Tab 切换器**:pill 建议 36 高 / `--radius-lg` / 选中态 `--color-bg-surface` + `--font-weight-medium`。

### 2.5 子结构 C · 卡片网格(Skill 广场 09)

`.feature-body > .card-grid`,网格化卡片列表,可带顶部 Tab 或筛选。具体卡片规格参见 `reference/05-page-shots/09-skill-discovery.png` MUST-HAVE。

### 2.6 内容区左右留白建议(功能页专属)

**建议**:功能页的 `.page-title-row` 和 `.feature-body` 左右 padding 可参考 **统一 146px**(不是 var(--space-xl) 32 那种"贴边"留白)。

**为什么建议 146 这个数值**:功能页内容大屏(≥1440)下展开后行宽过宽,长内容(setting-row 标签 + 描述 / 文件名 + 元数据 / Skill 卡片网格)单行字数会超出舒适阅读区(约 70-90 字)。146 是设计师定的参考折中:既给内容留呼吸空间,又不会让信息密度过低。

**适用范围**:`.page-title-row` + `.feature-body` 这两个容器。**对话页 §1 和三栏页 §3 不适用** —— 对话页要居中窄列,三栏页是横向分段,各有自己的留白逻辑。

**视觉对齐**:`.page-title-row` 和 `.feature-body` 左右 padding 建议保持一致(如 146 / 146),这样大标题和下面的内容才严格垂直对齐 —— 不建议 title 行用 146 但 body 用 32(标题悬空 = bug)。

**建议 CSS**:
```css
.page-title-row {
  padding: var(--space-xl) 146px 0;  /* 上 32 / 左右 146 / 下 0 */
}
.feature-body {
  padding: 0 146px var(--space-xl);  /* 上 0 / 左右 146 / 下 32 */
}
```

**响应式提示**(可选,业务可按需加):窄屏(< 1280px)时若 146 挤掉内容,可降级到 var(--space-xl);默认 demo / 大屏交付可**参考 146**。

**反 pattern**:
- ❌ `padding: var(--space-xl)` 四边统一 32 —— 这是对话页 §1 的留白,通常不是功能页
- ❌ 给每个 view 单独定义 padding(`.view-settings { padding-left: 146; }`) —— 建议走通用 `.page-title-row` + `.feature-body`
- ❌ 用 `max-width + margin: auto` 居中实现 —— 建议优先用 padding,跟 sidebar 默认贴边的视觉对齐

---

## 3. 骨架 C · 三栏页(artifact 产物)

**适用页面**:三栏产物页(03)/ 其他「左 sidebar + 中对话 + 右产物」横向三段布局。

**特征**:sidebar 建议收起固定 54px + 中对话区(建议 550,含 Composer,本质是 §1 对话流的窄列形态)+ 右产物区(剩余宽度,可关闭回退到 §1 chat 形态)。如果用户展开 Sidebar,宽度固定 220px,不得因三栏布局另设宽度。是 §1 的**扩展版**。

### 3.1 整体骨架

```
.app (flex)
├── .sidebar-collapsed              收起侧栏固定 54px
└── .main > .main-card.artifact-card   ← flex-direction: ROW
    ├── section.chat-col            左对话栏, 建议 550 宽
    │   ├── header.card-header      标题(不可点, hover 无背景) + 更多按钮
    │   ├── .chat-col-scroll        flex:1, padding --space-m --space-xl 0, 建议 gap 40
    │   │   ├── .msg-user-sm        用户气泡(右对齐, max-width 80%)
    │   │   └── .ai-block           AI 块(gap --space-s)
    │   │       ├── .thinking-tag       「已思考 N 秒」
    │   │       ├── .ai-text            回复正文
    │   │       └── .artifact-attach    产物附件卡(光效能力看 ArtifactCard 文档)
    │   └── .composer-zone          padding 0 --space-xl 8
    └── section.artifact-panel      右产物栏, flex:1 (占满剩余)
        ├── header.card-header      产物区标题 + 居中 seg 切换 + action 按钮组
        └── .code-pane
            ├── .code-filebar       h40, 文件名 + 复制按钮
            └── .code-scroll
                └── .code-grid      2 列: 行号 auto + 代码 1fr
```

### 3.2 建议尺寸

| 部位 | 建议尺寸 |
|------|------|
| **主白卡** `.artifact-card` | `flex-direction: row`(横向分栏) |
| **左对话栏** `.chat-col` | 建议 **550 宽**(`flex: 0 0 550px`)/ 右边框 `0.5px` |
| **右产物栏** `.artifact-panel` | `flex:1`(占满剩余)/ bg `--color-bg-base` |
| 左栏标题 | hover 无背景、cursor default(区别于对话页可点) |
| 左栏滚动区 `.chat-col-scroll` | padding `--space-m --space-xl 0` / 建议 gap 40 |
| 小用户气泡 `.msg-user-sm` | 右对齐 / max-width 80% / bg `--color-bg-surface` / padding `--space-xs --space-s` / 圆角 `--radius-xl` |
| AI 块 `.ai-block` | column / gap `--space-s` |
| 思考标签 `.thinking-tag` | h 22 / padding `0 --space-xxs` / `--color-text-tertiary` / `--text-body` |
| AI 正文 `.ai-text` | `--text-ui-strong` / line-height 26 |
| **产物附件卡** `.artifact-attach` | padding `--space-xs` / bg `--color-bg-surface` / 0.5px 描边 / 圆角 `--radius-lg` / gap `--space-xs` / 光效和交互能力读 `reference/03-component/vedesign-use-skill/react/artifact-card.md` |
| 附件缩略图 `.attach-thumb` | **48×48** / bg `--color-bg-base` / 圆角 `--radius-md` / 内 svg 24×24 |
| 附件名 `.attach-name` | `--text-body` / 字重 medium / 省略号截断 |
| 附件副标题 `.attach-sub` | `--text-caption` / `--color-text-tertiary` |
| 左栏 Composer | `width: 100%` / max-width 486 |
| 左栏 composer-zone | padding `0 --space-xl 8` |
| **产物区 Header** | 固定 **56 高**(`height:56px; min-height:56px; padding:0 16px`) / 下边框 0.5px / `position: relative` / 与左侧 `.card-header` 等高 |
| 产物区标题 `.panel-title` | `--font-cn` / `--text-body` / 字重 medium / 内 svg 18×18 |
| **Seg / Tabs 切换** `.seg` | 居中绝对定位 / 使用 `Tabs type="capsule" size="small"` 或等价 segmented control / h32 / padding 2 / bg `--color-bg-surface` / 圆角 `--radius-md` |
| Seg item | h28 / padding `0 --space-xs` / 圆角 `--radius-sm` / 选中态:bg `--color-bg-base` + 阴影 `0 1px 2px rgba(16,16,19,0.05)` |
| 代码文件栏 `.code-filebar` | h **40** / padding `0 --space-s` / 下边框 0.5px / gap `--space-xxs` |
| 文件图标 `.file-icon` | 18×18 |
| 文件名 `.file-name` | `--font-mono` / `--text-body-sm` / `--color-text-secondary` |
| 复制按钮 `.copy-btn` | 28×28 / 内 svg 14×14 / 圆角 `--radius-sm` |
| **代码网格** `.code-grid` | 2 列:行号 auto + 代码 1fr / `--font-mono` / **font-size 13 / line-height 22** |
| 行号列 `.code-lines` | padding `--space-xs --space-s` / 右对齐 / `--color-text-disable` / `user-select:none` |

**产物区 Header 对齐硬规则**:
- 左侧标题、居中 Seg / Tabs、右侧 actions 必须在同一条 56px header 的水平中线对齐。
- Header 不允许被 Tabs、按钮组或标题内容撑高;不要使用 `min-height:56px` 再叠加 `padding:12px 16px` 的写法。
- Seg / Tabs 用 `position:absolute; left:50%; top:50%; transform:translate(-50%,-50%)` 居中;左右两侧内容仍用 flex 垂直居中。
- 使用 VeDesign `Tabs` 时必须设 `size="small"`;默认尺寸外盒偏高,会破坏 56px 工具栏。
- 如果 `ve-tabs` host 仍被组件内部样式固定为 64px,仅在 `.artifact-header > ve-tabs` 范围内用 `height/min-height/max-height:32px !important` 局部覆盖,不要全局覆盖 Tabs。
| 代码列 `.code-body` | padding `--space-xs 0 --space-xs --space-xxs` |

> **代码高亮 token**:代码块语法高亮若需要颜色示例,优先读 `reference/03-component/vedesign-use-skill/react/artifact-card.md` 和 `reference/03-component/vedesign-use-skill/react/resource-preview.md`;避免在 layout 文档里直接沉淀 hex。

---

## 4. Modal 通用 layout

Modal 是 layout 概念(壳子),不是单页附属。本节提供 Modal 共用容器建议 + 三档预设。

### 4.1 通用骨架(所有 Modal 建议遵守)

| 部位 | 建议规则 |
|------|------|
| **定位** | `position: fixed`, 居中(flex center 或 transform translate) |
| **z-index** | 高于 sidebar / main-card,统一一层 |
| **视口约束** | 建议 `max-width: calc(100vw - 80px); max-height: calc(100vh - 80px)`(保留约 40px 上下左右安全边距,避免糊到屏幕边缘) |
| **容器底** | `background: var(--color-bg-overlay)`(= 白) |
| **容器圆角** | 建议 `border-radius: var(--radius-2xl)`(= 20px) |
| **容器阴影** | `box-shadow: var(--shadow-md)` |
| **容器描边** | 命令面板型 `0.5px solid var(--color-border-default)`;详情型可省 |
| **overflow** | `hidden`(内部内容自己 scroll) |

> ⚠️ `tokens.css` 里 `--radius-xl` (16) 注释写「Modal/Drawer 用」,但 Figma 实测 Modal 是 20px (= `--radius-2xl`)。建议按视觉真相参考 `--radius-2xl`。

### 4.2 遮罩(独立层,铺满视口)

| 部位 | 建议规则 |
|------|------|
| **定位** | `position: fixed; inset: 0` |
| **z-index** | 低于 Modal 容器,高于一切其他层 |
| **遮罩色** | 命令面板型 `rgba(0, 0, 0, 0.15)`(轻,透出底页氛围);详情型 `rgba(0, 0, 0, 0.5)`(深,聚焦详情) |
| **交互** | 点击遮罩关闭 Modal(除非内部有未保存改动) |

### 4.3 三档宽度预设

| 档位 | 宽度 | 用于 | 示例 |
|------|------|------|------|
| **sm · 命令面板** | 640px | 搜索 / cmd-K / 快速选择 | 搜索 Modal |
| **md · 表单** | 480px | 确认 / 编辑 / 简单表单 | API 配置(§4.6)|
| **lg · 详情** | 1080px | 详情页 / 复杂内容 | Skill 详情 Modal |

> 所有档位都建议受 §4.1 `max-width: calc(100vw - 80px)` 约束 —— 小窗口下自动收缩。内边距 / 模块 padding 由具体 Modal 的 page-shots 章节定义,layout 不限定。

### 4.4 三段式结构(顶部和底部可选,中间建议保留)

```
┌─────────────────────────┐
│ 顶部区 (header)         │  可选 · 常含: 标题 / 搜索框 / 关闭按钮 / icon + 名称
├─────────────────────────┤  (可选分隔线)
│ 中间内容区 (body)       │  建议保留 · 真正的内容; scroll 在此发生
├─────────────────────────┤  (可选分隔线)
│ 底部区 (footer)         │  可选 · 常含: 主按钮 / 次按钮 / 提示文字
└─────────────────────────┘
```

**各 Modal 三段配置示例**:

| Modal | 顶部 | 中间 | 底部 |
|-------|------|------|------|
| 搜索(sm) | 搜索输入框 | 命令/会话列表 | 无 |
| 配置(md) | 标题 + 关闭 | 表单字段 | 主/次按钮 |
| 详情(lg) | icon + 标题 + Switch + more + 关闭 | tab + 正文 + 代码块 + 列表 | 卸载 + 主按钮 |

### 4.5 内部模块路由

具体 Modal 填什么由 `reference/05-page-shots/README.md` 对应章节定义:
- 搜索 Modal → `reference/05-page-shots/README.md` §05-search-modal
- Skill 详情 Modal → `reference/05-page-shots/README.md` §06-skill-detail-modal

**新增 Modal 流程**:① 选 §4.3 档位 → ② 决定 header / footer 配置 → ③ 在 page-shots 加 MUST-HAVE 模块清单。

### 4.6 配置 Modal(API Key + Model ID,Mode A 建议具备)

火山方舟 agent 建议具备。视觉可参考 §4.3 **md 表单档**(宽 480 / `--radius-2xl` / padding `--space-l` / shadow `--shadow-md`)。

| 字段 | 类型 | 建议必填 |
|------|------|------|
| API Key | `password` input + 眼睛 toggle | ✅ |
| Model ID | `text` input | ✅ |

**触发建议**:① 顶部 banner(未配置时常驻)/ ② sidebar 齿轮 / ③ 发送拦截(用户点发送但未配置时弹)。

---

## 5. 三页建议尺寸速查

| 部位 | 欢迎页 | 对话页 | 三栏页 |
|------|--------|--------|--------|
| Sidebar 宽 | 固定 **220**(展开) | 固定 **54**(收起) | 固定 **54**(收起) |
| Header 高 | 无 | 建议 **56** | 建议 **56** |
| 主内容 max-width | 建议 1212(inner) | 建议 840(thread) | 左栏建议 550 |
| Composer 宽 | 建议 800 | 建议 min(776, 100%-64) | 建议 max 486 |
| Composer min-height | 建议 138 | 建议 110 | 建议 110 |
| 消息流 gap | — | 建议 40 | 建议 40 |
| 页面外层 padding | 建议 8(右下上) | 建议 8 | 建议 8 |
| 白卡圆角 | `--radius-xl` | `--radius-xl` | `--radius-xl` |
