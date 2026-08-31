`Button` 用于触发即时操作，支持类型、尺寸、形状、状态、禁用、加载、长按钮和链接模式。

## 何时使用

- 触发提交、保存、确认、取消、跳转等明确动作。
- 通过 `type` 区分操作优先级，通过 `status` 表达成功、警告或危险语义。
- 需要搭配图标、禁用、加载或链接状态使用。

## 引入组件

```tsx
import { Button } from '@ve-design/react';
```

## 示例

### 基础用法

使用 `type` 设置按钮类型。

```tsx preview
import { Button } from '@ve-design/react';
import {
  IconAdd,
  IconArrowRightMd,
  IconDownload,
  IconEdit,
  IconShare,
} from '@ve-design/react/icons';

<section
  style={{
    display: 'flex',
    flexWrap: 'wrap',
    gap: '14px 24px',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  }}
>
  <Button type="primary">
    <IconAdd />
    <span>Create</span>
  </Button>
  <Button type="secondary">
    <IconEdit />
    <span>Edit</span>
  </Button>
  <Button type="outline-filled">
    <IconDownload />
    <span>Export</span>
  </Button>
  <Button type="outline">
    <span>Cancel</span>
  </Button>
  <Button type="text">
    <span>More</span>
    <IconArrowRightMd />
  </Button>
  <Button type="text" aria-label="Share">
    <IconShare />
  </Button>
</section>;
```

### 按钮尺寸

使用 `size` 设置按钮尺寸。

```tsx preview
import { Button } from '@ve-design/react';
import {
  IconAdd,
  IconDownload,
  IconEdit,
} from '@ve-design/react/icons';

<section
  style={{ display: 'grid', gap: 16, justifyContent: 'center', padding: 32 }}
>
  <div
    style={{
      display: 'flex',
      gap: 24,
      justifyContent: 'center',
      alignItems: 'center',
    }}
  >
    <Button size="small" type="primary">
      <IconAdd />
      <span>Small</span>
    </Button>
    <Button size="small" type="secondary">
      <IconEdit />
      <span>Small</span>
    </Button>
    <Button size="small" type="outline-filled">
      <IconDownload />
      <span>Small</span>
    </Button>
  </div>

  <div
    style={{
      display: 'flex',
      gap: 24,
      justifyContent: 'center',
      alignItems: 'center',
    }}
  >
    <Button size="default" type="primary">
      <IconAdd />
      <span>Default</span>
    </Button>
    <Button size="default" type="secondary">
      <IconEdit />
      <span>Default</span>
    </Button>
    <Button size="default" type="outline-filled">
      <IconDownload />
      <span>Default</span>
    </Button>
  </div>

  <div
    style={{
      display: 'flex',
      gap: 24,
      justifyContent: 'center',
      alignItems: 'center',
    }}
  >
    <Button size="large" type="primary">
      <IconAdd />
      <span>Large</span>
    </Button>
    <Button size="large" type="secondary">
      <IconEdit />
      <span>Large</span>
    </Button>
    <Button size="large" type="outline-filled">
      <IconDownload />
      <span>Large</span>
    </Button>
  </div>
</section>;
```

### 状态按钮

使用 `status` 表达操作结果或风险等级。

```tsx preview
import { Button } from '@ve-design/react';
import {
  IconCheckCircle,
  IconError,
  IconWarning,
} from '@ve-design/react/icons';

<section
  style={{ display: 'grid', gap: 16, justifyContent: 'center', padding: 32 }}
>
  <div
    style={{
      display: 'flex',
      gap: 24,
      justifyContent: 'center',
      alignItems: 'center',
    }}
  >
    <Button type="primary" status="success">
      <IconCheckCircle />
      <span>Primary</span>
    </Button>
    <Button type="secondary" status="success">
      <IconCheckCircle />
      <span>Secondary</span>
    </Button>
    <Button type="outline-filled" status="success">
      <IconCheckCircle />
      <span>Filled</span>
    </Button>
    <Button type="outline" status="success">
      <IconCheckCircle />
      <span>Outline</span>
    </Button>
    <Button type="text" status="success">
      <IconCheckCircle />
      <span>Text</span>
    </Button>
  </div>

  <div
    style={{
      display: 'flex',
      gap: 24,
      justifyContent: 'center',
      alignItems: 'center',
    }}
  >
    <Button type="primary" status="warning">
      <IconWarning />
      <span>Primary</span>
    </Button>
    <Button type="secondary" status="warning">
      <IconWarning />
      <span>Secondary</span>
    </Button>
    <Button type="outline-filled" status="warning">
      <IconWarning />
      <span>Filled</span>
    </Button>
    <Button type="outline" status="warning">
      <IconWarning />
      <span>Outline</span>
    </Button>
    <Button type="text" status="warning">
      <IconWarning />
      <span>Text</span>
    </Button>
  </div>

  <div
    style={{
      display: 'flex',
      gap: 24,
      justifyContent: 'center',
      alignItems: 'center',
    }}
  >
    <Button type="primary" status="danger">
      <IconError />
      <span>Primary</span>
    </Button>
    <Button type="secondary" status="danger">
      <IconError />
      <span>Secondary</span>
    </Button>
    <Button type="outline-filled" status="danger">
      <IconError />
      <span>Filled</span>
    </Button>
    <Button type="outline" status="danger">
      <IconError />
      <span>Outline</span>
    </Button>
    <Button type="text" status="danger">
      <IconError />
      <span>Text</span>
    </Button>
  </div>
</section>;
```

### 按钮形状

使用 `shape` 设置按钮形状。

