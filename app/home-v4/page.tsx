import HomeV4 from './HomeV4';
import { getAllPosts } from '@/lib/admin/all-posts';
import { getHiddenSlugs } from '@/lib/admin/post-visibility-kv';
import { isPublished } from '../blogs/posts-data';

export const revalidate = 300;

export default async function Page() {
  const [posts, hiddenSlugs] = await Promise.all([getAllPosts(), getHiddenSlugs()]);
  // getAllPosts() is newest-first.
  const latest = posts.filter(p => isPublished(p) && !hiddenSlugs.includes(p.slug)).slice(0, 8);
  return <HomeV4 posts={latest} />;
}
