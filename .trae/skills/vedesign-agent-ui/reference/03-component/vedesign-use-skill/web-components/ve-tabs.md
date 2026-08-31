`ve-tabs` 用于在同一视图内切换相互关联的内容面板，由 `ve-tabs` 和 `ve-tab-pane` 组合使用。

## 何时使用

- 需要在同一上下文中切换概览、配置、记录、评估结果等并列内容。
- 内容之间关系紧密，切换不应引起页面跳转或上下文重置。
- 需要通过尺寸、视觉类型或导航位置适配不同的信息密度和布局结构。

## 引入组件

```ts
import '@ve-design/web/ve-tabs';
```

## 示例

### 基础用法

使用 `default-active-tab` 设置默认激活项，适合由组件自行维护切换状态的场景。

```html preview
<script type="module">
  import '@ve-design/web/ve-tabs';
</script>

<section style="display: grid; place-items: center; padding: 32px;">
  <ve-tabs
    default-active-tab="overview"
    style="display: block; width: min(720px, 100%);"
  >
    <ve-tab-pane key="overview" title="Overview">
      <p>
        <strong>Agent health is stable.</strong> The latest run completed 24
        conversations and kept the average response time under 15 seconds.
      </p>
    </ve-tab-pane>
    <ve-tab-pane key="memory" title="Memory">
      <p>
        <strong>Workspace memory is enabled.</strong> Approved preferences and
        product terms are available to the assistant across sessions.
      </p>
    </ve-tab-pane>
    <ve-tab-pane key="prompt" title="Prompt">
      <p>
        <strong>Production prompt v12 is active.</strong> It uses concise
        answers, citation rules, and a fallback path for low-confidence cases.
      </p>
    </ve-tab-pane>
  </ve-tabs>
</section>
```

### 受控模式

设置 `active-tab` 后，可以监听 `ve-change` 并回写激活项，让外部状态与页签保持同步。

```html preview
<script type="module">
  import '@ve-design/web/ve-button';
  import '@ve-design/web/ve-tabs';

  const tabs = document.querySelector('#tabs-controlled-demo');
  const controls = document.querySelector('#tabs-controlled-controls');

  function setActiveTab(nextKey) {
    tabs.activeTab = nextKey;
  }

  controls?.addEventListener('click', (event) => {
    const target =
      event.target instanceof Element
        ? event.target.closest('ve-button[data-key]')
        : null;

    if (!target) return;
    if (!target.dataset.key) return;
    setActiveTab(target.dataset.key);
  });

  tabs?.addEventListener('ve-change', (event) => {
    setActiveTab(event.detail.activeTab);
  });
</script>

<section style="display: grid; place-items: center; padding: 32px;">
  <div style="display: grid; gap: 16px; width: min(760px, 100%);">
    <div
      id="tabs-controlled-controls"
      style="display: flex; flex-wrap: wrap; gap: 8px; justify-content: center;"
    >
      <ve-button type="secondary" data-key="inbox">Inbox</ve-button>
      <ve-button type="secondary" data-key="review">Review</ve-button>
      <ve-button type="secondary" data-key="resolved">Resolved</ve-button>
    </div>

    <ve-tabs id="tabs-controlled-demo" active-tab="inbox">
      <ve-tab-pane key="inbox" title="Inbox">
        <p>
          <strong>32 conversations are waiting.</strong> Seven include uploaded
          files and the queue is prioritizing enterprise billing questions.
        </p>
      </ve-tab-pane>
      <ve-tab-pane key="review" title="Review">
        <p>
          <strong>4 conversations need review.</strong> They were escalated
          after confidence dropped below the configured threshold.
        </p>
      </ve-tab-pane>
      <ve-tab-pane key="resolved" title="Resolved">
        <p>
          <strong>186 conversations were resolved this week.</strong> Only three
          tickets were reopened after the first response.
        </p>
      </ve-tab-pane>
    </ve-tabs>
  </div>
</section>
```

### 视觉类型

使用 `type` 切换标签导航样式。

