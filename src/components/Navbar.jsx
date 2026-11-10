import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { getUserRole } from "../utils/auth";
import { useCart } from "../context/useCart";

const Navbar = () => {
  const navigate = useNavigate();
  const role = getUserRole();
  const { totalItems } = useCart();

  function handleLogout() {
    localStorage.removeItem("token");
    toast.success("Logged Out successfully");
    window.location.href = "/login";          // Full Reload, not Navigate
  }

  return (
    <nav className="navContainer">
      <div className="admnDashboard">
        {role === "ADMIN" && (
          <button onClick={() => navigate("/admin")}>Admin Dashboard</button>
        )}
      </div>
      <div className="navBtns">
        <button id="navCartBtn" onClick={() => navigate("/cart")}>
          Cart {totalItems > 0 && `(${totalItems})`}
        </button>
        <button id="navOrdersBtn" onClick={() => navigate("/orders")}>
          My Orders
        </button>
        <button id="navLogoutBtn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
