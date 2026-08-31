import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

// 必须最先执行：把 prismjs 核心挂到全局，供 @ve-design/web 的 ve-markdown
// 语言组件（依赖全局 Prism）在生产构建下正常工作。详见该模块注释。
import './runtime/prism-global';

// —— 样式加载顺序（见 PRD 4.2）——
// 1) 官方默认主题（@ve-design/react 与 @ve-design/web 共用同一份 token）
import '@ve-design/react/css/default.css';
import '@ve-design/web/css/default.css';
// 2) 模板主题覆盖（覆盖官方 token / 定义 --studio-* 扩展）
import './theme/tokens.css';
// 3) 应用级布局样式（.app-shell / .agent-sidebar / .chat-* / .welcome-* 等，
//    1:1 复刻自 agent-runtime，务必最后加载以获得最高优先级）
import './theme/app-layout.css';

// —— @ve-design/web 组件按需注册（副作用 import 完成 customElements.define）——
import '@ve-design/web/ve-sidebar';
import '@ve-design/web/ve-avatar';
import '@ve-design/web/ve-icon';
import '@ve-design/web/ve-button';
import '@ve-design/web/ve-dropdown';
import '@ve-design/web/ve-chat-input';
import '@ve-design/web/ve-bubble';
import '@ve-design/web/ve-bubble-divider';
import '@ve-design/web/ve-markdown';
import '@ve-design/web/ve-thinking';
import '@ve-design/web/ve-citation';
import '@ve-design/web/ve-artifact-card';
import '@ve-design/web/ve-actions';
import '@ve-design/web/ve-tag';
import '@ve-design/web/ve-tabs';
import '@ve-design/web/ve-modal';
import '@ve-design/web/ve-tooltip';
import '@ve-design/web/ve-input';
import '@ve-design/web/ve-empty';
import '@ve-design/web/ve-suggestion';
import '@ve-design/web/ve-prompt-item';

import { App } from './App';
import { agentConfig } from './config/agent.config';

const root = document.getElementById('root');
if (!root) {
  throw new Error('#root not found');
}

createRoot(root).render(
  <StrictMode>
    <App config={agentConfig} />
  </StrictMode>,
);
