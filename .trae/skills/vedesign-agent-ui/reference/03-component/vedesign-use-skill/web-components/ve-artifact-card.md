`ve-artifact-card` 用于展示 AI 对话、任务执行、文件生成等场景中的产物资源。组件提供统一的缩略图、标题、元信息和操作区布局，业务操作通过 `actions` 插槽自行接入。

## 何时使用

- 展示代码、文档、图片、音视频、压缩包等生成产物。
- 需要在较窄空间内稳定展示产物标题、类型和文件大小。
- 需要把下载、分享、预览、删除等业务操作放入统一的右侧操作区。

## 引入组件

```ts
import '@ve-design/web/ve-artifact-card';
```

## 示例

### 基础用法

未提供 `actions` 插槽时，组件只展示缩略图、标题和元信息。卡片主体可点击，并通过 `ve-card-click` 暴露资源信息。

```html preview
<script type="module">
  import '@ve-design/web/ve-artifact-card';
</script>

<section
  style="display: flex; justify-content: center; align-items: center; padding: 32px;"
>
  <ve-artifact-card
    id="artifact-card-basic"
    type="code"
    title="Snake-game"
    src="file:///workspace/Snake-game"
    byte="327889715"
  ></ve-artifact-card>
</section>

<script>
  document
    .getElementById('artifact-card-basic')
    .addEventListener('ve-card-click', (event) => {
      console.log('Open artifact:', event.detail.src);
    });
</script>
```

### 产物类型

`type` 控制缩略图中的文件类型图标。`bitable` 用于多维表格产物，`board` 用于看板产物；未知值按 `unknown` 展示。

```html preview
<script type="module">
  import '@ve-design/web/ve-artifact-card';
  import '@ve-design/web/ve-button';
  import '@ve-design/web/ve-icon';
  import '@ve-design/web/icons/download';
  import '@ve-design/web/icons/share';
</script>

<style>
  .artifact-card-demo-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(320px, 396px));
    justify-content: center;
    gap: 12px;
    padding: 32px;
  }

  .artifact-card-actions {
    display: inline-flex;
    align-items: center;
    gap: 4px;
  }

  .artifact-card-actions ve-icon {
    --ve-icon-size: 16px;
  }

  @media (max-width: 760px) {
    .artifact-card-demo-grid {
      grid-template-columns: minmax(320px, 396px);
    }
  }
</style>

<template id="artifact-card-actions-template">
  <span slot="actions" class="artifact-card-actions">
    <ve-button type="text" aria-label="下载">
      <ve-icon name="download"></ve-icon>
    </ve-button>
    <ve-button type="text" aria-label="分享">
      <ve-icon name="share"></ve-icon>
    </ve-button>
  </span>
</template>

<section class="artifact-card-demo-grid" id="artifact-card-type-demo">
  <ve-artifact-card type="code" title="main.ts" byte="18432"></ve-artifact-card>
  <ve-artifact-card
    type="word"
    title="requirements.docx"
    byte="2202009"
  ></ve-artifact-card>
  <ve-artifact-card
    type="excel"
    title="revenue.xlsx"
    byte="946176"
  ></ve-artifact-card>
  <ve-artifact-card
    type="html"
    title="preview.html"
    byte="65536"
  ></ve-artifact-card>
  <ve-artifact-card
    type="image"
    title="chart-revenue.png"
    byte="1258291"
  ></ve-artifact-card>
  <ve-artifact-card
    type="pdf"
    title="release-notes.pdf"
    byte="499712"
  ></ve-artifact-card>
  <ve-artifact-card
    type="zip"
    title="design-assets.zip"
    byte="15204352"
  ></ve-artifact-card>
  <ve-artifact-card
    type="audio"
    title="podcast-ep-12.mp3"
    byte="61131980"
  ></ve-artifact-card>
  <ve-artifact-card
    type="video"
    title="demo-recording.mp4"
    byte="190840832"
  ></ve-artifact-card>
  <ve-artifact-card
    type="markdown"
    title="README.md"
    byte="4096"
  ></ve-artifact-card>
  <ve-artifact-card
    type="ppt"
    title="roadmap.pptx"
    byte="7340032"
  ></ve-artifact-card>
  <ve-artifact-card
    type="mind"
    title="research-map"
    byte="204800"
  ></ve-artifact-card>
  <ve-artifact-card
    type="bitable"
    title="sales.bitable"
    byte="6291456"
  ></ve-artifact-card>
  <ve-artifact-card
    type="chart"
    title="metrics.chart"
    byte="524288"
  ></ve-artifact-card>
  <ve-artifact-card
    type="board"
    title="team.board"
    byte="524288"
  ></ve-artifact-card>
  <ve-artifact-card
    type="folder"
    title="Project assets"
    byte="15204352"
  ></ve-artifact-card>
  <ve-artifact-card
    type="unknown"
    title="artifact.bin"
    byte="8192"
  ></ve-artifact-card>
</section>

<script>
  const actionsTemplate = document.getElementById(
    'artifact-card-actions-template',
  );
  const cards = document.querySelectorAll(
    '#artifact-card-type-demo ve-artifact-card',
  );

  cards.forEach((card) => {
    card.append(actionsTemplate.content.cloneNode(true));
  });
</script>
```

