import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PaymentState {
  form: Record<string, any>;
  cardToken: string | null;
}

const initialState: PaymentState = {
  form: {},
  cardToken: null,
};

const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {
    setPaymentForm(state, action: PayloadAction<Record<string, any>>) {
      state.form = action.payload;
    },
    setCardToken(state, action: PayloadAction<string>) {
      state.cardToken = action.payload;
    },
    clearPaymentForm(state) {
      state.form = {};
      state.cardToken = null;
    },
  },
});

export const { setPaymentForm, setCardToken, clearPaymentForm } = paymentSlice.actions;
export default paymentSlice.reducer;
