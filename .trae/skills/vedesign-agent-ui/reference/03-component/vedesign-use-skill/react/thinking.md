`Thinking` 用于在 AI 对话、Agent 执行和 AI Build 流程中展示一段可公开的思考摘要、规划说明或阶段性执行解释。

## 何时使用

- 在 AI 回复前展示可公开的推理摘要或执行说明。
- 在 Agent 规划、检索摘要、工具选择说明、生成进度说明中承载过程文本。
- 需要展示生成中、完成、展开收起、限高滚动或自动追尾等状态。

> `Thinking` 只适合展示可公开的过程摘要，不应用于暴露未审查的调试信息、系统提示内容或不应公开的过程细节。

## 引入组件

```tsx
import { Thinking } from '@ve-design/react';
```

## 示例

### 基础用法

使用 `title` 设置标题，使用 `loading` 表示生成中状态。

```tsx preview
import { Thinking } from '@ve-design/react';

<section
  style={{
    display: 'grid',
    gap: 20,
    width: 'min(100%, 760px)',
    margin: '0 auto',
    padding: 24,
  }}
>
  <Thinking title="Thinking" loading expanded>
    <div>
      I am reviewing the request, separating public product value from
      implementation detail, and preparing a concise answer structure.
    </div>
  </Thinking>

  <Thinking title="Thought for 37s" expanded={false}>
    <div>
      The response can be organized around user intent, required constraints,
      and a final recommendation that stays clear enough for handoff.
    </div>
  </Thinking>
</section>;
```

### 流式内容

默认内容由业务侧写入。流式生成时可以持续追加文本，并在完成后更新标题与状态。下面通过同一段流式内容回放两个面板，对比完成后自动折叠和保持展开两种收尾方式。

```tsx preview
import { useEffect, useState } from 'react';
import { Button, Thinking } from '@ve-design/react';
import { IconRefresh } from '@ve-design/react/icons';

function ThinkingStreamDemo() {
  const streamText = [
    'I have confirmed that the user needs a migration update for platform administrators. The summary should start with rollout status, switched workspaces, and regions that still need manual verification.',
    '\n\nThe second section should explain operational impact in plain language: approval latency dropped, failed sync jobs decreased, and support tickets now come from a small set of legacy projects.',
    '\n\nThe final paragraph should mention the change window, audit-log checklist, rollback owner, and communication plan for tenant admins.',
  ].join('');
  const [version, setVersion] = useState(0);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('Thinking');

  useEffect(() => {
    let progress = 0;
    setContent('');
    setLoading(true);
    setTitle('Thinking');

    const timer = window.setInterval(() => {
      progress += 3;
      const next = streamText.slice(0, progress);
      setContent(next);

      if (progress > streamText.length) {
        window.clearInterval(timer);
        setContent(streamText);
        setLoading(false);
        setTitle('Thought for 8s');
      }
    }, 28);

    return () => window.clearInterval(timer);
  }, [streamText, version]);

  return (
    <section
      style={{
        display: 'grid',
        gap: 12,
        width: 'min(100%, 760px)',
        margin: '0 auto',
        padding: 24,
      }}
    >
      <Button
        type="secondary"
        size="small"
        onClick={() => setVersion((v) => v + 1)}
      >
        <IconRefresh />
        <span>Replay stream</span>
      </Button>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, minmax(280px, 1fr))',
          gap: 20,
          alignItems: 'start',
        }}
      >
        <div style={{ display: 'grid', gap: 8 }}>
          <strong style={{ fontSize: 14 }}>Collapse after complete</strong>
          <Thinking
            title={title}
            loading={loading}
            expanded={loading}
            maxHeight="260px"
          >
            <span style={{ whiteSpace: 'pre-wrap', lineHeight: '22px' }}>
              {content}
            </span>
          </Thinking>
        </div>

        <div style={{ display: 'grid', gap: 8 }}>
          <strong style={{ fontSize: 14 }}>Keep expanded</strong>
          <Thinking
            title={title}
            loading={loading}
            expanded
            maxHeight="260px"
          >
            <span style={{ whiteSpace: 'pre-wrap', lineHeight: '22px' }}>
              {content}
            </span>
          </Thinking>
        </div>
      </div>
    </section>
  );
}
```

