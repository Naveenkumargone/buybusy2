import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import SignIn from "./components/SignIn";
import "./App.css";
import Signup from "./components/Signup";
import Sidebar from "./components/Sidebar";
import CartPage from "./components/CartPage";
import Products from "./components/Products";
import "react-toastify/dist/ReactToastify.css";
import Orders from "./components/Orders";
import store from "./redux/store";
import { Provider } from "react-redux";
import ProtectedRoute from "./auth/ProtectedRoute";
import { useState } from "react";

function App() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <>
      <Provider store={store}>
        <Navbar />
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
                <Products isOpen={isOpen} />
              </>
            }
          />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/cart" element={<ProtectedRoute component={CartPage} />} />
          <Route path="/orders" element={<ProtectedRoute component={Orders} />} />
        </Routes>
      </Provider>
    </>
  );
}

export default App;
