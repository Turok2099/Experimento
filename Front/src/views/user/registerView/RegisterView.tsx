"use client";

// RegisterView
import RegisterForm from "@/components/authentication/registerForm/RegisterForm";
import React, { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import styles from "./registerView.module.scss";

const RegisterView = () => {
  const searchParams = useSearchParams();
  const alertShown = useRef(false);

  useEffect(() => {
    // Verificar si viene de /subscription y mostrar alert DESPUÉS de cargar
    const fromSubscription = searchParams.get("from") === "subscription";

    console.log("🔍 RegisterView useEffect:", {
      fromSubscription,
      searchParams: searchParams.toString(),
      url: window.location.href,
      alertShown: alertShown.current,
    });

    if (fromSubscription && !alertShown.current) {
      console.log("✅ Mostrando alert...");
      alertShown.current = true;

      // Delay para que la página se cargue completamente antes del alert
      setTimeout(() => {
        console.log("🚨 Ejecutando alert...");
        alert("Regístrate antes de suscribirte");
      }, 500);
    } else if (fromSubscription && alertShown.current) {
      console.log("⚠️ Alert ya se mostró anteriormente");
    } else {
      console.log("❌ No viene de subscription");
    }
  }, [searchParams]);
  return (
    <>
      <div className={styles.contRegisterView}>
        <div className={styles.mainContent}>
          {/* Panel izquierdo - Card de bienvenida */}
          <div className={styles.welcomeCard}>
            <div className={styles.welcomeContent}>
              <h2 className={styles.welcomeTitle}>¡Bienvenido a TrainUp!</h2>
              <p className={styles.welcomeSubtitle}>
                Empieza hoy tu camino hacia un cuerpo más fuerte y una mente más
                sana.
              </p>
              <p className={styles.welcomeText}>
                ¡Regístrate gratis y únete a nuestra comunidad de fitness!
              </p>
            </div>
            <div className={styles.decorativeCircles}>
              <div className={styles.circle1}></div>
              <div className={styles.circle2}></div>
            </div>
          </div>

          {/* Panel derecho - Formulario */}
          <div className={styles.formSection}>
            <RegisterForm />
          </div>
        </div>
      </div>
    </>
  );
};

export default RegisterView;
