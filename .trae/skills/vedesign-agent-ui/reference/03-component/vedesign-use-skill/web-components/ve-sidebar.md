`ve-sidebar` 用于构建应用的常驻侧边导航，适合承载主要操作、业务入口、项目列表和历史记录等内容。组件支持展开与折叠、固定区域、可滚动内容及自定义底部区域。

## 组件构成

- `<ve-sidebar>`：侧边导航容器，提供品牌区、内容区、固定区和底部区域。
- `<ve-sidebar-group>`：导航分组，用于组织相关菜单项，支持标题和分组折叠。
- `<ve-sidebar-item>`：导航项，支持选中、激活、禁用、加载、未读、快捷键、链接和提示信息等能力。

折叠后保留品牌标识和导航项图标，并通过提示信息补充导航项名称与快捷键。底部区域可组合 Avatar、Dropdown 等组件，用于呈现当前用户及账户相关操作。

## 何时使用

- 为工作台、管理后台或内容型应用提供常驻导航。
- 需要在完整导航与紧凑图标导航之间切换。
- 需要同时组织固定操作和可滚动的动态内容。
- 导航项需要呈现选中、加载、未读、禁用或快捷键等状态。
- 需要自定义品牌区域或用户区域。

## 使用建议

- 为导航项同时提供清晰的文本、可辨识的 `prefix` 图标和 `tooltip`，确保展开与折叠状态下都能准确识别入口。
- 使用 `selected` 表示当前页面，使用 `active` 表示菜单展开等临时交互状态。
- 将高频操作放入 `pinned` 区域，将项目、会话等动态内容放入默认可滚动区域。
- 在 `footer` 中使用 `<ve-sidebar-item>` 承载用户信息或账户入口，以保持一致的交互语义。

## 引入组件

```ts
import '@ve-design/web/ve-sidebar';
```

子元素 `<ve-sidebar-group>` / `<ve-sidebar-item>` 会随 `<ve-sidebar>` 一同自动注册，无需单独 import。

## 示例

### 基础用法

使用 `<ve-sidebar-group>` 组织功能入口、项目和历史会话，并通过 `footer` 插槽提供用户菜单。导航项的 `prefix` 和 `suffix` 插槽可分别放置图标与附加操作。

```html preview
<script type="module">
  import '@ve-design/web/ve-sidebar';
  import '@ve-design/web/ve-avatar';
  import '@ve-design/web/ve-button';
  import '@ve-design/web/ve-dropdown';
  import '@ve-design/web/icons';
</script>

<div style="height: 480px; display: flex">
  <ve-sidebar brand="Agent Design" with-footer expand-tooltip="展开侧边栏">
    <svg slot="logo" viewBox="0 0 28 28" aria-hidden="true">
      <g transform="translate(2.333,2.333) translate(23.3333,0) scale(-1,1)">
        <path
          fill="currentColor"
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M11.6667 0C12.7234 0 13.3516 0.952589 14.6079 2.85777L21.6122 13.4797C22.9046 15.4397 23.5508 16.4196 23.2676 17.4077C22.9843 18.3958 21.9074 18.9184 19.7536 19.9636L16.382 21.5998C14.0005 22.7555 12.8097 23.3333 11.6667 23.3333C10.5236 23.3333 9.33284 22.7555 6.95134 21.5998L3.5797 19.9636C1.4259 18.9184 0.348998 18.3958 0.0657699 17.4077C-0.217458 16.4196 0.428748 15.4397 1.72116 13.4797L8.72546 2.85777C9.98176 0.952589 10.6099 0 11.6667 0ZM14.6426 5.51707C13.8247 4.26843 13.4158 3.64411 12.7214 3.83713C12.0271 4.03014 12.0271 4.76814 12.0271 6.24413V18.0393C12.0271 19.7582 12.0271 20.6176 12.7145 21.0237C13.402 21.4297 14.1983 21.0407 15.7911 20.2626L19.4666 18.467C20.7526 17.8388 21.3956 17.5247 21.5649 16.9341C21.7343 16.3436 21.3498 15.7565 20.5808 14.5825L14.6426 5.51707Z"
        />
      </g>
    </svg>

    <ve-sidebar-group>
      <ve-sidebar-item>
        <ve-icon slot="prefix" name="message-circle-plus"></ve-icon>
        新对话
      </ve-sidebar-item>
      <ve-sidebar-item>
        <ve-icon slot="prefix" name="search"></ve-icon>
        搜索
      </ve-sidebar-item>
      <ve-sidebar-item>
        <ve-icon slot="prefix" name="file"></ve-icon>
        文件库
      </ve-sidebar-item>
      <ve-sidebar-item>
        <ve-icon slot="prefix" name="more-horizontal"></ve-icon>
        更多
      </ve-sidebar-item>
    </ve-sidebar-group>

    <ve-sidebar-group label="项目">
      <ve-sidebar-item>
        <ve-icon slot="prefix" name="folder"></ve-icon>
        项目名称
      </ve-sidebar-item>
    </ve-sidebar-group>

    <ve-sidebar-group label="历史会话">
      <ve-sidebar-item unread>
        <ve-icon slot="prefix" name="message"></ve-icon>
        普通会话
        <ve-dropdown slot="suffix" trigger="click" position="right-start">
          <ve-button
            slot="trigger"
            type="text"
            size="small"
            aria-label="更多操作"
          >
            <ve-icon name="more-horizontal"></ve-icon>
          </ve-button>
          <ve-dropdown-item value="pin">置顶</ve-dropdown-item>
          <ve-dropdown-item value="share">分享</ve-dropdown-item>
          <ve-dropdown-item value="rename">重命名</ve-dropdown-item>
          <ve-dropdown-divider></ve-dropdown-divider>
          <ve-dropdown-item value="delete" danger>删除</ve-dropdown-item>
        </ve-dropdown>
      </ve-sidebar-item>

      <ve-sidebar-item loading>
        <ve-icon slot="prefix" name="message"></ve-icon>
        普通会话
        <ve-dropdown slot="suffix" trigger="click" position="right-start">
          <ve-button
            slot="trigger"
            type="text"
            size="small"
            aria-label="更多操作"
          >
            <ve-icon name="more-horizontal"></ve-icon>
          </ve-button>
          <ve-dropdown-item value="pin">置顶</ve-dropdown-item>
          <ve-dropdown-item value="share">分享</ve-dropdown-item>
          <ve-dropdown-item value="rename">重命名</ve-dropdown-item>
          <ve-dropdown-divider></ve-dropdown-divider>
          <ve-dropdown-item value="delete" danger>删除</ve-dropdown-item>
        </ve-dropdown>
      </ve-sidebar-item>

      <ve-sidebar-item>
        <ve-icon slot="prefix" name="message"></ve-icon>
        普通会话
        <ve-dropdown slot="suffix" trigger="click" position="right-start">
          <ve-button
            slot="trigger"
            type="text"
            size="small"
            aria-label="更多操作"
          >
            <ve-icon name="more-horizontal"></ve-icon>
          </ve-button>
          <ve-dropdown-item value="pin">置顶</ve-dropdown-item>
          <ve-dropdown-item value="share">分享</ve-dropdown-item>
          <ve-dropdown-item value="rename">重命名</ve-dropdown-item>
          <ve-dropdown-divider></ve-dropdown-divider>
          <ve-dropdown-item value="delete" danger>删除</ve-dropdown-item>
        </ve-dropdown>
      </ve-sidebar-item>
    </ve-sidebar-group>

    <ve-dropdown slot="footer" trigger="click" position="top-start" block>
      <ve-sidebar-item slot="trigger" tooltip="用户菜单">
        <ve-avatar slot="prefix" size="24">
          <img
            src="https://s1-imfile.feishucdn.com/static-resource/v1/v3_00ac_494d75fe-848a-4249-891d-05a0c0ba98eg~?image_size=80x80&cut_type=&quality=&format=png&sticker_format=.webp"
            alt="凌云松"
          />
        </ve-avatar>
        凌云松
      </ve-sidebar-item>
      <ve-dropdown-item value="account" disabled>
        user@example.com
      </ve-dropdown-item>
      <ve-dropdown-item value="settings">设置</ve-dropdown-item>
      <ve-dropdown-item value="quota">剩余额度</ve-dropdown-item>
      <ve-dropdown-item value="help">帮助与反馈</ve-dropdown-item>
      <ve-dropdown-divider></ve-dropdown-divider>
      <ve-dropdown-item value="logout" danger>退出登录</ve-dropdown-item>
    </ve-dropdown>
  </ve-sidebar>

  <main style="flex: 1; padding: 24px">Agent 主内容区域</main>
</div>
```

