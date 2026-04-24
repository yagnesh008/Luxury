import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import Login from "./pages/login";
import Register from "./pages/register";
import ProductList from "./pages/productList";
import Cart from "./pages/cart";
import Payment from "./pages/payment";
import Success from "./pages/Success";
import Address from "./pages/Address";
import "./index.css";

import Navbar from "./components/navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Footer from "./components/Footer";
import { Toaster } from "react-hot-toast";

function Layout() {
  const location = useLocation();

  const hideLayout = ["/", "/login", "/register"];
  const shouldHideLayout = hideLayout.includes(location.pathname);

  return (
    <div className="app-container">
      {!shouldHideLayout && <Navbar />}

      <Toaster position="top-right" />

      <main className={shouldHideLayout ? "main-content auth-main" : "main-content"}>
        <Routes>
          {/* PUBLIC */}
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* PROTECTED */}
          <Route
            path="/products"
            element={
              <ProtectedRoute>
                <ProductList />
              </ProtectedRoute>
            }
          />

          <Route
            path="/productList"
            element={
              <ProtectedRoute>
                <ProductList />
              </ProtectedRoute>
            }
          />

          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
            }
          />

          <Route
            path="/payment"
            element={
              <ProtectedRoute>
                <Payment />
              </ProtectedRoute>
            }
          />

          <Route
            path="/address"
            element={
              <ProtectedRoute>
                <Address />
              </ProtectedRoute>
            }
          />

          <Route
            path="/success"
            element={
              <ProtectedRoute>
                <Success />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>

      {!shouldHideLayout && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}