import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/navbar";
import toast from "react-hot-toast";
import { formatShortPrice } from "../utils/formatPrice";

export default function Cart() {
  const { cart, total, updateQty, removeItem } = useCart();
  const navigate = useNavigate();

  const deliveryCharge =
    cart.length === 0 ? 0 : total > 49999 ? 0 : 500;

  const payableAmount = total + deliveryCharge;

  const checkout = () => {
    if (!cart || cart.length === 0|| total <= 0) {
      return toast.error("Cart is empty");
      return;
    }

    localStorage.setItem("total", total);
    localStorage.setItem("delivery", deliveryCharge);

    navigate("/payment");
  };

  
  return (
    <>
      <Navbar />

      <div className="cart-page">
        <div className="cart-left">
          <h2>🛒 Your Cart</h2>

          <button className="btns" onClick={() => navigate("/productList")}>
            Continue Shopping
          </button>

          {cart.length === 0 ? (
            <div className="cart-empty-glass">
              <h3>Your cart is empty 🛒</h3>
              <p>Add some products to continue shopping.</p>
            </div>
          ) : (
            cart.map((item) => (
              <div className="cart-item glass" key={item.id}>
                <img
                  src={item.image}
                  alt={item.name}
                  onError={(e) => {
                    e.currentTarget.src = "/no-image.png";
                  }}
                />

                <div className="item-details">
                  <h3>{item.name}</h3>

                  <p>
                    {formatShortPrice(item.price)}
                    <span className="real-price">
                      (₹{item.price.toLocaleString("en-IN")})
                    </span>
                  </p>

                  <div className="qty-box">
                    <button
                      className="btns"
                      onClick={() => updateQty(item.id, item.quantity - 1)}
                    >
                      -
                    </button>

                    <span>{item.quantity}</span>

                    <button
                      className="btns"
                      onClick={() => updateQty(item.id, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>

                  <p className="subtotal">
                    Subtotal: ₹
                    {(item.price * item.quantity).toLocaleString("en-IN")}
                  </p>
                </div>

                <button
                  className="remove-btn"
                  onClick={() => removeItem(item.id)}
                >
                  ❌
                </button>
              </div>
            ))
          )}
        </div>

        <div className="cart-right glass">
          <h2>🧾 Order Summary</h2>

          <div className="summary-row">
            <span>Items Total :</span>
            <span>₹{total.toLocaleString("en-IN")}</span>
          </div>

          <div className="summary-row">
            <span>Delivery :</span>
            <span>₹{deliveryCharge.toLocaleString("en-IN")}</span>
          </div>

          <div className="summary-row total">
            <span>Total Payable</span>
            <span>₹{payableAmount.toLocaleString("en-IN")}</span>
          </div>

          <button className="btns" onClick={checkout}>
            💳 Proceed to Payment
          </button>

          <button className="btns" onClick={() => navigate("/address")}>
            📍 Select Address
          </button>
        </div>
      </div>
    </>
  );
}