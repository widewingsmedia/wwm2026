import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-poppins',
});

export const metadata: Metadata = {
  title: { absolute: 'Wide Wings Media — Hero' },
  description: "Think Wide. Move Fast. Grow Far. Dubai's award-winning digital marketing agency.",
  robots: { index: false, follow: false },
};

export default function HeroPageLayout({ children }: { children: React.ReactNode }) {
  return <div className={`${poppins.className} hero-page`}>{children}</div>;
}
