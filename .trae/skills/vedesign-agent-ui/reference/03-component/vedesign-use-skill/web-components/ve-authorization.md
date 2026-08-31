`ve-authorization` 用于在 AI Agent 执行敏感能力前展示授权标题、权限内容和确认动作。它适合出现在对话区、命令执行区或内容区顶部，帮助用户明确“即将执行什么”“会使用什么能力”，并通过标准事件回传拒绝、允许一次或始终允许。

## 何时使用

- Agent 准备安装 skill、执行命令、搜索网页、读取文件或调用外部工具前，需要用户授权。
- 需要把命令、代码片段、权限说明或外部服务信息作为内容区展示给用户。
- 需要提供明确的安全动作：拒绝、允许一次、始终允许。
- 需要在默认属性用法和自定义标题、内容、动作区域之间灵活切换。

## 引入组件

```ts
import '@ve-design/web/ve-authorization';
```

## 示例

### 默认授权确认

横排是默认布局，适合在对话流中承载一段授权标题、内容代码和右侧动作按钮。

```html preview
<script type="module">
  import '@ve-design/web/ve-authorization';
</script>

<ve-authorization
  title="Allow Design Assistant to install the selected extension?"
  content="import * as React from 'react'\nimport * as DialogPrimitive from '@radix-ui/react-dialog'"
  deny-text="Cancel"
  allow-once-text="Allow once"
  allow-always-text="Always allow"
></ve-authorization>

<script>
  document.querySelector('ve-authorization').addEventListener('ve-authorization-action', (event) => {
    console.log('authorization action', event.detail);
  });
</script>
```

### 纵排授权

`orientation="vertical"` 会让按钮纵向铺满卡片宽度，适合窄容器或移动端对话气泡。

```html preview
<script type="module">
  import '@ve-design/web/ve-authorization';
</script>

<ve-authorization
  orientation="vertical"
  title="Allow Design Assistant to install the selected extension?"
  content="Install extension package\nUpdate local configuration"
></ve-authorization>
```

### 自定义标题和内容

`title` 和 `content` 插槽可以覆盖同名属性渲染出的默认内容。

```html preview
<script type="module">
  import '@ve-design/web/ve-authorization';
  import '@ve-design/web/icons/tool';
</script>

<ve-authorization>
  <span slot="title" style="display:flex;align-items:center;gap:10px">
    <ve-icon name="tool" size="20" style="color:var(--color-text-primary);flex:0 0 auto"></ve-icon>
    <span>Design Assistant wants to search external docs before editing components</span>
  </span>
  <div slot="content" style="display:grid;gap:8px;font-family:var(--font-sans);font-size:13px;line-height:1.5">
    <div style="display:flex;gap:8px;align-items:center">
      <strong style="min-width:72px;color:var(--color-text-primary)">Tool</strong>
      <code>Web Search</code>
    </div>
    <div style="display:flex;gap:8px;align-items:center">
      <strong style="min-width:72px;color:var(--color-text-primary)">Query</strong>
      <code>VeDesign Authorization component slots and React wrapper examples</code>
    </div>
    <div style="display:flex;gap:8px;align-items:flex-start">
      <strong style="min-width:72px;color:var(--color-text-primary)">Reason</strong>
      <span>Compare public component patterns before updating the docs and API guidance.</span>
    </div>
  </div>
</ve-authorization>
```

### 自定义动作区

`actions` 插槽会替换默认的拒绝、允许一次、始终允许按钮。自定义动作可以横向或纵向排列；按钮内容使用左侧图标与文案、右侧快捷键的结构，确保文案靠左展示。

