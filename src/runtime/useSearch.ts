import { useCallback, useMemo, useRef, useState } from 'react';
import type { AgentTemplateConfig } from '../config/types';
import type { SearchResultItem } from './types';
import type { ConversationRecord } from './conversationStore';
import { loadLibraryFiles } from './fileLibraryStore';
import { createAdapter } from './createAdapter';

/**
 * 全局搜索 hook。
 *
 * 职责：把 `AgentRuntimeAdapter.search` 的事件流累积成可渲染的结果列表，
 * 对 UI 暴露 `results / loading / search / clear`。UI 组件不接触 adapter 细节。
 */

export interface UseSearchResult {
  /** 当前搜索结果列表（流式增量累积）。 */
  results: SearchResultItem[];
  /** 是否正在搜索中。 */
  loading: boolean;
  /** 总结果数（后端返回时才有）。 */
  total?: number;
  /** 是否还有更多结果（用于分页）。 */
  hasMore: boolean;
  /** 最新的错误信息，无错误时为 null。 */
  error: string | null;
  /** 发起搜索。 */
  search: (query: string, types?: SearchResultItem['type'][]) => void;
  /** 加载更多（如果 hasMore）。 */
  loadMore: () => void;
  /** 中断当前搜索。 */
  stop: () => void;
  /** 清空搜索结果。 */
  clear: () => void;
}

const SNIPPET_RADIUS = 28;

function createSnippet(text: string, query: string): Pick<SearchResultItem, 'snippet' | 'highlights'> {
  const normalizedText = text.toLowerCase();
  const normalizedQuery = query.toLowerCase();
  const rawIndex = normalizedText.indexOf(normalizedQuery);
  const index = rawIndex >= 0 ? rawIndex : 0;
  const start = Math.max(0, index - SNIPPET_RADIUS);
  const end = Math.min(text.length, index + query.length + SNIPPET_RADIUS);
  const prefix = start > 0 ? '...' : '';
  const suffix = end < text.length ? '...' : '';
  const snippet = `${prefix}${text.slice(start, end)}${suffix}`;
  const highlightStart = prefix.length + Math.max(0, index - start);

  return {
    snippet,
    highlights:
      rawIndex >= 0
        ? [{ start: highlightStart, end: highlightStart + query.length }]
        : undefined,
  };
}

function includesQuery(text: string, query: string) {
  const normalizedText = text.toLowerCase();
  const tokens = query
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean);

  return tokens.every((token) => normalizedText.includes(token));
}

function getFileKind(type: string, name: string) {
  if (type.includes('pdf') || name.endsWith('.pdf')) return 'pdf';
  if (type.includes('image')) return 'image';
  if (type.includes('spreadsheet') || name.endsWith('.xlsx') || name.endsWith('.csv')) return 'spreadsheet';
  if (type.includes('zip') || name.endsWith('.zip')) return 'zip';
  if (type.includes('markdown') || name.endsWith('.md')) return 'markdown';
  return 'file';
}