```html preview
<script type="module">
  import '@ve-design/web/ve-radio';
  import '@ve-design/web/ve-tabs';

  const tabs = document.querySelector('#tabs-type-demo');
  const controls = document.querySelector('#tabs-type-controls');

  controls?.addEventListener('ve-group-change', (event) => {
    tabs.type = event.detail.value;
  });
</script>

<section style="display: grid; place-items: center; padding: 32px;">
  <div
    style="display: grid; gap: 16px; justify-items: center; width: min(760px, 100%);"
  >
    <ve-radio-group
      id="tabs-type-controls"
      type="button"
      size="small"
      value="line"
    >
      <ve-radio value="line">line</ve-radio>
      <ve-radio value="text">text</ve-radio>
      <ve-radio value="rounded">rounded</ve-radio>
      <ve-radio value="capsule">capsule</ve-radio>
    </ve-radio-group>

    <ve-tabs
      id="tabs-type-demo"
      type="line"
      default-active-tab="plan"
      style="width: 100%;"
    >
      <ve-tab-pane key="plan" title="Plan">
        <p>
          <strong>Planning generated 9 tasks.</strong> Three tasks require
          approval because they affect permissions, billing copy, or migration
          notes.
        </p>
      </ve-tab-pane>
      <ve-tab-pane key="generate" title="Generate">
        <p>
          <strong>Generation finished in 2 minutes.</strong> Component files,
          test cases, and a preview note are ready for review.
        </p>
      </ve-tab-pane>
      <ve-tab-pane key="verify" title="Verify">
        <p>
          <strong>Type checks passed.</strong> Visual review is waiting for the
          updated dashboard baseline.
        </p>
      </ve-tab-pane>
    </ve-tabs>
  </div>
</section>
```

### 尺寸

使用 `size` 调整页签导航密度。

```html preview
<script type="module">
  import '@ve-design/web/ve-radio';
  import '@ve-design/web/ve-tabs';

  const tabs = document.querySelector('#tabs-size-demo');
  const controls = document.querySelector('#tabs-size-controls');

  controls?.addEventListener('ve-group-change', (event) => {
    tabs.size = event.detail.value;
  });
</script>

<section style="display: grid; place-items: center; padding: 32px;">
  <div
    style="display: grid; gap: 16px; justify-items: center; width: min(760px, 100%);"
  >
    <ve-radio-group
      id="tabs-size-controls"
      type="button"
      size="small"
      value="default"
    >
      <ve-radio value="small">small</ve-radio>
      <ve-radio value="default">default</ve-radio>
      <ve-radio value="large">large</ve-radio>
    </ve-radio-group>

    <ve-tabs
      id="tabs-size-demo"
      size="default"
      default-active-tab="health"
      style="width: 100%;"
    >
      <ve-tab-pane key="health" title="Health">
        <p>
          <strong>All production agents are online.</strong> Retrieval latency
          is 82 ms at P95 and no fallback model was triggered in the last hour.
        </p>
      </ve-tab-pane>
      <ve-tab-pane key="quality" title="Quality">
        <p>
          <strong>Answer acceptance is 92.4%.</strong> Most reviewer edits are
          naming corrections, so product vocabulary will be refreshed next.
        </p>
      </ve-tab-pane>
      <ve-tab-pane key="cost" title="Cost">
        <p>
          <strong>Token spend is 8% below budget.</strong> Short replies now use
          the compact model while complex cases stay on the reasoning model.
        </p>
      </ve-tab-pane>
    </ve-tabs>
  </div>
</section>
```

### 导航位置

使用 `tab-position` 设置页签栏位置。

```html preview
<script type="module">
  import '@ve-design/web/ve-radio';
  import '@ve-design/web/ve-tabs';

  const tabs = document.querySelector('#tabs-position-demo');
  const controls = document.querySelector('#tabs-position-controls');

  controls?.addEventListener('ve-group-change', (event) => {
    tabs.tabPosition = event.detail.value;
  });
</script>

<section style="display: grid; place-items: center; padding: 32px;">
  <div
    style="display: grid; gap: 16px; justify-items: center; width: min(760px, 100%);"
  >
    <ve-radio-group
      id="tabs-position-controls"
      type="button"
      size="small"
      value="top"
    >
      <ve-radio value="top">top</ve-radio>
      <ve-radio value="bottom">bottom</ve-radio>
      <ve-radio value="left">left</ve-radio>
      <ve-radio value="right">right</ve-radio>
    </ve-radio-group>

    <ve-tabs
      id="tabs-position-demo"
      tab-position="top"
      default-active-tab="profile"
      style="display: block; width: 100%; min-height: 240px;"
    >
      <ve-tab-pane key="profile" title="Profile">
        <p>
          <strong>Enterprise billing agent.</strong> It answers invoice,
          contract, and renewal questions using approved account metadata.
        </p>
      </ve-tab-pane>
      <ve-tab-pane key="tools" title="Tools">
        <p>
          <strong>4 tools are enabled.</strong> Document search and ticket
          lookup are available to all agents; refund simulation requires review.
        </p>
      </ve-tab-pane>
      <ve-tab-pane key="guardrails" title="Guardrails">
        <p>
          <strong>Pricing replies require citations.</strong> Regulated-region
          answers are drafted first and sent only after manual approval.
        </p>
      </ve-tab-pane>
    </ve-tabs>
  </div>
</section>
```

