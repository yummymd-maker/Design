`ve-pagination` 用于在列表、表格或结果集之间切换页码，支持总数展示、页容量选择、受控与非受控两种用法。

## 何时使用

- 数据需要按页展示，用户需要明确当前位置。
- 需要在页码前展示总条数，或允许用户调整每页条数。
- 不适合实时追加、持续滚动的内容流。

## 引入组件

```ts
import '@ve-design/web/ve-pagination';
```

## 示例

### 基础用法

使用 `total` 和 `default-current` 设置非受控分页器。

```html preview
<script type="module">
  import '@ve-design/web/ve-pagination';
</script>

<section style="display: grid; place-items: center; min-height: 160px; padding: 32px 24px;">
  <ve-pagination
    total="200"
    default-current="2"
    default-page-size="10"
  ></ve-pagination>
</section>
```

### 总数和页容量

`show-total` 展示总条数，`show-page-size` 展示页容量选择器。

```html preview
<script type="module">
  import '@ve-design/web/ve-pagination';
</script>

<section style="display: grid; place-items: center; min-height: 180px; padding: 32px 24px;">
  <ve-pagination
    total="112"
    default-current="2"
    default-page-size="20"
    page-size-options="10,20,50,100"
    show-total
    show-page-size
  ></ve-pagination>
</section>
```

### 受控用法

设置 `current` 或 `page-size` 后，需要在事件中回写新的状态。

```html preview
<script type="module">
  import '@ve-design/web/ve-pagination';
</script>

<section style="display: grid; place-items: center; gap: 16px; min-height: 200px; padding: 32px 24px;">
  <ve-pagination
    id="pagination-controlled-demo"
    total="245"
    current="2"
    page-size="10"
    page-size-options="10,20,50"
    show-total
    show-page-size
  ></ve-pagination>
  <output
    id="pagination-controlled-log"
    style="font-size: 13px; line-height: 20px; color: var(--color-text-tertiary);"
  >
    Page 2, 10 per page
  </output>
</section>

<script>
  const pagination = document.getElementById('pagination-controlled-demo');
  const log = document.getElementById('pagination-controlled-log');
  const state = {
    current: 2,
    pageSize: 10,
  };

  function syncPagination() {
    pagination.current = state.current;
    pagination.pageSize = state.pageSize;
    log.textContent = `Page ${state.current}, ${state.pageSize} per page`;
  }

  pagination.addEventListener('ve-change', (event) => {
    state.current = event.detail.current;
    syncPagination();
  });

  pagination.addEventListener('ve-page-size-change', (event) => {
    state.current = event.detail.current;
    state.pageSize = event.detail.pageSize;
    syncPagination();
  });
</script>
```

### 禁用状态

`disabled` 会禁用页码、上一页、下一页和页容量选择器。

```html preview
<script type="module">
  import '@ve-design/web/ve-pagination';
</script>

<section style="display: grid; place-items: center; min-height: 160px; padding: 32px 24px;">
  <ve-pagination
    total="112"
    default-current="2"
    default-page-size="20"
    show-total
    show-page-size
    disabled
  ></ve-pagination>
</section>
```

### 自定义总数文案

`total-template` 使用 `{total}` 作为总条数占位符。

```html preview
<script type="module">
  import '@ve-design/web/ve-pagination';
</script>

<section style="display: grid; place-items: center; min-height: 160px; padding: 32px 24px;">
  <ve-pagination
    total="1280"
    default-current="6"
    default-page-size="20"
    show-total
    total-template="{total} runs"
  ></ve-pagination>
</section>
```

## 状态规则

- 未设置 `current` 和 `page-size` 时，组件自行维护页码和页容量。
- 设置 `current` 或 `page-size` 后，对应状态进入受控模式，需要监听事件并回写属性。
- `current` 会被限制在 `1` 到总页数之间。
- 切换页容量后，如果当前页超过新的总页数，会自动收敛到最后一页。

## API

### 属性

| 属性名 | 描述 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `current` | 当前页码。设置后进入页码受控模式。 | `number \| undefined` | `undefined` |
| `default-current` | 非受控模式下的初始页码。 | `number` | `1` |
| `page-size` | 当前每页条数。设置后进入页容量受控模式。 | `number \| undefined` | `undefined` |
| `default-page-size` | 非受控模式下的初始每页条数。 | `number` | `10` |
| `total` | 数据总条数。 | `number` | `0` |
| `page-size-options` | 页容量选项。HTML attribute 支持 `10,20,50,100` 或 JSON 数组字符串；JS property 支持 `number[]`。 | `number[]` | `[10, 20, 50, 100]` |
| `show-total` | 是否展示总条数。 | `boolean` | `false` |
| `show-page-size` | 是否展示页容量选择器。 | `boolean` | `false` |
| `total-template` | 总数文案模板，使用 `{total}` 作为占位符。 | `string` | `'共 {total} 项'` |
| `buffer-size` | 当前页两侧保留的页码数量。 | `number` | `2` |
| `disabled` | 是否禁用分页器。 | `boolean` | `false` |

### 事件

| 事件名 | 描述 | 参数类型 |
| --- | --- | --- |
| `ve-change` | 用户切换页码时触发。 | `CustomEvent<VePaginationChangeDetail>` |
| `ve-page-size-change` | 用户切换每页条数时触发。 | `CustomEvent<VePaginationPageSizeChangeDetail>` |

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

### 方法

| 方法名 | 描述 | 类型 |
| --- | --- | --- |
| `focus()` | 聚焦当前页按钮；如果当前页按钮不存在，则聚焦第一个可操作按钮。 | `(options?: FocusOptions) => void` |

### 插槽

当前版本不暴露插槽。
