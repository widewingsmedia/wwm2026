'use client';

import { useEffect, useRef } from 'react';

// Real-time smoke: domain-warped fractal noise in a WebGL fragment shader.
// Rendered at half resolution (it's soft anyway), paused while off-screen,
// and drawn as a single still frame for prefers-reduced-motion.
const VERT = `
attribute vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`;

const FRAG = `
precision mediump float;
uniform vec2 uRes;
uniform float uTime;
uniform float uAlpha;

float hash(vec2 p) { p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}
float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
  for (int i = 0; i < 6; i++) { v += a * noise(p); p = m * p; a *= 0.5; }
  return v;
}

void main() {
  vec2 uv = gl_FragCoord.xy / uRes;
  vec2 p = (gl_FragCoord.xy - 0.5 * uRes) / uRes.y * 2.4;
  float t = uTime * 0.05;
  p.y -= t * 1.6;                       // the whole field drifts upward

  vec2 q = vec2(fbm(p + vec2(0.0, t)), fbm(p + vec2(5.2, 1.3) - t));
  vec2 r = vec2(fbm(p + 3.6 * q + vec2(1.7, 9.2) + 0.9 * t),
                fbm(p + 3.6 * q + vec2(8.3, 2.8) - 0.7 * t));
  float f = fbm(p + 3.2 * r);

  // thin wisps: keep the denser folds of the warped field
  float d = smoothstep(0.42, 1.05, f * f * 1.7 + 0.28 * length(q));
  // heavier near the bottom, thinning out as it rises
  d *= mix(1.0, 0.25, smoothstep(0.0, 1.0, uv.y));

  vec3 base = vec3(0.80, 0.78, 0.88);
  vec3 tint = mix(vec3(0.83, 0.29, 0.64), vec3(0.81, 0.66, 0.13), clamp(r.y, 0.0, 1.0));
  vec3 col = mix(base, tint, clamp(length(r) * 0.55 - 0.25, 0.0, 0.45));

  float a = clamp(d * uAlpha, 0.0, 1.0);
  gl_FragColor = vec4(col * a, a);       // premultiplied alpha
}
`;

export default function SmokeCanvas({ className, alpha = 0.55 }: { className?: string; alpha?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const gl = canvas.getContext('webgl', { premultipliedAlpha: true, alpha: true, antialias: false });
    if (!gl) return;

    const compile = (type: number, src: string) => {
      const sh = gl.createShader(type)!;
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      return sh;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'aPos');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const uRes = gl.getUniformLocation(prog, 'uRes');
    const uTime = gl.getUniformLocation(prog, 'uTime');
    gl.uniform1f(gl.getUniformLocation(prog, 'uAlpha'), alpha);

    const SCALE = 0.5; // render at half resolution, CSS scales it up
    const resize = () => {
      const w = Math.max(1, Math.round(canvas.clientWidth * SCALE));
      const h = Math.max(1, Math.round(canvas.clientHeight * SCALE));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w; canvas.height = h;
        gl.viewport(0, 0, w, h);
        gl.uniform2f(uRes, w, h);
      }
    };
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    const start = performance.now() - 20000; // start mid-flow, not from a blank field
    const draw = (now: number) => {
      gl.uniform1f(uTime, (now - start) / 1000);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      draw(performance.now());
      return () => ro.disconnect();
    }

    let raf = 0, visible = false;
    const loop = (now: number) => { draw(now); raf = requestAnimationFrame(loop); };
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      cancelAnimationFrame(raf);
      if (visible) raf = requestAnimationFrame(loop);
    });
    io.observe(canvas);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      // free GL objects but keep the context: a re-run of this effect (prop change,
      // Strict Mode, HMR) gets the same context back from getContext()
      gl.deleteBuffer(buf);
      gl.deleteProgram(prog);
    };
  }, [alpha]);

  return <canvas ref={ref} className={className} aria-hidden="true" />;
}
