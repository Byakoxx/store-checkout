import React, { useEffect, useCallback } from 'react';

import { ShoppingCart } from "lucide-react";
import { useDispatch, useSelector } from 'react-redux';

import { RootState } from '../app/store';
import { Product } from '../types/product';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import StockDisplay from '../components/ui/StockDisplay';
import ProductSkeleton from '../components/ProductSkeleton';
import placeholder from '../assets/svg/product/placeholder.svg';
import { setProducts, setStatus } from '../features/product/productSlice';
import { useApi } from '../hooks/useApi';
import { formatMoney } from "../utils/formatters";

interface ProductPageProps {
  onStartPayment: (product: Product) => void;
}

export const ProductPage = ({ onStartPayment }: ProductPageProps) => {
  const products = useSelector((state: RootState) => state.product.products);
  const status = useSelector((state: RootState) => state.product.status);
  const dispatch = useDispatch();
  const { execute } = useApi<Product[]>();

  const fetchProducts = useCallback(async () => {
    if (status === 'loading' || products.length > 0) {
      return;
    }

    dispatch(setStatus('loading'));
    try {
      const data = await execute('/v1/products');
      dispatch(setProducts(data));
      dispatch(setStatus('idle'));
    } catch (error) {
      dispatch(setStatus('failed'));
      // Add a delay before retrying to prevent rapid retries
      setTimeout(() => {
        dispatch(setStatus('idle'));
      }, 5000);
    }
  }, [dispatch, execute, status, products.length]);

  useEffect(() => {
    if (status !== 'loading' && products.length === 0) {
      fetchProducts();
    }
  }, [fetchProducts, status, products.length]);

  if (status === 'loading') {
    return <ProductSkeleton />;
  }

  const handlePaymentClick = (product: Product) => {
    onStartPayment(product);
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
                  src={product.image || placeholder}
                  alt={product.name}
                  className="object-cover w-full h-full"
                  loading="lazy"
                  onError={e => { e.currentTarget.src = placeholder; }}
                />
              </div>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-semibold text-card-foreground">{product.name}</h2>
                  <span className="text-xl font-bold text-primary">{formatMoney(product.price)}</span>
                </div>
                <p className="text-muted-foreground text-sm mb-4">{product.description}</p>
                <StockDisplay stock={product.stock} />
                <Button
                  aria-label="Pay with credit card"
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
    </div>
  );
};

export default ProductPage;