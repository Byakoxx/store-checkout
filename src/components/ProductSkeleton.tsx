const ProductSkeleton = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto px-4 py-8">
        <div className="h-10 bg-gray-200 rounded w-48 mx-auto mb-8 animate-pulse"></div>

        <div className="bg-white p-5 shadow-2xl rounded-lg">
          <div className="bg-card rounded-lg overflow-hidden max-w-sm mx-auto">
            <div className="aspect-square bg-gray-200 animate-pulse"></div>

            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="h-6 bg-gray-200 rounded w-2/3 animate-pulse"></div>
                <div className="h-8 bg-gray-200 rounded w-1/4 animate-pulse"></div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
              </div>

              <div className="h-5 bg-gray-200 rounded w-1/3 mb-6 animate-pulse"></div>

              <div className="h-12 bg-gray-200 rounded-2xl w-full animate-pulse"></div>
            </div>
          </div>
        </div>

        <div className="text-center mt-16">
          <div className="h-4 bg-gray-200 rounded w-64 mx-auto animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default ProductSkeleton;