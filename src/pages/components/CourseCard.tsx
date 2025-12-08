import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/landing.css";

// Componente interno para tarjetas (Reutilizable)
export const CourseCard = ({ title, description, duration, slides }: any) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <div className="glass rounded-2xl p-6 card-hover">
      <div className="carousel-container mb-6">
        {slides.map((slide: any, index: number) => (
          <div
            key={index}
            className={`carousel-slide ${
              index === currentSlide ? "active" : ""
            }`}
          >
            {slide}
          </div>
        ))}
      </div>
      <h3 className="text-2xl font-bold mb-3 text-white">{title}</h3>
      <p className="text-gray-300 mb-6 leading-relaxed flex-grow">
        {description}
      </p>
      <div className="flex items-center justify-between mt-auto">
        <span className="text-sm text-purple-300 font-semibold bg-purple-900/30 px-3 py-1 rounded-full border border-purple-500/30">
          ⏱️ {duration}
        </span>
        <button className="text-purple-400 hover:text-white transition-colors font-medium flex items-center gap-1 group">
          Ver más{" "}
          <span className="group-hover:translate-x-1 transition-transform">
            →
          </span>
        </button>
      </div>
    </div>
  );
};

export const LandingPage = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    document.body.classList.add("landing-page-body");

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      document.body.classList.remove("landing-page-body");
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    // w-full y min-h-screen aseguran el contenedor base correcto
    <div className="w-full min-h-screen smooth-scroll flex flex-col relative">
      {/* NAVBAR */}
      <nav
        id="navbar"
        className={`glass w-full ${isScrolled ? "nav-scrolled" : ""}`}
      >
        <div className="max-w-7xl w-full mx-auto px-6 h-full">
          <div className="flex items-center justify-between h-full">
            <h1 className="text-2xl md:text-3xl font-bold gradient-text cursor-pointer tracking-tight">
              Academia de Excelencia
            </h1>

            {/* Menú Desktop */}
            <div className="hidden lg:flex items-center gap-8">
              {["Inicio", "Cursos", "Fundadores", "Maestros", "Contacto"].map(
                (item) => (
                  <a
                    key={item}
                    href={`#${item.toLowerCase()}`}
                    className="text-gray-300 hover:text-white transition-colors text-sm font-medium uppercase tracking-wide"
                  >
                    {item}
                  </a>
                )
              )}
              {/* Botón Login: px-5 py-2 para replicar original */}
              <button
                onClick={() => navigate("/login")}
                className="btn-primary px-6 py-2.5 rounded-full text-white font-medium shadow-md hover:shadow-lg transform transition-all"
              >
                Acceso Profesores
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section
        id="inicio"
        className="w-full h-screen min-h-[600px] flex items-center justify-center relative overflow-hidden"
      >
        {/* Fondo (SVG + Overlay) */}
        <div className="absolute inset-0 z-0 bg-[#0f0f1e]">
          {/* Aquí va tu SVG de fondo optimizado */}
          <svg
            className="w-full h-full object-cover"
            viewBox="0 0 1920 1080"
            preserveAspectRatio="xMidYMid slice"
          >
            <defs>
              <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#667eea" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#764ba2" stopOpacity="0.3" />
              </linearGradient>
              <filter id="blur">
                <feGaussianBlur in="SourceGraphic" stdDeviation="30" />
              </filter>
            </defs>
            <rect width="100%" height="100%" fill="#0a0a0a" />
            <circle
              cx="50%"
              cy="50%"
              r="300"
              fill="url(#grad1)"
              filter="url(#blur)"
            >
              <animate
                attributeName="r"
                values="300;400;300"
                dur="10s"
                repeatCount="indefinite"
              />
            </circle>
          </svg>
          <div className="absolute inset-0 bg-black/50 z-10"></div>
        </div>

        {/* Contenido Hero */}
        <div className="relative z-20 text-center px-4 max-w-5xl mx-auto mt-16">
          <h2 className="text-5xl md:text-7xl font-bold mb-8 gradient-text leading-tight drop-shadow-lg">
            Transforma tu Futuro <br /> con Nosotros
          </h2>
          <p className="text-xl md:text-2xl text-gray-200 mb-10 max-w-3xl mx-auto drop-shadow-md">
            Educación de calidad para el mundo digital. Únete a la nueva era del
            conocimiento.
          </p>
          {/* Botón Hero: px-8 py-4 y texto más grande */}
          <a
            href="#cursos"
            className="btn-primary inline-flex px-10 py-4 rounded-full text-white text-lg md:text-xl font-bold shadow-xl tracking-wide hover:scale-105 transition-transform"
          >
            ✨ Explorar Cursos ✨
          </a>
        </div>
      </section>

      {/* CURSOS */}
      <section id="cursos" className="py-24 px-6 w-full relative z-10">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-5xl font-bold text-center mb-20 gradient-text">
            Nuestros Cursos
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Ejemplo Tarjeta 1 - REPETIR PATRÓN PARA LAS OTRAS */}
            <CourseCard
              title="💻 Desarrollo Web"
              description="Domina HTML, CSS, JS y React. Construye el futuro de la web."
              duration="12 Semanas"
              slides={[
                <svg viewBox="0 0 400 300" className="w-full h-full">
                  <rect width="400" height="300" fill="transparent" />
                  <text
                    x="50%"
                    y="50%"
                    textAnchor="middle"
                    fill="#fff"
                    fontSize="60"
                  >
                    💻
                  </text>
                </svg>,
                <svg viewBox="0 0 400 300" className="w-full h-full">
                  <rect width="400" height="300" fill="transparent" />
                  <text
                    x="50%"
                    y="50%"
                    textAnchor="middle"
                    fill="#fff"
                    fontSize="40"
                  >
                    CODE
                  </text>
                </svg>,
              ]}
            />
            <CourseCard
              title="📊 Data Science"
              description="Analiza datos, crea modelos predictivos y domina Python."
              duration="16 Semanas"
              slides={[
                <svg viewBox="0 0 400 300" className="w-full h-full">
                  <text
                    x="50%"
                    y="50%"
                    textAnchor="middle"
                    fill="#fff"
                    fontSize="60"
                  >
                    📊
                  </text>
                </svg>,
              ]}
            />
            <CourseCard
              title="🎨 Diseño UX/UI"
              description="Crea experiencias de usuario inolvidables y diseños atractivos."
              duration="10 Semanas"
              slides={[
                <svg viewBox="0 0 400 300" className="w-full h-full">
                  <text
                    x="50%"
                    y="50%"
                    textAnchor="middle"
                    fill="#fff"
                    fontSize="60"
                  >
                    🎨
                  </text>
                </svg>,
              ]}
            />
          </div>
        </div>
      </section>

      {/* FUNDADORES */}
      <section
        id="fundadores"
        className="py-24 px-6 w-full bg-gradient-to-b from-blue-900/10 to-transparent"
      >
        <div className="max-w-7xl mx-auto">
          <h2 className="text-5xl font-bold text-center mb-16 gradient-text">
            Fundadores
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="glass rounded-2xl p-10 text-center card-hover">
              <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-5xl shadow-xl">
                👨‍💼
              </div>
              <h3 className="text-2xl font-bold text-white">
                Dr. Carlos Martínez
              </h3>
              <p className="text-purple-400 font-semibold mt-2">
                CEO & Co-Founder
              </p>
            </div>
            <div className="glass rounded-2xl p-10 text-center card-hover">
              <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-5xl shadow-xl">
                👩‍💼
              </div>
              <h3 className="text-2xl font-bold text-white">
                Dra. Ana Rodríguez
              </h3>
              <p className="text-purple-400 font-semibold mt-2">
                CTO & Co-Founder
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACTO */}
      <section id="contacto" className="py-24 px-6 w-full">
        <div className="max-w-4xl mx-auto glass rounded-3xl p-8 md:p-12 shadow-2xl border border-purple-500/20">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 gradient-text">
            ¡Hablemos!
          </h2>
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input
                type="text"
                placeholder="Nombre"
                className="w-full px-4 py-4 bg-black/40 border border-gray-700 rounded-xl focus:border-purple-500 focus:outline-none text-white transition-colors"
              />
              <input
                type="email"
                placeholder="Email"
                className="w-full px-4 py-4 bg-black/40 border border-gray-700 rounded-xl focus:border-purple-500 focus:outline-none text-white transition-colors"
              />
            </div>
            <textarea
              rows={4}
              placeholder="Tu mensaje..."
              className="w-full px-4 py-4 bg-black/40 border border-gray-700 rounded-xl focus:border-purple-500 focus:outline-none text-white transition-colors resize-none"
            ></textarea>
            <button className="btn-primary w-full py-4 rounded-xl text-white font-bold text-lg shadow-lg">
              🚀 Enviar Mensaje
            </button>
          </form>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="w-full bg-black/80 py-12 text-center border-t border-gray-800">
        <p className="text-gray-500">
          © 2024 Academia de Excelencia. Hecho con ❤️ y React.
        </p>
      </footer>
    </div>
  );
};
