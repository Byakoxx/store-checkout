import { z } from 'zod';
import { CARD_NUMBER_LENGTH, CVV_LENGTH, CARD_PATTERNS, AMEX_CARD_NUMBER_LENGTH } from '../constants/payment.constants';

export const paymentSchema = z.object({
  cardNumber: z
    .string()
    .transform((val) => val.replace(/\s+/g, ''))
    .refine((val) => val.length === CARD_NUMBER_LENGTH || val.length === AMEX_CARD_NUMBER_LENGTH, {
      message: 'Confirm card number',
    })
    .refine((val) => /^\d+$/.test(val), {
      message: 'Card number must only contain digits',
    })
    .refine(
      (value) =>
        Object.values(CARD_PATTERNS).some(pattern => pattern.test(value)),
      {
        message: 'Invalid card number',
      }
    ),
  cardName: z
    .string()
    .min(3, 'Name must be at least 3 characters')
    .max(50, 'Name must be less than 50 characters')
    .refine((val) => /^[a-zA-ZáéíóúñÁÉÍÓÚÑ\s]*$/.test(val), {
      message: 'Name must only contain letters and spaces',
    }),
  expiryDate: z
    .string()
    .regex(/^(0[1-9]|1[0-2])\/([0-9]{2})$/, 'Invalid date format (MM/AA)')
    .refine(
      (value) => {
        const [month, year] = value.split('/');
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear() % 100;
        const currentMonth = currentDate.getMonth() + 1;

        const expYear = parseInt(year);
        const expMonth = parseInt(month);

        return (
          expYear > currentYear ||
          (expYear === currentYear && expMonth >= currentMonth)
        );
      },
      'Card has expired'
    ),
  cvv: z
    .string()
    .min(CVV_LENGTH, `CVV must be ${CVV_LENGTH} digits`)
    .max(CVV_LENGTH, `CVV must be ${CVV_LENGTH} digits`)
    .regex(/^\d+$/, 'CVV must only contain digits'),
  fullName: z
    .string()
    .min(3, 'Name must be at least 3 characters')
    .max(50, 'Name must be less than 50 characters')
    .refine((val) => /^[a-zA-ZáéíóúñÁÉÍÓÚÑ\s]*$/.test(val), {
      message: 'Name must only contain letters and spaces',
    }),
  address: z
    .string()
    .min(3, 'Address must be at least 3 characters')
    .max(100, 'Address must be less than 100 characters'),
  city: z
    .string()
    .min(3, 'City must be at least 3 characters'),
  zipCode: z
    .string()
    .min(5, 'Zip code must be at least 5 characters')
    .max(9, 'Zip code must be 9 characters'),
  country: z
    .string()
    .length(2, 'Country must be a 2-letter ISO code')
    .refine((val) => /^[A-Z]{2}$/.test(val), {
      message: 'Country must be a valid 2-letter ISO code',
    }),
});

export type PaymentFormData = z.infer<typeof paymentSchema>