import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/client';
import { bookings, rooms, taxConfig } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { calcPricing } from '@/lib/pricing';
import { sendBookingEmails } from '@/lib/email';

function generateConfirmationCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = 'DB-';
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      roomId, checkIn, checkOut,
      adults, children,
      firstName, lastName, email, phone,
      address, city, state, zip,
      specialRequests,
    } = body;

    if (!roomId || !checkIn || !checkOut || !firstName || !lastName || !email || !phone) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }

    const [room] = await db.select().from(rooms).where(eq(rooms.id, Number(roomId)));
    if (!room) return NextResponse.json({ error: 'Room not found.' }, { status: 404 });

    const nights = Math.round(
      (new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000
    );
    if (nights <= 0) return NextResponse.json({ error: 'Invalid dates.' }, { status: 400 });

    const [tax] = await db.select().from(taxConfig).limit(1);
    const taxRate = tax?.ratePercent ?? 13.63;

    const pricing = calcPricing(room.basePricePerNight, nights, taxRate, Number(adults) || 2);
    const confirmationCode = generateConfirmationCode();

    await db.insert(bookings).values({
      confirmationCode,
      roomId: room.id,
      guestFirstName: firstName,
      guestLastName: lastName,
      guestEmail: email,
      guestPhone: phone,
      guestAddress: address || null,
      guestCity: city || null,
      guestState: state || null,
      guestZip: zip || null,
      checkIn,
      checkOut,
      nights,
      adults: Number(adults) || 2,
      children: Number(children) || 0,
      extraAdultFee: pricing.extraAdultFeePerNight * nights,
      pricePerNight: pricing.pricePerNight,
      subtotal: pricing.subtotal,
      taxAmount: pricing.taxAmount,
      total: pricing.total,
      specialRequests: specialRequests || null,
      status: 'pending',
    });

    await sendBookingEmails({
      confirmationCode,
      guestFirstName: firstName,
      guestLastName: lastName,
      guestEmail: email,
      guestPhone: phone,
      roomName: room.name,
      checkIn,
      checkOut,
      nights,
      adults: Number(adults) || 2,
      children: Number(children) || 0,
      pricePerNight: pricing.pricePerNight,
      subtotal: pricing.subtotal,
      taxAmount: pricing.taxAmount,
      total: pricing.total,
      specialRequests: specialRequests || undefined,
      guestAddress: address,
      guestCity: city,
      guestState: state,
      guestZip: zip,
    });

    return NextResponse.json({ success: true, confirmationCode });
  } catch (err) {
    console.error('[booking] error:', err);
    return NextResponse.json({ error: 'Booking failed. Please try again.' }, { status: 500 });
  }
}
