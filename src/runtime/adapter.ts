import type {
  ChatMessage,
  CitationItem,
  ArtifactItem,
  SearchResultItem,
  ProcessStepItem,
  ToolCallItem,
} from './types';

/**
 * Runtime Adapter 协议层（见 PRD 4.5）。
 *
 * UI 组件只依赖本文件的 `AgentRuntimeAdapter` 接口与事件流，
 * 不感知后端差异。切换后端 = 换一个 adapter 实现，UI 零改动。
 */

/** 发送消息的入参。 */
export interface SendMessageInput {
  /** 本次用户输入的纯文本。 */
  text: string;
  /** 到目前为止的历史消息（含本条用户消息之前的上下文）。 */
  history: ChatMessage[];
  /** 是否开启模型深度思考。 */
  thinkingEnabled?: boolean;
  /** 是否开启联网检索。 */
  searchEnabled?: boolean;
  /** 回复语气。 */
  replyTone?: 'friendly' | 'professional' | 'concise' | 'humorous';
  /** 系统提示词 / 自定义指令。 */
  systemPrompt?: string;
  /** 注入到本轮请求的记忆条目。 */
  memories?: string[];
  /** 是否允许后端/工具任务沉淀新记忆。 */
  toolMemoryEnabled?: boolean;
  /** 本次发送附带的本地附件。 */
  attachments?: ChatMessage['attachments'];
  /** 本轮对话调用的 Skill。 */
  skillInvocation?: ChatMessage['skillInvocation'];
  /** 中断信号，用于 stop。 */
  signal?: AbortSignal;
}

/** 思考链增量事件。 */
export interface ReasoningDeltaEvent {
  type: 'reasoning-delta';
  delta: string;
}

/** 正文增量事件。 */
export interface ContentDeltaEvent {
  type: 'content-delta';
  delta: string;
}

/** 引用来源事件（一次性给全）。 */
export interface CitationsEvent {
  type: 'citations';
  citations: CitationItem[];
}

/** 产物卡片事件（一次性给全）。 */
export interface ArtifactsEvent {
  type: 'artifacts';
  artifacts: ArtifactItem[];
}

/** 过程步骤事件（可重复发送，同 id 覆盖合并）。 */
export interface ProcessStepEvent {
  type: 'process-step';
  step: ProcessStepItem;
}

/** 过程步骤内容增量事件。 */
export interface ProcessStepDeltaEvent {
  type: 'process-step-delta';
  id: string;
  delta: string;
}

/** 工具调用事件，可挂到指定步骤下。 */
export interface ToolCallEvent {
  type: 'tool-call';
  toolCall: ToolCallItem;
  stepId?: string;
}

/** 完成事件。 */
export interface DoneEvent {
  type: 'done';
}

/** 错误事件。 */
export interface ErrorEvent {
  type: 'error';
  message: string;
}

/** adapter 产出的统一事件。 */
export type AgentRuntimeEvent =
  | ReasoningDeltaEvent
  | ContentDeltaEvent
  | CitationsEvent
  | ArtifactsEvent
  | ProcessStepEvent
  | ProcessStepDeltaEvent
  | ToolCallEvent
  | DoneEvent
  | ErrorEvent;

/* ───────────── 搜索相关 ───────────── */

/** 搜索的入参。 */
export interface SearchInput {
  /** 搜索关键词。 */
  query: string;
  /** 结果类型过滤，不传则搜全部。 */
  types?: SearchResultItem['type'][];
  /** 分页游标，可选。 */
  cursor?: string;
  /** 每页条数，可选。 */
  limit?: number;
  /** 中断信号。 */
  signal?: AbortSignal;
}

/** 搜索结果增量事件（流式逐批返回）。 */
export interface SearchDeltaEvent {
  type: 'search-delta';
  results: SearchResultItem[];
}

/** 搜索完成事件。 */
export interface SearchDoneEvent {
  type: 'search-done';
  total?: number;
  hasMore?: boolean;
  nextCursor?: string;
}

/** 搜索错误事件。 */
export interface SearchErrorEvent {
  type: 'search-error';
  message: string;
}

/** 搜索事件流。 */
export type SearchRuntimeEvent = SearchDeltaEvent | SearchDoneEvent | SearchErrorEvent;

/**
 * Runtime Adapter 接口。
 *
 * `sendMessage` 返回一个异步事件流，UI 侧逐个消费以实现流式渲染。
 * `search` 返回搜索结果事件流，支持流式增量输出。
 */
export interface AgentRuntimeAdapter {
  /** 发送消息并以事件流返回回复。 */
  sendMessage(input: SendMessageInput): AsyncIterable<AgentRuntimeEvent>;
  /** 全局搜索，以事件流返回结果。 */
  search(input: SearchInput): AsyncIterable<SearchRuntimeEvent>;
  /** 重置会话（可选）。 */
  reset?(): void;
}
