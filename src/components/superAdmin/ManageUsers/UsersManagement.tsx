"use client";

import React, { useEffect, useState } from "react";
import styles from "./UsersManagement.module.scss";
import { useAllUsers } from "../../../hooks/superadmin/users/AllUsersService";
import {
  AllSubscriptionUsersService,
  SubscriptionStatus,
} from "@/hooks/superadmin/users/AllSubscriptionUsers";
import { Pencil } from "lucide-react";
import { User } from "next-auth";
import { useUpdateUser } from "@/hooks/superadmin/users/UpdateAdminUsers";

const UsersManagement: React.FC = () => {
  const {
    users: initialUsers,
    loading,
    loadingSession,
    userData,
  } = useAllUsers();
  const [subs, setSubs] = useState<SubscriptionStatus[]>([]);
  const [loadingSubs, setLoadingSubs] = useState(false);

  const [users, setUsers] = useState<User[]>([]);
  //estado para manejar edicion
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<string>("");
  const { updateUser, loading: updating } = useUpdateUser();

  // Estado de edición { [userId]: { field: "name" | "email" | "phone", value: string } }
  const [editing, setEditing] = useState<{
    [key: string]: { field: string; value: string } | null;
  }>({});

  // cada vez que cambie la data del hook, sincronizamos el estado local
  useEffect(() => {
    console.log("🎯 Cambió initialUsers:", initialUsers);
    if (initialUsers.length > 0) {
      setUsers((prev) => {
        const same = JSON.stringify(prev) === JSON.stringify(initialUsers);
        console.log("¿Es igual?", same);
        return same ? prev : initialUsers;
      });
    }
  }, [initialUsers]);

  //traemos subscripciones
  useEffect(() => {
    if (!userData?.token) return;

    const fetchSubs = async () => {
      try {
        setLoadingSubs(true);
        const data =
          await AllSubscriptionUsersService.getAllSubscriptionStatuses(
            userData.token
          );
        setSubs(data);
      } catch (error) {
        console.error("Error cargando subscripciones:", error);
      } finally {
        setLoadingSubs(false);
      }
    };

    fetchSubs();
  }, [userData]);

  if (loadingSession) return <p>Cargando sesión...</p>;
  if (loading) return <p>Cargando usuarios...</p>;
  if (!userData?.token) return <p>No hay sesión activa</p>;
  // console.log("Informacion", userData);

  //mapeamos cada usuario con su estado
  const getSubscriptionStatus = (userId: string) => {
    const sub = subs.find((s) => s.user_id === userId);
    // console.log("Comparando:", { userId, subs }); debug
    return {
      status: sub?.status ?? "sin suscripción",
      start_at: sub?.start_at ?? "N/A",
      end_at: sub?.end_at ?? "N/A",
    };
  };

  //Función para actualizar rol
  const updateUserRole = async (userId: string, newRole: string) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/${userId}/role`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userData?.token}`,
          },
          body: JSON.stringify({ role: newRole }),
        }
      );

      if (!res.ok) {
        throw new Error(`Error al actualizar rol: ${res.statusText}`);
      }

      console.log(`✅ Rol actualizado para usuario ${userId}: ${newRole}`);

      // Actualizar el estado local para reflejar el cambio inmediatamente
      setUsers((prevUsers) =>
        prevUsers.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
      );

      // Cerrar editor
      setEditingUserId(null);

      // Opcional: recargar lista de usuarios o actualizar localmente
      // Aquí puedes refrescar con fetchUsers() si lo extraes como hook compartido
    } catch (error) {
      console.error("Error al cambiar el rol:", error);
    }
  };

  // Guardar cambios en backend y estado local
  const handleSave = async (id: string, field: "name" | "email" | "phone") => {
    const editInfo = editing[id];
    if (!editInfo || editInfo.field !== field) return;

    try {
      const updatedUser = await updateUser(id, {
        [field]: editInfo.value,
      });
      setUsers((prev) =>
        prev.map((u) =>
          u.id === String(id) ? { ...u, [field]: updatedUser[field] } : u
        )
      );
      setEditing((prev) => ({ ...prev, [id]: null }));
    } catch (err) {
      alert("Error al actualizar usuario");
    }
  };

  function formatDate(dateString?: string | null) {
    if (!dateString) return "—"; // protege contra null/undefined
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "—"; // protege contra valores inválidos
    return new Intl.DateTimeFormat("es-CO", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Gestión de Usuarios</h2>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Telefono</th>
            <th>Rol</th>
            <th>Estado Subscripcion</th>
            <th>Fecha Inicio</th>
            <th>Fecha Finalizada</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => {
            const subInfo = getSubscriptionStatus(u.id);
            return (
              <tr key={u.id}>
                {/* ====== NAME ====== */}
                <td>
                  {editing[String(u.id)]?.field === "name" ? (
                    <>
                      <input
                        type="text"
                        value={editing[String(u.id)]?.value || ""}
                        onChange={(e) =>
                          setEditing((prev) => ({
                            ...prev,
                            [u.id]: { field: "name", value: e.target.value },
                          }))
                        }
                      />
                      <button
                        onClick={() => handleSave(u.id, "name")}
                        disabled={updating}
                      >
                        {updating ? "Guardando..." : "Guardar"}
                      </button>
                    </>
                  ) : (
                    <span>
                      {u.name}{" "}
                      <Pencil
                        size={16}
                        className={styles.editIcon}
                        onClick={() =>
                          setEditing((prev) => ({
                            ...prev,
                            [u.id]: { field: "name", value: u.name || "" },
                          }))
                        }
                      />
                    </span>
                  )}
                </td>

                {/* ====== EMAIL ====== */}
                <td>
                  {editing[String(u.id)]?.field === "email" ? (
                    <>
                      <input
                        type="text"
                        value={editing[String(u.id)]?.value || ""}
                        onChange={(e) =>
                          setEditing((prev) => ({
                            ...prev,
                            [u.id]: { field: "email", value: e.target.value },
                          }))
                        }
                      />
                      <button
                        onClick={() => handleSave(u.id, "email")}
                        disabled={updating}
                      >
                        {updating ? "Guardando..." : "Guardar"}
                      </button>
                    </>
                  ) : (
                    <span>
                      {u.email}{" "}
                      <Pencil
                        size={16}
                        className={styles.editIcon}
                        onClick={() =>
                          setEditing((prev) => ({
                            ...prev,
                            [u.id]: { field: "email", value: u.email || "" },
                          }))
                        }
                      />
                    </span>
                  )}
                </td>

                {/* ====== PHONE ====== */}
                <td>
                  {editing[String(u.id)]?.field === "phone" ? (
                    <>
                      <input
                        type="text"
                        value={editing[String(u.id)]?.value || ""}
                        onChange={(e) =>
                          setEditing((prev) => ({
                            ...prev,
                            [u.id]: { field: "phone", value: e.target.value },
                          }))
                        }
                      />
                      <button
                        onClick={() => handleSave(u.id, "phone")}
                        disabled={updating}
                      >
                        {updating ? "Guardando..." : "Guardar"}
                      </button>
                    </>
                  ) : (
                    <span>
                      {(u as any).phone || "N/A"}{" "}
                      <Pencil
                        size={16}
                        className={styles.editIcon}
                        onClick={() =>
                          setEditing((prev) => ({
                            ...prev,
                            [u.id]: {
                              field: "phone",
                              value: (u as any).phone || "",
                            },
                          }))
                        }
                      />
                    </span>
                  )}
                </td>
                {/* <td>{u.role}</td> */}
                <td>
                  {editingUserId === u.id ? (
                    <div className={styles.roleEditor}>
                      <select
                        value={selectedRole}
                        onChange={(e) => setSelectedRole(e.target.value)}
                      >
                        <option value="admin">Admin</option>
                        <option value="trainer">Trainer</option>
                        <option value="member">Member</option>
                      </select>
                      <button
                        className={styles.saveBtn}
                        onClick={() => updateUserRole(u.id, selectedRole)}
                      >
                        Guardar
                      </button>
                    </div>
                  ) : (
                    <div className={styles.roleDisplay}>
                      <span>{(u as any).role || "N/A"}</span>
                      <button
                        className={styles.editBtn}
                        onClick={() => {
                          setEditingUserId(u.id);
                          setSelectedRole((u as any).role || "");
                        }}
                      >
                        <Pencil size={16} />
                      </button>
                    </div>
                  )}
                </td>
                <td>{subInfo.status}</td>
                <td>{formatDate(subInfo.start_at)}</td>
                <td>{formatDate(subInfo.end_at)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default UsersManagement;
