import { PaymentFormData } from '../schemas/payment.schema';

interface TokenizeCardResponse {
  status: string;
  data: {
    id: string;
    created_at: string;
    brand: string;
    name: string;
    last_four: string;
    bin: string;
    exp_year: string;
    exp_month: string;
    card_holder: string;
  };
}

interface TokenizeData {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  fullName: string;
};

export const tokenizeCard = async (cardData: TokenizeData): Promise<TokenizeCardResponse> => {
  const [month, year] = cardData.expiryDate.split('/');

  const payload = {
    number: cardData.cardNumber.replace(/[\/\s]/g, ''),
    cvc: cardData.cvv,
    exp_month: month,
    exp_year: year,
    card_holder: cardData.fullName
  };

  const response = await fetch('https://api-sandbox.co.uat.wompi.dev/v1/tokens/cards', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer pub_stagtest_g2u0HQd3ZMh05hsSgTS2lUV8t3s4mOt7',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error('Failed to tokenize card');
  }

  return response.json();
};