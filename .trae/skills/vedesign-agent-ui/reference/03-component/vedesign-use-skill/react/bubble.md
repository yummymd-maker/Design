`Bubble` 用于在 AI 对话流中渲染单条消息，提供 `avatar`、`header`、`content`、`footer` 四个具名插槽组成的三段式骨架，并通过 `placement` / `variant` / `shape` 控制 9 种视觉变体。长内容会按 `maxHeight` 自动折叠，并在底部提供“See more / Collapse”交互；组件本身只承担消息呈现与局部交互，不持有会话状态机。

`BubbleList` 是一个轻量布局容器，按列纵向排列若干 `Bubble`。`BubbleDivider` 用于在对话中插入分割线或系统提示。

## 何时使用

- AI 对话中"用户消息 + AI 回复"的双方气泡渲染（`placement="start" | "end"`）
- 流式 token 输出（外部用 `<Markdown>` 等组件投影到默认插槽）
- 需要纵向排列多条消息（`BubbleList`）
- 通过 `variant` × `shape` 表达不同视觉权重（如 user 实心胶囊、ai outlined corner、tool text 模式）

## 引入组件

```tsx
import { Bubble, BubbleDivider, BubbleList } from '@ve-design/react';
```

## 示例

### 基础用法

会话通常采用左右布局：用户消息带有气泡背景，靠右显示（`placement="end"`）；AI 回复和生成内容靠左展示（`placement="start"`）。AI 回复可直接投影 Markdown 内容，列表间距默认使用 `--ve-bubble-list-gap`，需要覆盖时可显式传入 `gap`。

```tsx preview
import { Bubble, BubbleList, Markdown } from '@ve-design/react';

<BubbleList style={{ width: '100%', padding: 24 }}>
  <Bubble placement="end" variant="filled">
    帮我整理一下这周的迭代要点。
  </Bubble>
  <Bubble placement="start" variant="text">
    <Markdown
      content={[
        '当然。以下是本周迭代要点：',
        '',
        '1. 完成 Bubble 基础对话样式验收。',
        '2. 补充 Markdown、引用和操作栏等组合场景。',
        '3. 同步优化长内容折叠与回到底部体验。',
      ].join('\n')}
    />
  </Bubble>
  <Bubble placement="end" variant="filled">
    再帮我列一下还需要跟进的事项。
  </Bubble>
</BubbleList>;
```

### 引用

通过 `hasQuote` 在气泡内容顶部渲染引用区域（左竖线 + 图标 + 文本），常用于引用附件、历史消息或文件。使用 `quoteLabel` 可以快速传入纯文本；使用 `quote` 可以自定义文件图标、文件名或历史消息摘要。

```tsx preview
import { Bubble } from '@ve-design/react';
import { IconTypePdfStateDefault } from '@ve-design/react/icons';

function BubbleQuoteDemo() {
  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: 24 }}
    >
      <Bubble
        placement="start"
        variant="filled"
        hasQuote
        quote={
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            <IconTypePdfStateDefault style={{ '--ve-icon-size': '18px' }} />
            文本标题.pdf
          </span>
        }
      >
        云服务平台
      </Bubble>

      <Bubble
        placement="start"
        variant="filled"
        hasQuote
        quote={
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            <IconTypePdfStateDefault style={{ '--ve-icon-size': '18px' }} />
            文本标题.pdf
          </span>
        }
      >
        你现在作为专业全能创作顾问，具备文案撰写、内容润色、逻辑梳理、结构优化、创意策划等全方位能力。当我给你任何创作任务时，请直接根据场景和目标，产出高质量、可直接使用的成品内容。要求语言精炼、逻辑清晰、风格贴合，一次性给到成品，不需要我再补充提问和二次修改。你现在作为专业全能创作顾问，具备文案撰写、内容润色、逻辑梳理、结构优化、创意策划等全方位能力。当我给你任何创作任务时，请直接根据场景和目标，产出高质量、可直接使用的成品内容。要求语言精炼、逻辑清晰、风格贴合，一次性给到成品，不需要我再补充提问和二次修改。
      </Bubble>
    </div>
  );
}
```

