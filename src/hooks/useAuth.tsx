import { useState } from "react";

interface AuthUser {
  name: string | null;
  isAuthenticated: boolean;
}

const getInitialUserState = (): AuthUser => {
  const token = localStorage.getItem("token");
  const userName = localStorage.getItem("userName");

  if (token && userName) {
    return { name: userName, isAuthenticated: true };
  }
  return { name: null, isAuthenticated: false };
};

export const useAuth = () => {
  // Inicialización sincrónica: Llama a la función para establecer el estado inicial
  const [user, setUser] = useState<AuthUser>(getInitialUserState);
  
  // El useEffect es ahora opcional o se usaría solo para escuchar cambios en storage

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    setUser({ name: null, isAuthenticated: false });
    // Aquí puedes añadir la redirección
  };

  return { user, logout };
};
