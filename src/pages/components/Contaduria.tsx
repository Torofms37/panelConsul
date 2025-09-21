import React from "react";
import "../../styles/contaduria.css";

// Usaremos un tipo de dato simple para el estado de pago del alumno.
type PaymentStatus = "paid" | "partial" | "unpaid";

// Datos de prueba para simular 10 alumnos
const alumnos = [
  {
    id: 1,
    nombre: "Ana Gómez",
    grupo: "Grupo 1",
    status: "paid",
    pagoMonto: 1000,
    pagoTotal: 1000,
  },
  {
    id: 2,
    nombre: "Luis Pérez",
    grupo: "Grupo 2",
    status: "unpaid",
    pagoMonto: 0,
    pagoTotal: 1200,
  },
  {
    id: 3,
    nombre: "Sofía Díaz",
    grupo: "Grupo 1",
    status: "partial",
    pagoMonto: 500,
    pagoTotal: 1000,
  },
  {
    id: 4,
    nombre: "Carlos Ruiz",
    grupo: "Grupo 3",
    status: "paid",
    pagoMonto: 1500,
    pagoTotal: 1500,
  },
  {
    id: 5,
    nombre: "Laura Martínez",
    grupo: "Grupo 2",
    status: "paid",
    pagoMonto: 1000,
    pagoTotal: 1000,
  },
  {
    id: 6,
    nombre: "Diego López",
    grupo: "Grupo 1",
    status: "unpaid",
    pagoMonto: 0,
    pagoTotal: 1000,
  },
  {
    id: 7,
    nombre: "Valeria Castro",
    grupo: "Grupo 3",
    status: "partial",
    pagoMonto: 250,
    pagoTotal: 1000,
  },
  {
    id: 8,
    nombre: "Javier Torres",
    grupo: "Grupo 1",
    status: "paid",
    pagoMonto: 1000,
    pagoTotal: 1000,
  },
  {
    id: 9,
    nombre: "Elena Vargas",
    grupo: "Grupo 2",
    status: "paid",
    pagoMonto: 1200,
    pagoTotal: 1200,
  },
  {
    id: 10,
    nombre: "Mario Sánchez",
    grupo: "Grupo 3",
    status: "unpaid",
    pagoMonto: 0,
    pagoTotal: 1500,
  },
];

export const Contaduria = () => {
  // Calculamos los ingresos totales y pendientes
  const totalIngresos = alumnos.reduce(
    (sum, alumno) => sum + alumno.pagoMonto,
    0
  );
  const totalIngresosPendientes = alumnos.reduce(
    (sum, alumno) => sum + (alumno.pagoTotal - alumno.pagoMonto),
    0
  );

  // Contamos el número de alumnos por estado de pago
  const paidCount = alumnos.filter((a) => a.status === "paid").length;
  const partialCount = alumnos.filter((a) => a.status === "partial").length;
  const unpaidCount = alumnos.filter((a) => a.status === "unpaid").length;
  const totalAlumnos = alumnos.length;

  const getStatusText = (status: PaymentStatus) => {
    switch (status) {
      case "paid":
        return "Pagado";
      case "partial":
        return "Pago parcial";
      case "unpaid":
        return "Sin pagar";
      default:
        return "Desconocido";
    }
  };

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
                  <th>Pagos</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {alumnos.map((alumno) => (
                  <tr key={alumno.id}>
                    <td>{alumno.id}</td>
                    <td>{alumno.nombre}</td>
                    <td>{alumno.grupo}</td>
                    <td>
                      ${alumno.pagoMonto} - ${alumno.pagoTotal}
                    </td>
                    <td
                      className={`payment-status payment-status-${alumno.status}`}
                    >
                      {alumno.status === "paid" && "✔️"}
                      {alumno.status === "partial" && "🟡"}
                      {alumno.status === "unpaid" && "❌"}
                      <span>
                        {getStatusText(alumno.status as PaymentStatus)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sección de resumen financiero - 1/4 */}
        <div className="financial-summary-section content-card">
          <h3 className="card-title">Resumen del Mes</h3>
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
            <h4 className="chart-title">Estado de pagos (alumnos)</h4>
            <div className="pie-chart-wrapper">
              <div
                className="pie-chart"
                style={{
                  background: `conic-gradient(
                    #22c55e 0% ${(paidCount / totalAlumnos) * 100}%, 
                    #f97316 ${(paidCount / totalAlumnos) * 100}% ${
                    ((paidCount + partialCount) / totalAlumnos) * 100
                  }%, 
                    #ef4444 ${
                      ((paidCount + partialCount) / totalAlumnos) * 100
                    }% 100%
                  )`,
                }}
              ></div>
            </div>
            <div className="chart-legend-bottom">
              <div className="legend-item">
                <span className="legend-dot green-dot"></span>
                Pagado ({paidCount})
              </div>
              <div className="legend-item">
                <span className="legend-dot orange-dot"></span>
                Parcial ({partialCount})
              </div>
              <div className="legend-item">
                <span className="legend-dot red-dot"></span>
                Sin pagar ({unpaidCount})
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
