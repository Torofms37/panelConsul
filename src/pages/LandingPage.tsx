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
        <div className="w-full flex justify-around mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
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
              </a>{" "}
              <a
                href="#cursos"
                className="text-gray-300 hover:text-white transition-colors"
              >
                Cursos
              </a>{" "}
              <a
                href="#fundadores"
                className="text-gray-300 hover:text-white transition-colors"
              >
                Fundadores
              </a>{" "}
              <a
                href="#maestros"
                className="text-gray-300 hover:text-white transition-colors"
              >
                Maestros
              </a>{" "}
              <a
                href="#contacto"
                className="text-gray-300 hover:text-white transition-colors"
              >
                Contacto
              </a>{" "}
              <button
                onClick={() => navigate("/login")}
                className="btn-primary px-5 py-2 rounded-full text-white font-medium cursor-pointer"
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
        <div className="absolute inset-0 z-0">
          <svg
            className="w-full h-full"
            viewBox="0 0 1920 1080"
            preserveAspectRatio="xMidYMid slice"
          >
            <defs>
              <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <animate
                  attributeName="x1"
                  values="0%;100%;0%"
                  dur="20s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="y1"
                  values="0%;100%;0%"
                  dur="15s"
                  repeatCount="indefinite"
                />
                <stop offset="0%" stopColor="#667eea" stopOpacity="0.3" />
                <stop offset="50%" stopColor="#764ba2" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#667eea" stopOpacity="0.3" />
              </linearGradient>
              <filter id="blur">
                <feGaussianBlur in="SourceGraphic" stdDeviation="30" />
              </filter>
            </defs>{" "}
            <rect width="1920" height="1080" fill="#0a0a0a" />{" "}
            {/* Círculos animados */}{" "}
            <circle
              cx="400"
              cy="300"
              r="200"
              fill="url(#grad1)"
              filter="url(#blur)"
            >
              <animate
                attributeName="cx"
                values="400;600;400"
                dur="15s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="cy"
                values="300;500;300"
                dur="20s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="r"
                values="200;300;200"
                dur="12s"
                repeatCount="indefinite"
              />
            </circle>{" "}
            <circle
              cx="1500"
              cy="700"
              r="250"
              fill="#764ba2"
              opacity="0.2"
              filter="url(#blur)"
            >
              <animate
                attributeName="cx"
                values="1500;1300;1500"
                dur="18s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="cy"
                values="700;400;700"
                dur="16s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="r"
                values="250;350;250"
                dur="14s"
                repeatCount="indefinite"
              />
            </circle>{" "}
            <circle
              cx="960"
              cy="540"
              r="180"
              fill="#667eea"
              opacity="0.15"
              filter="url(#blur)"
            >
              <animate
                attributeName="r"
                values="180;280;180"
                dur="10s"
                repeatCount="indefinite"
              />
            </circle>{" "}
            <g opacity="0.4">
              <circle cx="200" cy="200" r="4" fill="#667eea">
                <animate
                  attributeName="cy"
                  values="200;100;200"
                  dur="8s"
                  repeatCount="indefinite"
                />
              </circle>
              <circle cx="800" cy="150" r="3" fill="#764ba2">
                <animate
                  attributeName="cy"
                  values="150;50;150"
                  dur="10s"
                  repeatCount="indefinite"
                />
              </circle>
              <circle cx="1600" cy="300" r="5" fill="#667eea">
                <animate
                  attributeName="cy"
                  values="300;200;300"
                  dur="12s"
                  repeatCount="indefinite"
                />
              </circle>
              <circle cx="1200" cy="800" r="4" fill="#764ba2">
                <animate
                  attributeName="cy"
                  values="800;900;800"
                  dur="9s"
                  repeatCount="indefinite"
                />
              </circle>
              <circle cx="400" cy="900" r="3" fill="#667eea">
                <animate
                  attributeName="cy"
                  values="900;1000;900"
                  dur="11s"
                  repeatCount="indefinite"
                />
              </circle>
            </g>
            <g opacity="0.05" stroke="#667eea" strokeWidth="1" fill="none">
              <line x1="0" y1="270" x2="1920" y2="270" />
              <line x1="0" y1="540" x2="1920" y2="540" />
              <line x1="0" y1="810" x2="1920" y2="810" />
              <line x1="480" y1="0" x2="480" y2="1080" />
              <line x1="960" y1="0" x2="960" y2="1080" />
              <line x1="1440" y1="0" x2="1440" y2="1080" />
            </g>
          </svg>
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        </div>
        <div className="text-center max-w-4xl relative z-10">
          <h2 className="text-6xl font-bold mb-6 gradient-text" id="hero-title">
            Transforma tu Futuro con Nosotros
          </h2>
          <p className="text-2xl text-gray-300 mb-10" id="hero-subtitle">
            Educación de calidad para el mundo digital
          </p>
          <a
            href="#cursos"
            className="btn-primary inline-block px-8 py-4 rounded-full text-white text-lg font-medium shadow-lg"
          >
            ✨ Explorar Cursos ✨
          </a>
        </div>
      </section>
      <section id="cursos" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-5xl font-bold text-center mb-16 gradient-text">
            Nuestros Cursos
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="glass rounded-2xl p-6 card-hover">
              <div className="carousel-container mb-6" id="carousel-1">
                <div className="carousel-slide active">
                  <svg viewBox="0 0 400 300" className="w-full h-full">
                    <rect width="400" height="300" fill="#1a1a2e" />{" "}
                    <circle
                      cx="200"
                      cy="150"
                      r="60"
                      fill="#667eea"
                      opacity="0.3"
                    />{" "}
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
                    <rect width="400" height="300" fill="#16213e" />{" "}
                    <rect
                      x="100"
                      y="100"
                      width="200"
                      height="100"
                      fill="#667eea"
                      opacity="0.4"
                      rx="10"
                    />{" "}
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
                    <rect width="400" height="300" fill="#0f3460" />{" "}
                    <polygon
                      points="200,80 250,180 150,180"
                      fill="#764ba2"
                      opacity="0.4"
                    />{" "}
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
                </span>{" "}
                <button className="text-purple-400 hover:text-purple-300 transition-colors font-medium">
                  Ver más →
                </button>
              </div>
            </div>
            <div className="glass rounded-2xl p-6 card-hover">
              <div className="carousel-container mb-6" id="carousel-2">
                <div className="carousel-slide active">
                  <svg viewBox="0 0 400 300" className="w-full h-full">
                    <rect width="400" height="300" fill="#1a1a2e" />{" "}
                    <circle
                      cx="200"
                      cy="150"
                      r="60"
                      fill="#667eea"
                      opacity="0.3"
                    />{" "}
                    <text
                      x="200"
                      y="160"
                      textAnchor="middle"
                      fill="#e5e5e5"
                      fontSize="24"
                      fontWeight="bold"
                    >
                      📊
                    </text>
                  </svg>
                </div>
                <div className="carousel-slide">
                  <svg viewBox="0 0 400 300" className="w-full h-full">
                    <rect width="400" height="300" fill="#16213e" />{" "}
                    <rect
                      x="80"
                      y="180"
                      width="40"
                      height="80"
                      fill="#667eea"
                      opacity="0.4"
                    />{" "}
                    <rect
                      x="140"
                      y="140"
                      width="40"
                      height="120"
                      fill="#667eea"
                      opacity="0.5"
                    />{" "}
                    <rect
                      x="200"
                      y="100"
                      width="40"
                      height="160"
                      fill="#667eea"
                      opacity="0.6"
                    />{" "}
                    <rect
                      x="260"
                      y="120"
                      width="40"
                      height="140"
                      fill="#667eea"
                      opacity="0.5"
                    />
                  </svg>
                </div>
                <div className="carousel-slide">
                  <svg viewBox="0 0 400 300" className="w-full h-full">
                    <rect width="400" height="300" fill="#0f3460" />{" "}
                    <circle
                      cx="150"
                      cy="150"
                      r="50"
                      fill="#764ba2"
                      opacity="0.3"
                    />{" "}
                    <circle
                      cx="250"
                      cy="150"
                      r="70"
                      fill="#667eea"
                      opacity="0.4"
                    />{" "}
                    <text
                      x="200"
                      y="240"
                      textAnchor="middle"
                      fill="#e5e5e5"
                      fontSize="16"
                    >
                      Analytics
                    </text>
                  </svg>
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-white">
                📊 Ciencia de Datos e IA
              </h3>
              <p className="text-gray-300 mb-4 leading-relaxed">
                ¡Descubre el mundo de los datos! Aprende Python, análisis de
                información y crea inteligencias artificiales. Proyectos
                divertidos y educativos.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-purple-300 font-semibold">
                  ⏱️ 16 semanas
                </span>{" "}
                <button className="text-purple-400 hover:text-purple-300 transition-colors font-medium">
                  Ver más →
                </button>
              </div>
            </div>
            <div className="glass rounded-2xl p-6 card-hover">
              <div className="carousel-container mb-6" id="carousel-3">
                <div className="carousel-slide active">
                  <svg viewBox="0 0 400 300" className="w-full h-full">
                    <rect width="400" height="300" fill="#1a1a2e" />{" "}
                    <circle
                      cx="200"
                      cy="150"
                      r="60"
                      fill="#667eea"
                      opacity="0.3"
                    />{" "}
                    <text
                      x="200"
                      y="160"
                      textAnchor="middle"
                      fill="#e5e5e5"
                      fontSize="24"
                      fontWeight="bold"
                    >
                      🎨
                    </text>
                  </svg>
                </div>
                <div className="carousel-slide">
                  <svg viewBox="0 0 400 300" className="w-full h-full">
                    <rect width="400" height="300" fill="#16213e" />{" "}
                    <rect
                      x="100"
                      y="80"
                      width="200"
                      height="140"
                      fill="#667eea"
                      opacity="0.3"
                      rx="15"
                    />{" "}
                    <circle
                      cx="150"
                      cy="120"
                      r="20"
                      fill="#764ba2"
                      opacity="0.5"
                    />{" "}
                    <rect
                      x="150"
                      y="160"
                      width="100"
                      height="10"
                      fill="#764ba2"
                      opacity="0.4"
                      rx="5"
                    />
                  </svg>
                </div>
                <div className="carousel-slide">
                  <svg viewBox="0 0 400 300" className="w-full h-full">
                    <rect width="400" height="300" fill="#0f3460" />{" "}
                    <path
                      d="M 150 150 Q 200 100 250 150 T 350 150"
                      stroke="#667eea"
                      strokeWidth="4"
                      fill="none"
                      opacity="0.5"
                    />{" "}
                    <text
                      x="200"
                      y="220"
                      textAnchor="middle"
                      fill="#e5e5e5"
                      fontSize="18"
                    >
                      Diseño
                    </text>
                  </svg>
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-white">
                🎨 Diseño UX/UI Profesional
              </h3>
              <p className="text-gray-300 mb-4 leading-relaxed">
                ¡Dale vida a tus ideas! Diseña aplicaciones hermosas y fáciles
                de usar. Aprende Figma, colores, tipografía y crea diseños
                profesionales.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-purple-300 font-semibold">
                  ⏱️ 10 semanas
                </span>{" "}
                <button className="text-purple-400 hover:text-purple-300 transition-colors font-medium">
                  Ver más →
                </button>
              </div>
            </div>
            <div className="glass rounded-2xl p-6 card-hover">
              <div className="carousel-container mb-6" id="carousel-4">
                <div className="carousel-slide active">
                  <svg viewBox="0 0 400 300" className="w-full h-full">
                    <rect width="400" height="300" fill="#1a1a2e" />{" "}
                    <circle
                      cx="200"
                      cy="150"
                      r="60"
                      fill="#667eea"
                      opacity="0.3"
                    />{" "}
                    <text
                      x="200"
                      y="160"
                      textAnchor="middle"
                      fill="#e5e5e5"
                      fontSize="24"
                      fontWeight="bold"
                    >
                      ������
                    </text>
                  </svg>
                </div>
                <div className="carousel-slide">
                  <svg viewBox="0 0 400 300" className="w-full h-full">
                    <rect width="400" height="300" fill="#16213e" />{" "}
                    <rect
                      x="140"
                      y="60"
                      width="120"
                      height="180"
                      fill="#667eea"
                      opacity="0.3"
                      rx="20"
                    />{" "}
                    <circle
                      cx="200"
                      cy="230"
                      r="15"
                      fill="#764ba2"
                      opacity="0.5"
                    />
                  </svg>
                </div>
                <div className="carousel-slide">
                  <svg viewBox="0 0 400 300" className="w-full h-full">
                    <rect width="400" height="300" fill="#0f3460" />{" "}
                    <rect
                      x="130"
                      y="70"
                      width="140"
                      height="160"
                      fill="none"
                      stroke="#667eea"
                      strokeWidth="3"
                      rx="15"
                    />{" "}
                    <text
                      x="200"
                      y="160"
                      textAnchor="middle"
                      fill="#e5e5e5"
                      fontSize="20"
                    >
                      Apps
                    </text>
                  </svg>
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-white">
                📱 Desarrollo de Apps Móviles
              </h3>
              <p className="text-gray-300 mb-4 leading-relaxed">
                ¡Crea apps para celulares! Diseña y programa aplicaciones para
                iPhone y Android. Publica tus creaciones y compártelas con el
                mundo.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-purple-300 font-semibold">
                  ⏱️ 14 semanas
                </span>{" "}
                <button className="text-purple-400 hover:text-purple-300 transition-colors font-medium">
                  Ver más →
                </button>
              </div>
            </div>
            <div className="glass rounded-2xl p-6 card-hover">
              <div className="carousel-container mb-6" id="carousel-5">
                <div className="carousel-slide active">
                  <svg viewBox="0 0 400 300" className="w-full h-full">
                    <rect width="400" height="300" fill="#1a1a2e" />{" "}
                    <circle
                      cx="200"
                      cy="150"
                      r="60"
                      fill="#667eea"
                      opacity="0.3"
                    />{" "}
                    <text
                      x="200"
                      y="160"
                      textAnchor="middle"
                      fill="#e5e5e5"
                      fontSize="24"
                      fontWeight="bold"
                    >
                      ☁️
                    </text>
                  </svg>
                </div>
                <div className="carousel-slide">
                  <svg viewBox="0 0 400 300" className="w-full h-full">
                    <rect width="400" height="300" fill="#16213e" />{" "}
                    <ellipse
                      cx="200"
                      cy="120"
                      rx="80"
                      ry="40"
                      fill="#667eea"
                      opacity="0.3"
                    />{" "}
                    <ellipse
                      cx="200"
                      cy="180"
                      rx="100"
                      ry="50"
                      fill="#764ba2"
                      opacity="0.2"
                    />
                  </svg>
                </div>
                <div className="carousel-slide">
                  <svg viewBox="0 0 400 300" className="w-full h-full">
                    <rect width="400" height="300" fill="#0f3460" />{" "}
                    <rect
                      x="100"
                      y="120"
                      width="60"
                      height="60"
                      fill="#667eea"
                      opacity="0.4"
                    />{" "}
                    <rect
                      x="170"
                      y="120"
                      width="60"
                      height="60"
                      fill="#764ba2"
                      opacity="0.4"
                    />{" "}
                    <rect
                      x="240"
                      y="120"
                      width="60"
                      height="60"
                      fill="#667eea"
                      opacity="0.4"
                    />
                  </svg>
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-white">
                ☁️ Cloud Computing y DevOps
              </h3>
              <p className="text-gray-300 mb-4 leading-relaxed">
                ¡Trabaja en la nube! Aprende a usar plataformas como AWS y
                Google Cloud. Gestiona servidores y automatiza tareas como un
                profesional.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-purple-300 font-semibold">
                  ⏱️ 12 semanas
                </span>{" "}
                <button className="text-purple-400 hover:text-purple-300 transition-colors font-medium">
                  Ver más →
                </button>
              </div>
            </div>
            <div className="glass rounded-2xl p-6 card-hover">
              <div className="carousel-container mb-6" id="carousel-6">
                <div className="carousel-slide active">
                  <svg viewBox="0 0 400 300" className="w-full h-full">
                    <rect width="400" height="300" fill="#1a1a2e" />{" "}
                    <circle
                      cx="200"
                      cy="150"
                      r="60"
                      fill="#667eea"
                      opacity="0.3"
                    />{" "}
                    <text
                      x="200"
                      y="160"
                      textAnchor="middle"
                      fill="#e5e5e5"
                      fontSize="24"
                      fontWeight="bold"
                    >
                      🔒
                    </text>
                  </svg>
                </div>
                <div className="carousel-slide">
                  <svg viewBox="0 0 400 300" className="w-full h-full">
                    <rect width="400" height="300" fill="#16213e" />{" "}
                    <rect
                      x="150"
                      y="100"
                      width="100"
                      height="80"
                      fill="#667eea"
                      opacity="0.3"
                      rx="10"
                    />{" "}
                    <circle
                      cx="200"
                      cy="180"
                      r="20"
                      fill="#764ba2"
                      opacity="0.5"
                    />{" "}
                    <rect
                      x="185"
                      y="190"
                      width="30"
                      height="40"
                      fill="#764ba2"
                      opacity="0.5"
                    />
                  </svg>
                </div>
                <div className="carousel-slide">
                  <svg viewBox="0 0 400 300" className="w-full h-full">
                    <rect width="400" height="300" fill="#0f3460" />{" "}
                    <path
                      d="M 150 120 L 200 80 L 250 120 L 250 180 L 200 220 L 150 180 Z"
                      fill="#667eea"
                      opacity="0.3"
                    />{" "}
                    <text
                      x="200"
                      y="240"
                      textAnchor="middle"
                      fill="#e5e5e5"
                      fontSize="16"
                    >
                      Security
                    </text>
                  </svg>
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-white">
                🔒 Ciberseguridad Avanzada
              </h3>
              <p className="text-gray-300 mb-4 leading-relaxed">
                ¡Conviértete en un guardián digital! Aprende a proteger
                sistemas, detectar amenazas y mantener la información segura.
                ¡Sé un héroe de la tecnología!
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-purple-300 font-semibold">
                  ⏱️ 14 semanas
                </span>{" "}
                <button className="text-purple-400 hover:text-purple-300 transition-colors font-medium">
                  Ver más →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section
        id="fundadores"
        className="py-20 px-6"
        style={{
          background:
            "linear-gradient(to bottom, rgba(30, 58, 138, 0.15), rgba(67, 56, 202, 0.15), rgba(30, 58, 138, 0.15))",
        }}
      >
        <div className="max-w-7xl mx-auto">
          <h2 className="text-5xl font-bold text-center mb-16 gradient-text">
            Nuestros Fundadores
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="glass rounded-2xl p-8 text-center card-hover">
              <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-5xl">
                👨‍💼
              </div>
              <h3 className="text-2xl font-bold mb-2 text-white">
                Dr. Carlos Martínez
              </h3>
              <p className="text-purple-300 mb-4 font-semibold">
                Co-Fundador &amp; CEO
              </p>
              <p className="text-gray-300 leading-relaxed">
                Doctor en Ciencias de la Computación con 20 años ayudando a
                estudiantes a alcanzar sus sueños. Experto en hacer la
                tecnología divertida y accesible para todos.
              </p>
            </div>
            <div className="glass rounded-2xl p-8 text-center card-hover">
              <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-5xl">
                👩‍💼
              </div>
              <h3 className="text-2xl font-bold mb-2 text-white">
                Dra. Ana Rodríguez
              </h3>
              <p className="text-purple-300 mb-4 font-semibold">
                Co-Fundadora &amp; CTO
              </p>
              <p className="text-gray-300 leading-relaxed">
                Experta en inteligencia artificial con pasión por enseñar. Ha
                trabajado en grandes empresas tecnológicas y ahora dedica su
                tiempo a formar a las nuevas generaciones.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section id="maestros" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-5xl font-bold text-center mb-16 gradient-text">
            Nuestro Equipo Docente
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
            <div className="glass-light rounded-xl p-6 text-center card-hover">
              <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-4xl">
                👨‍🏫
              </div>
              <h3 className="text-xl font-bold mb-1">Prof. Miguel Torres</h3>
              <p className="text-sm text-purple-400 mb-2">Desarrollo Web</p>
              <p className="text-xs text-gray-500">15 años de experiencia</p>
            </div>
            <div className="glass-light rounded-xl p-6 text-center card-hover">
              <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-4xl">
                👩‍🏫
              </div>
              <h3 className="text-xl font-bold mb-1">Prof. Laura Gómez</h3>
              <p className="text-sm text-purple-400 mb-2">Ciencia de Datos</p>
              <p className="text-xs text-gray-500">12 años de experiencia</p>
            </div>
            <div className="glass-light rounded-xl p-6 text-center card-hover">
              <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-4xl">
                👨‍🏫
              </div>
              <h3 className="text-xl font-bold mb-1">Prof. Roberto Sánchez</h3>
              <p className="text-sm text-purple-400 mb-2">Diseño UX/UI</p>
              <p className="text-xs text-gray-500">10 años de experiencia</p>
            </div>
            <div className="glass-light rounded-xl p-6 text-center card-hover">
              <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-4xl">
                👩‍🏫
              </div>
              <h3 className="text-xl font-bold mb-1">Prof. Patricia Reyes</h3>
              <p className="text-sm text-purple-400 mb-2">Apps Móviles</p>
              <p className="text-xs text-gray-500">14 años de experiencia</p>
            </div>
            <div className="glass-light rounded-xl p-6 text-center card-hover">
              <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-4xl">
                👨‍🏫
              </div>
              <h3 className="text-xl font-bold mb-1">Prof. David Hernández</h3>
              <p className="text-sm text-purple-400 mb-2">Cloud &amp; DevOps</p>
              <p className="text-xs text-gray-500">16 años de experiencia</p>
            </div>
            <div className="glass-light rounded-xl p-6 text-center card-hover">
              <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center text-4xl">
                👩‍🏫
              </div>
              <h3 className="text-xl font-bold mb-1">Prof. Elena Vargas</h3>
              <p className="text-sm text-purple-400 mb-2">Ciberseguridad</p>
              <p className="text-xs text-gray-500">13 años de experiencia</p>
            </div>
            <div className="glass-light rounded-xl p-6 text-center card-hover">
              <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center text-4xl">
                👨‍🏫
              </div>
              <h3 className="text-xl font-bold mb-1">Prof. Jorge Medina</h3>
              <p className="text-sm text-purple-400 mb-2">
                Inteligencia Artificial
              </p>
              <p className="text-xs text-gray-500">11 años de experiencia</p>
            </div>
            <div className="glass-light rounded-xl p-6 text-center card-hover">
              <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center text-4xl">
                👩‍🏫
              </div>
              <h3 className="text-xl font-bold mb-1">Prof. Sandra Castro</h3>
              <p className="text-sm text-purple-400 mb-2">Blockchain</p>
              <p className="text-xs text-gray-500">9 años de experiencia</p>
            </div>
          </div>
        </div>
      </section>
      <section
        id="contacto"
        className="py-20 px-6"
        style={{
          background:
            "linear-gradient(to bottom, rgba(88, 28, 135, 0.15), rgba(109, 40, 217, 0.15), rgba(88, 28, 135, 0.15))",
        }}
      >
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl font-bold text-center mb-16 gradient-text">
            💬 ¡Hablemos!
          </h2>
          <div className="glass rounded-2xl p-10">
            <form id="contact-form" className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium mb-2"
                >
                  Nombre Completo
                </label>{" "}
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="w-full px-4 py-3 bg-black bg-opacity-50 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium mb-2"
                >
                  Email
                </label>{" "}
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
                </label>{" "}
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
                </label>{" "}
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
            <div className="mt-10 pt-10 border-t border-gray-800 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
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
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-400 mb-4">
            © 2024{" "}
            <span id="footer-institution-name">Academia de Excelencia</span>.
            Todos los derechos reservados.
          </p>
          <div className="flex justify-center gap-6 text-gray-400">
            <a href="#" className="hover:text-white transition-colors">
              Política de Privacidad
            </a>{" "}
            <a href="#" className="hover:text-white transition-colors">
              Términos y Condiciones
            </a>{" "}
            <a href="#" className="hover:text-white transition-colors">
              Aviso Legal
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};
