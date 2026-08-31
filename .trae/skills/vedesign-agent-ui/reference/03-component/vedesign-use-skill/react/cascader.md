`Cascader` 用于在层级数据中选择一条或多条路径，适合组织结构、工作区、Agent 分类、知识库目录等需要逐级定位的场景。

## 何时使用

- 选项天然具有父子层级，并且用户需要逐级理解上下文。
- 需要在一个控件中完成单选或多选路径选择。
- 需要通过搜索快速定位深层节点。

## 引入组件

```tsx
import { Cascader } from '@ve-design/react';
```

## 示例

### 基础用法

通过 `options` 设置层级数据。`value` 是当前路径，按层级从父节点到子节点排列。

```tsx preview
import { Cascader } from '@ve-design/react';
import { IconRobot } from '@ve-design/react/icons';

<section
  style={{ display: 'grid', placeItems: 'center', padding: '32px 24px' }}
>
  <div style={{ width: 'min(100%, 360px)' }}>
    <Cascader
      options={[
        {
          label: 'Workspace',
          value: 'workspace',
          children: [
            {
              label: 'Agent Platform',
              value: 'agent-platform',
              children: [
                { label: '项目空间 A', value: 'project-space-a' },
                { label: '项目空间 B', value: 'prompt-lab' },
                { label: '生产环境', value: 'evaluation-center' },
              ],
            },
            {
              label: 'Knowledge Operations',
              value: 'knowledge-ops',
              children: [
                { label: '测试环境', value: 'knowledge-hub' },
                { label: 'Document Review', value: 'document-review' },
              ],
            },
          ],
        },
        {
          label: 'Production',
          value: 'production',
          children: [
            {
              label: 'Customer Support',
              value: 'customer-support',
              children: [
                { label: 'Refund Agent', value: 'refund-agent' },
                {
                  label: 'Order Tracking Agent',
                  value: 'order-tracking-agent',
                },
              ],
            },
          ],
        },
      ]}
      value={['workspace', 'agent-platform', 'project-space-a']}
      placeholder="Select workspace"
      allowClear
      prefix={<IconRobot />}
    />
  </div>
</section>;
```

### 默认值和事件

使用 `defaultValue` 设置初始路径。选中值变化时通过 `onChange` 获取当前值和选中节点信息。

```tsx preview
import { useState } from 'react';
import { Cascader } from '@ve-design/react';

function CascaderEventDemo() {
  const [log, setLog] = useState('Selected: support / tickets / refund');

  return (
    <section
      style={{ display: 'grid', placeItems: 'center', padding: '32px 24px' }}
    >
      <div style={{ display: 'grid', gap: 12, width: 'min(100%, 360px)' }}>
        <Cascader
          options={[
            {
              label: 'Customer Support',
              value: 'support',
              children: [
                {
                  label: 'Tickets',
                  value: 'tickets',
                  children: [
                    { label: 'Refund Agent', value: 'refund' },
                    { label: 'Delivery Delay', value: 'delivery-delay' },
                  ],
                },
                {
                  label: 'Live Chat',
                  value: 'live-chat',
                  children: [
                    { label: 'VIP Queue', value: 'vip-queue' },
                    { label: 'General Queue', value: 'general-queue' },
                  ],
                },
              ],
            },
            {
              label: 'Developer Tools',
              value: 'developer-tools',
              children: [
                {
                  label: 'Build',
                  value: 'build',
                  children: [
                    { label: 'CI Failure', value: 'ci-failure' },
                    { label: 'Dependency Update', value: 'dependency-update' },
                  ],
                },
              ],
            },
          ]}
          defaultValue={['support', 'tickets', 'refund']}
          placeholder="Select routing path"
          onChange={(event) => {
            setLog(`Selected: ${event.detail.value.join(' / ')}`);
          }}
        />
        <code
          style={{
            color: 'var(--color-text-secondary)',
            background: 'var(--color-bg-muted)',
            borderRadius: 'var(--radius-sm)',
            padding: '8px 12px',
          }}
        >
          {log}
        </code>
      </div>
    </section>
  );
}
```

### 多选

设置 `mode="multiple"` 开启多选。`checkedStrategy="child"` 只返回叶子路径，`checkedStrategy="parent"` 会在父节点完整选中时返回父路径。

