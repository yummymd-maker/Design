`Sidebar` 用于构建应用的常驻侧边导航，适合承载主要操作、业务入口、项目列表和历史记录等内容。组件支持展开与折叠、固定区域、可滚动内容及自定义底部区域。

## 组件构成

- `Sidebar`：侧边导航容器，提供品牌区、内容区、固定区和底部区域。
- `SidebarGroup`：导航分组，用于组织相关菜单项，支持标题和分组折叠。
- `SidebarItem`：导航项，支持选中、激活、禁用、加载、未读、快捷键、链接和提示信息等能力。

折叠后保留品牌标识和导航项图标，并通过提示信息补充导航项名称与快捷键。底部区域可组合 `Avatar`、`Dropdown` 等组件，用于呈现当前用户及账户相关操作。

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
- 在 `footer` 中使用 `SidebarItem` 承载用户信息或账户入口，以保持一致的交互语义。

## 引入组件

```tsx
import { Sidebar, SidebarGroup, SidebarItem } from '@ve-design/react';
import { IconMessageCirclePlus } from '@ve-design/react/icons';
```

## 示例

### 基础用法

使用 `SidebarGroup` 组织功能入口、项目和历史会话，并通过 `footer` 提供用户菜单。导航项的 `prefix` 和 `suffix` 可分别放置图标与附加操作。

```tsx preview
import {
  Avatar,
  Button,
  Dropdown,
  DropdownDivider,
  DropdownItem,
  Sidebar,
  SidebarGroup,
  SidebarItem,
} from '@ve-design/react';
import {
  IconFile,
  IconFolder,
  IconMessage,
  IconMessageCirclePlus,
  IconMoreHorizontal,
  IconSearch,
} from '@ve-design/react/icons';

function SidebarBasicDemo() {
  const logo = (
    <svg aria-hidden="true" viewBox="0 0 28 28">
      <g transform="translate(2.333,2.333) translate(23.3333,0) scale(-1,1)">
        <path
          fill="currentColor"
          fillRule="evenodd"
          clipRule="evenodd"
          d="M11.6667 0C12.7234 0 13.3516 0.952589 14.6079 2.85777L21.6122 13.4797C22.9046 15.4397 23.5508 16.4196 23.2676 17.4077C22.9843 18.3958 21.9074 18.9184 19.7536 19.9636L16.382 21.5998C14.0005 22.7555 12.8097 23.3333 11.6667 23.3333C10.5236 23.3333 9.33284 22.7555 6.95134 21.5998L3.5797 19.9636C1.4259 18.9184 0.348998 18.3958 0.0657699 17.4077C-0.217458 16.4196 0.428748 15.4397 1.72116 13.4797L8.72546 2.85777C9.98176 0.952589 10.6099 0 11.6667 0ZM14.6426 5.51707C13.8247 4.26843 13.4158 3.64411 12.7214 3.83713C12.0271 4.03014 12.0271 4.76814 12.0271 6.24413V18.0393C12.0271 19.7582 12.0271 20.6176 12.7145 21.0237C13.402 21.4297 14.1983 21.0407 15.7911 20.2626L19.4666 18.467C20.7526 17.8388 21.3956 17.5247 21.5649 16.9341C21.7343 16.3436 21.3498 15.7565 20.5808 14.5825L14.6426 5.51707Z"
        />
      </g>
    </svg>
  );

  const actionMenu = (id: string) => (
    <Dropdown
      trigger="click"
      position="right-start"
      triggerNode={
        <Button type="text" size="small" aria-label="更多操作">
          <IconMoreHorizontal />
        </Button>
      }
    >
      <DropdownItem value={`${id}-pin`}>置顶</DropdownItem>
      <DropdownItem value={`${id}-share`}>分享</DropdownItem>
      <DropdownItem value={`${id}-rename`}>重命名</DropdownItem>
      <DropdownDivider />
      <DropdownItem value={`${id}-delete`} danger>
        删除
      </DropdownItem>
    </Dropdown>
  );

  const userFooter = (
    <Dropdown
      trigger="click"
      position="top-start"
      block
      triggerNode={
        <SidebarItem
          tooltip="用户菜单"
          prefix={
            <Avatar size={24}>
              <img
                src="https://s1-imfile.feishucdn.com/static-resource/v1/v3_00ac_494d75fe-848a-4249-891d-05a0c0ba98eg~?image_size=80x80&cut_type=&quality=&format=png&sticker_format=.webp"
                alt="凌云松"
              />
            </Avatar>
          }
        >
          凌云松
        </SidebarItem>
      }
    >
      <DropdownItem value="account" disabled>
        user@example.com
      </DropdownItem>
      <DropdownItem value="settings">设置</DropdownItem>
      <DropdownItem value="quota">剩余额度</DropdownItem>
      <DropdownItem value="help">帮助与反馈</DropdownItem>
      <DropdownDivider />
      <DropdownItem value="logout" danger>
        退出登录
      </DropdownItem>
    </Dropdown>
  );

  return (
    <div style={{ height: 480, display: 'flex' }}>
      <Sidebar brand="Agent Design" logo={logo} footer={userFooter} withFooter>
        <SidebarGroup>
          <SidebarItem prefix={<IconMessageCirclePlus />}>新对话</SidebarItem>
          <SidebarItem prefix={<IconSearch />}>搜索</SidebarItem>
          <SidebarItem prefix={<IconFile />}>文件库</SidebarItem>
          <SidebarItem prefix={<IconMoreHorizontal />}>更多</SidebarItem>
        </SidebarGroup>

        <SidebarGroup label="项目">
          <SidebarItem prefix={<IconFolder />}>项目名称</SidebarItem>
        </SidebarGroup>

        <SidebarGroup label="历史会话">
          <SidebarItem
            prefix={<IconMessage />}
            suffix={actionMenu('unread')}
            unread
          >
            普通会话
          </SidebarItem>
          <SidebarItem
            prefix={<IconMessage />}
            suffix={actionMenu('loading')}
            loading
          >
            普通会话
          </SidebarItem>
          <SidebarItem prefix={<IconMessage />} suffix={actionMenu('normal')}>
            普通会话
          </SidebarItem>
        </SidebarGroup>
      </Sidebar>

      <main style={{ flex: 1, padding: 24 }}>Agent 主内容区域</main>
    </div>
  );
}
```

