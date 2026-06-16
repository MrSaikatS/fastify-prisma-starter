# fastify-prisma-starter — AGENTS.md

## Package manager

Uses **Bun** (lockfile `bun.lock`). Install with `bun install`, not npm.

## Dev commands

| Command | What it does |
|---------|-------------|
| `bun run dev` | Builds TS, then watches `tsc --watch` and `node --watch build/index.js` concurrently |
| `bun run build` | `prisma generate && tsc -p tsconfig.json` — outputs to `build/` |
| `bun run start` | `node build/index.js` (production start, no watch) |
| `bun run migrate` | `prisma migrate dev && prisma generate` |

No lint, format, test, or typecheck scripts exist.

## Architecture

- **Entrypoint:** `src/index.ts` — creates Fastify instance, registers autoload for `plugins/` then `routes/`.
- **Plugins** (`src/plugins/`): Auto-loaded. Use `fastify-plugin` wrapper; augment `FastifyInstance` for decorator types (see `support.ts`).
- **Routes** (`src/routes/`): Auto-loaded. Subdirectories with `index.ts` become route modules. Export a Fastify plugin as default. Currently only `root.ts` (GET `/`).
- **Type patterns:** Routes use `FastifyPluginAsyncTypebox` (from `@fastify/type-provider-typebox`) for schema validation.
- **Logger:** `NODE_ENV=production` uses `@fastify/one-line-logger`; otherwise `pino-pretty`.
- **Default port:** `3000` (hardcoded in `src/index.ts:42`; no env var override).
- **Error handling:** `@fastify/sensible` plugin registered for HTTP error utilities.

## Prisma (SQLite + LibSQL adapter)

- **Schema:** `prisma/schema.prisma` — SQLite datasource.
- **Generated client:** Outputs to `src/generated/prisma/client.ts` — import from `src/plugins/prisma.ts` as `"../generated/prisma/client"`.
- **Adapter:** Uses `@prisma/adapter-libsql` (Turso/LibSQL) — requires `DATABASE_URL` env var (e.g. `file:./prisma/dev.db`).
- **Config:** `prisma.config.ts` loads `DATABASE_URL` via `dotenv`.
- **Migrations:** Not yet present — run `bun run migrate` to create initial migration.
- **Gitignore:** `src/generated/` is gitignored (matched by root `.gitignore` pattern `generated`).
- **CLI:** Run `bunx prisma` for ad-hoc Prisma commands.

## Important

- ESM only (`"type": "module"`). Uses `import.meta.url` + `fileURLToPath` for `__dirname`.
- `build/`, `.env*`, and `src/generated/` are gitignored.
- TypeScript: `rootDir: "src"`, `outDir: "build"`, `target: ES2023`, `module: ESNext`, `moduleResolution: bundler`. All generated client code must live under `src/` to satisfy `rootDir`.
- Adding a `.ts` file to `src/plugins/` or `src/routes/` auto-registers it — no manual import needed.

