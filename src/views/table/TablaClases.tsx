"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { ClasesService, ClaseAPI } from "@/services/ClasesService";
import toast, { Toaster } from "react-hot-toast";
import "../table/TablaClases.scss"; // Import global SCSS

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

        // Filtrar solo las clases donde el entrenador actual está asignado
        const myAssignedClasses = allClases.filter(
          (clase) =>
            clase.trainerName === userData.user?.name
        );

        setTomadas(myAssignedClasses);
      } catch (err) {
        console.error("Error al obtener clases asignadas:", err);
        toast.error("Error al obtener clases asignadas");
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
        <h2>Mis Clases Asignadas</h2>

        <table className="tabla-clases">
          <thead>
            <tr>
              <th>Título</th>
              <th>Fecha</th>
              <th>Hora Inicio</th>
              <th>Hora Fin</th>
              <th>Estado</th>
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
                  <td>
                    <span className="assigned-status">
                      ✅ Asignado como entrenador
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr className="no-classes">
                <td colSpan={5}>No tienes clases asignadas como entrenador.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TablaClases;
