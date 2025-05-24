import { X } from "lucide-react"
import { Button } from "../components/ui/Button"
import { Product } from "../types/product"


interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  product: Product
}

const PaymentModal = ({ }: PaymentModalProps) => {
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

        </form>

        {/* FOOTER */}
        <div className="pt-4">
            <Button type="submit" className="w-full py-6 text-lg">
              Continuar
            </Button>
          </div>
      </div>
    </div>
  )
}

export default PaymentModal