"use client";

import { useAuth } from "@/context/AuthContext";

export function useTogglePlanStatus() {
  const { userData } = useAuth();
  const token = userData?.token;

  const togglePlanStatus = async (id: string, currentIsActive: boolean) => {
    if (!token) throw new Error("No hay token");

    // Cambiamos el valor booleano (true → false, false → true)
    const newIsActive = !currentIsActive;

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/plans/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ isActive: newIsActive }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Error al cambiar estado del plan: ${res.status} ${errorText}`);
    }

    return await res.json();
  };

  return { togglePlanStatus };
}

