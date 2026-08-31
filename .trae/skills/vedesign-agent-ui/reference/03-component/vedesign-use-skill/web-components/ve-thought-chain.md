`ve-thought-chain` 用于展示 Agent 可公开的执行过程摘要，例如意图理解、检索、工具调用、生成结果和校验步骤。组件负责链路结构、状态图标、连接线、折叠和滚动；查询词、链接、代码块和结果卡片等业务内容由使用方通过插槽组合。

## 何时使用

- 需要解释 Agent 当前经历了哪些可公开阶段，以及每个阶段的执行状态。
- 需要在同一链路中展示文本、标签、链接、代码片段、文件卡片等富内容。
- 需要支持根链路或节点内容展开收起、限高滚动、受控展开状态时。

## 引入组件

```ts
import '@ve-design/web/ve-thought-chain';
```

## 示例

### 基础用法

默认情况下根链和节点均可折叠且展开。使用 `title` 设置根标题或节点标题，使用 `status` 表示节点状态。

```html preview
<script type="module">
  import '@ve-design/web/ve-thought-chain';
</script>

<section
  style="max-width:960px; padding:24px; color:var(--color-text-1, #1d2129);"
>
  <ve-thought-chain title="Drafting the 2025 product strategy article · 37s">
    <ve-thought-chain-item
      key="request"
      title="Understand the request"
      status="success"
    >
      The user needs an external-facing article about the 2025 product strategy.
      I first need to identify the key strategic directions, understand who will
      read the article, and keep the language clear enough for partners,
      customers, and industry observers.
    </ve-thought-chain-item>

    <ve-thought-chain-item
      key="strategy"
      title="Draft the strategy narrative"
      status="default"
      max-height="320px"
    >
      <div style="display:grid; gap:8px; line-height:1.7;">
        <div>
          The first step is to turn a broad strategy request into a public
          communication structure. The article should explain why the strategy
          matters, how the product portfolio supports customers, and what kind
          of long-term value the platform is expected to create. Since the
          audience may include partners, customers, developers, and industry
          observers, the language should be precise but not overly technical.
        </div>
        <div>
          The core narrative can start from the rise of AI-native cloud
          services. Instead of presenting artificial intelligence as a single
          product capability, the story should show how model service,
          intelligent applications, data intelligence, video cloud, and cloud
          infrastructure form a connected product system. This makes the
          strategy easier to understand and helps the audience see how different
          product lines reinforce one another.
        </div>
        <div>
          For the model service section, the article should emphasize that a
          model platform is not only a place to train or deploy models. It is
          also the bridge between developers and practical AI capabilities. With
          a managed platform, teams can explore model selection, fine-tuning,
          inference, evaluation, and governance without rebuilding complex
          infrastructure from scratch. This directly lowers the threshold for
          enterprise AI adoption.
        </div>
        <div>
          For intelligent applications, the discussion should focus on
          scenario-driven value. The audience does not only care about whether a
          model is powerful; they care about whether the model can support work
          such as content creation, coding assistance, customer service,
          knowledge management, and data analysis. The strategy should therefore
          connect product capability with real workflows and measurable
          improvements in productivity.
        </div>
        <div>
          Data intelligence is another important foundation. In the AI era, data
          quality, real-time processing, governance, and analytics become
          essential for building reliable intelligent systems. The article can
          explain that a strong data platform helps enterprises transform raw
          business data into structured knowledge, operational insights, and
          trustworthy inputs for AI applications.
        </div>
        <div>
          Video cloud remains a natural extension of the platform's strengths.
          As short video, livestreaming, media collaboration, and immersive
          experiences become common across industries, companies need stable
          capabilities for capture, processing, distribution, playback, and
          intelligent media analysis. This section can connect technical
          capability with customer experience and business growth.
        </div>
        <div>
          Finally, the infrastructure section should make the whole strategy
          feel dependable. Compute, storage, networking, container platforms,
          and elasticity are not just background capabilities; they determine
          whether upper-layer AI and media services can remain stable, scalable,
          and cost efficient. A strong close can summarize the strategy as a
          layered system: infrastructure supports data, data supports models,
          models support applications, and applications create business value.
        </div>
      </div>
    </ve-thought-chain-item>

    <ve-thought-chain-item
      key="outline"
      title="Prepare the final outline"
      status="loading"
    >
      The final outline should follow a strategy-to-case-to-value structure so
      that readers can quickly understand the product direction and remember the
      key message after the presentation.
    </ve-thought-chain-item>

    <ve-thought-chain-item
      key="review-error"
      title="Review blocked by missing evidence"
      status="error"
    >
      The strategy article cannot move forward because several product claims
      still lack public evidence. Before publishing, the team needs to replace
      unsupported statements with verified examples or remove them from the
      external-facing draft.
    </ve-thought-chain-item>

    <ve-thought-chain-item
      key="publish-abort"
      title="Abort the publishing path"
      status="abort"
    >
      This publishing path is intentionally stopped because the audience and
      launch timing have changed. The draft should be preserved as reference,
      but the final article needs to restart from the updated communication
      plan.
    </ve-thought-chain-item>
  </ve-thought-chain>
</section>
```

