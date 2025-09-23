import { useAuth } from "@/context/AuthContext";
import { PlanDto } from "@/types";
import { useEffect, useState } from "react";

export function useActivePlans() {
  const { userData } = useAuth();
  const token = userData?.token;

  const [plans, setPlans] = useState<PlanDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchActivePlans = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/plans`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error(`Error al obtener planes: ${res.status}`);
      }

      const data = await res.json();
      console.log("📦 Respuesta backend plans:", data);

      // Filtrar solo los planes activos
      const allPlans = (data.items || data).map(
        (p: any): PlanDto => ({
          id: p.id,
          name: p.name,
          description: p.description,
          price: Number(p.price),
          durationDays: p.durationDays,
          isActive: p.isActive,
          status: p.isActive ? "active" : "inactive",
        })
      );

      // Solo mostrar planes activos
      const activePlans = allPlans.filter(
        (plan: PlanDto) => plan.isActive === true
      );
      setPlans(activePlans);
    } catch (err) {
      console.error("❌ Error cargando planes activos:", err);
      setPlans([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchActivePlans();
    } else {
      setLoading(false);
    }
  }, [token]);

  return { plans, loading, refetch: fetchActivePlans };
}
