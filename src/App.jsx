import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import CardsPrincipales from "./components/CardsPrincipales";
import FormContrato from "./components/FormContrato";
import Buscar from "./pages/Buscar";
import { Header } from "./components/Header";
import Footer from "./components/Footer";
import FormRegister from "./components/FormRegister";
import FormLogin from "./components/FormLogin";
import Perfil from "./pages/Perfil";
import { DIRECTUS_URL } from "./directus";
import "./index.css";

// Componente para páginas protegidas
function ProtectedPage({ currentUser, children }) {
  if (!currentUser) {
    return (
      <div className="text-center text-white mt-20">
        <h1 className="text-2xl font-bold">No has iniciado sesión</h1>
        <a
          href="/login"
          className="mt-4 inline-block bg-indigo-500 px-4 py-2 rounded hover:bg-indigo-600"
        >
          Ir a Login
        </a>
      </div>
    );
  }
  return children;
}

export default function App() {
  const [contratos, setContratos] = useState(
    JSON.parse(localStorage.getItem("contratos") || "[]")
  );

  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("currentUser") || "null")
  );

  // ⚡ Verificar usuario al cargar la app
  useEffect(() => {
    if (!currentUser?.token) return;

    fetch(`${DIRECTUS_URL}/users/me`, {
      headers: { Authorization: `Bearer ${currentUser.token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Usuario no existe");
        return res.json();
      })
      .catch(() => {
        setCurrentUser(null);
        localStorage.removeItem("currentUser");
      });
  }, []);

  const agregarContrato = (nuevo) => {
    const nuevos = [...contratos, nuevo];
    setContratos(nuevos);
    localStorage.setItem("contratos", JSON.stringify(nuevos));
  };

  const handleLogin = (user) => {
    setCurrentUser(user);
    localStorage.setItem("currentUser", JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem("currentUser");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header isLoggedIn={!!currentUser} currentUser={currentUser} />

      <main className="flex-1 pt-28 pb-28 bg-gray-900">
        <Routes>
          <Route
            path="/inicio"
            element={
              <ProtectedPage currentUser={currentUser}>
                <CardsPrincipales currentUser={currentUser} />
              </ProtectedPage>
            }
          />
          <Route
            path="/contrato"
            element={
              <ProtectedPage currentUser={currentUser}>
                <FormContrato onAgregar={agregarContrato} currentUser={currentUser} />
              </ProtectedPage>
            }
          />
          <Route
            path="/buscar"
            element={
              <ProtectedPage currentUser={currentUser}>
                <Buscar currentUser={currentUser} />
              </ProtectedPage>
            }
          />
          <Route path="/" element={<FormRegister />} />
          <Route path="/login" element={<FormLogin setCurrentUser={handleLogin} />} />
          <Route
            path="/perfil"
            element={
              <ProtectedPage currentUser={currentUser}>
                <Perfil currentUser={currentUser} onLogout={handleLogout} />
              </ProtectedPage>
            }
          />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}







