`Badge` 用于在目标元素旁展示数量提醒、点状提示或短文本状态；不包裹内容时可作为独立徽标使用。

## 何时使用

- 在入口、按钮、头像等元素上标记未读、待处理或新增状态。
- 需要展示 `New`、`Beta`、`Hot` 等短文本状态。
- 只需要提示有更新时，使用点状徽标弱化信息量。

## 引入组件

```tsx
import { Badge } from '@ve-design/react';
```

## 示例

### 基础用法

使用 `text` 展示数字或短文本，徽标会贴附在默认插槽内容的右上角。

```tsx preview
import { Avatar, Badge, Button } from '@ve-design/react';
import { IconBell, IconMessage } from '@ve-design/react/icons';

<section
  style={{
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 28,
    padding: 32,
  }}
>
  <Badge text="8">
    <Button type="secondary">任务收件箱</Button>
  </Badge>

  <Badge text="12">
    <Button type="outline">失败评估</Button>
  </Badge>

  <Badge text="New">
    <Button type="text">审核请求</Button>
  </Badge>

  <Badge text="3">
    <Button type="secondary" shape="circle" aria-label="消息中心">
      <IconMessage aria-hidden="true" />
    </Button>
  </Badge>

  <Badge text="1">
    <Avatar aria-label="Agent">
      <img
        src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&fit=crop&crop=faces"
        alt="Maya Chen"
      />
    </Avatar>
  </Badge>

  <Badge text="12">
    <Button type="primary" shape="circle" aria-label="通知中心">
      <IconBell aria-hidden="true" />
    </Button>
  </Badge>
</section>;
```

### 点状徽标

指定 `dot` 时展示为状态点，适合表达“有新内容”而不展示具体数量。

```tsx preview
import { Avatar, Badge, Button } from '@ve-design/react';
import { IconMessage } from '@ve-design/react/icons';

<section
  style={{
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 28,
    padding: 32,
  }}
>
  <Badge dot>
    <Button type="secondary">消息更新</Button>
  </Badge>

  <Badge dot color="#00b42a">
    <Avatar aria-label="在线成员">
      <img
        src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&fit=crop&crop=faces"
        alt="Maya Chen"
      />
    </Avatar>
  </Badge>

  <Badge dot color="blue">
    <Button type="outline" shape="circle" aria-label="模型更新">
      <IconMessage aria-hidden="true" />
    </Button>
  </Badge>

  <Badge dot color="#722ed1" />
</section>;
```

### 独立展示

不传入 `children` 时，组件直接展示为独立徽标；只有指定 `dot` 时才展示为点状徽标。

```tsx preview
import { Badge } from '@ve-design/react';

<section
  style={{
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    padding: 32,
  }}
>
  <Badge text="Beta" />
  <Badge text="New" color="blue" />
  <Badge text="Hot" color="#f53f3f" />
  <Badge text="Stable" color="light" />
  <Badge dot color="ash" />
</section>;
```

### 自定义颜色

`color` 支持 `dark`、`ash`、`blue`、`light` 预设，也支持任意 CSS 色值。

```tsx preview
import { Badge, Button } from '@ve-design/react';

<section
  style={{
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 28,
    padding: 32,
  }}
>
  <Badge text="8" color="dark">
    <Button type="secondary">默认入口</Button>
  </Badge>

  <Badge text="12" color="light">
    <Button type="outline">轻量入口</Button>
  </Badge>

  <Badge text="3" color="#722ed1">
    <Button type="secondary">自定义颜色</Button>
  </Badge>

  <Badge text="Custom" color="#0e42d2" />
</section>;
```

### 位置微调

`offset` 使用 `[x, y]` 调整贴附位置，在默认定位基础上叠加偏移。

```tsx preview
import { Avatar, Badge, Button } from '@ve-design/react';
import { IconBell } from '@ve-design/react/icons';

<section
  style={{
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 32,
    padding: 32,
  }}
>
  <Badge text="12" offset={[-78, -2]}>
    <Button type="outline">评估任务</Button>
  </Badge>

  <Badge text="3" offset={[0, 24]}>
    <Avatar aria-label="队列负责人">
      <img
        src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&fit=crop&crop=faces"
        alt="Maya Chen"
      />
    </Avatar>
  </Badge>

  <Badge dot offset={[-12, -4]}>
    <Button type="secondary" shape="circle" aria-label="通知中心">
      <IconBell aria-hidden="true" />
    </Button>
  </Badge>
</section>;
```

## API

### Props

| 属性名     | 描述                                                            | 类型                                                                    | 默认值   |
| ---------- | --------------------------------------------------------------- | ----------------------------------------------------------------------- | -------- |
| `text`     | 徽标中展示的短文本                                              | `string`                                                                | `''`     |
| `dot`      | 是否显示为点状徽标                                              | `boolean`                                                               | `false`  |
| `color`    | 徽标颜色，支持预设值和任意 CSS 色值                             | `string`                                                                | `''`     |
| `offset`   | 贴附模式下的偏移量，单位为 CSS 像素                             | `[number, number]`                                                      | `[0, 0]` |
| `children` | 被徽标包裹的目标内容；为空时组件展示为独立徽标                  | `React.ReactNode`                                                       | `-`      |

### 事件

暂无专有事件。
