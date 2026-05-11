import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { DepartmentsService } from "../../services/departments.service";
import { type Departamento } from "../../types/Departamento";

import "./Admin.css";

export default function Dashboard() {
  const [items, setItems] = useState<Departamento[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    DepartmentsService.getAll()
      .then((data) => alive && setItems(data))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, []);

  const stats = useMemo(() => {
    const total = items.length;
    const activos = items.filter((x) => x.status).length;
    const inactivos = total - activos;
    const precios = items
      .map((x) => Number(x.precio_base_noche ?? 0))
      .filter((n) => n > 0 && Number.isFinite(n));

    const avg = precios.length ? Math.round(precios.reduce((a, b) => a + b, 0) / precios.length) : 0;
    const min = precios.length ? Math.min(...precios) : 0;
    const max = precios.length ? Math.max(...precios) : 0;

    const byCity = items.reduce<Record<string, number>>((acc, d) => {
      const key = (d.ciudad || "Sin ciudad").trim() || "Sin ciudad";
      acc[key] = (acc[key] ?? 0) + 1;
      return acc;
    }, {});

    const topCities = Object.entries(byCity)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4);

    return { total, activos, inactivos, avg, min, max, topCities };
  }, [items]);

  const latest = useMemo(() => {
    return [...items].sort((a, b) => (b.titulo ?? "").localeCompare(a.titulo ?? "", "es")).slice(0, 5);
  }, [items]);

  const money = (n: number) => Number(n || 0).toLocaleString("es-AR");

  if (loading) {
    return <p className="adm-loading">Cargando dashboard...</p>;
  }

  return (
    <div className="admin-list-container">
      <div className="admin-header admin-header--hero">
        <div>
          <span className="admin-kicker">Administración</span>
          <h1>Dashboard</h1>
          <p>Resumen operativo del inventario de departamentos y accesos rápidos de gestión.</p>
        </div>

        <div className="adm-header-actions">
          <Link className="btn-secondary" to="/admin/departamentos">
            Ver listado
          </Link>
          <Link className="btn-primary" to="/admin/departamentos/nuevo">
            + Nuevo departamento
          </Link>
        </div>
      </div>

      <section className="adm-kpis" aria-label="Indicadores principales">
        <article className="adm-kpi adm-kpi--accent">
          <span className="adm-kpi__label">Departamentos</span>
          <strong className="adm-kpi__value">{stats.total}</strong>
          <span className="adm-kpi__hint">Unidades cargadas</span>
        </article>

        <article className="adm-kpi">
          <span className="adm-kpi__label">Activos</span>
          <strong className="adm-kpi__value">{stats.activos}</strong>
          <span className="adm-kpi__hint">Disponibles para mostrar</span>
        </article>

        <article className="adm-kpi">
          <span className="adm-kpi__label">Inactivos</span>
          <strong className="adm-kpi__value">{stats.inactivos}</strong>
          <span className="adm-kpi__hint">Ocultos o pausados</span>
        </article>

        <article className="adm-kpi">
          <span className="adm-kpi__label">Precio promedio</span>
          <strong className="adm-kpi__value">${money(stats.avg)}</strong>
          <span className="adm-kpi__hint">Base por noche</span>
        </article>
      </section>

      <section className="adm-grid-2">
        <article className="adm-card adm-card--large">
          <div className="adm-card__head">
            <div>
              <h3>Últimos departamentos</h3>
              <p>Vista rápida para editar o revisar propiedades cargadas.</p>
            </div>
            <Link to="/admin/departamentos" className="adm-link">
              Ver todos →
            </Link>
          </div>

          {latest.length === 0 ? (
            <div className="adm-empty" style={{ border: "none" }}>
              <strong>No hay departamentos cargados.</strong>
              <span>Creá el primero para empezar a operar el panel.</span>
            </div>
          ) : (
            <div className="adm-mini-list">
              {latest.map((d) => (
                <div key={d.id} className="adm-mini-item">
                  <div className="adm-mini-item__media" aria-hidden="true">
                    {d.imagenes?.[0] ? <img src={d.imagenes[0]} alt="" loading="lazy" /> : <span>H</span>}
                  </div>

                  <div className="adm-mini-item__title">
                    <strong>{d.titulo || "Sin título"}</strong>
                    <span className="adm-muted">
                      {d.ciudad || "Sin ciudad"} · ${money(Number(d.precio_base_noche ?? 0))}
                    </span>
                  </div>

                  <span className={`status-badge ${d.status ? "is-on" : "is-off"}`}>
                    {d.status ? "Activo" : "Inactivo"}
                  </span>

                  <div className="adm-mini-item__actions">
                    <Link className="icon-btn" to={`/admin/departamentos/${d.id}`} title="Ver" aria-label="Ver departamento">
                      👁
                    </Link>
                    <Link className="icon-btn" to={`/admin/departamentos/editar/${d.id}`} title="Editar" aria-label="Editar departamento">
                      ✏️
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </article>

        <aside className="adm-card">
          <div className="adm-card__head adm-card__head--stack">
            <h3>Acciones rápidas</h3>
            <p>Atajos principales para mantener actualizado el inventario.</p>
          </div>

          <div className="adm-quick">
            <Link className="btn-primary" to="/admin/departamentos/nuevo">
              + Crear departamento
            </Link>
            <Link className="btn-secondary" to="/admin/departamentos">
              Gestionar listado
            </Link>
          </div>

          <div className="adm-note">
            <strong>Rango actual:</strong> ${money(stats.min)} – ${money(stats.max)} por noche.
          </div>

          <div className="adm-card__divider" />

          <h4 className="adm-subtitle">Ciudades principales</h4>
          <div className="adm-kpi__chips">
            {stats.topCities.length ? (
              stats.topCities.map(([city, n]) => (
                <span key={city} className="badge">
                  {city}: {n}
                </span>
              ))
            ) : (
              <span className="adm-muted">Sin datos todavía.</span>
            )}
          </div>
        </aside>
      </section>
    </div>
  );
}