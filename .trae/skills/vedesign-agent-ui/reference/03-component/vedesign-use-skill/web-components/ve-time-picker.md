`ve-time-picker` 用于选择或输入一天内的具体时间，默认精确到分钟，支持 24 小时制、手动输入、秒选择、步长、范围限制、时间范围、清空、禁用、状态说明和受控展开。

## 何时使用

- 在表单、筛选器或计划任务配置中选择具体执行时间。
- 需要用户直接输入时间，也需要通过下拉面板辅助选择时间。
- 需要约束可选时间范围，例如只允许选择工作时段、发布窗口或巡检时间。
- 需要选择开始和结束时间，表达一天内的任务执行窗口。
- 需要在 Agent 调度、任务提醒、自动化执行窗口等场景中表达一天内的时间点。

## 引入组件

```ts
import '@ve-design/web/ve-time-picker';
```

## 示例

### 基础用法

使用 `value`、`default-value` 和 `placeholder` 控制时间选择器的展示内容。默认格式为 `HH:mm`，可直接在输入框中手动输入时间。

```html preview
<script type="module">
  import '@ve-design/web/ve-time-picker';
</script>

<section style="display: grid; place-items: center; padding: 24px;">
  <div style="display: grid; gap: 12px; width: min(100%, 460px);">
    <ve-time-picker value="09:30"></ve-time-picker>
    <ve-time-picker default-value="18:45"></ve-time-picker>
    <ve-time-picker placeholder="请选择执行时间"></ve-time-picker>
  </div>
</section>
```

### 手动输入

输入合法时间后按 Enter 或失焦会提交新值；无法解析的输入会回退到当前有效值。

```html preview
<script type="module">
  import '@ve-design/web/ve-time-picker';
</script>

<section style="display: grid; place-items: center; padding: 24px;">
  <div style="display: grid; gap: 12px; width: min(100%, 360px);">
    <ve-time-picker
      id="manual-time"
      allow-clear
      placeholder="输入或选择时间"
    ></ve-time-picker>
    <code id="manual-time-log">请输入 09:30 这样的时间</code>
  </div>
</section>

<script>
  const picker = document.getElementById('manual-time');
  const log = document.getElementById('manual-time-log');

  picker.addEventListener('ve-change', (event) => {
    log.textContent = `当前时间：${event.detail.value}`;
  });
</script>
```

### 格式

`format` 控制展示和提交的时间格式。默认使用 `HH:mm`，如确有秒级选择场景，可以设置为 `HH:mm:ss` 展示秒列。

```html preview
<script type="module">
  import '@ve-design/web/ve-time-picker';
</script>

<section style="display: grid; place-items: center; padding: 24px;">
  <div style="display: grid; gap: 12px; width: min(100%, 360px);">
    <ve-time-picker value="10:15"></ve-time-picker>
    <ve-time-picker format="HH:mm:ss" value="10:15:30"></ve-time-picker>
  </div>
</section>
```

### 步长

`hour-step`、`minute-step` 和 `second-step` 控制每列可选项的间隔。

```html preview
<script type="module">
  import '@ve-design/web/ve-time-picker';
</script>

<section style="display: grid; place-items: center; padding: 24px;">
  <div style="display: grid; gap: 12px; width: min(100%, 360px);">
    <ve-time-picker
      value="08:30"
      hour-step="2"
      minute-step="15"
    ></ve-time-picker>
    <ve-time-picker
      format="HH:mm:ss"
      value="10:15:30"
      minute-step="15"
      second-step="30"
    ></ve-time-picker>
  </div>
</section>
```

### 范围限制

`min` 和 `max` 限制可选时间范围。超出范围的时间项不可选。

```html preview
<script type="module">
  import '@ve-design/web/ve-time-picker';
</script>

<section style="display: grid; place-items: center; padding: 24px;">
  <div style="display: grid; gap: 12px; width: min(100%, 360px);">
    <ve-time-picker
      min="09:00"
      max="18:00"
      value="14:30"
      placeholder="仅限工作时间"
    ></ve-time-picker>
    <ve-time-picker
      min="20:00"
      max="23:30"
      placeholder="选择发布窗口"
    ></ve-time-picker>
  </div>
</section>
```

### 范围选择器

设置 `range` 后可选择开始和结束时间，`value` 和 `default-value` 使用逗号分隔两个时间值。范围面板使用单组时间列，默认先设置开始时间，完成后自动切换到结束时间，也可以点击触发器中的开始/结束片段切换当前编辑端。