### 折叠 / 展开

通过 `collapsed` 控制侧边导航的展开与折叠。折叠状态保留品牌标识和导航项图标，并通过 `tooltip` 提供文字说明；`expand-tooltip` 用于设置品牌标识上的展开提示。状态变化时会派发 `ve-sidebar-toggle` 事件。

```html preview
<svg
  style="position:absolute;width:0;height:0;overflow:hidden"
  aria-hidden="true"
>
  <defs>
    <symbol id="ic-agent-logo" viewBox="0 0 28 28">
      <g transform="translate(2.333,2.333) translate(23.3333,0) scale(-1,1)">
        <path
          fill="currentColor"
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M11.6667 0C12.7234 0 13.3516 0.952589 14.6079 2.85777L21.6122 13.4797C22.9046 15.4397 23.5508 16.4196 23.2676 17.4077C22.9843 18.3958 21.9074 18.9184 19.7536 19.9636L16.382 21.5998C14.0005 22.7555 12.8097 23.3333 11.6667 23.3333C10.5236 23.3333 9.33284 22.7555 6.95134 21.5998L3.5797 19.9636C1.4259 18.9184 0.348998 18.3958 0.0657699 17.4077C-0.217458 16.4196 0.428748 15.4397 1.72116 13.4797L8.72546 2.85777C9.98176 0.952589 10.6099 0 11.6667 0ZM14.6426 5.51707C13.8247 4.26843 13.4158 3.64411 12.7214 3.83713C12.0271 4.03014 12.0271 4.76814 12.0271 6.24413V18.0393C12.0271 19.7582 12.0271 20.6176 12.7145 21.0237C13.402 21.4297 14.1983 21.0407 15.7911 20.2626L19.4666 18.467C20.7526 17.8388 21.3956 17.5247 21.5649 16.9341C21.7343 16.3436 21.3498 15.7565 20.5808 14.5825L14.6426 5.51707Z"
        />
      </g>
    </symbol>
  </defs>
</svg>

<script type="module">
  import '@ve-design/web/ve-sidebar';
  import '@ve-design/web/ve-avatar';
  import '@ve-design/web/ve-button';
  import '@ve-design/web/ve-dropdown';
  import '@ve-design/web/icons';
</script>

<div style="display: grid; gap: 16px">
  <div>
    <ve-button id="toggle-mode" type="secondary" size="small">
      切换折叠
    </ve-button>
  </div>

  <div style="height: 520px; display: flex">
    <ve-sidebar
      id="sidebar-mode"
      collapsed
      with-footer
      expand-tooltip="展开侧边栏"
    >
      <svg slot="logo" viewBox="0 0 28 28" aria-hidden="true">
        <use href="#ic-agent-logo" />
      </svg>

      <ve-sidebar-group>
        <ve-sidebar-item tooltip="新对话">
          <ve-icon slot="prefix" name="message-circle-plus"></ve-icon>
          新对话
        </ve-sidebar-item>
        <ve-sidebar-item tooltip="搜索">
          <ve-icon slot="prefix" name="search"></ve-icon>
          搜索
        </ve-sidebar-item>
        <ve-sidebar-item tooltip="文件库">
          <ve-icon slot="prefix" name="file"></ve-icon>
          文件库
        </ve-sidebar-item>
        <ve-sidebar-item tooltip="项目">
          <ve-icon slot="prefix" name="folder"></ve-icon>
          项目
        </ve-sidebar-item>
      </ve-sidebar-group>

      <ve-sidebar-group>
        <ve-dropdown trigger="click" position="right-start" block>
          <ve-sidebar-item slot="trigger" tooltip="历史会话">
            <ve-icon slot="prefix" name="message"></ve-icon>
            历史会话
          </ve-sidebar-item>
          <ve-dropdown-item value="h1">项目导航结构说明</ve-dropdown-item>
          <ve-dropdown-item value="h2">组件状态复盘</ve-dropdown-item>
          <ve-dropdown-item value="h3">发布计划整理</ve-dropdown-item>
        </ve-dropdown>
      </ve-sidebar-group>

      <ve-dropdown slot="footer" trigger="click" position="top-start" block>
        <ve-sidebar-item slot="trigger" tooltip="用户菜单">
          <ve-avatar slot="prefix" size="24">
            <img
              src="https://s1-imfile.feishucdn.com/static-resource/v1/v3_00ac_494d75fe-848a-4249-891d-05a0c0ba98eg~?image_size=80x80&cut_type=&quality=&format=png&sticker_format=.webp"
              alt="凌云松"
            />
          </ve-avatar>
          凌云松
        </ve-sidebar-item>
        <ve-dropdown-item value="account" disabled>
          user@example.com
        </ve-dropdown-item>
        <ve-dropdown-item value="settings">设置</ve-dropdown-item>
        <ve-dropdown-item value="quota">剩余额度</ve-dropdown-item>
        <ve-dropdown-item value="help">帮助与反馈</ve-dropdown-item>
        <ve-dropdown-divider></ve-dropdown-divider>
        <ve-dropdown-item value="logout" danger>退出登录</ve-dropdown-item>
      </ve-dropdown>
    </ve-sidebar>
    <main style="flex: 1; padding: 24px; color: var(--color-text-primary)">
      主内容
    </main>
  </div>
</div>

<script>
  const sidebar = document.getElementById('sidebar-mode');
  document.getElementById('toggle-mode').addEventListener('click', () => {
    sidebar.collapsed = !sidebar.collapsed;
  });
  sidebar.addEventListener('ve-sidebar-toggle', (event) => {
    console.log('collapsed change:', event.detail.collapsed);
  });
</script>
```

### 固定区域与滚动内容

通过 `pinned` 插槽放置需要持续可见的主要操作。默认插槽中的分组位于可滚动区域，适合承载项目列表、历史记录等动态内容。

