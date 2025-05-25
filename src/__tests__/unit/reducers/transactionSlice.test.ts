import transactionReducer, {
  createTransaction,
  updateTransactionStatus,
  setCurrentTransaction,
  clearCurrentTransaction,
  setTransactions,
  setStatus,
  setError,
  setCurrentStep,
  setProcessing,
} from '../../../features/transaction/transactionSlice';

describe('transactionSlice', () => {
  const mockTransaction = {
    productId: '1',
    quantity: 2,
    totalAmount: 200,
    status: 'pending' as const,
  };

  const initialState = {
    transactions: [],
    currentTransaction: null,
    status: 'idle' as const,
    error: null,
    currentStep: 'product' as const,
    isProcessing: false,
  };

  it('should handle initial state', () => {
    expect(transactionReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle createTransaction', () => {
    const actual = transactionReducer(initialState, createTransaction(mockTransaction));
    expect(actual.transactions).toHaveLength(1);
    expect(actual.currentTransaction).toBeTruthy();
    expect(actual.transactions[0]).toMatchObject({
      ...mockTransaction,
      id: expect.any(String),
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    });
  });

  it('should handle updateTransactionStatus', () => {
    const state = {
      ...initialState,
      transactions: [{
        ...mockTransaction,
        id: '1',
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
      }],
    };
    const actual = transactionReducer(
      state,
      updateTransactionStatus({ id: '1', status: 'completed' })
    );
    expect(actual.transactions[0].status).toBe('completed');
    expect(actual.transactions[0].updatedAt).not.toBe('2024-01-01');
  });

  it('should handle setCurrentTransaction', () => {
    const state = {
      ...initialState,
      transactions: [{
        ...mockTransaction,
        id: '1',
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
      }],
    };
    const actual = transactionReducer(state, setCurrentTransaction('1'));
    expect(actual.currentTransaction).toEqual(state.transactions[0]);
  });

  it('should set currentTransaction to null if id does not exist', () => {
    const state = {
      ...initialState,
      transactions: [{
        ...mockTransaction,
        id: '1',
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
      }],
    };
    const actual = transactionReducer(state, setCurrentTransaction('non-existent-id'));
    expect(actual.currentTransaction).toBeNull();
  });

  it('should handle clearCurrentTransaction', () => {
    const state = {
      ...initialState,
      currentTransaction: {
        ...mockTransaction,
        id: '1',
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
      },
    };
    const actual = transactionReducer(state, clearCurrentTransaction());
    expect(actual.currentTransaction).toBeNull();
  });

  it('should handle setTransactions', () => {
    const transactions = [{
      ...mockTransaction,
      id: '1',
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
    }];
    const actual = transactionReducer(initialState, setTransactions(transactions));
    expect(actual.transactions).toEqual(transactions);
  });

  it('should handle setStatus', () => {
    const actual = transactionReducer(initialState, setStatus('loading'));
    expect(actual.status).toBe('loading');
  });

  it('should handle setError', () => {
    const error = 'Test error';
    const actual = transactionReducer(initialState, setError(error));
    expect(actual.error).toBe(error);
  });

  it('should handle setCurrentStep', () => {
    const actual = transactionReducer(initialState, setCurrentStep('summary'));
    expect(actual.currentStep).toBe('summary');
  });

  it('should handle setProcessing', () => {
    const actual = transactionReducer(initialState, setProcessing(true));
    expect(actual.isProcessing).toBe(true);
  });
});
