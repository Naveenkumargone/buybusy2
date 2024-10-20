import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, getDocs, updateDoc, doc, deleteDoc, getDoc, setDoc } from 'firebase/firestore';
import { db } from "../index";
import more from "../assets/more.png";
import less from "../assets/less.png";
import { toast, ToastContainer } from 'react-toastify';

const Products = (props) => {
    const [CartData, setCartData] = useState([]);
    const [Loader, setLoader] = useState(null);
    const navigate = useNavigate();

    const fetchProducts = async () => {
        try {
            const results = await getDocs(collection(db, "products"));
            const fetchedProducts = results.docs.map((doc) => ({ docId: doc.id, ...doc.data() }));
            setCartData(fetchedProducts);
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

    useEffect(() => {
        fetchProducts();
    }, []);


    // Memoize the calculation of the total price to avoid recalculating on every render
    const totalPrice = useMemo(() => {
        return CartData.reduce((acc, item) => acc + item.price * item.quantity, 0);
    }, [CartData]);

    // Update the shared data (total price) whenever CartData changes
    // useEffect(() => {
    //     setSharedData(totalPrice.toFixed());
    // }, [setSharedData, totalPrice]);


    const addToCart = async (data) => {
        try {
            const prodRef = doc(db, 'products', data.title); // Reference to the document based on product ID
            // Check if the document already exists
            const docSnap = await getDoc(prodRef);

            if (docSnap.exists()) {
                // Document exists, increment the quantity
                const currentQuantity = docSnap.data().quantity; // Get current quantity, default to 1 if not present
                await updateDoc(prodRef, {
                    quantity: currentQuantity + 1 // Increment the quantity by 1
                });
                toast.success("Quantity updated in Cart");
            } else {
                // Document does not exist, create a new one with quantity 1
                await setDoc(prodRef, {
                    id: data.id,
                    title: data.title,
                    category: data.category,
                    image: data.image,
                    price: data.price.toFixed(),
                    quantity: 1 // Set initial quantity as 1
                });
                toast.success("Added to Cart");
            }
        } catch (error) {
            console.log("Error adding to cart:", error);
            toast.error("Error adding to Cart");
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
                fetchProducts();
            }
        } catch (error) {
            console.log(error);
        }
    }

    async function removeCart(id) {
        try {
            const docRef = doc(db, "products", id);
            await deleteDoc(docRef);
            fetchProducts();
        } catch (error) {
            console.log(error)
        }
    }

    function checkAuth(data) {
        setLoader(data.id)
        setCartData([...CartData, data]);
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || !user.email || !user.passwordHash) {
            navigate('/signin');
        } else {
            setLoader(data.id);
            setTimeout(() => {
                setLoader(null);
                addToCart(data);
            }, 1000);
        }
    }

    return (
        <>
            <ToastContainer />
            <div className='grid grid-cols-3 gap-8'>
                {!props.cartTrue ?
                    (props?.filteredData?.map((data, index) => {
                        return (
                            <>
                                <div className='border-2 rounded-2xl p-8 shadow-sm' key={data.id || index}>
                                    <img src={data.image} className='w-72 h-80 mb-4' alt="" />
                                    <div className='space-y-4'>
                                        <h1 className='text-ellipsis whitespace-nowrap overflow-hidden text-xl'>{data.title}</h1>
                                        <p className='text-2xl font-bold text-gray-600'>₹ {data.price}</p>
                                        <button type='submit' disabled={Loader === data.id} className='rounded-xl w-full border-blue-200 p-3 bg-blue-600 text-white text-2xl'
                                            onClick={() => checkAuth(data)}>{Loader === data.id ? 'Adding To Cart...' : 'Add To Cart'} </button>
                                    </div>
                                </div>
                            </>
                        )
                    })) : (CartData?.map((data, index) => {
                        return (
                            <div className='border-2 rounded-2xl p-8 shadow-sm' key={data.docId || index}>
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
                    }))}
            </div>
        </>
    )
}

export default Products
