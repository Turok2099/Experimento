"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import AdminLayout from "@/views/admin/adminDashboardView/AdminLayout";
import UsersTable from "@/components/usersTable/UsersTable";
import styles from "@/styles/admin.module.scss";
import { Useradmin } from "@/types";

export default function UsersPage() {
  const { data: session } = useSession();

  const [users, setUsers] = useState<Useradmin[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchUsers = useCallback(async () => {
    if (!session) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/users", {
        headers: {
          Authorization: `Bearer ${session.backendJWT}`,
        },
      });

      if (!response.ok) {
        throw new Error("No se pudieron cargar los usuarios");
      }
      const data = await response.json();
      setUsers(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [session]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleToggleBlockUser = async (userId: string) => {
    const user = users.find((u) => u.id === userId);
    if (!user || !session?.backendJWT) return;

    try {
      const response = await fetch(`/api/users/${userId}/block`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.backendJWT}`,
        },
        body: JSON.stringify({ isBlocked: !user.isBlocked }),
      });

      if (!response.ok)
        throw new Error("No se pudo actualizar el estado del usuario.");

      fetchUsers();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const filteredUsers = useMemo(() => {
    if (!searchTerm) return users;
    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, users]);

  if (isLoading)
    return (
      <AdminLayout>
        <p>Cargando lista de usuarios...</p>
      </AdminLayout>
    );
  if (error)
    return (
      <AdminLayout>
        <p>Error: {error}</p>
      </AdminLayout>
    );

  return (
    <AdminLayout>
      <div className={styles.pageHeader}>
        <h2>Listado de Usuarios</h2>
        <p>Total de usuarios: {users.length}</p>
      </div>
      <div className={styles.searchBarContainer}>
        <input
          type="text"
          placeholder="Buscar por nombre o email..."
          className={styles.searchInput}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <UsersTable
        users={filteredUsers}
        onToggleBlockUser={handleToggleBlockUser}
      />
    </AdminLayout>
  );
}
