import visaLogo from '../assets/visa.svg';
import mcLogo from '../assets/mastercard.svg';
import amexLogo from '../assets/amex.svg';
import discoverLogo from '../assets/discover.svg';
import dinersLogo from '../assets/diners.svg';
import jcbLogo from '../assets/jcb.svg';
import unionpayLogo from '../assets/unionpay.svg';
import mirLogo from '../assets/mir.svg';
import maestroLogo from '../assets/maestro.svg';

const CARD_PATTERNS = {
  visa: /^4[0-9]{0,}/,
  mastercard: /^5[1-5][0-9]{0,}/,
  amex: /^3[47][0-9]{0,}/,
  discover: /^6(?:011|5[0-9]{2})[0-9]{0,}/,
  diners: /^3(?:0[0-5]|[68][0-9])[0-9]{0,}/,
  jcb: /^35[0-9]{0,}/,
  unionpay: /^62[0-9]{0,}/,
  mir: /^220[0-9]{0,}/,
  maestro: /^5018|5020|5038|6304|6703|6708|6759|6761|6762|6763|0604|6390/
};

export const CARD_LOGOS: Record<string, string> = {
  visa: visaLogo,
  mastercard: mcLogo,
  amex: amexLogo,
  discover: discoverLogo,
  diners: dinersLogo,
  jcb: jcbLogo,
  unionpay: unionpayLogo,
  mir: mirLogo,
  maestro: maestroLogo,
};

export function detectCardType(value: string | undefined | null): string | null {
  const val = typeof value === 'string' ? value.replace(/\s+/g, '') : '';
  for (const [type, pattern] of Object.entries(CARD_PATTERNS)) {
    if (pattern.test(val)) return type;
  }
  return null;
}
