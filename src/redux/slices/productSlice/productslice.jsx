import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    products: [],
    filteredProducts: [],
    checkboxProducts: [],
    orders: [],
    cartData: [],
    togglePrice: 750
}

export const productSlice = createSlice({
    name: 'products',
    initialState: initialState,
    reducers: {
        setProducts: (state, action) => {
            state.products = action.payload
        },
        setfilteredProducts: (state, action) => {
            state.filteredProducts = action.payload
        },
        setcheckboxProducts: (state, action) => {
            state.checkboxProducts = action.payload
        },
        setOrders: (state, action) => {
            state.orders = action.payload
        },
        setCartData: (state, action) => {
            state.cartData = action.payload
        },
        setTogglePrice: (state, action) => {
            state.togglePrice = action.payload
        }

    }
})

export const { setProducts, setOrders, setCartData, setTogglePrice, setfilteredProducts, setcheckboxProducts } = productSlice.actions;
export default productSlice.reducer;
