// Parses a filled-in copy of the Wide Wings blog .docx template into
// structured post data, ready for the admin preview screen. Converts docx →
// HTML with mammoth (preserves headings and real hyperlinks — far more
// reliable than trying to do the same from a PDF, which has no native
// heading/link structure), then walks the flat sequence of top-level
// elements with a small state machine keyed on the template's own section
// labels (SEO Title, Meta Description, Frequently Asked Questions, Schema,
// Slug + Meta Data).
import mammoth from 'mammoth';
import * as cheerio from 'cheerio';
import type { FaqItem } from './admin/new-posts-kv';

export interface ParsedBlog {
  title: string;
  slug: string;
  metaTitle: string;
  metaDescription: string;
  category: string;
  bodyHtml: string;
  faqItems: FaqItem[];
  embeddedImage: string | null; // data: URI if an image was pasted into the docx
  suggestedImage: string; // free-text hint from the "Suggested Featured Image" line
  warnings: string[];
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

type Mode = 'preamble' | 'seo-title' | 'meta-desc' | 'body' | 'faq' | 'schema' | 'slugmeta';

export async function parseBlogDocx(buffer: Buffer): Promise<ParsedBlog> {
  const warnings: string[] = [];
  const { value: html } = await mammoth.convertToHtml({ buffer });
  const $ = cheerio.load(html);
  const nodes = $('body').children().toArray();

  let seoTitle = '';
  let metaDescriptionTop = '';
  let title = '';
  let category = '';
  let slugField = '';
  let metaTitleFinal = '';
  let metaDescriptionFinal = '';
  let suggestedImage = '';
  let embeddedImage: string | null = null;
  const bodyParts: string[] = [];
  const faqItems: FaqItem[] = [];

  let mode: Mode = 'preamble';
  let pendingQuestion = '';
  let pendingAnswerParts: string[] = [];

  function flushFaq() {
    if (pendingQuestion) {
      faqItems.push({ q: pendingQuestion, a: pendingAnswerParts.join(' ').trim() });
    }
    pendingQuestion = '';
    pendingAnswerParts = [];
  }

  for (const el of nodes) {
    const $el = $(el);
    const tag = (el as { tagName?: string }).tagName?.toLowerCase() ?? '';
    const text = $el.text().trim();

    // Grab the first embedded image found anywhere in the doc (mammoth inlines
    // Word images as base64 data URIs by default).
    if (!embeddedImage) {
      const img = $el.is('img') ? $el : $el.find('img').first();
      const src = img.attr?.('src');
      if (src && src.startsWith('data:')) embeddedImage = src;
    }

    // Section-label triggers (checked before falling through to the current mode).
    // The template renders these labels as bold paragraphs, not real Word
    // heading styles — so match on text content across both <h3> and <p>.
    const isLabelTag = tag === 'h3' || tag === 'p';
    if (isLabelTag && /^seo title/i.test(text)) { mode = 'seo-title'; continue; }
    if (isLabelTag && /^meta description\b/i.test(text) && text.length < 40) { mode = 'meta-desc'; continue; }
    if (tag === 'h1') { title = text; mode = 'body'; continue; }
    if (tag === 'h2' && /frequently asked questions/i.test(text)) { flushFaq(); mode = 'faq'; continue; }
    if (isLabelTag && /^schema\b/i.test(text)) { flushFaq(); mode = 'schema'; continue; }
    if (isLabelTag && /slug\s*\+\s*meta data/i.test(text)) { mode = 'slugmeta'; continue; }

    switch (mode) {
      case 'seo-title':
        if (tag === 'p' && text) { seoTitle = text; mode = 'preamble'; }
        break;
      case 'meta-desc':
        if (tag === 'p' && text) { metaDescriptionTop = text; mode = 'preamble'; }
        break;
      case 'body':
        if (text || tag === 'ul' || tag === 'ol') bodyParts.push($.html(el) ?? '');
        break;
      case 'faq':
        if (tag === 'h3') {
          flushFaq();
          pendingQuestion = text;
        } else if (tag === 'p' && pendingQuestion && text) {
          pendingAnswerParts.push(text);
        }
        break;
      case 'schema':
        // Informational only in the doc — the real schema is built from the
        // structured fields below (buildBlogSchema), not parsed as JSON here,
        // since freeform typed JSON-LD is too easy to make invalid.
        break;
      case 'slugmeta': {
        if (tag !== 'p' || !text) break;
        const m = text.match(/^([A-Za-z\s]+):\s*(.*)$/);
        if (!m) break;
        const key = m[1].trim().toLowerCase();
        const val = m[2].trim();
        if (key === 'slug') slugField = val.replace(/^\/+|\/+$/g, '').trim();
        else if (key === 'meta title') metaTitleFinal = val;
        else if (key === 'meta description') metaDescriptionFinal = val;
        else if (key === 'category') category = val;
        else if (key.includes('featured image')) suggestedImage = val;
        break;
      }
    }
  }
  flushFaq();

  // ── Resolve fields with sensible fallbacks + warnings ──
  if (!title) warnings.push('No H1 title found — is the template\'s heading style intact?');

  let slug = slugField && !slugField.includes('[') ? slugify(slugField) : '';
  if (!slug) {
    slug = slugify(title || 'untitled-post');
    warnings.push(`No usable slug found in the "Slug + Meta Data" section — generated one from the title: /${slug}/`);
  }

  const metaTitle = (metaTitleFinal && !metaTitleFinal.includes('[')) ? metaTitleFinal
    : (seoTitle && !seoTitle.includes('[')) ? seoTitle
    : title;
  if (!metaTitleFinal && !seoTitle) warnings.push('No SEO/meta title found — using the H1 as the meta title.');

  const metaDescription = (metaDescriptionFinal && !metaDescriptionFinal.includes('['))
    ? metaDescriptionFinal
    : (metaDescriptionTop && !metaDescriptionTop.includes('[')) ? metaDescriptionTop : '';
  if (!metaDescription) warnings.push('No meta description found — please add one before publishing.');

  if (!category || category.includes('[')) {
    category = 'Digital Marketing';
    warnings.push('No category found — defaulted to "Digital Marketing".');
  }

  if (bodyParts.length === 0) {
    warnings.push('No body content found between the title and the FAQ section.');
  }
  if (faqItems.length === 0) {
    warnings.push('No FAQ questions found.');
  }

  const bodyHtml = bodyParts.join('');
  const leftoverBrackets = (bodyHtml.match(/\[[^\]]{1,60}\]/g) || []).slice(0, 5);
  if (leftoverBrackets.length > 0) {
    warnings.push(`Possible unfilled placeholders left in the body: ${leftoverBrackets.join(', ')}`);
  }

  return {
    title,
    slug,
    metaTitle,
    metaDescription,
    category,
    bodyHtml,
    faqItems,
    embeddedImage,
    suggestedImage,
    warnings,
  };
}
