`ve-switch` 用于在两种互斥状态之间即时切换，支持受控状态、默认状态、禁用状态和三种尺寸。

## 何时使用

- 用于启用或关闭单个设置项。
- 切换后立即生效，不需要额外提交。
- 需要在表单、列表或设置面板中展示清晰的布尔状态。

## 引入组件

```ts
import '@ve-design/web/ve-switch';
```

## 示例

### 基础用法

使用 `checked` 设置当前开启状态。

```html preview
<script type="module">
  import '@ve-design/web/ve-switch';
</script>

<section style="display:grid; place-items:center; padding:24px;">
  <div style="display:grid; gap:14px; width:min(100%, 320px);">
    <label style="display:flex; align-items:center; justify-content:space-between; gap:24px;">
      <span>Knowledge retrieval</span>
      <ve-switch checked aria-label="Knowledge retrieval"></ve-switch>
    </label>
    <label style="display:flex; align-items:center; justify-content:space-between; gap:24px;">
      <span>Browser actions</span>
      <ve-switch aria-label="Browser actions"></ve-switch>
    </label>
  </div>
</section>
```

### 默认开启

使用 `default-checked` 设置非受控模式下的初始状态。

```html preview
<script type="module">
  import '@ve-design/web/ve-switch';
</script>

<section style="display:grid; place-items:center; padding:24px;">
  <ve-switch default-checked aria-label="Conversation memory"></ve-switch>
</section>
```

### 尺寸

使用 `size` 设置开关尺寸。

```html preview
<script type="module">
  import '@ve-design/web/ve-switch';
</script>

<section style="display:grid; place-items:center; padding:24px;">
  <div style="display:flex; align-items:center; gap:28px;">
    <ve-switch size="small" aria-label="Small switch"></ve-switch>
    <ve-switch size="default" checked aria-label="Default switch"></ve-switch>
    <ve-switch size="large" checked aria-label="Large switch"></ve-switch>
  </div>
</section>
```

### 禁用状态

使用 `disabled` 禁用开关交互。

```html preview
<script type="module">
  import '@ve-design/web/ve-switch';
</script>

<section style="display:grid; place-items:center; padding:24px;">
  <div style="display:flex; align-items:center; gap:28px;">
    <ve-switch disabled aria-label="Disabled off"></ve-switch>
    <ve-switch disabled checked aria-label="Disabled on"></ve-switch>
  </div>
</section>
```

### 监听变化

用户切换状态时触发 `ve-change`。

```html preview
<script type="module">
  import '@ve-design/web/ve-switch';
</script>

<section style="display:grid; place-items:center; gap:12px; padding:24px;">
  <ve-switch id="event-switch" aria-label="Live telemetry"></ve-switch>
  <code id="event-log" style="color:var(--color-text-secondary);">checked: false</code>
</section>

<script>
  const switchElement = document.getElementById('event-switch');
  const log = document.getElementById('event-log');

  switchElement.addEventListener('ve-change', (event) => {
    log.textContent = `checked: ${event.detail.checked}`;
  });
</script>
```

## API

### ve-switch 属性

| 属性名 | 描述 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `checked` | 当前是否开启。 | `boolean \| undefined` | `undefined` |
| `default-checked` | 非受控模式下的初始开启状态。 | `boolean` | `false` |
| `disabled` | 是否禁用。 | `boolean` | `false` |
| `size` | 开关尺寸。 | `'small' &#124; 'default' &#124; 'large'` | `'default'` |

### ve-switch 事件

| 事件名 | 描述 | 参数类型 |
| --- | --- | --- |
| `ve-change` | 用户切换状态时触发。 | `CustomEvent<{ checked: boolean }>` |

### ve-switch 方法

| 方法名 | 描述 |
| --- | --- |
| `click()` | 触发开关控件点击。 |

### ve-switch 插槽

无。
