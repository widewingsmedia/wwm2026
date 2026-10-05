import HomePage from './Home';
import { getAllPosts } from '@/lib/admin/all-posts';
import { getHiddenSlugs } from '@/lib/admin/post-visibility-kv';
import { isPublished } from './blogs/posts-data';

// Re-checked periodically (same as /insights/) so newly published or
// scheduled posts show up here without a redeploy.
export const revalidate = 300;

export default async function Page() {
  const [posts, hiddenSlugs] = await Promise.all([getAllPosts(), getHiddenSlugs()]);
  // getAllPosts() returns posts newest-first (sorted by publishAt/createdAt).
  const latestPosts = posts
    .filter(p => isPublished(p) && !hiddenSlugs.includes(p.slug))
    .slice(0, 6);

  return <HomePage posts={latestPosts} />;
}
