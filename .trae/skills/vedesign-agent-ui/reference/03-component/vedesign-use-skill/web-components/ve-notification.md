`ve-notification` 用于在页面角落展示全局通知，承载操作结果、异步任务状态和需要用户关注的系统反馈。推荐使用 `Notification` 命令式 API 创建通知；`<ve-notification>` 元素适用于局部预览或自定义容器中的单条通知。

## 何时使用

- 需要展示异步任务、接口请求或系统状态的结果。
- 通知内容需要标题、说明、状态图标或后续操作。
- 信息不应阻断当前流程，但需要在短时间内获得关注。
- 需要保留一段时间，或由用户主动关闭。

## 引入组件

```ts
import '@ve-design/web/ve-notification';
```

命令式 API 从同一入口导入：

```ts
import { Notification } from '@ve-design/web/ve-notification';
```

## 示例

### 基础用法

使用 `Notification` 在当前页面创建全局通知。`type` 支持 `info`、`success`、`warning`、`error`。

```html preview
<script type="module">
  import '@ve-design/web/ve-button';
  import { Notification } from '@ve-design/web/ve-notification';

  const notifyMap = {
    success: () =>
      Notification.success({
        title: 'Indexing completed',
        content: 'The workspace knowledge base is ready for the next agent run.',
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

  window.openNotification = (type) => {
    notifyMap[type]?.();
  };
</script>

<style>
  .notification-demo-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    align-items: center;
    justify-content: center;
    padding: 24px;
  }
</style>

<section class="notification-demo-actions">
  <ve-button
    type="primary"
    status="success"
    onclick="window.openNotification('success')"
  >
    Success
  </ve-button>
  <ve-button
    type="secondary"
    status="default"
    onclick="window.openNotification('info')"
  >
    Info
  </ve-button>
  <ve-button
    type="outline"
    status="warning"
    onclick="window.openNotification('warning')"
  >
    Warning
  </ve-button>
  <ve-button
    type="secondary"
    status="danger"
    onclick="window.openNotification('error')"
  >
    Error
  </ve-button>
</section>
```

### 内容与操作

`content` 支持自定义渲染内容，`actions` 用于承载通知底部操作。

```html preview
<script type="module">
  import '@ve-design/web/ve-button';
  import '@ve-design/web/ve-link';
  import { Notification } from '@ve-design/web/ve-notification';

  window.openRichNotification = () => {
    Notification.success({
      title: 'Evaluation finished',
      content: (container) => {
        const text = document.createElement('span');
        text.textContent = 'The run scored 96.2 and generated a review report. ';

        const link = document.createElement('ve-link');
        link.href = '/runs/latest';
        link.underline = true;
        link.textContent = 'View report';

        container.append(text, link);
      },
      closable: true,
      duration: 0,
      actions: (container, { close }) => {
        const later = document.createElement('ve-button');
        later.type = 'text';
        later.size = 'small';
        later.textContent = 'Later';
        later.addEventListener('click', close);

        const open = document.createElement('ve-button');
        open.type = 'text';
        open.size = 'small';
        open.textContent = 'Open';
        open.addEventListener('click', close);

        container.append(later, open);
      },
    });
  };
</script>

<section style="display:grid; place-items:center; padding:24px;">
  <ve-button type="primary" onclick="window.openRichNotification()">
    Open report notification
  </ve-button>
</section>
```

### 更新通知

传入稳定的 `id` 后，再次调用会更新同一条通知。该模式适用于展示任务状态流转。

```html preview
<script type="module">
  import '@ve-design/web/ve-button';
  import { Notification } from '@ve-design/web/ve-notification';

  const notificationId = 'agent-evaluation-status';
  let timer = 0;

  window.runEvaluationDemo = () => {
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
  };
</script>

<section style="display:grid; place-items:center; padding:24px;">
  <ve-button type="primary" onclick="window.runEvaluationDemo()">
    Run evaluation
  </ve-button>
</section>
```

### 位置和清除

`position` 控制通知位置。`Notification.clear()` 用于关闭当前所有通知。

