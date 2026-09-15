'use client';

import { useEffect, useRef } from 'react';
import type { CSSProperties } from 'react';
import { Poppins } from 'next/font/google';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { CASE_STUDIES } from '@/app/case-studies/cases-data';
import './index2.css';

// Scoped to .idx2-root only (not the shared Header/Footer rendered
// alongside it) — applying this at the layout level instead made the real
// site's Footer render in Poppins too, instead of its normal site font.
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  display: 'swap',
});

// A CSS custom property used as an inline style value (e.g. transition delay).
// React's CSSProperties type doesn't know about custom props, so callers cast
// through this helper.
type VarStyle = CSSProperties & Record<`--${string}`, string | number>;

// Blinking hero particles — a fixed, deterministic layout (not Math.random,
// which would mismatch between server and client render) spread across the
// hero using a golden-angle step, cycling through three brand colors. Each
// just fades in/out in place (no drift) for a twinkle/blink feel.
const HERO_PARTICLE_COLORS = ['var(--accent)', 'var(--accent-2)', 'rgba(244, 243, 239, 0.9)'];
const HERO_PARTICLES = Array.from({ length: 30 }, (_, i) => {
  const seed = i * 137.5;
  return {
    top: (seed * 1.9) % 92 + 4,
    left: (seed * 1.3) % 96 + 2,
    size: 2 + (i % 4),
    duration: 2 + (i % 5) * 0.6,
    delay: (i % 10) * 0.4,
    opacityPeak: 0.5 + (i % 3) * 0.15,
    color: HERO_PARTICLE_COLORS[i % HERO_PARTICLE_COLORS.length],
  };
});

// Hover "roll": two stacked copies of the same label, swapped via CSS
// transform when the parent .idx2-btn / .idx2-btn-outline is hovered.
function RollText({ text }: { text: string }) {
  return (
    <span className="idx2-roll">
      <span className="idx2-roll-top">{text}</span>
      <span className="idx2-roll-bottom">{text}</span>
    </span>
  );
}

const HERO_STATS = [
  { value: 5, suffix: '+', label: 'Years Experience' },
  { value: 62, suffix: '+', label: 'Clients Served' },
  { value: 11, suffix: '+', label: 'Countries' },
  { value: 50, suffix: '+', label: 'Brand Partners' },
];

// Simple line-icon set for the services grid — one per service, replacing
// the old "01/02/03…" index numbers.
const SVC_ICONS = {
  webApp: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="8 6 3 12 8 18" />
      <polyline points="16 6 21 12 16 18" />
      <line x1="14" y1="4" x2="10" y2="20" />
    </svg>
  ),
  branding: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22c5-2 8-6 8-11a8 8 0 1 0-16 0c0 3 1.5 4.5 3 6l1 1.5" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  ),
  paidAds: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 11v2a2 2 0 0 0 2 2h1l3 6h2l-1-6h4l6 4V5l-6 4H6a2 2 0 0 0-2 2z" />
    </svg>
  ),
  social: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="6" cy="12" r="2.5" />
      <circle cx="18" cy="5" r="2.5" />
      <circle cx="18" cy="19" r="2.5" />
      <line x1="8.2" y1="10.9" x2="15.8" y2="6.1" />
      <line x1="8.2" y1="13.1" x2="15.8" y2="17.9" />
    </svg>
  ),
  seo: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 17 9 11 13 15 21 6" />
      <polyline points="15 6 21 6 21 12" />
    </svg>
  ),
  ooh: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="11" rx="1.5" />
      <line x1="9" y1="20" x2="15" y2="20" />
      <line x1="12" y1="15" x2="12" y2="20" />
    </svg>
  ),
};

const SERVICES = [
  { icon: SVC_ICONS.webApp, title: 'Web & App Development', desc: 'High-performing websites and mobile applications — fast, secure, and user-first.', href: 'https://wide-wings.ae/web-design-company-dubai/' },
  { icon: SVC_ICONS.branding, title: 'Creative & Branding', desc: 'Brands that look sharp, speak clearly, and actually perform — from identity to execution.', href: 'https://wide-wings.ae/branding-agency-dubai/' },
  { icon: SVC_ICONS.paidAds, title: 'Paid Advertising & Media', desc: 'Campaigns planned, executed, and optimized to maximize reach, conversions, and ROI.', href: 'https://wide-wings.ae/ppc-advertising-company-dubai/' },
  { icon: SVC_ICONS.social, title: 'Social Media Management', desc: 'Strategic content, consistent engagement, and platform-specific growth tactics.', href: 'https://wide-wings.ae/social-media-marketing-agency-in-dubai/' },
  { icon: SVC_ICONS.seo, title: 'SEO & Performance', desc: 'Rank higher, attract quality traffic, and improve long-term digital performance.', href: 'https://wide-wings.ae/seo-services-dubai/' },
  { icon: SVC_ICONS.ooh, title: 'OOH & PR Management', desc: 'Impactful out-of-home advertising and PR campaigns that amplify your brand.', href: 'https://wide-wings.ae/outdoor-advertising-dubai/' },
];

