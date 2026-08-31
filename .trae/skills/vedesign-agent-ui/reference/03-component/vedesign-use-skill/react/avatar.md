`Avatar` 用于展示用户、成员、Agent 或资源的头像。默认尺寸为 `32px`，可通过 `children` 放入文本、图片或图标；`AvatarGroup` 用于重叠展示一组头像，并折叠超出数量。

## 何时使用

- 在用户列表、成员栏、消息头部或审批流中展示身份信息。
- 需要用文本、图片或图标作为头像内容。
- 需要展示多名协作者，并在空间有限时折叠超出成员数量。

## 引入组件

```tsx
import { Avatar, AvatarGroup } from '@ve-design/react';
```

## 示例

### 基础用法

默认尺寸为 `32px`。默认插槽可以放入单字文本、图片或图标。

```tsx preview
import { Avatar } from '@ve-design/react';
import { IconUser02 } from '@ve-design/react/icons';

<section
  style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 16,
    padding: 24,
  }}
>
  <Avatar aria-label="Maya">M</Avatar>
  <Avatar aria-label="Ling">林</Avatar>
  <Avatar aria-label="Photo avatar">
    <img
      src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&fit=crop&crop=faces"
      alt="Maya Chen"
    />
  </Avatar>
  <Avatar aria-label="Default user">
    <IconUser02 aria-hidden="true" />
  </Avatar>
</section>;
```

### 图片头像

图片会填满头像区域，并按头像尺寸裁切。

```tsx preview
import { Avatar } from '@ve-design/react';

<section
  style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 16,
    padding: 24,
  }}
>
  <Avatar size="40" aria-label="Olivia">
    <img
      src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&h=120&fit=crop&crop=faces"
      alt="Olivia"
    />
  </Avatar>
  <Avatar size="40" aria-label="Ethan">
    <img
      src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop&crop=faces"
      alt="Ethan"
    />
  </Avatar>
  <Avatar size="40" aria-label="Sophia">
    <img
      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&crop=faces"
      alt="Sophia"
    />
  </Avatar>
</section>;
```

### 不同尺寸

`size` 设置头像尺寸。纯数字会按 CSS 像素处理，也可以传入 CSS 长度。

```tsx preview
import { Avatar } from '@ve-design/react';

<section
  style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-end',
    flexWrap: 'wrap',
    gap: 20,
    padding: 24,
  }}
>
  <span
    style={{
      display: 'inline-grid',
      justifyItems: 'center',
      gap: 8,
      color: 'var(--color-text-secondary)',
      font: '400 12px/18px var(--font-cn)',
    }}
  >
    <Avatar size="24">24</Avatar>
    <span>24px</span>
  </span>
  <span
    style={{
      display: 'inline-grid',
      justifyItems: 'center',
      gap: 8,
      color: 'var(--color-text-secondary)',
      font: '400 12px/18px var(--font-cn)',
    }}
  >
    <Avatar>32</Avatar>
    <span>32px</span>
  </span>
  <span
    style={{
      display: 'inline-grid',
      justifyItems: 'center',
      gap: 8,
      color: 'var(--color-text-secondary)',
      font: '400 12px/18px var(--font-cn)',
    }}
  >
    <Avatar size="40">40</Avatar>
    <span>40px</span>
  </span>
  <span
    style={{
      display: 'inline-grid',
      justifyItems: 'center',
      gap: 8,
      color: 'var(--color-text-secondary)',
      font: '400 12px/18px var(--font-cn)',
    }}
  >
    <Avatar size="48">48</Avatar>
    <span>48px</span>
  </span>
</section>;
```

### 头像组

`AvatarGroup` 会重叠排列组内头像。设置 `maxCount` 后，超出的头像会折叠为 `+x`。

```tsx preview
import { Avatar, AvatarGroup } from '@ve-design/react';

<section
  style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  }}
>
  <AvatarGroup maxCount={4}>
    <Avatar>M</Avatar>
    <Avatar>L</Avatar>
    <Avatar>W</Avatar>
    <Avatar>Y</Avatar>
    <Avatar>Q</Avatar>
    <Avatar>S</Avatar>
  </AvatarGroup>
</section>;
```

### 头像组尺寸

`AvatarGroup` 的 `size` 会作为组内头像的默认尺寸。子头像单独设置 `size` 时，会使用子头像自己的尺寸。

```tsx preview
import { Avatar, AvatarGroup } from '@ve-design/react';

<section
  style={{ display: 'grid', justifyItems: 'center', gap: 20, padding: 24 }}
>
  <AvatarGroup size="24" maxCount={4}>
    <Avatar>A</Avatar>
    <Avatar>B</Avatar>
    <Avatar>C</Avatar>
    <Avatar>D</Avatar>
    <Avatar>E</Avatar>
  </AvatarGroup>

  <AvatarGroup maxCount={4}>
    <Avatar>A</Avatar>
    <Avatar>B</Avatar>
    <Avatar>C</Avatar>
    <Avatar>D</Avatar>
    <Avatar>E</Avatar>
  </AvatarGroup>

  <AvatarGroup size="48" maxCount={4}>
    <Avatar>A</Avatar>
    <Avatar>B</Avatar>
    <Avatar>C</Avatar>
    <Avatar>D</Avatar>
    <Avatar>E</Avatar>
  </AvatarGroup>
</section>;
```

## API

### Avatar Props

| 属性名     | 描述                                                 | 类型               | 默认值 |
| ---------- | ---------------------------------------------------- | ------------------ | ------ |
| `size`     | 头像尺寸，纯数字按 CSS 像素处理，也可传入 CSS 长度。 | `string \| number` | `'32'` |
| `children` | 头像内容，可放置文本、图片、图标或其他内联内容。     | `React.ReactNode`  | `-`    |

### Avatar 事件

暂无组件专属事件。

### AvatarGroup Props

| 属性名     | 描述                                                           | 类型               | 默认值 |
| ---------- | -------------------------------------------------------------- | ------------------ | ------ |
| `size`     | 组内头像的默认尺寸，未单独设置的子头像会继承该值。             | `string \| number` | `'32'` |
| `maxCount` | 最大可见头像数量，超出部分显示为 `+x`；为 `0` 时展示全部头像。 | `number`           | `0`    |
| `children` | 头像组内容，通常放置多个 `Avatar`。                            | `React.ReactNode`  | `-`    |

### AvatarGroup 事件

暂无组件专属事件。
