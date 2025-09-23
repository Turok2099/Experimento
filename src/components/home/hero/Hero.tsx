'use client'
import styles from "./hero.module.scss";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";


const Hero = () => {
  const { userData } = useAuth();
  const router = useRouter();

  const handleClick = () => {
    if (userData) {
      // usuario logueado ir al home
      router.push("/");
    } else {
      // ysuario no logueado ir a registro
      router.push("/register");
    }
    };

  return (
    <section className={styles.hero}>
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
                <button className={styles.ctaButton} onClick={() => router.push("/")}>
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
