`ChatInput` 是面向 AI 对话与 Agent 场景的输入组件：在富文本编辑能力之上，组合聚焦、输入、已完成、生成中等视觉状态，并提供全屏编辑、停止生成、命令面板、内联节点、附件展示与工具栏操作能力。

`value` 同时兼容两种形态：

- **普通字符串**（最常见）：`value="帮我写一段文案"`，等价于一段纯文本。
- **结构化对象** `{ segments, attachments }`：用于承载内联节点（tag / select / 变量槽 / 自定义组件）与附件。

配套的 `ChatInputAction` 提供圆角按钮与下拉触发器，适合放在工具栏操作区承载「添加附件 / 联网 / 模型 / 深度思考 / 语音」等输入辅助操作。

## 何时使用

- 构建通用 AI 对话、智能助手工作台或智能助手面板的输入区域。
- 需要通过 `/`、`@`、`#` 等命令唤起命令面板（唤起键、面板内容均可自定义）。
- 需要变量槽、Prompt 模板（占位文本中某些位置允许用户重新输入或选择），以及自定义渲染内联组件。
- 需要上传文件（图片、文档、markdown 等）并在输入框中展示附件。
- 需要生成中停止、全屏编辑、Border Glow 等能力。

## 必需流光边框

设计助手 Agent 的 Composer / ChatInput 必须使用本 skill 提供的 `shimmer-border` 流光动效。不要只开启 `ChatInput` 的 `borderGlow`;`borderGlow` 是组件内置鼠标跟随边框能力,不能替代本 skill 要求的 `motion/shimmer-border.css` + `motion/shimmer-border.js`。

React 页面仍然必须使用 `ChatInput` 组件承载输入、发送、停止、附件和命令面板能力,但流光视觉要挂在真正拥有输入框圆角和可见边框的 Composer shell 上:

```tsx
import { useEffect } from 'react';
import { ChatInput } from '@ve-design/react';
import './motion/shimmer-border.css';
import './motion/shimmer-border.js';

function DesignComposer() {
  useEffect(() => {
    window.autoInitShimmerBorders?.();
  }, []);

  return (
    <div
      className="composer ved-shimmer-host"
      data-shimmer
      data-shimmer-radius="20"
      data-shimmer-stroke="1.5"
      data-shimmer-duration="2.7"
      data-shimmer-loops="1"
    >
      <ChatInput placeholder="有问题，尽管问" />
    </div>
  );
}
```

若项目不使用全局 script,可把 `reference/04-asset/motion/shimmer-border.js` 的初始化逻辑作为项目 utility 引入。验收标准是进入页面或重新触发时 SVG 流光沿输入框视觉边框单圈扫过,不是出现在外层布局容器边缘。`data-shimmer-radius` 必须等于 Composer shell 的 `border-radius` 像素值。

## 引入组件

```tsx
import { ChatInput, ChatInputAction } from '@ve-design/react';
import type {
  ChatInputValue,
  ChatInputSegment,
  ChatInputAttachment,
  ChatInputTrigger,
  ChatInputNodeRenders,
} from '@ve-design/react';
```

## 内容模型

`value` 是组件的单一事实来源，接受 `string` 或结构化对象：

```ts
// 形态一：普通字符串（大部分场景）
type Plain = string;

// 形态二：结构化对象
interface ChatInputValue {
  segments: ChatInputSegment[]; // 线性内容段
  attachments: ChatInputAttachment[]; // 独立附件列表
}

// segment 是「文本段」或「节点段（内联岛屿）」二者之一
type ChatInputSegment = ChatInputTextSegment | ChatInputNodeSegment;

interface ChatInputTextSegment {
  type: 'text';
  text: string;
}

interface ChatInputNodeSegment {
  type: 'node';
  id: string; // 稳定 id，作为 DOM key
  nodeType: string; // 渲染 key：'tag' | 'select' | 'variable' | 自定义
  data?: Record<string, unknown>; // 透传给 render 的数据
}

interface ChatInputAttachment {
  id: string;
  name: string;
  kind?: string; // 'image' | 'file' | ...，用于挑选图标
  size?: number;
  url?: string;
  thumbUrl?: string; // 图片缩略图
  status?: 'uploading' | 'done' | 'error';
  percent?: number; // status==='uploading' 时的进度
  meta?: Record<string, unknown>;
}
```

`onChange` / `onSubmit` 的 `detail` 为 `{ value: string, data: ChatInputValue }`：

- `value`：把当前内容拍平成的**纯文本字符串**（内联节点、附件都会被转成对应文本），普通文本场景可直接回写（例如 `setValue(event.detail.value)`）。
- `data`：规范化后的**结构化对象** `{ segments, attachments }`，用于持久化或保留内联节点 / 附件时回写（例如 `setValue(event.detail.data)`）。

## 示例

### 基础用法（字符串）

最小受控写法：监听 `onChange` 写回 `value`，监听 `onSubmit` 处理提交。大部分场景下，直接用字符串即可。

```tsx preview
import { useState } from 'react';
import { ChatInput } from '@ve-design/react';

function ChatInputBasicDemo() {
  const [value, setValue] = useState('');
  const [submitted, setSubmitted] = useState('尚未提交');

  return (
    <section style={{ display: 'grid', gap: 12, padding: 24 }}>
      <ChatInput
        value={value}
        placeholder="有问题，尽管问"
        onChange={(event) => setValue(event.detail.value)}
        onSubmit={(event) => {
          setSubmitted(`已提交：${event.detail.value}`);
          setValue('');
        }}
      />
      <div style={{ fontSize: 13, color: 'var(--color-text-tertiary)' }}>{submitted}</div>
    </section>
  );
}
```

### 生成中（停止）

将 `loading` 切换为 `true`，右侧按钮会变成圆形停止按钮，点击触发 `onCancel`。常用于对接流式回复期间的「停止生成」操作。

```tsx preview
import { useState } from 'react';
import { ChatInput } from '@ve-design/react';

function ChatInputLoadingDemo() {
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('Idle · 空闲');

  return (
    <section style={{ display: 'grid', gap: 12, padding: 24 }}>
      <ChatInput
        value={value}
        loading={loading}
        placeholder="提交后会进入生成态 · Submit to enter loading"
        onChange={(event) => setValue(event.detail.value)}
        onSubmit={(event) => {
          setLoading(true);
          setStatus(`Generating · 生成中：${event.detail.value}`);
        }}
        onCancel={() => {
          setLoading(false);
          setStatus('Cancelled · 已取消');
        }}
      />
      <div style={{ fontSize: 13, color: 'var(--color-text-tertiary)' }}>{status}</div>
    </section>
  );
}
```

### 工具栏 Action（`+` 号菜单 / 联网 / 模型 / 深度思考）

通过 `leftAction` 和 `rightAction` 传入工具栏内容。`ChatInputAction` 支持 `status="active"` 表达激活态、`type="dropdown"` 表达带箭头的下拉触发器（菜单内容由外部浮层组件组合），`iconOnly` 表达纯图标按钮。工具栏最左侧常见做法是放一个 `+` 号「添加」入口——用 `Dropdown` 组织一级命令，用 `DropdownSubItem` 承载二级子菜单（如「拓展」下的更多能力）。

