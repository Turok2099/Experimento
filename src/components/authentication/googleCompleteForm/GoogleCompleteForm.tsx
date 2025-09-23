"use client";
import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { signOut } from "next-auth/react";
import styles from "./googleCompleteForm.module.scss";

interface GoogleCompleteFormProps {
  user: {
    name: string;
    email: string;
    picture?: string;
  };
}

const GoogleCompleteForm: React.FC<GoogleCompleteFormProps> = ({ user }) => {
  const [formData, setFormData] = useState({
    address: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ address?: string; phone?: string }>(
    {}
  );
  const { setUserData } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    const newErrors: { address?: string; phone?: string } = {};

    if (!formData.address.trim()) {
      newErrors.address = "La dirección es requerida";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "El teléfono es requerido";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      // Enviar datos adicionales al backend
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/google/complete`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: user.email,
            address: formData.address,
            phone: formData.phone,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Error al completar el registro");
      }

      const data = await response.json();

      console.log("✅ Datos completados exitosamente:", {
        needsCompletion: data.needsCompletion,
        hasAddress: !!data.user.address,
        hasPhone: !!data.user.phone,
      });

      // Actualizar los datos del usuario en el contexto
      setUserData({
        token: data.accessToken,
        user: data.user,
      });

      // Si ya no necesita completar datos, cerrar sesión y volver a loguear
      if (!data.needsCompletion) {
        console.log(
          "✅ Datos completados correctamente, cerrando sesión NextAuth..."
        );

        // Cerrar sesión de NextAuth para limpiar la sesión
        await signOut({ redirect: false });

        // Pequeño delay para asegurar que se cierre la sesión
        setTimeout(() => {
          console.log("🏠 Redirigiendo al home");
          window.location.href = "/";
        }, 500);
      } else {
        console.log("⚠️ Aún necesita completar datos");
        alert("Aún faltan datos por completar");
      }
    } catch (error: any) {
      console.error("Error:", error);
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <h2 className={styles.title}>Completa tu perfil</h2>
        <p className={styles.subtitle}>
          Hola <span className={styles.userName}>{user.name}</span>, necesitamos
          algunos datos adicionales para completar tu registro.
        </p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="address" className={styles.label}>
              Dirección:
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Ingresa tu dirección"
              className={styles.input}
            />
            {errors.address && <p className={styles.error}>{errors.address}</p>}
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="phone" className={styles.label}>
              Teléfono:
            </label>
            <input
              type="text"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Ingresa tu número telefónico"
              className={styles.input}
            />
            {errors.phone && <p className={styles.error}>{errors.phone}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={styles.submitButton}
          >
            {loading ? "Completando..." : "Completar registro"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default GoogleCompleteForm;