### 流式输出

```html preview
<script type="module">
  import '@ve-design/web/ve-alert';
  import '@ve-design/web/ve-button';
  import '@ve-design/web/ve-thought-chain';
  import '@ve-design/web/icons/refresh';
</script>

<section
  style="display:grid; gap:16px; width:min(100%, 960px); padding:24px; color:var(--color-text-1, #1d2129);"
>
  <ve-button id="thought-chain-stream-replay" type="secondary" size="small">
    <ve-icon name="refresh"></ve-icon>
    <span>Replay stream</span>
  </ve-button>

  <ve-thought-chain id="thought-chain-stream" title="Drafting the 2025 product strategy article · 37s" loading></ve-thought-chain>
</section>

<script>
  const replay = document.getElementById('thought-chain-stream-replay');
  const chain = document.getElementById('thought-chain-stream');
  const streamSteps = [
    {
      key: 'request',
      title: 'Understand the request',
      finalStatus: 'success',
      text:
        'The user needs an external-facing article about the 2025 product strategy. I first need to identify the key strategic directions, understand who will read the article, and keep the language clear enough for partners, customers, and industry observers.',
    },
    {
      key: 'strategy',
      title: 'Draft the strategy narrative',
      finalStatus: 'default',
      text: [
        'The first step is to turn a broad strategy request into a public communication structure. The article should explain why the strategy matters, how the product portfolio supports customers, and what kind of long-term value the platform is expected to create.',
        'The narrative can then connect model service, intelligent applications, data intelligence, video cloud, and cloud infrastructure into one layered platform story that is easier for external readers to follow.',
      ].join('\n\n'),
      alert: {
        type: 'info',
        text: 'Keep the public narrative aligned with verified product capabilities before moving to the final outline.',
      },
    },
    {
      key: 'outline',
      title: 'Prepare the final outline',
      finalStatus: 'success',
      text:
        'The final outline should follow a strategy-to-case-to-value structure so that readers can quickly understand the product direction and remember the key message after the presentation.',
    },
    {
      key: 'delivery',
      title: 'Finalize the publish-ready summary',
      finalStatus: 'success',
      text:
        'The publish-ready summary is now structured for review, with clear strategy framing, supporting examples, and a concise closing recommendation.',
    },
  ];

  let timer = 0;

  const createStreamItem = (step) => {
    const item = document.createElement('ve-thought-chain-item');
    item.setAttribute('key', step.key);
    item.setAttribute('title', step.title);
    item.setAttribute('status', 'loading');

    const stack = document.createElement('div');
    stack.style.display = 'grid';
    stack.style.gap = '8px';

    const content = document.createElement('div');
    content.style.display = 'grid';
    content.style.gap = '8px';
    content.style.lineHeight = '1.7';
    stack.append(content);

    let alert = null;

    if (step.alert) {
      alert = document.createElement('ve-alert');
      alert.setAttribute('type', step.alert.type);
      alert.textContent = step.alert.text;
      alert.hidden = true;
      stack.append(alert);
    }

    item.append(stack);

    return { item, content, alert };
  };

  const renderStreamText = (node, text) => {
    node.replaceChildren();
    text.split('\n\n').forEach((paragraph) => {
      const p = document.createElement('div');
      p.textContent = paragraph;
      node.append(p);
    });
  };

  const startStream = () => {
    window.clearInterval(timer);
    chain.replaceChildren();

    let stepIndex = 0;
    let progress = 0;
    let phase = 'typing';
    let pauseTicks = 0;
    const active = [];
    const first = createStreamItem(streamSteps[0]);

    active.push(first);
    chain.append(first.item);

    timer = window.setInterval(() => {
      const currentStep = streamSteps[stepIndex];
      const currentNode = active[stepIndex];

      if (phase === 'pause') {
        pauseTicks += 1;

        if (pauseTicks >= 8 && stepIndex < streamSteps.length - 1) {
          stepIndex += 1;
          progress = 0;
          pauseTicks = 0;
          phase = 'typing';

          const nextNode = createStreamItem(streamSteps[stepIndex]);
          active.push(nextNode);
          chain.append(nextNode.item);
        }

        return;
      }

      progress += 4;
      const nextText = currentStep.text.slice(0, progress);
      renderStreamText(currentNode.content, nextText);

      if (progress > currentStep.text.length) {
        renderStreamText(currentNode.content, currentStep.text);
        currentNode.item.setAttribute('status', currentStep.finalStatus);

        if (stepIndex === streamSteps.length - 1) {
          chain.removeAttribute('loading');
        }

        if (currentNode.alert) {
          currentNode.alert.hidden = false;
        }

        if (stepIndex === streamSteps.length - 1) {
          window.clearInterval(timer);
          return;
        }

        phase = 'pause';
      }
    }, 24);
  };

  replay.addEventListener('click', startStream);
  startStream();
</script>
```

