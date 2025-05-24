import { InputHTMLAttributes } from 'react';
import { UseFormRegister } from 'react-hook-form';
import { PaymentFormData } from '../../../types/payment.types';

interface ExpiryDateFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  register: UseFormRegister<PaymentFormData>;
  error?: string;
  formatExpiryDate: (value: string) => string;
}

export const ExpiryDateField = ({
  register,
  error,
  formatExpiryDate,
  ...props
}: ExpiryDateFieldProps) => {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor="expiryDate" className="text-sm font-medium text-gray-700">
        Expiry Date
      </label>
      <input
        id="expiryDate"
        type="text"
        maxLength={5}
        placeholder="MM/YY"
        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
          error
            ? 'border-red-500 focus:ring-red-200'
            : 'border-gray-300 focus:ring-blue-200'
        }`}
        {...register('expiryDate', {
          onChange: (e) => {
            const formatted = formatExpiryDate(e.target.value);
            e.target.value = formatted;
          },
        })}
        {...props}
      />
      {error && <span className="text-sm text-red-500">{error}</span>}
    </div>
  );
};