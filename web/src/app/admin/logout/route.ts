import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { JWT_COOKIE } from '@/lib/auth';

export async function GET() {
  const cookieStore = await cookies();
  cookieStore.delete(JWT_COOKIE);
  return NextResponse.redirect(new URL('/admin/login', process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'));
}
