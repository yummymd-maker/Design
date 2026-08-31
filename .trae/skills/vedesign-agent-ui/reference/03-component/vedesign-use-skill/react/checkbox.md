`Checkbox` 用于在多个选项中选择任意项，也可作为单个确认项使用；`CheckboxGroup` 用于统一管理一组选项的选中值。

## 何时使用

- 多个选项可以同时选中。
- 需要展示父级选项的部分选中状态。
- 需要通过 `options` 快速渲染一组标准选项。
- 需要通过 `value`、`defaultValue` 或 `onChange` 管理选中状态。

## 引入组件

```tsx
import { Checkbox, CheckboxGroup } from '@ve-design/react';
```

## 示例

### 基础用法

使用 `checked` 表示当前选中状态，使用 `value` 设置业务值。

```tsx preview
import { Checkbox } from '@ve-design/react';

<section style={{ display: 'grid', placeItems: 'center', padding: 24 }}>
  <div style={{ display: 'grid', gap: 12, width: 'min(100%, 320px)' }}>
    <Checkbox checked value="retrieval">
      Retrieval
    </Checkbox>
    <Checkbox value="browser">Browser actions</Checkbox>
    <Checkbox value="memory">Conversation memory</Checkbox>
  </div>
</section>;
```

### 默认选中

使用 `defaultChecked` 设置非受控模式下的初始选中状态。

```tsx preview
import { Checkbox } from '@ve-design/react';

<section style={{ display: 'grid', placeItems: 'center', padding: 24 }}>
  <div style={{ display: 'grid', gap: 12, width: 'min(100%, 320px)' }}>
    <Checkbox defaultChecked value="workspace">
      Search workspace
    </Checkbox>
    <Checkbox defaultChecked value="notify">
      Send notification
    </Checkbox>
    <Checkbox value="preview">Use preview model</Checkbox>
  </div>
</section>;
```

### 半选和禁用

使用 `indeterminate` 表示部分选中，使用 `disabled` 禁用交互。

```tsx preview
import { Checkbox } from '@ve-design/react';

<section style={{ display: 'grid', placeItems: 'center', padding: 24 }}>
  <div style={{ display: 'grid', gap: 12, width: 'min(100%, 320px)' }}>
    <Checkbox indeterminate value="all-tools">
      Some tools enabled
    </Checkbox>
    <Checkbox disabled checked value="audit">
      Audit logging
    </Checkbox>
    <Checkbox disabled value="billing_export">
      Billing export
    </Checkbox>
    <Checkbox disabled indeterminate value="billing_import">
      Billing import
    </Checkbox>
  </div>
</section>;
```

### 自定义标签

通过 `children` 传入文本或简单内联内容，用于补充选项说明。

```tsx preview
import { Checkbox } from '@ve-design/react';

<section style={{ display: 'grid', placeItems: 'center', padding: 24 }}>
  <div style={{ display: 'grid', gap: 12, width: 'min(100%, 360px)' }}>
    <Checkbox value="retrieval">
      <strong>Retrieval</strong> for knowledge lookup
    </Checkbox>
    <Checkbox value="handoff">
      Human handoff after repeated failed replies
    </Checkbox>
  </div>
</section>;
```

### 单项事件

用户切换单个复选框时触发 `onChange`，事件详情包含 `checked` 和 `value`。

```tsx preview
import { useState } from 'react';
import { Checkbox } from '@ve-design/react';

function CheckboxEventDemo() {
  const [log, setLog] = useState('Waiting for selection');

  return (
    <section
      style={{ display: 'grid', placeItems: 'center', gap: 12, padding: 24 }}
    >
      <Checkbox
        value="retrieval"
        onChange={(event) => {
          setLog(
            `${event.detail.value}: ${event.detail.checked ? 'enabled' : 'disabled'}`,
          );
        }}
      >
        Retrieval
      </Checkbox>
      <code style={{ color: 'var(--color-text-secondary)' }}>{log}</code>
    </section>
  );
}
```

### 分组选项

`CheckboxGroup` 通过 `value` 管理选中数组，并在用户交互后触发 `onChange`。

```tsx preview
import { useState } from 'react';
import { Checkbox, CheckboxGroup } from '@ve-design/react';

function CheckboxGroupEventDemo() {
  const [value, setValue] = useState(['retrieval', 'browser']);

  return (
    <section
      style={{ display: 'grid', placeItems: 'center', gap: 12, padding: 24 }}
    >
      <CheckboxGroup
        value={value}
        direction="vertical"
        onChange={(event) => {
          setValue(event.detail.value);
        }}
      >
        <Checkbox value="retrieval">Retrieval</Checkbox>
        <Checkbox value="code-execution">Code execution</Checkbox>
        <Checkbox value="browser">Browser actions</Checkbox>
        <Checkbox value="handoff">Human handoff</Checkbox>
      </CheckboxGroup>
      <code style={{ color: 'var(--color-text-secondary)' }}>Selected: {value.join(', ')}</code>
    </section>
  );
}
```

