`Tabs` 用于在同一视图内切换相互关联的内容面板，由 `Tabs` 和 `TabPane` 组合使用。

## 何时使用

- 需要在同一上下文中切换概览、配置、记录、评估结果等并列内容。
- 内容之间关系紧密，切换不应引起页面跳转或上下文重置。
- 需要通过尺寸、视觉类型或导航位置适配不同的信息密度和布局结构。

## 引入组件

```tsx
import { Tabs, TabPane } from '@ve-design/react';
```

## 示例

### 基础用法

使用 `defaultActiveTab` 设置默认激活项，适合由组件自行维护切换状态的场景。

```tsx preview
import { Tabs, TabPane } from '@ve-design/react';

<section style={{ display: 'grid', placeItems: 'center', padding: 32 }}>
  <Tabs
    defaultActiveTab="overview"
    style={{ display: 'block', width: 'min(720px, 100%)' }}
  >
    <TabPane itemKey="overview" title="Overview">
      <p>
        <strong>Agent health is stable.</strong> The latest run completed 24
        conversations and kept the average response time under 15 seconds.
      </p>
    </TabPane>
    <TabPane itemKey="memory" title="Memory">
      <p>
        <strong>Workspace memory is enabled.</strong> Approved preferences and
        product terms are available to the assistant across sessions.
      </p>
    </TabPane>
    <TabPane itemKey="prompt" title="Prompt">
      <p>
        <strong>Production prompt v12 is active.</strong> It uses concise
        answers, citation rules, and a fallback path for low-confidence cases.
      </p>
    </TabPane>
  </Tabs>
</section>;
```

### 受控模式

设置 `activeTab` 后，组件按外部传入的激活项展示；用户切换页签时通过 `onChange` 返回下一个激活项，业务代码可据此回写状态。

```tsx preview
import { useState } from 'react';
import { Button, Tabs, TabPane } from '@ve-design/react';

function TabsControlledDemo() {
  const [activeTab, setActiveTab] = useState('inbox');

  return (
    <section style={{ display: 'grid', placeItems: 'center', padding: 32 }}>
      <div style={{ display: 'grid', gap: 16, width: 'min(760px, 100%)' }}>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 8,
            justifyContent: 'center',
          }}
        >
          <Button type="secondary" onClick={() => setActiveTab('inbox')}>
            Inbox
          </Button>
          <Button type="secondary" onClick={() => setActiveTab('review')}>
            Review
          </Button>
          <Button type="secondary" onClick={() => setActiveTab('resolved')}>
            Resolved
          </Button>
        </div>

        <Tabs
          activeTab={activeTab}
          onChange={(event) => setActiveTab(event.detail.activeTab)}
        >
          <TabPane itemKey="inbox" title="Inbox">
            <p>
              <strong>32 conversations are waiting.</strong> Seven include
              uploaded files and the queue is prioritizing enterprise billing
              questions.
            </p>
          </TabPane>
          <TabPane itemKey="review" title="Review">
            <p>
              <strong>4 conversations need review.</strong> They were escalated
              after confidence dropped below the configured threshold.
            </p>
          </TabPane>
          <TabPane itemKey="resolved" title="Resolved">
            <p>
              <strong>186 conversations were resolved this week.</strong> Only
              three tickets were reopened after the first response.
            </p>
          </TabPane>
        </Tabs>
      </div>
    </section>
  );
}
```

### 视觉类型

使用 `type` 切换标签导航样式。

