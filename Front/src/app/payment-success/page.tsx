"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import styles from "./PaymentSuccess.module.scss";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Obtener parámetros de la URL
    const paymentIntent = searchParams.get("payment_intent");
    const paymentIntentClientSecret = searchParams.get(
      "payment_intent_client_secret"
    );

    if (paymentIntent) {
      setPaymentIntentId(paymentIntent);
    }

    // Simular carga de información del pago
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, [searchParams]);

  const handleBackToHome = () => {
    window.location.href = "/";
  };

  const handleViewSubscription = () => {
    // Redirigir a la página de suscripciones del usuario
    window.location.href = "/subscriptions";
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Verificando tu pago...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.mainContent}>
        {/* Panel izquierdo - Información principal */}
        <div className={styles.leftSection}>
          <div className={styles.successIcon}>
            <div className={styles.checkmark}>
              <div className={styles.checkmarkCircle}>
                <div className={styles.checkmarkStem}></div>
                <div className={styles.checkmarkKick}></div>
              </div>
            </div>
          </div>

          <h1 className={styles.title}>¡Pago Exitoso!</h1>

          <p className={styles.message}>
            Tu pago ha sido procesado correctamente. Gracias por tu compra.
          </p>

          <div className={styles.actions}>
            <button
              onClick={handleViewSubscription}
              className={styles.primaryButton}
            >
              Ver Mi Suscripción
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
          {paymentIntentId && (
            <div className={styles.paymentDetails}>
              <h3>Detalles del Pago</h3>
              <div className={styles.detailItem}>
                <span className={styles.label}>ID de Transacción:</span>
                <span className={styles.value}>{paymentIntentId}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.label}>Estado:</span>
                <span className={styles.status}>Completado</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.label}>Fecha:</span>
                <span className={styles.value}>
                  {new Date().toLocaleDateString("es-ES", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          )}

          <div className={styles.nextSteps}>
            <h3>Próximos Pasos</h3>
            <ul className={styles.stepsList}>
              <li>✅ Tu suscripción está activa</li>
              <li>📧 Recibirás un email de confirmación</li>
              <li>🎯 Puedes acceder a todas las funciones premium</li>
              <li>📱 Descarga la app para una mejor experiencia</li>
            </ul>
          </div>

          <div className={styles.support}>
            <p>
              ¿Tienes alguna pregunta?
              <Link href="/contact" className={styles.supportLink}>
                Contáctanos
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className={styles.container}>
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
            <p>Cargando...</p>
          </div>
        </div>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}