### 折叠 / 展开

通过 `collapsed` 控制侧边导航的展开与折叠。折叠状态保留品牌标识和导航项图标，并通过 `tooltip` 提供文字说明；`expandTooltip` 用于设置品牌标识上的展开提示。状态变化时会触发 `onToggle`。

```tsx preview
import { useState } from 'react';
import {
  Avatar,
  Button,
  Dropdown,
  DropdownDivider,
  DropdownItem,
  Sidebar,
  SidebarGroup,
  SidebarItem,
} from '@ve-design/react';
import {
  IconFile,
  IconFolder,
  IconMessage,
  IconMessageCirclePlus,
  IconSearch,
} from '@ve-design/react/icons';

function SidebarCollapsedDemo() {
  const [collapsed, setCollapsed] = useState(true);

  return (
    <section style={{ display: 'grid', gap: 16 }}>
      <div>
        <Button
          type="secondary"
          size="small"
          onClick={() => setCollapsed((value) => !value)}
        >
          切换折叠
        </Button>
      </div>

      <div style={{ height: 520, display: 'flex' }}>
        <Sidebar
          collapsed={collapsed}
          withFooter
          expandTooltip="展开侧边栏"
          logo={
            <svg aria-hidden="true" viewBox="0 0 28 28">
              <g transform="translate(2.333,2.333) translate(23.3333,0) scale(-1,1)">
                <path
                  fill="currentColor"
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M11.6667 0C12.7234 0 13.3516 0.952589 14.6079 2.85777L21.6122 13.4797C22.9046 15.4397 23.5508 16.4196 23.2676 17.4077C22.9843 18.3958 21.9074 18.9184 19.7536 19.9636L16.382 21.5998C14.0005 22.7555 12.8097 23.3333 11.6667 23.3333C10.5236 23.3333 9.33284 22.7555 6.95134 21.5998L3.5797 19.9636C1.4259 18.9184 0.348998 18.3958 0.0657699 17.4077C-0.217458 16.4196 0.428748 15.4397 1.72116 13.4797L8.72546 2.85777C9.98176 0.952589 10.6099 0 11.6667 0ZM14.6426 5.51707C13.8247 4.26843 13.4158 3.64411 12.7214 3.83713C12.0271 4.03014 12.0271 4.76814 12.0271 6.24413V18.0393C12.0271 19.7582 12.0271 20.6176 12.7145 21.0237C13.402 21.4297 14.1983 21.0407 15.7911 20.2626L19.4666 18.467C20.7526 17.8388 21.3956 17.5247 21.5649 16.9341C21.7343 16.3436 21.3498 15.7565 20.5808 14.5825L14.6426 5.51707Z"
                />
              </g>
            </svg>
          }
          footer={
            <Dropdown
              trigger="click"
              position="top-start"
              block
              triggerNode={
                <SidebarItem
                  tooltip="用户菜单"
                  prefix={
                    <Avatar size={24}>
                      <img
                        src="https://s1-imfile.feishucdn.com/static-resource/v1/v3_00ac_494d75fe-848a-4249-891d-05a0c0ba98eg~?image_size=80x80&cut_type=&quality=&format=png&sticker_format=.webp"
                        alt="凌云松"
                      />
                    </Avatar>
                  }
                >
                  凌云松
                </SidebarItem>
              }
            >
              <DropdownItem value="account" disabled>
                user@example.com
              </DropdownItem>
              <DropdownItem value="settings">设置</DropdownItem>
              <DropdownItem value="quota">剩余额度</DropdownItem>
              <DropdownItem value="help">帮助与反馈</DropdownItem>
              <DropdownDivider />
              <DropdownItem value="logout" danger>
                退出登录
              </DropdownItem>
            </Dropdown>
          }
          onToggle={(event) => setCollapsed(event.detail.collapsed)}
        >
          <SidebarGroup>
            <SidebarItem prefix={<IconMessageCirclePlus />} tooltip="新对话">
              新对话
            </SidebarItem>
            <SidebarItem prefix={<IconSearch />} tooltip="搜索">
              搜索
            </SidebarItem>
            <SidebarItem prefix={<IconFile />} tooltip="文件库">
              文件库
            </SidebarItem>
            <SidebarItem prefix={<IconFolder />} tooltip="项目">
              项目
            </SidebarItem>
          </SidebarGroup>
          <SidebarGroup>
            <Dropdown
              trigger="click"
              position="right-start"
              block
              triggerNode={
                <SidebarItem prefix={<IconMessage />} tooltip="历史会话">
                  历史会话
                </SidebarItem>
              }
            >
              <DropdownItem value="h1">项目导航结构说明</DropdownItem>
              <DropdownItem value="h2">组件状态复盘</DropdownItem>
              <DropdownItem value="h3">发布计划整理</DropdownItem>
            </Dropdown>
          </SidebarGroup>
        </Sidebar>
        <main
          style={{ flex: 1, padding: 24, color: 'var(--color-text-primary)' }}
        >
          主内容
        </main>
      </div>
    </section>
  );
}
```

### 固定区域与滚动内容

通过 `pinned` 放置需要持续可见的主要操作。`children` 位于可滚动区域，适合承载项目列表、历史记录等动态内容。

