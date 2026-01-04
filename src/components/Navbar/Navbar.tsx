import { NavLink } from "react-router-dom";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import "./Navbar.css";
import WhatsappButton from "../ContactButton/WhatsappButton";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="navbar">
        <nav className="navbar-inner">

          {/* MOBILE LEFT */}
          <button
            className="nav-mobile-btn"
            onClick={() => setOpen(true)}
            aria-label="Abrir menú"
          >
            <Menu size={22} />
          </button>

          {/* BRAND */}
          <div className="nav-center">
            <NavLink to="/" className="brand">
              HABITANA
            </NavLink>
          </div>

          {/* MOBILE RIGHT */}
          <div className="nav-cta mobile-only">
            <WhatsappButton
              />
          </div>

          {/* DESKTOP */}
          <div className="nav-left desktop-only">
            <NavLink to="/" className="nav-link">
              Departamentos
            </NavLink>
            <NavLink to="/nosotros" className="nav-link">
              Nosotros
            </NavLink>
          </div>

          <div className="nav-right desktop-only">
            <div className="nav-cta desktop-only">
              <WhatsappButton
                />
            </div>
          </div>

        </nav>
      </header>

      {/* MOBILE MENU */}
      {open && (
        <div className="mobile-menu-overlay" onClick={() => setOpen(false)}>
          <div
            className="mobile-menu"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="mobile-close"
              onClick={() => setOpen(false)}
            >
              <X size={22} />
            </button>

            <NavLink
              to="/"
              className="mobile-link"
              onClick={() => setOpen(false)}
            >
              Departamentos
            </NavLink>

            <NavLink
              to="/nosotras"
              className="mobile-link"
              onClick={() => setOpen(false)}
            >
              Nosotras
            </NavLink>

          <div className="mobile-link primary">
            <WhatsappButton
              />
          </div>
            
          </div>
        </div>
      )}
    </>
  );
}
