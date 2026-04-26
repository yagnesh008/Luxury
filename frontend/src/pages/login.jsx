import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await API.post("/auth/login", {
        email: form.email,
        password: form.password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("name", res.data.name);
      localStorage.setItem("userId", res.data.userId);

      navigate("/productList");
    } catch (err) {
      console.error("LOGIN ERROR:", err);

      setError(
        err.response?.data || "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box glass login-box">
        <img
          src="https://as2.ftcdn.net/v2/jpg/17/70/43/15/1000_F_1770431523_2fzsU6ZxGQl26YlTqsZS0FgpIGCRx1d0.jpg"
          alt="Luxury Jewelry"
          className="auth-logo"
        />

        <h2 className="auth-title">Log In</h2>

        {error && <p className="auth-error">{error}</p>}

        <input
          type="email"
          placeholder="Enter Email"
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
          className="auth-input"
        />

        <div className="password-field">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter Password"
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
            className="auth-input password-input"
          />

          <button
            type="button"
            className="password-toggle"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "🙈" : "👁️"}
          </button>
        </div>

        <button
          className="btns auth-submit"
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "Logging in..." : "▶︎ Log In"}
        </button>

        <p className="auth-footer-text">
          Don't have an account?{" "}
          <Link to="/register" className="auth-link">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}