### 禁用页签

在 `ve-tab-pane` 上设置 `disabled`，可以让对应页签暂不可访问。

```html preview
<script type="module">
  import '@ve-design/web/ve-button';
  import '@ve-design/web/ve-tabs';

  const targetPane = document.querySelector('#tabs-lock-pane');
  const toggle = document.querySelector('#tabs-lock');

  toggle?.addEventListener('click', () => {
    targetPane.disabled = !targetPane.disabled;
    toggle.textContent = targetPane.disabled ? 'Unlock report' : 'Lock report';
  });
</script>

<section style="display: grid; place-items: center; padding: 32px;">
  <div style="display: grid; gap: 16px; width: min(760px, 100%);">
    <div style="display: flex; justify-content: center;">
      <ve-button id="tabs-lock" type="secondary">Unlock report</ve-button>
    </div>

    <ve-tabs default-active-tab="summary">
      <ve-tab-pane key="summary" title="Summary">
        <p>
          <strong>420 conversations evaluated.</strong> Citation coverage
          improved by 6% and tool accuracy stayed above the release threshold.
        </p>
      </ve-tab-pane>
      <ve-tab-pane id="tabs-lock-pane" key="report" title="Report" disabled>
        <p>
          <strong>Detailed report is locked.</strong> It includes low-confidence
          replies, policy samples, and recommended prompt changes.
        </p>
      </ve-tab-pane>
      <ve-tab-pane key="actions" title="Actions">
        <p>
          <strong>Next actions are ready.</strong> Update retrieval filters, add
          regression cases, and rerun the safety benchmark before publishing.
        </p>
      </ve-tab-pane>
    </ve-tabs>
  </div>
</section>
```

### 自定义标题与事件

使用 `tab` 插槽自定义页签标题；用户切换页签时会触发 `ve-change`。

```html preview
<script type="module">
  import '@ve-design/web/ve-tabs';
  import '@ve-design/web/icons/database';
  import '@ve-design/web/icons/monitor';
  import '@ve-design/web/icons/pause';
  import '@ve-design/web/icons/settings';
  import '@ve-design/web/icons/terminal';
  import '@ve-design/web/icons/chart';

  const tabs = document.querySelector('#tabs-custom-demo');
  const status = document.querySelector('#tabs-custom-status');
  const labels = {
    live: 'Live traffic',
    training: 'Training data',
    paused: 'Paused experiments',
    settings: 'Settings',
    logs: 'Logs',
    metrics: 'Metrics',
  };

  tabs?.addEventListener('ve-change', (event) => {
    if (status) {
      status.textContent = `Current: ${labels[event.detail.activeTab]}`;
    }

    console.info('active tab:', event.detail.activeTab);
  });
</script>

<section style="display: grid; place-items: center; padding: 32px;">
  <div style="display: grid; gap: 16px; width: min(720px, 100%);">
    <div
      id="tabs-custom-status"
      style="color: var(--color-text-tertiary); font-size: 13px;"
    >
      Current: Live traffic
    </div>

    <ve-tabs id="tabs-custom-demo" default-active-tab="live">
      <ve-tab-pane key="live" title="Live">
        <span
          slot="tab"
          style="display: inline-flex; align-items: center; gap: 6px;"
        >
          <ve-icon name="monitor" size="16" aria-hidden="true"></ve-icon>
          Live
          <span style="font-size: 12px; color: var(--color-text-tertiary);">
            12
          </span>
        </span>
        <p>
          <strong>Live traffic is healthy.</strong> The chat agent is handling
          daily sessions with a 96% automatic resolution rate.
        </p>
      </ve-tab-pane>
      <ve-tab-pane key="training" title="Training">
        <span
          slot="tab"
          style="display: inline-flex; align-items: center; gap: 6px;"
        >
          <ve-icon name="database" size="16" aria-hidden="true"></ve-icon>
          Training
          <span style="font-size: 12px; color: var(--color-text-tertiary);">
            8
          </span>
        </span>
        <p>
          <strong>Training set is updating.</strong> Reviewed conversations are
          being cleaned and tagged for the next prompt iteration.
        </p>
      </ve-tab-pane>
      <ve-tab-pane key="paused" title="Paused">
        <span
          slot="tab"
          style="display: inline-flex; align-items: center; gap: 6px;"
        >
          <ve-icon name="pause" size="16" aria-hidden="true"></ve-icon>
          Paused
          <span style="font-size: 12px; color: var(--color-text-tertiary);">
            2
          </span>
        </span>
        <p>
          <strong>2 experiments are paused.</strong> They will resume after the
          latest safety review confirms the new refusal examples.
        </p>
      </ve-tab-pane>
      <ve-tab-pane key="settings" title="Settings">
        <span
          slot="tab"
          title="Settings"
          aria-label="Settings"
          style="display: inline-flex; align-items: center;"
        >
          <ve-icon name="settings" size="16" aria-hidden="true"></ve-icon>
        </span>
        <p>
          <strong>Settings are ready.</strong> Model routing, citation policy,
          and escalation thresholds can be reviewed before publishing.
        </p>
      </ve-tab-pane>
      <ve-tab-pane key="logs" title="Logs">
        <span
          slot="tab"
          title="Logs"
          aria-label="Logs"
          style="display: inline-flex; align-items: center;"
        >
          <ve-icon name="terminal" size="16" aria-hidden="true"></ve-icon>
        </span>
        <p>
          <strong>Run logs are available.</strong> The latest traces include
          retrieval calls, tool decisions, and reviewer comments.
        </p>
      </ve-tab-pane>
      <ve-tab-pane key="metrics" title="Metrics">
        <span
          slot="tab"
          title="Metrics"
          aria-label="Metrics"
          style="display: inline-flex; align-items: center;"
        >
          <ve-icon name="chart" size="16" aria-hidden="true"></ve-icon>
        </span>
        <p>
          <strong>Metrics are trending upward.</strong> Resolution rate,
          latency, and escalation volume are all inside the release target.
        </p>
      </ve-tab-pane>
    </ve-tabs>
  </div>
</section>
```

