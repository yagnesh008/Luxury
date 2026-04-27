import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function Success() {
  const navigate = useNavigate();
  const { clearCart } = useCart();

  useEffect(() => {
    const handleSuccess = async () => {
      try {
        await clearCart(); // ✅ clears backend + frontend + localStorage
        console.log("Cart cleared after payment ✅");
      } catch (err) {
        console.error("Error clearing cart ❌", err);
      }
    };

    handleSuccess();
  }, []);

  return (
    <div className="success-page">
      <div className="success-box">
        <h1>🎉 Payment Successful</h1>
        <p>Your order has been placed successfully.</p>

        <button
          className="btns"
          onClick={() => navigate("/productList")}
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
}