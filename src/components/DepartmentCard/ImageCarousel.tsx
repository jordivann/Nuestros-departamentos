import { useState } from "react";
import "./ImageCarousel.css";

interface Props {
  images: string[];
}

const isVideo = (url: string) => /\.(mp4|webm|mov)$/i.test(url);

export default function ImageCarousel({ images }: Props) {
  const safe = Array.isArray(images)
    ? images.filter((i) => typeof i === "string" && i.trim())
    : [];

  if (safe.length === 0) {
    return (
      <div className="carousel-composed">
        <img src="/fallback.jpg" className="media-main" />
      </div>
    );
  }

  const [index, setIndex] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);

  const handleNext = () => {
    setPrev(index);
    setIndex((i) => (i + 1) % safe.length);
  };

  const renderMedia = (src: string, className: string) =>
    isVideo(src) ? (
      <video
        src={src}
        muted
        loop
        autoPlay
        playsInline
        className={className}
      />
    ) : (
      <img src={src} className={className} />
    );

  return (
    <div className="carousel-composed">
      {/* MEDIA ACTUAL */}
      <div className="media-layer active">
        {renderMedia(safe[index], "media-main")}
      </div>

      {/* MEDIA SALIENTE */}
      {prev !== null && (
        <div className="media-layer outgoing">
          {renderMedia(safe[prev], "media-main")}
        </div>
      )}

      {/* MEDIA SECONDARY FIJA */}
      {safe.length > 1 && (
        <div className="media-secondary-wrapper">
          {renderMedia(
            safe[(index + 1) % safe.length],
            "media-secondary"
          )}
        </div>
      )}

      {safe.length > 1 && (
        <button className="carousel-next" onClick={handleNext}>
          →
        </button>
      )}
    </div>
  );
}
