'use client';

import { useEffect, useRef, useState } from 'react';
import Link from './PlainLink';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { SplitText } from 'gsap/SplitText';
import LogoWhite from '@/components/LogoWhite';
import BlogRail from './BlogRail';
import ReviewRail from './ReviewRail';
import SmokeCanvas from './SmokeCanvas';
import WingMark from './WingMark';
import { CASE_STUDIES } from '../case-studies/cases-data';
import type { Post } from '../blogs/posts-data';
import './home-v4.css';

// All copy is taken from the live home page (app/Home.tsx) and site data.
// `art`: illustrations whose subject sits off to one side of the file. On desktop
// they're drawn smaller with that subject placed mid-screen (clear of the
// service list on the right): fx = subject centre as a fraction of the image
// width, ar = image aspect ratio, h = drawn height, cx = where the subject lands.
type Art = { fx: number; ar: number; h: string; cx: string };
const CHAPTERS: { tab: string; title: string; tagline: string; img: string; art?: Art }[] = [
  { tab: 'Web', title: 'Web & App.', tagline: 'Web Dev · App Dev · UX Design · E-commerce', img: '/back2.jpg' },
  { tab: 'Branding', title: 'Branding.', tagline: 'Brand Identity · Positioning · Visual Design', img: '/home-v4/hero-branding.jpg', art: { fx: 0.68, ar: 1920 / 869, h: '74vh', cx: '46vw' } },
  { tab: 'Social', title: 'Social.', tagline: 'Content · Engagement · Community', img: '/home-v4/hero-social.jpg', art: { fx: 0.46, ar: 1920 / 768, h: '50vh', cx: '43vw' } },
  { tab: 'Performance', title: 'Performance.', tagline: 'SEO · Rankings · Traffic', img: '/home-v4/hero-performance.jpg', art: { fx: 0.67, ar: 1920 / 1080, h: '78vh', cx: '46vw' } },
];

// The six services shown on the live home page (app/Home.tsx), copy + tags as-is.
// pos: background-position for illustrations whose subject sits off-centre
const SERVICES: { title: string; desc: string; img: string; pos?: string; tags: string[]; href: string }[] = [
  { title: 'Web & App Development', desc: 'High-performing websites and mobile applications — fast, secure, and user-first.', img: '/back6.jpg', tags: ['Web Dev', 'App Dev', 'UX Design', 'E-commerce'], href: '/web-design-company-dubai/' },
  { title: 'Creative & Branding', desc: 'Brands that look sharp, speak clearly, and actually perform — from identity to execution.', img: '/home-v4/hero-branding.jpg', pos: '68% center', tags: ['Brand Identity', 'Positioning', 'Visual Design'], href: '/branding-agency-dubai/' },
  { title: 'Paid Advertising & Media', desc: 'Campaigns planned, executed, and optimized to maximize reach, conversions, and ROI.', img: '/back1.jpg', tags: ['Google Ads', 'Media Buying', 'PPC'], href: '/ppc-advertising-company-dubai/' },
  { title: 'Social Media Management', desc: 'Strategic content, consistent engagement, and platform-specific growth tactics.', img: '/home-v4/hero-social.jpg', pos: '46% center', tags: ['Content', 'Engagement', 'Community'], href: '/social-media-marketing-agency-in-dubai/' },
  { title: 'SEO & Performance', desc: 'Rank higher, attract quality traffic, and improve long-term digital performance.', img: '/home-v4/hero-performance.jpg', pos: '67% center', tags: ['SEO', 'Rankings', 'Traffic'], href: '/seo-services-dubai/' },
  { title: 'OOH & PR Management', desc: 'Impactful out-of-home advertising and PR campaigns that amplify your brand.', img: '/back3.jpg', tags: ['Billboards', 'Media Relations', 'OOH'], href: '/outdoor-advertising-dubai/' },
];

