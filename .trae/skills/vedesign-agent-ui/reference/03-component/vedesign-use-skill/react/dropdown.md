`Dropdown` 用于在触发节点旁展示操作菜单，支持普通命令、单选、多选、开关项和多级菜单。使用 `triggerNode` 传入触发节点，使用 `children` 传入菜单内容。

## 何时使用

- 需要收纳一组上下文操作或工具命令。
- 需要在菜单内完成单选、多选或开关配置。
- 需要通过子级菜单组织层级较深的操作。

## 引入组件

```tsx
import {
  Button,
  Dropdown,
  DropdownDivider,
  DropdownGroup,
  DropdownItem,
  DropdownSubItem,
} from '@ve-design/react';
```

## 示例

### 基础用法

使用 `children` 声明菜单内容，使用 `triggerNode` 声明触发节点。

```tsx preview
import {
  Button,
  Dropdown,
  DropdownDivider,
  DropdownItem,
} from '@ve-design/react';

<section
  style={{ display: 'grid', placeItems: 'center', minHeight: 168, padding: 32 }}
>
  <Dropdown
    trigger="click"
    triggerNode={<Button type="primary">Run actions</Button>}
  >
    <DropdownItem value="rerun">Rerun agent</DropdownItem>
    <DropdownItem value="trace">Open trace</DropdownItem>
    <DropdownItem value="logs">View execution logs</DropdownItem>
    <DropdownDivider />
    <DropdownItem value="cancel" danger>
      Cancel run
    </DropdownItem>
  </Dropdown>
</section>;
```

### 选择模式

`selection="single"` 管理单选值，`selection="multiple"` 管理数组值。

```tsx preview
import { Button, Dropdown, DropdownItem } from '@ve-design/react';

<section
  style={{
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    minHeight: 168,
    padding: 32,
  }}
>
  <Dropdown
    trigger="click"
    selection="single"
    value="balanced"
    triggerNode={<Button type="secondary">Row density</Button>}
  >
    <DropdownItem value="compact">Compact</DropdownItem>
    <DropdownItem value="balanced">Balanced</DropdownItem>
    <DropdownItem value="spacious">Spacious</DropdownItem>
  </Dropdown>

  <Dropdown
    trigger="click"
    selection="multiple"
    value={['cost', 'latency']}
    triggerNode={<Button type="outline">Visible columns</Button>}
  >
    <DropdownItem value="cost">Cost</DropdownItem>
    <DropdownItem value="latency">Latency</DropdownItem>
    <DropdownItem value="tokens">Token usage</DropdownItem>
    <DropdownItem value="owner">Owner</DropdownItem>
  </Dropdown>
</section>;
```

### 自定义内容

`DropdownItem` 只提供 `children`，图标、描述、快捷键或尾部内容可在 `children` 中组合。

```tsx preview
import { Button, Dropdown, DropdownItem } from '@ve-design/react';
import { IconPieChart01 } from '@ve-design/react/icons';

<section
  style={{ display: 'grid', placeItems: 'center', minHeight: 188, padding: 32 }}
>
  <Dropdown
    trigger="click"
    triggerNode={<Button type="secondary">Model routing</Button>}
  >
    <DropdownItem value="auto">
      <span style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
        <IconPieChart01 style={{ marginTop: 3 }} />
        <span style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <span>Auto route</span>
          <span style={{ color: 'var(--color-text-tertiary)', fontSize: 12, lineHeight: '18px' }}>
            Let the agent choose the best model.
          </span>
        </span>
      </span>
    </DropdownItem>
    <DropdownItem value="fast">
      <span style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <span>Fast mode</span>
        <span style={{ color: 'var(--color-text-tertiary)', fontSize: 12, lineHeight: '18px' }}>
          Prefer low latency for short tasks.
        </span>
      </span>
    </DropdownItem>
    <DropdownItem value="deep">
      <span
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 24,
        }}
      >
        <span>Deep analysis</span>
        <kbd style={{ color: 'var(--color-text-tertiary)', font: 'inherit' }}>⌘D</kbd>
      </span>
    </DropdownItem>
  </Dropdown>
</section>;
```

