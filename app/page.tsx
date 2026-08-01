'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ServiceFlipText from '@/components/ServiceFlipText';
import LogoWhite from '@/components/LogoWhite';
import SchemaScripts from '@/components/SchemaScripts';
import { getPageSchema } from '@/lib/schema';
import { CASE_STUDIES } from './case-studies/cases-data';
import CaseStoryCard from './case-studies/CaseStoryCard';
import './home.css';

const HOME_SCHEMA = getPageSchema('home');

export default function HomePage() {
  const casesTrackRef = useRef<HTMLDivElement>(null);

  const scrollCases = (dir: 1 | -1) => {
    const track = casesTrackRef.current;
    if (!track) return;
    const card = track.querySelector<HTMLElement>('.case-card');
    const step = card ? card.offsetWidth + 24 : track.clientWidth * 0.9;
    track.scrollBy({ left: dir * step, behavior: 'smooth' });
  };

  useEffect(() => {
    const heroWords = document.querySelectorAll<HTMLElement>('#hero-h1 .hw');
    heroWords.forEach((w, i) => { setTimeout(() => w.classList.add('visible'), 200 + i * 110); });

    const caseCards = document.querySelectorAll<HTMLElement>('.case-card');
    let ticking = false;

    function updateParallax() {
      const scrollY = window.scrollY;
      const glow1 = document.querySelector<HTMLElement>('.hero-glow-1');
      const glow2 = document.querySelector<HTMLElement>('.hero-glow-2');
      const line1 = document.querySelector<HTMLElement>('.hero-line-1');
      const line2 = document.querySelector<HTMLElement>('.hero-line-2');
      const logoD = document.querySelector<HTMLElement>('.hero-logo-display');
      const heroContent = document.querySelector<HTMLElement>('.hero-content');
      if (glow1) glow1.style.transform = `translateY(${scrollY * -0.18}px)`;
      if (glow2) glow2.style.transform = `translateY(${scrollY * -0.12}px)`;
      if (line1) line1.style.transform = `rotate(18deg) translateY(${scrollY * -0.22}px)`;
      if (line2) line2.style.transform = `rotate(-12deg) translateY(${scrollY * -0.14}px)`;
      if (logoD) logoD.style.transform = `translateY(${scrollY * -0.10}px)`;
      if (heroContent) heroContent.style.transform = `translateY(${scrollY * 0.06}px)`;
      const aboutCard = document.querySelector<HTMLElement>('.about-card-main');
      if (aboutCard) {
        const rect = aboutCard.getBoundingClientRect();
        const delta = (rect.top + rect.height / 2 - window.innerHeight / 2) * 0.06;
        aboutCard.style.transform = `translateY(${delta}px)`;
      }
      caseCards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const delta = (rect.top + rect.height / 2 - window.innerHeight / 2) * 0.08;
        const bg = card.querySelector<HTMLElement>('.case-card-bg');
        if (bg) bg.style.transform = `translateY(${delta}px) scale(1.12)`;
      });
      const wm = document.querySelector<HTMLElement>('#expertise .watermark');
      if (wm) {
        const section = wm.closest('section');
        if (section) { const delta = section.getBoundingClientRect().top * -0.04; wm.style.transform = `translate(-50%, calc(-50% + ${delta}px))`; }
      }
      ticking = false;
    }

    function onScroll() { if (!ticking) { requestAnimationFrame(updateParallax); ticking = true; } }
    window.addEventListener('scroll', onScroll, { passive: true });
    updateParallax();

    const svcGrid = document.querySelector('.services-grid');
    if (svcGrid) {
      const svcObs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll<HTMLElement>('.svc-card').forEach((card, i) => { setTimeout(() => card.classList.add('visible'), i * 120); });
            svcObs.unobserve(entry.target);
          }
        });
      }, { threshold: 0, rootMargin: '0px 0px -60px 0px' });
      svcObs.observe(svcGrid);
    }

    const blogThumbs = document.querySelectorAll<HTMLElement>('.blog-thumb');
    blogThumbs.forEach(thumb => {
      const img = thumb.querySelector<HTMLElement>('.blog-thumb-img');
      if (!img) return;
      thumb.addEventListener('mousemove', e => { const r = thumb.getBoundingClientRect(); img.style.transform = `translateY(${((e.clientY - r.top) / r.height - 0.5) * 20}px)`; });
      thumb.addEventListener('mouseleave', () => { img.style.transform = 'translateY(0)'; });
    });

    function blogScrollParallax() {
      blogThumbs.forEach(thumb => {
        const img = thumb.querySelector<HTMLElement>('.blog-thumb-img');
        if (!img) return;
        const r = thumb.getBoundingClientRect();
        img.style.transform = `translateY(${((r.top + r.height / 2 - window.innerHeight / 2) / window.innerHeight) * 25}px)`;
      });
    }
    window.addEventListener('scroll', blogScrollParallax, { passive: true });
    blogScrollParallax();

    document.querySelectorAll<HTMLElement>('.svc-card').forEach(card => {
      let t: ReturnType<typeof setTimeout>;
      card.addEventListener('mousemove', () => { card.classList.add('is-moving'); clearTimeout(t); t = setTimeout(() => card.classList.remove('is-moving'), 350); });
      card.addEventListener('mouseleave', () => { clearTimeout(t); card.classList.remove('is-moving'); });
    });

    const wrap = document.getElementById('flip-wrap');
    const track = document.getElementById('flip-track') as HTMLElement | null;
    let flipInterval: ReturnType<typeof setInterval>;
    if (wrap && track) {
      const items = track.querySelectorAll<HTMLElement>('.flip-item');
      const WORDS = items.length - 1;
      let idx = 0;
      const isMobile = () => window.innerWidth <= 768;
      if (isMobile()) items[0].classList.add('flip-active');
      flipInterval = setInterval(() => {
        if (isMobile()) return;
        idx++;
        let maxW = 0; items.forEach(el => { maxW = Math.max(maxW, el.scrollWidth); }); wrap.style.width = maxW + 'px';
        const itemH = wrap.offsetHeight || 40;
        track.style.transition = 'transform 0.52s cubic-bezier(0.4, 0, 0.2, 1)';
        track.style.transform = `translateY(-${idx * itemH}px)`;
        if (idx >= WORDS) { setTimeout(() => { track.style.transition = 'none'; track.style.transform = 'translateY(0)'; idx = 0; }, 560); }
      }, 2200);
    }

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('scroll', blogScrollParallax);
      if (flipInterval) clearInterval(flipInterval);
    };
  }, []);

  useEffect(() => {
    const SERVICES = [
      { text: 'Social Media Marketing', color: '#a73184' },
      { text: 'Performance Advertising', color: '#2e2e62' },
      { text: 'Brand Identity & Design', color: '#cfa821' },
      { text: 'SEO & Content Strategy', color: '#2e2e62' },
      { text: 'Video Production', color: '#c33b31' },
      { text: 'Web Development', color: '#2e2e62' },
    ];
    const typedEl = document.getElementById('about-bj-typed');
    const addrEl = document.getElementById('about-bj-addr');
    const s1 = document.getElementById('about-bj-s1');
    const s2 = document.getElementById('about-bj-s2');
    const s3 = document.getElementById('about-bj-s3');
    const logoEl = document.getElementById('about-bj-logo') as HTMLImageElement | null;
    const taglineEl = document.getElementById('about-bj-tagline');
    const svcTextEl = document.getElementById('about-bj-svc-text');
    const svcTwEl = document.getElementById('about-bj-tw') as HTMLElement | null;
    const counterEl = document.getElementById('about-bj-counter');
    const dots = document.querySelectorAll<HTMLElement>('#about-bj-dots .bj-sdot');
    if (!typedEl) return;
    let loopTimer: ReturnType<typeof setTimeout>;
    const showScene = (next: HTMLElement | null, prev: HTMLElement | null) => { if (prev) prev.classList.remove('active'); if (next) next.classList.add('active'); };
    const typeWord = (text: string, el: HTMLElement, speed: number, cb?: () => void) => { el.textContent = ''; let i = 0; const iv = setInterval(() => { el.textContent += text[i++]; if (i >= text.length) { clearInterval(iv); if (cb) setTimeout(cb, 700); } }, speed); };
    const eraseWord = (el: HTMLElement, speed: number, cb?: () => void) => { const iv = setInterval(() => { el.textContent = el.textContent!.slice(0, -1); if (!el.textContent!.length) { clearInterval(iv); if (cb) setTimeout(cb, 200); } }, speed); };
    const activateDot = (idx: number) => dots.forEach((d, i) => d.classList.toggle('active', i === idx));
    const runServiceAt = (idx: number, done?: () => void) => {
      const svc = SERVICES[idx];
      activateDot(idx);
      if (counterEl) counterEl.textContent = String(idx + 1).padStart(2, '0');
      if (svcTwEl) svcTwEl.style.color = svc.color;
      if (svcTextEl) typeWord(svc.text, svcTextEl, 55, () => eraseWord(svcTextEl!, 28, () => { if (idx + 1 < SERVICES.length) runServiceAt(idx + 1, done); else if (done) done(); }));
    };
    const runCycle = () => {
      clearTimeout(loopTimer);
      if (logoEl) logoEl.classList.remove('show');
      if (taglineEl) taglineEl.classList.remove('show');
      if (addrEl) addrEl.textContent = 'google.com';
      if (svcTextEl) svcTextEl.textContent = '';
      activateDot(0); showScene(s1, s3); showScene(s1, s2);
      setTimeout(() => {
        typeWord('www.wide-wings.ae', typedEl!, 80, () => {
          if (addrEl) addrEl.textContent = 'wide-wings.ae';
          showScene(s2, s1);
          setTimeout(() => { if (logoEl) logoEl.classList.add('show'); if (taglineEl) taglineEl.classList.add('show'); }, 200);
          setTimeout(() => { showScene(s3, s2); runServiceAt(0, () => { loopTimer = setTimeout(runCycle, 800); }); }, 2200);
        });
      }, 400);
    };
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
      const obs = new IntersectionObserver(entries => { if (entries[0].isIntersecting) { obs.disconnect(); runCycle(); } }, { threshold: 0.2 });
      obs.observe(aboutSection);
      return () => { obs.disconnect(); clearTimeout(loopTimer); };
    }
  }, []);

  return (
    <main>
      <SchemaScripts blocks={HOME_SCHEMA} />
      {/* HERO */}
      <section id="hero">
        <div className="hero-bg"></div>
        <div className="hero-line hero-line-1"></div>
        <div className="hero-line hero-line-2"></div>
        <div className="hero-glow hero-glow-1"></div>
        <div className="hero-glow hero-glow-2"></div>
        <div className="hero-inner">
          <div className="hero-content">
            <div className="hero-badge">
              <div className="hero-badge-dot"></div>
              <span>Dubai&apos;s Award-Winning Agency</span>
            </div>
            <h1 className="hero-h1" id="hero-h1">
              <span className="hw hw-block"><span className="hw-inner">Connect</span></span>
              <span className="hw hw-block hw-thin"><span className="hw-inner">Create</span></span>
              <span className="hw hw-block grad"><span className="hw-inner">Captivate</span></span>
            </h1>
            <p className="hero-sub">Unlock your brand&apos;s potential with our proven marketing expertise. From strategy to execution, we drive measurable growth.</p>
            <div className="hero-actions">
              <Link href="/contact" className="btn-primary">Free Consultation <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></Link>
              <Link href="/digital-marketing-services/" className="btn-outline" style={{borderColor:'rgba(255,255,255,.3)',color:'#fff'}}>Our Services</Link>
            </div>
            <div className="hero-stats">
              <div className="stat-item"><div className="stat-number">5+</div><div className="stat-label">Years Experience</div></div>
              <div className="stat-item"><div className="stat-number">62+</div><div className="stat-label">Clients Served</div></div>
              <div className="stat-item"><div className="stat-number">11+</div><div className="stat-label">Countries</div></div>
              <div className="stat-item"><div className="stat-number">50+</div><div className="stat-label">Brand Partners</div></div>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-logo-display">
              <div className="hero-orbit hero-orbit-1"><div className="orbit-dot od1"></div><div className="orbit-dot od2"></div><div className="orbit-dot od3"></div></div>
              <div className="hero-orbit hero-orbit-2"></div>
              <LogoWhite width={340} height={340} uid="hero" />
            </div>
          </div>
        </div>
        <div className="scroll-hint"><div className="scroll-line"></div><span>Scroll</span></div>
      </section>

      {/* CLIENT LOGOS */}
      <section id="clients">
        <p className="ticker-label">Trusted by brands across Dubai, GCC and beyond</p>
        <div style={{overflow:'hidden'}}>
          <div className="ticker-track">
            {['Zaina Cafe','Saudi German Hospital','Batterjee Properties','House of Santoba','Bex Beauty','SGH Group',
              'Zaina Cafe','Saudi German Hospital','Batterjee Properties','House of Santoba','Bex Beauty','SGH Group',
              'Zaina Cafe','Saudi German Hospital','Batterjee Properties','House of Santoba','Bex Beauty','SGH Group'].map((name, i) => (
              <span key={i} className="ticker-item">{name}</span>
            ))}
          </div>
        </div>
      </section>

      {/* EXPERTISE */}
      <section id="expertise">
        <div className="watermark">WIDE WINGS</div>
        <div className="container" style={{position:'relative',zIndex:1}}>
          <div className="expertise-grid">
            <div className="expertise-left">
              <span className="section-label">03 — Our Expertise</span>
              <h2 className="expertise-h2">Results-Driven<br/><span className="gradient-text">Digital Marketing</span><br/>Agency in Dubai</h2>
              <p className="expertise-body">We specialize in creating and executing result-driven digital marketing campaigns that go beyond basic social media management, SEO, and Google Ads. We transform how companies leverage digital opportunities and guide them toward increased brand awareness, lead generation, and revenue growth.</p>
              <Link href="/about-us/" className="btn-primary">Learn About Us</Link>
            </div>
            <div className="expertise-right">
              {[
                { id:'g1', icon:<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>, title:'Performance Marketing', desc:'Data-led campaigns built for measurable ROI and scalable growth across all digital channels.' },
                { id:'g2', icon:<><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></>, title:'Global Reach', desc:'Operating across 11+ countries with deep local market knowledge and a global perspective.' },
                { id:'g3', icon:<><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></>, title:'Full-Stack Services', desc:'Strategy, creative, media buying, SEO, and analytics — all in-house under one roof.' },
                { id:'g4', icon:<><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>, title:'50+ Expert Team', desc:'Specialists across every digital discipline, delivering campaigns that outperform expectations.' },
              ].map(card => (
                <div key={card.id} className="exp-card">
                  <div className="exp-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke={`url(#${card.id})`} strokeWidth="1.8">
                      <defs><linearGradient id={card.id} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#b62d83"/><stop offset="1" stopColor="#cfa821"/></linearGradient></defs>
                      {card.icon}
                    </svg>
                  </div>
                  <h3>{card.title}</h3>
                  <p>{card.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services">
        <div className="svc-orb svc-orb-1"></div><div className="svc-orb svc-orb-2"></div><div className="svc-orb svc-orb-3"></div>
        <div className="container" style={{position:'relative',zIndex:1}}>
          <div className="services-header">
            <span className="section-label">What We Do</span>
            <h2 className="services-h2">Full-Service <ServiceFlipText /> Agency</h2>
            <p className="services-sub">Every service we offer is designed to work together — so your brand grows with momentum, not just isolated wins.</p>
          </div>
          <div className="services-grid">
            {[
              { num:'01', title:'Web & App Development', desc:'High-performing websites and mobile applications — fast, secure, and user-first.', tags:['Web Dev','App Dev','UX Design','E-commerce'], back:'From custom websites to full mobile apps — built fast, built to convert.', href:'/web-design-company-dubai/' },
              { num:'02', title:'Creative & Branding', desc:'Brands that look sharp, speak clearly, and actually perform — from identity to execution.', tags:['Brand Identity','Positioning','Visual Design'], back:'We craft brand identities that command attention and build lasting recognition.', href:'/branding-agency-dubai/' },
              { num:'03', title:'Paid Advertising & Media', desc:'Campaigns planned, executed, and optimized to maximize reach, conversions, and ROI.', tags:['Google Ads','Media Buying','PPC'], back:'Every dirham spent is tracked, optimized, and pointed at results that matter.', href:'/ppc-advertising-company-dubai/' },
              { num:'04', title:'Social Media Management', desc:'Strategic content, consistent engagement, and platform-specific growth tactics.', tags:['Content','Engagement','Community'], back:'We grow your social presence with content that connects, engages, and converts.', href:'/social-media-marketing-agency-in-dubai/' },
              { num:'05', title:'SEO & Performance', desc:'Rank higher, attract quality traffic, and improve long-term digital performance.', tags:['SEO','Rankings','Traffic'], back:'Rank where it matters. We build sustainable search visibility that drives real traffic.', href:'/seo-services-dubai/' },
              { num:'06', title:'OOH & PR Management', desc:'Impactful out-of-home advertising and PR campaigns that amplify your brand.', tags:['Billboards','Media Relations','OOH'], back:'From Dubai billboards to regional PR — we put your brand in front of the right eyes.', href:'/digital-marketing-services/' },
            ].map(svc => (
              <Link key={svc.num} href={svc.href} className="svc-card">
                <div className="svc-card-inner">
                  <div className="svc-face svc-face-front">
                    <div className="svc-number">{svc.num}</div>
                    <div className="svc-title">{svc.title}</div>
                    <div className="svc-desc">{svc.desc}</div>
                    <div className="svc-tags">{svc.tags.map(t => <span key={t}>{t}</span>)}</div>
                  </div>
                  <div className="svc-face svc-face-back">
                    <div className="svc-back-top">
                      <div className="svc-back-num">{svc.num}</div>
                      <div className="svc-back-accent"></div>
                      <div className="svc-back-title">{svc.title}</div>
                      <div className="svc-back-desc">{svc.back}</div>
                    </div>
                    <div className="svc-back-bottom"><span className="svc-back-link">Find Out More →</span></div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="svc-more-wrap"><Link href="/digital-marketing-services/" className="btn-svc-more">View All Services <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></Link></div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about">
        <div className="container">
          <div className="about-grid">
            <div className="about-visual">
              <div className="bj-browser" id="about-bj-browser">
                <div className="bj-chrome">
                  <div style={{display:'flex',alignItems:'center',gap:'12px'}}>
                    <div className="bj-dots"><div className="bj-dot"></div><div className="bj-dot"></div><div className="bj-dot"></div></div>
                  </div>
                  <div className="bj-tabs"><div className="bj-tab"><div className="bj-tab-favicon"></div>wide-wings.ae</div></div>
                  <div className="bj-addressbar"><span>🔒</span><span className="bj-url-text" id="about-bj-addr">google.com</span></div>
                </div>
                <div className="bj-content">
                  <div className="bj-scene active" id="about-bj-s1">
                    <div className="bj-google-logo"><span className="gl-b">G</span><span className="gl-r">o</span><span className="gl-y">o</span><span className="gl-b">g</span><span className="gl-g">l</span><span className="gl-r">e</span></div>
                    <div className="bj-search-box"><span>🔍</span><span className="bj-typed-text" id="about-bj-typed"></span><span className="bj-cursor"></span></div>
                  </div>
                  <div className="bj-scene" id="about-bj-s2">
                    <div className="bj-logo-reveal">
                      <Image src="/Logoblack.webp" className="bj-logo-img" id="about-bj-logo" alt="Wide Wings" width={220} height={80} />
                      <div className="bj-tagline" id="about-bj-tagline">Media &amp; Advertisement · Dubai, UAE</div>
                    </div>
                  </div>
                  <div className="bj-scene bj-services-scene" id="about-bj-s3">
                    <div className="bj-bg-grid"></div>
                    <div className="bj-bg-orb bj-bg-orb-1"></div><div className="bj-bg-orb bj-bg-orb-2"></div><div className="bj-bg-orb bj-bg-orb-3"></div>
                    <div className="bj-bg-scan"></div>
                    <div className="bj-svc-counter" id="about-bj-counter">01</div>
                    <div className="bj-svc-typewriter" id="about-bj-tw"><span id="about-bj-svc-text"></span><span className="bj-svc-cursor">|</span></div>
                    <div className="bj-svc-dots" id="about-bj-dots">
                      <span className="bj-sdot active"></span><span className="bj-sdot"></span><span className="bj-sdot"></span>
                      <span className="bj-sdot"></span><span className="bj-sdot"></span><span className="bj-sdot"></span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="about-stats-row">
                <div className="about-stat"><div className="about-stat-num">5+</div><div className="about-stat-lbl">Years Active</div></div>
                <div className="about-stat"><div className="about-stat-num">62+</div><div className="about-stat-lbl">Clients Served</div></div>
                <div className="about-stat"><div className="about-stat-num">15+</div><div className="about-stat-lbl">Industries</div></div>
              </div>
            </div>
            <div className="about-right">
              <span className="section-label">About Wide Wings Media</span>
              <h2 className="about-h2">A UAE-Based Agency <span className="gradient-text">With Global Ambition</span></h2>
              <p className="about-body">Wide Wings Media &amp; Advertisement is a UAE-based marketing company offering digital marketing services to an ever-growing roster of clients and industries. We are fueled by the prospect of bringing creative ideas to life.</p>
              <p className="about-body">We love to create content and develop inventive, socially viral campaigns. We work with some of the best global digital advertising brands and hold verified partner status with Google and Meta.</p>
              <div className="about-badges">
                <span className="badge"><div className="badge-dot"></div>Google Verified Partner</span>
                <span className="badge"><div className="badge-dot"></div>Meta Verified Partner</span>
                <span className="badge"><div className="badge-dot"></div>4.9★ Client Rating</span>
                <span className="badge"><div className="badge-dot"></div>No Minimum Retainer</span>
              </div>
              <Link href="/about-us/" className="btn-primary">Learn More About Wide Wings</Link>
            </div>
          </div>
        </div>
      </section>

      {/* CASE STUDIES */}
      <section id="cases">
        <div className="container">
          <div className="cases-header">
            <div><span className="section-label">Success Stories</span><h2 className="cases-h2">Our Success <span className="gradient-text">Stories</span></h2></div>
            <div className="cases-header-actions">
              <div className="cases-nav">
                <button type="button" aria-label="Previous success stories" className="cases-arrow" onClick={() => scrollCases(-1)}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6" /></svg>
                </button>
                <button type="button" aria-label="Next success stories" className="cases-arrow" onClick={() => scrollCases(1)}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6" /></svg>
                </button>
              </div>
              <Link href="/case-studies" className="btn-outline">All Case Studies</Link>
            </div>
          </div>
          <div className="cases-grid" ref={casesTrackRef}>
            {CASE_STUDIES.map((c, i) => (
              <CaseStoryCard key={c.href} data={c} index={i} useHomeBg />
            ))}
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section id="why">
        <div className="container">
          <div className="why-inner">
            <div className="why-left">
              <span className="section-label">Why Work With Us</span>
              <h2 className="why-h2">
                One of the Top<br/>
                <span className="flip-word-wrap" id="flip-wrap">
                  <span className="flip-track" id="flip-track">
                    <span className="flip-item">Digital Marketing</span>
                    <span className="flip-item">Social Media</span>
                    <span className="flip-item">Performance Ads</span>
                    <span className="flip-item">SEO &amp; Content</span>
                    <span className="flip-item">Brand Strategy</span>
                    <span className="flip-item">Video Production</span>
                    <span className="flip-item">Digital Marketing</span>
                  </span>
                </span>
                Companies <span className="gradient-text"> in Dubai</span>
              </h2>
              <p className="why-body">We deliver strategic thinking, outstanding execution, and trackable results — which is why growing brands trust Wide Wings as their long-term marketing partner.</p>
              <div style={{display:'flex',gap:'14px',flexWrap:'wrap'}}>
                <Link href="/contact" className="btn-primary">Boost Your Marketing</Link>
                <Link href="/about-us/" className="btn-outline">Get The Full Story</Link>
              </div>
            </div>
            <div className="why-right">
              <ul className="why-list">
                {[
                  { svg:<polyline points="20 6 9 17 4 12"/>, title:"GCC's Best Digital Marketing Agency", desc:"Recognized across the region for performance-led work that actually moves the needle." },
                  { svg:<><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>, title:"Flexible — No Minimum Retainer", desc:"We adapt to your budget and goals. Start small, scale fast, no long-term lock-ins." },
                  { svg:<><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></>, title:"Google & Meta Verified Partners", desc:"Certified expertise ensuring compliant and performance-driven campaigns." },
                  { svg:<><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></>, title:"Real-Time Performance Dashboards", desc:"Full transparency on what's working — live visibility into your campaign metrics." },
                  { svg:<><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/></>, title:"Local Knowledge, Global Perspective", desc:"Deep UAE market expertise combined with scalable, international strategies." },
                ].map((item, i) => (
                  <li key={i} className="why-item">
                    <div className="why-icon"><svg viewBox="0 0 24 24" fill="none" stroke="#a73184" strokeWidth="2">{item.svg}</svg></div>
                    <div className="why-text"><h3>{item.title}</h3><p>{item.desc}</p></div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section id="reviews">
        <div className="container">
          <div className="reviews-header">
            <span className="section-label">Client Reviews</span>
            <h2 className="reviews-h2">What Our Clients <span className="gradient-text">Say</span></h2>
          </div>
          <div className="reviews-grid">
            {[
              { i:'H', text:'"When we partnered with Wide Wings Media, we expected solid results — they exceeded every benchmark we set and transformed how our audience perceives our brand."', name:'House of Santoba', co:'Retail & Lifestyle Brand' },
              { i:'S', text:'"Our primary goal was to attract leads across the MENA region. Wide Wings not only delivered leads — they delivered a 600% traffic increase and 5× ROAS."', name:'Srilesh N', co:'Head of Marketing, SGH Group' },
              { i:'B', text:'"Wide Wings Media transformed our online presence completely. Their strategic approach to social media and SEO has been a game changer for our brand."', name:'Bex Beauty', co:'Beauty & Wellness Brand' },
            ].map((r, i) => (
              <div key={i} className="review-card">
                <div className="review-stars">{[...Array(5)].map((_,j)=><div key={j} className="star"></div>)}</div>
                <p className="review-text">{r.text}</p>
                <div className="review-author">
                  <div className="review-avatar">{r.i}</div>
                  <div><div className="review-name">{r.name}</div><div className="review-company">{r.co}</div></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BAND */}
      <section id="cta-band">
        <div className="cta-lines"><div className="cta-hline"></div><div className="cta-hline"></div><div className="cta-hline"></div><div className="cta-hline"></div><div className="cta-vline"></div><div className="cta-vline"></div><div className="cta-vline"></div><div className="cta-vline"></div><div className="cta-vline"></div></div>
        <div className="cta-corner cta-corner-tl"></div><div className="cta-corner cta-corner-tr"></div><div className="cta-corner cta-corner-bl"></div><div className="cta-corner cta-corner-br"></div>
        <div className="container" style={{position:'relative',zIndex:1}}>
          <p className="cta-band-label">Start Your Journey</p>
          <h2 className="cta-band-h2">Ready to <em>Grow</em> Your Brand?</h2>
          <p className="cta-band-sub">Book a free strategy session with our team. No commitment — just clarity on what&apos;s possible for your brand.</p>
          <div className="cta-band-actions">
            <Link href="/contact" className="btn-white">Free Consultation <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></Link>
            <Link href="/digital-marketing-services/" className="btn-ghost">Explore Services</Link>
          </div>
        </div>
      </section>

      {/* BLOGS */}
      <section id="blogs">
        <div className="container">
          <div className="blogs-header">
            <div><span className="section-label">Insights</span><h2 className="blogs-h2">Recent <span className="gradient-text">Blogs</span></h2></div>
            <Link href="/insights/" className="btn-outline">All Articles</Link>
          </div>
          <div className="blogs-grid">
            {[
              { img:'blog-ecommerce.webp', tag:'E-Commerce', date:'January 15, 2026', title:'Ecommerce Website Development in Dubai for Scalable Growth', excerpt:'Get high-converting ecommerce website development in Dubai & UAE. Fast, secure, mobile-first online stores built for growth.', href:'/ecommerce-website-development-dubai/', cta:'See how to grow your brand' },
              { img:'blog-sem.webp', tag:'SEM', date:'January 13, 2026', title:'Search Engine Marketing Company in Dubai — SEM Services UAE', excerpt:'ROI-focused search engine marketing company in Dubai delivering high-intent PPC campaigns built for the UAE market.', href:'/search-engine-marketing-company-dubai/', cta:'Get the full story' },
              { img:'blog-ppc.webp', tag:'PPC', date:'January 8, 2026', title:'PPC for E-commerce Websites in Dubai: Where to Start', excerpt:"Smart PPC for e-commerce websites in Dubai that aligns with buyer intent — decision-led Google Ads strategies that convert.", href:'/ppc-for-ecommerce-dubai/', cta:'Explore more strategies' },
            ].map((blog, i) => (
              <Link key={i} href={blog.href} className="blog-card">
                <div className="blog-thumb">
                  <div className="blog-thumb-img" style={{backgroundImage:`url('/${blog.img}')`}}></div>
                  <div className="blog-thumb-tag">{blog.tag}</div>
                </div>
                <div className="blog-body">
                  <div className="blog-date">{blog.date}</div>
                  <div className="blog-title">{blog.title}</div>
                  <div className="blog-excerpt">{blog.excerpt}</div>
                  <span className="blog-link">{blog.cta} →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
