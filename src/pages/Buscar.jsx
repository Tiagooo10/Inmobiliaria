import { useEffect, useState } from "react";
import FormContrato from "../components/FormContrato";
import axios from "axios";

const DIRECTUS_URL = "http://localhost:8055";
const TOKEN = "e01OvqhD8_V1vxDE8LIxk0HY6sAGebij"; // tu token

export default function Buscar() {
  const [contratos, setContratos] = useState([]);
  const [editando, setEditando] = useState(null); // id del contrato a editar
  const [loading, setLoading] = useState(true);

  // Función para formatear fechas a YYYY-MM-DD
  const formatearFecha = (fecha) => fecha ? fecha.split("T")[0] : "";

  // Traer contratos de Directus
  const fetchContratos = async () => {
    try {
      const res = await axios.get(`${DIRECTUS_URL}/items/Contratos`, {
        headers: { Authorization: `Bearer ${TOKEN}` },
      });
      // Solo contratos válidos y formateamos fechas
      const contratosFormateados = res.data.data
        .filter(c => c.inquilinoNombre && c.inquilinoDni)
        .map(c => ({
          ...c,
          fechaInicio: formatearFecha(c.fechaInicio),
          fechaFin: formatearFecha(c.fechaFin),
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
  }, []);

  const borrarContrato = async (id) => {
    try {
      await axios.delete(`${DIRECTUS_URL}/items/Contratos/${id}`, {
        headers: { Authorization: `Bearer ${TOKEN}` },
      });
      setContratos(contratos.filter(c => c.id !== id));
    } catch (err) {
      console.error(err);
      alert("❌ Error al eliminar contrato");
    }
  };

  const guardarEdicion = async (formData) => {
    try {
      // PATCH y obtener respuesta de Directus
      const res = await axios.patch(
        `${DIRECTUS_URL}/items/Contratos/${formData.id}`,
        formData,
        { headers: { Authorization: `Bearer ${TOKEN}` } }
      );

      // Actualizamos el estado con los datos exactos de Directus
      const contratoActualizado = {
        ...res.data.data,
        fechaInicio: formatearFecha(res.data.data.fechaInicio),
        fechaFin: formatearFecha(res.data.data.fechaFin),
      };

      setContratos(
        contratos.map(c => (c.id === formData.id ? contratoActualizado : c))
      );
      setEditando(null);
    } catch (err) {
      console.error(err);
      alert("❌ Error al actualizar contrato");
    }
  };

  if (loading) return <p>Cargando contratos...</p>;

  if (editando) {
    const contrato = contratos.find(c => c.id === editando);
    return (
      <div className="max-w-6xl mx-auto mt-6 p-6 bg-white rounded-xl shadow-lg">
        <FormContrato
          initialData={contrato}
          onSave={guardarEdicion}
          onCancel={() => setEditando(null)}
        />
      </div>
    );
  }

  if (contratos.length === 0) return(
      <div className="max-w-6xl mx-auto mt-6 p-6 bg-white rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">
          Contratos Guardados
        </h2>
        <p className="text-gray-800 text-center mb-6">
          No hay contratos cargados.</p>
      </div>
      ) 

  return (
    <div className="max-w-6xl mx-auto mt-6 p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">
        Contratos Guardados
      </h2>
      {contratos.map((c) => (
        <div key={c.id} className="border p-4 mb-4 rounded-lg">
          <p>
            <strong>Inquilino:</strong> {c.inquilinoNombre} {c.inquilinoApellido}.
            {" - DNI: "} {c.inquilinoDni}
          </p>
          <p>
            <strong>Propietario:</strong> {c.propietarioNombre} {c.propietarioApellido}.
            {" - DNI: "} {c.propietarioDni}
          </p>
          <p><strong>Dirección de la propiedad:</strong> {c.propiedadDireccion}</p>
          <p><strong>Fecha Inicio:</strong> {c.fechaInicio}</p>
          <p><strong>Fecha Fin:</strong> {c.fechaFin}</p>
          <p><strong>Monto:</strong> ${c.montoMensual}</p>
          <p><strong>Frecuencia actualización:</strong> {c.frecuenciaActualizacion}</p>
          <p><strong>Índice actualización:</strong> {c.indiceActualizacion}</p>

          <div className="flex space-x-2 mt-2">
            <button
              onClick={() => borrarContrato(c.id)}
              className="bg-blue-600 text-white py-1 px-3 text-sm rounded-lg hover:bg-blue-700"
            >
              Eliminar
            </button>
            <button
              onClick={() => setEditando(c.id)}
              className="bg-green-600 text-white py-1 px-3 text-sm rounded-lg hover:bg-green-700"
            >
              Editar
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}









