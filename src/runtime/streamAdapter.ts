import type {
  AgentRuntimeAdapter,
  AgentRuntimeEvent,
  SendMessageInput,
  SearchInput,
  SearchRuntimeEvent,
} from './adapter';
import { createMockAdapter } from './mockAdapter';

/**
 * Stream adapter：对接**流式**后端（Server-Sent Events / NDJSON），实现真正的逐字输出。
 *
 * 与 httpAdapter（一次性 JSON）的区别：本 adapter 边收边 yield，UI 侧即时渲染增量。
 *
 * 约定协议
 * --------
 * 请求：`POST {endpoint}`，body `{ message: string, history: {role,content}[], stream: true }`
 *
 * 响应：`Content-Type: text/event-stream`（或按行分隔的 NDJSON），每个数据块是一个
 *      与 `AgentRuntimeEvent` 同构的 JSON，例如：
 *
 *   data: {"type":"reasoning-delta","delta":"正在检索…"}
 *   data: {"type":"process-step","step":{"id":"plan","title":"拆解任务","status":"loading","kind":"reasoning"}}
 *   data: {"type":"process-step-delta","id":"plan","delta":"先确认目标，再检索资料。"}
 *   data: {"type":"tool-call","stepId":"search","toolCall":{"id":"t1","name":"search_docs","status":"success","summary":"找到 2 条资料"}}
 *   data: {"type":"content-delta","delta":"根据"}
 *   data: {"type":"content-delta","delta":"你的问题…"}
 *   data: {"type":"citations","citations":[{"index":1,"title":"来源","url":"https://..."}]}
 *   data: {"type":"artifacts","artifacts":[{"id":"a1","title":"报告","kind":"markdown"}]}
 *   data: {"type":"done"}
 *
 * 兼容两种分隔：
 * - SSE：以 `data:` 前缀、空行分隔事件（标准 EventStream）。
 * - NDJSON：每行一个 JSON（无 `data:` 前缀）。
 *
 * 如需接入 OpenAI 风格的 `data: {choices:[{delta:{content}}]}`，可在 parseChunk 里改映射。
 */
export interface StreamAdapterOptions {
  /** 后端地址。 */
  endpoint: string;
  /** 额外请求头（如鉴权）。 */
  headers?: Record<string, string>;
}

/** 把一行文本解析成 AgentRuntimeEvent；无法解析时返回 null（跳过）。 */
function parseLine(line: string): AgentRuntimeEvent | null {
  let payload = line.trim();
  if (!payload) return null;
  // 兼容 SSE 的 "data:" 前缀
  if (payload.startsWith('data:')) {
    payload = payload.slice(5).trim();
  }
  // SSE 结束哨兵
  if (payload === '[DONE]') return { type: 'done' };
  try {
    const obj = JSON.parse(payload);
    if (obj && typeof obj.type === 'string') {
      return obj as AgentRuntimeEvent;
    }
    return null;
  } catch {
    return null;
  }
}

export function createStreamAdapter(options: StreamAdapterOptions): AgentRuntimeAdapter {
  const fallback = createMockAdapter();

  return {
    async *sendMessage(input: SendMessageInput): AsyncIterable<AgentRuntimeEvent> {
      const { text, history, signal } = input;
      try {
        const res = await fetch(options.endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'text/event-stream',
            ...options.headers,
          },
          body: JSON.stringify({
            message: text,
            history: history.map((m) => ({ role: m.role, content: m.content })),
            stream: true,
            thinkingEnabled: input.thinkingEnabled !== false,
            searchEnabled: input.searchEnabled === true,
            replyTone: input.replyTone,
            systemPrompt: input.systemPrompt,
            memories: input.memories ?? [],
            toolMemoryEnabled: input.toolMemoryEnabled === true,
            attachments: input.attachments ?? [],
            skillInvocation: input.skillInvocation,
          }),
          signal,
        });

        if (!res.ok || !res.body) {
          yield { type: 'error', message: `请求失败：HTTP ${res.status}` };
          return;
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });

          // 按换行切分，保留最后一段可能不完整的行到下次拼接
          const lines = buffer.split('\n');
          buffer = lines.pop() ?? '';
          for (const line of lines) {
            const event = parseLine(line);
            if (event) yield event;
          }
        }

        // 冲刷缓冲区里最后一行
        const tail = parseLine(buffer);
        if (tail) yield tail;

        yield { type: 'done' };
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') {
          yield { type: 'done' };
          return;
        }
        yield { type: 'error', message: err instanceof Error ? err.message : String(err) };
      }
    },

    search(input: SearchInput): AsyncIterable<SearchRuntimeEvent> {
      // TODO: 对接真实流式搜索接口，协议可沿用 SSE / NDJSON。
      // 目前先回落 mock 数据，保证预览可用。
      return fallback.search(input);
    },
  };
}
