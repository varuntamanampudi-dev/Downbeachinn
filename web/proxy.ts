import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_COOKIE = 'admin_token';

function getJwtSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET ?? 'dev-only-secret-change-in-production';
  return new TextEncoder().encode(secret);
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow the login page through — everything else under /admin requires auth
  if (pathname === '/admin/login') {
    return NextResponse.next();
  }

  const token = request.cookies.get(JWT_COOKIE)?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  try {
    await jwtVerify(token, getJwtSecret());
    return NextResponse.next();
  } catch {
    // Expired or invalid token — clear cookie and redirect
    const response = NextResponse.redirect(new URL('/admin/login', request.url));
    response.cookies.delete(JWT_COOKIE);
    return response;
  }
}

export const config = {
  matcher: ['/admin/:path*'],
};
