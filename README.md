# DwarfURL

DwarfURL is a URL shortener project built with Next.js, TypeScript, Prisma, custom auth, and Supabase-hosted Postgres.

## Current Status

The project now has:

- a landing page
- a hosted PostgreSQL database connected through Prisma
- custom email and password auth managed by the app itself
- a working create-link form
- a protected library page that lists each user's links
- dynamic short-code redirects with click counting

## Required Environment Variables

Database connections:

- `DATABASE_URL` for the pooled runtime database connection
- `DIRECT_URL` for Prisma CLI commands like migrations

Optional app URL:

- `APP_URL` if you want to force a specific base URL when displaying short links

## Useful Commands

Generate the Prisma client:

```bash
npm run prisma:generate
```

Start the Next.js app:

```bash
npm run dev
```
