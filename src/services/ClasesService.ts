// src/services/ClasesService.ts

export interface ClaseAPI {
  id: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  trainerName: string;
  capacity: number;
}

const API = process.env.NEXT_PUBLIC_API_URL!;

export class ClasesService {
  // Obtener todas las clases disponibles
  static async getAllClasses(): Promise<ClaseAPI[]> {
    const res = await fetch(`${API}/classes`, {
      cache: "no-store",
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData?.message || "Error al obtener clases");
    }

    const data = await res.json();
    return data.items || data || [];
  }

  // Obtener la agenda del usuario (clases reservadas)
  static async getMyAgenda(token: string): Promise<ClaseAPI[]> {
    const res = await fetch(`${API}/reservations/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData?.message || "Error al obtener agenda");
    }

    const data = await res.json();
    const reservations = Array.isArray(data) ? data : data.items || [];

    // Transformar las reservas en formato ClaseAPI
    return reservations.map((reservation: any) => ({
      id: reservation.class?.id || reservation.reservationId,
      title: reservation.class?.title || "Clase",
      date: reservation.class?.date || "",
      startTime: reservation.class?.startTime || "",
      endTime: reservation.class?.endTime || "",
      trainerName: reservation.class?.trainerName || "Entrenador",
      capacity: reservation.class?.capacity || 0,
    }));
  }

  // Reservar una clase
  static async takeClass(token: string, classId: string): Promise<any> {
    const res = await fetch(`${API}/classes/${classId}/reservations`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData?.message || "No se pudo reservar la clase");
    }

    return res.json();
  }

  // Cancelar una clase reservada
  static async cancelClass(token: string, classId: string): Promise<any> {
    const res = await fetch(`${API}/classes/${classId}/reservations`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData?.message || "No se pudo cancelar la clase");
    }

    return res.json();
  }

  // Asignarse como entrenador de una clase
  static async assignMeAsTrainer(token: string, classId: string): Promise<any> {
    const res = await fetch(`${API}/classes/${classId}/assign-me`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData?.message || "No se pudo asignar como entrenador");
    }

    return res.json();
  }

  // Desasignarse como entrenador de una clase
  static async unassignTrainer(token: string, classId: string): Promise<any> {
    const res = await fetch(`${API}/classes/${classId}/unassign-me`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData?.message || "No se pudo desasignar como entrenador");
    }

    return res.json();
  }
}

