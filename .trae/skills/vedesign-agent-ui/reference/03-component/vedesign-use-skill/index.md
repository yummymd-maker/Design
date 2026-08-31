# Volcengine Agent Design

> 为打造 AI 产品而生，由人与 Agent 共同驱动。原生 Web Components 内核，React-first 开发体验，一套代码同时服务 React、原生 HTML。

Volcengine Agent Design 是面向智能应用与 Agent 产品体验构建的前端组件体系。它不止是按钮、输入框、弹窗这类传统控件的集合，而是围绕 AI 产品的真实链路——**用户输入、意图澄清、流式响应、过程展示、来源引用、任务产物、资源预览与后续操作**——沉淀出的一整套可组合界面单元，帮助团队以更快的速度搭建一致、可信、可扩展的 Agent 交互体验。

我们相信，AI 时代的设计系统**由人主导、由 Agent 协作调用**。除了面向开发者的组件与设计资产，我们还将企业级设计经验沉淀为 Agent 可理解的 [Skills](/skills/)，让从需求分析、界面搭建到设计走查的每一次创造，都有 Agent 与你并肩协作。

底层基于 **Web Components** 构建，以标准自定义元素（`ve-*`）输出；上层提供 **React 包装器**、完整 TypeScript 类型、默认主题与暗色模式、内聚的图标系统以及微前端兼容处理。你既能在 React 项目里获得接近原生组件的开发体验，也能在普通 HTML 或任意支持 Custom Elements 的运行环境中直接复用同一套组件。

## 为什么选择 Volcengine Agent Design

### AI 友好：开箱即用的 Agent 设计资产

这套设计系统不仅为人编写，也为 Agent 调用而设计。我们把企业级设计资产与设计经验转化为 Agent 可理解的 [Skills](/skills/)——覆盖需求与受众分析、界面搭建、设计 Token 对齐、设计走查等工作流。它们让 Agent 能够稳定地理解并产出符合设计规范的界面，使「由人主导、由 Agent 协作」从理念落到日常实践：每一次创造，都有 Agent 与你并肩。

### 为 AI 链路而设计，而非传统后台 UI

Agent 产品的体验复杂度来自连续的任务链路：用户提出目标 → 系统补充澄清 → 模型流式生成 → 界面展示思考、引用、产物与可执行操作。我们把这条链路拆解为一组可组合的组件资产——`ChatInput`、`Bubble`、`Thinking`、`ThoughtChain`、`Citation`、`ArtifactCard`、`ResourcePreview`、`Clarify`、`Authorization`——让产品围绕「**对话 · 过程 · 证据 · 产物 · 操作**」建立稳定的体验骨架。

### 一次构建，跨框架运行，React-first 体验

组件以 **W3C 标准自定义元素**输出，天然不绑定任何框架。`@ve-design/web` 适用于普通 HTML、跨框架页面与渐进式接入；`@ve-design/react` 在其之上提供 React 包装器。无论你的技术栈是 React、原生 HTML，还是混合架构，都共享同一份组件逻辑与同一套设计语言。

面向 React 生态，包装器把属性、事件与插槽转换为符合 React 直觉的 API，严格的Typescript定义和类型说明，在编辑器中即可获得完整补全与类型校验。

### 流式渲染，专为大模型输出打造

组件内置**流式渲染缓冲**（streaming buffer），可优雅处理模型逐字输出的不完整 Markdown，避免闪烁与结构错乱，让富文本回答既安全又美观。配合 `Thinking`、`ThoughtChain` 的过程态展示，天然适配「边生成、边呈现」的 AI 交互范式。

### 真正的按需加载

每个组件、每个图标都拥有独立的子路径入口，配合 ESM 与 `sideEffects` 标记实现彻底的 **Tree-shaking**。只引入你用到的部分，产物体积始终可控。引入单个组件时，其内部依赖的子元素会**自动幂等注册**，无需手动声明依赖关系。

### 设计 Token、暗色模式与图标系统

默认主题以 **CSS 自定义属性**发布，覆盖颜色、背景、文本、边框、间距、圆角、阴影与交互状态等设计 Token，并内置 `.dark` 暗色语义。业务侧只需覆盖变量即可定制品牌主题。图标系统内聚在组件库中，支持 Web Components 侧的 `ve-icon`、React 侧的图标组件，以及按名称动态渲染。

