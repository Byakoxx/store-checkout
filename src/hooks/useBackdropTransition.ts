import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentStep } from '../features/transaction/transactionSlice';
import { RootState } from '../app/store';

type Step = 'product' | 'summary' | 'result';

interface UseBackdropTransitionProps {
  setFrontLayerState: (state: 'expanded' | 'revealed') => void;
}

export function useBackdropTransition({ setFrontLayerState }: UseBackdropTransitionProps) {
  const dispatch = useDispatch();
  const [pendingStep, setPendingStep] = useState<Step | null>(null);
  const transactionId = useSelector((state: RootState) => state.transaction.transactionId);
  const paymentId = useSelector((state: RootState) => state.transaction.paymentId);

  useEffect(() => {
    if (pendingStep) {
      const timeout = setTimeout(() => {
        // Solo cambiar a result si tenemos los IDs necesarios
        if (pendingStep === 'result' && (!transactionId || !paymentId)) {
          console.log('Esperando IDs de transacción antes de cambiar a result');
          return;
        }
        dispatch(setCurrentStep(pendingStep));
        setPendingStep(null);
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [pendingStep, dispatch, transactionId, paymentId]);

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