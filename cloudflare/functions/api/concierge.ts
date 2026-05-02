// POST /api/concierge
//
// Optional server-side OpenAI proxy. When the front-end's
// manifest.orchestration.proxy_endpoint is set to this URL, the OpenAI
// fallback in specialistRunOpenAI() (index.html) routes through here
// instead of calling api.openai.com directly with a build-time-injected
// key. This lets you remove the key from the static bundle entirely.
//
// The proxy expects the same JSON shape as the OpenAI Chat Completions
// API and streams the response body back unchanged.
//
// Bindings:
//   OPENAI_API_KEY    Secret. Provision with `wrangler secret put OPENAI_API_KEY`.
//                     The proxy returns 503 if missing.

interface Env {
  OPENAI_API_KEY?: string;
}

type PagesFunction<E = unknown> = (context: {
  request: Request;
  env: E;
  next: (input?: Request | string) => Promise<Response>;
  waitUntil: (promise: Promise<unknown>) => void;
}) => Response | Promise<Response>;

const MAX_BODY_BYTES = 64 * 1024;

function jsonError(status: number, msg: string): Response {
  return new Response(JSON.stringify({ ok: false, error: msg }), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  if (!env.OPENAI_API_KEY) {
    return jsonError(503, 'proxy not configured');
  }
  const contentLength = parseInt(request.headers.get('Content-Length') || '0', 10);
  if (contentLength > MAX_BODY_BYTES) {
    return jsonError(413, 'payload too large');
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch (_) {
    return jsonError(400, 'invalid JSON');
  }

  // Cheap shape-check — must be an object with a `messages` array. We
  // don't want to be tricked into proxying arbitrary requests.
  if (!body || typeof body !== 'object' || !Array.isArray((body as { messages?: unknown }).messages)) {
    return jsonError(400, 'expected { messages: [...] }');
  }

  const upstream = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + env.OPENAI_API_KEY,
    },
    body: JSON.stringify(body),
  });

  // Pass-through. Streamed responses keep their content-type so the
  // front-end can parse SSE incrementally.
  const passThrough = new Headers();
  const ct = upstream.headers.get('Content-Type');
  if (ct) passThrough.set('Content-Type', ct);
  return new Response(upstream.body, { status: upstream.status, headers: passThrough });
};

export const onRequest: PagesFunction = async ({ request }) => {
  if (request.method !== 'POST') {
    return jsonError(405, 'method not allowed');
  }
  return jsonError(405, 'method not allowed');
};
