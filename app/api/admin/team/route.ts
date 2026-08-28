import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/admin/auth';
import { getTeamOverride, setTeam } from '@/lib/admin/team-kv';
import { DEFAULT_TEAM, type TeamMember } from '@/lib/team-defaults';
import { revalidatePath } from 'next/cache';

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const override = await getTeamOverride();
  return NextResponse.json(override ?? DEFAULT_TEAM);
}

export async function PUT(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== 'webadmin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  if (!Array.isArray(body)) {
    return NextResponse.json({ error: 'Expected an array of team members' }, { status: 400 });
  }

  const list: TeamMember[] = [];
  for (const item of body) {
    const name = typeof item?.name === 'string' ? item.name.trim() : '';
    const title = typeof item?.title === 'string' ? item.title.trim() : '';
    const img = typeof item?.img === 'string' ? item.img.trim() : '';
    const id = typeof item?.id === 'string' && item.id ? item.id : `member-${Date.now()}-${list.length}`;
    if (!name || !title || !img) {
      return NextResponse.json({ error: 'Every team member needs a name, title, and photo' }, { status: 400 });
    }
    if (name.length > 100 || title.length > 100) {
      return NextResponse.json({ error: 'Name or title is too long' }, { status: 400 });
    }
    list.push({ id, name, title, img });
  }

  await setTeam(list);
  revalidatePath('/about-us');
  return NextResponse.json(list);
}

// Removes the saved override so the page falls back to the hardcoded
// DEFAULT_TEAM — mirrors the blog content editor's "Reset to Default".
export async function DELETE() {
  const session = await getSession();
  if (!session || session.role !== 'webadmin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  await setTeam(DEFAULT_TEAM);
  revalidatePath('/about-us');
  return NextResponse.json({ ok: true });
}
