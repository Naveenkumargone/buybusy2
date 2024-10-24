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
import { auth } from '../index';


export default function Navbar() {
    const { currentUser } = useAuth(); // Get current user from useAuth

    const logoutSession = async () => {
        await signOut(auth);
        setTimeout(() => {
            toast.success("User logged out", { autoClose: 1000 });
        }, 100);
        localStorage.removeItem('userId')
    }


    return (
        <>
            <ToastContainer />
            <nav className='m-auto p-7 z-50 shadow-md w-full fixed top-0 bg-white'>
                <div className='flex justify-between w-full align-center'>
                    <div className="">
                        <Link to="/" className='sm:text-sm md:text-base lg:text-lg xl:text-xl text-md'>Busy Buy</Link>
                    </div>
                    <div className='flex align-baseline justify-between text-xl text-blue-700 font-semibold lg:space-x-10 sm:space-x-8 space-x-4'>
                        <Link to="/" className='flex items-center sm:text-sm md:text-base lg:text-lg xl:text-xl text-sm'>
                            <img src={home} className='lg:w-10 lg:h-10 md:w-9 md:h-9 w-8 h-8 object-cover sm:block hidden' alt="" />
                            <h1>Home</h1>
                        </Link>
                        {currentUser ? (
                            <>
                                <Link to="/orders" className='flex items-center sm:text-sm md:text-base lg:text-lg xl:text-xl text-sm'>
                                    <img src={orders} className='lg:w-10 lg:h-10 md:w-9 md:h-9 w-8 h-8 object-cover sm:block hidden' alt="" />
                                    <h1>My orders</h1>
                                </Link>
                                <Link to="/cart" className='flex items-center sm:text-sm md:text-base lg:text-lg xl:text-xl text-sm'>
                                    <img src={cart} className='lg:w-10 lg:h-10 md:w-9 md:h-9 w-8 h-8 object-cover sm:block hidden' alt="" />
                                    <h1>Cart</h1>
                                </Link>
                                <Link className='flex items-center sm:text-sm md:text-base lg:text-lg xl:text-xl text-sm' onClick={() => logoutSession()}>
                                    <img src={logout} className='lg:w-10 lg:h-10 md:w-9 md:h-9 sm:w-8 sm:h-8 object-cover w-6 h-6' alt="" />
                                    <h1>Logout</h1>
                                </Link>
                            </>
                        ) :
                            (
                                <>
                                    <Link to="/signin" className='flex items-center sm:text-sm md:text-base lg:text-lg xl:text-xl text-sm'>
                                        <img src={lock} className='lg:w-10 lg:h-10 md:w-9 md:h-9 w-8 h-8 object-cover sm:block hidden' alt="" />
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

