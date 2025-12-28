import { useState } from "react";
import "./ImageCarousel.css";

interface Props {
  images: string[];
}

export default function ImageCarousel({ images }: Props) {
  // Filtrado seguro
  const safe = Array.isArray(images)
    ? images.filter((url) => typeof url === "string" && url.trim().length > 0)
    : [];

  // Si no hay imágenes válidas → fallback seguro
  if (safe.length === 0) {
    return (
      <div className="carousel">
        <div className="carousel-media">
          <img
            src="/fallback.jpg"
            alt="departamento"
            className="carousel-image"
          />
        </div>
      </div>
    );
  }

  const [current, setCurrent] = useState<number>(0);

  const goNext = () => {
    setCurrent((prev) => (prev + 1) % safe.length);
  };

  const goPrev = () => {
    setCurrent((prev) => (prev - 1 + safe.length) % safe.length);
  };

  // Verificar si una URL es video
  const isVideo = (url: string): boolean => {
    return (
      url.endsWith(".mp4") ||
      url.endsWith(".webm") ||
      url.endsWith(".mov") ||
      url.includes("video")
    );
  };

  return (
    <div className="carousel">
      {/* Botones solo si hay más de 1 imagen */}
      {safe.length > 1 && (
        <>
          
          <button className="carousel-btn left" onClick={goPrev}>
            ‹
          </button>

          <button className="carousel-btn right" onClick={goNext}>
            ›
          </button>
        </>
      )}

      <div className="carousel-media">
        {isVideo(safe[current]) ? (
          <video
            src={safe[current]}
            controls
            autoPlay
            muted
            loop
            className="carousel-video"
          />
        ) : (
          <img
            src={safe[current]}
            alt="departamento"
            className="carousel-image"
          />
        )}
      </div>

      {/* Indicadores */}
      {safe.length > 1 && (
        <div className="carousel-indicators">
          {safe.map((_, i) => (
            <span
              key={i}
              className={`dot ${i === current ? "active" : ""}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
