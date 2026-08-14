// In-memory store — replace with a real DB (Supabase, Neon, etc.) for production
import { POSTS } from '@/app/blogs/posts-data';
import { loadEvents, saveEvents } from './chat-persist';

export interface MediaItem {
  id: string;
  name: string;
  fileType: 'image' | 'video' | 'pdf' | 'other';
  mimeType: string;
  url: string;           // data URL for images, external URL for video/pdf
  sizeBytes: number;
  altText: string;
  keywords: string;
  uploadedAt: string;
  source?: 'public' | 'upload'; // 'public' = from /public dir, 'upload' = user-uploaded
  folder?: string;               // display group e.g. "Blog Images", "Site Assets"
}

export interface Page {
  id: string;
  title: string;
  slug: string;
  content: string;
  status: 'published' | 'draft';
  createdAt: string;
  updatedAt: string;
}

export interface SeoData {
  pageId: string;
  pageTitle: string;
  slug: string;
  metaTitle: string;
  metaDescription: string;
  focusKeyword: string;
  secondaryKeywords: string;
  canonicalUrl: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  twitterCard: 'summary' | 'summary_large_image';
  robots: string;
  schemaType: string;
  featuredImage: string;
  featuredImageAlt: string;
  noindex: boolean;
  nofollow: boolean;
  updatedAt: string;
}

export interface Redirect {
  id: string;
  from: string;
  to: string;
  type: '301' | '302';
  createdAt: string;
}

export interface Enquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
  status: 'new' | 'read';
  receivedAt: string;
}

export interface ChatEvent {
  id: string;
  event: 'widget_open' | 'option_click' | 'topic_view' | 'external_link';
  label: string;       // human-readable: option echo text, topic key, or URL
  page: string;        // page pathname where the event happened
  sessionId: string;   // anonymous session ID (random, stored in sessionStorage)
  timestamp: string;   // ISO 8601
}

const pages: Page[] = [
  // Static pages
  { id: 'home', title: 'Home', slug: '/', content: '', status: 'published', createdAt: '2025-01-01', updatedAt: '2026-06-01' },
  { id: 'about-us', title: 'About Us', slug: '/about-us', content: '', status: 'published', createdAt: '2025-01-01', updatedAt: '2026-06-10' },
  { id: 'contact', title: 'Contact', slug: '/contact', content: '', status: 'published', createdAt: '2025-01-01', updatedAt: '2026-06-05' },
  { id: 'thank-you', title: 'Thank You', slug: '/contact/thank-you', content: '', status: 'published', createdAt: '2026-07-10', updatedAt: '2026-07-10' },
  { id: 'services', title: 'Services', slug: '/digital-marketing-services/', content: '', status: 'published', createdAt: '2025-01-01', updatedAt: '2026-06-21' },
  { id: 'blogs', title: 'Blogs', slug: '/insights/', content: '', status: 'published', createdAt: '2025-01-01', updatedAt: '2026-06-21' },
  { id: 'news', title: 'News', slug: '/news', content: '', status: 'published', createdAt: '2025-01-01', updatedAt: '2026-06-21' },
  { id: 'privacy-policy', title: 'Privacy Policy', slug: '/privacy-policy', content: '', status: 'published', createdAt: '2025-01-01', updatedAt: '2026-06-21' },
  { id: 'terms-conditions', title: 'Terms & Conditions', slug: '/terms-conditions', content: '', status: 'published', createdAt: '2025-01-01', updatedAt: '2026-06-21' },
  // Service detail pages (URLs match old wide-wings.ae slugs)
  { id: 'web-app-development', title: 'Web & App Development', slug: '/web-design-company-dubai/', content: '', status: 'published', createdAt: '2025-01-01', updatedAt: '2026-06-21' },
  { id: 'creative-branding', title: 'Creative & Branding', slug: '/branding-agency-dubai/', content: '', status: 'published', createdAt: '2025-01-01', updatedAt: '2026-07-25' },
  { id: 'paid-advertising', title: 'Paid Advertising & Media Buying', slug: '/ppc-advertising-company-dubai/', content: '', status: 'published', createdAt: '2025-01-01', updatedAt: '2026-06-21' },
  { id: 'social-media-management', title: 'Social Media Management', slug: '/social-media-marketing-agency-in-dubai/', content: '', status: 'published', createdAt: '2025-01-01', updatedAt: '2026-06-21' },
  { id: 'content-creation', title: 'Content Creation & Graphic Design', slug: '/content-creation-graphic-design/', content: '', status: 'published', createdAt: '2025-01-01', updatedAt: '2026-06-21' },
  { id: 'email-sms-crm', title: 'Email, SMS & CRM Marketing', slug: '/email-marketing-dubai/', content: '', status: 'published', createdAt: '2025-01-01', updatedAt: '2026-07-25' },
  { id: 'seo-performance', title: 'SEO & Performance Management', slug: '/seo-services-dubai/', content: '', status: 'published', createdAt: '2025-01-01', updatedAt: '2026-06-21' },
  { id: 'ooh-advertising', title: 'OOH Advertising', slug: '/outdoor-advertising-dubai/', content: '', status: 'published', createdAt: '2025-01-01', updatedAt: '2026-06-21' },
  { id: 'analytics-performance', title: 'Analytics & Performance Marketing', slug: '/analytics-performance-marketing/', content: '', status: 'published', createdAt: '2025-01-01', updatedAt: '2026-06-21' },
  { id: 'pr-management', title: 'PR Management', slug: '/pr-agency-dubai/', content: '', status: 'published', createdAt: '2025-01-01', updatedAt: '2026-07-25' },
];

