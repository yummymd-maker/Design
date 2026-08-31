`ve-dropdown` 用于在触发节点旁展示操作菜单，支持普通命令、单选、多选、开关项和多级菜单。菜单内容使用默认插槽，触发节点使用 `slot="trigger"`。

## 何时使用

- 需要收纳一组上下文操作或工具命令。
- 需要在菜单内完成单选、多选或开关配置。
- 需要通过子级菜单组织层级较深的操作。

## 引入组件

```ts
import '@ve-design/web/ve-dropdown';
```

## 示例

### 基础用法

使用默认插槽声明菜单内容，使用 `trigger` 插槽声明触发节点。

```html preview
<script type="module">
  import '@ve-design/web/ve-button';
  import '@ve-design/web/ve-dropdown';
</script>

<section style="display:grid;place-items:center;min-height:168px;padding:32px;">
  <ve-dropdown trigger="click">
    <ve-button slot="trigger" type="primary">Run actions</ve-button>
    <ve-dropdown-item value="rerun">Rerun agent</ve-dropdown-item>
    <ve-dropdown-item value="trace">Open trace</ve-dropdown-item>
    <ve-dropdown-item value="logs">View execution logs</ve-dropdown-item>
    <ve-dropdown-divider></ve-dropdown-divider>
    <ve-dropdown-item value="cancel" danger>Cancel run</ve-dropdown-item>
  </ve-dropdown>
</section>
```

### 选择模式

`selection="single"` 管理单选值，`selection="multiple"` 管理数组值。

```html preview
<script type="module">
  import '@ve-design/web/ve-button';
  import '@ve-design/web/ve-dropdown';
</script>

<section
  style="display:flex;flex-wrap:wrap;justify-content:center;align-items:center;gap:16px;min-height:168px;padding:32px;"
>
  <ve-dropdown trigger="click" selection="single" value="balanced">
    <ve-button slot="trigger" type="secondary">Row density</ve-button>
    <ve-dropdown-item value="compact">Compact</ve-dropdown-item>
    <ve-dropdown-item value="balanced">Balanced</ve-dropdown-item>
    <ve-dropdown-item value="spacious">Spacious</ve-dropdown-item>
  </ve-dropdown>

  <ve-dropdown trigger="click" selection="multiple" value='["cost","latency"]'>
    <ve-button slot="trigger" type="outline">Visible columns</ve-button>
    <ve-dropdown-item value="cost">Cost</ve-dropdown-item>
    <ve-dropdown-item value="latency">Latency</ve-dropdown-item>
    <ve-dropdown-item value="tokens">Token usage</ve-dropdown-item>
    <ve-dropdown-item value="owner">Owner</ve-dropdown-item>
  </ve-dropdown>
</section>
```

### 自定义内容

`ve-dropdown-item` 只提供默认插槽，图标、描述、快捷键或尾部内容可在默认插槽中组合。

```html preview
<script type="module">
  import '@ve-design/web/ve-button';
  import '@ve-design/web/ve-dropdown';
  import '@ve-design/web/icons/pie-chart-01';
</script>

<section style="display:grid;place-items:center;min-height:188px;padding:32px;">
  <ve-dropdown trigger="click">
    <ve-button slot="trigger" type="secondary">Model routing</ve-button>
    <ve-dropdown-item value="auto">
      <span style="display:flex;align-items:flex-start;gap:8px;">
        <ve-icon name="pie-chart-01" style="margin-top:3px;"></ve-icon>
        <span style="display:flex;flex-direction:column;gap:2px;">
          <span>Auto route</span>
          <span style="color:var(--color-text-tertiary);font-size:12px;line-height:18px;">
            Let the agent choose the best model.
          </span>
        </span>
      </span>
    </ve-dropdown-item>
    <ve-dropdown-item value="fast">
      <span style="display:flex;flex-direction:column;gap:2px;">
        <span>Fast mode</span>
        <span style="color:var(--color-text-tertiary);font-size:12px;line-height:18px;">
          Prefer low latency for short tasks.
        </span>
      </span>
    </ve-dropdown-item>
    <ve-dropdown-item value="deep">
      <span
        style="display:flex;align-items:center;justify-content:space-between;gap:24px;"
      >
        <span>Deep analysis</span>
        <kbd style="color:var(--color-text-tertiary);font:inherit;">⌘D</kbd>
      </span>
    </ve-dropdown-item>
  </ve-dropdown>
</section>
```

### 分组与开关

使用 `ve-dropdown-group` 和 `ve-dropdown-divider` 组织菜单区域；开关项可使用 `selection="switch"`。

