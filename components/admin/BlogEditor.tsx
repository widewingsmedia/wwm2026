'use client';
import { useState, useEffect, useCallback } from 'react';
import { POSTS } from '@/app/blogs/posts-data';

type Tab = 'edit' | 'preview';

const SVG_CHEVRON = `<svg class="faq-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>`;

function extractBodyContent(input: string): string {
  const isFullDoc = input.includes('<!DOCTYPE') || input.includes('<html') || input.includes('<body');
  if (!isFullDoc) return input.trim();

  // Use browser DOMParser for correct nested-tag handling
  const parser = new DOMParser();
  const doc = parser.parseFromString(input, 'text/html');
  const body = doc.body;

  // ── 1. Remove site-wide chrome (header, nav, footer, sidebar) ──
  // These must be DELETED, not unwrapped, or their content leaks into the article
  body.querySelectorAll('header, footer, nav').forEach(e => e.remove());
  body.querySelectorAll(
    '[class*="site-header"],[class*="site-footer"],[class*="site-nav"],' +
    '[class*="main-nav"],[class*="top-bar"],[class*="breadcrumb"],' +
    '[id*="header"],[id*="footer"],[id*="nav"],[id*="menu"],' +
    '[class*="footer"],[class*="sidebar"],[class*="widget-area"],' +
    '[class*="social-icon"],[class*="social-media"],[class*="share-btn"],' +
    '[class*="cookie"],[class*="popup"],[class*="modal"],[class*="banner"]'
  ).forEach(e => e.remove());

  // Remove all SVG icons (social media logos etc.) — we inject our own for FAQ
  body.querySelectorAll('svg').forEach(e => e.remove());

  // Remove all images/media (blog page has its own featured image)
  body.querySelectorAll('img, picture, figure, figcaption, source, video, audio, iframe, embed').forEach(e => e.remove());

  // Remove loading overlay divs (Elementor sites inject a full-screen loader)
  body.querySelectorAll('*').forEach(el => {
    const cls = el.getAttribute('class') || '';
    if (/\bfixed\b/.test(cls) && /\binset\b|\bz-1\d{4}\b/.test(cls)) el.remove();
  });

  // Remove Elementor spacer/divider widgets and wp meta
  body.querySelectorAll(
    '[class*="widget-spacer"],[class*="widget-divider"],[class*="elementor-divider"],' +
    '[class*="elementor-spacer"],[class*="elementor-separator"],.meta'
  ).forEach(e => e.remove());

  // ── 2. Remove title tags ──
  // Remove all h1s (always a duplicate of the blog page title)
  body.querySelectorAll('h1').forEach(e => e.remove());
  // Only remove the first h2 if it appears before any paragraph text
  // (i.e. it's a redundant subtitle, not content)
  const firstH2 = body.querySelector('h2');
  const firstP = body.querySelector('p');
  if (firstH2 && firstP) {
    const pos = firstH2.compareDocumentPosition(firstP);
    // DOCUMENT_POSITION_FOLLOWING = 4 means firstP comes after firstH2
    if (pos & Node.DOCUMENT_POSITION_FOLLOWING) firstH2.remove();
  } else if (firstH2 && !firstP) {
    firstH2.remove();
  }

  // ── 2.5. Convert <br><br> to <p> tags INSIDE text containers (before unwrapping) ──
  // Elementor stores paragraphs as plain text separated by <br><br> inside widget divs.
  // Converting here means the <p> tags survive after the outer divs are unwrapped.
  const BLOCK_TAGS = ['H1','H2','H3','H4','H5','H6','UL','OL','TABLE','BLOCKQUOTE','DETAILS','P','SECTION','ARTICLE'];
  Array.from(body.querySelectorAll('div, td')).forEach(el => {
    // Skip if it has block-level children (it's a layout wrapper, not a text block)
    if (Array.from(el.children).some(c => BLOCK_TAGS.includes(c.tagName))) return;
    // Skip if no double-br (nothing to convert)
    if (!el.innerHTML.match(/(<br\s*\/?>\s*){2,}/i)) return;
    // Convert double-br to paragraph separator, then wrap in <p>
    const converted = el.innerHTML
      .replace(/\s*(<br\s*\/?>\s*){2,}/gi, '</p><p>')  // double br → para break
      .replace(/<br\s*\/?>/gi, ' ')                     // single br → space
      .replace(/^(<p>\s*<\/p>)+/, '')                   // remove empty leading p
      .replace(/(<p>\s*<\/p>)+$/, '');                  // remove empty trailing p
    el.innerHTML = `<p>${converted}</p>`;
  });

  // ── 3. Convert FAQ accordions → blog accordion ──
  // Handles two formats:
  //   A) <details>/<summary> (standard HTML / some Elementor builds)
  //   B) .accordion-item > .tab-title .accordion-title + .tab-content (WCF/Elementor widget)

  const buildAccordionItem = (q: string, a: string): Element => {
    const newItem = doc.createElement('details');
    newItem.className = 'faq-item';
    newItem.innerHTML = `<summary class="faq-question"><span>${q}</span>${SVG_CHEVRON}</summary><div class="faq-answer"><div class="faq-answer-inner">${a}</div></div>`;
    return newItem;
  };

  const findFaqHeading = (): Element | undefined => {
    let h: Element | undefined;
    body.querySelectorAll('h2, h3').forEach(el => {
      if (!h && /faq|frequently asked/i.test(el.textContent || '')) h = el;
    });
    return h;
  };

  // Format A: <details>/<summary>
  const allDetails = Array.from(body.querySelectorAll('details'));
  if (allDetails.length > 0) {
    const faqHeading = findFaqHeading();
    const accordion = doc.createElement('div');
    accordion.className = 'faq-accordion';
    allDetails.forEach(details => {
      const summary = details.querySelector('summary');
      const answerEl = details.querySelector('.faq-answer') || details.querySelector('div');
      const q = summary?.textContent?.trim() || '';
      const a = answerEl?.innerHTML?.trim() || '';
      accordion.appendChild(buildAccordionItem(q, a));
      details.remove();
    });
    if (faqHeading) faqHeading.after(accordion);
    else body.appendChild(accordion);
  }

  // Format B: .accordion-item > [.tab-title .accordion-title] + [.tab-content]
  const wcfItems = Array.from(body.querySelectorAll('.accordion-item'));
  if (wcfItems.length > 0) {
    const faqHeading = findFaqHeading();
    const accordion = doc.createElement('div');
    accordion.className = 'faq-accordion';
    wcfItems.forEach(item => {
      const titleEl = item.querySelector('.accordion-title');
      const contentEl = item.querySelector('.tab-content');
      const q = titleEl?.textContent?.trim() || '';
      const a = contentEl?.innerHTML?.trim() || '';
      if (q) accordion.appendChild(buildAccordionItem(q, a));
      item.remove();
    });
    // Also remove the parent wcf--a-accordion wrapper (will be unwrapped anyway, but clean up script tags inside)
    body.querySelectorAll('script').forEach(s => s.remove());
    if (faqHeading) faqHeading.after(accordion);
    else body.appendChild(accordion);
  }

  // ── 4. Unwrap all block wrapper elements (div, section, article, etc.) ──
  // but PROTECT elements that have faq-* classes (our accordion)
  for (let pass = 0; pass < 20; pass++) {
    const wrappers = Array.from(body.querySelectorAll('div, section, article, aside, header, footer, main, nav'));
    if (wrappers.length === 0) break;
    let anyRemoved = false;
    wrappers.forEach(el => {
      const cls = el.getAttribute('class') || '';
      if (cls.split(' ').some(c => c.startsWith('faq-'))) return; // protect accordion
      while (el.firstChild) el.before(el.firstChild);
      el.remove();
      anyRemoved = true;
    });
    if (!anyRemoved) break;
  }

  // ── 5. Clean up any remaining stray <br> tags ──
  let html = body.innerHTML;
  html = html.replace(/<br\s*\/?>\s*(<\/?h[2-6])/gi, '$1');  // br before/after headings
  html = html.replace(/(<\/h[2-6]>)\s*<br\s*\/?>/gi, '$1');
  html = html.replace(/<p>\s*(<br\s*\/?>\s*)+/gi, '<p>');    // br at start of <p>
  html = html.replace(/(<br\s*\/?>\s*)+\s*<\/p>/gi, '</p>'); // br at end of <p>

  // ── 6. Clean attributes on a fresh parse ──
  const doc2 = parser.parseFromString(`<html><body>${html}</body></html>`, 'text/html');
  const body2 = doc2.body;

  body2.querySelectorAll('*').forEach(el => {
    el.removeAttribute('style');
    el.removeAttribute('id');
    // Remove data-* and event attrs
    Array.from(el.attributes)
      .filter(a => a.name.startsWith('data-') || a.name.startsWith('on'))
      .forEach(a => el.removeAttribute(a.name));
    // Keep only faq-* classes
    const cls = el.getAttribute('class');
    if (cls !== null) {
      const keep = cls.split(/\s+/).filter(c => c.startsWith('faq-')).join(' ');
      if (keep) el.setAttribute('class', keep);
      else el.removeAttribute('class');
    }
  });

  // ── 7. Remove empty block elements ──
  body2.querySelectorAll('p, h2, h3, h4, li').forEach(el => {
    if (!el.textContent?.trim()) el.remove();
  });

  return body2.innerHTML.replace(/\n{3,}/g, '\n\n').trim();
}

