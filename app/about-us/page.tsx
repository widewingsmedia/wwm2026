'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRef, useEffect } from 'react';
import './about-us.css';
import CtaCanvas from '../services/CtaCanvas';
import SchemaScripts from '@/components/SchemaScripts';
import { getPageSchema } from '@/lib/schema';

const PAGE_SCHEMA = getPageSchema('about-us');

const team = [
  { name: 'Alaa Mokhless Ali',        title: 'Account Manager',          img: '/Alaa.webp' },
  { name: 'Nouran Mamdouh',           title: 'Account Manager',          img: '/nowran.webp' },
  { name: 'Ebtehal Elnoras',          title: 'Account Manager',          img: '/Ebtehal.webp' },
  { name: 'Rawan Akram',              title: 'Account Manager',          img: '/RawanAkram.webp' },
  { name: 'Mohamed Shaarawi',         title: 'Full-Stack Web Developer', img: '/Shaarawi.webp' },
  { name: 'Lawrence Peter Watyabuko', title: 'SEO Specialist',           img: '/Lawrence.webp' },
  { name: 'Mohamed Ibrahim Juba',     title: 'Graphic Designer',         img: '/MohamedIbrahimJuba.webp' },
  { name: 'Mahmoud Ismail',           title: 'Graphic Designer',         img: '/MahmoudIsmail.webp' },
  { name: 'Prasanna Veeramani',       title: 'Graphic Designer',         img: '/Prasanna.webp' },
  { name: 'Nesma Ibrahim',            title: 'Graphic Designer',         img: '/Nesma.webp' },
  { name: 'Asmaa Mostafa',            title: 'Content Creator',          img: '/Asmaa.webp' },
  { name: 'Doha Ghareeb',             title: 'Content Creator',          img: '/Doha.webp' },
  { name: 'Eslam Deif',               title: 'Media Buyer',              img: '/Eslam.webp' },
  { name: 'Kareem Ayman Abdu',        title: 'Media Buyer',              img: '/Kareemayman.webp' },
  { name: 'Rana Amir Irshad',         title: 'Cash Flow In-charge',      img: '/Amir.webp' },
];

function HeroParallaxButtons() {
  useEffect(() => {
    const section = document.getElementById('au-hero-orig');
    if (!section) return;
    const btns = section.querySelectorAll<HTMLElement>('.au-hbtn');
    const onMove = (e: MouseEvent) => {
      const r = section.getBoundingClientRect();
      const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
      const dx = (e.clientX - cx) / r.width;
      const dy = (e.clientY - cy) / r.height;
      btns.forEach((btn, i) => {
        const depth = i === 0 ? 14 : 9;
        btn.style.setProperty('--px', `${dx * depth}px`);
        btn.style.setProperty('--py', `${dy * depth}px`);
      });
    };
    const onLeave = () => btns.forEach(b => { b.style.setProperty('--px','0px'); b.style.setProperty('--py','0px'); });
    section.addEventListener('mousemove', onMove);
    section.addEventListener('mouseleave', onLeave);
    return () => { section.removeEventListener('mousemove', onMove); section.removeEventListener('mouseleave', onLeave); };
  }, []);
  return null;
}

