import React from 'react';
import Link from 'next/link';
import SchemaScripts from '@/components/SchemaScripts';
import type { Block, Cta, Section, ServiceDoc } from './types';
import '../services.css';
import '../service-page.css';
import './service-doc.css';

// Shared layout for the copy-driven service pages. Each page supplies a
// ServiceDoc (content/<slug>.ts); this component decides the presentation:
// card grids for H3 groups, numbered steps for processes, an accordion for
// FAQs and a closing CTA band for the final section.

const SPARKS = [
  { l: '12%', t: '18%', c: '#FF6B5B', sz: '3px', op: '0.65', sd: '2.1s', dl: '0s' },
  { l: '28%', t: '72%', c: '#FFA94D', sz: '4px', op: '0.6', sd: '3.0s', dl: '0.5s' },
  { l: '45%', t: '15%', c: '#FFD166', sz: '3px', op: '0.55', sd: '2.6s', dl: '1.1s' },
  { l: '60%', t: '80%', c: '#06D6A0', sz: '3px', op: '0.6', sd: '2.8s', dl: '0.3s' },
  { l: '73%', t: '30%', c: '#4CC9F0', sz: '4px', op: '0.65', sd: '2.3s', dl: '0.8s' },
  { l: '85%', t: '65%', c: '#9B5DE5', sz: '3px', op: '0.55', sd: '3.2s', dl: '0.2s' },
  { l: '18%', t: '45%', c: '#FF6B5B', sz: '2px', op: '0.5', sd: '2.5s', dl: '1.4s' },
  { l: '78%', t: '12%', c: '#FFD166', sz: '2px', op: '0.5', sd: '3.4s', dl: '0.4s' },
];

const DEFAULT_CTA: Cta = { label: 'Get a Free Consultation', href: '/contact/' };

/* ── inline text: [label](href), **bold**, \n ── */
function Rich({ text }: { text: string }) {
  const nodes: React.ReactNode[] = [];
  const re = /\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*|\n/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let k = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) nodes.push(text.slice(last, m.index));
    if (m[1] !== undefined) nodes.push(<SmartLink key={k++} href={m[2]}>{m[1]}</SmartLink>);
    else if (m[3] !== undefined) nodes.push(<strong key={k++}>{m[3]}</strong>);
    else nodes.push(<br key={k++} />);
    last = re.lastIndex;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return <>{nodes}</>;
}

