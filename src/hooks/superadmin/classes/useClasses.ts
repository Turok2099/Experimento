"use client";

import { useAuth } from "@/context/AuthContext";
import { useState, useEffect, useCallback } from "react";

// DTO adaptado al backend
export interface ClassDto {
  id: string;
  title: string;
  date: string; // yyyy-mm-dd
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  capacity: number;
  status: "active" | "inactive";
  goalTag?: string | null;
  coach?: string[] | null;
  description?: string; // opcional, si quieres usarlo
}

export function useClasses() {
  const { userData } = useAuth();
  const [classes, setClasses] = useState<ClassDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClasses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      if (!userData?.token) {
        throw new Error("Usuario no autorizado");
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/classes/admin`,
        {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${userData.token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Error al obtener clases");

      const data = await res.json();

      // Mapear campos del backend al frontend
      const rawClasses = data.items || data || [];
      const mappedClasses: ClassDto[] = rawClasses.map(
        (cls: any, index: number) => {
          const mapped = {
            id: cls.id,
            title: cls.title,
            date: cls.date,
            startTime: cls.startTime,
            endTime: cls.endTime,
            capacity: cls.capacity,
            status: cls.isActive ? "active" : "inactive",
            goalTag: cls.goalTag || null,
            coach: cls.coach || null,
            description: cls.description || "",
          };

          // Debug: mostrar el mapeo para las primeras 2 clases
          if (index < 2) {
            console.log("🔍 Mapeo de clase:", {
              original: {
                id: cls.id,
                title: cls.title,
                isActive: cls.isActive,
              },
              mapped: {
                id: mapped.id,
                title: mapped.title,
                status: mapped.status,
              },
            });
          }

          return mapped;
        }
      );

      setClasses(mappedClasses);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Error desconocido");
    } finally {
      setLoading(false);
    }
  }, [userData?.token]);

  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  return { classes, loading, error, fetchClasses };
}
