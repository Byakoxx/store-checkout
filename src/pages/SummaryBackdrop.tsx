import { useEffect, useRef, useState } from "react";

import { FocusTrap } from "focus-trap-react";
import { useSelector, useDispatch } from "react-redux";
import { ArrowLeft, CreditCard, Truck } from "lucide-react";

import { RootState } from "../app/store";
import { PaymentFlowState } from "../App";
import { Button } from "../components/ui/Button";
import { detectCardType } from "../utils/cardUtils";
import { formatMoney } from "../utils/formatters";
import placeholder from "../assets/svg/product/placeholder.svg";
import { setProcessing } from '../features/transaction/transactionSlice';
import { createTransaction } from '../services/transaction.service';
import { tokenizeCard } from "../services/card.service";
import { setCardToken } from "../features/payment/paymentSlice";
import { setTransactionIds } from '../features/transaction/transactionSlice';

const BASE_FEE = 2000;
const DELIVERY_FEE = 1800;

interface SummaryBackdropProps {
  onConfirm: () => void;
  onClose: () => void;
  frontLayerState: 'expanded' | 'revealed';
  onExpand: () => void;
  formData: PaymentFlowState;
}

const SummaryBackdrop = ({ onConfirm, onClose, frontLayerState, onExpand, formData }: SummaryBackdropProps) => {
  const dispatch = useDispatch();
  const [isLocalProcessing, setIsLocalProcessing] = useState(false);
  const isProcessing = useSelector((state: RootState) => state.transaction.isProcessing);
  const paymentState = useSelector((state: RootState) => state.payment.form as PaymentFlowState);

  // Usar el producto del estado de Redux
  const product = paymentState.product || formData?.product;
  const form = { ...paymentState, ...formData } as PaymentFlowState;

  // Agregar logs para debuggear
  console.log('SummaryBackdrop - formData completo:', formData);
  console.log('SummaryBackdrop - paymentState:', paymentState);
  console.log('SummaryBackdrop - product:', product);
  console.log('SummaryBackdrop - form:', form);

  const confirmBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (frontLayerState === 'expanded' && confirmBtnRef.current) {
      confirmBtnRef.current.focus();
    }
  }, [frontLayerState]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const basePrice = product?.price || 0;
  const total = basePrice + BASE_FEE + DELIVERY_FEE;

  const cardType = detectCardType(form.cardNumber || "");

  const handleConfirmClick = async () => {
    if (isLocalProcessing || isProcessing) return;

    try {
      setIsLocalProcessing(true);
      dispatch(setProcessing(true));

      if (!product) {
        throw new Error('Missing product information');
      }

      // Usar el estado de Redux para los datos del pago
      const paymentData = {
        cardNumber: paymentState.cardNumber.replace(/\s/g, ''),
        expiryDate: paymentState.expiryDate,
        cvv: paymentState.cvv,
        fullName: paymentState.fullName,
      };

      console.log('Iniciando tokenización...', {
        ...paymentData,
        cardNumber: paymentData.cardNumber.replace(/\d(?=\d{4})/g, "*")
      });

      const tokenResponse = await tokenizeCard(paymentData);
      console.log('Tarjeta tokenizada:', tokenResponse);

      dispatch(setCardToken(tokenResponse.data.id));

      console.log('Creando transacción con token:', tokenResponse.data.id);
      const transactionResponse = await createTransaction(paymentState, tokenResponse.data.id);
      console.log('Transacción creada:', transactionResponse);

      dispatch(setTransactionIds({
        transactionId: transactionResponse.id,
        paymentId: transactionResponse.paymentId
      }));


      await new Promise(resolve => setTimeout(resolve, 100));

      onConfirm();
    } catch (error: any) {
      console.error('Error en el proceso de pago:', error);
      const errorMessage = error.message || 'Hubo un error procesando el pago';
      alert(`Error: ${errorMessage}. Por favor, intenta de nuevo.`);
    } finally {
      setIsLocalProcessing(false);
      dispatch(setProcessing(false));
    }
  };

  const buttonDisabled = isLocalProcessing || isProcessing;
  const buttonText = buttonDisabled ? 'Processing payment...' : 'Confirm payment';

  console.log('product', product);

  return (
    <FocusTrap active={frontLayerState === 'expanded'}>
      <div
        className="w-full h-full bg-white rounded-t-2xl shadow-2xl p-6 flex flex-col relative"
        style={{ minHeight: '320px' }}
        role="dialog"
        aria-modal="true"
        aria-label="Payment summary"
      >
        {/* Handle visual */}
        <div
          className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-4 cursor-pointer"
          onClick={frontLayerState === 'expanded' ? onClose : onExpand}
          title={frontLayerState === 'expanded' ? 'Revelar productos' : 'Expandir resumen'}
          aria-label={frontLayerState === 'expanded' ? 'Reveal products' : 'Expand summary'}
        />
        {/* Botón atrás y título */}
        <div className="flex items-center mb-4">
          <h2 className="text-xl font-bold flex-1 text-left">Summary Payment</h2>
          <Button
            variant="ghost"
            className="text-gray-500 flex items-center hover:text-gray-800 font-medium mr-2"
            onClick={onClose}
            aria-label="Back to payment form"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
        </div>
        <div className="mb-4 flex-1">
          <div className="flex justify-between">
            <div className="flex items-center space-x-4 py-4 border-y w-full">
              <div className="relative w-16 h-16 flex-shrink-0">
                <img
                  src={product?.image || placeholder}
                  alt={product?.name || 'Product'}
                  className="object-cover w-16 h-16"
                  loading="lazy"
                  onError={e => { e.currentTarget.src = placeholder; }}
                />
              </div>
              <div className="flex-1">
                <h3 className="font-medium">{product?.name || 'Product'}</h3>
                <p className="text-sm text-gray-500">Quantity: 1</p>
              </div>
              <div className="font-semibold text-end">{formatMoney(product?.price || 0)}</div>
            </div>
          </div>
          <div className="flex flex-col space-y-2 my-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Base price:</span>
              <span className="font-semibold text-sm">{formatMoney(basePrice)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Fixed fee:</span>
              <span className="font-semibold text-sm">{formatMoney(BASE_FEE)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Delivery fee:</span>
              <span className="font-semibold text-sm">{formatMoney(DELIVERY_FEE)}</span>
            </div>
          </div>
          <div className="flex justify-between font-bold border-t pt-2 mt-2">
            <span className="text-sm text-gray-500">Total:</span>
            <span className="font-semibold text-sm">{formatMoney(total)}</span>
          </div>

          <div className="bg-gray-50 p-3 mt-5 rounded-lg space-y-2">
            <div className="flex items-center">
              <CreditCard className="h-5 w-5 text-gray-500 mr-2" />
              <div>
                <p className="text-sm font-medium">Payment method</p>
                <p className="text-sm text-gray-500">
                  {cardType ? cardType.charAt(0).toUpperCase() + cardType.slice(1) : "Card"} •••• {form.cardNumber.slice(-4)}
                </p>
              </div>
            </div>

            <div className="flex items-center">
              <Truck className="h-5 w-5 text-gray-500 mr-2" />
              <div>
                <p className="text-sm font-medium">Shipping address</p>
                <p className="text-sm text-gray-500">
                  {form.country}, {form.city}, {form.address}, {form.zipCode}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="pt-4">
          <Button
            ref={confirmBtnRef}
            onClick={handleConfirmClick}
            className="w-full py-6 text-lg rounded-lg"
            disabled={buttonDisabled}
            aria-label="Confirm payment"
          >
            {buttonText}
          </Button>
        </div>
      </div>
    </FocusTrap>
  );
};

export default SummaryBackdrop;