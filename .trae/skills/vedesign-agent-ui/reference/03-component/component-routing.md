# 03 · 组件路由

先用本文件选择 VeDesign 组件，再打开具体组件文档。React 项目读取 `reference/03-component/vedesign-use-skill/react/index.md` 后再读对应组件文件；Web Components 或静态 HTML 读取 `web-components/` 下对应文件。

## React 引入基线

```tsx
import '@ve-design/react/css/default.css';
import {
  Actions,
  ArtifactCard,
  Bubble,
  BubbleList,
  Button,
  ChatInput,
  ChatInputAction,
  Citation,
  Markdown,
  Modal,
  Sidebar,
  SidebarGroup,
  SidebarItem,
  Tabs,
  Thinking,
  ThoughtChain,
} from '@ve-design/react';
```

实际代码只引入当前页面使用的组件。如果已有项目已经用 `@ve-design/web/css/default.css` 作为主题入口，沿用现有入口，不要重复引入两份默认主题。

## 页面到组件映射

| 场景 | 主要组件 | 必读文档 |
|---|---|---|
| 应用外壳和导航 | `Sidebar`、`SidebarGroup`、`SidebarItem`、`Avatar`、`Tooltip`、`Dropdown` | `sidebar.md`、`avatar.md`、`tooltip.md`、`dropdown.md` |
| 欢迎页 composer | `ChatInput`、`ChatInputAction`、`Dropdown`、`Button`、`PromptItem` | `chat-input.md`、`dropdown.md`、`button.md`、`prompt-item.md` |
| 对话流 | `Bubble`、`BubbleList`、`Markdown`、`Actions`、`Citation` | `bubble.md`、`markdown.md`、`actions.md`、`citation.md` |
| 生成中 / thinking | `Thinking`、`ThoughtChain`、`Spin`、`Markdown` | `thinking.md`、`thought-chain.md`、`spin.md`、`markdown.md` |
| 工具调用 / 权限确认 | `Authorization`、`Alert`、`Modal`、`Button` | `authorization.md`、`alert.md`、`modal.md`、`button.md` |
| 产物预览 | `ArtifactCard`、`ResourcePreview`、`Tabs`、`Actions` | `artifact-card.md`、`resource-preview.md`、`tabs.md`、`actions.md` |
| Skill / MCP 发现 | `Input`、`Tabs`、`Button`、`Tag`、`Badge`、`Modal`、`Empty` | `input.md`、`tabs.md`、`button.md`、`tag.md`、`badge.md`、`modal.md`、`empty.md` |
| 文件库 | `Upload`、`Table`、`Tabs`、`Input`、`Dropdown`、`Button`、`Pagination` | `upload.md`、`table.md`、`tabs.md`、`input.md`、`dropdown.md`、`button.md`、`pagination.md` |
| 设置页 | `Switch`、`Radio`、`Checkbox`、`Select`、`Input`、`DigitalInput`、`Alert` | `switch.md`、`radio.md`、`checkbox.md`、`select.md`、`input.md`、`digital-input.md`、`alert.md` |
| 详情弹窗 | `Modal`、`Button`、`Tag`、`Tabs`、`Markdown`、`Authorization` | `modal.md`、`button.md`、`tag.md`、`tabs.md`、`markdown.md`、`authorization.md` |
| 即时反馈 | `Message`、`Notification`、`Popconfirm`、`Alert` | `message.md`、`notification.md`、`popconfirm.md`、`alert.md` |

## 选择规则

- Agent 输入区使用 `ChatInput`，不要用普通 textarea 代替；尤其是存在 submit、attachment、model、mode、command 或 stop-generation 行为时。
- `ChatInput` / `ve-chat-input` 已内置唯一发送 / 停止按钮;不要在 `rightAction`、`leftAction`、`right-action`、`left-action` 或外层 toolbar 再自定义发送按钮。
- 设计助手 Agent 的输入框流光必须使用 `reference/04-asset/motion/shimmer-border.css` 和 `reference/04-asset/motion/shimmer-border.js`;不要只用 `ChatInput borderGlow` / `ve-chat-input border-glow`。流光 host 必须挂在真正拥有输入框圆角和可见边框的 Composer shell 上,写法为 `.ved-shimmer-host` + `data-shimmer` + 正确 `data-shimmer-radius`。
- 消息布局可以使用 `BubbleList` 管纵向节奏;用户消息使用 `Bubble`。助手长回复正文不要使用 `Bubble`,用普通 `.msg-ai` 内容块承载 `Markdown` / `Thinking` / `Actions` / `Citation` / `ArtifactCard`,避免出现组件自带“查看更多”。
- 模型输出使用 `Markdown`。模拟或接入 token-by-token 内容时启用 streaming 行为。
- 单段公开推理摘要用 `Thinking`；多步骤工具、搜索、结果链路用 `ThoughtChain`。
- RAG 或联网搜索来源使用 `Citation`，不要把来源链接随意塞进 Markdown。
- 紧凑回答操作行使用 `Actions`。
- 对话中出现生成文件、代码、图片、视频、文档或压缩包时使用 `ArtifactCard`。
- 涉及权限、外部调用、命令执行、文件访问或安装前，使用 `Authorization`。
- 结构化文件、运行记录、评测结果或权限数据优先使用 `Table`；只有 page-shot 要求紧凑管理行时才使用自定义 list row。
- 详情、安装、配置和风险流程使用 `Modal`；短确认才用 `Popconfirm`。

## Fallback 规则

只有以下情况允许 fallback CSS class：

- 项目不是 React 且无法使用 Web Components；
- 当前环境无法安装包；
- 组件库没有覆盖对应页面级组合；
- 用户明确要求单文件静态 prototype。

即使 fallback，也要保持 VeDesign 语义：

- 色彩、间距、字体、边框和阴影都使用 token；
- 页面结构继续对齐 page-shot；
- 保留同等交互状态；
- class 命名对齐 `reference/04-asset/asset-packages.md`。
