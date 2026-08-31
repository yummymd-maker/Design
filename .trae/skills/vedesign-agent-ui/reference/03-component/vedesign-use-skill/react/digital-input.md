`DigitalInput` 用于输入或调整数值内容，适用于数量、额度、权重、轮次、并发数等数字类信息填写场景。

## 何时使用

- 需要用户录入一个明确的数值。
- 需要通过加减按钮以固定步长调整数值。
- 需要限制最小值、最大值或保留小数精度。
- 需要展示禁用、错误或辅助说明状态。

## 引入组件

```tsx
import { DigitalInput } from '@ve-design/react';
```

## 示例

### 基础用法

使用 `value` 或 `defaultValue` 设置数值。左右按钮分别按 `step` 增加或减少。

```tsx preview
import { DigitalInput } from '@ve-design/react';

<section style={{ display: 'grid', placeItems: 'center', padding: 24 }}>
  <div style={{ display: 'grid', gap: 12, width: 'min(100%, 240px)' }}>
    <DigitalInput value={0} />
    <DigitalInput defaultValue={8} />
  </div>
</section>;
```

### 尺寸

使用 `size` 设置输入框尺寸。

```tsx preview
import { DigitalInput } from '@ve-design/react';

<section style={{ display: 'grid', placeItems: 'center', padding: 24 }}>
  <div style={{ display: 'grid', gap: 12, width: 'min(100%, 240px)' }}>
    <DigitalInput size="large" value={36} />
    <DigitalInput size="default" value={32} />
    <DigitalInput size="small" value={28} />
  </div>
</section>;
```

### 范围和步进

使用 `min`、`max` 和 `step` 控制可输入范围与按钮步长。

```tsx preview
import { DigitalInput } from '@ve-design/react';

<section style={{ display: 'grid', placeItems: 'center', padding: 24 }}>
  <div style={{ display: 'grid', gap: 12, width: 'min(100%, 240px)' }}>
    <DigitalInput min={0} max={10} step={1} value={4} />
    <DigitalInput min={0} max={100} step={5} value={25} />
  </div>
</section>;
```

### 小数精度

使用 `precision` 限制小数位数。按钮步进和手动输入都会按相同精度格式化。

```tsx preview
import { DigitalInput } from '@ve-design/react';

<section style={{ display: 'grid', placeItems: 'center', padding: 24 }}>
  <div style={{ display: 'grid', gap: 12, width: 'min(100%, 240px)' }}>
    <DigitalInput step={0.5} precision={1} value={2.5} />
    <DigitalInput step={0.01} precision={2} value={0.75} />
  </div>
</section>;
```

### 禁用

使用 `disabled` 禁用输入框和左右加减按钮。

```tsx preview
import { DigitalInput } from '@ve-design/react';

<section style={{ display: 'grid', placeItems: 'center', padding: 24 }}>
  <div style={{ display: 'grid', gap: 12, width: 'min(100%, 240px)' }}>
    <DigitalInput disabled value={0} />
    <DigitalInput min={0} max={8} value={8} />
  </div>
</section>;
```

### 状态和说明

使用 `status="error"` 展示错误态；使用 `description` 展示辅助说明或错误说明。

```tsx preview
import { DigitalInput } from '@ve-design/react';

<section style={{ display: 'grid', placeItems: 'center', padding: 24 }}>
  <div style={{ display: 'grid', gap: 16, width: 'min(100%, 280px)' }}>
    <DigitalInput
      status="error"
      description="Value must be at least 2."
      value={0}
    />
    <DigitalInput description="Used for parallel agent workers." value={4} />
    <DigitalInput
      status="error"
      description="Value exceeds workspace quota."
      value={12}
    />
  </div>
</section>;
```

### 事件

`onInput` 在数值实时变化时触发，`onChange` 在提交变化时触发。事件参数的 `detail` 包含 `value`、`oldValue` 和 `source`。

```tsx preview
import { useState } from 'react';
import { DigitalInput } from '@ve-design/react';

function DigitalInputEventDemo() {
  const [value, setValue] = useState(3);
  const [log, setLog] = useState('Waiting for change');

  return (
    <section style={{ display: 'grid', placeItems: 'center', padding: 24 }}>
      <div style={{ display: 'grid', gap: 12, width: 'min(100%, 280px)' }}>
        <DigitalInput
          min={0}
          max={16}
          value={value}
          onInput={(event) => {
            setValue(event.detail.value);
            setLog(`Typing: ${event.detail.value}`);
          }}
          onChange={(event) => {
            setLog(`Committed: ${event.detail.value}`);
          }}
        />
        <code style={{ color: 'var(--color-text-secondary)' }}>{log}</code>
      </div>
    </section>
  );
}
```

### 方法

可通过 `ref` 调用组件实例上的 `focus()` 和 `blur()` 方法。

```tsx preview
import { useRef, type ElementRef } from 'react';
import { Button, DigitalInput } from '@ve-design/react';

function DigitalInputMethodDemo() {
  const digitalInputRef = useRef<ElementRef<typeof DigitalInput>>(null);

  return (
    <section style={{ display: 'grid', placeItems: 'center', padding: 24 }}>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 8,
          justifyContent: 'center',
        }}
      >
        <DigitalInput ref={digitalInputRef} value={8} style={{ width: 220 }} />
        <Button type="outline" onClick={() => digitalInputRef.current?.focus()}>
          Focus
        </Button>
        <Button type="text" onClick={() => digitalInputRef.current?.blur()}>
          Blur
        </Button>
      </div>
    </section>
  );
}
```

## API

### Props

| 属性名         | 描述                                   | 类型                              | 默认值      |
| -------------- | -------------------------------------- | --------------------------------- | ----------- |
| `value`        | 当前数值。                             | `number`                          | `0`         |
| `defaultValue` | 初始数值，仅在非受控使用时生效。       | `number`                          | `0`         |
| `min`          | 最小值。                               | `number \| undefined`             | `undefined` |
| `max`          | 最大值。                               | `number \| undefined`             | `undefined` |
| `step`         | 点击加减按钮时的变化量。               | `number`                          | `1`         |
| `precision`    | 保留小数位数。                         | `number \| undefined`             | `undefined` |
| `size`         | 输入框尺寸。                         | `'small' \| 'default' \| 'large'` | `'default'` |
| `status`       | 校验状态。                             | `'default' \| 'error'`            | `'default'` |
| `disabled`     | 是否禁用。                             | `boolean`                         | `false`     |
| `placeholder`  | 输入为空时的占位文本。                 | `string`                          | `''`        |
| `description`  | 辅助说明或错误说明文案。               | `string`                          | `''`        |

### 事件

| 事件名     | 描述                                     | 参数类型                                |
| ---------- | ---------------------------------------- | --------------------------------------- |
| `onInput`  | 用户输入或步进导致数值实时变化时触发。   | `CustomEvent<DigitalInputChangeDetail>` |
| `onChange` | 用户提交变化时触发；步进操作会立即提交。 | `CustomEvent<DigitalInputChangeDetail>` |

```ts
export type DigitalInputChangeSource = 'input' | 'blur' | 'enter' | 'step';

export interface DigitalInputChangeDetail {
  value: number;
  oldValue: number;
  source: DigitalInputChangeSource;
}
```

### Ref

可通过 `ref` 调用组件实例上的 `focus()` 和 `blur()` 方法。