```html preview
<script type="module">
  import '@ve-design/web/ve-time-picker';
</script>

<section style="display: grid; place-items: center; padding: 24px;">
  <div style="display: grid; gap: 12px; width: min(100%, 420px);">
    <ve-time-picker range allow-clear value="09:00,18:30"></ve-time-picker>
    <ve-time-picker
      range
      default-value="10:00,12:30"
      minute-step="15"
      placeholder="选择时间范围"
    ></ve-time-picker>
  </div>
</section>
```

### 尺寸和状态

`size` 控制触发器尺寸，`status` 与 `description` 用于展示校验反馈。

```html preview
<script type="module">
  import '@ve-design/web/ve-time-picker';
</script>

<section style="display: grid; place-items: center; padding: 24px;">
  <div style="display: grid; gap: 12px; width: min(100%, 360px);">
    <ve-time-picker size="small" placeholder="小尺寸"></ve-time-picker>
    <ve-time-picker size="default" placeholder="默认尺寸"></ve-time-picker>
    <ve-time-picker size="large" placeholder="大尺寸"></ve-time-picker>
    <ve-time-picker
      status="warning"
      description="冻结窗口冲突，请调整时间。"
      width="320"
      value="23:30"
    ></ve-time-picker>
    <ve-time-picker
      status="error"
      description="请选择时间。"
      placeholder="必填时间"
      width="220"
    ></ve-time-picker>
  </div>
</section>
```

### 清空和禁用

`allow-clear` 允许清空当前时间，清空按钮会在 hover 或展开时出现；`disabled` 禁用组件，`loading` 展示异步加载状态。

```html preview
<script type="module">
  import '@ve-design/web/ve-time-picker';
</script>

<section style="display: grid; place-items: center; padding: 24px;">
  <div style="display: grid; gap: 12px; width: min(100%, 360px);">
    <ve-time-picker allow-clear value="07:00"></ve-time-picker>
    <ve-time-picker disabled value="12:00"></ve-time-picker>
    <ve-time-picker loading placeholder="正在加载排期策略"></ve-time-picker>
  </div>
</section>
```

### 自定义宽度

默认宽度适合常见分钟格式。可以通过 `width` 按业务场景调整单时间、范围选择器和说明文案宽度。

```html preview
<script type="module">
  import '@ve-design/web/ve-time-picker';
</script>

<section style="display: grid; place-items: center; padding: 24px;">
  <div style="display: grid; gap: 12px; width: min(100%, 620px);">
    <ve-time-picker
      width="280"
      placeholder="选择较长的执行时间"
    ></ve-time-picker>
    <ve-time-picker
      status="warning"
      description="冻结窗口冲突，请选择其他执行时间。"
      width="420"
      value="23:30"
    ></ve-time-picker>
    <ve-time-picker range width="360" value="09:00,18:30"></ve-time-picker>
  </div>
</section>
```

### 内置标签和前缀

`label` 渲染内置标签段，`prefix` 插槽可扩展触发器前缀内容。

```html preview
<script type="module">
  import '@ve-design/web/ve-time-picker';
  import '@ve-design/web/icons/history';
</script>

<section style="display: grid; place-items: center; padding: 24px;">
  <div style="display: grid; gap: 12px; width: min(100%, 520px);">
    <ve-time-picker label="执行时间" value="09:00" width="320"></ve-time-picker>
    <ve-time-picker placeholder="选择交接时间" width="320">
      <ve-icon slot="prefix" name="history"></ve-icon>
    </ve-time-picker>
  </div>
</section>
```

### 事件

`ve-change` 在提交新时间时触发，`ve-clear` 在清空时触发，`ve-visible-change` 在面板展开状态变化时触发。

```html preview
<script type="module">
  import '@ve-design/web/ve-time-picker';
</script>

<section style="display: grid; place-items: center; padding: 24px;">
  <div style="display: grid; gap: 12px; width: min(100%, 420px);">
    <ve-time-picker id="time-event" allow-clear value="10:00"></ve-time-picker>
    <code id="time-event-log">等待时间变化</code>
  </div>
</section>

<script>
  const picker = document.getElementById('time-event');
  const log = document.getElementById('time-event-log');

  picker.addEventListener('ve-change', (event) => {
    log.textContent = `已选择：${event.detail.value}`;
  });

  picker.addEventListener('ve-clear', () => {
    log.textContent = '已清空时间';
  });

  picker.addEventListener('ve-visible-change', (event) => {
    if (event.detail.open) {
      log.textContent = '面板已打开';
    }
  });
</script>
```

### 方法