// SEO metadata fetched from the corresponding pages on the legacy wide-wings.ae
// site so search rankings transfer cleanly when the domain points here.
function makeSeo(
  pageId: string,
  pageTitle: string,
  slug: string,
  metaTitle: string,
  metaDescription: string,
  schemaType: string = 'WebPage',
): SeoData {
  return {
    pageId, pageTitle, slug,
    metaTitle, metaDescription,
    focusKeyword: '', secondaryKeywords: '',
    canonicalUrl: `https://wide-wings.ae${slug}`,
    ogTitle: metaTitle, ogDescription: metaDescription,
    ogImage: '', featuredImage: '', featuredImageAlt: '',
    twitterCard: 'summary_large_image',
    robots: 'index, follow',
    schemaType,
    noindex: false, nofollow: false,
    updatedAt: '2026-06-29',
  };
}

const seoData: SeoData[] = [
  {
    ...makeSeo('home', 'Home', '/',
      'Wide Wings Media: Leading Digital Marketing Agency in Dubai',
      'Achieve rapid growth across all media platforms with Wide Wings Media, your premier digital marketing agency in Dubai, UAE.',
      'Organization'),
    focusKeyword: 'digital marketing agency Dubai',
    secondaryKeywords: 'marketing agency UAE, digital marketing Dubai, social media marketing Dubai, SEO agency Dubai',
    ogImage: '/Logoblack.webp',
    featuredImage: '/Logoblack.webp',
    featuredImageAlt: 'Wide Wings Media — Leading Digital Marketing Agency in Dubai, UAE',
  },
  {
    ...makeSeo('about-us', 'About Us', '/about-us',
      'About Wide Wings Media – Full-Service Digital Marketing Agency Dubai',
      "Wide Wings Media is a fully in-house digital marketing company in Dubai with 50+ specialists. Google & Meta verified partner operating across 15+ industries in UAE and GCC. 4.9/5 average client rating.",
      'Organization'),
    focusKeyword: 'Wide Wings Media Dubai',
    secondaryKeywords: 'digital marketing agency about, in-house digital agency UAE, Google partner Dubai, Meta partner UAE, marketing specialists Dubai',
    ogTitle: "About Wide Wings Media – Dubai's Leading Digital Marketing Agency",
    ogDescription: "Meet the team behind Dubai's top-ranked digital marketing agency. 50+ specialists, Google & Meta verified, 15+ industries served.",
    ogImage: '/og-about.jpg',
    featuredImage: '/og-about.jpg',
    featuredImageAlt: 'Wide Wings Media team Dubai',
  },
  {
    ...makeSeo('contact', 'Contact', '/contact',
      'Contact Wide Wings Media – Digital Marketing Agency Dubai',
      "Get in touch with Wide Wings Media, Dubai's leading digital marketing agency. Office: Al Quoz Industrial Area 3, Dubai, UAE. Phone: +971 4 335 2645. Free consultation available.",
      'LocalBusiness'),
    focusKeyword: 'contact digital marketing agency Dubai',
    secondaryKeywords: 'Wide Wings Media contact, digital marketing consultation Dubai, marketing agency Al Quoz Dubai, free marketing consultation UAE',
    ogTitle: 'Contact Wide Wings Media – Free Digital Marketing Consultation',
    ogDescription: "Speak to Dubai's leading digital marketing team. Free consultation for SEO, paid ads, social media & web development.",
    ogImage: '/og-contact.jpg',
    featuredImage: '/og-contact.jpg',
    featuredImageAlt: 'Wide Wings Media office Al Quoz Dubai',
  },
  {
    ...makeSeo('thank-you', 'Thank You', '/contact/thank-you',
      'Thank You | Wide Wings Media',
      'Thank you for contacting Wide Wings Media. Our team will review your enquiry and get back to you within 24 hours.'),
    // Post-submission page — never index thank-you pages
    robots: 'noindex, follow',
    noindex: true,
  },
  {
    ...makeSeo('services', 'Services', '/digital-marketing-services/',
      'Boost ROI with Data-Driven Digital Marketing Services in Dubai',
      'Wide Wings Media offers full-service digital marketing in Dubai — SEO, paid advertising, social media management, content creation, web development, OOH advertising, and PR. Data-driven strategies that deliver measurable ROI across UAE and GCC.',
      'Service'),
    focusKeyword: 'digital marketing services Dubai',
    secondaryKeywords: 'data-driven digital marketing UAE, SEO services Dubai, paid advertising Dubai, social media management UAE, content creation Dubai, web development UAE, OOH advertising Dubai, performance marketing GCC, PR management Dubai',
    ogImage: '/og-services.jpg',
    featuredImage: '/og-services.jpg',
    featuredImageAlt: 'Wide Wings Media Digital Marketing Services Dubai',
  },
  {
    ...makeSeo('blogs', 'Blogs', '/insights/',
      'Wide Wings Media: Digital Marketing Insights and Knowledge',
      'Explore valuable insights, articles, and blogs with Wide Wings Media. Expand your knowledge and feed your curiosity daily with our blogs.'),
    focusKeyword: 'digital marketing blog Dubai',
    secondaryKeywords: 'marketing insights UAE, SEO tips Dubai, digital marketing articles, social media marketing blog',
    ogImage: '/Logoblack.webp',
    featuredImage: '/Logoblack.webp',
    featuredImageAlt: 'Wide Wings Media — Digital Marketing Blog & Insights',
  },
  {
    ...makeSeo('news', 'News', '/news',
      'News | Wide Wings Media',
      'Latest news and media coverage featuring Wide Wings Media. Read our press mentions and industry insights.'),
    focusKeyword: 'Wide Wings Media news',
    secondaryKeywords: 'digital marketing news Dubai, marketing agency press, UAE marketing industry news',
    ogImage: '/Logoblack.webp',
    featuredImage: '/Logoblack.webp',
    featuredImageAlt: 'Wide Wings Media — Latest News & Press Coverage',
    robots: 'noindex, nofollow',
    noindex: true,
    nofollow: true,
  },
  {
    ...makeSeo('privacy-policy', 'Privacy Policy', '/privacy-policy',
      'Privacy Policy | Wide Wings Media',
      'Wide Wings Media, LLC is committed to protecting your privacy. Read our Privacy Policy to understand how we collect, use, and disclose your personal information.'),
    focusKeyword: 'Wide Wings Media privacy policy',
    secondaryKeywords: 'data privacy UAE, marketing agency privacy policy, GDPR compliance Dubai',
    ogImage: '/Logoblack.webp',
    featuredImage: '/Logoblack.webp',
    featuredImageAlt: 'Wide Wings Media — Privacy Policy',
  },
  {
    ...makeSeo('terms-conditions', 'Terms & Conditions', '/terms-conditions',
      'Terms & Conditions | Wide Wings Media',
      'Read the Terms & Conditions for Wide Wings Media, LLC. Understand our usage policies, user rights, and legal agreements for our digital marketing services.'),
    focusKeyword: 'Wide Wings Media terms and conditions',
    secondaryKeywords: 'marketing agency terms UAE, service agreement Dubai, legal terms Wide Wings',
    ogImage: '/Logoblack.webp',
    featuredImage: '/Logoblack.webp',
    featuredImageAlt: 'Wide Wings Media — Terms & Conditions',
  },
  {
    ...makeSeo('web-app-development', 'Web & App Development', '/web-design-company-dubai/',
      'Web & App Development | Wide Wings Media Digital Agency Dubai',
      'We design and develop high-performing websites and mobile applications that are fast, secure, and user-focused. Every build is optimized for user experience, scalability, and business growth.',
      'Service'),
    focusKeyword: 'web development company Dubai',
    secondaryKeywords: 'app development Dubai, website design UAE, mobile app development Dubai, ecommerce development Dubai',
    ogImage: '/Logoblack.webp',
    featuredImage: '/Logoblack.webp',
    featuredImageAlt: 'Wide Wings Media — Web & App Development Agency Dubai',
  },
  {
    ...makeSeo('creative-branding', 'Creative & Branding', '/branding-agency-dubai/',
      'Creative & Branding | Wide Wings Media Digital Agency Dubai',
      'We create brands that look sharp, speak clearly, and actually perform, from strategy to design and content.',
      'Service'),
    focusKeyword: 'branding agency Dubai',
    secondaryKeywords: 'creative agency UAE, logo design Dubai, brand identity Dubai, graphic design agency Dubai',
    ogImage: '/Logoblack.webp',
    featuredImage: '/Logoblack.webp',
    featuredImageAlt: 'Wide Wings Media — Creative & Branding Agency Dubai',
  },
  {
    ...makeSeo('paid-advertising', 'Paid Advertising & Media Buying', '/ppc-advertising-company-dubai/',
      'Paid Advertising & Media Buying | Wide Wings Media Digital Agency Dubai',
      'We plan, execute, and optimize paid advertising campaigns that maximize reach, conversions, and ROI. Our data-driven media buying ensures your budget delivers measurable results across platforms.',
      'Service'),
    focusKeyword: 'paid advertising agency Dubai',
    secondaryKeywords: 'Google Ads agency Dubai, media buying UAE, PPC agency Dubai, paid social media Dubai',
    ogImage: '/Logoblack.webp',
    featuredImage: '/Logoblack.webp',
    featuredImageAlt: 'Wide Wings Media — Paid Advertising & Media Buying Dubai',
  },
  {
    ...makeSeo('social-media-management', 'Social Media Management', '/social-media-marketing-agency-in-dubai/',
      'Social Media Management | Wide Wings Media Digital Agency Dubai',
      'We manage your social media presence with strategic content, consistent engagement, and platform-specific growth tactics. Our approach builds communities, increases visibility, and drives meaningful interactions.',
      'Service'),
    focusKeyword: 'social media management Dubai',
    secondaryKeywords: 'social media agency UAE, Instagram marketing Dubai, Facebook management Dubai, TikTok marketing UAE',
    ogImage: '/Logoblack.webp',
    featuredImage: '/Logoblack.webp',
    featuredImageAlt: 'Wide Wings Media — Social Media Management Agency Dubai',
  },
  {
    ...makeSeo('content-creation', 'Content Creation & Graphic Design', '/content-creation-graphic-design/',
      'Content Creation & Graphic Design | Wide Wings Media Digital Agency Dubai',
      'We create compelling content and visuals that capture attention and communicate your brand story clearly. From graphics to copy, every asset is designed to inspire action and strengthen brand recall.',
      'Service'),
    focusKeyword: 'content creation agency Dubai',
    secondaryKeywords: 'graphic design agency Dubai, content marketing UAE, video production Dubai, copywriting Dubai',
    ogImage: '/Logoblack.webp',
    featuredImage: '/Logoblack.webp',
    featuredImageAlt: 'Wide Wings Media — Content Creation & Graphic Design Dubai',
  },
  {
    ...makeSeo('email-sms-crm', 'Email, SMS & CRM Marketing', '/email-marketing-dubai/',
      'Email, SMS & CRM Marketing | Wide Wings Media Digital Agency Dubai',
      'We create campaigns that people open, read, and act on. From welcome flows to retention sequences, every message has a purpose and a result behind it.',
      'Service'),
    focusKeyword: 'email marketing agency Dubai',
    secondaryKeywords: 'SMS marketing UAE, CRM marketing Dubai, email automation Dubai, customer retention UAE',
    ogImage: '/Logoblack.webp',
    featuredImage: '/Logoblack.webp',
    featuredImageAlt: 'Wide Wings Media — Email, SMS & CRM Marketing Dubai',
  },
  {
    ...makeSeo('seo-performance', 'SEO & Performance Management', '/seo-services-dubai/',
      'SEO & Performance Management | Wide Wings Media Digital Agency Dubai',
      'We optimize your digital presence to rank higher, attract quality traffic, and improve long-term performance. Our SEO strategies are data-led, ethical, and focused on sustainable growth.',
      'Service'),
    focusKeyword: 'SEO agency Dubai',
    secondaryKeywords: 'SEO services UAE, search engine optimization Dubai, SEO company Dubai, local SEO Dubai',
    ogImage: '/Logoblack.webp',
    featuredImage: '/Logoblack.webp',
    featuredImageAlt: 'Wide Wings Media — SEO & Performance Management Agency Dubai',
  },
  {
    ...makeSeo('ooh-advertising', 'OOH Advertising', '/outdoor-advertising-dubai/',
      'OOH Advertising | Wide Wings Media Digital Agency Dubai',
      'We deliver impactful out-of-home advertising that amplifies brand visibility across key locations. From billboards to transit media, we help your message reach audiences beyond digital screens.',
      'Service'),
    focusKeyword: 'OOH advertising Dubai',
    secondaryKeywords: 'outdoor advertising UAE, billboard advertising Dubai, transit advertising Dubai, bus shelter ads UAE',
    ogImage: '/Logoblack.webp',
    featuredImage: '/Logoblack.webp',
    featuredImageAlt: 'Wide Wings Media — OOH Advertising Agency Dubai',
  },
  {
    ...makeSeo('analytics-performance', 'Analytics & Performance Marketing', '/analytics-performance-marketing/',
      'Analytics & Performance Marketing | Wide Wings Media Digital Agency Dubai',
      "We're not just a media buying agency, we build performance systems that scale. From strategy to execution, every campaign is designed to convert, not just reach.",
      'Service'),
    focusKeyword: 'performance marketing agency Dubai',
    secondaryKeywords: 'analytics agency UAE, data-driven marketing Dubai, ROI marketing Dubai, conversion optimisation UAE',
    ogImage: '/Logoblack.webp',
    featuredImage: '/Logoblack.webp',
    featuredImageAlt: 'Wide Wings Media — Analytics & Performance Marketing Dubai',
  },
  {
    ...makeSeo('pr-management', 'PR Management', '/pr-agency-dubai/',
      'PR Management | Wide Wings Media Digital Agency Dubai',
      'We position your brand where it matters. Through the right narratives, the right platforms, and the right timing. Every move is intentional, built to strengthen credibility and visibility.',
      'Service'),
    focusKeyword: 'PR agency Dubai',
    secondaryKeywords: 'public relations UAE, PR management Dubai, media relations Dubai, reputation management UAE',
    ogImage: '/Logoblack.webp',
    featuredImage: '/Logoblack.webp',
    featuredImageAlt: 'Wide Wings Media — PR Management Agency Dubai',
  },
];

