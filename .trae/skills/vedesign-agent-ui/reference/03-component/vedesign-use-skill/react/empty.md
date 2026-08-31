`Empty` 用于在无数据、无结果或内容尚未创建时展示统一反馈。组件默认提供插图和标题，也可以通过 `image`、`title`、`description`、`actions` 替换插图、标题、说明和操作区。

## 何时使用

- 列表、表格、搜索结果没有可展示内容。
- 首次使用某个功能，需要引导用户创建内容或完成配置。
- 需要用统一版式展示空状态，并保留业务侧自定义内容的能力。

## 引入组件

```tsx
import { Empty } from '@ve-design/react';
```

## 示例

### 基础用法

默认展示控制台插图和 `No Data` 标题。传入空的 `title` 可以覆盖默认标题，仅展示说明内容。

```tsx preview
import { Empty } from '@ve-design/react';

<section
  style={{
    display: 'grid',
    gridTemplateColumns: 'repeat(2, minmax(180px, max-content))',
    gap: 32,
    justifyContent: 'center',
    justifyItems: 'center',
    alignItems: 'center',
    padding: 32,
  }}
>
  <Empty />
  <Empty title="" description="No matching resources found." />
</section>;
```

### 标题和说明

使用 `title` 和 `description` 设置主要文案。说明内容可以承载更完整的业务提示，并按需要换行。

```tsx preview
import { Empty } from '@ve-design/react';

<section
  style={{
    display: 'grid',
    justifyItems: 'center',
    alignItems: 'center',
    padding: 32,
  }}
>
  <Empty
    title="No evaluation runs"
    description={
      <span>
        Run an evaluation after connecting a dataset.
        <br />
        Results will appear here with quality scores, latency, and trace
        details.
      </span>
    }
  />
</section>;
```

### 操作区

使用 `actions` 放置后续操作。

```tsx preview
import { Button, Empty } from '@ve-design/react';

<section
  style={{
    display: 'grid',
    justifyItems: 'center',
    alignItems: 'center',
    padding: 32,
  }}
>
  <Empty
    title="No agents yet"
    description="Create an agent or import a template to start building workflows."
    actions={
      <span style={{ display: 'inline-flex', gap: 12 }}>
        <Button type="secondary">Import template</Button>
        <Button type="primary">Create agent</Button>
      </span>
    }
  />
</section>;
```

### 自定义插图

使用 `image` 替换默认插图。插图尺寸由传入内容自身控制。

```tsx preview
import { Empty } from '@ve-design/react';
import { IconDatabase } from '@ve-design/react/icons';

<section
  style={{
    display: 'grid',
    justifyItems: 'center',
    alignItems: 'center',
    padding: 32,
  }}
>
  <Empty
    image={
      <IconDatabase
        aria-hidden="true"
        style={{ fontSize: 72, color: 'var(--color-text-disable)' }}
      />
    }
    title="No datasets"
    description="Connect a dataset before running batch analysis."
  />
</section>;
```

## API

### Props

| 属性名        | 描述                                        | 类型              | 默认值      |
| ------------- | ------------------------------------------- | ----------------- | ----------- |
| `image`       | 自定义插图、图片或图标。                    | `React.ReactNode` | 默认插图    |
| `title`       | 自定义标题内容。                            | `React.ReactNode` | `'No Data'` |
| `description` | 自定义说明内容。                            | `React.ReactNode` | `-`         |
| `actions`     | 操作区内容。                                | `React.ReactNode` | `-`         |
| `children`    | 默认说明内容；未设置 `description` 时展示。 | `React.ReactNode` | `-`         |

### 事件

暂无组件专属事件。

### Ref

可通过 `ref` 访问 Empty 组件实例。
