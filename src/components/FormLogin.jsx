import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DIRECTUS_URL } from "../directus";

export default function FormLogin({ setCurrentUser }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${DIRECTUS_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (!data.data?.access_token) {
        alert("❌ Credenciales inválidas");
        setLoading(false);
        return;
      }

      const token = data.data.access_token;

      // Traer info completa del usuario
      const userRes = await fetch(`${DIRECTUS_URL}/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const userData = await userRes.json();

      let user = {
        token,
        id: userData.data.id,
        email: userData.data.email,
        firstName: userData.data.first_name || "No disponible",
        lastName: userData.data.last_name || "No disponible",
      };

      // Traer branding si existe
      const resBranding = await fetch(
        `${DIRECTUS_URL}/items/Usuarios?filter[user_id][_eq]=${user.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (resBranding.ok) {
        const brandingData = await resBranding.json();
        if (brandingData.data?.length > 0) {
          const branding = brandingData.data[0];
          user = {
            ...user,
            nombreInmobiliaria: branding.nombreInmobiliaria,
            logoInmobiliaria: branding.logoInmobiliaria,
            colorPrincipal: branding.colorPrincipal,
            colorSecundario: branding.colorSecundario,
          };
        }
      }

      // ⚡ Actualizar estado inmediatamente para mostrar Header sin refrescar
      setCurrentUser(user);
      localStorage.setItem("currentUser", JSON.stringify(user));

      // Redirigir según tenga branding o no
      navigate(
        user.colorPrincipal && user.colorSecundario ? "/inicio" : "/customizar",
        { replace: true }
      );
    } catch (err) {
      console.error(err);
      alert("❌ Error en login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="w-1/2 flex items-center justify-center p-12">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-gray-100 rounded-3xl shadow-lg p-12 space-y-10"
        >
          <h1 className="text-2xl font-semibold text-indigo-600 border-b pb-2">
            Iniciar Sesión
          </h1>

          <input
            name="email"
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 border-2 border-indigo-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />

          <input
            name="password"
            type="password"
            placeholder="Contraseña"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-3 border-2 border-indigo-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />

          <button
            type="submit"
            className="w-full bg-indigo-500 text-white p-3 rounded-lg hover:bg-indigo-600 transition"
            disabled={loading}
          >
            {loading ? "Iniciando..." : "Login"}
          </button>

          <a
            href="/"
            className="block text-center mt-2 text-indigo-400 hover:underline"
          >
            ¿No tienes cuenta? Regístrate
          </a>
        </form>
      </div>

      <div className="w-1/2 flex flex-col bg-black text-white min-h-screen">
        <div className="h-[60%] w-[50%] mx-auto flex items-center justify-center">
          <img
            src="/login-register.jpeg"
            alt="Decoración"
            className="h-full w-full object-contain"
          />
        </div>
        <div className="h-[30%] flex flex-col justify-start items-center px-8">
          <h2 className="text-3xl font-bold text-center">
            Bienvenido a tu Gestor de Contratos
          </h2>
          <p className="mt-2 text-lg text-gray-300 text-center max-w-md">
            Inicia sesión para acceder a todas las funcionalidades.
          </p>
        </div>
      </div>
    </div>
  );
}








