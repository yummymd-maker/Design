# 配方 · Agent 对话页与产物页

用于标准 chat、生成中、完成回复、长 Markdown 回复、工具调用、thinking、引用和三栏产物工作区。

## 必读内容

1. `reference/05-page-shots/README.md` §02-chat / §03-three-pane / §04-thinking + 对应 PNG
2. `reference/02-layout/layouts.md` §1.2-§1.5、§3
3. `reference/03-component/component-routing.md`
4. 组件文档：`sidebar.md`、`chat-input.md`、`bubble.md`、`markdown.md`、`thinking.md`、`thought-chain.md`、`citation.md`、`actions.md`、`artifact-card.md`
5. 权限流程：`authorization.md`、`modal.md`、`alert.md`

## 必备结构

```text
AgentChatPage
├── Sidebar 收起态
└── 主内容卡片
    ├── ChatHeader
    ├── ChatScroll
    │   └── BubbleList
    │       ├── user Bubble
    │       ├── Thinking or ThoughtChain
    │       ├── assistant .msg-ai with Markdown
    │       ├── Citation
    │       ├── ArtifactCard
    │       └── Actions
    └── ChatInput composer
```

三栏状态：

```text
主内容卡片
├── Chat column
│   ├── 紧凑 chat 上下文
│   ├── ArtifactCard
│   └── ChatInput
└── Artifact panel
    ├── 带标题和 view tabs 的 header
    └── code / preview / document content
```

## 组件方案

- 用户消息使用 `Bubble` 右对齐;助手正文不要套 `Bubble`。
- 助手正文使用 `.msg-ai` 普通内容块承载 `Markdown`。
- 单段公开推理摘要使用 `Thinking`。
- 包含搜索、工具调用、结果或多阶段执行时使用 `ThoughtChain`。
- 来源使用 `Citation`。
- 回复操作使用 `Actions`。
- 生成文件或输出使用 `ArtifactCard`。
- 生成中 `ChatInput` 设置 `loading`，并实现 `onCancel`。
- 产物区代码 / 预览切换使用 `Tabs` 或项目 / 组件库已有 segmented control。

## 对话页硬约束

- 对话页默认 Sidebar 为收起态 54px 纯 icon 条;如果用户展开,宽度固定为 220px。展开 / 收起能力只在 Sidebar 自身提供,不要在主内容 Header、ChatScroll 或 Composer 区额外放侧栏展开按钮,也不要为 chat / artifact 单独覆盖 Sidebar 宽度。
- 对话页不使用欢迎页的 spotlight-dot-grid 背景、功能 chips、推荐 gallery 或大号欢迎标题。用户已进入任务流,首要目标是阅读和继续输入。
- 底部输入必须使用 `ChatInput` / `ve-chat-input` 内置发送 / 停止按钮。`rightAction` / `slot="right-action"` 只放语音、快捷设置等辅助控件,不得再放自定义发送按钮。
- 底部输入必须使用 `shimmer-border` 流光边框。把 `reference/04-asset/motion/shimmer-border.css` 和 `reference/04-asset/motion/shimmer-border.js` 复制到项目 `motion/`,在页面中引入,并给真正拥有输入框圆角和可见边框的 Composer shell 加 `.ved-shimmer-host`、`data-shimmer`、`data-shimmer-radius="20"`、`data-shimmer-stroke="1.5"`、`data-shimmer-duration="2.7"`、`data-shimmer-loops="1"`。不要只用 `ChatInput borderGlow` / `ve-chat-input border-glow` 代替。
- 用户消息和助手消息必须走对话组件边界:用户侧用 `Bubble` 右对齐;助手侧正文不要嵌套 `Bubble`,用 `.msg-ai` 直接承载 `Markdown`、`Citation`、`ArtifactCard`、`Actions`。
- 助手正文禁止触发 `Bubble` 的 max-height / “查看更多” 截断;只有产品明确需要长思考或长文档折叠时,才在对应 `Thinking` / `Markdown` 区块内做显式展开。
- 生成中状态必须由一套状态机驱动:`idle` → `thinking` / `streaming` → `completed` / `cancelled` / `error`;不要用静态文案假装生成。
- 思考过程只展示可公开摘要,使用 `Thinking` 或 `ThoughtChain`;不要展示隐藏 chain-of-thought,也不要用静态 icon + 灰字替代组件。
- 出现产物时先在对话流里展示 `ArtifactCard`;点击或生成完成后再进入三栏产物面板。不要直接把右侧产物栏作为默认对话页空壳。
- Header 和操作按钮使用常规线性单色图标;文件类型、附件、资源和生成产物才使用 `IconType*State*` 多色 type 图标。
- 三栏产物区 header 必须与左侧 / 外部 `card-header` 同高 56px;标题、Tabs / Seg、右侧 actions 在同一条水平中线对齐,不得被 Tabs 或按钮撑高。

## Mock 数据最低要求

创建本地数组或 fixture：

- messages：包含 role、content、timestamp、status；
- thought steps：包含 type、title、status、content；
- citations：包含 key、title、url、source；
- action items；
- artifacts：包含 type、name、size、status、preview kind；
- code 或 preview 内容；
- 可选 attachments。

如果页面涉及输出，至少包含一个用户 prompt、一个 generating/thinking 状态、一个完成回复、一组 citation 和一个 artifact。

## 必备交互

- 提交后清空 composer，追加用户消息，进入 generating 状态，再追加 mock 助手回复。
- 提交按钮只允许使用 `ChatInput` 内置发送入口;点击内置发送或按 Enter 都走同一个 submit handler。
- Composer 流光边框在 DOM 插入或重新触发时单圈播放,且必须贴着输入框可见边框;静态 / fallback 页面必须引入 `motion/shimmer-border.css` 和 `motion/shimmer-border.js`,动态插入后调用 `autoInitShimmerBorders()` 或 `initShimmerBorder()`.
- 停止生成会取消 mock timer / stream，并让 composer 回到 idle。
- Thinking / ThoughtChain 可展开和收起。
- 被裁切的长 thought 或 Markdown 区块可展开。
- 回复操作会更新可见反馈状态。
- Citation 链接可点击；离线 prototype 中如不可点击，要有明确原因。
- 点击 ArtifactCard 打开三栏产物面板。
- 代码 / 预览 tab 会切换内容。
- 关闭产物面板后回到普通 chat 布局。
- chat 新输出自动滚动到底部；用户主动上滑时暂停自动跟随。

## 生产注意事项

- 不展示隐藏 chain-of-thought。`Thinking` 和 `ThoughtChain` 只展示可公开过程摘要。
- 不要在 chat 页使用欢迎页 chips 或 gallery。
- 不要在 chat 页放背景粒子。
- 不要在 chat 页把 Composer 放进滚动区;Composer + footnote 是白卡底部固定组合,上方 ChatScroll 自己滚动。
- 不要在 chat 页出现两个发送按钮、两个 Sidebar 折叠入口或两个法务免责声明。
- 不要把 AI 回复正文放进 `Bubble variant="text"` 或二次气泡容器,否则会出现不合适的“查看更多”截断。
- 三栏模式下，左侧不要继续展示完整长回复；详细输出应由右侧产物面板承载。
- streaming 逻辑保持隔离，方便后续替换成真实 API。
