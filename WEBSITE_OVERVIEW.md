# Wide Wings Media — Website Overview & Status

_Living reference for the `wwm2-nextjs` project. Last reviewed: 2026-10-16._

Wide Wings Media (wide-wings.ae) is a full‑service digital marketing agency site
based in Dubai, UAE. This repo is a **Next.js 16.2.9 / React 19** rebuild of the
legacy `wide-wings.ae` site. **It is live**: wide-wings.ae is served by Vercel
project `wwm2026-xfyh` (Wide Wings Media team), built from GitHub
`widewingsmedia/wwm2026` branch `main`. URLs, trailing slashes, canonicals and
JSON‑LD were scraped from the old site and matched so rankings carried over.

---

## 1. Tech stack

| Area | Choice |
|---|---|
| Framework | Next.js `16.2.9`, App Router (Turbopack), `trailingSlash: true` |
| UI | React `19.2.4`, no component library — hand‑rolled CSS per page (`*.css` co‑located) |
| Styling | Tailwind v4 (`@tailwindcss/postcss`) available + `app/globals.css`; most pages use bespoke CSS files. Site is **dark‑themed** (bg `#0a0a1a`, gold `#cfa821`, Nexa headings) |
| Persistence | **Vercel KV** (`@vercel/kv`) for admin overrides; **Neon Postgres** (`@neondatabase/serverless`) for chat analytics; in‑memory + file fallback for local dev |
| Doc parsing | `mammoth` (docx→HTML) + `cheerio` for the blog upload flow |
| Scraping tooling | `puppeteer`, `jsdom`, `@mozilla/readability` (dev only, `scripts/`) |
| Hosting | Vercel — **deploys by pushing to `main`** on `widewingsmedia/wwm2026` (auto‑deploy). `npm run dev` on port 3000 (`.claude/launch.json`) |

**Important:** `AGENTS.md` warns this Next.js version has breaking changes vs.
training data — check `node_modules/next/dist/docs/` before writing framework code.

**Pushing:** remote `wwm2026` (= `remote.pushDefault`). `gh auth switch --user widewingsmedia`
→ `git push wwm2026 main` → `gh auth switch --user acubensdigital-hub`. Remotes `wwm`
and `widewings` are fetch‑only (push URL `NO_PUSH`). Don't use the `vercel` CLI for
this project (CLI is logged in to a different team). See `../CLAUDE.md`.

---

## 2. Routing & URL model

- `trailingSlash: true` → every canonical URL ends in `/`.
- Service pages live at `app/services/<slug>/` but are served at **root level**
  via the `beforeFiles` rewrite for every slug in `SERVICE_SLUGS` (`next.config.ts`):
  `/branding-agency-dubai/` → `/services/branding-agency-dubai`.
  `/services/:slug` and `/services` are 301'd to the root‑level slug.
  **A new service slug must be added to `SERVICE_SLUGS`** (and to the dark‑page
  list in `components/Header.tsx`).
- Blog posts are served at **root level** too: fallback rewrite `/:slug` → `/blogs/:slug`.
  `/blogs` → 301 `/insights/`; `/blogs/:slug` → 301 `/:slug/`.
- Redirect maps in `next.config.ts` (config changes need a dev‑server restart):
  - `LEGACY_SERVICE_REDIRECTS` — retired pre‑launch / old slugs (e.g. `/creative-branding`,
    `/content-creation` → `/content-creation-dubai/`).
  - `PAGE_ACTION_REDIRECTS` (**301**, from the Oct 2026 "Website Page Actions" sheet):
    `local-seo-agency-for-startups` → `local-seo-services-dubai`,
    `systematic-search-engine-optimization` → `seo-services-dubai`,
    `reliable-paid-ads-agency-in-dubai` + `ppc-for-ecommerce-dubai` → `ppc-advertising-company-dubai`,
    `content-creation-graphic-design` → `content-creation-dubai`.
