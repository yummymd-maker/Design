import type {
  AgentRuntimeAdapter,
  AgentRuntimeEvent,
  SendMessageInput,
  SearchInput,
  SearchRuntimeEvent,
} from './adapter';
import type { CitationItem, ArtifactItem, ProcessStepItem, ToolCallItem } from './types';
import { createMockAdapter } from './mockAdapter';

/**
 * HTTP adapter：对接普通 `POST {endpoint}` 接口。
 *
 * 约定的最小请求 / 响应协议（可按需在此文件调整以匹配你的后端）：
 *
 * 请求体：
 *   { "message": string, "history": { role, content }[] }
 *
 * 响应体（一次性 JSON，非流式）：
 *   {
 *     "reasoning"?: string,
 *     "processSteps"?: { id, title, status?, kind?, content?, toolCalls?, artifacts? }[],
 *     "toolCalls"?: { id, name, status, summary?, input?, output?, durationMs? }[],
 *     "content": string,
 *     "citations"?: { index, title, url?, snippet? }[],
 *     "artifacts"?: { id, title, kind, description? }[]
 *   }
 *
 * 需要 SSE / fetch 流式时，改用 streamAdapter（M5 提供示例）。
 */
export interface HttpAdapterOptions {
  /** 后端地址。 */
  endpoint: string;
  /** 额外请求头（如鉴权）。 */
  headers?: Record<string, string>;
}

interface HttpChatResponse {
  reasoning?: string;
  processSteps?: ProcessStepItem[];
  toolCalls?: ToolCallItem[];
  content: string;
  citations?: CitationItem[];
  artifacts?: ArtifactItem[];
}

export function createHttpAdapter(options: HttpAdapterOptions): AgentRuntimeAdapter {
  const fallback = createMockAdapter();

  return {
    async *sendMessage(input: SendMessageInput): AsyncIterable<AgentRuntimeEvent> {
      const { text, history, signal } = input;
      try {
        const res = await fetch(options.endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', ...options.headers },
          body: JSON.stringify({
            message: text,
            history: history.map((m) => ({ role: m.role, content: m.content })),
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

        if (!res.ok) {
          yield { type: 'error', message: `请求失败：HTTP ${res.status}` };
          return;
        }

        const data = (await res.json()) as HttpChatResponse;

        if (data.reasoning) {
          yield { type: 'reasoning-delta', delta: data.reasoning };
        }
        if (data.processSteps?.length) {
          for (const step of data.processSteps) {
            yield { type: 'process-step', step };
          }
        }
        if (data.toolCalls?.length) {
          for (const toolCall of data.toolCalls) {
            yield { type: 'tool-call', toolCall };
          }
        }
        yield { type: 'content-delta', delta: data.content ?? '' };
        if (data.citations?.length) {
          yield { type: 'citations', citations: data.citations };
        }
        if (data.artifacts?.length) {
          yield { type: 'artifacts', artifacts: data.artifacts };
        }
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
      // TODO: 对接真实搜索接口 `POST {endpoint}/search`，
      // 协议示例：{ query, types?, limit?, cursor? } → { results, total, hasMore }
      // 目前先回落 mock 数据，保证预览可用。
      return fallback.search(input);
    },
  };
}
