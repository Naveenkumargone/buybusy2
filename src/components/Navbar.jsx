import React, { useEffect, useState } from 'react';
import home from '../assets/home.png';
import lock from '../assets/lock.png';
import cart from '../assets/cart.png';
import orders from '../assets/myorders.png';
import logout from '../assets/logout.png';
import { Link } from "react-router-dom";


export default function Navbar() {
    const [User, setUser] = useState(null);

    const auth = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        if (auth) {
            setUser(auth.localId, auth.email);
        }
    }, [auth, User]);


    function logoutSession() {
        localStorage.removeItem('user');
        setUser(null);
    }


    return (
        <nav className='m-auto p-7 z-10 shadow-md w-full overflow-hidden sticky top-0 z-10'>
            <div className='mx-16 flex justify-between w-100'>
                <div className="">
                    <Link to="/" className='text-xl'>Busy Buy</Link>
                </div>
                <div className='flex align-baseline justify-between text-xl text-blue-700 font-semibold space-x-10'>
                    <Link to="/" className='flex items-center'>
                        <img src={home} className='w-10 h-10 object-cover home' alt="" />
                        <h1>Home</h1>
                    </Link>
                    {User ? (
                        <>
                            <Link to="/orders" className='flex items-center'>
                                <img src={orders} className='w-10 h-10 object-cover home' alt="" />
                                <h1>My orders</h1>
                            </Link>
                            <Link to="/cart" className='flex items-center'>
                                <img src={cart} className='w-10 h-10 object-cover' alt="" />
                                <h1>Cart</h1>
                            </Link>
                            <Link className='flex items-center' onClick={() => logoutSession()}>
                                <img src={logout} className='w-10 h-10 object-cover' alt="" />
                                <h1>Logout</h1>
                            </Link>
                        </>
                    ) :
                        (
                            <>
                                <Link to="/signin" className='flex items-center'>
                                    <img src={lock} className='w-10 h-10 object-cover' alt="" />
                                    <h1>SignIn</h1>
                                </Link>
                            </>
                        )}
                </div>
            </div>
        </nav>
    )
}

