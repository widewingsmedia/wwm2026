'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminShell from '@/components/admin/AdminShell';
import type { SessionPayload } from '@/lib/admin/auth';
import type { TeamMember } from '@/lib/team-defaults';

type Row = TeamMember & { _key: string };

function makeKey() {
  return Math.random().toString(36).slice(2);
}

// Client-side resize + compress to a small base64 data URI (no external
// storage needed — this is stored directly alongside the team list).
function compressToDataUrl(file: File, maxWidth = 500, quality = 0.75): Promise<string> {
  return new Promise((resolve, reject) => {
    if (file.type === 'image/svg+xml') {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
      return;
    }
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      let { width, height } = img;
      if (width > maxWidth) {
        height = Math.round(height * (maxWidth / width));
        width = maxWidth;
      }
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      canvas.getContext('2d')!.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/webp', quality));
    };
    img.onerror = reject;
    img.src = url;
  });
}

export default function TeamAdmin() {
  const router = useRouter();
  const [session, setSession] = useState<SessionPayload | null>(null);
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ kind: 'ok' | 'err'; text: string } | null>(null);

  useEffect(() => {
    fetch('/api/admin/session').then(r => r.ok ? r.json() : null).then(s => {
      if (!s) { router.push('/admin/login'); return; }
      setSession(s);
    });
    fetch('/api/admin/team').then(r => {
      if (r.status === 401) { router.push('/admin/login'); return null; }
      return r.json();
    }).then(data => {
      if (data) setRows(data.map((m: TeamMember) => ({ ...m, _key: makeKey() })));
      setLoading(false);
    });
  }, []);

  function updateRow(key: string, patch: Partial<Row>) {
    setRows(prev => prev.map(r => r._key === key ? { ...r, ...patch } : r));
  }

  function addRow() {
    setRows(prev => [{ id: '', name: '', title: '', img: '', _key: makeKey() }, ...prev]);
  }

  function removeRow(key: string) {
    setRows(prev => prev.filter(r => r._key !== key));
  }

  function moveRow(key: string, dir: -1 | 1) {
    setRows(prev => {
      const i = prev.findIndex(r => r._key === key);
      const j = i + dir;
      if (i === -1 || j < 0 || j >= prev.length) return prev;
      const next = [...prev];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  }

  async function handlePhoto(key: string, file: File) {
    setMsg(null);
    try {
      const dataUrl = await compressToDataUrl(file);
      updateRow(key, { img: dataUrl });
    } catch {
      setMsg({ kind: 'err', text: 'Could not read that image — try a different file.' });
    }
  }

  async function save() {
    setSaving(true);
    setMsg(null);
    const missing = rows.find(r => !r.name.trim() || !r.title.trim() || !r.img);
    if (missing) {
      setMsg({ kind: 'err', text: 'Every team member needs a name, title, and photo before saving.' });
      setSaving(false);
      return;
    }
    const res = await fetch('/api/admin/team', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(rows.map(({ _key, ...m }) => m)),
    });
    const body = await res.json().catch(() => null);
    if (res.ok) {
      setRows(body.map((m: TeamMember) => ({ ...m, _key: makeKey() })));
      setMsg({ kind: 'ok', text: 'Team saved — live on the About Us page now.' });
    } else {
      setMsg({ kind: 'err', text: body?.error ?? 'Could not save.' });
    }
    setSaving(false);
  }

  async function resetToDefault() {
    if (!confirm('Reset the team list to the original default roster? This discards any changes made here.')) return;
    setSaving(true);
    const res = await fetch('/api/admin/team', { method: 'DELETE' });
    if (res.ok) {
      const data = await fetch('/api/admin/team').then(r => r.json());
      setRows(data.map((m: TeamMember) => ({ ...m, _key: makeKey() })));
      setMsg({ kind: 'ok', text: 'Reset to the default team roster.' });
    } else {
      setMsg({ kind: 'err', text: 'Could not reset.' });
    }
    setSaving(false);
  }

  if (!session) return null;

  return (
    <AdminShell session={session} title="Team" subtitle="Add, edit, reorder, or remove the team shown on the About Us page">
      <div className="adm-card" style={{ marginBottom: 20 }}>
        <div className="adm-card-head">
          <div className="adm-card-title">Team Members ({rows.length})</div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="adm-btn adm-btn-outline adm-btn-sm" onClick={resetToDefault} disabled={saving || loading}>
              Reset to Default
            </button>
            <button className="adm-btn adm-btn-primary adm-btn-sm" onClick={addRow} disabled={saving || loading}>
              + Add Member
            </button>
          </div>
        </div>

        {msg && (
          <div style={{
            margin: '0 24px 16px', fontSize: '0.85rem', fontWeight: 600, padding: '10px 14px', borderRadius: 6,
            background: msg.kind === 'ok' ? '#052e16' : '#450a0a', color: msg.kind === 'ok' ? '#4ade80' : '#f87171',
          }}>
            {msg.kind === 'ok' ? '✓ ' : '✕ '}{msg.text}
          </div>
        )}

        {loading ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#6b7280' }}>Loading…</div>
        ) : (
          <div style={{ display: 'grid', gap: 12, padding: '0 24px 20px' }}>
            {rows.length === 0 && (
              <div style={{ color: '#6b7280', fontSize: '0.85rem', padding: '20px 0' }}>No team members yet — click &quot;Add Member&quot; to start.</div>
            )}
            {rows.map((r, i) => (
              <div key={r._key} style={{
                display: 'flex', alignItems: 'center', gap: 14, padding: 14,
                background: '#0f172a', border: '1px solid #1e293b', borderRadius: 10,
              }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <button className="adm-btn adm-btn-outline adm-btn-sm" style={{ padding: '2px 8px' }} onClick={() => moveRow(r._key, -1)} disabled={i === 0} title="Move up">↑</button>
                  <button className="adm-btn adm-btn-outline adm-btn-sm" style={{ padding: '2px 8px' }} onClick={() => moveRow(r._key, 1)} disabled={i === rows.length - 1} title="Move down">↓</button>
                </div>

                <label style={{ cursor: 'pointer', flexShrink: 0 }} title="Click to upload a photo">
                  {r.img ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={r.img} alt={r.name || 'Team member'} width={64} height={64} style={{ borderRadius: 8, objectFit: 'cover', width: 64, height: 64, border: '1px solid #334155' }} />
                  ) : (
                    <div style={{ width: 64, height: 64, borderRadius: 8, background: '#1e293b', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', fontSize: '0.65rem', textAlign: 'center', border: '1px dashed #334155' }}>
                      Upload photo
                    </div>
                  )}
                  <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => {
                    const file = e.target.files?.[0];
                    if (file) handlePhoto(r._key, file);
                    e.target.value = '';
                  }} />
                </label>

                <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <input className="adm-input" placeholder="Full name" value={r.name} onChange={e => updateRow(r._key, { name: e.target.value })} />
                  <input className="adm-input" placeholder="Title / role" value={r.title} onChange={e => updateRow(r._key, { title: e.target.value })} />
                  <input
                    className="adm-input"
                    style={{ gridColumn: '1 / -1', fontSize: '0.72rem', color: '#9ca3af' }}
                    placeholder="Photo path or URL — or use the thumbnail to upload one"
                    value={r.img.startsWith('data:') ? '(uploaded photo — click thumbnail to replace)' : r.img}
                    disabled={r.img.startsWith('data:')}
                    onChange={e => updateRow(r._key, { img: e.target.value })}
                  />
                </div>

                <button className="adm-btn adm-btn-outline adm-btn-sm" style={{ color: '#ef4444', borderColor: '#ef4444', flexShrink: 0 }} onClick={() => removeRow(r._key)}>
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}

        <div style={{ padding: '0 24px 24px' }}>
          <button className="adm-btn adm-btn-primary" onClick={save} disabled={saving || loading}>
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
        <strong style={{ color: '#9ca3af' }}>How it works:</strong> Upload a photo directly (it&apos;s resized and compressed automatically), or type a path/URL into the photo field instead if you&apos;d rather reuse an existing image. Changes go live on the About Us page as soon as you click Save.
      </div>
    </AdminShell>
  );
}
