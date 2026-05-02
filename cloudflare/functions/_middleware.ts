// Pages Functions middleware — applied to every route under /api/* and
// the static asset routes. Adds security headers and a CORS layer for
// the JSON API endpoints.
//
// Cloudflare Pages auto-discovers this file when placed at
// cloudflare/functions/_middleware.ts (with `pages_build_output_dir`
// set to ../dist in wrangler.toml). When deploying as a stand-alone
// Worker instead, fold this logic into a top-level fetch handler.

interface Env {
  ALLOWED_ORIGINS?: string;
}

// Origins allowed to hit the API. The deployed apex/www are always allowed;
// preview deployments under *.pages.dev are allowed by pattern. Additional
// hosts can be supplied via the ALLOWED_ORIGINS env var (comma-separated).
const DEFAULT_ALLOWED = [
  'https://dascient.com',
  'https://www.dascient.com',
];

function isAllowedOrigin(origin: string | null, env: Env): boolean {
  if (!origin) return false;
  const extra = (env.ALLOWED_ORIGINS || '').split(',').map((s) => s.trim()).filter(Boolean);
  const list = [...DEFAULT_ALLOWED, ...extra];
  if (list.includes(origin)) return true;
  // Pages preview deployments: <hash>.dascient.pages.dev
  try {
    const u = new URL(origin);
    if (u.hostname.endsWith('.pages.dev')) return true;
  } catch (_) { /* malformed */ }
  return false;
}

const SECURITY_HEADERS: Record<string, string> = {
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  // Conservative CSP. The site loads fonts.googleapis.com, the Tailwind
  // CDN, and esm.run for the optional WebLLM import; if you drop those
  // (see Part 1 open question on the Tailwind CDN) you can tighten this.
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' https://cdn.tailwindcss.com https://esm.run",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src https://fonts.gstatic.com data:",
    "img-src 'self' data:",
    "connect-src 'self' https://api.openai.com https://esm.run",
    "frame-ancestors 'none'",
    "base-uri 'self'",
  ].join('; '),
};

export const onRequest: PagesFunction<Env> = async (context) => {
  const { request, next, env } = context;
  const url = new URL(request.url);
  const isApi = url.pathname.startsWith('/api/');
  const origin = request.headers.get('Origin');

  // Pre-flight handling for the API surface.
  if (isApi && request.method === 'OPTIONS') {
    if (!isAllowedOrigin(origin, env)) {
      return new Response(null, { status: 403 });
    }
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': origin!,
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Max-Age': '86400',
        'Vary': 'Origin',
      },
    });
  }

  const response = await next();
  const headers = new Headers(response.headers);
  for (const [k, v] of Object.entries(SECURITY_HEADERS)) headers.set(k, v);
  if (isApi && origin && isAllowedOrigin(origin, env)) {
    headers.set('Access-Control-Allow-Origin', origin);
    headers.set('Vary', 'Origin');
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
};

// PagesFunction type (minimal local declaration so this file type-checks
// without pulling in @cloudflare/workers-types as a dependency).
type PagesFunction<E = unknown> = (context: {
  request: Request;
  env: E;
  next: (input?: Request | string) => Promise<Response>;
  waitUntil: (promise: Promise<unknown>) => void;
}) => Response | Promise<Response>;
