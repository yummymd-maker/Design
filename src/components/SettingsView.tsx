import { useEffect, useMemo, useRef, useState } from 'react';
import { Switch } from '@ve-design/react';
import { Notification as VeNotification } from '@ve-design/react/notification';
import { Select, SelectItem } from '@ve-design/react/select';
import type { AgentTemplateConfig } from '../config/types';
import { DEFAULT_ARK_BASE_URL, normalizeArkBaseURL } from '../runtime/arkBaseURL';
import {
  defaultSecuritySettings,
  normalizeSecuritySettings,
  type RuntimeSecuritySettings,
} from '../runtime/security';

export interface SettingsPreferences {
  language: 'zh-CN' | 'en-US' | 'ja-JP';
  workspaceMemory: boolean;
  autoTitle: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
  weeklyDigest: boolean;
  taskCompleteSoundEnabled: boolean;
  taskCompleteSound: 'default' | 'chime' | 'soft' | 'none';
  taskCompleteSoundVolume: number;
  taskNotifyBanner: boolean;
  taskNotifySound: boolean;
  taskNotifyMenuBar: boolean;
  quietHours: boolean;
  scheduleSummary: boolean;
  spendLimit: number;
  contentSafety: RuntimeSecuritySettings['contentSafety'];
  sensitiveDataProtection: RuntimeSecuritySettings['sensitiveDataProtection'];
  externalLinkProtection: RuntimeSecuritySettings['externalLinkProtection'];
  fileUploadProtection: RuntimeSecuritySettings['fileUploadProtection'];
  networkAccess: RuntimeSecuritySettings['networkAccess'];
  restrictedMode: RuntimeSecuritySettings['restrictedMode'];
  profileTitle: string;
}

export interface SavedRuntimeSettings {
  config: AgentTemplateConfig;
  preferences: SettingsPreferences;
  savedAt: string;
}

type ConfigPatch = Partial<Omit<AgentTemplateConfig, 'brand' | 'welcome' | 'theme' | 'capabilities' | 'sidebar' | 'settingsSections' | 'layout' | 'artifactPanel' | 'personalization' | 'runtime'>> & {
  brand?: Partial<AgentTemplateConfig['brand']>;
  welcome?: Partial<AgentTemplateConfig['welcome']>;
  theme?: Partial<AgentTemplateConfig['theme']>;
  capabilities?: Partial<AgentTemplateConfig['capabilities']>;
  sidebar?: Partial<AgentTemplateConfig['sidebar']>;
  settingsSections?: Partial<AgentTemplateConfig['settingsSections']>;
  layout?: Partial<AgentTemplateConfig['layout']>;
  artifactPanel?: Partial<AgentTemplateConfig['artifactPanel']>;
  personalization?: Partial<AgentTemplateConfig['personalization']>;
  runtime?: Partial<AgentTemplateConfig['runtime']>;
};

export interface SettingsViewProps {
  config: AgentTemplateConfig;
  userName: string;
  onSave: (settings: SavedRuntimeSettings) => void;
}

const STORAGE_KEY = 'agent-template-preferences';

const defaultPreferences: SettingsPreferences = {
  language: 'zh-CN',
  workspaceMemory: true,
  autoTitle: true,
  emailNotifications: true,
  pushNotifications: false,
  weeklyDigest: true,
  taskCompleteSoundEnabled: true,
  taskCompleteSound: 'default',
  taskCompleteSoundVolume: 100,
  taskNotifyBanner: true,
  taskNotifySound: true,
  taskNotifyMenuBar: true,
  quietHours: false,
  scheduleSummary: true,
  spendLimit: 500,
  contentSafety: defaultSecuritySettings.contentSafety,
  sensitiveDataProtection: defaultSecuritySettings.sensitiveDataProtection,
  externalLinkProtection: defaultSecuritySettings.externalLinkProtection,
  fileUploadProtection: defaultSecuritySettings.fileUploadProtection,
  networkAccess: defaultSecuritySettings.networkAccess,
  restrictedMode: defaultSecuritySettings.restrictedMode,
  profileTitle: '个人工作区',
};

const navItems = [
  { id: 'general', label: '常规' },
  { id: 'notifications', label: '通知' },
  { id: 'personalization', label: '个性化' },
  { id: 'models', label: '模型配置' },
  { id: 'schedule', label: '安排' },
  { id: 'billing', label: '账单' },
  { id: 'security', label: '安全' },
  { id: 'account', label: '账户' },
] as const;

export type SettingsSection = (typeof navItems)[number]['id'];