```tsx preview
import {
  Avatar,
  Dropdown,
  DropdownDivider,
  DropdownItem,
  Sidebar,
  SidebarGroup,
  SidebarItem,
} from '@ve-design/react';
import {
  IconFile,
  IconFolder,
  IconMessage,
  IconMessageCirclePlus,
  IconMoreHorizontal,
  IconSearch,
} from '@ve-design/react/icons';

function SidebarPinnedDemo() {
  const pinnedActions = (
    <SidebarGroup>
      <SidebarItem prefix={<IconMessageCirclePlus />}>新对话</SidebarItem>
      <SidebarItem prefix={<IconSearch />}>搜索</SidebarItem>
      <SidebarItem prefix={<IconFile />}>文件库</SidebarItem>
      <SidebarItem prefix={<IconMoreHorizontal />}>更多</SidebarItem>
    </SidebarGroup>
  );

  return (
    <div style={{ height: 520, display: 'flex' }}>
      <Sidebar
        brand="Agent Design"
        withFooter
        logo={
          <svg aria-hidden="true" viewBox="0 0 28 28">
            <g transform="translate(2.333,2.333) translate(23.3333,0) scale(-1,1)">
              <path
                fill="currentColor"
                fillRule="evenodd"
                clipRule="evenodd"
                d="M11.6667 0C12.7234 0 13.3516 0.952589 14.6079 2.85777L21.6122 13.4797C22.9046 15.4397 23.5508 16.4196 23.2676 17.4077C22.9843 18.3958 21.9074 18.9184 19.7536 19.9636L16.382 21.5998C14.0005 22.7555 12.8097 23.3333 11.6667 23.3333C10.5236 23.3333 9.33284 22.7555 6.95134 21.5998L3.5797 19.9636C1.4259 18.9184 0.348998 18.3958 0.0657699 17.4077C-0.217458 16.4196 0.428748 15.4397 1.72116 13.4797L8.72546 2.85777C9.98176 0.952589 10.6099 0 11.6667 0ZM14.6426 5.51707C13.8247 4.26843 13.4158 3.64411 12.7214 3.83713C12.0271 4.03014 12.0271 4.76814 12.0271 6.24413V18.0393C12.0271 19.7582 12.0271 20.6176 12.7145 21.0237C13.402 21.4297 14.1983 21.0407 15.7911 20.2626L19.4666 18.467C20.7526 17.8388 21.3956 17.5247 21.5649 16.9341C21.7343 16.3436 21.3498 15.7565 20.5808 14.5825L14.6426 5.51707Z"
              />
            </g>
          </svg>
        }
        pinned={pinnedActions}
        footer={
          <Dropdown
            trigger="click"
            position="top-start"
            block
            triggerNode={
              <SidebarItem
                tooltip="用户菜单"
                prefix={
                  <Avatar size={24}>
                    <img
                      src="https://s1-imfile.feishucdn.com/static-resource/v1/v3_00ac_494d75fe-848a-4249-891d-05a0c0ba98eg~?image_size=80x80&cut_type=&quality=&format=png&sticker_format=.webp"
                      alt="凌云松"
                    />
                  </Avatar>
                }
              >
                凌云松
              </SidebarItem>
            }
          >
            <DropdownItem value="account" disabled>
              user@example.com
            </DropdownItem>
            <DropdownItem value="settings">设置</DropdownItem>
            <DropdownItem value="quota">剩余额度</DropdownItem>
            <DropdownItem value="help">帮助与反馈</DropdownItem>
            <DropdownDivider />
            <DropdownItem value="logout" danger>
              退出登录
            </DropdownItem>
          </Dropdown>
        }
      >
        <SidebarGroup label="项目">
          <SidebarItem prefix={<IconFolder />}>项目名称</SidebarItem>
        </SidebarGroup>

        <SidebarGroup label="历史会话">
          {Array.from({ length: 12 }).map((_, index) => (
            <SidebarItem key={index} prefix={<IconMessage />}>
              历史对话内容 {index + 1}
            </SidebarItem>
          ))}
        </SidebarGroup>
      </Sidebar>
      <main
        style={{ flex: 1, padding: 24, color: 'var(--color-text-primary)' }}
      >
        主内容
      </main>
    </div>
  );
}
```

### 隐藏滚动条

内容溢出时默认显示滚动条。设置 `hideScrollbar` 可隐藏滚动条，同时保留鼠标滚轮和触控板滚动能力。

```tsx preview
import { useState } from 'react';
import {
  Avatar,
  Button,
  Dropdown,
  DropdownDivider,
  DropdownItem,
  Sidebar,
  SidebarGroup,
  SidebarItem,
} from '@ve-design/react';
import { IconMessage, IconMessageCirclePlus } from '@ve-design/react/icons';

function SidebarHideScrollbarDemo() {
  const [hideScrollbar, setHideScrollbar] = useState(false);

  const footer = (
    <Dropdown
      trigger="click"
      position="top-start"
      block
      triggerNode={
        <SidebarItem
          tooltip="用户菜单"
          prefix={
            <Avatar size={24}>
              <img
                src="https://s1-imfile.feishucdn.com/static-resource/v1/v3_00ac_494d75fe-848a-4249-891d-05a0c0ba98eg~?image_size=80x80&cut_type=&quality=&format=png&sticker_format=.webp"
                alt="凌云松"
              />
            </Avatar>
          }
        >
          凌云松
        </SidebarItem>
      }
    >
      <DropdownItem value="account" disabled>
        user@example.com
      </DropdownItem>
      <DropdownItem value="settings">设置</DropdownItem>
      <DropdownItem value="quota">剩余额度</DropdownItem>
      <DropdownItem value="help">帮助与反馈</DropdownItem>
      <DropdownDivider />
      <DropdownItem value="logout" danger>
        退出登录
      </DropdownItem>
    </Dropdown>
  );

  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Button
          type="secondary"
          size="small"
          onClick={() => setHideScrollbar((value) => !value)}
        >
          切换滚动条
        </Button>
        <span style={{ fontSize: 13, color: 'var(--color-text-primary)' }}>
          当前：{hideScrollbar ? '隐藏滚动条' : '显示滚动条'}
        </span>
      </div>
      <div style={{ height: 360, display: 'flex' }}>
        <Sidebar
          brand="Agent Design"
          logo={
            <svg aria-hidden="true" viewBox="0 0 28 28">
              <g transform="translate(2.333,2.333) translate(23.3333,0) scale(-1,1)">
                <path
                  fill="currentColor"
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M11.6667 0C12.7234 0 13.3516 0.952589 14.6079 2.85777L21.6122 13.4797C22.9046 15.4397 23.5508 16.4196 23.2676 17.4077C22.9843 18.3958 21.9074 18.9184 19.7536 19.9636L16.382 21.5998C14.0005 22.7555 12.8097 23.3333 11.6667 23.3333C10.5236 23.3333 9.33284 22.7555 6.95134 21.5998L3.5797 19.9636C1.4259 18.9184 0.348998 18.3958 0.0657699 17.4077C-0.217458 16.4196 0.428748 15.4397 1.72116 13.4797L8.72546 2.85777C9.98176 0.952589 10.6099 0 11.6667 0ZM14.6426 5.51707C13.8247 4.26843 13.4158 3.64411 12.7214 3.83713C12.0271 4.03014 12.0271 4.76814 12.0271 6.24413V18.0393C12.0271 19.7582 12.0271 20.6176 12.7145 21.0237C13.402 21.4297 14.1983 21.0407 15.7911 20.2626L19.4666 18.467C20.7526 17.8388 21.3956 17.5247 21.5649 16.9341C21.7343 16.3436 21.3498 15.7565 20.5808 14.5825L14.6426 5.51707Z"
                />
              </g>
            </svg>
          }
          hideScrollbar={hideScrollbar}
          withFooter
          footer={footer}
          pinned={
            <SidebarGroup>
              <SidebarItem prefix={<IconMessageCirclePlus />}>
                新对话
              </SidebarItem>
            </SidebarGroup>
          }
        >
          <SidebarGroup label="历史会话">
            {Array.from({ length: 12 }).map((_, index) => (
              <SidebarItem key={index} prefix={<IconMessage />}>
                历史对话内容 {index + 1}
              </SidebarItem>
            ))}
          </SidebarGroup>
        </Sidebar>
        <main
          style={{ flex: 1, padding: 24, color: 'var(--color-text-primary)' }}
        >
          主内容
        </main>
      </div>
    </div>
  );
}
```

