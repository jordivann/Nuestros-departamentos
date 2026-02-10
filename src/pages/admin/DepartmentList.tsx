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
            return (Number(a.precio_base_noche ?? 0) - Number(b.precio_base_noche ?? 0));
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
    return n?.toLocaleString("es-AR");
  }

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((p) => (p === "asc" ? "desc" : "asc"));
      return;
    }
    setSortKey(key);
    setSortDir("asc");
  }

  if (loading) return <p>Cargando departamentos...</p>;

  return (
    <div className="admin-list-container">
      <div className="admin-header">
        <div>
          <h1>Departamentos</h1>
          <p>Administrá el inventario: estado, precio, ubicación y edición rápida.</p>
        </div>

        <Link className="btn-primary" to="/admin/departamentos/nuevo">
          + Nuevo Departamento
        </Link>
      </div>

{/*  
      <section className="adm-kpis">
        <div className="adm-kpi">
          <span className="adm-kpi__label">Total</span>
          <span className="adm-kpi__value">{kpis.total}</span>
        </div>
        <div className="adm-kpi">
          <span className="adm-kpi__label">Activos</span>
          <span className="adm-kpi__value">{kpis.activos}</span>
        </div>
        <div className="adm-kpi">
          <span className="adm-kpi__label">Inactivos</span>
          <span className="adm-kpi__value">{kpis.inactivos}</span>
        </div>
        <div className="adm-kpi">
          <span className="adm-kpi__label">Precio promedio</span>
          <span className="adm-kpi__value">${money(kpis.avg)}</span>
        </div>
        <div className="adm-kpi">
          <span className="adm-kpi__label">Rango</span>
          <span className="adm-kpi__value">
            ${money(kpis.min)} – ${money(kpis.max)}
          </span>
        </div>
      </section> */}

      {/* Toolbar */}
      <section className="adm-toolbar">
        <div className="adm-search">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar por título, dirección, ciudad, provincia…"
            aria-label="Buscar departamentos"
          />
          {q && (
            <button className="adm-clear" onClick={() => setQ("")} aria-label="Limpiar búsqueda">
              ×
            </button>
          )}
        </div>

        <div className="adm-filters">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            aria-label="Filtrar por estado"
          >
            <option value="all">Todos</option>
            <option value="active">Activos</option>
            <option value="inactive">Inactivos</option>
          </select>

          <select
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value as SortKey)}
            aria-label="Ordenar por"
          >
            <option value="titulo">Orden: Título</option>
            <option value="ciudad">Orden: Ciudad</option>
            <option value="precio">Orden: Precio</option>
            <option value="status">Orden: Estado</option>
          </select>

          <button className="btn-secondary" onClick={() => setSortDir((p) => (p === "asc" ? "desc" : "asc"))}>
            {sortDir === "asc" ? "Asc" : "Desc"}
          </button>
        </div>
      </section>

      <div className="department-table">
        {/* Header sticky */}
        <div className="dept-head">
          <button className="dept-head__cell" onClick={() => toggleSort("titulo")}>
            Departamento
          </button>
          <button className="dept-head__cell" onClick={() => toggleSort("ciudad")}>
            Ubicación
          </button>
          <button className="dept-head__cell" onClick={() => toggleSort("precio")}>
            Precio
          </button>
          <button className="dept-head__cell dept-head__cell--right" onClick={() => toggleSort("status")}>
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
            <div key={d.id} className="department-row dept-row--rich">
              <div className="dept-main">
                <div className="dept-thumb" aria-hidden="true">
                  {img ? <img src={img} alt="" loading="lazy" /> : <span>—</span>}
                </div>
                <div className="dept-title">
                  <strong title={d.titulo}>{d.titulo}</strong>
                  <span className="dept-sub" title={d.direccion}>
                    {d.direccion}
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
                  <Link className="icon-btn" to={`/admin/departamentos/${d.id}`} title="Ver" aria-label="Ver">
                    👁
                  </Link>
                  <Link className="icon-btn" to={`/admin/departamentos/editar/${d.id}`} title="Editar" aria-label="Editar">
                    ✏️
                  </Link>
                  <Link
                    className="icon-btn icon-btn--danger"
                    to={`/admin/departamentos/eliminar/${d.id}`}
                    title="Eliminar"
                    aria-label="Eliminar"
                  >
                    🗑
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
