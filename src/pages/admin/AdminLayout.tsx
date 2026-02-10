import "./Admin.css";
import { Link, Outlet } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";

export default function AdminLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="admin-container">
      <aside className="admin-sidebar">
        <h2 className="admin-logo">Panel</h2>

        {/* Email del usuario */}
        <div className="admin-user">
          <span className="admin-user__label">Sesión:</span>
          <span className="admin-user__email">{user?.email ?? "—"}</span>
        </div>

        <nav className="admin-nav">
          <Link to="/admin">Dashboard</Link>
          <Link to="/admin/departamentos">Departamentos</Link>
        </nav>

        <button
          className="logout-btn"
          onClick={() => logout()}
          disabled={!user} // opcional
        >
          Cerrar sesión
        </button>
      </aside>

      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
}
