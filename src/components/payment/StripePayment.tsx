"use client";

/**
 * Componente de pago con Stripe
 * Maneja la interfaz de usuario para procesar pagos
 */

import React, { useState, useEffect } from "react";
import { stripeService, PaymentData } from "../../services/StripeService";
import styles from "./StripePayment.module.scss";

interface StripePaymentProps {
  amount: number;
  currency: string;
  description: string;
  planId: string;
  userId: string;
  onPaymentSuccess?: (sessionId: string) => void;
  onPaymentError?: (error: string) => void;
  className?: string;
}

interface FormData {
  email: string;
  paymentMethod: string;
}

const StripePayment: React.FC<StripePaymentProps> = ({
  amount,
  currency,
  description,
  planId,
  userId,
  onPaymentSuccess,
  onPaymentError,
  className = "",
}) => {
  // Estados del componente
  const [formData, setFormData] = useState<FormData>({
    email: "",
    paymentMethod: "card",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [availableMethods, setAvailableMethods] = useState<
    Array<{ id: string; name: string; type: string; icon?: string }>
  >([]);

  // Cargar métodos de pago disponibles al montar el componente
  useEffect(() => {
    const methods = stripeService.getAvailablePaymentMethods();
    setAvailableMethods(methods);
  }, []);

  /**
   * Maneja cambios en los inputs del formulario
   */
  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Limpiar errores cuando el usuario empieza a escribir
    if (errors.length > 0) {
      setErrors([]);
    }
  };

  /**
   * Valida el formulario antes de enviar
   */
  const validateForm = (): boolean => {
    const newErrors: string[] = [];

    if (!formData.email.trim()) {
      newErrors.push("El email es requerido");
    } else if (!isValidEmail(formData.email)) {
      newErrors.push("El email no tiene un formato válido");
    }

    if (!formData.paymentMethod) {
      newErrors.push("Debes seleccionar un método de pago");
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  /**
   * Valida formato de email
   */
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  /**
   * Procesa el pago
   */
  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors([]);

    try {
      // Preparar datos de pago
      const paymentData: PaymentData = {
        amount,
        currency,
        description,
        planId,
        userId,
      };

      // Crear sesión de pago
      const result = await stripeService.createPaymentSession(paymentData);

      if (result.success && result.url) {
        // Redirigir a Stripe Checkout
        await stripeService.redirectToCheckout(result.url);

        // Notificar éxito (opcional, ya que se redirige)
        onPaymentSuccess?.(result.sessionId || "");
      } else {
        onPaymentError?.(result.error || "Error desconocido");
      }
    } catch (error) {
      console.error("Error al procesar pago:", error);
      const friendlyError = stripeService.getFriendlyErrorMessage(error);
      onPaymentError?.(friendlyError);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Renderiza el método de pago seleccionado
   */
  const renderPaymentMethod = () => {
    const method = availableMethods.find(
      (m) => m.id === formData.paymentMethod
    );

    if (!method) return null;

    return (
      <div className={styles.paymentMethod}>
        <div className={styles.methodIcon}>{method.icon || "💳"}</div>
        <div className={styles.methodInfo}>
          <h4>{method.name}</h4>
          <p>Pago seguro con Stripe</p>
        </div>
      </div>
    );
  };

  return (
    <div className={`${styles.stripePayment} ${className}`}>
      <div className={styles.paymentHeader}>
        <h3>Completar Pago</h3>
        <div className={styles.amount}>
          {stripeService.formatAmount(amount, currency)}
        </div>
      </div>

      <form onSubmit={handlePayment} className={styles.paymentForm}>
        {/* Información del producto */}
        <div className={styles.productInfo}>
          <h4>{description}</h4>
          <p>Plan seleccionado: {planId}</p>
        </div>

        {/* Email */}
        <div className={styles.formGroup}>
          <label htmlFor="email">Email de facturación</label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            placeholder="tu@email.com"
            required
            disabled={isLoading}
          />
        </div>

        {/* Método de pago */}
        <div className={styles.formGroup}>
          <label>Método de pago</label>
          <div className={styles.paymentMethods}>
            {availableMethods.map((method) => (
              <div
                key={method.id}
                className={`${styles.paymentMethodOption} ${
                  formData.paymentMethod === method.id ? styles.selected : ""
                }`}
                onClick={() => handleInputChange("paymentMethod", method.id)}
              >
                <div className={styles.methodIcon}>{method.icon}</div>
                <span>{method.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Método seleccionado */}
        {renderPaymentMethod()}

        {/* Errores */}
        {errors.length > 0 && (
          <div className={styles.errors}>
            {errors.map((error, index) => (
              <div key={index} className={styles.error}>
                {error}
              </div>
            ))}
          </div>
        )}

        {/* Botón de pago */}
        <button type="submit" className={styles.payButton} disabled={isLoading}>
          {isLoading ? (
            <>
              <div className={styles.spinner}></div>
              Procesando...
            </>
          ) : (
            <>Pagar {stripeService.formatAmount(amount, currency)}</>
          )}
        </button>

        {/* Información de seguridad */}
        <div className={styles.securityInfo}>
          <div className={styles.securityIcon}>🔒</div>
          <p>
            Tu información está protegida con encriptación SSL de 256 bits.
            Stripe es PCI DSS compliant.
          </p>
        </div>
      </form>
    </div>
  );
};

export default StripePayment;
