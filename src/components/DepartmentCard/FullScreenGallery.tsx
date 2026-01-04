import { useEffect, useState } from "react";
import "./FullScreenGallery.css";

interface Props {
  images: string[];
  index: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

export default function FullScreenGallery({
  images,
  index,
  onClose,
  onNext,
  onPrev,
}: Props) {
  const current = images[index];
  const isVideo = /\.(mp4|mov|webm)$/i.test(current);

  /* ---------------------------
     MOBILE SWIPE STATE
     --------------------------- */
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const MIN_SWIPE = 50;

  /* ---------------------------
     LOCK SCROLL + KEYBOARD
     --------------------------- */
  useEffect(() => {
    document.body.style.overflow = "hidden";

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNext();
      if (e.key === "ArrowLeft") onPrev();
    };

    window.addEventListener("keydown", handleKey);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKey);
    };
  }, [onClose, onNext, onPrev]);

  /* ---------------------------
     HANDLE SWIPE
     --------------------------- */
  const handleTouchEnd = () => {
    if (touchStart === null || touchEnd === null) return;

    const distance = touchStart - touchEnd;

    if (distance > MIN_SWIPE) onNext();
    if (distance < -MIN_SWIPE) onPrev();

    setTouchStart(null);
    setTouchEnd(null);
  };

  return (
    <div className="fs-overlay" onClick={onClose}>
      <div
        className="fs-content"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={(e) =>
          setTouchStart(e.targetTouches[0].clientX)
        }
        onTouchMove={(e) =>
          setTouchEnd(e.targetTouches[0].clientX)
        }
        onTouchEnd={handleTouchEnd}
      >
        {/* CLOSE */}
        <button className="fs-close" onClick={onClose}>
          ✕
        </button>

        {/* MEDIA */}
        {isVideo ? (
          <video
            key={current}
            src={current}
            className="fs-media"
            controls
            autoPlay
            muted
          />
        ) : (
          <img
            key={current}
            src={current}
            className="fs-media"
            alt="Departamento"
          />
        )}

        {/* COUNTER */}
        <div className="fs-counter">
          {index + 1} / {images.length}
        </div>

        {/* DESKTOP ARROWS */}
        {images.length > 1 && (
          <>
            <button
              className="fs-arrow left"
              onClick={onPrev}
            >
              ‹
            </button>

            <button
              className="fs-arrow right"
              onClick={onNext}
            >
              ›
            </button>
          </>
        )}
      </div>
    </div>
  );
}