### 分组与开关

使用 `DropdownGroup` 和 `DropdownDivider` 组织菜单区域；开关项可使用 `selection="switch"`。

```tsx preview
import {
  Button,
  Dropdown,
  DropdownDivider,
  DropdownGroup,
  DropdownItem,
} from '@ve-design/react';

<section
  style={{ display: 'grid', placeItems: 'center', minHeight: 188, padding: 32 }}
>
  <Dropdown
    trigger="click"
    triggerNode={<Button type="secondary">Workspace</Button>}
  >
    <DropdownGroup title="Build">
      <DropdownItem value="new-build">New build</DropdownItem>
      <DropdownItem value="duplicate">Duplicate workflow</DropdownItem>
      <DropdownItem value="validate">Validate pipeline</DropdownItem>
    </DropdownGroup>
    <DropdownDivider />
    <DropdownGroup title="Settings">
      <DropdownItem value="notifications" selection="switch" selected>
        Notifications
      </DropdownItem>
      <DropdownItem value="auto-save" selection="switch">
        Auto save
      </DropdownItem>
    </DropdownGroup>
  </Dropdown>
</section>;
```

### 子级菜单

使用 `DropdownSubItem` 声明子级菜单，`label` 可传入文本或 React 节点作为触发项内容；子菜单中的选项仍然可以使用 `selection="checkbox"` 或 `selection="check"` 展示多选和单选状态。

