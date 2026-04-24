import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/navbar";
import { formatShortPrice } from "../utils/formatPrice";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await API.get(`/orders/user/${userId}`);
      setOrders(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <Navbar />

      <div className="orders-container">
        <h2>📦 My Orders</h2>

        {orders.length === 0 ? (
          <p>No orders yet 😢</p>
        ) : (
          orders.map((order) => (
            <div key={order.id} className="order-card">

              {/* 🧾 ORDER HEADER */}
              <div className="order-header">
                <div>
                  <p><strong>Order ID:</strong> #{order.id}</p>
                  <p><strong>Date:</strong> {new Date(order.created_at).toLocaleString()}</p>
                </div>

                <div className="order-status">
                  {order.status}
                </div>
              </div>

              {/* 📦 ITEMS */}
              <div className="order-items">
                {order.items.map((item) => (
                  <div key={item.id} className="order-item">
                    <img src={item.image_url} alt="" />

                    <div className="order-info">
                      <h4>{item.name}</h4>
                      <p>Qty: {item.quantity}</p>
                      <p>{formatShortPrice(item.price)}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* 💰 TOTAL */}
              <div className="order-total">
                Total: {formatShortPrice(order.total)}
              </div>

            </div>
          ))
        )}
      </div>
    </>
  );
}