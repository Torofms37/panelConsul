import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../hooks/useAuth";

interface Notification {
  _id: string;
  type: string;
  title: string;
  message: string;
  data?: unknown;
  createdAt: string;
}

export const Novedades = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:5000/api/notifications",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setNotifications(response.data);
    } catch (error) {
      console.error("Error fetching notifications", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Poll for new notifications every 5 seconds to keep the list updated in real-time
    const interval = setInterval(fetchNotifications, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleDismiss = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/notifications/${id}/read`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setNotifications((prev) => prev.filter((n) => n._id !== id));
    } catch (error) {
      console.error("Error dismissing notification", error);
    }
  };

  const handleApproveUser = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/notifications/${id}/approve-user`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setNotifications((prev) => prev.filter((n) => n._id !== id));
      alert("Usuario aprobado.");
    } catch (error) {
      console.error(error);
      alert("Error al aprobar usuario.");
    }
  };

  const handleDeleteUser = async (notificationId: string, userId: string) => {
    if (!confirm("¿Estás seguro de eliminar este usuario?")) return;
    try {
      const token = localStorage.getItem("token");
      // Delete user
      await axios.delete(`http://localhost:5000/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Dismiss notification
      await handleDismiss(notificationId);
      alert("Usuario eliminado.");
    } catch (error) {
      console.error(error);
      alert("Error al eliminar usuario.");
    }
  };

  const handleApproveGroup = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/notifications/${id}/approve-group`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setNotifications((prev) => prev.filter((n) => n._id !== id));
      alert("Grupo aprobado.");
    } catch (error) {
      console.error(error);
      alert("Error al aprobar grupo.");
    }
  };

  const handleDeleteGroup = async (notificationId: string, groupId: string) => {
    if (!confirm("¿Estás seguro de eliminar este grupo?")) return;
    try {
      const token = localStorage.getItem("token");
      // Delete group
      await axios.delete(`http://localhost:5000/api/groups/${groupId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Dismiss notification
      await handleDismiss(notificationId);
      alert("Grupo eliminado.");
    } catch (error) {
      console.error(error);
      alert("Error al eliminar grupo.");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="w-full min-h-screen bg-slate-900/50 p-4 md:p-8">
      <div className="section-header mb-8">
        <h2 className="section-title text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
          <span>🔔</span> Novedades
        </h2>
        <p className="section-subtitle text-slate-400 mt-2 text-lg">
          Notificaciones y alertas importantes
        </p>
      </div>

      <div className="max-w-5xl mx-auto space-y-6">
        {loading && notifications.length === 0 ? (
          <div className="flex justify-center p-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center p-16 bg-slate-800/30 rounded-3xl border border-slate-700/50 backdrop-blur-sm">
            <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl shadow-inner">
              🔕
            </div>
            <p className="text-slate-400 text-xl font-medium">
              No tienes nuevas notificaciones.
            </p>
            <p className="text-slate-500 mt-2">
              Te avisaremos cuando haya algo importante.
            </p>
          </div>
        ) : (
          notifications.map((notif) => (
            <div
              key={notif._id}
              className="group relative overflow-hidden bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6 hover:bg-slate-800/60 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/5 hover:border-blue-500/30"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="relative flex flex-col md:flex-row gap-6">
                {/* Icon Column */}
                <div className="shrink-0">
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-lg border border-white/10 ${
                      notif.type === "NEW_USER"
                        ? "bg-gradient-to-br from-blue-600 to-blue-800 text-white"
                        : notif.type === "NEW_GROUP"
                        ? "bg-gradient-to-br from-purple-600 to-purple-800 text-white"
                        : notif.type === "ATTENDANCE_WARNING"
                        ? "bg-gradient-to-br from-red-600 to-red-800 text-white"
                        : "bg-gradient-to-br from-slate-600 to-slate-800 text-white"
                    }`}
                  >
                    {notif.type === "NEW_USER"
                      ? "👤"
                      : notif.type === "NEW_GROUP"
                      ? "📚"
                      : notif.type === "ATTENDANCE_WARNING"
                      ? "⚠️"
                      : "📢"}
                  </div>
                </div>

                {/* Content Column */}
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <span
                      className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider border ${
                        notif.type === "NEW_USER"
                          ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                          : notif.type === "NEW_GROUP"
                          ? "bg-purple-500/10 text-purple-400 border-purple-500/20"
                          : notif.type === "ATTENDANCE_WARNING"
                          ? "bg-red-500/10 text-red-400 border-red-500/20"
                          : "bg-slate-500/10 text-slate-400 border-slate-500/20"
                      }`}
                    >
                      {notif.type === "NEW_USER"
                        ? "Nuevo Usuario"
                        : notif.type === "NEW_GROUP"
                        ? "Nuevo Grupo"
                        : notif.type === "WEEKLY_STATS"
                        ? "Estadísticas"
                        : notif.type === "ATTENDANCE_WARNING"
                        ? "Alerta Asistencia"
                        : "Notificación"}
                    </span>
                    <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                      🕒 {formatDate(notif.createdAt)}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                    {notif.title}
                  </h3>
                  <p className="text-slate-300 leading-relaxed mb-6">
                    {notif.message}
                  </p>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-3">
                    {notif.type === "NEW_USER" && user.role === "admin" && (
                      <>
                        <button
                          onClick={() => handleApproveUser(notif._id)}
                          className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:-translate-y-0.5"
                        >
                          <span>✓</span> Aprobar Usuario
                        </button>
                        <button
                          onClick={() =>
                            handleDeleteUser(
                              notif._id,
                              (notif.data as { userId: string })?.userId
                            )
                          }
                          className="flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-red-500/20 hover:shadow-red-500/40 hover:-translate-y-0.5"
                        >
                          <span>✕</span> Eliminar Usuario
                        </button>
                      </>
                    )}

                    {notif.type === "NEW_GROUP" && user.role === "admin" && (
                      <>
                        <button
                          onClick={() => handleApproveGroup(notif._id)}
                          className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:-translate-y-0.5"
                        >
                          <span>✓</span> Aprobar Grupo
                        </button>
                        <button
                          onClick={() =>
                            handleDeleteGroup(
                              notif._id,
                              (notif.data as { groupId: string })?.groupId
                            )
                          }
                          className="flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-red-500/20 hover:shadow-red-500/40 hover:-translate-y-0.5"
                        >
                          <span>✕</span> Eliminar Grupo
                        </button>
                      </>
                    )}

                    {/* General Dismiss Button */}
                    {notif.type !== "NEW_USER" &&
                      notif.type !== "NEW_GROUP" && (
                        <button
                          onClick={() => handleDismiss(notif._id)}
                          className="flex items-center gap-2 px-5 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-sm font-bold transition-all border border-slate-600 hover:border-slate-500"
                        >
                          <span>✓</span> Marcar como visto
                        </button>
                      )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
