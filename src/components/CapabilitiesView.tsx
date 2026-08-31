import { useEffect, useMemo, useState } from 'react';
import { agentSkills, type AgentSkill } from '../runtime/skills';

interface CapabilityItem {
  id: string;
  name: string;
  summary: string;
  logo: string;
  type: 'skill' | 'mcp';
  installed?: boolean;
  skill?: AgentSkill;
}

export interface CapabilitiesViewProps {
  onOpenFiles?: () => void;
  onUseSkill?: (skill: AgentSkill) => void;
}

const STORAGE_KEY = 'agent-template-enabled-capabilities';
const LOGO_BASE_URL = 'https://www.untitledui.com/images/logos/badge/light-logomark';

function getLogoUrl(slug: string) {
  return `${LOGO_BASE_URL}/${slug}.svg`;
}

const capabilityItems: CapabilityItem[] = [
  ...agentSkills.map((skill) => ({
    id: skill.id,
    name: skill.name,
    summary: skill.description,
    logo: skill.logo,
    type: 'skill' as const,
    installed: true,
    skill,
  })),
  {
    id: 'notion-mcp',
    name: 'Notion MCP',
    summary: 'Search, read, and organize workspace pages',
    logo: 'clandestine',
    type: 'mcp',
  },
  {
    id: 'browser-mcp',
    name: 'Browser MCP',
    summary: 'Connect browser context for research and checks',
    logo: 'cloud-watch',
    type: 'mcp',
  },
  {
    id: 'github-mcp',
    name: 'GitHub MCP',
    summary: 'Read repositories, issues, and pull requests',
    logo: 'capsule',
    type: 'mcp',
  },
];

function readEnabledMap() {
  const defaults = Object.fromEntries(capabilityItems.map((item) => [item.id, Boolean(item.installed)]));
  if (typeof window === 'undefined') return defaults as Record<string, boolean>;
  try {
    return { ...defaults, ...JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '{}') };
  } catch {
    return defaults as Record<string, boolean>;
  }
}

export function CapabilitiesView({ onOpenFiles, onUseSkill }: CapabilitiesViewProps) {
  const [query, setQuery] = useState('');
  const [activeType, setActiveType] = useState<'skill' | 'mcp'>('skill');
  const [showInstalledOnly, setShowInstalledOnly] = useState(false);
  const [enabledMap, setEnabledMap] = useState<Record<string, boolean>>(() => readEnabledMap());

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(enabledMap));
  }, [enabledMap]);

  const filteredItems = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    return capabilityItems.filter((item) => {
      const inType = item.type === activeType;
      const inKeyword = !keyword || [item.name, item.summary].join(' ').toLowerCase().includes(keyword);
      const inInstalled = !showInstalledOnly || enabledMap[item.id];
      return inType && inKeyword && inInstalled;
    });
  }, [query, activeType, showInstalledOnly, enabledMap]);

  const mcpCount = capabilityItems.filter((item) => item.type === 'mcp').length;

  const toggleCapability = (id: string) => {
    setEnabledMap((current) => ({ ...current, [id]: !current[id] }));
  };

  const installFirstVisible = () => {
    const target = filteredItems.find((item) => !enabledMap[item.id]);
    if (target) {
      toggleCapability(target.id);
      if (target.id === 'browser-mcp') onOpenFiles?.();
    }
  };

  return (
    <div className="main-panel feature-panel">
      <div className="feature-container discovery-container">
        <div className="page-header discovery-page-header">
          <h2>发现</h2>
          <div className="header-actions">
            <div className="feature-search native-search">
              <ve-icon name="search" size="16" />
              <input
                value={query}
                placeholder="搜索技能"
                onChange={(event) => setQuery(event.target.value)}
              />
            </div>
            <ve-button type="secondary" onClick={() => setShowInstalledOnly((value) => !value)}>
              <ve-icon name="settings" size="16" />
              管理
            </ve-button>
            <ve-button type="primary" onClick={installFirstVisible}>
              <ve-icon name="add" size="16" />
              安装
            </ve-button>
          </div>
        </div>

        <div className="discovery-filter-row">
          <ve-tabs
            className="discovery-tabs"
            value={activeType}
            active-key={activeType}
            aria-label="发现类型"
          >
            <ve-tab
              value="skill"
              selected={activeType === 'skill'}
              data-active={activeType === 'skill' ? 'true' : undefined}
              onClick={() => setActiveType('skill')}
            >
              技能
            </ve-tab>
            <ve-tab
              value="mcp"
              selected={activeType === 'mcp'}
              data-active={activeType === 'mcp' ? 'true' : undefined}
              onClick={() => setActiveType('mcp')}
            >
              MCP {mcpCount}
            </ve-tab>
          </ve-tabs>
          <button
            className={showInstalledOnly ? 'icon-button discovery-filter-button selected' : 'icon-button discovery-filter-button'}
            type="button"
            aria-label="仅看已安装"
            onClick={() => setShowInstalledOnly((value) => !value)}
          >
            <ve-icon name="filter" size="16" />
          </button>
        </div>

        {filteredItems.length > 0 ? (
          <div className="capability-grid">
            {filteredItems.map((item) => (
              <article className={enabledMap[item.id] ? 'capability-item installed' : 'capability-item'} key={item.id}>
                <span className="capability-logo">
                  <img src={getLogoUrl(item.logo)} alt={`${item.name} logo`} loading="lazy" />
                </span>
                <div className="capability-main">
                  <strong>{item.name}</strong>
                  <p>{item.summary}</p>
                </div>
                <button
                  type="button"
                  className="capability-action-button"
                  aria-label={item.skill && enabledMap[item.id] ? `使用 ${item.name}` : `安装 ${item.name}`}
                  onClick={() => {
                    if (item.skill && enabledMap[item.id]) {
                      onUseSkill?.(item.skill);
                      return;
                    }
                    if (item.id === 'browser-mcp' && !enabledMap[item.id]) onOpenFiles?.();
                    toggleCapability(item.id);
                  }}
                >
                  {item.skill && enabledMap[item.id] ? <span>使用</span> : <ve-icon name="add" size="16" />}
                </button>
              </article>
            ))}
          </div>
        ) : (
          <div className="feature-empty">
            <ve-empty description="没有找到匹配的能力" />
          </div>
        )}
      </div>
    </div>
  );
}