### 限高滚动

使用 `maxHeight` 限制正文高度。内容超过高度后会在组件内容区滚动。

```tsx preview
import { Thinking } from '@ve-design/react';

<section
  style={{
    display: 'grid',
    width: 'min(100%, 760px)',
    margin: '0 auto',
    padding: 24,
  }}
>
  <Thinking title="Thinking" loading expanded maxHeight="180px">
    <div style={{ display: 'grid', gap: 12, lineHeight: 1.7 }}>
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
  </Thinking>
</section>;
```

### 自动追尾

`autoScroll` 默认开启。设置 `autoScroll={false}` 后，流式内容变化时不会主动滚动到底部。下面通过同一段流式内容回放两个面板，对比自动追尾和手动滚动行为。

```tsx preview
import { useEffect, useRef, useState } from 'react';
import { Button, Thinking } from '@ve-design/react';
import { IconRefresh } from '@ve-design/react/icons';

function ThinkingAutoScrollDemo() {
  const streamText = [
    'Step 1: confirm the user-facing goal and remove non-public details.',
    '\n\nStep 2: map the current rollout status to tenant groups, regions, and owner teams.',
    '\n\nStep 3: describe operational impact with concrete but safe language.',
    '\n\nStep 4: keep rollback, audit-log validation, and communication owners visible.',
    '\n\nStep 5: finish with a short customer-ready summary and the next checkpoint.',
    '\n\nStep 6: review the final response for unsupported assumptions before sending.',
  ].join('');

  const [version, setVersion] = useState(0);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const autoRef = useRef<HTMLDivElement | null>(null);
  const manualRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let progress = 0;
    setContent('');
    setLoading(true);

    const timer = window.setInterval(() => {
      progress += 3;
      const next = streamText.slice(0, progress);
      setContent(next);

      if (progress > streamText.length) {
        window.clearInterval(timer);
        setContent(streamText);
        setLoading(false);
      }
    }, 28);

    return () => window.clearInterval(timer);
  }, [streamText, version]);

  useEffect(() => {
    if (!manualRef.current) return;
    manualRef.current.scrollTop = 0;
  }, [version]);

  return (
    <section
      style={{
        display: 'grid',
        gap: 16,
        width: 'min(100%, 920px)',
        margin: '0 auto',
        padding: 24,
      }}
    >
      <Button
        type="secondary"
        size="small"
        onClick={() => setVersion((value) => value + 1)}
      >
        <IconRefresh />
        <span>Replay comparison</span>
      </Button>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, minmax(280px, 1fr))',
          gap: 20,
          alignItems: 'start',
        }}
      >
        <div style={{ display: 'grid', gap: 8 }}>
          <strong style={{ fontSize: 14 }}>Auto scroll</strong>
          <div ref={autoRef}>
            <Thinking title={loading ? 'Thinking' : 'Auto scroll completed'} loading={loading} expanded maxHeight="180px">
              <span style={{ whiteSpace: 'pre-wrap', lineHeight: '22px' }}>
                {content}
              </span>
            </Thinking>
          </div>
        </div>

        <div style={{ display: 'grid', gap: 8 }}>
          <strong style={{ fontSize: 14 }}>Manual scroll</strong>
          <div ref={manualRef}>
            <Thinking
              title={loading ? 'Thinking' : 'Manual scroll completed'}
              loading={loading}
              expanded
              maxHeight="180px"
              autoScroll={false}
            >
              <span style={{ whiteSpace: 'pre-wrap', lineHeight: '22px' }}>
                {content}
              </span>
            </Thinking>
          </div>
        </div>
      </div>
    </section>
  );
}
```

