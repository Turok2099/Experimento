// hooks/superadmin/classes/useUpdateClass.ts
import { useState, useContext } from "react";
import { ClassDto } from "./useClasses";
import { AuthContext } from "@/context/AuthContext"; // <-- importa tu contexto de auth

export function useUpdateClass() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { userData } = useContext(AuthContext); // 🔑 de aquí sacamos el token
    const token = userData?.token;

    const updateClass = async (id: string, data: Partial<ClassDto>) => {
        setLoading(true);
        setError(null);

        try {
                const allowedFields = (({ title, date, startTime, endTime, capacity, goalTag }) => ({
                    title,
                    date,
                    startTime,
                    endTime,
                    capacity,
                    }))(data);

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/classes/${id}`, {
            method: "PATCH",
            headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}), // 🔑 enviamos token si existe
            },
            credentials: "include",
            body: JSON.stringify(allowedFields),
        });

        if (!res.ok) {
            const errText = await res.text();
            throw new Error(errText || "Error al actualizar la clase");
        }

        // Si backend devuelve 204 sin contenido, evitamos el crash al hacer res.json()
        let result: ClassDto | null = null;
        try {
            result = await res.json();
        } catch {
            result = null;
        }

        return result;
        } catch (err: any) {
        setError(err.message);
        throw err;
        } finally {
        setLoading(false);
        }
    };

    return { updateClass, loading, error };
}
