    import "./FeatureItem.css";

interface Props {
  icon: string;
  label: string;
  value: boolean | number | string; 
}

export default function FeatureItem({ icon, label, value }: Props) {
  return (
    <div className="feature-box">
      <span className="feature-icon">{icon}</span>
      <div className="feature-text">
        <span className="feature-label">{label}</span>

        {typeof value === "number" && (
          <span className="feature-number">{value}</span>
        )}
      </div>
    </div>
  );
}
