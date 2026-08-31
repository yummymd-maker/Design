`ve-cascader` 用于在层级数据中选择一条或多条路径，适合组织结构、工作区、Agent 分类、知识库目录等需要逐级定位的场景。

## 何时使用

- 选项天然具有父子层级，并且用户需要逐级理解上下文。
- 需要在一个控件中完成单选或多选路径选择。
- 需要通过搜索快速定位深层节点。

## 引入组件

```ts
import '@ve-design/web/ve-cascader';
```

## 示例

### 基础用法

通过 `options` 设置层级数据。`value` 是当前路径，按层级从父节点到子节点排列。

```html preview
<script type="module">
  import '@ve-design/web/ve-cascader';
  import '@ve-design/web/icons/robot';
</script>

<section style="display: grid; place-items: center; padding: 32px 24px;">
  <div style="width: min(100%, 360px);">
    <ve-cascader
      id="workspace-cascader"
      value='["workspace","agent-platform","project-space-a"]'
      placeholder="Select workspace"
      allow-clear
    >
      <ve-icon slot="prefix" name="robot"></ve-icon>
    </ve-cascader>
  </div>
</section>

<script>
  document.getElementById('workspace-cascader').options = [
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
            { label: 'Order Tracking Agent', value: 'order-tracking-agent' },
          ],
        },
      ],
    },
  ];
</script>
```

### 默认值和事件

`default-value` 设置初始路径。监听 `ve-change` 可以获取当前值和选中节点信息。

```html preview
<script type="module">
  import '@ve-design/web/ve-cascader';
</script>

<section style="display: grid; place-items: center; padding: 32px 24px;">
  <div style="display: grid; gap: 12px; width: min(100%, 360px);">
    <ve-cascader
      id="default-cascader"
      default-value='["support","tickets","refund"]'
      placeholder="Select routing path"
    ></ve-cascader>
    <code
      id="change-log"
      style="color: var(--color-text-secondary); background: var(--color-bg-muted); border-radius: var(--radius-sm); padding: 8px 12px;"
      >Selected: support / tickets / refund</code
    >
  </div>
</section>

<script>
  const cascader = document.getElementById('default-cascader');
  cascader.options = [
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
  ];
  cascader.addEventListener('ve-change', (event) => {
    document.getElementById('change-log').textContent =
      `Selected: ${event.detail.value.join(' / ')}`;
  });
</script>
```

### 多选

`mode="multiple"` 开启多选。`checked-strategy="child"` 只返回叶子路径，`checked-strategy="parent"` 会在父节点完整选中时返回父路径。

```html preview
<script type="module">
  import '@ve-design/web/ve-cascader';
</script>

<section style="display: grid; place-items: center; padding: 32px 24px;">
  <div style="display: grid; gap: 12px; width: min(100%, 360px);">
    <ve-cascader
      id="capability-cascader"
      mode="multiple"
      checked-strategy="child"
      allow-clear
      placeholder="Select capabilities"
    ></ve-cascader>
    <ve-cascader
      id="parent-strategy-cascader"
      mode="multiple"
      checked-strategy="parent"
      placeholder="Parent strategy"
    ></ve-cascader>
  </div>
</section>

<script>
  const capabilityOptions = [
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
  ];
  const childCascader = document.getElementById('capability-cascader');
  childCascader.options = capabilityOptions;
  childCascader.value = [
    ['research', 'public-sources', 'web-search'],
    ['execution', 'automation', 'code-runner'],
  ];
  document.getElementById('parent-strategy-cascader').options =
    capabilityOptions;
</script>
```

### 搜索

`show-search` 开启搜索。内置搜索会忽略大小写，并同时匹配每个路径节点的 `label` 和 `value`。

```html preview
<script type="module">
  import '@ve-design/web/ve-cascader';
  import '@ve-design/web/icons/search';
</script>

<section style="display: grid; place-items: center; padding: 32px 24px;">
  <div style="display: grid; gap: 12px; width: min(100%, 360px);">
    <ve-cascader
      id="search-cascader"
      show-search
      input-value="US"
      allow-clear
      placeholder="Search region or value"
    >
      <ve-icon slot="prefix" name="search"></ve-icon>
    </ve-cascader>
    <code
      id="search-log"
      style="color: var(--color-text-secondary); background: var(--color-bg-muted); border-radius: var(--radius-sm); padding: 8px 12px;"
      >Search: US</code
    >
  </div>
</section>

<script>
  const cascader = document.getElementById('search-cascader');
  cascader.options = [
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
  ];
  cascader.addEventListener('ve-search', (event) => {
    document.getElementById('search-log').textContent =
      `Search: ${event.detail.inputValue || 'empty'}`;
  });
</script>
```

### 交互状态

`size` 控制触发器尺寸，`status` 展示校验状态。`allow-clear` 显示清空入口，`disabled` 禁用组件。

