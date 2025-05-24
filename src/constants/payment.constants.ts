export const CARD_NUMBER_LENGTH = 16;
export const CVV_LENGTH = 3;
export const EXPIRY_DATE_FORMAT = 'MM/YY';

export const CARD_TYPES = {
  VISA: 'visa',
  MASTERCARD: 'mastercard',
  AMEX: 'amex',
} as const;

export const CARD_PATTERNS = {
  VISA: /^4[0-9]{12}(?:[0-9]{3})?$/,
  MASTERCARD: /^5[1-5][0-9]{14}$/,
  AMEX: /^3[47][0-9]{13}$/,
} as const;