```html preview
<script type="module">
  import '@ve-design/web/ve-button';
  import { Notification } from '@ve-design/web/ve-notification';

  window.openCornerNotifications = () => {
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
  };

  window.clearNotifications = () => {
    Notification.clear();
  };
</script>

<style>
  .notification-demo-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    align-items: center;
    justify-content: center;
    padding: 24px;
  }
</style>

<section class="notification-demo-actions">
  <ve-button type="primary" onclick="window.openCornerNotifications()">
    Open positioned notices
  </ve-button>
  <ve-button type="secondary" onclick="window.clearNotifications()">
    Clear all
  </ve-button>
</section>
```

### 静态展示

直接渲染 `<ve-notification>` 可展示单条通知。示例设置 `duration="0"`，避免通知自动关闭。

```html preview
<script type="module">
  import '@ve-design/web/ve-notification';
</script>

<style>
  .notification-demo-stack {
    display: grid;
    gap: 16px;
    justify-content: center;
    padding: 24px;
  }
</style>

<section class="notification-demo-stack">
  <ve-notification
    type="error"
    title="Error notification"
    content="The current deployment failed during policy validation."
    duration="0"
  ></ve-notification>

  <ve-notification
    type="success"
    title="Success notification"
    content="Knowledge indexing completed for the selected workspace."
    duration="0"
  ></ve-notification>

  <ve-notification
    type="info"
    title="Info notification"
    content="A new agent runtime is available for this project."
    duration="0"
  ></ve-notification>

  <ve-notification
    type="warning"
    title="Warning notification"
    content="Model quota is close to the team threshold."
    duration="0"
  ></ve-notification>
</section>
```

### 关闭

设置 `closable` 后展示关闭按钮。关闭前触发 `ve-close`，退出动画结束后触发 `ve-after-close`。

```html preview
<script type="module">
  import '@ve-design/web/ve-notification';
</script>

<style>
  .notification-demo-stack {
    display: grid;
    gap: 16px;
    justify-content: center;
    padding: 24px;
  }
</style>

<section class="notification-demo-stack">
  <ve-notification
    id="notification-close-demo"
    type="warning"
    title="Manual review required"
    content="The latest agent run contains high-risk tool usage."
    closable
    duration="0"
  ></ve-notification>
</section>

<script type="module">
  const item = document.querySelector('#notification-close-demo');

  item.addEventListener('ve-close', (event) => {
    console.log('closing notification', event.detail);
  });
</script>
```

### 操作区

使用 `actions` 插槽放置操作按钮。操作区位于通知底部并右对齐。

```html preview
<script type="module">
  import '@ve-design/web/ve-button';
  import '@ve-design/web/ve-link';
  import '@ve-design/web/ve-notification';
</script>

<style>
  .notification-demo-stack {
    display: grid;
    gap: 16px;
    justify-content: center;
    padding: 24px;
  }

  .notification-demo-actions-slot {
    display: flex;
    gap: 8px;
    align-items: center;
  }
</style>

<section class="notification-demo-stack">
  <ve-notification
    type="error"
    title="Deployment blocked"
    closable
    duration="0"
  >
    <span>
      Security checks found one unresolved approval item.
      <ve-link href="/components/ve-popconfirm" underline>Review policy</ve-link>
    </span>
    <div class="notification-demo-actions-slot" slot="actions">
      <ve-button type="text" size="small">Cancel</ve-button>
      <ve-button type="text" size="small">Resolve</ve-button>
    </div>
  </ve-notification>
</section>
```

### 自定义图标

`title`、默认插槽和 `icon` 插槽分别用于自定义标题、内容和状态图标。设置 `show-icon="false"` 可隐藏图标。

```html preview
<script type="module">
  import '@ve-design/web/ve-notification';
  import '@ve-design/web/icons/robot';
</script>

<style>
  .notification-demo-stack {
    display: grid;
    gap: 16px;
    justify-content: center;
    padding: 24px;
  }
</style>

<section class="notification-demo-stack">
  <ve-notification type="success" closable duration="0">
    <ve-icon slot="icon" name="robot" aria-hidden="true"></ve-icon>
    <strong slot="title">Agent run completed</strong>
    <span>
      Generated summary, action items, and trace metadata are ready for review.
    </span>
  </ve-notification>

  <ve-notification
    title="Silent system note"
    content="This notice intentionally hides the status icon."
    show-icon="false"
    duration="0"
  ></ve-notification>
</section>
```

