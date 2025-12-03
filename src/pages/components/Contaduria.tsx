import { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import "../../styles/contaduria.css";
import { Skeleton, SkeletonTable } from "./Skeleton";

// Interfaces
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
  courseCost?: number;
  students: Alumno[];
}

type PaymentStatus = "paid" | "partial" | "unpaid";

export const Contaduria = () => {
  const [grupos, setGrupos] = useState<Grupo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingStudent, setEditingStudent] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<number>(0);

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
          error.response?.data?.message || "Error al cargar los grupos."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, []);

  // Función para obtener el estado de pago
  const getPaymentStatus = (
    moneyProvided: number,
    courseCost: number
  ): PaymentStatus => {
    if (moneyProvided >= courseCost) return "paid";
    if (moneyProvided > 0) return "partial";
    return "unpaid";
  };

  // Función para obtener el texto del estado
  const getStatusText = (status: PaymentStatus) => {
    switch (status) {
      case "paid":
        return "Pagado";
      case "partial":
        return "Pago parcial";
      case "unpaid":
        return "Sin pagar";
    }
  };

  // Función para iniciar la edición
  const handleStartEdit = (studentId: string, currentMoney: number) => {
    setEditingStudent(studentId);
    setEditValue(currentMoney);
  };

  // Función para guardar la edición
  const handleSaveEdit = async (studentId: string, groupId: string) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await axios.put(
        `http://localhost:5000/api/students/${studentId}/payment`,
        { moneyProvided: editValue },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Actualizar el estado local
      setGrupos((prevGrupos) =>
        prevGrupos.map((grupo) => {
          if (grupo._id === groupId) {
            return {
              ...grupo,
              students: grupo.students.map((student) =>
                student._id === studentId
                  ? {
                      ...student,
                      moneyProvided: response.data.student.moneyProvided,
                    }
                  : student
              ),
            };
          }
          return grupo;
        })
      );

      setEditingStudent(null);
    } catch (err) {
      console.error("Error al actualizar pago:", err);
      alert("Error al actualizar el pago");
    }
  };

  // Función para cancelar la edición
  const handleCancelEdit = () => {
    setEditingStudent(null);
    setEditValue(0);
  };

  // Calcular todos los alumnos de todos los grupos con courseCost por defecto
  const allStudents = grupos.flatMap((grupo) =>
    grupo.students.map((student) => ({
      ...student,
      courseCost: grupo.courseCost || 1000,
      groupName: grupo.name,
    }))
  );

  // Calcular estadísticas
  const totalIngresos = allStudents.reduce(
    (sum, student) => sum + student.moneyProvided,
    0
  );
  const totalIngresosPendientes = allStudents.reduce(
    (sum, student) =>
      sum + Math.max(0, student.courseCost - student.moneyProvided),
    0
  );

  const totalExpected = totalIngresos + totalIngresosPendientes;
  const ingresosPercentage =
    totalExpected > 0 ? (totalIngresos / totalExpected) * 100 : 0;
  const pendientesPercentage =
    totalExpected > 0 ? (totalIngresosPendientes / totalExpected) * 100 : 0;

  const totalAlumnos = allStudents.length;

  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  if (loading) {
    return (
      <div>
        <div className="section-header">
          <h2 className="section-title">
            <span>💰</span>
            Contabilidad
          </h2>
          <p className="section-subtitle">Gestión financiera y contable</p>
        </div>

        <div className="contaduria-container">
          {/* Skeleton para la tabla de alumnos */}
          <div className="alumnos-list-section content-card">
            <h3 className="card-title">Estado de Pagos de Alumnos</h3>
            <SkeletonTable rows={8} columns={7} />
          </div>

          {/* Skeleton para el resumen financiero */}
          <div className="financial-summary-section content-card">
            <h3 className="card-title">Resumen del Mes</h3>
            <div className="summary-item">
              <Skeleton variant="text" width="60%" />
              <Skeleton variant="text" width="40%" height="2rem" />
            </div>
            <div className="summary-item">
              <Skeleton variant="text" width="60%" />
              <Skeleton variant="text" width="40%" height="2rem" />
            </div>
            <div className="summary-item">
              <Skeleton variant="text" width="60%" />
              <Skeleton variant="text" width="40%" height="2rem" />
            </div>
            <div className="chart-container">
              <Skeleton variant="text" width="80%" />
              <Skeleton variant="circular" width="150px" height="150px" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="section-header">
        <h2 className="section-title">
          <span>💰</span>
          Contabilidad
        </h2>
        <p className="section-subtitle">Gestión financiera y contable</p>
      </div>

      <div className="contaduria-container">
        {/* Sección de alumnos - 3/4 */}
        <div className="alumnos-list-section content-card">
          <h3 className="card-title">Estado de Pagos de Alumnos</h3>
          <div className="table-container">
            <table className="alumnos-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Grupo</th>
                  <th>Dinero Dado</th>
                  <th>Falta</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {grupos.map((grupo) =>
                  grupo.students.map((alumno) => {
                    const courseCost = grupo.courseCost || 1000;
                    const status = getPaymentStatus(
                      alumno.moneyProvided,
                      courseCost
                    );
                    const falta = Math.max(
                      0,
                      courseCost - alumno.moneyProvided
                    );
                    const isEditing = editingStudent === alumno._id;

                    return (
                      <tr key={alumno._id}>
                        <td>{alumno._id.slice(-6)}</td>
                        <td>{alumno.fullName}</td>
                        <td>{grupo.name}</td>
                        <td>
                          {isEditing ? (
                            <input
                              type="number"
                              value={editValue}
                              onChange={(e) =>
                                setEditValue(Number(e.target.value))
                              }
                              className="edit-input"
                              min="0"
                              max={courseCost}
                            />
                          ) : (
                            `$${alumno.moneyProvided}`
                          )}
                        </td>
                        <td>${falta}</td>
                        <td>
                          <span>{getStatusText(status)}</span>
                        </td>
                        <td>
                          {isEditing ? (
                            <div className="edit-actions">
                              <button
                                className="save-btn"
                                onClick={() =>
                                  handleSaveEdit(alumno._id, grupo._id)
                                }
                              >
                                ✓
                              </button>
                              <button
                                className="cancel-btn"
                                onClick={handleCancelEdit}
                              >
                                ✕
                              </button>
                            </div>
                          ) : (
                            <button
                              className="edit-btn"
                              onClick={() =>
                                handleStartEdit(
                                  alumno._id,
                                  alumno.moneyProvided
                                )
                              }
                            >
                              Editar
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sección de resumen financiero - 1/4 */}
        <div className="financial-summary-section content-card">
          <h3 className="card-title">Resumen del Mes</h3>
          <div className="summary-item">
            <p>Total de alumnos</p>
            <span className="total-alumnos">{totalAlumnos}</span>
          </div>
          <div className="summary-item">
            <p>Ingresos recibidos</p>
            <span className="ingresos-recibidos">${totalIngresos}</span>
          </div>
          <div className="summary-item">
            <p>Ingresos pendientes</p>
            <span className="ingresos-pendientes">
              ${totalIngresosPendientes}
            </span>
          </div>
          <div className="chart-container">
            <h4 className="chart-title">Ingresos (recibidos vs pendientes)</h4>
            <div className="pie-chart-wrapper">
              <div
                className="pie-chart"
                style={{
                  background:
                    totalExpected > 0
                      ? `conic-gradient(
                          #22c55e 0deg ${(ingresosPercentage / 100) * 360}deg,
                          #ef4444 ${(ingresosPercentage / 100) * 360}deg 360deg
                        )`
                      : "#475569",
                }}
              ></div>
            </div>
            <div className="chart-legend-bottom">
              <div className="legend-item">
                <span className="legend-dot green-dot"></span>
                Recibido: ${totalIngresos} ({ingresosPercentage.toFixed(1)}%)
              </div>
              <div className="legend-item">
                <span className="legend-dot red-dot"></span>
                Pendiente: ${totalIngresosPendientes} (
                {pendientesPercentage.toFixed(1)}%)
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
