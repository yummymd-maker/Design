`ve-citation` 用于在联网搜索 / RAG 模式下，向用户展示模型答案所引用的数据来源。它支持以下形态：

- **卡片列表（默认 `mode="card"`）**：每条引用展示为卡片，头部为「来源 + 日期 + 序号」，主体为标题 + 两行描述。
- **链接列表（`mode="link"`）**：每条引用以带图标的链接呈现，超过 `collapse-count` 时显示「查看全部 / 折叠」按钮。
- **Inline（`inline`）**：紧凑触发器嵌入文本流，点击通过 Popover 弹出引用列表。

## 何时使用

- 联网搜索 / RAG 类对话产品中需要引用来源链接的回答展示。
- Agent 输出引用文献、专利、新闻、知识库段落等结构化来源时。
- 在知识库文档、项目文档等聚合页面，希望用极简链接列表展示引用文档列表时。

## 引入组件

```ts
import '@ve-design/web/ve-citation';
```

## 示例

### 基础用法（卡片列表）

通过 JS 设置 `items` 渲染引用列表；每项可提供 `title` / `url` / `source` / `date` / `description`。

```html preview
<script type="module">
  import '@ve-design/web/ve-citation';

  const el = document.getElementById('basic-citation');
  el.items = [
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
</script>

<section style="max-width: 588px; padding: 16px;">
  <ve-citation id="basic-citation"></ve-citation>
</section>
```

### 链接列表（可收起展开）

`mode="link"` 把引用渲染成带图标的链接列表，适合展示一组知识库或项目文档。
通过 `collapse-count` 控制收起时的行数，超出部分由「查看全部 / 折叠」按钮控制。

```html preview
<script type="module">
  import '@ve-design/web/ve-citation';

  const el = document.getElementById('link-citation');
  el.items = Array.from({ length: 10 }).map((_, i) => ({
    key: i,
    title: `知识库文档 ${i + 1}`,
    url: 'https://example.com/docs',
    date: '2026-05-15',
  }));
  el.addEventListener('ve-citation-expand', (event) => {
    console.log('expand →', event.detail.expanded);
  });
</script>

<section style="max-width: 320px; padding: 16px;">
  <ve-citation
    id="link-citation"
    mode="link"
    collapse-count="5"
  ></ve-citation>
</section>
```

### 默认全部展开的链接列表

设置 `default-expanded` 让链接列表初始就展开。

```html preview
<script type="module">
  import '@ve-design/web/ve-citation';

  const el = document.getElementById('link-expanded-citation');
  el.items = Array.from({ length: 6 }).map((_, i) => ({
    key: i,
    title: `知识库文档 ${i + 1}`,
    url: 'https://example.com/',
    date: '2026-05-15',
  }));
</script>

<section style="max-width: 320px; padding: 16px;">
  <ve-citation
    id="link-expanded-citation"
    mode="link"
    collapse-count="3"
    default-expanded
  ></ve-citation>
</section>
```

### 链接列表自定义图标

每项 `icon` 支持图片 URL、内置图标名（如 `globe`、`link`、`book-open-01`）或 `IconDefinition`。
不设置时 link 形态回落到 `document` 图标。

```html preview
<script type="module">
  import '@ve-design/web/ve-citation';

  const el = document.getElementById('link-icon-citation');
  el.items = [
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
</script>

<section style="max-width: 320px; padding: 16px;">
  <ve-citation
    id="link-icon-citation"
    mode="link"
    default-expanded
  ></ve-citation>
</section>
```

### Inline 形态（Popover）

`inline` 把组件渲染为紧凑触发器，可嵌入气泡正文。点击触发器在 Popover 中展示引用列表。
默认触发器文案为「参考来源」+ 数量徽标，可通过 `trigger-label` 自定义文案、`show-count` 控制是否显示数量；
也可以通过 `slot="trigger"` 完全自定义触发器结构。

```html preview
<script type="module">
  import '@ve-design/web/ve-citation';

  const items = [
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

  document.getElementById('inline-citation').items = items;
  document.getElementById('inline-citation-label').items = items;
</script>

<section style="max-width: 588px; padding: 16px; display: flex; flex-direction: column; gap: 12px;">
  <div>
    默认触发器：根据近期 Web 平台规范，自定义元素已被广泛支持
    <ve-citation
      id="inline-citation"
      inline
      popover-overlay-width="360"
    ></ve-citation>
    。
  </div>
  <div>
    自定义文案：
    <ve-citation
      id="inline-citation-label"
      inline
      trigger-label="查看引用"
      popover-overlay-width="360"
    ></ve-citation>
    。
  </div>
</section>
```

