# Wide Wings Media — Website Overview & Status

_Living reference for the `wwm2-nextjs` project. Last reviewed: 2026-08-31._

Wide Wings Media (wide-wings.ae) is a full‑service digital marketing agency site
based in Dubai, UAE. This repo is a **Next.js 16.2.9 / React 19** rebuild of the
legacy `wide-wings.ae` site, designed so the domain can cut over to this project
with search rankings intact (URLs, trailing slashes, canonicals, and JSON‑LD were
scraped from the old site and matched).

---

## 1. Tech stack

| Area | Choice |
|---|---|
| Framework | Next.js `16.2.9`, App Router, `trailingSlash: true` |
| UI | React `19.2.4`, no component library — hand‑rolled CSS per page (`*.css` co‑located) |
| Styling | Tailwind v4 (`@tailwindcss/postcss`) available + `app/globals.css`; most pages use bespoke CSS files |
| Persistence | **Vercel KV** (`@vercel/kv`) for admin overrides; **Neon Postgres** (`@neondatabase/serverless`) for chat analytics; in‑memory + file fallback for local dev |
| Doc parsing | `mammoth` (docx→HTML) + `cheerio` for the blog upload flow |
| Scraping tooling | `puppeteer`, `jsdom`, `@mozilla/readability` (dev only, `scripts/`) |
| Hosting | Vercel (implied); `npm run dev` on port 3000 (`.claude/launch.json`) |

**Important:** `AGENTS.md` warns this Next.js version has breaking changes vs.
training data — check `node_modules/next/dist/docs/` before writing framework code.

---

## 2. Routing & URL model

- `trailingSlash: true` → every canonical URL ends in `/`.
- Service pages live at `app/services/<slug>/` but are served at **root level**
  via `next.config.ts` rewrite: `/branding-agency-dubai/` → `/services/branding-agency-dubai`.
  `/services/:slug` and `/services` are 301'd to the root‑level slug.
- Blog posts are served at **root level** too: fallback rewrite `/:slug` → `/blogs/:slug`.
  `/blogs` → 301 `/insights/`; `/blogs/:slug` → 301 `/:slug/`.
- Legacy/pre‑launch slugs are 301‑mapped in `next.config.ts` `LEGACY_SERVICE_REDIRECTS`
  (e.g. `/creative-branding` → `/branding-agency-dubai/`).
- `middleware.ts`:
  - injects `x-pathname` header (root layout reads it to hide chrome on `/admin` + `/leadsheet`);
  - gates `/admin/*` behind the cookie session (`wwm_admin`), redirecting to `/admin/login/`;
  - gates `/leadsheet/*` behind **HTTP Basic Auth** (`LEADSHEET_USER` / `LEADSHEET_PASSWORD`).

### Public pages

| URL | Source | Notes |
|---|---|---|
| `/` | `app/page.tsx` | Home — hero, services flip text, about, success‑story slider (client component, heavy parallax JS) |
| `/digital-marketing-services/` | `app/digital-marketing-services/page.tsx` | Services index — 10 services listed |
| `/<service-slug>/` ×10 | `app/services/<slug>/page.tsx` | Individual service pages (see list below) |
| `/about-us/` | `app/about-us/page.tsx` | Team roster pulled from `/api/team` (KV override → `lib/team-defaults.ts`) |
| `/insights/` | `app/insights/page.tsx` | Blog listing (`revalidate = 300`); reuses `app/blogs/BlogsClient.tsx` |
| `/<blog-slug>/` ×57+ | `app/blogs/[slug]/page.tsx` | Post pages, `revalidate = 0`; body HTML from KV, FAQ accordion, schema |
| `/news/` | `app/news/page.tsx` | Press mentions (hardcoded `NEWS` array); **noindex, nofollow** |
| `/case-studies/` | `app/case-studies/page.tsx` | Index of 5 case studies |
| `/case-studies/<slug>/` ×5 | `app/case-studies/<slug>/page.tsx` | zaina-cafe, saudi-german-hospital, al-sobh-hospital, make-a-wish-saudi-arabia, batterjee-properties |
| `/contact/` | `app/contact/page.tsx` | Lead form → `POST /api/contact` |
| `/contact/thank-you/` | post‑submit page | **noindex** |
| `/privacy-policy/`, `/terms-conditions/` | legal pages | `/privacy`, `/terms`, `/about` → 301 to the `-policy`/`-conditions`/`-us` versions |
| `/leadsheet/` | `app/leadsheet/page.tsx` | Standalone unlinked lead capture, Basic‑Auth gated, submissions tagged `source: 'leadsheet'` |
| `/robots.txt`, `/sitemap.xml`, `/llms.txt` | `app/robots.ts`, `app/sitemap.ts`, `app/llms.txt/route.ts` | All gated by `NEXT_PUBLIC_SITE_LIVE` |