export default function BlogEditor() {
  const [slug, setSlug] = useState(POSTS[0]?.slug ?? '');
  const [html, setHtml] = useState('');
  const [tab, setTab] = useState<Tab>('edit');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  const loadContent = useCallback(async (s: string) => {
    setLoading(true);
    setStatus(null);
    try {
      const res = await fetch(`/api/admin/blog-content?slug=${encodeURIComponent(s)}`);
      const data = await res.json();
      setHtml(data.content ?? '');
    } catch {
      setHtml('');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadContent(slug); }, [slug, loadContent]);

  async function handleSave() {
    setSaving(true);
    setStatus(null);
    try {
      const res = await fetch('/api/admin/blog-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, content: html }),
      });
      if (res.ok) {
        setStatus({ type: 'success', msg: `Published! Live at /${slug}` });
      } else {
        const d = await res.json();
        setStatus({ type: 'error', msg: d.error ?? 'Save failed' });
      }
    } catch {
      setStatus({ type: 'error', msg: 'Network error — try again' });
    } finally {
      setSaving(false);
    }
  }

  async function handleReset() {
    if (!confirm('Remove custom content? The page will fall back to the hardcoded version.')) return;
    setSaving(true);
    try {
      await fetch('/api/admin/blog-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, content: '' }),
      });
      setHtml('');
      setStatus({ type: 'success', msg: 'Reset — page now shows hardcoded content.' });
    } finally {
      setSaving(false);
    }
  }

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      setHtml(extractBodyContent(text));
      setTab('edit');
      setStatus(null);
    };
    reader.readAsText(file);
    // Reset input so same file can be re-uploaded
    e.target.value = '';
  }

  const [search, setSearch] = useState('');
  const filteredPosts = search.trim()
    ? POSTS.filter(p => p.title.toLowerCase().includes(search.toLowerCase()) || p.slug.includes(search.toLowerCase()))
    : POSTS;

  const post = POSTS.find(p => p.slug === slug);
  const wordCount = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().split(' ').filter(Boolean).length;
  const liveUrl = `https://wide-wings.ae/${slug}`;

  return (
    <div className="blog-editor">
      {/* Post selector */}
      <div className="adm-card" style={{ marginBottom: 20 }}>
        <div className="adm-card-head">
          <div className="adm-card-title">Select Blog Post</div>
          {post && (
            <a
              href={`/${slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="adm-btn adm-btn-outline adm-btn-sm"
              style={{ textDecoration: 'none' }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
              </svg>
              View Live
            </a>
          )}
        </div>
        <div style={{ padding: '16px 24px' }}>
          {/* Search + custom dropdown */}
          <div style={{ position: 'relative', width: '100%' }}>
            <div style={{ position: 'relative', marginBottom: 4 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2"
                style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Type to search by title or URL (e.g. instagram, seo, dubai...)"
                className="adm-input"
                style={{ width: '100%', paddingLeft: 36 }}
              />
              {search && (
                <button onClick={() => setSearch('')} style={{
                  position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer', fontSize: 16, lineHeight: 1,
                }}>×</button>
              )}
            </div>

            {/* Results list — shown only when searching */}
            {search && (
              <div style={{
                border: '1px solid #e5e7eb', borderRadius: 8, background: '#fff',
                maxHeight: 280, overflowY: 'auto', marginBottom: 10,
              }}>
                {filteredPosts.length === 0 ? (
                  <div style={{ padding: '12px 16px', color: '#6b7280', fontSize: '0.83rem' }}>No posts found</div>
                ) : filteredPosts.map(p => (
                  <button
                    key={p.slug}
                    onClick={() => { setSlug(p.slug); setSearch(''); }}
                    style={{
                      display: 'block', width: '100%', textAlign: 'left',
                      padding: '10px 16px', background: p.slug === slug ? '#fdf2f8' : 'transparent',
                      border: 'none', borderBottom: '1px solid #f3f4f6', cursor: 'pointer',
                      color: p.slug === slug ? '#a73184' : '#374151',
                    }}
                    onMouseEnter={e => { if (p.slug !== slug) (e.currentTarget as HTMLButtonElement).style.background = '#f9fafb'; }}
                    onMouseLeave={e => { if (p.slug !== slug) (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
                  >
                    <div style={{ fontSize: '0.83rem', fontWeight: 600, marginBottom: 2 }}>{p.title}</div>
                    <div style={{ fontSize: '0.72rem', color: '#6b7280' }}>/{p.slug}</div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Selected post info */}
          {post && (
            <div style={{ marginTop: 8, padding: '12px 16px', background: '#f9fafb', borderRadius: 8, border: '1px solid #e5e7eb' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f0f1a', marginBottom: 4 }}>
                ✓ {post.title}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: 6 }}>
                Category: <span style={{ color: '#374151' }}>{post.category}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.72rem', color: '#6b7280' }}>Live URL:</span>
                <a href={liveUrl} target="_blank" rel="noopener noreferrer"
                  style={{ fontSize: '0.72rem', color: '#2563eb', wordBreak: 'break-all' }}>
                  {liveUrl}
                </a>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Editor card */}
      <div className="adm-card">
        <div className="adm-card-head">
          <div style={{ display: 'flex', gap: 4 }}>
            <button
              className={`adm-btn adm-btn-sm ${tab === 'edit' ? 'adm-btn-primary' : 'adm-btn-outline'}`}
              onClick={() => setTab('edit')}
            >Edit HTML</button>
            <button
              className={`adm-btn adm-btn-sm ${tab === 'preview' ? 'adm-btn-primary' : 'adm-btn-outline'}`}
              onClick={() => setTab('preview')}
            >Preview</button>
          </div>
          <span style={{ fontSize: '0.78rem', color: '#9ca3af' }}>{wordCount} words</span>
        </div>

        {tab === 'edit' ? (
          <div style={{ padding: '0 24px 16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
              <p style={{ fontSize: '0.8rem', color: '#6b7280', margin: 0 }}>
                Paste your full HTML page, or upload an <strong style={{ color: '#374151' }}>.html file</strong> — wrapper tags are stripped automatically.
              </p>
              <label style={{
                display: 'inline-flex', alignItems: 'center', gap: 6, cursor: 'pointer',
                padding: '6px 14px', borderRadius: 6, fontSize: '0.8rem', fontWeight: 600,
                background: '#f3f4f6', color: '#374151', border: '1px solid #d1d5db',
                whiteSpace: 'nowrap', flexShrink: 0,
              }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
                Upload HTML File
                <input
                  type="file"
                  accept=".html,.htm"
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                />
              </label>
            </div>
            {loading ? (
              <div style={{ padding: 40, textAlign: 'center', color: '#6b7280' }}>Loading…</div>
            ) : (
              <textarea
                value={html}
                onChange={e => setHtml(e.target.value)}
                onPaste={e => {
                  e.preventDefault();
                  const pasted = e.clipboardData.getData('text');
                  setHtml(extractBodyContent(pasted));
                }}
                className="adm-input"
                style={{
                  width: '100%', minHeight: 500, fontFamily: 'monospace',
                  fontSize: '0.82rem', lineHeight: 1.6, resize: 'vertical',
                }}
                placeholder={`Paste your full HTML page here — it will be cleaned automatically.`}
                spellCheck={false}
              />
            )}
          </div>
        ) : (
          <div
            style={{ padding: '20px 24px', minHeight: 300, color: '#374151', lineHeight: 1.8 }}
            className="bp-article"
            dangerouslySetInnerHTML={{ __html: html || '<p style="color:#6b7280;font-style:italic">Nothing to preview yet.</p>' }}
          />
        )}

        {/* Actions */}
        <div style={{ padding: '12px 24px 20px', borderTop: '1px solid #f3f4f6', display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          <button
            className="adm-btn adm-btn-primary"
            onClick={handleSave}
            disabled={saving || loading}
          >
            {saving ? 'Publishing…' : (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                Publish to Live Site
              </>
            )}
          </button>

          <button
            className="adm-btn adm-btn-outline adm-btn-sm"
            onClick={handleReset}
            disabled={saving || !html}
            style={{ color: '#ef4444', borderColor: '#ef4444' }}
          >
            Reset to Default
          </button>

          {status && (
            <span style={{
              fontSize: '0.82rem', padding: '6px 12px', borderRadius: 6,
              background: status.type === 'success' ? '#f0fdf4' : '#fef2f2',
              color: status.type === 'success' ? '#16a34a' : '#ef4444',
              border: status.type === 'success' ? '1px solid #bbf7d0' : '1px solid #fecaca',
            }}>
              {status.type === 'success' ? '✓ ' : '✕ '}{status.msg}
            </span>
          )}
        </div>
      </div>

      <div style={{ marginTop: 12, fontSize: '0.75rem', color: '#6b7280' }}>
        <strong style={{ color: '#9ca3af' }}>How it works:</strong> Content saved here overrides the hardcoded version and goes live instantly on the Vercel edge. &quot;Reset to Default&quot; removes the override and restores the original.
      </div>
    </div>
  );
}
