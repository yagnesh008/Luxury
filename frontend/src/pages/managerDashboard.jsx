import { useEffect, useState } from "react";
import API from "../services/api";

export default function ManagerDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // 📦 Fetch orders
  const fetchOrders = async () => {
    try {
      const res = await API.get("/orders");

      console.log("Orders:", res.data); // 🔍 DEBUG

      // ✅ Safety check
      if (Array.isArray(res.data)) {
        setOrders(res.data);
      } else {
        setOrders([]);
      }

    } catch (err) {
      console.error("Error:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // 🔄 Update status WITHOUT reload
  const updateStatus = async (id, status) => {
    try {
      await API.put(`/orders/${id}`, { status });

      // ✅ Update UI instantly (no reload)
      setOrders(prev =>
        prev.map(o =>
          o.id === id ? { ...o, status } : o
        )
      );

    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <h2>Loading...</h2>;

  return (
    <div>
      <h1>Manager Dashboard</h1>

      {orders.length === 0 ? (
        <p>No orders found</p>
      ) : (
        orders.map(o => (
          <div key={o.id} style={{ border: "1px solid gray", margin: "10px", padding: "10px" }}>
            <h3>Order #{o.id}</h3>
            <p>Total: ₹{o.total}</p>
            <p>Status: {o.status}</p>

            {o.status === "pending" && (
              <>
                <button className="btns" onClick={() => updateStatus(o.id, "approved")}>
                  ✅ Approve
                </button>

                <button className="btns" onClick={() => updateStatus(o.id, "rejected")}>
                  ❌ Reject
                </button>
              </>
            )}
          </div>
        ))
      )}
    </div>
  );
}