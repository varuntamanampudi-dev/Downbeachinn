'use server';

import { cookies } from 'next/headers';
import { db } from '@/lib/db/client';
import { adminUsers, adminOtpTokens } from '@/lib/db/schema';
import { eq, and, gt } from 'drizzle-orm';
import { generateOtp, sendOtp, signAdminJWT, JWT_COOKIE } from '@/lib/auth';

export type RequestOtpResult = { error?: string; phone?: string; devCode?: string };

// ── Step 1: request OTP ───────────────────────────────────

export async function requestOtp(
  _prev: RequestOtpResult | null,
  formData: FormData
): Promise<RequestOtpResult> {
  const rawPhone = (formData.get('phone') as string ?? '').trim().replace(/\D/g, '');

  // Accept 10-digit US numbers, normalise to E.164
  if (rawPhone.length !== 10) {
    return { error: 'Enter a valid 10-digit US phone number.' };
  }
  const phone = `+1${rawPhone}`;

  // Must match a registered admin
  const [admin] = await db
    .select({ id: adminUsers.id })
    .from(adminUsers)
    .where(eq(adminUsers.phone, phone));

  if (!admin) {
    return { error: 'That number is not registered as an admin.' };
  }

  // Expire any existing unused tokens for this phone
  await db
    .delete(adminOtpTokens)
    .where(and(eq(adminOtpTokens.phone, phone), eq(adminOtpTokens.used, false)));

  const code = generateOtp();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

  await db.insert(adminOtpTokens).values({ phone, code, expiresAt, used: false });

  await sendOtp(phone, code);

  // In dev mode (no Twilio) surface the code in the UI so the owner
  // doesn't have to dig through the terminal log.
  const devCode = (!process.env.TWILIO_ACCOUNT_SID) ? code : undefined;

  return { phone, devCode };
}

// ── Step 2: verify OTP and issue JWT cookie ───────────────

export type VerifyOtpResult = { error?: string; success?: boolean };

export async function verifyOtp(
  _prev: VerifyOtpResult | null,
  formData: FormData
): Promise<VerifyOtpResult> {
  const phone = (formData.get('phone') as string ?? '').trim();
  const code  = (formData.get('code')  as string ?? '').trim();

  const now = new Date().toISOString();

  const [token] = await db
    .select()
    .from(adminOtpTokens)
    .where(
      and(
        eq(adminOtpTokens.phone, phone),
        eq(adminOtpTokens.code, code),
        eq(adminOtpTokens.used, false),
        gt(adminOtpTokens.expiresAt, now)
      )
    );

  if (!token) {
    return { error: 'Invalid or expired code. Please try again.' };
  }

  // Mark token as used
  await db
    .update(adminOtpTokens)
    .set({ used: true })
    .where(eq(adminOtpTokens.id, token.id));

  // Look up admin
  const [admin] = await db
    .select()
    .from(adminUsers)
    .where(eq(adminUsers.phone, phone));

  if (!admin) return { error: 'Admin account not found.' };

  // Issue JWT cookie
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

  // Return success — client handles the redirect to avoid
  // the "unexpected response" error from redirect() inside useActionState.
  return { success: true };
}
