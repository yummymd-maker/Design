`DatePicker` 用于选择日期和日期范围，支持格式化展示、不可选规则、预设快捷项、清空、禁用、状态说明和受控展开。日期面板按设计稿使用 5/6 行自适应布局，范围面板中的相邻月份不会重复展示同一日期。

## 何时使用

- 在表单、筛选器或配置面板中选择单个自然日期。
- 需要约束可选日期范围，例如只允许选择发布窗口、巡检周期或任务截止日期。
- 需要以日历面板浏览月份并选择日期，同时得到标准日期字符串。
- 需要选择一个开始/结束范围，并通过快捷项快速回填常用日期。
- 需要在 Agent 调度、任务规划、数据回溯、报告生成等场景中表达一个日期点。

## 引入组件

```tsx
import { DatePicker } from '@ve-design/react';
```

## 示例

### 基础用法

使用 `value`、`defaultValue` 和 `placeholder` 控制日期选择器的展示内容。

```tsx preview
import { DatePicker } from '@ve-design/react';

<section style={{ display: 'grid', placeItems: 'center', padding: 24 }}>
  <div style={{ display: 'grid', gap: 12, width: 'min(100%, 360px)' }}>
    <DatePicker value="2026-06-11" />
    <DatePicker defaultValue="2026-07-01" />
    <DatePicker placeholder="选择日期" />
  </div>
</section>;
```

### 默认值

使用 `defaultValue` 设置非受控初始值；`value` 适合由外部状态控制。默认打开面板展示当前月份，并在当天日期底部展示小圆点；`defaultPickerValue` 可以只控制初始面板展示年月，不会改变已选值。

```tsx preview
import { DatePicker } from '@ve-design/react';

<section style={{ display: 'grid', placeItems: 'center', padding: 24 }}>
  <div style={{ display: 'grid', gap: 12, width: 'min(100%, 360px)' }}>
    <DatePicker defaultValue="2026-07-01" />
    <DatePicker
      defaultPickerValue="2026-09-01"
      placeholder="打开到九月面板"
    />
  </div>
</section>;
```

### 格式

`format` 控制展示和提交的日期格式。默认使用 `YYYY-MM-DD`，也可以设置为 `YYYY/MM/DD` 或 `MM/DD/YYYY`。

```tsx preview
import { DatePicker } from '@ve-design/react';

<section style={{ display: 'grid', placeItems: 'center', padding: 24 }}>
  <div style={{ display: 'grid', gap: 12, width: 'min(100%, 360px)' }}>
    <DatePicker format="YYYY-MM-DD" value="2026-06-11" />
    <DatePicker format="YYYY/MM/DD" value="2026/06/11" />
    <DatePicker format="MM/DD/YYYY" value="06/11/2026" />
  </div>
</section>;
```

### 范围限制

`min` 和 `max` 限制可选日期范围。超出范围的日期不可选。

```tsx preview
import { DatePicker } from '@ve-design/react';

<section style={{ display: 'grid', placeItems: 'center', padding: 24 }}>
  <div style={{ display: 'grid', gap: 12, width: 'min(100%, 360px)' }}>
    <DatePicker
      min="2026-06-01"
      max="2026-06-30"
      value="2026-06-11"
      placeholder="六月发布窗口"
    />
    <DatePicker
      min="2026-07-01"
      max="2026-09-30"
      placeholder="季度复盘日期"
    />
  </div>
</section>;
```

### 范围选择器

`range` 使用逗号分隔的 `value` 表达开始和结束值。触发器会拆分开始、结束两个片段，并高亮当前正在编辑的片段；面板会并排展示相邻两个月份，并在开始日期与结束日期之间补齐连续底色。选择完成后触发 `onChange`，`event.detail.value` 仍以逗号分隔。

```tsx preview
import { DatePicker } from '@ve-design/react';

<section style={{ display: 'grid', placeItems: 'center', padding: 24 }}>
  <div style={{ display: 'grid', gap: 12, width: 'min(100%, 420px)' }}>
    <DatePicker range allowClear value="2026-06-04,2026-07-10" />
    <DatePicker
      range
      allowClear
      value="2026-06-08,2026-06-14"
      placeholder="选择维护窗口"
    />
  </div>
</section>;
```

### 预设时间快捷选择

`shortcuts` 支持 JSON 数组，也支持 `Label:start,end;Label:value` 的紧凑写法。除固定日期外，也支持 `today`、`yesterday`、`tomorrow` 以及 `-7d`、`-1m`、`+1w` 这类相对日期表达式。当前值命中某个快捷项时，该快捷项会保持选中高亮；超长快捷项会单行省略，并通过原生 `title` 展示完整文案。