- `middleware.ts`:
  - injects `x-pathname` header (root layout reads it to hide chrome on `/admin`,
    `/leadsheet` and the standalone `/home-v4` preview);
  - gates `/admin/*` behind the cookie session (`wwm_admin`), redirecting to `/admin/login/`;
  - gates `/leadsheet/*` behind **HTTP Basic Auth** (`LEADSHEET_USER` / `LEADSHEET_PASSWORD`).

### Public pages

| URL | Source | Notes |
|---|---|---|
| `/` | `app/page.tsx` | Home — hero (animated wing logo), services, about, success‑story slider, recent blogs |
| `/digital-marketing-services/` | `app/digital-marketing-services/page.tsx` | Services index |
| `/<service-slug>/` ×14 | `app/services/<slug>/page.tsx` | Service pages — all built from one shared template (see §5) |
| `/about-us/` | `app/about-us/page.tsx` | Team roster pulled from `/api/team` (KV override → `lib/team-defaults.ts`) |
| `/insights/` | `app/insights/page.tsx` | Blog listing (`revalidate = 300`); reuses `app/blogs/BlogsClient.tsx` |
| `/<blog-slug>/` | `app/blogs/[slug]/page.tsx` | Post pages, `revalidate = 0`; body HTML from KV, FAQ accordion, schema |
| `/news/` | `app/news/page.tsx` | Press mentions (hardcoded `NEWS` array); **noindex, nofollow** |
| `/case-studies/` | `app/case-studies/page.tsx` | Index of 5 case studies |
| `/case-studies/<slug>/` ×5 | `app/case-studies/<slug>/page.tsx` | zaina-cafe, saudi-german-hospital, al-sobh-hospital, make-a-wish-saudi-arabia, batterjee-properties |
| `/contact/` | `app/contact/page.tsx` | Lead form → `POST /api/contact` |
| `/contact/thank-you/` | post‑submit page | **noindex** |
| `/privacy-policy/`, `/terms-conditions/` | legal pages | `/privacy`, `/terms`, `/about` → 301 to the `-policy`/`-conditions`/`-us` versions |
| `/leadsheet/` | `app/leadsheet/page.tsx` | Standalone unlinked lead capture, Basic‑Auth gated, submissions tagged `source: 'leadsheet'` |
| `/robots.txt`, `/sitemap.xml`, `/llms.txt` | `app/robots.ts`, `app/sitemap.ts`, `app/llms.txt/route.ts` | All gated by `NEXT_PUBLIC_SITE_LIVE` |

**14 services** (root slugs): `web-design-company-dubai`, `branding-agency-dubai`,
`ppc-advertising-company-dubai`, `social-media-marketing-agency-in-dubai`,
`content-creation-dubai`, `graphic-design-services-dubai`, `email-marketing-dubai`,
`seo-services-dubai`, `local-seo-services-dubai`, `local-seo-services-in-abu-dhabi`,
`b2b-seo-services-in-dubai`, `outdoor-advertising-dubai`,
`analytics-performance-marketing` (Conversion Rate Optimization), `pr-agency-dubai`.

### Preview / test routes (not public)

| Route | Status |
|---|---|
| `/home-v4/` | Cinematic dark home‑page redesign (`app/home-v4/`). Pushed 2026‑10‑07 for manager approval, **hidden since 2026‑10‑16**: `page.tsx` calls `notFound()` when `NODE_ENV === 'production'`, so the live URL 404s; still viewable with `npm run dev`. To show it live again, remove that line. Contains 2 placeholder reviews to replace before it becomes the real home page. |
| `/home-v2/`, `/home-v3/`, `/index4/` | **Local only — never committed.** Their `app/layout.tsx` / `middleware.ts` wiring is uncommitted too; keep it out of commits until the user confirms. |

### Global chrome (`app/layout.tsx`)

Header, Footer, `ScrollReveal`, sitewide JSON‑LD (`SITEWIDE_SCHEMA`), floating
WhatsApp button (`wa.me/971555657609`), and `ChatWidget` — all hidden on `/admin`,
`/leadsheet` and `/home-v4`. Header nav: Home / Services / About Us / Blogs / News / Contact Us.
Root title template `'%s | Wide Wings Media'`.

