import ResultPage from "./pages/ResultPage";
import ProductPage from "./pages/ProductPage";
import SummaryBackdrop from "./pages/SummaryBackdrop";
import PaymentBackdrop from "./pages/PaymentBackdrop";
import { useBackdropFlow } from "./hooks/useBackdropFlow";
import { useBackdropTransition } from "./hooks/useBackdropTransition";

function App() {
  const {
    currentStep,
    frontLayerState,
    showFrontLayer,
    frontLayerType,
    selectedProduct,
    remountKey,
    handleStartPayment,
    handleExpand,
    handleReveal,
    setFrontLayerState,
  } = useBackdropFlow();

  const { handlePaymentConfirm, handleCloseSummary, handleSummaryConfirm } = useBackdropTransition({
    setFrontLayerState,
  });

  if (currentStep === 'result') {
    return <ResultPage />;
  }

  return (
    <div className="relative min-h-screen bg-gray-50 overflow-hidden">
      <ProductPage onStartPayment={handleStartPayment} />
      {showFrontLayer && (
        <div
          key={remountKey}
          className={`fixed left-0 right-0 bottom-0 z-30 transition-transform duration-300 flex justify-center pointer-events-none ${frontLayerState === 'expanded' ? 'translate-y-0' : 'translate-y-full'}`}
        >
          <div className="w-full max-w-md pointer-events-auto max-h-[90vh] overflow-y-auto">
            {frontLayerType === 'payment' && selectedProduct && (
              <PaymentBackdrop
                isOpen={frontLayerState === 'expanded'}
                onClose={handleReveal}
                onExited={() => {}}
                product={selectedProduct}
                frontLayerState={frontLayerState}
                onExpand={handleExpand}
                onReveal={handleReveal}
                onContinue={handlePaymentConfirm}
              />
            )}
            {frontLayerType === 'summary' && (
              <SummaryBackdrop
                onConfirm={handleSummaryConfirm}
                onClose={handleCloseSummary}
                frontLayerState={frontLayerState}
                onExpand={handleExpand}
                onReveal={handleReveal}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
