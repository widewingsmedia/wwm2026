import React from 'react';
import Link from 'next/link';
import '../services/services.css';
import CtaCanvas from '../services/CtaCanvas';
import ServiceShowcase from '../services/ServiceShowcase';
import SchemaScripts from '@/components/SchemaScripts';
import { getPageSchema } from '@/lib/schema';

const PAGE_SCHEMA = getPageSchema('digital-marketing-services');

const SERVICES = [
  {
    num: '01',
    title: 'Web & App Development',
    slug: '/web-design-company-dubai',
    desc: 'From sleek websites to powerful mobile applications, we build digital products that perform — fast, secure, and built to scale with your business.',
  },
  {
    num: '02',
    title: 'Creative & Branding',
    slug: '/branding-agency-dubai',
    desc: 'We craft identities that resonate. From logo design to full brand systems, we ensure your brand speaks clearly across every touchpoint.',
  },
  {
    num: '03',
    title: 'Paid Advertising & Media Buying',
    slug: '/ppc-advertising-company-dubai',
    desc: 'Hyper-targeted campaigns across Google, Meta, TikTok, and beyond. We maximise your ROI with data-driven ad strategies designed to convert.',
  },
  {
    num: '04',
    title: 'Social Media Management',
    slug: '/social-media-marketing-agency-in-dubai',
    desc: 'We manage your social presence end-to-end — content calendars, community management, and growth strategies that build loyal audiences.',
  },
  {
    num: '05',
    title: 'Content Creation & Graphic Design',
    slug: '/content-creation-graphic-design',
    desc: 'Compelling visuals, videos, and copy that stop the scroll. Our creative team produces content that drives engagement and reflects your brand perfectly.',
  },
  {
    num: '06',
    title: 'Email, SMS & CRM Marketing',
    slug: '/email-marketing-dubai',
    desc: 'Keep your audience engaged and your pipeline full. We design and automate email and SMS campaigns that nurture leads into loyal customers.',
  },
  {
    num: '07',
    title: 'SEO & Performance Management',
    slug: '/seo-services-dubai',
    desc: 'Rank higher, get found faster. Our SEO strategies are built on keyword intelligence, technical audits, and content that earns authority.',
  },
  {
    num: '08',
    title: 'OOH Advertising',
    slug: '/outdoor-advertising-dubai',
    desc: 'Billboards, unipoles, bridge banners, and digital screens across the UAE. We plan and execute out-of-home campaigns that make your brand impossible to ignore.',
  },
  {
    num: '09',
    title: 'Analytics & Performance Marketing',
    slug: '/analytics-performance-marketing',
    desc: 'Data is your competitive edge. We track, measure, and optimise every campaign to turn intent into measurable, real-world growth.',
  },
  {
    num: '10',
    title: 'PR Management',
    slug: '/pr-agency-dubai',
    desc: 'From press releases to crisis communications, we protect and elevate your reputation through strategic media relations and influencer outreach.',
  },
];

const VALUE_PROPS = [
  {
    title: 'Keywords Optimised for Conversion',
    body: 'Get in front of high-intent customers with hyper-targeted campaigns and display ads designed to drive action at every stage of the funnel.',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="24" cy="24" r="20"/>
        <circle cx="24" cy="24" r="12"/>
        <circle cx="24" cy="24" r="4" fill="currentColor" stroke="none"/>
        <line x1="24" y1="4" x2="24" y2="10"/>
        <line x1="24" y1="38" x2="24" y2="44"/>
        <line x1="4" y1="24" x2="10" y2="24"/>
        <line x1="38" y1="24" x2="44" y2="24"/>
      </svg>
    ),
  },
  {
    title: 'Top of Mind, Bottom of Funnel',
    body: 'We capture top-funnel traffic and transform it into bottom-funnel conversions through rapid experimentation and proven frameworks.',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 10h32l-12 16v10l-8-4V26L8 10z"/>
        <line x1="6" y1="10" x2="42" y2="10"/>
      </svg>
    ),
  },
  {
    title: 'Turn Intent into Measurable Growth',
    body: 'By unlocking high-quality consumer intent, we fuel rapid and measurable growth through quality leads and performance-first strategies.',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="6,36 18,22 26,30 42,12"/>
        <polyline points="32,12 42,12 42,22"/>
        <line x1="6" y1="42" x2="42" y2="42"/>
        <line x1="6" y1="12" x2="6" y2="42"/>
      </svg>
    ),
  },
  {
    title: 'Proven Revenue Growth',
    body: 'Our team of growth experts measure and maximise search intent and keyword potential at every stage of the funnel — delivering results you can see.',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M24 4l4.5 9 10 1.5-7.25 7 1.75 10L24 26.5 15 31.5l1.75-10L9.5 14.5l10-1.5z"/>
        <line x1="24" y1="34" x2="24" y2="44"/>
        <line x1="16" y1="44" x2="32" y2="44"/>
      </svg>
    ),
  },
];

