"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

export interface User {
    id: string;
    name: string;
    email: string;
    phone?:string;
    role: "user" | "coach" | "admin" | "superadmin";
    status: "active" | "inactive";
    membership?: string;
    }

export function useAllUsers() {
    const { userData, logout, loadingSession } = useAuth();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
        if (!userData?.token) {
            console.warn("No hay token disponible");
            return;
        }

        try {
            const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/users?page=1&limit=50`,
            {
                headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${userData.token}`,
                },
                cache: "no-store",
            }
            );

            if (res.status === 401) {
            logout();
            throw new Error("Sesión expirada. Vuelve a iniciar sesión.");
            }

            if (!res.ok) {
            throw new Error(`Error ${res.status}: ${res.statusText}`);
            }

            const data = await res.json();
            console.log("📡 Respuesta backend /users:", data); // 👈 aquí ves la respuesta cruda
            setUsers(Array.isArray(data.items) ? data.items : []);
        } catch (error) {
            console.error("Error al cargar usuarios:", error);
        } finally {
            setLoading(false);
        }
        };

        if (!loadingSession) fetchUsers();
    }, [userData, logout, loadingSession]);

    return { users, loading, loadingSession, userData };
}
