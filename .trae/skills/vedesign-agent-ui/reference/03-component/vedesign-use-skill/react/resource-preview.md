`ResourcePreview` 用于展示图片和视频资源，支持缩略预览、视频播放控制、下载动作和内置大预览。<br />
`ResourcePreviewGroup` 用于排列多个资源，并在共享大预览中切换上一项或下一项。

## 何时使用

- 在消息附件、生成结果、素材列表中展示图片或视频。
- 需要点击缩略图进入大预览，并支持图片或视频缩放。
- 多个资源需要统一排列，并在同一个预览层中切换查看。

## 引入组件

```tsx
import {
  ResourcePreview,
  ResourcePreviewGroup,
} from '@ve-design/react';
```

## 示例

### 基础用法

```tsx preview
import { ResourcePreview } from '@ve-design/react';

<section style={{ display: 'flex', justifyContent: 'center', padding: 24 }}>
  <ResourcePreview
    type="image"
    name="light.png"
    tip="AI 生成"
    src="https://lf3-static.bytednsdoc.com/obj/eden-cn/nuvzubfnups/ve-design-web/glacier-peak-light-streaks.webp"
  />
</section>;
```

### 视频预览

视频资源支持 `poster` 封面和 `preload` 预加载策略。视频卡片与大预览的留白区域继承 Web Component 的恒定深色背景，暗黑模式下不会随 `--color-bg-inverse` 翻转为浅色。

```tsx preview
import { ResourcePreview } from '@ve-design/react';

<section style={{ display: 'flex', justifyContent: 'center', padding: 24 }}>
  <ResourcePreview
    type="video"
    name="flower.mp4"
    tip="AI 生成"
    poster="https://lf3-static.bytednsdoc.com/obj/eden-cn/nuvzubfnups/ve-design-web/blue-orange-light-waterfall.webp"
    src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
    preload="metadata"
  />
</section>;
```

### 分组预览

点击分组中的任意资源后，会打开共享大预览，并显示上一项、下一项和页码。

```tsx preview
import {
  ResourcePreview,
  ResourcePreviewGroup,
} from '@ve-design/react';

<section style={{ display: 'flex', justifyContent: 'center', padding: 24 }}>
  <ResourcePreviewGroup gap="small" style={{ justifyContent: 'center' }}>
    <ResourcePreview
      type="image"
      name="light.png"
      src="https://lf3-static.bytednsdoc.com/obj/eden-cn/nuvzubfnups/ve-design-web/glacier-peak-light-streaks.webp"
    />
    <ResourcePreview
      type="image"
      name="iceberg.png"
      src="https://lf3-static.bytednsdoc.com/obj/eden-cn/nuvzubfnups/ve-design-web/iridescent-mountain-peak-clouds.webp"
    />
    <ResourcePreview
      type="image"
      name="cat.png"
      src="https://lf3-static.bytednsdoc.com/obj/eden-cn/nuvzubfnups/ve-design-web/pixel-stretch-mountain-night.webp"
    />
    <ResourcePreview
      type="video"
      name="flower.mp4"
      poster="https://lf3-static.bytednsdoc.com/obj/eden-cn/nuvzubfnups/ve-design-web/blue-orange-light-waterfall.webp"
      src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
    />
  </ResourcePreviewGroup>
</section>;
```

### 禁用预览与隐藏下载

使用 `previewDisabled` 禁用内置大预览，使用 `hideDownload` 隐藏卡片下载按钮。

```tsx preview
import { ResourcePreview } from '@ve-design/react';

<section
  style={{
    display: 'flex',
    justifyContent: 'center',
    gap: 24,
    flexWrap: 'wrap',
    padding: 24,
  }}
>
  <ResourcePreview
    type="image"
    name="preview-disabled.png"
    previewDisabled
    src="https://lf3-static.bytednsdoc.com/obj/eden-cn/nuvzubfnups/ve-design-web/glacier-peak-light-streaks.webp"
  />

  <ResourcePreview
    type="image"
    name="download-hidden.png"
    hideDownload
    src="https://lf3-static.bytednsdoc.com/obj/eden-cn/nuvzubfnups/ve-design-web/iridescent-mountain-peak-clouds.webp"
  />
</section>;
```

### 不换行横向滚动

添加 `noWrap` 后，资源卡保持单行排列，内容超出容器宽度时在分组内容横向滚动。

```tsx preview
import {
  ResourcePreview,
  ResourcePreviewGroup,
} from '@ve-design/react';

<section style={{ display: 'flex', justifyContent: 'center', padding: 24 }}>
  <div style={{ maxWidth: 640, overflow: 'hidden' }}>
    <ResourcePreviewGroup gap="medium" noWrap>
      <ResourcePreview
        type="image"
        name="light.png"
        src="https://lf3-static.bytednsdoc.com/obj/eden-cn/nuvzubfnups/ve-design-web/glacier-peak-light-streaks.webp"
      />
      <ResourcePreview
        type="image"
        name="iceberg.png"
        src="https://lf3-static.bytednsdoc.com/obj/eden-cn/nuvzubfnups/ve-design-web/iridescent-mountain-peak-clouds.webp"
      />
      <ResourcePreview
        type="image"
        name="cat.png"
        src="https://lf3-static.bytednsdoc.com/obj/eden-cn/nuvzubfnups/ve-design-web/pixel-stretch-mountain-night.webp"
      />
      <ResourcePreview
        type="image"
        name="snow.png"
        src="https://lf3-static.bytednsdoc.com/obj/eden-cn/nuvzubfnups/ve-design-web/rainbow-light-columns-coral.webp"
      />
    </ResourcePreviewGroup>
  </div>
</section>;
```

