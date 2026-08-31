`Citation` 用于在联网搜索 / RAG 模式下，向用户展示模型答案所引用的数据来源。React API 使用 `items` 传入引用数据，通过 camelCase 属性和 `onXxx` 事件完成展示与交互。

## 何时使用

- 联网搜索 / RAG 类对话产品中需要引用来源链接的回答展示。
- Agent 输出引用文献、专利、新闻、知识库段落等结构化来源时。
- 在知识库文档、项目文档等聚合页面，希望用极简链接列表展示引用文档列表时。

## 引入组件

```tsx
import { Citation } from '@ve-design/react';
```

## 示例

### 基础用法（卡片列表）

通过 `items` 渲染引用列表；每项可提供 `title` / `url` / `source` / `date` / `description`。

```tsx preview
import { Citation, type VeCitationItem } from '@ve-design/react';

const citationItems: VeCitationItem[] = [
  {
    key: '1',
    source: 'Product Blog',
    date: '2026-05-15',
    title: 'Design system adoption report',
    url: 'https://example.com/adoption-report',
    description:
      'The report summarizes component adoption, migration progress, and accessibility improvements across product teams.',
  },
  {
    key: '2',
    source: 'Docs Center',
    date: '2026-05-14',
    title: 'Accessibility checklist update',
    url: 'https://example.com/accessibility-checklist',
    description:
      'The checklist explains keyboard navigation, focus management, and semantic markup requirements for interactive components.',
  },
  {
    key: '3',
    source: 'Research Notes',
    date: '2026-05-14',
    title: 'Component performance notes',
    url: 'https://example.com/performance-notes',
    description:
      'The notes compare render cost, loading states, and recommended pagination strategies for large datasets.',
  },
];

export default function BasicCitationDemo() {
  return (
    <section style={{ maxWidth: 588, padding: 16 }}>
      <Citation items={citationItems} />
    </section>
  );
}
```

### 链接列表（可收起展开）

`mode="link"` 把引用渲染成带图标的链接列表，适合展示一组知识库或项目文档。
通过 `collapseCount` 控制收起时的行数，超出部分由「查看全部 / 折叠」按钮控制。

```tsx preview
import { Citation, type VeCitationItem } from '@ve-design/react';

const linkItems: VeCitationItem[] = Array.from({ length: 10 }).map((_, i) => ({
  key: i,
  title: `知识库文档 ${i + 1}`,
  url: 'https://example.com/docs',
  date: '2026-05-15',
}));

export default function LinkCitationDemo() {
  return (
    <section style={{ maxWidth: 320, padding: 16 }}>
      <Citation
        items={linkItems}
        mode="link"
        collapseCount={5}
        onCitationExpand={(event) => {
          console.log('expand →', event.detail.expanded);
        }}
      />
    </section>
  );
}
```

### 默认全部展开的链接列表

设置 `defaultExpanded` 让链接列表初始就展开。

```tsx preview
import { Citation, type VeCitationItem } from '@ve-design/react';

const expandedItems: VeCitationItem[] = Array.from({ length: 6 }).map((_, i) => ({
  key: i,
  title: `知识库文档 ${i + 1}`,
  url: 'https://example.com/',
  date: '2026-05-15',
}));

export default function ExpandedCitationDemo() {
  return (
    <section style={{ maxWidth: 320, padding: 16 }}>
      <Citation
        items={expandedItems}
        mode="link"
        collapseCount={3}
        defaultExpanded
      />
    </section>
  );
}
```

### 链接列表自定义图标

每项 `icon` 支持图片 URL、内置图标名（如 `globe`、`link`、`book-open-01`）或 `IconDefinition`。不设置时 link 形态回落到 `document` 图标。

```tsx preview
import { Citation, type VeCitationItem } from '@ve-design/react';

const linkIconItems: VeCitationItem[] = [
  {
    key: 0,
    title: '内置图标名 globe',
    url: 'https://example.com/',
    icon: 'globe',
    date: '2026-05-15',
  },
  {
    key: 1,
    title: '内置图标名 book-open-01',
    url: 'https://example.com/',
    icon: 'book-open-01',
    date: '2026-05-15',
  },
  {
    key: 2,
    title: '图片 URL 作为图标',
    url: 'https://www.feishu.cn/',
    icon: 'https://www.feishu.cn/favicon.ico',
    date: '2026-05-15',
  },
  {
    key: 3,
    title: '未设置图标（回落 document）',
    url: 'https://example.com/',
    date: '2026-05-15',
  },
];

export default function LinkIconCitationDemo() {
  return (
    <section style={{ maxWidth: 320, padding: 16 }}>
      <Citation items={linkIconItems} mode="link" defaultExpanded />
    </section>
  );
}
```

