
import z from "zod"
import { X } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { Product } from "../types/product"
import { Input } from "../components/ui/Input"
import { Button } from "../components/ui/Button"


const paymentSchema = z.object({
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

type PaymentFormData = z.infer<typeof paymentSchema>

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  product: Product
}

const PaymentModal = ({ isOpen, onClose, product }: PaymentModalProps) => {

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema)
  })

  const onSubmit = (data: PaymentFormData) => {
    console.log(data)
    // Aquí iría la lógica de procesamiento del pago
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-auto">

        {/* HEADER */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">Información de pago</h2>
          <Button variant="ghost" size="icon" onClick={() => { }}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* BODY */}
        <form className="space-y-2">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Número de tarjeta</label>
              <Input
                {...register("cardNumber")}
                placeholder="1234 5678 9012 3456"
                error={errors.cardNumber?.message}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Nombre en la tarjeta</label>
              <Input
                {...register("cardName")}
                placeholder="NOMBRE APELLIDO"
                error={errors.cardName?.message}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Fecha de expiración</label>
                <Input
                  {...register("expiryDate")}
                  placeholder="MM/YY"
                  error={errors.expiryDate?.message}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">CVV</label>
                <Input
                  {...register("cvv")}
                  type="password"
                  placeholder="123"
                  error={errors.cvv?.message}
                />
              </div>
            </div>
          </div>


          {/* FOOTER */}
          <div className="pt-4">
            <Button type="submit" className="w-full py-6 text-lg">
              Continuar
            </Button>
          </div>

        </form>
      </div>
    </div >
  )
}

export default PaymentModal
