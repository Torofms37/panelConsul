import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../hooks/useAuth";
import "../../styles/personal.css";

interface User {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "teacher";
  photoUrl?: string;
  birthDate?: string;
  courses?: string[];
}

export const Personal = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await axios.get("http://localhost:5000/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data);
    } catch (err) {
      setError("Error al cargar el personal");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const calculateAge = (birthDateString?: string) => {
    if (!birthDateString) return "N/A";
    const today = new Date();
    const birthDate = new Date(birthDateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const handleRoleChange = async (
    userId: string,
    newRole: "admin" | "teacher"
  ) => {
    if (!window.confirm(`¿Estás seguro de cambiar el rol a ${newRole}?`))
      return;

    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      await axios.put(
        `http://localhost:5000/api/users/${userId}/role`,
        { role: newRole },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Actualizar lista localmente
      setUsers(
        users.map((u) => (u._id === userId ? { ...u, role: newRole } : u))
      );
    } catch (err) {
      alert("Error al cambiar el rol. Verifica tus permisos.");
      console.error(err);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (
      !window.confirm(
        "¿Estás seguro de eliminar a este usuario permanentemente?"
      )
    )
      return;

    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      await axios.delete(`http://localhost:5000/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Actualizar lista localmente
      setUsers(users.filter((u) => u._id !== userId));
    } catch (err) {
      alert("Error al eliminar usuario. Verifica tus permisos.");
      console.error(err);
    }
  };

  const admins = users.filter((u) => u.role === "admin");
  // Tratar a cualquier usuario que no sea admin como profesor (incluyendo roles undefined/null)
  const teachers = users.filter((u) => u.role !== "admin");

  const UserCard = ({ user }: { user: User }) => (
    <div className="personal-card">
      <div className="card-header">
        <div className="card-avatar-container">
          {user.photoUrl ? (
            <img
              src={user.photoUrl}
              alt={user.name}
              className="card-avatar"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
                (
                  e.target as HTMLImageElement
                ).nextElementSibling?.removeAttribute("style");
              }}
            />
          ) : null}
          <div
            className="card-avatar-placeholder"
            style={user.photoUrl ? { display: "none" } : {}}
          >
            {user.name.charAt(0).toUpperCase()}
          </div>
        </div>
      </div>

      <div className="card-body">
        <h4 className="card-name">{user.name}</h4>
        <span className="card-role">
          {user.role === "admin" ? "Administrador" : "Profesor"}
        </span>

        <div className="card-details">
          <div className="detail-item">
            <span className="detail-icon">🎂</span>
            <span>{calculateAge(user.birthDate)} años</span>
          </div>

          {user.courses && user.courses.length > 0 && (
            <div className="detail-item" style={{ alignItems: "flex-start" }}>
              <span className="detail-icon">📚</span>
              <div className="courses-list">
                {user.courses.map((course, idx) => (
                  <span key={idx} className="course-tag">
                    {course}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Solo mostrar acciones si el usuario actual es admin y no es él mismo */}
      {currentUser?.role === "admin" && currentUser.id !== user._id && (
        <div className="card-actions">
          {user.role === "teacher" || !user.role ? (
            <button
              className="action-btn promote-btn"
              title="Ascender a Admin"
              onClick={() => handleRoleChange(user._id, "admin")}
            >
              ⬆️ Admin
            </button>
          ) : (
            <button
              className="action-btn demote-btn"
              title="Descender a Profesor"
              onClick={() => handleRoleChange(user._id, "teacher")}
            >
              ⬇️ Profesor
            </button>
          )}

          <button
            className="action-btn delete-user-btn"
            title="Eliminar Usuario"
            onClick={() => handleDeleteUser(user._id)}
          >
            🗑️
          </button>
        </div>
      )}
    </div>
  );

  if (loading)
    return <div className="p-8 text-white">Cargando personal...</div>;

  return (
    <div className="personal-container">
      <div className="section-header">
        <h2 className="section-title">
          <span>👥</span> Personal
        </h2>
        <p className="section-subtitle">
          Directorio de administradores y profesores
        </p>
      </div>

      {error && <div className="error-message mb-4">{error}</div>}

      <div className="personal-section">
        <div className="section-title-wrapper">
          <h3>Administradores</h3>
          <span className="admin-badge">{admins.length}</span>
        </div>

        <div className="personal-grid">
          {admins.map((admin) => (
            <UserCard key={admin._id} user={admin} />
          ))}
          {admins.length === 0 && (
            <p className="text-slate-500">
              No hay administradores registrados.
            </p>
          )}
        </div>
      </div>

      <div className="personal-section">
        <div className="section-title-wrapper">
          <h3>Profesores</h3>
          <span className="teacher-badge">{teachers.length}</span>
        </div>

        <div className="personal-grid">
          {teachers.map((teacher) => (
            <UserCard key={teacher._id} user={teacher} />
          ))}
          {teachers.length === 0 && (
            <p className="text-slate-500">No hay profesores registrados.</p>
          )}
        </div>
      </div>
    </div>
  );
};
