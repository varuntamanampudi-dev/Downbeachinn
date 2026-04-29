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

/**
 * Sends the OTP via Twilio SMS if credentials are configured,
 * otherwise prints it to the terminal for local development.
 */
export async function sendOtpEmail(email: string, code: string): Promise<void> {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    console.log(`\n[Admin OTP for ${email}]: ${code}\n`);
    return;
  }
  const nodemailer = (await import('nodemailer')).default;
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_APP_PASSWORD },
  });
  await transporter.sendMail({
    from: `"Downbeach Inn Admin" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: `Your Admin Login Code: ${code} — Downbeach Inn`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:420px;margin:0 auto;padding:32px;background:#f8fafc;border-radius:12px;">
        <div style="text-align:center;margin-bottom:24px;">
          <div style="display:inline-block;background:linear-gradient(135deg,#0d9488,#0a7c71);width:48px;height:48px;border-radius:12px;line-height:48px;color:white;font-weight:900;font-size:18px;">DB</div>
          <h2 style="color:#0d1b2a;margin:12px 0 4px;font-size:18px;">Downbeach Inn Admin</h2>
          <p style="color:#64748b;margin:0;font-size:14px;">Your one-time login code</p>
        </div>
        <div style="background:white;border:2px solid #0d9488;border-radius:10px;padding:24px;text-align:center;margin-bottom:20px;">
          <div style="font-size:42px;font-weight:900;color:#0d1b2a;letter-spacing:14px;">${code}</div>
        </div>
        <p style="color:#94a3b8;font-size:12px;text-align:center;margin:0;">
          Expires in 10 minutes · Do not share this code with anyone
        </p>
      </div>
    `,
  });
}
