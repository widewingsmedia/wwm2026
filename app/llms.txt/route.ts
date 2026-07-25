import { CASE_STUDIES } from '@/app/case-studies/cases-data';
import { SITE_URL } from '@/lib/seo';

// llms.txt — a machine-readable overview for AI assistants / LLM-based search
// (see https://llmstxt.org/). Only published once the site is live, same gate
// as app/robots.ts and app/sitemap.ts, so AI crawlers don't index the preview.
const isLive = process.env.NEXT_PUBLIC_SITE_LIVE === 'true';

const SERVICES = [
  { title: 'Web & App Development', slug: '/web-design-company-dubai/' },
  { title: 'Creative & Branding', slug: '/branding-agency-dubai/' },
  { title: 'Paid Advertising & Media Buying', slug: '/ppc-advertising-company-dubai/' },
  { title: 'Social Media Management', slug: '/social-media-marketing-agency-in-dubai/' },
  { title: 'Content Creation & Graphic Design', slug: '/content-creation-graphic-design/' },
  { title: 'Email, SMS & CRM Marketing', slug: '/email-marketing-dubai/' },
  { title: 'SEO & Performance Management', slug: '/seo-services-dubai/' },
  { title: 'OOH Advertising', slug: '/outdoor-advertising-dubai/' },
  { title: 'Analytics & Performance Marketing', slug: '/analytics-performance-marketing/' },
  { title: 'PR Management', slug: '/pr-agency-dubai/' },
];

export function buildLlmsTxt(): string {
  const lines: string[] = [];

  lines.push('# Wide Wings Media');
  lines.push('');
  lines.push('> Wide Wings Media is a full-service digital marketing agency in Dubai, UAE, offering SEO, paid advertising, social media management, content creation, web & app development, OOH advertising, and PR — serving clients across the UAE and GCC region.');
  lines.push('');
  lines.push('Wide Wings Media is Google & Meta verified, operates fully in-house with 50+ specialists, and works with no minimum retainer requirement.');
  lines.push('');

  lines.push('## Services');
  lines.push('');
  for (const s of SERVICES) {
    lines.push(`- [${s.title}](${SITE_URL}${s.slug}): ${s.title} services from Wide Wings Media in Dubai, UAE.`);
  }
  lines.push('');

  lines.push('## Case Studies');
  lines.push('');
  for (const c of CASE_STUDIES) {
    lines.push(`- [${c.client} — ${c.title}](${SITE_URL}${c.href}/): ${c.cat} success story.`);
  }
  lines.push('');

  lines.push('## Company');
  lines.push('');
  lines.push(`- [About Us](${SITE_URL}/about-us/): Who Wide Wings Media is and how the team works.`);
  lines.push(`- [Blog & Insights](${SITE_URL}/insights/): Digital marketing articles and guides.`);
  lines.push(`- [Contact](${SITE_URL}/contact/): Get in touch for a free consultation.`);
  lines.push('');

  lines.push('## Optional');
  lines.push('');
  lines.push(`- [All Services Overview](${SITE_URL}/digital-marketing-services/): Full list of digital marketing services offered.`);
  lines.push(`- [Case Studies Index](${SITE_URL}/case-studies/): All client success stories.`);

  return lines.join('\n') + '\n';
}

export async function GET() {
  if (!isLive) {
    return new Response('', { status: 404 });
  }
  return new Response(buildLlmsTxt(), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
