`ve-upload` 用于选择、上传并展示附件，适合在 Agent、知识库、表单和消息输入等场景中承载文件、图片、视频等资源。

## 何时使用

- 需要在上传入口旁展示已选择或已上传的附件。
- 需要根据容器空间在 `card`、`row`、`tag` 三种附件列表中切换。
- 需要接入拖拽上传、数量限制、自定义请求或上传状态事件。

## 引入组件

```ts
import '@ve-design/web/ve-upload';
```

## 示例

### 基础用法

默认列表样式，用于展示紧凑的附件信息。

```html preview
<script type="module">
  import '@ve-design/web/ve-upload';
</script>

<section style="display:grid; place-items:center; padding:32px 24px;">
  <ve-upload
    id="upload-row"
    action="/api/upload"
    multiple
    style="display:block; width:min(100%, 616px);"
  ></ve-upload>
</section>

<script>
  const upload = document.getElementById('upload-row');
  upload.defaultFileList = [
    {
      uid: 'row-pdf',
      name: 'Research brief.pdf',
      type: 'application/pdf',
      size: 15917342,
      status: 'done',
    },
    {
      uid: 'row-image',
      name: 'Mountain.png',
      type: 'image/png',
      size: 3819230,
      url: 'https://picsum.photos/seed/upload-a/640/360',
      status: 'done',
    },
    {
      uid: 'row-error',
      name: 'Dataset.csv',
      type: 'text/csv',
      size: 1048576,
      status: 'error',
    },
  ];
</script>
```

### 卡片列表

用于图片、视频和需要突出展示的附件。开启 `image-preview` 后，可通过预览操作查看图片。

```html preview
<script type="module">
  import '@ve-design/web/ve-upload';
</script>

<section style="display:grid; place-items:center; padding:32px 24px;">
  <ve-upload
    id="upload-card"
    action="/api/upload"
    list-type="card"
    image-preview
    multiple
    style="display:block; width:min(100%, 504px);"
  ></ve-upload>
</section>

<script>
  const upload = document.getElementById('upload-card');
  upload.defaultFileList = [
    {
      uid: 'card-image',
      name: 'Scene.png',
      type: 'image/png',
      size: 3819230,
      url: 'https://picsum.photos/seed/upload-a/640/360',
      status: 'done',
    },
    {
      uid: 'card-video',
      name: 'Demo.mov',
      type: 'video/quicktime',
      size: 10695475,
      url: 'https://picsum.photos/seed/upload-b/640/360',
      status: 'done',
    },
    {
      uid: 'card-pdf',
      name: 'Research brief.pdf',
      type: 'application/pdf',
      size: 15917342,
      status: 'done',
    },
  ];
</script>
```

### 标签列表

用于输入框上方、附件栏等空间受限区域。

```html preview
<script type="module">
  import '@ve-design/web/ve-upload';
</script>

<section style="display:grid; place-items:center; padding:32px 24px;">
  <ve-upload
    id="upload-tag"
    action="/api/upload"
    list-type="tag"
    multiple
    style="display:block; width:min(100%, 520px);"
  ></ve-upload>
</section>

<script>
  const upload = document.getElementById('upload-tag');
  upload.limit = { maxCount: 6, hideOnExceedLimit: true };
  upload.defaultFileList = [
    {
      uid: 'tag-pdf',
      name: '文本标题.pdf',
      type: 'application/pdf',
      size: 15917342,
      status: 'done',
    },
    {
      uid: 'tag-image',
      name: '文本标题.png',
      type: 'image/png',
      size: 3819230,
      status: 'done',
    },
    {
      uid: 'tag-video',
      name: '文本标题.mov',
      type: 'video/quicktime',
      size: 10695475,
      status: 'done',
    },
    {
      uid: 'tag-doc',
      name: '文本标题.pdf',
      type: 'application/pdf',
      size: 15917342,
      status: 'done',
    },
  ];
</script>
```

### 列表项点击

`row`、`card`、`tag` 三种列表项在 hover 时会展示可点击状态。点击列表项主体会触发 `ve-item-click`，可通过 `event.detail.file` 获取当前文件信息；点击移除、预览、重传、开始或取消等内置操作按钮时，不会额外触发列表项点击。

