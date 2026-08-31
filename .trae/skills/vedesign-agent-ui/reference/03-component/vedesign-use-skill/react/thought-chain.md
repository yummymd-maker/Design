`ThoughtChain` 用于展示 Agent 可公开的执行过程摘要，`ThoughtChainItem` 用于表示链路中的单个阶段。React 包装器通过 `children` 组合节点，并通过 `icon`、`title` 传入根链或节点的具名内容。

## 何时使用

- 需要解释 Agent 当前经历了哪些可公开阶段，以及每个阶段的执行状态。
- 需要在同一链路中展示文本、标签、链接、代码片段、文件卡片等富内容。
- 需要支持根链路折叠、节点内容折叠、节点限高滚动或受控展开状态。

## 引入组件

```tsx
import { ThoughtChain, ThoughtChainItem } from '@ve-design/react';
```

## 示例

### 基础用法

默认情况下根链和节点均可折叠且展开。使用 `title` 设置根标题或节点标题，使用 `status` 表示节点状态。

```tsx preview
import { ThoughtChain, ThoughtChainItem } from '@ve-design/react';

<section
  style={{
    maxWidth: 960,
    padding: 24,
    color: 'var(--color-text-1, #1d2129)',
  }}
>
  <ThoughtChain title="Drafting the 2025 product strategy article · 37s">
    <ThoughtChainItem
      itemKey="request"
      title="Understand the request"
      status="success"
    >
      The user needs an external-facing article about the 2025 product strategy.
      I first need to identify the key strategic directions, understand who will
      read the article, and keep the language clear enough for partners,
      customers, and industry observers.
    </ThoughtChainItem>

    <ThoughtChainItem
      itemKey="strategy"
      title="Draft the strategy narrative"
      status="default"
      maxHeight="320px"
    >
      <div style={{ display: 'grid', gap: 8, lineHeight: 1.7 }}>
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
    </ThoughtChainItem>

    <ThoughtChainItem
      itemKey="outline"
      title="Prepare the final outline"
      status="loading"
    >
      The final outline should follow a strategy-to-case-to-value structure so
      that readers can quickly understand the product direction and remember the
      key message after the presentation.
    </ThoughtChainItem>

    <ThoughtChainItem
      itemKey="review-error"
      title="Review blocked by missing evidence"
      status="error"
    >
      The strategy article cannot move forward because several product claims
      still lack public evidence. Before publishing, the team needs to replace
      unsupported statements with verified examples or remove them from the
      external-facing draft.
    </ThoughtChainItem>

    <ThoughtChainItem
      itemKey="publish-abort"
      title="Abort the publishing path"
      status="abort"
    >
      This publishing path is intentionally stopped because the audience and
      launch timing have changed. The draft should be preserved as reference,
      but the final article needs to restart from the updated communication
      plan.
    </ThoughtChainItem>
  </ThoughtChain>
</section>;
```

### 流式输出

