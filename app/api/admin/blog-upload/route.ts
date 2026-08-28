import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/admin/auth';
import { parseBlogDocx } from '@/lib/blog-docx-parser';

// Parses an uploaded .docx into structured preview data — does NOT publish
// anything. The admin reviews/edits the result in the UI, then a separate
// call to /api/admin/blog-publish actually saves it live.
export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== 'webadmin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get('file');
  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
  }
  if (!file.name.toLowerCase().endsWith('.docx')) {
    return NextResponse.json({ error: 'Please upload a .docx file (not .doc or .pdf) — it needs real heading and link structure to parse reliably.' }, { status: 400 });
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const parsed = await parseBlogDocx(buffer);
    return NextResponse.json({ parsed });
  } catch (e) {
    return NextResponse.json(
      { error: `Couldn't read that file: ${e instanceof Error ? e.message : String(e)}` },
      { status: 400 },
    );
  }
}
