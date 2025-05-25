import logo from "../assets/svg/logo.svg";

interface ResultPageProps {
  isProcessing: boolean;
}

const ResultPage = ({ isProcessing = true }: ResultPageProps) => {

  if(isProcessing) {
    return (
      <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center p-4">
        <div className="flex flex-col items-center text-center max-w-md">
          <div className="h-24 w-24 rounded-full border-4 border-gray-300 border-t-green-300 animate-spin mb-6"></div>
          <h1 className="text-2xl font-bold mb-2">Processing payment</h1>
          <p className="text-gray-600 mb-8">We are processing your payment. Please wait a moment...</p>
        </div>
        <div className="text-center flex items-center text-gray-500 text-sm mt-16">
          <p>Powered by</p>
          <img src={logo} alt="logo" className="w-10 h-10 -ml-1" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 relative">
      <div className="max-w-md mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-foreground mb-8 text-center">Payment successful</h1>
      </div>
    </div>
  )

};

export default ResultPage;