### 导航项状态

`SidebarItem` 支持选中、激活、禁用、加载和未读状态。可通过 `shortcut` 显示快捷键，通过 `suffix` 添加辅助信息或操作。

```tsx preview
import { Sidebar, SidebarGroup, SidebarItem } from '@ve-design/react';
import {
  IconMessage,
  IconMessageCirclePlus,
  IconMoreHorizontal,
  IconSearch,
} from '@ve-design/react/icons';

<div style={{ height: 420, display: 'flex' }}>
  <Sidebar
    brand="Agent Design"
    logo={
      <svg aria-hidden="true" viewBox="0 0 28 28">
        <g transform="translate(2.333,2.333) translate(23.3333,0) scale(-1,1)">
          <path
            fill="currentColor"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M11.6667 0C12.7234 0 13.3516 0.952589 14.6079 2.85777L21.6122 13.4797C22.9046 15.4397 23.5508 16.4196 23.2676 17.4077C22.9843 18.3958 21.9074 18.9184 19.7536 19.9636L16.382 21.5998C14.0005 22.7555 12.8097 23.3333 11.6667 23.3333C10.5236 23.3333 9.33284 22.7555 6.95134 21.5998L3.5797 19.9636C1.4259 18.9184 0.348998 18.3958 0.0657699 17.4077C-0.217458 16.4196 0.428748 15.4397 1.72116 13.4797L8.72546 2.85777C9.98176 0.952589 10.6099 0 11.6667 0ZM14.6426 5.51707C13.8247 4.26843 13.4158 3.64411 12.7214 3.83713C12.0271 4.03014 12.0271 4.76814 12.0271 6.24413V18.0393C12.0271 19.7582 12.0271 20.6176 12.7145 21.0237C13.402 21.4297 14.1983 21.0407 15.7911 20.2626L19.4666 18.467C20.7526 17.8388 21.3956 17.5247 21.5649 16.9341C21.7343 16.3436 21.3498 15.7565 20.5808 14.5825L14.6426 5.51707Z"
          />
        </g>
      </svg>
    }
  >
    <SidebarGroup label="主操作">
      <SidebarItem selected shortcut="⌘K" prefix={<IconMessageCirclePlus />}>
        新对话
      </SidebarItem>
      <SidebarItem active prefix={<IconSearch />}>
        搜索
      </SidebarItem>
      <SidebarItem disabled prefix={<IconMoreHorizontal />}>
        Agent (敬请期待)
      </SidebarItem>
    </SidebarGroup>

    <SidebarGroup label="历史会话">
      <SidebarItem prefix={<IconMessage />} unread>
        未读消息提示
      </SidebarItem>
      <SidebarItem prefix={<IconMessage />} loading>
        正在生成总结
      </SidebarItem>
      <SidebarItem prefix={<IconMessage />}>普通会话</SidebarItem>
    </SidebarGroup>
  </Sidebar>
  <main style={{ flex: 1, padding: 24, color: 'var(--color-text-primary)' }}>
    主内容
  </main>
</div>;
```

### 链接导航项

设置 `href` 后，导航项以链接形式呈现；可通过 `target` 指定打开方式。

```tsx preview
import { Sidebar, SidebarGroup, SidebarItem } from '@ve-design/react';
import { IconFile, IconFolder } from '@ve-design/react/icons';

<div style={{ height: 320, display: 'flex' }}>
  <Sidebar
    brand="Agent Design"
    logo={
      <svg aria-hidden="true" viewBox="0 0 28 28">
        <g transform="translate(2.333,2.333) translate(23.3333,0) scale(-1,1)">
          <path
            fill="currentColor"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M11.6667 0C12.7234 0 13.3516 0.952589 14.6079 2.85777L21.6122 13.4797C22.9046 15.4397 23.5508 16.4196 23.2676 17.4077C22.9843 18.3958 21.9074 18.9184 19.7536 19.9636L16.382 21.5998C14.0005 22.7555 12.8097 23.3333 11.6667 23.3333C10.5236 23.3333 9.33284 22.7555 6.95134 21.5998L3.5797 19.9636C1.4259 18.9184 0.348998 18.3958 0.0657699 17.4077C-0.217458 16.4196 0.428748 15.4397 1.72116 13.4797L8.72546 2.85777C9.98176 0.952589 10.6099 0 11.6667 0ZM14.6426 5.51707C13.8247 4.26843 13.4158 3.64411 12.7214 3.83713C12.0271 4.03014 12.0271 4.76814 12.0271 6.24413V18.0393C12.0271 19.7582 12.0271 20.6176 12.7145 21.0237C13.402 21.4297 14.1983 21.0407 15.7911 20.2626L19.4666 18.467C20.7526 17.8388 21.3956 17.5247 21.5649 16.9341C21.7343 16.3436 21.3498 15.7565 20.5808 14.5825L14.6426 5.51707Z"
          />
        </g>
      </svg>
    }
  >
    <SidebarGroup label="跳转">
      <SidebarItem
        href="https://www.example.com"
        target="_blank"
        prefix={<IconFolder />}
      >
        VeDesign
      </SidebarItem>
      <SidebarItem
        href="https://github.com"
        target="_blank"
        prefix={<IconFile />}
      >
        GitHub
      </SidebarItem>
    </SidebarGroup>
  </Sidebar>
  <main style={{ flex: 1, padding: 24, color: 'var(--color-text-primary)' }}>
    主内容
  </main>
</div>;
```

