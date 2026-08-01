'use client';

import { useState, useRef, MouseEvent, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import './contact.css';
import SchemaScripts from '@/components/SchemaScripts';
import { getPageSchema } from '@/lib/schema';

const PAGE_SCHEMA = getPageSchema('contact-us');

export default function ContactPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const ctaRef = useRef<HTMLElement>(null);

  const handleCtaMouseMove = useCallback((e: MouseEvent<HTMLElement>) => {
    const el = ctaRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    el.style.setProperty('--mx', `${x}%`);
    el.style.setProperty('--my', `${y}%`);
  }, []);
  const [submitting, setSubmitting] = useState(false);

  function handleCard3D(e: MouseEvent<HTMLDivElement>) {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 22;
    const y = -((e.clientY - rect.top) / rect.height - 0.5) * 22;
    card.style.transform = `perspective(600px) rotateX(${y}deg) rotateY(${x}deg) translateY(-6px) scale(1.03)`;
  }
  function resetCard3D(e: MouseEvent<HTMLDivElement>) {
    e.currentTarget.style.transform = 'perspective(600px) rotateX(0deg) rotateY(0deg) translateY(0) scale(1)';
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const required = form.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>('[required]');
    let valid = true;
    required.forEach(f => {
      if (!f.value.trim()) {
        valid = false;
        f.style.borderColor = '#e53e3e';
        f.addEventListener('input', () => { f.style.borderColor = ''; }, { once: true });
      }
    });
    if (!valid) return;
    setError('');
    setSubmitting(true);
    try {
      const data = new FormData(form);
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.get('name'),
          email: data.get('email'),
          phone: data.get('phone'),
          service: data.get('service'),
          message: data.get('message'),
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error ?? 'Something went wrong. Please try again.');
      }
      router.push('/contact/thank-you');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
      setSubmitting(false);
    }
  }


  return (
    <main>
      <SchemaScripts blocks={PAGE_SCHEMA} />
      {/* HERO */}
      <section id="contact-hero">
        <div className="contact-hero-blob"></div>
        <div className="contact-hero-sparks" aria-hidden="true">
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
            <div key={i} className="contact-spark" style={{ left:s.l, top:s.t, '--sc':s.c, '--sz':s.sz, '--op':s.op, '--sd':s.sd, '--dl':s.dl } as React.CSSProperties} />
          ))}
        </div>
        <div className="hero-inner">
          <div className="hero-badge">
            <div className="hero-badge-dot"></div>
            <span>Contact Us</span>
          </div>
          <h1 className="hero-title">
            Let&apos;s <em>Soar</em>
          </h1>
          <p className="hero-subtitle">
            Ready to take your brand to new heights? Our digital marketing experts in Dubai are here to craft your success story. Reach out to us today and let&apos;s build your legacy together.
          </p>
        </div>
      </section>

      <div className="divider-line"></div>

      {/* CONTACT MAIN */}
      <section id="contact-main">
        <div className="container">
          <div className="contact-grid">

            {/* LEFT: Info Panel */}
            <div className="contact-info-panel">
              <span className="section-label anim-fade-up">Stay Connected</span>
              <h2 className="contact-info-h2 anim-fade-up anim-d1">Quick <span className="gradient-text">Connect</span></h2>
              <p className="contact-info-plain anim-fade-up anim-d2">Get in touch with our team and we&apos;ll help you craft a strategy that drives real results.</p>

              <div className="info-cards-3d">
                <div className="card-3d anim-fade-up anim-d2" onMouseMove={handleCard3D} onMouseLeave={resetCard3D}>
                  <div className="card-3d-glow" />
                  <div className="card-3d-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/>
                    </svg>
                  </div>
                  <div className="card-3d-body">
                    <div className="card-3d-label">Our Location</div>
                    <div className="card-3d-value">Wide Wings Media, LLC — Al Quoz Industrial Area 3, Warehouse #47, Dubai, UAE</div>
                  </div>
                </div>

                <div className="card-3d anim-fade-up anim-d3" onMouseMove={handleCard3D} onMouseLeave={resetCard3D}>
                  <div className="card-3d-glow" />
                  <div className="card-3d-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.07 1.18 2 2 0 012.04.01h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 14.92v2z"/>
                    </svg>
                  </div>
                  <div className="card-3d-body">
                    <div className="card-3d-label">Phone / WhatsApp</div>
                    <div className="card-3d-value">
                      <a href="tel:+97143352645">+971 4 335 2645</a><br/>
                      <a href="tel:+971555657609">+971 55 565 7609</a>
                      <br/><a href="https://wa.me/971555657609" className="card-3d-cta">Chat on WhatsApp →</a>
                    </div>
                  </div>
                </div>

                <div className="card-3d anim-fade-up anim-d4" onMouseMove={handleCard3D} onMouseLeave={resetCard3D}>
                  <div className="card-3d-glow" />
                  <div className="card-3d-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 7l10 7 10-7"/>
                    </svg>
                  </div>
                  <div className="card-3d-body">
                    <div className="card-3d-label">Email Address</div>
                    <div className="card-3d-value">
                      <a href="mailto:info@wide-wings.ae">info@wide-wings.ae</a>
                      <br/><a href="mailto:info@wide-wings.ae" className="card-3d-cta">Send us an email →</a>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* RIGHT: Form */}
            <div className="contact-form-panel">
              <div className="form-wrapper">
                <div className="form-corner-tl"></div>
                <div id="form-content">
                    <h3 className="form-title anim-fade-up">Send a Message</h3>
                    <p className="form-subtitle anim-fade-up anim-d1">Fill in the details below and our team will get back to you within 24 hours.</p>
                    <form onSubmit={handleSubmit} noValidate>
                      <div className="form-row">
                        <div className="form-group"><label>Full Name <span>*</span></label><input type="text" name="name" className="form-control" placeholder="Your Name" required /></div>
                        <div className="form-group"><label>Email Address <span>*</span></label><input type="email" name="email" className="form-control" placeholder="Email" required /></div>
                      </div>
                      <div className="form-group">
                        <label>Phone Number</label>
                        <input type="tel" name="phone" className="form-control" placeholder="Phone" />
                      </div>
                      <div className="form-group">
                        <label>Service Interested In <span>*</span></label>
                        <select className="form-control" name="service" required defaultValue="">
                          <option value="" disabled>Select a service…</option>
                          <option>Digital Marketing Strategy</option>
                          <option>Social Media Management</option>
                          <option>SEO &amp; Content Marketing</option>
                          <option>Paid Advertising (PPC/Meta Ads)</option>
                          <option>Branding &amp; Creative Design</option>
                          <option>Video Production &amp; Photography</option>
                          <option>Website Development</option>
                          <option>Influencer Marketing</option>
                          <option>Full-Service Package</option>
                          <option>Other</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Your Message <span>*</span></label>
                        <textarea className="form-control" name="message" placeholder="Tell us about your project goals, timeline, and any specific requirements…" required></textarea>
                      </div>
                      {error && (
                        <p style={{ color: '#e53e3e', fontSize: '0.85rem', marginBottom: 14 }} role="alert">{error}</p>
                      )}
                      <div className="form-submit-row">
                        <p className="form-privacy">By submitting, you agree to our<br/><Link href="/privacy-policy/">Privacy Policy</Link> &amp; <Link href="/terms-conditions/">Terms of Service</Link>.</p>
                        <button type="submit" className="btn-submit" disabled={submitting}>
                          {submitting ? 'Sending…' : "Let's Talk"}
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                        </button>
                      </div>
                    </form>
                  </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MAP */}
      <section id="map-section">
        <div className="map-header">
          <div className="container">
            <span className="section-label">Find Us</span>
            <h2 className="map-h2">Our <span className="gradient-text">Location</span></h2>
            <p className="map-desc">Al Quoz Industrial Area 3, Goshi Warehouse City, Warehouse #47, Dubai, United Arab Emirates</p>
          </div>
        </div>
        <div className="map-container">
          <iframe
            src="https://www.google.com/maps?q=Wide+Wings+Media+LLC+Al+Quoz+Industrial+Area+3+Goshi+Warehouse+City+Warehouse+47+Dubai&output=embed"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Wide Wings Media Office Location"
          ></iframe>
        </div>
      </section>

      {/* CTA STRIP */}
      <section id="cta-strip" ref={ctaRef} onMouseMove={handleCtaMouseMove}>
        <div className="cta-watermark" aria-hidden="true"><span>WIDE WINGS</span></div>
        <div className="container">
          <div className="cta-label">Ready to Grow?</div>
          <h2 className="cta-h2">Let&apos;s Turn Your Vision Into<br/><span className="gradient-text">Measurable Results</span></h2>
          <p className="cta-body">From brand strategy to viral campaigns — Wide Wings delivers digital marketing that moves the needle in the UAE market and beyond.</p>
          <div className="cta-actions">
            <a href="tel:+97143352645" className="btn-cta-primary">
              <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.07 1.18 2 2 0 012.04.01h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 14.92v2z"/></svg></span>
              <span>Call Us Now</span>
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
