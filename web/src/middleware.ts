import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminJWT, JWT_COOKIE } from '@/lib/auth';

export async function middleware(req: NextRequest) {
  const token = req.cookies.get(JWT_COOKIE)?.value;
  if (!token) return NextResponse.redirect(new URL('/admin/login', req.url));
  const payload = await verifyAdminJWT(token);
  if (!payload) return NextResponse.redirect(new URL('/admin/login', req.url));
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/((?!login).*)'],
};
