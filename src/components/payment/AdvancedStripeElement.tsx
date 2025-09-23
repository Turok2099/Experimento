"use client";

import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";
import styles from "./AdvancedStripeElement.module.scss";

interface AdvancedStripeElementProps {
  clientSecret: string;
  amount: number;
  currency: string;
  onSuccess?: (paymentIntent: any) => void;
  onError?: (error: string) => void;
}

// Componente interno que usa los hooks de Stripe
function PaymentForm({
  amount,
  currency,
  onSuccess,
  onError,
}: Omit<AdvancedStripeElementProps, "clientSecret">) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting) {
      return;
    }

    if (!stripe || !elements) {
      setError("Stripe no está inicializado correctamente");
      return;
    }

    try {
      setIsSubmitting(true);
      setLoading(true);
      setError(null);

      // Confirmar el pago usando los hooks de Stripe
      const { error: stripeError, paymentIntent } = await stripe.confirmPayment(
        {
          elements,
          confirmParams: {
            return_url: `${window.location.origin}/subscription-success`,
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
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
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
          disabled={loading || isSubmitting || !stripe}
          className={styles.payButton}
        >
          {loading || isSubmitting ? (
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

export default function AdvancedStripeElement({
  clientSecret,
  amount,
  currency,
  onSuccess,
  onError,
}: AdvancedStripeElementProps) {
  const stripePromise = loadStripe(
    "pk_test_51S8YG32RLVEWGhyiYLH8prATvd3gL6OYS89I8xRvGljKmfcfJ1vTGhMmpVgKbvZqOGKG3Y1MDVg6PNPa4Ble2jhU00Si8SrZWY"
  );

  const appearance = {
    theme: "night" as const,
    variables: {
      colorPrimary: "#edcc36",
      colorBackground: "rgba(0, 0, 0, 0.3)",
      colorText: "#ffffff",
      colorDanger: "#ff6b6b",
      colorSuccess: "#4ade80",
      fontFamily: "Arial, system-ui, sans-serif",
      spacingUnit: "4px",
      borderRadius: "15px",
      colorTextSecondary: "rgba(255, 255, 255, 0.8)",
      colorTextPlaceholder: "rgba(255, 255, 255, 0.6)",
    },
  };

  if (!clientSecret) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Preparando el formulario de pago...</p>
        </div>
      </div>
    );
  }

  return (
    <Elements stripe={stripePromise} options={{ clientSecret, appearance }}>
      <PaymentForm
        amount={amount}
        currency={currency}
        onSuccess={onSuccess}
        onError={onError}
      />
    </Elements>
  );
}
