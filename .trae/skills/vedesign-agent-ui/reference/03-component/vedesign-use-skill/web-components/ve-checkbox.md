`ve-checkbox` 用于在多个选项中选择任意项，也可作为单个确认项使用。`ve-checkbox-group` 用于管理一组选项的选中值。

## 何时使用

- 多个选项可以同时选中。
- 需要展示父级选项的部分选中状态。
- 需要通过 `options` 快速渲染一组标准选项。
- 需要监听 `ve-change` 或 `ve-group-change` 获取选择结果。

## 引入组件

```ts
import '@ve-design/web/ve-checkbox';
```

## 示例

### 基础用法

使用 `checked` 表示当前选中状态，使用 `value` 设置业务值。

```html preview
<script type="module">
  import '@ve-design/web/ve-checkbox';
</script>

<section style="display:grid; place-items:center; padding:24px;">
  <div style="display:grid; gap:12px; width:min(100%, 320px);">
    <ve-checkbox checked value="retrieval">Retrieval</ve-checkbox>
    <ve-checkbox value="browser">Browser actions</ve-checkbox>
    <ve-checkbox value="memory">Conversation memory</ve-checkbox>
  </div>
</section>
```

### 默认选中

使用 `default-checked` 设置非受控模式下的初始选中状态。

```html preview
<script type="module">
  import '@ve-design/web/ve-checkbox';
</script>

<section style="display:grid; place-items:center; padding:24px;">
  <div style="display:grid; gap:12px; width:min(100%, 320px);">
    <ve-checkbox default-checked value="workspace"
      >Search workspace</ve-checkbox
    >
    <ve-checkbox default-checked value="notify">Send notification</ve-checkbox>
    <ve-checkbox value="preview">Use preview model</ve-checkbox>
  </div>
</section>
```

### 半选和禁用

使用 `indeterminate` 表示部分选中，使用 `disabled` 禁用交互。

```html preview
<script type="module">
  import '@ve-design/web/ve-checkbox';
</script>

<section style="display:grid; place-items:center; padding:24px;">
  <div style="display:grid; gap:12px; width:min(100%, 320px);">
    <ve-checkbox indeterminate value="all-tools"
      >Some tools enabled</ve-checkbox
    >
    <ve-checkbox disabled checked value="audit">Audit logging</ve-checkbox>
    <ve-checkbox disabled value="billing_export">Billing export</ve-checkbox>
    <ve-checkbox disabled indeterminate value="billing_import">Billing import</ve-checkbox>
  </div>
</section>
```

### 自定义标签

默认插槽用于放置复选框标签内容。

```html preview
<script type="module">
  import '@ve-design/web/ve-checkbox';
</script>

<section style="display:grid; place-items:center; padding:24px;">
  <div style="display:grid; gap:12px; width:min(100%, 360px);">
    <ve-checkbox value="retrieval">
      <strong>Retrieval</strong> for knowledge lookup
    </ve-checkbox>
    <ve-checkbox value="handoff">
      Human handoff after repeated failed replies
    </ve-checkbox>
  </div>
</section>
```

### 单项事件

用户切换单个复选框时触发 `ve-change`，事件详情包含 `checked` 和 `value`。

```html preview
<script type="module">
  import '@ve-design/web/ve-checkbox';
</script>

<section style="display:grid; place-items:center; gap:12px; padding:24px;">
  <ve-checkbox id="tool-checkbox" value="retrieval">Retrieval</ve-checkbox>
  <code id="checkbox-log" style="color:var(--color-text-secondary);">Waiting for selection</code>
</section>

<script>
  const checkbox = document.getElementById('tool-checkbox');
  const log = document.getElementById('checkbox-log');

  checkbox.addEventListener('ve-change', (event) => {
    log.textContent = `${event.detail.value}: ${
      event.detail.checked ? 'enabled' : 'disabled'
    }`;
  });
</script>
```

### 分组选项

`ve-checkbox-group` 通过 `value` 管理选中数组，并在用户交互后触发 `ve-group-change`。

```html preview
<script type="module">
  import '@ve-design/web/ve-checkbox';
</script>

<section style="display:grid; place-items:center; gap:12px; padding:24px;">
  <ve-checkbox-group id="agent-tools" direction="vertical">
    <ve-checkbox value="retrieval">Retrieval</ve-checkbox>
    <ve-checkbox value="code-execution">Code execution</ve-checkbox>
    <ve-checkbox value="browser">Browser actions</ve-checkbox>
    <ve-checkbox value="handoff">Human handoff</ve-checkbox>
  </ve-checkbox-group>
  <code id="tools-log" style="color:var(--color-text-secondary);"></code>
</section>

<script>
  const group = document.getElementById('agent-tools');
  const log = document.getElementById('tools-log');

  group.value = ['retrieval', 'browser'];
  log.textContent = `Selected: ${group.value.join(', ')}`;

  group.addEventListener('ve-group-change', (event) => {
    log.textContent = `Selected: ${event.detail.value.join(', ')}`;
  });
</script>
```

