import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getSession } from '@/lib/admin/auth';
import { getHiddenSlugs, setHidden } from '@/lib/admin/post-visibility-kv';

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== 'webadmin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return NextResponse.json({ hidden: await getHiddenSlugs() });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== 'webadmin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { slug, hidden } = await req.json() as { slug: string; hidden: boolean };
  if (!slug) return NextResponse.json({ error: 'Missing slug' }, { status: 400 });

  const list = await setHidden(slug, hidden);

  revalidatePath(`/${slug}`);
  revalidatePath('/insights');
  revalidatePath('/sitemap.xml');
  revalidatePath('/admin/blogs');

  return NextResponse.json({ ok: true, hidden: list });
}
