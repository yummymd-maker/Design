`ve-text-selection` 用于包裹一段文字，用户在范围内完成文本选择后，浮出工具栏，并提供完全由调用方配置的可定制操作（如引用、复制、语音、刷新等）。

## 何时使用

- 文档/对话内某段文字需要在选中后给出快捷操作（复制、引用到输入框、朗读、重写等）。
- 需要将选区操作收敛到文字本身的范围内，避免全局监听污染其它内容。

## 引入组件

```ts
import '@ve-design/web/ve-text-selection';
```

> 操作集没有默认值，必须通过 `actions` 属性显式配置；同时按需引入对应的图标，例如 `import '@ve-design/web/icons/copy'`。

## 示例

### 基础用法

将需要支持选择操作的文字放入默认插槽，并通过 `actions` 配置所需的动作。在该范围内选中任意一段文字，浮出框会自动显示在选区上方。

```html preview
<script type="module">
  import '@ve-design/web/ve-text-selection';
  import '@ve-design/web/icons/corner-down-right';
  import '@ve-design/web/icons/copy';
  import '@ve-design/web/icons/voice';
  import '@ve-design/web/icons/refresh';
  const target = document.querySelector('#basic-text-selection');
  if (target) {
    target.actions = [
      { key: 'quote', label: '引用', icon: 'corner-down-right' },
      { key: 'copy', label: '复制', icon: 'copy' },
      { key: 'voice', label: '语音', icon: 'voice' },
      { key: 'refresh', label: '刷新', icon: 'refresh' },
    ];
  }
</script>

<section style="padding: 24px; max-width: 640px; line-height: 1.8; color: var(--color-text-primary);">
  <ve-text-selection id="basic-text-selection">
    VeDesign 是一个跨框架的 AI Agent 设计系统，提供基于 Lit 的原生 Web Components 与 React 包装器。试着拖选这段文字，工具栏会浮出在选区上方，展示你配置的动作集。
  </ve-text-selection>
</section>
```

### 自定义操作集

通过 `actions` 属性传入自定义动作列表。每个动作至少包含 `key` 与 `label`；`icon` 字段可填写已通过 `@ve-design/web/icons/*` 注册的图标名。也可以在动作上挂 `onClick` 回调单独处理某个按钮的点击逻辑（事件 `ve-text-selection-action` 仍会照常派发）。

```html preview
<script type="module">
  import '@ve-design/web/ve-text-selection';
  import '@ve-design/web/icons/corner-down-right';
  import '@ve-design/web/icons/copy';
  import '@ve-design/web/icons/more-horizontal';
  const target = document.querySelector('#custom-actions');
  if (target) {
    target.actions = [
      {
        key: 'quote',
        label: '引用',
        icon: 'corner-down-right',
        onClick: (detail) => console.log('引用 ->', detail.selectedText),
      },
      {
        key: 'copy',
        label: '复制',
        icon: 'copy',
        onClick: (detail) => navigator.clipboard?.writeText(detail.selectedText),
      },
      { key: 'more', label: '更多', icon: 'more-horizontal' },
    ];
    target.addEventListener('ve-text-selection-action', (event) => {
      console.log('action', event.detail);
    });
  }
</script>

<section style="padding: 24px; max-width: 640px; line-height: 1.8;">
  <ve-text-selection id="custom-actions">
    自定义操作集只展示「引用 / 复制 / 更多」三个动作。点击「复制」会通过 `onClick` 回调把选中的原文写入剪贴板，同时仍会派发 `ve-text-selection-action` 事件。
  </ve-text-selection>
</section>
```

### 自定义图标与文案

通过具名插槽 `{key}-icon` / `{key}-label` 单独覆盖某个动作的图标或文案。

```html preview
<script type="module">
  import '@ve-design/web/ve-text-selection';
  import '@ve-design/web/icons/copy';
  import '@ve-design/web/icons/voice';
  const target = document.querySelector('#custom-slots');
  if (target) {
    target.actions = [
      { key: 'copy', label: 'Copy', icon: 'copy' },
      { key: 'voice', label: 'Read aloud', icon: 'voice' },
    ];
  }
</script>

<section style="padding: 24px; max-width: 640px; line-height: 1.8;">
  <ve-text-selection id="custom-slots">
    选中此处文字，体验自定义图标与文案：复制按钮的标签替换为「Copy」，语音按钮替换为「Read aloud」。
    <ve-icon slot="copy-icon" name="copy"></ve-icon>
    <span slot="copy-label">Copy</span>
    <ve-icon slot="voice-icon" name="voice"></ve-icon>
    <span slot="voice-label">Read aloud</span>
  </ve-text-selection>
</section>
```

### 强制展示浮出框（文档/截图用）

`force-open` 跳过实际选区，强制将浮出框定位在文本上方，便于文档展示与视觉验收。需要同时提供 `actions`，否则浮出框不会渲染。

```html preview
<script type="module">
  import '@ve-design/web/ve-text-selection';
  import '@ve-design/web/icons/corner-down-right';
  import '@ve-design/web/icons/copy';
  import '@ve-design/web/icons/voice';
  import '@ve-design/web/icons/refresh';
  const target = document.querySelector('#force-open-demo');
  if (target) {
    target.actions = [
      { key: 'quote', label: '引用', icon: 'corner-down-right' },
      { key: 'copy', label: '复制', icon: 'copy' },
      { key: 'voice', label: '语音', icon: 'voice' },
      { key: 'refresh', label: '刷新', icon: 'refresh' },
    ];
  }
</script>

<section style="padding: 56px 24px 24px; max-width: 640px; line-height: 1.8;">
  <ve-text-selection id="force-open-demo" force-open>
    这段文本上方会持续展示浮出框，无需手动选择即可预览样式。
  </ve-text-selection>
</section>
```

## API

### ve-text-selection 属性

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `actions` | 浮出框中展示的动作列表，按数组顺序渲染。**必须显式配置**，未配置或为空时浮出框不会出现。 | `VeTextSelectionAction[]` | `[]` |
| `disabled` | 禁用浮出框（仍渲染插槽内容）。 | `boolean` | `false` |
| `force-open` | 强制保持浮出框可见（用于文档/截图）。仅在 `actions` 非空时生效。 | `boolean` | `false` |

`VeTextSelectionAction`：

```ts
interface VeTextSelectionAction {
  key: string;       // 唯一键，事件 detail 中回传
  label: string;     // 文案
  icon?: string;     // 图标名（@ve-design/web/icons/* 已注册）
  disabled?: boolean;
  /** 单个动作被点击时的回调，与 `ve-text-selection-action` 事件 detail 一致。 */
  onClick?: (detail: { action: string; label: string; selectedText: string }) => void;
}
```

### ve-text-selection 事件

| 事件 | 说明 | detail |
| --- | --- | --- |
| `ve-text-selection-action` | 用户点击浮出框中某个动作。 | `{ action, label, selectedText }` |
| `ve-text-selection-change` | 选区在该范围内发生变化（包括清空）。 | `{ selectedText }` |

### ve-text-selection 插槽

| 名称 | 说明 |
| --- | --- |
| 默认插槽 | 被包裹的文字内容。 |
| `{key}-icon` | 覆盖某个动作的图标节点（如 `copy-icon`）。 |
| `{key}-label` | 覆盖某个动作的文本标签（如 `copy-label`）。 |
