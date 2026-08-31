`ve-thinking` 用于在 AI 对话、Agent 执行和 AI Build 流程中展示一段可公开的思考摘要、规划说明或阶段性执行解释。

## 何时使用

- 在 AI 回复前展示可公开的推理摘要或执行说明。
- 在 Agent 规划、检索摘要、工具选择说明、生成进度说明中承载过程文本。
- 需要展示生成中、完成、展开收起、限高滚动或自动追尾等状态。

> `ve-thinking` 只适合展示可公开的过程摘要，不应用于暴露未审查的调试信息、系统提示内容或不应公开的过程细节。

## 引入组件

```ts
import '@ve-design/web/ve-thinking';
```

## 示例

### 基础用法

使用 `title` 设置标题，使用 `loading` 表示生成中状态。

```html preview
<script type="module">
  import '@ve-design/web/ve-thinking';
</script>

<section style="display:grid; gap:20px; width:min(100%, 760px); margin:0 auto; padding:24px">
  <ve-thinking title="Thinking" loading expanded>
    <div>
      I am reviewing the request, separating public product value from
      implementation detail, and preparing a concise answer structure.
    </div>
  </ve-thinking>

  <ve-thinking id="thinking-basic-completed" title="Thought for 37s">
    <div>
      The response can be organized around user intent, required constraints,
      and a final recommendation that stays clear enough for handoff.
    </div>
  </ve-thinking>
</section>

<script>
  document.getElementById('thinking-basic-completed').expanded = false;
</script>
```

### 流式内容

默认插槽由业务侧写入。流式生成时可以持续追加文本，并在完成后更新标题与状态。下面通过同一段流式内容回放两个面板，对比完成后自动折叠和保持展开两种收尾方式。

```html preview
<script type="module">
  import '@ve-design/web/ve-button';
  import '@ve-design/web/ve-thinking';
  import '@ve-design/web/icons/refresh';
</script>

<section style="display:grid; gap:12px; width:min(100%, 920px); margin:0 auto; padding:24px">
  <ve-button id="thinking-stream-replay" type="secondary" size="small">
    <ve-icon name="refresh"></ve-icon>
    <span>Replay stream</span>
  </ve-button>

  <div style="display:grid; grid-template-columns:repeat(2, minmax(280px, 1fr)); gap:20px; align-items:start;">
    <div style="display:grid; gap:8px;">
      <strong style="font-size:14px;">Collapse after complete</strong>
      <ve-thinking
        id="thinking-stream-collapse"
        title="Thinking"
        loading
        expanded
        max-height="260px"
      >
        <span
          id="thinking-stream-collapse-content"
          style="white-space:pre-wrap; line-height:22px;"
        ></span>
      </ve-thinking>
    </div>

    <div style="display:grid; gap:8px;">
      <strong style="font-size:14px;">Keep expanded</strong>
      <ve-thinking
        id="thinking-stream-expanded"
        title="Thinking"
        loading
        expanded
        max-height="260px"
      >
        <span
          id="thinking-stream-expanded-content"
          style="white-space:pre-wrap; line-height:22px;"
        ></span>
      </ve-thinking>
    </div>
  </div>
</section>

<script>
  const replayButton = document.getElementById('thinking-stream-replay');
  const collapseHost = document.getElementById('thinking-stream-collapse');
  const expandedHost = document.getElementById('thinking-stream-expanded');
  const collapseContent = document.getElementById(
    'thinking-stream-collapse-content',
  );
  const expandedContent = document.getElementById(
    'thinking-stream-expanded-content',
  );
  const streamText = [
    'I have confirmed that the user needs a migration update for platform administrators. The summary should start with rollout status, switched workspaces, and regions that still need manual verification.',
    '\n\nThe second section should explain operational impact in plain language: approval latency dropped, failed sync jobs decreased, and support tickets now come from a small set of legacy projects.',
    '\n\nThe final paragraph should mention the change window, audit-log checklist, rollback owner, and communication plan for tenant admins.',
  ].join('');
  let progress = 0;
  let timer = 0;

  const resetStream = () => {
    window.clearInterval(timer);
    progress = 0;
    collapseContent.textContent = '';
    expandedContent.textContent = '';
    collapseHost.title = 'Thinking';
    expandedHost.title = 'Thinking';
    collapseHost.loading = true;
    expandedHost.loading = true;
    collapseHost.expanded = true;
    expandedHost.expanded = true;
  };

  const startStream = () => {
    resetStream();

    timer = window.setInterval(() => {
      const next = streamText.slice(0, progress);
      collapseContent.textContent = next;
      expandedContent.textContent = next;
      progress += 3;

      if (progress > streamText.length) {
        collapseContent.textContent = streamText;
        expandedContent.textContent = streamText;
        window.clearInterval(timer);
        collapseHost.loading = false;
        expandedHost.loading = false;
        collapseHost.expanded = false;
        expandedHost.expanded = true;
        collapseHost.title = 'Thought for 8s';
        expandedHost.title = 'Thought for 8s';
      }
    }, 28);
  };

  replayButton.addEventListener('click', startStream);
  startStream();
</script>
```

