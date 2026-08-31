`ve-modal` 用于在当前页面上方展示需要用户立即关注的对话内容，适合承载确认、反馈、表单配置、授权提示和高风险操作拦截。组件提供受控的 `visible` 状态、内置标题、遮罩、关闭入口、取消/确认按钮、背景滚动锁定和可取消事件，便于在弹窗打开期间隔离页面内容并拦截关闭行为。

## 何时使用

- 需要打断当前页面上下文，让用户聚焦完成确认、配置、授权或风险操作。
- 内容需要标题、正文、底部操作和关闭入口组成完整对话框，比 `ve-popconfirm` 承载的信息更复杂。
- 需要在点击确认前执行表单校验、异步提交或权限检查，并在校验失败时阻止弹窗自动关闭。
- 需要自定义标题、底部按钮、确认/取消按钮内容或关闭图标，以适配业务场景。
- 需要通过遮罩隔离页面内容，并在弹窗打开期间禁止背景内容滚动。

## 引入组件

```ts
import '@ve-design/web/ve-modal';
```

## 示例

### 基础用法

使用 `visible` 控制弹窗显示，也可以调用 `show()` / `hide()` 方法触发显示或隐藏。通过 `ve-visible-change` 同步组件发起的关闭请求，保持外部状态与组件状态一致。弹窗打开后会锁定 `document.body` 背景滚动，多个弹窗同时打开时会在最后一个弹窗关闭后恢复。

```html preview
<script type="module">
  import '@ve-design/web/ve-button';
  import '@ve-design/web/ve-modal';
</script>

<style>
  .modal-demo-stage {
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    min-height: 260px;
    padding: 32px;
  }

  .modal-demo-content {
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 180px;
    border: 1px dashed var(--color-border-default);
    border-radius: var(--radius-base);
    background: var(--color-bg-surface);
    color: var(--color-text-secondary);
    font-size: 13px;
    line-height: 20px;
  }
</style>

<section class="modal-demo-stage">
  <ve-button id="basic-open" type="primary">打开弹窗</ve-button>

  <ve-modal id="basic-modal" title="运行确认">
    <div class="modal-demo-content">确认后将开始执行当前任务。</div>
  </ve-modal>
</section>

<script type="module">
  const modal = document.getElementById('basic-modal');

  document.getElementById('basic-open').addEventListener('click', () => {
    modal.visible = true;
  });

  modal.addEventListener('ve-visible-change', (event) => {
    modal.visible = event.detail.visible;
  });
</script>
```

### 自定义宽度

`width` 接受任意 CSS 宽度值。传入空字符串时会回退到默认宽度 `480px`。

```html preview
<script type="module">
  import '@ve-design/web/ve-button';
  import '@ve-design/web/ve-modal';
</script>

<style>
  .width-modal-demo {
    box-sizing: border-box;
    display: grid;
    justify-items: center;
    min-height: 260px;
    padding: 32px;
  }

  .width-modal-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    justify-content: center;
  }
</style>

<section class="width-modal-demo">
  <div class="width-modal-actions">
    <ve-button data-modal-trigger="compact-modal">400px</ve-button>
    <ve-button data-modal-trigger="default-modal">默认宽度</ve-button>
    <ve-button data-modal-trigger="wide-modal">600px</ve-button>
  </div>

  <ve-modal id="compact-modal" width="400px" title="紧凑弹窗">
    <div class="modal-demo-content">适合短确认和轻量表单。</div>
  </ve-modal>

  <ve-modal id="default-modal" title="默认弹窗">
    <div class="modal-demo-content">默认宽度为 480px。</div>
  </ve-modal>

  <ve-modal id="wide-modal" width="600px" title="宽弹窗">
    <div class="modal-demo-content">适合承载更完整的配置项。</div>
  </ve-modal>
</section>

<script type="module">
  document.querySelectorAll('[data-modal-trigger]').forEach((trigger) => {
    trigger.addEventListener('click', () => {
      document.getElementById(trigger.dataset.modalTrigger).visible = true;
    });
  });
</script>
```

### 自定义标题

`title` 属性适合纯文本标题；`title` 插槽可替换整个标题区域，适合加入图标、状态、风险标记或业务标签。

