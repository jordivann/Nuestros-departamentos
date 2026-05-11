import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";

import { db } from "../../services/firebase";
import { type Departamento } from "../../types/Departamento";

import "./Admin.css";

export default function AdminDepartmentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [dept, setDept] = useState<Departamento | null>(null);
  const [saving, setSaving] = useState(false);

  const [quickTitle, setQuickTitle] = useState("");
  const [quickPrice, setQuickPrice] = useState<number>(0);
  const [quickColor, setQuickColor] = useState<string>("#8B6F47");

  useEffect(() => {
    let alive = true;

    async function load() {
      if (!id) return;
      setLoading(true);

      const ref = doc(db, "departamentos", id);
      const snap = await getDoc(ref);

      if (!alive) return;

      if (!snap.exists()) {
        setDept(null);
        setLoading(false);
        return;
      }

      const data = { id: snap.id, ...(snap.data() as Omit<Departamento, "id">) };
      setDept(data);
      setQuickTitle(data.titulo ?? "");
      setQuickPrice(Number(data.precio_base_noche ?? 0));
      setQuickColor(data.color_principal || "#8B6F47");
      setLoading(false);
    }

    load();
    return () => {
      alive = false;
    };
  }, [id]);

  const heroImg = useMemo(() => dept?.imagenes?.[0] ?? "", [dept]);

  const prettyFeatures = useMemo(() => {
    const c = dept?.caracteristicas;
    if (!c) return [];

    const mapLabels: Record<string, string> = {
      ac: "Aire acond.",
      balcon: "Balcón",
      cable: "Cable",
      calefaccion: "Calefacción",
      estacionamiento: "Estacionamiento",
      fumadores: "Fumadores",
      lavarropas: "Lavarropas",
      mascotas: "Mascotas",
      parrilla: "Parrilla",
      patio: "Patio",
      pileta: "Pileta",
      ropa_cama: "Ropa de cama",
      secador_pelo: "Secador",
      seguridad: "Seguridad",
      terraza: "Terraza",
      tv: "TV",
      wifi: "WiFi",
    };

    return Object.entries(c)
      .filter(([k, v]) => typeof v === "boolean" && v === true && k !== "fumadores")
      .map(([k]) => mapLabels[k] ?? k);
  }, [dept]);

  function money(n: number) {
    return Number(n || 0).toLocaleString("es-AR");
  }

  async function toggleStatus() {
    if (!dept) return;
    setSaving(true);
    try {
      const ref = doc(db, "departamentos", dept.id);
      const next = !dept.status;
      await updateDoc(ref, { status: next });
      setDept({ ...dept, status: next });
    } finally {
      setSaving(false);
    }
  }

  async function saveQuickFields() {
    if (!dept) return;
    setSaving(true);
    try {
      const ref = doc(db, "departamentos", dept.id);
      await updateDoc(ref, {
        titulo: quickTitle.trim(),
        precio_base_noche: Number(quickPrice || 0),
        color_principal: quickColor,
      });
      setDept({
        ...dept,
        titulo: quickTitle.trim(),
        precio_base_noche: Number(quickPrice || 0),
        color_principal: quickColor,
      });
    } finally {
      setSaving(false);
    }
  }

  function copy(text: string) {
    navigator.clipboard?.writeText(text).catch(() => {});
  }

  if (loading) return <p className="adm-loading">Cargando…</p>;

  if (!dept) {
    return (
      <div className="admin-list-container">
        <div className="admin-header admin-header--hero">
          <div>
            <span className="admin-kicker">Detalle</span>
            <h1>Departamento</h1>
            <p>No se encontró la propiedad solicitada.</p>
          </div>
          <button className="btn-secondary" onClick={() => navigate(-1)} type="button">
            Volver
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-detail-page">
      <section className="adm-preview">
        <div className="adm-preview__hero">
          {heroImg ? <img src={heroImg} alt={dept.titulo} loading="lazy" /> : <div className="adm-preview__heroEmpty">Sin imagen</div>}

          <div className="adm-preview__badgeRow">
            <span className={`status-badge ${dept.status ? "is-on" : "is-off"}`}>
              {dept.status ? "Activo" : "Inactivo"}
            </span>
            {dept.color_principal && (
              <span className="badge badge--soft">
                <span
                  aria-hidden="true"
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: 999,
                    background: dept.color_principal,
                    display: "inline-block",
                    marginRight: 8,
                    border: "1px solid rgba(0,0,0,.12)",
                  }}
                />
                Color guía
              </span>
            )}
          </div>
        </div>

        <div className="adm-preview__card">
          <div className="adm-preview__top">
            <div>
              <span className="admin-kicker">Ficha de propiedad</span>
              <h1 className="adm-preview__title">{dept.titulo}</h1>
            </div>
            <div className="adm-preview__price">${money(dept.precio_base_noche)} / noche</div>
          </div>

          <div className="adm-preview__meta">
            <span>{dept.direccion || "Sin dirección"}</span>
            <span>·</span>
            <span>{dept.ciudad}, {dept.provincia}</span>
            <span>·</span>
            <span>{dept.pais}</span>
          </div>

          {dept.descripcion && <p className="adm-preview__desc">{dept.descripcion}</p>}

          <div className="adm-preview__stats">
            <div className="adm-stat">
              <span className="adm-muted">Ambientes</span>
              <strong>{dept.caracteristicas?.ambientes ?? "—"}</strong>
            </div>
            <div className="adm-stat">
              <span className="adm-muted">Capacidad</span>
              <strong>{dept.caracteristicas?.capacidad ?? "—"}</strong>
            </div>
            <div className="adm-stat">
              <span className="adm-muted">Imágenes</span>
              <strong>{dept.imagenes?.length ?? 0}</strong>
            </div>
          </div>

          {prettyFeatures.length > 0 && (
            <div className="adm-preview__block">
              <h4>Amenities destacados</h4>
              <div className="adm-preview__chips">
                {prettyFeatures.slice(0, 14).map((t) => <span key={t} className="badge">{t}</span>)}
              </div>
            </div>
          )}

          {dept.puntos_interes?.length > 0 && (
            <div className="adm-preview__block">
              <h4>Puntos de interés</h4>
              <div className="adm-preview__chips">
                {dept.puntos_interes.slice(0, 12).map((p, i) => <span key={p + i} className="badge badge--soft">{p}</span>)}
              </div>
            </div>
          )}

          {dept.observaciones && (
            <div className="adm-preview__block adm-preview__block--note">
              <h4>Observaciones internas</h4>
              <p>{dept.observaciones}</p>
            </div>
          )}
        </div>
      </section>

      <aside className="adm-panel">
        <div className="adm-panel__sticky">
          <div className="adm-panel__head">
            <div>
              <h3>Panel rápido</h3>
              <p className="adm-muted">Acciones frecuentes sin entrar al formulario completo.</p>
            </div>
            <Link className="btn-secondary" to="/admin/departamentos">
              Volver
            </Link>
          </div>

          <Link className="btn-primary adm-panel__cta" to={`/admin/departamentos/editar/${dept.id}`}>
            ✏️ Editar completo
          </Link>

          <div className="adm-panel__block">
            <div className="adm-panel__row">
              <div>
                <strong>Estado</strong>
                <p className="adm-muted">Controla si la propiedad queda activa.</p>
              </div>
              <button className="btn-secondary" onClick={toggleStatus} disabled={saving} type="button">
                {dept.status ? "Desactivar" : "Activar"}
              </button>
            </div>
          </div>

          <div className="adm-panel__block">
            <h4>Ajustes rápidos</h4>

            <label className="adm-field">
              <span>Título</span>
              <input value={quickTitle} onChange={(e) => setQuickTitle(e.target.value)} />
            </label>

            <label className="adm-field">
              <span>Precio base / noche</span>
              <input type="number" value={quickPrice} onChange={(e) => setQuickPrice(Number(e.target.value))} />
            </label>

            <label className="adm-field">
              <span>Color principal</span>
              <input type="color" value={quickColor} onChange={(e) => setQuickColor(e.target.value)} />
            </label>

            <button className="btn-primary" onClick={saveQuickFields} disabled={saving} type="button">
              {saving ? "Guardando…" : "Guardar cambios rápidos"}
            </button>
          </div>

          <div className="adm-panel__block">
            <h4>Utilidades</h4>

            <button className="btn-secondary" onClick={() => copy(`${dept.direccion}, ${dept.ciudad}, ${dept.provincia}, ${dept.pais}`)} type="button">
              Copiar dirección
            </button>

            <button className="btn-secondary" onClick={() => copy(`${dept.coordenadas?.lat ?? ""}, ${dept.coordenadas?.lng ?? ""}`)} type="button">
              Copiar coordenadas
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}