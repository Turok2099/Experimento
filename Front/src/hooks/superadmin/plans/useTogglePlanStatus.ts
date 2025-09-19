"use client";

export function useTogglePlanStatus(token?: string) {
  const togglePlanStatus = async (id: string, newStatus: "active" | "inactive") => {
    if (!token) throw new Error("No hay token");

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/plans/${id}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status: newStatus }),
    });

    if (!res.ok) throw new Error("Error al cambiar estado del plan");
    return await res.json();
  };

  return { togglePlanStatus };
}
