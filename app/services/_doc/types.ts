// Content model for the copy-driven service pages (see ServiceDocPage.tsx).
// Inline strings support [label](href) links, **bold** and line breaks (\n).

export type Cta = { label: string; href: string };

export type Block =
  | { p: string }
  | { ul: string[] }
  | { ol: string[] }
  | { h3: string; blocks: Block[] }
  | { steps: { title: string; body: string }[] }
  | { cta: Cta[] }
  | { table: string[][] };

export type Section = { h2: string; blocks: Block[] };

export type ServiceDoc = {
  /** SEO Manager page id (lib/admin/store.ts) */
  pageId: string;
  /** public path, with trailing slash */
  path: string;
  /** last breadcrumb label */
  crumb: string;
  /** middle breadcrumb; defaults to Services. null = Home › page */
  parent?: Cta | null;
  h1: string;
  tagline?: string;
  intro: Block[];
  sections: Section[];
  /** JSON-LD blocks supplied with the copy */
  schema: Record<string, unknown>[];
};
