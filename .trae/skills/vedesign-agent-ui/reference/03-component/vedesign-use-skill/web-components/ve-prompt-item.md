`ve-prompt-item` 用于展示提示词集（Prompt Set）中的单个提示项，提供三种展示形态：文字卡片网格、文字行、媒体卡片，与设计系统中的 `Card Grid / List & item / Card 3:2 & 1:1` 相对应。

## 何时使用

- 提示词集首页推荐位（卡片网格、列表行、紧凑芯片）。
- 灵感画廊、案例集图卡（3:2 / 1:1 媒体卡片，hover 显示提示词与 CTA）。
- 任意需要"标题 + 描述 + 进入箭头"的可点击列表条目。

## 引入组件

```ts
import '@ve-design/web/ve-prompt-item';
```

## 示例

### 基础用法

`type="card"` 渲染包含标题、描述与右下角箭头的卡片，hover 时背景变为 `--color-bg-surface`。**卡片宽度不做固定限制**，由外部容器（grid / flex / 自定义 width）决定，最小高度 74px 保障节奏一致。

下例用 `grid-template-columns: repeat(auto-fill, minmax(186px, 1fr))` 配合 `display: grid` 还原设计稿中的 186×74 网格。

```html preview
<script type="module">
  import '@ve-design/web/ve-prompt-item';
</script>

<section
  style="
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(186px, 1fr));
    gap: 12px;
    padding: 16px;
  "
>
  <ve-prompt-item
    type="card"
    title="会议纪要整理"
    description="纪要梳理明晰施策规划"
    style="display: flex;"
  ></ve-prompt-item>
  <ve-prompt-item
    type="card"
    title="周报生成"
    description="自动汇总本周进展与风险"
    style="display: flex;"
  ></ve-prompt-item>
  <ve-prompt-item
    type="card"
    title="灵感拾遗"
    description="把今天的碎片想法整理成文"
    style="display: flex;"
  ></ve-prompt-item>
</section>
```

### 文字行（type=line）

`type="line"` 渲染单行行条目，**宽度不做固定限制**，由外部容器决定铺满或紧凑展示；支持 `title` 与 `suffix` 插槽（可放箭头、提示词、删除按钮等）。

List Default 态用于展示无箭头行条目，示例通过 `arrow="false"` 对齐默认视觉；业务需要进入态时可省略 `arrow` 或通过 `suffix` 插槽接管行尾区域。默认情况下，`<ve-prompt-item>` 是 `inline-flex`，可通过外层 CSS 控制行内或块级铺满。

```html preview
<script type="module">
  import '@ve-design/web/ve-prompt-item';
</script>

<section style="display: grid; gap: 12px; padding: 16px;">
  <div style="color: var(--color-text-tertiary); font-size: 12px;">块级铺满（外层 stretch）</div>
  <div style="display: grid; gap: 8px; max-width: 588px;">
    <ve-prompt-item
      type="line"
      title="制作优质的课堂笔记，并制定学习目标"
      arrow="false"
      style="display: flex;"
    ></ve-prompt-item>
    <ve-prompt-item
      type="line"
      title="为新产品发布准备一份发布会讲稿"
      arrow="false"
      style="display: flex;"
    ></ve-prompt-item>
  </div>

  <div style="color: var(--color-text-tertiary); font-size: 12px;">行内紧凑（与文本同行）</div>
  <div style="display: flex; flex-wrap: wrap; gap: 8px;">
    <ve-prompt-item
      type="line"
      title="给中年家庭的马年新年寄语"
      arrow="false"
    ></ve-prompt-item>
    <ve-prompt-item
      type="line"
      title="夏日清凉饮品文案"
      arrow="false"
    ></ve-prompt-item>
  </div>
</section>
```

### 自定义行尾内容

`suffix` 插槽用于自定义行尾内容（默认为箭头）。设置 `arrow="false"` 隐藏默认箭头，把 CTA / 删除按钮等自定义元素塞进 `slot="suffix"`。

```html preview
<script type="module">
  import '@ve-design/web/ve-prompt-item';
  import '@ve-design/web/ve-tag';
</script>

<section style="display: grid; gap: 8px; max-width: 588px; padding: 16px;">
  <ve-prompt-item type="line" title="高频提示词" style="display: flex;">
    <ve-tag slot="suffix" color="blue" size="small">Top 1</ve-tag>
  </ve-prompt-item>
  <ve-prompt-item type="line" title="本周新加入的提示词" style="display: flex;">
    <span slot="suffix" style="color: var(--color-text-tertiary); font-size: 12px;">2 天前</span>
  </ve-prompt-item>
</section>
```

