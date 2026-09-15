'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import LogoWhite from './LogoWhite';

export default function Header() {
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;
    const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  function toggleMenu() {
    const btn = btnRef.current;
    const nav = navRef.current;
    const header = headerRef.current;
    if (!btn || !nav) return;
    const open = btn.classList.toggle('open');
    nav.classList.toggle('open', open);
    header?.classList.toggle('menu-open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  }

  function closeMenu() {
    const btn = btnRef.current;
    const nav = navRef.current;
    const header = headerRef.current;
    if (!btn || !nav) return;
    btn.classList.remove('open');
    nav.classList.remove('open');
    header?.classList.remove('menu-open');
    document.body.style.overflow = '';
  }

  const isActive = (href: string) => pathname === href;

  const DARK_PAGES = ['/', '/about-us', '/about-us/', '/digital-marketing-services', '/digital-marketing-services/', '/index2', '/index2/', '/index3', '/index3/'];
  const isDarkPage = DARK_PAGES.includes(pathname);

  return (
    <header ref={headerRef} id="site-header" className={isDarkPage ? 'header-on-dark' : undefined}>
      <div className="header-inner">
      <Link href="/" className="nav-logo">
        <LogoWhite width={160} height={64} className="logo-white" uid="hdr" />
        <Image src="/Logoblack.webp" alt="Wide Wings Media" width={160} height={64} priority className="logo-dark" />
      </Link>
      <nav id="site-nav" ref={navRef}>
        <ul className="nav-links">
          <li><Link href="/" className={isActive('/') ? 'active' : ''} onClick={closeMenu}>Home</Link></li>
          <li><Link href="/digital-marketing-services/" className={isActive('/digital-marketing-services/') ? 'active' : ''} onClick={closeMenu}>Services</Link></li>
          <li><Link href="/about-us" className={isActive('/about-us') ? 'active' : ''} onClick={closeMenu}>About Us</Link></li>
          <li><Link href="/insights/" className={isActive('/insights/') ? 'active' : ''} onClick={closeMenu}>Blogs</Link></li>
          <li><Link href="/news" className={isActive('/news') ? 'active' : ''} onClick={closeMenu}>News</Link></li>
          <li><Link href="/contact" className={isActive('/contact') ? 'active' : ''} onClick={closeMenu}>Contact Us</Link></li>
        </ul>
      </nav>
      <Link href="/contact" className="nav-cta">Free Consultation</Link>
      <button className="nav-hamburger" ref={btnRef} id="nav-hamburger" aria-label="Toggle menu" onClick={toggleMenu}>
        <span></span><span></span><span></span>
      </button>
      </div>
    </header>
  );
}
