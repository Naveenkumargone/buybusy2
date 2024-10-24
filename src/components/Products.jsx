import axios from "axios";
import { collection, deleteDoc, doc, getDoc, getDocs, query, setDoc, updateDoc, where } from 'firebase/firestore';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import less from "../assets/less.png";
import more from "../assets/more.png";
import { db } from "../index";
import { setCartData, setfilteredProducts, setProducts } from '../redux/slices/productSlice/productslice';
import { SpinnerLoader } from './Loader';

const Products = ({ isOpen }) => {
    const dispatch = useDispatch();
    const inputRef = useRef(null);
    const [Loader, setLoader] = useState(null);
    const [inputValue, setInputValue] = useState('');
    const navigate = useNavigate();
    const togglePrice = useSelector((state) => state?.product?.togglePrice);
    const productsData = useSelector((state) => state?.product?.products);
    const filteredProducts = useSelector((state) => state?.product?.filteredProducts);
    const location = useLocation();
    const cartData = useSelector((state) => state?.product?.cartData);
    const checkboxValues = useSelector((state) => state.product.checkboxProducts);

    const isCart = location.pathname == '/cart';

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await axios.get("https://fakestoreapi.com/products");
                dispatch(setProducts(result.data));
            } catch (error) {
                console.error("Error fetching data", error);
            }
        };
        fetchData();
    }, [dispatch]);

    const handleInputChange = () => {
        setInputValue(inputRef.current.value); // Update inputValue whenever the input changes
    };


    useEffect(() => {
        if (productsData.length > 0) {
            const filteredData = productsData.filter(product => {
                if (checkboxValues.length === 0 && inputValue != '') {
                    return togglePrice > product.price && product.title.toLowerCase().includes(inputValue.toLowerCase());
                } else if (checkboxValues.length !== 0 && inputValue != '') {
                    return togglePrice > product.price && checkboxValues.includes(product.category) && product.title.toLowerCase().includes(inputValue.toLowerCase());
                } else {
                    if (checkboxValues.length !== 0) {
                        return togglePrice > product.price && checkboxValues.includes(product.category);
                    }
                    return togglePrice > product.price;
                }
            });
            dispatch(setfilteredProducts(filteredData));
        }

    }, [togglePrice, productsData, dispatch, checkboxValues, inputValue]);

    useEffect(() => {
        if (isCart) {
            fetchCartData();
        }
    }, [isCart]);

    const fetchCartData = async () => {
        try {
            const userId = localStorage.getItem('userId');
            if (!userId) {
                toast.error("User not found.");
                navigate('/signin');
                return;
            }
            const cartQuery = query(collection(db, "cart"), where("userid", '==', userId));
            const results = await getDocs(cartQuery);
            const fetchedCart = results.docs.map((doc) => ({ docId: doc.id, ...doc.data() }));
            dispatch(setCartData(fetchedCart));
        } catch (error) {
            console.log(error);
        }
    }


    const addToCart = async (data) => {
        try {

            const userId = localStorage.getItem('userId');

            if (!userId) {
                toast.error("You need to be logged in to add items to the cart.", { autoClose: 2000 });
                navigate('/signin');
                return;
            }
            setLoader(data.id);

            const prodRef = doc(db, 'cart', `${userId}_${data.id}`);
            const docSnap = await getDoc(prodRef);

            if (docSnap.exists()) {
                const currentQuantity = docSnap.data().quantity || 1;
                await updateDoc(prodRef, {
                    quantity: currentQuantity + 1 // Increment the quantity by 1
                });

                toast.success("Quantity updated in Cart", { autoClose: 1000 });
            } else {
                // Document does not exist, create a new one with quantity 1
                await setDoc(prodRef, {
                    id: data.id,
                    title: data.title,
                    category: data.category,
                    image: data.image,
                    price: Number(data.price.toFixed()), // Make sure price is a number
                    quantity: 1, // Set initial quantity as 1
                    userid: userId // Add the userId
                });
                toast.success("Product added to Cart", { autoClose: 1000 });
            }
            setLoader(null)
        } catch (error) {
            toast.error("Error adding to Cart", { autoClose: 1000 });
        }
    };


    async function updateQuantity(id, quantity) {
        try {
            if (quantity === 0) {
                removeCart(id);
            } else {
                const updateQuantity = { quantity: quantity };
                const prodRef = doc(db, "cart", id);
                await updateDoc(prodRef, updateQuantity);
                fetchCartData();
            }
        } catch (error) {
            console.log(error);
        }
    }

    async function removeCart(id) {
        try {
            const docRef = doc(db, "cart", id);
            await deleteDoc(docRef);
            fetchCartData();
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <>
            <ToastContainer />
            <div className={`ml-auto mx-3 pt-28 transition-all duration-300 ${isCart ? 'lg:w-[80%] w-[57%]' : (isOpen ? 'lg:w-[80%] w-[57%]' : 'sm:w-[95%] w-[88%] ')}`}>
                {!isCart && <div className='flex justify-center my-6 '>
                    <input type="text" placeholder='Search By Name' ref={inputRef} onChange={handleInputChange} className='lg:w-1/3 sm:w-2/3 w-11/12 smtext-xl text-sm border-violet-400 rounded-2xl p-3 border-2 highlight outline-none' />
                </div>}

                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-8'>
                    {
                        (location === '/cart' || isCart) ? (
                            cartData.length > 0 ? (
                                cartData.map((data) => (
                                    <div className='border-2 rounded-2xl p-8 shadow-sm' key={data.docId}>
                                        <img src={data.image} className='lg:w-72 lg:h-80 mb-4 w-32 h-32 m-auto' alt={data.title} />
                                        <div className='space-y-4'>
                                            <h1 className='text-ellipsis whitespace-nowrap overflow-hidden lg:text-xl text:md'>{data.title}</h1>
                                            <div className='flex justify-between text-2xl'>
                                                <p className='text-2xl font-bold text-gray-600'>₹ {data.price}</p>
                                                <div className='flex justify-evenly items-center w-1/2'>
                                                    <img className='cursor-pointer' src={less} alt="Decrease Quantity" onClick={() => updateQuantity(data.docId, data.quantity - 1)} />
                                                    {data.quantity}
                                                    <img className='cursor-pointer' src={more} alt="Increase Quantity" onClick={() => updateQuantity(data.docId, data.quantity + 1)} />
                                                </div>
                                            </div>
                                            <button
                                                type='submit'
                                                disabled={Loader === data.id}
                                                className='rounded-xl w-full border-blue-200 lg:p-3 p-1 bg-red-600 text-white lg:text-2xl text-md'
                                                onClick={() => removeCart(data.docId)}
                                            >
                                                {Loader === data.id ? 'Removing From Cart' : 'Remove From Cart'}
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <h1 className='text-center items-center text-3xl my-5'>Cart is Empty</h1>
                            )
                        ) : (
                            filteredProducts.map((data) => (
                                <div className='border-2 rounded-2xl p-8 shadow-sm' key={data.id}>
                                    <img src={data.image} className='lg:w-72 lg:h-80 mb-4 w-32 h-32 m-auto' alt={data.title} />
                                    <div className='space-y-4'>
                                        <h1 className='text-ellipsis whitespace-nowrap overflow-hidden lg:text-xl text:md'>{data.title}</h1>
                                        <p className='text-2xl font-bold text-gray-600'>₹ {data.price}</p>
                                        <button
                                            type='submit'
                                            disabled={Loader === data.id}
                                            className='rounded-xl w-full border-blue-200 lg:p-3 p-1 bg-blue-600 text-white lg:text-2xl text-md'
                                            onClick={() => addToCart(data)}
                                        >
                                            {Loader === data.id ? 'Adding To Cart...' : 'Add To Cart'}
                                        </button>
                                    </div>
                                </div>
                            ))
                        )
                    }
                </div>
            </div>
            {filteredProducts.length == 0 && !isCart && <SpinnerLoader />}
        </>
    )
}

export default Products
