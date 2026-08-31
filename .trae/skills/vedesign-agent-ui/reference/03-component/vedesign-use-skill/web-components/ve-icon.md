`ve-icon` 是 VeDesign 的图标渲染组件，用于在按钮、导航、提示、状态和空状态等界面中展示图标。组件通过 `name` 渲染内置图标或已注册的自定义图标；内置图标会在首次使用对应名称时按需加载。

## 何时使用

- 需要在操作按钮、菜单项、状态提示或信息卡片中加入轻量视觉符号。
- 需要统一控制图标的尺寸、颜色和可访问名称。
- 需要通过同一个组件 API 使用 VeDesign 内置图标和业务自定义图标。
- 需要按需加载图标，避免在基础页面中一次性引入完整图标集。

## 引入组件

### 基础引入

大多数场景只需要引入 `ve-icon` 组件，然后通过 `name` 指定图标名称。

```ts
import '@ve-design/web/ve-icon';
```

```html
<ve-icon name="search"></ve-icon>
```

### 预加载图标

`ve-icon` 会自动懒加载内置图标。只有在希望提前完成注册、避免首次渲染等待时，才需要显式导入单个图标入口。

```ts
import '@ve-design/web/ve-icon';
import '@ve-design/web/icons/search';
```

需要一次性预注册所有内置图标时，可以引入完整图标入口。该方式更适合图标总览、离线渲染或对首屏图标加载时机有强约束的页面。

```ts
import '@ve-design/web/ve-icon';
import '@ve-design/web/icons';
```

## 内置图标

下方展示当前包内置的全部图标。可以搜索图标名称，并复制 SVG 或组件用法。

<IconGallery />

## 示例

### 基础用法

设置 `name` 后，组件会从内置图标列表或当前注册表中解析图标。如果名称不存在，组件不会渲染任何内容。

```html preview
<script type="module">
  import '@ve-design/web/ve-icon';
</script>

<section style="display: flex; align-items: center; gap: 16px; padding: 16px;">
  <ve-icon name="search"></ve-icon>
  <ve-icon name="add"></ve-icon>
  <ve-icon name="settings"></ve-icon>
</section>
```

### 动态图标名称

当图标名称来自配置、接口数据或用户选择时，仍然通过 `name` 属性动态渲染。

```html preview
<script type="module">
  import '@ve-design/web/ve-icon';
</script>

<section style="display: flex; align-items: center; gap: 16px; padding: 16px;">
  <ve-icon id="dynamic-icon" name="search"></ve-icon>
  <ve-icon name="add"></ve-icon>
  <ve-icon name="settings"></ve-icon>
</section>

<script>
  document.getElementById('dynamic-icon').name = 'search';
</script>
```

### 图标尺寸

`size` 支持数字和 CSS 长度。纯数字会按 px 处理，也可以传入 `em`、`rem` 或自定义 CSS 长度。

```html preview
<script type="module">
  import '@ve-design/web/ve-icon';
</script>

<section style="display: flex; align-items: center; gap: 18px; padding: 16px;">
  <ve-icon name="search" size="16"></ve-icon>
  <ve-icon name="search" size="24"></ve-icon>
  <ve-icon name="search" size="32"></ve-icon>
  <span style="font-size: 28px;">
    <ve-icon name="search" size="1em"></ve-icon>
  </span>
</section>
```

### 图标颜色

内置单色图标使用 `currentColor`，会继承自身或父元素的文字颜色。文件类型、状态等多色图标会保留 SVG 原始颜色。

```html preview
<script type="module">
  import '@ve-design/web/ve-icon';
</script>

<section style="display: flex; align-items: center; gap: 16px; padding: 16px;">
  <ve-icon name="search" size="28" style="color: #165dff;"></ve-icon>
  <ve-icon name="success" size="28" style="color: #00b42a;"></ve-icon>
  <span style="color: #f53f3f;">
    <ve-icon name="warning" size="28"></ve-icon>
  </span>
  <ve-icon name="type-pdf-state-default" size="36"></ve-icon>
</section>
```

### 可访问名称

图标默认按装饰性内容处理。图标本身承载语义时，使用 `label` 提供可访问名称；仅辅助文本或按钮含义时，不需要设置 `label`。

```html preview
<script type="module">
  import '@ve-design/web/ve-icon';
  import '@ve-design/web/ve-button';
</script>

<section style="display: flex; align-items: center; gap: 12px; padding: 16px;">
  <ve-icon name="success" label="Completed" size="24" style="color: #00b42a;"></ve-icon>

  <ve-button type="primary">
    <ve-icon name="add"></ve-icon>
    Create
  </ve-button>

  <ve-button shape="circle" aria-label="Search">
    <ve-icon name="search"></ve-icon>
  </ve-button>
</section>
```

### 和按钮组合

图标放在按钮中时会继承按钮文字颜色，适合用于操作入口、图标按钮和状态操作。

