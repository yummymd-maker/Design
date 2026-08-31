`ve-actions` 用于渲染一行图标按钮组成的操作工具条，常作为 AI 对话气泡底部的快捷操作区。

## 何时使用

- AI 回答底部的「复制 / 重试 / 点赞 / 点踩 / 更多」操作行
- AI 提问底部的「复制 / 分享 / 引用 / 重试 / 编辑」操作行
- 任意需要一行紧凑图标按钮 + 可选 dropdown 的工具条

## 引入组件

```ts
import '@ve-design/web/ve-actions';
```

## 示例

### 基础用法

AI 回答底部典型操作栏：复制、重试、分隔线、点赞、点踩、更多。点击复制会短暂切换为对勾，点赞与点踩会切换为实心图标且互斥；右侧「参考 11 篇资料」是可点击的来源入口。

```html preview
<script type="module">
  import '@ve-design/web/ve-actions';
  import '@ve-design/web/ve-dropdown';
  import '@ve-design/web/icons';

  const COPY = '<ve-icon name="copy"></ve-icon>';
  const CHECK = '<ve-icon name="check"></ve-icon>';
  const LIKE = '<ve-icon name="like"></ve-icon>';
  const LIKE_FILL = '<ve-icon name="thumb-up-filled"></ve-icon>';
  const DISLIKE = '<ve-icon name="dislike"></ve-icon>';
  const DISLIKE_FILL = '<ve-icon name="thumb-down-filled"></ve-icon>';

  const menuEl = document.createElement('div');
  menuEl.innerHTML = `
    <ve-dropdown-item value="fav">收藏</ve-dropdown-item>
    <ve-dropdown-item value="export">导出</ve-dropdown-item>
    <ve-dropdown-item value="delete" danger>删除</ve-dropdown-item>
  `;

  const answerEl = document.getElementById('demo-answer');
  const answerLog = document.getElementById('demo-answer-log');
  const sourceButton = document.getElementById('demo-source-button');
  let copied = false;
  let liked = false;
  let disliked = false;
  let copyTimer;

  function renderAnswerActions() {
    answerEl.items = [
      { key: 'copy', icon: copied ? CHECK : COPY },
      { key: 'retry', icon: '<ve-icon name="refresh"></ve-icon>' },
      { key: 'd1', divider: true },
      { key: 'like', icon: liked ? LIKE_FILL : LIKE },
      { key: 'dislike', icon: disliked ? DISLIKE_FILL : DISLIKE },
      {
        key: 'more',
        type: 'more',
        menu: menuEl,
        icon: '<ve-icon name="more-horizontal"></ve-icon>',
      },
    ];
  }

  renderAnswerActions();

  answerEl.addEventListener('ve-actions-click', (event) => {
    const key = event.detail.item.key;
    if (key === 'copy') {
      copied = true;
      window.clearTimeout(copyTimer);
      renderAnswerActions();
      answerLog.textContent = '已复制，图标切换为对勾';
      copyTimer = window.setTimeout(() => {
        copied = false;
        renderAnswerActions();
      }, 2000);
      return;
    }
    if (key === 'like') {
      liked = !liked;
      if (liked) disliked = false;
      renderAnswerActions();
      answerLog.textContent = liked ? '已点赞' : '取消点赞';
      return;
    }
    if (key === 'dislike') {
      disliked = !disliked;
      if (disliked) liked = false;
      renderAnswerActions();
      answerLog.textContent = disliked ? '已点踩' : '取消点踩';
      return;
    }
    answerLog.textContent = `点击了 ${key}`;
  });

  sourceButton.addEventListener('click', () => {
    answerLog.textContent = '打开来源列表：共 11 篇资料';
  });
</script>

<section class="demo-answer-wrap">
  <ve-actions id="demo-answer">
    <button
      id="demo-source-button"
      slot="extra"
      type="button"
      class="demo-source-button"
      aria-label="查看 11 篇参考资料"
    >
      参考 11 篇资料
    </button>
  </ve-actions>
  <code id="demo-answer-log" class="demo-log">点击按钮试试</code>
</section>

<style>
  .demo-answer-wrap {
    display: grid;
    justify-content: center;
    gap: 12px;
  }
  .demo-log {
    display: block;
    color: var(--color-text-secondary);
    text-align: center;
  }
  .demo-source-button {
    all: unset;
    display: inline-flex;
    align-items: center;
    height: 28px;
    padding: 0 6px;
    border-radius: var(--radius-sm);
    color: var(--color-text-tertiary);
    font-size: 13px;
    cursor: pointer;
    box-sizing: border-box;
    transition: background-color 150ms ease;
  }
  .demo-source-button:hover,
  .demo-source-button:focus-visible {
    background: var(--ve-actions-btn-bg-hover, var(--color-bg-surface));
    outline: none;
  }
</style>
```