```html preview
<svg
  style="position:absolute;width:0;height:0;overflow:hidden"
  aria-hidden="true"
>
  <defs>
    <symbol id="ic-agent-logo" viewBox="0 0 28 28">
      <g transform="translate(2.333,2.333) translate(23.3333,0) scale(-1,1)">
        <path
          fill="currentColor"
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M11.6667 0C12.7234 0 13.3516 0.952589 14.6079 2.85777L21.6122 13.4797C22.9046 15.4397 23.5508 16.4196 23.2676 17.4077C22.9843 18.3958 21.9074 18.9184 19.7536 19.9636L16.382 21.5998C14.0005 22.7555 12.8097 23.3333 11.6667 23.3333C10.5236 23.3333 9.33284 22.7555 6.95134 21.5998L3.5797 19.9636C1.4259 18.9184 0.348998 18.3958 0.0657699 17.4077C-0.217458 16.4196 0.428748 15.4397 1.72116 13.4797L8.72546 2.85777C9.98176 0.952589 10.6099 0 11.6667 0ZM14.6426 5.51707C13.8247 4.26843 13.4158 3.64411 12.7214 3.83713C12.0271 4.03014 12.0271 4.76814 12.0271 6.24413V18.0393C12.0271 19.7582 12.0271 20.6176 12.7145 21.0237C13.402 21.4297 14.1983 21.0407 15.7911 20.2626L19.4666 18.467C20.7526 17.8388 21.3956 17.5247 21.5649 16.9341C21.7343 16.3436 21.3498 15.7565 20.5808 14.5825L14.6426 5.51707Z"
        />
      </g>
    </symbol>
  </defs>
</svg>

<script type="module">
  import '@ve-design/web/ve-sidebar';
  import '@ve-design/web/ve-avatar';
  import '@ve-design/web/ve-dropdown';
  import '@ve-design/web/icons';
</script>

<div style="height: 540px; display: flex">
  <ve-sidebar brand="Agent Design" with-footer>
    <svg slot="logo" viewBox="0 0 28 28" aria-hidden="true">
      <use href="#ic-agent-logo" />
    </svg>

    <ve-sidebar-group slot="pinned">
      <ve-sidebar-item>
        <ve-icon slot="prefix" name="message-circle-plus"></ve-icon>
        新对话
      </ve-sidebar-item>
      <ve-sidebar-item>
        <ve-icon slot="prefix" name="search"></ve-icon>
        搜索
      </ve-sidebar-item>
      <ve-sidebar-item>
        <ve-icon slot="prefix" name="file"></ve-icon>
        文件库
      </ve-sidebar-item>
      <ve-sidebar-item>
        <ve-icon slot="prefix" name="more-horizontal"></ve-icon>
        更多
      </ve-sidebar-item>
    </ve-sidebar-group>

    <ve-sidebar-group label="项目">
      <ve-sidebar-item>
        <ve-icon slot="prefix" name="folder"></ve-icon>
        项目名称
      </ve-sidebar-item>
    </ve-sidebar-group>

    <ve-sidebar-group label="历史会话">
      <ve-sidebar-item>
        <ve-icon slot="prefix" name="message"></ve-icon>
        普通会话
      </ve-sidebar-item>
      <ve-sidebar-item>
        <ve-icon slot="prefix" name="message"></ve-icon>
        普通会话
      </ve-sidebar-item>
      <ve-sidebar-item>
        <ve-icon slot="prefix" name="message"></ve-icon>
        普通会话
      </ve-sidebar-item>
      <ve-sidebar-item>
        <ve-icon slot="prefix" name="message"></ve-icon>
        普通会话
      </ve-sidebar-item>
      <ve-sidebar-item>
        <ve-icon slot="prefix" name="message"></ve-icon>
        普通会话
      </ve-sidebar-item>
      <ve-sidebar-item>
        <ve-icon slot="prefix" name="message"></ve-icon>
        普通会话
      </ve-sidebar-item>
      <ve-sidebar-item>
        <ve-icon slot="prefix" name="message"></ve-icon>
        普通会话
      </ve-sidebar-item>
      <ve-sidebar-item>
        <ve-icon slot="prefix" name="message"></ve-icon>
        普通会话
      </ve-sidebar-item>
      <ve-sidebar-item>
        <ve-icon slot="prefix" name="message"></ve-icon>
        普通会话
      </ve-sidebar-item>
      <ve-sidebar-item>
        <ve-icon slot="prefix" name="message"></ve-icon>
        普通会话
      </ve-sidebar-item>
      <ve-sidebar-item>
        <ve-icon slot="prefix" name="message"></ve-icon>
        普通会话
      </ve-sidebar-item>
      <ve-sidebar-item>
        <ve-icon slot="prefix" name="message"></ve-icon>
        普通会话
      </ve-sidebar-item>
    </ve-sidebar-group>

    <ve-dropdown slot="footer" trigger="click" position="top-start" block>
      <ve-sidebar-item slot="trigger" tooltip="用户菜单">
        <ve-avatar slot="prefix" size="24">
          <img
            src="https://s1-imfile.feishucdn.com/static-resource/v1/v3_00ac_494d75fe-848a-4249-891d-05a0c0ba98eg~?image_size=80x80&cut_type=&quality=&format=png&sticker_format=.webp"
            alt="凌云松"
          />
        </ve-avatar>
        凌云松
      </ve-sidebar-item>
      <ve-dropdown-item value="account" disabled>
        user@example.com
      </ve-dropdown-item>
      <ve-dropdown-item value="settings">设置</ve-dropdown-item>
      <ve-dropdown-item value="quota">剩余额度</ve-dropdown-item>
      <ve-dropdown-item value="help">帮助与反馈</ve-dropdown-item>
      <ve-dropdown-divider></ve-dropdown-divider>
      <ve-dropdown-item value="logout" danger>退出登录</ve-dropdown-item>
    </ve-dropdown>
  </ve-sidebar>
  <main style="flex: 1; padding: 24px; color: var(--color-text-primary)">
    主内容
  </main>
</div>
```

### 隐藏滚动条

内容溢出时默认显示滚动条。设置 `hide-scrollbar` 可隐藏滚动条，同时保留鼠标滚轮和触控板滚动能力。

