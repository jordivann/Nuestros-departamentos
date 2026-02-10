import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../services/firebase";

import "./Admin.css";
import { type Departamento, type Caracteristicas } from "../../types/Departamento";
import { uploadDepartmentMediaToApi as uploadDepartmentImage } from "../../utils/uploadDepartmentUrl";

export default function EditDepartment() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [imgUploading, setImgUploading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const previewUrl = useMemo(() => {
    if (!imageFile) return "";
    return URL.createObjectURL(imageFile);
  }, [imageFile]);

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

  const update = (field: keyof Departamento, value: any) => {
    if (!form) return;
    setForm((prev) => ({ ...(prev as Departamento), [field]: value }));
  };

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

  function removeImage(index: number) {
    if (!form) return;
    update(
      "imagenes",
      form.imagenes.filter((_, i) => i !== index)
    );
  }

  async function handleUploadAndAdd() {
    if (!imageFile || !form) return;

    setImgUploading(true);
    try {
      const { publicUrl } = await uploadDepartmentImage(imageFile);
      update("imagenes", [...form.imagenes, publicUrl]);
      setImageFile(null);
    } catch (err: any) {
      console.error(err);
      alert(err?.message || "Error subiendo imagen");
    } finally {
      setImgUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!id || !form) return;

    setSaving(true);

    try {
      // Si el usuario dejó un archivo seleccionado y no lo subió, lo subimos acá.
      let imagenesFinal = form.imagenes;

      if (imageFile) {
        const { publicUrl } = await uploadDepartmentImage(imageFile);
        imagenesFinal = [...imagenesFinal, publicUrl];
        setImageFile(null);
      }

      const ref = doc(db, "departamentos", id);
      const { id: _omit, ...dataWithoutId } = form;

      await updateDoc(ref, { ...dataWithoutId, imagenes: imagenesFinal });
      navigate("/admin/departamentos");
    } catch (err) {
      console.error(err);
      alert("Error actualizando departamento");
    } finally {
      setSaving(false);
    }
  }

  if (loading || !form) return <p>Cargando departamento...</p>;

  return (
    <div className="admin-form-container">
      <h1>Editar Departamento</h1>

      <form className="admin-form" onSubmit={handleSubmit}>
        <label>Título</label>
        <input value={form.titulo} onChange={(e) => update("titulo", e.target.value)} />

        <label>Precio base por noche</label>
        <input
          type="number"
          value={form.precio_base_noche}
          onChange={(e) => update("precio_base_noche", Number(e.target.value))}
          min={0}
        />
        <small className="hint">Precio orientativo. Puede variar según fecha y temporada.</small>

        <label>Dirección</label>
        <input value={form.direccion} onChange={(e) => update("direccion", e.target.value)} />

        <label>Descripción</label>
        <textarea value={form.descripcion} onChange={(e) => update("descripcion", e.target.value)} />

        <label>Color principal</label>
        <input
          type="color"
          value={form.color_principal}
          onChange={(e) => update("color_principal", e.target.value)}
        />

        <label>Imágenes (Supabase Storage)</label>

        <input
          type="file"
          accept="image/jpeg,image/png,image/webp,video/mp4,video/webm"
          onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
        />

        <small className="hint">Subí una imagen y agregala a la lista. (JPG/PNG/WEBP &lt; 6MB)</small>

        {previewUrl && imageFile && (
          <div style={{ marginTop: 10 }}>
            {imageFile.type.startsWith("video/") ? (
              <video
                src={previewUrl}
                controls
                style={{ width: 280, borderRadius: 12, border: "1px solid rgba(0,0,0,.08)" }}
              />
            ) : (
              <img
                src={previewUrl}
                alt="Preview"
                style={{ width: 280, borderRadius: 12, border: "1px solid rgba(0,0,0,.08)" }}
              />
            )}
          </div>
        )}


        <button
          type="button"
          className="btn-secondary"
          onClick={handleUploadAndAdd}
          disabled={!imageFile || imgUploading}
          style={{ marginTop: 10 }}
        >
          {imgUploading ? "Subiendo..." : "Subir y agregar imagen"}
        </button>

        <div className="images-list" style={{ marginTop: 12 }}>
          {form.imagenes.length === 0 ? (
            <div className="hint">Todavía no hay imágenes cargadas.</div>
          ) : (
            form.imagenes.map((img, i) => (
              <div key={i} className="image-item" style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {img}
                </span>
                <button type="button" className="btn-secondary" onClick={() => removeImage(i)}>
                  Quitar
                </button>
              </div>
            ))
          )}
        </div>

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
                    typeof value === "boolean" ? e.target.checked : Number(e.target.value)
                  )
                }
              />
              {key}
            </label>
          ))}
        </div>

        <label>Observaciones</label>
        <textarea value={form.observaciones} onChange={(e) => update("observaciones", e.target.value)} />

        <button className="btn-primary" disabled={saving || imgUploading}>
          {saving ? "Guardando..." : "Guardar Cambios"}
        </button>
      </form>
    </div>
  );
}
