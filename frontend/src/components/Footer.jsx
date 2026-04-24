import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function Footer() {
  const navigate = useNavigate();
  const { cart } = useCart();

  const handlePaymentClick = () => {
    if (cart.length === 0) {
      toast.error("🛒 Your cart is empty!");
      return;
    }
    navigate("/payment");
  };

  return (
    <footer className="footer glass">
      
      {/* 🔝 TOP */}
      <div className="footer-top">

        {/* 🏆 BRAND */}
        <div className="footer-section">
          <h2>Luxury <span className="bots">Jewelry</span></h2>
          <p className="tagline" style={{ color: "var(--gold)" }}>
            Elegance. Style. Perfection.
          </p>
        </div>

        {/* 🔗 LINKS */}
        <div className="footer-section">
          <h4>Quick Links</h4>
          <Link to="/products">Home</Link>
          <Link to="/cart">Cart</Link>
          <Link to="/payment" onClick={handlePaymentClick}>
            Payment
          </Link>
        </div>

        {/* 📞 CONTACT */}
        <div className="footer-section">
          <h4>Contact</h4>
          <p>Email: support@luxury.com</p>
          <p>Phone: +91 98765 43210</p>
        </div>

        {/* 🌐 SOCIAL */}
        <div className="footer-section">
          <h4>Follow Us</h4>
          <p>Instagram</p>
          <p>Facebook</p>
          <p>Twitter</p>
        </div>

      </div>

      {/* 🔻 BOTTOM */}
      <div className="footer-bottom">
        <p>© 2026 Y. All rights reserved.</p>
      </div>

    </footer>
  );
}