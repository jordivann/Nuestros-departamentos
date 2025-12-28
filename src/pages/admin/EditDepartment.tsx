import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../services/firebase";

import "./Admin.css";
import { type Departamento, type Caracteristicas } from "../../types/Departamento";

export default function EditDepartment() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState<Departamento | null>(null);

  useEffect(() => {
    async function load() {
      if (!id) return;

      const ref = doc(db, "departamentos", id);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        setForm({ id: snap.id, ...snap.data() } as Departamento);
      } else {
        alert("Departamento no encontrado.");
        navigate("/admin/departamentos");
      }

      setLoading(false);
    }

    load();
  }, [id, navigate]);

  // Actualizar campos generales
  const update = (field: keyof Departamento, value: any) => {
    if (!form) return;
    setForm((prev) => ({ ...(prev as Departamento), [field]: value }));
  };

  // Actualizar características
  const updateCaracteristica = (field: keyof Caracteristicas, value: any) => {
    if (!form) return;
    setForm((prev) => ({
      ...(prev as Departamento),
      caracteristicas: {
        ...(prev as Departamento).caracteristicas,
        [field]: value,
      },
    }));
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!id || !form) return;

    setSaving(true);

    try {
      const ref = doc(db, "departamentos", id);
      const { id: _omit, ...dataWithoutId } = form;

      await updateDoc(ref, dataWithoutId);
      navigate("/admin/departamentos");
    } catch (err) {
      console.error(err);
      alert("Error actualizando departamento");
    }

    setSaving(false);
  }

  function handleAddImage() {
    if (!form) return;

    const url = prompt("Ingresá la URL de la imagen:");
    if (url) update("imagenes", [...form.imagenes, url]);
  }

  if (loading || !form) return <p>Cargando departamento...</p>;

  return (
    <div className="admin-form-container">
      <h1>Editar Departamento</h1>

      <form className="admin-form" onSubmit={handleSubmit}>
        <label>Título</label>
        <input
          value={form.titulo}
          onChange={(e) => update("titulo", e.target.value)}
        />
        
        <label>Precio base por noche</label>
        <input
          type="number"
          value={form.precio_base_noche}
          onChange={(e) => update("precio_base_noche", Number(e.target.value))}
        />
        <small className="hint">
          Precio orientativo. Puede variar según fecha y temporada.
        </small>


        <label>Dirección</label>
        <input
          value={form.direccion}
          onChange={(e) => update("direccion", e.target.value)}
        />

        <label>Descripción</label>
        <textarea
          value={form.descripcion}
          onChange={(e) => update("descripcion", e.target.value)}
        />

        <label>Color principal</label>
        <input
          type="color"
          value={form.color_principal}
          onChange={(e) => update("color_principal", e.target.value)}
        />

        <label>Imágenes</label>
        <div className="images-list">
          {form.imagenes.map((img, i) => (
            <div key={i} className="image-item">
              {img}
            </div>
          ))}
        </div>

        <button type="button" className="btn-secondary" onClick={handleAddImage}>
          + Agregar Imagen
        </button>

        <label>Características</label>
        <div className="caracteristicas-grid">
          {Object.entries(form.caracteristicas).map(([key, value]) => (
            <label key={key} className="checkbox-item">
              <input
                type={typeof value === "boolean" ? "checkbox" : "number"}
                checked={typeof value === "boolean" ? value : undefined}
                value={typeof value === "number" ? value : undefined}
                onChange={(e) =>
                  updateCaracteristica(
                    key as keyof Caracteristicas,
                    typeof value === "boolean"
                      ? e.target.checked
                      : Number(e.target.value)
                  )
                }
              />
              {key}
            </label>
          ))}
        </div>

        <label>Observaciones</label>
        <textarea
          value={form.observaciones}
          onChange={(e) => update("observaciones", e.target.value)}
        />

        <button className="btn-primary" disabled={saving}>
          {saving ? "Guardando..." : "Guardar Cambios"}
        </button>
      </form>
    </div>
  );
}
