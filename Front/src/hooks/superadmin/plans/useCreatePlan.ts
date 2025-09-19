"use client";

import { PlanDto } from "./useGetPlans";

export function useCreatePlan(token?: string) {
  const createPlan = async (payload: Partial<PlanDto>) => {
    if (!token) throw new Error("No hay token");

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/plans`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error("Error al crear plan");
    return await res.json();
  };

  return { createPlan };
}
