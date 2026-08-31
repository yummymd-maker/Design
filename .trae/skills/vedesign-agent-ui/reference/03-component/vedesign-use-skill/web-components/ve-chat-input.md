`ve-chat-input` 是面向 AI 对话与 Agent 场景的输入组件：在富文本编辑能力之上，组合聚焦、输入、已完成、生成中等视觉状态，并提供全屏编辑、停止生成、命令面板、内联节点、附件展示与工具栏操作能力。

`value` 同时兼容两种形态：

- **普通字符串**（最常见）：`value="帮我写一段文案"`，等价于一段纯文本。
- **结构化对象** `{ segments, attachments }`：用于承载内联节点（tag / select / 变量槽 / 自定义组件）与附件。

配套的 `ve-chat-input-action` 提供圆角按钮与下拉触发器，适合放在工具栏操作区承载「添加附件 / 联网 / 模型 / 深度思考 / 语音」等输入辅助操作。

## 何时使用

- 构建通用 AI 对话、智能助手工作台或智能助手面板的输入区域。
- 需要通过 `/`、`@`、`#` 等命令唤起命令面板（唤起键、面板内容均可自定义）。
- 需要变量槽、Prompt 模板（占位文本中某些位置允许用户重新输入或选择），以及自定义渲染内联组件。
- 需要上传文件（图片、文档、markdown 等）并在输入框中展示附件。
- 需要生成中停止、全屏编辑、Border Glow 等能力。

## 必需流光边框

设计助手 Agent 的 Composer / `ve-chat-input` 必须使用本 skill 提供的 `shimmer-border` 流光动效。不要只开启 `ve-chat-input` 的 `border-glow`;`border-glow` 是组件内置鼠标跟随边框能力,不能替代本 skill 要求的 `motion/shimmer-border.css` + `motion/shimmer-border.js`。

Web Components / 静态页面仍然必须使用 `ve-chat-input` 承载输入、发送、停止、附件和命令面板能力,但流光视觉要挂在真正拥有输入框圆角和可见边框的 Composer shell 上:

```html
<link rel="stylesheet" href="motion/shimmer-border.css" />
<script src="motion/shimmer-border.js"></script>

<div
  class="composer ved-shimmer-host"
  data-shimmer
  data-shimmer-radius="20"
  data-shimmer-stroke="1.5"
  data-shimmer-duration="2.7"
  data-shimmer-loops="1"
>
  <ve-chat-input placeholder="有问题，尽管问"></ve-chat-input>
</div>
```

验收标准是进入页面或重新触发时 SVG 流光沿输入框视觉边框单圈扫过,不是出现在外层布局容器边缘。`data-shimmer-radius` 必须等于 Composer shell 的 `border-radius` 像素值。

## 引入组件

```ts
import '@ve-design/web/ve-chat-input';
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

`ve-chat-input-change` / `ve-chat-input-submit` 的 `detail` 为 `{ value: string, data: ChatInputValue }`：

- `value`：把当前内容拍平成的**纯文本字符串**（内联节点、附件都会被转成对应文本），普通文本场景可直接回写（例如 `el.value = e.detail.value`）。
- `data`：规范化后的**结构化对象** `{ segments, attachments }`，用于持久化或保留内联节点 / 附件时回写（例如 `el.value = e.detail.data`）。

## 示例

### 基础用法（字符串）

最小受控写法：监听 `ve-chat-input-change` 写回 `value`，监听 `ve-chat-input-submit` 处理提交。大部分场景下，直接用字符串即可。

```html preview
<script type="module">
  import '@ve-design/web/ve-chat-input';
</script>

<ve-chat-input id="ci-basic" placeholder="有问题，尽管问"></ve-chat-input>
<p id="ci-basic-out" style="margin-top:12px;font-size:13px;color:var(--color-text-tertiary);">
  尚未提交
</p>

<script>
  const el = document.getElementById('ci-basic');
  const out = document.getElementById('ci-basic-out');

  // change.detail = { value: string, data: ChatInputValue }
  // 纯文本场景直接用 e.detail.value（string）回写即可，与旧写法兼容
  el.addEventListener('ve-chat-input-change', (e) => {
    el.value = e.detail.value;
  });

  el.addEventListener('ve-chat-input-submit', (e) => {
    out.textContent = `已提交：${e.detail.value}`;
    el.value = '';
  });
</script>
```

### 生成中（停止）

将 `loading` 切换为 `true`，右侧按钮会变成圆形停止按钮，点击派发 `ve-chat-input-cancel`。常用于对接流式回复期间的「停止生成」操作。

```html preview
<script type="module">
  import '@ve-design/web/ve-chat-input';
</script>

<ve-chat-input
  id="ci-loading"
  placeholder="提交后会进入生成态 · Submit to enter loading"
></ve-chat-input>
<p id="ci-loading-out" style="margin-top:12px;font-size:13px;color:var(--color-text-tertiary);">
  Idle · 空闲
</p>

<script>
  const el = document.getElementById('ci-loading');
  const out = document.getElementById('ci-loading-out');

  el.addEventListener('ve-chat-input-change', (e) => {
    el.value = e.detail.value;
  });
  el.addEventListener('ve-chat-input-submit', (e) => {
    el.loading = true;
    out.textContent = `Generating · 生成中：${e.detail.value}`;
  });
  el.addEventListener('ve-chat-input-cancel', () => {
    el.loading = false;
    out.textContent = 'Cancelled · 已取消';
  });
</script>
```

### 工具栏 Action（`+` 号菜单 / 联网 / 模型 / 深度思考）

在 `slot="left-action"` 中放置一个或多个 `<ve-chat-input-action>`，用 `status="active"` 表达激活态、`type="dropdown"` 表达带下拉、`icon-only` 表达纯图标。工具栏最左侧常见做法是放一个 `+` 号「添加」入口——用 `ve-dropdown` 组织一级命令，用 `ve-dropdown-sub-item` 承载二级子菜单（如「拓展」下的更多能力）。通过 `slot="right-action"` 可以在默认的发送 / 停止按钮左侧添加自定义内容。

```html preview
<script type="module">
  import '@ve-design/web/ve-chat-input';
  import '@ve-design/web/ve-dropdown';
  import '@ve-design/web/icons/add';
  import '@ve-design/web/icons/image';
  import '@ve-design/web/icons/file';
  import '@ve-design/web/icons/plugin';
  import '@ve-design/web/icons/globe';
  import '@ve-design/web/icons/microphone';
</script>