```tsx preview
import { Cascader } from '@ve-design/react';

<section
  style={{ display: 'grid', placeItems: 'center', padding: '32px 24px' }}
>
  <div style={{ display: 'grid', gap: 12, width: 'min(100%, 360px)' }}>
    <Cascader
      options={[
        {
          label: 'Research',
          value: 'research',
          children: [
            {
              label: 'Public Sources',
              value: 'public-sources',
              children: [
                { label: 'Web Search', value: 'web-search' },
                { label: 'News Monitor', value: 'news-monitor' },
              ],
            },
            {
              label: 'Team Resources',
              value: 'team-resources',
              children: [
                { label: 'File Reader', value: 'file-reader' },
                { label: 'Knowledge Base', value: 'knowledge-base' },
              ],
            },
          ],
        },
        {
          label: 'Execution',
          value: 'execution',
          children: [
            {
              label: 'Automation',
              value: 'automation',
              children: [
                { label: 'Code Runner', value: 'code-runner' },
                {
                  label: 'Production Deploy',
                  value: 'production-deploy',
                  disableCheckbox: true,
                },
              ],
            },
          ],
        },
      ]}
      mode="multiple"
      checkedStrategy="child"
      allowClear
      placeholder="Select capabilities"
      value={[
        ['research', 'public-sources', 'web-search'],
        ['execution', 'automation', 'code-runner'],
      ]}
    />
    <Cascader
      options={[
        {
          label: 'Research',
          value: 'research',
          children: [
            {
              label: 'Public Sources',
              value: 'public-sources',
              children: [
                { label: 'Web Search', value: 'web-search' },
                { label: 'News Monitor', value: 'news-monitor' },
              ],
            },
            {
              label: 'Team Resources',
              value: 'team-resources',
              children: [
                { label: 'File Reader', value: 'file-reader' },
                { label: 'Knowledge Base', value: 'knowledge-base' },
              ],
            },
          ],
        },
      ]}
      mode="multiple"
      checkedStrategy="parent"
      placeholder="Parent strategy"
    />
  </div>
</section>;
```

### 搜索

使用 `showSearch` 开启搜索。内置搜索会忽略大小写，并同时匹配每个路径节点的 `label` 和 `value`。

```tsx preview
import { useState } from 'react';
import { Cascader } from '@ve-design/react';
import { IconSearch } from '@ve-design/react/icons';

function CascaderSearchDemo() {
  const [log, setLog] = useState('Search: US');

  return (
    <section
      style={{ display: 'grid', placeItems: 'center', padding: '32px 24px' }}
    >
      <div style={{ display: 'grid', gap: 12, width: 'min(100%, 360px)' }}>
        <Cascader
          options={[
            {
              label: 'Americas',
              value: 'americas',
              children: [
                {
                  label: 'North America',
                  value: 'na',
                  children: [
                    { label: 'Virginia', value: 'us-east-1' },
                    { label: 'Oregon', value: 'us-west-2' },
                  ],
                },
              ],
            },
            {
              label: 'Europe',
              value: 'europe',
              children: [
                {
                  label: 'EU Central',
                  value: 'eu-central',
                  children: [
                    { label: 'Frankfurt', value: 'eu-central-1' },
                    { label: 'Paris', value: 'eu-west-3' },
                  ],
                },
              ],
            },
          ]}
          showSearch
          inputValue="US"
          allowClear
          placeholder="Search region or value"
          prefix={<IconSearch />}
          onSearch={(event) => {
            setLog(`Search: ${event.detail.inputValue || 'empty'}`);
          }}
        />
        <code
          style={{
            color: 'var(--color-text-secondary)',
            background: 'var(--color-bg-muted)',
            borderRadius: 'var(--radius-sm)',
            padding: '8px 12px',
          }}
        >
          {log}
        </code>
      </div>
    </section>
  );
}
```

### 交互状态

使用 `size` 控制触发器尺寸，使用 `status` 展示校验状态。`allowClear` 显示清空入口，`disabled` 禁用组件。

```tsx preview
import { Cascader } from '@ve-design/react';

<section
  style={{ display: 'grid', placeItems: 'center', padding: '32px 24px' }}
>
  <div style={{ display: 'grid', gap: 12, width: 'min(100%, 360px)' }}>
    <Cascader
      options={[
        {
          label: 'Platform',
          value: 'platform',
          children: [
            { label: 'Agent Runtime', value: 'runtime' },
            { label: 'Model Gateway', value: 'model-gateway' },
          ],
        },
      ]}
      size="small"
      placeholder="Small"
    />
    <Cascader
      options={[
        {
          label: 'Platform',
          value: 'platform',
          children: [
            { label: 'Agent Runtime', value: 'runtime' },
            { label: 'Model Gateway', value: 'model-gateway' },
          ],
        },
      ]}
      size="default"
      placeholder="Default"
    />
    <Cascader
      options={[
        {
          label: 'Platform',
          value: 'platform',
          children: [
            { label: 'Agent Runtime', value: 'runtime' },
            { label: 'Model Gateway', value: 'model-gateway' },
          ],
        },
      ]}
      size="large"
      placeholder="Large"
    />
    <Cascader
      options={[{ label: 'Operations', value: 'operations' }]}
      status="warning"
      placeholder="Capacity needs review"
    />
    <Cascader
      options={[{ label: 'Operations', value: 'operations' }]}
      status="error"
      placeholder="Routing path is required"
    />
    <Cascader
      options={[
        {
          label: 'Platform',
          value: 'platform',
          children: [{ label: 'Agent Runtime', value: 'runtime' }],
        },
      ]}
      disabled
      value={['platform', 'runtime']}
    />
  </div>
</section>;
```