```tsx preview
import { useMemo, useState } from 'react';
import {
  ChatInput,
  ChatInputAction,
  Dropdown,
  DropdownItem,
  DropdownSubItem,
} from '@ve-design/react';
import {
  IconAdd,
  IconImage,
  IconFile,
  IconPlugin,
  IconGlobe,
  IconMicrophone,
} from '@ve-design/react/icons';

const labelStyle = { display: 'flex', alignItems: 'center', gap: 8 } as const;

function ChatInputActionsDemo() {
  const [value, setValue] = useState('');
  const [model, setModel] = useState('Model A');
  const [modelOpen, setModelOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [activeActions, setActiveActions] = useState(['研究']);
  const [added, setAdded] = useState('');

  const stateText = useMemo(() => {
    const active = activeActions.length
      ? `${activeActions.join(' / ')} 已激活`
      : '无激活项';
    return `当前：${active}，模型 ${model}${added ? ` · ${added}` : ''}`;
  }, [activeActions, model, added]);

  const toggleAction = (name: string) => {
    setActiveActions((prev) =>
      prev.includes(name)
        ? prev.filter((item) => item !== name)
        : [...prev, name],
    );
  };

  return (
    <section style={{ display: 'grid', gap: 12, padding: 24 }}>
      <ChatInput
        value={value}
        placeholder="Try the actions below · 试试下方按钮"
        onChange={(event) => setValue(event.detail.value)}
        onSubmit={(event) => console.log('submit:', event.detail.value)}
        leftAction={
          <>
            <Dropdown
              trigger="click"
              position="top-start"
              onOpenChange={(event) => setAddOpen(event.detail.open)}
              onSelect={(event) => setAdded(`已添加：${event.detail.value}`)}
              triggerNode={
                <ChatInputAction iconOnly open={addOpen} aria-label="添加" icon={<IconAdd />} />
              }
            >
              <DropdownItem value="upload-image">
                <span style={labelStyle}><IconImage />上传图片</span>
              </DropdownItem>
              <DropdownItem value="upload-file">
                <span style={labelStyle}><IconFile />上传文件</span>
              </DropdownItem>
              <DropdownSubItem label={<span style={labelStyle}><IconPlugin />拓展</span>}>
                <DropdownItem value="ext-web">联网搜索</DropdownItem>
                <DropdownItem value="ext-code">代码解释器</DropdownItem>
                <DropdownItem value="ext-mcp">MCP 工具</DropdownItem>
              </DropdownSubItem>
            </Dropdown>
            <ChatInputAction
              status={activeActions.includes('联网') ? 'active' : 'default'}
              icon={<IconGlobe />}
              onActionClick={() => toggleAction('联网')}
            >
              联网
            </ChatInputAction>
            <ChatInputAction
              status={activeActions.includes('深度思考') ? 'active' : 'default'}
              onActionClick={() => toggleAction('深度思考')}
            >
              深度思考
            </ChatInputAction>
            <Dropdown
              trigger="click"
              selection="single"
              position="bottom-start"
              defaultValue={model}
              onOpenChange={(event) => setModelOpen(event.detail.open)}
              onChange={(event) => setModel(String(event.detail.value))}
              triggerNode={
                <ChatInputAction type="dropdown" open={modelOpen}>
                  {model}
                </ChatInputAction>
              }
            >
              <DropdownItem value="Model A">Model A</DropdownItem>
              <DropdownItem value="Model B">Model B</DropdownItem>
              <DropdownItem value="Model C">Model C</DropdownItem>
            </Dropdown>
            <ChatInputAction
              status={activeActions.includes('研究') ? 'active' : 'default'}
              onActionClick={() => toggleAction('研究')}
            >
              研究
            </ChatInputAction>
          </>
        }
        rightAction={
          <ChatInputAction iconOnly aria-label="语音输入" icon={<IconMicrophone />} />
        }
      />
      <div style={{ fontSize: 13, color: 'var(--color-text-tertiary)' }}>{stateText}</div>
    </section>
  );
}
```

### 全屏切换

设置 `expandable` 后，box 右上角会出现切换按钮，点击在常规态与全屏态之间切换，并触发 `onExpandChange`。

```tsx preview
import { useState } from 'react';
import { ChatInput } from '@ve-design/react';

function ChatInputExpandableDemo() {
  const [value, setValue] = useState('');

  return (
    <section style={{ display: 'grid', gap: 12, padding: 24 }}>
      <ChatInput
        expandable
        value={value}
        placeholder="尝试点击右上角全屏按钮 · Try the expand button"
        onChange={(event) => setValue(event.detail.value)}
        onExpandChange={(event) => console.log('expanded:', event.detail.expanded)}
        onSubmit={(event) => console.log('[submit]', event.detail.value, event.detail.data)}
      />
    </section>
  );
}
```

### 结构化 value（segments + attachments）

直接给 `value` 传 `{ segments, attachments }`，可以预置内联节点与附件。下例预置了一个 `tag` 节点、一段文本，以及一张「上传完成」的图片附件与一份「上传中」的文档附件。点击附件上的关闭按钮会触发 `onAttachmentRemove`。

```tsx preview
import { useState } from 'react';
import { ChatInput } from '@ve-design/react';
import type { ChatInputValue } from '@ve-design/react';

const initial: ChatInputValue = {
  segments: [
    { type: 'node', id: 'm1', nodeType: 'tag', data: { label: '设计稿' } },
    { type: 'text', text: ' 帮我润色这段说明文字' },
  ],
  attachments: [
    { id: 'a1', name: 'cover.png', kind: 'image', status: 'done', thumbUrl: 'https://picsum.photos/seed/ci/48' },
    { id: 'a2', name: 'spec.md', kind: 'file', status: 'uploading', percent: 60 },
  ],
};

function ChatInputStructuredDemo() {
  const [value, setValue] = useState<ChatInputValue>(initial);

  return (
    <section style={{ display: 'grid', gap: 12, padding: 24 }}>
      <ChatInput
        value={value}
        placeholder="结构化内容"
        onChange={(event) => setValue(event.detail.data)}
        onAttachmentRemove={(event) => console.log('removed:', event.detail.id)}
        onSubmit={(event) => console.log('[submit]', event.detail.value, event.detail.data)}
      />
    </section>
  );
}
```

### 上传附件

附件由 `value.attachments` 驱动，展示区位于编辑器上方，每个附件卡片支持缩略图 / 图标、上传进度（`status: 'uploading'` + `percent`）与失败态（`status: 'error'`），内置关闭按钮触发 `onAttachmentRemove`。

用 `Upload` 作为来源：关闭自动上传（`autoUpload={false}`）与内置文件列表（`showUploadList={false}`），在 `onSelect` 里拿到本地文件后自行往 `value.attachments` 里追加占位项（`uploading`），再模拟进度直至 `done`；下例预置了一张「已完成」与一张「上传失败」的附件演示各种状态。