```html preview
<script type="module">
  import '@ve-design/web/ve-button';
  import '@ve-design/web/ve-dropdown';
</script>

<section style="display:grid;place-items:center;min-height:188px;padding:32px;">
  <ve-dropdown trigger="click">
    <ve-button slot="trigger" type="secondary">Workspace</ve-button>
    <ve-dropdown-group title="Build">
      <ve-dropdown-item value="new-build">New build</ve-dropdown-item>
      <ve-dropdown-item value="duplicate">Duplicate workflow</ve-dropdown-item>
      <ve-dropdown-item value="validate">Validate pipeline</ve-dropdown-item>
    </ve-dropdown-group>
    <ve-dropdown-divider></ve-dropdown-divider>
    <ve-dropdown-group title="Settings">
      <ve-dropdown-item value="notifications" selection="switch" selected>
        Notifications
      </ve-dropdown-item>
      <ve-dropdown-item value="auto-save" selection="switch">
        Auto save
      </ve-dropdown-item>
    </ve-dropdown-group>
  </ve-dropdown>
</section>
```

### 子级菜单

使用 `ve-dropdown-sub-item` 声明子级菜单，`label` 属性或 `label` 插槽作为触发项内容；子菜单中的选项仍然可以使用 `selection="checkbox"` 或 `selection="check"` 展示多选和单选状态。

