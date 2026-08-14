'use client';

import { useState } from 'react';
import Link from 'next/link';
import '../contact/contact.css';

export default function LeadsheetPage() {
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

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
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
      setSubmitting(false);
    }
  }

  return (
    <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 20px', background: '#0a0a1a' }}>
      <div className="contact-form-panel" style={{ maxWidth: 560, width: '100%' }}>
        <div className="form-wrapper">
          <div className="form-corner-tl"></div>
          <div id="form-content">
            {submitted ? (
              <>
                <h3 className="form-title">Thank You</h3>
                <p className="form-subtitle">Your message has been received. Our team will get back to you soon.</p>
              </>
            ) : (
              <>
                <h3 className="form-title">Send a Message</h3>
                <p className="form-subtitle">Fill in the details below and our team will get back to you within 24 hours.</p>
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
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