### 元信息

未设置 `description` 时，组件会优先从 `title` 提取文件后缀；没有后缀时展示 `type` 的大写形式，未知类型展示 `UNKNOWN`。传入 `byte` 时会格式化为文件大小，未传入时不展示大小。设置 `description` 后会优先展示自定义元信息。

```html preview
<script type="module">
  import '@ve-design/web/ve-artifact-card';
  import '@ve-design/web/ve-button';
  import '@ve-design/web/ve-icon';
  import '@ve-design/web/icons/download';
  import '@ve-design/web/icons/share';
</script>

<style>
  .artifact-card-demo-stack {
    display: grid;
    justify-content: center;
    gap: 12px;
    padding: 32px;
  }

  .artifact-card-actions {
    display: inline-flex;
    align-items: center;
    gap: 4px;
  }

  .artifact-card-actions ve-icon {
    --ve-icon-size: 16px;
  }
</style>

<section class="artifact-card-demo-stack">
  <ve-artifact-card type="word" title="proposal.final.docx">
    <span slot="actions" class="artifact-card-actions">
      <ve-button type="text" aria-label="下载">
        <ve-icon name="download"></ve-icon>
      </ve-button>
      <ve-button type="text" aria-label="分享">
        <ve-icon name="share"></ve-icon>
      </ve-button>
    </span>
  </ve-artifact-card>

  <ve-artifact-card
    type="html"
    title="preview"
    description="页面预览文件。"
    byte="65536"
  >
    <span slot="actions" class="artifact-card-actions">
      <ve-button type="text" aria-label="下载">
        <ve-icon name="download"></ve-icon>
      </ve-button>
      <ve-button type="text" aria-label="分享">
        <ve-icon name="share"></ve-icon>
      </ve-button>
    </span>
  </ve-artifact-card>
</section>
```

### 长内容

标题和描述会在单行内省略，适合文件名或说明较长的产物。

```html preview
<script type="module">
  import '@ve-design/web/ve-artifact-card';
  import '@ve-design/web/ve-button';
  import '@ve-design/web/ve-icon';
  import '@ve-design/web/icons/download';
  import '@ve-design/web/icons/share';
</script>

<style>
  .artifact-card-demo-stack {
    display: grid;
    justify-content: center;
    gap: 12px;
    padding: 32px;
  }

  .artifact-card-actions {
    display: inline-flex;
    align-items: center;
    gap: 4px;
  }

  .artifact-card-actions ve-icon {
    --ve-icon-size: 16px;
  }
</style>

<section class="artifact-card-demo-stack">
  <ve-artifact-card
    type="word"
    title="2026-Q2-AI-Agent-组件库需求评审纪要超长文件名截断展示效果.docx"
    byte="2202009"
  >
    <span slot="actions" class="artifact-card-actions">
      <ve-button type="text" aria-label="下载">
        <ve-icon name="download"></ve-icon>
      </ve-button>
      <ve-button type="text" aria-label="分享">
        <ve-icon name="share"></ve-icon>
      </ve-button>
    </span>
  </ve-artifact-card>

  <ve-artifact-card
    type="word"
    title="requirements-review.docx"
    description="这是一段用于说明产物内容、来源、生成状态和后续操作建议的超长描述文本。"
    byte="2202009"
  >
    <span slot="actions" class="artifact-card-actions">
      <ve-button type="text" aria-label="下载">
        <ve-icon name="download"></ve-icon>
      </ve-button>
      <ve-button type="text" aria-label="分享">
        <ve-icon name="share"></ve-icon>
      </ve-button>
    </span>
  </ve-artifact-card>
</section>
```

### 禁用状态

`disabled` 用于展示不可用状态。业务放入 `actions` 插槽的控件应同步设置自身禁用状态。

