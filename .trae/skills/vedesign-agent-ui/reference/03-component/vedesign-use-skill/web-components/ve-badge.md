`ve-badge` 用于在目标元素旁展示数量提醒、点状提示或短文本状态；不包裹内容时可作为独立徽标使用。

## 何时使用

- 在入口、按钮、头像等元素上标记未读、待处理或新增状态。
- 需要展示 `New`、`Beta`、`Hot` 等短文本状态。
- 只需要提示有更新时，使用点状徽标弱化信息量。

## 引入组件

```ts
import '@ve-design/web/ve-badge';
```

## 示例

### 基础用法

使用 `text` 展示数字或短文本，徽标会贴附在默认插槽内容的右上角。

```html preview
<script type="module">
  import '@ve-design/web/ve-badge';
  import '@ve-design/web/ve-avatar';
  import '@ve-design/web/ve-button';
  import '@ve-design/web/icons/bell';
  import '@ve-design/web/icons/message';
</script>

<section
  style="display: flex; flex-wrap: wrap; justify-content: center; align-items: center; gap: 28px; padding: 32px;"
>
  <ve-badge text="8">
    <ve-button type="secondary">任务收件箱</ve-button>
  </ve-badge>

  <ve-badge text="12">
    <ve-button type="outline">失败评估</ve-button>
  </ve-badge>

  <ve-badge text="New">
    <ve-button type="text">审核请求</ve-button>
  </ve-badge>

  <ve-badge text="3">
    <ve-button type="secondary" shape="circle" aria-label="消息中心">
      <ve-icon name="message" aria-hidden="true"></ve-icon>
    </ve-button>
  </ve-badge>

  <ve-badge text="1">
    <ve-avatar aria-label="Agent">
      <img
        src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&fit=crop&crop=faces"
        alt="Maya Chen"
      />
    </ve-avatar>
  </ve-badge>

  <ve-badge text="12">
    <ve-button type="primary" shape="circle" aria-label="通知中心">
      <ve-icon name="bell" aria-hidden="true"></ve-icon>
    </ve-button>
  </ve-badge>
</section>
```

### 点状徽标

指定 `dot` 时展示为状态点，适合表达“有新内容”而不展示具体数量。

```html preview
<script type="module">
  import '@ve-design/web/ve-badge';
  import '@ve-design/web/ve-avatar';
  import '@ve-design/web/ve-button';
  import '@ve-design/web/icons/message';
</script>

<section
  style="display: flex; flex-wrap: wrap; justify-content: center; align-items: center; gap: 28px; padding: 32px;"
>
  <ve-badge dot>
    <ve-button type="secondary">消息更新</ve-button>
  </ve-badge>

  <ve-badge dot color="#00b42a">
    <ve-avatar aria-label="在线成员">
      <img
        src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&fit=crop&crop=faces"
        alt="Maya Chen"
      />
    </ve-avatar>
  </ve-badge>

  <ve-badge dot color="blue">
    <ve-button type="outline" shape="circle" aria-label="模型更新">
      <ve-icon name="message" aria-hidden="true"></ve-icon>
    </ve-button>
  </ve-badge>

  <ve-badge dot color="#722ed1"></ve-badge>
</section>
```

### 独立展示

不传入默认插槽时，组件直接展示为独立徽标；只有指定 `dot` 时才展示为点状徽标。

```html preview
<script type="module">
  import '@ve-design/web/ve-badge';
</script>

<section
  style="display: flex; flex-wrap: wrap; justify-content: center; align-items: center; gap: 12px; padding: 32px;"
>
  <ve-badge text="Beta"></ve-badge>
  <ve-badge text="New" color="blue"></ve-badge>
  <ve-badge text="Hot" color="#f53f3f"></ve-badge>
  <ve-badge text="Stable" color="light"></ve-badge>
  <ve-badge dot color="ash"></ve-badge>
</section>
```

### 自定义颜色

`color` 支持 `dark`、`ash`、`blue`、`light` 预设，也支持任意 CSS 色值。

```html preview
<script type="module">
  import '@ve-design/web/ve-badge';
  import '@ve-design/web/ve-button';
</script>

<section
  style="display: flex; flex-wrap: wrap; justify-content: center; align-items: center; gap: 28px; padding: 32px;"
>
  <ve-badge text="8" color="dark">
    <ve-button type="secondary">默认入口</ve-button>
  </ve-badge>

  <ve-badge text="12" color="light">
    <ve-button type="outline">轻量入口</ve-button>
  </ve-badge>

  <ve-badge text="3" color="#722ed1">
    <ve-button type="secondary">自定义颜色</ve-button>
  </ve-badge>

  <ve-badge text="Custom" color="#0e42d2"></ve-badge>
</section>
```

### 位置微调

`offset` 使用 `"x,y"` 调整贴附位置，在默认定位基础上叠加偏移。

```html preview
<script type="module">
  import '@ve-design/web/ve-badge';
  import '@ve-design/web/ve-avatar';
  import '@ve-design/web/ve-button';
  import '@ve-design/web/icons/bell';
</script>

<section
  style="display: flex; flex-wrap: wrap; justify-content: center; align-items: center; gap: 32px; padding: 32px;"
>
  <ve-badge text="12" offset="-78,-2">
    <ve-button type="outline">评估任务</ve-button>
  </ve-badge>

  <ve-badge text="3" offset="0,24">
    <ve-avatar aria-label="队列负责人">
      <img
        src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&fit=crop&crop=faces"
        alt="Maya Chen"
      />
    </ve-avatar>
  </ve-badge>

  <ve-badge dot offset="-12,-4">
    <ve-button type="secondary" shape="circle" aria-label="通知中心">
      <ve-icon name="bell" aria-hidden="true"></ve-icon>
    </ve-button>
  </ve-badge>
</section>
```

## API

### ve-badge 属性

| 属性名   | 描述                                                      | 类型               | 默认值   |
| -------- | --------------------------------------------------------- | ------------------ | -------- |
| `text`   | 徽标中展示的短文本。                                      | `string`           | `''`     |
| `dot`    | 是否显示为点状徽标。                                      | `boolean`          | `false`  |
| `color`  | 徽标颜色，支持预设值和任意 CSS 色值。                     | `string`           | `''`     |
| `offset` | 贴附模式下的偏移量，属性写法为 `"x,y"`，单位为 CSS 像素。 | `[number, number]` | `[0, 0]` |

### ve-badge 插槽

| 插槽名   | 描述                                             |
| -------- | ------------------------------------------------ |
| 默认插槽 | 被徽标包裹的目标内容；为空时组件展示为独立徽标。 |
