`ve-date-picker` 用于选择日期和日期范围，支持格式化展示、不可选规则、预设快捷项、清空、禁用、状态说明和受控展开。日期面板按设计稿使用 5/6 行自适应布局，范围面板中的相邻月份不会重复展示同一日期。

## 何时使用

- 在表单、筛选器或配置面板中选择单个自然日期。
- 需要约束可选日期范围，例如只允许选择发布窗口、巡检周期或任务截止日期。
- 需要以日历面板浏览月份并选择日期，同时得到标准日期字符串。
- 需要选择一个开始/结束范围，并通过快捷项快速回填常用日期。
- 需要在 Agent 调度、任务规划、数据回溯、报告生成等场景中表达一个日期点。

## 引入组件

```ts
import '@ve-design/web/ve-date-picker';
```

## 示例

### 基础用法

使用 `value`、`default-value` 和 `placeholder` 控制日期选择器的展示内容。

```html preview
<script type="module">
  import '@ve-design/web/ve-date-picker';
</script>

<section style="display: grid; place-items: center; padding: 24px;">
  <div style="display: grid; gap: 12px; width: min(100%, 360px);">
    <ve-date-picker value="2026-06-11"></ve-date-picker>
    <ve-date-picker default-value="2026-07-01"></ve-date-picker>
    <ve-date-picker placeholder="选择日期"></ve-date-picker>
  </div>
</section>
```

### 默认值

使用 `default-value` 设置非受控初始值；`value` 适合由外部状态控制。默认打开面板展示当前月份，并在当天日期底部展示小圆点；`default-picker-value` 可以只控制初始面板展示年月，不会改变已选值。

```html preview
<script type="module">
  import '@ve-design/web/ve-date-picker';
</script>

<section style="display: grid; place-items: center; padding: 24px;">
  <div style="display: grid; gap: 12px; width: min(100%, 360px);">
    <ve-date-picker default-value="2026-07-01"></ve-date-picker>
    <ve-date-picker
      default-picker-value="2026-09-01"
      placeholder="打开到九月面板"
    ></ve-date-picker>
  </div>
</section>
```

### 格式

`format` 控制展示和提交的日期格式。默认使用 `YYYY-MM-DD`，也可以设置为 `YYYY/MM/DD` 或 `MM/DD/YYYY`。

```html preview
<script type="module">
  import '@ve-design/web/ve-date-picker';
</script>

<section style="display: grid; place-items: center; padding: 24px;">
  <div style="display: grid; gap: 12px; width: min(100%, 360px);">
    <ve-date-picker format="YYYY-MM-DD" value="2026-06-11"></ve-date-picker>
    <ve-date-picker format="YYYY/MM/DD" value="2026/06/11"></ve-date-picker>
    <ve-date-picker format="MM/DD/YYYY" value="06/11/2026"></ve-date-picker>
  </div>
</section>
```

### 范围限制

`min` 和 `max` 限制可选日期范围。超出范围的日期不可选。

```html preview
<script type="module">
  import '@ve-design/web/ve-date-picker';
</script>

<section style="display: grid; place-items: center; padding: 24px;">
  <div style="display: grid; gap: 12px; width: min(100%, 360px);">
    <ve-date-picker
      min="2026-06-01"
      max="2026-06-30"
      value="2026-06-11"
      placeholder="六月发布窗口"
    ></ve-date-picker>
    <ve-date-picker
      min="2026-07-01"
      max="2026-09-30"
      placeholder="季度复盘日期"
    ></ve-date-picker>
  </div>
</section>
```

### 范围选择器

`range` 使用逗号分隔的 `value` 表达开始和结束值。触发器会拆分开始、结束两个片段，并高亮当前正在编辑的片段；面板会并排展示相邻两个月份，并在开始日期与结束日期之间补齐连续底色。选择完成后触发 `ve-change`，`event.detail.value` 仍以逗号分隔。

