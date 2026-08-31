`ve-alert` 用于展示页面内较稳定的反馈、提醒和状态说明。组件负责反馈容器、状态图标和关闭能力；标题、说明、操作入口等内容可以在默认插槽内自由组合。

## 何时使用

- 页面内需要展示不会立即消失的提示信息。
- 需要用 `type` 区分普通信息、信息态、成功、警告和错误状态。
- 提示内容需要包含标题、说明、操作入口或开关等业务结构。
- 需要自定义状态图标、隐藏图标，或提供可关闭交互。

## 引入组件

```ts
import '@ve-design/web/ve-alert';
```

## 示例

### 基础用法

`type` 支持 `neutral`、`info`、`success`、`warning`、`error`。

```html preview
<script type="module">
  import '@ve-design/web/ve-alert';
</script>

<style>
  .alert-demo {
    display: grid;
    place-items: center;
    padding: 24px;
  }

  .alert-demo-stack {
    display: grid;
    gap: 12px;
    width: min(100%, 720px);
  }
</style>

<section class="alert-demo">
  <div class="alert-demo-stack">
    <ve-alert>Workspace settings are synced every 5 minutes.</ve-alert>
    <ve-alert type="info">New system update notes are available.</ve-alert>
    <ve-alert type="success">
      Knowledge indexing completed for 128 documents.
    </ve-alert>
    <ve-alert type="warning">
      Prompt evaluation drift is higher than the team baseline.
    </ve-alert>
    <ve-alert type="error">
      Deployment is blocked by a failed safety check.
    </ve-alert>
  </div>
</section>
```

### 图标与关闭

使用 `show-icon="false"` 隐藏图标；通过 `icon` 插槽替换默认图标；设置 `closable` 展示关闭按钮。

```html preview
<script type="module">
  import '@ve-design/web/ve-alert';
  import '@ve-design/web/icons/robot';
</script>

<style>
  .alert-demo {
    display: grid;
    place-items: center;
    padding: 24px;
  }

  .alert-demo-stack {
    display: grid;
    gap: 12px;
    width: min(100%, 720px);
  }
</style>

<section class="alert-demo">
  <div class="alert-demo-stack">
    <ve-alert show-icon="false">
      Draft saved locally. It will sync when the workspace is online.
    </ve-alert>
    <ve-alert type="info">
      <ve-icon slot="icon" name="robot" aria-hidden="true"></ve-icon>
      Agent routing has switched to safe mode.
    </ve-alert>
    <ve-alert type="warning" closable>
      Long-context mode is enabled for the next evaluation run.
    </ve-alert>
  </div>
</section>
```

### 自定义内容

默认插槽内自由组合标题、描述、操作入口和表单控件。

