# vedesign-agent-design-evaluation

由 **vedesign-studio** 导出的 **Agent 页面源码工程**（基于 [@ve-design](https://www.npmjs.com/package/@ve-design/react)）。

与「下载完整应用」不同：这是**组件级可维护的 React 源码**，适合长期维护与真实后端接入。
右侧预览、导出工程共用同一套源码（Single Source of Truth）。

## 快速开始

```bash
pnpm install
pnpm dev      # 本地开发，默认 http://localhost:5276
pnpm build    # 生产构建，产物在 dist/
```

> 需要 Node 18+。项目已内置 `.npmrc`，`@ve-design` 依赖会自动从内网源下载。

## 目录结构

```
vedesign-agent-design-evaluation/
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
└── src/
    ├── main.tsx                 # 入口（含 prismjs 全局注入，勿删）
    ├── App.tsx                  # 根组件编排（欢迎页 / 对话页切换）
    ├── config/
    │   ├── agent.config.ts      # ★ 你的配置（品牌 / 欢迎语 / 能力开关 / adapter）
    │   └── types.ts             # 配置类型契约
    ├── theme/
    │   └── tokens.css           # ★ 你的主题 token（设计器导出快照）
    ├── components/              # UI 组件（WelcomeScreen / ConversationView / ...）
    └── runtime/                 # 状态层与后端 adapter
        ├── useConversation.ts   # 会话状态 hook
        ├── useStudioConfig.ts   # 被宿主实时驱动的 config 桥（可选）
        ├── adapter.ts           # AgentRuntimeAdapter 接口
        ├── mockAdapter.ts       # 离线演示 adapter（默认）
        ├── httpAdapter.ts       # 一次性 JSON 后端 adapter
        └── createAdapter.ts     # 按 config 选择 adapter 的工厂
```

## 改文案 / 品牌 / 能力

编辑 `src/config/agent.config.ts`，无需动组件代码。当前配置：

- 品牌：评估专家
- 主题：light
- 思考链：开 · 引用：开 · 附件：开

## 换主题

编辑 `src/theme/tokens.css`（已写入你在设计器里调好的 token）。加载顺序固定：
先 `@ve-design/react/css/default.css`，再本文件做覆盖。

## 接后端

三种数据来源，切换只改 `src/config/agent.config.ts` 的 `runtime`，UI 零改动：

| adapter  | 场景                     | 配置 |
| -------- | ------------------------ | ---- |
| `mock`   | 离线演示（默认）         | `{ adapter: 'mock' }` |
| `http`   | 一次性 JSON 后端         | `{ adapter: 'http',   endpoint: '/api/chat' }` |
| `stream` | SSE / NDJSON 流式后端    | `{ adapter: 'stream', endpoint: '/api/chat' }` |

### 本地先跑通示例后端

工程自带零依赖示例后端，可立即验证 http / stream 两种协议：

```bash
npm run server   # 启动 http://localhost:8787
```

然后把 `agent.config.ts` 改成：

```ts
runtime: { adapter: 'stream', endpoint: 'http://localhost:8787/api/chat' }
```

### 协议约定

- 请求：`POST {endpoint}`，body `{ message: string, history: {role,content}[], stream?: boolean }`
- `http` 响应（一次性 JSON，见 `src/runtime/httpAdapter.ts`）：
  `{ reasoning?, content, citations?, artifacts? }`
- `stream` 响应（SSE / NDJSON，见 `src/runtime/streamAdapter.ts`）：每个数据块是一个
  与前端事件同构的 JSON，如 `data: {"type":"content-delta","delta":"..."}`，
  以 `{"type":"done"}` 或 `[DONE]` 结束。

对接 OpenAI 风格流式，只需改 `streamAdapter.ts` 里的 `parseLine` 映射。