```html preview
<script type="module">
  import '@ve-design/web/ve-date-picker';
</script>

<section style="display: grid; place-items: center; padding: 24px;">
  <div style="display: grid; gap: 12px; width: min(100%, 420px);">
    <ve-date-picker
      range
      allow-clear
      value="2026-06-04,2026-07-10"
    ></ve-date-picker>
    <ve-date-picker
      range
      allow-clear
      value="2026-06-08,2026-06-14"
      placeholder="选择维护窗口"
    ></ve-date-picker>
  </div>
</section>
```

### 预设时间快捷选择

`shortcuts` 支持 JSON 数组，也支持 `Label:start,end;Label:value` 的紧凑写法。除固定日期外，也支持 `today`、`yesterday`、`tomorrow` 以及 `-7d`、`-1m`、`+1w` 这类相对日期表达式。当前值命中某个快捷项时，该快捷项会保持选中高亮；超长快捷项会单行省略，并通过原生 `title` 展示完整文案。

```html preview
<script type="module">
  import '@ve-design/web/ve-date-picker';
</script>

<section style="display: grid; place-items: center; padding: 24px;">
  <div style="display: grid; gap: 12px; width: min(100%, 420px);">
    <ve-date-picker
      value="yesterday"
      shortcut-placement="left"
      shortcuts="昨天:yesterday;7天前:-7d;30天前:-30d;60天前:-60d;90天前:-90d"
      placeholder="从快捷项选择"
    ></ve-date-picker>
    <ve-date-picker
      allow-clear
      value="yesterday"
      shortcut-placement="left"
      shortcuts="Yesterday:yesterday;7 days ago:-7d;30 days ago:-30d;60 days ago:-60d;90 days ago:-90d"
      placeholder="从快捷项选择"
    ></ve-date-picker>
  </div>
</section>
```

### 定制预设范围位置

`shortcut-placement="left"` 可把预设项放到面板左侧，适合大量预设范围，行为对应 Arco Design 的 `shortcutsPlacementLeft`。

```html preview
<script type="module">
  import '@ve-design/web/ve-date-picker';
</script>

<section style="display: grid; place-items: center; padding: 24px;">
  <div style="display: grid; gap: 12px; width: min(100%, 420px);">
    <ve-date-picker
      range
      allow-clear
      shortcut-placement="left"
      shortcuts='[{"label":"上半月","value":"2026-06-01","endValue":"2026-06-15"},{"label":"下半月","value":"2026-06-16","endValue":"2026-06-30"}]'
      placeholder="选择六月窗口"
    ></ve-date-picker>
  </div>
</section>
```

### 动态控制选取范围

`picker-value` 可控制当前面板展示的年月，`default-picker-value` 设置初始面板年月。结合 `min`、`max` 和 `disabled-date` 可以动态控制可选范围。

```html preview
<script type="module">
  import '@ve-design/web/ve-date-picker';
</script>

<section style="display: grid; place-items: center; padding: 24px;">
  <div style="display: grid; gap: 12px; width: min(100%, 420px);">
    <ve-date-picker
      picker-value="2026-09-01"
      min="2026-09-01"
      max="2026-12-31"
      disabled-date="dates:2026-10-01,2026-10-02;after:2026-12-20"
      placeholder="选择上线日期"
    ></ve-date-picker>
  </div>
</section>
```

### 尺寸和状态

`size` 控制触发器尺寸，`status` 与 `description` 用于展示校验反馈。状态反馈会使用对应的 warning/error 语义 token，并保持 active/focus 阴影与状态一致。

