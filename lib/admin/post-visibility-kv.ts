// Manual show/hide toggle for blog posts, independent of the scheduled-
// publish (`publishAt`) gate in app/blogs/posts-data.ts. A hidden post 404s
// on its own page and disappears from /insights/, related posts, and the
// sitemap — same visibility contract as an unpublished/scheduled post.
// Stored as a single JSON array under one key (cheap single read on every
// blog page load / insights render / sitemap build) rather than one KV key
// per slug.
import { kv } from '@vercel/kv';

const KEY = 'blog:hidden-slugs';

export async function getHiddenSlugs(): Promise<string[]> {
  try {
    return (await kv.get<string[]>(KEY)) ?? [];
  } catch {
    return [];
  }
}

export async function setHidden(slug: string, hidden: boolean): Promise<string[]> {
  const current = await getHiddenSlugs();
  const set = new Set(current);
  if (hidden) set.add(slug);
  else set.delete(slug);
  const next = Array.from(set);
  await kv.set(KEY, next);
  return next;
}