// "Our Expertise" cards — copy + icons from the live home page (app/Home.tsx).
const EXPERTISE = [
  { title: 'Performance Marketing', desc: 'Data-led campaigns built for measurable ROI and scalable growth across all digital channels.', icon: <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /> },
  { title: 'Global Reach', desc: 'Operating across 11+ countries with deep local market knowledge and a global perspective.', icon: <><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></> },
  { title: 'Full-Stack Services', desc: 'Strategy, creative, media buying, SEO, and analytics — all in-house under one roof.', icon: <><path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" /></> },
  { title: '50+ Expert Team', desc: 'Specialists across every digital discipline, delivering campaigns that outperform expectations.', icon: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></> },
];

// Micro-visual data for the expertise bento.
const EXP_BARS = [34, 46, 40, 58, 52, 70, 66, 84, 80, 102, 110, 128];
const EXP_LINE = 'M10 176 C60 170 90 156 130 158 S200 128 250 126 S330 134 370 102 S450 76 490 64 S550 40 580 30';
const EXP_CHANNELS = ['Search', 'Social', 'Display', 'Email'];
const EXP_LAYERS = ['Strategy', 'Creative', 'Media buying', 'SEO', 'Analytics'];
const EXP_PINS = [[-30, -22], [18, -34], [34, 6], [-12, 18], [6, 40]];
const EXP_FACES = {
  outer: ['/Shaarawi.webp', '/RachelleIngles-team2.webp', '/Eslam.webp', '/Nesma.webp', '/SethuRaj-team2.webp', '/Alaa.webp'],
  inner: ['/VivianDSouza.png', '/MohamedIbrahimJuba.webp', '/RawanAkram.webp', '/NishantNambiar-team2.webp'],
};

const WHY = [
  { title: "GCC's Best Digital Marketing Agency", desc: 'Recognized across the region for performance-led work that actually moves the needle.', icon: <><circle cx="12" cy="8" r="6" /><path d="M15.5 13.2 17 22l-5-3-5 3 1.5-8.8" /></> },
  { title: 'Flexible — No Minimum Retainer', desc: 'We adapt to your budget and goals. Start small, scale fast, no long-term lock-ins.', icon: <><line x1="4" y1="21" x2="4" y2="14" /><line x1="4" y1="10" x2="4" y2="3" /><line x1="12" y1="21" x2="12" y2="12" /><line x1="12" y1="8" x2="12" y2="3" /><line x1="20" y1="21" x2="20" y2="16" /><line x1="20" y1="12" x2="20" y2="3" /><line x1="1" y1="14" x2="7" y2="14" /><line x1="9" y1="8" x2="15" y2="8" /><line x1="17" y1="16" x2="23" y2="16" /></> },
  { title: 'Google & Meta Verified Partners', desc: 'Certified expertise ensuring compliant and performance-driven campaigns.', icon: <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><polyline points="9 12 11 14 15 10" /></> },
  { title: 'Real-Time Performance Dashboards', desc: "Full transparency on what's working — live visibility into your campaign metrics.", icon: <><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></> },
];

const STATS = [
  { n: 5, label: 'Years Experience' },
  { n: 62, label: 'Clients Served' },
  { n: 11, label: 'Countries' },
  { n: 50, label: 'Brand Partners' },
];

const REVIEWS = [
  { text: 'When we partnered with Wide Wings Media, we expected solid results — they exceeded every benchmark we set and transformed how our audience perceives our brand.', name: 'House of Santoba', co: 'Retail & Lifestyle Brand' },
  { text: 'Our primary goal was to attract leads across the MENA region. Wide Wings not only delivered leads — they delivered a 600% traffic increase and 5× ROAS.', name: 'Srilesh N', co: 'Head of Marketing, SGH Group' },
  { text: 'Wide Wings Media transformed our online presence completely. Their strategic approach to social media and SEO has been a game changer for our brand.', name: 'Bex Beauty', co: 'Beauty & Wellness Brand' },
  // PLACEHOLDER reviews (written for the v4 preview, not from real clients) —
  // replace with genuine client reviews before this page goes live.
  { text: 'Our new website launched on schedule, looks sharp on every device and is far easier for customers to use. The team handled design, development and launch without us chasing anything.', name: 'Marketing Manager', co: 'Real Estate Developer, Dubai' },
  { text: 'From the rebrand to our Google and Meta campaigns, everything sits under one roof now. Weekly reporting is clear, and the team is always ready with the next idea to improve results.', name: 'Founder', co: 'E-commerce Brand, UAE' },
];

// "Let's talk" contact tiles + trust strip (contact details as on the live site).
const TALK_TRUST = ['Google Verified Partner', 'Meta Verified Partner', '4.9★ Client Rating', 'No Minimum Retainer'];
const TALK_CONTACTS = [
  { label: 'WhatsApp', value: '+971 55 565 7609', href: 'https://wa.me/971555657609', ext: true, icon: <path d="M21 11.5a8.4 8.4 0 0 1-12.4 7.4L3 21l2.1-5.5A8.4 8.4 0 1 1 21 11.5z" /> },
  { label: 'Email', value: 'info@wide-wings.ae', href: 'mailto:info@wide-wings.ae', icon: <><rect x="3" y="5" width="18" height="14" rx="2" /><polyline points="3 7 12 13 21 7" /></> },
  { label: 'Call us', value: '+971 4 335 2645', href: 'tel:+97143352645', icon: <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8.1 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z" /> },
  { label: 'Contact form', value: 'Send an enquiry', href: '/contact/', icon: <><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" /></> },
];

const CLIENTS = ['Zaina Cafe', 'Saudi German Hospital', 'Batterjee Properties', 'House of Santoba', 'Bex Beauty', 'SGH Group'];

// Full-screen menu: live-site header items (+ Case Studies), each with a
// one-line note and a preview image shown on hover.
const MENU = [
  { label: 'Services', href: '/digital-marketing-services/', note: 'What we do', img: '/back8.jpg' },
  { label: 'About Us', href: '/about-us/', note: 'Who we are', img: '/Reem.jpg' },
  { label: 'Case Studies', href: '/case-studies/', note: 'Our work', img: '/home-v4/zaina-cafe-poster.jpg' },
  { label: 'Insights', href: '/insights/', note: 'Blogs & ideas', img: '/back2.jpg' },
  { label: 'News', href: '/news/', note: 'Latest updates', img: '/News/img.jpeg' },
  { label: 'Contact', href: '/contact/', note: "Let's talk", img: '/back3.jpg' },
];
const SOCIALS = [
  { label: 'Instagram', href: 'https://www.instagram.com/wide.wings.media/' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/company/wide-wings-media-advertising/' },
  { label: 'Facebook', href: 'https://www.facebook.com/widewingsadvertising' },
  { label: 'X', href: 'https://x.com/Wide_WingsMedia/' },
];

// Success-stories bento: Zaina Cafe film in the centre, the other stories
// around it with the hero image (or reel) from their own case-study page.
const WORK: { href: string; slot: 'a' | 'b' | 'feature' | 'd' | 'e'; img?: string; pos?: string; video?: string; poster?: string }[] = [
  { href: '/case-studies/saudi-german-hospital', slot: 'a', img: '/sgh-best-hospital-in-dubai.webp' },
  { href: '/case-studies/zaina-cafe', slot: 'feature', video: '/home-v4/zaina-cafe-loop.mp4', poster: '/home-v4/zaina-cafe-poster.jpg' },
  { href: '/case-studies/batterjee-properties', slot: 'd', img: '/sbk-dubai-realestate.webp', pos: 'center 30%' },
  { href: '/case-studies/al-sobh-hospital', slot: 'b', img: '/al-sobh-hospital.webp' },
  { href: '/case-studies/make-a-wish-saudi-arabia', slot: 'e', video: '/MAW/maw-reel-1.mp4', poster: '/MAW/maw-reel-1-poster.jpg' },
];

const pad2 = (n: number) => String(n).padStart(2, '0');

function Arrow({ dir = 'ne' }: { dir?: 'ne' | 'se' | 's' }) {
  const rot = { ne: 0, se: 90, s: 135 }[dir];
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true" style={{ transform: `rotate(${rot}deg)` }}>
      <line x1="6" y1="18" x2="18" y2="6" />
      <polyline points="8 6 18 6 18 16" />
    </svg>
  );
}

function SectionHead({ label, line1, line2, children }: { label: string; line1: string; line2: string; children?: React.ReactNode }) {
  return (
    <div className="v4-head">
      <div className="v4-kicker" data-rise>{label}</div>
      <h2 className="v4-h2" data-lines>
        {line1}
        <br />
        <em>{line2}</em>
      </h2>
      {children}
    </div>
  );
}

export default function HomeV4({ posts }: { posts: Post[] }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const smootherRef = useRef<ScrollSmoother | null>(null);
  const heroSTRef = useRef<ScrollTrigger | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuHot, setMenuHot] = useState(0);
  const [chapter, setChapter] = useState(0);
  const [activeSvc, setActiveSvc] = useState(0);
  const [dubaiTime, setDubaiTime] = useState('');

  // live Dubai clock for the "Let's talk" section (client-only, avoids hydration mismatch)
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Dubai', hour: '2-digit', minute: '2-digit' });
    const tick = () => setDubaiTime(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 15000);
    return () => clearInterval(id);
  }, []);

  // magnetic "Let's talk" orb: drifts toward the cursor when it's close (mouse only)
  useEffect(() => {
    const zone = rootRef.current?.querySelector<HTMLElement>('.v4-talk-main');
    const orb = zone?.querySelector<HTMLElement>('.v4-talk-orb');
    const core = orb?.querySelector<HTMLElement>('.v4-talk-core');
    if (!zone || !orb || !core || !matchMedia('(pointer: fine)').matches || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ox = gsap.quickTo(orb, 'x', { duration: 0.8, ease: 'power3' });
    const oy = gsap.quickTo(orb, 'y', { duration: 0.8, ease: 'power3' });
    const cx = gsap.quickTo(core, 'x', { duration: 0.6, ease: 'power3' });
    const cy = gsap.quickTo(core, 'y', { duration: 0.6, ease: 'power3' });
    const move = (e: PointerEvent) => {
      const r = orb.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
      const near = Math.hypot(dx, dy) < r.width * 1.3;
      ox(near ? dx * 0.25 : 0); oy(near ? dy * 0.25 : 0);
      cx(near ? dx * 0.15 : 0); cy(near ? dy * 0.15 : 0);
    };
    const leave = () => { ox(0); oy(0); cx(0); cy(0); };
    zone.addEventListener('pointermove', move);
    zone.addEventListener('pointerleave', leave);
    return () => { zone.removeEventListener('pointermove', move); zone.removeEventListener('pointerleave', leave); };
  }, []);

  useEffect(() => {
    smootherRef.current?.paused(menuOpen);
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMenuOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  const goToChapter = (i: number) => {
    const st = heroSTRef.current;
    if (!st) return;
    const y = st.start + (st.end - st.start) * ((i + 0.05) / CHAPTERS.length);
    if (smootherRef.current) smootherRef.current.scrollTo(y, true);
    else window.scrollTo({ top: y, behavior: 'smooth' });
  };

  // Success-story videos: muted loops that only play while on screen.
  useEffect(() => {
    const vids = Array.from(rootRef.current?.querySelectorAll<HTMLVideoElement>('.v4-work-video') ?? []);
    if (!vids.length) return;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => {
        const v = en.target as HTMLVideoElement;
        v.muted = true;
        if (en.isIntersecting && !reduce) v.play().catch(() => {});
        else v.pause();
      });
    }, { threshold: 0.2 });
    vids.forEach(v => io.observe(v));
    return () => io.disconnect();
  }, []);

  // Cursor spotlight + gentle 3D tilt for [data-spot] cards (mouse only).
  useEffect(() => {
    const root = rootRef.current;
    if (!root || !matchMedia('(pointer: fine)').matches || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const offs: (() => void)[] = [];
    root.querySelectorAll<HTMLElement>('[data-spot]').forEach(el => {
      gsap.set(el, { transformPerspective: 1000 });
      const rx = gsap.quickTo(el, 'rotationX', { duration: 0.6, ease: 'power3' });
      const ry = gsap.quickTo(el, 'rotationY', { duration: 0.6, ease: 'power3' });
      const move = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        const x = e.clientX - r.left, y = e.clientY - r.top;
        el.style.setProperty('--mx', `${x}px`);
        el.style.setProperty('--my', `${y}px`);
        rx((y / r.height - 0.5) * -5);
        ry((x / r.width - 0.5) * 5);
      };
      const leave = () => { rx(0); ry(0); };
      el.addEventListener('pointermove', move);
      el.addEventListener('pointerleave', leave);
      offs.push(() => { el.removeEventListener('pointermove', move); el.removeEventListener('pointerleave', leave); });
    });
    return () => offs.forEach(f => f());
  }, []);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText);
    const root = rootRef.current;
    if (!root) return;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let splitHeadlines = () => {};

    const ctx = gsap.context(() => {
      const smoother = reduce
        ? null
        : ScrollSmoother.create({ wrapper: '#v4-wrapper', content: '#v4-content', smooth: 1.1, effects: true, smoothTouch: 0.1 });
      smootherRef.current = smoother;

      /* ---------- hero intro ---------- */
      // Headline line masks are padded below (and pulled back with a negative margin) so
      // descenders like g / y aren't clipped by the tight display line-height.
      const padMasks = (masks: Element[]) => gsap.set(masks, { paddingBottom: '0.22em', marginBottom: '-0.22em', paddingTop: '0.04em', marginTop: '-0.04em' });
      gsap.timeline({ defaults: { ease: 'expo.out' } })
        .from('.v4-hero-img', { scale: 1.2, duration: 2.6, ease: 'power2.out' }, 0)
        .from('.v4-eyebrow', { x: -20, opacity: 0, duration: 1 }, 0.3)
        .from('.v4-hero-sub, .v4-hero-ctas > *', { y: 24, opacity: 0, duration: 1.1, stagger: 0.08, clearProps: 'transform,opacity' }, 0.6)
        .from('.v4-tab', { y: 20, opacity: 0, duration: 1, stagger: 0.06 }, 0.8)
        .from('.v4-header > *', { y: -16, opacity: 0, duration: 1, stagger: 0.06 }, 0.5);

      /* ---------- pinned hero: scroll advances the chapters ---------- */
      if (!reduce) {
        const n = CHAPTERS.length;
        const imgs = gsap.utils.toArray<HTMLElement>('.v4-hero-img');
        const chaps = gsap.utils.toArray<HTMLElement>('.v4-chapter');
        const fills = gsap.utils.toArray<HTMLElement>('.v4-tab-fill');
        gsap.set(imgs.slice(1), { opacity: 0 });
        gsap.set(chaps, { opacity: 0, y: 60 });

        const tl = gsap.timeline({
          defaults: { ease: 'power2.inOut' },
          scrollTrigger: {
            trigger: '.v4-hero',
            start: 'top top',
            end: () => `+=${innerHeight * (n - 0.3)}`,
            pin: true,
            scrub: 0.6,
            invalidateOnRefresh: true,
            onUpdate: self => {
              const pos = Math.min(self.progress * n, n - 0.0001);
              const idx = Math.floor(pos);
              fills.forEach((f, i) => { f.style.transform = `scaleX(${i < idx ? 1 : i === idx ? pos - idx : 0})`; });
              setChapter(prev => (prev === idx ? prev : idx));
            },
          },
        });
        heroSTRef.current = tl.scrollTrigger ?? null;
        for (let i = 0; i < n - 1; i++) {
          const at = i + 0.62;
          tl.to(imgs[i], { opacity: 0, duration: 0.38 }, at)
            .fromTo(imgs[i + 1], { opacity: 0, scale: 1.18 }, { opacity: 1, scale: 1, duration: 0.6 }, at)
            .to(i === 0 ? '.v4-hero-intro' : chaps[i], { opacity: 0, y: -60, duration: 0.3 }, at)
            .to(chaps[i + 1], { opacity: 1, y: 0, duration: 0.32 }, at + 0.16);
        }
        tl.to({}, { duration: 0.7 }, n - 1); // hold the last chapter before releasing
      }

      /* ---------- headline line reveals ---------- */
      // Splitting into lines must wait for the web fonts: measured with the
      // fallback font the line breaks come out wrong (and Arial flashes on refresh).
      // The hero headline stays hidden in CSS until this runs.
      splitHeadlines = () => {
        const h1 = SplitText.create('.v4-hero-title', { type: 'lines', mask: 'lines' });
        padMasks(h1.masks);
        gsap.set('.v4-hero-intro', { visibility: 'visible' });
        gsap.from(h1.lines, { yPercent: 135, duration: 1.3, stagger: 0.1, ease: 'expo.out', delay: 0.15 });
        gsap.utils.toArray<HTMLElement>('[data-lines]').forEach(el => {
          const s = SplitText.create(el, { type: 'lines', mask: 'lines' });
          padMasks(s.masks);
          gsap.from(s.lines, { yPercent: 135, duration: 1.25, stagger: 0.08, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 86%', once: true } });
        });
        ScrollTrigger.refresh();
      };

      /* ---------- reveals ---------- */
      gsap.utils.toArray<HTMLElement>('[data-rise]').forEach(el => {
        gsap.from(el, { y: 28, opacity: 0, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 90%', once: true } });
      });
      gsap.utils.toArray<HTMLElement>('[data-stagger]').forEach(group => {
        gsap.from(group.children, { y: 50, opacity: 0, duration: 1.1, stagger: 0.09, ease: 'expo.out', scrollTrigger: { trigger: group, start: 'top 85%', once: true } });
      });

      /* ---------- expertise bento ---------- */
      const exp = root.querySelector<HTMLElement>('.v4-expertise');
      if (exp) {
        ScrollTrigger.create({ trigger: exp, start: 'top 75%', once: true, onEnter: () => exp.classList.add('is-in') });
        if (!reduce) {
          gsap.from('.v4-exp-card', {
            y: 80, opacity: 0, scale: 0.94, duration: 1.3, stagger: 0.12, ease: 'expo.out',
            scrollTrigger: { trigger: '.v4-exp-bento', start: 'top 80%', once: true },
          });
          gsap.timeline({ scrollTrigger: { trigger: '.v4-viz-chart', start: 'top 85%', once: true } })
            .from('.v4-chart-bar', { scaleY: 0, transformOrigin: '50% 100%', duration: 1, stagger: 0.04, ease: 'expo.out' }, 0)
            .fromTo('.v4-chart-line', { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 2, ease: 'power2.inOut' }, 0.2)
            .from('.v4-chart-area', { opacity: 0, duration: 1.2 }, 1)
            .from('.v4-chart-dot', { scale: 0, transformOrigin: '50% 50%', duration: 0.7, ease: 'back.out(3)' }, 2)
            .from('.v4-chart-legend > *', { y: 12, opacity: 0, duration: 0.6, stagger: 0.06, ease: 'expo.out' }, 1.4);
          // soft parallax: the visuals drift against the card while scrolling past
          gsap.utils.toArray<HTMLElement>('.v4-exp-viz').forEach(v => {
            gsap.fromTo(v, { yPercent: 6 }, { yPercent: -6, ease: 'none', scrollTrigger: { trigger: v, start: 'top bottom', end: 'bottom top', scrub: true } });
          });
        }
      }

      /* ---------- success-stories bento ---------- */
      if (!reduce) {
        gsap.from('[data-work]', {
          clipPath: 'inset(14% 14% 14% 14% round 22px)', opacity: 0, duration: 1.5, ease: 'expo.out',
          stagger: { each: 0.1, from: 'center' },
          scrollTrigger: { trigger: '.v4-work-grid', start: 'top 80%', once: true },
          clearProps: 'clipPath',
        });
        gsap.utils.toArray<HTMLElement>('.v4-work-media').forEach(m => {
          gsap.fromTo(m, { yPercent: -4 }, { yPercent: 4, ease: 'none', scrollTrigger: { trigger: m.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } });
        });
      }

      /* ---------- why: timeline progress ---------- */
      const tlEl = root.querySelector<HTMLElement>('.v4-tl');
      const tlTrack = tlEl?.querySelector<HTMLElement>('.v4-tl-track');
      if (tlEl && tlTrack) {
        const tlItems = gsap.utils.toArray<HTMLElement>('.v4-tl-item', tlEl);
        const setP = (p: number) => {
          tlEl.style.setProperty('--p', p.toFixed(4));
          const tr = tlTrack.getBoundingClientRect();
          const vertical = tr.height > tr.width;
          tlItems.forEach(it => {
            const n = it.querySelector('.v4-tl-node')!.getBoundingClientRect();
            const at = vertical ? (n.top + n.height / 2 - tr.top) / tr.height : (n.left + n.width / 2 - tr.left) / tr.width;
            it.classList.toggle('is-on', p >= at - 0.002);
          });
        };
        if (reduce) setP(1);
        else ScrollTrigger.create({ trigger: tlEl, start: 'top 80%', end: 'bottom 55%', onUpdate: st => setP(st.progress), onRefresh: st => setP(st.progress) });
      }

      /* ---------- stats ---------- */
      gsap.utils.toArray<HTMLElement>('[data-count]').forEach(el => {
        const o = { v: 0 };
        gsap.to(o, {
          v: Number(el.dataset.count), duration: 2, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 90%', once: true },
          onUpdate: () => { el.textContent = String(Math.round(o.v)); },
        });
      });

      /* ---------- client marquee ---------- */
      const track = root.querySelector<HTMLElement>('.v4-marquee-track');
      if (track) gsap.to(track, { xPercent: -50, duration: 30, ease: 'none', repeat: -1 });

      /* ---------- header ---------- */
      const header = root.querySelector<HTMLElement>('.v4-header');
      let hidden = false;
      ScrollTrigger.create({
        start: 0, end: 'max',
        onUpdate: self => {
          if (!header) return;
          header.classList.toggle('is-solid', self.scroll() > 60);
          const hide = self.direction === 1 && self.scroll() > 200;
          if (hide !== hidden) {
            hidden = hide;
            gsap.to(header, { yPercent: hide ? -110 : 0, duration: 0.7, ease: 'expo.out', overwrite: true });
          }
        },
      });

      root.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
          const id = a.getAttribute('href');
          if (!id || id === '#') return;
          e.preventDefault();
          if (smoother) smoother.scrollTo(id === '#top' ? 0 : id, true, 'top top');
          else document.querySelector(id === '#top' ? 'body' : id)?.scrollIntoView({ behavior: 'smooth' });
        });
      });

    }, root);

    let dead = false;
    if (document.fonts) document.fonts.ready.then(() => { if (!dead) ctx.add(() => splitHeadlines()); });
    else ctx.add(() => splitHeadlines());

    return () => {
      dead = true;
      ctx.revert();
      smootherRef.current = null;
      heroSTRef.current = null;
    };
  }, []);


  return (
    <div className="v4-root" ref={rootRef}>
      {/* ---------- fixed layer ---------- */}
      <header className="v4-header">
        <a href="#top" className="v4-logo" aria-label="Wide Wings Media — back to top">
          <LogoWhite width={124} height={62} uid="v4nav" />
        </a>
        <div className="v4-header-right">
          <Link href="/contact/" className="v4-header-cta">Let&apos;s talk <Arrow /></Link>
          <button type="button" className="v4-menu-btn" onClick={() => setMenuOpen(true)} aria-expanded={menuOpen} aria-controls="v4-menu">
            Menu <span aria-hidden="true" className="v4-plus">+</span>
          </button>
        </div>
      </header>

      <div id="v4-menu" className={`v4-menu ${menuOpen ? 'is-open' : ''}`} aria-hidden={!menuOpen}>
        <div className="v4-menu-aura" aria-hidden="true"><i /><i /></div>
        <div className="v4-menu-top">
          <span className="v4-menu-logo"><LogoWhite width={124} height={62} uid="v4menu" /></span>
          <button type="button" className="v4-menu-btn" onClick={() => setMenuOpen(false)} tabIndex={menuOpen ? 0 : -1}>
            Close <span aria-hidden="true" className="v4-plus is-x">+</span>
          </button>
        </div>

        <div className="v4-menu-body">
          <nav aria-label="Primary" className="v4-menu-nav">
            <ul>
              {MENU.map((m, i) => (
                <li key={m.label} style={{ '--d': `${0.22 + i * 0.06}s` } as React.CSSProperties}>
                  <Link
                    href={m.href}
                    tabIndex={menuOpen ? 0 : -1}
                    onClick={() => setMenuOpen(false)}
                    onPointerEnter={() => setMenuHot(i)}
                    onFocus={() => setMenuHot(i)}
                  >
                    {/* rolling label: the gold copy slides up on hover */}
                    <span className="v4-menu-roll" data-text={m.label}><span>{m.label}</span></span>
                    <span className="v4-menu-note">{m.note}</span>
                    <span className="v4-menu-go" aria-hidden="true"><Arrow /></span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <aside className="v4-menu-side">
            <div className="v4-menu-preview" aria-hidden="true">
              {MENU.map((m, i) => (
                <div key={m.label} className={`v4-menu-shot ${menuHot === i ? 'is-on' : ''}`} style={{ backgroundImage: `url('${m.img}')` }}>
                  {m.label === 'Contact' && (
                    <span className="v4-menu-shot-logo"><LogoWhite width={280} height={141} uid="v4menucontact" /></span>
                  )}
                </div>
              ))}
              <span className="v4-menu-caption">{MENU[menuHot].label} <i>— {MENU[menuHot].note}</i></span>
            </div>
            <div className="v4-menu-info">
              <div>
                <small>Email</small>
                <a href="mailto:info@wide-wings.ae" tabIndex={menuOpen ? 0 : -1}>info@wide-wings.ae</a>
              </div>
              <div>
                <small>Call</small>
                <a href="tel:+97143352645" tabIndex={menuOpen ? 0 : -1}>+971 4 335 2645</a>
              </div>
              <div>
                <small>WhatsApp</small>
                <a href="https://wa.me/971555657609" target="_blank" rel="noopener" tabIndex={menuOpen ? 0 : -1}>+971 55 565 7609</a>
              </div>
            </div>
            <div className="v4-menu-social">
              {SOCIALS.map(so => (
                <a key={so.label} href={so.href} target="_blank" rel="noopener" tabIndex={menuOpen ? 0 : -1}>{so.label}</a>
              ))}
            </div>
            <Link href="/contact/" className="v4-pill v4-pill-block" tabIndex={menuOpen ? 0 : -1} onClick={() => setMenuOpen(false)}>
              Free Consultation <span className="v4-pill-dot"><Arrow /></span>
            </Link>
          </aside>
        </div>
      </div>

      {/* ---------- smooth-scrolled content ---------- */}
      <div id="v4-wrapper">
        <div id="v4-content">
          <main>
            {/* HERO — pinned, scroll-driven chapters */}
            <section className="v4-hero" id="top">
              <div className="v4-hero-media" aria-hidden="true">
                {CHAPTERS.map(c => (
                  <div
                    key={c.tab}
                    className={`v4-hero-img ${c.art ? 'is-art' : ''}`}
                    style={{
                      backgroundImage: `url('${c.img}')`,
                      ...(c.art && { '--fx': c.art.fx, '--ar': c.art.ar, '--h': c.art.h, '--cx': c.art.cx }),
                    } as React.CSSProperties}
                  />
                ))}
                <div className="v4-hero-shade" />
              </div>

              <div className="v4-hero-intro">
                <div className="v4-eyebrow"><i />Dubai&apos;s Award-Winning Agency</div>
                <h1 className="v4-hero-title">Connect <span className="v4-thin">Create</span><br /><em>Captivate</em></h1>
                <p className="v4-hero-sub">
                  Unlock your brand&apos;s potential with our proven marketing expertise. From strategy to execution, we drive measurable growth.
                </p>
                <div className="v4-hero-ctas">
                  <Link href="/contact/" className="v4-pill">
                    Free Consultation <span className="v4-pill-dot"><Arrow /></span>
                  </Link>
                  <a href="#v4-work" className="v4-ghost">
                    See our work <span className="v4-ghost-dot"><Arrow dir="s" /></span>
                  </a>
                </div>
              </div>

              <div className="v4-hero-chapters" aria-live="polite">
                {CHAPTERS.map((c, i) => (
                  <div key={c.tab} className={`v4-chapter ${i === chapter ? 'is-current' : ''}`} aria-hidden={i === 0 || i !== chapter}>
                    <div className="v4-chapter-title"><WingMark uid={`ch${i}`} />{c.title}</div>
                    <div className="v4-chapter-tag v4-mono">{c.tagline}</div>
                  </div>
                ))}
              </div>

              {/* chapter jump buttons + a final link out to the full Services page */}
              <nav className="v4-tabs" aria-label="Services">
                {CHAPTERS.map((c, i) => (
                  <button
                    key={c.tab}
                    type="button"
                    aria-current={i === chapter ? 'true' : undefined}
                    className={`v4-tab ${i === chapter ? 'is-active' : ''}`}
                    onClick={() => goToChapter(i)}
                  >
                    <span className="v4-tab-num">{pad2(i + 1)}</span>
                    <span className="v4-tab-label">{c.tab}</span>
                    <span className="v4-tab-arrow" aria-hidden="true"><Arrow /></span>
                    <span className="v4-tab-bar"><i className="v4-tab-fill" /></span>
                  </button>
                ))}
                <Link href="/digital-marketing-services/" className="v4-tab v4-tab-more">
                  <span className="v4-tab-num">{pad2(CHAPTERS.length + 1)}</span>
                  <span className="v4-tab-label">More services</span>
                  <span className="v4-tab-arrow" aria-hidden="true"><Arrow /></span>
                  <span className="v4-tab-bar" />
                </Link>
              </nav>
            </section>

            {/* 01 — OUR EXPERTISE: bento with live micro-visuals */}
            <section className="v4-section v4-expertise">
              <SmokeCanvas className="v4-exp-smoke" alpha={0.1} />
              <div className="v4-exp-bento">
                <div className="v4-exp-copy">
                  <div className="v4-kicker" data-rise>Our expertise</div>
                  <h2 className="v4-h2" data-lines>Results-Driven<br /><em>Digital Marketing</em><br />Agency in Dubai</h2>
                  <p className="v4-lead" data-rise>
                    We specialize in creating and executing result-driven digital marketing campaigns that go beyond basic social media management, SEO, and Google Ads. We transform how companies leverage digital opportunities and guide them toward increased brand awareness, lead generation, and revenue growth.
                  </p>
                  <div className="v4-exp-cta" data-rise>
                    <Link href="/about-us/" className="v4-pill">
                      Learn about us <span className="v4-pill-dot"><Arrow /></span>
                    </Link>
                  </div>
                </div>

                {/* E01 performance — growth chart draws in, a pulse runs along the line */}
                <article className="v4-exp-card v4-exp-perf v4-spot" data-spot>
                  <div className="v4-exp-card-top">
                    <span className="v4-exp-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke={`url(#v4exp0)`} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <defs>
                          <linearGradient id="v4exp0" x1="0" y1="0" x2="1" y2="1">
                            <stop stopColor="#d34ba4" />
                            <stop offset="1" stopColor="#cfa821" />
                          </linearGradient>
                        </defs>
                        {EXPERTISE[0].icon}
                      </svg>
                    </span>
                    <span className="v4-chip">E01</span>
                  </div>
                  <div className="v4-exp-viz v4-viz-chart" aria-hidden="true">
                    <svg viewBox="0 0 600 200">
                      <defs>
                        <linearGradient id="v4chartFill" x1="0" y1="0" x2="0" y2="1">
                          <stop stopColor="#d34ba4" stopOpacity="0.32" />
                          <stop offset="1" stopColor="#d34ba4" stopOpacity="0" />
                        </linearGradient>
                        <linearGradient id="v4chartStroke" x1="0" y1="0" x2="1" y2="0">
                          <stop stopColor="#cfa821" />
                          <stop offset="1" stopColor="#d34ba4" />
                        </linearGradient>
                      </defs>
                      {[40, 90, 140].map(y => <line key={y} className="v4-chart-grid" x1="0" x2="600" y1={y} y2={y} />)}
                      {EXP_BARS.map((h, i) => <rect key={i} className="v4-chart-bar" x={14 + i * 48} y={200 - h} width="22" height={h} rx="4" />)}
                      <path className="v4-chart-area" d={`${EXP_LINE} L580 200 L10 200 Z`} />
                      <path className="v4-chart-line" d={EXP_LINE} pathLength={1} />
                      <path className="v4-chart-pulse" d={EXP_LINE} pathLength={1} />
                      <g className="v4-chart-dot">
                        <circle className="v4-chart-ring" cx="580" cy="30" r="9" />
                        <circle cx="580" cy="30" r="5" />
                      </g>
                    </svg>
                    <div className="v4-chart-legend">
                      {EXP_CHANNELS.map(c => <span key={c} className="v4-chip">{c}</span>)}
                    </div>
                  </div>
                  <div className="v4-exp-text">
                    <h3>{EXPERTISE[0].title}</h3>
                    <p>{EXPERTISE[0].desc}</p>
                  </div>
                </article>

                {/* E02 global reach — spinning wireframe globe with pulsing markets */}
                <article className="v4-exp-card v4-exp-globe v4-spot" data-spot>
                  <div className="v4-exp-card-top">
                    <span className="v4-exp-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke={`url(#v4exp1)`} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <defs>
                          <linearGradient id="v4exp1" x1="0" y1="0" x2="1" y2="1">
                            <stop stopColor="#d34ba4" />
                            <stop offset="1" stopColor="#cfa821" />
                          </linearGradient>
                        </defs>
                        {EXPERTISE[1].icon}
                      </svg>
                    </span>
                    <span className="v4-chip">E02</span>
                  </div>
                  <div className="v4-exp-viz v4-viz-globe" aria-hidden="true">
                    <svg viewBox="-80 -80 160 160">
                      <circle className="v4-globe-orbit" r="76" />
                      <circle className="v4-globe-edge" r="60" />
                      {[-36, -12, 12, 36].map(y => <ellipse key={y} className="v4-globe-lat" cy={y} rx={Math.sqrt(3600 - y * y)} ry={Math.sqrt(3600 - y * y) * 0.16} />)}
                      <line className="v4-globe-lat" x1="-60" x2="60" />
                      {[0, 1, 2, 3].map(i => <ellipse key={i} className="v4-globe-mer" rx="60" ry="60" style={{ animationDelay: `${-i * 1.75}s` }} />)}
                      {EXP_PINS.map(([x, y], i) => (
                        <g key={i} transform={`translate(${x} ${y})`}>
                          <circle className="v4-globe-ping" r="4" style={{ animationDelay: `${i * 0.6}s` }} />
                          <circle className="v4-globe-pin" r="2.4" />
                        </g>
                      ))}
                    </svg>
                  </div>
                  <div className="v4-exp-big"><span data-count="11">11</span>+<small>Countries</small></div>
                  <div className="v4-exp-text">
                    <h3>{EXPERTISE[1].title}</h3>
                    <p>{EXPERTISE[1].desc}</p>
                  </div>
                </article>

                {/* E03 full-stack — isometric layers fan out, each discipline lights in turn */}
                <article className="v4-exp-card v4-exp-stack v4-spot" data-spot>
                  <div className="v4-exp-card-top">
                    <span className="v4-exp-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke={`url(#v4exp2)`} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <defs>
                          <linearGradient id="v4exp2" x1="0" y1="0" x2="1" y2="1">
                            <stop stopColor="#d34ba4" />
                            <stop offset="1" stopColor="#cfa821" />
                          </linearGradient>
                        </defs>
                        {EXPERTISE[2].icon}
                      </svg>
                    </span>
                    <span className="v4-chip">E03</span>
                  </div>
                  <div className="v4-exp-viz v4-viz-stack" aria-hidden="true">
                    <div className="v4-layers">
                      {EXP_LAYERS.map((l, i) => (
                        <span key={l} className="v4-layer" style={{ '--i': EXP_LAYERS.length - 1 - i, animationDelay: `${i * 1.2}s` } as React.CSSProperties} />
                      ))}
                    </div>
                    <ul className="v4-layer-labels">
                      {EXP_LAYERS.map((l, i) => (
                        <li key={l} style={{ animationDelay: `${i * 1.2}s` }}>{l}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="v4-exp-text">
                    <h3>{EXPERTISE[2].title}</h3>
                    <p>{EXPERTISE[2].desc}</p>
                  </div>
                </article>

                {/* E04 team — faces orbit the headcount */}
                <article className="v4-exp-card v4-exp-team v4-spot" data-spot>
                  <div className="v4-exp-card-top">
                    <span className="v4-exp-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke={`url(#v4exp3)`} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <defs>
                          <linearGradient id="v4exp3" x1="0" y1="0" x2="1" y2="1">
                            <stop stopColor="#d34ba4" />
                            <stop offset="1" stopColor="#cfa821" />
                          </linearGradient>
                        </defs>
                        {EXPERTISE[3].icon}
                      </svg>
                    </span>
                    <span className="v4-chip">E04</span>
                  </div>
                  <div className="v4-exp-viz v4-viz-team" aria-hidden="true">
                    {(['outer', 'inner'] as const).map(ring => (
                      <div key={ring} className={`v4-orbit v4-orbit-${ring}`}>
                        {EXP_FACES[ring].map((src, i, arr) => (
                          <span key={src} className="v4-orbit-slot" style={{ '--a': `${(360 / arr.length) * i}deg` } as React.CSSProperties}>
                            <span className="v4-orbit-face" style={{ backgroundImage: `url('${src}')` }} />
                          </span>
                        ))}
                      </div>
                    ))}
                    <div className="v4-orbit-core"><span data-count="50">50</span>+</div>
                  </div>
                  <div className="v4-exp-text">
                    <h3>{EXPERTISE[3].title}</h3>
                    <p>{EXPERTISE[3].desc}</p>
                  </div>
                </article>
              </div>
            </section>

            {/* 02 — SELECTED WORK: bento, Zaina Cafe film in the centre */}
            <section className="v4-section" id="v4-work">
              <div className="v4-svc-head">
                <SectionHead label="Selected work" line1="Our Success" line2="Stories." />
                <div className="v4-svc-more" data-rise>
                  <Link href="/case-studies" className="v4-pill">
                    See all work <span className="v4-pill-dot"><Arrow /></span>
                  </Link>
                </div>
              </div>

              <div className="v4-work-grid">
                {WORK.map(w => {
                  const c = CASE_STUDIES.find(x => x.href === w.href);
                  if (!c) return null;
                  return (
                    <Link key={w.href} href={w.href} className={`v4-work v4-work-${w.slot}`} data-work>
                      <div className="v4-work-media">
                        {w.video ? (
                          <video className="v4-work-video" src={w.video} poster={w.poster} muted loop playsInline preload="metadata" aria-hidden="true" />
                        ) : (
                          <div className="v4-work-img" style={{ backgroundImage: `url('${w.img}')`, backgroundPosition: w.pos }} />
                        )}
                      </div>
                      <div className="v4-work-shade" />
                      {w.slot === 'feature' && (
                        <span className="v4-chip v4-work-badge"><span className="v4-work-live" aria-hidden="true" /> Case film</span>
                      )}
                      <span className="v4-work-go" aria-hidden="true"><Arrow /></span>
                      <div className="v4-work-label">
                        <div className="v4-work-name">
                          {c.client}
                          <svg className="v4-work-tick" viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M12 1.5l2.6 2 3.2-.4 1.2 3 3 1.2-.4 3.2 2 2.6-2 2.6.4 3.2-3 1.2-1.2 3-3.2-.4-2.6 2-2.6-2-3.2.4-1.2-3-3-1.2.4-3.2-2-2.6 2-2.6-.4-3.2 3-1.2 1.2-3 3.2.4z" />
                            <polyline points="8 12.5 11 15.5 16.5 9.5" />
                          </svg>
                        </div>
                        <div className="v4-work-sub">{c.cat} · {c.title}</div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>

            {/* WHY: scroll-drawn timeline */}
            <section className="v4-section v4-why">
              <div className="v4-why-smoke" aria-hidden="true" />
              <div className="v4-why-head">
                <div>
                  <div className="v4-kicker" data-rise>Why Wide Wings</div>
                  <h2 className="v4-h2 v4-why-h2" data-lines>One of the Top<br /><em>Companies in Dubai.</em></h2>
                </div>
                <p className="v4-why-lead" data-rise>
                  We deliver strategic thinking, outstanding execution, and trackable results — which is why growing brands trust Wide Wings as their long-term marketing partner.
                </p>
              </div>
              {/* scroll-drawn timeline: the line fills, each node lights up as it's reached */}
              <div className="v4-tl">
                <div className="v4-tl-track" aria-hidden="true">
                  <i className="v4-tl-fill" />
                  <i className="v4-tl-spark" />
                </div>
                <ol className="v4-tl-grid">
                  {WHY.map(w => (
                    <li key={w.title} className="v4-tl-item">
                      <span className="v4-tl-node" aria-hidden="true">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">{w.icon}</svg>
                      </span>
                      <div className="v4-tl-text">
                        <h3>{w.title}</h3>
                        <p>{w.desc}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </section>

            {/* 03 — NUMBERS */}
            <section className="v4-section v4-stats-wrap">
              <div className="v4-kicker" data-rise>In numbers</div>
              <div className="v4-stats" data-stagger>
                {STATS.map(s => (
                  <div key={s.label} className="v4-stat">
                    <div className="v4-stat-num"><span data-count={s.n}>{s.n}</span><em>+</em></div>
                    <div className="v4-mono v4-stat-label">{s.label}</div>
                  </div>
                ))}
              </div>
            </section>

            {/* 05 — SERVICES: list + showcase panel */}
            <section className="v4-section v4-services" id="v4-services">
              {/* heading on the left, "View all services" on the right */}
              <div className="v4-svc-head">
                <SectionHead label="What we do" line1="Full-Service" line2="Agency.">
                  <p className="v4-lead" data-rise>
                    Every service we offer is designed to work together — so your brand grows with momentum, not just isolated wins.
                  </p>
                </SectionHead>
                <div className="v4-svc-more" data-rise>
                  <Link href="/digital-marketing-services/" className="v4-pill">
                    View all services <span className="v4-pill-dot"><Arrow /></span>
                  </Link>
                </div>
              </div>

              {/* list on the left, showcase panel on the right; auto-advances, hover to pick */}
              <div className="v4-svx">
                <ol className="v4-svx-list" data-stagger>
                  {SERVICES.map((sv, i) => (
                    <li key={sv.title} className={`v4-svx-row ${i === activeSvc ? 'is-active' : ''}`}>
                      <Link href={sv.href} className="v4-svx-link" onPointerEnter={() => setActiveSvc(i)} onFocus={() => setActiveSvc(i)}>
                        <span className="v4-svx-num">{pad2(i + 1)}</span>
                        <span className="v4-svx-title">{sv.title}</span>
                        <span className="v4-svx-go" aria-hidden="true"><Arrow /></span>
                      </Link>
                      <div className="v4-svx-more">
                        <p>{sv.desc}</p>
                        <ul className="v4-svx-tags">{sv.tags.map(t => <li key={t}>{t}</li>)}</ul>
                      </div>
                      <span className="v4-svx-bar" aria-hidden="true">
                        <i onAnimationEnd={() => setActiveSvc(n => (n === i ? (i + 1) % SERVICES.length : n))} />
                      </span>
                    </li>
                  ))}
                </ol>

                <div className="v4-svx-panel" aria-hidden="true">
                  {SERVICES.map((sv, i) => (
                    <div key={sv.title} className={`v4-svx-slide ${i === activeSvc ? 'is-active' : ''}`}>
                      <div className="v4-svx-img" style={{ backgroundImage: `url('${sv.img}')`, backgroundPosition: sv.pos }} />
                      <div className="v4-svx-shade" />
                      <span className="v4-svx-bignum">{pad2(i + 1)}</span>
                      <div className="v4-svx-body">
                        <ul className="v4-svx-tags">{sv.tags.map(t => <li key={t}>{t}</li>)}</ul>
                        <h3>{sv.title}</h3>
                        <p>{sv.desc}</p>
                      </div>
                    </div>
                  ))}
                  <span className="v4-svx-count">{pad2(activeSvc + 1)} / {pad2(SERVICES.length)}</span>
                </div>
              </div>

            </section>

            {/* 05 — INSIGHTS: vertical-story rail */}
            {posts.length > 0 && (
              <section className="v4-section v4-stories">
                <div className="v4-stories-head">
                  <div>
                    <div className="v4-kicker" data-rise>Insights</div>
                    <h2 className="v4-h2" data-lines>Recent Blogs.<br /><em>Expert perspectives.</em></h2>
                  </div>
                  <div className="v4-stories-aside" data-rise>
                    <p>Expert perspectives on digital marketing, web design, SEO, and growth strategies for businesses in Dubai and the UAE.</p>
                    <Link href="/insights/" className="v4-textlink">All articles <Arrow dir="se" /></Link>
                  </div>
                </div>
                <BlogRail posts={posts} />
              </section>
            )}

            {/* CLIENTS */}
            <section className="v4-clients">
              <div className="v4-mono v4-clients-label" data-rise>Trusted by brands across Dubai, GCC and beyond</div>
              <div className="v4-marquee" aria-label="Clients">
                <div className="v4-marquee-track">
                  {[...CLIENTS, ...CLIENTS, ...CLIENTS, ...CLIENTS].map((c, i) => (
                    <span key={i} className="v4-marquee-item">{c}<i aria-hidden="true">✦</i></span>
                  ))}
                </div>
              </div>
            </section>

            {/* 06 — REVIEWS */}
            <section className="v4-section v4-reviews-sec">
              <SectionHead label="Client reviews" line1="What Our Clients" line2="Say." />
              <ReviewRail reviews={REVIEWS} />
            </section>

            {/* 08 — LET'S TALK: aurora backdrop, magnetic orb CTA, contact tiles, trust strip */}
            <section className="v4-section v4-talk" id="v4-talk">
              <div className="v4-talk-aura" aria-hidden="true"><i /><i /><i /></div>
              <div className="v4-talk-lines" aria-hidden="true" />

              <div className="v4-talk-top">
                <div className="v4-kicker" data-rise>Start your journey</div>
                <div className="v4-talk-clock" data-rise>
                  <span className="v4-work-live" aria-hidden="true" /> Dubai · <time>{dubaiTime || '--:--'}</time> GST
                </div>
              </div>

              <div className="v4-talk-main">
                <div className="v4-talk-copy">
                  <h2 className="v4-h2 v4-talk-h2" data-lines>Ready to Grow<br /><em>Your Brand?</em></h2>
                  <p className="v4-lead" data-rise>
                    Book a free strategy session with our team. No commitment — just clarity on what&apos;s possible for your brand.
                  </p>
                </div>
                <Link href="/contact/" className="v4-talk-orb" aria-label="Book a free consultation">
                  <svg className="v4-talk-ring" viewBox="0 0 200 200" aria-hidden="true">
                    <defs>
                      <path id="v4-ring-path" d="M100,100 m-80,0 a80,80 0 1,1 160,0 a80,80 0 1,1 -160,0" />
                    </defs>
                    <text>
                      <textPath href="#v4-ring-path" textLength="500" lengthAdjust="spacing">FREE CONSULTATION ✦ BOOK A STRATEGY SESSION ✦</textPath>
                    </text>
                  </svg>
                  <span className="v4-talk-core">
                    <Arrow />
                    <b>Let&apos;s talk</b>
                  </span>
                </Link>
              </div>

              <div className="v4-talk-tiles" data-stagger>
                {TALK_CONTACTS.map(c => {
                  const inner = (
                    <>
                      <span className="v4-talk-ico" aria-hidden="true">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">{c.icon}</svg>
                      </span>
                      <span className="v4-talk-tile-txt">
                        <small>{c.label}</small>
                        <b>{c.value}</b>
                      </span>
                      <span className="v4-talk-tile-go" aria-hidden="true"><Arrow /></span>
                    </>
                  );
                  return c.href.startsWith('/') ? (
                    <Link key={c.label} href={c.href} className="v4-talk-tile">{inner}</Link>
                  ) : (
                    <a key={c.label} href={c.href} className="v4-talk-tile" {...(c.ext ? { target: '_blank', rel: 'noopener' } : {})}>{inner}</a>
                  );
                })}
              </div>

              <div className="v4-talk-trust">
                <div className="v4-talk-trust-track">
                  {[...TALK_TRUST, ...TALK_TRUST, ...TALK_TRUST, ...TALK_TRUST].map((t, i) => (
                    <span key={i} aria-hidden={i >= TALK_TRUST.length || undefined}>{t}<i aria-hidden="true">✦</i></span>
                  ))}
                </div>
              </div>
            </section>

            <footer className="v4-footer">
              <LogoWhite width={140} height={70} uid="v4foot" />
              <nav className="v4-footer-nav" aria-label="Footer">
                {MENU.map(m => <Link key={m.label} href={m.href}>{m.label}</Link>)}
              </nav>
              <div className="v4-footer-base v4-mono">
                <span>© {new Date().getFullYear()} Wide Wings Media &amp; Advertisement</span>
                <a href="#top">Back to top ↑</a>
              </div>
            </footer>
          </main>
        </div>
      </div>
    </div>
  );
}
