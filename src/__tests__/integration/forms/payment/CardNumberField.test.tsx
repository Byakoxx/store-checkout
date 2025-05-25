import { render, screen, fireEvent } from '@testing-library/react';
import CardNumberField from '../../../../components/forms/payment/CardNumberField';
import placeholder from '../../../../assets/svg/product/placeholder.svg';
import * as cardUtils from '../../../../utils/cardUtils';

const mockRegister = jest.fn();
const mockSetValue = jest.fn();
const formatCardNumber = (v: string) => v.replace(/(\d{4})/g, '$1 ').trim();

type Props = {
  value?: string;
  error?: string;
  [key: string]: any;
};

function setup(props: Props = {}) {
  return render(
    <CardNumberField
      register={mockRegister}
      setValue={mockSetValue}
      formatCardNumber={formatCardNumber}
      value={props.value ?? ''}
      error={props.error}
      {...props}
    />
  );
}

describe('CardNumberField', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renderiza el input y el placeholder', () => {
    setup();
    expect(screen.getByPlaceholderText('1234 5678 9012 3456')).toBeInTheDocument();
  });

  it('llama a setValue con el valor formateado al cambiar', () => {
    setup({ value: '' });
    const input = screen.getByPlaceholderText('1234 5678 9012 3456');
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: '4111111111111111' } });
    expect(mockSetValue).toHaveBeenCalledWith('cardNumber', '4111 1111 1111 1111', { shouldValidate: true });
  });

  it('enmascara el valor al perder el foco', () => {
    setup({ value: '4111 1111 1111 1111' });
    const input = screen.getByPlaceholderText('1234 5678 9012 3456') as HTMLInputElement;
    fireEvent.blur(input);
    expect(input.value).toBe('**** **** **** ****');
  });

  it('muestra el logo de la tarjeta detectada', () => {
    setup({ value: '4111 1111 1111 1111' });
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('alt', 'visa');
  });

  it('muestra el mensaje de error si existe', () => {
    setup({ error: 'Número inválido' });
    expect(screen.getByText('Número inválido')).toBeInTheDocument();
  });

  it('no renderiza logo si el tipo de tarjeta es desconocido', () => {
    setup({ value: '9999 9999 9999 9999' });
    expect(screen.queryByRole('img')).toBeNull();
  });

  it('muestra el placeholder si la imagen falla al cargar', () => {
    setup({ value: '4111 1111 1111 1111' });
    const img = screen.getByRole('img') as HTMLImageElement;
    fireEvent.error(img);
    expect(img.src).toContain(placeholder);
  });

  it('usa el placeholder si el tipo de tarjeta no tiene logo', () => {
    jest.spyOn(cardUtils, 'detectCardType').mockReturnValue('fakecard');
    setup({ value: '1234 5678 9012 3456' });
    const img = screen.getByRole('img') as HTMLImageElement;
    expect(img.src).toContain(placeholder);
  });
});
