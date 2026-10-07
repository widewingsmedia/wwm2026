'use client';

import { useEffect, useRef, useState } from 'react';

export type Review = { text: string; name: string; co: string };

function Chevron({ dir }: { dir: 1 | -1 }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points={dir === 1 ? '9 5 16 12 9 19' : '15 5 8 12 15 19'} />
    </svg>
  );
}

// Client reviews as a bleeding card carousel: grid-textured cards with a round
// monogram badge, a scroll-linked progress bar and prev/next buttons.
export default function ReviewRail({ reviews }: { reviews: Review[] }) {
  const railRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const [edge, setEdge] = useState({ start: true, end: false });

  useEffect(() => {
    const rail = railRef.current;
    const bar = barRef.current;
    if (!rail || !bar) return;
    const measure = () => {
      const { scrollLeft, clientWidth, scrollWidth } = rail;
      bar.style.setProperty('--thumb', `${Math.min(1, clientWidth / scrollWidth)}`);
      bar.style.setProperty('--pos', `${scrollWidth > clientWidth ? scrollLeft / (scrollWidth - clientWidth) : 0}`);
      setEdge({ start: scrollLeft <= 2, end: scrollLeft + clientWidth >= scrollWidth - 2 });
    };
    measure();
    rail.addEventListener('scroll', measure, { passive: true });
    window.addEventListener('resize', measure);

    // mouse drag-to-scroll
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
    const onUp = () => { down = false; rail.classList.remove('is-dragging'); };
    rail.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);

    return () => {
      rail.removeEventListener('scroll', measure);
      window.removeEventListener('resize', measure);
      rail.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
  }, []);

  const step = (dir: 1 | -1) => {
    const rail = railRef.current;
    const card = rail?.firstElementChild as HTMLElement | null;
    if (!rail || !card) return;
    const gap = parseFloat(getComputedStyle(rail).columnGap) || 0;
    rail.scrollBy({ left: dir * (card.offsetWidth + gap), behavior: 'smooth' });
  };

  return (
    <>
      <div className="v4-rv-rail" ref={railRef} data-stagger>
        {reviews.map(r => (
          <figure key={r.name} className="v4-rv v4-spot" data-spot>
            <span className="v4-rv-grid" aria-hidden="true" />
            <span className="v4-rv-quote" aria-hidden="true">&ldquo;</span>
            <span className="v4-rv-badge" aria-hidden="true"><span>{r.name.charAt(0)}</span></span>
            <figcaption>
              <b>{r.name}</b>
              <span>{r.co}</span>
            </figcaption>
            <span className="v4-rv-stars" role="img" aria-label="Rated 5 out of 5">★★★★★</span>
            <blockquote>{r.text}</blockquote>
          </figure>
        ))}
      </div>

      <div className="v4-rv-foot">
        <div className="v4-rv-progress" ref={barRef} aria-hidden="true"><i /></div>
        <div className="v4-rv-nav">
          <button type="button" className="v4-rv-btn" onClick={() => step(-1)} disabled={edge.start} aria-label="Previous review">
            <Chevron dir={-1} />
          </button>
          <button type="button" className="v4-rv-btn" onClick={() => step(1)} disabled={edge.end} aria-label="Next review">
            <Chevron dir={1} />
          </button>
        </div>
      </div>
    </>
  );
}