```tsx preview
import { useState } from 'react';
import { Radio, RadioGroup, Tabs, TabPane } from '@ve-design/react';

function TabsTypeDemo() {
  const [type, setType] = useState<'line' | 'text' | 'rounded' | 'capsule'>(
    'line',
  );

  return (
    <section style={{ display: 'grid', placeItems: 'center', padding: 32 }}>
      <div
        style={{
          display: 'grid',
          gap: 16,
          justifyItems: 'center',
          width: 'min(760px, 100%)',
        }}
      >
        <RadioGroup
          type="button"
          size="small"
          value={type}
          onChange={(event) => setType(event.detail.value as typeof type)}
        >
          <Radio value="line">line</Radio>
          <Radio value="text">text</Radio>
          <Radio value="rounded">rounded</Radio>
          <Radio value="capsule">capsule</Radio>
        </RadioGroup>

        <Tabs type={type} defaultActiveTab="plan" style={{ width: '100%' }}>
          <TabPane itemKey="plan" title="Plan">
            <p>
              <strong>Planning generated 9 tasks.</strong> Three tasks require
              approval because they affect permissions, billing copy, or
              migration notes.
            </p>
          </TabPane>
          <TabPane itemKey="generate" title="Generate">
            <p>
              <strong>Generation finished in 2 minutes.</strong> Component
              files, test cases, and a preview note are ready for review.
            </p>
          </TabPane>
          <TabPane itemKey="verify" title="Verify">
            <p>
              <strong>Type checks passed.</strong> Visual review is waiting for
              the updated dashboard baseline.
            </p>
          </TabPane>
        </Tabs>
      </div>
    </section>
  );
}
```

### 尺寸

使用 `size` 调整页签导航密度。

```tsx preview
import { useState } from 'react';
import { Radio, RadioGroup, Tabs, TabPane } from '@ve-design/react';

function TabsSizeDemo() {
  const [size, setSize] = useState<'small' | 'default' | 'large'>('default');

  return (
    <section style={{ display: 'grid', placeItems: 'center', padding: 32 }}>
      <div
        style={{
          display: 'grid',
          gap: 16,
          justifyItems: 'center',
          width: 'min(760px, 100%)',
        }}
      >
        <RadioGroup
          type="button"
          size="small"
          value={size}
          onChange={(event) => setSize(event.detail.value as typeof size)}
        >
          <Radio value="small">small</Radio>
          <Radio value="default">default</Radio>
          <Radio value="large">large</Radio>
        </RadioGroup>

        <Tabs size={size} defaultActiveTab="health" style={{ width: '100%' }}>
          <TabPane itemKey="health" title="Health">
            <p>
              <strong>All production agents are online.</strong> Retrieval
              latency is 82 ms at P95 and no fallback model was triggered in the
              last hour.
            </p>
          </TabPane>
          <TabPane itemKey="quality" title="Quality">
            <p>
              <strong>Answer acceptance is 92.4%.</strong> Most reviewer edits
              are naming corrections, so product vocabulary will be refreshed
              next.
            </p>
          </TabPane>
          <TabPane itemKey="cost" title="Cost">
            <p>
              <strong>Token spend is 8% below budget.</strong> Short replies now
              use the compact model while complex cases stay on the reasoning
              model.
            </p>
          </TabPane>
        </Tabs>
      </div>
    </section>
  );
}
```

### 导航位置

使用 `tabPosition` 设置页签栏位置。

```tsx preview
import { useState } from 'react';
import { Radio, RadioGroup, Tabs, TabPane } from '@ve-design/react';

function TabsPositionDemo() {
  const [tabPosition, setTabPosition] = useState<
    'top' | 'bottom' | 'left' | 'right'
  >('top');

  return (
    <section style={{ display: 'grid', placeItems: 'center', padding: 32 }}>
      <div
        style={{
          display: 'grid',
          gap: 16,
          justifyItems: 'center',
          width: 'min(760px, 100%)',
        }}
      >
        <RadioGroup
          type="button"
          size="small"
          value={tabPosition}
          onChange={(event) =>
            setTabPosition(event.detail.value as typeof tabPosition)
          }
        >
          <Radio value="top">top</Radio>
          <Radio value="bottom">bottom</Radio>
          <Radio value="left">left</Radio>
          <Radio value="right">right</Radio>
        </RadioGroup>

        <Tabs
          tabPosition={tabPosition}
          defaultActiveTab="profile"
          style={{ display: 'block', width: '100%', minHeight: 240 }}
        >
          <TabPane itemKey="profile" title="Profile">
            <p>
              <strong>Enterprise billing agent.</strong> It answers invoice,
              contract, and renewal questions using approved account metadata.
            </p>
          </TabPane>
          <TabPane itemKey="tools" title="Tools">
            <p>
              <strong>4 tools are enabled.</strong> Document search and ticket
              lookup are available to all agents; refund simulation requires
              review.
            </p>
          </TabPane>
          <TabPane itemKey="guardrails" title="Guardrails">
            <p>
              <strong>Pricing replies require citations.</strong>
              Regulated-region answers are drafted first and sent only after
              manual approval.
            </p>
          </TabPane>
        </Tabs>
      </div>
    </section>
  );
}
```

