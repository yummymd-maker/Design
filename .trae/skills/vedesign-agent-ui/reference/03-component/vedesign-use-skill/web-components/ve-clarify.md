`ve-clarify` 用于在 AI 对话流中把模型的「待确认 / 待选择」诉求转化为一组结构化问答，让用户通过点选 + 文本补充的方式给出答案。组件通过 `questions` 数据驱动多步问答流程，并以 `ClarifyResult` 形式回传单题结果与全量结果。组件本身只承担问答 UI、状态机和键盘可达性，不直接调用任何外部服务。

## 何时使用

- AI 回复中需要用户在多个候选项之间做出选择，例如样式、风格、范围、目标平台等。
- AI 在执行任务前需要用户确认意图、参数或敏感操作。
- 需要让用户走多步问卷式追问，逐题完成上下文对齐。
- 既允许用户从候选项中选择，也允许用户跳过或补充自由文本作为附加上下文。

## 引入组件

```ts
import '@ve-design/web/ve-clarify';
```

## 示例

### 基础用法

最常见的单选场景：每题只允许选择一个选项，用户点击候选项即可立即提交并自动跳转到下一题。

```html preview
<script type="module">
  import '@ve-design/web/ve-clarify';
</script>

<section style=" padding:24px">
  <ve-clarify id="clarify-basic" style="display:block"></ve-clarify>
</section>

<script>
  const el = document.getElementById('clarify-basic');
  el.questions = [
    {
      id: 'tone',
      title: 'Pick a tone for the generated copy',
      options: [
        { key: 'pro', label: 'Professional', value: 'professional' },
        { key: 'cas', label: 'Casual', value: 'casual' },
        { key: 'play', label: 'Playful', value: 'playful' },
      ],
    },
  ];

  el.addEventListener('ve-submit', (e) => {
    console.log('submitted', e.detail);
  });
</script>
```

### 多选 + 自由文本

设置 `multiple: true` 进入多选模式；同时设置 `showInput: true` 后，组件会在选项下方渲染输入框，文本会与选中项一起进入 `ClarifyResult.inputText`。

```html preview
<script type="module">
  import '@ve-design/web/ve-clarify';
</script>

<section style=" padding:24px">
  <ve-clarify id="clarify-multi" style="display:block"></ve-clarify>
</section>

<script>
  const el = document.getElementById('clarify-multi');
  el.questions = [
    {
      id: 'features',
      title: 'Which capabilities should the agent enable?',
      multiple: true,
      showInput: true,
      inputPlaceholder: 'Add more capabilities...',
      options: [
        { key: 'web', label: 'Web search', value: 'web' },
        { key: 'code', label: 'Code interpreter', value: 'code' },
        { key: 'doc', label: 'Document retrieval', value: 'doc' },
        { key: 'img', label: 'Image generation', value: 'img' },
      ],
    },
  ];

  el.addEventListener('ve-submit', (e) => {
    console.log('submitted', e.detail);
  });
</script>
```

### 排序（拖拽优先级）

设置 `sortable: true` 后，候选项会以可拖拽的列表呈现，用户通过抓取右侧的拖拽手柄重新排序，最后点击右下角的提交按钮派发 `ve-submit`，`selectedValues` 即为「从最重要到最不重要」的排序结果。

```html preview
<script type="module">
  import '@ve-design/web/ve-clarify';
</script>

<section style="padding:24px">
  <ve-clarify id="clarify-sortable" style="display:block"></ve-clarify>
</section>

<script>
  const el = document.getElementById('clarify-sortable');
  el.questions = [
    {
      id: 'ui-priority',
      title: '第一步：你最在意这个 UI 方案 哪几件事？拖拽排序(从最重要到最不重要)',
      sortable: true,
      options: [
        { key: 'visual', label: '视觉表达', value: 'visual' },
        { key: 'usability', label: '交互可用性', value: 'usability' },
        { key: 'layout', label: '布局合理性', value: 'layout' },
        { key: 'design', label: '设计感', value: 'design' },
      ],
    },
  ];

  el.addEventListener('ve-submit', (e) => {
    console.log('sorted result', e.detail);
  });
</script>
```

### 多步问答流转

`questions` 是一个数组，组件按顺序流转。每完成一题就触发 `ve-submit`，全部完成后触发 `ve-complete` 输出聚合结果。

