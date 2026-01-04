import "./AppLoader.css";
import { useEffect, useState } from "react";
import "./AppLoader.css";

interface Props {
  visible: boolean;
}

export default function AppLoader({ visible }: Props) {
  const [show, setShow] = useState(visible);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    if (!visible) {
      // inicia fade out
      setFadeOut(true);

      // espera animación antes de desmontar
      const t = setTimeout(() => setShow(false), 600);
      return () => clearTimeout(t);
    } else {
      setShow(true);
      setFadeOut(false);
    }
  }, [visible]);

  if (!show) return null;

  return (

    <div className={`app-loader-container ${fadeOut ? "fade-out" : ""}`}>
      <div className="habitna-logo">
        <span className="habitna-text">HABITANA</span>
        <span className="habitna-line" />
      </div>

    </div>
  );
}
