// Line icons for card / row titles on the service pages, picked from the
// title's wording. First matching rule wins, so specific rules come first.

const ICONS: Record<string, React.ReactNode> = {
  shield: <><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" /><path d="m9 12 2 2 4-4" /></>,
  star: <path d="M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z" />,
  languages: <path d="m5 8 6 6M4 14l6-6 2-3M2 5h12M7 2h1M22 22l-5-10-5 10M14 18h6" />,
  camera: <><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" /><circle cx="12" cy="13" r="3" /></>,
  mail: <><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-10 6L2 7" /></>,
  zap: <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />,
  link: <><path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7" /><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7" /></>,
  chart: <><path d="M3 3v18h18" /><path d="M18 17V9M13 17V5M8 17v-3" /></>,
  trending: <><path d="m22 7-8.5 8.5-5-5L2 17" /><path d="M16 7h6v6" /></>,
  pin: <><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></>,
  search: <><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></>,
  phone: <><rect x="5" y="2" width="14" height="20" rx="2" /><path d="M12 18h.01" /></>,
  code: <path d="m16 18 6-6-6-6M8 6l-6 6 6 6" />,
  layout: <><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M9 21V9" /></>,
  refresh: <path d="M3 12a9 9 0 0 1 15-6.7L21 8M21 3v5h-5M21 12a9 9 0 0 1-15 6.7L3 16M3 21v-5h5" />,
  monitor: <><rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8M12 17v4" /></>,
  share: <><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4" /></>,
  file: <><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" /><path d="M14 2v4a2 2 0 0 0 2 2h4M16 13H8M16 17H8M10 9H8" /></>,
  megaphone: <><path d="m3 11 18-5v12L3 14v-3z" /><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" /></>,
  target: <><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></>,
  pen: <><path d="M12 19l7-7 3 3-7 7-3-3z" /><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" /><path d="M2 2l7.586 7.586" /><circle cx="11" cy="11" r="2" /></>,
  book: <><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V2H6.5A2.5 2.5 0 0 0 4 4.5v15Z" /><path d="M4 19.5A2.5 2.5 0 0 0 6.5 22H20v-5" /></>,
  tag: <><path d="M12.6 2.6A2 2 0 0 0 11.2 2H4a2 2 0 0 0-2 2v7.2a2 2 0 0 0 .6 1.4l8.7 8.7a2.4 2.4 0 0 0 3.4 0l6.6-6.6a2.4 2.4 0 0 0 0-3.4Z" /><circle cx="7.5" cy="7.5" r="1.5" /></>,
  message: <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />,
  wrench: <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />,
  users: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8" /></>,
  play: <><rect x="2" y="5" width="20" height="14" rx="3" /><path d="m10 9 5 3-5 3z" /></>,
  cart: <><circle cx="8" cy="21" r="1" /><circle cx="19" cy="21" r="1" /><path d="M2 2h3l2.7 12.4a2 2 0 0 0 2 1.6h8.7a2 2 0 0 0 2-1.6L22 7H6" /></>,
  briefcase: <><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></>,
  rocket: <><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" /><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" /><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" /></>,
  check: <><circle cx="12" cy="12" r="10" /><path d="m9 12 2 2 4-4" /></>,
  bulb: <><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" /><path d="M9 18h6M10 22h4" /></>,
  sparkle: <path d="M12 3l1.9 5.8L20 10l-6.1 1.2L12 17l-1.9-5.8L4 10l6.1-1.2z" />,
};

const RULES: [RegExp, string][] = [
  // process steps
  [/^(discovery|understand)|research/i, 'search'],
  [/wireframe/i, 'layout'],
  [/^development/i, 'code'],
  [/launch|delivery|execute/i, 'rocket'],
  [/handover/i, 'wrench'],
  [/feedback|revision/i, 'message'],
  [/approval/i, 'check'],
  [/^brief|narrative/i, 'file'],
  [/concept|hypothesis/i, 'bulb'],
  [/production/i, 'camera'],
  [/media list/i, 'users'],
  [/outreach/i, 'megaphone'],
  [/measur|monitor/i, 'chart'],
  [/^optimi[sz](e|ation)/i, 'trending'],
  [/^testing$/i, 'refresh'],
  [/strategi[sz]e/i, 'target'],
  // services
  [/review|quality/i, 'star'],
  [/crisis|reputation/i, 'shield'],
  [/google business/i, 'pin'],
  [/youtube/i, 'play'],
  [/shopping/i, 'cart'],
  [/remarketing|retarget/i, 'refresh'],
  [/linkedin/i, 'briefcase'],
  [/microsoft|search ads/i, 'search'],
  [/performance max/i, 'zap'],
  [/display network|dashboard/i, 'layout'],
  [/ga4|tag manager|^technical/i, 'code'],
  [/copywriting/i, 'file'],
  [/digital outdoor/i, 'monitor'],
  [/attribution/i, 'share'],
  [/arabic|bilingual/i, 'languages'],
  [/video|photo/i, 'camera'],
  [/email/i, 'mail'],
  [/automation|instant/i, 'zap'],
  [/link|citation/i, 'link'],
  [/a\/b|testing|analytics|reporting|tracking|audit|behaviou?r/i, 'chart'],
  [/landing|\bcta\b|\bform\b/i, 'layout'],
  [/conversion|funnel|leads?\b|traffic|growth/i, 'trending'],
  [/local|neighbourhood|island|location|distance|dubai|uae|based/i, 'pin'],
  [/seo|search|keyword/i, 'search'],
  [/mobile|responsive/i, 'phone'],
  [/application|technical/i, 'code'],
  [/rebrand|redesign/i, 'refresh'],
  [/website|cms|\bweb\b/i, 'monitor'],
  [/social|multi-platform/i, 'share'],
  [/press release|storytelling|copywriting|brochure|print|content|profile|presentation/i, 'file'],
  [/\bpr\b|press|media relations|awareness|advertis|\bads\b|outdoor|transit/i, 'megaphone'],
  [/strategy|positioning|objective|intent|purchase|planning|segmentation|personali/i, 'target'],
  [/logo|identity|visual|design|creative|graphic/i, 'pen'],
  [/guideline/i, 'book'],
  [/naming|brand/i, 'tag'],
  [/communication|describe/i, 'message'],
  [/support|management/i, 'wrench'],
  [/team|sme|roof|partner|experience|customer/i, 'users'],
];

export function TitleIcon({ title }: { title: string }) {
  const name = RULES.find(([re]) => re.test(title))?.[1] ?? 'sparkle';
  return (
    <span className="sd-ico" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        {ICONS[name]}
      </svg>
    </span>
  );
}
