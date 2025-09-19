/**
 * Servicio para integración con Stripe
 * Maneja la configuración inicial y métodos de pago
 */

import { loadStripe, Stripe, StripeElements } from "@stripe/stripe-js";

// Configuración de Stripe
const STRIPE_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

if (!STRIPE_PUBLISHABLE_KEY) {
  throw new Error(
    "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY no está configurada en las variables de entorno"
  );
}

/**
 * Tipos para Stripe
 */
export interface PaymentData {
  amount: number;
  currency: string;
  description: string;
  planId: string;
  userId: string;
}

export interface PaymentResponse {
  success: boolean;
  sessionId?: string;
  url?: string;
  error?: string;
}

export interface PaymentMethod {
  id: string;
  name: string;
  type: string;
  icon?: string;
}

/**
 * Clase principal del servicio de Stripe
 */
export class StripeService {
  private stripePromise: Promise<Stripe | null>;
  private publishableKey: string;

  constructor() {
    this.publishableKey = STRIPE_PUBLISHABLE_KEY || "";
    this.stripePromise = loadStripe(this.publishableKey);
  }

  /**
   * Obtiene la clave pública de Stripe
   */
  getPublishableKey(): string {
    return this.publishableKey;
  }

  /**
   * Obtiene la instancia de Stripe
   */
  async getStripe(): Promise<Stripe | null> {
    return this.stripePromise;
  }

  /**
   * Valida los datos de pago antes de procesar
   */
  validatePaymentData(data: PaymentData): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (!data.amount || data.amount <= 0) {
      errors.push("El monto debe ser mayor a 0");
    }

    if (!data.description || data.description.trim().length === 0) {
      errors.push("La descripción es requerida");
    }

    if (!data.planId || data.planId.trim().length === 0) {
      errors.push("El ID del plan es requerido");
    }

    if (!data.userId || data.userId.trim().length === 0) {
      errors.push("El ID del usuario es requerido");
    }

    if (!data.currency || data.currency.trim().length === 0) {
      errors.push("La moneda es requerida");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Crea un PaymentIntent para Stripe Elements
   */
  async createPaymentIntent(data: {
    amount: number;
    currency: string;
    planId: string;
  }): Promise<{ success: boolean; clientSecret?: string; error?: string }> {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
      const userSession = localStorage.getItem("userSession");
      const token = userSession ? JSON.parse(userSession).token : null;

      if (!token) {
        throw new Error(
          "No hay token de autenticación. Por favor, inicia sesión."
        );
      }

      const response = await fetch(`${apiUrl}/payments/create-payment-intent`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: data.amount,
          currency: data.currency,
          planId: data.planId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al crear PaymentIntent");
      }

      const result = await response.json();

      if (result.success && result.data?.clientSecret) {
        return {
          success: true,
          clientSecret: result.data.clientSecret,
        };
      } else {
        throw new Error("No se recibió clientSecret del servidor");
      }
    } catch (error) {
      console.error("Error creando PaymentIntent:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error inesperado",
      };
    }
  }

  /**
   * Crear y confirmar pago automáticamente (nuevo flujo)
   */
  async createAndConfirmPayment(data: {
    amount: number;
    currency: string;
    planId: string;
  }): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
      const userSession = localStorage.getItem("userSession");
      const token = userSession ? JSON.parse(userSession).token : null;

      if (!token) {
        throw new Error(
          "No hay token de autenticación. Por favor, inicia sesión."
        );
      }

      const response = await fetch(`${apiUrl}/payments/create-and-confirm`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: data.amount,
          currency: data.currency,
          planId: data.planId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al procesar el pago");
      }

      const result = await response.json();