const redirects: Redirect[] = [
  { id: 'rd-001', from: '/creative-branding', to: '/branding-agency-dubai/', type: '301', createdAt: '2026-07-25T00:00:00Z' },
  { id: 'rd-002', from: '/email-sms-crm-marketing', to: '/email-marketing-dubai/', type: '301', createdAt: '2026-07-25T00:00:00Z' },
  { id: 'rd-003', from: '/pr-management', to: '/pr-agency-dubai/', type: '301', createdAt: '2026-07-25T00:00:00Z' },
];

const mediaItems: MediaItem[] = [];
// Initialise from file so data survives hot-reloads and lambda warm starts
const chatEvents: ChatEvent[] = loadEvents();

const enquiries: Enquiry[] = [
  { id: 'enq-001', name: 'Ahmed Al Rashid', email: 'ahmed@example.com', phone: '+971 50 123 4567', service: 'SEO & Performance Management', message: 'We need help ranking our e-commerce site in the UAE. Please get in touch.', status: 'new', receivedAt: '2026-06-20T09:15:00Z' },
  { id: 'enq-002', name: 'Sara Mohammed', email: 'sara@techbiz.ae', phone: '+971 55 987 6543', service: 'Social Media Management', message: 'Looking for a full social media management package for our startup. Budget around AED 5,000/month.', status: 'read', receivedAt: '2026-06-19T14:30:00Z' },
  { id: 'enq-003', name: 'James Wilson', email: 'james@globalco.com', phone: '+44 7700 900 123', service: 'Paid Advertising & Media Buying', message: 'We are expanding to the Middle East and need a PPC campaign across Google and Meta platforms.', status: 'new', receivedAt: '2026-06-18T11:00:00Z' },
  { id: 'enq-004', name: 'Fatima Al Zaabi', email: 'fatima@zaabibrand.com', phone: '+971 52 345 6789', service: 'Creative & Branding', message: 'We are launching a new fashion brand and need complete branding — logo, guidelines, and website.', status: 'new', receivedAt: '2026-06-17T16:45:00Z' },
  { id: 'enq-005', name: 'Raj Sharma', email: 'raj@indiadubai.com', phone: '+971 56 789 0123', service: 'Web & App Development', message: 'Need a B2B e-commerce platform built. Would like to discuss requirements.', status: 'read', receivedAt: '2026-06-15T08:20:00Z' },
];

