import React from "react";
import AdminLayout from "@/views/admin/adminDashboardView/AdminLayout";
import MenuCard from "@/components/admin/DashboardCard";
import StatsCard from "@/components/admin/Statscard";
import styles from "@/styles/admin.module.scss";
import { FiAward, FiClipboard, FiServer, FiUsers } from "react-icons/fi";

export default function AdminDashboard() {
  const totalUsers = 152;
  const totalExercises = 58;
  const gymStatus = "Operativa";

  return (
    <AdminLayout>
      <h2>Panel de Administración</h2>
      <p className={styles.pageDescription}>
        Visión general del sistema y accesos directos a las gestiones
        principales.
      </p>

      <div className={styles.statsGrid}>
        <StatsCard
          title="Usuarios Registrados"
          value={totalUsers}
          icon={<FiUsers />}
        />
        <StatsCard
          title="Ejercicios Cargados"
          value={totalExercises}
          icon={<FiClipboard />}
        />
        <StatsCard
          title="Estado de la Sede"
          value={gymStatus}
          icon={<FiServer />}
        />
      </div>

      <div className={styles.adminMenuGrid}>
        <MenuCard
          href="/adminusers"
          icon={<FiUsers />}
          title="Gestionar Usuarios"
          description="Ver, editar, activar y desactivar miembros."
        />
        <MenuCard
          href="/admin/trainers"
          icon={<FiAward />}
          title="Gestionar Entrenadores"
          description="Administrar perfiles y horarios."
        />
      </div>
    </AdminLayout>
  );
}