---

## 3. SEO system

- `lib/seo.ts` — `SITE_URL = 'https://wide-wings.ae'`; `getPageMetadata(pageId)`
  resolves **KV override → hardcoded default in `lib/admin/store.ts`** → Next `Metadata`.
  Titles that already contain "Wide Wings" (or pageIds in `EXACT_TITLE_PAGES`) are
  returned as `{ absolute }` so the layout template doesn't double the brand.
- `lib/admin/store.ts` — hardcoded `pages[]` + `seoData[]` (meta titles/descriptions;
  updated with the Oct 2026 client copy) + `BLOG_SEO{}` per‑post overrides + `blogSeoDefault()`.
- `lib/schema.ts` — JSON‑LD. `SITEWIDE_SCHEMA` (Organization, rendered once in layout);
  `CUSTOM_SCHEMA{}` hand‑authored graphs (home page doc graph, rewritten posts such as
  `seo-strategy-for-uae-startups`); `getPageSchema(key)` falls back to scraped
  `lib/seo/old-site-data.json`. Service pages carry their own schema in their content file.
- `lib/schema-builder.ts` — builds BlogPosting+Breadcrumb+FAQ graph for admin‑uploaded posts.
- `components/SchemaScripts.tsx` — renders page‑level `<script type="application/ld+json">`.
- **New static pages** need registering in store `pages` + `seoData` (this also feeds
  the sitemap and the SEO Manager). Case‑study pages are not yet covered.
- **Sitemap** (`app/sitemap.ts`) serves the SEO team's URL list in `lib/sitemap-urls.ts`
  (Technical SEO doc, Oct 2026: 71 URLs + Graphic Design, their priorities, `daily`).
  Posts published after its `LIST_DATE` are appended automatically. Pages not in that
  list (case studies, `/contact/`, retired posts) are intentionally left out — to add a
  page to the sitemap, add it to `lib/sitemap-urls.ts`.
- Sitemap/robots/llms.txt only emit real content when `NEXT_PUBLIC_SITE_LIVE === 'true'`.

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

