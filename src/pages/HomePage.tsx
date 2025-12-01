import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import "../styles/homeStyles.css";
import { Novedades } from "./components/Novedades";
import { Calendario } from "./components/Calendario";
import { Contaduria } from "./components/Contaduria";
import { Cursos } from "./components/Cursos";
import { useAuth } from "../hooks/useAuth";

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState(() => {
    // Recuperar la sección activa guardada en localStorage, o usar "novedades" por defecto
    return localStorage.getItem("activeSection") || "novedades";
  });
  const [showModal, setShowModal] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const { user } = useAuth();

  const confirmLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("activeSection"); // Limpiar también la sección activa
    navigate("/");
    console.log("Usuario ha cerrado sesión");
  };

  const handleNavClick = (section: string) => {
    if (section === activeSection) return; // No hacer nada si ya estamos en esa sección

    // Iniciar transición de salida
    setIsTransitioning(true);

    // Después de la animación de salida, cambiar la sección
    setTimeout(() => {
      setActiveSection(section);
      localStorage.setItem("activeSection", section);
      setIsTransitioning(false);
    }, 300); // Duración de la animación de salida
  };

  const showLogoutModal = () => {
    setShowModal(true);
    console.log("Mostrando modal de cierre de sesión");
  };

  const hideLogoutModal = () => {
    setShowModal(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        hideLogoutModal();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <>
      <div className="sidebar">
        <div className="sidebar-header">
          <h1 className="sidebar-title">{user.name || "Cargando..."}</h1>
        </div>

        <nav className="sidebar-nav">
          <button
            className={`nav-button ${
              activeSection === "novedades" ? "active" : ""
            }`}
            onClick={() => handleNavClick("novedades")}
          >
            <span className="nav-icon">📰</span>
            Novedades
          </button>

          <button
            className={`nav-button ${
              activeSection === "calendario" ? "active" : ""
            }`}
            onClick={() => handleNavClick("calendario")}
          >
            <span className="nav-icon">📅</span>
            Calendario y Registro
          </button>

          <button
            className={`nav-button ${
              activeSection === "contaduria" ? "active" : ""
            }`}
            onClick={() => handleNavClick("contaduria")}
          >
            <span className="nav-icon">💰</span>
            Contaduría
          </button>

          <button
            className={`nav-button ${
              activeSection === "cursos" ? "active" : ""
            }`}
            onClick={() => handleNavClick("cursos")}
          >
            <span className="nav-icon">📊</span>
            Cursos
          </button>
        </nav>
        {/* El botón de cerrar sesión se mueve aquí, en un footer de la barra lateral */}
        <div className="sidebar-footer">
          <button className="logout-btn" onClick={showLogoutModal}>
            Cerrar Sesión
          </button>
        </div>
      </div>

      <div className="main-content">
        <div
          className={`page-transition ${
            isTransitioning ? "fade-out" : "fade-in"
          }`}
          key={activeSection}
        >
          {activeSection === "novedades" && <Novedades />}
          {activeSection === "calendario" && <Calendario />}
          {activeSection === "contaduria" && <Contaduria />}
          {activeSection === "cursos" && (
            <Cursos onNavigateToCalendar={() => handleNavClick("calendario")} />
          )}
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-icon">⚠️</div>
            <h3 className="modal-title">Confirmar Cierre de Sesión</h3>
            <p className="modal-text">
              ¿Estás seguro de que deseas cerrar sesión? Perderás cualquier
              trabajo no guardado.
            </p>
            <div className="modal-buttons">
              <button
                className="modal-btn modal-btn-cancel"
                onClick={hideLogoutModal}
              >
                Cancelar
              </button>
              <button
                className="modal-btn modal-btn-confirm"
                onClick={confirmLogout}
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HomePage;
