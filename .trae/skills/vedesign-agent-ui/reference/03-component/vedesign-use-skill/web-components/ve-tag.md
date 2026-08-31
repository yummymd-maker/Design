`ve-tag` 用于呈现短文本标签，适合分类、状态、筛选条件等轻量信息。

## 何时使用

- 标记资源类型、任务状态、风险等级或筛选条件。
- 在表格、列表、工具栏中展示紧凑且可扫描的信息。
- 需要语义状态、前置图标、自定义颜色或关闭操作。

## 引入组件

```ts
import '@ve-design/web/ve-tag';
```

自定义图标可按需引入 `ve-icon` 和对应图标。

```ts
import '@ve-design/web/ve-icon';
import '@ve-design/web/icons/robot';
```

## 示例

### 基础标签

用于展示普通分类或短文本标记。

```html preview
<script type="module">
  import '@ve-design/web/ve-tag';
</script>

<section style="min-height:104px;display:flex;align-items:center;justify-content:center;flex-wrap:wrap;gap:8px;padding:16px;">
  <ve-tag>Retrieval</ve-tag>
  <ve-tag>Agent</ve-tag>
  <ve-tag status="success">Knowledge base</ve-tag>
</section>
```

### 语义状态

`status` 提供 `success`、`warning`、`error` 三种状态，并带有默认图标和颜色。

```html preview
<script type="module">
  import '@ve-design/web/ve-tag';
</script>

<section style="min-height:104px;display:flex;align-items:center;justify-content:center;flex-wrap:wrap;gap:8px;padding:16px;">
  <ve-tag status="success">Ready</ve-tag>
  <ve-tag status="warning">Review</ve-tag>
  <ve-tag status="error">Blocked</ve-tag>
</section>
```

### 尺寸

`size` 支持 `small`、`medium`、`default`、`large`。

```html preview
<script type="module">
  import '@ve-design/web/ve-tag';
</script>

<section style="min-height:104px;display:flex;align-items:center;justify-content:center;flex-wrap:wrap;gap:8px;padding:16px;">
  <ve-tag size="small">Small</ve-tag>
  <ve-tag size="medium">Medium</ve-tag>
  <ve-tag size="default">Default</ve-tag>
  <ve-tag size="large">Large</ve-tag>
</section>
```

### 状态尺寸

状态标签会随尺寸同步调整图标和文本比例。

```html preview
<script type="module">
  import '@ve-design/web/ve-tag';
</script>

<section style="min-height:176px;display:grid;place-items:center;gap:12px;padding:16px;">
  <div style="display:flex;align-items:center;justify-content:center;flex-wrap:wrap;gap:8px;">
    <ve-tag size="small" status="success">Ready</ve-tag>
    <ve-tag size="small" status="warning">Review</ve-tag>
    <ve-tag size="small" status="error">Blocked</ve-tag>
  </div>
  <div style="display:flex;align-items:center;justify-content:center;flex-wrap:wrap;gap:8px;">
    <ve-tag size="medium" status="success">Ready</ve-tag>
    <ve-tag size="medium" status="warning">Review</ve-tag>
    <ve-tag size="medium" status="error">Blocked</ve-tag>
  </div>
  <div style="display:flex;align-items:center;justify-content:center;flex-wrap:wrap;gap:8px;">
    <ve-tag status="success">Ready</ve-tag>
    <ve-tag status="warning">Review</ve-tag>
    <ve-tag status="error">Blocked</ve-tag>
  </div>
  <div style="display:flex;align-items:center;justify-content:center;flex-wrap:wrap;gap:8px;">
    <ve-tag size="large" status="success">Ready</ve-tag>
    <ve-tag size="large" status="warning">Review</ve-tag>
    <ve-tag size="large" status="error">Blocked</ve-tag>
  </div>
</section>
```

### 自定义图标

`icon` 插槽会覆盖状态默认图标，图标颜色默认继承标签前景色。

