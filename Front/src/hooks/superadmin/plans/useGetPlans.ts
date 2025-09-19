"use client";

import { useEffect, useState } from "react";

export interface PlanDto {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number; // en días
  status: "active" | "inactive";
}

export function useGetPlans(token?: string) {
  const [plans, setPlans] = useState<PlanDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchPlans = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/plans`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });
      if (!res.ok) throw new Error("Error al obtener planes");
      const data = await res.json();
      setPlans(data.items || data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, [token]);

  return { plans, loading, fetchPlans };
}
