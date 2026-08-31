import { BubbleList } from '@ve-design/react';
import { useEffect, useMemo, useRef, useState, type RefObject } from 'react';
import { MessageBubble } from './MessageBubble';
import { ChatComposer } from './ChatComposer';
import { ChatHeader } from './ChatHeader';
import type { ArtifactItem, ChatMessage, QuotedMessage, SendMessageOptions } from '../runtime/types';
import type { CapabilitiesConfig } from '../config/types';
import type { RuntimeSecuritySettings, SecurityNotice } from '../runtime/security';

/**
 * 对话页。
 *
 * 1:1 复刻旧版 .chat-column / .chat-header / .chat-scroll / .bubble-list / .composer-zone。
 * 视觉全部由 theme/app-layout.css 承载，本组件只组织骨架。
 */
export interface ConversationViewProps {
  messages: ChatMessage[];
  capabilities: CapabilitiesConfig;
  loading: boolean;
  attachments: boolean;
  composerGlowColor: string;
  composerGlowColors: string;
  selectedSkill?: SendMessageOptions['skillInvocation'];
  securitySettings: RuntimeSecuritySettings;
  onSecurityNotice: (notice: SecurityNotice) => void;
  onSelectSkill?: (skill: SendMessageOptions['skillInvocation']) => void;
  onClearSkill?: () => void;
  onSend: (text: string, options?: SendMessageOptions) => void;
  onRegenerate: (assistantMessageId: string) => void;
  onStop: () => void;
  onArtifactOpen?: (artifact: ArtifactItem) => void;
}

const MINI_MAP_VISIBLE_COUNT = 10;

