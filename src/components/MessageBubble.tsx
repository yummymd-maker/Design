import {
  Bubble,
  ThoughtChain,
  ThoughtChainItem,
  Markdown,
  Citation,
  ArtifactCard,
  Tag,
  type CitationProps,
  type ArtifactCardProps,
} from '@ve-design/react';
import { useState } from 'react';
import type {
  ArtifactItem,
  ChatAttachment,
  ChatMessage,
  CitationItem,
  ProcessStepItem,
  ToolCallItem,
} from '../runtime/types';
import type { CapabilitiesConfig } from '../config/types';

/**
 * 单条消息气泡。
 *
 * 组合官方组件：`Bubble` 承载布局，assistant 侧按能力开关叠加
 * `ThoughtChain`（思维链/任务过程）/ `Markdown`（正文）/ `Citation`（引用）/ `ArtifactCard`（产物）。
 * 外层 wrapper 附加 .user-bubble / .assistant-bubble class，
 * 与旧版 CSS 中对 ::part(container) / ::part(content) 的约束对齐。
 */
export interface MessageBubbleProps {
  message: ChatMessage;
  capabilities: CapabilitiesConfig;
  onArtifactOpen?: (artifact: ArtifactItem) => void;
  onQuote?: (message: ChatMessage) => void;
  onRegenerate?: (assistantMessageId: string) => void;
}

function stringifyPayload(payload: unknown): string {
  if (payload == null || payload === '') return '';
  if (typeof payload === 'string') return payload;
  try {
    return JSON.stringify(payload, null, 2);
  } catch {
    return String(payload);
  }
}

function isNetworkCitation(citation: CitationItem): boolean {
  if (!citation.url || citation.title.startsWith('示例')) return false;
  try {
    const hostname = new URL(citation.url).hostname;
    return hostname !== 'example.com' && !hostname.endsWith('.example.com');
  } catch {
    return false;
  }
}