const BLOG_SEO: Record<string, { metaTitle: string; focusKeyword: string; secondaryKeywords: string }> = {
  'ecommerce-website-development-dubai': {
    metaTitle: 'Ecommerce Website Development Dubai | Build & Grow Online',
    focusKeyword: 'ecommerce website development Dubai',
    secondaryKeywords: 'online store development Dubai, ecommerce solutions UAE, Shopify development Dubai',
  },
  'search-engine-marketing-company-dubai': {
    metaTitle: 'Search Engine Marketing Company in Dubai | ROI-Driven SEM',
    focusKeyword: 'search engine marketing company Dubai',
    secondaryKeywords: 'SEM agency Dubai, PPC agency Dubai, Google Ads Dubai, paid search UAE',
  },
  'ppc-for-ecommerce-dubai': {
    metaTitle: 'PPC for E-Commerce Websites in Dubai | Wide Wings Media',
    focusKeyword: 'PPC for ecommerce websites Dubai',
    secondaryKeywords: 'ecommerce PPC Dubai, Google Shopping Ads Dubai, paid ads ecommerce UAE',
  },
  'instagram-growth-services-uae': {
    metaTitle: 'Best Instagram Growth Services in UAE | 2026 Expert Guide',
    focusKeyword: 'Instagram growth services UAE',
    secondaryKeywords: 'Instagram marketing UAE, grow Instagram followers Dubai, social media growth UAE',
  },
  'shopify-web-development-dubai': {
    metaTitle: 'Shopify Web Development in Dubai | Built for UAE Growth',
    focusKeyword: 'Shopify web development Dubai',
    secondaryKeywords: 'Shopify store Dubai, Shopify developer UAE, ecommerce development Dubai',
  },
  'videography-company-dubai': {
    metaTitle: 'Leading Videography Company in Dubai for Pro Productions',
    focusKeyword: 'videography company in Dubai',
    secondaryKeywords: 'corporate video production Dubai, photography company Dubai, drone videography UAE',
  },
  'b2b-seo-services-in-dubai': {
    metaTitle: 'B2B SEO Services in Dubai for Revenue & Lead Growth',
    focusKeyword: 'B2B SEO services in Dubai',
    secondaryKeywords: 'B2B digital marketing Dubai, lead generation SEO UAE, enterprise SEO Dubai',
  },
  'digital-marketing-for-restaurants': {
    metaTitle: 'Digital Marketing for Restaurants in UAE | Boost Visibility',
    focusKeyword: 'digital marketing for restaurants in UAE',
    secondaryKeywords: 'restaurant marketing Dubai, food & beverage marketing UAE, social media for restaurants',
  },
  'google-ads-agency-dubai': {
    metaTitle: 'Google Ads Agency in Dubai | Measurable ROI Results',
    focusKeyword: 'Google Ads agency in Dubai',
    secondaryKeywords: 'Google AdWords Dubai, PPC management Dubai, Google advertising UAE',
  },
  'healthcare-marketing-agency-in-dubai': {
    metaTitle: 'Healthcare Marketing Agency in Dubai | Wide Wings Media',
    focusKeyword: 'healthcare marketing agency in Dubai',
    secondaryKeywords: 'medical marketing Dubai, clinic marketing UAE, hospital digital marketing Dubai',
  },
  'reliable-paid-ads-agency-in-dubai': {
    metaTitle: 'Paid Ads Agency in Dubai: Enhance ROI with Smart Strategies',
    focusKeyword: 'paid ads agency in Dubai',
    secondaryKeywords: 'Meta ads Dubai, LinkedIn ads UAE, paid advertising agency Dubai',
  },
  'seo-strategy-for-uae-startups': {
    metaTitle: 'SEO Strategy for UAE Startups: Rank #1 in Dubai & Abu Dhabi',
    focusKeyword: 'SEO strategy for UAE startups',
    secondaryKeywords: 'startup SEO Dubai, local SEO UAE, SEO for new businesses Dubai',
  },
  'ai-trend': {
    metaTitle: 'AI Trends UAE Businesses Should Watch in 2026',
    focusKeyword: 'AI trends UAE',
    secondaryKeywords: 'artificial intelligence UAE, agentic AI UAE, AI automation UAE, AI governance UAE, UAE AI strategy, bilingual AI UAE',
  },
  'real-estate-content-writing-uae': {
    metaTitle: 'Real Estate Content Writing Services in the UAE',
    focusKeyword: 'real estate content writing UAE',
    secondaryKeywords: 'property content writing Dubai, real estate SEO content UAE, property marketing content',
  },
  'local-seo-services-in-abu-dhabi': {
    metaTitle: 'Local SEO Services in Abu Dhabi | Boost Business Visibility',
    focusKeyword: 'local SEO services in Abu Dhabi',
    secondaryKeywords: 'SEO agency Abu Dhabi, Google My Business Abu Dhabi, local search optimization UAE',
  },
  'social-media-packages-for-smes': {
    metaTitle: 'Social Media Packages for SMEs in the UAE | Wide Wings Media',
    focusKeyword: 'social media packages for SMEs UAE',
    secondaryKeywords: 'social media pricing UAE, SME marketing packages Dubai, affordable social media UAE',
  },
  'digital-marketing-strategies-for-smes': {
    metaTitle: 'Digital Marketing for SMEs in Dubai: Strategies That Work in 2026',
    focusKeyword: 'digital marketing for SMEs in Dubai',
    secondaryKeywords: 'digital marketing strategy Dubai, SEO for small businesses Dubai, social media marketing Dubai, WhatsApp marketing UAE, paid advertising Dubai, AI search optimization Dubai',
  },
  'local-seo-agency-for-startups': {
    metaTitle: 'Top Local SEO Agency in Dubai | Wide Wings Media UAE',
    focusKeyword: 'local SEO agency in Dubai',
    secondaryKeywords: 'local search SEO Dubai, Google Maps optimization UAE, local SEO for startups Dubai',
  },
  'what-is-a-url': {
    metaTitle: 'Short vs. Long URLs in SEO: What Actually Works?',
    focusKeyword: 'short vs long URLs in SEO',
    secondaryKeywords: 'URL structure SEO, URL best practices, SEO-friendly URLs Dubai',
  },
  'social-media-for-powerful-brand-awareness': {
    metaTitle: 'Social Media for Brand Awareness: What Works Best?',
    focusKeyword: 'social media for brand awareness',
    secondaryKeywords: 'brand awareness Dubai, social media strategy UAE, building brand on social media',
  },
  'ai-in-healthcare-marketing': {
    metaTitle: 'How AI in Healthcare is Transforming the Future of Medicine',
    focusKeyword: 'AI in healthcare',
    secondaryKeywords: 'AI healthcare marketing, artificial intelligence medicine UAE, AI patient engagement',
  },
  'advertisement-company-in-dubai': {
    metaTitle: 'Advertisement Company in Dubai: Reach Your Target Market',
    focusKeyword: 'advertisement company in Dubai',
    secondaryKeywords: 'advertising agency Dubai, ad company UAE, marketing agency Dubai',
  },
  'broadcast-tv-advertising-for-millions': {
    metaTitle: 'Broadcast TV Advertising: Maximize Your Reach to Millions',
    focusKeyword: 'broadcast TV advertising',
    secondaryKeywords: 'TV advertising UAE, television ads Dubai, broadcast media marketing',
  },
  'connected-tv-advertising': {
    metaTitle: 'Connected TV Advertising for Broadcast Ads: Reach Millions',
    focusKeyword: 'connected TV advertising',
    secondaryKeywords: 'CTV advertising UAE, OTT advertising Dubai, streaming TV ads',
  },
  'impact-of-ai-on-marketing-and-advertising': {
    metaTitle: 'Impact of AI for Marketing & Advertising: Insights & Trends',
    focusKeyword: 'AI for marketing and advertising',
    secondaryKeywords: 'AI marketing trends, artificial intelligence advertising, AI campaign optimization',
  },
  'creative-street-marketing-solutions': {
    metaTitle: 'Street Marketing and Advertising: Lasting Impression',
    focusKeyword: 'street marketing and advertising',
    secondaryKeywords: 'outdoor advertising Dubai, street furniture advertising UAE, guerrilla marketing Dubai',
  },
  'structured-data-for-enhanced-seo-performance': {
    metaTitle: 'Structured Data for Enhanced SEO Performance',
    focusKeyword: 'structured data for SEO',
    secondaryKeywords: 'schema markup SEO, JSON-LD schema Dubai, rich snippets optimization',
  },
  'systematic-search-engine-optimization': {
    metaTitle: 'SEO Services in Dubai: How to Get Your Business Noticed',
    focusKeyword: 'SEO services in Dubai',
    secondaryKeywords: 'search engine optimization Dubai, SEO company UAE, website ranking Dubai',
  },
  'brand-lift-tests': {
    metaTitle: "Brand Lift Tests: A Digital Marketer's Complete Guide",
    focusKeyword: 'brand lift tests',
    secondaryKeywords: 'brand lift study, ad effectiveness measurement, campaign impact measurement',
  },
  'marketing-for-ecommerce-businesses': {
    metaTitle: 'Marketing for Ecommerce Businesses',
    focusKeyword: 'marketing for ecommerce businesses',
    secondaryKeywords: 'ecommerce marketing strategy, digital marketing online store, ecommerce growth UAE',
  },
  'content-repurposing': {
    metaTitle: 'Improve Your Impact by Using Content Repurposing',
    focusKeyword: 'content repurposing',
    secondaryKeywords: 'repurpose content strategy, content recycling, content marketing UAE',
  },
  'local-seo-and-ai-for-small-businesses': {
    metaTitle: 'Local SEO and AI for Small Business Growth',
    focusKeyword: 'local SEO for small businesses',
    secondaryKeywords: 'AI local SEO, small business SEO Dubai, local search optimization AI',
  },
  'social-media-for-small-businesses': {
    metaTitle: "Social Media for Small Businesses: It's Not All Easy",
    focusKeyword: 'social media for small businesses',
    secondaryKeywords: 'small business social media Dubai, SME social media UAE, social media challenges',
  },
  'what-are-open-graph-tags': {
    metaTitle: 'Open Graph Tags: Want to use social media more often?',
    focusKeyword: 'open graph tags',
    secondaryKeywords: 'OG meta tags, social media preview tags, Facebook open graph',
  },
  'what-are-anchor-texts': {
    metaTitle: 'Anchor Texts: What They Are & Why They Matter for SEO',
    focusKeyword: 'anchor texts SEO',
    secondaryKeywords: 'anchor text best practices, internal linking SEO, link text optimization',
  },
  'digital-marketing-strategy-for-b2bs': {
    metaTitle: 'Master B2B Marketing: Digital Marketing Strategy for B2Bs',
    focusKeyword: 'B2B digital marketing strategy',
    secondaryKeywords: 'B2B marketing Dubai, business to business marketing UAE, B2B lead generation',
  },
  'image-optimization-tips': {
    metaTitle: 'Boost Website Traffic: Image Optimization Guide for Bloggers',
    focusKeyword: 'image optimization',
    secondaryKeywords: 'image SEO, Core Web Vitals, WebP, AVIF, website speed optimization, visual search optimization',
  },
  'best-digital-marketing-agency-in-abu-dhabi': {
    metaTitle: 'Digital Marketing Agency in Abu Dhabi That Focuses on Growth',
    focusKeyword: 'digital marketing agency in Abu Dhabi',
    secondaryKeywords: 'marketing agency Abu Dhabi, online marketing Abu Dhabi, digital growth UAE',
  },
  'top-social-media-marketing-agencies-in-dubai': {
    metaTitle: 'Best Social Media Marketing Agencies in Dubai for Business',
    focusKeyword: 'social media marketing agencies in Dubai',
    secondaryKeywords: 'top social media agencies Dubai, social media management UAE, Instagram agency Dubai',
  },
  'healthcare-marketing': {
    metaTitle: 'Healthcare Marketing Agency Driven By AI Technology',
    focusKeyword: 'healthcare marketing agency AI',
    secondaryKeywords: 'AI healthcare marketing Dubai, medical digital marketing UAE, hospital marketing',
  },
  'what-are-banner-ads': {
    metaTitle: 'Make the Most of Banner Ads! Tips and Targeting Strategies',
    focusKeyword: 'banner ads tips and targeting',
    secondaryKeywords: 'display banner advertising, banner ad design, banner ad targeting UAE',
  },
  'power-of-bridge-banner-advertising': {
    metaTitle: 'Bridge Banner Ads: A Cost-Effective OOH Solution',
    focusKeyword: 'bridge banner advertising',
    secondaryKeywords: 'bridge banner ads Dubai, OOH advertising UAE, outdoor bridge banners',
  },
  'power-of-shopping-mall-advertising': {
    metaTitle: 'Shopping Mall Advertising: The New Marketing Frontier',
    focusKeyword: 'shopping mall advertising',
    secondaryKeywords: 'mall advertising Dubai, retail advertising UAE, in-mall media',
  },
  'market-segmentation-and-targeting': {
    metaTitle: 'Market Segmentation: How to Target the Right Customers',
    focusKeyword: 'market segmentation and targeting',
    secondaryKeywords: 'audience targeting strategy, customer segmentation, market targeting Dubai',
  },
  'power-of-reputation-management': {
    metaTitle: 'Online Reputation Management: How People View Your Company',
    focusKeyword: 'online reputation management',
    secondaryKeywords: 'brand reputation Dubai, ORM services UAE, manage online reviews',
  },
  'premier-cinema-advertising-company': {
    metaTitle: 'Cinema Advertising: Emotional Connection With Your Audience',
    focusKeyword: 'cinema advertising',
    secondaryKeywords: 'cinema ads UAE, movie theater advertising Dubai, film advertising Middle East',
  },
  'best-time-to-post-on-instagram-in-uae': {
    metaTitle: 'Best Time to Post on Instagram in UAE: 2026 Posting Guide',
    focusKeyword: 'best time to post on instagram in uae',
    secondaryKeywords: 'best time to post on instagram, best time of day to post on instagram, best time to post on instagram monday, best time to post on instagram sunday, best time to post on instagram weekend, best day and time to post on instagram, best time to post videos on instagram, best time to post a video on instagram',
  },
  'guide-to-effective-social-media-campaign': {
    metaTitle: 'Guide to a Successful Social Media Campaign',
    focusKeyword: 'social media campaign guide',
    secondaryKeywords: 'social media campaign strategy, run social media campaigns UAE, marketing campaign Dubai',
  },
  'youtube-studio-for-more-views': {
    metaTitle: 'YouTube Studio for More Views: Boost Your Channel Fast',
    focusKeyword: 'YouTube Studio for more views',
    secondaryKeywords: 'grow YouTube channel, YouTube analytics tips, video SEO UAE',
  },
  'ai-video-creation-trends': {
    metaTitle: 'AI Video Creation Trends: Insights & Future Projections',
    focusKeyword: 'AI video creation trends',
    secondaryKeywords: 'AI video tools, generative AI video, AI content creation UAE',
  },
  'successfully-rebrand-your-business': {
    metaTitle: 'How to Develop Your Rebranding Strategy',
    focusKeyword: 'rebranding strategy',
    secondaryKeywords: 'rebrand your business, brand identity refresh, rebranding process UAE',
  },
  'how-to-keep-your-audience-engaged': {
    metaTitle: 'Strategies for Sustaining Audience Engagement',
    focusKeyword: 'audience engagement strategies',
    secondaryKeywords: 'keep audience engaged, content engagement tips, audience retention UAE',
  },
};

