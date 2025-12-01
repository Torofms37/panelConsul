import React, { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import "../../styles/cursos.css";
import { SkeletonCard, SkeletonTable } from "./Skeleton";

// Interfaces de datos alineadas con el backend
interface Alumno {
  _id: string;
  fullName: string;
  moneyProvided: number;
  groupName: string;
}

interface Grupo {
  _id: string;
  name: string;
  teacherName: string;
  fechaInicio: string;
  fechaTermino: string;
  students: Alumno[];
}

interface CursosProps {
  onNavigateToCalendar: () => void;
}

export const Cursos: React.FC<CursosProps> = ({ onNavigateToCalendar }) => {
  const [grupos, setGrupos] = useState<Grupo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [showDetails, setShowDetails] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<Grupo | null>(null);
  const [selectedAlumnos, setSelectedAlumnos] = useState<string[]>([]);

  // Función auxiliar para formatear fecha (YYYY-MM-DD -> Mes Año)
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    // Ajuste de zona horaria simple o uso de UTC para evitar desfases de día
    // Para simplificar y mostrar solo Mes/Año:
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      timeZone: "UTC", // Asumimos que la fecha viene en formato ISO simple
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

  // Lógica de descarga (simplificada para el ejemplo)
  const handleDownloadDiplomas = () => {
    if (selectedAlumnos.length > 0) {
      // Aquí iría la lógica real de generación de diplomas
      alert(
        `Descargando diplomas para los alumnos con IDs: ${selectedAlumnos.join(
          ", "
        )}`
      );
    } else {
      alert(
        "Por favor, selecciona al menos un alumno para descargar diplomas."
      );
    }
  };

  const handleDownloadSingle = (alumno: Alumno) => {
    alert(`Descargando diploma de ${alumno.fullName}`);
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

          {/* Información del Profesor */}
          <div className="teacher-info-card mt-4 mb-4 p-4 bg-white rounded shadow-sm border border-gray-200">
            <h4 className="text-lg font-semibold text-gray-700">
              Información del Curso
            </h4>
            <p className="text-gray-600">
              <strong>Profesor:</strong> {selectedGroup?.teacherName}
            </p>
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
                      <span className="font-medium text-green-600">
                        ${alumno.moneyProvided}
                      </span>
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
