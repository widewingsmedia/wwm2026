import type { Metadata } from 'next';
import { getPageMetadata } from '@/lib/seo';
import ServiceDocPage from '../_doc/ServiceDocPage';
import { page } from '../_doc/content/seo-services-dubai';

export async function generateMetadata(): Promise<Metadata> {
  return getPageMetadata(page.pageId);
}

export default function Page() {
  return <ServiceDocPage page={page} />;
}
