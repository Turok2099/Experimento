// hooks/superadmin/users.ts
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";

export function useUpdateUser() {
  const { userData, logout } = useAuth();
  const [loading, setLoading] = useState(false);

  const updateUser = async (
    id: string,
    updates: Partial<{ name: string; email: string; phone: string }>
  ) => {
    if (!userData?.token) {
      console.warn("No hay token disponible");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userData.token}`,
          },
          body: JSON.stringify(updates),
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
      console.log("✅ Usuario actualizado:", data);
      return data;
    } catch (error) {
      console.error("Error al actualizar usuario:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { updateUser, loading };
}
