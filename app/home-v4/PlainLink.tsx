import type { AnchorHTMLAttributes } from 'react';

// Links out of /home-v4 must be full page loads: the root layout hides the
// site header/footer for this route, and a client-side <Link> navigation keeps
// that layout, so the next page would render without its chrome.
export default function PlainLink({ href, ...rest }: AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) {
  return <a href={href} {...rest} />;
}
