import { useState } from "react";

interface AuthUser {
  id: string | null;
  name: string | null;
  role: "admin" | "teacher" | null;
  isAuthenticated: boolean;
}

const getInitialUserState = (): AuthUser => {
  const token = localStorage.getItem("token");
  const userName = localStorage.getItem("userName");
  const userRole = localStorage.getItem("userRole") as
    | "admin"
    | "teacher"
    | null;
  const userId = localStorage.getItem("userId");

  if (token && userName) {
    return {
      id: userId,
      name: userName,
      role: userRole,
      isAuthenticated: true,
    };
  }
  return { id: null, name: null, role: null, isAuthenticated: false };
};

export const useAuth = () => {
  // Inicialización sincrónica: Llama a la función para establecer el estado inicial
  const [user, setUser] = useState<AuthUser>(getInitialUserState);

  // El useEffect es ahora opcional o se usaría solo para escuchar cambios en storage

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userId");
    setUser({ id: null, name: null, role: null, isAuthenticated: false });
    // Aquí puedes añadir la redirección
  };

  return { user, logout };
};
