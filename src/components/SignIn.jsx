import React, { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

const SignIn = () => {
    const [error, setError] = useState(null);
    const { register, handleSubmit, formState: { errors } } = useForm();

    const auth = getAuth();
    const navigate = useNavigate();


    const handleSignIn = async (data) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
            const user = userCredential.user;
            localStorage.setItem('user', JSON.stringify(user.reloadUserInfo));
            navigate('/');
        }
        catch (error) {
            setError(error.message);
        }
    };
    return (
        <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center'>
            <form  className='flex flex-col space-y-5 w-72'>
                <h1 className='text-5xl font-extrabold'>Sign In</h1>
                <input type="text" placeholder='Enter Email' className=' rounded-2xl  p-4 border-2 highlight outline-none' {...register('email')} />
                <input type="password" placeholder='Enter Password' className=' rounded-2xl  p-4 border-2 highlight outline-none' {...register('password')} />
                <button type='submit'  onClick={handleSubmit(handleSignIn)} className='rounded-2xl border-blue-200 p-2 bg-blue-600 text-white'>Sign In</button>
                <Link to="/signup" className="text-md text-green-950 font-semibold">Or SignUp instead</Link>
            </form>
        </div>
    )
}

export default SignIn