### 展开策略

设置 `expandTrigger="hover"` 改为悬浮展开子级。`changeOnSelect` 允许非叶子节点触发选中。

```tsx preview
import { Cascader } from '@ve-design/react';

<section
  style={{ display: 'grid', placeItems: 'center', padding: '32px 24px' }}
>
  <div style={{ display: 'grid', gap: 12, width: 'min(100%, 360px)' }}>
    <Cascader
      options={[
        {
          label: 'Assistants',
          value: 'assistants',
          children: [
            {
              label: 'Support',
              value: 'support',
              children: [
                { label: 'Refund Agent', value: 'refund-agent' },
                { label: 'Order Agent', value: 'order-agent' },
              ],
            },
          ],
        },
      ]}
      expandTrigger="hover"
      placeholder="Hover to expand"
    />
    <Cascader
      options={[
        {
          label: 'Knowledge',
          value: 'knowledge',
          children: [
            {
              label: 'Content',
              value: 'content',
              children: [
                { label: 'Policy Docs', value: 'policy-docs' },
                { label: 'Runbooks', value: 'runbooks' },
              ],
            },
          ],
        },
      ]}
      changeOnSelect
      placeholder="Select any level"
    />
  </div>
</section>;
```

### 自定义渲染

通过 `renderFormat` 自定义触发器展示文本。`renderOption` 和 `renderFooter` 可分别自定义级联列选项和列底部内容。

```tsx preview
import { Cascader } from '@ve-design/react';

<section
  style={{ display: 'grid', placeItems: 'center', padding: '32px 24px' }}
>
  <div style={{ width: 'min(100%, 360px)' }}>
    <Cascader
      options={[
        {
          label: 'Knowledge',
          value: 'knowledge',
          children: [
            {
              label: 'Documents',
              value: 'documents',
              children: [
                { label: 'Policy Library', value: 'policy' },
                { label: 'Product Notes', value: 'product-notes' },
              ],
            },
          ],
        },
      ]}
      value={['knowledge', 'documents', 'policy']}
      placeholder="Select source"
      renderFormat={(labels) => labels.join(' > ')}
      renderOption={(option, level) => `${'  '.repeat(level)}${option.label}`}
      renderFooter={(level) => `Level ${level + 1}`}
    />
  </div>
</section>;
```

### 方法

`show()` 和 `hide()` 可以主动控制弹层。需要聚焦控件时使用 `focus()`。

```tsx preview
import { useRef, type ComponentRef } from 'react';
import { Button, Cascader } from '@ve-design/react';

function CascaderMethodDemo() {
  const cascaderRef = useRef<ComponentRef<typeof Cascader> | null>(null);

  return (
    <section
      style={{ display: 'grid', placeItems: 'center', padding: '32px 24px' }}
    >
      <div style={{ display: 'grid', gap: 12, width: 'min(100%, 360px)' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
          <Button onClick={() => cascaderRef.current?.show()}>Open</Button>
          <Button type="outline" onClick={() => cascaderRef.current?.hide()}>
            Close
          </Button>
        </div>
        <Cascader
          ref={cascaderRef}
          options={[
            {
              label: 'Team',
              value: 'team',
              children: [
                { label: 'Platform Team', value: 'platform-team' },
                { label: 'Support Team', value: 'support-team' },
              ],
            },
          ]}
          placeholder="Select owner"
        />
      </div>
    </section>
  );
}
```

## API

### Props

