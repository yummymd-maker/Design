`ve-bubble` 用于在 AI 对话流中渲染单条消息，提供 `avatar`、`header`、`content`、`footer` 四个具名插槽组成的三段式骨架，并通过 `placement` / `variant` / `shape` 控制 9 种视觉变体。长内容会按 `max-height` 自动折叠，并在底部提供“See more / Collapse”交互；组件本身只承担消息呈现与局部交互，不持有会话状态机。

`ve-bubble-list` 是一个轻量布局容器，按列纵向排列若干 `ve-bubble`。

## 何时使用

- AI 对话中"用户消息 + AI 回复"的双方气泡渲染（`placement="start" | "end"`）
- 流式 token 输出（外部用 `<ve-markdown>` 等组件投影到默认 slot）
- 需要纵向排列多条消息（`ve-bubble-list`）
- 通过 `variant` × `shape` 表达不同视觉权重（如 user 实心胶囊、ai outlined corner、tool text 模式）

## 引入组件

```ts
import '@ve-design/web/ve-bubble';
```

## 示例

### 基础用法

会话通常采用左右布局：用户消息带有气泡背景，靠右显示（`placement="end"`）；AI 回复和生成内容靠左展示（`placement="start"`）。AI 回复可直接投影 Markdown 内容，列表间距默认使用 `--ve-bubble-list-gap`，需要覆盖时可显式传入 `gap`。

```html preview
<script type="module">
  import '@ve-design/web/ve-bubble';
  import '@ve-design/web/ve-markdown';
</script>

<ve-bubble-list style="width:100%; padding:24px;">
  <ve-bubble placement="end" variant="filled"
    >帮我整理一下这周的迭代要点。</ve-bubble
  >
  <ve-bubble placement="start" variant="text">
    <ve-markdown
      content="当然。以下是本周迭代要点：\n\n1. 完成 Bubble 基础对话样式验收。\n2. 补充 Markdown、引用和操作栏等组合场景。\n3. 同步优化长内容折叠与回到底部体验。"
    ></ve-markdown>
  </ve-bubble>
  <ve-bubble placement="end" variant="filled"
    >再帮我列一下还需要跟进的事项。</ve-bubble
  >
</ve-bubble-list>
```

### 引用

通过 `has-quote` 属性在气泡内容顶部渲染引用区域（左竖线 + 图标 + 文本），常用于引用附件、历史消息或文件。

```html preview
<script type="module">
  import '@ve-design/web/ve-bubble';
  import '@ve-design/web/icons/type-pdf-state-default';
</script>

<div style="display:flex; flex-direction:column; gap:16px; padding:24px; width:100%">
  <!-- 自适应宽度：短文本 + 引用 -->
  <ve-bubble
    placement="start"
    variant="filled"
    has-quote
  >
    <span slot="quote" class="bubble-quote-label">
      <ve-icon name="type-pdf-state-default" style="--ve-icon-size:18px"></ve-icon>
      文本标题.pdf
    </span>
    云服务平台
  </ve-bubble>

  <!-- 超长内容 + 引用 -->
  <ve-bubble
    placement="start"
    variant="filled"
    has-quote
  >
    <span slot="quote" class="bubble-quote-label">
      <ve-icon name="type-pdf-state-default" style="--ve-icon-size:18px"></ve-icon>
      文本标题.pdf
    </span>
    你现在作为专业全能创作顾问，具备文案撰写、内容润色、逻辑梳理、结构优化、创意策划等全方位能力。当我给你任何创作任务时，请直接根据场景和目标，产出高质量、可直接使用的成品内容。要求语言精炼、逻辑清晰、风格贴合，一次性给到成品，不需要我再补充提问和二次修改。你现在作为专业全能创作顾问，具备文案撰写、内容润色、逻辑梳理、结构优化、创意策划等全方位能力。当我给你任何创作任务时，请直接根据场景和目标，产出高质量、可直接使用的成品内容。要求语言精炼、逻辑清晰、风格贴合，一次性给到成品，不需要我再补充提问和二次修改。
  </ve-bubble>
</div>

<style>
  .bubble-quote-label {
    display: inline-flex;
    align-items: center;
    gap: 4px;
  }
</style>
```

### 综合对话

通过 `header`、`footer`、`quote` 和默认插槽可以组合出带 Skill、文件引用、附件预览和操作栏的完整对话。操作栏建议复用 `ve-actions`，时间放在操作行最后侧，附件可按业务需要使用横向卡片或紧凑标签形态。

