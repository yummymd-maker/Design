# 配方 · Mock 数据与交互

构建可运行 demo 或暂无真实后端页面时，使用本文件。

## Mock 数据结构

优先使用接近生产的数据对象，不要只堆零散字符串。

```ts
type AgentMessage = {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  status?: 'idle' | 'generating' | 'complete' | 'error';
  createdAt: string;
  citations?: CitationItem[];
  artifacts?: ArtifactItem[];
};

type ThoughtStep = {
  id: string;
  title: string;
  status: 'pending' | 'running' | 'complete' | 'error';
  kind: 'think' | 'search' | 'tool' | 'result';
  content: string;
};

type CapabilityItem = {
  id: string;
  name: string;
  description: string;
  type: 'skill' | 'mcp' | 'tool' | 'template';
  installed: boolean;
  enabled?: boolean;
  tags?: string[];
};
```

使用稳定 id。真实 API 接入前，mock 数据放在明显的 fixture 或页面附近常量中。

## 必备状态覆盖

Agent 页面应包含用户自然可到达的状态：

| 区域 | 状态 |
|---|---|
| Composer | empty、typed、submitted、loading、cancelled |
| Chat response | thinking、streaming/generating、completed、error |
| Thought chain | collapsed、expanded、running step、completed step |
| Citations | present、empty、clicked |
| Artifacts | available、opened、closed、preview/code switched |
| Lists | populated、filtered、empty result |
| Upload | selected、uploading、success、error、removed |
| Modal | closed、open、submitting、complete |
| Settings | clean、dirty、saved、validation error |

不要实现无法改变可见状态的控件。

## Mock Streaming 模拟

demo 中可以用 timer 或增量字符串模拟模型生成：

1. 立即追加用户消息。
2. 追加 `status: 'generating'` 的 assistant placeholder。
3. 展示 `Thinking` 或 `ThoughtChain`。
4. 逐段追加回复，或短延迟后替换内容。
5. 将回复标记为 complete。
6. cancel 时清理 timer，并把状态设为 idle / cancelled。

streaming helper 保持页面局部，除非项目已有共享 mock API 层。

## 最小交互标准

- Search input 使用大小写不敏感匹配过滤数组。
- Tabs 过滤或切换真实内容。
- Sort 控件重排数据。
- Upload 尽量使用 file input；静态 prototype 如无法选择文件，也要追加有名称的 mock file 并展示反馈。
- Switch 和 Checkbox 更新 item 状态。
- More menu 至少提供两个真实操作。
- Modal confirm 改变父页面状态，或展示 validation / loading。
- Sidebar active nav 随 route 或本地页面状态变化。
- Theme toggle 使用宿主主题机制；没有主题系统时才使用 `class="dark"`。

## 反馈

只有真实状态变化后才使用 `Message`、`Notification`、`Alert`、inline text、loading button 或 status tag。除非用户明确要求不可用占位入口，否则避免泛泛的“即将上线”反馈。