### 综合对话

通过 `header`、`footer` 和默认插槽可以组合出带 Skill、文件引用、附件预览和操作栏的完整对话。操作栏建议复用 `Actions`，时间放在操作行最后侧，附件可按业务需要使用横向卡片或紧凑标签形态。

```tsx preview
import { Actions, Bubble, BubbleList, Markdown } from '@ve-design/react';
import {
  IconChevronLeftSm,
  IconChevronRightSm,
  IconCopy,
  IconDislike,
  IconFileAttachment,
  IconImage,
  IconLike,
  IconMoreHorizontal,
  IconRefresh,
  IconTypePdfStateDefault,
  IconUpload,
} from '@ve-design/react/icons';

function BubbleConversationDemo() {
  const actionItems = [
    { key: 'copy', icon: <IconCopy /> },
    { key: 'like', icon: <IconLike /> },
    { key: 'dislike', icon: <IconDislike /> },
    { key: 'upload', icon: <IconUpload /> },
    { key: 'retry', icon: <IconRefresh /> },
    { key: 'page-prev', icon: <IconChevronLeftSm /> },
    { key: 'page', text: '1/2' },
    { key: 'page-next', icon: <IconChevronRightSm /> },
    { key: 'more', type: 'more' as const, icon: <IconMoreHorizontal /> },
    { key: 'date', text: '4月22日' },
  ];

  return (
    <BubbleList style={{ width: '100%', padding: 24 }}>
      <Bubble placement="end" variant="filled" shape="round">
        <span style={{ color: 'var(--color-text-accent)' }}>
          / Agent Design Skill
        </span>
        生成一个项目说明页
      </Bubble>

      <Bubble
        placement="start"
        variant="filled"
        hasQuote
        quote={
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            <IconTypePdfStateDefault style={{ '--ve-icon-size': '18px' }} />
            文本标题.pdf
          </span>
        }
        footer={
          <Actions
            items={actionItems}
            extra={
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  height: 28,
                  color: 'var(--color-text-tertiary)',
                  fontSize: 13,
                }}
              >
                参考 11 篇资料
              </span>
            }
          />
        }
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
          <span className="bubble-demo-attachment">
            <IconFileAttachment /> 需求说明.pdf
          </span>
          <span className="bubble-demo-attachment">
            <IconImage /> 页面参考.png
          </span>
          <span className="bubble-demo-attachment bubble-demo-attachment-danger">
            <IconUpload /> 上传失败
          </span>
        </div>

        <Markdown
          content={[
            '已基于参考资料整理页面结构：',
            '',
            '- 顶部展示项目目标和关键指标。',
            '- 中部拆分为核心能力、流程说明和风险提醒。',
            '- 底部保留下一步操作入口。',
          ].join('\n')}
        />
      </Bubble>

      <style>{`
        .bubble-demo-attachment {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          min-height: 28px;
          padding: 4px 8px;
          border-radius: var(--radius-md, 8px);
          background: var(--color-bg-surface);
          color: var(--color-text-secondary);
          font-size: 13px;
        }

        .bubble-demo-attachment svg {
          width: 16px;
          height: 16px;
        }

        .bubble-demo-attachment-danger {
          color: var(--color-text-danger);
        }
      `}</style>
    </BubbleList>
  );
}
```

### 编辑模式

设置 `editable` 后，气泡内容替换为可编辑的 textarea + 操作按钮组合，适用于用户修改已发送的消息；通过 `onEditConfirm` 和 `onEditCancel` 接收编辑操作。

