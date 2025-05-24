import { PaymentFormData } from '../types/payment.types';

export interface PaymentResponse {
  success: boolean;
  transactionId?: string;
  error?: string;
}

export const processPayment = async (
  paymentData: PaymentFormData
): Promise<PaymentResponse> => {
  try {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return {
      success: true,
      transactionId: Math.random().toString(36).substring(7),
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Ha ocurrido un error',
    };
  }
};