```html preview
<script type="module">
  import '@ve-design/web/ve-clarify';
</script>

<section style=" padding:24px">
  <ve-clarify id="clarify-flow" style="display:block"></ve-clarify>
  <pre
    id="clarify-flow-output"
    style="margin-top:12px; padding:12px; background:var(--color-bg-secondary, #f6f6fc); color:var(--color-text-primary, #101013); border-radius:8px; font-size:12px; line-height:1.6; max-height:240px; overflow:auto"
  >
results: []</pre>
</section>

<script>
  const el = document.getElementById('clarify-flow');
  const output = document.getElementById('clarify-flow-output');

  el.questions = [
    {
      id: 'goal',
      title: 'What is the goal of this task?',
      options: [
        { key: 'doc', label: 'Generate documentation', value: 'doc' },
        { key: 'sum', label: 'Summarize content', value: 'sum' },
        { key: 'rev', label: 'Review code quality', value: 'rev' },
      ],
    },
    {
      id: 'audience',
      title: 'Who is the audience?',
      options: [
        { key: 'eng', label: 'Engineers', value: 'engineers' },
        { key: 'pm', label: 'Product managers', value: 'pm' },
        { key: 'all', label: 'Mixed audience', value: 'mixed' },
      ],
    },
    {
      id: 'depth',
      title: 'How deep should the answer go?',
      options: [
        { key: 's', label: 'Brief overview', value: 'brief' },
        { key: 'm', label: 'Standard analysis', value: 'standard' },
        { key: 'l', label: 'Deep dive', value: 'deep' },
      ],
    },
  ];

  el.addEventListener('ve-complete', (e) => {
    output.textContent = JSON.stringify(e.detail, null, 2);
  });
</script>
```

### 受控 activeIndex

通过 `active-index` / `activeIndex` 受控当前激活题，业务侧可在外部按钮、键盘等其它入口驱动跳题。

```html preview
<script type="module">
  import '@ve-design/web/ve-button';
  import '@ve-design/web/ve-clarify';
</script>

<section style="padding:24px; display:grid; gap:12px">
  <div style="display:flex; gap:8px">
    <ve-button id="clarify-prev" type="outline" size="small">Prev</ve-button>
    <ve-button id="clarify-next" type="outline" size="small">Next</ve-button>
    <span id="clarify-index" style="line-height:28px; color:var(--color-text-tertiary)">1 / 3</span>
  </div>
  <ve-clarify id="clarify-controlled" active-index="0" style="display:block"></ve-clarify>
</section>

<script>
  const el = document.getElementById('clarify-controlled');
  const prev = document.getElementById('clarify-prev');
  const next = document.getElementById('clarify-next');
  const indexLabel = document.getElementById('clarify-index');

  const total = 3;
  el.questions = [
    {
      id: 'platform',
      title: 'Which platform are you targeting?',
      options: [
        { key: 'web', label: 'Web', value: 'web' },
        { key: 'mobile', label: 'Mobile', value: 'mobile' },
        { key: 'desktop', label: 'Desktop', value: 'desktop' },
      ],
    },
    {
      id: 'style',
      title: 'Pick a visual style',
      options: [
        { key: 'min', label: 'Minimal', value: 'minimal' },
        { key: 'mod', label: 'Modern', value: 'modern' },
        { key: 'play', label: 'Playful', value: 'playful' },
      ],
    },
    {
      id: 'lang',
      title: 'Output language',
      options: [
        { key: 'cn', label: 'Chinese', value: 'cn' },
        { key: 'en', label: 'English', value: 'en' },
        { key: 'jp', label: 'Japanese', value: 'jp' },
      ],
    },
  ];

  let index = 0;
  const sync = () => {
    el.setAttribute('active-index', String(index));
    indexLabel.textContent = `${index + 1} / ${total}`;
  };

  prev.addEventListener('click', () => {
    if (index > 0) {
      index -= 1;
      sync();
    }
  });
  next.addEventListener('click', () => {
    if (index < total - 1) {
      index += 1;
      sync();
    }
  });
  el.addEventListener('ve-active-index-change', (e) => {
    index = e.detail.index;
    sync();
  });
</script>
```

### 隐藏跳过 / 隐藏关闭

每个 `ClarifyQuestion` 可以通过 `showSkip: false` 隐藏跳过按钮，强制用户必须做出选择；组件级 `closable` 控制头部是否展示关闭按钮。

```html preview
<script type="module">
  import '@ve-design/web/ve-clarify';
</script>

<section style=" padding:24px">
  <ve-clarify id="clarify-required" closable style="display:block"></ve-clarify>
</section>

<script>
  const el = document.getElementById('clarify-required');
  el.questions = [
    {
      id: 'confirm',
      title: 'Confirm before running the selected operation',
      showSkip: false,
      options: [
        { key: 'yes', label: 'Yes, proceed', value: 'yes' },
        { key: 'no', label: 'No, stop here', value: 'no' },
      ],
    },
  ];

  el.addEventListener('ve-close', () => {
    console.log('user closed');
  });
</script>
```

### 禁用态

整体禁用所有交互。选项不响应 hover、click，但仍可被 Tab 聚焦以兼容读屏。

```html preview
<script type="module">
  import '@ve-design/web/ve-clarify';
</script>

<section style=" padding:24px">
  <ve-clarify id="clarify-disabled" disabled style="display:block"></ve-clarify>
</section>

<script>
  const el = document.getElementById('clarify-disabled');
  el.questions = [
    {
      id: 'demo',
      title: 'Disabled while previous task is still running',
      options: [
        { key: 'a', label: 'Option A', value: 'a' },
        { key: 'b', label: 'Option B', value: 'b' },
      ],
    },
  ];
</script>
```

### 选项级禁用