```tsx preview
import { useState } from 'react';
import { Bubble, Button } from '@ve-design/react';

function BubbleEditableDemo() {
  const [content, setContent] = useState(
    '你现在作为专业全能创作顾问，具备文案撰写、内容润色、逻辑梳理、结构优化、创意策划等全方位能力，请严格按照我的需求深度理解意图，不偏离主题、不敷衍精简、不随意脑补无关内容，全程保持逻辑严谨、表述正式流畅、用词精准高级。',
  );
  const [editable, setEditable] = useState(false);

  return (
    <section
      style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: 24 }}
    >
      <Button
        type="outline"
        size="small"
        onClick={() => setEditable((value) => !value)}
      >
        {editable ? '退出编辑' : '进入编辑'}
      </Button>
      <Bubble
        placement="end"
        variant="filled"
        content={content}
        editable={editable}
        editConfirmLabel="发送"
        editCancelLabel="取消"
        onEditConfirm={(event) => {
          setContent(event.detail.content);
          setEditable(false);
        }}
        onEditCancel={() => setEditable(false)}
      />
    </section>
  );
}
```

### 长内容自动折叠

当消息内容高度超过 `maxHeight` 时，气泡会自动折叠到底部并显示渐变遮罩和“See more”按钮；点击后展开完整内容，按钮文案变为“Collapse”。可通过 `seeMoreLabel` 和 `seeLessLabel` 自定义展开、收起按钮文案。

```tsx preview
import { Bubble } from '@ve-design/react';

function BubbleExpandableDemo() {
  return (
    <div style={{ padding: 24, maxWidth: 500 }}>
      <Bubble
        placement="start"
        variant="filled"
        maxHeight="216px"
        seeMoreLabel="See more"
        seeLessLabel="Collapse"
      >
        This is a long AI response for demonstrating automatic collapse and
        expand. In AI conversations, a model answer may contain a large amount
        of text, such as code explanation, architecture analysis, and
        step-by-step instructions. To avoid occupying too much screen space,
        Bubble automatically collapses the content when its height exceeds the
        maxHeight threshold. Users can click the "See more" action to read the
        full answer. Here is the second paragraph with more details about the
        plan, trade-offs, assumptions, and follow-up tasks. In the expanded
        state, the bottom action changes to "Collapse" so users can fold the
        message back at any time.
      </Bubble>
    </div>
  );
}
```

### 气泡分割器 `ve-bubble-divider`

在对话列表中插入分割标记，支持两种形态：

- **分割线**（`type="divider"`）：带可选居中标签的水平分隔线，常用于时间分组
- **系统提示**（`type="notice"`）：带图标的系统消息卡片，可附带操作按钮

#### 分割线

```tsx preview
import { BubbleDivider } from '@ve-design/react';

<div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: 24 }}>
  <BubbleDivider type="divider" label={<span>2024-01-15 14:30</span>} />
</div>;
```

#### 系统提示

系统提示卡片支持两种状态：**普通提示**（仅信息展示）和**带操作提示**（含可交互操作按钮）。

```tsx preview
import { BubbleDivider } from '@ve-design/react';
import { IconAdd } from '@ve-design/react/icons';

<div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: 24 }}>
  <BubbleDivider type="notice" message="系统已自动保存当前会话" />

  <BubbleDivider
    type="notice"
    status="error"
    message="会话已超时，请重试"
    actionText="重试"
    showAction
  />

  <BubbleDivider
    type="notice"
    showAction
    icon={<IconAdd aria-hidden="true" />}
    action={<span>撤销</span>}
  >
    新对话已创建
  </BubbleDivider>
</div>;
```

### Loading 加载指示器

当 AI 正在生成回复或等待后端响应时，在列表底部显示弹跳圆点 loading 胶囊。

