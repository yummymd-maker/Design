`ve-digital-input` 用于输入或调整数值内容，适用于数量、额度、权重、轮次、并发数等数字类信息填写场景。

## 何时使用

- 需要用户录入一个明确的数值。
- 需要通过加减按钮以固定步长调整数值。
- 需要限制最小值、最大值或保留小数精度。
- 需要展示禁用、错误或辅助说明状态。

## 引入组件

```ts
import '@ve-design/web/ve-digital-input';
```

## 示例

### 基础用法

使用 `value` 或 `default-value` 设置数值。左右按钮分别按 `step` 增加或减少。

```html preview
<script type="module">
  import '@ve-design/web/ve-digital-input';
</script>

<section style="display: grid; place-items: center; padding: 24px;">
  <div style="display: grid; gap: 12px; width: min(100%, 240px);">
    <ve-digital-input value="0"></ve-digital-input>
    <ve-digital-input default-value="8"></ve-digital-input>
  </div>
</section>
```

### 尺寸

`size` 用于切换输入框的视觉尺寸，适配紧凑、默认和较大表单布局。

```html preview
<script type="module">
  import '@ve-design/web/ve-digital-input';
</script>

<section style="display: grid; place-items: center; padding: 24px;">
  <div style="display: grid; gap: 12px; width: min(100%, 240px);">
    <ve-digital-input size="large" value="36"></ve-digital-input>
    <ve-digital-input size="default" value="32"></ve-digital-input>
    <ve-digital-input size="small" value="28"></ve-digital-input>
  </div>
</section>
```

### 范围和步进

使用 `min`、`max` 和 `step` 控制可输入范围与按钮步长。达到边界时，对应加减按钮进入禁用状态。

```html preview
<script type="module">
  import '@ve-design/web/ve-digital-input';
</script>

<section style="display: grid; place-items: center; padding: 24px;">
  <div style="display: grid; gap: 12px; width: min(100%, 240px);">
    <ve-digital-input min="0" max="10" step="1" value="4"></ve-digital-input>
    <ve-digital-input min="0" max="100" step="5" value="25"></ve-digital-input>
  </div>
</section>
```

### 小数精度

`precision` 用于限制小数位数。按钮步进和手动输入都会按相同精度格式化。

```html preview
<script type="module">
  import '@ve-design/web/ve-digital-input';
</script>

<section style="display: grid; place-items: center; padding: 24px;">
  <div style="display: grid; gap: 12px; width: min(100%, 240px);">
    <ve-digital-input step="0.5" precision="1" value="2.5"></ve-digital-input>
    <ve-digital-input step="0.01" precision="2" value="0.75"></ve-digital-input>
  </div>
</section>
```

### 禁用

`disabled` 禁用输入框和左右加减按钮。

```html preview
<script type="module">
  import '@ve-design/web/ve-digital-input';
</script>

<section style="display: grid; place-items: center; padding: 24px;">
  <div style="display: grid; gap: 12px; width: min(100%, 240px);">
    <ve-digital-input disabled value="0"></ve-digital-input>
    <ve-digital-input min="0" max="8" value="8"></ve-digital-input>
  </div>
</section>
```

### 状态和说明

`status="error"` 展示错误态；`description` 用于展示辅助说明或错误说明。

```html preview
<script type="module">
  import '@ve-design/web/ve-digital-input';
</script>

<section style="display: grid; place-items: center; padding: 24px;">
  <div style="display: grid; gap: 16px; width: min(100%, 280px);">
    <ve-digital-input
      status="error"
      description="Value must be at least 2."
      value="0"
    ></ve-digital-input>

    <ve-digital-input
      description="Used for parallel agent workers."
      value="4"
    ></ve-digital-input>

    <ve-digital-input
      status="error"
      description="Value exceeds workspace quota."
      value="12"
    ></ve-digital-input>
  </div>
</section>
```

### 事件

