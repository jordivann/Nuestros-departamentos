import "./DepartmentCard.css";
import { Link } from "react-router-dom";
import { type Departamento } from "../../types/Departamento";
import ImageCarousel from "./ImageCarousel";
import CharacteristicsIcons from "./CharacteristicIcons";
import WhatsappButton from '../ContactButton/WhatsappButton';

interface Props {
  departamento: Departamento;
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

  const shortDesc =
    descripcion?.length > 120
      ? descripcion.slice(0, 120) + "…"
      : descripcion;

  return (
    <article className="department-card">

      {/* IMAGEN */}
      <div className="card-media">
        <ImageCarousel images={imagenes} />
      </div>

      {/* CONTENIDO */}
      <div className="card-body">

        <header className="card-header">
          <h2 className="card-title">{titulo}</h2>
          <p className="card-location">{direccion}</p>
        </header>

        {/* PRECIO */}
        {precio_base_noche && (
          <div className="card-price">
            <span className="price-from">Desde</span>
            <span className="price-value">
              ${precio_base_noche.toLocaleString("es-AR")}
            </span>
            <span className="price-night">/ noche</span>
          </div>
        )}

        <p className="price-note">
          Precio orientativo · Consultar disponibilidad
        </p>

        {/* DESCRIPCIÓN */}
        <p className="card-description">{shortDesc}</p>

        {/* CARACTERÍSTICAS */}
        <CharacteristicsIcons caracteristicas={caracteristicas} />

        {/* CTA */}
<div className="card-cta-group">
  <WhatsappButton
    titulo={titulo}
    direccion={direccion}
  />

  <Link to={`/departamento/${id}`} className="card-link">
    Ver detalles →
  </Link>
</div>

      </div>
    </article>
  );
}
