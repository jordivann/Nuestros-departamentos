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

const featureLabels: Record<string, string> = {
  ac: "Aire acondicionado",
  ambientes: "Ambientes",
  balcon: "Balcón",
  cable: "Cable",
  calefaccion: "Calefacción",
  capacidad: "Capacidad",
  estacionamiento: "Estacionamiento",
  fumadores: "Permite fumadores",
  lavarropas: "Lavarropas",
  mascotas: "Acepta mascotas",
  parrilla: "Parrilla",
  patio: "Patio",
  pileta: "Pileta",
  ropa_cama: "Ropa de cama",
  secador_pelo: "Secador de pelo",
  seguridad: "Seguridad",
  terraza: "Terraza",
  tv: "TV",
  wifi: "WiFi",
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

  const updateCoordinate = (field: "lat" | "lng", value: number) => {
    setForm((prev) => ({ ...prev, coordenadas: { ...prev.coordenadas, [field]: value } }));
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
      let imagenesFinal = form.imagenes;

      if (imageFile) {
        const { publicUrl } = await uploadDepartmentImage(imageFile);
        imagenesFinal = [...imagenesFinal, publicUrl];
        setImageFile(null);
      }

      await addDoc(collection(db, "departamentos"), { ...form, imagenes: imagenesFinal });
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
      <div className="admin-form-head">
        <span className="admin-kicker">Nueva propiedad</span>
        <h1>Nuevo departamento</h1>
        <p>Cargá la información comercial, ubicación, características e imágenes del alojamiento.</p>
      </div>

      <form className="admin-form" onSubmit={handleSubmit}>
        <section className="form-section">
          <div className="form-section__head">
            <h2>Datos principales</h2>
            <p>Información visible para identificar la propiedad.</p>
          </div>

          <div className="form-grid form-grid--2">
            <label className="adm-field">
              <span>Título</span>
              <input value={form.titulo} onChange={(e) => update("titulo", e.target.value)} placeholder="Ej: Departamento premium Nueva Córdoba" required />
            </label>

            <label className="adm-field">
              <span>Precio base por noche</span>
              <input
                type="number"
                value={form.precio_base_noche}
                onChange={(e) => update("precio_base_noche", Number(e.target.value))}
                min={0}
              />
              <small className="hint">Precio orientativo. Puede variar según fecha y temporada.</small>
            </label>
          </div>

          <label className="adm-field">
            <span>Descripción</span>
            <textarea value={form.descripcion} onChange={(e) => update("descripcion", e.target.value)} placeholder="Descripción breve del departamento, estilo, ventajas y diferenciales." />
          </label>
        </section>

        <section className="form-section">
          <div className="form-section__head">
            <h2>Ubicación</h2>
            <p>Datos geográficos y dirección completa.</p>
          </div>

          <label className="adm-field">
            <span>Dirección</span>
            <input value={form.direccion} onChange={(e) => update("direccion", e.target.value)} placeholder="Calle, número, piso o referencia" />
          </label>

          <div className="form-grid form-grid--3">
            <label className="adm-field">
              <span>Ciudad</span>
              <input value={form.ciudad} onChange={(e) => update("ciudad", e.target.value)} />
            </label>
            <label className="adm-field">
              <span>Provincia</span>
              <input value={form.provincia} onChange={(e) => update("provincia", e.target.value)} />
            </label>
            <label className="adm-field">
              <span>País</span>
              <input value={form.pais} onChange={(e) => update("pais", e.target.value)} />
            </label>
          </div>

          <div className="form-grid form-grid--2">
            <label className="adm-field">
              <span>Latitud</span>
              <input type="number" value={form.coordenadas.lat} onChange={(e) => updateCoordinate("lat", Number(e.target.value))} step="any" />
            </label>
            <label className="adm-field">
              <span>Longitud</span>
              <input type="number" value={form.coordenadas.lng} onChange={(e) => updateCoordinate("lng", Number(e.target.value))} step="any" />
            </label>
          </div>
        </section>

        <section className="form-section">
          <div className="form-section__head">
            <h2>Imágenes y estado</h2>
            <p>Contenido visual, color de referencia y publicación.</p>
          </div>

          <div className="form-grid form-grid--2">
            <label className="adm-field">
              <span>Color principal</span>
              <input type="color" value={form.color_principal} onChange={(e) => update("color_principal", e.target.value)} />
            </label>

            <label className="checkbox-item checkbox-item--inline">
              <input type="checkbox" checked={form.status} onChange={(e) => update("status", e.target.checked)} />
              Departamento activo
            </label>
          </div>

          <label className="adm-field">
            <span>Imágenes / videos</span>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,video/mp4,video/webm"
              onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
            />
            <small className="hint">JPG, PNG, WEBP, MP4 o WEBM. Recomendado: imágenes livianas y horizontales.</small>
          </label>

          {previewUrl && imageFile && (
            <div className="media-preview">
              {imageFile.type.startsWith("video/") ? <video src={previewUrl} controls /> : <img src={previewUrl} alt="Preview" />}
            </div>
          )}

          <button type="button" className="btn-secondary btn-fit" onClick={handleUploadAndAdd} disabled={!imageFile || imgUploading}>
            {imgUploading ? "Subiendo..." : "Subir y agregar imagen"}
          </button>

          <div className="images-list">
            {form.imagenes.length === 0 ? (
              <div className="hint">Todavía no hay imágenes cargadas.</div>
            ) : (
              form.imagenes.map((img, i) => (
                <div key={img + i} className="image-item">
                  <span>{img}</span>
                  <button type="button" className="btn-secondary" onClick={() => removeImage(i)}>
                    Quitar
                  </button>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="form-section">
          <div className="form-section__head">
            <h2>Características</h2>
            <p>Configuración funcional y amenities del departamento.</p>
          </div>

          <div className="caracteristicas-grid">
            {Object.entries(form.caracteristicas).map(([key, value]) => (
              <label key={key} className="checkbox-item">
                <input
                  type={typeof value === "boolean" ? "checkbox" : "number"}
                  checked={typeof value === "boolean" ? value : undefined}
                  value={typeof value === "number" ? value : undefined}
                  min={typeof value === "number" ? 0 : undefined}
                  onChange={(e) =>
                    updateCaracteristica(
                      key as keyof Caracteristicas,
                      typeof value === "boolean" ? e.target.checked : Number(e.target.value)
                    )
                  }
                />
                {featureLabels[key] ?? key}
              </label>
            ))}
          </div>
        </section>

        <section className="form-section">
          <div className="form-section__head">
            <h2>Observaciones internas</h2>
            <p>Notas administrativas o datos útiles para el equipo.</p>
          </div>

          <label className="adm-field">
            <span>Observaciones</span>
            <textarea value={form.observaciones} onChange={(e) => update("observaciones", e.target.value)} />
          </label>
        </section>

        <div className="form-actions">
          <button type="button" className="btn-secondary" onClick={() => navigate("/admin/departamentos")}>
            Cancelar
          </button>
          <button className="btn-primary" disabled={loading || imgUploading}>
            {loading ? "Guardando..." : "Guardar departamento"}
          </button>
        </div>
      </form>
    </div>
  );
}