import React, { useState } from "react";
import "../../styles/cursos.css";

// Interfaces de datos para mantener el código claro y tipado
interface Alumno {
  id: number;
  nombre: string;
  curso: string;
  pagado: boolean;
  debe: number;
  total: number;
}

interface Grupo {
  id: number;
  nombre: string;
  totalAlumnos: number;
  alumnos: Alumno[];
}

// Datos de prueba
const gruposDePrueba: Grupo[] = [
  {
    id: 1,
    nombre: "Lectoescritura",
    totalAlumnos: 25,
    alumnos: [
      {
        id: 101,
        nombre: "Ana G.",
        curso: "Lectoescritura",
        pagado: true,
        debe: 0,
        total: 1000,
      },
      {
        id: 102,
        nombre: "Luis P.",
        curso: "Lectoescritura",
        pagado: false,
        debe: 500,
        total: 1000,
      },
      {
        id: 103,
        nombre: "Sofía D.",
        curso: "Lectoescritura",
        pagado: true,
        debe: 0,
        total: 1000,
      },
    ],
  },
  {
    id: 2,
    nombre: "Matemáticas Avanzadas",
    totalAlumnos: 18,
    alumnos: [
      {
        id: 201,
        nombre: "Carlos R.",
        curso: "Matemáticas",
        pagado: false,
        debe: 1200,
        total: 1200,
      },
      {
        id: 202,
        nombre: "Laura M.",
        curso: "Matemáticas",
        pagado: true,
        debe: 0,
        total: 1200,
      },
    ],
  },
  {
    id: 3,
    nombre: "Inglés Principiante",
    totalAlumnos: 30,
    alumnos: [
      {
        id: 301,
        nombre: "Diego L.",
        curso: "Inglés",
        pagado: true,
        debe: 0,
        total: 800,
      },
      {
        id: 302,
        nombre: "Elena V.",
        curso: "Inglés",
        pagado: true,
        debe: 0,
        total: 800,
      },
      {
        id: 303,
        nombre: "Javier T.",
        curso: "Inglés",
        pagado: false,
        debe: 400,
        total: 800,
      },
    ],
  },
];

export const Cursos = () => {
  const [showDetails, setShowDetails] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<Grupo | null>(null);
  const [selectedAlumnos, setSelectedAlumnos] = useState<number[]>([]);
  const [showDeudorModal, setShowDeudorModal] = useState(false);
  const [alumnoToDownload, setAlumnoToDownload] = useState<Alumno | null>(null);

  const handleSelectGroup = (grupo: Grupo) => {
    setSelectedGroup(grupo);
    setShowDetails(true);
    setSelectedAlumnos([]);
  };

  const handleBackToGroups = () => {
    setShowDetails(false);
    setSelectedGroup(null);
  };

  const handleSelectAlumno = (id: number) => {
    setSelectedAlumnos((prev) =>
      prev.includes(id) ? prev.filter((aId) => aId !== id) : [...prev, id]
    );
  };

  const handleSelectAllAlumnos = () => {
    if (selectedGroup) {
      if (selectedAlumnos.length === selectedGroup.alumnos.length) {
        setSelectedAlumnos([]);
      } else {
        setSelectedAlumnos(selectedGroup.alumnos.map((a) => a.id));
      }
    }
  };

  const handleDownloadDiplomas = () => {
    if (selectedAlumnos.length > 0) {
      const deudoresSeleccionados = selectedAlumnos.some((id) => {
        const alumno = selectedGroup?.alumnos.find((a) => a.id === id);
        return alumno && !alumno.pagado;
      });

      if (deudoresSeleccionados) {
        setShowDeudorModal(true);
      } else {
        alert(
          `Descargando diplomas para los alumnos con IDs: ${selectedAlumnos.join(
            ", "
          )}`
        );
      }
    } else {
      alert(
        "Por favor, selecciona al menos un alumno para descargar diplomas."
      );
    }
  };

  const confirmDeudorDownload = () => {
    alert(
      `Descargando diplomas para deudores seleccionados: ${selectedAlumnos.join(
        ", "
      )}`
    );
    setShowDeudorModal(false);
  };

  const handleDownloadSingle = (alumno: Alumno) => {
    if (alumno.pagado) {
      alert(`Descargando diploma de ${alumno.nombre}`);
    } else {
      setAlumnoToDownload(alumno);
      setShowDeudorModal(true);
    }
  };

  return (
    <div className="w-full">
      <div className="section-header">
        <h2 className="section-title">
          <span>📚</span>
          {showDetails ? `Curso: ${selectedGroup?.nombre}` : "Mis Cursos"}
        </h2>
        <p className="section-subtitle">
          {showDetails
            ? "Detalles del grupo y alumnos"
            : "Revisa el estado general de tus cursos."}
        </p>
      </div>

      {!showDetails ? (
        <div className="groups-grid">
          {gruposDePrueba.map((grupo) => (
            <div
              key={grupo.id}
              className="group-card"
              onClick={() => handleSelectGroup(grupo)}
            >
              <h3 className="group-name">{grupo.nombre}</h3>
              <p className="group-info">
                Total de alumnos: {grupo.totalAlumnos}
              </p>
              <div className="group-actions">
                <button className="view-details-btn">Ver estado</button>
              </div>
            </div>
          ))}
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

          <div className="table-container mt-8">
            <table className="alumnos-table">
              <thead>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      onChange={handleSelectAllAlumnos}
                      checked={
                        selectedAlumnos.length ===
                          selectedGroup?.alumnos.length &&
                        selectedGroup?.alumnos.length > 0
                      }
                    />
                  </th>
                  <th>Nombre</th>
                  <th>Curso</th>
                  <th>Pagos</th>
                  <th>Descarga</th>
                </tr>
              </thead>
              <tbody>
                {selectedGroup?.alumnos.map((alumno) => (
                  <tr key={alumno.id}>
                    <td>
                      <input
                        type="checkbox"
                        onChange={() => handleSelectAlumno(alumno.id)}
                        checked={selectedAlumnos.includes(alumno.id)}
                      />
                    </td>
                    <td>{alumno.nombre}</td>
                    <td>{alumno.curso}</td>
                    <td>
                      {alumno.pagado ? (
                        <span className="pago-ok">✔️ Pagado</span>
                      ) : (
                        <span className="pago-pendiente">
                          ${alumno.debe} / ${alumno.total}
                        </span>
                      )}
                    </td>
                    <td>
                      <button
                        className="download-btn"
                        onClick={() => handleDownloadSingle(alumno)}
                      >
                        {alumno.pagado ? "Descargar" : "Pendiente"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal de confirmación para deudores */}
      {showDeudorModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowDeudorModal(false)}
        >
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-icon">⚠️</div>
            <h3 className="modal-title">Confirmar Descarga de Diplomas</h3>
            <p className="modal-text">
              Has seleccionado {alumnoToDownload ? "un alumno" : "alumnos"} con
              pago(s) pendiente(s). ¿Estás seguro de que deseas descargar{" "}
              {alumnoToDownload
                ? "el diploma de este deudor"
                : "los diplomas de los deudores seleccionados"}
              ?
            </p>
            <div className="modal-buttons">
              <button
                className="modal-btn modal-btn-cancel"
                onClick={() => setShowDeudorModal(false)}
              >
                Cancelar
              </button>
              <button
                className="modal-btn modal-btn-confirm"
                onClick={confirmDeudorDownload}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
