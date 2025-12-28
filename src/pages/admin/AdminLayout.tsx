import "./Admin.css";
import { Link, Outlet } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";

export default function AdminLayout() {
  const { logout } = useAuth();

  return (
    <div className="admin-container">
      <aside className="admin-sidebar">
        <h2 className="admin-logo">Panel</h2>

        <nav className="admin-nav">
          <Link to="/admin">Dashboard</Link>
          <Link to="/admin/departamentos">Departamentos</Link>
        </nav>

        <button className="logout-btn" onClick={logout}>
          Cerrar sesión
        </button>
      </aside>

      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
}
