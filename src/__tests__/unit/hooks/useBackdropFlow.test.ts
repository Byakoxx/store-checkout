import { renderHook, act } from '@testing-library/react';
import { useBackdropFlow } from '../../../hooks/useBackdropFlow';
import { setCurrentStep } from '../../../features/transaction/transactionSlice';

// Mock react-redux hooks correctamente
import * as reactRedux from 'react-redux';

jest.mock('react-redux');

describe('useBackdropFlow', () => {
  const mockDispatch = jest.fn();
  const mockProduct = {
    id: '1',
    name: 'Test Product',
    price: 100,
    stock: 10,
    image: 'test.jpg',
    description: 'desc',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    (reactRedux.useDispatch as unknown as jest.Mock).mockReturnValue(mockDispatch);
    (reactRedux.useSelector as unknown as jest.Mock).mockReturnValue('product');
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useBackdropFlow());

    expect(result.current.frontLayerState).toBe('revealed');
    expect(result.current.showFrontLayer).toBe(false);
    expect(result.current.frontLayerType).toBe(null);
    expect(result.current.selectedProduct).toBeNull();
    expect(result.current.remountKey).toBe(0);
  });

  it('should handle start payment flow', () => {
    const { result } = renderHook(() => useBackdropFlow());

    act(() => {
      result.current.handleStartPayment(mockProduct);
    });

    act(() => {
      jest.advanceTimersByTime(60);
    });

    expect(result.current.selectedProduct).toEqual(mockProduct);
    expect(mockDispatch).toHaveBeenCalledWith(setCurrentStep('product'));
  });

  it('should handle close summary', () => {
    const { result } = renderHook(() => useBackdropFlow());

    act(() => {
      result.current.handleCloseSummary();
    });

    expect(result.current.frontLayerState).toBe('revealed');
    expect(result.current.remountKey).toBe(1);
  });

  it('should handle confirm', () => {
    const { result } = renderHook(() => useBackdropFlow());

    act(() => {
      result.current.handleConfirm();
    });

    expect(result.current.frontLayerState).toBe('revealed');
  });

  it('should handle expand and reveal', () => {
    const { result } = renderHook(() => useBackdropFlow());

    act(() => {
      result.current.handleExpand();
    });
    expect(result.current.frontLayerState).toBe('expanded');

    act(() => {
      result.current.handleReveal();
    });
    expect(result.current.frontLayerState).toBe('revealed');
  });

  it('should reset flow', () => {
    const { result } = renderHook(() => useBackdropFlow());

    act(() => {
      result.current.resetFlow();
    });

    expect(result.current.frontLayerState).toBe('revealed');
    expect(result.current.showFrontLayer).toBe(false);
    expect(result.current.selectedProduct).toBeNull();
  });

  it('should update front layer state when current step changes', () => {
    const { result, rerender } = renderHook(() => useBackdropFlow());

    (reactRedux.useSelector as unknown as jest.Mock).mockReturnValue('summary');
    rerender();

    expect(result.current.frontLayerType).toBe('summary');
    expect(result.current.showFrontLayer).toBe(true);
  });
});
