/**
 * Runtime 消息与事件模型。
 *
 * UI 层只认识这里的数据结构，不感知后端协议。M2 会在此基础上补全
 * `AgentRuntimeAdapter` 接口（mock / http / stream 可替换）。
 */

/** 消息角色。 */
export type MessageRole = 'user' | 'assistant';

/** 引用来源条目（对应 ve-design Citation）。 */
export interface CitationItem {
  index: number;
  title: string;
  url?: string;
  snippet?: string;
}

/** 产物卡片（对应 ve-design ArtifactCard）。 */
export interface ArtifactItem {
  id: string;
  title: string;
  /** 文件类型标识，用于选图标，如 'md' | 'code' | 'pdf'。 */
  kind: string;
  description?: string;
  /** 产物正文内容，markdown / code 等文本类产物可直接预览。 */
  content?: string;
}

/** 用户本地选择的附件。 */
export interface ChatAttachment {
  id: string;
  name: string;
  size: number;
  type: string;
  /** 图片等可内联预览的本地 data URL。 */
  dataUrl?: string;
  /** 文本类附件的正文片段，用于模型侧直接分析。 */
  textContent?: string;
  /** 正文是否因长度被截断。 */
  textTruncated?: boolean;
}

/** 本轮对话调用的 Skill。 */
export interface SkillInvocation {
  id: string;
  name: string;
  icon?: string;
  promptTemplate: string;
  requiresUpload?: boolean;
  acceptedFileTypes?: string[];
  maxFiles?: number;
  runtime?: {
    managedAgentToolName?: string;
    httpAction?: string;
  };
}

/** 工具调用状态。 */
export type RuntimeStepStatus = 'default' | 'loading' | 'success' | 'error' | 'abort';

/** 工具调用条目，用于展示 Agent 执行过程中的外部能力调用。 */
export interface ToolCallItem {
  id: string;
  /** 工具名称，如 search_docs / code_runner / browser。 */
  name: string;
  status: RuntimeStepStatus;
  /** 简短说明，优先展示给用户。 */
  summary?: string;
  /** 工具入参，支持对象或字符串。 */
  input?: unknown;
  /** 工具出参，支持对象或字符串。 */
  output?: unknown;
  /** 耗时，单位 ms。 */
  durationMs?: number;
}

/** 复杂任务过程步骤，对应 @ve-design/react 的 ThoughtChain。 */
export interface ProcessStepItem {
  id: string;
  title: string;
  status?: RuntimeStepStatus;
  /** 步骤类型，用于展示标签与兜底图标。 */
  kind?: 'reasoning' | 'tool' | 'artifact' | 'summary' | 'default';
  /** 步骤说明，支持 Markdown 文本。 */
  content?: string;
  /** 当前步骤内发生的工具调用。 */
  toolCalls?: ToolCallItem[];
  /** 当前步骤产出的文件或中间产物。 */
  artifacts?: ArtifactItem[];
}

/** 一条对话消息。 */
export interface ChatMessage {
  id: string;
  role: MessageRole;
  /** 正文（assistant 为 markdown 文本）。 */
  content: string;
  /** 思考链内容（可选）。 */
  reasoning?: string;
  /** 引用来源（可选）。 */
  citations?: CitationItem[];
  /** 产物卡片（可选）。 */
  artifacts?: ArtifactItem[];
  /** 复杂任务过程步骤（思维链摘要、工具调用、中间产物）。 */
  processSteps?: ProcessStepItem[];
  /** 是否仍在生成中（流式）。 */
  streaming?: boolean;
  /** 用户发送消息时附带的对话引用。 */
  quotedMessage?: QuotedMessage;
  /** 用户发送消息时附带的本地附件。 */
  attachments?: ChatAttachment[];
  /** 用户发送消息时调用的 Skill。 */
  skillInvocation?: SkillInvocation;
}

/** 对话输入框中的消息引用。 */
export interface QuotedMessage {
  id: string;
  role: MessageRole;
  content: string;
}

/** 发送消息时的附加选项。 */
export interface SendMessageOptions {
  quotedMessage?: QuotedMessage | null;
  /** 本次发送附带的本地附件。 */
  attachments?: ChatAttachment[];
  /** 是否开启模型深度思考。 */
  thinkingEnabled?: boolean;
  /** 是否开启联网检索。 */
  searchEnabled?: boolean;
  /** 本轮对话调用的 Skill。 */
  skillInvocation?: SkillInvocation;
}

/** 搜索结果类型。 */
export type SearchResultType = 'conversation' | 'message' | 'file' | 'artifact';

/** 单条搜索结果。 */
export interface SearchResultItem {
  id: string;
  type: SearchResultType;
  /** 结果标题（会话标题 / 文件名 / 消息摘要开头等）。 */
  title: string;
  /** 结果摘要，命中关键词的上下文片段。 */
  snippet?: string;
  /** 命中关键词在 snippet 中的偏移区间，用于高亮。 */
  highlights?: Array<{ start: number; end: number }>;
  /** 关联的会话 ID（消息 / 产物类型时填充）。 */
  conversationId?: string;
  /** 最后更新时间（ISO 字符串）。 */
  updatedAt?: string;
  /** 文件类型（file / artifact 类型时填充）。 */
  fileKind?: string;
}