      if (result.success) {
        return {
          success: true,
          data: result.data,
        };
      } else {
        throw new Error(result.message || "Error al procesar el pago");
      }
    } catch (error) {
      console.error("Error creando y confirmando pago:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error inesperado",
      };
    }
  }

  /**
   * Crea una sesión de pago llamando al backend
   */
  async createPaymentSession(
    paymentData: PaymentData
  ): Promise<PaymentResponse> {
    try {
      // Validar datos
      const validation = this.validatePaymentData(paymentData);

      if (!validation.isValid) {
        return {
          success: false,
          error: `Datos inválidos: ${validation.errors.join(", ")}`,
        };
      }

      // Llamar al backend para crear la sesión de Stripe
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
      const response = await fetch(
        `${apiUrl}/payments/create-subscription-payment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${
              localStorage.getItem("userSession")
                ? JSON.parse(localStorage.getItem("userSession")!).token
                : null
            }`,
          },
          body: JSON.stringify({
            planId: paymentData.planId,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Error al crear la sesión de pago"
        );
      }

      const result = await response.json();

      if (result.success && result.data) {
        return {
          success: true,
          sessionId: result.data.sessionId,
          url: result.data.url,
        };
      } else {
        return {
          success: false,
          error: "Error al crear la sesión de pago",
        };
      }
    } catch (error) {
      console.error("Error al crear sesión de pago:", error);
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Error interno al procesar el pago",
      };
    }
  }

  /**
   * Redirige al usuario a la página de pago de Stripe
   */
  async redirectToCheckout(sessionUrl: string): Promise<void> {
    if (typeof window !== "undefined") {
      window.location.href = sessionUrl;
    }
  }

  /**
   * Obtiene información de una sesión de pago
   */
  async getPaymentInfo(sessionId: string): Promise<any> {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
      const response = await fetch(
        `${apiUrl}/payments/payment-info/${sessionId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${
              localStorage.getItem("userSession")
                ? JSON.parse(localStorage.getItem("userSession")!).token
                : null
            }`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Error al obtener información del pago");
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error("Error al obtener información del pago:", error);
      throw error;
    }
  }

  /**
   * Formatea el monto para mostrar en la UI
   */
  formatAmount(amount: number, currency: string = "USD"): string {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(amount);
  }

  /**
   * Obtiene métodos de pago disponibles
   */
  getAvailablePaymentMethods(): PaymentMethod[] {
    return [
      {
        id: "card",
        name: "Tarjeta de Crédito/Débito",
        type: "card",
        icon: "💳",
      },
      {
        id: "apple_pay",
        name: "Apple Pay",
        type: "wallet",
        icon: "🍎",
      },
      {
        id: "google_pay",
        name: "Google Pay",
        type: "wallet",
        icon: "📱",
      },
    ];
  }

  /**
   * Valida si el navegador soporta Apple Pay
   */
  isApplePaySupported(): boolean {
    if (typeof window === "undefined") return false;
    return "ApplePaySession" in window;
  }

  /**
   * Valida si el navegador soporta Google Pay
   */
  isGooglePaySupported(): boolean {
    if (typeof window === "undefined") return false;
    return "google" in window && "payments" in (window as any).google;
  }

  /**
   * Obtiene el estado de un pago basado en el status de Stripe
   */
  getPaymentStatusText(status: string): string {
    const statusMap: Record<string, string> = {
      paid: "Pagado",
      unpaid: "No pagado",
      no_payment_required: "No requiere pago",
      processing: "Procesando",
      requires_payment_method: "Requiere método de pago",
      requires_confirmation: "Requiere confirmación",
      requires_action: "Requiere acción",
      canceled: "Cancelado",
    };

    return statusMap[status] || status;
  }

  /**
   * Maneja errores de Stripe de forma amigable
   */
  getFriendlyErrorMessage(error: any): string {
    if (typeof error === "string") {
      return error;
    }

    if (error?.code) {
      const errorMessages: Record<string, string> = {
        card_declined:
          "Tu tarjeta fue rechazada. Por favor, intenta con otra tarjeta.",
        expired_card:
          "Tu tarjeta ha expirado. Por favor, usa una tarjeta válida.",
        incorrect_cvc: "El código de seguridad de tu tarjeta es incorrecto.",
        processing_error:
          "Hubo un error procesando tu tarjeta. Por favor, intenta de nuevo.",
        authentication_required: "Tu banco requiere autenticación adicional.",
        insufficient_funds: "No hay fondos suficientes en tu tarjeta.",
      };

      return (
        errorMessages[error.code] ||
        "Hubo un error con tu pago. Por favor, intenta de nuevo."
      );
    }

    return "Hubo un error inesperado. Por favor, intenta de nuevo.";
  }
}

// Instancia singleton del servicio
export const stripeService = new StripeService();