```tsx preview
import { DatePicker } from '@ve-design/react';

<section style={{ display: 'grid', placeItems: 'center', padding: 24 }}>
  <div style={{ display: 'grid', gap: 12, width: 'min(100%, 420px)' }}>
    <DatePicker
      value="yesterday"
      shortcutPlacement="left"
      shortcuts="昨天:yesterday;7天前:-7d;30天前:-30d;60天前:-60d;90天前:-90d"
      placeholder="从快捷项选择"
    />
    <DatePicker
      allowClear
      value="yesterday"
      shortcutPlacement="left"
      shortcuts="Yesterday:yesterday;7 days ago:-7d;30 days ago:-30d;60 days ago:-60d;90 days ago:-90d"
      placeholder="从快捷项选择"
    />
  </div>
</section>;
```

### 定制预设范围位置

`shortcutPlacement="left"` 可把预设项放到面板左侧，适合大量预设范围，行为对应 Arco Design 的 `shortcutsPlacementLeft`。

```tsx preview
import { DatePicker } from '@ve-design/react';

<section style={{ display: 'grid', placeItems: 'center', padding: 24 }}>
  <div style={{ display: 'grid', gap: 12, width: 'min(100%, 420px)' }}>
    <DatePicker
      range
      allowClear
      shortcutPlacement="left"
      shortcuts='[{"label":"上半月","value":"2026-06-01","endValue":"2026-06-15"},{"label":"下半月","value":"2026-06-16","endValue":"2026-06-30"}]'
      placeholder="选择六月窗口"
    />
  </div>
</section>;
```

### 动态控制选取范围

`pickerValue` 可控制当前面板展示的年月，`defaultPickerValue` 设置初始面板年月。结合 `min`、`max` 和 `disabledDate` 可以动态控制可选范围。

```tsx preview
import { DatePicker } from '@ve-design/react';

<section style={{ display: 'grid', placeItems: 'center', padding: 24 }}>
  <div style={{ display: 'grid', gap: 12, width: 'min(100%, 420px)' }}>
    <DatePicker
      pickerValue="2026-09-01"
      min="2026-09-01"
      max="2026-12-31"
      disabledDate="dates:2026-10-01,2026-10-02;after:2026-12-20"
      placeholder="选择上线日期"
    />
  </div>
</section>;
```

### 尺寸和状态

`size` 控制触发器尺寸，`status` 与 `description` 用于展示校验反馈。状态反馈会使用对应的 warning/error 语义 token，并保持 active/focus 阴影与状态一致。

```tsx preview
import { DatePicker } from '@ve-design/react';

<section style={{ display: 'grid', placeItems: 'center', padding: 24 }}>
  <div style={{ display: 'grid', gap: 12, width: 'min(100%, 360px)' }}>
    <DatePicker size="small" placeholder="小尺寸" />
    <DatePicker size="default" placeholder="默认尺寸" />
    <DatePicker size="large" placeholder="大尺寸" />
    <DatePicker
      status="warning"
      description="该日期接近发布冻结期。"
      value="2026-06-28"
    />
    <DatePicker
      status="error"
      description="请选择截止日期。"
      placeholder="必填日期"
    />
  </div>
</section>;
```

### 清空、禁用和加载

`allowClear` 允许清空当前日期，清空按钮仅在触发器 hover 时替换日历图标；`disabled` 禁用组件，`loading` 展示异步加载状态。

```tsx preview
import { DatePicker } from '@ve-design/react';

<section style={{ display: 'grid', placeItems: 'center', padding: 24 }}>
  <div style={{ display: 'grid', gap: 12, width: 'min(100%, 360px)' }}>
    <DatePicker allowClear value="2026-06-11" />
    <DatePicker disabled value="2026-06-12" />
    <DatePicker loading placeholder="正在加载工作区日历" />
  </div>
</section>;
```

### 内置标签和前缀

`label` 渲染内置标签段，`prefix` 可扩展触发器前缀内容。内置标签仅作为说明文本，不提供独立 hover 或点击反馈。

```tsx preview
import { DatePicker } from '@ve-design/react';
import { IconHistory } from '@ve-design/react/icons';

<section style={{ display: 'grid', placeItems: 'center', padding: 24 }}>
  <div style={{ display: 'grid', gap: 12, width: 'min(100%, 360px)' }}>
    <DatePicker label="截止日期" value="2026-06-11" />
    <DatePicker
      placeholder="选择报告日期"
      prefix={<IconHistory />}
    />
  </div>
</section>;
```

### 受控展开

`open` 可控制日历面板的展开状态，`show()` 和 `hide()` 可通过 ref 方法打开或关闭面板。

