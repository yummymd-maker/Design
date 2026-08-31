`ve-button` 用于触发即时操作，支持类型、尺寸、形状、状态、禁用、加载、长按钮和链接模式。

## 何时使用

- 触发提交、保存、确认、取消、跳转等明确动作。
- 通过 `type` 区分操作优先级，通过 `status` 表达成功、警告或危险语义。
- 需要搭配图标、禁用、加载或链接状态使用。

## 引入组件

```ts
import '@ve-design/web/ve-button';
```

## 示例

### 基础用法

使用 `type` 设置按钮类型。

```html preview
<script type="module">
  import '@ve-design/web/ve-button';
  import '@ve-design/web/icons/add';
  import '@ve-design/web/icons/arrow-right-md';
  import '@ve-design/web/icons/download';
  import '@ve-design/web/icons/edit';
  import '@ve-design/web/icons/share';
</script>

<section style="display:flex; flex-wrap:wrap; gap:14px 24px; justify-content:center; align-items:center; padding:32px">
  <ve-button type="primary">
    <ve-icon name="add"></ve-icon>
    <span>Create</span>
  </ve-button>
  <ve-button type="secondary">
    <ve-icon name="edit"></ve-icon>
    <span>Edit</span>
  </ve-button>
  <ve-button type="outline-filled">
    <ve-icon name="download"></ve-icon>
    <span>Export</span>
  </ve-button>
  <ve-button type="outline">
    <span>Cancel</span>
  </ve-button>
  <ve-button type="text">
    <span>More</span>
    <ve-icon name="arrow-right-md"></ve-icon>
  </ve-button>
  <ve-button type="text">
    <ve-icon name="share"></ve-icon>
  </ve-button>
</section>
```

### 按钮尺寸

使用 `size` 设置按钮尺寸。

```html preview
<script type="module">
  import '@ve-design/web/ve-button';
  import '@ve-design/web/icons/add';
  import '@ve-design/web/icons/download';
  import '@ve-design/web/icons/edit';
</script>

<section style="display:grid; gap:16px; justify-content:center; padding:32px">
  <div style="display:flex; gap:24px; justify-content:center; align-items:center">
    <ve-button size="small" type="primary">
      <ve-icon name="add"></ve-icon>
      <span>Small</span>
    </ve-button>
    <ve-button size="small" type="secondary">
      <ve-icon name="edit"></ve-icon>
      <span>Small</span>
    </ve-button>
    <ve-button size="small" type="outline-filled">
      <ve-icon name="download"></ve-icon>
      <span>Small</span>
    </ve-button>
  </div>

  <div style="display:flex; gap:24px; justify-content:center; align-items:center">
    <ve-button size="default" type="primary">
      <ve-icon name="add"></ve-icon>
      <span>Default</span>
    </ve-button>
    <ve-button size="default" type="secondary">
      <ve-icon name="edit"></ve-icon>
      <span>Default</span>
    </ve-button>
    <ve-button size="default" type="outline-filled">
      <ve-icon name="download"></ve-icon>
      <span>Default</span>
    </ve-button>
  </div>

  <div style="display:flex; gap:24px; justify-content:center; align-items:center">
    <ve-button size="large" type="primary">
      <ve-icon name="add"></ve-icon>
      <span>Large</span>
    </ve-button>
    <ve-button size="large" type="secondary">
      <ve-icon name="edit"></ve-icon>
      <span>Large</span>
    </ve-button>
    <ve-button size="large" type="outline-filled">
      <ve-icon name="download"></ve-icon>
      <span>Large</span>
    </ve-button>
  </div>
</section>
```

### 状态按钮

使用 `status` 表达操作结果或风险等级。