const doubaoModelOptions = [
  'doubao-seed-2-1-pro-260628',
  'doubao-seed-2-0-pro-260215',
  'doubao-seed-1-6-251015',
  'doubao-seed-1-6-flash-250828',
  'doubao-seed-1-8-251228',
  'doubao-1-5-pro-32k-250115',
  'doubao-1-5-lite-32k-250115',
] as const;

const doubaoModelSelectOptions = [
  { value: 'doubao-seed-2-1-pro-260628', label: 'Doubao-Seed-2.1-pro' },
  { value: 'doubao-seed-2-0-pro-260215', label: 'Doubao-Seed-2.0-pro' },
  { value: 'doubao-seed-1-6-251015', label: 'Doubao-Seed-1.6' },
  { value: 'doubao-seed-1-6-flash-250828', label: 'Doubao-Seed-1.6-flash' },
  { value: 'doubao-seed-1-8-251228', label: 'Doubao-Seed-1.8' },
  { value: 'doubao-1-5-pro-32k-250115', label: 'Doubao-1.5-pro-32k' },
  { value: 'doubao-1-5-lite-32k-250115', label: 'Doubao-1.5-lite-32k' },
];

const DEFAULT_DOUBAO_BASE_URL = DEFAULT_ARK_BASE_URL;
const DEFAULT_DOUBAO_MODEL = doubaoModelOptions[0];

function normalizeModelName(model?: string) {
  if (!model) return DEFAULT_DOUBAO_MODEL;
  return model;
}

function cloneConfig(config: AgentTemplateConfig): AgentTemplateConfig {
  return JSON.parse(JSON.stringify(config)) as AgentTemplateConfig;
}

function normalizeAgentSettingsConfig(config: AgentTemplateConfig): AgentTemplateConfig {
  const nextConfig = cloneConfig(config);
  nextConfig.dataMode = 'live';
  nextConfig.personalization = {
    replyTone: 'friendly',
    systemPrompt: '',
    memoryEnabled: false,
    toolMemoryEnabled: true,
    memories: [],
    ...nextConfig.personalization,
  };
  if (nextConfig.runtime.adapter === 'mock') {
    nextConfig.runtime.adapter = 'doubao';
  }
  nextConfig.runtime.model = normalizeModelName(nextConfig.runtime.model);
  return nextConfig;
}

function readPreferences(): SettingsPreferences {
  if (typeof window === 'undefined') return defaultPreferences;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultPreferences;
    const parsed = JSON.parse(raw) as Partial<SettingsPreferences> & { minorMode?: boolean };
    return {
      ...defaultPreferences,
      ...parsed,
      ...normalizeSecuritySettings(parsed),
    };
  } catch {
    return defaultPreferences;
  }
}

export function playTaskCompleteSound(sound: SettingsPreferences['taskCompleteSound'], volume: number) {
  if (sound === 'none' || typeof window === 'undefined') return;
  const AudioContextCtor = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioContextCtor) return;
  const context = new AudioContextCtor();
  const gain = context.createGain();
  const now = context.currentTime;
  const safeVolume = Math.min(Math.max(volume, 0), 100) / 100;
  const notes = sound === 'chime' ? [660, 880] : sound === 'soft' ? [440, 554] : [523, 784];

  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(Math.max(safeVolume * 0.18, 0.0001), now + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);
  gain.connect(context.destination);

  notes.forEach((frequency, index) => {
    const oscillator = context.createOscillator();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(frequency, now + index * 0.12);
    oscillator.connect(gain);
    oscillator.start(now + index * 0.12);
    oscillator.stop(now + 0.5);
  });

  window.setTimeout(() => void context.close(), 650);
}



