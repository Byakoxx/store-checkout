import React, { Suspense, useState, useCallback } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";

import { Product } from "./types/product";
import { RootState } from "./app/store";
import LoadingPage from "./components/LoadingPage";
import PaymentBackdrop from "./pages/PaymentBackdrop";
import SummaryBackdrop from "./pages/SummaryBackdrop";
import { useBackdropFlow } from "./hooks/useBackdropFlow";
import { PaymentFormData } from "./schemas/payment.schema";
import { useBackdropTransition } from "./hooks/useBackdropTransition";

const ResultPage = React.lazy(() => import("./pages/ResultPage"));
const ProductPage = React.lazy(() => import("./pages/ProductPage"));
const NotFoundPage = React.lazy(() => import("./pages/NotFoundPage"));

export type PaymentFlowState = PaymentFormData & { product: Product | null };

const EMPTY_FORM: PaymentFlowState = {
  cardNumber: "",
  cardName: "",
  expiryDate: "",
  cvv: "",
  fullName: "",
  address: "",
  city: "",
  zipCode: "",
  country: "",
  product: null,
};

function App() {
  const {
    currentStep,
    frontLayerState,
    showFrontLayer,
    frontLayerType,
    selectedProduct,
    remountKey,
    handleStartPayment: _handleStartPayment,
    handleExpand,
    handleReveal,
    setFrontLayerState,
    resetFlow,
  } = useBackdropFlow();

  const { handlePaymentConfirm, handleCloseSummary, handleSummaryConfirm } = useBackdropTransition({
    setFrontLayerState,
  });

  const [paymentForm, setPaymentForm] = useState<PaymentFlowState>(EMPTY_FORM);
  const transactionId = useSelector((state: RootState) => state.transaction.transactionId);
  const paymentId = useSelector((state: RootState) => state.transaction.paymentId);

  const handleStartPayment = (product: Product) => {
    setPaymentForm({ ...EMPTY_FORM, product });
    _handleStartPayment(product);
  };

  const handlePaymentFormChange = useCallback((formData: PaymentFlowState) => {
    setPaymentForm(formData);
  }, []);

  const handleResultContinue = () => {
    resetFlow();
  };

  const renderMainContent = () => {
    if (currentStep === 'result') {
      return (
        <ResultPage
          onContinue={handleResultContinue}
          transactionId={transactionId || undefined}
          paymentId={paymentId || undefined}
        />
      );
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
                  formData={paymentForm}
                  onFormChange={handlePaymentFormChange}
                />
              )}
              {frontLayerType === 'summary' && (
                <SummaryBackdrop
                  onConfirm={handleSummaryConfirm}
                  onClose={handleCloseSummary}
                  frontLayerState={frontLayerState}
                  onExpand={handleExpand}
                  formData={paymentForm}
                />
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <Router>
      <Suspense fallback={<LoadingPage />}>
        <Routes>
          <Route path="/" element={renderMainContent()} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
