`ve-popconfirm` 用于在用户执行关键操作前进行轻量二次确认。组件点击触发元素后，在触发点附近弹出气泡式确认框，适合删除、停止、撤销、重置等需要二次确认但不需要打断整页流程的场景。

<style>{`
  .ve-popconfirm-demo {
    box-sizing: border-box;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: 20px;
    min-height: 180px;
    padding: 48px 24px;
  }

  .ve-popconfirm-demo-grid {
    box-sizing: border-box;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(96px, max-content));
    align-items: center;
    justify-content: center;
    justify-items: center;
    gap: 20px 28px;
    min-height: 220px;
    padding: 56px 24px;
  }

  .ve-popconfirm-demo-stack {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 14px;
    min-height: 180px;
    padding: 44px 24px;
  }

  .ve-popconfirm-event-log {
    min-inline-size: 260px;
    color: var(--color-text-tertiary);
    font-size: 12px;
    line-height: 1.5;
    text-align: center;
  }

  .ve-popconfirm-release-title,
  .ve-popconfirm-release-content {
    display: flex;
    flex-direction: column;
    gap: 4px;
    min-inline-size: 0;
  }

  .ve-popconfirm-release-title small,
  .ve-popconfirm-release-content span {
    color: var(--color-text-tertiary);
    font-size: 12px;
    font-weight: var(--font-weight-normal);
    line-height: 18px;
  }

  .ve-popconfirm-danger-text {
    color: var(--color-text-danger);
    font-weight: var(--font-weight-medium);
  }

  .ve-popconfirm-custom-actions {
    display: inline-flex;
    align-items: center;
    gap: 4px;
  }
`}</style>

## 何时使用

- 用户即将执行删除、终止、撤销、清空、重置等关键操作，需要明确确认。
- 操作的影响范围较小，不需要使用 Modal 打断用户当前上下文。
- 触发元素附近就能完成确认，确认内容较短，通常包含标题、一句说明和两个操作。

## 引入组件

```ts
import '@ve-design/web/ve-popconfirm';
```

## 示例

### 基础用法

默认插槽放置触发元素。点击触发元素后展示气泡确认框，点击取消、确认、外部区域或按 Escape 会请求关闭。

```html preview
<script type="module">
  import '@ve-design/web/ve-button';
  import '@ve-design/web/ve-popconfirm';
</script>

<section class="ve-popconfirm-demo">
  <ve-popconfirm title="标题" content="这里是一条文本描述内容。">
    <ve-button>打开确认框</ve-button>
  </ve-popconfirm>
</section>
```

### 危险操作

组件不内置固定语义类型。危险、警告等场景可以通过 `icon`、`confirm` 插槽和触发元素状态自由组合。

```html preview
<script type="module">
  import '@ve-design/web/ve-button';
  import '@ve-design/web/ve-icon';
  import '@ve-design/web/ve-popconfirm';
  import '@ve-design/web/icons/warning';
</script>

<section class="ve-popconfirm-demo">
  <ve-popconfirm
    title="确定要删除吗？"
    content="删除后不可恢复，请谨慎操作"
    cancel-text="取消"
  >
    <ve-button type="text" status="danger">删除任务</ve-button>
    <ve-icon
      slot="icon"
      name="warning"
      style="color: var(--color-text-warning);"
    ></ve-icon>
    <span slot="confirm" class="ve-popconfirm-danger-text">删除</span>
  </ve-popconfirm>
</section>
```

### 弹出位置

`position` 支持 `top`、`bottom`、`left`、`right` 以及 `top-start`、`top-end`、`bottom-start`、`bottom-end`、`left-start`、`left-end`、`right-start`、`right-end` 等位置。

```html preview
<script type="module">
  import '@ve-design/web/ve-button';
  import '@ve-design/web/ve-popconfirm';
</script>

<section class="ve-popconfirm-demo-grid">
  <ve-popconfirm
    position="top"
    title="Run agent?"
    content="Start with current context."
    ok-text="Run"
    cancel-text="Cancel"
  >
    <ve-button>top</ve-button>
  </ve-popconfirm>

  <ve-popconfirm
    position="right"
    title="Publish report?"
    content="Visible to all workspace members."
    ok-text="Publish"
    cancel-text="Cancel"
  >
    <ve-button>right</ve-button>
  </ve-popconfirm>

  <ve-popconfirm
    position="bottom"
    title="Reset session?"
    content="All local turns will be cleared."
    ok-text="Reset"
    cancel-text="Cancel"
  >
    <ve-button>bottom</ve-button>
  </ve-popconfirm>

  <ve-popconfirm
    position="left"
    title="Stop execution?"
    content="The current run will be interrupted."
    ok-text="Stop"
    cancel-text="Cancel"
  >
    <ve-button>left</ve-button>
  </ve-popconfirm>
</section>
```

