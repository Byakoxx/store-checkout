import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface Transaction {
  id: string
  productId: string
  quantity: number
  totalAmount: number
  status: 'pending' | 'completed' | 'cancelled'
  createdAt: string
  updatedAt: string
}

interface TransactionState {
  transactions: Transaction[]
  currentTransaction: Transaction | null
  status: 'idle' | 'loading' | 'failed'
  error: string | null,
  currentStep: 'product' | 'summary' | 'result'
  isProcessing: boolean
  transactionId: string | null
  paymentId: string | null
}

const initialState: TransactionState = {
  transactions: [],
  currentTransaction: null,
  status: 'idle',
  error: null,
  currentStep: 'product',
  isProcessing: false,
  transactionId: null,
  paymentId: null
}

export const transactionSlice = createSlice({
  name: 'transaction',
  initialState,
  reducers: {
    createTransaction: (state, action: PayloadAction<Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>>) => {
      const newTransaction: Transaction = {
        ...action.payload,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      state.transactions.push(newTransaction)
      state.currentTransaction = newTransaction
    },
    updateTransactionStatus: (state, action: PayloadAction<{ id: string; status: Transaction['status'] }>) => {
      const transaction = state.transactions.find(t => t.id === action.payload.id)
      if (transaction) {
        transaction.status = action.payload.status
        transaction.updatedAt = new Date().toISOString()
      }
    },
    setCurrentTransaction: (state, action: PayloadAction<string>) => {
      state.currentTransaction = state.transactions.find(t => t.id === action.payload) || null
    },
    clearCurrentTransaction: (state) => {
      state.currentTransaction = null
    },
    setTransactions: (state, action: PayloadAction<Transaction[]>) => {
      state.transactions = action.payload
    },
    setStatus: (state, action: PayloadAction<'idle' | 'loading' | 'failed'>) => {
      state.status = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    setCurrentStep: (state, action: PayloadAction<'product' | 'summary' | 'result'>) => {
      state.currentStep = action.payload
    },
    setProcessing: (state, action: PayloadAction<boolean>) => {
      state.isProcessing = action.payload
    },
    setTransactionIds: (state, action: PayloadAction<{ transactionId: string; paymentId: string }>) => {
      state.transactionId = action.payload.transactionId;
      state.paymentId = action.payload.paymentId;
    },
    clearTransactionIds: (state) => {
      state.transactionId = null;
      state.paymentId = null;
    }
  }
})

export const {
  createTransaction,
  updateTransactionStatus,
  setCurrentTransaction,
  clearCurrentTransaction,
  setTransactions,
  setStatus,
  setError,
  setCurrentStep,
  setProcessing,
  setTransactionIds,
  clearTransactionIds
} = transactionSlice.actions

export default transactionSlice.reducer