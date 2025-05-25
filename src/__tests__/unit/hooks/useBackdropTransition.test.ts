import { renderHook, act } from '@testing-library/react';
import { useBackdropTransition } from '../../../hooks/useBackdropTransition';
import { setCurrentStep } from '../../../features/transaction/transactionSlice';
import * as reactRedux from 'react-redux';

jest.mock('react-redux');

describe('useBackdropTransition', () => {
  const mockDispatch = jest.fn();
  const clearTimeoutSpy = jest.spyOn(window, 'clearTimeout');
  const mockSetFrontLayerState = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    (reactRedux.useDispatch as unknown as jest.Mock).mockReturnValue(mockDispatch);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should handle payment confirmation', () => {
    const { result } = renderHook(() => useBackdropTransition({ setFrontLayerState: mockSetFrontLayerState }));

    act(() => {
      result.current.handlePaymentConfirm();
    });

    expect(mockSetFrontLayerState).toHaveBeenCalledWith('revealed');

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(mockDispatch).toHaveBeenCalledWith(setCurrentStep('summary'));
  });

  it('should handle summary confirmation', () => {
    const { result } = renderHook(() => useBackdropTransition({ setFrontLayerState: mockSetFrontLayerState }));

    act(() => {
      result.current.handleSummaryConfirm();
    });

    expect(mockSetFrontLayerState).toHaveBeenCalledWith('revealed');

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(mockDispatch).toHaveBeenCalledWith(setCurrentStep('result'));
  });

  it('should handle summary close', () => {
    const { result } = renderHook(() => useBackdropTransition({ setFrontLayerState: mockSetFrontLayerState }));

    act(() => {
      result.current.handleCloseSummary();
    });

    expect(mockSetFrontLayerState).toHaveBeenCalledWith('revealed');

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(mockDispatch).toHaveBeenCalledWith(setCurrentStep('product'));
  });
});