```tsx preview
import { useState } from 'react';
import {
  Button,
  Dropdown,
  DropdownDivider,
  DropdownGroup,
  DropdownItem,
  DropdownSubItem,
} from '@ve-design/react';
import {
  IconBell,
  IconCommand,
  IconDatabase,
  IconDocument,
  IconFace,
  IconFile,
  IconFileCheck,
  IconFolder,
  IconGlobe,
  IconGrid,
  IconHistory,
  IconInfo,
  IconKey,
  IconLogOut,
  IconMail,
  IconPreview,
  IconSettings,
  IconUser,
} from '@ve-design/react/icons';

function DropdownSubmenuDemo() {
  const [theme, setTheme] = useState('theme-system');
  const rowStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 24,
    width: '100%',
    minWidth: 0,
  } as const;
  const labelStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 10,
    minWidth: 0,
  } as const;
  const textStyle = {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  } as const;
  const shortcutStyle = {
    flex: 'none',
    color: 'var(--color-text-tertiary)',
    font: 'inherit',
  } as const;

  return (
    <section
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        minHeight: 320,
        padding: '88px 72px',
        overflow: 'visible',
      }}
    >
      <Dropdown
        trigger="click"
        style={{ position: 'relative', insetInlineEnd: 96 }}
        triggerNode={<Button type="secondary">Complex Menu</Button>}
        onSelect={(event) => {
          const { value } = event.detail;

          if (typeof value === 'string' && value.startsWith('theme-')) {
            setTheme(value);
          }
        }}
      >
        <DropdownGroup title="File">
          <DropdownItem value="new-file">
            <span style={rowStyle}>
              <span style={labelStyle}>
                <IconFile />
                <span style={textStyle}>New File</span>
              </span>
              <kbd style={shortcutStyle}>⌘N</kbd>
            </span>
          </DropdownItem>
          <DropdownItem value="new-folder">
            <span style={rowStyle}>
              <span style={labelStyle}>
                <IconFolder />
                <span style={textStyle}>New Folder</span>
              </span>
              <kbd style={shortcutStyle}>⇧⌘N</kbd>
            </span>
          </DropdownItem>
          <DropdownSubItem
            label={
              <span style={rowStyle}>
                <span style={labelStyle}>
                  <IconHistory />
                  <span style={textStyle}>Open Recent</span>
                </span>
              </span>
            }
          >
            <DropdownItem value="recent-draft" selection="checkbox" selected>
              <span style={labelStyle}>
                <IconDocument />
                <span style={textStyle}>Agent run draft</span>
              </span>
            </DropdownItem>
            <DropdownItem value="recent-report" selection="checkbox" selected>
              <span style={labelStyle}>
                <IconFileCheck />
                <span style={textStyle}>Evaluation report</span>
              </span>
            </DropdownItem>
            <DropdownItem value="recent-trace" selection="checkbox">
              <span style={labelStyle}>
                <IconDatabase />
                <span style={textStyle}>Trace snapshot</span>
              </span>
            </DropdownItem>
          </DropdownSubItem>
        </DropdownGroup>

        <DropdownDivider />

        <DropdownGroup title="View">
          <DropdownItem value="show-sidebar">
            <span style={labelStyle}>
              <IconPreview />
              <span style={textStyle}>Show Sidebar</span>
            </span>
          </DropdownItem>
          <DropdownItem value="show-status-bar">
            <span style={labelStyle}>
              <IconGrid />
              <span style={textStyle}>Show Status Bar</span>
            </span>
          </DropdownItem>
          <DropdownSubItem
            label={
              <span style={rowStyle}>
                <span style={labelStyle}>
                  <IconFace />
                  <span style={textStyle}>Theme</span>
                </span>
              </span>
            }
          >
            <DropdownItem
              value="theme-system"
              selection="check"
              selected={theme === 'theme-system'}
            >
              System
            </DropdownItem>
            <DropdownItem
              value="theme-light"
              selection="check"
              selected={theme === 'theme-light'}
            >
              Light
            </DropdownItem>
            <DropdownItem
              value="theme-dark"
              selection="check"
              selected={theme === 'theme-dark'}
            >
              Dark
            </DropdownItem>
          </DropdownSubItem>
        </DropdownGroup>

        <DropdownDivider />

        <DropdownGroup title="Account">
          <DropdownItem value="profile">
            <span style={rowStyle}>
              <span style={labelStyle}>
                <IconUser />
                <span style={textStyle}>Profile</span>
              </span>
              <kbd style={shortcutStyle}>⇧⌘P</kbd>
            </span>
          </DropdownItem>
          <DropdownItem value="billing">
            <span style={labelStyle}>
              <IconDatabase />
              <span style={textStyle}>Billing</span>
            </span>
          </DropdownItem>
          <DropdownSubItem
            label={
              <span style={rowStyle}>
                <span style={labelStyle}>
                  <IconSettings />
                  <span style={textStyle}>Settings</span>
                </span>
              </span>
            }
          >
            <DropdownGroup title="Preferences">
              <DropdownItem value="shortcuts">
                <span style={labelStyle}>
                  <IconCommand />
                  <span style={textStyle}>Keyboard Shortcuts</span>
                </span>
              </DropdownItem>
              <DropdownItem value="language">
                <span style={labelStyle}>
                  <IconGlobe />
                  <span style={textStyle}>Language</span>
                </span>
              </DropdownItem>
              <DropdownSubItem
                label={
                  <span style={rowStyle}>
                    <span style={labelStyle}>
                      <IconBell />
                      <span style={textStyle}>Notifications</span>
                    </span>
                  </span>
                }
              >
                <DropdownGroup title="Notification Types">
                  <DropdownItem value="push-notifications">
                    <span style={labelStyle}>
                      <IconBell />
                      <span style={textStyle}>Push Notifications</span>
                    </span>
                  </DropdownItem>
                  <DropdownItem value="email-notifications">
                    <span style={labelStyle}>
                      <IconMail />
                      <span style={textStyle}>Email Notifications</span>
                    </span>
                  </DropdownItem>
                </DropdownGroup>
              </DropdownSubItem>
              <DropdownItem value="privacy-security">
                <span style={labelStyle}>
                  <IconKey />
                  <span style={textStyle}>Privacy & Security</span>
                </span>
              </DropdownItem>
            </DropdownGroup>
          </DropdownSubItem>
          <DropdownItem value="help">
            <span style={labelStyle}>
              <IconInfo />
              <span style={textStyle}>Help & Support</span>
            </span>
          </DropdownItem>
          <DropdownItem value="documentation">
            <span style={labelStyle}>
              <IconDocument />
              <span style={textStyle}>Documentation</span>
            </span>
          </DropdownItem>
        </DropdownGroup>

        <DropdownDivider />

        <DropdownItem value="sign-out" danger>
          <span style={rowStyle}>
            <span style={labelStyle}>
              <IconLogOut />
              <span style={textStyle}>Sign Out</span>
            </span>
            <kbd style={shortcutStyle}>⇧⌘Q</kbd>
          </span>
        </DropdownItem>
      </Dropdown>
    </section>
  );
}
```

