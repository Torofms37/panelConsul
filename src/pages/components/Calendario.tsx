import React, { useState, useRef, useEffect } from "react";
import axios, { AxiosError } from "axios"; // Se importa AxiosError
import "../../styles/calendario.css";
import { useAuth } from "../../hooks/useAuth";

// --- Interfaces Actualizadas para MongoDB ---
interface Alumno {
  id: string;
  nombre: string;
  celular: string;
  fechaInicio: string;
  fechaTermino: string;
  pagoRealizado: boolean;
}

interface Grupo {
  _id: string;
  name: string;
  teacherName: string;
  students: Alumno[];
}

export const Calendario = () => {
  const { user } = useAuth();
  const [grupos, setGrupos] = useState<Grupo[]>([]);
  const [activeTab, setActiveTab] = useState<string | null>(null);

  // Estados de comunicación con el backend
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Estado para el nombre del nuevo grupo
  const [newGroupNameInput, setNewGroupNameInput] = useState("");

  // Estados para el formulario y modales de Alumno/Grupo
  const [newAlumno, setNewAlumno] = useState<
    Omit<Alumno, "id" | "pagoRealizado"> & { pagoRealizado: boolean }
  >({
    nombre: "",
    celular: "",
    fechaInicio: "",
    fechaTermino: "",
    pagoRealizado: false,
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [alumnoToDelete, setAlumnoToDelete] = useState<Alumno | null>(null);
  const [showDeleteGroupModal, setShowDeleteGroupModal] = useState(false);
  const [groupToDelete, setGroupToDelete] = useState<Grupo | null>(null);
  const [editingGroupId, setEditingGroupId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingGroupId && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editingGroupId]);

  const getAuthConfig = () => {
    const token = localStorage.getItem("token");
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  // --- Carga Inicial de Grupos (API GET) ---
  useEffect(() => {
    const fetchGroups = async () => {
      setLoading(true);
      setError(null);

      if (!user.isAuthenticated) {
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          "http://localhost:5000/api/groups",
          getAuthConfig()
        );

        const loadedGroups = response.data.map((g: any) => ({
          ...g,
          _id: g._id,
          name: g.name,
          teacherName: g.teacherName || user.name,
          students: g.students || [],
        }));

        setGrupos(loadedGroups);

        if (loadedGroups.length > 0 && !activeTab) {
          setActiveTab(loadedGroups[0]._id);
        }
      } catch (err) {
        const error = err as AxiosError<{ message: string }>;
        setError(
          error.response?.data?.message ||
            "Error al obtener grupos del servidor."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, [user.isAuthenticated]);

  // --- Función: Añadir Grupo (API POST) ---
  const handleAddGrupo = async () => {
    if (!newGroupNameInput.trim()) {
      alert("El nombre del grupo no puede estar vacío.");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/groups",
        { name: newGroupNameInput.trim() },
        getAuthConfig()
      );

      const newGroup = response.data.group;
      setGrupos([...grupos, { ...newGroup, students: [] }]);
      setActiveTab(newGroup._id);
      setNewGroupNameInput("");
      setEditingGroupId(newGroup._id);
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      setError(error.response?.data?.message || "Error al crear el grupo.");
    } finally {
      setLoading(false);
    }
  };

  // --- Lógica de CRUD Local (Pendiente de API) ---

  const handleDeleteGrupo = (grupo: Grupo) => {
    setGroupToDelete(grupo);
    setShowDeleteGroupModal(true);
  };

  const executeDeleteGrupo = () => {
    if (groupToDelete) {
      const updatedGrupos = grupos.filter((g) => g._id !== groupToDelete._id);
      setGrupos(updatedGrupos);
      if (activeTab === groupToDelete._id) {
        setActiveTab(updatedGrupos.length > 0 ? updatedGrupos[0]._id : null);
      }
      setShowDeleteGroupModal(false);
      setGroupToDelete(null);
    }
  };

  const handleEditGroupName = (grupoId: string, newName: string) => {
    setGrupos(
      grupos.map((grupo) =>
        grupo._id === grupoId ? { ...grupo, name: newName } : grupo
      )
    );
  };

  const handleAddAlumno = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAlumno.nombre || !newAlumno.celular) {
      alert("Por favor, llena los campos obligatorios.");
      return;
    }

    const updatedGrupos = grupos.map((grupo) => {
      if (grupo._id === activeTab) {
        const newAlumnoId = Date.now().toString();
        return {
          ...grupo,
          students: [...grupo.students, { ...newAlumno, id: newAlumnoId }],
        };
      }
      return grupo;
    });
    setGrupos(updatedGrupos);
    setNewAlumno({
      nombre: "",
      celular: "",
      fechaInicio: "",
      fechaTermino: "",
      pagoRealizado: false,
    });
  };

  const handleEditAlumno = (alumnoId: string, updatedData: Partial<Alumno>) => {
    const updatedGrupos = grupos.map((grupo) => {
      if (grupo._id === activeTab) {
        return {
          ...grupo,
          students: grupo.students.map((alumno) =>
            alumno.id === alumnoId ? { ...alumno, ...updatedData } : alumno
          ),
        };
      }
      return grupo;
    });
    setGrupos(updatedGrupos);
  };

  const confirmDeleteAlumno = (alumno: Alumno) => {
    setAlumnoToDelete(alumno);
    setShowDeleteModal(true);
  };

  const executeDeleteAlumno = () => {
    if (alumnoToDelete && activeTab !== null) {
      const updatedGrupos = grupos.map((grupo) => {
        if (grupo._id === activeTab) {
          return {
            ...grupo,
            students: grupo.students.filter(
              (alumno) => alumno.id !== alumnoToDelete.id
            ),
          };
        }
        return grupo;
      });
      setGrupos(updatedGrupos);
      setAlumnoToDelete(null);
      setShowDeleteModal(false);
    }
  };

  const lastActionDate = {
    date: "2024-06-15",
  };

  const activeGrupo = activeTab
    ? grupos.find((grupo) => grupo._id === activeTab)
    : null;

  return (
    <div>
      <div className="section-header">
        <h2 className="section-title">
          <span>🙋‍♂️🙋‍♀️</span>
          Registro de alumnos
        </h2>
        <p className="section-subtitle font-semibold">
          Últimas actualizaciones y noticias del sistema:{" "}
          <span className="font-extralight">{lastActionDate.date}</span>
        </p>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="content-card">
        {loading && (
          <div className="loading-message text-center py-10">
            Cargando grupos...
          </div>
        )}

        {!loading && grupos.length === 0 ? (
          <div className="empty-state">
            <h3 className="card-title">¡Empieza a organizar tus grupos!</h3>
            <p className="section-subtitle">
              Crea tu primer grupo para registrar a tus alumnos.
            </p>
            <input
              type="text"
              placeholder="Nombre del nuevo grupo (ej. 4to Semestre)"
              value={newGroupNameInput}
              onChange={(e) => setNewGroupNameInput(e.target.value)}
              className="group-name-input-lg"
            />
            <button
              className="add-group-btn large-btn"
              onClick={handleAddGrupo}
              disabled={!newGroupNameInput.trim()}
            >
              + Crear mi primer Grupo
            </button>
          </div>
        ) : (
          !loading && (
            <>
              <div className="tabs-header">
                <div className="flex-grow flex items-center">
                  {grupos.map((grupo) => (
                    <div key={grupo._id} className="tab-wrapper">
                      <button
                        className={`tab-button ${
                          activeTab === grupo._id ? "active" : ""
                        }`}
                        onClick={() => {
                          setActiveTab(grupo._id);
                          setEditingGroupId(null);
                        }}
                      >
                        {editingGroupId === grupo._id ? (
                          <input
                            type="text"
                            ref={inputRef}
                            value={grupo.name}
                            onChange={(e) =>
                              handleEditGroupName(grupo._id, e.target.value)
                            }
                            onBlur={() => setEditingGroupId(null)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                setEditingGroupId(null);
                              }
                            }}
                          />
                        ) : (
                          <span
                            onDoubleClick={() => setEditingGroupId(grupo._id)}
                          >
                            {grupo.name}
                          </span>
                        )}
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Nuevo grupo..."
                    value={newGroupNameInput}
                    onChange={(e) => setNewGroupNameInput(e.target.value)}
                    className="group-name-input-sm"
                  />
                  <button
                    className="add-group-btn"
                    onClick={handleAddGrupo}
                    disabled={!newGroupNameInput.trim()}
                  >
                    + Nuevo Grupo
                  </button>
                </div>
              </div>

              {activeGrupo && (
                <div className="tab-content">
                  <h3 className="card-title mt-4">
                    Alumnos del {activeGrupo.name}
                  </h3>
                  <form onSubmit={handleAddAlumno} className="add-form">
                    <input
                      type="text"
                      placeholder="Nombre del alumno"
                      value={newAlumno.nombre}
                      onChange={(e) =>
                        setNewAlumno({ ...newAlumno, nombre: e.target.value })
                      }
                    />
                    <input
                      type="text"
                      placeholder="Número de celular"
                      value={newAlumno.celular}
                      onChange={(e) =>
                        setNewAlumno({ ...newAlumno, celular: e.target.value })
                      }
                    />
                    <input
                      type="date"
                      placeholder="Fecha de inicio"
                      value={newAlumno.fechaInicio}
                      onChange={(e) =>
                        setNewAlumno({
                          ...newAlumno,
                          fechaInicio: e.target.value,
                        })
                      }
                    />
                    <input
                      type="date"
                      placeholder="Fecha de término"
                      value={newAlumno.fechaTermino}
                      onChange={(e) =>
                        setNewAlumno({
                          ...newAlumno,
                          fechaTermino: e.target.value,
                        })
                      }
                    />
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={newAlumno.pagoRealizado}
                        onChange={(e) =>
                          setNewAlumno({
                            ...newAlumno,
                            pagoRealizado: e.target.checked,
                          })
                        }
                      />
                      Pago realizado
                    </label>
                    <button type="submit" className="add-btn">
                      Añadir Alumno
                    </button>
                  </form>

                  <div className="table-container mt-8">
                    <table className="alumno-table">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Nombre</th>
                          <th>Celular</th>
                          <th>Inicio</th>
                          <th>Término</th>
                          <th>Pago</th>
                          <th>Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {activeGrupo.students.length > 0 ? (
                          activeGrupo.students.map((alumno) => (
                            <tr key={alumno.id}>
                              <td>{alumno.id}</td>
                              <td>{alumno.nombre}</td>
                              <td>{alumno.celular}</td>
                              <td>{alumno.fechaInicio}</td>
                              <td>{alumno.fechaTermino}</td>
                              <td
                                className={
                                  alumno.pagoRealizado
                                    ? "pago-ok"
                                    : "pago-pendiente"
                                }
                              >
                                {alumno.pagoRealizado ? "✔️" : "❌"}
                              </td>
                              <td>
                                <button
                                  className="action-btn edit-btn"
                                  onClick={() =>
                                    handleEditAlumno(alumno.id, {})
                                  }
                                >
                                  <span role="img" aria-label="edit">
                                    🖋️
                                  </span>
                                </button>
                                <button
                                  className="action-btn delete-btn"
                                  onClick={() => confirmDeleteAlumno(alumno)}
                                >
                                  <span role="img" aria-label="delete">
                                    ❌
                                  </span>
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td
                              colSpan={7}
                              className="text-center text-gray-400 py-4"
                            >
                              No hay alumnos registrados en este grupo.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  <div className="flex justify-end mt-8">
                    <button
                      className="delete-group-btn"
                      onClick={() => handleDeleteGrupo(activeGrupo)}
                    >
                      Eliminar Grupo
                    </button>
                  </div>
                </div>
              )}
            </>
          )
        )}
      </div>

      {showDeleteModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowDeleteModal(false)}
        >
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-icon">⚠️</div>
            <h3 className="modal-title">Confirmar Eliminación</h3>
            <p className="modal-text">
              ¿Estás seguro de que deseas eliminar a {alumnoToDelete?.nombre}?
            </p>
            <div className="modal-buttons">
              <button
                className="modal-btn modal-btn-cancel"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancelar
              </button>
              <button
                className="modal-btn modal-btn-confirm"
                onClick={executeDeleteAlumno}
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteGroupModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowDeleteGroupModal(false)}
        >
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-icon">⚠️</div>
            <h3 className="modal-title">Eliminar Grupo</h3>
            <p className="modal-text">
              ¿Estás seguro de que deseas eliminar el grupo "
              {groupToDelete?.name}"? Esta acción no se puede deshacer.
            </p>
            <div className="modal-buttons">
              <button
                className="modal-btn modal-btn-cancel"
                onClick={() => setShowDeleteGroupModal(false)}
              >
                Cancelar
              </button>
              <button
                className="modal-btn modal-btn-confirm"
                onClick={executeDeleteGrupo}
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
