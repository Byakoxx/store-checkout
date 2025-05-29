import { PaymentFlowState } from '../App';

interface TransactionResponse {
  data: {
    id: string;
    created_at: string;
    amount_in_cents: number;
    reference: string;
    currency: string;
    payment_method_type: string;
    status: string;
  };
}

export const createTransaction = async (formData: PaymentFlowState, paymentToken: string): Promise<TransactionResponse> => {
  const payload = {
    amount: formData.product?.price ?? 0,
    currency: 'COP',
    payment_token: paymentToken,
    customer: {
      name: formData.fullName,
      email: 'helmerenriquetorres@gmail.com'
    },
    reference: `order-${Date.now()}`,
    items: 1,
    delivery: {
      country: formData.country,
      city: formData.city,
      address: formData.address,
      zipCode: formData.zipCode
    }
  };

  const response = await fetch('https://api-sandbox.co.uat.wompi.dev/v1/transactions', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer pub_stagtest_g2u0HQd3ZMh05hsSgTS2lUV8t3s4mOt7',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error('Failed to create transaction');
  }

  return response.json();
};