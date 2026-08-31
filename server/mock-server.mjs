/**
 * 示例后端（零依赖，Node 原生 http）。
 *
 * 目的：让你在本地立刻验证 httpAdapter / streamAdapter 两种协议，无需搭真后端。
 * 生产环境请替换为你自己的服务，只要遵守下面的请求 / 响应约定即可，前端零改动。
 *
 * 运行：
 *   node server/mock-server.mjs
 *   # 默认监听 http://localhost:8787
 *
 * 前端接法（编辑 src/config/agent.config.ts 的 runtime）：
 *   一次性 JSON： { adapter: 'http',   endpoint: 'http://localhost:8787/api/chat' }
 *   流式 SSE：    { adapter: 'stream', endpoint: 'http://localhost:8787/api/chat' }
 *
 * 说明：本示例通过请求体里的 `stream` 字段区分两种模式（streamAdapter 会传 stream:true）。
 */
import { createServer } from 'node:http';

const PORT = process.env.PORT ? Number(process.env.PORT) : 8787;

// 组装一段与前端事件模型一致的示例回复。
function buildReply(message) {
  const reasoning = '正在理解你的问题，并检索相关资料……';
  const content =
    `你问的是「${message}」。\n\n` +
    '这是来自**示例后端**的回复。把它替换成你真实的模型输出即可：\n\n' +
    '- 前端通过 adapter 消费事件流，UI 不感知后端差异\n' +
    '- 切换 mock / http / stream 只改 `agent.config.ts`\n\n' +
    '```ts\nruntime: { adapter: \'stream\', endpoint: \'/api/chat\' }\n```';
  const citations = [
    { index: 1, title: '接入说明 README', url: 'https://example.com/readme', snippet: '协议约定与二次开发指引。' },
    { index: 2, title: 've-design 文档', url: 'https://example.com/ve-design' },
  ];
  const artifacts = [
    { id: 'demo-1', title: '示例产物：接入清单', kind: 'markdown', description: '由后端返回的产物卡片。' },
  ];
  return { reasoning, content, citations, artifacts };
}

function readBody(req) {
  return new Promise((resolve) => {
    let raw = '';
    req.on('data', (c) => (raw += c));
    req.on('end', () => {
      try {
        resolve(raw ? JSON.parse(raw) : {});
      } catch {
        resolve({});
      }
    });
  });
}

const server = createServer(async (req, res) => {
  // CORS：方便前端 dev server（不同端口）直接调用
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.method !== 'POST' || !req.url?.startsWith('/api/chat')) {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not Found' }));
    return;
  }

  const body = await readBody(req);
  const message = String(body.message ?? '');
  const reply = buildReply(message);

  // ---- 流式（SSE）：streamAdapter 会带 stream:true ----
  if (body.stream) {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    });
    const send = (obj) => res.write(`data: ${JSON.stringify(obj)}\n\n`);
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

    // 思考链逐段
    for (const seg of reply.reasoning.match(/.{1,8}/gu) ?? []) {
      send({ type: 'reasoning-delta', delta: seg });
      await sleep(40);
    }
    // 正文逐段
    for (const seg of reply.content.match(/.{1,6}/gu) ?? []) {
      send({ type: 'content-delta', delta: seg });
      await sleep(24);
    }
    send({ type: 'citations', citations: reply.citations });
    send({ type: 'artifacts', artifacts: reply.artifacts });
    send({ type: 'done' });
    res.end();
    return;
  }

  // ---- 一次性 JSON：httpAdapter ----
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(reply));
});

server.listen(PORT, () => {
  console.log(`[mock-server] listening on http://localhost:${PORT}`);
  console.log(`[mock-server] POST /api/chat  (body.stream=true 走 SSE，否则一次性 JSON)`);
});