### 工程化与兼容性已就绪

- **纯 ESM 发布 + `.d.ts` 类型声明**，组件、图标、主题 CSS 与适配器均有明确入口。
- **Shadow DOM 样式隔离**，并默认开启 `delegatesFocus`，焦点行为符合原生表单语义。

## 在 React 中快速开始

### 安装前配置内网源

`@ve-design/*` 相关 npm 包发布在内网源。安装 `@ve-design/react` 或 `@ve-design/web` 前，请先配置 npm registry，确保包管理器可以正常拉取依赖：

```bash
npm config set registry=https://bnpm.byted.org
```

如果只希望对当前项目生效，也可以在项目根目录的 `.npmrc` 中写入：

```ini
registry=https://bnpm.byted.org
```

安装 `@ve-design/react`：

```bash
pnpm add @ve-design/react
```

引入默认主题 CSS 后，从主入口具名导入组件即可使用。React 包装器会在内部自动完成对应 Web Components 的注册。

```tsx
import '@ve-design/react/css/default.css';
import { ChatInput, Bubble, Thinking, Citation, Button } from '@ve-design/react';
import { IconSearch } from '@ve-design/react/icons';

export default function AgentPanel() {
  return (
    <main>
      <Bubble placement="start" variant="filled">
        <Thinking loading title="正在分析需求">
          正在拆解任务、检索上下文并生成可执行方案。
        </Thinking>

        <p>已根据你的目标生成初步方案，并关联以下参考来源。</p>

        <Citation
          items={[
            { key: 'source-1', title: '产品需求说明', url: 'https://example.com/prd' },
            { key: 'source-2', title: '接口设计文档', url: 'https://example.com/api' },
          ]}
        />

        <Button type="outline">
          <IconSearch />
          搜索知识库
        </Button>
      </Bubble>

      <ChatInput
        placeholder="向 Agent 描述你的任务"
        onSubmit={(event) => {
          console.log(event.detail.value);
        }}
      />
    </main>
  );
}
```

## 在普通 HTML 中快速开始

### HTML 项目安装前配置内网源

`@ve-design/web` 同样发布在内网源。安装前请确认已配置 npm registry：

```bash
npm config set registry=https://bnpm.byted.org
```

或在当前项目根目录的 `.npmrc` 中写入：

```ini
registry=https://bnpm.byted.org
```

跨框架或原生 Web 项目安装 `@ve-design/web`：

```bash
pnpm add @ve-design/web
```

Web Components 以标准自定义元素使用。引入主题 CSS、组件注册入口与图标入口后，即可在页面中书写 `ve-*` 标签——复杂数据通过 property 赋值，交互通过标准 DOM 事件监听。

```html
<link rel="stylesheet" href="./node_modules/@ve-design/web/css/default.css" />

<script type="module">
  import '@ve-design/web/ve-chat-input';
  import '@ve-design/web/ve-bubble';
  import '@ve-design/web/ve-thinking';
  import '@ve-design/web/ve-citation';
  import '@ve-design/web/ve-button';
  import '@ve-design/web/icons/search';

  const input = document.querySelector('ve-chat-input');
  const citation = document.querySelector('ve-citation');

  if (citation) {
    citation.items = [
      { key: 'source-1', title: '产品需求说明', url: 'https://example.com/prd' },
      { key: 'source-2', title: '接口设计文档', url: 'https://example.com/api' },
    ];
  }

  input?.addEventListener('ve-chat-input-submit', (event) => {
    console.log(event.detail.value);
  });
</script>

<main>
  <ve-bubble placement="start" variant="filled">
    <ve-thinking loading title="正在分析需求">
      正在拆解任务、检索上下文并生成可执行方案。
    </ve-thinking>

    <p>已根据你的目标生成初步方案，并关联以下参考来源。</p>

    <ve-citation></ve-citation>

    <ve-button type="outline">
      <ve-icon name="search"></ve-icon>
      搜索知识库
    </ve-button>
  </ve-bubble>

  <ve-chat-input placeholder="向 Agent 描述你的任务"></ve-chat-input>
</main>
```

## 流式 Markdown 示例

面向大模型逐字输出，`Markdown` 在 `streaming` 模式下持续接收增量内容，内部缓冲会保证不完整语法在补全前不破坏排版，并自动完成安全净化与代码高亮。

