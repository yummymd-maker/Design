`Select` 用于从一组选项中选择单个或多个值，`SelectItem` 声明选项，`SelectGroup` 声明选项分组。

## 何时使用

- 在表单、筛选器或配置项中选择枚举值。
- 需要单选或多选，并通过标签展示多选结果。
- 需要分组、禁用选项、清空、加载、状态说明或自定义前缀/空态内容。

## 引入组件

```tsx
import { Select, SelectGroup, SelectItem } from '@ve-design/react';
```

## 示例

### 基础用法

通过 `children` 声明 `SelectItem`。

```tsx preview
import { Select, SelectItem } from '@ve-design/react';
import { IconPieChart01, IconRobot } from '@ve-design/react/icons';

<section style={{ display: 'grid', placeItems: 'center', padding: 24 }}>
  <div style={{ width: 'min(100%, 360px)' }}>
    <Select
      placeholder="Select workspace"
      prefix={<IconRobot style={{ fontSize: 16 }} />}
    >
      <SelectItem value="project-space-a">
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          <IconPieChart01 />
          项目空间 A
        </span>
      </SelectItem>
      <SelectItem value="prompt-lab">
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          <IconPieChart01 />
          项目空间 B
        </span>
      </SelectItem>
      <SelectItem value="knowledge-hub">
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          <IconPieChart01 />
          测试环境
        </span>
      </SelectItem>
      <SelectItem value="eval-center">
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          <IconPieChart01 />
          生产环境
        </span>
      </SelectItem>
    </Select>
  </div>
</section>;
```

### 值和事件

使用 `defaultValue` 设置初始值，使用 `value` 设置当前值；值变化通过 `onChange` 监听。选项较多时，下拉面板超过 `maxHeight`（默认 220px）后会出现滚动。

```tsx preview
import { useState } from 'react';
import { Select, SelectItem } from '@ve-design/react';

function SelectValueDemo() {
  const [value, setValue] = useState('claude-3-5-sonnet');

  return (
    <section style={{ display: 'grid', placeItems: 'center', padding: 24 }}>
      <div style={{ display: 'grid', gap: 12, width: 'min(100%, 360px)' }}>
        <Select defaultValue="gpt-4o">
          <SelectItem value="gpt-4o">GPT-4o</SelectItem>
          <SelectItem value="gpt-4o-mini">GPT-4o mini</SelectItem>
          <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
          <SelectItem value="claude-3-5-sonnet">Model A</SelectItem>
          <SelectItem value="claude-3-opus">Model B</SelectItem>
          <SelectItem value="claude-3-haiku">Model C</SelectItem>
          <SelectItem value="gemini-1-5-pro">Model D</SelectItem>
          <SelectItem value="gemini-1-5-flash">Model E</SelectItem>
          <SelectItem value="llama-3-70b">Llama 3 70B</SelectItem>
          <SelectItem value="mistral-large">Mistral Large</SelectItem>
        </Select>

        <Select
          value={value}
          onChange={(event) => {
            setValue(String(event.detail.value));
          }}
        >
          <SelectItem value="gpt-4o">GPT-4o</SelectItem>
          <SelectItem value="gpt-4o-mini">GPT-4o mini</SelectItem>
          <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
          <SelectItem value="claude-3-5-sonnet">Model A</SelectItem>
          <SelectItem value="claude-3-opus">Model B</SelectItem>
          <SelectItem value="claude-3-haiku">Model C</SelectItem>
          <SelectItem value="gemini-1-5-pro">Model D</SelectItem>
          <SelectItem value="gemini-1-5-flash">Model E</SelectItem>
          <SelectItem value="llama-3-70b">Llama 3 70B</SelectItem>
          <SelectItem value="mistral-large">Mistral Large</SelectItem>
        </Select>
        <code style={{ color: 'var(--color-text-secondary)' }}>
          Selected: {JSON.stringify(value)}
        </code>
      </div>
    </section>
  );
}
```

### 无边框模式

`borderless` 隐藏触发器外层边框，`popupMatchSelectWidth={false}` 让下拉宽度不强制匹配触发器。

