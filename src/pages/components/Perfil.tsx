import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../hooks/useAuth";
import "../../styles/perfil.css";

interface UserProfile {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "teacher";
  photoUrl?: string;
  birthDate?: string;
}

export const Perfil = () => {
  const { logout } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    photoUrl: "",
    birthDate: "",
  });
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await axios.get("http://localhost:5000/api/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const userData = response.data;
      setProfile(userData);
      setFormData({
        name: userData.name || "",
        photoUrl: userData.photoUrl || "",
        birthDate: userData.birthDate ? userData.birthDate.split("T")[0] : "",
      });
      setPreviewUrl(userData.photoUrl || null);
    } catch (err) {
      setError("Error al cargar el perfil");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPhotoFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const data = new FormData();
      data.append("name", formData.name);
      data.append("birthDate", formData.birthDate);
      if (photoFile) {
        data.append("photo", photoFile);
      } else if (formData.photoUrl) {
        // Keep existing URL if no new file
        data.append("photoUrl", formData.photoUrl);
      }

      const response = await axios.put(
        "http://localhost:5000/api/users/profile",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setProfile(response.data.user);
      // Update local storage if name changed
      if (response.data.user.name) {
        localStorage.setItem("userName", response.data.user.name);
      }

      alert("Perfil actualizado correctamente");
    } catch (err) {
      setError("Error al guardar los cambios");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (
      !window.confirm(
        "¿Estás seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer."
      )
    ) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      await axios.delete("http://localhost:5000/api/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Cuenta eliminada correctamente");
      logout(); // Cerrar sesión y redirigir
    } catch (err) {
      setError("Error al eliminar la cuenta");
      console.error(err);
    }
  };

  if (loading) return <div className="p-8 text-white">Cargando perfil...</div>;

  return (
    <div className="perfil-container">
      <div className="section-header">
        <h2 className="section-title">
          <span>👤</span> Mi Perfil
        </h2>
        <p className="section-subtitle">Gestiona tu información personal</p>
      </div>

      {error && <div className="error-message mb-4">{error}</div>}

      <div className="perfil-card">
        <div className="perfil-header">
          <div className="perfil-avatar-container">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Foto de perfil"
                className="perfil-avatar"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                  (
                    e.target as HTMLImageElement
                  ).nextElementSibling?.removeAttribute("style");
                }}
              />
            ) : null}
            <div
              className="perfil-avatar-placeholder"
              style={previewUrl ? { display: "none" } : {}}
            >
              {formData.name.charAt(0).toUpperCase()}
            </div>
          </div>

          <div className="perfil-info">
            <h2>{profile?.name}</h2>
            <span
              className={`perfil-role-badge role-${profile?.role || "teacher"}`}
            >
              {profile?.role === "admin" ? "Administrador" : "Profesor"}
            </span>
            <p className="text-slate-400 mt-2">{profile?.email}</p>
          </div>
        </div>

        <div className="perfil-form">
          <div className="form-group">
            <label>Nombre Completo</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="form-input"
              placeholder="Tu nombre completo"
            />
          </div>

          <div className="form-group">
            <label>Foto de Perfil</label>
            <div className="custom-file-input">
              <input
                type="file"
                id="photo-upload"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden-input"
              />
              <label htmlFor="photo-upload" className="file-label">
                <span className="file-icon">📷</span>
                <span>
                  {photoFile ? photoFile.name : "Elige una foto de perfil"}
                </span>
              </label>
            </div>
            <small className="text-slate-500">
              Sube una imagen desde tu computadora
            </small>
          </div>

          <div className="form-group">
            <label>Fecha de Nacimiento</label>
            <input
              type="date"
              name="birthDate"
              value={formData.birthDate}
              onChange={handleChange}
              className="form-input"
            />
          </div>
        </div>

        <div className="perfil-actions">
          <button className="delete-account-btn" onClick={handleDeleteAccount}>
            Eliminar Cuenta
          </button>

          <button className="save-btn" onClick={handleSave} disabled={saving}>
            {saving ? "Guardando..." : "Guardar Cambios"}
          </button>
        </div>
      </div>
    </div>
  );
};
