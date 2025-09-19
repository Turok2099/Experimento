"use client";

import React from "react";
import styles from "@/styles/admin.module.scss";
import { Useradmin } from "@/types";

interface UsersTableProps {
  users: Useradmin[];
  onToggleBlockUser: (userId: string) => void;
}

export default function UsersTable({
  users,
  onToggleBlockUser,
}: UsersTableProps) {
  return (
    <div className={styles.tableContainer}>
      <table className={styles.usersTable}>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Rol</th>
            <th>Fecha de Ingreso</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.type}</td>
              <td>{new Date(user.dateregis).toLocaleDateString()}</td>
              <td>
                <span
                  className={`${styles.statusBadge} ${
                    !user.isBlocked ? styles.active : styles.inactive
                  }`}
                >
                  {!user.isBlocked ? "Activo" : "Bloqueado"}
                </span>
              </td>
              <td className={styles.actionButtons}>
                <button>Editar</button>
                <button
                  className={styles.danger}
                  onClick={() => onToggleBlockUser(String(user.id))}
                >
                  {!user.isBlocked ? "Bloquear" : "Activar"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