```tsx preview
import { useEffect, useState } from 'react';
import { Alert, Button, ThoughtChain, ThoughtChainItem } from '@ve-design/react';
import { IconRefresh } from '@ve-design/react/icons';

type StreamStatus = 'default' | 'loading' | 'success';

interface StreamStep {
  itemKey: string;
  title: string;
  finalStatus: StreamStatus;
  text: string;
  alert?: {
    type: 'info' | 'success' | 'warning' | 'error';
    text: string;
  };
}

interface StreamItemState {
  itemKey: string;
  title: string;
  status: StreamStatus;
  text: string;
  alert?: StreamStep['alert'];
  showAlert: boolean;
}

const streamSteps: StreamStep[] = [
  {
    itemKey: 'request',
    title: 'Understand the request',
    finalStatus: 'success',
    text:
      'The user needs an external-facing article about the 2025 product strategy. I first need to identify the key strategic directions, understand who will read the article, and keep the language clear enough for partners, customers, and industry observers.',
  },
  {
    itemKey: 'strategy',
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
    itemKey: 'outline',
    title: 'Prepare the final outline',
    finalStatus: 'success',
    text:
      'The final outline should follow a strategy-to-case-to-value structure so that readers can quickly understand the product direction and remember the key message after the presentation.',
  },
  {
    itemKey: 'delivery',
    title: 'Finalize the publish-ready summary',
    finalStatus: 'success',
    text:
      'The publish-ready summary is now structured for review, with clear strategy framing, supporting examples, and a concise closing recommendation.',
  },
];

function ThoughtChainStreamDemo() {
  const [version, setVersion] = useState(0);
  const [items, setItems] = useState<StreamItemState[]>([]);

  useEffect(() => {
    let stepIndex = 0;
    let progress = 0;
    let phase: 'typing' | 'pause' = 'typing';
    let pauseTicks = 0;

    setItems([
      {
        itemKey: streamSteps[0].itemKey,
        title: streamSteps[0].title,
        status: 'loading',
        text: '',
        alert: streamSteps[0].alert,
        showAlert: false,
      },
    ]);

    const timer = window.setInterval(() => {
      const currentStep = streamSteps[stepIndex];

      if (phase === 'pause') {
        pauseTicks += 1;

        if (pauseTicks >= 8 && stepIndex < streamSteps.length - 1) {
          stepIndex += 1;
          progress = 0;
          pauseTicks = 0;
          phase = 'typing';

          setItems((current) => [
            ...current,
            {
              itemKey: streamSteps[stepIndex].itemKey,
              title: streamSteps[stepIndex].title,
              status: 'loading',
              text: '',
              alert: streamSteps[stepIndex].alert,
              showAlert: false,
            },
          ]);
        }

        return;
      }

      progress += 4;
      const nextText = currentStep.text.slice(0, progress);

      setItems((current) =>
        current.map((item, index) =>
          index === stepIndex ? { ...item, text: nextText } : item,
        ),
      );

      if (progress > currentStep.text.length) {
        setItems((current) =>
          current.map((item, index) =>
            index === stepIndex
              ? {
                  ...item,
                  text: currentStep.text,
                  status: currentStep.finalStatus,
                  showAlert: Boolean(currentStep.alert),
                }
              : item,
          ),
        );

        if (stepIndex === streamSteps.length - 1) {
          window.clearInterval(timer);
          return;
        }

        phase = 'pause';
      }
    }, 24);

    return () => window.clearInterval(timer);
  }, [version]);

  return (
    <section
      style={{
        display: 'grid',
        gap: 16,
        width: 'min(100%, 960px)',
        padding: 24,
        color: 'var(--color-text-1, #1d2129)',
      }}
    >
      <Button
        type="secondary"
        size="small"
        onClick={() => setVersion((value) => value + 1)}
      >
        <IconRefresh />
        <span>Replay stream</span>
      </Button>

      <ThoughtChain title="Drafting the 2025 product strategy article · 37s">
        {items.map((item) => (
          <ThoughtChainItem
            key={item.itemKey}
            itemKey={item.itemKey}
            title={item.title}
            status={item.status}
          >
            <div style={{ display: 'grid', gap: 8 }}>
              <div style={{ display: 'grid', gap: 8, lineHeight: 1.7 }}>
                {item.text.split('\n\n').map((paragraph, index) => (
                  <div key={index}>{paragraph}</div>
                ))}
              </div>
              {item.showAlert && item.alert ? (
                <Alert type={item.alert.type}>{item.alert.text}</Alert>
              ) : null}
            </div>
          </ThoughtChainItem>
        ))}
      </ThoughtChain>
    </section>
  );
}
```

### 复杂节点内容

复杂节点内容如复杂标题、图标、状态和操作可通过 React 内容组合展示。

