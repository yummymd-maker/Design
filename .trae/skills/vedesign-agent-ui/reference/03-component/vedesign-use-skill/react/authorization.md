`Authorization` 用于在 AI Agent 执行敏感能力前展示授权标题、权限内容和确认动作。React 版本将 Web Component 的 `title`、`content`、`actions` 插槽转换为 ReactNode props，使用时不需要手写 `slot`。

## 何时使用

- Agent 准备安装 skill、执行命令、搜索网页、读取文件或调用外部工具前，需要用户授权。
- 需要把命令、代码片段、权限说明或外部服务信息作为内容区展示给用户。
- 需要提供明确的安全动作：拒绝、允许一次、始终允许。
- 需要用 ReactNode 自定义标题、内容或动作区域。

## 引入组件

```tsx
import { Authorization } from '@ve-design/react';
```

## 示例

### 默认授权确认

横排是默认布局，适合在对话流中承载一段授权标题、内容代码和右侧动作按钮。

```tsx preview
import { Authorization } from '@ve-design/react';

export default function Demo() {
  return (
    <Authorization
      title="Allow Design Assistant to install the selected extension?"
      content={"import * as React from 'react'\nimport * as DialogPrimitive from '@radix-ui/react-dialog'"}
      denyText="Cancel"
      allowOnceText="Allow once"
      allowAlwaysText="Always allow"
      onAuthorizationAction={(event) => {
        console.log('authorization action', event.detail);
      }}
    />
  );
}
```

### 纵排授权

`orientation="vertical"` 会让按钮纵向铺满卡片宽度，适合窄容器或移动端对话气泡。

```tsx preview
import { Authorization } from '@ve-design/react';

export default function Demo() {
  return (
    <Authorization
      orientation="vertical"
      title="Allow Design Assistant to install the selected extension?"
      content={"Install extension package\nUpdate local configuration"}
    />
  );
}
```

### 自定义标题和内容

`title` 和 `content` 都支持 ReactNode。React 包装器会自动把内容映射到 Web Component 的具名插槽。

```tsx preview
import { Authorization } from '@ve-design/react';
import { IconTool } from '@ve-design/react/icons';

export default function Demo() {
  return (
    <Authorization
      title={
        <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <IconTool
            size={20}
            style={{ color: 'var(--color-text-primary)', flex: '0 0 auto' }}
          />
          <span>
            Design Assistant wants to search external docs before editing components
          </span>
        </span>
      }
      content={
        <div
          style={{
            display: 'grid',
            gap: 8,
            fontFamily: 'var(--font-sans)',
            fontSize: 13,
            lineHeight: 1.5,
          }}
        >
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <strong style={{ minWidth: 72, color: 'var(--color-text-primary)' }}>
              Tool
            </strong>
            <code>Web Search</code>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <strong style={{ minWidth: 72, color: 'var(--color-text-primary)' }}>
              Query
            </strong>
            <code>VeDesign Authorization component slots and React wrapper examples</code>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
            <strong style={{ minWidth: 72, color: 'var(--color-text-primary)' }}>
              Reason
            </strong>
            <span>
              Compare public component patterns before updating the docs and API guidance.
            </span>
          </div>
        </div>
      }
    />
  );
}
```

### 自定义动作区

`actions` 会替换默认的拒绝、允许一次、始终允许按钮。自定义动作可以横向或纵向排列；按钮内容使用左侧图标与文案、右侧快捷键的结构，确保文案靠左展示。

