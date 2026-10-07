import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: { absolute: 'Home V4 — Wide Wings Media (Preview)' },
  description: 'Unlinked preview build — cinematic dark redesign of the home page.',
  robots: { index: false, follow: false },
};

// Site chrome (Header/Footer/ChatWidget) is hidden for this route in the
// root layout's hideChrome check — the page ships its own header and footer.
export default function HomeV4Layout({ children }: { children: React.ReactNode }) {
  return children;
}
