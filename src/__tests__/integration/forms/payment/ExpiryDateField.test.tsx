import { render, screen, fireEvent } from '@testing-library/react';
import ExpiryDateField from '../../../../components/forms/payment/ExpiryDateField';
import { PaymentFormData } from '../../../../schemas/payment.schema';
import { UseFormRegister } from 'react-hook-form';

type Props = {
  value?: string;
  error?: string;
};

const mockRegister: UseFormRegister<PaymentFormData> = (name) => ({
  onChange: jest.fn(),
  onBlur: jest.fn(),
  name,
  ref: jest.fn(),
});
const formatExpiryDate = (v: string) => v.replace(/(\d{2})(\d{0,2})/, (m, m1, m2) => m2 ? `${m1}/${m2}` : m1);

function setup(props: Props = {}) {
  const onChange = jest.fn();
  return {
    onChange,
    ...render(
      <ExpiryDateField
        register={mockRegister}
        formatExpiryDate={formatExpiryDate}
        value={props.value ?? ''}
        error={props.error}
        onChange={onChange}
      />
    )
  };
}

describe('ExpiryDateField', () => {
  it('renderiza el input y el placeholder', () => {
    setup();
    expect(screen.getByPlaceholderText('MM/YY')).toBeInTheDocument();
  });

  it('llama a onChange con el valor formateado', () => {
    const { onChange } = setup({ value: '' });
    const input = screen.getByPlaceholderText('MM/YY');
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: '1225' } });
    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ target: expect.objectContaining({ value: '12/25' }) }));
  });

  it('muestra el valor formateado al enfocar y enmascarado al desenfocar', () => {
    setup({ value: '1225' });
    const input = screen.getByPlaceholderText('MM/YY') as HTMLInputElement;
    // Al enfocar, muestra el valor formateado
    fireEvent.focus(input);
    expect(input.value).toBe('12/25');
    // Al desenfocar, muestra el valor enmascarado
    fireEvent.blur(input);
    expect(input.value).toBe('****');
  });

  it('muestra el mensaje de error si existe', () => {
    setup({ error: 'Fecha inválida' });
    expect(screen.getByText('Fecha inválida')).toBeInTheDocument();
  });
});
