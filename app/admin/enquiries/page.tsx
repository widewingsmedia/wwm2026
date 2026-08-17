'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminShell from '@/components/admin/AdminShell';
import type { SessionPayload } from '@/lib/admin/auth';
import type { Enquiry } from '@/lib/admin/store';
import type { SheetSettings } from '@/lib/admin/settings';

const APPS_SCRIPT_CODE = `function doPost(e) {
  var d = JSON.parse(e.postData.contents);
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet;

  if (d.source === 'leadsheet') {
    // /leadsheet submissions — target the "Direct Leads" tab by name (trimmed,
    // case-insensitive so stray spacing/capitalization doesn't break the match).
    sheet = ss.getSheets().find(function (s) {
      return s.getName().trim().toLowerCase() === 'direct leads';
    });
    if (!sheet) {
      throw new Error('No tab named "Direct Leads" was found in this spreadsheet.');
    }
  } else {
    // Regular /contact submissions — targets the "Website Leads" tab by name
    // (trimmed, case-insensitive so stray spacing/capitalization doesn't break
    // the match) so rows always land there, regardless of which tab was last
    // active in the UI.
    sheet = ss.getSheets().find(function (s) {
      return s.getName().trim().toLowerCase() === 'website leads';
    });
    if (!sheet) {
      throw new Error('No tab named "Website Leads" was found in this spreadsheet.');
    }
  }

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['Date', 'Full Name', 'Email', 'Phone', 'Requested Service', 'Message']);
  }
  sheet.appendRow([d.receivedAt, d.name, d.email, d.phone, d.service, d.message]);
  return ContentService.createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}`;

