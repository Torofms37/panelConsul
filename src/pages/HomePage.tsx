import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
// import axios from "axios";
import "../styles/homeStyles.css";

const sections = [
  {
    id: "home",
    icon: "🏠",
    title: "Inicio",
    content: (
      <>
        <p>
          Esta es tu página de inicio. Aquí puedes ver un resumen de toda tu
          actividad y acceder rápidamente a las funciones más importantes.
        </p>
        <br />
        <p>
          El diseño utiliza efectos de glassmorphism con un hermoso modo oscuro
          que combina azul, naranja y amarillo para crear una experiencia visual
          única.
        </p>
      </>
    ),
  },
  {
    id: "dashboard",
    icon: "📊",
    title: "Dashboard",
    content: (
      <>
        <p>
          Aquí encontrarás todas tus métricas y estadísticas importantes.
          Gráficos interactivos, KPIs y datos en tiempo real para mantener el
          control de tu negocio.
        </p>
        <br />
        <p>
          Los datos se actualizan automáticamente y puedes personalizar qué
          información quieres ver en tu dashboard principal.
        </p>
      </>
    ),
  },
  {
    id: "projects",
    icon: "📁",
    title: "Proyectos",
    content: (
      <>
        <p>
          Gestiona todos tus proyectos desde un solo lugar. Crea nuevos
          proyectos, asigna tareas, establece fechas límite y colabora con tu
          equipo.
        </p>
        <br />
        <p>
          Organiza tus proyectos por categorías, prioridades y estados para
          mantener todo bajo control y maximizar tu productividad.
        </p>
      </>
    ),
  },
  {
    id: "analytics",
    icon: "📈",
    title: "Analíticas",
    content: (
      <>
        <p>
          Analiza el rendimiento de tus proyectos y campañas con herramientas
          avanzadas de análisis. Obtén insights valiosos para tomar mejores
          decisiones.
        </p>
        <br />
        <p>
          Visualiza tendencias, compara períodos y genera reportes
          personalizados para compartir con tu equipo o clientes.
        </p>
      </>
    ),
  },
  {
    id: "messages",
    icon: "💬",
    title: "Mensajes",
    content: (
      <>
        <p>
          Centro de comunicación integrado donde puedes gestionar todas tus
          conversaciones. Chat en tiempo real, notificaciones y historial
          completo.
        </p>
        <br />
        <p>
          Mantente conectado con tu equipo y clientes sin salir de la
          plataforma. Comparte archivos, enlaces y colabora de manera eficiente.
        </p>
      </>
    ),
  },
  {
    id: "settings",
    icon: "⚙️",
    title: "Configuración",
    content: (
      <>
        <p>
          Personaliza tu experiencia ajustando las preferencias de la
          aplicación. Configura notificaciones, temas, idioma y opciones de
          privacidad.
        </p>
        <br />
        <p>
          Gestiona tu cuenta, cambia contraseñas, configura la autenticación de
          dos factores y controla quién puede acceder a tu información.
        </p>
      </>
    ),
  },
  {
    id: "profile",
    icon: "👤",
    title: "Perfil",
    content: (
      <>
        <p>
          Administra tu información personal y profesional. Actualiza tu foto de
          perfil, información de contacto y preferencias de comunicación.
        </p>
        <br />
        <p>
          Conecta tus redes sociales, añade tu biografía y personaliza cómo
          otros usuarios pueden verte e interactuar contigo en la plataforma.
        </p>
      </>
    ),
  },
];

