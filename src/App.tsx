import { useSelector, useDispatch } from "react-redux";

import { RootState } from "./app/store";
import ResultPage from "./pages/ResultPage";
import ProductPage from "./pages/ProductPage";
import SummaryBackdrop from "./pages/SummaryBackdrop";
import { setCurrentStep } from "./features/transaction/transactionSlice";

function App() {
  const dispatch = useDispatch();
  const currentStep = useSelector((state: RootState) => state.transaction.currentStep);

  // Si estamos en el resultado, pantalla completa
  if (currentStep === 'result') {
    return <ResultPage />;
  }

  // Estado de la front layer (summary)
  const isSummaryOpen = currentStep === 'summary';

  // Handlers para el backdrop
  const handleCloseSummary = () => {
    dispatch(setCurrentStep('product'));
  };
  const handleConfirm = () => {
    dispatch(setCurrentStep('result'));
  };

  console.log('currentStep', currentStep);
  console.log('isSummaryOpen', isSummaryOpen);

  return (
    <div className="relative min-h-screen bg-gray-50 overflow-hidden">
      {/* Back layer: productos */}
      <ProductPage />
      {/* Front layer: resumen de pago (backdrop, anclado abajo, deja ver parte de la back layer) */}
      <div
        className={`fixed left-0 right-0 bottom-0 z-30 transition-transform duration-300 ${isSummaryOpen ? 'translate-y-0' : 'translate-y-full'} flex justify-center pointer-events-none`}
        style={{ height: '60vh', maxHeight: '90vh' }}
      >
        <div className="w-full max-w-md pointer-events-auto">
          <SummaryBackdrop onConfirm={handleConfirm} onClose={handleCloseSummary} />
        </div>
      </div>
    </div>
  );
}

export default App;