## API

### ve-tabs 属性

| 属性名               | 描述                                     | 类型                                                     | 默认值      |
| -------------------- | ---------------------------------------- | -------------------------------------------------------- | ----------- |
| `active-tab`         | 当前激活标签 key；设置后可用于受控模式。 | `string &#124; undefined`                                | `undefined` |
| `default-active-tab` | 非受控模式下的初始激活标签 key。         | `string`                                                 | `''`        |
| `size`               | 标签导航尺寸。                           | `'small' &#124; 'default' &#124; 'large'`                | `'default'` |
| `type`               | 标签导航视觉类型。                       | `'line' &#124; 'text' &#124; 'rounded' &#124; 'capsule'` | `'line'`    |
| `tab-position`       | 标签导航位置。                           | `'top' &#124; 'right' &#124; 'bottom' &#124; 'left'`     | `'top'`     |

### ve-tabs 事件

| 事件名      | 描述                         | 参数类型                             |
| ----------- | ---------------------------- | ------------------------------------ |
| `ve-change` | 用户切换到非禁用标签时触发。 | `CustomEvent<{ activeTab: string }>` |

### ve-tabs 插槽

| 插槽名   | 描述                     |
| -------- | ------------------------ |
| 默认插槽 | 放置多个 `ve-tab-pane`。 |

### ve-tab-pane 属性

| 属性名     | 描述                                      | 类型      | 默认值  |
| ---------- | ----------------------------------------- | --------- | ------- |
| `key`      | 标签页唯一标识，需保持稳定。              | `string`  | `''`    |
| `title`    | 标签页文本标题；未提供 `tab` 插槽时使用。 | `string`  | `''`    |
| `disabled` | 是否禁用该标签页。                        | `boolean` | `false` |

### ve-tab-pane 事件

| 事件名               | 描述                                             | 参数类型      |
| -------------------- | ------------------------------------------------ | ------------- |
| `ve-tab-pane-change` | 标签页标识、标题、禁用状态或标题内容变化时触发。 | `CustomEvent` |

### ve-tab-pane 方法

| 方法名          | 描述                                      |
| --------------- | ----------------------------------------- |
| `getTabNodes()` | 返回 `tab` 插槽中用于渲染标签的元素节点。 |

### ve-tab-pane 插槽

| 插槽名   | 描述             |
| -------- | ---------------- |
| 默认插槽 | 标签页内容面板。 |
| `tab`    | 自定义标签内容。 |
