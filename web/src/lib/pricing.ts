/**
 * Shared pricing utilities — used on both server (queries) and client (booking form display).
 * No DB imports here so this file stays importable from client components.
 */

export const DEFAULT_TAX_RATE = 13.63; // percent — overridden by DB value at runtime

/**
 * Calculate tax and total from a nightly rate.
 * taxRate is expressed as a percentage (e.g. 13.63).
 */
export function calcPricing(pricePerNight: number, nights: number, taxRatePercent: number) {
  const subtotal = pricePerNight * nights;
  const taxAmount = subtotal * (taxRatePercent / 100);
  const total = subtotal + taxAmount;
  return {
    pricePerNight,
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

/** Format a dollar amount with two decimal places */
export function formatMoney(amount: number): string {
  return amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
