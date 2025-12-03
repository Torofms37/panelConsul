import React, { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import "../../styles/calendario.css";
import { useAuth } from "../../hooks/useAuth";
import { SkeletonGroup } from "./Skeleton";
import { EditGroupModal } from "./EditGroupModal";

// --- Interfaces de Datos ---
interface Alumno {
  id: string;
  nombre: string;
  dineroEntregado: number;
}

interface NuevoAlumnoData {
  nombre: string;
  dineroEntregado: number;
}

interface Course {
  _id: string;
  name: string;
  isAvailable: boolean;
}

interface Grupo {
  _id: string;
  name: string;
  teacherName: string;
  fechaInicio: string;
  fechaTermino: string;
  courseCost?: number;
  students: Alumno[];
  course?: Course;
}

// --- Componente Principal ---
export const Calendario = () => {
  const { user } = useAuth();
  const [grupos, setGrupos] = useState<Grupo[]>([]);
  const [modoCreacion, setModoCreacion] = useState(false);
  const [editingGroup, setEditingGroup] = useState<Grupo | null>(null);
  const [availableCourses, setAvailableCourses] = useState<Course[]>([]);

  // Estado inicial del nuevo grupo
  const [nuevoGrupo, setNuevoGrupo] = useState<{
    courseId: string;
    teacherName: string;
    fechaInicio: string;
    fechaTermino: string;
    courseCost: number;
    students: NuevoAlumnoData[];
  }>({
    courseId: "",
    teacherName: user.name || "",
    fechaInicio: "",
    fechaTermino: "",
    courseCost: 1000,
    students: [],
  });

  const [nuevoAlumno, setNuevoAlumno] = useState<NuevoAlumnoData>({
    nombre: "",
    dineroEntregado: 0,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Estados para edición de alumnos temporales
  const [editingTempStudent, setEditingTempStudent] = useState<number | null>(
    null
  );
  const [tempEditValues, setTempEditValues] = useState<NuevoAlumnoData>({
    nombre: "",
    dineroEntregado: 0,
  });

  // Función auxiliar para configurar la autorización con JWT
  const getAuthConfig = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No autenticado. Por favor, inicie sesión de nuevo.");
      return null;
    }
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  // Efecto para sincronizar el nombre del maestro en el formulario al iniciar
  useEffect(() => {
    if (user.name) {
      setNuevoGrupo((prev) => ({
        ...prev,
        teacherName: user.name as string,
      }));
    }
  }, [user.name]);

  // --- Cargar Cursos Disponibles ---
  useEffect(() => {
    const fetchAvailableCourses = async () => {
      const config = getAuthConfig();
      if (!config) return;

      try {
        const response = await axios.get(
          "http://localhost:5000/api/courses/available",
          config
        );
        setAvailableCourses(response.data);
      } catch (err) {
        console.error("Error al cargar cursos disponibles:", err);
      }
    };

    if (modoCreacion) {
      fetchAvailableCourses();
    }
  }, [modoCreacion]);

  interface BackendStudent {
    _id: string;
    fullName: string;
    moneyProvided: number;
  }

  interface BackendGroup {
    _id: string;
    name: string;
    teacherName: string;
    fechaInicio: string;
    fechaTermino: string;
    courseCost: number;
    course: Course;
    students: BackendStudent[];
  }

  // --- Carga Inicial de Grupos (API GET) ---
  useEffect(() => {
    const fetchGroups = async () => {
      if (!user.isAuthenticated) return;
      setLoading(true);
      const config = getAuthConfig();
      if (!config) return;

      try {
        const response = await axios.get(
          "http://localhost:5000/api/groups",
          config
        );
        setGrupos(
          response.data.map((g: BackendGroup) => ({
            _id: g._id,
            name: g.name,
            teacherName: g.teacherName || user.name,
            fechaInicio: g.fechaInicio,
            fechaTermino: g.fechaTermino,
            courseCost: g.courseCost || 1000,
            course: g.course,
            students:
              g.students.map((s: BackendStudent) => ({
                id: s._id,
                nombre: s.fullName,
                dineroEntregado: s.moneyProvided,
              })) || [],
          }))
        );
      } catch (err) {
        const error = err as AxiosError<{ message: string }>;
        setError(
          error.response?.data?.message || "Error al obtener los grupos."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchGroups();
  }, [user.isAuthenticated, user.name]);

  // Lógica para añadir alumnos a la lista temporal
  const handleAddAlumnoTemporal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevoAlumno.nombre.trim()) {
      alert("El nombre del alumno no puede estar vacío.");
      return;
    }
    setNuevoGrupo((prev) => ({
      ...prev,
      students: [...prev.students, nuevoAlumno],
    }));
    setNuevoAlumno({ nombre: "", dineroEntregado: 0 });
  };

  // Editar alumno temporal
  const handleEditTempStudent = (index: number) => {
    setEditingTempStudent(index);
    setTempEditValues(nuevoGrupo.students[index]);
  };

  const handleSaveTempStudent = (index: number) => {
    setNuevoGrupo((prev) => ({
      ...prev,
      students: prev.students.map((s, i) => (i === index ? tempEditValues : s)),
    }));
    setEditingTempStudent(null);
  };

  const handleDeleteTempStudent = (index: number) => {
    setNuevoGrupo((prev) => ({
      ...prev,
      students: prev.students.filter((_, i) => i !== index),
    }));
  };

  // Eliminar grupo
  const handleDeleteGroup = async (groupId: string) => {
    if (!window.confirm("¿Estás seguro de que quieres eliminar este grupo?"))
      return;

    setLoading(true);
    const config = getAuthConfig();
    if (!config) return;

    try {
      await axios.delete(`http://localhost:5000/api/groups/${groupId}`, config);
      setGrupos((prev) => prev.filter((g) => g._id !== groupId));
      alert("Grupo eliminado exitosamente.");
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      setError(error.response?.data?.message || "Error al eliminar el grupo.");
    } finally {
      setLoading(false);
    }
  };

  // Abrir modal de edición
  const startEditGroup = (grupo: Grupo) => {
    setEditingGroup(grupo);
  };

  // Lógica para guardar el grupo en el backend
  const handleGuardarGrupo = async () => {
    if (
      !nuevoGrupo.courseId ||
      !nuevoGrupo.fechaInicio ||
      !nuevoGrupo.fechaTermino
    ) {
      setError(
        "El curso, la fecha de inicio y la fecha de término son obligatorios."
      );
      return;
    }

    setLoading(true);
    const config = getAuthConfig();
    if (!config) return;

    const dataToSend = {
      courseId: nuevoGrupo.courseId,
      teacherName: user.name || nuevoGrupo.teacherName,
      fechaInicio: nuevoGrupo.fechaInicio,
      fechaTermino: nuevoGrupo.fechaTermino,
      courseCost: nuevoGrupo.courseCost,
      students: nuevoGrupo.students,
    };

    try {
      const response = await axios.post(
        "http://localhost:5000/api/groups",
        dataToSend,
        config
      );
      setGrupos((prev) => [...prev, response.data.group]);
      handleCancelCreation();
      alert("Grupo creado exitosamente.");
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      setError(error.response?.data?.message || "Error al guardar el grupo.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelCreation = () => {
    setModoCreacion(false);
    setNuevoGrupo({
      courseId: "",
      teacherName: user.name || "",
      fechaInicio: "",
      fechaTermino: "",
      courseCost: 1000,
      students: [],
    });
    setNuevoAlumno({ nombre: "", dineroEntregado: 0 });
    setError(null);
  };

  // --- RENDERIZADO DEL COMPONENTE ---
  return (
    <div>
      <div className="section-header">
        <h2 className="section-title">
          <span>🙋‍♂️🙋‍♀️</span>Registro de Grupos y Alumnos
        </h2>
      </div>
      {error && <div className="error-message">{error}</div>}

      {modoCreacion ? (
        // --- VISTA DE CREACIÓN DE GRUPO ---
        <div className="content-card creation-mode">
          <h3 className="card-title">Creando Nuevo Grupo</h3>

          <div className="form-grid">
            <div className="form-group">
              <label>Seleccionar Curso *</label>
              <select
                className="form-input-style"
                value={nuevoGrupo.courseId}
                onChange={(e) =>
                  setNuevoGrupo((prev) => ({
                    ...prev,
                    courseId: e.target.value,
                  }))
                }
              >
                <option value="">-- Seleccione un curso --</option>
                {availableCourses.map((course) => (
                  <option key={course._id} value={course._id}>
                    {course.name}
                  </option>
                ))}
              </select>
              {availableCourses.length === 0 && (
                <p
                  style={{
                    color: "#f59e0b",
                    fontSize: "0.875rem",
                    marginTop: "0.5rem",
                  }}
                >
                  ⚠️ No hay cursos disponibles. Todos los cursos están siendo
                  utilizados.
                </p>
              )}
            </div>
            <div className="form-group">
              <label>Nombre del Maestro Asignado</label>
              <input
                className="form-input-style"
                type="text"
                placeholder="Ej. Prof. Juan Pérez"
                value={nuevoGrupo.teacherName}
                onChange={(e) =>
                  setNuevoGrupo((prev) => ({
                    ...prev,
                    teacherName: e.target.value,
                  }))
                }
              />
            </div>
            <div className="form-group">
              <label>Fecha General de Inicio</label>
              <input
                className="form-input-style"
                type="date"
                value={nuevoGrupo.fechaInicio}
                onChange={(e) =>
                  setNuevoGrupo((prev) => ({
                    ...prev,
                    fechaInicio: e.target.value,
                  }))
                }
              />
            </div>
            <div className="form-group">
              <label>Fecha General de Término</label>
              <input
                className="form-input-style"
                type="date"
                value={nuevoGrupo.fechaTermino}
                onChange={(e) =>
                  setNuevoGrupo((prev) => ({
                    ...prev,
                    fechaTermino: e.target.value,
                  }))
                }
              />
            </div>
            <div className="form-group">
              <label>Costo Total del Curso</label>
              <input
                className="form-input-style"
                type="number"
                placeholder="Ej. 1000"
                value={nuevoGrupo.courseCost}
                onChange={(e) =>
                  setNuevoGrupo((prev) => ({
                    ...prev,
                    courseCost: parseInt(e.target.value, 10) || 0,
                  }))
                }
              />
            </div>
          </div>

          <h4 className="subsection-title">Añadir Alumnos al Grupo</h4>
          <form onSubmit={handleAddAlumnoTemporal} className="add-form">
            <input
              className="form-input-style"
              type="text"
              placeholder="Nombre del Alumno"
              value={nuevoAlumno.nombre}
              onChange={(e) =>
                setNuevoAlumno((prev) => ({ ...prev, nombre: e.target.value }))
              }
            />
            <input
              className="form-input-style"
              type="number"
              placeholder="Dinero entregado"
              value={nuevoAlumno.dineroEntregado || ""}
              onChange={(e) =>
                setNuevoAlumno((prev) => ({
                  ...prev,
                  dineroEntregado: parseInt(e.target.value, 10) || 0,
                }))
              }
            />
            <button type="submit" className="add-btn">
              Añadir Alumno
            </button>
          </form>

          {/* Lista temporal de alumnos con edición */}
          {nuevoGrupo.students.length > 0 && (
            <div className="temp-students-list">
              <h5>Alumnos a Registrar:</h5>
              <table className="temp-students-table">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Dinero Entregado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {nuevoGrupo.students.map((student, index) => (
                    <tr key={index}>
                      <td>
                        {editingTempStudent === index ? (
                          <input
                            type="text"
                            value={tempEditValues.nombre}
                            onChange={(e) =>
                              setTempEditValues((prev) => ({
                                ...prev,
                                nombre: e.target.value,
                              }))
                            }
                            className="edit-input-small"
                          />
                        ) : (
                          student.nombre
                        )}
                      </td>
                      <td>
                        {editingTempStudent === index ? (
                          <input
                            type="number"
                            value={tempEditValues.dineroEntregado}
                            onChange={(e) =>
                              setTempEditValues((prev) => ({
                                ...prev,
                                dineroEntregado:
                                  parseInt(e.target.value, 10) || 0,
                              }))
                            }
                            className="edit-input-small"
                          />
                        ) : (
                          `$${student.dineroEntregado}`
                        )}
                      </td>
                      <td>
                        {editingTempStudent === index ? (
                          <>
                            <button
                              className="save-btn-small"
                              onClick={() => handleSaveTempStudent(index)}
                            >
                              ✓
                            </button>
                            <button
                              className="cancel-btn-small"
                              onClick={() => setEditingTempStudent(null)}
                            >
                              ✕
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              className="edit-btn-small"
                              onClick={() => handleEditTempStudent(index)}
                            >
                              Editar
                            </button>
                            <button
                              className="delete-btn-small"
                              onClick={() => handleDeleteTempStudent(index)}
                            >
                              Eliminar
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="form-actions">
            <button className="cancel-btn" onClick={handleCancelCreation}>
              Cancelar
            </button>
            <button
              className="save-group-btn"
              onClick={handleGuardarGrupo}
              disabled={loading}
            >
              {loading ? "Guardando..." : "Guardar Grupo"}
            </button>
          </div>
        </div>
      ) : (
        // --- VISTA DE LISTA DE GRUPOS ---
        <div>
          <div className="group-list-header">
            <h3 className="card-title">Grupos Existentes</h3>
            <button
              className="add-group-btn"
              onClick={() => setModoCreacion(true)}
            >
              + Crear Nuevo Grupo
            </button>
          </div>

          {loading && (
            <div className="group-list-container">
              <SkeletonGroup />
              <SkeletonGroup />
              <SkeletonGroup />
              <SkeletonGroup />
            </div>
          )}
          {!loading && grupos.length === 0 ? (
            <div className="content-card empty-state">
              <p>No hay grupos creados todavía.</p>
              <p>Haz clic en "Crear Nuevo Grupo" para empezar.</p>
            </div>
          ) : (
            <div className="group-list-container">
              {grupos.map((grupo) => (
                <div key={grupo._id} className="group-item-card">
                  <h4>{grupo.name}</h4>
                  <p>Maestro: {grupo.teacherName}</p>
                  <p>Alumnos: {grupo.students.length}</p>
                  <p>Costo: ${grupo.courseCost || 1000}</p>
                  <p>
                    Periodo: {grupo.fechaInicio} al {grupo.fechaTermino}
                  </p>

                  <div className="group-actions">
                    <button
                      className="edit-btn"
                      onClick={() => startEditGroup(grupo)}
                      disabled={loading}
                    >
                      Editar
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDeleteGroup(grupo._id)}
                      disabled={loading}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modal de Edición de Grupo */}
      {editingGroup && (
        <EditGroupModal
          group={editingGroup}
          isOpen={!!editingGroup}
          onClose={() => setEditingGroup(null)}
          onGroupUpdated={(updatedGroup) => {
            setGrupos((prev) =>
              prev.map((g) => (g._id === updatedGroup._id ? updatedGroup : g))
            );
          }}
        />
      )}
    </div>
  );
};
