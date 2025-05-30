import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from 'react-redux';
import { Home, XCircle, CheckCircle2 } from "lucide-react";

import { RootState } from "../app/store";
import logo from "../assets/svg/logo.svg";
import { Button } from "../components/ui/Button";
import { reduceStock } from "../features/product/productSlice";
import placeholder from '../assets/svg/product/placeholder.svg';
import { clearPaymentForm } from '../features/payment/paymentSlice';
import { setCurrentStep, clearTransactionIds } from '../features/transaction/transactionSlice';
import { checkTransactionStatus } from '../services/transaction.service';

interface ResultPageProps {
  onContinue?: () => void;
  transactionId?: string;
  paymentId?: string;
}

const ResultPage = ({ onContinue, transactionId, paymentId }: ResultPageProps) => {
  const dispatch = useDispatch();
  const [status, setStatus] = useState<'PENDING' | 'APPROVED' | 'DECLINED'>('PENDING');
  const [error, setError] = useState<string | null>(null);
  const isProcessing = useSelector((state: RootState) => state.transaction.isProcessing);
  const product = useSelector((state: RootState) => state.payment.form.product);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    const checkStatus = async () => {
      if (!transactionId || !paymentId) return;

      try {
        const response = await checkTransactionStatus(transactionId, paymentId);
        setStatus(response.status);

        if (response.status === 'PENDING') {
          // Check again in 2 seconds if still pending
          timeoutId = setTimeout(checkStatus, 2000);
        } else if (response.status === 'APPROVED') {
          dispatch(reduceStock({ productId: product.id, quantity: 1 }));
        }
      } catch (err) {
        console.error('Error checking transaction status:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
        setStatus('DECLINED');
      }
    };

    checkStatus();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [transactionId, paymentId, dispatch, product]);

  const handleContinue = () => {
    dispatch(clearPaymentForm());
    dispatch(setCurrentStep('product'));
    dispatch(clearTransactionIds());
    if (onContinue) onContinue();
  };

  if (isProcessing || status === 'PENDING') {
    return (
      <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center p-4">
        <div className="flex flex-col items-center text-center max-w-md">
          <div className="h-24 w-24 rounded-full border-4 border-gray-300 border-t-green-300 animate-spin mb-6"></div>
          <h1 className="text-2xl font-bold mb-2">Processing payment</h1>
          <p className="text-gray-600 mb-8">We are processing your payment. Please wait a moment...</p>
        </div>
        <div className="text-center flex items-center text-gray-500 text-sm mt-16">
          <p>Powered by</p>
          <img src={logo} alt="logo" className="w-10 h-10 -ml-1" loading="lazy" onError={e => { e.currentTarget.src = placeholder; }} />
        </div>
      </div>
    )
  }

  const isSuccess = status === 'APPROVED';

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center text-center max-w-md"
      >
        {isSuccess ? (
          <CheckCircle2 className="h-24 w-24 text-emerald-500 mb-6" />
        ) : (
          <XCircle className="h-24 w-24 text-red-500 mb-6" />
        )}

        <h1 className="text-2xl font-bold mb-2">{isSuccess ? "Payment successful" : "Payment failed"}</h1>

        <p className="text-gray-600 mb-8">
          {isSuccess
            ? "Your order has been processed correctly. You will receive an email with the details of your purchase."
            : error || "An error occurred while processing your payment. Please try again or use another payment method."}
        </p>

        <Button
          aria-label="Return to the store"
          onClick={handleContinue}
          className="w-full py-6 text-lg"
          variant={isSuccess ? "default" : "outline"}
        >
          <Home className="mr-2 h-5 w-5" />
          {isSuccess ? "Return to the store" : "Try again"}
        </Button>
      </motion.div>
    </div>
  )
};

export default ResultPage;