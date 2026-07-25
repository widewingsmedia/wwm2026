import { NextResponse } from 'next/server';
import { getSession } from '@/lib/admin/auth';
import { SITE_URL } from '@/lib/seo';
import { buildLlmsTxt } from '@/app/llms.txt/route';

const isLive = process.env.NEXT_PUBLIC_SITE_LIVE === 'true';

const ROBOTS_LIVE = `User-Agent: *\nAllow: /\nDisallow: /admin\n\nSitemap: ${SITE_URL}/sitemap.xml\n`;
const ROBOTS_NOT_LIVE = `User-Agent: *\nDisallow: /\n`;

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  return NextResponse.json({
    isLive,
    robotsTxt: isLive ? ROBOTS_LIVE : ROBOTS_NOT_LIVE,
    robotsUrl: `${SITE_URL}/robots.txt`,
    llmsTxt: buildLlmsTxt(),
    llmsTxtUrl: `${SITE_URL}/llms.txt`,
    sitemapUrl: `${SITE_URL}/sitemap.xml`,
  });
}