// One "fly in from" origin per card (matches the 3-col grid position), so
// the six boxes converge on their grid slot from scattered directions
// instead of all rising together.
const SVC_FLY = [
  { x: -140, y: -90, r: -8 },
  { x: 0, y: -130, r: 6 },
  { x: 140, y: -90, r: 8 },
  { x: -140, y: 90, r: 8 },
  { x: 0, y: 130, r: -6 },
  { x: 140, y: 90, r: -8 },
];

// Same client roster as the homepage's "trusted by" ticker (app/page.tsx).
const TRUSTED_BRANDS = ['Zaina Cafe', 'Saudi German Hospital', 'Batterjee Properties', 'House of Santoba', 'Bex Beauty', 'SGH Group'];

// Real, published case-study results (app/case-studies/cases-data.tsx) —
// shown as three counters ticking up together with scroll progress.
const RESULTS = [
  { target: 600, suffix: '%', label: 'Traffic Increase', client: 'Saudi German Hospital Group' },
  { target: 5, suffix: '×', label: 'Return on Ad Spend', client: 'Saudi German Hospital Group' },
  { target: 3, suffix: '×', label: 'Engagement Growth in 60 Days', client: 'Zaina Cafe' },
];

// Client reviews, quoted verbatim from the homepage (app/page.tsx).
const REVIEWS = [
  {
    text: 'When we partnered with Wide Wings Media, we expected solid results — they exceeded every benchmark we set and transformed how our audience perceives our brand.',
    name: 'House of Santoba',
    co: 'Retail & Lifestyle Brand',
  },
  {
    text: 'Our primary goal was to attract leads across the MENA region. Wide Wings not only delivered leads — they delivered a 600% traffic increase and 5× ROAS.',
    name: 'Srilesh N',
    co: 'Head of Marketing, SGH Group',
  },
  {
    text: 'Wide Wings Media transformed our online presence completely. Their strategic approach to social media and SEO has been a game changer for our brand.',
    name: 'Bex Beauty',
    co: 'Beauty & Wellness Brand',
  },
];

const BADGES = ['Google Verified Partner', 'Meta Verified Partner', '4.9★ Client Rating', 'No Minimum Retainer'];

// Recent blog posts, hand-picked on the homepage (app/page.tsx) — same three,
// same copy, same order.
const BLOGS = [
  {
    img: 'blog-ecommerce.webp',
    tag: 'E-Commerce',
    date: 'January 15, 2026',
    title: 'Ecommerce Website Development in Dubai for Scalable Growth',
    excerpt: 'Get high-converting ecommerce website development in Dubai & UAE. Fast, secure, mobile-first online stores built for growth.',
    href: 'https://wide-wings.ae/ecommerce-website-development-dubai/',
    cta: 'See how to grow your brand',
  },
  {
    img: 'blog-sem.webp',
    tag: 'SEM',
    date: 'January 13, 2026',
    title: 'Search Engine Marketing Company in Dubai — SEM Services UAE',
    excerpt: 'ROI-focused search engine marketing company in Dubai delivering high-intent PPC campaigns built for the UAE market.',
    href: 'https://wide-wings.ae/search-engine-marketing-company-dubai/',
    cta: 'Get the full story',
  },
  {
    img: 'blog-ppc.webp',
    tag: 'PPC',
    date: 'January 8, 2026',
    title: 'PPC for E-commerce Websites in Dubai: Where to Start',
    excerpt: 'Smart PPC for e-commerce websites in Dubai that aligns with buyer intent — decision-led Google Ads strategies that convert.',
    href: 'https://wide-wings.ae/ppc-for-ecommerce-dubai/',
    cta: 'Explore more strategies',
  },
];

// The real homepage hero tagline, repeating through the pinned horizontal
// section (the hero above uses the other real tagline, from /heropage).
const TAGLINE_ITEMS = ['CONNECT.', 'CREATE.', 'CAPTIVATE.', '/'];
const TAGLINE_REPEATS = [0, 1];