### 导航项点击事件

使用 `onItemClick` 监听导航项点击，并通过 `event.detail.selected` 获取选中状态。禁用项不会触发该事件。

```tsx preview
import { useState } from 'react';
import { Sidebar, SidebarGroup, SidebarItem } from '@ve-design/react';
import {
  IconMessage,
  IconMessageCirclePlus,
  IconMoreHorizontal,
} from '@ve-design/react/icons';

function SidebarItemClickDemo() {
  const [message, setMessage] = useState('点击下方菜单项查看事件详情。');

  return (
    <section style={{ display: 'grid', gap: 12 }}>
      <code style={{ color: 'var(--color-text-secondary)' }}>{message}</code>
      <div style={{ height: 320, display: 'flex' }}>
        <Sidebar
          brand="Agent Design"
          logo={
            <svg aria-hidden="true" viewBox="0 0 28 28">
              <g transform="translate(2.333,2.333) translate(23.3333,0) scale(-1,1)">
                <path
                  fill="currentColor"
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M11.6667 0C12.7234 0 13.3516 0.952589 14.6079 2.85777L21.6122 13.4797C22.9046 15.4397 23.5508 16.4196 23.2676 17.4077C22.9843 18.3958 21.9074 18.9184 19.7536 19.9636L16.382 21.5998C14.0005 22.7555 12.8097 23.3333 11.6667 23.3333C10.5236 23.3333 9.33284 22.7555 6.95134 21.5998L3.5797 19.9636C1.4259 18.9184 0.348998 18.3958 0.0657699 17.4077C-0.217458 16.4196 0.428748 15.4397 1.72116 13.4797L8.72546 2.85777C9.98176 0.952589 10.6099 0 11.6667 0ZM14.6426 5.51707C13.8247 4.26843 13.4158 3.64411 12.7214 3.83713C12.0271 4.03014 12.0271 4.76814 12.0271 6.24413V18.0393C12.0271 19.7582 12.0271 20.6176 12.7145 21.0237C13.402 21.4297 14.1983 21.0407 15.7911 20.2626L19.4666 18.467C20.7526 17.8388 21.3956 17.5247 21.5649 16.9341C21.7343 16.3436 21.3498 15.7565 20.5808 14.5825L14.6426 5.51707Z"
                />
              </g>
            </svg>
          }
        >
          <SidebarGroup>
            <SidebarItem
              prefix={<IconMessageCirclePlus />}
              onItemClick={(event) =>
                setMessage(`点击：selected=${event.detail.selected}`)
              }
            >
              新对话
            </SidebarItem>
            <SidebarItem
              prefix={<IconMessage />}
              onItemClick={(event) =>
                setMessage(`点击：selected=${event.detail.selected}`)
              }
            >
              项目导航结构说明
            </SidebarItem>
            <SidebarItem disabled prefix={<IconMoreHorizontal />}>
              禁用项
            </SidebarItem>
          </SidebarGroup>
        </Sidebar>
        <main
          style={{ flex: 1, padding: 24, color: 'var(--color-text-primary)' }}
        >
          主内容
        </main>
      </div>
    </section>
  );
}
```

### 导航项下拉菜单

将 `SidebarItem` 传入 `Dropdown` 的 `triggerNode`，可将完整导航项作为下拉菜单触发器。

```tsx preview
import {
  Button,
  Dropdown,
  DropdownItem,
  Sidebar,
  SidebarGroup,
  SidebarItem,
} from '@ve-design/react';
import {
  IconFolder,
  IconHistory,
  IconMessage,
  IconMessageCirclePlus,
  IconMoreHorizontal,
  IconSettingsSliderVer,
} from '@ve-design/react/icons';

<div style={{ height: 360, display: 'flex' }}>
  <Sidebar
    brand="Agent Design"
    logo={
      <svg aria-hidden="true" viewBox="0 0 28 28">
        <g transform="translate(2.333,2.333) translate(23.3333,0) scale(-1,1)">
          <path
            fill="currentColor"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M11.6667 0C12.7234 0 13.3516 0.952589 14.6079 2.85777L21.6122 13.4797C22.9046 15.4397 23.5508 16.4196 23.2676 17.4077C22.9843 18.3958 21.9074 18.9184 19.7536 19.9636L16.382 21.5998C14.0005 22.7555 12.8097 23.3333 11.6667 23.3333C10.5236 23.3333 9.33284 22.7555 6.95134 21.5998L3.5797 19.9636C1.4259 18.9184 0.348998 18.3958 0.0657699 17.4077C-0.217458 16.4196 0.428748 15.4397 1.72116 13.4797L8.72546 2.85777C9.98176 0.952589 10.6099 0 11.6667 0ZM14.6426 5.51707C13.8247 4.26843 13.4158 3.64411 12.7214 3.83713C12.0271 4.03014 12.0271 4.76814 12.0271 6.24413V18.0393C12.0271 19.7582 12.0271 20.6176 12.7145 21.0237C13.402 21.4297 14.1983 21.0407 15.7911 20.2626L19.4666 18.467C20.7526 17.8388 21.3956 17.5247 21.5649 16.9341C21.7343 16.3436 21.3498 15.7565 20.5808 14.5825L14.6426 5.51707Z"
          />
        </g>
      </svg>
    }
  >
    <SidebarGroup>
      <Dropdown
        trigger="click"
        position="right-start"
        block
        triggerNode={
          <SidebarItem active prefix={<IconMoreHorizontal />}>
            更多
          </SidebarItem>
        }
      >
        <DropdownItem value="option1">
          <span
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}
          >
            <IconHistory />
            菜单选项
          </span>
        </DropdownItem>
        <DropdownItem value="option2">
          <span
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}
          >
            <IconHistory />
            菜单选项
          </span>
        </DropdownItem>
        <DropdownItem value="option3">
          <span
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}
          >
            <IconHistory />
            菜单选项
          </span>
        </DropdownItem>
      </Dropdown>
    </SidebarGroup>

    <SidebarGroup label="项目" withLabel>
      <SidebarItem prefix={<IconFolder />}>项目名称</SidebarItem>
    </SidebarGroup>

    <SidebarGroup
      label="历史会话"
      withLabel
      headerSuffix={
        <Dropdown
          trigger="click"
          position="right-start"
          triggerNode={
            <Button type="text" size="small" aria-label="排序条件">
              <IconSettingsSliderVer />
            </Button>
          }
        >
          <DropdownItem value="sort-time">
            <span
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}
            >
              <IconHistory />
              按时间排序
            </span>
          </DropdownItem>
        </Dropdown>
      }
    >
      <SidebarItem prefix={<IconMessage />}>普通会话</SidebarItem>
      <SidebarItem prefix={<IconMessage />}>普通会话</SidebarItem>
    </SidebarGroup>
  </Sidebar>
  <main style={{ flex: 1, padding: 24, color: 'var(--color-text-primary)' }}>
    点击“更多”菜单项打开下拉菜单
  </main>
</div>;
```

