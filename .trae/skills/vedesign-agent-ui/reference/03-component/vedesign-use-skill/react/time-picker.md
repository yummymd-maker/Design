`TimePicker` 用于选择或输入一天内的具体时间，默认精确到分钟，支持 24 小时制、手动输入、秒选择、步长、范围限制、时间范围、清空、禁用、状态说明和受控展开。

## 何时使用

- 在表单、筛选器或计划任务配置中选择具体执行时间。
- 需要用户直接输入时间，也需要通过下拉面板辅助选择时间。
- 需要约束可选时间范围，例如只允许选择工作时段、发布窗口或巡检时间。
- 需要选择开始和结束时间，表达一天内的任务执行窗口。
- 需要在 Agent 调度、任务提醒、自动化执行窗口等场景中表达一天内的时间点。

## 引入组件

```tsx
import { TimePicker } from '@ve-design/react';
```

## 示例

### 基础用法

使用 `value`、`defaultValue` 和 `placeholder` 控制时间选择器的展示内容。默认格式为 `HH:mm`，可直接在输入框中手动输入时间。

```tsx preview
import { TimePicker } from '@ve-design/react';

<section style={{ display: 'grid', placeItems: 'center', padding: 24 }}>
  <div style={{ display: 'grid', gap: 12, width: 'min(100%, 460px)' }}>
    <TimePicker value="09:30" />
    <TimePicker defaultValue="18:45" />
    <TimePicker placeholder="请选择执行时间" />
  </div>
</section>;
```

### 手动输入

输入合法时间后按 Enter 或失焦会提交新值；无法解析的输入会回退到当前有效值。

```tsx preview
import { useState } from 'react';
import { TimePicker } from '@ve-design/react';

function TimePickerManualDemo() {
  const [log, setLog] = useState('请输入 09:30 这样的时间');

  return (
    <section style={{ display: 'grid', placeItems: 'center', padding: 24 }}>
      <div style={{ display: 'grid', gap: 12, width: 'min(100%, 360px)' }}>
        <TimePicker
          allowClear
          placeholder="输入或选择时间"
          onChange={(event) => {
            setLog(`当前时间：${event.detail.value}`);
          }}
        />
        <code>{log}</code>
      </div>
    </section>
  );
}
```

### 格式

`format` 控制展示和提交的时间格式。默认使用 `HH:mm`，如确有秒级选择场景，可以设置为 `HH:mm:ss` 展示秒列。

```tsx preview
import { TimePicker } from '@ve-design/react';

<section style={{ display: 'grid', placeItems: 'center', padding: 24 }}>
  <div style={{ display: 'grid', gap: 12, width: 'min(100%, 360px)' }}>
    <TimePicker value="10:15" />
    <TimePicker format="HH:mm:ss" value="10:15:30" />
  </div>
</section>;
```

### 步长

`hourStep`、`minuteStep` 和 `secondStep` 控制每列可选项的间隔。

```tsx preview
import { TimePicker } from '@ve-design/react';

<section style={{ display: 'grid', placeItems: 'center', padding: 24 }}>
  <div style={{ display: 'grid', gap: 12, width: 'min(100%, 360px)' }}>
    <TimePicker value="08:30" hourStep={2} minuteStep={15} />
    <TimePicker
      format="HH:mm:ss"
      value="10:15:30"
      minuteStep={15}
      secondStep={30}
    />
  </div>
</section>;
```

### 范围限制

`min` 和 `max` 限制可选时间范围。超出范围的时间项不可选。

```tsx preview
import { TimePicker } from '@ve-design/react';

<section style={{ display: 'grid', placeItems: 'center', padding: 24 }}>
  <div style={{ display: 'grid', gap: 12, width: 'min(100%, 360px)' }}>
    <TimePicker
      min="09:00"
      max="18:00"
      value="14:30"
      placeholder="仅限工作时间"
    />
    <TimePicker
      min="20:00"
      max="23:30"
      placeholder="选择发布窗口"
    />
  </div>
</section>;
```