```tsx preview
import type { CSSProperties, ReactNode } from 'react';
import {
  ArtifactCard,
  Link,
  ThoughtChain,
  ThoughtChainItem,
} from '@ve-design/react';
import {
  IconAtom,
  IconDocument,
  IconEdit,
  IconLogoBytedanceIcon,
  IconLogoDoubaoLlmIcon,
  IconLogoVolcanoEngineIcon,
  IconSearch,
  IconTool,
} from '@ve-design/react/icons';

function ThoughtChainComplexNodeDemo() {
  const demoStyle: CSSProperties = {
    display: 'grid',
    gap: 'var(--space-l)',
    width: 'min(100%, 872px)',
    margin: '0 auto',
    padding: 'var(--space-l)',
    color: 'var(--color-text-primary)',
    fontFamily: 'var(--font-sans)',
  };
  const stackStyle: CSSProperties = {
    display: 'grid',
    gap: 'var(--space-xxs)',
    color: 'var(--color-text-secondary)',
    fontSize: 'var(--text-body)',
    lineHeight: '22px',
  };
  const copyStyle: CSSProperties = {
    display: 'grid',
    gap: 'var(--space-xxs)',
  };
  const copyParagraphStyle: CSSProperties = {
    margin: 0,
    color: 'var(--color-text-secondary)',
    fontSize: 'var(--text-body)',
    lineHeight: '22px',
  };
  const linkListStyle: CSSProperties = {
    display: 'grid',
    gap: 'var(--space-xxxs)',
  };
  const linkRowStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-xxxs)',
    minWidth: 0,
    padding: '2px var(--space-xxxs)',
    borderRadius: 'var(--radius-sm)',
  };
  const linkStyleVars = {
    '--ve-link-current-text': 'var(--color-text-secondary)',
    '--ve-link-current-text-hover': 'var(--color-text-accent)',
    '--ve-link-font-size': 'var(--text-body)',
    '--ve-link-font-weight': 'var(--font-weight-normal)',
    '--ve-link-line-height': '22px',
  } as CSSProperties;
  const codePanelStyle: CSSProperties = {
    boxSizing: 'border-box',
    maxHeight: 240,
    margin: 0,
    overflow: 'hidden',
    padding: 'var(--space-s)',
    border: 'var(--stroke-weight-base) solid var(--color-border-default)',
    borderRadius: 'var(--radius-lg)',
    background: 'var(--color-bg-overlay)',
    color: 'var(--color-text-secondary)',
    font: 'var(--font-weight-normal) var(--text-caption) / 20px var(--font-mono)',
    whiteSpace: 'pre-wrap',
  };
  const codeKeywordStyle: CSSProperties = { color: 'var(--color-text-accent)' };
  const codeFunctionStyle: CSSProperties = { color: 'var(--color-text-danger)' };
  const codeStringStyle: CSSProperties = { color: 'var(--color-text-success)' };
  const resultStackStyle: CSSProperties = {
    display: 'grid',
    gap: 'var(--space-xxs)',
  };
  const thumbRowStyle: CSSProperties = {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 'var(--space-xxs)',
  };
  const thumbStyle: CSSProperties = {
    width: 60,
    height: 60,
    borderRadius: 'var(--radius-md)',
    background: 'var(--color-bg-surface)',
  };

  return (
    <section style={demoStyle}>
      <ThoughtChain collapsible={false}>
        <ThoughtChainItem
          itemKey="thought"
          title="单条想法 Thought"
          icon={<IconAtom />}
          maxHeight="108px"
          overflow="collapsible"
        >
          <div style={stackStyle}>
            <div style={copyStyle}>
              <p style={copyParagraphStyle}>用户让我基于云服务平台 2025 产品战略起草一篇对外分享的文章，首先需要明确核心战略方向，并把大模型、智能应用、数据智能、视频云和基础云组织成清晰结构。</p>
              <p style={copyParagraphStyle}>对外分享需要兼顾专业性和传播性，既要避免过于技术化，也要能给合作伙伴、客户和行业同行留下稳定可信的产品印象。</p>
              <p style={copyParagraphStyle}>我的方案是使用“战略、案例、价值”三层结构降低听众认知负担，并把可公开的信息组织成适合演讲和文章复用的表达。</p>
              <p style={copyParagraphStyle}>文章开头需要先说明 2025 战略的核心背景，再逐步展开大模型、智能应用、数据智能、视频云和基础云之间的关系。</p>
              <p style={copyParagraphStyle}>每个方向都应该配一个能够被公开引用的客户场景，避免只堆砌抽象能力或未说明的术语。</p>
              <p style={copyParagraphStyle}>收尾部分需要回到业务价值，强调平台能力如何帮助客户降低 AI 落地门槛、提升生产效率并保持长期稳定性。</p>
            </div>
          </div>
        </ThoughtChainItem>

        <ThoughtChainItem itemKey="knowledge" title="知识库" icon={<IconDocument />}>
          <div style={stackStyle}>
            <span>云服务平台 product conference 2026</span>
            <div style={linkListStyle}>
              <span style={linkRowStyle}>
                <IconLogoVolcanoEngineIcon style={{ width: 14, height: 14 }} />
                <Link href="#" style={linkStyleVars}>云服务平台 - 官方产品介绍</Link>
              </span>
              <span style={linkRowStyle}>
                <IconLogoBytedanceIcon style={{ width: 14, height: 14 }} />
                <Link href="#" style={linkStyleVars}>Enterprise service market overview</Link>
              </span>
              <span style={linkRowStyle}>
                <IconLogoDoubaoLlmIcon style={{ width: 14, height: 14 }} />
                <Link href="#" style={linkStyleVars}>AI infrastructure analysis</Link>
              </span>
            </div>
          </div>
        </ThoughtChainItem>

        <ThoughtChainItem itemKey="search" title="联网搜索 Web Search" icon={<IconSearch />}>
          <div style={stackStyle}>
            <span>云服务平台 product conference 2026</span>
          </div>
        </ThoughtChainItem>

        <ThoughtChainItem itemKey="tool" title="工具调用 Call Tool" icon={<IconTool />}>
          <pre style={codePanelStyle}>
            <code>
              <span style={codeKeywordStyle}>SELECT</span>
              {'\n    `活动名称`,\n    '}
              <span style={codeFunctionStyle}>SUM</span>
              {'(`销售额`) '}
              <span style={codeKeywordStyle}>AS</span>
              {' 销售额,\n    '}
              <span style={codeFunctionStyle}>COUNT</span>
              {'(DISTINCT `订单量`) '}
              <span style={codeKeywordStyle}>AS</span>
              {' 订单量,\n    '}
              <span style={codeFunctionStyle}>AVG</span>
              {'(`客单价`) '}
              <span style={codeKeywordStyle}>AS</span>
              {' 客单价'}
              {'\n'}
              <span style={codeKeywordStyle}>FROM</span>
              {'\n    `大消费活动分析`\n'}
              <span style={codeKeywordStyle}>WHERE</span>
              {'\n    `下单时间` BETWEEN '}
              <span style={codeStringStyle}>'2025-01-01'</span>
              {' AND '}
              <span style={codeStringStyle}>'2025-03-31'</span>
            </code>
          </pre>
        </ThoughtChainItem>

        <ThoughtChainItem itemKey="result" title="结果 Result" icon={<IconEdit />}>
          <div style={resultStackStyle}>
            <span>信息整理完成：[这是一段摘要总结]</span>
            <ArtifactCard type="markdown" title="doc_generation.md" byte={18432} />
            <span>已根据图像文字描述生成 8 张图片</span>
            <div style={thumbRowStyle}>
              {Array.from({ length: 8 }).map((_, index) => (
                <span key={index} style={thumbStyle} />
              ))}
            </div>
            <span>PPT 绘制完成：共 10 页</span>
          </div>
        </ThoughtChainItem>

        <ThoughtChainItem itemKey="done" title="完成" status="success" collapsible={false} />
      </ThoughtChain>
    </section>
  );
}
```

