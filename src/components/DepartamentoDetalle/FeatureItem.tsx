interface Props {
  icon: React.ElementType;
  label: string;
  value: boolean | number | string;
}

export default function FeatureItem({ icon: Icon, label, value }: Props) {
  return (
    <div className="feature-item">
      <div className="feature-icon">
        <Icon size={20} strokeWidth={1.6} />
      </div>

      <div className="feature-text">
        <span className="feature-label">{label}</span>

        {typeof value === "number" && (
          <span className="feature-value">
            : {value}
          </span>
        )}
      </div>
    </div>
  );
}
