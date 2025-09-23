"use client";

/**
 * Componente de ejemplo para mostrar cómo usar StripePayment
 * Reemplaza el PaymentExample.tsx anterior
 */

import React, { useState } from "react";
import StripePayment from "./StripePayment";
import styles from "./StripePaymentExample.module.scss";

const StripePaymentExample: React.FC = () => {
  const [paymentResult, setPaymentResult] = useState<{
    success: boolean;
    message: string;
    sessionId?: string;
  } | null>(null);

  // Datos de ejemplo para el pago
  const paymentData = {
    amount: 29.99,
    currency: "USD",
    description: "Suscripción Premium - TrainUp",
    planId: "premium-monthly",
    userId: "user-123-example",
  };

  const handlePaymentSuccess = (sessionId: string) => {
    setPaymentResult({
      success: true,
      message: "¡Pago procesado exitosamente! Redirigiendo a Stripe...",
      sessionId,
    });
  };

  const handlePaymentError = (error: string) => {
    setPaymentResult({
      success: false,
      message: `Error en el pago: ${error}`,
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Ejemplo de Pago con Stripe</h1>
        <p>
          Este es un ejemplo de cómo integrar pagos con Stripe en tu aplicación
        </p>
      </div>

      <div className={styles.content}>
        {/* Información del producto */}
        <div className={styles.productCard}>
          <h2>Plan Premium</h2>
          <div className={styles.price}>
            ${paymentData.amount} {paymentData.currency}
          </div>
          <ul className={styles.features}>
            <li>✅ Acceso completo a todas las clases</li>
            <li>✅ Entrenamientos personalizados</li>
            <li>✅ Soporte prioritario</li>
            <li>✅ Sin anuncios</li>
            <li>✅ Acceso a contenido exclusivo</li>
          </ul>
        </div>

        {/* Componente de pago */}
        <div className={styles.paymentSection}>
          <StripePayment
            amount={paymentData.amount}
            currency={paymentData.currency}
            description={paymentData.description}
            planId={paymentData.planId}
            userId={paymentData.userId}
            onPaymentSuccess={handlePaymentSuccess}
            onPaymentError={handlePaymentError}
          />
        </div>

        {/* Resultado del pago */}
        {paymentResult && (
          <div
            className={`${styles.result} ${
              paymentResult.success ? styles.success : styles.error
            }`}
          >
            <div className={styles.resultIcon}>
              {paymentResult.success ? "✅" : "❌"}
            </div>
            <div className={styles.resultMessage}>
              <h3>{paymentResult.success ? "¡Éxito!" : "Error"}</h3>
              <p>{paymentResult.message}</p>
              {paymentResult.sessionId && (
                <p className={styles.sessionId}>
                  Session ID: {paymentResult.sessionId}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Información adicional */}
        <div className={styles.info}>
          <h3>Información importante:</h3>
          <ul>
            <li>Este es un ejemplo con datos de prueba</li>
            <li>Los pagos se procesan de forma segura con Stripe</li>
            <li>No se realizarán cargos reales en modo de prueba</li>
            <li>Para usar en producción, configura tus claves de Stripe</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default StripePaymentExample;
