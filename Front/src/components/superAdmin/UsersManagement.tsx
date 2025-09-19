"use client";

import React from "react";
import styles from "./UsersManagement.module.scss";
import { useAllUsers } from "../../hooks/superadmin/AllUsersService";

const UsersManagement: React.FC = () => {
  const { users, loading, loadingSession, userData } = useAllUsers();

  if (loadingSession) return <p>Cargando sesión...</p>;
  if (loading) return <p>Cargando usuarios...</p>;
  if (!userData?.token) return <p>No hay sesión activa</p>;
  // console.log("Informacion", userData);
  
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
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.phone}</td>
              <td>{u.role}</td>
              <td>{u.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsersManagement;