```html preview
<script type="module">
  import '@ve-design/web/ve-upload';
</script>

<section style="display:grid; place-items:center; gap:12px; padding:32px 24px;">
  <ve-upload
    id="upload-item-click"
    action="/api/upload"
    list-type="row"
    style="display:block; width:min(100%, 520px);"
  ></ve-upload>
  <div id="upload-item-click-log" style="color:var(--color-text-tertiary); font-size:12px;">
    Click an attachment item.
  </div>
</section>

<script>
  const upload = document.getElementById('upload-item-click');
  const log = document.getElementById('upload-item-click-log');

  upload.defaultFileList = [
    {
      uid: 'item-click-pdf',
      name: 'Research brief.pdf',
      type: 'application/pdf',
      size: 15917342,
      status: 'done',
    },
    {
      uid: 'item-click-image',
      name: 'Mountain.png',
      type: 'image/png',
      size: 3819230,
      status: 'done',
    },
  ];

  upload.addEventListener('ve-item-click', (event) => {
    log.textContent = `Clicked: ${event.detail.file.name}`;
  });
</script>
```

### 上传状态

内置列表会根据文件状态展示上传中、完成和失败。

```html preview
<script type="module">
  import '@ve-design/web/ve-upload';
</script>

<section style="display:grid; place-items:center; padding:32px 24px;">
  <div style="display:grid; gap:28px; justify-items:center; width:min(100%, 520px);">
    <ve-upload
      id="upload-state-card"
      list-type="card"
      style="display:block; width:min(100%, 376px);"
    ></ve-upload>
    <ve-upload
      id="upload-state-row"
      style="display:block; width:min(100%, 408px);"
    ></ve-upload>
    <ve-upload
      id="upload-state-tag"
      list-type="tag"
      style="display:block; width:min(100%, 420px);"
    ></ve-upload>
  </div>
</section>

<script>
  const files = [
    {
      uid: 'uploading',
      name: 'Uploading.pdf',
      type: 'application/pdf',
      size: 15917342,
      status: 'uploading',
      percent: 72,
    },
    {
      uid: 'failed',
      name: 'Failed.csv',
      type: 'text/csv',
      size: 1048576,
      status: 'error',
    },
  ];

  document.getElementById('upload-state-card').defaultFileList = files;
  document.getElementById('upload-state-row').defaultFileList = files;
  document.getElementById('upload-state-tag').defaultFileList = files;
</script>
```

### 拖拽上传

用于上传区域较明确的场景。

```html preview
<script type="module">
  import '@ve-design/web/ve-upload';
</script>

<section style="display:grid; place-items:center; padding:32px 24px;">
  <div style="width:min(100%, 560px);">
    <ve-upload
      action="/api/upload"
      drag
      multiple
      accept="image/*"
      tip="Only images can be uploaded"
    ></ve-upload>
  </div>
</section>
```

### 自定义请求

通过 `customRequest` 接管上传过程，适合接入业务上传 SDK 或模拟上传进度；失败时应调用 `onError` 让列表进入失败状态。

```html preview
<script type="module">
  import '@ve-design/web/ve-upload';
</script>

<section style="display:grid; place-items:center; padding:32px 24px;">
  <ve-upload
    id="upload-custom-request"
    auto-upload="true"
    style="display:block; width:min(100%, 220px);"
  ></ve-upload>
</section>

<script>
  const upload = document.getElementById('upload-custom-request');

  upload.customRequest = ({ onProgress, onSuccess }) => {
    let percent = 0;
    const timer = window.setInterval(() => {
      percent += 20;
      onProgress(percent);

      if (percent >= 100) {
        window.clearInterval(timer);
        onSuccess({ ok: true });
      }
    }, 240);

    return {
      abort() {
        window.clearInterval(timer);
      },
    };
  };
</script>
```

### 方法

通过组件实例调用 `choose()`、`submit()` 和 `clear()` 等方法。

```html preview
<script type="module">
  import '@ve-design/web/ve-button';
  import '@ve-design/web/ve-upload';
</script>

<section style="display:grid; place-items:center; padding:32px 24px;">
  <div style="display:grid; gap:12px; width:min(100%, 520px);">
    <div style="display:flex; gap:8px; flex-wrap:wrap;">
      <ve-button id="upload-method-choose" type="outline">选择文件</ve-button>
      <ve-button id="upload-method-submit" type="outline">开始上传</ve-button>
      <ve-button id="upload-method-clear" type="text">清空列表</ve-button>
    </div>
    <ve-upload
      id="upload-methods"
      auto-upload="false"
      action="/api/upload"
      multiple
      tip="先选择文件，再点击开始上传。"
      style="display:block; width:min(100%, 520px);"
    ></ve-upload>
  </div>
</section>

<script>
  const upload = document.getElementById('upload-methods');
  upload.defaultFileList = [
    {
      uid: 'manual-ready',
      name: 'Pending.pdf',
      type: 'application/pdf',
      size: 15917342,
      status: 'init',
    },
  ];

  document
    .getElementById('upload-method-choose')
    .addEventListener('click', () => upload.choose());
  document
    .getElementById('upload-method-submit')
    .addEventListener('click', () => upload.submit());
  document
    .getElementById('upload-method-clear')
    .addEventListener('click', () => upload.clear());
</script>
```