```tsx
import '@ve-design/react/css/default.css';
import { Markdown } from '@ve-design/react';

export function StreamingAnswer({ text }: { text: string }) {
  // text 来自模型的流式输出，可随 token 持续更新
  return <Markdown streaming content={text} />;
}
```

## 主题与暗色模式

默认主题提供 `.dark` 语义 Token 覆盖。在页面根节点或业务容器上添加 `dark` 类，即可让使用这些 Token 的组件切换到暗色语义；业务侧也可以通过覆盖 CSS 变量定制品牌色、边框、阴影与状态色。

```html
<html class="dark">
  <body>
    <ve-chat-input placeholder="在暗色模式下继续对话"></ve-chat-input>
  </body>
</html>
```

## 微前端兼容

在 Garfish 微前端的 `browser-vm` 沙箱中，DOM 节点可能被代理对象包裹，导致组件渲染时的部分原生 DOM 操作被浏览器拒绝。组件库提供窄范围、幂等且 SSR-safe 的 Garfish adapter，在导入组件前完成兼容处理：

```ts
import '@ve-design/react/adapter/garfish';
import { ChatInput } from '@ve-design/react';
```

```ts
import '@ve-design/web/adapter/garfish';
import '@ve-design/web/ve-chat-input';
```

## 组件地图

### Agent 组件

| 组件 | 描述 |
| --- | --- |
| 产物卡片 ArtifactCard（[React](react/artifact-card.md) / [Web Components](web-components/ve-artifact-card.md)） | 展示 AI 对话、任务执行、文件生成等产物资源。 |
| 资源预览 ResourcePreview（[React](react/resource-preview.md) / [Web Components](web-components/ve-resource-preview.md)） | 展示资源预览、元信息和操作入口。 |
| 思考 Thinking（[React](react/thinking.md) / [Web Components](web-components/ve-thinking.md)） | 在 AI 对话中展示可公开的推理摘要。 |
| 思维链 ThoughtChain（[React](react/thought-chain.md) / [Web Components](web-components/ve-thought-chain.md)） | 展示过程步骤、状态和层级链路。 |
| 渲染 Markdown（[React](react/markdown.md) / [Web Components](web-components/ve-markdown.md)） | 支持流式渲染、安全净化与代码高亮的 Markdown 输出。 |
| 需求澄清 Clarify（[React](react/clarify.md) / [Web Components](web-components/ve-clarify.md)） | 将待确认诉求转化为结构化问答。 |
| 授权确认 Authorization（[React](react/authorization.md) / [Web Components](web-components/ve-authorization.md)） | 在关键操作前呈现权限、风险或确认动作。 |
| 消息气泡 Bubble（[React](react/bubble.md) / [Web Components](web-components/ve-bubble.md)） | 承载 AI 对话流中的单条消息。 |
| 操作条 Actions（[React](react/actions.md) / [Web Components](web-components/ve-actions.md)） | 渲染一行图标按钮组成的快捷操作区。 |
| 聊天输入框 ChatInput（[React](react/chat-input.md) / [Web Components](web-components/ve-chat-input.md)） | 提供 AI 对话发送中枢。 |
| 引用来源 Citation（[React](react/citation.md) / [Web Components](web-components/ve-citation.md)） | 展示回答引用、来源列表与展开状态。 |
| 侧边导航 SideBar（[React](react/sidebar.md) / [Web Components](web-components/ve-sidebar.md)） | 提供应用级侧边导航结构。 |
| 提示卡片 PromptItem（[React](react/prompt-item.md) / [Web Components](web-components/ve-prompt-item.md)） | 展示 Prompt 建议或快捷入口。 |
| 文本选择 TextSelection（[React](react/text-selection.md) / [Web Components](web-components/ve-text-selection.md)） | 展示文本选择后的上下文操作。 |

### 基础组件

