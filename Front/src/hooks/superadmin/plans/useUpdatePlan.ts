"use client";

import { PlanDto } from "./useGetPlans";

export function useUpdatePlan(token?: string) {
  const updatePlan = async (id: string, payload: Partial<PlanDto>) => {
    if (!token) throw new Error("No hay token");

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/plans/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error("Error al actualizar plan");
    return await res.json();
  };

  return { updatePlan };
}