```html preview
<script type="module">
  import '@ve-design/web/ve-bubble';
  import '@ve-design/web/ve-actions';
  import '@ve-design/web/ve-markdown';
  import '@ve-design/web/icons';

  const answerActions = document.getElementById('bubble-answer-actions');
  answerActions.items = [
    { key: 'copy', icon: '<ve-icon name="copy"></ve-icon>' },
    { key: 'like', icon: '<ve-icon name="like"></ve-icon>' },
    { key: 'dislike', icon: '<ve-icon name="dislike"></ve-icon>' },
    { key: 'upload', icon: '<ve-icon name="upload"></ve-icon>' },
    { key: 'retry', icon: '<ve-icon name="refresh"></ve-icon>' },
    { key: 'page-prev', icon: '<ve-icon name="chevron-left-sm"></ve-icon>' },
    { key: 'page', text: '1/2' },
    { key: 'page-next', icon: '<ve-icon name="chevron-right-sm"></ve-icon>' },
    { key: 'more', type: 'more', icon: '<ve-icon name="more-horizontal"></ve-icon>' },
    { key: 'date', text: '4月22日' },
  ];
</script>

<ve-bubble-list style="width:100%; padding:24px;">
  <ve-bubble placement="end" variant="filled" shape="round">
    <span class="bubble-demo-skill">/ Agent Design Skill</span>
    生成一个项目说明页
  </ve-bubble>

  <ve-bubble placement="start" variant="filled" has-quote>
    <span slot="quote" class="bubble-demo-quote">
      <ve-icon name="type-pdf-state-default" style="--ve-icon-size:18px"></ve-icon>
      文本标题.pdf
    </span>

    <div class="bubble-demo-attachments" aria-label="附件列表">
      <span class="bubble-demo-attachment">
        <ve-icon name="file-attachment"></ve-icon>
        需求说明.pdf
      </span>
      <span class="bubble-demo-attachment">
        <ve-icon name="image"></ve-icon>
        页面参考.png
      </span>
      <span class="bubble-demo-attachment bubble-demo-attachment-compact">
        <ve-icon name="upload"></ve-icon>
        上传失败
      </span>
    </div>

    <ve-markdown
      content="已基于参考资料整理页面结构：\n\n- 顶部展示项目目标和关键指标。\n- 中部拆分为核心能力、流程说明和风险提醒。\n- 底部保留下一步操作入口。"
    ></ve-markdown>

    <ve-actions id="bubble-answer-actions" slot="footer">
      <span slot="extra" class="bubble-demo-reference">参考 11 篇资料</span>
    </ve-actions>
  </ve-bubble>
</ve-bubble-list>

<style>
  .bubble-demo-skill {
    color: var(--color-text-accent, #165dff);
  }

  .bubble-demo-quote,
  .bubble-demo-attachment,
  .bubble-demo-reference {
    display: inline-flex;
    align-items: center;
    gap: 4px;
  }

  .bubble-demo-attachments {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-block-end: 12px;
  }

  .bubble-demo-attachment {
    min-height: 28px;
    padding: 4px 8px;
    border-radius: var(--radius-md, 8px);
    background: var(--color-bg-surface, #f4f4fb);
    color: var(--color-text-secondary);
    font-size: 13px;
  }

  .bubble-demo-attachment-compact {
    color: var(--color-text-danger, #f53f3f);
  }

  .bubble-demo-reference {
    height: 28px;
    color: var(--color-text-tertiary);
    font-size: 13px;
  }
</style>
```

### 编辑模式

设置 `editable` 属性后，气泡内容替换为可编辑的 textarea + 操作按钮组合，适用于用户修改已发送的消息。

