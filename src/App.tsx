import { Route, Routes } from "react-router";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import { Novedades } from "./pages/components/Novedades";
import { Calendario } from "./pages/components/Calendario";
import { Contaduria } from "./pages/components/Contaduria";
import { Cursos } from "./pages/components/Cursos";
import RegisterPage from "./pages/RegisterPage";

function App() {
  // El componente debe retornar JSX
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/home/novedades" element={<Novedades />} />
      <Route path="/home/calendario" element={<Calendario />} />
      <Route path="/home/contaduria" element={<Contaduria />} />
      <Route path="/home/cursos" element={<Cursos />} />
    </Routes>
  );
}

export default App;
