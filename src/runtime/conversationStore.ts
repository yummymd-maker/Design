import type { ChatMessage } from './types';
import { sampleMarkdownArticle } from './sampleMarkdownArticle';

const STORAGE_KEY = 'vedesign-studio.conversations.v1';
const TITLE_MAX_LENGTH = 18;

export interface ConversationRecord {
  id: string;
  title: string;
  messages: ChatMessage[];
  updatedAt: string;
  archived?: boolean;
  generating?: boolean;
  justCompleted?: boolean;
}

const seedConversationRecords: ConversationRecord[] = [
  {
    id: '1',
    title: 'AI 办公数据分析',
    updatedAt: '2026-07-15T10:35:00.000Z',
    messages: [
      {
        id: 'seed-1-user',
        role: 'user',
        content: '帮我分析一下 AI 办公数据，找出效率提升空间。',
      },
      {
        id: 'seed-1-assistant',
        role: 'assistant',
        content:
          '可以从三条线入手：重复文档处理、数据报表生成、跨团队信息同步。建议先把周报、日报、销售漏斗报表接入自动化流程，通常能减少 60% 以上的手工整理时间。',
        processSteps: [
          {
            id: 'seed-1-plan',
            title: '拆解办公流程',
            kind: 'reasoning',
            status: 'success',
            content: '按文档处理、数据报表、跨团队同步三个方向识别可自动化环节。',
          },
          {
            id: 'seed-1-tool',
            title: '检索历史资料',
            kind: 'tool',
            status: 'success',
            content: '查询知识库中的办公效率案例与自动化模板。',
            toolCalls: [
              {
                id: 'seed-1-search',
                name: 'search_docs',
                status: 'success',
                summary: '找到办公效率提升指南',
                input: { query: 'AI 办公效率 自动化' },
                output: ['办公效率提升指南.md'],
                durationMs: 128,
              },
            ],
          },
          {
            id: 'seed-1-artifact',
            title: '生成分析产物',
            kind: 'artifact',
            status: 'success',
            content: '整理为可交付文档，并同步到右侧产物面板。',
            artifacts: [
              {
                id: 'artifact-seed-1',
                title: '办公效率提升指南.md',
                kind: 'md',
                description: 'AI 办公数据分析与自动化落地建议',
                content: sampleMarkdownArticle,
              },
            ],
          },
        ],
        citations: [
          {
            index: 1,
            title: '办公效率提升指南.md',
            snippet: 'AI 办公工具合集，自动化工作流搭建，数据分析模板分享。',
          },
        ],
        artifacts: [
          {
            id: 'artifact-seed-1',
            title: '办公效率提升指南.md',
            kind: 'md',
            description: 'AI 办公数据分析与自动化落地建议',
            content: sampleMarkdownArticle,
          },
        ],
      },
    ],
  },
  {
    id: '2',
    title: '整理市场活动复盘',
    updatedAt: '2026-07-14T15:25:00.000Z',
    messages: [
      {
        id: 'seed-2-user',
        role: 'user',
        content: '整理 Q2 市场活动复盘，重点看 ROI 和转化漏斗。',
      },
      {
        id: 'seed-2-assistant',
        role: 'assistant',
        content:
          'Q2 复盘建议按「目标达成、渠道表现、漏斗转化、成本收益、下季度动作」组织。当前关键结论是：高意向渠道 ROI 更稳定，低成本渠道贡献了更多新增线索，但后段转化需要补强。',
        processSteps: [
          {
            id: 'seed-2-plan',
            title: '拆解复盘目标',
            kind: 'reasoning',
            status: 'success',
            content: '按目标达成、渠道表现、漏斗转化、成本收益和下季度动作组织复盘结论。',
          },
        ],
      },
    ],
  },
  {
    id: '3',
    title: '生成周会结论摘要',
    updatedAt: '2026-07-12T09:10:00.000Z',
    messages: [
      {
        id: 'seed-3-user',
        role: 'user',
        content: '把这周周会内容生成结论摘要和下周待办。',
      },
      {
        id: 'seed-3-assistant',
        role: 'assistant',
        content:
          '本周结论：产品原型进入评审阶段，技术方案仍需统一接口边界，运营活动素材已基本完成。下周待办：完成原型评审、锁定技术排期、确认活动上线检查清单。',
        artifacts: [
          {
            id: 'artifact-seed-3',
            title: '周会纪要-第28周.md',
            kind: 'md',
            description: '周会结论摘要与 Action Items',
            content: sampleMarkdownArticle,
          },
        ],
      },
    ],
  },
];

function normalizeMessages(messages: ChatMessage[]): ChatMessage[] {
  return messages.map((message) => ({ ...message, streaming: false }));
}

function isConversationRecord(value: unknown): value is ConversationRecord {
  if (!value || typeof value !== 'object') return false;

  const record = value as Partial<ConversationRecord>;
  return (
    typeof record.id === 'string' &&
    typeof record.title === 'string' &&
    typeof record.updatedAt === 'string' &&
    Array.isArray(record.messages)
  );
}

function fallbackRecords(): ConversationRecord[] {
  return seedConversationRecords.map((record) => ({
    ...record,
    messages: normalizeMessages(record.messages),
  }));
}

export function loadConversationRecords(): ConversationRecord[] {
  if (typeof window === 'undefined') return fallbackRecords();

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return fallbackRecords();

    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return fallbackRecords();

    const records = parsed.filter(isConversationRecord).map((record) => ({
      ...record,
      messages: normalizeMessages(record.messages),
    }));

    return records.length > 0 ? records : fallbackRecords();
  } catch {
    return fallbackRecords();
  }
}

export function saveConversationRecords(records: ConversationRecord[]): void {
  if (typeof window === 'undefined') return;

  window.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(
      records.map((record) => ({
        ...record,
        messages: normalizeMessages(record.messages),
      })),
    ),
  );
}

export function createConversationId(): string {
  return `conversation-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function createConversationTitle(text: string): string {
  const title = text.trim().replace(/\s+/g, ' ');
  if (!title) return '新对话';
  return title.length > TITLE_MAX_LENGTH ? `${title.slice(0, TITLE_MAX_LENGTH)}...` : title;
}
