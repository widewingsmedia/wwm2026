// Storage for blog posts created entirely through the admin panel's "New Blog
// Post" upload flow (lib/blog-docx-parser.ts + app/admin/blogs/new). Unlike
// the hardcoded POSTS array in app/blogs/posts-data.ts, these live in KV so a
// new post can go live without a code push. See lib/admin/all-posts.ts for
// how this merges with the hardcoded list everywhere POSTS is read.
import { kv } from '@vercel/kv';

export interface FaqItem {
  q: string;
  a: string; // plain text (schema needs plain text, not HTML)
}

export interface NewPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  image: string; // data: URI, /public path, or external URL
  cta: string;
  publishAt?: string;
  createdAt: string;
  metaTitle: string;
  metaDescription: string;
  focusKeyword: string;
  secondaryKeywords: string;
  faqItems: FaqItem[];
}

const PREFIX = 'newpost:';

export async function getNewPost(slug: string): Promise<NewPost | null> {
  try {
    return await kv.get<NewPost>(`${PREFIX}${slug}`);
  } catch {
    return null;
  }
}

export async function setNewPost(post: NewPost): Promise<void> {
  await kv.set(`${PREFIX}${post.slug}`, post);
}

export async function deleteNewPost(slug: string): Promise<void> {
  await kv.del(`${PREFIX}${slug}`);
}

export async function listNewPosts(): Promise<NewPost[]> {
  try {
    const keys = await kv.keys(`${PREFIX}*`);
    if (keys.length === 0) return [];
    const values = await Promise.all(keys.map(k => kv.get<NewPost>(k)));
    return values.filter((v): v is NewPost => v !== null);
  } catch {
    return [];
  }
}
