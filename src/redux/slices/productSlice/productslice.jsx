import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    products: [],
    orders: [],
    cartData: []
}

export const productSlice = createSlice({
    name: 'products',
    initialState: initialState,
    reducers: {
        setProducts: (state, action) => {
            state.products = action.payload
        },
        setOrders: (state, action) => {
            state.orders = action.payload
        },
        setCartData: (state, action) => {
            state.cartData = action.payload
        }

    }
})

export const { setProducts, setOrders, setCartData } = productSlice.actions;
export default productSlice.reducer;
