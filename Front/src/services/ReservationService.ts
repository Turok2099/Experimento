// src/services/ReservationService.ts
export type ReservationStatus = 'booked' | 'attended' | 'cancelled' | 'no_show';

export type ReservationItem = {
    reservationId: string;
    status: ReservationStatus;
    createdAt: string;
    class: null | {
        id: string;
        title: string;
        date: string;       // yyyy-mm-dd
        startTime: string;  // HH:MM:SS
        endTime: string;    // HH:MM:SS
        trainerId: string;
    };
};

export type UserHistoryPaginated = {
    page: number;
    limit: number;
    total: number;
    items: ReservationItem[];
};

// El backend puede devolver paginado o arreglo directo:
export type UserHistoryResponse = UserHistoryPaginated | ReservationItem[];

const API = process.env.NEXT_PUBLIC_API_URL!;

// Agenda real
export async function getSchedule(params?: { page?: number; limit?: number; date?: string }) {
    const qs = new URLSearchParams();
    if (params?.page) qs.set("page", String(params.page));
    if (params?.limit) qs.set("limit", String(params.limit));
    if (params?.date) qs.set("date", params.date);
    const url = `${API}/classes/schedule${qs.toString() ? `?${qs}` : ""}`;

    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error((await res.json().catch(()=>({})))?.message || "Error al obtener agenda");
    return res.json(); // {page, limit, total, items:[...]}
}

// Reservar/cancelar real
export async function bookClass(token: string, classId: string) {
    const res = await fetch(`${API}/classes/${classId}/reservations`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
    });
    if (!res.ok) throw new Error((await res.json().catch(()=>({})))?.message || "No se pudo reservar");
    return res.json();
}

export async function cancelMyReservation(token: string, classId: string) {
    const res = await fetch(`${API}/classes/${classId}/reservations`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
    });
    if (!res.ok) throw new Error((await res.json().catch(()=>({})))?.message || "No se pudo cancelar");
    return res.json();
}

// Historial real
export async function getMyReservations(
    token: string,
    params?: { page?: number; limit?: number; status?: ReservationStatus }
    ): Promise<UserHistoryResponse> {
    const qs = new URLSearchParams();
    if (params?.page) qs.set("page", String(params.page));
    if (params?.limit) qs.set("limit", String(params.limit));
    if (params?.status) qs.set("status", params.status);
    const url = `${API}/reservations/me${qs.toString() ? `?${qs}` : ""}`;

    const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
    });
    if (!res.ok) {
        const msg = (await res.json().catch(()=>({})))?.message;
        throw new Error(msg || (res.status === 401 ? "Tu sesión expiró" : "No se pudo obtener el historial"));
    }
    return res.json();
}

// Helper para normalizar la respuesta
export function asItems(data: UserHistoryResponse): ReservationItem[] {
    return Array.isArray(data) ? data : Array.isArray(data?.items) ? data.items : [];
}

