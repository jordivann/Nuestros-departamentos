import { useEffect, useState } from "react";
import { DepartmentsService } from "../services/departments.service";
import { type Departamento } from "../types/Departamento";
import DepartmentCard from "../components/DepartmentCard/DepartmentCard";
import "./styles/Home.css";

export default function Home() {
  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);

  useEffect(() => {
    DepartmentsService.getAll().then(setDepartamentos);
  }, []);

  return (
    <div className="home-container">

      {/* HERO */}
      <section className="home-hero">
        <div className="hero-bg" />

        <div className="hero-content">
          <span className="hero-eyebrow">HABITANA</span>

          <h1 className="hero-title">
            Espacios pensados <br /> para habitar en calma.
          </h1>

          <p className="hero-subtitle">
            Departamentos seleccionados para estadías cuidadas,
            cómodas y sin apuros.
          </p>

          <button
            className="hero-scroll"
            onClick={() =>
              document
                .getElementById("departments-grid")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            <span>Deslizá para explorar</span>
            <span className="scroll-arrow">↓</span>
          </button>
        </div>
      </section>


      {/* INTRO */}
      <section className="home-intro">
        <p>
          En <strong>Habitana</strong> creemos que alojarse no es solo dormir.
          Es sentirse cómodo, acompañado y en un espacio que invite a quedarse.
        </p>
      </section>

      {/* GRID */}
     <section className="home-grid" id="departments-grid">
        {departamentos.map((d) => (
          <DepartmentCard key={d.id} departamento={d}  />
        ))}
      </section>

    </div>
  );
}
