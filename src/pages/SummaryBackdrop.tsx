import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../app/store";
import { Button } from "../components/ui/Button";
import { ArrowLeft, Check } from "lucide-react";
import placeholder from "../assets/svg/product/placeholder.svg";
import { useState } from "react";

const BASE_FEE = 5.00;
const DELIVERY_FEE = 3.00;

interface SummaryBackdropProps {
  onConfirm: () => void;
  onClose: () => void;
  frontLayerState: 'expanded' | 'revealed';
  onExpand: () => void;
  onReveal: () => void;
}

const SummaryBackdrop = ({ onConfirm, onClose, frontLayerState, onExpand, onReveal }: SummaryBackdropProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const product = useSelector((state: RootState) => state.payment.form.product);
  const form = useSelector((state: RootState) => state.payment.form);

  console.log('product', product);

  const basePrice = product?.price || 0;
  const total = basePrice + BASE_FEE + DELIVERY_FEE;

  const handleConfirmClick = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setTimeout(() => {
        onConfirm();
      }, 1000);
    }, 2000);
  };

  return (
    <div className="w-full h-full bg-white rounded-t-2xl shadow-2xl p-6 flex flex-col relative" style={{ minHeight: '320px' }}>
      {/* Handle visual */}
      <div
        className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-4 cursor-pointer"
        onClick={frontLayerState === 'expanded' ? onReveal : onExpand}
        title={frontLayerState === 'expanded' ? 'Revelar productos' : 'Expandir resumen'}
      />
      {/* Botón atrás y título */}
      <div className="flex items-center mb-4">
        <h2 className="text-xl font-bold flex-1 text-left">Summary Payment</h2>
        <Button
          variant="ghost"
          className="text-gray-500 flex items-center hover:text-gray-800 font-medium mr-2"
          onClick={onClose}
          aria-label="Back"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
      </div>
      <div className="mb-4 flex-1">
        <div className="flex justify-between">
          <div className="flex items-center space-x-4 py-4 border-y">
            <div className="relative w-16 h-16 flex-shrink-0">
              <img src={placeholder} alt={product.name} className="object-contain" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium">{product.name}</h3>
              <p className="text-sm text-gray-500">Quantity: 1</p>
            </div>
            <div className="font-semibold">${product.price.toFixed(2)}</div>
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
      </div>
        <Button className="w-full py-3 text-lg" onClick={handleConfirmClick} disabled={isProcessing}>
          {isProcessing ? 'Processing payment...' : 'Confirm payment'}
        </Button>
    </div>
  );
};

export default SummaryBackdrop;