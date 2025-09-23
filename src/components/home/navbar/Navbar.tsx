"use client";
import React, { useState } from "react";
import styles from "./navbar.module.scss";
import Link from "next/link";
import { FaRegUser } from "react-icons/fa";
import { IoIosFitness } from "react-icons/io";
import { HiLogout } from "react-icons/hi";
import { signOut } from "next-auth/react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useSessionSync } from "@/hooks/useSessionSync";

// 🔹 Definición de rutas visibles según rol
const roleLinks: Record<string, { href: string; label: string }[]> = {
  admin: [
    { href: "/routine", label: "Rutina" },
    { href: "/superadmin", label: "Consola Administrador" },
  ],
  member: [
    { href: "/userDashboard", label: "Perfil Usuario" },
    { href: "/routine", label: "Rutina" },
  ],
};

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { userData, setUserData } = useAuth();
  const router = useRouter();

  // Sincronizar sesión con NextAuth
  useSessionSync();

  // Función para cerrar el menú
  const closeMenu = () => {
    setOpen(false);
  };

  const handleLogout = async () => {
    try {
      await signOut({ redirect: false, callbackUrl: "/" });
      setUserData(null);
      localStorage.removeItem("userSession");
      Cookies.remove("userSession");
      closeMenu(); // Cerrar menú después del logout
      router.push("/");
      alert("Has cerrado sesión exitosamente");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      alert("Error al cerrar sesión");
    }
  };

  return (
    <div className={styles.navbar}>
      <nav className={styles.contLogo}>
        <Link className={styles.logo} href="/">
          <IoIosFitness size={40} />
          TrainUp
        </Link>
      </nav>

      {/* Botón hamburguesa móvil */}
      <div className={styles.hamburger} onClick={() => setOpen(!open)}>
        <div></div>
        <div></div>
        <div></div>
      </div>

      {/* Overlay para cerrar el menú */}
      {open && <div className={styles.overlay} onClick={closeMenu}></div>}

      <nav className={`${styles.contLinks} ${open ? styles.open : ""}`}>
        {/* 🔹 Si no hay sesión → mostrar links públicos */}
        {!userData && (
          <>
            <Link className={styles.link} href="/contact" onClick={closeMenu}>
              Contacto
            </Link>
            <Link className={styles.link} href="/register" onClick={closeMenu}>
              Registrarse
            </Link>
            <Link className={styles.link} href="/login" onClick={closeMenu}>
              Iniciar Sesión
            </Link>
          </>
        )}

        {/* 🔹 Si hay sesión → mostrar solo links permitidos por rol */}
        {userData && (
          <>
            {roleLinks[userData.user?.role ?? ""]?.map((link) => (
              <Link
                key={link.href}
                className={styles.link}
                href={link.href}
                onClick={closeMenu}
              >
                {link.label}
              </Link>
            ))}

            <span className={styles.nombreUser}>
              {userData.user?.name} <FaRegUser size={22} />
            </span>

            <button className={styles.logoutBtn} onClick={handleLogout}>
              <HiLogout className={styles.logoutIcon} size={28} />
              <span className={styles.logoutText}>Cerrar sesión</span>
            </button>
          </>
        )}
      </nav>
    </div>
  );
};

export default Navbar;
