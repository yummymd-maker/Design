`ve-input` 用于文本输入，支持单行输入、文本域、清空、校验状态、字数限制、自适应高度和前后缀内容。

## 何时使用

- 录入短文本或多行说明。
- 需要清空、禁用、校验状态或字数限制。
- 需要通过 `prefix`、`suffix` 补充输入上下文。

## 引入组件

```ts
import '@ve-design/web/ve-input';
```

## 示例

### 基础用法

使用 `value`、`default-value`、`placeholder` 控制输入内容。

```html preview
<script type="module">
  import '@ve-design/web/ve-input';
  import '@ve-design/web/icons/search';
</script>

<section style="display: grid; place-items: center; padding: 24px;">
  <div style="display: grid; gap: 12px; width: min(100%, 360px);">
    <ve-input value="Support Assistant">
      <ve-icon slot="prefix" name="search"></ve-icon>
    </ve-input>
    <ve-input default-value="Daily build summary"></ve-input>
    <ve-input placeholder="Enter prompt title"></ve-input>
  </div>
</section>
```

### 输入类型

`type` 支持 `text` 和 `textarea`。

```html preview
<script type="module">
  import '@ve-design/web/ve-input';
  import '@ve-design/web/icons/key';
</script>

<section style="display: grid; place-items: center; padding: 24px;">
  <div style="display: grid; gap: 12px; width: min(100%, 360px);">
    <ve-input value="workspace-name">
      <ve-icon slot="prefix" name="key"></ve-icon>
    </ve-input>
    <ve-input
      type="textarea"
      rows="3"
      value="Summarize the issue and propose the next action."
    ></ve-input>
  </div>
</section>
```

### 尺寸

`size` 控制输入框尺寸。

```html preview
<script type="module">
  import '@ve-design/web/ve-input';
</script>

<section style="display: grid; place-items: center; padding: 24px;">
  <div style="display: grid; gap: 12px; width: min(100%, 360px);">
    <ve-input size="small" placeholder="Small"></ve-input>
    <ve-input size="default" placeholder="Default"></ve-input>
    <ve-input size="large" placeholder="Large"></ve-input>
  </div>
</section>
```

### 状态

`status` 展示校验状态。

```html preview
<script type="module">
  import '@ve-design/web/ve-input';
</script>

<section style="display: grid; place-items: center; padding: 24px;">
  <div style="display: grid; gap: 12px; width: min(100%, 360px);">
    <ve-input status="success" placeholder="Ready"></ve-input>
    <ve-input status="warning" placeholder="Review required"></ve-input>
    <ve-input status="error" placeholder="Missing provider"></ve-input>
    <ve-input
      type="textarea"
      rows="3"
      status="error"
      value="The provider field is required before publishing."
    ></ve-input>
  </div>
</section>
```

### 清空和禁用

`clearable` 展示清空按钮，`disabled` 禁用输入。

```html preview
<script type="module">
  import '@ve-design/web/ve-input';
</script>

<section style="display: grid; place-items: center; padding: 24px;">
  <div style="display: grid; gap: 12px; width: min(100%, 360px);">
    <ve-input value="disable clear all"></ve-input>
    <ve-input clearable value="enable clear all"></ve-input>
    <ve-input disabled value="Locked by workspace policy"></ve-input>
  </div>
</section>
```

### 字数限制

`max-length` 设置最大字符数，`word-limit` 控制字数展示。

```html preview
<script type="module">
  import '@ve-design/web/ve-input';
</script>

<section style="display: grid; place-items: center; padding: 24px;">
  <div style="display: grid; gap: 12px; width: min(100%, 360px);">
    <ve-input
      max-length="32"
      word-limit="inside"
      value="Agent launch checklist"
    ></ve-input>
    <ve-input
      type="textarea"
      max-length="160"
      word-limit="outside"
      value="Summarize the source ticket, cite the evidence, and propose one next action."
    ></ve-input>
  </div>
</section>
```

### 自适应

`auto-size` 用于文本域自适应高度，`auto-width` 用于单行输入自适应宽度。

```html preview
<script type="module">
  import '@ve-design/web/ve-input';
</script>

<section style="display: grid; place-items: center; padding: 24px;">
  <div style="display: grid; gap: 12px; width: min(100%, 360px);">
    <ve-input
      type="textarea"
      auto-size='{"minRows":3,"maxRows":6}'
      value="Write a short agent instruction."
    ></ve-input>
    <div style="display: flex; justify-content: center;">
      <ve-input
        auto-width='{"minWidth":120,"maxWidth":320}'
        value="production-agent-build"
      ></ve-input>
    </div>
  </div>
</section>
```

### 前后缀

`prefix` 和 `suffix` 显示在输入框内。

