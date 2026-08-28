import { redirect } from 'next/navigation';
import { getSession } from '@/lib/admin/auth';
import AdminShell from '@/components/admin/AdminShell';
import NewBlogPostUploader from '@/components/admin/NewBlogPostUploader';

export default async function NewBlogPostPage() {
  const session = await getSession();
  if (!session) redirect('/admin/login');
  if (session.role !== 'webadmin') redirect('/admin/dashboard');

  return (
    <AdminShell session={session} title="New Blog Post" subtitle="Upload a filled-in blog template — it publishes straight to the live site, no code push needed">
      <NewBlogPostUploader />
    </AdminShell>
  );
}
