`ve-tooltip` 用于在触发元素附近展示简短辅助说明，适合解释图标、字段、状态或快捷操作。

<style>{`
  .ve-tooltip-demo {
    box-sizing: border-box;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: 16px;
    min-height: 112px;
    padding: 40px 24px;
  }

  .ve-tooltip-demo-grid {
    box-sizing: border-box;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(72px, max-content));
    align-items: center;
    justify-content: center;
    justify-items: center;
    gap: 18px 28px;
    min-height: 156px;
    padding: 48px 24px;
  }

  .ve-tooltip-demo-stack {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 14px;
    min-height: 136px;
    padding: 40px 24px;
  }

  .ve-tooltip-content-stack {
    display: inline-flex;
    flex-direction: column;
    gap: 2px;
  }

  .ve-tooltip-content-row {
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }

  .ve-tooltip-content-description {
    color: var(--color-text-disable);
  }

  .ve-tooltip-kbd {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    border-radius: 0;
    background: transparent;
    color: var(--color-text-tertiary);
    font: inherit;
    font-size: 11px;
    line-height: 16px;
  }

  .ve-tooltip-event-log {
    min-inline-size: 220px;
    text-align: center;
    color: var(--color-text-3);
    font-size: 12px;
    line-height: 1.5;
  }
`}</style>

## 何时使用

- 需要解释紧凑控件、图标按钮、状态文案或路径信息。
- 需要在 hover、focus 或 click 时展示非交互式提示。
- 需要通过插槽组织描述、强调文本或快捷键。

## 引入组件

```ts
import '@ve-design/web/ve-tooltip';
```

## 示例

### 基础用法

默认插槽放置触发元素，`content` 插槽放置提示内容。

```html preview
<script type="module">
  import '@ve-design/web/ve-button';
  import '@ve-design/web/ve-tooltip';
</script>

<section class="ve-tooltip-demo">
  <ve-tooltip>
    <ve-button type="primary">Run Agent</ve-button>
    <span slot="content">Run with the current task context.</span>
  </ve-tooltip>

  <ve-tooltip>
    <ve-button type="outline">Token Budget</ve-button>
    <span slot="content">Estimated cost for this turn: 3.2K tokens.</span>
  </ve-tooltip>
</section>
```

### 内容结构

需要强调文本、路径或快捷键时，直接在 `content` 插槽内组织结构。

```html preview
<script type="module">
  import '@ve-design/web/ve-button';
  import '@ve-design/web/ve-tooltip';
</script>

<section class="ve-tooltip-demo">
  <ve-tooltip>
    <ve-button type="primary">File Path</ve-button>
    <span slot="content" class="ve-tooltip-content-stack">
      <strong>Design reference</strong>
      <span class="ve-tooltip-content-description">
        /Frame 2147238986 / Action item
      </span>
    </span>
  </ve-tooltip>

  <ve-tooltip>
    <ve-button type="outline">Command</ve-button>
    <span slot="content" class="ve-tooltip-content-row">
      <span>Open command menu</span>
      <kbd class="ve-tooltip-kbd">⌘K</kbd>
    </span>
  </ve-tooltip>
</section>
```

### 弹出位置

`position` 控制提示框的优先展示位置。

```html preview
<script type="module">
  import '@ve-design/web/ve-button';
  import '@ve-design/web/ve-tooltip';
</script>

<section class="ve-tooltip-demo-grid">
  <ve-tooltip position="top">
    <ve-button>top</ve-button>
    <span slot="content">Show above the trigger.</span>
  </ve-tooltip>

  <ve-tooltip position="right">
    <ve-button>right</ve-button>
    <span slot="content">Show to the right.</span>
  </ve-tooltip>

  <ve-tooltip position="bottom">
    <ve-button>bottom</ve-button>
    <span slot="content">Show below the trigger.</span>
  </ve-tooltip>

  <ve-tooltip position="left">
    <ve-button>left</ve-button>
    <span slot="content">Show to the left.</span>
  </ve-tooltip>
</section>
```

### 箭头

设置 `arrow` 后展示方向箭头；默认保持无箭头气泡。

```html preview
<script type="module">
  import '@ve-design/web/ve-button';
  import '@ve-design/web/ve-tooltip';
</script>

<section class="ve-tooltip-demo">
  <ve-tooltip arrow position="top">
    <ve-button type="primary">With Arrow</ve-button>
    <span slot="content">The arrow points to the trigger.</span>
  </ve-tooltip>
</section>
```

