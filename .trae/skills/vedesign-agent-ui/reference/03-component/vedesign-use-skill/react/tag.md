`Tag` 用于呈现短文本标签，适合分类、状态、筛选条件等轻量信息。

## 何时使用

- 标记资源类型、任务状态、风险等级或筛选条件。
- 在表格、列表、工具栏中展示紧凑且可扫描的信息。
- 需要语义状态、前置图标、自定义颜色或关闭操作。

## 引入组件

```tsx
import { Tag } from '@ve-design/react';
```

自定义图标可从 React 图标入口引入。

```tsx
import { Tag } from '@ve-design/react';
import { IconRobot } from '@ve-design/react/icons';
```

## 示例

### 基础标签

用于展示普通分类或短文本标记。

```tsx preview
import { Tag } from '@ve-design/react';

<section
  style={{
    minHeight: 104,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 8,
    padding: 16,
  }}
>
  <Tag>Retrieval</Tag>
  <Tag>Agent</Tag>
  <Tag status="success">Knowledge base</Tag>
</section>;
```

### 语义状态

`status` 提供 `success`、`warning`、`error` 三种状态，并带有默认图标和颜色。

```tsx preview
import { Tag } from '@ve-design/react';

<section
  style={{
    minHeight: 104,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 8,
    padding: 16,
  }}
>
  <Tag status="success">Ready</Tag>
  <Tag status="warning">Review</Tag>
  <Tag status="error">Blocked</Tag>
</section>;
```

### 尺寸

`size` 支持 `small`、`medium`、`default`、`large`。

```tsx preview
import { Tag } from '@ve-design/react';

<section
  style={{
    minHeight: 104,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 8,
    padding: 16,
  }}
>
  <Tag size="small">Small</Tag>
  <Tag size="medium">Medium</Tag>
  <Tag size="default">Default</Tag>
  <Tag size="large">Large</Tag>
</section>;
```

### 状态尺寸

状态标签会随尺寸同步调整图标和文本比例。

```tsx preview
import { Tag } from '@ve-design/react';

<section
  style={{
    minHeight: 176,
    display: 'grid',
    placeItems: 'center',
    gap: 12,
    padding: 16,
  }}
>
  {(['small', 'medium', 'default', 'large'] as const).map((size) => (
    <div
      key={size}
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: 8 }}
    >
      <Tag size={size} status="success">Ready</Tag>
      <Tag size={size} status="warning">Review</Tag>
      <Tag size={size} status="error">Blocked</Tag>
    </div>
  ))}
</section>;
```

### 自定义图标

`icon` 会覆盖状态默认图标，图标颜色默认继承标签前景色。

```tsx preview
import { Tag } from '@ve-design/react';
import { IconRobot, IconSync } from '@ve-design/react/icons';

<section
  style={{
    minHeight: 104,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 8,
    padding: 16,
  }}
>
  <Tag status="success" icon={<IconRobot />}>
    Agent ready
  </Tag>
  <Tag status="warning" icon={<IconSync />}>
    Syncing
  </Tag>
</section>;
```

### 自定义颜色

`color` 控制文字与图标颜色，`bgColor` 控制背景色；它们优先于 `status` 默认颜色。

```tsx preview
import { Tag } from '@ve-design/react';

<section
  style={{
    minHeight: 104,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 8,
    padding: 16,
  }}
>
  <Tag status="success" color="#5c4ef5" bgColor="#f0ebff">Custom success</Tag>
  <Tag status="warning" color="#0d4bdb" bgColor="#eaf2ff">Custom warning</Tag>
  <Tag color="#6d28d9" bgColor="#f3e8ff">Custom</Tag>
</section>;
```

### 边框

`bordered` 用于展示带边框的标签。

```tsx preview
import { Tag } from '@ve-design/react';

<section
  style={{
    minHeight: 104,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 8,
    padding: 16,
  }}
>
  <Tag bordered>Default</Tag>
  <Tag bordered status="success">Ready</Tag>
  <Tag bordered status="warning">Review</Tag>
  <Tag bordered status="error">Blocked</Tag>
  <Tag bordered status="success" color="#6d28d9">Custom route</Tag>
</section>;
```

### 可关闭标签

`closable` 展示关闭按钮，点击后触发 `onClose`。

```tsx preview
import * as React from 'react';
import { Tag } from '@ve-design/react';

type TagItem = {
  label: string;
  status?: 'success' | 'warning' | 'error';
};

function CloseDemo() {
  const [tags, setTags] = React.useState<TagItem[]>([
    { label: 'Retrieval' },
    { label: 'Browser', status: 'success' },
    { label: 'Human review', status: 'warning' },
    { label: 'Blocked', status: 'error' },
  ]);

  return (
    <section
      style={{
        minHeight: 144,
        display: 'grid',
        placeItems: 'center',
        padding: 16,
      }}
    >
      <div style={{ display: 'grid', justifyItems: 'center', gap: 12 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 8 }}>
          {tags.map((tag) => (
            <Tag
              key={tag.label}
              closable
              status={tag.status}
              onClose={() =>
                setTags((current) => current.filter((item) => item.label !== tag.label))
              }
            >
              {tag.label}
            </Tag>
          ))}
        </div>
        <code style={{ color: 'var(--color-text-tertiary)' }}>
          {tags.length ? `${tags.length} tags active` : 'No tags active'}
        </code>
      </div>
    </section>
  );
}

<CloseDemo />;
```

## API

### Tag Props

| 属性名 | 描述 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `color` | 标签前景色，影响文字、图标和关闭图标；优先级高于 `status` 默认前景色。 | `string` | `''` |
| `bgColor` | 标签背景色；优先级高于 `status` 默认背景色。 | `string` | `''` |
| `status` | 语义状态，设置后展示默认图标、状态文字色和状态背景色。 | `'success' \| 'warning' \| 'error' \| ''` | `''` |
| `size` | 标签尺寸。 | `'small' \| 'medium' \| 'default' \| 'large'` | `'default'` |
| `closable` | 是否展示关闭按钮。 | `boolean` | `false` |
| `bordered` | 是否展示边框。 | `boolean` | `false` |
| `icon` | 标签前置图标；设置后优先于 `status` 默认图标。 | `React.ReactNode` | `-` |
| `children` | 标签内容，可放置文本或内联内容。 | `React.ReactNode` | `-` |

### 事件

| 事件名 | 描述 | 参数类型 |
| --- | --- | --- |
| `onClose` | 点击关闭按钮时触发，可通过 `event.detail.sourceEvent` 获取原始鼠标事件。 | `CustomEvent<{ sourceEvent: MouseEvent }>` |