function HeroStars() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    let raf = 0;
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    type Particle = { x: number; y: number; r: number; speed: number; angle: number; opacity: number; pulse: number; color: string };
    const COLS = ['#FF6B5B','#FFA94D','#FFD166','#c084fc','#67e8f9','#fff'];
    const particles: Particle[] = Array.from({ length: 60 }, () => ({
      x: 0.5 + Math.random() * 0.5,   // right half
      y: Math.random(),
      r: 1 + Math.random() * 2.5,
      speed: 0.00015 + Math.random() * 0.0003,
      angle: Math.random() * Math.PI * 2,
      opacity: 0.3 + Math.random() * 0.6,
      pulse: Math.random() * Math.PI * 2,
      color: COLS[Math.floor(Math.random() * COLS.length)],
    }));

    // orbiting rings
    type Ring = { cx: number; cy: number; rx: number; ry: number; speed: number; phase: number; color: string };
    const rings: Ring[] = [
      { cx: 0.78, cy: 0.35, rx: 0.12, ry: 0.07, speed: 0.004, phase: 0,        color: 'rgba(255,107,91,0.18)' },
      { cx: 0.88, cy: 0.65, rx: 0.08, ry: 0.12, speed: -0.003, phase: Math.PI, color: 'rgba(255,209,102,0.14)' },
      { cx: 0.65, cy: 0.7,  rx: 0.06, ry: 0.05, speed: 0.005, phase: 1,        color: 'rgba(192,132,252,0.15)' },
    ];

    let t = 0;
    const draw = () => {
      const { width: W, height: H } = canvas;
      ctx.clearRect(0, 0, W, H);
      t += 1;

      // orbiting ellipses
      rings.forEach(ring => {
        const cx = ring.cx * W, cy = ring.cy * H;
        const rx = ring.rx * W, ry = ring.ry * H;
        ctx.beginPath();
        ctx.ellipse(cx, cy, rx, ry, ring.phase + t * ring.speed, 0, Math.PI * 2);
        ctx.strokeStyle = ring.color;
        ctx.lineWidth = 1;
        ctx.stroke();

        // dot on the ring
        const dotAngle = ring.phase + t * ring.speed;
        const dx = cx + rx * Math.cos(dotAngle);
        const dy = cy + ry * Math.sin(dotAngle);
        ctx.beginPath();
        ctx.arc(dx, dy, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = ring.color.replace('0.1', '0.9').replace('0.18','0.9').replace('0.14','0.9').replace('0.15','0.9');
        ctx.fill();
      });

      // floating stars
      particles.forEach(p => {
        p.angle += p.speed;
        const px = (p.x + Math.sin(p.angle * 1.3) * 0.05) * W;
        const py = (p.y + Math.cos(p.angle) * 0.04) * H;
        const alpha = p.opacity * (0.6 + 0.4 * Math.sin(t * 0.03 + p.pulse));
        ctx.beginPath();
        ctx.arc(px, py, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = alpha;
        ctx.fill();
      });
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, []);
  return <canvas ref={canvasRef} className="au-hero-stars" />;
}

const COLORS = ['#FF6B5B','#FFA94D','#FFD166','#06D6A0','#4CC9F0','#9B5DE5'];

function CtaSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: -999, y: -999 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const GAP = 60;
    let raf = 0;

    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const onMove = (e: MouseEvent | TouchEvent) => {
      const r = canvas.getBoundingClientRect();
      const src = 'touches' in e ? e.touches[0] : e;
      mouse.current = { x: src.clientX - r.left, y: src.clientY - r.top };
    };
    const section = canvas.parentElement!;
    section.addEventListener('mousemove', onMove);
    section.addEventListener('touchmove', onMove as any);
    section.addEventListener('mouseleave', () => { mouse.current = { x: -999, y: -999 }; });

    const draw = () => {
      const { width: W, height: H } = canvas;
      ctx.clearRect(0, 0, W, H);
      const { x: mx, y: my } = mouse.current;
      const RADIUS = 180;

      // vertical lines
      for (let x = GAP; x < W; x += GAP) {
        const dist = Math.abs(x - mx);
        if (dist < RADIUS) {
          const t = 1 - dist / RADIUS;
          const ci = Math.floor((x / GAP) % COLORS.length);
          ctx.strokeStyle = COLORS[ci];
          ctx.globalAlpha = t * 0.85;
          ctx.lineWidth = 1;
        } else {
          ctx.strokeStyle = '#ccc';
          ctx.globalAlpha = 0.35;
          ctx.lineWidth = 1;
        }
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
      }

      // horizontal lines
      for (let y = GAP; y < H; y += GAP) {
        const dist = Math.abs(y - my);
        if (dist < RADIUS) {
          const t = 1 - dist / RADIUS;
          const ci = Math.floor((y / GAP) % COLORS.length);
          ctx.strokeStyle = COLORS[ci];
          ctx.globalAlpha = t * 0.85;
          ctx.lineWidth = 1;
        } else {
          ctx.strokeStyle = '#ccc';
          ctx.globalAlpha = 0.35;
          ctx.lineWidth = 1;
        }
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
      }

      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      section.removeEventListener('mousemove', onMove);
    };
  }, []);

  return (
    <section id="au-cta" className="au-cta-light">
      <CtaCanvas />
      <div className="au-cta-content" style={{ position: 'relative', zIndex: 1 }}>
        <h2 data-reveal className="au-cta-h2 au-cta-h2-dark">Ready to write the next scene for your brand?</h2>
        <Link data-reveal data-reveal-delay="120" href="/contact" className="au-ticket">Free Consultation &nbsp;→</Link>
      </div>
    </section>
  );
}