### 触发方式

`trigger` 支持 `hover`、`click` 和 `contextmenu`；`position` 设置菜单优先展示位置。

```tsx preview
import { Button, Dropdown, DropdownItem } from '@ve-design/react';

<section
  style={{
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    minHeight: 168,
    padding: 32,
  }}
>
  <Dropdown
    trigger="hover"
    delay={120}
    triggerNode={<Button type="secondary">Hover</Button>}
  >
    <DropdownItem value="preview">Preview prompt</DropdownItem>
    <DropdownItem value="copy">Copy item ID</DropdownItem>
  </Dropdown>

  <Dropdown
    trigger="click"
    position="right-start"
    triggerNode={<Button type="outline">Right start</Button>}
  >
    <DropdownItem value="open">Open details</DropdownItem>
    <DropdownItem value="metrics">Open metrics panel</DropdownItem>
  </Dropdown>

  <Dropdown
    trigger="contextmenu"
    triggerNode={<Button type="outline">Right click</Button>}
  >
    <DropdownItem value="inspect">View details</DropdownItem>
    <DropdownItem value="copy-request-id">Copy request ID</DropdownItem>
  </Dropdown>
</section>;
```

### 事件

用户激活菜单项时触发 `onSelect`；根组件选中值变化时触发 `onChange`。

```tsx preview
import { useState } from 'react';
import { Button, Dropdown, DropdownItem } from '@ve-design/react';

function DropdownEventDemo() {
  const [message, setMessage] = useState('Waiting for selection.');

  return (
    <section
      style={{
        display: 'grid',
        placeItems: 'center',
        gap: 12,
        minHeight: 188,
        padding: 32,
      }}
    >
      <Dropdown
        trigger="click"
        selection="single"
        triggerNode={<Button type="secondary">Choose model</Button>}
        onSelect={(event) => {
          const { value } = event.detail;

          if (typeof value === 'string') {
            setMessage(value === '' ? 'onSelect: ' : `onSelect: ${value}`);
            return;
          }

          if (Array.isArray(value)) {
            setMessage(
              value.length === 0 ? 'onSelect: ' : `onSelect: ${value.join(', ')}`,
            );
          }
        }}
        onChange={(event) => {
          const { value } = event.detail;

          if (typeof value === 'string') {
            setMessage(value === '' ? 'onChange: ' : `onChange: ${value}`);
            return;
          }

          if (Array.isArray(value)) {
            setMessage(
              value.length === 0 ? 'onChange: ' : `onChange: ${value.join(', ')}`,
            );
          }
        }}
      >
        <DropdownItem value="fast">Fast mode</DropdownItem>
        <DropdownItem value="balanced">Balanced mode</DropdownItem>
        <DropdownItem value="deep">Deep analysis</DropdownItem>
      </Dropdown>
      <code style={{ color: 'var(--color-text-secondary)' }}>{message}</code>
    </section>
  );
}
```

## API

### Dropdown Props

