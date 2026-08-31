`Switch` 用于在两种互斥状态之间即时切换，支持受控状态、默认状态、禁用状态和三种尺寸。

## 何时使用

- 用于启用或关闭单个设置项。
- 切换后立即生效，不需要额外提交。
- 需要在表单、列表或设置面板中展示清晰的布尔状态。

## 引入组件

```tsx
import { Switch } from '@ve-design/react';
```

## 示例

### 基础用法

使用 `checked` 设置当前开启状态。

```tsx preview
import { Switch } from '@ve-design/react';

<section style={{ display: 'grid', placeItems: 'center', padding: 24 }}>
  <div style={{ display: 'grid', gap: 14, width: 'min(100%, 320px)' }}>
    <label
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 24,
      }}
    >
      <span>Knowledge retrieval</span>
      <Switch checked aria-label="Knowledge retrieval" />
    </label>
    <label
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 24,
      }}
    >
      <span>Browser actions</span>
      <Switch aria-label="Browser actions" />
    </label>
  </div>
</section>;
```

### 默认开启

使用 `defaultChecked` 设置非受控模式下的初始状态。

```tsx preview
import { Switch } from '@ve-design/react';

<section style={{ display: 'grid', placeItems: 'center', padding: 24 }}>
  <Switch defaultChecked aria-label="Conversation memory" />
</section>;
```

### 尺寸

使用 `size` 设置开关尺寸。

```tsx preview
import { Switch } from '@ve-design/react';

<section style={{ display: 'grid', placeItems: 'center', padding: 24 }}>
  <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
    <Switch size="small" aria-label="Small switch" />
    <Switch size="default" checked aria-label="Default switch" />
    <Switch size="large" checked aria-label="Large switch" />
  </div>
</section>;
```

### 禁用状态

使用 `disabled` 禁用开关交互。

```tsx preview
import { Switch } from '@ve-design/react';

<section style={{ display: 'grid', placeItems: 'center', padding: 24 }}>
  <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
    <Switch disabled aria-label="Disabled off" />
    <Switch disabled checked aria-label="Disabled on" />
  </div>
</section>;
```

### 监听变化

用户切换状态时触发 `onChange`，事件参数为 `CustomEvent`。

```tsx preview
import { useState } from 'react';
import { Switch } from '@ve-design/react';

function SwitchEventDemo() {
  const [checked, setChecked] = useState(false);

  return (
    <section
      style={{ display: 'grid', justifyItems: 'center', gap: 12, padding: 24 }}
    >
      <Switch
        checked={checked}
        aria-label="Live telemetry"
        onChange={(event) => {
          setChecked(event.detail.checked);
        }}
      />
      <code style={{ color: 'var(--color-text-secondary)' }}>checked: {String(checked)}</code>
    </section>
  );
}
```

## API

### Props

| 属性名           | 描述                         | 类型                              | 默认值      |
| ---------------- | ---------------------------- | --------------------------------- | ----------- |
| `checked`        | 当前是否开启。               | `boolean`                         | `undefined` |
| `defaultChecked` | 非受控模式下的初始开启状态。 | `boolean`                         | `false`     |
| `disabled`       | 是否禁用。                   | `boolean`                         | `false`     |
| `size`           | 开关尺寸。                   | `'small' \| 'default' \| 'large'` | `'default'` |

### 事件

| 事件名     | 描述                 | 参数类型                            |
| ---------- | -------------------- | ----------------------------------- |
| `onChange` | 用户切换状态时触发。 | `CustomEvent<{ checked: boolean }>` |

### Ref

可通过 `ref` 访问 Switch 实例；需要主动触发切换时可调用实例的 `click()`。