```html preview
<script type="module">
  import '@ve-design/web/ve-bubble';
  import '@ve-design/web/ve-button';
  import '@ve-design/web/ve-input';
</script>

<div style="display:flex; flex-direction:column; gap:16px; padding:24px;">
  <ve-button id="edit-toggle-btn" type="outline" size="small"
    >进入编辑</ve-button
  >
  <ve-bubble
    placement="end"
    variant="filled"
    id="edit-demo"
    content="你现在作为专业全能创作顾问，具备文案撰写、内容润色、逻辑梳理、结构优化、创意策划等全方位能力，请严格按照我的需求深度理解意图，不偏离主题、不敷衍精简、不随意脑补无关内容，全程保持逻辑严谨、表述正式流畅、用词精准高级。"
  ></ve-bubble>
</div>

<script>
  const editDemo = document.getElementById('edit-demo');
  const editBtn = document.getElementById('edit-toggle-btn');

  editBtn?.addEventListener('click', () => {
    editDemo.editable = !editDemo.editable;
    editBtn.textContent = editDemo.editable ? '退出编辑' : '进入编辑';
  });

  editDemo?.addEventListener('ve-bubble-edit-confirm', (e) => {
    console.log('确认编辑:', e.detail.content);
    editDemo.editable = false;
    editDemo.content = e.detail.content;
    editBtn.textContent = '进入编辑';
  });

  editDemo?.addEventListener('ve-bubble-edit-cancel', () => {
    editDemo.editable = false;
    editBtn.textContent = '进入编辑';
  });
</script>
```

### 长内容自动折叠

当消息内容高度超过 `max-height` 时，气泡会自动折叠到底部并显示渐变遮罩和“See more”按钮；点击后展开完整内容，按钮文案变为“Collapse”。可通过 `see-more-label` 和 `see-less-label` 自定义展开、收起按钮文案。

```html preview
<script type="module">
  import '@ve-design/web/ve-bubble';
</script>

<ve-bubble
  placement="start"
  variant="filled"
  max-height="216px"
  see-more-label="See more"
  see-less-label="Collapse"
>
  This is a long AI response for demonstrating automatic collapse and expand.
  In AI conversations, a model answer may contain a large amount of text, such
  as code explanation, architecture analysis, and step-by-step instructions.
  To avoid occupying too much screen space, Bubble automatically collapses the
  content when its height exceeds the max-height threshold. Users can click the
  "See more" action to read the full answer. Here is the second paragraph with
  more details about the plan, trade-offs, assumptions, and follow-up tasks. In
  the expanded state, the bottom action changes to "Collapse" so users can fold
  the message back at any time.
</ve-bubble>
```

### 气泡分割器 `ve-bubble-divider`

在对话列表中插入分割标记，支持两种形态：

- **分割线**（`type="divider"`）：带可选居中标签的水平分隔线，常用于时间分组
- **系统提示**（`type="notice"`）：带图标的系统消息卡片，可附带操作按钮

#### 引入

```ts
import '@ve-design/web/ve-bubble-divider';
```

#### 分割线

```html preview
<script type="module">
  import '@ve-design/web/ve-bubble-divider';
</script>

<div style="display:flex; flex-direction:column; gap:12px; padding:24px;">
  <!-- 带时间标签 -->
  <ve-bubble-divider type="divider">
    <span slot="label">2024-01-15 14:30</span>
  </ve-bubble-divider>
</div>
```

#### 系统提示

系统提示卡片支持两种状态：**普通提示**（仅信息展示）和**带操作提示**（含可交互操作按钮）。

```html preview
<script type="module">
  import '@ve-design/web/ve-bubble-divider';
</script>

<div style="display:flex; flex-direction:column; gap:16px; padding:24px;">
  <ve-bubble-divider
    type="notice"
    message="系统已自动保存当前会话"
  ></ve-bubble-divider>

  <ve-bubble-divider
    type="notice"
    status="error"
    message="会话已超时，请重试"
    action-text="重试"
    show-action
  ></ve-bubble-divider>

  <!-- 自定义图标和操作 -->
  <ve-bubble-divider type="notice" show-action>
    <svg
      slot="icon"
      viewBox="0 0 16 16"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linecap="round"
    >
      <path d="M8 3v10M3 8h10" />
    </svg>
    新对话已创建
    <span slot="action">撤销</span>
  </ve-bubble-divider>
</div>

<script>
  document.querySelectorAll('ve-bubble-divider').forEach((el) => {
    el.addEventListener('ve-bubble-divider-action', (e) => {
      console.log('action clicked:', e.detail);
    });
  });
</script>
```

### Loading 加载指示器

当 AI 正在生成回复或等待后端响应时，在列表底部显示弹跳圆点 loading 胶囊：

