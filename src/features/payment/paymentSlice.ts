import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PaymentState {
  form: Record<string, any>;
}

const initialState: PaymentState = {
  form: {},
};

const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {
    setPaymentForm(state, action: PayloadAction<Record<string, any>>) {
      state.form = action.payload;
    },
    clearPaymentForm(state) {
      state.form = {};
    },
  },
});

export const { setPaymentForm, clearPaymentForm } = paymentSlice.actions;
export default paymentSlice.reducer;
