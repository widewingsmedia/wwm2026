import type { Metadata } from 'next';
import { preload } from 'react-dom';

export const metadata: Metadata = {
  title: { absolute: 'Home V4 — Wide Wings Media (Preview)' },
  description: 'Unlinked preview build — cinematic dark redesign of the home page.',
  robots: { index: false, follow: false },
};

// Site chrome (Header/Footer/ChatWidget) is hidden for this route in the
// root layout's hideChrome check — the page ships its own header and footer.
export default function HomeV4Layout({ children }: { children: React.ReactNode }) {
  // fetch the display + body fonts with the HTML so the first paint uses them
  for (const f of ['Nexa-Heavy', 'Nexa-ExtraLight', 'calibri', 'calibri_bold']) {
    preload(`/fonts/${f}.woff2`, { as: 'font', type: 'font/woff2', crossOrigin: 'anonymous' });
  }
  return children;
}
