import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import "../styles/homeStyles.css";
import { Novedades } from "./components/Novedades";
import { Calendario } from "./components/Calendario";
import { Contaduria } from "./components/Contaduria";
import { Cursos } from "./components/Cursos";
import { Perfil } from "./components/Perfil";
import { Personal } from "./components/Personal";
import { Asistencia } from "./components/Asistencia";
import { useAuth } from "../hooks/useAuth";

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState(() => {
    // Recuperar la sección activa guardada en localStorage, o usar "novedades" por defecto
    return localStorage.getItem("activeSection") || "novedades";
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    return localStorage.getItem("isSidebarOpen") !== "false";
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

  const toggleSidebar = () => {
    const newState = !isSidebarOpen;
    setIsSidebarOpen(newState);
    localStorage.setItem("isSidebarOpen", String(newState));
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
  const [notificationCount, setNotificationCount] = useState(0);
  const [isBanned, setIsBanned] = useState(false);
  const [bannedCountdown, setBannedCountdown] = useState(60);

  // Chat State
  const [showChatModal, setShowChatModal] = useState(false);
  const [messageTitle, setMessageTitle] = useState("");
  const [messageText, setMessageText] = useState("");
  const [selectedRecipient, setSelectedRecipient] = useState("all_teachers");
  const [usersList, setUsersList] = useState<any[]>([]);
  const [sendingMessage, setSendingMessage] = useState(false);

  // Fetch users for chat
  useEffect(() => {
    if (showChatModal && user.role === "admin") {
      const fetchUsers = async () => {
        try {
          const token = localStorage.getItem("token");
          const response = await axios.get("http://localhost:5000/api/users", {
            headers: { Authorization: `Bearer ${token}` },
          });
          // Filter out self
          setUsersList(response.data.filter((u: any) => u._id !== user.id));
        } catch (error) {
          console.error("Error fetching users for chat:", error);
        }
      };
      fetchUsers();
    }
  }, [showChatModal, user.role, user.id]);

  const handleSendMessage = async () => {
    if (!messageTitle || !messageText) return;
    setSendingMessage(true);
    try {
      const token = localStorage.getItem("token");
      const payload: any = {
        title: messageTitle,
        message: messageText,
      };

      if (selectedRecipient === "all_teachers") {
        payload.roleTarget = "teacher";
      } else if (selectedRecipient === "all_admins") {
        payload.roleTarget = "admin";
      } else {
        payload.recipient = selectedRecipient;
      }

      await axios.post("http://localhost:5000/api/notifications", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Mensaje enviado correctamente.");
      setShowChatModal(false);
      setMessageTitle("");
      setMessageText("");
      setSelectedRecipient("all_teachers");
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Error al enviar el mensaje.");
    } finally {
      setSendingMessage(false);
    }
  };

  // Polling for notifications and user status
  useEffect(() => {
    const checkStatus = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        // Check user status
        try {
          await axios.get("http://localhost:5000/api/users/me", {
            headers: { Authorization: `Bearer ${token}` },
          });
        } catch (err) {
          if (axios.isAxiosError(err) && err.response?.status === 404) {
            setIsBanned(true);
            localStorage.removeItem("token");
          }
        }

        // Fetch notifications count
        const notifResponse = await axios.get(
          "http://localhost:5000/api/notifications",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setNotificationCount(notifResponse.data.length);
      } catch (error) {
        console.error("Error polling status:", error);
      }
    };

    const interval = setInterval(checkStatus, 5000); // Poll every 5 seconds
    checkStatus(); // Initial check

    return () => clearInterval(interval);
  }, []);

  // Banned Countdown Effect
  useEffect(() => {
    if (isBanned && bannedCountdown > 0) {
      const timer = setInterval(() => {
        setBannedCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (isBanned && bannedCountdown === 0) {
      window.location.href = "https://www.google.com";
    }
  }, [isBanned, bannedCountdown]);

  if (isBanned) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-red-900/95 backdrop-blur-md">
        <div className="relative w-full max-w-2xl p-8 bg-gradient-to-b from-red-600 to-red-800 rounded-3xl shadow-2xl border-4 border-yellow-400 text-center animate-bounce-in">
          <button
            onClick={() => (window.location.href = "https://www.google.com")}
            className="absolute top-4 right-4 text-white/80 hover:text-white text-2xl font-bold"
          >
            ✕
          </button>
          <div className="text-8xl mb-6">⚠️</div>
          <h1 className="text-4xl font-black text-yellow-300 mb-6 uppercase tracking-wider drop-shadow-md">
            Cuenta Eliminada
          </h1>
          <p className="text-xl text-white font-bold mb-8 leading-relaxed">
            Se le ha eliminado la cuenta, debido a que no pertenece al plantel
            educativo o bien, no ha sido invitado. En caso de haber
            inconvenientes ponerse en contacto con el profesor Josué
            directamente.
          </p>
          <div className="inline-block px-6 py-3 bg-black/30 rounded-xl border border-white/20">
            <p className="text-yellow-200 font-mono text-lg">
              Redireccionando en:{" "}
              <span className="font-bold text-white">{bannedCountdown}s</span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={`sidebar ${!isSidebarOpen ? "closed" : ""}`}>
        <div className="sidebar-header">
          <h1 className="sidebar-title">{user.name || "Cargando..."}</h1>
          <button
            className="sidebar-toggle-btn"
            onClick={toggleSidebar}
            title="Ocultar menú"
          >
            ☰
          </button>
        </div>

        <nav className="sidebar-nav">
          <button
            className={`nav-button ${
              activeSection === "perfil" ? "active" : ""
            }`}
            onClick={() => handleNavClick("perfil")}
          >
            <span className="nav-icon">👤</span>
            Perfil
          </button>

          <button
            className={`nav-button ${
              activeSection === "personal" ? "active" : ""
            }`}
            onClick={() => handleNavClick("personal")}
          >
            <span className="nav-icon">👥</span>
            Personal
          </button>

          <button
            className={`nav-button ${
              activeSection === "novedades" ? "active" : ""
            }`}
            onClick={() => handleNavClick("novedades")}
          >
            <div className="relative">
              <span className="nav-icon">🔔</span>
              {notificationCount > 0 ? (
                <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-[10px] font-bold text-white bg-red-500 rounded-full shadow-lg shadow-red-500/50 border border-white/20">
                  {notificationCount}
                </span>
              ) : (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border border-white/20 shadow-lg shadow-emerald-500/50"></span>
              )}
            </div>
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
              activeSection === "asistencia" ? "active" : ""
            }`}
            onClick={() => handleNavClick("asistencia")}
          >
            <span className="nav-icon">📝</span>
            Asistencia
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

      {!isSidebarOpen && (
        <button
          className="sidebar-open-btn"
          onClick={toggleSidebar}
          title="Mostrar menú"
        >
          ☰
        </button>
      )}

      <div className={`main-content ${!isSidebarOpen ? "expanded" : ""}`}>
        <div
          className={`page-transition ${
            isTransitioning ? "fade-out" : "fade-in"
          }`}
          key={activeSection}
        >
          {activeSection === "perfil" && <Perfil />}
          {activeSection === "personal" && <Personal />}
          {activeSection === "novedades" && <Novedades />}
          {activeSection === "calendario" && <Calendario />}
          {activeSection === "asistencia" && <Asistencia />}
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

      {/* Admin Chat Button */}
      {user.role === "admin" && (
        <button
          onClick={() => setShowChatModal(true)}
          className="fixed bottom-8 right-8 w-16 h-16 bg-blue-600 hover:bg-blue-500 text-white rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 z-50 group"
          title="Enviar Mensaje"
        >
          <span className="text-3xl group-hover:animate-bounce">💬</span>
        </button>
      )}

      {/* Admin Chat Modal */}
      {showChatModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="p-6 border-b border-slate-700 bg-slate-800/50 flex justify-between items-center">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <span>💬</span> Enviar Mensaje
              </h3>
              <button
                onClick={() => setShowChatModal(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4 overflow-y-auto">
              {/* Recipient Selector */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">
                  Destinatario
                </label>
                <select
                  value={selectedRecipient}
                  onChange={(e) => setSelectedRecipient(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                >
                  <option value="all_teachers">Todos los Profesores</option>
                  <option value="all_admins">Todos los Administradores</option>
                  <option disabled>──────────</option>
                  {usersList.map((u) => (
                    <option key={u._id} value={u._id}>
                      {u.name} ({u.role === "admin" ? "Admin" : "Profesor"})
                    </option>
                  ))}
                </select>
              </div>

              {/* Title Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">
                  Asunto
                </label>
                <input
                  type="text"
                  value={messageTitle}
                  onChange={(e) => setMessageTitle(e.target.value)}
                  placeholder="Título del mensaje..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-slate-500"
                />
              </div>

              {/* Message Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">
                  Mensaje
                </label>
                <textarea
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Escribe tu mensaje aquí..."
                  rows={5}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-slate-500 resize-none"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-slate-700 bg-slate-800/50 flex justify-end gap-3">
              <button
                onClick={() => setShowChatModal(false)}
                className="px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={handleSendMessage}
                disabled={sendingMessage || !messageTitle || !messageText}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 disabled:cursor-not-allowed text-white rounded-lg font-bold shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2"
              >
                {sendingMessage ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <span>📤</span> Enviar Mensaje
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HomePage;
