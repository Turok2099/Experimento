// hooks/superadmin/plans/useUpdatePlan.ts
"use client";

import { useState } from "react";

export function useUpdatePlan(token?: string) {
  const [loading, setLoading] = useState(false);

  const updatePlan = async (
    id: string,
    updates: Partial<{
      name: string;
      description?: string;
      price: number;
      durationDays: number;
      isActive?: boolean;
    }>
  ) => {
    if (!token) {
      throw new Error("No hay token de autenticación disponible");
    }

    try {
      setLoading(true);

      // Construir payload: eliminar undefined y campos que no deben ir
      const payload: Record<string, any> = {};
      if (updates.name !== undefined) payload.name = updates.name;
      if (updates.description !== undefined) payload.description = updates.description;
      if (updates.price !== undefined) payload.price = updates.price;
      if (updates.durationDays !== undefined) payload.durationDays = updates.durationDays;
      if (updates.isActive !== undefined) payload.isActive = updates.isActive;

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/plans/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Error ${response.status}`);
      }

      // Manejar respuestas vacías (204 No Content o 200 sin body)
      const text = await response.text();
      if (!text) {
        console.log("Plan actualizado (sin respuesta en el body)");
        return null;
      }

      const data = JSON.parse(text);
      console.log("Plan actualizado:", data);
      return data;
    } catch (error) {
      console.error("Error actualizando plan:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { updatePlan, loading };
}



