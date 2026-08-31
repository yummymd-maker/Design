`Alert` 用于展示页面内较稳定的反馈、提醒和状态说明。组件负责反馈容器、状态图标和关闭能力；标题、说明、操作入口等内容可以通过 `children` 自由组合。

## 何时使用

- 页面内需要展示不会立即消失的提示信息。
- 需要用 `type` 区分普通信息、信息态、成功、警告和错误状态。
- 提示内容需要包含标题、说明、操作入口或开关等业务结构。
- 需要自定义状态图标、隐藏图标，或提供可关闭交互。

## 引入组件

```tsx
import { Alert } from '@ve-design/react';
```

## 示例

### 基础用法

`type` 支持 `neutral`、`info`、`success`、`warning`、`error`。

```tsx preview
import { Alert } from '@ve-design/react';

<section
  style={{
    display: 'grid',
    placeItems: 'center',
    padding: 24,
  }}
>
  <div style={{ display: 'grid', gap: 12, width: 'min(100%, 720px)' }}>
    <Alert>Workspace settings are synced every 5 minutes.</Alert>
    <Alert type="info">New system update notes are available.</Alert>
    <Alert type="success">
      Knowledge indexing completed for 128 documents.
    </Alert>
    <Alert type="warning">
      Prompt evaluation drift is higher than the team baseline.
    </Alert>
    <Alert type="error">Deployment is blocked by a failed safety check.</Alert>
  </div>
</section>;
```

### 图标与关闭

使用 `showIcon={false}` 隐藏图标；通过 `icon` 传入自定义图标；设置 `closable` 展示关闭按钮。

```tsx preview
import { Alert } from '@ve-design/react';
import { IconRobot } from '@ve-design/react/icons';

<section
  style={{
    display: 'grid',
    placeItems: 'center',
    padding: 24,
  }}
>
  <div style={{ display: 'grid', gap: 12, width: 'min(100%, 720px)' }}>
    <Alert showIcon={false}>
      Draft saved locally. It will sync when the workspace is online.
    </Alert>
    <Alert type="info" icon={<IconRobot aria-hidden="true" />}>
      Agent routing has switched to safe mode.
    </Alert>
    <Alert type="warning" closable>
      Long-context mode is enabled for the next evaluation run.
    </Alert>
  </div>
</section>;
```

### 自定义内容

通过 `children` 自由组合标题、描述、操作入口和表单控件。

```tsx preview
import type { CSSProperties } from 'react';
import { Alert, Button, Link, Switch } from '@ve-design/react';

function AlertContentDemo() {
  const titleStyle: CSSProperties = {
    color: 'currentColor',
    fontSize: 'var(--text-body)',
    fontWeight: 'var(--font-weight-normal, 400)',
    lineHeight: 'var(--line-height-body)',
  };

  const descStyle: CSSProperties = {
    color: 'var(--color-text-secondary)',
  };

  const copyStyle: CSSProperties = {
    display: 'grid',
    gap: 'var(--space-xxs)',
    minWidth: 0,
  };

  const rowStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 'var(--space-xs)',
    minWidth: 0,
  };

  const actionsStyle: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 'var(--space-xxs)',
    flex: 'none',
  };

  const centerIconStyle = {
    '--ve-alert-icon-align-self': 'center',
  } as CSSProperties;

  return (
    <section
      style={{
        display: 'grid',
        placeItems: 'center',
        padding: 24,
      }}
    >
      <div style={{ display: 'grid', gap: 14, width: 'min(100%, 760px)' }}>
        <Alert>
          <span style={descStyle}>
            Workspace settings are synced every 5 minutes.
          </span>
        </Alert>

        <Alert type="info">
          <div style={copyStyle}>
            <span style={titleStyle}>New system update notes</span>
            <span style={descStyle}>
              Review the latest Agent runtime changes before the next release.
            </span>
          </div>
        </Alert>

        <Alert type="warning">
          <div style={copyStyle}>
            <span style={descStyle}>
              The current workflow may exhaust the shared quota before the next
              billing window.
            </span>
            <span style={actionsStyle}>
              <Link underline href="#" status="warning">
                Continue
              </Link>
              <Link underline href="#" status="warning">
                Ignore
              </Link>
            </span>
          </div>
        </Alert>

        <Alert>
          <div style={copyStyle}>
            <span style={titleStyle}>Current task is paused</span>
            <span style={descStyle}>
              Resume the task when the dependent review is completed.
            </span>
            <span style={actionsStyle}>
              <Button type="outline" size="small">
                Resume
              </Button>
            </span>
          </div>
        </Alert>

        <Alert type="success" style={centerIconStyle}>
          <div style={rowStyle}>
            <span style={titleStyle}>Knowledge indexing completed</span>
            <span style={actionsStyle}>
              <Link underline href="#" status="success">
                View report
              </Link>
              <Link underline href="#" status="success">
                Dismiss
              </Link>
            </span>
          </div>
        </Alert>

        <Alert type="info" style={centerIconStyle}>
          <div style={rowStyle}>
            <span style={titleStyle}>
              Notify team members when the run completes
            </span>
            <Switch size="small" aria-label="Notify team members" />
          </div>
        </Alert>
      </div>
    </section>
  );
}
```

### 关闭事件

点击关闭按钮会触发 `onClose`。调用 `event.preventDefault()` 可以阻止默认隐藏行为。

```tsx preview
import { useState } from 'react';
import { Alert } from '@ve-design/react';

function AlertCloseDemo() {
  const [message, setMessage] = useState('waiting for onClose');

  return (
    <section
      style={{
        display: 'grid',
        placeItems: 'center',
        gap: 12,
        padding: 24,
      }}
    >
      <Alert
        type="info"
        closable
        style={{ width: 'min(100%, 720px)' }}
        onClose={() => setMessage('onClose fired')}
      >
        Release notes are ready for review.
      </Alert>
      <code
        style={{
          width: 'min(100%, 720px)',
          color: 'var(--color-text-secondary)',
          fontSize: 'var(--text-body-sm)',
        }}
      >
        {message}
      </code>
    </section>
  );
}
```

## API

### Props

| 属性名     | 描述                                       | 类型                                                       | 默认值      |
| ---------- | ------------------------------------------ | ---------------------------------------------------------- | ----------- |
| `type`     | 设置提示类型                               | `'neutral' \| 'info' \| 'success' \| 'warning' \| 'error'` | `'neutral'` |
| `showIcon` | 是否展示状态图标                           | `boolean`                                                  | `true`      |
| `closable` | 是否展示关闭按钮；点击后触发 `onClose`     | `boolean`                                                  | `false`     |
| `icon`     | 自定义状态图标，`showIcon` 开启时展示      | `React.ReactNode`                                          | `-`         |
| `children` | 提示内容，可组合标题、正文、操作入口等结构 | `React.ReactNode`                                          | `-`         |

### 事件

| 事件名    | 描述                                                                   | 参数类型                                   |
| --------- | ---------------------------------------------------------------------- | ------------------------------------------ |
| `onClose` | 点击关闭按钮时触发；调用 `event.preventDefault()` 可阻止默认隐藏行为。 | `CustomEvent<{ sourceEvent: MouseEvent }>` |

### Ref

可通过 `ref` 访问 Alert 组件实例。