## API

### ve-upload 属性

| 属性名 | 描述 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `action` | 默认上传请求地址。 | `string` | `''` |
| `method` | 默认上传请求方法。 | `string` | `'post'` |
| `name` | 上传表单字段名，支持按文件动态返回。 | `string &#124; ((file: File) => string)` | `'file'` |
| `accept` | 可选择文件类型；对象形式支持 `strict` 控制是否严格过滤。 | `string &#124; { type: string; strict?: boolean }` | `''` |
| `list-type` | 文件列表展示类型。 | `'card' &#124; 'row' &#124; 'tag'` | `'row'` |
| `image-preview` | `card` 图片模式下是否启用内置预览。 | `boolean` | `false` |
| `multiple` | 是否允许多选文件。 | `boolean` | `false` |
| `disabled` | 是否禁用上传交互。 | `boolean` | `false` |
| `drag` | 是否启用拖拽上传区域。 | `boolean` | `false` |
| `directory` | 是否允许目录上传。 | `boolean` | `false` |
| `with-credentials` | 默认请求是否携带凭证。 | `boolean` | `false` |
| `auto-upload` | 选择文件后是否自动上传；HTML 中可写 `auto-upload="false"` 关闭。 | `boolean` | `true` |
| `show-upload-list` | 是否展示文件列表；也可通过 JS 属性传入自定义图标配置。 | `boolean &#124; UploadCustomIconType` | `true` |
| `limit` | 上传数量限制。 | `number &#124; { maxCount: number; hideOnExceedLimit?: boolean } &#124; undefined` | `undefined` |
| `tip` | 上传提示文本。 | `string` | `''` |
| `headers` | 默认请求头，需通过 JS 属性设置。 | `Record<string, string &#124; number &#124; boolean &#124; null &#124; undefined>` | `{}` |
| `data` | 默认请求附加数据，需通过 JS 属性设置。 | `UploadRequestData` | `{}` |
| `customRequest` | 自定义上传请求方法，需通过 JS 属性设置。 | `UploadRequest &#124; undefined` | `undefined` |
| `beforeUpload` | 上传前回调；返回 `false` 会跳过该文件，返回 `File` 会替换上传文件。 | `(file: File, fileList: File[]) => boolean &#124; File &#124; Promise<boolean &#124; File>` | `() => true` |
| `progressProps` | 自定义进度配置；内置列表通常无需设置。 | `UploadProgressProps &#124; undefined` | `undefined` |
| `renderUploadItem` | 自定义单个文件列表项渲染，需通过 JS 属性设置。 | `(originNode: unknown, file: UploadItem, fileList: UploadItem[]) => unknown` | `undefined` |
| `renderUploadList` | 自定义整个文件列表渲染，需通过 JS 属性设置。 | `(fileList: UploadItem[], uploadListProps: UploadListRenderProps) => unknown` | `undefined` |
| `defaultFileList` | 非受控模式下的初始文件列表，需通过 JS 属性设置。 | `UploadItem[]` | `[]` |
| `fileList` | 受控文件列表，需通过 JS 属性设置。 | `UploadItem[] &#124; undefined` | `undefined` |

### UploadItem 类型

| 属性名 | 描述 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `uid` | 文件唯一标识。 | `string` | - |
| `status` | 文件状态。 | `'init' &#124; 'uploading' &#124; 'done' &#124; 'error'` | `'done'` |
| `originFile` | 原始 `File` 对象。 | `File` | - |
| `percent` | 上传进度百分比。 | `number` | - |
| `response` | 上传响应。 | `unknown` | - |
| `url` | 文件访问或缩略图地址。 | `string` | - |
| `name` | 展示文件名。 | `string` | - |
| `size` | 文件字节大小，用于 `row` 元信息展示。 | `number` | - |
| `type` | 文件 MIME 类型，用于图标、缩略图和扩展名推断。 | `string` | - |
| `children` | 兼容自定义内容字段。 | `string` | - |

