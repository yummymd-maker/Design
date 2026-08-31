`ve-select` 用于从一组选项中选择单个或多个值，支持分组、禁用、清空、多选标签和状态说明文本。

## 何时使用

- 在表单、筛选器或配置项中选择枚举值。
- 需要多选并以标签展示已选项。
- 需要分组、禁用选项或空状态。

## 引入组件

```ts
import '@ve-design/web/ve-select';
```

## 示例

### 基础用法

通过默认插槽声明 `ve-select-item`。

```html preview
<script type="module">
  import '@ve-design/web/ve-select';
  import '@ve-design/web/icons/pie-chart-01';
  import '@ve-design/web/icons/robot';
</script>

<section style="display: grid; place-items: center; padding: 24px;">
  <div style="width: min(100%, 360px);">
    <ve-select placeholder="Select workspace">
      <ve-icon slot="prefix" name="robot"></ve-icon>
      <ve-select-item value="project-space-a">
        <span style="display: inline-flex; align-items: center; gap: 8px;">
          <ve-icon name="pie-chart-01"></ve-icon>
          项目空间 A
        </span>
      </ve-select-item>
      <ve-select-item value="prompt-lab">
        <span style="display: inline-flex; align-items: center; gap: 8px;">
          <ve-icon name="pie-chart-01"></ve-icon>
          项目空间 B
        </span>
      </ve-select-item>
      <ve-select-item value="knowledge-hub">
        <span style="display: inline-flex; align-items: center; gap: 8px;">
          <ve-icon name="pie-chart-01"></ve-icon>
          测试环境
        </span>
      </ve-select-item>
      <ve-select-item value="eval-center">
        <span style="display: inline-flex; align-items: center; gap: 8px;">
          <ve-icon name="pie-chart-01"></ve-icon>
          生产环境
        </span>
      </ve-select-item>
    </ve-select>
  </div>
</section>
```

### 值和事件

`default-value` 设置初始值，`value` 设置当前值，`ve-change` 反馈选择结果。选项较多时，下拉面板超过 `max-height`（默认 220px）后会出现滚动。

```html preview
<script type="module">
  import '@ve-design/web/ve-select';
</script>

<section style="display: grid; place-items: center; padding: 24px;">
  <div style="display: grid; gap: 12px; width: min(100%, 360px);">
    <ve-select default-value="gpt-4o">
      <ve-select-item value="gpt-4o">GPT-4o</ve-select-item>
      <ve-select-item value="gpt-4o-mini">GPT-4o mini</ve-select-item>
      <ve-select-item value="gpt-4-turbo">GPT-4 Turbo</ve-select-item>
      <ve-select-item value="claude-3-5-sonnet">Model A</ve-select-item>
      <ve-select-item value="claude-3-opus">Model B</ve-select-item>
      <ve-select-item value="claude-3-haiku">Model C</ve-select-item>
      <ve-select-item value="gemini-1-5-pro">Model D</ve-select-item>
      <ve-select-item value="gemini-1-5-flash">Model E</ve-select-item>
      <ve-select-item value="llama-3-70b">Llama 3 70B</ve-select-item>
      <ve-select-item value="mistral-large">Mistral Large</ve-select-item>
    </ve-select>

    <ve-select id="model-select" value="claude-3-5-sonnet">
      <ve-select-item value="gpt-4o">GPT-4o</ve-select-item>
      <ve-select-item value="gpt-4o-mini">GPT-4o mini</ve-select-item>
      <ve-select-item value="gpt-4-turbo">GPT-4 Turbo</ve-select-item>
      <ve-select-item value="claude-3-5-sonnet">Model A</ve-select-item>
      <ve-select-item value="claude-3-opus">Model B</ve-select-item>
      <ve-select-item value="claude-3-haiku">Model C</ve-select-item>
      <ve-select-item value="gemini-1-5-pro">Model D</ve-select-item>
      <ve-select-item value="gemini-1-5-flash">Model E</ve-select-item>
      <ve-select-item value="llama-3-70b">Llama 3 70B</ve-select-item>
      <ve-select-item value="mistral-large">Mistral Large</ve-select-item>
    </ve-select>
    <code id="model-log">Selected: claude-3-5-sonnet</code>
  </div>
</section>

<script>
  document
    .getElementById('model-select')
    .addEventListener('ve-change', (event) => {
      document.getElementById('model-log').textContent =
        `Selected: ${JSON.stringify(event.detail.value)}`;
    });
</script>
```

### 无边框模式

`borderless` 隐藏触发器外层边框，默认仍显示边框。

