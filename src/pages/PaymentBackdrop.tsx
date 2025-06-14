import { useEffect, useState, useRef } from "react";

import { FocusTrap } from "focus-trap-react";
import { ArrowLeft } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";

import { cn } from "../utils/utils";
import { RootState } from "../app/store";
import { Product } from "../types/product";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { usePaymentForm } from "../hooks/usePaymentForm";
import CVVField from "../components/forms/payment/CVVField";
import { PaymentFormData } from "../schemas/payment.schema";
import { setPaymentForm } from "../features/payment/paymentSlice";
import CardNameField from "../components/forms/payment/CardNameField";
import CardNumberField from "../components/forms/payment/CardNumberField";
import ExpiryDateField from "../components/forms/payment/ExpiryDateField";
import CountrySelect from "../components/forms/payment/CountrySelect";
import { PaymentFlowState } from "../App";

interface PaymentBackdropProps {
  isOpen: boolean;
  onClose: () => void;
  onExited: () => void;
  product: Product;
  frontLayerState: 'expanded' | 'revealed';
  onExpand: () => void;
  onReveal: () => void;
  onContinue: () => void;
  formData: PaymentFlowState;
  onFormChange: (formData: PaymentFlowState) => void;
}

const PaymentBackdrop = ({ isOpen, onClose, onExited, product, frontLayerState, onExpand, onReveal, onContinue, formData, onFormChange }: PaymentBackdropProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [show, setShow] = useState(isOpen);

  const dispatch = useDispatch();
  const paymentForm = useSelector((state: RootState) => state.payment.form);

  const {
    register,
    handleSubmit,
    errors,
    formatCardNumber,
    formatExpiryDate,
    watch,
    setValue,
    reset,
  } = usePaymentForm(paymentForm);

  const firstInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (paymentForm) {
      Object.entries(paymentForm).forEach(([field, value]) => {
        if (value && typeof value === 'string') {
          setValue(field as keyof PaymentFormData, value);
        }
      });
    }
  }, []);

  const onSubmit = async (data: PaymentFormData) => {
    const { fullName, country, address, city, zipCode, cardNumber, expiryDate, cvv } = data;
    const updatedForm = {
      product,
      fullName,
      country,
      address,
      city,
      zipCode,
      cardNumber,
      expiryDate,
      cvv,
      cardName: data.cardName || ''
    };

    dispatch(setPaymentForm(updatedForm));
    onFormChange(updatedForm);
    onContinue();
  };

  // Animación de entrada y salida del modal
  useEffect(() => {
    if (isOpen) {
      setShow(true);
    } else if (show) {
      const timeout = setTimeout(() => {
        setShow(false);
        onExited();
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        const modal = document.querySelector('[aria-label="Payment form"]');
        if (modal) {
          const input = modal.querySelector('input');
          if (input) (input as HTMLInputElement).focus();
        }
      }, 50);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen, onClose]);

  useEffect(() => {
    const subscription = watch((value) => {

      onFormChange({
        cardNumber: value.cardNumber || '',
        cardName: value.cardName || '',
        expiryDate: value.expiryDate || '',
        cvv: value.cvv || '',
        fullName: value.fullName || '',
        address: value.address || '',
        city: value.city || '',
        zipCode: value.zipCode || '',
        country: value.country || '',
        product: formData.product || product
      });
    });
    return () => subscription.unsubscribe();
  }, [watch, onFormChange, product, formData.product]);

  useEffect(() => {
    if (product && (!formData.product || formData.product.id !== product.id)) {
      onFormChange({
        ...formData,
        cardNumber: formData.cardNumber || '',
        cardName: formData.cardName || '',
        expiryDate: formData.expiryDate || '',
        cvv: formData.cvv || '',
        fullName: formData.fullName || '',
        address: formData.address || '',
        city: formData.city || '',
        zipCode: formData.zipCode || '',
        country: formData.country || '',
        product
      });
    }
  }, [product, formData, onFormChange]);

  if (!show) return null;

  return (
    <FocusTrap active={isOpen}>
      <div
        className={cn(
          "w-full max-w-md mx-auto bg-white rounded-t-2xl shadow-2xl p-6 transition-transform duration-300",
          frontLayerState === "expanded" ? "translate-y-0" : "translate-y-[85%]"
        )}
        style={{ minHeight: '60vh', maxHeight: '100vh' }}
        role="dialog"
        aria-modal="true"
        aria-label="Payment form"
      >
        {/* Handle visual */}
        <div
          className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-4 cursor-pointer"
          onClick={frontLayerState === 'expanded' ? onReveal : onExpand}
          title={frontLayerState === 'expanded' ? 'Revelar productos' : 'Expandir formulario'}
          aria-label={frontLayerState === 'expanded' ? 'Reveal products' : 'Expand payment form'}
        />
        {/* HEADER */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold flex-1 text-left">Payment information</h2>
          <Button
            variant="ghost"
            className="text-gray-500 flex items-center hover:text-gray-800 font-medium mr-2"
            onClick={onClose}
            aria-label="Back to summary"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
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
              <CountrySelect
                register={register}
                error={errors.country?.message}
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
              aria-label="Continue"
              type="submit"
              className="w-full py-6 text-lg rounded-lg"
              disabled={isProcessing}
            >
              {isProcessing ? 'Processing payment...' : 'Continue'}
            </Button>
          </div>
        </form>
      </div>
    </FocusTrap>
  )
};

export default PaymentBackdrop;
