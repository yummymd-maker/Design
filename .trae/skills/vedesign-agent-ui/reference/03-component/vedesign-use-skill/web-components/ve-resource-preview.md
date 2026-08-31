`ve-resource-preview` 用于展示图片和视频资源，提供缩略预览、视频播放控制、卡片下载入口和内置大预览。<br />
`ve-resource-preview-group` 用于排列多个资源，并在共享大预览中切换上一项或下一项。

## 何时使用

- 在消息附件、生成结果、素材列表中展示图片或视频。
- 需要点击缩略图进入大预览，并支持图片或视频缩放。
- 多个资源需要统一排列，并在同一个预览层中切换查看。

## 引入组件

```ts
import '@ve-design/web/ve-resource-preview';
```

## 示例

### 基础用法

```html preview
<script type="module">
  import '@ve-design/web/ve-resource-preview';
</script>

<section style="display:flex; justify-content:center; padding:24px;">
  <ve-resource-preview
    type="image"
    name="light.png"
    tip="AI 生成"
    src="https://lf3-static.bytednsdoc.com/obj/eden-cn/nuvzubfnups/ve-design-web/glacier-peak-light-streaks.webp"
  ></ve-resource-preview>
</section>
```

### 视频预览

视频资源支持 `poster` 封面和 `preload` 预加载策略。视频元数据加载完成后，预览区域会按真实视频比例展示。视频卡片与大预览的留白区域使用恒定深色背景，暗黑模式下不会随 `--color-bg-inverse` 翻转为浅色。

```html preview
<script type="module">
  import '@ve-design/web/ve-resource-preview';
</script>

<section style="display:flex; justify-content:center; padding:24px;">
  <ve-resource-preview
    type="video"
    name="flower.mp4"
    tip="AI 生成"
    poster="https://lf3-static.bytednsdoc.com/obj/eden-cn/nuvzubfnups/ve-design-web/blue-orange-light-waterfall.webp"
    src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
    preload="metadata"
  ></ve-resource-preview>
</section>
```

### 分组预览

点击分组中的任意资源后，会打开共享大预览，并显示上一项、下一项和页码。

```html preview
<script type="module">
  import '@ve-design/web/ve-resource-preview';
</script>

<section style="display:flex; justify-content:center; padding:24px;">
  <ve-resource-preview-group
    gap="small"
    style="display:flex; justify-content:center;"
  >
    <ve-resource-preview
      type="image"
      name="light.png"
      src="https://lf3-static.bytednsdoc.com/obj/eden-cn/nuvzubfnups/ve-design-web/glacier-peak-light-streaks.webp"
    ></ve-resource-preview>
    <ve-resource-preview
      type="image"
      name="iceberg.png"
      src="https://lf3-static.bytednsdoc.com/obj/eden-cn/nuvzubfnups/ve-design-web/iridescent-mountain-peak-clouds.webp"
    ></ve-resource-preview>
    <ve-resource-preview
      type="image"
      name="cat.png"
      src="https://lf3-static.bytednsdoc.com/obj/eden-cn/nuvzubfnups/ve-design-web/pixel-stretch-mountain-night.webp"
    ></ve-resource-preview>
    <ve-resource-preview
      type="video"
      name="flower.mp4"
      poster="https://lf3-static.bytednsdoc.com/obj/eden-cn/nuvzubfnups/ve-design-web/blue-orange-light-waterfall.webp"
      src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
    ></ve-resource-preview>
  </ve-resource-preview-group>
</section>
```

### 禁用预览与隐藏下载

```html preview
<script type="module">
  import '@ve-design/web/ve-resource-preview';
</script>

<section
  style="display:flex; justify-content:center; gap:24px; flex-wrap:wrap; padding:24px;"
>
  <ve-resource-preview
    type="image"
    name="preview-disabled.png"
    preview-disabled
    src="https://lf3-static.bytednsdoc.com/obj/eden-cn/nuvzubfnups/ve-design-web/glacier-peak-light-streaks.webp"
  ></ve-resource-preview>

  <ve-resource-preview
    type="image"
    name="download-hidden.png"
    hide-download
    src="https://lf3-static.bytednsdoc.com/obj/eden-cn/nuvzubfnups/ve-design-web/iridescent-mountain-peak-clouds.webp"
  ></ve-resource-preview>
</section>
```