### 复杂节点内容

复杂节点内容如复杂标题、图标、状态和操作可通过插槽组合展示。

```html preview
<script type="module">
  import '@ve-design/web/ve-thought-chain';
  import '@ve-design/web/ve-artifact-card';
  import '@ve-design/web/ve-icon';
  import '@ve-design/web/ve-link';
  import '@ve-design/web/icons/atom';
  import '@ve-design/web/icons/check-circle';
  import '@ve-design/web/icons/document';
  import '@ve-design/web/icons/edit';
  import '@ve-design/web/icons/logo-bytedance-icon';
  import '@ve-design/web/icons/logo-doubao-llm-icon';
  import '@ve-design/web/icons/logo-volcano-engine-icon';
  import '@ve-design/web/icons/search';
  import '@ve-design/web/icons/tool';
</script>

<style>
  .cot-demo {
    display: grid;
    gap: var(--space-l);
    width: min(100%, 872px);
    margin: 0 auto;
    padding: var(--space-l);
    color: var(--color-text-primary);
    font-family: var(--font-sans);
  }

  .cot-stack {
    display: grid;
    gap: var(--space-xxs);
    color: var(--color-text-secondary);
    font-size: var(--text-body);
    line-height: 22px;
  }

  .cot-copy {
    display: grid;
    gap: var(--space-xxs);
  }

  .cot-copy p {
    margin: 0;
    color: var(--color-text-secondary);
    font-size: var(--text-body);
    line-height: 22px;
  }

  .cot-query-group {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-xxs);
  }

  .cot-query {
    display: inline-flex;
    align-items: center;
    gap: var(--space-xxxs);
  }

  .cot-link-list {
    display: grid;
    gap: var(--space-xxxs);
  }

  .cot-link-row {
    display: flex;
    align-items: center;
    gap: var(--space-xxxs);
    min-width: 0;
    padding: 2px var(--space-xxxs);
    border-radius: var(--radius-sm);
  }

  .cot-link-row ve-icon {
    color: var(--color-text-tertiary);
  }

  .cot-link-row ve-link {
    min-width: 0;
    --ve-link-current-text: var(--color-text-secondary);
    --ve-link-current-text-hover: var(--color-text-accent);
    --ve-link-font-size: var(--text-body);
    --ve-link-font-weight: var(--font-weight-normal);
    --ve-link-line-height: 22px;
  }

  .cot-code-panel {
    box-sizing: border-box;
    max-height: 240px;
    margin: 0;
    overflow: hidden;
    padding: var(--space-s);
    border: var(--stroke-weight-base) solid var(--color-border-default);
    border-radius: var(--radius-lg);
    background: var(--color-bg-overlay);
    color: var(--color-text-secondary);
    font: var(--font-weight-normal) var(--text-caption) / 20px var(--font-mono);
    white-space: pre-wrap;
  }

  .cot-code-keyword {
    color: var(--color-text-accent);
  }

  .cot-code-function {
    color: var(--color-text-danger);
  }

  .cot-code-string {
    color: var(--color-text-success);
  }

  .cot-result-stack {
    display: grid;
    gap: var(--space-xxs);
  }

  .cot-thumb-row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--space-xxs);
  }

  .cot-thumb {
    width: 60px;
    height: 60px;
    border-radius: var(--radius-md);
    background: var(--color-bg-surface);
  }
</style>

<section class="cot-demo">
  <ve-thought-chain collapsible="false">
    <ve-thought-chain-item
      key="thought"
      title="单条想法 Thought"
      max-height="108px"
      overflow="collapsible"
    >
      <ve-icon slot="icon" name="atom"></ve-icon>
      <div class="cot-stack">
        <div class="cot-copy">
          <p>
            用户让我基于云服务平台 2025 产品战略起草一篇对外分享的文章，首先需要明确核心战略方向，并把大模型、智能应用、数据智能、视频云和基础云组织成清晰结构。
          </p>
          <p>
            对外分享需要兼顾专业性和传播性，既要避免过于技术化，也要能给合作伙伴、客户和行业同行留下稳定可信的产品印象。
          </p>
          <p>
            我的方案是使用“战略、案例、价值”三层结构降低听众认知负担，并把可公开的信息组织成适合演讲和文章复用的表达。
          </p>
          <p>
            文章开头需要先说明 2025 战略的核心背景，再逐步展开大模型、智能应用、数据智能、视频云和基础云之间的关系。
          </p>
          <p>
            每个方向都应该配一个能够被公开引用的客户场景，避免只堆砌抽象能力或未说明的术语。
          </p>
          <p>
            收尾部分需要回到业务价值，强调平台能力如何帮助客户降低 AI 落地门槛、提升生产效率并保持长期稳定性。
          </p>
        </div>
      </div>
    </ve-thought-chain-item>

    <ve-thought-chain-item key="knowledge" title="知识库">
      <ve-icon slot="icon" name="document"></ve-icon>
      <div class="cot-stack">
        <span>云服务平台 product conference 2026</span>
        <div class="cot-link-list">
          <div class="cot-link-row">
            <ve-icon name="logo-volcano-engine-icon" size="14"></ve-icon>
            <ve-link href="#">云服务平台 - 官方产品介绍</ve-link>
          </div>
          <div class="cot-link-row">
            <ve-icon name="logo-bytedance-icon" size="14"></ve-icon>
            <ve-link href="#">Enterprise service market overview</ve-link>
          </div>
          <div class="cot-link-row">
            <ve-icon name="logo-doubao-llm-icon" size="14"></ve-icon>
            <ve-link href="#">AI infrastructure analysis</ve-link>
          </div>
        </div>
      </div>
    </ve-thought-chain-item>

    <ve-thought-chain-item key="search" title="联网搜索 Web Search">
      <ve-icon slot="icon" name="search"></ve-icon>
      <div class="cot-stack">
        <span>云服务平台 product conference 2026</span>
      </div>
    </ve-thought-chain-item>

    <ve-thought-chain-item key="tool" title="工具调用 Call Tool">
      <ve-icon slot="icon" name="tool"></ve-icon>
      <pre class="cot-code-panel"><code><span class="cot-code-keyword">SELECT</span>
    `活动名称`,
    <span class="cot-code-function">SUM</span>(`销售额`) <span class="cot-code-keyword">AS</span> 销售额,
    <span class="cot-code-function">COUNT</span>(DISTINCT `订单量`) <span class="cot-code-keyword">AS</span> 订单量,
    <span class="cot-code-function">AVG</span>(`客单价`) <span class="cot-code-keyword">AS</span> 客单价
<span class="cot-code-keyword">FROM</span>
    `大消费活动分析`
<span class="cot-code-keyword">WHERE</span>
    `下单时间` BETWEEN <span class="cot-code-string">'2025-01-01'</span> AND <span class="cot-code-string">'2025-03-31'</span></code></pre>
    </ve-thought-chain-item>

    <ve-thought-chain-item key="result" title="结果 Result">
      <ve-icon slot="icon" name="edit"></ve-icon>
      <div class="cot-result-stack">
        <span>信息整理完成：[这是一段摘要总结]</span>
        <ve-artifact-card
          type="markdown"
          title="doc_generation.md"
          byte="18432"
        ></ve-artifact-card>
        <span>已根据图像文字描述生成 8 张图片</span>
        <div class="cot-thumb-row">
          <span class="cot-thumb"></span>
          <span class="cot-thumb"></span>
          <span class="cot-thumb"></span>
          <span class="cot-thumb"></span>
          <span class="cot-thumb"></span>
          <span class="cot-thumb"></span>
          <span class="cot-thumb"></span>
          <span class="cot-thumb"></span>
        </div>
        <span>PPT 绘制完成：共 10 页</span>
      </div>
    </ve-thought-chain-item>

    <ve-thought-chain-item key="done" title="完成" status="success" collapsible="false"></ve-thought-chain-item>
  </ve-thought-chain>
</section>
```

