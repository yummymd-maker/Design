`ArtifactCard` 用于展示 AI 对话、任务执行、文件生成等场景中的产物资源。组件提供统一的缩略图、标题、元信息和操作区布局，业务操作通过 `actions` 插槽自行接入。

## 何时使用

- 展示代码、文档、图片、音视频、压缩包等生成产物。
- 需要在较窄空间内稳定展示产物标题、类型和文件大小。
- 需要把下载、分享、预览、删除等业务操作放入统一的右侧操作区。

## 引入组件

```tsx
import { ArtifactCard } from '@ve-design/react';
```

## 示例

### 基础用法

未提供 `actions` 时，组件只展示缩略图、标题和元信息。卡片主体可点击，并通过 `onCardClick` 暴露资源信息。

```tsx preview
import { ArtifactCard } from '@ve-design/react';

<section
  style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  }}
>
  <ArtifactCard
    type="code"
    title="Snake-game"
    src="file:///workspace/Snake-game"
    byte={327889715}
    onCardClick={(event) => {
      console.log('Open artifact:', event.detail.src);
    }}
  />
</section>;
```

### 产物类型

`type` 控制缩略图中的文件类型图标。`bitable` 用于多维表格产物，`board` 用于看板产物；未知值按 `unknown` 展示。

```tsx preview
import { ArtifactCard, Button } from '@ve-design/react';
import { IconDownload, IconShare } from '@ve-design/react/icons';

function ArtifactCardTypeDemo() {
  const actions = (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
      <Button type="text" aria-label="下载">
        <IconDownload size={16} />
      </Button>
      <Button type="text" aria-label="分享">
        <IconShare size={16} />
      </Button>
    </span>
  );

  return (
    <section
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, minmax(320px, 396px))',
        justifyContent: 'center',
        gap: 12,
        padding: 32,
      }}
    >
      <ArtifactCard
        type="code"
        title="main.ts"
        byte={18432}
        actions={actions}
      />
      <ArtifactCard
        type="word"
        title="requirements.docx"
        byte={2202009}
        actions={actions}
      />
      <ArtifactCard
        type="excel"
        title="revenue.xlsx"
        byte={946176}
        actions={actions}
      />
      <ArtifactCard
        type="html"
        title="preview.html"
        byte={65536}
        actions={actions}
      />
      <ArtifactCard
        type="image"
        title="chart-revenue.png"
        byte={1258291}
        actions={actions}
      />
      <ArtifactCard
        type="pdf"
        title="release-notes.pdf"
        byte={499712}
        actions={actions}
      />
      <ArtifactCard
        type="zip"
        title="design-assets.zip"
        byte={15204352}
        actions={actions}
      />
      <ArtifactCard
        type="audio"
        title="podcast-ep-12.mp3"
        byte={61131980}
        actions={actions}
      />
      <ArtifactCard
        type="video"
        title="demo-recording.mp4"
        byte={190840832}
        actions={actions}
      />
      <ArtifactCard
        type="markdown"
        title="README.md"
        byte={4096}
        actions={actions}
      />
      <ArtifactCard
        type="ppt"
        title="roadmap.pptx"
        byte={7340032}
        actions={actions}
      />
      <ArtifactCard
        type="mind"
        title="research-map"
        byte={204800}
        actions={actions}
      />
      <ArtifactCard
        type="bitable"
        title="sales.bitable"
        byte={6291456}
        actions={actions}
      />
      <ArtifactCard
        type="chart"
        title="metrics.chart"
        byte={524288}
        actions={actions}
      />
      <ArtifactCard
        type="board"
        title="team.board"
        byte={524288}
        actions={actions}
      />
      <ArtifactCard
        type="folder"
        title="Project assets"
        byte={15204352}
        actions={actions}
      />
      <ArtifactCard
        type="unknown"
        title="artifact.bin"
        byte={8192}
        actions={actions}
      />
    </section>
  );
}

<ArtifactCardTypeDemo />;
```

### 元信息

未设置 `description` 时，组件会优先从 `title` 提取文件后缀；没有后缀时展示 `type` 的大写形式，未知类型展示 `UNKNOWN`。传入 `byte` 时会格式化为文件大小，未传入时不展示大小。设置 `description` 后会优先展示自定义元信息。

```tsx preview
import { ArtifactCard, Button } from '@ve-design/react';
import { IconDownload, IconShare } from '@ve-design/react/icons';

function ArtifactCardMetaDemo() {
  const actions = (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
      <Button type="text" aria-label="下载">
        <IconDownload size={16} />
      </Button>
      <Button type="text" aria-label="分享">
        <IconShare size={16} />
      </Button>
    </span>
  );

  return (
    <section
      style={{ display: 'grid', justifyContent: 'center', gap: 12, padding: 32 }}
    >
      <ArtifactCard
        type="word"
        title="proposal.final.docx"
        actions={actions}
      />
      <ArtifactCard
        type="html"
        title="preview"
        description="页面预览文件。"
        byte={65536}
        actions={actions}
      />
    </section>
  );
}

<ArtifactCardMetaDemo />;
```

