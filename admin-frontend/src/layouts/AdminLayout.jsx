import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { FiHome, FiLogOut, FiPlusCircle, FiCalendar, FiStar } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";

function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="admin-layout">
      <aside className="sidebar">
        <div className="logo">AirAdmin</div>

        <nav>
          <NavLink to="/dashboard"><FiHome /> Dashboard</NavLink>
          <NavLink to="/listings"><FiPlusCircle /> Listings</NavLink>
          <NavLink to="/reservations"><FiCalendar /> Reservations</NavLink>
          <NavLink to="/reviews"><FiStar /> Reviews</NavLink>
        </nav>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <h2>Admin Dashboard</h2>
            <p>Welcome back, {user?.username}</p>
          </div>

          <button onClick={handleLogout} className="logout-btn">
            <FiLogOut /> Logout
          </button>
        </header>

        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;