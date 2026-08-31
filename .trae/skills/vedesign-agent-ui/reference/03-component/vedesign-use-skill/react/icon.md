`Icon` 用于在 React 中渲染 VeDesign 图标。React 推荐直接使用 `@ve-design/react/icons` 导出的具名图标组件；只有在需要动态图标名称或使用自定义注册图标时，再使用 `Icon` 的 `name` API。

## 何时使用

- 在按钮、菜单、提示、状态和空状态中展示轻量视觉符号。
- 希望在 React 中以组件形式直接使用内置图标，例如 `IconSearch`、`IconAdd`。
- 需要动态渲染某个图标名称，或渲染业务自定义注册图标。
- 需要统一控制图标尺寸、颜色和可访问名称。

## 引入组件

### 推荐引入具名图标

```tsx
import { IconSearch, IconSettings } from '@ve-design/react/icons';
```

```tsx
<IconSearch />
```

### 动态名称或自定义图标

```tsx
import { Icon } from '@ve-design/react';
import { registerIcon } from '@ve-design/react/icons';
```

React 版本已内置所需注册逻辑，按示例从 `@ve-design/react` 引入即可。

## 内置图标

下方展示当前包内置图标和内置 Logo。可以搜索图标名称，并复制 SVG 或 React 组件用法。

<IconGallery framework="react" />

## 示例

### 基础用法

推荐使用具名图标组件。它们已经内置图标名称，不需要传入 `name`。

```tsx preview
import { IconAdd, IconSearch, IconSettings } from '@ve-design/react/icons';

<section
  style={{
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    padding: 16,
  }}
>
  <IconSearch />
  <IconAdd />
  <IconSettings />
</section>;
```

### 动态图标名称

当图标名称来自配置、接口数据或用户选择时，使用 `Icon` 组件并传入 `name`。

```tsx preview
import { Icon } from '@ve-design/react';

const iconName = 'search';

<section
  style={{
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    padding: 16,
  }}
>
  <Icon name={iconName} />
  <Icon name="add" />
  <Icon name="settings" />
</section>;
```

### 图标尺寸

`size` 支持数字和 CSS 长度。数字会按 px 处理。

```tsx preview
import { IconSearch } from '@ve-design/react/icons';

<section
  style={{
    display: 'flex',
    alignItems: 'center',
    gap: 18,
    padding: 16,
  }}
>
  <IconSearch size={16} />
  <IconSearch size={24} />
  <IconSearch size={32} />
  <span style={{ fontSize: 28 }}>
    <IconSearch size="1em" />
  </span>
</section>;
```

### 图标颜色

内置单色图标使用 `currentColor`，会继承自身或父元素文字颜色。文件类型、状态等多色图标会保留 SVG 原始颜色。

```tsx preview
import {
  IconSearch,
  IconSuccess,
  IconTypePdfStateDefault,
  IconWarning,
} from '@ve-design/react/icons';

<section
  style={{
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    padding: 16,
  }}
>
  <IconSearch size={28} style={{ color: '#165dff' }} />
  <IconSuccess size={28} style={{ color: '#00b42a' }} />
  <span style={{ color: '#f53f3f' }}>
    <IconWarning size={28} />
  </span>
  <IconTypePdfStateDefault size={36} />
</section>;
```

### 可访问名称

图标默认按装饰性内容处理。图标本身承载语义时，使用 `label` 提供可访问名称；仅辅助按钮或文字说明时，不需要设置 `label`。

```tsx preview
import { Button } from '@ve-design/react';
import { IconAdd, IconSearch, IconSuccess } from '@ve-design/react/icons';

<section
  style={{
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: 16,
  }}
>
  <IconSuccess label="Completed" size={24} style={{ color: '#00b42a' }} />

  <Button type="primary">
    <IconAdd />
    Create
  </Button>

  <Button shape="circle" aria-label="Search">
    <IconSearch />
  </Button>
</section>;
```

### 和按钮组合

图标放在按钮中时会继承按钮文字颜色，适合用于操作入口、图标按钮和状态操作。

```tsx preview
import { Button } from '@ve-design/react';
import {
  IconAdd,
  IconRefresh,
  IconSettings,
} from '@ve-design/react/icons';

<section
  style={{
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: 16,
  }}
>
  <Button type="primary">
    <IconAdd />
    New task
  </Button>
  <Button type="outline">
    <IconRefresh />
    Refresh
  </Button>
  <Button shape="circle" aria-label="Settings">
    <IconSettings />
  </Button>
</section>;
```

### 自定义图标

业务图标通过完整 SVG 字符串注册。注册后，可以通过 `Icon` 的 `name` 渲染。

