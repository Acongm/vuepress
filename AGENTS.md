# AGENTS.md

## Cursor Cloud specific instructions

This repo is a **VuePress 2** knowledge-base site ("前端物语") plus zero-dependency Node.js
CLI tooling in `lib/` and `tools/`. Standard commands live in `README.md` and `package.json`
scripts; only the non-obvious startup/run caveats are captured here.

### Node version

- Requires **Node 24.x** (`.nvmrc`, `engines.node`). The VM's default `/exec-daemon/node` is
  Node 22, so the setup made Node 24 the global default via symlinks in `/usr/local/cargo/bin`
  (which precedes `/exec-daemon` in `PATH`). New shells should already resolve `node -v` to
  24.x. If a shell ever reports Node 22, run `nvm use 24` (nvm's default alias is `24`).

### Run / dev

- `npm run dev` starts the Vite dev server. Locally it serves at
  **`http://localhost:8080/vuepress/`** — note the `/vuepress/` base path (the root `/` will 404).
- The site's AI chat/summary widgets call `/api`, which the dev server proxies to the remote
  `https://api.acongm.com` (override with `VUEPRESS_API_PROXY_TARGET`). The site browses and
  searches fully without this backend; only the AI widgets need it. There is no local backend
  in this repo.

### Build

- `npm run build` (`vuepress build docs`) outputs to `vuepress/` (gitignored).
- The Vercel pipeline (`vercel.json`) additionally runs build-time AI summary generation
  (`build:ai:v1`, needs DeepSeek `AI_API_KEY`) and post-build smoke checks. All AI generation
  is optional and degrades gracefully; use `AI_SUMMARY_DRY_RUN=1` to skip provider calls.

### Lint

- `npm run lint` is `prettier --write` and **mutates files**. To check formatting without
  modifying the working tree, run `npx prettier --check "<glob>"` instead.

### Tests

- Unit tests use Node's built-in runner: `npm run test:ai-v1` and `npm run test:ai-client-v1`.
- The smoke tests `npm run smoke:ai` and `npm run smoke:summaries-v1` read the **build output**,
  so run `npm run build` first or they fail with missing-file errors.

### KB tooling

- `npm run kb:stats | kb:query | kb:validate` are read-only. `npm run kb:add <file>` runs the
  full add workflow and can commit to git — pass `-- --dry-run` to preview category
  recommendation + validation without committing.
