export interface Review {
  id: number;
  text: string;
  rating: number;
  status: string; // active | inactive | pending | rejected
  user?: {
    id: number;
    name: string;
    email: string;
  };
}

export const AllCommentsService = {
  async getAllComments(token?: string): Promise<Review[]> {
    if (!token) throw new Error("No se proporcionó token para la petición");

    // 🔹 Usamos la ruta correcta del backend para admin
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reviews/admin`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err?.message || res.statusText);
    }

    const data = await res.json();

    console.log("🔍 Datos crudos de Comentarios back:", data);

    // 🔹 Transformamos la respuesta según el modelo Review
    return (data.items || []).map((r: any) => ({
      id: r.id,
      text: r.comment ?? "",
      rating: r.rating ?? 0,
      status: r.status ?? "pending",
      user: {
        id: r.user?.id,
        name: r.user?.name ?? "Anónimo",
        email: r.user?.email ?? "",
      },
    }));
  },
};
