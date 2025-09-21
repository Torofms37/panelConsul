import { Route, Routes } from "react-router";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import { Novedades } from "./pages/components/Novedades";
import { Calendario } from "./pages/components/Calendario";
import { Contaduria } from "./pages/components/Contaduria";
import { Proyectos } from "./pages/components/Proyectos";

function App() {
  // El componente debe retornar JSX
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/home/novedades" element={<Novedades />} />
      <Route path="/home/calendario" element={<Calendario />} />
      <Route path="/home/contaduria" element={<Contaduria />} />
      <Route path="/home/proyectos" element={<Proyectos />} />
    </Routes>
  );
}

export default App;
