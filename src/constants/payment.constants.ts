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
  DISCOVER: /^6(?:011|5[0-9]{2})[0-9]{12}$/,
  DINERS: /^3(?:0[0-5]|[68][0-9])[0-9]{11}$/,
  JCB: /^35[0-9]{14}$/,
  UNIONPAY: /^62[0-9]{14}$/,
  MIR: /^220[0-9]{16}$/,
  MAESTRO: /^5018|5020|5038|6304|6703|6708|6759|6761|6762|6763|0604|6390/
} as const;