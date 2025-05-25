import { InputHTMLAttributes, useState } from 'react';

import { UseFormRegister } from 'react-hook-form';

import { PaymentFormData } from '../../../schemas/payment.schema';

interface ExpiryDateFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  register: UseFormRegister<PaymentFormData>;
  error?: string;
  formatExpiryDate: (value: string) => string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const maskExpiry = (value: string) => value.replace(/\d/g, '*');

const ExpiryDateField = ({
  register,
  error,
  formatExpiryDate,
  value,
  onChange,
  ...props
}: ExpiryDateFieldProps) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value.replace(/[^0-9]/g, '');
    if (raw.length > 4) raw = raw.slice(0, 4);
    const formatted = formatExpiryDate(raw);
    onChange({ ...e, target: { ...e.target, value: formatted } });
  };

  const safeValue = value || '';
  const displayValue = isFocused ? formatExpiryDate(safeValue.replace(/[^0-9]/g, '').slice(0, 4)) : maskExpiry(safeValue);

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
        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${error
            ? 'border-red-500 focus:ring-red-200'
            : 'border-gray-300 focus:ring-black/30'
          }`}
        {...register('expiryDate')}
        value={displayValue}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onChange={handleChange}
        autoComplete="cc-exp"
        {...props}
      />
      {error && <span className="text-sm text-red-500">{error}</span>}
    </div>
  );
};

export default ExpiryDateField;