### 折叠与限高

`collapsible` 控制是否可折叠，`defaultOpen` 和 `defaultExpanded` 控制初始展开状态。内容较长时可通过 `maxHeight` 限制节点详情高度，并用 `overflow` 控制超出后的内容区域滚动或查看更多。

```tsx preview
import { Alert, Tag, ThoughtChain, ThoughtChainItem } from '@ve-design/react';

<section
  style={{
    display: 'grid',
    gap: 24,
    width: 'min(100%, 860px)',
    margin: '0 auto',
    padding: 32,
  }}
>
  <ThoughtChain title="Initially collapsed root" defaultOpen={false}>
    <ThoughtChainItem itemKey="summary" title="Quarterly account health" status="default">
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
        <Tag color="orange">12 at-risk accounts</Tag>
        <Tag color="green">8 expansion candidates</Tag>
        <span>Accounts are grouped by risk and expansion potential.</span>
      </div>
    </ThoughtChainItem>
  </ThoughtChain>

  <ThoughtChain title="Item controls">
    <ThoughtChainItem itemKey="long" title="Collapsible strategy analysis" status="loading" maxHeight="160px" overflow="collapsible">
      <div style={{ display: 'grid', gap: 8, lineHeight: 1.7 }}>
        <div>The first pass identifies public product claims, separates verified sources from assumptions, and groups details by audience.</div>
        <div>The second pass maps each section to a concrete customer outcome: faster model adoption, stronger data foundations, reliable media delivery, and lower operational overhead.</div>
        <div>The final pass removes unsupported claims and keeps the answer short enough for product, marketing, and solution teams to review.</div>
        <div>For model services, the summary should explain how evaluation, fine-tuning, inference, and governance work together as one managed platform rather than isolated capabilities.</div>
        <div>For data intelligence, the narrative should connect data quality, real-time processing, observability, and permission control to the reliability of downstream AI applications.</div>
        <div>For media and infrastructure, the answer should keep the relationship clear: compute and network stability support media workloads, while media scenarios produce new product requirements.</div>
        <div>The visible max-height keeps this item compact in the page while the internal scroll area still preserves the full analysis for review.</div>
      </div>
    </ThoughtChainItem>

    <ThoughtChainItem itemKey="scroll-long" title="Scrollable strategy analysis" status="default" maxHeight="160px" overflow="scroll">
      <div style={{ display: 'grid', gap: 8, lineHeight: 1.7 }}>
        <div>The scroll mode keeps the node height fixed and lets reviewers inspect the remaining content inside the item body.</div>
        <div>It is useful when long-running analysis should stay compact while the full text remains available without expanding the timeline layout.</div>
        <div>The top and bottom fades indicate whether more content is available in either scroll direction.</div>
        <div>This provides a direct visual comparison with the collapsible overflow mode above.</div>
      </div>
    </ThoughtChainItem>

    <ThoughtChainItem itemKey="closed" title="Initially collapsed item" defaultExpanded={false}>
      This content starts collapsed but can still be opened by the user.
    </ThoughtChainItem>

    <ThoughtChainItem itemKey="fixed" title="Non-collapsible item" status="success" collapsible={false}>
      Use `collapsible={false}` when the content should always stay visible.
    </ThoughtChainItem>

    <ThoughtChainItem itemKey="disabled" title="Disabled item" status="default" disabled>
      <Alert type="warning">
        Disabled items keep their content visible but do not respond to toggle interaction.
      </Alert>
    </ThoughtChainItem>
  </ThoughtChain>
</section>;
```

