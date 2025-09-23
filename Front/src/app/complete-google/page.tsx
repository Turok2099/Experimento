"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import GoogleCompleteForm from "@/components/authentication/googleCompleteForm/GoogleCompleteForm";

export default function CompleteGooglePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === "loading") return; // Aún cargando

    if (status === "unauthenticated") {
      // No está autenticado, redirigir al login
      router.push("/login");
      return;
    }

    if (session?.needsCompletion === false) {
      // Ya completó el registro, redirigir al home
      router.push("/");
      return;
    }

    setIsLoading(false);
  }, [session, status, router]);

  if (isLoading || status === "loading") {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <div>Cargando...</div>
      </div>
    );
  }

  if (!session?.user) {
    return null;
  }

  return <GoogleCompleteForm user={session.user} />;
}
