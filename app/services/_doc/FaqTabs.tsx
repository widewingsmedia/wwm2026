'use client';

import { useState } from 'react';

export type FaqItem = { q: string; a: React.ReactNode };

const Arrow = ({ back }: { back?: boolean }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
    style={back ? { transform: 'rotate(180deg)' } : undefined}>
    <path d="M5 12h14m-6-6 6 6-6 6" />
  </svg>
);

// FAQ as a question list (left) and an answer panel (right). On phones the
// panel is hidden and the active answer opens under its question instead.
export default function FaqTabs({ heading, items }: { heading: React.ReactNode; items: FaqItem[] }) {
  const [active, setActive] = useState(0);
  const n = items.length;
  const go = (i: number) => setActive((i + n) % n);
  const pad = (i: number) => String(i).padStart(2, '0');

  const onKey = (e: React.KeyboardEvent, i: number) => {
    const next = e.key === 'ArrowDown' ? i + 1 : e.key === 'ArrowUp' ? i - 1 : null;
    if (next === null) return;
    e.preventDefault();
    go(next);
    (e.currentTarget.closest('ol')?.querySelectorAll('button')[(next + n) % n] as HTMLButtonElement | undefined)?.focus();
  };

  return (
    <div className="sd-faq">
      <div className="sd-faq-side">
        <span className="section-label">FAQ</span>
        <h2 className="cb-section-h2 sd-h2">{heading}</h2>
        <ol className="sd-faq-list" role="tablist" aria-orientation="vertical" aria-label="Questions">
          {items.map((it, i) => (
            <li key={i} className={i === active ? 'is-active' : undefined}>
              <button type="button" role="tab" id={`faq-tab-${i}`} aria-selected={i === active} aria-controls="faq-answer"
                tabIndex={i === active ? 0 : -1} onClick={() => setActive(i)} onKeyDown={e => onKey(e, i)}>
                <span>{it.q}</span>
                <Arrow />
              </button>
              <div className="sd-faq-inline">{it.a}</div>
            </li>
          ))}
        </ol>
      </div>

      <div className="sd-faq-panel" id="faq-answer" role="tabpanel" aria-labelledby={`faq-tab-${active}`}>
        <span className="sd-faq-num" aria-hidden="true">{pad(active + 1)}</span>
        <div key={active} className="sd-faq-body">
          <span className="sd-faq-count">Question {pad(active + 1)} of {pad(n)}</span>
          <h3 className="sd-faq-q">{items[active].q}</h3>
          <div className="sd-faq-a">{items[active].a}</div>
        </div>
        <div className="sd-faq-nav">
          <button type="button" className="sd-faq-btn" onClick={() => go(active - 1)} aria-label="Previous question"><Arrow back /></button>
          <button type="button" className="sd-faq-btn" onClick={() => go(active + 1)} aria-label="Next question"><Arrow /></button>
          <div className="sd-faq-dots">
            {items.map((_, i) => (
              <button key={i} type="button" className={i === active ? 'is-active' : undefined} onClick={() => setActive(i)} aria-label={`Question ${i + 1}`} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