```tsx preview
import { Authorization, Button } from '@ve-design/react';
import {
  IconCheck,
  IconChevronRightMd,
  IconLogoDoubaoLlmIcon,
  IconXCircle,
} from '@ve-design/react/icons';

const actionTextStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 8,
} as const;

export default function Demo() {
  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <style>{`
        .authorization-long-action::part(control) {
          justify-content: flex-start;
        }

        .authorization-long-action::part(content) {
          justify-content: flex-start;
        }
      `}</style>
      <Authorization
        title={
          <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 24,
                height: 24,
                border: '.5px solid var(--color-border-default)',
                borderRadius: 'var(--radius-md)',
                background: 'var(--color-bg-base)',
              }}
            >
              <IconLogoDoubaoLlmIcon />
            </span>
            <span>Design Assistant wants to use Web Search</span>
            <IconChevronRightMd style={{ color: 'var(--color-text-primary)' }} />
          </span>
        }
        actions={
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start',
              gap: 12,
              width: '100%',
              paddingInlineStart: 36,
            }}
          >
            <Button size="small" type="primary">
              <IconCheck />
              <span>Always allow</span>
              <span style={{ opacity: 0.72, fontFamily: 'var(--font-mono)' }}>
                ⌘↵
              </span>
            </Button>
            <Button size="small" type="outline">
              <IconCheck />
              <span>Allow once</span>
              <span
                style={{
                  color: 'var(--color-text-tertiary)',
                  fontFamily: 'var(--font-mono)',
                }}
              >
                ⌘⇧↵
              </span>
            </Button>
            <Button size="small" type="outline">
              <IconXCircle />
              <span>Cancel</span>
              <span
                style={{
                  color: 'var(--color-text-tertiary)',
                  fontFamily: 'var(--font-mono)',
                }}
              >
                esc
              </span>
            </Button>
          </div>
        }
      />

      <Authorization
        style={{ maxWidth: 600 }}
        title={
          <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 24,
                height: 24,
                border: '.5px solid var(--color-border-default)',
                borderRadius: 'var(--radius-md)',
                background: 'var(--color-bg-base)',
              }}
            >
              <IconLogoDoubaoLlmIcon />
            </span>
            <span>Design Assistant wants permission to use language model</span>
            <IconChevronRightMd style={{ color: 'var(--color-text-primary)' }} />
          </span>
        }
        actions={
          <div
            style={{
              display: 'grid',
              gap: 8,
              width: '100%',
              paddingInlineStart: 36,
            }}
          >
            <Button className="authorization-long-action" long size="small" type="primary">
              <span style={actionTextStyle}>
                <IconCheck />
                <span>Always allow language model</span>
              </span>
              <span style={{ opacity: 0.72, fontFamily: 'var(--font-mono)' }}>
                ⌘↵
              </span>
            </Button>
            <Button className="authorization-long-action" long size="small" type="outline">
              <span style={actionTextStyle}>
                <IconCheck />
                <span>Allow once for this task</span>
              </span>
              <span
                style={{
                  color: 'var(--color-text-tertiary)',
                  fontFamily: 'var(--font-mono)',
                }}
              >
                ⌘⇧↵
              </span>
            </Button>
            <Button className="authorization-long-action" long size="small" type="outline">
              <span style={actionTextStyle}>
                <IconXCircle />
                <span>Cancel this request</span>
              </span>
              <span
                style={{
                  color: 'var(--color-text-tertiary)',
                  fontFamily: 'var(--font-mono)',
                }}
              >
                esc
              </span>
            </Button>
          </div>
        }
      />
    </div>
  );
}
```

### 自定义动作文案

动作文案可以通过 props 调整；点击默认按钮会触发 `onAuthorizationAction`。

```tsx preview
import { Authorization } from '@ve-design/react';

export default function Demo() {
  return (
    <Authorization
      title="Run shell command in workspace?"
      content="pnpm typecheck"
      denyText="Cancel"
      allowOnceText="Run once"
      allowAlwaysText="Always allow pnpm typecheck"
    />
  );
}
```

### 禁用状态

`disabled` 会禁用默认按钮，适合等待上一个授权动作完成时使用。

```tsx preview
import { Authorization } from '@ve-design/react';

export default function Demo() {
  return (
    <Authorization
      disabled
      title="Waiting for current approval result..."
      content="No new action can be selected while disabled."
    />
  );
}
```

## API

### Props

| Prop | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `title` | `React.ReactNode` | `undefined` | 授权标题；字符串和 React 节点都会渲染到标题区域。 |
| `content` | `React.ReactNode` | `undefined` | 授权内容；字符串和 React 节点都会渲染到内容区域。 |
| `actions` | `React.ReactNode` | `undefined` | 自定义动作区；传入后替换默认动作按钮。 |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | 动作区排列方向。 |
| `denyText` | `string` | `'拒绝'` | 拒绝动作按钮文案。 |
| `allowOnceText` | `string` | `'允许一次'` | 允许一次动作按钮文案。 |
| `allowAlwaysText` | `string` | `'始终允许'` | 始终允许动作按钮文案。 |
| `disabled` | `boolean` | `false` | 禁用默认动作按钮。 |
| `onAuthorizationAction` | `(event: CustomEvent<{ action: 'deny' \| 'allow-once' \| 'allow-always' }>) => void` | `undefined` | 用户点击默认动作按钮时触发。 |