```html preview
<script type="module">
  import '@ve-design/web/icons/info';
  import '@ve-design/web/ve-button';
  import '@ve-design/web/ve-icon';
  import '@ve-design/web/ve-modal';
</script>

<style>
  .title-modal-title {
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }

  .title-modal-title ve-icon {
    color: var(--color-text-info);
  }
</style>

<section class="modal-demo-stage">
  <ve-button id="title-slot-open" type="primary">查看授权提示</ve-button>

  <ve-modal id="title-slot-modal" ok-text="同意" cancel-text="暂不处理">
    <span slot="title" class="title-modal-title">
      <ve-icon name="info" size="22" aria-hidden="true"></ve-icon>
      <span>需要授权</span>
    </span>
    <div class="modal-demo-content">继续前请确认 Agent 可以读取当前工作区信息。</div>
  </ve-modal>
</section>

<script type="module">
  document.getElementById('title-slot-open').addEventListener('click', () => {
    document.getElementById('title-slot-modal').visible = true;
  });
</script>
```

### 自定义底部

使用 `footer` 插槽后，组件会完全替换默认底部，不再渲染内置取消和确认按钮。此时需要由自定义按钮自行关闭弹窗或提交表单。

```html preview
<script type="module">
  import '@ve-design/web/icons/check';
  import '@ve-design/web/icons/close';
  import '@ve-design/web/ve-button';
  import '@ve-design/web/ve-icon';
  import '@ve-design/web/ve-input';
  import '@ve-design/web/ve-select';
  import '@ve-design/web/ve-modal';
</script>

<style>
  .custom-modal-form {
    display: grid;
    gap: 12px;
  }

  .custom-modal-form-row {
    display: grid;
    gap: 6px;
  }

  .custom-modal-form-label {
    color: var(--color-text-secondary);
    font-size: 13px;
    line-height: 20px;
  }

  .custom-modal-footer {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    justify-content: flex-end;
  }
</style>

<section class="modal-demo-stage">
  <ve-button id="custom-open" type="primary">配置任务</ve-button>

  <ve-modal id="custom-modal" width="600px" title="任务运行设置">
    <div class="custom-modal-form">
      <label class="custom-modal-form-row">
        <span class="custom-modal-form-label">任务名称</span>
        <ve-input placeholder="生成发布说明"></ve-input>
      </label>
      <label class="custom-modal-form-row">
        <span class="custom-modal-form-label">工作区</span>
        <ve-select placeholder="设计系统">
          <ve-select-item value="design-system">设计系统</ve-select-item>
          <ve-select-item value="project-space-a">项目空间 A</ve-select-item>
          <ve-select-item value="prompt-lab">项目空间 B</ve-select-item>
          <ve-select-item value="knowledge-hub">测试环境</ve-select-item>
          <ve-select-item value="eval-center">生产环境</ve-select-item>
          <ve-select-item value="data-platform">数据平台</ve-select-item>
          <ve-select-item value="growth-analytics">增长分析</ve-select-item>
          <ve-select-item value="risk-control">风险控制</ve-select-item>
          <ve-select-item value="content-review">内容审核</ve-select-item>
          <ve-select-item value="customer-service">客户服务</ve-select-item>
          <ve-select-item value="marketing-automation">营销自动化</ve-select-item>
          <ve-select-item value="experiment-platform">实验平台</ve-select-item>
        </ve-select>
      </label>
    </div>

    <div slot="footer" class="custom-modal-footer">
      <ve-button type="secondary" data-close-custom>
        <ve-icon name="close" aria-hidden="true"></ve-icon>
        <span>取消</span>
      </ve-button>
      <ve-button type="primary" data-close-custom>
        <ve-icon name="check" aria-hidden="true"></ve-icon>
        <span>运行任务</span>
      </ve-button>
    </div>
  </ve-modal>
</section>

<script type="module">
  const modal = document.getElementById('custom-modal');

  document.getElementById('custom-open').addEventListener('click', () => {
    modal.visible = true;
  });

  modal.querySelectorAll('[data-close-custom]').forEach((button) => {
    button.addEventListener('click', () => {
      modal.visible = false;
    });
  });
</script>
```

### 关闭控制

`mask-closable="false"` 可以禁止点击遮罩关闭；`closable="false"` 可以隐藏右上角关闭按钮；`hide-footer` 可以隐藏底部区域。关闭按钮、遮罩、Escape 都会先派发可取消事件，调用 `event.preventDefault()` 即可阻止组件默认关闭。

