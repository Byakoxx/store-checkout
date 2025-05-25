import { useSelector } from "react-redux";

import { RootState } from "./app/store";
import ResultPage from "./pages/ResultPage";
import ProductPage from "./pages/ProductPage";
import SummaryBackdrop from "./pages/SummaryBackdrop";

function App() {

  const currentStep = useSelector((state: RootState) => state.transaction.currentStep)

  return (
    <>
      {currentStep === 'product' && <ProductPage />}
      {currentStep === 'summary' && <SummaryBackdrop />}
      {currentStep === 'result' && <ResultPage />}
    </>
  )
}

export default App
