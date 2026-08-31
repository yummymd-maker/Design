`Input` 用于文本输入，支持单行输入、文本域、清空、校验状态、字数限制、自适应和前后缀内容。

## 何时使用

- 录入短文本或多行说明。
- 需要清空、禁用、校验状态或字数限制。
- 需要通过 `prefix`、`suffix` 补充输入上下文。

## 引入组件

```tsx
import { Input } from '@ve-design/react';
```

## 示例

### 基础用法

使用 `value`、`defaultValue`、`placeholder` 控制输入内容。

```tsx preview
import { Input } from '@ve-design/react';
import { IconSearch } from '@ve-design/react/icons';

<section style={{ display: 'grid', placeItems: 'center', padding: 24 }}>
  <div style={{ display: 'grid', gap: 12, width: 'min(100%, 360px)' }}>
    <Input value="Support Assistant" prefix={<IconSearch />} />
    <Input defaultValue="Daily build summary" />
    <Input placeholder="Enter prompt title" />
  </div>
</section>;
```

### 输入类型

`type` 支持 `text` 和 `textarea`。

```tsx preview
import { Input } from '@ve-design/react';
import { IconKey } from '@ve-design/react/icons';

<section style={{ display: 'grid', placeItems: 'center', padding: 24 }}>
  <div style={{ display: 'grid', gap: 12, width: 'min(100%, 360px)' }}>
    <Input value="workspace-name" prefix={<IconKey />} />
    <Input
      type="textarea"
      rows={3}
      value="Summarize the issue and propose the next action."
    />
  </div>
</section>;
```

### 尺寸

使用 `size` 设置输入框尺寸。

```tsx preview
import { Input } from '@ve-design/react';

<section style={{ display: 'grid', placeItems: 'center', padding: 24 }}>
  <div style={{ display: 'grid', gap: 12, width: 'min(100%, 360px)' }}>
    <Input size="small" placeholder="Small" />
    <Input size="default" placeholder="Default" />
    <Input size="large" placeholder="Large" />
  </div>
</section>;
```

### 状态

使用 `status` 展示校验状态。

```tsx preview
import { Input } from '@ve-design/react';

<section style={{ display: 'grid', placeItems: 'center', padding: 24 }}>
  <div style={{ display: 'grid', gap: 12, width: 'min(100%, 360px)' }}>
    <Input status="success" placeholder="Ready" />
    <Input status="warning" placeholder="Review required" />
    <Input status="error" placeholder="Missing provider" />
    <Input
      type="textarea"
      rows={3}
      status="error"
      value="The provider field is required before publishing."
    />
  </div>
</section>;
```

### 清空和禁用

使用 `clearable` 展示清空按钮，使用 `disabled` 禁用输入。

```tsx preview
import { Input } from '@ve-design/react';

<section style={{ display: 'grid', placeItems: 'center', padding: 24 }}>
  <div style={{ display: 'grid', gap: 12, width: 'min(100%, 360px)' }}>
    <Input value="disable clear all" />
    <Input clearable value="enable clear all" />
    <Input disabled value="Locked by workspace policy" />
  </div>
</section>;
```

### 字数限制

使用 `maxLength` 设置最大字符数，使用 `wordLimit` 控制字数展示。

```tsx preview
import { Input } from '@ve-design/react';

<section style={{ display: 'grid', placeItems: 'center', padding: 24 }}>
  <div style={{ display: 'grid', gap: 12, width: 'min(100%, 360px)' }}>
    <Input maxLength={32} wordLimit="inside" value="Agent launch checklist" />
    <Input
      type="textarea"
      maxLength={160}
      wordLimit="outside"
      value="Summarize the source ticket, cite the evidence, and propose one next action."
    />
  </div>
</section>;
```

### 自适应

使用 `autoSize` 让文本域自适应高度，使用 `autoWidth` 让单行输入自适应宽度。

```tsx preview
import { Input } from '@ve-design/react';

<section style={{ display: 'grid', placeItems: 'center', padding: 24 }}>
  <div style={{ display: 'grid', gap: 12, width: 'min(100%, 360px)' }}>
    <Input
      type="textarea"
      autoSize={{ minRows: 3, maxRows: 6 }}
      value="Write a short agent instruction."
    />
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <Input
        autoWidth={{ minWidth: 120, maxWidth: 320 }}
        value="production-agent-build"
      />
    </div>
  </div>
</section>;
```

### 前后缀