```html preview
<script type="module">
  import '@ve-design/web/ve-button';
  import '@ve-design/web/ve-modal';
</script>

<section class="modal-demo-stage">
  <ve-button id="guarded-open" type="primary">打开受限弹窗</ve-button>

  <ve-modal
    id="guarded-modal"
    title="确认发布"
    mask-closable="false"
    ok-text="发布"
    cancel-text="返回检查"
  >
    <div class="modal-demo-content">该操作只能通过按钮或右上角关闭入口退出。</div>
  </ve-modal>
</section>

<script type="module">
  document.getElementById('guarded-open').addEventListener('click', () => {
    document.getElementById('guarded-modal').visible = true;
  });
</script>
```

### 确认前校验

`ve-ok` 是可取消事件。调用 `event.preventDefault()` 后，组件不会自动关闭；校验通过后可以手动设置 `visible = false` 或调用 `hide('ok')`。

```html preview
<script type="module">
  import '@ve-design/web/ve-button';
  import '@ve-design/web/ve-input';
  import '@ve-design/web/ve-modal';
</script>

<style>
  .validation-modal-form {
    display: grid;
    gap: 8px;
  }

  .validation-modal-error {
    min-height: 20px;
    color: var(--color-text-danger);
    font-size: 13px;
    line-height: 20px;
  }
</style>

<section class="modal-demo-stage">
  <ve-button id="validation-open" type="primary">创建任务</ve-button>

  <ve-modal id="validation-modal" title="创建任务" ok-text="创建">
    <div class="validation-modal-form">
      <ve-input id="task-name-input" placeholder="请输入任务名称"></ve-input>
      <div id="task-name-error" class="validation-modal-error"></div>
    </div>
  </ve-modal>
</section>

<script type="module">
  const modal = document.getElementById('validation-modal');
  const input = document.getElementById('task-name-input');
  const error = document.getElementById('task-name-error');

  document.getElementById('validation-open').addEventListener('click', () => {
    modal.visible = true;
  });

  modal.addEventListener('ve-ok', (event) => {
    event.preventDefault();

    if (!input.value?.trim()) {
      error.textContent = '请输入任务名称';
      return;
    }

    error.textContent = '';
    modal.hide('ok');
  });
</script>
```

### 事件监听

组件会在不同关闭来源下派发事件。可以通过 `event.detail.source` 判断关闭来源，通过 `sourceEvent` 获取原始交互事件。

```html preview
<script type="module">
  import '@ve-design/web/ve-button';
  import '@ve-design/web/ve-modal';
</script>

<style>
  .event-modal-log {
    margin-block-start: 16px;
    color: var(--color-text-tertiary);
    font-size: 12px;
    line-height: 18px;
  }
</style>

<section class="modal-demo-stage">
  <ve-button id="event-open" type="primary">打开事件示例</ve-button>

  <ve-modal id="event-modal" title="保存更改" ok-text="保存">
    <div class="modal-demo-content">点击不同关闭入口查看事件来源。</div>
  </ve-modal>

  <div id="event-log" class="event-modal-log">等待事件</div>
</section>

<script type="module">
  const modal = document.getElementById('event-modal');
  const log = document.getElementById('event-log');

  document.getElementById('event-open').addEventListener('click', () => {
    modal.visible = true;
  });

  modal.addEventListener('ve-ok', (event) => {
    log.textContent = `ve-ok：source=${event.detail.source}`;
  });

  modal.addEventListener('ve-cancel', (event) => {
    log.textContent = `ve-cancel：source=${event.detail.source}`;
  });

  modal.addEventListener('ve-close', (event) => {
    log.textContent = `ve-close：source=${event.detail.source}`;
  });

  modal.addEventListener('ve-after-close', (event) => {
    log.textContent = `ve-after-close：source=${event.detail.source}`;
  });
</script>
```

## API