`show()` 和 `hide()` 控制选择面板，`focus()` 和 `blur()` 控制触发器焦点。

```html preview
<script type="module">
  import '@ve-design/web/ve-button';
  import '@ve-design/web/ve-time-picker';
</script>

<section style="display: grid; place-items: center; padding: 24px;">
  <div style="display: grid; gap: 12px; width: min(100%, 420px);">
    <div style="display: flex; justify-content: center; gap: 8px;">
      <ve-button id="time-open">打开</ve-button>
      <ve-button id="time-close" type="outline">关闭</ve-button>
    </div>
    <ve-time-picker
      id="controlled-time"
      placeholder="选择备用执行时间"
    ></ve-time-picker>
  </div>
</section>

<script>
  const picker = document.getElementById('controlled-time');
  document
    .getElementById('time-open')
    .addEventListener('click', () => picker.show());
  document
    .getElementById('time-close')
    .addEventListener('click', () => picker.hide());
</script>
```

## API

### ve-time-picker 属性

| 属性名                     | 描述                                                     | 类型                                        | 默认值          |
| -------------------------- | -------------------------------------------------------- | ------------------------------------------- | --------------- |
| `value`                    | 当前时间值。                                             | `string`                                    | `''`            |
| `default-value`            | 初始时间值。                                             | `string`                                    | `''`            |
| `placeholder`              | 未选择时的提示文本。                                     | `string`                                    | `'选择时间'`    |
| `label`                    | 内置标签段文本。                                         | `string`                                    | `''`            |
| `description`              | 触发器下方说明文本，颜色跟随 `status`。                  | `string`                                    | `''`            |
| `width`                    | 触发器宽度，纯数字字符串按 px 处理。                     | `string`                                    | `''`            |
| `format`                   | 时间展示和提交格式。                                     | `'HH:mm:ss' &#124; 'HH:mm'`                 | `'HH:mm'`       |
| `size`                     | 触发器尺寸。                                             | `'small' &#124; 'default' &#124; 'large'`   | `'default'`     |
| `status`                   | 状态样式。                                               | `'default' &#124; 'warning' &#124; 'error'` | `'default'`     |
| `disabled`                 | 是否禁用。                                               | `boolean`                                   | `false`         |
| `range`                    | 是否启用开始/结束时间范围选择。                          | `boolean`                                   | `false`         |
| `loading`                  | 是否展示加载状态。                                       | `boolean`                                   | `false`         |
| `allow-clear`              | 是否允许清空当前时间。                                   | `boolean`                                   | `false`         |
| `open`                     | 当前选择面板是否打开。                                   | `boolean`                                   | `false`         |
| `hour-step`                | 小时列步长。                                             | `number`                                    | `1`             |
| `minute-step`              | 分钟列步长。                                             | `number`                                    | `1`             |
| `second-step`              | 秒列步长。                                               | `number`                                    | `1`             |
| `min`                      | 最小可选时间；格式需与 `format` 兼容。                   | `string`                                    | `''`            |
| `max`                      | 最大可选时间；格式需与 `format` 兼容。                   | `string`                                    | `''`            |
| `popup-match-select-width` | 选择面板宽度是否匹配触发器宽度，默认按时间列内容自适应。 | `boolean`                                   | `false`         |

### ve-time-picker 事件

| 事件名              | 描述                         | 参数类型                                                                                                                                                                                          |
| ------------------- | ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ve-change`         | 当前时间值变化并提交时触发。 | `CustomEvent<{ value: string; hour: number; minute: number; second: number &#124; undefined; time: TimeParts &#124; TimeParts[]; range: boolean; source: 'select' &#124; 'input' &#124; 'api' }>` |
| `ve-clear`          | 当前时间被清空时触发。       | `CustomEvent<{ value: '' }>`                                                                                                                                                                      |
| `ve-visible-change` | 选择面板可见状态变化时触发。 | `CustomEvent<{ open: boolean; reason: 'api' &#124; 'trigger' &#124; 'outside' &#124; 'select' &#124; 'escape' }>`                                                                                 |

### ve-time-picker 方法

| 方法名                          | 描述                     |
| ------------------------------- | ------------------------ |
| `focus(options?: FocusOptions)` | 聚焦时间选择器触发器。   |
| `blur()`                        | 让时间选择器触发器失焦。 |
| `show()`                        | 打开选择面板。           |
| `hide()`                        | 关闭选择面板。           |

### ve-time-picker 插槽

| 插槽名   | 描述             |
| -------- | ---------------- |
| `prefix` | 触发器前缀内容。 |