function createLocalSearchResults(
  records: ConversationRecord[],
  query: string,
  types?: SearchResultItem['type'][],
): SearchResultItem[] {
  const enabledTypes = new Set(types ?? ['conversation', 'message', 'file', 'artifact']);
  const results: SearchResultItem[] = [];

  for (const record of records) {
    if (record.archived) continue;

    const conversationText = [
      record.title,
      ...record.messages.map((message) => message.content),
    ].join('\n');

    if (enabledTypes.has('conversation') && includesQuery(conversationText, query)) {
      results.push({
        id: `conversation-${record.id}`,
        type: 'conversation',
        title: record.title,
        conversationId: record.id,
        updatedAt: record.updatedAt,
        ...createSnippet(conversationText, query),
      });
    }

    if (enabledTypes.has('message')) {
      for (const message of record.messages) {
        if (!includesQuery(message.content, query)) continue;
        results.push({
          id: `message-${record.id}-${message.id}`,
          type: 'message',
          title: message.role === 'user' ? '用户消息' : '助手回复',
          conversationId: record.id,
          updatedAt: record.updatedAt,
          ...createSnippet(message.content, query),
        });
      }
    }

    if (enabledTypes.has('artifact')) {
      for (const message of record.messages) {
        const artifacts = new Map(
          [
            ...(message.artifacts ?? []),
            ...(message.processSteps ?? []).flatMap((step) => step.artifacts ?? []),
          ].map((artifact) => [artifact.id, artifact]),
        );

        for (const artifact of artifacts.values()) {
          const artifactText = `${artifact.title} ${artifact.description ?? ''}`;
          if (!includesQuery(artifactText, query)) continue;
          results.push({
            id: `artifact-${record.id}-${artifact.id}`,
            type: 'artifact',
            title: artifact.title,
            conversationId: record.id,
            updatedAt: record.updatedAt,
            fileKind: artifact.kind,
            ...createSnippet(artifactText, query),
          });
        }
      }
    }
  }

  if (enabledTypes.has('file')) {
    for (const file of loadLibraryFiles()) {
      const fileText = `${file.name} ${file.type} ${file.status === 'indexed' ? '已索引' : '待索引'}`;
      if (!includesQuery(fileText, query)) continue;
      results.push({
        id: `file-${file.id}`,
        type: 'file',
        title: file.name,
        updatedAt: file.createdAt,
        fileKind: getFileKind(file.type, file.name),
        ...createSnippet(fileText, query),
      });
    }
  }

  return results.sort((a, b) => Date.parse(b.updatedAt ?? '') - Date.parse(a.updatedAt ?? ''));
}

export function useSearch(
  config: AgentTemplateConfig,
  conversationRecords?: ConversationRecord[],
): UseSearchResult {
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState<number | undefined>(undefined);
  const [hasMore, setHasMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const abortRef = useRef<AbortController | null>(null);
  const queryRef = useRef<string>('');
  const typesRef = useRef<SearchResultItem['type'][] | undefined>(undefined);
  const nextCursorRef = useRef<string | undefined>(undefined);

  const adapter = useMemo(() => createAdapter(config), [config]);

  const doSearch = useCallback(
    (query: string, types?: SearchResultItem['type'][], append = false) => {
      const trimmed = query.trim();
      if (!trimmed) return;

      queryRef.current = trimmed;
      typesRef.current = types;

      if (!append) {
        setResults([]);
        setTotal(undefined);
        setHasMore(false);
        setError(null);
        nextCursorRef.current = undefined;
      }

      if (conversationRecords) {
        const localResults = createLocalSearchResults(conversationRecords, trimmed, types);
        setResults(localResults);
        setTotal(localResults.length);
        setHasMore(false);
        setLoading(false);
        return;
      }

      setLoading(true);

      const controller = new AbortController();
      abortRef.current = controller;

      void (async () => {
        try {
          for await (const event of adapter.search({
            query: trimmed,
            types,
            cursor: append ? nextCursorRef.current : undefined,
            signal: controller.signal,
          })) {
            switch (event.type) {
              case 'search-delta':
                setResults((prev) => [...prev, ...event.results]);
                break;
              case 'search-done':
                setTotal(event.total);
                setHasMore(!!event.hasMore);
                nextCursorRef.current = event.nextCursor;
                break;
              case 'search-error':
                setError(event.message);
                break;
            }
          }
        } finally {
          setLoading(false);
          abortRef.current = null;
        }
      })();
    },
    [adapter, conversationRecords],
  );

  const search = useCallback(
    (query: string, types?: SearchResultItem['type'][]) => {
      doSearch(query, types, false);
    },
    [doSearch],
  );

  const loadMore = useCallback(() => {
    if (!hasMore || loading) return;
    doSearch(queryRef.current, typesRef.current, true);
  }, [doSearch, hasMore, loading]);

  const stop = useCallback(() => {
    abortRef.current?.abort();
  }, []);

  const clear = useCallback(() => {
    abortRef.current?.abort();
    setResults([]);
    setLoading(false);
    setTotal(undefined);
    setHasMore(false);
    setError(null);
    queryRef.current = '';
    nextCursorRef.current = undefined;
  }, []);

  return { results, loading, total, hasMore, error, search, loadMore, stop, clear };
}