```html preview
<script type="module">
  import '@ve-design/web/ve-icon';
  import '@ve-design/web/ve-button';
</script>

<section style="display: flex; align-items: center; gap: 12px; padding: 16px;">
  <ve-button type="primary">
    <ve-icon name="add"></ve-icon>
    New task
  </ve-button>
  <ve-button type="outline">
    <ve-icon name="refresh"></ve-icon>
    Refresh
  </ve-button>
  <ve-button shape="circle" aria-label="Settings">
    <ve-icon name="settings"></ve-icon>
  </ve-button>
</section>
```

### 自定义图标

业务图标通过完整 SVG 字符串注册。注册后即可像内置图标一样通过 `name` 使用。

```html preview
<script type="module">
  import '@ve-design/web/ve-icon';
  import { registerIcon } from '@ve-design/web/ve-icon';

  registerIcon({
    name: 'agent-status',
    svg: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 3L20 7.5V16.5L12 21L4 16.5V7.5L12 3Z" fill="currentColor"/><path d="M12 8V12L15 14" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  });
</script>

<section style="display: flex; align-items: center; gap: 12px; padding: 16px;">
  <ve-icon name="agent-status" size="28" style="color: #00b42a;"></ve-icon>
  <span>Agent ready</span>
</section>
```

从 SVG 文件导入时，推荐使用构建工具的 raw 导入能力：

```ts
import '@ve-design/web/ve-icon';
import { registerIcon } from '@ve-design/web/ve-icon';
import brandLogoSvg from './brand-logo.svg?raw';

registerIcon({
  name: 'brand-logo',
  svg: brandLogoSvg,
});
```

`registerIcon` 会从传入内容中提取第一个完整的 `<svg>...</svg>`。只传 `<path>` 不会被接受。由于 SVG 会作为标记插入组件内容中，注册时只应传入可信来源的 SVG。

### 批量注册自定义图标

需要维护业务图标集合时，可以使用 `registerIcons` 批量注册。

```ts
import '@ve-design/web/ve-icon';
import { registerIcons } from '@ve-design/web/ve-icon';

registerIcons([
  {
    name: 'brand-logo',
    svg: brandLogoSvg,
  },
  {
    name: 'agent-status',
    svg: agentStatusSvg,
  },
]);
```

## API

### ve-icon 属性

| 属性    | 描述                                                 | 类型               | 默认值 |
| ------- | ---------------------------------------------------- | ------------------ | ------ |
| `name`  | 图标名称。可以是内置图标名称，也可以是已注册图标名称。 | `string`           | `''`   |
| `label` | 图标本身有语义时的可访问名称；未设置时图标视为装饰。 | `string`           | `''`   |
| `size`  | 图标尺寸。纯数字会按 px 处理，也可传入 CSS 长度。    | `number \| string` | `''`   |

### 事件

`ve-icon` 不派发专有事件。需要交互时，通常将图标放入 `ve-button`、链接或其他可交互组件中。

### 方法

`ve-icon` 不暴露专有公开方法。

### 插槽

`ve-icon` 不提供插槽。图标内容来自内置图标或注册表中的 SVG。

### CSS Parts

| Part   | 描述                    |
| ------ | ----------------------- |
| `icon` | 包裹实际 SVG 的图标容器。 |

### 图标工具

| 名称                     | 导入路径                                      | 描述                                             |
| ------------------------ | --------------------------------------------- | ------------------------------------------------ |
| `getBuiltInIconNames`    | `@ve-design/web/ve-icon` 或 `@ve-design/web/icons` | 获取全部内置图标名称列表。                       |
| `registerIcon`           | `@ve-design/web/ve-icon` 或 `@ve-design/web/icons` | 注册单个自定义图标。                             |
| `registerIcons`          | `@ve-design/web/ve-icon` 或 `@ve-design/web/icons` | 批量注册自定义图标。                             |
| `unregisterIcon`         | `@ve-design/web/ve-icon` 或 `@ve-design/web/icons` | 从注册表中移除指定图标。                         |
| `hasIcon`                | `@ve-design/web/ve-icon` 或 `@ve-design/web/icons` | 判断图标是否已经注册。                           |
| `getRegisteredIconNames` | `@ve-design/web/ve-icon` 或 `@ve-design/web/icons` | 获取当前注册表中的图标名称。                     |
| `loadIcon`               | `@ve-design/web/icons`                         | 按名称加载并注册一个内置图标。                   |
| `loadIcons`              | `@ve-design/web/icons`                         | 批量加载并注册内置图标。                         |
| `loadAllIcons`           | `@ve-design/web/icons`                         | 加载并注册全部内置图标。                         |
| `isBuiltInIconName`      | `@ve-design/web/icons`                         | 判断字符串是否为内置图标名称。                   |

### 类型

| 名称                  | 导入路径                                      | 描述                         |
| --------------------- | --------------------------------------------- | ---------------------------- |
| `IconName`            | `@ve-design/web/ve-icon` 或 `@ve-design/web/icons` | 内置图标名称联合类型。       |
| `IconDefinition`      | `@ve-design/web/ve-icon` 或 `@ve-design/web/icons` | 图标定义对象类型。           |
| `RegisterIconOptions` | `@ve-design/web/ve-icon` 或 `@ve-design/web/icons` | 注册选项，支持 `override`。  |
