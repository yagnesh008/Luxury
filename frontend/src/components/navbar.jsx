import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useEffect, useState } from "react";

export default function Navbar({ onMenuClick }) {
  const [theme, setTheme] = useState("dark");
  const navigate = useNavigate();
  const { count } = useCart();

  useEffect(() => {
    const saved = localStorage.getItem("theme") || "light";
    setTheme(saved);

    if (saved === "dark") {
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);

    if (newTheme === "dark") {
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }

    localStorage.setItem("theme", newTheme);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const name = localStorage.getItem("name") || "User";

  return (
    <div className="navbar">
      <div className="navbar-top">
        <div className="navbar-left">
          {onMenuClick &&<button
            type="button"
            className="menu-btn"
            aria-label="Open filters"
            title="Open filters"
            onClick={onMenuClick}
          >
            ☰
          </button>}

          <h2 onClick={() => navigate("/products")} className="brand-title">
            <span style={{ color: "var(--gold)" }}>Luxury</span>{" "}
            <span className="bots">Jewelry</span>
          </h2>
        </div>

        <div className="nav-right">
          <div className="user-icon" title={name}>
            {name ? name.charAt(0).toUpperCase() : "U"}
          </div>

          <button
            type="button"
            className="nav-icon-btn"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            title="Toggle theme"
          >
            <span className="nav-icon">{theme === "light" ? "🌙" : "☀️"}</span>
            <span className="nav-btn-label desktop-only">
              {theme === "light" ? "Dark" : "Light"}
            </span>
          </button>

          <button
            type="button"
            className="nav-icon-btn"
            onClick={() => navigate("/cart")}
            aria-label="Cart"
            title="Cart"
          >
            <span className="nav-icon">🛒</span>
            <span className="cart-badge">{count}</span>
            <span className="nav-btn-label desktop-only">Cart</span>
          </button>

          <button
            type="button"
            className="nav-icon-btn"
            onClick={handleLogout}
            aria-label="Log out"
            title="Log out"
          >
            <span className="nav-icon">↩</span>
            <span className="nav-btn-label desktop-only">Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
}