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
      const userRes = await fetch(`${DIRECTUS_URL}/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const userData = await userRes.json();

      const user = {
        token,
        id: userData.data.id,
        email: userData.data.email,
        firstName: userData.data.first_name || "No disponible",
        lastName: userData.data.last_name || "No disponible",
      };

      setCurrentUser(user);
      localStorage.setItem("currentUser", JSON.stringify(user));
      alert("✅ Login exitoso");

      navigate("/inicio");
    } catch (err) {
      console.error(err);
      alert("❌ Error en login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto bg-gray-100 rounded-3xl shadow-lg p-8 pt-12 space-y-6"
    >
      <h1 className="text-2xl font-semibold text-indigo-600 border-b pb-2 text-center">
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
        href="/register"
        className="block text-center mt-2 text-indigo-400 hover:underline"
      >
        ¿No tienes cuenta? Regístrate
      </a>
    </form>
  );
}





