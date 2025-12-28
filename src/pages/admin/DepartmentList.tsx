import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { DepartmentsService } from "../../services/departments.service";
import { type Departamento } from "../../types/Departamento";

import "./Admin.css";
export default function DepartmentList() {
  const [items, setItems] = useState<Departamento[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    DepartmentsService.getAll().then((data) => {
      setItems(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <p>Cargando departamentos...</p>;

  return (
    <div className="admin-list-container">
      <div className="admin-header">
        <h1>Departamentos</h1>

        <Link className="btn-primary" to="/admin/departamentos/nuevo">
          + Nuevo Departamento
        </Link>
      </div>

      <div className="department-table">
        {items.length === 0 && (
          <p style={{ padding: "20px", textAlign: "center", color: "#666" }}>
            No hay departamentos cargados.
          </p>
        )}

        {items.map((d) => (
          <div key={d.id} className="department-row">
          <div key={d.id} className="department-row">
              <span><strong>{d.titulo}</strong></span>
              <span>{d.direccion}</span>
              <span>${d.precio_base_noche?.toLocaleString("es-AR")}</span>

              <div className="actions">
                <Link to={`/admin/departamentos/${d.id}`}>Ver</Link>
                <Link to={`/admin/departamentos/editar/${d.id}`}>Editar</Link>
                <Link className="btn-delete" to={`/admin/departamentos/eliminar/${d.id}`}>
                  Eliminar
                </Link>
              </div>
            </div>


            <div className="actions">
              <Link to={`/admin/departamentos/${d.id}`}>Ver</Link>
              <Link to={`/admin/departamentos/editar/${d.id}`}>Editar</Link>
              <Link className="btn-delete" to={`/admin/departamentos/eliminar/${d.id}`}>
                Eliminar
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
