`ve-radio` 用于在一组选项中选择单个值，`ve-radio-group` 用于统一管理互斥选项的选中状态。

## 何时使用

- 在多个互斥选项中选择一个结果，例如环境、策略、模型或配置项。
- 选项数量较少，且需要直接展示所有可选项。
- 需要通过 `value`、`default-value` 或 `options` 管理组选中值。

## 引入组件

```ts
import '@ve-design/web/ve-radio';
```

## 示例

### 基础用法

使用 `ve-radio-group` 管理一组选项，`value` 表示当前选中值。

```html preview
<script type="module">
  import '@ve-design/web/ve-radio';
</script>

<section style="display: flex; justify-content: center; padding: 24px;">
  <ve-radio-group value="staging">
    <ve-radio value="dev">Development</ve-radio>
    <ve-radio value="staging">Staging</ve-radio>
    <ve-radio value="prod">Production</ve-radio>
  </ve-radio-group>
</section>
```

### 纵向排列

`direction="vertical"` 适合表单配置或说明较长的选项。

```html preview
<script type="module">
  import '@ve-design/web/ve-radio';
</script>

<section style="display: flex; justify-content: center; padding: 24px;">
  <ve-radio-group default-value="manual" direction="vertical">
    <ve-radio value="manual">Manual approval</ve-radio>
    <ve-radio value="auto">Auto publish after checks</ve-radio>
    <ve-radio value="freeze">Freeze release window</ve-radio>
  </ve-radio-group>
</section>
```

### 禁用状态

可禁用单个选项，也可通过 `ve-radio-group` 禁用整组选项。

```html preview
<script type="module">
  import '@ve-design/web/ve-radio';
</script>

<section
  style="display: grid; justify-items: center; gap: 20px; padding: 24px;"
>
  <ve-radio-group value="standard">
    <ve-radio value="standard">Standard mode</ve-radio>
    <ve-radio value="enterprise" disabled>Enterprise mode</ve-radio>
  </ve-radio-group>

  <ve-radio-group disabled value="prod">
    <ve-radio value="dev">Development</ve-radio>
    <ve-radio value="prod">Production</ve-radio>
  </ve-radio-group>
</section>
```

### Options 模式

`options` 支持通过 JavaScript 属性传入值数组或对象数组，适合由配置生成选项。

```html preview
<script type="module">
  import '@ve-design/web/ve-radio';
</script>

<section style="display: flex; justify-content: center; padding: 24px;">
  <ve-radio-group id="release-policy"></ve-radio-group>
</section>

<script>
  const group = document.getElementById('release-policy');
  group.options = [
    { label: 'Manual approval', value: 'manual' },
    { label: 'Auto publish', value: 'auto' },
    { label: 'Freeze window', value: 'freeze', disabled: true },
  ];
  group.value = 'manual';
</script>
```

### 自定义标签

默认插槽可放置文本或简单内联内容，用于补充选项说明。

```html preview
<script type="module">
  import '@ve-design/web/ve-radio';
</script>

<section style="display: flex; justify-content: center; padding: 24px;">
  <ve-radio-group value="balanced" direction="vertical">
    <ve-radio value="fast"><strong>Fast</strong> · lower latency</ve-radio>
    <ve-radio value="balanced"
      ><strong>Balanced</strong> · quality and speed</ve-radio
    >
    <ve-radio value="reasoning"
      ><strong>Reasoning</strong> · complex analysis</ve-radio
    >
  </ve-radio-group>
</section>
```

### 监听变化

单项选中时触发 `ve-change`，组值变化时触发 `ve-group-change`。

```html preview
<script type="module">
  import '@ve-design/web/ve-radio';
</script>

<section
  style="display: grid; justify-items: center; gap: 12px; padding: 24px;"
>
  <ve-radio-group id="model-group" value="balanced">
    <ve-radio value="fast">Fast</ve-radio>
    <ve-radio value="balanced">Balanced</ve-radio>
    <ve-radio value="reasoning">Reasoning</ve-radio>
  </ve-radio-group>
  <code id="radio-log" style="color: var(--color-text-secondary);">Selected: balanced</code>
</section>

<script>
  const group = document.getElementById('model-group');
  const log = document.getElementById('radio-log');

  group.addEventListener('ve-group-change', (event) => {
    log.textContent = `Selected: ${event.detail.value}`;
  });
</script>
```

## API

### ve-radio 属性

| 属性名            | 描述           | 类型                   | 默认值  |
| ----------------- | -------------- | ---------------------- | ------- |
| `checked`         | 当前是否选中。 | `boolean \| undefined` | `undefined` |
| `default-checked` | 初始选中状态。 | `boolean`              | `false` |
| `disabled`        | 是否禁用。     | `boolean`              | `false` |
| `value`           | 单选项值。     | `string &#124; number` | `''`    |

### ve-radio 事件

| 事件名      | 描述                   | 参数类型                                                          |
| ----------- | ---------------------- | ----------------------------------------------------------------- |
| `ve-change` | 单选项状态变化时触发。 | `CustomEvent<{ checked: boolean; value?: string &#124; number }>` |

### ve-radio 插槽

| 插槽名   | 描述             |
| -------- | ---------------- |
| 默认插槽 | 单选项标签内容。 |

### ve-radio-group 属性

| 属性名          | 描述                             | 类型                                                                                                   | 默认值         |
| --------------- | -------------------------------- | ------------------------------------------------------------------------------------------------------ | -------------- |
| `value`         | 当前选中值。                     | `string &#124; number`                                                                                 | `''`           |
| `default-value` | 初始选中值。                     | `string &#124; number`                                                                                 | `''`           |
| `disabled`      | 是否禁用组内所有单选项。         | `boolean`                                                                                              | `false`        |
| `direction`     | 子项排列方向。                   | `'horizontal' &#124; 'vertical'`                                                                       | `'horizontal'` |
| `options`       | 选项列表；支持值数组或对象数组。 | `(string &#124; number &#124; { label?: unknown; value: string &#124; number; disabled?: boolean })[]` | `[]`           |

### ve-radio-group 事件

| 事件名            | 描述                 | 参数类型                                       |
| ----------------- | -------------------- | ---------------------------------------------- |
| `ve-group-change` | 组选中值变化时触发。 | `CustomEvent<{ value: string &#124; number }>` |

### ve-radio-group 插槽

| 插槽名   | 描述                                        |
| -------- | ------------------------------------------- |
| 默认插槽 | 自定义子单选内容，通常放置多个 `ve-radio`。 |