```html preview
<script type="module">
  import '@ve-design/web/ve-button';
  import '@ve-design/web/ve-dropdown';
  import '@ve-design/web/icons/bell';
  import '@ve-design/web/icons/command';
  import '@ve-design/web/icons/database';
  import '@ve-design/web/icons/document';
  import '@ve-design/web/icons/face';
  import '@ve-design/web/icons/file';
  import '@ve-design/web/icons/file-check';
  import '@ve-design/web/icons/folder';
  import '@ve-design/web/icons/globe';
  import '@ve-design/web/icons/grid';
  import '@ve-design/web/icons/history';
  import '@ve-design/web/icons/info';
  import '@ve-design/web/icons/key';
  import '@ve-design/web/icons/log-out';
  import '@ve-design/web/icons/mail';
  import '@ve-design/web/icons/preview';
  import '@ve-design/web/icons/settings';
  import '@ve-design/web/icons/user';
</script>

<section
  style="display:flex;align-items:flex-start;justify-content:center;min-height:320px;padding:88px 72px;overflow:visible;"
>
  <style>
    .submenu-demo {
      position: relative;
      inset-inline-end: 96px;
    }

    .submenu-demo-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 24px;
      width: 100%;
      min-width: 0;
    }

    .submenu-demo-label {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      min-width: 0;
    }

    .submenu-demo-label ve-icon {
      flex: none;
      font-size: 18px;
    }

    .submenu-demo-text {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .submenu-demo-shortcut {
      flex: none;
      color: var(--color-text-tertiary);
      font: inherit;
    }
  </style>

  <ve-dropdown class="submenu-demo" trigger="click">
    <ve-button slot="trigger" type="secondary">Complex Menu</ve-button>

    <ve-dropdown-group title="File">
      <ve-dropdown-item value="new-file">
        <span class="submenu-demo-row">
          <span class="submenu-demo-label">
            <ve-icon name="file"></ve-icon>
            <span class="submenu-demo-text">New File</span>
          </span>
          <kbd class="submenu-demo-shortcut">⌘N</kbd>
        </span>
      </ve-dropdown-item>
      <ve-dropdown-item value="new-folder">
        <span class="submenu-demo-row">
          <span class="submenu-demo-label">
            <ve-icon name="folder"></ve-icon>
            <span class="submenu-demo-text">New Folder</span>
          </span>
          <kbd class="submenu-demo-shortcut">⇧⌘N</kbd>
        </span>
      </ve-dropdown-item>
      <ve-dropdown-sub-item>
        <span slot="label" class="submenu-demo-row">
          <span class="submenu-demo-label">
            <ve-icon name="history"></ve-icon>
            <span class="submenu-demo-text">Open Recent</span>
          </span>
        </span>
        <ve-dropdown-item value="recent-draft" selection="checkbox" selected>
          <span class="submenu-demo-label">
            <ve-icon name="document"></ve-icon>
            <span class="submenu-demo-text">Agent run draft</span>
          </span>
        </ve-dropdown-item>
        <ve-dropdown-item value="recent-report" selection="checkbox" selected>
          <span class="submenu-demo-label">
            <ve-icon name="file-check"></ve-icon>
            <span class="submenu-demo-text">Evaluation report</span>
          </span>
        </ve-dropdown-item>
        <ve-dropdown-item value="recent-trace" selection="checkbox">
          <span class="submenu-demo-label">
            <ve-icon name="database"></ve-icon>
            <span class="submenu-demo-text">Trace snapshot</span>
          </span>
        </ve-dropdown-item>
      </ve-dropdown-sub-item>
    </ve-dropdown-group>

    <ve-dropdown-divider></ve-dropdown-divider>

    <ve-dropdown-group title="View">
      <ve-dropdown-item value="show-sidebar">
        <span class="submenu-demo-label">
          <ve-icon name="preview"></ve-icon>
          <span class="submenu-demo-text">Show Sidebar</span>
        </span>
      </ve-dropdown-item>
      <ve-dropdown-item value="show-status-bar">
        <span class="submenu-demo-label">
          <ve-icon name="grid"></ve-icon>
          <span class="submenu-demo-text">Show Status Bar</span>
        </span>
      </ve-dropdown-item>
      <ve-dropdown-sub-item>
        <span slot="label" class="submenu-demo-row">
          <span class="submenu-demo-label">
            <ve-icon name="face"></ve-icon>
            <span class="submenu-demo-text">Theme</span>
          </span>
        </span>
        <ve-dropdown-item
          value="theme-system"
          selection="check"
          selected
          data-theme-option
        >
          System
        </ve-dropdown-item>
        <ve-dropdown-item
          value="theme-light"
          selection="check"
          data-theme-option
        >
          Light
        </ve-dropdown-item>
        <ve-dropdown-item
          value="theme-dark"
          selection="check"
          data-theme-option
        >
          Dark
        </ve-dropdown-item>
      </ve-dropdown-sub-item>
    </ve-dropdown-group>

    <ve-dropdown-divider></ve-dropdown-divider>

    <ve-dropdown-group title="Account">
      <ve-dropdown-item value="profile">
        <span class="submenu-demo-row">
          <span class="submenu-demo-label">
            <ve-icon name="user"></ve-icon>
            <span class="submenu-demo-text">Profile</span>
          </span>
          <kbd class="submenu-demo-shortcut">⇧⌘P</kbd>
        </span>
      </ve-dropdown-item>
      <ve-dropdown-item value="billing">
        <span class="submenu-demo-label">
          <ve-icon name="database"></ve-icon>
          <span class="submenu-demo-text">Billing</span>
        </span>
      </ve-dropdown-item>
      <ve-dropdown-sub-item>
        <span slot="label" class="submenu-demo-row">
          <span class="submenu-demo-label">
            <ve-icon name="settings"></ve-icon>
            <span class="submenu-demo-text">Settings</span>
          </span>
        </span>
        <ve-dropdown-group title="Preferences">
          <ve-dropdown-item value="shortcuts">
            <span class="submenu-demo-label">
              <ve-icon name="command"></ve-icon>
              <span class="submenu-demo-text">Keyboard Shortcuts</span>
            </span>
          </ve-dropdown-item>
          <ve-dropdown-item value="language">
            <span class="submenu-demo-label">
              <ve-icon name="globe"></ve-icon>
              <span class="submenu-demo-text">Language</span>
            </span>
          </ve-dropdown-item>
          <ve-dropdown-sub-item>
            <span slot="label" class="submenu-demo-row">
              <span class="submenu-demo-label">
                <ve-icon name="bell"></ve-icon>
                <span class="submenu-demo-text">Notifications</span>
              </span>
            </span>
            <ve-dropdown-group title="Notification Types">
              <ve-dropdown-item value="push-notifications">
                <span class="submenu-demo-label">
                  <ve-icon name="bell"></ve-icon>
                  <span class="submenu-demo-text">Push Notifications</span>
                </span>
              </ve-dropdown-item>
              <ve-dropdown-item value="email-notifications">
                <span class="submenu-demo-label">
                  <ve-icon name="mail"></ve-icon>
                  <span class="submenu-demo-text">Email Notifications</span>
                </span>
              </ve-dropdown-item>
            </ve-dropdown-group>
          </ve-dropdown-sub-item>
          <ve-dropdown-item value="privacy-security">
            <span class="submenu-demo-label">
              <ve-icon name="key"></ve-icon>
              <span class="submenu-demo-text">Privacy & Security</span>
            </span>
          </ve-dropdown-item>
        </ve-dropdown-group>
      </ve-dropdown-sub-item>
      <ve-dropdown-item value="help">
        <span class="submenu-demo-label">
          <ve-icon name="info"></ve-icon>
          <span class="submenu-demo-text">Help & Support</span>
        </span>
      </ve-dropdown-item>
      <ve-dropdown-item value="documentation">
        <span class="submenu-demo-label">
          <ve-icon name="document"></ve-icon>
          <span class="submenu-demo-text">Documentation</span>
        </span>
      </ve-dropdown-item>
    </ve-dropdown-group>

    <ve-dropdown-divider></ve-dropdown-divider>

    <ve-dropdown-item value="sign-out" danger>
      <span class="submenu-demo-row">
        <span class="submenu-demo-label">
          <ve-icon name="log-out"></ve-icon>
          <span class="submenu-demo-text">Sign Out</span>
        </span>
        <kbd class="submenu-demo-shortcut">⇧⌘Q</kbd>
      </span>
    </ve-dropdown-item>
  </ve-dropdown>
</section>

<script>
  const submenuDemo = document.querySelector('.submenu-demo');

  if (submenuDemo) {
    const themeItems = Array.from(
      submenuDemo.querySelectorAll('[data-theme-option]'),
    );

    submenuDemo.addEventListener('ve-select', (event) => {
      const selectedItem = event.detail.item;

      if (!selectedItem.matches('[data-theme-option]')) {
        return;
      }

      themeItems.forEach((item) => {
        item.selected = item === selectedItem;
      });
    });
  }
</script>
```