`ve-input` 在数值实时变化时触发，`ve-change` 在提交变化时触发。点击加减按钮会按步进更新数值，并触发这两个通用事件。

```html preview
<script type="module">
  import '@ve-design/web/ve-digital-input';
</script>

<section style="display: grid; place-items: center; padding: 24px;">
  <div style="display: grid; gap: 12px; width: min(100%, 280px);">
    <ve-digital-input
      id="workers-input"
      min="0"
      max="16"
      value="3"
    ></ve-digital-input>
    <code id="workers-log" style="color: var(--color-text-secondary);">Waiting for change</code>
  </div>
</section>

<script>
  const input = document.getElementById('workers-input');
  const log = document.getElementById('workers-log');

  input.addEventListener('ve-change', (event) => {
    log.textContent = `Committed: ${event.detail.value}`;
  });
  input.addEventListener('ve-input', (event) => {
    log.textContent = `Typing: ${event.detail.value}`;
  });
</script>
```

### 方法

`focus()` 和 `blur()` 控制输入控件焦点。

```html preview
<script type="module">
  import '@ve-design/web/ve-button';
  import '@ve-design/web/ve-digital-input';
</script>

<section style="display: grid; place-items: center; padding: 24px;">
  <div
    style="display: flex; flex-wrap: wrap; gap: 8px; justify-content: center;"
  >
    <ve-digital-input
      id="quota-input"
      min="0"
      max="20"
      value="6"
    ></ve-digital-input>
    <ve-button id="focus-button" type="outline">Focus</ve-button>
    <ve-button id="blur-button" type="text">Blur</ve-button>
  </div>
</section>

<script>
  const field = document.getElementById('quota-input');
  document
    .getElementById('focus-button')
    .addEventListener('click', () => field.focus());
  document
    .getElementById('blur-button')
    .addEventListener('click', () => field.blur());
</script>
```

## API

### ve-digital-input 属性

| 属性名          | 描述                                   | 类型                                      | 默认值      |
| --------------- | -------------------------------------- | ----------------------------------------- | ----------- |
| `value`         | 当前数值。                             | `number`                                  | `0`         |
| `default-value` | 初始数值，仅在非受控使用时生效。       | `number`                                  | `0`         |
| `min`           | 最小值。                               | `number &#124; undefined`                 | `undefined` |
| `max`           | 最大值。                               | `number &#124; undefined`                 | `undefined` |
| `step`          | 点击加减按钮时的变化量。               | `number`                                  | `1`         |
| `precision`     | 保留小数位数。                         | `number &#124; undefined`                 | `undefined` |
| `size`          | 输入框尺寸。                         | `'small' &#124; 'default' &#124; 'large'` | `'default'` |
| `status`        | 校验状态。                             | `'default' &#124; 'error'`                | `'default'` |
| `disabled`      | 是否禁用。                             | `boolean`                                 | `false`     |
| `placeholder`   | 输入为空时的占位文本。                 | `string`                                  | `''`        |
| `description`   | 辅助说明或错误说明文案。               | `string`                                  | `''`        |

### ve-digital-input 事件

| 事件名      | 描述                                     | 参数类型                   |
| ----------- | ---------------------------------------- | -------------------------- |
| `ve-input`  | 用户输入或步进导致数值实时变化时触发。   | `DigitalInputChangeDetail` |
| `ve-change` | 用户提交变化时触发；步进操作会立即提交。 | `DigitalInputChangeDetail` |

```ts
export type DigitalInputChangeSource = 'input' | 'blur' | 'enter' | 'step';

export interface DigitalInputChangeDetail {
  value: number;
  oldValue: number;
  source: DigitalInputChangeSource;
}
```

### ve-digital-input 方法

| 方法名                          | 描述                     |
| ------------------------------- | ------------------------ |
| `focus(options?: FocusOptions)` | 聚焦数值输入控件。   |
| `blur()`                        | 让数值输入控件失焦。 |

### ve-digital-input 插槽

暂无。
