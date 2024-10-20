import React, { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { useForm } from "react-hook-form";
import { useNavigate } from 'react-router-dom';

const Signup = () => {
    const [userData , setuserData] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm();
    const auth = getAuth();

    const handleSignUp = async (data) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
            const newUser = userCredential.user;    
            setuserData(newUser);
            navigate('/')
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center'>
            <form className='flex flex-col space-y-5 w-72'>
                <h1 className='text-5xl font-extrabold'>Sign Up</h1>
                <input type="text" placeholder='Enter name' className=' rounded-2xl  p-4 border-2 highlight outline-none' {...register('name')} />
                <input type="text" placeholder='Enter Email' className=' rounded-2xl  p-4 border-2 highlight outline-none' {...register('email')} />
                <input type="password" placeholder='Enter Password' className=' rounded-2xl  p-4 border-2 highlight outline-none' {...register('password')} />
                <button type='submit' onClick={handleSubmit(handleSignUp)} className='rounded-2xl border-blue-200 p-2 bg-blue-600 text-white'>Sign Up</button>
            </form>
        </div>
    )
}

export default Signup
