import { useEffect, useMemo, useRef, useState, type ChangeEvent, type CSSProperties } from 'react';
import { ChatInput, ChatInputAction, Icon, type ChatInputSubmitDetail } from '@ve-design/react';
import { IconAtom, IconGlobe } from '@ve-design/react/icons';
import {
  initShimmerBorder,
  parseShimmerGradient,
  type ShimmerBorderController,
} from '../motion/shimmerBorder';
import type { ChatAttachment, QuotedMessage, SendMessageOptions } from '../runtime/types';
import {
  defaultSecuritySettings,
  validateUploadFiles,
  type RuntimeSecuritySettings,
  type SecurityNotice,
} from '../runtime/security';
import { agentSkills, toSkillInvocation } from '../runtime/skills';

const commandItems = [
  { id: 'summary', icon: 'file', name: '总结文档', description: '提炼文档、网页或对话要点', value: '/总结文档 ' },
  { id: 'translate', icon: 'translate', name: '翻译', description: '中英文互译并保留原格式', value: '/翻译 ' },
  { id: 'code', icon: 'code', name: '代码解释', description: '解释代码逻辑、风险和优化点', value: '/代码解释 ' },
];

function createAttachmentId(file: File) {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `${file.name}-${file.lastModified}-${Math.random().toString(36).slice(2)}`;
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ''));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

const readableTextFilePattern =
  /\.(csv|css|html?|json|log|md|mdx|txt|ts|tsx|js|jsx|yaml|yml)$/i;
const maxAttachmentTextLength = 20_000;

function isReadableTextFile(file: File) {
  return file.type.startsWith('text/') || readableTextFilePattern.test(file.name);
}

function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ''));
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
}

async function readTextAttachment(file: File) {
  if (!isReadableTextFile(file)) return {};
  const text = await readFileAsText(file);
  return {
    textContent: text.slice(0, maxAttachmentTextLength),
    textTruncated: text.length > maxAttachmentTextLength,
  };
}

