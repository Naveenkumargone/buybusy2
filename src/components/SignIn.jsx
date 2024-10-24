import { signInWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { auth } from '../index';
import Error from './Errors/Error';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // FontAwesome icons

const SignIn = () => {
    const [Loader, setLoader] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm();

    const handlePasswordVisibility = () => {
        setShowPassword(prevState => !prevState);
    };

    const navigate = useNavigate();

    const handleSignIn = async (data) => {
        try {
            setLoader(true);
            const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
            const user = userCredential.user;
            localStorage.setItem('userId', user.uid);
            setTimeout(() => {
                toast.success("Login successful!", { autoClose: 1000 });
            }, 500);
            navigate('/');
        }
        catch (error) {
            if (error.code === 'auth/invalid-credential') {
                toast.error("User not found", { autoClose: 1000 });
            } else {
                toast.error('Something went wrong, Please try again', { autoClose: 1000 });
            }
        } finally {
            setLoader(false);
        }
    };


    return (
        <>
            <ToastContainer />
            <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center'>
                <form className='flex flex-col w-80' onSubmit={handleSubmit(handleSignIn)}>
                    <h1 className='text-5xl font-extrabold'>Sign In</h1>
                    <div className='mb-3 mt-5'>
                        <input type="text" placeholder='Enter Email'
                            className=' rounded-2xl p-2 border-2 highlight outline-none  w-full'
                            {...register('email', {
                                required: 'email is required',
                                minLength: {
                                    value: 12,
                                    message: 'email must be at least 12 characters long',
                                },
                                maxLength: {
                                    value: 50,
                                    message: 'email cannot exceed 50 characters',
                                }
                            })} />
                        {errors.email && <Error title={errors.email.message} />}
                    </div>

                    <div className=''>
                        <div className='relative'>
                            <input type={showPassword ? "password" : "text"} placeholder='Enter Password'
                                maxLength={50} minLength={8}
                                className=' rounded-2xl  p-2 border-2 highlight outline-none  w-full'
                                {...register('password', {
                                    required: 'password is required',
                                    minLength: {
                                        value: 8,
                                        message: 'password must be at least 8 characters long',
                                    },
                                    maxLength: {
                                        value: 50,
                                        message: 'password cannot exceed 50 characters',
                                    }
                                })} />
                            <span
                                className="absolute top-[30%] right-[8%] cursor-pointer"
                                onClick={handlePasswordVisibility}
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </span>
                        </div>
                        {errors.password && <Error title={errors.password.message} />}
                    </div>
                    <button type='submit' className='rounded-2xl border-blue-200 p-2 mt-5 mb-3 bg-blue-600 text-white'>
                        {Loader ? 'Signing in...' : 'Sign In'}
                    </button>
                    <Link to="/signup" className="text-md text-green-950 font-semibold">Or SignUp instead</Link>
                </form>
            </div>
        </>
    )
}

export default SignIn
