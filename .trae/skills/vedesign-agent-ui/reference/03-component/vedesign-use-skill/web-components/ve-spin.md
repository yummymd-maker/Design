`ve-spin` 用于展示内容加载、接口请求、页面初始化或局部刷新中的轻量反馈。组件始终表达加载中状态，默认展示内置加载图标，也支持设置提示文案或通过插槽替换 loading 图标。

## 何时使用

- 页面、卡片、列表或表格正在初始化、刷新或等待接口返回。
- AI Agent 正在同步上下文、生成草稿、执行工具调用或重建结果。
- 需要通过横向或纵向排布适配紧凑工具栏、空白容器、卡片中心态等不同空间。
- 需要在保持统一排版和文本样式的同时替换加载图标。

## 引入组件

```ts
import '@ve-design/web/ve-spin';
```

## 示例

### 基础用法

默认展示内置加载图标和 `default` 尺寸。使用 `tip` 设置提示文案。

```html preview
<script type="module">
  import '@ve-design/web/ve-spin';
</script>

<section
  style="display:flex; flex-wrap:wrap; gap:28px; justify-content:center; align-items:center; padding:32px"
>
  <ve-spin></ve-spin>
  <ve-spin tip="加载中"></ve-spin>
  <ve-spin tip="Syncing workspace"></ve-spin>
</section>
```

### 尺寸和排布

使用 `size` 设置加载图标和文案尺寸，使用 `direction` 设置图标与文案的排列方向。

```html preview
<script type="module">
  import '@ve-design/web/ve-spin';
</script>

<section
  style="display:grid; grid-template-columns:repeat(3, 120px); gap:28px 24px; justify-content:center; justify-items:center; align-items:center; padding:32px"
>
  <ve-spin size="small" tip="加载中"></ve-spin>
  <ve-spin size="default" tip="加载中"></ve-spin>
  <ve-spin size="large" tip="加载中"></ve-spin>

  <ve-spin size="small" direction="vertical" tip="加载中"></ve-spin>
  <ve-spin size="default" direction="vertical" tip="加载中"></ve-spin>
  <ve-spin size="large" direction="vertical" tip="加载中"></ve-spin>
</section>
```

### 自定义 loading 图标

使用 `icon` 插槽替换默认 loading 图标。自定义图标默认跟随 `ve-spin` 的 `size` 尺寸并自动旋转；如果图标自身已经带有动画，或业务侧需要静态图标，可以设置 `auto-rotate="false"` 关闭组件提供的旋转动画。

```html preview
<script type="module">
  import '@ve-design/web/ve-icon';
  import '@ve-design/web/ve-spin';
  import '@ve-design/web/icons/loading-progress';
</script>

<style>
  .spin-doc-pulse-icon {
    width: 10px;
    height: 10px;
    border-radius: 999px;
    background: var(--color-text-primary);
    box-shadow:
      14px 0 0 var(--color-text-tertiary),
      28px 0 0 var(--color-text-disable);
    animation: spin-doc-pulse 0.9s ease-in-out infinite alternate;
  }

  @keyframes spin-doc-pulse {
    from {
      opacity: 0.45;
      transform: translateX(0);
    }

    to {
      opacity: 1;
      transform: translateX(2px);
    }
  }
</style>

<section
  style="display:flex; flex-wrap:wrap; gap:32px; justify-content:center; align-items:center; padding:32px"
>
  <ve-spin size="large" tip="任务加载中，请稍后..." direction="vertical">
    <ve-icon slot="icon" name="loading-progress"></ve-icon>
  </ve-spin>

  <ve-spin
    auto-rotate="false"
    direction="vertical"
    size="large"
    tip="Analyzing traces"
  >
    <span slot="icon" class="spin-doc-pulse-icon"></span>
  </ve-spin>
</section>
```

## API

### 属性

| 属性名        | 描述                               | 类型                              | 默认值         |
| ------------- | ---------------------------------- | --------------------------------- | -------------- |
| `size`        | 加载尺寸。                         | `'small' \| 'default' \| 'large'` | `'default'`    |
| `direction`   | 图标和提示文案的排列方向。         | `'horizontal' \| 'vertical'`      | `'horizontal'` |
| `auto-rotate` | 是否自动旋转 loading 图标。        | `boolean`                         | `true`         |
| `tip`         | 提示文案。为空字符串时仅展示图标。 | `string`                          | `''`           |

### 插槽

| 插槽名 | 说明             |
| ------ | ---------------- |
| `icon` | 自定义加载图标。 |

### 事件

`ve-spin` 暂无自定义事件。

### 方法

`ve-spin` 暂无自定义方法。
