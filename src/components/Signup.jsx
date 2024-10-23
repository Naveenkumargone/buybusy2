import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { useNavigate } from 'react-router-dom';
import { addDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { auth, db } from '../index';
import { toast, ToastContainer } from 'react-toastify';
import bcrypt from 'bcryptjs';
import { createUserWithEmailAndPassword } from 'firebase/auth';

const Signup = () => {
    const [userData, setuserData] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm();

    const handleSignUp = async (data) => {
        try {
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
                toast.success('User created successfully',  { autoClose: 1000 });
            }, 500);
            navigate('/signin');

            // // Hash the password using bcrypt.hash() with a salt round of 10
            // const encryptedPassword = await bcrypt.hash(data.password, 10);

            // // Query Firestore to check if a user with the email already exists
            // const q = query(collection(db, "users"), where("email", "==", data.email));
            // const querySnapshot = await getDocs(q);

            // // Assuming that only one user with the email exists
            // let userdata;
            // querySnapshot.forEach((doc) => {
            //     userdata = doc.data();
            // });

            // if (userdata) {
            //     // User already exists, show the toast notification
            //     toast.error("User already exists");
            // } else {
            //     // If the user doesn't exist, create a new user
            //     const createdUser = await addDoc(collection(db, "users"), {
            //         name: data.name,
            //         email: data.email,
            //         password: encryptedPassword
            //     });

            //     if (createdUser) {
            //         // Show success notification on successful user creation
            //         setTimeout(() => {
            //             toast.success('User created successfully');
            //         }, 100);
            //         navigate('/');
            //     } else {
            //         // Show error notification if user creation fails
            //         toast.error('Something went wrong');
            //     }
            // }
        } catch (error) {
            // Handle any errors and show an error notification
            setError(error.message);
            setTimeout(() => {
                toast.error('Something went wrong during the sign-up process', { autoClose: 1000 });
            }, 500);
        }
    };


    return (
        <>
            <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center'>
                <form className='flex flex-col space-y-5 w-72'>
                    <h1 className='text-5xl font-extrabold'>Sign Up</h1>
                    <input type="text" placeholder='Enter name' className=' rounded-2xl  p-4 border-2 highlight outline-none' {...register('name')} />
                    <input type="text" placeholder='Enter Email' className=' rounded-2xl  p-4 border-2 highlight outline-none' {...register('email')} />
                    <input type="password" placeholder='Enter Password' className=' rounded-2xl  p-4 border-2 highlight outline-none' {...register('password')} />
                    <button type='submit' onClick={handleSubmit(handleSignUp)} className='rounded-2xl border-blue-200 p-2 bg-blue-600 text-white'>Sign Up</button>
                </form>
            </div>
        </>
    )
}

export default Signup
