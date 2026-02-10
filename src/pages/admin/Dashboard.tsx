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
    const precios = items.map((x) => Number(x.precio_base_noche ?? 0)).filter((n) => n > 0 && Number.isFinite(n));

    const avg = precios.length ? Math.round(precios.reduce((a, b) => a + b, 0) / precios.length) : 0;

    const byCity = items.reduce<Record<string, number>>((acc, d) => {
      const key = (d.ciudad || "—").trim() || "—";
      acc[key] = (acc[key] ?? 0) + 1;
      return acc;
    }, {});

    const topCities = Object.entries(byCity)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);

    return { total, activos, avg, topCities };
  }, [items]);

  const latest = useMemo(() => {
    // No tenemos created_at, así que “últimos” = orden alfabético inverso como aproximación.
    // Si después agregás created_at, lo cambiamos en 2 minutos.
    return [...items].sort((a, b) => (b.titulo ?? "").localeCompare(a.titulo ?? "", "es")).slice(0, 5);
  }, [items]);

  if (loading) return <p>Cargando dashboard...</p>;

  return (
    <div className="admin-list-container">
      <div className="admin-header">
        <div>
          <h1>Dashboard</h1>
          <p>Resumen del sistema y accesos rápidos.</p>
        </div>

        <div className="adm-header-actions">
          <Link className="btn-secondary" to="/admin/departamentos">
            Ver listado
          </Link>
          <Link className="btn-primary" to="/admin/departamentos/nuevo">
            + Nuevo
          </Link>
        </div>
      </div>

      <section className="adm-kpis">
        <div className="adm-kpi">
          <span className="adm-kpi__label">Departamentos</span>
          <span className="adm-kpi__value">{stats.total}</span>
        </div>
        <div className="adm-kpi">
          <span className="adm-kpi__label">Activos</span>
          <span className="adm-kpi__value">{stats.activos}</span>
        </div>
        <div className="adm-kpi">
          <span className="adm-kpi__label">Precio promedio</span>
          <span className="adm-kpi__value">${stats.avg.toLocaleString("es-AR")}</span>
        </div>
        <div className="adm-kpi adm-kpi--wide">
          <span className="adm-kpi__label">Top ciudades</span>
          <div className="adm-kpi__chips">
            {stats.topCities.length ? (
              stats.topCities.map(([city, n]) => (
                <span key={city} className="badge">
                  {city}: {n}
                </span>
              ))
            ) : (
              <span className="adm-muted">—</span>
            )}
          </div>
        </div>
      </section>

      <section className="adm-grid-2">
        <div className="adm-card">
          <div className="adm-card__head">
            <h3>Últimos departamentos</h3>
            <Link to="/admin/departamentos" className="adm-link">
              Ver todos →
            </Link>
          </div>

          {latest.length === 0 ? (
            <div className="adm-empty" style={{ border: "none" }}>
              <strong>No hay departamentos cargados.</strong>
              <span>Creá el primero para empezar.</span>
            </div>
          ) : (
            <div className="adm-mini-list">
              {latest.map((d) => (
                <div key={d.id} className="adm-mini-item">
                  <div className="adm-mini-item__title">
                    <strong>{d.titulo}</strong>
                    <span className="adm-muted">
                      {d.ciudad || "—"} · ${Number(d.precio_base_noche ?? 0).toLocaleString("es-AR")}
                    </span>
                  </div>
                  <div className="adm-mini-item__actions">
                    <Link className="icon-btn" to={`/admin/departamentos/${d.id}`} title="Ver">
                      👁
                    </Link>
                    <Link className="icon-btn" to={`/admin/departamentos/editar/${d.id}`} title="Editar">
                      ✏️
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="adm-card">
          <div className="adm-card__head">
            <h3>Acciones rápidas</h3>
            <span className="adm-muted">Atajos para operar sin fricción.</span>
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
            Tip: cuando quieras un dashboard más “serio”, agregá <code>created_at</code> en Firestore y filtramos “últimos”
            de verdad.
          </div>
        </div>
      </section>
    </div>
  );
}