export default function DigitalMarketingServicesPage() {
  return (
    <>
      <SchemaScripts blocks={PAGE_SCHEMA} />
      {/* ── HERO ── */}
      <section className="svc-hero">
        <div className="svc-hero-blob" aria-hidden="true" />
        <div className="svc-hero-sparks" aria-hidden="true">
          <span className="svc-spark" style={{left:'12%',top:'18%','--sc':'#FF6B5B','--sz':'3px','--op':'0.65','--sd':'2.1s','--dl':'0s'} as React.CSSProperties} />
          <span className="svc-spark" style={{left:'28%',top:'72%','--sc':'#FFA94D','--sz':'4px','--op':'0.6','--sd':'3.0s','--dl':'0.5s'} as React.CSSProperties} />
          <span className="svc-spark" style={{left:'45%',top:'15%','--sc':'#FFD166','--sz':'3px','--op':'0.55','--sd':'2.6s','--dl':'1.1s'} as React.CSSProperties} />
          <span className="svc-spark" style={{left:'60%',top:'80%','--sc':'#06D6A0','--sz':'3px','--op':'0.6','--sd':'2.8s','--dl':'0.3s'} as React.CSSProperties} />
          <span className="svc-spark" style={{left:'73%',top:'30%','--sc':'#4CC9F0','--sz':'4px','--op':'0.65','--sd':'2.3s','--dl':'0.8s'} as React.CSSProperties} />
          <span className="svc-spark" style={{left:'85%',top:'65%','--sc':'#9B5DE5','--sz':'3px','--op':'0.55','--sd':'3.2s','--dl':'0.2s'} as React.CSSProperties} />
          <span className="svc-spark" style={{left:'18%',top:'45%','--sc':'#FF6B5B','--sz':'2px','--op':'0.5','--sd':'2.5s','--dl':'1.4s'} as React.CSSProperties} />
          <span className="svc-spark" style={{left:'52%',top:'55%','--sc':'#FFA94D','--sz':'2px','--op':'0.5','--sd':'2.9s','--dl':'0.7s'} as React.CSSProperties} />
          <span className="svc-spark" style={{left:'78%',top:'12%','--sc':'#FFD166','--sz':'2px','--op':'0.5','--sd':'3.4s','--dl':'0.4s'} as React.CSSProperties} />
          <span className="svc-spark" style={{left:'90%',top:'42%','--sc':'#06D6A0','--sz':'3px','--op':'0.55','--sd':'2.7s','--dl':'1.2s'} as React.CSSProperties} />
        </div>

        <div className="svc-hero-inner">
          <nav className="svc-breadcrumb" aria-label="breadcrumb">
            <Link href="/">Home</Link>
            <span className="svc-bc-sep">/</span>
            <span>Services</span>
          </nav>

          <h1 className="svc-hero-h1">
            <em>Digital Marketing</em><br />Services
          </h1>

          <p className="svc-hero-sub">
            Use digital marketing services based on data to make your brand stronger.
            Get a high return on investment and more conversions with Wide Wings Media.
          </p>

          <div className="svc-hero-btns">
            <Link href="/contact" className="svc-btn-primary">
              Free Consultation
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ── PARTNER BAND ── */}
      <div data-reveal className="svc-band">
        <span className="svc-band-tag">TOP RANKED</span>
        <p className="svc-band-text">
          <strong>Your Partner for Premier Digital Marketing Services</strong> — A trusted partner for startups, scaleups, and established enterprises.
        </p>
        <Link href="/contact" className="svc-band-cta">
          Take the Leap
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
          </svg>
        </Link>
      </div>

      {/* ── SERVICE LIST ── */}
      <section id="svc-list" className="svc-list-section">
        <div className="svc-list-inner">

          {/* LEFT COLUMN */}
          <div className="svc-list-left">
            <div data-reveal className="svc-list-heading">
              <strong className="svc-lh-main">Digital Marketing Services</strong>
            </div>
            {/* Animated service showcase */}
            <div data-reveal data-reveal-delay="100">
              <ServiceShowcase />
            </div>
            <p data-reveal data-reveal-delay="200" className="svc-list-desc">
              Use digital marketing services that are based on data to make your brand stronger.
              Get a high return on investment (ROI) and more conversions with Wide Wings Media&apos;s
              digital marketing services, which are data-based. Request a quote now.
            </p>
            <p data-reveal data-reveal-delay="280" className="svc-list-desc">
              Work with a digital marketing services agency in Dubai that has won awards and is
              designed to help businesses thrive by making meaningful connections.
            </p>
          </div>

          {/* RIGHT COLUMN — lined list */}
          <div className="svc-list-right">
            {SERVICES.map((s, i) => (
              <Link key={s.slug} href={s.slug} className="svc-row" data-reveal data-reveal-delay={String(i * 60)}>
                <span className="svc-row-title">{s.title}</span>
                <svg className="svc-row-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M7 17L17 7M9 7h8v8"/>
                </svg>
              </Link>
            ))}
          </div>

        </div>
      </section>

      {/* ── VALUE PROPS ── */}
      <section className="svc-values">
        <span className="svc-values-watermark" aria-hidden="true">WIDE WINGS</span>
        <div className="svc-values-inner">
          <div data-reveal className="svc-values-head">
            <div className="svc-eyebrow"><span className="svc-dot" />Why Choose Us</div>
            <h2 className="svc-values-h2">Take the Leap from<br /><em>Experiments to Conversions</em></h2>
          </div>
          <div className="svc-values-grid">
            {VALUE_PROPS.map((v, i) => (
              <div key={i} className="svc-value-card" data-reveal data-reveal-delay={String(i * 100)}>
                <div className="svc-value-icon">{v.icon}</div>
                <h3 className="svc-value-title">{v.title}</h3>
                <p className="svc-value-body">{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="svc-cta">
        <CtaCanvas />
        <div data-reveal className="svc-cta-inner">
          <h2 className="svc-cta-h2">Have Any Project in Mind?</h2>
          <p className="svc-cta-sub">
            Let&apos;s discuss how we can drive measurable growth for your business.
          </p>
          <Link href="/contact" className="svc-btn-primary">
            Free Consultation
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
            </svg>
          </Link>
        </div>
      </section>
    </>
  );
}
