"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import "./layout.scss";

interface CoachLayoutProps {
  children: React.ReactNode;
}

export default function CoachLayout({ children }: CoachLayoutProps) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  return (
    <div className="coach-layout">
     <div
        className={`overlay ${menuOpen ? "show" : ""}`}
        onClick={toggleMenu}
      ></div>

      {/* Botón hamburguesa solo en móvil */}
      <button
        className={`hamburger ${menuOpen ? "open" : ""}`}
        onClick={toggleMenu}
      >
        ☰
      </button>

      {/* Sidebar lateral */}
      <aside className={`sidebar ${menuOpen ? "open" : ""}`}>
        <h2 className="sidebar-title">PERFIL COACH</h2>
        <nav className="nav">
          <Link href="/coach" className={pathname === "/coach" ? "active" : ""}>
            PERFIL
          </Link>
          <Link
            href="/coach/classeCoach"
            className={pathname === "/coach/classeCoach" ? "active" : ""}
          >
            CLASES
          </Link>
          <Link
            href="/coach/sinCoach"
            className={pathname === "/coach/sinCoach" ? "active" : ""}
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
