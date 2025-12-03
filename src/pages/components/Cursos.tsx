import React, { useState, useEffect, useRef } from "react";
import axios, { AxiosError } from "axios";
import "../../styles/cursos.css";
import { SkeletonCard, SkeletonTable } from "./Skeleton";
import { useAuth } from "../../hooks/useAuth";

// Interfaces de datos alineadas con el backend
interface Alumno {
  _id: string;
  fullName: string;
  moneyProvided: number;
  groupName: string;
}

interface Course {
  _id: string;
  name: string;
  certificateTemplateUrl?: string;
}

interface Grupo {
  _id: string;
  name: string;
  teacherName: string;
  fechaInicio: string;
  fechaTermino: string;
  students: Alumno[];
  course: Course;
}

interface CursosProps {
  onNavigateToCalendar: () => void;
}

export const Cursos: React.FC<CursosProps> = ({ onNavigateToCalendar }) => {
  const { user } = useAuth();
  const [grupos, setGrupos] = useState<Grupo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [showDetails, setShowDetails] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<Grupo | null>(null);
  const [selectedAlumnos, setSelectedAlumnos] = useState<string[]>([]);

  // Estado para la subida de plantilla
  const [uploadingTemplate, setUploadingTemplate] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Función auxiliar para formatear fecha (YYYY-MM-DD -> Mes Año)
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      timeZone: "UTC",
    });
  };

  // Fetch de grupos al montar el componente
  useEffect(() => {
    const fetchGroups = async () => {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No autenticado.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          "http://localhost:5000/api/all-groups",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setGrupos(response.data);
      } catch (err) {
        const error = err as AxiosError<{ message: string }>;
        setError(
          error.response?.data?.message || "Error al cargar los cursos."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, []);

  const handleSelectGroup = (grupo: Grupo) => {
    setSelectedGroup(grupo);
    setShowDetails(true);
    setSelectedAlumnos([]);
  };

  const handleBackToGroups = () => {
    setShowDetails(false);
    setSelectedGroup(null);
  };

  const handleSelectAlumno = (id: string) => {
    setSelectedAlumnos((prev) =>
      prev.includes(id) ? prev.filter((aId) => aId !== id) : [...prev, id]
    );
  };

  const handleSelectAllAlumnos = () => {
    if (selectedGroup) {
      if (selectedAlumnos.length === selectedGroup.students.length) {
        setSelectedAlumnos([]);
      } else {
        setSelectedAlumnos(selectedGroup.students.map((a) => a._id));
      }
    }
  };

  // Subir plantilla (Solo Admin)
  const handleUploadTemplate = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!e.target.files || !e.target.files[0] || !selectedGroup) return;

    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("template", file);

    setUploadingTemplate(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `http://localhost:5000/api/courses/${selectedGroup.course._id}/template`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Actualizar el grupo seleccionado con la nueva URL de la plantilla
      const updatedCourse = response.data.course;
      setSelectedGroup({
        ...selectedGroup,
        course: updatedCourse,
      });

      // Actualizar la lista general de grupos
      setGrupos((prev) =>
        prev.map((g) =>
          g._id === selectedGroup._id ? { ...g, course: updatedCourse } : g
        )
      );

      alert("Plantilla actualizada correctamente.");
    } catch (err) {
      console.error(err);
      alert("Error al subir la plantilla.");
    } finally {
      setUploadingTemplate(false);
    }
  };

  // Generar Diploma
  const generateAndDownloadDiploma = async (
    studentName: string,
    templateUrl: string
  ) => {
    return new Promise<void>((resolve, reject) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();

      // Necesario para evitar problemas de CORS con imágenes externas
      img.crossOrigin = "Anonymous";
      img.src = templateUrl;

      img.onload = () => {
        if (!ctx) return reject("No context");

        canvas.width = img.width;
        canvas.height = img.height;

        // Dibujar la plantilla
        ctx.drawImage(img, 0, 0);

        // Configurar texto
        ctx.font = "bold 100px Arial"; // Ajustable según la plantilla
        ctx.fillStyle = "#000000";
        ctx.textAlign = "left";

        // Dibujar nombre (centrado por defecto, ajustable)
        // Asumimos que el nombre va en el centro de la imagen, un poco más abajo de la mitad
        ctx.fillText(studentName, canvas.width / 2, canvas.height / 2);

        // Convertir a blob y descargar
        canvas.toBlob((blob) => {
          if (!blob) return reject("Error creating blob");
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = `Constancia_${studentName.replace(/\s+/g, "_")}.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
          resolve();
        }, "image/png");
      };

      img.onerror = (err) => {
        reject(err);
      };
    });
  };

  const handleDownloadDiplomas = async () => {
    if (!selectedGroup?.course.certificateTemplateUrl) {
      alert(
        "Este curso no tiene una plantilla de constancia asignada. Pide a un administrador que suba una."
      );
      return;
    }

    if (selectedAlumnos.length === 0) {
      alert("Por favor, selecciona al menos un alumno.");
      return;
    }

    // Validar restricción para profesores (7ma sesión)
    if (user.role === "teacher") {
      const startDate = new Date(selectedGroup.fechaInicio);
      const today = new Date();
      // Aproximación: 7 semanas = 49 días.
      // Si han pasado menos de 42 días (6 semanas), probablemente no es la 7ma sesión.
      // Ajustemos a 6 semanas como "seguro" o simplemente bloqueemos si no estamos cerca del final.
      // Mejor aún: Si la fecha actual es anterior a la fecha de término menos 1 o 2 semanas.

      const diffTime = Math.abs(today.getTime() - startDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      // Asumiendo 1 sesión por semana, 7ma sesión es en la semana 7 (aprox 42-49 días)
      if (diffDays < 42) {
        alert(
          "Como profesor, solo puedes descargar las constancias a partir de la 7ma sesión."
        );
        return;
      }
    }

    const studentsToDownload = selectedGroup.students.filter((s) =>
      selectedAlumnos.includes(s._id)
    );

    // Procesar descargas secuencialmente para no saturar
    for (const student of studentsToDownload) {
      try {
        await generateAndDownloadDiploma(
          student.fullName,
          selectedGroup.course.certificateTemplateUrl
        );
        // Pequeña pausa entre descargas
        await new Promise((r) => setTimeout(r, 500));
      } catch (e) {
        console.error(`Error generando diploma para ${student.fullName}`, e);
        alert(`Error generando diploma para ${student.fullName}`);
      }
    }
  };

  const handleDownloadSingle = async (alumno: Alumno) => {
    if (!selectedGroup?.course.certificateTemplateUrl) {
      alert("Este curso no tiene una plantilla de constancia asignada.");
      return;
    }
    try {
      await generateAndDownloadDiploma(
        alumno.fullName,
        selectedGroup.course.certificateTemplateUrl
      );
    } catch (e) {
      console.error(e);
      alert("Error al generar la constancia.");
    }
  };

  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  if (loading) {
    return (
      <div className="w-full">
        <div className="section-header">
          <h2 className="section-title">
            <span>📚</span>
            {showDetails ? `Curso: Cargando...` : "Todos los Cursos"}
          </h2>
          <p className="section-subtitle">
            {showDetails
              ? "Detalles del grupo y alumnos"
              : "Revisa el estado general de todos los cursos creados."}
          </p>
        </div>

        {!showDetails ? (
          <div className="groups-grid">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : (
          <div className="group-details-view">
            <div className="details-header">
              <div style={{ width: "150px", height: "40px" }}>
                <SkeletonCard />
              </div>
            </div>
            <SkeletonTable rows={6} columns={5} />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="section-header">
        <h2 className="section-title">
          <span>📚</span>
          {showDetails ? `Curso: ${selectedGroup?.name}` : "Todos los Cursos"}
        </h2>
        <p className="section-subtitle">
          {showDetails
            ? "Detalles del grupo y alumnos"
            : "Revisa el estado general de todos los cursos creados."}
        </p>
      </div>

      {!showDetails ? (
        <div className="groups-grid">
          {grupos.length === 0 ? (
            <div
              className="empty-state-container"
              style={{
                textAlign: "center",
                padding: "40px",
                width: "100%",
                gridColumn: "1 / -1",
              }}
            >
              <svg
                width="200"
                height="200"
                viewBox="0 0 200 200"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{ margin: "0 auto 20px", display: "block" }}
              >
                <circle cx="100" cy="100" r="90" fill="#F3F4F6" />
                <path
                  d="M65 75V135C65 140.523 69.4772 145 75 145H125C130.523 145 135 140.523 135 135V75"
                  stroke="#9CA3AF"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M65 75H135V65C135 59.4772 130.523 55 125 55H75C69.4772 55 65 59.4772 65 65V75Z"
                  fill="#E5E7EB"
                  stroke="#9CA3AF"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M85 100H115"
                  stroke="#9CA3AF"
                  strokeWidth="8"
                  strokeLinecap="round"
                />
                <path
                  d="M85 120H105"
                  stroke="#9CA3AF"
                  strokeWidth="8"
                  strokeLinecap="round"
                />
              </svg>
              <h3
                style={{
                  fontSize: "1.25rem",
                  fontWeight: 600,
                  color: "#374151",
                  marginBottom: "0.5rem",
                }}
              >
                No hay cursos registrados
              </h3>
              <p style={{ color: "#6B7280", marginBottom: "1.5rem" }}>
                Parece que aún no se han creado cursos. ¡Comienza registrando
                uno nuevo!
              </p>
              <button
                style={{
                  backgroundColor: "#2563EB",
                  color: "white",
                  padding: "0.5rem 1.5rem",
                  borderRadius: "0.5rem",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "1rem",
                  transition: "background-color 0.2s",
                }}
                onClick={onNavigateToCalendar}
                onMouseOver={(e) =>
                  (e.currentTarget.style.backgroundColor = "#1D4ED8")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.backgroundColor = "#2563EB")
                }
              >
                Registrar un Curso
              </button>
            </div>
          ) : (
            grupos.map((grupo) => (
              <div
                key={grupo._id}
                className="group-card"
                onClick={() => handleSelectGroup(grupo)}
              >
                <h3 className="group-name">{grupo.name}</h3>
                <p className="group-info">
                  <strong>Total de alumnos:</strong> {grupo.students.length}
                </p>
                <p className="group-info">
                  <strong>Inicio:</strong> {formatDate(grupo.fechaInicio)}
                </p>
                <p className="group-info">
                  <strong>Término:</strong> {formatDate(grupo.fechaTermino)}
                </p>
                <div className="group-actions">
                  <button className="view-details-btn">Ver estado</button>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="group-details-view">
          <div className="details-header">
            <button className="back-btn" onClick={handleBackToGroups}>
              ← Volver a Cursos
            </button>
            <div className="selection-actions">
              <button
                className="download-selected-btn"
                disabled={selectedAlumnos.length === 0}
                onClick={handleDownloadDiplomas}
              >
                Descargar Diplomas ({selectedAlumnos.length})
              </button>
            </div>
          </div>

          {/* Información del Profesor y Plantilla */}
          <div className="course-info-card">
            <div className="course-info-content">
              <h4>
                <span>ℹ️</span> Información del Curso
              </h4>
              <div className="course-info-item">
                <strong>Profesor:</strong>
                <span>{selectedGroup?.teacherName}</span>
              </div>
              <div className="course-info-item">
                <strong>Plantilla:</strong>{" "}
                {selectedGroup?.course.certificateTemplateUrl ? (
                  <span className="status-badge status-success">
                    <span>✓</span> Cargada
                  </span>
                ) : (
                  <span className="status-badge status-error">
                    <span>✕</span> No cargada
                  </span>
                )}
              </div>
            </div>

            {/* Solo Admin puede subir plantilla */}
            {user.role === "admin" && (
              <div className="upload-section">
                <span className="upload-label-title">
                  Subir/Actualizar Plantilla
                </span>
                <label className="custom-file-upload">
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleUploadTemplate}
                    disabled={uploadingTemplate}
                    className="file-input-hidden"
                  />
                  {uploadingTemplate ? "Subiendo..." : "📂 Seleccionar Archivo"}
                </label>
                <p className="upload-helper-text">
                  Formatos: PNG, JPG (Max 5MB)
                </p>
              </div>
            )}
          </div>

          <div className="table-container mt-4">
            <table className="alumnos-table">
              <thead>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      onChange={handleSelectAllAlumnos}
                      checked={
                        !!selectedGroup &&
                        selectedAlumnos.length ===
                          selectedGroup.students.length &&
                        selectedGroup.students.length > 0
                      }
                    />
                  </th>
                  <th>Nombre</th>
                  <th>Curso</th>
                  <th>Dinero Entregado</th>
                  <th>Descarga</th>
                </tr>
              </thead>
              <tbody>
                {selectedGroup?.students.map((alumno) => (
                  <tr key={alumno._id}>
                    <td>
                      <input
                        type="checkbox"
                        onChange={() => handleSelectAlumno(alumno._id)}
                        checked={selectedAlumnos.includes(alumno._id)}
                      />
                    </td>
                    <td>{alumno.fullName}</td>
                    <td>{alumno.groupName}</td>
                    <td>
                      <span>${alumno.moneyProvided}</span>
                    </td>
                    <td>
                      <button
                        className="download-btn"
                        onClick={() => handleDownloadSingle(alumno)}
                      >
                        Descargar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