### 默认值和布局

使用 `default-value` 设置初始选中值，使用 `direction` 控制排列方向。

```html preview
<script type="module">
  import '@ve-design/web/ve-checkbox';
</script>

<section style="display:grid; place-items:center; gap:20px; padding:24px;">
  <ve-checkbox-group default-value='["retrieval","browser"]'>
    <ve-checkbox value="retrieval">Retrieval</ve-checkbox>
    <ve-checkbox value="code-execution">Code execution</ve-checkbox>
    <ve-checkbox value="browser">Browser actions</ve-checkbox>
  </ve-checkbox-group>

  <ve-checkbox-group default-value="email,slack" direction="vertical">
    <ve-checkbox value="email">Email</ve-checkbox>
    <ve-checkbox value="slack">Slack</ve-checkbox>
    <ve-checkbox value="pager">Pager</ve-checkbox>
  </ve-checkbox-group>
</section>
```

### 整组禁用

在 `ve-checkbox-group` 上设置 `disabled` 会禁用组内所有选项。

```html preview
<script type="module">
  import '@ve-design/web/ve-checkbox';
</script>

<section style="display:grid; place-items:center; padding:24px;">
  <ve-checkbox-group disabled value='["audit"]'>
    <ve-checkbox value="audit">Audit logging</ve-checkbox>
    <ve-checkbox value="export">Data export</ve-checkbox>
    <ve-checkbox value="memory">Long-term memory</ve-checkbox>
  </ve-checkbox-group>
</section>
```

### Options 模式

`options` 通过 JS 属性设置，支持字符串、数字或对象数组；对象项支持 `label`、`value`、`disabled`。

```html preview
<script type="module">
  import '@ve-design/web/ve-checkbox';
</script>

<section style="display:grid; place-items:center; padding:24px;">
  <ve-checkbox-group
    id="review-checks"
    direction="horizontal"
  ></ve-checkbox-group>
</section>

<script>
  const group = document.getElementById('review-checks');

  group.options = [
    { label: 'Prompt quality', value: 'prompt' },
    { label: 'Safety policy', value: 'safety' },
    { label: 'Latency budget', value: 'latency' },
    { label: 'Cost report', value: 'cost', disabled: true },
  ];
  group.value = ['prompt', 'safety'];
</script>
```

## API

### ve-checkbox 属性

| 属性名            | 描述                                 | 类型                   | 默认值  |
| ----------------- | ------------------------------------ | ---------------------- | ------- |
| `checked`         | 当前是否选中。                       | `boolean \| undefined` | `undefined` |
| `default-checked` | 非受控模式下的初始选中状态。         | `boolean`              | `false` |
| `indeterminate`   | 是否展示半选状态。                   | `boolean`              | `false` |
| `disabled`        | 是否禁用。                           | `boolean`              | `false` |
| `value`           | 复选框值，会参与事件详情和组值计算。 | `string &#124; number` | `''`    |

### ve-checkbox 事件

| 事件名      | 描述                                           | 参数类型                                                          |
| ----------- | ---------------------------------------------- | ----------------------------------------------------------------- |
| `ve-change` | 用户切换选中状态时触发，携带选中状态和当前值。 | `CustomEvent<{ checked: boolean; value?: string &#124; number }>` |

### ve-checkbox 插槽

| 插槽名   | 描述             |
| -------- | ---------------- |
| 默认插槽 | 复选框标签内容。 |

### ve-checkbox-group 属性

| 属性名          | 描述                                                                  | 类型                                                                                                   | 默认值         |
| --------------- | --------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ | -------------- |
| `value`         | 当前选中值数组，需通过 JS 属性设置。                                  | `(string &#124; number)[]`                                                                             | `[]`           |
| `default-value` | 非受控模式下的初始选中值数组，HTML 中支持 JSON 数组或逗号分隔字符串。 | `(string &#124; number)[]`                                                                             | `[]`           |
| `disabled`      | 是否禁用组内所有复选框。                                              | `boolean`                                                                                              | `false`        |
| `direction`     | 子项排列方向。                                                        | `'horizontal' &#124; 'vertical'`                                                                       | `'horizontal'` |
| `options`       | 选项列表，需通过 JS 属性设置。                                        | `(string &#124; number &#124; { label?: unknown; value: string &#124; number; disabled?: boolean })[]` | `[]`           |

### ve-checkbox-group 事件

| 事件名            | 描述                   | 参数类型                                                                                                  |
| ----------------- | ---------------------- | --------------------------------------------------------------------------------------------------------- |
| `ve-group-change` | 组内选中值变化时触发。 | `CustomEvent<{ value: (string &#124; number)[]; changedValue?: string &#124; number; checked: boolean }>` |

### ve-checkbox-group 插槽

| 插槽名   | 描述                                             |
| -------- | ------------------------------------------------ |
| 默认插槽 | 自定义子复选框内容，通常放置多个 `ve-checkbox`。 |
