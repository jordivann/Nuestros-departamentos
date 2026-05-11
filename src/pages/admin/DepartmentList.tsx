import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { DepartmentsService } from "../../services/departments.service";
import { type Departamento } from "../../types/Departamento";

import "./Admin.css";

type SortKey = "titulo" | "ciudad" | "precio" | "status";

export default function DepartmentList() {
  const [items, setItems] = useState<Departamento[]>([]);
  const [loading, setLoading] = useState(true);

  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [sortKey, setSortKey] = useState<SortKey>("titulo");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    let alive = true;
    DepartmentsService.getAll()
      .then((data) => {
        if (!alive) return;
        setItems(data);
      })
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, []);

  const kpis = useMemo(() => {
    const total = items.length;
    const activos = items.filter((d) => d.status).length;
    const inactivos = total - activos;
    const prices = items.map((d) => Number(d.precio_base_noche ?? 0)).filter((n) => n > 0);
    const avg = prices.length ? Math.round(prices.reduce((a, b) => a + b, 0) / prices.length) : 0;
    return { total, activos, inactivos, avg };
  }, [items]);

  const filtered = useMemo(() => {
    const qq = q.trim().toLowerCase();

    let out = items.filter((d) => {
      const matchesQ =
        !qq ||
        d.titulo?.toLowerCase().includes(qq) ||
        d.direccion?.toLowerCase().includes(qq) ||
        d.ciudad?.toLowerCase().includes(qq) ||
        d.provincia?.toLowerCase().includes(qq);

      const matchesStatus =
        statusFilter === "all" ? true : statusFilter === "active" ? !!d.status : !d.status;

      return matchesQ && matchesStatus;
    });

    out = out.sort((a, b) => {
      const dir = sortDir === "asc" ? 1 : -1;

      const av = (() => {
        switch (sortKey) {
          case "titulo":
            return (a.titulo ?? "").localeCompare(b.titulo ?? "", "es");
          case "ciudad":
            return (a.ciudad ?? "").localeCompare(b.ciudad ?? "", "es");
          case "precio":
            return Number(a.precio_base_noche ?? 0) - Number(b.precio_base_noche ?? 0);
          case "status":
            return Number(!!a.status) - Number(!!b.status);
          default:
            return 0;
        }
      })();

      return av * dir;
    });

    return out;
  }, [items, q, statusFilter, sortKey, sortDir]);

  function money(n: number) {
    return Number(n || 0).toLocaleString("es-AR");
  }

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((p) => (p === "asc" ? "desc" : "asc"));
      return;
    }
    setSortKey(key);
    setSortDir("asc");
  }

  if (loading) return <p className="adm-loading">Cargando departamentos...</p>;

  return (
    <div className="admin-list-container">
      <div className="admin-header admin-header--hero">
        <div>
          <span className="admin-kicker">Inventario</span>
          <h1>Departamentos</h1>
          <p>Administrá estado, precio, ubicación, imagen y edición rápida de cada propiedad.</p>
        </div>

        <Link className="btn-primary" to="/admin/departamentos/nuevo">
          + Nuevo departamento
        </Link>
      </div>

      <section className="adm-kpis adm-kpis--compact" aria-label="Resumen del listado">
        <article className="adm-kpi">
          <span className="adm-kpi__label">Total</span>
          <strong className="adm-kpi__value">{kpis.total}</strong>
        </article>
        <article className="adm-kpi">
          <span className="adm-kpi__label">Activos</span>
          <strong className="adm-kpi__value">{kpis.activos}</strong>
        </article>
        <article className="adm-kpi">
          <span className="adm-kpi__label">Inactivos</span>
          <strong className="adm-kpi__value">{kpis.inactivos}</strong>
        </article>
        <article className="adm-kpi">
          <span className="adm-kpi__label">Promedio</span>
          <strong className="adm-kpi__value">${money(kpis.avg)}</strong>
        </article>
      </section>

      <section className="adm-toolbar">
        <div className="adm-search">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar por título, dirección, ciudad o provincia…"
            aria-label="Buscar departamentos"
          />
          {q && (
            <button className="adm-clear" onClick={() => setQ("")} aria-label="Limpiar búsqueda" type="button">
              ×
            </button>
          )}
        </div>

        <div className="adm-filters">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as "all" | "active" | "inactive")}
            aria-label="Filtrar por estado"
          >
            <option value="all">Todos</option>
            <option value="active">Activos</option>
            <option value="inactive">Inactivos</option>
          </select>

          <select value={sortKey} onChange={(e) => setSortKey(e.target.value as SortKey)} aria-label="Ordenar por">
            <option value="titulo">Orden: Título</option>
            <option value="ciudad">Orden: Ciudad</option>
            <option value="precio">Orden: Precio</option>
            <option value="status">Orden: Estado</option>
          </select>

          <button className="btn-secondary" onClick={() => setSortDir((p) => (p === "asc" ? "desc" : "asc"))} type="button">
            {sortDir === "asc" ? "Ascendente" : "Descendente"}
          </button>
        </div>
      </section>

      <div className="department-table">
        <div className="dept-head">
          <button className="dept-head__cell" onClick={() => toggleSort("titulo")} type="button">
            Departamento
          </button>
          <button className="dept-head__cell" onClick={() => toggleSort("ciudad")} type="button">
            Ubicación
          </button>
          <button className="dept-head__cell" onClick={() => toggleSort("precio")} type="button">
            Precio
          </button>
          <button className="dept-head__cell dept-head__cell--right" onClick={() => toggleSort("status")} type="button">
            Estado / Acciones
          </button>
        </div>

        {filtered.length === 0 && (
          <div className="adm-empty">
            <strong>No hay resultados.</strong>
            <span>Probá ajustando la búsqueda o los filtros.</span>
          </div>
        )}

        {filtered.map((d) => {
          const img = d.imagenes?.[0];
          return (
            <article key={d.id} className="department-row dept-row--rich">
              <div className="dept-main">
                <div className="dept-thumb" aria-hidden="true">
                  {img ? <img src={img} alt="" loading="lazy" /> : <span>H</span>}
                </div>
                <div className="dept-title">
                  <strong title={d.titulo}>{d.titulo || "Sin título"}</strong>
                  <span className="dept-sub" title={d.direccion}>
                    {d.direccion || "Sin dirección cargada"}
                  </span>
                </div>
              </div>

              <div className="dept-loc">
                <span className="badge">{d.ciudad || "—"}</span>
                <span className="badge badge--soft">{d.provincia || "—"}</span>
              </div>

              <div className="dept-price">
                <span className="dept-price__main">${money(Number(d.precio_base_noche ?? 0))}</span>
                <span className="dept-price__sub">base / noche</span>
              </div>

              <div className="dept-actions">
                <span className={`status-badge ${d.status ? "is-on" : "is-off"}`}>
                  {d.status ? "Activo" : "Inactivo"}
                </span>

                <div className="actions actions--icons">
                  <Link className="icon-btn" to={`/admin/departamentos/${d.id}`} title="Ver" aria-label={`Ver ${d.titulo || "departamento"}`}>
                    👁
                  </Link>
                  <Link className="icon-btn" to={`/admin/departamentos/editar/${d.id}`} title="Editar" aria-label={`Editar ${d.titulo || "departamento"}`}>
                    ✏️
                  </Link>
                  <Link
                    className="icon-btn icon-btn--danger"
                    to={`/admin/departamentos/eliminar/${d.id}`}
                    title="Eliminar"
                    aria-label={`Eliminar ${d.titulo || "departamento"}`}
                  >
                    🗑
                  </Link>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}