`Table` 用于展示结构化二维数据，支持排序、行选择、固定列、内容区域滚动和 React 自定义单元格渲染。

## 何时使用

- 展示运行记录、评估结果、构建任务、成员权限等结构化数据。
- 按列配置控制宽度、对齐、排序、固定列和单元格内容。
- 需要在 React 中通过 `render` 返回组件化的单元格内容。

## 引入组件

```tsx
import { Table } from '@ve-design/react';
```

## 示例

### 基础用法

通过 `columns` 和 `data` 配置表格。

```tsx preview
import { Table } from '@ve-design/react';

function TableBasicDemo() {
  const columns = [
    { key: 'service', title: 'Service', dataIndex: 'service' },
    { key: 'environment', title: 'Environment', dataIndex: 'environment' },
    { key: 'region', title: 'Region', dataIndex: 'region' },
    { key: 'owner', title: 'Owner', dataIndex: 'owner' },
    { key: 'lastDeploy', title: 'Last Deploy', dataIndex: 'lastDeploy' },
    { key: 'status', title: 'Status', dataIndex: 'status' },
  ];

  const data = [
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

  return (
    <section style={{ maxWidth: 1040, margin: '0 auto', padding: '20px 0' }}>
      <Table columns={columns} data={data} rowKey="id" bordered />
    </section>
  );
}
```

### 行选择

设置 `selectable` 启用行选择，`rowKey` 用于返回稳定的选中项标识。

```tsx preview
import { useState } from 'react';
import { Table } from '@ve-design/react';

function TableSelectionDemo() {
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const columns = [
    { key: 'resourceName', title: 'Resource', dataIndex: 'resourceName' },
    { key: 'resourceType', title: 'Type', dataIndex: 'resourceType' },
    { key: 'businessUnit', title: 'Business Unit', dataIndex: 'businessUnit' },
    { key: 'owner', title: 'Owner', dataIndex: 'owner' },
    { key: 'status', title: 'Status', dataIndex: 'status' },
  ];

  const data = [
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

  return (
    <section
      style={{
        display: 'grid',
        gap: 12,
        maxWidth: 960,
        margin: '0 auto',
        padding: '20px 0',
      }}
    >
      <Table
        columns={columns}
        data={data}
        rowKey="resourceId"
        selectable
        bordered
        onSelectionChange={(event) => {
          setSelectedRowKeys(event.detail.selectedRowKeys);
        }}
      />
      <code style={{ justifySelf: 'start' }}>
        {JSON.stringify(selectedRowKeys)}
      </code>
    </section>
  );
}
```

### 排序

将列设为 `sortable` 后，用户可以通过表头切换排序状态。

```tsx preview
import { useState } from 'react';
import { Table } from '@ve-design/react';

function TableSortDemo() {
  const [sortState, setSortState] = useState(
    'Click a sortable header to inspect the sort payload.',
  );
  const columns = [
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

  const data = [
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

  return (
    <section
      style={{
        display: 'grid',
        gap: 12,
        maxWidth: 960,
        margin: '0 auto',
        padding: '20px 0',
      }}
    >
      <Table
        columns={columns}
        data={data}
        rowKey="id"
        bordered
        onSortChange={(event) => {
          setSortState(JSON.stringify(event.detail));
        }}
      />
      <code style={{ justifySelf: 'start' }}>{sortState}</code>
    </section>
  );
}
```

### 自定义单元格

通过 `render` 返回 React 节点，适配更丰富的单元格内容。

