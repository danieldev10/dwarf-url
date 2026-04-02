# DwarfURL

DwarfURL is a beginner-friendly URL shortener project built with Next.js and
TypeScript.

The goal of the app is simple:

- users create an account
- users shorten long URLs
- each user sees their own links on a Library page

## What We Have So Far

Right now, the project has a custom landing page and two placeholder routes:

- `app/page.tsx` is the homepage
- `app/create/page.tsx` will become the link creation page
- `app/library/page.tsx` will become the signed-in user library page
- `app/layout.tsx` is the shared wrapper for every page
- `app/globals.css` contains the global styling and theme colors

## Why Next.js?

Next.js is a good fit here because it lets us keep the frontend and backend in
one project.

That means:

- React builds the pages the user sees
- route handlers will let us create backend endpoints
- server-side code can talk to the database
- later we can add auth without splitting the app into two separate repos

## Commands

Run the local development server:

```bash
npm run dev
```

Check for linting issues:

```bash
npm run lint
```

Create a production build:

```bash
npm run build
```

## Next Steps

The next major milestones are:

1. Add Prisma and connect PostgreSQL.
2. Create the database models for `User` and `ShortLink`.
3. Add authentication.
4. Build the form that creates short links.
5. Build the Library page that shows each user's saved links.
6. Add the redirect route for short slugs.
