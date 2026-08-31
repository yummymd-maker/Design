`ve-empty` 用于在无数据、无结果或内容尚未创建时展示统一反馈。组件默认提供插图和标题，也可以通过插槽替换插图、标题、说明和操作区。

## 何时使用

- 列表、表格、搜索结果没有可展示内容。
- 首次使用某个功能，需要引导用户创建内容或完成配置。
- 需要用统一版式展示空状态，并保留业务侧自定义内容的能力。

## 引入组件

```ts
import '@ve-design/web/ve-empty';
```

## 示例

### 基础用法

默认展示控制台插图和 `No Data` 标题。传入空的 `title` 插槽可以覆盖默认标题，仅展示说明内容。

```html preview
<script type="module">
  import '@ve-design/web/ve-empty';
</script>

<section
  style="display:grid; grid-template-columns:repeat(2, minmax(180px, max-content)); gap:32px; justify-content:center; justify-items:center; align-items:center; padding:32px"
>
  <ve-empty></ve-empty>
  <ve-empty>
    <span slot="title"></span>
    <span slot="description">No matching resources found.</span>
  </ve-empty>
</section>
```

### 标题和说明

使用 `title` 和 `description` 插槽设置主要文案。说明内容可以承载更完整的业务提示，并按需要换行。

```html preview
<script type="module">
  import '@ve-design/web/ve-empty';
</script>

<section
  style="display:grid; justify-items:center; align-items:center; padding:32px"
>
  <ve-empty>
    <span slot="title">No evaluation runs</span>
    <span slot="description">
      Run an evaluation after connecting a dataset.<br />
      Results will appear here with quality scores, latency, and trace details.
    </span>
  </ve-empty>
</section>
```

### 操作区

使用 `actions` 插槽放置后续操作。

```html preview
<script type="module">
  import '@ve-design/web/ve-button';
  import '@ve-design/web/ve-empty';
</script>

<section
  style="display:grid; justify-items:center; align-items:center; padding:32px"
>
  <ve-empty>
    <span slot="title">No agents yet</span>
    <span slot="description">
      Create an agent or import a template to start building workflows.
    </span>
    <div slot="actions" style="display:flex; gap:12px;">
      <ve-button type="secondary">Import template</ve-button>
      <ve-button type="primary">Create agent</ve-button>
    </div>
  </ve-empty>
</section>
```

### 自定义插图

使用 `image` 插槽替换默认插图。插图尺寸由传入内容自身控制。

```html preview
<script type="module">
  import '@ve-design/web/ve-empty';
  import '@ve-design/web/icons/database';
</script>

<section
  style="display:grid; justify-items:center; align-items:center; padding:32px"
>
  <ve-empty>
    <ve-icon
      slot="image"
      name="database"
      style="font-size:72px; color:var(--color-text-disable);"
    ></ve-icon>
    <span slot="title">No datasets</span>
    <span slot="description"
      >Connect a dataset before running batch analysis.</span
    >
  </ve-empty>
</section>
```

## API

### 属性

`ve-empty` 暂无自定义属性。

### 插槽

| 插槽名        | 说明                             |
| ------------- | -------------------------------- |
| `image`       | 自定义插图、图片或图标。         |
| `title`       | 自定义标题，默认值为 `No Data`。 |
| `description` | 自定义说明内容。                 |
| `actions`     | 操作区内容。                     |
| 默认插槽      | 兼容旧写法的说明内容。           |

### 事件

`ve-empty` 暂无自定义事件。

### 方法

`ve-empty` 暂无自定义方法。
