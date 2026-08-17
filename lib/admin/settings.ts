// Google Sheets sync settings — set by the webadmin from /admin/enquiries.
// Persisted to Vercel KV in production (like SEO overrides) with a file
// fallback for local dev where KV env vars aren't configured.
import fs from 'fs';
import path from 'path';
import { kv } from '@vercel/kv';

export interface SheetSettings {
  enabled: boolean;
  sheetUrl: string;    // Google Sheet link (for the admin to open/view)
  webhookUrl: string;  // Apps Script Web App URL that appends rows to the sheet
  updatedAt: string;
}

export const DEFAULT_SHEET_SETTINGS: SheetSettings = {
  enabled: false,
  sheetUrl: '',
  webhookUrl: '',
  updatedAt: '',
};

const KV_KEY = 'settings:google-sheets';
const FILE =
  process.env.NODE_ENV === 'production'
    ? '/tmp/sheet-settings.json'
    : path.join(process.cwd(), 'data', 'sheet-settings.json');

function readFileSettings(): SheetSettings | null {
  try {
    const parsed = JSON.parse(fs.readFileSync(FILE, 'utf-8'));
    return parsed && typeof parsed === 'object' ? { ...DEFAULT_SHEET_SETTINGS, ...parsed } : null;
  } catch {
    return null;
  }
}

function writeFileSettings(settings: SheetSettings): void {
  try {
    const dir = path.dirname(FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(FILE, JSON.stringify(settings, null, 2), 'utf-8');
  } catch {
    // Never throw — a persistence failure must not crash the API
  }
}

export async function getSheetSettings(): Promise<SheetSettings> {
  try {
    const fromKv = await kv.get<SheetSettings>(KV_KEY);
    if (fromKv) return { ...DEFAULT_SHEET_SETTINGS, ...fromKv };
  } catch {
    // KV not configured (local dev) — fall through to file
  }
  return readFileSettings() ?? DEFAULT_SHEET_SETTINGS;
}

export async function saveSheetSettings(
  settings: Omit<SheetSettings, 'updatedAt'>,
): Promise<SheetSettings> {
  const full: SheetSettings = { ...settings, updatedAt: new Date().toISOString() };
  try {
    await kv.set(KV_KEY, full);
  } catch {
    // KV not configured — file fallback below still persists it
  }
  writeFileSettings(full);
  return full;
}

// Appends one row to the configured Google Sheet via the Apps Script webhook.
// Returns true on success; never throws (a sheet failure must not lose an enquiry).
export async function appendToSheet(row: {
  receivedAt: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
  source?: string;
}): Promise<boolean> {
  const settings = await getSheetSettings();
  if (!settings.enabled || !settings.webhookUrl) return false;
  try {
    const res = await fetch(settings.webhookUrl, {
      method: 'POST',
      // text/plain keeps Apps Script's doPost happy and the raw JSON readable
      // via e.postData.contents; script.google.com 302-redirects and fetch follows.
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(row),
      signal: AbortSignal.timeout(8000),
    });
    return res.ok;
  } catch {
    return false;
  }
}
