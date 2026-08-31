import type {
  AgentRuntimeAdapter,
  AgentRuntimeEvent,
  SearchInput,
  SearchRuntimeEvent,
  SendMessageInput,
} from './adapter';
import { normalizeArkBaseURL } from './arkBaseURL';
import { createMockAdapter } from './mockAdapter';

export interface ManagedAgentAdapterOptions {
  endpoint?: string;
  baseURL?: string;
  apiKey?: string;
  agentId?: string;
  environmentId?: string;
  sessionId?: string;
  sessionMode?: 'reuse' | 'new-per-chat';
  stream?: boolean;
}

type ManagedAgentPayload = Record<string, unknown>;

const TOOL_SUMMARY_MAX_LENGTH = 80;
const TOOL_OUTPUT_MAX_ITEMS = 3;
const TOOL_OUTPUT_MAX_TEXT_LENGTH = 320;

function normalizeApiKey(apiKey?: string) {
  return apiKey?.trim().replace(/^Bearer\s+/i, '') ?? '';
}

function resolveEndpoint(options: ManagedAgentAdapterOptions) {
  return options.endpoint?.trim() || '/api/managed-agent/stream';
}

function toRuntimeEvent(payload: ManagedAgentPayload): AgentRuntimeEvent | null {
  if (typeof payload.type === 'string' && isRuntimeEventType(payload.type)) {
    return payload as AgentRuntimeEvent;
  }

  if (Array.isArray(payload.data)) {
    let fallback: AgentRuntimeEvent | null = null;
    for (const item of payload.data) {
      if (!isRecord(item)) continue;
      const event = toRuntimeEvent(item);
      if (!event) continue;
      if (event.type === 'content-delta' || event.type === 'error') return event;
      fallback ??= event;
    }
    return fallback;
  }

  const eventName = String(payload.event ?? payload.type ?? payload.status ?? '');
  const data = isRecord(payload.data) ? payload.data : payload;
  const content = pickContentText(data) || pickString(data, ['delta', 'content', 'text', 'message', 'answer']);
  const reasoning = pickString(data, ['reasoning', 'reasoning_content', 'thinking', 'thought']);

  if (eventName === 'user.message' || eventName === 'system.message' || eventName.startsWith('span.')) {
    return null;
  }
  if (eventName === 'session.status_idle' || eventName === 'done' || eventName === 'completed') {
    return { type: 'done' };
  }
  if (eventName.includes('error')) {
    return { type: 'error', message: content || 'ManagedAgent 请求失败' };
  }
  if (eventName.includes('tool')) {
    const id = String(data.id ?? data.tool_call_id ?? `tool-${Date.now()}`);
    const name = String(data.name ?? data.tool_name ?? eventName);
    const output = simplifyToolOutput(data.output);
    const summary = summarizeToolCall(content || String(data.summary ?? ''), output);
    return {
      type: 'tool-call',
      toolCall: {
        id,
        name,
        status: eventName.includes('completed') ? 'success' : 'loading',
        summary,
        input: data.input,
        output,
      },
    };
  }
  if (eventName.includes('session') || eventName.includes('run')) {
    return {
      type: 'process-step',
      step: {
        id: String(data.session_id ?? data.run_id ?? 'managed-agent-session'),
        title: eventName.includes('session') ? 'ManagedAgent 会话' : 'ManagedAgent 任务',
        status: eventName.includes('idle') || eventName.includes('completed') ? 'success' : 'loading',
        kind: 'tool',
        content,
      },
    };
  }
  if (reasoning) {
    return { type: 'reasoning-delta', delta: reasoning };
  }
  if (content) {
    return { type: 'content-delta', delta: content };
  }
  return null;
}

function toManagedAgentEvents(input: SendMessageInput) {
  const events: ManagedAgentPayload[] = [
    {
      type: 'user.message',
      content: toManagedAgentContent(input.text, input.attachments),
    },
  ];

  if (input.skillInvocation) {
    events.unshift({
      type: 'skill.invoke',
      skill: {
        id: input.skillInvocation.id,
        name: input.skillInvocation.name,
        tool_name: input.skillInvocation.runtime?.managedAgentToolName,
        prompt_template: input.skillInvocation.promptTemplate,
      },
    });
  }

  if (input.systemPrompt?.trim()) {
    events.push({
      type: 'system.message',
      content: [{ type: 'text', text: input.systemPrompt.trim() }],
    });
  }

  return events;
}

