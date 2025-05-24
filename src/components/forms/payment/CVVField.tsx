import { InputHTMLAttributes } from 'react';
import { UseFormRegister } from 'react-hook-form';
import { PaymentFormData } from '../../../types/payment.types';

interface CVVFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  register: UseFormRegister<PaymentFormData>;
  error?: string;
}

export const CVVField = ({
  register,
  error,
  ...props
}: CVVFieldProps) => {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor="cvv" className="text-sm font-medium text-gray-700">
        CVV
      </label>
      <input
        id="cvv"
        type="text"
        maxLength={3}
        placeholder="123"
        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
          error
            ? 'border-red-500 focus:ring-red-200'
            : 'border-gray-300 focus:ring-blue-200'
        }`}
        {...register('cvv')}
        {...props}
      />
      {error && <span className="text-sm text-red-500">{error}</span>}
    </div>
  );
};