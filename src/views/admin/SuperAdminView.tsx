"use client";
import React, { useState, useMemo, memo } from "react";
import styles from "./SuperAdminView.module.scss";

import UsersManagement from "../../components/superAdmin/ManageUsers/UsersManagement";
import ClassesManagement from "../../components/superAdmin/ManageClasses/ClassesManagement";
import PlansManagement from "../../components/superAdmin/ManagePlans/PlansManagement";
import ReviewsManagement from "../../components/superAdmin/ManageReviews/ReviewsManagement";
import ExercisesManagement from "@/components/superAdmin/ManageExercises/ExercisesManagement";
import { useAuth } from "@/context/AuthContext";

const SuperAdminView: React.FC = () => {
  // Estado para controlar la sección activa
  const [activeSection, setActiveSection] = useState("users");
  // Estado para controlar el menú móvil
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Obtener el token del contexto de autenticación
  const { userData } = useAuth();
  const token = userData?.token || "";

  // Renderiza la sección según lo seleccionado en el menú - memoizado para evitar re-renders
  const renderSection = useMemo(() => {
    switch (activeSection) {
      case "users":
        return <UsersManagement />;
      case "classes":
        return <ClassesManagement />;
      case "exercises":
        return <ExercisesManagement />;
      case "plans":
        return <PlansManagement token={token} />;
      case "reviews":
        return <ReviewsManagement token={token} />;
      default:
        return <div>Selecciona una opción</div>;
    }
  }, [activeSection, token]);

  return (
    <div className={styles.container}>
      {/* Overlay para móvil */}
      {isMobileMenuOpen && (
        <div
          className={styles.overlay}
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`${styles.sidebar} ${
          isMobileMenuOpen ? styles.sidebarOpen : ""
        }`}
      >
        <h2 className={styles.logo}>Consola de Administrador</h2>
        <nav className={styles.menu}>
          <button
            className={`${styles.menuItem} ${
              activeSection === "users" ? styles.active : ""
            }`}
            onClick={() => {
              setActiveSection("users");
              setIsMobileMenuOpen(false);
            }}
          >
            Usuarios
          </button>
          <button
            className={`${styles.menuItem} ${
              activeSection === "classes" ? styles.active : ""
            }`}
            onClick={() => {
              setActiveSection("classes");
              setIsMobileMenuOpen(false);
            }}
          >
            Clases
          </button>
          <button
            className={`${styles.menuItem} ${
              activeSection === "exercises" ? styles.active : ""
            }`}
            onClick={() => {
              setActiveSection("exercises");
              setIsMobileMenuOpen(false);
            }}
          >
            Ejercicios
          </button>
          <button
            className={`${styles.menuItem} ${
              activeSection === "plans" ? styles.active : ""
            }`}
            onClick={() => {
              setActiveSection("plans");
              setIsMobileMenuOpen(false);
            }}
          >
            Planes
          </button>
          <button
            className={`${styles.menuItem} ${
              activeSection === "reviews" ? styles.active : ""
            }`}
            onClick={() => {
              setActiveSection("reviews");
              setIsMobileMenuOpen(false);
            }}
          >
            Reseñas
          </button>
        </nav>
      </aside>

      {/* Contenido principal */}
      <main className={styles.content}>
        <div className={styles.titleContainer}>
          <h1 className={styles.title}>Panel de Administrador</h1>
          {/* Botón hamburguesa para móvil */}
          <button
            className={styles.mobileMenuButton}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            ☰
          </button>
        </div>
        <div className={styles.section}>{renderSection}</div>
      </main>
    </div>
  );
};

export default memo(SuperAdminView);
