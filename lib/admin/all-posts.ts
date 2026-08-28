// Merges the hardcoded POSTS array (app/blogs/posts-data.ts, requires a code
// push to add to) with posts created live via the admin "New Blog Post"
// upload flow (stored in KV — see new-posts-kv.ts). Used anywhere the site
// needs the full list of posts: the blog page itself, the insights listing,
// and the sitemap.
import { POSTS, type Post } from '@/app/blogs/posts-data';
import { listNewPosts } from './new-posts-kv';

export async function getAllPosts(): Promise<Post[]> {
  const dynamic = await listNewPosts();
  // A hardcoded slug always wins on collision — a dynamic post can't shadow
  // a real code-defined one.
  const dynamicFiltered = dynamic
    .filter(d => !POSTS.some(s => s.slug === d.slug))
    .map(({ slug, title, excerpt, category, image, cta, publishAt }) => ({
      slug, title, excerpt, category, image, cta, publishAt,
    }));
  return [...POSTS, ...dynamicFiltered];
}