```tsx preview
import { useState } from 'react';
import { ChatInput, ChatInputAction, Upload } from '@ve-design/react';
import { IconImage } from '@ve-design/react/icons';
import type { ChatInputValue, ChatInputAttachment } from '@ve-design/react';

const initial: ChatInputValue = {
  segments: [],
  attachments: [
    { id: 'seed-done', name: 'cover.png', kind: 'image', status: 'done', thumbUrl: 'https://picsum.photos/seed/ci-done/64' },
    { id: 'seed-error', name: 'broken.png', kind: 'image', status: 'error' },
  ],
};

function ChatInputUploadDemo() {
  const [value, setValue] = useState<ChatInputValue>(initial);

  const patchAttachment = (id: string, patch: Partial<ChatInputAttachment>) => {
    setValue((prev) => ({
      segments: prev.segments,
      attachments: prev.attachments.map((a) => (a.id === id ? { ...a, ...patch } : a)),
    }));
  };

  return (
    <section style={{ display: 'grid', gap: 12, padding: 24 }}>
      <ChatInput
        value={value}
        placeholder="添加图片，看看附件展示区"
        onChange={(event) => setValue(event.detail.data)}
        onAttachmentRemove={(event) => console.log('removed:', event.detail.id)}
        onSubmit={(event) => console.log('[submit]', event.detail.value, event.detail.data)}
        leftAction={
          <Upload
            accept="image/*"
            multiple
            autoUpload={false}
            showUploadList={false}
            onSelect={(event) => {
              for (const item of event.detail.files) {
                const file = item.originFile;
                if (!file) continue;
                const id = item.uid;
                const thumbUrl = URL.createObjectURL(file);
                setValue((prev) => ({
                  segments: prev.segments,
                  attachments: [
                    ...prev.attachments,
                    { id, name: file.name, kind: 'image', status: 'uploading', percent: 0, thumbUrl },
                  ],
                }));

                let percent = 0;
                const timer = setInterval(() => {
                  percent += 20;
                  if (percent >= 100) {
                    clearInterval(timer);
                    patchAttachment(id, { status: 'done', percent: 100 });
                  } else {
                    patchAttachment(id, { percent });
                  }
                }, 300);
              }
            }}
            trigger={
              <ChatInputAction iconOnly aria-label="上传图片" icon={<IconImage />} />
            }
          />
        }
      />
    </section>
  );
}
```

### 引用块 / 上下文卡片（header 插槽）

`header` 用于在编辑器上方展示引用源、上下文卡片等（附件展示区由组件自动渲染，与此并存）。下例用一个带竖线与关闭按钮的引用块承载「引用的上文」——引用块本身不需要额外的 `padding` / `margin`，直接贴合编辑器上沿即可。

```tsx preview
import { useState } from 'react';
import { ChatInput } from '@ve-design/react';
import { IconClose } from '@ve-design/react/icons';

function ChatInputQuoteDemo() {
  const [value, setValue] = useState('');
  const [quoted, setQuoted] = useState(true);

  return (
    <section style={{ display: 'grid', gap: 12, padding: 24 }}>
      <ChatInput
        value={value}
        placeholder="基于引用内容继续提问"
        onChange={(event) => setValue(event.detail.value)}
        onSubmit={(event) => console.log('[submit]', event.detail.value, event.detail.data)}
        header={
          quoted ? (
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 8,
                borderRadius: 8,
                background: 'var(--color-bg-muted)',
              }}
            >
              <span style={{ width: 2, alignSelf: 'stretch', borderRadius: 1, background: 'var(--color-border-default)', flex: 'none' }} />
              <span
                style={{
                  flex: 1,
                  minWidth: 0,
                  fontSize: 13,
                  lineHeight: '20px',
                  color: 'var(--color-text-secondary)',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                引用：Agent 在第 3 步调用了搜索工具，返回了 12 条结果……
              </span>
              <button
                aria-label="移除引用"
                onClick={() => setQuoted(false)}
                style={{ border: 'none', background: 'none', padding: 2, cursor: 'pointer', color: 'var(--color-text-tertiary)', display: 'inline-flex', flex: 'none' }}
              >
                <IconClose style={{ fontSize: 14 }} />
              </button>
            </div>
          ) : undefined
        }
      />
    </section>
  );
}
```

### 变量槽 / Prompt 模板

`variable` 是内置的**可编辑**节点：渲染为一个可输入的内联区域，光标可进入、其文本计入 `value`。配合普通文本段，可以拼出「填空式」Prompt 模板。

```tsx preview
import { useState } from 'react';
import { ChatInput } from '@ve-design/react';
import type { ChatInputValue } from '@ve-design/react';

const template: ChatInputValue = {
  segments: [
    { type: 'text', text: '帮我给 ' },
    { type: 'node', id: 'v1', nodeType: 'variable', data: { value: '', placeholder: '产品名' } },
    { type: 'text', text: ' 写一句 ' },
    { type: 'node', id: 'v2', nodeType: 'variable', data: { value: '', placeholder: '风格' } },
    { type: 'text', text: ' 风格的 slogan' },
  ],
  attachments: [],
};

function ChatInputVariableDemo() {
  const [value, setValue] = useState<ChatInputValue>(template);
  const [text, setText] = useState('');

  return (
    <section style={{ display: 'grid', gap: 12, padding: 24 }}>
      <ChatInput
        value={value}
        placeholder="填写模板"
        onChange={(event) => {
          setValue(event.detail.data);
          setText(event.detail.value);
        }}
        onSubmit={(event) => console.log('[submit]', event.detail.value, event.detail.data)}
      />
      <div style={{ fontSize: 13, color: 'var(--color-text-tertiary)' }}>当前文本：{text}</div>
    </section>
  );
}
```

### 内置内联节点（tag / select）

`tag`、`select` 都是**不可编辑**的内联节点：`tag` 用于展示业务标签，`select` 内嵌普通下拉供用户切换取值，切换后回写到该节点 `data.value`。下例演示在客服分析场景中固定一个业务范围标签，并允许用户切换报告语言。

```tsx preview
import { useState } from 'react';
import { ChatInput } from '@ve-design/react';
import type { ChatInputValue } from '@ve-design/react';

const initial: ChatInputValue = {
  segments: [
    { type: 'text', text: '请基于 ' },
    { type: 'node', id: 't1', nodeType: 'tag', data: { label: '#客户支持', value: 'support' } },
    { type: 'text', text: ' 的近 7 天会话数据，生成一份 ' },
    { type: 'node', id: 's1', nodeType: 'select', data: { value: '中文', options: ['中文', 'English', '日本語'] } },
    { type: 'text', text: ' 分析报告' },
  ],
  attachments: [],
};

function ChatInputNodesDemo() {
  const [value, setValue] = useState<ChatInputValue>(initial);
  const languageNode = value.segments.find(
    (segment) => segment.type === 'node' && segment.id === 's1',
  );
  const status = `当前配置：客户支持，${languageNode?.data?.value ?? '中文'}`;

  return (
    <section style={{ display: 'grid', gap: 12, padding: 24 }}>
      <ChatInput
        value={value}
        placeholder="描述你要生成的分析报告"
        onChange={(event) => setValue(event.detail.data)}
        onSubmit={(event) => {
          console.log('[submit]', event.detail.value, event.detail.data);
        }}
      />
      <div style={{ fontSize: 13, color: 'var(--color-text-tertiary)' }}>{status}</div>
    </section>
  );
}
```