### 嵌套链路

`ThoughtChainItem` 的 `children` 可以继续放置 `ThoughtChain`，用于表达某个节点下的子任务、工具调用步骤或校验明细。

```tsx preview
import {
  Alert,
  ThoughtChain,
  ThoughtChainItem,
} from '@ve-design/react';

<section style={{ width: 'min(100%, 920px)', margin: '0 auto', padding: 32 }}>
  <ThoughtChain title="Data Quality Assistant" loading>
    <ThoughtChainItem itemKey="audit" title="Audit revenue dashboard" status="success">
      <ThoughtChain title="Validation steps" line="dashed">
        <ThoughtChainItem itemKey="freshness" title="Check source freshness" status="success">
          <Alert type="success">All upstream datasets completed within the freshness window. Latest partition was produced 8 minutes ago.</Alert>
        </ThoughtChainItem>

        <ThoughtChainItem itemKey="reconcile" title="Reconcile ARR metric" status="success">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <Alert type="info">Difference is below the configured 0.1% tolerance.</Alert>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <span>0.03% delta · tolerance 0.1%</span>
            </div>
          </div>
        </ThoughtChainItem>

        <ThoughtChainItem itemKey="anomaly" title="Inspect APAC anomaly" status="default">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <Alert type="warning">The anomaly is explainable but still needs a short analyst note.</Alert>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
              <span>Analyst note required before sharing.</span>
            </div>
          </div>
        </ThoughtChainItem>
      </ThoughtChain>
    </ThoughtChainItem>

    <ThoughtChainItem itemKey="publish" title="Prepare publish summary" status="loading">
      <ThoughtChain line="none">
        <ThoughtChainItem itemKey="note" title="Draft release note" status="success">
          <span>Summary ready for review.</span>
        </ThoughtChainItem>
        <ThoughtChainItem itemKey="owner" title="Assign follow-up owner" status="loading">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <Alert type="info">Owner is pending confirmation. Assign a regional reviewer before publishing the dashboard.</Alert>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
              <span>Owner: Revenue Analytics · Due: tomorrow 10:00</span>
              <span>Awaiting owner confirmation</span>
            </div>
          </div>
        </ThoughtChainItem>
      </ThoughtChain>
    </ThoughtChainItem>
  </ThoughtChain>
</section>;
```

