import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Build-time injection of OPENAI_API_KEY into index.html.
//
// The runtime engine in index.html is a classic (non-module) inline script,
// so Vite's `define` substitution does not apply to it. Instead, we run an
// HTML transform that replaces the literal placeholder `__OPENAI_API_KEY__`
// with the value of the OPENAI_API_KEY environment variable at build time
// (e.g. supplied by a GitHub Actions secret).
//
// SECURITY CAVEAT: anything baked in here is readable by any visitor of
// the deployed site. This path is only acceptable for keys that are
// restricted/rate-limited to the deployed origin, and the exposure is
// explicitly accepted. When OPENAI_API_KEY is unset the placeholder is
// replaced with an empty string, which disables the OpenAI fallback at
// runtime.
function injectOpenAIKey() {
  const key = process.env.OPENAI_API_KEY || ''
  return {
    name: 'dascient-inject-openai-key',
    transformIndexHtml(html) {
      return html.split('__OPENAI_API_KEY__').join(key)
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), injectOpenAIKey()],
  base: '/',
})
