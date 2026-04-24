import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  const name = localStorage.getItem("name");
  const role = localStorage.getItem("role");

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="dashboard-container">
      <div className="glass dashboard-card">
        <h1>Welcome, {name} </h1>

        <div className="actions">
          {role === "user" && (
            <>
              <button className="btns" onClick={() => navigate("/products")}>
                🪎 View Products
              </button>

              <button className="btns" onClick={() => navigate("/cart")}>
                🛒 Cart
              </button>
            </>
          )}

          {role === "manager" && (
            <button className="btns" onClick={() => navigate("/manager")}>
               Manager Dashboard
            </button>
          )}

          <button className="btns" onClick={logout}>
            ◀︎ Logout
          </button>
        </div>
      </div>
    </div>
  );
}