export default function AboutUsPage() {
  return (
    <div id="au-page">
      <SchemaScripts blocks={PAGE_SCHEMA} />

      {/* ── HERO ── */}
      <section id="au-hero-orig">
        <div className="au-hero-blob" aria-hidden="true" />
        <HeroParallaxButtons />
        {/* multicolor blinking dots */}
        <div className="au-hero-sparks" aria-hidden="true">
          {[
            { l:'12%', t:'18%', c:'#FF6B5B', sz:'3px', op:0.65, sd:'2.1s', dl:'0s'   },
            { l:'28%', t:'72%', c:'#FFA94D', sz:'4px', op:0.6,  sd:'3.0s', dl:'0.5s' },
            { l:'45%', t:'15%', c:'#FFD166', sz:'3px', op:0.55, sd:'2.6s', dl:'1.1s' },
            { l:'60%', t:'80%', c:'#06D6A0', sz:'3px', op:0.6,  sd:'2.8s', dl:'0.3s' },
            { l:'73%', t:'30%', c:'#4CC9F0', sz:'4px', op:0.65, sd:'2.3s', dl:'0.8s' },
            { l:'85%', t:'65%', c:'#9B5DE5', sz:'3px', op:0.55, sd:'3.2s', dl:'0.2s' },
            { l:'18%', t:'45%', c:'#FF6B5B', sz:'2px', op:0.5,  sd:'2.5s', dl:'1.4s' },
            { l:'52%', t:'55%', c:'#FFA94D', sz:'2px', op:0.5,  sd:'2.9s', dl:'0.7s' },
            { l:'38%', t:'88%', c:'#4CC9F0', sz:'3px', op:0.6,  sd:'2.2s', dl:'1.8s' },
            { l:'78%', t:'12%', c:'#FFD166', sz:'2px', op:0.5,  sd:'3.4s', dl:'0.4s' },
            { l:'90%', t:'42%', c:'#06D6A0', sz:'3px', op:0.55, sd:'2.7s', dl:'1.2s' },
            { l:'6%',  t:'60%', c:'#9B5DE5', sz:'2px', op:0.5,  sd:'2.4s', dl:'0.9s' },
          ].map((s, i) => (
            <div key={i} className="au-spark" style={{ left:s.l, top:s.t, '--sc':s.c, '--sz':s.sz, '--op':s.op, '--sd':s.sd, '--dl':s.dl } as React.CSSProperties} />
          ))}
        </div>

        <div className="au-hero-left">
          <nav className="au-breadcrumb" aria-label="breadcrumb">
            <Link href="/">Home</Link>
            <span className="au-bc-sep">/</span>
            <span>About Us</span>
          </nav>

          <h1 className="au-hero-h1-orig au-hero-glow-text">
            A Digital Marketing Partner<br />
            <em>You Can Trust</em>
          </h1>

          <p className="au-hero-sub-orig">
            Empowering brands to break boundaries and soar beyond expectations.
          </p>

          <div className="au-hero-btns">
            <Link href="/contact" className="au-hbtn au-hbtn-primary">
              Free Consultation
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </Link>
            <Link href="#au-team" className="au-hbtn au-hbtn-outline">
              Team Members
            </Link>
          </div>
        </div>
      </section>

      <hr className="au-divider" />

      {/* ── MISSION ── */}
      <section id="au-mission">
        <div className="au-mission-bg" />
        <div className="au-mission-inner">
          <div className="au-mission-left">
            <div data-reveal className="au-eyebrow"><span className="dot" />OUR MISSION</div>
            <h2 data-reveal data-reveal-delay="80" className="au-mission-h2">We believe in<br /><em>limitless potential.</em></h2>
            <p data-reveal data-reveal-delay="160" className="au-mission-intro">
              At Wide Wings Media, our mission is to help brands break free from boundaries
              and explore new horizons. With proper research, tailored plans and creative
              solutions, we empower businesses to spread their wings and soar beyond expectations.
            </p>
          </div>
          <div className="au-mission-right">
            {[
              {
                n: '01',
                text: 'Our approach is rooted in data-driven insights, enabling us to make informed decisions that maximize return on investment (ROI) for our clients.',
              },
              {
                n: '02',
                text: 'We understand that every business is unique, which is why we offer tailor-made digital marketing strategies to meet the specific needs and goals of each client.',
              },
              {
                n: '03',
                text: 'We build lasting partnerships by combining strategic thinking with creative execution — turning ambitious visions into measurable, real-world results.',
              },
            ].map(({ n, text }, i) => (
              <div key={n} className="au-mission-point" data-reveal data-reveal-delay={String(i * 100)}>
                <span className="au-mission-num">{n}</span>
                <p>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOUNDERS ── */}
      <section id="au-founders">
        <div className="au-founders-inner">

          {/* Reem — photo left, content right */}
          <div data-reveal className="au-founder-card">
            <div className="au-fc-photo">
              <Image src="/Reem.jpg" alt="Reem Osman" fill sizes="50vw" priority />
            </div>
            <div className="au-fc-panel">
              <div className="au-fc-watermark">WIDE WINGS</div>
              <div className="au-fs-name">Reem Osman</div>
              <div className="au-fs-role">CEO &amp; FOUNDER</div>
              <div className="au-fs-middle">
                <div className="au-fs-quote">
                  <blockquote>&ldquo;As the CEO of Wide Wings Media, I carry the responsibility of every brand that puts its trust in us.&rdquo;</blockquote>
                </div>
                <p className="au-fs-bio">Our team&apos;s expertise and dedication are what let me make that promise with confidence. Together, we turn ambitious ideas into results our clients can measure.</p>
              </div>
              <div className="au-fs-brand-graphic" aria-hidden="true">
                <img src="/brand-wings.svg" alt="" className="au-brand-wings" />
              </div>
            </div>
          </div>

          {/* Seham — content left, photo right */}
          <div data-reveal data-reveal-delay="100" className="au-founder-card is-reversed">
            <div className="au-fc-photo">
              <Image src="/SehamTeam.webp" alt="Seham Batterjee" fill sizes="50vw" />
            </div>
            <div className="au-fc-panel">
              <div className="au-fc-watermark">WIDE WINGS</div>
              <div className="au-fs-name">Seham Batterjee</div>
              <div className="au-fs-role">FOUNDER</div>
              <div className="au-fs-middle">
                <div className="au-fs-quote">
                  <blockquote>&ldquo;I built Wide Wings Media because I believe great marketing should never feel like guesswork.&rdquo;</blockquote>
                </div>
                <p className="au-fs-bio">Every brand that works with us gets a partner that&apos;s as invested in their growth as they are. That&apos;s the standard we hold ourselves to, every single day.</p>
              </div>
              <div className="au-fs-brand-graphic" aria-hidden="true">
                <img src="/brand-wings.svg" alt="" className="au-brand-wings" />
              </div>
            </div>
          </div>

        </div>
      </section>

      <hr className="au-divider" />

      {/* ── TEAM ── */}
      <section id="au-team" className="au-wrap">
        <div data-reveal className="au-cast-head">
          <div className="au-eyebrow"><span className="dot" />FEATURING</div>
          <h2>Expert Team Members</h2>
          <p>The best people to support your project</p>
        </div>
        <div className="au-cast-grid">
          {team.map((m, i) => {
            const row  = Math.floor(i / 4);
            const col  = i % 4;
            const delay = (row === 0 ? col : col) * 0.05;
            return (
              <div key={m.name} className="au-cast-card" data-reveal data-reveal-delay={String(Math.floor(i / 4) * 60 + (i % 4) * 50)} style={{ '--d': `${delay}s` } as React.CSSProperties}>
                <div className="frame">
                  <Image src={m.img} alt={m.name} fill sizes="300px" style={{ objectFit:'cover', objectPosition:'center 12%' }} loading="lazy" />
                  <div className="spotlight" />
                  <div className="grain" />
                </div>
                <div className="meta">
                  <div>
                    <h3>{m.name}</h3>
                    <p className="role">{m.title}</p>
                    <span className="rule" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── CLOSING CTA ── */}
      <CtaSection />
    </div>
  );
}
