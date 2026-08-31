`PromptItem` 用于展示提示词集中的单个提示项，支持文字卡片、文字行和媒体卡片三种形态。React 版本通过属性传入标题、描述、媒体、前缀、后缀和遮罩内容，不需要手写 slot。

## 何时使用

- 提示词集首页、推荐位或灵感列表中的可点击提示项。
- 需要用文字卡片或单行条目展示「标题 + 描述 + 进入箭头」。
- 需要展示带图片的灵感卡片，并在悬浮态呈现提示词和 CTA。

## 引入组件

```tsx
import { PromptItem } from '@ve-design/react';
```

## 示例

### 基础用法

使用 `type="card"` 展示标题、描述和默认箭头。

```tsx preview
import { PromptItem } from '@ve-design/react';

<section
  style={{
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(186px, 1fr))',
    gap: 12,
    padding: 16,
  }}
>
  <PromptItem
    type="card"
    title="会议纪要整理"
    description="纪要梳理明晰施策规划"
    style={{ display: 'flex' }}
  />
  <PromptItem
    type="card"
    title="周报生成"
    description="自动汇总本周进展与风险"
    style={{ display: 'flex' }}
  />
  <PromptItem
    type="card"
    title="灵感拾遗"
    description="把今天的碎片想法整理成文"
    style={{ display: 'flex' }}
  />
</section>;
```

### 文字行（type=line）

`type="line"` 可由外层容器控制为块级铺满或行内紧凑展示。List Default 态用于展示无箭头行条目，示例通过 `arrow={false}` 对齐默认视觉；业务需要进入态时可省略 `arrow` 或通过 `suffix` 接管行尾区域。

```tsx preview
import { PromptItem } from '@ve-design/react';

<section style={{ display: 'grid', gap: 12, padding: 16 }}>
  <div style={{ color: 'var(--color-text-tertiary)', fontSize: 12 }}>块级铺满（外层 stretch）</div>
  <div style={{ display: 'grid', gap: 8, maxWidth: 588 }}>
    <PromptItem
      type="line"
      title="制作优质的课堂笔记，并制定学习目标"
      arrow={false}
      style={{ display: 'flex' }}
    />
    <PromptItem
      type="line"
      title="为新产品发布准备一份发布会讲稿"
      arrow={false}
      style={{ display: 'flex' }}
    />
  </div>

  <div style={{ color: 'var(--color-text-tertiary)', fontSize: 12 }}>
    行内紧凑（与文本同行）
  </div>
  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
    <PromptItem type="line" title="给中年家庭的马年新年寄语" arrow={false} />
    <PromptItem type="line" title="夏日清凉饮品文案" arrow={false} />
  </div>
</section>;
```

### 自定义行尾内容

使用 `suffix` 放置标签、时间或其他 React 节点。设置 `arrow={false}` 可隐藏默认箭头。

```tsx preview
import { PromptItem, Tag } from '@ve-design/react';

<section style={{ display: 'grid', gap: 8, maxWidth: 588, padding: 16 }}>
  <PromptItem
    type="line"
    title="高频提示词"
    suffix={
      <Tag color="blue" size="small">
        Top 1
      </Tag>
    }
    style={{ display: 'flex' }}
  />
  <PromptItem
    type="line"
    title="本周新加入的提示词"
    arrow={false}
    suffix={<span style={{ color: 'var(--color-text-tertiary)', fontSize: 12 }}>2 天前</span>}
    style={{ display: 'flex' }}
  />
</section>;
```

### 媒体卡片（type=media）

同时展示 3:2、1:1 和 3:4 三种比例的媒体卡片；尺寸与比例由 `width` / `height` 属性控制（数字按 px 处理，字符串按 CSS 长度原样使用）。第三张纵向媒体卡使用 `forceHover` 直接展示底部透明到半透明渐变、文字遮罩与模糊背景。若卡片需要标记来源（如音频/视频），可通过 `media` 传入包含图片与白色 Voice 图标的自定义内容，把图标叠在左上角。

> 传给 `media`、`prefix`、`suffix`、`mask` 等插槽的内容，建议直接使用原生元素（如 `div`、`img`、`span`）。若必须使用自定义组件，需保证它把接收到的 `slot` 属性透传到自己的根 DOM 节点（例如 `{...props}`），否则内容会掉进默认插槽而无法渲染。

```tsx preview
import { PromptItem } from '@ve-design/react';
import { IconVoice } from '@ve-design/react/icons';

const IMAGE =
  'https://images.unsplash.com/photo-1517511620798-cec17d428bc0?auto=format&fit=crop&w=600&q=80';

export default function Demo() {
  const mediaWithVoice = (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <img
        src={IMAGE}
        alt="dreamy tech atmosphere"
        style={{
          display: 'block',
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      />
      <span
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 12,
          left: 12,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ffffff',
          fontSize: 20,
        }}
      >
        <IconVoice />
      </span>
    </div>
  );

  return (
    <section style={{ display: 'flex', flexWrap: 'wrap', gap: 16, padding: 16 }}>
      <PromptItem
        type="media"
        image={IMAGE}
        alt="dreamy tech atmosphere"
        title="体验同款"
        description="营造出梦幻、科技感的氛围"
      />

      <PromptItem
        type="media"
        title="体验同款"
        description="营造出梦幻、科技感的氛围"
        width={188}
        height={188}
        media={mediaWithVoice}
      />

      <PromptItem
        type="media"
        forceHover
        title="体验同款"
        description="营造出梦幻、科技感的氛围"
        width={180}
        height={240}
        media={mediaWithVoice}
      />
    </section>
  );
}
```

