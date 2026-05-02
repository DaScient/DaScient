# Cloudflare runbook

This document describes how to enable the **opt-in** Cloudflare integration
shipped under `cloudflare/`. Nothing here is required to keep the site
running; the GitHub Pages deploy in `.github/workflows/deploy.yml`
continues to work unchanged.

The integration provides three things:

1. `/api/grant-submit` — a Pages Function (or Worker) that accepts the
   synthesized proposal from the front-end's review-then-cooling-then-email
   flow and forwards it through **MailChannels** to `grants@dascient.com`.
   This avoids opening the user's mail client and removes the truncation
   limit of `mailto:` URLs.
2. `/api/concierge` — an optional OpenAI proxy. With this in place, the
   build-time `__OPENAI_API_KEY__` injection in `vite.config.js` can be
   retired and the key kept entirely server-side.
3. Edge security headers + CORS allow-list + optional Turnstile + KV
   rate-limiter, applied to every response.

---

## 1. Cloudflare account API token

Create a token at <https://dash.cloudflare.com/profile/api-tokens> with
the following permissions:

| Permission                | Scope         |
|---------------------------|---------------|
| Account · Cloudflare Pages | Edit          |
| Account · Workers Scripts | Edit          |
| Account · Workers KV Storage | Edit       |
| Zone · DNS                | Edit (only if you'll wire a custom domain) |
| User · User Details       | Read          |

Store it in your repository's GitHub Actions secrets as
`CLOUDFLARE_API_TOKEN`. (Not used by the existing `deploy.yml`; only
needed if you wire up a CI deploy to Cloudflare.)

---

## 2. Pick a deploy posture

You have two options. Pick one — they are mutually exclusive only at
the level of which surface holds the static HTML; the Functions can
deploy independently in either case.

### (a) Cloudflare Pages owns the entire site

Connect this GitHub repo at <https://dash.cloudflare.com/?to=/:account/pages>:

* Build command: `npm run build`
* Build output directory: `dist`
* Root directory: `/` (default)
* Functions directory: detected automatically from `cloudflare/functions/`
  when `pages_build_output_dir = "../dist"` is set in
  `cloudflare/wrangler.toml`. (Pages will discover the `cloudflare/`
  directory at the repo root.)

Cloudflare will build on every push, and `cloudflare/functions/api/*.ts`
will be served at `/api/*` on the same hostname. **Disable** the GitHub
Pages workflow if you go this route to avoid two deploy targets racing.

### (b) GitHub Pages keeps the static site, a Worker hosts only `/api/*`

Recommended if you want zero risk of regressing today's deploy.

* GitHub Pages keeps serving `index.html` and the static assets at
  `dascient.com` (or `dascient.github.io`).
* Deploy `cloudflare/functions/api/grant-submit.ts` and
  `cloudflare/functions/api/concierge.ts` as a Worker bound to
  `api.dascient.com`. Easiest path: wrap the two handlers in a small
  router and use `wrangler deploy`.
* Set `manifest.orchestration.proxy_endpoint` and
  `vectors[A].handoff.send_endpoint` to the Worker URLs in
  `public/manifest.json` (and mirror in `INLINE_MANIFEST` inside
  `index.html`).

> Note: the Pages Functions in `cloudflare/functions/` use the
> `PagesFunction` signature. To deploy them as a stand-alone Worker
> instead, export a single `fetch(request, env, ctx)` handler that
> dispatches by `url.pathname` and reuse the same body of each handler.
> Fewer than 30 lines of glue.

---

## 3. DNS / custom domain

For either posture you'll likely want `dascient.com` (and possibly
`api.dascient.com`) on Cloudflare:

1. Add the zone in Cloudflare and update your registrar's nameservers.
2. **Pages:** in the Pages project → Custom domains, add `dascient.com`
   and `www.dascient.com`. Cloudflare will issue a certificate.
3. **Worker:** in the Worker → Triggers → Custom domains, add
   `api.dascient.com`. Or define a route in `wrangler.toml` (see the
   commented `[[routes]]` block).

---

## 4. MailChannels domain authorization

`/api/grant-submit` forwards mail through MailChannels, the free outbound
relay Cloudflare Workers integrates with. MailChannels requires that the
sending domain explicitly authorize Cloudflare to send on its behalf,
**otherwise the relay returns 550 and the proposal is dropped on the
floor.**

For the domain in `MAIL_FROM` (e.g. `dascient.com`), add these DNS
records:

