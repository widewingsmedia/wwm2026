// Builds the BlogPosting + BreadcrumbList + FAQPage JSON-LD graph for a blog
// post created via the admin "New Blog Post" upload flow, from its structured
// fields — rather than trusting freeform JSON-LD text a human typed into a
// .docx. Mirrors the shape hand-authored for every other post in lib/schema.ts.
import type { FaqItem } from './admin/new-posts-kv';
import { SITE_URL } from './seo';

export function buildBlogSchema(post: {
  slug: string;
  title: string;
  metaDescription: string;
  image: string;
  category: string;
  createdAt: string;
  faqItems: FaqItem[];
}): Record<string, unknown>[] {
  const url = `${SITE_URL}/${post.slug}/`;
  const date = post.createdAt.slice(0, 10); // ISO date only

  const graph: Record<string, unknown>[] = [
    {
      '@type': 'BlogPosting',
      '@id': `${url}#blogposting`,
      mainEntityOfPage: { '@type': 'WebPage', '@id': url },
      headline: post.title,
      description: post.metaDescription,
      image: post.image.startsWith('http') || post.image.startsWith('data:')
        ? post.image
        : `${SITE_URL}${post.image}`,
      author: { '@type': 'Organization', name: 'Wide Wings Media' },
      publisher: {
        '@type': 'Organization',
        name: 'Wide Wings Media',
        url: `${SITE_URL}/`,
        logo: { '@type': 'ImageObject', url: `${SITE_URL}/Logoblack.webp` },
      },
      datePublished: date,
      dateModified: date,
      articleSection: post.category,
      inLanguage: 'en',
    },
    {
      '@type': 'BreadcrumbList',
      '@id': `${url}#breadcrumb`,
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
        { '@type': 'ListItem', position: 2, name: 'Insights', item: `${SITE_URL}/insights/` },
        { '@type': 'ListItem', position: 3, name: post.title, item: url },
      ],
    },
  ];

  if (post.faqItems.length > 0) {
    graph.push({
      '@type': 'FAQPage',
      '@id': `${url}#faq`,
      mainEntity: post.faqItems.map(f => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    });
  }

  return [{ '@context': 'https://schema.org', '@graph': graph }];
}