**10 services** (root slugs): `web-design-company-dubai`, `branding-agency-dubai`,
`ppc-advertising-company-dubai`, `social-media-marketing-agency-in-dubai`,
`content-creation-graphic-design`, `email-marketing-dubai`, `seo-services-dubai`,
`outdoor-advertising-dubai`, `analytics-performance-marketing`, `pr-agency-dubai`.

### Global chrome (`app/layout.tsx`)

Header, Footer, `ScrollReveal`, sitewide JSON‑LD (`SITEWIDE_SCHEMA`), floating
WhatsApp button (`wa.me/971555657609`), and `ChatWidget` — all hidden on `/admin`
and `/leadsheet`. Header nav: Home / Services / About Us / Blogs / News / Contact Us.

---

## 3. SEO system

- `lib/seo.ts` — `SITE_URL = 'https://wide-wings.ae'`; `getPageMetadata(pageId)`
  resolves **KV override → hardcoded default in `lib/admin/store.ts`** → Next `Metadata`.
- `lib/admin/store.ts` — hardcoded `pages[]` + `seoData[]` (meta titles/descriptions
  scraped from the legacy site) + `BLOG_SEO{}` per‑post overrides + `blogSeoDefault()`.
- `lib/schema.ts` — JSON‑LD. `SITEWIDE_SCHEMA` (Organization, rendered once in layout);
  `CUSTOM_SCHEMA{}` hand‑authored graphs for new/rewritten posts; `getPageSchema(key)`
  falls back to scraped `lib/seo/old-site-data.json`.
- `lib/schema-builder.ts` — builds BlogPosting+Breadcrumb+FAQ graph for admin‑uploaded posts.
- `components/SchemaScripts.tsx` — renders page‑level `<script type="application/ld+json">`.
- Sitemap/robots/llms.txt only emit real content when `NEXT_PUBLIC_SITE_LIVE === 'true'`
  (prevents the preview deployment from being indexed).

---

## 4. Admin panel (`/admin`)

Cookie‑session auth (`lib/admin/auth.ts`): HMAC‑signed token in `wwm_admin` cookie,
PBKDF2‑SHA256 password hashing. **3 roles**, each a single shared login:

| Role | Sees |
|---|---|
| `webadmin` | everything |
| `seo` | Dashboard, SEO Manager, Media Library, Account |
| `enquiry` | Dashboard, Enquiries, Account |

Default creds are env‑overridable (`WEBADMIN_USER/PASS`, `SEO_*`, `ENQUIRY_*`,
`ADMIN_SECRET`); passwords can be rotated in‑app (`/admin/account` → stored hashed in KV `admin-pw:<role>`).

### Admin sections

