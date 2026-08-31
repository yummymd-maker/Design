/**
 * Agent 模板运行配置 Schema。
 *
 * 这是「单一源码」的配置契约：右侧预览与导出工程共用同一份类型，
 * 左侧 Theme Studio 产出的配置会被注入到这里，驱动 UI 与 runtime。
 *
 * 约束（见 PRD 4.2 ve-design 实践基线）：
 * - 视觉全部由 token 决定，此处不承载任何 HEX/RGB 值。
 * - 能力开关是数据驱动的，不通过隐藏 DOM 实现。
 */

/** 品牌信息。 */
export interface BrandConfig {
  /** 品牌 / 助手名称。 */
  name: string;
  /** 亮色场景 Logo 地址（可选，支持 data URL）。 */
  logo?: string;
  /** 暗色场景 Logo 地址（可选）。 */
  inverseLogo?: string;
}

/** 欢迎页任务卡片。 */
export interface WelcomeTaskCard {
  id: string;
  title: string;
  cover?: string;
}

/** 欢迎页配置。 */
export interface WelcomeConfig {
  /** 欢迎主标题。 */
  title: string;
  /** 欢迎副标题（可选）。 */
  subtitle?: string;
  /** 是否在欢迎页标题上方显示 Logo。 */
  logoVisible?: boolean;
  /** 推荐问题列表，点击后作为首条用户输入发送。 */
  suggestions: string[];
  /** 任务卡片列表（gallery）。传空数组或 tasksVisible=false 时不显示。 */
  tasks?: WelcomeTaskCard[];
  /** 是否显示任务卡片区块。 */
  tasksVisible?: boolean;
}

/** 主题配置。 */
export interface ThemeConfig {
  /** 明暗模式。 */
  mode: 'light' | 'dark';
  /**
   * 主题 token CSS 的加载路径。加载顺序固定：
   * 先 `@ve-design/react/css/default.css`，再加载此覆盖文件。
   */
  tokensCssPath: string;
  /** 背景样式：纯色 / 渐变 / 图片。 */
  backgroundStyle: 'solid' | 'gradient' | 'image';
  /** 纯色背景的颜色 token。 */
  bgToken?: 'surface' | 'base' | 'soft' | 'neutral';
  /** 图片背景的图片 URL。 */
  backgroundImage?: string;
  /** 图片背景的色调（影响文字颜色）。 */
  imageTone?: 'light' | 'dark';
  /** 背景模糊程度（px）。 */
  backgroundBlur?: number;
  /** 是否启用渐变噪点效果。 */
  gradientNoise?: boolean;
  /** 渐变噪点透明度。 */
  gradientNoiseOpacity?: string;
  /** 间距缩放比例。 */
  spacingScale?: number;
  /** 圆角缩放比例。 */
  radiusScale?: number;
  /** 中文字体栈。 */
  fontCn?: string;
  /** 英文字体栈。 */
  fontEn?: string;
  /** ve-motion 输入框流光主色，格式为 `H S L`，例如 `265 88 78`。 */
  composerGlowColor?: string;
  /** ve-motion 输入框流光渐变色，逗号分隔 CSS 颜色。 */
  composerGlowColors?: string;
}

/** 能力开关，全部数据驱动。 */
export interface CapabilitiesConfig {
  /** 思考链（Thinking / ThoughtChain）。 */
  thinkingChain: boolean;
  /** 思考链默认展开。 */
  thinkingDefaultOpen?: boolean;
  /** 引用来源（Citation）。 */
  citation: boolean;
  /** 产物卡片（ArtifactCard）。 */
  artifactCard: boolean;
  /** 附件上传。 */
  attachments: boolean;
  /** 历史会话侧栏。 */
  history: boolean;
  /** 消息操作条（复制 / 重试等）。 */
  messageActions: boolean;
  /** 全局搜索（侧边栏搜索入口 + 搜索页）。 */
  search: boolean;
  /** 输入框 - 上传附件 */
  chatUpload?: boolean;
  /** 输入框 - 联网 */
  chatSearch?: boolean;
  /** 输入框 - 引用块 / 上下文卡片 */
  chatQuote?: boolean;
  /** 输入框 - 变量槽 / Prompt 模板 */
  chatPrompt?: boolean;
  /** 输入框 - / 命令 */
  chatCommand?: boolean;
}