```tsx preview
import { Bubble, BubbleList } from '@ve-design/react';

<div style={{ padding: 24 }}>
  <div
    style={{
      height: 240,
      overflowY: 'auto',
      border: '1px solid var(--color-border-default)',
      borderRadius: 8,
      padding: 12,
    }}
  >
    <BubbleList loading>
      <Bubble placement="end" variant="filled">
        你好，我想了解一下项目架构
      </Bubble>
      <Bubble placement="start" variant="text">
        当然！项目采用 Monorepo 架构，包含三个核心模块。
      </Bubble>
      <Bubble placement="end" variant="filled">
        分别是哪三个？
      </Bubble>
      <Bubble placement="start" variant="text">
        1. components — Web Components 组件库
      </Bubble>
      <Bubble placement="start" variant="text">
        2. react — React 包装器
      </Bubble>
      <Bubble placement="start" variant="text">
        3. theme — CSS 主题和设计令牌
      </Bubble>
      <Bubble placement="end" variant="filled">
        组件库用的什么技术？
      </Bubble>
      <Bubble placement="start" variant="text">
        基于 Lit 3.x 构建的原生 Web Components，支持跨框架使用。
      </Bubble>
      <Bubble placement="end" variant="filled">
        打包工具呢？
      </Bubble>
      <Bubble placement="start" variant="text">
        使用 Rslib（基于 Rspack），输出 ESM 和类型声明。
      </Bubble>
    </BubbleList>
  </div>
</div>;
```

### 滚动到底部指示器

当消息列表内容超出可视区域，用户向上滚动后，底部出现“回到底部”按钮。点击后平滑滚动到底部。

```tsx preview
import { Bubble, BubbleList } from '@ve-design/react';

<div style={{ padding: 24 }}>
  <div style={{ marginBottom: 12, fontSize: 13, color: 'var(--color-text-tertiary)' }}>
    ↑ 向上滚动试试，底部会出现向下箭头按钮
  </div>
  <div
    style={{
      height: 240,
      overflowY: 'auto',
      border: '1px solid var(--color-border-default)',
      borderRadius: 8,
      padding: 12,
    }}
  >
    <BubbleList scrollIndicator>
      <Bubble placement="end" variant="filled">
        你好，我想了解一下项目架构
      </Bubble>
      <Bubble placement="start" variant="text">
        当然！项目采用 Monorepo 架构，包含三个核心模块。
      </Bubble>
      <Bubble placement="end" variant="filled">
        分别是哪三个？
      </Bubble>
      <Bubble placement="start" variant="text">
        1. components — Web Components 组件库
      </Bubble>
      <Bubble placement="start" variant="text">
        2. react — React 包装器
      </Bubble>
      <Bubble placement="start" variant="text">
        3. theme — CSS 主题和设计令牌
      </Bubble>
      <Bubble placement="end" variant="filled">
        组件库用的什么技术？
      </Bubble>
      <Bubble placement="start" variant="text">
        基于 Lit 3.x 构建的原生 Web Components，支持跨框架使用。
      </Bubble>
      <Bubble placement="end" variant="filled">
        打包工具呢？
      </Bubble>
      <Bubble placement="start" variant="text">
        使用 Rslib（基于 Rspack），输出 ESM 和类型声明。
      </Bubble>
    </BubbleList>
  </div>
</div>;
```

## API

### Bubble Props

