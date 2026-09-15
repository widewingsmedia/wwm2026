'use client';

import { useEffect, useRef } from 'react';
import Header from '@/components/Header';
import { registerHeroWidgets } from './widgets';
import './hero.css';

const MARKUP = `
<div class="hp-hero-bg" style="min-height: 100vh; font-family: Poppins, system-ui, sans-serif; color: #ffffff; position: relative; overflow: hidden; display: flex; flex-direction: column; padding-top: 90px;">

  <div style="position: absolute; right: -14%; top: 4%; width: 54vw; height: 54vw; border-radius: 50%; pointer-events: none; background: radial-gradient(closest-side, rgba(150,45,110,0.1), rgba(150,45,110,0) 70%); animation: wwd-bloom 14s ease-in-out infinite;"></div>

  <div class="hp-hero-wings" aria-hidden="true">
    <svg viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="hwShadeL" x1="100%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#ffffff"/><stop offset="55%" stop-color="#f1f2f6"/><stop offset="100%" stop-color="#d7dae2"/></linearGradient>
        <linearGradient id="hwShadeR" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#ffffff"/><stop offset="55%" stop-color="#f1f2f6"/><stop offset="100%" stop-color="#d7dae2"/></linearGradient>
        <radialGradient id="hwGlow" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="rgba(255,255,255,0.5)"/><stop offset="100%" stop-color="rgba(255,255,255,0)"/></radialGradient>
        <filter id="hwBlur"><feGaussianBlur stdDeviation="18"/></filter>
      </defs>
      <ellipse cx="400" cy="330" rx="320" ry="200" fill="url(#hwGlow)" filter="url(#hwBlur)"/>
      <g class="hw-l">
        <path d="M350 300 C 300 295 150 330 40 470 C 55 450 75 435 95 425 C 60 470 30 510 5 555 C 45 530 90 495 120 465 C 100 495 75 525 55 555 C 100 520 145 480 175 445 C 160 470 140 495 120 520 C 165 490 205 450 230 415 C 355 355 350 320 350 300 Z" fill="url(#hwShadeL)" stroke="#c3c7d0" stroke-width="0.7"/>
        <path d="M350 300 C 290 288 170 300 90 370 C 130 360 165 350 195 345 C 155 380 115 415 80 450 C 130 435 175 410 210 385 C 185 415 155 445 125 475 C 175 455 220 425 250 395 C 235 420 215 445 195 470 C 240 445 280 415 305 380 C 335 350 350 320 350 300 Z" fill="url(#hwShadeL)" stroke="#ccd0d8" stroke-width="0.6"/>
        <path d="M350 300 C 305 275 220 260 155 275 C 195 278 230 288 260 305 C 220 305 190 315 165 330 C 210 328 245 322 275 312 C 245 335 215 355 190 378 C 235 358 275 335 300 310 C 280 340 255 368 235 395 C 275 370 310 340 330 310 C 340 305 350 300 350 300 Z" fill="url(#hwShadeL)" stroke="#d5d8e0" stroke-width="0.6"/>
        <path d="M350 300 C 320 260 270 225 210 210 C 250 225 285 248 305 278 C 285 272 265 272 250 278 C 280 285 305 295 325 308 Z" fill="#ffffff" stroke="#e2e4ea" stroke-width="0.5"/>
      </g>
      <g class="hw-r">
        <path d="M450 300 C 500 295 650 330 760 470 C 745 450 725 435 705 425 C 740 470 770 510 795 555 C 755 530 710 495 680 465 C 700 495 725 525 745 555 C 700 520 655 480 625 445 C 640 470 660 495 680 520 C 635 490 595 450 570 415 C 445 355 450 320 450 300 Z" fill="url(#hwShadeR)" stroke="#c3c7d0" stroke-width="0.7"/>
        <path d="M450 300 C 510 288 630 300 710 370 C 670 360 635 350 605 345 C 645 380 685 415 720 450 C 670 435 625 410 590 385 C 615 415 645 445 675 475 C 625 455 580 425 550 395 C 565 420 585 445 605 470 C 560 445 520 415 495 380 C 465 350 450 320 450 300 Z" fill="url(#hwShadeR)" stroke="#ccd0d8" stroke-width="0.6"/>
        <path d="M450 300 C 495 275 580 260 645 275 C 605 278 570 288 540 305 C 580 305 610 315 635 330 C 590 328 555 322 525 312 C 555 335 585 355 610 378 C 565 358 525 335 500 310 C 520 340 545 368 565 395 C 525 370 490 340 470 310 C 460 305 450 300 450 300 Z" fill="url(#hwShadeR)" stroke="#d5d8e0" stroke-width="0.6"/>
        <path d="M450 300 C 480 260 530 225 590 210 C 550 225 515 248 495 278 C 515 272 535 272 550 278 C 520 285 495 295 475 308 Z" fill="#ffffff" stroke="#e2e4ea" stroke-width="0.5"/>
      </g>
    </svg>
  </div>

  <div data-hero-frame="brand" style="position: relative; display: grid; grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); gap: 64px; align-items: start; padding: 60px 5vw 6px; flex: 1;">

    <div style="min-width: 0; position: relative;">
      <div style="position: relative; z-index: 1; display: inline-flex; align-items: center; gap: 12px; font-size: 12px; font-weight: 500; letter-spacing: 0.2em; text-transform: uppercase; color: #e9a93c; animation: wwd-fade 1.1s cubic-bezier(0.16,1,0.3,1) 0.1s both;">
        <span style="width: 26px; height: 1px; background: #e9a93c; display: inline-block;"></span>Dubai's Award-Winning Agency
      </div>

      <h1 id="hp-h1" aria-label="Think Wide. Move Fast. Grow Far." style="margin: 26px 0 0; position: relative; z-index: 1; font-weight: 600; font-size: 84px; line-height: 1.02; letter-spacing: -0.03em; display: flex; flex-direction: column; align-items: flex-start; perspective: 900px; transform-style: preserve-3d;">
        <span style="display: block; font-weight: 300; animation: wwd-rise 1.3s cubic-bezier(0.16,1,0.3,1) 0.3s both;"><span style="display: inline-block;">T</span><span style="display: inline-block;">h</span><span style="display: inline-block;">i</span><span style="display: inline-block;">n</span><span style="display: inline-block;">k&nbsp;</span><span style="display: inline-block;">W</span><span style="display: inline-block;">i</span><span style="display: inline-block;">d</span><span style="display: inline-block;">e</span><span style="display: inline-block;">.</span></span>
        <span style="display: block; animation: wwd-rise 1.3s cubic-bezier(0.16,1,0.3,1) 0.55s both;"><span style="display: inline-block;">M</span><span style="display: inline-block;">o</span><span style="display: inline-block;">v</span><span style="display: inline-block;">e&nbsp;</span><span style="display: inline-block;">F</span><span style="display: inline-block;">a</span><span style="display: inline-block;">s</span><span style="display: inline-block;">t</span><span style="display: inline-block;">.</span></span>
        <span style="display: block; font-weight: 700; color: #d34ba4; animation: wwd-rise 1.3s cubic-bezier(0.16,1,0.3,1) 0.8s both;"><span style="display: inline-block;">G</span><span style="display: inline-block;">r</span><span style="display: inline-block;">o</span><span style="display: inline-block;">w&nbsp;</span><span style="display: inline-block;">F</span><span style="display: inline-block;">a</span><span style="display: inline-block;">r</span><span style="display: inline-block;">.</span></span>
      </h1>

      <div class="hp-stats" style="position: relative; z-index: 1; display: grid; grid-template-columns: repeat(3, max-content); gap: 48px; margin-top: 24px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.12); animation: wwd-fade 1.2s cubic-bezier(0.16,1,0.3,1) 2.7s both;">
        <div>
          <div style="font-size: 32px; font-weight: 600; color: #e9a93c; line-height: 1;">5+</div>
          <div style="margin-top: 5px; font-size: 12px; font-weight: 500; letter-spacing: 0.14em; text-transform: uppercase; color: rgba(255,255,255,0.6);">Years Experience</div>
        </div>
        <div>
          <div style="font-size: 32px; font-weight: 600; color: #e9a93c; line-height: 1;">11+</div>
          <div style="margin-top: 5px; font-size: 12px; font-weight: 500; letter-spacing: 0.14em; text-transform: uppercase; color: rgba(255,255,255,0.6);">Countries</div>
        </div>
        <div>
          <div style="font-size: 32px; font-weight: 600; color: #e9a93c; line-height: 1;">50+</div>
          <div style="margin-top: 5px; font-size: 12px; font-weight: 500; letter-spacing: 0.14em; text-transform: uppercase; color: rgba(255,255,255,0.6);">Brand Partners</div>
        </div>
      </div>
    </div>

    <div style="min-width: 0; margin-top: 48px; animation: wwd-in-right 1.2s cubic-bezier(0.16,1,0.3,1) 0.5s both;">
      <div style="position: relative; border-radius: 17px; padding: 1.5px; overflow: hidden; box-shadow: 0 24px 60px rgba(21,14,43,0.45);">
      <div style="position: absolute; inset: 0; border-radius: 17px; padding: 7px; overflow: hidden; pointer-events: none; opacity: 0.5; filter: blur(9px); -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0); -webkit-mask-composite: xor; mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0); mask-composite: exclude;">
        <div style="position: absolute; left: 50%; top: 50%; width: 150%; aspect-ratio: 1; transform: translate(-50%, -50%); background: conic-gradient(from 0deg, rgba(215,255,0,0) 0deg, rgba(215,255,0,0) 316deg, #d7ff00 352deg, rgba(215,255,0,0) 360deg); animation: wwd-orbit 5s linear infinite;"></div>
        <div style="position: absolute; left: 50%; top: 50%; width: 150%; aspect-ratio: 1; transform: translate(-50%, -50%); background: conic-gradient(from 180deg, rgba(211,75,164,0) 0deg, rgba(211,75,164,0) 316deg, #ff6ec7 352deg, rgba(211,75,164,0) 360deg); animation: wwd-orbit-rev 6.5s linear infinite;"></div>
      </div>
      <div style="position: absolute; inset: 0; border-radius: 17px; padding: 1.5px; overflow: hidden; pointer-events: none; -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0); -webkit-mask-composite: xor; mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0); mask-composite: exclude;">
        <div style="position: absolute; left: 50%; top: 50%; width: 150%; aspect-ratio: 1; transform: translate(-50%, -50%); background: conic-gradient(from 0deg, rgba(255,255,255,0.10) 0deg, rgba(255,255,255,0.10) 300deg, rgba(215,255,0,0.5) 334deg, #f2ff7a 352deg, rgba(255,255,255,0.10) 360deg); animation: wwd-orbit 5s linear infinite;"></div>
        <div style="position: absolute; left: 50%; top: 50%; width: 150%; aspect-ratio: 1; transform: translate(-50%, -50%); background: conic-gradient(from 180deg, rgba(255,255,255,0) 0deg, rgba(255,255,255,0) 300deg, rgba(211,75,164,0.55) 334deg, #ff6ec7 352deg, rgba(255,255,255,0) 360deg); animation: wwd-orbit-rev 6.5s linear infinite;"></div>
      </div>
      <div style="position: relative; background: linear-gradient(150deg, rgba(186,225,255,0.16) 0%, rgba(214,186,255,0.10) 42%, rgba(120,220,225,0.09) 100%); backdrop-filter: blur(20px) saturate(180%); -webkit-backdrop-filter: blur(20px) saturate(180%); border-radius: 15.5px; box-shadow: inset 0 1px 0 rgba(255,255,255,0.28), inset 0 -1px 0 rgba(255,255,255,0.08); padding: 18px 22px 8px; overflow: hidden;">
      <div class="hp-logo-bg" aria-hidden="true"></div>
      <div style="position: relative; padding: 6px 0 16px; border-bottom: 2px solid; border-image: linear-gradient(90deg, #e9a93c 0%, #e9a93c 45%, rgba(233,169,60,0.12) 100%) 1;">
        <span style="font-size: 21px; font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase; color: #e9a93c;">Give your brand <span style="font-weight: 800; letter-spacing: 0.12em;">WINGS</span></span>
      </div>
      <div style="position: relative; z-index: 1; height: 296px; overflow: hidden; mask-image: linear-gradient(to bottom, transparent 0%, #000 14%, #000 86%, transparent 100%); -webkit-mask-image: linear-gradient(to bottom, transparent 0%, #000 14%, #000 86%, transparent 100%);">
        <div style="display: flex; flex-direction: column;">
          <div class="hp-marquee" style="display: flex; flex-direction: column; animation: wwd-marquee 30s linear infinite;">
            <a class="hp-svc" href="https://wide-wings.ae/web-design-company-dubai/" style="display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 22px 4px; border-bottom: 1px solid rgba(255,255,255,0.1); color: #ffffff; font-size: 19px; font-weight: 600; transition: color 0.2s ease;">Web &amp; App Development <span style="color: rgba(255,255,255,0.4);">↗</span></a>
            <a class="hp-svc" href="https://wide-wings.ae/branding-agency-dubai/" style="display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 22px 4px; border-bottom: 1px solid rgba(255,255,255,0.1); color: #ffffff; font-size: 19px; font-weight: 600; transition: color 0.2s ease;">Creative &amp; Branding <span style="color: rgba(255,255,255,0.4);">↗</span></a>
            <a class="hp-svc" href="https://wide-wings.ae/ppc-advertising-company-dubai/" style="display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 22px 4px; border-bottom: 1px solid rgba(255,255,255,0.1); color: #ffffff; font-size: 19px; font-weight: 600; transition: color 0.2s ease;">Paid Advertising &amp; Media Buying <span style="color: rgba(255,255,255,0.4);">↗</span></a>
            <a class="hp-svc" href="https://wide-wings.ae/social-media-marketing-agency-in-dubai/" style="display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 22px 4px; border-bottom: 1px solid rgba(255,255,255,0.1); color: #ffffff; font-size: 19px; font-weight: 600; transition: color 0.2s ease;">Social Media Management <span style="color: rgba(255,255,255,0.4);">↗</span></a>
            <a class="hp-svc" href="https://wide-wings.ae/seo-services-dubai/" style="display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 22px 4px; border-bottom: 1px solid rgba(255,255,255,0.1); color: #ffffff; font-size: 19px; font-weight: 600; transition: color 0.2s ease;">SEO &amp; Performance Management <span style="color: rgba(255,255,255,0.4);">↗</span></a>
            <a class="hp-svc" href="https://wide-wings.ae/outdoor-advertising-dubai/" style="display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 22px 4px; border-bottom: 1px solid rgba(255,255,255,0.1); color: #ffffff; font-size: 19px; font-weight: 600; transition: color 0.2s ease;">OOH Advertising &amp; PR <span style="color: rgba(255,255,255,0.4);">↗</span></a>
            <a class="hp-svc" href="https://wide-wings.ae/web-design-company-dubai/" aria-hidden="true" style="display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 22px 4px; border-bottom: 1px solid rgba(255,255,255,0.1); color: #ffffff; font-size: 19px; font-weight: 600; transition: color 0.2s ease;">Web &amp; App Development <span style="color: rgba(255,255,255,0.4);">↗</span></a>
            <a class="hp-svc" href="https://wide-wings.ae/branding-agency-dubai/" aria-hidden="true" style="display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 22px 4px; border-bottom: 1px solid rgba(255,255,255,0.1); color: #ffffff; font-size: 19px; font-weight: 600; transition: color 0.2s ease;">Creative &amp; Branding <span style="color: rgba(255,255,255,0.4);">↗</span></a>
            <a class="hp-svc" href="https://wide-wings.ae/ppc-advertising-company-dubai/" aria-hidden="true" style="display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 22px 4px; border-bottom: 1px solid rgba(255,255,255,0.1); color: #ffffff; font-size: 19px; font-weight: 600; transition: color 0.2s ease;">Paid Advertising &amp; Media Buying <span style="color: rgba(255,255,255,0.4);">↗</span></a>
            <a class="hp-svc" href="https://wide-wings.ae/social-media-marketing-agency-in-dubai/" aria-hidden="true" style="display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 22px 4px; border-bottom: 1px solid rgba(255,255,255,0.1); color: #ffffff; font-size: 19px; font-weight: 600; transition: color 0.2s ease;">Social Media Management <span style="color: rgba(255,255,255,0.4);">↗</span></a>
            <a class="hp-svc" href="https://wide-wings.ae/seo-services-dubai/" aria-hidden="true" style="display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 22px 4px; border-bottom: 1px solid rgba(255,255,255,0.1); color: #ffffff; font-size: 19px; font-weight: 600; transition: color 0.2s ease;">SEO &amp; Performance Management <span style="color: rgba(255,255,255,0.4);">↗</span></a>
            <a class="hp-svc" href="https://wide-wings.ae/outdoor-advertising-dubai/" aria-hidden="true" style="display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 22px 4px; border-bottom: 1px solid rgba(255,255,255,0.1); color: #ffffff; font-size: 19px; font-weight: 600; transition: color 0.2s ease;">OOH Advertising &amp; PR <span style="color: rgba(255,255,255,0.4);">↗</span></a>
          </div>
        </div>
      </div>
      </div>
      </div>
    </div>
  </div>

  <div style="position: relative; margin-top: auto; animation: wwd-fade 1.6s cubic-bezier(0.16,1,0.3,1) 1.2s both;">
    <div style="position: relative; width: 100%; height: 280px; margin-bottom: -6px;">
      <pixel-drift text="WIDE WINGS" shape="dot" cell="3" gap="2" colors="#ffffff,#d34ba4,#e9a93c,#6ba0ba,#b62d83,#8f6ed5,#d7ff00" style="position: absolute; inset: 0; display: block; width: 100%; height: 100%;"></pixel-drift>
    </div>
  </div>
</div>
`;

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    registerHeroWidgets();

    const root = containerRef.current;
    if (!root) return;

    // ── letter wave on hover of the service / "all services" links ──
    // Uses delegated pointerover/pointerout (which bubble and re-fire when a
    // link scrolls under a stationary cursor in the marquee) so the wave is
    // reliable even while the list is auto-scrolling.
    const frame = root.querySelector<HTMLElement>('[data-hero-frame]');
    if (frame) {
      const links = Array.from(frame.querySelectorAll('a')).filter(
        (a) => a.querySelector('span') && a.textContent!.trim().length > 6 && !a.closest('h1'),
      );
      const lettersByLink = new WeakMap<Element, HTMLSpanElement[]>();
      for (const a of links) {
        const node = Array.from(a.childNodes).find((n) => n.nodeType === 3 && n.textContent!.trim());
        if (!node) continue;
        const wrap = document.createElement('span');
        wrap.style.display = 'inline-block';
        const letters: HTMLSpanElement[] = [];
        for (const ch of node.textContent!.trimEnd()) {
          const s = document.createElement('span');
          s.textContent = ch;
          s.style.display = 'inline-block';
          s.style.whiteSpace = 'pre';
          wrap.appendChild(s);
          letters.push(s);
        }
        a.replaceChild(wrap, node);
        lettersByLink.set(a, letters);
      }
      const waveIn = (e: Event) => {
        const a = (e.target as Element | null)?.closest('a');
        const letters = a && lettersByLink.get(a);
        if (!letters) return;
        letters.forEach((l, i) => {
          l.style.animation = 'none';
          void l.offsetWidth;
          l.style.animation = `wwd-wave 0.8s cubic-bezier(0.34,1.4,0.5,1) ${i * 0.045}s infinite`;
        });
      };
      const waveOut = (e: Event) => {
        const a = (e.target as Element | null)?.closest('a');
        const letters = a && lettersByLink.get(a);
        if (!letters) return;
        const related = (e as PointerEvent).relatedTarget as Node | null;
        if (related && a.contains(related)) return;
        letters.forEach((l) => { l.style.animation = 'none'; });
      };
      frame.addEventListener('pointerover', waveIn);
      frame.addEventListener('pointerout', waveOut);
    }

    // ── 3D pointer drift of the H1 letters ──
    const h1 = root.querySelector<HTMLElement>('#hp-h1');
    const driftFrame = h1?.closest<HTMLElement>('[data-hero-frame]') ?? h1;
    if (h1 && driftFrame) {
      const letters = Array.from(h1.querySelectorAll<HTMLElement>('span > span'));
      letters.forEach((l) => {
        l.style.transition = 'transform 0.28s cubic-bezier(0.22,1,0.3,1)';
        l.style.transformOrigin = 'center bottom';
        l.addEventListener('animationend', () => { l.style.animation = 'none'; }, { once: true });
      });
      const R = 200;
      const onMove = (e: PointerEvent) => {
        for (const l of letters) {
          const r = l.getBoundingClientRect();
          const dx = e.clientX - (r.left + r.width / 2);
          const dy = e.clientY - (r.top + r.height / 2);
          const d = Math.hypot(dx, dy * 0.8);
          if (d > R) { l.style.transform = ''; continue; }
          const f = Math.pow(1 - d / R, 2.2);
          l.style.transform = `translateY(${-16 * f}px) scale(${1 + 0.62 * f})`;
        }
      };
      const onLeave = () => letters.forEach((l) => { l.style.transform = ''; });
      driftFrame.addEventListener('pointermove', onMove);
      driftFrame.addEventListener('pointerleave', onLeave);
      return () => {
        driftFrame.removeEventListener('pointermove', onMove);
        driftFrame.removeEventListener('pointerleave', onLeave);
      };
    }
  }, []);

  return (
    <>
      <Header />
      <div ref={containerRef} className="hero-markup" dangerouslySetInnerHTML={{ __html: MARKUP }} />
    </>
  );
}