```html preview
<script type="module">
  import '@ve-design/web/ve-select';
</script>

<section style="display: grid; place-items: center; padding: 24px;">
  <div style="display: grid; gap: 12px; width: min(100%, 360px);">
    <ve-select borderless default-value="fast" placeholder="选择模式" popup-match-select-width="false">
      <ve-select-item value="fast">Fast replies</ve-select-item>
      <ve-select-item value="balanced">Balanced reasoning</ve-select-item>
      <ve-select-item value="deep">Deep reasoning</ve-select-item>
    </ve-select>

    <ve-select borderless placeholder="选择模式" popup-match-select-width="false">
      <ve-select-item value="draft">Draft summary</ve-select-item>
      <ve-select-item value="report">Generate report</ve-select-item>
      <ve-select-item value="trace">Trace changes</ve-select-item>
    </ve-select>
  </div>
</section>
```

### 多选

`mode="multiple"` 开启多选，`max-tag-count` 限制可见标签数量。

```html preview
<script type="module">
  import '@ve-design/web/ve-select';
</script>

<section style="display: grid; place-items: center; padding: 24px;">
  <div style="display: grid; gap: 12px; width: min(100%, 360px);">
    <ve-select
      id="capability-select"
      mode="multiple"
      max-tag-count="2"
      allow-clear
      placeholder="Select capabilities"
    >
      <ve-select-item value="web-search">Web search</ve-select-item>
      <ve-select-item value="code-runner">Code runner</ve-select-item>
      <ve-select-item value="file-reader">File reader</ve-select-item>
      <ve-select-item value="memory">Memory</ve-select-item>
      <ve-select-item value="handoff">Human handoff</ve-select-item>
    </ve-select>
    <code id="remove-log">Remove a tag to emit ve-remove</code>
  </div>
</section>

<script>
  const select = document.getElementById('capability-select');
  select.value = ['web-search', 'file-reader', 'memory'];
  select.addEventListener('ve-remove', (event) => {
    document.getElementById('remove-log').textContent =
      `Removed: ${event.detail.value}`;
  });
</script>
```

### 清空、加载和禁用

`allow-clear` 允许清空，`loading` 展示加载态，`disabled` 禁用组件。

```html preview
<script type="module">
  import '@ve-design/web/ve-select';
</script>

<section style="display: grid; place-items: center; padding: 32px 24px;">
  <div style="display: grid; gap: 28px; width: min(100%, 1160px);">
    <div
      style="
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(0, 360px));
        justify-content: center;
        gap: 16px;
      "
    >
      <ve-select allow-clear value="active" placeholder="Filter sessions">
        <ve-select-item value="all">All sessions</ve-select-item>
        <ve-select-item value="active">Active chats</ve-select-item>
        <ve-select-item value="archived">Archived chats</ve-select-item>
      </ve-select>

      <ve-select loading placeholder="Loading presets"></ve-select>
    </div>

    <div
      style="
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(0, 360px));
        justify-content: center;
        gap: 20px 40px;
      "
    >
      <ve-select disabled mode="multiple" value='["menu-1","menu-2"]'>
        <ve-select-item value="menu-1">Option A</ve-select-item>
        <ve-select-item value="menu-2">Option B</ve-select-item>
        <ve-select-item value="menu-3">Option C</ve-select-item>
      </ve-select>

      <ve-select disabled label="Disabled field" placeholder="选择模式">
        <ve-select-item value="menu-1">Option A</ve-select-item>
        <ve-select-item value="menu-2">Option B</ve-select-item>
        <ve-select-item value="menu-3">Option C</ve-select-item>
      </ve-select>

      <ve-select disabled label="Disabled field" value="menu-1">
        <ve-select-item value="menu-1">菜单选项</ve-select-item>
        <ve-select-item value="menu-2">Option B</ve-select-item>
        <ve-select-item value="menu-3">Option C</ve-select-item>
      </ve-select>

      <ve-select
        disabled
        label="Disabled field"
        mode="multiple"
        value='["menu-1"]'
      >
        <ve-select-item value="menu-1">Option A</ve-select-item>
        <ve-select-item value="menu-2">Option B</ve-select-item>
        <ve-select-item value="menu-3">Option C</ve-select-item>
      </ve-select>
    </div>
  </div>
</section>
```

### 分组和禁用选项

使用 `ve-select-group` 组织选项，`disabled` 禁用选项或分组。

