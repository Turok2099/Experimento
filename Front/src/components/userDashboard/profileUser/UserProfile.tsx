"use client";
import type React from "react";
import { useState, useEffect } from "react";
import type { User } from "../../../types/index";
import styles from "./userProfile.module.scss";
import { useAuth } from "@/context/AuthContext";

interface UserProfileProps {
    onUpdateUser: (updatedUser: User) => void;
}

//NICOLE
type UpdateProfilePayload = {
    name?: string;
    address?: string;
    phone?: string;
};

export default function UserProfile({ onUpdateUser }: UserProfileProps) {
    const { userData, setUserData } = useAuth();

    // ✅ Hooks
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    phone: "",
    });
    const [message, setMessage] = useState("");

    // ✅ Cargar datos desde userData.user
    useEffect(() => {
        if (userData?.user) {
        setFormData({
        name: userData.user.name || "",
        email: userData.user.email || "",
        address: userData.user.address || "",
        phone: userData.user.phone || "",
        });
        }
    }, [userData]);

    if (!userData?.user) {
        return <p>No hay usuario logueado</p>;
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((s) => ({ ...s, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
const token = userData?.token; // debe ser el access token STRING
    if (!token) {
        setMessage("No hay token de sesión");
        return;
    }

    const payload: UpdateProfilePayload = {
        name: formData.name?.trim() || undefined,
        address: formData.address?.trim() || undefined,
        phone: formData.phone?.trim() || undefined,
    };
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/profile`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
        });

        if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.message || `Error ${res.status} ${res.statusText}`);
        }

        const updatedUser: User = await res.json();
        onUpdateUser(updatedUser);
        setUserData({ token, user: updatedUser });
        setMessage("Datos actualizados correctamente");
        setIsEditing(false);
    } catch (err: any) {
        setMessage(err?.message || "Error actualizando datos");
    } finally {
        setTimeout(() => setMessage(""), 3000);
    }
    };

    return (
        <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Mi Perfil</h2>
        {message && <div className={styles.alert}>{message}</div>}

        <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
            <label>Nombre</label>
            <input
                type="text"
                name="name"
                value={formData.name}
                disabled
                onChange={handleChange}
            />
            </div>

            <div className={styles.formGroup}>
            <label>Email</label>
            <input
                type="email"
                name="email"
                value={formData.email}
                disabled // <- el backend NO lo cambia aquí
                placeholder="El email no se edita desde este formulario"
            />
            </div>

            <div className={styles.formGroup}>
            <label>Dirección</label>
            <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                disabled={!isEditing}
            />
            </div>

            <div className={styles.formGroup}>
            <label>Teléfono</label>
            <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                disabled={!isEditing}
            />
            </div>

            {isEditing ? (
            <div className={styles.buttonGroup}>
                <button type="submit" className={styles.submitButton}>
                Guardar Cambios
                </button>
                <button
                type="button"
                className={styles.cancelButton}
                onClick={() => setIsEditing(false)}
                >
                Cancelar
                </button>
            </div>
            ) : (
            <button
                type="button"
                className={styles.submitButton}
                onClick={() => setIsEditing(true)}
            >
                Editar Datos
            </button>
            )}
        </form>
        </div>
    );
}