### 范围选择器

设置 `range` 后可选择开始和结束时间，`value` 和 `defaultValue` 使用逗号分隔两个时间值。范围面板使用单组时间列，默认先设置开始时间，完成后自动切换到结束时间，也可以点击触发器中的开始/结束片段切换当前编辑端。

```tsx preview
import { TimePicker } from '@ve-design/react';

<section style={{ display: 'grid', placeItems: 'center', padding: 24 }}>
  <div style={{ display: 'grid', gap: 12, width: 'min(100%, 420px)' }}>
    <TimePicker range allowClear value="09:00,18:30" />
    <TimePicker
      range
      defaultValue="10:00,12:30"
      minuteStep={15}
      placeholder="选择时间范围"
    />
  </div>
</section>;
```

### 尺寸和状态

`size` 控制触发器尺寸，`status` 与 `description` 用于展示校验反馈。

```tsx preview
import { TimePicker } from '@ve-design/react';

<section style={{ display: 'grid', placeItems: 'center', padding: 24 }}>
  <div style={{ display: 'grid', gap: 12, width: 'min(100%, 360px)' }}>
    <TimePicker size="small" placeholder="小尺寸" />
    <TimePicker size="default" placeholder="默认尺寸" />
    <TimePicker size="large" placeholder="大尺寸" />
    <TimePicker
      status="warning"
      description="冻结窗口冲突，请调整时间。"
      width="320"
      value="23:30"
    />
    <TimePicker
      status="error"
      description="请选择时间。"
      placeholder="必填时间"
      width="220"
    />
  </div>
</section>;
```

### 清空和禁用

`allowClear` 允许清空当前时间，清空按钮会在 hover 或展开时出现；`disabled` 禁用组件，`loading` 展示异步加载状态。

```tsx preview
import { TimePicker } from '@ve-design/react';

<section style={{ display: 'grid', placeItems: 'center', padding: 24 }}>
  <div style={{ display: 'grid', gap: 12, width: 'min(100%, 360px)' }}>
    <TimePicker allowClear value="07:00" />
    <TimePicker disabled value="12:00" />
    <TimePicker loading placeholder="正在加载排期策略" />
  </div>
</section>;
```

### 自定义宽度

默认宽度适合常见分钟格式。可以通过 `width` 按业务场景调整单时间、范围选择器和说明文案宽度。

```tsx preview
import { TimePicker } from '@ve-design/react';

<section style={{ display: 'grid', placeItems: 'center', padding: 24 }}>
  <div style={{ display: 'grid', gap: 12, width: 'min(100%, 620px)' }}>
    <TimePicker width="280" placeholder="选择较长的执行时间" />
    <TimePicker
      status="warning"
      description="冻结窗口冲突，请选择其他执行时间。"
      width="420"
      value="23:30"
    />
    <TimePicker range width="360" value="09:00,18:30" />
  </div>
</section>;
```

### 内置标签和前缀

`label` 渲染内置标签段，`prefix` 可扩展触发器前缀内容。

```tsx preview
import { TimePicker } from '@ve-design/react';
import { IconHistory } from '@ve-design/react/icons';

<section style={{ display: 'grid', placeItems: 'center', padding: 24 }}>
  <div style={{ display: 'grid', gap: 12, width: 'min(100%, 520px)' }}>
    <TimePicker label="执行时间" value="09:00" width="320" />
    <TimePicker
      placeholder="选择交接时间"
      width="320"
      prefix={<IconHistory />}
    />
  </div>
</section>;
```

### 事件

`onChange` 在提交新时间时触发，`onClear` 在清空时触发，`onVisibleChange` 在面板展开状态变化时触发。