```html preview
<svg
  style="position:absolute;width:0;height:0;overflow:hidden"
  aria-hidden="true"
>
  <defs>
    <symbol id="ic-agent-logo" viewBox="0 0 28 28">
      <g transform="translate(2.333,2.333) translate(23.3333,0) scale(-1,1)">
        <path
          fill="currentColor"
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M11.6667 0C12.7234 0 13.3516 0.952589 14.6079 2.85777L21.6122 13.4797C22.9046 15.4397 23.5508 16.4196 23.2676 17.4077C22.9843 18.3958 21.9074 18.9184 19.7536 19.9636L16.382 21.5998C14.0005 22.7555 12.8097 23.3333 11.6667 23.3333C10.5236 23.3333 9.33284 22.7555 6.95134 21.5998L3.5797 19.9636C1.4259 18.9184 0.348998 18.3958 0.0657699 17.4077C-0.217458 16.4196 0.428748 15.4397 1.72116 13.4797L8.72546 2.85777C9.98176 0.952589 10.6099 0 11.6667 0ZM14.6426 5.51707C13.8247 4.26843 13.4158 3.64411 12.7214 3.83713C12.0271 4.03014 12.0271 4.76814 12.0271 6.24413V18.0393C12.0271 19.7582 12.0271 20.6176 12.7145 21.0237C13.402 21.4297 14.1983 21.0407 15.7911 20.2626L19.4666 18.467C20.7526 17.8388 21.3956 17.5247 21.5649 16.9341C21.7343 16.3436 21.3498 15.7565 20.5808 14.5825L14.6426 5.51707Z"
        />
      </g>
    </symbol>
  </defs>
</svg>

<script type="module">
  import '@ve-design/web/ve-sidebar';
  import '@ve-design/web/ve-avatar';
  import '@ve-design/web/ve-button';
  import '@ve-design/web/ve-dropdown';
  import '@ve-design/web/icons';
</script>

<div style="display: grid; gap: 12px">
  <div>
    <ve-button id="sb-scrollbar-toggle" type="secondary" size="small">
      切换滚动条
    </ve-button>
    <span
      id="sb-scrollbar-state"
      style="margin-inline-start: 8px; font-size: 13px; color: var(--color-text-primary)"
    >
      当前：显示滚动条
    </span>
  </div>
  <div style="height: 360px; display: flex">
    <ve-sidebar id="sb-scrollbar" brand="Agent Design" with-footer>
      <svg slot="logo" viewBox="0 0 28 28" aria-hidden="true">
        <use href="#ic-agent-logo" />
      </svg>

      <ve-sidebar-group slot="pinned">
        <ve-sidebar-item>
          <ve-icon slot="prefix" name="message-circle-plus"></ve-icon>
          新对话
        </ve-sidebar-item>
      </ve-sidebar-group>

      <ve-sidebar-group label="历史会话">
        <ve-sidebar-item>
          <ve-icon slot="prefix" name="message"></ve-icon>
          普通会话
        </ve-sidebar-item>
        <ve-sidebar-item>
          <ve-icon slot="prefix" name="message"></ve-icon>
          普通会话
        </ve-sidebar-item>
        <ve-sidebar-item>
          <ve-icon slot="prefix" name="message"></ve-icon>
          普通会话
        </ve-sidebar-item>
        <ve-sidebar-item>
          <ve-icon slot="prefix" name="message"></ve-icon>
          普通会话
        </ve-sidebar-item>
        <ve-sidebar-item>
          <ve-icon slot="prefix" name="message"></ve-icon>
          普通会话
        </ve-sidebar-item>
        <ve-sidebar-item>
          <ve-icon slot="prefix" name="message"></ve-icon>
          普通会话
        </ve-sidebar-item>
        <ve-sidebar-item>
          <ve-icon slot="prefix" name="message"></ve-icon>
          普通会话
        </ve-sidebar-item>
        <ve-sidebar-item>
          <ve-icon slot="prefix" name="message"></ve-icon>
          普通会话
        </ve-sidebar-item>
        <ve-sidebar-item>
          <ve-icon slot="prefix" name="message"></ve-icon>
          普通会话
        </ve-sidebar-item>
        <ve-sidebar-item>
          <ve-icon slot="prefix" name="message"></ve-icon>
          普通会话
        </ve-sidebar-item>
        <ve-sidebar-item>
          <ve-icon slot="prefix" name="message"></ve-icon>
          普通会话
        </ve-sidebar-item>
        <ve-sidebar-item>
          <ve-icon slot="prefix" name="message"></ve-icon>
          普通会话
        </ve-sidebar-item>
      </ve-sidebar-group>

      <ve-dropdown slot="footer" trigger="click" position="top-start" block>
        <ve-sidebar-item slot="trigger" tooltip="用户菜单">
          <ve-avatar slot="prefix" size="24">
            <img
              src="https://s1-imfile.feishucdn.com/static-resource/v1/v3_00ac_494d75fe-848a-4249-891d-05a0c0ba98eg~?image_size=80x80&cut_type=&quality=&format=png&sticker_format=.webp"
              alt="凌云松"
            />
          </ve-avatar>
          凌云松
        </ve-sidebar-item>
        <ve-dropdown-item value="account" disabled>
          user@example.com
        </ve-dropdown-item>
        <ve-dropdown-item value="settings">设置</ve-dropdown-item>
        <ve-dropdown-item value="quota">剩余额度</ve-dropdown-item>
        <ve-dropdown-item value="help">帮助与反馈</ve-dropdown-item>
        <ve-dropdown-divider></ve-dropdown-divider>
        <ve-dropdown-item value="logout" danger>退出登录</ve-dropdown-item>
      </ve-dropdown>
    </ve-sidebar>
    <main style="flex: 1; padding: 24px; color: var(--color-text-primary)">
      主内容
    </main>
  </div>
</div>

<script>
  (function () {
    const sidebar = document.getElementById('sb-scrollbar');
    const toggle = document.getElementById('sb-scrollbar-toggle');
    const state = document.getElementById('sb-scrollbar-state');
    if (sidebar && toggle && state) {
      toggle.addEventListener('click', () => {
        const hidden = sidebar.toggleAttribute('hide-scrollbar');
        state.textContent = hidden ? '当前：隐藏滚动条' : '当前：显示滚动条';
      });
    }
  })();
</script>
```

### 导航项状态

`<ve-sidebar-item>` 支持选中、激活、禁用、加载和未读状态。可通过 `shortcut` 显示快捷键，通过 `suffix` 插槽添加辅助信息或操作。

```html preview
<svg
  style="position:absolute;width:0;height:0;overflow:hidden"
  aria-hidden="true"
>
  <defs>
    <symbol id="ic-agent-logo" viewBox="0 0 28 28">
      <g transform="translate(2.333,2.333) translate(23.3333,0) scale(-1,1)">
        <path
          fill="currentColor"
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M11.6667 0C12.7234 0 13.3516 0.952589 14.6079 2.85777L21.6122 13.4797C22.9046 15.4397 23.5508 16.4196 23.2676 17.4077C22.9843 18.3958 21.9074 18.9184 19.7536 19.9636L16.382 21.5998C14.0005 22.7555 12.8097 23.3333 11.6667 23.3333C10.5236 23.3333 9.33284 22.7555 6.95134 21.5998L3.5797 19.9636C1.4259 18.9184 0.348998 18.3958 0.0657699 17.4077C-0.217458 16.4196 0.428748 15.4397 1.72116 13.4797L8.72546 2.85777C9.98176 0.952589 10.6099 0 11.6667 0ZM14.6426 5.51707C13.8247 4.26843 13.4158 3.64411 12.7214 3.83713C12.0271 4.03014 12.0271 4.76814 12.0271 6.24413V18.0393C12.0271 19.7582 12.0271 20.6176 12.7145 21.0237C13.402 21.4297 14.1983 21.0407 15.7911 20.2626L19.4666 18.467C20.7526 17.8388 21.3956 17.5247 21.5649 16.9341C21.7343 16.3436 21.3498 15.7565 20.5808 14.5825L14.6426 5.51707Z"
        />
      </g>
    </symbol>
  </defs>
</svg>

<script type="module">
  import '@ve-design/web/ve-sidebar';
  import '@ve-design/web/icons';
</script>

<div style="height: 460px; display: flex">
  <ve-sidebar brand="Agent Design">
    <svg slot="logo" viewBox="0 0 28 28" aria-hidden="true">
      <use href="#ic-agent-logo" />
    </svg>

    <ve-sidebar-group label="主操作">
      <ve-sidebar-item selected shortcut="⌘K">
        <ve-icon slot="prefix" name="message-circle-plus"></ve-icon>
        新对话
      </ve-sidebar-item>
      <ve-sidebar-item active>
        <ve-icon slot="prefix" name="search"></ve-icon>
        搜索
      </ve-sidebar-item>
      <ve-sidebar-item disabled>
        <ve-icon slot="prefix" name="more-horizontal"></ve-icon>
        Agent (敬请期待)
      </ve-sidebar-item>
    </ve-sidebar-group>

    <ve-sidebar-group label="历史会话">
      <ve-sidebar-item unread>
        <ve-icon
          slot="prefix"
          name="message"
          style="color: var(--color-text-tertiary)"
        ></ve-icon>
        未读消息提示
      </ve-sidebar-item>
      <ve-sidebar-item loading>
        <ve-icon
          slot="prefix"
          name="message"
          style="color: var(--color-text-tertiary)"
        ></ve-icon>
        正在生成总结
      </ve-sidebar-item>
      <ve-sidebar-item>
        <ve-icon
          slot="prefix"
          name="message"
          style="color: var(--color-text-tertiary)"
        ></ve-icon>
        普通会话
      </ve-sidebar-item>
    </ve-sidebar-group>
  </ve-sidebar>
  <main style="flex: 1; padding: 24px; color: var(--color-text-primary)">
    主内容
  </main>
</div>
```

### 链接导航项

设置 `href` 后，导航项以链接形式呈现；可通过 `target` 指定打开方式。使用 `target="_blank"` 时，组件会自动设置安全的 `rel` 属性。