### 提问场景

提问消息的操作栏，左侧汇集复制、编辑、重试、点赞、点踩、更多等操作，右侧 `extra` 承载分页与时间。复制点击后短暂切换为对勾，点赞与点踩互斥切换为实心图标，更多操作使用内置 `ve-dropdown` 菜单。

```html preview
<script type="module">
  import '@ve-design/web/ve-actions';
  import '@ve-design/web/ve-dropdown';
  import '@ve-design/web/icons';

  const COPY = '<ve-icon name="copy"></ve-icon>';
  const CHECK = '<ve-icon name="check"></ve-icon>';
  const LIKE = '<ve-icon name="like"></ve-icon>';
  const LIKE_FILL = '<ve-icon name="thumb-up-filled"></ve-icon>';
  const DISLIKE = '<ve-icon name="dislike"></ve-icon>';
  const DISLIKE_FILL = '<ve-icon name="thumb-down-filled"></ve-icon>';

  const menuEl = document.createElement('div');
  menuEl.innerHTML = `
    <ve-dropdown-item value="fav">收藏</ve-dropdown-item>
    <ve-dropdown-item value="export">导出</ve-dropdown-item>
    <ve-dropdown-item value="delete" danger>删除</ve-dropdown-item>
  `;

  const questionEl = document.getElementById('demo-question');
  const questionLog = document.getElementById('demo-question-log');
  let copied = false;
  let liked = false;
  let disliked = false;
  let copyTimer;

  function renderQuestionActions() {
    questionEl.items = [
      { key: 'copy', icon: copied ? CHECK : COPY },
      { key: 'edit', icon: '<ve-icon name="edit"></ve-icon>' },
      { key: 'retry', icon: '<ve-icon name="refresh"></ve-icon>' },
      { key: 'd1', divider: true },
      { key: 'like', icon: liked ? LIKE_FILL : LIKE },
      { key: 'dislike', icon: disliked ? DISLIKE_FILL : DISLIKE },
      {
        key: 'more',
        type: 'more',
        menu: menuEl,
        icon: '<ve-icon name="more-horizontal"></ve-icon>',
      },
    ];
  }
  renderQuestionActions();

  questionEl.addEventListener('ve-actions-click', (event) => {
    const key = event.detail.item.key;
    if (key === 'copy') {
      copied = true;
      window.clearTimeout(copyTimer);
      renderQuestionActions();
      questionLog.textContent = '已复制，图标切换为对勾';
      copyTimer = window.setTimeout(() => {
        copied = false;
        renderQuestionActions();
      }, 2000);
      return;
    }
    if (key === 'like') {
      liked = !liked;
      if (liked) disliked = false;
      renderQuestionActions();
      questionLog.textContent = liked ? '已点赞' : '取消点赞';
      return;
    }
    if (key === 'dislike') {
      disliked = !disliked;
      if (disliked) liked = false;
      renderQuestionActions();
      questionLog.textContent = disliked ? '已点踩' : '取消点踩';
      return;
    }
    questionLog.textContent = `点击了 ${key}`;
  });

  let current = 1;
  const total = 3;
  const pageText = document.getElementById('page-text');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');

  function updatePage() {
    pageText.textContent = `${current}/${total}`;
    prevBtn.style.opacity = current <= 1 ? '0.4' : '1';
    prevBtn.style.pointerEvents = current <= 1 ? 'none' : 'auto';
    nextBtn.style.opacity = current >= total ? '0.4' : '1';
    nextBtn.style.pointerEvents = current >= total ? 'none' : 'auto';
  }
  updatePage();

  prevBtn.addEventListener('click', () => {
    if (current > 1) {
      current--;
      updatePage();
    }
  });
  nextBtn.addEventListener('click', () => {
    if (current < total) {
      current++;
      updatePage();
    }
  });
</script>

<section class="demo-question-wrap">
  <ve-actions id="demo-question">
    <span slot="extra" class="demo-extra">
      <span class="demo-pager">
        <button id="prev-btn" class="demo-pager-btn" aria-label="上一页">
          <ve-icon name="chevron-left-sm" style="--ve-icon-size:14px"></ve-icon>
        </button>
        <span id="page-text" class="demo-pager-text">1/3</span>
        <button id="next-btn" class="demo-pager-btn" aria-label="下一页">
          <ve-icon name="chevron-right-sm" style="--ve-icon-size:14px"></ve-icon>
        </button>
      </span>
      <span class="demo-time">4月22日 13:33</span>
    </span>
  </ve-actions>
  <code id="demo-question-log" class="demo-log">点击按钮试试</code>
</section>
<style>
  .demo-question-wrap {
    display: grid;
    justify-items: center;
    gap: 12px;
  }
  .demo-log {
    display: block;
    color: var(--color-text-secondary);
  }
  .demo-extra {
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }
  .demo-pager {
    display: inline-flex;
    align-items: center;
    gap: 2px;
    font-size: 13px;
    color: var(--color-text-tertiary);
  }
  .demo-pager-text {
    min-width: 24px;
    text-align: center;
  }
  .demo-pager-btn {
    all: unset;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: var(--ve-actions-btn-size, 28px);
    height: var(--ve-actions-btn-size, 28px);
    border-radius: var(--ve-actions-btn-radius, var(--radius-md, 6px));
    cursor: pointer;
    color: var(--ve-actions-icon-color, var(--color-text-tertiary));
    transition: background-color 150ms ease;
    box-sizing: border-box;
  }
  .demo-pager-btn:hover {
    background: var(--ve-actions-btn-bg-hover, var(--color-bg-muted, #f2f2f2));
  }
  .demo-pager-btn:active {
    background: var(--ve-actions-btn-bg-active, var(--color-bg-emphasis, #e8e8ec));
  }
  .demo-time {
    color: var(--color-text-tertiary);
    font-size: 13px;
    white-space: nowrap;
  }
</style>
```

