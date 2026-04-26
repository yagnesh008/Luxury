import { createContext, useContext, useState, useEffect } from "react";
import API from "../services/api";
import toast from "react-hot-toast";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const userId = localStorage.getItem("userId");

  // ✅ Load from localStorage first (instant UI)
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });

  // ✅ Loading state (prevents false empty cart)
  const [loading, setLoading] = useState(true);

  // 🔥 Fetch cart from backend
  const fetchCart = async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      const res = await API.get(`/cart/${userId}`);

      if (res.data) {
        setCart(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false); // ✅ VERY IMPORTANT
    }
  };

  useEffect(() => {
    fetchCart();
  }, [userId]);

  // ✅ Save to localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // 🔼 Update quantity
  const updateQty = async (id, qty) => {
    if (qty < 1) return;

    try {
      await API.put("/cart/update", {
        cart_id: id,
        quantity: qty
      });

      // ⚡ Instant UI update
      setCart(prev =>
        prev.map(item =>
          item.id === id ? { ...item, quantity: qty } : item
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  // ❌ Remove item
  const removeItem = async (id) => {
    try {
      await API.delete(`/cart/${id}`);

      // ⚡ Instant UI update
      setCart(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  // ➕ Add to cart
  const addToCart = async (product) => {
    try {
      const existing = cart.find(
        item => item.product_id === product.product_id
      );

      if (existing) {
        await API.put("/cart/update", {
          cart_id: existing.id,
          quantity: existing.quantity + 1
        });

        // ⚡ Instant update
        setCart(prev =>
          prev.map(item =>
            item.id === existing.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        );

      } else {
        await API.post("/cart/add", product);

        fetchCart(); // fallback sync
      }

    } catch (err) {
      console.error(err);
    }
  };

  // 💰 Total
  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // 🔢 Count
  const count = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        total,
        count,
        loading,   // ✅ important
        updateQty,
        removeItem,
        addToCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// ✅ Custom hook
export const useCart = () => useContext(CartContext);