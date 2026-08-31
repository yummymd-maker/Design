import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties, type PointerEvent } from 'react';
import { Notification as VeNotification } from '@ve-design/react/notification';
import { WelcomeScreen } from './components/WelcomeScreen';
import { ConversationView } from './components/ConversationView';
import { ArtifactPanel } from './components/ArtifactPanel';
import {
  AgentSidebar,
  type HistoryItem,
} from './components/AgentSidebar';
import { SearchOverlay } from './components/SearchOverlay';
import { FileLibraryView } from './components/FileLibraryView';
import {
  SettingsView,
  type SavedRuntimeSettings,
  type SettingsPreferences,
} from './components/SettingsView';
import { useConversation } from './runtime/useConversation';
import { useStudioConfig } from './runtime/useStudioConfig';
import { useSearch } from './runtime/useSearch';
import type { AgentTemplateConfig } from './config/types';
import type { ArtifactItem, SearchResultItem, SendMessageOptions } from './runtime/types';
import {
  applySecurityToConfig,
  hasExternalLinks,
  normalizeSecuritySettings,
  prepareOutgoingMessage,
  type SecurityNotice,
} from './runtime/security';
import {
  createConversationId,
  createConversationTitle,
  loadConversationRecords,
  saveConversationRecords,
  type ConversationRecord,
} from './runtime/conversationStore';
export interface AppProps {
  config: AgentTemplateConfig;
}

const SETTINGS_STORAGE_KEY = 'agent-template-runtime-settings';

type ActivePage = 'chat' | 'files' | 'settings';

const CHAT_INPUT_GLOW_COLORS =
  'var(--app-chat-input-glow-1),var(--app-chat-input-glow-2),var(--app-chat-input-glow-3)';

const DEFAULT_NOTIFICATION_PREFERENCES = {
  pushNotifications: false,
  taskNotifyBanner: true,
} satisfies Pick<SettingsPreferences, 'pushNotifications' | 'taskNotifyBanner'>;

function getChatInputGlowKey(theme: AgentTemplateConfig['theme']) {
  if (theme.backgroundStyle === 'gradient') return 'gradient';
  if (theme.backgroundStyle === 'image') return theme.imageTone === 'dark' ? 'image-dark' : 'image-light';
  if (theme.bgToken === 'soft') return 'soft';
  if (theme.bgToken === 'neutral') return 'neutral';
  return theme.mode === 'dark' ? 'surface-dark' : 'surface';
}

function getChatInputGlowColor(theme: AgentTemplateConfig['theme']) {
  const key = getChatInputGlowKey(theme);
  if (key === 'gradient') return '265 88 78';
  if (key === 'soft') return '252 90 80';
  if (key === 'neutral') return '220 18 78';
  if (key === 'image-dark') return '218 88 74';
  if (key === 'surface-dark') return '252 78 72';
  return '40 80 80';
}

function getRadiusTokenMap(scale = 1) {
  const base = { xs: 4, sm: 6, md: 8, lg: 12, xl: 16, '2xl': 20, full: 99 };
  return Object.fromEntries(
    Object.entries(base).map(([key, value]) => [
      `--radius-${key}`,
      `${key === 'full' ? value : Math.max(0, Math.round(value * scale))}px`,
    ]),
  );
}

function getSpacingTokenMap(scale = 1) {
  const base = { xxxs: 4, xxs: 8, xs: 12, s: 16, m: 24, l: 32, xl: 48, xxl: 64 };
  return Object.fromEntries(
    Object.entries(base).map(([key, value]) => [`--space-${key}`, `${Math.max(2, Math.round(value * scale))}px`]),
  );
}

function readSavedSettings(): SavedRuntimeSettings | undefined {
  if (typeof window === 'undefined') return undefined;
  try {
    const raw = window.localStorage.getItem(SETTINGS_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as SavedRuntimeSettings) : undefined;
  } catch {
    return undefined;
  }
}

/**
 * 应用外壳（.app-shell）。
 *
 * 1:1 复刻旧版 agent-runtime：grid 双栏（sidebar + main），
 * main 内根据是否有会话切换 welcome-panel / chat-panel。
 * 视觉全部来自 theme/app-layout.css，本组件不承载内联样式。
 */
