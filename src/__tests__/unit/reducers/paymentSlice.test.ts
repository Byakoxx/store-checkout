import paymentReducer, {
  setPaymentForm,
  clearPaymentForm,
} from '../../../features/payment/paymentSlice';

describe('paymentSlice', () => {
  const initialState = {
    form: {},
  };

  it('should handle initial state', () => {
    expect(paymentReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle setPaymentForm', () => {
    const formData = {
      cardNumber: '4111111111111111',
      cardName: 'John Doe',
      expiryDate: '12/25',
      cvv: '123',
    };
    const actual = paymentReducer(initialState, setPaymentForm(formData));
    expect(actual.form).toEqual(formData);
  });

  it('should handle clearPaymentForm', () => {
    const state = {
      form: {
        cardNumber: '4111111111111111',
        cardName: 'John Doe',
        expiryDate: '12/25',
        cvv: '123',
      },
    };
    const actual = paymentReducer(state, clearPaymentForm());
    expect(actual.form).toEqual({});
  });

  it('should update existing form data', () => {
    const state = {
      form: {
        cardNumber: '4111111111111111',
        cardName: 'John Doe',
      },
    };
    const newData = {
      expiryDate: '12/25',
      cvv: '123',
    };
    const actual = paymentReducer(state, setPaymentForm(newData));
    expect(actual.form).toEqual(newData);
  });
});
