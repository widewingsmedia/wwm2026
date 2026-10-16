import type { Metadata } from 'next';
import { store, type SeoData } from './admin/store';
import { getSeoOverride } from './admin/seo-kv';

// Matches the canonical URL base already hardcoded in lib/admin/store.ts's makeSeo().
export const SITE_URL = 'https://wide-wings.ae';

// Client-supplied meta titles without the brand name that must not get the
// layout's " | Wide Wings Media" suffix (Oct 2026 copy docs).
const EXACT_TITLE_PAGES = new Set(['web-app-development', 'ooh-advertising']);

// Resolves the SEO data for a page: an admin-saved override (Vercel KV) takes
// priority, falling back to the hardcoded defaults in lib/admin/store.ts.
export async function resolveSeoData(pageId: string): Promise<SeoData | undefined> {
  const override = await getSeoOverride(pageId);
  if (override) return override;
  return store.seo.get(pageId);
}

// Builds a Next.js Metadata object from resolved SEO data. Pass a pageId that
// matches an entry in lib/admin/store.ts (static pages) or `blog-<slug>`.
export async function getPageMetadata(pageId: string): Promise<Metadata> {
  const seo = await resolveSeoData(pageId);
  if (!seo) return {};
  return seoDataToMetadata(seo);
}

export function seoDataToMetadata(seo: SeoData): Metadata {
  const keywords = [seo.focusKeyword, ...(seo.secondaryKeywords ? seo.secondaryKeywords.split(',').map(k => k.trim()) : [])]
    .filter(Boolean) as string[];

  return {
    // The root layout appends " | Wide Wings Media" to every title. Titles that
    // already carry the brand, or were specified word-for-word by the client,
    // are used as-is so the brand isn't doubled.
    title: seo.metaTitle
      ? (/wide wings/i.test(seo.metaTitle) || EXACT_TITLE_PAGES.has(seo.pageId) ? { absolute: seo.metaTitle } : seo.metaTitle)
      : undefined,
    description: seo.metaDescription || undefined,
    keywords: keywords.length ? keywords : undefined,
    alternates: seo.canonicalUrl ? { canonical: seo.canonicalUrl } : undefined,
    robots: { index: !seo.noindex, follow: !seo.nofollow },
    openGraph: {
      title: seo.ogTitle || seo.metaTitle || undefined,
      description: seo.ogDescription || seo.metaDescription || undefined,
      url: seo.canonicalUrl || undefined,
      type: 'website',
      images: seo.ogImage ? [{ url: seo.ogImage }] : undefined,
    },
    twitter: {
      card: seo.twitterCard || 'summary_large_image',
      title: seo.ogTitle || seo.metaTitle || undefined,
      description: seo.ogDescription || seo.metaDescription || undefined,
      images: seo.ogImage ? [seo.ogImage] : undefined,
    },
  };
}
