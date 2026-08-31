`ve-table` 用于展示结构化二维数据，支持排序、选择、固定列、内容区域滚动和自定义单元格渲染。

## 何时使用

- 展示运行记录、评估结果、构建任务、成员权限等结构化数据。
- 按列配置控制宽度、对齐、排序、固定列和单元格内容。
- 在数据量较多或列数较多时提供清晰的浏览与选择体验。

## 引入组件

```ts
import '@ve-design/web/ve-table';
```

## 示例

### 基础用法

通过 `columns` 和 `data` 配置表格。`columns` 需要通过 JavaScript 属性传入。

```html preview
<script type="module">
  import '@ve-design/web/ve-table';

  const table = document.querySelector('#table-basic-demo');

  table.columns = [
    { key: 'service', title: 'Service', dataIndex: 'service' },
    { key: 'environment', title: 'Environment', dataIndex: 'environment' },
    { key: 'region', title: 'Region', dataIndex: 'region' },
    { key: 'owner', title: 'Owner', dataIndex: 'owner' },
    { key: 'lastDeploy', title: 'Last Deploy', dataIndex: 'lastDeploy' },
    { key: 'status', title: 'Status', dataIndex: 'status' },
  ];

  table.data = [
    {
      id: 'svc-gateway-prod',
      service: 'checkout-gateway',
      environment: 'Production',
      region: 'Singapore',
      owner: 'Ava Chen',
      lastDeploy: 'May 02, 09:32',
      status: 'Healthy',
    },
    {
      id: 'svc-member-prod',
      service: 'member-profile',
      environment: 'Production',
      region: 'Frankfurt',
      owner: 'Leo Smith',
      lastDeploy: 'May 01, 22:18',
      status: 'Healthy',
    },
    {
      id: 'svc-risk-prod',
      service: 'risk-engine',
      environment: 'Production',
      region: 'Virginia',
      owner: 'Mina Patel',
      lastDeploy: 'May 01, 18:04',
      status: 'Investigating',
    },
    {
      id: 'svc-search-canary',
      service: 'search-indexer',
      environment: 'Canary',
      region: 'Tokyo',
      owner: 'Noah Kim',
      lastDeploy: 'May 02, 10:11',
      status: 'Rolling out',
    },
    {
      id: 'svc-audit-gray',
      service: 'audit-stream',
      environment: 'Gray',
      region: 'Oregon',
      owner: 'Iris Wang',
      lastDeploy: 'Apr 30, 16:45',
      status: 'Observing',
    },
    {
      id: 'svc-billing-stage',
      service: 'billing-center',
      environment: 'Staging',
      region: 'Singapore',
      owner: 'Zoe Martin',
      lastDeploy: 'May 02, 11:20',
      status: 'Verifying',
    },
  ];
  table.rowKey = 'id';
</script>

<section style="max-width: 1040px; margin: 0 auto; padding: 20px 0;">
  <ve-table id="table-basic-demo" bordered></ve-table>
</section>
```

### 行选择

设置 `selectable` 启用行选择，`row-key` 用于返回稳定的选中项标识。

