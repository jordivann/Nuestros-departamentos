import { useEffect } from "react";
import "./FullscreenGallery.css";

interface Props {
  images: string[];
  index: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

export default function FullscreenGallery({
  images,
  index,
  onClose,
  onNext,
  onPrev,
}: Props) {
  
  const current = images[index];
  const isVideo = current.match(/\.(mp4|mov|webm)$/i);

  // Cerrar con Escape y navegar con teclado
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNext();
      if (e.key === "ArrowLeft") onPrev();
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose, onNext, onPrev]);

  return (
    <div className="fs-overlay" onClick={onClose}>
      <div className="fs-content" onClick={(e) => e.stopPropagation()}>
        
        {/* Botón cerrar */}
        <button className="fs-close" onClick={onClose}>
          ✕
        </button>

        {/* Media: imagen o video */}
        {isVideo ? (
          <video
            src={current}
            controls
            autoPlay
            className="fs-media"
          />
        ) : (
          <img
            src={current}
            className="fs-media"
            alt=""
          />
        )}

        {/* Flechas navegación */}
        {images.length > 1 && (
          <>
            <button className="fs-arrow left" onClick={onPrev}>‹</button>
            <button className="fs-arrow right" onClick={onNext}>›</button>
          </>
        )}
      </div>
    </div>
  );
}