### 触发方式

`trigger` 支持 `hover`、`click` 和 `contextmenu`；`position` 设置菜单优先展示位置。

```html preview
<script type="module">
  import '@ve-design/web/ve-button';
  import '@ve-design/web/ve-dropdown';
</script>

<section
  style="display:flex;flex-wrap:wrap;justify-content:center;align-items:center;gap:16px;min-height:168px;padding:32px;"
>
  <ve-dropdown trigger="hover" delay="120">
    <ve-button slot="trigger" type="secondary">Hover</ve-button>
    <ve-dropdown-item value="preview">Preview prompt</ve-dropdown-item>
    <ve-dropdown-item value="copy">Copy item ID</ve-dropdown-item>
  </ve-dropdown>

  <ve-dropdown trigger="click" position="right-start">
    <ve-button slot="trigger" type="outline">Right start</ve-button>
    <ve-dropdown-item value="open">Open details</ve-dropdown-item>
    <ve-dropdown-item value="metrics">Open metrics panel</ve-dropdown-item>
  </ve-dropdown>

  <ve-dropdown trigger="contextmenu">
    <ve-button slot="trigger" type="outline">Right click</ve-button>
    <ve-dropdown-item value="inspect">View details</ve-dropdown-item>
    <ve-dropdown-item value="copy-request-id">Copy request ID</ve-dropdown-item>
  </ve-dropdown>
</section>
```

### 事件

用户激活菜单项时触发 `ve-select`；根组件选中值变化时触发 `ve-change`。

```html preview
<script type="module">
  import '@ve-design/web/ve-button';
  import '@ve-design/web/ve-dropdown';
</script>

<section
  style="display:grid;place-items:center;gap:12px;min-height:188px;padding:32px;"
>
  <ve-dropdown id="event-menu" trigger="click" selection="single">
    <ve-button slot="trigger" type="secondary">Choose model</ve-button>
    <ve-dropdown-item value="fast">Fast mode</ve-dropdown-item>
    <ve-dropdown-item value="balanced">Balanced mode</ve-dropdown-item>
    <ve-dropdown-item value="deep">Deep analysis</ve-dropdown-item>
  </ve-dropdown>
  <code id="event-log" style="color:var(--color-text-secondary);">No selection</code>
</section>

<script>
  const menu = document.getElementById('event-menu');
  const log = document.getElementById('event-log');

  menu.addEventListener('ve-select', (event) => {
    log.textContent = `ve-select: ${event.detail.value}`;
  });

  menu.addEventListener('ve-change', (event) => {
    const { value } = event.detail;

    if (typeof value === 'string') {
      log.textContent = value === '' ? 've-change: ' : `ve-change: ${value}`;
      return;
    }

    if (Array.isArray(value)) {
      log.textContent =
        value.length === 0 ? 've-change: ' : `ve-change: ${value.join(', ')}`;
    }
  });
</script>
```

## API

### ve-dropdown 属性

