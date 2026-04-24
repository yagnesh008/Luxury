import { useState, useEffect } from "react";
import API from "../services/api";
import Navbar from "../components/navbar";
import toast from "react-hot-toast";
import { formatShortPrice } from "../utils/formatPrice";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function Payment() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);

  const { cart, total } = useCart();
  const FREE_DELIVERY_THRESHOLD = 49999;
  const remaining = Math.max(FREE_DELIVERY_THRESHOLD - total, 0);
  const progress = Math.min(
    (total / FREE_DELIVERY_THRESHOLD) * 100,
    100
  );


  const delivery = total > FREE_DELIVERY_THRESHOLD ? 0 : 500;
  const userId = localStorage.getItem("userId");

useEffect(() => {
  if (!loading && cart.length === 0) {
    toast.error("Your cart is empty");
    navigate("/cart");
  }
}, [cart, loading]);

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const res = await API.get(`/address/${userId}`);
        setAddresses(res.data);

        const defaultAddr = res.data.find((a) => a.is_default) || res.data[0];
        setSelectedAddress(defaultAddr);
      } catch (err) {
        console.error(err);
      }
    };

    if (userId) fetchAddresses();
  }, [userId]);

  const pay = async () => {
    try {
      if (!cart || cart.length === 0) {
        toast.error("Your cart is empty");
        navigate("/cart");
        return;
      }

      if (!selectedAddress) {
        toast.error("Please select address first 📍");
        return;
      }

      setLoading(true);
      setError("");

      if (!total || total <= 0) {
        toast.error("Invalid total amount ❌");
        return;
      }

      const res = await API.post("/payment/pay", {
        amount: total + delivery,
        user_id: userId,
        delivery: delivery,
        address: selectedAddress,
      });

      if (!res.data.success) {
        toast.error(res.data.error || "Payment failed ❌");
        return;
      }

      const order = res.data;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: "INR",
        name: "Luxury Jewelry",
        description: "Order Payment",
        order_id: order.id,

        handler: async function (response) {
          try {
            const res = await API.post("/payment/verify", response);

            if (res.data.success) {
              await API.delete(`/cart/clear/${userId}`);
              localStorage.removeItem("total");
              localStorage.removeItem("delivery");
              navigate("/success");
            } else {
              toast.error("Verification failed ❌");
            }
          } catch (err) {
            console.error(err);
            toast.error("Verification error ❌");
          }
        },

        prefill: {
          name: localStorage.getItem("name"),
          email: "test@email.com",
        },

        theme: {
          color: "#d4af37",
        },
      };

      if (!window.Razorpay) {
        toast.error("Razorpay SDK not loaded ❌");
        return;
      }

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      toast.error("Payment failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="payment-container">
        <div className="payment-box">
          <h2>💳 Secure Payment</h2>

          {error && <p className="payment-error">{error}</p>}

          {!selectedAddress && (
            <button
              className="select-address-btn"
              onClick={() => setShowModal(true)}
            >
              📍 Select Address
            </button>
          )}

          {selectedAddress ? (
            <div className="selected-address">
              <h3>📍 Deliver To</h3>
              <p>
                {selectedAddress.name} ({selectedAddress.phone})
              </p>
              <p>
                {selectedAddress.address_line}, {selectedAddress.city} -{" "}
                {selectedAddress.pincode}
              </p>
              <button onClick={() => navigate("/address")}>
                Change Address
              </button>
            </div>
          ) : (
            <p className="no-address">No address selected ❌</p>
          )}

          {total < FREE_DELIVERY_THRESHOLD ? (
            <div className="delivery-progress">
              <p>
                Add <strong>{formatShortPrice(remaining)}</strong> more for FREE delivery 🚚
              </p>

              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          ) : (
            <p className="free-delivery-text">
              🎉 You unlocked FREE delivery!
            </p>
          )}

          <div className="payment-amount">
            <h2>Payable: {formatShortPrice(total + delivery)}</h2>
          </div>

          <div className="payment-details">
            <p>
              <span>Items Total :</span>
              <span>{formatShortPrice(total)}</span>
            </p>
            <p>
              <span>Delivery :</span>
              <span>{formatShortPrice(delivery)}</span>
            </p>
            <p className="total">
              <span>Total :</span>
              <span>{formatShortPrice(total + delivery)}</span>
            </p>
          </div>

          <button className="pay-btn" onClick={pay} disabled={loading}>
            {loading ? "Processing..." : "Pay Now"}
          </button>

          {loading && <p className="loading-text">Please wait...</p>}

          {showModal && (
            <div className="modal-overlay">
              <div className="modal">
                <h2>Select Address</h2>

                {addresses.map((a) => (
                  <div
                    key={a.id}
                    className={`address-option ${
                      selectedAddress?.id === a.id ? "active" : ""
                    }`}
                    onClick={async () => {
                      try {
                        await API.put(`/address/set-default/${a.id}`, {
                          user_id: userId,
                        });

                        setSelectedAddress(a);
                        setShowModal(false);
                        toast.success("Default address updated ✅");
                      } catch (err) {
                        console.error(err);
                        toast.error("Failed to update address ❌");
                      }
                    }}
                  >
                    <h4>{a.name}</h4>
                    <p>{a.address_line}</p>
                  </div>
                ))}

                <button className="select-address-btn" onClick={() => navigate("/address")}>
                  📍 Manage Addresses
                </button>

                <button onClick={() => setShowModal(false)}>Close</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}