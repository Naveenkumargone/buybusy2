import React from 'react'
import Sidebar from './Sidebar';
import Products from './Products';

const CartPage = ({ cartTrue }) => {
    return (
        <>
                <div className="flex justify-between">
                    <Sidebar cartTrue={cartTrue}  />
                    <div className='w-10/12 p-10'>
                        <Products cartTrue={cartTrue} />
                    </div>
                </div>
        </>
    )
}

export default CartPage
