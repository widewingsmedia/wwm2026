import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getPageMetadata } from '@/lib/seo';
import './branding-agency-dubai.css';
import '../services.css';

const WHAT_WE_DO = [
  {
    num: '01',
    title: 'Brand Strategy',
    desc: 'We define how your brand thinks, speaks, and shows up. Positioning, tone of voice, messaging frameworks, built to last.',
  },
  {
    num: '02',
    title: 'Visual Identity & Design',
    desc: 'We create identities that are consistent, memorable, and flexible.',
  },
  {
    num: '03',
    title: 'Logo Design Services',
    desc: 'Brand guidelines, social media design system, packaging & print assets, and graphic design services. Make the first thing your audience view stand out.',
  },
  {
    num: '04',
    title: 'Strategic Branding',
    desc: 'Every decision we make ties back to how your brand performs in the real world.',
  },
  {
    num: '05',
    title: 'Clarity and Impact',
    desc: 'Marketing creatives, campaign visuals, digital & social assets, presentation design, brochure & print design, and of course,',
  },
];

const EXPERTISE = [
  {
    title: 'Visual Communication',
    desc: 'We create visuals that capture attention and communicate your message with clarity and speed.',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="8" width="40" height="28" rx="3"/>
        <circle cx="24" cy="22" r="7"/>
        <line x1="29" y1="27" x2="35" y2="33"/>
        <line x1="16" y1="44" x2="32" y2="44"/>
        <line x1="24" y1="36" x2="24" y2="44"/>
      </svg>
    ),
  },
  {
    title: 'Copywriting & Messaging',
    desc: 'Our copywriters develop persuasive messaging that drives action, from website content to high-performing ad scripts.',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 4h24l8 8v32H8z"/>
        <line x1="16" y1="20" x2="32" y2="20"/>
        <line x1="16" y1="27" x2="32" y2="27"/>
        <line x1="16" y1="34" x2="24" y2="34"/>
        <path d="M32 4v8h8"/>
      </svg>
    ),
  },
  {
    title: 'Video Production',
    desc: 'Video remains one of the most powerful formats. We produce both short and long-form content designed to engage, retain, and convert.',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="10" width="30" height="28" rx="3"/>
        <polyline points="34,19 44,13 44,35 34,29"/>
      </svg>
    ),
  },
  {
    title: 'Design Evolution',
    desc: 'Your brand is growing? We keep up with evolving design trends to ensure your brand consistently feels fresh, current, and aligned with market expectations.',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 24a16 16 0 1 1 32 0"/>
        <polyline points="36,16 40,24 44,16"/>
        <path d="M40 24a16 16 0 0 1-32 0"/>
        <polyline points="12,32 8,24 4,32"/>
      </svg>
    ),
  },
  {
    title: 'Content Delivery',
    desc: 'Delivering consistent, high-quality content is key to building credibility, strengthening your presence, and earning audience trust.',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="24" cy="24" r="20"/>
        <polyline points="16,24 22,30 34,18"/>
      </svg>
    ),
  },
];

const PROCESS = [
  {
    title: 'Strategy & Messaging',
    desc: 'Speak your truth through scripts that tell your story and deliver the message. Then we shape the message, build the identity, and roll it out across everything your audience sees.',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 12h32M8 20h20M8 28h24M8 36h16"/>
        <circle cx="38" cy="32" r="7"/>
        <line x1="38" y1="29" x2="38" y2="35"/><line x1="35" y1="32" x2="41" y2="32"/>
      </svg>
    ),
  },
  {
    title: 'Feedback & Delivery',
    desc: 'You get exactly what you ask for, we leave safe space for providing feedback, ensuring your vision is perfectly delivered.',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 8h36v24H6z"/><polyline points="6,32 18,20 26,28 34,18 42,26"/>
        <line x1="14" y1="40" x2="34" y2="40"/><line x1="24" y1="32" x2="24" y2="40"/>
      </svg>
    ),
  },
  {
    title: 'Flexibility & Execution',
    desc: 'Flexibility and punctuality are two sides of our coin, keeping your marketing channels active.',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="24" cy="24" r="20"/>
        <polyline points="24,12 24,24 32,30"/>
      </svg>
    ),
  },
];

