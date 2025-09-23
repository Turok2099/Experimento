"use client";

import React from "react";
import Link from "next/link";
import styles from "./PaymentCancel.module.scss";

export default function PaymentCancelPage() {
  const handleRetryPayment = () => {
    // Redirigir a la página de suscripción
    window.location.href = "/subscription";
  };

  const handleBackToHome = () => {
    window.location.href = "/";
  };

  return (
    <div className={styles.container}>
      <div className={styles.mainContent}>
        {/* Panel izquierdo - Información principal */}
        <div className={styles.leftSection}>
          <div className={styles.cancelIcon}>
            <div className={styles.xMark}>
              <div className={styles.xMarkLine1}></div>
              <div className={styles.xMarkLine2}></div>
            </div>
          </div>

          <h1 className={styles.title}>Pago Cancelado</h1>

          <p className={styles.message}>
            Tu pago ha sido cancelado. No se realizó ningún cargo a tu tarjeta.
          </p>

          <div className={styles.actions}>
            <button
              onClick={handleRetryPayment}
              className={styles.primaryButton}
            >
              Intentar Nuevamente
            </button>

            <button
              onClick={handleBackToHome}
              className={styles.secondaryButton}
            >
              Volver al Inicio
            </button>
          </div>
        </div>

        {/* Panel derecho - Información adicional */}
        <div className={styles.rightSection}>
          <div className={styles.infoCard}>
            <h3>Posibles razones:</h3>
            <ul className={styles.reasonsList}>
              <li>❌ Cancelaste el proceso de pago</li>
              <li>❌ Hubo un problema con tu tarjeta</li>
              <li>❌ La sesión expiró</li>
              <li>❌ Error de conexión</li>
            </ul>
          </div>

          <div className={styles.helpCard}>
            <h3>¿Necesitas Ayuda?</h3>
            <p>Si tienes problemas con el pago:</p>
            <ul className={styles.helpList}>
              <li>🔧 Verificar que tu tarjeta esté activa</li>
              <li>💳 Intentar con otra tarjeta</li>
              <li>📞 Contactar a tu banco</li>
              <li>
                📧{" "}
                <Link href="/contact" className={styles.helpLink}>
                  Contactar nuestro soporte
                </Link>
              </li>
            </ul>
          </div>

          <div className={styles.testCards}>
            <h3>Tarjetas de Prueba</h3>
            <div className={styles.cardList}>
              <div className={styles.cardItem}>
                <strong>Éxito:</strong> <code>4242 4242 4242 4242</code>
              </div>
              <div className={styles.cardItem}>
                <strong>Declinada:</strong> <code>4000 0000 0000 0002</code>
              </div>
              <div className={styles.cardItem}>
                <strong>Autenticación:</strong> <code>4000 0025 0000 3155</code>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
