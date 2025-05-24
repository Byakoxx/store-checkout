export interface PaymentFormData {
  cardNumber: string;
  cardName: string;
  expiryDate: string;
  cvv: string;
}

export interface PaymentFormErrors {
  cardNumber?: string;
  cardName?: string;
  expiryDate?: string;
  cvv?: string;
}

export interface PaymentFormProps {
  onSubmit: (data: PaymentFormData) => void;
  isLoading?: boolean;
}