```html preview
<svg
  style="position:absolute;width:0;height:0;overflow:hidden"
  aria-hidden="true"
>
  <defs>
    <symbol id="ic-agent-logo" viewBox="0 0 28 28">
      <g transform="translate(2.333,2.333) translate(23.3333,0) scale(-1,1)">
        <path
          fill="currentColor"
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M11.6667 0C12.7234 0 13.3516 0.952589 14.6079 2.85777L21.6122 13.4797C22.9046 15.4397 23.5508 16.4196 23.2676 17.4077C22.9843 18.3958 21.9074 18.9184 19.7536 19.9636L16.382 21.5998C14.0005 22.7555 12.8097 23.3333 11.6667 23.3333C10.5236 23.3333 9.33284 22.7555 6.95134 21.5998L3.5797 19.9636C1.4259 18.9184 0.348998 18.3958 0.0657699 17.4077C-0.217458 16.4196 0.428748 15.4397 1.72116 13.4797L8.72546 2.85777C9.98176 0.952589 10.6099 0 11.6667 0ZM14.6426 5.51707C13.8247 4.26843 13.4158 3.64411 12.7214 3.83713C12.0271 4.03014 12.0271 4.76814 12.0271 6.24413V18.0393C12.0271 19.7582 12.0271 20.6176 12.7145 21.0237C13.402 21.4297 14.1983 21.0407 15.7911 20.2626L19.4666 18.467C20.7526 17.8388 21.3956 17.5247 21.5649 16.9341C21.7343 16.3436 21.3498 15.7565 20.5808 14.5825L14.6426 5.51707Z"
        />
      </g>
    </symbol>
  </defs>
</svg>

<script type="module">
  import '@ve-design/web/ve-sidebar';
  import '@ve-design/web/icons';
</script>

<div style="height: 320px; display: flex">
  <ve-sidebar brand="Agent Design">
    <svg slot="logo" viewBox="0 0 28 28" aria-hidden="true">
      <use href="#ic-agent-logo" />
    </svg>

    <ve-sidebar-group label="跳转">
      <ve-sidebar-item href="https://www.example.com" target="_blank">
        <ve-icon slot="prefix" name="folder"></ve-icon>
        VeDesign
      </ve-sidebar-item>
      <ve-sidebar-item href="https://github.com" target="_blank">
        <ve-icon slot="prefix" name="file"></ve-icon>
        GitHub
      </ve-sidebar-item>
    </ve-sidebar-group>
  </ve-sidebar>
  <main style="flex: 1; padding: 24px; color: var(--color-text-primary)">
    主内容
  </main>
</div>
```

### 导航项点击事件

监听 `ve-sidebar-item-click` 可获取导航项的选中状态。事件支持冒泡，可在 `<ve-sidebar>` 上集中处理导航项点击。

```html preview
<svg
  style="position:absolute;width:0;height:0;overflow:hidden"
  aria-hidden="true"
>
  <defs>
    <symbol id="ic-agent-logo" viewBox="0 0 28 28">
      <g transform="translate(2.333,2.333) translate(23.3333,0) scale(-1,1)">
        <path
          fill="currentColor"
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M11.6667 0C12.7234 0 13.3516 0.952589 14.6079 2.85777L21.6122 13.4797C22.9046 15.4397 23.5508 16.4196 23.2676 17.4077C22.9843 18.3958 21.9074 18.9184 19.7536 19.9636L16.382 21.5998C14.0005 22.7555 12.8097 23.3333 11.6667 23.3333C10.5236 23.3333 9.33284 22.7555 6.95134 21.5998L3.5797 19.9636C1.4259 18.9184 0.348998 18.3958 0.0657699 17.4077C-0.217458 16.4196 0.428748 15.4397 1.72116 13.4797L8.72546 2.85777C9.98176 0.952589 10.6099 0 11.6667 0ZM14.6426 5.51707C13.8247 4.26843 13.4158 3.64411 12.7214 3.83713C12.0271 4.03014 12.0271 4.76814 12.0271 6.24413V18.0393C12.0271 19.7582 12.0271 20.6176 12.7145 21.0237C13.402 21.4297 14.1983 21.0407 15.7911 20.2626L19.4666 18.467C20.7526 17.8388 21.3956 17.5247 21.5649 16.9341C21.7343 16.3436 21.3498 15.7565 20.5808 14.5825L14.6426 5.51707Z"
        />
      </g>
    </symbol>
  </defs>
</svg>

<script type="module">
  import '@ve-design/web/ve-sidebar';
  import '@ve-design/web/icons';
</script>

<div style="display:grid; gap:12px">
  <div id="click-tip" style="font-size:13px; color:var(--color-text-primary)">
    点击下方菜单项查看事件详情。
  </div>
  <div style="height: 320px; display: flex">
    <ve-sidebar id="sidebar-click" brand="Agent Design">
      <svg slot="logo" viewBox="0 0 28 28" aria-hidden="true">
        <use href="#ic-agent-logo" />
      </svg>
      <ve-sidebar-group>
        <ve-sidebar-item>
          <ve-icon slot="prefix" name="message-circle-plus"></ve-icon>
          新对话
        </ve-sidebar-item>
        <ve-sidebar-item>
          <ve-icon
            slot="prefix"
            name="message"
            style="color: var(--color-text-tertiary)"
          ></ve-icon>
          项目导航结构说明
        </ve-sidebar-item>
        <ve-sidebar-item disabled>
          <ve-icon slot="prefix" name="more-horizontal"></ve-icon>
          禁用项
        </ve-sidebar-item>
      </ve-sidebar-group>
    </ve-sidebar>
    <main style="flex: 1; padding: 24px; color: var(--color-text-primary)">
      主内容
    </main>
  </div>
</div>

<script>
  const tip = document.getElementById('click-tip');
  document
    .getElementById('sidebar-click')
    .addEventListener('ve-sidebar-item-click', (event) => {
      tip.textContent = '点击：selected=' + event.detail.selected;
    });
</script>
```

### 导航项下拉菜单

将 `<ve-sidebar-item>` 放入 `<ve-dropdown>` 的 `trigger` 插槽，可将完整导航项作为下拉菜单触发器。

