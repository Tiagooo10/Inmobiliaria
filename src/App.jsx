import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import CardsPrincipales from "./components/CardsPrincipales";
import FormContrato from "./components/FormContrato";
import Buscar from "./pages/Buscar";
import { Header } from "./components/Header";
import  Footer  from "./components/Footer"
import './index.css';


export default function App() {
  const [contratos, setContratos] = useState(
    JSON.parse(localStorage.getItem("contratos") || "[]")
  );

  const agregarContrato = (nuevo) => {
    const nuevos = [...contratos, nuevo];
    setContratos(nuevos);
    localStorage.setItem("contratos", JSON.stringify(nuevos));
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-28 pb-28 bg-gray-900">
        <Routes>
          <Route path="/" element={<CardsPrincipales />} />
          <Route path="/contrato" element={<FormContrato onAgregar={agregarContrato} />} />
          <Route path="/buscar" element={<Buscar />} />
        </Routes>
      </main>
      <Footer />
    </div>


  );
}


