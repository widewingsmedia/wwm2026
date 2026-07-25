import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getPageMetadata } from '@/lib/seo';
import '../services.css';
import '../service-page.css';
import './pr-agency-dubai.css';

const EXPERTISE = [
  {
    title: 'Long-Term Presence',
    desc: 'We build long-term presence by connecting your brand to conversations that matter, turning visibility into trust, and trust into growth.',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="6,38 18,26 28,32 42,14"/>
        <polyline points="34,14 42,14 42,22"/>
      </svg>
    ),
  },
  {
    title: 'Earned Media',
    desc: 'Third-party validation builds trust faster than advertising. We get people talking about you.',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 36 L4 44 L20 38 L36 44 L44 36 L40 20 C38 10 30 6 24 6 C18 6 10 10 8 20 Z"/>
        <circle cx="24" cy="22" r="5"/>
      </svg>
    ),
  },
  {
    title: 'Crisis Preparedness',
    desc: 'Crisis preparedness is essential. We have protocols to handle sensitive situations swiftly and effectively.',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M24 4 L4 14 L4 26 C4 36 13 44 24 46 C35 44 44 36 44 26 L44 14 Z"/>
        <polyline points="16,24 22,30 34,18"/>
      </svg>
    ),
  },
  {
    title: 'Digital PR & SEO',
    desc: 'Our digital PR strategies not only build reputation but also improve SEO through high-quality backlinks.',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="20" cy="20" r="14"/>
        <line x1="30" y1="30" x2="44" y2="44"/>
      </svg>
    ),
  },
  {
    title: 'Meaningful Metrics',
    desc: 'We measure PR value through sentiment analysis, reach, and share of voice, not just vanity metrics.',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="4" width="40" height="40" rx="3"/>
        <rect x="10" y="20" width="8" height="18" rx="1"/>
        <rect x="22" y="12" width="8" height="26" rx="1"/>
        <rect x="34" y="16" width="8" height="22" rx="1"/>
      </svg>
    ),
  },
];

const PROCESS = [
  {
    desc: 'We create a targeted media list of journalists and outlets relevant to your industry.',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="24" cy="18" r="10"/>
        <path d="M8 42c0-8.8 7.2-16 16-16s16 7.2 16 16"/>
        <line x1="30" y1="14" x2="38" y2="10"/>
        <line x1="32" y1="20" x2="40" y2="20"/>
        <line x1="30" y1="26" x2="38" y2="30"/>
      </svg>
    ),
  },
  {
    desc: 'We pitch your story effectively, managing all media inquiries and interview requests.',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 36 L4 44 L20 38 L36 44 L44 36 L40 20 C38 10 30 6 24 6 C18 6 10 10 8 20 Z"/>
        <line x1="16" y1="22" x2="32" y2="22"/>
        <line x1="16" y1="29" x2="26" y2="29"/>
      </svg>
    ),
  },
  {
    desc: 'We monitor coverage and sentiment, providing detailed reports on the impact of your campaigns.',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="6,36 18,22 26,30 42,12"/>
        <polyline points="32,12 42,12 42,22"/>
        <line x1="6" y1="42" x2="42" y2="42"/>
        <line x1="6" y1="12" x2="6" y2="42"/>
      </svg>
    ),
  },
];

const WHY_US = [
  {
    icon: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="24" cy="16" r="10"/>
        <path d="M6 44c0-9.9 8.1-18 18-18s18 8.1 18 18"/>
        <line x1="34" y1="10" x2="42" y2="6"/>
        <line x1="36" y1="16" x2="44" y2="16"/>
        <line x1="34" y1="22" x2="42" y2="26"/>
      </svg>
    ),
    title: 'Media Network',
    desc: 'Access to established relationships with key media outlets in the GCC.',
  },
  {
    icon: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M24 4 L4 14 L4 26 C4 36 13 44 24 46 C35 44 44 36 44 26 L44 14 Z"/>
        <polyline points="16,24 22,30 34,18"/>
      </svg>
    ),
    title: 'Crisis Ready',
    desc: 'Confidence knowing you have a team ready to handle any PR emergency.',
  },
  {
    icon: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="24,4 30,18 44,18 33,28 37,42 24,34 11,42 15,28 4,18 18,18"/>
      </svg>
    ),
    title: 'Thought Leadership',
    desc: 'Position your CEO and experts as go-to voices in your industry.',
  },
  {
    icon: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="6" y="6" width="16" height="16" rx="2"/>
        <rect x="26" y="6" width="16" height="16" rx="2"/>
        <rect x="6" y="26" width="16" height="16" rx="2"/>
        <rect x="26" y="26" width="16" height="16" rx="2"/>
      </svg>
    ),
    title: 'Integrated Approach',
    desc: 'We align PR with your social and marketing strategies for a unified brand voice.',
  },
];

const FAQS = [
  { q: 'How is PR different from advertising?', a: 'Advertising is paid media (you buy space); PR is earned media (you earn coverage through merit/story).' },
  { q: 'Can you guarantee media coverage?', a: 'No ethical agency guarantees coverage, but our strong network maximizes your chances of placement.' },
  { q: 'Do you handle crisis communications?', a: 'Yes. We provide 24/7 support to manage and mitigate reputational risks during a crisis.' },
  { q: 'Is PR good for SEO?', a: 'Yes! Online press mentions often include backlinks from high-authority news sites, boosting your SEO.' },
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
  return getPageMetadata('pr-management');
}