```tsx preview
import { Avatar, Button, Link, Table, Tag } from '@ve-design/react';
import {
  IconCheckCircle,
  IconEdit,
  IconLink,
  IconMoreHorizontal,
  IconTrash03,
  IconUser,
  IconWarning,
} from '@ve-design/react/icons';

function TableCustomCellDemo() {
  const data = [
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

  const columns = [
    {
      key: 'employee',
      title: 'Owner',
      dataIndex: 'employee',
      width: 220,
      render: (value, row) => {
        const name = String(value);

        return (
          <span
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}
          >
            <Avatar size={24} aria-label={name}>
              <IconUser size={14} />
            </Avatar>
            <span
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}
            >
              <span>{name}</span>
              <Tag>{String(row.role)}</Tag>
            </span>
          </span>
        );
      },
    },
    {
      key: 'status',
      title: 'Status',
      dataIndex: 'status',
      width: 150,
      render: (value, row) => {
        const warning = row.statusTone === 'warning';
        const Icon = warning ? IconWarning : IconCheckCircle;

        return (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              height: 24,
              padding: '0 10px',
              borderRadius: 8,
              color: warning
                ? 'var(--color-text-warning)'
                : 'var(--color-text-success)',
              background: warning
                ? 'var(--color-bg-warning-secondary)'
                : 'var(--color-bg-success-secondary)',
              whiteSpace: 'nowrap',
            }}
          >
            <Icon size={16} />
            {String(value)}
          </span>
        );
      },
    },
    {
      key: 'snippet',
      title: 'Code',
      dataIndex: 'snippet',
      width: 240,
      render: (value) => (
        <code
          style={{
            display: 'inline-block',
            maxWidth: '100%',
            padding: '4px 8px',
            borderRadius: 6,
            background: 'var(--color-bg-surface)',
            color: 'var(--color-text-primary)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {String(value)}
        </code>
      ),
    },
    {
      key: 'note',
      title: 'Quote',
      dataIndex: 'note',
      width: 260,
      render: (value) => (
        <span
          style={{
            display: 'inline-block',
            maxWidth: '100%',
            paddingLeft: 10,
            borderLeft: 'var(--stroke-weight-bold) solid var(--color-border-default)',
            color: 'var(--color-text-secondary)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {String(value)}
        </span>
      ),
    },
    {
      key: 'link',
      title: 'Link',
      width: 150,
      render: (_, row) => (
        <Link href={String(row.href)} aria-label={`Open ${row.id}`}>
          <span
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}
          >
            <IconLink size={16} />
            Open report
          </span>
        </Link>
      ),
    },
    {
      key: 'actions',
      title: 'Actions',
      width: 144,
      render: (_, row) => (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          <Button
            type="text"
            size="small"
            shape="circle"
            aria-label={`Edit ${row.id}`}
          >
            <IconEdit size={16} />
          </Button>
          <Button
            type="text"
            size="small"
            shape="circle"
            aria-label={`Delete ${row.id}`}
          >
            <IconTrash03 size={16} />
          </Button>
          <Button
            type="text"
            size="small"
            shape="circle"
            aria-label={`More ${row.id}`}
          >
            <IconMoreHorizontal size={16} />
          </Button>
        </span>
      ),
    },
  ];

  return (
    <section style={{ maxWidth: 1040, margin: '0 auto', padding: '20px 0' }}>
      <Table
        columns={columns}
        data={data}
        rowKey="id"
        scrollConfig={{ x: 1120 }}
        bordered
      />
    </section>
  );
}
```

### 固定列与滚动

列数较多时，使用 `scrollConfig` 指定内容区域滚动区域，并通过 `fixed` 保持关键列可见。

```tsx preview
import { Table } from '@ve-design/react';

function TableFixedColumnsDemo() {
  const columns = [
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
    { key: 'runtime', title: 'Runtime', dataIndex: 'runtime', width: 130 },
    { key: 'cpu', title: 'CPU', dataIndex: 'cpu', width: 120 },
    { key: 'memory', title: 'Memory', dataIndex: 'memory', width: 120 },
    { key: 'version', title: 'Version', dataIndex: 'version', width: 150 },
    {
      key: 'status',
      title: 'Status',
      dataIndex: 'status',
      fixed: 'right',
      width: 150,
    },
  ];

  const data = [
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

  return (
    <section style={{ maxWidth: 1040, margin: '0 auto', padding: '20px 0' }}>
      <Table
        columns={columns}
        data={data}
        rowKey="id"
        scrollConfig={{ x: 1280, y: 288 }}
        bordered
        verticalLine
      />
    </section>
  );
}
```

### 加载态与空态

使用 `loading` 展示加载反馈；空数据时可使用默认空态或 `emptyContent` 自定义内容。

