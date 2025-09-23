"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import "./layout.scss";

interface CoachLayoutProps {
  children: React.ReactNode;
}

export default function CoachLayout({ children }: CoachLayoutProps) {
  const pathname = usePathname();

  return (
    <div className="coach-layout">
      {/* ✅ Sidebar solo en /coach */}
      <aside className="sidebar">
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

      {/* ✅ Contenido dinámico */}
      <main className="content">{children}</main>
    </div>
  );
}
