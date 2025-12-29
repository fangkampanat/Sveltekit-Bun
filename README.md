# SvelteKit + Bun Template

A production-ready SvelteKit template with Bun runtime, SQLite database, and stateless authentication.

## Tech Stack

- **Framework**: SvelteKit + `svelte-adapter-bun`
- **Database**: `drizzle-orm/bun-sqlite`
- **Auth**: `Bun.password` (Argon2id) + HMAC Signed Cookies
- **Frontend**: Bootstrap 5 (Dark mode)
- **Font**: Google Sans
- **Icons**: Bootstrap Icons
- **Notifications**: svelte-sonner

## Quick Start

```bash
# Install dependencies
bun install

# Push database schema
bun run db:push

# Seed database with admin user
bun run db:seed

# Start development server
bun run dev
```

## Environment Variables

Create a `.env` file:

```env
DATABASE_URL=local.db
AUTH_SECRET=your-secret-key-min-32-characters-here
```

> In development mode, `AUTH_SECRET` is optional and auto-login is enabled.

## Scripts

| Command               | Description                  |
| --------------------- | ---------------------------- |
| `bun run dev`         | Start development server     |
| `bun run build`       | Build for production         |
| `bun run preview`     | Preview production build     |
| `bun run check`       | Type check with svelte-check |
| `bun run db:push`     | Push schema to database      |
| `bun run db:seed`     | Seed database                |
| `bun run db:generate` | Generate migration files     |
| `bun run db:migrate`  | Run migrations               |
| `bun run db:studio`   | Open Drizzle Studio          |

## License

MIT