```html preview
<script type="module">
  import '@ve-design/web/ve-table';

  const table = document.querySelector('#table-row-key-demo');
  const output = document.querySelector('#table-row-key-output');

  table.columns = [
    { key: 'resourceName', title: 'Resource', dataIndex: 'resourceName' },
    { key: 'resourceType', title: 'Type', dataIndex: 'resourceType' },
    { key: 'businessUnit', title: 'Business Unit', dataIndex: 'businessUnit' },
    { key: 'owner', title: 'Owner', dataIndex: 'owner' },
    { key: 'status', title: 'Status', dataIndex: 'status' },
  ];

  table.data = [
    {
      resourceId: 'res-prod-gw-001',
      resourceName: 'prod-gateway-001',
      resourceType: 'Ingress',
      businessUnit: 'Commerce',
      owner: 'Ava Chen',
      status: 'In service',
    },
    {
      resourceId: 'res-prod-db-014',
      resourceName: 'orders-db-primary',
      resourceType: 'Database',
      businessUnit: 'Commerce',
      owner: 'Leo Smith',
      status: 'Protected',
    },
    {
      resourceId: 'res-ml-cache-008',
      resourceName: 'feature-cache-eu',
      resourceType: 'Cache',
      businessUnit: 'Data Platform',
      owner: 'Mina Patel',
      status: 'Scaling',
    },
    {
      resourceId: 'res-sec-job-021',
      resourceName: 'policy-audit-nightly',
      resourceType: 'Job',
      businessUnit: 'Security',
      owner: 'Noah Kim',
      status: 'Paused',
    },
  ];
  table.rowKey = 'resourceId';
  table.selectable = true;

  table.addEventListener('ve-selection-change', (event) => {
    output.textContent = JSON.stringify(event.detail.selectedRowKeys);
  });
</script>

<section
  style="display: grid; gap: 12px; max-width: 960px; margin: 0 auto; padding: 20px 0;"
>
  <ve-table id="table-row-key-demo" bordered></ve-table>
  <code id="table-row-key-output" style="justify-self: start;">[]</code>
</section>
```

### 排序

将列设为 `sortable` 后，用户可以通过表头切换排序状态。

```html preview
<script type="module">
  import '@ve-design/web/ve-table';

  const table = document.querySelector('#table-sort-demo');
  const output = document.querySelector('#table-sort-output');

  table.columns = [
    { key: 'service', title: 'Service', dataIndex: 'service', sortable: true },
    { key: 'region', title: 'Region', dataIndex: 'region', sortable: true },
    {
      key: 'requests',
      title: 'Requests / min',
      dataIndex: 'requests',
      sortable: true,
    },
    {
      key: 'p95Latency',
      title: 'P95 Latency',
      dataIndex: 'p95Latency',
      sortable: true,
    },
    {
      key: 'errorRate',
      title: 'Error Rate',
      dataIndex: 'errorRate',
      sortable: true,
    },
  ];

  table.data = [
    {
      id: 'metric-1',
      service: 'checkout-gateway',
      region: 'Singapore',
      requests: 18420,
      p95Latency: 42,
      errorRate: '0.08%',
    },
    {
      id: 'metric-2',
      service: 'member-profile',
      region: 'Frankfurt',
      requests: 9360,
      p95Latency: 58,
      errorRate: '0.03%',
    },
    {
      id: 'metric-3',
      service: 'risk-engine',
      region: 'Virginia',
      requests: 6420,
      p95Latency: 71,
      errorRate: '0.24%',
    },
    {
      id: 'metric-4',
      service: 'search-indexer',
      region: 'Tokyo',
      requests: 22100,
      p95Latency: 64,
      errorRate: '0.11%',
    },
    {
      id: 'metric-5',
      service: 'audit-stream',
      region: 'Oregon',
      requests: 5100,
      p95Latency: 96,
      errorRate: '0.01%',
    },
  ];
  table.rowKey = 'id';

  table.addEventListener('ve-sort-change', (event) => {
    output.textContent = JSON.stringify(event.detail);
  });
</script>

<section
  style="display: grid; gap: 12px; max-width: 960px; margin: 0 auto; padding: 20px 0;"
>
  <ve-table id="table-sort-demo" bordered></ve-table>
  <code id="table-sort-output" style="justify-self: start;">
    Click a sortable header to inspect the sort payload.
  </code>
</section>
```

### 自定义单元格

通过 `render` 返回节点，适配更丰富的单元格内容。

