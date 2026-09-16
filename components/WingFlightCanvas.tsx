'use client';

import { useEffect, useRef } from 'react';

type Props = {
  className?: string;
  /** Transparent canvas (fades its own drawing instead of painting an opaque
   *  background) so it can sit on top of an existing section background. */
  transparent?: boolean;
  /** Flight duration in ms, one bottom-left-to-top-right pass. */
  duration?: number;
};

// Procedural particle-wing flight: a wing built from many fine feather
// "strands" (quadratic-bezier curves) flies from bottom-left to top-right,
// shedding small glowing particles as it goes, then loops. Sized to its
// parent element via ResizeObserver, so it works both full-page and
// embedded inside a section.
export default function WingFlightCanvas({ className, transparent = false, duration = 18000 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const ctx = cv.getContext('2d');
    if (!ctx) return;
    const container = cv.parentElement;
    if (!container) return;

    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let W = 0, H = 0, dpr = 1;
    let rafId = 0;

    function resize() {
      dpr = Math.min(devicePixelRatio || 1, 2);
      const rect = container!.getBoundingClientRect();
      W = rect.width;
      H = rect.height;
      cv!.width = W * dpr;
      cv!.height = H * dpr;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (transparent) ctx!.clearRect(0, 0, W, H);
      else paintBg();
    }
    function paintBg() {
      const g = ctx!.createLinearGradient(0, 0, W * 0.4, H);
      g.addColorStop(0, '#0a0a1a');
      g.addColorStop(1, '#141033');
      ctx!.fillStyle = g;
      ctx!.fillRect(0, 0, W, H);
    }

    /* ---------- wing geometry: strands of fine curves ---------- */
    type Pt = { x: number; y: number };
    type Strand = { pts: Pt[]; c: [number, number, number] };
    const NF = 6, NS = 18; // feathers per side, strands per feather
    const strands: Strand[] = [];

    function mix(a: number[], b: number[], t: number): [number, number, number] {
      return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
    }
    // Brand color ramp — matches the site's own --grad-brand gradient
    // (linear-gradient(135deg, #b62d83 0%, #cfa821 60%, #c33b31 100%)).
    const PINK = [182, 45, 131], GOLD = [207, 168, 33], RED = [195, 59, 49];
    function ramp(k: number): [number, number, number] {
      return k < 0.6 ? mix(PINK, GOLD, k / 0.6) : mix(GOLD, RED, (k - 0.6) / 0.4);
    }

    function qbez(p0: Pt, p1: Pt, p2: Pt, t: number): Pt {
      const m = 1 - t;
      return { x: m * m * p0.x + 2 * m * t * p1.x + t * t * p2.x, y: m * m * p0.y + 2 * m * t * p1.y + t * t * p2.y };
    }

    function buildStrands(side: 1 | -1) {
      for (let f = 0; f < NF; f++) {
        const t = f / (NF - 1);
        const ang = (-30 + t * 46) * Math.PI / 180;
        const len = 128 - t * 56;
        const bx = 10 + t * 2, by = -2 + t * 13;
        const tx = bx + Math.cos(ang) * len, ty = by + Math.sin(ang) * len;
        const mx = (bx + tx) / 2, my = (by + ty) / 2;
        const arc = 21 - t * 7, w = 9 - t * 2.6;

        for (let s = 0; s < NS; s++) {
          const u = s / (NS - 1);
          const p0: Pt = { x: bx, y: by + u * w * 1.1 };
          const p1: Pt = { x: mx + u * 2, y: my - arc - w * (1 - u) * 1.15 + u * w * 0.7 };
          const p2: Pt = { x: tx + (u - 0.5) * 4, y: ty + (u - 0.5) * 2 };
          const pts: Pt[] = [];
          for (let i = 0; i <= 26; i++) {
            const p = qbez(p0, p1, p2, i / 26);
            pts.push({ x: p.x * side, y: p.y });
          }
          strands.push({ pts, c: ramp(Math.min(1, t * 0.55 + u * 0.45)) });
        }
      }
    }
    buildStrands(1);
    buildStrands(-1);

    // centre joint, as a few nested strands
    for (let i = 0; i < 9; i++) {
      const u = i / 8, pts: Pt[] = [];
      for (let k = 0; k <= 20; k++) {
        const a = -Math.PI / 2 + (k / 20) * Math.PI * 2;
        pts.push({ x: Math.cos(a) * (3 + u * 7), y: 11 + Math.sin(a) * (13 + u * 9) });
      }
      strands.push({ pts, c: ramp(0.25 + u * 0.5) });
    }

    /* ---------- flight ---------- */
    const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
    type Particle = { x: number; y: number; vx: number; vy: number; life: number; decay: number; r: number; c: [number, number, number] };
    let particles: Particle[] = [];
    let start = performance.now();
    const dur = duration;

    function pose(now: number) {
      const p = Math.min(1, (now - start) / dur);
      const e = easeInOut(p);
      const x = -0.2 * W + p * 1.42 * W;
      const y = 1.08 * H - e * 1.3 * H;
      const rot = (-6 - e * 22) * Math.PI / 180;
      const flap = 0.45 + 0.55 * (0.5 + 0.5 * Math.cos((now / 1000) * Math.PI * 2 / 2.6));
      const scale = (Math.min(W, H) / 520) * 1.15;
      return { p, x, y, rot, flap, scale };
    }

    function toWorld(pt: Pt, q: ReturnType<typeof pose>) {
      const sx = pt.x * q.scale, sy = pt.y * q.scale * q.flap;
      return {
        x: q.x + sx * Math.cos(q.rot) - sy * Math.sin(q.rot),
        y: q.y + sx * Math.sin(q.rot) + sy * Math.cos(q.rot),
      };
    }

    function frame(now: number) {
      const q = pose(now);

      // motion trail: veil the previous frame instead of clearing it.
      // Transparent mode fades toward alpha 0 (destination-out) so the
      // section behind the canvas keeps showing through; opaque mode
      // veils toward the background color instead.
      if (transparent) {
        ctx!.globalCompositeOperation = 'destination-out';
        ctx!.fillStyle = 'rgba(0,0,0,0.115)';
      } else {
        ctx!.globalCompositeOperation = 'source-over';
        ctx!.fillStyle = 'rgba(10,10,26,0.115)';
      }
      ctx!.fillRect(0, 0, W, H);

      ctx!.globalCompositeOperation = 'lighter';

      // strands
      ctx!.lineWidth = Math.max(0.5, 0.65 * q.scale);
      for (const st of strands) {
        ctx!.beginPath();
        for (let i = 0; i < st.pts.length; i++) {
          const w = toWorld(st.pts[i], q);
          i ? ctx!.lineTo(w.x, w.y) : ctx!.moveTo(w.x, w.y);
        }
        ctx!.strokeStyle = `rgba(${st.c[0] | 0},${st.c[1] | 0},${st.c[2] | 0},0.34)`;
        ctx!.stroke();
      }

      // shed small particles off the strands
      if (q.p < 1) {
        for (let k = 0; k < 40; k++) {
          const st = strands[(Math.random() * strands.length) | 0];
          const pt = st.pts[(Math.random() * st.pts.length) | 0];
          const w = toWorld(pt, q);
          particles.push({
            x: w.x, y: w.y,
            vx: -24 - Math.random() * 46, vy: 10 + Math.random() * 26,
            life: 1, decay: 0.008 + Math.random() * 0.014,
            r: 0.25 + Math.random() * 0.55,
            c: st.c,
          });
        }
        if (particles.length > 2600) particles.splice(0, particles.length - 2600);
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const a = particles[i];
        a.x += a.vx / 60;
        a.y += a.vy / 60;
        a.vy += 0.22;
        a.life -= a.decay;
        if (a.life <= 0) {
          particles.splice(i, 1);
          continue;
        }
        ctx!.fillStyle = `rgba(${a.c[0] | 0},${a.c[1] | 0},${a.c[2] | 0},${(a.life * 0.55).toFixed(3)})`;
        ctx!.beginPath();
        ctx!.arc(a.x, a.y, a.r, 0, 6.2832);
        ctx!.fill();
      }

      ctx!.globalCompositeOperation = 'source-over';

      if (q.p >= 1 && particles.length === 0) start = now + 500;
      if (!reduce) rafId = requestAnimationFrame(frame);
    }

    function restart() {
      particles = [];
      if (transparent) ctx!.clearRect(0, 0, W, H);
      else paintBg();
      start = performance.now();
    }

    resize();
    const ro = new ResizeObserver(() => {
      resize();
      restart();
    });
    ro.observe(container);

    if (reduce) {
      start = performance.now() - dur * 0.5;
      frame(performance.now());
    } else {
      rafId = requestAnimationFrame(frame);
    }

    return () => {
      ro.disconnect();
      cancelAnimationFrame(rafId);
    };
  }, [transparent, duration]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      aria-hidden="true"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', display: 'block' }}
    />
  );
}