| Route | Role | Function |
|---|---|---|
| `/admin/login` | — | Login form → `POST /api/admin/login` |
| `/admin/dashboard` | all | Stats (pages, blogs, enquiries, SEO configured), quick actions, recent enquiries |
| `/admin/pages` | webadmin | CRUD the `pages` list → `/api/admin/pages` |
| `/admin/seo` | seo, webadmin | Per‑page meta/OG/schema/robots editor; 301/302 redirect manager (+ `.htaccess` generator); live robots.txt / llms.txt / sitemap viewer → `/api/admin/seo`, `/api/admin/redirects`, `/api/admin/seo-tools` |
| `/admin/blogs` | webadmin | **Blog Content Editor** — paste/publish HTML body per post (KV `blog:<slug>`); **Blog Visibility list** — hide/show toggle (KV `blog:hidden-slugs`) |
| `/admin/blogs/new` | webadmin | Upload a filled‑in Wide Wings `.docx` template → parsed (`lib/blog-docx-parser.ts`) → preview → publish (KV `newpost:*` via `new-posts-kv.ts`), no code push needed |
| `/admin/media` | webadmin, seo | Media Library — client‑side image compression, alt text/keywords, data‑URI storage (in‑memory `store.media`) |
| `/admin/team` | webadmin | Team Manager for the About Us roster — reorder/add/remove, client‑side photo resize → KV `settings:team` |
| `/admin/enquiries` | enquiry, webadmin | View/mark‑read enquiries; configure Google Sheets sync (Apps Script webhook, "Website Leads" / "Direct Leads" tabs) |
| `/admin/chat-analytics` | webadmin | ChatWidget funnel — sessions, opens, clicks, top options, daily/weekly/monthly buckets |
| `/admin/account` | all | Change own password |

### API routes (`app/api/`)

- Public: `POST /api/contact` (enquiry + Google Sheets mirror), `GET /api/team`,
  `POST /api/admin/chat-analytics` (ChatWidget event ingest — public write),
  `GET /api/admin/blog-content` (public read of published body).
- Admin (session‑gated): `login`, `logout`, `session`, `change-password`,
  `pages`, `seo`, `seo-tools`, `redirects`, `blog-upload`, `blog-publish`,
  `blog-visibility`, `media`, `team`, `enquiries`, `settings`, `chat-analytics`.

### Persistence keys

| Store | Backend | Key(s) |
|---|---|---|
| SEO overrides | KV | `seo:<pageId>` |
| Blog body HTML | KV | `blog:<slug>` |
| Admin‑uploaded posts | KV | via `new-posts-kv.ts` |
| Hidden blog slugs | KV | `blog:hidden-slugs` |
| Redirect overrides | KV | `redirects:all` |
| Password overrides | KV | `admin-pw:<role>` |
| Team roster | KV | `settings:team` |
| Google Sheets settings | KV + file | `settings:google-sheets` |
| Chat events | Neon Postgres (`chat_events`) + file fallback | — |
| Pages / enquiries / media | **in‑memory only** (`lib/admin/store.ts`) — reset on redeploy | — |

---

## 5. Content model

- **Blog posts** = `app/blogs/posts-data.ts` `POSTS[]` (57 hardcoded, slug/title/excerpt/
  category/image/cta/optional `publishAt`) **merged** with KV posts via
  `lib/admin/all-posts.ts`. `publishAt` in the future → post 404s + excluded from
  listings/sitemap until that time (no deploy needed). Body HTML comes from KV;
  `PAGE_TITLES` / FAQ / schema layered on in `[slug]/page.tsx`.
- **Case studies** = `app/case-studies/cases-data.tsx` `CASE_STUDIES[]` (5 entries)
  + rich per‑page components (`CaseHero`, `CaseGallery`, `CaseVideoGallery`,
  `CaseDonut`, `ShatterSlideshow`, etc.).
- **Team** = `lib/team-defaults.ts` `DEFAULT_TEAM` (fallback) → KV override.
- **News** = hardcoded `NEWS[]` in `app/news/page.tsx` (external article links).

---

## 6. `scripts/` (dev tooling, not shipped)

One‑off Node scripts + saved HTML for the blog migration: `scrape-old-site-seo.mjs`
(populates `lib/seo/old-site-data.json`), `fetch-blog.js`, `html-to-jsx.js`,
`normalize-blogs.mjs`, `batch-upload-blogs.mjs`, `publish-blog.mjs`,
`upload-*.mjs`, plus `<topic>-page.html` snapshots of legacy post bodies.

