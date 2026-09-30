// Exchange rates benchmarked to EUR (1 EUR =)
export const FX_RATES_TO_EUR: Record<string, number> = {
  EUR: 1.0,
  USD: 1.08,
  GBP: 0.84,
  NGN: 1650.0, // ~1,650 NGN per EUR
  PLN: 4.28,   // Polish Zloty
  HUF: 395.0,  // Hungarian Forint
  MYR: 4.85,   // Malaysian Ringgit
  THB: 37.2,   // Thai Baht
};

/**
 * Convert an amount in any currency to EUR
 */
export function convertToEur(amount: number, fromCurrency: string): number {
  const rate = FX_RATES_TO_EUR[fromCurrency] || 1;
  return amount / rate;
}

/**
 * Convert an amount in EUR to NGN
 */
export function convertEurToNgn(eurAmount: number): number {
  return eurAmount * (FX_RATES_TO_EUR['NGN'] || 1650);
}

/**
 * Format currency nicely for display
 */
export function formatCurrency(amount: number, currency: string): string {
  if (currency === 'NGN') {
    return `₦${Math.round(amount).toLocaleString('en-NG')}`;
  }
  if (currency === 'EUR') {
    return `€${Math.round(amount).toLocaleString('en-US')}`;
  }
  if (currency === 'USD') {
    return `$${Math.round(amount).toLocaleString('en-US')}`;
  }
  if (currency === 'GBP') {
    return `£${Math.round(amount).toLocaleString('en-GB')}`;
  }
  return `${amount.toLocaleString()} ${currency}`;
}

export function formatEuroAndNaira(eurAmount: number): string {
  const ngnAmount = convertEurToNgn(eurAmount);
  return `€${Math.round(eurAmount).toLocaleString('en-US')} / ~₦${(ngnAmount / 1_000_000).toFixed(1)}M`;
}