```html preview
<svg
  style="position:absolute;width:0;height:0;overflow:hidden"
  aria-hidden="true"
>
  <defs>
    <symbol id="ic-agent-logo" viewBox="0 0 28 28">
      <g transform="translate(2.333,2.333) translate(23.3333,0) scale(-1,1)">
        <path
          fill="currentColor"
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M11.6667 0C12.7234 0 13.3516 0.952589 14.6079 2.85777L21.6122 13.4797C22.9046 15.4397 23.5508 16.4196 23.2676 17.4077C22.9843 18.3958 21.9074 18.9184 19.7536 19.9636L16.382 21.5998C14.0005 22.7555 12.8097 23.3333 11.6667 23.3333C10.5236 23.3333 9.33284 22.7555 6.95134 21.5998L3.5797 19.9636C1.4259 18.9184 0.348998 18.3958 0.0657699 17.4077C-0.217458 16.4196 0.428748 15.4397 1.72116 13.4797L8.72546 2.85777C9.98176 0.952589 10.6099 0 11.6667 0ZM14.6426 5.51707C13.8247 4.26843 13.4158 3.64411 12.7214 3.83713C12.0271 4.03014 12.0271 4.76814 12.0271 6.24413V18.0393C12.0271 19.7582 12.0271 20.6176 12.7145 21.0237C13.402 21.4297 14.1983 21.0407 15.7911 20.2626L19.4666 18.467C20.7526 17.8388 21.3956 17.5247 21.5649 16.9341C21.7343 16.3436 21.3498 15.7565 20.5808 14.5825L14.6426 5.51707Z"
        />
      </g>
    </symbol>
  </defs>
</svg>

<style>
  .dropdown-menu-row ve-icon,
  .group-menu-row ve-icon {
    --ve-icon-size: 16px;
  }
  .dropdown-menu-row,
  .group-menu-row {
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }
</style>

<script type="module">
  import '@ve-design/web/ve-sidebar';
  import '@ve-design/web/ve-button';
  import '@ve-design/web/ve-dropdown';
  import '@ve-design/web/icons';
</script>

<div style="height: 360px; display: flex">
  <ve-sidebar brand="Agent Design">
    <svg slot="logo" viewBox="0 0 28 28" aria-hidden="true">
      <use href="#ic-agent-logo" />
    </svg>

    <ve-sidebar-group>
      <ve-dropdown trigger="click" position="right-start" block>
        <ve-sidebar-item slot="trigger" active>
          <ve-icon slot="prefix" name="more-horizontal"></ve-icon>
          更多
        </ve-sidebar-item>
        <ve-dropdown-item value="option1">
          <span class="dropdown-menu-row">
            <ve-icon name="history"></ve-icon>
            菜单选项
          </span>
        </ve-dropdown-item>
        <ve-dropdown-item value="option2">
          <span class="dropdown-menu-row">
            <ve-icon name="history"></ve-icon>
            菜单选项
          </span>
        </ve-dropdown-item>
        <ve-dropdown-item value="option3">
          <span class="dropdown-menu-row">
            <ve-icon name="history"></ve-icon>
            菜单选项
          </span>
        </ve-dropdown-item>
      </ve-dropdown>
    </ve-sidebar-group>

    <ve-sidebar-group label="项目" with-label>
      <ve-sidebar-item>
        <ve-icon slot="prefix" name="folder"></ve-icon>
        项目名称
      </ve-sidebar-item>
    </ve-sidebar-group>

    <ve-sidebar-group label="历史会话" with-label>
      <ve-dropdown slot="header-suffix" trigger="click" position="right-start">
        <ve-button
          slot="trigger"
          type="text"
          size="small"
          aria-label="排序条件"
        >
          <ve-icon name="settings-slider-ver"></ve-icon>
        </ve-button>
        <ve-dropdown-item value="sort-time">
          <span class="group-menu-row">
            <ve-icon name="history"></ve-icon>
            按时间排序
          </span>
        </ve-dropdown-item>
      </ve-dropdown>
      <ve-sidebar-item>
        <ve-icon slot="prefix" name="message"></ve-icon>
        普通会话
      </ve-sidebar-item>
      <ve-sidebar-item>
        <ve-icon slot="prefix" name="message"></ve-icon>
        普通会话
      </ve-sidebar-item>
    </ve-sidebar-group>
  </ve-sidebar>
  <main style="flex: 1; padding: 24px; color: var(--color-text-primary)">
    点击"更多"菜单项打开下拉菜单
  </main>
</div>
```

### 分组操作

通过 `header-suffix` 插槽在分组标题右侧添加操作入口，可用于排序、筛选或分组管理。

```html preview
<svg
  style="position:absolute;width:0;height:0;overflow:hidden"
  aria-hidden="true"
>
  <defs>
    <symbol id="ic-agent-logo" viewBox="0 0 28 28">
      <g transform="translate(2.333,2.333) translate(23.3333,0) scale(-1,1)">
        <path
          fill="currentColor"
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M11.6667 0C12.7234 0 13.3516 0.952589 14.6079 2.85777L21.6122 13.4797C22.9046 15.4397 23.5508 16.4196 23.2676 17.4077C22.9843 18.3958 21.9074 18.9184 19.7536 19.9636L16.382 21.5998C14.0005 22.7555 12.8097 23.3333 11.6667 23.3333C10.5236 23.3333 9.33284 22.7555 6.95134 21.5998L3.5797 19.9636C1.4259 18.9184 0.348998 18.3958 0.0657699 17.4077C-0.217458 16.4196 0.428748 15.4397 1.72116 13.4797L8.72546 2.85777C9.98176 0.952589 10.6099 0 11.6667 0ZM14.6426 5.51707C13.8247 4.26843 13.4158 3.64411 12.7214 3.83713C12.0271 4.03014 12.0271 4.76814 12.0271 6.24413V18.0393C12.0271 19.7582 12.0271 20.6176 12.7145 21.0237C13.402 21.4297 14.1983 21.0407 15.7911 20.2626L19.4666 18.467C20.7526 17.8388 21.3956 17.5247 21.5649 16.9341C21.7343 16.3436 21.3498 15.7565 20.5808 14.5825L14.6426 5.51707Z"
        />
      </g>
    </symbol>
  </defs>
</svg>

<style>
  .group-menu-row ve-icon {
    --ve-icon-size: 16px;
  }
  .group-menu-row {
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }
</style>

<script type="module">
  import '@ve-design/web/ve-sidebar';
  import '@ve-design/web/ve-button';
  import '@ve-design/web/ve-dropdown';
  import '@ve-design/web/icons';
</script>

<div style="height: 320px; display: flex">
  <ve-sidebar brand="Agent Design">
    <svg slot="logo" viewBox="0 0 28 28" aria-hidden="true">
      <use href="#ic-agent-logo" />
    </svg>

    <ve-sidebar-group>
      <ve-sidebar-item>
        <ve-icon slot="prefix" name="message-circle-plus"></ve-icon>
        新对话
      </ve-sidebar-item>
    </ve-sidebar-group>

    <ve-sidebar-group label="历史会话" with-label>
      <ve-dropdown
        slot="header-suffix"
        trigger="click"
        position="right-start"
        id="group-action-dropdown"
      >
        <ve-button
          slot="trigger"
          type="text"
          size="small"
          aria-label="排序条件"
        >
          <ve-icon name="settings-slider-ver"></ve-icon>
        </ve-button>
        <ve-dropdown-item value="sort-time">
          <span class="group-menu-row">
            <ve-icon name="history"></ve-icon>
            按时间排序
          </span>
        </ve-dropdown-item>
        <ve-dropdown-item value="sort-name">
          <span class="group-menu-row">
            <ve-icon name="menu-align-left"></ve-icon>
            按名称排序
          </span>
        </ve-dropdown-item>
      </ve-dropdown>
      <ve-sidebar-item>
        <ve-icon slot="prefix" name="message"></ve-icon>
        普通会话
      </ve-sidebar-item>
      <ve-sidebar-item>
        <ve-icon slot="prefix" name="message"></ve-icon>
        普通会话
      </ve-sidebar-item>
      <ve-sidebar-item>
        <ve-icon slot="prefix" name="message"></ve-icon>
        普通会话
      </ve-sidebar-item>
    </ve-sidebar-group>
  </ve-sidebar>
  <main style="flex: 1; padding: 24px; color: var(--color-text-primary)">
    <code id="group-action-log">点击分组标题右侧图标打开操作菜单</code>
  </main>
</div>

<script>
  document
    .getElementById('group-action-dropdown')
    .addEventListener('ve-select', (event) => {
      document.getElementById('group-action-log').textContent =
        '操作：' + event.detail.value;
    });
</script>
```

### 可折叠分组

设置 `collapsible` 后，可通过分组标题或键盘 Enter、Space 切换分组状态，并通过 `ve-sidebar-group-toggle` 获取最新状态。

