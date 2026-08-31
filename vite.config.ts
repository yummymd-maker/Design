import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

function readJsonBody(req: import('node:http').IncomingMessage) {
  return new Promise<Record<string, any>>((resolve) => {
    let raw = '';
    req.on('data', (chunk) => {
      raw += chunk;
    });
    req.on('end', () => {
      try {
        resolve(raw ? JSON.parse(raw) : {});
      } catch {
        resolve({});
      }
    });
  });
}

function managedAgentProxyPlugin() {
  return {
    name: 'managed-agent-proxy',
    configureServer(server: import('vite').ViteDevServer) {
      server.middlewares.use('/api/managed-agent/stream', async (req, res) => {
        if (req.method === 'OPTIONS') {
          res.writeHead(204, {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type, Accept, Authorization',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
          });
          res.end();
          return;
        }

        if (req.method !== 'POST') {
          res.writeHead(405, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Method Not Allowed' }));
          return;
        }

        const body = await readJsonBody(req);
        const apiKey = String(req.headers.authorization ?? '').replace(/^Bearer\s+/i, '') || String(body.api_key ?? body.apiKey ?? '');
        const baseURL = String(body.base_url ?? body.baseURL ?? 'https://ark.cn-beijing.volces.com/api/v3')
          .replace(/\/+$/, '')
          .replace(/\/sessions$/i, '');
        const agentId = String(body.agent_id ?? body.agentId ?? '');
        const environmentId = String(body.environment_id ?? body.environmentId ?? '');
        const events = Array.isArray(body.events) ? body.events : [];

        if (!apiKey || !agentId || !environmentId || !events.length) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            error: 'Missing required ManagedAgent params',
            required: ['apiKey', 'agent_id', 'environment_id', 'events'],
          }));
          return;
        }

        try {
          const writeSse = (event: string, data: unknown) => {
            res.write(`event: ${event}\n`);
            res.write(`data: ${JSON.stringify(data)}\n\n`);
          };
          const writeManagedAgentEvent = (payload: unknown) => {
            if (payload && typeof payload === 'object' && Array.isArray((payload as { data?: unknown }).data)) {
              for (const item of (payload as { data: unknown[] }).data) {
                writeManagedAgentEvent(item);
              }
              return;
            }

            const eventName = payload && typeof payload === 'object'
              ? String((payload as { type?: unknown }).type ?? 'managed-agent.event')
              : 'managed-agent.event';
            writeSse(eventName, payload);
          };

          const sessionRes = await fetch(`${baseURL}/sessions`, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${apiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              agent: agentId,
              environment_id: environmentId,
            }),
          });

          const sessionText = await sessionRes.text();
          if (!sessionRes.ok) {
            res.writeHead(sessionRes.status, { 'Content-Type': 'application/json' });
            res.end(sessionText || JSON.stringify({ error: 'Failed to create ManagedAgent session' }));
            return;
          }

          const session = sessionText ? JSON.parse(sessionText) : {};
          const sessionId = String(session.id ?? session.session_id ?? session.sessionId ?? '');
          if (!sessionId) {
            res.writeHead(502, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'ManagedAgent session response missing id', session }));
            return;
          }

          res.writeHead(200, {
            'Content-Type': 'text/event-stream; charset=utf-8',
            'Cache-Control': 'no-cache',
            Connection: 'keep-alive',
          });
          writeSse('process-step', {
            type: 'process-step',
            step: {
              id: sessionId,
              title: 'ManagedAgent 会话已创建',
              status: 'success',
              kind: 'tool',
            },
          });

          const postEvents = (payload: unknown) => fetch(`${baseURL}/sessions/${sessionId}/events`, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${apiKey}`,
              'Content-Type': 'application/json',
              Accept: 'text/event-stream, application/json',
            },
            body: JSON.stringify(payload),
          });

          const readEventList = async () => {
            const eventRes = await fetch(`${baseURL}/sessions/${sessionId}/events`, {
              method: 'GET',
              headers: {
                Authorization: `Bearer ${apiKey}`,
                Accept: 'application/json',
              },
            });
            const text = await eventRes.text().catch(() => '');
            if (!eventRes.ok) {
              throw new Error(text || `Failed to read ManagedAgent events: HTTP ${eventRes.status}`);
            }
            return text;
          };

          let eventsRes = await postEvents({ events });
          if ((eventsRes.status === 400 || eventsRes.status === 422) && events.length === 1) {
            eventsRes = await postEvents({ event: events[0] });
          }
          if ((eventsRes.status === 400 || eventsRes.status === 422) && events.length === 1) {
            eventsRes = await postEvents(events[0]);
          }

          if (!eventsRes.ok || !eventsRes.body) {
            const detail = await eventsRes.text().catch(() => '');
            writeSse('error', {
              type: 'error',
              message: detail || `Failed to send ManagedAgent events: HTTP ${eventsRes.status}`,
            });
            res.end();
            return;
          }

          writeSse('process-step', {
            type: 'process-step',
            step: {
              id: `${sessionId}-message`,
              title: 'ManagedAgent 用户消息已发送',
              status: 'success',
              kind: 'tool',
            },
          });

          const eventsContentType = eventsRes.headers.get('content-type') ?? '';
          if (eventsContentType.includes('text/event-stream') && eventsRes.body) {
            const reader = eventsRes.body.getReader();
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;
              res.write(value);
            }
            res.end();
            return;
          }

          const eventsText = await eventsRes.text().catch(() => '');
          if (eventsText) {
            try {
              const parsed = JSON.parse(eventsText);
              writeManagedAgentEvent(parsed);
            } catch {
              writeSse('managed-agent.event', { type: 'content-delta', delta: eventsText });
            }
          }

          const seenEventIds = new Set<string>();
          const startedAt = Date.now();
          while (Date.now() - startedAt < 60000) {
            await new Promise((resolve) => setTimeout(resolve, 1500));
            const eventText = await readEventList();
            let hasIdle = false;

            try {
              const parsed = JSON.parse(eventText);
              const items = Array.isArray(parsed?.data) ? parsed.data : [];
              const nextItems = items.filter((item: Record<string, unknown>) => {
                const id = String(item.id ?? '');
                if (!id || seenEventIds.has(id)) return false;
                seenEventIds.add(id);
                return true;
              });

              if (nextItems.length) {
                for (const item of nextItems) {
                  writeManagedAgentEvent(item);
                }
              }
              hasIdle = items.some((item: Record<string, unknown>) => {
                const type = String(item.type ?? '');
                return type === 'session.status_idle' || type === 'session.thread_status_idle';
              });
            } catch {
              writeSse('managed-agent.event', { type: 'content-delta', delta: eventText });
            }

            if (hasIdle) {
              writeSse('done', { type: 'done' });
              res.end();
              return;
            }
          }

          writeSse('error', {
            type: 'error',
            message: 'ManagedAgent 会话已创建并发送用户消息，但 60 秒内没有等到 session.status_idle。请检查 Agent 是否卡在工具调用、权限确认或模型生成中。',
          });
          res.end();
        } catch (err) {
          if (!res.headersSent) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: err instanceof Error ? err.message : String(err) }));
            return;
          }
          res.write(`event: error\n`);
          res.write(`data: ${JSON.stringify({ type: 'error', message: err instanceof Error ? err.message : String(err) })}\n\n`);
          res.end();
        }
      });
    },
  };
}

// Agent 源码模板的独立开发/构建配置。
// 该模板既可独立 `npm run dev` 运行，也可被工具作为预览产物构建。
// base 用相对路径：构建产物可被宿主工具以 iframe（相对路径）嵌入，
// 也能在导出工程里以 file:// 或任意子目录部署。
export default defineConfig({
  base: './',
  plugins: [react(), managedAgentProxyPlugin()],
  server: {
    port: 5276,
    open: true,
  },
});
