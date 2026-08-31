import type { SkillInvocation } from './types';

export type AgentSkillCategory = 'document' | 'data' | 'productivity' | 'custom';

export interface AgentSkill {
  id: string;
  name: string;
  description: string;
  icon: string;
  logo: string;
  category: AgentSkillCategory;
  triggerText: string;
  promptTemplate: string;
  requiresUpload?: boolean;
  acceptedFileTypes?: string[];
  maxFiles?: number;
  runtime?: {
    managedAgentToolName?: string;
    httpAction?: string;
  };
}

export const agentSkills: AgentSkill[] = [
  {
    id: 'feedback-summary',
    name: '用户反馈总结',
    description: '上传反馈表、访谈记录或客服工单，归纳问题分类、情绪倾向和优先级。',
    icon: 'file',
    logo: 'capsule',
    category: 'data',
    triggerText: '帮我总结这批用户反馈',
    promptTemplate:
      '你是用户反馈分析助手。请优先基于用户上传附件中已提供的正文、反馈数据或用户粘贴的文本进行分析，输出：1. 总体结论；2. 高频问题分类及占比估算；3. 用户情绪倾向；4. TOP 5 具体反馈样例；5. 产品改进优先级；6. 可直接同步给团队的行动项。不要泛泛说明附件不可用；若确实只收到文件名，则基于文件名和用户问题给出分析框架。',
    requiresUpload: false,
    acceptedFileTypes: ['.csv', '.xlsx', '.md', '.txt', '.json'],
    maxFiles: 5,
    runtime: {
      managedAgentToolName: 'feedback_summary',
      httpAction: 'feedback.summary',
    },
  },
  {
    id: 'document-summary',
    name: '文档总结',
    description: '上传文档并提炼摘要、关键结论、待办和风险点。',
    icon: 'file',
    logo: 'catalog',
    category: 'document',
    triggerText: '帮我总结这份文档',
    promptTemplate:
      '请总结用户上传或粘贴的文档，输出核心摘要、关键结论、待办事项和潜在风险。保持结构清晰，必要时用表格。',
    requiresUpload: true,
    acceptedFileTypes: ['.md', '.txt', '.pdf', '.docx'],
    maxFiles: 3,
    runtime: {
      managedAgentToolName: 'document_summary',
      httpAction: 'document.summary',
    },
  },
  {
    id: 'data-analysis',
    name: '数据分析',
    description: '分析 CSV / Excel 数据，识别趋势、异常和业务建议。',
    icon: 'chart',
    logo: 'cloud-watch',
    category: 'data',
    triggerText: '帮我分析这份数据',
    promptTemplate:
      '请优先基于用户上传附件中已提供的数据正文或用户粘贴的数据进行分析，输出数据概览、关键趋势、异常点、可能原因和下一步建议。不要泛泛说明附件不可用；若确实只收到文件名，则基于文件名和用户问题给出分析口径。',
    requiresUpload: true,
    acceptedFileTypes: ['.csv', '.xlsx', '.json'],
    maxFiles: 3,
    runtime: {
      managedAgentToolName: 'data_analysis',
      httpAction: 'data.analysis',
    },
  },
  {
    id: 'ppt-outline',
    name: 'PPT 大纲',
    description: '根据主题生成可汇报的演示结构、页标题和讲稿要点。',
    icon: 'presentation',
    logo: 'boltshift',
    category: 'productivity',
    triggerText: '帮我生成一个 PPT 大纲',
    promptTemplate:
      '请根据用户输入的主题生成 PPT 大纲，包含页码、页面标题、核心内容、建议图表和讲稿提示。',
    runtime: {
      managedAgentToolName: 'ppt_outline',
      httpAction: 'presentation.outline',
    },
  },
];

export function toSkillInvocation(skill: AgentSkill): SkillInvocation {
  return {
    id: skill.id,
    name: skill.name,
    icon: skill.icon,
    promptTemplate: skill.promptTemplate,
    requiresUpload: skill.requiresUpload,
    acceptedFileTypes: skill.acceptedFileTypes,
    maxFiles: skill.maxFiles,
    runtime: skill.runtime,
  };
}