```html preview
<script type="module">
  import '@ve-design/web/ve-avatar';
  import '@ve-design/web/ve-button';
  import '@ve-design/web/ve-link';
  import '@ve-design/web/ve-table';
  import '@ve-design/web/icons/check-circle';
  import '@ve-design/web/icons/edit';
  import '@ve-design/web/icons/link';
  import '@ve-design/web/icons/more-horizontal';
  import '@ve-design/web/icons/trash-03';
  import '@ve-design/web/icons/user';
  import '@ve-design/web/icons/warning';

  const table = document.querySelector('#table-rich-cell-demo');
  const styles = {
    employee:
      'display: inline-flex; align-items: center; gap: 8px; min-width: 0;',
    employeeCopy:
      'display: inline-flex; align-items: center; gap: 8px; min-width: 0;',
    tag: [
      'display: inline-flex',
      'align-items: center',
      'block-size: 22px',
      'padding: 0 8px',
      'border-radius: var(--radius-md)',
      'background: var(--color-bg-surface)',
      'color: var(--color-text-secondary)',
      'font-size: var(--text-caption)',
      'line-height: 22px',
      'white-space: nowrap',
    ].join('; '),
    status: [
      'display: inline-flex',
      'align-items: center',
      'gap: 6px',
      'block-size: 24px',
      'padding: 0 10px',
      'border-radius: var(--radius-md)',
      'font-size: var(--text-body-sm)',
      'line-height: 24px',
      'white-space: nowrap',
    ].join('; '),
    statusSuccess:
      'background: var(--color-bg-success-secondary); color: var(--color-text-success);',
    statusWarning:
      'background: var(--color-bg-warning-secondary); color: var(--color-text-warning);',
    codeBlock: [
      'display: inline-block',
      'max-width: 100%',
      'margin: 0',
      'padding: 4px 8px',
      'border-radius: var(--radius-sm)',
      'background: var(--color-bg-surface)',
      'color: var(--color-text-primary)',
      'font-family: var(--font-mono)',
      'font-size: 12px',
      'line-height: 18px',
      'white-space: nowrap',
      'overflow: hidden',
      'text-overflow: ellipsis',
    ].join('; '),
    quote: [
      'display: inline-flex',
      'align-items: center',
      'max-width: 100%',
      'margin: 0',
      'padding-inline-start: 10px',
      'border-inline-start: var(--stroke-weight-bold) solid var(--color-border-default)',
      'color: var(--color-text-secondary)',
      'white-space: nowrap',
      'overflow: hidden',
      'text-overflow: ellipsis',
    ].join('; '),
    textLink: 'min-block-size: 28px;',
    textLinkContent:
      'display: inline-flex; align-items: center; gap: 8px;',
    actions: 'display: inline-flex; align-items: center; gap: 8px;',
  };

  function createNode(tagName, options = {}, children = []) {
    const node = document.createElement(tagName);

    if (options.style) {
      node.setAttribute('style', options.style);
    }

    if (options.text !== undefined) {
      node.textContent = String(options.text);
    }

    Object.entries(options.attrs ?? {}).forEach(([name, value]) => {
      if (value !== undefined && value !== null && value !== false) {
        node.setAttribute(name, String(value));
      }
    });

    children.forEach((child) => {
      node.append(child);
    });

    return node;
  }

  function icon(name, size) {
    return createNode('ve-icon', {
      attrs: { name, size, 'aria-hidden': 'true' },
    });
  }

  function statusPill(row) {
    const isWarning = row.statusTone === 'warning';
    const iconName = isWarning ? 'warning' : 'check-circle';
    const statusStyle = isWarning ? styles.statusWarning : styles.statusSuccess;

    return createNode(
      'span',
      { style: `${styles.status}; ${statusStyle}` },
      [icon(iconName, 16), String(row.status)],
    );
  }

  function textLink(label, iconName, text, href) {
    return createNode(
      've-link',
      {
        style: styles.textLink,
        attrs: {
          href,
          'aria-label': label,
        },
      },
      [
        createNode('span', { style: styles.textLinkContent }, [
          icon(iconName, 16),
          text,
        ]),
      ],
    );
  }

  function actionButton(label, iconName) {
    return createNode(
      've-button',
      {
        attrs: {
          type: 'text',
          size: 'small',
          shape: 'circle',
          'aria-label': label,
        },
      },
      [icon(iconName, 16)],
    );
  }

  table.columns = [
    {
      key: 'employee',
      title: 'Owner',
      dataIndex: 'employee',
      width: 220,
      render: (value, row) => {
        const name = String(value);
        return createNode('span', { style: styles.employee }, [
          createNode('ve-avatar', { attrs: { size: 24, 'aria-label': name } }, [
            icon('user', 14),
          ]),
          createNode('span', { style: styles.employeeCopy }, [
            createNode('span', { text: name }),
            createNode('span', { style: styles.tag, text: row.role }),
          ]),
        ]);
      },
    },
    {
      key: 'status',
      title: 'Status',
      dataIndex: 'status',
      width: 150,
      render: (_, row) => statusPill(row),
    },
    {
      key: 'snippet',
      title: 'Code',
      dataIndex: 'snippet',
      width: 240,
      render: (value) =>
        createNode('pre', { style: styles.codeBlock }, [
          createNode('code', { text: value }),
        ]),
    },
    {
      key: 'note',
      title: 'Quote',
      dataIndex: 'note',
      width: 260,
      render: (value) =>
        createNode('blockquote', { style: styles.quote, text: value }),
    },
    {
      key: 'link',
      title: 'Link',
      width: 150,
      render: (_, row) =>
        textLink(`Open ${row.id}`, 'link', 'Open report', row.href),
    },
    {
      key: 'actions',
      title: 'Actions',
      width: 144,
      render: (_, row) =>
        createNode('span', { style: styles.actions }, [
          actionButton(`Edit ${row.id}`, 'edit'),
          actionButton(`Delete ${row.id}`, 'trash-03'),
          actionButton(`More ${row.id}`, 'more-horizontal'),
        ]),
    },
  ];

  table.data = [
    {
      id: 'row-1',
      employee: 'Ava Chen',
      role: 'Owner',
      status: 'Running',
      statusTone: 'success',
      snippet: 'design/01-token/tokens.css',
      note: 'Ready for token review',
      href: '#ava-chen',
    },
    {
      id: 'row-2',
      employee: 'Leo Smith',
      role: 'Reviewer',
      status: 'Running',
      statusTone: 'success',
      snippet: 'tokens.css',
      note: 'Mirror package check',
      href: '#leo-smith',
    },
    {
      id: 'row-3',
      employee: 'Mina Patel',
      role: 'Editor',
      status: 'Warning',
      statusTone: 'warning',
      snippet: 'npm run build',
      note: 'Needs snapshot refresh',
      href: '#mina-patel',
    },
    {
      id: 'row-4',
      employee: 'Noah Kim',
      role: 'Owner',
      status: 'Running',
      statusTone: 'success',
      snippet: '[data-theme]',
      note: 'Dark mode verified',
      href: '#noah-kim',
    },
    {
      id: 'row-5',
      employee: 'Iris Wang',
      role: 'Reviewer',
      status: 'Running',
      statusTone: 'success',
      snippet: 'design/01-token/tokens.css',
      note: 'Release note drafted',
      href: '#iris-wang',
    },
  ];
  table.rowKey = 'id';
  table.scrollConfig = { x: 1120 };
</script>

<section style="max-width: 1040px; margin: 0 auto; padding: 20px 0;">
  <ve-table id="table-rich-cell-demo" bordered></ve-table>
</section>
```

