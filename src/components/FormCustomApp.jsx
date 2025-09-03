import { useState, useEffect } from "react";
import { DIRECTUS_URL } from "../directus";

export default function FormCustomApp({ currentUser, onBrandingSaved }) {
  const [formData, setFormData] = useState({
    id: null, // id del branding en Directus
    nombreInmobiliaria: "",
    logoInmobiliaria: null,
    colorPrincipal: "#4f46e5",  // valor por defecto indigo
    colorSecundario: "#f9fafb", // valor por defecto gris claro
  });
  const [loading, setLoading] = useState(false);

  // ⚡ Traer branding existente
  useEffect(() => {
    if (!currentUser?.token) return;

    async function fetchBranding() {
      try {
        const res = await fetch(
          `${DIRECTUS_URL}/items/Usuarios?filter[user_id][_eq]=${currentUser.id}`,
          {
            headers: { Authorization: `Bearer ${currentUser.token}` },
          }
        );
        if (!res.ok) throw new Error("Error cargando branding");
        const data = await res.json();
        if (data.data?.length > 0) {
          const userBranding = data.data[0];
          setFormData({
            id: userBranding.id,
            nombreInmobiliaria: userBranding.nombreInmobiliaria || "",
            logoInmobiliaria: userBranding.logoInmobiliaria || null,
            colorPrincipal: userBranding.colorPrincipal || "#4f46e5",
            colorSecundario: userBranding.colorSecundario || "#f9fafb",
          });
        }
      } catch (err) {
        console.error("Error cargando branding:", err);
      }
    }

    fetchBranding();
  }, [currentUser]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const uploadLogo = async () => {
    if (!formData.logoInmobiliaria || typeof formData.logoInmobiliaria === "string") 
      return formData.logoInmobiliaria;
    
    const fileData = new FormData();
    fileData.append("file", formData.logoInmobiliaria);

    try {
      const res = await fetch(`${DIRECTUS_URL}/files`, {
        method: "POST",
        headers: { Authorization: `Bearer ${currentUser.token}` },
        body: fileData,
      });
      if (!res.ok) throw new Error("Error subiendo logo");
      const data = await res.json();
      return data.data.id;
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const logoId = await uploadLogo();

      const payload = {
        user_id: currentUser.id,
        nombreInmobiliaria: formData.nombreInmobiliaria,
        logoInmobiliaria: logoId,
        colorPrincipal: formData.colorPrincipal,
        colorSecundario: formData.colorSecundario,
      };

      const res = await fetch(
        `${DIRECTUS_URL}/items/Usuarios${formData.id ? `/${formData.id}` : ""}`,
        {
          method: formData.id ? "PATCH" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${currentUser.token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) throw new Error("Error guardando branding");

      const result = await res.json();
      setFormData((prev) => ({ ...prev, id: result.data.id }));

      alert("Branding guardado correctamente!");
      
      // ⚡ Enviar datos actualizados al App.jsx
      if (onBrandingSaved) {
        onBrandingSaved({
          nombreInmobiliaria: formData.nombreInmobiliaria,
          logoInmobiliaria: logoId,
          colorPrincipal: formData.colorPrincipal,
          colorSecundario: formData.colorSecundario
        });
      }
    } catch (err) {
      console.error(err);
      alert("Error al guardar la personalización");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="w-1/2 mt-8 flex items-center justify-center p-12">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-gray-100 rounded-3xl shadow-lg p-12 space-y-10"
        >
          <h1 className="text-2xl font-semibold text-indigo-600 border-b pb-2">
            Personalizar App
          </h1>

          <input
            type="text"
            name="nombreInmobiliaria"
            placeholder="Nombre de la Inmobiliaria"
            value={formData.nombreInmobiliaria}
            onChange={handleChange}
            className="w-full p-3 border-2 border-indigo-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <div className="flex space-x-4">
            <div className="flex flex-col w-1/2">
              <label className="mb-1">Color Principal</label>
              <input
                type="color"
                name="colorPrincipal"
                value={formData.colorPrincipal}
                onChange={handleChange}
                className="w-full h-10 rounded-lg border-2 border-indigo-600 cursor-pointer"
              />
            </div>
            <div className="flex flex-col w-1/2">
              <label className="mb-1">Color Secundario</label>
              <input
                type="color"
                name="colorSecundario"
                value={formData.colorSecundario}
                onChange={handleChange}
                className="w-full h-10 rounded-lg border-2 border-indigo-600 cursor-pointer"
              />
            </div>
          </div>

          <div className="w-full">
            <label className="flex items-center justify-center p-3 border-2 border-indigo-600 rounded-lg cursor-pointer bg-white hover:bg-gray-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-indigo-500 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M12 12V4m0 0l-3 3m3-3l3 3"
                />
              </svg>
              {formData.logoInmobiliaria?.name || "Subir Logo"}
              <input
                type="file"
                name="logoInmobiliaria"
                accept="image/*"
                onChange={handleChange}
                className="hidden"
              />
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-500 text-white p-3 rounded-lg hover:bg-indigo-600 transition"
            disabled={loading}
          >
            {loading ? "Guardando..." : "Guardar"}
          </button>
        </form>
      </div>

      <div className="w-1/2 flex flex-col bg-black text-white min-h-screen">
        <div className="h-[60%] w-[60%] mx-auto flex items-center justify-center">
          <img
            src="/login-register.jpeg"
            alt="Decoración"
            className="h-full w-full object-contain"
          />
        </div>
        <div className="h-[30%] flex flex-col justify-start items-center px-8">
          <h2 className="text-3xl font-bold text-center">
            Personaliza tu experiencia
          </h2>
          <p className="mt-2 text-lg text-gray-300 text-center max-w-md">
            Configura el nombre, logo y colores de tu inmobiliaria.
          </p>
        </div>
      </div>
    </div>
  );
}





