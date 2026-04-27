import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";


export default function Success() {
  const navigate = useNavigate();
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