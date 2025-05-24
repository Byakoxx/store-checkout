import { configureStore } from '@reduxjs/toolkit'

import productReducer from '../features/product/productSlice'
import transactionReducer from '../features/transaction/transactionSlice'


export const store = configureStore({
    reducer: {
        product: productReducer,
        transaction: transactionReducer,
    },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
