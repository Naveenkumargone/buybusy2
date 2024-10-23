import { configureStore } from '@reduxjs/toolkit';
import {thunk} from 'redux-thunk';
import { combineReducers } from 'redux';
import userReucer from './slices/userSlice/userslice';
import productReducer from './slices/productSlice/productslice';


const reducers = combineReducers({
    user: userReucer,
    product: productReducer,
})


const store = configureStore({
    reducer: reducers,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
})

export default store;