```html preview
<script type="module">
  import '@ve-design/web/ve-button';
  import '@ve-design/web/icons/check-circle';
  import '@ve-design/web/icons/error';
  import '@ve-design/web/icons/warning';
</script>

<section style="display:grid; gap:16px; justify-content:center; padding:32px">
  <div style="display:flex; gap:24px; justify-content:center; align-items:center">
    <ve-button type="primary" status="success">
      <ve-icon name="check-circle"></ve-icon>
      <span>Primary</span>
    </ve-button>
    <ve-button type="secondary" status="success">
      <ve-icon name="check-circle"></ve-icon>
      <span>Secondary</span>
    </ve-button>
    <ve-button type="outline-filled" status="success">
      <ve-icon name="check-circle"></ve-icon>
      <span>Filled</span>
    </ve-button>
    <ve-button type="outline" status="success">
      <ve-icon name="check-circle"></ve-icon>
      <span>Outline</span>
    </ve-button>
    <ve-button type="text" status="success">
      <ve-icon name="check-circle"></ve-icon>
      <span>Text</span>
    </ve-button>
  </div>

  <div style="display:flex; gap:24px; justify-content:center; align-items:center">
    <ve-button type="primary" status="warning">
      <ve-icon name="warning"></ve-icon>
      <span>Primary</span>
    </ve-button>
    <ve-button type="secondary" status="warning">
      <ve-icon name="warning"></ve-icon>
      <span>Secondary</span>
    </ve-button>
    <ve-button type="outline-filled" status="warning">
      <ve-icon name="warning"></ve-icon>
      <span>Filled</span>
    </ve-button>
    <ve-button type="outline" status="warning">
      <ve-icon name="warning"></ve-icon>
      <span>Outline</span>
    </ve-button>
    <ve-button type="text" status="warning">
      <ve-icon name="warning"></ve-icon>
      <span>Text</span>
    </ve-button>
  </div>

  <div style="display:flex; gap:24px; justify-content:center; align-items:center">
    <ve-button type="primary" status="danger">
      <ve-icon name="error"></ve-icon>
      <span>Primary</span>
    </ve-button>
    <ve-button type="secondary" status="danger">
      <ve-icon name="error"></ve-icon>
      <span>Secondary</span>
    </ve-button>
    <ve-button type="outline-filled" status="danger">
      <ve-icon name="error"></ve-icon>
      <span>Filled</span>
    </ve-button>
    <ve-button type="outline" status="danger">
      <ve-icon name="error"></ve-icon>
      <span>Outline</span>
    </ve-button>
    <ve-button type="text" status="danger">
      <ve-icon name="error"></ve-icon>
      <span>Text</span>
    </ve-button>
  </div>
</section>
```

### 按钮形状

使用 `shape` 设置按钮形状。

```html preview
<script type="module">
  import '@ve-design/web/ve-button';
  import '@ve-design/web/icons/add';
  import '@ve-design/web/icons/edit';
  import '@ve-design/web/icons/more-horizontal';
</script>

<section style="display:flex; flex-wrap:wrap; gap:14px 24px; justify-content:center; align-items:center; padding:32px">
  <ve-button type="primary">
    <ve-icon name="add"></ve-icon>
    <span>Default</span>
  </ve-button>
  <ve-button type="secondary" shape="round">
    <ve-icon name="edit"></ve-icon>
    <span>Round</span>
  </ve-button>
  <ve-button type="outline-filled" shape="circle" aria-label="Add">
    <ve-icon name="add"></ve-icon>
  </ve-button>
  <ve-button type="text" shape="circle" aria-label="More actions">
    <ve-icon name="more-horizontal"></ve-icon>
  </ve-button>
</section>
```

### 默认插槽

默认插槽支持文本、图标或组合内容。

```html preview
<script type="module">
  import '@ve-design/web/ve-button';
  import '@ve-design/web/icons/add';
  import '@ve-design/web/icons/download';
  import '@ve-design/web/icons/warning';
</script>

<section style="display:flex; flex-wrap:wrap; gap:14px 24px; justify-content:center; align-items:center; padding:32px">
  <ve-button type="primary">
    <ve-icon name="add"></ve-icon>
    <span>Create Task</span>
  </ve-button>
  <ve-button type="outline-filled">
    <ve-icon name="download"></ve-icon>
    <span>Download</span>
  </ve-button>
  <ve-button type="secondary" status="danger">
    <ve-icon name="warning"></ve-icon>
    <span>Stop Run</span>
  </ve-button>
</section>
```

### 禁用和加载

使用 `disabled` 禁用按钮，使用 `loading` 表示处理中。

```html preview
<script type="module">
  import '@ve-design/web/ve-button';
  import '@ve-design/web/icons/close';
  import '@ve-design/web/icons/warning';
</script>

<section style="display:flex; flex-wrap:wrap; gap:14px 24px; justify-content:center; align-items:center; padding:32px">
  <ve-button type="primary" disabled>
    <ve-icon name="close"></ve-icon>
    <span>Disabled</span>
  </ve-button>
  <ve-button type="secondary" status="warning" disabled>
    <ve-icon name="warning"></ve-icon>
    <span>Pending</span>
  </ve-button>
  <ve-button type="primary" loading>Submitting</ve-button>
  <ve-button type="outline-filled" status="danger" loading>Deleting</ve-button>
</section>
```