function formatFileSize(size: number) {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / 1024 / 1024).toFixed(1)} MB`;
}

function buildTriadicShimmerColors(motionColor: string) {
  const [rawHue, rawSaturation, rawLightness] = motionColor
    .trim()
    .split(/\s+/)
    .map(Number);
  if (![rawHue, rawSaturation, rawLightness].every(Number.isFinite)) return undefined;

  const hue = ((rawHue % 360) + 360) % 360;
  const saturation = Math.min(Math.max(rawSaturation, 0), 100);
  const lightness = Math.min(Math.max(rawLightness, 0), 100);

  return [
    `hsl(${hue.toFixed(1)}deg ${saturation}% ${lightness}%)`,
    `hsl(${((hue + 120) % 360).toFixed(1)}deg ${Math.max(64, saturation - 4)}% ${Math.min(82, lightness + 3)}%)`,
    `hsl(${((hue + 240) % 360).toFixed(1)}deg ${Math.max(60, saturation - 8)}% ${Math.min(84, lightness + 5)}%)`,
  ].join(',');
}

/**
 * 对话输入框。
 *
 * 直接使用官方 `ChatInput`（见 PRD 4.2：组件层只用官方 Agent 组件），
 * 仅在其上封装受控状态与提交回调，不重写任何输入交互语义。
 */
export interface ChatComposerProps {
  /** 占位提示。 */
  placeholder?: string;
  /** 是否正在生成（切换发送/停止按钮）。 */
  loading?: boolean;
  /** 是否展示附件能力（由 capabilities.attachments 驱动）。 */
  attachments?: boolean;
  /** 是否启用 ve-motion Shimmer Border。 */
  motion?: boolean;
  /** ve-motion 主 HSL 色值，例如 `265 88 78`，同步写入 CSS 变量。 */
  motionColor?: string;
  /** ve-motion 渐变色，逗号分隔 CSS color。 */
  motionColors?: string;
  /** 定时播放 ve-motion Shimmer Border 的间隔，单位 ms。 */
  shimmerIntervalMs?: number;
  /** 单次 ve-motion Shimmer Border 播放时长，单位 s。 */
  shimmerDurationSec?: number;
  /** 是否开启上传附件。 */
  chatUpload?: boolean;
  /** 是否开启引用块。 */
  chatQuote?: boolean;
  /** 是否开启变量槽 / 模板。 */
  chatPrompt?: boolean;
  /** 是否开启联网。 */
  chatSearch?: boolean;
  /** 是否开启 / 命令。 */
  chatCommand?: boolean;
  /** 是否展示深度思考开关。 */
  thinkingToggle?: boolean;
  /** 当前已引用的对话消息；为空时不展示引用块。 */
  quotedMessage?: QuotedMessage | null;
  /** 当前选中的 Skill。 */
  selectedSkill?: SendMessageOptions['skillInvocation'];
  /** 运行时安全设置，用于上传前校验。 */
  securitySettings?: RuntimeSecuritySettings;
  /** 安全策略提示。 */
  onSecurityNotice?: (notice: SecurityNotice) => void;
  /** 移除当前引用。 */
  onClearQuote?: () => void;
  /** 清除当前 Skill。 */
  onClearSkill?: () => void;
  /** 从 / 命令面板选择 Skill。 */
  onSelectSkill?: (skill: SendMessageOptions['skillInvocation']) => void;
  /** 提交回调，传出纯文本和模型开关。 */
  onSend: (text: string, options?: SendMessageOptions) => void;
  /** 停止生成回调。 */
  onStop?: () => void;
}

export function ChatComposer({
  placeholder = '输入你的问题…',
  loading = false,
  motion = true,
  motionColor = '265 88 78',
  motionColors = 'var(--app-chat-input-glow-1),var(--app-chat-input-glow-2),var(--app-chat-input-glow-3)',
  shimmerIntervalMs,
  shimmerDurationSec,
  chatUpload = false,
  chatQuote = false,
  chatSearch = false,
  chatCommand = false,
  thinkingToggle = true,
  quotedMessage = null,
  selectedSkill,
  securitySettings = defaultSecuritySettings,
  onSecurityNotice,
  onClearQuote,
  onClearSkill,
  onSelectSkill,
  onSend,
  onStop,
}: ChatComposerProps) {
  const [value, setValue] = useState('');
  const [pendingAttachments, setPendingAttachments] = useState<ChatAttachment[]>([]);
  const [thinkingEnabled, setThinkingEnabled] = useState(false);
  const [searchEnabled, setSearchEnabled] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const hostRef = useRef<HTMLDivElement | null>(null);
  const shimmerRef = useRef<ShimmerBorderController | null>(null);
  const resolvedMotionColors = useMemo(
    () => buildTriadicShimmerColors(motionColor) ?? motionColors,
    [motionColor, motionColors],
  );
  const motionGradient = useMemo(() => parseShimmerGradient(resolvedMotionColors), [resolvedMotionColors]);
  const motionStyle = useMemo(
    () =>
      ({
        '--app-chat-input-glow-hsl': motionColor,
      }) as CSSProperties,
    [motionColor],
  );
  const uploadAccept = selectedSkill?.acceptedFileTypes?.join(',');

  useEffect(() => {
    if (!motion || !hostRef.current) return undefined;
    shimmerRef.current?.destroy();
    const duration = shimmerDurationSec ?? 2.7;
    const hasScheduledShimmer = Boolean(shimmerIntervalMs && shimmerIntervalMs > 0 && !loading);
    const controller = initShimmerBorder(hostRef.current, {
      radius: 20,
      strokeWidth: 1.2,
      colorRatio: 0.68,
      duration,
      loops: loading ? Infinity : 1,
      gradient: motionGradient,
      trigger: hasScheduledShimmer ? 'manual' : 'mount',
    });
    shimmerRef.current = controller;
    let shimmerTimer: number | undefined;
    if (hasScheduledShimmer && shimmerIntervalMs) {
      const scheduleNext = () => {
        shimmerTimer = window.setTimeout(() => {
          controller.play();
          shimmerTimer = window.setTimeout(scheduleNext, duration * 1000);
        }, shimmerIntervalMs);
      };
      scheduleNext();
    }

    return () => {
      if (shimmerTimer) window.clearTimeout(shimmerTimer);
      shimmerRef.current?.destroy();
      shimmerRef.current = null;
    };
  }, [loading, motion, shimmerIntervalMs, shimmerDurationSec]);

  useEffect(() => {
    shimmerRef.current?.setGradient(motionGradient);
    if (motion && !loading) shimmerRef.current?.play();
  }, [loading, motion, motionGradient]);

  const handleSubmit = (event: CustomEvent<ChatInputSubmitDetail>) => {
    const text = event.detail.value.trim();
    if (!text && pendingAttachments.length === 0) return;
    onSend(text, { thinkingEnabled, searchEnabled, attachments: pendingAttachments, skillInvocation: selectedSkill });
    setValue('');
    setPendingAttachments([]);
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    event.target.value = '';
    if (!files.length) return;

    if (selectedSkill?.maxFiles && pendingAttachments.length + files.length > selectedSkill.maxFiles) {
      onSecurityNotice?.({
        level: 'blocked',
        message: `已拦截：${selectedSkill.name} 最多支持上传 ${selectedSkill.maxFiles} 个文件。`,
      });
      return;
    }

    const notice = validateUploadFiles(files, securitySettings);
    if (notice) {
      onSecurityNotice?.(notice);
      return;
    }

    const nextAttachments = await Promise.all(
      files.map(async (file) => ({
        id: createAttachmentId(file),
        name: file.name,
        size: file.size,
        type: file.type || 'application/octet-stream',
        dataUrl: file.type.startsWith('image/') ? await readFileAsDataUrl(file) : undefined,
        ...(await readTextAttachment(file)),
      })),
    );
    setPendingAttachments((current) => [...current, ...nextAttachments]);
  };

  const headerContent =
    (chatQuote && quotedMessage) || selectedSkill || pendingAttachments.length > 0 ? (
      <div className="composer-header-stack">
        {selectedSkill && (
          <div className="composer-skill-chip">
            <span className="composer-skill-icon">
              <Icon name={selectedSkill.icon ?? 'file'} size="14" />
            </span>
            <span className="composer-skill-body">
              <span className="composer-skill-label">已选择 Skill</span>
              <span className="composer-skill-name">{selectedSkill.name}</span>
            </span>
            <button
              type="button"
              className="composer-skill-close"
              aria-label="移除 Skill"
              onClick={onClearSkill}
            >
              <ve-icon name="close" />
            </button>
          </div>
        )}
        {chatQuote && quotedMessage && (
          <div className="composer-quote-shell">
            <div className="composer-quote-card">
              <span className="composer-quote-icon">
                <Icon name="file" />
              </span>
              <span className="composer-quote-body">
                <span className="composer-quote-label">
                  引用{quotedMessage.role === 'user' ? '用户消息' : '助手回复'}
                </span>
                <span className="composer-quote-content">{quotedMessage.content}</span>
              </span>
              <button
                type="button"
                className="composer-quote-close"
                aria-label="移除引用"
                onClick={onClearQuote}
              >
                <ve-icon name="close" />
              </button>
            </div>
          </div>
        )}
        {pendingAttachments.length > 0 && (
          <div className="composer-attachment-list" aria-label="已选择附件">
            {pendingAttachments.map((attachment) => (
              <div className="composer-attachment-card" key={attachment.id}>
                <span className="composer-attachment-preview">
                  {attachment.type.startsWith('image/') && attachment.dataUrl ? (
                    <img src={attachment.dataUrl} alt={attachment.name} />
                  ) : (
                    <Icon name="file" size="16" />
                  )}
                </span>
                <span className="composer-attachment-meta">
                  <span className="composer-attachment-name">{attachment.name}</span>
                  <span className="composer-attachment-size">{formatFileSize(attachment.size)}</span>
                </span>
                <button
                  type="button"
                  className="composer-attachment-remove"
                  aria-label={`移除附件 ${attachment.name}`}
                  onClick={() =>
                    setPendingAttachments((current) =>
                      current.filter((item) => item.id !== attachment.id),
                    )
                  }
                >
                  <ve-icon name="close" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    ) : undefined;

  return (
    <div
      ref={hostRef}
      className="ve-motion-composer ved-shimmer-host"
      data-shimmer
      data-shimmer-radius="20"
      data-shimmer-stroke="1.2"
      data-shimmer-duration="2.7"
      data-shimmer-loops={loading ? 'Infinity' : '1'}
      style={motionStyle}
    >
      <ChatInput
        value={value}
        placeholder={placeholder}
        loading={loading}
        onChange={(e) => setValue(e.detail.value)}
        onSubmit={handleSubmit}
        onCancel={() => onStop?.()}
        header={headerContent}
        leftAction={
          (chatUpload || thinkingToggle || chatSearch || chatCommand) ? (
            <>
              {chatUpload && (
                <ChatInputAction
                  iconOnly
                  icon={<Icon name="add" size="18" />}
                  title="上传附件"
                  onActionClick={() => fileInputRef.current?.click()}
                />
              )}
              {thinkingToggle && (
                <ChatInputAction
                  className="composer-thinking-action"
                  status={thinkingEnabled ? 'active' : 'default'}
                  icon={<IconAtom size="18" />}
                  title={thinkingEnabled ? '关闭深度思考' : '开启深度思考'}
                  onActionClick={() => setThinkingEnabled((current) => !current)}
                >
                  深度思考
                </ChatInputAction>
              )}
              {chatSearch && (
                <ChatInputAction
                  className="composer-search-action"
                  status={searchEnabled ? 'active' : 'default'}
                  icon={<IconGlobe size="18" />}
                  title={searchEnabled ? '关闭联网' : '开启联网'}
                  onActionClick={() => setSearchEnabled((current) => !current)}
                >
                  联网
                </ChatInputAction>
              )}
              {chatCommand && (
                <ChatInputAction
                  className="composer-command-action"
                  title="/ 命令"
                  onActionClick={() => setValue((current) => current || '/')}
                >
                  /
                </ChatInputAction>
              )}
            </>
          ) : undefined
        }
      >
        {chatCommand && (
          <ChatInput.Panel trigger="/" placement="top">
            <div className="composer-command-panel" aria-label="常用指令">
              <div className="composer-command-panel-title">常用指令</div>
              {commandItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className="composer-command-panel-item"
                  onClick={() => setValue(item.value)}
                >
                  <span className="composer-command-panel-icon">
                    <Icon name={item.icon} />
                  </span>
                  <span className="composer-command-panel-body">
                    <span className="composer-command-panel-name">{item.name}</span>
                    <span className="composer-command-panel-desc">{item.description}</span>
                  </span>
                </button>
              ))}
              {agentSkills.map((skill) => (
                <button
                  key={skill.id}
                  type="button"
                  className="composer-command-panel-item"
                  onClick={() => {
                    const invocation = toSkillInvocation(skill);
                    setValue((current) => current || skill.triggerText);
                    onSelectSkill?.(invocation);
                  }}
                >
                  <span className="composer-command-panel-icon">
                    <Icon name={skill.icon} />
                  </span>
                  <span className="composer-command-panel-body">
                    <span className="composer-command-panel-name">{skill.name}</span>
                    <span className="composer-command-panel-desc">{skill.description}</span>
                  </span>
                </button>
              ))}
            </div>
          </ChatInput.Panel>
        )}
      </ChatInput>
      {chatUpload && (
        <input
          ref={fileInputRef}
          type="file"
          className="composer-file-input"
          multiple
          accept={uploadAccept}
          onChange={handleFileChange}
        />
      )}
    </div>
  );
}