```html preview
<script type="module">
  import '@ve-design/web/ve-bubble';
</script>

<div style="padding:24px;">
  <div
    style="height:240px; overflow-y:auto; border:1px solid var(--color-border-default); border-radius:8px; padding:12px;"
  >
    <ve-bubble-list loading>
      <ve-bubble placement="end" variant="filled"
        >你好，我想了解一下项目架构</ve-bubble
      >
      <ve-bubble placement="start" variant="text"
        >当然！项目采用 Monorepo 架构，包含三个核心模块。</ve-bubble
      >
      <ve-bubble placement="end" variant="filled">分别是哪三个？</ve-bubble>
      <ve-bubble placement="start" variant="text"
        >1. components — Web Components 组件库</ve-bubble
      >
      <ve-bubble placement="start" variant="text"
        >2. react — React 包装器</ve-bubble
      >
      <ve-bubble placement="start" variant="text"
        >3. theme — CSS 主题和设计令牌</ve-bubble
      >
      <ve-bubble placement="end" variant="filled"
        >组件库用的什么技术？</ve-bubble
      >
      <ve-bubble placement="start" variant="text"
        >基于 Lit 3.x 构建的原生 Web Components，支持跨框架使用。</ve-bubble
      >
      <ve-bubble placement="end" variant="filled">打包工具呢？</ve-bubble>
      <ve-bubble placement="start" variant="text"
        >使用 Rslib（基于 Rspack），输出 ESM 和类型声明。</ve-bubble
      >
    </ve-bubble-list>
  </div>
</div>
```

### 滚动到底部指示器

当消息列表内容超出可视区域，用户向上滚动后，底部出现"回到底部"按钮。点击后平滑滚动到底部：

```html preview
<script type="module">
  import '@ve-design/web/ve-bubble';
</script>

<div style="padding:24px;">
  <div style="margin-bottom:12px; font-size:13px; color:var(--color-text-tertiary);">
    ↑ 向上滚动试试，底部会出现向下箭头按钮
  </div>
  <div
    style="height:240px; overflow-y:auto; border:1px solid var(--color-border-default); border-radius:8px; padding:12px;"
  >
    <ve-bubble-list scroll-indicator id="scroll-demo">
      <ve-bubble placement="end" variant="filled"
        >你好，我想了解一下项目架构</ve-bubble
      >
      <ve-bubble placement="start" variant="text"
        >当然！项目采用 Monorepo 架构，包含三个核心模块。</ve-bubble
      >
      <ve-bubble placement="end" variant="filled">分别是哪三个？</ve-bubble>
      <ve-bubble placement="start" variant="text"
        >1. components — Web Components 组件库</ve-bubble
      >
      <ve-bubble placement="start" variant="text"
        >2. react — React 包装器</ve-bubble
      >
      <ve-bubble placement="start" variant="text"
        >3. theme — CSS 主题和设计令牌</ve-bubble
      >
      <ve-bubble placement="end" variant="filled"
        >组件库用的什么技术？</ve-bubble
      >
      <ve-bubble placement="start" variant="text"
        >基于 Lit 3.x 构建的原生 Web Components，支持跨框架使用。</ve-bubble
      >
      <ve-bubble placement="end" variant="filled">打包工具呢？</ve-bubble>
      <ve-bubble placement="start" variant="text"
        >使用 Rslib（基于 Rspack），输出 ESM 和类型声明。</ve-bubble
      >
    </ve-bubble-list>
  </div>
</div>

<script>
  document
    .getElementById('scroll-demo')
    ?.addEventListener('ve-bubble-list-scroll-bottom', () => {
      console.log('已滚动到底部');
    });
</script>
```

## API

### `ve-bubble`

#### 属性

