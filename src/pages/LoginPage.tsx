import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";

// Define el tipo para el estado del formulario para una mejor tipificación con TypeScript
interface FormState {
  email: string;
  password: string;
}

// Define el componente funcional con la tipificación de React.FC
const LoginPage: React.FC = () => {
  const [formData, setFormData] = useState<FormState>({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState(""); // Estado para mensajes de éxito/error
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Mantén solo esta versión de handleSubmit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("Iniciando sesión...");

    try {
      const response = await axios.post(
        "http://localhost:5000/api/login",
        formData
      );
      setMessage(response.data.message);
      console.log(response.data);
      // Si el login es exitoso, navega al homepage
      if (response.data.success) {
        navigate("/home");
      }
    } catch (error: any) {
      setMessage(error.response?.data?.message || "Error de conexión.");
      console.error(error.response?.data);
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const elements = document.querySelectorAll(".bg-element");
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;

      elements.forEach((element, index) => {
        const speed = (index + 1) * 0.5;
        const xPos = (x - 0.5) * speed * 20;
        const yPos = (y - 0.5) * speed * 20;
        (element as HTMLElement).style.transform = `translate(${xPos}px, ${yPos}px)`;
      });
    };

    document.addEventListener("mousemove", handleMouseMove);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  // El componente debe retornar JSX
  return (
    <>
      <div className="bg-element"></div>
      <div className="bg-element"></div>
      <div className="bg-element"></div>

      <div className="login-container">
        <h1 className="login-title">Iniciar Sesión</h1>

        {/* Muestra el mensaje si existe */}
        {message && <div className="login-message">{message}</div>}

        <form id="loginForm" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Correo Electrónico
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-input"
              placeholder="tu@email.com"
              required
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="form-input"
              placeholder="••••••••"
              required
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="login-button">
            Entrar
          </button>
        </form>
      </div>

      <div className="footer">
        <a href="#" className="footer-button">
          ✨ Creado por Torofms37 🐂
        </a>
      </div>
    </>
  );
};

export default LoginPage;