## API

### 属性

| 属性名            | 说明                                             | 类型                                                           | 默认值        |
| ----------------- | ------------------------------------------------ | -------------------------------------------------------------- | ------------- |
| `type`            | 通知类型。                                       | `'info' \| 'success' \| 'warning' \| 'error'`                  | `'info'`      |
| `title`           | 标题文本；存在 `title` 插槽时以插槽内容为准。    | `string`                                                       | `''`          |
| `content`         | 内容文本；存在默认插槽内容时以默认插槽为准。     | `string`                                                       | `''`          |
| `notification-id` | 通知唯一标识，用于命令式 API 更新已有通知。      | `string`                                                       | `''`          |
| `position`        | 通知位置。                                       | `'top-right' \| 'top-left' \| 'bottom-right' \| 'bottom-left'` | `'top-right'` |
| `show-icon`       | 是否展示状态图标。                               | `boolean`                                                      | `true`        |
| `closable`        | 是否展示关闭按钮。                               | `boolean`                                                      | `false`       |
| `duration`        | 自动关闭时长，单位毫秒；设置为 `0` 时不自动关闭。 | `number`                                                       | `3000`        |
| `enter-duration`  | 进入动画时长，单位毫秒。                         | `number`                                                       | `100`         |
| `exit-duration`   | 退出动画时长，单位毫秒。                         | `number`                                                       | `300`         |

### 插槽

| 插槽名       | 说明                                                |
| ------------ | --------------------------------------------------- |
| 默认插槽     | 自定义通知内容，优先级高于 `content` 属性。         |
| `title`      | 自定义标题，优先级高于 `title` 属性。               |
| `icon`       | 自定义状态图标，仅在 `show-icon` 为 `true` 时渲染。 |
| `actions`    | 底部操作区，适合放置一组 `ve-button` 或业务操作。   |
| `close-icon` | 自定义关闭图标，仅在 `closable` 为 `true` 时渲染。  |

### 事件

| 事件名                        | 触发时机                            | `event.detail`                                                      |
| ----------------------------- | ----------------------------------- | ------------------------------------------------------------------- |
| `ve-close`                    | 通知开始关闭前，调用 `preventDefault()` 可阻止关闭 | `{ id?: string; type: NotificationType; sourceEvent?: MouseEvent }` |
| `ve-after-close`              | 退出动画结束后                      | `{ id?: string; type: NotificationType; sourceEvent?: MouseEvent }` |

### 方法

| 方法名           | 说明                                                   |
| ---------------- | ------------------------------------------------------ |
| `close()`        | 使用与关闭按钮一致的动画关闭通知。                     |
| `restartTimer()` | 重新启动自动关闭计时器；`duration` 为 `0` 时不会计时。 |

### Notification 命令式 API

```ts
type NotificationPosition =
  | 'top-right'
  | 'top-left'
  | 'bottom-right'
  | 'bottom-left';

type NotificationType = 'info' | 'success' | 'warning' | 'error';

type NotificationContent =
  | string
  | Node
  | ((
      container: HTMLElement,
      context: { element: VeNotificationElement; close: () => void },
    ) => void | string | Node | (() => void));

interface NotificationOptions {
  title?: NotificationContent;
  content: NotificationContent;
  type?: NotificationType;
  id?: string;
  duration?: number;
  showIcon?: boolean;
  icon?: string | Node;
  closable?: boolean;
  closeIcon?: string | Node;
  actions?: string | Node | NotificationContent;
  position?: NotificationPosition;
  onClose?: () => void;
}

interface NotificationStatic {
  info(config: NotificationOptions | NotificationContent): () => void;
  success(config: NotificationOptions | NotificationContent): () => void;
  warning(config: NotificationOptions | NotificationContent): () => void;
  error(config: NotificationOptions | NotificationContent): () => void;
  addInstance(config: NotificationOptions): () => void;
  clear(): void;
}
```