### 自定义图标和标题

根链和节点都支持 `icon`、`title` props。传入 ReactNode 时可组合图标、标签和其他内联内容。

```tsx preview
import type { CSSProperties, ReactNode } from 'react';
import {
  ArtifactCard,
  Link,
  ThoughtChain,
  ThoughtChainItem,
} from '@ve-design/react';
import {
  IconAtom,
  IconDocument,
  IconLink,
  IconSearch,
  IconTool,
} from '@ve-design/react/icons';

function ThoughtChainCustomTitleDemo() {
  const demoStyle: CSSProperties = {
    display: 'grid',
    gap: 'var(--space-s)',
    width: 'min(100%, 860px)',
    margin: '0 auto',
    padding: 'var(--space-l)',
  };
  const titleRowStyle: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 'var(--space-xxs)',
    minHeight: 'var(--ve-thought-chain-text-line-height, 24px)',
    lineHeight: 'var(--ve-thought-chain-text-line-height, 24px)',
    verticalAlign: 'middle',
  };
  const contentStyle: CSSProperties = {
    display: 'grid',
    gap: 'var(--space-xs)',
  };
  const linksStyle: CSSProperties = {
    display: 'grid',
    gap: 'var(--space-xxxs)',
  };
  const linkStyle: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 'var(--space-xxxs)',
    minWidth: 0,
  };
  const mutedIconStyle: CSSProperties = {
    color: 'var(--color-text-tertiary)',
  };
  const linkStyleVars = {
    '--ve-link-current-text': 'var(--color-text-secondary)',
    '--ve-link-current-text-hover': 'var(--color-text-accent)',
    '--ve-link-font-size': 'var(--text-body)',
    '--ve-link-font-weight': 'var(--font-weight-normal)',
    '--ve-link-line-height': '22px',
  } as CSSProperties;
  const codeStyle: CSSProperties = {
    boxSizing: 'border-box',
    margin: 0,
    padding: 'var(--space-xs) var(--space-s)',
    overflow: 'auto',
    border: 'var(--stroke-weight-base) solid var(--color-border-default)',
    borderRadius: 'var(--radius-md)',
    background: 'var(--color-bg-muted)',
    color: 'var(--color-text-secondary)',
    font: 'var(--font-weight-normal) var(--text-caption) / 20px var(--font-mono)',
    whiteSpace: 'pre-wrap',
  };

  const titleRow = (children: ReactNode) => <span style={titleRowStyle}>{children}</span>;

  return (
    <section style={demoStyle}>
      <ThoughtChain
        icon={<IconAtom />}
        title={titleRow('Research Assistant Runbook · live · 3 sources')}
      >
        <ThoughtChainItem
          itemKey="search"
          status="loading"
          icon={<IconSearch />}
          title={titleRow('Collect public references · web')}
        >
          <div style={contentStyle}>
            <span>Search product pages, launch notes, and public media references.</span>
            <span>Keywords: product strategy · AI cloud · customer cases</span>
          </div>
        </ThoughtChainItem>

        <ThoughtChainItem
          itemKey="references"
          status="success"
          icon={<IconDocument />}
          title={titleRow('Review reference material · verified')}
        >
          <div style={contentStyle}>
            <div style={linksStyle}>
              <span style={linkStyle}>
                <IconLink style={{ ...mutedIconStyle, width: 14, height: 14 }} />
                <Link href="#" style={linkStyleVars}>Product architecture overview</Link>
              </span>
              <span style={linkStyle}>
                <IconLink style={{ ...mutedIconStyle, width: 14, height: 14 }} />
                <Link href="#" style={linkStyleVars}>Customer case summary</Link>
              </span>
            </div>
            <ArtifactCard type="markdown" title="research-brief.md" byte={24576} />
          </div>
        </ThoughtChainItem>

        <ThoughtChainItem
          itemKey="tool"
          status="default"
          icon={<IconTool />}
          title={titleRow('Prepare reusable prompt · tool')}
        >
          <pre style={codeStyle}>
            <code>{`audience = "executive and partner readers"
