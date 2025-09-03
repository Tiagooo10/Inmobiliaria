import { useEffect, useState } from "react";
import { DIRECTUS_URL } from "../directus";

export default function Perfil({ currentUser, onLogout }) {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (!currentUser?.token) return;

    fetch(`${DIRECTUS_URL}/users/me`, {
      headers: { Authorization: `Bearer ${currentUser.token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Usuario no existe");
        return res.json();
      })
      .then((data) => setUserData(data.data))
      .catch(() => {
        alert("Usuario eliminado o sesión inválida. Cerrando sesión...");
        onLogout();
      });
  }, [currentUser, onLogout]);

  if (!currentUser) {
    return (
      <div className="text-center text-white mt-20">
        <h1 className="text-2xl font-bold">No has iniciado sesión</h1>
        <a href="/login" className="mt-4 inline-block bg-indigo-500 px-4 py-2 rounded hover:bg-indigo-600">
          Ir a Login
        </a>
      </div>
    );
  }

  if (!userData) {
    return <div className="text-center text-white mt-20">Cargando datos del usuario...</div>;
  }

  return (
    <div className="max-w-lg mx-auto bg-gray-800 text-white p-8 rounded-2xl shadow-lg mt-20">
      <h1 className="text-3xl font-bold mb-6">Perfil de usuario</h1>
      <p><strong>Nombre:</strong> {currentUser?.nombreInmobiliaria || "Inmobiliaria App"}</p>

      <button
        onClick={onLogout}
        className="mt-6 w-full bg-red-600 px-4 py-2 rounded hover:bg-red-700"
      >
        Cerrar sesión
      </button>
    </div>
  );
}







