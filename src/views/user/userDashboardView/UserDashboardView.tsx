// src/views/user/userDashboardView/UserDashboardView.tsx
"use client";

import { useEffect, useState } from "react";
import type { User } from "@/types";
import UserProfile from "@/components/userDashboard/profileUser/UserProfile";
import Classes from "@/components/userDashboard/classes/Classes";
import ClassHistory from "@/components/userDashboard/classHistory/ClassHistory";
import CommentsPage from "@/components/userDashboard/comments/CommentsPage";
import styles from "./userDashboardView.module.scss";
import { useAuth } from "@/context/AuthContext";

export default function UserDashboardview() {
  const { userData } = useAuth();

  const [currentUser, setCurrentUser] = useState<User>({
    id: 0,
    name: "",
    email: "",
    password: "",
    address: "",
    phone: "",
  });

  const [activeSection, setActiveSection] = useState<
    "profile" | "comments" | "classes" | "history"
  >("profile");

  useEffect(() => {
    if (userData?.user) {
      const u = userData.user as any;
      setCurrentUser({
        id: (u.id as any) ?? 0,
        name: u.name ?? "",
        email: u.email ?? "",
        password: "",
        address: u.address ?? "",
        phone: u.phone ?? "",
      });
    }
  }, [userData]);

  const handleUpdateUser = (updatedUser: User) => {
    setCurrentUser(updatedUser);
  };

  const renderContent = () => {
    switch (activeSection) {
      case "profile":
        return <UserProfile onUpdateUser={handleUpdateUser} />;
      case "comments":
        return <CommentsPage />;
      case "classes":
        return <Classes />;
      case "history":
        return <ClassHistory />;
      default:
        return null;
    }
  };

  return (
    <div className={styles.dashboard}>
      <header className={styles.dashboardHeader}>
        <h1>Dashboard - Bienvenido {userData?.user?.name ?? ""}</h1>
      </header>

      <div className={styles.dashboardContainer}>
        <aside className={styles.dashboardSidebar}>
          <nav className={styles.dashboardNav}>
            <ul>
              <li>
                <button
                  className={activeSection === "profile" ? "active" : ""}
                  onClick={() => setActiveSection("profile")}
                >
                  Mi Perfil
                </button>
              </li>
              <li>
                <button
                  className={activeSection === "comments" ? "active" : ""}
                  onClick={() => setActiveSection("comments")}
                >
                  Comentarios
                </button>
              </li>
              <li>
                <button
                  className={activeSection === "classes" ? "active" : ""}
                  onClick={() => setActiveSection("classes")}
                >
                  Clases Disponibles
                </button>
              </li>
              <li>
                <button
                  className={activeSection === "history" ? "active" : ""}
                  onClick={() => setActiveSection("history")}
                >
                  Historial de Clases
                </button>
              </li>
            </ul>
          </nav>
        </aside>

        <main className={styles.dashboardContent}>{renderContent()}</main>
      </div>
    </div>
  );
}