```html preview
<script type="module">
  import '@ve-design/web/ve-cascader';
</script>

<section style="display: grid; place-items: center; padding: 32px 24px;">
  <div style="display: grid; gap: 12px; width: min(100%, 360px);">
    <ve-cascader
      id="state-small"
      size="small"
      placeholder="Small"
    ></ve-cascader>
    <ve-cascader
      id="state-default"
      size="default"
      placeholder="Default"
    ></ve-cascader>
    <ve-cascader
      id="state-large"
      size="large"
      placeholder="Large"
    ></ve-cascader>
    <ve-cascader
      id="state-warning"
      status="warning"
      placeholder="Capacity needs review"
    ></ve-cascader>
    <ve-cascader
      id="state-error"
      status="error"
      placeholder="Routing path is required"
    ></ve-cascader>
    <ve-cascader
      id="state-disabled"
      disabled
      value='["platform","runtime"]'
    ></ve-cascader>
  </div>
</section>

<script>
  const options = [
    {
      label: 'Platform',
      value: 'platform',
      children: [
        { label: 'Agent Runtime', value: 'runtime' },
        { label: 'Model Gateway', value: 'model-gateway' },
      ],
    },
    {
      label: 'Operations',
      value: 'operations',
      children: [
        { label: 'Incident Response', value: 'incident-response' },
        { label: 'Release Review', value: 'release-review' },
      ],
    },
  ];
  [
    'state-small',
    'state-default',
    'state-large',
    'state-warning',
    'state-error',
    'state-disabled',
  ].forEach((id) => {
    document.getElementById(id).options = options;
  });
</script>
```

### 展开策略

`expand-trigger="hover"` 改为悬浮展开子级。`change-on-select` 允许非叶子节点触发选中。

```html preview
<script type="module">
  import '@ve-design/web/ve-cascader';
</script>

<section style="display: grid; place-items: center; padding: 32px 24px;">
  <div style="display: grid; gap: 12px; width: min(100%, 360px);">
    <ve-cascader
      id="hover-cascader"
      expand-trigger="hover"
      placeholder="Hover to expand"
    ></ve-cascader>
    <ve-cascader
      id="change-on-select-cascader"
      change-on-select
      placeholder="Select any level"
    ></ve-cascader>
  </div>
</section>

<script>
  const options = [
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
  ];
  document.getElementById('hover-cascader').options = options;
  document.getElementById('change-on-select-cascader').options = options;
</script>
```

### 自定义渲染

`renderFormat` 自定义触发器展示文本。`renderOption` 和 `renderFooter` 需要通过 JavaScript 属性设置。

```html preview
<script type="module">
  import '@ve-design/web/ve-cascader';
</script>

<section style="display: grid; place-items: center; padding: 32px 24px;">
  <div style="width: min(100%, 360px);">
    <ve-cascader
      id="render-cascader"
      value='["knowledge","documents","policy"]'
      placeholder="Select source"
    ></ve-cascader>
  </div>
</section>

<script>
  const cascader = document.getElementById('render-cascader');
  cascader.options = [
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
  ];
  cascader.renderFormat = (labels) => labels.join(' > ');
  cascader.renderOption = (option, level) =>
    `${'  '.repeat(level)}${option.label}`;
  cascader.renderFooter = (level) => `Level ${level + 1}`;
</script>
```

### 方法

`show()` 和 `hide()` 可以主动控制弹层。需要聚焦控件时使用 `focus()`。

```html preview
<script type="module">
  import '@ve-design/web/ve-button';
  import '@ve-design/web/ve-cascader';
</script>

<section style="display: grid; place-items: center; padding: 32px 24px;">
  <div style="display: grid; gap: 12px; width: min(100%, 360px);">
    <div style="display: flex; justify-content: center; gap: 8px;">
      <ve-button id="show-cascader">Open</ve-button>
      <ve-button id="hide-cascader" type="outline">Close</ve-button>
    </div>
    <ve-cascader id="method-cascader" placeholder="Select owner"></ve-cascader>
  </div>
</section>

<script>
  const cascader = document.getElementById('method-cascader');
  cascader.options = [
    {
      label: 'Team',
      value: 'team',
      children: [
        { label: 'Platform Team', value: 'platform-team' },
        { label: 'Support Team', value: 'support-team' },
      ],
    },
  ];
  document
    .getElementById('show-cascader')
    .addEventListener('click', () => cascader.show());
  document
    .getElementById('hide-cascader')
    .addEventListener('click', () => cascader.hide());
</script>
```

## API

### ve-cascader 属性

