import { UseFormRegister } from "react-hook-form";
import { PaymentFormData } from "../../../schemas/payment.schema";

interface CountrySelectProps {
  register: UseFormRegister<PaymentFormData>;
  error?: string;
}

const COUNTRIES = [
  { code: "CO", name: "Colombia" },
  { code: "US", name: "United States" },
  { code: "MX", name: "Mexico" },
  { code: "AR", name: "Argentina" },
  { code: "BR", name: "Brazil" },
  { code: "CL", name: "Chile" },
  { code: "PE", name: "Peru" },
  { code: "EC", name: "Ecuador" },
];

const CountrySelect = ({ register, error }: CountrySelectProps) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Country
      </label>
      <select
        {...register('country')}
        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 pr-14 ${
          error
            ? 'border-red-500 focus:ring-red-200'
            : 'border-gray-300 focus:ring-black/30'
        }`}
      >
        <option value="">Select a country</option>
        {COUNTRIES.map(({ code, name }) => (
          <option key={code} value={code}>
            {name}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default CountrySelect;