### 长按钮

使用 `long` 让按钮撑满容器宽度。

```html preview
<script type="module">
  import '@ve-design/web/ve-button';
  import '@ve-design/web/icons/check';
  import '@ve-design/web/icons/close';
  import '@ve-design/web/icons/edit';
</script>

<section style="display:grid; gap:12px; width:min(100%, 360px); margin:0 auto; padding:24px">
  <ve-button type="primary" long>
    <ve-icon name="check"></ve-icon>
    <span>Confirm</span>
  </ve-button>
  <ve-button type="secondary" long>
    <ve-icon name="edit"></ve-icon>
    <span>Save Draft</span>
  </ve-button>
  <ve-button type="outline-filled" long>
    <ve-icon name="close"></ve-icon>
    <span>Cancel</span>
  </ve-button>
</section>
```

### 跳转链接

设置 `href` 后按钮以链接方式工作。

```html preview
<script type="module">
  import '@ve-design/web/ve-button';
  import '@ve-design/web/icons/arrow-right-md';
  import '@ve-design/web/icons/book-open-01';
</script>

<section style="display:flex; flex-wrap:wrap; gap:14px 24px; justify-content:center; align-items:center; padding:32px">
  <ve-button type="primary" href="https://www.example.com" target="_blank">
    <ve-icon name="book-open-01"></ve-icon>
    <span>Open VeDesign</span>
  </ve-button>
  <ve-button type="text" href="https://lit.dev" target="_blank">
    <span>Lit Docs</span>
    <ve-icon name="arrow-right-md"></ve-icon>
  </ve-button>
</section>
```

### 点击事件

按钮会透出原生 `click` 事件。

```html preview
<script type="module">
  import '@ve-design/web/ve-button';
  import '@ve-design/web/icons/add';
  import '@ve-design/web/icons/minus';
</script>

<section style="display:flex; gap:12px; align-items:center; justify-content:center; padding:32px">
  <ve-button id="button-event-sub" type="secondary" aria-label="Decrease">
    <ve-icon name="minus"></ve-icon>
  </ve-button>
  <output id="button-event-value" style="display:inline-grid; place-items:center; min-width:44px; height:32px; border:1px solid var(--color-border-default); border-radius:8px; font-variant-numeric:tabular-nums">0</output>
  <ve-button id="button-event-add" type="primary" aria-label="Increase">
    <ve-icon name="add"></ve-icon>
  </ve-button>
</section>

<script>
  const addButton = document.getElementById('button-event-add');
  const subButton = document.getElementById('button-event-sub');
  const value = document.getElementById('button-event-value');
  let count = 0;

  const updateValue = () => {
    value.textContent = String(count);
  };

  addButton.addEventListener('click', () => {
    count += 1;
    updateValue();
  });

  subButton.addEventListener('click', () => {
    count -= 1;
    updateValue();
  });
</script>
```

## API

### 属性

| 属性名     | 描述                             | 类型                                                | 默认值      |
| ---------- | -------------------------------- | --------------------------------------------------- | ----------- |
| `type`     | 按钮类型                         | `'primary' \| 'secondary' \| 'outline' \| 'outline-filled' \| 'text'` | `'primary'` |
| `size`     | 按钮尺寸                         | `'small' \| 'default' \| 'large'`                   | `'default'` |
| `shape`    | 按钮形状                         | `'default' \| 'round' \| 'circle'`                  | `'default'` |
| `status`   | 按钮状态                         | `'default' \| 'success' \| 'warning' \| 'danger'`   | `'default'` |
| `disabled` | 是否禁用                         | `boolean`                                           | `false`     |
| `loading`  | 是否加载中                       | `boolean`                                           | `false`     |
| `long`     | 是否为长按钮                     | `boolean`                                           | `false`     |
| `href`     | 跳转链接地址；存在时进入链接模式 | `string`                                            | `''`        |
| `target`   | 链接打开方式                     | `'_blank' \| '_self' \| '_parent' \| '_top'`        | `'_self'`   |

### 事件

| 事件名  | 描述                                           | 参数类型     |
| ------- | ---------------------------------------------- | ------------ |
| `click` | 点击按钮时触发，会从按钮控件冒泡到组件宿主 | `MouseEvent` |

### 插槽

| 插槽名    | 描述                                             |
| --------- | ------------------------------------------------ |
| `default` | 默认内容插槽，用于传入文字、图标或任意自定义内容 |