### SPF

```
TYPE: TXT
NAME: @            (i.e. dascient.com)
VALUE: v=spf1 include:relay.mailchannels.net ~all
```

If you already have an SPF record, **merge** the include — do not add a
second `v=spf1` record. Example merged record:

```
v=spf1 include:_spf.google.com include:relay.mailchannels.net ~all
```

### DKIM

Generate a key pair (any RSA-2048 generator works). Upload the private
key as a Worker secret named `DKIM_PRIVATE_KEY`, and publish the public
half at:

```
TYPE: TXT
NAME: mailchannels._domainkey   (i.e. mailchannels._domainkey.dascient.com)
VALUE: v=DKIM1; k=rsa; p=<base64-encoded public key, no line breaks>
```

The current `grant-submit.ts` does not yet sign with DKIM client-side;
MailChannels will sign on your behalf if SPF + the lockdown record below
are in place. Adding DKIM signing locally is a future enhancement.

### `_mailchannels` lockdown record (REQUIRED — security)

Without this, **any** Cloudflare account can use MailChannels to send as
your domain. Lock it down to your account:

```
TYPE: TXT
NAME: _mailchannels                  (i.e. _mailchannels.dascient.com)
VALUE: v=mc1 cfid=<your-account-id>.workers.dev
```

Replace `<your-account-id>` with the account-scoped subdomain shown at
the top of the Workers dashboard. Without this record MailChannels will
refuse to send.

---

## 5. Worker secrets

From inside `cloudflare/`:

```bash
npx wrangler secret put OPENAI_API_KEY
npx wrangler secret put TURNSTILE_SECRET     # optional
# MAIL_FROM and ALLOWED_ORIGINS are non-sensitive — set them as vars:
npx wrangler pages secret put MAIL_FROM          # or as a [vars] entry
```

For local development, copy `.dev.vars.example` to `.dev.vars` and fill
in the values.

---

## 6. Optional hardening

### Turnstile (challenge before submit)

1. Create a Turnstile site at
   <https://dash.cloudflare.com/?to=/:account/turnstile>.
2. Copy the **site key** into `manifest.json` (add a top-level
   `turnstile.site_key` entry; mirror in `INLINE_MANIFEST`) and render
   the Turnstile widget in the proposal module above the send button.
   Pass the resulting token in the `turnstileToken` field of the POST.
3. Set the **server secret** with `wrangler secret put TURNSTILE_SECRET`.

When `TURNSTILE_SECRET` is present `grant-submit.ts` will reject any
request whose token fails verification.

### KV rate limiter (1 submission / IP / 5 min)

```bash
npx wrangler kv:namespace create GRANT_RL
```

Copy the printed `id` into the `[[kv_namespaces]]` block in
`wrangler.toml` (uncomment first). With the binding present,
`grant-submit.ts` will write a 5-minute TTL key on every successful
submission and return `429` on a follow-up from the same IP.

### Cloudflare Access in front of the system log

If you want the footer's "system log" drawer gated behind SSO, put the
deployed site behind Cloudflare Access. The drawer itself is purely a
client-side toggle — gating happens at the edge.

---

## 7. Local development

```bash
cd cloudflare
npm install
# Build the static site once so wrangler has something to serve.
npm --prefix .. run build
npx wrangler pages dev ../dist --compatibility-date=2025-04-01
```

Wrangler will serve the static `dist/` directory plus the Functions in
`cloudflare/functions/`. Hit `http://localhost:8788/api/grant-submit`
with a POST to test.

---

## 8. Migrating the OpenAI key off the static bundle

Once `/api/concierge` is deployed and reachable:

1. Set `manifest.orchestration.proxy_endpoint` (in
   `public/manifest.json` **and** `INLINE_MANIFEST` inside
   `index.html`) to the deployed URL, e.g.
   `https://api.dascient.com/api/concierge`.
2. Delete the `__OPENAI_API_KEY__` string from `vite.config.js` and the
   `injectOpenAIKey` plugin (or leave the plugin and remove only the
   key — the placeholder will collapse to an empty string and the
   front-end will silently use the proxy).
3. Remove the `OPENAI_API_KEY` repository secret from GitHub Actions.
4. Rotate the OpenAI key — anything that ever shipped in a static
   bundle should be assumed compromised.

The front-end already prefers `proxy_endpoint` over the build-time key
(`specialistRunOpenAI` in `index.html`), so the migration can roll out
without a content change.
