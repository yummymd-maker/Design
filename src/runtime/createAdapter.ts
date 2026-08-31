import type { AgentTemplateConfig } from '../config/types';
import type { AgentRuntimeAdapter } from './adapter';
import { createMockAdapter } from './mockAdapter';
import { createHttpAdapter } from './httpAdapter';
import { createStreamAdapter } from './streamAdapter';
import { createDoubaoAdapter } from './doubaoAdapter';
import { createManagedAgentAdapter } from './managedAgentAdapter';
import { DEFAULT_ARK_BASE_URL, normalizeArkBaseURL } from './arkBaseURL';

/**
 * 按运行配置选择 adapter（见 PRD 4.5）。
 *
 * UI 只调用本工厂，不关心具体实现；切换后端只改 config，不动 UI。
 * - `mock`   ：离线演示（默认）
 * - `http`   ：一次性 JSON 后端
 * - `stream` ：SSE / NDJSON 流式后端（真正逐字输出）
 * - `doubao` ：豆包 / Ark OpenAI 兼容接口
 * - `managedAgent`：火山方舟 ManagedAgent 接入
 * 缺少 endpoint 时一律回落到 mock，保证预览 / 演示始终可用。
 */
export function createAdapter(config: AgentTemplateConfig): AgentRuntimeAdapter {
  const { runtime } = config;

  switch (runtime.adapter) {
    case 'http':
      if (!runtime.endpoint) return createMockAdapter();
      return createHttpAdapter({ endpoint: runtime.endpoint });
    case 'stream':
      if (!runtime.endpoint) return createMockAdapter();
      return createStreamAdapter({ endpoint: runtime.endpoint });
    case 'doubao':
      if (!runtime.apiKey) return createMockAdapter();
      return createDoubaoAdapter({
        baseURL: normalizeArkBaseURL(runtime.baseURL),
        apiKey: runtime.apiKey,
        model: runtime.model || 'doubao-seed-2-1-pro-260628',
        temperature: runtime.temperature,
        topP: runtime.topP,
        maxTokens: runtime.maxTokens,
      });
    case 'managedAgent':
      return createManagedAgentAdapter({
        endpoint: '/api/managed-agent/stream',
        baseURL: normalizeArkBaseURL(runtime.baseURL || DEFAULT_ARK_BASE_URL),
        apiKey: runtime.apiKey,
        agentId: runtime.agentId,
        environmentId: runtime.environmentId,
        sessionId: runtime.sessionId,
        sessionMode: runtime.sessionMode || 'new-per-chat',
        stream: runtime.stream !== false,
      });
    case 'mock':
    default:
      return createMockAdapter();
  }
}
