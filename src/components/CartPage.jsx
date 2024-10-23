import React from 'react'
import Sidebar from './Sidebar';
import Products from './Products';

const CartPage = ({ cartTrue }) => {
    return (
        <>
            <Sidebar cartTrue={cartTrue} />
            <Products cartTrue={cartTrue} />
        </>
    )
}

export default CartPage
