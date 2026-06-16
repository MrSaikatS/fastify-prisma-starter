# fastify-prisma-starter

A production-ready starter template for building REST APIs with [Fastify](https://fastify.dev/) and [Prisma](https://www.prisma.io/), featuring TypeScript, autoloaded plugins/routes, and SQLite via LibSQL.

## Features

- **Fastify 5** — high-performance Node.js HTTP framework
- **Prisma 7** — type-safe database ORM with SQLite (via LibSQL adapter)
- **TypeScript 6** — fully typed, strict mode
- **Auto-loading** — plugins and routes auto-register via `@fastify/autoload`
- **TypeBox** — schema validation with `@fastify/type-provider-typebox`
- **Logger** — `pino-pretty` in development, `@fastify/one-line-logger` in production
- **Error handling** — `@fastify/sensible` for HTTP error utilities

## Getting started

### Prerequisites

- [Bun](https://bun.sh/) (v1.x or later)
- Node.js 20+

### Install

```bash
git clone https://github.com/MrSaikatS/fastify-prisma-starter.git
cd fastify-prisma-starter
bun install
```

### Environment

Copy the example env file and adjust as needed:

```bash
cp .env.example .env
```

### Database

Run the initial migration and generate the Prisma client:

```bash
bun run migrate
```

### Development

Start the dev server with TypeScript watch + Node hot-reload:

```bash
bun run dev
```

The server starts at **http://localhost:3000**.

## Scripts

| Command | Description |
|---------|-------------|
| `bun run dev` | Build + watch TypeScript and Node concurrently |
| `bun run build` | Generate Prisma client and compile TypeScript |
| `bun run start` | Start the production server from `build/` |
| `bun run migrate` | Run Prisma migrations and regenerate client |

## Project structure

```
src/
├── index.ts             # Entrypoint — creates Fastify instance
├── plugins/             # Auto-loaded Fastify plugins
│   ├── prisma.ts        # Prisma client connection (decorates fastify.prisma)
│   ├── sensible.ts      # HTTP error utilities (@fastify/sensible)
│   └── support.ts       # Example decorator plugin
└── routes/              # Auto-loaded route modules
    └── root.ts          # GET / endpoint
prisma/
└── schema.prisma        # Prisma schema (SQLite)
```

- Add a `.ts` file to `src/plugins/` or `src/routes/` and it auto-registers — no manual imports needed.
- Routes use `FastifyPluginAsyncTypebox` for type-safe schema validation.

## Tech stack

- **Runtime:** [Bun](https://bun.sh/)
- **Framework:** [Fastify](https://fastify.dev/) 5
- **ORM:** [Prisma](https://www.prisma.io/) 7 with `@prisma/adapter-libsql`
- **Database:** SQLite (via [Turso/LibSQL](https://github.com/tursodatabase/libsql))
- **Validation:** [TypeBox](https://github.com/sinclairzx81/typebox) via `@fastify/type-provider-typebox`
- **Language:** TypeScript 6 (ESM, ES2023 target)

## License

[MIT](LICENSE)
