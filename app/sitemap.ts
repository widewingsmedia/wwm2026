import type { MetadataRoute } from 'next';
import { isPublished } from '@/app/blogs/posts-data';
import { SITE_URL } from '@/lib/seo';
import { getAllPosts } from '@/lib/admin/all-posts';
import { getHiddenSlugs } from '@/lib/admin/post-visibility-kv';
import { LIST_DATE, SITEMAP_URLS } from '@/lib/sitemap-urls';

// Re-checked periodically so scheduled posts (see posts-data.ts publishAt)
// drop into the sitemap on their own, without a new deploy.
export const revalidate = 300;

// Only served with real entries once the site is live — see app/robots.ts for
// the same NEXT_PUBLIC_SITE_LIVE gate, so search engines never index the
// preview deployment via a leaked sitemap URL.
const isLive = process.env.NEXT_PUBLIC_SITE_LIVE === 'true';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (!isLive) return [];

  const [posts, hiddenSlugs] = await Promise.all([getAllPosts(), getHiddenSlugs()]);
  const postBySlug = new Map(posts.map(p => [p.slug, p]));
  // a listed blog post that has since been hidden/unscheduled drops out
  const live = (path: string) => {
    const post = postBySlug.get(path.replace(/^\/|\/$/g, ''));
    return !post || (isPublished(post) && !hiddenSlugs.includes(post.slug));
  };

  // the SEO team's list (lib/sitemap-urls.ts), in their order and priorities
  const listed: MetadataRoute.Sitemap = SITEMAP_URLS.filter(([path]) => live(path)).map(([path, priority]) => ({
    url: `${SITE_URL}${path}`,
    lastModified: LIST_DATE,
    changeFrequency: 'daily' as const,
    priority,
  }));

  // posts published after the list was made
  const listedPaths = new Set(SITEMAP_URLS.map(([path]) => path));
  const cutoff = new Date(`${LIST_DATE}T23:59:59+04:00`).getTime();
  const newer: MetadataRoute.Sitemap = posts
    .map(p => ({ p, at: p.publishAt ?? (p as { createdAt?: string }).createdAt }))
    .filter(({ p, at }) => at && new Date(at).getTime() > cutoff && !listedPaths.has(`/${p.slug}/`)
      && isPublished(p) && !hiddenSlugs.includes(p.slug))
    .map(({ p, at }) => ({
      url: `${SITE_URL}/${p.slug}/`,
      lastModified: at!.slice(0, 10),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    }));

  return [listed[0], ...newer, ...listed.slice(1)].filter(Boolean);
}
