import { kv } from '@vercel/kv';
import type { Redirect } from './store';

const KEY = 'redirects:all';

export async function getRedirectOverrides(): Promise<Redirect[] | null> {
  try {
    return await kv.get<Redirect[]>(KEY);
  } catch {
    return null;
  }
}

export async function saveRedirectOverrides(list: Redirect[]): Promise<boolean> {
  try {
    await kv.set(KEY, list);
    return true;
  } catch {
    return false;
  }
}
