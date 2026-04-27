export const DEFAULT_TAX_RATE = 13.63;
export const EXTRA_ADULT_FEE = 10; // per adult above 2, per night

export function calcPricing(
  pricePerNight: number,
  nights: number,
  taxRatePercent: number,
  adults = 2,
) {
  const extraAdults = Math.max(0, adults - 2);
  const extraAdultFeePerNight = extraAdults * EXTRA_ADULT_FEE;
  const effectiveNightRate = pricePerNight + extraAdultFeePerNight;
  const subtotal = effectiveNightRate * nights;
  const taxAmount = subtotal * (taxRatePercent / 100);
  const total = subtotal + taxAmount;
  return {
    pricePerNight,
    effectiveNightRate,
    extraAdultFeePerNight,
    extraAdults,
    nights,
    subtotal: round2(subtotal),
    taxRatePercent,
    taxAmount: round2(taxAmount),
    total: round2(total),
  };
}

function round2(n: number) {
  return Math.round(n * 100) / 100;
}

export function formatMoney(amount: number): string {
  return amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
