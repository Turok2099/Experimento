"use client";

/**
 * Componente de ejemplo para demostrar el uso de Stripe
 * Puedes usar este componente como referencia o integrarlo en tu aplicación
 */

import React, { useState } from "react";
import StripePayment from "./StripePayment";
import styles from "./PaymentExample.module.scss";

interface PaymentExampleProps {
  className?: string;
}

const PaymentExample: React.FC<PaymentExampleProps> = ({ className = "" }) => {
  const [paymentStatus, setPaymentStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [paymentMessage, setPaymentMessage] = useState("");

  // Datos de ejemplo para el pago
  const examplePayment = {
    amount: 20, // $20.00 USD
    currency: "usd",
    description: "Membresía Premium - TrainUp Gym",
    planId: "premium-plan",
    userId: "example-user-id",
  };

  /**
   * Maneja el éxito del pago
   */
  const handlePaymentSuccess = (paymentId: string) => {
    setPaymentStatus("success");
    setPaymentMessage(`¡Pago exitoso! ID de transacción: ${paymentId}`);

    // Aquí podrías redirigir al usuario o mostrar una confirmación
    console.log("Pago exitoso:", paymentId);
  };

  /**
   * Maneja errores del pago
   */
  const handlePaymentError = (error: string) => {
    setPaymentStatus("error");
    setPaymentMessage(`Error en el pago: ${error}`);

    console.error("Error en el pago:", error);
  };

  /**
   * Resetea el estado del pago
   */
  const resetPayment = () => {
    setPaymentStatus("idle");
    setPaymentMessage("");
  };

  return (
    <div className={`${styles.paymentExample} ${className}`}>
      <div className={styles.exampleHeader}>
        <h2>
          Estas a punto de formar parte
          <br /> del equipo TrainUp
        </h2>
      </div>

      {/* Mostrar estado del pago */}
      {paymentStatus !== "idle" && (
        <div className={`${styles.paymentStatus} ${styles[paymentStatus]}`}>
          <div className={styles.statusContent}>
            <div className={styles.statusIcon}>
              {paymentStatus === "success" ? "✅" : "❌"}
            </div>
            <div className={styles.statusMessage}>{paymentMessage}</div>
            <button onClick={resetPayment} className={styles.resetButton}>
              Realizar otro pago
            </button>
          </div>
        </div>
      )}

      {/* Componente de pago */}
      {paymentStatus === "idle" && (
        <StripePayment
          amount={examplePayment.amount}
          currency={examplePayment.currency}
          description={examplePayment.description}
          planId={examplePayment.planId}
          userId={examplePayment.userId}
          onPaymentSuccess={handlePaymentSuccess}
          onPaymentError={handlePaymentError}
        />
      )}
    </div>
  );
};

export default PaymentExample;