function toManagedAgentContent(text: string, attachments?: SendMessageInput['attachments']) {
  const content: ManagedAgentPayload[] = [{ type: 'text', text }];
  for (const attachment of attachments ?? []) {
    if (attachment.type.startsWith('image/') && attachment.dataUrl) {
      content.push({
        type: 'image',
        source: { type: 'base64', media_type: attachment.type, data: attachment.dataUrl.split(',').pop() ?? '' },
      });
    } else {
      const documentText = attachment.textContent
        ? `${attachment.textContent}${attachment.textTruncated ? '\n\n（附件内容较长，以上为前 20000 字符。）' : ''}`
        : `已上传附件：${attachment.name}（${attachment.type || '未知类型'}，${attachment.size} bytes）。当前仅提供文件信息，若需正文解析请接入服务端文件解析。`;
      content.push({
        type: 'document',
        source: {
          type: 'text',
          media_type: attachment.textContent ? 'text/plain' : 'application/octet-stream',
          data: documentText,
        },
        title: attachment.name,
      });
    }
  }
  return content;
}

function isRuntimeEventType(type: string) {
  return [
    'reasoning-delta',
    'content-delta',
    'citations',
    'artifacts',
    'process-step',
    'process-step-delta',
    'tool-call',
    'done',
    'error',
  ].includes(type);
}

