// DetalleContrato.jsx
import React from "react";

export default function DetalleContrato({ contrato, mostrarMonto, mostrarDni, onVolver }) {
  if (!contrato) return null;

  return (
    <div className="min-h-screen bg-gray-100 pt-32 pb-12 flex justify-center">
      <div className="bg-white w-full max-w-4xl p-12 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6">Detalle del Contrato</h2>

        <p><strong>Inquilino:</strong> {contrato.inquilinoNombre} {contrato.inquilinoApellido} - DNI: {mostrarDni(contrato.inquilinoDni)}</p>
        <p><strong>Propietario:</strong> {contrato.propietarioNombre} {contrato.propietarioApellido} - DNI: {mostrarDni(contrato.propietarioDni)}</p>
        <p><strong>Dirección de la propiedad:</strong> {contrato.propiedadDireccion}</p>
        <p><strong>Fecha Inicio:</strong> {contrato.fechaInicio}</p>
        <p><strong>Fecha Fin:</strong> {contrato.fechaFin}</p>
        <p><strong>Monto Actualizado:</strong> ${mostrarMonto(contrato.montoMensual)}</p>
        <p><strong>Frecuencia actualización:</strong> {contrato.frecuenciaActualizacion}</p>
        <p><strong>Índice actualización:</strong> {contrato.indiceActualizacion}</p>
        <p><strong>Garante:</strong> {contrato.garanteNombre} {contrato.garanteApellido} - DNI: {mostrarDni(contrato.garanteDni)}</p>
        <p><strong>Teléfono Garante:</strong> {contrato.garanteTelefono}</p>

        <div className="mt-8 flex justify-start">
          <button
            onClick={onVolver}
            className="bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700"
          >
            Volver
          </button>
        </div>
      </div>
    </div>
  );
}



