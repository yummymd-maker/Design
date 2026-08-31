# 配方 · Agent 欢迎页

用于 Agent 首页、起始页、新对话、新任务入口或数据空间首页。

## 必读内容

1. `reference/05-page-shots/README.md` §01-welcome + `reference/05-page-shots/01-welcome.png`
2. `reference/02-layout/layouts.md` §1.1
3. `reference/03-component/component-routing.md`
4. 组件文档：`sidebar.md`、`chat-input.md`、`button.md`、`dropdown.md`、`prompt-item.md`、`tooltip.md`
5. gallery 封面：`reference/04-asset/images/README.md`
6. 背景粒子：`reference/04-asset/motion/SPOTLIGHT-DOT-GRID.md`

## 必备结构

```text
AgentWelcomePage
├── Sidebar 展开态
└── 主内容卡片
    ├── 可选顶部 task/model header
    ├── 弱化的 spotlight-dot-grid 背景
    └── 居中的欢迎内容
        ├── greeting
        ├── ChatInput composer
        ├── capability chips / PromptItem 行
        └── recommendation gallery / task cards
```

## 组件方案

- 展开态导航外壳使用 `Sidebar`,宽度必须固定为 220px;收起态固定为 54px。所有 page 共享同一套 Sidebar 宽度 class / CSS 变量,不要让欢迎页单独写一套宽度。
- Sidebar 顶部品牌行必须按 `logo + Agent Design + 右侧收起按钮` 同行布局。React 中 `Sidebar logo` 必须传 element 常量,例如 `const logo = <svg ... />; <Sidebar logo={logo} />`,不要传不透传 props 的 `<BrandLogo />`;否则 `slot="logo"` 不会落到真实 SVG 上,logo 会单独占一行。logo 在 `Agent Design` 左侧,不得单独掉到标题下方;点击右侧收起按钮后进入 54px 收起态。收起态顶部只有一个居中的 logo 热区,hover / focus 这个热区时必须在同一个位置把 logo 原位替换为展开 icon,点击后恢复 220px 展开态。展开 icon 不得出现在 logo 下方、下一行、右侧或第一个 nav item 位置。
- 中央输入区使用 `ChatInput`。`ChatInput` 已内置提交 / 停止按钮,不要在 `rightAction` 里额外自定义发送按钮,否则会出现两个发送入口;`leftAction` 组织添加、模型、模式等控件,`rightAction` 只放语音、快捷设置等位于内置发送按钮左侧的辅助控件。
- 中央输入区必须使用 `shimmer-border` 流光边框。把 `reference/04-asset/motion/shimmer-border.css` 和 `reference/04-asset/motion/shimmer-border.js` 复制到项目 `motion/`,在页面中引入,并给真正拥有输入框圆角和可见边框的 Composer shell 加 `.ved-shimmer-host`、`data-shimmer`、`data-shimmer-radius="20"`、`data-shimmer-stroke="1.5"`、`data-shimmer-duration="2.7"`、`data-shimmer-loops="1"`。不要只用 `ChatInput borderGlow` / `ve-chat-input border-glow` 代替。
- 添加、模型、模式或 skill 菜单使用 `Dropdown`。
- 能力入口可以使用 `PromptItem`、`Button` 或 token-based pill button。
- gallery 卡片必须使用真实图片。先读 `reference/04-asset/images/README.md`,从 `reference/04-asset/images/gallery-01.jpg` 到 `gallery-11.jpg` 选图;React / Vite 项目复制到 `src/assets/images` 后 import,单文件 HTML 才转 base64 内联。不要用图标、emoji、文字或纯色块冒充封面。
- `Message` 只用于真实状态变化后的反馈，不作为占位点击反馈。

## Mock 数据最低要求

创建本地数组：

- 主导航项；
- 最近会话或任务；
- 能力 chips；
- 推荐 prompt 或 gallery 卡片；
- 模型 / 模式选项；
- 可选项目 / 空间选择器。

不要照抄截图里的业务名称。使用与用户领域匹配的中性但真实感内容。

## 必备交互

- 输入文字后发送按钮变为可用。
- 提交后追加消息或进入 chat/task 状态，并携带提交的 prompt。
- 点击能力 chip 后填入 composer 或启动对应 prompt。
- 添加按钮打开上传 / 附件 / 工具菜单。
- 模型 / 模式菜单会更新已选值。
- 点击 gallery 卡片后填入 composer 或打开对应任务模板。
- Sidebar nav 会更新 active 状态。
- Sidebar 折叠状态应持久化;用户在任意 page 展开时都保持 220px,收起时都保持 54px。必须验证品牌行交互:展开态 logo 与 `Agent Design` 同行;点击右侧收起按钮后顶部只显示 logo;hover logo 热区时 logo 原位替换成展开 icon,不新增一行或第二个按钮;点击展开 icon 后恢复品牌行。
- Composer 流光边框在进入欢迎页时立即单圈播放,且必须贴着输入框可见边框;静态 / fallback 页面必须引入 `motion/shimmer-border.css` 和 `motion/shimmer-border.js`,并能在 DOM 中看到 `data-shimmer` host 与 12 层 SVG rect。

## 生产注意事项

- 不要加入营销 hero、营销副标题、价格 CTA 或外部背书。
- Composer 应保持视觉中心和较高优先级。
- 背景粒子只放在欢迎页主面板，不放进卡片、chip 或 composer 内部。
- 自定义 CSS 只承担页面布局、gallery 组合和背景定位。
