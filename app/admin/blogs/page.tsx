import { redirect } from 'next/navigation';
import { getSession } from '@/lib/admin/auth';
import AdminShell from '@/components/admin/AdminShell';
import BlogEditor from '@/components/admin/BlogEditor';
import BlogVisibilityList from '@/components/admin/BlogVisibilityList';
import { listPublishedSlugs } from '@/lib/admin/blog-kv';
import { getAllPosts } from '@/lib/admin/all-posts';
import { getHiddenSlugs } from '@/lib/admin/post-visibility-kv';

export default async function BlogsPage() {
  const session = await getSession();
  if (!session) redirect('/admin/login');
  if (session.role !== 'webadmin') redirect('/admin/dashboard');

  const [publishedSlugs, allPosts, hiddenSlugs] = await Promise.all([
    listPublishedSlugs(),
    getAllPosts(),
    getHiddenSlugs(),
  ]);

  return (
    <AdminShell session={session} title="Blog Content Editor" subtitle="Paste HTML content for any blog post and publish it live">

      {/* Stats bar */}
      <div className="adm-stat-grid" style={{ marginBottom: 20 }}>
        <div className="adm-stat adm-stat-accent">
          <div className="adm-stat-num">{allPosts.length}</div>
          <div className="adm-stat-label">Total Posts</div>
        </div>
        <div className="adm-stat adm-stat-blue">
          <div className="adm-stat-num">{publishedSlugs.length}</div>
          <div className="adm-stat-label">Custom Content</div>
        </div>
        <div className="adm-stat adm-stat-gold">
          <div className="adm-stat-num">{hiddenSlugs.length}</div>
          <div className="adm-stat-label">Hidden</div>
        </div>
      </div>

      <div style={{ marginBottom: 20 }}>
        <a href="/admin/blogs/new" className="adm-btn adm-btn-primary" style={{ textDecoration: 'none' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          New Blog Post from Template
        </a>
      </div>

      <BlogVisibilityList initialPosts={allPosts} initialHidden={hiddenSlugs} />

      <BlogEditor />
    </AdminShell>
  );
}