| 属性名                        | 描述                                                                | 类型                                                                     | 默认值            |
| ----------------------------- | ------------------------------------------------------------------- | ------------------------------------------------------------------------ | ----------------- |
| `value`                       | 当前选中路径；单选为路径数组，多选为路径数组列表。                  | `string[] &#124; string[][]`                                             | `[]`              |
| `default-value`               | 初始选中路径。                                                      | `string[] &#124; string[][]`                                             | `[]`              |
| `options`                     | 层级选项数据，需要通过 JS 属性或 JSON 字符串属性设置。              | `CascaderOption[]`                                                       | `[]`              |
| `placeholder`                 | 未选择时的提示文本。                                                | `string`                                                                 | `'Please select'` |
| `mode`                        | 选择模式。                                                          | `'single' &#124; 'multiple'`                                             | `'single'`        |
| `size`                        | 触发器尺寸。                                                        | `'small' &#124; 'default' &#124; 'large'`                                | `'default'`       |
| `status`                      | 状态样式。                                                          | `'default' &#124; 'warning' &#124; 'error'`                              | `'default'`       |
| `disabled`                    | 是否禁用。                                                          | `boolean`                                                                | `false`           |
| `allow-clear`                 | 是否允许清空。                                                      | `boolean`                                                                | `false`           |
| `open`                        | 当前弹层是否打开。                                                  | `boolean`                                                                | `false`           |
| `default-open`                | 初始弹层打开状态。                                                  | `boolean`                                                                | `false`           |
| `expand-trigger`              | 子级展开触发方式。                                                  | `'click' &#124; 'hover'`                                                 | `'click'`         |
| `change-on-select`            | 是否允许选择非叶子节点时触发值变化。                                | `boolean`                                                                | `false`           |
| `show-empty-children`         | 空子节点是否可继续展开。                                            | `boolean`                                                                | `false`           |
| `checked-strategy`            | 多选模式的值聚合策略。                                              | `'parent' &#124; 'child'`                                                | `'child'`         |
| `show-search`                 | 是否展示搜索输入。内置搜索会忽略大小写，并匹配 `label` 与 `value`。 | `boolean`                                                                | `false`           |
| `input-value`                 | 搜索输入值。                                                        | `string`                                                                 | `''`              |
| `popup-match-select-width`    | 弹层宽度是否至少匹配触发器宽度。                                    | `boolean`                                                                | `false`           |
| `empty-text`                  | 空状态文本。                                                        | `string`                                                                 | `'No data'`       |
| `default-active-first-option` | 是否默认激活第一个可选项。                                          | `boolean`                                                                | `true`            |
| `showSearchOptions`           | 搜索面板配置，需通过 JS 属性设置。                                  | `VeCascaderShowSearchOptions &#124; undefined`                           | `undefined`       |
| `renderFormat`                | 自定义触发器展示文本，需通过 JS 属性设置。                          | `(valueShow: string[], options?: CascaderOption[]) => unknown`           | `undefined`       |
| `renderOption`                | 自定义级联列选项渲染，需通过 JS 属性设置。                          | `(option: CascaderNodeData, level: number) => unknown`                   | `undefined`       |
| `renderFooter`                | 自定义每列底部内容，需通过 JS 属性设置。                            | `(level: number, activeOption: CascaderNodeData &#124; null) => unknown` | `undefined`       |
| `filterOption`                | 自定义搜索过滤方法，需通过 JS 属性设置。                            | `(inputValue: string, option: CascaderNodeData) => boolean`              | `undefined`       |

### CascaderOption

| 字段名            | 描述                         | 类型                   |
| ----------------- | ---------------------------- | ---------------------- |
| `label`           | 选项展示文本。               | `string`               |
| `value`           | 选项值。                     | `string &#124; number` |
| `children`        | 子级选项。                   | `CascaderOption[]`     |
| `disabled`        | 是否禁用该选项及其子级。     | `boolean`              |
| `isLeaf`          | 是否强制作为叶子节点处理。   | `boolean`              |
| `disableCheckbox` | 多选模式下是否禁用该复选框。 | `boolean`              |

### ve-cascader 事件

| 事件名                  | 描述                           | 参数类型                                                                                                                                    |
| ----------------------- | ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `ve-change`             | 选中值变化时触发。             | `CustomEvent<{ value: string[] &#124; string[][]; selectedOptions: CascaderOption[] &#124; CascaderOption[][]; dropdownVisible: boolean }>` |
| `ve-open-change`        | 弹层打开状态变化请求发生时触发。 | `CustomEvent<{ open: boolean; reason: 'api' &#124; 'trigger' &#124; 'outside' &#124; 'select' &#124; 'escape' }>`                           |
| `ve-clear`              | 清空选中值时触发。             | `CustomEvent<{ visible: boolean }>`                                                                                                         |
| `ve-search`             | 手动搜索或搜索面板隐藏时触发。 | `CustomEvent<{ inputValue: string; reason: 'manual' &#124; 'optionListHide' &#124; 'optionChecked' }>`                                      |
| `ve-input-value-change` | 搜索输入值变化时触发。         | `CustomEvent<{ inputValue: string; reason: 'manual' &#124; 'optionListHide' &#124; 'optionChecked' }>`                                      |

### ve-cascader 方法

| 方法名                          | 描述                                             |
| ------------------------------- | ------------------------------------------------ |
| `focus(options?: FocusOptions)` | 聚焦触发器；弹层打开且搜索输入可见时聚焦搜索框。 |
| `blur()`                        | 让触发器和搜索输入失焦。                         |
| `show()`                        | 打开弹层。                                       |
| `hide()`                        | 关闭弹层。                                       |

### ve-cascader 插槽

| 插槽名   | 描述             |
| -------- | ---------------- |
| `prefix` | 触发器前缀内容。 |
