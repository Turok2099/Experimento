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
  const [messageType, setMessageType] = useState<
    "success" | "error" | "warning"
  >("success");

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

  // ✅ Función para cancelar edición y restaurar datos originales
  const handleCancel = () => {
    // Restaurar datos originales del usuario
    if (userData?.user) {
      setFormData({
        name: userData.user.name || "",
        email: userData.user.email || "",
        address: userData.user.address || "",
        phone: userData.user.phone || "",
      });
    }
    setIsEditing(false);
    setMessage(""); // Limpiar cualquier mensaje
    setMessageType("success");
  };

  if (!userData?.user) {
    return <p>No hay usuario logueado</p>;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((s) => ({ ...s, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = userData?.token;

    console.log("🔍 Token disponible:", token ? "Sí" : "No");

    if (!token) {
      setMessage("❌ No hay token de sesión");
      setMessageType("error");
      return;
    }

    // Solo enviar campos editables (address y phone)
    const payload: UpdateProfilePayload = {
      address: formData.address?.trim() || undefined,
      phone: formData.phone?.trim() || undefined,
    };

    // Validar que al menos un campo tenga contenido
    if (!payload.address && !payload.phone) {
      setMessage("⚠️ Debes completar al menos un campo");
      setMessageType("warning");
      return;
    }

    try {
      console.log("📡 Actualizando perfil del usuario autenticado");
      console.log("📦 Datos a actualizar:", payload);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/profile`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(
          err?.message || `Error ${res.status}: ${res.statusText}`
        );
      }

      const updatedUser: User = await res.json();

      // Actualizar el contexto global
      onUpdateUser(updatedUser);
      setUserData({ token, user: updatedUser });

      // Mostrar mensaje de éxito
      setMessage("✅ Datos actualizados correctamente");
      setMessageType("success");

      // Salir del modo edición
      setIsEditing(false);

      console.log("✅ Perfil actualizado exitosamente:", updatedUser);
    } catch (err: any) {
      console.error("❌ Error actualizando perfil:", err);
      setMessage(
        `❌ Error: ${err?.message || "No se pudieron guardar los cambios"}`
      );
      setMessageType("error");
    } finally {
      // Limpiar mensaje después de 3 segundos
      setTimeout(() => {
        setMessage("");
        setMessageType("success");
      }, 3000);
    }
  };

  return (
    <div className={styles.section}>
      <h2 className={styles.sectionTitle}>Mi Perfil</h2>
      {message && (
        <div className={styles.alert} data-type={messageType}>
          {message}
        </div>
      )}

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label>Nombre</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            disabled={true}
            onChange={handleChange}
            placeholder="Nombre no editable"
          />
        </div>

        <div className={styles.formGroup}>
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            disabled={true}
            placeholder="Email no editable"
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
            placeholder={
              isEditing
                ? "Ingresa tu dirección"
                : "Haz clic en Editar para modificar"
            }
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
            placeholder={
              isEditing
                ? "Ingresa tu teléfono"
                : "Haz clic en Editar para modificar"
            }
          />
        </div>

        {isEditing && (
          <div className={styles.buttonGroup}>
            <button type="submit" className={styles.submitButton}>
              Guardar Cambios
            </button>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={handleCancel}
            >
              Cancelar
            </button>
          </div>
        )}
      </form>

      {!isEditing && (
        <div className={styles.buttonGroup}>
          <button
            type="button"
            className={styles.submitButton}
            onClick={() => setIsEditing(true)}
          >
            Editar Datos
          </button>
        </div>
      )}
    </div>
  );
}
