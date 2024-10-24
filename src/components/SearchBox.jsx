import React from 'react'

const SearchBox = ({setSearch}) => {

  const checkProduct = (e) => {
    setSearch(e.target.value)
  }

  return (
    <div className='flex justify-center my-6 '>
        <input type="text" placeholder='Search By Name' onChange={(e) => checkProduct(e)} className='w-1/3 text-xl border-violet-400 rounded-2xl p-3 border-2 highlight outline-none' />
    </div>
  )
}

export default SearchBox