```html preview
<script type="module">
  import '@ve-design/web/ve-date-picker';
</script>

<section style="display: grid; place-items: center; padding: 24px;">
  <div style="display: grid; gap: 12px; width: min(100%, 360px);">
    <ve-date-picker size="small" placeholder="小尺寸"></ve-date-picker>
    <ve-date-picker size="default" placeholder="默认尺寸"></ve-date-picker>
    <ve-date-picker size="large" placeholder="大尺寸"></ve-date-picker>
    <ve-date-picker
      status="warning"
      description="该日期接近发布冻结期。"
      value="2026-06-28"
    ></ve-date-picker>
    <ve-date-picker
      status="error"
      description="请选择截止日期。"
      placeholder="必填日期"
    ></ve-date-picker>
  </div>
</section>
```

### 清空、禁用和加载

`allow-clear` 允许清空当前日期，清空按钮仅在触发器 hover 时替换日历图标；`disabled` 禁用组件，`loading` 展示异步加载状态。

```html preview
<script type="module">
  import '@ve-design/web/ve-date-picker';
</script>

<section style="display: grid; place-items: center; padding: 24px;">
  <div style="display: grid; gap: 12px; width: min(100%, 360px);">
    <ve-date-picker allow-clear value="2026-06-11"></ve-date-picker>
    <ve-date-picker disabled value="2026-06-12"></ve-date-picker>
    <ve-date-picker
      loading
      placeholder="正在加载工作区日历"
    ></ve-date-picker>
  </div>
</section>
```

### 内置标签和前缀

`label` 渲染内置标签段，`prefix` 插槽可扩展触发器前缀内容。内置标签仅作为说明文本，不提供独立 hover 或点击反馈。

```html preview
<script type="module">
  import '@ve-design/web/ve-date-picker';
  import '@ve-design/web/icons/history';
</script>

<section style="display: grid; place-items: center; padding: 24px;">
  <div style="display: grid; gap: 12px; width: min(100%, 360px);">
    <ve-date-picker label="截止日期" value="2026-06-11"></ve-date-picker>
    <ve-date-picker placeholder="选择报告日期">
      <ve-icon slot="prefix" name="history"></ve-icon>
    </ve-date-picker>
  </div>
</section>
```

### 受控展开

`open` 可控制日历面板的展开状态，`show()` 和 `hide()` 可通过方法打开或关闭面板。

```html preview
<script type="module">
  import '@ve-design/web/ve-button';
  import '@ve-design/web/ve-date-picker';
</script>

<section style="display: grid; place-items: center; padding: 24px;">
  <div style="display: grid; gap: 12px; width: min(100%, 420px);">
    <div style="display: flex; justify-content: center; gap: 8px;">
      <ve-button id="date-open">打开</ve-button>
      <ve-button id="date-close" type="outline">关闭</ve-button>
    </div>
    <ve-date-picker
      id="controlled-date"
      placeholder="选择交接日期"
    ></ve-date-picker>
  </div>
</section>

<script>
  const picker = document.getElementById('controlled-date');
  document
    .getElementById('date-open')
    .addEventListener('click', () => picker.show());
  document
    .getElementById('date-close')
    .addEventListener('click', () => picker.hide());
</script>
```

### 事件

`ve-change` 在提交新日期时触发，`ve-clear` 在清空时触发，`ve-visible-change` 在面板展开状态变化时触发。

```html preview
<script type="module">
  import '@ve-design/web/ve-date-picker';
</script>

<section style="display: grid; place-items: center; padding: 24px;">
  <div style="display: grid; gap: 12px; width: min(100%, 420px);">
    <ve-date-picker
      id="date-event"
      allow-clear
      value="2026-06-11"
    ></ve-date-picker>
    <code id="date-event-log">等待日期变化</code>
  </div>
</section>

<script>
  const picker = document.getElementById('date-event');
  const log = document.getElementById('date-event-log');

  picker.addEventListener('ve-change', (event) => {
    log.textContent = `已选择：${event.detail.value}`;
  });

  picker.addEventListener('ve-clear', () => {
    log.textContent = '已清空日期';
  });

  picker.addEventListener('ve-visible-change', (event) => {
    if (event.detail.open) {
      log.textContent = '日历已打开';
    }
  });
</script>
```

