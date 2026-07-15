# Digital Vision

Digital Vision is a full-stack portfolio and owner-managed content platform for a Cape Town web studio serving businesses across South Africa. It includes a fast public site, a private owner dashboard, Supabase-backed projects/media/settings, and a contact inbox.

The public site intentionally starts without invented client logos, outcomes, project images, prices, testimonials, address, phone number, or compliance claims. Add only approved information through the owner workspace.

## Stack

- Next.js 16 App Router and TypeScript
- Original CSS design system with responsive public and owner experiences
- Supabase: Postgres, Auth, private Storage, Row Level Security
- Vercel Web Analytics, opt-in by deployment environment variable
- Zod validation, server-side actions, security headers, Vitest, and Playwright

## Run Locally

Requirements: Node.js 24+ and npm 11+.

```powershell
npm install
Copy-Item .env.example .env.local
npm run dev
```

Open `http://localhost:3000`.

The public site renders its content-safe fallback without Supabase. The inquiry form and owner dashboard need the environment variables and schema below.

## Supabase Setup

1. Create a Supabase project in the closest suitable region for the business and clients.
2. In Supabase SQL Editor, run [supabase/migrations/202607150001_initial_schema.sql](supabase/migrations/202607150001_initial_schema.sql).
3. In Authentication, create the single owner user manually. Do not enable public signup for this site.
4. Insert the owner profile, replacing the placeholders with the created Auth user ID and owner email:

```sql
insert into public.profiles (id, email, role)
values ('AUTH_USER_UUID', 'owner@example.com', 'owner');
```

5. Copy the project URL, Publishable key, and server-only Service Role key into `.env.local`:

```dotenv
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=YOUR_PUBLISHABLE_KEY
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY
NEXT_PUBLIC_SITE_URL=http://localhost:8080
NEXT_PUBLIC_VERCEL_ANALYTICS_ENABLED=false
```

Never expose `SUPABASE_SERVICE_ROLE_KEY` to the browser or commit `.env.local`.

### Storage and Access

The migration creates a private `project-media` bucket. Owners can upload JPEG, PNG, or WebP files up to 10 MB. The public site only receives short-lived signed URLs for images attached to a **published** project; drafts and their media remain private.

Row Level Security is enabled on every application table. Public users can only read published public content. Inquiry inserts use a validated server action and the server-only service role key; the inbox is never publicly readable.

### Owner Login

After Supabase is configured and the profile row exists, sign in at `/admin/login`. This is an owner-only workspace. It supports:

- Project drafts, publication, client-safe case-study fields, and image upload/removal
- Services and public pricing guidance
- Global tagline/contact settings and reviewed privacy content
- Private inquiry status and notes

Publishing a project or content change revalidates the relevant public paths.

## Content Workflow

1. Add global business details in **Admin > Settings**.
2. Add genuine services and only approved starting-price guidance.
3. Create a project as a draft, write the context/approach/outcome, then upload approved images with useful alternative text.
4. Select **Published** only after the client and result details have permission to appear publicly.
5. Review inquiries in **Admin > Inquiries**. Version one stores submissions in the dashboard; it does not send automatic email.

## Privacy and Analytics

The editable privacy page is a publishing surface, not legal advice. Before a public launch, have the business or legal reviewer confirm that it accurately explains the contact form, data retention, analytics, and data-subject contact method under the applicable POPIA requirements.

Vercel Web Analytics is disabled by default. Enable it only after this review:

```dotenv
NEXT_PUBLIC_VERCEL_ANALYTICS_ENABLED=true
```

Set the same variable in Vercel and redeploy. The dashboard checkbox is a publication-review indicator; the deployment variable is the technical control that loads analytics.

## Quality Checks

```powershell
npm run lint
npm run typecheck
npm run test
npm run build
npm run test:e2e:install
npm run test:e2e
```

`test:e2e:install` downloads Chromium for Playwright the first time. Browser tests use the no-credentials local mode and verify public navigation, inquiry fallback behavior, and owner-route redirection.

## Deploy to Vercel

1. Push this project to a private Git repository.
2. Import it in Vercel as a Next.js project.
3. Add the production environment variables from `.env.example` in Vercel Project Settings.
4. Set `NEXT_PUBLIC_SITE_URL` to the final canonical `https://` domain.
5. Configure that domain in Supabase Authentication URL Configuration: Site URL and allowed redirect URLs should include the production domain and local development URL as needed.
6. Enable MFA for the Supabase owner account.
7. Complete the pre-launch checklist below, then deploy.

## Pre-Launch Checklist

- [ ] Production Supabase migration applied and owner profile created
- [ ] Owner MFA enabled
- [ ] Supabase and Vercel environment variables configured
- [ ] Real public contact details entered where appropriate
- [ ] All published projects, screenshots, logos, testimonials, and results are authorized
- [ ] Published privacy content has business/legal approval
- [ ] Analytics remains disabled or is disclosed accurately
- [ ] Public form, owner login, draft visibility, publish flow, and media upload have been manually verified
- [ ] `npm run lint`, `npm run typecheck`, `npm run test`, `npm run build`, and `npm run test:e2e` pass

## Project Layout

- `src/app` - public routes, owner routes, server actions, metadata, and shared styles
- `src/components` - semantic public/admin interface and forms
- `src/lib/content` - typed public content data and content-safe local defaults
- `src/lib/supabase` - public, server-session, and server-only clients
- `src/lib/admin.ts` - server-side owner authorization and dashboard data access
- `src/proxy.ts` - Supabase session refresh and baseline response security headers
- `supabase/migrations` - schema, indexes, private storage, and RLS policies
- `tests` - unit and browser coverage
