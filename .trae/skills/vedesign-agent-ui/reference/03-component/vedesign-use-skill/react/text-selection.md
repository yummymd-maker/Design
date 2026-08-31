`TextSelection` 用于包裹一段文字，用户选中文本后浮出操作工具栏，可提供引用、复制、语音、刷新等快捷操作。

## 何时使用

- 文档、对话或回复内容需要在选中后提供上下文操作。
- 需要把复制、引用、朗读、重写等动作收敛到指定文字范围内。
- 需要按业务场景自定义选区操作项、图标、文案或点击处理。

## 引入组件

```tsx
import { TextSelection } from '@ve-design/react';
import { IconCopy } from '@ve-design/react/icons';
```

## 示例

### 基础用法

通过 `actions` 配置浮出工具栏中的操作项。选中包裹文本中的任意内容后，工具栏会显示在选区附近。

```tsx preview
import { TextSelection } from '@ve-design/react';
import {
  IconCopy,
  IconCornerDownRight,
  IconRefresh,
  IconVoice,
} from '@ve-design/react/icons';

<TextSelection
  actions={[
    { key: 'quote', label: '引用' },
    { key: 'copy', label: '复制' },
    { key: 'voice', label: '语音' },
    { key: 'refresh', label: '刷新' },
  ]}
  actionIcons={{
    quote: <IconCornerDownRight />,
    copy: <IconCopy />,
    voice: <IconVoice />,
    refresh: <IconRefresh />,
  }}
>
  <section
    style={{
      maxWidth: 640,
      margin: '0 auto',
      padding: 24,
      color: 'var(--color-text-primary)',
      font: '400 15px/1.8 var(--font-cn)',
    }}
  >
    VeDesign 是一个跨框架的 AI Agent 设计系统，提供基于 Lit 的原生 Web
    Components 与 React
    包装器。试着拖选这段文字，工具栏会浮出并展示你配置的动作集。
  </section>
</TextSelection>;
```

### 自定义操作集

通过 `actions` 属性传入自定义动作列表。每个动作至少包含 `key` 与 `label`；`icon` 字段可填写已通过 `@ve-design/react/icons` 注册的图标名。也可以在动作上挂 `onClick` 回调单独处理某个按钮的点击逻辑（事件 `ve-text-selection-action` 仍会照常派发）。

```tsx preview
import { TextSelection } from '@ve-design/react';
import {
  IconCopy,
  IconCornerDownRight,
  IconMoreHorizontal,
} from '@ve-design/react/icons';

<TextSelection
  actions={[
    {
      key: 'quote',
      label: '引用',
      icon: 'corner-down-right',
      onClick: (detail) => console.log('引用 ->', detail.selectedText),
    },
    {
      key: 'copy',
      label: '复制',
      icon: 'copy',
      onClick: (detail) => navigator.clipboard?.writeText(detail.selectedText),
    },
    { key: 'more', label: '更多', icon: 'more-horizontal' },
  ]}
  actionIcons={{
    quote: <IconCornerDownRight />,
    copy: <IconCopy />,
    more: <IconMoreHorizontal />,
  }}
  onTextSelectionAction={(event) => {
    console.log('action', event.detail);
  }}
>
  <section
    style={{
      maxWidth: 640,
      margin: '0 auto',
      padding: 24,
      color: 'var(--color-text-primary)',
      font: '400 15px/1.8 var(--font-cn)',
    }}
  >
    自定义操作集只展示「引用 / 复制 / 更多」三个动作。点击「复制」会通过
    `onClick` 回调把选中的原文写入剪贴板，同时仍会派发
    `ve-text-selection-action` 事件。
  </section>
</TextSelection>;
```

### 自定义图标与文案

使用 `actionIcons` 和 `actionLabels` 按操作 `key` 覆盖对应按钮的图标或文案。