### 折叠与限高

`collapsible` 控制是否可折叠，`default-open` 和 `default-expanded` 控制初始展开状态。内容较长时可通过 `max-height` 限制节点详情高度，并用 `overflow` 控制超出后的内容区域滚动或查看更多。

```html preview
<script type="module">
  import '@ve-design/web/ve-thought-chain';
  import '@ve-design/web/ve-alert';
  import '@ve-design/web/ve-tag';
</script>

<section style="display:grid; gap:24px; width:min(100%, 860px); margin:0 auto; padding:32px;">
  <ve-thought-chain title="Initially collapsed root" default-open="false">
    <ve-thought-chain-item
      key="summary"
      title="Quarterly account health"
      status="default"
    >
      <div style="display:flex; gap:8px; flex-wrap:wrap; align-items:center;">
        <ve-tag color="orange">12 at-risk accounts</ve-tag>
        <ve-tag color="green">8 expansion candidates</ve-tag>
        <span>Accounts are grouped by risk and expansion potential.</span>
      </div>
    </ve-thought-chain-item>
  </ve-thought-chain>

  <ve-thought-chain title="Item controls">
    <ve-thought-chain-item
      key="long"
      title="Collapsible strategy analysis"
      status="loading"
      max-height="160px"
      overflow="collapsible"
    >
      <div style="display:grid; gap:8px; line-height:1.7;">
        <div>
          The first pass identifies public product claims, separates verified
          sources from assumptions, and groups details by audience.
        </div>
        <div>
          The second pass maps each section to a concrete customer outcome:
          faster model adoption, stronger data foundations, reliable media
          delivery, and lower operational overhead.
        </div>
        <div>
          The final pass removes unsupported claims and keeps the answer short
          enough for product, marketing, and solution teams to review.
        </div>
        <div>
          For model services, the summary should explain how evaluation,
          fine-tuning, inference, and governance work together as one managed
          platform rather than isolated capabilities.
        </div>
        <div>
          For data intelligence, the narrative should connect data quality,
          real-time processing, observability, and permission control to the
          reliability of downstream AI applications.
        </div>
        <div>
          For media and infrastructure, the answer should keep the relationship
          clear: compute and network stability support media workloads, while
          media scenarios produce new product requirements.
        </div>
        <div>
          The visible max-height keeps this item compact in the page while the
          internal scroll area still preserves the full analysis for review.
        </div>
      </div>
    </ve-thought-chain-item>

    <ve-thought-chain-item
      key="scroll-long"
      title="Scrollable strategy analysis"
      status="default"
      max-height="160px"
      overflow="scroll"
    >
      <div style="display:grid; gap:8px; line-height:1.7;">
        <div>
          The scroll mode keeps the node height fixed and lets reviewers inspect
          the remaining content inside the item body.
        </div>
        <div>
          It is useful when long-running analysis should stay compact while the
          full text remains available without expanding the timeline layout.
        </div>
        <div>
          The top and bottom fades indicate whether more content is available in
          either scroll direction.
        </div>
        <div>
          This provides a direct visual comparison with the collapsible overflow
          mode above.
        </div>
      </div>
    </ve-thought-chain-item>

    <ve-thought-chain-item
      key="closed"
      title="Initially collapsed item"
      status="default"
      default-expanded="false"
    >
      This content starts collapsed but can still be opened by the user.
    </ve-thought-chain-item>

    <ve-thought-chain-item
      key="fixed"
      title="Non-collapsible item"
      status="success"
      collapsible="false"
    >
      Use `collapsible="false"` when the content should always stay visible.
    </ve-thought-chain-item>

    <ve-thought-chain-item
      key="disabled"
      title="Disabled item"
      status="default"
      disabled
    >
      <ve-alert type="warning">
        Disabled items keep their content visible but do not respond to toggle
        interaction.
      </ve-alert>
    </ve-thought-chain-item>
  </ve-thought-chain>
</section>
```