### 状态切换

通过监听 `ve-actions-click` 更新 `items` 实现 toggle 效果。

```html preview
<script type="module">
  import '@ve-design/web/ve-actions';
  import '@ve-design/web/icons';

  const COPY = '<ve-icon name="copy"></ve-icon>';
  const CHECK = '<ve-icon name="check"></ve-icon>';
  const LIKE = '<ve-icon name="like"></ve-icon>';
  const LIKE_FILL = '<ve-icon name="thumb-up-filled"></ve-icon>';
  const DISLIKE = '<ve-icon name="dislike"></ve-icon>';
  const DISLIKE_FILL = '<ve-icon name="thumb-down-filled"></ve-icon>';

  const el = document.getElementById('demo-toggle');
  const log = document.getElementById('toggle-log');
  let liked = false,
    disliked = false,
    copied = false;

  function render() {
    el.items = [
      { key: 'copy', icon: copied ? CHECK : COPY },
      { key: 'like', icon: liked ? LIKE_FILL : LIKE },
      { key: 'dislike', icon: disliked ? DISLIKE_FILL : DISLIKE },
    ];
  }
  render();

  el.addEventListener('ve-actions-click', (e) => {
    const key = e.detail.item.key;
    if (key === 'copy') {
      copied = true;
      render();
      log.textContent = '已复制';
      setTimeout(() => {
        copied = false;
        render();
      }, 2000);
    } else if (key === 'like') {
      liked = !liked;
      if (liked) disliked = false;
      render();
      log.textContent = liked ? '已点赞' : '取消点赞';
    } else if (key === 'dislike') {
      disliked = !disliked;
      if (disliked) liked = false;
      render();
      log.textContent = disliked ? '已点踩' : '取消点踩';
    }
  });
</script>

<section style="display:grid;gap:12px;justify-content:center;">
  <ve-actions id="demo-toggle"></ve-actions>
  <code id="toggle-log" style="display:block;color:var(--color-text-secondary);"
    >点击按钮试试</code
  >
</section>
```