### 命令面板 A：紧贴快捷键（光标）弹出

在 `<ChatInput>` 内声明 `<ChatInput.Panel trigger="/" placement="caret">` 即可：组件会**自动**根据它推导唤起键与面板配置，并在输入 `/` 时展示、定位面板。`placement="caret"` 时面板**紧贴刚输入的 `/` 字符**弹出。无需手写 slot，也无需手动同步 `key`。

面板的**内容与交互完全由业务提供**——把面板体作为 `<ChatInput.Panel>` 的子节点写进去即可。组件只负责容器和定位，保持轻量。选中项时调用 ref 上的 `insertNode()` 把节点插入编辑器（会自动替换刚输入的 `/query` 并关闭面板）。

> 想在选中后保留插入的内联节点，需要用**结构化 value** 受控：`value` 存 `{ segments, attachments }`，`onChange` 里写回 `event.detail.data`（而非纯文本 `event.detail.value`），否则受控回写的纯文本会把结构化节点抹平。

```tsx preview
import { useRef, useState, type ElementRef } from 'react';
import { ChatInput } from '@ve-design/react';
import type { ChatInputValue } from '@ve-design/react';
import {
  IconImage,
  IconRobot,
  IconMonitor,
  IconTelescope,
  IconGlobe,
} from '@ve-design/react/icons';

// 每项含图标与所属分组，分组之间用分隔线隔开
const menuItems = [
  { value: 'create-image', label: '创建图片', Icon: IconImage, group: 1 },
  { value: 'agent-mode', label: '代理模式', Icon: IconRobot, group: 1 },
  { value: 'share-screen', label: '共享屏幕和应用', Icon: IconMonitor, group: 2 },
  { value: 'deep-research', label: '深度研究', Icon: IconTelescope, group: 2 },
  { value: 'web-search', label: '网页搜索', Icon: IconGlobe, group: 2 },
];

function ChatInputCaretDemo() {
  const inputRef = useRef<ElementRef<typeof ChatInput>>(null);
  const [value, setValue] = useState<ChatInputValue>({ segments: [], attachments: [] });
  const [query, setQuery] = useState('');
  const [active, setActive] = useState('');
  const [selected, setSelected] = useState('尚未选中');

  const list = menuItems.filter((it) =>
    it.label.toLowerCase().includes(query.toLowerCase()),
  );

  const choose = (it: (typeof menuItems)[number]) => {
    inputRef.current?.insertNode({
      id: crypto.randomUUID(),
      type: 'node',
      nodeType: 'tag',
      data: { label: it.label, value: it.value, icon: 'skill', iconPosition: 'before' },
    });
    setSelected(`已插入：${it.label}`);
  };

  return (
    <section style={{ display: 'grid', gap: 12, padding: 24 }}>
      <ChatInput
        ref={inputRef}
        value={value}
        placeholder="输入 / 让面板贴着光标弹出"
        onChange={(event) => setValue(event.detail.data)}
        onTrigger={(event) => setQuery(event.detail.query)}
        onSubmit={(event) => {
          console.log('[submit]', event.detail.value, event.detail.data);
          setSelected(`已提交：${event.detail.value}`);
        }}
      >
        <ChatInput.Panel trigger="/" placement="caret">
          <div
            role="listbox"
            style={{
              minWidth: 240,
              padding: 'var(--space-xxxs)',
              borderRadius: 'var(--radius-lg)',
              background: 'var(--color-bg-overlay)',
              boxShadow: 'var(--shadow-md)',
              border: '1px solid var(--color-border-default)',
              fontFamily: 'var(--font-sans)',
            }}
          >
            {list.length === 0 ? (
              <div
                style={{
                  padding: 'var(--space-xxs) var(--space-xs)',
                  fontSize: 'var(--text-body-sm)',
                  color: 'var(--color-text-tertiary)',
                }}
              >
                无匹配项
              </div>
            ) : (
              list.map((it, i) => {
                const showDivider = i > 0 && it.group !== list[i - 1].group;
                return (
                  <div key={it.value}>
                    {showDivider && (
                      <div
                        style={{
                          height: 1,
                          margin: 'var(--space-xxxs) var(--space-xxs)',
                          background: 'var(--color-border-default)',
                        }}
                      />
                    )}
                    <div
                      role="option"
                      onMouseEnter={() => setActive(it.value)}
                      onMouseLeave={() => setActive('')}
                      onMouseDown={(event) => {
                        event.preventDefault();
                        choose(it);
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--space-xxs)',
                        padding: 'var(--space-xxs) var(--space-xs)',
                        borderRadius: 'var(--radius-sm)',
                        cursor: 'pointer',
                        fontSize: 'var(--text-body)',
                        lineHeight: 'var(--line-height-body)',
                        color: 'var(--color-text-primary)',
                        background:
                          active === it.value ? 'var(--color-bg-muted)' : 'transparent',
                      }}
                    >
                      <it.Icon
                        style={{ fontSize: 16, color: 'var(--color-icon-secondary)' }}
                      />
                      <span>{it.label}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </ChatInput.Panel>
      </ChatInput>
      <div style={{ fontSize: 13, color: 'var(--color-text-tertiary)' }}>{selected}</div>
    </section>
  );
}
```

### 命令面板 B：浮在聊天框顶部

如果希望面板**浮在聊天框顶部**（而不是紧贴光标），只需把 `<ChatInput.Panel>` 的 `placement` 设为 `'top'`——这是最常见的命令面板形态。`top` 时面板会**与输入框同宽**，铺满整个聊天框顶部；面板内容依旧作为子节点放入，把面板体的宽度设为 `100%` 即可自适应。

