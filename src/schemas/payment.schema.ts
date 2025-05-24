import z from "zod"

export const paymentSchema = z.object({
  cardNumber: z.string()
    .min(16, "El número de tarjeta debe tener 16 dígitos")
    .max(16, "El número de tarjeta debe tener 16 dígitos")
    .regex(/^\d+$/, "Solo se permiten números"),
  cardName: z.string()
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .regex(/^[a-zA-Z\s]+$/, "Solo se permiten letras y espacios"),
  expiryDate: z.string()
    .regex(/^(0[1-9]|1[0-2])\/([0-9]{2})$/, "Formato inválido (MM/YY)"),
  cvv: z.string()
    .length(3, "El CVV debe tener 3 dígitos")
    .regex(/^\d+$/, "Solo se permiten números")
})

export type PaymentFormData = z.infer<typeof paymentSchema>