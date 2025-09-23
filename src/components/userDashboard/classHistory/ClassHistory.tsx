// src/components/userDashboard/classHistory/ClassHistory.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import styles from "./classHistory.module.scss";
import {
    getMyReservations,
    asItems,
    type ReservationItem,
} from "@/services/ReservationService";

type Row = { id: string; clase: string; fecha: string; status: string };

const statusLabel: Record<string, string> = {
    booked: "Reservada",
    attended: "Asistida",
    cancelled: "Cancelada",
    no_show: "No asistió",
};

function formatHHMM(hhmmss?: string) {
    if (!hhmmss) return "";
    // admite "08:00:00" -> "08:00"
    return String(hhmmss).slice(0, 5);
}

function toRow(r: ReservationItem): Row {
    const title =
        r.class?.title ??
        "Clase eliminada";

    const horario = r.class
        ? `${r.class.date} ${formatHHMM(r.class.startTime)}–${formatHHMM(r.class.endTime)}`
        : new Date(r.createdAt).toISOString().slice(0, 10);

    return {
        id: r.reservationId, // 👈 clave estable (evita randomUUID en keys)
        clase: title,
        fecha: horario,
        status: statusLabel[r.status] ?? r.status,
    };
}

export default function ClassHistory() {
    const { userData } = useAuth();
    // a veces el token viene como accessToken
    const token = userData?.accessToken || userData?.token || "";

    const [rows, setRows] = useState<Row[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Memoriza si hay token para no relanzar efectos innecesarios
    const hasToken = useMemo(() => Boolean(token), [token]);

    useEffect(() => {
        if (!hasToken) {
        setRows([]);
        setLoading(false);
        return;
        }

        const controller = new AbortController();
        setLoading(true);
        setError(null);

        (async () => {
        try {
            const data = await getMyReservations(token, { page: 1, limit: 50 });
            const items = asItems(data);
            setRows(items.map(toRow));
        } catch (e: any) {
            if (controller.signal.aborted) return;
            setError(e?.message ?? "No se pudo cargar el historial");
        } finally {
            if (!controller.signal.aborted) setLoading(false);
        }
        })();

        return () => controller.abort();
    }, [hasToken, token]);

    return (
        <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Historial de Clases</h2>

        {loading ? (
            <p className={styles.emptyMessage}>Cargando…</p>
        ) : error ? (
            <p className={styles.emptyMessage}>{error}</p>
        ) : rows.length === 0 ? (
            <p className={styles.emptyMessage}>No has asistido a ninguna clase aún.</p>
        ) : (
            <table className={styles.table}>
            <thead>
                <tr>
                <th>Clase</th>
                <th>Fecha</th>
                <th>Estado</th>
                </tr>
            </thead>
            <tbody>
                {rows.map((r) => (
                <tr key={r.id}>
                    <td>{r.clase}</td>
                    <td>{r.fecha}</td>
                    <td>
                    <span
                        className={[
                        styles.badge,
                        r.status === "Asistida" && styles.badgeSuccess,
                        r.status === "Reservada" && styles.badgeInfo,
                        (r.status === "Cancelada" || r.status === "No asistió") && styles.badgeWarn,
                        ]
                        .filter(Boolean)
                        .join(" ")}
                    >
                        {r.status}
                    </span>
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
        )}
        </div>
    );
}


