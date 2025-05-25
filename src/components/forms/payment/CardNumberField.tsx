import { InputHTMLAttributes, useMemo, useState } from 'react';
import { UseFormRegister, UseFormSetValue } from 'react-hook-form';

import { PaymentFormData } from '../../../schemas/payment.schema';
import { CARD_LOGOS, detectCardType } from '../../../utils/cardUtils';


interface CardNumberFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  register: UseFormRegister<PaymentFormData>;
  setValue: UseFormSetValue<PaymentFormData>;
  error?: string;
  formatCardNumber: (value: string) => string;
  value: string;
}


const maskCardNumber = (value: string) => {
  return value.replace(/\d/g, '*');
};

const CardNumberField = ({
  register,
  setValue,
  error,
  formatCardNumber,
  value,
  ...props
}: CardNumberFieldProps) => {
  const [isFocused, setIsFocused] = useState(false);

  const cardType = useMemo(() => detectCardType(value), [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value.replace(/\D/g, '');
    let maxLength = cardType === 'amex' ? 15 : 16;
    if (raw.length > maxLength) raw = raw.slice(0, maxLength);
    const formatted = formatCardNumber(raw);
    setValue('cardNumber', formatted, { shouldValidate: true });
  };

  const displayValue = isFocused ? value : maskCardNumber(value);

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor="cardNumber" className="text-sm font-medium text-gray-700">
        Card Number
      </label>
      <div className="relative">
        <input
          id="cardNumber"
          type="text"
          maxLength={19}
          placeholder="1234 5678 9012 3456"
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 pr-14 ${
            error
              ? 'border-red-500 focus:ring-red-200'
              : 'border-gray-300 focus:ring-black/30'
          }`}
          value={displayValue}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          autoComplete="cc-number"
          {...props}
        />
        {cardType && (
          <img
            src={CARD_LOGOS[cardType]}
            alt={cardType}
            className="absolute right-3 top-1/2 -translate-y-1/2 h-7 w-10 opacity-0 animate-fade-in"
            style={{ animation: 'fade-in 0.3s forwards' }}
          />
        )}
      </div>
      {error && <span className="text-sm text-red-500">{error}</span>}
    </div>
  );
};

export default CardNumberField;