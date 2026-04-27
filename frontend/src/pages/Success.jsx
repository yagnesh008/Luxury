import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useCart } from "../context/CartContext";
import API from "../services/api";


export default function Success() {
  const navigate = useNavigate();
    const { setCart } = useCart(); 
  useEffect(() => {
    const clearAfterPayment = async () => {
      const userId = localStorage.getItem("userId");

      console.log("CLEARING CART FOR:", userId); 

      if (!userId) return;

      try {
        // 🔥 1. Clear backend
        await API.delete(`/cart/clear/${userId}`);

        // 🔥 2. Clear frontend state
        setCart([]);

        // 🔥 3. Clear localStorage
        localStorage.removeItem("cart");

        console.log("CART CLEARED ✅");

      } catch (err) {
        console.error("CLEAR CART ERROR ❌", err);
      }
    };

    clearAfterPayment();
  }, []);
  return (
    <div className="success-page">
      <div className="success-box">
        <h1>🎉 Payment Successful</h1>
        <p>Your order has been placed successfully.</p>

        <h2 onClick={() => navigate("/products")}>
          <button className="btns">Continue Shopping</button>
        </h2>
      </div>
    </div>
  );
}
