import "../styles/landing.css";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const LandingPage = () => {
  const navigate = useNavigate();
  useEffect(() => {
    document.body.classList.add("landing-page-body");
    return () => {
      document.body.classList.remove("landing-page-body");
    };
  }, []);

  return (
    <div className="smooth-scroll">
      <nav className="glass" id="navbar">
        <div className="w-full">
          <div
            className="relative px-2 h-full flex items-center align-center justify-between"
            style={{ padding: "0 2rem" }}
          >
            <h1
              className="text-2xl font-bold gradient-text"
              id="nav-institution-name"
            >
              Academia de Excelencia
            </h1>
            <div className="flex items-center gap-8">
              <a
                href="#inicio"
                className="text-gray-300 hover:text-white transition-colors"
              >
                Inicio
              </a>
              <a
                href="#cursos"
                className="text-gray-300 hover:text-white transition-colors"
              >
                Cursos
              </a>
              <a
                href="#fundadores"
                className="text-gray-300 hover:text-white transition-colors"
              >
                Fundadores
              </a>
              <a
                href="#maestros"
                className="text-gray-300 hover:text-white transition-colors"
              >
                Maestros
              </a>
              <a
                href="#contacto"
                className="text-gray-300 hover:text-white transition-colors"
              >
                Contacto
              </a>
              <button
                onClick={() => navigate("/login")}
                className="btn-primary w-40 h-10 rounded-full text-white font-medium cursor-pointer"
              >
                Acceso Profesores
              </button>
            </div>
          </div>
        </div>
      </nav>
      <section
        id="inicio"
        className="min-h-screen flex items-center justify-center px-6 pt-20 relative overflow-hidden"
        style={{
          background:
            "linear-gradient(to bottom, rgba(88, 28, 135, 0.15), rgba(49, 46, 129, 0.15), rgba(88, 28, 135, 0.15))",
        }}
      >
        <div className="relative flex flex-col items-center gap-6 text-center max-w-4xl z-10">
          <h2 className="text-6xl font-bold gradient-text" id="hero-title">
            Transforma tu Futuro con Nosotros
          </h2>
          <p className="text-2xl text-gray-300 mb-10" id="hero-subtitle">
            Educación de calidad para el mundo digital
          </p>
          <a
            href="#cursos"
            className="btn-primary w-65 h-10 rounded-full text-white font-normal cursor-pointer text-2xl"
          >
            ✨ Explorar Cursos ✨
          </a>
        </div>
      </section>
      <section
        id="cursos"
        className="w-ful h-auto flex items-center justify-center "
      >
        <div className="relative max-w-7xl min-h-[1100px]">
          <h2
            className="relative left-2 text-6xl m-auto font-bold text-center gradient-text"
            style={{ marginBottom: "2rem", marginTop: "2rem" }}
          >
            Nuestros Cursos
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="glass rounded-2xl p-6 card-hover">
              <div className="carousel-container" id="carousel-1">
                <div className="carousel-slide active">
                  <svg viewBox="0 0 400 300" className="w-full h-full">
                    <rect width="400" height="300" fill="#1a1a2e" />
                    <circle
                      cx="200"
                      cy="150"
                      r="60"
                      fill="#667eea"
                      opacity="0.3"
                    />
                    <text
                      x="200"
                      y="160"
                      textAnchor="middle"
                      fill="#e5e5e5"
                      fontSize="24"
                      fontWeight="bold"
                    >
                      💻
                    </text>
                  </svg>
                </div>
                <div className="carousel-slide">
                  <svg viewBox="0 0 400 300" className="w-full h-full">
                    <rect width="400" height="300" fill="#16213e" />
                    <rect
                      x="100"
                      y="100"
                      width="200"
                      height="100"
                      fill="#667eea"
                      opacity="0.4"
                      rx="10"
                    />
                    <text
                      x="200"
                      y="160"
                      textAnchor="middle"
                      fill="#e5e5e5"
                      fontSize="20"
                      fontWeight="bold"
                    >
                      Código
                    </text>
                  </svg>
                </div>
                <div className="carousel-slide">
                  <svg viewBox="0 0 400 300" className="w-full h-full">
                    <rect width="400" height="300" fill="#0f3460" />
                    <polygon
                      points="200,80 250,180 150,180"
                      fill="#764ba2"
                      opacity="0.4"
                    />
                    <text
                      x="200"
                      y="220"
                      textAnchor="middle"
                      fill="#e5e5e5"
                      fontSize="18"
                    >
                      Desarrollo
                    </text>
                  </svg>
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-white">
                💻 Desarrollo Web Full Stack
              </h3>
              <p className="text-gray-300 mb-4 leading-relaxed">
                ¡Crea sitios web increíbles! Aprende HTML, CSS, JavaScript y
                mucho más. Construye proyectos reales y conviértete en un
                desarrollador profesional.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-purple-300 font-semibold">
                  ⏱️ 12 semanas
                </span>
                <button className="text-purple-400 hover:text-purple-300 transition-colors font-medium">
                  Ver más →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section id="maestros" className="w-full h-120">
        <div className="max-w-7xl">
          <h2
            className="text-5xl font-bold text-center mb-16 gradient-text"
            style={{ marginBottom: "2rem", marginTop: "2rem" }}
          >
            Nuestro Equipo Docente
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
            <div className="glass-light rounded-xl p-6 text-center card-hover">
              <div className="w-24 h-24 mb-4 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-4xl">
                👨‍🏫
              </div>
              <h3 className="text-xl font-bold mb-1">Prof. Miguel Torres</h3>
              <p className="text-sm text-purple-400 mb-2">Desarrollo Web</p>
              <p className="text-xs text-gray-500">15 años de experiencia</p>
            </div>
          </div>
        </div>
      </section>
      <section
        id="contacto"
        className="flex items-center justify-center w-full h-150"
        style={{
          background:
            "linear-gradient(to bottom, rgba(88, 28, 135, 0.15), rgba(109, 40, 217, 0.15), rgba(88, 28, 135, 0.15))",
        }}
      >
        <div className="w-full md:w-2/3 lg:w-1/2 h-full flex flex-col justify-center">
          <h2
            className="text-5xl font-bold text-center gradient-text"
            style={{ marginBottom: "2rem" }}
          >
            💬 ¡Hablemos!
          </h2>
          <div className="flex flex-col">
            <form id="contact-form" style={{ marginBottom: "2rem" }}>
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium mb-4"
                >
                  Nombre Completo
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="w-full px-4 py-3 bg-black bg-opacity-50 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>
              <div>
                <label htmlFor="email" className="text-sm font-medium mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full px-4 py-3 bg-black bg-opacity-50 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium mb-2"
                >
                  Teléfono
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  className="w-full px-4 py-3 bg-black bg-opacity-50 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium mb-2"
                >
                  Mensaje
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  required
                  className="w-full px-4 py-3 bg-black bg-opacity-50 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 transition-colors resize-none"
                ></textarea>
              </div>
              <button
                type="submit"
                className="btn-primary w-full py-4 rounded-lg text-white font-medium text-lg"
              >
                📧 Enviar Mensaje
              </button>
            </form>
            <div
              className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center"
              style={{ marginTop: "2rem" }}
            >
              <div>
                <div className="text-3xl mb-2">📧</div>
                <p className="text-sm text-gray-400">Email</p>
                <p className="text-white" id="contact-email">
                  contacto@academia.com
                </p>
              </div>
              <div>
                <div className="text-3xl mb-2">📞</div>
                <p className="text-sm text-gray-400">Teléfono</p>
                <p className="text-white" id="contact-phone">
                  +52 555 123 4567
                </p>
              </div>
              <div>
                <div className="text-3xl mb-2">📍</div>
                <p className="text-sm text-gray-400">Dirección</p>
                <p className="text-white" id="contact-address">
                  Av. Principal 123, Ciudad
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <footer className="bg-black bg-opacity-50 py-10 px-6 mt-20">
        <div className="max-w-7xl text-center">
          <p className="text-gray-400 mb-4">
            © 2024
            <span id="footer-institution-name">Academia de Excelencia</span>.
            Todos los derechos reservados.
          </p>
          <div className="flex justify-center gap-6 text-gray-400">
            <a href="#" className="hover:text-white transition-colors">
              Política de Privacidad
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Términos y Condiciones
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Aviso Legal
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};
