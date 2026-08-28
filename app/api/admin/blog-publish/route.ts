import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getSession } from '@/lib/admin/auth';
import { POSTS } from '@/app/blogs/posts-data';
import { setNewPost, getNewPost, type NewPost, type FaqItem } from '@/lib/admin/new-posts-kv';
import { setBlogContent } from '@/lib/admin/blog-kv';
import { setSeoOverride } from '@/lib/admin/seo-kv';
import { SITE_URL } from '@/lib/seo';

interface PublishBody {
  slug: string;
  title: string;
  excerpt?: string;
  category: string;
  image: string;
  cta?: string;
  publishAt?: string;
  metaTitle: string;
  metaDescription: string;
  focusKeyword?: string;
  secondaryKeywords?: string;
  bodyHtml: string;
  faqItems: FaqItem[];
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== 'webadmin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json() as PublishBody;
  const slug = (body.slug || '').replace(/^\/+|\/+$/g, '').trim().toLowerCase();

  if (!slug || !/^[a-z0-9-]+$/.test(slug)) {
    return NextResponse.json({ error: 'Slug must be lowercase letters, numbers, and hyphens only.' }, { status: 400 });
  }
  if (!body.title?.trim()) return NextResponse.json({ error: 'Missing title.' }, { status: 400 });
  if (!body.bodyHtml?.trim()) return NextResponse.json({ error: 'Missing body content.' }, { status: 400 });
  if (!body.metaTitle?.trim() || !body.metaDescription?.trim()) {
    return NextResponse.json({ error: 'Missing meta title or meta description.' }, { status: 400 });
  }

  // A dynamic post can never shadow a real, code-defined post.
  if (POSTS.some(p => p.slug === slug)) {
    return NextResponse.json({ error: `"/${slug}/" already exists as a built-in post — choose a different slug.` }, { status: 409 });
  }
  const isNewSlug = !(await getNewPost(slug));

  const createdAt = new Date().toISOString();
  const image = body.image?.trim() || '/blog/guide-to-effective-social-media-campaign.webp';

  const newPost: NewPost = {
    slug,
    title: body.title.trim(),
    excerpt: body.excerpt?.trim() || body.metaDescription.trim(),
    category: body.category?.trim() || 'Digital Marketing',
    image,
    cta: body.cta?.trim() || 'Learn more',
    publishAt: body.publishAt || undefined,
    createdAt,
    metaTitle: body.metaTitle.trim(),
    metaDescription: body.metaDescription.trim(),
    focusKeyword: body.focusKeyword?.trim() || '',
    secondaryKeywords: body.secondaryKeywords?.trim() || '',
    faqItems: Array.isArray(body.faqItems) ? body.faqItems : [],
  };

  await setNewPost(newPost);
  await setBlogContent(slug, body.bodyHtml);
  await setSeoOverride(`blog-${slug}`, {
    pageId: `blog-${slug}`,
    pageTitle: newPost.title,
    slug: `/${slug}`,
    metaTitle: newPost.metaTitle,
    metaDescription: newPost.metaDescription,
    focusKeyword: newPost.focusKeyword,
    secondaryKeywords: newPost.secondaryKeywords,
    canonicalUrl: `${SITE_URL}/${slug}`,
    ogTitle: newPost.metaTitle,
    ogDescription: newPost.metaDescription,
    ogImage: image,
    featuredImage: image,
    featuredImageAlt: newPost.title,
    twitterCard: 'summary_large_image',
    robots: 'index, follow',
    schemaType: 'BlogPosting',
    noindex: false,
    nofollow: false,
    updatedAt: createdAt,
  });

  revalidatePath(`/${slug}`);
  revalidatePath('/insights');
  revalidatePath('/sitemap.xml');
  revalidatePath('/admin/blogs');

  return NextResponse.json({ ok: true, slug, url: `${SITE_URL}/${slug}/`, created: isNewSlug });
}
