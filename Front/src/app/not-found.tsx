"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "@/styles/NotFoundView.module.scss";

export default function NotFound() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (countdown <= 0) {
      router.push("/");
      return;
    }
    const timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown, router]);

  return (
    <div className={styles.notfound}>
      <h1 className={styles.title}>404 - Página no encontrada</h1>
      <p className={styles.message}>
        Redirigiendo al inicio en {countdown} segundos...
      </p>
    </div>
  );
}
