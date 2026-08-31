`Tooltip` 用于在触发元素附近展示简短辅助说明，适合解释图标、字段、状态或快捷操作。

## 何时使用

- 需要解释紧凑控件、图标按钮、状态文案或路径信息。
- 需要在 hover、focus 或 click 时展示非交互式提示。
- 需要通过 `content` 组织描述、强调文本或快捷键。

## 引入组件

```tsx
import { Tooltip } from '@ve-design/react';
```

## 示例

### 基础用法

默认插槽放置触发元素，`content` 插槽放置提示内容。

```tsx preview
import { Button, Tooltip } from '@ve-design/react';

<section
  style={{
    display: 'flex',
    flexWrap: 'wrap',
    gap: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 112,
    padding: '40px 24px',
  }}
>
  <Tooltip content="Run with the current task context.">
    <Button type="primary">Run Agent</Button>
  </Tooltip>

  <Tooltip content="Estimated cost for this turn: 3.2K tokens.">
    <Button type="outline">Token Budget</Button>
  </Tooltip>
</section>;
```

### 内容结构

需要强调文本、路径或快捷键时，直接在 `content` 插槽内组织结构。

```tsx preview
import { Button, Tooltip } from '@ve-design/react';

function TooltipContentDemo() {
  const contentStackStyle = {
    display: 'inline-flex',
    flexDirection: 'column',
    gap: 2,
  };

  const contentRowStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
  };

  const descriptionStyle = {
    color: 'var(--color-text-disable)',
  };

  const kbdStyle = {
    color: 'var(--color-text-tertiary)',
    font: 'inherit',
    fontSize: 11,
    lineHeight: '16px',
  };

  return (
    <section
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 16,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 112,
        padding: '40px 24px',
      }}
    >
      <Tooltip
        content={
          <span style={contentStackStyle}>
            <strong>Design reference</strong>
            <span style={descriptionStyle}>
              /Frame 2147238986 / Action item
            </span>
          </span>
        }
      >
        <Button type="primary">File Path</Button>
      </Tooltip>

      <Tooltip
        content={
          <span style={contentRowStyle}>
            <span>Open command menu</span>
            <kbd style={kbdStyle}>⌘K</kbd>
          </span>
        }
      >
        <Button type="outline">Command</Button>
      </Tooltip>
    </section>
  );
}
```

### 弹出位置

`position` 控制提示框的优先展示位置。

```tsx preview
import { Button, Tooltip } from '@ve-design/react';

<section
  style={{
    boxSizing: 'border-box',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(72px, max-content))',
    alignItems: 'center',
    justifyContent: 'center',
    justifyItems: 'center',
    gap: '18px 28px',
    minHeight: 156,
    padding: '48px 24px',
  }}
>
  <Tooltip position="top" content="Show above the trigger.">
    <Button>top</Button>
  </Tooltip>

  <Tooltip position="right" content="Show to the right.">
    <Button>right</Button>
  </Tooltip>

  <Tooltip position="bottom" content="Show below the trigger.">
    <Button>bottom</Button>
  </Tooltip>

  <Tooltip position="left" content="Show to the left.">
    <Button>left</Button>
  </Tooltip>
</section>;
```

### 箭头

设置 `arrow` 后展示方向箭头；默认保持无箭头气泡。

```tsx preview
import { Button, Tooltip } from '@ve-design/react';

<section
  style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 112,
    padding: '40px 24px',
  }}
>
  <Tooltip arrow position="top" content="The arrow points to the trigger.">
    <Button type="primary">With Arrow</Button>
  </Tooltip>
</section>;
```

### 触发方式

`trigger` 支持 `hover`、`click` 和 `focus`。

```tsx preview
import { Button, Tooltip } from '@ve-design/react';

<section
  style={{
    display: 'flex',
    flexWrap: 'wrap',
    gap: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 112,
    padding: '40px 24px',
  }}
>
  <Tooltip trigger="hover" content="Preview before opening the editor.">
    <Button type="primary">Hover</Button>
  </Tooltip>

  <Tooltip trigger="click" content="Click again or click outside to close.">
    <Button type="outline">Click</Button>
  </Tooltip>

  <Tooltip
    trigger="focus"
    content="Show the hint when the trigger receives focus."
  >
    <Button type="secondary">Focus</Button>
  </Tooltip>
</section>;
```