### 固定列与滚动

列数较多时，使用 `scrollConfig` 指定内容区域滚动区域，并通过 `fixed` 保持关键列可见。

```html preview
<script type="module">
  import '@ve-design/web/ve-table';

  const table = document.querySelector('#table-fixed-demo');

  table.columns = [
    {
      key: 'service',
      title: 'Service',
      dataIndex: 'service',
      fixed: 'left',
      width: 200,
    },
    { key: 'region', title: 'Region', dataIndex: 'region', width: 140 },
    { key: 'cluster', title: 'Cluster', dataIndex: 'cluster', width: 150 },
    { key: 'owner', title: 'Owner', dataIndex: 'owner', width: 150 },
    {
      key: 'runtime',
      title: 'Runtime',
      dataIndex: 'runtime',
      width: 130,
    },
    { key: 'cpu', title: 'CPU', dataIndex: 'cpu', width: 120 },
    {
      key: 'memory',
      title: 'Memory',
      dataIndex: 'memory',
      width: 120,
    },
    { key: 'version', title: 'Version', dataIndex: 'version', width: 150 },
    {
      key: 'status',
      title: 'Status',
      dataIndex: 'status',
      fixed: 'right',
      width: 150,
    },
  ];
  table.data = [
    {
      id: 'fixed-1',
      service: 'checkout-gateway',
      region: 'Singapore',
      cluster: 'edge-ap-sg-01',
      owner: 'Ava Chen',
      runtime: '19d 4h',
      cpu: '62%',
      memory: '71%',
      version: 'v3.2.4',
      status: 'Healthy',
    },
    {
      id: 'fixed-2',
      service: 'risk-engine',
      region: 'Virginia',
      cluster: 'core-us-va-02',
      owner: 'Mina Patel',
      runtime: '7d 11h',
      cpu: '78%',
      memory: '69%',
      version: 'v5.6.2',
      status: 'Investigating',
    },
    {
      id: 'fixed-3',
      service: 'search-indexer',
      region: 'Tokyo',
      cluster: 'search-ap-tk-01',
      owner: 'Noah Kim',
      runtime: '3d 2h',
      cpu: '84%',
      memory: '76%',
      version: 'v2.9.1',
      status: 'Rolling out',
    },
    {
      id: 'fixed-4',
      service: 'audit-stream',
      region: 'Oregon',
      cluster: 'log-us-or-01',
      owner: 'Iris Wang',
      runtime: '42d 8h',
      cpu: '41%',
      memory: '52%',
      version: 'v1.4.1',
      status: 'Healthy',
    },
    {
      id: 'fixed-5',
      service: 'billing-center',
      region: 'Frankfurt',
      cluster: 'pay-eu-de-03',
      owner: 'Leo Smith',
      runtime: '12d 6h',
      cpu: '57%',
      memory: '63%',
      version: 'v2.9.8',
      status: 'Warning',
    },
  ];
  table.rowKey = 'id';
  table.scrollConfig = { x: 1280, y: 288 };
</script>

<section style="max-width: 1040px; margin: 0 auto; padding: 20px 0;">
  <ve-table id="table-fixed-demo" bordered vertical-line></ve-table>
</section>
```

