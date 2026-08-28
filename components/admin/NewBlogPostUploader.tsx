'use client';
import { useState } from 'react';

interface FaqItem { q: string; a: string; }

interface ParsedBlog {
  title: string;
  slug: string;
  metaTitle: string;
  metaDescription: string;
  category: string;
  bodyHtml: string;
  faqItems: FaqItem[];
  embeddedImage: string | null;
  suggestedImage: string;
  warnings: string[];
}

const CATEGORIES = ['SEO', 'Social Media', 'Digital Marketing', 'PR', 'Email Marketing', 'Technology', 'Content', 'Branding', 'PPC', 'Advertising', 'Web Development'];

// Client-side resize + compress to a small base64 data URI — same approach
// used for team photos in app/admin/team/page.tsx.
function compressToDataUrl(file: File, maxWidth = 1200, quality = 0.8): Promise<string> {
  return new Promise((resolve, reject) => {
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

// <input type="datetime-local"> gives a bare "YYYY-MM-DDTHH:mm" with no
// timezone. Stamp it with the browser's own UTC offset so "9:00 AM" means
// 9:00 AM wherever the admin actually is when scheduling it — otherwise the
// server (which runs in UTC) would publish it several hours off.
function toIsoWithOffset(local: string): string {
  if (!local) return '';
  const offsetMin = -new Date().getTimezoneOffset();
  const sign = offsetMin >= 0 ? '+' : '-';
  const abs = Math.abs(offsetMin);
  const hh = String(Math.floor(abs / 60)).padStart(2, '0');
  const mm = String(abs % 60).padStart(2, '0');
  return `${local}:00${sign}${hh}:${mm}`;
}

const inputStyle: React.CSSProperties = { width: '100%' };
const labelStyle: React.CSSProperties = { fontSize: '0.78rem', fontWeight: 600, color: '#9ca3af', marginBottom: 4, display: 'block' };
const fieldWrap: React.CSSProperties = { marginBottom: 14 };

export default function NewBlogPostUploader() {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [parsed, setParsed] = useState<ParsedBlog | null>(null);
  const [image, setImage] = useState<string>('');
  const [cta, setCta] = useState('Learn more');
  const [publishAt, setPublishAt] = useState('');
  const [publishing, setPublishing] = useState(false);
  const [result, setResult] = useState<{ url: string } | null>(null);
  const [publishError, setPublishError] = useState('');

  // Editable copies of the parsed fields
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [category, setCategory] = useState('');

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';
    setUploading(true);
    setError('');
    setParsed(null);
    setResult(null);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/admin/blog-upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? 'Upload failed'); return; }
      const p: ParsedBlog = data.parsed;
      setParsed(p);
      setTitle(p.title);
      setSlug(p.slug);
      setMetaTitle(p.metaTitle);
      setMetaDescription(p.metaDescription);
      setCategory(p.category);
      setImage(p.embeddedImage || '');
      setCta('Learn more');
      setPublishAt('');
    } catch {
      setError('Network error — try again');
    } finally {
      setUploading(false);
    }
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';
    try {
      setImage(await compressToDataUrl(file));
    } catch {
      setError('Could not process that image');
    }
  }

  async function handlePublish() {
    if (!parsed) return;
    setPublishing(true);
    setPublishError('');
    try {
      const res = await fetch('/api/admin/blog-publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug, title, category, image, cta, publishAt: publishAt ? toIsoWithOffset(publishAt) : undefined,
          metaTitle, metaDescription,
          bodyHtml: parsed.bodyHtml,
          faqItems: parsed.faqItems,
        }),
      });
      const data = await res.json();
      if (!res.ok) { setPublishError(data.error ?? 'Publish failed'); return; }
      setResult({ url: data.url });
    } catch {
      setPublishError('Network error — try again');
    } finally {
      setPublishing(false);
    }
  }

  function reset() {
    setParsed(null);
    setResult(null);
    setError('');
    setPublishError('');
  }

  return (
    <div className="new-blog-uploader">
      {!parsed && (
        <div className="adm-card">
          <div className="adm-card-head">
            <div className="adm-card-title">Upload Filled Template</div>
          </div>
          <div style={{ padding: '24px', textAlign: 'center' }}>
            <p style={{ color: '#9ca3af', fontSize: '0.85rem', marginBottom: 16 }}>
              Upload a filled-in copy of the blog post .docx template. It&apos;s parsed automatically —
              you&apos;ll get a preview to review and edit before anything goes live.
            </p>
            <label style={{
              display: 'inline-flex', alignItems: 'center', gap: 8, cursor: 'pointer',
              padding: '12px 24px', borderRadius: 8, fontSize: '0.85rem', fontWeight: 700,
              background: '#a73184', color: '#fff', border: 'none',
            }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
              {uploading ? 'Parsing…' : 'Upload .docx File'}
              <input type="file" accept=".docx" onChange={handleFile} disabled={uploading} style={{ display: 'none' }} />
            </label>
            {error && (
              <div style={{ marginTop: 16, padding: '10px 16px', borderRadius: 6, background: '#450a0a', color: '#f87171', fontSize: '0.82rem', textAlign: 'left' }}>
                ✕ {error}
              </div>
            )}
          </div>
        </div>
      )}

      {parsed && !result && (
        <>
          {parsed.warnings.length > 0 && (
            <div className="adm-card" style={{ marginBottom: 16, borderColor: '#92640a' }}>
              <div style={{ padding: '14px 20px', background: '#3a2a05' }}>
                <div style={{ fontWeight: 700, color: '#facc15', fontSize: '0.82rem', marginBottom: 6 }}>⚠ Check before publishing</div>
                <ul style={{ margin: 0, paddingLeft: 18, color: '#fde68a', fontSize: '0.8rem', lineHeight: 1.6 }}>
                  {parsed.warnings.map((w, i) => <li key={i}>{w}</li>)}
                </ul>
              </div>
            </div>
          )}

          <div className="adm-card" style={{ marginBottom: 16 }}>
            <div className="adm-card-head">
              <div className="adm-card-title">Post Details</div>
              <button className="adm-btn adm-btn-outline adm-btn-sm" onClick={reset}>Start Over</button>
            </div>
            <div style={{ padding: '20px 24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 20px' }}>
              <div style={fieldWrap}>
                <label style={labelStyle}>Title (H1)</label>
                <input className="adm-input" style={inputStyle} value={title} onChange={e => setTitle(e.target.value)} />
              </div>
              <div style={fieldWrap}>
                <label style={labelStyle}>Slug</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ color: '#6b7280', fontSize: '0.85rem' }}>/</span>
                  <input className="adm-input" style={inputStyle} value={slug} onChange={e => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))} />
                  <span style={{ color: '#6b7280', fontSize: '0.85rem' }}>/</span>
                </div>
              </div>
              <div style={fieldWrap}>
                <label style={labelStyle}>Category</label>
                <select className="adm-input" style={inputStyle} value={category} onChange={e => setCategory(e.target.value)}>
                  {!CATEGORIES.includes(category) && <option value={category}>{category}</option>}
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div style={fieldWrap}>
                <label style={labelStyle}>Card Button Text</label>
                <input className="adm-input" style={inputStyle} value={cta} onChange={e => setCta(e.target.value)} />
              </div>
              <div style={{ ...fieldWrap, gridColumn: '1 / -1' }}>
                <label style={labelStyle}>Meta Title</label>
                <input className="adm-input" style={inputStyle} value={metaTitle} onChange={e => setMetaTitle(e.target.value)} />
              </div>
              <div style={{ ...fieldWrap, gridColumn: '1 / -1' }}>
                <label style={labelStyle}>Meta Description</label>
                <textarea className="adm-input" style={{ ...inputStyle, minHeight: 60 }} value={metaDescription} onChange={e => setMetaDescription(e.target.value)} />
              </div>
              <div style={fieldWrap}>
                <label style={labelStyle}>Schedule (optional — leave blank to publish immediately)</label>
                <input type="datetime-local" className="adm-input" style={inputStyle} value={publishAt} onChange={e => setPublishAt(e.target.value)} />
              </div>
              <div style={fieldWrap}>
                <label style={labelStyle}>Featured Image</label>
                <label style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6, cursor: 'pointer',
                  padding: '7px 14px', borderRadius: 6, fontSize: '0.78rem', fontWeight: 600,
                  background: '#1f2937', color: '#d1d5db', border: '1px solid #374151',
                }}>
                  Upload Image
                  <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                </label>
                {parsed.suggestedImage && !image && (
                  <div style={{ fontSize: '0.72rem', color: '#facc15', marginTop: 6 }}>
                    Suggested from doc: &ldquo;{parsed.suggestedImage}&rdquo;
                  </div>
                )}
              </div>
              {image && (
                <div style={{ gridColumn: '1 / -1', marginTop: 4 }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={image} alt="Featured" style={{ maxWidth: 240, borderRadius: 8, border: '1px solid #374151' }} />
                </div>
              )}
            </div>
          </div>

          <div className="adm-card" style={{ marginBottom: 16 }}>
            <div className="adm-card-head"><div className="adm-card-title">Body Preview ({parsed.faqItems.length} FAQ{parsed.faqItems.length === 1 ? '' : 's'})</div></div>
            <div className="bp-article" style={{ padding: '20px 24px', maxHeight: 500, overflowY: 'auto', color: '#e5e7eb', lineHeight: 1.8 }}
              dangerouslySetInnerHTML={{ __html: parsed.bodyHtml }} />
            {parsed.faqItems.length > 0 && (
              <div style={{ padding: '0 24px 20px' }}>
                <div style={{ fontWeight: 700, color: '#9ca3af', fontSize: '0.82rem', marginBottom: 8 }}>FAQ</div>
                {parsed.faqItems.map((f, i) => (
                  <div key={i} style={{ marginBottom: 10 }}>
                    <div style={{ color: '#e2e8f0', fontWeight: 600, fontSize: '0.85rem' }}>{f.q}</div>
                    <div style={{ color: '#9ca3af', fontSize: '0.82rem' }}>{f.a}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button className="adm-btn adm-btn-primary" onClick={handlePublish} disabled={publishing || !slug || !title}>
              {publishing ? 'Publishing…' : (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  {publishAt ? 'Schedule Post' : 'Publish Now'}
                </>
              )}
            </button>
            {publishError && (
              <span style={{ fontSize: '0.82rem', padding: '6px 12px', borderRadius: 6, background: '#450a0a', color: '#f87171' }}>
                ✕ {publishError}
              </span>
            )}
          </div>
        </>
      )}

      {result && (
        <div className="adm-card">
          <div style={{ padding: '32px 24px', textAlign: 'center' }}>
            <div style={{ fontSize: '1.4rem', marginBottom: 8 }}>✓</div>
            <div style={{ fontWeight: 700, color: '#e2e8f0', marginBottom: 8 }}>
              {publishAt ? 'Scheduled!' : 'Published!'}
            </div>
            <a href={result.url} target="_blank" rel="noopener noreferrer" style={{ color: '#3b82f6', fontSize: '0.85rem', wordBreak: 'break-all' }}>
              {result.url}
            </a>
            <div style={{ marginTop: 20 }}>
              <button className="adm-btn adm-btn-outline" onClick={reset}>Upload Another Post</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
