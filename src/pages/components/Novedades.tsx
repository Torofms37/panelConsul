import React, { useState, useEffect } from "react";
import "../../styles/novedades.css";
import { SkeletonCard } from "./Skeleton";

interface Novedad {
  id: number;
  titulo: string;
  contenido: string;
  tipo: "normal" | "urgente";
}

const initialNovedades: Novedad[] = [
  {
    id: 1,
    titulo: "Fin de Curso",
    contenido:
      "Quedan 10 días para que el curso de Inglés Avanzado finalice. Asegúrate de completar todas las tareas a tiempo.",
    tipo: "normal",
  },
  {
    id: 2,
    titulo: "Pagos Pendientes - Lectoescritura",
    contenido:
      "20 de los 30 alumnos de lectoescritura han pagado. El resto tiene el pago pendiente.",
    tipo: "normal",
  },
  {
    id: 3,
    titulo: "Asistencia - Clases de Tarde",
    contenido:
      "2 niños no han asistido al 67% de las clases de la tarde. Revisa sus registros para más detalles.",
    tipo: "normal",
  },
];

export const Novedades = () => {
  const [novedades, setNovedades] = useState<Novedad[]>([]);
  const [loading, setLoading] = useState(true);

  // Simular carga inicial
  useEffect(() => {
    const timer = setTimeout(() => {
      setNovedades(initialNovedades);
      setLoading(false);
    }, 800); // Simula un pequeño delay de carga

    return () => clearTimeout(timer);
  }, []);

  const handleToggleUrgencia = (id: number) => {
    setNovedades(
      novedades.map((novedad) =>
        novedad.id === id
          ? {
              ...novedad,
              tipo: novedad.tipo === "urgente" ? "normal" : "urgente",
            }
          : novedad
      )
    );
  };

  const handleDeleteNovedad = (id: number) => {
    setNovedades(novedades.filter((novedad) => novedad.id !== id));
  };

  const novedadesUrgentes = novedades.filter(
    (novedad) => novedad.tipo === "urgente"
  );
  const novedadesNormales = novedades.filter(
    (novedad) => novedad.tipo === "normal"
  );

  if (loading) {
    return (
      <div>
        <div className="section-header">
          <h2 className="section-title">
            <span>📰</span>
            Novedades
          </h2>
          <p className="section-subtitle">
            Últimas actualizaciones y noticias del sistema
          </p>
        </div>

        <div className="normal-container">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="section-header">
        <h2 className="section-title">
          <span>📰</span>
          Novedades
        </h2>
        <p className="section-subtitle">
          Últimas actualizaciones y noticias del sistema
        </p>
      </div>

      {novedadesUrgentes.length > 0 && (
        <div className="urgent-container">
          <h3 className="urgent-title">¡Atención, Noticia Urgente!</h3>
          {novedadesUrgentes.map((novedad) => (
            <div key={novedad.id} className="urgent-card">
              <h4 className="urgent-card-title">{novedad.titulo}</h4>
              <p className="urgent-card-content">{novedad.contenido}</p>
              <div className="action-buttons">
                <button
                  onClick={() => handleToggleUrgencia(novedad.id)}
                  className="urgent-btn-cancel"
                >
                  Marcar como Normal
                </button>
                <button
                  onClick={() => handleDeleteNovedad(novedad.id)}
                  className="delete-btn"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="normal-container">
        {novedadesNormales.length > 0 ? (
          novedadesNormales.map((novedad) => (
            <div key={novedad.id} className="content-card">
              <h3 className="card-title">{novedad.titulo}</h3>
              <div className="card-content">
                <p>{novedad.contenido}</p>
              </div>
              <div className="action-buttons">
                <button
                  onClick={() => handleToggleUrgencia(novedad.id)}
                  className="urgent-btn"
                >
                  Marcar como Urgente
                </button>
                <button
                  onClick={() => handleDeleteNovedad(novedad.id)}
                  className="delete-btn"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <p className="section-subtitle">No hay noticias pendientes.</p>
          </div>
        )}
      </div>
    </div>
  );
};