### Inline 形态（Popover）

`inline` 把组件渲染为紧凑触发器，可嵌入气泡正文。触发器在 Popover 中展示引用列表。
默认触发器文案为「参考来源」+ 数量徽标，可通过 `triggerLabel` 自定义文案、`showCount` 控制是否显示数量。

```tsx preview
import { Citation, type VeCitationItem } from '@ve-design/react';

const inlineItems: VeCitationItem[] = [
  {
    source: 'Lit Docs',
    date: '2025-09-01',
    title: 'Lit Reactive Properties',
    url: 'https://lit.dev/docs/components/properties/',
    description: 'Lit 的响应式属性 API。',
  },
  {
    source: 'TypeScript',
    date: '2025-08-12',
    title: 'TypeScript Decorators',
    url: 'https://www.typescriptlang.org/docs/handbook/decorators.html',
    description: 'TypeScript 装饰器语法说明。',
  },
];

export default function InlineCitationDemo() {
  return (
    <section
      style={{
        maxWidth: 588,
        padding: 16,
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
      }}
    >
      <div>
        默认触发器：根据近期 Web 平台规范，自定义元素已被广泛支持{' '}
        <Citation items={inlineItems} inline popoverOverlayWidth={360} />。
      </div>
      <div>
        自定义文案：{' '}
        <Citation
          items={inlineItems}
          inline
          triggerLabel="查看引用"
          popoverOverlayWidth={360}
        />
        。
      </div>
    </section>
  );
}
```

### 监听点击事件

`onCitationClick` 在引用项被点击时触发，参数包含原始 `item` 与 `index`。

```tsx preview
import { useState } from 'react';
import { Citation, type VeCitationItem } from '@ve-design/react';

const clickableItems: VeCitationItem[] = [
  {
    source: '示例 1',
    date: '2026-01-01',
    title: '示例 1',
    url: 'https://example.com/1',
  },
  {
    source: '示例 2',
    date: '2026-01-02',
    title: '示例 2',
    url: 'https://example.com/2',
  },
];

export default function ClickCitationDemo() {
  const [message, setMessage] = useState('点击任意引用项触发事件');

  return (
    <section style={{ maxWidth: 588, padding: 16 }}>
      <Citation
        items={clickableItems}
        onCitationClick={(event) => {
          setMessage(`clicked → ${event.detail.item.title}`);
        }}
      />
      <code style={{ display: 'block', marginTop: 8, color: 'var(--color-text-secondary)' }}>
        {message}
      </code>
    </section>
  );
}
```

## API

### Citation Props

| 属性名 | 描述 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `items` | 引用项数组。 | `VeCitationItem[]` | `[]` |
| `mode` | 展示模式，`card` 卡片列表 / `link` 链接列表。 | `'card' \| 'link'` | `'card'` |
| `inline` | 是否使用 inline + Popover 形态。 | `boolean` | `false` |
| `triggerLabel` | Inline 形态触发器文案。 | `string` | `'参考来源'` |
| `showCount` | Inline 形态触发器是否展示数量徽标。 | `boolean` | `true` |
| `expanded` | 受控展开状态（link 模式控制是否展开全部链接）。 | `boolean` | — |
| `defaultExpanded` | 非受控初始展开状态（link 模式默认 `false`）。 | `boolean` | — |
| `collapseCount` | link 模式下收起时显示的链接条数。 | `number` | `5` |
| `activeKey` | 当前激活的引用项 `key`，用于高亮单项。 | `string \| number` | — |
| `popoverOverlayWidth` | Inline 形态下 Popover 宽度。 | `number \| string` | `320` |
| `disabled` | 是否禁用交互。 | `boolean` | `false` |
| `onCitationClick` | 引用项被点击时触发。 | `(event: CustomEvent<VeCitationClickDetail>) => void` | — |
| `onCitationExpand` | link 模式下「查看全部 / 折叠」按钮点击时触发。 | `(event: CustomEvent<VeCitationExpandDetail>) => void` | — |

### VeCitationItem

| 字段 | 描述 | 类型 |
| --- | --- | --- |
| `key` | 唯一标识，用于受控 `activeKey` 与事件回传。 | `string \| number` |
| `title` | 引用标题。 | `string` |
| `url` | 引用 URL；提供后单项渲染为新窗口超链接。 | `string` |
| `icon` | 引用图标 URL；不提供时使用默认图标。 | `string` |
| `description` | 引用描述（卡片模式最多两行）。 | `string` |
| `source` | 来源名称，例如「Product Blog」「知识库文档」。 | `string` |
| `date` | 引用日期，自由格式字符串。 | `string` |
