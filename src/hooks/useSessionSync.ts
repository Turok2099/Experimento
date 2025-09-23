"use client";
import { useSession } from "next-auth/react";
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export const useSessionSync = () => {
  const { data: session, status } = useSession();
  const { userData, setUserData } = useAuth();
  const router = useRouter();

  useEffect(() => {
    console.log("🔄 Sincronizando sesión con AuthContext...", {
      status,
      hasSession: !!session,
      hasBackendJWT: !!session?.backendJWT,
      hasUserData: !!session?.userData,
      needsCompletion: session?.needsCompletion,
      hasAuthContextUser: !!userData,
    });

    // Prioridad 1: Si NextAuth tiene datos completos, usar esos
    if (
      status === "authenticated" &&
      session?.backendJWT &&
      session?.userData
    ) {
      const newUserData = {
        token: session.backendJWT,
        user: session.userData,
      };

      const hasChanged =
        !userData ||
        userData.token !== newUserData.token ||
        userData.user?.email !== newUserData.user?.email;

      if (hasChanged) {
        console.log("✅ Actualizando AuthContext con datos de NextAuth");
        setUserData(newUserData);

        // Redirección automática si necesita completar datos
        if (session?.needsCompletion) {
          console.log("🔄 Redirigiendo automáticamente a /complete-google");
          router.push("/complete-google");
        }
      }
    }
    // Prioridad 2: Si NextAuth no está autenticado pero AuthContext tiene datos, mantenerlos
    else if (status === "unauthenticated" && userData) {
      console.log(
        "📝 Manteniendo AuthContext - usuario autenticado por formulario"
      );
      // No hacer nada, mantener los datos del AuthContext
    }
    // Prioridad 3: Si ambos están vacíos, no hacer nada (no limpiar automáticamente)
    else if (status === "unauthenticated" && !userData) {
      console.log("🚪 Ambos sistemas sin autenticación");
      // No limpiar automáticamente, dejar que el usuario maneje el logout
    }
  }, [status, session, userData, setUserData, router]);

  // Efecto adicional para detectar cambios en AuthContext (login normal)
  useEffect(() => {
    if (userData && status === "unauthenticated") {
      console.log("🎯 Detectado login normal - AuthContext actualizado:", {
        user: userData.user?.email,
        hasToken: !!userData.token,
      });
    }
  }, [userData, status]);

  // Efecto para redirección automática cuando la sesión cambia
  useEffect(() => {
    if (
      status === "authenticated" &&
      session?.needsCompletion &&
      session?.backendJWT &&
      session?.userData
    ) {
      // Solo redirigir si no estamos ya en la página de completar datos
      if (
        typeof window !== "undefined" &&
        !window.location.pathname.includes("/complete-google")
      ) {
        console.log(
          "🔄 Redirigiendo automáticamente a /complete-google (efecto de redirección)"
        );
        router.push("/complete-google");
      } else {
        console.log("📍 Ya estamos en /complete-google, no redirigiendo");
      }
    }
  }, [status, session, router]);

  return { session, status, userData };
};
