This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Prisma Setup

This project is configured with Prisma and Neon PostgreSQL.

1. Ensure your env file contains:

```bash
DATABASE_URL="postgresql://USER:PASSWORD@HOST/DB_NAME?sslmode=require&channel_binding=require"
JWT_SECRET="replace-with-a-64-char-random-secret"
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="change-this-password"
AUTH_COOKIE_SECURE="true"
```

Set `AUTH_COOKIE_SECURE="false"` only when your production host is HTTP (for example direct IP without TLS).

2. Run migration:

```bash
npm run prisma:migrate -- --name init
```

3. Regenerate client after schema changes:

```bash
npm run prisma:generate
```

4. Open Prisma Studio:

```bash
npm run prisma:studio
```

Use the shared Prisma client from `lib/prisma.ts`.

## Auth Flow

- Login is handled by `POST /api/auth/login`.
- On success, the server sets an `httpOnly` JWT cookie.
- `middleware.ts` checks the JWT for `/dashboard` routes and redirects unauthenticated users to `/login`.
- Logout is handled by `POST /api/auth/logout`, which clears the auth cookie.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
