import Index3 from './Index3';
import { getAllPosts } from '@/lib/admin/all-posts';
import { getHiddenSlugs } from '@/lib/admin/post-visibility-kv';
import { isPublished } from '../blogs/posts-data';

// Standalone preview build — same layout/content as the real homepage
// (app/page.tsx), just dark-themed. Intentionally not linked from anywhere
// on the site yet. Visit directly at /index3/ to review.
//
// Re-checked periodically (same as /insights/) so newly published or
// scheduled posts show up here without a redeploy.
export const revalidate = 300;

export default async function Index3Page() {
  const [posts, hiddenSlugs] = await Promise.all([getAllPosts(), getHiddenSlugs()]);
  // getAllPosts() returns posts in the order they were added (hardcoded
  // entries first, newest at the bottom, then admin-uploaded ones appended
  // after) — so the latest published posts are at the end of the list.
  const latestPosts = posts
    .filter(p => isPublished(p) && !hiddenSlugs.includes(p.slug))
    .slice(-6)
    .reverse();

  return <Index3 posts={latestPosts} />;
}