function formatAttachmentSize(size: number) {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / 1024 / 1024).toFixed(1)} MB`;
}

function getAttachmentFileIcon(attachment: ChatAttachment) {
  const name = attachment.name.toLowerCase();
  const type = attachment.type.toLowerCase();
  if (type.includes('image') || /\.(png|jpe?g|gif|webp|svg)$/.test(name)) return 'type-image-state-default';
  if (type.includes('pdf') || name.endsWith('.pdf')) return 'type-pdf-state-default';
  if (name.endsWith('.md') || name.endsWith('.markdown')) return 'type-md-state-default';
  if (/\.(csv|xlsx?|numbers)$/.test(name) || type.includes('spreadsheet')) return 'type-chart-state-default';
  if (/\.(js|jsx|ts|tsx|json|css|html|py|go|java|rs)$/.test(name)) return 'type-code-state-default';
  if (/\.(zip|rar|7z|tar|gz)$/.test(name) || type.includes('zip')) return 'type-zip-state-default';
  return 'unknown-file';
}

function MessageAttachments({ attachments }: { attachments?: ChatAttachment[] }) {
  if (!attachments?.length) return null;

  return (
    <div className="bubble-attachment-list">
      {attachments.map((attachment) => (
        <div key={attachment.id} className="bubble-attachment-card">
          <span className="bubble-attachment-preview">
            {attachment.type.startsWith('image/') && attachment.dataUrl ? (
              <img src={attachment.dataUrl} alt={attachment.name} />
            ) : (
              <ve-icon name={getAttachmentFileIcon(attachment)} size="28" />
            )}
          </span>
          <span className="bubble-attachment-meta">
            <span className="bubble-attachment-name">{attachment.name}</span>
            <span className="bubble-attachment-size">{formatAttachmentSize(attachment.size)}</span>
          </span>
        </div>
      ))}
    </div>
  );
}

function getToolStatusText(status: ToolCallItem['status']): string {
  const statusMap: Record<ToolCallItem['status'], string> = {
    default: '待执行',
    loading: '运行中',
    success: '已完成',
    error: '失败',
    abort: '已终止',
  };
  return statusMap[status];
}

async function copyTextToClipboard(text: string): Promise<void> {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.left = '-9999px';
  document.body.appendChild(textarea);
  textarea.select();
  const ok = document.execCommand('copy');
  document.body.removeChild(textarea);
  if (!ok) throw new Error('copy failed');
}

function ToolCallBlock({ toolCall }: { toolCall: ToolCallItem }) {
  const input = stringifyPayload(toolCall.input);
  const output = stringifyPayload(toolCall.output);

  return (
    <div className="tool-call-block">
      <div className="tool-call-header">
        <span className="tool-call-name">
          <ve-icon name="tool" />
          {toolCall.name}
        </span>
        <Tag type={toolCall.status === 'error' ? 'danger' : 'default'} className="tool-call-status-tag">
          {getToolStatusText(toolCall.status)}
        </Tag>
      </div>
      {toolCall.summary && (
        <div className="tool-call-summary">
          {toolCall.summary}
        </div>
      )}
      {input && (
        <details className="tool-call-detail">
          <summary>
            <ve-icon name="chevron-right" />
            输入参数
          </summary>
          <div className="tool-call-detail-body">
            <pre>{input}</pre>
          </div>
        </details>
      )}
      {output && (
        <details className="tool-call-detail">
          <summary>
            <ve-icon name="chevron-right" />
            执行结果
          </summary>
          <div className="tool-call-detail-body">
            <pre>{output}</pre>
          </div>
        </details>
      )}
      {typeof toolCall.durationMs === 'number' && (
        <div className="tool-call-meta">
          {toolCall.durationMs}ms
        </div>
      )}
    </div>
  );
}

function ProcessArtifactCards({
  artifacts,
  onArtifactOpen,
}: {
  artifacts: ProcessStepItem['artifacts'];
  onArtifactOpen?: (artifact: ArtifactItem) => void;
}) {
  if (!artifacts?.length) return null;

  return (
    <div className="process-artifact-grid">
      {artifacts.map((artifact) => (
        <div
          key={artifact.id}
          className="artifact-card-trigger"
          role="button"
          tabIndex={0}
          onClick={() => onArtifactOpen?.(artifact)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              onArtifactOpen?.(artifact);
            }
          }}
        >
          <ArtifactCard
            type={artifact.kind as ArtifactCardProps['type']}
            title={artifact.title}
            description={artifact.description}
          />
        </div>
      ))}
    </div>
  );
}

function AgentReasoning({
  message,
  defaultOpen = true,
}: {
  message: ChatMessage;
  defaultOpen?: boolean;
}) {
  if (!message.reasoning) return null;

  const shouldExpand = message.streaming || defaultOpen;

  return (
    <ve-thinking
      className="agent-thinking"
      title={message.streaming ? '深度思考中' : '深度思考'}
      loading={message.streaming ? true : undefined}
      expanded={shouldExpand}
      max-height="320px"
      auto-scroll="true"
    >
      <div className="agent-thinking-body">
        {message.reasoning}
      </div>
    </ve-thinking>
  );
}

function AgentThinkingLoading() {
  return (
    <ve-thinking
      className="agent-thinking"
      title="深度思考中"
      loading
      expanded={false}
    />
  );
}

function AgentProcess({
  message,
  defaultOpen = true,
}: {
  message: ChatMessage;
  defaultOpen?: boolean;
}) {
  const steps = message.processSteps?.filter(
    (step) => step.content || step.toolCalls?.length || step.artifacts?.length,
  );

  if (steps?.length) {
    const expandedKeys = steps.map((step) => step.id);
    return (
      <ThoughtChain
        className="agent-process-chain"
        title="任务过程"
        loading={message.streaming}
        defaultOpen={defaultOpen}
        defaultExpandedKeys={defaultOpen ? expandedKeys : []}
      >
        {steps.map((step) => (
          <ThoughtChainItem
            key={step.id}
            itemKey={step.id}
            title={
              <span className="process-step-title">
                <span>{step.title}</span>
              </span>
            }
            status={step.status ?? (message.streaming ? 'loading' : 'success')}
          >
            <div className="process-step-body">
              {step.content && <Markdown content={step.content} wrap />}
              {step.toolCalls?.map((toolCall) => (
                <ToolCallBlock key={toolCall.id} toolCall={toolCall} />
              ))}
            </div>
          </ThoughtChainItem>
        ))}
      </ThoughtChain>
    );
  }

  return null;
}

export function MessageBubble({
  message,
  capabilities,
  onArtifactOpen,
  onRegenerate,
}: MessageBubbleProps) {
  const isUser = message.role === 'user';
  const [feedback, setFeedback] = useState<'like' | 'dislike' | null>(null);
  const [copyState, setCopyState] = useState<'idle' | 'success' | 'error'>('idle');

  if (isUser) {
    return (
      <Bubble
        className="user-bubble"
        placement="end"
        variant="text"
        maxHeight="0px"
      >
        <div className="user-bubble-content">
          {message.quotedMessage && (
            <div className="bubble-quote-card">
              <span>
                引用{message.quotedMessage.role === 'user' ? '用户消息' : '助手回复'}
              </span>
              <strong>{message.quotedMessage.content}</strong>
            </div>
          )}
          <MessageAttachments attachments={message.attachments} />
          {message.content && <div className="user-bubble-text">{message.content}</div>}
        </div>
      </Bubble>
    );
  }

  const citationItems: CitationProps['items'] = message.citations?.map((c) => ({
    key: c.index,
    title: c.title,
    url: c.url,
    description: c.snippet,
  }));
  const networkCitations = message.citations?.filter(isNetworkCitation) ?? [];

  const showActions =
    capabilities.messageActions && !message.streaming && !!message.content;
  const hasProcessSteps = message.processSteps?.some(
    (step) => step.content || step.toolCalls?.length || step.artifacts?.length,
  );
  const showThinkingLoading =
    capabilities.thinkingChain &&
    message.streaming &&
    !message.reasoning &&
    !hasProcessSteps &&
    !message.content;

  const handleCopy = () => {
    if (!message.content) return;
    void copyTextToClipboard(message.content)
      .then(() => {
        setCopyState('success');
        window.setTimeout(() => setCopyState('idle'), 1200);
      })
      .catch(() => {
        setCopyState('error');
        window.setTimeout(() => setCopyState('idle'), 1600);
      });
  };
  const handleNetworkSources = () => {
    const firstUrl = networkCitations[0]?.url;
    if (firstUrl) window.open(firstUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <Bubble
      className="assistant-bubble"
      placement="start"
      variant="text"
      maxHeight="0px"
      loading={message.streaming && !message.content && !capabilities.thinkingChain}
    >
      <div className="assistant-stack">
        {showThinkingLoading && <AgentThinkingLoading />}

        {capabilities.thinkingChain && !hasProcessSteps && (
          <AgentReasoning
            message={message}
            defaultOpen={capabilities.thinkingDefaultOpen !== false}
          />
        )}

        {capabilities.thinkingChain && (
          <AgentProcess
            message={message}
            defaultOpen={capabilities.thinkingDefaultOpen !== false}
          />
        )}

        {message.content && <Markdown content={message.content} wrap />}

        {capabilities.citation && citationItems && citationItems.length > 0 && (
          <Citation mode="link" items={citationItems} />
        )}

        {capabilities.artifactCard && message.artifacts && message.artifacts.length > 0 && (
          <div className="process-artifact-grid">
            {message.artifacts.map((a) => (
              <div
                key={a.id}
                className="artifact-card-trigger"
                role="button"
                tabIndex={0}
                onClick={() => onArtifactOpen?.(a)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    onArtifactOpen?.(a);
                  }
                }}
              >
                <ArtifactCard
                  type={a.kind as ArtifactCardProps['type']}
                  title={a.title}
                  description={a.description}
                />
              </div>
            ))}
          </div>
        )}

        {showActions && (
          <div className="message-actions">
            <button
              type="button"
              className={`icon-button${copyState !== 'idle' ? ' active' : ''}`}
              title={copyState === 'success' ? '已复制' : copyState === 'error' ? '复制失败' : '复制'}
              aria-label={copyState === 'success' ? '已复制' : copyState === 'error' ? '复制失败' : '复制'}
              onClick={handleCopy}
            >
              <ve-icon name={copyState === 'success' ? 'check' : 'copy'} />
            </button>
            <button
              type="button"
              className={`icon-button${feedback === 'like' ? ' active' : ''}`}
              title="点赞"
              onClick={() => setFeedback((current) => (current === 'like' ? null : 'like'))}
            >
              <ve-icon name="like" />
            </button>
            <button
              type="button"
              className={`icon-button${feedback === 'dislike' ? ' active' : ''}`}
              title="点踩"
              onClick={() => setFeedback((current) => (current === 'dislike' ? null : 'dislike'))}
            >
              <ve-icon name="like" style={{ transform: 'rotate(180deg)' }} />
            </button>
            <button
              type="button"
              className="icon-button"
              title="重新生成"
              aria-label="重新生成"
              onClick={() => onRegenerate?.(message.id)}
            >
              <ve-icon name="refresh" />
            </button>
            {capabilities.citation && networkCitations.length > 0 && (
              <button
                type="button"
                className="icon-button text-action"
                title="联网资料"
                onClick={handleNetworkSources}
              >
                <ve-icon name="globe" />
                <span>联网资料</span>
              </button>
            )}
          </div>
        )}
      </div>
    </Bubble>
  );
}
