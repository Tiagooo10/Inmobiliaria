import { useEffect, useState } from "react";
import FormContrato from "../components/FormContrato";
import CardsContratos from "../components/CardsContratos";
import axios from "axios";
import ContratosGuardados from "./ContratosGuardados";

export const DIRECTUS_URL = "https://directus-1-6hgt.onrender.com";

export default function Buscar({ currentUser }) {
  const [contratos, setContratos] = useState([]);
  const [editando, setEditando] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [ordenarPorVencimiento, setOrdenarPorVencimiento] = useState(false);
  const [contratoSeleccionado, setContratoSeleccionado] = useState(null);

  const formatearFecha = (fecha) => (fecha ? fecha.split("T")[0] : "");
  const mostrarMonto = (monto) =>
    monto ? Number(monto).toLocaleString("es-AR") : "0";
  const mostrarDni = (dni) =>
    dni ? Number(dni).toLocaleString("es-AR") : "0";

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
        montoMensual: Number(c.montoMensual) || 0,
        inquilinoDni: Number(c.inquilinoDni) || 0,
        propietarioDni: Number(c.propietarioDni) || 0,
        garanteDni: Number(c.garanteDni) || 0,
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
      alert("Contrato eliminado ✅");
    } catch (err) {
      console.error(err);
      alert("❌ No se puede eliminar este contrato");
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
        inquilinoDni: Number(res.data.data.inquilinoDni) || 0,
        propietarioDni: Number(res.data.data.propietarioDni) || 0,
        garanteDni: Number(res.data.data.garanteDni) || 0,
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

  // Mostrar detalle si hay contrato seleccionado
  if (contratoSeleccionado) {
    const c = contratoSeleccionado;
    return (
      <div className="max-w-6xl mx-auto mt-12 mb-12 p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Detalle del Contrato</h2>
        <p>
          <strong>Inquilino:</strong> {c.inquilinoNombre} {c.inquilinoApellido} - DNI:{" "}
          {mostrarDni(c.inquilinoDni)}
        </p>
        <p>
          <strong>Propietario:</strong> {c.propietarioNombre} {c.propietarioApellido} - DNI:{" "}
          {mostrarDni(c.propietarioDni)}
        </p>
        <p>
          <strong>Dirección:</strong> {c.propiedadDireccion}
        </p>
        <p>
          <strong>Fecha Inicio:</strong> {c.fechaInicio}
        </p>
        <p>
          <strong>Fecha Fin:</strong> {c.fechaFin}
        </p>
        <p>
          <strong>Monto:</strong> ${mostrarMonto(c.montoMensual)}
        </p>
        <p>
          <strong>Frecuencia actualización:</strong> {c.frecuenciaActualizacion}
        </p>
        <p>
          <strong>Índice actualización:</strong> {c.indiceActualizacion}
        </p>
        <p>
          <strong>Garante:</strong> {c.garanteNombre} {c.garanteApellido} - DNI:{" "}
          {mostrarDni(c.garanteDni)}
        </p>
        <p>
          <strong>Teléfono Garante:</strong> {c.garanteTelefono}
        </p>

        <div className="flex space-x-2 mt-6">
          <button
            onClick={() => borrarContrato(c.id)}
            className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700"
          >
            Eliminar
          </button>
          <button
            onClick={() => setEditando(c.id)}
            className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
          >
            Editar
          </button>
          <button
            onClick={() => setContratoSeleccionado(null)}
            className="bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  if (editando) {
    const contrato = contratos.find((c) => c.id === editando);
    return (
      <div className="max-w-6xl mx-auto mt-6 p-6">
        <FormContrato
          initialData={contrato}
          onCancel={() => setEditando(null)}
          currentUser={currentUser}
          onSave={guardarEdicion}
        />
      </div>
    );
  }

  // Filtrar contratos por búsqueda
  let contratosFiltrados = contratos.filter((c) =>
    `${c.inquilinoNombre} ${c.inquilinoApellido}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  // Ordenar por fecha de vencimiento si corresponde
  if (ordenarPorVencimiento) {
    contratosFiltrados = [...contratosFiltrados].sort(
      (a, b) => new Date(a.fechaFin) - new Date(b.fechaFin)
    );
  }

  // Calcular estadísticas para las cards
  const hoy = new Date();
  const totalContratos = contratos.length;
  const contratosPorVencer = contratos.filter((c) => new Date(c.fechaFin) > hoy)
    .length;
  const contratosVencidos = contratos.filter((c) => new Date(c.fechaFin) <= hoy)
    .length;
  const totalClientes = new Set(contratos.map((c) => c.inquilinoDni)).size;

  return (
    <div className="max-w-6xl mx-auto mt-6 p-6">
      {/* Cards con estadísticas */}
      <CardsContratos
        totalContratos={totalContratos}
        contratosPorVencer={contratosPorVencer}
        contratosVencidos={contratosVencidos}
        totalClientes={totalClientes}
      />

      {/* Buscador */}
      <h2 className="text-3xl font-bold text-white text-center my-6">
        Contratos Guardados
      </h2>

      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Buscar por inquilino..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-3 border rounded bg-white"
        />
        <button
          onClick={() => setOrdenarPorVencimiento(!ordenarPorVencimiento)}
          className="ml-2 bg-white text-black px-2 py-0.2 rounded-lg"
        >
          {ordenarPorVencimiento
            ? "🔽 Quitar orden"
            : "🔽 Ordenar por vencimiento"}
        </button>
      </div>

      {/* Cards pequeñas con botón Ver */}
      {contratosFiltrados.length === 0 ? (
        <p className="text-gray-800 text-center">No se encontraron contratos.</p>
      ) : (
        contratosFiltrados.map((c) => (
          <ContratosGuardados
            key={c.id}
            inquilinoNombre={c.inquilinoNombre}
            inquilinoApellido={c.inquilinoApellido}
            propiedadDireccion={c.propiedadDireccion}
            propietarioNombre={c.propietarioNombre}
            propietarioApellido={c.propietarioApellido}
            fechaFin={c.fechaFin}
            onVer={() => setContratoSeleccionado(c)}
          />
        ))
      )}
    </div>
  );
}