```html preview
<script type="module">
  import '@ve-design/web/ve-select';
</script>

<section style="display: grid; place-items: center; padding: 24px;">
  <div style="width: min(100%, 360px);">
    <ve-select placeholder="Select deployment target">
      <ve-select-group label="Available">
        <ve-select-item value="sandbox">Agent sandbox</ve-select-item>
        <ve-select-item value="staging">Staging workspace</ve-select-item>
      </ve-select-group>
      <ve-select-group label="Locked" disabled>
        <ve-select-item value="prod-us">US production</ve-select-item>
        <ve-select-item value="prod-eu">EU production</ve-select-item>
      </ve-select-group>
      <ve-select-item value="global" disabled>Global production</ve-select-item>
    </ve-select>
  </div>
</section>
```

### 尺寸和状态

`size` 控制尺寸，`status` 展示校验状态。

```html preview
<script type="module">
  import '@ve-design/web/ve-select';
</script>

<section style="display: grid; place-items: center; padding: 24px;">
  <div style="display: grid; gap: 12px; width: min(100%, 360px);">
    <ve-select size="small" placeholder="Small"></ve-select>
    <ve-select size="default" placeholder="Default"></ve-select>
    <ve-select size="large" placeholder="Large"></ve-select>
    <ve-select
      status="warning"
      description="Review routing capacity before launch"
      placeholder="Review required"
    ></ve-select>
    <ve-select
      status="error"
      description="Please select a routing model"
      placeholder="Required field"
    ></ve-select>
  </div>
</section>
```

### 内置标签和说明

`label` 渲染内置标签段，`description` 渲染表单提示文本，并跟随 `status` 使用对应状态色。

```html preview
<script type="module">
  import '@ve-design/web/ve-select';
</script>

<section style="display: grid; place-items: center; padding: 24px;">
  <div style="display: grid; gap: 12px; width: min(100%, 360px);">
    <ve-select label="Agent" placeholder="Select agent" description="The selected Agent receives delegated tasks.">
      <ve-select-item value="planner">Planner</ve-select-item>
      <ve-select-item value="builder">Builder</ve-select-item>
      <ve-select-item value="reviewer">Reviewer</ve-select-item>
    </ve-select>

    <ve-select
      description="The selected model receives delegated tasks."
      placeholder="Select model"
    >
      <ve-select-item value="fast">Fast reasoning</ve-select-item>
      <ve-select-item value="deep">Deep reasoning</ve-select-item>
    </ve-select>

    <ve-select
      status="error"
      description="Please select an owner"
      placeholder="Required owner"
    >
      <ve-select-item value="ops">Agent Ops</ve-select-item>
      <ve-select-item value="frontend">AI Frontend</ve-select-item>
    </ve-select>
  </div>
</section>
```

### 插槽

`prefix` 可扩展触发器前缀，`empty` 可扩展空态。

```html preview
<script type="module">
  import '@ve-design/web/ve-select';
  import '@ve-design/web/icons/filter';
</script>

<section style="display: grid; place-items: center; padding: 24px;">
  <div style="width: min(100%, 360px);">
    <ve-select label="Owner" placeholder="Select owner" empty-text="No owner">
      <ve-icon slot="prefix" name="filter"></ve-icon>
      <div slot="empty">No owner available</div>
      <ve-select-item value="agent-ops">Agent Ops</ve-select-item>
      <ve-select-item value="prompt-team">Prompt Team</ve-select-item>
      <ve-select-item value="frontend-team">AI Chat Frontend</ve-select-item>
    </ve-select>
  </div>
</section>
```

### 方法

`show()` 和 `hide()` 控制下拉面板。

```html preview
<script type="module">
  import '@ve-design/web/ve-button';
  import '@ve-design/web/ve-select';
</script>

<section style="display: grid; place-items: center; padding: 24px;">
  <div style="display: grid; gap: 12px; width: min(100%, 360px);">
    <div style="display: flex; justify-content: center; gap: 8px;">
      <ve-button id="select-open">Open</ve-button>
      <ve-button id="select-close" type="outline">Close</ve-button>
    </div>
    <ve-select id="controlled-select" placeholder="Select fallback agent">
      <ve-select-item value="support">Support Agent</ve-select-item>
      <ve-select-item value="data">Data Agent</ve-select-item>
      <ve-select-item value="ops">Ops Agent</ve-select-item>
    </ve-select>
  </div>
</section>

<script>
  const select = document.getElementById('controlled-select');
  document
    .getElementById('select-open')
    .addEventListener('click', () => select.show());
  document
    .getElementById('select-close')
    .addEventListener('click', () => select.hide());
</script>
```

## API

### ve-select 属性