| 属性名         | 描述                                         | 类型                                      | 默认值           |
| -------------- | -------------------------------------------- | ----------------------------------------- | ---------------- |
| `position`     | 菜单优先展示位置。                           | `Placement`                               | `'bottom-start'` |
| `trigger`      | 触发方式。                                   | `'hover'` \| `'click'` \| `'contextmenu'` | `'hover'`        |
| `selection`    | 菜单选择模式。                               | `'none'` \| `'single'` \| `'multiple'`    | `'none'`         |
| `value`        | 当前选中值。单选为字符串，多选为字符串数组。 | `string` \| `string[]` \| `''`            | `''`             |
| `defaultValue` | 非受控模式下的初始选中值。                   | `string` \| `string[]` \| `''`            | `''`             |
| `open`         | 当前是否打开；设置为布尔值时进入受控模式。   | `boolean` \| `undefined`                  | `undefined`      |
| `defaultOpen`  | 非受控模式下的初始打开状态。                 | `boolean`                                 | `false`          |
| `disabled`     | 是否禁用下拉菜单。                           | `boolean`                                 | `false`          |
| `block`        | 是否撑满容器宽度。                           | `boolean`                                 | `false`          |
| `delay`        | `trigger="hover"` 时的打开延迟，单位毫秒。   | `number`                                  | `400`            |
| `triggerNode`  | 下拉触发节点，建议传入单个根节点。           | `React.ReactNode`                         | `-`              |
| `children`     | 菜单内容，通常放置菜单项或菜单分组。         | `React.ReactNode`                         | `-`              |

### Dropdown 事件

| 事件名         | 描述                             | 参数类型                                  |
| -------------- | -------------------------------- | ----------------------------------------- |
| `onOpenChange` | 菜单打开状态变化请求发生时触发。 | `CustomEvent<VeDropdownOpenChangeDetail>` |
| `onSelect`     | 菜单项被激活时触发。             | `CustomEvent<VeDropdownSelectDetail>`     |
| `onChange`     | 根组件选中值变化时触发。         | `CustomEvent<VeDropdownChangeDetail>`     |

### Dropdown Ref

可通过 `ref` 调用组件实例上的 `focus(options?: FocusOptions)` 方法。

### DropdownItem Props

| 属性名      | 描述                       | 类型                                                | 默认值   |
| ----------- | -------------------------- | --------------------------------------------------- | -------- |
| `value`     | 菜单项选择后返回的值。     | `string`                                            | `''`     |
| `disabled`  | 是否禁用菜单项。           | `boolean`                                           | `false`  |
| `danger`    | 是否展示危险操作样式。     | `boolean`                                           | `false`  |
| `selected`  | 当前菜单项是否选中。       | `boolean`                                           | `false`  |
| `selection` | 单个菜单项的视觉选择形态。 | `'none'` \| `'check'` \| `'checkbox'` \| `'switch'` | `'none'` |
| `children`  | 菜单项内容。               | `React.ReactNode`                                   | `-`      |

### DropdownItem 事件

| 事件名     | 描述                     | 参数类型                                  |
| ---------- | ------------------------ | ----------------------------------------- |
| `onSelect` | 当前菜单项被激活时触发。 | `CustomEvent<VeDropdownItemSelectDetail>` |

### DropdownItem Ref

可通过 `ref` 调用组件实例上的 `focus(options?: FocusOptions)` 方法。

### DropdownGroup Props

| 属性名     | 描述           | 类型              | 默认值 |
| ---------- | -------------- | ----------------- | ------ |
| `title`    | 分组标题。     | `string`          | `''`   |
| `children` | 分组内菜单项。 | `React.ReactNode` | `-`    |

### DropdownSubItem Props

| 属性名     | 描述                 | 类型              | 默认值  |
| ---------- | -------------------- | ----------------- | ------- |
| `label`    | 子菜单触发项内容。   | `React.ReactNode` | `''`    |
| `disabled` | 是否禁用子菜单。     | `boolean`         | `false` |
| `open`     | 当前子菜单是否打开。 | `boolean`         | `false` |
| `children` | 子菜单内容。         | `React.ReactNode` | `-`     |

### DropdownSubItem Ref

可通过 `ref` 调用组件实例上的 `focus(options?: FocusOptions)` 方法。

### DropdownDivider Props

`DropdownDivider` 用于分隔菜单区域，无专属 Props。
