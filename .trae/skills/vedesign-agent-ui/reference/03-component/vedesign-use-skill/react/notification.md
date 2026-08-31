`Notification` 用于在页面角落展示全局通知，承载操作结果、异步任务状态和需要用户关注的系统反馈。推荐使用 `Notification.info`、`Notification.success` 等静态 API 创建通知；也可以直接渲染 `<Notification />` 展示单条通知。

## 何时使用

- 需要展示异步任务、接口请求或系统状态的结果。
- 通知内容需要标题、说明、状态图标或后续操作。
- 信息不应阻断当前流程，但需要在短时间内获得关注。
- 需要保留一段时间，或由用户主动关闭。

## 引入组件

```tsx
import { Notification } from '@ve-design/react';
```

## 示例

### 基础用法

使用静态 API 在当前页面创建全局通知。`type` 支持 `info`、`success`、`warning`、`error`。

```tsx preview
import { Button, Notification } from '@ve-design/react';

function NotificationBasicDemo() {
  const notifyMap = {
    success: () =>
      Notification.success({
        title: 'Indexing completed',
        content:
          'The workspace knowledge base is ready for the next agent run.',
        closable: true,
      }),
    info: () =>
      Notification.info({
        title: 'Runtime update available',
        content: 'A new agent runtime can be enabled for this project.',
        closable: true,
      }),
    warning: () =>
      Notification.warning({
        title: 'Quota is almost full',
        content: 'The team has used 86% of its monthly model quota.',
        closable: true,
      }),
    error: () =>
      Notification.error({
        title: 'Deployment blocked',
        content: 'Security checks found one unresolved approval item.',
        closable: true,
        duration: 0,
      }),
  };

  return (
    <section
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 8,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
      }}
    >
      <Button type="primary" status="success" onClick={notifyMap.success}>
        Success
      </Button>
      <Button type="secondary" status="default" onClick={notifyMap.info}>
        Info
      </Button>
      <Button type="outline" status="warning" onClick={notifyMap.warning}>
        Warning
      </Button>
      <Button type="secondary" status="danger" onClick={notifyMap.error}>
        Error
      </Button>
    </section>
  );
}
```

### 内容与操作

`content` 支持自定义渲染内容，`actions` 用于承载通知底部操作。

```tsx preview
import { Button, Link, Notification } from '@ve-design/react';

function NotificationRichContentDemo() {
  function openRichNotification() {
    let close: () => void = () => undefined;

    close = Notification.success({
      title: 'Evaluation finished',
      content: (
        <span>
          The run scored 96.2 and generated a review report.{' '}
          <Link href="/runs/latest" underline>
            View report
          </Link>
        </span>
      ),
      closable: true,
      duration: 0,
      actions: (
        <>
          <Button type="text" size="small" onClick={() => close()}>
            Later
          </Button>
          <Button type="text" size="small" onClick={() => close()}>
            Open
          </Button>
        </>
      ),
    });
  }

  return (
    <section style={{ display: 'grid', placeItems: 'center', padding: 24 }}>
      <Button type="primary" onClick={openRichNotification}>
        Open report notification
      </Button>
    </section>
  );
}
```

### 更新通知

传入稳定的 `id` 后，再次调用会更新同一条通知。该模式适用于展示任务状态流转。

```tsx preview
import { Button, Notification } from '@ve-design/react';

function NotificationUpdateDemo() {
  const notificationId = 'agent-evaluation-status';
  let timer = 0;

  function runEvaluation() {
    window.clearTimeout(timer);

    Notification.info({
      id: notificationId,
      title: 'Evaluation started',
      content: 'Running prompt quality, citation, and safety checks.',
      closable: true,
      duration: 0,
    });

    timer = window.setTimeout(() => {
      Notification.success({
        id: notificationId,
        title: 'Evaluation passed',
        content: 'All checks passed. The result has been attached to this run.',
        closable: true,
        duration: 4000,
      });
    }, 1200);
  }

  return (
    <section style={{ display: 'grid', placeItems: 'center', padding: 24 }}>
      <Button type="primary" onClick={runEvaluation}>
        Run evaluation
      </Button>
    </section>
  );
}
```

### 位置和清除

`position` 控制通知位置。`Notification.clear()` 用于关闭当前所有通知。

