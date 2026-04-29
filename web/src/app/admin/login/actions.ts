'use server';

import { cookies } from 'next/headers';
import { db } from '@/lib/db/client';
import { adminUsers, adminOtpTokens } from '@/lib/db/schema';
import { eq, and, gt } from 'drizzle-orm';
import { generateOtp, sendOtpEmail, signAdminJWT, JWT_COOKIE } from '@/lib/auth';

export type RequestOtpResult = { error?: string; email?: string };

export async function requestOtp(
  _prev: RequestOtpResult | null,
  formData: FormData
): Promise<RequestOtpResult> {
  const email = (formData.get('email') as string ?? '').trim().toLowerCase();

  if (!email || !email.includes('@')) {
    return { error: 'Enter a valid email address.' };
  }

  const [admin] = await db
    .select({ id: adminUsers.id })
    .from(adminUsers)
    .where(eq(adminUsers.email, email));

  if (!admin) {
    return { error: 'That email is not registered as an admin.' };
  }

  await db
    .delete(adminOtpTokens)
    .where(and(eq(adminOtpTokens.phone, email), eq(adminOtpTokens.used, false)));

  const code = generateOtp();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

  await db.insert(adminOtpTokens).values({ phone: email, code, expiresAt, used: false });

  await sendOtpEmail(email, code);

  return { email };
}

export type VerifyOtpResult = { error?: string; success?: boolean };

export async function verifyOtp(
  _prev: VerifyOtpResult | null,
  formData: FormData
): Promise<VerifyOtpResult> {
  const email = (formData.get('email') as string ?? '').trim().toLowerCase();
  const code  = (formData.get('code')  as string ?? '').trim();
  const now   = new Date().toISOString();

  const [token] = await db
    .select()
    .from(adminOtpTokens)
    .where(
      and(
        eq(adminOtpTokens.phone, email),
        eq(adminOtpTokens.code, code),
        eq(adminOtpTokens.used, false),
        gt(adminOtpTokens.expiresAt, now)
      )
    );

  if (!token) {
    return { error: 'Invalid or expired code. Please try again.' };
  }

  await db.update(adminOtpTokens).set({ used: true }).where(eq(adminOtpTokens.id, token.id));

  const [admin] = await db
    .select()
    .from(adminUsers)
    .where(eq(adminUsers.email, email));

  if (!admin) return { error: 'Admin account not found.' };

  const jwt = await signAdminJWT({
    adminId: admin.id,
    role: admin.role,
    phone: admin.phone,
  });

  const cookieStore = await cookies();
  cookieStore.set(JWT_COOKIE, jwt, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 12,
  });

  return { success: true };
}