```tsx preview
import { Button } from '@ve-design/react';
import {
  IconAdd,
  IconEdit,
  IconMoreHorizontal,
} from '@ve-design/react/icons';

<section
  style={{
    display: 'flex',
    flexWrap: 'wrap',
    gap: '14px 24px',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  }}
>
  <Button type="primary">
    <IconAdd />
    <span>Default</span>
  </Button>
  <Button type="secondary" shape="round">
    <IconEdit />
    <span>Round</span>
  </Button>
  <Button type="outline-filled" shape="circle" aria-label="Add">
    <IconAdd />
  </Button>
  <Button type="text" shape="circle" aria-label="More actions">
    <IconMoreHorizontal />
  </Button>
</section>;
```

### 默认插槽

默认插槽支持文本、图标或组合内容。

```tsx preview
import { Button } from '@ve-design/react';
import {
  IconAdd,
  IconDownload,
  IconWarning,
} from '@ve-design/react/icons';

<section
  style={{
    display: 'flex',
    flexWrap: 'wrap',
    gap: '14px 24px',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  }}
>
  <Button type="primary">
    <IconAdd />
    <span>Create Task</span>
  </Button>
  <Button type="outline-filled">
    <IconDownload />
    <span>Download</span>
  </Button>
  <Button type="secondary" status="danger">
    <IconWarning />
    <span>Stop Run</span>
  </Button>
</section>;
```

### 禁用和加载

使用 `disabled` 禁用按钮，使用 `loading` 表示处理中。

```tsx preview
import { Button } from '@ve-design/react';
import { IconClose, IconWarning } from '@ve-design/react/icons';

<section
  style={{
    display: 'flex',
    flexWrap: 'wrap',
    gap: '14px 24px',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  }}
>
  <Button type="primary" disabled>
    <IconClose />
    <span>Disabled</span>
  </Button>
  <Button type="secondary" status="warning" disabled>
    <IconWarning />
    <span>Pending</span>
  </Button>
  <Button type="primary" loading>
    Submitting
  </Button>
  <Button type="outline-filled" status="danger" loading>
    Deleting
  </Button>
</section>;
```

### 长按钮

使用 `long` 让按钮撑满容器宽度。

```tsx preview
import { Button } from '@ve-design/react';
import { IconCheck, IconClose, IconEdit } from '@ve-design/react/icons';

<section
  style={{
    display: 'grid',
    gap: 12,
    width: 'min(100%, 360px)',
    margin: '0 auto',
    padding: 24,
  }}
>
  <Button type="primary" long>
    <IconCheck />
    <span>Confirm</span>
  </Button>
  <Button type="secondary" long>
    <IconEdit />
    <span>Save Draft</span>
  </Button>
  <Button type="outline-filled" long>
    <IconClose />
    <span>Cancel</span>
  </Button>
</section>;
```

### 跳转链接

设置 `href` 后按钮以链接方式工作。

```tsx preview
import { Button } from '@ve-design/react';
import {
  IconArrowRightMd,
  IconBookOpen01,
} from '@ve-design/react/icons';

<section
  style={{
    display: 'flex',
    flexWrap: 'wrap',
    gap: '14px 24px',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  }}
>
  <Button type="primary" href="https://www.example.com" target="_blank">
    <IconBookOpen01 />
    <span>Open VeDesign</span>
  </Button>
  <Button type="text" href="https://lit.dev" target="_blank">
    <span>Lit Docs</span>
    <IconArrowRightMd />
  </Button>
</section>;
```

### 点击事件

按钮点击时会触发 `onClick`。

```tsx preview
import { useState } from 'react';
import { Button } from '@ve-design/react';
import { IconAdd, IconMinus } from '@ve-design/react/icons';

function ButtonClickDemo() {
  const [count, setCount] = useState(0);

  return (
    <section
      style={{
        display: 'flex',
        gap: 12,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 32,
      }}
    >
      <Button
        type="secondary"
        aria-label="Decrease"
        onClick={() => setCount((value) => value - 1)}
      >
        <IconMinus />
      </Button>
      <output
        style={{
          display: 'inline-grid',
          placeItems: 'center',
          minWidth: 44,
          height: 32,
          border: '1px solid var(--color-border-default)',
          borderRadius: 8,
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {count}
      </output>
      <Button
        type="primary"
        aria-label="Increase"
        onClick={() => setCount((value) => value + 1)}
      >
        <IconAdd />
      </Button>
    </section>
  );
}
```

## API

### Props

| 属性名     | 描述                             | 类型                                                                  | 默认值      |
| ---------- | -------------------------------- | --------------------------------------------------------------------- | ----------- |
| `type`     | 按钮类型                         | `'primary' \| 'secondary' \| 'outline' \| 'outline-filled' \| 'text'` | `'primary'` |
| `size`     | 按钮尺寸                         | `'small' \| 'default' \| 'large'`                                     | `'default'` |
| `shape`    | 按钮形状                         | `'default' \| 'round' \| 'circle'`                                    | `'default'` |
| `status`   | 按钮状态                         | `'default' \| 'success' \| 'warning' \| 'danger'`                     | `'default'` |
| `disabled` | 是否禁用                         | `boolean`                                                             | `false`     |
| `loading`  | 是否加载中                       | `boolean`                                                             | `false`     |
| `long`     | 是否为长按钮                     | `boolean`                                                             | `false`     |
| `href`     | 跳转链接地址；存在时进入链接模式 | `string`                                                              | `''`        |
| `target`   | 链接打开方式                     | `'_blank' \| '_self' \| '_parent' \| '_top'`                          | `'_self'`   |
| `children` | 按钮内容                         | `React.ReactNode`                                                     | `-`         |

### 事件

| 事件名    | 描述                               | 参数类型     |
| --------- | ---------------------------------- | ------------ |
| `onClick` | 点击按钮时触发；禁用或加载中不触发 | `MouseEvent` |

### Ref

可通过 `ref` 调用组件实例上的 `focus()` 方法。
