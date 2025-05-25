import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { paymentSchema, type PaymentFormData } from '../schemas/payment.schema';

const DEFAULT_VALUES: PaymentFormData = {
  cardNumber: '4242 4242 4242 4242',
  cardName: 'John Doe',
  expiryDate: '12/25',
  cvv: '123',
  fullName: 'John Doe',
  country: 'United States',
  address: '123 Main St',
  city: 'New York',
  zipCode: '10001',
};

export const usePaymentForm = (defaultValues?: Partial<PaymentFormData>) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
    reset,
  } = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    mode: 'onChange',
    defaultValues: DEFAULT_VALUES,
  });

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 3) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    }
    return v;
  };

  return {
    register,
    handleSubmit,
    errors,
    isSubmitting,
    watch,
    setValue,
    reset,
    formatCardNumber,
    formatExpiryDate,
  };
};