通过 `prefix` 和 `suffix` 传入输入框内的前后缀内容。

```tsx preview
import { Input } from '@ve-design/react';
import { IconSearch } from '@ve-design/react/icons';

<section
  style={{
    display: 'flex',
    flexWrap: 'wrap',
    gap: '16px 112px',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  }}
>
  <Input placeholder="请输入" prefix={<IconSearch />} style={{ width: 360 }} />
  <Input prefix="Https://" style={{ width: 360 }} />
  <Input status="error" prefix="Https://" style={{ width: 360 }} />
  <Input suffix=".com" style={{ width: 360 }} />
  <Input status="error" suffix=".com" style={{ width: 360 }} />
</section>;
```

### 事件

输入值实时变化时触发 `onInput`，提交变化时触发 `onChange`。

```tsx preview
import { useState } from 'react';
import { Input } from '@ve-design/react';

function InputEventDemo() {
  const [log, setLog] = useState('Waiting for input');

  return (
    <section style={{ display: 'grid', placeItems: 'center', padding: 24 }}>
      <div style={{ display: 'grid', gap: 12, width: 'min(100%, 360px)' }}>
        <Input
          placeholder="Agent title"
          onInput={(event) => {
            setLog(`Typing: ${event.detail.value}`);
          }}
          onChange={(event) => {
            setLog(`Submitted: ${event.detail.value}`);
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
import { Button, Input } from '@ve-design/react';

function InputMethodDemo() {
  const inputRef = useRef<ElementRef<typeof Input>>(null);

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
        <Input ref={inputRef} placeholder="Agent name" style={{ width: 360 }} />
        <Button type="outline" onClick={() => inputRef.current?.focus()}>
          Focus
        </Button>
        <Button type="text" onClick={() => inputRef.current?.blur()}>
          Blur
        </Button>
      </div>
    </section>
  );
}
```

## API

### Props

| 属性名         | 描述                                             | 类型                                                                      | 默认值      |
| -------------- | ------------------------------------------------ | ------------------------------------------------------------------------- | ----------- |
| `value`        | 当前输入值                                       | `string`                                                                  | `''`        |
| `defaultValue` | 初始输入值                                       | `string`                                                                  | `''`        |
| `type`         | 输入类型                                         | `'text' \| 'textarea'`                                                    | `'text'`    |
| `placeholder`  | 占位文本                                         | `string`                                                                  | `''`        |
| `size`         | 输入框尺寸                                       | `'small' \| 'default' \| 'large'`                                         | `'default'` |
| `status`       | 校验状态                                         | `'default' \| 'success' \| 'warning' \| 'error'`                          | `'default'` |
| `disabled`     | 是否禁用                                         | `boolean`                                                                 | `false`     |
| `clearable`    | 是否展示清空按钮                                 | `boolean`                                                                 | `false`     |
| `maxLength`    | 最大字符数；对象形式支持 `length` 和 `errorOnly` | `number \| { length: number; errorOnly?: boolean } \| undefined`          | `undefined` |
| `wordLimit`    | 字数统计展示方式；单行输入启用时固定展示在输入框内   | `'hidden' \| 'inside' \| 'outside'`                                       | `'hidden'`  |
| `rows`         | 文本域行数，未启用 `autoSize` 时生效             | `number`                                                                  | `2`         |
| `autoSize`     | 文本域自适应高度配置                             | `boolean \| { minRows?: number; maxRows?: number }`                       | `false`     |
| `autoWidth`    | 单行输入自适应宽度配置                           | `boolean \| { minWidth?: number \| string; maxWidth?: number \| string }` | `false`     |
| `prefix`       | 输入框内前缀内容                               | `React.ReactNode`                                                         | `-`         |
| `suffix`       | 输入框内后缀内容                               | `React.ReactNode`                                                         | `-`         |

### 事件

| 事件名     | 描述                 | 参数类型                                                                                            |
| ---------- | -------------------- | --------------------------------------------------------------------------------------------------- |
| `onInput`  | 输入值实时变化时触发 | `CustomEvent<{ value: string; oldValue: string; source: 'input' \| 'clear'; sourceEvent?: Event }>` |
| `onChange` | 输入值提交变化时触发 | `CustomEvent<{ value: string; oldValue: string; source: 'input' \| 'clear'; sourceEvent?: Event }>` |

### Ref

可通过 `ref` 调用组件实例上的 `focus(options?: FocusOptions)` 和 `blur()` 方法。
