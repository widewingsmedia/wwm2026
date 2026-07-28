import type { NextConfig } from "next";

// Current live service slugs — the app/services/<slug> folder names match these exactly.
const SERVICE_SLUGS = [
  'branding-agency-dubai',
  'web-design-company-dubai',
  'ppc-advertising-company-dubai',
  'social-media-marketing-agency-in-dubai',
  'content-creation-graphic-design',
  'email-marketing-dubai',
  'seo-services-dubai',
  'outdoor-advertising-dubai',
  'analytics-performance-marketing',
  'pr-agency-dubai',
];

// Retired slugs (short pre-launch slugs + old wide-wings.ae slugs), redirected to the current slugs above.
const LEGACY_SERVICE_REDIRECTS: Record<string, string> = {
  'web-app-development': 'web-design-company-dubai',
  'paid-advertising': 'ppc-advertising-company-dubai',
  'social-media-management': 'social-media-marketing-agency-in-dubai',
  'content-creation': 'content-creation-graphic-design',
  'email-sms-crm': 'email-marketing-dubai',
  'seo-performance': 'seo-services-dubai',
  'ooh-advertising': 'outdoor-advertising-dubai',
  'analytics-performance': 'analytics-performance-marketing',
  // Renamed for SEO (recommended URL changes, 2026-07-25)
  'creative-branding': 'branding-agency-dubai',
  'email-sms-crm-marketing': 'email-marketing-dubai',
  'pr-management': 'pr-agency-dubai',
  // Orphan slugs referenced internally on the old wide-wings.ae site (breadcrumbs/links)
  // but never matching that site's own canonical page slug — redirect so old inbound links don't 404.
  'outdoor-advertising': 'outdoor-advertising-dubai',
  'social-media-services': 'social-media-marketing-agency-in-dubai',
  'creative-services': 'branding-agency-dubai',
};

const nextConfig: NextConfig = {
  trailingSlash: true,
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: `/:slug(${SERVICE_SLUGS.join('|')})`,
          destination: '/services/:slug',
        },
      ],
      fallback: [
        { source: '/:slug', destination: '/blogs/:slug' },
      ],
    };
  },
  async redirects() {
    return [
      ...Object.entries(LEGACY_SERVICE_REDIRECTS).map(([from, to]) => ({
        source: `/${from}`,
        destination: `/${to}/`,
        permanent: true,
      })),
      { source: '/services', destination: '/digital-marketing-services/', permanent: true },
      { source: '/services/:slug', destination: '/:slug/', permanent: true },
      { source: '/blogs', destination: '/insights/', permanent: true },
      { source: '/blogs/:slug', destination: '/:slug/', permanent: true },
      { source: '/case-studies/sbk-properties', destination: '/case-studies/batterjee-properties/', permanent: true },
    ];
  },
};

export default nextConfig;