单个选项也可以通过 `disabled: true` 单独禁用，常用于权限受限或当前不可用的候选项。

```html preview
<script type="module">
  import '@ve-design/web/ve-clarify';
</script>

<section style=" padding:24px">
  <ve-clarify id="clarify-option-disabled" style="display:block"></ve-clarify>
</section>

<script>
  const el = document.getElementById('clarify-option-disabled');
  el.questions = [
    {
      id: 'plan',
      title: 'Pick a plan to upgrade',
      options: [
        { key: 'free', label: 'Free', value: 'free' },
        { key: 'pro', label: 'Pro', value: 'pro' },
        {
          key: 'team',
          label: 'Team (requires admin)',
          value: 'team',
          disabled: true,
        },
        {
          key: 'ent',
          label: 'Enterprise (contact sales)',
          value: 'ent',
          disabled: true,
        },
      ],
    },
  ];
</script>
```

### 提交事件 payload

每次单题提交都会派发 `ve-submit`，事件 `detail` 是一个 `ClarifyResult` 对象，包含 `questionId`、`selectedValues`、`inputText` 与 `skipped`。

```html preview
<script type="module">
  import '@ve-design/web/ve-clarify';
</script>

<section style=" padding:24px; display:grid; gap:12px">
  <ve-clarify id="clarify-event" style="display:block"></ve-clarify>
  <pre
    id="clarify-event-output"
    style="margin:0; padding:12px; background:var(--color-bg-secondary, #f6f6fc); color:var(--color-text-primary, #101013); border-radius:8px; font-size:12px; line-height:1.6; max-height:240px; overflow:auto"
  >
last result: -</pre>
</section>

<script>
  const el = document.getElementById('clarify-event');
  const output = document.getElementById('clarify-event-output');

  el.questions = [
    {
      id: 'channel',
      title: 'Which channels to publish?',
      multiple: true,
      showInput: true,
      inputPlaceholder: 'Notes for the release plan...',
      options: [
        { key: 'blog', label: 'Blog', value: 'blog' },
        { key: 'tw', label: 'X / Twitter', value: 'tw' },
        { key: 'ln', label: 'LinkedIn', value: 'ln' },
        { key: 'wx', label: 'WeChat', value: 'wx' },
      ],
    },
  ];

  el.addEventListener('ve-submit', (e) => {
    output.textContent = JSON.stringify(e.detail, null, 2);
  });
  el.addEventListener('ve-skip', (e) => {
    output.textContent = `skipped: ${e.detail.questionId}`;
  });
</script>
```

## API

### 属性

| 属性名               | 描述                                                                          | 类型              | 默认值  |
| -------------------- | ----------------------------------------------------------------------------- | ----------------- | ------- |
| `questions`          | 问答列表，按数组顺序流转                                                      | `ClarifyQuestion[]`  | `[]`    |
| `activeIndex`        | 当前激活的问题索引（受控）；未设置时由组件自行维护                              | `number \| null`  | `null`  |
| `defaultActiveIndex` | 初始激活问题索引（非受控）                                                    | `number`          | `0`     |
| `disabled`           | 整体禁用，所有交互不可用                                                      | `boolean`         | `false` |
| `closable`           | 是否在头部显示关闭按钮；为 `true` 时点击关闭会派发 `ve-close`                 | `boolean`         | `false` |
| `keyboardNavigation` | 是否启用键盘导航：↓↑ 切换、↵ 选择、`Esc` 跳过                                  | `boolean`         | `true`  |
| `showKeyboardHint`   | 是否在卡片底部展示键盘快捷键提示行                                            | `boolean`         | `true`  |

### 事件

所有事件名称均以 `ve-` 前缀派发，可通过 `addEventListener` 监听。

| 事件名                   | 触发时机                                              | `event.detail` 结构                  |
| ------------------------ | ----------------------------------------------------- | ------------------------------------ |
| `ve-active-index-change` | 当前激活的问题索引改变                                | `{ index: number }`                  |
| `ve-submit`              | 单个问题被用户提交                                    | `ClarifyResult`                         |
| `ve-skip`                | 单个问题被用户跳过                                    | `{ questionId: string }`             |
| `ve-complete`            | 所有问题流转完毕，输出聚合后的全部结果                | `{ results: ClarifyResult[] }`          |
| `ve-close`               | 用户点击头部关闭按钮（需 `closable` 为 `true`）       | `void`                               |

### 类型定义

```ts
interface ClarifyOption {
  key: string;
  label: string;
  value: string;
  disabled?: boolean;
}

interface ClarifyQuestion {
  id: string;
  title: string;
  options: ClarifyOption[];
  /** 多选模式（与 sortable 互斥） */
  multiple?: boolean;
  /** 排序模式：用户通过拖拽对候选项进行优先级排序（与 multiple 互斥） */
  sortable?: boolean;
  showInput?: boolean;
  inputPlaceholder?: string;
  showSkip?: boolean;
}

interface ClarifyResult {
  questionId: string;
  selectedValues: string[];
  inputText?: string;
  skipped: boolean;
}
```