### 箭头

设置 `arrow` 后，气泡会显示指向触发元素的箭头。默认保持与设计稿一致的无箭头样式。

```html preview
<script type="module">
  import '@ve-design/web/ve-button';
  import '@ve-design/web/ve-popconfirm';
</script>

<section class="ve-popconfirm-demo">
  <ve-popconfirm
    arrow
    show-icon="false"
    title="Archive thread?"
    content="Archived threads can be restored later."
    ok-text="Archive"
    cancel-text="Cancel"
  >
    <ve-button type="primary">Archive</ve-button>
  </ve-popconfirm>
</section>
```

### 富内容插槽

`title`、`content` 和 `icon` 均支持具名插槽。插槽内容会覆盖对应的文本属性或默认图标。

```html preview
<script type="module">
  import '@ve-design/web/ve-button';
  import '@ve-design/web/ve-icon';
  import '@ve-design/web/ve-popconfirm';
  import '@ve-design/web/icons/file-check';
</script>

<section class="ve-popconfirm-demo">
  <ve-popconfirm ok-text="Publish" cancel-text="Review">
    <ve-button type="primary">Publish update</ve-button>
    <ve-icon
      slot="icon"
      name="file-check"
      style="color: var(--color-text-info);"
    ></ve-icon>
    <span slot="title" class="ve-popconfirm-release-title">
      <span>Publish release note?</span>
      <small>Design System · 2 min read</small>
    </span>
    <span slot="content" class="ve-popconfirm-release-content">
      <span>Share the latest component updates with workspace members.</span>
      <span>The draft stays editable after publishing.</span>
    </span>
  </ve-popconfirm>
</section>
```

### 操作区自定义

使用 `cancel` 和 `confirm` 插槽可以只替换内置按钮内容，仍保留默认的关闭行为、禁用态和确认/取消事件。使用 `actions` 插槽会替换整行操作区，适合增加额外按钮、加载态或完全自定义操作逻辑；此时自定义按钮需要自行调用 `show()`、`hide()` 或控制 `open`。

```html preview
<script type="module">
  import '@ve-design/web/ve-button';
  import '@ve-design/web/ve-popconfirm';
</script>

<section class="ve-popconfirm-demo">
  <ve-popconfirm
    show-icon="false"
    title="Discard draft?"
    content="The current prompt draft will be removed."
    ok-text="Discard"
    cancel-text="Keep editing"
  >
    <ve-button type="outline">Discard</ve-button>
    <span slot="cancel">Keep editing</span>
    <span slot="confirm" class="ve-popconfirm-danger-text">Discard</span>
  </ve-popconfirm>

  <ve-popconfirm
    id="custom-actions-popconfirm"
    show-icon="false"
    title="Apply changes?"
    content="Review the details before applying."
    ok-text="Apply"
    cancel-text="Review"
  >
    <ve-button type="primary">Apply patch</ve-button>
    <span slot="actions" class="ve-popconfirm-custom-actions">
      <ve-button id="custom-action-review" type="outline">Review</ve-button>
      <ve-button id="custom-action-apply" type="primary">Apply</ve-button>
    </span>
  </ve-popconfirm>
</section>

<script>
  const actionsPopconfirm = document.getElementById(
    'custom-actions-popconfirm',
  );

  document
    .getElementById('custom-action-review')
    .addEventListener('click', () => actionsPopconfirm.hide());

  document
    .getElementById('custom-action-apply')
    .addEventListener('click', () => actionsPopconfirm.hide());
</script>
```

### 受控状态与事件

使用 `open` 可以受控展示。`ve-open-change` 会在打开或关闭请求时触发，`ve-popconfirm-confirm` 和 `ve-popconfirm-cancel` 分别对应确认和取消操作。

```html preview
<script type="module">
  import '@ve-design/web/ve-button';
  import '@ve-design/web/ve-popconfirm';
</script>

<section class="ve-popconfirm-demo-stack">
  <ve-popconfirm
    id="controlled-popconfirm"
    title="Submit changes?"
    content="Submit the current changes for review."
    ok-text="Submit"
    cancel-text="Cancel"
  >
    <ve-button type="primary">Submit</ve-button>
  </ve-popconfirm>
  <div id="popconfirm-log" class="ve-popconfirm-event-log">
    Waiting for action.
  </div>
</section>

<script>
  const popconfirm = document.getElementById('controlled-popconfirm');
  const log = document.getElementById('popconfirm-log');

  popconfirm.addEventListener('ve-open-change', (event) => {
    log.textContent = `open=${event.detail.open}, source=${event.detail.source}`;
  });

  popconfirm.addEventListener('ve-popconfirm-confirm', () => {
    log.textContent = 'Confirmed.';
  });

  popconfirm.addEventListener('ve-popconfirm-cancel', () => {
    log.textContent = 'Cancelled.';
  });
</script>
```