```tsx preview
import { Table } from '@ve-design/react';

function TableLoadingEmptyDemo() {
  const columns = [
    { key: 'alert', title: 'Alert', dataIndex: 'alert' },
    { key: 'severity', title: 'Severity', dataIndex: 'severity' },
    { key: 'source', title: 'Source', dataIndex: 'source' },
    { key: 'detectedAt', title: 'Detected At', dataIndex: 'detectedAt' },
  ];

  return (
    <section
      style={{
        display: 'grid',
        gap: 16,
        maxWidth: 860,
        margin: '0 auto',
        padding: '20px 0',
      }}
    >
      <Table columns={columns} loading bordered />
      <Table columns={columns} data={[]} bordered />
      <Table
        columns={columns}
        data={[]}
        bordered
        emptyContent={<span>No alerts match the current filter.</span>}
      />
    </section>
  );
}
```

## API

### Props

| 属性名         | 描述                                               | 类型                                             | 默认值      |
| -------------- | -------------------------------------------------- | ------------------------------------------------ | ----------- |
| `columns`      | 列配置。                                           | `TableColumn[]`                                  | `[]`        |
| `data`         | 数据源。                                           | `Record<string, unknown>[]`                      | `[]`        |
| `rowKey`       | 行唯一标识字段名。                                 | `string`                                         | `'id'`      |
| `loading`      | 是否展示加载骨架行。                               | `boolean`                                        | `false`     |
| `bordered`     | 是否展示表格外框。                                 | `boolean`                                        | `false`     |
| `verticalLine` | 是否展示列分割线。                                 | `boolean`                                        | `false`     |
| `hover`        | 是否启用行悬浮高亮。                               | `boolean`                                        | `true`      |
| `selectable`   | 是否启用行选择。                                   | `boolean`                                        | `false`     |
| `scrollConfig` | 内容区域滚动尺寸，`x` 控制横向，`y` 控制纵向滚动高度。 | `{ x?: number \| string; y?: number \| string }` | `undefined` |
| `emptyContent` | 空数据时展示的自定义内容。                         | `React.ReactNode`                                | `-`         |
| `children`     | 表格的子节点，通常用于扩展插槽内容。               | `React.ReactNode`                                | `-`         |

### TableColumn

| 属性名      | 描述                            | 类型                                                                            | 默认值      |
| ----------- | ------------------------------- | ------------------------------------------------------------------------------- | ----------- |
| `key`       | 列唯一标识。                    | `string`                                                                        | -           |
| `title`     | 表头内容或表头渲染函数。        | `string \| ((column: TableColumn) => unknown)`                                  | -           |
| `dataIndex` | 取值字段；未设置时使用 `key`。  | `string`                                                                        | `undefined` |
| `width`     | 列宽，单位为 px。               | `number`                                                                        | `undefined` |
| `minWidth`  | 最小列宽，单位为 px。           | `number`                                                                        | `undefined` |
| `maxWidth`  | 最大列宽，单位为 px。           | `number`                                                                        | `undefined` |
| `align`     | 单元格对齐方式。                | `'left' \| 'center' \| 'right'`                                                 | `undefined` |
| `sortable`  | 是否允许排序。                  | `boolean`                                                                       | `undefined` |
| `fixed`     | 固定列位置。                    | `'left' \| 'right'`                                                             | `undefined` |
| `wrap`      | 单元格内容是否换行。            | `boolean`                                                                       | `undefined` |
| `render`    | 自定义单元格，返回 React 节点。 | `(value: unknown, row: Record<string, unknown>, rowIndex: number) => ReactNode` | `undefined` |

### 事件

| 事件名              | 描述                               | 参数类型                                                                              |
| ------------------- | ---------------------------------- | ------------------------------------------------------------------------------------- |
| `onChange`          | 排序或选择状态变化时触发聚合事件。 | `CustomEvent<{ sortState: VeTableSortDetail \| null; selectedRowKeys: string[] }>`    |
| `onSortChange`      | 排序状态变化时触发。               | `CustomEvent<{ key: string; direction: 'asc' \| 'desc' } \| null>`                    |
| `onSelectionChange` | 行选择变化时触发。                 | `CustomEvent<{ selectedRowKeys: string[]; selectedRows: Record<string, unknown>[] }>` |
