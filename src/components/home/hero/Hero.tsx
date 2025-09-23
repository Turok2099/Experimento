"use client";
import styles from "./hero.module.scss";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useRef } from "react";

const Hero = () => {
  const { userData } = useAuth();
  const router = useRouter();
  const heroRef = useRef<HTMLElement>(null);

  const handleClick = () => {
    if (userData) {
      // usuario logueado ir al home
      router.push("/");
    } else {
      // ysuario no logueado ir a registro
      router.push("/register");
    }
  };

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          if (heroRef.current && window.innerWidth > 1024) {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.3; // Velocidad del parallax más suave
            heroRef.current.style.transform = `translate3d(0, ${rate}px, 0)`;
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    // Solo aplicar parallax en desktop
    if (window.innerWidth > 1024) {
      window.addEventListener("scroll", handleScroll, { passive: true });
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, []);

  return (
    <section className={styles.hero} ref={heroRef}>
      <div className={styles.heroContainer}>
        <div className={styles.heroContent}>
          <div className={styles.textContent}>
            <div className={styles.titleGroup}>
              <h1>TrainUp</h1>
              <h2>GIMNASIO Y CENTRO FITNESS</h2>
            </div>

            <div className={styles.descriptionGroup}>
              <h3>MANTEN TU CUERPO SANO Y ATLETICO</h3>
            </div>

            <div className={styles.buttonGroup}>
              {userData ? (
                <button
                  className={styles.ctaButton}
                  onClick={() => router.push("/")}
                >
                  ¡Únete y siente la diferencia!
                </button>
              ) : (
                <Link href="/register" className={styles.ctaButton}>
                  ¡Únete y siente la diferencia!
                </Link>
              )}
            </div>
          </div>
        </div>
        <div className={styles.imageSection}>
          {/* Espacio reservado para imagen futura */}
        </div>
      </div>
    </section>
  );
};

export default Hero;
