import { useState, useEffect } from "react";

import { useSelector, useDispatch } from "react-redux";

import { RootState } from "../app/store";
import { Product } from "../types/product";
import { setCurrentStep } from "../features/transaction/transactionSlice";

export function useBackdropFlow() {
  const dispatch = useDispatch();
  const currentStep = useSelector((state: RootState) => state.transaction.currentStep);
  const [frontLayerState, setFrontLayerState] = useState<'expanded' | 'revealed'>('expanded');
  const [showFrontLayer, setShowFrontLayer] = useState(false);
  const [frontLayerType, setFrontLayerType] = useState<'payment' | 'summary' | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [remountKey, setRemountKey] = useState(0);
  const [localStep, setLocalStep] = useState<'reset' | null>(null);

  useEffect(() => {
    if ((currentStep === 'product' && selectedProduct) || localStep === 'reset') {
      setFrontLayerType('payment');
      setShowFrontLayer(true);
      setTimeout(() => setFrontLayerState('expanded'), 10);
    } else if (currentStep === 'summary') {
      setFrontLayerType('summary');
      setShowFrontLayer(true);
      setTimeout(() => setFrontLayerState('expanded'), 10);
    } else {
      setFrontLayerState('revealed');
      setTimeout(() => setShowFrontLayer(false), 300);
    }
  }, [currentStep, selectedProduct, localStep]);

  const handleStartPayment = (product: Product) => {
    setRemountKey((k) => k + 1);
    setShowFrontLayer(false);
    setFrontLayerType(null);
    setSelectedProduct(null);
    setLocalStep('reset');
    setTimeout(() => {
      setSelectedProduct(product);
      setLocalStep(null);
      dispatch(setCurrentStep('product'));
    }, 60);
  };

  const handleCloseSummary = () => {
    setFrontLayerState('revealed');
    setRemountKey((k) => k + 1);
  };
  const handleConfirm = () => {
    setFrontLayerState('revealed');
  };
  const handleExpand = () => setFrontLayerState('expanded');
  const handleReveal = () => setFrontLayerState('revealed');

  return {
    currentStep,
    frontLayerState,
    showFrontLayer,
    frontLayerType,
    selectedProduct,
    remountKey,
    handleStartPayment,
    handleCloseSummary,
    handleConfirm,
    handleExpand,
    handleReveal,
    setFrontLayerState,
  };
}
