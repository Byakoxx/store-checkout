import { useEffect, useState } from "react";

import { X } from "lucide-react";
import { useDispatch } from "react-redux";

import { cn } from "../utils/utils";
import { Product } from "../types/product";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { usePaymentForm } from "../hooks/usePaymentForm";
import { PaymentFormData } from "../types/payment.types";
import CVVField from "../components/forms/payment/CVVField";
import { processPayment } from "../services/payment.service";
import { setPaymentForm } from "../features/payment/paymentSlice";
import CardNameField from "../components/forms/payment/CardNameField";
import CardNumberField from "../components/forms/payment/CardNumberField";
import ExpiryDateField from "../components/forms/payment/ExpiryDateField";
import { setCurrentStep } from "../features/transaction/transactionSlice";

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

  const dispatch = useDispatch();

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
    setIsProcessing(true);
    dispatch(setPaymentForm(data));
    dispatch(setCurrentStep('summary'));
    setIsProcessing(false);
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
        "w-full max-w-md mx-auto bg-white rounded-t-2xl shadow-2xl p-6 transition-transform duration-300",
        animation === "in" ? "translate-y-0" : "translate-y-full"
      )}
      style={{ minHeight: '60vh', maxHeight: '100vh' }}
    >
      {/* Handle visual */}
      <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-4" />
      {/* HEADER */}
      <div className="flex items-center justify-between mb-4">
        <button className="text-gray-500 hover:text-gray-800 font-medium" onClick={onClose} aria-label="Atrás">
          ← Atrás
        </button>
        <h2 className="text-xl font-semibold flex-1 text-center">Payment information</h2>
        <span className="w-8" /> {/* Espaciador para centrar el título */}
      </div>
      {/* BODY */}
      <form onSubmit={handleSubmit(onSubmit)} className="p-0 space-y-4">
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
            value={watch('expiryDate')}
            onChange={e => setValue('expiryDate', e.target.value, { shouldValidate: true })}
          />
          <CVVField
            register={register}
            error={errors.cvv?.message}
            value={watch('cvv')}
            onChange={e => setValue('cvv', e.target.value, { shouldValidate: true })}
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
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Country"
              {...register('country')}
              error={errors.country?.message}
              placeholder="Country"
            />
            <Input
              label="Address"
              {...register('address')}
              error={errors.address?.message}
              placeholder="Address"
            />
          </div>
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
  )
};

export default PaymentModal;
