import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: { absolute: 'Index2 — Scroll Motion Preview' },
  description: 'Unlinked preview build — dark scroll-driven motion concept.',
  robots: { index: false, follow: false },
};

// The Poppins font is applied directly to .idx2-root in Index2.tsx, not
// here — wrapping {children} in it would also apply it to the real
// Header/Footer this page renders, overriding their normal site font.
export default function Index2Layout({ children }: { children: React.ReactNode }) {
  return children;
}