### 默认值和布局

使用 `defaultValue` 设置初始选中值，使用 `direction` 控制排列方向。

```tsx preview
import { Checkbox, CheckboxGroup } from '@ve-design/react';

<section
  style={{ display: 'grid', placeItems: 'center', gap: 20, padding: 24 }}
>
  <CheckboxGroup defaultValue={['retrieval', 'browser']}>
    <Checkbox value="retrieval">Retrieval</Checkbox>
    <Checkbox value="code-execution">Code execution</Checkbox>
    <Checkbox value="browser">Browser actions</Checkbox>
  </CheckboxGroup>

  <CheckboxGroup defaultValue={['email', 'slack']} direction="vertical">
    <Checkbox value="email">Email</Checkbox>
    <Checkbox value="slack">Slack</Checkbox>
    <Checkbox value="pager">Pager</Checkbox>
  </CheckboxGroup>
</section>;
```

### 整组禁用

在 `CheckboxGroup` 上设置 `disabled` 会禁用组内所有选项。

```tsx preview
import { Checkbox, CheckboxGroup } from '@ve-design/react';

<section style={{ display: 'grid', placeItems: 'center', padding: 24 }}>
  <CheckboxGroup disabled value={['audit']}>
    <Checkbox value="audit">Audit logging</Checkbox>
    <Checkbox value="export">Data export</Checkbox>
    <Checkbox value="memory">Long-term memory</Checkbox>
  </CheckboxGroup>
</section>;
```

### Options 模式

`options` 支持字符串、数字或对象数组；对象项支持 `label`、`value`、`disabled`。

```tsx preview
import { CheckboxGroup } from '@ve-design/react';

<section style={{ display: 'grid', placeItems: 'center', padding: 24 }}>
  <CheckboxGroup
    direction="horizontal"
    value={['prompt', 'safety']}
    options={[
      { label: 'Prompt quality', value: 'prompt' },
      { label: 'Safety policy', value: 'safety' },
      { label: 'Latency budget', value: 'latency' },
      { label: 'Cost report', value: 'cost', disabled: true },
    ]}
  />
</section>;
```

## API

### Checkbox Props

| 属性名           | 描述                                 | 类型               | 默认值      |
| ---------------- | ------------------------------------ | ------------------ | ----------- |
| `checked`        | 当前是否选中。                       | `boolean`          | `undefined` |
| `defaultChecked` | 非受控模式下的初始选中状态。         | `boolean`          | `false`     |
| `indeterminate`  | 是否展示半选状态。                   | `boolean`          | `false`     |
| `disabled`       | 是否禁用。                           | `boolean`          | `false`     |
| `value`          | 复选框值，会参与事件详情和组值计算。 | `string \| number` | `''`        |
| `children`       | 复选框标签内容。                     | `React.ReactNode`  | `-`         |

### Checkbox 事件

| 事件名     | 描述                                           | 参数类型                                                      |
| ---------- | ---------------------------------------------- | ------------------------------------------------------------- |
| `onChange` | 用户切换选中状态时触发，携带选中状态和当前值。 | `CustomEvent<{ checked: boolean; value?: string \| number }>` |

### CheckboxGroup Props

| 属性名         | 描述                             | 类型                                                                                       | 默认值         |
| -------------- | -------------------------------- | ------------------------------------------------------------------------------------------ | -------------- |
| `value`        | 当前选中值数组。                 | `(string \| number)[]`                                                                     | `[]`           |
| `defaultValue` | 非受控模式下的初始选中值数组。   | `(string \| number)[]`                                                                     | `[]`           |
| `disabled`     | 是否禁用组内所有复选框。         | `boolean`                                                                                  | `false`        |
| `direction`    | 子项排列方向。                   | `'horizontal' \| 'vertical'`                                                               | `'horizontal'` |
| `options`      | 选项列表；支持值数组或对象数组。 | `(string \| number \| { label?: unknown; value: string \| number; disabled?: boolean })[]` | `[]`           |
| `children`     | 自定义复选框内容。               | `React.ReactNode`                                                                          | `-`            |

### CheckboxGroup 事件

| 事件名     | 描述                   | 参数类型                                                                                          |
| ---------- | ---------------------- | ------------------------------------------------------------------------------------------------- |
| `onChange` | 组内选中值变化时触发。 | `CustomEvent<{ value: (string \| number)[]; changedValue?: string \| number; checked: boolean }>` |