| 属性                 | 说明                                                          | 类型                               | 默认值       |
| -------------------- | ------------------------------------------------------------- | ---------------------------------- | ------------ |
| `placement`          | 气泡左 / 右对齐                                               | `'start' \| 'end'`                 | `'start'`    |
| `variant`            | 视觉变体                                                      | `'filled' \| 'outlined' \| 'text'` | `'filled'`   |
| `shape`              | 气泡形状（`variant="text"` 时不生效）                         | `'default' \| 'round' \| 'corner'` | `'default'`  |
| `content`            | 文本内容快捷写法；默认 slot 中的内容优先级更高                | `string`                           | -            |
| `loading`            | 是否处于 loading 占位态，`true` 时隐藏内容并展示 loading slot | `boolean`                          | `false`      |
| `max-height`         | 长内容自动折叠的最大高度；内容未超过该高度时不显示切换按钮    | `string`                           | `'216px'`    |
| `see-more-label`     | 收起态"查看更多"按钮文案                                      | `string`                           | `'查看更多'` |
| `see-less-label`     | 展开态"收起"按钮文案                                          | `string`                           | `'收起'`     |
| `has-quote`          | 是否在内容顶部渲染引用区域                                    | `boolean`                          | `false`      |
| `quote-label`        | 引用文本（如文件名、消息摘要）                                | `string`                           | `''`         |
| `editable`           | 是否进入编辑模式（textarea + 操作按钮）                       | `boolean`                          | `false`      |
| `edit-confirm-label` | 编辑确认按钮文案                                              | `string`                           | `'发送'`     |
| `edit-cancel-label`  | 编辑取消按钮文案                                              | `string`                           | `'取消'`     |

#### 插槽

| 名称        | 说明                                                                                |
| ----------- | ----------------------------------------------------------------------------------- |
| `(default)` | 消息正文，可放置纯文本、`<ve-markdown>` 或任意富文本节点；优先级高于 `content` 属性 |
| `avatar`    | 头像区域，建议使用 32×32 圆形元素                                                   |
| `header`    | 内容区顶部插槽，常用于"角色名 + 时间戳"                                             |
| `footer`    | 内容区底部插槽，常用于反馈按钮 / 引用源                                             |
| `quote`     | 引用区域内容插槽；可自定义文件图标、文件名或历史消息摘要，优先级高于 `quote-label` 属性 |
| `loading`   | 自定义 loading 占位节点；不提供时使用内置默认占位                                   |

#### 事件

| 事件名                   | 说明                       | 回调参数                           |
| ------------------------ | -------------------------- | ---------------------------------- |
| `ve-bubble-edit-confirm` | 编辑模式点击确认按钮时触发 | `CustomEvent<{ content: string }>` |
| `ve-bubble-edit-cancel`  | 编辑模式点击取消按钮时触发 | `CustomEvent`                      |

### `ve-bubble-list`

#### 属性

| 属性               | 说明                                                            | 类型      | 默认值   |
| ------------------ | --------------------------------------------------------------- | --------- | -------- |
| `gap`              | 子项之间的纵向间距，可写任意 CSS 长度（如 `'12px'` / `'1rem'`）；未设置时使用 `--ve-bubble-list-gap` | `string`  | `var(--space-xl, 32px)` |
| `loading`          | 是否在底部显示 loading 指示器（弹跳圆点）                       | `boolean` | `false`  |
| `scroll-indicator` | 是否开启滚动检测，当用户向上滚动时显示"回到底部"按钮            | `boolean` | `false`  |

#### 插槽

| 名称        | 说明                          |
| ----------- | ----------------------------- |
| `(default)` | 任意数量的 `ve-bubble` 子节点 |

#### 事件

| 事件名                         | 说明                     | 回调参数      |
| ------------------------------ | ------------------------ | ------------- |
| `ve-bubble-list-scroll-bottom` | 点击"回到底部"按钮时触发 | `CustomEvent` |

### `ve-bubble-divider` 属性

| 属性          | 说明                               | 类型                    | 默认值      |
| ------------- | ---------------------------------- | ----------------------- | ----------- |
| `type`        | 分割器类型                         | `'divider' \| 'notice'` | `'divider'` |
| `show-label`  | 分割线模式下是否显示中间标签       | `boolean`               | `true`      |
| `message`     | 系统提示默认消息文本               | `string`                | `''`        |
| `action-text` | 操作按钮文本                       | `string`                | `''`        |
| `show-action` | 是否显示操作按钮（仅 notice 模式） | `boolean`               | `false`     |

### `ve-bubble-divider` 插槽

| 名称        | 说明                                 |
| ----------- | ------------------------------------ |
| `(default)` | notice 模式下的消息内容              |
| `label`     | divider 模式下的标签内容（如时间戳） |
| `icon`      | notice 模式下的自定义图标            |
| `action`    | notice 模式下的自定义操作按钮内容    |

### `ve-bubble-divider` 事件

| 事件名                     | 说明               | 回调参数                                       |
| -------------------------- | ------------------ | ---------------------------------------------- |
| `ve-bubble-divider-action` | 点击操作按钮时触发 | `CustomEvent<{ type: 'divider' \| 'notice' }>` |
