`ve-link` 用于页面跳转或文本导航，支持状态色和禁用态。

## 何时使用

- 在文本中提供轻量跳转入口。
- 通过 `status` 表达 primary、成功、警告或错误语义。
- 需要禁用链接，临时阻止跳转或点击时。

## 引入组件

```ts
import '@ve-design/web/ve-link';
```

## 示例

### 基础用法

使用 `href` 设置跳转地址。

```html preview
<script type="module">
  import '@ve-design/web/ve-link';
  import '@ve-design/web/icons/arrow-right-sm';
  import '@ve-design/web/icons/book-open-01';
  import '@ve-design/web/icons/link';
</script>

<section style="display:grid; grid-template-columns:repeat(2, minmax(120px, max-content)); gap:16px; justify-content:center; justify-items:center; align-items:center; padding:32px">
  <ve-link href="https://www.example.com" target="_blank">
    <span style="display:inline-flex; align-items:center; gap:4px">
      <ve-icon name="book-open-01"></ve-icon>
      <span>VeDesign</span>
    </span>
  </ve-link>
  <ve-link href="https://lit.dev" target="_blank">
    <span style="display:inline-flex; align-items:center; gap:4px">
      <ve-icon name="link"></ve-icon>
      <span>Lit Docs</span>
      <ve-icon name="arrow-right-sm"></ve-icon>
    </span>
  </ve-link>
</section>
```

### 链接状态

使用 `status` 设置链接状态色。

```html preview
<script type="module">
  import '@ve-design/web/ve-link';
</script>

<section style="display:grid; grid-template-columns:repeat(5, minmax(104px, max-content)); gap:16px; justify-content:center; justify-items:center; align-items:center; padding:32px">
  <ve-link href="https://www.example.com">
    Default
  </ve-link>
  <ve-link status="primary" href="https://www.example.com">
    Primary
  </ve-link>
  <ve-link status="success" href="https://www.example.com">
    Success
  </ve-link>
  <ve-link status="warning" href="https://www.example.com">
    Warning
  </ve-link>
  <ve-link status="error" href="https://www.example.com">
    Error
  </ve-link>
</section>
```

### 虚线下划线

使用 `underline` 显示虚线下划线。

```html preview
<script type="module">
  import '@ve-design/web/ve-link';
</script>

<section style="display:grid; grid-template-columns:repeat(5, minmax(104px, max-content)); gap:16px; justify-content:center; justify-items:center; align-items:center; padding:32px">
  <ve-link underline href="https://www.example.com">
    Default
  </ve-link>
  <ve-link underline status="primary" href="https://www.example.com">
    Primary
  </ve-link>
  <ve-link underline status="success" href="https://www.example.com">
    Success
  </ve-link>
  <ve-link underline status="warning" href="https://www.example.com">
    Warning
  </ve-link>
  <ve-link underline status="error" href="https://www.example.com">
    Error
  </ve-link>
</section>
```

### 禁用状态

使用 `disabled` 禁用链接。

```html preview
<script type="module">
  import '@ve-design/web/ve-link';
  import '@ve-design/web/icons/check-circle';
  import '@ve-design/web/icons/close';
  import '@ve-design/web/icons/error';
  import '@ve-design/web/icons/warning';
</script>

<section style="display:grid; grid-template-columns:repeat(4, minmax(132px, max-content)); gap:16px; justify-content:center; justify-items:center; align-items:center; padding:32px">
  <ve-link disabled href="https://www.example.com">
    <span style="display:inline-flex; align-items:center; gap:4px">
      <ve-icon name="close"></ve-icon>
      <span>Disabled</span>
    </span>
  </ve-link>
  <ve-link disabled status="success" href="https://www.example.com">
    <span style="display:inline-flex; align-items:center; gap:4px">
      <ve-icon name="check-circle"></ve-icon>
      <span>Success</span>
    </span>
  </ve-link>
  <ve-link disabled status="warning" href="https://www.example.com">
    <span style="display:inline-flex; align-items:center; gap:4px">
      <ve-icon name="warning"></ve-icon>
      <span>Warning</span>
    </span>
  </ve-link>
  <ve-link disabled status="error" href="https://www.example.com">
    <span style="display:inline-flex; align-items:center; gap:4px">
      <ve-icon name="error"></ve-icon>
      <span>Error</span>
    </span>
  </ve-link>
</section>
```

### 自定义内容

默认插槽支持文本、图标或其他行内内容。

```html preview
<script type="module">
  import '@ve-design/web/ve-link';
  import '@ve-design/web/icons/arrow-right-md';
  import '@ve-design/web/icons/download';
  import '@ve-design/web/icons/file-check';
</script>

<section style="display:grid; grid-template-columns:repeat(2, minmax(148px, max-content)); gap:16px; justify-content:center; justify-items:center; align-items:center; padding:32px">
  <ve-link href="https://www.example.com" target="_blank">
    <span style="display:inline-flex; align-items:center; gap:4px">
      <ve-icon name="download"></ve-icon>
      <span>Download</span>
      <ve-icon name="arrow-right-md"></ve-icon>
    </span>
  </ve-link>
  <ve-link status="success" href="https://www.example.com">
    <span style="display:inline-flex; align-items:center; gap:4px">
      <ve-icon name="file-check"></ve-icon>
      <span>View Report</span>
    </span>
  </ve-link>
</section>
```

### 点击事件

组件透出原生 `click` 事件。

```html preview
<script type="module">
  import '@ve-design/web/ve-link';
  import '@ve-design/web/icons/add';
</script>

<section style="display:flex; gap:12px; align-items:center; justify-content:center; padding:32px">
  <ve-link id="link-event" href="https://www.example.com">
    <span style="display:inline-flex; align-items:center; gap:4px">
      <ve-icon name="add"></ve-icon>
      <span>Count Click</span>
    </span>
  </ve-link>
  <output id="link-event-count" style="display:inline-grid; place-items:center; min-width:44px; height:28px; border:1px solid var(--color-border-default); border-radius:8px; font-variant-numeric:tabular-nums">0</output>
</section>

<script>
  const link = document.getElementById('link-event');
  const countNode = document.getElementById('link-event-count');
  let count = 0;

  link.addEventListener('click', (event) => {
    event.preventDefault();
    count += 1;
    countNode.textContent = String(count);
  });
</script>
```

## API

### 属性

| 属性名     | 描述                               | 类型                                 | 默认值      |
| ---------- | ---------------------------------- | ------------------------------------ | ----------- |
| `href`     | 跳转地址                           | `string`                             | `''`        |
| `target`   | 链接打开方式                       | `'_blank' \| '_self' \| '_parent' \| '_top' \| string` | `'_self'`   |
| `status`   | 链接状态色                         | `'primary' \| 'success' \| 'warning' \| 'error'` | `undefined` |
| `disabled` | 是否禁用                           | `boolean`                            | `false`     |
| `underline` | 是否显示跟随状态色的虚线下划线     | `boolean`                            | `false`     |

### 事件

| 事件名  | 描述                              | 参数类型     |
| ------- | --------------------------------- | ------------ |
| `click` | 点击可用链接时触发原生点击事件。  | `MouseEvent` |

### 方法

| 方法名    | 描述           |
| --------- | -------------- |
| `focus()` | 聚焦链接元素。 |

### 插槽

| 插槽名    | 描述                         |
| --------- | ---------------------------- |
| `default` | 默认内容插槽，用于链接内容和自定义布局。 |
