import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Leadsheet',
  robots: { index: false, follow: false },
};

export default function LeadsheetLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