### 可折叠分组

设置 `collapsible` 后，可通过分组标题或键盘 Enter、Space 切换分组状态，并通过 `onToggle` 获取最新状态。

```tsx preview
import { useState } from 'react';
import { Sidebar, SidebarGroup, SidebarItem } from '@ve-design/react';
import {
  IconMessage,
  IconMessageCirclePlus,
  IconSearch,
} from '@ve-design/react/icons';

function SidebarCollapsibleGroupDemo() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <section style={{ display: 'grid', gap: 12 }}>
      <code style={{ color: 'var(--color-text-secondary)' }}>
        历史会话：{collapsed ? '折叠' : '展开'}
      </code>
      <div style={{ height: 320, display: 'flex' }}>
        <Sidebar
          brand="Agent Design"
          logo={
            <svg aria-hidden="true" viewBox="0 0 28 28">
              <g transform="translate(2.333,2.333) translate(23.3333,0) scale(-1,1)">
                <path
                  fill="currentColor"
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M11.6667 0C12.7234 0 13.3516 0.952589 14.6079 2.85777L21.6122 13.4797C22.9046 15.4397 23.5508 16.4196 23.2676 17.4077C22.9843 18.3958 21.9074 18.9184 19.7536 19.9636L16.382 21.5998C14.0005 22.7555 12.8097 23.3333 11.6667 23.3333C10.5236 23.3333 9.33284 22.7555 6.95134 21.5998L3.5797 19.9636C1.4259 18.9184 0.348998 18.3958 0.0657699 17.4077C-0.217458 16.4196 0.428748 15.4397 1.72116 13.4797L8.72546 2.85777C9.98176 0.952589 10.6099 0 11.6667 0ZM14.6426 5.51707C13.8247 4.26843 13.4158 3.64411 12.7214 3.83713C12.0271 4.03014 12.0271 4.76814 12.0271 6.24413V18.0393C12.0271 19.7582 12.0271 20.6176 12.7145 21.0237C13.402 21.4297 14.1983 21.0407 15.7911 20.2626L19.4666 18.467C20.7526 17.8388 21.3956 17.5247 21.5649 16.9341C21.7343 16.3436 21.3498 15.7565 20.5808 14.5825L14.6426 5.51707Z"
                />
              </g>
            </svg>
          }
        >
          <SidebarGroup>
            <SidebarItem prefix={<IconMessageCirclePlus />}>新对话</SidebarItem>
            <SidebarItem prefix={<IconSearch />}>搜索</SidebarItem>
          </SidebarGroup>
          <SidebarGroup
            label="历史会话"
            collapsible
            collapsed={collapsed}
            onToggle={(event) => setCollapsed(event.detail.collapsed)}
          >
            <SidebarItem prefix={<IconMessage />}>项目导航结构说明</SidebarItem>
            <SidebarItem prefix={<IconMessage />}>组件状态复盘</SidebarItem>
            <SidebarItem prefix={<IconMessage />}>发布计划整理</SidebarItem>
          </SidebarGroup>
        </Sidebar>
        <main
          style={{ flex: 1, padding: 24, color: 'var(--color-text-primary)' }}
        >
          主内容
        </main>
      </div>
    </section>
  );
}
```

### 分组操作

通过 `headerSuffix` 在分组标题右侧添加操作入口，可用于排序、筛选或分组管理。

