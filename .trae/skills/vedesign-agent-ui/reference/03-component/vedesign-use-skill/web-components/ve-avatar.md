`ve-avatar` 用于展示用户、成员、Agent 或资源的头像。组件默认尺寸为 `32px`，支持通过默认插槽放入文本、图片或图标；`ve-avatar-group` 用于重叠展示一组头像，并折叠超出数量。

## 何时使用

- 在用户列表、成员栏、消息头部或审批流中展示身份信息。
- 需要用文本、图片或图标作为头像内容。
- 需要展示多名协作者，并在空间有限时折叠超出成员数量。

## 引入组件

```ts
import '@ve-design/web/ve-avatar';
```

使用内置用户图标时，按需引入图标入口：

```ts
import '@ve-design/web/icons/user-02';
```

## 示例

### 基础用法

默认尺寸为 `32px`。默认插槽可以放入单字文本、图片或图标。

```html preview
<script type="module">
  import '@ve-design/web/ve-avatar';
  import '@ve-design/web/icons/user-02';
</script>

<section style="display: flex; justify-content: center; align-items: center; flex-wrap: wrap; gap: 16px; padding: 24px;">
  <ve-avatar aria-label="Maya">M</ve-avatar>
  <ve-avatar aria-label="Ling">林</ve-avatar>
  <ve-avatar aria-label="Photo avatar">
    <img
      src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&fit=crop&crop=faces"
      alt="Maya Chen"
    />
  </ve-avatar>
  <ve-avatar aria-label="Default user">
    <ve-icon name="user-02" aria-hidden="true"></ve-icon>
  </ve-avatar>
</section>
```

### 图片头像

图片会填满头像区域，并按头像尺寸裁切。

```html preview
<script type="module">
  import '@ve-design/web/ve-avatar';
</script>

<section style="display: flex; justify-content: center; align-items: center; flex-wrap: wrap; gap: 16px; padding: 24px;">
  <ve-avatar size="40" aria-label="Olivia">
    <img
      src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&h=120&fit=crop&crop=faces"
      alt="Olivia"
    />
  </ve-avatar>
  <ve-avatar size="40" aria-label="Ethan">
    <img
      src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop&crop=faces"
      alt="Ethan"
    />
  </ve-avatar>
  <ve-avatar size="40" aria-label="Sophia">
    <img
      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&crop=faces"
      alt="Sophia"
    />
  </ve-avatar>
</section>
```

### 不同尺寸

`size` 设置头像尺寸。纯数字会按 CSS 像素处理，也可以传入 CSS 长度。

```html preview
<script type="module">
  import '@ve-design/web/ve-avatar';
</script>

<section style="display: flex; justify-content: center; align-items: flex-end; flex-wrap: wrap; gap: 20px; padding: 24px;">
  <span style="display: inline-grid; justify-items: center; gap: 8px; color: var(--color-text-secondary); font: 400 12px/18px var(--font-cn);">
    <ve-avatar size="24">24</ve-avatar>
    <span>24px</span>
  </span>
  <span style="display: inline-grid; justify-items: center; gap: 8px; color: var(--color-text-secondary); font: 400 12px/18px var(--font-cn);">
    <ve-avatar>32</ve-avatar>
    <span>32px</span>
  </span>
  <span style="display: inline-grid; justify-items: center; gap: 8px; color: var(--color-text-secondary); font: 400 12px/18px var(--font-cn);">
    <ve-avatar size="40">40</ve-avatar>
    <span>40px</span>
  </span>
  <span style="display: inline-grid; justify-items: center; gap: 8px; color: var(--color-text-secondary); font: 400 12px/18px var(--font-cn);">
    <ve-avatar size="48">48</ve-avatar>
    <span>48px</span>
  </span>
</section>
```

### 头像组

`ve-avatar-group` 会重叠排列组内头像。设置 `max-count` 后，超出的头像会折叠为 `+x`。

```html preview
<script type="module">
  import '@ve-design/web/ve-avatar';
</script>

<section style="display: flex; justify-content: center; align-items: center; padding: 24px;">
  <ve-avatar-group max-count="4">
    <ve-avatar>M</ve-avatar>
    <ve-avatar>L</ve-avatar>
    <ve-avatar>W</ve-avatar>
    <ve-avatar>Y</ve-avatar>
    <ve-avatar>Q</ve-avatar>
    <ve-avatar>S</ve-avatar>
  </ve-avatar-group>
</section>
```

### 头像组尺寸

`ve-avatar-group` 的 `size` 会作为组内头像的默认尺寸。子头像单独设置 `size` 时，会使用子头像自己的尺寸。

```html preview
<script type="module">
  import '@ve-design/web/ve-avatar';
</script>

<section style="display: grid; justify-items: center; gap: 20px; padding: 24px;">
  <ve-avatar-group size="24" max-count="4">
    <ve-avatar>A</ve-avatar>
    <ve-avatar>B</ve-avatar>
    <ve-avatar>C</ve-avatar>
    <ve-avatar>D</ve-avatar>
    <ve-avatar>E</ve-avatar>
  </ve-avatar-group>

  <ve-avatar-group max-count="4">
    <ve-avatar>A</ve-avatar>
    <ve-avatar>B</ve-avatar>
    <ve-avatar>C</ve-avatar>
    <ve-avatar>D</ve-avatar>
    <ve-avatar>E</ve-avatar>
  </ve-avatar-group>

  <ve-avatar-group max-count="4" size="48">
    <ve-avatar>A</ve-avatar>
    <ve-avatar>B</ve-avatar>
    <ve-avatar>C</ve-avatar>
    <ve-avatar>D</ve-avatar>
    <ve-avatar>E</ve-avatar>
  </ve-avatar-group>
</section>
```

## API

### ve-avatar 属性

| 属性名 | 描述 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `size` | 头像尺寸，纯数字按 CSS 像素处理，也可传入 CSS 长度。 | `string \| number` | `'32'` |

### ve-avatar 插槽

| 插槽名 | 描述 |
| --- | --- |
| 默认插槽 | 头像内容，可放置文本、图片、图标或其他内联内容。 |

### ve-avatar-group 属性

| 属性名 | 描述 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `size` | 组内头像的默认尺寸，未单独设置的子头像会继承该值。 | `string \| number` | `'32'` |
| `max-count` | 最大可见头像数量，超出部分显示为 `+x`；为 `0` 时展示全部头像。 | `number` | `0` |

### ve-avatar-group 插槽

| 插槽名 | 描述 |
| --- | --- |
| 默认插槽 | 头像组内容，通常放置多个 `ve-avatar`。 |
