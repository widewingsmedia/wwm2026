import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo';

// The site is not publicly live yet (still on a preview domain) — block all
// crawling so search engines don't index the preview URL and cause duplicate
// content once the real domain goes live.
//
// At go-live: set NEXT_PUBLIC_SITE_LIVE=true in the production project's
// environment variables (and redeploy) to switch to the production ruleset.
const isLive = process.env.NEXT_PUBLIC_SITE_LIVE === 'true';

export default function robots(): MetadataRoute.Robots {
  if (!isLive) {
    return {
      rules: { userAgent: '*', disallow: '/' },
    };
  }

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/leadsheet'],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
