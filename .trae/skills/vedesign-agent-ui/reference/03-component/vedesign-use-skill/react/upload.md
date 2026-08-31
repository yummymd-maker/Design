`Upload` 用于选择、上传和展示附件，支持多选、数量限制、自动/手动上传、拖拽上传、自定义请求和上传状态事件。

## 何时使用

- 需要在表单、消息输入、知识库或 Agent 工作流中选择并上传文件。
- 需要用 `row`、`card` 或 `tag` 展示已选择或已上传的附件。
- 需要监听选择、上传成功/失败、移除、超出数量限制等上传状态变化。

## 引入组件

```tsx
import { Upload } from '@ve-design/react';
```

## 示例

### 基础用法

默认列表样式，用于展示紧凑的附件信息。

```tsx preview
import { Upload } from '@ve-design/react';

<section style={{ display: 'grid', placeItems: 'center', padding: 32 }}>
  <Upload
    action="/api/upload"
    multiple
    defaultFileList={[
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
    ]}
    style={{ display: 'block', width: 'min(100%, 616px)' }}
  />
</section>;
```

### 卡片列表

用于图片、视频和需要突出展示的附件。开启 `imagePreview` 后，可通过预览操作查看图片。

```tsx preview
import { Upload } from '@ve-design/react';

<section style={{ display: 'grid', placeItems: 'center', padding: 32 }}>
  <Upload
    action="/api/upload"
    listType="card"
    imagePreview
    multiple
    defaultFileList={[
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
    ]}
    style={{ display: 'block', width: 'min(100%, 504px)' }}
  />
</section>;
```

### 标签列表

用于输入框上方、附件栏等空间受限区域。

```tsx preview
import { Upload } from '@ve-design/react';

<section style={{ display: 'grid', placeItems: 'center', padding: 32 }}>
  <Upload
    action="/api/upload"
    listType="tag"
    multiple
    limit={{ maxCount: 6, hideOnExceedLimit: true }}
    defaultFileList={[
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
    ]}
    style={{ display: 'block', width: 'min(100%, 520px)' }}
  />
</section>;
```

### 列表项点击

`row`、`card`、`tag` 三种列表项在 hover 时会展示可点击状态。点击列表项主体会触发 `onItemClick`，可通过 `event.detail.file` 获取当前文件信息；点击移除、预览、重传、开始或取消等内置操作按钮时，不会额外触发列表项点击。

```tsx preview
import { useState } from 'react';
import { Upload } from '@ve-design/react';

function UploadItemClickDemo() {
  const [message, setMessage] = useState('Click an attachment item.');

  return (
    <section
      style={{
        display: 'grid',
        placeItems: 'center',
        gap: 12,
        padding: '32px 24px',
      }}
    >
      <Upload
        action="/api/upload"
        listType="row"
        defaultFileList={[
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
        ]}
        onItemClick={(event) => {
          setMessage(`Clicked: ${event.detail.file.name}`);
        }}
        style={{ display: 'block', width: 'min(100%, 520px)' }}
      />
      <div style={{ color: 'var(--color-text-tertiary)', fontSize: 12 }}>
        {message}
      </div>
    </section>
  );
}
```

### 上传状态

内置列表会根据文件状态展示上传中、完成和失败。

```tsx preview
import { Upload } from '@ve-design/react';

function UploadStateDemo() {
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

  return (
    <section
      style={{ display: 'grid', placeItems: 'center', padding: '32px 24px' }}
    >
      <div
        style={{
          display: 'grid',
          gap: 28,
          justifyItems: 'center',
          width: 'min(100%, 520px)',
        }}
      >
        <Upload
          listType="card"
          defaultFileList={files}
          style={{ display: 'block', width: 'min(100%, 376px)' }}
        />
        <Upload
          defaultFileList={files}
          style={{ display: 'block', width: 'min(100%, 408px)' }}
        />
        <Upload
          listType="tag"
          defaultFileList={files}
          style={{ display: 'block', width: 'min(100%, 420px)' }}
        />
      </div>
    </section>
  );
}
```

### 拖拽上传

用于上传区域较明确的场景。

```tsx preview
import { Upload } from '@ve-design/react';

<section style={{ display: 'grid', placeItems: 'center', padding: 32 }}>
  <Upload
    action="/api/upload"
    drag
    multiple
    accept="image/*"
    tip="Only images can be uploaded"
    style={{ display: 'block', width: 'min(100%, 560px)' }}
  />
</section>;
```

### 自定义请求

通过 `customRequest` 接管上传过程，适合接入业务上传 SDK 或模拟上传进度；失败时应调用 `onError` 让列表进入失败状态。

```tsx preview
import { Upload } from '@ve-design/react';

function UploadCustomRequestDemo() {
  return (
    <section style={{ display: 'grid', placeItems: 'center', padding: 32 }}>
      <Upload
        autoUpload
        customRequest={({ onProgress, onSuccess }) => {
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
        }}
        style={{ display: 'block', width: 'min(100%, 220px)' }}
      />
    </section>
  );
}
```

