`Radio` 用于在一组选项中选择单个值，`RadioGroup` 用于统一管理互斥选项的选中状态。

## 何时使用

- 在多个互斥选项中选择一个结果，例如环境、策略、模型或配置项。
- 选项数量较少，且需要直接展示所有可选项。
- 需要通过 `value`、`defaultValue` 或 `options` 管理组选中值。

## 引入组件

```tsx
import { Radio, RadioGroup } from '@ve-design/react';
```

## 示例

### 基础用法

使用 `RadioGroup` 管理一组选项，`value` 表示当前选中值。

```tsx preview
import { Radio, RadioGroup } from '@ve-design/react';

<section style={{ display: 'flex', justifyContent: 'center', padding: 24 }}>
  <RadioGroup value="staging">
    <Radio value="dev">Development</Radio>
    <Radio value="staging">Staging</Radio>
    <Radio value="prod">Production</Radio>
  </RadioGroup>
</section>;
```

### 纵向排列

`direction="vertical"` 适合表单配置或说明较长的选项。

```tsx preview
import { Radio, RadioGroup } from '@ve-design/react';

<section style={{ display: 'flex', justifyContent: 'center', padding: 24 }}>
  <RadioGroup defaultValue="manual" direction="vertical">
    <Radio value="manual">Manual approval</Radio>
    <Radio value="auto">Auto publish after checks</Radio>
    <Radio value="freeze">Freeze release window</Radio>
  </RadioGroup>
</section>;
```

### 禁用状态

可禁用单个选项，也可通过 `RadioGroup` 禁用整组选项。

```tsx preview
import { Radio, RadioGroup } from '@ve-design/react';

<section
  style={{ display: 'grid', justifyItems: 'center', gap: 20, padding: 24 }}
>
  <RadioGroup value="standard">
    <Radio value="standard">Standard mode</Radio>
    <Radio value="enterprise" disabled>
      Enterprise mode
    </Radio>
  </RadioGroup>

  <RadioGroup disabled value="prod">
    <Radio value="dev">Development</Radio>
    <Radio value="prod">Production</Radio>
  </RadioGroup>
</section>;
```

### Options 模式

`options` 支持传入值数组或对象数组，适合由配置生成选项。

```tsx preview
import { RadioGroup } from '@ve-design/react';

<section style={{ display: 'flex', justifyContent: 'center', padding: 24 }}>
  <RadioGroup
    value="manual"
    options={[
      { label: 'Manual approval', value: 'manual' },
      { label: 'Auto publish', value: 'auto' },
      { label: 'Freeze window', value: 'freeze', disabled: true },
    ]}
  />
</section>;
```

### 自定义标签

通过 `children` 传入文本或简单内联内容，用于补充选项说明。

```tsx preview
import { Radio, RadioGroup } from '@ve-design/react';

<section style={{ display: 'flex', justifyContent: 'center', padding: 24 }}>
  <RadioGroup value="balanced" direction="vertical">
    <Radio value="fast">
      <strong>Fast</strong> · lower latency
    </Radio>
    <Radio value="balanced">
      <strong>Balanced</strong> · quality and speed
    </Radio>
    <Radio value="reasoning">
      <strong>Reasoning</strong> · complex analysis
    </Radio>
  </RadioGroup>
</section>;
```

### 监听变化

单项选中和组值变化都通过 `onChange` 监听，事件参数为 `CustomEvent`。

```tsx preview
import { useState } from 'react';
import { Radio, RadioGroup } from '@ve-design/react';

function RadioEventDemo() {
  const [value, setValue] = useState('balanced');

  return (
    <section
      style={{ display: 'grid', justifyItems: 'center', gap: 12, padding: 24 }}
    >
      <RadioGroup
        value={value}
        onChange={(event) => {
          setValue(String(event.detail.value));
        }}
      >
        <Radio value="fast">Fast</Radio>
        <Radio value="balanced">Balanced</Radio>
        <Radio value="reasoning">Reasoning</Radio>
      </RadioGroup>
      <code style={{ color: 'var(--color-text-secondary)' }}>Selected: {value}</code>
    </section>
  );
}
```

## API

### Radio Props

| 属性名           | 描述           | 类型               | 默认值      |
| ---------------- | -------------- | ------------------ | ----------- |
| `checked`        | 当前是否选中。 | `boolean`          | `undefined` |
| `defaultChecked` | 初始选中状态。 | `boolean`          | `false`     |
| `disabled`       | 是否禁用。     | `boolean`          | `false`     |
| `value`          | 单选项值。     | `string \| number` | `''`        |
| `children`       | 单选项标签内容 | `React.ReactNode`  | `-`         |

### Radio 事件

| 事件名     | 描述                   | 参数类型                                                      |
| ---------- | ---------------------- | ------------------------------------------------------------- |
| `onChange` | 单选项状态变化时触发。 | `CustomEvent<{ checked: boolean; value?: string \| number }>` |

### RadioGroup Props

| 属性名         | 描述                             | 类型                                                                                       | 默认值         |
| -------------- | -------------------------------- | ------------------------------------------------------------------------------------------ | -------------- |
| `value`        | 当前选中值。                     | `string \| number`                                                                         | `''`           |
| `defaultValue` | 初始选中值。                     | `string \| number`                                                                         | `''`           |
| `disabled`     | 是否禁用组内所有单选项。         | `boolean`                                                                                  | `false`        |
| `direction`    | 子项排列方向。                   | `'horizontal' \| 'vertical'`                                                               | `'horizontal'` |
| `options`      | 选项列表；支持值数组或对象数组。 | `(string \| number \| { label?: unknown; value: string \| number; disabled?: boolean })[]` | `[]`           |
| `children`     | 自定义单选项内容。               | `React.ReactNode`                                                                          | `-`            |

### RadioGroup 事件

| 事件名     | 描述                 | 参数类型                                   |
| ---------- | -------------------- | ------------------------------------------ |
| `onChange` | 组选中值变化时触发。 | `CustomEvent<{ value: string \| number }>` |