### 限高滚动

使用 `max-height` 限制正文高度。内容超过高度后会在组件内容区滚动。

```html preview
<script type="module">
  import '@ve-design/web/ve-thinking';
</script>

<section style="display:grid; width:min(100%, 760px); margin:0 auto; padding:24px">
  <ve-thinking title="Thinking" loading expanded max-height="180px">
    <div style="display:grid; gap:12px; line-height:1.7;">
      <div>
        The first step is to turn a broad strategy request into a public
        communication structure. The answer should explain why the topic
        matters, what evidence is available, and which claims should stay
        outside the final response.
      </div>
      <div>
        The second step is to group the material by audience. Executives need
        the business outcome, operators need the rollout risk, and product teams
        need a clear statement of scope and ownership.
      </div>
      <div>
        The third step is to check the operational details. The migration note
        should mention the affected tenants, validation window, expected
        downtime, rollback owner, and support escalation path.
      </div>
      <div>
        The fourth step is to separate confirmed data from assumptions. Anything
        based on non-public dashboards should be rewritten as a neutral
        product statement or removed from the final customer-facing answer.
      </div>
      <div>
        The fifth step is to keep the final answer reusable. Each section should
        contain one clear message, one supporting detail, and one next action.
      </div>
      <div>
        The final pass should remove unsupported claims, reduce repeated
        wording, and keep the tone precise enough for customer-facing delivery.
      </div>
    </div>
  </ve-thinking>
</section>
```

### 自动追尾

`auto-scroll` 默认开启。设置 `auto-scroll="false"` 后，流式内容追加时不会主动滚动到底部。

```html preview
<script type="module">
  import '@ve-design/web/ve-button';
  import '@ve-design/web/ve-thinking';
  import '@ve-design/web/icons/refresh';
</script>

<section style="display:grid; gap:16px; width:min(100%, 920px); margin:0 auto; padding:24px">
  <ve-button id="thinking-scroll-replay" type="secondary" size="small">
    <ve-icon name="refresh"></ve-icon>
    <span>Replay comparison</span>
  </ve-button>

  <div style="display:grid; grid-template-columns:repeat(2, minmax(280px, 1fr)); gap:20px; align-items:start;">
    <div style="display:grid; gap:8px;">
      <strong style="font-size:14px;">Auto scroll</strong>
      <ve-thinking
        id="thinking-auto-scroll"
        title="Thinking"
        loading
        expanded
        max-height="180px"
      >
        <span
          id="thinking-auto-scroll-content"
          style="white-space:pre-wrap; line-height:22px;"
        ></span>
      </ve-thinking>
    </div>

    <div style="display:grid; gap:8px;">
      <strong style="font-size:14px;">Manual scroll</strong>
      <ve-thinking
        id="thinking-manual-scroll"
        title="Thinking"
        loading
        expanded
        max-height="180px"
        auto-scroll="false"
      >
        <span
          id="thinking-manual-scroll-content"
          style="white-space:pre-wrap; line-height:22px;"
        ></span>
      </ve-thinking>
    </div>
  </div>
</section>

<script>
  const replay = document.getElementById('thinking-scroll-replay');
  const autoHost = document.getElementById('thinking-auto-scroll');
  const manualHost = document.getElementById('thinking-manual-scroll');
  const autoContent = document.getElementById('thinking-auto-scroll-content');
  const manualContent = document.getElementById(
    'thinking-manual-scroll-content',
  );
  const text = [
    'Step 1: confirm the user-facing goal and remove non-public details.',
    '\n\nStep 2: map the current rollout status to tenant groups, regions, and owner teams.',
    '\n\nStep 3: describe operational impact with concrete but safe language.',
    '\n\nStep 4: keep rollback, audit-log validation, and communication owners visible.',
    '\n\nStep 5: finish with a short customer-ready summary and the next checkpoint.',
    '\n\nStep 6: review the final response for unsupported assumptions before sending.',
  ].join('');
  let progress = 0;
  let timer = 0;

  const reset = () => {
    window.clearInterval(timer);
    progress = 0;
    autoContent.textContent = '';
    manualContent.textContent = '';
    autoHost.title = 'Thinking';
    manualHost.title = 'Thinking';
    autoHost.loading = true;
    manualHost.loading = true;
    autoHost.expanded = true;
    manualHost.expanded = true;
  };

  const start = () => {
    reset();

    timer = window.setInterval(() => {
      const next = text.slice(0, progress);
      autoContent.textContent = next;
      manualContent.textContent = next;
      progress += 3;

      if (progress > text.length) {
        autoContent.textContent = text;
        manualContent.textContent = text;
        window.clearInterval(timer);
        autoHost.loading = false;
        manualHost.loading = false;
        autoHost.title = 'Auto scroll completed';
        manualHost.title = 'Manual scroll completed';
      }
    }, 28);
  };

  replay.addEventListener('click', start);
  start();
</script>
```