### 禁用页签

在 `TabPane` 上设置 `disabled`，可以让对应页签暂不可访问。

```tsx preview
import { useState } from 'react';
import { Button, Tabs, TabPane } from '@ve-design/react';

function TabsDisabledDemo() {
  const [disabled, setDisabled] = useState(true);

  return (
    <section style={{ display: 'grid', placeItems: 'center', padding: 32 }}>
      <div style={{ display: 'grid', gap: 16, width: 'min(760px, 100%)' }}>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Button
            type="secondary"
            onClick={() => setDisabled((value) => !value)}
          >
            {disabled ? 'Unlock report' : 'Lock report'}
          </Button>
        </div>

        <Tabs defaultActiveTab="summary">
          <TabPane itemKey="summary" title="Summary">
            <p>
              <strong>420 conversations evaluated.</strong> Citation coverage
              improved by 6% and tool accuracy stayed above the release
              threshold.
            </p>
          </TabPane>
          <TabPane itemKey="report" title="Report" disabled={disabled}>
            <p>
              <strong>Detailed report is locked.</strong> It includes
              low-confidence replies, policy samples, and recommended prompt
              changes.
            </p>
          </TabPane>
          <TabPane itemKey="actions" title="Actions">
            <p>
              <strong>Next actions are ready.</strong> Update retrieval filters,
              add regression cases, and rerun the safety benchmark before
              publishing.
            </p>
          </TabPane>
        </Tabs>
      </div>
    </section>
  );
}
```

### 自定义标题与事件

使用 `tab` 自定义页签标题；用户切换页签时会触发 `onChange`。

```tsx preview
import { useState } from 'react';
import { Tabs, TabPane } from '@ve-design/react';
import {
  IconChart,
  IconDatabase,
  IconMonitor,
  IconPause,
  IconSettings,
  IconTerminal,
} from '@ve-design/react/icons';

function TabsCustomTitleDemo() {
  const [status, setStatus] = useState('Current: Live traffic');
  const labels: Record<string, string> = {
    live: 'Live traffic',
    training: 'Training data',
    paused: 'Paused experiments',
    settings: 'Settings',
    logs: 'Logs',
    metrics: 'Metrics',
  };

  return (
    <section style={{ display: 'grid', placeItems: 'center', padding: 32 }}>
      <div style={{ display: 'grid', gap: 16, width: 'min(720px, 100%)' }}>
        <div
          style={{
            color: 'var(--color-text-tertiary)',
            fontSize: 13,
          }}
        >
          {status}
        </div>

        <Tabs
          defaultActiveTab="live"
          onChange={(event) => {
            setStatus(`Current: ${labels[event.detail.activeTab]}`);
          }}
        >
          <TabPane
            itemKey="live"
            title="Live"
            tab={
              <span
                style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
              >
                <IconMonitor size={16} aria-hidden="true" />
                Live
                <span
                  style={{ fontSize: 12, color: 'var(--color-text-tertiary)' }}
                >
                  12
                </span>
              </span>
            }
          >
            <p>
              <strong>Live traffic is healthy.</strong> The chat agent is
              handling daily sessions with a 96% automatic resolution rate.
            </p>
          </TabPane>
          <TabPane
            itemKey="training"
            title="Training"
            tab={
              <span
                style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
              >
                <IconDatabase size={16} aria-hidden="true" />
                Training
                <span
                  style={{ fontSize: 12, color: 'var(--color-text-tertiary)' }}
                >
                  8
                </span>
              </span>
            }
          >
            <p>
              <strong>Training set is updating.</strong> Reviewed conversations
              are being cleaned and tagged for the next prompt iteration.
            </p>
          </TabPane>
          <TabPane
            itemKey="paused"
            title="Paused"
            tab={
              <span
                style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
              >
                <IconPause size={16} aria-hidden="true" />
                Paused
                <span
                  style={{ fontSize: 12, color: 'var(--color-text-tertiary)' }}
                >
                  2
                </span>
              </span>
            }
          >
            <p>
              <strong>2 experiments are paused.</strong> They will resume after
              the latest safety review confirms the new refusal examples.
            </p>
          </TabPane>
          <TabPane
            itemKey="settings"
            title="Settings"
            tab={
              <span
                title="Settings"
                aria-label="Settings"
                style={{ display: 'inline-flex', alignItems: 'center' }}
              >
                <IconSettings size={16} aria-hidden="true" />
              </span>
            }
          >
            <p>
              <strong>Settings are ready.</strong> Model routing, citation
              policy, and escalation thresholds can be reviewed before
              publishing.
            </p>
          </TabPane>
          <TabPane
            itemKey="logs"
            title="Logs"
            tab={
              <span
                title="Logs"
                aria-label="Logs"
                style={{ display: 'inline-flex', alignItems: 'center' }}
              >
                <IconTerminal size={16} aria-hidden="true" />
              </span>
            }
          >
            <p>
              <strong>Run logs are available.</strong> The latest traces include
              retrieval calls, tool decisions, and reviewer comments.
            </p>
          </TabPane>
          <TabPane
            itemKey="metrics"
            title="Metrics"
            tab={
              <span
                title="Metrics"
                aria-label="Metrics"
                style={{ display: 'inline-flex', alignItems: 'center' }}
              >
                <IconChart size={16} aria-hidden="true" />
              </span>
            }
          >
            <p>
              <strong>Metrics are trending upward.</strong> Resolution rate,
              latency, and escalation volume are all inside the release target.
            </p>
          </TabPane>
        </Tabs>
      </div>
    </section>
  );
}
```

