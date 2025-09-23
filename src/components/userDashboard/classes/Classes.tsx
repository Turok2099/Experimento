// src/components/userDashboard/classes/Classes.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import styles from "./classes.module.scss";
import { getSchedule, bookClass } from "@/services/ReservationService";

type ApiClass = {
  id: string;
  title: string;
  date: string; // yyyy-mm-dd
  startTime: string; // HH:mm:ss
  endTime: string; // HH:mm:ss
  trainerId?: string;
  capacity: number;
};

const DAYS_ES = [
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
  "Domingo",
];

function dayNameEs(dateStr: string) {
  // JS: 0=Domingo… pasamos a Lunes=0
  const d = new Date(`${dateStr}T00:00:00`);
  return DAYS_ES[(d.getDay() + 6) % 7];
}
const hhmm = (t?: string) => (t ?? "").slice(0, 5);

export default function Classes() {
  const { userData } = useAuth();
  const token = userData?.token ?? "";

   const [items, setItems] = useState<ApiClass[]>([]);
   const [loading, setLoading] = useState(true);
   const [msg, setMsg] = useState<string | null>(null);
   const [error, setError] = useState<string | null>(null);

  // Carga agenda real del backend
  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getSchedule({ page: 1, limit: 100 });
        setItems(data.items ?? []);
      } catch (e: any) {
        setError(e?.message ?? "No se pudo cargar la agenda");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Organizar clases por día
  const classesByDay = useMemo(() => {
    const grouped: { [key: string]: ApiClass[] } = {};
    
    items.forEach((c) => {
      const dayName = dayNameEs(c.date);
      if (!grouped[dayName]) {
        grouped[dayName] = [];
      }
      grouped[dayName].push(c);
    });
    
    // Ordenar clases dentro de cada día por hora
    Object.keys(grouped).forEach((day) => {
      grouped[day].sort((a, b) => a.startTime.localeCompare(b.startTime));
    });
    
    return grouped;
  }, [items]);

  // Reservar en backend
  const handleEnroll = async (cls: ApiClass) => {
    if (!token) {
      setMsg("Debes iniciar sesión para reservar.");
      setTimeout(() => setMsg(null), 3000);
      return;
    }
    try {
      await bookClass(token, cls.id);
      setMsg(`Te has inscrito exitosamente a la clase de ${cls.title}`);
    } catch (e: any) {
      setMsg(e?.message ?? "No se pudo completar la reserva");
    } finally {
      setTimeout(() => setMsg(null), 3000);
    }
  };

  if (loading)
    return (
      <div className={styles.section}>
        <p className={styles.emptyMessage}>Cargando…</p>
      </div>
    );
  if (error)
    return (
      <div className={styles.section}>
        <p className={styles.emptyMessage}>{error}</p>
      </div>
    );

  return (
    <div className={styles.section}>
      <h2 className={styles.sectionTitle}>Clases Disponibles</h2>


       {msg && <div className={styles.alert}>{msg}</div>}

       {items.length === 0 ? (
         <p className={styles.emptyMessage}>No hay clases disponibles</p>
       ) : (
         <div className={styles.calendarGrid}>
           {DAYS_ES.map((day) => (
             <div key={day} className={styles.daySection}>
               <h3 className={styles.dayTitle}>{day}</h3>
               <div className={styles.dayClasses}>
                 {classesByDay[day]?.length > 0 ? (
                   classesByDay[day].map((c) => (
                     <div key={c.id} className={styles.classCard}>
                       <h4 className={styles.classTitle}>{c.title}</h4>
                       <div className={styles.classInfo}>
                         <div className={styles.infoItem}>
                           <span className={styles.infoLabel}>Horario</span>
                           <span className={styles.infoValue}>
                             {hhmm(c.startTime)} - {hhmm(c.endTime)}
                           </span>
                         </div>
                         <div className={styles.infoItem}>
                           <span className={styles.infoLabel}>Capacidad</span>
                           <span className={styles.infoValue}>{c.capacity}</span>
                         </div>
                       </div>
                       <button
                         className={styles.enrollButton}
                         onClick={() => handleEnroll(c)}
                       >
                         Inscribirse
                       </button>
                     </div>
                   ))
                 ) : (
                   <p className={styles.noClassesMessage}>Sin clases</p>
                 )}
               </div>
             </div>
           ))}
         </div>
       )}
    </div>
  );
}
