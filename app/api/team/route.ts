import { NextResponse } from 'next/server';
import { getTeamOverride } from '@/lib/admin/team-kv';
import { DEFAULT_TEAM } from '@/lib/team-defaults';

// Public — read by the About Us page. No auth required, matches the
// page it's serving.
export async function GET() {
  const override = await getTeamOverride();
  return NextResponse.json(override ?? DEFAULT_TEAM);
}
