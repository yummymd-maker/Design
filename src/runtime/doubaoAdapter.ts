import type {
  AgentRuntimeAdapter,
  AgentRuntimeEvent,
  SearchInput,
  SearchRuntimeEvent,
  SendMessageInput,
} from './adapter';
import { normalizeArkBaseURL } from './arkBaseURL';
import { createMockAdapter } from './mockAdapter';

export interface DoubaoAdapterOptions {
  baseURL: string;
  apiKey: string;
  model: string;
  temperature?: number;
  topP?: number;
  maxTokens?: number;
}

interface OpenAIStreamChoice {
  delta?: {
    content?: string;
    reasoning_content?: string;
    reasoning?: string;
  };
}

interface OpenAIStreamChunk {
  choices?: OpenAIStreamChoice[];
}

function normalizeApiKey(apiKey: string) {
  return apiKey.trim().replace(/^Bearer\s+/i, '');
}

const multimodalModels = new Set([
  'doubao-seed-2-1-pro-260628',
  'doubao-seed-2-1-turbo-260628',
  'doubao-seed-2-0-pro-260215',
  'doubao-seed-1-6-251015',
  'doubao-seed-1-6-flash-250828',
  'doubao-seed-1-8-251228',
  'doubao-seed-evolving-latest-version',
]);

function supportsMultimodal(model: string): boolean {
  return multimodalModels.has(model);
}

const toneInstruction: Record<NonNullable<SendMessageInput['replyTone']>, string> = {
  friendly: '回复语气保持亲和、自然，适当解释背景。',
  professional: '回复语气保持专业、严谨，使用清晰结构和准确术语。',
  concise: '回复语气保持简洁，优先给结论，避免冗长铺垫。',
  humorous: '回复语气保持轻松幽默，但不要牺牲准确性。',
};

function buildSystemMessage(input: SendMessageInput) {
  const parts = [
    toneInstruction[input.replyTone ?? 'friendly'],
    input.systemPrompt?.trim(),
    input.memories?.length
      ? `以下是需要长期参考的用户记忆：\n${input.memories.map((item) => `- ${item}`).join('\n')}`
      : '',
    input.skillInvocation
      ? `本轮需要调用 Skill：${input.skillInvocation.name}\nSkill 指令：${input.skillInvocation.promptTemplate}`
      : '',
  ].filter(Boolean);

  if (!parts.length) return undefined;
  return { role: 'system' as const, content: parts.join('\n\n') };
}

function toDoubaoMessages(input: SendMessageInput, model: string) {
  const systemMessage = buildSystemMessage(input);
  return [
    ...(systemMessage ? [systemMessage] : []),
    ...input.history.map((message) => ({
      role: message.role,
      content: toDoubaoContent(message.content, message.attachments, model),
    })),
    { role: 'user' as const, content: toDoubaoContent(input.text, input.attachments, model) },
  ];
}

function toDoubaoContent(text: string, attachments?: SendMessageInput['attachments'], model?: string) {
  if (!attachments?.length) return text;

  const content: Array<
    | { type: 'text'; text: string }
    | { type: 'image_url'; image_url: { url: string } }
  > = [{ type: 'text', text }];
  const canSendImages = supportsMultimodal(model ?? '');

  const nonImageFiles: string[] = [];
  const textFileBlocks: string[] = [];
  for (const attachment of attachments) {
    if (attachment.type.startsWith('image/') && attachment.dataUrl && canSendImages) {
      content.push({ type: 'image_url', image_url: { url: attachment.dataUrl } });
    } else if (attachment.textContent) {
      const truncatedNote = attachment.textTruncated ? '\n（附件内容较长，以下为前 20000 字符。）' : '';
      textFileBlocks.push(
        `### ${attachment.name}（${attachment.type || '文本文件'}）${truncatedNote}\n${attachment.textContent}`,
      );
    } else {
      nonImageFiles.push(`${attachment.name}（${attachment.type || '未知类型'}）`);
    }
  }

  if (!canSendImages) {
    const imageFiles = attachments.filter((a) => a.type.startsWith('image/'));
    if (imageFiles.length) {
      nonImageFiles.push(...imageFiles.map((a) => `${a.name}（${a.type || '图片'}）`));
    }
  }

  const attachmentText = [
    textFileBlocks.length ? `已读取以下文本附件内容：\n\n${textFileBlocks.join('\n\n')}` : '',
    nonImageFiles.length
      ? `以下附件当前仅提供文件名和类型，若需正文解析请接入服务端文件解析：${nonImageFiles.join('、')}`
      : '',
    !canSendImages && attachments.some((a) => a.type.startsWith('image/'))
      ? `当前模型不支持图片理解，已跳过图片附件。如需图片理解，请切换到 Doubao-Seed 系列模型。`
      : '',
  ].filter(Boolean);
  if (attachmentText.length) content[0].text = `${text}\n\n${attachmentText.join('\n\n')}`;
  return content;
}

function parseOpenAIStreamLine(line: string): AgentRuntimeEvent[] {
  let payload = line.trim();
  if (!payload) return [];
  if (payload.startsWith('data:')) payload = payload.slice(5).trim();
  if (!payload || payload === '[DONE]') return payload === '[DONE]' ? [{ type: 'done' }] : [];

  try {
    const chunk = JSON.parse(payload) as OpenAIStreamChunk;
    const delta = chunk.choices?.[0]?.delta;
    const events: AgentRuntimeEvent[] = [];
    const reasoning = delta?.reasoning_content ?? delta?.reasoning;
    if (reasoning) events.push({ type: 'reasoning-delta', delta: reasoning });
    if (delta?.content) events.push({ type: 'content-delta', delta: delta.content });
    return events;
  } catch {
    return [];
  }
}

export function createDoubaoAdapter(options: DoubaoAdapterOptions): AgentRuntimeAdapter {
  const fallback = createMockAdapter();
  const endpoint = `${normalizeArkBaseURL(options.baseURL)}/chat/completions`;

  return {
    async *sendMessage(input: SendMessageInput): AsyncIterable<AgentRuntimeEvent> {
      const apiKey = normalizeApiKey(options.apiKey);
      if (!apiKey) {
        yield {
          type: 'error',
          message: '请在「设置 / 模型配置」中填写豆包 API Key 后再使用实时模式。',
        };
        return;
      }

      try {
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'text/event-stream',
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: options.model,
            messages: toDoubaoMessages(input, options.model),
            stream: true,
            thinking: { type: input.thinkingEnabled === false ? 'disabled' : 'enabled' },
            temperature: options.temperature ?? 0.7,
            top_p: options.topP ?? 0.9,
            max_tokens: options.maxTokens ?? 4096,
          }),
          signal: input.signal,
        });

        if (!res.ok || !res.body) {
          const detail = await res.text().catch(() => '');
          yield { type: 'error', message: `豆包请求失败：HTTP ${res.status}${detail ? ` · ${detail}` : ''}` };
          return;
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
        let doneReceived = false;

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() ?? '';
          for (const line of lines) {
            for (const event of parseOpenAIStreamLine(line)) {
              if (event.type === 'done') doneReceived = true;
              yield event;
            }
          }
        }

        for (const event of parseOpenAIStreamLine(buffer)) {
          if (event.type === 'done') doneReceived = true;
          yield event;
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