## API

### Props

| 属性名             | 描述                                     | 类型                                         | 默认值      |
| ------------------ | ---------------------------------------- | -------------------------------------------- | ----------- |
| `activeTab`        | 当前激活标签 key；设置后可用于受控模式。 | `string \| undefined`                        | `undefined` |
| `defaultActiveTab` | 非受控模式下的初始激活标签 key。         | `string`                                     | `''`        |
| `size`             | 标签导航尺寸。                           | `'small' \| 'default' \| 'large'`            | `'default'` |
| `type`             | 标签导航视觉类型。                       | `'line' \| 'text' \| 'rounded' \| 'capsule'` | `'line'`    |
| `tabPosition`      | 标签导航位置。                           | `'top' \| 'right' \| 'bottom' \| 'left'`     | `'top'`     |
| `children`         | 放置多个 `TabPane`。                     | `React.ReactNode`                            | `-`         |

### Tabs 事件

| 事件名     | 描述                         | 参数类型                             |
| ---------- | ---------------------------- | ------------------------------------ |
| `onChange` | 用户切换到非禁用标签时触发。 | `CustomEvent<{ activeTab: string }>` |

### TabPane Props

| 属性名     | 描述                                  | 类型              | 默认值  |
| ---------- | ------------------------------------- | ----------------- | ------- |
| `itemKey`  | 标签页唯一标识，需保持稳定。          | `string`          | `-`     |
| `title`    | 标签页文本标题；未提供 `tab` 时使用。 | `string`          | `''`    |
| `disabled` | 是否禁用该标签页。                    | `boolean`         | `false` |
| `tab`      | 自定义标签标题内容。                  | `React.ReactNode` | `-`     |
| `children` | 标签页内容面板。                      | `React.ReactNode` | `-`     |

### TabPane 事件

| 事件名         | 描述                                             | 参数类型      |
| -------------- | ------------------------------------------------ | ------------- |
| `onPaneChange` | 标签页标识、标题、禁用状态或标题内容变化时触发。 | `CustomEvent` |

### Ref

可通过 `TabPane` 的 `ref` 调用组件实例上的 `getTabNodes()` 方法，获取 `tab` 内容节点。