export default function EnquiriesAdmin() {
  const router = useRouter();
  const [session, setSession] = useState<SessionPayload | null>(null);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [selected, setSelected] = useState<Enquiry | null>(null);
  const [filter, setFilter] = useState<'all' | 'new' | 'read'>('all');
  const [loading, setLoading] = useState(true);
  const [sheets, setSheets] = useState<SheetSettings | null>(null);
  const [sheetsMsg, setSheetsMsg] = useState<{ kind: 'ok' | 'err'; text: string } | null>(null);
  const [sheetsBusy, setSheetsBusy] = useState(false);

  useEffect(() => {
    fetch('/api/admin/session').then(r => r.ok ? r.json() : null).then(s => {
      if (!s) return;
      setSession(s);
      if (s.role === 'webadmin') {
        fetch('/api/admin/settings').then(r => r.ok ? r.json() : null).then(cfg => cfg && setSheets(cfg));
      }
    });
    fetch('/api/admin/enquiries').then(r => {
      if (r.status === 401) { router.push('/admin/login'); return; }
      return r.json();
    }).then(data => { if (data) setEnquiries(data); setLoading(false); });
  }, []);

  async function saveSheets() {
    if (!sheets) return;
    setSheetsBusy(true);
    setSheetsMsg(null);
    const res = await fetch('/api/admin/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ enabled: sheets.enabled, sheetUrl: sheets.sheetUrl, webhookUrl: sheets.webhookUrl }),
    });
    const body = await res.json().catch(() => null);
    if (res.ok) {
      setSheets(body);
      setSheetsMsg({ kind: 'ok', text: 'Settings saved.' });
    } else {
      setSheetsMsg({ kind: 'err', text: body?.error ?? 'Could not save settings.' });
    }
    setSheetsBusy(false);
  }

  async function sendTestRow() {
    setSheetsBusy(true);
    setSheetsMsg(null);
    const res = await fetch('/api/admin/settings', { method: 'POST' });
    const body = await res.json().catch(() => null);
    setSheetsMsg(res.ok
      ? { kind: 'ok', text: 'Test row sent — check your Google Sheet.' }
      : { kind: 'err', text: body?.error ?? 'Test failed.' });
    setSheetsBusy(false);
  }

  async function markRead(e: Enquiry) {
    if (e.status === 'read') return;
    await fetch('/api/admin/enquiries', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: e.id }) });
    setEnquiries(prev => prev.map(x => x.id === e.id ? { ...x, status: 'read' } : x));
  }

  function openEnquiry(e: Enquiry) {
    setSelected(e);
    markRead(e);
  }

  const filtered = filter === 'all' ? enquiries : enquiries.filter(e => e.status === filter);
  const newCount = enquiries.filter(e => e.status === 'new').length;
  const fakeSession: SessionPayload = session ?? { username: 'enquiry', role: 'enquiry', displayName: 'Enquiry Viewer' };

  return (
    <AdminShell session={fakeSession} title="Enquiries" subtitle="Messages received from the website contact form">

      {/* STATS */}
      <div className="adm-stat-grid" style={{ marginBottom: 24 }}>
        <div className="adm-stat adm-stat-accent">
          <div className="adm-stat-num">{enquiries.length}</div>
          <div className="adm-stat-label">Total Enquiries</div>
        </div>
        <div className="adm-stat adm-stat-orange">
          <div className="adm-stat-num">{newCount}</div>
          <div className="adm-stat-label">Unread</div>
        </div>
        <div className="adm-stat adm-stat-blue">
          <div className="adm-stat-num">{enquiries.length - newCount}</div>
          <div className="adm-stat-label">Read</div>
        </div>
      </div>

      {/* GOOGLE SHEETS SYNC — webadmin only */}
      {session?.role === 'webadmin' && sheets && (
        <div className="adm-card" style={{ marginBottom: 24 }}>
          <div className="adm-card-head">
            <div>
              <div className="adm-card-title">Google Sheets Sync</div>
              <div style={{ fontSize: '0.8rem', color: '#9ca3af', marginTop: 3 }}>
                Every contact form submission is also saved as a row in your Google Sheet — /contact goes to the &quot;Website Leads&quot; tab, /leadsheet goes to the &quot;Direct Leads&quot; tab in the same sheet.
              </div>
            </div>
            <span className={`adm-badge ${sheets.enabled ? 'adm-badge-new' : 'adm-badge-read'}`}>
              {sheets.enabled ? '● Active' : 'Off'}
            </span>
          </div>

          <div style={{ display: 'grid', gap: 14, maxWidth: 720 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: '0.88rem', fontWeight: 600 }}>
              <input
                type="checkbox"
                checked={sheets.enabled}
                onChange={e => setSheets({ ...sheets, enabled: e.target.checked })}
                style={{ width: 16, height: 16, accentColor: '#a73184' }}
              />
              Save form submissions to Google Sheet
            </label>

            <div>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>
                Google Sheet Link {sheets.sheetUrl && (
                  <a href={sheets.sheetUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#a73184', textTransform: 'none', letterSpacing: 0, marginLeft: 8 }}>
                    Open Sheet ↗
                  </a>
                )}
              </div>
              <input
                className="adm-input"
                type="url"
                placeholder="https://docs.google.com/spreadsheets/d/…"
                value={sheets.sheetUrl}
                onChange={e => setSheets({ ...sheets, sheetUrl: e.target.value })}
                style={{ width: '100%' }}
              />
            </div>

            <div>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>
                Apps Script Web App URL (this is what writes the rows)
              </div>
              <input
                className="adm-input"
                type="url"
                placeholder="https://script.google.com/macros/s/…/exec"
                value={sheets.webhookUrl}
                onChange={e => setSheets({ ...sheets, webhookUrl: e.target.value })}
                style={{ width: '100%' }}
              />
            </div>

            {sheetsMsg && (
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: sheetsMsg.kind === 'ok' ? '#16a34a' : '#e53e3e' }}>
                {sheetsMsg.text}
              </div>
            )}

            <div style={{ display: 'flex', gap: 10 }}>
              <button className="adm-btn adm-btn-primary" onClick={saveSheets} disabled={sheetsBusy}>
                {sheetsBusy ? 'Working…' : 'Save Settings'}
              </button>
              <button className="adm-btn adm-btn-outline" onClick={sendTestRow} disabled={sheetsBusy || !sheets.webhookUrl}>
                Send Test Row
              </button>
            </div>

            <details style={{ fontSize: '0.85rem', color: '#4b5563', lineHeight: 1.7 }}>
              <summary style={{ cursor: 'pointer', fontWeight: 700, color: '#a73184' }}>
                How to connect your Google Sheet (one-time setup)
              </summary>
              <ol style={{ paddingLeft: 20, marginTop: 10, display: 'grid', gap: 6 }}>
                <li>Open (or create) your Google Sheet, then go to <strong>Extensions → Apps Script</strong>.</li>
                <li>Delete any code there and paste the script below, then click <strong>Save</strong>.</li>
                <li>Make sure your sheet has a tab named exactly &quot;Website Leads&quot; (for /contact) and one named exactly &quot;Direct Leads&quot; (for /leadsheet) — the script matches by name, case-insensitive.</li>
                <li>
                  If you already have a deployment: <strong>Deploy → Manage deployments</strong>, click the pencil icon, and choose <strong>New version</strong> so the same Web app URL picks up the updated code.<br />
                  If this is a first-time setup: <strong>Deploy → New deployment → Web app</strong>. Set <em>Execute as: Me</em> and <em>Who has access: Anyone</em>, then click <strong>Deploy</strong> and authorise it.
                </li>
                <li>Copy the <strong>Web app URL</strong> (ends in <code>/exec</code>) and paste it in the field above, along with your sheet&apos;s normal link.</li>
                <li>Tick the checkbox, click <strong>Save Settings</strong>, then <strong>Send Test Row</strong> to confirm a row appears in the &quot;Website Leads&quot; tab (test rows always use the default /contact routing).</li>
              </ol>
              <pre style={{ background: '#0f0f1a', color: '#d1d5db', padding: 14, borderRadius: 6, overflowX: 'auto', fontSize: '0.75rem', marginTop: 10 }}>
                {APPS_SCRIPT_CODE}
              </pre>
            </details>
          </div>
        </div>
      )}

      <div className="adm-card">
        <div className="adm-card-head">
          <div className="adm-card-title">All Enquiries</div>
          <div style={{ display: 'flex', gap: 6 }}>
            {(['all', 'new', 'read'] as const).map(f => (
              <button key={f} className={`adm-btn adm-btn-sm ${filter === f ? 'adm-btn-primary' : 'adm-btn-outline'}`} onClick={() => setFilter(f)}>
                {f === 'all' ? 'All' : f === 'new' ? `New (${newCount})` : 'Read'}
              </button>
            ))}
          </div>
        </div>

        <table className="adm-table">
          <thead>
            <tr>
              <th>Status</th><th>Name</th><th>Contact</th><th>Service</th><th>Received</th><th></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} style={{ textAlign: 'center', color: '#9ca3af', padding: '32px' }}>Loading…</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={6} style={{ textAlign: 'center', color: '#9ca3af', padding: '32px' }}>No enquiries found.</td></tr>
            ) : filtered.map(e => (
              <tr key={e.id} style={{ cursor: 'pointer' }} onClick={() => openEnquiry(e)}>
                <td><span className={`adm-badge ${e.status === 'new' ? 'adm-badge-new' : 'adm-badge-read'}`}>{e.status === 'new' ? '● New' : '✓ Read'}</span></td>
                <td><strong style={{ color: '#0f0f1a' }}>{e.name}</strong></td>
                <td>
                  <div style={{ fontSize: '0.85rem' }}>{e.email}</div>
                  <div style={{ fontSize: '0.78rem', color: '#9ca3af' }}>{e.phone}</div>
                </td>
                <td style={{ fontSize: '0.85rem' }}>{e.service}</td>
                <td style={{ color: '#9ca3af', fontSize: '0.82rem', whiteSpace: 'nowrap' }}>
                  {new Date(e.receivedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                  <br />
                  {new Date(e.receivedAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                </td>
                <td>
                  <button className="adm-btn adm-btn-outline adm-btn-sm" onClick={ev => { ev.stopPropagation(); openEnquiry(e); }}>View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {selected && (
        <div className="adm-overlay" onClick={() => setSelected(null)}>
          <div className="adm-modal" onClick={e => e.stopPropagation()}>
            <div className="adm-modal-head">
              <div>
                <div className="adm-modal-title">Enquiry from {selected.name}</div>
                <div style={{ color: '#9ca3af', fontSize: '0.8rem', marginTop: 3 }}>
                  {new Date(selected.receivedAt).toLocaleString('en-GB', { dateStyle: 'long', timeStyle: 'short' })}
                </div>
              </div>
              <button className="adm-modal-close" onClick={() => setSelected(null)}>×</button>
            </div>

            <div className="adm-detail-row"><span className="adm-detail-key">Name</span><span className="adm-detail-val">{selected.name}</span></div>
            <div className="adm-detail-row"><span className="adm-detail-key">Email</span>
              <span className="adm-detail-val"><a href={`mailto:${selected.email}`} style={{ color: '#a73184' }}>{selected.email}</a></span>
            </div>
            <div className="adm-detail-row"><span className="adm-detail-key">Phone</span>
              <span className="adm-detail-val"><a href={`tel:${selected.phone}`} style={{ color: '#a73184' }}>{selected.phone}</a></span>
            </div>
            <div className="adm-detail-row"><span className="adm-detail-key">Service</span><span className="adm-detail-val">{selected.service}</span></div>
            <div className="adm-detail-row"><span className="adm-detail-key">Status</span>
              <span className="adm-detail-val"><span className={`adm-badge ${selected.status === 'new' ? 'adm-badge-new' : 'adm-badge-read'}`}>{selected.status}</span></span>
            </div>

            <div style={{ marginTop: 16 }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>Message</div>
              <div className="adm-detail-msg">{selected.message}</div>
            </div>

            <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
              <a href={`mailto:${selected.email}?subject=Re: Your enquiry about ${selected.service}`} className="adm-btn adm-btn-primary" style={{ textDecoration: 'none' }}>
                Reply via Email
              </a>
              <button className="adm-btn adm-btn-outline" onClick={() => setSelected(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