const WHY_US = [
  {
    title: 'Strategic Approach',
    desc: 'We align creative decisions with your business goals for maximum impact.',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="24" cy="24" r="20"/><circle cx="24" cy="24" r="10"/>
        <circle cx="24" cy="24" r="3" fill="currentColor" stroke="none"/>
        <line x1="24" y1="4" x2="24" y2="14"/><line x1="24" y1="34" x2="24" y2="44"/>
        <line x1="4" y1="24" x2="14" y2="24"/><line x1="34" y1="24" x2="44" y2="24"/>
      </svg>
    ),
  },
  {
    title: 'World-Class Design',
    desc: 'Our award-winning designers create visuals that are both beautiful and functional.',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M24 4l4.5 9 10 1.5-7.25 7 1.75 10L24 26.5 15 31.5l1.75-10L9.5 14.5l10-1.5z"/>
      </svg>
    ),
  },
  {
    title: 'Full-Service Agency',
    desc: 'We can extend your new brand into web, social, and marketing campaigns seamlessly.',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="4" width="18" height="18" rx="2"/><rect x="26" y="4" width="18" height="18" rx="2"/>
        <rect x="4" y="26" width="18" height="18" rx="2"/><rect x="26" y="26" width="18" height="18" rx="2"/>
      </svg>
    ),
  },
  {
    title: 'Market Expertise',
    desc: 'We understand the Dubai and GCC market nuances, ensuring cultural relevance.',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="24" cy="24" r="20"/>
        <line x1="4" y1="24" x2="44" y2="24"/>
        <path d="M24 4 C14 14, 14 34, 24 44"/><path d="M24 4 C34 14, 34 34, 24 44"/>
      </svg>
    ),
  },
];

const FAQS = [
  {
    q: 'What is included in a branding package?',
    a: 'Our packages typically include logo design, color palette, typography, brand voice guidelines, and stationery design.',
  },
  {
    q: 'How long does the branding process take?',
    a: 'A comprehensive branding project usually takes 4-8 weeks, depending on the scope and number of deliverables.',
  },
  {
    q: 'Do you offer re-branding services?',
    a: 'Yes. We specialize in revitalizing existing brands to make them relevant for modern audiences.',
  },
  {
    q: 'Can you help with naming my business?',
    a: 'Absolutely. We offer naming services that include linguistic checks and availability research.',
  },
];

const SPARKS = [
  { l:'12%', t:'18%', c:'#FF6B5B', sz:'3px', op:'0.65', sd:'2.1s', dl:'0s'   },
  { l:'28%', t:'72%', c:'#FFA94D', sz:'4px', op:'0.6',  sd:'3.0s', dl:'0.5s' },
  { l:'45%', t:'15%', c:'#FFD166', sz:'3px', op:'0.55', sd:'2.6s', dl:'1.1s' },
  { l:'60%', t:'80%', c:'#06D6A0', sz:'3px', op:'0.6',  sd:'2.8s', dl:'0.3s' },
  { l:'73%', t:'30%', c:'#4CC9F0', sz:'4px', op:'0.65', sd:'2.3s', dl:'0.8s' },
  { l:'85%', t:'65%', c:'#9B5DE5', sz:'3px', op:'0.55', sd:'3.2s', dl:'0.2s' },
  { l:'18%', t:'45%', c:'#FF6B5B', sz:'2px', op:'0.5',  sd:'2.5s', dl:'1.4s' },
  { l:'52%', t:'55%', c:'#FFA94D', sz:'2px', op:'0.5',  sd:'2.9s', dl:'0.7s' },
  { l:'78%', t:'12%', c:'#FFD166', sz:'2px', op:'0.5',  sd:'3.4s', dl:'0.4s' },
  { l:'90%', t:'42%', c:'#06D6A0', sz:'3px', op:'0.55', sd:'2.7s', dl:'1.2s' },
];

export async function generateMetadata(): Promise<Metadata> {
  return getPageMetadata('creative-branding');
}