### 展开收起事件

用户点击标题区或在标题区聚焦时按下 Enter / Space 会切换 `expanded`，并触发 `onToggle`。

```tsx preview
import { useState } from 'react';
import { Thinking } from '@ve-design/react';

function ThinkingToggleDemo() {
  const [message, setMessage] = useState(
    'Click the header to collapse or expand the content.',
  );

  return (
    <section
      style={{
        display: 'grid',
        gap: 12,
        width: 'min(100%, 760px)',
        margin: '0 auto',
        padding: 24,
      }}
    >
      <Thinking
        title="Reasoning summary"
        onToggle={(event) => {
          setMessage(`expanded: ${event.detail.expanded}`);
        }}
      >
        <div>
          I checked the requested output, confirmed the constraints, and prepared a
          concise implementation path.
        </div>
      </Thinking>

      <span style={{ color: 'var(--color-text-secondary)', fontSize: 13 }}>
        {message}
      </span>
    </section>
  );
}
```

### 标题扩展与自定义图标

使用 `headerExtra` 放置标题尾部信息，使用 `icon` 替换默认状态图标。

```tsx preview
import { Button, Thinking } from '@ve-design/react';
import {
  IconAtom,
  IconCopy,
  IconDocument,
  IconSearch,
} from '@ve-design/react/icons';

<section
  style={{
    display: 'grid',
    gap: 16,
    width: 'min(100%, 760px)',
    margin: '0 auto',
    padding: 24,
  }}
>
  <Thinking
    title="Reasoning completed"
    expanded
    icon={<IconSearch />}
    headerExtra={
      <span style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>
        8.2s | 1,284 tokens
      </span>
    }
  >
    <div>
      The trailing area can show duration, token usage, confidence labels, or a
      compact action without overloading the title.
    </div>
  </Thinking>

  <Thinking
    title="Planning answer..."
    loading
    expanded
    icon={<IconDocument />}
    headerExtra={
      <Button type="text" size="small" style={{ fontSize: 12 }}>
        <IconCopy style={{ width: 14, height: 14 }} />
      </Button>
    }
  >
    <div>
      Actions in the trailing area keep their own click handlers and do not
      toggle the panel.
    </div>
  </Thinking>

  <Thinking
    title="Knowledge retrieval"
    expanded
    icon={<IconAtom />}
    headerExtra={
      <span style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>
        Search + docs
      </span>
    }
  >
    <div>
      Search, document, and atom icons can represent retrieval, evidence, or
      analysis stages more directly than a generic status mark.
    </div>
  </Thinking>
</section>;
```

## API

### Props

| 属性名        | 描述                                       | 类型              | 默认值  |
| ------------- | ------------------------------------------ | ----------------- | ------- |
| `title`       | 标题区展示的文案                           | `string`          | `''`    |
| `loading`     | 是否处于生成中状态                         | `boolean`         | `false` |
| `expanded`    | 正文是否展开                               | `boolean`         | `true`  |
| `maxHeight`   | 正文最大高度，内容超出后内容区域滚动           | `string`          | `''`    |
| `autoScroll`  | 流式内容变化时是否在用户接近底部时自动追尾 | `boolean`         | `true`  |
| `icon`        | 自定义标题区左侧图标                       | `React.ReactNode` | `-`     |
| `headerExtra` | 标题行尾部扩展内容                         | `React.ReactNode` | `-`     |
| `children`    | 思考正文内容                               | `React.ReactNode` | `-`     |

### 事件

| 事件名     | 描述               | 参数类型                             |
| ---------- | ------------------ | ------------------------------------ |
| `onToggle` | 展开状态变化后触发 | `CustomEvent<{ expanded: boolean }>` |

### Ref

可通过 `ref` 调用组件实例上的 `toggle()` 方法切换展开状态。
