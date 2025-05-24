import { z } from 'zod';
import { CARD_NUMBER_LENGTH, CVV_LENGTH, CARD_PATTERNS } from '../constants/payment.constants';

export const paymentSchema = z.object({
  cardNumber: z
    .string()
    .transform((val) => val.replace(/\s+/g, ''))
    .refine((val) => val.length === CARD_NUMBER_LENGTH, {
      message: 'El número de tarjeta debe tener 16 dígitos',
    })
    .refine((val) => /^\d+$/.test(val), {
      message: 'El número de tarjeta solo debe contener dígitos',
    })
    .refine(
      (value) =>
        Object.values(CARD_PATTERNS).some(pattern => pattern.test(value)),
      {
        message: 'Número de tarjeta inválido',
      }
    ),
  cardName: z
    .string()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(50, 'El nombre debe tener menos de 50 caracteres')
    .refine((val) => /^[a-zA-ZáéíóúñÁÉÍÓÚÑ\s]*$/.test(val), {
      message: 'El nombre solo debe contener letras y espacios',
    }),
  expiryDate: z
    .string()
    .regex(/^(0[1-9]|1[0-2])\/([0-9]{2})$/, 'Formato de fecha inválido (MM/AA)')
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
      'La tarjeta ha expirado'
    ),
  cvv: z
    .string()
    .min(CVV_LENGTH, `El CVV debe tener ${CVV_LENGTH} dígitos`)
    .max(CVV_LENGTH, `El CVV debe tener ${CVV_LENGTH} dígitos`)
    .regex(/^\d+$/, 'El CVV solo debe contener dígitos'),
});

export type PaymentFormData = z.infer<typeof paymentSchema>