```tsx preview
import { Select, SelectItem } from '@ve-design/react';

<section style={{ display: 'grid', placeItems: 'center', padding: 24 }}>
  <div style={{ display: 'grid', gap: 12, width: 'min(100%, 360px)' }}>
    <Select
      borderless
      defaultValue="fast"
      placeholder="选择模式"
      popupMatchSelectWidth={false}
    >
      <SelectItem value="fast">Fast replies</SelectItem>
      <SelectItem value="balanced">Balanced reasoning</SelectItem>
      <SelectItem value="deep">Deep reasoning</SelectItem>
    </Select>

    <Select borderless placeholder="选择模式" popupMatchSelectWidth={false}>
      <SelectItem value="draft">Draft summary</SelectItem>
      <SelectItem value="report">Generate report</SelectItem>
      <SelectItem value="trace">Trace changes</SelectItem>
    </Select>
  </div>
</section>;
```

### 多选

`mode="multiple"` 开启多选，`maxTagCount` 限制可见标签数量；移除已选项时触发 `onRemove`。

```tsx preview
import { useState } from 'react';
import { Select, SelectItem } from '@ve-design/react';

function SelectMultipleDemo() {
  const [value, setValue] = useState(['web-search', 'file-reader', 'memory']);
  const [log, setLog] = useState('Remove a tag to emit onRemove');

  return (
    <section style={{ display: 'grid', placeItems: 'center', padding: 24 }}>
      <div style={{ display: 'grid', gap: 12, width: 'min(100%, 360px)' }}>
        <Select
          mode="multiple"
          value={value}
          maxTagCount={2}
          allowClear
          placeholder="Select capabilities"
          onChange={(event) => {
            setValue(event.detail.value as string[]);
          }}
          onRemove={(event) => {
            setLog(`Removed: ${event.detail.value}`);
          }}
        >
          <SelectItem value="web-search">Web search</SelectItem>
          <SelectItem value="code-runner">Code runner</SelectItem>
          <SelectItem value="file-reader">File reader</SelectItem>
          <SelectItem value="memory">Memory</SelectItem>
          <SelectItem value="handoff">Human handoff</SelectItem>
        </Select>
        <code style={{ color: 'var(--color-text-secondary)' }}>{log}</code>
      </div>
    </section>
  );
}
```

### 清空、加载和禁用

`allowClear` 允许清空，`loading` 展示加载态，`disabled` 禁用组件。

```tsx preview
import { Select, SelectItem } from '@ve-design/react';

<section
  style={{ display: 'grid', placeItems: 'center', padding: '32px 24px' }}
>
  <div style={{ display: 'grid', gap: 28, width: 'min(100%, 1160px)' }}>
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(0, 360px))',
        justifyContent: 'center',
        gap: 16,
      }}
    >
      <Select allowClear value="active" placeholder="Filter sessions">
        <SelectItem value="all">All sessions</SelectItem>
        <SelectItem value="active">Active chats</SelectItem>
        <SelectItem value="archived">Archived chats</SelectItem>
      </Select>

      <Select loading placeholder="Loading presets" />
    </div>

    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(0, 360px))',
        justifyContent: 'center',
        gap: '20px 40px',
      }}
    >
      <Select disabled mode="multiple" value={['menu-1', 'menu-2']}>
        <SelectItem value="menu-1">Option A</SelectItem>
        <SelectItem value="menu-2">Option B</SelectItem>
        <SelectItem value="menu-3">Option C</SelectItem>
      </Select>

      <Select disabled label="Disabled field" placeholder="选择模式">
        <SelectItem value="menu-1">Option A</SelectItem>
        <SelectItem value="menu-2">Option B</SelectItem>
        <SelectItem value="menu-3">Option C</SelectItem>
      </Select>

      <Select disabled label="Disabled field" value="menu-1">
        <SelectItem value="menu-1">菜单选项</SelectItem>
        <SelectItem value="menu-2">Option B</SelectItem>
        <SelectItem value="menu-3">Option C</SelectItem>
      </Select>

      <Select disabled label="Disabled field" mode="multiple" value={['menu-1']}>
        <SelectItem value="menu-1">Option A</SelectItem>
        <SelectItem value="menu-2">Option B</SelectItem>
        <SelectItem value="menu-3">Option C</SelectItem>
      </Select>
    </div>
  </div>
</section>;
```

### 分组和禁用选项

使用 `SelectGroup` 组织选项，`disabled` 禁用选项或分组。

