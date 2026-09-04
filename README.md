# Algorithmius

Algorithmius is a dark-only multilingual algorithm repository built for Next.js App Router, Supabase PostgreSQL/Auth, next-intl, Shiki, Tailwind CSS, Zod, and Font Awesome.

## Stack

- Next.js 16 App Router
- React 19 + strict TypeScript
- Tailwind CSS 4
- Supabase PostgreSQL + Supabase Auth + RLS
- next-intl with `en`, `ru`, and `uz`
- Shiki syntax highlighting
- Zod server-side validation
- Font Awesome icons

## Routes

The application uses mandatory locale-prefixed routes:

```text
/en
/ru
/uz
/en/about
/ru/about
/uz/about
/en/algorithms/[slug]
/ru/algorithms/[slug]
/uz/algorithms/[slug]
/en/admin/login
/ru/admin/login
/uz/admin/login
/en/admin
/ru/admin
/uz/admin
```

`proxy.ts` handles locale routing and refreshes the Supabase SSR session cookies. The protected admin route group performs a server-side role check before rendering, and every mutation action performs its own check as well.

## Local setup

Prerequisites: Node.js 20.19+ and npm 10+, plus a Supabase project.

1. Install dependencies:

```bash
npm install
```

2. Create `.env.local` from `.env.example` and set the values for your Supabase project and deployment origin. Never put a service-role key in the frontend or `.env.example`.

3. Run the SQL migrations in order from `supabase/migrations/`. The baseline migration creates the production schema; `0002_algorithm_code_versions.sql` migrates legacy single-code installations; `0003_hardening.sql` adds the search indexes and transactional code-replacement RPC used by admin updates.

4. Optionally run `supabase/seed.sql` for sample algorithms.

5. Create an initial user in Supabase Authentication. Then grant that user's existing Auth account the `admin` application role:

```sql
insert into public.profiles (id, role)
select id, 'admin'::public.app_role
from auth.users
where email = 'YOUR_ADMIN_EMAIL'
on conflict (id) do update set role = 'admin'::public.app_role;
```

The application never contains a shared administrator password and never stores passwords in `profiles`. Supabase Auth owns password storage and verification.

6. Start the application:

```bash
npm run dev
```

## Algorithms and code implementations

Each algorithm stores localized titles/descriptions plus child rows in `algorithm_code_versions`. Supported languages are C++, Python, JavaScript, TypeScript, Java, Go, and Rust. Python is required by the admin form and is selected by default on the public detail page. Additional languages are optional and appear only when code exists.

The public code selector pre-renders Shiki-highlighted implementations on the server and switches between them on the client, so changing language does not require a page navigation.

## Search

Search is handled by the server and Supabase/PostgREST. It searches the title and description for the current locale, strips unsupported filter characters, limits input length, and uses PostgreSQL trigram indexes defined in the migration. The client debounces updates to the URL using Next.js client navigation.

## Security

- Supabase publishable credentials are the only Supabase credentials used by the browser.
- RLS is enabled for all application tables.
- Public users can read published algorithms and their code only.
- Admin-only inserts, updates, and deletes are enforced both by server-side role checks and RLS.
- Admin code replacement is transactional through a PostgreSQL function that independently checks the admin role.
- Server Actions validate all input with Zod.
- No plaintext passwords or hardcoded authentication secrets exist in source control.
- Shiki escapes source code before it is injected into the code viewer.
- Security headers are applied in `proxy.ts`.

## Verification

Run the same commands used for deployment checks:

```bash
npm run typecheck
npm run build
```

For local browser verification, test locale switching, search, algorithm pages, the seven code-language options, admin login/logout, and CRUD operations using a real Supabase project.

## Vercel

Set these environment variables in Vercel:

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
NEXT_PUBLIC_SITE_URL
NEXT_PUBLIC_TELEGRAM_URL
```

Run the database migrations in the production Supabase project, create/promote an Auth admin account, and deploy.
