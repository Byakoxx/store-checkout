import { useEffect, useRef } from "react";

import { FocusTrap } from "focus-trap-react";
import { useSelector, useDispatch } from "react-redux";
import { ArrowLeft, CreditCard, Truck } from "lucide-react";

import { RootState } from "../app/store";
import { PaymentFlowState } from "../App";
import { Button } from "../components/ui/Button";
import { detectCardType } from "../utils/cardUtils";
import placeholder from "../assets/svg/product/placeholder.svg";
import { setProcessing } from '../features/transaction/transactionSlice';

const BASE_FEE = 5.00;
const DELIVERY_FEE = 3.00;

interface SummaryBackdropProps {
  onConfirm: () => void;
  onClose: () => void;
  frontLayerState: 'expanded' | 'revealed';
  onExpand: () => void;
  formData: PaymentFlowState;
}

const SummaryBackdrop = ({ onConfirm, onClose, frontLayerState, onExpand, formData }: SummaryBackdropProps) => {
  const dispatch = useDispatch();
  const isProcessing = useSelector((state: RootState) => state.transaction.isProcessing);
  const product = formData?.product;
  const form = formData || {};

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

  const handleConfirmClick = () => {
    dispatch(setProcessing(true));
    onConfirm();
    setTimeout(() => {
      dispatch(setProcessing(false));
      setTimeout(() => {
      }, 1000);
    }, 2000);
  };

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
            <div className="flex items-center space-x-4 py-4 border-y">
              <div className="relative w-16 h-16 flex-shrink-0">
                <img
                  src={product?.image || placeholder}
                  alt={product?.name || 'Product'}
                  className="object-contain"
                  loading="lazy"
                  onError={e => { e.currentTarget.src = placeholder; }}
                />
              </div>
              <div className="flex-1">
                <h3 className="font-medium">{product?.name || 'Product'}</h3>
                <p className="text-sm text-gray-500">Quantity: 1</p>
              </div>
              <div className="font-semibold">${product?.price.toFixed(2) || '0.00'}</div>
            </div>
          </div>
          <div className="flex flex-col space-y-2 my-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Base price:</span>
              <span className="font-semibold text-sm">${basePrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Fixed fee:</span>
              <span className="font-semibold text-sm">${BASE_FEE.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Delivery fee:</span>
              <span className="font-semibold text-sm">${DELIVERY_FEE.toFixed(2)}</span>
            </div>
          </div>
          <div className="flex justify-between font-bold border-t pt-2 mt-2">
            <span className="text-sm text-gray-500">Total:</span>
            <span className="font-semibold text-sm">${total.toFixed(2)}</span>
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
        <Button
          className="w-full py-3 text-lg"
          onClick={handleConfirmClick}
          disabled={isProcessing}
          aria-label="Confirm payment"
          ref={confirmBtnRef}
        >
          {isProcessing ? 'Processing payment...' : 'Confirm payment'}
        </Button>
      </div>
    </FocusTrap>
  );
};

export default SummaryBackdrop;