import { InputHTMLAttributes, useState } from 'react';

import { UseFormRegister } from 'react-hook-form';

import { PaymentFormData } from '../../../schemas/payment.schema';

interface CVVFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  register: UseFormRegister<PaymentFormData>;
  error?: string;
}

const maskCVV = (value: string) => value.replace(/\d/g, '*');

const CVVField = ({
  register,
  error,
  value,
  onChange,
  ...props
}: CVVFieldProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const displayValue = isFocused ? value : maskCVV(value as string || '');

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
        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
          error
            ? 'border-red-500 focus:ring-red-200'
            : 'border-gray-300 focus:ring-black/30'
        }`}
        {...register('cvv')}
        value={displayValue}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onChange={onChange}
        autoComplete="cc-csc"
        {...props}
      />
      {error && <span className="text-sm text-red-500">{error}</span>}
    </div>
  );
};

export default CVVField;