## API

### ve-date-picker 属性

| 属性名                     | 描述                                                  | 类型                                        | 默认值          |
| -------------------------- | ----------------------------------------------------- | ------------------------------------------- | --------------- |
| `value`                    | 当前日期值。                                          | `string`                                    | `''`            |
| `default-value`            | 初始日期值。                                          | `string`                                    | `''`            |
| `placeholder`              | 未选择时的提示文本。                                  | `string`                                    | `'选择日期'`    |
| `label`                    | 内置标签段文本。                                      | `string`                                    | `''`            |
| `description`              | 触发器下方说明文本，颜色跟随 `status`。               | `string`                                    | `''`            |
| `format`                   | 日期展示和提交格式，未设置时默认使用 `YYYY-MM-DD`。   | `string`                                    | `''`            |
| `size`                     | 触发器尺寸。                                          | `'small' &#124; 'default' &#124; 'large'`   | `'default'`     |
| `status`                   | 状态样式。                                            | `'default' &#124; 'warning' &#124; 'error'` | `'default'`     |
| `disabled`                 | 是否禁用。                                            | `boolean`                                   | `false`         |
| `loading`                  | 是否展示加载状态。                                    | `boolean`                                   | `false`         |
| `allow-clear`              | 是否允许清空当前日期。                                | `boolean`                                   | `false`         |
| `open`                     | 当前日历面板是否打开。                                | `boolean`                                   | `false`         |
| `range`                    | 是否选择开始/结束范围，`value` 使用逗号分隔。         | `boolean`                                   | `false`         |
| `min`                      | 最小可选日期；格式需与 `format` 兼容。                | `string`                                    | `''`            |
| `max`                      | 最大可选日期；格式需与 `format` 兼容。                | `string`                                    | `''`            |
| `disabled-date`            | 不可选日期规则，支持 `before`、`after`、`dates`。     | `string`                                    | `''`            |
| `shortcuts`                | 预设快捷项，支持 JSON、紧凑字符串以及相对日期表达式。 | `string`                                    | `''`            |
| `shortcut-placement`       | 预设快捷项位置。                                      | `'bottom' &#124; 'left'`                    | `'bottom'`      |
| `default-picker-value`     | 初始面板展示日期。                                    | `string`                                    | `''`            |
| `picker-value`             | 受控面板展示日期。                                    | `string`                                    | `''`            |
| `separator`                | 范围值在触发器中的展示分隔符。                        | `string`                                    | `' - '`         |
| `popup-match-select-width` | 日历面板宽度是否匹配触发器宽度。                      | `boolean`                                   | `false`         |

### ve-date-picker 事件

| 事件名              | 描述                         | 参数类型                                                                                                                   |
| ------------------- | ---------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `ve-change`         | 当前日期值变化并提交时触发。 | `CustomEvent<{ value: string; date: Date &#124; Date[]; source: 'select' &#124; 'today' &#124; 'shortcut' &#124; 'api' }>` |
| `ve-clear`          | 当前日期被清空时触发。       | `CustomEvent<{ value: '' }>`                                                                                               |
| `ve-visible-change` | 日历面板可见状态变化时触发。 | `CustomEvent<{ open: boolean; reason: 'api' &#124; 'trigger' &#124; 'outside' &#124; 'select' &#124; 'escape' }>`          |

### ve-date-picker 方法

| 方法名                          | 描述                     |
| ------------------------------- | ------------------------ |
| `focus(options?: FocusOptions)` | 聚焦日期选择器触发器。   |
| `blur()`                        | 让日期选择器触发器失焦。 |
| `show()`                        | 打开日历面板。           |
| `hide()`                        | 关闭日历面板。           |

### ve-date-picker 插槽

| 插槽名   | 描述             |
| -------- | ---------------- |
| `prefix` | 触发器前缀内容。 |