```tsx preview
import { useRef, useState, type ElementRef } from 'react';
import { ChatInput } from '@ve-design/react';
import type { ChatInputValue } from '@ve-design/react';
import { IconCornerDownLeft } from '@ve-design/react/icons';

const topItems = [
  { value: 'ui-tester', label: 'UI review skill', command: '/run ui-test' },
  { value: 'agent-design', label: 'Agent planning skill', command: '/create agent-flow' },
  { value: 'ux-tester', label: 'UX review skill', command: '/review user-journey' },
];

function ChatInputPanelTopDemo() {
  const inputRef = useRef<ElementRef<typeof ChatInput>>(null);
  const [value, setValue] = useState<ChatInputValue>({ segments: [], attachments: [] });
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const [selected, setSelected] = useState('尚未选中');

  const list = topItems.filter((it) =>
    it.label.toLowerCase().includes(query.toLowerCase()),
  );

  const choose = (it: (typeof topItems)[number]) => {
    inputRef.current?.insertNode({
      id: crypto.randomUUID(),
      type: 'node',
      nodeType: 'tag',
      data: { label: it.label, value: it.value, icon: 'skill', iconPosition: 'before' },
    });
    setSelected(`已插入：${it.label}`);
  };

  return (
    <section style={{ display: 'grid', gap: 12, padding: 24 }}>
      <ChatInput
        ref={inputRef}
        value={value}
        placeholder="输入 / 让面板浮在聊天框顶部"
        onChange={(event) => setValue(event.detail.data)}
        onTrigger={(event) => setQuery(event.detail.query)}
        onSubmit={(event) => {
          console.log('[submit]', event.detail.value, event.detail.data);
          setSelected(`已提交：${event.detail.value}`);
        }}
      >
        <ChatInput.Panel trigger="/" placement="top">
          <div
            role="listbox"
            style={{
              width: '100%',
              boxSizing: 'border-box',
              padding: 'var(--space-xxxs)',
              borderRadius: 'var(--radius-lg)',
              background: 'var(--color-bg-overlay)',
              boxShadow: 'var(--shadow-md)',
              border: '1px solid var(--color-border-default)',
              fontFamily: 'var(--font-sans)',
            }}
          >
            <div
              style={{
                padding: 'var(--space-xxs) var(--space-xs) var(--space-xxxs)',
                fontSize: 'var(--text-caption)',
                color: 'var(--color-text-tertiary)',
              }}
            >
              Skill
            </div>
            {list.length === 0 ? (
              <div
                style={{
                  padding: 'var(--space-xxs) var(--space-xs)',
                  fontSize: 'var(--text-body-sm)',
                  color: 'var(--color-text-tertiary)',
                }}
              >
                无匹配项
              </div>
            ) : (
              list.map((it, i) => (
                <div
                  key={it.value}
                  role="option"
                  aria-selected={activeIndex === i}
                  onMouseEnter={() => setActiveIndex(i)}
                  onMouseDown={(event) => {
                    event.preventDefault();
                    choose(it);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-xxs)',
                    padding: 'var(--space-xxs) var(--space-xs)',
                    borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer',
                    background:
                      activeIndex === i ? 'var(--color-bg-muted)' : 'transparent',
                  }}
                >
                  <span
                    style={{
                      fontSize: 'var(--text-body)',
                      color: 'var(--color-text-primary)',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {it.label}
                  </span>
                  <span
                    style={{
                      flex: 1,
                      minWidth: 0,
                      fontFamily: 'var(--font-mono)',
                      fontSize: 'var(--text-caption)',
                      color: 'var(--color-text-tertiary)',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {it.command}
                  </span>
                  {activeIndex === i && (
                    <IconCornerDownLeft
                      style={{ fontSize: 14, color: 'var(--color-icon-secondary)' }}
                    />
                  )}
                </div>
              ))
            )}
          </div>
        </ChatInput.Panel>
      </ChatInput>
      <div style={{ fontSize: 13, color: 'var(--color-text-tertiary)' }}>{selected}</div>
    </section>
  );
}
```

### 命令面板 C：多关键字触发（`/` 技能 · `@` 成员 · `#` 话题）

真实场景里，一个输入框往往要同时支持多种触发字符：`/` 唤起技能、`@` 提及成员、`#` 关联话题。只需在 `<ChatInput>` 内声明**多个 `<ChatInput.Panel>`**（各绑不同 `trigger`），组件会依据当前输入的前缀**自动切换到对应面板**。面板内容建议优先用组件库里的组件与图标组合——技能用图标 + 标签，成员用 `Avatar`，话题用 `Tag`。

```tsx preview
import { useRef, useState, type ElementRef } from 'react';
import { ChatInput, Avatar, Tag } from '@ve-design/react';
import type { ChatInputValue } from '@ve-design/react';
import {
  IconImage,
  IconRobot,
  IconGlobe,
  IconCornerDownLeft,
} from '@ve-design/react/icons';

const skills = [
  { value: 'create-image', label: '创建图片', Icon: IconImage },
  { value: 'agent-mode', label: '代理模式', Icon: IconRobot },
  { value: 'web-search', label: '网页搜索', Icon: IconGlobe },
];

const members = [
  { value: 'lucy', label: 'Lucy', team: '设计', color: 'var(--color-bg-info)' },
  { value: 'mars', label: 'Mars', team: '前端', color: 'var(--color-bg-success)' },
  { value: 'nina', label: 'Nina', team: '产品', color: 'var(--color-bg-warning)' },
];

const topics = [
  { value: 'q3-okr', label: 'Q3 OKR', status: 'success' },
  { value: 'design-review', label: '设计评审', status: 'warning' },
  { value: 'bug-bash', label: 'Bug Bash', status: 'error' },
];

const panelBox = {
  minWidth: 260,
  padding: 'var(--space-xxxs)',
  borderRadius: 'var(--radius-lg)',
  background: 'var(--color-bg-overlay)',
  boxShadow: 'var(--shadow-md)',
  border: '1px solid var(--color-border-default)',
  fontFamily: 'var(--font-sans)',
};

const groupTitle = {
  padding: 'var(--space-xxs) var(--space-xs) var(--space-xxxs)',
  fontSize: 'var(--text-caption)',
  color: 'var(--color-text-tertiary)',
};

function RowShell({ children, onCommit }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      role="option"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onMouseDown={(event) => {
        event.preventDefault();
        onCommit();
      }}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-xxs)',
        padding: 'var(--space-xxs) var(--space-xs)',
        borderRadius: 'var(--radius-sm)',
        cursor: 'pointer',
        fontSize: 'var(--text-body)',
        lineHeight: 'var(--line-height-body)',
        color: 'var(--color-text-primary)',
        background: hover ? 'var(--color-bg-muted)' : 'transparent',
      }}
    >
      {children}
      <span style={{ flex: 1 }} />
      {hover && (
        <IconCornerDownLeft
          style={{ fontSize: 14, color: 'var(--color-icon-secondary)' }}
        />
      )}
    </div>
  );
}

function ChatInputMultiTriggerDemo() {
  const inputRef = useRef<ElementRef<typeof ChatInput>>(null);
  const [value, setValue] = useState<ChatInputValue>({ segments: [], attachments: [] });
  const [prefix, setPrefix] = useState('');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState('输入 / @ # 唤起对应面板');

  const match = (label) =>
    label.toLowerCase().includes(query.toLowerCase());

  const commit = (node, tip) => {
    inputRef.current?.insertNode({ id: crypto.randomUUID(), type: 'node', ...node });
    setSelected(tip);
  };

  return (
    <section style={{ display: 'grid', gap: 12, padding: 24 }}>
      <ChatInput
        ref={inputRef}
        value={value}
        placeholder="输入 / 技能、@ 成员、# 话题"
        onChange={(event) => setValue(event.detail.data)}
        onTrigger={(event) => {
          setPrefix(event.detail.trigger?.prefix ?? '');
          setQuery(event.detail.query);
        }}
        onSubmit={(event) => setSelected(`已提交：${event.detail.value}`)}
      >
        <ChatInput.Panel trigger="/" placement="caret">
          <div role="listbox" style={panelBox}>
            <div style={groupTitle}>技能</div>
            {skills.filter((it) => match(it.label)).map((it) => (
              <RowShell
                key={it.value}
                onCommit={() =>
                  commit(
                    { nodeType: 'tag', data: { label: it.label, value: it.value, icon: 'skill', iconPosition: 'before' } },
                    `已插入技能：${it.label}`,
                  )
                }
              >
                <it.Icon style={{ fontSize: 16, color: 'var(--color-icon-secondary)' }} />
                <span>{it.label}</span>
              </RowShell>
            ))}
          </div>
        </ChatInput.Panel>
        <ChatInput.Panel trigger="@" placement="caret">
          <div role="listbox" style={panelBox}>
            <div style={groupTitle}>成员</div>
            {members.filter((it) => match(it.label)).map((it) => (
              <RowShell
                key={it.value}
                onCommit={() =>
                  commit(
                    { nodeType: 'tag', data: { label: `@${it.label}`, value: it.value } },
                    `已提及：@${it.label}`,
                  )
                }
              >
                <Avatar size={24} style={{ background: it.color, color: 'var(--color-text-foreground)' }}>
                  {it.label[0]}
                </Avatar>
                <span>{it.label}</span>
                <span style={{ fontSize: 'var(--text-caption)', color: 'var(--color-text-tertiary)' }}>
                  {it.team}
                </span>
              </RowShell>
            ))}
          </div>
        </ChatInput.Panel>
        <ChatInput.Panel trigger="#" placement="caret">
          <div role="listbox" style={panelBox}>
            <div style={groupTitle}>话题</div>
            {topics.filter((it) => match(it.label)).map((it) => (
              <RowShell
                key={it.value}
                onCommit={() =>
                  commit(
                    { nodeType: 'tag', data: { label: `#${it.label}`, value: it.value } },
                    `已关联话题：#${it.label}`,
                  )
                }
              >
                <Tag size="small" status={it.status}>{it.label}</Tag>
              </RowShell>
            ))}
          </div>
        </ChatInput.Panel>
      </ChatInput>
      <div style={{ fontSize: 13, color: 'var(--color-text-tertiary)' }}>
        当前前缀：<code>{prefix || '无'}</code> · {selected}
      </div>
    </section>
  );
}