### 方法

可通过 `ref` 调用 Upload 实例方法，例如 `choose()`、`submit()` 和 `clear()`。

```tsx preview
import { Button, Upload } from '@ve-design/react';
import { useRef, type ComponentRef } from 'react';

function UploadMethodsDemo() {
  const uploadRef = useRef<ComponentRef<typeof Upload> | null>(null);

  return (
    <section style={{ display: 'grid', placeItems: 'center', padding: 32 }}>
      <div style={{ display: 'grid', gap: 12, width: 'min(100%, 520px)' }}>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <Button type="outline" onClick={() => uploadRef.current?.choose()}>
            选择文件
          </Button>
          <Button type="outline" onClick={() => uploadRef.current?.submit()}>
            开始上传
          </Button>
          <Button type="text" onClick={() => uploadRef.current?.clear()}>
            清空列表
          </Button>
        </div>
        <Upload
          ref={uploadRef}
          autoUpload={false}
          action="/api/upload"
          multiple
          defaultFileList={[
            {
              uid: 'manual-ready',
              name: 'Pending.pdf',
              type: 'application/pdf',
              size: 15917342,
              status: 'init',
            },
          ]}
          tip="先选择文件，再点击开始上传。"
          style={{ display: 'block', width: 'min(100%, 520px)' }}
        />
      </div>
    </section>
  );
}
```

## API

### Props

| 属性名             | 描述                                                                | 类型                                                                            | 默认值       |
| ------------------ | ------------------------------------------------------------------- | ------------------------------------------------------------------------------- | ------------ |
| `action`           | 默认上传请求地址。                                                  | `string`                                                                        | `''`         |
| `method`           | 默认上传请求方法。                                                  | `string`                                                                        | `'post'`     |
| `name`             | 上传表单字段名，支持按文件动态返回。                                | `string \| ((file: File) => string)`                                            | `'file'`     |
| `accept`           | 可选择文件类型；对象形式支持 `strict` 控制是否严格过滤。            | `string \| { type: string; strict?: boolean }`                                  | `''`         |
| `listType`         | 文件列表展示类型。                                                  | `'card' \| 'row' \| 'tag'`                                                      | `'row'`      |
| `imagePreview`     | `card` 图片模式下是否启用内置预览。                                 | `boolean`                                                                       | `false`      |
| `multiple`         | 是否允许多选文件。                                                  | `boolean`                                                                       | `false`      |
| `disabled`         | 是否禁用上传交互。                                                  | `boolean`                                                                       | `false`      |
| `drag`             | 是否启用拖拽上传区域。                                              | `boolean`                                                                       | `false`      |
| `directory`        | 是否允许目录上传。                                                  | `boolean`                                                                       | `false`      |
| `withCredentials`  | 默认请求是否携带凭证。                                              | `boolean`                                                                       | `false`      |
| `autoUpload`       | 选择文件后是否自动上传。                                            | `boolean`                                                                       | `true`       |
| `showUploadList`   | 是否展示文件列表；也可传入自定义图标配置。                          | `boolean \| UploadCustomIconType`                                               | `true`       |
| `limit`            | 上传数量限制。                                                      | `number \| { maxCount: number; hideOnExceedLimit?: boolean } \| undefined`      | `undefined`  |
| `tip`              | 上传提示内容。                                                      | `React.ReactNode`                                                               | `''`         |
| `trigger`          | 自定义上传触发器。                                                  | `React.ReactNode`                                                               | `-`          |
| `headers`          | 默认请求头。                                                        | `Record<string, string \| number \| boolean \| null \| undefined>`              | `{}`         |
| `data`             | 默认请求附加数据。                                                  | `UploadRequestData`                                                             | `{}`         |
| `customRequest`    | 自定义上传请求方法。                                                | `UploadRequest \| undefined`                                                    | `undefined`  |
| `beforeUpload`     | 上传前回调；返回 `false` 会跳过该文件，返回 `File` 会替换上传文件。 | `(file: File, fileList: File[]) => boolean \| File \| Promise<boolean \| File>` | `() => true` |
| `progressProps`    | 自定义进度配置。                                                    | `UploadProgressProps \| undefined`                                              | `undefined`  |
| `renderUploadItem` | 自定义单个文件列表项渲染。                                          | `(originNode: unknown, file: UploadItem, fileList: UploadItem[]) => unknown`    | `undefined`  |
| `renderUploadList` | 自定义整个文件列表渲染。                                            | `(fileList: UploadItem[], uploadListProps: UploadListRenderProps) => unknown`   | `undefined`  |
| `defaultFileList`  | 非受控模式下的初始文件列表。                                        | `UploadItem[]`                                                                  | `[]`         |
| `fileList`         | 受控文件列表。                                                      | `UploadItem[] \| undefined`                                                     | `undefined`  |
| `children`         | 组件内容。                                                          | `React.ReactNode`                                                               | `-`          |