- **Service pages** = one shared template, `app/services/_doc/` (underscore = private
  folder, not a route):
  - `content/<slug>.ts` — a `ServiceDoc` per page (`types.ts`): pageId, path, crumb,
    h1, intro, sections (`p` / `ul` / `ol` / `h3` / `steps` / `cta` / `table` blocks),
    schema. Copy is the client's Oct 2026 doc text, kept **verbatim**. Inline
    `[label](href)` links and `**bold**` are supported.
  - `ServiceDocPage.tsx` — the renderer. It chooses the layout from the content:
    - hero = title (two‑tone, last words gold) + first intro paragraph + CTA;
      the rest of the intro leads the first section under its title;
    - H3 groups rotate between **cards / rows / sticky split list**; numbered H3s
      or `steps` → process steps; grids are balanced (`--per` items per row, no gaps);
    - long text sections (> ~650 chars) → full‑width heading, then **cards** if the
      paragraphs open with bold phrases, otherwise **two balanced text columns**;
      short text sections → heading left / copy right;
    - FAQ section → `<details>` accordion (a question‑list + answer‑panel version
      was tried 2026‑10‑16 and reverted at the client's request);
    - last section without H3s → closing CTA band.
  - `TitleIcon.tsx` — gold line icons before card, row and step titles, picked by
    keyword rules on the title text (first match wins; add a rule for new wording).
  - `service-doc.css` — all template styles (+ mobile overrides).
  - Each `app/services/<slug>/page.tsx` is just `generateMetadata` → `getPageMetadata(pageId)`
    + `<ServiceDocPage page={...} />`.
- **Blog posts** = `app/blogs/posts-data.ts` `POSTS[]` (hardcoded, slug/title/excerpt/
  category/image/cta/optional `publishAt`) **merged** with KV posts via
  `lib/admin/all-posts.ts`, sorted by publish date. `publishAt` in the future → post
  404s + excluded from listings/sitemap until that time (no deploy needed). Body HTML
  comes from KV; `PAGE_TITLES` / FAQ / schema layered on in `[slug]/page.tsx`.
  Rule: **one post per day max**; the WhatsApp Business Marketing post is on hold
  (`publishAt` 2099) until the client says to unhide it.
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

- **Full public site rebuilt and live on wide-wings.ae**: home, services index +
  14 service pages, about‑us (dynamic team), insights/blog listing, blog posts, news,
  5 case studies + index, contact + thank‑you, privacy, terms, leadsheet.
- **URL / SEO migration**: canonical base + sitemap on the domain; trailing slashes;
  legacy slug 301s; orphan old‑site link redirects; JSON‑LD scraped & matched.
- **Admin panel** with 3 roles: Dashboard, Pages, SEO Manager (+ redirect manager +
  .htaccess generator + robots/llms/sitemap viewer), Blog Content Editor, Blog
  visibility toggle, **docx‑upload blog publishing flow**, Media Library, Team
  Manager, Enquiries + Google Sheets sync, Chat Analytics, Account/password rotation.
- **Lead capture**: `/contact` + standalone Basic‑Auth `/leadsheet`, both → in‑app
  store + optional Google Sheets (separate "Website Leads" / "Direct Leads" tabs).
- **ChatWidget** with analytics pipeline (Neon Postgres) and admin dashboard.
- **Scheduled blog publishing** via `publishAt` (auto‑goes‑live, sitemap re‑checks every 5 min).
- **Sept 2026 — dark theme**: home, about, services index, all service pages, all blog
  posts, insights, news and contact converted to the dark theme with background images;
  animated wing logo in the home hero; particle wing animation on the contact hero;
  11 new team members on About Us; blog sorting / Recent Posts fixes; new scheduled posts.
- **Oct 2026 — client content update** (4 docs: home meta & schema, Website Page Actions
  sheet, SEO sub‑pages, "Website New Copies Sep 2026"):
  - home page meta + schema graph;
  - 11 service pages rewritten with the new copy + new meta titles/descriptions;
  - **3 new service pages**: Local SEO Dubai, Local SEO Abu Dhabi, B2B SEO (the two
    blog posts at those URLs became service pages on the same URL), plus Graphic
    Design (`graphic-design-services-dubai`); Content Creation moved to `content-creation-dubai`;
  - "SEO Strategy for UAE Startups" post rewritten (title, body, schema);
  - 6 old posts removed and 301'd per the Page Actions sheet.
- **Oct 2026 — service page design** (2026‑10‑16): shared template above — lighter hero,
  varied section layouts, two‑tone headings, no 01/02 numbering, balanced grids,
  full‑width layouts for long text, gold title icons on cards/rows/steps.
- **/home-v4 redesign preview** built (smoke animation, review rail, success‑story
  video, animated wing mark, new menu) — currently hidden in production (see §2).

### 🚧 In progress / known gaps

- **Case study body content**: Zaina Cafe & Saudi German Hospital done;
  **SBK Properties / Batterjee still has placeholder body**.
- **SEO Manager new‑page wiring**: brand‑new static pages need manual registration in
  `lib/admin/store.ts`; case‑study pages are not covered yet.
- **`store.ts` pages/enquiries/media are in‑memory** — lost on redeploy. Enquiries
  survive only if Google Sheets sync is configured; the seeded `enquiries[]` are demo data.
- Open items from the Oct 2026 content update, flagged to the client:
  - Content Creation page keeps six "WWM's current…" research‑note sentences verbatim
    from the doc — confirm whether they should stay;
  - services index has no Graphic Design card yet;
  - sitewide schema still carries the old phone number `+971589852690`;
  - KV SEO overrides set in Admin → SEO take priority over the new meta — check they
    don't mask the new titles.
- `/home-v4` is waiting on approval; replace its 2 placeholder reviews before launch.
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

Note: `VERCEL_ENV` is **not** available at runtime on this Vercel project — use
`NODE_ENV` for production checks.
