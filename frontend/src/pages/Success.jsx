import { Link } from "react-router-dom";
export default function Success() {
  return (
    <div className="success-page">
      <div className="success-box">
        <h1>🎉 Payment Successful</h1>
        <p>Your order has been placed successfully.</p>

        <a href="/productList">
          <button className="btns">Continue Shopping</button>
        </a>
      </div>
    </div>
  );
}