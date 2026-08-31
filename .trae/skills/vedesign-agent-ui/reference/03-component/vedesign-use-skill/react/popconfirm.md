`Popconfirm` 用于在用户执行关键操作前进行轻量二次确认。组件点击触发元素后，在触发点附近弹出气泡式确认框，适合删除、停止、撤销、重置等需要二次确认但不需要打断整页流程的场景。

## 何时使用

- 用户即将执行删除、终止、撤销、清空、重置等关键操作，需要明确确认。
- 操作的影响范围较小，不需要使用 Modal 打断用户当前上下文。
- 触发节点附近就能完成确认，确认内容较短，通常包含标题、一句说明和两个操作。

## 引入组件

```tsx
import { Popconfirm } from '@ve-design/react';
```

## 示例

### 基础用法

默认插槽放置触发元素。点击触发元素后展示气泡确认框，点击取消、确认、外部区域或按 Escape 会请求关闭。

```tsx preview
import { Button, Popconfirm } from '@ve-design/react';

<section
  style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 180,
    padding: 32,
  }}
>
  <Popconfirm title="标题" content="这里是一条文本描述内容。">
    <Button>打开确认框</Button>
  </Popconfirm>
</section>;
```

### 危险操作

组件不内置固定语义类型。危险、警告等场景可以通过 `icon`、`confirm` 等 ReactNode 属性与触发节点状态自由组合。

```tsx preview
import { Button, Popconfirm } from '@ve-design/react';
import { IconWarning } from '@ve-design/react/icons';

<section
  style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 180,
    padding: 32,
  }}
>
  <Popconfirm
    title="确定要删除吗？"
    content="删除后不可恢复，请谨慎操作"
    cancelText="取消"
    icon={
      <IconWarning
        aria-hidden="true"
        style={{ color: 'var(--color-text-warning)' }}
      />
    }
    confirm={
      <span
        style={{
          color: 'var(--color-text-danger)',
          fontWeight: 'var(--font-weight-medium)',
        }}
      >
        删除
      </span>
    }
  >
    <Button type="text" status="danger">
      删除任务
    </Button>
  </Popconfirm>
</section>;
```

### 弹出位置

`position` 支持 `top`、`bottom`、`left`、`right` 以及 `top-start`、`top-end`、`bottom-start`、`bottom-end`、`left-start`、`left-end`、`right-start`、`right-end` 等位置。

```tsx preview
import { Button, Popconfirm } from '@ve-design/react';

<section
  style={{
    boxSizing: 'border-box',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(96px, max-content))',
    alignItems: 'center',
    justifyContent: 'center',
    justifyItems: 'center',
    gap: '20px 28px',
    minHeight: 220,
    padding: '56px 24px',
  }}
>
  <Popconfirm
    position="top"
    title="Run agent?"
    content="Start with current context."
    okText="Run"
    cancelText="Cancel"
  >
    <Button>top</Button>
  </Popconfirm>

  <Popconfirm
    position="right"
    title="Publish report?"
    content="Visible to all workspace members."
    okText="Publish"
    cancelText="Cancel"
  >
    <Button>right</Button>
  </Popconfirm>

  <Popconfirm
    position="bottom"
    title="Reset session?"
    content="All local turns will be cleared."
    okText="Reset"
    cancelText="Cancel"
  >
    <Button>bottom</Button>
  </Popconfirm>

  <Popconfirm
    position="left"
    title="Stop execution?"
    content="The current run will be interrupted."
    okText="Stop"
    cancelText="Cancel"
  >
    <Button>left</Button>
  </Popconfirm>
</section>;
```

### 箭头

设置 `arrow` 后，气泡会显示指向触发元素的箭头。默认保持与设计稿一致的无箭头样式。

```tsx preview
import { Button, Popconfirm } from '@ve-design/react';

<section
  style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 180,
    padding: 32,
  }}
>
  <Popconfirm
    arrow
    showIcon={false}
    title="Archive thread?"
    content="Archived threads can be restored later."
    okText="Archive"
    cancelText="Cancel"
  >
    <Button type="primary">Archive</Button>
  </Popconfirm>
</section>;
```

### 富内容插槽

`title`、`content` 和 `icon` 均支持 ReactNode。传入内容会覆盖对应的文本属性或默认图标。