// Pre-fills SEO for a blog post that hasn't been edited in the SEO Manager yet,
// so the score isn't zero out of the gate and generateMetadata always has a value.
export function blogSeoDefault(post: (typeof POSTS)[number]): SeoData {
  const blogMeta = BLOG_SEO[post.slug];
  const resolvedTitle = blogMeta?.metaTitle ?? post.title;
  return {
    pageId: `blog-${post.slug}`,
    pageTitle: post.title,
    slug: `/${post.slug}`,
    metaTitle: resolvedTitle,
    metaDescription: post.excerpt,
    focusKeyword: blogMeta?.focusKeyword ?? '',
    secondaryKeywords: blogMeta?.secondaryKeywords ?? '',
    canonicalUrl: `https://wide-wings.ae/${post.slug}`,
    ogTitle: resolvedTitle,
    ogDescription: post.excerpt,
    ogImage: post.image,
    twitterCard: 'summary_large_image',
    robots: 'index, follow',
    schemaType: 'Article',
    featuredImage: post.image,
    featuredImageAlt: post.title,
    noindex: false,
    nofollow: false,
    updatedAt: '',
  };
}

export const store = {
  pages: {
    list: () => [...pages],
    get: (id: string) => pages.find(p => p.id === id),
    create: (p: Omit<Page, 'id' | 'createdAt' | 'updatedAt'>) => {
      const page: Page = { ...p, id: Date.now().toString(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
      pages.push(page);
      return page;
    },
    update: (id: string, data: Partial<Page>) => {
      const idx = pages.findIndex(p => p.id === id);
      if (idx === -1) return null;
      pages[idx] = { ...pages[idx], ...data, updatedAt: new Date().toISOString() };
      return pages[idx];
    },
    delete: (id: string) => { const idx = pages.findIndex(p => p.id === id); if (idx > -1) pages.splice(idx, 1); },
  },
  seo: {
    list: () => {
      const fromPages = pages.map(p =>
        seoData.find(s => s.pageId === p.id) ?? { pageId: p.id, pageTitle: p.title, slug: p.slug } as SeoData,
      );
      const fromBlogs = POSTS.map(post => {
        const pageId = `blog-${post.slug}`;
        return seoData.find(s => s.pageId === pageId) ?? blogSeoDefault(post);
      });
      return [...fromPages, ...fromBlogs];
    },
    get: (pageId: string) => {
      const existing = seoData.find(s => s.pageId === pageId);
      if (existing) return existing;
      if (pageId.startsWith('blog-')) {
        const post = POSTS.find(p => `blog-${p.slug}` === pageId);
        if (post) return blogSeoDefault(post);
      }
      return undefined;
    },
    upsert: (data: SeoData) => {
      const idx = seoData.findIndex(s => s.pageId === data.pageId);
      if (idx > -1) seoData[idx] = { ...data, updatedAt: new Date().toISOString() };
      else seoData.push({ ...data, updatedAt: new Date().toISOString() });
    },
  },
  redirects: {
    list: () => [...redirects],
    create: (r: Omit<Redirect, 'id' | 'createdAt'>) => {
      const redirect: Redirect = { ...r, id: Date.now().toString(), createdAt: new Date().toISOString() };
      redirects.push(redirect);
      return redirect;
    },
    delete: (id: string) => { const idx = redirects.findIndex(r => r.id === id); if (idx > -1) redirects.splice(idx, 1); },
  },
  enquiries: {
    list: () => [...enquiries].sort((a, b) => new Date(b.receivedAt).getTime() - new Date(a.receivedAt).getTime()),
    markRead: (id: string) => { const e = enquiries.find(e => e.id === id); if (e) e.status = 'read'; },
    add: (e: Omit<Enquiry, 'id' | 'receivedAt' | 'status'>) => {
      const enq: Enquiry = { ...e, id: `enq-${Date.now()}`, status: 'new', receivedAt: new Date().toISOString() };
      enquiries.unshift(enq);
      return enq;
    },
  },
  media: {
    list: () => [...mediaItems].sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()),
    get: (id: string) => mediaItems.find(m => m.id === id),
    add: (item: Omit<MediaItem, 'id' | 'uploadedAt'>) => {
      const m: MediaItem = { ...item, id: `media-${Date.now()}`, uploadedAt: new Date().toISOString() };
      mediaItems.unshift(m);
      return m;
    },
    update: (id: string, data: Partial<MediaItem>) => {
      const idx = mediaItems.findIndex(m => m.id === id);
      if (idx === -1) return null;
      mediaItems[idx] = { ...mediaItems[idx], ...data };
      return mediaItems[idx];
    },
    upsert: (item: MediaItem) => {
      const idx = mediaItems.findIndex(m => m.id === item.id);
      if (idx === -1) { mediaItems.unshift(item); return item; }
      mediaItems[idx] = { ...mediaItems[idx], ...item };
      return mediaItems[idx];
    },
    delete: (id: string) => { const idx = mediaItems.findIndex(m => m.id === id); if (idx > -1) mediaItems.splice(idx, 1); },
  },
  chatEvents: {
    list: () => [...chatEvents],
    add: (e: Omit<ChatEvent, 'id' | 'timestamp'>) => {
      const ev: ChatEvent = { ...e, id: `ce-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, timestamp: new Date().toISOString() };
      chatEvents.push(ev);
      if (chatEvents.length > 5000) chatEvents.splice(0, chatEvents.length - 5000);
      saveEvents(chatEvents);
      return ev;
    },
    clear: () => { chatEvents.length = 0; saveEvents(chatEvents); },
  },
};
