import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../../services/firebase";
import "./Admin.css";
import { type Caracteristicas, type Departamento } from "../../types/Departamento";
import { uploadDepartmentMediaToApi as uploadDepartmentImage } from "../../utils/uploadDepartmentUrl";

const defaultCaracteristicas: Caracteristicas = {
  ac: false,
  ambientes: 1,
  balcon: false,
  cable: false,
  calefaccion: false,
  capacidad: 1,
  estacionamiento: false,
  fumadores: false,
  lavarropas: false,
  mascotas: false,
  parrilla: false,
  patio: false,
  pileta: false,
  ropa_cama: false,
  secador_pelo: false,
  seguridad: false,
  terraza: false,
  tv: false,
  wifi: false,
};

export default function NewDepartment() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [imgUploading, setImgUploading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const previewUrl = useMemo(() => {
    if (!imageFile) return "";
    return URL.createObjectURL(imageFile);
  }, [imageFile]);

  const [form, setForm] = useState<Omit<Departamento, "id">>({
    titulo: "",
    descripcion: "",
    direccion: "",
    ciudad: "Córdoba",
    provincia: "Córdoba",
    pais: "Argentina",
    coordenadas: { lat: 0, lng: 0 },
    imagenes: [],
    color_principal: "#BFA6E3",
    caracteristicas: defaultCaracteristicas,
    precio_base_noche: 0,
    observaciones: "",
    puntos_interes: [],
    status: true,
  });

  const update = (field: keyof typeof form, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const updateCaracteristica = (field: keyof Caracteristicas, value: any) => {
    setForm((prev) => ({
      ...prev,
      caracteristicas: { ...prev.caracteristicas, [field]: value },
    }));
  };

  function removeImage(index: number) {
    update(
      "imagenes",
      form.imagenes.filter((_, i) => i !== index)
    );
  }

  async function handleUploadAndAdd() {
    if (!imageFile) return;

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
    setLoading(true);

    try {
      // Si hay un archivo seleccionado y el usuario no apretó “Subir”, lo subimos igual.
      if (imageFile) {
        const { publicUrl } = await uploadDepartmentImage(imageFile);
        update("imagenes", [...form.imagenes, publicUrl]);
        setImageFile(null);
      }

      // Ojo: update() es async state, por eso usamos una copia final
      const finalForm = {
        ...form,
        imagenes: imageFile ? [...form.imagenes] : form.imagenes,
      };

      await addDoc(collection(db, "departamentos"), finalForm);
      navigate("/admin/departamentos");
    } catch (err) {
      console.error(err);
      alert("Error guardando departamento");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="admin-form-container">
      <h1>Nuevo Departamento</h1>

      <form className="admin-form" onSubmit={handleSubmit}>
        <label>Título</label>
        <input value={form.titulo} onChange={(e) => update("titulo", e.target.value)} />

        <label>Dirección</label>
        <input value={form.direccion} onChange={(e) => update("direccion", e.target.value)} />

        <label>Precio base por noche</label>
        <input
          type="number"
          value={form.precio_base_noche}
          onChange={(e) => update("precio_base_noche", Number(e.target.value))}
          min={0}
        />
        <small className="hint">Precio orientativo. Puede variar según fecha y temporada.</small>

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
          accept="image/jpeg,image/png,image/webp"
          onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
        />
        <small className="hint">Formatos: JPG/PNG/WEBP. Recomendado &lt; 6MB.</small>

        {previewUrl && (
          <div style={{ marginTop: 10 }}>
            <img
              src={previewUrl}
              alt="Preview"
              style={{ width: 280, borderRadius: 12, border: "1px solid rgba(0,0,0,.08)" }}
            />
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
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => removeImage(i)}
                  title="Quitar"
                >
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

        <button className="btn-primary" disabled={loading || imgUploading}>
          {loading ? "Guardando..." : "Crear Departamento"}
        </button>
      </form>
    </div>
  );
}
