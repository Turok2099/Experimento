"use client";
import React, { useState } from "react";
import styles from "./SuperAdminView.module.scss";

import UsersManagement from "../../components/superAdmin/ManageUsers/UsersManagement";
import ClassesManagement from "../../components/superAdmin/ManageClasses/ClassesManagement";
import PlansManagement from "../../components/superAdmin/ManagePlans/PlansManagement";
import ReviewsManagement from "../../components/superAdmin/ManageReviews/ReviewsManagement";
import CrearEjercicioForm from "@/components/superAdmin/ManageExercise/CreateEjercice";

const SuperAdminView: React.FC = () => {
  // Estado para controlar la sección activa
  const [activeSection, setActiveSection] = useState("users");

  // Renderiza la sección según lo seleccionado en el menú
  const renderSection = () => {
    switch (activeSection) {
      case "users":
        return <UsersManagement />;
      case "classes":
        return <ClassesManagement />;
      case "exercises":
        return <CrearEjercicioForm />;
      case "plans":
        return <PlansManagement token="" />;
      case "reviews":
        return <ReviewsManagement />;
      default:
        return <div>Selecciona una opción</div>;
    }
  };

  return (
    <div className={styles.container}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <h2 className={styles.logo}>Consola de Administrador</h2>
        <nav className={styles.menu}>
          <button
            className={`${styles.menuItem} ${
              activeSection === "users" ? styles.active : ""
            }`}
            onClick={() => setActiveSection("users")}
          >
            Usuarios
          </button>
          <button
            className={`${styles.menuItem} ${
              activeSection === "classes" ? styles.active : ""
            }`}
            onClick={() => setActiveSection("classes")}
          >
            Clases
          </button>
          <button
            className={`${styles.menuItem} ${
              activeSection === "exercises" ? styles.active : ""
            }`}
            onClick={() => setActiveSection("exercises")}
          >
            Ejercicios
          </button>
          <button
            className={`${styles.menuItem} ${
              activeSection === "plans" ? styles.active : ""
            }`}
            onClick={() => setActiveSection("plans")}
          >
            Planes
          </button>
          <button
            className={`${styles.menuItem} ${
              activeSection === "reviews" ? styles.active : ""
            }`}
            onClick={() => setActiveSection("reviews")}
          >
            Reseñas
          </button>
        </nav>
      </aside>

      {/* Contenido principal */}
      <main className={styles.content}>
        <h1 className={styles.title}>Panel de Administrador</h1>
        <div className={styles.section}>{renderSection()}</div>
      </main>
    </div>
  );
};

export default SuperAdminView;