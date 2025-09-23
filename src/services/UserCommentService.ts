//UsercommentService.ts

import type { Comentary } from "@/types";

export async function getMyComments(token: string): Promise<Comentary[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reviews/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(
        errorData?.message || `Error ${res.status}: ${res.statusText}`
      );
    }

    const data = await res.json();
    return (data.items || []).map((r: any) => ({
      id: r.id,
      userId: r.userId,
      text: r.comment ?? "",
      rating: r.rating,
      date: new Date(r.createdAt).toISOString().split("T")[0],
      user: { id: r.userId, name: r.user?.name ?? "Anonimo" },
    }));
  } catch (error) {
    console.error("Error en getMyComments:", error);
    throw error;
  }
}

export async function createComment(
  token: string,
  text: string,
  rating: number
): Promise<Comentary> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reviews`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ comment: text, rating }),
  });
  if (!res.ok) {
    const e = await res.json().catch(() => ({}));
    throw new Error(e?.message || res.statusText);
  }
  const r = await res.json();
  return {
    id: r.id,
    userId: r.userId,
    text: r.comment ?? "",
    rating: r.rating,
    date: new Date(r.createdAt).toISOString().split("T")[0],
    user: { id: r.userId, name: r.user?.name ?? "Anonimo" },
  };
}