```tsx preview
import { Button, Popconfirm } from '@ve-design/react';
import { IconFileCheck } from '@ve-design/react/icons';

function PopconfirmRichContentDemo() {
  const detailStyle = {
    color: 'var(--color-text-tertiary)',
    fontSize: 12,
    lineHeight: '18px',
  };

  return (
    <section
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 220,
        padding: 32,
      }}
    >
      <Popconfirm
        okText="Publish"
        cancelText="Review"
        icon={
          <IconFileCheck
            aria-hidden="true"
            style={{ color: 'var(--color-text-info)' }}
          />
        }
        title={
          <span style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span>Publish release note?</span>
            <small style={detailStyle}>Design System · 2 min read</small>
          </span>
        }
        content={
          <span style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={detailStyle}>
              Share the latest component updates with workspace members.
            </span>
            <span style={detailStyle}>The draft stays editable after publishing.</span>
          </span>
        }
      >
        <Button type="primary">Publish update</Button>
      </Popconfirm>
    </section>
  );
}
```

### 操作区自定义

使用 `cancel` 和 `confirm` 可以只替换内置按钮内容，仍保留默认的关闭行为、禁用态和确认/取消事件。使用 `actions` 会替换整行操作区，适合增加额外按钮、加载态或完全自定义操作逻辑；此时自定义按钮需要自行调用实例方法或控制 `open`，示例通过受控 `open` 主动关闭气泡。

```tsx preview
import { useState } from 'react';
import { Button, Popconfirm } from '@ve-design/react';

function PopconfirmActionsDemo() {
  const [open, setOpen] = useState(false);

  return (
    <section
      style={{
        boxSizing: 'border-box',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 20,
        minHeight: 180,
        padding: '48px 24px',
      }}
    >
      <Popconfirm
        showIcon={false}
        title="Discard draft?"
        content="The current prompt draft will be removed."
        okText="Discard"
        cancelText="Keep editing"
        cancel="Keep editing"
        confirm={<span style={{ color: 'var(--color-text-danger)' }}>Discard</span>}
      >
        <Button type="outline">Discard</Button>
      </Popconfirm>

      <Popconfirm
        open={open}
        showIcon={false}
        title="Apply changes?"
        content="Review the details before applying."
        okText="Apply"
        cancelText="Review"
        onOpenChange={(event) => {
          setOpen(event.detail.open);
        }}
        actions={
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            <Button
              type="outline"
              size="small"
              onClick={() => {
                setOpen(false);
              }}
            >
              Review
            </Button>
            <Button
              type="primary"
              size="small"
              onClick={() => {
                setOpen(false);
              }}
            >
              Apply
            </Button>
          </span>
        }
      >
        <Button type="primary">Apply patch</Button>
      </Popconfirm>
    </section>
  );
}
```

### 受控状态与事件

使用 `open` 可以受控展示。`onOpenChange` 会在打开或关闭请求时触发，`onConfirm` 和 `onCancel` 分别对应确认和取消操作；未调用 `event.preventDefault()` 时，内置确认和取消操作会按默认行为请求关闭。

```tsx preview
import { useState } from 'react';
import { Button, Popconfirm } from '@ve-design/react';

function PopconfirmEventDemo() {
  const [open, setOpen] = useState(false);
  const [log, setLog] = useState('Waiting for action.');

  return (
    <section
      style={{
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 14,
        minHeight: 180,
        padding: '44px 24px',
      }}
    >
      <Popconfirm
        open={open}
        title="Submit changes?"
        content="Submit the current changes for review."
        okText="Submit"
        cancelText="Cancel"
        onOpenChange={(event) => {
          setOpen(event.detail.open);
          setLog(`open=${event.detail.open}, source=${event.detail.source}`);
        }}
        onConfirm={() => {
          setOpen(false);
          setLog('Confirmed.');
        }}
        onCancel={() => {
          setOpen(false);
          setLog('Cancelled.');
        }}
      >
        <Button type="primary">Commit</Button>
      </Popconfirm>
      <div
        style={{
          minInlineSize: 260,
          color: 'var(--color-text-tertiary)',
          fontSize: 12,
          lineHeight: 1.5,
          textAlign: 'center',
        }}
      >
        {log}
      </div>
    </section>
  );
}
```

### 禁用状态

设置 `disabled` 后，触发节点不可操作并且气泡不会展示。也可以单独使用 `okDisabled` 或 `cancelDisabled` 禁用内置确认/取消按钮。