tone = "clear, public-facing, technically credible"
sections = ["strategy", "capability", "customer value", "next step"]`}</code>
          </pre>
        </ThoughtChainItem>
      </ThoughtChain>
    </section>
  );
}
```

### 受控展开状态

`open` 控制根链展开状态，`expandedKeys` 控制节点展开集合。受控模式下，用户交互只触发事件，使用方需要在事件中更新状态。

每个参与折叠控制的直系 `ThoughtChainItem` 都需要提供稳定且唯一的 `itemKey`。重复 `itemKey` 会共享同一份展开状态；缺失 `itemKey` 时节点只能维护自身展开状态，父级 `expandedKeys` 无法准确管理它。若某个节点通过 `expanded` 单独受控，节点自身的 `expanded` 优先于父级 `expandedKeys`。

```tsx preview
import { useState } from 'react';
import { Button, ThoughtChain, ThoughtChainItem } from '@ve-design/react';

function ThoughtChainControlledDemo() {
  const [open, setOpen] = useState(true);
  const [expandedKeys, setExpandedKeys] = useState<string[]>(['plan']);
  const [singleExpanded, setSingleExpanded] = useState(false);

  return (
    <section
      style={{
        display: 'grid',
        gap: 16,
        width: 'min(100%, 860px)',
        margin: '0 auto',
        padding: 32,
      }}
    >
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
        <Button type="secondary" size="small" onClick={() => setOpen((current) => !current)}>
          Toggle root
        </Button>
        <Button type="primary" size="small" onClick={() => setExpandedKeys(['query'])}>
          Expand query
        </Button>
        <Button type="secondary" size="small" onClick={() => setExpandedKeys([])}>
          Collapse items
        </Button>
        <Button type="secondary" size="small" onClick={() => setSingleExpanded((current) => !current)}>
          Toggle single item
        </Button>
      </div>

      <ThoughtChain
        title="Controlled chain"
        open={open}
        expandedKeys={expandedKeys}
        onOpenChange={(event) => setOpen(event.detail.open)}
        onExpand={(event) => setExpandedKeys(event.detail.expandedKeys)}
      >
        <ThoughtChainItem itemKey="plan" title="Plan rollout" status="success">
          Define canary cohorts and rollback threshold.
        </ThoughtChainItem>

        <ThoughtChainItem itemKey="query" title="Run health query" status="loading">
          Gradually validate the recommendation API across two regions.
        </ThoughtChainItem>

        <ThoughtChainItem
          itemKey="single"
          title="Individually controlled item"
          expanded={singleExpanded}
          onToggle={(event) => setSingleExpanded(event.detail.expanded)}
        >
          This item is controlled by its own expanded state instead of the parent expandedKeys.
        </ThoughtChainItem>
      </ThoughtChain>
    </section>
  );
}
```

### 线条样式

使用 `line` 控制纵向连接线样式，支持 `solid`、`dashed`、`dotted` 和 `none`。

```tsx preview
import { ThoughtChain, ThoughtChainItem } from '@ve-design/react';

<section
  style={{
    display: 'grid',
    gap: 28,
    width: 'min(100%, 900px)',
    margin: '0 auto',
    padding: 32,
  }}
>
  <ThoughtChain title="Dashed line" line="dashed">
    <ThoughtChainItem itemKey="a" title="Policy matched" status="success">
      Internal-only details were removed.
    </ThoughtChainItem>
    <ThoughtChainItem itemKey="b" title="Citation review" status="default">
      One public source still needs review.
    </ThoughtChainItem>
  </ThoughtChain>

  <ThoughtChain title="No connector" line="none">
    <ThoughtChainItem itemKey="c" title="Generate board update" status="loading">
      Summarize weekly delivery metrics for leadership.
    </ThoughtChainItem>
    <ThoughtChainItem itemKey="d" title="Prepare publish summary" status="success">
      The update is ready for stakeholder review.
    </ThoughtChainItem>
  </ThoughtChain>
</section>;
```

