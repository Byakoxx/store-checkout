import { useEffect, useState } from "react";

import { X } from "lucide-react";

import { cn } from "../utils/utils";
import { Product } from "../types/product";
import { Button } from "../components/ui/Button";
import { usePaymentForm } from "../hooks/usePaymentForm";
import { PaymentFormData } from "../types/payment.types";
import { processPayment } from "../services/payment.service";
import CVVField from "../components/forms/payment/CVVField";
import CardNameField from "../components/forms/payment/CardNameField";
import CardNumberField from "../components/forms/payment/CardNumberField";
import ExpiryDateField from "../components/forms/payment/ExpiryDateField";
import { Input } from "../components/ui/Input";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExited: () => void;
  product: Product;
}

const PaymentModal = ({ isOpen, onClose, onExited, product }: PaymentModalProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [show, setShow] = useState(isOpen);
  const [animation, setAnimation] = useState("in");

  const {
    register,
    handleSubmit,
    errors,
    formatCardNumber,
    formatExpiryDate,
    watch,
    setValue,
  } = usePaymentForm();

  const onSubmit = async (data: PaymentFormData) => {
    try {
      setIsProcessing(true);
      const response = await processPayment(data);

      if (response.success) {
        // Aquí puedes manejar el éxito del pago
        console.log('Pago exitoso:', response.transactionId);
        onClose();
      } else {
        // Aquí puedes manejar el error del pago
        console.error('Error en el pago:', response.error)
      }
    } catch (error) {
      console.error('Error al procesar el pago:', error)
    } finally {
      setIsProcessing(false);
    }
  };

  // Animación de entrada y salida del modal
  useEffect(() => {
    if (isOpen) {
      setShow(true);
      setAnimation("in");
    } else if (show) {
      setAnimation("out");
      const timeout = setTimeout(() => {
        setShow(false);
        onExited();
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [isOpen]);

  if (!show) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center fade-in animate-in  justify-center p-4 transition-opacity duration-300",
        animation === "in" ? "opacity-100" : "opacity-0"
      )}
    >
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-auto">
        {/* HEADER */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">Payment information</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* BODY */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-4">
          <CardNumberField
            register={register}
            setValue={setValue}
            error={errors.cardNumber?.message}
            formatCardNumber={formatCardNumber}
            value={watch('cardNumber')}
          />

          <div className="grid grid-cols-2 gap-4">
            <ExpiryDateField
              register={register}
              error={errors.expiryDate?.message}
              formatExpiryDate={formatExpiryDate}
            />

            <CVVField
              register={register}
              error={errors.cvv?.message}
            />
          </div>

          <CardNameField
            register={register}
            error={errors.cardName?.message}
          />

          <div className="space-y-4 pt-4 border-t">
            <h3 className="font-medium text-lg">Shipping information</h3>

            <Input
              label="Full name"
              {...register('fullName')}
              error={errors.fullName?.message}
              placeholder="Full name"
            />

            <Input
              label="Address"
              {...register('address')}
              error={errors.address?.message}
              placeholder="Address"
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="City"
                {...register('city')}
                error={errors.city?.message}
                placeholder="City"
              />
              <Input
                label="Zip code"
                {...register('zipCode')}
                error={errors.zipCode?.message}
                placeholder="Zip code"
              />
            </div>
          </div>


          {/* FOOTER */}
          <div className="pt-4">
            <Button
              type="submit"
              className="w-full py-6 text-lg rounded-lg"
              disabled={isProcessing}
            >
              {isProcessing ? 'Processing payment...' : 'Continue'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
};

export default PaymentModal;