### 长内容

标题和描述会在单行内省略，适合文件名或说明较长的产物。

```tsx preview
import { ArtifactCard, Button } from '@ve-design/react';
import { IconDownload, IconShare } from '@ve-design/react/icons';

function ArtifactCardLongContentDemo() {
  const actions = (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
      <Button type="text" aria-label="下载">
        <IconDownload size={16} />
      </Button>
      <Button type="text" aria-label="分享">
        <IconShare size={16} />
      </Button>
    </span>
  );

  return (
    <section
      style={{ display: 'grid', justifyContent: 'center', gap: 12, padding: 32 }}
    >
      <ArtifactCard
        type="word"
        title="2026-Q2-AI-Agent-组件库需求评审纪要超长文件名截断展示效果.docx"
        byte={2202009}
        actions={actions}
      />
      <ArtifactCard
        type="word"
        title="requirements-review.docx"
        description="这是一段用于说明产物内容、来源、生成状态和后续操作建议的超长描述文本。"
        byte={2202009}
        actions={actions}
      />
    </section>
  );
}

<ArtifactCardLongContentDemo />;
```

### 禁用状态

`disabled` 用于展示不可用状态。放入 `actions` 的控件应同步设置自身禁用状态。

```tsx preview
import { ArtifactCard, Button } from '@ve-design/react';
import { IconDownload, IconShare } from '@ve-design/react/icons';

<section
  style={{ display: 'grid', justifyContent: 'center', gap: 12, padding: 32 }}
>
  <ArtifactCard
    type="pdf"
    title="locked-report.pdf"
    description="该产物已锁定。"
    byte={499712}
    disabled
    actions={
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
        <Button type="text" aria-label="下载" disabled>
          <IconDownload size={16} />
        </Button>
        <Button type="text" aria-label="分享" disabled>
          <IconShare size={16} />
        </Button>
      </span>
    }
  />
</section>;
```

### 自定义内容和操作

使用 `title` 传入标题文本；当需要自定义标题结构时，可传入 ReactNode。使用 `actions` 放置业务操作入口。

```tsx preview
import { ArtifactCard, Button } from '@ve-design/react';
import { IconPreview, IconTrash03 } from '@ve-design/react/icons';

<section
  style={{ display: 'grid', justifyContent: 'center', gap: 12, padding: 32 }}
>
  <ArtifactCard
    type="image"
    title={<span>自定义标题：收入趋势图</span>}
    description="图片已生成。"
    byte={1258291}
    actions={
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
        <Button type="text" aria-label="预览">
          <IconPreview size={16} />
        </Button>
        <Button type="text" status="danger" aria-label="删除">
          <IconTrash03 size={16} />
        </Button>
      </span>
    }
  />
</section>;
```

## API

### Props

| 属性名        | 描述                                                                              | 类型                                                                                                                                                                                                                                              | 默认值      |
| ------------- | --------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| `type`        | 设置产物类型，影响默认缩略图图标；未知值会按 `unknown` 处理。                     | `'code'` \| `'word'` \| `'excel'` \| `'html'` \| `'image'` \| `'pdf'` \| `'zip'` \| `'audio'` \| `'video'` \| `'markdown'` \| `'ppt'` \| `'mind'` \| `'bitable'` \| `'chart'` \| `'board'` \| `'folder'` \| `'unknown'` | `'unknown'` |
| `title`       | 设置产物标题或自定义标题内容；文本标题也用于提取文件后缀和生成默认 `aria-label`。 | `React.ReactNode`                                                                                                                                                                                                                                 | `''`        |
| `src`         | 设置产物资源 URI；点击卡片主体时会在 `onCardClick` 的 `event.detail.src` 中返回。 | `string`                                                                                                                                                                                                                                          | `''`        |
| `description` | 设置自定义元信息；未设置时展示文件后缀或默认类型标签，传入 `byte` 时同时展示格式化后的文件大小。 | `string`                                                                                                                                                                                                                                          | `''`        |
| `byte`        | 设置文件字节数；组件会向下取整，并在默认元信息中格式化为文件大小，未传入时不展示大小。          | `number`                                                                                                                                                                                                                                          | `-`         |
| `disabled`    | 是否使用禁用视觉状态。                                                            | `boolean`                                                                                                                                                                                                                                         | `false`     |
| `actions`     | 渲染右侧操作区；不提供默认操作。                                                  | `React.ReactNode`                                                                                                                                                                                                                                 | `-`         |
| `children`    | 自定义标题内容；当 `title` 不是 ReactNode 自定义结构时可用于覆盖标题区域。        | `React.ReactNode`                                                                                                                                                                                                                                 | `-`         |

### 事件

| 事件名        | 描述                                                                                | `event.detail`                                              |
| ------------- | ----------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| `onCardClick` | 点击卡片主体时触发；点击 `actions` 中的自定义操作时不触发，禁用状态下也不触发。     | `{ src: string; title: string; type: ArtifactCardResolvedType }` |