### UploadCustomIconType 配置

| 属性名 | 描述 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `previewIcon` | 自定义预览图标。 | `unknown &#124; null` | `undefined` |
| `removeIcon` | 自定义删除图标；设为 `null` 可隐藏。 | `unknown &#124; null` | `undefined` |
| `fileIcon` | 自定义文件图标。 | `unknown &#124; null` | `undefined` |
| `reuploadIcon` | 自定义重传图标。 | `unknown &#124; null` | `undefined` |
| `cancelIcon` | 自定义取消上传图标。 | `unknown &#124; null` | `undefined` |
| `startIcon` | 自定义手动开始上传图标。 | `unknown &#124; null` | `undefined` |
| `errorIcon` | 自定义失败图标。 | `unknown &#124; null` | `undefined` |
| `successIcon` | 自定义成功图标。 | `unknown &#124; null` | `undefined` |
| `fileName` | 自定义文件名渲染。 | `(file: UploadItem) => unknown` | `undefined` |
| `progressRender` | 自定义进度展示。 | `(file: UploadItem, originNode: unknown) => unknown` | `undefined` |
| `imageRender` | 自定义图片展示。 | `(file: UploadItem) => unknown` | `undefined` |

### UploadProgressProps 配置

内置 `card` / `row` / `tag` 上传中样式已按设计稿内置处理；以下配置保留给 `renderUploadList` / `renderUploadItem` 等自定义渲染场景。

| 属性名 | 描述 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `width` | 线性进度宽度。 | `number &#124; string` | `undefined` |
| `type` | 进度类型。 | `'circle' &#124; 'line'` | `'circle'` |
| `showText` | 是否展示进度文本。 | `boolean` | `false` |
| `formatText` | 自定义进度文本。 | `(percent: number, file: UploadItem) => string` | `undefined` |

### ve-upload 事件

| 事件名 | 描述 | Payload |
| --- | --- | --- |
| `ve-select` | 文件选择完成时触发。 | `CustomEvent<{ files: UploadItem[] }>` |
| `ve-change` | 文件列表变化时触发。 | `CustomEvent<{ fileList: UploadItem[]; file?: UploadItem }>` |
| `ve-success` | 文件上传成功时触发。 | `CustomEvent<{ file: UploadItem; response?: unknown }>` |
| `ve-error` | 文件上传失败时触发。 | `CustomEvent<{ file: UploadItem; response?: unknown }>` |
| `ve-remove` | 文件被删除后触发。 | `CustomEvent<{ file: UploadItem; fileList: UploadItem[] }>` |
| `ve-exceed-limit` | 文件数量超过限制时触发。 | `CustomEvent<{ files: UploadItem[]; fileList: UploadItem[]; maxCount?: number }>` |
| `ve-drop` | 通过拖拽添加文件后触发。 | `CustomEvent<{ files: UploadItem[] }>` |
| `ve-progress` | 文件上传进度变化时触发。 | `CustomEvent<{ file: UploadItem; event?: ProgressEvent }>` |
| `ve-preview` | 点击文件预览时触发。 | `CustomEvent<{ file: UploadItem }>` |
| `ve-item-click` | 点击内置列表项主体时触发。 | `CustomEvent<{ file: UploadItem; fileList: UploadItem[] }>` |
| `ve-reupload` | 触发文件重传时触发。 | `CustomEvent<{ file: UploadItem }>` |
| `ve-abort` | 取消上传后触发。 | `CustomEvent<{ file: UploadItem }>` |

### ve-upload 方法

| 方法名 | 描述 |
| --- | --- |
| `choose()` | 打开文件选择器。 |
| `submit(file?: UploadItem)` | 手动上传指定文件；未传入文件时上传所有 `init` 状态文件。 |
| `abort(file: UploadItem)` | 取消指定文件上传。 |
| `reupload(file: UploadItem)` | 重新上传指定文件。 |
| `clear()` | 清空文件列表并取消进行中的请求。 |
| `addFiles(files: File[] &#124; FileList)` | 通过 JS 主动添加文件。 |

### ve-upload 插槽

| 插槽名 | 描述 |
| --- | --- |
| `trigger` | 自定义上传触发器。 |
| `tip` | 自定义提示文案。 |
