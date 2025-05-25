import { renderHook, act } from '@testing-library/react';
import { usePaymentForm } from '../../../hooks/usePaymentForm';
import { paymentSchema } from '../../../schemas/payment.schema';

describe('usePaymentForm', () => {
  const defaultValues = {
    cardNumber: '4242 4242 4242 4242',
    cardName: 'John Doe',
    expiryDate: '12/25',
    cvv: '123',
    fullName: 'John Doe',
    address: '123 Main St',
    city: 'New York',
    country: 'United States',
    zipCode: '10001'
  };

  it('should initialize with default values', () => {
    const { result } = renderHook(() => usePaymentForm());

    const values = result.current.watch();
    expect(values.cardNumber).toBe(defaultValues.cardNumber);
    expect(values.cardName).toBe(defaultValues.cardName);
    expect(values.expiryDate).toBe(defaultValues.expiryDate);
    expect(values.cvv).toBe(defaultValues.cvv);
  });

  it('should initialize with custom default values (fallbacks to defaults)', () => {
    const customDefaults = {
      cardNumber: '5555 5555 5555 5555',
      cardName: 'Jane Doe'
    };

    const { result } = renderHook(() => usePaymentForm(customDefaults));

    const values = result.current.watch();
    // El hook no soporta custom defaults, así que esperamos los defaults originales
    expect(values.cardNumber).toBe(defaultValues.cardNumber);
    expect(values.cardName).toBe(defaultValues.cardName);
  });

  it('should keep raw card number when setValue is used', () => {
    const { result } = renderHook(() => usePaymentForm());

    act(() => {
      result.current.setValue('cardNumber', '4242424242424242');
    });

    const values = result.current.watch();
    expect(values.cardNumber).toBe('4242424242424242');
  });

  it('should keep raw expiry date when setValue is used', () => {
    const { result } = renderHook(() => usePaymentForm());

    act(() => {
      result.current.setValue('expiryDate', '1225');
    });

    const values = result.current.watch();
    expect(values.expiryDate).toBe('1225');
  });

  it('should handle form submission with raw values', async () => {
    const onSubmit = jest.fn();
    const { result } = renderHook(() => usePaymentForm());

    act(() => {
      result.current.setValue('cardNumber', '4242 4242 4242 4242');
      result.current.setValue('cardName', 'John Doe');
      result.current.setValue('expiryDate', '12/25');
      result.current.setValue('cvv', '123');
      result.current.setValue('fullName', 'John Doe');
      result.current.setValue('address', '123 Main St');
      result.current.setValue('city', 'New York');
      result.current.setValue('country', 'United States');
      result.current.setValue('zipCode', '10001');
    });

    await act(async () => {
      await result.current.handleSubmit(onSubmit)();
    });

    expect(onSubmit).toHaveBeenCalledTimes(1);
    const call = onSubmit.mock.calls[0][0];
    expect(call).toEqual(expect.objectContaining({
      cardNumber: '4242424242424242',
      cardName: 'John Doe',
      expiryDate: '12/25',
      cvv: '123'
    }));
  });

  it('should reset form', () => {
    const { result } = renderHook(() => usePaymentForm());

    act(() => {
      result.current.setValue('cardNumber', '5555 5555 5555 5555');
      result.current.setValue('cardName', 'Jane Doe');
    });

    act(() => {
      result.current.reset();
    });

    const values = result.current.watch();
    expect(values.cardNumber).toBe(defaultValues.cardNumber);
    expect(values.cardName).toBe(defaultValues.cardName);
  });

  it('valida error de longitud incorrecta de número de tarjeta', () => {
    const data = {
      cardNumber: '1234', // longitud incorrecta
      cardName: 'Juan Perez',
      expiryDate: '12/25',
      cvv: '123',
      fullName: 'Juan Perez',
      address: 'Calle 123',
      city: 'Ciudad',
      zipCode: '12345',
      country: 'País',
    };
    const result = paymentSchema.safeParse(data);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some(issue => issue.message === 'Confirm card number')).toBe(true);
    }
  });
});

describe('formatCardNumber', () => {
  it('devuelve vacío si la entrada es vacía', () => {
    const { result } = renderHook(() => usePaymentForm());
    expect(result.current.formatCardNumber('')).toBe('');
  });

  it('devuelve la entrada si no hay dígitos', () => {
    const { result } = renderHook(() => usePaymentForm());
    expect(result.current.formatCardNumber('abcd')).toBe('abcd');
  });

  it('formatea correctamente menos de 4 dígitos', () => {
    const { result } = renderHook(() => usePaymentForm());
    expect(result.current.formatCardNumber('12')).toBe('12');
  });

  it('formatea correctamente 8 dígitos', () => {
    const { result } = renderHook(() => usePaymentForm());
    expect(result.current.formatCardNumber('12345678')).toBe('1234 5678');
  });

  it('formatea correctamente 16 dígitos', () => {
    const { result } = renderHook(() => usePaymentForm());
    expect(result.current.formatCardNumber('1234567812345678')).toBe('1234 5678 1234 5678');
  });

  it('ignora espacios y caracteres no numéricos', () => {
    const { result } = renderHook(() => usePaymentForm());
    expect(result.current.formatCardNumber('12 34-56ab')).toBe('1234 56');
  });

  it('trunca a 16 dígitos', () => {
    const { result } = renderHook(() => usePaymentForm());
    expect(result.current.formatCardNumber('12345678901234567890')).toBe('1234 5678 9012 3456');
  });
});

describe('formatExpiryDate', () => {
  it('devuelve vacío si la entrada es vacía', () => {
    const { result } = renderHook(() => usePaymentForm());
    expect(result.current.formatExpiryDate('')).toBe('');
  });

  it('devuelve solo los dígitos si hay menos de 3', () => {
    const { result } = renderHook(() => usePaymentForm());
    expect(result.current.formatExpiryDate('1')).toBe('1');
    expect(result.current.formatExpiryDate('12')).toBe('12');
  });

  it('formatea correctamente 4 dígitos', () => {
    const { result } = renderHook(() => usePaymentForm());
    expect(result.current.formatExpiryDate('1225')).toBe('12/25');
  });

  it('ignora espacios y caracteres no numéricos', () => {
    const { result } = renderHook(() => usePaymentForm());
    expect(result.current.formatExpiryDate('12/25')).toBe('12/25');
    expect(result.current.formatExpiryDate('12ab25')).toBe('12/25');
  });

  it('trunca a 4 dígitos', () => {
    const { result } = renderHook(() => usePaymentForm());
    expect(result.current.formatExpiryDate('123456')).toBe('12/34');
  });
});