export default ChatInputMultiTriggerDemo;
```

### 命令面板 D：带搜索 + 分类切换的弹框

当命令项很多时，常见做法是弹出一个更完整的面板：顶部一个搜索框、用 `Tabs` 切换「技能 / 工具」等分类、列表项可勾选（已选中的打勾），底部再挂一个「技能配置」入口。下例用 `Modal` 承载这样一个面板，输入 `/` 或点击左下角按钮均可唤起。

```tsx preview
import { useRef, useState, type ElementRef } from 'react';
import { ChatInput, ChatInputAction, Modal, Input, Tabs, TabPane } from '@ve-design/react';
import { IconSearch, IconSkill, IconCheck, IconSettings } from '@ve-design/react/icons';

const source = {
  skill: [
    { value: 'ui-tester', label: 'UI Tester' },
    { value: 'agent-design', label: 'Agent Design' },
    { value: 'ux-tester', label: 'UX Tester' },
    { value: 'code-review', label: 'Code Review' },
  ],
  mcp: [
    { value: 'design-tool', label: 'Design tool' },
    { value: 'github', label: 'GitHub 工具' },
    { value: 'browser', label: 'Browser 工具' },
  ],
};

function ChatInputPanelDemo() {
  const inputRef = useRef<ElementRef<typeof ChatInput>>(null);
  const [visible, setVisible] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [selected, setSelected] = useState<Set<string>>(new Set(['ui-tester']));
  const [status, setStatus] = useState('尚未选择');

  const open = () => {
    setKeyword('');
    setVisible(true);
  };

  const choose = (it: { value: string; label: string }) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(it.value)) next.delete(it.value);
      else next.add(it.value);
      setStatus(`已选：${[...next].join('、')}`);
      return next;
    });
    inputRef.current?.insertNode({
      id: crypto.randomUUID(),
      type: 'node',
      nodeType: 'tag',
      data: { label: it.label, value: it.value, icon: 'skill', iconPosition: 'before' },
    });
    setVisible(false);
  };

  const renderList = (tab: keyof typeof source) =>
    source[tab]
      .filter((it) => it.label.toLowerCase().includes(keyword.toLowerCase()))
      .map((it) => (
        <div
          key={it.value}
          onClick={() => choose(it)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '8px 10px',
            borderRadius: 8,
            cursor: 'pointer',
            fontSize: 14,
            color: 'var(--color-text-primary)',
          }}
        >
          <span>{it.label}</span>
          {selected.has(it.value) && <IconCheck style={{ color: 'var(--color-text-info)' }} />}
        </div>
      ));

  return (
    <section style={{ display: 'grid', gap: 12, padding: 24 }}>
      <ChatInput
        ref={inputRef}
        triggers={[{ prefix: '/' }]}
        placeholder="输入 / 或点左下角按钮唤起面板"
        onTrigger={(event) => {
          if (event.detail.trigger !== null) open();
        }}
        onSubmit={(event) => {
          console.log('[submit]', event.detail.value, event.detail.data);
          setStatus(`已提交：${event.detail.value}`);
        }}
        leftAction={
          <ChatInputAction iconOnly aria-label="选择技能" icon={<IconSkill />} onActionClick={open} />
        }
      />
      <Modal
        visible={visible}
        width="480px"
        title="选择能力"
        onClose={() => setVisible(false)}
        footer={
          <div
            onClick={() => {
              setStatus('打开「技能配置」');
              setVisible(false);
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '4px 0',
              cursor: 'pointer',
              color: 'var(--color-text-secondary)',
              fontSize: 13,
            }}
          >
            <IconSettings />
            <span>技能配置</span>
          </div>
        }
      >
        <Input
          value={keyword}
          placeholder="搜索技能 / 工具"
          allowClear
          prefix={<IconSearch />}
          onInput={(event) => setKeyword(event.detail.value)}
        />
        <Tabs defaultActiveTab="skill" type="capsule" style={{ marginTop: 12 }}>
          <TabPane itemKey="skill" title="技能 58">
            {renderList('skill')}
          </TabPane>
          <TabPane itemKey="mcp" title="工具 3">
            {renderList('mcp')}
          </TabPane>
        </Tabs>
      </Modal>
      <div style={{ fontSize: 13, color: 'var(--color-text-tertiary)' }}>{status}</div>
    </section>
  );
}
```

### 自定义节点 render

通过 `nodeRenders` prop 传入 `{ [nodeType]: render }` 扩展内联节点，无需全局注册。传入的 render 会与内置的 `tag` / `select` / `variable` 合并，同名会覆盖内置。

一个 render 就是一个普通对象，React 版的 `render` 直接**返回 React 节点**（组件会将它挂载到编辑器中的节点位置）：

```tsx
const myRender: ChatInputNodeRender = {
  // 是否可编辑：true 时光标可进入、其文本计入 value（如变量槽）；chip 一般 false
  editable: false,
  // 纯文本表示：决定该节点在 detail.value 里被拍平成什么文本；缺省回退默认取值
  getText: (node) => `[${node.data?.value ?? ''}]`,
  // 渲染函数：返回 React 节点。每次该节点数据变化都会重新调用
  render: ({ node, disabled, updateData, remove }) => {
    // node.data  —— 该节点的当前最新数据
    // updateData —— 合并 data 并触发 change（只重渲染这一个节点，周围文本不变）
    // remove     —— 把整个节点从编辑器里删掉
    return <span>{String(node.data?.value ?? '')}</span>;
  },
};
```

关键点：

- `render` 里拿到的 `node.data` 是**当前最新**数据；想改数据就调 `updateData(patch)`，组件会 merge 后**只重渲染这一个节点**，其余文本不受影响。
- 想让节点「可删除」，在节点内的按钮里调 `remove()` 即可。
- `getText` 决定提交时这个节点变成什么文本，务必实现，否则回退到默认取值。

#### 示例一：可切换 + 可删除的优先级 chip

点击文字在 `高 / 中 / 低` 间循环（`updateData`），点击 × 删除整个节点（`remove`）。注意切换后周围文本保持不变。

```tsx preview
import { useMemo, useState } from 'react';
import { ChatInput } from '@ve-design/react';
import { IconClose } from '@ve-design/react/icons';
import type { ChatInputValue, ChatInputNodeRenders } from '@ve-design/react';

