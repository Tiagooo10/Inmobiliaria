import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faFileContract } from "@fortawesome/free-solid-svg-icons";


export default function CardsContrato({ currentUser, totalContratos, contratosPorVencer, contratosVencidos, totalClientes }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 mt-20 gap-4 px-8 py-8 bg-white/10 backdrop-blur-sm rounded-xl">
        {/* Contratos Activos */}
        <div className="bg-white rounded-2xl shadow-md p-4 flex flex-col justify-center h-50 w-full">
            <div className="bg-green-100 p-5 rounded-full mb-2 inline-block">
                <span className="text-green-600 text-2xl">📄</span>
            </div>
            <h3 className="text-1xl font-bold text-gray-900 mb-1">Contratos Activos</h3>
            <p className="text-4xl font-bold text-gray-900">{totalContratos}</p>
        </div>

        {/* Por Vencer */}
        <div className="bg-white rounded-2xl shadow-md p-4 flex flex-col justify-center h-50 w-full">
            <div className="bg-yellow-100 p-5 rounded-full mb-2 inline-block">
                <span className="text-yellow-500 text-2xl">⏳</span>
            </div>
            <h3 className="text-1xl font-bold text-gray-900 mb-1">Por Vencer</h3>
            <p className="text-4xl font-bold text-gray-900">{contratosPorVencer}</p>
        </div>

        {/* Vencidos */}
        <div className="bg-white rounded-2xl shadow-md p-4 flex flex-col justify-center h-50 w-full">
            <div className="bg-red-100 p-5 rounded-full mb-2 inline-block">
                <span className="text-red-600 text-2xl">❌</span>
            </div>
            <h3 className="text-1xl font-bold text-gray-900 mb-1">Vencidos</h3>
            <p className="text-4xl font-bold text-gray-900">{contratosVencidos}</p>
        </div>

        {/* Total Clientes */}
        <div className="bg-white rounded-2xl shadow-md p-4 flex flex-col justify-center h-50 w-full">
            <div className="bg-blue-100 p-5 rounded-full mb-2 inline-block">
                <span className="text-blue-600 text-2xl">👥</span>
            </div>
            <h3 className="text-1xl font-bold text-gray-900 mb-1">Total Clientes</h3>
            <p className="text-4xl font-bold text-gray-900">{totalClientes}</p>
        </div>
        </div>








  )}