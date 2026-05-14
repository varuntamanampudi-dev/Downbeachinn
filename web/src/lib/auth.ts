/**
 * Auth utilities for the admin panel.
 *
 * JWT: signed with HS256 using JWT_SECRET env var.
 *     Defaults to a dev-only secret when running locally without .env.local.
 *
 * OTP: sends via Twilio when TWILIO_ACCOUNT_SID is set.
 *      Falls back to printing the code in the terminal for local dev.
 */
import { SignJWT, jwtVerify, type JWTPayload } from 'jose';

// ── JWT ───────────────────────────────────────────────────

const JWT_COOKIE = 'admin_token';
const JWT_EXPIRY = '12h';

function getJwtSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET ?? 'dev-only-secret-change-in-production';
  return new TextEncoder().encode(secret);
}

export interface AdminJWTPayload extends JWTPayload {
  adminId: number;
  role: 'owner' | 'staff';
  phone: string;
}

export async function signAdminJWT(payload: Omit<AdminJWTPayload, keyof JWTPayload>): Promise<string> {
  return new SignJWT(payload as Record<string, unknown>)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(JWT_EXPIRY)
    .sign(getJwtSecret());
}

export async function verifyAdminJWT(token: string): Promise<AdminJWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getJwtSecret());
    return payload as AdminJWTPayload;
  } catch {
    return null;
  }
}

export { JWT_COOKIE };

// ── OTP ───────────────────────────────────────────────────

/** Generates a random 6-digit OTP string. */
export function generateOtp(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

// sendOtpEmail lives in @/lib/otp-email — kept separate so this file
// stays edge-runtime compatible (nodemailer is Node-only).