| 属性名              | 描述                                           | 类型                               | 默认值       |
| ------------------- | ---------------------------------------------- | ---------------------------------- | ------------ |
| `placement`         | 气泡左 / 右对齐                                | `'start' \| 'end'`                 | `'start'`    |
| `variant`           | 视觉变体                                       | `'filled' \| 'outlined' \| 'text'` | `'filled'`   |
| `shape`             | 气泡形状；`variant="text"` 时不生效            | `'default' \| 'round' \| 'corner'` | `'default'`  |
| `content`           | 文本内容快捷写法；`children` 优先级更高        | `string \| null`                   | `null`       |
| `loading`           | 是否处于 loading 占位态                        | `boolean`                          | `false`      |
| `maxHeight`         | 长内容自动折叠的最大高度                       | `string`                           | `'216px'`    |
| `seeMoreLabel`      | 收起态按钮文案                                 | `string`                           | `'查看更多'` |
| `seeLessLabel`      | 展开态按钮文案                                 | `string`                           | `'收起'`     |
| `hasQuote`          | 是否展示引用区域                               | `boolean`                          | `false`      |
| `quoteLabel`        | 引用文本；提供 `quote` 时优先展示自定义引用内容 | `string`                           | `''`         |
| `editable`          | 是否进入编辑态                                 | `boolean`                          | `false`      |
| `editConfirmLabel`  | 编辑确认按钮文案                               | `string`                           | `'发送'`     |
| `editCancelLabel`   | 编辑取消按钮文案                               | `string`                           | `'取消'`     |
| `children`          | 消息正文                                       | `React.ReactNode`                  | `-`          |
| `avatar`            | 头像区域内容                                   | `React.ReactNode`                  | `-`          |
| `header`            | 头部区域内容                                   | `React.ReactNode`                  | `-`          |
| `footer`            | 底部区域内容                                   | `React.ReactNode`                  | `-`          |
| `quote`             | 引用区域内容，可自定义文件图标、文件名或历史消息摘要 | `React.ReactNode`                  | `-`          |
| `loadingNode`       | 自定义 loading 内容                            | `React.ReactNode`                  | `-`          |
| `aria-*` / DOM 属性 | 透传到气泡根元素                               | 原生属性                           | `-`          |

### Bubble 事件

| 事件名          | 描述                     | 参数类型                           |
| --------------- | ------------------------ | ---------------------------------- |
| `onEditConfirm` | 编辑态点击确认按钮时触发 | `CustomEvent<{ content: string }>` |
| `onEditCancel`  | 编辑态点击取消按钮时触发 | `CustomEvent`                      |

### BubbleList Props

| 属性名            | 描述                                                 | 类型              | 默认值   |
| ----------------- | ---------------------------------------------------- | ----------------- | -------- |
| `gap`             | 子项之间的纵向间距，可写任意 CSS 长度；未设置时使用 `--ve-bubble-list-gap` | `string`          | `var(--space-xl, 32px)` |
| `loading`         | 是否在底部显示 loading 指示器                        | `boolean`         | `false`  |
| `scrollIndicator` | 是否开启滚动检测，并在用户向上滚动后显示回到底部按钮 | `boolean`         | `false`  |
| `children`        | 列表内容，通常为多个 `Bubble`                        | `React.ReactNode` | `-`      |

### BubbleList 事件

| 事件名           | 描述                     | 参数类型      |
| ---------------- | ------------------------ | ------------- |
| `onScrollBottom` | 点击“回到底部”按钮时触发 | `CustomEvent` |

### BubbleDivider Props

| 属性名       | 描述                          | 类型                      | 默认值      |
| ------------ | ----------------------------- | ------------------------- | ----------- |
| `type`       | 分割器类型                    | `'divider' \| 'notice'`   | `'divider'` |
| `showLabel`  | 分割线模式下是否显示中间标签  | `boolean`                 | `true`      |
| `message`    | 系统提示默认消息文本          | `string`                  | `''`        |
| `actionText` | 操作按钮文本                  | `string`                  | `''`        |
| `showAction` | 是否显示操作按钮              | `boolean`                 | `false`     |
| `label`      | divider 模式下的标签内容      | `React.ReactNode`         | `-`         |
| `icon`       | notice 模式下的自定义图标     | `React.ReactNode`         | `-`         |
| `action`     | notice 模式下的自定义操作内容 | `React.ReactNode`         | `-`         |
| `children`   | notice 模式下的消息内容       | `React.ReactNode`         | `-`         |

### BubbleDivider 事件

| 事件名     | 描述               | 参数类型                                             |
| ---------- | ------------------ | ---------------------------------------------------- |
| `onAction` | 点击操作按钮时触发 | `CustomEvent<{ type: 'divider' \| 'notice' }>` |

### Ref

可通过 `ref` 访问 `Bubble`、`BubbleList` 和 `BubbleDivider` 的组件实例。