function isRecord(value: unknown): value is ManagedAgentPayload {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function pickString(source: ManagedAgentPayload, keys: string[]) {
  for (const key of keys) {
    const value = source[key];
    if (typeof value === 'string' && value) return value;
    if (isRecord(value)) {
      const nested = pickString(value, keys);
      if (nested) return nested;
    }
  }
  return '';
}

function pickContentText(source: ManagedAgentPayload): string {
  const content = source.content;
  if (typeof content === 'string') return content;
  if (!Array.isArray(content)) return '';
  return content
    .map((item) => {
      if (typeof item === 'string') return item;
      if (!isRecord(item)) return '';
      return pickString(item, ['text', 'data', 'content']);
    })
    .filter(Boolean)
    .join('');
}

function summarizeToolCall(summary: string, output: unknown): string {
  const normalized = summary.trim();
  if (normalized && !looksLikeRawJson(normalized)) {
    return truncateText(normalized, TOOL_SUMMARY_MAX_LENGTH);
  }
  if (Array.isArray(output)) {
    return output.length ? `完成，返回 ${output.length} 条结果` : '已完成';
  }
  if (typeof output === 'string' && output) {
    return truncateText(output, TOOL_SUMMARY_MAX_LENGTH);
  }
  return '';
}

function simplifyToolOutput(output: unknown): unknown {
  const parsed = parseMaybeJson(output);
  const source = parsed ?? output;

  if (isRecord(source)) {
    const searchList = findArrayByKey(source, 'search_response_list');
    if (searchList?.length) {
      return searchList.slice(0, TOOL_OUTPUT_MAX_ITEMS).map((item, index) => summarizeSearchItem(item, index));
    }

    const results = findArrayByKey(source, 'results') ?? findArrayByKey(source, 'documents');
    if (results?.length) {
      return results.slice(0, TOOL_OUTPUT_MAX_ITEMS).map((item, index) => summarizeSearchItem(item, index));
    }
  }

  if (typeof output === 'string') {
    if (looksLikeRawJson(output)) return '工具已返回结构化结果，原始响应已折叠为摘要。';
    return truncateText(output, TOOL_OUTPUT_MAX_TEXT_LENGTH);
  }

  return output;
}

function summarizeSearchItem(item: unknown, index: number): ManagedAgentPayload {
  if (!isRecord(item)) {
    return { index: index + 1, content: truncateText(String(item), TOOL_OUTPUT_MAX_TEXT_LENGTH) };
  }

  return {
    index: index + 1,
    title: pickString(item, ['title', 'name']) || `结果 ${index + 1}`,
    url: pickString(item, ['url', 'tos_url', 'link']),
    snippet: truncateText(
      pickString(item, ['summary', 'snippet', 'content', 'overview', 'text']),
      TOOL_OUTPUT_MAX_TEXT_LENGTH,
    ),
  };
}

function parseMaybeJson(value: unknown): unknown {
  if (typeof value !== 'string') return value;
  const text = value.trim();
  if (!looksLikeRawJson(text)) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

function looksLikeRawJson(text: string): boolean {
  const trimmed = text.trim();
  return (
    (trimmed.startsWith('{') && trimmed.endsWith('}')) ||
    (trimmed.startsWith('[') && trimmed.endsWith(']'))
  );
}

function findArrayByKey(source: ManagedAgentPayload, key: string): unknown[] | null {
  const value = source[key];
  if (Array.isArray(value)) return value;

  for (const nested of Object.values(source)) {
    if (!isRecord(nested)) continue;
    const found = findArrayByKey(nested, key);
    if (found) return found;
  }
  return null;
}

function truncateText(text: string, maxLength: number): string {
  const normalized = text.replace(/\s+/g, ' ').trim();
  if (normalized.length <= maxLength) return normalized;
  return `${normalized.slice(0, maxLength)}...`;
}

function parseStreamBlock(block: string): AgentRuntimeEvent | null {
  const lines = block.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  if (!lines.length) return null;

  let eventName = '';
  const dataLines: string[] = [];
  const rawLines: string[] = [];

  for (const line of lines) {
    if (line.startsWith('event:')) {
      eventName = line.slice(6).trim();
      continue;
    }
    if (line.startsWith('data:')) {
      dataLines.push(line.slice(5).trim());
      continue;
    }
    rawLines.push(line);
  }

  const payload = (dataLines.length ? dataLines.join('\n') : rawLines.join('\n')).trim();
  if (!payload) return null;
  if (payload === '[DONE]') return { type: 'done' };

  try {
    const parsed = JSON.parse(payload) as ManagedAgentPayload;
    if (eventName && !parsed.event && !parsed.type) {
      parsed.event = eventName;
    }
    return toRuntimeEvent(parsed);
  } catch {
    if (eventName.includes('message') || !eventName) {
      return { type: 'content-delta', delta: payload };
    }
    return null;
  }
}

function parseJsonLine(line: string): AgentRuntimeEvent | null {
  const payload = line.trim();
  if (!payload || payload === '[DONE]') return payload === '[DONE]' ? { type: 'done' } : null;
  try {
    return toRuntimeEvent(JSON.parse(payload) as ManagedAgentPayload);
  } catch {
    return null;
  }
}

export function createManagedAgentAdapter(options: ManagedAgentAdapterOptions): AgentRuntimeAdapter {
  const fallback = createMockAdapter();

  return {
    async *sendMessage(input: SendMessageInput): AsyncIterable<AgentRuntimeEvent> {
      const apiKey = normalizeApiKey(options.apiKey);
      const endpoint = resolveEndpoint(options);
      if (!options.agentId) {
        yield { type: 'error', message: '请在「设置 / 模型配置」中填写 ManagedAgent Agent ID。' };
        return;
      }
      if (!options.environmentId) {
        yield { type: 'error', message: '请在「设置 / 模型配置」中填写 ManagedAgent Environment ID。' };
        return;
      }
      if (!apiKey) {
        yield { type: 'error', message: '请在「设置 / 模型配置」中填写 ManagedAgent API Key。' };
        return;
      }

      try {
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: options.stream === false ? 'application/json' : 'text/event-stream',
            ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
          },
          body: JSON.stringify({
            agent_id: options.agentId,
            agentId: options.agentId,
            environment_id: options.environmentId,
            environmentId: options.environmentId,
            base_url: normalizeArkBaseURL(options.baseURL),
            baseURL: normalizeArkBaseURL(options.baseURL),
            session_id: options.sessionMode === 'reuse' ? options.sessionId : undefined,
            sessionId: options.sessionMode === 'reuse' ? options.sessionId : undefined,
            events: toManagedAgentEvents(input),
            message: input.text,
            input: input.text,
            history: input.history.map((message) => ({
              role: message.role,
              content: message.content,
              attachments: message.attachments ?? [],
            })),
            stream: options.stream !== false,
            thinkingEnabled: input.thinkingEnabled !== false,
            searchEnabled: input.searchEnabled === true,
            replyTone: input.replyTone,
            systemPrompt: input.systemPrompt,
            memories: input.memories ?? [],
            toolMemoryEnabled: input.toolMemoryEnabled === true,
            attachments: input.attachments ?? [],
          }),
        });

        if (!res.ok) {
          const detail = await res.text().catch(() => '');
          yield { type: 'error', message: `ManagedAgent 请求失败：HTTP ${res.status}${detail ? ` · ${detail}` : ''}` };
          return;
        }

        if (options.stream === false || !res.body) {
          const event = toRuntimeEvent((await res.json()) as ManagedAgentPayload);
          if (event) yield event;
          yield { type: 'done' };
          return;
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
        let doneReceived = false;

        while (true) {
          if (input.signal?.aborted) {
            await reader.cancel().catch(() => undefined);
            yield { type: 'done' };
            return;
          }
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const blocks = buffer.split(/\r?\n\r?\n/);
          buffer = blocks.pop() ?? '';
          for (const block of blocks) {
            const event = parseStreamBlock(block);
            if (!event) continue;
            if (event.type === 'done') doneReceived = true;
            yield event;
          }

          if (buffer.trimStart().startsWith('{') || buffer.trimStart().startsWith('[DONE]')) {
            const lines = buffer.split(/\r?\n/);
            buffer = lines.pop() ?? '';
            for (const line of lines) {
              const event = parseJsonLine(line);
              if (!event) continue;
              if (event.type === 'done') doneReceived = true;
              yield event;
            }
          }
        }

        const tail = parseStreamBlock(buffer) ?? parseJsonLine(buffer);
        if (tail) {
          if (tail.type === 'done') doneReceived = true;
          yield tail;
        }
        if (!doneReceived) yield { type: 'done' };
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') {
          yield { type: 'done' };
          return;
        }
        yield { type: 'error', message: err instanceof Error ? err.message : String(err) };
      }
    },

    search(input: SearchInput): AsyncIterable<SearchRuntimeEvent> {
      return fallback.search(input);
    },
  };
}