### 不换行横向滚动

添加 `no-wrap` 后，资源卡保持单行排列，内容超出容器宽度时在分组内容横向滚动。

```html preview
<script type="module">
  import '@ve-design/web/ve-resource-preview';
</script>

<section style="display:flex; justify-content:center; padding:24px;">
  <div style="max-width:640px; overflow:hidden;">
    <ve-resource-preview-group gap="medium" no-wrap>
      <ve-resource-preview
        type="image"
        name="light.png"
        src="https://lf3-static.bytednsdoc.com/obj/eden-cn/nuvzubfnups/ve-design-web/glacier-peak-light-streaks.webp"
      ></ve-resource-preview>
      <ve-resource-preview
        type="image"
        name="iceberg.png"
        src="https://lf3-static.bytednsdoc.com/obj/eden-cn/nuvzubfnups/ve-design-web/iridescent-mountain-peak-clouds.webp"
      ></ve-resource-preview>
      <ve-resource-preview
        type="image"
        name="cat.png"
        src="https://lf3-static.bytednsdoc.com/obj/eden-cn/nuvzubfnups/ve-design-web/pixel-stretch-mountain-night.webp"
      ></ve-resource-preview>
      <ve-resource-preview
        type="image"
        name="snow.png"
        src="https://lf3-static.bytednsdoc.com/obj/eden-cn/nuvzubfnups/ve-design-web/rainbow-light-columns-coral.webp"
      ></ve-resource-preview>
    </ve-resource-preview-group>
  </div>
</section>
```

### 事件与方法

```html preview
<script type="module">
  import '@ve-design/web/ve-button';
  import '@ve-design/web/ve-resource-preview';
</script>

<section
  style="display:grid; justify-items:center; gap:12px; padding:24px; text-align:center;"
>
  <ve-resource-preview
    id="resource-preview-method-demo"
    type="image"
    name="method-demo.png"
    src="https://lf3-static.bytednsdoc.com/obj/eden-cn/nuvzubfnups/ve-design-web/iridescent-mountain-peak-clouds.webp"
  ></ve-resource-preview>

  <div style="display:flex; justify-content:center; gap:8px; flex-wrap:wrap;">
    <ve-button id="resource-preview-open" type="primary">打开预览</ve-button>
    <ve-button id="resource-preview-read" type="secondary">
      读取资源信息
    </ve-button>
  </div>

  <code id="resource-preview-method-log" style="color:#595863;"> Ready </code>
</section>

<script>
  const preview = document.getElementById('resource-preview-method-demo');
  const openButton = document.getElementById('resource-preview-open');
  const readButton = document.getElementById('resource-preview-read');
  const log = document.getElementById('resource-preview-method-log');

  preview.addEventListener('ve-download', (event) => {
    event.preventDefault();
    log.textContent = `download cancelled: ${event.detail.item.name}`;
  });

  openButton.addEventListener('click', () => {
    preview.openPreview();
  });

  readButton.addEventListener('click', () => {
    const item = preview.getResourceItem();
    log.textContent = `${item.type}: ${item.name}`;
  });
</script>
```

## API

### ve-resource-preview 属性

| 属性名             | 描述                                                      | 类型                             | 默认值       |
| ------------------ | --------------------------------------------------------- | -------------------------------- | ------------ |
| `type`             | 资源类型。非法值会回退为 `image`。                        | `'image' \| 'video'`             | `'image'`    |
| `src`              | 资源地址。为空时不触发内置预览，且不会展示下载入口。      | `string`                         | `''`         |
| `name`             | 文件名称，用于预览标题、图片替代文本和下载文件名兜底。    | `string`                         | `''`         |
| `tip`              | 显示在图片或视频左上角的提示角标。                        | `string`                         | `''`         |
| `poster`           | 视频封面地址，仅对 `type="video"` 生效。                  | `string`                         | `''`         |
| `preload`          | 视频预加载策略。非法值会回退为 `metadata`。               | `'none' \| 'metadata' \| 'auto'` | `'metadata'` |
| `preview-disabled` | 是否禁用内置大预览。                                      | `boolean`                        | `false`      |
| `hide-download`    | 是否隐藏卡片下载按钮；HTML 标准布尔属性语义，存在即隐藏。 | `boolean`                        | `false`      |