```tsx preview
import { TextSelection } from '@ve-design/react';
import { IconCopy, IconVoice } from '@ve-design/react/icons';

<TextSelection
  actions={[
    { key: 'copy', label: 'Copy' },
    { key: 'voice', label: 'Read aloud' },
  ]}
  actionIcons={{
    copy: <IconCopy aria-hidden="true" />,
    voice: <IconVoice aria-hidden="true" />,
  }}
  actionLabels={{
    copy: <strong>Copy</strong>,
    voice: <span>Read aloud</span>,
  }}
>
  <section
    style={{
      maxWidth: 640,
      margin: '0 auto',
      padding: 24,
      color: 'var(--color-text-primary)',
      font: '400 15px/1.8 var(--font-cn)',
    }}
  >
    选中此处文字，体验自定义图标与文案。复制按钮展示为「Copy」，语音按钮展示为「Read
    aloud」。
  </section>
</TextSelection>;
```

### 强制展示浮出框（文档/截图用）

设置 `forceOpen` 可在文档或截图场景中直接展示浮出工具栏；仍需要提供非空的 `actions`。

```tsx preview
import { TextSelection } from '@ve-design/react';
import {
  IconCopy,
  IconCornerDownRight,
  IconRefresh,
  IconVoice,
} from '@ve-design/react/icons';

<TextSelection
  forceOpen
  actions={[
    { key: 'quote', label: '引用' },
    { key: 'copy', label: '复制' },
    { key: 'voice', label: '语音' },
    { key: 'refresh', label: '刷新' },
  ]}
  actionIcons={{
    quote: <IconCornerDownRight />,
    copy: <IconCopy />,
    voice: <IconVoice />,
    refresh: <IconRefresh />,
  }}
>
  <section
    style={{
      maxWidth: 640,
      margin: '0 auto',
      padding: '56px 24px 24px',
      color: 'var(--color-text-primary)',
      font: '400 15px/1.8 var(--font-cn)',
    }}
  >
    这段文本上方会持续展示浮出工具栏，无需手动选择即可预览样式。
  </section>
</TextSelection>;
```

## API

### Props

| 属性名         | 描述                                                                      | 类型                                        | 默认值  |
| -------------- | ------------------------------------------------------------------------- | ------------------------------------------- | ------- |
| `actions`      | 浮出工具栏的操作项数组，按数组顺序展示；为空时不会显示工具栏。            | `VeTextSelectionAction[]`                   | `[]`    |
| `disabled`     | 是否禁用浮出工具栏。                                                      | `boolean`                                   | `false` |
| `forceOpen`    | 是否强制展示浮出工具栏，常用于文档或截图场景；仅在 `actions` 非空时生效。 | `boolean`                                   | `false` |
| `actionIcons`  | 按操作 `key` 自定义图标。                                                 | `Readonly<Record<string, React.ReactNode>>` | `-`     |
| `actionLabels` | 按操作 `key` 自定义文案。                                                 | `Readonly<Record<string, React.ReactNode>>` | `-`     |
| `children`     | 被包裹的文本或内容。                                                      | `React.ReactNode`                           | `-`     |

### 事件

| 事件名                  | 描述                                 | 参数类型                                   |
| ----------------------- | ------------------------------------ | ------------------------------------------ |
| `onTextSelectionAction` | 用户点击浮出工具栏中的操作项时触发。 | `CustomEvent<VeTextSelectionActionDetail>` |
| `onTextSelectionChange` | 当前选中文本变化或清空时触发。       | `CustomEvent<{ selectedText: string }>`    |

### VeTextSelectionAction

| 字段       | 描述                                                 | 类型                                            | 默认值  |
| ---------- | ---------------------------------------------------- | ----------------------------------------------- | ------- |
| `key`      | 操作唯一标识，会作为事件 detail 中的 `action` 回传。 | `string`                                        | —       |
| `label`    | 操作文案。                                           | `string`                                        | —       |
| `icon`     | 图标名。                                             | `string`                                        | —       |
| `disabled` | 是否禁用该操作项。                                   | `boolean`                                       | `false` |
| `onClick`  | 单项点击回调，先于 `onTextSelectionAction` 执行。    | `(detail: VeTextSelectionActionDetail) => void` | —       |

### VeTextSelectionActionDetail

| 字段           | 描述                   | 类型     |
| -------------- | ---------------------- | -------- |
| `action`       | 被点击操作项的 `key`。 | `string` |
| `label`        | 被点击操作项的文案。   | `string` |
| `selectedText` | 触发操作时的选中文本。 | `string` |

### Ref

可通过 `ref` 访问 TextSelection 组件实例。
