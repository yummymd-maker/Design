import type {
  AgentRuntimeAdapter,
  AgentRuntimeEvent,
  SendMessageInput,
  SearchInput,
  SearchRuntimeEvent,
} from './adapter';
import type { CitationItem, ArtifactItem, SearchResultItem } from './types';
import { sampleMarkdownArticle } from './sampleMarkdownArticle';

/**
 * 离线演示 adapter。
 *
 * 以流式事件模拟一次真实回复：先输出思考链，再逐块输出正文，
 * 最后给出引用与产物卡。用于无后端时的预览与演示。
 */

function delay(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(resolve, ms);
    signal?.addEventListener(
      'abort',
      () => {
        clearTimeout(timer);
        reject(new DOMException('Aborted', 'AbortError'));
      },
      { once: true },
    );
  });
}

let artifactSeq = 0;

const mockToneText: Record<NonNullable<SendMessageInput['replyTone']>, string> = {
  friendly: '我会用更亲和、自然的方式来回答。',
  professional: '我会用更专业、严谨的结构来回答。',
  concise: '我会尽量先给结论，并压缩不必要的铺垫。',
  humorous: '我会保持轻松一点，但不拿准确性开玩笑。',
};

/** 内置的 mock 搜索数据集（模拟历史会话+消息+文件+产物）。
 *  会话 ID 与 App.tsx 中 defaultHistoryItems 保持一致：'1' / '2' / '3'
 */
const mockSearchDataset: SearchResultItem[] = [
  {
    id: 'conv-1',
    type: 'conversation',
    title: 'AI 办公数据分析',
    snippet: '使用 AI 工具提升办公效率，数据分析自动化，报表一键生成…',
    conversationId: '1',
    updatedAt: '2026-07-15T10:30:00.000Z',
  },
  {
    id: 'conv-2',
    type: 'conversation',
    title: '整理市场活动复盘',
    snippet: 'Q2 市场活动效果复盘，ROI 分析，用户增长与转化漏斗统计…',
    conversationId: '2',
    updatedAt: '2026-07-14T15:20:00.000Z',
  },
  {
    id: 'conv-3',
    type: 'conversation',
    title: '生成周会结论摘要',
    snippet: '本周周会要点整理，项目进展同步，下周工作计划与待办事项…',
    conversationId: '3',
    updatedAt: '2026-07-12T09:00:00.000Z',
  },
  {
    id: 'msg-1',
    type: 'message',
    title: '数据分析自动化方案',
    snippet: '建议使用 AI Agent 自动拉取数据、生成可视化报表，节省 80% 人力…',
    conversationId: '1',
    updatedAt: '2026-07-15T10:35:00.000Z',
  },
  {
    id: 'msg-2',
    type: 'message',
    title: '市场活动 ROI 关键结论',
    snippet: 'Q2 整体营收同比增长 23%，新用户注册量环比提升 15%，活动 ROI 达 3.2…',
    conversationId: '2',
    updatedAt: '2026-07-14T15:25:00.000Z',
  },
  {
    id: 'msg-3',
    type: 'message',
    title: '周会待办事项整理',
    snippet: '下周重点：产品原型评审、技术方案对齐、运营活动上线准备…',
    conversationId: '3',
    updatedAt: '2026-07-12T09:10:00.000Z',
  },
  {
    id: 'file-1',
    type: 'file',
    title: 'Q2 数据分析报告.pdf',
    snippet: '第二季度业务数据分析报告，包含核心指标、趋势分析、改进建议…',
    fileKind: 'pdf',
    updatedAt: '2026-07-10T14:00:00.000Z',
  },
  {
    id: 'file-2',
    type: 'file',
    title: '市场活动复盘.xlsx',
    snippet: '各渠道投放效果对比表，转化漏斗数据，用户画像分析…',
    fileKind: 'spreadsheet',
    updatedAt: '2026-07-08T11:30:00.000Z',
  },
  {
    id: 'artifact-1',
    type: 'artifact',
    title: '办公效率提升指南.md',
    snippet: 'AI 办公工具合集，自动化工作流搭建，数据分析模板分享…',
    conversationId: '1',
    fileKind: 'markdown',
    updatedAt: '2026-07-12T18:00:00.000Z',
  },
  {
    id: 'artifact-2',
    type: 'artifact',
    title: '周会纪要-第28周.md',
    snippet: '本周周会纪要，包含项目进展、问题讨论、下周计划、Action Items…',
    conversationId: '3',
    fileKind: 'markdown',
    updatedAt: '2026-07-11T16:45:00.000Z',
  },
];

