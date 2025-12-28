import { useState } from "react";
import "./Skeleton.css";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  src: string;
  alt?: string;
  className?: string;
}

export default function SkeletonImage({ src, alt = "", className = "", onClick }: Props) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div 
      className={`skeleton-wrapper ${className}`} 
      onClick={onClick}
      style={{ cursor: onClick ? "pointer" : "default" }}
    >
      {!loaded && <div className="skeleton" />}
      
      <img
        src={src}
        alt={alt}
        onLoad={() => setLoaded(true)}
        className={`smooth-image ${loaded ? "visible" : "hidden"}`}
      />
    </div>
  );
}
