import { configureStore } from '@reduxjs/toolkit'


export const store = configureStore({
    reducer: {
        // product: productReducer,
        // transaction: transactionReducer,
    },
})

// Inferencias de tipos para TS
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
