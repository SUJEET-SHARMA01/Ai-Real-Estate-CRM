import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/authSlice";

export default function AppLayout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const agent = useSelector((state) => state.auth.agent);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div>
          <div className="sidebar-brand">Log Property Interaction</div>
          <div className="sidebar-tagline">AI-first CRM for real estate agents</div>
        </div>

        <nav className="sidebar-nav">
          <NavLink
            to="/"
            end
            className={({ isActive }) => "sidebar-link" + (isActive ? " active" : "")}
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/clients"
            className={({ isActive }) => "sidebar-link" + (isActive ? " active" : "")}
          >
            Clients
          </NavLink>
          <NavLink
            to="/properties"
            className={({ isActive }) => "sidebar-link" + (isActive ? " active" : "")}
          >
            Properties
          </NavLink>
          <NavLink
            to="/interactions"
            className={({ isActive }) => "sidebar-link" + (isActive ? " active" : "")}
          >
            Interactions
          </NavLink>
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-agent">{agent?.name || "Agent"}</div>
          <button className="sidebar-logout" onClick={handleLogout}>
            Sign out
          </button>
        </div>
      </aside>

      <main className="main">
        <Outlet />
      </main>
    </div>
  );
}