export default function PrManagementPage() {
  return (
    <div className="cb-svc-page">
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
            <span>PR Management</span>
          </nav>
          <p className="svc-hero-eyebrow">Reputation</p>
          <h1 className="svc-hero-h1">PR That Builds Presence</h1>
          <p className="svc-hero-sub">We position your brand where it matters. Through the right narratives, the right platforms, and the right timing. Every move is intentional, built to strengthen credibility and visibility.</p>
          <div className="svc-hero-btns">
            <Link href="/contact" className="svc-btn-primary">
              Get a Proposal
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ── INTRO EDITORIAL ── */}
      <section className="cb-section prm-intro-section">
        <div className="container">
          <div className="prm-intro-editorial">
            <div className="prm-intro-left">
              <h2 className="prm-intro-title">Shaping Perceptions &amp; <span className="gradient-text">Building Trust</span></h2>
              <div className="prm-intro-bar" />
            </div>
            <div className="prm-intro-right">
              <p>Our PR management approach is rooted in consistency, control, and strategic visibility. We build and maintain strong relationships with key media outlets to secure meaningful coverage. Our PR agency services in Dubai and the UAE focus on targeted media relations and press outreach that position your brand where it matters most.</p>
              <p>Your story deserves more than just exposure, it needs direction. We craft compelling press releases and brand narratives that align with your identity and business goals. Through our press release and brand storytelling services in the MENA region, we ensure your message is clear, credible, and impactful across all channels.</p>
              <p>Influence today is built on alignment, not reach alone. We connect your brand with the right influencers and partners to create authentic, high-value collaborations. Our influencer marketing and partnership strategies in the UAE are designed to expand your reach while maintaining brand integrity and audience trust.</p>
              <p>Reputation is your most valuable asset, and it needs constant protection. We monitor brand perception, manage public sentiment, and respond proactively to potential risks. With our reputation management services in Dubai, you stay in control of your narrative while building long-term credibility in the MENA market.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── EXPERTISE ── */}
      <section className="cb-section cb-section-alt">
        <div className="container">
          <span data-reveal className="section-label">Expertise &amp; Insights</span>
          <h2 data-reveal className="cb-section-h2">We build bridges between <span className="gradient-text">communities.</span></h2>
          <div className="cb-expertise-grid">
            {EXPERTISE.map((e, i) => (
              <div key={i} data-reveal data-reveal-delay={`${i * 80}`} className="cb-expertise-card">
                <div className="cb-expertise-icon">{e.icon}</div>
                <h3 className="cb-expertise-title">{e.title}</h3>
                <p className="cb-expertise-desc">{e.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="cb-section">
        <div className="container cb-faq-wrap">
          <span data-reveal className="section-label">FAQ</span>
          <h2 data-reveal className="cb-section-h2">Frequently asked <span className="gradient-text">questions</span></h2>
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
      <section className="cb-section cb-section-alt prm-process-section">
        <div className="container">
          <div className="prm-process-split">
            <div className="prm-process-left">
              <h2 data-reveal className="prm-process-title">Position your brand where <span className="gradient-text">it actually matters</span></h2>
              <p data-reveal className="prm-process-sub">We define your core narrative and identify the most compelling angles for your story.</p>
              <Link href="/contact" className="svc-btn-primary prm-process-btn">
                Get a Proposal
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </Link>
            </div>
            <div className="prm-process-right">
              {PROCESS.map((p, i) => (
                <div key={i} data-reveal data-reveal-delay={`${i * 100}`} className="prm-process-card">
                  <div className="prm-process-icon">{p.icon}</div>
                  <p className="prm-process-card-text">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── PROTECT & GROW ── */}
      <section className="cb-section cb-section-dark">
        <div className="container">
          <h2 data-reveal className="cb-section-h2 prm-deliver-title">Protect and Grow Your <span className="gradient-text">Reputation</span></h2>
          <div className="prm-deliver-grid">
            {WHY_US.map((s, i) => (
              <div key={i} data-reveal data-reveal-delay={`${i * 80}`} className="cb-svc-card prm-deliver-card">
                <div className="prm-deliver-icon">{s.icon}</div>
                <h3 className="cb-svc-title">{s.title}</h3>
                <p className="cb-svc-desc">{s.desc}</p>
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
          <div className="cb-cta-watermark-text">WIDE WINGS</div>
        </div>
        <div className="container cb-cta-inner">
          <span data-reveal className="section-label">Be Heard</span>
          <h2 data-reveal className="cb-cta-h2">Tell Your Story<br /><span className="gradient-text">to the World</span></h2>
          <p data-reveal className="cb-cta-body">Build a reputation that opens doors. Let&apos;s craft a PR strategy that elevates your brand.</p>
          <div data-reveal className="cb-cta-btns">
            <Link href="/contact" className="svc-btn-primary">
              Consult with a PR Expert
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
