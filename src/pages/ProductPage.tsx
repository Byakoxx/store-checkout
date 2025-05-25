import React, { useEffect, useState } from 'react';

import { ShoppingCart } from "lucide-react";
import { useDispatch, useSelector } from 'react-redux';

import { RootState } from '../app/store';
import PaymentModal from './PaymentModal';
import { Product } from '../types/product';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import StockDisplay from '../components/ui/StockDisplay';
import ProductSkeleton from '../components/ProductSkeleton';
import { setProducts, setStatus } from '../features/product/productSlice';

// Simulación de datos de API
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Premium Wireless Headphones',
    price: 129.99,
    stock: 10,
    image: 'https://via.placeholder.com/400',
    description: 'Wireless headphones with noise cancellation, long battery life and high fidelity sound. Perfect for work and leisure.'
  }
];

export const ProductPage: React.FC = () => {

  // State
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [modalShouldRender, setModalShouldRender] = useState(false);


  // Selectors
  const products = useSelector((state: RootState) => state.product.products);
  const status = useSelector((state: RootState) => state.product.status);
  const currentStep = useSelector((state: RootState) => state.transaction.currentStep);

  // Dispatch
  const dispatch = useDispatch();

  // Handlers
  const handlePaymentClick = (product: Product) => {
    setSelectedProduct(product);
    setIsPaymentModalOpen(true);
    setModalShouldRender(true);
  };

  const handleModalClose = () => {
    setIsPaymentModalOpen(false);
  };

  const handleModalExited = () => {
    setModalShouldRender(false);
    setSelectedProduct(null);
  };

  useEffect(() => {
    // Simular carga de API
    dispatch(setStatus('loading'));
    // Simular delay de red
    setTimeout(() => {
      dispatch(setProducts(mockProducts));
      dispatch(setStatus('idle'));
    }, 1000);
  }, [dispatch]);

  if (status === 'loading') {
    return <ProductSkeleton />;
  };

  return (
    <div className="min-h-screen bg-gray-50 relative">
      <div className="max-w-md mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-foreground mb-8 text-center">PayFlow Store</h1>
        <Card className="grid gap-8 bg-white p-5 shadow-2xl">
          {products.map((product) => (
            <div key={product.id} className="bg-card rounded-lg overflow-hidden max-w-sm mx-auto">
              <div className="aspect-square bg-secondary flex items-center justify-center">
                <img
                  src={product.image}
                  alt={product.name}
                  className="object-cover w-full h-full"
                />
              </div>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-semibold text-card-foreground">{product.name}</h2>
                  <span className="text-2xl font-bold text-primary">${product.price}</span>
                </div>
                <p className="text-muted-foreground text-sm mb-4">{product.description}</p>
                <StockDisplay stock={product.stock} />
                <Button
                  className="w-full bg-foreground text-background py-4 px-6 rounded-2xl font-medium hover:bg-muted transition-colors"
                  onClick={() => handlePaymentClick(product)}
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Pay with credit card
                </Button>
              </CardContent>
            </div>
          ))}
        </Card>
        <div className="text-center text-muted-foreground text-sm mt-16">
          © {new Date().getFullYear()} PayFlow Store. All rights reserved.
        </div>
      </div>

      {/* Front layer: PaymentModal tipo Backdrop */}
      {modalShouldRender && selectedProduct && isPaymentModalOpen && currentStep !== 'summary' && (
        <div className={`fixed left-0 right-0 bottom-0 z-40 transition-transform duration-300 ${isPaymentModalOpen ? 'translate-y-0' : 'translate-y-full'} max-w-md mx-auto`} style={{ minHeight: '60vh', maxHeight: '100vh' }}>
          <PaymentModal
            isOpen={isPaymentModalOpen}
            onClose={handleModalClose}
            onExited={handleModalExited}
            product={selectedProduct}
          />
        </div>
      )}
    </div>
  );
};

export default ProductPage;