function SmartLink({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) {
  if (href.startsWith('/')) return <Link href={href} className={className}>{children}</Link>;
  const external = href.startsWith('http');
  return (
    <a href={href} className={className} {...(external ? { target: '_blank', rel: 'noopener' } : {})}>
      {children}
    </a>
  );
}

const SMALL_WORDS = new Set(['a', 'an', 'the', '&', 'and', 'of', 'in', 'for', 'to', 'with', 'by', 'on', 'at', 'or', 'your', 'our', 'is', 'not']);

// Headings in two colours: the last words in gold (site-wide .gradient-text style).
function TwoTone({ text }: { text: string }) {
  const t = plain(text).trim();
  const words = t.split(/\s+/);
  if (words.length < 2) return <span className="gradient-text">{t}</span>;
  // "Quick Answers: SEO Cost…" -> gold after the colon
  const colon = words.findIndex(w => w.endsWith(':'));
  let at = colon > -1 && colon < words.length - 1 ? colon + 1 : words.length - Math.max(1, Math.floor(words.length / 2));
  // never start the gold part on a small joining word ("a", "&", "in", …)
  while (at < words.length - 1 && SMALL_WORDS.has(words[at].toLowerCase())) at++;
  return <>{words.slice(0, at).join(' ')} <span className="gradient-text">{words.slice(at).join(' ')}</span></>;
}

const slugify = (s: string) => s.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const plain = (s: string) => s.replace(/\*\*/g, '').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');

/* ── lists: short items become chips, "Label: text" items become a checklist ── */
function List({ items, ordered }: { items: string[]; ordered?: boolean }) {
  const short = !ordered && items.every(i => plain(i).length <= 34);
  if (short) {
    return (
      <ul className="sd-chips">
        {items.map((it, i) => <li key={i}><Rich text={it} /></li>)}
      </ul>
    );
  }
  const Tag = ordered ? 'ol' : 'ul';
  return (
    <Tag className={ordered ? 'sd-olist' : 'sd-checklist'}>
      {items.map((it, i) => (
        <li key={i}>
          <span className="sd-check" aria-hidden="true" />
          <span><Rich text={it} /></span>
        </li>
      ))}
    </Tag>
  );
}

function Buttons({ ctas }: { ctas: Cta[] }) {
  return (
    <div className="sd-btns">
      {ctas.map((c, i) => (
        <SmartLink key={i} href={c.href} className={i === 0 ? 'svc-btn-primary' : 'sd-btn-ghost'}>{c.label}</SmartLink>
      ))}
    </div>
  );
}

function Blocks({ blocks }: { blocks: Block[] }) {
  return (
    <>
      {blocks.map((b, i) => {
        if ('p' in b) return <p key={i} className="sd-p"><Rich text={b.p} /></p>;
        if ('ul' in b) return <List key={i} items={b.ul} />;
        if ('ol' in b) return <List key={i} items={b.ol} ordered />;
        if ('cta' in b) return <Buttons key={i} ctas={b.cta} />;
        if ('steps' in b) return <Steps key={i} steps={b.steps} />;
        if ('table' in b) return <Table key={i} rows={b.table} />;
        if ('h3' in b) return (
          <div key={i} className="sd-sub">
            <h3 className="sd-h3"><Rich text={b.h3} /></h3>
            <Blocks blocks={b.blocks} />
          </div>
        );
        return null;
      })}
    </>
  );
}

function Steps({ steps }: { steps: { title: string; body: string }[] }) {
  return (
    <ol className="sd-steps">
      {steps.map((s, i) => (
        <li key={i} className="sd-step">
          <h3 className="sd-step-title"><Rich text={s.title} /></h3>
          {s.body && <p className="sd-p"><Rich text={s.body} /></p>}
        </li>
      ))}
    </ol>
  );
}

function Table({ rows }: { rows: string[][] }) {
  const [head, ...body] = rows;
  return (
    <div className="sd-table-wrap">
      <table className="sd-table">
        <thead><tr>{head.map((h, i) => <th key={i}>{h}</th>)}</tr></thead>
        <tbody>{body.map((r, i) => <tr key={i}>{r.map((c, j) => <td key={j}>{c}</td>)}</tr>)}</tbody>
      </table>
    </div>
  );
}

/* ── section layouts ── */
type H3Block = { h3: string; blocks: Block[] };
const isH3 = (b: Block): b is H3Block => 'h3' in b;
const isFaq = (s: Section) => /faq|frequently asked/i.test(s.h2);

type GroupVariant = 'cards' | 'rows' | 'split';
const GROUP_VARIANTS: GroupVariant[] = ['cards', 'rows', 'split'];
const isGroup = (s: Section) => {
  const subs = s.blocks.filter(isH3);
  return !isFaq(s) && subs.length >= 2 && !(subs.length >= 3 && subs.every(b => /^\d+\.\s/.test(plain(b.h3))));
};

function SectionView({ s, alt, variant = 'cards' }: { s: Section; alt: boolean; variant?: GroupVariant }) {
  const subs = s.blocks.filter(isH3);
  const lead = s.blocks.slice(0, s.blocks.findIndex(isH3) === -1 ? s.blocks.length : s.blocks.findIndex(isH3));
  const after = subs.length ? s.blocks.slice(s.blocks.lastIndexOf(subs[subs.length - 1]) + 1) : [];
  const numbered = subs.length >= 3 && subs.every(b => /^\d+\.\s/.test(plain(b.h3)));
  const cls = `cb-section sd-section${alt ? ' cb-section-alt' : ''}`;
  const id = slugify(s.h2);

  if (isFaq(s)) {
    return (
      <section className={cls} id={id}>
        <div className="container cb-faq-wrap">
          <span className="section-label">FAQ</span>
          <h2 className="cb-section-h2"><TwoTone text={s.h2} /></h2>
          <div className="cb-faq-list">
            {subs.map((f, i) => (
              <details key={i} className="cb-faq-item">
                <summary className="cb-faq-q">
                  <span>{plain(f.h3).replace(/^\d+\.\s*/, '')}</span>
                  <span className="cb-faq-icon" aria-hidden="true">+</span>
                </summary>
                <div className="sd-faq-a"><Blocks blocks={f.blocks} /></div>
              </details>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // H3 groups that aren't a process: rotate presentations down the page so
  // consecutive groups don't all read as the same grid of boxes
  if (subs.length >= 2 && !numbered && variant === 'rows') {
    return (
      <section className={cls} id={id}>
        <div className="container">
          <div className="sd-head">
            <h2 className="cb-section-h2 sd-h2"><TwoTone text={s.h2} /></h2>
            {lead.length > 0 && <div className="sd-lead"><Blocks blocks={lead} /></div>}
          </div>
          <div className="sd-rows">
            {subs.map((b, i) => (
              <article key={i} className="sd-row">
                <h3 className="sd-row-title"><Rich text={b.h3} /></h3>
                <div className="sd-row-body"><Blocks blocks={b.blocks} /></div>
              </article>
            ))}
          </div>
          {after.length > 0 && <div className="sd-after"><Blocks blocks={after} /></div>}
        </div>
      </section>
    );
  }
  if (subs.length >= 2 && !numbered && variant === 'split') {
    return (
      <section className={cls} id={id}>
        <div className="container sd-split sd-split--list">
          <div className="sd-split-h">
            <h2 className="cb-section-h2 sd-h2"><TwoTone text={s.h2} /></h2>
            {lead.length > 0 && <div className="sd-lead"><Blocks blocks={lead} /></div>}
          </div>
          <div className="sd-split-body">
            {subs.map((b, i) => (
              <article key={i} className="sd-item">
                <h3 className="sd-h3"><Rich text={b.h3} /></h3>
                <Blocks blocks={b.blocks} />
              </article>
            ))}
            {after.length > 0 && <div className="sd-after"><Blocks blocks={after} /></div>}
          </div>
        </div>
      </section>
    );
  }

  // H3 groups: numbered titles -> process steps, otherwise a card grid
  if (subs.length >= 2) {
    const dense = subs.some(b => b.blocks.length > 2 || b.blocks.some(x => 'ul' in x || 'ol' in x));
    return (
      <section className={cls} id={id}>
        <div className="container">
          <div className="sd-head">
            <h2 className="cb-section-h2 sd-h2"><TwoTone text={s.h2} /></h2>
            {lead.length > 0 && <div className="sd-lead"><Blocks blocks={lead} /></div>}
          </div>
          {numbered ? (
            <ol className="sd-steps">
              {subs.map((b, i) => (
                <li key={i} className="sd-step">
                          <h3 className="sd-step-title">{plain(b.h3).replace(/^\d+\.\s*/, '')}</h3>
                  <Blocks blocks={b.blocks} />
                </li>
              ))}
            </ol>
          ) : (
            <div className={`sd-cards${dense ? ' sd-cards--dense' : ''}`}>
              {subs.map((b, i) => (
                <article key={i} className="sd-card">
                  <h3 className="sd-h3"><Rich text={b.h3} /></h3>
                  <Blocks blocks={b.blocks} />
                </article>
              ))}
            </div>
          )}
          {after.length > 0 && <div className="sd-after"><Blocks blocks={after} /></div>}
        </div>
      </section>
    );
  }

  // process steps / tables need the full width: heading + lead on top
  const wideAt = s.blocks.findIndex(b => 'steps' in b || 'table' in b);
  if (wideAt !== -1) {
    return (
      <section className={cls} id={id}>
        <div className="container">
          <div className="sd-head">
            <h2 className="cb-section-h2 sd-h2"><TwoTone text={s.h2} /></h2>
            {wideAt > 0 && <div className="sd-lead"><Blocks blocks={s.blocks.slice(0, wideAt)} /></div>}
          </div>
          <Blocks blocks={s.blocks.slice(wideAt, wideAt + 1)} />
          {s.blocks.length > wideAt + 1 && <div className="sd-after"><Blocks blocks={s.blocks.slice(wideAt + 1)} /></div>}
        </div>
      </section>
    );
  }

  // text section: heading left, copy right
  return (
    <section className={cls} id={id}>
      <div className="container sd-split">
        <h2 className="cb-section-h2 sd-h2 sd-split-h"><TwoTone text={s.h2} /></h2>
        <div className="sd-split-body"><Blocks blocks={s.blocks} /></div>
      </div>
    </section>
  );
}

function FinalCta({ s }: { s: Section }) {
  const ctas = s.blocks.flatMap(b => ('cta' in b ? b.cta : []));
  const rest = s.blocks.filter(b => !('cta' in b));
  return (
    <section className="cb-cta sd-cta" id={slugify(s.h2)}>
      <div className="container cb-cta-inner">
        <span className="section-label">Let&apos;s Talk</span>
        <h2 className="cb-cta-h2"><TwoTone text={s.h2} /></h2>
        <div className="sd-cta-body"><Blocks blocks={rest} /></div>
        <Buttons ctas={ctas.length ? ctas : [DEFAULT_CTA, { label: 'WhatsApp Us', href: 'https://wa.me/971555657609' }]} />
      </div>
    </section>
  );
}

export default function ServiceDocPage({ page }: { page: ServiceDoc }) {
  const heroCtas = page.intro.flatMap(b => ('cta' in b ? b.cta : []));
  const introText = page.intro.filter(b => !('cta' in b));
  const heroLead = introText.slice(0, 1);
  const moreIntro = introText.slice(1);
  const last = page.sections[page.sections.length - 1];
  const finalIsCta = last && !isFaq(last) && !last.blocks.some(isH3);
  const body = finalIsCta ? page.sections.slice(0, -1) : page.sections;
  const parent = page.parent === undefined ? { label: 'Services', href: '/digital-marketing-services/' } : page.parent;

  return (
    <div className="sd-page">
      <SchemaScripts blocks={page.schema} />
      <section className="svc-hero sd-hero">
        <div className="svc-hero-blob" aria-hidden="true" />
        <div className="svc-hero-sparks" aria-hidden="true">
          {SPARKS.map((s, i) => (
            <span key={i} className="svc-spark" style={{ left: s.l, top: s.t, '--sc': s.c, '--sz': s.sz, '--op': s.op, '--sd': s.sd, '--dl': s.dl } as React.CSSProperties} />
          ))}
        </div>
        <div className="svc-hero-inner">
          <nav className="svc-breadcrumb" aria-label="breadcrumb">
            <Link href="/">Home</Link>
            <span className="svc-bc-sep">/</span>
            {parent && (
              <>
                <Link href={parent.href}>{parent.label}</Link>
                <span className="svc-bc-sep">/</span>
              </>
            )}
            <span>{page.crumb}</span>
          </nav>
          <h1 className="svc-hero-h1 sd-h1"><TwoTone text={page.h1} /></h1>
          {page.tagline && <p className="sd-tagline"><Rich text={page.tagline} /></p>}
          <div className="sd-hero-lead"><Blocks blocks={heroLead} /></div>
          <Buttons ctas={heroCtas.length ? heroCtas : [DEFAULT_CTA]} />
        </div>
      </section>

      {moreIntro.length > 0 && (
        <section className="cb-section sd-intro">
          <div className="container sd-intro-inner"><Blocks blocks={moreIntro} /></div>
        </section>
      )}

      {(() => {
        let g = 0;
        return body.map((s, i) => (
          <SectionView key={i} s={s} alt={i % 2 === 0} variant={isGroup(s) ? GROUP_VARIANTS[g++ % GROUP_VARIANTS.length] : undefined} />
        ));
      })()}

      {finalIsCta && <FinalCta s={last} />}
    </div>
  );
}
