import { useAuth } from "@/context/AuthContext";
import { PlanDto } from "@/types";
import { useEffect, useState } from "react";

export function useGetPlans() {
  const { userData } = useAuth(); // obtenemos la sesión
  const token = userData?.token; // sacamos el token de la sesión

  const [plans, setPlans] = useState<PlanDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchPlans = async () => {
    if (!token) {
      console.warn("⚠️ No hay token, no se puede traer planes");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/plans`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error(`Error al obtener planes: ${res.status}`);
      }

      const data = await res.json();
      console.log("📦 Respuesta backend plans:", data);

      const mapped = (data.items || data).map(
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

      setPlans(mapped);
    } catch (err) {
      console.error("❌ Error cargando planes:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, [token]);

  return { plans, loading, fetchPlans };
}
