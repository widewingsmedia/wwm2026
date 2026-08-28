import { kv } from '@vercel/kv';
import type { TeamMember } from '@/lib/team-defaults';

const KV_KEY = 'settings:team';

export async function getTeamOverride(): Promise<TeamMember[] | null> {
  try {
    return await kv.get<TeamMember[]>(KV_KEY);
  } catch {
    return null;
  }
}

export async function setTeam(list: TeamMember[]): Promise<void> {
  await kv.set(KV_KEY, list);
}