### 嵌套链路

`ve-thought-chain-item` 的默认插槽可以继续放置 `ve-thought-chain`，用于表达某个节点下的子任务、工具调用步骤或校验明细。嵌套链路建议使用 `line="dashed"` 或 `line="none"` 降低视觉层级。

```html preview
<script type="module">
  import '@ve-design/web/ve-thought-chain';
  import '@ve-design/web/ve-alert';
</script>

<section style="width:min(100%, 920px); margin:0 auto; padding:32px;">
  <ve-thought-chain title="Data Quality Assistant" loading>
    <ve-thought-chain-item
      key="audit"
      title="Audit revenue dashboard"
      status="success"
    >
      <ve-thought-chain
        title="Validation steps"
        line="dashed"
      >
        <ve-thought-chain-item
          key="freshness"
          title="Check source freshness"
          status="success"
        >
          <ve-alert type="success">
            All upstream datasets completed within the freshness window. Latest
            partition was produced 8 minutes ago.
          </ve-alert>
        </ve-thought-chain-item>

        <ve-thought-chain-item
          key="reconcile"
          title="Reconcile ARR metric"
          status="success"
        >
          <div style="display:flex; flex-direction:column; gap:10px;">
            <ve-alert type="info">
              Difference is below the configured 0.1% tolerance. The dashboard
              can keep the current ARR value without manual override.
            </ve-alert>
            <div style="display:flex; gap:8px; flex-wrap:wrap;">
              <span>0.03% delta · tolerance 0.1%</span>
            </div>
          </div>
        </ve-thought-chain-item>

        <ve-thought-chain-item
          key="anomaly"
          title="Inspect APAC anomaly"
          status="default"
        >
          <div style="display:flex; flex-direction:column; gap:10px;">
            <ve-alert type="warning">
              The anomaly is explainable but still needs a short analyst note
              before the dashboard is shared with leadership.
            </ve-alert>
            <div
              style="display:flex; justify-content:space-between; gap:12px; align-items:center; flex-wrap:wrap;"
            >
              <span>Analyst note required before sharing.</span>
            </div>
          </div>
        </ve-thought-chain-item>
      </ve-thought-chain>
    </ve-thought-chain-item>

    <ve-thought-chain-item
      key="publish"
      title="Prepare publish summary"
      status="loading"
    >
      <ve-thought-chain line="none">
        <ve-thought-chain-item
          key="note"
          title="Draft release note"
          status="success"
        >
          <span>Summary ready for review.</span>
        </ve-thought-chain-item>

        <ve-thought-chain-item
          key="owner"
          title="Assign follow-up owner"
          status="loading"
        >
          <div
            style="display:flex; flex-direction:column; gap:10px;"
          >
            <ve-alert type="info">
              Owner is pending confirmation. Assign a regional reviewer before
              publishing the dashboard.
            </ve-alert>
            <div
              style="display:flex; justify-content:space-between; gap:12px; align-items:center; flex-wrap:wrap;"
            >
              <span>Owner: Revenue Analytics · Due: tomorrow 10:00</span>
              <span>Awaiting owner confirmation</span>
            </div>
          </div>
        </ve-thought-chain-item>
      </ve-thought-chain>
    </ve-thought-chain-item>
  </ve-thought-chain>
</section>
```

