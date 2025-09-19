"use client";

import { validateFormRegister } from "@/lib/validateAuthentication";
import { register } from "@/services/authService";
import { IRegisterErrors, IRegisterProps } from "@/types";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import styles from "./registerForm.module.scss";
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";

const initialForm: IRegisterProps = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  address: "",
  phone: "",
};

const RegisterForm: React.FC = () => {
  const [formData, setFormData] = useState<IRegisterProps>(initialForm);
  const [errors, setErrors] = useState<IRegisterErrors>({});
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validationErrors = validateFormRegister(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { confirmPassword: _, ...dataToSend } = formData; // Omitie confirmPassword
      try {
        await register(dataToSend);
        alert("Usuario registrado exitosamente");
        router.push("/login");
      } catch (error: any) {
        console.error("Error en registro:", error);
        alert(`Error en el registro: ${error.message}`);
      }
    }
  };

  return (
    <div className={styles.contRegister}>
      <form action="" className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.inputGroup}>
          <label className={styles.label} htmlFor="name">
            Nombre
          </label>
          <input
            className={styles.input}
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Juan Pérez"
          />
          {errors.name && <p className={styles.error}>{errors.name}</p>}
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label} htmlFor="email">
            Correo electrónico
          </label>
          <input
            className={styles.input}
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="usuario@ejemplo.com"
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
            value={formData.password}
            onChange={handleChange}
            placeholder=""
          />
          {errors.password && <p className={styles.error}>{errors.password}</p>}
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label} htmlFor="confirmPassword">
            Confirmar Contraseña
          </label>
          <input
            className={styles.input}
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder=""
          />
          {errors.confirmPassword && (
            <p className={styles.error}>{errors.confirmPassword}</p>
          )}
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label} htmlFor="address">
            Dirección
          </label>
          <input
            className={styles.input}
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Ingresa tu dirección"
          />
          {errors.address && <p className={styles.error}>{errors.address}</p>}
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label} htmlFor="phone">
            Teléfono
          </label>
          <input
            className={styles.input}
            type="text"
            id="phone"
            name="phone"
            placeholder="Ingresa tu número telefónico"
            value={formData.phone}
            onChange={handleChange}
          />
          {errors.phone && <p className={styles.error}>{errors.phone}</p>}
        </div>


        <button className={styles.buttonRegister} type="submit">
          Registrarse
        </button>
          <button
            type="button"
            className={styles.googleLogin}
            onClick={() => signIn("google", { callbackUrl: "/" })}
          >
            <FcGoogle size={20} /> Registrarse con Google
          </button>


        <div className={styles.loginMessage}>
          <p>Si ya estás registrado, inicia sesión</p>
          <Link href="/login">Haz click aquí</Link>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;
