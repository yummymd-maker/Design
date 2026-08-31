import { useEffect, useRef, useState } from 'react';
import type { SearchResultItem, SearchResultType } from '../runtime/types';
import type { UseSearchResult } from '../runtime/useSearch';
import { useSearchHistory } from '../runtime/useSearchHistory';

const TYPE_LABEL: Record<SearchResultType, string> = {
  conversation: '会话',
  message: '消息',
  file: '文件',
  artifact: '产物',
};

const TYPE_ICON: Record<SearchResultType, string> = {
  conversation: 'message-circle-text',
  message: 'chat-circle',
  file: 'file',
  artifact: 'bookmark',
};

export interface SearchOverlayProps {
  searchState: UseSearchResult;
  open: boolean;
  onClose: () => void;
  onResultClick?: (item: SearchResultItem) => void;
  recentConversations?: Array<{ id: string; title: string }>;
}

export function SearchOverlay({
  searchState,
  open,
  onClose,
  onResultClick,
  recentConversations = [],
}: SearchOverlayProps) {
  const { results, loading, error, search, clear } = searchState;
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { addHistory } = useSearchHistory();

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      clear();
    }
  }, [open, clear]);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  const handleQueryChange = (value: string) => {
    setQuery(value);
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    const trimmed = value.trim();
    if (!trimmed) {
      clear();
      return;
    }
    searchTimerRef.current = setTimeout(() => {
      search(trimmed);
    }, 150);
  };

  const renderSnippet = (item: SearchResultItem) => {
    const snippet = item.snippet ?? '';
    const highlights = item.highlights ?? [];
    if (highlights.length === 0 || !snippet) return snippet;

    const parts: Array<{ text: string; highlight: boolean }> = [];
    let lastEnd = 0;
    for (const h of highlights) {
      if (h.start > lastEnd) {
        parts.push({ text: snippet.slice(lastEnd, h.start), highlight: false });
      }
      parts.push({ text: snippet.slice(h.start, h.end), highlight: true });
      lastEnd = h.end;
    }
    if (lastEnd < snippet.length) {
      parts.push({ text: snippet.slice(lastEnd), highlight: false });
    }
    return parts.map((p, i) =>
      p.highlight ? (
        <mark key={i} className="search-highlight">
          {p.text}
        </mark>
      ) : (
        <span key={i}>{p.text}</span>
      ),
    );
  };

  const formatMeta = (item: SearchResultItem) => {
    const parts: string[] = [];
    if (item.fileKind) parts.push(item.fileKind);
    if (item.updatedAt) {
      const d = new Date(item.updatedAt);
      const now = new Date();
      const diff = now.getTime() - d.getTime();
      const dayMs = 24 * 60 * 60 * 1000;
      if (diff < dayMs) parts.push('今天');
      else if (diff < 2 * dayMs) parts.push('昨天');
      else if (diff < 7 * dayMs) parts.push(`${Math.floor(diff / dayMs)} 天前`);
      else parts.push(d.toLocaleDateString('zh-CN'));
    }
    return parts.join(' · ');
  };

  const handleResultClick = (item: SearchResultItem) => {
    if (query.trim()) {
      addHistory(query.trim());
    }
    onResultClick?.(item);
    onClose();
  };

  const handleRecentClick = (item: { id: string; title: string }) => {
    onResultClick?.({
      id: `conversation-${item.id}`,
      type: 'conversation',
      title: item.title,
      conversationId: item.id,
    });
    onClose();
  };

  if (!open) return null;

  return (
    <div className="search-overlay" onClick={onClose}>
      <div className="search-overlay-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="search-overlay-header">
          <input
            ref={inputRef}
            type="text"
            className="search-overlay-input"
            placeholder="搜索..."
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
          />
          <button
            className="search-overlay-close"
            onClick={onClose}
            aria-label="关闭"
          >
            <ve-icon name="x" size={18} />
          </button>
        </div>

        <div className="search-overlay-body">
          {error && (
            <div className="search-error">
              <ve-icon name="alert-circle" size={18} />
              <span>搜索出错：{error}</span>
            </div>
          )}

          {!query && !loading && recentConversations.length > 0 && (
            <div className="search-recent">
              <div className="search-section-title">最近聊天</div>
              <ul className="search-chat-list">
                {recentConversations.map((item) => (
                  <li
                    key={item.id}
                    className="search-chat-row"
                    onClick={() => handleRecentClick(item)}
                  >
                    <ve-icon name="chat-circle" size={14} />
                    <span>{item.title}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {!query && !loading && recentConversations.length === 0 && (
            <div className="search-empty compact">
              <p>暂无最近聊天</p>
            </div>
          )}

          {query && !loading && results.length === 0 && !error && (
            <div className="search-empty">
              <ve-icon name="info" size={48} style={{ color: 'var(--color-text-tertiary)' }} />
              <p style={{ color: 'var(--color-text-tertiary)', marginTop: 12 }}>
                未找到相关结果，换个关键词试试
              </p>
            </div>
          )}

          {loading && results.length === 0 && (
            <div className="search-loading">
              <ve-icon name="loading" size={24} className="spin" />
              <span style={{ marginLeft: 8, color: 'var(--color-text-tertiary)' }}>
                正在搜索…
              </span>
            </div>
          )}

          {results.length > 0 && (
            <div className="search-results">
              <div className="search-section-title">搜索结果</div>
              <ul className="search-overlay-group-list">
                {results.map((item) => (
                  <li
                    key={item.id}
                    className="search-overlay-item"
                    onClick={() => handleResultClick(item)}
                  >
                    <div className="search-overlay-item-icon">
                      <ve-icon name={TYPE_ICON[item.type]} size={22} />
                    </div>
                    <div className="search-overlay-item-content">
                      <div className="search-overlay-item-title">{item.title}</div>
                      {item.snippet && (
                        <div className="search-overlay-item-snippet">
                          {renderSnippet(item)}
                        </div>
                      )}
                      <div className="search-overlay-item-meta">
                        {TYPE_LABEL[item.type]}
                        {formatMeta(item) ? ` · ${formatMeta(item)}` : ''}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