### 自定义图标和标题

根链和节点均支持 `icon`、`title` 插槽，自定义标题中可以组合文本、标签和状态信息。

```html preview
<script type="module">
  import '@ve-design/web/ve-thought-chain';
  import '@ve-design/web/ve-artifact-card';
  import '@ve-design/web/ve-icon';
  import '@ve-design/web/ve-link';
  import '@ve-design/web/icons/atom';
  import '@ve-design/web/icons/document';
  import '@ve-design/web/icons/link';
  import '@ve-design/web/icons/search';
  import '@ve-design/web/icons/tool';
</script>

<style>
  .custom-title-demo {
    display: grid;
    gap: var(--space-s);
    width: min(100%, 860px);
    margin: 0 auto;
    padding: var(--space-l);
  }

  .custom-title-row {
    display: inline-flex;
    align-items: center;
    gap: var(--space-xxs);
    min-height: var(--ve-thought-chain-text-line-height, 24px);
    line-height: var(--ve-thought-chain-text-line-height, 24px);
    vertical-align: middle;
  }

  .custom-title-row ve-icon {
    color: var(--color-text-info);
  }

  .custom-title-content {
    display: grid;
    gap: var(--space-xs);
  }

  .custom-title-links {
    display: grid;
    gap: var(--space-xxxs);
  }

  .custom-title-link {
    display: inline-flex;
    align-items: center;
    gap: var(--space-xxxs);
    min-width: 0;
  }

  .custom-title-link ve-icon {
    color: var(--color-text-tertiary);
  }

  .custom-title-link ve-link {
    --ve-link-current-text: var(--color-text-secondary);
    --ve-link-current-text-hover: var(--color-text-accent);
    --ve-link-font-size: var(--text-body);
    --ve-link-font-weight: var(--font-weight-normal);
    --ve-link-line-height: 22px;
  }

  .custom-title-code {
    box-sizing: border-box;
    margin: 0;
    padding: var(--space-xs) var(--space-s);
    overflow: auto;
    border: var(--stroke-weight-base) solid var(--color-border-default);
    border-radius: var(--radius-md);
    background: var(--color-bg-muted);
    color: var(--color-text-secondary);
    font: var(--font-weight-normal) var(--text-caption) / 20px var(--font-mono);
    white-space: pre-wrap;
  }
</style>

<section class="custom-title-demo">
  <ve-thought-chain>
    <ve-icon slot="icon" name="atom"></ve-icon>
    <span slot="title" class="custom-title-row">
      Research Assistant Runbook · live · 3 sources
    </span>

    <ve-thought-chain-item key="search" status="loading">
      <ve-icon slot="icon" name="search"></ve-icon>
      <span slot="title" class="custom-title-row">
        Collect public references · web
      </span>
      <div class="custom-title-content">
        <span>Search product pages, launch notes, and public media references.</span>
        <span>Keywords: product strategy · AI cloud · customer cases</span>
      </div>
    </ve-thought-chain-item>

    <ve-thought-chain-item key="references" status="success">
      <ve-icon slot="icon" name="document"></ve-icon>
      <span slot="title" class="custom-title-row">
        Review reference material · verified
      </span>
      <div class="custom-title-content">
        <div class="custom-title-links">
          <span class="custom-title-link">
            <ve-icon name="link" size="14"></ve-icon>
            <ve-link href="#">Product architecture overview</ve-link>
          </span>
          <span class="custom-title-link">
            <ve-icon name="link" size="14"></ve-icon>
            <ve-link href="#">Customer case summary</ve-link>
          </span>
        </div>
        <ve-artifact-card
          type="markdown"
          title="research-brief.md"
          byte="24576"
        ></ve-artifact-card>
      </div>
    </ve-thought-chain-item>

    <ve-thought-chain-item key="tool" status="default">
      <ve-icon slot="icon" name="tool"></ve-icon>
      <span slot="title" class="custom-title-row">
        Prepare reusable prompt · tool
      </span>
      <pre class="custom-title-code"><code>audience = "executive and partner readers"
tone = "clear, public-facing, technically credible"
sections = ["strategy", "capability", "customer value", "next step"]</code></pre>
    </ve-thought-chain-item>
  </ve-thought-chain>
</section>
```

