import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DIRECTUS_URL, TOKEN } from "../directus";

export default function FormRegister() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password || !formData.firstName || !formData.lastName) {
      alert("❌ Completa todos los campos");
      return;
    }

    try {
      const res = await fetch(`${DIRECTUS_URL}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${TOKEN}`,
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          first_name: formData.firstName,
          last_name: formData.lastName,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("✅ Usuario creado correctamente");
        navigate("/login"); // redirige al login
        setFormData({ email: "", password: "", firstName: "", lastName: "" });
      } else {
        console.error(data);
        alert(`❌ Error al crear usuario: ${data.errors?.[0]?.message || JSON.stringify(data)}`);
      }
    } catch (err) {
      console.error(err);
      alert("❌ Error en la petición");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto bg-gray-100 rounded-3xl shadow-lg p-8 pt-12 space-y-10"
    >
      <h1 className="text-2xl font-semibold text-indigo-600 border-b pb-2">
        Registrar Usuario
      </h1>

      <input
        type="text"
        name="firstName"
        placeholder="Nombre"
        value={formData.firstName}
        onChange={handleChange}
        className="w-full p-3 border-2 border-indigo-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      <input
        type="text"
        name="lastName"
        placeholder="Apellido"
        value={formData.lastName}
        onChange={handleChange}
        className="w-full p-3 border-2 border-indigo-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        className="w-full p-3 border-2 border-indigo-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      <input
        type="password"
        name="password"
        placeholder="Contraseña"
        value={formData.password}
        onChange={handleChange}
        className="w-full p-3 border-2 border-indigo-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />

      <button
        type="submit"
        className="w-full bg-indigo-500 text-white p-3 rounded-lg hover:bg-indigo-600 transition"
      >
        Registrar
      </button>

      <a
        href="/login"
        className="block text-center mt-2 text-indigo-400 hover:underline"
      >
        ¿Ya tienes cuenta?
      </a>
    </form>
  );
}



