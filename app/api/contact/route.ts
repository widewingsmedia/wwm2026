import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/admin/store';
import { appendToSheet } from '@/lib/admin/settings';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== 'object') {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const name = typeof body.name === 'string' ? body.name.trim() : '';
  const email = typeof body.email === 'string' ? body.email.trim() : '';
  const phone = typeof body.phone === 'string' ? body.phone.trim() : '';
  const service = typeof body.service === 'string' ? body.service.trim() : '';
  const message = typeof body.message === 'string' ? body.message.trim() : '';
  const source = body.source === 'leadsheet' ? 'leadsheet' : 'contact';

  if (!name || !email || !service || !message) {
    return NextResponse.json({ error: 'Please fill in all required fields.' }, { status: 400 });
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
  }
  if (name.length > 200 || email.length > 200 || phone.length > 50 || service.length > 100 || message.length > 5000) {
    return NextResponse.json({ error: 'One of the fields is too long.' }, { status: 400 });
  }

  const enquiry = store.enquiries.add({ name, email, phone, service, message, source });

  // Mirror to Google Sheets if the webadmin has configured sync.
  // A sheet failure never blocks the submission — the enquiry is already stored.
  const sheetSynced = await appendToSheet({
    receivedAt: enquiry.receivedAt,
    name, email, phone, service, message, source,
  });

  return NextResponse.json({ ok: true, id: enquiry.id, sheetSynced });
}