### ve-resource-preview 事件

| 事件名             | 描述                                                                 | 参数类型                                                                                                           |
| ------------------ | -------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `ve-preview`       | 点击或键盘触发大预览前触发，可通过 `preventDefault()` 阻止内置预览。 | `CustomEvent<{ item: ResourcePreviewItem; source: VeResourcePreviewElement; nativeEvent: Event \| null }>`         |
| `ve-download`      | 点击下载前触发，可通过 `preventDefault()` 阻止默认下载。             | `CustomEvent<{ item: ResourcePreviewItem; source: VeResourcePreviewElement \| null; nativeEvent: Event \| null }>` |
| `ve-preview-close` | 内置大预览关闭时触发。                                               | `CustomEvent<{ item: ResourcePreviewItem \| null; source: VeResourcePreviewElement \| null }>`                     |

### ve-resource-preview 方法

| 方法名              | 描述                                                                        |
| ------------------- | --------------------------------------------------------------------------- |
| `getResourceItem()` | 返回标准化资源描述。                                                        |
| `openPreview()`     | 打开内置大预览层；当 `preview-disabled` 为 `true` 或 `src` 为空时不会打开。 |
| `closePreview()`    | 关闭内置大预览层。                                                          |

### ResourcePreviewItem 类型

| 属性名         | 描述             | 类型                             |
| -------------- | ---------------- | -------------------------------- |
| `type`         | 资源类型。       | `'image' \| 'video'`             |
| `src`          | 资源地址。       | `string`                         |
| `name`         | 文件名称。       | `string`                         |
| `tip`          | 提示角标文案。   | `string`                         |
| `poster`       | 视频封面地址。   | `string`                         |
| `preload`      | 视频预加载策略。 | `'none' \| 'metadata' \| 'auto'` |
| `downloadable` | 是否允许下载。   | `boolean`                        |

### ve-resource-preview-group 属性

| 属性名    | 描述                                                                     | 类型                             | 默认值     |
| --------- | ------------------------------------------------------------------------ | -------------------------------- | ---------- |
| `gap`     | 子资源卡之间的间距；枚举值映射到主题间距 Token。                         | `'small' \| 'medium' \| 'large'` | `'medium'` |
| `no-wrap` | 是否禁止换行；默认允许自动换行，存在该属性时保持单行并在溢出时横向滚动。 | `boolean`                        | `false`    |

### ve-resource-preview-group 事件

| 事件名                   | 描述                             | 参数类型                                                                                                             |
| ------------------------ | -------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| `ve-preview-change`      | 共享大预览打开或切换资源时触发。 | `CustomEvent<{ item: ResourcePreviewItem; index: number; total: number; source: VeResourcePreviewElement \| null }>` |
| `ve-preview-group-close` | 共享大预览关闭时触发。           | `CustomEvent<{ item: ResourcePreviewItem \| null; source: VeResourcePreviewElement \| null }>`                       |
| `ve-download`            | 点击分组内资源下载前触发，可通过 `preventDefault()` 阻止默认下载。 | `CustomEvent<{ item: ResourcePreviewItem; source: VeResourcePreviewElement \| null; nativeEvent: Event \| null }>` |

### ve-resource-preview-group 插槽

| 插槽名    | 描述                                                                                        |
| --------- | ------------------------------------------------------------------------------------------- |
| `default` | 放置多个 `ve-resource-preview`。非 `ve-resource-preview` 子元素不会参与共享大预览数据收集。 |
