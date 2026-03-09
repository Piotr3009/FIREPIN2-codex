import { NextRequest, NextResponse } from 'next/server';

type Session = { role: 'ADMIN' | 'OPERATIVE' };

function getSession(request: NextRequest): Session | null {
  const raw = request.cookies.get('firepin_session')?.value;
  if (!raw) return null;
  try {
    return JSON.parse(Buffer.from(raw, 'base64url').toString('utf8')) as Session;
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = getSession(request);

  if (pathname.startsWith('/admin')) {
    if (!session) return NextResponse.redirect(new URL('/login', request.url));
    if (session.role !== 'ADMIN') return NextResponse.redirect(new URL('/unauthorized', request.url));
  }

  if (pathname.startsWith('/operative')) {
    if (!session) return NextResponse.redirect(new URL('/login', request.url));
    if (session.role !== 'OPERATIVE') return NextResponse.redirect(new URL('/unauthorized', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/operative/:path*']
};
