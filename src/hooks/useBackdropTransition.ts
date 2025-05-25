import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setCurrentStep } from '../features/transaction/transactionSlice';

type Step = 'product' | 'summary' | 'result';

interface UseBackdropTransitionProps {
  setFrontLayerState: (state: 'expanded' | 'revealed') => void;
}

export function useBackdropTransition({ setFrontLayerState }: UseBackdropTransitionProps) {
  const dispatch = useDispatch();
  const [pendingStep, setPendingStep] = useState<Step | null>(null);

  useEffect(() => {
    if (pendingStep) {
      const timeout = setTimeout(() => {
        dispatch(setCurrentStep(pendingStep));
        setPendingStep(null);
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [pendingStep, dispatch]);

  const handlePaymentConfirm = () => {
    setFrontLayerState('revealed');
    setPendingStep('summary');
  };

  const handleSummaryConfirm = () => {
    setFrontLayerState('revealed');
    setPendingStep('result');
  };

  const handleCloseSummary = () => {
    setFrontLayerState('revealed');
    setPendingStep('product');
  };

  return {
    handlePaymentConfirm,
    handleCloseSummary,
    handleSummaryConfirm
  };
}