function getMessagePreview(message: ChatMessage) {
  const raw =
    message.content ||
    message.reasoning ||
    message.artifacts?.[0]?.title ||
    (message.streaming ? '正在生成中' : '');
  const compact = raw.replace(/[`*_>#\-[\]()]/g, '').replace(/\s+/g, ' ').trim();
  if (compact) return compact.length > 42 ? `${compact.slice(0, 42)}...` : compact;
  return message.role === 'user' ? '用户消息' : '助手回复';
}

function MessageMiniMap({
  messages,
  scrollContainerRef,
  activeMessageId,
  onActiveChange,
}: {
  messages: ChatMessage[];
  scrollContainerRef: RefObject<HTMLDivElement | null>;
  activeMessageId: string | null;
  onActiveChange: (messageId: string) => void;
}) {
  const items = useMemo(() => messages.slice(-MINI_MAP_VISIBLE_COUNT), [messages]);
  const userItems = useMemo(
    () => messages.filter((message) => message.role === 'user').slice(-MINI_MAP_VISIBLE_COUNT),
    [messages],
  );

  if (messages.length <= 3) return null;

  const handleJump = (messageId: string) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const target = Array.from(container.querySelectorAll<HTMLElement>('.message-scroll-anchor')).find(
      (node) => node.dataset.messageId === messageId,
    );
    if (!target) return;

    const containerRect = container.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();
    const targetTop = targetRect.top - containerRect.top + container.scrollTop;

    onActiveChange(messageId);
    container.scrollTo({
      top: Math.max(0, targetTop - container.clientHeight * 0.18),
      behavior: 'smooth',
    });
  };

  return (
    <aside className="message-mini-map" aria-label="消息导航">
      <div className="message-mini-map-bars" aria-hidden="true">
        {items.map((message) => (
          <span
            key={message.id}
            className={`message-mini-map-bar ${message.role} ${
              message.id === activeMessageId ? 'active' : ''
            }`}
          />
        ))}
      </div>
      <div className="message-mini-map-panel">
        {userItems.map((message) => (
          <button
            key={message.id}
            type="button"
            className={message.id === activeMessageId ? 'active' : ''}
            onClick={() => handleJump(message.id)}
          >
            {getMessagePreview(message)}
          </button>
        ))}
      </div>
    </aside>
  );
}

export function ConversationView({
  messages,
  capabilities,
  loading,
  attachments,
  composerGlowColor,
  composerGlowColors,
  selectedSkill,
  securitySettings,
  onSecurityNotice,
  onSelectSkill,
  onClearSkill,
  onSend,
  onRegenerate,
  onStop,
  onArtifactOpen,
}: ConversationViewProps) {
  const [quotedMessage, setQuotedMessage] = useState<QuotedMessage | null>(null);
  const pendingScrollToLatestRef = useRef(false);
  const pendingScrollTargetIndexRef = useRef<number | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const newConversationAnchorRef = useRef<HTMLDivElement | null>(null);
  const [hasScrollSpacer, setHasScrollSpacer] = useState(false);
  const [activeMessageId, setActiveMessageId] = useState<string | null>(null);

  const handleSend = (text: string, options?: SendMessageOptions) => {
    pendingScrollToLatestRef.current = true;
    pendingScrollTargetIndexRef.current = messages.length;
    setHasScrollSpacer(true);
    onSend(text, { ...options, quotedMessage });
    setQuotedMessage(null);
  };

  useEffect(() => {
    if (messages.length === 0) {
      pendingScrollToLatestRef.current = false;
      pendingScrollTargetIndexRef.current = null;
      setActiveMessageId(null);
      setHasScrollSpacer(false);
      return;
    }

    if (!pendingScrollToLatestRef.current || messages.length === 0) return;

    pendingScrollToLatestRef.current = false;
    window.requestAnimationFrame(() => {
      const container = scrollContainerRef.current;
      const target = newConversationAnchorRef.current;
      if (!container || !target) return;

      const containerRect = container.getBoundingClientRect();
      const targetRect = target.getBoundingClientRect();
      const targetTop = targetRect.top - containerRect.top + container.scrollTop;
      const offset = container.clientHeight / 3;

      setActiveMessageId(target.dataset.messageId ?? null);
      pendingScrollTargetIndexRef.current = null;
      container.scrollTo({
        top: Math.max(0, targetTop - offset),
        behavior: 'smooth',
      });
    });
  }, [messages.length]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || messages.length === 0) return;

    let rafId = 0;

    const updateActiveMessage = () => {
      rafId = 0;
      const anchors = Array.from(
        container.querySelectorAll<HTMLElement>('.message-scroll-anchor'),
      );
      if (!anchors.length) return;

      const containerRect = container.getBoundingClientRect();
      const referenceTop = containerRect.top + container.clientHeight / 3;
      let current = anchors[0];

      for (const anchor of anchors) {
        if (anchor.getBoundingClientRect().top <= referenceTop) {
          current = anchor;
        } else {
          break;
        }
      }

      setActiveMessageId(current.dataset.messageId ?? null);
    };

    const scheduleUpdate = () => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(updateActiveMessage);
    };

    scheduleUpdate();
    container.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate);

    return () => {
      if (rafId) window.cancelAnimationFrame(rafId);
      container.removeEventListener('scroll', scheduleUpdate);
      window.removeEventListener('resize', scheduleUpdate);
    };
  }, [messages.length]);

  return (
    <div className="chat-column">
      <ChatHeader title="新对话" />

      <div className="chat-scroll" ref={scrollContainerRef}>
        <BubbleList>
          {messages.map((m, index) => (
            <div
              key={m.id}
              ref={
                index === pendingScrollTargetIndexRef.current
                  ? newConversationAnchorRef
                  : undefined
              }
              className="message-scroll-anchor"
              data-message-id={m.id}
            >
              <MessageBubble
                message={m}
                capabilities={capabilities}
                onArtifactOpen={onArtifactOpen}
                onRegenerate={onRegenerate}
                onQuote={
                  capabilities.chatQuote
                    ? (message) =>
                        setQuotedMessage({
                          id: message.id,
                          role: message.role,
                          content: message.content,
                        })
                    : undefined
                }
              />
            </div>
          ))}
          {hasScrollSpacer && (
            <div className="conversation-scroll-spacer" aria-hidden="true" />
          )}
        </BubbleList>
      </div>

      <MessageMiniMap
        messages={messages}
        scrollContainerRef={scrollContainerRef}
        activeMessageId={activeMessageId}
        onActiveChange={setActiveMessageId}
      />

      <div className="composer-zone">
        <div className="composer-shell">
          <div className="agent-composer compact">
            <ChatComposer
              loading={loading}
              attachments={attachments}
              motionColor={composerGlowColor}
              motionColors={composerGlowColors}
              selectedSkill={selectedSkill}
              chatUpload={capabilities.chatUpload}
              chatQuote={capabilities.chatQuote}
              chatPrompt={capabilities.chatPrompt}
              chatSearch={capabilities.chatSearch}
              chatCommand={capabilities.chatCommand}
              thinkingToggle={capabilities.thinkingChain}
              quotedMessage={quotedMessage}
              securitySettings={securitySettings}
              onSecurityNotice={onSecurityNotice}
              onSelectSkill={onSelectSkill}
              onClearSkill={onClearSkill}
              onClearQuote={() => setQuotedMessage(null)}
              onSend={handleSend}
              onStop={onStop}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