/** 简易关键词匹配 + 命中区间计算。 */
function searchMockData(
  query: string,
  types?: SearchResultItem['type'][],
): SearchResultItem[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const filtered = types?.length
    ? mockSearchDataset.filter((item) => types.includes(item.type))
    : mockSearchDataset;

  return filtered
    .filter((item) => {
      const haystack = (item.title + ' ' + (item.snippet ?? '')).toLowerCase();
      return haystack.includes(q);
    })
    .map((item) => {
      const snippet = item.snippet ?? '';
      const idx = snippet.toLowerCase().indexOf(q);
      const highlights =
        idx >= 0 ? [{ start: idx, end: idx + q.length }] : undefined;
      return { ...item, highlights };
    });
}

export function createMockAdapter(): AgentRuntimeAdapter {
  return {
    async *sendMessage(input: SendMessageInput): AsyncIterable<AgentRuntimeEvent> {
      const { text, signal } = input;

      try {
        // 1) 任务过程：mock 模式只展示任务过程，不再额外展示深度思考块。
        if (input.thinkingEnabled !== false) {
          yield {
            type: 'process-step',
            step: {
              id: 'plan',
              title: '拆解任务目标',
              kind: 'reasoning',
              status: 'loading',
              content: `用户想了解「${text}」。`,
            },
          };
          const processSummary = '已完成问题拆解，接下来检索相关资料，再组织成结构化回答。';
          for (const chunk of splitChunks(processSummary, 12)) {
            await delay(60, signal);
            yield { type: 'process-step-delta', id: 'plan', delta: chunk };
          }
          yield {
            type: 'process-step',
            step: {
              id: 'plan',
              title: '拆解任务目标',
              kind: 'reasoning',
              status: 'success',
            },
          };
        }

        if (input.searchEnabled) {
          yield {
            type: 'process-step',
            step: {
              id: 'search',
              title: '联网检索资料',
              kind: 'tool',
              status: 'loading',
              content: '正在调用联网检索工具，查找与问题相关的背景信息和案例。',
            },
          };
          await delay(180, signal);
          yield {
            type: 'tool-call',
            stepId: 'search',
            toolCall: {
              id: 'search-docs',
              name: 'web_search',
              status: 'loading',
              summary: '检索联网资料与历史会话',
              input: { query: text, topK: 5 },
            },
          };
          await delay(260, signal);
          yield {
            type: 'tool-call',
            stepId: 'search',
            toolCall: {
              id: 'search-docs',
              name: 'web_search',
              status: 'success',
              summary: '找到 2 条相关参考资料',
              input: { query: text, topK: 5 },
              output: ['示例参考资料 A', '示例参考资料 B'],
              durationMs: 246,
            },
          };
          yield {
            type: 'process-step',
            step: {
              id: 'search',
              title: '联网检索资料',
              kind: 'tool',
              status: 'success',
            },
          };
        }

        if (input.skillInvocation) {
          yield {
            type: 'process-step',
            step: {
              id: `skill-${input.skillInvocation.id}`,
              title: `调用 Skill：${input.skillInvocation.name}`,
              kind: 'tool',
              status: 'success',
              content: input.skillInvocation.requiresUpload
                ? '已进入 Skill 调用链路。文本附件会随请求提供正文，二进制附件会交由业务后端解析。'
                : '已进入 Skill 调用链路。真实环境中可由 ManagedAgent 工具或业务后端执行。',
              toolCalls: [
                {
                  id: input.skillInvocation.id,
                  name: input.skillInvocation.runtime?.managedAgentToolName ?? input.skillInvocation.id,
                  status: 'success',
                  summary: input.skillInvocation.name,
                  input: {
                    promptTemplate: input.skillInvocation.promptTemplate,
                    attachments: input.attachments?.map((item) => item.name) ?? [],
                  },
                },
              ],
            },
          };
        }

        yield {
          type: 'process-step',
          step: {
            id: 'compose',
            title: '生成结构化回答',
            kind: 'summary',
            status: 'loading',
            content: '已获得背景信息，开始合成回答正文与可交付产物。',
          },
        };

        // 2) 正文，分块流出。
        const personalizationNotes = [
          mockToneText[input.replyTone ?? 'friendly'],
          input.systemPrompt?.trim()
            ? `已应用系统提示词：${input.systemPrompt.trim()}`
            : '',
          input.memories?.length
            ? `已注入记忆：${input.memories.join('；')}`
            : '',
          input.toolMemoryEnabled
            ? '允许工具任务在后端沉淀新记忆。'
            : '',
          input.skillInvocation
            ? `已选择 Skill：${input.skillInvocation.name}。`
            : '',
        ].filter(Boolean);

        const content = [
          `关于「${text}」，这里是一个示例回答：`,
          '',
          ...personalizationNotes.map((note) => `- **个性化**：${note}`),
          personalizationNotes.length ? '' : '',
          '- **要点一**：这是由 mock adapter 生成的演示内容。',
          '- **要点二**：正文使用 `@ve-design` 的 Markdown 组件渲染。',
          '- **要点三**：接入真实后端后，此处将替换为模型输出。',
          '',
          '> 提示：在下载的源码工程中替换 runtime adapter 即可对接你的服务。',
        ].join('\n');
        for (const chunk of splitChunks(content, 20)) {
          await delay(40, signal);
          yield { type: 'content-delta', delta: chunk };
        }
        yield {
          type: 'process-step',
          step: {
            id: 'compose',
            title: '生成结构化回答',
            kind: 'summary',
            status: 'success',
          },
        };

        // 3) 引用来源。
        const citations: CitationItem[] = [
          { index: 1, title: '示例参考资料 A', url: 'https://example.com/a', snippet: '相关背景说明。' },
          { index: 2, title: '示例参考资料 B', url: 'https://example.com/b', snippet: '补充数据来源。' },
        ];
        yield { type: 'citations', citations };

        // 4) 产物卡。
        artifactSeq += 1;
        const artifacts: ArtifactItem[] = [
          {
            id: `artifact-${artifactSeq}`,
            title: '示例文档.md',
            kind: 'markdown',
            description: '由回答生成的完整 Markdown 文章',
            content: sampleMarkdownArticle,
          },
        ];
        yield {
          type: 'process-step',
          step: {
            id: 'artifact',
            title: '整理交付产物',
            kind: 'artifact',
            status: 'success',
            content: '已生成可在右侧面板预览的文档产物。',
            artifacts,
          },
        };
        yield { type: 'artifacts', artifacts };

        yield { type: 'done' };
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') {
          yield { type: 'done' };
          return;
        }
        yield { type: 'error', message: err instanceof Error ? err.message : String(err) };
      }
    },

    async *search(input: SearchInput): AsyncIterable<SearchRuntimeEvent> {
      const { query, types, signal } = input;
      try {
        await delay(200, signal);

        const results = searchMockData(query, types);

        // 模拟流式分块返回，每批 2-3 条
        const batchSize = 2;
        for (let i = 0; i < results.length; i += batchSize) {
          await delay(100, signal);
          const batch = results.slice(i, i + batchSize);
          yield { type: 'search-delta', results: batch };
        }

        yield {
          type: 'search-done',
          total: results.length,
          hasMore: false,
        };
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') {
          yield { type: 'search-done', hasMore: false };
          return;
        }
        yield { type: 'search-error', message: err instanceof Error ? err.message : String(err) };
      }
    },
  };
}

/** 把字符串按字数切成若干块，模拟流式增量。 */
function splitChunks(text: string, size: number): string[] {
  const chunks: string[] = [];
  for (let i = 0; i < text.length; i += size) {
    chunks.push(text.slice(i, i + size));
  }
  return chunks;
}
