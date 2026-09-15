import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: { absolute: 'Index3 — Dark Theme Preview' },
  description: 'Unlinked preview build — same layout as the homepage, dark theme.',
  robots: { index: false, follow: false },
};

// No hideChrome opt-out here on purpose — unlike /heropage and /index2, this
// page reuses the real site <Header/>/<Footer/> from the root layout as-is,
// since the request was "same layout as the homepage, just dark".
export default function Index3Layout({ children }: { children: React.ReactNode }) {
  return children;
}