```tsx preview
import { Button, Popconfirm } from '@ve-design/react';

<section
  style={{
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
    minHeight: 180,
    padding: 32,
  }}
>
  <Popconfirm
    disabled
    title="Delete run?"
    content="This popconfirm is disabled."
    okText="Delete"
    cancelText="Cancel"
  >
    <Button>Disabled trigger</Button>
  </Popconfirm>

  <Popconfirm
    okDisabled
    title="Stop run?"
    content="Confirm is disabled while syncing."
    okText="Stop"
    cancelText="Cancel"
  >
    <Button type="outline">Disabled confirm</Button>
  </Popconfirm>
</section>;
```

## API

### Props

| 属性名           | 描述                                                               | 类型                                                                                                                                                                 | 默认值                       |
| ---------------- | ------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------- |
| `position`       | 气泡优先展示位置，支持 `top`、`bottom`、`left`、`right` 及对齐位置 | `'top' \| 'top-start' \| 'top-end' \| 'bottom' \| 'bottom-start' \| 'bottom-end' \| 'left' \| 'left-start' \| 'left-end' \| 'right' \| 'right-start' \| 'right-end'` | `'top'`                      |
| `title`          | 标题文本或自定义标题内容                                           | `React.ReactNode`                                                                                                                                                    | `'标题'`                     |
| `content`        | 描述文本或自定义描述内容                                           | `React.ReactNode`                                                                                                                                                    | `'这里是一条文本描述内容。'` |
| `okText`         | 确认按钮默认文案；使用 `confirm` 后由其内容替换                    | `string`                                                                                                                                                             | `'确定'`                     |
| `cancelText`     | 取消按钮默认文案；使用 `cancel` 后由其内容替换                     | `string`                                                                                                                                                             | `'取消'`                     |
| `open`           | 受控打开状态                                                       | `boolean`                                                                                                                                                            | `undefined`                  |
| `defaultOpen`    | 非受控默认打开状态                                                 | `boolean`                                                                                                                                                            | `false`                      |
| `disabled`       | 是否禁用触发和气泡展示                                             | `boolean`                                                                                                                                                            | `false`                      |
| `okDisabled`     | 是否禁用确认按钮                                                   | `boolean`                                                                                                                                                            | `false`                      |
| `cancelDisabled` | 是否禁用取消按钮                                                   | `boolean`                                                                                                                                                            | `false`                      |
| `showIcon`       | 是否展示左侧图标                                                   | `boolean`                                                                                                                                                            | `true`                       |
| `arrow`          | 是否展示指向触发节点的箭头                                         | `boolean`                                                                                                                                                            | `false`                      |
| `triggerNode`    | 触发节点；未设置时使用 `children`                                  | `React.ReactNode`                                                                                                                                                    | `-`                          |
| `children`       | 触发节点                                                           | `React.ReactNode`                                                                                                                                                    | `-`                          |
| `icon`           | 自定义左侧图标，仅在 `showIcon` 启用时渲染                         | `React.ReactNode`                                                                                                                                                    | `-`                          |
| `cancel`         | 自定义内置取消按钮内容，保留默认取消事件和关闭行为                 | `React.ReactNode`                                                                                                                                                    | `-`                          |
| `confirm`        | 自定义内置确认按钮内容，保留默认确认事件和关闭行为                 | `React.ReactNode`                                                                                                                                                    | `-`                          |
| `actions`        | 自定义整行操作区，会替换内置取消和确认按钮                         | `React.ReactNode`                                                                                                                                                    | `-`                          |

### 事件

| 事件名         | 描述                                                                                             | 参数类型                                                             |
| -------------- | ------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------- |
| `onOpenChange` | 打开或关闭请求触发；`source` 可能为 `trigger`、`confirm`、`cancel`、`outside`、`escape` 或 `api` | `CustomEvent<{ open: boolean; source: PopconfirmOpenChangeSource }>` |
| `onConfirm`    | 点击内置确认按钮触发；调用 `event.preventDefault()` 后不会自动关闭                               | `CustomEvent<{ sourceEvent: Event }>`                                |
| `onCancel`     | 点击内置取消按钮触发；调用 `event.preventDefault()` 后不会自动关闭                               | `CustomEvent<{ sourceEvent: Event }>`                                |

### Ref

可通过 `ref` 调用组件实例上的 `show()`、`hide()`、`toggle(open?: boolean)` 和 `focus(options?: FocusOptions)` 方法。
