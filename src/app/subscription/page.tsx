"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import AdvancedStripeElement from "@/components/payment/AdvancedStripeElement";
import { useActivePlans } from "@/hooks/useActivePlans";
import { PlanDto } from "@/types";
import styles from "./Subscription.module.scss";

export default function SubscriptionPage() {
  const router = useRouter();
  const { userData, loadingSession } = useAuth();
  const [clientSecret, setClientSecret] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreatingPayment, setIsCreatingPayment] = useState(false);
  const [subscriptionInfo, setSubscriptionInfo] = useState<any>(null);
  const [selectedPlan, setSelectedPlan] = useState<PlanDto | null>(null);

  // Hook para obtener planes activos
  const { plans: activePlans, loading: plansLoading } = useActivePlans();

  // URL base de la API
  const apiUrl =
    "https://back-c2meoxp3c-jorge-castros-projects-839066ef.vercel.app";

  useEffect(() => {
    if (!loadingSession) {
      checkAuthentication();
    }
  }, [loadingSession, userData]);

  const getSubscriptionInfo = async () => {
    try {
      console.log("📊 Obteniendo información de vigencia del plan...");

      // Usar endpoint de prueba temporalmente
      const response = await fetch(
        `${apiUrl}/health/subscription-info-test/${userData?.user?.email}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("✅ Información de suscripción obtenida:", data);
        setSubscriptionInfo(data.subscription);
        return data.subscription;
      } else {
        console.log("ℹ️ No hay suscripción activa o error:", response.status);
        return null;
      }
    } catch (error) {
      console.error("❌ Error obteniendo información de suscripción:", error);
      return null;
    }
  };

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

      // Verificar si ya tiene una suscripción activa
      const subscriptionData = await getSubscriptionInfo();

      if (subscriptionData && subscriptionData.is_active) {
        // Usuario ya tiene suscripción activa
        setError(
          `✅ Ya tienes una suscripción activa. Tu suscripción está vigente y activa.`
        );
        setLoading(false);
        return;
      }

      // Crear PaymentIntent solo si no tiene suscripción activa
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
      console.log("🔑 Token completo:", userData?.token);
      console.log("👤 Usuario:", userData?.user?.email || "No disponible");
      console.log("👤 Usuario completo:", userData?.user);
      console.log("🛡️ Protección contra duplicados: ACTIVADA");

      const response = await fetch(`${apiUrl}/payments/create-payment-intent`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.token}`,
        },
        credentials: "include",
        body: JSON.stringify({
          amount: selectedPlan?.price || 20.0, // Precio del plan seleccionado
          currency: "usd",
          planId: selectedPlan?.id || "1ce2884e-c6e8-4105-8f14-5042a803c3f2", // ID del plan seleccionado
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
      console.log("✅ Respuesta del servidor:", result);

      if (result.success && result.data?.clientSecret) {
        setClientSecret(result.data.clientSecret);
        console.log("🎉 PaymentIntent creado exitosamente");
        setLoading(false);
      } else if (result.success === false && result.message) {
        // Manejar caso cuando el usuario ya tiene un pago activo
        console.log("ℹ️ Usuario ya tiene pago activo:", result.message);
        setError(`✅ ${result.message}. Tu suscripción está activa.`);
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
      const apiUrl =
        "https://back-c2meoxp3c-jorge-castros-projects-839066ef.vercel.app";
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

  // Si no hay usuario autenticado, el middleware ya redirigió a /register
  // Este código no debería ejecutarse nunca, pero lo mantenemos por seguridad
  if (!userData || !userData.token) {
    return (
      <div className={styles.contSubscriptionView}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Redirigiendo...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.contSubscriptionView}>
      <div className={styles.mainContent}>
        {/* Panel izquierdo - Planes Disponibles */}
        <div className={styles.leftSection}>
          <div className={styles.plansContainer}>
            {plansLoading ? (
              <div className={styles.loading}>
                <div className={styles.spinner}></div>
                <p>Cargando planes disponibles...</p>
              </div>
            ) : activePlans.length === 0 ? (
              <div className={styles.noPlans}>
                <p>No hay planes disponibles en este momento.</p>
              </div>
            ) : (
              <div className={styles.plansList}>
                {activePlans.map((plan) => (
                  <div
                    key={plan.id}
                    className={`${styles.planCard} ${
                      selectedPlan?.id === plan.id ? styles.selected : ""
                    }`}
                    onClick={() => setSelectedPlan(plan)}
                  >
                    <div className={styles.cardHeader}>
                      <h3 className={styles.planName}>{plan.name}</h3>
                    </div>

                    <div className={styles.priceSection}>
                      <span className={styles.currentPrice}>
                        ${plan.price}/mes
                      </span>
                    </div>

                    <div className={styles.planDescription}>
                      <p>{plan.description}</p>
                    </div>

                    <div className={styles.planDetails}>
                      <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>Duración:</span>
                        <span className={styles.detailValue}>
                          {plan.durationDays} días
                        </span>
                      </div>
                    </div>

                    <ul className={styles.planBenefits}>
                      <li>
                        <span className={styles.checkIcon}>✓</span> Acceso
                        ilimitado a todas las clases
                      </li>
                      <li>
                        <span className={styles.checkIcon}>✓</span> Entrenadores
                        certificados
                      </li>
                      <li>
                        <span className={styles.checkIcon}>✓</span> Uso de todas
                        las máquinas y equipos
                      </li>
                      <li>
                        <span className={styles.checkIcon}>✓</span> Acceso a
                        entrenamientos personalizados
                      </li>
                      <li>
                        <span className={styles.checkIcon}>✓</span> Agendamiento
                        de clases
                      </li>
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Panel derecho - Resumen de pago */}
        <div className={styles.rightSection}>
          <div className={styles.paymentSection}>
            {error ? (
              <div className={styles.subscriptionInfo}>
                <div className={styles.infoIcon}>✅</div>
                <h3>Suscripción Activa</h3>
                <p>Tu suscripción está vigente y activa</p>
                <div className={styles.subscriptionDetails}>
                  <p>
                    <strong>Plan:</strong>{" "}
                    {subscriptionInfo?.plan_name ||
                      selectedPlan?.name ||
                      "TrainUp Plus"}
                  </p>
                  <p>
                    <strong>Precio:</strong> $
                    {subscriptionInfo?.price || selectedPlan?.price || "20.00"}{" "}
                    {subscriptionInfo?.currency || "USD"}
                  </p>
                  <p>
                    <strong>Vence:</strong>{" "}
                    {subscriptionInfo?.end_at
                      ? new Date(subscriptionInfo.end_at).toLocaleDateString(
                          "es-ES",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )
                      : "21 de octubre de 2025"}
                  </p>
                  <p>
                    <strong>Estado:</strong>{" "}
                    {subscriptionInfo?.status || "Activo"}
                  </p>
                </div>
                <button
                  onClick={() => router.push("/userDashboard")}
                  className={styles.dashboardButton}
                >
                  Ir a Mi Dashboard
                </button>
              </div>
            ) : !selectedPlan ? (
              <div className={styles.selectPlanMessage}>
                <div className={styles.infoIcon}>ℹ️</div>
                <h3>Selecciona un Plan</h3>
                <p>
                  Elige el plan que mejor se adapte a tus necesidades para
                  continuar con el pago.
                </p>
              </div>
            ) : clientSecret ? (
              <AdvancedStripeElement
                clientSecret={clientSecret}
                amount={selectedPlan.price}
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
