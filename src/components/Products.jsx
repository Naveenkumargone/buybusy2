import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { collection, addDoc, getDocs, updateDoc, doc, deleteDoc, getDoc, setDoc } from 'firebase/firestore';
import { db } from "../index";
import { toast, ToastContainer } from 'react-toastify';
import SearchBox from './SearchBox';
import axios from "axios";
import { setProducts } from '../redux/slices/productSlice/productslice';
import { useDispatch, useSelector } from 'react-redux';
import useAuth from '../auth/useAuth';
import { setCartData } from '../redux/slices/productSlice/productslice';
import more from "../assets/more.png";
import less from "../assets/less.png";

const Products = (props) => {
    const dispatch = useDispatch();
    const [Loader, setLoader] = useState(null);
    const [data, setData] = useState(null); // Start with null instead of undefined
    const [filteredData, setFilteredData] = useState(null);
    const navigate = useNavigate();
    const productsData = useSelector((state) => state?.product?.products);
    const { currentUser } = useAuth(); // Get current user from useAuth
    const location = useLocation();
    const cartData = useSelector((state) => state?.product?.cartData);

    const isCart = location.pathname == '/cart';

    useEffect(() => {
        if (isCart) {
            fetchCartData();
        }
    }, [isCart]);


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
    }, []);

    const fetchCartData = async () => {
        try {
            const results = await getDocs(collection(db, "cart"));
            const fetchedCart = results.docs.map((doc) => ({ docId: doc.id, ...doc.data() }));
            dispatch(setCartData(fetchedCart))
        } catch (error) {
            console.log(error);
        }
    }

    const deleteAllDocumentsInCollection = async (collectionName) => {
        const collectionRef = collection(db, collectionName);

        try {
            const querySnapshot = await getDocs(collectionRef);
            const deletePromises = [];

            querySnapshot.forEach((doc) => {
                deletePromises.push(deleteDoc(doc.ref)); // Prepare a promise to delete each document
            });

            await Promise.all(deletePromises); // Wait for all delete promises to resolve
        } catch (error) {
            console.error("Error deleting documents:", error);
        }
    };



    const addPurchases = async (data) => {
        try {
            const results = await addDoc(collection(db, "orders"), {
                order: data,
                date: new Date()
            });
            if (results) {
                // setPurchase(false);
                deleteAllDocumentsInCollection("products");
                // setCart(null);
                // setSharedData(0);
                navigate('/orders');
            }
        } catch (error) {
            console.log(error);
        }
    }

    // useEffect(() => {
    //     if (props.cartTrue) {
    //         fetchProducts();
    //     }
    //     if (purchase) {
    //         addPurchases(CartData);
    //     }
    // }, [props.cartTrue, purchase, setPurchase]);


    // Memoize the calculation of the total price to avoid recalculating on every render
    // const totalPrice = useMemo(() => {
    //     return CartData.reduce((acc, item) => acc + item.price * item.quantity, 0);
    // }, [CartData]);

    // Update the shared data (total price) whenever CartData changes
    // useEffect(() => {
    //     setSharedData(totalPrice.toFixed());
    // }, [setSharedData, totalPrice]);



    const addToCart = async (data) => {
        try {
            const userId = localStorage.getItem('userId');

            if (!userId) {
                toast.error("You need to be logged in to add items to the cart.", { autoClose: 2000 });
                return;
            }

            const prodRef = doc(db, 'cart', `${userId}_${data.id}`);
            const docSnap = await getDoc(prodRef);

            if (docSnap.exists()) {
                const currentQuantity = docSnap.data().quantity || 1;
                await updateDoc(prodRef, {
                    quantity: currentQuantity + 1 // Increment the quantity by 1
                });

                toast.success("Quantity updated in Cart", {autoClose: 1000});
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
                toast.success("Product added to Cart");
            }
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
                const prodRef = doc(db, "products", id);
                await updateDoc(prodRef, updateQuantity);
            }
        } catch (error) {
            console.log(error);
        }
    }

    async function removeCart(id) {
        try {
            const docRef = doc(db, "products", id);
            await deleteDoc(docRef);
        } catch (error) {
            console.log(error);
        }
    }


    const setSearch = (val) => {
        let newData = data.filter((e) =>
            e.title.toLowerCase().includes(val.toLowerCase())
        );
        setFilteredData(newData);
    };

    return (
        <>
            <ToastContainer />
            <div className="w-[80%] ml-auto mx-3 pt-24">
                <SearchBox setSearch={setSearch} />
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-8'>
                    {(location == '/cart' || isCart) ? cartData?.map((data) => {
                        return (
                            <div className='border-2 rounded-2xl p-8 shadow-sm' key={data.docId}>
                                <img src={data.image} className='w-72 h-80 mb-4' alt="" />
                                <div className='space-y-4'>
                                    <h1 className='text-ellipsis whitespace-nowrap overflow-hidden text-xl'>{data.title}</h1>
                                    <div className='flex justify-between text-2xl'>
                                        <p className='text-2xl font-bold text-gray-600'>₹ {data.price}</p>
                                        <div className='flex justify-evenly items-center w-1/2'>
                                            <img src={less} alt="" onClick={() => updateQuantity(data.docId, data.quantity - 1)} />
                                            {data.quantity}
                                            <img src={more} alt="" onClick={() => updateQuantity(data.docId, data.quantity + 1)} />
                                        </div>
                                    </div>
                                    <button type='submit' disabled={Loader === data.id} className='rounded-xl w-full border-blue-200 p-3 bg-red-600 text-white text-2xl'
                                        onClick={() => removeCart(data.docId)}>{Loader === data.id ? 'Removing From Cart' : 'Remove From Cart'} </button>
                                </div>
                            </div>
                        )
                    }) : productsData?.map((data) => {
                        return (
                            <div className='border-2 rounded-2xl p-8 shadow-sm' key={data?.id}>
                                <img src={data.image} className='w-72 h-80 mb-4' alt="" />
                                <div className='space-y-4'>
                                    <h1 className='text-ellipsis whitespace-nowrap overflow-hidden text-xl'>{data.title}</h1>
                                    <p className='text-2xl font-bold text-gray-600'>₹ {data.price}</p>
                                    <button type='submit' disabled={Loader === data.id} className='rounded-xl w-full border-blue-200 p-3 bg-blue-600 text-white text-2xl'
                                        onClick={() => addToCart(data)}>{Loader === data.id ? 'Adding To Cart...' : 'Add To Cart'} </button>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </>
    )
}

export default Products