### 禁用项

`disabled: true` 禁用单个操作项。

```html preview
<script type="module">
  import '@ve-design/web/ve-actions';
  import '@ve-design/web/icons';

  document.getElementById('demo-disabled').items = [
    { key: 'copy', icon: '<ve-icon name="copy"></ve-icon>' },
    {
      key: 'retry',
      icon: '<ve-icon name="refresh"></ve-icon>',
      disabled: true,
    },
    { key: 'like', icon: '<ve-icon name="like"></ve-icon>', disabled: true },
    { key: 'dislike', icon: '<ve-icon name="dislike"></ve-icon>' },
  ];
</script>

<div style="display:flex;justify-content:center;">
  <ve-actions id="demo-disabled"></ve-actions>
</div>
```

### 监听事件

监听 `ve-actions-click` 统一处理所有项的点击回调。

```html preview
<script type="module">
  import '@ve-design/web/ve-actions';
  import '@ve-design/web/icons';

  document.getElementById('demo-event').items = [
    { key: 'copy', icon: '<ve-icon name="copy"></ve-icon>' },
    { key: 'retry', icon: '<ve-icon name="refresh"></ve-icon>' },
    { key: 'like', icon: '<ve-icon name="like"></ve-icon>' },
    { key: 'dislike', icon: '<ve-icon name="dislike"></ve-icon>' },
  ];

  document
    .getElementById('demo-event')
    .addEventListener('ve-actions-click', (event) => {
      document.getElementById('event-log').textContent =
        `Selected: ${event.detail.item.key}`;
    });
</script>

<section style="display:grid;gap:12px;justify-content:center;">
  <ve-actions id="demo-event"></ve-actions>
  <code id="event-log" style="display:block;color:var(--color-text-secondary);"
    >Choose an action</code
  >
</section>
```

## API

### ve-actions 属性

| 属性名  | 描述                                     | 类型             | 默认值 |
| ------- | ---------------------------------------- | ---------------- | ------ |
| `items` | 操作项数组（JS 属性，非 HTML attribute） | `VeActionItem[]` | `[]`   |

### ve-actions 事件

| 事件名             | 描述                             | 参数类型                              |
| ------------------ | -------------------------------- | ------------------------------------- |
| `ve-actions-click` | 非 divider / more 项被点击时触发 | `CustomEvent<{ item: VeActionItem }>` |

### ve-actions 插槽

| 插槽名  | 描述                                                   |
| ------- | ------------------------------------------------------ |
| `extra` | 右侧自定义内容，与 `items` 之间用 `space-between` 分隔 |

### VeActionItem

| 字段       | 描述                                        | 类型                    | 默认值  |
| ---------- | ------------------------------------------- | ----------------------- | ------- |
| `key`      | 唯一标识                                    | `string`                | —       |
| `type`     | 项类型；省略为普通图标按钮                  | `'more'`                | —       |
| `divider`  | 是否渲染为分隔线                            | `boolean`               | `false` |
| `text`     | 纯文本内容，渲染为非点击文本项              | `string`                | —       |
| `icon`     | 图标，支持 DOM 节点或 SVG 字符串            | `Node \| string`        | —       |
| `disabled` | 是否禁用                                    | `boolean`               | `false` |
| `onClick`  | 单项点击回调，优先级高于 `ve-actions-click` | `(item, event) => void` | —       |
| `menu`     | 仅 `type: 'more'` 生效，菜单内容节点        | `Element`               | —       |
