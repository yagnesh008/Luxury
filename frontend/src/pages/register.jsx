import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import API from "../services/api";
import toast from "react-hot-toast";

export default function Register() {
  const { role } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = async () => {
    try {
      await API.post("/auth/register", { ...form, role });

      toast.success("Registered Successfully!");
      navigate("/login");
    } catch (err) {
      console.error("ERROR:", err.response?.data || err.message);
      toast.error(err.response?.data || "Registration failed");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box glass register-box">
        <img
          src="https://as2.ftcdn.net/v2/jpg/17/70/43/15/1000_F_1770431523_2fzsU6ZxGQl26YlTqsZS0FgpIGCRx1d0.jpg"
          alt="Jewelry Logo"
          className="auth-logo"
        />

        <h2 className="auth-title">{role ? `${role} Register` : "Register"}</h2>

        <input
          type="text"
          placeholder="Enter Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="auth-input"
        />

        <input
          type="email"
          placeholder="Enter Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="auth-input"
        />

        <input
          type="password"
          placeholder="Enter Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="auth-input"
        />

        <button className="btns auth-submit" onClick={handleSubmit}>
          Register
        </button>

        <p className="auth-footer-text">
          Already have an account?{" "}
          <Link to="/login" className="auth-link">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
}