```tsx preview
import { Button, Notification } from '@ve-design/react';

function NotificationPositionDemo() {
  function openCornerNotifications() {
    Notification.info({
      title: 'Top left',
      content: 'The sync task has started.',
      position: 'top-left',
      closable: true,
    });

    Notification.warning({
      title: 'Bottom right',
      content: 'One dataset is waiting for manual review.',
      position: 'bottom-right',
      closable: true,
      duration: 0,
    });
  }

  return (
    <section
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 8,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
      }}
    >
      <Button type="primary" onClick={openCornerNotifications}>
        Open positioned notices
      </Button>
      <Button type="secondary" onClick={() => Notification.clear()}>
        Clear all
      </Button>
    </section>
  );
}
```

### 静态展示

直接渲染 `<Notification />` 可展示单条通知。示例设置 `duration={0}`，避免通知自动关闭。

```tsx preview
import { Notification } from '@ve-design/react';

<section
  style={{
    display: 'grid',
    gap: 16,
    justifyContent: 'center',
    padding: 24,
  }}
>
  <Notification
    type="error"
    title="Error notification"
    content="The current deployment failed during policy validation."
    duration={0}
  />

  <Notification
    type="success"
    title="Success notification"
    content="Knowledge indexing completed for the selected workspace."
    duration={0}
  />

  <Notification
    type="info"
    title="Info notification"
    content="A new agent runtime is available for this project."
    duration={0}
  />

  <Notification
    type="warning"
    title="Warning notification"
    content="Model quota is close to the team threshold."
    duration={0}
  />
</section>;
```

### 关闭

设置 `closable` 后展示关闭按钮。静态 API 的 `onClose` 配置会在通知完成离场后触发；直接渲染 `<Notification />` 时，关闭前触发 `onClose`，退出动画结束后触发 `onAfterClose`，两者语义不要与静态 API 回调混用。

```tsx preview
import { useState } from 'react';
import { Notification } from '@ve-design/react';

function NotificationCloseDemo() {
  const [log, setLog] = useState('Waiting for close event.');

  return (
    <section
      style={{
        display: 'grid',
        placeItems: 'center',
        gap: 12,
        padding: 24,
      }}
    >
      <Notification
        type="warning"
        title="Manual review required"
        content="The latest agent run contains high-risk tool usage."
        closable
        duration={0}
        onClose={(event) => {
          setLog(`ve-close: ${event.detail.type}`);
        }}
        onAfterClose={(event) => {
          setLog(`ve-after-close: ${event.detail.type}`);
        }}
      />
      <code style={{ color: 'var(--color-text-secondary)' }}>{log}</code>
    </section>
  );
}
```

### 操作区

使用 `actions` 放置操作按钮。操作区位于通知底部并右对齐。

```tsx preview
import { Button, Link, Notification } from '@ve-design/react';

<section
  style={{
    display: 'grid',
    gap: 16,
    justifyContent: 'center',
    padding: 24,
  }}
>
  <Notification
    type="error"
    title="Deployment blocked"
    closable
    duration={0}
    actions={
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <Button type="text" size="small">
          Cancel
        </Button>
        <Button type="text" size="small">
          Resolve
        </Button>
      </div>
    }
  >
    <span>
      Security checks found one unresolved approval item.{' '}
      <Link href="/components/ve-popconfirm" underline>
        Review policy
      </Link>
    </span>
  </Notification>
</section>;
```

### 自定义图标

`title`、`children` 和 `icon` 分别用于自定义标题、内容和状态图标。设置 `showIcon={false}` 可隐藏图标。

```tsx preview
import { Notification } from '@ve-design/react';
import { IconRobot } from '@ve-design/react/icons';

<section
  style={{
    display: 'grid',
    gap: 16,
    justifyContent: 'center',
    padding: 24,
  }}
>
  <Notification
    type="success"
    title={<strong>Agent run completed</strong>}
    icon={<IconRobot aria-hidden="true" />}
    closable
    duration={0}
  >
    Generated summary, action items, and trace metadata are ready for review.
  </Notification>

  <Notification
    title="Silent system note"
    content="This notice intentionally hides the status icon."
    showIcon={false}
    duration={0}
  />
</section>;
```

## API

### Props

