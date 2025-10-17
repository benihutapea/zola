# Copilot / AI agent instructions for Zulu Chat

Target length: ~20–50 lines. Keep edits small and incremental. When in doubt, open the referenced file before editing.

Overview
- Zulu Chat is a Next.js (App Router) chat UI that supports cloud providers (OpenAI, Mistral, Claude, Gemini, etc.) and local models via Ollama. Key runtime pieces live under `app/` (UI + server App Routes) and `lib/` (business logic, model discovery, supabase helpers, provider glue).
- Credits: Originally forked from benihutapea's work.

Where to start
- Read `README.md` for deployment options (cloud, Ollama, Docker). Quick dev: `npm install` then `npm run dev` (uses `next dev --turbopack`).
- Top-level entry: `app/layout.tsx` and `app/layout-client.tsx` (global providers), `app/page.tsx` for the main UI.

Server vs Client patterns
- Server-only code: App Route handlers in `app/api/*` (e.g. `app/api/chat/route.ts`, `app/api/models/route.ts`). These run on the server and use `createClient()` from `lib/supabase/*` where needed.
- Middleware: `middleware.ts` handles auth session updates (via `utils/supabase/middleware.ts`) and CSRF protection for POST/PUT/DELETE requests.
- Client components live inside `app/components` and `components/` and expect browser-safe imports only.
- State management: React Context providers in `lib/*-store/` (chat-store, model-store, user-store, user-preference-store) for client-side state.

Model & provider integration (important)
- Model discovery: `lib/models/*` — static model data under `lib/models/data/*` and dynamic detection for Ollama in `lib/models/data/ollama.ts` (uses `OLLAMA_BASE_URL` and is disabled in production by default).
- Provider mapping and SDK factories: see `lib/openproviders/*` and `lib/openproviders/provider-map` (used by `modelConfig.apiSdk(...)`). Example usage: `app/api/chat/route.ts` calls `modelConfig.apiSdk(apiKey, { enableSearch })` and streams via `streamText` from the `ai` SDK.
- Adding a new provider: add mapping in `lib/openproviders` and register models in `lib/models/data` (or make them discoverable via the Ollama detection flow).
- MCP (Model Context Protocol) support: helpers in `lib/mcp/` for loading MCP servers from local config or URLs (work in progress).

Secrets and user keys
- Environment keys are consulted in `lib/user-keys.ts` (fallbacks) and per-user encrypted keys are stored in Supabase `user_keys` (see `lib/encryption.ts` and `lib/user-keys.ts`).
- Important env variables: `OPENAI_API_KEY`, `OPENROUTER_API_KEY`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE`, `OLLAMA_BASE_URL`, `DISABLE_OLLAMA`, `ZOLA_OFFICIAL`, `NEXT_PUBLIC_APP_URL`.

Authentication & session
- Authentication flow: `app/auth/login-page.tsx` -> `lib/api.ts:signInWithGoogle()` -> `app/auth/callback/route.ts` -> redirect to app.
- OAuth handling: Protocol detection for redirects is critical—see `app/auth/callback/route.ts` for edge cases and proxy support.
- Login errors: Enhanced error messages in `app/auth/login-page.tsx` provide more descriptive feedback to users.
- Supabase clients: Browser auth uses `lib/supabase/client.ts`, server endpoints use `lib/supabase/server.ts`, admin operations use `lib/supabase/server-guest.ts`.

Runtime & local dev notes
- Ollama: default endpoint `http://localhost:11434`. Detection lives in `lib/models/data/ollama.ts`. Ollama is intentionally disabled in production builds unless configured.
- Docker with Ollama: `docker-compose -f docker-compose.ollama.yml up` (see `docker-compose.ollama.yml`).
- Many server endpoints assume Supabase is available; local dev can use the `.env.example` values or provide `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

Common edits pattern
- To modify chat behavior: update `app/api/chat/route.ts` and helper functions in `app/api/chat/api.ts` and `app/api/chat/db.ts`.
- To add/update models: edit `lib/models/*` and `lib/models/data/*`. For Ollama changes, update `lib/models/data/ollama.ts`.
- For auth/storage concerns: inspect `lib/supabase/*` and calls to `createClient()` sprinkled through `app/*`.

Tests / CI / build
- Scripts in `package.json`: `dev` (turbopack), `build` (`next build`), `start` (`next start`), `lint` and `type-check` (tsc --noEmit).
- CI workflow: `.github/workflows/ci-cd.yml` — review it if changing env or build steps.

Style & incremental safety
- Keep changes minimal and self-contained. Prefer adding small feature branches and run `npm run build` and `npm run lint` locally.
- When touching server routes, verify with the health endpoint: `GET /api/health` (implemented in `app/api/health/route.ts`).

Examples to reference while coding
- Streamed assistant responses: `app/api/chat/route.ts` (uses `streamText` and `modelConfig.apiSdk(...)`).
- Ollama detection and fallback models: `lib/models/data/ollama.ts` (see `detectOllamaModels()` and `staticOllamaModels`).
- API key resolution: `lib/user-keys.ts` (`getEffectiveApiKey`) — checks per-user encrypted keys then env fallbacks.
- Authentication flow: `app/auth/login-page.tsx` calls `signInWithGoogle()`, which redirects to `app/auth/callback/route.ts`.
- Protocol detection: `app/auth/callback/route.ts` handles various hosting environments and proxy setups.

If anything here is unclear or you need more examples (code paths to change for a given task), tell me which area and I'll expand specific examples or add short recipes.