```tsx preview
import { Select, SelectGroup, SelectItem } from '@ve-design/react';

<section style={{ display: 'grid', placeItems: 'center', padding: 24 }}>
  <div style={{ width: 'min(100%, 360px)' }}>
    <Select placeholder="Select deployment target">
      <SelectGroup label="Available">
        <SelectItem value="sandbox">Agent sandbox</SelectItem>
        <SelectItem value="staging">Staging workspace</SelectItem>
      </SelectGroup>
      <SelectGroup label="Locked" disabled>
        <SelectItem value="prod-us">US production</SelectItem>
        <SelectItem value="prod-eu">EU production</SelectItem>
      </SelectGroup>
      <SelectItem value="global" disabled>
        Global production
      </SelectItem>
    </Select>
  </div>
</section>;
```

### 尺寸和状态

`size` 控制尺寸，`status` 展示校验状态。

```tsx preview
import { Select } from '@ve-design/react';

<section style={{ display: 'grid', placeItems: 'center', padding: 24 }}>
  <div style={{ display: 'grid', gap: 12, width: 'min(100%, 360px)' }}>
    <Select size="small" placeholder="Small" />
    <Select size="default" placeholder="Default" />
    <Select size="large" placeholder="Large" />
    <Select
      status="warning"
      description="Review routing capacity before launch"
      placeholder="Review required"
    />
    <Select
      status="error"
      description="Please select a routing model"
      placeholder="Required field"
    />
  </div>
</section>;
```

### 内置标签和说明

`label` 渲染内置标签段，`description` 渲染表单提示文本，并跟随 `status` 使用对应状态色。

```tsx preview
import { Select, SelectItem } from '@ve-design/react';

<section style={{ display: 'grid', placeItems: 'center', padding: 24 }}>
  <div style={{ display: 'grid', gap: 12, width: 'min(100%, 360px)' }}>
    <Select
      label="Agent"
      placeholder="Select agent"
      description="The selected Agent receives delegated tasks."
    >
      <SelectItem value="planner">Planner</SelectItem>
      <SelectItem value="builder">Builder</SelectItem>
      <SelectItem value="reviewer">Reviewer</SelectItem>
    </Select>

    <Select
      description="The selected model receives delegated tasks."
      placeholder="Select model"
    >
      <SelectItem value="fast">Fast reasoning</SelectItem>
      <SelectItem value="deep">Deep reasoning</SelectItem>
    </Select>

    <Select
      status="error"
      description="Please select an owner"
      placeholder="Required owner"
    >
      <SelectItem value="ops">Agent Ops</SelectItem>
      <SelectItem value="frontend">AI Frontend</SelectItem>
    </Select>
  </div>
</section>;
```

### 插槽

通过 `prefix` 传入触发器前缀内容，通过 `empty` 传入自定义空态内容。

```tsx preview
import { Select, SelectItem } from '@ve-design/react';
import { IconFilter } from '@ve-design/react/icons';

<section style={{ display: 'grid', placeItems: 'center', padding: 24 }}>
  <div style={{ width: 'min(100%, 360px)' }}>
    <Select
      label="Owner"
      placeholder="Select owner"
      emptyText="No owner"
      prefix={<IconFilter style={{ fontSize: 16 }} />}
      empty={<div>No owner available</div>}
    >
      <SelectItem value="agent-ops">Agent Ops</SelectItem>
      <SelectItem value="prompt-team">Prompt Team</SelectItem>
      <SelectItem value="frontend-team">AI Chat Frontend</SelectItem>
    </Select>
  </div>
</section>;
```

### 方法

可通过 `ref` 调用 `show()` 和 `hide()` 控制下拉面板。

```tsx preview
import { useRef, type ElementRef } from 'react';
import { Button, Select, SelectItem } from '@ve-design/react';

function SelectMethodDemo() {
  const selectRef = useRef<ElementRef<typeof Select>>(null);

  return (
    <section style={{ display: 'grid', placeItems: 'center', padding: 24 }}>
      <div style={{ display: 'grid', gap: 12, width: 'min(100%, 360px)' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
          <Button onClick={() => selectRef.current?.show()}>Open</Button>
          <Button type="outline" onClick={() => selectRef.current?.hide()}>
            Close
          </Button>
        </div>
        <Select ref={selectRef} placeholder="Select fallback agent">
          <SelectItem value="support">Support Agent</SelectItem>
          <SelectItem value="data">Data Agent</SelectItem>
          <SelectItem value="ops">Ops Agent</SelectItem>
        </Select>
      </div>
    </section>
  );
}
```

## API

### Select Props

