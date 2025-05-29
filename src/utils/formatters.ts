const CURRENCY_FORMATTER = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'COP',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export const formatMoney = (amount: number): string => {
  return CURRENCY_FORMATTER.format(amount);
};