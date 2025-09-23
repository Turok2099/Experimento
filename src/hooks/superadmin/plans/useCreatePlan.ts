// hooks/superadmin/plans/useCreatePlan.ts
import { useState } from "react";

export function useCreatePlan(token?: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createPlan = async (planData: {
    name: string;
    price: number;
    durationDays: number;
    description?: string;
    isActive?: boolean;
  }) => {
    if (!token) {
      console.warn("No hay token disponible");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/plans`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(planData),
      });

      if (!res.ok) {
        throw new Error(`Error ${res.status}: ${res.statusText}`);
      }

      const data = await res.json();
      console.log("✅ Plan creado:", data);
      return data;
    } catch (err: any) {
      console.error("❌ Error al crear plan:", err);
      setError(err.message || "Error desconocido");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createPlan, loading, error };
}