/** 侧边栏配置。 */
export interface SidebarConfig {
  /** 是否显示侧边栏。 */
  visible: boolean;
  /** 侧边栏宽度（px）。 */
  width: number;
  /** 侧边栏位置。 */
  position: 'left' | 'right';
  /** 侧边栏背景样式。 */
  background: 'surface' | 'transparent' | 'brand';
}

/** 设置页左侧分组可见性配置。 */
export interface SettingsSectionsConfig {
  /** 是否显示账单分组。 */
  billingVisible: boolean;
  /** 是否显示安全分组。 */
  securityVisible?: boolean;
  /** @deprecated 兼容旧配置：是否显示安全分组。 */
  parentalVisible?: boolean;
}

/** 布局配置。 */
export interface LayoutConfig {
  /** 内容布局：留白卡片 / 沉浸式铺满。 */
  contentMode: 'card' | 'immersive';
  /** 结果布局：双栏 / 画布 / 分页。 */
  artifactMode: 'split' | 'canvas' | 'tabs';
  /** 对话内容宽度。 */
  contentWidth: 'standard' | 'wide';
  /** 内容密度。 */
  density: 'comfortable' | 'compact';
}

/** 产物面板配置。 */
export interface ArtifactPanelConfig {
  /** 是否启用产物面板（有产物时才会显示）。 */
  enabled: boolean;
  /** 默认视图：预览 / 代码。 */
  defaultView: 'preview' | 'code';
  /** 是否显示代码切换 Tab。 */
  codeTabVisible: boolean;
  /** 是否显示产物操作按钮（复制/下载/更多）。 */
  actionsVisible: boolean;
}

/** 个性化配置。 */
export interface PersonalizationConfig {
  /** 回复语气。 */
  replyTone: 'friendly' | 'professional' | 'concise' | 'humorous';
  /** 系统提示词 / 自定义指令。 */
  systemPrompt?: string;
  /** 是否启用记忆。 */
  memoryEnabled: boolean;
  /** 是否允许从工具调用或联网任务生成记忆。 */
  toolMemoryEnabled: boolean;
  /** 本地保存的用户记忆条目。 */
  memories: string[];
}

/** Runtime / 后端接入配置。 */
export interface RuntimeConfig {
  /** 使用哪个 adapter。 */
  adapter: 'mock' | 'http' | 'stream' | 'doubao' | 'managedAgent';
  /** 后端地址，`http` / `stream` 使用；`managedAgent` 可在代码中用它覆盖默认代理地址。 */
  endpoint?: string;
  /** 豆包 / Ark OpenAI 兼容 API Base URL；ManagedAgent 中作为火山数据面 Base URL。 */
  baseURL?: string;
  /** 豆包 / Ark API Key。仅保存在当前浏览器或导出的本地工程中。 */
  apiKey?: string;
  /** 豆包模型 ID。 */
  model?: string;
  /** 火山方舟 ManagedAgent ID。 */
  agentId?: string;
  /** 火山方舟 ManagedAgent Environment ID。 */
  environmentId?: string;
  /** ManagedAgent 会话 ID；不填则由服务端或火山侧创建新会话。 */
  sessionId?: string;
  /** ManagedAgent 会话策略。 */
  sessionMode?: 'reuse' | 'new-per-chat';
  /** ManagedAgent 是否使用流式事件返回。 */
  stream?: boolean;
  /** 采样温度。 */
  temperature?: number;
  /** nucleus sampling 参数。 */
  topP?: number;
  /** 单次输出 token 上限。 */
  maxTokens?: number;
}

/** Agent 模板的完整运行配置。 */
export interface AgentTemplateConfig {
  brand: BrandConfig;
  welcome: WelcomeConfig;
  theme: ThemeConfig;
  capabilities: CapabilitiesConfig;
  sidebar: SidebarConfig;
  settingsSections: SettingsSectionsConfig;
  layout: LayoutConfig;
  artifactPanel: ArtifactPanelConfig;
  personalization: PersonalizationConfig;
  /** 数据模式：离线演示 or 真实后端。 */
  dataMode: 'mock' | 'live';
  runtime: RuntimeConfig;
}
