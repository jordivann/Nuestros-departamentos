import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../services/firebase";
import { type Departamento } from "../../types/Departamento";
import "./DepartmentDetail.css";

import SkeletonImage from "./Skeleton";
import FullscreenGallery from "../DepartmentCard/FullScreenGallery";
import FeatureItem from "./FeatureItem";
import { FEATURES_MAP, type FeatureKey } from "../../utils/featureMap";
import AppLoader from "../AppLoader";

export default function DepartmentDetail() {
  const { id } = useParams();
  const [item, setItem] = useState<Departamento | null>(null);
  const [loading, setLoading] = useState(true);

  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);

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

  if (loading) return <AppLoader visible={true} />;
  if (!item) return <p>No encontrado.</p>;

  /* ---------------------------
     MEDIA PRINCIPAL (NO VIDEO)
     --------------------------- */
  const getFirstImage = (arr: string[]) => {
    if (!Array.isArray(arr)) return "/fallback.jpg";

    for (const media of arr) {
      if (!media.match(/\.(mp4|mov|webm)$/i)) return media;
    }

    return "/fallback.jpg";
  };

  const mainImage = getFirstImage(item.imagenes);

  const next = () =>
    setGalleryIndex((i) => (i + 1) % item.imagenes.length);

  const prev = () =>
    setGalleryIndex(
      (i) => (i - 1 + item.imagenes.length) % item.imagenes.length
    );

  return (
    <div className="detail-wrapper">
      {/* HERO */}
      <div
        className="detail-hero"
        style={{ backgroundImage: `url(${mainImage})` }}
      >
        <div className="hero-gradient" />
        <h1 className="hero-title-detail">{item.titulo}</h1>
      </div>

      {/* CONTENT */}
      <div className="detail-content">
        {/* LEFT */}
        <div className="detail-left">
          {/* PRECIO */}
          <section className="section-box">
            <h2>Precio</h2>
            <p className="detail-price">
              Desde{" "}
              <strong>
                ${item.precio_base_noche?.toLocaleString("es-AR")}
              </strong>{" "}
              por noche
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
              {item.imagenes.map((media, i) => {
                const isVideo = media.match(/\.(mp4|mov|webm)$/i);

                return (
                  <div
                    key={i}
                    className="gallery-thumb"
                    onClick={() => {
                      setGalleryIndex(i);
                      setGalleryOpen(true);
                    }}
                  >
                    {isVideo ? (
                      <video
                        src={media}
                        className="thumb-media"
                        muted
                        playsInline
                        preload="metadata"
                        onLoadedMetadata={(e) =>
                          e.currentTarget.play()
                        }
                      />
                    ) : (
                      <SkeletonImage
                        src={media}
                        className="thumb-media"
                      />
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

          {/* CARACTERÍSTICAS (CLARAS) */}
          <section className="section-box">
            <h2>Características</h2>

            <div className="features-grid">
              {Object.entries(item.caracteristicas)
                .filter(([key, value]) => {
                  if (!(key in FEATURES_MAP)) return false;

                  if (typeof value === "boolean") return value;
                  if (typeof value === "number") return value > 0;

                  return false;
                })
                .map(([key, value]) => {
                  const { icon, label } = FEATURES_MAP[key as FeatureKey];

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
          <section className="section-box detail-location only-mobile">
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
                  `${item.direccion}, ${item.ciudad}, ${item.provincia}`
                )}&output=embed`}
                style={{ border: 0, borderRadius: "12px" }}
              />
            </div>

            <Link to="/" className="btn-return">
              ← Volver al inicio
            </Link>
          </section>
        </div>

        {/* RIGHT (DESKTOP) */}
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
                  `${item.direccion}, ${item.ciudad}, ${item.provincia}`
                )}&output=embed`}
                style={{ border: 0, borderRadius: "12px" }}
              />
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
