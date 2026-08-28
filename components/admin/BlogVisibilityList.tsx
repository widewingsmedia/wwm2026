'use client';
import { useState, useMemo } from 'react';

interface PostRow {
  slug: string;
  title: string;
  category: string;
  publishAt?: string;
}

export default function BlogVisibilityList({ initialPosts, initialHidden }: {
  initialPosts: PostRow[];
  initialHidden: string[];
}) {
  const [hidden, setHidden] = useState<Set<string>>(new Set(initialHidden));
  const [loadingSlug, setLoadingSlug] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  // Snapshot at mount, not recomputed on every render — this only needs to
  // separate "already past" from "still scheduled" for display purposes.
  const [now] = useState(() => Date.now());

  const filtered = useMemo(() => {
    if (!search.trim()) return initialPosts;
    const q = search.toLowerCase();
    return initialPosts.filter(p => p.title.toLowerCase().includes(q) || p.slug.includes(q) || p.category.toLowerCase().includes(q));
  }, [search, initialPosts]);

  async function toggle(slug: string) {
    const nextHidden = !hidden.has(slug);
    setLoadingSlug(slug);
    setError('');
    // Optimistic update
    setHidden(prev => {
      const next = new Set(prev);
      if (nextHidden) next.add(slug); else next.delete(slug);
      return next;
    });
    try {
      const res = await fetch('/api/admin/blog-visibility', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, hidden: nextHidden }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error ?? 'Failed to update');
      }
    } catch (e) {
      // Revert on failure
      setHidden(prev => {
        const next = new Set(prev);
        if (nextHidden) next.delete(slug); else next.add(slug);
        return next;
      });
      setError(e instanceof Error ? e.message : 'Failed to update');
    } finally {
      setLoadingSlug(null);
    }
  }

  function statusFor(p: PostRow): { label: string; color: string } {
    if (hidden.has(p.slug)) return { label: 'Hidden', color: '#ef4444' };
    if (p.publishAt && new Date(p.publishAt).getTime() > now) {
      return { label: `Scheduled — ${new Date(p.publishAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}`, color: '#ca8a04' };
    }
    return { label: 'Live', color: '#16a34a' };
  }

  return (
    <div className="adm-card" style={{ marginBottom: 20 }}>
      <div className="adm-card-head">
        <div className="adm-card-title">All Posts ({initialPosts.length})</div>
      </div>
      <div style={{ padding: '14px 24px 0' }}>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by title, URL, or category…"
          className="adm-input"
          style={{ width: '100%' }}
        />
        {error && (
          <div style={{ marginTop: 10, padding: '8px 12px', borderRadius: 6, background: '#fef2f2', border: '1px solid #fecaca', color: '#ef4444', fontSize: '0.8rem' }}>
            ✕ {error}
          </div>
        )}
      </div>
      <div style={{ maxHeight: 480, overflowY: 'auto', padding: '12px 24px 20px' }}>
        {filtered.length === 0 ? (
          <div style={{ padding: '20px 0', color: '#6b7280', fontSize: '0.85rem' }}>No posts found</div>
        ) : filtered.map(p => {
          const status = statusFor(p);
          const isHidden = hidden.has(p.slug);
          return (
            <div key={p.slug} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '10px 0', borderBottom: '1px solid #f3f4f6',
            }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#0f0f1a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {p.title}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#6b7280' }}>/{p.slug}/ · {p.category}</div>
              </div>
              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: status.color, whiteSpace: 'nowrap' }}>
                {status.label}
              </span>
              <button
                className={`adm-btn adm-btn-sm ${isHidden ? 'adm-btn-primary' : 'adm-btn-outline'}`}
                onClick={() => toggle(p.slug)}
                disabled={loadingSlug === p.slug}
                style={!isHidden ? { color: '#ef4444', borderColor: '#ef4444' } : undefined}
              >
                {loadingSlug === p.slug ? '…' : isHidden ? 'Show' : 'Hide'}
              </button>
            </div>
          );
        })}
      </div>
      <div style={{ padding: '0 24px 16px', fontSize: '0.75rem', color: '#6b7280' }}>
        Hiding a post removes it from its own page (404), the <code>/insights/</code> listing, related posts, and the sitemap — instantly, no code push needed.
      </div>
    </div>
  );
}