export function App({ config: initialConfig }: AppProps) {
  const studioConfig = useStudioConfig(initialConfig);
  const [savedSettings, setSavedSettings] = useState<SavedRuntimeSettings | undefined>(() => readSavedSettings());
  const isStudioPreview = typeof window !== 'undefined' && window.parent !== window;
  const baseConfig = useMemo(() => {
    if (!savedSettings?.config) return studioConfig;
    if (isStudioPreview) {
      return {
        ...studioConfig,
        dataMode: savedSettings.config.dataMode,
        personalization: {
          ...studioConfig.personalization,
          ...savedSettings.config.personalization,
        },
        runtime: {
          ...studioConfig.runtime,
          ...savedSettings.config.runtime,
        },
      };
    }
    return {
      ...savedSettings.config,
      settingsSections: studioConfig.settingsSections,
    };
  }, [isStudioPreview, savedSettings?.config, studioConfig]);
  const securitySettings = useMemo(
    () => normalizeSecuritySettings(savedSettings?.preferences),
    [savedSettings?.preferences],
  );
  const config = useMemo(
    () => applySecurityToConfig(baseConfig, securitySettings),
    [baseConfig, securitySettings],
  );
  const { messages, loading, sessions, send, regenerate, stop, reset, loadMessages } = useConversation(config);
  const composerGlow = useMemo(
    () => ({
      color: config.theme.composerGlowColor || getChatInputGlowColor(config.theme),
      colors: config.theme.composerGlowColors || CHAT_INPUT_GLOW_COLORS,
    }),
    [config.theme],
  );
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [artifactPanelClosed, setArtifactPanelClosed] = useState(true);
  const [artifactPanelWidth, setArtifactPanelWidth] = useState(64);
  const [activeArtifact, setActiveArtifact] = useState<ArtifactItem | undefined>(undefined);
  const [searchOpen, setSearchOpen] = useState(false);
  const [activePage, setActivePage] = useState<ActivePage>('chat');
  const [selectedSkill, setSelectedSkill] = useState<SendMessageOptions['skillInvocation']>();
  const [activeHistoryId, setActiveHistoryId] = useState<string | undefined>(undefined);
  const [conversationRecords, setConversationRecords] = useState<ConversationRecord[]>(
    () => loadConversationRecords(),
  );
  const conversationTitleRef = useRef(
    new Map(conversationRecords.map((record) => [record.id, record.title])),
  );
  const notifiedCompletionIdsRef = useRef<Set<string>>(
    new Set(conversationRecords.filter((record) => record.justCompleted).map((record) => record.id)),
  );
  const sessionLoadingStateRef = useRef<Record<string, boolean>>({});
  const searchState = useSearch(config, conversationRecords);
  const notificationPreferences = savedSettings?.preferences ?? DEFAULT_NOTIFICATION_PREFERENCES;

  const hasConversation = activePage === 'chat' && messages.length > 0;
  const showSidebar = config.sidebar.visible && config.capabilities.history;

  const historyItems = useMemo<HistoryItem[]>(
    () =>
      conversationRecords
        .filter((record) => !record.archived)
        .sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt))
        .map((record) => ({ 
          id: record.id, 
          title: record.title,
          generating: record.generating,
          justCompleted: record.justCompleted
        })),
    [conversationRecords],
  );

  const showArtifactPanel =
    hasConversation &&
    !!activeArtifact &&
    config.artifactPanel.enabled &&
    config.capabilities.artifactCard &&
    !artifactPanelClosed;

  useEffect(() => {
    saveConversationRecords(conversationRecords);
    conversationTitleRef.current = new Map(conversationRecords.map((record) => [record.id, record.title]));
  }, [conversationRecords]);

  const notifyConversationComplete = useCallback(
    (conversationId: string, title: string) => {
      const notifiedCompletionIds = notifiedCompletionIdsRef.current;
      if (notifiedCompletionIds.has(conversationId)) return;
      notifiedCompletionIds.add(conversationId);

      const content = `「${title || '新会话'}」已完成回复，点击历史会话可继续查看。`;

      if (notificationPreferences.taskNotifyBanner) {
        VeNotification.success({
          id: `conversation-complete-${conversationId}`,
          title: '消息已完成',
          content,
          position: 'top-right',
          duration: 3000,
          showIcon: true,
          closable: true,
        });
      }

      if (
        notificationPreferences.pushNotifications &&
        typeof window !== 'undefined' &&
        'Notification' in window &&
        window.Notification.permission === 'granted'
      ) {
        const notification = new window.Notification('消息已完成', {
          body: content,
          tag: `conversation-complete-${conversationId}`,
        });
        notification.onclick = () => {
          window.focus();
          notification.close();
        };
      }
    },
    [notificationPreferences.pushNotifications, notificationPreferences.taskNotifyBanner],
  );

  useEffect(() => {
    const previousLoading = sessionLoadingStateRef.current;
    const nextLoading: Record<string, boolean> = {};

    Object.entries(sessions).forEach(([sessionId, session]) => {
      const wasLoading = previousLoading[sessionId] === true;
      nextLoading[sessionId] = session.loading;
      const isCurrentVisibleTask = activePage === 'chat' && activeHistoryId === sessionId;
      if (wasLoading && !session.loading && session.messages.length > 0 && !isCurrentVisibleTask) {
        notifyConversationComplete(sessionId, conversationTitleRef.current.get(sessionId) ?? '新会话');
      }
    });
    sessionLoadingStateRef.current = nextLoading;

    setConversationRecords((records) =>
      records.map((record) => {
        const session = sessions[record.id];
        if (!session || session.messages.length === 0) return record;

        const justCompleted = record.generating === true && !session.loading;
        const isCurrentVisibleTask = activePage === 'chat' && activeHistoryId === record.id;
        return {
          ...record,
          messages: session.messages,
          generating: session.loading,
          justCompleted: isCurrentVisibleTask ? false : justCompleted ? true : record.justCompleted,
          updatedAt: new Date().toISOString(),
          archived: false,
        };
      }),
    );
  }, [activeHistoryId, activePage, notifyConversationComplete, sessions]);

  useEffect(() => {
    const root = document.documentElement;
    if (config.theme.mode === 'dark') {
      root.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
    } else {
      root.classList.remove('dark');
      root.setAttribute('data-theme', 'light');
    }

    root.setAttribute('data-background-style', config.theme.backgroundStyle);

    if (config.theme.bgToken) {
      root.setAttribute('data-bg-token', config.theme.bgToken);
    } else {
      root.removeAttribute('data-bg-token');
    }

    if (config.theme.backgroundImage) {
      root.style.setProperty('--studio-background-image', `url("${config.theme.backgroundImage}")`);
    } else {
      root.style.removeProperty('--studio-background-image');
    }

    if (config.theme.imageTone) {
      root.setAttribute('data-image-tone', config.theme.imageTone);
    } else {
      root.removeAttribute('data-image-tone');
    }

    if (config.theme.backgroundBlur) {
      root.style.setProperty('--studio-background-blur', `${config.theme.backgroundBlur}px`);
    }

    if (config.theme.gradientNoise) {
      root.setAttribute('data-gradient-noise', 'true');
    } else {
      root.removeAttribute('data-gradient-noise');
    }
    if (config.theme.gradientNoiseOpacity) {
      root.style.setProperty('--studio-gradient-noise-opacity', config.theme.gradientNoiseOpacity);
    }

    root.setAttribute('data-chat-input-glow', getChatInputGlowKey(config.theme));
    root.style.setProperty(
      '--app-chat-input-glow-hsl',
      config.theme.composerGlowColor || getChatInputGlowColor(config.theme),
    );
    if (config.theme.fontCn) root.style.setProperty('--font-cn', config.theme.fontCn);
    if (config.theme.fontEn) root.style.setProperty('--font-en', config.theme.fontEn);
    if (config.theme.fontCn || config.theme.fontEn) {
      root.style.setProperty(
        '--font-sans',
        [config.theme.fontEn, config.theme.fontCn].filter(Boolean).join(', '),
      );
    }
    if (typeof config.theme.spacingScale === 'number') {
      root.style.setProperty('--app-density-scale', String(config.theme.spacingScale));
      Object.entries(getSpacingTokenMap(config.theme.spacingScale)).forEach(([name, value]) => {
        root.style.setProperty(name, value);
      });
    }
    if (typeof config.theme.radiusScale === 'number') {
      Object.entries(getRadiusTokenMap(config.theme.radiusScale)).forEach(([name, value]) => {
        root.style.setProperty(name, value);
      });
    }
  }, [config.theme]);

  useEffect(() => {
    const root = document.documentElement;
    const width = `${config.sidebar.width}px`;
    root.style.setProperty('--app-sidebar-width-expanded', width);
    root.style.setProperty('--ve-sidebar-width-expanded', width);
  }, [config.sidebar.width]);

  useEffect(() => {
    if (!config.capabilities.search) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen((v) => !v);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [config.capabilities.search]);

  const handleNewChat = () => {
    setActivePage('chat');
    loadMessages([]);
    setActiveHistoryId(undefined);
    setActiveArtifact(undefined);
    setArtifactPanelClosed(true);
  };

  const handleSearchClick = () => {
    setSearchOpen(true);
  };

  const handleSecurityNotice = useCallback((notice: SecurityNotice) => {
    window.alert(notice.message);
  }, []);

  const ensureActiveConversation = useCallback(
    (text: string) => {
      if (activeHistoryId) {
        notifiedCompletionIdsRef.current.delete(activeHistoryId);
        // Mark conversation as generating
        setConversationRecords((records) =>
          records.map((record) =>
            record.id === activeHistoryId ? { ...record, generating: true, justCompleted: false } : record
          )
        );
        return activeHistoryId;
      }

      const id = createConversationId();
      const nextRecord: ConversationRecord = {
        id,
        title: createConversationTitle(text),
        messages: [],
        updatedAt: new Date().toISOString(),
        generating: true,
        justCompleted: false,
      };

      conversationTitleRef.current.set(id, nextRecord.title);
      setConversationRecords((records) => [nextRecord, ...records]);
      setActiveHistoryId(id);
      return id;
    },
    [activeHistoryId],
  );

  const handleSend = useCallback(
    (text: string, options?: SendMessageOptions) => {
      const optionsWithSkill = selectedSkill && !options?.skillInvocation
        ? { ...options, skillInvocation: selectedSkill }
        : options;
      const externalLinkText = [
        text,
        optionsWithSkill?.quotedMessage?.content,
        ...(optionsWithSkill?.attachments?.map((attachment) => attachment.name) ?? []),
      ]
        .filter(Boolean)
        .join('\n');
      if (
        securitySettings.externalLinkProtection &&
        hasExternalLinks(externalLinkText) &&
        !window.confirm('检测到消息包含外部链接。确认继续发送吗？')
      ) {
        return;
      }
      const prepared = prepareOutgoingMessage(text, optionsWithSkill, securitySettings);
      if (prepared.notice) {
        handleSecurityNotice(prepared.notice);
        return;
      }
      setActivePage('chat');
      setActiveArtifact(undefined);
      setArtifactPanelClosed(true);
      const sessionId = ensureActiveConversation(prepared.text);
      send(prepared.text, prepared.options, sessionId);
      setSelectedSkill(undefined);
    },
    [ensureActiveConversation, handleSecurityNotice, securitySettings, selectedSkill, send],
  );

  const handleSelectSkillInvocation = useCallback((skill: SendMessageOptions['skillInvocation']) => {
    setSelectedSkill(skill);
  }, []);

  const handleHistoryClick = (id: string) => {
    const record = conversationRecords.find((item) => item.id === id);
    if (!record) return;

    if (record.justCompleted) {
      setConversationRecords((records) =>
        records.map((r) => (r.id === id ? { ...r, justCompleted: false } : r))
      );
    }

    setActivePage('chat');
    setActiveHistoryId(id);
    setActiveArtifact(undefined);
    setArtifactPanelClosed(true);
    loadMessages(record.messages, id);
  };

  const handleArtifactOpen = useCallback((artifact: ArtifactItem) => {
    setActiveArtifact(artifact);
    setArtifactPanelClosed(false);
  }, []);

  const handleArtifactResizeStart = useCallback((event: PointerEvent<HTMLButtonElement>) => {
    const panel = event.currentTarget.closest('.main-panel');
    if (!(panel instanceof HTMLElement)) return;

    event.preventDefault();
    const rect = panel.getBoundingClientRect();
    const minChatWidth = 320;
    const minArtifactWidth = 360;
    const maxArtifactWidth = Math.max(minArtifactWidth, rect.width - minChatWidth);

    const updateWidth = (clientX: number) => {
      const artifactWidth = Math.min(
        maxArtifactWidth,
        Math.max(minArtifactWidth, rect.right - clientX),
      );
      setArtifactPanelWidth((artifactWidth / rect.width) * 100);
    };

    const handlePointerMove = (moveEvent: globalThis.PointerEvent) => updateWidth(moveEvent.clientX);
    const handlePointerUp = () => {
      document.body.classList.remove('artifact-resizing');
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);
    };

    document.body.classList.add('artifact-resizing');
    updateWidth(event.clientX);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerUp);
  }, []);

  const handleHistoryArchive = (id: string) => {
    setConversationRecords((records) =>
      records.map((record) => (record.id === id ? { ...record, archived: true } : record)),
    );
    if (activeHistoryId === id) {
      setActiveHistoryId(undefined);
      setActiveArtifact(undefined);
      setArtifactPanelClosed(true);
      reset(id);
      loadMessages([]);
    }
  };

  const handleHistoryDelete = (id: string) => {
    setConversationRecords((records) => records.filter((record) => record.id !== id));
    if (activeHistoryId === id) {
      setActiveHistoryId(undefined);
      setActiveArtifact(undefined);
      setArtifactPanelClosed(true);
      reset(id);
      loadMessages([]);
    }
  };

  const handleSearchResultClick = (item: SearchResultItem) => {
    setSearchOpen(false);
    if (item.type === 'file') {
      setActivePage('files');
      return;
    }

    setActivePage('chat');
    const targetId = item.conversationId ?? (item.type === 'conversation' ? item.id : undefined);
    if (targetId) {
      handleHistoryClick(targetId);
    }
  };

  const handleSettingsSave = useCallback((settings: SavedRuntimeSettings) => {
    window.localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    setSavedSettings(settings);
  }, []);

  const renderMainContent = () => {
    if (activePage === 'files') {
      return (
        <FileLibraryView
          securitySettings={securitySettings}
          onSecurityNotice={handleSecurityNotice}
        />
      );
    }

    if (activePage === 'settings') {
      return (
        <SettingsView
          config={config}
          userName="Jessica"
          onSave={handleSettingsSave}
        />
      );
    }

    return (
      <section className={panelClass}>
        {hasConversation ? (
          <>
            <ConversationView
              messages={messages}
              capabilities={config.capabilities}
              loading={loading}
              attachments={config.capabilities.attachments}
              composerGlowColor={composerGlow.color}
              composerGlowColors={composerGlow.colors}
              selectedSkill={selectedSkill}
              securitySettings={securitySettings}
              onSecurityNotice={handleSecurityNotice}
              onSelectSkill={handleSelectSkillInvocation}
              onClearSkill={() => setSelectedSkill(undefined)}
              onSend={handleSend}
              onRegenerate={regenerate}
              onStop={stop}
              onArtifactOpen={handleArtifactOpen}
            />
            {showArtifactPanel && config.layout.artifactMode === 'split' && (
              <button
                className="artifact-resize-handle"
                type="button"
                aria-label="拖动调整产物面板宽度"
                title="拖动调整产物面板宽度"
                onPointerDown={handleArtifactResizeStart}
              />
            )}
            {showArtifactPanel && activeArtifact && (
              <ArtifactPanel
                artifact={activeArtifact}
                config={config.artifactPanel}
                onClose={() => setArtifactPanelClosed(true)}
              />
            )}
          </>
        ) : (
          <WelcomeScreen
            brand={config.brand}
            welcome={config.welcome}
            capabilities={config.capabilities}
            attachments={config.capabilities.attachments}
            composerGlowColor={composerGlow.color}
            composerGlowColors={composerGlow.colors}
            selectedSkill={selectedSkill}
            securitySettings={securitySettings}
            onSecurityNotice={handleSecurityNotice}
            onSelectSkill={handleSelectSkillInvocation}
            onClearSkill={() => setSelectedSkill(undefined)}
            onStart={handleSend}
          />
        )}
      </section>
    );
  };

  const shellClass = [
    'app-shell',
    `studio-${config.layout.density}`,
    `studio-${config.layout.contentWidth}`,
    `content-${config.layout.contentMode}`,
    showSidebar ? '' : 'sidebar-hidden',
    sidebarCollapsed ? 'sidebar-collapsed' : '',
    `sidebar-${config.sidebar.position}`,
  ]
    .filter(Boolean)
    .join(' ');

  const panelClass = [
    'main-panel',
    hasConversation ? 'chat-panel' : 'welcome-panel',
    showArtifactPanel ? 'with-artifact' : '',
    showArtifactPanel ? `artifact-layout-${config.layout.artifactMode}` : '',
  ]
    .filter(Boolean)
    .join(' ');

  const shellStyle = {
    '--app-sidebar-width-expanded': `${config.sidebar.width}px`,
    '--artifact-panel-width': `${artifactPanelWidth}%`,
  } as CSSProperties;

  return (
    <div className={shellClass} style={shellStyle}>
      {showSidebar && (
        <AgentSidebar
          brand={config.brand}
          historyItems={historyItems}
          capabilities={config.capabilities}
          userName="Jessica"
          activePage={activePage}
          collapsed={sidebarCollapsed}
          activeHistoryId={activeHistoryId}
          onNavigate={setActivePage}
          onToggleCollapsed={(collapsed) => setSidebarCollapsed(collapsed)}
          onNewChat={handleNewChat}
          onSearchClick={handleSearchClick}
          onHistoryClick={handleHistoryClick}
          onHistoryArchive={handleHistoryArchive}
          onHistoryDelete={handleHistoryDelete}
        />
      )}

      <main className="app-main">
        {renderMainContent()}
      </main>

      {config.capabilities.search && (
        <SearchOverlay
          searchState={searchState}
          open={searchOpen}
          onClose={() => setSearchOpen(false)}
          onResultClick={handleSearchResultClick}
          recentConversations={historyItems}
        />
      )}
    </div>
  );
}
