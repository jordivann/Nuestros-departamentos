import "./styles/Nosotras.css";

export default function Nosotras() {
  return (
    <main className="nosotras-page">
      {/* HERO */}
      <section className="nosotras-hero">
        <h1 className="nosotras-title">Nosotras</h1>
        <p className="nosotras-subtitle">
          Alquileres temporarios pensados desde lo humano
        </p>
      </section>

      {/* CONTENT */}
      <section className="nosotras-content">
        <p>
          <strong>Habitana</strong> es un proyecto de alquileres temporarios
          nacido como un negocio familiar, gestionado día a día por
          <strong> Cecilia y Lourdes</strong>.
        </p>

        <p>
          Nos dedicamos a administrar departamentos en la ciudad de
          <strong> Córdoba capital</strong>, con una idea clara:
          que cada persona que se aloje se sienta cómoda, acompañada
          y tranquila desde el primer momento.
        </p>

        <p>
          Creemos que viajar no es solo llegar a un lugar, sino habitarlo.
          Por eso cuidamos cada detalle, estamos disponibles ante cualquier
          necesidad y buscamos que no falte nada durante la estadía.
        </p>

        <p>
          Nos gusta pensar que quienes nos eligen no solo vienen a pasar
          unos días, sino que se llevan una experiencia agradable
          y las ganas de volver a visitar esta hermosa ciudad.
        </p>
      </section>

      {/* VALUES */}
      <section className="nosotras-values">
        <div className="value-item">
          <h3>Cercanía</h3>
          <p>Trato directo, humano y atento.</p>
        </div>

        <div className="value-item">
          <h3>Cuidado</h3>
          <p>Espacios pensados y mantenidos con dedicación.</p>
        </div>

        <div className="value-item">
          <h3>Confianza</h3>
          <p>Comunicación clara antes, durante y después de la estadía.</p>
        </div>

        <div className="value-item">
          <h3>Hospitalidad</h3>
          <p>Queremos que te sientas como en casa.</p>
        </div>
      </section>

      {/* CLOSING */}
      <section className="nosotras-closing">
        <p>
          Habitana es eso: espacios pensados para habitar en calma,
          gestionados por personas reales que disfrutan recibirte.
        </p>
      </section>
    </main>
  );
}