<ve-chat-input id="ci-actions" placeholder="Try the actions below · 试试下方按钮">
  <ve-dropdown slot="left-action" trigger="click" position="top-start">
    <ve-chat-input-action slot="trigger" icon-only aria-label="添加">
      <ve-icon slot="icon" name="add" size="16"></ve-icon>
    </ve-chat-input-action>

    <ve-dropdown-item value="upload-image">
      <span style="display:flex;align-items:center;gap:8px;">
        <ve-icon name="image"></ve-icon><span>上传图片</span>
      </span>
    </ve-dropdown-item>
    <ve-dropdown-item value="upload-file">
      <span style="display:flex;align-items:center;gap:8px;">
        <ve-icon name="file"></ve-icon><span>上传文件</span>
      </span>
    </ve-dropdown-item>

    <ve-dropdown-sub-item>
      <span slot="label" style="display:flex;align-items:center;gap:8px;">
        <ve-icon name="plugin"></ve-icon><span>拓展</span>
      </span>
      <ve-dropdown-item value="ext-web">联网搜索</ve-dropdown-item>
      <ve-dropdown-item value="ext-code">代码解释器</ve-dropdown-item>
      <ve-dropdown-item value="ext-mcp">MCP 工具</ve-dropdown-item>
    </ve-dropdown-sub-item>
  </ve-dropdown>

  <ve-chat-input-action slot="left-action" data-toggle="联网">
    <ve-icon slot="icon" name="globe" size="16"></ve-icon>
    联网
  </ve-chat-input-action>

  <ve-chat-input-action slot="left-action" data-toggle="think">深度思考</ve-chat-input-action>

  <ve-dropdown
    slot="left-action"
    trigger="click"
    selection="single"
    position="bottom-start"
    default-value="Model A"
  >
    <ve-chat-input-action id="ci-actions-model" slot="trigger" type="dropdown">
      Model A
    </ve-chat-input-action>
    <ve-dropdown-item value="Model A">Model A</ve-dropdown-item>
    <ve-dropdown-item value="Model B">Model B</ve-dropdown-item>
    <ve-dropdown-item value="Model C">Model C</ve-dropdown-item>
  </ve-dropdown>

  <ve-chat-input-action slot="left-action" data-toggle="research" status="active">研究</ve-chat-input-action>

  <ve-chat-input-action slot="right-action" icon-only aria-label="语音输入">
    <ve-icon slot="icon" name="microphone" size="16"></ve-icon>
  </ve-chat-input-action>
</ve-chat-input>
<p id="ci-actions-state" style="margin-top:12px;font-size:13px;color:var(--color-text-tertiary);">
  当前：研究 已激活，模型 Model A
</p>

<script>
  const el = document.getElementById('ci-actions');
  const stateEl = document.getElementById('ci-actions-state');
  const modelTrigger = document.getElementById('ci-actions-model');
  const addDropdown = el.querySelector('ve-dropdown[position="top-start"]');
  const addTrigger = addDropdown.querySelector('[slot="trigger"]');
  const modelDropdown = el.querySelector('ve-dropdown[selection="single"]');
  let model = 'Model A';

  el.addEventListener('ve-chat-input-change', (e) => {
    el.value = e.detail.value;
  });

  el.addEventListener('ve-chat-input-submit', (e) => {
    console.log('[submit]', e.detail.value, e.detail.data);
  });

  el.addEventListener('ve-chat-input-action-click', (e) => {
    const target = e.target;
    if (!target.hasAttribute('data-toggle')) return;
    const active = target.getAttribute('status') === 'active';
    if (active) target.removeAttribute('status');
    else target.setAttribute('status', 'active');
    renderState();
  });

  addDropdown.addEventListener('ve-open-change', (e) => {
    addTrigger.open = e.detail.open;
  });
  addDropdown.addEventListener('ve-select', (e) => {
    stateEl.textContent = `已添加：${e.detail.value}`;
  });

  modelDropdown.addEventListener('ve-open-change', (e) => {
    modelTrigger.open = e.detail.open;
  });
  modelDropdown.addEventListener('ve-change', (e) => {
    model = e.detail.value;
    modelTrigger.textContent = model;
    renderState();
  });

  function renderState() {
    const actives = [...el.querySelectorAll('[data-toggle][status="active"]')]
      .map((n) => n.textContent.trim());
    stateEl.textContent = `当前：${actives.length ? actives.join(' / ') + ' 已激活' : '无激活项'}，模型 ${model}`;
  }
</script>
```

### 全屏切换

设置 `expandable` 后，box 右上角会出现切换按钮，点击在常规态与「全屏态」之间切换；切换会派发 `ve-chat-input-expand-change`。

```html preview
<script type="module">
  import '@ve-design/web/ve-chat-input';
</script>

<ve-chat-input
  id="ci-expand"
  placeholder="尝试点击右上角全屏按钮 · Try the expand button"
  expandable
></ve-chat-input>

<script>
  const el = document.getElementById('ci-expand');
  el.addEventListener('ve-chat-input-change', (e) => {
    el.value = e.detail.value;
  });
  el.addEventListener('ve-chat-input-expand-change', (e) => {
    console.log('expanded:', e.detail.expanded);
  });
  el.addEventListener('ve-chat-input-submit', (e) => {
    console.log('[submit]', e.detail.value, e.detail.data);
  });
</script>
```

### 结构化 value（segments + attachments）

直接给 `value` 传 `{ segments, attachments }`，可以预置内联节点与附件。下例预置了一个 `tag` 节点、一段文本，以及一张「上传完成」的图片附件与一份「上传中」的文档附件。点击附件上的关闭按钮会派发 `ve-chat-input-attachment-remove`。

```html preview
<script type="module">
  import '@ve-design/web/ve-chat-input';
  import '@ve-design/web/icons/image';
  import '@ve-design/web/icons/file';
</script>

<ve-chat-input id="ci-struct" placeholder="结构化内容"></ve-chat-input>

<script>
  const el = document.getElementById('ci-struct');

  el.value = {
    segments: [
      { type: 'node', id: 'm1', nodeType: 'tag', data: { label: '设计稿' } },
      { type: 'text', text: ' 帮我润色这段说明文字' },
    ],
    attachments: [
      { id: 'a1', name: 'cover.png', kind: 'image', status: 'done', thumbUrl: 'https://picsum.photos/seed/ci/48' },
      { id: 'a2', name: 'spec.md', kind: 'file', status: 'uploading', percent: 60 },
    ],
  };

  // 保留内联节点 / 附件时，用结构化的 e.detail.data 回写
  el.addEventListener('ve-chat-input-change', (e) => {
    el.value = e.detail.data;
  });

  el.addEventListener('ve-chat-input-attachment-remove', (e) => {
    console.log('removed attachment:', e.detail.id);
  });

  el.addEventListener('ve-chat-input-submit', (e) => {
    console.log('[submit]', e.detail.value, e.detail.data);
  });
</script>
```

### 上传附件

附件由 `value.attachments` 驱动，展示区位于编辑器上方，每个附件卡片支持缩略图 / 图标、上传进度（`status: 'uploading'` + `percent`）与失败态（`status: 'error'`），内置关闭按钮派发 `ve-chat-input-attachment-remove`。

用 `ve-upload` 作为来源：关闭它的自动上传（`auto-upload="false"`）与内置文件列表（`show-upload-list="false"`），在 `ve-select` 里拿到本地文件后自行往 `value.attachments` 里追加占位项（`uploading`），再模拟进度直至 `done`；下例最后一张图故意置为 `error` 演示失败态。

```html preview
<script type="module">
  import '@ve-design/web/ve-chat-input';
  import '@ve-design/web/ve-upload';
  import '@ve-design/web/icons/image';
</script>

<ve-chat-input id="ci-upload" placeholder="添加图片，看看附件展示区">
  <ve-upload
    slot="left-action"
    accept="image/*"
    multiple
    auto-upload="false"
    show-upload-list="false"
  >
    <ve-chat-input-action slot="trigger" icon-only aria-label="上传图片">
      <ve-icon slot="icon" name="image" size="16"></ve-icon>
    </ve-chat-input-action>
  </ve-upload>
</ve-chat-input>

