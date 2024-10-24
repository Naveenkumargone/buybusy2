import { createUserWithEmailAndPassword } from 'firebase/auth';
import { addDoc, collection } from 'firebase/firestore';
import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { auth, db } from '../index';
import Error from './Errors/Error';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // FontAwesome icons

const Signup = () => {
    const [Loader, setLoader] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    const handlePasswordVisibility = () => {
        setShowPassword(prevState => !prevState);
    };

    const handleSignUp = async (data) => {
        try {
            setLoader(true);
            // Use Firebase Authentication for sign-up
            const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
            const user = userCredential.user;

            // Add user data to Firestore
            await addDoc(collection(db, "users"), {
                name: data.name,
                email: user.email,
                password: data.password,
                userId: user.uid,
            });
            setTimeout(() => {
                toast.success('User created successfully', { autoClose: 1000 });
            }, 500);
            reset();
            navigate('/signin');
        } catch (error) {
            if (error.code === 'auth/email-already-in-use') {
                toast.error('This email is already in use. Please use a different email.', { autoClose: 1000 });
            } else {
                toast.error('Something went wrong, Please try again', { autoClose: 1000 });
            }
        } finally {
            setLoader(false)
        }
    };


    return (
        <>
            <ToastContainer />
            <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center'>
                <form className='flex flex-col w-80' onSubmit={handleSubmit(handleSignUp)}>
                    <h1 className='text-5xl font-extrabold'>Sign Up</h1>
                    <div className='mb-3 mt-5'>
                        <input type="text" placeholder='Enter name'
                            className=' rounded-2xl p-2 border-2 highlight outline-none  w-full'
                            {...register('name', {
                                required: 'Name is required',
                                minLength: {
                                    value: 3,
                                    message: 'Name must be at least 3 characters long',
                                },
                                maxLength: {
                                    value: 20,
                                    message: 'Name cannot exceed 20 characters',
                                }
                            })} />
                        {errors.name && <Error title={errors.name.message} />}
                    </div>

                    <div className='mb-3'>
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
                    <button type='submit' className='rounded-2xl border-blue-200 p-2 mt-5 bg-blue-600 text-white'>
                        {Loader ? 'Signing up...' : 'Sign Up'}
                    </button>
                </form>
            </div>
        </>
    )
}

export default Signup
