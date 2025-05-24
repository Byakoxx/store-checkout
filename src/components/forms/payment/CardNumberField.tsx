import { InputHTMLAttributes } from 'react';
import { UseFormRegister } from 'react-hook-form';
import { PaymentFormData } from '../../../types/payment.types';

interface CardNumberFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  register: UseFormRegister<PaymentFormData>;
  error?: string;
  formatCardNumber: (value: string) => string;
}

export const CardNumberField = ({
  register,
  error,
  formatCardNumber,
  ...props
}: CardNumberFieldProps) => {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor="cardNumber" className="text-sm font-medium text-gray-700">
        Card Number
      </label>
      <input
        id="cardNumber"
        type="text"
        maxLength={19}
        placeholder="1234 5678 9012 3456"
        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
          error
            ? 'border-red-500 focus:ring-red-200'
            : 'border-gray-300 focus:ring-blue-200'
        }`}
        {...register('cardNumber', {
          onChange: (e) => {
            const formatted = formatCardNumber(e.target.value);
            e.target.value = formatted;
          },
        })}
        {...props}
      />
      {error && <span className="text-sm text-red-500">{error}</span>}
    </div>
  );
};