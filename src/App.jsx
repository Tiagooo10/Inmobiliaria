import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import CardsPrincipales from "./components/CardsPrincipales";
import FormContrato from "./components/FormContrato";
import Buscar from "./pages/Buscar";
import { Header } from "./components/Header";
import Footer from "./components/Footer";
import FormRegister from "./components/FormRegister";
import FormLogin from "./components/FormLogin";
import Perfil from "./pages/Perfil";
import FormCustomApp from "./components/FormCustomApp";
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
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("currentUser") || "null")
  );
  const [customizado, setCustomizado] = useState(false);
  const [loadingUser, setLoadingUser] = useState(true);

  // ⚡ Cargar usuario + branding al iniciar la app
  useEffect(() => {
    async function fetchUser() {
      if (!currentUser?.token) {
        setLoadingUser(false);
        return;
      }

      try {
        // Traer info básica del usuario
        const resUser = await fetch(`${DIRECTUS_URL}/users/me`, {
          headers: { Authorization: `Bearer ${currentUser.token}` },
        });
        if (!resUser.ok) throw new Error("Usuario no existe");
        const userData = await resUser.json();

        let updatedUser = { ...currentUser, ...userData.data };

        // Traer branding del usuario
        const resBranding = await fetch(
          `${DIRECTUS_URL}/items/Usuarios?filter[user_id][_eq]=${currentUser.id}`,
          {
            headers: { Authorization: `Bearer ${currentUser.token}` },
          }
        );

        if (resBranding.ok) {
          const brandingData = await resBranding.json();
          if (brandingData.data?.length > 0) {
            const branding = brandingData.data[0];
            updatedUser = {
              ...updatedUser,
              nombreInmobiliaria: branding.nombreInmobiliaria,
              logoInmobiliaria: branding.logoInmobiliaria,
              colorPrincipal: branding.colorPrincipal,
              colorSecundario: branding.colorSecundario,
            };
            setCustomizado(true);
          } else {
            // Si no hay branding, marcar como no customizado
            setCustomizado(false);
          }
        }

        setCurrentUser(updatedUser);
        localStorage.setItem("currentUser", JSON.stringify(updatedUser));
      } catch (err) {
        console.error(err);
        setCurrentUser(null);
        localStorage.removeItem("currentUser");
        setCustomizado(false);
      } finally {
        setLoadingUser(false);
      }
    }

    fetchUser();
  }, []);

  const handleLogin = (user) => {
    setCurrentUser(user);
    localStorage.setItem("currentUser", JSON.stringify(user));
    // Determinar si ya tiene branding
    if (user.colorPrincipal && user.colorSecundario) {
      setCustomizado(true);
    } else {
      setCustomizado(false);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem("currentUser");
    // ⚡ No borrar la customización guardada en el usuario
  };

  const handleBrandingSaved = (newBranding) => {
    const updatedUser = { ...currentUser, ...newBranding };
    setCurrentUser(updatedUser);
    localStorage.setItem("currentUser", JSON.stringify(updatedUser));
    setCustomizado(true);
  };

  if (loadingUser) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <h1>Cargando usuario...</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-900">
      {/* Mostrar Header si está logueado y customizado */}
      {currentUser && customizado && (
        <Header
          isLoggedIn={true}
          currentUser={currentUser}
          colorPrincipal={currentUser.colorPrincipal || "#4f46e5"}
          colorSecundario={currentUser.colorSecundario || "#818cf8"}
        />
      )}

      <main className="flex-1 bg-gray-900">
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
                <FormContrato currentUser={currentUser} />
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
          <Route
            path="/login"
            element={
              currentUser ? (
                <Navigate to={customizado ? "/inicio" : "/customizar"} replace />
              ) : (
                <FormLogin setCurrentUser={handleLogin} />
              )
            }
          />
          <Route
            path="/perfil"
            element={
              <ProtectedPage currentUser={currentUser}>
                <Perfil currentUser={currentUser} onLogout={handleLogout} />
              </ProtectedPage>
            }
          />
          <Route
            path="/customizar"
            element={
              currentUser && !customizado ? (
                <FormCustomApp
                  currentUser={currentUser}
                  onBrandingSaved={handleBrandingSaved}
                />
              ) : (
                <Navigate to="/inicio" replace />
              )
            }
          />
        </Routes>
      </main>

      <Footer currentUser={currentUser} />
    </div>
  );
}
















