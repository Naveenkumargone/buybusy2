import React, { useState, useMemo, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { setcheckboxProducts, setTogglePrice } from '../redux/slices/productSlice/productslice';
import { addDoc, collection, deleteDoc, getDocs } from 'firebase/firestore';
import { db } from '../index';
import { FaChevronRight, FaChevronLeft } from 'react-icons/fa'; // Import arrow icons


const Sidebar = ({ isOpen, setIsOpen }) => {
  const dispatch = useDispatch();
  const cartdata = useSelector((state) => state.product.cartData);
  const checkboxValues = useSelector((state) => state.product.checkboxProducts);
  const [price, setPrice] = useState(750);
  const location = useLocation();
  const isCart = location.pathname === '/cart';
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const checkRange = (e) => {
    dispatch(setTogglePrice(e.target.value));
    setPrice(e.target.value);
  }

  const checkbox = (val) => {

    if (checkboxValues.includes(val)) {
      dispatch(setcheckboxProducts(checkboxValues.filter(item => item !== val)));
    } else {
      dispatch(setcheckboxProducts([...checkboxValues, val]));
    }
  }

  // Memoize the calculation of the total price to avoid recalculating on every render
  const cartValue = useMemo(() => {
    if (cartdata.length > 0) {
      return cartdata.reduce((acc, item) => acc + item.quantity * item.price, 0)
    }
  }, [cartdata]);


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


  const addPurchases = async () => {
    try {
      if (cartdata.length > 0) {
        const results = await addDoc(collection(db, "orders"), {
          order: cartdata,
          date: new Date(),
          userid: localStorage.getItem("userId")
        });
        if (results) {
          deleteAllDocumentsInCollection("cart");
          navigate('/orders');
        }
      }
    } catch (error) {
      console.log(error);
    }
  }



  return (
    <>
      <ToastContainer />
      <aside
        className={`bg-gray-200 fixed left-0 h-full pt-24 mt-10 transition-all duration-300 ${isCart && cartdata.length === 0 ? 'hidden' :
          (isOpen && !isCart ? 'sm:w-[18%] w-[74%]' : (isCart && cartdata.length > 0 ? 'sm:w-[18%] w-[35%]' : 'sm:w-[2%] w-[8%]'))}`}
        style={{ overflow: 'hidden' }}
      >
        {
          !isCart &&
          <button
            className="absolute top-[50%] z-50 right-[-4px] bg-blue p-2 rounded-full shadow-md"
            onClick={toggleSidebar}
          >
            {isOpen ? <FaChevronLeft /> : <FaChevronRight />}
          </button>
        }

        {!isCart ? (
          <div className={`${isOpen ? 'block' : 'hidden'}`}>
            <form action="" className='flex flex-col justify-center items-center space-y-4'>
              <h1 className='text-2xl font-bold text-green-950'>Filter</h1>
              <label htmlFor="">Price: {price} </label>
              <input
                type="range"
                className='sm:w-38 w-32 text-lg'
                min={1}
                max={1000}
                defaultValue={750}
                onChange={(e) => checkRange(e)}
              />
              <label htmlFor="" className='lg:text-2xl sm:text-lg text-lg text-green-950 font-semibold'>Category</label>
              <ul>
                <li>
                  <input type="checkbox" id="mensclothing" onClick={() => checkbox("men's clothing")} />
                  <label className='lg:text-xl sm:text-sm text-md px-2' htmlFor="mensclothing">Men's Clothing</label>
                </li>
                <li>
                  <input type="checkbox" id="womensclothing" onClick={() => checkbox("women's clothing")} />
                  <label className='lg:text-xl sm:text-sm text-md px-2' htmlFor="womensclothing">Women's Clothing</label>
                </li>
                <li>
                  <input type="checkbox" id="jewelery" onClick={() => checkbox("jewelery")} />
                  <label className='lg:text-xl sm:text-sm text-md px-2' htmlFor="jewelery">Jewelery</label>
                </li>
                <li>
                  <input type="checkbox" id="electronics" onClick={() => checkbox("electronics")} />
                  <label className='lg:text-xl sm:text-sm text-md px-2' htmlFor="electronics">Electronics</label>
                </li>
              </ul>
            </form>
          </div>
        ) : (
          !isOpen && cartdata.length > 0 && (
            <div>
              <div className='flex justify-center items-center flex-wrap space-y-8'>
                <h1 className='lg:text-2xl sm:text-lg text-lg text-green-950 font-semibold text-center w-full'>TotalPrice:- ₹ {cartValue || 0}/- </h1>
                <button
                  type='submit'
                  className='lg:text-2xl sm:text-lg text-sm rounded-xl w-1/2 left-2/4 border-blue-200 p-2 bg-blue-600 text-white'
                  onClick={() => addPurchases()}
                >
                  Purchase
                </button>
              </div>
            </div>
          )
        )}
      </aside>
    </>
  )
}

export default Sidebar
