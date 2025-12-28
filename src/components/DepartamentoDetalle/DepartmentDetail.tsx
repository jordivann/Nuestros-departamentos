import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../services/firebase";
import { type Departamento } from "../../types/Departamento";
import "./DepartmentDetail.css";
import SkeletonImage from "./Skeleton";
import FullscreenGallery from "../DepartmentCard/FullScreenGallery";
import FeatureItem from "./FeatureItem";
import { FEATURES_MAP } from "../../utils/featureMap";
import AppLoader from "../AppLoader";

export default function DepartmentDetail() {
  const { id } = useParams();
  const [item, setItem] = useState<Departamento | null>(null);
  const [loading, setLoading] = useState(true);

  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);

  const openGallery = (i: number) => {
    setGalleryIndex(i);
    setGalleryOpen(true);
  };

  const next = () =>
    setGalleryIndex((i) => (i + 1) % item!.imagenes.length);

  const prev = () =>
    setGalleryIndex((i) => (i - 1 + item!.imagenes.length) % item!.imagenes.length);

  useEffect(() => {
    async function load() {
      if (!id) return;
      const ref = doc(db, "departamentos", id);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        setItem({ id: snap.id, ...snap.data() } as Departamento);
      }
      setLoading(false);
    }
    load();
  }, [id]);

  if (loading) return <AppLoader />;
  if (!item) return <p>No encontrado.</p>;

  // Encuentra la primera imagen válida (no video)
  const getFirstImage = (arr: string[]) => {
    if (!Array.isArray(arr)) return "/fallback.jpg";

    for (const media of arr) {
      const isVideo = media.match(/\.(mp4|mov|webm)$/i);
      if (!isVideo) return media; // primera imagen real
    }

    return "/fallback.jpg"; // si todas son videos
  };
  const mainImage = getFirstImage(item.imagenes);

  return (
    <div className="detail-wrapper">

      {/* HERO */}
      <div
        className="detail-hero"
        style={{ backgroundImage: `url(${mainImage})` }}
      >
        <div className="hero-gradient" />
        <h1 className="hero-title">{item.titulo}</h1>
      </div>


      {/* CONTENT GRID */}
      <div className="detail-content">

        {/* LEFT SIDE */}
        <div className="detail-left">
          <section className="section-box">
              <h2>Precio</h2>

              <p className="detail-price">
                Desde <strong>${item.precio_base_noche?.toLocaleString("es-AR")}</strong> por noche
              </p>

              <p className="detail-price-note">
                Precio orientativo. Puede variar según fecha y temporada.
                Consultá disponibilidad por WhatsApp.
              </p>
            </section>


          {/* GALERÍA */}
          <section className="section-box">
            <h2>Galería</h2>
            <div className="image-grid">

              {item.imagenes?.map((media, i) => {
                const isVideo = media.match(/\.(mp4|mov|webm)$/i);

                return (
                  <div
                    key={i}
                    className="gallery-thumb"
                    onClick={() => openGallery(i)}
                  >
                    {isVideo ? (
                      <video
                        src={media}
                        className="thumb-media"
                        muted
                        playsInline
                        preload="metadata"
                        onLoadedMetadata={(e) => e.currentTarget.play()}
                      />
                    ) : (
                      <SkeletonImage src={media} className="thumb-media" />
                    )}
                  </div>
                );
              })}

            </div>
          </section>

          {galleryOpen && (
            <FullscreenGallery
              images={item.imagenes}
              index={galleryIndex}
              onClose={() => setGalleryOpen(false)}
              onNext={next}
              onPrev={prev}
            />
          )}

          {/* DESCRIPCIÓN */}
          <section className="section-box">
            <h2>Descripción</h2>
            <p className="description-text">{item.descripcion}</p>
          </section>

          {/* CARACTERÍSTICAS */}
          <section className="section-box">
            <h2>Características</h2>

            <div className="features-grid">
              {Object.entries(item.caracteristicas)
                .filter(([key, value]) => {
                  const feature = FEATURES_MAP[key];
                  if (!feature) return false;
                  return value === true || typeof value === "number";
                })
                .map(([key, value]) => {
                  const { icon, label } = FEATURES_MAP[key];
                  return (
                    <FeatureItem
                      key={key}
                      icon={icon}
                      label={label}
                      value={value}
                    />
                  );
                })}
            </div>
          </section>

          {/* OBSERVACIONES */}
          {item.observaciones && (
            <section className="section-box">
              <h2>Observaciones</h2>
              <p>{item.observaciones}</p>
            </section>
          )}

          {/* UBICACIÓN MOBILE */}
          <section className="section-box detail-location">
            <h2>Ubicación</h2>

            <p>
              {item.direccion}, {item.ciudad}, {item.provincia}
            </p>

            <div className="map-box">
              <iframe
                width="100%"
                height="300"
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                src={`https://www.google.com/maps?q=${encodeURIComponent(
                  item.direccion +
                    ", " +
                    item.ciudad +
                    ", " +
                    item.provincia
                )}&output=embed`}
                style={{ border: 0, borderRadius: "12px" }}
              ></iframe>
            </div>

            <Link to="/" className="btn-return">
              ← Volver al inicio
            </Link>
          </section>
        </div>

        {/* RIGHT SIDE DESKTOP */}
        <div className="detail-right desktop-only">
          <div className="info-card">
            <h3 className="info-title">Ubicación</h3>

            <p>
              {item.direccion}, {item.ciudad}, {item.provincia}
            </p>

            <div className="map-box">
              <iframe
                width="100%"
                height="300"
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                src={`https://www.google.com/maps?q=${encodeURIComponent(
                  item.direccion +
                    ", " +
                    item.ciudad +
                    ", " +
                    item.provincia
                )}&output=embed`}
                style={{ border: 0, borderRadius: "12px" }}
              ></iframe>
            </div>

            <Link to="/" className="btn-return">
              ← Volver al inicio
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
