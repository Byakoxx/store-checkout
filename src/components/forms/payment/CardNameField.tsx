import { InputHTMLAttributes } from 'react';
import { UseFormRegister } from 'react-hook-form';
import { PaymentFormData } from '../../../types/payment.types';

interface CardNameFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  register: UseFormRegister<PaymentFormData>;
  error?: string;
}

export const CardNameField = ({
  register,
  error,
  ...props
}: CardNameFieldProps) => {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor="cardName" className="text-sm font-medium text-gray-700">
        Cardholder Name
      </label>
      <input
        id="cardName"
        type="text"
        placeholder="JOHN DOE"
        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${error
            ? 'border-red-500 focus:ring-red-200'
            : 'border-gray-300 focus:ring-blue-200'
          }`}
        {...register('cardName')}
        {...props}
      />
      {error && <span className="text-sm text-red-500">{error}</span>}
    </div>
  );
};