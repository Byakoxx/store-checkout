import { InputHTMLAttributes } from 'react';

import { UseFormRegister } from 'react-hook-form';

import { PaymentFormData } from '../../../schemas/payment.schema';

interface CardNameFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  register: UseFormRegister<PaymentFormData>;
  error?: string;
}

const CardNameField = ({
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
        placeholder="Jose Perez"
        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${error
            ? 'border-red-500 focus:ring-red-200'
            : 'border-gray-300 focus:ring-black/30'
          }`}
        {...register('cardName')}
        {...props}
      />
      {error && <span className="text-sm text-red-500">{error}</span>}
    </div>
  );
};

export default CardNameField;