### 媒体卡片（type=media）

`type="media"` 渲染媒体卡，默认 250 × 166（3:2）。**hover 时遮罩会用 `description` 作为提示词、`title` 作为底部 CTA 按钮**，因此一个媒体卡只需要 `title` + `description` 两个文案属性即可，与 `card` / `line` 形态完全对齐。`force-hover` 可锁定遮罩展示便于截图。

尺寸与比例由 `width` / `height` 属性控制（数字按 px 处理，字符串按 CSS 长度原样使用）：默认 3:2，设为相同值即得 1:1，纵向值即得 3:4，无需手写 CSS 变量。下例第三张纵向媒体卡使用 `force-hover` 直接展示底部透明到半透明渐变、文字遮罩与模糊背景。若卡片需要标记来源（如音频/视频），可通过 `media` 插槽在图片左上角叠加一枚白色图标。

```html preview
<script type="module">
  import '@ve-design/web/ve-prompt-item';
  import '@ve-design/web/ve-icon';
  import '@ve-design/web/icons/voice';
</script>

<style>
  .prompt-item-media-wrap {
    position: relative;
    width: 100%;
    height: 100%;
  }

  .prompt-item-media-wrap img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .prompt-item-voice-icon {
    position: absolute;
    top: 12px;
    left: 12px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: #ffffff;
    font-size: 20px;
  }
</style>

<section style="display: flex; flex-wrap: wrap; gap: 16px; padding: 16px;">
  <!-- 默认 3:2 -->
  <ve-prompt-item
    type="media"
    image="https://images.unsplash.com/photo-1517511620798-cec17d428bc0?auto=format&fit=crop&w=600&q=80"
    alt="dreamy tech atmosphere"
    title="体验同款"
    description="营造出梦幻、科技感的氛围"
  ></ve-prompt-item>

  <!-- 1:1：width 与 height 设为同值，通过 media 插槽在左上角叠加白色 Voice 图标 -->
  <ve-prompt-item
    type="media"
    title="体验同款"
    description="营造出梦幻、科技感的氛围"
    width="188"
    height="188"
  >
    <div slot="media" class="prompt-item-media-wrap">
      <img
        src="https://images.unsplash.com/photo-1517511620798-cec17d428bc0?auto=format&fit=crop&w=600&q=80"
        alt="dreamy tech atmosphere"
      />
      <span class="prompt-item-voice-icon" aria-hidden="true">
        <ve-icon name="voice"></ve-icon>
      </span>
    </div>
  </ve-prompt-item>

  <!-- 3:4：纵向媒体卡，同样叠加 Voice 图标 -->
  <ve-prompt-item
    type="media"
    force-hover
    title="体验同款"
    description="营造出梦幻、科技感的氛围"
    width="180"
    height="240"
  >
    <div slot="media" class="prompt-item-media-wrap">
      <img
        src="https://images.unsplash.com/photo-1517511620798-cec17d428bc0?auto=format&fit=crop&w=600&q=80"
        alt="dreamy tech atmosphere"
      />
      <span class="prompt-item-voice-icon" aria-hidden="true">
        <ve-icon name="voice"></ve-icon>
      </span>
    </div>
  </ve-prompt-item>
</section>
```

### 响应式媒体卡

把 `width` 设为 `100%`、`height` 设为 `auto`，再用 host 的 `aspect-ratio` 锁定比例，即可实现网格中流式铺满的媒体卡。

```html preview
<script type="module">
  import '@ve-design/web/ve-prompt-item';
</script>

<style>
  .responsive-gallery {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 16px;
    padding: 16px;
  }

  .responsive-gallery ve-prompt-item {
    aspect-ratio: 3 / 2;
  }
</style>

<section class="responsive-gallery">
  <ve-prompt-item
    type="media"
    image="https://images.unsplash.com/photo-1517511620798-cec17d428bc0?auto=format&fit=crop&w=600&q=80"
    alt="atmosphere"
    title="体验同款"
    description="营造出梦幻、科技感的氛围"
    width="100%"
    height="auto"
  ></ve-prompt-item>
  <ve-prompt-item
    type="media"
    image="https://images.unsplash.com/photo-1517511620798-cec17d428bc0?auto=format&fit=crop&w=600&q=80"
    alt="atmosphere"
    title="体验同款"
    description="营造出梦幻、科技感的氛围"
    width="100%"
    height="auto"
  ></ve-prompt-item>
  <ve-prompt-item
    type="media"
    image="https://images.unsplash.com/photo-1517511620798-cec17d428bc0?auto=format&fit=crop&w=600&q=80"
    alt="atmosphere"
    title="体验同款"
    description="营造出梦幻、科技感的氛围"
    width="100%"
    height="auto"
  ></ve-prompt-item>
</section>
```

