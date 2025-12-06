import React, { useEffect } from "react";
import { Link } from "react-router";

const PendingApprovalPage: React.FC = () => {
  useEffect(() => {
    // Optional: Background effect similar to login
    const handleMouseMove = (e: MouseEvent) => {
      const elements = document.querySelectorAll(".bg-element");
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;

      elements.forEach((element, index) => {
        const speed = (index + 1) * 0.5;
        const xPos = (x - 0.5) * speed * 20;
        const yPos = (y - 0.5) * speed * 20;
        (
          element as HTMLElement
        ).style.transform = `translate(${xPos}px, ${yPos}px)`;
      });
    };

    document.addEventListener("mousemove", handleMouseMove);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 overflow-hidden relative font-['Segoe_UI']">
      {/* Background Elements */}
      <div className="bg-element fixed top-20 left-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
      <div className="bg-element fixed bottom-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>

      <div className="relative z-10 max-w-lg w-full bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 md:p-12 shadow-2xl text-center">
        <div className="w-24 h-24 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner ring-4 ring-slate-800">
          <span className="text-5xl">⏳</span>
        </div>

        <h1 className="text-3xl font-bold text-white mb-4">Acceso Pendiente</h1>

        <p className="text-slate-300 text-lg leading-relaxed mb-8">
          Tu cuenta ha sido creada exitosamente, pero requiere validación por
          parte de la administración antes de poder acceder a la plataforma.
        </p>

        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6 mb-8">
          <p className="text-blue-200 font-medium">
            Por favor, espera a que validen tu acceso o comunícate directamente
            con el{" "}
            <span className="font-bold text-blue-100">Profesor Josué</span> para
            agilizar el proceso.
          </p>
        </div>

        <Link
          to="/"
          className="inline-flex items-center gap-2 px-8 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-semibold transition-all hover:scale-105"
        >
          <span>←</span> Volver al Inicio
        </Link>
      </div>

      <div className="absolute bottom-6 text-center w-full text-slate-600 text-sm">
        Sistema de Gestión Escolar
      </div>
    </div>
  );
};

export default PendingApprovalPage;
