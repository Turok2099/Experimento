"use client";

export function useDeletePlan(token?: string) {
  const deletePlan = async (id: string) => {
    if (!token) throw new Error("No hay token");

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/plans/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) throw new Error("Error al eliminar plan");
    return true;
  };

  return { deletePlan };
}
