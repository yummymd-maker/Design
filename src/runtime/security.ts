import type { AgentTemplateConfig } from '../config/types';
import type { ChatAttachment, SendMessageOptions } from './types';

export interface RuntimeSecuritySettings {
  contentSafety: boolean;
  sensitiveDataProtection: boolean;
  externalLinkProtection: boolean;
  fileUploadProtection: boolean;
  networkAccess: boolean;
  restrictedMode: boolean;
}

export interface SecurityNotice {
  level: 'warning' | 'blocked';
  message: string;
}

export const defaultSecuritySettings: RuntimeSecuritySettings = {
  contentSafety: true,
  sensitiveDataProtection: true,
  externalLinkProtection: true,
  fileUploadProtection: true,
  networkAccess: true,
  restrictedMode: false,
};

const riskyContentPatterns = [
  /绕过.*(审核|安全|限制|风控|防护)/i,
  /(获取|泄露|导出).*(api[_ -]?key|token|密码|密钥)/i,
  /(诈骗|钓鱼|木马|勒索|病毒|恶意代码)/i,
  /(自残|自杀|伤害自己)/i,
  /(枪支|爆炸物|毒品).*(制作|购买|交易)/i,
];

const externalLinkPattern = /https?:\/\/[^\s)]+/i;
const dangerousFilePattern = /\.(app|bat|cmd|com|dmg|exe|jar|pkg|ps1|scr|sh|vbs)$/i;
const maxProtectedFileSize = 20 * 1024 * 1024;

export function normalizeSecuritySettings(
  value?: Partial<RuntimeSecuritySettings> & { minorMode?: boolean },
): RuntimeSecuritySettings {
  return {
    ...defaultSecuritySettings,
    ...value,
    restrictedMode:
      value?.restrictedMode ?? value?.minorMode ?? defaultSecuritySettings.restrictedMode,
  };
}

export function applySecurityToConfig(
  config: AgentTemplateConfig,
  security: RuntimeSecuritySettings,
): AgentTemplateConfig {
  const restrictHighRisk = security.restrictedMode;
  const personalization = config.personalization ?? {
    replyTone: 'friendly',
    systemPrompt: '',
    memoryEnabled: false,
    toolMemoryEnabled: true,
    memories: [],
  };
  return {
    ...config,
    capabilities: {
      ...config.capabilities,
      attachments: config.capabilities.attachments && !restrictHighRisk,
      chatUpload:
        config.capabilities.chatUpload !== false &&
        !restrictHighRisk,
      chatSearch:
        config.capabilities.chatSearch !== false &&
        security.networkAccess &&
        !restrictHighRisk,
      chatCommand: config.capabilities.chatCommand !== false && !restrictHighRisk,
      chatPrompt: config.capabilities.chatPrompt === true && !restrictHighRisk,
    },
    settingsSections: {
      ...config.settingsSections,
      billingVisible: config.settingsSections.billingVisible && !restrictHighRisk,
    },
    personalization: {
      ...personalization,
      toolMemoryEnabled:
        personalization.toolMemoryEnabled &&
        !restrictHighRisk &&
        security.sensitiveDataProtection,
    },
  };
}

export function maskSensitiveText(text: string): string {
  return text
    .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, '[已隐藏邮箱]')
    .replace(/(?<!\d)1[3-9]\d{9}(?!\d)/g, '[已隐藏手机号]')
    .replace(/\b\d{6}(?:18|19|20)\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])\d{3}[\dXx]\b/g, '[已隐藏身份证号]')
    .replace(/\b(?:sk|ak|api[_-]?key|token|secret)[_:= -][A-Za-z0-9._-]{8,}\b/gi, '[已隐藏密钥]');
}

export function hasExternalLinks(text: string): boolean {
  return externalLinkPattern.test(text);
}

export function getContentSafetyNotice(text: string): SecurityNotice | undefined {
  const compactText = text.trim();
  if (!compactText) return undefined;
  if (riskyContentPatterns.some((pattern) => pattern.test(compactText))) {
    return {
      level: 'blocked',
      message: '已拦截：内容命中本地安全策略，请调整后再发送。',
    };
  }
  return undefined;
}

export function validateUploadFiles(files: File[], security: RuntimeSecuritySettings): SecurityNotice | undefined {
  if (!security.fileUploadProtection || files.length === 0) return undefined;
  const riskyFile = files.find((file) => dangerousFilePattern.test(file.name));
  if (riskyFile) {
    return {
      level: 'blocked',
      message: `已拦截：${riskyFile.name} 属于高风险可执行文件。`,
    };
  }
  const oversizedFile = files.find((file) => file.size > maxProtectedFileSize);
  if (oversizedFile) {
    return {
      level: 'blocked',
      message: `已拦截：${oversizedFile.name} 超过 20MB 安全上传限制。`,
    };
  }
  return undefined;
}

export function prepareOutgoingMessage(
  text: string,
  options: SendMessageOptions | undefined,
  security: RuntimeSecuritySettings,
): { text: string; options?: SendMessageOptions; notice?: SecurityNotice } {
  const fullText = [
    text,
    options?.quotedMessage?.content,
    ...(options?.attachments?.map((attachment) => attachment.name) ?? []),
  ]
    .filter(Boolean)
    .join('\n');

  if (security.contentSafety) {
    const notice = getContentSafetyNotice(fullText);
    if (notice) return { text, options, notice };
  }

  if (!security.networkAccess && options?.searchEnabled) {
    return {
      text,
      options,
      notice: {
        level: 'blocked',
        message: '已拦截：安全设置已关闭联网访问。',
      },
    };
  }

  if (!security.sensitiveDataProtection) return { text, options };

  return {
    text: maskSensitiveText(text),
    options: {
      ...options,
      quotedMessage: options?.quotedMessage
        ? {
            ...options.quotedMessage,
            content: maskSensitiveText(options.quotedMessage.content),
          }
        : options?.quotedMessage,
      attachments: options?.attachments?.map((attachment: ChatAttachment) => ({
        ...attachment,
        name: maskSensitiveText(attachment.name),
        textContent: attachment.textContent
          ? maskSensitiveText(attachment.textContent)
          : attachment.textContent,
      })),
    },
  };
}