```html preview
<svg
  style="position:absolute;width:0;height:0;overflow:hidden"
  aria-hidden="true"
>
  <defs>
    <symbol id="ic-agent-logo" viewBox="0 0 28 28">
      <g transform="translate(2.333,2.333) translate(23.3333,0) scale(-1,1)">
        <path
          fill="currentColor"
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M11.6667 0C12.7234 0 13.3516 0.952589 14.6079 2.85777L21.6122 13.4797C22.9046 15.4397 23.5508 16.4196 23.2676 17.4077C22.9843 18.3958 21.9074 18.9184 19.7536 19.9636L16.382 21.5998C14.0005 22.7555 12.8097 23.3333 11.6667 23.3333C10.5236 23.3333 9.33284 22.7555 6.95134 21.5998L3.5797 19.9636C1.4259 18.9184 0.348998 18.3958 0.0657699 17.4077C-0.217458 16.4196 0.428748 15.4397 1.72116 13.4797L8.72546 2.85777C9.98176 0.952589 10.6099 0 11.6667 0ZM14.6426 5.51707C13.8247 4.26843 13.4158 3.64411 12.7214 3.83713C12.0271 4.03014 12.0271 4.76814 12.0271 6.24413V18.0393C12.0271 19.7582 12.0271 20.6176 12.7145 21.0237C13.402 21.4297 14.1983 21.0407 15.7911 20.2626L19.4666 18.467C20.7526 17.8388 21.3956 17.5247 21.5649 16.9341C21.7343 16.3436 21.3498 15.7565 20.5808 14.5825L14.6426 5.51707Z"
        />
      </g>
    </symbol>
  </defs>
</svg>

<script type="module">
  import '@ve-design/web/ve-sidebar';
  import '@ve-design/web/icons';
</script>

<div style="display:grid;gap:12px">
  <code id="collapsible-log" style="color:var(--color-text-secondary)"
    >历史会话：展开</code
  >
  <div style="height: 320px; display: flex">
    <ve-sidebar brand="Agent Design">
      <svg slot="logo" viewBox="0 0 28 28" aria-hidden="true">
        <use href="#ic-agent-logo" />
      </svg>
      <ve-sidebar-group>
        <ve-sidebar-item
          ><ve-icon slot="prefix" name="message-circle-plus"></ve-icon
          >新对话</ve-sidebar-item
        >
        <ve-sidebar-item
          ><ve-icon slot="prefix" name="search"></ve-icon>搜索</ve-sidebar-item
        >
      </ve-sidebar-group>
      <ve-sidebar-group id="collapsible-history" label="历史会话" collapsible>
        <ve-sidebar-item
          ><ve-icon slot="prefix" name="message"></ve-icon
          >项目导航结构说明</ve-sidebar-item
        >
        <ve-sidebar-item
          ><ve-icon slot="prefix" name="message"></ve-icon
          >组件状态复盘</ve-sidebar-item
        >
        <ve-sidebar-item
          ><ve-icon slot="prefix" name="message"></ve-icon
          >发布计划整理</ve-sidebar-item
        >
      </ve-sidebar-group>
    </ve-sidebar>
    <main style="flex: 1; padding: 24px; color: var(--color-text-primary)">
      主内容
    </main>
  </div>
</div>

<script>
  document
    .getElementById('collapsible-history')
    .addEventListener('ve-sidebar-group-toggle', (event) => {
      document.getElementById('collapsible-log').textContent =
        event.detail.label + '：' + (event.detail.collapsed ? '折叠' : '展开');
    });
</script>
```

### 会话项操作菜单

通过 `suffix` 插槽可为会话项添加上下文操作，并与 `<ve-dropdown>` 组合提供置顶、分享、重命名或删除等功能。操作入口在导航项悬停或获得键盘焦点时显示。

```html preview
<svg
  style="position:absolute;width:0;height:0;overflow:hidden"
  aria-hidden="true"
>
  <defs>
    <symbol id="ic-agent-logo" viewBox="0 0 28 28">
      <g transform="translate(2.333,2.333) translate(23.3333,0) scale(-1,1)">
        <path
          fill="currentColor"
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M11.6667 0C12.7234 0 13.3516 0.952589 14.6079 2.85777L21.6122 13.4797C22.9046 15.4397 23.5508 16.4196 23.2676 17.4077C22.9843 18.3958 21.9074 18.9184 19.7536 19.9636L16.382 21.5998C14.0005 22.7555 12.8097 23.3333 11.6667 23.3333C10.5236 23.3333 9.33284 22.7555 6.95134 21.5998L3.5797 19.9636C1.4259 18.9184 0.348998 18.3958 0.0657699 17.4077C-0.217458 16.4196 0.428748 15.4397 1.72116 13.4797L8.72546 2.85777C9.98176 0.952589 10.6099 0 11.6667 0ZM14.6426 5.51707C13.8247 4.26843 13.4158 3.64411 12.7214 3.83713C12.0271 4.03014 12.0271 4.76814 12.0271 6.24413V18.0393C12.0271 19.7582 12.0271 20.6176 12.7145 21.0237C13.402 21.4297 14.1983 21.0407 15.7911 20.2626L19.4666 18.467C20.7526 17.8388 21.3956 17.5247 21.5649 16.9341C21.7343 16.3436 21.3498 15.7565 20.5808 14.5825L14.6426 5.51707Z"
        />
      </g>
    </symbol>
  </defs>
</svg>

<style>
  ve-sidebar-item [slot='suffix'] {
    opacity: 0;
    transition: opacity var(--motion-fast) var(--ease-standard);
  }
  ve-sidebar-item:hover [slot='suffix'],
  ve-sidebar-item:focus-within [slot='suffix'] {
    opacity: 1;
  }
  .history-menu-row ve-icon {
    --ve-icon-size: 16px;
  }
  .history-menu-row {
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }
</style>

<script type="module">
  import '@ve-design/web/ve-sidebar';
  import '@ve-design/web/ve-button';
  import '@ve-design/web/ve-dropdown';
  import '@ve-design/web/icons';
</script>

<div style="height: 320px; display: flex">
  <ve-sidebar brand="Agent Design">
    <svg slot="logo" viewBox="0 0 28 28" aria-hidden="true">
      <use href="#ic-agent-logo" />
    </svg>
    <ve-sidebar-group>
      <ve-sidebar-item
        ><ve-icon slot="prefix" name="message-circle-plus"></ve-icon
        >新对话</ve-sidebar-item
      >
    </ve-sidebar-group>
    <ve-sidebar-group label="历史会话">
      <ve-sidebar-item active>
        <ve-icon slot="prefix" name="message"></ve-icon>
        项目导航结构说明
        <ve-dropdown
          slot="suffix"
          trigger="click"
          position="right-start"
          id="ctx-dropdown-1"
        >
          <ve-button
            slot="trigger"
            class="ctx-menu-trigger"
            type="text"
            size="small"
            aria-label="更多操作"
          >
            <ve-icon name="more-horizontal"></ve-icon>
          </ve-button>
          <ve-dropdown-item value="pin"
            ><span class="history-menu-row"
              ><ve-icon name="bookmark"></ve-icon>置顶</span
            ></ve-dropdown-item
          >
          <ve-dropdown-item value="share"
            ><span class="history-menu-row"
              ><ve-icon name="share"></ve-icon>分享</span
            ></ve-dropdown-item
          >
          <ve-dropdown-item value="rename"
            ><span class="history-menu-row"
              ><ve-icon name="edit"></ve-icon>重命名</span
            ></ve-dropdown-item
          >
          <ve-dropdown-divider></ve-dropdown-divider>
          <ve-dropdown-item value="delete" danger
            ><span class="history-menu-row"
              ><ve-icon name="trash-03"></ve-icon>删除</span
            ></ve-dropdown-item
          >
        </ve-dropdown>
      </ve-sidebar-item>
      <ve-sidebar-item>
        <ve-icon slot="prefix" name="message"></ve-icon>
        组件状态复盘
        <ve-dropdown
          slot="suffix"
          trigger="click"
          position="right-start"
          id="ctx-dropdown-2"
        >
          <ve-button
            slot="trigger"
            class="ctx-menu-trigger"
            type="text"
            size="small"
            aria-label="更多操作"
          >
            <ve-icon name="more-horizontal"></ve-icon>
          </ve-button>
          <ve-dropdown-item value="pin"
            ><span class="history-menu-row"
              ><ve-icon name="bookmark"></ve-icon>置顶</span
            ></ve-dropdown-item
          >
          <ve-dropdown-item value="share"
            ><span class="history-menu-row"
              ><ve-icon name="share"></ve-icon>分享</span
            ></ve-dropdown-item
          >
          <ve-dropdown-item value="rename"
            ><span class="history-menu-row"
              ><ve-icon name="edit"></ve-icon>重命名</span
            ></ve-dropdown-item
          >
          <ve-dropdown-divider></ve-dropdown-divider>
          <ve-dropdown-item value="delete" danger
            ><span class="history-menu-row"
              ><ve-icon name="trash-03"></ve-icon>删除</span
            ></ve-dropdown-item
          >
        </ve-dropdown>
      </ve-sidebar-item>
      <ve-sidebar-item>
        <ve-icon slot="prefix" name="message"></ve-icon>
        发布计划整理
        <ve-dropdown
          slot="suffix"
          trigger="click"
          position="right-start"
          id="ctx-dropdown-3"
        >
          <ve-button
            slot="trigger"
            class="ctx-menu-trigger"
            type="text"
            size="small"
            aria-label="更多操作"
          >
            <ve-icon name="more-horizontal"></ve-icon>
          </ve-button>
          <ve-dropdown-item value="pin"
            ><span class="history-menu-row"
              ><ve-icon name="bookmark"></ve-icon>置顶</span
            ></ve-dropdown-item
          >
          <ve-dropdown-item value="share"
            ><span class="history-menu-row"
              ><ve-icon name="share"></ve-icon>分享</span
            ></ve-dropdown-item
          >
          <ve-dropdown-item value="rename"
            ><span class="history-menu-row"
              ><ve-icon name="edit"></ve-icon>重命名</span
            ></ve-dropdown-item
          >
          <ve-dropdown-divider></ve-dropdown-divider>
          <ve-dropdown-item value="delete" danger
            ><span class="history-menu-row"
              ><ve-icon name="trash-03"></ve-icon>删除</span
            ></ve-dropdown-item
          >
        </ve-dropdown>
      </ve-sidebar-item>
    </ve-sidebar-group>
  </ve-sidebar>
  <main style="flex: 1; padding: 24px; color: var(--color-text-primary)">
    <code id="ctx-log">hover 会话项后点击右侧 "..." 按钮打开操作菜单</code>
  </main>
</div>

<script>
  ['ctx-dropdown-1', 'ctx-dropdown-2', 'ctx-dropdown-3'].forEach((id) => {
    document.getElementById(id).addEventListener('ve-select', (event) => {
      document.getElementById('ctx-log').textContent =
        '操作：' + event.detail.value;
    });
  });
</script>
```