```html preview
<script type="module">
  import '@ve-design/web/ve-input';
  import '@ve-design/web/icons/search';
</script>

<section
  style="display: flex; flex-wrap: wrap; gap: 16px 112px; justify-content: center; align-items: center; padding: 24px;"
>
  <ve-input placeholder="请输入" style="width: 360px;">
    <ve-icon slot="prefix" name="search"></ve-icon>
  </ve-input>

  <ve-input style="width: 360px;">
    <span slot="prefix">Https://</span>
  </ve-input>

  <ve-input status="error" style="width: 360px;">
    <span slot="prefix">Https://</span>
  </ve-input>

  <ve-input style="width: 360px;">
    <span slot="suffix">.com</span>
  </ve-input>

  <ve-input status="error" style="width: 360px;">
    <span slot="suffix">.com</span>
  </ve-input>
</section>
```

### 事件

`ve-input` 实时触发，`ve-change` 在提交变化时触发。

```html preview
<script type="module">
  import '@ve-design/web/ve-input';
</script>

<section style="display: grid; place-items: center; padding: 24px;">
  <div style="display: grid; gap: 12px; width: min(100%, 360px);">
    <ve-input id="event-input" placeholder="Agent title"></ve-input>
    <code id="event-log" style="color: var(--color-text-secondary);">Waiting for input</code>
  </div>
</section>

<script>
  const input = document.getElementById('event-input');
  const log = document.getElementById('event-log');

  input.addEventListener('ve-input', (event) => {
    log.textContent = `Typing: ${event.detail.value}`;
  });

  input.addEventListener('ve-change', (event) => {
    log.textContent = `Submitted: ${event.detail.value}`;
  });
</script>
```

### 方法

`focus()` 和 `blur()` 控制输入控件焦点。

```html preview
<script type="module">
  import '@ve-design/web/ve-button';
  import '@ve-design/web/ve-input';
</script>

<section style="display: grid; place-items: center; padding: 24px;">
  <div
    style="display: flex; flex-wrap: wrap; gap: 8px; justify-content: center;"
  >
    <ve-input
      id="focus-input"
      placeholder="Agent name"
      style="width: min(100%, 360px);"
    ></ve-input>
    <ve-button id="focus-button" type="outline">Focus</ve-button>
    <ve-button id="blur-button" type="text">Blur</ve-button>
  </div>
</section>

<script>
  const field = document.getElementById('focus-input');
  document
    .getElementById('focus-button')
    .addEventListener('click', () => field.focus());
  document
    .getElementById('blur-button')
    .addEventListener('click', () => field.blur());
</script>
```

## API

### ve-input 属性

| 属性名          | 描述                                               | 类型                                                                                  | 默认值      |
| --------------- | -------------------------------------------------- | ------------------------------------------------------------------------------------- | ----------- |
| `value`         | 当前输入值。                                       | `string`                                                                              | `''`        |
| `default-value` | 初始输入值。                                       | `string`                                                                              | `''`        |
| `type`          | 输入类型。                                         | `'text' &#124; 'textarea'`                                                            | `'text'`    |
| `placeholder`   | 占位文本。                                         | `string`                                                                              | `''`        |
| `size`          | 输入框尺寸。                                       | `'small' &#124; 'default' &#124; 'large'`                                             | `'default'` |
| `status`        | 校验状态。                                         | `'default' &#124; 'success' &#124; 'warning' &#124; 'error'`                          | `'default'` |
| `disabled`      | 是否禁用。                                         | `boolean`                                                                             | `false`     |
| `clearable`     | 是否展示清空按钮。                                 | `boolean`                                                                             | `false`     |
| `max-length`    | 最大字符数；对象形式支持 `length` 和 `errorOnly`。 | `number &#124; { length: number; errorOnly?: boolean } &#124; undefined`              | `undefined` |
| `word-limit`    | 字数统计展示方式；单行输入启用时固定展示在输入框内。   | `'hidden' &#124; 'inside' &#124; 'outside'`                                           | `'hidden'`  |
| `rows`          | 文本域行数，未启用 `auto-size` 时生效。            | `number`                                                                              | `2`         |
| `auto-size`     | 文本域自适应高度配置。                             | `boolean &#124; { minRows?: number; maxRows?: number }`                               | `false`     |
| `auto-width`    | 单行输入自适应宽度配置。                           | `boolean &#124; { minWidth?: number &#124; string; maxWidth?: number &#124; string }` | `false`     |

### ve-input 事件

| 事件名      | 描述                   | 参数类型                                                                 |
| ----------- | ---------------------- | ------------------------------------------------------------------------ |
| `ve-input`  | 输入值实时变化时触发。 | `CustomEvent<{ value: string; oldValue: string; source: 'input' &#124; 'clear'; sourceEvent?: Event }>` |
| `ve-change` | 输入值提交变化时触发。 | `CustomEvent<{ value: string; oldValue: string; source: 'input' &#124; 'clear'; sourceEvent?: Event }>` |

### ve-input 方法

| 方法名                          | 描述                     |
| ------------------------------- | ------------------------ |
| `focus(options?: FocusOptions)` | 聚焦输入控件。   |
| `blur()`                        | 让输入控件失焦。 |

### ve-input 插槽

| 插槽名   | 描述                 |
| -------- | -------------------- |
| `prefix` | 输入框内前缀内容。 |
| `suffix` | 输入框内后缀内容。 |
