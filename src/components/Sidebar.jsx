import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

const Sidebar = () => {
  const [price, setPrice] = useState(750);
  const [value, setValue] = useState([]);
  const location = useLocation();
  const isCart = location.pathname == '/cart';

  const checkRange = (e) => {
    // setPrice(e.target.value);
    // sharePrice(e.target.value);
  }

  const checkbox = (e) => {
    if (value.includes(e)) {
      setValue(value.filter((val) => val !== e));
    } else {
      setValue([...value, e]);
    }
  }

  const purchaseProd = () => {
    // setPurchase(true);
  }



  return (
    // ((cartTrue && sharedData == 0 && cart == null)) ?
    //   <div className='text-4xl font-bold my-8 mx-4'>
    //     Cart is Empty!
    //   </div>
    //   :
    //   (
    <>
      <ToastContainer />

      <aside className='bg-gray-200 w-[18%] fixed left-0 h-full pt-24 mt-10'>
        <div>
          {!isCart ?
            (<form action="" className='flex flex-col justify-center items-center space-y-4'>
              <h1 className='text-2xl font-bold text-green-950'>Filter</h1>
              <label htmlFor="">Price: {price} </label>
              <input type="range" name="" id="" min={1} max={1000} defaultValue={750} onChange={(e) => checkRange(e)} />
              <label htmlFor="" className='text-2xl text-green-950 font-semibold'>Category</label>
              <ul>
                <li>
                  <input type="checkbox" name="" id="mensclothing" onClick={() => checkbox("men's clothing")} />
                  <label className='text-xl px-2' htmlFor="mensclothing">Men's Clothing</label>
                </li>
                <li>
                  <input type="checkbox" name="" id="womensclothing" onClick={() => checkbox("women's clothing")} />
                  <label className='text-xl px-2' htmlFor="womensclothing">Women's Clothing</label>
                </li>
                <li>
                  <input type="checkbox" name="" id="jewelery" onClick={() => checkbox("jewelery")} />
                  <label className='text-xl px-2' htmlFor="jewelery">Jewelery</label>
                </li>
                <li>
                  <input type="checkbox" name="" id="electronics" onClick={() => checkbox("electronics")} />
                  <label className='text-xl px-2' htmlFor="electronics">Electronics</label>
                </li>
              </ul>
            </form>)
            :
            (<div className='flex justify-center items-center flex-wrap space-y-8'>
              <h1 className='text-2xl text-green-950 font-semibold text-center w-full'>TotalPrice:- ₹ {0}/- </h1>
              <button type='submit' className='text-2xl rounded-xl w-1/2 left-2/4 border-blue-200 p-2 bg-blue-600 text-white'
                onClick={() => purchaseProd()} >Purchase</button>
            </div>)}
        </div>
      </aside>
    </>
    // )
  )
}

export default Sidebar
