"use client";

import React from "react";
import { useRouter } from "next/navigation";
import styles from "./SubscriptionSuccess.module.scss";

export default function SubscriptionSuccessPage() {
  const router = useRouter();

  const handleGoToDashboard = () => {
    router.push("/dashboard");
  };

  const handleGoToCourses = () => {
    router.push("/courses");
  };

  return (
    <div className={styles.contSuccessView}>
      <div className={styles.mainContent}>
        {/* Panel izquierdo - Card de bienvenida */}
        <div className={styles.welcomeCard}>
          <div className={styles.welcomeContent}>
            <h2 className={styles.welcomeTitle}>
              ¡Bienvenido a TrainUp Premium!
            </h2>
            <p className={styles.welcomeSubtitle}>
              Tu suscripción ha sido activada exitosamente. Ahora tienes acceso
              completo a todos nuestros cursos y contenido premium.
            </p>
            <p className={styles.welcomeText}>
              ¡Comienza tu transformación hoy mismo!
            </p>
          </div>
          <div className={styles.decorativeCircles}>
            <div className={styles.circle1}></div>
            <div className={styles.circle2}></div>
          </div>
        </div>

        {/* Panel derecho - Información de éxito */}
        <div className={styles.formSection}>
          <div className={styles.successCard}>
            <div className={styles.successIcon}>🎉</div>

            <h1 className={styles.title}>¡Suscripción Exitosa!</h1>

            <p className={styles.message}>
              ¡Bienvenido a TrainUp Premium! Tu suscripción ha sido activada y
              ya tienes acceso a todo nuestro contenido premium.
            </p>

            <div className={styles.benefits}>
              <h3>Lo que puedes hacer ahora:</h3>
              <ul>
                <li>✅ Acceder a todos los cursos premium</li>
                <li>✅ Descargar materiales exclusivos</li>
                <li>✅ Obtener certificados de finalización</li>
                <li>✅ Recibir soporte prioritario</li>
                <li>✅ Participar en eventos exclusivos</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
