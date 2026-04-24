import { useNavigate } from "react-router-dom";
export default function RoleSelect() {
  const navigate = useNavigate();
  return (
    <div>
      <h1 className="oi">Jẽŵẽľřŷ Śťõřẽ </h1>
      <button onClick={() => navigate("/register/user")}>
        ▼ Sign Up
      </button>
      <button onClick={() => navigate("/login")}>
        ▶︎ Log In
      </button>
    </div>
  );
}