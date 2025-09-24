// src/components/userDashboard/comments/CommentsPage.tsx
"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Comments from "@/components/userDashboard/comments/Comments";
import { getMyComments, createComment } from "@/services/UserCommentService";
import type { Comentary } from "@/types";

// 👇 Tipo mínimo que requiere Comments (id + name)
type CommentsUser = { id: string | number; name: string };

export default function CommentsPage() {
  const { userData } = useAuth();
  const token = userData?.token ?? "";
  const rawUser = userData?.user;

  const [comments, setComments] = useState<Comentary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    (async () => {
      try {
        const data = await getMyComments(token); // /reviews/me
        setComments(data);
      } catch (error) {
        console.error("Error cargando comentarios:", error);
        // En caso de error, mostrar lista vacía en lugar de fallar
        setComments([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [token]);

  const handleAddComment = async (c: Omit<Comentary, "id">) => {
    if (!token) throw new Error("No hay token de autenticación");

    try {
      const created = await createComment(token, c.text, c.rating); // POST /reviews
      setComments((prev) => [created, ...prev]); // persistimos en UI
    } catch (error) {
      // Re-lanzar el error para que el componente hijo lo maneje
      throw error;
    }
  };

  // ✅ Aseguramos que hay usuario e ID (no opcional)
  if (!rawUser || rawUser.id === undefined || rawUser.id === null) {
    return <p>No hay usuario logueado</p>;
  }

  // ✅ Normalizamos al shape que Comments necesita
  const user: CommentsUser = {
    id: rawUser.id as any, // puede ser string o number
    name: rawUser.name ?? "Usuario", // fallback si viene null
  };

  if (loading) return <p>Cargando…</p>;

  return (
    <Comments
      user={user} // ✅ Ahora cumple el tipo exacto
      comments={comments}
      onAddComment={handleAddComment}
    />
  );
}