const order = ['高', '中', '低'];
const color: Record<string, string> = {
  高: 'var(--color-text-danger)',
  中: 'var(--color-text-warning)',
  低: 'var(--color-text-success)',
};

const initial: ChatInputValue = {
  segments: [
    { type: 'text', text: '这个任务的 ' },
    { type: 'node', id: 'p1', nodeType: 'priority', data: { value: '高' } },
    { type: 'text', text: '，请尽快处理' },
  ],
  attachments: [],
};

function ChatInputCustomNodeDemo() {
  const [value, setValue] = useState<ChatInputValue>(initial);
  const [submitted, setSubmitted] = useState('尚未提交');

  const nodeRenders = useMemo<ChatInputNodeRenders>(
    () => ({
      priority: {
        editable: false,
        getText: (node) => `优先级:${node.data?.value ?? '高'}`,
        render: ({ node, updateData, remove }) => {
          const current = (node.data?.value as string) ?? '高';
          const next = order[(order.indexOf(current) + 1) % order.length];
          return (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                padding: '0 6px',
                borderRadius: 6,
                background: 'var(--color-bg-muted)',
              }}
            >
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: color[current] }} />
              <span style={{ color: 'var(--color-text-primary)', cursor: 'pointer' }} onClick={() => updateData({ value: next })}>
                优先级：{current}
              </span>
              <button
                type="button"
                aria-label="删除"
                onClick={remove}
                style={{ border: 'none', background: 'none', padding: 0, display: 'inline-flex', cursor: 'pointer', color: 'var(--color-text-tertiary)' }}
              >
                <IconClose style={{ fontSize: 12 }} />
              </button>
            </span>
          );
        },
      },
    }),
    [],
  );

  return (
    <section style={{ display: 'grid', gap: 12, padding: 24 }}>
      <ChatInput
        value={value}
        nodeRenders={nodeRenders}
        placeholder="自定义节点"
        onChange={(event) => setValue(event.detail.data)}
        onSubmit={(event) => {
          console.log('[submit]', event.detail.value, event.detail.data);
          setSubmitted(`已提交：${event.detail.value}`);
        }}
      />
      <div style={{ fontSize: 13, color: 'var(--color-text-tertiary)' }}>{submitted}</div>
    </section>
  );
}
```

#### 示例二：内嵌真实组件（日期选择）

`render` 返回的可以是任意 React 节点，包括其它 ve-design 组件。下例内嵌一个 `DatePicker`，选完日期回写到节点 `data.value`，`getText` 让它以 `@2026-07-01` 形式进入提交文本。

```tsx preview
import { useMemo, useState } from 'react';
import { ChatInput, DatePicker } from '@ve-design/react';
import type { ChatInputValue, ChatInputNodeRenders } from '@ve-design/react';

const initial: ChatInputValue = {
  segments: [
    { type: 'text', text: '提醒我在 ' },
    { type: 'node', id: 'd1', nodeType: 'date-chip', data: { value: '' } },
    { type: 'text', text: ' 前完成周报' },
  ],
  attachments: [],
};

function ChatInputDateNodeDemo() {
  const [value, setValue] = useState<ChatInputValue>(initial);
  const [submitted, setSubmitted] = useState('尚未提交');

  const nodeRenders = useMemo<ChatInputNodeRenders>(
    () => ({
      'date-chip': {
        editable: false,
        getText: (node) => (node.data?.value ? `@${node.data.value}` : '@日期'),
        render: ({ node, updateData }) => (
          <DatePicker
            size="small"
            placeholder="选择日期"
            value={(node.data?.value as string) || undefined}
            onChange={(event) => updateData({ value: event.detail.value ?? '' })}
          />
        ),
      },
    }),
    [],
  );

  return (
    <section style={{ display: 'grid', gap: 12, padding: 24 }}>
      <ChatInput
        value={value}
        nodeRenders={nodeRenders}
        placeholder="内嵌日期选择"
        onChange={(event) => setValue(event.detail.data)}
        onSubmit={(event) => {
          console.log('[submit]', event.detail.value, event.detail.data);
          setSubmitted(`已提交：${event.detail.value}`);
        }}
      />
      <div style={{ fontSize: 13, color: 'var(--color-text-tertiary)' }}>{submitted}</div>
    </section>
  );
}
```

### Border Glow

设置 `borderGlow` 后，输入框边缘会根据鼠标位置展示组件内置光效。通过 `borderGlowColor` 配置外发光 HSL 颜色，通过 `borderGlowColors` 配置彩色边框渐变色，支持逗号或 `|` 分隔。

注意: 设计助手 Agent 交付不接受只使用 `borderGlow`。必须按上方“必需流光边框”接入 `motion/shimmer-border.css` 和 `motion/shimmer-border.js`,把 `.ved-shimmer-host` / `data-shimmer` / `data-shimmer-radius` 挂在 Composer shell 上。

```tsx preview
import { ChatInput } from '@ve-design/react';

