import "./Admin.css";
import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";

export default function AdminLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="admin-container">
      <aside className="admin-sidebar" aria-label="Navegación administrativa">
        <div className="admin-brand">
          <span className="admin-brand__mark" aria-hidden="true">H</span>
          <div>
            <p className="admin-brand__eyebrow">Habitana</p>
            <h2 className="admin-logo">Panel admin</h2>
          </div>
        </div>

        <div className="admin-user">
          <span className="admin-user__label">Sesión activa</span>
          <span className="admin-user__email">{user?.email ?? "—"}</span>
        </div>

        <nav className="admin-nav">
          <NavLink to="/admin" end className={({ isActive }) => (isActive ? "is-active" : undefined)}>
            <span aria-hidden="true">📊</span>
            Dashboard
          </NavLink>
          <NavLink to="/admin/departamentos" className={({ isActive }) => (isActive ? "is-active" : undefined)}>
            <span aria-hidden="true">🏠</span>
            Departamentos
          </NavLink>
        </nav>

        <div className="admin-sidebar__footer">
          <p>Gestión interna de propiedades, precios, disponibilidad y contenido visual.</p>
          <button className="logout-btn" onClick={() => logout()} disabled={!user}>
            Cerrar sesión
          </button>
        </div>
      </aside>

      <main className="admin-content">
        <Outlet />  
      </main>
    </div>
  );
}
