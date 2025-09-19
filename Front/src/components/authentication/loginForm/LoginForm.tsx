"use client";
import React, { useState, useEffect } from "react";
import styles from "./loginForm.module.scss";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { ILoginErrors } from "@/types";
import { validateFormLogin } from "@/lib/validateAuthentication";
import { login } from "@/services/authService";
import { FcGoogle } from "react-icons/fc";
import { useSession, signIn } from "next-auth/react";
import Link from "next/link";

const LoginForm = () => {
  const { setUserData } = useAuth();
  const router = useRouter();
  const { data: session, status } = useSession();

  const [values, setValues] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<ILoginErrors>({});
  const [loading, setLoading] = useState(false);

  // Si ya hay sesión, redirige
  useEffect(() => {
    if (status === "authenticated") {
      console.log("🔐 Usuario autenticado, evaluando redirección...");
      console.log("📊 Datos de sesión:", {
        needsCompletion: session?.needsCompletion,
        backendJWT: !!session?.backendJWT,
        userData: session?.userData,
      });

      setUserData({ token: session?.backendJWT, user: session?.user });

      // Si necesita completar datos, redirigir a la página de completar
      if (session?.needsCompletion) {
        console.log("Redirigiendo a /complete-google");
        router.push("/complete-google");
      } else {
        console.log("Redirigiendo a home");
        router.push("/");
      }
    }
  }, [status, session, router, setUserData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateFormLogin(values);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setLoading(true);
    try {
      console.log("Enviando login con credenciales:", values.email);
      const response = await login(values);
      console.log("Respuesta del backend:", response);

      if (!response?.accessToken || !response?.user) {
        console.error("Respuesta inválida del backend", response);
        setErrors({ email: "Credenciales inválidas o respuesta incorrecta" });
        return;
      }

      console.log("Guardando sesión en AuthContext desde login()");
      setUserData({ token: response.accessToken, user: response.user });

      alert("Usuario logueado satisfactoriamente");
      router.push("/");
    } catch (error: any) {
      console.error("Error en login:", error);
      setErrors({ email: error.message || "Error en el inicio de sesión" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.contLoginForm}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.inputGroup}>
          <label className={styles.label} htmlFor="email">
            Correo electrónico
          </label>
          <input
            className={styles.input}
            type="email"
            id="email"
            name="email"
            placeholder="usuario@ejemplo.com"
            value={values.email}
            onChange={handleChange}
          />
          {errors.email && <p className={styles.error}>{errors.email}</p>}
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label} htmlFor="password">
            Contraseña
          </label>
          <input
            className={styles.input}
            type="password"
            id="password"
            name="password"
            placeholder=""
            value={values.password}
            onChange={handleChange}
          />
          {errors.password && <p className={styles.error}>{errors.password}</p>}
        </div>

        <div className={styles.buttonsContainer}>
          <button
            className={styles.buttonLogin}
            type="submit"
            disabled={loading}
          >
            {loading ? "Ingresando..." : "Ingresar"}
          </button>

          <button
            type="button"
            className={styles.googleLogin}
            onClick={() => signIn("google", { callbackUrl: "/" })}
          >
            <FcGoogle size={20} /> Ingresar con Google
          </button>
        </div>

        <div className={styles.registerMessage}>
          <p>Si no estás registrado en nuestra plataforma</p>
          <Link href="/register">Haz click aquí</Link>
          <p>y regístrate y haz parte de este cambio</p>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
