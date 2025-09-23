// /hooks/AllSubscriptionUsers.tsx

export interface SubscriptionStatus {
    user_id: string;
    status: "active" | "inactive" | "expired";
    start_at?: string;
    end_at?: string;
}

export const AllSubscriptionUsersService = {
    async getAllSubscriptionStatuses(token?: string): Promise<SubscriptionStatus[]> {
        if (!token) throw new Error("No se proporcionó token para la petición");

        const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/subscriptions`,
        {
            headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            },
            cache: "no-store",
        }
        );

        if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.message || res.statusText);
        }

        const data = await res.json();
        console.log("📡 AQUIIIII Respuesta subscriptions:", data); // para ver estructura real
        // Solo devolvemos `id` y `status`
        return (data.data || []).map((sub: any) => ({
            user_id: sub.user_id ?? sub.userId, // soporta snake_case y camelCase
            status: sub.status ?? "inactive",
            start_at: sub.start_at ?? sub.startAt ?? sub.createdAt ?? null, // mapea según lo que devuelva tu backend
            end_at: sub.end_at ?? sub.endAt ?? null,
        }));
    },
};
