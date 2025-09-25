"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

export interface CreateClassDto {
  title: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  capacity?: number;
  goalTag?:
    | "weight_loss"
    | "definition"
    | "muscle_gain"
    | "mobility"
    | "cardio";
  coach?: string[];
  isActive?: boolean;
  location?: string;
  description?: string;
}

export function useCreateClass() {
  const { userData } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createClass = async (classData: CreateClassDto) => {
    try {
      setLoading(true);
      setError(null);

      if (!userData?.token) {
        throw new Error("Usuario no autorizado");
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/classes`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userData.token}`,
          },
          body: JSON.stringify(classData),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Error al crear clase: ${response.status} ${errorText}`
        );
      }

      const result = await response.json();
      return result;
    } catch (err: any) {
      setError(err.message || "Error desconocido");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createClass, loading, error };
}