| 属性名          | 描述                                         | 类型                                      | 默认值           |
| --------------- | -------------------------------------------- | ----------------------------------------- | ---------------- |
| `position`      | 菜单优先展示位置。                           | `Placement`                               | `'bottom-start'` |
| `trigger`       | 触发方式。                                   | `'hover'` \| `'click'` \| `'contextmenu'` | `'hover'`        |
| `selection`     | 菜单选择模式。                               | `'none'` \| `'single'` \| `'multiple'`    | `'none'`         |
| `value`         | 当前选中值。单选为字符串，多选为字符串数组。 | `string` \| `string[]` \| `''`            | `''`             |
| `default-value` | 非受控模式下的初始选中值。                   | `string` \| `string[]` \| `''`            | `''`             |
| `open`          | 当前是否打开；设置为布尔值时进入受控模式。   | `boolean` \| `undefined`                  | `undefined`      |
| `default-open`  | 非受控模式下的初始打开状态。                 | `boolean`                                 | `false`          |
| `disabled`      | 是否禁用下拉菜单。                           | `boolean`                                 | `false`          |
| `block`         | 是否撑满容器宽度。                           | `boolean`                                 | `false`          |
| `delay`         | `trigger="hover"` 时的打开延迟，单位毫秒。   | `number`                                  | `400`            |

### ve-dropdown 事件

| 事件名              | 描述                     | 参数类型                                  |
| ------------------- | ------------------------ | ----------------------------------------- |
| `ve-open-change`    | 菜单打开状态变化请求发生时触发。 | `CustomEvent<VeDropdownOpenChangeDetail>` |
| `ve-select`         | 菜单项被激活时触发。     | `CustomEvent<VeDropdownSelectDetail>`     |
| `ve-change`         | 根组件选中值变化时触发。 | `CustomEvent<VeDropdownChangeDetail>`     |

### ve-dropdown 方法

| 方法名                          | 描述                       |
| ------------------------------- | -------------------------- |
| `focus(options?: FocusOptions)` | 将焦点移动到下拉触发元素。 |

### ve-dropdown 插槽

| 插槽名    | 描述                                 |
| --------- | ------------------------------------ |
| `trigger` | 下拉触发节点，建议放置单个根节点。   |
| 默认插槽  | 菜单内容，通常放置菜单项或菜单分组。 |

### ve-dropdown-item 属性

| 属性名      | 描述                       | 类型                                                | 默认值   |
| ----------- | -------------------------- | --------------------------------------------------- | -------- |
| `value`     | 菜单项选择后返回的值。     | `string`                                            | `''`     |
| `disabled`  | 是否禁用菜单项。           | `boolean`                                           | `false`  |
| `danger`    | 是否展示危险操作样式。     | `boolean`                                           | `false`  |
| `selected`  | 当前菜单项是否选中。       | `boolean`                                           | `false`  |
| `selection` | 单个菜单项的视觉选择形态。 | `'none'` \| `'check'` \| `'checkbox'` \| `'switch'` | `'none'` |

### ve-dropdown-item 事件

| 事件名                    | 描述                     | 参数类型                                  |
| ------------------------- | ------------------------ | ----------------------------------------- |
| `ve-dropdown-item-select` | 当前菜单项被激活时触发。 | `CustomEvent<VeDropdownItemSelectDetail>` |

### ve-dropdown-item 方法

| 方法名                          | 描述                       |
| ------------------------------- | -------------------------- |
| `focus(options?: FocusOptions)` | 将焦点移动到菜单按钮。 |

### ve-dropdown-item 插槽

| 插槽名   | 描述                               |
| -------- | ---------------------------------- |
| 默认插槽 | 菜单项内容，可自由组合自定义结构。 |

### ve-dropdown-group 属性

| 属性名  | 描述     | 类型     | 默认值 |
| ------- | -------- | -------- | ------ |
| `title` | 分组标题 | `string` | `''`   |

### ve-dropdown-group 插槽

| 插槽名   | 描述           |
| -------- | -------------- |
| 默认插槽 | 分组内菜单项。 |

### ve-dropdown-sub-item 属性

| 属性名     | 描述                 | 类型      | 默认值  |
| ---------- | -------------------- | --------- | ------- |
| `label`    | 子菜单触发项标题。   | `string`  | `''`    |
| `disabled` | 是否禁用子菜单。     | `boolean` | `false` |
| `open`     | 当前子菜单是否打开。 | `boolean` | `false` |

### ve-dropdown-sub-item 方法

| 方法名                          | 描述                       |
| ------------------------------- | -------------------------- |
| `focus(options?: FocusOptions)` | 将焦点移动到子菜单触发项。 |

### ve-dropdown-sub-item 插槽

| 插槽名   | 描述                     |
| -------- | ------------------------ |
| 默认插槽 | 子菜单内容。             |
| `label`  | 子菜单触发项自定义内容。 |
