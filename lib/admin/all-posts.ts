// Merges the hardcoded POSTS array (app/blogs/posts-data.ts, requires a code
// push to add to) with posts created live via the admin "New Blog Post"
// upload flow (stored in KV — see new-posts-kv.ts). Used anywhere the site
// needs the full list of posts: the blog page itself, the insights listing,
// and the sitemap.
import { POSTS, type Post } from '@/app/blogs/posts-data';
import { listNewPosts } from './new-posts-kv';

// Posts don't all carry a real date: only the ones added with scheduled
// publishing (posts-data.ts `publishAt`) or created via the admin upload
// flow (`createdAt`) do. Older hardcoded posts have neither. Treat those as
// maximally old so anything with a real date always outranks them, while
// preserving their original relative order (Array#sort is stable).
function effectiveTime(p: Post & { createdAt?: string }): number {
  if (p.publishAt) return new Date(p.publishAt).getTime();
  if (p.createdAt) return new Date(p.createdAt).getTime();
  return 0;
}

export async function getAllPosts(): Promise<Post[]> {
  const dynamic = await listNewPosts();
  // A hardcoded slug always wins on collision — a dynamic post can't shadow
  // a real code-defined one.
  const dynamicFiltered: (Post & { createdAt?: string })[] = dynamic
    .filter(d => !POSTS.some(s => s.slug === d.slug))
    .map(({ slug, title, excerpt, category, image, cta, publishAt, createdAt }) => ({
      slug, title, excerpt, category, image, cta, publishAt, createdAt,
    }));
  // Sort the whole combined list newest-first by publishAt/createdAt so the
  // main grid and the "Recent Posts" sidebar (which just takes the first
  // few of whatever list it's given) actually reflect recency — previously
  // they relied on array/declaration order, so a newly scheduled or
  // admin-created post never surfaced no matter how recent it was.
  return [...POSTS, ...dynamicFiltered].sort((a, b) => effectiveTime(b) - effectiveTime(a));
}