<script>
  const el = document.getElementById('ci-upload');
  const upload = el.querySelector('ve-upload');

  // 预置：一张已完成 + 一张上传失败，演示各种状态
  el.value = {
    segments: [],
    attachments: [
      { id: 'seed-done', name: 'cover.png', kind: 'image', status: 'done', thumbUrl: 'https://picsum.photos/seed/ci-done/64' },
      { id: 'seed-error', name: 'broken.png', kind: 'image', status: 'error' },
    ],
  };

  function currentAttachments() {
    const v = el.value;
    return typeof v === 'string' ? [] : [...v.attachments];
  }

  function setAttachments(attachments) {
    const v = el.value;
    const segments = typeof v === 'string'
      ? (v ? [{ type: 'text', text: v }] : [])
      : v.segments;
    el.value = { segments, attachments };
  }

  function patchAttachment(id, patch) {
    setAttachments(
      currentAttachments().map((a) => (a.id === id ? { ...a, ...patch } : a)),
    );
  }

  // 拿到本地文件 → 追加占位 → 模拟上传进度
  upload.addEventListener('ve-select', (e) => {
    for (const item of e.detail.files) {
      const file = item.originFile;
      if (!file) continue;
      const id = item.uid;
      const thumbUrl = URL.createObjectURL(file);
      setAttachments([
        ...currentAttachments(),
        { id, name: file.name, kind: 'image', status: 'uploading', percent: 0, thumbUrl },
      ]);

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
  });

  el.addEventListener('ve-chat-input-change', (e) => {
    el.value = e.detail.data;
  });
  el.addEventListener('ve-chat-input-attachment-remove', (e) => {
    console.log('removed:', e.detail.id);
  });
  el.addEventListener('ve-chat-input-submit', (e) => {
    console.log('[submit]', e.detail.value, e.detail.data);
  });
</script>
```

### 引用块 / 上下文卡片（header 插槽）

`header` 插槽用于在编辑器上方展示引用源、上下文卡片等（附件展示区由组件自动渲染，与此插槽并存）。下例用一个带竖线与关闭按钮的引用块承载「引用的上文」——引用块本身不需要额外的 `padding` / `margin`，直接贴合编辑器上沿即可。

```html preview
<script type="module">
  import '@ve-design/web/ve-chat-input';
  import '@ve-design/web/icons/close';
</script>

<ve-chat-input id="ci-quote" placeholder="基于引用内容继续提问">
  <div
    id="ci-quote-block"
    slot="header"
    style="display:flex;align-items:flex-start;gap:8px;border-radius:8px;background:var(--color-bg-muted);"
  >
    <span style="width:2px;align-self:stretch;border-radius:1px;background:var(--color-border-default);flex:none;"></span>
    <span style="flex:1;min-width:0;font-size:13px;line-height:20px;color:var(--color-text-secondary);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">
      引用：Agent 在第 3 步调用了搜索工具，返回了 12 条结果……
    </span>
    <button
      id="ci-quote-close"
      aria-label="移除引用"
      style="border:none;background:none;padding:2px;cursor:pointer;color:var(--color-text-tertiary);display:inline-flex;flex:none;"
    >
      <ve-icon name="close" size="14"></ve-icon>
    </button>
  </div>
</ve-chat-input>

<script>
  const el = document.getElementById('ci-quote');
  const block = document.getElementById('ci-quote-block');
  document.getElementById('ci-quote-close').addEventListener('click', () => {
    block.remove();
  });
  el.addEventListener('ve-chat-input-change', (e) => {
    el.value = e.detail.value;
  });
  el.addEventListener('ve-chat-input-submit', (e) => {
    console.log('[submit]', e.detail.value, e.detail.data);
  });
</script>
```

### 变量槽 / Prompt 模板

`variable` 是内置的**可编辑**节点：渲染为一个可输入的内联区域，光标可进入、其文本计入 `value`。配合普通文本段，可以拼出「填空式」的 Prompt 模板，用户只需补全空槽。

```html preview
<script type="module">
  import '@ve-design/web/ve-chat-input';
</script>

<ve-chat-input id="ci-var" placeholder="填写模板"></ve-chat-input>
<p id="ci-var-out" style="margin-top:12px;font-size:13px;color:var(--color-text-tertiary);"></p>

<script>
  const el = document.getElementById('ci-var');
  const out = document.getElementById('ci-var-out');

  el.value = {
    segments: [
      { type: 'text', text: '帮我给 ' },
      { type: 'node', id: 'v1', nodeType: 'variable', data: { value: '', placeholder: '产品名' } },
      { type: 'text', text: ' 写一句 ' },
      { type: 'node', id: 'v2', nodeType: 'variable', data: { value: '', placeholder: '风格' } },
      { type: 'text', text: ' 风格的 slogan' },
    ],
    attachments: [],
  };

  el.addEventListener('ve-chat-input-change', (e) => {
    el.value = e.detail.data;
    out.textContent = `当前文本：${e.detail.value}`;
  });
  el.addEventListener('ve-chat-input-submit', (e) => {
    console.log('[submit]', e.detail.value, e.detail.data);
    out.textContent = `已提交：${e.detail.value}`;
  });
</script>
```

### 内置内联节点（tag / select）

`tag`、`select` 都是**不可编辑**的内联节点：`tag` 用于展示业务标签，`select` 内嵌一个普通 `ve-select` 供用户切换取值，切换后回写到该节点 `data.value`。下例演示在客服分析场景中固定一个业务范围标签，并允许用户切换报告语言。

```html preview
<script type="module">
  import '@ve-design/web/ve-chat-input';
</script>

<ve-chat-input id="ci-nodes" placeholder="描述你要生成的分析报告"></ve-chat-input>
<p id="ci-nodes-out" style="margin-top:12px;font-size:13px;color:var(--color-text-tertiary);">当前配置：客户支持，中文</p>

<script>
  const el = document.getElementById('ci-nodes');
  const out = document.getElementById('ci-nodes-out');

  el.value = {
    segments: [
      { type: 'text', text: '请基于 ' },
      { type: 'node', id: 't1', nodeType: 'tag', data: { label: '#客户支持', value: 'support' } },
      { type: 'text', text: ' 的近 7 天会话数据，生成一份 ' },
      { type: 'node', id: 's1', nodeType: 'select', data: { value: '中文', options: ['中文', 'English', '日本語'] } },
      { type: 'text', text: ' 分析报告' },
    ],
    attachments: [],
  };

  el.addEventListener('ve-chat-input-change', (e) => {
    el.value = e.detail.data;
    const languageNode = e.detail.data.segments.find(
      (segment) => segment.type === 'node' && segment.id === 's1',
    );
    out.textContent = `当前配置：客户支持，${languageNode?.data?.value ?? '中文'}`;
  });
  el.addEventListener('ve-chat-input-submit', (e) => {
    console.log('[submit]', e.detail.value, e.detail.data);
    out.textContent = `已提交：${e.detail.value}`;
  });
</script>
```

### 命令面板 A：紧贴快捷键（光标）弹出

在 `<ve-chat-input>` 内直接声明一个 `<ve-chat-input-panel trigger="/">` 子元素即可：组件会**自动**根据它推导唤起键与面板配置，并在输入 `/` 时展示、定位面板。`placement="caret"` 时面板**紧贴刚输入的 `/` 字符**弹出，组件会自动把面板定位到光标处。无需再手写 `slot="panel-<key>"`，也无需手动设置 `triggers`。

面板的**内容与交互完全由业务提供**——把面板体作为 `<ve-chat-input-panel>` 的子节点放入即可。组件只负责容器和定位，保持轻量。选中项时调用 `insertNode()` 把节点插入编辑器（会自动替换刚输入的 `/query` 文本）。

```html preview
<script type="module">
  import '@ve-design/web/ve-chat-input';
  import '@ve-design/web/ve-icon';
  import '@ve-design/web/icons/image';
  import '@ve-design/web/icons/robot';
  import '@ve-design/web/icons/monitor';
  import '@ve-design/web/icons/telescope';
  import '@ve-design/web/icons/globe';
</script>

<section style="padding: 24px;">
  <ve-chat-input
    id="ci-sug-input"
    placeholder="输入 / 让面板贴着光标弹出"
  >
    <ve-chat-input-panel trigger="/" placement="caret">
      <div
        id="ci-sug-panel"
        role="listbox"
        style="min-width:240px;padding:var(--space-xxxs);border-radius:var(--radius-lg);background:var(--color-bg-overlay);box-shadow:var(--shadow-md);border:1px solid var(--color-border-default);font-family:var(--font-sans);"
      ></div>
    </ve-chat-input-panel>
  </ve-chat-input>
</section>
<p id="ci-sug-out" style="margin-top:12px;font-size:13px;color:var(--color-text-tertiary);">
  尚未选中
</p>

<script>
  const input = document.getElementById('ci-sug-input');
  const panel = document.getElementById('ci-sug-panel');
  const out = document.getElementById('ci-sug-out');
  // 每项含图标与所属分组，分组之间用分隔线隔开
  const items = [
    { value: 'create-image', label: '创建图片', icon: 'image', group: 1 },
    { value: 'agent-mode', label: '代理模式', icon: 'robot', group: 1 },
    { value: 'share-screen', label: '共享屏幕和应用', icon: 'monitor', group: 2 },
    { value: 'deep-research', label: '深度研究', icon: 'telescope', group: 2 },
    { value: 'web-search', label: '网页搜索', icon: 'globe', group: 2 },
  ];

  // 唤起键与命令面板均由声明式 <ve-chat-input-panel> 自动推导，无需手动设置

  function paint(query) {
    const list = items.filter((it) =>
      it.label.toLowerCase().includes(query.toLowerCase()),
    );
    panel.innerHTML = '';
    if (list.length === 0) {
      const empty = document.createElement('div');
      empty.textContent = '无匹配项';
      empty.style.cssText =
        'padding:var(--space-xxs) var(--space-xs);font-size:var(--text-body-sm);color:var(--color-text-tertiary);';
      panel.appendChild(empty);
      return;
    }
    list.forEach((it, i) => {
      if (i > 0 && it.group !== list[i - 1].group) {
        const divider = document.createElement('div');
        divider.style.cssText =
          'height:1px;margin:var(--space-xxxs) var(--space-xxs);background:var(--color-border-default);';
        panel.appendChild(divider);
      }
      const row = document.createElement('div');
      row.setAttribute('role', 'option');
      row.style.cssText =
        'display:flex;align-items:center;gap:var(--space-xxs);padding:var(--space-xxs) var(--space-xs);border-radius:var(--radius-sm);cursor:pointer;font-size:var(--text-body);line-height:var(--line-height-body);color:var(--color-text-primary);';
      const icon = document.createElement('ve-icon');
      icon.setAttribute('name', it.icon);
      icon.setAttribute('size', '16');
      icon.style.color = 'var(--color-icon-secondary)';
      const label = document.createElement('span');
      label.textContent = it.label;
      row.append(icon, label);
      row.addEventListener('mouseenter', () => {
        row.style.background = 'var(--color-bg-muted)';
      });
      row.addEventListener('mouseleave', () => {
        row.style.background = 'transparent';
      });
      row.addEventListener('mousedown', (ev) => {
        ev.preventDefault();
        input.insertNode({
          id: crypto.randomUUID(),
          type: 'node',
          nodeType: 'tag',
          data: { label: it.label, value: it.value, icon: 'skill', iconPosition: 'before' },
        });
        out.textContent = `已插入：${it.label}`;
      });
      panel.appendChild(row);
    });
  }

  // 编辑器派发 trigger：仅需按 query 刷新面板内容，组件负责开合与定位
  input.addEventListener('ve-chat-input-trigger', (e) => {
    if (e.detail.trigger) paint(e.detail.query);
  });

  input.addEventListener('ve-chat-input-submit', (e) => {
    console.log('[submit]', e.detail.value, e.detail.data);
    out.textContent = `已提交：${e.detail.value}`;
  });

  paint('');
</script>
```

### 命令面板 B：浮在聊天框顶部

如果希望面板**浮在聊天框顶部**（而不是紧贴光标），只需把 `<ve-chat-input-panel>` 的 `placement` 设为 `top`——这是最常见的命令面板形态。`top` 时面板会**与输入框同宽**，铺满整个聊天框顶部；面板内容依旧作为子节点放入。

```html preview
<script type="module">
  import '@ve-design/web/ve-chat-input';
  import '@ve-design/web/ve-icon';
  import '@ve-design/web/icons/corner-down-left';
</script>

<section style="padding: 24px;">
  <ve-chat-input
    id="ci-top"
    placeholder="输入 / 让面板浮在聊天框顶部"
  >
    <ve-chat-input-panel trigger="/" placement="top">
      <div
        id="ci-top-panel"
        role="listbox"
        style="width:100%;box-sizing:border-box;padding:var(--space-xxxs);border-radius:var(--radius-lg);background:var(--color-bg-overlay);box-shadow:var(--shadow-md);border:1px solid var(--color-border-default);font-family:var(--font-sans);"
      ></div>
    </ve-chat-input-panel>
  </ve-chat-input>
</section>
<p id="ci-top-out" style="margin-top:12px;font-size:13px;color:var(--color-text-tertiary);">尚未选中</p>

<script>
  const input = document.getElementById('ci-top');
  const panel = document.getElementById('ci-top-panel');
  const out = document.getElementById('ci-top-out');
  const items = [
    { value: 'ui-tester', label: 'UI review skill', command: '/run ui-test' },
    { value: 'agent-design', label: 'Agent planning skill', command: '/create agent-flow' },
    { value: 'ux-tester', label: 'UX review skill', command: '/review user-journey' },
  ];
  let activeIndex = 0;

  // 唤起键与 top 定位均由声明式 <ve-chat-input-panel placement="top"> 推导

  function paint(query) {
    const list = items.filter((it) =>
      it.label.toLowerCase().includes(query.toLowerCase()),
    );
    panel.innerHTML = '';
    activeIndex = 0;

    // 分组标题
    const groupTitle = document.createElement('div');
    groupTitle.textContent = 'Skill';
    groupTitle.style.cssText =
      'padding:var(--space-xxs) var(--space-xs) var(--space-xxxs);font-size:var(--text-caption);color:var(--color-text-tertiary);';
    panel.appendChild(groupTitle);

    if (list.length === 0) {
      const empty = document.createElement('div');
      empty.textContent = '无匹配项';
      empty.style.cssText =
        'padding:var(--space-xxs) var(--space-xs);font-size:var(--text-body-sm);color:var(--color-text-tertiary);';
      panel.appendChild(empty);
      return;
    }
    list.forEach((it, i) => {
      const row = document.createElement('div');
      row.setAttribute('role', 'option');
      const setActive = (on) => {
        row.style.background = on ? 'var(--color-bg-muted)' : 'transparent';
        enter.style.display = on ? 'inline-flex' : 'none';
      };
      row.style.cssText =
        'display:flex;align-items:center;gap:var(--space-xxs);padding:var(--space-xxs) var(--space-xs);border-radius:var(--radius-sm);cursor:pointer;';

      const label = document.createElement('span');
      label.textContent = it.label;
      label.style.cssText =
        'font-size:var(--text-body);color:var(--color-text-primary);white-space:nowrap;';

      const command = document.createElement('span');
      command.textContent = it.command;
      command.style.cssText =
        'flex:1;min-width:0;font-family:var(--font-mono);font-size:var(--text-caption);color:var(--color-text-tertiary);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;';

      const enter = document.createElement('ve-icon');
      enter.setAttribute('name', 'corner-down-left');
      enter.setAttribute('size', '14');
      enter.style.cssText = 'color:var(--color-icon-secondary);display:none;';

      row.append(label, command, enter);
      setActive(i === activeIndex);
      row.addEventListener('mouseenter', () => setActive(true));
      row.addEventListener('mouseleave', () => setActive(i === activeIndex));
      row.addEventListener('mousedown', (ev) => {
        ev.preventDefault();
        input.insertNode({
          id: crypto.randomUUID(),
          type: 'node',
          nodeType: 'tag',
          data: { label: it.label, value: it.value, icon: 'skill', iconPosition: 'before' },
        });
        out.textContent = `已插入：${it.label}`;
      });
      panel.appendChild(row);
    });
  }

  input.addEventListener('ve-chat-input-trigger', (e) => {
    if (e.detail.trigger) paint(e.detail.query);
  });

  input.addEventListener('ve-chat-input-submit', (e) => {
    console.log('[submit]', e.detail.value, e.detail.data);
    out.textContent = `已提交：${e.detail.value}`;
  });

  paint('');
</script>
```

### 命令面板 C：多关键字触发（`/` 技能 · `@` 成员 · `#` 话题）

真实场景里，一个输入框往往要同时支持多种触发字符：`/` 唤起技能、`@` 提及成员、`#` 关联话题。只需声明**多个 `<ve-chat-input-panel>`**（各绑不同 `trigger` 前缀），组件会依据当前输入的前缀**自动切换到对应面板**。面板内容建议优先用组件库里的组件与图标组合——技能用 `ve-icon` + 标签，成员用 `ve-avatar`，话题用 `ve-tag`。
```html preview
<script type="module">
  import '@ve-design/web/ve-chat-input';
  import '@ve-design/web/ve-icon';
  import '@ve-design/web/ve-avatar';
  import '@ve-design/web/ve-tag';
  import '@ve-design/web/icons/image';
  import '@ve-design/web/icons/robot';
  import '@ve-design/web/icons/globe';
  import '@ve-design/web/icons/corner-down-left';
</script>

<section style="padding: 24px;">
  <ve-chat-input id="ci-multi" placeholder="输入 / 技能、@ 成员、# 话题">
    <ve-chat-input-panel trigger="/" name="skill" placement="caret">
      <div data-panel="skill" role="listbox" style="min-width:260px;padding:var(--space-xxxs);border-radius:var(--radius-lg);background:var(--color-bg-overlay);box-shadow:var(--shadow-md);border:1px solid var(--color-border-default);font-family:var(--font-sans);"></div>
    </ve-chat-input-panel>
    <ve-chat-input-panel trigger="@" name="member" placement="caret">
      <div data-panel="member" role="listbox" style="min-width:260px;padding:var(--space-xxxs);border-radius:var(--radius-lg);background:var(--color-bg-overlay);box-shadow:var(--shadow-md);border:1px solid var(--color-border-default);font-family:var(--font-sans);"></div>
    </ve-chat-input-panel>
    <ve-chat-input-panel trigger="#" name="topic" placement="caret">
      <div data-panel="topic" role="listbox" style="min-width:260px;padding:var(--space-xxxs);border-radius:var(--radius-lg);background:var(--color-bg-overlay);box-shadow:var(--shadow-md);border:1px solid var(--color-border-default);font-family:var(--font-sans);"></div>
    </ve-chat-input-panel>
  </ve-chat-input>
</section>
<p id="ci-multi-out" style="margin-top:12px;font-size:13px;color:var(--color-text-tertiary);">输入 / @ # 唤起对应面板</p>

<script>
  const input = document.getElementById('ci-multi');
  const out = document.getElementById('ci-multi-out');
  const panels = {
    skill: input.querySelector('[data-panel="skill"]'),
    member: input.querySelector('[data-panel="member"]'),
    topic: input.querySelector('[data-panel="topic"]'),
  };
  const skills = [
    { value: 'create-image', label: '创建图片', icon: 'image' },
    { value: 'agent-mode', label: '代理模式', icon: 'robot' },
    { value: 'web-search', label: '网页搜索', icon: 'globe' },
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

  // 三个 <ve-chat-input-panel> 已声明各自的 trigger，组件自动推导切换

  function groupTitle(text) {
    const el = document.createElement('div');
    el.textContent = text;
    el.style.cssText =
      'padding:var(--space-xxs) var(--space-xs) var(--space-xxxs);font-size:var(--text-caption);color:var(--color-text-tertiary);';
    return el;
  }

  function makeRow(children, onCommit) {
    const row = document.createElement('div');
    row.setAttribute('role', 'option');
    row.style.cssText =
      'display:flex;align-items:center;gap:var(--space-xxs);padding:var(--space-xxs) var(--space-xs);border-radius:var(--radius-sm);cursor:pointer;font-size:var(--text-body);line-height:var(--line-height-body);color:var(--color-text-primary);';

    const spacer = document.createElement('span');
    spacer.style.flex = '1';
    const enter = document.createElement('ve-icon');
    enter.setAttribute('name', 'corner-down-left');
    enter.setAttribute('size', '14');
    enter.style.cssText = 'color:var(--color-icon-secondary);display:none;';

    row.append(...children, spacer, enter);
    row.addEventListener('mouseenter', () => {
      row.style.background = 'var(--color-bg-muted)';
      enter.style.display = 'inline-flex';
    });
    row.addEventListener('mouseleave', () => {
      row.style.background = 'transparent';
      enter.style.display = 'none';
    });
    row.addEventListener('mousedown', (ev) => {
      ev.preventDefault();
      onCommit();
    });
    return row;
  }

  function commit(node, tip) {
    input.insertNode({ id: crypto.randomUUID(), type: 'node', ...node });
    out.textContent = tip;
  }
  function paintSkill(query) {
    panels.skill.innerHTML = '';
    panels.skill.appendChild(groupTitle('技能'));
    skills
      .filter((it) => it.label.toLowerCase().includes(query.toLowerCase()))
      .forEach((it) => {
        const icon = document.createElement('ve-icon');
        icon.setAttribute('name', it.icon);
        icon.setAttribute('size', '16');
        icon.style.color = 'var(--color-icon-secondary)';
        const label = document.createElement('span');
        label.textContent = it.label;
        panels.skill.appendChild(
          makeRow([icon, label], () =>
            commit(
              { nodeType: 'tag', data: { label: it.label, value: it.value, icon: 'skill', iconPosition: 'before' } },
              '已插入技能：' + it.label,
            ),
          ),
        );
      });
  }

  function paintMember(query) {
    panels.member.innerHTML = '';
    panels.member.appendChild(groupTitle('成员'));
    members
      .filter((it) => it.label.toLowerCase().includes(query.toLowerCase()))
      .forEach((it) => {
        const avatar = document.createElement('ve-avatar');
        avatar.setAttribute('size', '24');
        avatar.style.cssText = 'background:' + it.color + ';color:var(--color-text-foreground);';
        avatar.textContent = it.label[0];
        const label = document.createElement('span');
        label.textContent = it.label;
        const team = document.createElement('span');
        team.textContent = it.team;
        team.style.cssText =
          'font-size:var(--text-caption);color:var(--color-text-tertiary);';
        panels.member.appendChild(
          makeRow([avatar, label, team], () =>
            commit(
              { nodeType: 'tag', data: { label: '@' + it.label, value: it.value } },
              '已提及：@' + it.label,
            ),
          ),
        );
      });
  }

  function paintTopic(query) {
    panels.topic.innerHTML = '';
    panels.topic.appendChild(groupTitle('话题'));
    topics
      .filter((it) => it.label.toLowerCase().includes(query.toLowerCase()))
      .forEach((it) => {
        const tag = document.createElement('ve-tag');
        tag.setAttribute('size', 'small');
        tag.setAttribute('status', it.status);
        tag.textContent = it.label;
        panels.topic.appendChild(
          makeRow([tag], () =>
            commit(
              { nodeType: 'tag', data: { label: '#' + it.label, value: it.value } },
              '已关联话题：#' + it.label,
            ),
          ),
        );
      });
  }
  input.addEventListener('ve-chat-input-trigger', (e) => {
    const prefix = e.detail.trigger && e.detail.trigger.prefix;
    if (prefix === '/') paintSkill(e.detail.query);
    else if (prefix === '@') paintMember(e.detail.query);
    else if (prefix === '#') paintTopic(e.detail.query);
  });

  input.addEventListener('ve-chat-input-submit', (e) => {
    out.textContent = '已提交：' + e.detail.value;
  });

  paintSkill('');
  paintMember('');
  paintTopic('');
</script>
```

### 命令面板 D：带搜索 + 分类切换的弹框

当命令项很多时，常见做法是弹出一个更完整的面板：顶部一个搜索框、用 `ve-tabs` 切换「技能 / 工具」等分类、列表项可勾选（已选中的打勾），底部再挂一个「技能配置」入口。下例用 `ve-modal` 承载这样一个面板，输入 `/` 或点击左下角按钮均可唤起。

```html preview
<script type="module">
  import '@ve-design/web/ve-chat-input';
  import '@ve-design/web/ve-modal';
  import '@ve-design/web/ve-input';
  import '@ve-design/web/ve-tabs';
  import '@ve-design/web/icons/search';
  import '@ve-design/web/icons/skill';
  import '@ve-design/web/icons/check';
  import '@ve-design/web/icons/settings';
</script>

<ve-chat-input id="ci-panel" placeholder="输入 / 或点左下角按钮唤起面板">
  <ve-chat-input-action slot="left-action" icon-only aria-label="选择技能" id="ci-panel-open">
    <ve-icon slot="icon" name="skill" size="16"></ve-icon>
  </ve-chat-input-action>
</ve-chat-input>

<ve-modal id="ci-panel-modal" width="480px" title="选择能力">
  <ve-input id="ci-panel-search" placeholder="搜索技能 / 工具" allow-clear>
    <ve-icon slot="prefix" name="search"></ve-icon>
  </ve-input>

  <ve-tabs id="ci-panel-tabs" default-active-tab="skill" type="capsule" style="margin-top:12px;">
    <ve-tab-pane key="skill" title="技能 58">
      <div id="ci-panel-list-skill" class="ci-panel-list"></div>
    </ve-tab-pane>
    <ve-tab-pane key="mcp" title="工具 3">
      <div id="ci-panel-list-mcp" class="ci-panel-list"></div>
    </ve-tab-pane>
  </ve-tabs>

  <div
    slot="footer"
    style="display:flex;align-items:center;gap:8px;padding:4px 0;cursor:pointer;color:var(--color-text-secondary);font-size:13px;"
    id="ci-panel-config"
  >
    <ve-icon name="settings"></ve-icon><span>技能配置</span>
  </div>
</ve-modal>

<p id="ci-panel-out" style="margin-top:12px;font-size:13px;color:var(--color-text-tertiary);">尚未选择</p>

<script>
  const input = document.getElementById('ci-panel');
  const modal = document.getElementById('ci-panel-modal');
  const search = document.getElementById('ci-panel-search');
  const tabs = document.getElementById('ci-panel-tabs');
  const out = document.getElementById('ci-panel-out');

  const data = {
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
  const selected = new Set(['ui-tester']);
  let keyword = '';

  function renderList(tab) {
    const host = document.getElementById(`ci-panel-list-${tab}`);
    if (!host) return;
    host.innerHTML = '';
    data[tab]
      .filter((it) => it.label.toLowerCase().includes(keyword.toLowerCase()))
      .forEach((it) => {
        const row = document.createElement('div');
        row.style.cssText =
          'display:flex;align-items:center;justify-content:space-between;padding:8px 10px;border-radius:8px;cursor:pointer;font-size:14px;color:var(--color-text-primary);';
        row.onmouseenter = () => (row.style.background = 'var(--color-bg-muted)');
        row.onmouseleave = () => (row.style.background = '');
        const left = document.createElement('span');
        left.textContent = it.label;
        row.appendChild(left);
        if (selected.has(it.value)) {
          row.innerHTML += '<ve-icon name="check" style="color:var(--color-text-info);"></ve-icon>';
        }
        row.addEventListener('click', () => choose(it));
        host.appendChild(row);
      });
  }

  function renderAll() {
    renderList('skill');
    renderList('mcp');
  }

  function open() {
    keyword = '';
    search.value = '';
    renderAll();
    modal.visible = true;
  }

  function choose(it) {
    if (selected.has(it.value)) selected.delete(it.value);
    else selected.add(it.value);
    renderAll();
    input.insertNode({
      id: crypto.randomUUID(),
      type: 'node',
      nodeType: 'tag',
      data: { label: it.label, value: it.value, icon: 'skill', iconPosition: 'before' },
    });
    modal.visible = false;
    out.textContent = `已选：${[...selected].join('、')}`;
  }

  input.triggers = [{ prefix: '/' }];
  input.addEventListener('ve-chat-input-trigger', (e) => {
    if (e.detail.trigger !== null) open();
  });
  document.getElementById('ci-panel-open').addEventListener('click', open);

  search.addEventListener('ve-input', (e) => {
    keyword = e.detail.value ?? '';
    renderAll();
  });
  modal.addEventListener('ve-close', () => (modal.visible = false));
  document.getElementById('ci-panel-config').addEventListener('click', () => {
    out.textContent = '打开「技能配置」';
    modal.visible = false;
  });

  input.addEventListener('ve-chat-input-submit', (e) => {
    console.log('[submit]', e.detail.value, e.detail.data);
    out.textContent = `已提交：${e.detail.value}`;
  });
</script>
```

### 自定义节点 render

通过组件的 `nodeRenders` 属性传入 `{ [nodeType]: render }` 即可扩展内联节点，无需全局注册。传入的 render 会与内置的 `tag` / `select` / `variable` 合并，同名会覆盖内置。

一个 render 就是一个**框架无关**的普通对象：

```ts
const myRender = {
  // 是否可编辑：true 时光标可进入、其文本计入 value（如变量槽）；chip 一般 false
  editable: false,
  // 纯文本表示：决定该节点在 e.detail.value 里被拍平成什么文本；缺省回退 defaultNodeText
  getText: (node) => `[${node.data?.value ?? ''}]`,
  // 渲染函数：返回一个 DOM 节点（或 string）。每次该节点数据变化都会重新调用
  render: ({ node, disabled, updateData, remove }) => {
    const dom = document.createElement('span');
    // node.data  —— 该节点的数据
    // updateData —— 合并 data 并触发 change（会用新 data 重新 render 本节点）
    // remove     —— 把整个节点从编辑器里删掉
    return dom;
  },
};
```

关键点：

- `render` 里拿到的 `node.data` 是**当前最新**数据；想改数据就调 `updateData(patch)`，组件会 merge 后**只重渲染这一个节点**，其余文本不受影响。
- 想让节点「可删除」，在节点内的按钮里调 `remove()` 即可。
- `getText` 决定提交时这个节点变成什么文本，务必实现，否则回退到默认取值。

#### 示例一：可切换 + 可删除的优先级 chip

点击文字在 `高 / 中 / 低` 间循环（`updateData`），点击 × 删除整个节点（`remove`）。注意切换后周围文本保持不变。

```html preview
<script type="module">
  import '@ve-design/web/ve-chat-input';
  import '@ve-design/web/icons/close';
</script>

<ve-chat-input id="ci-custom" placeholder="自定义节点"></ve-chat-input>
<p id="ci-custom-out" style="margin-top:12px;font-size:13px;color:var(--color-text-tertiary);">尚未提交</p>

<script>
  const el = document.getElementById('ci-custom');
  const out = document.getElementById('ci-custom-out');
  const order = ['高', '中', '低'];
  const color = {
    高: 'var(--color-text-danger)',
    中: 'var(--color-text-warning)',
    低: 'var(--color-text-success)',
  };

  el.nodeRenders = {
    priority: {
      editable: false,
      getText: (node) => `优先级:${node.data?.value ?? '高'}`,
      render: ({ node, updateData, remove }) => {
        const value = node.data?.value ?? '高';
        const next = order[(order.indexOf(value) + 1) % order.length];

        const span = document.createElement('span');
        span.style.cssText =
          'display:inline-flex;align-items:center;gap:4px;padding:0 6px;border-radius:6px;background:var(--color-bg-muted);cursor:pointer;';

        const dot = document.createElement('span');
        dot.style.cssText = `width:6px;height:6px;border-radius:50%;background:${color[value]};`;

        const label = document.createElement('span');
        label.textContent = `优先级：${value}`;
        label.style.cssText = 'color:var(--color-text-primary);';
        label.addEventListener('click', () => updateData({ value: next }));

        const del = document.createElement('button');
        del.type = 'button';
        del.style.cssText =
          'border:none;background:none;padding:0;display:inline-flex;cursor:pointer;color:var(--color-text-tertiary);';
        del.innerHTML = '<ve-icon name="close" size="12"></ve-icon>';
        del.addEventListener('click', remove);

        span.append(dot, label, del);
        return span;
      },
    },
  };

  el.value = {
    segments: [
      { type: 'text', text: '这个任务的 ' },
      { type: 'node', id: 'p1', nodeType: 'priority', data: { value: '高' } },
      { type: 'text', text: '，请尽快处理' },
    ],
    attachments: [],
  };

  el.addEventListener('ve-chat-input-change', (e) => {
    el.value = e.detail.data;
  });
  el.addEventListener('ve-chat-input-submit', (e) => {
    console.log('[submit]', e.detail.value, e.detail.data);
    out.textContent = `已提交：${e.detail.value}`;
  });
</script>
```

#### 示例二：内嵌真实组件（日期选择）

`render` 返回的可以是任意 DOM，包括其它 Web Component。下例直接内嵌一个 `ve-date-picker`，选完日期回写到节点 `data.value`，`getText` 让它以 `@2026-07-01` 形式进入提交文本。

```html preview
<script type="module">
  import '@ve-design/web/ve-chat-input';
  import '@ve-design/web/ve-date-picker';
</script>

<ve-chat-input id="ci-custom2" placeholder="内嵌日期选择"></ve-chat-input>
<p id="ci-custom2-out" style="margin-top:12px;font-size:13px;color:var(--color-text-tertiary);">尚未提交</p>

<script>
  const el = document.getElementById('ci-custom2');
  const out = document.getElementById('ci-custom2-out');

  el.nodeRenders = {
    'date-chip': {
      editable: false,
      getText: (node) => (node.data?.value ? `@${node.data.value}` : '@日期'),
      render: ({ node, updateData }) => {
        const value = node.data?.value ?? '';
        const picker = document.createElement('ve-date-picker');
        picker.setAttribute('size', 'small');
        picker.setAttribute('placeholder', '选择日期');
        if (value) picker.value = value;
        picker.addEventListener('ve-change', (ev) => {
          updateData({ value: ev.detail.value ?? '' });
        });
        return picker;
      },
    },
  };

  el.value = {
    segments: [
      { type: 'text', text: '提醒我在 ' },
      { type: 'node', id: 'd1', nodeType: 'date-chip', data: { value: '' } },
      { type: 'text', text: ' 前完成周报' },
    ],
    attachments: [],
  };

  el.addEventListener('ve-chat-input-change', (e) => {
    el.value = e.detail.data;
  });
  el.addEventListener('ve-chat-input-submit', (e) => {
    console.log('[submit]', e.detail.value, e.detail.data);
    out.textContent = `已提交：${e.detail.value}`;
  });
</script>
```

### Border Glow

设置 `border-glow` 后，输入框边缘会根据鼠标位置展示组件内置光效。通过 `border-glow-color` 配置外发光 HSL 颜色，通过 `border-glow-colors` 配置彩色边框渐变色（支持逗号或 `|` 分隔）。

注意: 设计助手 Agent 交付不接受只使用 `border-glow`。必须按上方“必需流光边框”接入 `motion/shimmer-border.css` 和 `motion/shimmer-border.js`,把 `.ved-shimmer-host` / `data-shimmer` / `data-shimmer-radius` 挂在 Composer shell 上。

```html preview
<script type="module">
  import '@ve-design/web/ve-chat-input';
</script>

<ve-chat-input
  id="ci-glow"
  border-glow
  border-glow-color="268 100 76"
  border-glow-colors="#c084fc,#f472b6,#38bdf8"
  placeholder="移动鼠标到边缘试试 · Move near the edge"
></ve-chat-input>

<script>
  document.getElementById('ci-glow').addEventListener('ve-chat-input-submit', (e) => {
    console.log('[submit]', e.detail.value, e.detail.data);
  });
</script>
```

## API

### `ve-chat-input`

#### 属性

| 属性                 | 说明                                                                                       | 类型                                  | 默认值                      |
| -------------------- | ------------------------------------------------------------------------------------------ | ------------------------------------- | --------------------------- |
| `value`              | 受控输入值。接受**普通字符串**或**结构化对象** `{ segments, attachments }`；是 property（无 attribute） | `string \| ChatInputValue`            | `''`                        |
| `placeholder`        | 编辑器为空时的占位符                                                                        | `string`                              | `''`                        |
| `disabled`           | 禁用整个输入框                                                                              | `boolean`                             | `false`                     |
| `loading`            | 生成中态：右侧按钮变为停止按钮，点击派发 `ve-chat-input-cancel`                             | `boolean`                             | `false`                     |
| `size`               | 尺寸（`small` 容器最大宽 420px）                                                            | `'small' \| 'default' \| 'large'`     | `'default'`                 |
| `expandable`         | 是否显示全屏切换按钮                                                                        | `boolean`                             | `false`                     |
| `triggers`           | 低级唤起键配置：**仅派发** `ve-chat-input-trigger` 事件而不带内建面板（自行弹 Modal 等场景）。声明 `<ve-chat-input-panel>` 会自动补充对应唤起键，无需在此重复。是 property（无 attribute） | `ChatInputTrigger[]`                  | `[]`                        |
| `nodeRenders`        | 自定义内联节点 render map，合并到内置 `tag`/`select`/`variable` 之上。是 property（无 attribute） | `ChatInputNodeRenders \| undefined`   | `undefined`                 |
| `border-glow`        | 是否开启鼠标跟随边框光效                                                                    | `boolean`                             | `false`                     |
| `border-glow-color`  | 外发光 HSL 颜色，如 `268 100 76` 或 `268deg 100% 76%`                                       | `string`                              | `'40 80 80'`                |
| `border-glow-colors` | 彩色边框渐变色，支持逗号或 `|` 分隔                                                          | `string`                              | `'#c084fc,#f472b6,#38bdf8'` |

`ChatInputTrigger`：`{ prefix: string }`。`prefix` 为唤起字符（如 `'/'`、`'@'`，可自定义）。

#### `<ve-chat-input-panel>` 属性

在 `<ve-chat-input>` 内声明命令面板的子元素。组件会根据这些声明推导唤起键与面板定位，并管理面板内容的展示，无需手写 slot 或维护 `triggers`。

| 属性        | 说明                                                                 | 类型                | 默认值  |
| ----------- | ------------------------------------------------------------------- | ------------------- | ------- |
| `trigger`   | 唤起该面板的前缀字符（如 `/`、`@`、`#`）；`name` 缺省时兼作面板 key | `string`            | `''`    |
| `name`      | 显式指定面板 key / 插槽后缀，缺省取 `trigger`                        | `string`            | `''`    |
| `placement` | 面板锚定方式：`top` 贴聊天框顶部（与输入框同宽），`caret` 贴光标      | `'top' \| 'caret'`  | `'top'` |

#### 插槽

| 名称           | 说明                                                                                  |
| -------------- | ------------------------------------------------------------------------------------- |
| `header`       | 编辑器上方自定义内容（附件展示区由组件自动渲染，此处用于引用源、上下文卡片等）         |
| `left-action`  | 工具栏左侧操作区，建议放置 `ve-chat-input-action` 或上传入口；提供 `footer` 后失效     |
| `right-action` | 在默认发送 / 停止按钮左侧添加自定义内容（如语音按钮等）；提供 `footer` 后失效          |
| `footer`       | 替换整个工具栏；**优先级最高**，提供后 `left-action` / `right-action` 不再生效（互斥） |

#### 事件

| 事件                            | 触发时机                                                                | 回调 detail                          |
| ------------------------------- | ----------------------------------------------------------------------- | ------------------------------------ |
| `ve-chat-input-change`          | 值变化（文本、节点、附件任一改变）                                       | `{ value: string, data: ChatInputValue }` |
| `ve-chat-input-submit`          | Enter 提交或点击发送（且内容非空、未禁用、未 loading）                   | `{ value: string, data: ChatInputValue }` |
| `ve-chat-input-cancel`          | `loading` 时点击停止按钮（`disabled` 时不触发）                          | -                                    |
| `ve-chat-input-focus`           | 编辑器聚焦                                                              | -                                    |
| `ve-chat-input-blur`            | 编辑器失焦                                                              | -                                    |
| `ve-chat-input-press-enter`     | Enter 按下（`Shift+Enter` 不触发）；`preventDefault()` 可阻断后续 submit | `{ originalEvent: KeyboardEvent \| null }` |
| `ve-chat-input-trigger`         | 命令触发键的查询变化（输入 `prefix` 后开始，命中空格或失配后结束）       | `{ trigger: ChatInputTrigger \| null, query: string }` |
| `ve-chat-input-attachment-remove` | 附件被移除（点击 chip 的关闭按钮）                                     | `{ id: string, attachment: ChatInputAttachment }` |
| `ve-chat-input-expand-change`   | 全屏切换                                                                | `{ expanded: boolean }`              |

#### 实例方法

| 方法                                   | 说明                                                                                  |
| -------------------------------------- | ------------------------------------------------------------------------------------- |
| `focus(options?)`                      | 聚焦输入编辑器                                                                         |
| `queryActiveTrigger()`                 | 返回光标附近的触发上下文 `ChatInputTriggerDetail \| null`，用于按需读取当前 query      |
| `insertNode(node, { replaceTrigger })` | 在光标处插入内联节点；当存在激活触发时默认替换已输入的 `prefix+query`（`replaceTrigger: false` 可关闭） |
| `getChatInputInfo()`                   | 返回 `{ value, text, isFocus, isLoading, isExpanded }` 状态快照                        |

#### CSS Parts

`container` · `wrapper` · `box` · `header` · `attachments` · `body` · `editor` · `toolbar` · `actions` · `submit` · `send` · `stop` · `expand-btn`

### 扩展点：节点 render

通过组件的 `nodeRenders` 属性自定义内联节点的渲染与取值，无全局注册表。传入的 render 会与内置的 `tag` / `select` / `variable` 合并，同名会覆盖内置；未传时仅使用内置 render。

```ts
// 类型（从 @ve-design/web/ve-chat-input 导出）
type ChatInputNodeRenders = Record<string, ChatInputNodeRender>;

interface ChatInputNodeRender {
  /** 节点是否可编辑（光标可进入、文本计入 value）。默认 false。 */
  editable?: boolean;
  /** 渲染节点内容，返回 DOM HTMLElement 或 string（框架无关，不依赖 lit）。 */
  render(ctx: ChatInputNodeRenderContext): HTMLElement | string;
  /** 节点的纯文本表示；缺省时回退到 defaultNodeText。 */
  getText?(node: ChatInputNodeSegment): string;
}

interface ChatInputNodeRenderContext {
  node: ChatInputNodeSegment;
  disabled: boolean;
  updateData: (patch: Record<string, unknown>) => void; // 合并 data 并触发 change
  remove: () => void; // 删除该节点
}
```

设置方式：`el.nodeRenders = { priority: { render: (ctx) => document.createElement(...) } }`。React 中改为传 `nodeRenders` prop，`render` 可直接返回 React 节点（详见 React 文档）。

内置 render：`tag`（不可编辑，`data: { label, value?, icon?, iconPosition? }`）、`select`（不可编辑，内嵌 `ve-select`，`data: { value, options, placeholder? }`）、`variable`（可编辑，`data: { value, placeholder? }`）。

### `ve-chat-input-action`

#### 属性

| 属性        | 说明                                            | 类型                              | 默认值      |
| ----------- | ----------------------------------------------- | --------------------------------- | ----------- |
| `type`      | 形态                                            | `'button' \| 'dropdown'`          | `'button'`  |
| `status`    | 视觉状态                                        | `'default' \| 'active'`           | `'default'` |
| `size`      | 尺寸（通常由父级 `ve-chat-input` 派发）         | `'small' \| 'default' \| 'large'` | `'default'` |
| `disabled`  | 是否禁用                                        | `boolean`                         | `false`     |
| `icon-only` | 是否为仅图标模式（圆角方形按钮，无文本 padding）| `boolean`                         | `false`     |
| `data-open` | 反射的下拉打开状态（属性名为 `data-open`）      | `boolean`                         | `false`     |

#### 插槽

| 名称        | 说明                          |
| ----------- | ----------------------------- |
| `(default)` | 按钮文案                      |
| `icon`      | 前置图标（建议 16×16 的 svg） |

#### 事件

| 事件                         | 触发时机                        | 回调 detail                                       |
| ---------------------------- | ------------------------------- | ------------------------------------------------- |
| `ve-chat-input-action-click` | 按钮被点击（dropdown 也会触发） | `{ type: 'button' \| 'dropdown', open: boolean }` |
