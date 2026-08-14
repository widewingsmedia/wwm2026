// JSON-LD schema markup replicated verbatim from wide-wings.ae (the legacy site),
// scraped via scripts/scrape-old-site-seo.mjs into lib/seo/old-site-data.json.
import oldSiteData from './seo/old-site-data.json';

type OldSitePage = {
  slug: string;
  url: string;
  ldJson: Record<string, unknown>[];
};

// The first ld+json block is identical on every old-site page — rendered once,
// sitewide, in app/layout.tsx instead of repeating it on every page.
export const SITEWIDE_SCHEMA = (oldSiteData as Record<string, OldSitePage>).home.ldJson[0];

// Hand-authored schema for pages that don't exist on the old site (new/rewritten
// blog posts) — takes priority over the scraped old-site data below.
const CUSTOM_SCHEMA: Record<string, Record<string, unknown>[]> = {
  'best-time-to-post-on-instagram-in-uae': [
    {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'BlogPosting',
          mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': 'https://wide-wings.ae/best-time-to-post-on-instagram-in-uae/',
          },
          headline: 'Best Time to Post on Instagram in UAE: 2026 Posting Guide',
          description: 'Discover the best time to post on Instagram in the UAE in 2026, including weekday and weekend posting windows, Reels timing, Stories timing, and Instagram Insights testing strategies.',
          image: 'https://wide-wings.ae/blog/best-time-to-post-on-instagram-in-uae.webp',
          author: { '@type': 'Organization', name: 'Wide Wings Media' },
          publisher: {
            '@type': 'Organization',
            name: 'Wide Wings Media',
            logo: { '@type': 'ImageObject', url: 'https://wide-wings.ae/Logoblack.webp' },
          },
          datePublished: '2026-08-12',
          dateModified: '2026-08-12',
          articleSection: 'Social Media Marketing',
          keywords: [
            'best time to post on Instagram in UAE',
            'Instagram posting time UAE',
            'best time to post Instagram Reels UAE',
            'Instagram marketing UAE',
          ],
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://wide-wings.ae/' },
            { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://wide-wings.ae/insights/' },
            { '@type': 'ListItem', position: 3, name: 'Best Time to Post on Instagram in UAE: 2026 Posting Guide', item: 'https://wide-wings.ae/best-time-to-post-on-instagram-in-uae/' },
          ],
        },
        {
          '@type': 'FAQPage',
          mainEntity: [
            {
              '@type': 'Question',
              name: 'What time is the best time to post on Instagram in the UAE?',
              acceptedAnswer: { '@type': 'Answer', text: 'Evening hours between 7:00 PM and 9:00 PM are the strongest starting point for many UAE accounts. Weekday lunch hours between 12:00 PM and 2:00 PM are also worth testing.' },
            },
            {
              '@type': 'Question',
              name: 'How do I find the best time to post on Instagram for my account?',
              acceptedAnswer: { '@type': 'Answer', text: 'Use Instagram Insights to check when your followers are active, test multiple posting windows, and compare reach, shares, saves, watch time, clicks, and enquiries.' },
            },
            {
              '@type': 'Question',
              name: 'What is the best time to post on Instagram?',
              acceptedAnswer: { '@type': 'Answer', text: 'There is no universal best time. Start with lunch and evening hours, then adjust the schedule based on your industry, audience location, content type, and account analytics.' },
            },
            {
              '@type': 'Question',
              name: 'What is the best day and time to post on Instagram?',
              acceptedAnswer: { '@type': 'Answer', text: 'Tuesday, Wednesday, and Thursday are strong starting days for important content, with Wednesday lunch hours and weekday evenings being particularly useful testing periods.' },
            },
            {
              '@type': 'Question',
              name: 'What is the best time to post a video on Instagram?',
              acceptedAnswer: { '@type': 'Answer', text: 'Start by posting videos and Reels between 7:00 PM and 10:00 PM UAE time, and test later evening slots for Friday and weekend content.' },
            },
          ],
        },
      ],
    },
  ],
  'digital-marketing-strategies-for-smes': [
    {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'BlogPosting',
          mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': 'https://wide-wings.ae/digital-marketing-strategies-for-smes/',
          },
          headline: 'Digital Marketing for SMEs in Dubai: Strategies That Work in 2026',
          description: 'Discover practical digital marketing strategies for SMEs in Dubai in 2026, including SEO, AI search, social media, WhatsApp marketing, paid advertising, and growth-focused marketing planning.',
          image: 'https://wide-wings.ae/blog/digital-marketing-strategies-for-smes.webp',
          author: { '@type': 'Organization', name: 'Wide Wings Media' },
          publisher: {
            '@type': 'Organization',
            name: 'Wide Wings Media',
            logo: { '@type': 'ImageObject', url: 'https://wide-wings.ae/Logoblack.webp' },
          },
          datePublished: '2026-08-12',
          dateModified: '2026-08-12',
          articleSection: 'Digital Marketing',
          keywords: [
            'digital marketing for SMEs in Dubai',
            'digital marketing strategy Dubai',
            'SEO for small businesses Dubai',
            'social media marketing Dubai',
            'WhatsApp marketing UAE',
            'paid advertising Dubai',
          ],
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://wide-wings.ae/' },
            { '@type': 'ListItem', position: 2, name: 'Insights', item: 'https://wide-wings.ae/insights/' },
            { '@type': 'ListItem', position: 3, name: 'Digital Marketing for SMEs in Dubai: Strategies That Work in 2026', item: 'https://wide-wings.ae/digital-marketing-strategies-for-smes/' },
          ],
        },
      ],
    },
  ],
  'image-optimization-tips': [
    {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'BlogPosting',
          mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': 'https://wide-wings.ae/image-optimization-tips/',
          },
          headline: 'Boost Website Traffic: Image Optimization Guide for Bloggers',
          alternativeHeadline: 'Image Optimization Tips for Faster Websites and Better SEO',
          description: 'Follow this practical image optimization workflow using AVIF, WebP, responsive sizing, Core Web Vitals, alt text and visual search best practices.',
          image: 'https://wide-wings.ae/blog/image-optimization-tips.webp',
          author: { '@type': 'Organization', name: 'Wide Wings Media' },
          publisher: {
            '@type': 'Organization',
            name: 'Wide Wings Media',
            logo: { '@type': 'ImageObject', url: 'https://wide-wings.ae/Logoblack.webp' },
          },
          datePublished: '2026-08-12',
          dateModified: '2026-08-12',
          articleSection: 'SEO',
          keywords: [
            'image optimization',
            'image SEO',
            'Core Web Vitals',
            'WebP',
            'AVIF',
            'website speed optimization',
            'visual search optimization',
          ],
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://wide-wings.ae/' },
            { '@type': 'ListItem', position: 2, name: 'Insights', item: 'https://wide-wings.ae/insights/' },
            { '@type': 'ListItem', position: 3, name: 'Boost Website Traffic: Image Optimization Guide for Bloggers', item: 'https://wide-wings.ae/image-optimization-tips/' },
          ],
        },
      ],
    },
  ],
  'ai-trend': [
    {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'BlogPosting',
          mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': 'https://wide-wings.ae/ai-trend/',
          },
          headline: 'AI Trends in the UAE: What Businesses Should Watch in 2026',
          description: 'Explore the most important AI trends in the UAE for 2026, including agentic AI, bilingual AI, intelligent automation, AI governance, and practical adoption strategies for businesses.',
          image: 'https://wide-wings.ae/blog/ai-trend.webp',
          author: { '@type': 'Organization', name: 'Wide Wings Media' },
          publisher: {
            '@type': 'Organization',
            name: 'Wide Wings Media',
            logo: { '@type': 'ImageObject', url: 'https://wide-wings.ae/Logoblack.webp' },
          },
          datePublished: '2026-08-12',
          dateModified: '2026-08-12',
          articleSection: 'Artificial Intelligence',
          keywords: [
            'AI trends UAE',
            'artificial intelligence UAE',
            'agentic AI UAE',
            'AI automation UAE',
            'AI governance UAE',
            'UAE AI strategy',
            'bilingual AI UAE',
          ],
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://wide-wings.ae/' },
            { '@type': 'ListItem', position: 2, name: 'Insights', item: 'https://wide-wings.ae/insights/' },
            { '@type': 'ListItem', position: 3, name: 'AI Trends in the UAE: What Businesses Should Watch in 2026', item: 'https://wide-wings.ae/ai-trend/' },
          ],
        },
      ],
    },
  ],
};

// Returns the page-specific ld+json block(s) for a given key. Checks the
// hand-authored CUSTOM_SCHEMA first, then falls back to the scraped old-site
// data (everything after the sitewide block), or an empty array if missing.
export function getPageSchema(key: string): Record<string, unknown>[] {
  if (CUSTOM_SCHEMA[key]) return CUSTOM_SCHEMA[key];
  const page = (oldSiteData as Record<string, OldSitePage>)[key];
  if (!page || !page.ldJson || page.ldJson.length < 2) return [];
  return page.ldJson.slice(1);
}