### 触发方式

`trigger` 支持 `hover`、`click` 和 `focus`。

```html preview
<script type="module">
  import '@ve-design/web/ve-button';
  import '@ve-design/web/ve-tooltip';
</script>

<section class="ve-tooltip-demo">
  <ve-tooltip trigger="hover">
    <ve-button type="primary">Hover</ve-button>
    <span slot="content">Preview before opening the editor.</span>
  </ve-tooltip>

  <ve-tooltip trigger="click">
    <ve-button type="outline">Click</ve-button>
    <span slot="content">Click again or click outside to close.</span>
  </ve-tooltip>

  <ve-tooltip trigger="focus">
    <ve-button type="secondary">Focus</ve-button>
    <span slot="content">Show the hint when the trigger receives focus.</span>
  </ve-tooltip>
</section>
```

### 状态控制

`delay` 用于减少快速划过时的干扰，`open` 可由外部状态控制。

```html preview
<script type="module">
  import '@ve-design/web/ve-button';
  import '@ve-design/web/ve-tooltip';
</script>

<section class="ve-tooltip-demo">
  <ve-tooltip delay="300">
    <ve-button type="primary">Delayed</ve-button>
    <span slot="content">Show after 300ms.</span>
  </ve-tooltip>

  <ve-button id="tooltip-control-toggle" type="outline">Toggle</ve-button>

  <ve-tooltip id="tooltip-control" open position="right">
    <ve-button type="secondary">Controlled</ve-button>
    <span slot="content">The open state is managed externally.</span>
  </ve-tooltip>
</section>

<script>
  const toggleButton = document.getElementById('tooltip-control-toggle');
  const tooltip = document.getElementById('tooltip-control');

  toggleButton.addEventListener('click', () => {
    tooltip.toggleAttribute('open');
  });
</script>
```

### 禁用状态

设置 `disabled` 后，Tooltip 不再响应触发事件。

```html preview
<script type="module">
  import '@ve-design/web/ve-button';
  import '@ve-design/web/ve-tooltip';
</script>

<section class="ve-tooltip-demo">
  <ve-tooltip disabled>
    <ve-button type="primary" disabled>Deploy Agent</ve-button>
    <span slot="content">This tooltip will not be shown.</span>
  </ve-tooltip>
</section>
```

### 展开状态事件

打开状态变化时会派发 `ve-open-change` 事件，事件参数包含下一次打开状态。

```html preview
<script type="module">
  import '@ve-design/web/ve-button';
  import '@ve-design/web/ve-tooltip';
</script>

<section class="ve-tooltip-demo-stack">
  <ve-tooltip id="tooltip-event-demo" trigger="click">
    <ve-button type="primary">Trace Tooltip</ve-button>
    <span slot="content">Track each open or close transition.</span>
  </ve-tooltip>

  <span id="tooltip-event-log" class="ve-tooltip-event-log">
    ve-open-change: false
  </span>
</section>

<script>
  const tooltip = document.getElementById('tooltip-event-demo');
  const log = document.getElementById('tooltip-event-log');

  tooltip.addEventListener('ve-open-change', (event) => {
    log.textContent = `ve-open-change: ${String(event.detail.open)}`;
  });
</script>
```

## API

### ve-tooltip 属性

| 属性名 | 描述 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `position` | 提示框优先展示位置，支持 `top`、`right`、`bottom`、`left` 及其 `-start`、`-end` 对齐变体。 | `TooltipPosition` | `'top'` |
| `trigger` | 触发方式。 | `'hover' &#124; 'click' &#124; 'focus'` | `'hover'` |
| `arrow` | 是否展示方向箭头。 | `boolean` | `false` |
| `open` | 当前是否打开；设置为布尔值时进入受控模式。 | `boolean &#124; undefined` | `undefined` |
| `default-open` | 非受控模式下的初始打开状态。 | `boolean` | `false` |
| `disabled` | 是否禁用提示交互和展示。 | `boolean` | `false` |
| `delay` | 打开或关闭延迟，单位毫秒。 | `number` | `80` |

### ve-tooltip 事件

| 事件名 | 描述 | 参数类型 |
| --- | --- | --- |
| `ve-open-change` | 打开状态变化请求发生时触发。 | `CustomEvent<{ open: boolean }>` |

### ve-tooltip 插槽

| 插槽名 | 描述 |
| --- | --- |
| 默认插槽 | 触发提示的元素，建议放置单个根节点。 |
| `content` | 提示框内容。 |