| 属性名           | 描述                                             | 类型                                                           | 默认值        |
| ---------------- | ------------------------------------------------ | -------------------------------------------------------------- | ------------- |
| `type`           | 通知类型                                         | `'info' \| 'success' \| 'warning' \| 'error'`                  | `'info'`      |
| `title`          | 通知标题                                         | `React.ReactNode`                                              | `''`          |
| `content`        | 通知内容；也可通过 `children` 传入               | `React.ReactNode`                                              | `''`          |
| `notificationId` | 通知唯一标识，可用于区分或更新通知               | `string`                                                       | `''`          |
| `position`       | 通知位置                                         | `'top-right' \| 'top-left' \| 'bottom-right' \| 'bottom-left'` | `'top-right'` |
| `showIcon`       | 是否展示状态图标                                 | `boolean`                                                      | `true`        |
| `closable`       | 是否展示关闭按钮                                 | `boolean`                                                      | `false`       |
| `duration`       | 自动关闭时长，单位毫秒；设置为 `0` 时不自动关闭  | `number`                                                       | `3000`        |
| `enterDuration`  | 进入动画时长，单位毫秒                           | `number`                                                       | `100`         |
| `exitDuration`   | 退出动画时长，单位毫秒                           | `number`                                                       | `300`         |
| `icon`           | 自定义状态图标，`showIcon` 开启时展示            | `React.ReactNode`                                              | `-`           |
| `closeIcon`      | 自定义关闭图标，`closable` 开启时展示            | `React.ReactNode`                                              | `-`           |
| `actions`        | 底部操作区内容                                   | `React.ReactNode`                                              | `-`           |
| `children`       | 通知内容；`content` 不传或不是文本内容时作为正文 | `React.ReactNode`                                              | `-`           |

### 事件

| 事件名         | 描述                                                           | 参数类型                                                                         |
| -------------- | -------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| `onClose`      | 通知开始关闭前触发；调用 `event.preventDefault()` 可阻止关闭。 | `CustomEvent<{ id?: string; type: NotificationType; sourceEvent?: MouseEvent }>` |
| `onAfterClose` | 退出动画结束后触发                                             | `CustomEvent<{ id?: string; type: NotificationType; sourceEvent?: MouseEvent }>` |

### Ref

可通过 `ref` 调用 Notification 实例方法 `close()` 或 `restartTimer()`。

### 静态方法

静态 API 用于创建和更新全局通知，关闭后返回的回调可主动移除当前通知。

| 方法                                    | 描述                 | 返回值                      |
| --------------------------------------- | -------------------- | --------------------------- |
| `Notification.info(configOrContent)`    | 打开信息通知         | `NotificationCloseFunction` |
| `Notification.success(configOrContent)` | 打开成功通知         | `NotificationCloseFunction` |
| `Notification.warning(configOrContent)` | 打开警告通知         | `NotificationCloseFunction` |
| `Notification.error(configOrContent)`   | 打开错误通知         | `NotificationCloseFunction` |
| `Notification.addInstance(config)`      | 使用完整配置创建通知 | `NotificationCloseFunction` |
| `Notification.clear()`                  | 关闭当前全部通知     | `void`                      |

### 类型定义

#### NotificationOptions

| 参数名      | 描述                                      | 类型                                                            | 默认值      |
| ----------- | ----------------------------------------- | --------------------------------------------------------------- | ----------- |
| `title`     | 通知标题                                  | `React.ReactNode \| Node \| NotificationContentRenderer`        | `undefined` |
| `content`   | 通知内容                                  | `React.ReactNode \| Node \| NotificationContentRenderer`        | 必填        |
| `type`      | 通知类型                                  | `'info' \| 'success' \| 'warning' \| 'error'`                   | `'info'`    |
| `id`        | 唯一标识；相同 `id` 会更新已有通知        | `string`                                                        | 自动生成    |
| `duration`  | 自动关闭时间，单位 ms；`0` 表示不自动关闭 | `number`                                                        | `3000`      |
| `showIcon`  | 是否显示状态图标                          | `boolean`                                                       | `true`      |
| `icon`      | 自定义图标                                | `React.ReactNode \| Node`                                       | `undefined` |
| `closable`  | 是否显示关闭按钮                          | `boolean`                                                       | `false`     |
| `closeIcon` | 自定义关闭图标                            | `React.ReactNode \| Node`                                       | `undefined` |
| `actions`   | 底部操作区内容                            | `React.ReactNode \| Node \| NotificationContentRenderer`        | `undefined` |
| `position`  | 通知位置                                  | `'top-right' \| 'top-left' \| 'bottom-right' \| 'bottom-left'` | `'top-right'` |
| `onClose`   | 离场动画结束后的回调                      | `() => void`                                                    | `undefined` |

#### NotificationContentRenderer

```ts
type NotificationContentRenderer = (
  container: HTMLElement,
  context: { element: VeNotificationElement; close: () => void },
) => void | string | Node | React.ReactNode | (() => void);
```