## API

### `<ve-sidebar>`

#### 属性

| 属性                               | 类型      | 默认值   | 说明                                     |
| ---------------------------------- | --------- | -------- | ---------------------------------------- |
| `collapsed`                        | `boolean` | `false`  | 是否折叠。                               |
| `brand`                            | `string`  | `''`     | 品牌名称，折叠状态下隐藏。               |
| `with-footer` / `withFooter`       | `boolean` | `false`  | 是否启用底部区域。                       |
| `expand-tooltip` / `expandTooltip` | `string`  | `'展开'` | 折叠状态下品牌标识的展开提示。           |
| `hide-scrollbar` / `hideScrollbar` | `boolean` | `false`  | 是否隐藏内容区滚动条，滚动能力不受影响。 |

#### 方法

| 方法       | 说明                                              |
| ---------- | ------------------------------------------------- |
| `toggle()` | 切换 `collapsed` 状态并派发 `ve-sidebar-toggle`。 |

#### 事件

| 事件                | `event.detail` 类型      | 说明                 |
| ------------------- | ------------------------ | -------------------- |
| `ve-sidebar-toggle` | `{ collapsed: boolean }` | 折叠状态改变时派发。 |

#### 插槽

| Slot          | 说明                                                           |
| ------------- | -------------------------------------------------------------- |
| 默认          | 导航内容，通常为 `<ve-sidebar-group>` 或 `<ve-sidebar-item>`。 |
| `logo`        | 品牌标识；折叠状态下同时作为展开触发器。                       |
| `pinned`      | 固定在内容区顶部的内容，通常为 `<ve-sidebar-group>`。          |
| `footer`      | 底部自定义内容，需配合 `with-footer` 启用。                    |
| `toggle-icon` | 自定义折叠按钮图标。                                           |

### `<ve-sidebar-group>`

#### 属性

| 属性                       | 类型      | 默认值  | 说明                                                 |
| -------------------------- | --------- | ------- | ---------------------------------------------------- |
| `label`                    | `string`  | `''`    | 分组标题。                                           |
| `collapsible`              | `boolean` | `false` | 是否允许切换分组的展开状态。                         |
| `collapsed`                | `boolean` | `false` | 分组是否折叠。                                       |
| `with-label` / `withLabel` | `boolean` | `false` | 未设置 `label` 时，是否为 `label` 插槽显示标题区域。 |

#### 方法

| 方法       | 说明                                              |
| ---------- | ------------------------------------------------- |
| `toggle()` | 仅在 `collapsible` 为 `true` 时切换 `collapsed`。 |

#### 事件

| 事件                      | `event.detail` 类型                     | 说明                   |
| ------------------------- | --------------------------------------- | ---------------------- |
| `ve-sidebar-group-toggle` | `{ collapsed: boolean; label: string }` | 可折叠分组切换时派发。 |

#### 插槽

| Slot            | 说明                                       |
| --------------- | ------------------------------------------ |
| 默认            | 分组内容，通常为若干 `<ve-sidebar-item>`。 |
| `label`         | 自定义分组标题内容，优先于 `label` 属性。  |
| `header-suffix` | 分组标题右侧的自定义内容。                 |

### `<ve-sidebar-item>`

#### 属性

| 属性       | 类型      | 默认值    | 说明                                                                    |
| ---------- | --------- | --------- | ----------------------------------------------------------------------- |
| `href`     | `string`  | `''`      | 设置后渲染为 `<a>`，否则为 `<button>`。                                 |
| `target`   | `string`  | `'_self'` | 仅在 `href` 设置时生效；`_blank` 自动追加 `rel="noreferrer noopener"`。 |
| `selected` | `boolean` | `false`   | 选中态（路由当前页），渲染为 `aria-current="page"`。                    |
| `active`   | `boolean` | `false`   | 是否处于临时激活状态。                                                  |
| `disabled` | `boolean` | `false`   | 是否禁用；禁用时不派发点击事件。                                        |
| `loading`  | `boolean` | `false`   | 是否显示加载状态。                                                      |
| `unread`   | `boolean` | `false`   | 是否显示未读提示。                                                      |
| `shortcut` | `string`  | `''`      | 快捷键说明；折叠状态下同时显示在提示信息中。                            |
| `tooltip`  | `string`  | `''`      | 折叠状态下的提示文案，需显式设置。                                      |

#### 事件

| 事件                    | `event.detail` 类型     | 说明                                        |
| ----------------------- | ----------------------- | ------------------------------------------- |
| `ve-sidebar-item-click` | `{ selected: boolean }` | 非禁用项点击时派发，冒泡到 `<ve-sidebar>`。 |

#### 插槽

| Slot     | 说明                                                 |
| -------- | ---------------------------------------------------- |
| 默认     | 菜单项标签文本。                                     |
| `prefix` | 导航项前置内容，通常为图标。                         |
| `suffix` | 导航项后置内容，可与加载、未读和快捷键信息共同使用。 |
