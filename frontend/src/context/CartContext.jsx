import { createContext, useContext, useState, useEffect } from "react";
import API from "../services/api";
import toast from "react-hot-toast";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const userId = localStorage.getItem("userId");

  // ✅ Load from localStorage (instant UI)
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });

  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false); // 🚨 prevent duplicate clicks

  // 🔥 Fetch cart
  const fetchCart = async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      const res = await API.get(`/cart/${userId}`);
      setCart(res.data || []);
    } catch (err) {
      console.error("FETCH CART ERROR ❌", err);
      toast.error("Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [userId]);

  // 💾 Sync localStorage
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // ➕ ADD TO CART
  const addToCart = async (product) => {
    if (!userId) {
      toast.error("Please login first");
      return;
    }

    if (adding) return; // 🚨 block multiple clicks

    try {
      setAdding(true);

      const existing = cart.find(
        (item) => item.product_id === product.id
      );

      if (existing) {
        // 🔼 Update quantity
        await API.put("/cart/update", {
          cart_id: existing.id,
          quantity: existing.quantity + 1,
        });

        // ⚡ Instant UI update
        setCart((prev) =>
          prev.map((item) =>
            item.id === existing.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        );

        toast.success("Quantity updated 🛒");

      } else {
        // 🆕 Add new item
        await API.post("/cart/add", {
          user_id: userId,
          product_id: product.id,
          quantity: 1,
        });

        await fetchCart(); // sync with DB

        toast.success("Added to cart 💎");
      }

    } catch (err) {
      console.error("ADD ERROR ❌", err);

      if (err.response?.data?.error?.includes("duplicate")) {
        toast("Already in cart 🛒");
      } else {
        toast.error("Something went wrong ❌");
      }

    } finally {
      setAdding(false);
    }
  };

  // 🔼 UPDATE QTY
  const updateQty = async (id, qty) => {
    if (qty < 1) return;

    try {
      await API.put("/cart/update", {
        cart_id: id,
        quantity: qty,
      });

      setCart((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, quantity: qty } : item
        )
      );

    } catch (err) {
      console.error("UPDATE ERROR ❌", err);
      toast.error("Failed to update quantity");
    }
  };

  // ❌ REMOVE ITEM
  const removeItem = async (id) => {
    try {
      await API.delete(`/cart/${id}`);

      setCart((prev) => prev.filter((item) => item.id !== id));

      toast.success("Item removed ❌");

    } catch (err) {
      console.error("REMOVE ERROR ❌", err);
      toast.error("Failed to remove item");
    }
  };

  // 🧹 CLEAR CART
  const clearCart = async () => {
    try {
      await API.delete(`/cart/clear/${userId}`);
      setCart([]);
      toast.success("Cart cleared 🧹");
    } catch (err) {
      console.error("CLEAR ERROR ❌", err);
      toast.error("Failed to clear cart");
    }
  };

  // 💰 TOTAL
  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // 🔢 COUNT
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
        loading,
        adding, // 👈 use this to disable button
        addToCart,
        updateQty,
        removeItem,
        clearCart,
        fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// ✅ Hook
export const useCart = () => useContext(CartContext);