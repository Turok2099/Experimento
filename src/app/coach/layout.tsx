"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMenu } from "@/context/MenuContext";
import "./layout.scss";

interface CoachLayoutProps {
  children: React.ReactNode;
}

export default function CoachLayout({ children }: CoachLayoutProps) {
  const pathname = usePathname();
  const { coachMenuOpen, openCoachMenu, closeAllMenus } = useMenu();

  const toggleMenu = () => {
    if (coachMenuOpen) {
      closeAllMenus();
    } else {
      openCoachMenu();
    }
  };

  return (
    <div className="coach-layout">
      <div
        className={`overlay ${coachMenuOpen ? "show" : ""}`}
        onClick={closeAllMenus}
      ></div>

      {/* Botón hamburguesa solo en móvil */}
      <button
        className={`hamburger ${coachMenuOpen ? "open" : ""}`}
        onClick={toggleMenu}
      >
        ☰
      </button>

      {/* Sidebar lateral */}
      <aside className={`sidebar ${coachMenuOpen ? "open" : ""}`}>
        <h2 className="sidebar-title">PERFIL COACH</h2>
        <nav className="nav">
          <Link
            href="/coach"
            className={pathname === "/coach" ? "active" : ""}
            onClick={closeAllMenus}
          >
            PERFIL
          </Link>
          <Link
            href="/coach/classeCoach"
            className={pathname === "/coach/classeCoach" ? "active" : ""}
            onClick={closeAllMenus}
          >
            CLASES
          </Link>
          <Link
            href="/coach/sinCoach"
            className={pathname === "/coach/sinCoach" ? "active" : ""}
            onClick={closeAllMenus}
          >
            DISPONIBLES
          </Link>
        </nav>
      </aside>

      {/* Contenido principal */}
      <main className="content">{children}</main>
    </div>
  );
}