| 属性名                     | 描述                                                                | 类型                                                                 | 默认值            |
| -------------------------- | ------------------------------------------------------------------- | -------------------------------------------------------------------- | ----------------- |
| `value`                    | 当前选中路径；单选为路径数组，多选为路径数组列表。                  | `string[] \| string[][]`                                             | `[]`              |
| `defaultValue`             | 初始选中路径。                                                      | `string[] \| string[][]`                                             | `[]`              |
| `options`                  | 层级选项数据。                                                      | `CascaderOption[]`                                                   | `[]`              |
| `placeholder`              | 未选择时的提示文本。                                                | `string`                                                             | `'Please select'` |
| `mode`                     | 选择模式。                                                          | `'single' \| 'multiple'`                                             | `'single'`        |
| `size`                     | 触发器尺寸。                                                        | `'small' \| 'default' \| 'large'`                                    | `'default'`       |
| `status`                   | 状态样式。                                                          | `'default' \| 'warning' \| 'error'`                                  | `'default'`       |
| `disabled`                 | 是否禁用。                                                          | `boolean`                                                            | `false`           |
| `allowClear`               | 是否允许清空。                                                      | `boolean`                                                            | `false`           |
| `open`                     | 当前弹层是否打开。                                                  | `boolean`                                                            | `false`           |
| `defaultOpen`              | 初始弹层打开状态。                                                  | `boolean`                                                            | `false`           |
| `expandTrigger`            | 子级展开触发方式。                                                  | `'click' \| 'hover'`                                                 | `'click'`         |
| `changeOnSelect`           | 是否允许选择非叶子节点时触发值变化。                                | `boolean`                                                            | `false`           |
| `showEmptyChildren`        | 空子节点是否可继续展开。                                            | `boolean`                                                            | `false`           |
| `checkedStrategy`          | 多选模式的值聚合策略。                                              | `'parent' \| 'child'`                                                | `'child'`         |
| `showSearch`               | 是否展示搜索输入。内置搜索会忽略大小写，并匹配 `label` 与 `value`。 | `boolean`                                                            | `false`           |
| `inputValue`               | 搜索输入值。                                                        | `string`                                                             | `''`              |
| `popupMatchSelectWidth`    | 弹层宽度是否至少匹配触发器宽度。                                    | `boolean`                                                            | `false`           |
| `emptyText`                | 空状态文本。                                                        | `string`                                                             | `'No data'`       |
| `defaultActiveFirstOption` | 是否默认激活第一个可选项。                                          | `boolean`                                                            | `true`            |
| `showSearchOptions`        | 搜索面板配置。                                                      | `VeCascaderShowSearchOptions \| undefined`                           | `undefined`       |
| `renderFormat`             | 自定义触发器展示文本。                                              | `(valueShow: string[], options?: CascaderOption[]) => unknown`       | `undefined`       |
| `renderOption`             | 自定义级联列选项渲染。                                              | `(option: CascaderNodeData, level: number) => unknown`               | `undefined`       |
| `renderFooter`             | 自定义每列底部内容。                                                | `(level: number, activeOption: CascaderNodeData \| null) => unknown` | `undefined`       |
| `filterOption`             | 自定义搜索过滤方法。                                                | `(inputValue: string, option: CascaderNodeData) => boolean`          | `undefined`       |
| `prefix`                   | 触发器前缀内容。                                                    | `React.ReactNode`                                                    | `-`               |
| `children`                 | 传入组件子节点。                                                    | `React.ReactNode`                                                    | `-`               |

### CascaderOption

| 字段名            | 描述                         | 类型               |
| ----------------- | ---------------------------- | ------------------ |
| `label`           | 选项展示文本。               | `string`           |
| `value`           | 选项值。                     | `string \| number` |
| `children`        | 子级选项。                   | `CascaderOption[]` |
| `disabled`        | 是否禁用该选项及其子级。     | `boolean`          |
| `isLeaf`          | 是否强制作为叶子节点处理。   | `boolean`          |
| `disableCheckbox` | 多选模式下是否禁用该复选框。 | `boolean`          |

### 事件

| 事件名               | 描述                             | 参数类型                                                                                                                            |
| -------------------- | -------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `onChange`           | 选中值变化时触发。               | `CustomEvent<{ value: string[] \| string[][]; selectedOptions: CascaderOption[] \| CascaderOption[][]; dropdownVisible: boolean }>` |
| `onOpenChange`       | 弹层打开状态变化请求发生时触发。 | `CustomEvent<{ open: boolean; reason: 'api' \| 'trigger' \| 'outside' \| 'select' \| 'escape' }>`                                   |
| `onClear`            | 清空选中值时触发。               | `CustomEvent<{ visible: boolean }>`                                                                                                 |
| `onSearch`           | 手动搜索或搜索面板隐藏时触发。   | `CustomEvent<{ inputValue: string; reason: 'manual' \| 'optionListHide' \| 'optionChecked' }>`                                      |
| `onInputValueChange` | 搜索输入值变化时触发。           | `CustomEvent<{ inputValue: string; reason: 'manual' \| 'optionListHide' \| 'optionChecked' }>`                                      |

### Ref

可通过 `ref` 调用组件实例上的 `focus(options?)`、`blur()`、`show()`、`hide()` 方法。
