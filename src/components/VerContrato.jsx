import { useEffect, useState } from "react";

export default function VerContrato() {
  const [contrato, setContrato] = useState(null);

  useEffect(() => {
    const savedContrato = localStorage.getItem("contrato");
    if (savedContrato) {
      setContrato(JSON.parse(savedContrato));
    }
  }, []);

  if (!contrato) return <p className="text-center mt-12">No hay contrato cargado.</p>;

  return (
    <div className="max-w-4xl mx-auto mt-12 p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-xl font-bold mb-4">Contrato Guardado</h2>
      <p><strong>Inquilino:</strong> {contrato.inquilinoNombre} {contrato.inquilinoApellido} - DNI: {contrato.inquilinoDni}</p>
      <p><strong>Propietario:</strong> {contrato.propietarioNombre} {contrato.propietarioApellido} - DNI: {contrato.propietarioDni}</p>
      <p><strong>Dirección de la propiedad:</strong> {contrato.propiedadDireccion}</p>
      <p><strong>Fecha Inicio:</strong> {contrato.fechaInicio}</p>
      <p><strong>Fecha Fin:</strong> {contrato.fechaFin}</p>
      <p><strong>Monto mensual:</strong> ${contrato.montoMensual}</p>
      <p><strong>Frecuencia actualización:</strong> {contrato.frecuenciaActualizacion}</p>
      <p><strong>Índice actualización:</strong> {contrato.indiceActualizacion}</p>
    </div>
  );
}
