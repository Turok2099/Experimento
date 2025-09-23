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
    console.log("🔑 Token recibido:", token ? "✅ Presente" : "❌ Ausente");
    console.log("🌐 URL API:", process.env.NEXT_PUBLIC_API_URL);

    if (!token) throw new Error("No se proporcionó token para la petición");

    const url = `${process.env.NEXT_PUBLIC_API_URL}/reviews/admin`;
    console.log("📡 Haciendo petición a:", url);

    // 🔹 Usamos la ruta correcta del backend para admin
    const res = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    console.log("📊 Status de respuesta:", res.status, res.statusText);

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      console.error("❌ Error en respuesta:", err);
      throw new Error(err?.message || res.statusText);
    }

    const data = await res.json();
    console.log("🔍 Datos crudos de Comentarios back:", data);

    // 🔹 Transformamos la respuesta según el modelo Review
    const reviews = (data.items || []).map((r: any) => ({
      id: r.id,
      text: r.comment ?? "", // El backend usa 'comment', no 'text'
      rating: r.rating ?? 0,
      status: r.status ?? "pending", // El backend ya incluye el status
      user: {
        id: r.userId, // El backend usa 'userId' directamente
        name: "Usuario", // El backend no incluye info del usuario en admin
        email: "", // El backend no incluye email en admin
      },
    }));

    console.log("✅ Reviews transformadas:", reviews);
    return reviews;
  },
};
