export default function ContratosGuardados({ currentUser, inquilinoNombre, inquilinoApellido, propiedadDireccion, propietarioApellido, propietarioNombre, fechaFin, onVer,
  id }) {
    
    const hoy = new Date();
    const estado = new Date(fechaFin) > hoy ? "Vigente" : "Vencido";
  return (
    <div className="max-w-6xl mx-auto mt-6 p-1">
      <div className="bg-white rounded-2xl shadow-md p-4 flex items-center justify-between h-[60px] w-full">
        {/* Número a la izquierda */}
        <h2 className="text-1xl font-bold text-gray-900">{inquilinoNombre} {inquilinoApellido}</h2>
        <h2 className="text-1xl font-bold text-gray-900">{propietarioNombre} {propietarioApellido}</h2>
        <h2 className="text-1xl font-bold text-gray-900">{propiedadDireccion}</h2>
        <h2 className="text-1xl font-bold text-gray-900">{estado}</h2>
        {/* Botón a la derecha */}
        <button
        className="bg-red-600 text-white py-1 px-3 text-sm rounded-lg hover:bg-red-700"
        onClick={() => onVer(id)}
        >
        Ver
        </button>
      </div>
    </div>
  );
}