### 受控展开状态

`open` 控制根链展开状态，`expandedKeys` 控制节点展开集合。受控模式下，用户交互只触发事件，使用方需要在事件中更新 property。

每个参与折叠控制的直系 `ve-thought-chain-item` 都需要提供稳定且唯一的 `key`。重复 `key` 会共享同一份展开状态；缺失 `key` 时节点只能维护自身展开状态，父级 `expandedKeys` 无法准确管理它。若某个节点通过 `expanded` 单独受控，节点自身的 `expanded` 优先于父级 `expandedKeys`。

```html preview
<script type="module">
  import '@ve-design/web/ve-thought-chain';
  import '@ve-design/web/ve-button';
</script>

<section style="display:grid; gap:16px; width:min(100%, 860px); margin:0 auto; padding:32px;">
  <div style="display:flex; gap:8px; flex-wrap:wrap; justify-content:center;">
    <ve-button id="toggle-root" type="secondary" size="small">Toggle root</ve-button>
    <ve-button id="expand-query" type="primary" size="small">Expand query</ve-button>
    <ve-button id="collapse-items" type="secondary" size="small">Collapse items</ve-button>
    <ve-button id="toggle-single" type="secondary" size="small">Toggle single item</ve-button>
  </div>

  <ve-thought-chain id="controlled-chain" title="Controlled chain">
    <ve-thought-chain-item key="plan" title="Plan rollout" status="success">
      Define canary cohorts and rollback threshold.
    </ve-thought-chain-item>

    <ve-thought-chain-item key="query" title="Run health query" status="loading">
      Gradually validate the recommendation API across two regions.
    </ve-thought-chain-item>

    <ve-thought-chain-item id="single-item" key="single" title="Individually controlled item">
      This item is controlled by its own expanded state instead of the parent expandedKeys.
    </ve-thought-chain-item>
  </ve-thought-chain>
</section>

<script>
  const chain = document.getElementById('controlled-chain');
  const toggleRoot = document.getElementById('toggle-root');
  const expandQuery = document.getElementById('expand-query');
  const collapseItems = document.getElementById('collapse-items');
  const toggleSingle = document.getElementById('toggle-single');
  const singleItem = document.getElementById('single-item');
  let singleExpanded = false;

  chain.open = true;
  chain.expandedKeys = ['plan'];
  singleItem.expanded = singleExpanded;

  chain.addEventListener('ve-thought-chain-open-change', (event) => {
    chain.open = event.detail.open;
  });

  chain.addEventListener('ve-thought-chain-expand', (event) => {
    chain.expandedKeys = event.detail.expandedKeys;
  });

  toggleRoot.addEventListener('click', () => {
    chain.open = !chain.open;
  });

  expandQuery.addEventListener('click', () => {
    chain.expandedKeys = ['query'];
  });

  collapseItems.addEventListener('click', () => {
    chain.expandedKeys = [];
  });

  toggleSingle.addEventListener('click', () => {
    singleExpanded = !singleExpanded;
    singleItem.expanded = singleExpanded;
  });

  singleItem.addEventListener('ve-thought-chain-item-toggle', (event) => {
    singleExpanded = event.detail.expanded;
    singleItem.expanded = singleExpanded;
  });
</script>
```

### 线条样式

`line` 控制纵向连接线样式，支持 `solid`、`dashed`、`dotted` 和 `none`。

