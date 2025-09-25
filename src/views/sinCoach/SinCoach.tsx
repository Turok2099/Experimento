"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { ClasesService } from "@/services/ClasesService";
import toast, { Toaster } from "react-hot-toast";
import "./SinCoach.scss";

interface ClaseAPI {
  id: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  trainerName: string;
  capacity: number;
}

const diasSemana = [
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
  "Domingo",
];

const Disponibles: React.FC = () => {
  const { userData } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [openDay, setOpenDay] = useState<string | null>(null);
  const [clases, setClases] = useState<ClaseAPI[]>([]);
  const [tomadas, setTomadas] = useState<ClaseAPI[]>([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!userData || !userData.token) return;

    const fetchClases = async () => {
      try {
        const allClases = await ClasesService.getAllClasses();
        setClases(allClases);

        // Intentar obtener la agenda, pero no fallar si no se puede
        try {
          const agenda = await ClasesService.getMyAgenda(userData.token!);
          setTomadas(agenda);
        } catch (agendaErr: any) {
          console.warn("No se pudo cargar la agenda:", agendaErr.message);
          // Si es un error de autorización, simplemente no cargar la agenda
          if (
            agendaErr.message?.includes("Unauthorized") ||
            agendaErr.message?.includes("Error al obtener agenda")
          ) {
            setTomadas([]); // Inicializar con array vacío
          } else {
            throw agendaErr; // Re-lanzar otros errores
          }
        }
      } catch (err) {
        console.error("Error al cargar clases", err);
        toast.error("Error al cargar clases");
      }
    };

    fetchClases();
  }, [userData]);

  // Función para refrescar el estado completo
  const refreshState = async () => {
    if (!userData?.token) return;

    try {
      const allClases = await ClasesService.getAllClasses();
      setClases(allClases);

      // Intentar obtener la agenda, pero no fallar si no se puede
      try {
        const agenda = await ClasesService.getMyAgenda(userData.token);
        setTomadas(agenda);
      } catch (agendaErr: any) {
        console.warn("No se pudo refrescar la agenda:", agendaErr.message);
        // Si es un error de autorización, mantener el estado actual
        if (
          agendaErr.message?.includes("Unauthorized") ||
          agendaErr.message?.includes("Error al obtener agenda")
        ) {
          // No cambiar el estado de tomadas si hay error de autorización
        } else {
          throw agendaErr; // Re-lanzar otros errores
        }
      }
    } catch (err) {
      console.error("Error al refrescar estado:", err);
    }
  };

  const toggleDay = (dia: string) => setOpenDay(openDay === dia ? null : dia);

  const tomarClase = async (c: ClaseAPI) => {
    if (!userData?.token) return toast.error("Token no proporcionado");

    try {
      // Si el usuario es un entrenador, asignarse como entrenador de la clase
      if (userData.user?.role === "trainer") {
        await ClasesService.assignMeAsTrainer(userData.token, c.id);
        toast.success(
          `Te has asignado como entrenador de ${c.title} (${c.date}) ✅`
        );
      } else {
        // Si es un miembro normal, hacer reserva
        await ClasesService.takeClass(userData.token, c.id);
        setTomadas((prev) => [...prev, c]);
        toast.success(`Te has inscrito en ${c.title} (${c.date}) ✅`);
      }

      // Solo recargar las clases principales, no la agenda completa
      const allClases = await ClasesService.getAllClasses();
      setClases(allClases);
    } catch (err) {
      console.error(err);
      toast.error("Error al procesar la solicitud");
    }
  };

  const cancelarClase = async (c: ClaseAPI) => {
    if (!userData?.token) return toast.error("Token no proporcionado");

    try {
      await ClasesService.cancelClass(userData.token, c.id);

      // Actualizar estado local inmediatamente
      setTomadas((prev) => prev.filter((cl) => cl.id !== c.id));
      toast.success(`Has cancelado ${c.title} (${c.date}) ❌`);

      // Solo recargar las clases principales, no la agenda
      const allClases = await ClasesService.getAllClasses();
      setClases(allClases);
    } catch (err: any) {
      console.error("Error al cancelar clase:", err);

      // Si el error es que no hay reserva activa, actualizar el estado local
      if (err.message?.includes("No tienes una reserva activa")) {
        setTomadas((prev) => prev.filter((cl) => cl.id !== c.id));
        toast.success("La clase ya estaba cancelada");

        // Solo recargar las clases principales
        const allClases = await ClasesService.getAllClasses();
        setClases(allClases);
      } else {
        toast.error("Error al cancelar clase");
      }
    }
  };

  const cancelarAsignacionEntrenador = async (c: ClaseAPI) => {
    if (!userData?.token) return toast.error("Token no proporcionado");

    try {
      // Para cancelar la asignación, necesitamos un endpoint que quite el entrenador
      // Por ahora usaremos el endpoint de admin para asignar un trainerId null o vacío
      await ClasesService.unassignTrainer(userData.token, c.id);
      toast.success(
        `Has cancelado tu asignación como entrenador de ${c.title} (${c.date}) ❌`
      );

      // Solo recargar las clases principales
      const allClases = await ClasesService.getAllClasses();
      setClases(allClases);
    } catch (err) {
      console.error(err);
      toast.error("Error al cancelar asignación");
    }
  };

  const isTomada = (c: ClaseAPI) => tomadas.some((t) => t.id === c.id);

  // Verificar si la clase ya tiene un entrenador asignado
  const hasTrainerAssigned = (c: ClaseAPI) => {
    return (
      c.trainerName &&
      c.trainerName !== "undefined" &&
      c.trainerName.trim() !== ""
    );
  };

  // Verificar si el entrenador actual está asignado a esta clase
  const isCurrentUserTrainer = (c: ClaseAPI) => {
    return (
      userData?.user?.role === "trainer" && c.trainerName === userData.user.name
    );
  };

  if (!mounted) return <p>Cargando clases...</p>;

  return (
    <div className="tabla-page">
      <Toaster position="top-right" reverseOrder={false} />

      <div className="tabla-container">
        <h2>CLASES POR DÍA</h2>

        {diasSemana.map((dia) => {
          const clasesDelDia = clases.filter((c) => {
            const dateObj = new Date(c.date);
            return diasSemana[dateObj.getDay() - 1] === dia;
          });

          return (
            <div key={dia} className="dia-semana">
              <button className="btn-dia" onClick={() => toggleDay(dia)}>
                {dia} {openDay === dia ? "▲" : "▼"}
              </button>

              {openDay === dia && (
                <div className="tabla-wrapper">
                  <table className="tabla-clases">
                    <thead>
                      <tr>
                        <th>Nombre</th>
                        <th>Hora Inicio</th>
                        <th>Hora Fin</th>
                        <th>Trainer</th>
                        <th>Capacidad</th>
                      </tr>
                    </thead>
                    <tbody>
                      {clasesDelDia.map((c) => (
                        <tr
                          key={c.id}
                          className={
                            isTomada(c) || hasTrainerAssigned(c)
                              ? "fila-tomada"
                              : ""
                          }
                        >
                          <td>{c.title}</td>
                          <td>{c.startTime}</td>
                          <td>{c.endTime}</td>
                          <td>
                            {hasTrainerAssigned(c) ? (
                              // Clase con entrenador asignado
                              <div className="tomada-usuario">
                                <span>{c.trainerName}</span>
                                {isCurrentUserTrainer(c) && (
                                  <button
                                    className="btn-cancelar"
                                    onClick={() =>
                                      cancelarAsignacionEntrenador(c)
                                    }
                                  >
                                    ✕
                                  </button>
                                )}
                              </div>
                            ) : isTomada(c) ? (
                              // Clase reservada por el usuario actual (miembros)
                              <div className="tomada-usuario">
                                <span>{userData?.user?.name ?? "Usuario"}</span>
                                <button
                                  className="btn-cancelar"
                                  onClick={() => cancelarClase(c)}
                                >
                                  ✕
                                </button>
                              </div>
                            ) : (
                              // Clase disponible
                              <button
                                className={`btn-tomar ${
                                  userData?.user?.role === "trainer"
                                    ? "trainer-btn"
                                    : ""
                                }`}
                                onClick={() => tomarClase(c)}
                              >
                                {userData?.user?.role === "trainer" ? (
                                  <>
                                    <span className="trainer-icon">🏋️</span>
                                    <span className="trainer-text">
                                      Asignar
                                    </span>
                                  </>
                                ) : (
                                  "+"
                                )}
                              </button>
                            )}
                          </td>
                          <td>{c.capacity}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Disponibles;
