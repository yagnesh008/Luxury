import { useEffect, useState } from "react";
import API from "../services/api";
import toast from "react-hot-toast";

export default function Address() {
  const [addresses, setAddresses] = useState([]);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    city: "",
    pincode: "",
    address: "",
  });

  const userId = localStorage.getItem("userId");

  const fetchAddresses = async () => {
    try {
      const res = await API.get(`/address/${userId}`);
      setAddresses(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching addresses", err);
      toast.error("Failed to load addresses");
    }
  };

  useEffect(() => {
    if (userId) {
      fetchAddresses();
    }
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const addAddress = async () => {
    const { name, phone, city, pincode, address } = form;

    if (!name || !phone || !city || !pincode || !address) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      await API.post("/address", {
        user_id: userId,
        name,
        phone,
        city,
        pincode,
        address,
      });

      toast.success("Address added successfully");

      setForm({
        name: "",
        phone: "",
        city: "",
        pincode: "",
        address: "",
      });

      fetchAddresses();
    } catch (err) {
      console.error("Error adding address", err);
      toast.error("Failed to add address");
    }
  };

  const deleteAddress = async (id) => {
    try {
      await API.delete(`/address/${id}`);
      toast.success("Address deleted");
      fetchAddresses();
    } catch (err) {
      console.error("Error deleting address", err);
      toast.error("Failed to delete address");
    }
  };

  const setDefault = async (id) => {
    try {
      await API.put(`/address/set-default/${id}`, {
        user_id: userId,
      });
      toast.success("Default address updated");
      fetchAddresses();
    } catch (err) {
      console.error("Error setting default", err);
      toast.error("Failed to set default address");
    }
  };

  const removeDefault = async (id) => {
    try {
      await API.put(`/address/remove-default/${id}`);
      toast.success("Default removed");
      fetchAddresses();
    } catch (err) {
      console.error("Error removing default", err);
      toast.error("Failed to remove default");
    }
  };

  return (
    <div className="address-page">
      <div className="address-header">
        <div>
          <h1 className="address-title">📍 Your Addresses</h1>
          <p className="address-subtitle">
            Manage your delivery addresses for checkout
          </p>
        </div>
      </div>

      <div className="address-form-wrap">
        <div className="address-form-top">
          <h2 className="address-form-title">Add New Address</h2>
          <p className="address-form-note">All fields are required</p>
        </div>

        <div className="address-grid">
          <input
            className="address-field"
            type="text"
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
          />

          <input
            className="address-field"
            type="text"
            name="phone"
            placeholder="Phone"
            value={form.phone}
            onChange={handleChange}
          />

          <input
            className="address-field"
            type="text"
            name="city"
            placeholder="City"
            value={form.city}
            onChange={handleChange}
          />

          <input
            className="address-field"
            type="text"
            name="pincode"
            placeholder="Pincode"
            value={form.pincode}
            onChange={handleChange}
          />

          <textarea
            className="address-textarea address-full"
            name="address"
            placeholder="Full Address"
            value={form.address}
            onChange={handleChange}
          />
        </div>

        <div className="address-form-actions">
          <button className="add-address-btn" type="button" onClick={addAddress}>
            Add Address
          </button>
        </div>
      </div>

      <div className="saved-addresses-wrap">
        <div className="saved-addresses-head">
          <h2 className="saved-addresses-title">Saved Addresses</h2>
          <span className="address-count">{addresses.length} saved</span>
        </div>

        {addresses.length === 0 ? (
          <div className="address-empty">
            <h3>No addresses found</h3>
            <p>Add your first address to continue.</p>
          </div>
        ) : (
          <div className="address-list">
            {addresses.map((a) => (
              <div
                key={a.id}
                className={`address-card ${a.is_default ? "default-address" : ""}`}
              >
                {a.is_default && <div className="address-badge">⭐ Default</div>}

                <div className="address-card-top">
                  <div className="address-user-block">
                    <h3 className="address-name">{a.name}</h3>
                    <p className="address-phone">{a.phone}</p>
                  </div>

                  <div className="address-icon">📍</div>
                </div>

                <div className="address-details">
                  <p className="address-line">{a.address}</p>
                  <p className="address-line address-city-row">
                    {a.city} - {a.pincode}
                  </p>
                </div>

                <div className="address-actions">
                  {a.is_default ? (
                    <button
                      className="edit-btn"
                      type="button"
                      onClick={() => removeDefault(a.id)}
                    >
                      Remove Default
                    </button>
                  ) : (
                    <button
                      className="default-btn"
                      type="button"
                      onClick={() => setDefault(a.id)}
                    >
                      ⭐ Make Default
                    </button>
                  )}

                  <button
                    className="delete-btn"
                    type="button"
                    onClick={() => deleteAddress(a.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}