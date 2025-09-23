'use client';

import React, { useState, useEffect, useContext } from "react";
import "./SinCoach.scss";
import { ClasesContext } from "@/context/ClasesContext";
import toast, { Toaster } from "react-hot-toast"; // 👈 importar

interface ClassMock {
  clase: string;
  horaInicio: string;
  horaFin: string;
  diaSemana: string;
  tutor: string;
  capacidad: number;
}

const classMock: ClassMock[] = [
  { clase: "Cardio", horaInicio: "08:00", horaFin: "09:00", diaSemana: "Lunes", tutor: "", capacidad: 20 },
  { clase: "FullBody", horaInicio: "15:00", horaFin: "16:00", diaSemana: "Lunes", tutor: "Lucía Fernández", capacidad: 18 },
  { clase: "Spinning", horaInicio: "09:00", horaFin: "10:00", diaSemana: "Martes", tutor: "Carlos Méndez", capacidad: 15 },
  { clase: "Stretching", horaInicio: "16:00", horaFin: "17:00", diaSemana: "Martes", tutor: "", capacidad: 22 },
  { clase: "Zumba", horaInicio: "10:00", horaFin: "11:00", diaSemana: "Miércoles", tutor: "", capacidad: 18 },
  { clase: "Powerlifting", horaInicio: "17:00", horaFin: "18:00", diaSemana: "Miércoles", tutor: "Elena Torres", capacidad: 12 },
  { clase: "Pilates", horaInicio: "11:00", horaFin: "12:00", diaSemana: "Jueves", tutor: "Ana López", capacidad: 20 },
  { clase: "Boxeo", horaInicio: "12:00", horaFin: "13:00", diaSemana: "Viernes", tutor: "", capacidad: 25 },
  { clase: "HIIT", horaInicio: "13:00", horaFin: "14:00", diaSemana: "Sábado", tutor: "Marcos Díaz", capacidad: 16 },
  { clase: "Funcional", horaInicio: "14:00", horaFin: "15:00", diaSemana: "Domingo", tutor: "", capacidad: 20 },
];

const diasSemana = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
const usuarioName = "Carlos Pérez";

const Disponibles: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const [openDay, setOpenDay] = useState<string | null>(null);
  const { clases, agregarClase, eliminarClase, loaded } = useContext(ClasesContext);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleDay = (dia: string) => setOpenDay(openDay === dia ? null : dia);

  const tomarClase = (c: ClassMock) => {
    if (!clases.find(cl => cl.dia === c.diaSemana && cl.clase === c.clase)) {
      agregarClase({
        dia: c.diaSemana,
        clase: c.clase,
        hora: `${c.horaInicio} - ${c.horaFin}`,
        usuario: usuarioName,
      });
      toast.success(`Te has inscrito en ${c.clase} (${c.diaSemana}) 🎉`);
    } else {
      toast.error("Ya tienes esa clase tomada");
    }
  };

  const cancelarClase = (c: ClassMock) => {
    eliminarClase(c.diaSemana, c.clase);
    toast(`Has cancelado ${c.clase} (${c.diaSemana})`, {
      icon: "❌",
    });
  };

  if (!mounted || !loaded) {
    return (
      <div className="tabla-page" style={{ minHeight: 400 }}>
        <div className="tabla-container">
          <h2>Cargando clases...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="tabla-page">
      <Toaster position="top-right" reverseOrder={false} /> {/* 👈 toasts aquí */}

      <div className="tabla-container">
        <h2>CLASES POR DÍA</h2>

        {diasSemana.map(dia => {
          const clasesDelDia = classMock.filter(c => c.diaSemana === dia);
          return (
            <div key={dia} className="dia-semana">
              <button className="btn-dia" onClick={() => toggleDay(dia)}>
                {dia} {openDay === dia ? "▲" : "▼"}
              </button>

              {openDay === dia && (
                <div className="tabla-wrapper">
                  <table className="tabla-clases">
                    <colgroup>
                      <col style={{ width: '25%' }} />
                      <col style={{ width: '20%' }} />
                      <col style={{ width: '20%' }} />
                      <col style={{ width: '20%' }} />
                      <col style={{ width: '15%' }} />
                    </colgroup>
                    <thead>
                      <tr>
                        <th>Nombre</th>
                        <th>Hora Inicio</th>
                        <th>Hora Fin</th>
                        <th>Tutor</th>
                        <th>Capacidad</th>
                      </tr>
                    </thead>
                    <tbody>
                      {clasesDelDia.map(c => {
                        const tomada = clases.find(cl => cl.dia === c.diaSemana && cl.clase === c.clase);
                        return (
                          <tr key={`${c.diaSemana}-${c.clase}`} className={tomada ? "fila-tomada" : ""}>
                            <td>{c.clase}</td>
                            <td>{c.horaInicio}</td>
                            <td>{c.horaFin}</td>
                            <td className="tutor-usuario">
                              {tomada ? (
                                <div className="tomada-usuario">
                                  <span>{tomada.usuario}</span>
                                  <button className="btn-cancelar" onClick={() => cancelarClase(c)}>✕</button>
                                </div>
                              ) : (
                                c.tutor || <button className="btn-tomar" onClick={() => tomarClase(c)}>+</button>
                              )}
                            </td>
                            <td>{c.capacidad}</td>
                          </tr>
                        );
                      })}
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
