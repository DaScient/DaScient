// POST /api/grant-submit
//
// Receives a synthesized grant proposal from the front-end's review-then-
// cooling-then-email flow (index.html, renderProposalModule). Validates
// the payload, optionally verifies a Cloudflare Turnstile token,
// optionally rate-limits via KV, then forwards through MailChannels to
// the configured grants address.
//
// Bindings (all optional except OPENAI_API_KEY for the sister concierge.ts):
//   GRANT_RL          KV namespace — IP-keyed rate limiter
//   TURNSTILE_SECRET  Cloudflare Turnstile server-side secret (string secret)
//   MAIL_FROM         Authorized sender address on a domain you control
//   ALLOWED_ORIGINS   Comma-separated extra origins (CORS allow-list)
//
// SECURITY: The MailChannels relay is locked down to the deployed Worker
// account via the `_mailchannels` TXT record on the sending domain. Set
// up SPF / DKIM as documented in CLOUDFLARE.md before pointing this at
// production traffic.

interface Env {
  GRANT_RL?: KVNamespace;
  TURNSTILE_SECRET?: string;
  MAIL_FROM?: string;
}

interface Body {
  to?: string;
  subject?: string;
  body?: string;
  ref?: string;
  turnstileToken?: string;
}

const MAX_BODY_BYTES = 32 * 1024;       // 32 KB — proposals don't get bigger.
const MAX_SUBJECT    = 300;
const RL_WINDOW_SEC  = 5 * 60;          // 5 min

type PagesFunction<E = unknown> = (context: {
  request: Request;
  env: E;
  next: (input?: Request | string) => Promise<Response>;
  waitUntil: (promise: Promise<unknown>) => void;
}) => Response | Promise<Response>;

interface KVNamespace {
  get(key: string): Promise<string | null>;
  put(key: string, value: string, options?: { expirationTtl?: number }): Promise<void>;
}

function jsonResponse(status: number, payload: unknown): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}

async function verifyTurnstile(secret: string, token: string, ip: string | null): Promise<boolean> {
  try {
    const form = new URLSearchParams();
    form.set('secret', secret);
    form.set('response', token);
    if (ip) form.set('remoteip', ip);
    const r = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: form,
    });
    if (!r.ok) return false;
    const json = await r.json() as { success?: boolean };
    return !!json.success;
  } catch (_) {
    return false;
  }
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  // 1. Method + size guard.
  const contentLength = parseInt(request.headers.get('Content-Length') || '0', 10);
  if (contentLength > MAX_BODY_BYTES) {
    return jsonResponse(413, { ok: false, error: 'payload too large' });
  }

  let payload: Body;
  try {
    payload = await request.json() as Body;
  } catch (_) {
    return jsonResponse(400, { ok: false, error: 'invalid JSON' });
  }

  const to      = (payload.to      || '').trim();
  const subject = (payload.subject || '').trim();
  const body    = (payload.body    || '').trim();
  const ref     = (payload.ref     || '').trim();

  // 2. Schema check.
  if (!subject || subject.length > MAX_SUBJECT) {
    return jsonResponse(400, { ok: false, error: 'invalid subject' });
  }
  if (!body || body.length > MAX_BODY_BYTES) {
    return jsonResponse(400, { ok: false, error: 'invalid body' });
  }
  // Recipient must be a dascient.com address — never let the proxy be
  // weaponized to send arbitrary mail.
  const ALLOWED_RCPT = /^[a-z0-9._%+-]+@dascient\.com$/i;
  const recipient = to && ALLOWED_RCPT.test(to) ? to : 'grants@dascient.com';

  // 3. Turnstile (optional).
  if (env.TURNSTILE_SECRET) {
    const ip = request.headers.get('CF-Connecting-IP');
    if (!payload.turnstileToken ||
        !(await verifyTurnstile(env.TURNSTILE_SECRET, payload.turnstileToken, ip))) {
      return jsonResponse(403, { ok: false, error: 'turnstile failed' });
    }
  }

  // 4. Rate limit (optional).
  if (env.GRANT_RL) {
    const ip = request.headers.get('CF-Connecting-IP') || 'anon';
    const key = 'rl:grant:' + ip;
    const seen = await env.GRANT_RL.get(key);
    if (seen) {
      return jsonResponse(429, { ok: false, error: 'rate limited' });
    }
    await env.GRANT_RL.put(key, '1', { expirationTtl: RL_WINDOW_SEC });
  }

  // 5. Forward through MailChannels.
  const from = env.MAIL_FROM || 'concierge@dascient.com';
  const mailPayload = {
    personalizations: [
      { to: [{ email: recipient }] },
    ],
    from: { email: from, name: 'DaScient Concierge' },
    subject,
    content: [
      { type: 'text/plain', value: body },
    ],
    headers: ref ? { 'X-DaScient-Ref': ref } : undefined,
  };

  try {
    const r = await fetch('https://api.mailchannels.net/tx/v1/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(mailPayload),
    });
    if (!r.ok) {
      const text = await r.text();
      return jsonResponse(502, { ok: false, error: 'mailchannels failed', detail: text.slice(0, 200) });
    }
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'send failed';
    return jsonResponse(502, { ok: false, error: msg });
  }

  return jsonResponse(200, { ok: true, ref });
};

// Reject everything except POST.
export const onRequest: PagesFunction = async ({ request }) => {
  if (request.method !== 'POST') {
    return jsonResponse(405, { ok: false, error: 'method not allowed' });
  }
  // Should be unreachable — onRequestPost handles POST. This catch-all
  // exists so non-POST methods get a JSON response instead of falling
  // through to the static handler.
  return jsonResponse(405, { ok: false, error: 'method not allowed' });
};
