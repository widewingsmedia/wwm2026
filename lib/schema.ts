// JSON-LD schema markup replicated verbatim from wide-wings.ae (the legacy site),
// scraped via scripts/scrape-old-site-seo.mjs into lib/seo/old-site-data.json.
import oldSiteData from './seo/old-site-data.json';

type OldSitePage = {
  slug: string;
  url: string;
  ldJson: Record<string, unknown>[];
};

// The first ld+json block is identical on every old-site page — rendered once,
// sitewide, in app/layout.tsx instead of repeating it on every page.
export const SITEWIDE_SCHEMA = (oldSiteData as Record<string, OldSitePage>).home.ldJson[0];

// Hand-authored schema for pages that don't exist on the old site (new/rewritten
// blog posts) — takes priority over the scraped old-site data below.
const CUSTOM_SCHEMA: Record<string, Record<string, unknown>[]> = {
  'best-time-to-post-on-instagram-in-uae': [
    {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'BlogPosting',
          mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': 'https://wide-wings.ae/best-time-to-post-on-instagram-in-uae/',
          },
          headline: 'Best Time to Post on Instagram in UAE: 2026 Posting Guide',
          description: 'Discover the best time to post on Instagram in the UAE in 2026, including weekday and weekend posting windows, Reels timing, Stories timing, and Instagram Insights testing strategies.',
          image: 'https://wide-wings.ae/blog/best-time-to-post-on-instagram-in-uae.webp',
          author: { '@type': 'Organization', name: 'Wide Wings Media' },
          publisher: {
            '@type': 'Organization',
            name: 'Wide Wings Media',
            logo: { '@type': 'ImageObject', url: 'https://wide-wings.ae/Logoblack.webp' },
          },
          datePublished: '2026-08-12',
          dateModified: '2026-08-12',
          articleSection: 'Social Media Marketing',
          keywords: [
            'best time to post on Instagram in UAE',
            'Instagram posting time UAE',
            'best time to post Instagram Reels UAE',
            'Instagram marketing UAE',
          ],
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://wide-wings.ae/' },
            { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://wide-wings.ae/insights/' },
            { '@type': 'ListItem', position: 3, name: 'Best Time to Post on Instagram in UAE: 2026 Posting Guide', item: 'https://wide-wings.ae/best-time-to-post-on-instagram-in-uae/' },
          ],
        },
        {
          '@type': 'FAQPage',
          mainEntity: [
            {
              '@type': 'Question',
              name: 'What time is the best time to post on Instagram in the UAE?',
              acceptedAnswer: { '@type': 'Answer', text: 'Evening hours between 7:00 PM and 9:00 PM are the strongest starting point for many UAE accounts. Weekday lunch hours between 12:00 PM and 2:00 PM are also worth testing.' },
            },
            {
              '@type': 'Question',
              name: 'How do I find the best time to post on Instagram for my account?',
              acceptedAnswer: { '@type': 'Answer', text: 'Use Instagram Insights to check when your followers are active, test multiple posting windows, and compare reach, shares, saves, watch time, clicks, and enquiries.' },
            },
            {
              '@type': 'Question',
              name: 'What is the best time to post on Instagram?',
              acceptedAnswer: { '@type': 'Answer', text: 'There is no universal best time. Start with lunch and evening hours, then adjust the schedule based on your industry, audience location, content type, and account analytics.' },
            },
            {
              '@type': 'Question',
              name: 'What is the best day and time to post on Instagram?',
              acceptedAnswer: { '@type': 'Answer', text: 'Tuesday, Wednesday, and Thursday are strong starting days for important content, with Wednesday lunch hours and weekday evenings being particularly useful testing periods.' },
            },
            {
              '@type': 'Question',
              name: 'What is the best time to post a video on Instagram?',
              acceptedAnswer: { '@type': 'Answer', text: 'Start by posting videos and Reels between 7:00 PM and 10:00 PM UAE time, and test later evening slots for Friday and weekend content.' },
            },
          ],
        },
      ],
    },
  ],
  'digital-marketing-strategies-for-smes': [
    {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'BlogPosting',
          mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': 'https://wide-wings.ae/digital-marketing-strategies-for-smes/',
          },
          headline: 'Digital Marketing for SMEs in Dubai: Strategies That Work in 2026',
          description: 'Discover practical digital marketing strategies for SMEs in Dubai in 2026, including SEO, AI search, social media, WhatsApp marketing, paid advertising, and growth-focused marketing planning.',
          image: 'https://wide-wings.ae/blog/digital-marketing-strategies-for-smes.webp',
          author: { '@type': 'Organization', name: 'Wide Wings Media' },
          publisher: {
            '@type': 'Organization',
            name: 'Wide Wings Media',
            logo: { '@type': 'ImageObject', url: 'https://wide-wings.ae/Logoblack.webp' },
          },
          datePublished: '2026-08-12',
          dateModified: '2026-08-12',
          articleSection: 'Digital Marketing',
          keywords: [
            'digital marketing for SMEs in Dubai',
            'digital marketing strategy Dubai',
            'SEO for small businesses Dubai',
            'social media marketing Dubai',
            'WhatsApp marketing UAE',
            'paid advertising Dubai',
          ],
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://wide-wings.ae/' },
            { '@type': 'ListItem', position: 2, name: 'Insights', item: 'https://wide-wings.ae/insights/' },
            { '@type': 'ListItem', position: 3, name: 'Digital Marketing for SMEs in Dubai: Strategies That Work in 2026', item: 'https://wide-wings.ae/digital-marketing-strategies-for-smes/' },
          ],
        },
      ],
    },
  ],
  'image-optimization-tips': [
    {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'BlogPosting',
          mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': 'https://wide-wings.ae/image-optimization-tips/',
          },
          headline: 'Boost Website Traffic: Image Optimization Guide for Bloggers',
          alternativeHeadline: 'Image Optimization Tips for Faster Websites and Better SEO',
          description: 'Follow this practical image optimization workflow using AVIF, WebP, responsive sizing, Core Web Vitals, alt text and visual search best practices.',
          image: 'https://wide-wings.ae/blog/image-optimization-tips.webp',
          author: { '@type': 'Organization', name: 'Wide Wings Media' },
          publisher: {
            '@type': 'Organization',
            name: 'Wide Wings Media',
            logo: { '@type': 'ImageObject', url: 'https://wide-wings.ae/Logoblack.webp' },
          },
          datePublished: '2026-08-12',
          dateModified: '2026-08-12',
          articleSection: 'SEO',
          keywords: [
            'image optimization',
            'image SEO',
            'Core Web Vitals',
            'WebP',
            'AVIF',
            'website speed optimization',
            'visual search optimization',
          ],
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://wide-wings.ae/' },
            { '@type': 'ListItem', position: 2, name: 'Insights', item: 'https://wide-wings.ae/insights/' },
            { '@type': 'ListItem', position: 3, name: 'Boost Website Traffic: Image Optimization Guide for Bloggers', item: 'https://wide-wings.ae/image-optimization-tips/' },
          ],
        },
      ],
    },
  ],
  'ai-trend': [
    {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'BlogPosting',
          mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': 'https://wide-wings.ae/ai-trend/',
          },
          headline: 'AI Trends in the UAE: What Businesses Should Watch in 2026',
          description: 'Explore the most important AI trends in the UAE for 2026, including agentic AI, bilingual AI, intelligent automation, AI governance, and practical adoption strategies for businesses.',
          image: 'https://wide-wings.ae/blog/ai-trend.webp',
          author: { '@type': 'Organization', name: 'Wide Wings Media' },
          publisher: {
            '@type': 'Organization',
            name: 'Wide Wings Media',
            logo: { '@type': 'ImageObject', url: 'https://wide-wings.ae/Logoblack.webp' },
          },
          datePublished: '2026-08-12',
          dateModified: '2026-08-12',
          articleSection: 'Artificial Intelligence',
          keywords: [
            'AI trends UAE',
            'artificial intelligence UAE',
            'agentic AI UAE',
            'AI automation UAE',
            'AI governance UAE',
            'UAE AI strategy',
            'bilingual AI UAE',
          ],
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://wide-wings.ae/' },
            { '@type': 'ListItem', position: 2, name: 'Insights', item: 'https://wide-wings.ae/insights/' },
            { '@type': 'ListItem', position: 3, name: 'AI Trends in the UAE: What Businesses Should Watch in 2026', item: 'https://wide-wings.ae/ai-trend/' },
          ],
        },
      ],
    },
  ],
  'how-to-build-trust-with-online-reviews-in-the-uae': [
    {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'BlogPosting',
          '@id': 'https://wide-wings.ae/how-to-build-trust-with-online-reviews-in-the-uae/#blogposting',
          mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': 'https://wide-wings.ae/how-to-build-trust-with-online-reviews-in-the-uae/',
          },
          headline: 'How to Build Trust with Online Reviews in the UAE',
          description: 'Learn how UAE businesses can use online reviews to build trust, strengthen local SEO, manage reputation, improve customer experience, and support conversions.',
          image: 'https://wide-wings.ae/blog/power-of-reputation-management.webp',
          author: { '@type': 'Person', name: 'Doha' },
          publisher: {
            '@type': 'Organization',
            name: 'Wide Wings Media',
            url: 'https://wide-wings.ae/',
            logo: { '@type': 'ImageObject', url: 'https://wide-wings.ae/Logoblack.webp' },
          },
          datePublished: '2026-08-17',
          dateModified: '2026-08-17',
          articleSection: 'Online Reputation Management',
          inLanguage: 'en',
        },
        {
          '@type': 'BreadcrumbList',
          '@id': 'https://wide-wings.ae/how-to-build-trust-with-online-reviews-in-the-uae/#breadcrumb',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://wide-wings.ae/' },
            { '@type': 'ListItem', position: 2, name: 'Insights', item: 'https://wide-wings.ae/insights/' },
            { '@type': 'ListItem', position: 3, name: 'How to Build Trust with Online Reviews in the UAE', item: 'https://wide-wings.ae/how-to-build-trust-with-online-reviews-in-the-uae/' },
          ],
        },
        {
          '@type': 'FAQPage',
          '@id': 'https://wide-wings.ae/how-to-build-trust-with-online-reviews-in-the-uae/#faq',
          mainEntity: [
            { '@type': 'Question', name: 'How can UAE businesses ask customers for reviews without sounding pushy?', acceptedAnswer: { '@type': 'Answer', text: 'Keep the request short, personal, and timely. Ask shortly after a positive experience and provide a direct review link. WhatsApp, SMS, email, and QR codes can all work when used naturally.' } },
            { '@type': 'Question', name: 'What is the best platform for reviews in Dubai?', acceptedAnswer: { '@type': 'Answer', text: 'For most businesses targeting local customers, Google Business Profile should be the first priority because customers frequently use Google Search and Maps to discover and compare local businesses. Other platforms such as Facebook, Tripadvisor, booking platforms, and niche directories should be prioritized according to the industry.' } },
            { '@type': 'Question', name: 'Should businesses reply to every review?', acceptedAnswer: { '@type': 'Answer', text: 'Businesses should aim to respond consistently to reviews, especially negative reviews and detailed customer feedback. Responses show that the business is listening and give customers another trust signal.' } },
            { '@type': 'Question', name: 'How fast should a business respond to negative reviews?', acceptedAnswer: { '@type': 'Answer', text: 'As soon as reasonably possible. A defined internal process helps prevent negative feedback from sitting unanswered for days. The response should be calm, professional, and focused on resolving the issue rather than defending the brand.' } },
            { '@type': 'Question', name: 'Can review snippets improve local SEO or conversions?', acceptedAnswer: { '@type': 'Answer', text: 'Review content can strengthen trust and support conversions when displayed appropriately on relevant pages. Structured data can also help search engines understand eligible content, but businesses should not assume that adding review schema automatically produces star ratings in search results.' } },
            { '@type': 'Question', name: 'How do clinics, restaurants, and agencies ask for reviews differently?', acceptedAnswer: { '@type': 'Answer', text: 'The timing and prompt should match the customer experience. Clinics can ask after a completed appointment, restaurants after a positive dining experience, and agencies after a successful project milestone or clear result. The request should encourage honest feedback rather than scripted praise.' } },
            { '@type': 'Question', name: 'What should a business do about fake or unfair reviews?', acceptedAnswer: { '@type': 'Answer', text: "Monitor reviews regularly, identify suspicious patterns, document the issue, and use the platform's reporting process when a review genuinely violates its policies. Avoid publicly accusing reviewers of being fake or AI-generated. Keep responses professional and use an internal escalation process for serious reputation issues." } },
          ],
        },
      ],
    },
  ],
  'why-seo-matters': [
    {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'BlogPosting',
          '@id': 'https://wide-wings.ae/why-seo-matters/#blogposting',
          mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': 'https://wide-wings.ae/why-seo-matters/',
          },
          headline: 'Why SEO Will Still Matter in the UAE in 2026',
          description: 'Discover why SEO still matters for UAE businesses in 2026, including AI search, GEO, local SEO, bilingual SEO, technical SEO, structured data, trust, and conversions.',
          image: 'https://wide-wings.ae/blog/systematic-search-engine-optimization.webp',
          author: { '@type': 'Person', name: 'Doha' },
          publisher: {
            '@type': 'Organization',
            name: 'Wide Wings Media',
            url: 'https://wide-wings.ae/',
            logo: { '@type': 'ImageObject', url: 'https://wide-wings.ae/Logoblack.webp' },
          },
          datePublished: '2026-08-17',
          dateModified: '2026-08-17',
          articleSection: 'SEO',
          inLanguage: 'en',
        },
        {
          '@type': 'BreadcrumbList',
          '@id': 'https://wide-wings.ae/why-seo-matters/#breadcrumb',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://wide-wings.ae/' },
            { '@type': 'ListItem', position: 2, name: 'Insights', item: 'https://wide-wings.ae/insights/' },
            { '@type': 'ListItem', position: 3, name: 'Why SEO Will Still Matter in the UAE in 2026', item: 'https://wide-wings.ae/why-seo-matters/' },
          ],
        },
        {
          '@type': 'FAQPage',
          '@id': 'https://wide-wings.ae/why-seo-matters/#faq',
          mainEntity: [
            { '@type': 'Question', name: 'Does SEO still work for businesses in the UAE in 2026?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. SEO remains valuable because customers still use search engines, Maps, AI-powered search features, and other discovery platforms to research businesses. However, effective SEO now goes beyond keyword rankings and also involves useful content, technical accessibility, local relevance, trust, structured information, and conversion optimization.' } },
            { '@type': 'Question', name: 'How is GEO different from traditional SEO?', acceptedAnswer: { '@type': 'Answer', text: 'GEO focuses on visibility in AI-generated search experiences, while traditional SEO focuses heavily on visibility in search engine results. The two approaches overlap because useful content, strong technical foundations, clear business information, and trustworthy sources can support visibility across both traditional and AI-powered search.' } },
            { '@type': 'Question', name: 'Is bilingual SEO important for businesses in the UAE?', acceptedAnswer: { '@type': 'Answer', text: 'Yes, for many UAE businesses. Using both Arabic and English can help businesses reach different search audiences, but the two languages should not simply be translated versions of each other. Keyword research, localization, terminology, and search behavior should be considered separately.' } },
            { '@type': 'Question', name: 'Why is local SEO important for UAE businesses?', acceptedAnswer: { '@type': 'Answer', text: 'Local SEO helps businesses become more visible when customers are looking for nearby services, locations, products, or businesses. Accurate Google Business Profiles, location pages, reviews, services, photos, and consistent contact information can make it easier for customers to discover a business and take action.' } },
            { '@type': 'Question', name: 'Does technical SEO still matter with the rise of AI search?', acceptedAnswer: { '@type': 'Answer', text: "Yes. The rise of AI search does not replace the need for a technically accessible website. Crawlability, indexation, mobile usability, site structure, internal linking, page performance, and structured data can help search engines understand and access a website's content effectively." } },
            { '@type': 'Question', name: 'Can SEO generate business results beyond website traffic?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. SEO can contribute to calls, bookings, enquiries, WhatsApp conversations, consultations, store visits, and purchases when organic visitors reach useful, conversion-focused pages. For this reason, businesses should measure conversions from organic traffic rather than judging SEO success only by rankings or visitor numbers.' } },
          ],
        },
      ],
    },
  ],
  'digital-marketing-trends-uae': [
    {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'BlogPosting',
          '@id': 'https://wide-wings.ae/digital-marketing-trends-uae/#blogposting',
          mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': 'https://wide-wings.ae/digital-marketing-trends-uae/',
          },
          headline: 'Digital Marketing Trends in the UAE: What Businesses Need to Do in 2026',
          description: 'Explore the key digital marketing trends shaping the UAE in 2026, including social search, AI visibility, GEO, bilingual SEO, WhatsApp marketing, creator content, first-party data, paid media, and performance measurement.',
          image: 'https://wide-wings.ae/blog/digital-marketing-strategy-for-b2bs.webp',
          author: { '@type': 'Organization', name: 'Wide Wings Media' },
          publisher: {
            '@type': 'Organization',
            name: 'Wide Wings Media',
            url: 'https://wide-wings.ae/',
            logo: { '@type': 'ImageObject', url: 'https://wide-wings.ae/Logoblack.webp' },
          },
          datePublished: '2026-08-17',
          dateModified: '2026-08-17',
          articleSection: 'Digital Marketing',
          keywords: [
            'digital marketing trends UAE',
            'digital marketing UAE 2026',
            'SEO UAE',
            'GEO UAE',
            'AI search UAE',
            'social media marketing UAE',
            'WhatsApp marketing UAE',
            'bilingual SEO UAE',
            'local SEO UAE',
          ],
          inLanguage: 'en-AE',
        },
        {
          '@type': 'BreadcrumbList',
          '@id': 'https://wide-wings.ae/digital-marketing-trends-uae/#breadcrumb',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://wide-wings.ae/' },
            { '@type': 'ListItem', position: 2, name: 'Insights', item: 'https://wide-wings.ae/insights/' },
            { '@type': 'ListItem', position: 3, name: 'Digital Marketing Trends in the UAE: What Businesses Need to Do in 2026', item: 'https://wide-wings.ae/digital-marketing-trends-uae/' },
          ],
        },
        {
          '@type': 'FAQPage',
          '@id': 'https://wide-wings.ae/digital-marketing-trends-uae/#faq',
          mainEntity: [
            { '@type': 'Question', name: 'How does Generative Engine Optimization (GEO) differ from traditional SEO for UAE businesses?', acceptedAnswer: { '@type': 'Answer', text: 'GEO focuses on optimizing content to be understood and potentially cited in AI-generated answers such as Google AI Overviews and other generative search experiences. Traditional SEO focuses more heavily on ranking in conventional search results. For UAE businesses, GEO requires clear answers, strong entity relationships, consistent business information, and useful content that AI systems can understand and synthesize.' } },
            { '@type': 'Question', name: 'Why should UAE companies prioritize WhatsApp over traditional website landing pages for conversions?', acceptedAnswer: { '@type': 'Answer', text: 'WhatsApp can shorten the journey between discovery and enquiry. Instead of completing a long form or navigating several pages, customers can start a direct conversation with the business. Click-to-WhatsApp ads, automated qualification questions, and CRM follow-ups can make this especially useful for UAE service businesses where customers often prefer quick, direct communication.' } },
            { '@type': 'Question', name: 'Is translating English website content into Arabic sufficient for bilingual SEO in the UAE?', acceptedAnswer: { '@type': 'Answer', text: 'No. Direct translation does not always reflect how Arabic-speaking customers search. UAE search behavior can include different search intent, regional terminology, transliterations, and mixed Arabic-English queries. Effective bilingual SEO requires independent keyword research and localized landing pages that match how each audience actually searches.' } },
            { '@type': 'Question', name: 'How do privacy laws in the UAE affect digital marketing strategies and lead generation?', acceptedAnswer: { '@type': 'Answer', text: 'Businesses need to handle personal data responsibly and follow applicable requirements under UAE data-protection law. Marketing teams should collect only the information they need, explain how it will be used, protect customer data, and obtain the appropriate consent or opt-in where required. This makes compliant first-party data collection through CRM systems, forms, newsletters, and WhatsApp particularly important.' } },
            { '@type': 'Question', name: 'What is the best way to track offline or WhatsApp sales back to digital ad spend?', acceptedAnswer: { '@type': 'Answer', text: 'Connect advertising platforms and analytics with a centralized CRM wherever possible. Use UTM parameters, campaign identifiers, lead-source fields, and consistent conversion tracking to connect enquiries with their original marketing source. When a WhatsApp or offline lead becomes a customer, recording that outcome in the CRM helps businesses understand which campaigns are actually generating revenue rather than measuring only clicks and form submissions.' } },
          ],
        },
      ],
    },
  ],
  'newsletters-that-convert': [
    {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'BlogPosting',
          '@id': 'https://wide-wings.ae/newsletters-that-convert/#blogposting',
          mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': 'https://wide-wings.ae/newsletters-that-convert/',
          },
          headline: 'Newsletters That Convert: Best Practices for UAE Marketers',
          description: 'Discover newsletter best practices for UAE marketers, including segmentation, bilingual email journeys, automation, privacy, mobile design, cross-channel marketing, and performance measurement.',
          image: 'https://wide-wings.ae/blog/content-repurposing.webp',
          author: { '@type': 'Person', name: 'Doha' },
          publisher: {
            '@type': 'Organization',
            name: 'Wide Wings Media',
            url: 'https://wide-wings.ae/',
            logo: { '@type': 'ImageObject', url: 'https://wide-wings.ae/Logoblack.webp' },
          },
          datePublished: '2026-08-17',
          dateModified: '2026-08-17',
          articleSection: 'Email Marketing',
          inLanguage: 'en',
        },
        {
          '@type': 'BreadcrumbList',
          '@id': 'https://wide-wings.ae/newsletters-that-convert/#breadcrumb',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://wide-wings.ae/' },
            { '@type': 'ListItem', position: 2, name: 'Insights', item: 'https://wide-wings.ae/insights/' },
            { '@type': 'ListItem', position: 3, name: 'Newsletters That Convert: Best Practices for UAE Marketers', item: 'https://wide-wings.ae/newsletters-that-convert/' },
          ],
        },
        {
          '@type': 'FAQPage',
          '@id': 'https://wide-wings.ae/newsletters-that-convert/#faq',
          mainEntity: [
            { '@type': 'Question', name: 'Should I send separate Arabic and English newsletters or one bilingual email?', acceptedAnswer: { '@type': 'Answer', text: 'Separate language versions are usually more effective when your subscriber base is large enough to justify them. Segmenting subscribers by language preference allows businesses to use appropriate RTL formatting, native copywriting, and culturally relevant messaging. It can also prevent emails from becoming unnecessarily long or causing mobile layout issues.' } },
            { '@type': 'Question', name: 'How does the UAE Personal Data Protection Law affect email marketing?', acceptedAnswer: { '@type': 'Answer', text: 'The UAE Personal Data Protection Law can affect how businesses collect, process, and use subscriber data for marketing. Businesses should establish an appropriate legal basis, clearly explain how personal data will be used, maintain relevant consent records where consent is relied upon, identify the sender, and provide an accessible way for recipients to unsubscribe from marketing communications.' } },
            { '@type': 'Question', name: 'How should email send times be adjusted during Ramadan in the UAE?', acceptedAnswer: { '@type': 'Answer', text: 'Email send times should be tested around the changed routines during Ramadan rather than relying on standard business-hour schedules. For some audiences, engagement may be stronger after Iftar or later in the evening, while other audiences may respond at different times. Use your own engagement and conversion data to identify the most effective windows.' } },
            { '@type': 'Question', name: 'How can UAE brands integrate email newsletters with WhatsApp marketing effectively?', acceptedAnswer: { '@type': 'Answer', text: 'Use email and WhatsApp for different stages of the customer journey. Email works well for detailed content, educational resources, product information, and longer nurture sequences, while WhatsApp can support more immediate interactions such as appointment reminders, booking-related communication, delivery updates, or relevant follow-ups where appropriate and permitted.' } },
            { '@type': 'Question', name: 'Which email marketing metrics are most important besides open rates?', acceptedAnswer: { '@type': 'Answer', text: 'Conversion-focused metrics are generally more useful than open rates alone. Track click-through rate, conversions, qualified leads, purchases, revenue influenced, unsubscribe rates, deliverability, and list growth. These metrics provide a clearer picture of whether newsletters are generating meaningful business results rather than simply being opened.' } },
            { '@type': 'Question', name: 'What are the best automated email sequences for B2B and healthcare brands in the UAE?', acceptedAnswer: { '@type': 'Answer', text: 'Welcome, lead-nurturing, post-conversion, and re-engagement sequences are useful starting points for both sectors. Healthcare brands may use appropriate follow-ups, educational communication, or appointment-related reminders, while B2B brands can use educational sequences, case studies, and content triggered by relevant actions to help prospects move through the buying journey.' } },
          ],
        },
      ],
    },
  ],
};

// Returns the page-specific ld+json block(s) for a given key. Checks the
// hand-authored CUSTOM_SCHEMA first, then falls back to the scraped old-site
// data (everything after the sitewide block), or an empty array if missing.
export function getPageSchema(key: string): Record<string, unknown>[] {
  if (CUSTOM_SCHEMA[key]) return CUSTOM_SCHEMA[key];
  const page = (oldSiteData as Record<string, OldSitePage>)[key];
  if (!page || !page.ldJson || page.ldJson.length < 2) return [];
  return page.ldJson.slice(1);
}