### 属性

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `visible` | 是否展示弹窗。弹窗隐藏时仍保留在 DOM 中，但面板会设置 `aria-hidden="true"`；展示时会锁定页面背景滚动。 | `boolean` | `false` |
| `width` | 弹窗面板宽度，接受任意合法 CSS 宽度值，例如 `400px`、`60vw`、`min(640px, 90vw)`。传入空字符串时回退到 `480px`。 | `string` | `'480px'` |
| `title` | 头部标题文本。仅适合纯文本；如需图标、标签或复杂结构，请使用 `title` 插槽。 | `string` | `''` |
| `closable` | 是否展示右上角关闭按钮。HTML 中可写 `closable="false"` 隐藏关闭按钮。 | `boolean` | `true` |
| `mask` | 是否展示遮罩。设置为 `false` 时遮罩背景透明，但弹窗仍会显示在页面上方。 | `boolean` | `true` |
| `mask-closable` | 点击遮罩是否请求关闭弹窗。设置为 `false` 后，点击遮罩不会触发关闭请求。 | `boolean` | `true` |
| `ok-text` | 内置确认按钮文案。使用 `ok` 插槽时可替换按钮内容但保留默认确认事件。 | `string` | `'确定'` |
| `cancel-text` | 内置取消按钮文案。使用 `cancel` 插槽时可替换按钮内容但保留默认取消事件。 | `string` | `'取消'` |
| `ok-disabled` | 是否禁用内置确认按钮。禁用后不会触发 `ve-ok`。 | `boolean` | `false` |
| `cancel-disabled` | 是否禁用内置取消按钮。禁用后不会触发 `ve-cancel`。 | `boolean` | `false` |
| `hide-footer` | 是否隐藏底部区域。适用于只展示信息、由正文内操作完成交互或完全自定义布局的场景。 | `boolean` | `false` |
| `z-index` | 弹窗根层级。适用于页面中存在更高层浮层时调整层级关系。 | `number` | `1000` |

### 事件

| 事件名 | 说明 | Detail |
| --- | --- | --- |
| `ve-visible-change` | 请求展示或隐藏弹窗时触发。事件可取消；调用 `event.preventDefault()` 后，本次状态变更不会继续执行。 | `{ visible: boolean; source: 'api' \| 'close' \| 'cancel' \| 'ok' \| 'mask' \| 'esc'; sourceEvent?: Event }` |
| `ve-ok` | 点击内置确认按钮时触发。事件可取消；调用 `event.preventDefault()` 后，确认按钮不会自动关闭弹窗。 | `{ source: 'ok'; sourceEvent: MouseEvent }` |
| `ve-cancel` | 点击内置取消按钮时触发。事件可取消；调用 `event.preventDefault()` 后，取消按钮不会自动关闭弹窗。 | `{ source: 'cancel'; sourceEvent: MouseEvent }` |
| `ve-close` | 点击右上角关闭按钮、点击遮罩或按 Escape 请求关闭时触发。事件可取消；调用 `event.preventDefault()` 后不会关闭弹窗。 | `{ source: 'close' \| 'mask' \| 'esc'; sourceEvent?: Event }` |
| `ve-after-close` | 弹窗关闭动画结束后触发。若用户开启了减少动态效果偏好，会在关闭后立即触发。 | `{ source: 'close' \| 'cancel' \| 'ok' \| 'mask' \| 'esc' \| 'api' }` |

### 方法

| 方法 | 说明 |
| --- | --- |
| `show()` | 请求展示弹窗，等同于以 `api` 作为来源请求将 `visible` 改为 `true`，并会派发 `ve-visible-change`。 |
| `hide(source?, sourceEvent?)` | 请求隐藏弹窗。`source` 默认是 `api`，可传入关闭来源用于后续 `ve-visible-change` 和 `ve-after-close` 判断。 |

### 插槽

| 插槽名 | 说明 |
| --- | --- |
| 默认插槽 | 弹窗主体内容。正文区域可滚动，适合承载说明、表单、预览和提示信息。 |
| `title` | 自定义标题内容，替换 `title` 文本。适合标题图标、状态标识或复杂标题结构。 |
| `footer` | 自定义完整底部区域。存在时会替换内置取消和确认按钮，自定义按钮需要自行处理提交与关闭。 |
| `cancel` | 自定义内置取消按钮内容，保留内置取消按钮、`ve-cancel` 事件和默认关闭行为。 |
| `ok` | 自定义内置确认按钮内容，保留内置确认按钮、`ve-ok` 事件和默认关闭行为。 |
| `close-icon` | 自定义右上角关闭图标，保留关闭按钮、`ve-close` 事件和默认关闭行为。 |

### CSS Parts

| Part | 说明 |
| --- | --- |
| `overlay` | 弹窗遮罩和定位容器。 |
| `panel` | 弹窗面板。 |
| `header` | 头部区域。 |
| `title` | 标题容器。 |
| `close-button` | 右上角关闭按钮。 |
| `body` | 主体内容区域。 |
| `footer` | 底部操作区域。 |
| `cancel-button` | 内置取消按钮。 |
| `ok-button` | 内置确认按钮。 |