```tsx preview
import { useState } from 'react';
import {
  Button,
  Dropdown,
  DropdownItem,
  Sidebar,
  SidebarGroup,
  SidebarItem,
} from '@ve-design/react';
import {
  IconHistory,
  IconMenuAlignLeft,
  IconMessage,
  IconMessageCirclePlus,
  IconSettingsSliderVer,
} from '@ve-design/react/icons';

function SidebarGroupActionDemo() {
  const [message, setMessage] = useState('点击分组标题右侧图标打开操作菜单');
  const menuRowStyle = { display: 'inline-flex', alignItems: 'center', gap: 8 };

  return (
    <div style={{ height: 320, display: 'flex' }}>
      <Sidebar
        brand="Agent Design"
        logo={
          <svg aria-hidden="true" viewBox="0 0 28 28">
            <g transform="translate(2.333,2.333) translate(23.3333,0) scale(-1,1)">
              <path
                fill="currentColor"
                fillRule="evenodd"
                clipRule="evenodd"
                d="M11.6667 0C12.7234 0 13.3516 0.952589 14.6079 2.85777L21.6122 13.4797C22.9046 15.4397 23.5508 16.4196 23.2676 17.4077C22.9843 18.3958 21.9074 18.9184 19.7536 19.9636L16.382 21.5998C14.0005 22.7555 12.8097 23.3333 11.6667 23.3333C10.5236 23.3333 9.33284 22.7555 6.95134 21.5998L3.5797 19.9636C1.4259 18.9184 0.348998 18.3958 0.0657699 17.4077C-0.217458 16.4196 0.428748 15.4397 1.72116 13.4797L8.72546 2.85777C9.98176 0.952589 10.6099 0 11.6667 0ZM14.6426 5.51707C13.8247 4.26843 13.4158 3.64411 12.7214 3.83713C12.0271 4.03014 12.0271 4.76814 12.0271 6.24413V18.0393C12.0271 19.7582 12.0271 20.6176 12.7145 21.0237C13.402 21.4297 14.1983 21.0407 15.7911 20.2626L19.4666 18.467C20.7526 17.8388 21.3956 17.5247 21.5649 16.9341C21.7343 16.3436 21.3498 15.7565 20.5808 14.5825L14.6426 5.51707Z"
              />
            </g>
          </svg>
        }
      >
        <SidebarGroup>
          <SidebarItem prefix={<IconMessageCirclePlus />}>新对话</SidebarItem>
        </SidebarGroup>

        <SidebarGroup
          label="历史会话"
          withLabel
          headerSuffix={
            <Dropdown
              trigger="click"
              position="right-start"
              triggerNode={
                <Button type="text" size="small" aria-label="排序条件">
                  <IconSettingsSliderVer />
                </Button>
              }
              onSelect={(event) => setMessage(`操作：${event.detail.value}`)}
            >
              <DropdownItem value="sort-time">
                <span style={menuRowStyle}>
                  <IconHistory />
                  按时间排序
                </span>
              </DropdownItem>
              <DropdownItem value="sort-name">
                <span style={menuRowStyle}>
                  <IconMenuAlignLeft />
                  按名称排序
                </span>
              </DropdownItem>
            </Dropdown>
          }
        >
          <SidebarItem prefix={<IconMessage />}>普通会话</SidebarItem>
          <SidebarItem prefix={<IconMessage />}>普通会话</SidebarItem>
          <SidebarItem prefix={<IconMessage />}>普通会话</SidebarItem>
        </SidebarGroup>
      </Sidebar>
      <main
        style={{ flex: 1, padding: 24, color: 'var(--color-text-primary)' }}
      >
        <code>{message}</code>
      </main>
    </div>
  );
}
```

### 会话项操作菜单

通过 `suffix` 可为会话项添加上下文操作，并与 `Dropdown` 组合提供置顶、分享、重命名或删除等功能。

```tsx preview
import { useState } from 'react';
import {
  Button,
  Dropdown,
  DropdownDivider,
  DropdownItem,
  Sidebar,
  SidebarGroup,
  SidebarItem,
} from '@ve-design/react';
import {
  IconBookmark,
  IconEdit,
  IconMessage,
  IconMessageCirclePlus,
  IconMoreHorizontal,
  IconShare,
  IconTrash03,
} from '@ve-design/react/icons';

function SidebarItemActionDemo() {
  const [message, setMessage] = useState('点击会话项右侧“...”按钮打开操作菜单');

  const renderMenuTrigger = () => (
    <Button
      type="text"
      size="small"
      className="sidebar-doc-action"
      aria-label="更多操作"
    >
      <IconMoreHorizontal size={16} />
    </Button>
  );

  const historyActionMenu = (id: string) => (
    <Dropdown
      trigger="click"
      position="right-start"
      triggerNode={renderMenuTrigger()}
      onSelect={(event) => setMessage(`操作：${event.detail.value}`)}
    >
      <DropdownItem value={`${id}-pin`}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          <IconBookmark size={16} />
          置顶
        </span>
      </DropdownItem>
      <DropdownItem value={`${id}-share`}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          <IconShare size={16} />
          分享
        </span>
      </DropdownItem>
      <DropdownItem value={`${id}-rename`}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          <IconEdit size={16} />
          重命名
        </span>
      </DropdownItem>
      <DropdownDivider />
      <DropdownItem value={`${id}-delete`} danger>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          <IconTrash03 size={16} />
          删除
        </span>
      </DropdownItem>
    </Dropdown>
  );

  return (
    <div style={{ height: 320, display: 'flex' }}>
      <style>{`
        .sidebar-doc-action {
          opacity: 0;
          transition: opacity var(--motion-fast) var(--ease-standard);
        }
        ve-sidebar-item:hover .sidebar-doc-action,
        ve-sidebar-item:focus-within .sidebar-doc-action,
        .sidebar-doc-action:hover,
        .sidebar-doc-action:focus-visible {
          opacity: 1;
        }
      `}</style>
      <Sidebar
        brand="Agent Design"
        logo={
          <svg aria-hidden="true" viewBox="0 0 28 28">
            <g transform="translate(2.333,2.333) translate(23.3333,0) scale(-1,1)">
              <path
                fill="currentColor"
                fillRule="evenodd"
                clipRule="evenodd"
                d="M11.6667 0C12.7234 0 13.3516 0.952589 14.6079 2.85777L21.6122 13.4797C22.9046 15.4397 23.5508 16.4196 23.2676 17.4077C22.9843 18.3958 21.9074 18.9184 19.7536 19.9636L16.382 21.5998C14.0005 22.7555 12.8097 23.3333 11.6667 23.3333C10.5236 23.3333 9.33284 22.7555 6.95134 21.5998L3.5797 19.9636C1.4259 18.9184 0.348998 18.3958 0.0657699 17.4077C-0.217458 16.4196 0.428748 15.4397 1.72116 13.4797L8.72546 2.85777C9.98176 0.952589 10.6099 0 11.6667 0ZM14.6426 5.51707C13.8247 4.26843 13.4158 3.64411 12.7214 3.83713C12.0271 4.03014 12.0271 4.76814 12.0271 6.24413V18.0393C12.0271 19.7582 12.0271 20.6176 12.7145 21.0237C13.402 21.4297 14.1983 21.0407 15.7911 20.2626L19.4666 18.467C20.7526 17.8388 21.3956 17.5247 21.5649 16.9341C21.7343 16.3436 21.3498 15.7565 20.5808 14.5825L14.6426 5.51707Z"
              />
            </g>
          </svg>
        }
      >
        <SidebarGroup>
          <SidebarItem prefix={<IconMessageCirclePlus />}>新对话</SidebarItem>
        </SidebarGroup>

        <SidebarGroup label="历史会话">
          <SidebarItem
            prefix={<IconMessage />}
            active
            suffix={historyActionMenu('active')}
          >
            项目导航结构说明
          </SidebarItem>
          <SidebarItem
            prefix={<IconMessage />}
            suffix={historyActionMenu('review')}
          >
            组件状态复盘
          </SidebarItem>
          <SidebarItem
            prefix={<IconMessage />}
            suffix={historyActionMenu('release')}
          >
            发布计划整理
          </SidebarItem>
        </SidebarGroup>
      </Sidebar>
      <main
        style={{ flex: 1, padding: 24, color: 'var(--color-text-primary)' }}
      >
        <code>{message}</code>
      </main>
    </div>
  );
}
```