### 禁用状态

`disabled` 锁定交互、降低视觉权重，并阻止 `ve-prompt-item-click` 派发。

```html preview
<script type="module">
  import '@ve-design/web/ve-prompt-item';
</script>

<section style="display: flex; flex-wrap: wrap; gap: 12px; padding: 16px;">
  <ve-prompt-item
    type="card"
    title="会议纪要整理"
    description="暂未授权"
    disabled
  ></ve-prompt-item>
  <ve-prompt-item
    type="line"
    title="给中年家庭的马年新年寄语"
    disabled
  ></ve-prompt-item>
</section>
```

### 点击事件

点击或在键盘聚焦时按下 Enter 触发 `ve-prompt-item-click`，事件参数包含当前 `type`。

```html preview
<script type="module">
  import '@ve-design/web/ve-prompt-item';
</script>

<section style="display: grid; gap: 12px; max-width: 640px; padding: 16px;">
  <div style="display: flex; flex-wrap: wrap; gap: 12px;">
    <ve-prompt-item
      class="prompt-trigger"
      type="card"
      title="会议纪要整理"
      description="纪要梳理明晰施策规划"
    ></ve-prompt-item>
    <ve-prompt-item
      class="prompt-trigger"
      type="line"
      title="夏日清凉饮品文案"
    ></ve-prompt-item>
  </div>
  <code id="prompt-log" style="color: var(--color-text-secondary);">点击任意提示卡触发事件</code>
</section>

<script>
  document.querySelectorAll('.prompt-trigger').forEach((item) => {
    item.addEventListener('ve-prompt-item-click', (event) => {
      const target = event.currentTarget;
      const log = document.getElementById('prompt-log');
      log.textContent = `${target.title} → type=${event.detail.type}`;
    });
  });
</script>
```

## API

### ve-prompt-item 属性

| 属性名 | 描述 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `type` | 展示形态。`card` 文字卡片网格；`line` 弹性行条目；`media` 媒体卡片。 | `'card' &#124; 'line' &#124; 'media'` | `'card'` |
| `title` | 标题文字；`type="media"` 时映射为 hover 遮罩底部的 CTA 按钮文案。 | `string` | `''` |
| `description` | 描述文字。`type="card"` 时为副标题；`type="media"` 时映射为 hover 遮罩中的提示词。 | `string` | `''` |
| `image` | 媒体图片 URL（仅 `type="media"`）。 | `string` | `''` |
| `alt` | 媒体图片替代文本。 | `string` | `''` |
| `width` | 媒体卡宽度（仅 `type="media"`）。数字按 px，字符串按 CSS 长度（如 `100%`）。 | `string &#124; number` | — |
| `height` | 媒体卡高度（仅 `type="media"`）。数字按 px，字符串按 CSS 长度（如 `auto`）。 | `string &#124; number` | — |
| `arrow` | 是否显示尾部箭头；省略时由 `type` 派生（`card` / `line` 默认显示，`media` 默认隐藏）。设置 `false` 时由 `suffix` 插槽接管行尾。 | `boolean` | — |
| `force-hover` | 强制展示 hover 遮罩，便于文档与截图。 | `boolean` | `false` |
| `disabled` | 是否禁用，禁用时不派发 `ve-prompt-item-click`。 | `boolean` | `false` |

### ve-prompt-item 事件

| 事件名 | 描述 | 参数类型 |
| --- | --- | --- |
| `ve-prompt-item-click` | 点击或按下 Enter 时触发。 | `CustomEvent<{ type: 'card' \| 'line' \| 'media' }>` |

### ve-prompt-item 插槽

| 插槽名 | 描述 |
| --- | --- |
| 默认插槽 | 不消费默认插槽，全部内容通过具名插槽提供。 |
| `title` | 自定义标题内容（覆盖 `title` 属性），`type="media"` 时同步覆盖遮罩 CTA。 |
| `description` | 自定义描述内容（覆盖 `description` 属性），`type="media"` 时同步覆盖遮罩提示词。 |
| `media` | 自定义媒体内容（覆盖 `image`）。 |
| `mask` | 自定义 hover 遮罩内容（覆盖默认的 `description` + `title` 组合）。 |
| `prefix` | 标题前的内联前缀（仅 `type="card" \| "line"`）。 |
| `suffix` | 标题后的内联尾部内容（仅 `type="card" \| "line"`）；用于自定义箭头/CTA/标签等。 |
