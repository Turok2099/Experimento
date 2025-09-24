"use client";

import { useState } from "react";
import styles from "./dailyRoutine.module.scss";
import { RoutineItem } from "@/views/user/routineView/RoutineView";

type DailyRoutineProps = {
  selectedItems: RoutineItem[];
  routineRegistered: boolean;
  onRegister: () => void;
  onNewRoutine: () => void;
};

export default function DailyRoutine({
  selectedItems,
  routineRegistered,
  onRegister,
  onNewRoutine,
}: DailyRoutineProps) {
  const [completed, setCompleted] = useState<string[]>([]);

  const toggleComplete = (id: string) => {
    setCompleted((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  return (
    <div className={styles.summaryCardBottom}>
      <h3 className={styles.summaryTitle}>Rutina seleccionada</h3>
      {selectedItems.length === 0 ? (
        <p>No has seleccionado ejercicios aún</p>
      ) : (
        <ul className={styles.summaryList}>
          {selectedItems.map((item) => {
            const id = `${item.goal}-${item.nombre}`;
            return (
              <li key={id} className={styles.summaryItem}>
                <span
                  className={
                    completed.includes(id) ? styles.completedText : undefined
                  }
                >
                  <strong>{item.goal}</strong> {item.nombre}
                  {/* Para clases, mostrar solo horario */}
                  {item.goal === "Clases" && item.repeticiones && (
                    <> (Horario: {item.repeticiones})</>
                  )}
                  {/* Para ejercicios, mostrar series y repeticiones */}
                  {item.goal !== "Clases" &&
                    item.series != null &&
                    item.repeticiones != null && (
                      <>
                        {" "}
                        (Series: {item.series} x Repeticiones:{" "}
                        {item.repeticiones})
                      </>
                    )}
                </span>

                {routineRegistered && (
                  <input
                    type="checkbox"
                    className={styles.checkbox}
                    checked={completed.includes(id)}
                    onChange={() => toggleComplete(id)}
                  />
                )}
              </li>
            );
          })}
        </ul>
      )}

      {!routineRegistered ? (
        <button className={styles.registerButton} onClick={onRegister}>
          Registrar Rutina
        </button>
      ) : (
        <button className={styles.newRoutineButton} onClick={onNewRoutine}>
          Nueva Rutina
        </button>
      )}
    </div>
  );
}
