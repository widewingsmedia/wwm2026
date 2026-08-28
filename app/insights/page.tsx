import Link from 'next/link';
import type { Metadata } from 'next';
import { getPageMetadata } from '@/lib/seo';
import '../blogs/blogs.css';
import BlogsClient from '../blogs/BlogsClient';
import { isPublished } from '../blogs/posts-data';
import SchemaScripts from '@/components/SchemaScripts';
import { getPageSchema } from '@/lib/schema';
import { getAllPosts } from '@/lib/admin/all-posts';
import { getHiddenSlugs } from '@/lib/admin/post-visibility-kv';

const PAGE_SCHEMA = getPageSchema('insights');

// Re-checked periodically so scheduled posts (see posts-data.ts publishAt)
// appear in the listing on their own, without a new deploy.
export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  return getPageMetadata('blogs');
}

export default async function InsightsPage() {
  const [posts, hiddenSlugs] = await Promise.all([getAllPosts(), getHiddenSlugs()]);
  return (
    <>
      <SchemaScripts blocks={PAGE_SCHEMA} />
      {/* Hero */}
      <section className="blg-hero">
        <div className="blg-hero-blob" aria-hidden="true" />
        <div className="container blg-hero-inner">
          <nav className="blg-breadcrumb" aria-label="breadcrumb">
            <Link href="/">Home</Link>
            <span className="blg-bc-sep">/</span>
            <span>Blogs</span>
          </nav>
          <h1 className="blg-hero-h1">Blogs &amp; Insights</h1>
          <p className="blg-hero-sub">Expert perspectives on digital marketing, web design, SEO, and growth strategies for businesses in Dubai and the UAE.</p>
        </div>
      </section>

      {/* Paginated grid — client component */}
      <BlogsClient posts={posts.filter(p => isPublished(p) && !hiddenSlugs.includes(p.slug))} />
    </>
  );
}
