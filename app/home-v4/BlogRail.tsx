'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from './PlainLink';
import type { Post } from '../blogs/posts-data';

const pad2 = (n: number) => String(n).padStart(2, '0');
const fmtDate = (iso?: string) =>
  iso ? new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Asia/Dubai' }) : '';

function ArrowH({ dir }: { dir: 1 | -1 }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true" style={{ transform: dir === -1 ? 'scaleX(-1)' : undefined }}>
      <line x1="3" y1="12" x2="21" y2="12" />
      <polyline points="14 5 21 12 14 19" />
    </svg>
  );
}

// Horizontal "vertical stories" rail (after gmxdigital.com's film collection):
// tall portrait cards in a scroll-snap track, prev/next buttons, a live
// "01–04 / 08" counter, and mouse drag-to-scroll on desktop.
export default function BlogRail({ posts }: { posts: Post[] }) {
  const railRef = useRef<HTMLDivElement>(null);
  const [range, setRange] = useState<[number, number]>([1, Math.min(4, posts.length)]);
  const [edge, setEdge] = useState({ start: true, end: posts.length <= 1 });

  const measure = useCallback(() => {
    const rail = railRef.current;
    if (!rail) return;
    const rl = rail.getBoundingClientRect();
    const padL = parseFloat(getComputedStyle(rail).paddingLeft) || 0;
    const viewL = rl.left + padL, viewR = rl.right - padL;
    const seen: number[] = [];
    Array.from(rail.children).forEach((c, i) => {
      const r = c.getBoundingClientRect();
      const overlap = Math.min(r.right, viewR) - Math.max(r.left, viewL);
      if (overlap / r.width >= 0.6) seen.push(i + 1);
    });
    if (seen.length) setRange([seen[0], seen[seen.length - 1]]);
    setEdge({ start: rail.scrollLeft <= 2, end: rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 2 });
  }, []);

  const step = (dir: 1 | -1) => {
    const rail = railRef.current;
    const card = rail?.firstElementChild as HTMLElement | null;
    if (!rail || !card) return;
    const gap = parseFloat(getComputedStyle(rail).columnGap) || 0;
    const perView = Math.max(1, range[1] - range[0]);
    rail.scrollBy({ left: dir * (card.offsetWidth + gap) * perView, behavior: 'smooth' });
  };

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    measure();
    rail.addEventListener('scroll', measure, { passive: true });
    window.addEventListener('resize', measure);

    // mouse drag-to-scroll; suppress the click if the pointer actually moved
    let down = false, moved = false, startX = 0, startLeft = 0;
    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse' || e.button !== 0) return;
      down = true; moved = false; startX = e.clientX; startLeft = rail.scrollLeft;
    };
    const onMove = (e: PointerEvent) => {
      if (!down) return;
      const dx = e.clientX - startX;
      if (!moved && Math.abs(dx) > 6) { moved = true; rail.classList.add('is-dragging'); }
      if (moved) rail.scrollLeft = startLeft - dx;
    };
    const onUp = () => {
      if (!down) return;
      down = false;
      rail.classList.remove('is-dragging');
    };
    const onClick = (e: MouseEvent) => { if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; } };
    rail.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    rail.addEventListener('click', onClick, true);
    rail.addEventListener('dragstart', e => e.preventDefault());

    return () => {
      rail.removeEventListener('scroll', measure);
      window.removeEventListener('resize', measure);
      rail.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      rail.removeEventListener('click', onClick, true);
    };
  }, [measure]);

  return (
    <>
      <div className="v4-rail-bar">
        <span className="v4-mono">Explore the collection</span>
        <div className="v4-rail-nav">
          <button type="button" className="v4-rail-btn" onClick={() => step(-1)} disabled={edge.start} aria-label="Previous articles">
            <ArrowH dir={-1} />
          </button>
          <span className="v4-rail-count" aria-live="polite">
            {range[0] === range[1] ? pad2(range[0]) : `${pad2(range[0])}–${pad2(range[1])}`} / {pad2(posts.length)}
          </span>
          <button type="button" className="v4-rail-btn" onClick={() => step(1)} disabled={edge.end} aria-label="Next articles">
            <ArrowH dir={1} />
          </button>
        </div>
      </div>

      <div className="v4-rail" ref={railRef}>
        {posts.map((p, i) => (
          <Link key={p.slug} href={`/${p.slug}/`} className="v4-story" draggable={false}>
            <div className="v4-story-img" style={{ backgroundImage: `url('${p.image}')` }} />
            <div className="v4-story-shade" />
            <div className="v4-story-chips">
              <span className="v4-chip">I{pad2(i + 1)}</span>
              {p.publishAt && <span className="v4-chip">{fmtDate(p.publishAt)}</span>}
            </div>
            <div className="v4-story-copy">
              <div className="v4-mono v4-story-meta">{p.category}</div>
              <h3 className="v4-story-title">{p.title}</h3>
              <span className="v4-mono v4-story-cta">Read the article <span className="v4-play">▶</span></span>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