```tsx preview
import { useRef, type ComponentRef } from 'react';
import { Button, DatePicker } from '@ve-design/react';

function DatePickerControlledDemo() {
  const pickerRef = useRef<ComponentRef<typeof DatePicker> | null>(null);

  return (
    <section style={{ display: 'grid', placeItems: 'center', padding: 24 }}>
      <div style={{ display: 'grid', gap: 12, width: 'min(100%, 420px)' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
          <Button onClick={() => pickerRef.current?.show()}>打开</Button>
          <Button type="outline" onClick={() => pickerRef.current?.hide()}>
            关闭
          </Button>
        </div>
        <DatePicker ref={pickerRef} placeholder="选择交接日期" />
      </div>
    </section>
  );
}
```

### 事件

`onChange` 在提交新日期时触发，`onClear` 在清空时触发，`onVisibleChange` 在面板展开状态变化时触发。

```tsx preview
import { useState } from 'react';
import { DatePicker } from '@ve-design/react';

function DatePickerEventDemo() {
  const [log, setLog] = useState('等待日期变化');

  return (
    <section style={{ display: 'grid', placeItems: 'center', padding: 24 }}>
      <div style={{ display: 'grid', gap: 12, width: 'min(100%, 420px)' }}>
        <DatePicker
          allowClear
          value="2026-06-11"
          onChange={(event) => {
            setLog(`已选择：${event.detail.value}`);
          }}
          onClear={() => {
            setLog('已清空日期');
          }}
          onVisibleChange={(event) => {
            if (event.detail.open) {
              setLog('日历已打开');
            }
          }}
        />
        <code>{log}</code>
      </div>
    </section>
  );
}
```

## API

### DatePicker Props

| 属性名                  | 描述                                                  | 类型                                | 默认值       |
| ----------------------- | ----------------------------------------------------- | ----------------------------------- | ------------ |
| `value`                 | 当前日期值。                                          | `string`                            | `''`         |
| `defaultValue`          | 初始日期值。                                          | `string`                            | `''`         |
| `placeholder`           | 未选择时的提示文本。                                  | `string`                            | `'选择日期'` |
| `label`                 | 内置标签段文本。                                      | `string`                            | `''`         |
| `description`           | 触发器下方说明文本，颜色跟随 `status`。               | `string`                            | `''`         |
| `format`                | 日期展示和提交格式，未设置时默认使用 `YYYY-MM-DD`。   | `string`                            | `''`         |
| `size`                  | 触发器尺寸。                                          | `'small' \| 'default' \| 'large'`   | `'default'`  |
| `status`                | 状态样式。                                            | `'default' \| 'warning' \| 'error'` | `'default'`  |
| `disabled`              | 是否禁用。                                            | `boolean`                           | `false`      |
| `loading`               | 是否展示加载状态。                                    | `boolean`                           | `false`      |
| `allowClear`            | 是否允许清空当前日期。                                | `boolean`                           | `false`      |
| `open`                  | 当前日历面板是否打开。                                | `boolean`                           | `false`      |
| `range`                 | 是否选择开始/结束范围，`value` 使用逗号分隔。         | `boolean`                           | `false`      |
| `min`                   | 最小可选日期；格式需与 `format` 兼容。                | `string`                            | `''`         |
| `max`                   | 最大可选日期；格式需与 `format` 兼容。                | `string`                            | `''`         |
| `disabledDate`          | 不可选日期规则，支持 `before`、`after`、`dates`。     | `string`                            | `''`         |
| `shortcuts`             | 预设快捷项，支持 JSON、紧凑字符串以及相对日期表达式。 | `string`                            | `''`         |
| `shortcutPlacement`     | 预设快捷项位置。                                      | `'bottom' \| 'left'`                | `'bottom'`   |
| `defaultPickerValue`    | 初始面板展示日期。                                    | `string`                            | `''`         |
| `pickerValue`           | 受控面板展示日期。                                    | `string`                            | `''`         |
| `separator`             | 范围值在触发器中的展示分隔符。                        | `string`                            | `' - '`      |
| `popupMatchSelectWidth` | 日历面板宽度是否匹配触发器宽度。                      | `boolean`                           | `false`      |
| `prefix`                | 触发器前缀内容。                                      | `React.ReactNode`                   | -            |
| `onChange`              | 当前日期值变化并提交时触发。                          | `(event: CustomEvent) => void`      | -            |
| `onClear`               | 当前日期被清空时触发。                                | `(event: CustomEvent) => void`      | -            |
| `onVisibleChange`       | 日历面板可见状态变化时触发。                          | `(event: CustomEvent) => void`      | -            |
