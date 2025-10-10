import React, { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import "../../styles/calendario.css";
import { useAuth } from "../../hooks/useAuth";

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

interface Grupo {
  _id: string;
  name: string;
  teacherName: string;
  fechaInicio: string;
  fechaTermino: string;
  students: Alumno[];
}

// --- Componente Principal ---
export const Calendario = () => {
  const { user } = useAuth();
  const [grupos, setGrupos] = useState<Grupo[]>([]); // Se usa para listar los grupos
  const [modoCreacion, setModoCreacion] = useState(false);

  // Estado inicial del nuevo grupo
  const [nuevoGrupo, setNuevoGrupo] = useState<{
    name: string;
    teacherName: string;
    fechaInicio: string;
    fechaTermino: string;
    students: NuevoAlumnoData[];
  }>({
    name: "",
    teacherName: user.name || "",
    fechaInicio: "",
    fechaTermino: "",
    students: [],
  });

  const [nuevoAlumno, setNuevoAlumno] = useState<NuevoAlumnoData>({
    nombre: "",
    dineroEntregado: 0,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // [Se asumen los otros estados y funciones auxiliares (modales, etc.)]

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
        // Mapeo seguro de los datos recibidos
        setGrupos(
          response.data.map((g: any) => ({
            _id: g._id,
            name: g.name,
            teacherName: g.teacherName || user.name,
            fechaInicio: g.fechaInicio,
            fechaTermino: g.fechaTermino,
            students: g.students || [],
          }))
        );
      } catch (err) {
        const error = err as AxiosError<{ message: string }>;
        setError(
          error.response?.data?.message ||
            "Error al obtener los grupos. (Verifique el servidor)"
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

  // Lógica para guardar el grupo en el backend
  const handleGuardarGrupo = async () => {
    if (
      !nuevoGrupo.name.trim() ||
      !nuevoGrupo.fechaInicio ||
      !nuevoGrupo.fechaTermino
    ) {
      setError(
        "El nombre, la fecha de inicio y la fecha de término del grupo son obligatorios."
      );
      return;
    }

    setLoading(true);
    const config = getAuthConfig();
    if (!config) return;

    const dataToSend = {
      ...nuevoGrupo,
      teacherName: user.name || nuevoGrupo.teacherName,
    };

    try {
      const response = await axios.post(
        "http://localhost:5000/api/groups",
        dataToSend,
        config
      );

      setGrupos((prev) => [...prev, response.data.group]);

      handleCancelCreation();
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      setError(
        error.response?.data?.message ||
          "Error al guardar el grupo. (Revise la consola del servidor)"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancelCreation = () => {
    setModoCreacion(false);
    setNuevoGrupo({
      name: "",
      teacherName: user.name || "",
      fechaInicio: "",
      fechaTermino: "",
      students: [],
    });
    setNuevoAlumno({ nombre: "", dineroEntregado: 0 });
    setError(null);
  };

  // --- Funciones CRUD Locales (Deberías tener estas en tu archivo original) ---
  // NOTA: Se omiten las implementaciones completas de estas funciones
  // (ej. handleDeleteGrupo) por ser muy largas y no estar relacionadas con la API.

  // const handleDeleteGrupo = (grupo: Grupo) => {
  //   /* Lógica de eliminación */
  // };
  // const executeDeleteGrupo = () => {
  //   /* Lógica de eliminación final */
  // };
  // const handleEditGroupName = (grupoId: string, newName: string) => {
  //   /* Lógica de edición local */
  // };
  // const handleEditAlumno = (alumnoId: string, updatedData: Partial<Alumno>) => {
  //   /* Lógica de edición local */
  // };
  // const confirmDeleteAlumno = (alumno: Alumno) => {
  //   /* Lógica de modal */
  // };
  // const executeDeleteAlumno = () => {
  //   /* Lógica de eliminación final de alumno */
  // };

  // // Asumiendo que el resto de las funciones CRUD están definidas.
  // const activeGrupo = grupos.find((g) => g._id === null); // Placeholder para evitar error de compilación
  // // --------------------------------------------------------------------------

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
              <label>Nombre del Grupo</label>
              <input
                className="form-input-style"
                type="text"
                placeholder="Ej. Cuarto Semestre"
                value={nuevoGrupo.name}
                onChange={(e) =>
                  setNuevoGrupo((prev) => ({ ...prev, name: e.target.value }))
                }
              />
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

          {/* Lista temporal de alumnos */}
          {nuevoGrupo.students.length > 0 && (
            <div className="temp-students-list">
              <h5>Alumnos a Registrar:</h5>
              <ul>
                {nuevoGrupo.students.map((student, index) => (
                  <li key={index}>
                    {student.nombre} - ${student.dineroEntregado}
                  </li>
                ))}
              </ul>
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

          {/* Mostrando la lista de grupos */}
          {loading && <div className="loading-message">Cargando...</div>}
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
                  <p>
                    Periodo: {grupo.fechaInicio} al {grupo.fechaTermino}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