```html preview
<script type="module">
  import '@ve-design/web/ve-thought-chain';
</script>

<section style="display:grid; gap:28px; width:min(100%, 900px); margin:0 auto; padding:32px;">
  <ve-thought-chain title="Dashed line" line="dashed">
    <ve-thought-chain-item key="a" title="Policy matched" status="success">
      Internal-only details were removed.
    </ve-thought-chain-item>
    <ve-thought-chain-item key="b" title="Citation review" status="default">
      One public source still needs review.
    </ve-thought-chain-item>
  </ve-thought-chain>

  <ve-thought-chain title="No connector" line="none">
    <ve-thought-chain-item key="c" title="Generate board update" status="loading">
      Summarize weekly delivery metrics for leadership.
    </ve-thought-chain-item>
    <ve-thought-chain-item key="d" title="Prepare publish summary" status="success">
      The update is ready for stakeholder review.
    </ve-thought-chain-item>
  </ve-thought-chain>
</section>
```

## API

### `ve-thought-chain` 属性

| 属性名                | 描述                                                                | 类型                                        | 默认值      |
| --------------------- | ------------------------------------------------------------------- | ------------------------------------------- | ----------- |
| `title`               | 根链标题；若提供 `title` 插槽，插槽优先                             | `string`                                    | `''`        |
| `line`                | 连接线样式                                                          | `'solid' \| 'dashed' \| 'dotted' \| 'none'` | `'solid'`   |
| `loading`             | 根标题是否展示亮条扫过加载效果                                      | `boolean`                                   | `false`     |
| `collapsible`         | 根链是否可折叠；HTML 中可用 `collapsible="false"` 关闭              | `boolean`                                   | `true`      |
| `open`                | 受控根链展开状态；设置后根链展开由外部控制                          | `boolean \| undefined`                      | `undefined` |
| `default-open`        | 非受控根链初始展开状态；HTML 中可用 `default-open="false"` 初始收起 | `boolean`                                   | `true`      |
| `expandedKeys`        | 受控节点展开集合，JS property only；集合内值对应直系节点的唯一 `key` | `string[] \| undefined`                     | `undefined` |
| `defaultExpandedKeys` | 非受控节点初始展开集合，JS property only；集合内值对应直系节点的唯一 `key` | `string[]`                                  | `[]`        |

### `ve-thought-chain-item` 属性

| 属性名             | 描述                                                                     | 类型                                                        | 默认值      |
| ------------------ | ------------------------------------------------------------------------ | ----------------------------------------------------------- | ----------- |
| `key`              | 节点唯一标识；节点参与折叠控制时必须提供                                 | `string`                                                    | `''`        |
| `title`            | 节点标题；若提供 `title` 插槽，插槽优先                                  | `string`                                                    | `''`        |
| `status`           | 节点状态                                                                 | `'default' \| 'loading' \| 'success' \| 'error' \| 'abort'` | `'default'` |
| `collapsible`      | 节点内容是否可折叠；HTML 中可用 `collapsible="false"` 关闭               | `boolean`                                                   | `true`      |
| `expanded`         | 受控节点展开状态，JS property only；设置后优先于父级 `expandedKeys`      | `boolean \| undefined`                                      | `undefined` |
| `default-expanded` | 非受控节点初始展开状态；HTML 中可用 `default-expanded="false"` 初始收起  | `boolean`                                                   | `true`      |
| `disabled`         | 禁用节点交互；禁用后不能展开或收起                                       | `boolean`                                                   | `false`     |
| `max-height`       | 节点详情区域最大高度；内容超出后的表现由 `overflow` 控制                | `string`                                                    | `''`        |
| `overflow`         | 内容超出 `max-height` 时的表现；`scroll` 为内容区域滚动和虚化，`collapsible` 为查看更多/收起 | `'scroll' \| 'collapsible'`                                  | `'scroll'`  |

### 事件

| 事件名                         | 触发条件                                         | Detail                                                           |
| ------------------------------ | ------------------------------------------------ | ---------------------------------------------------------------- |
| `ve-thought-chain-open-change` | 用户点击根链折叠触发器请求改变根链展开状态时触发 | `{ open: boolean }`                                              |
| `ve-thought-chain-expand`      | 用户展开或收起可折叠节点时触发                   | `{ expandedKeys: string[]; itemKey: string; expanded: boolean }` |

### `ve-thought-chain` 插槽

| 插槽名    | 描述                                           |
| --------- | ---------------------------------------------- |
| `default` | 链路节点内容，通常放置 `ve-thought-chain-item` |
| `icon`    | 根链自定义图标                                 |
| `title`   | 根链自定义标题                                 |

### `ve-thought-chain-item` 插槽

| 插槽名    | 描述                                                                 |
| --------- | -------------------------------------------------------------------- |
| `default` | 节点详情内容，可放置文本、列表、图片、代码块、工具调用卡片等业务内容 |
| `icon`    | 节点自定义图标；未提供时使用状态图标                                 |
| `title`   | 节点自定义标题                                                       |