function ChatInputBorderGlowDemo() {
  return (
    <section style={{ display: 'grid', gap: 12, padding: 24 }}>
      <ChatInput
        borderGlow
        borderGlowColor="268 100 76"
        borderGlowColors="#c084fc,#f472b6,#38bdf8"
        placeholder="移动鼠标到边缘试试 · Move near the edge"
        onSubmit={(event) => console.log('[submit]', event.detail.value, event.detail.data)}
      />
    </section>
  );
}
```

## API

### ChatInput Props

| 属性名             | 描述                                                                                   | 类型                                  | 默认值                      |
| ------------------ | -------------------------------------------------------------------------------------- | ------------------------------------- | --------------------------- |
| `value`            | 受控输入值。接受**普通字符串**或**结构化对象** `{ segments, attachments }`             | `string \| ChatInputValue`            | `''`                        |
| `placeholder`      | 输入占位符                                                                              | `string`                              | `''`                        |
| `disabled`         | 是否禁用整个输入框                                                                      | `boolean`                             | `false`                     |
| `loading`          | 生成中态：右侧按钮变为停止按钮，点击触发 `onCancel`                                      | `boolean`                             | `false`                     |
| `size`             | 尺寸（`small` 容器最大宽 420px）                                                        | `'small' \| 'default' \| 'large'`     | `'default'`                 |
| `expandable`       | 是否显示全屏切换按钮                                                                    | `boolean`                             | `false`                     |
| `triggers`         | 命令唤起键配置；输入对应 `prefix` 时触发 `onTrigger`。声明 `<ChatInput.Panel>` 会自动补充对应触发键，此处仅用于「只触发事件、不带内建面板」的场景（如自行弹 `Modal`） | `ChatInputTrigger[]`                  | `[]`                        |
| `nodeRenders`      | 自定义内联节点 render map `{ [nodeType]: render }`，与内置 render 合并                   | `ChatInputNodeRenders`                | `undefined`                 |
| `borderGlow`       | 是否开启鼠标跟随边框光效                                                                | `boolean`                             | `false`                     |
| `borderGlowColor`  | 外发光 HSL 颜色，如 `268 100 76` 或 `268deg 100% 76%`                                   | `string`                              | `'40 80 80'`                |
| `borderGlowColors` | 彩色边框渐变色，支持逗号或 `|` 分隔                                                      | `string`                              | `'#c084fc,#f472b6,#38bdf8'` |
| `header`           | 编辑器上方自定义内容（附件展示区由组件自动渲染）                                        | `React.ReactNode`                     | `-`                         |
| `leftAction`       | 工具栏左侧操作区内容，建议放置 `ChatInputAction` 或上传入口；传入 `footer` 后失效       | `React.ReactNode`                     | `-`                         |
| `rightAction`      | 默认发送 / 停止按钮左侧的自定义内容；传入 `footer` 后失效                               | `React.ReactNode`                     | `-`                         |
| `footer`           | 替换整个工具栏；**优先级最高**，提供后 `leftAction` / `rightAction` 不再生效（互斥）    | `React.ReactNode`                     | `-`                         |
| `children`         | 默认插槽内容                                                                            | `React.ReactNode`                     | `-`                         |

`ChatInputTrigger`：`{ prefix: string }`。

### ChatInput.Panel 属性

在 `<ChatInput>` 内声明命令面板，组件会据此自动推导触发键与面板定位，并管理面板内容的展示——无需再手写 slot 或手动同步 `key`。

| 属性        | 描述                                                                 | 类型                | 默认值      |
| ----------- | ------------------------------------------------------------------- | ------------------- | ----------- |
| `trigger`   | 唤起该面板的前缀字符（如 `/`、`@`、`#`）。省略 `name` 时同时作为面板 key | `string`            | -           |
| `name`      | 显式指定面板 key / 插槽名，缺省等于 `trigger`                       | `string`            | `trigger`   |
| `placement` | 面板定位：`'top'` 贴聊天框顶部（与输入框同宽），`'caret'` 贴光标    | `'top' \| 'caret'`  | `'top'`     |
| `children`  | 面板内容（由业务提供，组件只负责容器与定位）                       | `React.ReactNode`   | -           |

### ChatInput 事件

| 事件名               | 描述                                                  | 参数类型                                                          |
| -------------------- | ----------------------------------------------------- | --------------------------------------------------------------- |
| `onChange`           | 值变化时触发                                          | `CustomEvent<{ value: string; data: ChatInputValue }>`          |
| `onSubmit`           | Enter 提交或点击发送时触发（内容非空、未禁用、未 loading） | `CustomEvent<{ value: string; data: ChatInputValue }>`          |
| `onFocus`            | 编辑器聚焦时触发                                      | `CustomEvent<void>`                                             |
| `onBlur`             | 编辑器失焦时触发                                      | `CustomEvent<void>`                                             |
| `onPressEnter`       | 按下 Enter 时触发（`Shift+Enter` 不触发）；可通过 `preventDefault()` 阻止后续提交 | `CustomEvent<{ originalEvent: KeyboardEvent \| null }>`         |
| `onCancel`           | 生成中点击停止按钮时触发（`disabled` 时不触发）        | `CustomEvent<void>`                                             |
| `onTrigger`          | 命令触发键的查询变化时触发                            | `CustomEvent<{ trigger: ChatInputTrigger \| null; query: string }>` |
| `onAttachmentRemove` | 附件被移除时触发                                      | `CustomEvent<{ id: string; attachment: ChatInputAttachment }>` |
| `onExpandChange`     | 全屏状态变化时触发                                    | `CustomEvent<{ expanded: boolean }>`                           |

### ChatInput Ref

| 方法                                   | 描述                                                                                  |
| -------------------------------------- | ------------------------------------------------------------------------------------- |
| `focus(options?)`                      | 聚焦输入编辑器                                                                         |
| `queryActiveTrigger()`                 | 返回光标附近的触发上下文 `ChatInputTriggerDetail \| null`                              |
| `insertNode(node, { replaceTrigger })` | 在光标处插入内联节点；存在激活触发时默认替换已输入的 `prefix+query`（`replaceTrigger: false` 可关闭） |
| `getChatInputInfo()`                   | 获取 `{ value, text, isFocus, isLoading, isExpanded }` 状态快照                        |

### 扩展点：节点 render

通过 `nodeRenders` prop 传入自定义 render，无需全局注册。React 版 render 的 `render` 直接返回 React 节点，组件会将它挂载到编辑器中的节点位置：

```tsx
interface ChatInputNodeRender {
  /** 节点是否可编辑（光标可进入、文本计入 value）；默认 false */
  editable?: boolean;
  /** 节点的纯文本表示，用于计算 detail.value；缺省时回退到 defaultNodeText */
  getText?: (node: ChatInputNodeSegment) => string;
  /** 返回要渲染的 React 节点 */
  render: (ctx: ChatInputNodeRenderContext) => React.ReactNode;
}

interface ChatInputNodeRenderContext {
  node: ChatInputNodeSegment;
  /** 合并 patch 回写该节点的 data */
  updateData: (patch: Record<string, unknown>) => void;
  /** 删除该节点自身 */
  remove: () => void;
}

type ChatInputNodeRenders = Record<string, ChatInputNodeRender>;
```

传入的 render 会合并到内置 `tag` / `select`（不可编辑）与 `variable`（可编辑）之上，同名会覆盖内置。

### ChatInputAction Props

| 属性名     | 描述                                            | 类型                              | 默认值      |
| ---------- | ----------------------------------------------- | --------------------------------- | ----------- |
| `type`     | 操作形态                                        | `'button' \| 'dropdown'`          | `'button'`  |
| `status`   | 视觉状态                                        | `'default' \| 'active'`           | `'default'` |
| `size`     | 尺寸                                            | `'small' \| 'default' \| 'large'` | `'default'` |
| `disabled` | 是否禁用                                        | `boolean`                         | `false`     |
| `open`     | 下拉打开状态，用于同步箭头方向                  | `boolean`                         | `false`     |
| `iconOnly` | 是否为仅图标模式（圆角方形按钮，无文本 padding）| `boolean`                         | `false`     |
| `icon`     | 前置图标                                        | `React.ReactNode`                 | `-`         |
| `children` | 操作文案                                        | `React.ReactNode`                 | `-`         |

### ChatInputAction 事件

| 事件名          | 描述                                    | 参数类型                                                       |
| --------------- | --------------------------------------- | -------------------------------------------------------------- |
| `onActionClick` | 点击操作项时触发；dropdown 会切换打开态 | `CustomEvent<{ type: 'button' \| 'dropdown'; open: boolean }>` |