```tsx preview
import { Icon } from '@ve-design/react';
import { registerIcon } from '@ve-design/react/icons';

function IconRegisterDemo() {
  registerIcon({
    name: 'agent-status',
    svg: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 3L20 7.5V16.5L12 21L4 16.5V7.5L12 3Z" fill="currentColor"/><path d="M12 8V12L15 14" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  });

  return (
    <section
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: 16,
      }}
    >
      <Icon name="agent-status" size={28} style={{ color: '#00b42a' }} />
      <span>Agent ready</span>
    </section>
  );
}
```

从 SVG 文件导入时，推荐使用构建工具的 raw 导入能力：

```tsx
import { Icon } from '@ve-design/react';
import { registerIcon } from '@ve-design/react/icons';
import brandLogoSvg from './brand-logo.svg?raw';

registerIcon({
  name: 'brand-logo',
  svg: brandLogoSvg,
});

export function BrandLogo() {
  return <Icon name="brand-logo" />;
}
```

`registerIcon` 会从传入内容中提取第一个完整的 `<svg>...</svg>`。只传 `<path>` 不会被接受。由于 SVG 会作为标记插入组件内容中，注册时只应传入可信来源的 SVG。

### 批量注册自定义图标

需要维护业务图标集合时，可以使用 `registerIcons` 批量注册。

```tsx
import { registerIcons } from '@ve-design/react/icons';
import agentStatusSvg from './agent-status.svg?raw';
import brandLogoSvg from './brand-logo.svg?raw';

registerIcons([
  {
    name: 'brand-logo',
    svg: brandLogoSvg,
  },
  {
    name: 'agent-status',
    svg: agentStatusSvg,
  },
]);
```

## API

### 具名图标组件 Props

`@ve-design/react/icons` 导出的 `IconXxx` 组件已内置图标名称，Props 与 `Icon` 一致，但不需要传入 `name`。

| 属性名      | 描述                                               | 类型                  | 默认值 |
| ----------- | -------------------------------------------------- | --------------------- | ------ |
| `label`     | 图标本身有语义时的可访问名称；未设置时图标视为装饰 | `string`              | `''`   |
| `size`      | 图标尺寸。数字按 px 处理，也可传入 CSS 长度        | `number \| string`    | `''`   |
| `style`     | React 内联样式                                     | `React.CSSProperties` | `-`    |
| `className` | 自定义类名                                         | `string`              | `-`    |
| `ref`       | 图标元素引用                            | `React.Ref`           | `-`    |

### Icon Props

`Icon` 是动态图标名称和自定义注册图标的低阶入口。

| 属性名      | 描述                                               | 类型                  | 默认值 |
| ----------- | -------------------------------------------------- | --------------------- | ------ |
| `name`      | 图标名称。可以是内置图标名称，也可以是已注册图标名称 | `string`              | `''`   |
| `label`     | 图标本身有语义时的可访问名称；未设置时图标视为装饰 | `string`              | `''`   |
| `size`      | 图标尺寸。数字按 px 处理，也可传入 CSS 长度        | `number \| string`    | `''`   |
| `style`     | React 内联样式                                     | `React.CSSProperties` | `-`    |
| `className` | 自定义类名                                         | `string`              | `-`    |
| `ref`       | 图标元素引用                            | `React.Ref`           | `-`    |

### 图标工具

以下工具从 `@ve-design/react/icons` 导入。React 用户不需要从 `@ve-design/web` 导入图标工具。

| 名称                     | 描述                           | 类型                                                                        |
| ------------------------ | ------------------------------ | --------------------------------------------------------------------------- |
| `getBuiltInIconNames`    | 获取全部内置图标名称列表       | `() => readonly IconName[]`                                                  |
| `registerIcon`           | 注册单个自定义图标             | `(icon: IconDefinition, options?: RegisterIconOptions) => IconDefinition`    |
| `registerIcons`          | 批量注册自定义图标             | `(icons: readonly IconDefinition[], options?: RegisterIconOptions) => void`  |
| `unregisterIcon`         | 注销指定图标                   | `(name: string) => boolean`                                                  |
| `hasIcon`                | 判断图标是否已注册             | `(name: string) => boolean`                                                  |
| `getRegisteredIconNames` | 获取当前已经注册的图标名称     | `() => string[]`                                                             |
| `loadIcon`               | 按名称加载并注册一个内置图标   | `(name: IconName) => Promise<void>`                                          |
| `loadIcons`              | 批量加载并注册内置图标         | `(names: readonly IconName[]) => Promise<void>`                              |
| `loadAllIcons`           | 加载并注册全部内置图标         | `() => Promise<void>`                                                        |
| `isBuiltInIconName`      | 判断字符串是否为内置图标名称   | `(name: string) => name is IconName`                                         |

### 事件

`Icon` 不定义专有事件。需要交互时，通常将图标放入 `Button`、链接或其他可交互组件中。

### Ref

可通过 `ref` 访问图标元素实例。