```html preview
<script type="module">
  import '@ve-design/web/ve-alert';
  import '@ve-design/web/ve-button';
  import '@ve-design/web/ve-link';
  import '@ve-design/web/ve-switch';
</script>

<style>
  .alert-content-demo {
    display: grid;
    place-items: center;
    padding: 24px;
  }

  .alert-content-stack {
    display: grid;
    gap: 14px;
    width: min(100%, 760px);
  }

  .alert-content-copy {
    display: grid;
    gap: var(--space-xxs);
    min-width: 0;
  }

  .alert-content-row {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: var(--space-xs);
    min-width: 0;
  }

  .alert-content-title {
    color: currentColor;
    font-size: var(--text-body);
    font-weight: var(--font-weight-normal, 400);
    line-height: var(--line-height-body);
  }

  .alert-content-desc {
    color: var(--color-text-secondary);
  }

  .alert-content-actions {
    display: inline-flex;
    align-items: center;
    justify-content: flex-start;
    gap: var(--space-xxs);
    flex: none;
  }

  .alert-content-center-icon {
    --ve-alert-icon-align-self: center;
  }

  @media (max-width: 560px) {
    .alert-content-row {
      align-items: flex-start;
      flex-direction: column;
    }
  }
</style>

<section class="alert-content-demo">
  <div class="alert-content-stack">
    <ve-alert>
      <span class="alert-content-desc">
        Workspace settings are synced every 5 minutes.
      </span>
    </ve-alert>

    <ve-alert type="info">
      <div class="alert-content-copy">
        <span class="alert-content-title">New system update notes</span>
        <span class="alert-content-desc">
          Review the latest Agent runtime changes before the next release.
        </span>
      </div>
    </ve-alert>

    <ve-alert type="warning">
      <div class="alert-content-copy">
        <span class="alert-content-desc">
          The current workflow may exhaust the shared quota before the next
          billing window.
        </span>
        <span class="alert-content-actions">
          <ve-link underline href="#" status="warning">Continue</ve-link>
          <ve-link underline href="#" status="warning">Ignore</ve-link>
        </span>
      </div>
    </ve-alert>

    <ve-alert>
      <div class="alert-content-copy">
        <span class="alert-content-title">Current task is paused</span>
        <span class="alert-content-desc">
          Resume the task when the dependent review is completed.
        </span>
        <span class="alert-content-actions">
          <ve-button type="outline" size="small">Resume</ve-button>
        </span>
      </div>
    </ve-alert>

    <ve-alert class="alert-content-center-icon" type="success">
      <div class="alert-content-row">
        <span class="alert-content-title">Knowledge indexing completed</span>
        <span class="alert-content-actions">
          <ve-link underline href="#" status="success">View report</ve-link>
          <ve-link underline href="#" status="success">Dismiss</ve-link>
        </span>
      </div>
    </ve-alert>

    <ve-alert class="alert-content-center-icon" type="info">
      <div class="alert-content-row">
        <span class="alert-content-title">
          Notify team members when the run completes
        </span>
        <ve-switch size="small" aria-label="Notify team members"></ve-switch>
      </div>
    </ve-alert>
  </div>
</section>
```

### 关闭事件

点击关闭按钮会触发 `ve-close`。调用 `event.preventDefault()` 可以阻止默认隐藏行为。

```html preview
<script type="module">
  import '@ve-design/web/ve-alert';
</script>

<style>
  .alert-event-demo {
    display: grid;
    place-items: center;
    gap: 12px;
    padding: 24px;
  }

  .alert-event-demo ve-alert,
  .alert-event-log {
    width: min(100%, 720px);
  }

  .alert-event-log {
    color: var(--color-text-secondary);
    font-size: var(--text-body-sm);
  }
</style>

<section class="alert-event-demo">
  <ve-alert id="alert-close-event" type="info" closable>
    Release notes are ready for review.
  </ve-alert>
  <code id="alert-close-log" class="alert-event-log">waiting for ve-close</code>
</section>

<script>
  const alertElement = document.getElementById('alert-close-event');
  const log = document.getElementById('alert-close-log');

  alertElement.addEventListener('ve-close', () => {
    log.textContent = 've-close fired';
  });
</script>
```

## API

### ve-alert 属性

| 属性名      | 描述                                                        | 类型                                                                       | 默认值      |
| ----------- | ----------------------------------------------------------- | -------------------------------------------------------------------------- | ----------- |
| `type`      | 设置提示类型。                                              | `'neutral' &#124; 'info' &#124; 'success' &#124; 'warning' &#124; 'error'` | `'neutral'` |
| `show-icon` | 是否展示状态图标；HTML 中可写 `show-icon="false"` 隐藏。    | `boolean`                                                                  | `true`      |
| `closable`  | 是否展示关闭按钮；点击后派发 `ve-close`，未取消时隐藏组件。 | `boolean`                                                                  | `false`     |

### ve-alert 事件

| 事件名     | 描述                                                                   | `event.detail` |
| ---------- | ---------------------------------------------------------------------- | -------------- |
| `ve-close` | 点击关闭按钮时触发；调用 `event.preventDefault()` 可阻止默认隐藏行为。 | `{ sourceEvent: MouseEvent }` |

### ve-alert 插槽

| 插槽名   | 描述                                                 |
| -------- | ---------------------------------------------------- |
| 默认插槽 | 提示内容，可自行组合标题、正文、操作入口等任意结构。 |
| `icon`   | 自定义状态图标，`show-icon` 开启时展示。             |
