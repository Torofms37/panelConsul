import React, { useState, useRef, useEffect } from "react";
import "../../styles/calendario.css";

// Definición de las interfaces
interface Alumno {
  id: number;
  nombre: string;
  celular: string;
  fechaInicio: string;
  fechaTermino: string;
  pagoRealizado: boolean;
}

interface Grupo {
  id: number;
  nombre: string;
  alumnos: Alumno[];
}

export const Calendario = () => {
  const [grupos, setGrupos] = useState<Grupo[]>([]);
  const [activeTab, setActiveTab] = useState<number | null>(null);
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
  const [editingGroupId, setEditingGroupId] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingGroupId && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editingGroupId]);

  const handleAddGrupo = () => {
    const newId =
      grupos.length > 0 ? Math.max(...grupos.map((g) => g.id)) + 1 : 1;
    const newGrupo = { id: newId, nombre: `Grupo ${newId}`, alumnos: [] };
    setGrupos([...grupos, newGrupo]);
    setActiveTab(newId);
    setEditingGroupId(newId); // Iniciar la edición del nuevo grupo
  };

  const handleDeleteGrupo = (grupo: Grupo) => {
    setGroupToDelete(grupo);
    setShowDeleteGroupModal(true);
  };

  const executeDeleteGrupo = () => {
    if (groupToDelete) {
      const updatedGrupos = grupos.filter((g) => g.id !== groupToDelete.id);
      setGrupos(updatedGrupos);
      if (activeTab === groupToDelete.id) {
        setActiveTab(updatedGrupos.length > 0 ? updatedGrupos[0].id : null);
      }
      setShowDeleteGroupModal(false);
      setGroupToDelete(null);
    }
  };

  const handleEditGroupName = (grupoId: number, newName: string) => {
    setGrupos(
      grupos.map((grupo) =>
        grupo.id === grupoId ? { ...grupo, nombre: newName } : grupo
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
      if (grupo.id === activeTab) {
        const newAlumnoId =
          grupo.alumnos.length > 0
            ? Math.max(...grupo.alumnos.map((a) => a.id)) + 1
            : 1;
        return {
          ...grupo,
          alumnos: [...grupo.alumnos, { ...newAlumno, id: newAlumnoId }],
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

  const handleEditAlumno = (alumnoId: number, updatedData: Partial<Alumno>) => {
    const updatedGrupos = grupos.map((grupo) => {
      if (grupo.id === activeTab) {
        return {
          ...grupo,
          alumnos: grupo.alumnos.map((alumno) =>
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
        if (grupo.id === activeTab) {
          return {
            ...grupo,
            alumnos: grupo.alumnos.filter(
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
    ? grupos.find((grupo) => grupo.id === activeTab)
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

      <div className="content-card">
        {grupos.length === 0 ? (
          <div className="empty-state">
            <h3 className="card-title">¡Empieza a organizar tus grupos!</h3>
            <p className="section-subtitle">
              Crea tu primer grupo para registrar a tus alumnos y empezar a
              gestionar su información.
            </p>
            <button
              className="add-group-btn large-btn"
              onClick={handleAddGrupo}
            >
              + Crear mi primer Grupo
            </button>
          </div>
        ) : (
          <>
            <div className="tabs-header">
              <div className="flex-grow flex items-center">
                {grupos.map((grupo) => (
                  <div key={grupo.id} className="tab-wrapper">
                    <button
                      className={`tab-button ${
                        activeTab === grupo.id ? "active" : ""
                      }`}
                      onClick={() => {
                        setActiveTab(grupo.id);
                        setEditingGroupId(null);
                      }}
                    >
                      {editingGroupId === grupo.id ? (
                        <input
                          type="text"
                          ref={inputRef}
                          value={grupo.nombre}
                          onChange={(e) =>
                            handleEditGroupName(grupo.id, e.target.value)
                          }
                          onBlur={() => setEditingGroupId(null)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              setEditingGroupId(null);
                            }
                          }}
                        />
                      ) : (
                        <span onDoubleClick={() => setEditingGroupId(grupo.id)}>
                          {grupo.nombre}
                        </span>
                      )}
                    </button>
                  </div>
                ))}
              </div>
              <button className="add-group-btn" onClick={handleAddGrupo}>
                + Nuevo Grupo
              </button>
            </div>

            {activeGrupo && (
              <div className="tab-content">
                <h3 className="card-title mt-4">
                  Alumnos del {activeGrupo.nombre}
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
                      {activeGrupo.alumnos.length > 0 ? (
                        activeGrupo.alumnos.map((alumno) => (
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
                                onClick={() => handleEditAlumno(alumno.id, {})}
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

                {/* Botón de eliminar grupo movido aquí */}
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
        )}
      </div>

      {/* Modal de confirmación para eliminar alumno */}
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

      {/* Nuevo Modal de confirmación para eliminar grupo */}
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
              {groupToDelete?.nombre}"? Esta acción no se puede deshacer.
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