### 加载态与空态

使用 `loading` 展示加载反馈；空数据时可使用默认空态或 `empty-content` 插槽。

```html preview
<script type="module">
  import '@ve-design/web/ve-table';

  const columns = [
    { key: 'alert', title: 'Alert', dataIndex: 'alert' },
    { key: 'severity', title: 'Severity', dataIndex: 'severity' },
    { key: 'source', title: 'Source', dataIndex: 'source' },
    { key: 'detectedAt', title: 'Detected At', dataIndex: 'detectedAt' },
  ];

  const loadingTable = document.querySelector('#table-loading-demo');
  loadingTable.columns = columns;
  loadingTable.loading = true;
  loadingTable.bordered = true;

  const emptyTable = document.querySelector('#table-empty-demo');
  emptyTable.columns = columns;
  emptyTable.data = [];
  emptyTable.bordered = true;

  const customEmptyTable = document.querySelector('#table-empty-custom-demo');
  customEmptyTable.columns = columns;
  customEmptyTable.data = [];
  customEmptyTable.bordered = true;
</script>

<section
  style="display: grid; gap: 16px; max-width: 860px; margin: 0 auto; padding: 20px 0;"
>
  <ve-table id="table-loading-demo"></ve-table>
  <ve-table id="table-empty-demo"></ve-table>
  <ve-table id="table-empty-custom-demo">
    <span slot="empty-content">No alerts match the current filter.</span>
  </ve-table>
</section>
```

