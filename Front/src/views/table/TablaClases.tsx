'use client';

import React, { useContext } from "react";
import "./TablaClases.scss";
import { ClasesContext } from "@/context/ClasesContext";

const TablaClases: React.FC = () => {
  const { clases, loaded } = useContext(ClasesContext);
  const usuarioName = "Carlos Pérez";

  const originales = [
    { dia: "Lunes", clase: "Cardio", hora: "08:00 - 09:00" },
    { dia: "Martes", clase: "Spinning", hora: "18:00 - 19:00" },
    { dia: "Jueves", clase: "HIIT", hora: "07:00 - 08:00" },
    { dia: "Viernes", clase: "FullBody", hora: "17:00 - 18:00" },
  ];

  return (
    <div className="tabla-page">
      <div className="tabla-container">
        <h2>{usuarioName}</h2>
        <table className="tabla-clases">
          <thead>
            <tr>
              <th>Día</th>
              <th>Clase</th>
              <th>Hora</th>
            </tr>
          </thead>
          <tbody>
            {originales.map((c, index) => (
              <tr key={`orig-${index}`}>
                <td>{c.dia}</td>
                <td>{c.clase}</td>
                <td>{c.hora}</td>
              </tr>
            ))}

            {loaded ? (
              clases.length > 0 ? clases.map((c, index) => (
                <tr key={`tomada-${index}`}>
                  <td>{c.dia}</td>
                  <td>{c.clase}</td>
                  <td>{c.hora}</td>
                </tr>
              )) : (
                <tr><td colSpan={3} style={{ textAlign: "center" }}>No hay clases tomadas</td></tr>
              )
            ) : (
              <tr><td colSpan={3}>&nbsp;</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TablaClases;
