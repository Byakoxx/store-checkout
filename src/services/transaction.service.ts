import { PaymentFlowState } from '../App';

interface TransactionResponse {
  id: string;
  status: 'PENDING' | 'APPROVED' | 'DECLINED';
  amount: number;
  paymentId: string;
  customerId: string;
  productId: string;
  createdAt: string;
  updatedAt: string;
  items: number;
}

export const createTransaction = async (formData: PaymentFlowState, paymentToken: string, amount: number): Promise<TransactionResponse> => {

  console.log('formData', formData);
  const payload = {
    productId: formData.product?.id || 'prod-1',
    amount,
    vatFee: amount * 0.19,
    currency: 'COP',
    paymentToken,
    customer: {
      name: formData.fullName,
      email: 'helmerenriquetorres@gmail.com'
    },
    reference: `order-${Date.now()}`,
    items: 1,
    delivery: {
      country: formData.country === 'CO' ? 'Colombia' : 'United States',
      city: formData.city,
      address: formData.address,
      zipCode: formData.zipCode
    }
  };

  console.log('Payload de transacción:', payload);

  const response = await fetch('https://store-backend-production-5e1b.up.railway.app/v1/transactions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    console.error('Error response:', errorData);
    throw new Error(`Failed to create transaction: ${errorData ? JSON.stringify(errorData) : response.statusText}`);
  }

  return response.json();
};

export const checkTransactionStatus = async (transactionId: string, paymentId: string): Promise<TransactionResponse> => {
  const response = await fetch(`https://store-backend-production-5e1b.up.railway.app/v1/transactions/${transactionId}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      status: "APPROVED",
      paymentId
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    console.error('Error checking transaction status:', errorData);
    throw new Error(`Failed to check transaction status: ${errorData ? JSON.stringify(errorData) : response.statusText}`);
  }

  return response.json();
};