### 禁用状态

设置 `disabled` 后，触发元素不可操作并且气泡不会展示。也可以单独禁用 `ok-disabled` 或 `cancel-disabled`。

```html preview
<script type="module">
  import '@ve-design/web/ve-button';
  import '@ve-design/web/ve-popconfirm';
</script>

<section class="ve-popconfirm-demo">
  <ve-popconfirm
    disabled
    title="Delete run?"
    content="This popconfirm is disabled."
    ok-text="Delete"
    cancel-text="Cancel"
  >
    <ve-button>Disabled trigger</ve-button>
  </ve-popconfirm>

  <ve-popconfirm
    ok-disabled
    title="Stop run?"
    content="Confirm is disabled while syncing."
    ok-text="Stop"
    cancel-text="Cancel"
  >
    <ve-button type="outline">Disabled confirm</ve-button>
  </ve-popconfirm>
</section>
```

## API

### 属性

| 属性              | 类型                 | 默认值                       | 说明                                                                               |
| ----------------- | -------------------- | ---------------------------- | ---------------------------------------------------------------------------------- |
| `position`        | `PopconfirmPosition` | `'top'`                      | 气泡优先展示位置，支持 `top`、`bottom`、`left`、`right` 及 `-start`、`-end` 对齐。 |
| `title`           | `string`             | `'标题'`                     | 标题文本，富内容使用 `title` 插槽。                                                |
| `content`         | `string`             | `'这里是一条文本描述内容。'` | 描述文本，富内容使用 `content` 插槽。                                              |
| `ok-text`         | `string`             | `'确定'`                     | 确认按钮默认文案；使用 `confirm` 插槽后由插槽内容替换。                            |
| `cancel-text`     | `string`             | `'取消'`                     | 取消按钮默认文案；使用 `cancel` 插槽后由插槽内容替换。                             |
| `open`            | `boolean`            | `undefined`                  | 受控打开状态。                                                                     |
| `default-open`    | `boolean`            | `false`                      | 非受控默认打开状态。                                                               |
| `disabled`        | `boolean`            | `false`                      | 禁用触发和气泡展示。                                                               |
| `ok-disabled`     | `boolean`            | `false`                      | 禁用确认按钮。                                                                     |
| `cancel-disabled` | `boolean`            | `false`                      | 禁用取消按钮。                                                                     |
| `show-icon`       | `boolean`            | `true`                       | 是否展示左侧图标，HTML 中可使用 `show-icon="false"` 隐藏。                         |
| `arrow`           | `boolean`            | `false`                      | 是否展示指向触发元素的箭头。                                                       |

### 事件

| 事件                        | detail                                                  | 说明                                                                                               |
| --------------------------- | ------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| `ve-open-change`            | `{ open: boolean; source: PopconfirmOpenChangeSource }` | 打开或关闭请求触发。`source` 可能为 `trigger`、`confirm`、`cancel`、`outside`、`escape` 或 `api`。 |
| `ve-popconfirm-confirm`     | `{ sourceEvent: Event }`                                | 点击内置确认按钮触发。事件可取消，调用 `preventDefault()` 后不会自动关闭。                         |
| `ve-popconfirm-cancel`      | `{ sourceEvent: Event }`                                | 点击内置取消按钮触发。事件可取消，调用 `preventDefault()` 后不会自动关闭。                         |

### 方法

| 方法                            | 说明               |
| ------------------------------- | ------------------ |
| `show()`                        | 请求打开气泡。     |
| `hide()`                        | 请求关闭气泡。     |
| `toggle(open?: boolean)`        | 切换气泡打开状态。 |
| `focus(options?: FocusOptions)` | 聚焦触发元素。     |

### 插槽

| 插槽      | 说明                                                 |
| --------- | ---------------------------------------------------- |
| 默认插槽  | 触发元素，建议只放置一个根节点。                     |
| `title`   | 自定义标题内容。                                     |
| `content` | 自定义描述内容。                                     |
| `icon`    | 自定义左侧图标，仅在 `show-icon` 启用时渲染。        |
| `cancel`  | 自定义内置取消按钮内容，保留默认取消事件和关闭行为。 |
| `confirm` | 自定义内置确认按钮内容，保留默认确认事件和关闭行为。 |
| `actions` | 自定义整行操作区，会替换内置取消和确认按钮。         |