## API

### 属性

| 属性名          | 描述                                               | 类型                                                     | 默认值      |
| --------------- | -------------------------------------------------- | -------------------------------------------------------- | ----------- |
| `columns`       | 列配置。通过 JS 属性设置。                         | `VeTableColumn[]`                                        | `[]`        |
| `data`          | 数据源。通过 JS 属性设置。                         | `Record<string, unknown>[]`                              | `[]`        |
| `row-key`       | 行唯一标识字段名。                                 | `string`                                                 | `'id'`      |
| `loading`       | 是否展示加载骨架行。                               | `boolean`                                                | `false`     |
| `bordered`      | 是否展示表格外框。                                 | `boolean`                                                | `false`     |
| `vertical-line` | 是否展示列分割线。                                 | `boolean`                                                | `false`     |
| `hover`         | 是否启用行悬浮高亮。                               | `boolean`                                                | `true`      |
| `selectable`    | 是否启用行选择。                                   | `boolean`                                                | `false`     |
| `scrollConfig`  | 内容区域滚动尺寸，`x` 控制横向，`y` 控制纵向滚动高度。 | `{ x?: number &#124; string; y?: number &#124; string }` | `undefined` |

### 列配置

| 属性名      | 描述                                 | 类型                                                                          | 默认值      |
| ----------- | ------------------------------------ | ----------------------------------------------------------------------------- | ----------- |
| `key`       | 列唯一标识。                         | `string`                                                                      | -           |
| `title`     | 表头内容或表头渲染函数。             | `string &#124; ((column: VeTableColumn) => unknown)`                          | -           |
| `dataIndex` | 取值字段；未设置时使用 `key`。       | `string`                                                                      | `undefined` |
| `width`     | 列宽，单位为 px。                    | `number`                                                                      | `undefined` |
| `minWidth`  | 最小列宽，单位为 px。                | `number`                                                                      | `undefined` |
| `maxWidth`  | 最大列宽，单位为 px。                | `number`                                                                      | `undefined` |
| `align`     | 单元格对齐方式。                     | `'left' &#124; 'center' &#124; 'right'`                                       | `undefined` |
| `sortable`  | 是否允许排序。                       | `boolean`                                                                     | `undefined` |
| `fixed`     | 固定列位置。                         | `'left' &#124; 'right'`                                                       | `undefined` |
| `wrap`      | 单元格内容是否换行。                 | `boolean`                                                                     | `undefined` |
| `render`    | 自定义单元格，返回文本、节点或模板。 | `(value: unknown, row: Record<string, unknown>, rowIndex: number) => unknown` | `undefined` |

### 事件

| 事件名                | 描述                               | 参数类型                                                                               |
| --------------------- | ---------------------------------- | -------------------------------------------------------------------------------------- |
| `ve-change`           | 排序或选择状态变化时触发聚合事件。 | `CustomEvent<{ sortState: VeTableSortDetail &#124; null; selectedRowKeys: string[] }>` |
| `ve-sort-change`      | 排序状态变化时触发。               | `CustomEvent<{ key: string; direction: 'asc' &#124; 'desc' } &#124; null>`             |
| `ve-selection-change` | 行选择变化时触发。                 | `CustomEvent<{ selectedRowKeys: string[]; selectedRows: Record<string, unknown>[] }>`  |

### 插槽

| 插槽名          | 描述                       |
| --------------- | -------------------------- |
| `empty-content` | 空数据时展示的自定义内容。 |
