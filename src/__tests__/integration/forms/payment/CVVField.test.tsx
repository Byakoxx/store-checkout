import { render, screen, fireEvent } from '@testing-library/react';
import CVVField from '../../../../components/forms/payment/CVVField';
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

function setup(props: Props = {}) {
  const onChange = jest.fn();
  return {
    onChange,
    ...render(
      <CVVField
        register={mockRegister}
        value={props.value ?? ''}
        error={props.error}
        onChange={onChange}
      />
    )
  };
}

describe('CVVField', () => {
  it('renderiza el input y el placeholder', () => {
    setup();
    expect(screen.getByPlaceholderText('123')).toBeInTheDocument();
  });

  it('llama a onChange al cambiar el valor', () => {
    const { onChange } = setup({ value: '' });
    const input = screen.getByPlaceholderText('123');
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: '456' } });
    expect(onChange).toHaveBeenCalled();
  });

  it('enmascara el valor al perder el foco', () => {
    setup({ value: '456' });
    const input = screen.getByPlaceholderText('123') as HTMLInputElement;
    fireEvent.blur(input);
    expect(input.value).toBe('***');
  });

  it('muestra el mensaje de error si existe', () => {
    setup({ error: 'CVV inválido' });
    expect(screen.getByText('CVV inválido')).toBeInTheDocument();
  });
});
