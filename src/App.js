import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import SignIn from "./components/SignIn";
import "./App.css";
import Signup from "./components/Signup";
import Sidebar from "./components/Sidebar";
import SearchBox from "./components/SearchBox";
import axios from "axios";
import { useEffect, useState } from "react";
import { Loader } from "./components/Loader";
import CartPage from "./components/CartPage";
import Products from "./components/Products";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Orders from "./components/Orders";

function App() {
  const [data, setData] = useState(null); // Start with null instead of undefined
  const [filteredData, setFilteredData] = useState(null);
  const [price, setPrice] = useState(0);
  const [sharedData, setSharedData] = useState([]);

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await axios.get("https://fakestoreapi.com/products");
        setData(result.data);
        setFilteredData(result.data);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchData();
  }, []);

  // Centralize filtering logic based on both price and categories
  useEffect(() => {
    function filterData() {
      if (data) {
        const newdata = data.filter((pdata) => {
          const isPriceMatch = price === 0 || pdata.price <= price;
          const isCategoryMatch =
            sharedData.length === 0 || sharedData.includes(pdata.category);
          return isPriceMatch && isCategoryMatch;
        });
        setFilteredData(newdata);
      }
    }

    filterData();
  }, [data, price, sharedData]); // Run when price or categories change

  // Function to handle price filter updates
  const sharePrice = (pricedata) => {
    setPrice(pricedata); // Simply set the price, filtering happens automatically
  };

  // Function to handle category filter updates
  const shareValue = (checkboxdata) => {
    setSharedData(checkboxdata); // Set selected categories, filtering happens automatically
  };

  const setSearch = (val) => {
    let newData = data.filter((e) =>
      e.title.toLowerCase().includes(val.toLowerCase())
    );
    setFilteredData(newData);
  };

  return (
    <>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            data ? (
              <>
                <div className="flex justify-between">
                  <div>
                    <div className="bg-gray-200 w-2/12 fixed left-0 h-full">
                      <Sidebar
                        sharePrice={sharePrice}
                        shareValue={shareValue}
                        cartTrue={false}
                      />
                    </div>
                  </div>
                  <div className="w-10/12 p-10">
                    <SearchBox setSearch={setSearch} />
                    <Products filteredData={filteredData} cartTrue={false} />
                  </div>
                </div>
              </>
            ) : (
              <Loader />
            )
          }
        />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/cart" element={<CartPage cartTrue={true} />} />
        <Route path="/orders" element={<Orders />} />
      </Routes>
    </>
  );
}

export default App;
