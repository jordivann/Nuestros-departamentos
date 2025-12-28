import "./CharacteristicCharts.css";
import { type Caracteristicas } from "../../types/Departamento";

interface Props {
  caracteristicas: Caracteristicas;
}

interface BadgeInfo {
  key: string;
  label: string;
}

export default function CharacteristicsBadges({ caracteristicas }: Props) {
  const badges: BadgeInfo[] = [
    { key: "wifi", label: "WiFi" },
    { key: "aire_acondicionado", label: "A/C" },
    { key: "estacionamiento", label: "Parking" },
    { key: "mascotas", label: "Mascotas" },
    { key: "pileta", label: "Pileta" },
    { key: "tv", label: "TV" },
    { key: "calefaccion", label: "Calefacción" },
  ];

  return (
    <div className="badges-container">
      {badges.map((b) =>
        caracteristicas[b.key] ? (
          <span key={b.key} className="badge">
            {b.label}
          </span>
        ) : null
      )}
    </div>
  );
}
