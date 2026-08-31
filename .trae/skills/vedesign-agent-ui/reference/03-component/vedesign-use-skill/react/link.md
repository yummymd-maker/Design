`Link` 用于页面跳转或文本导航，支持状态色和禁用态。

## 何时使用

- 在文本中提供轻量跳转入口。
- 通过 `status` 表达 primary、成功、警告或错误语义。
- 需要禁用链接，临时阻止跳转或点击时。

## 引入组件

```tsx
import { Link } from '@ve-design/react';
```

## 示例

### 基础用法

使用 `href` 设置跳转地址。

```tsx preview
import { Link } from '@ve-design/react';
import {
  IconArrowRightSm,
  IconBookOpen01,
  IconLink,
} from '@ve-design/react/icons';

<section
  style={{
    display: 'grid',
    gridTemplateColumns: 'repeat(2, minmax(120px, max-content))',
    gap: 16,
    justifyContent: 'center',
    justifyItems: 'center',
    alignItems: 'center',
    padding: 32,
  }}
>
  <Link href="https://www.example.com" target="_blank">
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
      <IconBookOpen01 />
      <span>VeDesign</span>
    </span>
  </Link>
  <Link href="https://lit.dev" target="_blank">
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
      <IconLink />
      <span>Lit Docs</span>
      <IconArrowRightSm />
    </span>
  </Link>
</section>;
```

### 链接状态

使用 `status` 设置链接状态色。

```tsx preview
import { Link } from '@ve-design/react';

<section
  style={{
    display: 'grid',
    gridTemplateColumns: 'repeat(5, minmax(104px, max-content))',
    gap: 16,
    justifyContent: 'center',
    justifyItems: 'center',
    alignItems: 'center',
    padding: 32,
  }}
>
  <Link href="https://www.example.com">Default</Link>
  <Link status="primary" href="https://www.example.com">
    Primary
  </Link>
  <Link status="success" href="https://www.example.com">
    Success
  </Link>
  <Link status="warning" href="https://www.example.com">
    Warning
  </Link>
  <Link status="error" href="https://www.example.com">
    Error
  </Link>
</section>;
```

### 虚线下划线

使用 `underline` 显示虚线下划线。

```tsx preview
import { Link } from '@ve-design/react';

<section
  style={{
    display: 'grid',
    gridTemplateColumns: 'repeat(5, minmax(104px, max-content))',
    gap: 16,
    justifyContent: 'center',
    justifyItems: 'center',
    alignItems: 'center',
    padding: 32,
  }}
>
  <Link underline href="https://www.example.com">
    Default
  </Link>
  <Link underline status="primary" href="https://www.example.com">
    Primary
  </Link>
  <Link underline status="success" href="https://www.example.com">
    Success
  </Link>
  <Link underline status="warning" href="https://www.example.com">
    Warning
  </Link>
  <Link underline status="error" href="https://www.example.com">
    Error
  </Link>
</section>;
```

### 禁用状态

使用 `disabled` 禁用链接。

```tsx preview
import { Link } from '@ve-design/react';
import {
  IconCheckCircle,
  IconClose,
  IconError,
  IconWarning,
} from '@ve-design/react/icons';

<section
  style={{
    display: 'grid',
    gridTemplateColumns: 'repeat(4, minmax(132px, max-content))',
    gap: 16,
    justifyContent: 'center',
    justifyItems: 'center',
    alignItems: 'center',
    padding: 32,
  }}
>
  <Link disabled href="https://www.example.com">
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
      <IconClose />
      <span>Disabled</span>
    </span>
  </Link>
  <Link disabled status="success" href="https://www.example.com">
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
      <IconCheckCircle />
      <span>Success</span>
    </span>
  </Link>
  <Link disabled status="warning" href="https://www.example.com">
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
      <IconWarning />
      <span>Warning</span>
    </span>
  </Link>
  <Link disabled status="error" href="https://www.example.com">
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
      <IconError />
      <span>Error</span>
    </span>
  </Link>
</section>;
```

### 自定义内容

默认插槽支持文本、图标或其他行内内容。

```tsx preview
import { Link } from '@ve-design/react';
import {
  IconArrowRightMd,
  IconDownload,
  IconFileCheck,
} from '@ve-design/react/icons';

<section
  style={{
    display: 'grid',
    gridTemplateColumns: 'repeat(2, minmax(148px, max-content))',
    gap: 16,
    justifyContent: 'center',
    justifyItems: 'center',
    alignItems: 'center',
    padding: 32,
  }}
>
  <Link href="https://www.example.com" target="_blank">
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
      <IconDownload />
      <span>Download</span>
      <IconArrowRightMd />
    </span>
  </Link>
  <Link status="success" href="https://www.example.com">
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
      <IconFileCheck />
      <span>View Report</span>
    </span>
  </Link>
</section>;
```

### 点击事件

链接点击时会触发 `onClick`。

```tsx preview
import { useState } from 'react';
import { Link } from '@ve-design/react';
import { IconAdd } from '@ve-design/react/icons';

function LinkClickDemo() {
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
      <Link
        href="https://www.example.com"
        onClick={(event) => {
          event.preventDefault();
          setCount((value) => value + 1);
        }}
      >
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
          <IconAdd />
          <span>Count Click</span>
        </span>
      </Link>
      <output
        style={{
          display: 'inline-grid',
          placeItems: 'center',
          minWidth: 44,
          height: 28,
          border: '1px solid var(--color-border-default)',
          borderRadius: 8,
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {count}
      </output>
    </section>
  );
}
```

## API

### Props

| 属性名      | 描述                           | 类型                                                   | 默认值      |
| ----------- | ------------------------------ | ------------------------------------------------------ | ----------- |
| `href`      | 跳转地址                       | `string`                                               | `''`        |
| `target`    | 链接打开方式                   | `'_blank' \| '_self' \| '_parent' \| '_top' \| string` | `'_self'`   |
| `status`    | 链接状态色                     | `'primary' \| 'success' \| 'warning' \| 'error'`       | `undefined` |
| `disabled`  | 是否禁用                       | `boolean`                                              | `false`     |
| `underline` | 是否显示跟随状态色的虚线下划线 | `boolean`                                              | `false`     |
| `children`  | 链接内容                       | `React.ReactNode`                                      | `-`         |

### 事件

| 事件名    | 描述                             | 参数类型     |
| --------- | -------------------------------- | ------------ |
| `onClick` | 点击可用链接时触发；禁用时不触发 | `MouseEvent` |

### Ref

可通过 `ref` 调用组件实例上的 `focus()` 方法。