```html preview
<script type="module">
  import '@ve-design/web/ve-tag';
  import '@ve-design/web/ve-icon';
  import '@ve-design/web/icons/robot';
  import '@ve-design/web/icons/sync';
</script>

<section style="min-height:104px;display:flex;align-items:center;justify-content:center;flex-wrap:wrap;gap:8px;padding:16px;">
  <ve-tag status="success">
    <ve-icon slot="icon" name="robot" aria-hidden="true"></ve-icon>
    Agent ready
  </ve-tag>
  <ve-tag status="warning">
    <ve-icon slot="icon" name="sync" aria-hidden="true"></ve-icon>
    Syncing
  </ve-tag>
</section>
```

### 自定义颜色

`color` 控制文字与图标颜色，`bg-color` 控制背景色；它们优先于 `status` 默认颜色。

```html preview
<script type="module">
  import '@ve-design/web/ve-tag';
</script>

<section style="min-height:104px;display:flex;align-items:center;justify-content:center;flex-wrap:wrap;gap:8px;padding:16px;">
  <ve-tag status="success" color="#5c4ef5" bg-color="#f0ebff">Custom success</ve-tag>
  <ve-tag status="warning" color="#0d4bdb" bg-color="#eaf2ff">Custom warning</ve-tag>
  <ve-tag color="#6d28d9" bg-color="#f3e8ff">Custom</ve-tag>
</section>
```

### 边框

`bordered` 用于展示带边框的标签。

```html preview
<script type="module">
  import '@ve-design/web/ve-tag';
</script>

<section style="min-height:104px;display:flex;align-items:center;justify-content:center;flex-wrap:wrap;gap:8px;padding:16px;">
  <ve-tag bordered>Default</ve-tag>
  <ve-tag bordered status="success">Ready</ve-tag>
  <ve-tag bordered status="warning">Review</ve-tag>
  <ve-tag bordered status="error">Blocked</ve-tag>
  <ve-tag bordered status="success" color="#6d28d9">Custom route</ve-tag>
</section>
```

### 可关闭标签

`closable` 展示关闭按钮，点击后触发 `ve-close`。

```html preview
<script type="module">
  import '@ve-design/web/ve-tag';
</script>

<section style="min-height:144px;display:grid;place-items:center;padding:16px;">
  <div style="display:grid;justify-items:center;gap:12px;">
    <div style="display:flex;flex-wrap:wrap;justify-content:center;gap:8px;">
      <ve-tag class="removable-tag" closable>Retrieval</ve-tag>
      <ve-tag class="removable-tag" closable status="success">Browser</ve-tag>
      <ve-tag class="removable-tag" closable status="warning">Human review</ve-tag>
      <ve-tag class="removable-tag" closable status="error">Blocked</ve-tag>
    </div>
    <code id="tag-close-log" style="color:var(--color-text-tertiary);">4 tags active</code>
  </div>
</section>

<script>
  const tags = document.querySelectorAll('.removable-tag');
  const log = document.getElementById('tag-close-log');

  tags.forEach((tag) => {
    tag.addEventListener('ve-close', () => {
      tag.remove();
      log.textContent = `${document.querySelectorAll('.removable-tag').length} tags active`;
    });
  });
</script>
```

## API

### ve-tag 属性

| 属性名 | 描述 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `color` | 标签前景色，影响文字、图标和关闭图标；优先级高于 `status` 默认前景色。 | `string` | `''` |
| `bg-color` | 标签背景色；优先级高于 `status` 默认背景色。 | `string` | `''` |
| `status` | 语义状态，设置后展示默认图标、状态文字色和状态背景色。 | `'success' \| 'warning' \| 'error' \| ''` | `''` |
| `size` | 标签尺寸。 | `'small' \| 'medium' \| 'default' \| 'large'` | `'default'` |
| `closable` | 是否展示关闭按钮。 | `boolean` | `false` |
| `bordered` | 是否展示边框。 | `boolean` | `false` |

### ve-tag 事件

| 事件名 | 描述 | 参数类型 |
| --- | --- | --- |
| `ve-close` | 点击关闭按钮时触发，可通过 `event.detail.sourceEvent` 获取原始鼠标事件。 | `CustomEvent<{ sourceEvent: MouseEvent }>` |

### ve-tag 插槽

| 插槽名 | 描述 |
| --- | --- |
| 默认插槽 | 标签内容，可放置文本或内联内容。 |
| `icon` | 标签前置图标；设置后优先于 `status` 默认图标。 |