## API

### Sidebar Props

| 属性名          | 描述                                      | 类型              | 默认值   |
| --------------- | ----------------------------------------- | ----------------- | -------- |
| `collapsed`     | 是否折叠                                  | `boolean`         | `false`  |
| `brand`         | 品牌名称，折叠状态下隐藏                  | `string`          | `''`     |
| `withFooter`    | 是否启用底部区域                          | `boolean`         | `false`  |
| `expandTooltip` | 折叠状态下品牌标识的展开提示              | `string`          | `'展开'` |
| `hideScrollbar` | 是否隐藏内容区滚动条，滚动能力不受影响    | `boolean`         | `false`  |
| `logo`          | 品牌标识                                  | `React.ReactNode` | `-`      |
| `pinned`        | 固定在内容区顶部的内容                    | `React.ReactNode` | `-`      |
| `footer`        | 底部自定义内容，需配合 `withFooter` 使用  | `React.ReactNode` | `-`      |
| `children`      | 可滚动导航内容，通常为若干 `SidebarGroup` | `React.ReactNode` | `-`      |

#### ReactSlot 使用规约

`logo` / `pinned` / `footer` 这类 slot 属性必须传入已经创建好的 **React element**,不要直接传只返回元素的函数组件。组件库 React wrapper 会通过 `React.cloneElement(content, { slot: name })` 把 `slot="xxx"` 挂到传入节点上;如果传入的是函数组件,`slot` 只会落到函数组件 props 上,不会自动透传到真实 DOM,节点会掉到默认 slot,典型现象是 logo 没有出现在 `Agent Design` 左侧,而是单独占一行。

推荐写法:

```tsx
const logo = (
  <svg aria-hidden="true" viewBox="0 0 28 28" width="24" height="24">
    {/* ... */}
  </svg>
);

<Sidebar brand="Agent Design" logo={logo} />
```

不要这样写:

```tsx
function BrandLogo() {
  return <svg aria-hidden="true" viewBox="0 0 28 28" />;
}

<Sidebar brand="Agent Design" logo={<BrandLogo />} />
```

若必须封装为组件,组件必须把收到的 props 展开到根 DOM element:

```tsx
function BrandLogo(props: React.SVGProps<SVGSVGElement>) {
  return <svg {...props} aria-hidden="true" viewBox="0 0 28 28" width="24" height="24" />;
}

<Sidebar brand="Agent Design" logo={<BrandLogo />} />
```

### Sidebar 事件

| 事件名     | 描述               | 参数类型                              |
| ---------- | ------------------ | ------------------------------------- |
| `onToggle` | 折叠状态改变时触发 | `CustomEvent<{ collapsed: boolean }>` |

### SidebarGroup Props

| 属性名         | 描述                                 | 类型              | 默认值  |
| -------------- | ------------------------------------ | ----------------- | ------- |
| `label`        | 分组标题，可传入文本或自定义内容     | `React.ReactNode` | `''`    |
| `collapsible`  | 是否允许切换分组的展开状态           | `boolean`         | `false` |
| `collapsed`    | 分组是否折叠                         | `boolean`         | `false` |
| `withLabel`    | 未设置 `label` 时，是否显示标题区域  | `boolean`         | `false` |
| `headerSuffix` | 分组标题右侧的自定义内容             | `React.ReactNode` | `-`     |
| `children`     | 导航项内容，通常为若干 `SidebarItem` | `React.ReactNode` | `-`     |

### SidebarGroup 事件

| 事件名     | 描述                 | 参数类型                                             |
| ---------- | -------------------- | ---------------------------------------------------- |
| `onToggle` | 可折叠分组切换时触发 | `CustomEvent<{ collapsed: boolean; label: string }>` |

### SidebarItem Props

| 属性名     | 描述                             | 类型              | 默认值    |
| ---------- | -------------------------------- | ----------------- | --------- |
| `href`     | 跳转链接地址；存在时进入链接模式 | `string`          | `''`      |
| `target`   | 链接打开方式                     | `string`          | `'_self'` |
| `selected` | 是否选中                         | `boolean`         | `false`   |
| `active`   | 是否处于临时激活状态             | `boolean`         | `false`   |
| `disabled` | 是否禁用；禁用时不触发点击事件   | `boolean`         | `false`   |
| `loading`  | 是否显示加载状态                 | `boolean`         | `false`   |
| `unread`   | 是否显示未读提示                 | `boolean`         | `false`   |
| `shortcut` | 快捷键说明                       | `string`          | `''`      |
| `tooltip`  | 折叠状态下的提示文案，需显式设置 | `string`          | `''`      |
| `prefix`   | 导航项前置内容，通常为图标       | `React.ReactNode` | `-`       |
| `suffix`   | 导航项后置内容                   | `React.ReactNode` | `-`       |
| `children` | 导航项内容                       | `React.ReactNode` | `-`       |

### SidebarItem 事件

| 事件名        | 描述                   | 参数类型                             |
| ------------- | ---------------------- | ------------------------------------ |
| `onItemClick` | 非禁用菜单项点击时触发 | `CustomEvent<{ selected: boolean }>` |

### Ref

`Sidebar` 和 `SidebarGroup` 的 ref 可访问实例上的 `toggle()` 方法。`SidebarItem` ref 可访问对应自定义元素实例。
