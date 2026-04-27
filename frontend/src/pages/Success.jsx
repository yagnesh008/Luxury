import { useEffect } from "react";
import { useCart } from "../context/CartContext";
import API from "../services/api";

export default function Success() {
  const { clearCart } = useCart();

  useEffect(() => {
    const handleSuccess = async () => {
      const userId = localStorage.getItem("userId");

      if (!userId) return;

      try {
        // 🧹 Clear backend cart
        await API.delete(`/cart/clear/${userId}`);

        // 🧹 Clear frontend state
        clearCart();

        // 🧹 Clear localStorage cart
        localStorage.removeItem("cart");

      } catch (err) {
        console.error("CLEAR CART AFTER PAYMENT ERROR ❌", err);
      }
    };

    handleSuccess();
  }, []);

  return (
    <div className="success-page">
      <div className="success-box">
        <h1>🎉 Payment Successful</h1>
        <p>Your order has been placed successfully.</p>

        <a href="/products">
          <button className="btns">Continue Shopping</button>
        </a>
      </div>
    </div>
  );
}