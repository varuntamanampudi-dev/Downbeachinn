import nodemailer from 'nodemailer';

function getTransporter() {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });
}

export interface BookingEmailData {
  confirmationCode: string;
  guestFirstName: string;
  guestLastName: string;
  guestEmail: string;
  guestPhone: string;
  roomName: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  adults: number;
  children: number;
  pricePerNight: number;
  subtotal: number;
  taxAmount: number;
  total: number;
  specialRequests?: string;
  guestAddress?: string;
  guestCity?: string;
  guestState?: string;
  guestZip?: string;
}

function fmtDate(iso: string) {
  return new Date(iso + 'T12:00:00').toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
  });
}

function fmtMoney(n: number) {
  return n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export async function sendBookingEmails(data: BookingEmailData): Promise<void> {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    console.log('[email] GMAIL_USER / GMAIL_APP_PASSWORD not set — skipping email');
    return;
  }

  const transporter = getTransporter();
  const hotelEmail = process.env.GMAIL_USER;

  const guestAddress = [data.guestAddress, data.guestCity, data.guestState, data.guestZip]
    .filter(Boolean).join(', ');

  const guestHtml = `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:Arial,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:24px 16px;">

    <!-- Header -->
    <div style="background:linear-gradient(135deg,#0d1b2a,#0a7c71);border-radius:10px 10px 0 0;padding:32px 32px 24px;text-align:center;">
      <h1 style="color:white;margin:0;font-size:22px;letter-spacing:-0.5px;">Booking Request Received</h1>
      <p style="color:rgba(255,255,255,0.75);margin:6px 0 0;font-size:14px;">Downbeach Inn · 3601 Pacific Ave, Atlantic City, NJ</p>
    </div>

    <!-- Body -->
    <div style="background:white;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 10px 10px;padding:32px;">
      <p style="margin:0 0 16px;color:#334155;">Dear <strong>${data.guestFirstName}</strong>,</p>
      <p style="margin:0 0 20px;color:#475569;line-height:1.6;">
        Thank you for choosing <strong>Downbeach Inn</strong>! We've received your booking request and will contact you shortly to confirm and arrange payment.
      </p>

      <!-- Confirmation badge -->
      <div style="background:#f0fdf9;border:1.5px solid #0d9488;border-radius:8px;padding:14px 20px;margin-bottom:24px;text-align:center;">
        <div style="font-size:11px;font-weight:700;color:#0d9488;letter-spacing:0.1em;text-transform:uppercase;margin-bottom:4px;">Confirmation Number</div>
        <div style="font-size:24px;font-weight:900;color:#0d1b2a;letter-spacing:2px;">${data.confirmationCode}</div>
      </div>

      <!-- Booking details -->
      <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
        <tr style="background:#f8fafc;"><td colspan="2" style="padding:10px 14px;font-size:11px;font-weight:700;color:#0d9488;letter-spacing:0.08em;text-transform:uppercase;border-radius:6px 6px 0 0;">Reservation Details</td></tr>
        ${[
          ['Room', data.roomName],
          ['Check-in', fmtDate(data.checkIn)],
          ['Check-out', fmtDate(data.checkOut)],
          ['Nights', String(data.nights)],
          ['Guests', `${data.adults} adult${data.adults > 1 ? 's' : ''}${data.children > 0 ? ` · ${data.children} child${data.children > 1 ? 'ren' : ''} (free)` : ''}`],
        ].map(([l, v]) => `
          <tr style="border-bottom:1px solid #f1f5f9;">
            <td style="padding:9px 14px;color:#64748b;font-size:14px;width:130px;">${l}</td>
            <td style="padding:9px 14px;color:#1e293b;font-size:14px;font-weight:600;">${v}</td>
          </tr>
        `).join('')}
      </table>

      <!-- Price breakdown -->
      <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:16px 20px;margin-bottom:24px;">
        <div style="font-size:11px;font-weight:700;color:#0d9488;letter-spacing:0.08em;text-transform:uppercase;margin-bottom:10px;">Price Breakdown</div>
        <div style="display:flex;justify-content:space-between;font-size:14px;color:#475569;margin-bottom:6px;">
          <span>$${fmtMoney(data.pricePerNight)}/night × ${data.nights} nights</span>
          <span>$${fmtMoney(data.subtotal)}</span>
        </div>
        <div style="display:flex;justify-content:space-between;font-size:14px;color:#475569;margin-bottom:10px;padding-bottom:10px;border-bottom:1px solid #e2e8f0;">
          <span>NJ Hotel Tax</span>
          <span>$${fmtMoney(data.taxAmount)}</span>
        </div>
        <div style="display:flex;justify-content:space-between;font-size:16px;font-weight:800;color:#0d1b2a;">
          <span>Total</span>
          <span>$${fmtMoney(data.total)}</span>
        </div>
      </div>

      ${data.specialRequests ? `
      <div style="background:#fffbeb;border:1px solid #fcd34d;border-radius:6px;padding:12px 16px;margin-bottom:20px;">
        <strong style="font-size:13px;">Special Requests:</strong>
        <p style="margin:4px 0 0;font-size:13px;color:#475569;">${data.specialRequests}</p>
      </div>` : ''}

      <!-- Notice -->
      <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:6px;padding:12px 16px;margin-bottom:24px;">
        <p style="margin:0;font-size:13px;color:#1e40af;line-height:1.5;">
          ⏳ <strong>Payment not yet processed.</strong> Our team will reach out to you at
          <strong>${data.guestEmail}</strong> or <strong>${data.guestPhone}</strong> within a few hours to confirm and collect payment.
        </p>
      </div>

      <hr style="border:none;border-top:1px solid #f1f5f9;margin:24px 0;" />

      <!-- Footer -->
      <p style="margin:0;font-size:12px;color:#94a3b8;line-height:1.8;">
        <strong style="color:#334155;">Downbeach Inn</strong><br />
        3601 Pacific Ave, Atlantic City, NJ 08401<br />
        📞 (609) 348-9111 &nbsp;·&nbsp; ✉️ downbeach3601@gmail.com
      </p>
    </div>
  </div>
</body>
</html>`;

  const hotelHtml = `
<h2 style="color:#0d1b2a;">New Booking Request — ${data.confirmationCode}</h2>
<table style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px;">
  ${[
    ['Confirmation', data.confirmationCode],
    ['Guest', `${data.guestFirstName} ${data.guestLastName}`],
    ['Email', data.guestEmail],
    ['Phone', data.guestPhone],
    ['Address', guestAddress || '—'],
    ['Room', data.roomName],
    ['Check-in', data.checkIn],
    ['Check-out', data.checkOut],
    ['Nights', String(data.nights)],
    ['Adults', String(data.adults)],
    ['Children', String(data.children)],
    ['Total', `$${fmtMoney(data.total)}`],
    ['Special Requests', data.specialRequests || '—'],
  ].map(([l, v]) => `
    <tr>
      <td style="padding:6px 16px 6px 0;color:#64748b;font-weight:600;white-space:nowrap;">${l}</td>
      <td style="padding:6px 0;color:#1e293b;">${v}</td>
    </tr>
  `).join('')}
</table>`;

  await transporter.sendMail({
    from: `"Downbeach Inn" <${hotelEmail}>`,
    to: data.guestEmail,
    subject: `Booking Received · ${data.confirmationCode} — Downbeach Inn`,
    html: guestHtml,
  });

  await transporter.sendMail({
    from: `"Downbeach Inn Bookings" <${hotelEmail}>`,
    to: hotelEmail,
    subject: `New Booking: ${data.guestFirstName} ${data.guestLastName} · ${data.roomName} · ${data.checkIn}`,
    html: hotelHtml,
  });
}
