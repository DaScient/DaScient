# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## OpenAI fallback (build-time injected key)

When the on-device WebLLM engine is not engaged (or fails), the runtime can
fall back to streaming completions from the OpenAI Chat Completions API. The
key is provided to the build via the `OPENAI_API_KEY` environment variable
and substituted into `index.html` by the `transformIndexHtml` plugin in
`vite.config.js`. If the variable is unset, the placeholder collapses to an
empty string and the OpenAI fallback stays disabled — the deterministic
synthesis path remains the default.

In CI, the deploy workflow (`.github/workflows/deploy.yml`) reads
`secrets.OPENAI_API_KEY` from the repository's GitHub Actions secrets and
passes it to `npm run build`.

> ⚠️ **Security caveat.** Anything injected at build time ships in the
> public static bundle and is readable by any visitor of the deployed site.
> Only use this path with a key that is **origin-restricted and
> rate-limited** at the OpenAI dashboard, and treat the exposure as
> explicitly accepted. If those constraints are not acceptable, use a
> server-side proxy or a user-supplied client-side key instead.
