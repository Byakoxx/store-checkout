import { createSlice, PayloadAction } from "@reduxjs/toolkit"


interface Product {
    id: string
    name: string
    price: number
    stock: number
    description?: string
    image?: string
}

interface ProductState {
    products: Product[]
    status: 'idle' | 'loading' | 'failed'
    error: string | null
}

const initialState: ProductState = {
    products: [],
    status: 'idle',
    error: null,
}

export const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    addProduct: (state, action: PayloadAction<Product>) => {
      state.products.push(action.payload)
    },
    updateStock: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
      const product = state.products.find(p => p.id === action.payload.id)
      if (product) {
        product.stock = action.payload.quantity
      }
    },
    removeProduct: (state, action: PayloadAction<string>) => {
      state.products = state.products.filter(product => product.id !== action.payload)
    },
    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.products = action.payload
    },
    setStatus: (state, action: PayloadAction<'idle' | 'loading' | 'failed'>) => {
      state.status = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    }
  }
})

export const { addProduct, updateStock, removeProduct, setProducts, setStatus, setError } = productSlice.actions

export default productSlice.reducer