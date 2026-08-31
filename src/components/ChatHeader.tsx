export interface ChatHeaderProps {
  title: string;
  onShare?: () => void;
  onMore?: () => void;
}

/**
 * 对话头部。
 *
 * 1:1 复刻旧版 .chat-header：左侧标题、右侧 share / more 图标按钮。
 * 样式来自 theme/app-layout.css。
 */
export function ChatHeader({ title, onShare, onMore }: ChatHeaderProps) {
  return (
    <header className="chat-header">
      <strong>{title}</strong>
      <div>
        <ve-button
          className="icon-button"
          type="text"
          size="sm"
          onClick={() => onShare?.()}
          aria-label="分享"
        >
          <ve-icon slot="icon" name="share" />
        </ve-button>
        <ve-button
          className="icon-button"
          type="text"
          size="sm"
          onClick={() => onMore?.()}
          aria-label="更多"
        >
          <ve-icon slot="icon" name="more-vertical" />
        </ve-button>
      </div>
    </header>
  );
}
