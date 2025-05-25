import * as React from "react";

import { cn } from "../../utils/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, ...props }, ref) => {
    return (
      <div className="relative">
        <label htmlFor="cvv" className="text-sm font-medium text-gray-700">
          CVV
        </label>
        <input
          type={type}
          className={cn(
            "w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ",
            error
              ? 'border-red-500 focus:ring-red-200'
              : 'border-gray-300 focus:ring-blue-200',
            className
          )}
          ref={ref}
          {...props}
        />
        {error && <span className="text-sm text-red-500">{error}</span>}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
