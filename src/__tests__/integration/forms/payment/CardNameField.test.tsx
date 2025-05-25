import { render, screen, fireEvent } from '@testing-library/react';
import CardNameField from '../../../../components/forms/payment/CardNameField';
import { PaymentFormData } from '../../../../schemas/payment.schema';
import { UseFormRegister } from 'react-hook-form';

type Props = Partial<{ error: string }>;

const mockRegister: UseFormRegister<PaymentFormData> = (name) => ({
  onChange: jest.fn(),
  onBlur: jest.fn(),
  name,
  ref: jest.fn(),
});

function setup(props: Props = {}) {
  return render(
    <CardNameField
      register={mockRegister}
      error={props.error}
    />
  );
}

describe('CardNameField', () => {
  it('renderiza el input y el placeholder', () => {
    setup();
    expect(screen.getByPlaceholderText('Jose Perez')).toBeInTheDocument();
  });

  it('permite escribir el nombre', () => {
    setup();
    const input = screen.getByPlaceholderText('Jose Perez') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'Juan Test' } });
    expect(input.value).toBe('Juan Test');
  });

  it('muestra el mensaje de error si existe', () => {
    setup({ error: 'Nombre inválido' });
    expect(screen.getByText('Nombre inválido')).toBeInTheDocument();
  });
});