---

## 7. Status — what has been done

### ✅ Complete

- **Full public site rebuilt**: home, services index + 10 service detail pages,
  about‑us (dynamic team), insights/blog listing, 57 blog posts, news, 5 case
  studies + index, contact + thank‑you, privacy, terms, leadsheet.
- **URL / SEO migration to `wide-wings.ae`**: canonical base + sitemap pointed at
  the domain; trailing slashes; legacy slug 301s; orphan old‑site link redirects;
  3 service URLs renamed for SEO (2026‑07‑25); JSON‑LD scraped & matched from old site.
- **Admin panel** with 3 roles: Dashboard, Pages, SEO Manager (+ redirect manager +
  .htaccess generator + robots/llms/sitemap viewer), Blog Content Editor, Blog
  visibility toggle, **docx‑upload blog publishing flow**, Media Library, Team
  Manager, Enquiries + Google Sheets sync, Chat Analytics, Account/password rotation.
- **Lead capture**: `/contact` + standalone Basic‑Auth `/leadsheet`, both → in‑app
  store + optional Google Sheets (separate "Website Leads" / "Direct Leads" tabs).
- **ChatWidget** with analytics pipeline (Neon Postgres) and admin dashboard.
- **Scheduled blog publishing** via `publishAt` (auto‑goes‑live, sitemap re‑checks every 5 min).
- **Pre‑launch guard**: `NEXT_PUBLIC_SITE_LIVE` gates robots/sitemap/llms.txt so the
  preview deploy stays unindexed.
- Recent polish: homepage heading structure (a11y), dead‑link fixes, mobile
  case‑study cards, admin dark‑theme colours & horizontal overflow, 4 new
  client‑docx blog posts with real featured images, several 2026 post rewrites.

### 🚧 In progress / known gaps

- **Case study body content** (per memory): Zaina Cafe & Saudi German Hospital
  done; **SBK Properties / Batterjee still has placeholder body** (route renamed
  `sbk-properties` → `batterjee-properties`, old URL 301'd).
- **SEO Manager new‑page wiring** (per memory): brand‑new static pages need a
  manual 2‑step wiring; case‑study pages are not yet covered by the SEO Manager.
- **`store.ts` pages/enquiries/media are in‑memory** — lost on redeploy. Enquiries
  survive only if Google Sheets sync is configured; the seeded `enquiries[]` are demo data.
- **Site not yet publicly live** — `NEXT_PUBLIC_SITE_LIVE` still gating; old
  `widewings` project is fallback only (per memory, domain is now live on wwm2026 —
  verify which project is actually serving before launch changes).
- Default admin credentials are committed as fallbacks in `lib/admin/auth.ts` /
  `middleware.ts` — confirm all `*_USER` / `*_PASS` / `ADMIN_SECRET` /
  `LEADSHEET_*` env vars are set in production.

### 📋 Not started / future

- Arabic / bilingual version (frequently referenced as a UAE need in blog content, not built).
- Real DB for pages/media/enquiries (store.ts comment: "replace with Supabase/Neon").
- Newsletter / email capture beyond the contact form.

---

## 8. Environment variables

| Var | Purpose |
|---|---|
| `NEXT_PUBLIC_SITE_LIVE` | `'true'` enables robots/sitemap/llms.txt real output |
| `KV_*` (Vercel KV) | SEO/blog/team/redirect/password overrides |
| `DATABASE_URL` | Neon Postgres for chat analytics (file fallback if unset) |
| `ADMIN_SECRET` | HMAC signing key for session tokens |
| `WEBADMIN_USER` / `WEBADMIN_PASS` | webadmin login |
| `SEO_USER` / `SEO_PASS` | seo login |
| `ENQUIRY_USER` / `ENQUIRY_PASS` | enquiry login |
| `LEADSHEET_USER` / `LEADSHEET_PASSWORD` | Basic Auth for `/leadsheet` |