## API

### ThoughtChain Props

| 属性名                | 描述                                      | 类型                                        | 默认值      |
| --------------------- | ----------------------------------------- | ------------------------------------------- | ----------- |
| `title`               | 根链标题；支持字符串或自定义 React 内容   | `React.ReactNode`                           | `''`        |
| `icon`                | 根链自定义图标                            | `React.ReactNode`                           | `-`         |
| `line`                | 连接线样式                                | `'solid' \| 'dashed' \| 'dotted' \| 'none'` | `'solid'`   |
| `loading`             | 根标题是否展示亮条扫过加载效果            | `boolean`                                   | `false`     |
| `collapsible`         | 根链是否可折叠                            | `boolean`                                   | `true`      |
| `open`                | 受控根链展开状态                          | `boolean \| undefined`                      | `undefined` |
| `defaultOpen`         | 非受控根链初始展开状态                    | `boolean`                                   | `true`      |
| `expandedKeys`        | 受控节点展开集合；集合内值对应直系节点的唯一 `itemKey` | `string[] \| undefined`                     | `undefined` |
| `defaultExpandedKeys` | 非受控节点初始展开集合；集合内值对应直系节点的唯一 `itemKey` | `string[]`                                  | `[]`        |
| `children`            | 链路节点内容，通常放置 `ThoughtChainItem` | `React.ReactNode`                           | `-`         |

### ThoughtChain 事件

| 事件名         | 描述                                         | 参数类型                                                                      |
| -------------- | -------------------------------------------- | ----------------------------------------------------------------------------- |
| `onOpenChange` | 用户请求改变根链展开状态时触发               | `CustomEvent<{ open: boolean }>`                                              |
| `onExpand`     | 用户展开或收起可折叠节点，展开集合变化时触发 | `CustomEvent<{ expandedKeys: string[]; itemKey: string; expanded: boolean }>` |

### ThoughtChainItem Props

| 属性名            | 描述                                             | 类型                                                        | 默认值      |
| ----------------- | ------------------------------------------------ | ----------------------------------------------------------- | ----------- |
| `itemKey`         | 节点唯一标识；节点参与折叠控制时必须提供         | `string`                                                    | `''`        |
| `title`           | 节点标题；支持字符串或自定义 React 内容          | `React.ReactNode`                                           | `''`        |
| `icon`            | 节点自定义图标；未提供时按 `status` 展示默认图标 | `React.ReactNode`                                           | `-`         |
| `status`          | 节点状态                                         | `'default' \| 'loading' \| 'success' \| 'error' \| 'abort'` | `'default'` |
| `collapsible`     | 节点内容是否可折叠                               | `boolean`                                                   | `true`      |
| `expanded`        | 受控节点展开状态；设置后优先于父级 `expandedKeys` | `boolean \| undefined`                                      | `undefined` |
| `defaultExpanded` | 非受控节点初始展开状态                           | `boolean`                                                   | `true`      |
| `disabled`        | 是否禁用节点交互                                 | `boolean`                                                   | `false`     |
| `maxHeight`       | 节点详情区域最大高度；内容超出后的表现由 `overflow` 控制 | `string`                                                    | `''`        |
| `overflow`        | 内容超出 `maxHeight` 时的表现；`scroll` 为内容区域滚动和虚化，`collapsible` 为查看更多/收起 | `'scroll' \| 'collapsible'`                                  | `'scroll'`  |
| `children`        | 节点详情内容                                     | `React.ReactNode`                                           | `-`         |

### ThoughtChainItem 事件

| 事件名     | 描述                         | 参数类型                                              |
| ---------- | ---------------------------- | ----------------------------------------------------- |
| `onToggle` | 节点自身请求展开或收起时触发 | `CustomEvent<{ itemKey: string; expanded: boolean }>` |
