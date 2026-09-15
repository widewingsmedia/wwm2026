// Two self-contained canvas web components used by the /heropage design,
// ported from the Claude Design canvas export (Wide-Wings-Hero).
//   <dot-globe>   — rotating sphere of dots behind the services card
//   <pixel-drift> — text rendered as scattering square/butterfly particles
//
// The custom-element classes are declared *inside* registerHeroWidgets() so
// `HTMLElement` is only referenced in the browser — this module is still
// evaluated on the server during SSR of the ('use client') Hero component.

interface GlobePoint { x: number; y: number; z: number; c: string }

interface DriftPoint {
  hx: number; hy: number;
  x: number; y: number;
  delay: number;
  vx: number; vy: number;
  c: string;
  ph: number;
  sp: number;
}

export function registerHeroWidgets() {
  if (typeof window === 'undefined') return;

  if (!customElements.get('dot-globe')) {
    class DotGlobe extends HTMLElement {
      private built = false;
      private canvas!: HTMLCanvasElement;
      private ctx!: CanvasRenderingContext2D;
      private ro?: ResizeObserver;
      private raf = 0;
      private colors: string[] = [];
      private speed = 0.18;
      private rScale = 0.42;
      private pts: GlobePoint[] = [];
      private w = 0;
      private h = 0;

      connectedCallback() {
        if (this.built) return;
        this.built = true;
        this.style.display = 'block';
        this.style.position = 'absolute';
        this.style.inset = '0';
        this.canvas = document.createElement('canvas');
        this.canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block;';
        this.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;
        this.colors = (this.getAttribute('colors') || this.getAttribute('color') || '#d8c7ff').split(',').map((c) => c.trim());
        this.speed = parseFloat(this.getAttribute('speed') || '0.18');
        this.rScale = parseFloat(this.getAttribute('radius-scale') || '0.42');
        const n = parseInt(this.getAttribute('dots') || '520', 10);
        this.pts = [];
        const golden = Math.PI * (3 - Math.sqrt(5));
        for (let i = 0; i < n; i++) {
          const y = 1 - (i / (n - 1)) * 2;
          const r = Math.sqrt(Math.max(0, 1 - y * y));
          const th = golden * i;
          this.pts.push({ x: Math.cos(th) * r, y, z: Math.sin(th) * r, c: this.colors[i % this.colors.length] });
        }
        this.ro = new ResizeObserver(() => this.resize());
        this.ro.observe(this);
        this.resize();
        this.loop();
      }

      disconnectedCallback() {
        cancelAnimationFrame(this.raf);
        this.ro?.disconnect();
      }

      private resize() {
        const w = this.clientWidth;
        const h = this.clientHeight;
        if (!w || !h) return;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        this.canvas.width = w * dpr;
        this.canvas.height = h * dpr;
        this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        this.w = w;
        this.h = h;
      }

      private loop = () => {
        this.raf = requestAnimationFrame(this.loop);
        const ctx = this.ctx;
        if (!ctx || !this.w) return;
        const t = performance.now() / 1000;
        const a = t * this.speed;
        const tilt = -0.42;
        const R = Math.min(this.w, this.h) * this.rScale;
        const cx = this.w / 2;
        const cy = this.h / 2;
        ctx.clearRect(0, 0, this.w, this.h);
        const ca = Math.cos(a);
        const sa = Math.sin(a);
        const ct = Math.cos(tilt);
        const st = Math.sin(tilt);
        for (const p of this.pts) {
          const x1 = p.x * ca - p.z * sa;
          const z1 = p.x * sa + p.z * ca;
          const y2 = p.y * ct - z1 * st;
          const z2 = p.y * st + z1 * ct;
          const depth = (z2 + 1) / 2;
          const persp = 0.72 + depth * 0.38;
          ctx.globalAlpha = 0.08 + depth * 0.5;
          const s = 0.7 + depth * 1.4;
          ctx.fillStyle = p.c;
          ctx.beginPath();
          ctx.arc(cx + x1 * R * persp, cy + y2 * R * persp, s, 0, 6.2832);
          ctx.fill();
        }
        ctx.globalAlpha = 1;
      };
    }
    customElements.define('dot-globe', DotGlobe);
  }

  if (!customElements.get('pixel-drift')) {
    class PixelDrift extends HTMLElement {
      static get observedAttributes() {
        return ['text', 'font-size', 'cell', 'gap', 'colors', 'font-weight', 'font-family', 'shape'];
      }

      private built = false;
      private canvas!: HTMLCanvasElement;
      private ctx!: CanvasRenderingContext2D;
      private ro?: ResizeObserver;
      private raf = 0;
      private pointer = { x: -9999, y: -9999, active: false };
      private colors: string[] = [];
      private pts: DriftPoint[] = [];
      private cell = 6;
      private shape = 'square';
      private w = 0;
      private h = 0;
      private t0 = 0;

      private onMove = (e: PointerEvent) => {
        const r = this.canvas.getBoundingClientRect();
        this.pointer.x = e.clientX - r.left;
        this.pointer.y = e.clientY - r.top;
        this.pointer.active = true;
      };

      private onLeave = () => {
        this.pointer.active = false;
        this.pointer.x = -9999;
        this.pointer.y = -9999;
      };

      connectedCallback() {
        if (this.built) return;
        this.built = true;
        this.style.display = 'block';
        this.style.position = 'absolute';
        this.style.inset = '0';
        this.canvas = document.createElement('canvas');
        this.canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block;';
        this.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;
        this.addEventListener('pointermove', this.onMove);
        this.addEventListener('pointerleave', this.onLeave);
        this.ro = new ResizeObserver(() => this.build());
        this.ro.observe(this);
        if (document.fonts?.ready) document.fonts.ready.then(() => this.build());
        this.build();
        this.loop();
      }

      disconnectedCallback() {
        cancelAnimationFrame(this.raf);
        this.ro?.disconnect();
        this.removeEventListener('pointermove', this.onMove);
        this.removeEventListener('pointerleave', this.onLeave);
      }

      attributeChangedCallback() {
        if (this.built) this.build();
      }

      private build() {
        const w = this.clientWidth;
        const h = this.clientHeight;
        if (!w || !h) return;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        this.canvas.width = w * dpr;
        this.canvas.height = h * dpr;
        this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        this.w = w;
        this.h = h;

        const text = this.getAttribute('text') || 'WIDE WINGS';
        const cell = Number(this.getAttribute('cell') || 7);
        const gap = Number(this.getAttribute('gap') || 2);
        const step = cell + gap;
        const weight = this.getAttribute('font-weight') || '700';
        const family = this.getAttribute('font-family') || 'Poppins, Inter, system-ui, sans-serif';
        this.colors = (this.getAttribute('colors') || '#e9e9ed,#9184d9,#b5abfc').split(',').map((s) => s.trim());

        const off = document.createElement('canvas');
        off.width = w;
        off.height = h;
        const o = off.getContext('2d') as CanvasRenderingContext2D;
        let size = Number(this.getAttribute('font-size') || 0);
        if (!size) {
          size = Math.min(h * 0.62, w * 0.17);
          o.font = `${weight} ${size}px ${family}`;
          const measured = o.measureText(text).width;
          const max = w * 0.94;
          if (measured > max) size = size * (max / measured);
        }
        o.font = `${weight} ${size}px ${family}`;
        o.textAlign = 'center';
        o.textBaseline = 'middle';
        (o as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = this.getAttribute('letter-spacing') || '0.01em';
        o.fillStyle = '#fff';
        o.fillText(text, w / 2, h / 2);
        const data = o.getImageData(0, 0, w, h).data;

        const pts: DriftPoint[] = [];
        for (let y = step / 2; y < h; y += step) {
          for (let x = step / 2; x < w; x += step) {
            const i = ((y | 0) * w + (x | 0)) * 4 + 3;
            if (data[i] > 128) {
              const side = (Math.random() * 3) | 0;
              const sx = side === 0
                ? Math.random() * w
                : side === 1
                  ? -60 - Math.random() * 260
                  : w + 60 + Math.random() * 260;
              const sy = side === 0 ? -60 - Math.random() * 260 : Math.random() * h;
              pts.push({
                hx: x, hy: y,
                x: sx, y: sy,
                delay: Math.random() * 2.0,
                vx: 0, vy: 0,
                c: this.colors[(Math.random() * this.colors.length) | 0],
                ph: Math.random() * Math.PI * 2,
                sp: 0.6 + Math.random() * 0.8,
              });
            }
          }
        }
        this.cell = cell;
        this.shape = this.getAttribute('shape') || 'square';
        this.pts = pts;
        this.t0 = performance.now() / 1000;
      }

      private loop = () => {
        this.raf = requestAnimationFrame(this.loop);
        const ctx = this.ctx;
        const pts = this.pts;
        if (!ctx || !pts) return;
        const t = performance.now() / 1000;
        ctx.clearRect(0, 0, this.w, this.h);
        const R = 120;
        const R2 = R * R;
        const px = this.pointer.x;
        const py = this.pointer.y;
        const since = t - (this.t0 || t);
        for (let i = 0; i < pts.length; i++) {
          const p = pts[i];
          if (since < p.delay) continue;
          const dx = Math.sin(t * 0.7 * p.sp + p.ph) * 1.2;
          const dy = Math.cos(t * 0.55 * p.sp + p.ph) * 1.2;
          const k = since < 3.4 ? 0.024 : 0.055;
          let fx = (p.hx + dx - p.x) * k;
          let fy = (p.hy + dy - p.y) * k;
          const ox = p.x - px;
          const oy = p.y - py;
          const d2 = ox * ox + oy * oy;
          if (d2 < R2) {
            const d = Math.sqrt(d2) || 0.001;
            const push = (1 - d / R) * 5.2;
            fx += (ox / d) * push;
            fy += (oy / d) * push;
          }
          p.vx = (p.vx + fx) * 0.86;
          p.vy = (p.vy + fy) * 0.86;
          p.x += p.vx;
          p.y += p.vy;
          ctx.fillStyle = p.c;
          if (this.shape === 'butterfly') {
            const s = this.cell;
            const flap = 0.45 + 0.55 * Math.abs(Math.sin(t * 3.2 * p.sp + p.ph));
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(Math.sin(t * 0.6 * p.sp + p.ph) * 0.25);
            ctx.beginPath();
            ctx.ellipse(-s * 0.34 * flap, -s * 0.08, s * 0.44 * flap, s * 0.52, -0.35, 0, 6.2832);
            ctx.ellipse(s * 0.34 * flap, -s * 0.08, s * 0.44 * flap, s * 0.52, 0.35, 0, 6.2832);
            ctx.fill();
            ctx.fillRect(-s * 0.05, -s * 0.42, s * 0.1, s * 0.84);
            ctx.restore();
          } else if (this.shape === 'dot') {
            ctx.beginPath();
            ctx.arc(p.x, p.y, this.cell / 2, 0, 6.2832);
            ctx.fill();
          } else {
            ctx.fillRect(p.x - this.cell / 2, p.y - this.cell / 2, this.cell, this.cell);
          }
        }
      };
    }
    customElements.define('pixel-drift', PixelDrift);
  }
}
