"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import AdvancedStripeElement from "@/components/payment/AdvancedStripeElement";
import styles from "./Subscription.module.scss";

export default function SubscriptionPage() {
  const router = useRouter();
  const { userData, loadingSession } = useAuth();
  const [clientSecret, setClientSecret] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreatingPayment, setIsCreatingPayment] = useState(false);

  // URL base de la API
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

  useEffect(() => {
    if (!loadingSession) {
      checkAuthentication();
    }
  }, [loadingSession, userData]);

  const checkAuthentication = async () => {
    try {
      console.log("🔍 Verificando autenticación...");
      console.log("👤 userData:", userData);
      console.log("🔑 Token:", userData?.token ? "Presente" : "Ausente");

      // Primero verificar conectividad con el servidor
      console.log("🌐 Verificando conectividad con:", `${apiUrl}/health`);

      try {
        const healthResponse = await fetch(`${apiUrl}/health`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!healthResponse.ok) {
          throw new Error(`Servidor no disponible: ${healthResponse.status}`);
        }

        const healthData = await healthResponse.json();
        console.log("✅ Servidor conectado:", healthData);
      } catch (healthError) {
        console.error("❌ Error de conectividad:", healthError);
        setError(
          "No se pudo conectar con el servidor. Verifica que el backend esté ejecutándose."
        );
        setLoading(false);
        return;
      }

      // Verificar si hay datos de usuario en el contexto
      if (!userData || !userData.token) {
        console.log("❌ No hay datos de usuario o token");
        setError("Debes iniciar sesión para suscribirte");
        setLoading(false);
        return;
      }

      // Verificar que el token sea válido haciendo una petición al backend
      console.log("📡 Verificando token con:", `${apiUrl}/users/profile`);

      const response = await fetch(`${apiUrl}/users/profile`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData.token}`,
        },
        credentials: "include",
      });

      console.log(
        "📊 Respuesta del perfil:",
        response.status,
        response.statusText
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("❌ Error del servidor:", errorData);

        // Si es error 401, limpiar la sesión y redirigir al login
        if (response.status === 401) {
          console.log("🔄 Limpiando sesión expirada...");
          localStorage.removeItem("userSession");
          // Forzar recarga del AuthContext
          window.location.href = "/login?redirect=/subscription";
          return;
        }

        setError("Tu sesión ha expirado. Por favor, inicia sesión nuevamente");
        setLoading(false);
        return;
      }

      const profileData = await response.json();
      console.log("✅ Perfil obtenido:", profileData);

      // Si llegamos aquí, el usuario está autenticado correctamente
      setLoading(false);

      // Crear PaymentIntent solo si está autenticado
      createPaymentIntent();
    } catch (error) {
      console.error("❌ Error verificando autenticación:", error);

      let errorMessage = "Error verificando tu sesión";

      if (error instanceof TypeError && error.message.includes("fetch")) {
        errorMessage =
          "No se pudo conectar con el servidor. Verifica tu conexión a internet.";
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      setError(errorMessage);
      setLoading(false);
    }
  };

  const createPaymentIntent = async () => {
    // PROTECCIÓN ROBUSTA CONTRA DUPLICADOS
    if (isCreatingPayment) {
      console.log(
        "⚠️ Ya se está creando un PaymentIntent, ignorando llamada duplicada"
      );
      return;
    }

    // Verificar que el usuario esté autenticado
    if (!userData?.token) {
      console.error("❌ No hay token de autenticación");
      setError("No estás autenticado. Por favor, inicia sesión nuevamente.");
      setLoading(false);
      return;
    }

    setIsCreatingPayment(true);
    setLoading(true);
    setError(null);

    try {
      console.log("🔍 Creando PaymentIntent...");
      console.log("📡 URL:", `${apiUrl}/payments/create-payment-intent`);
      console.log("🔑 Token:", userData?.token ? "Presente" : "Ausente");
      console.log("👤 Usuario:", userData?.user?.email || "No disponible");
      console.log("🛡️ Protección contra duplicados: ACTIVADA");

      const response = await fetch(`${apiUrl}/payments/create-payment-intent`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.token}`,
        },
        credentials: "include",
        body: JSON.stringify({
          amount: 20.0, // $20.00 USD
          currency: "usd",
          planId: "1ce2884e-c6e8-4105-8f14-5042a803c3f2", // Plan Premium
        }),
      });

      console.log(
        "📊 Respuesta del servidor:",
        response.status,
        response.statusText
      );

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch (parseError) {
          errorData = {
            message: `Error del servidor: ${response.status} ${response.statusText}`,
          };
        }
        console.error("❌ Error del servidor:", errorData);
        throw new Error(
          errorData.message || `Error del servidor: ${response.status}`
        );
      }

      const result = await response.json();
      console.log("✅ Respuesta exitosa:", result);

      if (result.success && result.data?.clientSecret) {
        setClientSecret(result.data.clientSecret);
        console.log("🎉 PaymentIntent creado exitosamente");
        setLoading(false);
      } else {
        throw new Error("No se recibió clientSecret del servidor");
      }
    } catch (error) {
      console.error("❌ Error creando PaymentIntent:", error);

      let errorMessage = "Error creando PaymentIntent";

      if (error instanceof TypeError && error.message.includes("fetch")) {
        errorMessage =
          "No se pudo conectar con el servidor. Verifica tu conexión a internet.";
      } else if (error instanceof Error) {
        if (
          error.message.includes("401") ||
          error.message.includes("Unauthorized")
        ) {
          errorMessage =
            "Tu sesión ha expirado. Por favor, inicia sesión nuevamente";
        } else if (
          error.message.includes("403") ||
          error.message.includes("Forbidden")
        ) {
          errorMessage = "No tienes permisos para realizar esta acción";
        } else if (
          error.message.includes("500") ||
          error.message.includes("Internal Server Error")
        ) {
          errorMessage =
            "Error interno del servidor. Por favor, intenta más tarde";
        } else {
          errorMessage = error.message;
        }
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
      setIsCreatingPayment(false);
    }
  };

  const handlePaymentSuccess = async (paymentIntent: any) => {
    console.log("Pago exitoso:", paymentIntent);

    try {
      // Confirmar el pago en el backend
      console.log("🔄 Confirmando pago en el backend...");
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
      const userSession = localStorage.getItem("userSession");
      const token = userSession ? JSON.parse(userSession).token : null;

      const confirmResponse = await fetch(`${apiUrl}/payments/confirm`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          paymentIntentId: paymentIntent.id,
        }),
      });

      if (confirmResponse.ok) {
        const confirmData = await confirmResponse.json();
        console.log("✅ Pago confirmado en el backend:", confirmData);

        // Verificar y crear suscripción si es necesario
        const statusResponse = await fetch(
          `${apiUrl}/payments/status/${paymentIntent.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (statusResponse.ok) {
          const statusData = await statusResponse.json();
          console.log("📊 Estado del pago y suscripción:", statusData);
        }
      } else {
        console.error("❌ Error confirmando pago en el backend");
        const errorData = await confirmResponse.json();
        console.error("📝 Detalles del error:", errorData);
      }
    } catch (error) {
      console.error("❌ Error en confirmación:", error);
    }

    // Redirigir a página de éxito
    router.push("/subscription-success");
  };

  const handlePaymentError = (error: string) => {
    console.error("Error en el pago:", error);
    setError(error);
  };

  const handleLoginRedirect = () => {
    router.push("/login");
  };

  if (loadingSession) {
    return (
      <div className={styles.contSubscriptionView}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Cargando sesión...</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={styles.contSubscriptionView}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Preparando tu suscripción...</p>
        </div>
      </div>
    );
  }

  if (!userData || !userData.token) {
    return (
      <div className={styles.contSubscriptionView}>
        <div className={styles.mainContent}>
          {/* Panel izquierdo - Card de bienvenida */}
          <div className={styles.welcomeCard}>
            <div className={styles.welcomeContent}>
              <h2 className={styles.welcomeTitle}>¡Únete a TrainUp!</h2>
              <p className={styles.welcomeSubtitle}>
                Accede a todos nuestros cursos y contenido premium para
                transformar tu vida.
              </p>
              <p className={styles.welcomeText}>
                ¡Inicia sesión y comienza tu transformación hoy mismo!
              </p>
            </div>
            <div className={styles.decorativeCircles}>
              <div className={styles.circle1}></div>
              <div className={styles.circle2}></div>
            </div>
          </div>

          {/* Panel derecho - Formulario de autenticación */}
          <div className={styles.formSection}>
            <div className={styles.authRequired}>
              <div className={styles.authIcon}>🔐</div>
              <h2>Inicia sesión para continuar</h2>
              <p>
                {error ||
                  "Necesitas estar autenticado para suscribirte a TrainUp"}
              </p>
              <button
                onClick={handleLoginRedirect}
                className={styles.loginButton}
              >
                Ir a Iniciar Sesión
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.contSubscriptionView}>
      <div className={styles.mainContent}>
        {/* Panel izquierdo - Plan Premium */}
        <div className={styles.leftSection}>
          <div className={styles.planCard}>
            <div className={styles.cardHeader}>
              <h3 className={styles.planName}>Plan TrainUp Plus</h3>
            </div>

            <div className={styles.welcomeMessage}>
              <p>
                Cada meta necesita un plan. <br /> Encuentra el tuyo y comienza
                tu transformación hoy mismo.
              </p>
            </div>

            <div className={styles.priceSection}>
              <span className={styles.currentPrice}>$20/mes</span>
              <span className={styles.originalPrice}>$30/mes</span>
            </div>

            <ul className={styles.planBenefits}>
              <li>
                <span className={styles.checkIcon}>✓</span> Acceso ilimitado a
                todas las clases
              </li>
              <li>
                <span className={styles.checkIcon}>✓</span> Entrenadores
                certificados
              </li>
              <li>
                <span className={styles.checkIcon}>✓</span> Uso de todas las
                máquinas y equipos
              </li>
              <li>
                <span className={styles.checkIcon}>✓</span> Acceso a
                entrenamientos personalizados
              </li>
              <li>
                <span className={styles.checkIcon}>✓</span> Agendamiento de
                clases
              </li>
            </ul>
          </div>
        </div>

        {/* Panel derecho - Resumen de pago */}
        <div className={styles.rightSection}>
          <div className={styles.paymentSection}>
            {error ? (
              <div className={styles.error}>
                <h3>Error</h3>
                <p>{error}</p>
                <button
                  onClick={createPaymentIntent}
                  className={styles.retryButton}
                >
                  Reintentar
                </button>
              </div>
            ) : clientSecret ? (
              <AdvancedStripeElement
                clientSecret={clientSecret}
                amount={20.0}
                currency="usd"
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
              />
            ) : (
              <div className={styles.loading}>
                <div className={styles.spinner}></div>
                <p>Preparando el formulario de pago...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
