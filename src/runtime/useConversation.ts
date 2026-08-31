import { useCallback, useMemo, useRef, useState } from 'react';
import type { AgentTemplateConfig } from '../config/types';
import type { ChatMessage, ProcessStepItem, SendMessageOptions, ToolCallItem } from './types';
import { createAdapter } from './createAdapter';

/**
 * 会话状态 hook。
 *
 * 职责：把 `AgentRuntimeAdapter` 的事件流累积成可渲染的消息列表，
 * 对 UI 暴露 `messages / loading / send / stop`。UI 组件不接触 adapter 细节。
 */

let idSeq = 0;
function nextId(prefix: string): string {
  idSeq += 1;
  return `${prefix}-${Date.now()}-${idSeq}`;
}

function mergeProcessStep(
  steps: ProcessStepItem[] | undefined,
  nextStep: ProcessStepItem,
): ProcessStepItem[] {
  const current = steps ?? [];
  const index = current.findIndex((step) => step.id === nextStep.id);
  if (index < 0) return [...current, nextStep];

  const merged = {
    ...current[index],
    ...nextStep,
    toolCalls: nextStep.toolCalls ?? current[index].toolCalls,
    artifacts: nextStep.artifacts ?? current[index].artifacts,
  };
  return current.map((step, i) => (i === index ? merged : step));
}

function appendProcessStepDelta(
  steps: ProcessStepItem[] | undefined,
  id: string,
  delta: string,
): ProcessStepItem[] {
  const current = steps ?? [];
  const index = current.findIndex((step) => step.id === id);
  if (index < 0) {
    return [
      ...current,
      {
        id,
        title: '处理中',
        kind: 'reasoning',
        status: 'loading',
        content: delta,
      },
    ];
  }

  return current.map((step, i) =>
    i === index ? { ...step, content: `${step.content ?? ''}${delta}` } : step,
  );
}

function mergeToolCall(
  steps: ProcessStepItem[] | undefined,
  toolCall: ToolCallItem,
  stepId?: string,
): ProcessStepItem[] {
  const id = stepId ?? `tool-${toolCall.id}`;
  const current = steps ?? [];
  const index = current.findIndex((step) => step.id === id);
  const mergeCalls = (calls: ToolCallItem[] | undefined) => {
    const list = calls ?? [];
    const callIndex = list.findIndex((call) => call.id === toolCall.id);
    if (callIndex < 0) return [...list, toolCall];
    return list.map((call, i) => (i === callIndex ? { ...call, ...toolCall } : call));
  };

  if (index < 0) {
    return [
      ...current,
      {
        id,
        title: toolCall.summary || `调用工具：${toolCall.name}`,
        kind: 'tool',
        status: toolCall.status,
        toolCalls: [toolCall],
      },
    ];
  }

  return current.map((step, i) =>
    i === index
      ? {
          ...step,
          status: toolCall.status,
          toolCalls: mergeCalls(step.toolCalls),
        }
      : step,
  );
}

function finishProcessSteps(steps: ProcessStepItem[] | undefined): ProcessStepItem[] | undefined {
  return steps?.map((step) =>
    step.status === 'loading'
      ? {
          ...step,
          status: 'success',
          toolCalls: step.toolCalls?.map((call) =>
            call.status === 'loading' ? { ...call, status: 'success' } : call,
          ),
        }
      : step,
  );
}

function formatQuotedText(text: string, options?: SendMessageOptions): string {
  const quote = options?.quotedMessage;
  if (!quote?.content) return text;
  const role = quote.role === 'user' ? '用户消息' : '助手回复';
  return `引用上下文（${role}）：\n${quote.content}\n\n用户问题：\n${text}`;
}

export interface UseConversationResult {
  messages: ChatMessage[];
  loading: boolean;
  sessions: Record<string, ConversationSessionState>;
  send: (text: string, options?: SendMessageOptions, sessionId?: string) => void;
  regenerate: (assistantMessageId: string, sessionId?: string) => void;
  stop: (sessionId?: string) => void;
  reset: (sessionId?: string) => void;
  loadMessages: (nextMessages: ChatMessage[], sessionId?: string) => void;
}

export interface ConversationSessionState {
  messages: ChatMessage[];
  loading: boolean;
}

const DRAFT_SESSION_ID = '__draft__';

function createEmptySession(): ConversationSessionState {
  return { messages: [], loading: false };
}

function normalizeLoadedMessages(messages: ChatMessage[]): ChatMessage[] {
  return messages.map((message) => ({ ...message, streaming: false }));
}

function findPreviousUserMessageIndex(messages: ChatMessage[], beforeIndex: number): number {
  for (let index = beforeIndex - 1; index >= 0; index -= 1) {
    if (messages[index].role === 'user') return index;
  }
  return -1;
}