export default function Index2() {
  const rootRef = useRef<HTMLDivElement>(null);
  const progressFillRef = useRef<HTMLDivElement>(null);
  const heroStatsRef = useRef<HTMLDivElement>(null);
  const resultsWrapRef = useRef<HTMLDivElement>(null);
  const resultElsRef = useRef<(HTMLDivElement | null)[]>([]);
  const counterWrapRef = useRef<HTMLDivElement>(null);
  const counterElRef = useRef<HTMLDivElement>(null);
  const pinWrapRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const pinTrackRef = useRef<HTMLDivElement>(null);
  const casesTrackRef = useRef<HTMLDivElement>(null);
  const lastCounterValue = useRef(-1);
  const lastResultValues = useRef<number[]>(RESULTS.map(() => -1));

  const scrollCases = (dir: 1 | -1) => {
    const track = casesTrackRef.current;
    if (!track) return;
    const card = track.querySelector<HTMLElement>('.idx2-case-card');
    const step = card ? card.offsetWidth + 24 : track.clientWidth * 0.9;
    track.scrollBy({ left: dir * step, behavior: 'smooth' });
  };

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const revealEls = Array.from(root.querySelectorAll<HTMLElement>('[data-reveal]'));
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduceMotion) {
      revealEls.forEach((el) => el.classList.add('is-in'));
      heroStatsRef.current?.querySelectorAll<HTMLElement>('[data-count]').forEach((el) => {
        el.textContent = `${el.dataset.count}${el.dataset.suffix ?? ''}`;
      });
      if (counterElRef.current) counterElRef.current.textContent = '62+';
      resultElsRef.current.forEach((el, i) => {
        if (el) el.textContent = `${RESULTS[i].target}${RESULTS[i].suffix}`;
      });
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in');
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.18, rootMargin: '0px 0px -8% 0px' },
    );
    revealEls.forEach((el) => io.observe(el));

    // ── hero stats: count up once, when they first come into view ──
    const countEls = heroStatsRef.current ? Array.from(heroStatsRef.current.querySelectorAll<HTMLElement>('[data-count]')) : [];
    const countIo = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          countIo.disconnect();
          const start = performance.now();
          const duration = 1400;
          const easeOutExpo = (t: number) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));
          const step = (now: number) => {
            const t = Math.min(1, (now - start) / duration);
            const eased = easeOutExpo(t);
            countEls.forEach((el) => {
              const target = Number(el.dataset.count);
              const suffix = el.dataset.suffix ?? '';
              el.textContent = `${Math.round(target * eased)}${suffix}`;
            });
            if (t < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.4 },
    );
    if (heroStatsRef.current) countIo.observe(heroStatsRef.current);

    const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v));
    const sectionProgress = (el: HTMLElement) => {
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      return clamp((vh - r.top) / (vh + r.height));
    };

    // The pinned section's scroll "runway" must match how much horizontal
    // content there is to reveal, or the track finishes early and the pin
    // just sits still for the rest of its taller wrapper. Track width varies
    // by viewport, so size the wrapper from real measurements instead of a
    // fixed vh multiple.
    function setPinWrapHeight() {
      const wrap = pinWrapRef.current;
      const track = pinTrackRef.current;
      const pinH = pinRef.current?.offsetHeight || window.innerHeight;
      if (!wrap || !track) return;
      const travel = Math.max(0, track.scrollWidth - window.innerWidth);
      wrap.style.height = `${pinH + travel + pinH * 0.15}px`;
    }

    // Manual stand-in for `position: sticky` — see the comment on `.idx2-pin`
    // in index2.css for why sticky itself doesn't work here.
    const PIN_TOP_OFFSET = 90;
    function updatePinPosition() {
      const wrap = pinWrapRef.current;
      const pin = pinRef.current;
      if (!wrap || !pin) return;
      const r = wrap.getBoundingClientRect();
      const pinH = pin.offsetHeight;
      if (r.top > PIN_TOP_OFFSET) {
        pin.style.position = 'static';
        pin.style.left = '';
        pin.style.right = '';
        pin.style.top = '';
        pin.style.bottom = '';
      } else if (r.bottom - pinH > PIN_TOP_OFFSET) {
        pin.style.position = 'fixed';
        pin.style.left = '0';
        pin.style.right = '0';
        pin.style.top = `${PIN_TOP_OFFSET}px`;
        pin.style.bottom = '';
      } else {
        pin.style.position = 'absolute';
        pin.style.left = '0';
        pin.style.right = '0';
        pin.style.top = '';
        pin.style.bottom = '0';
      }
    }

    let raf = 0;
    function tick() {
      raf = 0;
      const vh = window.innerHeight;

      if (progressFillRef.current) {
        const docH = document.documentElement.scrollHeight - vh;
        const p = docH > 0 ? clamp(window.scrollY / docH) : 0;
        progressFillRef.current.style.transform = `scaleX(${p})`;
      }

      if (resultsWrapRef.current) {
        const p = sectionProgress(resultsWrapRef.current);
        resultElsRef.current.forEach((el, i) => {
          if (!el) return;
          const val = Math.round(p * RESULTS[i].target);
          if (val !== lastResultValues.current[i]) {
            lastResultValues.current[i] = val;
            el.textContent = `${val}${RESULTS[i].suffix}`;
          }
        });
      }

      if (counterWrapRef.current && counterElRef.current) {
        const p = sectionProgress(counterWrapRef.current);
        const val = Math.round(p * 62);
        if (val !== lastCounterValue.current) {
          lastCounterValue.current = val;
          counterElRef.current.textContent = `${val}+`;
        }
      }

      if (pinWrapRef.current && pinTrackRef.current) {
        updatePinPosition();
        const r = pinWrapRef.current.getBoundingClientRect();
        const pinH = pinRef.current?.offsetHeight || vh;
        const total = r.height - pinH;
        const p = total > 0 ? clamp(-r.top / total) : 0;
        const max = Math.max(0, pinTrackRef.current.scrollWidth - window.innerWidth);
        pinTrackRef.current.style.transform = `translateX(-${max * p}px)`;
      }
    }

    function onScroll() {
      if (!raf) raf = requestAnimationFrame(tick);
    }
    function onResize() {
      setPinWrapHeight();
      onScroll();
    }

    setPinWrapHeight();
    tick();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    return () => {
      io.disconnect();
      countIo.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <Header />
      <div ref={rootRef} id="top" className={`idx2-root ${poppins.className}`}>
      <div className="idx2-progress" aria-hidden="true">
        <div ref={progressFillRef} className="idx2-progress-fill" />
      </div>

      <section className="idx2-hero">
        <video className="idx2-hero-bg" src="/backvid44.mp4" autoPlay loop muted playsInline aria-hidden="true" />
        <div className="idx2-hero-bg-overlay" aria-hidden="true" />
        <div className="idx2-particles" aria-hidden="true">
          {HERO_PARTICLES.map((p, i) => (
            <span
              key={i}
              className="idx2-particle"
              style={{
                top: `${p.top}%`,
                left: `${p.left}%`,
                width: `${p.size}px`,
                height: `${p.size}px`,
                '--pc': p.color,
                '--pdur': `${p.duration}s`,
                '--pdelay': `${p.delay}s`,
                '--pop': p.opacityPeak,
              } as VarStyle}
            />
          ))}
        </div>
        <div className="idx2-hero-content">
          <div className="idx2-eyebrow-pill" data-reveal>
            <span className="idx2-eyebrow-dot" aria-hidden="true" />
            Dubai&apos;s Award-Winning Agency
          </div>
          <h1 className="idx2-hero-title">
            <span className="idx2-line" data-reveal style={{ '--d': '0.05s' } as VarStyle}>Think Wide.</span>
            <span className="idx2-line" data-reveal style={{ '--d': '0.16s' } as VarStyle}>Move Fast.</span>
            <span className="idx2-line idx2-accent" data-reveal style={{ '--d': '0.27s' } as VarStyle}>Grow Far.</span>
          </h1>
          <p className="idx2-hero-sub" data-reveal style={{ '--d': '0.38s' } as VarStyle}>
            Unlock your brand&apos;s potential with our proven marketing expertise. From strategy to
            execution, we drive measurable growth.
          </p>
          <div className="idx2-hero-actions" data-reveal style={{ '--d': '0.46s' } as VarStyle}>
            <a href="https://wide-wings.ae/contact/" className="idx2-btn"><RollText text="Free Consultation" /></a>
            <a href="https://wide-wings.ae/digital-marketing-services/" className="idx2-btn-outline"><RollText text="Our Services" /></a>
          </div>
          <div ref={heroStatsRef} className="idx2-stats" data-reveal style={{ '--d': '0.56s' } as VarStyle}>
            {HERO_STATS.map((s) => (
              <div key={s.label} className="idx2-stat">
                <div className="idx2-stat-num" data-count={s.value} data-suffix={s.suffix}>0{s.suffix}</div>
                <div className="idx2-stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="idx2-seam-badge" aria-hidden="false">
        <span className="idx2-crystal-badge">Trusted by brands across Dubai, GCC and beyond</span>
      </div>

      <section className="idx2-trusted">
        <div className="idx2-trusted-viewport">
          <div className="idx2-trusted-track">
            {[...TRUSTED_BRANDS, ...TRUSTED_BRANDS].map((name, i) => (
              <span key={i} className="idx2-trusted-item">{name}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="idx2-section">
        <div className="idx2-section-head idx2-svc-head">
          <div>
            <h2 data-reveal>WHAT WE DO</h2>
            <p data-reveal>FULL-SERVICE DIGITAL MARKETING</p>
          </div>
          <p className="idx2-svc-note" data-reveal>
            Every service we offer is designed to work together — so your brand grows with momentum,
            not just isolated wins.
          </p>
        </div>
        <div className="idx2-svc-grid">
          {SERVICES.map((svc, i) => (
            <a
              key={svc.title}
              href={svc.href}
              className="idx2-svc-card"
              data-reveal
              style={{
                '--d': `${i * 0.08}s`,
                '--fx': `${SVC_FLY[i].x}px`,
                '--fy': `${SVC_FLY[i].y}px`,
                '--fr': `${SVC_FLY[i].r}deg`,
              } as VarStyle}
            >
              <span className="idx2-svc-icon" aria-hidden="true">{svc.icon}</span>
              <span className="idx2-svc-title">{svc.title}</span>
              <span className="idx2-svc-desc">{svc.desc}</span>
              <span className="idx2-svc-arrow" aria-hidden="true">&#8599;</span>
            </a>
          ))}
        </div>
      </section>

      <section className="idx2-section" ref={resultsWrapRef}>
        <div className="idx2-section-head">
          <h2 data-reveal>RESULTS, IN NUMBERS</h2>
          <p data-reveal>REAL CLIENT OUTCOMES &mdash; SCROLL TO COUNT</p>
        </div>
        <div className="idx2-results">
          {RESULTS.map((r, i) => (
            <div key={r.label} className="idx2-result">
              <div
                ref={(el) => { resultElsRef.current[i] = el; }}
                className="idx2-result-num"
              >
                0{r.suffix}
              </div>
              <div className="idx2-result-label">{r.label}</div>
              <div className="idx2-result-client">{r.client}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="idx2-section idx2-counter-section" ref={counterWrapRef}>
        <div className="idx2-section-head">
          <h2 data-reveal>ABOUT WIDE WINGS</h2>
          <p data-reveal>A UAE-BASED AGENCY WITH GLOBAL AMBITION</p>
        </div>
        <div ref={counterElRef} className="idx2-counter">0+</div>
        <p className="idx2-counter-note" data-reveal>Clients served, and growing.</p>
        <p className="idx2-about-body" data-reveal>
          Wide Wings Media &amp; Advertisement is a UAE-based marketing company offering digital
          marketing services to an ever-growing roster of clients and industries. We are fueled by
          the prospect of bringing creative ideas to life.
        </p>
        <div className="idx2-badges" data-reveal>
          {BADGES.map((b) => (
            <span key={b} className="idx2-badge">{b}</span>
          ))}
        </div>
      </section>

      <section className="idx2-section">
        <div className="idx2-section-head idx2-cases-head">
          <div>
            <h2 data-reveal>SUCCESS STORIES</h2>
            <p data-reveal>REAL BRANDS, REAL RESULTS</p>
          </div>
          <div className="idx2-cases-head-actions">
            <div className="idx2-cases-nav">
              <button type="button" aria-label="Previous success stories" className="idx2-cases-arrow" onClick={() => scrollCases(-1)}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6" /></svg>
              </button>
              <button type="button" aria-label="Next success stories" className="idx2-cases-arrow" onClick={() => scrollCases(1)}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6" /></svg>
              </button>
            </div>
            <a href="https://wide-wings.ae/case-studies" className="idx2-btn-outline">All Case Studies</a>
          </div>
        </div>
        <div className="idx2-cases-track" ref={casesTrackRef}>
          {CASE_STUDIES.map((c, i) => (
            <a
              key={c.href}
              href={`https://wide-wings.ae${c.href}`}
              className="idx2-case-card"
              data-reveal
              style={{ '--d': `${i * 0.08}s` } as VarStyle}
            >
              <div className="idx2-case-card-bg" style={{ backgroundImage: `url('${c.homeBg ?? c.bg}')` }} />
              <div className="idx2-case-card-overlay" />
              <span className="idx2-case-card-accent">{c.cat}</span>
              <span className="idx2-case-card-brand"><img src="/brand-wings.svg" alt="" /></span>
              <span className="idx2-case-card-index">{String(i + 1).padStart(2, '0')}</span>
              <div className="idx2-case-card-content">
                <span className="idx2-case-client">{c.client}</span>
                <span className="idx2-case-title">{c.title}</span>
                <span className="idx2-case-result">{c.result}</span>
                <span className="idx2-case-card-cta">
                  View Case Study
                  <span className="idx2-case-card-cta-arrow" aria-hidden="true">&rarr;</span>
                </span>
              </div>
            </a>
          ))}
        </div>
      </section>

      <section className="idx2-section">
        <div className="idx2-section-head">
          <h2 data-reveal>CLIENT REVIEWS</h2>
          <p data-reveal>IN THEIR WORDS</p>
        </div>
        <div className="idx2-review-grid">
          {REVIEWS.map((r, i) => (
            <div
              key={r.name}
              className="idx2-review-card idx2-review-card-static"
              data-reveal
              style={{ '--d': `${i * 0.1}s` } as VarStyle}
            >
              <span className="idx2-review-quote-mark" aria-hidden="true">&ldquo;</span>
              <p className="idx2-review-text">{r.text}</p>
              <div className="idx2-review-author">{r.name}</div>
              <div className="idx2-review-co">{r.co}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="idx2-section idx2-philosophy-head">
        <div className="idx2-section-head">
          <h2 data-reveal>OUR PHILOSOPHY</h2>
          <p data-reveal>THE WORDS WE BUILD BY</p>
        </div>
      </section>
      <section className="idx2-pin-wrap" ref={pinWrapRef}>
        <div className="idx2-pin" ref={pinRef}>
          <div ref={pinTrackRef} className="idx2-pin-track">
            {TAGLINE_REPEATS.flatMap((rep) =>
              TAGLINE_ITEMS.map((w, i) => (
                <span key={`${rep}-${i}`} className={w === '/' ? 'idx2-pin-slash' : 'idx2-pin-word'}>
                  {w}
                </span>
              )),
            )}
          </div>
        </div>
      </section>

      <section className="idx2-section">
        <div className="idx2-section-head">
          <h2 data-reveal>FROM THE BLOG</h2>
          <p data-reveal>RECENT INSIGHTS</p>
        </div>
        <div className="idx2-blog-grid">
          {BLOGS.map((b, i) => (
            <a
              key={b.href}
              href={b.href}
              className="idx2-blog-card"
              data-reveal
              style={{ '--d': `${i * 0.08}s` } as VarStyle}
            >
              <div className="idx2-blog-thumb" style={{ backgroundImage: `url('/${b.img}')` }}>
                <span className="idx2-blog-tag">{b.tag}</span>
              </div>
              <span className="idx2-blog-date">{b.date}</span>
              <span className="idx2-blog-title">{b.title}</span>
              <span className="idx2-blog-excerpt">{b.excerpt}</span>
              <span className="idx2-blog-cta">{b.cta} &rarr;</span>
            </a>
          ))}
        </div>
      </section>

      <section className="idx2-end">
        <div className="idx2-end-inner">
          <span className="idx2-index" data-reveal style={{ display: 'block', textAlign: 'center' }}>START YOUR JOURNEY</span>
          <h2 data-reveal>
            READY TO <span className="idx2-accent">GROW</span> YOUR BRAND?
          </h2>
          <p className="idx2-end-sub" data-reveal>
            Book a free strategy session with our team. No commitment &mdash; just clarity on what&apos;s
            possible for your brand.
          </p>
          <div className="idx2-hero-actions" data-reveal style={{ justifyContent: 'center' }}>
            <a href="https://wide-wings.ae/contact/" className="idx2-btn">Free Consultation</a>
            <a href="https://wide-wings.ae/digital-marketing-services/" className="idx2-btn-outline">Explore Services</a>
          </div>
          <a href="#top" className="idx2-back" data-reveal>&uarr; BACK TO TOP</a>
        </div>
      </section>
      </div>
      <Footer />
    </>
  );
}