| 属性名                     | 描述                                                  | 类型                                                             | 默认值            |
| -------------------------- | ----------------------------------------------------- | ---------------------------------------------------------------- | ----------------- |
| `value`                    | 当前选中值；单选为单个值，多选为数组。                | `string &#124; number &#124; (string &#124; number)[] &#124; ''` | `''`              |
| `default-value`            | 初始选中值。                                          | `string &#124; number &#124; (string &#124; number)[] &#124; ''` | `''`              |
| `placeholder`              | 未选择时的提示文本。                                  | `string`                                                         | `'Please select'` |
| `label`                    | 内置标签段文本。                                      | `string`                                                         | `''`              |
| `description`              | 触发器下方说明文本，颜色跟随 `status`。               | `string`                                                         | `''`              |
| `mode`                     | 选择模式。                                            | `'single' &#124; 'multiple'`                                     | `'single'`        |
| `size`                     | 触发器尺寸。                                          | `'small' &#124; 'default' &#124; 'large'`                        | `'default'`       |
| `status`                   | 状态样式。                                            | `'default' &#124; 'warning' &#124; 'error'`                      | `'default'`       |
| `borderless`               | 是否隐藏触发器外层边框。                              | `boolean`                                                        | `false`           |
| `disabled`                 | 是否禁用。                                            | `boolean`                                                        | `false`           |
| `loading`                  | 是否展示加载状态。                                    | `boolean`                                                        | `false`           |
| `allow-clear`              | 是否允许清空当前值。                                  | `boolean`                                                        | `false`           |
| `open`                     | 当前下拉面板是否打开；设置为布尔值时进入受控模式。    | `boolean &#124; undefined`                                      | `undefined`       |
| `default-open`             | 非受控模式下的初始打开状态。                          | `boolean`                                                        | `false`           |
| `max-tag-count`            | 多选模式下最大可见标签数量；也可设置为 `responsive`。 | `number &#124; 'responsive' &#124; undefined`                    | `undefined`       |
| `popup-match-select-width` | 下拉面板宽度是否匹配触发器宽度。                      | `boolean`                                                        | `true`            |
| `max-height`               | 下拉面板最大高度（px），超出时选项可滚动。            | `number`                                                         | `220`             |
| `empty-text`               | 空状态文本。                                          | `string`                                                         | `'No data'`       |

### ve-select 事件

| 事件名              | 描述                             | 参数类型                                                                                                          |
| ------------------- | -------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `ve-change`         | 选中值变化时触发。               | `CustomEvent<{ value: SelectValue; option: SelectOption &#124; SelectOption[] &#124; undefined }>`                |
| `ve-clear`          | 当前值被清空时触发。             | `CustomEvent<{ value: '' &#124; [] }>`                                                                            |
| `ve-open-change`    | 下拉打开状态变化请求发生时触发。 | `CustomEvent<{ open: boolean; reason: 'api' &#124; 'trigger' &#124; 'outside' &#124; 'select' &#124; 'escape' }>` |
| `ve-remove`         | 多选模式下移除某个已选项时触发。 | `CustomEvent<{ value: string &#124; number; option: SelectOption }>`                                              |

### ve-select 方法

| 方法名                          | 描述                 |
| ------------------------------- | -------------------- |
| `focus(options?: FocusOptions)` | 聚焦选择器触发器。   |
| `blur()`                        | 让选择器触发器失焦。 |
| `show()`                        | 打开下拉面板。       |
| `hide()`                        | 关闭下拉面板。       |

### ve-select 插槽

| 插槽名   | 描述                                                       |
| -------- | ---------------------------------------------------------- |
| 默认插槽 | 选项声明区域，放置 `ve-select-item` 或 `ve-select-group`。 |
| `prefix` | 触发器前缀内容。                                           |
| `empty`  | 自定义空状态内容。                                         |

### ve-select-item 属性

| 属性名     | 描述                     | 类型                                    | 默认值      |
| ---------- | ------------------------ | --------------------------------------- | ----------- |
| `value`    | 选项值。                 | `string &#124; number &#124; undefined` | `undefined` |
| `disabled` | 是否禁用该选项。         | `boolean`                               | `false`     |
| `closable` | 多选标签是否可单独移除。 | `boolean`                               | `true`      |

### ve-select-item 插槽

| 插槽名   | 描述                             |
| -------- | -------------------------------- |
| 默认插槽 | 选项展示内容，可放置文本或图标。 |

### ve-select-group 属性

| 属性名     | 描述                   | 类型      | 默认值  |
| ---------- | ---------------------- | --------- | ------- |
| `label`    | 分组标题文本。         | `string`  | `''`    |
| `disabled` | 是否禁用组内全部选项。 | `boolean` | `false` |

### ve-select-group 插槽

| 插槽名   | 描述                                  |
| -------- | ------------------------------------- |
| 默认插槽 | 分组选项，放置多个 `ve-select-item`。 |