export function useConversation(config: AgentTemplateConfig): UseConversationResult {
  const [activeSessionId, setActiveSessionId] = useState(DRAFT_SESSION_ID);
  const [sessions, setSessions] = useState<Record<string, ConversationSessionState>>({
    [DRAFT_SESSION_ID]: createEmptySession(),
  });
  const abortRefs = useRef(new Map<string, AbortController>());

  // config 变化时重建 adapter（例如切换 mock/http/endpoint）。
  const adapter = useMemo(() => createAdapter(config), [config]);

  const activeSession = sessions[activeSessionId] ?? createEmptySession();

  const patchAssistantMessage = useCallback(
    (sessionId: string, assistantId: string, updater: (message: ChatMessage) => ChatMessage) => {
      setSessions((current) => {
        const session = current[sessionId] ?? createEmptySession();
        return {
          ...current,
          [sessionId]: {
            ...session,
            messages: session.messages.map((message) =>
              message.id === assistantId ? updater(message) : message,
            ),
          },
        };
      });
    },
    [],
  );

  const send = useCallback(
    (text: string, options?: SendMessageOptions, sessionId = activeSessionId) => {
      const trimmed = text.trim();
      const attachments = options?.attachments?.length ? options.attachments : undefined;
      if (!trimmed && !attachments?.length) return;

      const session = sessions[sessionId] ?? createEmptySession();
      if (session.loading) return;

      const thinkingEnabled = options?.thinkingEnabled !== false;
      const searchEnabled = options?.searchEnabled === true;
      const skillInvocation = options?.skillInvocation;
      const messageText = trimmed || '已上传附件';

      const userMsg: ChatMessage = {
        id: nextId('user'),
        role: 'user',
        content: messageText,
        quotedMessage: options?.quotedMessage ?? undefined,
        attachments,
        skillInvocation,
      };
      const assistantId = nextId('assistant');
      const assistantMsg: ChatMessage = {
        id: assistantId,
        role: 'assistant',
        content: '',
        reasoning: thinkingEnabled ? '' : undefined,
        processSteps: [],
        streaming: true,
      };

      const history = session.messages;
      setSessions((current) => ({
        ...current,
        [sessionId]: {
          messages: [...history, userMsg, assistantMsg],
          loading: true,
        },
      }));
      setActiveSessionId(sessionId);

      const controller = new AbortController();
      abortRefs.current.set(sessionId, controller);

      void (async () => {
        try {
          for await (const event of adapter.sendMessage({
            text: formatQuotedText(messageText, options),
            history,
            thinkingEnabled,
            searchEnabled,
            replyTone: config.personalization?.replyTone,
            systemPrompt: config.personalization?.systemPrompt,
            memories: config.personalization?.memoryEnabled
              ? config.personalization.memories
              : undefined,
            toolMemoryEnabled:
              config.personalization?.memoryEnabled &&
              config.personalization.toolMemoryEnabled,
            attachments,
            skillInvocation,
            signal: controller.signal,
          })) {
            switch (event.type) {
              case 'reasoning-delta':
                if (!thinkingEnabled) break;
                patchAssistantMessage(sessionId, assistantId, (m) => ({
                  ...m,
                  reasoning: (m.reasoning ?? '') + event.delta,
                }));
                break;
              case 'process-step':
                patchAssistantMessage(sessionId, assistantId, (m) => ({
                  ...m,
                  processSteps: mergeProcessStep(m.processSteps, event.step),
                }));
                break;
              case 'process-step-delta':
                patchAssistantMessage(sessionId, assistantId, (m) => ({
                  ...m,
                  processSteps: appendProcessStepDelta(m.processSteps, event.id, event.delta),
                }));
                break;
              case 'tool-call':
                patchAssistantMessage(sessionId, assistantId, (m) => ({
                  ...m,
                  processSteps: mergeToolCall(m.processSteps, event.toolCall, event.stepId),
                }));
                break;
              case 'content-delta':
                patchAssistantMessage(sessionId, assistantId, (m) => ({ ...m, content: m.content + event.delta }));
                break;
              case 'citations':
                patchAssistantMessage(sessionId, assistantId, (m) => ({ ...m, citations: event.citations }));
                break;
              case 'artifacts':
                patchAssistantMessage(sessionId, assistantId, (m) => ({ ...m, artifacts: event.artifacts }));
                break;
              case 'error':
                patchAssistantMessage(sessionId, assistantId, (m) => ({
                  ...m,
                  content: m.content || `出错了：${event.message}`,
                  streaming: false,
                }));
                break;
              case 'done':
                break;
            }
          }
        } finally {
          patchAssistantMessage(sessionId, assistantId, (m) => ({
            ...m,
            processSteps: finishProcessSteps(m.processSteps),
            streaming: false,
          }));
          setSessions((current) => {
            const session = current[sessionId] ?? createEmptySession();
            return {
              ...current,
              [sessionId]: {
                ...session,
                loading: false,
              },
            };
          });
          if (abortRefs.current.get(sessionId) === controller) {
            abortRefs.current.delete(sessionId);
          }
        }
      })();
    },
    [activeSessionId, adapter, config.personalization, patchAssistantMessage, sessions],
  );

  const regenerate = useCallback(
    (assistantMessageId: string, sessionId = activeSessionId) => {
      const session = sessions[sessionId] ?? createEmptySession();
      if (session.loading) return;

      const assistantIndex = session.messages.findIndex((message) => message.id === assistantMessageId);
      if (assistantIndex < 0) return;

      const userIndex = findPreviousUserMessageIndex(session.messages, assistantIndex);
      if (userIndex < 0) return;

      const userMsg = session.messages[userIndex];
      const oldAssistant = session.messages[assistantIndex];
      const assistantId = nextId('assistant');
      const thinkingEnabled = oldAssistant.reasoning !== undefined;
      const assistantMsg: ChatMessage = {
        id: assistantId,
        role: 'assistant',
        content: '',
        reasoning: thinkingEnabled ? '' : undefined,
        processSteps: [],
        streaming: true,
      };
      const options: SendMessageOptions = {
        quotedMessage: userMsg.quotedMessage,
        attachments: userMsg.attachments,
        skillInvocation: userMsg.skillInvocation,
        thinkingEnabled,
      };
      const history = session.messages.slice(0, userIndex);
      const nextMessages = [
        ...session.messages.slice(0, assistantIndex),
        assistantMsg,
        ...session.messages.slice(assistantIndex + 1),
      ];

      setSessions((current) => ({
        ...current,
        [sessionId]: {
          messages: nextMessages,
          loading: true,
        },
      }));
      setActiveSessionId(sessionId);

      const controller = new AbortController();
      abortRefs.current.set(sessionId, controller);

      void (async () => {
        try {
          for await (const event of adapter.sendMessage({
            text: formatQuotedText(userMsg.content, options),
            history,
            thinkingEnabled,
            searchEnabled: false,
            replyTone: config.personalization?.replyTone,
            systemPrompt: config.personalization?.systemPrompt,
            memories: config.personalization?.memoryEnabled
              ? config.personalization.memories
              : undefined,
            toolMemoryEnabled:
              config.personalization?.memoryEnabled &&
              config.personalization.toolMemoryEnabled,
            attachments: userMsg.attachments,
            signal: controller.signal,
          })) {
            switch (event.type) {
              case 'reasoning-delta':
                if (!thinkingEnabled) break;
                patchAssistantMessage(sessionId, assistantId, (m) => ({
                  ...m,
                  reasoning: (m.reasoning ?? '') + event.delta,
                }));
                break;
              case 'process-step':
                patchAssistantMessage(sessionId, assistantId, (m) => ({
                  ...m,
                  processSteps: mergeProcessStep(m.processSteps, event.step),
                }));
                break;
              case 'process-step-delta':
                patchAssistantMessage(sessionId, assistantId, (m) => ({
                  ...m,
                  processSteps: appendProcessStepDelta(m.processSteps, event.id, event.delta),
                }));
                break;
              case 'tool-call':
                patchAssistantMessage(sessionId, assistantId, (m) => ({
                  ...m,
                  processSteps: mergeToolCall(m.processSteps, event.toolCall, event.stepId),
                }));
                break;
              case 'content-delta':
                patchAssistantMessage(sessionId, assistantId, (m) => ({ ...m, content: m.content + event.delta }));
                break;
              case 'citations':
                patchAssistantMessage(sessionId, assistantId, (m) => ({ ...m, citations: event.citations }));
                break;
              case 'artifacts':
                patchAssistantMessage(sessionId, assistantId, (m) => ({ ...m, artifacts: event.artifacts }));
                break;
              case 'error':
                patchAssistantMessage(sessionId, assistantId, (m) => ({
                  ...m,
                  content: m.content || `出错了：${event.message}`,
                  streaming: false,
                }));
                break;
              case 'done':
                break;
            }
          }
        } finally {
          patchAssistantMessage(sessionId, assistantId, (m) => ({
            ...m,
            processSteps: finishProcessSteps(m.processSteps),
            streaming: false,
          }));
          setSessions((current) => {
            const nextSession = current[sessionId] ?? createEmptySession();
            return {
              ...current,
              [sessionId]: {
                ...nextSession,
                loading: false,
              },
            };
          });
          if (abortRefs.current.get(sessionId) === controller) {
            abortRefs.current.delete(sessionId);
          }
        }
      })();
    },
    [activeSessionId, adapter, config.personalization, patchAssistantMessage, sessions],
  );

  const stop = useCallback(
    (sessionId = activeSessionId) => {
      abortRefs.current.get(sessionId)?.abort();
    },
    [activeSessionId],
  );

  const reset = useCallback(
    (sessionId = activeSessionId) => {
      abortRefs.current.get(sessionId)?.abort();
      abortRefs.current.delete(sessionId);
      setSessions((current) => ({
        ...current,
        [sessionId]: createEmptySession(),
      }));
      setActiveSessionId(sessionId);
    },
    [activeSessionId],
  );

  const loadMessages = useCallback((nextMessages: ChatMessage[], sessionId = DRAFT_SESSION_ID) => {
    setSessions((current) => {
      if (current[sessionId]) return current;
      return {
        ...current,
        [sessionId]: {
          messages: normalizeLoadedMessages(nextMessages),
          loading: false,
        },
      };
    });
    setActiveSessionId(sessionId);
  }, []);

  return {
    messages: activeSession.messages,
    loading: activeSession.loading,
    sessions,
    send,
    regenerate,
    stop,
    reset,
    loadMessages,
  };
}