### 事件与方法

```tsx preview
import { useRef, useState, type ElementRef } from 'react';
import { Button, ResourcePreview } from '@ve-design/react';

function ResourcePreviewMethodDemo() {
  const previewRef = useRef<ElementRef<typeof ResourcePreview> | null>(null);
  const [message, setMessage] = useState('Ready');

  return (
    <section
      style={{
        display: 'grid',
        justifyItems: 'center',
        gap: 12,
        padding: 24,
        textAlign: 'center',
      }}
    >
      <ResourcePreview
        ref={previewRef}
        type="image"
        name="method-demo.png"
        src="https://lf3-static.bytednsdoc.com/obj/eden-cn/nuvzubfnups/ve-design-web/iridescent-mountain-peak-clouds.webp"
        onDownload={(event) => {
          event.preventDefault();
          setMessage(`download cancelled: ${event.detail.item.name}`);
        }}
      />

      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 8,
          flexWrap: 'wrap',
        }}
      >
        <Button
          type="primary"
          onClick={() => {
            previewRef.current?.openPreview();
          }}
        >
          打开预览
        </Button>
        <Button
          type="secondary"
          onClick={() => {
            const item = previewRef.current?.getResourceItem();
            if (item) {
              setMessage(`${item.type}: ${item.name}`);
            }
          }}
        >
          读取资源信息
        </Button>
      </div>

      <code style={{ color: '#595863' }}>{message}</code>
    </section>
  );
}
```

## API

### ResourcePreview Props

| 属性名            | 描述                                                   | 类型                             | 默认值       |
| ----------------- | ------------------------------------------------------ | -------------------------------- | ------------ |
| `type`            | 资源类型。                                             | `'image' \| 'video'`             | `'image'`    |
| `src`             | 资源地址。为空时不触发内置预览，且不会展示下载入口。   | `string`                         | `''`         |
| `name`            | 文件名称，用于预览标题、图片替代文本和下载文件名兜底。 | `string`                         | `''`         |
| `tip`             | 显示在图片或视频左上角的提示角标。                     | `string`                         | `''`         |
| `poster`          | 视频封面地址，仅对 `type="video"` 生效。               | `string`                         | `''`         |
| `preload`         | 视频预加载策略。                                       | `'none' \| 'metadata' \| 'auto'` | `'metadata'` |
| `previewDisabled` | 是否禁用内置大预览。                                   | `boolean`                        | `false`      |
| `hideDownload`    | 是否隐藏卡片下载按钮。                                 | `boolean`                        | `false`      |

### ResourcePreview 事件

| 事件名       | 描述                                                                 | 参数类型                                                                                                           |
| ------------ | -------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `onPreview`  | 点击或键盘触发大预览前触发，可通过 `preventDefault()` 阻止内置预览。 | `CustomEvent<{ item: ResourcePreviewItem; source: VeResourcePreviewElement; nativeEvent: Event \| null }>`         |
| `onDownload` | 点击下载前触发，可通过 `preventDefault()` 阻止默认下载。             | `CustomEvent<{ item: ResourcePreviewItem; source: VeResourcePreviewElement \| null; nativeEvent: Event \| null }>` |
| `onClose`    | 内置大预览关闭时触发。                                               | `CustomEvent<{ item: ResourcePreviewItem \| null; source: VeResourcePreviewElement \| null }>`                     |

### ResourcePreviewGroup Props

| 属性名     | 描述                                                               | 类型                             | 默认值     |
| ---------- | ------------------------------------------------------------------ | -------------------------------- | ---------- |
| `gap`      | 子资源卡之间的间距。                                               | `'small' \| 'medium' \| 'large'` | `'medium'` |
| `noWrap`   | 是否禁止换行；默认允许自动换行，开启后保持单行并在溢出时横向滚动。 | `boolean`                        | `false`    |
| `children` | 放置多个 `ResourcePreview`；其他子元素不会参与共享大预览数据收集。 | `React.ReactNode`                | `-`        |

### ResourcePreviewGroup 事件

| 事件名       | 描述                             | 参数类型                                                                                                             |
| ------------ | -------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| `onChange`   | 共享大预览打开或切换资源时触发。 | `CustomEvent<{ item: ResourcePreviewItem; index: number; total: number; source: VeResourcePreviewElement \| null }>` |
| `onClose`    | 共享大预览关闭时触发。           | `CustomEvent<{ item: ResourcePreviewItem \| null; source: VeResourcePreviewElement \| null }>`                       |
| `onDownload` | 子资源点击下载前触发。           | `CustomEvent<{ item: ResourcePreviewItem; source: VeResourcePreviewElement \| null; nativeEvent: Event \| null }>`   |

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

### Ref

可通过 `ResourcePreview` 的 `ref` 调用 `getResourceItem()`、`openPreview()`、`closePreview()`。`ResourcePreviewGroup` 也支持通过 `ref` 访问分组实例。
