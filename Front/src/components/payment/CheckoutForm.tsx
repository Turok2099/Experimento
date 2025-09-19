"use client";

import React, { FormEvent, useState } from "react";
import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";
import styles from "./CheckoutForm.module.scss";

interface CheckoutFormProps {
  amount: number;
  currency: string;
  onSuccess?: (paymentIntent: any) => void;
  onError?: (error: string) => void;
}

export default function CheckoutForm({
  amount,
  currency,
  onSuccess,
  onError,
}: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      setError("Stripe no está cargado correctamente");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { error: stripeError, paymentIntent } = await stripe.confirmPayment(
        {
          elements,
          confirmParams: {
            return_url: `${window.location.origin}/payment-success`,
          },
          redirect: "if_required",
        }
      );

      if (stripeError) {
        console.error("Error de Stripe:", stripeError);
        setError(stripeError.message || "Error procesando el pago");
        onError?.(stripeError.message || "Error procesando el pago");
      } else if (paymentIntent && paymentIntent.status === "succeeded") {
        console.log("Pago exitoso:", paymentIntent);
        onSuccess?.(paymentIntent);
      }
    } catch (error) {
      console.error("Error inesperado:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Error inesperado";
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.checkoutForm}>
      <div className={styles.paymentSummary}>
        <h3>Resumen del Pago</h3>
        <div className={styles.amount}>
          {new Intl.NumberFormat("es-ES", {
            style: "currency",
            currency: currency.toUpperCase(),
          }).format(amount)}
        </div>
      </div>

      <form onSubmit={handleSubmit} className={styles.paymentForm}>
        <div className={styles.paymentElementContainer}>
          <PaymentElement
            options={{
              layout: {
                type: "tabs",
                defaultCollapsed: false,
              },
              business: {
                name: "TrainUp",
              },
              fields: {
                billingDetails: "auto",
              },
            }}
          />
        </div>

        {error && (
          <div className={styles.errorMessage}>
            <span className={styles.errorIcon}>⚠️</span>
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={!stripe || loading}
          className={styles.payButton}
        >
          {loading ? (
            <>
              <span className={styles.spinner}></span>
              Procesando...
            </>
          ) : (
            <>
              <span className={styles.lockIcon}>🔒</span>
              Pagar{" "}
              {new Intl.NumberFormat("es-ES", {
                style: "currency",
                currency: currency.toUpperCase(),
              }).format(amount)}
            </>
          )}
        </button>

        <div className={styles.securityInfo}>
          <div className={styles.securityIcon}>🛡️</div>
          <p>
            Tu información está protegida con encriptación SSL de 256 bits.
            Stripe es PCI DSS compliant.
          </p>
        </div>
      </form>
    </div>
  );
}