### 响应式媒体卡

把 `width` 设为 `100%`、`height` 设为 `auto`，再配合 `aspectRatio` 锁定比例，即可实现与 Web Component 示例一致的响应式媒体卡布局。

```tsx preview
import { PromptItem } from '@ve-design/react';

<section
  style={{
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
    gap: 16,
    padding: 16,
  }}
>
  <PromptItem
    type="media"
    image="https://images.unsplash.com/photo-1517511620798-cec17d428bc0?auto=format&fit=crop&w=600&q=80"
    alt="atmosphere"
    title="体验同款"
    description="营造出梦幻、科技感的氛围"
    width="100%"
    height="auto"
    style={{ aspectRatio: '3 / 2' }}
  />
  <PromptItem
    type="media"
    image="https://images.unsplash.com/photo-1517511620798-cec17d428bc0?auto=format&fit=crop&w=600&q=80"
    alt="atmosphere"
    title="体验同款"
    description="营造出梦幻、科技感的氛围"
    width="100%"
    height="auto"
    style={{ aspectRatio: '3 / 2' }}
  />
  <PromptItem
    type="media"
    image="https://images.unsplash.com/photo-1517511620798-cec17d428bc0?auto=format&fit=crop&w=600&q=80"
    alt="atmosphere"
    title="体验同款"
    description="营造出梦幻、科技感的氛围"
    width="100%"
    height="auto"
    style={{ aspectRatio: '3 / 2' }}
  />
</section>;
```

### 禁用状态

使用 `disabled` 禁用提示项，禁用后不会触发 `onPromptItemClick`。

```tsx preview
import { PromptItem } from '@ve-design/react';

<section style={{ display: 'flex', flexWrap: 'wrap', gap: 12, padding: 16 }}>
  <PromptItem
    type="card"
    title="会议纪要整理"
    description="暂未授权"
    disabled
  />
  <PromptItem type="line" title="给中年家庭的马年新年寄语" disabled />
</section>;
```

### 点击事件

点击提示项或键盘聚焦时按下 Enter 会触发 `onPromptItemClick`，事件参数包含当前 `type`。

```tsx preview
import { PromptItem } from '@ve-design/react';

<section style={{ display: 'grid', gap: 12, maxWidth: 640, padding: 16 }}>
  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
    <PromptItem
      type="card"
      title="会议纪要整理"
      description="纪要梳理明晰施策规划"
      onPromptItemClick={(event) => {
        console.log('Prompt item clicked:', event.detail.type);
      }}
    />
    <PromptItem
      type="line"
      title="夏日清凉饮品文案"
      onPromptItemClick={(event) => {
        console.log('Prompt item clicked:', event.detail.type);
      }}
    />
  </div>
</section>;
```

## API

### Props

| 属性名        | 描述                                             | 类型                          | 默认值   |
| ------------- | ------------------------------------------------ | ----------------------------- | -------- |
| `type`        | 展示形态。                                       | `'card' \| 'line' \| 'media'` | `'card'` |
| `title`       | 标题内容；`media` 形态下作为遮罩 CTA 文案。      | `React.ReactNode`             | `''`     |
| `description` | 描述内容；`media` 形态下作为遮罩提示词。         | `React.ReactNode`             | `''`     |
| `image`       | 媒体图片 URL，仅在 `media` 形态下使用。          | `string`                      | `''`     |
| `alt`         | 媒体图片替代文本。                               | `string`                      | `''`     |
| `width`       | 媒体卡宽度，仅 `media` 形态。数字按 px，字符串按 CSS 长度。 | `string \| number`      | `-`      |
| `height`      | 媒体卡高度，仅 `media` 形态。数字按 px，字符串按 CSS 长度。 | `string \| number`      | `-`      |
| `arrow`       | 是否显示尾部箭头；未设置时由 `type` 决定。       | `boolean`                     | `-`      |
| `forceHover`  | 是否保持媒体遮罩可见。                           | `boolean`                     | `false`  |
| `disabled`    | 是否禁用。                                       | `boolean`                     | `false`  |
| `prefix`      | 标题前的内联内容，适用于 `card` 和 `line` 形态。 | `React.ReactNode`             | `-`      |
| `suffix`      | 标题后的内联内容，适用于 `card` 和 `line` 形态。 | `React.ReactNode`             | `-`      |
| `media`       | 自定义媒体内容，覆盖 `image`。                   | `React.ReactNode`             | `-`      |
| `mask`        | 自定义媒体卡片遮罩内容。                         | `React.ReactNode`             | `-`      |

### 事件

| 事件名              | 描述                                      | 参数类型                                             |
| ------------------- | ----------------------------------------- | ---------------------------------------------------- |
| `onPromptItemClick` | 点击或按下 Enter 时触发；禁用状态不触发。 | `CustomEvent<{ type: 'card' \| 'line' \| 'media' }>` |

### Ref

可通过 `ref` 获取 `VePromptItemElement` 实例。