| 组件 | 描述 |
| --- | --- |
| 按钮 Button（[React](react/button.md) / [Web Components](web-components/ve-button.md)） | 触发即时操作，支持类型、尺寸、状态、禁用和加载。 |
| 链接 Link（[React](react/link.md) / [Web Components](web-components/ve-link.md)） | 用于导航跳转或低强调度操作。 |
| 标签 Tag（[React](react/tag.md) / [Web Components](web-components/ve-tag.md)） | 展示轻量级分类、状态或可关闭标记。 |
| 徽标 Badge（[React](react/badge.md) / [Web Components](web-components/ve-badge.md)） | 在目标元素附近展示数量提醒或状态点。 |
| 图标 Icon（[React](react/icon.md) / [Web Components](web-components/ve-icon.md)） | 基于内置图标注册表渲染图标。 |

### 反馈

| 组件 | 描述 |
| --- | --- |
| 警告提示 Alert（[React](react/alert.md) / [Web Components](web-components/ve-alert.md)） | 展示页面内稳定的信息、提醒和状态说明。 |
| 全局提示 Message（[React](react/message.md) / [Web Components](web-components/ve-message.md)） | 展示短时反馈信息。 |
| 通知提醒 Notification（[React](react/notification.md) / [Web Components](web-components/ve-notification.md)） | 展示可承载更多内容的全局通知。 |
| 弹窗 Modal（[React](react/modal.md) / [Web Components](web-components/ve-modal.md)） | 承载需要用户聚焦处理的浮层任务。 |
| 气泡确认框 Popconfirm（[React](react/popconfirm.md) / [Web Components](web-components/ve-popconfirm.md)） | 在危险或需要确认的操作前进行二次确认。 |
| 加载中 Spin（[React](react/spin.md) / [Web Components](web-components/ve-spin.md)） | 展示局部加载状态。 |

### 输入

| 组件 | 描述 |
| --- | --- |
| 输入框 Input（[React](react/input.md) / [Web Components](web-components/ve-input.md)） | 文本输入控件，支持状态、清除和插槽组合。 |
| 数字输入框 DigitalInput（[React](react/digital-input.md) / [Web Components](web-components/ve-digital-input.md)） | 输入或调整数值，支持范围、步进和精度。 |
| 选择器 Select（[React](react/select.md) / [Web Components](web-components/ve-select.md)） | 从选项集合中选择单个或多个值。 |
| 日期选择器 DatePicker（[React](react/date-picker.md) / [Web Components](web-components/ve-date-picker.md)） | 选择单个日期、日期时间或日期范围。 |
| 时间选择器 TimePicker（[React](react/time-picker.md) / [Web Components](web-components/ve-time-picker.md)） | 选择时间值，支持精度和受控输入。 |
| 级联选择 Cascader（[React](react/cascader.md) / [Web Components](web-components/ve-cascader.md)） | 在层级结构中选择路径。 |
| 复选框 Checkbox（[React](react/checkbox.md) / [Web Components](web-components/ve-checkbox.md)） | 在备选项中进行多选。 |
| 单选框 Radio（[React](react/radio.md) / [Web Components](web-components/ve-radio.md)） | 在互斥选项中选择一个值。 |
| 开关 Switch（[React](react/switch.md) / [Web Components](web-components/ve-switch.md)） | 表示启用或关闭的二元状态。 |
| 上传 Upload（[React](react/upload.md) / [Web Components](web-components/ve-upload.md)） | 选择文件并展示上传状态。 |

### 展示

| 组件 | 描述 |
| --- | --- |
| 头像 Avatar（[React](react/avatar.md) / [Web Components](web-components/ve-avatar.md)） | 展示用户、团队或实体的视觉标识。 |
| 空状态 Empty（[React](react/empty.md) / [Web Components](web-components/ve-empty.md)） | 展示暂无数据、无结果或空资源状态。 |
| 表格 Table（[React](react/table.md) / [Web Components](web-components/ve-table.md)） | 基于 TanStack Table 的结构化二维数据展示。 |
| 分页 Pagination（[React](react/pagination.md) / [Web Components](web-components/ve-pagination.md)） | 在多页数据间切换浏览，支持总数和页容量选择。 |
| 标签页 Tabs（[React](react/tabs.md) / [Web Components](web-components/ve-tabs.md)） | 在同一视图内组织多块内容。 |
| 文字提示 Tooltip（[React](react/tooltip.md) / [Web Components](web-components/ve-tooltip.md)） | 为目标元素提供悬浮说明。 |
| 下拉菜单 Dropdown（[React](react/dropdown.md) / [Web Components](web-components/ve-dropdown.md)） | 承载更多操作或选项菜单。 |