export default function CreativeBrandingPage() {
  return (
    <div className="cb-brand-page">
      {/* ── HERO ── */}
      <section className="svc-hero">
        <div className="svc-hero-blob" aria-hidden="true" />
        <div className="svc-hero-sparks" aria-hidden="true">
          {SPARKS.map((s, i) => (
            <span key={i} className="svc-spark" style={{ left:s.l, top:s.t, '--sc':s.c, '--sz':s.sz, '--op':s.op, '--sd':s.sd, '--dl':s.dl } as React.CSSProperties} />
          ))}
        </div>
        <div className="svc-hero-inner">
          <nav className="svc-breadcrumb" aria-label="breadcrumb">
            <Link href="/">Home</Link>
            <span className="svc-bc-sep">/</span>
            <Link href="/digital-marketing-services/">Services</Link>
            <span className="svc-bc-sep">/</span>
            <span>Creative &amp; Branding</span>
          </nav>
          <p className="svc-hero-eyebrow">Visionary</p>
          <h1 className="svc-hero-h1">
            Build a brand people<br />don&apos;t scroll past
          </h1>
          <p className="svc-hero-sub">
            We create brands that look sharp, speak clearly, and actually perform, from strategy to design and content.
          </p>
          <div className="svc-hero-btns">
            <Link href="/contact" className="svc-btn-primary">
              Get a Proposal
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ── INTRO EDITORIAL ── */}
      <section className="cb-section cb-brand-intro-section">
        <div className="container">
          <div className="cb-brand-intro-editorial">
            <div className="cb-brand-intro-left">
              <h2 className="cb-brand-intro-title">Not every brand needs more noise.<span className="gradient-text"> Most need clarity.</span></h2>
              <div className="cb-brand-intro-bar" />
            </div>
            <div className="cb-brand-intro-right">
              <p>Design isn&apos;t decoration, it&apos;s communication: We deliver graphic design services in Dubai and all around the MENA region.</p>
              <p>Brand Strategy: we define how your brand thinks, speaks, and shows up. Positioning, tone of voice, messaging frameworks, built to last.</p>
              <p>Visual Identity &amp; Design: we create identities that are consistent, memorable, and flexible.</p>
              <p>Logo design services: brand guidelines, social media design system, packaging &amp; print assets, and graphic design services. Make the first thing your audience view stand out.</p>
              <p>Strategic Branding: every decision we make ties back to how your brand performs in the real world.</p>
              <p>Clarity and Impact: marketing creatives, campaign visuals, digital &amp; social assets, presentation design, brochure &amp; print design, and of course, graphic design services.</p>
            </div>
          </div>
        </div>
      </section>


      {/* ── EXPERTISE ── */}
      <section className="cb-section cb-section-alt">
        <div className="container">
          <span data-reveal className="section-label">Expertise &amp; Insights</span>
          <h2 data-reveal className="cb-section-h2">
            Soar your persona through <span className="gradient-text">branding</span>
          </h2>
          <div className="cb-expertise-grid">
            {EXPERTISE.map((e, i) => (
              <div key={i} data-reveal data-reveal-delay={`${i * 80}`} className="cb-expertise-card">
                <div className="cb-expertise-icon">{e.icon}</div>
                <h3 className="cb-expertise-title">{e.title}</h3>
                <p className="cb-expertise-desc">{e.desc}</p>
              </div>
            ))}
            {/* Colored CTA card */}
            <div data-reveal data-reveal-delay="400" className="cb-expertise-card cb-brand-cta-expertise-card">
              <p className="cb-brand-cta-expertise-text">Ready to build a brand that stands out?</p>
              <Link href="/contact" className="cb-brand-cta-expertise-btn">
                Start Your Brand Journey
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="cb-section">
        <div className="container cb-faq-wrap">
          <span data-reveal className="section-label">FAQ</span>
          <h2 data-reveal className="cb-section-h2">
            Frequently asked <span className="gradient-text">questions</span>
          </h2>
          <div className="cb-faq-list">
            {FAQS.map((f, i) => (
              <details key={i} data-reveal data-reveal-delay={`${i * 80}`} className="cb-faq-item">
                <summary className="cb-faq-q">{f.q}<span className="wad-faq-icon">+</span></summary>
                <p className="cb-faq-a">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROCESS ── */}
      <section className="cb-section cb-section-alt">
        <div className="container">
          <span data-reveal className="section-label">Our Process</span>
          <h2 data-reveal className="cb-section-h2">
            Wide Wings gives you <span className="gradient-text">wings!</span>
          </h2>
          <div className="cb-process-grid">
            {PROCESS.map((p, i) => (
              <div key={i} data-reveal data-reveal-delay={`${i * 100}`} className="cb-process-card cb-process-card--center">
                <div className="cb-process-icon-circle">{p.icon}</div>
                <h3 className="cb-process-title">{p.title}</h3>
                <p className="cb-process-desc">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY WIDE WINGS ── */}
      <section className="cb-section cb-section-dark cb-brand-why-section">
        <div className="container">
          <h2 data-reveal className="cb-section-h2">
            Why choose Wide Wings for <span className="gradient-text">branding?</span>
          </h2>
          <div className="cb-why-grid">
            {WHY_US.map((w, i) => (
              <div key={i} data-reveal data-reveal-delay={`${i * 80}`} className="cb-why-card">
                <div className="cb-why-icon">{w.icon}</div>
                <h3 className="cb-why-title">{w.title}</h3>
                <p className="cb-why-desc">{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="cb-cta cb-cta-light">
        <div className="cb-cta-deco" aria-hidden="true">
          <div className="cb-cta-deco-dots cb-cta-deco-dots--tl" />
          <div className="cb-cta-deco-dots cb-cta-deco-dots--br" />
          <div className="cb-cta-deco-dots cb-cta-deco-dots--tr" />
          <div className="cb-cta-deco-dots cb-cta-deco-dots--bl" />
          <div className="cb-brand-cta-circle cb-brand-cta-circle--1" />
          <div className="cb-brand-cta-circle cb-brand-cta-circle--2" />
        </div>
        <div className="container cb-cta-inner">
          <span data-reveal className="section-label">Let&apos;s Create</span>
          <h2 data-reveal className="cb-cta-h2">
            Build a brand that<br /><span className="gradient-text">actually works.</span>
          </h2>
          <p data-reveal className="cb-cta-body">
            Start your project with a leading branding agency in Dubai.
          </p>
          <div data-reveal className="cb-cta-btns">
            <Link href="/contact" className="svc-btn-primary">
              Request a Creative Quote
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