export function SettingsView({
  config,
  userName,
  onSave,
}: SettingsViewProps) {
  const [activeSection, setActiveSection] = useState<SettingsSection>('general');
  const [draftConfig, setDraftConfig] = useState<AgentTemplateConfig>(() => normalizeAgentSettingsConfig(config));
  const [preferences, setPreferences] = useState<SettingsPreferences>(() => readPreferences());
  const draftConfigRef = useRef(draftConfig);
  const preferencesRef = useRef(preferences);
  const visibleNavItems = useMemo(
    () =>
      navItems.filter((item) => {
        if (item.id === 'billing') return config.settingsSections?.billingVisible !== false;
        if (item.id === 'models') return !preferences.restrictedMode;
        if (item.id === 'security') {
          return config.settingsSections?.securityVisible ?? (config.settingsSections?.parentalVisible !== false);
        }
        return true;
      }),
    [
      config.settingsSections?.billingVisible,
      config.settingsSections?.parentalVisible,
      config.settingsSections?.securityVisible,
      preferences.restrictedMode,
    ],
  );

  useEffect(() => {
    if (!visibleNavItems.some((item) => item.id === activeSection)) {
      setActiveSection(visibleNavItems[0]?.id ?? 'general');
    }
  }, [activeSection, visibleNavItems]);

  useEffect(() => {
    const nextConfig = normalizeAgentSettingsConfig(config);
    draftConfigRef.current = nextConfig;
    setDraftConfig(nextConfig);
    if (
      nextConfig.dataMode !== config.dataMode ||
      nextConfig.runtime.adapter !== config.runtime.adapter ||
      nextConfig.runtime.model !== config.runtime.model
    ) {
      const payload = {
        config: nextConfig,
        preferences: preferencesRef.current,
        savedAt: new Date().toISOString(),
      };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(preferencesRef.current));
      onSave(payload);
    }
  }, [config, onSave]);

  useEffect(() => {
    preferencesRef.current = preferences;
  }, [preferences]);

  const commitSettings = (nextConfig: AgentTemplateConfig, nextPreferences: SettingsPreferences) => {
    const payload = {
      config: nextConfig,
      preferences: nextPreferences,
      savedAt: new Date().toISOString(),
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextPreferences));
    onSave(payload);
  };

  const updateConfig = (patch: ConfigPatch) => {
    const current = draftConfigRef.current;
    const nextConfig = {
      ...current,
      ...patch,
      brand: { ...current.brand, ...patch.brand },
      welcome: { ...current.welcome, ...patch.welcome },
      theme: { ...current.theme, ...patch.theme },
      capabilities: { ...current.capabilities, ...patch.capabilities },
      sidebar: { ...current.sidebar, ...patch.sidebar },
      settingsSections: { ...current.settingsSections, ...patch.settingsSections },
      layout: { ...current.layout, ...patch.layout },
      artifactPanel: { ...current.artifactPanel, ...patch.artifactPanel },
      personalization: { ...current.personalization, ...patch.personalization },
      runtime: { ...current.runtime, ...patch.runtime },
    };
    draftConfigRef.current = nextConfig;
    setDraftConfig(nextConfig);
    commitSettings(nextConfig, preferencesRef.current);
  };

  const updatePreference = <K extends keyof SettingsPreferences>(
    key: K,
    value: SettingsPreferences[K],
  ) => {
    const nextPreferences = { ...preferencesRef.current, [key]: value };
    preferencesRef.current = nextPreferences;
    setPreferences(nextPreferences);
    commitSettings(draftConfigRef.current, nextPreferences);
  };

  const updatePushNotifications = (enabled: boolean) => {
    if (!enabled) {
      updatePreference('pushNotifications', false);
      return;
    }

    if (typeof window === 'undefined' || !('Notification' in window)) {
      updatePreference('pushNotifications', false);
      VeNotification.warning({
        title: '桌面推送不可用',
        content: '当前浏览器不支持系统通知，仍可使用页面内完成横幅。',
        position: 'top-right',
        showIcon: true,
      });
      return;
    }

    void window.Notification.requestPermission().then((permission) => {
      const granted = permission === 'granted';
      updatePreference('pushNotifications', granted);
      VeNotification[granted ? 'success' : 'warning']({
        title: granted ? '桌面推送已开启' : '桌面推送未授权',
        content: granted
          ? '消息完成后会同时发送系统通知。'
          : '未获得浏览器通知权限，后续仅显示页面内完成横幅。',
        position: 'top-right',
        showIcon: true,
      });
    });
  };

  const sendTestNotification = () => {
    const title = '消息完成通知测试';
    const content = '这是一条真实的系统通知测试，消息完成后会使用同一条链路提醒。';
    VeNotification.success({
      title,
      content,
      position: 'top-right',
      showIcon: true,
    });

    if (
      typeof window !== 'undefined' &&
      'Notification' in window &&
      window.Notification.permission === 'granted'
    ) {
      const notification = new window.Notification(title, {
        body: content,
        tag: 'agent-template-notification-test',
      });
      notification.onclick = () => {
        window.focus();
        notification.close();
      };
      return;
    }

    VeNotification.warning({
      title: '系统通知未发送',
      content: '浏览器通知权限未开启，请先打开“桌面推送”。',
      position: 'top-right',
      showIcon: true,
    });
  };

  const renderToggle = (
    checked: boolean,
    onChange: (checked: boolean) => void,
    label: string,
  ) => (
    <Switch
      className="settings-ve-switch"
      aria-label={label}
      checked={checked}
      onChange={(e) => onChange(e.detail.checked)}
    />
  );

  const updateThemeMode = (mode: unknown) => {
    if (mode !== 'light' && mode !== 'dark') return;
    updateConfig({ theme: { mode } });
  };

  const updateReplyTone = (value: unknown) => {
    if (
      value !== 'friendly' &&
      value !== 'professional' &&
      value !== 'concise' &&
      value !== 'humorous'
    ) {
      return;
    }
    updateConfig({ personalization: { replyTone: value } });
  };

  const updateRuntimeAdapter = (value: unknown) => {
    if (
      value !== 'doubao' &&
      value !== 'managedAgent' &&
      value !== 'http' &&
      value !== 'stream'
    ) {
      return;
    }

    const currentRuntime = draftConfigRef.current.runtime;
    if (value === 'doubao') {
      updateConfig({
        runtime: {
          adapter: value,
          baseURL: normalizeArkBaseURL(currentRuntime.baseURL),
          model: normalizeModelName(currentRuntime.model),
          temperature: currentRuntime.temperature ?? 0.7,
          topP: currentRuntime.topP ?? 0.9,
          maxTokens: currentRuntime.maxTokens ?? 4096,
        },
      });
      return;
    }

    if (value === 'managedAgent') {
      updateConfig({
        runtime: {
          adapter: value,
          baseURL: normalizeArkBaseURL(currentRuntime.baseURL),
          sessionMode: currentRuntime.sessionMode || 'new-per-chat',
          stream: currentRuntime.stream !== false,
        },
      });
      return;
    }

    updateConfig({ runtime: { adapter: value } });
  };

  const updateMemories = (value: string) => {
    updateConfig({
      personalization: {
        memories: value
          .split('\n')
          .map((item) => item.trim())
          .filter(Boolean),
      },
    });
  };

  const renderGeneral = () => (
    <>
      <section className="settings-block">
        <h3>基础设置</h3>
        <div className="settings-card">
          <div className="settings-card-row">
            <span>
              <strong>主题</strong>
              <small>选择当前 Agent 工作区的亮暗模式</small>
            </span>
            <div className="segmented settings-theme-segmented" role="group" aria-label="主题">
              <button
                type="button"
                className={draftConfig.theme.mode === 'light' ? 'active' : ''}
                onClick={() => updateThemeMode('light')}
              >
                浅色
              </button>
              <button
                type="button"
                className={draftConfig.theme.mode === 'dark' ? 'active' : ''}
                onClick={() => updateThemeMode('dark')}
              >
                深色
              </button>
            </div>
          </div>
          <div className="settings-card-row">
            <span>
              <strong>语言</strong>
              <small>选择界面按钮、标签和应用内文本本地语言</small>
            </span>
            <select
              className="settings-native-control"
              value={preferences.language}
              onChange={(event) => updatePreference('language', event.target.value as SettingsPreferences['language'])}
            >
              <option value="zh-CN">简体中文</option>
              <option value="en-US">English</option>
              <option value="ja-JP">日本語</option>
            </select>
          </div>
          <div className="settings-card-row">
            <span>
              <strong>工作区记忆</strong>
              <small>在本机保留会话标题、启用状态和设置草稿</small>
            </span>
            {renderToggle(preferences.workspaceMemory, (value) => updatePreference('workspaceMemory', value), '工作区记忆')}
          </div>
          <div className="settings-card-row">
            <span>
              <strong>自动生成会话标题</strong>
              <small>首轮对话后自动归纳历史会话名称</small>
            </span>
            {renderToggle(preferences.autoTitle, (value) => updatePreference('autoTitle', value), '自动生成会话标题')}
          </div>
        </div>
      </section>
      </>
    );

    const renderNotifications = () => (
    <>
      <section className="settings-block">
        <h3>通知偏好</h3>
        <div className="settings-card">
          <div className="settings-card-row">
            <span>
              <strong>邮件通知</strong>
              <small>任务完成、模型异常和账单提醒会发到绑定邮箱</small>
            </span>
            {renderToggle(preferences.emailNotifications, (value) => updatePreference('emailNotifications', value), '邮件通知')}
          </div>
          <div className="settings-card-row">
            <span>
              <strong>桌面推送</strong>
              <small>浏览器授权后在本机显示关键事件提醒</small>
            </span>
            {renderToggle(preferences.pushNotifications, updatePushNotifications, '桌面推送')}
          </div>
          <div className="settings-card-row">
            <span>
              <strong>测试桌面推送</strong>
              <small>立即发送一条真实系统通知，用于验证 macOS 通知权限</small>
            </span>
            <ve-button
              type="secondary"
              disabled={!preferences.pushNotifications}
              onClick={sendTestNotification}
            >
              发送测试
            </ve-button>
          </div>
          <div className="settings-card-row">
            <span>
              <strong>每周摘要</strong>
              <small>每周汇总会话、文件和能力调用情况</small>
            </span>
            {renderToggle(preferences.weeklyDigest, (value) => updatePreference('weeklyDigest', value), '每周摘要')}
          </div>
        </div>
      </section>

      <section className="settings-block">
        <h3>任务状态通知</h3>
        <div className="settings-card">
          <div className="settings-card-row">
            <span>
              <strong>允许在任务完成或失败时接收通知</strong>
              <small>允许在任务完成或失败时接收通知 请在 Mac 的系统设置 &gt; 通知中开启通知，以便及时收到提醒</small>
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'flex-end' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--color-text-secondary)', fontSize: '13px', cursor: 'pointer' }}>
                横幅
                <Switch
                  className="settings-ve-switch"
                  checked={preferences.taskNotifyBanner}
                  onChange={(e) => updatePreference('taskNotifyBanner', e.detail.checked)}
                />
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--color-text-secondary)', fontSize: '13px', cursor: 'pointer' }}>
                声音
                <Switch
                  className="settings-ve-switch"
                  checked={preferences.taskNotifySound}
                  onChange={(e) => updatePreference('taskNotifySound', e.detail.checked)}
                />
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--color-text-secondary)', fontSize: '13px', cursor: 'pointer' }}>
                菜单栏
                <Switch
                  className="settings-ve-switch"
                  checked={preferences.taskNotifyMenuBar}
                  onChange={(e) => updatePreference('taskNotifyMenuBar', e.detail.checked)}
                />
              </label>
            </div>
          </div>
          <div className="settings-card-row">
            <span>
              <strong>任务完成声音</strong>
              <small>任务结束时播放完成提示音</small>
            </span>
            {renderToggle(
              preferences.taskCompleteSoundEnabled,
              (value) => updatePreference('taskCompleteSoundEnabled', value),
              '任务完成声音',
            )}
          </div>
          <div className="settings-card-row">
            <span>
              <strong>完成提示音</strong>
              <small>选择任务完成时使用的声音音效</small>
            </span>
            <select
              className="settings-native-control"
              value={preferences.taskCompleteSound}
              disabled={!preferences.taskCompleteSoundEnabled}
              onChange={(event) => updatePreference('taskCompleteSound', event.target.value as SettingsPreferences['taskCompleteSound'])}
            >
              <option value="default">默认</option>
              <option value="chime">清脆</option>
              <option value="soft">柔和</option>
              <option value="none">无声音</option>
            </select>
          </div>
          <div className="settings-card-row wide-control">
            <span>
              <strong>完成音量</strong>
              <small>{preferences.taskCompleteSoundVolume}%，仅影响任务完成提示音</small>
            </span>
            <input
              className="settings-native-control"
              type="number"
              min="0"
              max="100"
              value={preferences.taskCompleteSoundVolume}
              disabled={!preferences.taskCompleteSoundEnabled}
              onChange={(event) => updatePreference('taskCompleteSoundVolume', Number(event.target.value))}
            />
          </div>
          <div className="settings-card-row">
            <span>
              <strong>试听</strong>
              <small>立即播放一次当前任务完成音效</small>
            </span>
            <ve-button
              type="secondary"
              disabled={!preferences.taskCompleteSoundEnabled || preferences.taskCompleteSound === 'none'}
              onClick={() => playTaskCompleteSound(preferences.taskCompleteSound, preferences.taskCompleteSoundVolume)}
            >
              播放
            </ve-button>
          </div>
        </div>
      </section>
    </>
  );

  const renderPersonalization = () => (
    <>
      <section className="settings-block">
        <h3>回复偏好</h3>
        <div className="settings-card">
          <div className="settings-card-row">
            <span>
              <strong>回复语气</strong>
              <small>控制助手默认回答风格，会同步影响 mock 和真实 API</small>
            </span>
            <Select
              className="settings-ve-select"
              value={draftConfig.personalization.replyTone}
              onChange={(event) => updateReplyTone(event.detail.value)}
            >
              <SelectItem value="friendly">亲和</SelectItem>
              <SelectItem value="professional">专业</SelectItem>
              <SelectItem value="concise">简洁</SelectItem>
              <SelectItem value="humorous">幽默</SelectItem>
            </Select>
          </div>
          <div className="settings-card-row stacked-control">
            <span>
              <strong>系统提示词</strong>
              <small>作为 system message 注入模型，适合固定角色、人设和输出边界</small>
            </span>
            <textarea
              className="settings-native-control settings-textarea"
              value={draftConfig.personalization.systemPrompt ?? ''}
              placeholder="例如：你是一个严谨的产品顾问，回答时先给结论，再给步骤。"
              onChange={(event) => updateConfig({ personalization: { systemPrompt: event.target.value } })}
            />
          </div>
        </div>
      </section>

      <section className="settings-block">
        <h3>记忆</h3>
        <div className="settings-card">
          <div className="settings-card-row">
            <span>
              <strong>启用记忆</strong>
              <small>发送消息时将下方记忆作为上下文注入，不会上传未填写的内容</small>
            </span>
            {renderToggle(
              draftConfig.personalization.memoryEnabled,
              (value) => updateConfig({ personalization: { memoryEnabled: value } }),
              '启用记忆',
            )}
          </div>
          <div className="settings-card-row">
            <span>
              <strong>允许从工具任务生成记忆</strong>
              <small>联网或工具调用时允许沉淀偏好，当前演示会保存在本机配置中</small>
            </span>
            {renderToggle(
              draftConfig.personalization.toolMemoryEnabled,
              (value) => updateConfig({ personalization: { toolMemoryEnabled: value } }),
              '允许从工具任务生成记忆',
            )}
          </div>
          <div className="settings-card-row stacked-control">
            <span>
              <strong>记忆条目</strong>
              <small>每行一条，例如“用户偏好先给结论”或“常用中文回复”</small>
            </span>
            <textarea
              className="settings-native-control settings-textarea settings-memory-textarea"
              value={draftConfig.personalization.memories.join('\n')}
              placeholder="用户偏好先给结论&#10;输出尽量包含可执行步骤"
              disabled={!draftConfig.personalization.memoryEnabled}
              onChange={(event) => updateMemories(event.target.value)}
            />
          </div>
          <div className="settings-card-row">
            <span>
              <strong>重置记忆</strong>
              <small>清空本机保存的记忆条目，不影响历史会话</small>
            </span>
            <ve-button
              type="secondary"
              className="settings-danger-button"
              disabled={draftConfig.personalization.memories.length === 0}
              onClick={() => updateConfig({ personalization: { memories: [] } })}
            >
              重置
            </ve-button>
          </div>
        </div>
      </section>
    </>
  );

  const renderModels = () => (
    <section className="settings-block">
      <h3>模型接入</h3>
      <div className="settings-card">
        <div className="settings-card-row">
          <span>
            <strong>Adapter</strong>
            <small>豆包为默认模型接入，ManagedAgent 用于接入已创建的火山 Agent</small>
          </span>
          <Select
            className="settings-ve-select"
            value={draftConfig.runtime.adapter}
            onChange={(event) => updateRuntimeAdapter(event.detail.value)}
          >
            <SelectItem value="doubao">doubao</SelectItem>
            <SelectItem value="managedAgent">managedAgent</SelectItem>
            <SelectItem value="http">http</SelectItem>
            <SelectItem value="stream">stream</SelectItem>
          </Select>
        </div>
        {draftConfig.runtime.adapter === 'doubao' && (
          <>
            <div className="settings-card-row stacked-control">
              <span>
                <strong>API</strong>
                <small>只需填写 API Key，即可使用下方豆包模型配置</small>
              </span>
              <input
                className="settings-native-control"
                type="password"
                value={draftConfig.runtime.apiKey ?? ''}
                placeholder="请输入豆包 API Key"
                autoComplete="off"
                onChange={(event) => updateConfig({ runtime: { apiKey: event.target.value } })}
              />
            </div>
            <div className="settings-card-row">
              <span>
                <strong>模型名称</strong>
                <small>填写账号有权限的 model 或 endpoint ID</small>
              </span>
              <Select
                className="settings-ve-select"
                value={draftConfig.runtime.model ?? doubaoModelOptions[0].value}
                onChange={(event) => updateConfig({ runtime: { model: String(event.detail.value) } })}
              >
                {doubaoModelSelectOptions.map((model) => (
                  <SelectItem key={model.value} value={model.value}>{model.label}</SelectItem>
                ))}
              </Select>
            </div>
            <div className="settings-card-row stacked-control">
              <span>
                <strong>Base URL</strong>
                <small>默认使用火山方舟北京区域 OpenAI 兼容地址</small>
              </span>
              <input
                className="settings-native-control"
                value={draftConfig.runtime.baseURL ?? DEFAULT_DOUBAO_BASE_URL}
                placeholder={DEFAULT_DOUBAO_BASE_URL}
                onChange={(event) => updateConfig({ runtime: { baseURL: event.target.value || DEFAULT_DOUBAO_BASE_URL } })}
                onBlur={(event) => updateConfig({ runtime: { baseURL: normalizeArkBaseURL(event.target.value) } })}
              />
            </div>
            <div className="settings-card-row wide-control">
              <span>
                <strong>生成参数</strong>
                <small>temperature / top_p / max_tokens</small>
              </span>
              <div className="settings-inline-fields">
                <input
                  className="settings-native-control"
                  type="number"
                  min="0"
                  max="2"
                  step="0.1"
                  value={draftConfig.runtime.temperature ?? 0.7}
                  aria-label="temperature"
                  onChange={(event) => updateConfig({ runtime: { temperature: Number(event.target.value) } })}
                />
                <input
                  className="settings-native-control"
                  type="number"
                  min="0"
                  max="1"
                  step="0.05"
                  value={draftConfig.runtime.topP ?? 0.9}
                  aria-label="top_p"
                  onChange={(event) => updateConfig({ runtime: { topP: Number(event.target.value) } })}
                />
                <input
                  className="settings-native-control"
                  type="number"
                  min="1"
                  step="1"
                  value={draftConfig.runtime.maxTokens ?? 4096}
                  aria-label="max_tokens"
                  onChange={(event) => updateConfig({ runtime: { maxTokens: Number(event.target.value) } })}
                />
              </div>
            </div>
          </>
        )}
        {draftConfig.runtime.adapter === 'managedAgent' && (
          <>
            <div className="settings-card-row stacked-control">
              <span>
                <strong>Agent ID</strong>
                <small>填写火山方舟控制台已创建 ManagedAgent 的 Agent ID</small>
              </span>
              <input
                className="settings-native-control"
                value={draftConfig.runtime.agentId ?? ''}
                placeholder="请输入 Agent ID"
                autoComplete="off"
                onChange={(event) => updateConfig({ runtime: { agentId: event.target.value } })}
              />
            </div>
            <div className="settings-card-row stacked-control">
              <span>
                <strong>Environment ID</strong>
                <small>填写 Environment 详情页复制的 environment_id</small>
              </span>
              <input
                className="settings-native-control"
                value={draftConfig.runtime.environmentId ?? ''}
                placeholder="请输入 Environment ID"
                autoComplete="off"
                onChange={(event) => updateConfig({ runtime: { environmentId: event.target.value } })}
              />
            </div>
            <div className="settings-card-row stacked-control">
              <span>
                <strong>API Key</strong>
                <small>前往 API Key 管理创建访问密钥</small>
              </span>
              <input
                className="settings-native-control"
                type="password"
                value={draftConfig.runtime.apiKey ?? ''}
                placeholder="请输入 ARK API Key"
                autoComplete="off"
                onChange={(event) => updateConfig({ runtime: { apiKey: event.target.value } })}
              />
            </div>
          </>
        )}
        {draftConfig.runtime.adapter !== 'doubao' && draftConfig.runtime.adapter !== 'managedAgent' && (
          <div className="settings-card-row stacked-control">
            <span>
              <strong>自定义后端 API</strong>
              <small>仅 http/stream adapter 使用，填写你的后端接口地址</small>
            </span>
            <input
              className="settings-native-control"
              value={draftConfig.runtime.endpoint ?? ''}
              placeholder="https://api.example.com/agent"
              onChange={(event) => updateConfig({ runtime: { endpoint: event.target.value } })}
            />
          </div>
        )}
      </div>
    </section>
  );

  const renderSchedule = () => (
    <section className="settings-block">
      <h3>安排</h3>
      <div className="settings-card">
        <div className="settings-card-row">
          <span>
            <strong>日程摘要</strong>
            <small>根据会话和文件变更生成每日待办摘要</small>
          </span>
          {renderToggle(preferences.scheduleSummary, (value) => updatePreference('scheduleSummary', value), '日程摘要')}
        </div>
        <div className="settings-card-row">
          <span>
            <strong>免打扰时段</strong>
            <small>开启后仅保留失败、账单和权限类重要提醒</small>
          </span>
          {renderToggle(preferences.quietHours, (value) => updatePreference('quietHours', value), '免打扰时段')}
        </div>
      </div>
    </section>
  );

  const renderBilling = () => (
    <section className="settings-block">
      <h3>账单</h3>
      <div className="settings-card">
        <div className="settings-card-row">
          <span>
            <strong>本月预估</strong>
            <small>基于本地会话次数和能力启用状态的示例预算</small>
          </span>
          <div className="settings-metric">¥128.40</div>
        </div>
        <div className="settings-card-row wide-control">
          <span>
            <strong>消费上限</strong>
            <small>达到上限后提醒切换到 mock 模式</small>
          </span>
          <input
            className="settings-native-control"
            type="number"
            min="0"
            value={preferences.spendLimit}
            onChange={(event) => updatePreference('spendLimit', Number(event.target.value))}
          />
        </div>
      </div>
    </section>
  );

  const renderSecurity = () => (
    <section className="settings-block">
      <h3>安全</h3>
      <div className="settings-card">
        <div className="settings-card-row">
          <span>
            <strong>内容安全</strong>
            <small>发送前检查高风险内容、引用和附件名称，命中策略时阻止发送</small>
          </span>
          {renderToggle(preferences.contentSafety, (value) => updatePreference('contentSafety', value), '内容安全')}
        </div>
        <div className="settings-card-row">
          <span>
            <strong>敏感信息保护</strong>
            <small>发送前自动隐藏邮箱、手机号、身份证号和 API Key 等敏感片段</small>
          </span>
          {renderToggle(
            preferences.sensitiveDataProtection,
            (value) => updatePreference('sensitiveDataProtection', value),
            '敏感信息保护',
          )}
        </div>
        <div className="settings-card-row">
          <span>
            <strong>联网访问</strong>
            <small>关闭后输入框不再显示联网入口，已发请求也无法携带联网选项</small>
          </span>
          {renderToggle(preferences.networkAccess, (value) => updatePreference('networkAccess', value), '联网访问')}
        </div>
        <div className="settings-card-row">
          <span>
            <strong>外链访问确认</strong>
            <small>消息中包含外部链接时，发送前需要二次确认</small>
          </span>
          {renderToggle(
            preferences.externalLinkProtection,
            (value) => updatePreference('externalLinkProtection', value),
            '外链访问确认',
          )}
        </div>
        <div className="settings-card-row">
          <span>
            <strong>文件上传防护</strong>
            <small>拦截可执行文件和超过 20MB 的上传内容，避免误读高风险文件</small>
          </span>
          {renderToggle(
            preferences.fileUploadProtection,
            (value) => updatePreference('fileUploadProtection', value),
            '文件上传防护',
          )}
        </div>
        <div className="settings-card-row">
          <span>
            <strong>高风险能力限制</strong>
            <small>隐藏账单和模型接入，并关闭上传、联网、命令和工具记忆能力</small>
          </span>
          {renderToggle(
            preferences.restrictedMode,
            (value) => updatePreference('restrictedMode', value),
            '高风险能力限制',
          )}
        </div>
      </div>
    </section>
  );

  const renderAccount = () => (
    <section className="settings-block">
      <h3>账户</h3>
      <div className="settings-card">
        <div className="settings-card-row">
          <span>
            <strong>{userName}</strong>
            <small>{preferences.profileTitle}</small>
          </span>
          <ve-tag>当前用户</ve-tag>
        </div>
        <div className="settings-card-row wide-control">
          <span>
            <strong>工作区名称</strong>
            <small>显示在账户弹层底部和导出模板中</small>
          </span>
          <input
            className="settings-native-control"
            value={draftConfig.brand.name}
            onChange={(event) => updateConfig({ brand: { name: event.target.value || 'AI 助手' } })}
          />
        </div>
        <div className="settings-card-row wide-control">
          <span>
            <strong>个人说明</strong>
            <small>保存在本机，用于账户资料展示</small>
          </span>
          <input
            className="settings-native-control"
            value={preferences.profileTitle}
            onChange={(event) => updatePreference('profileTitle', event.target.value)}
          />
        </div>
      </div>
    </section>
  );

  const sections: Record<SettingsSection, JSX.Element> = {
    general: renderGeneral(),
    notifications: renderNotifications(),
    personalization: renderPersonalization(),
    models: renderModels(),
    schedule: renderSchedule(),
    billing: renderBilling(),
    security: renderSecurity(),
    account: renderAccount(),
  };

  return (
    <div className="main-panel feature-panel">
      <div className="settings-layout">
        <div className="settings-topbar">
          <div>
            <h2>设置</h2>
          </div>
        </div>

        <div className="settings-workspace">
          <nav className="settings-nav" aria-label="设置分组">
            {visibleNavItems.map((item) => (
              <button
                key={item.id}
                type="button"
                className={activeSection === item.id ? 'active' : ''}
                onClick={() => setActiveSection(item.id)}
              >
                {item.label}
              </button>
            ))}
          </nav>
          <div className="settings-content">{sections[activeSection]}</div>
        </div>
      </div>
    </div>
  );
}