### 事件

| 事件名          | 描述                     | 参数类型                                                                          |
| --------------- | ------------------------ | --------------------------------------------------------------------------------- |
| `onSelect`      | 文件选择完成时触发。     | `CustomEvent<{ files: UploadItem[] }>`                                            |
| `onChange`      | 文件列表变化时触发。     | `CustomEvent<{ fileList: UploadItem[]; file?: UploadItem }>`                      |
| `onSuccess`     | 文件上传成功时触发。     | `CustomEvent<{ file: UploadItem; response?: unknown }>`                           |
| `onError`       | 文件上传失败时触发。     | `CustomEvent<{ file: UploadItem; response?: unknown }>`                           |
| `onRemove`      | 文件被删除后触发。       | `CustomEvent<{ file: UploadItem; fileList: UploadItem[] }>`                       |
| `onExceedLimit` | 文件数量超过限制时触发。 | `CustomEvent<{ files: UploadItem[]; fileList: UploadItem[]; maxCount?: number }>` |
| `onDrop`        | 通过拖拽添加文件后触发。 | `CustomEvent<{ files: UploadItem[] }>`                                            |
| `onProgress`    | 文件上传进度变化时触发。 | `CustomEvent<{ file: UploadItem; event?: ProgressEvent }>`                        |
| `onPreview`     | 点击文件预览时触发。     | `CustomEvent<{ file: UploadItem }>`                                               |
| `onItemClick`   | 点击内置列表项主体时触发。 | `CustomEvent<{ file: UploadItem; fileList: UploadItem[] }>`                       |
| `onReupload`    | 触发文件重传时触发。     | `CustomEvent<{ file: UploadItem }>`                                               |
| `onAbort`       | 取消上传后触发。         | `CustomEvent<{ file: UploadItem }>`                                               |

### 类型

#### UploadItem

| 属性名       | 描述                   | 类型                                         | 默认值   |
| ------------ | ---------------------- | -------------------------------------------- | -------- |
| `uid`        | 文件唯一标识。         | `string`                                     | -        |
| `status`     | 文件状态。             | `'init' \| 'uploading' \| 'done' \| 'error'` | `'done'` |
| `originFile` | 原始 `File` 对象。     | `File`                                       | -        |
| `percent`    | 上传进度百分比。       | `number`                                     | -        |
| `response`   | 上传响应。             | `unknown`                                    | -        |
| `url`        | 文件访问或缩略图地址。 | `string`                                     | -        |
| `name`       | 展示文件名。           | `string`                                     | -        |
| `size`       | 文件字节大小。         | `number`                                     | -        |
| `type`       | 文件 MIME 类型。       | `string`                                     | -        |
| `children`   | 兼容自定义内容字段。   | `string`                                     | -        |

#### UploadCustomIconType

| 属性名           | 描述                                 | 类型                                                 | 默认值      |
| ---------------- | ------------------------------------ | ---------------------------------------------------- | ----------- |
| `previewIcon`    | 自定义预览图标。                     | `unknown \| null`                                    | `undefined` |
| `removeIcon`     | 自定义删除图标；设为 `null` 可隐藏。 | `unknown \| null`                                    | `undefined` |
| `fileIcon`       | 自定义文件图标。                     | `unknown \| null`                                    | `undefined` |
| `reuploadIcon`   | 自定义重传图标。                     | `unknown \| null`                                    | `undefined` |
| `cancelIcon`     | 自定义取消上传图标。                 | `unknown \| null`                                    | `undefined` |
| `startIcon`      | 自定义手动开始上传图标。             | `unknown \| null`                                    | `undefined` |
| `errorIcon`      | 自定义失败图标。                     | `unknown \| null`                                    | `undefined` |
| `successIcon`    | 自定义成功图标。                     | `unknown \| null`                                    | `undefined` |
| `fileName`       | 自定义文件名渲染。                   | `(file: UploadItem) => unknown`                      | `undefined` |
| `progressRender` | 自定义进度展示。                     | `(file: UploadItem, originNode: unknown) => unknown` | `undefined` |
| `imageRender`    | 自定义图片展示。                     | `(file: UploadItem) => unknown`                      | `undefined` |

#### UploadProgressProps

| 属性名       | 描述               | 类型                                            | 默认值      |
| ------------ | ------------------ | ----------------------------------------------- | ----------- |
| `width`      | 线性进度宽度。     | `number \| string`                              | `undefined` |
| `type`       | 进度类型。         | `'circle' \| 'line'`                            | `'circle'`  |
| `showText`   | 是否展示进度文本。 | `boolean`                                       | `false`     |
| `formatText` | 自定义进度文本。   | `(percent: number, file: UploadItem) => string` | `undefined` |

### Ref

可通过 `ref` 调用上传实例方法，包括 `choose()`、`submit(file?)`、`abort(file)`、`reupload(file)`、`clear()`、`addFiles(files)`。