### 监听点击事件

`ve-citation-click` 在引用项被点击时触发，参数包含原始 `item` 与 `index`。

```html preview
<script type="module">
  import '@ve-design/web/ve-citation';

  const el = document.getElementById('click-citation');
  el.items = [
    { source: '示例 1', date: '2026-01-01', title: '示例 1', url: 'https://example.com/1' },
    { source: '示例 2', date: '2026-01-02', title: '示例 2', url: 'https://example.com/2' },
  ];
  el.addEventListener('ve-citation-click', (event) => {
    const log = document.getElementById('click-log');
    log.textContent = `clicked → ${event.detail.item.title}`;
  });
</script>

<section style="max-width: 588px; padding: 16px;">
  <ve-citation id="click-citation"></ve-citation>
  <code id="click-log" style="display: block; margin-top: 8px; color: var(--color-text-secondary);"
    >点击任意引用项触发事件</code
  >
</section>
```

## API

### ve-citation 属性

| 属性名 | 描述 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `items` | 引用项数组（仅 JS 属性）。 | `VeCitationItem[]` | `[]` |
| `mode` | 展示模式，`card` 卡片列表 / `link` 链接列表。 | `'card' \| 'link'` | `'card'` |
| `inline` | 是否使用 inline + Popover 形态。 | `boolean` | `false` |
| `trigger-label` | Inline 形态触发器文案；通过 `slot="trigger"` 可完全自定义触发器结构。 | `string` | `'参考来源'` |
| `show-count` | Inline 形态触发器是否展示数量徽标。 | `boolean` | `true` |
| `expanded` | 受控展开状态（link 模式控制是否展开全部链接）。 | `boolean` | — |
| `default-expanded` | 非受控初始展开状态（link 模式默认 `false`）。 | `boolean` | — |
| `collapse-count` | link 模式下收起时显示的链接条数。 | `number` | `5` |
| `active-key` | 当前激活的引用项 `key`，用于高亮单项。 | `string \| number` | — |
| `popover-overlay-width` | Inline 形态下 Popover 宽度。 | `number \| string` | `320` |
| `disabled` | 是否禁用交互。 | `boolean` | `false` |

### VeCitationItem

| 字段 | 描述 | 类型 |
| --- | --- | --- |
| `key` | 唯一标识，用于受控 `activeKey` 与事件回传。 | `string \| number` |
| `title` | 引用标题。 | `string` |
| `url` | 引用 URL；提供后单项渲染为新窗口超链接。 | `string` |
| `icon` | 引用图标，支持图片 URL、内置图标名（如 `globe`）或 `IconDefinition`；不提供时 card 形态回落 `globe`、link 形态回落 `document`。 | `string \| IconDefinition` |
| `description` | 引用描述（卡片模式最多两行）。 | `string` |
| `source` | 来源名称，例如「Product Blog」「知识库文档」。 | `string` |
| `date` | 引用日期，自由格式字符串。 | `string` |

### ve-citation 事件

| 事件名 | 描述 | 参数类型 |
| --- | --- | --- |
| `ve-citation-click` | 引用项被点击时触发。 | `CustomEvent<{ item: VeCitationItem; index: number }>` |
| `ve-citation-expand` | link 模式下「查看全部 / 折叠」按钮点击时触发。 | `CustomEvent<{ expanded: boolean }>` |

### ve-citation 插槽

| 插槽名 | 描述 |
| --- | --- |
| 默认插槽 | 自定义引用列表内容；提供时优先于 `items` 渲染。 |
| `trigger` | Inline 形态触发器自定义内容（默认文案为「参考来源」）。 |

### ve-citation CSS Parts

| 名称 | 描述 |
| --- | --- |
| `content` | 引用列表容器。 |
| `item` | 卡片模式下每条引用项；`item-active` 在激活项上叠加。 |
| `item-source` / `item-icon` / `item-date` / `item-index` | 卡片头部子元素。 |
| `item-title` / `item-description` | 卡片正文子元素。 |
| `link-row` / `link` / `link-index` / `link-date` | 链接模式下的子元素。 |
| `more` | 链接模式下「查看全部 / 折叠」按钮。 |
| `trigger` | Inline 形态下的触发器按钮。 |
| `popover` | Inline 形态下的 Popover 内容容器。 |
