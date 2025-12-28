import "./DepartmentCard.css";
import { Link } from "react-router-dom";
import { type Departamento } from "../../types/Departamento";
import ImageCarousel from "./ImageCarousel";

interface Props {
  departamento: Departamento;
  index: number;
}

export default function DepartmentCard({ departamento }: Props) {
  const {
    id,
    titulo,
    direccion,
    descripcion,
    imagenes,
    caracteristicas,
    precio_base_noche,
  } = departamento;

  const safeImages =
    Array.isArray(imagenes) && imagenes.length > 0
      ? imagenes
      : ["/fallback.jpg"];

  const desc = typeof descripcion === "string" ? descripcion : "";
  const shortDesc = desc.length > 120 ? desc.slice(0, 120) + "..." : desc;

  return (
    <div className="booking-card">

      {/* IMAGEN */}
      <div className="booking-card-image">
        <ImageCarousel images={safeImages} />
      </div>

      <Link to={`/departamento/${id}`} className="linkDetail">
        <div className="booking-card-info">

          <h2 className="booking-title">{titulo}</h2>
          <p className="booking-address">{direccion}</p>

          {/* PRECIO */}
          <div className="booking-price">
            <span className="price-from">Desde</span>
            <span className="price-value">
              ${precio_base_noche?.toLocaleString("es-AR")}
            </span>
            <span className="price-night">/ noche</span>
          </div>

          <p className="price-note">
            Precio aproximado · Consultar disponibilidad
          </p>

          <p className="booking-description">{shortDesc}</p>

          <div className="booking-tags">
            {Object.entries(caracteristicas).map(([key, val]) =>
              val === true ? (
                <span key={key} className="booking-tag">
                  {key.replace("_", " ").toUpperCase()}
                </span>
              ) : null
            )}
          </div>

          <Link className="booking-btn" to={`/departamento/${id}`}>
            Ver departamento →
          </Link>
        </div>
      </Link>
    </div>
  );
}
