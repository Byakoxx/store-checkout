import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../app/store";
import { Button } from "../components/ui/Button";

const BASE_FEE = 5.00;
const DELIVERY_FEE = 3.00;

const SummaryBackdrop = ({ onConfirm, onClose, onCancel, frontLayerState, onExpand, onReveal }: { onConfirm: () => void, onClose: () => void, onCancel: () => void, frontLayerState: 'expanded' | 'revealed', onExpand: () => void, onReveal: () => void }) => {
  const product = useSelector((state: RootState) => state.payment.form.product);
  const form = useSelector((state: RootState) => state.payment.form);

  const basePrice = product?.price || 0;
  const total = basePrice + BASE_FEE + DELIVERY_FEE;

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
        <button
          className="text-gray-500 hover:text-gray-800 font-medium mr-2"
          onClick={onClose}
          aria-label="Back"
        >
          ← Back
        </button>
        <h2 className="text-xl font-bold flex-1 text-center">Resumen de pago</h2>
        <span className="w-12" /> {/* Espaciador para centrar el título */}
      </div>
      <div className="mb-4 flex-1">
        <div className="flex justify-between">
          <span>Producto:</span>
          <span>{product?.name}</span>
        </div>
        <div className="flex justify-between">
          <span>Precio base:</span>
          <span>${basePrice.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Tarifa fija:</span>
          <span>${BASE_FEE.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Tarifa de entrega:</span>
          <span>${DELIVERY_FEE.toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-bold border-t pt-2 mt-2">
          <span>Total:</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>
      <Button className="w-full py-3 text-lg" onClick={onConfirm}>
        Confirmar pago
      </Button>
      <button className="mt-4 w-full text-center text-muted-foreground" onClick={onCancel}>
        Cancelar
      </button>
    </div>
  );
};

export default SummaryBackdrop;