'use client';
import { useEffect, useRef, useState } from 'react';

const SERVICES = [
  "Web & App Development",
  "Creative & Branding",
  "Paid Advertising & Media Buying",
  "Social Media Management",
  "Content Creation",
  "Graphic Design",
  "Email Marketing",
  "SEO Services",
  "OOH Advertising",
  "Analytics & Conversion Optimization",
  "PR Management",
];

const GLITCH_CHARS = "▓▒░█▄▀■□▪▫";

export default function ServiceShowcase() {
  const cardRef    = useRef<HTMLDivElement>(null);
  const nebulaRef  = useRef<HTMLCanvasElement>(null);
  const starsRef   = useRef<HTMLCanvasElement>(null);
  const [cur, setCur]       = useState(0);
  const [display, setDisplay] = useState(SERVICES[0]);
  const [prog, setProg]     = useState(0);
  const [showLogo, setShowLogo] = useState<'intro'|'outro'|null>('intro');

  const logoReadyRef   = useRef(false);
  const logoImgRef     = useRef<HTMLImageElement | null>(null);
  const transitioning  = useRef(false);
  const autoRef        = useRef<ReturnType<typeof setInterval> | null>(null);
  const progRef        = useRef(0);
  const curRef         = useRef(0);
  const showLogoRef    = useRef<'intro'|'outro'|null>('intro');

  // keep refs in sync
  curRef.current     = cur;
  showLogoRef.current = showLogo;

  // load logo
  useEffect(() => {
    const img = new Image();
    img.src = '/LogoWhite.svg';
    img.onload = () => { logoReadyRef.current = true; };
    logoImgRef.current = img;
  }, []);

  // nebula canvas
  useEffect(() => {
    const canvas = nebulaRef.current!;
    const ctx = canvas.getContext('2d')!;
    let raf = 0, nTime = 0;

    // brand-toned blobs: magenta + gold + purple
    const blobs = [
      { x:0.15, y:0.30, r:0.28, speed:0.0003, phase:0.0,  col:[167,49,132]  },
      { x:0.38, y:0.65, r:0.22, speed:0.00045,phase:1.2,  col:[100,20,160]  },
      { x:0.60, y:0.25, r:0.26, speed:0.00035,phase:2.4,  col:[207,168,33]  },
      { x:0.80, y:0.60, r:0.20, speed:0.0005, phase:3.6,  col:[120,40,200]  },
      { x:0.50, y:0.50, r:0.18, speed:0.00025,phase:4.8,  col:[167,49,132]  },
    ];

    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      blobs.forEach(b => {
        const x = (b.x + Math.sin(nTime * b.speed + b.phase) * 0.12) * canvas.width;
        const y = (b.y + Math.cos(nTime * b.speed * 0.7 + b.phase) * 0.10) * canvas.height;
        const r = b.r * Math.min(canvas.width, canvas.height);
        const g = ctx.createRadialGradient(x, y, 0, x, y, r);
        const [cr, cg, cb] = b.col;
        g.addColorStop(0,   `rgba(${cr},${cg},${cb},0.20)`);
        g.addColorStop(0.5, `rgba(${cr},${cg},${cb},0.07)`);
        g.addColorStop(1,   `rgba(${cr},${cg},${cb},0)`);
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fillStyle = g;
        ctx.fill();
      });
      nTime++;
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);

  // stars + shooting stars canvas
  useEffect(() => {
    const canvas = starsRef.current!;
    const ctx = canvas.getContext('2d')!;
    let raf = 0;

    const stars = Array.from({ length: 90 }, () => ({
      x: Math.random(), y: Math.random(),
      r: Math.random() * 1.4 + 0.3,
      alpha: Math.random() * 0.6 + 0.2,
      twinkle: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.02 + 0.005,
    }));

    type Shoot = { x:number; y:number; len:number; life:number; maxLife:number; angle:number; speed:number };
    const shoots: Shoot[] = [];
    const spawnTimer = setInterval(() => {
      shoots.push({
        x: Math.random() * 0.7, y: Math.random() * 0.5,
        len: 0.08 + Math.random() * 0.10,
        life: 0, maxLife: 40 + Math.random() * 20,
        angle: Math.PI / 4 + (Math.random() - 0.5) * 0.3,
        speed: 0.006 + Math.random() * 0.004,
      });
    }, 2200);

    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      const W = canvas.width, H = canvas.height;
      ctx.clearRect(0, 0, W, H);
      stars.forEach(s => {
        s.twinkle += s.speed;
        const a = s.alpha * (0.7 + 0.3 * Math.sin(s.twinkle));
        ctx.beginPath();
        ctx.arc(s.x * W, s.y * H, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${a})`;
        ctx.fill();
      });
      for (let i = shoots.length - 1; i >= 0; i--) {
        const sh = shoots[i];
        sh.life++;
        const t = sh.life / sh.maxLife;
        const alpha = t < 0.3 ? t / 0.3 : 1 - (t - 0.3) / 0.7;
        const ex = sh.x + Math.cos(sh.angle) * sh.len * t;
        const ey = sh.y + Math.sin(sh.angle) * sh.len * t;
        const grd = ctx.createLinearGradient(
          (ex - Math.cos(sh.angle) * sh.len * 0.12) * W,
          (ey - Math.sin(sh.angle) * sh.len * 0.12) * H,
          ex * W, ey * H
        );
        grd.addColorStop(0, `rgba(255,255,255,0)`);
        grd.addColorStop(1, `rgba(220,160,255,${alpha * 0.9})`);
        ctx.beginPath();
        ctx.moveTo((ex - Math.cos(sh.angle) * sh.len * 0.18) * W, (ey - Math.sin(sh.angle) * sh.len * 0.18) * H);
        ctx.lineTo(ex * W, ey * H);
        ctx.strokeStyle = grd;
        ctx.lineWidth = 1.5;
        ctx.stroke();
        if (sh.life >= sh.maxLife) shoots.splice(i, 1);
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); clearInterval(spawnTimer); window.removeEventListener('resize', resize); };
  }, []);

  // glitch reveal
  const glitchReveal = (text: string, onDone?: () => void) => {
    if (transitioning.current) return;
    transitioning.current = true;
    let steps = 0;
    const iv = setInterval(() => {
      if (steps < 6) {
        const partial = text.split('').map((c, i) =>
          i < steps * (text.length / 6) ? c : (c === ' ' ? ' ' : GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)])
        ).join('');
        setDisplay(partial);
      } else {
        setDisplay(text);
        clearInterval(iv);
        transitioning.current = false;
        onDone?.();
      }
      steps++;
    }, 55);
  };

  const goTo = (i: number) => {
    if (transitioning.current) return;
    const next = ((i % SERVICES.length) + SERVICES.length) % SERVICES.length;
    setCur(next);
    curRef.current = next;
    setShowLogo(null);
    showLogoRef.current = null;
    resetProg();
    glitchReveal(SERVICES[next]);
  };

  const startProg = () => {
    autoRef.current = setInterval(() => {
      progRef.current += 0.95;
      setProg(progRef.current);
      if (progRef.current >= 100) {
        progRef.current = 0;
        const next = (curRef.current + 1) % SERVICES.length;
        // show outro logo after last service
        if (curRef.current === SERVICES.length - 1 && showLogoRef.current === null) {
          setShowLogo('outro');
          showLogoRef.current = 'outro';
          setCur(0);
          curRef.current = 0;
          clearInterval(autoRef.current!);
          setTimeout(() => {
            setShowLogo(null);
            showLogoRef.current = null;
            glitchReveal(SERVICES[0]);
            resetProg();
          }, 4000);
        } else {
          goTo(next);
        }
      }
    }, 30);
  };

  const resetProg = () => {
    if (autoRef.current) clearInterval(autoRef.current);
    progRef.current = 0;
    setProg(0);
    startProg();
  };

  // intro logo then start
  useEffect(() => {
    const t = setTimeout(() => {
      setShowLogo(null);
      showLogoRef.current = null;
      glitchReveal(SERVICES[0]);
      startProg();
    }, 4000);
    return () => { clearTimeout(t); if (autoRef.current) clearInterval(autoRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isLogo = showLogo !== null;

  return (
    <div className="svc-showcase-wrap">
      <div className="cwc" ref={cardRef}>
        <canvas className="cwc-bg" ref={nebulaRef} />
        <canvas className="cwc-bg" ref={starsRef} />
        <div className="cwc-vignette" />
        <div className="cwc-scanlines" />
        <div className="cwc-corner cwc-tl" />
        <div className="cwc-corner cwc-tr" />
        <div className="cwc-corner cwc-bl" />
        <div className="cwc-corner cwc-br" />

        <div className="cwc-inner">
          {isLogo ? (
            <div className="cwc-logo-slide">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/LogoWhite.svg" alt="Wide Wings Media" className="cwc-logo-img" />
              <div className="cwc-logo-divider" />
              <div className="cwc-logo-addr">Al Quoz Industrial Area 3, Warehouse #47, Dubai, UAE</div>
              <div className="cwc-logo-phone">+971 4 335 2645&nbsp;&nbsp;|&nbsp;&nbsp;+971 55 565 7609</div>
            </div>
          ) : (
            <>
              <div className="cwc-eyebrow">Service</div>
              <div className="cwc-title-wrap">
                <div className="cwc-title">{display}</div>
              </div>
              <div className="cwc-line" />
            </>
          )}
        </div>

        {!isLogo && (
          <div className="cwc-counter">
            {String(cur + 1).padStart(2, '0')} / {String(SERVICES.length).padStart(2, '0')}
          </div>
        )}

        <div className="cwc-dots">
          {SERVICES.map((_, i) => (
            <div
              key={i}
              className={`cwc-dot${i === cur && !isLogo ? ' cwc-dot-active' : ''}`}
              onClick={() => goTo(i)}
            />
          ))}
        </div>

        <div className="cwc-bar" style={{ width: `${prog}%` }} />
      </div>

    </div>
  );
}
