import { useEffect, useRef, useState } from 'react';
import type { AgentTemplateConfig } from '../config/types';

/**
 * 外部配置注入桥。
 *
 * 单一源码同时驱动「工具内预览」与「导出工程」：
 * - 导出工程独立运行时，直接使用 `agent.config.ts` 的默认配置，无外部注入。
 * - 工具内预览时，宿主 Studio 通过 `postMessage` 下发实时配置，本 hook 负责
 *   合并进当前 config，使左侧配置变更后右侧源码模板实时响应
 *   （替代旧方案的 DOM 注入补丁）。
 *
 * 约定协议（与宿主一致）：
 * - 挂载后子页面向 parent 发送 `{ type: 'agent-template-ready' }`。
 * - 宿主下发 `{ type: 'agent-template-config', config: Partial<AgentTemplateConfig> }`。
 */

export const AGENT_TEMPLATE_READY = 'agent-template-ready';
export const AGENT_TEMPLATE_CONFIG = 'agent-template-config';
export const AGENT_TEMPLATE_STYLES = 'agent-template-styles';

function mergeConfig(
  base: AgentTemplateConfig,
  patch: Partial<AgentTemplateConfig>,
): AgentTemplateConfig {
  return {
    ...base,
    ...patch,
    brand: { ...base.brand, ...patch.brand },
    welcome: { ...base.welcome, ...patch.welcome },
    theme: { ...base.theme, ...patch.theme },
    capabilities: { ...base.capabilities, ...patch.capabilities },
    sidebar: { ...base.sidebar, ...patch.sidebar },
    settingsSections: { ...base.settingsSections, ...patch.settingsSections },
    layout: { ...base.layout, ...patch.layout },
    artifactPanel: { ...base.artifactPanel, ...patch.artifactPanel },
    runtime: { ...base.runtime, ...patch.runtime },
  };
}

export function useStudioConfig(defaultConfig: AgentTemplateConfig): AgentTemplateConfig {
  const [config, setConfig] = useState<AgentTemplateConfig>(defaultConfig);
  const defaultConfigRef = useRef(defaultConfig);

  useEffect(() => {
    defaultConfigRef.current = defaultConfig;
  }, [defaultConfig]);

  useEffect(() => {
    if (typeof window === 'undefined' || window.parent === window) return;

    const applyStyles = (styles: {
      cssVars?: Record<string, string>;
      dataAttrs?: Record<string, string | undefined>;
    }) => {
      const root = document.documentElement;
      if (styles.cssVars) {
        Object.entries(styles.cssVars).forEach(([name, value]) => {
          if (value !== undefined) {
            root.style.setProperty(name, value);
          } else {
            root.style.removeProperty(name);
          }
        });
      }
      if (styles.dataAttrs) {
        Object.entries(styles.dataAttrs).forEach(([name, value]) => {
          if (value !== undefined) {
            root.setAttribute(name, value);
          } else {
            root.removeAttribute(name);
          }
        });
      }
    };

    const onMessage = (event: MessageEvent) => {
      const data = event.data;
      if (!data) return;
      if (data.type === AGENT_TEMPLATE_CONFIG) {
        const patch = data.config as Partial<AgentTemplateConfig> | undefined;
        if (!patch) return;
        setConfig(mergeConfig(defaultConfigRef.current, patch));
      } else if (data.type === AGENT_TEMPLATE_STYLES) {
        applyStyles(data.styles || {});
      }
    };

    window.addEventListener('message', onMessage);
    window.parent.postMessage({ type: AGENT_TEMPLATE_READY }, '*');

    return () => window.removeEventListener('message', onMessage);
  }, []);

  return config;
}