| 属性名                  | 描述                                                  | 类型                                             | 默认值            |
| ----------------------- | ----------------------------------------------------- | ------------------------------------------------ | ----------------- |
| `value`                 | 当前选中值；单选为单个值，多选为数组。                | `string \| number \| (string \| number)[] \| ''` | `''`              |
| `defaultValue`          | 初始选中值。                                          | `string \| number \| (string \| number)[] \| ''` | `''`              |
| `placeholder`           | 未选择时的提示文本。                                  | `string`                                         | `'Please select'` |
| `label`                 | 内置标签段文本。                                      | `string`                                         | `''`              |
| `description`           | 触发器下方说明文本，颜色跟随 `status`。               | `string`                                         | `''`              |
| `mode`                  | 选择模式。                                            | `'single' \| 'multiple'`                         | `'single'`        |
| `size`                  | 触发器尺寸。                                          | `'small' \| 'default' \| 'large'`                | `'default'`       |
| `status`                | 状态样式。                                            | `'default' \| 'warning' \| 'error'`              | `'default'`       |
| `borderless`            | 是否隐藏触发器外层边框。                              | `boolean`                                        | `false`           |
| `disabled`              | 是否禁用。                                            | `boolean`                                        | `false`           |
| `loading`               | 是否展示加载状态。                                    | `boolean`                                        | `false`           |
| `allowClear`            | 是否允许清空当前值。                                  | `boolean`                                        | `false`           |
| `open`                  | 当前下拉面板是否打开；设置为布尔值时进入受控模式。    | `boolean \| undefined`                           | `undefined`       |
| `defaultOpen`           | 非受控模式下的初始打开状态。                          | `boolean`                                        | `false`           |
| `maxTagCount`           | 多选模式下最大可见标签数量；也可设置为 `responsive`。 | `number \| 'responsive' \| undefined`            | `undefined`       |
| `popupMatchSelectWidth` | 下拉面板宽度是否匹配触发器宽度。                      | `boolean`                                        | `true`            |
| `maxHeight`             | 下拉面板最大高度（px），超出时选项可滚动。            | `number`                                         | `220`             |
| `emptyText`             | 空状态文本。                                          | `string`                                         | `'No data'`       |
| `prefix`                | 触发器前缀内容。                                      | `React.ReactNode`                                | `-`               |
| `empty`                 | 自定义空状态内容。                                    | `React.ReactNode`                                | `-`               |
| `children`              | 选项声明区域，放置 `SelectItem` 或 `SelectGroup`。    | `React.ReactNode`                                | `-`               |

### Select 事件

| 事件名         | 描述                             | 参数类型                                                                                          |
| -------------- | -------------------------------- | ------------------------------------------------------------------------------------------------- |
| `onChange`     | 选中值变化时触发。               | `CustomEvent<{ value: SelectValue; option: SelectOption \| SelectOption[] \| undefined }>`        |
| `onClear`      | 当前值被清空时触发。             | `CustomEvent<{ value: '' \| [] }>`                                                                |
| `onOpenChange` | 下拉打开状态变化请求发生时触发。 | `CustomEvent<{ open: boolean; reason: 'api' \| 'trigger' \| 'outside' \| 'select' \| 'escape' }>` |
| `onRemove`     | 多选模式下移除某个已选项时触发。 | `CustomEvent<{ value: string \| number; option: SelectOption }>`                                  |

### Select Ref

可通过 `ref` 调用组件实例上的 `focus()`、`blur()`、`show()` 和 `hide()` 方法。

### SelectItem Props

| 属性名     | 描述                     | 类型                            | 默认值      |
| ---------- | ------------------------ | ------------------------------- | ----------- |
| `value`    | 选项值。                 | `string \| number \| undefined` | `undefined` |
| `disabled` | 是否禁用该选项。         | `boolean`                       | `false`     |
| `closable` | 多选标签是否可单独移除。 | `boolean`                       | `true`      |
| `children` | 选项展示内容。           | `React.ReactNode`               | `-`         |

### SelectGroup Props

| 属性名     | 描述                   | 类型              | 默认值  |
| ---------- | ---------------------- | ----------------- | ------- |
| `label`    | 分组标题文本。         | `string`          | `''`    |
| `disabled` | 是否禁用组内全部选项。 | `boolean`         | `false` |
| `children` | 分组选项内容。         | `React.ReactNode` | `-`     |
