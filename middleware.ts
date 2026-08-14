import { NextRequest, NextResponse } from 'next/server';
import { COOKIE_NAME, verifyToken } from '@/lib/admin/auth';

// Standalone, unlinked lead-capture page — gated by HTTP Basic Auth instead of
// the cookie-session system since it has no login page of its own.
const LEADSHEET_USER = process.env.LEADSHEET_USER || 'leaduser';
const LEADSHEET_PASSWORD = process.env.LEADSHEET_PASSWORD || 'YtY3PHAfrEEmgV';

function checkBasicAuth(req: NextRequest): boolean {
  const auth = req.headers.get('authorization');
  if (!auth?.startsWith('Basic ')) return false;
  const [user, pass] = atob(auth.slice(6)).split(':');
  return user === LEADSHEET_USER && pass === LEADSHEET_PASSWORD;
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Pass pathname to all responses so root layout can detect /admin routes
  const res = NextResponse.next();
  res.headers.set('x-pathname', pathname);

  if (pathname.startsWith('/leadsheet')) {
    if (!checkBasicAuth(req)) {
      return new NextResponse('Authentication required', {
        status: 401,
        headers: { 'WWW-Authenticate': 'Basic realm="Leadsheet"' },
      });
    }
    return res;
  }

  if (!pathname.startsWith('/admin')) return res;
  // trailingSlash: true means the live URL is /admin/login/ — match both forms,
  // otherwise the login page redirects to itself in an infinite loop
  if (pathname === '/admin/login' || pathname === '/admin/login/') return res;

  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token) return NextResponse.redirect(new URL('/admin/login/', req.url));

  const session = await verifyToken(token);
  if (!session) {
    const redirect = NextResponse.redirect(new URL('/admin/login/', req.url));
    redirect.cookies.delete(COOKIE_NAME);
    return redirect;
  }

  return res;
}

export const config = { matcher: ['/admin/:path*', '/leadsheet/:path*'] };
