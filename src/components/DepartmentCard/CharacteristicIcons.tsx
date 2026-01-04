import "./CharacteristicIcons.css";
import { type Caracteristicas } from "../../types/Departamento";
import { FEATURES_MAP } from "../../utils/featureMap";

interface Props {
  caracteristicas: Caracteristicas;
  max?: number;
}

export default function CharacteristicsIcons({
  caracteristicas,
  max = 6,
}: Props) {
  const entries = Object.entries(FEATURES_MAP)
    .filter(([key]) => {
      const value = caracteristicas[key];
      if (typeof value === "boolean") return value === true;
      if (typeof value === "number") return value > 0;
      return false;
    })
    .slice(0, max);

  if (entries.length === 0) return null;

  return (
    <div className="features-icons">
      {entries.map(([key, feature]) => {
        const Icon = feature.icon;
        const value = caracteristicas[key];

        const tooltip =
          typeof value === "number"
            ? `${feature.label}: ${value}`
            : feature.label;

        return (
          <div
            key={key}
            className="feature-icon"
            data-tooltip={tooltip}
          >
            <Icon size={18} strokeWidth={1.6} />
          </div>
        );
      })}
    </div>
  );
}
