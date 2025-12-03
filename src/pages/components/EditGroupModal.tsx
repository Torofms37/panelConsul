import React, { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import "../../styles/calendario.css";

// Interfaces
export interface Alumno {
  id: string;
  nombre: string;
  dineroEntregado: number;
}

export interface Grupo {
  _id: string;
  name: string;
  teacherName: string;
  fechaInicio: string;
  fechaTermino: string;
  courseCost?: number;
  students: Alumno[];
  course?: any;
}

interface NuevoAlumnoData {
  nombre: string;
  dineroEntregado: number;
}

interface EditGroupModalProps {
  group: Grupo | null;
  isOpen: boolean;
  onClose: () => void;
  onGroupUpdated: (updatedGroup: Grupo) => void;
}

export const EditGroupModal: React.FC<EditGroupModalProps> = ({
  group,
  isOpen,
  onClose,
  onGroupUpdated,
}) => {
  const [editingGroup, setEditingGroup] = useState<Grupo | null>(null);
  const [loading, setLoading] = useState(false);

  // Estados para editar alumno existente en el modal
  const [editingStudentInModal, setEditingStudentInModal] = useState<
    string | null
  >(null);
  const [studentEditValues, setStudentEditValues] = useState<NuevoAlumnoData>({
    nombre: "",
    dineroEntregado: 0,
  });

  // Estados para agregar alumno a grupo existente
  const [addingStudentToGroup, setAddingStudentToGroup] =
    useState<boolean>(false);
  const [newStudentForGroup, setNewStudentForGroup] = useState<NuevoAlumnoData>(
    {
      nombre: "",
      dineroEntregado: 0,
    }
  );

  useEffect(() => {
    setEditingGroup(group);
  }, [group]);

  if (!isOpen || !editingGroup) return null;

  const getAuthConfig = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  // Guardar cambios del grupo (Nombre y Costo)
  const handleSaveGroupEdit = async () => {
    if (!editingGroup) return;

    setLoading(true);
    const config = getAuthConfig();
    if (!config) return;

    try {
      const response = await axios.put(
        `http://localhost:5000/api/groups/${editingGroup._id}`,
        {
          name: editingGroup.name,
          courseCost: editingGroup.courseCost,
        },
        config
      );

      const updatedGroup = { ...editingGroup, ...response.data.group };
      onGroupUpdated(updatedGroup);
      alert("Grupo actualizado exitosamente.");
      onClose();
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      alert(error.response?.data?.message || "Error al actualizar el grupo.");
    } finally {
      setLoading(false);
    }
  };

  // Editar alumno en grupo existente
  const handleEditStudentInGroup = (student: Alumno) => {
    setEditingStudentInModal(student.id);
    setStudentEditValues({
      nombre: student.nombre,
      dineroEntregado: student.dineroEntregado,
    });
  };

  const handleSaveStudentEdit = async (studentId: string) => {
    if (!editingGroup) return;
    setLoading(true);
    const config = getAuthConfig();
    if (!config) return;

    try {
      await axios.put(
        `http://localhost:5000/api/groups/${editingGroup._id}/students/${studentId}`,
        {
          fullName: studentEditValues.nombre,
          moneyProvided: studentEditValues.dineroEntregado,
        },
        config
      );

      const updatedStudents = editingGroup.students.map((s) =>
        s.id === studentId
          ? {
              ...s,
              nombre: studentEditValues.nombre,
              dineroEntregado: studentEditValues.dineroEntregado,
            }
          : s
      );

      const updatedGroup = { ...editingGroup, students: updatedStudents };
      setEditingGroup(updatedGroup);
      onGroupUpdated(updatedGroup); // Actualizar padre en tiempo real también
      setEditingStudentInModal(null);
      alert("Alumno actualizado exitosamente.");
    } catch (err) {
      console.error(err);
      alert("Error al actualizar el alumno.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteStudentFromGroup = async (studentId: string) => {
    if (!editingGroup || !window.confirm("¿Eliminar este alumno del grupo?"))
      return;
    setLoading(true);
    const config = getAuthConfig();
    if (!config) return;

    try {
      await axios.delete(
        `http://localhost:5000/api/groups/${editingGroup._id}/students/${studentId}`,
        config
      );

      const updatedStudents = editingGroup.students.filter(
        (s) => s.id !== studentId
      );
      const updatedGroup = { ...editingGroup, students: updatedStudents };
      setEditingGroup(updatedGroup);
      onGroupUpdated(updatedGroup);
      alert("Alumno eliminado exitosamente.");
    } catch (err) {
      console.error(err);
      alert("Error al eliminar el alumno.");
    } finally {
      setLoading(false);
    }
  };

  // Agregar alumno a grupo existente
  const handleAddStudentToExistingGroup = async () => {
    if (!newStudentForGroup.nombre.trim()) {
      alert("El nombre del alumno es obligatorio.");
      return;
    }

    setLoading(true);
    const config = getAuthConfig();
    if (!config) return;

    try {
      const response = await axios.post(
        `http://localhost:5000/api/groups/${editingGroup._id}/students`,
        newStudentForGroup,
        config
      );

      const newStudent = response.data.student;
      const studentMapped: Alumno = {
        id: newStudent._id,
        nombre: newStudent.fullName,
        dineroEntregado: newStudent.moneyProvided,
      };

      const updatedGroup = {
        ...editingGroup,
        students: [...editingGroup.students, studentMapped],
      };

      setEditingGroup(updatedGroup);
      onGroupUpdated(updatedGroup);
      setAddingStudentToGroup(false);
      setNewStudentForGroup({ nombre: "", dineroEntregado: 0 });
      alert("Alumno añadido exitosamente.");
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      alert(error.response?.data?.message || "Error al añadir el alumno.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-edit-group" onClick={(e) => e.stopPropagation()}>
        <h3>Editar Grupo: {editingGroup.name}</h3>

        <div className="form-group">
          <label>Nombre del Grupo</label>
          <input
            type="text"
            value={editingGroup.name}
            onChange={(e) =>
              setEditingGroup((prev) =>
                prev ? { ...prev, name: e.target.value } : null
              )
            }
            className="form-input-style"
          />
        </div>

        <div className="form-group">
          <label>Costo Total del Curso</label>
          <input
            type="number"
            value={editingGroup.courseCost || 1000}
            onChange={(e) =>
              setEditingGroup((prev) =>
                prev
                  ? {
                      ...prev,
                      courseCost: parseInt(e.target.value, 10) || 0,
                    }
                  : null
              )
            }
            className="form-input-style"
          />
        </div>

        <h4>Alumnos del Grupo</h4>
        <table className="students-edit-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Dinero Entregado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {editingGroup.students.map((student) => (
              <tr key={student.id}>
                <td>
                  {editingStudentInModal === student.id ? (
                    <input
                      type="text"
                      value={studentEditValues.nombre}
                      onChange={(e) =>
                        setStudentEditValues((prev) => ({
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
                  {editingStudentInModal === student.id ? (
                    <input
                      type="number"
                      value={studentEditValues.dineroEntregado}
                      onChange={(e) =>
                        setStudentEditValues((prev) => ({
                          ...prev,
                          dineroEntregado: parseInt(e.target.value, 10) || 0,
                        }))
                      }
                      className="edit-input-small"
                    />
                  ) : (
                    `$${student.dineroEntregado}`
                  )}
                </td>
                <td>
                  {editingStudentInModal === student.id ? (
                    <>
                      <button
                        className="save-btn-small"
                        onClick={() => handleSaveStudentEdit(student.id)}
                      >
                        ✓
                      </button>
                      <button
                        className="cancel-btn-small"
                        onClick={() => setEditingStudentInModal(null)}
                      >
                        ✕
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="edit-btn-small"
                        onClick={() => handleEditStudentInGroup(student)}
                      >
                        Editar
                      </button>
                      <button
                        className="delete-btn-small"
                        onClick={() => handleDeleteStudentFromGroup(student.id)}
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

        {addingStudentToGroup ? (
          <div className="add-student-form">
            <input
              type="text"
              placeholder="Nombre del alumno"
              value={newStudentForGroup.nombre}
              onChange={(e) =>
                setNewStudentForGroup((prev) => ({
                  ...prev,
                  nombre: e.target.value,
                }))
              }
              className="form-input-style"
            />
            <input
              type="number"
              placeholder="Dinero entregado"
              value={newStudentForGroup.dineroEntregado || ""}
              onChange={(e) =>
                setNewStudentForGroup((prev) => ({
                  ...prev,
                  dineroEntregado: parseInt(e.target.value, 10) || 0,
                }))
              }
              className="form-input-style"
            />
            <button
              className="save-btn"
              onClick={handleAddStudentToExistingGroup}
            >
              Guardar Alumno
            </button>
            <button
              className="cancel-btn"
              onClick={() => setAddingStudentToGroup(false)}
            >
              Cancelar
            </button>
          </div>
        ) : (
          <button
            className="add-student-btn"
            onClick={() => setAddingStudentToGroup(true)}
          >
            + Agregar Alumno
          </button>
        )}

        <div className="modal-actions">
          <button className="cancel-btn" onClick={onClose}>
            Cerrar
          </button>
          <button
            className="save-btn"
            onClick={handleSaveGroupEdit}
            disabled={loading}
          >
            {loading ? "Guardando..." : "Guardar Cambios"}
          </button>
        </div>
      </div>
    </div>
  );
};
