'use client';

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { ClasesService } from "@/services/ClasesService";
import toast, { Toaster } from "react-hot-toast";
import "../table/TablaClases.scss"; // Import global SCSS

interface ClaseAPI {
  id: string;
  title: string;
  date: string; 
  startTime: string;
  endTime: string;
  trainerName: string;
  capacity: number;
}

const TablaClases: React.FC = () => {
  const { userData } = useAuth();
  const [clases, setClases] = useState<ClaseAPI[]>([]);
  const [tomadas, setTomadas] = useState<ClaseAPI[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClases = async () => {
      if (!userData?.token) {
        console.error("No hay token de usuario");
        setLoading(false);
        return;
      }

      try {
        const allClases = await ClasesService.getAllClasses();
        setClases(allClases);

        
        const agenda = await ClasesService.getMyAgenda(userData.token);
        setTomadas(agenda);
      } catch (err) {
        console.error("Error al obtener agenda:", err);
        toast.error("Error al obtener agenda");
      } finally {
        setLoading(false);
      }
    };

    fetchClases();
  }, [userData]);

  if (loading) return <p>Cargando clases...</p>;
  if (!userData) return <p>No hay usuario autenticado</p>;

  return (
    <div className="tabla-page">
      <Toaster position="top-right" reverseOrder={false} />

      <div className="tabla-container">
        <h2>Mis Clases</h2>

        <table className="tabla-clases">
          <thead>
            <tr>
              <th>Título</th>
              <th>Fecha</th>
              <th>Hora Inicio</th>
              <th>Hora Fin</th>
              <th>Trainer</th>
            </tr>
          </thead>
          <tbody>
            {tomadas.length > 0 ? (
              tomadas.map((c) => (
                <tr key={c.id}>
                  <td>{c.title}</td>
                  <td>{c.date}</td>
                  <td>{c.startTime}</td>
                  <td>{c.endTime}</td>
                  <td>{c.trainerName}</td>
                </tr>
              ))
            ) : (
              <tr className="no-classes">
                <td colSpan={5}>No tienes clases registradas.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TablaClases;
