// src/services/AllCommentService.ts
import type { Comentary } from "@/types";

export const AllCommentService = {
    async getAllComments(): Promise<Comentary[]> {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reviews`, { cache: "no-store" });
        
        if (!res.ok) { 
            const e = await res.json().catch(() => ({})); 
            throw new Error(e?.message || res.statusText); 
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
    },
};