```html preview
<script type="module">
  import '@ve-design/web/ve-authorization';
  import '@ve-design/web/ve-button';
  import '@ve-design/web/icons/logo-doubao-llm-icon';
  import '@ve-design/web/icons/check';
  import '@ve-design/web/icons/x-circle';
  import '@ve-design/web/icons/chevron-right-md';
</script>

<ve-authorization>
  <span slot="title" style="display:flex;align-items:center;gap:10px">
    <span style="display:inline-flex;align-items:center;justify-content:center;width:24px;height:24px;border:.5px solid var(--color-border-default);border-radius:var(--radius-md);background:var(--color-bg-base)">
      <ve-icon name="logo-doubao-llm-icon"></ve-icon>
    </span>
    <span>Design Assistant wants to use Web Search</span>
    <ve-icon name="chevron-right-md" style="color:var(--color-text-primary);flex:0 0 auto"></ve-icon>
  </span>
  <div slot="actions" style="display:flex;align-items:center;justify-content:flex-start;gap:12px;width:100%;padding-inline-start:36px">
    <ve-button size="small" type="primary">
      <ve-icon name="check"></ve-icon>
      <span>Always allow</span>
      <span style="opacity:.72;font-family:var(--font-mono)">⌘↵</span>
    </ve-button>
    <ve-button size="small" type="outline">
      <ve-icon name="check"></ve-icon>
      <span>Allow once</span>
      <span style="color:var(--color-text-tertiary);font-family:var(--font-mono)">⌘⇧↵</span>
    </ve-button>
    <ve-button size="small" type="outline">
      <ve-icon name="x-circle"></ve-icon>
      <span>Cancel</span>
      <span style="color:var(--color-text-tertiary);font-family:var(--font-mono)">esc</span>
    </ve-button>
  </div>
</ve-authorization>

<ve-authorization style="margin-top:16px;max-width:600px">
  <style>
    .authorization-long-action::part(control) {
      justify-content: flex-start;
    }

    .authorization-long-action::part(content) {
      justify-content: flex-start;
    }
  </style>
  <span slot="title" style="display:flex;align-items:center;gap:10px">
    <span style="display:inline-flex;align-items:center;justify-content:center;width:24px;height:24px;border:.5px solid var(--color-border-default);border-radius:var(--radius-md);background:var(--color-bg-base)">
      <ve-icon name="logo-doubao-llm-icon"></ve-icon>
    </span>
    <span>Design Assistant wants permission to use language model</span>
    <ve-icon name="chevron-right-md" style="color:var(--color-text-primary);flex:0 0 auto"></ve-icon>
  </span>
  <div slot="actions" style="display:grid;gap:8px;width:100%;padding-inline-start:36px">
    <ve-button class="authorization-long-action" long size="small" type="primary">
      <span style="display:inline-flex;align-items:center;gap:8px">
        <ve-icon name="check"></ve-icon>
        <span>Always allow language model</span>
      </span>
      <span style="opacity:.72;font-family:var(--font-mono)">⌘↵</span>
    </ve-button>
    <ve-button class="authorization-long-action" long size="small" type="outline">
      <span style="display:inline-flex;align-items:center;gap:8px">
        <ve-icon name="check"></ve-icon>
        <span>Allow once for this task</span>
      </span>
      <span style="color:var(--color-text-tertiary);font-family:var(--font-mono)">⌘⇧↵</span>
    </ve-button>
    <ve-button class="authorization-long-action" long size="small" type="outline">
      <span style="display:inline-flex;align-items:center;gap:8px">
        <ve-icon name="x-circle"></ve-icon>
        <span>Cancel this request</span>
      </span>
      <span style="color:var(--color-text-tertiary);font-family:var(--font-mono)">esc</span>
    </ve-button>
  </div>
</ve-authorization>
```

### 自定义动作文案

动作文案可以通过属性调整；点击默认按钮会派发 `ve-authorization-action` 事件。

```html preview
<script type="module">
  import '@ve-design/web/ve-authorization';
</script>

<ve-authorization
  title="Run shell command in workspace?"
  content="pnpm typecheck"
  deny-text="Cancel"
  allow-once-text="Run once"
  allow-always-text="Always allow pnpm typecheck"
></ve-authorization>
```

### 禁用状态

`disabled` 会禁用默认按钮，适合等待上一个授权动作完成时使用。

```html preview
<script type="module">
  import '@ve-design/web/ve-authorization';
</script>

<ve-authorization
  disabled
  title="Waiting for current approval result..."
  content="No new action can be selected while disabled."
></ve-authorization>
```

## API

### 属性

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `title` | `string` | `''` | 授权标题或问题文案。 |
| `content` | `string` | `''` | 权限、命令或代码内容；为空时内容区不展示有效内容。 |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | 动作区排列方向。 |
| `deny-text` | `string` | `'拒绝'` | 拒绝动作按钮文案。 |
| `allow-once-text` | `string` | `'允许一次'` | 允许一次动作按钮文案。 |
| `allow-always-text` | `string` | `'始终允许'` | 始终允许动作按钮文案。 |
| `disabled` | `boolean` | `false` | 禁用默认动作按钮。 |

### 事件

| 事件名 | detail | 触发时机 |
| --- | --- | --- |
| `ve-authorization-action` | `{ action: 'deny' \| 'allow-once' \| 'allow-always' }` | 用户点击默认动作按钮时触发。 |

### 方法

暂无公开方法。

### 插槽

| 插槽名 | 说明 |
| --- | --- |
| `title` | 自定义标题内容；提供后覆盖 `title` 属性渲染出的文本。 |
| `content` | 自定义内容区；提供后覆盖 `content` 属性渲染出的纯文本内容。 |
| `actions` | 自定义动作区；提供后替换默认拒绝、允许一次、始终允许按钮。 |
