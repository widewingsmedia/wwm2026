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
    // Newest admin-created post first, so it surfaces at the top of the
    // grid and in the "Recent Posts" sidebar (which just takes the first
    // few of whatever list it's given).
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .map(({ slug, title, excerpt, category, image, cta, publishAt }) => ({
      slug, title, excerpt, category, image, cta, publishAt,
    }));
  // Admin-created posts are put ahead of the hardcoded POSTS list so a post
  // published live through the admin panel actually reads as "recent" —
  // otherwise it always landed after 58+ older hardcoded posts and never
  // appeared in "Recent Posts".
  return [...dynamicFiltered, ...POSTS];
}
