import React, { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import { Link, useNavigate } from "react-router-dom"; // Se corrigió el import de Link

// Define el tipo para el estado del formulario
interface FormState {
  name: string;
  email: string;
  password: string;
}

// Estilos del mouse parallax (solo para efectos visuales)
const useParallaxEffect = () => {
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const elements = document.querySelectorAll<HTMLElement>(".bg-element");
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;

      elements.forEach((element, index) => {
        const speed = (index + 1) * 0.5;
        const xPos = (x - 0.5) * speed * 20;
        const yPos = (y - 0.5) * speed * 20;
        element.style.transform = `translate(${xPos}px, ${yPos}px)`;
      });
    };

    document.addEventListener("mousemove", handleMouseMove);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);
};

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  useParallaxEffect();

  const [formData, setFormData] = useState<FormState>({
    name: "",
    email: "",
    password: "",
  });

  const [confirmPassword, setConfirmPassword] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Función de validación de la contraseña
  const validatePassword = (password: string): string | null => {
    if (password.length < 8) {
      return "La contraseña debe tener al menos 8 caracteres.";
    }
    if (!/[A-Z]/.test(password)) {
      return "Debe contener al menos una letra mayúscula.";
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return "Debe contener al menos un signo o carácter especial.";
    }
    return null;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = e.target;

    if (name === "confirmPassword") {
      setConfirmPassword(value);
    } else if (name === "terms") {
      setTermsAccepted(checked);
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("Registrando usuario...");
    setLoading(true);

    if (formData.password !== confirmPassword) {
      setMessage("Error: Las contraseñas no coinciden.");
      setLoading(false);
      return;
    }
    if (!termsAccepted) {
      setMessage("Error: Debe aceptar los términos y condiciones.");
      setLoading(false);
      return;
    }

    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      setMessage(`Error de contraseña: ${passwordError}`);
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/register",
        formData
      );

      setMessage(response.data.message);

      setTimeout(() => {
        navigate("/pending-approval");
      }, 1500);
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;

      setMessage(
        error.response?.data?.message || "Error al conectar con el servidor."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="bg-element"></div>
      <div className="bg-element"></div>
      <div className="bg-element"></div>

      <div className="login-container">
        <h1 className="login-title">Registrar una cuenta</h1>

        {message && <div className="login-message">{message}</div>}

        <form id="registerForm" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name" className="form-label">
              Nombre del profesor/a
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className="form-input"
              placeholder="Profesor escriba su nombre aquí"
              required
              value={formData.name}
              onChange={handleChange}
            />
          </div>

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
              autoComplete="username"
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
              autoComplete="new-password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">
              Confirmar contraseña
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              className="form-input"
              placeholder="••••••••"
              required
              autoComplete="new-password"
              value={confirmPassword}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="terms" className="form-label register-label-terms">
              <input
                type="checkbox"
                id="terms"
                name="terms"
                className="form-checkbox"
                checked={termsAccepted}
                onChange={handleChange}
                required // Aunque lo manejamos por estado, es buena práctica mantenerlo en HTML
              />
              Acepto los términos y condiciones
            </label>
          </div>

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? "Creando Cuenta..." : "Crear Cuenta"}
          </button>

          <Link to="/" className="w-full text-center mt-3 block">
            <span className="text-blue-200 font-extralight hover:underline">
              Ya tengo una cuenta
            </span>
          </Link>
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

export default RegisterPage;
