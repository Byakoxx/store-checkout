import productReducer, {
  addProduct,
  updateStock,
  removeProduct,
  setProducts,
  setStatus,
  setError,
  reduceStock,
} from '../../../features/product/productSlice';
import { Product } from '../../../types/product';

describe('productSlice', () => {
  const mockProduct: Product = {
    id: '1',
    name: 'Test Product',
    price: 100,
    stock: 10,
    image: 'test.jpg',
    description: 'Test Description',
  };

  const initialState = {
    products: [],
    status: 'idle' as const,
    error: null,
  };

  it('should handle initial state', () => {
    expect(productReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle addProduct', () => {
    const actual = productReducer(initialState, addProduct(mockProduct));
    expect(actual.products).toEqual([mockProduct]);
  });

  it('should handle updateStock', () => {
    const state = {
      ...initialState,
      products: [mockProduct],
    };
    const actual = productReducer(state, updateStock({ id: '1', quantity: 5 }));
    expect(actual.products[0].stock).toBe(5);
  });

  it('should handle removeProduct', () => {
    const state = {
      ...initialState,
      products: [mockProduct],
    };
    const actual = productReducer(state, removeProduct('1'));
    expect(actual.products).toEqual([]);
  });

  it('should handle setProducts', () => {
    const products = [mockProduct, { ...mockProduct, id: '2' }];
    const actual = productReducer(initialState, setProducts(products));
    expect(actual.products).toEqual(products);
  });

  it('should handle setStatus', () => {
    const actual = productReducer(initialState, setStatus('loading'));
    expect(actual.status).toBe('loading');
  });

  it('should handle setError', () => {
    const error = 'Test error';
    const actual = productReducer(initialState, setError(error));
    expect(actual.error).toBe(error);
  });

  it('should handle reduceStock', () => {
    const state = {
      ...initialState,
      products: [mockProduct],
    };
    const actual = productReducer(state, reduceStock({ productId: '1', quantity: 3 }));
    expect(actual.products[0].stock).toBe(7);
  });

  it('should not reduce stock below 0', () => {
    const state = {
      ...initialState,
      products: [mockProduct],
    };
    const actual = productReducer(state, reduceStock({ productId: '1', quantity: 15 }));
    expect(actual.products[0].stock).toBe(0);
  });

  it('should not update stock for non-existent product', () => {
    const state = {
      ...initialState,
      products: [mockProduct],
    };
    const actual = productReducer(state, updateStock({ id: '999', quantity: 5 }));
    expect(actual.products[0].stock).toBe(10);
  });
});
