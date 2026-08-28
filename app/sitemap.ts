import type { MetadataRoute } from 'next';
import { store } from '@/lib/admin/store';
import { isPublished } from '@/app/blogs/posts-data';
import { CASE_STUDIES } from '@/app/case-studies/cases-data';
import { SITE_URL } from '@/lib/seo';
import { getAllPosts } from '@/lib/admin/all-posts';

// Re-checked periodically so scheduled posts (see posts-data.ts publishAt)
// drop into the sitemap on their own, without a new deploy.
export const revalidate = 300;

// Only served with real entries once the site is live — see app/robots.ts for
// the same NEXT_PUBLIC_SITE_LIVE gate, so search engines never index the
// preview deployment via a leaked sitemap URL.
const isLive = process.env.NEXT_PUBLIC_SITE_LIVE === 'true';

function withSlash(path: string): string {
  return path.endsWith('/') ? path : `${path}/`;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (!isLive) return [];

  const seoByPageId = new Map(store.seo.list().map(s => [s.pageId, s]));

  const staticPages: MetadataRoute.Sitemap = store.pages
    .list()
    .filter(p => p.status === 'published' && !seoByPageId.get(p.id)?.noindex)
    .map(p => ({
      url: `${SITE_URL}${p.slug === '/' ? '/' : withSlash(p.slug)}`,
      lastModified: p.updatedAt,
      changeFrequency: 'monthly' as const,
      priority: p.slug === '/' ? 1 : 0.8,
    }));

  const caseStudyPages: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/case-studies/`, changeFrequency: 'monthly' as const, priority: 0.7 },
    ...CASE_STUDIES.map(c => ({
      url: `${SITE_URL}${withSlash(c.href)}`,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ];

  const posts = await getAllPosts();
  const blogPages: MetadataRoute.Sitemap = posts.filter(isPublished).map(post => {
    const seo = seoByPageId.get(`blog-${post.slug}`);
    return {
      url: `${SITE_URL}/${post.slug}/`,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
      ...(seo?.noindex ? { priority: 0 } : {}),
    };
  }).filter(p => p.priority !== 0);

  return [...staticPages, ...caseStudyPages, ...blogPages];
}
