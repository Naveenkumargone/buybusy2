import React from 'react';
import home from '../assets/home.png';
import lock from '../assets/lock.png';
import cart from '../assets/cart.png';
import orders from '../assets/myorders.png';
import logout from '../assets/logout.png';
import { Link } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';
import useAuth from '../auth/useAuth';
import { signOut } from 'firebase/auth';
import {auth} from '../index';


export default function Navbar() {
    const { currentUser } = useAuth(); // Get current user from useAuth

    const logoutSession = async () => {
        await signOut(auth);
        setTimeout(() => {
            toast.success("User logged out",  { autoClose: 1000 });
        }, 100);
        localStorage.removeItem('userId')
    }


    return (
        <>
            <nav className='m-auto p-7 z-50 shadow-md w-full fixed top-0 bg-white'>
                <div className='flex justify-between w-full'>
                    <div className="">
                        <Link to="/" className='text-xl'>Busy Buy</Link>
                    </div>
                    <div className='flex align-baseline justify-between text-xl text-blue-700 font-semibold space-x-10'>
                        <Link to="/" className='flex items-center'>
                            <img src={home} className='w-10 h-10 object-cover home' alt="" />
                            <h1>Home</h1>
                        </Link>
                        {currentUser ? (
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
        </>
    )
}

