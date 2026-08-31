`Spin` 用于展示内容加载、接口请求、页面初始化或局部刷新中的轻量反馈。组件始终表达加载中状态，默认展示内置加载图标，也支持设置提示文案或通过 `icon` 替换 loading 图标。

## 何时使用

- 页面、卡片、列表或表格正在初始化、刷新或等待接口返回。
- AI Agent 正在同步上下文、生成草稿、执行工具调用或重建结果。
- 需要通过横向或纵向排布适配紧凑工具栏、空白容器、卡片中心态等不同空间。
- 需要在保持统一排版和文本样式的同时替换加载图标。

## 引入组件

```tsx
import { Spin } from '@ve-design/react';
```

## 示例

### 基础用法

默认展示内置加载图标和 `default` 尺寸。使用 `tip` 设置提示文案。

```tsx preview
import { Spin } from '@ve-design/react';

<section
  style={{
    display: 'flex',
    flexWrap: 'wrap',
    gap: 28,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  }}
>
  <Spin />
  <Spin tip="加载中" />
  <Spin tip="Syncing workspace" />
</section>;
```

### 尺寸和排布

使用 `size` 设置加载图标和文案尺寸，使用 `direction` 设置图标与文案的排列方向。

```tsx preview
import { Spin } from '@ve-design/react';

<section
  style={{
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 120px)',
    gap: '28px 24px',
    justifyContent: 'center',
    justifyItems: 'center',
    alignItems: 'center',
    padding: 32,
  }}
>
  <Spin size="small" tip="加载中" />
  <Spin size="default" tip="加载中" />
  <Spin size="large" tip="加载中" />

  <Spin size="small" direction="vertical" tip="加载中" />
  <Spin size="default" direction="vertical" tip="加载中" />
  <Spin size="large" direction="vertical" tip="加载中" />
</section>;
```

### 自定义 loading 图标

通过 `icon` 传入自定义 loading 图标。自定义图标默认跟随组件自动旋转；如果图标自身已经带有动画，或业务侧需要静态图标，可以设置 `autoRotate={false}` 关闭组件提供的旋转动画。

```tsx preview
import { Spin } from '@ve-design/react';
import { IconLoadingProgress } from '@ve-design/react/icons';

function SpinCustomIconDemo() {
  return (
    <>
      <style>{`
        @keyframes spin-doc-pulse {
          from {
            opacity: 0.45;
            transform: translateX(0);
          }

          to {
            opacity: 1;
            transform: translateX(2px);
          }
        }
      `}</style>
      <section
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 32,
          justifyContent: 'center',
          alignItems: 'center',
          padding: 32,
        }}
      >
        <Spin
          size="large"
          direction="vertical"
          tip="任务加载中，请稍后..."
          icon={<IconLoadingProgress aria-hidden="true" />}
        />
        <Spin
          autoRotate={false}
          size="large"
          direction="vertical"
          tip="Analyzing traces"
          icon={
            <span
              aria-hidden="true"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
              }}
            >
              <span
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 999,
                  background: 'var(--color-text-primary)',
                }}
              />
              <span
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 999,
                  background: 'var(--color-text-tertiary)',
                  animation: 'spin-doc-pulse 0.9s ease-in-out infinite alternate',
                }}
              />
              <span
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 999,
                  background: 'var(--color-text-disable)',
                }}
              />
            </span>
          }
        />
      </section>
    </>
  );
}
```

## API

### Props

| 属性名       | 描述                             | 类型                              | 默认值         |
| ------------ | -------------------------------- | --------------------------------- | -------------- |
| `size`       | 加载尺寸                         | `'small' \| 'default' \| 'large'` | `'default'`    |
| `direction`  | 图标和提示文案的排列方向         | `'horizontal' \| 'vertical'`      | `'horizontal'` |
| `autoRotate` | 是否自动旋转 loading 图标        | `boolean`                         | `true`         |
| `tip`        | 提示文案；为空字符串时仅展示图标 | `string`                          | `''`           |
| `icon`       | 自定义 loading 图标              | `React.ReactNode`                 | `-`            |

### 事件

`Spin` 暂无自定义事件。

### Ref

可通过 `ref` 获取组件对应的元素引用。