```tsx preview
import { useState } from 'react';
import { TimePicker } from '@ve-design/react';

function TimePickerEventDemo() {
  const [log, setLog] = useState('等待时间变化');

  return (
    <section style={{ display: 'grid', placeItems: 'center', padding: 24 }}>
      <div style={{ display: 'grid', gap: 12, width: 'min(100%, 420px)' }}>
        <TimePicker
          allowClear
          value="10:00"
          onChange={(event) => {
            setLog(`已选择：${event.detail.value}`);
          }}
          onClear={() => {
            setLog('已清空时间');
          }}
          onVisibleChange={(event) => {
            if (event.detail.open) {
              setLog('面板已打开');
            }
          }}
        />
        <code>{log}</code>
      </div>
    </section>
  );
}
```

### 方法

`show()` 和 `hide()` 控制选择面板，`focus()` 和 `blur()` 控制触发器焦点。

```tsx preview
import { useRef, type ComponentRef } from 'react';
import { Button, TimePicker } from '@ve-design/react';

function TimePickerMethodDemo() {
  const pickerRef = useRef<ComponentRef<typeof TimePicker> | null>(null);

  return (
    <section style={{ display: 'grid', placeItems: 'center', padding: 24 }}>
      <div style={{ display: 'grid', gap: 12, width: 'min(100%, 420px)' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
          <Button onClick={() => pickerRef.current?.show()}>打开</Button>
          <Button type="outline" onClick={() => pickerRef.current?.hide()}>
            关闭
          </Button>
        </div>
        <TimePicker ref={pickerRef} placeholder="选择备用执行时间" />
      </div>
    </section>
  );
}
```

## API

### TimePicker Props

| 属性名                  | 描述                                                     | 类型                                | 默认值          |
| ----------------------- | -------------------------------------------------------- | ----------------------------------- | --------------- |
| `value`                 | 当前时间值。                                             | `string`                            | `''`            |
| `defaultValue`          | 初始时间值。                                             | `string`                            | `''`            |
| `placeholder`           | 未选择时的提示文本。                                     | `string`                            | `'选择时间'`    |
| `label`                 | 内置标签段文本。                                         | `string`                            | `''`            |
| `description`           | 触发器下方说明文本，颜色跟随 `status`。                  | `string`                            | `''`            |
| `width`                 | 触发器宽度，纯数字字符串按 px 处理。                     | `string`                            | `''`            |
| `format`                | 时间展示和提交格式。                                     | `'HH:mm:ss' \| 'HH:mm'`             | `'HH:mm'`       |
| `size`                  | 触发器尺寸。                                             | `'small' \| 'default' \| 'large'`   | `'default'`     |
| `status`                | 状态样式。                                               | `'default' \| 'warning' \| 'error'` | `'default'`     |
| `disabled`              | 是否禁用。                                               | `boolean`                           | `false`         |
| `range`                 | 是否启用开始/结束时间范围选择。                          | `boolean`                           | `false`         |
| `loading`               | 是否展示加载状态。                                       | `boolean`                           | `false`         |
| `allowClear`            | 是否允许清空当前时间。                                   | `boolean`                           | `false`         |
| `open`                  | 当前选择面板是否打开。                                   | `boolean`                           | `false`         |
| `hourStep`              | 小时列步长。                                             | `number`                            | `1`             |
| `minuteStep`            | 分钟列步长。                                             | `number`                            | `1`             |
| `secondStep`            | 秒列步长。                                               | `number`                            | `1`             |
| `min`                   | 最小可选时间；格式需与 `format` 兼容。                   | `string`                            | `''`            |
| `max`                   | 最大可选时间；格式需与 `format` 兼容。                   | `string`                            | `''`            |
| `popupMatchSelectWidth` | 选择面板宽度是否匹配触发器宽度，默认按时间列内容自适应。 | `boolean`                           | `false`         |
| `prefix`                | 触发器前缀内容。                                         | `React.ReactNode`                   | -               |
| `onChange`              | 当前时间值变化并提交时触发。                             | `(event: CustomEvent) => void`      | -               |
| `onClear`               | 当前时间被清空时触发。                                   | `(event: CustomEvent) => void`      | -               |
| `onVisibleChange`       | 选择面板可见状态变化时触发。                             | `(event: CustomEvent) => void`      | -               |