### 展开收起事件

用户点击标题区或在标题区聚焦时按下 Enter / Space 会切换 `expanded`，并派发 `ve-thinking-toggle` 事件。

```html preview
<script type="module">
  import '@ve-design/web/ve-thinking';
</script>

<section style="display:grid; gap:12px; width:min(100%, 760px); margin:0 auto; padding:24px">
  <ve-thinking id="thinking-toggle-demo" title="Reasoning summary">
    <div>
      I checked the requested output, confirmed the constraints, and prepared a
      concise implementation path.
    </div>
  </ve-thinking>

  <output
    id="thinking-toggle-output"
    style="min-height:22px; color:var(--color-text-secondary); font-size:13px;"
  >
    Click the header to collapse or expand the content.
  </output>
</section>

<script>
  const thinking = document.getElementById('thinking-toggle-demo');
  const output = document.getElementById('thinking-toggle-output');

  thinking.addEventListener('ve-thinking-toggle', (event) => {
    output.textContent = `expanded: ${event.detail.expanded}`;
  });
</script>
```

### 标题扩展与自定义图标

使用 `header-extra` 放置标题尾部信息，使用 `icon` 替换默认状态图标。

```html preview
<script type="module">
  import '@ve-design/web/ve-button';
  import '@ve-design/web/ve-thinking';
  import '@ve-design/web/icons/atom';
  import '@ve-design/web/icons/copy';
  import '@ve-design/web/icons/document';
  import '@ve-design/web/icons/search';
</script>

<section style="display:grid; gap:16px; width:min(100%, 760px); margin:0 auto; padding:24px">
  <ve-thinking title="Reasoning completed" expanded>
    <ve-icon slot="icon" name="search" size="18"></ve-icon>
    <span
      slot="header-extra"
      style="font-size:12px; color:var(--color-text-secondary);"
    >
      8.2s | 1,284 tokens
    </span>
    <div>
      The trailing area can show duration, token usage, confidence labels, or a
      compact action without overloading the title.
    </div>
  </ve-thinking>

  <ve-thinking title="Planning answer..." loading expanded>
    <ve-icon slot="icon" name="document" size="18"></ve-icon>
    <ve-button slot="header-extra" type="text" size="small" style="font-size:12px;">
      <ve-icon name="copy" size="14"></ve-icon>
    </ve-button>
    <div>
      Actions in the trailing area keep their own click handlers and do not
      toggle the panel.
    </div>
  </ve-thinking>

  <ve-thinking title="Knowledge retrieval" expanded>
    <ve-icon slot="icon" name="atom" size="18"></ve-icon>
    <span
      slot="header-extra"
      style="font-size:12px; color:var(--color-text-secondary);"
    >
      Search + docs
    </span>
    <div>
      Search, document, and atom icons can represent retrieval, evidence, or
      analysis stages more directly than a generic status mark.
    </div>
  </ve-thinking>
</section>
```

## API

### 属性

| 属性名 | 描述 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `title` | 标题区展示的文案 | `string` | `''` |
| `loading` | 是否处于生成中状态 | `boolean` | `false` |
| `expanded` | 正文是否展开 | `boolean` | `true` |
| `max-height` | 正文最大高度，内容超出后内容区域滚动 | `string` | `''` |
| `auto-scroll` | 流式内容变化时是否在用户接近底部时自动追尾 | `boolean` | `true` |

### 事件

| 事件名 | 描述 | `event.detail` |
| --- | --- | --- |
| `ve-thinking-toggle` | 展开状态变化后触发 | `{ expanded: boolean }` |

### 方法

| 方法名 | 描述 |
| --- | --- |
| `toggle()` | 切换展开状态，并派发 `ve-thinking-toggle` 事件 |

### 插槽

| 插槽名 | 描述 |
| --- | --- |
| 默认插槽 | 思考正文内容 |
| `icon` | 自定义标题区左侧图标 |
| `header-extra` | 标题行尾部扩展内容 |