const HomePage: React.FC = () => {
  const [activeSection, setActiveSection] = useState("home");
  const [showWelcome, setShowWelcome] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const mainContentRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Efecto para el parallax del fondo
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const elements = document.querySelectorAll<HTMLElement>(".bg-element");
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;

      elements.forEach((element, index) => {
        const speed = (index + 1) * 0.3;
        const xPos = (x - 0.5) * speed * 30;
        const yPos = (y - 0.5) * speed * 30;
        element.style.transform = `translate(${xPos}px, ${yPos}px)`;
      });
    };

    document.addEventListener("mousemove", handleMouseMove);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  // Función para el efecto de "ripple"
  const createRipple = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    element: HTMLElement
  ) => {
    const ripple = document.createElement("span");
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    ripple.classList.add("ripple");
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;

    element.appendChild(ripple);

    setTimeout(() => {
      ripple.remove();
    }, 600);
  };

  // Función para crear partículas
  const createParticles = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    for (let i = 0; i < 8; i++) {
      const particle = document.createElement("div");
      particle.classList.add("particle");

      const x = event.clientX + (Math.random() - 0.5) * 100;
      const y = event.clientY + (Math.random() - 0.5) * 100;

      particle.style.left = `${x}px`;
      particle.style.top = `${y}px`;

      document.body.appendChild(particle);

      const animation = particle.animate(
        [
          { transform: "translate(0, 0) scale(1)", opacity: 1 },
          {
            transform: `translate(${(Math.random() - 0.5) * 200}px, ${
              (Math.random() - 0.5) * 200
            }px) scale(0)`,
            opacity: 0,
          },
        ],
        {
          duration: 1000,
          easing: "cubic-bezier(0.4, 0, 0.2, 1)",
        }
      );

      animation.onfinish = () => particle.remove();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
    console.log("Usuario ha cerrado sesión");
  };

  const handleButtonClick = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    sectionId: string
  ) => {
    createRipple(e, e.currentTarget as HTMLElement);

    if (sectionId === "logout") {
      setShowLogoutModal(true);
      createParticles(e);
      return;
    }
    
    if (showWelcome) {
      setShowWelcome(false);
    }
    
    setTimeout(() => {
      setActiveSection(sectionId);
    }, 300);

    createParticles(e);
  };
  
  return (
    <>
      {/* Animated background elements */}
      <div className="bg-element"></div>
      <div className="bg-element"></div>
      <div className="bg-element"></div>

      {/* Sidebar */}
      <div className="sidebar">
        {sections.map((section) => (
          <div
            key={section.id}
            className={`sidebar-button ${
              activeSection === section.id ? "active" : ""
            }`}
            data-section={section.id}
            onClick={(e) => handleButtonClick(e, section.id)}
          >
            <i>{section.icon}</i>
          </div>
        ))}
        <div
          className="sidebar-button"
          data-section="logout"
          onClick={(e) => handleButtonClick(e, "logout")}
        >
          <i>🚪</i>
        </div>
      </div>
      
      {/* Modal de logout */}
      {showLogoutModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>¿Desea cerrar sesión?</h3>
            <div className="flex justify-center mt-[1rem] gap-10">
              <button
                className="modal-btn modal-btn-confirm"
                onClick={() => {
                  handleLogout();
                  setShowLogoutModal(false);
                }}
              >
                Sí
              </button>
              <button
                className="modal-btn modal-btn-cancel"
                onClick={() => setShowLogoutModal(false)}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Nuevo modal de inicio de sesión */}
      {showLoginModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>¿Desea iniciar sesión?</h3>
            <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
              <button
                className="modal-btn modal-btn-confirm"
                onClick={() => {
                  console.log("Iniciar sesión...");
                  setShowLoginModal(false);
                }}
              >
                Aceptar
              </button>
              <button
                className="modal-btn modal-btn-cancel"
                onClick={() => setShowLoginModal(false)}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="main-content" ref={mainContentRef}>
        {showWelcome && (
          <div className="welcome-section">
            <h1 className="welcome-title">¡Bienvenido de vuelta!</h1>
            <p className="welcome-subtitle">
              Explora tu dashboard con estilo glassmorphism. Haz clic en los
              botones de la barra lateral para navegar entre secciones.
            </p>
          </div>
        )}

        <div className="content-container" style={{ position: "relative" }}>
          {sections.map((section) => (
            <div
              key={section.id}
              className={`content-section ${
                activeSection === section.id ? "active" : ""
              }`}
              id={section.id}
            >
              <h2 className="section-title">
                <span>{section.icon}</span>
                {section.title}
              </h2>
              <div className="section-content">{section.content}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default HomePage;