```html preview
<script type="module">
  import '@ve-design/web/ve-artifact-card';
  import '@ve-design/web/ve-button';
  import '@ve-design/web/ve-icon';
  import '@ve-design/web/icons/download';
  import '@ve-design/web/icons/share';
</script>

<style>
  .artifact-card-demo-stack {
    display: grid;
    justify-content: center;
    gap: 12px;
    padding: 32px;
  }

  .artifact-card-actions {
    display: inline-flex;
    align-items: center;
    gap: 4px;
  }

  .artifact-card-actions ve-icon {
    --ve-icon-size: 16px;
  }
</style>

<section class="artifact-card-demo-stack">
  <ve-artifact-card
    type="pdf"
    title="locked-report.pdf"
    description="该产物已锁定。"
    byte="499712"
    disabled
  >
    <span slot="actions" class="artifact-card-actions">
      <ve-button type="text" aria-label="下载" disabled>
        <ve-icon name="download"></ve-icon>
      </ve-button>
      <ve-button type="text" aria-label="分享" disabled>
        <ve-icon name="share"></ve-icon>
      </ve-button>
    </span>
  </ve-artifact-card>
</section>
```

### 自定义内容和操作

默认插槽用于覆盖标题区域；`actions` 插槽用于放置业务操作入口。

```html preview
<script type="module">
  import '@ve-design/web/ve-artifact-card';
  import '@ve-design/web/ve-button';
  import '@ve-design/web/ve-icon';
  import '@ve-design/web/icons/preview';
  import '@ve-design/web/icons/trash-03';
</script>

<style>
  .artifact-card-demo-stack {
    display: grid;
    justify-content: center;
    gap: 12px;
    padding: 32px;
  }

  .artifact-card-actions {
    display: inline-flex;
    align-items: center;
    gap: 4px;
  }

  .artifact-card-actions ve-icon {
    --ve-icon-size: 16px;
  }
</style>

<section class="artifact-card-demo-stack">
  <ve-artifact-card
    type="image"
    title="chart-revenue.png"
    description="图片已生成。"
    byte="1258291"
  >
    <span>自定义标题：收入趋势图</span>
    <span slot="actions" class="artifact-card-actions">
      <ve-button type="text" aria-label="预览">
        <ve-icon name="preview"></ve-icon>
      </ve-button>
      <ve-button type="text" status="danger" aria-label="删除">
        <ve-icon name="trash-03"></ve-icon>
      </ve-button>
    </span>
  </ve-artifact-card>
</section>
```

## API

### ve-artifact-card 属性

| 属性名        | 描述                                                                                              | 类型                                                                                                                                                                                                                                                                                                                      | 默认值      |
| ------------- | ------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| `type`        | 设置产物类型，影响默认缩略图图标；未知值会按 `unknown` 处理。                                     | `'code'` &#124; `'word'` &#124; `'excel'` &#124; `'html'` &#124; `'image'` &#124; `'pdf'` &#124; `'zip'` &#124; `'audio'` &#124; `'video'` &#124; `'markdown'` &#124; `'ppt'` &#124; `'mind'` &#124; `'bitable'` &#124; `'chart'` &#124; `'board'` &#124; `'folder'` &#124; `'unknown'` | `'unknown'` |
| `title`       | 设置产物标题或文件名；默认插槽没有内容时作为标题展示，也用于提取文件后缀和生成默认 `aria-label`。 | `string`                                                                                                                                                                                                                                                                                                                  | `''`        |
| `src`         | 设置产物资源 URI；点击卡片主体时会在 `ve-card-click` 的 `detail.src` 中返回。                     | `string`                                                                                                                                                                                                                                                                                                                  | `''`        |
| `description` | 设置自定义元信息；未设置时展示文件后缀或默认类型标签，传入 `byte` 时同时展示格式化后的文件大小。   | `string`                                                                                                                                                                                                                                                                                                                  | `''`        |
| `byte`        | 设置文件字节数；组件会向下取整，并在默认元信息中格式化为文件大小，未传入时不展示大小。             | `number`                                                                                                                                                                                                                                                                                                                  | `-`         |
| `disabled`    | 是否使用禁用视觉状态。                                                                            | `boolean`                                                                                                                                                                                                                                                                                                                 | `false`     |

### ve-artifact-card 事件

| 事件名          | 描述                                                                                     | `event.detail`                                              |
| --------------- | ---------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| `ve-card-click` | 点击卡片主体时触发；点击 `actions` 插槽内的自定义操作时不触发，禁用状态下也不触发。      | `{ src: string; title: string; type: ArtifactCardResolvedType }` |

### ve-artifact-card 插槽

| 插槽名    | 描述                             |
| --------- | -------------------------------- |
| 默认插槽  | 覆盖标题区域内容。               |
| `actions` | 渲染右侧操作区；不提供默认操作。 |
