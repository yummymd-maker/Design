`Pagination` 用于在列表、表格或结果集之间切换页码，支持总数展示、页容量选择、受控与非受控两种用法。

## 何时使用

- 数据需要按页展示，用户需要明确当前位置。
- 需要在页码前展示总条数，或允许用户调整每页条数。
- 不适合实时追加、持续滚动的内容流。

## 引入组件

```tsx
import { Pagination } from '@ve-design/react';
```

## 示例

### 基础用法

使用 `total` 和 `defaultCurrent` 设置非受控分页器。

```tsx preview
import { Pagination } from '@ve-design/react';

<section
  style={{
    display: 'grid',
    placeItems: 'center',
    minHeight: 160,
    padding: '32px 24px',
  }}
>
  <Pagination total={200} defaultCurrent={2} defaultPageSize={10} />
</section>;
```

### 总数和页容量

`showTotal` 展示总条数，`showPageSize` 展示页容量选择器。

```tsx preview
import { Pagination } from '@ve-design/react';

<section
  style={{
    display: 'grid',
    placeItems: 'center',
    minHeight: 180,
    padding: '32px 24px',
  }}
>
  <Pagination
    total={112}
    defaultCurrent={2}
    defaultPageSize={20}
    pageSizeOptions={[10, 20, 50, 100]}
    showTotal
    showPageSize
  />
</section>;
```

### 受控用法

设置 `current` 或 `pageSize` 后，需要在事件中回写新的状态。

```tsx preview
import { useState } from 'react';
import { Pagination } from '@ve-design/react';

function PaginationControlledDemo() {
  const [current, setCurrent] = useState(2);
  const [pageSize, setPageSize] = useState(10);

  return (
    <section
      style={{
        display: 'grid',
        placeItems: 'center',
        gap: 16,
        minHeight: 200,
        padding: '32px 24px',
      }}
    >
      <Pagination
        total={245}
        current={current}
        pageSize={pageSize}
        pageSizeOptions={[10, 20, 50]}
        showTotal
        showPageSize
        onChange={(event) => {
          setCurrent(event.detail.current);
        }}
        onPageSizeChange={(event) => {
          setCurrent(event.detail.current);
          setPageSize(event.detail.pageSize);
        }}
      />
      <output style={{ fontSize: 13, lineHeight: '20px', color: 'var(--color-text-tertiary)' }}>
        Page {current}, {pageSize} per page
      </output>
    </section>
  );
}
```

### 禁用状态

`disabled` 会禁用页码、上一页、下一页和页容量选择器。

```tsx preview
import { Pagination } from '@ve-design/react';

<section
  style={{
    display: 'grid',
    placeItems: 'center',
    minHeight: 160,
    padding: '32px 24px',
  }}
>
  <Pagination
    total={112}
    defaultCurrent={2}
    defaultPageSize={20}
    showTotal
    showPageSize
    disabled
  />
</section>;
```

### 自定义总数文案

`totalTemplate` 使用 `{total}` 作为总条数占位符。

```tsx preview
import { Pagination } from '@ve-design/react';

<section
  style={{
    display: 'grid',
    placeItems: 'center',
    minHeight: 160,
    padding: '32px 24px',
  }}
>
  <Pagination
    total={1280}
    defaultCurrent={6}
    defaultPageSize={20}
    showTotal
    totalTemplate="{total} runs"
  />
</section>;
```

## API

### Props

| 属性名            | 描述                                      | 类型                  | 默认值              |
| ----------------- | ----------------------------------------- | --------------------- | ------------------- |
| `current`         | 当前页码。设置后进入页码受控模式。        | `number \| undefined` | `undefined`         |
| `defaultCurrent`  | 非受控模式下的初始页码。                  | `number`              | `1`                 |
| `pageSize`        | 当前每页条数。设置后进入页容量受控模式。  | `number \| undefined` | `undefined`         |
| `defaultPageSize` | 非受控模式下的初始每页条数。              | `number`              | `10`                |
| `total`           | 数据总条数。                              | `number`              | `0`                 |
| `pageSizeOptions` | 页容量选项。                              | `number[]`            | `[10, 20, 50, 100]` |
| `showTotal`       | 是否展示总条数。                          | `boolean`             | `false`             |
| `showPageSize`    | 是否展示页容量选择器。                    | `boolean`             | `false`             |
| `totalTemplate`   | 总数文案模板，使用 `{total}` 作为占位符。 | `string`              | `'共 {total} 项'`   |
| `bufferSize`      | 当前页两侧保留的页码数量。                | `number`              | `2`                 |
| `disabled`        | 是否禁用分页器。                          | `boolean`             | `false`             |

### 事件

| 事件名             | 描述                     | 参数类型                                        |
| ------------------ | ------------------------ | ----------------------------------------------- |
| `onChange`         | 用户切换页码时触发。     | `CustomEvent<VePaginationChangeDetail>`         |
| `onPageSizeChange` | 用户切换每页条数时触发。 | `CustomEvent<VePaginationPageSizeChangeDetail>` |

```ts
export type PaginationChangeSource = 'page' | 'prev' | 'next';

export interface VePaginationChangeDetail {
  current: number;
  previousCurrent: number;
  pageSize: number;
  total: number;
  totalPages: number;
  source: PaginationChangeSource;
}

export interface VePaginationPageSizeChangeDetail {
  pageSize: number;
  previousPageSize: number;
  current: number;
  previousCurrent: number;
  total: number;
  totalPages: number;
}
```

### Ref

可通过 `ref` 调用组件实例上的 `focus()` 方法。