### 状态控制

`delay` 用于减少快速划过时的干扰，`open` 可由外部状态控制。

```tsx preview
import { useState } from 'react';
import { Button, Tooltip } from '@ve-design/react';

function TooltipStateDemo() {
  const [open, setOpen] = useState(true);

  return (
    <section
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 16,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 112,
        padding: '40px 24px',
      }}
    >
      <Tooltip delay={300} content="Show after 300ms.">
        <Button type="primary">Delayed</Button>
      </Tooltip>

      <Button type="outline" onClick={() => setOpen((value) => !value)}>
        Toggle
      </Button>

      <Tooltip
        open={open}
        position="right"
        content="The open state is managed externally."
      >
        <Button type="secondary">Controlled</Button>
      </Tooltip>
    </section>
  );
}

```

### 禁用状态

设置 `disabled` 后，Tooltip 不再响应触发事件。

```tsx preview
import { Button, Tooltip } from '@ve-design/react';

<section
  style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 112,
    padding: '40px 24px',
  }}
>
  <Tooltip disabled content="This tooltip will not be shown.">
    <Button type="primary" disabled>
      Deploy Agent
    </Button>
  </Tooltip>
</section>;
```

### 展开状态事件

打开状态变化时会触发 `onOpenChange`，事件参数包含下一次打开状态。

```tsx preview
import { useState } from 'react';
import { Button, Tooltip } from '@ve-design/react';

function TooltipEventDemo() {
  const [message, setMessage] = useState('onOpenChange: false');

  return (
    <section
      style={{
        display: 'grid',
        placeItems: 'center',
        gap: 14,
        minHeight: 136,
        padding: '40px 24px',
      }}
    >
      <Tooltip
        trigger="click"
        content="Track each open or close transition."
        onOpenChange={(event) => {
          setMessage(`onOpenChange: ${String(event.detail.open)}`);
        }}
      >
        <Button type="primary">Trace Tooltip</Button>
      </Tooltip>

      <span
        style={{
          minWidth: 220,
          textAlign: 'center',
          color: 'var(--color-text-3)',
          fontSize: 12,
          lineHeight: 1.5,
        }}
      >
        {message}
      </span>
    </section>
  );
}

```

## API

### Props

| 属性名        | 描述                                     | 类型                                                                    | 默认值      |
| ------------- | ---------------------------------------- | ----------------------------------------------------------------------- | ----------- |
| `position`    | 提示框优先展示位置                       | `'top' \| 'right' \| 'bottom' \| 'left'` 及其 `-start`、`-end` 对齐变体 | `'top'`     |
| `trigger`     | 触发方式                                 | `'hover' \| 'click' \| 'focus'`                                         | `'hover'`   |
| `arrow`       | 是否展示方向箭头                         | `boolean`                                                               | `false`     |
| `open`        | 当前是否打开；设置为布尔值时进入受控模式 | `boolean \| undefined`                                                  | `undefined` |
| `defaultOpen` | 非受控模式下的初始打开状态               | `boolean`                                                               | `false`     |
| `disabled`    | 是否禁用提示交互和展示                   | `boolean`                                                               | `false`     |
| `delay`       | 打开或关闭延迟，单位毫秒                 | `number`                                                                | `80`        |
| `content`     | 提示框内容                               | `React.ReactNode`                                                       | `-`         |
| `children`    | 触发提示的元素，建议放置单个根节点       | `React.ReactNode`                                                       | `-`         |

### 事件

| 事件名         | 描述                         | 参数类型                         |
| -------------- | ---------------------------- | -------------------------------- |
| `onOpenChange` | 打开状态变化请求发生时触发。 | `CustomEvent<{ open: boolean }>` |

### Ref

可通过 `ref` 访问 Tooltip 组件实例。
