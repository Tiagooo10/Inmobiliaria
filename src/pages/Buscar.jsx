import { useEffect, useState } from "react";
import FormContrato from "../components/FormContrato";
import axios from "axios";

export const DIRECTUS_URL = "https://directus-1-6hgt.onrender.com";

export default function Buscar({ currentUser }) {
  const [contratos, setContratos] = useState([]);
  const [editando, setEditando] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [ordenarPorVencimiento, setOrdenarPorVencimiento] = useState(false);

  // Formatear fechas
  const formatearFecha = (fecha) => (fecha ? fecha.split("T")[0] : "");

  // Función para mostrar monto con puntos
  const mostrarMonto = (monto) => (monto ? Number(monto).toLocaleString("es-AR") : "0");

  // Traer contratos del usuario logueado
  const fetchContratos = async () => {
    if (!currentUser) return;

    try {
      const res = await axios.get(
        `${DIRECTUS_URL}/items/Contratos?filter[usuario_id][_eq]=${currentUser.id}`,
        { headers: { Authorization: `Bearer ${currentUser.token}` } }
      );

      const contratosFormateados = res.data.data.map((c) => ({
        ...c,
        fechaInicio: formatearFecha(c.fechaInicio),
        fechaFin: formatearFecha(c.fechaFin),
        montoMensual: Number(c.montoMensual) || 0, // siempre número
      }));

      setContratos(contratosFormateados);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContratos();
  }, [currentUser]);

  const borrarContrato = async (id) => {
    try {
      await axios.delete(`${DIRECTUS_URL}/items/Contratos/${id}`, {
        headers: { Authorization: `Bearer ${currentUser.token}` },
      });
      setContratos(contratos.filter((c) => c.id !== id));
    } catch (err) {
      console.error(err);
      alert("❌ Error al eliminar contrato");
    }
  };

  const guardarEdicion = async (formData) => {
    try {
      const res = await axios.patch(
        `${DIRECTUS_URL}/items/Contratos/${formData.id}`,
        formData,
        { headers: { Authorization: `Bearer ${currentUser.token}` } }
      );

      const contratoActualizado = {
        ...res.data.data,
        fechaInicio: formatearFecha(res.data.data.fechaInicio),
        fechaFin: formatearFecha(res.data.data.fechaFin),
        montoMensual: Number(res.data.data.montoMensual) || 0,
      };

      setContratos(
        contratos.map((c) => (c.id === formData.id ? contratoActualizado : c))
      );
      setEditando(null);
    } catch (err) {
      console.error(err);
      alert("❌ Error al actualizar contrato");
    }
  };

  if (loading) return <p>Cargando contratos...</p>;
  if (!currentUser) return <p>Debés iniciar sesión para ver tus contratos.</p>;
  if (editando) {
    const contrato = contratos.find((c) => c.id === editando);
    return (
      <div className="max-w-6xl mx-auto mt-6 p-6 bg-white rounded-xl shadow-lg">
        <FormContrato
          initialData={contrato}
          onCancel={() => setEditando(null)}
          currentUser={currentUser}
          onSave={guardarEdicion}
        />
      </div>
    );
  }

  // Filtrar contratos por búsqueda parcial (solo inquilino)
  let contratosFiltrados = contratos.filter((c) =>
    `${c.inquilinoNombre[0]} ${c.inquilinoApellido[0]}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  // Ordenar por vencimiento más próximo si el toggle está activo
  if (ordenarPorVencimiento) {
    contratosFiltrados = [...contratosFiltrados].sort(
      (a, b) => new Date(a.fechaFin) - new Date(b.fechaFin)
    );
  }

  return (
    <div className="max-w-6xl mx-auto mt-6 p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">
        Contratos Guardados
      </h2>

      <p>Contratos guardados: {contratos.length}</p>

      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Buscar por inquilino..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 border rounded"
        />

        <button
          onClick={() => setOrdenarPorVencimiento(!ordenarPorVencimiento)}
          className="ml-2 bg-gray-700 text-white px-2 py-0.2 rounded-lg hover:bg-gray-800"
        >
          {ordenarPorVencimiento
            ? "🔽 Quitar orden"
            : "🔽 Ordenar por vencimiento"}
        </button>
      </div>

      {contratosFiltrados.length === 0 ? (
        <p className="text-gray-800 text-center">No se encontraron contratos.</p>
      ) : (
        contratosFiltrados.map((c) => (
          <div key={c.id} className="border p-4 mb-4 rounded-lg">
            <p>
              <strong>Inquilino:</strong> {c.inquilinoNombre}{" "}
              {c.inquilinoApellido} - DNI: {c.inquilinoDni}
            </p>
            <p>
              <strong>Propietario:</strong> {c.propietarioNombre}{" "}
              {c.propietarioApellido} - DNI: {c.propietarioDni}
            </p>
            <p>
              <strong>Dirección de la propiedad:</strong> {c.propiedadDireccion}
            </p>
            <p>
              <strong>Fecha Inicio:</strong> {c.fechaInicio}
            </p>
            <p>
              <strong>Fecha Fin:</strong> {c.fechaFin}
            </p>
            <p>
              <strong>Monto Actualizado:</strong> ${mostrarMonto(c.montoMensual)}
            </p>
            <p>
              <strong>Frecuencia actualización:</strong>{" "}
              {c.frecuenciaActualizacion}
            </p>
            <p>
              <strong>Índice actualización:</strong> {c.indiceActualizacion}
            </p>

            <div className="flex space-x-2 mt-2">
              <button
                onClick={() => borrarContrato(c.id)}
                className="bg-red-600 text-white py-1 px-3 text-sm rounded-lg hover:"
              >
                Eliminar
              </button>
              <button
                onClick={() => setEditando(c.id)}
                className="bg-blue-600 text-white py-1 px-3 text-sm rounded-lg "
              >
                Editar
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}











